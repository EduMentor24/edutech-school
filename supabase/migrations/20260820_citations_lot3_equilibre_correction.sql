-- Ajustement des thèmes du lot Citations 3 après contrôle d’équilibre.
-- Les citations restent en brouillon ; toute ligne publiée ou validée bloque la transaction.
do $citations_lot3_balance$
declare seed record; citation_uuid uuid;
begin
  for seed in select * from (values
      ('Français','Quiconque a beaucoup vu, peut avoir beaucoup retenu.','Jean de La Fontaine','Prévoyance',null),
      ('Philosophie','Céder à la force est un acte de nécessité, non de volonté.','Jean-Jacques Rousseau','Aliénation',null),
      ('Philosophie','Renoncer à sa liberté c’est renoncer à sa qualité d’homme, aux droits de l’humanité, même à ses devoirs.','Jean-Jacques Rousseau','Aliénation',null),
      ('Philosophie','L’obéissance à la loi qu’on s’est prescrite est liberté.','Jean-Jacques Rousseau','Autonomie',null),
      ('Philosophie','La volonté générale est toujours droite et tend toujours à l’utilité publique.','Jean-Jacques Rousseau','Autonomie',null),
      ('Philosophie','Il faut donc des conventions et des lois pour unir les droits aux devoirs et ramener la justice à son objet.','Jean-Jacques Rousseau','Citoyenneté',null),
      ('Histoire-Géographie','Toutes les personnes ont droit à une égale protection de la loi.','Organisation de l’unité africaine','Égalité',null),
      ('Histoire-Géographie','La personne humaine est inviolable.','Organisation de l’unité africaine','Droits fondamentaux',null),
      ('Histoire-Géographie','Tout individu a droit au respect de la dignité inhérente à la personne humaine.','Organisation de l’unité africaine','Droits fondamentaux',null),
      ('Histoire-Géographie','Tout individu a droit à la liberté et à la sécurité de sa personne.','Organisation de l’unité africaine','Libertés publiques',null),
      ('Histoire-Géographie','Toute personne a droit à l’information.','Organisation de l’unité africaine','Libertés publiques',null),
      ('Histoire-Géographie','Toute personne a le droit de travailler dans des conditions équitables et satisfaisantes.','Organisation de l’unité africaine','Droits sociaux',null),
      ('Histoire-Géographie','Toute personne a droit à l’éducation.','Organisation de l’unité africaine','Droits sociaux',null),
      ('Histoire-Géographie','Tout peuple a droit à l’existence.','Organisation de l’unité africaine','Peuples',null),
      ('Histoire-Géographie','Les peuples ont la libre disposition de leurs richesses et de leurs ressources naturelles.','Organisation de l’unité africaine','Développement',null),
      ('Histoire-Géographie','Tous les peuples ont droit à un environnement satisfaisant et global, propice à leur développement.','Organisation de l’unité africaine','Paix',null),
      ('Histoire-Géographie','Les États parties à la présente Charte ont le devoir de promouvoir et d’assurer, par l’enseignement, l’éducation et la diffusion, le respect des droits et des libertés.','Organisation de l’unité africaine','Citoyenneté',null),
      ('Histoire-Géographie','Chaque individu a des devoirs envers la famille et la société, envers l’État et les autres collectivités légalement reconnues et envers la Communauté Internationale.','Organisation de l’unité africaine','Société',null),
      ('Histoire-Géographie','Chaque individu a le devoir de respecter et de considérer ses semblables sans discrimination aucune.','Organisation de l’unité africaine','Non-discrimination',null),
      ('Physique-Chimie','L’idée expérimentale est donc aussi une idée a priori, mais c’est une idée qui se présente sous la forme d’une hypothèse.','Claude Bernard','Idée expérimentale',null),
      ('Physique-Chimie','Une recherche expérimentale a pour point de départ une observation.','Claude Bernard','Recherche',null),
      ('Physique-Chimie','Une recherche expérimentale a pour point de départ une hypothèse ou une théorie.','Claude Bernard','Recherche',null),
      ('Physique-Chimie','Il n’y a pas des forces en opposition et en lutte les unes avec les autres ; dans la nature il ne saurait y avoir qu’arrangement et dérangement, qu’harmonie et désharmonie.','Claude Bernard','Causalité',null),
      ('Physique-Chimie','Toute l’initiative expérimentale est dans l’idée, car c’est elle qui provoque l’expérience.','Claude Bernard','Idée expérimentale',null)
  ) as source(subject_name,current_quote,author,target_theme,corrected_quote) loop
    select c.id into citation_uuid
    from public.citations c join public.subjects sub on sub.id=c.subject_id
    where sub.name=seed.subject_name and c.quote_text=seed.current_quote and c.author=seed.author and c.is_active=false and c.is_validated=false
    limit 1;
    if citation_uuid is null then raise exception 'Citation brouillon à corriger introuvable ou non modifiable : % / %', seed.subject_name, seed.current_quote; end if;
    if seed.corrected_quote is not null then
      update public.citations set quote_text=seed.corrected_quote where id=citation_uuid and is_active=false and is_validated=false;
    end if;
    delete from public.citation_themes where citation_id=citation_uuid;
    insert into public.citation_themes (citation_id,theme) values (citation_uuid,seed.target_theme);
  end loop;
end;
$citations_lot3_balance$;
