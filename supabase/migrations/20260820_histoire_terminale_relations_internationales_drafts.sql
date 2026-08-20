-- Brouillons exclusivement : aucun contenu pédagogique existant n’est écrasé.
do $history$
declare
  target record;
  science_offering record;
  science_chapter_id uuid;
  expected_count integer;
  exercise_one_id uuid;
  exercise_two_id uuid;
  quiz_id uuid;
  lesson_content text;
  lesson_description text;
  exercise_one_title text;
  exercise_two_title text;
  quiz_title text;
begin
  -- Les offres C et D existent mais ne contiennent aucun chapitre. Seul le thème explicitement couvert est créé.
  for science_offering in
    select o.id as offering_id, s.name as series_name
    from public.course_subject_offerings o
    join public.subjects subject on subject.id = o.subject_id
    join public.levels level on level.id = o.level_id
    join public.series s on s.id = o.series_id
    where subject.name = 'Histoire-Géographie' and level.name = 'Terminale' and s.name in ('C', 'D')
    order by s.name
  loop
    insert into public.chapters (subject_id, level_id, series_id, subject_offering_id, title, description, display_order, is_test_data, is_active)
    select o.subject_id, o.level_id, o.series_id, o.id,
      'THÈME 1 — LES RELATIONS INTERNATIONALES DE 1945 À NOS JOURS',
      'Les relations internationales depuis 1945 : ONU, bipolarisation, fin de la guerre froide et monde multipolaire.',
      20, false, false
    from public.course_subject_offerings o
    where o.id = science_offering.offering_id
      and not exists (
        select 1 from public.chapters c
        where c.subject_offering_id = o.id and c.title = 'THÈME 1 — LES RELATIONS INTERNATIONALES DE 1945 À NOS JOURS'
      );

    select c.id into science_chapter_id
    from public.chapters c
    where c.subject_offering_id = science_offering.offering_id
      and c.title = 'THÈME 1 — LES RELATIONS INTERNATIONALES DE 1945 À NOS JOURS'
    limit 1;

    if science_chapter_id is null then
      raise exception 'Le thème 1 Histoire est introuvable pour la série scientifique %.', science_offering.series_name;
    end if;

    insert into public.lessons (chapter_id, title, description, content, display_order, is_test_data, is_active)
    select science_chapter_id, v.title, v.description, null, v.display_order, false, false
    from (values
      ('Leçon 1 — L’Organisation des Nations Unies (ONU)', 'Création, objectifs, principes, fonctionnement, bilan et réformes de l’ONU.', 10),
      ('Leçon 2 — L’ère de la bipolarisation de 1947 à 1991', 'Formation des blocs, crises, coexistence pacifique, désagrégation de l’URSS et fin de la guerre froide.', 20),
      ('Leçon 3 — De la fin de la guerre froide à un monde multipolaire', 'Hyperpuissance américaine, contestation du leadership et émergence des pôles d’influence.', 30)
    ) as v(title, description, display_order)
    where not exists (
      select 1 from public.lessons l where l.chapter_id = science_chapter_id and l.title = v.title
    );
  end loop;

  select count(*) into expected_count
  from public.lessons l
  join public.chapters c on c.id = l.chapter_id
  join public.course_subject_offerings o on o.id = c.subject_offering_id
  join public.subjects subject on subject.id = o.subject_id
  join public.levels level on level.id = o.level_id
  join public.series series on series.id = o.series_id
  where subject.name = 'Histoire-Géographie' and level.name = 'Terminale'
    and series.name in ('A1', 'A2', 'C', 'D')
    and c.title = 'THÈME 1 — LES RELATIONS INTERNATIONALES DE 1945 À NOS JOURS'
    and l.title in (
      'Leçon 1 — L’Organisation des Nations Unies (ONU)',
      'Leçon 2 — L’ère de la bipolarisation de 1947 à 1991',
      'Leçon 3 — De la fin de la guerre froide à un monde multipolaire'
    );

  if expected_count <> 12 then
    raise exception 'Le périmètre attendu de douze leçons Histoire Terminale n’est pas réuni ; transaction annulée.';
  end if;

  for target in
    select l.id as lesson_id, c.id as chapter_id, o.id as offering_id, o.subject_id, o.level_id, o.series_id,
      case
        when l.title = 'Leçon 1 — L’Organisation des Nations Unies (ONU)' then 'onu'
        when l.title = 'Leçon 2 — L’ère de la bipolarisation de 1947 à 1991' then 'bipolarisation'
        when l.title = 'Leçon 3 — De la fin de la guerre froide à un monde multipolaire' then 'multipolaire'
      end as lesson_key
    from public.lessons l
    join public.chapters c on c.id = l.chapter_id
    join public.course_subject_offerings o on o.id = c.subject_offering_id
    join public.subjects subject on subject.id = o.subject_id
    join public.levels level on level.id = o.level_id
    join public.series series on series.id = o.series_id
    where subject.name = 'Histoire-Géographie' and level.name = 'Terminale'
      and series.name in ('A1', 'A2', 'C', 'D')
      and c.title = 'THÈME 1 — LES RELATIONS INTERNATIONALES DE 1945 À NOS JOURS'
      and l.title in (
        'Leçon 1 — L’Organisation des Nations Unies (ONU)',
        'Leçon 2 — L’ère de la bipolarisation de 1947 à 1991',
        'Leçon 3 — De la fin de la guerre froide à un monde multipolaire'
      )
    order by series.name, l.display_order
  loop
    if exists (select 1 from public.lessons where id = target.lesson_id and coalesce(btrim(content), '') <> '') then
      raise exception 'La leçon % contient déjà un cours : aucun écrasement automatique n’est autorisé.', target.lesson_id;
    end if;

    exercise_one_id := null;
    exercise_two_id := null;
    quiz_id := null;

    if target.lesson_key = 'onu' then
      lesson_description := 'Création, objectifs, principes, fonctionnement, bilan et réformes de l’Organisation des Nations Unies.';
      lesson_content := $onu$
