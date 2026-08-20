do $ua_croyances$
declare
  science record;
  target record;
  citation_seed record;
  chapter_uuid uuid;
  exercise_a uuid;
  exercise_b uuid;
  quiz_uuid uuid;
  citation_uuid uuid;
  citation_subject_uuid uuid;
  expected_count integer;
  course_text text;
  course_description text;
  title_exercise_a text;
  title_exercise_b text;
  title_quiz text;
begin
  -- Les deux thèmes nécessaires doivent exister dans chaque progression concernée.
  for science in
    select o.id as offering_id
    from public.course_subject_offerings o
    join public.subjects sub on sub.id = o.subject_id
    join public.levels lv on lv.id = o.level_id
    join public.series s on s.id = o.series_id
    where sub.name = 'Histoire-Géographie' and lv.name = 'Terminale' and s.name in ('A1', 'A2', 'C', 'D')
  loop
    insert into public.chapters (subject_id, level_id, series_id, subject_offering_id, title, description, display_order, is_test_data, is_active)
    select o.subject_id, o.level_id, o.series_id, o.id,
      'THÈME 2 — DE LA DÉCOLONISATION AUX EFFORTS D’ORGANISATION DE L’AFRIQUE',
      'Décolonisation, indépendances et construction des organisations africaines.',
      30, false, false
    from public.course_subject_offerings o
    where o.id = science.offering_id
      and not exists (select 1 from public.chapters c where c.subject_offering_id = o.id and c.title = 'THÈME 2 — DE LA DÉCOLONISATION AUX EFFORTS D’ORGANISATION DE L’AFRIQUE');

    insert into public.chapters (subject_id, level_id, series_id, subject_offering_id, title, description, display_order, is_test_data, is_active)
    select o.subject_id, o.level_id, o.series_id, o.id,
      'THÈME 3 — CROYANCES ET VALEURS DANS LE MONDE D’AUJOURD’HUI',
      'Fondements, valeurs, institutions et mutations des civilisations contemporaines.',
      40, false, false
    from public.course_subject_offerings o
    where o.id = science.offering_id
      and not exists (select 1 from public.chapters c where c.subject_offering_id = o.id and c.title = 'THÈME 3 — CROYANCES ET VALEURS DANS LE MONDE D’AUJOURD’HUI');

    select id into chapter_uuid
    from public.chapters
    where subject_offering_id = science.offering_id
      and title = 'THÈME 2 — DE LA DÉCOLONISATION AUX EFFORTS D’ORGANISATION DE L’AFRIQUE'
    limit 1;

    insert into public.lessons (chapter_id, title, description, content, display_order, is_test_data, is_active)
    select chapter_uuid, 'Leçon 4 — L’Union africaine (UA)',
      'Origines, principes, institutions, bilan et limites de l’Union africaine.', null, 40, false, false
    where chapter_uuid is not null
      and not exists (select 1 from public.lessons l where l.chapter_id = chapter_uuid and l.title = 'Leçon 4 — L’Union africaine (UA)');

    select id into chapter_uuid
    from public.chapters
    where subject_offering_id = science.offering_id
      and title = 'THÈME 3 — CROYANCES ET VALEURS DANS LE MONDE D’AUJOURD’HUI'
    limit 1;

    insert into public.lessons (chapter_id, title, description, content, display_order, is_test_data, is_active)
    select chapter_uuid, seed.title, seed.description, null, seed.display_order, false, false
    from (values
      ('Leçon 1 — Croyances et valeurs dominantes dans le monde occidental', 'Fondements, institutions, système économique et traits socioculturels du monde occidental.', 10),
      ('Leçon 2 — Les mutations contemporaines de la civilisation négro-africaine', 'Leçon conservée vide : un PDF source lisible est requis avant tout remplissage.', 20)
    ) as seed(title, description, display_order)
    where chapter_uuid is not null
      and not exists (select 1 from public.lessons l where l.chapter_id = chapter_uuid and l.title = seed.title);
  end loop;

  select count(*) into expected_count
  from public.lessons l
  join public.chapters c on c.id = l.chapter_id
  join public.course_subject_offerings o on o.id = c.subject_offering_id
  join public.subjects sub on sub.id = o.subject_id
  join public.levels lv on lv.id = o.level_id
  join public.series s on s.id = o.series_id
  where sub.name = 'Histoire-Géographie' and lv.name = 'Terminale' and s.name in ('A1', 'A2', 'C', 'D')
    and ((c.title = 'THÈME 2 — DE LA DÉCOLONISATION AUX EFFORTS D’ORGANISATION DE L’AFRIQUE' and l.title = 'Leçon 4 — L’Union africaine (UA)')
      or (c.title = 'THÈME 3 — CROYANCES ET VALEURS DANS LE MONDE D’AUJOURD’HUI' and l.title = 'Leçon 1 — Croyances et valeurs dominantes dans le monde occidental'));

  if expected_count <> 8 then
    raise exception 'Huit leçons cibles sont requises avant tout remplissage ; transaction annulée.';
  end if;

  for target in
    select l.id lesson_id, c.id chapter_id, o.id offering_id, o.subject_id, o.level_id, o.series_id,
      case when l.title = 'Leçon 4 — L’Union africaine (UA)' then 'ua' else 'occident' end as lesson_key
    from public.lessons l
    join public.chapters c on c.id = l.chapter_id
    join public.course_subject_offerings o on o.id = c.subject_offering_id
    join public.subjects sub on sub.id = o.subject_id
    join public.levels lv on lv.id = o.level_id
    join public.series s on s.id = o.series_id
    where sub.name = 'Histoire-Géographie' and lv.name = 'Terminale' and s.name in ('A1', 'A2', 'C', 'D')
      and ((c.title = 'THÈME 2 — DE LA DÉCOLONISATION AUX EFFORTS D’ORGANISATION DE L’AFRIQUE' and l.title = 'Leçon 4 — L’Union africaine (UA)')
        or (c.title = 'THÈME 3 — CROYANCES ET VALEURS DANS LE MONDE D’AUJOURD’HUI' and l.title = 'Leçon 1 — Croyances et valeurs dominantes dans le monde occidental'))
    order by s.name, c.display_order, l.display_order
  loop
    if exists (select 1 from public.lessons where id = target.lesson_id and coalesce(btrim(content), '') <> '') then
      raise exception 'La leçon % contient déjà un cours. Écrasement interdit.', target.lesson_id;
    end if;

    if target.lesson_key = 'ua' then
      course_description := 'Origines, principes, institutions, bilan et limites de l’Union africaine.';
      course_text := $ua$
