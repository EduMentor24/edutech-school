begin;

grant usage on schema public to authenticated;
grant select, update on table public.profiles to authenticated;

commit;
