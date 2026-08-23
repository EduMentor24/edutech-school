begin;

-- La table existante reste l’unique journal des demandes administratives.
-- Les nouvelles colonnes sont nullables afin de préserver toutes les demandes de classe déjà enregistrées.
alter table public.edutech_class_change_requests
  add column if not exists request_kind text not null default 'class_change',
  add column if not exists new_first_name text,
  add column if not exists new_last_name text,
  add column if not exists new_full_name text,
  add column if not exists new_avatar_url text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'edutech_class_change_requests_request_kind_check'
      and conrelid = 'public.edutech_class_change_requests'::regclass
  ) then
    alter table public.edutech_class_change_requests
      add constraint edutech_class_change_requests_request_kind_check
      check (request_kind in ('class_change', 'profile_change')) not valid;
  end if;
end;
$$;

create index if not exists edutech_class_change_requests_pending_profile_idx
  on public.edutech_class_change_requests(student_id, school_year_id, created_at desc)
  where status = 'pending' and request_kind = 'profile_change';

create table if not exists public.edutech_profile_change_events (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  school_year_id uuid not null references public.edutech_school_years(id),
  school_year text not null,
  change_kind text not null check (change_kind in ('student_direct', 'admin_direct', 'approved_request')),
  old_snapshot jsonb not null,
  new_snapshot jsonb not null,
  request_id uuid references public.edutech_class_change_requests(id) on delete set null,
  changed_by uuid not null,
  created_at timestamptz not null default now()
);

create unique index if not exists edutech_profile_change_one_student_direct_per_year
  on public.edutech_profile_change_events(student_id, school_year_id)
  where change_kind = 'student_direct';

create index if not exists edutech_profile_change_events_student_year_idx
  on public.edutech_profile_change_events(student_id, school_year_id, created_at desc);

alter table public.edutech_profile_change_events enable row level security;

drop policy if exists edutech_profile_change_events_select_owner_or_admin on public.edutech_profile_change_events;
create policy edutech_profile_change_events_select_owner_or_admin
on public.edutech_profile_change_events
for select
to authenticated
using (student_id = auth.uid() or public.is_edutech_admin());

-- Le client ne peut plus modifier directement les colonnes de profil : toutes les écritures passent par les RPC validées ci-dessous.
drop policy if exists edutech_profiles_update_policy on public.profiles;
create policy edutech_profiles_admin_self_update_policy
on public.profiles
for update
to authenticated
using (public.is_edutech_admin() and auth.uid() = id)
with check (public.is_edutech_admin() and auth.uid() = id);

create or replace function public.schoolci_guard_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() = old.id then
    if new.email is distinct from old.email
       or new.role is distinct from old.role
       or new.is_active is distinct from old.is_active
       or new.status is distinct from old.status
       or new.level_id is distinct from old.level_id
       or new.series_id is distinct from old.series_id
       or new.school_year is distinct from old.school_year
       or new.lv2_choice is distinct from old.lv2_choice then
      raise exception 'Ces informations de profil ne peuvent pas être modifiées par l’utilisateur' using errcode = '42501';
    end if;

    if old.role <> 'admin'
       and coalesce(current_setting('app.edutech_profile_change_authorized', true), 'false') <> 'true'
       and (new.first_name is distinct from old.first_name
            or new.last_name is distinct from old.last_name
            or new.full_name is distinct from old.full_name
            or new.avatar_url is distinct from old.avatar_url
            or new.school_level is distinct from old.school_level
            or new.series is distinct from old.series) then
      raise exception 'Use submit_profile_change to modify profile information' using errcode = '42501';
    end if;
  end if;

  return new;
end;
$$;

