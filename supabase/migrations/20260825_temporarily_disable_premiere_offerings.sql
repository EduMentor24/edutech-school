-- Désactivation temporaire, réversible et sans suppression de la structure Première.
-- Les offres pourront être réactivées par une migration contrôlée lorsque leurs contenus seront prêts.
do $temporarily_disable_premiere_offerings$
declare
  offering_total integer;
  published_offering_total integer;
  active_chapter_total integer;
  active_lesson_total integer;
  disabled_offering_total integer;
begin
  select count(*), count(*) filter (where offering.is_published)
    into offering_total, published_offering_total
  from public.course_subject_offerings offering
  join public.levels level on level.id = offering.level_id
  where level.name = 'Première';

  select count(*) into active_chapter_total
  from public.chapters chapter
  join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
  join public.levels level on level.id = offering.level_id
  where level.name = 'Première' and chapter.is_active;

  select count(*) into active_lesson_total
  from public.lessons lesson
  join public.chapters chapter on chapter.id = lesson.chapter_id
  join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
  join public.levels level on level.id = offering.level_id
  where level.name = 'Première' and lesson.is_active;

  if offering_total <> 56 or published_offering_total <> 36 or active_chapter_total <> 0 or active_lesson_total <> 0 then
    raise exception 'Désactivation Première refusée : périmètre inattendu (offres %, publiées %, chapitres actifs %, leçons actives %).', offering_total, published_offering_total, active_chapter_total, active_lesson_total;
  end if;

  update public.course_subject_offerings offering
  set is_published = false
  from public.levels level
  where level.id = offering.level_id
    and level.name = 'Première'
    and offering.is_published;

  get diagnostics disabled_offering_total = row_count;
  if disabled_offering_total <> 36 then
    raise exception 'Désactivation Première refusée : 36 offres étaient attendues, % désactivées.', disabled_offering_total;
  end if;
end $temporarily_disable_premiere_offerings$;
