-- Compléments du lot Citations 3 : remplacement de trois passages déjà présents avant le lot.
-- Citations authentiques, non publiées et inactives ; insertion anti-doublon.
do $citations_lot3_complements$
declare seed record; subject_uuid uuid; citation_uuid uuid;
begin
  for seed in select * from (values
      ('Français','Je le répète avec une certitude plus véhémente : la vérité est en marche, et rien ne l’arrêtera.','Émile Zola','J’accuse…!','Lettre à M. Félix Faure, L’Aurore, 13 janvier 1898','https://fr.wikisource.org/wiki/J%E2%80%99accuse%E2%80%A6!','Justice','Cette phrase place la vérité au cœur d’une exigence de justice. Elle permet d’étudier la fonction civique de l’écrivain, l’argumentation engagée et le refus de l’erreur judiciaire.',array['Zola', 'vérité', 'justice', 'argumentation', 'Dreyfus']::text[]),
      ('Français','Tous pour un, un pour tous.','Alexandre Dumas','Les Trois Mousquetaires','Chapitre IX, « D’Artagnan se dessine »','https://fr.wikisource.org/wiki/Les_Trois_Mousquetaires/Texte_entier','Solidarité','La devise des mousquetaires condense l’idée d’entraide réciproque : chacun protège le groupe et le groupe protège chacun. Elle sert à analyser la fraternité, la loyauté et la force du collectif dans le récit.',array['Dumas', 'solidarité', 'entraide', 'fraternité', 'récit']::text[]),
      ('Philosophie','Enfin chacun se donnant à tous ne se donne à personne.','Jean-Jacques Rousseau','Du contrat social','Livre I, chapitre VI, « Du pacte social »','https://fr.wikisource.org/wiki/Du_contrat_social/%C3%89dition_1762/Livre_I/Chapitre_6','Autonomie','Rousseau explique la réciprocité du pacte social : l’engagement envers la communauté ne soumet pas le citoyen à une volonté particulière. La phrase éclaire le lien entre association, égalité politique et autonomie.',array['Rousseau', 'autonomie', 'pacte social', 'réciprocité', 'citoyen']::text[])
  ) as source(subject_name,quote_text,author,source_title,source_reference,source_url,theme,pedagogical_explanation,keywords) loop
    select id into subject_uuid from public.subjects where name=seed.subject_name limit 1;
    if subject_uuid is null then raise exception 'Matière de citation introuvable : %', seed.subject_name; end if;
    insert into public.citations (subject_id,quote_text,author,source_title,source_reference,source_url,pedagogical_explanation,keywords,is_active,is_validated)
    select subject_uuid,seed.quote_text,seed.author,seed.source_title,seed.source_reference,seed.source_url,seed.pedagogical_explanation,seed.keywords,false,false
    where not exists (select 1 from public.citations c where c.subject_id=subject_uuid and c.quote_text=seed.quote_text and c.author=seed.author)
    returning id into citation_uuid;
    if citation_uuid is not null then
      insert into public.citation_scopes (citation_id,level_id,series_id)
      select citation_uuid,lv.id,se.id from public.levels lv cross join public.series se where lv.name='Terminale' and se.name in ('A1','A2','C','D');
      insert into public.citation_themes (citation_id,theme) values (citation_uuid,seed.theme);
    end if;
  end loop;
end;
$citations_lot3_complements$;