## L’Organisation des Nations Unies (ONU)

> **Thème :** les relations internationales de 1945 à nos jours.  
> **Objectif :** expliquer comment l’ONU s’est construite, comprendre le rôle de ses organes et apprécier son action avec ses succès comme ses limites.

## Situation d’apprentissage

Lors de la crise post-électorale ivoirienne de 2010, l’ONU a participé à la supervision du processus électoral. Cette situation invite à s’interroger : comment l’organisation a-t-elle été créée, comment fonctionne-t-elle et pourquoi son action ne suffit-elle pas toujours à éviter une crise ?

## 1. Une création progressive après l’échec de la SDN

> **Définition :** la **SDN** (Société des Nations) est l’organisation internationale créée après la Première Guerre mondiale ; son incapacité à empêcher un nouveau conflit mondial conduit les Alliés à préparer une nouvelle institution.

L’ONU ne naît pas en une seule conférence. Elle résulte d’étapes successives entre 1941 et 1945. La Charte de l’Atlantique, signée par Roosevelt et Churchill en 1941, affirme les idées de liberté, de démocratie et de sécurité. La Déclaration des Nations Unies de 1942 rassemble des États opposés à l’Axe. Les rencontres de Moscou, Téhéran et Dumbarton Oaks précisent progressivement le projet. Enfin, la conférence de San Francisco adopte la Charte de l’ONU le 26 juin 1945 ; l’organisation entre officiellement en fonction le 24 octobre 1945.

| Étape | Apport essentiel au projet |
|---|---|
| Terre-Neuve, 1941 | Charte de l’Atlantique et principes de liberté, démocratie, sécurité. |
| Washington, 1942 | Déclaration des Nations Unies. |
| Moscou et Téhéran, 1943 | Réaffirmation du projet et principe d’égalité souveraine. |
| Dumbarton Oaks, 1944 | Définition des organes et du fonctionnement. |
| Yalta, 1945 | Règlement de la question du droit de veto. |
| San Francisco, 1945 | Adoption et ratification de la Charte. |

## 2. Les objectifs et les principes

> **Objectif** : résultat que l’organisation cherche à atteindre.  
> **Principe** : règle de conduite qui doit guider l’action des États membres.

L’ONU vise le maintien de la paix et de la sécurité internationales, la promotion de la souveraineté et de l’autodétermination des peuples, la défense des droits et libertés fondamentales, ainsi que la coopération internationale. Ses principes reposent sur l’égalité souveraine des États, le respect de bonne foi des obligations, le règlement pacifique des différends, le refus de la menace ou de la force et la non-ingérence dans les affaires intérieures.

> **Attention :** l’égalité souveraine est un **principe** de fonctionnement ; maintenir la paix est un **objectif**. Les confondre conduit à une réponse imprécise.

## 3. Les principaux organes

