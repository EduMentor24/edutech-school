-- PDF « La dissertation philosophique » : Terminale toutes séries.
-- A1 contient déjà un cours publié : aucun contenu de leçon ne sera modifié pour cette série.
-- A2, C et D sont enrichies uniquement si leur contenu est encore vide.

do $dissertation$
declare
  target record;
  exercise_one_id uuid;
  exercise_two_id uuid;
  quiz_id uuid;
  lesson_content text;
  lesson_description text;
begin
  for target in
    select
      l.id as lesson_id,
      c.id as chapter_id,
      o.id as offering_id,
      o.subject_id,
      o.level_id,
      o.series_id,
      case
        when l.id = 'e89a1557-6308-4d51-8565-4fb5b1a479e6'::uuid then 'a1_existing'
        when l.id = 'f6759b97-8322-44ac-8c1f-33655dffd422'::uuid then 'draft_content'
        when l.id = 'e56a0b7f-9337-4b03-bc2a-8a482e4090d3'::uuid then 'draft_content'
        when l.id = 'd6f4155b-0744-4e1e-b60c-3d969ae18cd7'::uuid then 'draft_content'
      end as lesson_key
    from public.lessons l
    join public.chapters c on c.id = l.chapter_id
    join public.course_subject_offerings o on o.id = c.subject_offering_id
    join public.subjects subject on subject.id = o.subject_id
    join public.levels level on level.id = o.level_id
    join public.series series on series.id = o.series_id
    where l.id in (
      'e89a1557-6308-4d51-8565-4fb5b1a479e6',
      'f6759b97-8322-44ac-8c1f-33655dffd422',
      'e56a0b7f-9337-4b03-bc2a-8a482e4090d3',
      'd6f4155b-0744-4e1e-b60c-3d969ae18cd7'
    )
      and level.name = 'Terminale'
      and series.name in ('A1', 'A2', 'C', 'D')
      and subject.name = 'Philosophie'
      and l.title = 'Leçon 1 La dissertation philosophique'
    order by series.name
  loop
    if target.lesson_key is null then
      raise exception 'Leçon cible de dissertation non reconnue : %', target.lesson_id;
    end if;

    if target.lesson_key = 'draft_content' and exists (
      select 1 from public.lessons
      where id = target.lesson_id and coalesce(btrim(content), '') <> ''
    ) then
      raise exception 'La leçon cible % contient déjà du contenu : aucune écriture automatique n’est autorisée.', target.lesson_id;
    end if;

    lesson_description := 'Méthode complète de la dissertation philosophique : compréhension du sujet, problématisation, plan, argumentation et rédaction.';
    lesson_content := $course$
# La dissertation philosophique

> **Compétence I — Thème : La méthodologie**  
> **Objectif :** apprendre à comprendre un sujet, faire apparaître son problème, construire une argumentation organisée et rédiger une introduction, un développement et une conclusion rigoureux.

## Situation d’apprentissage

Une bonne dissertation ne consiste pas à accumuler des idées sur un thème. Elle part d’un **sujet précis**, en cherche la difficulté centrale, puis lui apporte une réponse argumentée. Dans la situation proposée par le document, les élèves veulent comprendre comment réussir cet exercice à partir de bonnes copies : il faut donc apprendre à construire l’introduction, organiser l’argumentation et rédiger une conclusion.

> **Idée directrice.** La dissertation philosophique est un exercice écrit qui analyse un sujet en faisant apparaître le problème qu’il contient, puis en le traitant par une argumentation cohérente.

## 1. Glossaire essentiel : comprendre les mots de la méthode

