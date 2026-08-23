-- Préparation de structure uniquement : Unit 3 Development Issues manquante en Terminale A2.
-- Aucun cours, exercice, quiz, contenu pédagogique ou publication n’est créé.
do $english_terminal_unit3_structure$
declare
  a2_chapter_uuid uuid;
  offering_count integer;
  existing_lesson_uuid uuid;
begin
  select count(*) into offering_count
  from public.course_subject_offerings
  where id in (
    '81c5b295-b5d4-4a7c-a922-0604236a4aa8',
    '0bc8f25a-432a-441b-8a86-303b452aaf9f',
    'ff97ed10-ea0d-4e7e-9dd1-8010229c03b6',
    '94543938-fd4c-4ba8-8205-35f765264719'
  );

  if offering_count <> 4 then
    raise exception 'Les quatre offres Anglais Terminale A1/A2/C/D sont requises ; transaction annulée.';
  end if;

  select c.id into a2_chapter_uuid
  from public.chapters c
  where c.subject_offering_id = '0bc8f25a-432a-441b-8a86-303b452aaf9f'
    and c.title = 'PROGRESSION TERMINALE A'
  limit 1;

  if a2_chapter_uuid is null then
    raise exception 'Le chapitre Anglais Terminale A attendu est absent pour la série A2.';
  end if;

  select le.id into existing_lesson_uuid
  from public.lessons le
  where le.chapter_id = a2_chapter_uuid
    and le.title = 'UNIT 3 DEVELOPMENT ISSUES'
  limit 1;

  if existing_lesson_uuid is not null then
    raise exception 'La structure Unit 3 Development Issues existe déjà en A2 ; aucun doublon n’est autorisé.';
  end if;

  insert into public.lessons (chapter_id, title, display_order, is_active)
  values (a2_chapter_uuid, 'UNIT 3 DEVELOPMENT ISSUES', 30, false);
end
$english_terminal_unit3_structure$;