| Organe | Rôle essentiel dans le document |
|---|---|
| Assemblée générale | Organe de délibération ; chaque État dispose d’une voix, vote le budget et élit ou désigne des responsables. |
| Conseil de sécurité | Organe exécutif chargé de la paix et de la sécurité ; ses cinq membres permanents disposent du droit de veto. |
| Secrétariat général | Organe administratif dirigé par le secrétaire général, qui attire l’attention sur les situations nécessitant une intervention. |
| ECOSOC | Coordination des activités économiques et sociales. |
| Cour internationale de justice | Règlement des différends juridiques entre États ; siège à La Haye. |
| Conseil de tutelle | Contrôle historique de territoires placés sous mandat ou tutelle. |

> **Définition : droit de veto.** Pouvoir d’un membre permanent du Conseil de sécurité de s’opposer à une décision, même si une majorité y est favorable.

Le Conseil de sécurité peut adopter une réponse graduelle : résolution pour un règlement pacifique, sanctions économiques ou militaires comme l’embargo, puis, en dernier recours, intervention armée. Les **casques bleus** sont les forces déployées dans le cadre d’opérations de maintien de la paix.

## 4. Les organismes spécialisés

Les organismes spécialisés prolongent l’action de l’ONU dans des domaines précis : UNESCO pour l’éducation, la science et la culture ; FAO pour l’alimentation et l’agriculture ; OMS pour la santé ; OIT pour le travail ; HCR pour les réfugiés ; AIEA pour l’énergie atomique. Les organismes et institutions économiques, comme le FMI et la Banque mondiale, interviennent dans les questions financières et de développement.

## 5. Un bilan mitigé

L’ONU obtient des résultats dans la prévention et le règlement de conflits, la médiation, la supervision de processus électoraux, la protection des droits de l’homme et l’aide économique, sociale et humanitaire. Le document rappelle la Déclaration universelle des droits de l’homme de 1948, l’appui à l’indépendance de nombreux États et l’intervention d’organismes spécialisés lors de guerres, famines ou catastrophes.

Cependant, l’organisation connaît des limites : contestation de ses résolutions, usage du veto, retards de cotisations, lourdeur administrative, lenteur de certaines décisions, difficultés des casques bleus et persistance de nombreux conflits. Les écarts économiques, la pauvreté et l’insuffisance de certains secours humanitaires montrent également les difficultés de son action.

> **Méthode : apprécier un bilan**  
> Présenter d’abord les résultats observables, puis les limites et les causes de ces limites. Une réponse équilibrée ne dit ni que l’ONU a tout réussi, ni qu’elle n’a rien accompli.

## Synthèse

L’ONU est créée en 1945 pour dépasser l’échec de la SDN et préserver la paix. Ses objectifs et ses principes organisent la coopération des États. Son fonctionnement repose sur plusieurs organes, dont le Conseil de sécurité. Son action est réelle dans la paix, les droits humains et l’aide, mais elle demeure limitée par des blocages institutionnels et les rivalités internationales.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Leçon 1 : L’Organisation des Nations Unies (ONU) »**, Histoire, Terminale, Côte d’Ivoire – École numérique.
$onu$;
      exercise_one_title := 'Exercice 1 — Création, objectifs et principes de l’ONU';
      exercise_two_title := 'Exercice 2 — Organes, action et bilan de l’ONU';
      quiz_title := 'Quiz de révision — L’Organisation des Nations Unies (ONU)';
    elsif target.lesson_key = 'bipolarisation' then
      lesson_description := 'Formation des blocs, crises, coexistence pacifique, désagrégation de l’URSS et fin de la guerre froide.';
      lesson_content := $bipolarisation$
## L’ère de la bipolarisation de 1947 à 1991

> **Objectif :** expliquer la rupture de 1947, distinguer les deux blocs, caractériser les crises et la détente, puis analyser la désagrégation de l’URSS.

## 1. La rupture de 1947 et les blocs antagonistes

> **Définition : bipolarisation.** Division du monde en deux blocs opposés sur les plans idéologique, politique, économique et militaire : le bloc occidental conduit par les États-Unis et le bloc oriental conduit par l’URSS.

Après la Seconde Guerre mondiale, les désaccords sur la Pologne et l’Allemagne, l’installation de régimes communistes en Europe orientale et la méfiance réciproque mettent fin à la Grande Alliance. Les démocraties populaires sont des États communistes alignés sur l’URSS. À l’Ouest, la doctrine Truman du 12 mars 1947 défend une politique de **containment**, c’est-à-dire d’endiguement de l’expansion communiste. Le plan Marshall, annoncé le 5 juin 1947, propose une aide économique à l’Europe.

En réponse, la doctrine Jdanov présente le monde comme partagé entre un camp impérialiste dirigé par les États-Unis et un camp anti-impérialiste conduit par l’URSS. Les deux blocs se structurent ensuite par des alliances.