| Mot nouveau | Définition utile dans la dissertation | Pourquoi est-il important ? |
|---|---|---|
| **Sujet** | Proposition ou question soumise à l’analyse. | Il fixe exactement ce dont il faut parler. |
| **Étude parcellaire** | Analyse séparée des mots et expressions indispensables du sujet. | Elle évite de répondre à un sujet mal compris. |
| **Reformulation** | Réécriture plus explicite du sujet sans en changer le sens. | Elle vérifie que le sens général est compris. |
| **Problème** | Difficulté intellectuelle centrale soulevée par le sujet. | Il organise toute la réflexion. |
| **Paradoxe** | Opposition surprenante entre deux idées qui paraissent pourtant défendables. | Il permet souvent de découvrir le problème. |
| **Aspect du problème** | Question particulière née du problème central. | Il annonce les axes du développement. |
| **Axe d’analyse** | Grande direction dans laquelle la réflexion va chercher une réponse. | Il donne l’ossature du plan. |
| **Argument** | Raisonnement qui justifie une thèse. | Il transforme une opinion en réponse défendue. |
| **Référence** | Appui tiré d’un auteur, d’une œuvre ou d’une pensée étudiée. | Elle éclaire et renforce l’argument sans le remplacer. |
| **Illustration** | Exemple concret qui rend un argument plus compréhensible. | Elle montre comment l’idée peut se vérifier dans une situation. |
| **Transition** | Passage logique entre deux arguments ou deux axes. | Elle évite la juxtaposition d’idées sans lien. |
| **Ouverture** | Dernière perspective possible après la réponse apportée. | Elle élargit la réflexion sans fuir la conclusion. |

## 2. Comprendre le sujet avant d’écrire

La phase préparatoire est indispensable. Écrire directement un plan ou une introduction expose à un risque : traiter un autre problème que celui qui est réellement posé. Le document distingue deux opérations complémentaires.

### A. L’étude parcellaire : examiner les termes décisifs

L’**étude parcellaire** consiste à identifier les mots ou expressions essentiels et à les définir dans le contexte du sujet. Il ne faut pas définir tous les mots mécaniquement : on s’arrête sur ceux qui commandent le sens et qui peuvent recevoir plusieurs interprétations.

Prenons le sujet : **« Doit-on condamner le progrès technique ? »**. Le document invite à analyser :

| Expression | Sens à préciser | Reformulation partielle possible |
|---|---|---|
| **Doit-on** | Faut-il ? Est-il légitime de ? | Est-il justifié de… |
| **Condamner** | Blâmer, rejeter, désapprouver. | Rejeter comme nuisible. |
| **Progrès technique** | Avancées et exploits réalisés par la technique. | Développement des procédés techniques. |

Cette étape produit déjà une vigilance philosophique : « condamner » n’est pas seulement constater un danger ; c’est porter un jugement. Le sujet demande donc d’examiner les raisons de blâmer ou de défendre le progrès technique.

### B. La reformulation : rendre le sens global plus clair

La **reformulation** donne le sens d’ensemble du sujet en le réécrivant plus explicitement, sans modifier ce qu’il demande. Elle ne doit ni réduire le sujet à un seul aspect, ni ajouter une idée étrangère.

Ainsi, « Doit-on condamner le progrès technique ? » peut devenir : **« Faut-il blâmer les avancées réalisées par la technique ? »**. La question est plus explicite, mais le sens initial est conservé.

> **Méthode.** Après votre reformulation, vérifiez toujours : « Ai-je gardé tous les mots importants du sujet ? Ai-je conservé sa forme interrogative, sa nuance et son enjeu ? »

## 3. Problématiser : faire apparaître la difficulté centrale

### A. Ne pas confondre thème, question et problème

Un **thème** est le domaine général abordé, par exemple la technique, la société, le travail ou la culture. La **question** est la formulation donnée par le sujet. Le **problème** est la difficulté intellectuelle cachée dans cette question : deux réponses semblent possibles, mais chacune rencontre une limite.

Dans le sujet sur le progrès technique, le problème peut être formulé ainsi : **la technique est-elle seulement nuisible, ou peut-elle aussi être un facteur de développement ?** Cette formulation fait apparaître la tension entre les bienfaits possibles de la technique et les inquiétudes qu’elle suscite.

### B. Les aspects du problème deviennent les axes de réflexion

Les **aspects du problème** sont les questions qui permettent de traiter la difficulté centrale. Ils annoncent les axes du développement. Pour le progrès technique, on peut par exemple demander :

1. En quoi le progrès technique est-il facteur de développement ?
2. Pourquoi peut-il aussi susciter des inquiétudes ?

Ces questions ne sont pas encore des réponses. Elles indiquent le chemin de l’analyse. L’élève cherchera ensuite, pour chaque axe, des arguments, des références et des illustrations.

