do $citation_philosophie_complement$
declare
  subject_uuid uuid;
  citation_uuid uuid;
begin
  select id into subject_uuid from public.subjects where name = 'Philosophie' limit 1;
  if subject_uuid is null then
    raise exception 'La matière Philosophie est introuvable.';
  end if;

  insert into public.citations (subject_id,quote_text,author,source_title,source_reference,source_url,pedagogical_explanation,keywords,is_active,is_validated)
  select subject_uuid,
    'L’homme est né libre, & par-tout il est dans les fers.',
    'Jean-Jacques Rousseau',
    'Du contrat social',
    'Livre I, chapitre I',
    'https://fr.wikisource.org/wiki/Du_contrat_social/%C3%89dition_1762/Texte_entier',
    'Cette formule permet d’introduire l’écart entre la liberté naturelle affirmée par Rousseau et les formes historiques de dépendance politique.',
    array['Rousseau','liberté','politique'],
    false,false
  where not exists (
    select 1 from public.citations c
    where c.subject_id = subject_uuid
      and c.quote_text = 'L’homme est né libre, & par-tout il est dans les fers.'
      and c.author = 'Jean-Jacques Rousseau'
  )
  returning id into citation_uuid;

  if citation_uuid is not null then
    insert into public.citation_scopes (citation_id,level_id,series_id)
    select citation_uuid, lv.id, s.id
    from public.levels lv cross join public.series s
    where lv.name = 'Terminale' and s.name in ('A1', 'A2', 'C', 'D');

    insert into public.citation_themes (citation_id,theme) values (citation_uuid,'Liberté');
  end if;
end
$citation_philosophie_complement$;
