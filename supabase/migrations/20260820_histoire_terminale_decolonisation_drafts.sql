-- Brouillons Histoire Terminale : décolonisation. Aucun cours existant n’est remplacé.
do $decolonisation$
declare
  science record;
  target record;
  chapter_uuid uuid;
  expected_count integer;
  exercise_a uuid;
  exercise_b uuid;
  quiz_uuid uuid;
  course_text text;
  course_description text;
  title_exercise_a text;
  title_exercise_b text;
  title_quiz text;
begin
  -- Les offres scientifiques existent ; seuls le thème 2 et les trois leçons couvertes sont créés.
  for science in
    select o.id as offering_id
    from public.course_subject_offerings o
    join public.subjects sub on sub.id = o.subject_id
    join public.levels lv on lv.id = o.level_id
    join public.series s on s.id = o.series_id
    where sub.name = 'Histoire-Géographie' and lv.name = 'Terminale' and s.name in ('C', 'D')
  loop
    insert into public.chapters (subject_id, level_id, series_id, subject_offering_id, title, description, display_order, is_test_data, is_active)
    select o.subject_id, o.level_id, o.series_id, o.id,
      'THÈME 2 — DE LA DÉCOLONISATION AUX EFFORTS D’ORGANISATION DE L’AFRIQUE',
      'Décolonisation de l’Afrique, nationalismes, indépendances ivoirienne et algérienne.',
      30, false, false
    from public.course_subject_offerings o
    where o.id = science.offering_id
      and not exists (select 1 from public.chapters c where c.subject_offering_id = o.id and c.title = 'THÈME 2 — DE LA DÉCOLONISATION AUX EFFORTS D’ORGANISATION DE L’AFRIQUE');

    select id into chapter_uuid from public.chapters
    where subject_offering_id = science.offering_id and title = 'THÈME 2 — DE LA DÉCOLONISATION AUX EFFORTS D’ORGANISATION DE L’AFRIQUE'
    limit 1;

    if chapter_uuid is null then
      raise exception 'Thème 2 Histoire introuvable pour une série scientifique.';
    end if;

    insert into public.lessons (chapter_id, title, description, content, display_order, is_test_data, is_active)
    select chapter_uuid, seed.title, seed.description, null, seed.display_order, false, false
    from (values
      ('Leçon 1 — La montée d’un nationalisme', 'Facteurs, manifestations et conséquences des nationalismes en Afrique.', 10),
      ('Leçon 2 — L’accession à l’indépendance de la Côte d’Ivoire', 'Étapes, acteurs et réformes de la décolonisation ivoirienne entre 1944 et 1960.', 20),
      ('Leçon 3 — L’indépendance de l’Algérie', 'Statut colonial, nationalisme, guerre et indépendance algérienne.', 30)
    ) as seed(title, description, display_order)
    where not exists (select 1 from public.lessons l where l.chapter_id = chapter_uuid and l.title = seed.title);
  end loop;

  select count(*) into expected_count
  from public.lessons l
  join public.chapters c on c.id = l.chapter_id
  join public.course_subject_offerings o on o.id = c.subject_offering_id
  join public.subjects sub on sub.id = o.subject_id
  join public.levels lv on lv.id = o.level_id
  join public.series s on s.id = o.series_id
  where sub.name = 'Histoire-Géographie' and lv.name = 'Terminale' and s.name in ('A1', 'A2', 'C', 'D')
    and c.title = 'THÈME 2 — DE LA DÉCOLONISATION AUX EFFORTS D’ORGANISATION DE L’AFRIQUE'
    and l.title in ('Leçon 1 — La montée d’un nationalisme','Leçon 2 — L’accession à l’indépendance de la Côte d’Ivoire','Leçon 3 — L’indépendance de l’Algérie');

  if expected_count <> 12 then
    raise exception 'Douze leçons cibles sont requises avant tout remplissage ; transaction annulée.';
  end if;

  for target in
    select l.id lesson_id, c.id chapter_id, o.id offering_id, o.subject_id, o.level_id, o.series_id,
      case l.title
        when 'Leçon 1 — La montée d’un nationalisme' then 'nationalismes'
        when 'Leçon 2 — L’accession à l’indépendance de la Côte d’Ivoire' then 'cote_ivoire'
        else 'algerie'
      end lesson_key
    from public.lessons l
    join public.chapters c on c.id = l.chapter_id
    join public.course_subject_offerings o on o.id = c.subject_offering_id
    join public.subjects sub on sub.id = o.subject_id
    join public.levels lv on lv.id = o.level_id
    join public.series s on s.id = o.series_id
    where sub.name = 'Histoire-Géographie' and lv.name = 'Terminale' and s.name in ('A1', 'A2', 'C', 'D')
      and c.title = 'THÈME 2 — DE LA DÉCOLONISATION AUX EFFORTS D’ORGANISATION DE L’AFRIQUE'
      and l.title in ('Leçon 1 — La montée d’un nationalisme','Leçon 2 — L’accession à l’indépendance de la Côte d’Ivoire','Leçon 3 — L’indépendance de l’Algérie')
    order by s.name, l.display_order
  loop
    if exists (select 1 from public.lessons where id = target.lesson_id and coalesce(btrim(content), '') <> '') then
      raise exception 'La leçon % contient déjà un cours. Écrasement interdit.', target.lesson_id;
    end if;

    if target.lesson_key = 'nationalismes' then
      course_description := 'Facteurs, manifestations et conséquences des nationalismes en Afrique.';
      course_text := $nationalismes$
