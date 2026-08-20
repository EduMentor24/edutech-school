-- Brouillons Terminale A1/A2/C/D : Géographie (Corée du Sud, CEDEAO, UE/ACP)
-- Citations : dix nouvelles citations authentiques par matière disponible, toutes non validées et inactives.
do $geographie_coree_cedeao_ueacp$
declare
  science record;
  target record;
  citation_seed record;
  chapter_uuid uuid;
  theme2_uuid uuid;
  theme3_uuid uuid;
  citation_subject_uuid uuid;
  citation_uuid uuid;
  exercise_a uuid;
  exercise_b uuid;
  quiz_uuid uuid;
  expected_count integer;
  course_description text;
  course_text text;
  title_exercise_a text;
  title_exercise_b text;
  title_quiz text;
begin
  -- Les séries scientifiques possèdent l'offre Histoire-Géographie ; les deux thèmes de Géographie sont créés sans réordonner les chapitres antérieurs.
  for science in
    select o.id as offering_id
    from public.course_subject_offerings o
    join public.subjects sub on sub.id = o.subject_id
    join public.levels lv on lv.id = o.level_id
    join public.series s on s.id = o.series_id
    where sub.name = 'Histoire-Géographie' and lv.name = 'Terminale' and s.name in ('C','D')
  loop
    insert into public.chapters (subject_id,level_id,series_id,subject_offering_id,title,description,display_order,is_test_data,is_active)
    select o.subject_id,o.level_id,o.series_id,o.id,
      'THÈME 2 — LA CORÉE DU SUD : UN EXEMPLE DE PAYS ÉMERGENT',
      'Les fondements du développement économique de la Corée du Sud.',
      60,false,false
    from public.course_subject_offerings o
    where o.id = science.offering_id
      and not exists (select 1 from public.chapters c where c.subject_offering_id=o.id and c.title='THÈME 2 — LA CORÉE DU SUD : UN EXEMPLE DE PAYS ÉMERGENT');

    select id into theme2_uuid from public.chapters
    where subject_offering_id=science.offering_id and title='THÈME 2 — LA CORÉE DU SUD : UN EXEMPLE DE PAYS ÉMERGENT' limit 1;
    if theme2_uuid is null then raise exception 'Thème 2 de Géographie introuvable pour la série scientifique.'; end if;

    insert into public.lessons (chapter_id,title,description,content,display_order,is_test_data,is_active)
    select theme2_uuid,'Leçon 1 — Les fondements du développement économique de la Corée du Sud',
      'Milieu, capital humain, État-développeur et stratégies d’industrialisation de la Corée du Sud.',null,10,false,false
    where not exists (select 1 from public.lessons l where l.chapter_id=theme2_uuid and l.title='Leçon 1 — Les fondements du développement économique de la Corée du Sud');

    insert into public.chapters (subject_id,level_id,series_id,subject_offering_id,title,description,display_order,is_test_data,is_active)
    select o.subject_id,o.level_id,o.series_id,o.id,
      'THÈME 3 — REGROUPEMENT ET COOPÉRATION ÉCONOMIQUE',
      'Intégration régionale, CEDEAO et coopération économique Nord-Sud.',
      70,false,false
    from public.course_subject_offerings o
    where o.id = science.offering_id
      and not exists (select 1 from public.chapters c where c.subject_offering_id=o.id and c.title='THÈME 3 — REGROUPEMENT ET COOPÉRATION ÉCONOMIQUE');

    select id into theme3_uuid from public.chapters
    where subject_offering_id=science.offering_id and title='THÈME 3 — REGROUPEMENT ET COOPÉRATION ÉCONOMIQUE' limit 1;
    if theme3_uuid is null then raise exception 'Thème 3 de Géographie introuvable pour la série scientifique.'; end if;

    insert into public.lessons (chapter_id,title,description,content,display_order,is_test_data,is_active)
    select theme3_uuid,seed.title,seed.description,null,seed.display_order,false,false
    from (values
      ('Leçon 1 — La CEDEAO : une organisation régionale à caractère économique','Origines, objectifs, institutions, acquis et limites de la CEDEAO.',10),
      ('Leçon 2 — Les relations UE/ACP : un exemple de coopération Nord-Sud','Partenaires, cadres, domaines, bilan et enjeux de la coopération UE/ACP.',20)
    ) as seed(title,description,display_order)
    where not exists (select 1 from public.lessons l where l.chapter_id=theme3_uuid and l.title=seed.title);
  end loop;

  select count(*) into expected_count
  from public.lessons l
  join public.chapters c on c.id=l.chapter_id
  join public.course_subject_offerings o on o.id=c.subject_offering_id
  join public.subjects sub on sub.id=o.subject_id
  join public.levels lv on lv.id=o.level_id
  join public.series s on s.id=o.series_id
  where sub.name='Histoire-Géographie' and lv.name='Terminale' and s.name in ('A1','A2','C','D')
    and (
      (c.title='THÈME 2 — LA CORÉE DU SUD : UN EXEMPLE DE PAYS ÉMERGENT' and l.title='Leçon 1 — Les fondements du développement économique de la Corée du Sud')
      or (c.title='THÈME 3 — REGROUPEMENT ET COOPÉRATION ÉCONOMIQUE' and l.title in ('Leçon 1 — La CEDEAO : une organisation régionale à caractère économique','Leçon 2 — Les relations UE/ACP : un exemple de coopération Nord-Sud'))
    );
  if expected_count <> 12 then raise exception 'Douze leçons cibles sont requises avant tout remplissage ; transaction annulée.'; end if;

  for target in
    select l.id lesson_id,c.id chapter_id,o.id offering_id,o.subject_id,o.level_id,o.series_id,
      case l.title
        when 'Leçon 1 — Les fondements du développement économique de la Corée du Sud' then 'coree'
        when 'Leçon 1 — La CEDEAO : une organisation régionale à caractère économique' then 'cedeao'
        else 'ue_acp'
      end as lesson_key
    from public.lessons l
    join public.chapters c on c.id=l.chapter_id
    join public.course_subject_offerings o on o.id=c.subject_offering_id
    join public.subjects sub on sub.id=o.subject_id
    join public.levels lv on lv.id=o.level_id
    join public.series s on s.id=o.series_id
    where sub.name='Histoire-Géographie' and lv.name='Terminale' and s.name in ('A1','A2','C','D')
      and (
        (c.title='THÈME 2 — LA CORÉE DU SUD : UN EXEMPLE DE PAYS ÉMERGENT' and l.title='Leçon 1 — Les fondements du développement économique de la Corée du Sud')
        or (c.title='THÈME 3 — REGROUPEMENT ET COOPÉRATION ÉCONOMIQUE' and l.title in ('Leçon 1 — La CEDEAO : une organisation régionale à caractère économique','Leçon 2 — Les relations UE/ACP : un exemple de coopération Nord-Sud'))
      )
    order by s.name,c.display_order,l.display_order
  loop
    if exists (select 1 from public.lessons where id=target.lesson_id and coalesce(btrim(content),'') <> '') then
      raise exception 'La leçon % contient déjà un cours. Écrasement interdit.', target.lesson_id;
    end if;

    if target.lesson_key='coree' then
      course_description := 'Milieu, capital humain, État-développeur et stratégies d’industrialisation de la Corée du Sud.';
      course_text := $coree$
