-- Publication contrôlée des brouillons complets de SVT Terminale A1/A2/C/D.
-- Le périmètre est figé à 24 leçons non actives avec un contenu non vide.
do $publish_svt_terminal_drafts_do$
declare
  target record;
  target_count integer;
  incomplete_count integer;
begin
  select count(*) into target_count
  from public.lessons lesson
  join public.chapters chapter on chapter.id = lesson.chapter_id
  join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
  join public.subjects subject on subject.id = offering.subject_id
  join public.levels level on level.id = offering.level_id
  join public.series series on series.id = offering.series_id
  where subject.name = 'Sciences de la Vie et de la Terre'
    and level.name = 'Terminale'
    and series.name in ('A1', 'A2', 'C', 'D')
    and not lesson.is_test_data
    and not lesson.is_active
    and coalesce(btrim(lesson.content), '') <> '';

  if target_count <> 24 then
    raise exception 'Publication refusée : 24 brouillons complets de SVT Terminale étaient attendus, % trouvés.', target_count;
  end if;

  select count(*) into incomplete_count
  from public.lessons lesson
  join public.chapters chapter on chapter.id = lesson.chapter_id
  join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
  join public.subjects subject on subject.id = offering.subject_id
  join public.levels level on level.id = offering.level_id
  join public.series series on series.id = offering.series_id
  where subject.name = 'Sciences de la Vie et de la Terre'
    and level.name = 'Terminale'
    and series.name in ('A1', 'A2', 'C', 'D')
    and not lesson.is_test_data
    and not lesson.is_active
    and coalesce(btrim(lesson.content), '') <> ''
    and (
      (select count(*) from public.exercises exercise where exercise.lesson_id = lesson.id and not exercise.is_test_data) < 2
      or (select count(*) from public.exercise_questions question join public.exercises exercise on exercise.id = question.exercise_id where exercise.lesson_id = lesson.id and not exercise.is_test_data) < 6
      or (select count(*) from public.quizzes quiz where quiz.lesson_id = lesson.id and not quiz.is_test_data) < 1
      or (select count(*) from public.quiz_questions question join public.quizzes quiz on quiz.id = question.quiz_id where quiz.lesson_id = lesson.id and not quiz.is_test_data) < 4
      or (select count(*) from public.quiz_answers answer join public.quiz_questions question on question.id = answer.question_id join public.quizzes quiz on quiz.id = question.quiz_id where quiz.lesson_id = lesson.id and not quiz.is_test_data) < 8
    );

  if incomplete_count <> 0 then
    raise exception 'Publication refusée : % brouillon(s) de SVT sont incomplets.', incomplete_count;
  end if;

  for target in
    select lesson.id as lesson_id, chapter.id as chapter_id, offering.id as offering_id
    from public.lessons lesson
    join public.chapters chapter on chapter.id = lesson.chapter_id
    join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
    join public.subjects subject on subject.id = offering.subject_id
    join public.levels level on level.id = offering.level_id
    join public.series series on series.id = offering.series_id
    where subject.name = 'Sciences de la Vie et de la Terre'
      and level.name = 'Terminale'
      and series.name in ('A1', 'A2', 'C', 'D')
      and not lesson.is_test_data
      and not lesson.is_active
      and coalesce(btrim(lesson.content), '') <> ''
  loop
    update public.course_subject_offerings
    set is_published = true
    where id = target.offering_id;

    update public.chapters
    set is_active = true
    where id = target.chapter_id;

    update public.lessons
    set is_active = true
    where id = target.lesson_id
      and not is_test_data
      and not is_active;

    update public.exercises
    set is_published = true, is_active = true
    where lesson_id = target.lesson_id
      and not is_test_data;

    update public.quizzes
    set is_published = true, is_active = true
    where lesson_id = target.lesson_id
      and not is_test_data;
  end loop;
end $publish_svt_terminal_drafts_do$;