## La montée des nationalismes en Afrique

> **Objectif :** identifier les facteurs de l’éveil nationaliste, distinguer les formes de lutte et expliquer leur contribution à la décolonisation africaine.

## 1. Comprendre le nationalisme africain

> **Définition : nationalisme.** Prise de conscience collective par laquelle un peuple affirme son identité, refuse une domination extérieure et revendique la maîtrise de son destin politique.

Après la Seconde Guerre mondiale, les empires européens sont fragilisés. En Afrique, des mouvements nationalistes se développent et se radicalisent. Ils expriment le refus de la domination coloniale et la volonté d’obtenir une **souveraineté nationale**, c’est-à-dire le droit pour un peuple de décider lui-même de ses affaires.

## 2. Les facteurs de la montée des nationalismes

> **Définition : facteur exogène.** Cause venue de l’extérieur du territoire concerné.  
> **Définition : facteur endogène.** Cause née à l’intérieur du territoire ou de la société concernée.

### Les facteurs externes

Le contexte international facilite l’éveil nationaliste. Les États-Unis et l’URSS adoptent des positions anticoloniales, même si leurs intérêts et leurs arguments diffèrent. La Seconde Guerre mondiale affaiblit économiquement et militairement les puissances coloniales européennes. La Charte de l’ONU affirme l’égalité des peuples et leur droit à disposer d’eux-mêmes. Enfin, les pays déjà indépendants manifestent leur solidarité avec les peuples colonisés, notamment dans le cadre de Bandung et du mouvement des non-alignés.

### Les facteurs internes

L’école coloniale forme des élites africaines qui découvrent les idées de liberté, d’égalité et de justice. La croissance des cultures d’exportation favorise l’apparition d’une bourgeoisie agricole, administrative et commerciale. Les transformations sociales, l’urbanisation, le chômage et les frustrations renforcent les revendications.

Le système colonial nourrit aussi sa contestation : travaux forcés, corvées, fiscalité contraignante, discrimination, expropriations, délocalisations et aliénation culturelle. Les anciens combattants, revenus des deux guerres mondiales, constatent que le colonisateur n’est pas invincible et réclament le respect des promesses faites aux colonies.

| Facteurs exogènes | Facteurs endogènes |
|---|---|
| Anticolonialisme des grandes puissances, ONU, affaiblissement des métropoles, Bandung. | Élites instruites, bourgeoisie locale, contraintes coloniales, anciens combattants, changements socio-économiques. |

## 3. Des mouvements variés

