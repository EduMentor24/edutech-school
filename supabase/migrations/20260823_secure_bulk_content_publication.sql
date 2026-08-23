-- Publication groupée sécurisée, limitée à un chapitre ou à une unité (leçon).
-- Aucun contenu n’est publié par cette migration : elle expose uniquement des RPC administratives protégées.

create or replace function public.edutech_content_publication_scope(
  p_scope text,
  p_target_id uuid,
  p_apply boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_chapter public.chapters%rowtype;
  v_lesson public.lessons%rowtype;
  v_offering public.course_subject_offerings%rowtype;
  v_subject public.subjects%rowtype;
  v_target_lesson_id uuid;
  v_valid_lessons integer := 0;
  v_valid_exercises integer := 0;
  v_valid_quizzes integer := 0;
  v_skipped_exercises integer := 0;
  v_skipped_quizzes integer := 0;
  v_changed_lessons integer := 0;
  v_changed_exercises integer := 0;
  v_changed_quizzes integer := 0;
begin
  if auth.uid() is null or not public.is_edutech_admin() then
    raise exception 'Accès réservé à un administrateur authentifié.';
  end if;

  if p_scope not in ('chapter', 'lesson') then
    raise exception 'Le périmètre de publication doit être chapter ou lesson.';
  end if;

  if p_scope = 'chapter' then
    select * into v_chapter from public.chapters where id = p_target_id;
  else
    select * into v_lesson from public.lessons where id = p_target_id;
    if not found then
      raise exception 'L’unité demandée est introuvable.';
    end if;
    v_target_lesson_id := v_lesson.id;
    select * into v_chapter from public.chapters where id = v_lesson.chapter_id;
  end if;

  if not found then
    raise exception 'Le chapitre demandé est introuvable.';
  end if;
  if v_chapter.is_test_data then
    raise exception 'Les contenus de test ne peuvent pas être publiés par lot.';
  end if;

  select * into v_offering from public.course_subject_offerings where id = v_chapter.subject_offering_id;
  if not found or v_offering.is_test_data then
    raise exception 'L’offre pédagogique demandée est introuvable ou protégée.';
  end if;
  select * into v_subject from public.subjects where id = v_offering.subject_id;
  if not found or v_subject.is_test_data then
    raise exception 'La matière demandée est introuvable ou protégée.';
  end if;

  select count(*) into v_valid_lessons
  from public.lessons le
  where le.chapter_id = v_chapter.id
    and (v_target_lesson_id is null or le.id = v_target_lesson_id)
    and not le.is_test_data
    and nullif(btrim(coalesce(le.content, '')), '') is not null;

  select count(*) into v_valid_exercises
  from public.exercises e
  where e.chapter_id = v_chapter.id
    and (v_target_lesson_id is null or e.lesson_id = v_target_lesson_id)
    and not e.is_test_data
    and exists (select 1 from public.exercise_questions eq where eq.exercise_id = e.id);

  select count(*) into v_skipped_exercises
  from public.exercises e
  where e.chapter_id = v_chapter.id
    and (v_target_lesson_id is null or e.lesson_id = v_target_lesson_id)
    and not e.is_test_data
    and not exists (select 1 from public.exercise_questions eq where eq.exercise_id = e.id);

  select count(*) into v_valid_quizzes
  from public.quizzes q
  where q.chapter_id = v_chapter.id
    and (v_target_lesson_id is null or q.lesson_id = v_target_lesson_id)
    and not q.is_test_data
    and exists (select 1 from public.quiz_questions qq where qq.quiz_id = q.id);

  select count(*) into v_skipped_quizzes
  from public.quizzes q
  where q.chapter_id = v_chapter.id
    and (v_target_lesson_id is null or q.lesson_id = v_target_lesson_id)
    and not q.is_test_data
    and not exists (select 1 from public.quiz_questions qq where qq.quiz_id = q.id);

  if p_apply then
    if v_valid_lessons + v_valid_exercises + v_valid_quizzes = 0 then
      raise exception 'Aucun contenu complet et publiable n’a été trouvé dans ce périmètre.';
    end if;

    update public.subjects set is_active = true where id = v_subject.id;
    update public.course_subject_offerings set is_published = true where id = v_offering.id;
    update public.chapters set is_active = true where id = v_chapter.id;

    update public.lessons le
      set is_active = true
    where le.chapter_id = v_chapter.id
      and (v_target_lesson_id is null or le.id = v_target_lesson_id)
      and not le.is_test_data
      and nullif(btrim(coalesce(le.content, '')), '') is not null
      and not le.is_active;
    get diagnostics v_changed_lessons = row_count;

    update public.exercises e
      set is_active = true, is_published = true
    where e.chapter_id = v_chapter.id
      and (v_target_lesson_id is null or e.lesson_id = v_target_lesson_id)
      and not e.is_test_data
      and exists (select 1 from public.exercise_questions eq where eq.exercise_id = e.id)
      and (not e.is_active or not e.is_published);
    get diagnostics v_changed_exercises = row_count;

    update public.quizzes q
      set is_active = true, is_published = true
    where q.chapter_id = v_chapter.id
      and (v_target_lesson_id is null or q.lesson_id = v_target_lesson_id)
      and not q.is_test_data
      and exists (select 1 from public.quiz_questions qq where qq.quiz_id = q.id)
      and (not q.is_active or not q.is_published);
    get diagnostics v_changed_quizzes = row_count;

    update public.quiz_questions qq
      set is_active = true
    from public.quizzes q
    where qq.quiz_id = q.id
      and q.chapter_id = v_chapter.id
      and (v_target_lesson_id is null or q.lesson_id = v_target_lesson_id)
      and q.is_active
      and q.is_published;
  end if;

  return jsonb_build_object(
    'scope', p_scope,
    'targetId', p_target_id,
    'targetTitle', case when p_scope = 'lesson' then v_lesson.title else v_chapter.title end,
    'chapterId', v_chapter.id,
    'chapterTitle', v_chapter.title,
    'subjectOfferingId', v_offering.id,
    'willActivateSubject', not v_subject.is_active,
    'willPublishOffering', not v_offering.is_published,
    'willActivateChapter', not v_chapter.is_active,
    'publishable', jsonb_build_object('lessons', v_valid_lessons, 'exercises', v_valid_exercises, 'quizzes', v_valid_quizzes),
    'skipped', jsonb_build_object('exercisesWithoutQuestion', v_skipped_exercises, 'quizzesWithoutQuestion', v_skipped_quizzes),
    'applied', p_apply,
    'changed', jsonb_build_object('lessons', v_changed_lessons, 'exercises', v_changed_exercises, 'quizzes', v_changed_quizzes)
  );
end;
$$;

revoke all on function public.edutech_content_publication_scope(text, uuid, boolean) from public;
revoke all on function public.edutech_content_publication_scope(text, uuid, boolean) from anon;
grant execute on function public.edutech_content_publication_scope(text, uuid, boolean) to authenticated;

create or replace function public.edutech_preview_content_publication(p_scope text, p_target_id uuid)
returns jsonb
language sql
security definer
set search_path = public
as $$
  select public.edutech_content_publication_scope(p_scope, p_target_id, false);
$$;

create or replace function public.edutech_publish_content_scope(p_scope text, p_target_id uuid)
returns jsonb
language sql
security definer
set search_path = public
as $$
  select public.edutech_content_publication_scope(p_scope, p_target_id, true);
$$;

revoke all on function public.edutech_preview_content_publication(text, uuid) from public;
revoke all on function public.edutech_preview_content_publication(text, uuid) from anon;
grant execute on function public.edutech_preview_content_publication(text, uuid) to authenticated;
revoke all on function public.edutech_publish_content_scope(text, uuid) from public;
revoke all on function public.edutech_publish_content_scope(text, uuid) from anon;
grant execute on function public.edutech_publish_content_scope(text, uuid) to authenticated;