## Les fondements du développement économique de la Corée du Sud

> **Objectif :** expliquer comment un pays disposant de ressources naturelles limitées a construit une économie industrialisée et tournée vers les exportations.

## 1. Un territoire contraignant mais valorisé

La Corée du Sud occupe la partie méridionale de la péninsule coréenne. Son relief est majoritairement montagneux et les plaines utiles à l’agriculture sont limitées, surtout sur les littoraux et dans quelques vallées. Le climat continental, la mousson, les typhons et les sécheresses peuvent fragiliser les activités agricoles et les infrastructures.

> **Définition : pays émergent.** Pays dont l’économie connaît une industrialisation et une croissance rapides, tout en conservant certains défis sociaux, territoriaux ou environnementaux.  
> **Définition : mousson.** Alternance saisonnière de vents qui provoque souvent une saison très pluvieuse et une saison plus sèche.

Ces contraintes n’ont pas été niées : elles ont été aménagées. La reforestation, l’irrigation, l’exploitation raisonnée du littoral, les ports et la pêche participent à la valorisation du territoire. Le support rappelle toutefois que les ressources minières et énergétiques sont limitées : le pays a donc dû importer une part de ses matières premières et construire sa richesse par la transformation industrielle, la qualification et le commerce extérieur.

## 2. Le capital humain au cœur de la stratégie

La population sud-coréenne a constitué un fondement essentiel du développement. Les investissements dans l’éducation, la formation des cadres, la recherche et l’organisation du travail ont permis de créer des compétences adaptées à l’industrie et aux technologies.

> **Définition : capital humain.** Ensemble des connaissances, qualifications, expériences et aptitudes de la population qui peuvent améliorer la production et l’innovation.  
> **Attention :** une population dynamique n’est pas automatiquement un avantage. Elle devient un capital humain lorsque la formation, la santé, l’emploi et la recherche permettent de valoriser ses capacités.

Le cours mentionne aussi le vieillissement de la population. Ce phénomène rappelle qu’un développement durable doit anticiper les besoins futurs : financement social, renouvellement de la main-d’œuvre, innovation et productivité.

## 3. L’action d’un État-développeur

Après la guerre de Corée, les choix publics ont joué un rôle décisif. L’État a conduit des plans quinquennaux, mobilisé l’épargne, orienté le crédit et soutenu les entreprises capables d’exporter. Le Bureau de planification économique, les institutions de formation comme le KAIST et la priorité donnée aux infrastructures illustrent cette intervention organisée.

> **Définition : État-développeur.** État qui planifie, coordonne et accompagne activement la transformation économique, notamment par l’éducation, le financement, les infrastructures et l’appui aux entreprises.  
> **Définition : chaebol.** Grand groupe industriel sud-coréen diversifié, souvent soutenu dans les phases d’industrialisation et d’exportation.

## 4. Des étapes d’industrialisation liées entre elles

Le PDF distingue plusieurs phases. La substitution aux importations cherche d’abord à produire localement certains biens auparavant achetés à l’étranger. Ensuite, l’orientation vers l’exportation ouvre les entreprises aux marchés mondiaux. Le développement des industries lourdes, puis de l’automobile, de l’électronique et de secteurs technologiques, augmente la valeur ajoutée.

> **Méthode : expliquer un « miracle économique ».** Présentez toujours le lien entre un obstacle initial, une politique publique, une ressource humaine et une stratégie productive. Évitez de réduire le développement à un seul facteur.

## Synthèse

Le développement sud-coréen résulte d’une combinaison : adaptation d’un territoire contraignant, investissement massif dans le capital humain, État-développeur, planification et conquête des marchés extérieurs. Ce parcours montre que l’industrialisation suppose des choix continus plutôt qu’un simple avantage naturel.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Les fondements du développement économique de la Corée du Sud »**, Géographie, Terminale, Côte d’Ivoire – École numérique.
$coree$;
      title_exercise_a := 'Exercice 1 — Les fondements du développement sud-coréen';
      title_exercise_b := 'Exercice 2 — État-développeur et industrialisation';
      title_quiz := 'Quiz de révision — Le développement économique de la Corée du Sud';
    elsif target.lesson_key='cedeao' then
      course_description := 'Origines, objectifs, institutions, acquis et limites de la CEDEAO.';
      course_text := $cedeao$
## La CEDEAO : une organisation régionale à caractère économique

> **Objectif :** présenter la CEDEAO, expliquer son projet d’intégration régionale et analyser ses avancées comme ses limites.

## 1. Une communauté organisée pour rapprocher les économies

La Communauté économique des États de l’Afrique de l’Ouest, ou **CEDEAO**, est créée à Lagos le 28 mai 1975. Elle cherche à renforcer l’intégration sous-régionale, la coopération économique, la paix et la stabilité. Son projet repose sur l’idée que des États voisins peuvent obtenir de meilleurs résultats en organisant ensemble certains échanges, équipements et politiques.

> **Définition : intégration régionale.** Processus par lequel plusieurs États rapprochent leurs économies, leurs politiques ou leurs institutions pour former un espace de coopération plus cohérent.  
> **Définition : marché régional.** Espace d’échanges entre plusieurs pays qui cherche à réduire les obstacles à la circulation des biens, des services, des capitaux et des personnes.

## 2. Des objectifs et des institutions complémentaires

Le support présente la libre circulation des personnes, des biens et des capitaux, la réduction des barrières, les infrastructures, l’harmonisation des politiques et l’ambition d’une monnaie commune parmi les objectifs. Ces objectifs exigent des institutions : Conférence des chefs d’État et de gouvernement, Conseil des ministres, Commission, Parlement, Cour de justice, Banque d’investissement et de développement de la CEDEAO ainsi que commissions techniques.

> **Définition : souveraineté.** Pouvoir d’un État de décider sur son territoire et dans ses relations extérieures.  
> **Définition : BIDC.** Banque d’investissement et de développement de la CEDEAO, institution destinée à soutenir des projets de développement régional.

## 3. Des atouts et des réalisations visibles