Les mouvements nationalistes sont divers. Les partis politiques et syndicats organisent meetings, marches, grèves, boycotts, négociations et compétitions électorales. Le CPP de Kwame Nkrumah, le PDCI-RDA de Félix Houphouët-Boigny et le FLN algérien illustrent l’action politique. Les organisations syndicales, telles que le Syndicat agricole africain ou l’UGTAN, mobilisent les travailleurs.

Les mouvements religieux participent aussi à la prise de conscience : le Harrisme de William Wade Harris et le Kimbanguisme de Simon Kimbangu annoncent la délivrance face aux aliénations. Sur le plan culturel, la **négritude** valorise l’identité noire. Des écrivains comme Aimé Césaire, Léopold Sédar Senghor et Léon Gontran Damas, ainsi que la presse et les organisations étudiantes, contribuent à former une conscience collective.

> **Définition : négritude.** Mouvement culturel et intellectuel qui affirme la dignité, l’histoire et les valeurs des peuples noirs contre les représentations coloniales dévalorisantes.

## 4. Les conséquences

Les mobilisations nationalistes entraînent des acquis sociaux : abolition du code de l’indigénat, suppression des travaux forcés, libertés de réunion et d’association. Elles forcent aussi les métropoles à engager des réformes politiques : Union française, Loi-Cadre et Communauté franco-africaine. Ces mesures ne mettent pas immédiatement fin à la domination coloniale, mais elles accélèrent la marche vers les indépendances.

> **Méthode : expliquer une cause historique**  
> Distinguez les causes extérieures des causes internes, puis montrez comment elles se combinent. Une bonne réponse ne réduit pas l’éveil nationaliste à une seule cause.

## Synthèse

La montée des nationalismes africains résulte de facteurs externes et internes. Elle s’exprime par des actions politiques, syndicales, religieuses et culturelles. Les mouvements nationalistes obtiennent des réformes et accélèrent le processus de décolonisation, jusqu’à l’accession progressive des territoires africains à l’indépendance.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Leçon 1 : La montée des nationalismes en Afrique »**, Histoire, Terminale, Côte d’Ivoire – École numérique.
$nationalismes$;
      title_exercise_a := 'Exercice 1 — Facteurs de l’éveil nationaliste en Afrique';
      title_exercise_b := 'Exercice 2 — Manifestations et conséquences des nationalismes';
      title_quiz := 'Quiz de révision — La montée des nationalismes en Afrique';
    elsif target.lesson_key = 'cote_ivoire' then
      course_description := 'Étapes, acteurs et réformes de la décolonisation ivoirienne entre 1944 et 1960.';
      course_text := $ci$
## L’accession de la Côte d’Ivoire à l’indépendance

> **Objectif :** identifier les acteurs de la lutte anticoloniale et analyser les étapes qui conduisent la Côte d’Ivoire à l’indépendance entre 1944 et 1960.

## 1. Un processus inscrit dans la décolonisation africaine

La décolonisation ivoirienne s’inscrit dans le contexte de l’affaiblissement de la France après la Seconde Guerre mondiale. Sur le plan interne, elle est fortement marquée par Félix Houphouët-Boigny, le PDCI et le RDA. Le PDF organise ce cheminement en trois phases : l’espoir, la lutte et la collaboration.

## 2. La phase de l’espoir (1944-1947)

La conférence de Brazzaville, réunie du 30 janvier au 8 février 1944, cherche à adapter l’administration coloniale sans prévoir l’indépendance. Elle recommande notamment une amélioration des conditions de vie, une représentation plus large des populations colonisées et la suppression progressive du travail forcé et du code de l’indigénat.

En Côte d’Ivoire, ces recommandations favorisent plusieurs évolutions : création du Syndicat agricole africain le 8 août 1944, élection de Félix Houphouët-Boigny en 1945, création du PDCI en 1946 et amélioration de la participation politique africaine. L’Union française, créée en octobre 1946, remplace l’expression « Empire colonial » et accorde un statut de citoyen aux ressortissants de l’Union.

> **Définition : décolonisation.** Processus par lequel un territoire colonisé accède à l’autonomie puis à l’indépendance.  
> **Définition : RDA.** Rassemblement démocratique africain créé à Bamako le 18 octobre 1946 afin d’unifier l’action politique anticoloniale dans plusieurs territoires africains.