| Bloc occidental | Bloc oriental |
|---|---|
| OTAN, principale alliance politico-militaire créée en 1949. | Pacte de Varsovie, alliance politico-militaire conclue en 1955. |
| Organisations économiques et coopération occidentale. | CAEM ou COMECON, organisme de coopération économique. |

> **Définition : guerre froide.** Affrontement global entre les deux superpuissances, sans guerre directe généralisée entre elles, mais par idéologie, alliances, propagande, course aux armements et conflits localisés.

## 2. Les grandes crises de la guerre froide

L’Allemagne et Berlin constituent le premier terrain de confrontation. Lors de la première crise de Berlin, l’URSS bloque les accès terrestres à Berlin-Ouest entre 1948 et 1949. Les Occidentaux mettent en place un pont aérien. Cette crise accélère la création de la RFA à l’Ouest et de la RDA à l’Est.

La deuxième crise de Berlin conduit à la construction du mur de Berlin dans la nuit du 12 au 13 août 1961. Le mur devient le symbole visible d’une Europe séparée par le rideau de fer.

La crise de Cuba, en octobre 1962, est le paroxysme de la guerre froide. L’installation de missiles soviétiques à Cuba provoque un blocus américain et fait craindre une guerre nucléaire. Les négociations entre Kennedy et Khrouchtchev permettent un compromis : retrait des missiles soviétiques, engagement américain de ne pas envahir Cuba et retrait de missiles américains en Turquie.

> **Méthode : caractériser une crise**  
> Distinguer les causes, les décisions des acteurs, les moyens employés, le règlement et les conséquences. Une chronologie seule ne suffit pas : elle doit être expliquée.

## 3. Coexistence pacifique et détente

> **Définition : coexistence pacifique.** Acceptation de l’existence de l’autre camp et recherche de solutions négociées, sans disparition de la compétition mondiale.  
> **Définition : détente.** Période d’apaisement relatif des relations internationales, surtout des années 1960 à la fin des années 1970.

La crainte d’une destruction nucléaire, appelée **équilibre de la terreur**, encourage la négociation. Les fissures internes des blocs y contribuent également : indépendance recherchée par la France, schisme sino-soviétique, révoltes et contestations du modèle soviétique. Les deux camps concluent des accords de désarmement : traité de Moscou, traité de non-prolifération, SALT, traité de Washington, CFE et START. Le téléphone rouge entre Washington et Moscou doit éviter les malentendus dangereux.

La détente reste toutefois contrariée par les conflits localisés, notamment la deuxième guerre du Viêtnam. Ce conflit montre que la guerre froide se poursuit hors de l’Europe et que la coexistence pacifique n’empêche pas les guerres indirectes.

## 4. La désagrégation de l’URSS

À partir de 1985, Mikhaïl Gorbatchev engage deux réformes : la **perestroïka**, restructuration économique destinée à moderniser le système, et la **glasnost**, politique de transparence et de démocratisation relative. Les difficultés économiques, les pénuries, les revendications nationales et l’effondrement des régimes communistes d’Europe de l’Est fragilisent l’URSS.

La chute du mur de Berlin le 9 novembre 1989 symbolise l’effondrement du rideau de fer. En 1991, le putsch des conservateurs échoue, les républiques soviétiques proclament progressivement leur indépendance et l’URSS disparaît. Cette disparition met fin au monde bipolaire et ouvre une phase dominée par les États-Unis.

> **Attention :** la perestroïka désigne la restructuration économique ; la glasnost désigne la transparence et l’ouverture politique. Les deux notions ne sont pas interchangeables.

## Synthèse

La bipolarisation naît en 1947 de la rupture entre les Alliés. Les deux blocs s’organisent autour des États-Unis et de l’URSS. Les crises de Berlin et de Cuba montrent les risques de l’affrontement nucléaire ; la coexistence pacifique réduit certains risques sans supprimer les conflits. Les réformes de Gorbatchev, les difficultés soviétiques et les nationalismes entraînent finalement la disparition de l’URSS en 1991.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Leçon 2 : L’ère de la bipolarisation de 1947 à 1991 »**, Histoire, Terminale, Côte d’Ivoire – École numérique.
$bipolarisation$;
      exercise_one_title := 'Exercice 1 — Rupture de 1947, blocs et crises de la guerre froide';
      exercise_two_title := 'Exercice 2 — Détente, réformes de Gorbatchev et fin de la bipolarisation';
      quiz_title := 'Quiz de révision — L’ère de la bipolarisation';
    else
      lesson_description := 'Hyperpuissance américaine, contestation du leadership et émergence de nouveaux pôles dans un monde multipolaire.';
      lesson_content := $multipolaire$
