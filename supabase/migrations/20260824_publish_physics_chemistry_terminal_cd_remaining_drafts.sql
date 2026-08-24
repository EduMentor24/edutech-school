-- Publication contrôlée des contenus Physique-Chimie Terminale C/D encore en brouillon.
-- Aucun cours, exercice, quiz, question ou réponse n'est créé, supprimé ou réécrit.
do $publish_physics_chemistry_terminal_cd_remaining_drafts_do$
declare
  target record;
  lesson_count integer;
  exercise_count integer;
  exercise_question_count integer;
  quiz_count integer;
  quiz_question_count integer;
  quiz_answer_count integer;
  correct_answer_count integer;
  incomplete_lesson_count integer;
begin
  select count(*) into lesson_count
  from public.lessons lesson
  join public.chapters chapter on chapter.id = lesson.chapter_id
  join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
  join public.subjects subject on subject.id = offering.subject_id
  join public.levels level on level.id = offering.level_id
  join public.series series on series.id = offering.series_id
  where subject.name = 'Physique-Chimie'
    and level.name = 'Terminale'
    and series.name in ('C', 'D')
    and not lesson.is_active
    and not lesson.is_test_data
    and (
      coalesce(btrim(lesson.content), '') <> ''
      or exists (
        select 1 from public.lesson_sessions session
        where session.lesson_id = lesson.id
          and coalesce(btrim(session.content), '') <> ''
      )
    );

  if lesson_count <> 6 then
    raise exception 'Publication refusée : 6 leçons Physique-Chimie C/D complètes en brouillon étaient attendues, % trouvées.', lesson_count;
  end if;

  select count(*) into exercise_count
  from public.exercises exercise
  join public.lessons lesson on lesson.id = exercise.lesson_id
  join public.chapters chapter on chapter.id = lesson.chapter_id
  join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
  join public.subjects subject on subject.id = offering.subject_id
  join public.levels level on level.id = offering.level_id
  join public.series series on series.id = offering.series_id
  where subject.name = 'Physique-Chimie'
    and level.name = 'Terminale'
    and series.name in ('C', 'D')
    and not lesson.is_active
    and not lesson.is_test_data
    and not exercise.is_test_data
    and (not exercise.is_published or not exercise.is_active)
    and (coalesce(btrim(lesson.content), '') <> '' or exists (select 1 from public.lesson_sessions session where session.lesson_id = lesson.id and coalesce(btrim(session.content), '') <> ''));

  select count(*) into exercise_question_count
  from public.exercise_questions question
  join public.exercises exercise on exercise.id = question.exercise_id
  join public.lessons lesson on lesson.id = exercise.lesson_id
  join public.chapters chapter on chapter.id = lesson.chapter_id
  join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
  join public.subjects subject on subject.id = offering.subject_id
  join public.levels level on level.id = offering.level_id
  join public.series series on series.id = offering.series_id
  where subject.name = 'Physique-Chimie'
    and level.name = 'Terminale'
    and series.name in ('C', 'D')
    and not lesson.is_active
    and not lesson.is_test_data
    and not exercise.is_test_data
    and (not exercise.is_published or not exercise.is_active)
    and (coalesce(btrim(lesson.content), '') <> '' or exists (select 1 from public.lesson_sessions session where session.lesson_id = lesson.id and coalesce(btrim(session.content), '') <> ''));

  select count(*) into quiz_count
  from public.quizzes quiz
  join public.lessons lesson on lesson.id = quiz.lesson_id
  join public.chapters chapter on chapter.id = lesson.chapter_id
  join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
  join public.subjects subject on subject.id = offering.subject_id
  join public.levels level on level.id = offering.level_id
  join public.series series on series.id = offering.series_id
  where subject.name = 'Physique-Chimie'
    and level.name = 'Terminale'
    and series.name in ('C', 'D')
    and not lesson.is_active
    and not lesson.is_test_data
    and not quiz.is_test_data
    and (not quiz.is_published or not quiz.is_active)
    and (coalesce(btrim(lesson.content), '') <> '' or exists (select 1 from public.lesson_sessions session where session.lesson_id = lesson.id and coalesce(btrim(session.content), '') <> ''));

  select count(*) into quiz_question_count
  from public.quiz_questions question
  join public.quizzes quiz on quiz.id = question.quiz_id
  join public.lessons lesson on lesson.id = quiz.lesson_id
  join public.chapters chapter on chapter.id = lesson.chapter_id
  join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
  join public.subjects subject on subject.id = offering.subject_id
  join public.levels level on level.id = offering.level_id
  join public.series series on series.id = offering.series_id
  where subject.name = 'Physique-Chimie'
    and level.name = 'Terminale'
    and series.name in ('C', 'D')
    and not lesson.is_active
    and not lesson.is_test_data
    and not quiz.is_test_data
    and (not quiz.is_published or not quiz.is_active)
    and (coalesce(btrim(lesson.content), '') <> '' or exists (select 1 from public.lesson_sessions session where session.lesson_id = lesson.id and coalesce(btrim(session.content), '') <> ''));

  select count(*), count(*) filter (where answer.is_correct) into quiz_answer_count, correct_answer_count
  from public.quiz_answers answer
  join public.quiz_questions question on question.id = answer.question_id
  join public.quizzes quiz on quiz.id = question.quiz_id
  join public.lessons lesson on lesson.id = quiz.lesson_id
  join public.chapters chapter on chapter.id = lesson.chapter_id
  join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
  join public.subjects subject on subject.id = offering.subject_id
  join public.levels level on level.id = offering.level_id
  join public.series series on series.id = offering.series_id
  where subject.name = 'Physique-Chimie'
    and level.name = 'Terminale'
    and series.name in ('C', 'D')
    and not lesson.is_active
    and not lesson.is_test_data
    and not quiz.is_test_data
    and (not quiz.is_published or not quiz.is_active)
    and (coalesce(btrim(lesson.content), '') <> '' or exists (select 1 from public.lesson_sessions session where session.lesson_id = lesson.id and coalesce(btrim(session.content), '') <> ''));

  if exercise_count <> 12 or exercise_question_count <> 48 or quiz_count <> 12 or quiz_question_count <> 48 or quiz_answer_count <> 144 or correct_answer_count <> 48 then
    raise exception 'Publication refusée : volumes Physique-Chimie C/D inattendus (exercices %, questions exercice %, quiz %, questions quiz %, réponses %, corrections %).', exercise_count, exercise_question_count, quiz_count, quiz_question_count, quiz_answer_count, correct_answer_count;
  end if;

  select count(*) into incomplete_lesson_count
  from public.lessons lesson
  join public.chapters chapter on chapter.id = lesson.chapter_id
  join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
  join public.subjects subject on subject.id = offering.subject_id
  join public.levels level on level.id = offering.level_id
  join public.series series on series.id = offering.series_id
  where subject.name = 'Physique-Chimie'
    and level.name = 'Terminale'
    and series.name in ('C', 'D')
    and not lesson.is_active
    and not lesson.is_test_data
    and (coalesce(btrim(lesson.content), '') <> '' or exists (select 1 from public.lesson_sessions session where session.lesson_id = lesson.id and coalesce(btrim(session.content), '') <> ''))
    and (
      (select count(*) from public.exercises exercise where exercise.lesson_id = lesson.id and (not exercise.is_published or not exercise.is_active) and not exercise.is_test_data) <> 2
      or (select count(*) from public.exercise_questions question join public.exercises exercise on exercise.id = question.exercise_id where exercise.lesson_id = lesson.id and (not exercise.is_published or not exercise.is_active) and not exercise.is_test_data) <> 8
      or exists (select 1 from public.exercise_questions question join public.exercises exercise on exercise.id = question.exercise_id where exercise.lesson_id = lesson.id and (not exercise.is_published or not exercise.is_active) and not exercise.is_test_data and (coalesce(btrim(question.prompt_markdown), '') = '' or coalesce(jsonb_array_length(question.options), 0) < 2 or coalesce(jsonb_array_length(question.correct_answers), 0) < 1 or coalesce(btrim(question.explanation_markdown), '') = ''))
      or (select count(*) from public.quizzes quiz where quiz.lesson_id = lesson.id and (not quiz.is_published or not quiz.is_active) and not quiz.is_test_data) <> 2
      or (select count(*) from public.quiz_questions question join public.quizzes quiz on quiz.id = question.quiz_id where quiz.lesson_id = lesson.id and (not quiz.is_published or not quiz.is_active) and not quiz.is_test_data) <> 8
      or (select count(*) from public.quiz_answers answer join public.quiz_questions question on question.id = answer.question_id join public.quizzes quiz on quiz.id = question.quiz_id where quiz.lesson_id = lesson.id and (not quiz.is_published or not quiz.is_active) and not quiz.is_test_data) <> 24
      or (select count(*) from public.quiz_answers answer join public.quiz_questions question on question.id = answer.question_id join public.quizzes quiz on quiz.id = question.quiz_id where quiz.lesson_id = lesson.id and (not quiz.is_published or not quiz.is_active) and not quiz.is_test_data and answer.is_correct) <> 8
      or exists (select 1 from public.quiz_questions question join public.quizzes quiz on quiz.id = question.quiz_id where quiz.lesson_id = lesson.id and (not quiz.is_published or not quiz.is_active) and not quiz.is_test_data and (coalesce(btrim(question.question), '') = '' or coalesce(btrim(question.explanation), '') = ''))
      or exists (select 1 from public.quiz_answers answer join public.quiz_questions question on question.id = answer.question_id join public.quizzes quiz on quiz.id = question.quiz_id where quiz.lesson_id = lesson.id and (not quiz.is_published or not quiz.is_active) and not quiz.is_test_data and coalesce(btrim(answer.answer), '') = '')
      or exists (select 1 from public.quiz_questions question join public.quizzes quiz on quiz.id = question.quiz_id left join public.quiz_answers answer on answer.question_id = question.id where quiz.lesson_id = lesson.id and (not quiz.is_published or not quiz.is_active) and not quiz.is_test_data group by question.id having count(answer.id) <> 3 or count(answer.id) filter (where answer.is_correct) <> 1)
    );

  if incomplete_lesson_count <> 0 then
    raise exception 'Publication refusée : % leçon(s) Physique-Chimie C/D sont incomplètes.', incomplete_lesson_count;
  end if;

  for target in
    select lesson.id as lesson_id, chapter.id as chapter_id, offering.id as offering_id
    from public.lessons lesson
    join public.chapters chapter on chapter.id = lesson.chapter_id
    join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
    join public.subjects subject on subject.id = offering.subject_id
    join public.levels level on level.id = offering.level_id
    join public.series series on series.id = offering.series_id
    where subject.name = 'Physique-Chimie'
      and level.name = 'Terminale'
      and series.name in ('C', 'D')
      and not lesson.is_active
      and not lesson.is_test_data
      and (coalesce(btrim(lesson.content), '') <> '' or exists (select 1 from public.lesson_sessions session where session.lesson_id = lesson.id and coalesce(btrim(session.content), '') <> ''))
  loop
    update public.course_subject_offerings set is_published = true where id = target.offering_id and not is_published;
    update public.chapters set is_active = true where id = target.chapter_id and not is_active;
    update public.lessons set is_active = true where id = target.lesson_id and not is_test_data and not is_active;
    update public.exercises set is_published = true, is_active = true where lesson_id = target.lesson_id and not is_test_data and (not is_published or not is_active);
    update public.quizzes set is_published = true, is_active = true where lesson_id = target.lesson_id and not is_test_data and (not is_published or not is_active);
  end loop;
end $publish_physics_chemistry_terminal_cd_remaining_drafts_do$;