## 3. La phase de la lutte (1947-1950)

Le RDA s’apparente au Parti communiste français, qui soutient ses revendications. Cette alliance inquiète les autorités françaises dans le contexte de la guerre froide. Le PDCI-RDA mène alors une mobilisation politique par la presse, les meetings, les marches, les boycotts et les protestations.

La répression s’intensifie sous le gouverneur Laurent Péchoux. Des arrestations, des violences et des interdictions de réunions touchent les militants du PDCI. Le bilan des troubles de 1950, décrit dans le document, pousse le parti à modifier sa stratégie.

> **Définition : apparentement.** Alliance parlementaire ou politique d’un groupe avec un autre groupe afin de bénéficier d’un soutien dans l’action politique.  
> **Définition : répression.** Action par laquelle une autorité cherche à empêcher ou punir une mobilisation politique ou sociale.

## 4. La phase de la collaboration (1950-1960)

En 1950, Félix Houphouët-Boigny rompt avec le Parti communiste français et se rapproche de l’UDSR. Ce **désapparentement** ouvre une période de négociation et de participation accrue aux institutions françaises. La Loi-Cadre du 23 juin 1956 généralise le suffrage universel, renforce les assemblées territoriales et crée des conseils de gouvernement ; elle constitue une étape vers l’autonomie politique et administrative.

La Communauté franco-africaine, mise en place en 1958, transforme les colonies en républiques autonomes tout en réservant certains domaines stratégiques à la France. Elle divise les leaders africains entre fédéralistes et territorialistes. Dans ce contexte, la Côte d’Ivoire accède à l’indépendance le 7 août 1960, avec Félix Houphouët-Boigny comme premier président.

| Phase | Repères et logique principale |
|---|---|
| Espoir, 1944-1947 | Réformes de Brazzaville, organisation politique et sociale. |
| Lutte, 1947-1950 | Apparentement, mobilisations, répression et crise. |
| Collaboration, 1950-1960 | Désapparentement, réformes institutionnelles, autonomie et indépendance. |

> **Méthode : analyser un processus politique**  
> Présentez les phases dans l’ordre, nommez les acteurs, puis expliquez la transition d’une phase à l’autre. La chronologie doit être accompagnée de causes et de conséquences.

## Synthèse

L’indépendance de la Côte d’Ivoire résulte d’un long cheminement politique. Les réformes de l’après-guerre créent des possibilités nouvelles, la lutte révèle les résistances coloniales, puis la stratégie de collaboration accompagne les étapes institutionnelles vers l’autonomie et l’indépendance en 1960.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Leçon 2 : L’accession de la Côte d’Ivoire à l’indépendance »**, Histoire, Terminale, Côte d’Ivoire – École numérique.
$ci$;
      title_exercise_a := 'Exercice 1 — Les trois phases de l’indépendance ivoirienne';
      title_exercise_b := 'Exercice 2 — Acteurs, réformes et repères de la décolonisation ivoirienne';
      title_quiz := 'Quiz de révision — L’indépendance de la Côte d’Ivoire';
    else
      course_description := 'Statut colonial, nationalisme, guerre et indépendance algérienne.';
      course_text := $algerie$
## L’indépendance de l’Algérie

> **Objectif :** caractériser le statut colonial de l’Algérie et analyser les étapes qui conduisent à son indépendance en 1962.

## 1. L’Algérie française de 1830 à 1954

L’occupation française commence en 1830. L’Algérie est une **colonie de peuplement**, c’est-à-dire un territoire où des colons venus de la métropole s’installent durablement, contrôlent une part importante des terres et disposent de privilèges. À partir de 1848, le territoire est administrativement intégré à la France et divisé en départements.

La société coloniale est profondément inégalitaire. La population d’origine française bénéficie de positions administratives, industrielles et agricoles favorisées. La population autochtone musulmane subit une situation de tutelle, de précarité, de sous-emploi et de marginalisation politique. Ces inégalités nourrissent une conscience nationale algérienne.

