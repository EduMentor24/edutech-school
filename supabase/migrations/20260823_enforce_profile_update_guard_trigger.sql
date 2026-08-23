begin;

drop trigger if exists schoolci_guard_profile_update on public.profiles;
create trigger schoolci_guard_profile_update
before update on public.profiles
for each row
execute function public.schoolci_guard_profile();

commit;
