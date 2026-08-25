-- Publication contrôlée des cours de méthodologie Histoire-Géographie Terminale.
do $publish_history_methodology$
declare
  lesson_count integer;
  chapter_count integer;
  offering_count integer;
  exercise_count integer;
  exercise_question_count integer;
  quiz_count integer;
  quiz_question_count integer;
  quiz_answer_count integer;
  quiz_correct_count integer;
  activated_lesson_count integer;
  activated_chapter_count integer;
  published_offering_count integer;
  published_exercise_count integer;
  published_quiz_count integer;
begin
  select count(*) into lesson_count
  from public.lessons lesson
  join public.chapters chapter on chapter.id = lesson.chapter_id
  join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
  join public.levels level on level.id = offering.level_id
  join public.series serie on serie.id = offering.series_id
  join public.subjects subject on subject.id = offering.subject_id
  where level.name = 'Terminale' and serie.name in ('A1', 'A2', 'C', 'D')
    and subject.name = 'Histoire-Géographie'
    and chapter.title = 'PREMIÈRE PARTIE — NOTIONS DE MÉTHODOLOGIE'
    and lesson.title in ('Leçon 1 — Les techniques du commentaire de deux documents', 'Leçon 2 — Les techniques de la dissertation')
    and lesson.is_active = false and lesson.is_test_data = false
    and lesson.content like '%## Application guidée — Exemple méthodologique%';

  select count(distinct chapter.id) into chapter_count
  from public.chapters chapter
  join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
  join public.levels level on level.id = offering.level_id
  join public.series serie on serie.id = offering.series_id
  join public.subjects subject on subject.id = offering.subject_id
  where level.name = 'Terminale' and serie.name in ('A1', 'A2', 'C', 'D')
    and subject.name = 'Histoire-Géographie'
    and chapter.title = 'PREMIÈRE PARTIE — NOTIONS DE MÉTHODOLOGIE'
    and chapter.is_active = false and chapter.is_test_data = false;

  select count(distinct offering.id) into offering_count
  from public.course_subject_offerings offering
  join public.levels level on level.id = offering.level_id
  join public.series serie on serie.id = offering.series_id
  join public.subjects subject on subject.id = offering.subject_id
  where level.name = 'Terminale' and serie.name in ('A1', 'A2', 'C', 'D')
    and subject.name = 'Histoire-Géographie'
    and offering.is_published = true and offering.is_test_data = false;

  select count(*) into exercise_count
  from public.exercises exercise
  join public.lessons lesson on lesson.id = exercise.lesson_id
  join public.chapters chapter on chapter.id = lesson.chapter_id
  join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
  join public.levels level on level.id = offering.level_id
  join public.series serie on serie.id = offering.series_id
  join public.subjects subject on subject.id = offering.subject_id
  where level.name = 'Terminale' and serie.name in ('A1', 'A2', 'C', 'D')
    and subject.name = 'Histoire-Géographie' and chapter.title = 'PREMIÈRE PARTIE — NOTIONS DE MÉTHODOLOGIE'
    and lesson.title in ('Leçon 1 — Les techniques du commentaire de deux documents', 'Leçon 2 — Les techniques de la dissertation')
    and exercise.is_published = false and exercise.is_active = false and exercise.is_test_data = false;

  select count(*) into exercise_question_count
  from public.exercise_questions question
  join public.exercises exercise on exercise.id = question.exercise_id
  join public.lessons lesson on lesson.id = exercise.lesson_id
  join public.chapters chapter on chapter.id = lesson.chapter_id
  join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
  join public.levels level on level.id = offering.level_id
  join public.series serie on serie.id = offering.series_id
  join public.subjects subject on subject.id = offering.subject_id
  where level.name = 'Terminale' and serie.name in ('A1', 'A2', 'C', 'D')
    and subject.name = 'Histoire-Géographie' and chapter.title = 'PREMIÈRE PARTIE — NOTIONS DE MÉTHODOLOGIE'
    and lesson.title in ('Leçon 1 — Les techniques du commentaire de deux documents', 'Leçon 2 — Les techniques de la dissertation')
    and coalesce(length(trim(question.prompt_markdown)), 0) > 0
    and coalesce(length(trim(question.explanation_markdown)), 0) > 0
    and jsonb_array_length(question.correct_answers) = 1;

  select count(*) into quiz_count
  from public.quizzes quiz
  join public.lessons lesson on lesson.id = quiz.lesson_id
  join public.chapters chapter on chapter.id = lesson.chapter_id
  join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
  join public.levels level on level.id = offering.level_id
  join public.series serie on serie.id = offering.series_id
  join public.subjects subject on subject.id = offering.subject_id
  where level.name = 'Terminale' and serie.name in ('A1', 'A2', 'C', 'D')
    and subject.name = 'Histoire-Géographie' and chapter.title = 'PREMIÈRE PARTIE — NOTIONS DE MÉTHODOLOGIE'
    and lesson.title in ('Leçon 1 — Les techniques du commentaire de deux documents', 'Leçon 2 — Les techniques de la dissertation')
    and quiz.is_published = false and quiz.is_active = false and quiz.is_test_data = false;

  select count(*) into quiz_question_count
  from public.quiz_questions question
  join public.quizzes quiz on quiz.id = question.quiz_id
  join public.lessons lesson on lesson.id = quiz.lesson_id
  join public.chapters chapter on chapter.id = lesson.chapter_id
  join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
  join public.levels level on level.id = offering.level_id
  join public.series serie on serie.id = offering.series_id
  join public.subjects subject on subject.id = offering.subject_id
  where level.name = 'Terminale' and serie.name in ('A1', 'A2', 'C', 'D')
    and subject.name = 'Histoire-Géographie' and chapter.title = 'PREMIÈRE PARTIE — NOTIONS DE MÉTHODOLOGIE'
    and lesson.title in ('Leçon 1 — Les techniques du commentaire de deux documents', 'Leçon 2 — Les techniques de la dissertation')
    and coalesce(length(trim(question.question)), 0) > 0 and question.is_active = true;

  select count(*), count(*) filter (where answer.is_correct) into quiz_answer_count, quiz_correct_count
  from public.quiz_answers answer
  join public.quiz_questions question on question.id = answer.question_id
  join public.quizzes quiz on quiz.id = question.quiz_id
  join public.lessons lesson on lesson.id = quiz.lesson_id
  join public.chapters chapter on chapter.id = lesson.chapter_id
  join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
  join public.levels level on level.id = offering.level_id
  join public.series serie on serie.id = offering.series_id
  join public.subjects subject on subject.id = offering.subject_id
  where level.name = 'Terminale' and serie.name in ('A1', 'A2', 'C', 'D')
    and subject.name = 'Histoire-Géographie' and chapter.title = 'PREMIÈRE PARTIE — NOTIONS DE MÉTHODOLOGIE'
    and lesson.title in ('Leçon 1 — Les techniques du commentaire de deux documents', 'Leçon 2 — Les techniques de la dissertation')
    and coalesce(length(trim(answer.answer)), 0) > 0;

  if lesson_count <> 8 or chapter_count <> 4 or offering_count <> 4
    or exercise_count <> 16 or exercise_question_count <> 64
    or quiz_count <> 8 or quiz_question_count <> 32 or quiz_answer_count <> 96 or quiz_correct_count <> 32 then
    raise exception 'Publication méthodologie refusée : leçons %, chapitres %, offres %, exercices %, questions exercice %, quiz %, questions quiz %, réponses %, bonnes réponses %.', lesson_count, chapter_count, offering_count, exercise_count, exercise_question_count, quiz_count, quiz_question_count, quiz_answer_count, quiz_correct_count;
  end if;

  update public.lessons lesson set is_active = true, updated_at = now()
  from public.chapters chapter join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
    join public.levels level on level.id = offering.level_id join public.series serie on serie.id = offering.series_id
    join public.subjects subject on subject.id = offering.subject_id
  where lesson.chapter_id = chapter.id and level.name = 'Terminale' and serie.name in ('A1', 'A2', 'C', 'D')
    and subject.name = 'Histoire-Géographie' and chapter.title = 'PREMIÈRE PARTIE — NOTIONS DE MÉTHODOLOGIE'
    and lesson.title in ('Leçon 1 — Les techniques du commentaire de deux documents', 'Leçon 2 — Les techniques de la dissertation')
    and lesson.is_active = false;
  get diagnostics activated_lesson_count = row_count;

  update public.chapters chapter set is_active = true, updated_at = now()
  from public.course_subject_offerings offering join public.levels level on level.id = offering.level_id
    join public.series serie on serie.id = offering.series_id join public.subjects subject on subject.id = offering.subject_id
  where chapter.subject_offering_id = offering.id and level.name = 'Terminale' and serie.name in ('A1', 'A2', 'C', 'D')
    and subject.name = 'Histoire-Géographie' and chapter.title = 'PREMIÈRE PARTIE — NOTIONS DE MÉTHODOLOGIE'
    and chapter.is_active = false;
  get diagnostics activated_chapter_count = row_count;

  update public.course_subject_offerings offering set is_published = true, updated_at = now()
  from public.levels level join public.series serie on true join public.subjects subject on true
  where offering.level_id = level.id and offering.series_id = serie.id and offering.subject_id = subject.id
    and level.name = 'Terminale' and serie.name in ('A1', 'A2', 'C', 'D')
    and subject.name = 'Histoire-Géographie' and offering.is_test_data = false;
  get diagnostics published_offering_count = row_count;

  update public.exercises exercise set is_published = true, is_active = true, updated_at = now()
  from public.lessons lesson join public.chapters chapter on chapter.id = lesson.chapter_id
    join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id join public.levels level on level.id = offering.level_id
    join public.series serie on serie.id = offering.series_id join public.subjects subject on subject.id = offering.subject_id
  where exercise.lesson_id = lesson.id and level.name = 'Terminale' and serie.name in ('A1', 'A2', 'C', 'D')
    and subject.name = 'Histoire-Géographie' and chapter.title = 'PREMIÈRE PARTIE — NOTIONS DE MÉTHODOLOGIE'
    and lesson.title in ('Leçon 1 — Les techniques du commentaire de deux documents', 'Leçon 2 — Les techniques de la dissertation')
    and exercise.is_published = false and exercise.is_active = false;
  get diagnostics published_exercise_count = row_count;

  update public.quizzes quiz set is_published = true, is_active = true, updated_at = now()
  from public.lessons lesson join public.chapters chapter on chapter.id = lesson.chapter_id
    join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id join public.levels level on level.id = offering.level_id
    join public.series serie on serie.id = offering.series_id join public.subjects subject on subject.id = offering.subject_id
  where quiz.lesson_id = lesson.id and level.name = 'Terminale' and serie.name in ('A1', 'A2', 'C', 'D')
    and subject.name = 'Histoire-Géographie' and chapter.title = 'PREMIÈRE PARTIE — NOTIONS DE MÉTHODOLOGIE'
    and lesson.title in ('Leçon 1 — Les techniques du commentaire de deux documents', 'Leçon 2 — Les techniques de la dissertation')
    and quiz.is_published = false and quiz.is_active = false;
  get diagnostics published_quiz_count = row_count;

  if activated_lesson_count <> 8 or activated_chapter_count <> 4 or published_offering_count <> 4 or published_exercise_count <> 16 or published_quiz_count <> 8 then
    raise exception 'Publication méthodologie incomplète : leçons %, chapitres %, offres %, exercices %, quiz %.', activated_lesson_count, activated_chapter_count, published_offering_count, published_exercise_count, published_quiz_count;
  end if;
end $publish_history_methodology$;