L’Afrique de l’Ouest possède des ressources agricoles, minières et énergétiques, une population importante, des climats variés et un vaste marché potentiel. La CEDEAO a favorisé des mobilités régionales, des actions de paix, des projets d’infrastructures, des initiatives agricoles et des coopérations sociales ou environnementales.

> **Repère : ECOMOG.** Force régionale mise en œuvre dans des actions de maintien ou de restauration de la paix dans l’espace ouest-africain.

## 4. Des limites qui ralentissent l’intégration

L’instabilité politique, l’insécurité, les entraves administratives ou routières, les monnaies multiples, la faiblesse industrielle et les dépendances extérieures limitent encore les échanges. Les inégalités entre États et les barrières linguistiques peuvent aussi ralentir les décisions communes.

> **Méthode : évaluer une organisation régionale.** Distinguez son projet, ses moyens, ses réalisations et ses obstacles. Une organisation peut produire des effets réels tout en n’ayant pas encore atteint l’ensemble de ses objectifs.

## Synthèse

La CEDEAO organise une coopération économique, politique et sociale à l’échelle ouest-africaine. Son potentiel repose sur le marché régional, les ressources et la population ; sa réussite dépend de la paix, de la mobilité effective, des infrastructures, de la confiance entre États et de la réduction des dépendances.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« La CEDEAO : une organisation régionale à caractère économique »**, Géographie, Terminale, Côte d’Ivoire – École numérique.
$cedeao$;
      title_exercise_a := 'Exercice 1 — Objectifs et institutions de la CEDEAO';
      title_exercise_b := 'Exercice 2 — Acquis, limites et intégration régionale';
      title_quiz := 'Quiz de révision — La CEDEAO';
    else
      course_description := 'Partenaires, cadres, domaines, bilan et enjeux de la coopération UE/ACP.';
      course_text := $ue_acp$
## Les relations UE/ACP : un exemple de coopération Nord-Sud

> **Objectif :** identifier les partenaires, les mécanismes et les enjeux de la coopération entre l’Union européenne et les États d’Afrique, des Caraïbes et du Pacifique.

## 1. Comprendre les partenaires et la logique de coopération

L’Union européenne réunit des États disposant d’importantes capacités agricoles, industrielles, commerciales et de services. Le groupe ACP rassemble des pays d’Afrique, des Caraïbes et du Pacifique, aux ressources naturelles et aux trajectoires de développement variées. Les relations UE/ACP sont étudiées comme un exemple de coopération Nord-Sud, c’est-à-dire une coopération entre espaces dont les niveaux de développement et les positions dans l’économie mondiale sont différents.

> **Définition : coopération Nord-Sud.** Ensemble de relations, accords et projets entre des pays industrialisés du Nord et des pays du Sud, visant notamment l’aide, les échanges, les investissements ou le développement.  
> **Définition : partenariat asymétrique.** Relation entre partenaires dont les moyens économiques, technologiques ou politiques ne sont pas équivalents.

Les raisons de cette coopération sont historiques, politiques, culturelles et économiques. Elles concernent aussi les matières premières, les marchés, les investissements, l’aide et l’accès à certains produits.

## 2. Des cadres et des institutions qui évoluent

Le support rappelle plusieurs étapes : l’association de 1958, les conventions de Yaoundé I et II, les conventions de Lomé I à IV, l’accord de Cotonou pour la période 2000-2020, puis les accords de partenariat économique (APE). Les institutions citées comprennent notamment le Conseil des ministres ACP/UE, le Comité des ambassadeurs, l’Assemblée parlementaire paritaire, le Centre pour le développement de l’entreprise et le Centre technique de coopération agricole et rurale.

> **Définition : APE.** Accord de partenariat économique organisant des relations commerciales entre l’Union européenne et des pays ACP.  
> **Définition : FED.** Fonds européen de développement, instrument de financement de projets dans les pays partenaires.  
> **Définition : BEI.** Banque européenne d’investissement, institution qui peut financer des projets de développement.

## 3. Des domaines d’action diversifiés

La coopération touche les financements, les infrastructures, l’agriculture, l’industrie, l’alimentation, la paix, les droits humains, la gouvernance, la société civile, la culture et l’environnement. Les mécanismes STABEX et SYSMIN, cités dans le document, visent historiquement à répondre à certaines difficultés liées aux recettes d’exportation ou aux ressources minières.

> **Définition : STABEX.** Mécanisme de stabilisation des recettes d’exportation de certains produits agricoles.  
> **Définition : SYSMIN.** Mécanisme destiné à soutenir le secteur minier de pays partenaires.

## 4. Un bilan à nuancer

Le support relève des résultats : infrastructures, bourses, aides, projets et accès au marché. Mais une coopération ne doit pas être évaluée uniquement par les montants engagés. La dépendance à l’égard des produits primaires, l’endettement, les déficits commerciaux, la concurrence et les écarts de puissance montrent les limites d’un partenariat asymétrique.

> **Méthode : analyser une coopération internationale.** Présentez les partenaires et leurs intérêts, décrivez les mécanismes, puis opposez les acquis aux limites. Concluez sur les conditions d’une coopération plus équilibrée.

## Synthèse

