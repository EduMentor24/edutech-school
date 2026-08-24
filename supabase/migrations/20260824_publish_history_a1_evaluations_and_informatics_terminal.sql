-- Publication contrôlée : évaluations Histoire-Géographie A1 et contenus Informatique / TICE Terminale.
-- La migration ne crée ni ne réécrit aucun contenu pédagogique.
do $publish_history_a1_evaluations_and_informatics_terminal_do$
declare
  target record;
  information_lesson_count integer;
  information_inactive_lesson_count integer;
  information_incomplete_count integer;
  history_lesson_count integer;
  history_incomplete_count integer;
  history_draft_exercise_count integer;
  history_draft_quiz_count integer;
begin
  select count(*) into information_lesson_count
  from public.lessons lesson
  join public.chapters chapter on chapter.id = lesson.chapter_id
  join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
  join public.subjects subject on subject.id = offering.subject_id
  join public.levels level on level.id = offering.level_id
  join public.series series on series.id = offering.series_id
  where subject.name = 'Informatique / TICE'
    and level.name = 'Terminale'
    and series.name in ('A1', 'A2', 'C', 'D')
    and not lesson.is_test_data
    and (
      coalesce(btrim(lesson.content), '') <> ''
      or exists (
        select 1 from public.lesson_sessions session
        where session.lesson_id = lesson.id
          and coalesce(btrim(session.content), '') <> ''
      )
    );

  if information_lesson_count <> 56 then
    raise exception 'Publication refusée : 56 leçons Informatique / TICE complètes étaient attendues, % trouvées.', information_lesson_count;
  end if;

  select count(*) into information_inactive_lesson_count
  from public.lessons lesson
  join public.chapters chapter on chapter.id = lesson.chapter_id
  join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
  join public.subjects subject on subject.id = offering.subject_id
  join public.levels level on level.id = offering.level_id
  join public.series series on series.id = offering.series_id
  where subject.name = 'Informatique / TICE'
    and level.name = 'Terminale'
    and series.name in ('A1', 'A2', 'C', 'D')
    and not lesson.is_test_data
    and not lesson.is_active
    and (
      coalesce(btrim(lesson.content), '') <> ''
      or exists (
        select 1
        from public.lesson_sessions session
        where session.lesson_id = lesson.id
          and coalesce(btrim(session.content), '') <> ''
      )
    );

  if information_inactive_lesson_count <> 42 then
    raise exception 'Publication refusée : 42 leçons Informatique / TICE inactives étaient attendues, % trouvées.', information_inactive_lesson_count;
  end if;

  select count(*) into information_incomplete_count
  from public.lessons lesson
  join public.chapters chapter on chapter.id = lesson.chapter_id
  join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
  join public.subjects subject on subject.id = offering.subject_id
  join public.levels level on level.id = offering.level_id
  join public.series series on series.id = offering.series_id
  where subject.name = 'Informatique / TICE'
    and level.name = 'Terminale'
    and series.name in ('A1', 'A2', 'C', 'D')
    and not lesson.is_test_data
    and (
      coalesce(btrim(lesson.content), '') <> ''
      or exists (
        select 1 from public.lesson_sessions session
        where session.lesson_id = lesson.id
          and coalesce(btrim(session.content), '') <> ''
      )
    )
    and (
      (select count(*) from public.exercises exercise where exercise.lesson_id = lesson.id and not exercise.is_test_data) <> 2
      or (select count(*) from public.exercise_questions question join public.exercises exercise on exercise.id = question.exercise_id where exercise.lesson_id = lesson.id and not exercise.is_test_data) <> 8
      or exists (
        select 1 from public.exercise_questions question
        join public.exercises exercise on exercise.id = question.exercise_id
        where exercise.lesson_id = lesson.id
          and not exercise.is_test_data
          and (
            coalesce(btrim(question.prompt_markdown), '') = ''
            or coalesce(jsonb_array_length(question.options), 0) < 2
            or coalesce(jsonb_array_length(question.correct_answers), 0) < 1
            or coalesce(btrim(question.explanation_markdown), '') = ''
          )
      )
      or (select count(*) from public.quizzes quiz where quiz.lesson_id = lesson.id and not quiz.is_test_data) <> 2
      or (select count(*) from public.quiz_questions question join public.quizzes quiz on quiz.id = question.quiz_id where quiz.lesson_id = lesson.id and not quiz.is_test_data) <> 8
      or (select count(*) from public.quiz_answers answer join public.quiz_questions question on question.id = answer.question_id join public.quizzes quiz on quiz.id = question.quiz_id where quiz.lesson_id = lesson.id and not quiz.is_test_data) <> 24
      or (select count(*) from public.quiz_answers answer join public.quiz_questions question on question.id = answer.question_id join public.quizzes quiz on quiz.id = question.quiz_id where quiz.lesson_id = lesson.id and not quiz.is_test_data and answer.is_correct) <> 8
      or exists (
        select 1 from public.quiz_questions question
        join public.quizzes quiz on quiz.id = question.quiz_id
        where quiz.lesson_id = lesson.id
          and not quiz.is_test_data
          and (coalesce(btrim(question.question), '') = '' or coalesce(btrim(question.explanation), '') = '')
      )
      or exists (
        select 1 from public.quiz_answers answer
        join public.quiz_questions question on question.id = answer.question_id
        join public.quizzes quiz on quiz.id = question.quiz_id
        where quiz.lesson_id = lesson.id
          and not quiz.is_test_data
          and coalesce(btrim(answer.answer), '') = ''
      )
      or exists (
        select 1
        from public.quiz_questions question
        join public.quizzes quiz on quiz.id = question.quiz_id
        left join public.quiz_answers answer on answer.question_id = question.id
        where quiz.lesson_id = lesson.id
          and not quiz.is_test_data
        group by question.id
        having count(answer.id) <> 3 or count(answer.id) filter (where answer.is_correct) <> 1
      )
    );

  if information_incomplete_count <> 0 then
    raise exception 'Publication refusée : % leçon(s) Informatique / TICE sont incomplètes.', information_incomplete_count;
  end if;

  select count(*) into history_lesson_count
  from public.lessons lesson
  join public.chapters chapter on chapter.id = lesson.chapter_id
  join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
  join public.subjects subject on subject.id = offering.subject_id
  join public.levels level on level.id = offering.level_id
  join public.series series on series.id = offering.series_id
  where subject.name = 'Histoire-Géographie'
    and level.name = 'Terminale'
    and series.name = 'A1'
    and lesson.is_active
    and not lesson.is_test_data;

  if history_lesson_count <> 14 then
    raise exception 'Publication refusée : 14 leçons Histoire-Géographie A1 actives étaient attendues, % trouvées.', history_lesson_count;
  end if;

  select count(*) into history_draft_exercise_count
  from public.exercises exercise
  join public.lessons lesson on lesson.id = exercise.lesson_id
  join public.chapters chapter on chapter.id = lesson.chapter_id
  join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
  join public.subjects subject on subject.id = offering.subject_id
  join public.levels level on level.id = offering.level_id
  join public.series series on series.id = offering.series_id
  where subject.name = 'Histoire-Géographie'
    and level.name = 'Terminale'
    and series.name = 'A1'
    and lesson.is_active
    and not lesson.is_test_data
    and not exercise.is_test_data
    and (not exercise.is_published or not exercise.is_active);

  select count(*) into history_draft_quiz_count
  from public.quizzes quiz
  join public.lessons lesson on lesson.id = quiz.lesson_id
  join public.chapters chapter on chapter.id = lesson.chapter_id
  join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
  join public.subjects subject on subject.id = offering.subject_id
  join public.levels level on level.id = offering.level_id
  join public.series series on series.id = offering.series_id
  where subject.name = 'Histoire-Géographie'
    and level.name = 'Terminale'
    and series.name = 'A1'
    and lesson.is_active
    and not lesson.is_test_data
    and not quiz.is_test_data
    and (not quiz.is_published or not quiz.is_active);

  if history_draft_exercise_count <> 28 or history_draft_quiz_count <> 14 then
    raise exception 'Publication refusée : 28 exercices et 14 quiz Histoire-Géographie A1 étaient attendus, % exercices et % quiz trouvés.', history_draft_exercise_count, history_draft_quiz_count;
  end if;

  select count(*) into history_incomplete_count
  from public.lessons lesson
  join public.chapters chapter on chapter.id = lesson.chapter_id
  join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
  join public.subjects subject on subject.id = offering.subject_id
  join public.levels level on level.id = offering.level_id
  join public.series series on series.id = offering.series_id
  where subject.name = 'Histoire-Géographie'
    and level.name = 'Terminale'
    and series.name = 'A1'
    and lesson.is_active
    and not lesson.is_test_data
    and (
      (select count(*) from public.exercises exercise where exercise.lesson_id = lesson.id and (not exercise.is_published or not exercise.is_active) and not exercise.is_test_data) <> 2
      or (select count(*) from public.exercise_questions question join public.exercises exercise on exercise.id = question.exercise_id where exercise.lesson_id = lesson.id and (not exercise.is_published or not exercise.is_active) and not exercise.is_test_data) <> 6
      or exists (
        select 1 from public.exercise_questions question
        join public.exercises exercise on exercise.id = question.exercise_id
        where exercise.lesson_id = lesson.id
          and (not exercise.is_published or not exercise.is_active)
          and not exercise.is_test_data
          and (coalesce(btrim(question.prompt_markdown), '') = '' or coalesce(jsonb_array_length(question.options), 0) < 2 or coalesce(jsonb_array_length(question.correct_answers), 0) < 1 or coalesce(btrim(question.explanation_markdown), '') = '')
      )
      or (select count(*) from public.quizzes quiz where quiz.lesson_id = lesson.id and (not quiz.is_published or not quiz.is_active) and not quiz.is_test_data) <> 1
      or (select count(*) from public.quiz_questions question join public.quizzes quiz on quiz.id = question.quiz_id where quiz.lesson_id = lesson.id and (not quiz.is_published or not quiz.is_active) and not quiz.is_test_data) <> 4
      or (select count(*) from public.quiz_answers answer join public.quiz_questions question on question.id = answer.question_id join public.quizzes quiz on quiz.id = question.quiz_id where quiz.lesson_id = lesson.id and (not quiz.is_published or not quiz.is_active) and not quiz.is_test_data) <> 8
      or (select count(*) from public.quiz_answers answer join public.quiz_questions question on question.id = answer.question_id join public.quizzes quiz on quiz.id = question.quiz_id where quiz.lesson_id = lesson.id and (not quiz.is_published or not quiz.is_active) and not quiz.is_test_data and answer.is_correct) <> 4
      or exists (select 1 from public.quiz_questions question join public.quizzes quiz on quiz.id = question.quiz_id where quiz.lesson_id = lesson.id and (not quiz.is_published or not quiz.is_active) and not quiz.is_test_data and (coalesce(btrim(question.question), '') = '' or coalesce(btrim(question.explanation), '') = ''))
      or exists (select 1 from public.quiz_answers answer join public.quiz_questions question on question.id = answer.question_id join public.quizzes quiz on quiz.id = question.quiz_id where quiz.lesson_id = lesson.id and (not quiz.is_published or not quiz.is_active) and not quiz.is_test_data and coalesce(btrim(answer.answer), '') = '')
      or exists (select 1 from public.quiz_questions question join public.quizzes quiz on quiz.id = question.quiz_id left join public.quiz_answers answer on answer.question_id = question.id where quiz.lesson_id = lesson.id and (not quiz.is_published or not quiz.is_active) and not quiz.is_test_data group by question.id having count(answer.id) <> 2 or count(answer.id) filter (where answer.is_correct) <> 1)
    );

  if history_incomplete_count <> 0 then
    raise exception 'Publication refusée : % leçon(s) Histoire-Géographie A1 ont des évaluations incomplètes.', history_incomplete_count;
  end if;

  for target in
    select lesson.id as lesson_id, chapter.id as chapter_id, offering.id as offering_id
    from public.lessons lesson
    join public.chapters chapter on chapter.id = lesson.chapter_id
    join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
    join public.subjects subject on subject.id = offering.subject_id
    join public.levels level on level.id = offering.level_id
    join public.series series on series.id = offering.series_id
    where subject.name = 'Informatique / TICE'
      and level.name = 'Terminale'
      and series.name in ('A1', 'A2', 'C', 'D')
      and not lesson.is_test_data
      and (
        coalesce(btrim(lesson.content), '') <> ''
        or exists (select 1 from public.lesson_sessions session where session.lesson_id = lesson.id and coalesce(btrim(session.content), '') <> '')
      )
  loop
    update public.course_subject_offerings set is_published = true where id = target.offering_id and not is_published;
    update public.chapters set is_active = true where id = target.chapter_id and not is_active;
    update public.lessons set is_active = true where id = target.lesson_id and not is_active and not is_test_data;
    update public.exercises set is_published = true, is_active = true where lesson_id = target.lesson_id and not is_test_data and (not is_published or not is_active);
    update public.quizzes set is_published = true, is_active = true where lesson_id = target.lesson_id and not is_test_data and (not is_published or not is_active);
  end loop;

  update public.exercises exercise
  set is_published = true, is_active = true
  from public.lessons lesson
  join public.chapters chapter on chapter.id = lesson.chapter_id
  join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
  join public.subjects subject on subject.id = offering.subject_id
  join public.levels level on level.id = offering.level_id
  join public.series series on series.id = offering.series_id
  where exercise.lesson_id = lesson.id
    and subject.name = 'Histoire-Géographie'
    and level.name = 'Terminale'
    and series.name = 'A1'
    and lesson.is_active
    and not lesson.is_test_data
    and not exercise.is_test_data
    and (not exercise.is_published or not exercise.is_active);

  update public.quizzes quiz
  set is_published = true, is_active = true
  from public.lessons lesson
  join public.chapters chapter on chapter.id = lesson.chapter_id
  join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
  join public.subjects subject on subject.id = offering.subject_id
  join public.levels level on level.id = offering.level_id
  join public.series series on series.id = offering.series_id
  where quiz.lesson_id = lesson.id
    and subject.name = 'Histoire-Géographie'
    and level.name = 'Terminale'
    and series.name = 'A1'
    and lesson.is_active
    and not lesson.is_test_data
    and not quiz.is_test_data
    and (not quiz.is_published or not quiz.is_active);
end $publish_history_a1_evaluations_and_informatics_terminal_do$;