## L’Union africaine (UA)

> **Objectif :** expliquer le passage de l’Organisation de l’unité africaine à l’Union africaine, présenter ses institutions et apprécier ses actions comme ses limites.

## 1. De l’OUA à l’Union africaine

L’Union africaine est l’organisation continentale qui succède à l’Organisation de l’unité africaine (OUA). La transformation répond à un constat : l’OUA a fortement contribué à la lutte contre le colonialisme et l’apartheid, mais son principe de non-ingérence limitait sa capacité à répondre aux crises internes, aux conflits et aux défis du développement.

Le projet d’Union africaine se précise au sommet de Syrte en 1999. L’Acte constitutif est adopté à Lomé en 2000, des modalités sont précisées à Lusaka en 2001 et l’organisation est officiellement lancée à Durban en 2002. Son siège est établi à Addis-Abeba, en Éthiopie.

> **Définition : intégration africaine.** Processus par lequel les États africains renforcent leur coopération politique, économique, sociale et culturelle afin d’agir plus efficacement à l’échelle continentale.

## 2. Objectifs et principes

L’UA veut promouvoir l’unité, la solidarité, la paix, la sécurité, la démocratie, les droits de l’homme, l’intégration économique et le développement durable. Elle cherche aussi à donner à l’Afrique une place plus forte dans les relations internationales.

Ses principes combinent le respect de la souveraineté des États et la responsabilité collective face aux crises. L’organisation affirme le règlement pacifique des différends, le respect des frontières héritées de l’indépendance, le rejet des changements anticonstitutionnels de gouvernement et la non-ingérence.

> **Définition : souveraineté.** Droit d’un État de décider librement de ses affaires sur son territoire.  
> **Définition : non-ingérence.** Principe selon lequel un État ne doit pas intervenir arbitrairement dans les affaires intérieures d’un autre État.  
> **Attention :** le respect de la souveraineté n’empêche pas l’UA de rechercher des réponses collectives à certaines crises par la médiation, la prévention ou des décisions prévues par ses textes.

## 3. Les institutions de l’UA

La Conférence de l’Union, réunissant les chefs d’État et de gouvernement, est l’organe suprême. Le Conseil exécutif, formé des ministres compétents, prépare et coordonne les politiques. La Commission de l’Union africaine assure le travail quotidien et le suivi des décisions.

Le Comité des représentants permanents prépare les travaux de l’Union. Le Parlement panafricain porte une dimension représentative. Le Conseil de paix et de sécurité (CPS) travaille à la prévention, à la gestion et au règlement des conflits. L’architecture institutionnelle comprend aussi des comités spécialisés, des organes consultatifs, judiciaires et des projets d’institutions financières continentales.

> **Définition : Conseil de paix et de sécurité.** Organe de l’UA chargé notamment de prévenir les conflits, d’encourager la médiation et de soutenir la paix et la sécurité sur le continent.  
> **Définition : institution financière continentale.** Organisme envisagé ou mis en place à l’échelle africaine pour soutenir le financement des politiques communes et l’autonomie économique.

## 4. Bilan et limites

L’UA participe à des médiations, à des interventions humanitaires et à des initiatives de paix. Avec le NEPAD, elle soutient des programmes de développement et de coopération. Son action donne un cadre africain commun aux problèmes qui dépassent les frontières nationales.

Cependant, les conflits armés, l’insécurité, les difficultés financières, les retards de cotisation et la dépendance à des financements extérieurs limitent son efficacité. La faible intégration économique et la diversité des intérêts nationaux ralentissent aussi plusieurs projets.

> **Définition : NEPAD.** Nouveau Partenariat pour le développement de l’Afrique, initiative associée à la recherche de développement, de bonne gouvernance et de coopération continentale.  
> **Définition : autonomie financière.** Capacité d’une institution à financer durablement ses activités avec des ressources dont elle maîtrise l’origine et l’usage.

> **Méthode : apprécier le bilan d’une organisation**  
> Présentez d’abord les actions concrètes, puis les obstacles. Une appréciation équilibrée ne dit ni que l’organisation est sans effet, ni qu’elle résout seule tous les problèmes.

## Synthèse