## De la fin de la guerre froide à un monde multipolaire

> **Objectif :** expliquer le leadership américain de 1991 à 2001, identifier les facteurs qui le fragilisent puis reconnaître les nouveaux pôles d’influence après 2001.

## 1. Un monde unipolaire après 1991

La dissolution de l’URSS et la disparition du bloc de l’Est mettent fin à la bipolarisation. Les États-Unis deviennent alors la seule superpuissance mondiale. Le document parle d’**hyperpuissance** pour désigner une puissance qui domine simultanément les domaines militaire, économique, technologique, culturel et politique.

| Domaine | Manifestations de la puissance américaine présentées dans le document |
|---|---|
| Militaire | Armée équipée, puissance nucléaire, présence mondiale, commandement de l’OTAN et capacité d’intervention. |
| Économique | Place du dollar, Wall Street, entreprises multinationales et institutions financières. |
| Technologique | Technologies de pointe, informatique, télécommunications, aérospatial et renseignement. |
| Culturel | Diffusion de l’*American way of life* par cinéma, musique, télévision, mode et consommation. |
| Politique | Poids diplomatique et siège permanent au Conseil de sécurité. |

> **Définition : soft power.** Capacité d’influence fondée sur l’attraction d’un modèle culturel, économique ou politique, plutôt que sur la seule contrainte militaire.

## 2. Les États-Unis, « gendarme du monde »

Dans les années 1990, les États-Unis interviennent dans plusieurs crises, parfois avec l’accord de l’ONU ou sous la bannière de l’OTAN : guerre du Golfe en 1991, Somalie, Haïti, Bosnie-Herzégovine et Kosovo. Le document qualifie cette politique de *nation-building*, c’est-à-dire d’intervention visant à reconstruire ou stabiliser un État présenté comme fragile.

Ces interventions renforcent l’influence américaine mais suscitent aussi un antiaméricanisme, notamment au Proche et au Moyen-Orient. Une action internationale peut donc être présentée comme humanitaire ou sécuritaire tout en étant perçue par d’autres acteurs comme une affirmation de puissance.

## 3. Le 11 septembre 2001 et la fragilisation du leadership

Les attentats du 11 septembre 2001 frappent les États-Unis et ouvrent une nouvelle phase. Washington s’engage dans une guerre contre le terrorisme, notamment en Afghanistan, puis en Irak. Le document souligne que l’enlisement de ces guerres, les contestations de l’unilatéralisme, les crises financières et le contrôle accru des libertés fragilisent l’image et le leadership des États-Unis.

> **Définition : unilatéralisme.** Manière d’agir principalement seul, en privilégiant sa propre décision plutôt qu’une action négociée avec plusieurs États ou institutions.  
> **Définition : multilatéralisme.** Recherche de décisions et d’actions concertées entre plusieurs États ou organisations internationales.

## 4. Vers un monde multipolaire

> **Définition : monde multipolaire.** Organisation internationale dans laquelle plusieurs centres de puissance ou pôles d’influence participent aux rapports de force mondiaux, au lieu d’un seul ou de deux pôles dominants.

L’Union européenne constitue un pôle économique et diplomatique influent, malgré des limites liées à sa défense et à la diversité des politiques nationales. Les BRICS regroupent le Brésil, la Russie, l’Inde, la Chine et l’Afrique du Sud ; ils représentent des économies et puissances émergentes qui contestent l’ordre dominé par l’Occident.

La Russie cherche à maintenir son influence, notamment grâce à ses ressources énergétiques, à ses exportations d’armement et à son rôle dans les dossiers internationaux. La Chine s’affirme par son poids démographique, économique, commercial, financier et par son influence sur de nouveaux marchés. L’Inde, le Brésil et les puissances du Moyen-Orient participent également à cette recomposition des rapports de force.

> **Méthode : analyser une recomposition géopolitique**  
> Identifier l’ancien équilibre, le facteur de rupture, les nouveaux acteurs, leurs moyens d’influence et les limites de leur puissance. Cette démarche évite de réduire le monde multipolaire à une simple liste de pays.

## Synthèse