### C. Exemple guidé : vivre en société

Le document propose le sujet : **« Il faut plaindre celui qui vit en société. » Qu’en pensez-vous ?**

| Étape préparatoire | Travail attendu |
|---|---|
| Étude parcellaire | « Il faut plaindre » signifie avoir pitié ; « celui qui vit en société » désigne l’homme qui vit avec ses semblables dans un espace organisé par des règles. |
| Reformulation | Il est nécessaire d’avoir de la compassion pour celui qui vit avec les autres. |
| Problème | Faut-il réellement plaindre celui qui vit en société ? |
| Aspects | En quel sens la vie sociale peut-elle être pénible ? Ne procure-t-elle pas aussi sécurité, coopération et liberté ? |

Le premier axe peut montrer la peur, l’hypocrisie ou la contrainte que l’on peut rencontrer dans la société, en s’appuyant sur Sartre, Hobbes ou Bakounine tels qu’ils sont mobilisés dans le document. Le second axe met en évidence l’assistance, la collaboration et la protection apportées par la société, avec Garaudy, Malson ou Spinoza. Le but n’est pas de réciter des noms, mais d’expliquer comment chaque référence éclaire l’argument.

## 4. Construire le plan au brouillon

Avant de rédiger, le brouillon doit servir à organiser la pensée. Le document propose une progression complète : étude parcellaire, reformulation, problème, aspects, plan, recherche d’arguments, puis recherche de références ou citations.

### Fiche de préparation réutilisable

| Opération | Question de contrôle |
|---|---|
| 1. Étude parcellaire | Quels mots du sujet doivent être définis ? |
| 2. Reformulation | Puis-je redire le sujet clairement sans le trahir ? |
| 3. Problème | Quelle contradiction ou difficulté le sujet soulève-t-il ? |
| 4. Aspects | Quelles questions vont guider les axes ? |
| 5. Plan | Dans quel ordre les axes vont-ils répondre au problème ? |
| 6. Arguments | Quelle raison précise soutient chaque axe ? |
| 7. Références et illustrations | Quelle pensée, œuvre ou situation éclaire réellement cet argument ? |

> **Conseil.** Un plan n’est pas une liste de mots. Chaque axe doit porter une idée défendable ; chaque argument doit apporter une raison claire ; chaque référence doit être expliquée dans vos propres phrases.

## 5. Rédiger l’introduction

L’introduction pose clairement le problème à traiter. Elle comporte trois éléments essentiels : une **amorce**, le **problème**, puis les **aspects** du problème.

### A. L’amorce

L’amorce introduit le thème par une observation pertinente. Elle doit conduire au sujet, non raconter une histoire sans rapport. Dans l’exemple sur la technique, le document part du progrès visible des sciences et des techniques dans la vie quotidienne.

### B. Le problème

Après l’amorce, l’élève fait apparaître la difficulté. Pour le progrès technique, l’efficacité de la technoscience semble annoncer le développement, mais ses conséquences peuvent aussi menacer l’humanité. C’est cette tension qui donne naissance au problème.

### C. Les aspects

L’introduction se termine par les questions qui guideront le développement. Elles doivent correspondre à ce qui sera réellement analysé ensuite.

| Partie de l’introduction | Fonction | Erreur à éviter |
|---|---|---|
| Amorce | Introduire le thème et conduire au sujet. | Une phrase vague ou éloignée du sujet. |
| Problème | Montrer la difficulté intellectuelle. | Répéter seulement le sujet sans tension. |
| Aspects | Annoncer les axes de l’analyse. | Poser des questions sans rapport avec le développement. |

## 6. Développer une argumentation philosophique

Le **développement** cherche à résoudre le problème. Il organise les axes, les arguments, les références et les illustrations. Une dissertation n’est donc pas un simple « pour/contre » sans explication.

### A. La structure d’un paragraphe argumentatif

Un paragraphe solide peut suivre ce mouvement :

1. **Affirmer l’idée de l’axe ou de l’argument.**
2. **Expliquer pourquoi cette idée est valable.**
3. **L’éclairer par une référence ou une illustration.**
4. **Relier cette idée au problème posé.**

