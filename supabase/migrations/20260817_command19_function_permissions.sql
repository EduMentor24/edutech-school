begin;

revoke execute on function public.apply_edutech_content_policies(regclass) from anon;
revoke execute on function public.edutech_log_coefficient_change() from anon;
revoke execute on function public.edutech_set_updated_at() from anon;
revoke execute on function public.is_admin() from anon;
revoke execute on function public.prevent_self_profile_role_change() from anon;
revoke execute on function public.rls_auto_enable() from anon;
revoke execute on function public.schoolci_guard_profile() from anon;
revoke execute on function public.schoolci_log_admin_action(text, text, text, jsonb) from anon;
revoke execute on function public.schoolci_publish_notification() from anon;
revoke execute on function public.sync_profile_role_assignment() from anon;
revoke execute on function public.validate_exercise_pedagogical_link() from anon;

alter function public.set_updated_at() set search_path = public;

commit;
