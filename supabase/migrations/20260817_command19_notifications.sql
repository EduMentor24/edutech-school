begin;

alter table public.edutech_notifications
  add column if not exists school_year text,
  add column if not exists notification_type text not null default 'general',
  add column if not exists source_key text,
  add column if not exists is_active boolean not null default true;

-- Répare les notifications ciblées déjà présentes dont le type a été enregistré comme « all ».
update public.edutech_notifications
set
  target_type = case
    when target_user_id is not null then 'user'
    when target_level is not null and target_series is not null then 'level_series'
    when target_level is not null then 'level'
    else 'all'
  end,
  target_level = nullif(btrim(target_level), ''),
  target_series = nullif(btrim(target_series), '')
where target_type = 'all'
  and (target_user_id is not null or target_level is not null or target_series is not null);

-- Enrichit les anciennes notifications sans année à partir de l’année active réelle, sans création de donnée fictive.
update public.edutech_notifications as notification
set school_year = school_years.name
from (
  select name
  from public.edutech_school_years
  where status = 'active'
  order by starts_on desc nulls last
  limit 1
) as school_years
where notification.school_year is null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'edutech_notifications_target_type_check'
      and conrelid = 'public.edutech_notifications'::regclass
  ) then
    alter table public.edutech_notifications
      add constraint edutech_notifications_target_type_check
      check (target_type in ('all', 'level', 'level_series', 'user')) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'edutech_notifications_target_shape_check'
      and conrelid = 'public.edutech_notifications'::regclass
  ) then
    alter table public.edutech_notifications
      add constraint edutech_notifications_target_shape_check
      check (
        (target_type = 'all' and target_user_id is null and target_level is null and target_series is null)
        or (target_type = 'level' and target_user_id is null and target_level is not null and target_series is null)
        or (target_type = 'level_series' and target_user_id is null and target_level is not null and target_series is not null)
        or (target_type = 'user' and target_user_id is not null and target_level is null and target_series is null)
      ) not valid;
  end if;
end;
$$;

create unique index if not exists edutech_notification_reads_notification_user_key
  on public.edutech_notification_reads(notification_id, user_id);

create unique index if not exists edutech_notifications_source_key_unique
  on public.edutech_notifications(source_key)
  where source_key is not null;

create index if not exists edutech_notifications_target_lookup_idx
  on public.edutech_notifications(school_year, target_type, target_level, target_series, created_at desc)
  where is_active = true;

drop policy if exists edutech_notifications_all on public.edutech_notifications;
drop policy if exists edutech_notifications_admin_all on public.edutech_notifications;
drop policy if exists edutech_notifications_student_targeted_select on public.edutech_notifications;

create policy edutech_notifications_admin_all
on public.edutech_notifications
for all
to authenticated
using (public.is_edutech_admin())
with check (public.is_edutech_admin());

create policy edutech_notifications_student_targeted_select
on public.edutech_notifications
for select
to authenticated
using (
  not public.is_edutech_admin()
  and is_active = true
  and exists (
    select 1
    from public.profiles as profile
    where profile.id = auth.uid()
      and profile.is_active = true
      and profile.status = 'active'
      and (
        target_type = 'all'
        or (target_type = 'user' and target_user_id = profile.id)
        or (target_type = 'level' and target_level = profile.school_level)
        or (target_type = 'level_series' and target_level = profile.school_level and target_series = profile.series)
      )
  )
);

create or replace function public.admin_publish_notification(
  p_title text,
  p_body text,
  p_notification_type text,
  p_school_year text,
  p_target_type text,
  p_target_level text default null,
  p_target_series text default null,
  p_target_user_id uuid default null,
  p_content_type text default null,
  p_content_id uuid default null,
  p_route text default null,
  p_priority text default 'normal',
  p_source_key text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  notification_id uuid;
  year_name text;
begin
  if not public.is_edutech_admin() then
    raise exception 'Administrator role required';
  end if;

  if coalesce(btrim(p_title), '') = '' or coalesce(btrim(p_body), '') = '' then
    raise exception 'Notification title and body are required';
  end if;

  if p_target_type not in ('all', 'level', 'level_series', 'user') then
    raise exception 'Unsupported notification target';
  end if;

  if (p_target_type = 'all' and (p_target_user_id is not null or p_target_level is not null or p_target_series is not null))
     or (p_target_type = 'level' and (p_target_level is null or p_target_user_id is not null or p_target_series is not null))
     or (p_target_type = 'level_series' and (p_target_level is null or p_target_series is null or p_target_user_id is not null))
     or (p_target_type = 'user' and (p_target_user_id is null or p_target_level is not null or p_target_series is not null)) then
    raise exception 'Notification target fields are inconsistent';
  end if;

  select name into year_name
  from public.edutech_school_years
  where name = p_school_year
    and status = 'active'
  limit 1;

  if year_name is null then
    raise exception 'An active school year is required';
  end if;

  if p_target_type = 'user' and not exists (
    select 1 from public.profiles
    where id = p_target_user_id and is_active = true and status = 'active'
  ) then
    raise exception 'The target student account is not active';
  end if;

  if p_source_key is not null then
    select id into notification_id
    from public.edutech_notifications
    where source_key = p_source_key
    limit 1;
    if notification_id is not null then
      return notification_id;
    end if;
  end if;

  insert into public.edutech_notifications(
    title, body, published_by, target_type, target_user_id, target_level, target_series,
    content_type, content_id, route, priority, school_year, notification_type, source_key, is_active
  ) values (
    btrim(p_title), btrim(p_body), auth.uid(), p_target_type, p_target_user_id,
    nullif(btrim(p_target_level), ''), nullif(btrim(p_target_series), ''),
    nullif(btrim(p_content_type), ''), p_content_id, nullif(btrim(p_route), ''),
    coalesce(nullif(btrim(p_priority), ''), 'normal'), year_name,
    coalesce(nullif(btrim(p_notification_type), ''), 'general'), nullif(btrim(p_source_key), ''), true
  ) returning id into notification_id;

  perform public.schoolci_log_admin_action(
    'notification_published',
    'notification',
    notification_id::text,
    jsonb_build_object(
      'target_type', p_target_type,
      'target_level', p_target_level,
      'target_series', p_target_series,
      'school_year', year_name,
      'notification_type', coalesce(nullif(btrim(p_notification_type), ''), 'general')
    )
  );

  return notification_id;
end;
$$;

revoke execute on function public.admin_publish_notification(text, text, text, text, text, text, text, uuid, text, uuid, text, text, text) from public, anon;
grant execute on function public.admin_publish_notification(text, text, text, text, text, text, text, uuid, text, uuid, text, text, text) to authenticated;

revoke execute on function public.schoolci_log_admin_action(text, text, text, jsonb) from anon;

commit;