## 2. La naissance et la radicalisation du nationalisme

Trois tendances ressortent du document. Les Oulémas, autour d’Abdelhamid Ben Badis, refusent l’assimilation et défendent l’identité religieuse et culturelle. La tendance révolutionnaire, autour de Messali Hadj, réclame l’indépendance. La tendance réformiste de Ferhat Abbas demande d’abord l’égalité et une réforme du statut politique.

> **Définition : assimilation.** Politique qui vise à faire adopter par les colonisés les institutions, la culture ou le statut de la métropole.  
> **Définition : Oulémas.** Savants et autorités religieuses musulmanes engagés ici dans la défense d’une identité algérienne.

Les événements de Sétif en mai 1945 et leur répression durcissent les positions. Le statut de 1947 ne répond pas aux attentes. Les divisions du mouvement nationaliste conduisent à la création du CRUA en 1954, convaincu que l’indépendance doit être obtenue par la lutte armée.

## 3. De l’insurrection à la guerre

Le CRUA devient le Front de libération nationale (FLN), doté d’une branche militaire, l’Armée de libération nationale (ALN). Dans la nuit du 31 octobre au 1er novembre 1954, une série d’attentats marque le début de l’insurrection : la Toussaint Rouge. La France réagit par l’envoi massif de troupes, le quadrillage, le regroupement de populations et la torture, selon le PDF.

> **Définition : insurrection.** Soulèvement organisé contre une autorité politique ou militaire.  
> **Définition : FLN.** Organisation nationaliste qui dirige la lutte pour l’indépendance algérienne.  
> **Définition : autodétermination.** Droit d’un peuple à choisir librement son statut politique.

La question algérienne prend une dimension internationale. Les non-alignés et l’ONU appellent à la décolonisation, tandis que la crise fragilise les gouvernements français.

## 4. De Gaulle, Évian et l’indépendance

Charles de Gaulle revient au pouvoir en 1958 et cherche une issue à la crise. Il envisage l’indépendance, l’assimilation ou l’autonomie-association. Le FLN exige l’indépendance totale tandis qu’une partie des Français d’Algérie s’y oppose. Les barricades et l’OAS montrent la violence des résistances.

Les négociations aboutissent aux accords d’Évian. La France reconnaît le principe de l’indépendance, l’intégrité territoriale de l’Algérie et prévoit une coopération. Les référendums de 1962 confirment cette issue. Le document retient la proclamation de l’indépendance le 3 juillet 1962 avec Ahmed Ben Bella comme premier président.

> **Définition : OAS.** Organisation de l’armée secrète, créée par des opposants à l’indépendance, qui mène des actions violentes.  
> **Définition : accords d’Évian.** Accords conclus entre la France et les représentants du FLN pour régler le conflit et organiser l’accès à l’indépendance.

> **Méthode : expliquer une indépendance conquise**  
> Présentez d’abord les inégalités coloniales, puis les formes du nationalisme, le déclenchement du conflit, les négociations et la décision finale. Montrez le rôle des acteurs sans attribuer le processus à un seul d’entre eux.

## Synthèse