Les relations UE/ACP illustrent l’importance des accords et des financements dans la coopération Nord-Sud. Elles montrent aussi qu’un partenariat durable doit renforcer les capacités productives, la transformation locale, l’autonomie de décision et l’équilibre des échanges.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Les relations UE/ACP : un exemple de coopération Nord-Sud »**, Géographie, Terminale, Côte d’Ivoire – École numérique.
$ue_acp$;
      title_exercise_a := 'Exercice 1 — Partenaires, cadres et outils de la coopération UE/ACP';
      title_exercise_b := 'Exercice 2 — Bilan critique de la coopération Nord-Sud';
      title_quiz := 'Quiz de révision — Les relations UE/ACP';
    end if;

    update public.lessons set description=course_description,content=course_text,is_active=false
    where id=target.lesson_id and coalesce(btrim(content),'')='';

    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
    select target.subject_id,target.level_id,target.series_id,target.chapter_id,target.lesson_id,title_exercise_a,
      'Répondez aux questions en mobilisant les repères, définitions et relations expliquées dans le cours.','La correction explicite la notion et la relie à la partie correspondante du cours.','single_choice','easy','## Consigne\n\nChoisissez la réponse exacte puis relisez l’encadré ou la partie correspondante.','## Correction\n\nLa réponse correcte doit être justifiée avec le vocabulaire précis de la leçon.',false,false,15,10
    where not exists (select 1 from public.exercises e where e.lesson_id=target.lesson_id and e.title=title_exercise_a)
    returning id into exercise_a;

    if exercise_a is not null then
      if target.lesson_key='coree' then
        insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
        (exercise_a,'single_choice','Quel facteur correspond au capital humain ?',jsonb_build_array('L’éducation et la formation','Le relief montagneux seul','La fermeture des échanges','La réduction de toute recherche'),jsonb_build_array('L’éducation et la formation'),'Le capital humain désigne les connaissances et compétences mobilisables par la population.',10),
        (exercise_a,'single_choice','Quel rôle caractérise un État-développeur ?',jsonb_build_array('Planifier et soutenir l’industrialisation','Abandonner toutes les infrastructures','Interdire les exportations','Supprimer la formation'),jsonb_build_array('Planifier et soutenir l’industrialisation'),'Le support met en évidence la planification, les investissements et l’appui public aux entreprises.',20),
        (exercise_a,'true_false','La Corée du Sud s’est développée uniquement grâce à des ressources minières abondantes.',jsonb_build_array('Vrai','Faux'),jsonb_build_array('Faux'),'Le PDF insiste au contraire sur la rareté relative des ressources et sur la valorisation du capital humain, de l’industrie et des exportations.',30);
      elsif target.lesson_key='cedeao' then
        insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
        (exercise_a,'single_choice','Quel est un objectif de la CEDEAO ?',jsonb_build_array('Faciliter la libre circulation','Supprimer toute coopération régionale','Interdire les infrastructures communes','Créer des frontières commerciales plus nombreuses'),jsonb_build_array('Faciliter la libre circulation'),'La libre circulation des personnes, des biens et des capitaux fait partie du projet d’intégration.',10),
        (exercise_a,'single_choice','Quelle institution est une banque de développement régionale ?',jsonb_build_array('La BIDC','Le STABEX','Le KAIST','Le FED'),jsonb_build_array('La BIDC'),'La BIDC est la Banque d’investissement et de développement de la CEDEAO.',20),
        (exercise_a,'true_false','L’intégration régionale peut être freinée par l’insécurité et les entraves à la mobilité.',jsonb_build_array('Vrai','Faux'),jsonb_build_array('Vrai'),'Le cours identifie ces éléments parmi les limites de la coopération ouest-africaine.',30);
      else
        insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
        (exercise_a,'single_choice','Que désigne ACP ?',jsonb_build_array('Afrique, Caraïbes et Pacifique','Alliance commerciale privée','Association des capitales portuaires','Accord continental de paix'),jsonb_build_array('Afrique, Caraïbes et Pacifique'),'ACP désigne le groupe des pays d’Afrique, des Caraïbes et du Pacifique.',10),
        (exercise_a,'single_choice','Quel instrument finance des projets de développement ?',jsonb_build_array('Le FED','La CEDEAO','Le chaebol','La mousson'),jsonb_build_array('Le FED'),'Le Fonds européen de développement est un instrument de financement cité dans le cours.',20),
        (exercise_a,'true_false','Un partenariat asymétrique réunit nécessairement des partenaires de puissance égale.',jsonb_build_array('Vrai','Faux'),jsonb_build_array('Faux'),'L’asymétrie désigne précisément une différence de moyens ou de pouvoir entre les partenaires.',30);
      end if;
    end if;

    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
    select target.subject_id,target.level_id,target.series_id,target.chapter_id,target.lesson_id,title_exercise_b,
      'Analysez une relation de cause à effet ou appréciez une stratégie en vous appuyant sur le cours.','La correction relie une notion à ses effets, ses atouts ou ses limites.','single_choice','medium','## Consigne\n\nChoisissez l’analyse la plus complète et justifiez-la par une notion précise.','## Correction\n\nUne réponse construite relie le fait, sa cause, son effet et, si besoin, une solution.',false,false,20,20
    where not exists (select 1 from public.exercises e where e.lesson_id=target.lesson_id and e.title=title_exercise_b)
    returning id into exercise_b;

    if exercise_b is not null then
      if target.lesson_key='coree' then
        insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
        (exercise_b,'single_choice','Pourquoi le développement des exportations est-il important dans le cas sud-coréen ?',jsonb_build_array('Il permet d’accéder aux marchés extérieurs et d’accroître les revenus industriels','Il supprime le besoin de former la population','Il rend les infrastructures inutiles','Il interdit la transformation locale'),jsonb_build_array('Il permet d’accéder aux marchés extérieurs et d’accroître les revenus industriels'),'La stratégie exportatrice accompagne l’industrialisation et la montée en valeur ajoutée.',10),
        (exercise_b,'single_choice','Quelle démarche valorise un territoire aux ressources limitées ?',jsonb_build_array('Investir dans la formation, l’innovation et la transformation','Attendre uniquement des ressources naturelles','Refuser toute planification','Réduire l’accès à l’éducation'),jsonb_build_array('Investir dans la formation, l’innovation et la transformation'),'Le cours montre que les capacités humaines et l’organisation productive peuvent compenser certaines contraintes.',20),
        (exercise_b,'true_false','Les différentes phases industrielles décrites dans le PDF sont sans lien entre elles.',jsonb_build_array('Vrai','Faux'),jsonb_build_array('Faux'),'Chaque phase prépare ou renforce la suivante : production locale, exportation, industries lourdes puis secteurs technologiques.',30);
      elsif target.lesson_key='cedeao' then
        insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
        (exercise_b,'single_choice','Pourquoi les infrastructures régionales sont-elles essentielles ?',jsonb_build_array('Elles facilitent les échanges et la mobilité entre les États','Elles empêchent toute coopération','Elles remplacent les institutions','Elles suppriment les différences de monnaie automatiquement'),jsonb_build_array('Elles facilitent les échanges et la mobilité entre les États'),'Routes, énergie et autres équipements renforcent concrètement le marché régional.',10),
        (exercise_b,'single_choice','Quelle limite montre qu’un objectif régional n’est pas encore pleinement atteint ?',jsonb_build_array('Les entraves à la circulation des personnes et des biens','La diversité des ressources','L’existence d’un marché potentiel','La présence d’institutions'),jsonb_build_array('Les entraves à la circulation des personnes et des biens'),'Les barrières administratives et sécuritaires réduisent l’effectivité de la libre circulation.',20),
        (exercise_b,'true_false','La coopération économique peut être renforcée par la paix et la stabilité politique.',jsonb_build_array('Vrai','Faux'),jsonb_build_array('Vrai'),'La sécurité et la stabilité constituent des conditions de circulation, d’investissement et de coopération.',30);
      else
        insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
        (exercise_b,'single_choice','Pourquoi la coopération UE/ACP est-elle qualifiée d’asymétrique ?',jsonb_build_array('Les partenaires ne disposent pas des mêmes moyens économiques et technologiques','Les partenaires parlent toujours la même langue','Les échanges sont inexistants','Les institutions sont toutes identiques'),jsonb_build_array('Les partenaires ne disposent pas des mêmes moyens économiques et technologiques'),'Le cours invite à comparer les capacités productives, financières et commerciales des partenaires.',10),
        (exercise_b,'single_choice','Quelle orientation peut rendre un partenariat plus équilibré ?',jsonb_build_array('Renforcer les capacités productives et la transformation locale','Accroître la dépendance aux produits bruts','Supprimer toute négociation','Ignorer les déficits commerciaux'),jsonb_build_array('Renforcer les capacités productives et la transformation locale'),'La transformation locale et l’autonomie productive peuvent réduire certaines dépendances.',20),
        (exercise_b,'true_false','Le bilan d’une coopération se réduit au montant de l’aide reçue.',jsonb_build_array('Vrai','Faux'),jsonb_build_array('Faux'),'Il faut aussi apprécier les effets sur l’autonomie, les échanges, l’emploi, les infrastructures et les inégalités.',30);
      end if;
    end if;

    insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active)
    select target.subject_id,target.level_id,target.series_id,target.offering_id,target.chapter_id,target.lesson_id,title_quiz,
      'Vérifiez votre maîtrise des repères, du vocabulaire et des relations essentielles de la leçon.','medium',12,10,false,false
    where not exists (select 1 from public.quizzes q where q.lesson_id=target.lesson_id and q.title=title_quiz)
    returning id into quiz_uuid;

    if quiz_uuid is not null then
      if target.lesson_key='coree' then
        with q as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
          (quiz_uuid,'Que désigne un chaebol ?','C’est un grand groupe industriel sud-coréen diversifié.','single_choice',10,1,true),
          (quiz_uuid,'Quelle stratégie consiste à produire localement des biens auparavant importés ?','Il s’agit de l’import-substitution.','single_choice',20,1,true),
          (quiz_uuid,'Quel facteur est lié au capital humain ?','L’éducation et la formation augmentent les compétences mobilisables.','single_choice',30,1,true),
          (quiz_uuid,'Quel risque territorial est mentionné dans le PDF ?','Moussons, typhons et sécheresses peuvent créer des contraintes.','single_choice',40,1,true) returning id,display_order)
        insert into public.quiz_answers (question_id,answer,is_correct,display_order)
        select q.id,v.answer,v.ok,v.ord from q join lateral (select * from (values
          (10,'Un grand groupe industriel diversifié',true,10),(10,'Une banque régionale africaine',false,20),(20,'L’import-substitution',true,10),(20,'La privatisation',false,20),(30,'L’éducation et la formation',true,10),(30,'Le relief seul',false,20),(40,'Les typhons et les sécheresses',true,10),(40,'L’absence totale de saisons',false,20)) as x(qord,answer,ok,ord)) v on v.qord=q.display_order;
      elsif target.lesson_key='cedeao' then
        with q as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
          (quiz_uuid,'En quelle année la CEDEAO est-elle créée selon le support ?','Le support indique la création à Lagos le 28 mai 1975.','single_choice',10,1,true),
          (quiz_uuid,'Quel principe facilite les échanges régionaux ?','La libre circulation est un objectif majeur de la CEDEAO.','single_choice',20,1,true),
          (quiz_uuid,'Quelle institution peut contribuer au financement du développement régional ?','La BIDC est la banque de développement de la CEDEAO.','single_choice',30,1,true),
          (quiz_uuid,'Quelle contrainte peut freiner l’intégration ?','L’instabilité et l’insécurité limitent mobilité et investissements.','single_choice',40,1,true) returning id,display_order)
        insert into public.quiz_answers (question_id,answer,is_correct,display_order)
        select q.id,v.answer,v.ok,v.ord from q join lateral (select * from (values
          (10,'1975',true,10),(10,'1960',false,20),(20,'La libre circulation',true,10),(20,'La fermeture des marchés',false,20),(30,'La BIDC',true,10),(30,'Le KAIST',false,20),(40,'L’instabilité et l’insécurité',true,10),(40,'La diversité climatique',false,20)) as x(qord,answer,ok,ord)) v on v.qord=q.display_order;
      else
        with q as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
          (quiz_uuid,'Que signifie ACP ?','ACP désigne Afrique, Caraïbes et Pacifique.','single_choice',10,1,true),
          (quiz_uuid,'Quel accord suit les conventions de Lomé dans le support ?','L’accord de Cotonou est cité pour 2000-2020.','single_choice',20,1,true),
          (quiz_uuid,'Quel fonds européen finance des projets de développement ?','Le FED est le Fonds européen de développement.','single_choice',30,1,true),
          (quiz_uuid,'Quelle limite est évoquée pour la coopération UE/ACP ?','Les dépendances et les asymétries pèsent sur le partenariat.','single_choice',40,1,true) returning id,display_order)
        insert into public.quiz_answers (question_id,answer,is_correct,display_order)
        select q.id,v.answer,v.ok,v.ord from q join lateral (select * from (values
          (10,'Afrique, Caraïbes et Pacifique',true,10),(10,'Alliance pour le commerce privé',false,20),(20,'L’accord de Cotonou',true,10),(20,'Le traité de Lagos',false,20),(30,'Le FED',true,10),(30,'Le STABEX',false,20),(40,'Les dépendances et asymétries',true,10),(40,'L’égalité automatique des partenaires',false,20)) as x(qord,answer,ok,ord)) v on v.qord=q.display_order;
      end if;
    end if;
  end loop;

  -- Dix nouvelles citations par matière. Les textes sont documentés, et la garde empêche toute copie d’une citation existante.
  for citation_seed in
    select * from (values
      ('Français','Contre la médisance il n’est point de rempart. À tous les sots caquets n’ayons donc nul égard.','Molière','Tartuffe ou l’Imposteur','Acte I, scène 1','https://fr.wikisource.org/wiki/Tartuffe_ou_l%E2%80%99Imposteur/%C3%89dition_Louandre,_1910/Texte_entier','Cette réplique de Cléante permet d’analyser la critique de la médisance et la valeur argumentative du dialogue théâtral.',array['théâtre','médisance','argumentation']::text[],'Théâtre'),
      ('Français','Ceux de qui la conduite offre le plus à rire sont toujours sur autrui les premiers à médire.','Molière','Tartuffe ou l’Imposteur','Acte I, scène 1','https://fr.wikisource.org/wiki/Tartuffe_ou_l%E2%80%99Imposteur/%C3%89dition_Louandre,_1910/Texte_entier','La formule met en évidence la satire des comportements hypocrites et l’ironie du théâtre de Molière.',array['satire','théâtre','ironie']::text[],'Théâtre'),
      ('Français','Il passe pour un saint dans votre fantaisie : tout son fait, croyez-moi, n’est rien qu’hypocrisie.','Molière','Tartuffe ou l’Imposteur','Acte I, scène 1','https://fr.wikisource.org/wiki/Tartuffe_ou_l%E2%80%99Imposteur/%C3%89dition_Louandre,_1910/Texte_entier','Elle permet de définir l’hypocrisie et de comprendre la fonction critique du personnage de Tartuffe.',array['hypocrisie','satire','personnage']::text[],'Théâtre'),
      ('Français','Je deviens tout autre avec son entretien ; il m’enseigne à n’avoir affection pour rien.','Molière','Tartuffe ou l’Imposteur','Acte I, scène 6','https://fr.wikisource.org/wiki/Tartuffe_ou_l%E2%80%99Imposteur/%C3%89dition_Louandre,_1910/Texte_entier','Le propos d’Orgon révèle son aveuglement et aide à étudier les effets de l’emprise dans une comédie critique.',array['Orgon','aveuglement','théâtre']::text[],'Théâtre'),
      ('Français','Les sentiments humains, mon frère, que voilà !','Molière','Tartuffe ou l’Imposteur','Acte I, scène 6','https://fr.wikisource.org/wiki/Tartuffe_ou_l%E2%80%99Imposteur/%C3%89dition_Louandre,_1910/Texte_entier','Cette exclamation de Cléante met en évidence la distance critique du personnage face à l’excès d’Orgon.',array['dialogue','ironie','théâtre']::text[],'Théâtre'),
      ('Français','C’est être libertin que d’avoir de bons yeux.','Molière','Tartuffe ou l’Imposteur','Acte I, scène 6','https://fr.wikisource.org/wiki/Tartuffe_ou_l%E2%80%99Imposteur/%C3%89dition_Louandre,_1910/Texte_entier','La formule dénonce l’inversion des valeurs : voir lucidement devient, pour le fanatique, une faute.',array['lucidité','satire','ironie']::text[],'Théâtre'),
      ('Français','Il est de faux dévots ainsi que de faux braves.','Molière','Tartuffe ou l’Imposteur','Acte I, scène 6','https://fr.wikisource.org/wiki/Tartuffe_ou_l%E2%80%99Imposteur/%C3%89dition_Louandre,_1910/Texte_entier','Cette phrase résume la distinction entre une valeur authentique et sa contrefaçon sociale.',array['hypocrisie','dévotion','satire']::text[],'Théâtre'),
      ('Français','À votre nez, mon frère, elle se rit de vous.','Molière','Tartuffe ou l’Imposteur','Acte I, scène 6','https://fr.wikisource.org/wiki/Tartuffe_ou_l%E2%80%99Imposteur/%C3%89dition_Louandre,_1910/Texte_entier','Cette réplique souligne l’ironie dramatique : le spectateur voit la manipulation dont Orgon ne prend pas encore conscience.',array['ironie dramatique','comédie','Orgon']::text[],'Théâtre'),
      ('Français','Le pauvre homme !','Molière','Tartuffe ou l’Imposteur','Acte I, scène 5','https://fr.wikisource.org/wiki/Tartuffe_ou_l%E2%80%99Imposteur/%C3%89dition_Louandre,_1910/Texte_entier','La répétition mécanique d’Orgon crée un effet comique et révèle la disproportion de son attachement à Tartuffe.',array['comique de répétition','Orgon','théâtre']::text[],'Théâtre'),
      ('Français','Par cent dehors fardés a l’art de l’éblouir.','Molière','Tartuffe ou l’Imposteur','Acte I, scène 2','https://fr.wikisource.org/wiki/Tartuffe_ou_l%E2%80%99Imposteur/%C3%89dition_Louandre,_1910/Texte_entier','Cette formule permet d’étudier la stratégie de manipulation et la critique de la fausse dévotion.',array['hypocrisie','manipulation','satire']::text[],'Théâtre'),
      ('Philosophie','Il faut se connaître soi-même : quand cela ne servirait pas à trouver le vrai, cela au moins sert à régler sa vie.','Blaise Pascal','Pensées','Fragment 66, édition Brunschvicg','https://fr.wikisource.org/wiki/Pens%C3%A9es_(Pascal,_%C3%A9d._Brunschvicg)/Pens%C3%A9es/Section_II-1','La citation ouvre une réflexion sur la connaissance de soi comme exigence théorique et pratique.',array['connaissance de soi','vérité','Pascal']::text[],'Connaissance'),
      ('Philosophie','La science des choses extérieures ne me consolera pas de l’ignorance de la morale.','Blaise Pascal','Pensées','Fragment 67, édition Brunschvicg','https://fr.wikisource.org/wiki/Pens%C3%A9es_(Pascal,_%C3%A9d._Brunschvicg)/Pens%C3%A9es/Section_II-1','Elle permet de distinguer la connaissance des objets de la réflexion morale sur la conduite humaine.',array['morale','science','Pascal']::text[],'Morale'),
      ('Philosophie','On n’apprend pas aux hommes à être honnêtes hommes, et on leur apprend tout le reste.','Blaise Pascal','Pensées','Fragment 68, édition Brunschvicg','https://fr.wikisource.org/wiki/Pens%C3%A9es_(Pascal,_%C3%A9d._Brunschvicg)/Pens%C3%A9es/Section_II-1','La formule interroge la place de l’éducation morale dans la formation intellectuelle.',array['éducation','morale','Pascal']::text[],'Morale'),
      ('Philosophie','Quand on lit trop vite, ou trop doucement, on n’entend rien.','Blaise Pascal','Pensées','Fragment 69, édition Brunschvicg','https://fr.wikisource.org/wiki/Pens%C3%A9es_(Pascal,_%C3%A9d._Brunschvicg)/Pens%C3%A9es/Section_II-1','Cette remarque aide à réfléchir aux conditions de compréhension d’un texte et à la nécessité d’une lecture attentive.',array['lecture','compréhension','Pascal']::text[],'Connaissance'),
      ('Philosophie','Qu’est-ce qu’un homme dans l’infini ?','Blaise Pascal','Pensées','Fragment 72, édition Brunschvicg','https://fr.wikisource.org/wiki/Pens%C3%A9es_(Pascal,_%C3%A9d._Brunschvicg)/Pens%C3%A9es/Section_II-1','La question introduit l’étude de la condition humaine face à l’immensité du monde.',array['condition humaine','infini','Pascal']::text[],'Condition humaine'),
      ('Philosophie','Un néant à l’égard de l’infini, un tout à l’égard du néant, un milieu entre rien et tout.','Blaise Pascal','Pensées','Fragment 72, édition Brunschvicg','https://fr.wikisource.org/wiki/Pens%C3%A9es_(Pascal,_%C3%A9d._Brunschvicg)/Pens%C3%A9es/Section_II-1','Elle condense la position paradoxale de l’être humain entre les deux infinis.',array['condition humaine','infini','Pascal']::text[],'Condition humaine'),
      ('Philosophie','Connaissons donc notre portée ; nous sommes quelque chose, et ne sommes pas tout.','Blaise Pascal','Pensées','Fragment 72, édition Brunschvicg','https://fr.wikisource.org/wiki/Pens%C3%A9es_(Pascal,_%C3%A9d._Brunschvicg)/Pens%C3%A9es/Section_II-1','Cette citation invite à penser les limites de la connaissance humaine sans nier ses capacités.',array['connaissance','limites','Pascal']::text[],'Connaissance'),
      ('Philosophie','L’homme est à lui-même le plus prodigieux objet de la nature.','Blaise Pascal','Pensées','Fragment 72, édition Brunschvicg','https://fr.wikisource.org/wiki/Pens%C3%A9es_(Pascal,_%C3%A9d._Brunschvicg)/Pens%C3%A9es/Section_II-1','Elle sert à introduire le problème philosophique de l’homme comme être de corps et d’esprit.',array['homme','esprit','corps']::text[],'Condition humaine'),
      ('Philosophie','Elle est bien assez pour avouer qu’elle n’a encore pu trouver rien de ferme.','Blaise Pascal','Pensées','Fragment 73, édition Brunschvicg','https://fr.wikisource.org/wiki/Pens%C3%A9es_(Pascal,_%C3%A9d._Brunschvicg)/Pens%C3%A9es/Section_II-1','La formulation alimente une discussion sur la puissance et les limites de la raison.',array['raison','vérité','Pascal']::text[],'Connaissance'),
      ('Philosophie','L’esprit croit naturellement, et la volonté aime naturellement.','Blaise Pascal','Pensées','Fragment 81, édition Brunschvicg','https://fr.wikisource.org/wiki/Pens%C3%A9es_(Pascal,_%C3%A9d._Brunschvicg)/Pens%C3%A9es/Section_II-1','Elle permet de distinguer les rapports entre croyance, désir et volonté.',array['esprit','volonté','Pascal']::text[],'Connaissance'),
      ('Histoire-Géographie','À pratiquer la tolérance, à vivre en paix l’un avec l’autre dans un esprit de bon voisinage.','Nations Unies','Charte des Nations Unies','Préambule','https://www.un.org/fr/about-us/un-charter/full-text','Cette déclaration éclaire les principes de paix et de coopération internationale étudiés en Histoire-Géographie.',array['ONU','paix','tolérance']::text[],'Relations internationales'),
      ('Histoire-Géographie','À unir nos forces pour maintenir la paix et la sécurité internationales.','Nations Unies','Charte des Nations Unies','Préambule','https://www.un.org/fr/about-us/un-charter/full-text','Elle rappelle le principe d’action collective qui fonde une organisation internationale.',array['ONU','sécurité','coopération']::text[],'Relations internationales'),
      ('Histoire-Géographie','À recourir aux institutions internationales pour favoriser le progrès économique et social de tous les peuples.','Nations Unies','Charte des Nations Unies','Préambule','https://www.un.org/fr/about-us/un-charter/full-text','Cette formule relie institutions internationales, développement et coopération entre les peuples.',array['ONU','développement','coopération']::text[],'Relations internationales'),
      ('Histoire-Géographie','Développer entre les nations des relations amicales fondées sur le respect du principe de l’égalité de droits des peuples et de leur droit à disposer d’eux-mêmes.','Nations Unies','Charte des Nations Unies','Article 1, paragraphe 2','https://www.un.org/fr/about-us/un-charter/full-text','Elle permet d’étudier l’autodétermination, la décolonisation et les fondements des relations entre États.',array['autodétermination','décolonisation','ONU']::text[],'Relations internationales'),
      ('Histoire-Géographie','Réaliser la coopération internationale en résolvant les problèmes internationaux d’ordre économique, social, intellectuel ou humanitaire.','Nations Unies','Charte des Nations Unies','Article 1, paragraphe 3','https://www.un.org/fr/about-us/un-charter/full-text','La citation aide à distinguer les dimensions économiques, sociales et humanitaires de la coopération internationale.',array['coopération','développement','ONU']::text[],'Relations internationales'),
      ('Histoire-Géographie','L’Organisation est fondée sur le principe de l’égalité souveraine de tous ses Membres.','Nations Unies','Charte des Nations Unies','Article 2, paragraphe 1','https://www.un.org/fr/about-us/un-charter/full-text','Elle permet de définir la souveraineté et d’examiner l’égalité juridique entre les États.',array['souveraineté','États','ONU']::text[],'Relations internationales'),
      ('Histoire-Géographie','Les Membres de l’Organisation règlent leurs différends internationaux par des moyens pacifiques.','Nations Unies','Charte des Nations Unies','Article 2, paragraphe 3','https://www.un.org/fr/about-us/un-charter/full-text','Elle sert à analyser les normes internationales de règlement pacifique des conflits.',array['conflit','paix','ONU']::text[],'Relations internationales'),
      ('Histoire-Géographie','Les Membres de l’Organisation s’abstiennent, dans leurs relations internationales, de recourir à la menace ou à l’emploi de la force.','Nations Unies','Charte des Nations Unies','Article 2, paragraphe 4','https://www.un.org/fr/about-us/un-charter/full-text','Cette règle permet d’étudier l’interdiction de la force et la protection de l’intégrité territoriale.',array['force','souveraineté','ONU']::text[],'Relations internationales'),
      ('Histoire-Géographie','Chaque membre de l’Assemblée générale dispose d’une voix.','Nations Unies','Charte des Nations Unies','Article 18, paragraphe 1','https://www.un.org/fr/about-us/un-charter/full-text','La citation aide à comprendre le principe de représentation formelle des États au sein de l’Assemblée générale.',array['Assemblée générale','représentation','ONU']::text[],'Relations internationales'),
      ('Histoire-Géographie','Les parties à tout différend doivent en rechercher la solution, avant tout, par voie de négociation, d’enquête, de médiation, de conciliation, d’arbitrage ou de règlement judiciaire.','Nations Unies','Charte des Nations Unies','Article 33, paragraphe 1','https://www.un.org/fr/about-us/un-charter/full-text','Cette énumération donne des instruments précis pour l’étude de la diplomatie et de la résolution pacifique des conflits.',array['médiation','arbitrage','paix']::text[],'Relations internationales'),
      ('Physique-Chimie','Toute science physique est nécessairement formée de trois choses : la série des faits qui constituent la science ; les idées qui les rappellent ; les mots qui les expriment.','Antoine-Laurent de Lavoisier','Traité élémentaire de chimie','Discours préliminaire, 1789','https://fr.wikisource.org/wiki/Trait%C3%A9_%C3%A9l%C3%A9mentaire_de_chimie/Discours_pr%C3%A9liminaire','Elle montre que l’observation, la conceptualisation et le langage sont liés dans toute démarche scientifique.',array['faits','langage scientifique','méthode']::text[],'Méthode scientifique'),
      ('Physique-Chimie','On ne peut perfectionner le langage sans perfectionner la science, ni la science sans le langage.','Antoine-Laurent de Lavoisier','Traité élémentaire de chimie','Discours préliminaire, 1789','https://fr.wikisource.org/wiki/Trait%C3%A9_%C3%A9l%C3%A9mentaire_de_chimie/Discours_pr%C3%A9liminaire','Cette formule éclaire le rôle de la nomenclature chimique et de la précision du vocabulaire.',array['nomenclature','langage','chimie']::text[],'Chimie'),
      ('Physique-Chimie','Nous ne pouvons procéder pour nous instruire, que du connu à l’inconnu.','Antoine-Laurent de Lavoisier','Traité élémentaire de chimie','Discours préliminaire, 1789','https://fr.wikisource.org/wiki/Trait%C3%A9_%C3%A9l%C3%A9mentaire_de_chimie/Discours_pr%C3%A9liminaire','Elle exprime une progression pédagogique et scientifique fondée sur les connaissances déjà établies.',array['méthode','apprentissage','Lavoisier']::text[],'Méthode scientifique'),
      ('Physique-Chimie','Les idées ne doivent être qu’une conséquence, une suite immédiate d’une expérience ou d’une observation.','Antoine-Laurent de Lavoisier','Traité élémentaire de chimie','Discours préliminaire, 1789','https://fr.wikisource.org/wiki/Trait%C3%A9_%C3%A9l%C3%A9mentaire_de_chimie/Discours_pr%C3%A9liminaire','Cette citation souligne que les explications scientifiques doivent se rattacher aux observations et aux expériences.',array['observation','expérience','méthode']::text[],'Expérimentation'),
      ('Physique-Chimie','L’amour-propre et la confiance en nous-mêmes nous sollicitent à tirer des conséquences qui ne dérivent pas immédiatement des faits.','Antoine-Laurent de Lavoisier','Traité élémentaire de chimie','Discours préliminaire, 1789','https://fr.wikisource.org/wiki/Trait%C3%A9_%C3%A9l%C3%A9mentaire_de_chimie/Discours_pr%C3%A9liminaire','Elle permet d’expliquer pourquoi une hypothèse doit être contrôlée et ne peut remplacer les faits.',array['hypothèse','esprit critique','expérience']::text[],'Méthode scientifique'),
      ('Physique-Chimie','À ne conserver que les faits qui ne sont que des données de la nature, et qui ne peuvent nous tromper.','Antoine-Laurent de Lavoisier','Traité élémentaire de chimie','Discours préliminaire, 1789','https://fr.wikisource.org/wiki/Trait%C3%A9_%C3%A9l%C3%A9mentaire_de_chimie/Discours_pr%C3%A9liminaire','Cette règle soutient l’analyse de la vérification expérimentale et de la correction des erreurs.',array['raisonnement','vérification','expérience']::text[],'Expérimentation'),
      ('Physique-Chimie','Ne rien conclure au-delà de ce que les expériences présentent, et ne jamais suppléer au silence des faits.','Antoine-Laurent de Lavoisier','Traité élémentaire de chimie','Discours préliminaire, 1789','https://fr.wikisource.org/wiki/Trait%C3%A9_%C3%A9l%C3%A9mentaire_de_chimie/Discours_pr%C3%A9liminaire','La citation formule une exigence de prudence : ne pas transformer une absence de données en certitude.',array['faits','prudence','méthode']::text[],'Méthode scientifique'),
      ('Physique-Chimie','Cette science présente des lacunes nombreuses qui interrompent la série des faits.','Antoine-Laurent de Lavoisier','Traité élémentaire de chimie','Discours préliminaire, 1789','https://fr.wikisource.org/wiki/Trait%C3%A9_%C3%A9l%C3%A9mentaire_de_chimie/Discours_pr%C3%A9liminaire','Elle rappelle que la science progresse en reconnaissant aussi les questions et les données encore manquantes.',array['progrès scientifique','faits','Lavoisier']::text[],'Méthode scientifique'),
      ('Physique-Chimie','Nous n’avons aucun moyen de les séparer, ils agissent à notre égard à la manière des corps simples.','Antoine-Laurent de Lavoisier','Traité élémentaire de chimie','Discours préliminaire, 1789','https://fr.wikisource.org/wiki/Trait%C3%A9_%C3%A9l%C3%A9mentaire_de_chimie/Discours_pr%C3%A9liminaire','Cette formule aide à comprendre qu’une définition scientifique dépend des moyens d’analyse disponibles à une époque.',array['éléments','analyse','chimie']::text[],'Chimie'),
      ('Physique-Chimie','Les sciences présentent déjà par elles-mêmes assez de difficultés, sans en appeler encore qui leur sont étrangères.','Antoine-Laurent de Lavoisier','Traité élémentaire de chimie','Discours préliminaire, 1789','https://fr.wikisource.org/wiki/Trait%C3%A9_%C3%A9l%C3%A9mentaire_de_chimie/Discours_pr%C3%A9liminaire','Elle met en valeur une présentation claire et progressive des sciences pour favoriser la compréhension des élèves.',array['pédagogie','science','clarté']::text[],'Méthode scientifique')
    ) as seed(subject_name,quote_text,author,source_title,source_reference,source_url,pedagogical_explanation,keywords,theme)
  loop
    select id into citation_subject_uuid from public.subjects where name=citation_seed.subject_name limit 1;
    if citation_subject_uuid is null then raise exception 'La matière Citations % est introuvable.', citation_seed.subject_name; end if;
    insert into public.citations (subject_id,quote_text,author,source_title,source_reference,source_url,pedagogical_explanation,keywords,is_active,is_validated)
    select citation_subject_uuid,citation_seed.quote_text,citation_seed.author,citation_seed.source_title,citation_seed.source_reference,citation_seed.source_url,citation_seed.pedagogical_explanation,citation_seed.keywords,false,false
    where not exists (select 1 from public.citations c where c.subject_id=citation_subject_uuid and c.quote_text=citation_seed.quote_text and c.author=citation_seed.author)
    returning id into citation_uuid;
    if citation_uuid is not null then
      insert into public.citation_scopes (citation_id,level_id,series_id)
      select citation_uuid,lv.id,s.id from public.levels lv cross join public.series s
      where lv.name='Terminale' and s.name in ('A1','A2','C','D');
      insert into public.citation_themes (citation_id,theme) values (citation_uuid,citation_seed.theme);
    end if;
  end loop;
end
$geographie_coree_cedeao_ueacp$;
