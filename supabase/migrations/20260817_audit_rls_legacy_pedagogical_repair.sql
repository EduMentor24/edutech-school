begin;

drop policy if exists edutech_exercises_all on public.edutech_exercises;
drop policy if exists edutech_quizzes_all on public.edutech_quizzes;

drop policy if exists schoolci_chapters_read on public.edutech_chapters;
create policy schoolci_chapters_read
on public.edutech_chapters
for select
to authenticated
using (is_edutech_admin());

commit;