create or replace function public.edutech_profile_change_status()
returns table (
  active_school_year_id uuid,
  active_school_year text,
  direct_change_used boolean,
  pending_request_id uuid,
  pending_request_created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_year public.edutech_school_years;
begin
  if auth.uid() is null then
    raise exception 'Connexion requise' using errcode = '42501';
  end if;

  select * into v_year
  from public.edutech_school_years
  where status = 'active'
  order by starts_on desc nulls last, created_at desc
  limit 1;

  if not found then
    raise exception 'Aucune année scolaire active n’est configurée';
  end if;

  return query
  select
    v_year.id,
    v_year.name,
    exists (
      select 1
      from public.edutech_profile_change_events as event
      where event.student_id = auth.uid()
        and event.school_year_id = v_year.id
        and event.change_kind = 'student_direct'
    ),
    (
      select request.id
      from public.edutech_class_change_requests as request
      where request.student_id = auth.uid()
        and request.school_year_id = v_year.id
        and request.request_kind = 'profile_change'
        and request.status = 'pending'
      order by request.created_at desc
      limit 1
    ),
    (
      select request.created_at
      from public.edutech_class_change_requests as request
      where request.student_id = auth.uid()
        and request.school_year_id = v_year.id
        and request.request_kind = 'profile_change'
        and request.status = 'pending'
      order by request.created_at desc
      limit 1
    );
end;
$$;

create or replace function public.submit_profile_change(
  p_first_name text,
  p_last_name text,
  p_avatar_url text,
  p_school_level text,
  p_series text,
  p_reason text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_profile public.profiles;
  v_updated public.profiles;
  v_year public.edutech_school_years;
  v_first_name text := nullif(btrim(p_first_name), '');
  v_last_name text := nullif(btrim(p_last_name), '');
  v_full_name text;
  v_avatar_url text := nullif(btrim(p_avatar_url), '');
  v_school_level text := nullif(btrim(p_school_level), '');
  v_series text := nullif(btrim(p_series), '');
  v_reason text := nullif(btrim(p_reason), '');
  v_snapshot_before jsonb;
  v_snapshot_after jsonb;
  v_request_id uuid;
  v_direct_change_used boolean;
begin
  if auth.uid() is null then
    raise exception 'Connexion requise' using errcode = '42501';
  end if;

  select * into v_profile
  from public.profiles
  where id = auth.uid()
  for update;

  if not found then
    raise exception 'Profil introuvable';
  end if;

  if not v_profile.is_active or v_profile.status <> 'active' then
    raise exception 'Ce compte n’est pas actif';
  end if;

  if v_first_name is null or v_last_name is null then
    raise exception 'Le prénom et le nom sont obligatoires';
  end if;

  if char_length(v_first_name) > 80 or char_length(v_last_name) > 80 then
    raise exception 'Le prénom et le nom doivent contenir au plus 80 caractères';
  end if;

  if v_school_level not in ('Première', 'Terminale') or v_series not in ('A1', 'A2', 'C', 'D') then
    raise exception 'Le niveau scolaire et la série doivent être valides';
  end if;

  if v_avatar_url is distinct from v_profile.avatar_url
     and v_avatar_url is not null
     and v_avatar_url !~ ('^' || auth.uid()::text || '/[A-Za-z0-9._-]+$') then
    raise exception 'La photo doit provenir de votre espace de stockage sécurisé' using errcode = '42501';
  end if;

  v_full_name := btrim(concat_ws(' ', v_first_name, v_last_name));
  v_snapshot_before := jsonb_build_object(
    'first_name', v_profile.first_name,
    'last_name', v_profile.last_name,
    'full_name', v_profile.full_name,
    'avatar_url', v_profile.avatar_url,
    'school_level', v_profile.school_level,
    'series', v_profile.series
  );
  v_snapshot_after := jsonb_build_object(
    'first_name', v_first_name,
    'last_name', v_last_name,
    'full_name', v_full_name,
    'avatar_url', v_avatar_url,
    'school_level', v_school_level,
    'series', v_series
  );

  if v_snapshot_before = v_snapshot_after then
    raise exception 'Aucune modification réelle n’a été détectée';
  end if;

  select * into v_year
  from public.edutech_school_years
  where status = 'active'
  order by starts_on desc nulls last, created_at desc
  limit 1;

  if not found then
    raise exception 'Aucune année scolaire active n’est configurée';
  end if;

  if v_profile.role = 'admin' then
    perform set_config('app.edutech_profile_change_authorized', 'true', true);
    update public.profiles
    set first_name = v_first_name,
        last_name = v_last_name,
        full_name = v_full_name,
        avatar_url = v_avatar_url,
        school_level = v_school_level,
        series = v_series
    where id = v_profile.id
    returning * into v_updated;

    insert into public.edutech_profile_change_events(
      student_id, school_year_id, school_year, change_kind, old_snapshot, new_snapshot, changed_by
    ) values (
      v_profile.id, v_year.id, v_year.name, 'admin_direct', v_snapshot_before, v_snapshot_after, auth.uid()
    );

    return jsonb_build_object('outcome', 'updated', 'profile', to_jsonb(v_updated));
  end if;

  select exists (
    select 1
    from public.edutech_profile_change_events as event
    where event.student_id = v_profile.id
      and event.school_year_id = v_year.id
      and event.change_kind = 'student_direct'
  ) into v_direct_change_used;

  if v_direct_change_used then
    if v_reason is null or char_length(v_reason) < 12 or char_length(v_reason) > 1000 then
      raise exception 'Expliquez votre demande en 12 à 1000 caractères';
    end if;

    if exists (
      select 1
      from public.edutech_class_change_requests as request
      where request.student_id = v_profile.id
        and request.school_year_id = v_year.id
        and request.request_kind = 'profile_change'
        and request.status = 'pending'
    ) then
      raise exception 'Une demande de modification est déjà en attente de validation';
    end if;

    insert into public.edutech_class_change_requests(
      student_id, school_year_id, school_year,
      old_school_level, old_series, new_school_level, new_series,
      reason, status, is_automatic, request_kind,
      new_first_name, new_last_name, new_full_name, new_avatar_url
    ) values (
      v_profile.id, v_year.id, v_year.name,
      v_profile.school_level, v_profile.series, v_school_level, v_series,
      v_reason, 'pending', false, 'profile_change',
      v_first_name, v_last_name, v_full_name, v_avatar_url
    ) returning id into v_request_id;

    return jsonb_build_object('outcome', 'requested', 'request_id', v_request_id);
  end if;

  perform set_config('app.edutech_profile_change_authorized', 'true', true);
  update public.profiles
  set first_name = v_first_name,
      last_name = v_last_name,
      full_name = v_full_name,
      avatar_url = v_avatar_url,
      school_level = v_school_level,
      series = v_series
  where id = v_profile.id
  returning * into v_updated;

  insert into public.edutech_profile_change_events(
    student_id, school_year_id, school_year, change_kind, old_snapshot, new_snapshot, changed_by
  ) values (
    v_profile.id, v_year.id, v_year.name, 'student_direct', v_snapshot_before, v_snapshot_after, auth.uid()
  );

  return jsonb_build_object('outcome', 'updated', 'profile', to_jsonb(v_updated));
end;
$$;

create or replace function public.admin_review_class_change_request(
  p_request_id uuid,
  p_accept boolean,
  p_review_note text default null
)
returns public.edutech_class_change_requests
language plpgsql
security definer
set search_path = public
as $$
declare
  v_request public.edutech_class_change_requests;
  v_profile public.profiles;
  v_snapshot_before jsonb;
  v_snapshot_after jsonb;
begin
  if not public.is_edutech_admin() then
    raise exception 'Accès administrateur requis' using errcode = '42501';
  end if;

  select * into v_request
  from public.edutech_class_change_requests
  where id = p_request_id
  for update;

  if not found or v_request.status <> 'pending' then
    raise exception 'Cette demande ne peut plus être examinée';
  end if;

  select * into v_profile
  from public.profiles
  where id = v_request.student_id
  for update;

  if not found then
    raise exception 'Le profil concerné est introuvable';
  end if;

  if p_accept then
    if v_request.request_kind = 'profile_change' then
      v_snapshot_before := jsonb_build_object(
        'first_name', v_profile.first_name,
        'last_name', v_profile.last_name,
        'full_name', v_profile.full_name,
        'avatar_url', v_profile.avatar_url,
        'school_level', v_profile.school_level,
        'series', v_profile.series
      );

      perform set_config('app.edutech_profile_change_authorized', 'true', true);
      update public.profiles
      set first_name = v_request.new_first_name,
          last_name = v_request.new_last_name,
          full_name = v_request.new_full_name,
          avatar_url = v_request.new_avatar_url,
          school_level = v_request.new_school_level,
          series = v_request.new_series,
          school_year = v_request.school_year
      where id = v_request.student_id
      returning * into v_profile;

      v_snapshot_after := jsonb_build_object(
        'first_name', v_profile.first_name,
        'last_name', v_profile.last_name,
        'full_name', v_profile.full_name,
        'avatar_url', v_profile.avatar_url,
        'school_level', v_profile.school_level,
        'series', v_profile.series
      );

      insert into public.edutech_profile_change_events(
        student_id, school_year_id, school_year, change_kind, old_snapshot, new_snapshot, request_id, changed_by
      ) values (
        v_request.student_id, v_request.school_year_id, v_request.school_year,
        'approved_request', v_snapshot_before, v_snapshot_after, v_request.id, auth.uid()
      );

      if (v_request.new_school_level, v_request.new_series)
         is distinct from (v_request.old_school_level, v_request.old_series) then
        insert into public.edutech_student_school_history(
          student_id, school_year_id, school_year, school_level, series, lv2_choice, class_change_count, created_by
        ) values (
          v_request.student_id, v_request.school_year_id, v_request.school_year,
          v_request.new_school_level, v_request.new_series, v_profile.lv2_choice, 1, auth.uid()
        ) on conflict (student_id, school_year_id) do update
          set school_level = excluded.school_level,
              series = excluded.series,
              lv2_choice = excluded.lv2_choice,
              class_change_count = public.edutech_student_school_history.class_change_count + 1,
              record_status = 'active';
      end if;
    else
      perform set_config('app.edutech_profile_change_authorized', 'true', true);
      update public.profiles
      set school_level = v_request.new_school_level,
          series = v_request.new_series,
          school_year = v_request.school_year
      where id = v_request.student_id
      returning * into v_profile;

      insert into public.edutech_student_school_history(
        student_id, school_year_id, school_year, school_level, series, lv2_choice, class_change_count, created_by
      ) values (
        v_request.student_id, v_request.school_year_id, v_request.school_year,
        v_request.new_school_level, v_request.new_series, v_profile.lv2_choice, 1, auth.uid()
      ) on conflict (student_id, school_year_id) do update
        set school_level = excluded.school_level,
            series = excluded.series,
            lv2_choice = excluded.lv2_choice,
            class_change_count = public.edutech_student_school_history.class_change_count + 1,
            record_status = 'active';
    end if;

    update public.edutech_class_change_requests
    set status = 'accepted',
        reviewed_by = auth.uid(),
        reviewed_at = now(),
        review_note = nullif(btrim(p_review_note), '')
    where id = p_request_id
    returning * into v_request;

    perform public.edutech_log_school_action(
      case when v_request.request_kind = 'profile_change' then 'profile_change_accepted' else 'class_change_accepted' end,
      'class_change_request',
      v_request.id::text,
      jsonb_build_object('student_id', v_request.student_id, 'school_year', v_request.school_year, 'request_kind', v_request.request_kind)
    );
  else
    update public.edutech_class_change_requests
    set status = 'rejected',
        reviewed_by = auth.uid(),
        reviewed_at = now(),
        review_note = nullif(btrim(p_review_note), '')
    where id = p_request_id
    returning * into v_request;

    perform public.edutech_log_school_action(
      case when v_request.request_kind = 'profile_change' then 'profile_change_rejected' else 'class_change_rejected' end,
      'class_change_request',
      v_request.id::text,
      jsonb_build_object('student_id', v_request.student_id, 'school_year', v_request.school_year, 'request_kind', v_request.request_kind)
    );
  end if;

  return v_request;
end;
$$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'profile-avatars',
  'profile-avatars',
  false,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists profile_avatars_insert_own_prefix on storage.objects;
create policy profile_avatars_insert_own_prefix
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'profile-avatars'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
  and storage.extension(name) in ('jpg', 'jpeg', 'png', 'webp')
);

drop policy if exists profile_avatars_select_owner_or_admin on storage.objects;
create policy profile_avatars_select_owner_or_admin
on storage.objects
for select
to authenticated
using (
  bucket_id = 'profile-avatars'
  and (
    (storage.foldername(name))[1] = (select auth.uid()::text)
    or public.is_edutech_admin()
  )
);

revoke execute on function public.edutech_profile_change_status() from public, anon;
grant execute on function public.edutech_profile_change_status() to authenticated;

revoke execute on function public.submit_profile_change(text, text, text, text, text, text) from public, anon;
grant execute on function public.submit_profile_change(text, text, text, text, text, text) to authenticated;

revoke execute on function public.admin_review_class_change_request(uuid, boolean, text) from public, anon;
grant execute on function public.admin_review_class_change_request(uuid, boolean, text) to authenticated;

commit;