L’Union africaine est née de la volonté de dépasser les limites de l’OUA. Elle dispose d’objectifs plus larges et d’institutions tournées vers l’intégration, la paix et le développement. Son bilan montre des initiatives utiles, mais aussi des limites liées aux crises, au financement et à l’intégration encore incomplète.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Leçon 4 : L’Union africaine »**, Histoire, Terminale, Côte d’Ivoire – École numérique.
$ua$;
      title_exercise_a := 'Exercice 1 — Naissance, objectifs et institutions de l’Union africaine';
      title_exercise_b := 'Exercice 2 — Bilan et limites de l’Union africaine';
      title_quiz := 'Quiz de révision — L’Union africaine';
    else
      course_description := 'Fondements, institutions, système économique et traits socioculturels du monde occidental.';
      course_text := $occident$
## Croyances et valeurs dominantes dans le monde occidental

> **Objectif :** localiser le monde occidental, expliquer les héritages qui le fondent et caractériser ses valeurs politiques, économiques et socioculturelles, sans ignorer leurs limites.

## 1. Situer et comprendre le monde occidental

Le monde occidental désigne un ensemble de sociétés principalement situées en Europe, en Amérique du Nord, en Australie et en Nouvelle-Zélande, ainsi que des espaces influencés par leurs modèles politiques, économiques ou culturels. Cette expression ne décrit pas une civilisation totalement uniforme : elle rassemble des sociétés diverses partageant certains héritages et certaines valeurs dominantes.

Les fondements anciens évoqués dans le cours sont l’apport de la Grèce antique, le droit romain, l’héritage judéo-chrétien et les langues ainsi que les pensées gréco-latines. À l’époque moderne et contemporaine, la limitation du pouvoir monarchique, les révolutions américaine et française, puis les droits de l’homme contribuent à installer la démocratie libérale comme référence politique.

> **Définition : démocratie libérale.** Régime qui associe la participation électorale, la protection des libertés individuelles, le pluralisme politique et la limitation des pouvoirs par le droit.

## 2. Valeurs et institutions politiques

Les valeurs politiques importantes sont la liberté, l’égalité devant la loi, le suffrage universel, le pluralisme des partis et le respect d’une constitution. Dans un régime parlementaire, le gouvernement dépend politiquement du parlement. Dans un régime présidentiel, le président dispose d’attributions propres, séparées de celles du pouvoir législatif.

La séparation des pouvoirs distingue les fonctions législative, exécutive et judiciaire. Elle vise à éviter qu’une même autorité concentre toutes les décisions. La presse et les médias participent à l’information et au débat public, mais leur influence nécessite aussi un esprit critique.

> **Définition : suffrage universel.** Droit de vote accordé à l’ensemble des citoyens remplissant les conditions prévues par la loi.  
> **Définition : constitution.** Texte ou ensemble de règles fondamentales qui organise les pouvoirs publics et garantit des droits.  
> **Définition : pluralisme.** Coexistence de plusieurs opinions, partis ou groupes dans l’espace public.

## 3. Valeurs économiques et société de consommation

Le libéralisme économique valorise l’initiative privée, la propriété, la concurrence, l’offre et la demande ainsi que la recherche du profit. Le capitalisme est un système où les moyens de production sont majoritairement privés et où l’investissement cherche un rendement. L’économie de marché organise la production et les échanges principalement par les prix, l’offre et la demande.

Ces sociétés connaissent souvent une forte urbanisation, le développement des loisirs, des médias et de la consommation. La société de consommation encourage l’acquisition de biens et de services, mais peut aussi accentuer les inégalités et la pression sur les ressources.

> **Définition : lobbying.** Action organisée visant à influencer une décision publique au nom d’intérêts particuliers ou collectifs.  
> **Attention :** le libéralisme n’est pas synonyme d’absence totale de règles ; les États peuvent encadrer les marchés par des lois et des politiques publiques.

## 4. Limites et débats

Les valeurs proclamées ne sont pas toujours appliquées de manière égale. Les inégalités sociales, les exclusions, les discriminations, la puissance de certains groupes de pression et les extrémismes peuvent fragiliser l’idéal démocratique. L’exercice des libertés peut aussi poser des questions lorsqu’il porte atteinte aux droits d’autrui.

> **Méthode : caractériser une civilisation**  
> Organisez votre réponse par domaines : fondements historiques, institutions politiques, économie et traits socioculturels. Terminez par les limites, afin de produire une analyse nuancée.

## Synthèse