Après 1991, les États-Unis dominent la scène internationale et apparaissent comme une hyperpuissance. Les attentats du 11 septembre 2001, les guerres qui suivent et la montée de nouveaux acteurs réduisent cependant l’idée d’une domination incontestée. L’Union européenne, les BRICS et des puissances régionales contribuent à un monde caractérisé par plusieurs pôles d’influence.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Leçon 3 : De la fin de la guerre froide vers un monde multipolaire »**, Histoire, Terminale, Côte d’Ivoire – École numérique.
$multipolaire$;
      exercise_one_title := 'Exercice 1 — Hyperpuissance américaine et leadership des années 1990';
      exercise_two_title := 'Exercice 2 — Attentats de 2001 et avènement du monde multipolaire';
      quiz_title := 'Quiz de révision — Du monde unipolaire au monde multipolaire';
    end if;

    update public.lessons
    set description = lesson_description, content = lesson_content, is_active = false
    where id = target.lesson_id and coalesce(btrim(content), '') = '';

    insert into public.exercises (subject_id, level_id, series_id, chapter_id, lesson_id, title, statement, solution, exercise_type, difficulty, content_markdown, correction_markdown, is_published, is_active, estimated_duration_minutes, display_order)
    select target.subject_id, target.level_id, target.series_id, target.chapter_id, target.lesson_id, exercise_one_title,
      'Répondez en mobilisant les repères, définitions et méthodes du cours.',
      'La correction explique la notion pertinente et la justification attendue.', 'single_choice', 'easy',
      '## Consigne\n\nRépondez à chaque question puis reliez votre réponse à une notion précise du cours.',
      '## Correction\n\nVérifiez le vocabulaire historique et replacez l’évènement dans sa chronologie.', false, false, 15, 10
    where not exists (select 1 from public.exercises e where e.lesson_id = target.lesson_id and e.title = exercise_one_title)
    returning id into exercise_one_id;

    if exercise_one_id is not null then
      if target.lesson_key = 'onu' then
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order) values
          (exercise_one_id,'single_choice','Quelle conférence adopte la Charte de l’ONU en 1945 ?',jsonb_build_array('San Francisco','Yalta','Moscou','Téhéran'),jsonb_build_array('San Francisco'),'La Charte est adoptée à la conférence de San Francisco.',10),
          (exercise_one_id,'single_choice','Quel est l’objectif principal de l’ONU ?',jsonb_build_array('Maintenir la paix et la sécurité internationales','Supprimer les États','Remplacer toutes les armées','Organiser les partis politiques'),jsonb_build_array('Maintenir la paix et la sécurité internationales'),'Le maintien de la paix et de la sécurité est le premier objectif cité.',20),
          (exercise_one_id,'true_false','La non-ingérence dans les affaires intérieures des États membres est un principe de l’ONU.',jsonb_build_array('Vrai','Faux'),jsonb_build_array('Vrai'),'Le document la présente parmi les principes de l’organisation.',30);
      elsif target.lesson_key = 'bipolarisation' then
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order) values
          (exercise_one_id,'single_choice','Que désigne la bipolarisation ?',jsonb_build_array('La division du monde en deux blocs opposés','La division d’un État en deux régions','La création de l’ONU','Une alliance commerciale'),jsonb_build_array('La division du monde en deux blocs opposés'),'Le terme s’applique aux deux blocs dirigés par les États-Unis et l’URSS.',10),
          (exercise_one_id,'single_choice','Quelle doctrine américaine vise à endiguer l’expansion communiste ?',jsonb_build_array('Doctrine Truman','Doctrine Jdanov','Perestroïka','Glasnost'),jsonb_build_array('Doctrine Truman'),'La doctrine Truman constitue la politique de containment.',20),
          (exercise_one_id,'single_choice','Quelle crise aboutit à la construction du mur de Berlin en 1961 ?',jsonb_build_array('La deuxième crise de Berlin','La crise de Cuba','La guerre du Golfe','La crise de Suez'),jsonb_build_array('La deuxième crise de Berlin'),'Le mur est construit lors de la deuxième crise de Berlin.',30);
      else
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order) values
          (exercise_one_id,'single_choice','Quel terme désigne la domination américaine après la disparition de l’URSS ?',jsonb_build_array('Hyperpuissance','Bipolarisation','Démocratie populaire','Décolonisation'),jsonb_build_array('Hyperpuissance'),'Le PDF décrit les États-Unis comme une hyperpuissance après 1991.',10),
          (exercise_one_id,'single_choice','Que signifie le soft power ?',jsonb_build_array('Influence par l’attraction et le modèle','Usage exclusif de l’arme nucléaire','Disparition des alliances','Refus de toute diplomatie'),jsonb_build_array('Influence par l’attraction et le modèle'),'Il s’agit d’une influence culturelle, économique ou politique.',20),
          (exercise_one_id,'single_choice','Quel groupe réunit Brésil, Russie, Inde, Chine et Afrique du Sud ?',jsonb_build_array('BRICS','OTAN','CAEM','ONU'),jsonb_build_array('BRICS'),'Le PDF identifie les BRICS comme des puissances émergentes.',30);
      end if;
    end if;

    insert into public.exercises (subject_id, level_id, series_id, chapter_id, lesson_id, title, statement, solution, exercise_type, difficulty, content_markdown, correction_markdown, is_published, is_active, estimated_duration_minutes, display_order)
    select target.subject_id, target.level_id, target.series_id, target.chapter_id, target.lesson_id, exercise_two_title,
      'Analysez les faits, leurs causes et leurs conséquences en respectant la démarche historique.',
      'La correction distingue les repères, les causes, les conséquences et le vocabulaire attendu.', 'single_choice', 'medium',
      '## Consigne\n\nJustifiez chaque réponse à l’aide d’un élément du cours.',
      '## Correction\n\nRepérez le contexte, appliquez la définition exacte puis expliquez le lien logique.', false, false, 20, 20
    where not exists (select 1 from public.exercises e where e.lesson_id = target.lesson_id and e.title = exercise_two_title)
    returning id into exercise_two_id;

    if exercise_two_id is not null then
      if target.lesson_key = 'onu' then
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order) values
          (exercise_two_id,'single_choice','Quel organe de l’ONU est chargé principalement du maintien de la paix et de la sécurité ?',jsonb_build_array('Le Conseil de sécurité','La FAO','La Cour internationale de justice','L’UNESCO'),jsonb_build_array('Le Conseil de sécurité'),'Le Conseil de sécurité est l’organe exécutif compétent pour ces questions.',10),
          (exercise_two_id,'single_choice','Quel pouvoir peut bloquer une décision au Conseil de sécurité ?',jsonb_build_array('Le droit de veto','Le droit de grève','Le droit de succession','Le droit de douane'),jsonb_build_array('Le droit de veto'),'Les cinq membres permanents disposent du droit de veto.',20),
          (exercise_two_id,'true_false','Un bilan équilibré de l’ONU doit présenter à la fois ses succès et ses limites.',jsonb_build_array('Vrai','Faux'),jsonb_build_array('Vrai'),'Le document qualifie explicitement le bilan de mitigé.',30);
      elsif target.lesson_key = 'bipolarisation' then
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order) values
          (exercise_two_id,'single_choice','Quel événement est le paroxysme de la guerre froide dans le PDF ?',jsonb_build_array('La crise de Cuba en 1962','La création de l’ONU','La chute du mur en 1989','Le plan Marshall'),jsonb_build_array('La crise de Cuba en 1962'),'Cette crise fait craindre une guerre nucléaire directe.',10),
          (exercise_two_id,'single_choice','Que désigne la perestroïka ?',jsonb_build_array('La restructuration économique','La transparence politique','Le droit de veto','Une alliance militaire'),jsonb_build_array('La restructuration économique'),'La perestroïka vise à moderniser et restructurer l’économie soviétique.',20),
          (exercise_two_id,'true_false','La chute du mur de Berlin symbolise l’effondrement du rideau de fer.',jsonb_build_array('Vrai','Faux'),jsonb_build_array('Vrai'),'Le document relie la chute du mur à l’effondrement du bloc de l’Est.',30);
      else
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order) values
          (exercise_two_id,'single_choice','Quel facteur fragilise le leadership américain après 2001 dans le PDF ?',jsonb_build_array('L’enlisement des guerres et la contestation de l’unilatéralisme','La disparition de l’Europe','La fin du dollar en 1991','La création du Pacte de Varsovie'),jsonb_build_array('L’enlisement des guerres et la contestation de l’unilatéralisme'),'Le document associe ces facteurs à la remise en cause de la suprématie américaine.',10),
          (exercise_two_id,'single_choice','Que signifie un monde multipolaire ?',jsonb_build_array('Plusieurs centres de domination et d’influence','Un seul centre de puissance','Deux blocs fixes','Aucune puissance'),jsonb_build_array('Plusieurs centres de domination et d’influence'),'La multipolarité suppose plusieurs pôles influents.',20),
          (exercise_two_id,'true_false','L’Union européenne est présentée comme un acteur influent malgré des limites en matière de défense.',jsonb_build_array('Vrai','Faux'),jsonb_build_array('Vrai'),'Le PDF décrit l’influence de l’UE et sa dépendance partielle à l’OTAN.',30);
      end if;
    end if;

    insert into public.quizzes (subject_id, level_id, series_id, subject_offering_id, chapter_id, lesson_id, title, description, difficulty, duration_minutes, display_order, is_published, is_active)
    select target.subject_id, target.level_id, target.series_id, target.offering_id, target.chapter_id, target.lesson_id, quiz_title,
      'Évaluez votre maîtrise des repères, définitions et liens de causalité de la leçon.', 'medium', 12, 10, false, false
    where not exists (select 1 from public.quizzes q where q.lesson_id = target.lesson_id and q.title = quiz_title)
    returning id into quiz_id;

    if quiz_id is not null then
      if target.lesson_key = 'onu' then
        with added as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
          (quiz_id,'Quelle organisation précède l’ONU et échoue à empêcher la Seconde Guerre mondiale ?','La SDN est explicitement présentée comme l’organisation dont l’échec conduit au projet onusien.','single_choice',10,1,true),
          (quiz_id,'Quel est le principal organe de délibération de l’ONU ?','L’Assemblée générale rassemble les États membres.','single_choice',20,1,true),
          (quiz_id,'Quel organisme intervient principalement dans la santé ?','L’OMS est l’Organisation mondiale de la santé.','single_choice',30,1,true),
          (quiz_id,'Pourquoi le bilan de l’ONU est-il qualifié de mitigé ?','Le cours relève des actions utiles mais aussi des blocages et insuffisances.','single_choice',40,1,true) returning id,display_order)
        insert into public.quiz_answers (question_id,answer,is_correct,display_order)
        select q.id,a.answer,a.ok,a.ord from added q join lateral (select * from (values
          (10,'La SDN',true,10),(10,'L’OTAN',false,20),(20,'L’Assemblée générale',true,10),(20,'La FAO',false,20),(30,'L’OMS',true,10),(30,'Le FMI',false,20),(40,'Elle a des succès et des limites',true,10),(40,'Elle n’a aucune action',false,20)
        ) as v(qord,answer,ok,ord)) a on a.qord=q.display_order;
      elsif target.lesson_key = 'bipolarisation' then
        with added as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
          (quiz_id,'Quels États dirigent respectivement le bloc occidental et le bloc oriental ?','Les États-Unis et l’URSS sont les deux Grands.','single_choice',10,1,true),
          (quiz_id,'Quelle organisation militaire structure le bloc oriental ?','Le Pacte de Varsovie est fondé en 1955.','single_choice',20,1,true),
          (quiz_id,'Que cherche à éviter le téléphone rouge ?','Il doit limiter les malentendus entre les dirigeants des deux Grands.','single_choice',30,1,true),
          (quiz_id,'Que signifie glasnost ?','La glasnost est une politique de transparence et d’ouverture politique.','single_choice',40,1,true) returning id,display_order)
        insert into public.quiz_answers (question_id,answer,is_correct,display_order) select q.id,a.answer,a.ok,a.ord from added q join lateral (select * from (values
          (10,'Les États-Unis et l’URSS',true,10),(10,'La France et la Chine',false,20),(20,'Le Pacte de Varsovie',true,10),(20,'L’OTAN',false,20),(30,'Les malentendus dangereux',true,10),(30,'Les échanges commerciaux',false,20),(40,'La transparence politique',true,10),(40,'La restructuration économique',false,20)
        ) as v(qord,answer,ok,ord)) a on a.qord=q.display_order;
      else
        with added as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
          (quiz_id,'Quelle période le PDF associe-t-il au monde unipolaire dominé par les États-Unis ?','Le cours traite de la période 1991-2000.','single_choice',10,1,true),
          (quiz_id,'Quel événement ouvre une phase de contestation renforcée du leadership américain ?','Les attentats du 11 septembre 2001 constituent le repère du cours.','single_choice',20,1,true),
          (quiz_id,'Quel pays est présenté comme un pôle émergent grâce à son poids économique et commercial ?','La Chine est décrite comme une puissance économique et commerciale majeure.','single_choice',30,1,true),
          (quiz_id,'Pourquoi parle-t-on de multipolarité ?','Plusieurs pôles d’influence participent aux rapports de force.','single_choice',40,1,true) returning id,display_order)
        insert into public.quiz_answers (question_id,answer,is_correct,display_order) select q.id,a.answer,a.ok,a.ord from added q join lateral (select * from (values
          (10,'1991-2000',true,10),(10,'1947-1962',false,20),(20,'Les attentats du 11 septembre 2001',true,10),(20,'La crise de Berlin de 1948',false,20),(30,'La Chine',true,10),(30,'La RDA',false,20),(40,'Plusieurs pôles influencent le monde',true,10),(40,'Un seul État décide de tout',false,20)
        ) as v(qord,answer,ok,ord)) a on a.qord=q.display_order;
      end if;
    end if;
  end loop;
end
$history$;
