begin;

alter view public.edutech_leaderboard set (security_invoker = true);
alter view public.schoolci_grade_summary set (security_invoker = true);

commit;