Le monde occidental se construit sur des héritages antiques, romains et judéo-chrétiens, puis sur les transformations politiques modernes. Ses valeurs dominantes associent démocratie, libertés, économie de marché et société de consommation. Elles forment un modèle influent, mais traversé par des tensions et des inégalités.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Leçon 1 : Croyances et valeurs dominantes dans le monde occidental »**, Histoire, Terminale, Côte d’Ivoire – École numérique.
$occident$;
      title_exercise_a := 'Exercice 1 — Fondements et institutions du monde occidental';
      title_exercise_b := 'Exercice 2 — Valeurs économiques, société et limites';
      title_quiz := 'Quiz de révision — Croyances et valeurs du monde occidental';
    end if;

    update public.lessons set description = course_description, content = course_text, is_active = false
    where id = target.lesson_id and coalesce(btrim(content), '') = '';

    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
    select target.subject_id,target.level_id,target.series_id,target.chapter_id,target.lesson_id,title_exercise_a,
      'Répondez aux questions en mobilisant les notions et les repères du cours.','La correction relie chaque réponse au vocabulaire précis de la leçon.','single_choice','easy','## Consigne\n\nIdentifiez le repère ou la notion correcte, puis justifiez oralement votre choix.','## Correction\n\nReplacez la réponse dans le plan du cours.',false,false,15,10
    where not exists (select 1 from public.exercises e where e.lesson_id=target.lesson_id and e.title=title_exercise_a)
    returning id into exercise_a;

    if exercise_a is not null then
      if target.lesson_key = 'ua' then
        insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
        (exercise_a,'single_choice','Quel sommet marque le lancement officiel de l’Union africaine dans le cours ?',jsonb_build_array('Durban en 2002','Bandung en 1955','Brazzaville en 1944','Évian en 1962'),jsonb_build_array('Durban en 2002'),'Le cours retient Durban en 2002 comme lancement officiel de l’UA.',10),
        (exercise_a,'single_choice','Quel organe est spécialement consacré à la paix et à la sécurité ?',jsonb_build_array('Le Conseil de paix et de sécurité','Le Parlement européen','Le CAEM','Le Conseil de tutelle'),jsonb_build_array('Le Conseil de paix et de sécurité'),'Le CPS est l’organe de prévention et de gestion des conflits de l’UA.',20),
        (exercise_a,'single_choice','Que signifie non-ingérence ?',jsonb_build_array('Ne pas intervenir arbitrairement dans les affaires internes d’un autre État','Refuser toute coopération africaine','Supprimer les frontières','Dissoudre les institutions nationales'),jsonb_build_array('Ne pas intervenir arbitrairement dans les affaires internes d’un autre État'),'La non-ingérence protège les affaires intérieures des États.',30);
      else
        insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
        (exercise_a,'single_choice','Quel héritage est associé aux règles juridiques dans le cours ?',jsonb_build_array('Le droit romain','Le traité de Rome','La guerre froide','Le NEPAD'),jsonb_build_array('Le droit romain'),'Le droit romain est présenté parmi les fondements lointains du monde occidental.',10),
        (exercise_a,'single_choice','Quel principe évite la concentration de toutes les fonctions de l’État ?',jsonb_build_array('La séparation des pouvoirs','La non-ingérence','La monétarisation','Le non-alignement'),jsonb_build_array('La séparation des pouvoirs'),'La séparation des pouvoirs distingue les fonctions législative, exécutive et judiciaire.',20),
        (exercise_a,'single_choice','Quel texte organise les pouvoirs publics et les droits fondamentaux ?',jsonb_build_array('La constitution','Le boycott','La coutume orale','La loi coloniale'),jsonb_build_array('La constitution'),'Une constitution organise les institutions et protège des droits.',30);
      end if;
    end if;

    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
    select target.subject_id,target.level_id,target.series_id,target.chapter_id,target.lesson_id,title_exercise_b,
      'Analysez les actions, limites et notions de la leçon avec une réponse justifiée.','La correction explique le lien entre l’élément choisi et son contexte.','single_choice','medium','## Consigne\n\nChoisissez la réponse exacte puis expliquez son rapport avec le cours.','## Correction\n\nUne bonne réponse mobilise une notion précise et une idée du bilan.',false,false,20,20
    where not exists (select 1 from public.exercises e where e.lesson_id=target.lesson_id and e.title=title_exercise_b)
    returning id into exercise_b;

    if exercise_b is not null then
      if target.lesson_key = 'ua' then
        insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
        (exercise_b,'single_choice','Quel programme est associé au développement africain dans le cours ?',jsonb_build_array('Le NEPAD','Le plan Marshall','Le pacte de Varsovie','Le Commonwealth'),jsonb_build_array('Le NEPAD'),'Le NEPAD est cité parmi les initiatives liées au développement.',10),
        (exercise_b,'single_choice','Quelle difficulté limite l’action de l’UA ?',jsonb_build_array('Les retards de cotisation et la dépendance financière','L’absence totale d’États membres','La disparition de tout conflit','Le refus de toute institution'),jsonb_build_array('Les retards de cotisation et la dépendance financière'),'Les contraintes financières réduisent l’autonomie et l’efficacité de l’organisation.',20),
        (exercise_b,'true_false','Un bilan équilibré de l’UA doit présenter à la fois ses médiations et ses limites.',jsonb_build_array('Vrai','Faux'),jsonb_build_array('Vrai'),'Le cours demande de distinguer les actions réelles et les obstacles.',30);
      else
        insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
        (exercise_b,'single_choice','Quel système valorise la propriété privée, la concurrence et le profit ?',jsonb_build_array('Le libéralisme économique','Le code de l’indigénat','Le non-alignement','La gérontocratie'),jsonb_build_array('Le libéralisme économique'),'Le cours rattache ces principes au libéralisme économique.',10),
        (exercise_b,'single_choice','Quel mot désigne l’influence organisée sur une décision publique ?',jsonb_build_array('Le lobbying','La décolonisation','La non-ingérence','La souveraineté'),jsonb_build_array('Le lobbying'),'Le lobbying cherche à influencer une décision au nom d’intérêts.',20),
        (exercise_b,'true_false','Le cours présente le monde occidental comme totalement uniforme et sans inégalités.',jsonb_build_array('Vrai','Faux'),jsonb_build_array('Faux'),'Le cours insiste sur la diversité des sociétés et sur les limites du modèle.',30);
      end if;
    end if;

    insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active)
    select target.subject_id,target.level_id,target.series_id,target.offering_id,target.chapter_id,target.lesson_id,title_quiz,
      'Évaluez votre maîtrise des repères, institutions, valeurs et nuances de la leçon.','medium',12,10,false,false
    where not exists (select 1 from public.quizzes q where q.lesson_id=target.lesson_id and q.title=title_quiz)
    returning id into quiz_uuid;

    if quiz_uuid is not null then
      if target.lesson_key = 'ua' then
        with q as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
          (quiz_uuid,'Quelle organisation précède l’Union africaine ?','L’UA succède à l’Organisation de l’unité africaine.','single_choice',10,1,true),
          (quiz_uuid,'Dans quelle ville se trouve le siège de l’UA ?','Le siège de l’UA est à Addis-Abeba, en Éthiopie.','single_choice',20,1,true),
          (quiz_uuid,'Quel principe protège les affaires intérieures des États ?','La non-ingérence est le principe concerné.','single_choice',30,1,true),
          (quiz_uuid,'Pourquoi l’autonomie financière est-elle importante ?','Elle permet à une institution de financer durablement son action avec des ressources qu’elle maîtrise.','single_choice',40,1,true) returning id,display_order)
        insert into public.quiz_answers (question_id,answer,is_correct,display_order)
        select q.id,v.answer,v.ok,v.ord from q join lateral (select * from (values
          (10,'L’Organisation de l’unité africaine',true,10),(10,'Le Conseil de l’Europe',false,20),(20,'Addis-Abeba',true,10),(20,'New York',false,20),(30,'La non-ingérence',true,10),(30,'La société de consommation',false,20),(40,'Pour renforcer la capacité d’action de l’institution',true,10),(40,'Pour supprimer les États membres',false,20)) as x(qord,answer,ok,ord)) v on v.qord=q.display_order;
      else
        with q as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
          (quiz_uuid,'Quelle civilisation antique contribue aux idées politiques occidentales selon le cours ?','Le cours mentionne l’apport de la Grèce antique.','single_choice',10,1,true),
          (quiz_uuid,'Quel type de régime lie politiquement le gouvernement au parlement ?','Il s’agit du régime parlementaire.','single_choice',20,1,true),
          (quiz_uuid,'Que régulent principalement l’offre et la demande ?','Elles participent à la formation des prix et à l’organisation des échanges.','single_choice',30,1,true),
          (quiz_uuid,'Pourquoi analyser aussi les limites du modèle ?','Les inégalités, exclusions et dérives rappellent que les valeurs proclamées ne sont pas toujours appliquées de façon égale.','single_choice',40,1,true) returning id,display_order)
        insert into public.quiz_answers (question_id,answer,is_correct,display_order)
        select q.id,v.answer,v.ok,v.ord from q join lateral (select * from (values
          (10,'La Grèce antique',true,10),(10,'Le NEPAD',false,20),(20,'Le régime parlementaire',true,10),(20,'Le régime colonial',false,20),(30,'Les prix et les échanges',true,10),(30,'Les frontières héritées',false,20),(40,'Pour produire une analyse nuancée',true,10),(40,'Parce qu’il n’existe aucune inégalité',false,20)) as x(qord,answer,ok,ord)) v on v.qord=q.display_order;
      end if;
    end if;
  end loop;

  -- Citations documentées : dix par matière reconnue par le module Citations.
  for citation_seed in
    select * from (values
      ('Français','La raison du plus fort est toujours la meilleure.','Jean de La Fontaine','Fables','Le Loup et l’Agneau, I, 10','https://fr.wikisource.org/wiki/Fables_(La_Fontaine)','Une formule utile pour analyser la critique de l’abus de pouvoir dans l’apologue.',array['fable','argumentation','justice']::text[],'Argumentation'),
      ('Français','Patience et longueur de temps font plus que force ni que rage.','Jean de La Fontaine','Fables','Le Lion et le Rat, II, 11','https://fr.wikisource.org/wiki/Fables_(La_Fontaine)','Elle montre comment la morale d’une fable se construit par une formule mémorable.',array['fable','morale','temps']::text[],'Fable'),
      ('Français','On a souvent besoin d’un plus petit que soi.','Jean de La Fontaine','Fables','Le Lion et le Rat, II, 11','https://fr.wikisource.org/wiki/Fables_(La_Fontaine)','Cette citation aide à repérer la portée sociale et morale d’un récit bref.',array['fable','morale','solidarité']::text[],'Fable'),
      ('Français','Tout flatteur vit aux dépens de celui qui l’écoute.','Jean de La Fontaine','Fables','Le Corbeau et le Renard, I, 2','https://fr.wikisource.org/wiki/Fables_(La_Fontaine)','Elle permet d’étudier la persuasion, la flatterie et la critique des comportements.',array['fable','persuasion','satire']::text[],'Argumentation'),
      ('Français','Rien ne sert de courir ; il faut partir à point.','Jean de La Fontaine','Fables','Le Lièvre et la Tortue, VI, 10','https://fr.wikisource.org/wiki/Fables_(La_Fontaine)','La formule condense une morale et illustre le rôle de la chute dans la fable.',array['fable','morale','récit']::text[],'Fable'),
      ('Français','Selon que vous serez puissant ou misérable, les jugements de cour vous rendront blanc ou noir.','Jean de La Fontaine','Fables','Les Animaux malades de la peste, VII, 1','https://fr.wikisource.org/wiki/Fables_(La_Fontaine)','Elle soutient une analyse de la satire sociale et de l’inégalité devant la justice.',array['fable','satire','justice']::text[],'Satire'),
      ('Français','Aide-toi, le Ciel t’aidera.','Jean de La Fontaine','Fables','Le Chartier embourbé, VI, 18','https://fr.wikisource.org/wiki/Fables_(La_Fontaine)','Elle sert à distinguer la morale explicite de l’action racontée dans une fable.',array['fable','morale','effort']::text[],'Fable'),
      ('Français','Tel est pris qui croyait prendre.','Jean de La Fontaine','Fables','Le Rat et l’Huître, VIII, 9','https://fr.wikisource.org/wiki/Fables_(La_Fontaine)','Cette chute illustre l’ironie et le renversement dans le récit.',array['fable','ironie','chute']::text[],'Fable'),
      ('Français','Il faut cultiver notre jardin.','Voltaire','Candide ou l’Optimisme','Chapitre XXX','https://fr.wikisource.org/wiki/Candide,_ou_l%E2%80%99Optimisme/Garnier_1877/Texte_entier','Elle permet d’étudier la conclusion d’un conte philosophique et le passage à l’action concrète.',array['conte philosophique','Voltaire','conclusion']::text[],'Littérature d’idées'),
      ('Français','Le travail éloigne de nous trois grands maux : l’ennui, le vice et le besoin.','Voltaire','Candide ou l’Optimisme','Chapitre XXX','https://fr.wikisource.org/wiki/Candide,_ou_l%E2%80%99Optimisme/Garnier_1877/Texte_entier','Elle éclaire la critique voltairienne et le sens moral de la fin de Candide.',array['conte philosophique','travail','Voltaire']::text[],'Littérature d’idées'),
      ('Philosophie','Je pense, donc je suis.','René Descartes','Discours de la méthode','Quatrième partie','https://fr.wikisource.org/wiki/Discours_de_la_m%C3%A9thode','Cette formule permet d’introduire la recherche d’une certitude première par le doute.',array['Descartes','conscience','doute']::text[],'Connaissance'),
      ('Philosophie','Le bon sens est la chose du monde la mieux partagée.','René Descartes','Discours de la méthode','Première partie','https://fr.wikisource.org/wiki/Discours_de_la_m%C3%A9thode','Elle ouvre une réflexion sur la raison et l’usage méthodique de l’esprit.',array['Descartes','raison','méthode']::text[],'Raison'),
      ('Philosophie','Ce n’est pas assez d’avoir l’esprit bon, mais le principal est de l’appliquer bien.','René Descartes','Discours de la méthode','Première partie','https://fr.wikisource.org/wiki/Discours_de_la_m%C3%A9thode','Elle distingue la possession d’une faculté et son usage méthodique.',array['Descartes','méthode','raison']::text[],'Raison'),
      ('Philosophie','La lecture de tous les bons livres est comme une conversation avec les plus honnêtes gens des siècles passés.','René Descartes','Discours de la méthode','Première partie','https://fr.wikisource.org/wiki/Discours_de_la_m%C3%A9thode','Elle aide à discuter le rôle de la culture et de la transmission des savoirs.',array['Descartes','lecture','culture']::text[],'Connaissance'),
      ('Philosophie','Ceux qui ne marchent que fort lentement peuvent avancer beaucoup davantage, s’ils suivent toujours le droit chemin.','René Descartes','Discours de la méthode','Deuxième partie','https://fr.wikisource.org/wiki/Discours_de_la_m%C3%A9thode','Elle illustre la valeur d’une méthode rigoureuse plutôt que la précipitation.',array['Descartes','méthode','progrès']::text[],'Méthode'),
      ('Philosophie','Pour examiner la vérité, il est besoin, une fois en sa vie, de mettre toutes choses en doute autant qu’il se peut.','René Descartes','Principes de la philosophie','Première partie, article 1','https://fr.wikisource.org/wiki/Les_Principes_de_la_philosophie','Elle formule la fonction critique du doute méthodique.',array['Descartes','doute','vérité']::text[],'Connaissance'),
      ('Philosophie','Renoncer à sa liberté, c’est renoncer à sa qualité d’homme.','Jean-Jacques Rousseau','Du contrat social','Livre I, chapitre IV','https://fr.wikisource.org/wiki/Du_contrat_social/%C3%89dition_1762/Texte_entier','Elle permet de réfléchir au lien entre liberté, dignité et vie politique.',array['Rousseau','liberté','dignité']::text[],'Liberté'),
      ('Philosophie','La force ne fait pas le droit.','Jean-Jacques Rousseau','Du contrat social','Livre I, chapitre III','https://fr.wikisource.org/wiki/Du_contrat_social/%C3%89dition_1762/Texte_entier','Elle oppose le fait de la puissance à la légitimité politique.',array['Rousseau','droit','force']::text[],'Politique'),
      ('Philosophie','L’obéissance à la loi qu’on s’est prescrite est liberté.','Jean-Jacques Rousseau','Du contrat social','Livre I, chapitre VIII','https://fr.wikisource.org/wiki/Du_contrat_social/%C3%89dition_1762/Texte_entier','Elle sert à distinguer autonomie et simple absence de contraintes.',array['Rousseau','liberté','loi']::text[],'Liberté'),
      ('Philosophie','La souveraineté ne peut être représentée.','Jean-Jacques Rousseau','Du contrat social','Livre III, chapitre XV','https://fr.wikisource.org/wiki/Du_contrat_social/%C3%89dition_1762/Texte_entier','Elle introduit la réflexion sur la souveraineté populaire et la représentation.',array['Rousseau','souveraineté','politique']::text[],'Politique'),
      ('Histoire-Géographie','Tous les êtres humains naissent libres et égaux en dignité et en droits.','Assemblée générale des Nations Unies','Déclaration universelle des droits de l’homme','Article 1','https://www.un.org/fr/about-us/universal-declaration-of-human-rights','Elle constitue un repère institutionnel pour étudier droits, égalité et citoyenneté.',array['droits humains','égalité','ONU']::text[],'Droits humains'),
      ('Histoire-Géographie','Chacun peut se prévaloir de tous les droits et de toutes les libertés proclamés dans la présente Déclaration.','Assemblée générale des Nations Unies','Déclaration universelle des droits de l’homme','Article 2','https://www.un.org/fr/about-us/universal-declaration-of-human-rights','Elle permet de relier le principe d’universalité aux enjeux de discrimination.',array['droits humains','universalité','ONU']::text[],'Droits humains'),
      ('Histoire-Géographie','Tout individu a droit à la vie, à la liberté et à la sûreté de sa personne.','Assemblée générale des Nations Unies','Déclaration universelle des droits de l’homme','Article 3','https://www.un.org/fr/about-us/universal-declaration-of-human-rights','Elle sert de repère pour analyser la protection de la personne.',array['droits humains','liberté','ONU']::text[],'Droits humains'),
      ('Histoire-Géographie','Nul ne sera tenu en esclavage ni en servitude.','Assemblée générale des Nations Unies','Déclaration universelle des droits de l’homme','Article 4','https://www.un.org/fr/about-us/universal-declaration-of-human-rights','Elle éclaire l’étude de l’abolition, de la dignité et de la liberté.',array['droits humains','esclavage','ONU']::text[],'Droits humains'),
      ('Histoire-Géographie','Nul ne sera soumis à la torture, ni à des peines ou traitements cruels, inhumains ou dégradants.','Assemblée générale des Nations Unies','Déclaration universelle des droits de l’homme','Article 5','https://www.un.org/fr/about-us/universal-declaration-of-human-rights','Elle permet de repérer une norme internationale de protection de la dignité.',array['droits humains','dignité','ONU']::text[],'Droits humains'),
      ('Histoire-Géographie','Chacun a le droit à la reconnaissance en tous lieux de sa personnalité juridique.','Assemblée générale des Nations Unies','Déclaration universelle des droits de l’homme','Article 6','https://www.un.org/fr/about-us/universal-declaration-of-human-rights','Elle introduit la notion de personnalité juridique et d’égalité devant le droit.',array['droits humains','droit','ONU']::text[],'Droits humains'),
      ('Histoire-Géographie','Tous sont égaux devant la loi et ont droit sans distinction à une égale protection de la loi.','Assemblée générale des Nations Unies','Déclaration universelle des droits de l’homme','Article 7','https://www.un.org/fr/about-us/universal-declaration-of-human-rights','Elle soutient l’analyse de l’État de droit et de la non-discrimination.',array['droits humains','égalité','loi']::text[],'Droits humains'),
      ('Histoire-Géographie','Toute personne a droit à un recours effectif devant les juridictions nationales compétentes.','Assemblée générale des Nations Unies','Déclaration universelle des droits de l’homme','Article 8','https://www.un.org/fr/about-us/universal-declaration-of-human-rights','Elle permet de comprendre le rôle des institutions judiciaires dans la protection des droits.',array['droits humains','justice','ONU']::text[],'Droits humains'),
      ('Histoire-Géographie','Toute personne a droit à la liberté de pensée, de conscience et de religion.','Assemblée générale des Nations Unies','Déclaration universelle des droits de l’homme','Article 18','https://www.un.org/fr/about-us/universal-declaration-of-human-rights','Elle constitue un repère pour l’étude des libertés et des croyances.',array['droits humains','religion','liberté']::text[],'Libertés'),
      ('Histoire-Géographie','Tout individu a droit à la liberté d’opinion et d’expression.','Assemblée générale des Nations Unies','Déclaration universelle des droits de l’homme','Article 19','https://www.un.org/fr/about-us/universal-declaration-of-human-rights','Elle aide à étudier la place de la presse et des libertés publiques.',array['droits humains','expression','presse']::text[],'Libertés'),
      ('Physique-Chimie','Toute généralisation est une hypothèse.','Henri Poincaré','La Science et l’Hypothèse','Chapitre VI, Les hypothèses en physique','https://fr.wikisource.org/wiki/La_Science_et_l%E2%80%99Hypoth%C3%A8se/Texte_entier','Elle rappelle qu’une généralisation scientifique doit être examinée et confrontée aux faits.',array['hypothèse','méthode scientifique','Poincaré']::text[],'Raisonnement scientifique'),
      ('Physique-Chimie','L’hypothèse a donc un rôle nécessaire que personne n’a jamais contesté.','Henri Poincaré','La Science et l’Hypothèse','Chapitre VI, Les hypothèses en physique','https://fr.wikisource.org/wiki/La_Science_et_l%E2%80%99Hypoth%C3%A8se/Texte_entier','Elle permet d’expliquer pourquoi la science ne se limite pas à l’accumulation de faits.',array['hypothèse','science','Poincaré']::text[],'Raisonnement scientifique'),
      ('Physique-Chimie','Elle doit toujours être, le plus tôt possible et le plus souvent possible, soumise à la vérification.','Henri Poincaré','La Science et l’Hypothèse','Chapitre VI, Les hypothèses en physique','https://fr.wikisource.org/wiki/La_Science_et_l%E2%80%99Hypoth%C3%A8se/Texte_entier','Elle formule la nécessité de la vérification expérimentale.',array['vérification','expérience','Poincaré']::text[],'Expérimentation'),
      ('Physique-Chimie','Si elle ne supporte pas cette épreuve, on doit l’abandonner sans arrière-pensée.','Henri Poincaré','La Science et l’Hypothèse','Chapitre VI, Les hypothèses en physique','https://fr.wikisource.org/wiki/La_Science_et_l%E2%80%99Hypoth%C3%A8se/Texte_entier','Elle illustre le caractère révisable d’une hypothèse scientifique.',array['hypothèse','réfutation','Poincaré']::text[],'Raisonnement scientifique'),
      ('Physique-Chimie','L’expérience nous laisse notre libre choix, mais elle le guide en nous aidant à discerner le chemin le plus commode.','Henri Poincaré','La Science et l’Hypothèse','Introduction','https://fr.wikisource.org/wiki/La_Science_et_l%E2%80%99Hypoth%C3%A8se/Texte_entier','Elle montre le dialogue entre construction théorique et expérience.',array['expérience','théorie','Poincaré']::text[],'Expérimentation'),
      ('Physique-Chimie','La science serait certaine, mais dépourvue de portée.','Henri Poincaré','La Science et l’Hypothèse','Introduction','https://fr.wikisource.org/wiki/La_Science_et_l%E2%80%99Hypoth%C3%A8se/Texte_entier','Elle invite à distinguer la cohérence formelle de la portée explicative d’une science.',array['science','réalité','Poincaré']::text[],'Raisonnement scientifique'),
      ('Physique-Chimie','Ce qu’elle peut atteindre, ce ne sont pas les choses elles-mêmes, ce sont seulement les rapports entre les choses.','Henri Poincaré','La Science et l’Hypothèse','Introduction','https://fr.wikisource.org/wiki/La_Science_et_l%E2%80%99Hypoth%C3%A8se/Texte_entier','Elle permet de réfléchir au rôle des relations et des modèles en science.',array['science','modèle','Poincaré']::text[],'Science et réalité'),
      ('Physique-Chimie','L’induction, appliquée aux sciences physiques, est toujours incertaine.','Henri Poincaré','La Science et l’Hypothèse','Chapitre I, Sur la nature du raisonnement mathématique','https://fr.wikisource.org/wiki/La_Science_et_l%E2%80%99Hypoth%C3%A8se/Texte_entier','Elle aide à distinguer la généralisation empirique de la démonstration.',array['induction','physique','Poincaré']::text[],'Raisonnement scientifique'),
      ('Physique-Chimie','L’induction mathématique, c’est-à-dire la démonstration par récurrence, s’impose au contraire nécessairement.','Henri Poincaré','La Science et l’Hypothèse','Chapitre I, Sur la nature du raisonnement mathématique','https://fr.wikisource.org/wiki/La_Science_et_l%E2%80%99Hypoth%C3%A8se/Texte_entier','Elle introduit une comparaison raisonnée entre induction physique et induction mathématique.',array['induction','mathématiques','Poincaré']::text[],'Raisonnement scientifique'),
      ('Physique-Chimie','Nous ne pouvons nous élever que par l’induction mathématique, qui seule peut nous apprendre quelque chose de nouveau.','Henri Poincaré','La Science et l’Hypothèse','Chapitre I, Sur la nature du raisonnement mathématique','https://fr.wikisource.org/wiki/La_Science_et_l%E2%80%99Hypoth%C3%A8se/Texte_entier','Elle souligne le rôle productif du raisonnement mathématique dans la connaissance.',array['induction','mathématiques','Poincaré']::text[],'Raisonnement scientifique')
    ) as seed(subject_name,quote_text,author,source_title,source_reference,source_url,pedagogical_explanation,keywords,theme)
  loop
    select id into citation_subject_uuid from public.subjects where name = citation_seed.subject_name limit 1;
    if citation_subject_uuid is null then
      raise exception 'La matière Citations % est introuvable.', citation_seed.subject_name;
    end if;

    insert into public.citations (subject_id,quote_text,author,source_title,source_reference,source_url,pedagogical_explanation,keywords,is_active,is_validated)
    select citation_subject_uuid,citation_seed.quote_text,citation_seed.author,citation_seed.source_title,citation_seed.source_reference,citation_seed.source_url,citation_seed.pedagogical_explanation,citation_seed.keywords,false,false
    where not exists (select 1 from public.citations c where c.subject_id = citation_subject_uuid and c.quote_text = citation_seed.quote_text and c.author = citation_seed.author)
    returning id into citation_uuid;

    if citation_uuid is not null then
      insert into public.citation_scopes (citation_id,level_id,series_id)
      select citation_uuid, lv.id, s.id
      from public.levels lv cross join public.series s
      where lv.name = 'Terminale' and s.name in ('A1', 'A2', 'C', 'D');

      insert into public.citation_themes (citation_id,theme) values (citation_uuid,citation_seed.theme);
    end if;
  end loop;
end
$ua_croyances$;
