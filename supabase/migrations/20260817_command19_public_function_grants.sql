begin;

revoke execute on function public.apply_edutech_content_policies(regclass) from public, anon, authenticated;
revoke execute on function public.edutech_log_coefficient_change() from public, anon, authenticated;
revoke execute on function public.edutech_set_updated_at() from public, anon, authenticated;
revoke execute on function public.prevent_self_profile_role_change() from public, anon, authenticated;
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
revoke execute on function public.schoolci_guard_profile() from public, anon, authenticated;
revoke execute on function public.schoolci_log_admin_action(text, text, text, jsonb) from public, anon, authenticated;
revoke execute on function public.schoolci_publish_notification() from public, anon, authenticated;
revoke execute on function public.sync_profile_role_assignment() from public, anon, authenticated;
revoke execute on function public.validate_exercise_pedagogical_link() from public, anon, authenticated;

revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

commit;