L’indépendance algérienne est issue d’un long affrontement entre un système colonial inégalitaire et un nationalisme de plus en plus radical. La lutte armée menée par le FLN, l’évolution de la politique française et les accords d’Évian conduisent à la souveraineté de l’Algérie en 1962.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Leçon 3 : L’accession de l’Algérie à l’indépendance »**, Histoire, Terminale, Côte d’Ivoire – École numérique.
$algerie$;
      title_exercise_a := 'Exercice 1 — Statut colonial et nationalisme algérien';
      title_exercise_b := 'Exercice 2 — Guerre, négociations et indépendance de l’Algérie';
      title_quiz := 'Quiz de révision — L’indépendance de l’Algérie';
    end if;

    update public.lessons set description = course_description, content = course_text, is_active = false
    where id = target.lesson_id and coalesce(btrim(content), '') = '';

    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
    select target.subject_id,target.level_id,target.series_id,target.chapter_id,target.lesson_id,title_exercise_a,
      'Répondez en vous appuyant sur les notions et les repères du cours.','La correction précise la notion, le repère et la justification attendue.','single_choice','easy','## Consigne\n\nIdentifiez l’élément exact du cours puis justifiez votre choix.','## Correction\n\nReplacez la réponse dans son contexte historique.',false,false,15,10
    where not exists (select 1 from public.exercises e where e.lesson_id=target.lesson_id and e.title=title_exercise_a)
    returning id into exercise_a;

    if exercise_a is not null then
      if target.lesson_key = 'nationalismes' then
        insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
        (exercise_a,'single_choice','Quel terme désigne une cause née à l’intérieur d’une société ?',jsonb_build_array('Facteur endogène','Facteur exogène','Droit de veto','Autodétermination'),jsonb_build_array('Facteur endogène'),'Un facteur endogène est interne à la société concernée.',10),
        (exercise_a,'single_choice','Quelle institution défend le droit des peuples à disposer d’eux-mêmes dans le cours ?',jsonb_build_array('L’ONU','Le CAEM','L’OAS','Le Pacte de Varsovie'),jsonb_build_array('L’ONU'),'La Charte de l’ONU est présentée comme une référence pour l’autodétermination.',20),
        (exercise_a,'single_choice','Quelle notion valorise l’identité noire dans les mouvements culturels ?',jsonb_build_array('La négritude','La bipolarisation','Le containment','La perestroïka'),jsonb_build_array('La négritude'),'La négritude est un mouvement culturel de valorisation de l’identité noire.',30);
      elsif target.lesson_key = 'cote_ivoire' then
        insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
        (exercise_a,'single_choice','Quelle conférence ouvre la phase de l’espoir dans le cours ?',jsonb_build_array('La conférence de Brazzaville','Les accords d’Évian','La conférence de Yalta','La conférence de Bandung'),jsonb_build_array('La conférence de Brazzaville'),'La conférence de Brazzaville de 1944 est le premier repère de la phase de l’espoir.',10),
        (exercise_a,'single_choice','Quel parti est créé en Côte d’Ivoire en 1946 ?',jsonb_build_array('Le PDCI','Le FLN','L’OTAN','Le MTLD'),jsonb_build_array('Le PDCI'),'Le PDCI est créé le 9 avril 1946 selon le PDF.',20),
        (exercise_a,'single_choice','Que désigne le désapparentement de 1950 ?',jsonb_build_array('La rupture avec le PCF','La création du RDA','La signature des accords d’Évian','La fin de l’ONU'),jsonb_build_array('La rupture avec le PCF'),'Félix Houphouët-Boigny rompt avec le Parti communiste français.',30);
      else
        insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
        (exercise_a,'single_choice','Quel type de colonie est l’Algérie dans le cours ?',jsonb_build_array('Une colonie de peuplement','Une colonie sans administration','Un État indépendant dès 1830','Une zone neutre'),jsonb_build_array('Une colonie de peuplement'),'Le PDF présente l’Algérie comme une colonie de peuplement française.',10),
        (exercise_a,'single_choice','Quelle organisation déclenche l’insurrection de 1954 ?',jsonb_build_array('Le FLN','Le PDCI','L’UDSR','L’OTAN'),jsonb_build_array('Le FLN'),'Le FLN, issu du CRUA, organise l’insurrection de la Toussaint Rouge.',20),
        (exercise_a,'single_choice','Quel événement marque le début de l’insurrection ?',jsonb_build_array('La Toussaint Rouge','La Loi-Cadre','La conférence de Brazzaville','Le plan Marshall'),jsonb_build_array('La Toussaint Rouge'),'La Toussaint Rouge correspond à la nuit du 31 octobre au 1er novembre 1954.',30);
      end if;
    end if;

    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
    select target.subject_id,target.level_id,target.series_id,target.chapter_id,target.lesson_id,title_exercise_b,
      'Analysez causes, acteurs, actions et conséquences dans le respect de la démarche historique.','La correction distingue les faits, leur contexte et leurs conséquences.','single_choice','medium','## Consigne\n\nChoisissez la réponse exacte puis expliquez le lien avec le cours.','## Correction\n\nUne réponse juste doit mobiliser le vocabulaire et le contexte appropriés.',false,false,20,20
    where not exists (select 1 from public.exercises e where e.lesson_id=target.lesson_id and e.title=title_exercise_b)
    returning id into exercise_b;

    if exercise_b is not null then
      if target.lesson_key = 'nationalismes' then
        insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
        (exercise_b,'single_choice','Quelle action peut être menée par les mouvements politiques et syndicaux ?',jsonb_build_array('Grèves, boycotts et meetings','Droit de veto au Conseil de sécurité','Création de départements français','Dissolution de l’ONU'),jsonb_build_array('Grèves, boycotts et meetings'),'Le cours cite ces moyens de mobilisation.',10),
        (exercise_b,'single_choice','Quelle conséquence sociale est liée aux mobilisations nationalistes ?',jsonb_build_array('La suppression des travaux forcés','La création du mur de Berlin','La dissolution de l’URSS','La construction de l’OTAN'),jsonb_build_array('La suppression des travaux forcés'),'Le document présente la suppression du travail forcé parmi les acquis sociaux.',20),
        (exercise_b,'true_false','Les mouvements nationalistes ont eu des formes politiques, syndicales, religieuses et culturelles.',jsonb_build_array('Vrai','Faux'),jsonb_build_array('Vrai'),'Le PDF insiste sur la diversité des mouvements.',30);
      elsif target.lesson_key = 'cote_ivoire' then
        insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
        (exercise_b,'single_choice','Quelle loi constitue une étape importante vers l’autonomie des colonies ?',jsonb_build_array('La Loi-Cadre de 1956','La Charte de l’Atlantique','Le traité de Washington','Les accords SALT'),jsonb_build_array('La Loi-Cadre de 1956'),'La Loi-Cadre élargit les responsabilités des assemblées territoriales.',10),
        (exercise_b,'single_choice','Quelle date le cours associe-t-il à l’indépendance de la Côte d’Ivoire ?',jsonb_build_array('7 août 1960','1er novembre 1954','3 juillet 1962','18 octobre 1946'),jsonb_build_array('7 août 1960'),'Le PDF fixe l’indépendance ivoirienne au 7 août 1960.',20),
        (exercise_b,'true_false','La phase de la collaboration supprime toute action politique ivoirienne.',jsonb_build_array('Vrai','Faux'),jsonb_build_array('Faux'),'La stratégie devient davantage parlementaire et institutionnelle.',30);
      else
        insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
        (exercise_b,'single_choice','Quel accord règle le conflit franco-algérien dans le cours ?',jsonb_build_array('Les accords d’Évian','La Charte de l’Atlantique','Le traité de Rome','Le pacte de Varsovie'),jsonb_build_array('Les accords d’Évian'),'Les accords d’Évian organisent l’issue négociée du conflit.',10),
        (exercise_b,'single_choice','Que défend le principe d’autodétermination ?',jsonb_build_array('Le droit d’un peuple à choisir son statut politique','Le droit de veto','Le maintien du colonialisme','La création de l’OAS'),jsonb_build_array('Le droit d’un peuple à choisir son statut politique'),'L’autodétermination est un droit politique des peuples.',20),
        (exercise_b,'true_false','Le FLN réclame l’indépendance totale de l’Algérie.',jsonb_build_array('Vrai','Faux'),jsonb_build_array('Vrai'),'Le FLN rejette les compromis fédéraux et demande l’indépendance.',30);
      end if;
    end if;

    insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active)
    select target.subject_id,target.level_id,target.series_id,target.offering_id,target.chapter_id,target.lesson_id,title_quiz,
      'Évaluez votre maîtrise des repères, notions et relations de causalité de la leçon.','medium',12,10,false,false
    where not exists (select 1 from public.quizzes q where q.lesson_id=target.lesson_id and q.title=title_quiz)
    returning id into quiz_uuid;

    if quiz_uuid is not null then
      if target.lesson_key = 'nationalismes' then
        with q as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
          (quiz_uuid,'Comment appelle-t-on le processus qui conduit un territoire colonisé à l’indépendance ?','La décolonisation est le processus de sortie de la domination coloniale.','single_choice',10,1,true),
          (quiz_uuid,'Quel rassemblement de 1955 est cité comme expression de solidarité anticoloniale ?','Le cours retient la conférence de Bandung.','single_choice',20,1,true),
          (quiz_uuid,'Quel mouvement relève du domaine culturel ?','La négritude est un mouvement culturel.','single_choice',30,1,true),
          (quiz_uuid,'Pourquoi parle-t-on de bilan progressif des nationalismes ?','Ils obtiennent des réformes et accélèrent l’accès aux indépendances.','single_choice',40,1,true) returning id,display_order)
        insert into public.quiz_answers (question_id,answer,is_correct,display_order)
        select q.id,v.answer,v.ok,v.ord from q join lateral (select * from (values
          (10,'La décolonisation',true,10),(10,'La bipolarisation',false,20),(20,'Bandung',true,10),(20,'Yalta',false,20),(30,'La négritude',true,10),(30,'Le CAEM',false,20),(40,'Ils obtiennent des réformes et accélèrent les indépendances',true,10),(40,'Ils n’ont aucune conséquence',false,20)) as x(qord,answer,ok,ord)) v on v.qord=q.display_order;
      elsif target.lesson_key = 'cote_ivoire' then
        with q as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
          (quiz_uuid,'Quel syndicat Félix Houphouët-Boigny crée-t-il en 1944 ?','Le Syndicat agricole africain est créé le 8 août 1944.','single_choice',10,1,true),
          (quiz_uuid,'Quel mouvement panafricain est créé à Bamako en 1946 ?','Le RDA est créé à Bamako.','single_choice',20,1,true),
          (quiz_uuid,'Quelle phase succède à la phase de la lutte ?','Le PDF distingue ensuite une phase de collaboration.','single_choice',30,1,true),
          (quiz_uuid,'Quelle réforme généralise le suffrage universel dans les colonies ?','La Loi-Cadre de 1956 est l’étape institutionnelle visée.','single_choice',40,1,true) returning id,display_order)
        insert into public.quiz_answers (question_id,answer,is_correct,display_order)
        select q.id,v.answer,v.ok,v.ord from q join lateral (select * from (values
          (10,'Le SAA',true,10),(10,'Le FLN',false,20),(20,'Le RDA',true,10),(20,'L’OAS',false,20),(30,'La phase de la collaboration',true,10),(30,'La phase de la guerre froide',false,20),(40,'La Loi-Cadre de 1956',true,10),(40,'Le plan Marshall',false,20)) as x(qord,answer,ok,ord)) v on v.qord=q.display_order;
      else
        with q as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
          (quiz_uuid,'Quelle ville est associée aux événements de mai 1945 dans le cours ?','Le PDF cite les émeutes de Sétif.','single_choice',10,1,true),
          (quiz_uuid,'Que signifie ALN ?','ALN signifie Armée de libération nationale.','single_choice',20,1,true),
          (quiz_uuid,'Quel général revient au pouvoir en France en 1958 ?','Charles de Gaulle revient au pouvoir pour résoudre la crise.','single_choice',30,1,true),
          (quiz_uuid,'Quel résultat du référendum algérien de 1962 est retenu ?','Le référendum approuve l’indépendance.','single_choice',40,1,true) returning id,display_order)
        insert into public.quiz_answers (question_id,answer,is_correct,display_order)
        select q.id,v.answer,v.ok,v.ord from q join lateral (select * from (values
          (10,'Sétif',true,10),(10,'Brazzaville',false,20),(20,'Armée de libération nationale',true,10),(20,'Assemblée législative nationale',false,20),(30,'Charles de Gaulle',true,10),(30,'George Marshall',false,20),(40,'Il approuve l’indépendance',true,10),(40,'Il maintient la colonisation',false,20)) as x(qord,answer,ok,ord)) v on v.qord=q.display_order;
      end if;
    end if;
  end loop;
end
$decolonisation$;