Pour le sujet **« Le travail humanise-t-il ? »**, le document explique d’abord que le travail, comme activité consciente de transformation, distingue l’homme de l’animal. Marx permet de soutenir cette idée : en transformant la nature, l’homme transforme aussi ses propres facultés. Voltaire montre ensuite que le travail peut éloigner l’ennui, le vice et le besoin. Mais l’analyse doit aussi considérer la critique : dans certaines formes modernes, le machinisme et la division du travail peuvent aliéner le travailleur, comme l’examine Marx ; Platon souligne la pénibilité de certains travaux. Un troisième moment peut alors rappeler, avec Mounier, que le travail demeure une activité de socialisation et de formation humaine.

### B. Employer les références avec rigueur

Une référence philosophique ne doit pas être déposée au milieu d’un paragraphe comme une formule décorative. Il faut dire ce qu’elle signifie et montrer son lien avec l’argument.

| Usage insuffisant | Usage rigoureux |
|---|---|
| « Sartre dit : “L’enfer, c’est les autres”. » | Expliquer que la présence d’autrui peut devenir source de conflit ou de jugement, puis montrer en quoi cela éclaire une difficulté de la vie sociale. |
| « Marx parle du travail. » | Préciser que le travail est une activité consciente de transformation qui peut développer les facultés humaines, mais aussi devenir aliénant selon ses conditions. |

### C. Les transitions

Les **transitions** relient les idées. Elles peuvent commencer par des connecteurs comme « cependant », « toutefois », « dès lors », « en outre » ou « ainsi ». Leur rôle est de montrer pourquoi l’on passe d’un argument à un autre ou d’un axe à l’autre.

> **Repère.** Une transition ne sert pas seulement à faire joli. Elle explique une nécessité logique : par exemple, après avoir montré les bienfaits du progrès technique, il devient nécessaire d’examiner les dangers qui limitent cet optimisme.

## 7. Conclure sans répéter mécaniquement

La **conclusion** répond clairement et précisément au problème posé dans l’introduction. Elle commence par un **bilan** de la réflexion, puis formule la réponse obtenue. Elle peut se terminer par une ouverture, mais l’ouverture n’est jamais obligatoire et ne doit pas remplacer la réponse.

| Étape | Ce qu’il faut faire |
|---|---|
| Bilan | Rappeler très brièvement les résultats essentiels des axes. |
| Réponse | Prendre position de façon nuancée et directement liée au problème. |
| Ouverture possible | Indiquer une question voisine qui prolonge la réflexion. |

## 8. Deux exemples de problématisation issus du document

### A. Diversité culturelle et rapprochement des peuples

Pour le sujet **« La pluralité des cultures est-elle un obstacle au rapprochement des peuples ? »**, les mots clés sont pluralité des cultures, obstacle et rapprochement des peuples. Le problème peut devenir : l’égalité entre les hommes est-elle une illusion face aux différences culturelles ?

Un premier axe examine les conflits, l’ethnocentrisme et les prétentions de supériorité. Un second montre que la diversité peut enrichir l’humanité, favoriser le brassage culturel et appeler le respect moral de l’autre. Les références à Lévi-Strauss, Comte, Césaire, Saint-Exupéry et Kant fournies par le document doivent être expliquées dans le raisonnement.

### B. Le travail et l’humanisation

Pour **« Le travail humanise-t-il ? »**, il faut définir le travail comme activité consciente de transformation et « humanise » comme ce qui confère dignité, valeur et éloigne de l’animalité. Le problème porte sur l’ambivalence du travail : rend-il l’homme plus humain ou peut-il aussi le dégrader ? Les axes doivent présenter ses fonctions d’humanisation, ses formes d’aliénation, puis la place durable du travail dans la socialisation et la formation de la personne.

## 9. Erreurs fréquentes et moyens de les éviter

| Erreur | Pourquoi elle affaiblit le devoir | Correction méthodique |
|---|---|---|
| Répondre avant de définir le sujet. | La réponse risque de porter sur un autre thème. | Commencer par l’étude parcellaire et la reformulation. |
| Poser une seule question sans problème. | Le développement manque de direction. | Chercher la tension ou le paradoxe du sujet. |
| Empiler des citations. | La pensée personnelle disparaît derrière les noms. | Expliquer chaque référence et son utilité argumentative. |
| Juxtaposer des idées. | Le lecteur ne voit pas la logique du plan. | Utiliser des transitions et des bilans partiels. |
| Terminer sans répondre au problème. | La dissertation reste inachevée. | Formuler une réponse claire dans la conclusion. |

## Synthèse finale

- La dissertation commence par la compréhension exacte du sujet : étude parcellaire et reformulation.
- La problématisation fait apparaître une difficulté centrale et ses aspects.
- Le brouillon permet de construire le plan, les arguments, les références et les illustrations.
- L’introduction contient une amorce, le problème et ses aspects.
- Le développement résout progressivement le problème par des axes argumentés et reliés par des transitions.
- La conclusion fait le bilan et apporte une réponse précise, éventuellement prolongée par une ouverture.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Leçon 1 : La dissertation philosophique »**, Philosophie, Terminale toutes séries, Côte d’Ivoire – École numérique. Le plan, les notions méthodologiques, les exemples et les auteurs mobilisés suivent le document source.
$course$;

    if target.lesson_key = 'draft_content' then
      update public.lessons
      set description = lesson_description,
          content = lesson_content,
          is_active = false
      where id = target.lesson_id
        and coalesce(btrim(content), '') = '';
    end if;

    insert into public.exercises (subject_id, level_id, series_id, chapter_id, lesson_id, title, statement, solution, exercise_type, difficulty, content_markdown, correction_markdown, is_published, is_active, estimated_duration_minutes, display_order)
    select target.subject_id, target.level_id, target.series_id, target.chapter_id, target.lesson_id,
      'Exercice 1 — Comprendre et problématiser un sujet de dissertation',
      'Appliquez l’étude parcellaire, la reformulation et la problématisation à des sujets philosophiques.',
      'La correction explique le rôle de chaque opération préparatoire et la distinction entre thème, problème et axes.',
      'single_choice', 'easy',
      '## Consigne\n\nRépondez à partir de la méthode exposée dans le cours.',
      '## Correction\n\nUne dissertation commence par l’analyse des termes essentiels, puis reformule le sujet avant de faire apparaître son problème et ses aspects.',
      false, false, 14, 10
    where not exists (
      select 1 from public.exercises e
      where e.lesson_id = target.lesson_id
        and e.title = 'Exercice 1 — Comprendre et problématiser un sujet de dissertation'
    )
    returning id into exercise_one_id;

    if exercise_one_id is not null then
      insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order) values
        (exercise_one_id, 'single_choice', 'Quel est le but principal de l’étude parcellaire ?', jsonb_build_array('Définir les mots et expressions essentiels selon le contexte', 'Écrire directement la conclusion', 'Réciter des citations', 'Choisir une réponse sans analyse'), jsonb_build_array('Définir les mots et expressions essentiels selon le contexte'), 'L’étude parcellaire examine les termes qui commandent le sens du sujet.', 10),
        (exercise_one_id, 'single_choice', 'Que doit respecter une reformulation correcte ?', jsonb_build_array('Le sens initial du sujet', 'Les préférences personnelles de l’élève', 'Une réponse déjà décidée', 'Le plan d’un autre sujet'), jsonb_build_array('Le sens initial du sujet'), 'Reformuler rend le sujet plus explicite sans l’altérer.', 20),
        (exercise_one_id, 'single_choice', 'Qu’est-ce qu’un problème philosophique dans une dissertation ?', jsonb_build_array('La difficulté centrale ou la contradiction soulevée par le sujet', 'Un mot difficile isolé', 'Une citation sans auteur', 'La dernière phrase de la conclusion'), jsonb_build_array('La difficulté centrale ou la contradiction soulevée par le sujet'), 'Le problème organise l’analyse parce qu’il met en évidence la tension centrale du sujet.', 30),
        (exercise_one_id, 'single_choice', 'Quel rôle jouent les aspects du problème ?', jsonb_build_array('Ils annoncent les axes du développement', 'Ils remplacent les arguments', 'Ils servent seulement à décorer l’introduction', 'Ils suppriment la nécessité d’un plan'), jsonb_build_array('Ils annoncent les axes du développement'), 'Les aspects sont les questions particulières qui guident les axes de réflexion.', 40),
        (exercise_one_id, 'true_false', 'Dans le sujet « Doit-on condamner le progrès technique ? », définir « condamner » aide à comprendre qu’il s’agit d’un jugement.', jsonb_build_array('Vrai', 'Faux'), jsonb_build_array('Vrai'), 'Condamner signifie blâmer, rejeter ou désapprouver : le sujet interroge donc la légitimité d’un jugement.', 50);
    end if;
    exercise_one_id := null;

    insert into public.exercises (subject_id, level_id, series_id, chapter_id, lesson_id, title, statement, solution, exercise_type, difficulty, content_markdown, correction_markdown, is_published, is_active, estimated_duration_minutes, display_order)
    select target.subject_id, target.level_id, target.series_id, target.chapter_id, target.lesson_id,
      'Exercice 2 — Plan, argumentation et rédaction de la dissertation',
      'Identifiez les composantes de l’introduction, l’usage des références, les transitions et la fonction de la conclusion.',
      'La correction rappelle qu’une dissertation organise des axes argumentés et répond clairement au problème posé.',
      'single_choice', 'medium',
      '## Consigne\n\nChoisissez les réponses qui correspondent à une rédaction philosophique rigoureuse.',
      '## Correction\n\nL’introduction pose l’amorce, le problème et les aspects ; le développement explique les arguments et les références ; la conclusion apporte un bilan et une réponse.',
      false, false, 16, 20
    where not exists (
      select 1 from public.exercises e
      where e.lesson_id = target.lesson_id
        and e.title = 'Exercice 2 — Plan, argumentation et rédaction de la dissertation'
    )
    returning id into exercise_two_id;

    if exercise_two_id is not null then
      insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order) values
        (exercise_two_id, 'single_choice', 'Quelles sont les trois composantes essentielles de l’introduction selon le document ?', jsonb_build_array('Amorce, problème, aspects du problème', 'Définition, citation, ouverture', 'Plan, note, bibliographie', 'Opinion, anecdote, résumé'), jsonb_build_array('Amorce, problème, aspects du problème'), 'L’introduction conduit au sujet, expose sa difficulté centrale et annonce les questions de l’analyse.', 10),
        (exercise_two_id, 'single_choice', 'Quelle utilisation d’une référence est la plus rigoureuse ?', jsonb_build_array('L’expliquer et montrer son lien avec l’argument', 'La recopier sans commentaire', 'La placer à la fin sans rapport', 'La remplacer par une opinion'), jsonb_build_array('L’expliquer et montrer son lien avec l’argument'), 'La référence éclaire un argument ; elle ne le remplace pas.', 20),
        (exercise_two_id, 'single_choice', 'À quoi sert une transition ?', jsonb_build_array('À montrer le lien logique entre les idées ou les axes', 'À ajouter une citation au hasard', 'À répéter le sujet', 'À éviter de conclure'), jsonb_build_array('À montrer le lien logique entre les idées ou les axes'), 'La transition explique pourquoi l’analyse passe à une nouvelle étape.', 30),
        (exercise_two_id, 'single_choice', 'Quelle est la fonction principale de la conclusion ?', jsonb_build_array('Répondre clairement au problème après un bilan', 'Introduire un sujet entièrement nouveau', 'Ajouter tous les arguments oubliés', 'Reformuler seulement l’amorce'), jsonb_build_array('Répondre clairement au problème après un bilan'), 'La conclusion achève le raisonnement par une réponse précise au problème de départ.', 40),
        (exercise_two_id, 'true_false', 'Un plan de dissertation peut se réduire à une juxtaposition de citations sans explication.', jsonb_build_array('Vrai', 'Faux'), jsonb_build_array('Faux'), 'Un plan doit organiser des axes, des arguments expliqués, des références et des transitions.', 50);
    end if;
    exercise_two_id := null;

    insert into public.quizzes (subject_id, level_id, series_id, subject_offering_id, chapter_id, lesson_id, title, description, difficulty, duration_minutes, display_order, is_published, is_active)
    select target.subject_id, target.level_id, target.series_id, target.offering_id, target.chapter_id, target.lesson_id,
      'Quiz de révision — La dissertation philosophique',
      'Évaluez votre maîtrise de la compréhension du sujet, de la problématisation et de la rédaction argumentative.',
      'medium', 14, 10, false, false
    where not exists (
      select 1 from public.quizzes q
      where q.lesson_id = target.lesson_id
        and q.title = 'Quiz de révision — La dissertation philosophique'
    )
    returning id into quiz_id;

    if quiz_id is not null then
      with inserted_questions as (
        insert into public.quiz_questions (quiz_id, question, explanation, question_type, display_order, points, is_active) values
          (quiz_id, 'Quelle opération précède la reformulation du sujet ?', 'L’étude parcellaire commence par l’analyse des termes essentiels.', 'single_choice', 10, 1, true),
          (quiz_id, 'Quelle différence faut-il faire entre thème et problème ?', 'Le thème est le domaine général ; le problème est la difficulté intellectuelle précise à analyser.', 'single_choice', 20, 1, true),
          (quiz_id, 'Que doivent annoncer les aspects du problème ?', 'Ils annoncent les axes qui structureront le développement.', 'single_choice', 30, 1, true),
          (quiz_id, 'Quel élément permet de relier logiquement deux moments du développement ?', 'La transition rend le cheminement argumentatif explicite.', 'single_choice', 40, 1, true),
          (quiz_id, 'Comment une citation philosophique doit-elle être utilisée ?', 'Elle doit être expliquée et reliée à l’argument défendu.', 'single_choice', 50, 1, true),
          (quiz_id, 'Quelle réponse la conclusion doit-elle apporter ?', 'Elle doit répondre clairement au problème posé dans l’introduction.', 'single_choice', 60, 1, true),
          (quiz_id, 'Pourquoi le brouillon est-il nécessaire ?', 'Il permet d’organiser le sujet, le problème, le plan, les arguments et les références avant la rédaction.', 'single_choice', 70, 1, true)
        returning id, display_order
      )
      insert into public.quiz_answers (question_id, answer, is_correct, display_order)
      select q.id, a.answer, a.is_correct, a.display_order
      from inserted_questions q
      join lateral (
        select * from (values
          (10, 'L’étude parcellaire', true, 10), (10, 'La conclusion', false, 20), (10, 'La transition', false, 30),
          (20, 'Le thème est général ; le problème est la difficulté centrale', true, 10), (20, 'Ils désignent exactement la même chose', false, 20), (20, 'Le problème est toujours une citation', false, 30),
          (30, 'Les axes du développement', true, 10), (30, 'La bibliographie seulement', false, 20), (30, 'Les erreurs de copie', false, 30),
          (40, 'La transition', true, 10), (40, 'Une amorce sans rapport', false, 20), (40, 'Une simple répétition', false, 30),
          (50, 'Elle doit être expliquée et reliée à l’argument', true, 10), (50, 'Elle suffit sans raisonnement', false, 20), (50, 'Elle remplace le problème', false, 30),
          (60, 'Une réponse précise au problème', true, 10), (60, 'Un nouveau développement', false, 20), (60, 'Une liste de définitions', false, 30),
          (70, 'Il organise le raisonnement avant la rédaction', true, 10), (70, 'Il dispense de comprendre le sujet', false, 20), (70, 'Il remplace les transitions', false, 30)
        ) as answers(question_order, answer, is_correct, display_order)
      ) a on a.question_order = q.display_order;
    end if;
    quiz_id := null;
  end loop;

  if (select count(*) from public.lessons where id in (
    'e89a1557-6308-4d51-8565-4fb5b1a479e6', 'f6759b97-8322-44ac-8c1f-33655dffd422',
    'e56a0b7f-9337-4b03-bc2a-8a482e4090d3', 'd6f4155b-0744-4e1e-b60c-3d969ae18cd7'
  )) <> 4 then
    raise exception 'Les quatre leçons Terminale confirmées de dissertation ne sont pas toutes présentes.';
  end if;
end;
$dissertation$;
