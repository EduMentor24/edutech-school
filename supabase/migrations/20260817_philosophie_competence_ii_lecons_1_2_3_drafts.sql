-- Commande 17 — Philosophie Terminale A1/A2, Compétence II.
-- Le script est volontairement strict : il refuse tout écrasement de contenu existant
-- et n’insère aucune activité si la leçon cible n’est pas vide.

do $commande$
declare
  target record;
  exercise_foundations_id uuid;
  exercise_method_id uuid;
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
      case l.id
        when '7a0fcff7-b4fc-4cda-aced-0c217220bf97'::uuid then 'human'
        when '0f5b8c0b-ab87-41f1-92aa-fadcb5e350d2'::uuid then 'human'
        when '08cb1a4b-5483-4d68-9678-5477e0a820f3'::uuid then 'society'
        when '0e730715-0cd9-4540-bc23-aa23695e83b1'::uuid then 'society'
        when 'ff2dfefc-fd76-408c-b7eb-11ee8d725ab7'::uuid then 'religion'
        when '565da730-ed69-41bc-9283-47f57ee8a82a'::uuid then 'religion'
      end as lesson_key
    from public.lessons l
    join public.chapters c on c.id = l.chapter_id
    join public.course_subject_offerings o on o.id = c.subject_offering_id
    join public.subjects subject on subject.id = o.subject_id
    join public.levels level on level.id = o.level_id
    join public.series series on series.id = o.series_id
    where l.id in (
      '7a0fcff7-b4fc-4cda-aced-0c217220bf97',
      '0f5b8c0b-ab87-41f1-92aa-fadcb5e350d2',
      '08cb1a4b-5483-4d68-9678-5477e0a820f3',
      '0e730715-0cd9-4540-bc23-aa23695e83b1',
      'ff2dfefc-fd76-408c-b7eb-11ee8d725ab7',
      '565da730-ed69-41bc-9283-47f57ee8a82a'
    )
      and level.name = 'Terminale'
      and series.name in ('A1', 'A2')
      and subject.name = 'Philosophie'
      and c.title = 'COMPETENCE II : Traiter une situation relative aux conditions de l’homme dans la société'
    order by l.id
  loop
    if exists (
      select 1
      from public.lessons
      where id = target.lesson_id
        and coalesce(btrim(content), '') <> ''
    ) then
      raise exception 'La leçon cible % contient déjà du contenu : aucune écriture automatique n’est autorisée.', target.lesson_id;
    end if;

    if target.lesson_key = 'human' then
      lesson_description := 'Conscience, mémoire, liberté, inconscient, déterminisme psychologique et responsabilité humaine.';
      lesson_content := $human$
# Leçon 1 — La connaissance de l’homme

> **Compétence II — Thème : Les conditions de la liberté**  
> **Objectif :** comprendre les dimensions conscientes et inconscientes de l’être humain afin d’interroger sa liberté et sa responsabilité.

## Situation d’apprentissage

Connaître l’homme consiste à chercher ce qui le caractérise. On le présente habituellement comme un être conscient, capable de penser, de se souvenir et de choisir. Pourtant, des rêves, des oublis, des phobies ou des motivations cachées paraissent parfois échapper à son contrôle. La question est donc la suivante : **la connaissance de l’homme se réduit-elle à la conscience, et l’homme est-il toujours responsable de ses actes ?**

## 1. Les caractéristiques essentielles de l’homme

### A. La conscience et la mémoire

L’homme possède une dimension biologique, mais il se distingue aussi par la **conscience**. Celle-ci lui permet de se connaître, de connaître le monde et de porter un jugement sur ses actes.

| Dimension | Sens dans la leçon | Référence mobilisée dans le document |
|---|---|---|
| Conscience psychologique | Connaissance de soi et du monde extérieur. | Descartes : l’expérience du *Cogito* établit la certitude de la pensée. |
| Conscience morale | Faculté de juger le bien et le mal dans ses propres actes. | Rousseau : la conscience est présentée comme juge du bien et du mal. |
| Mémoire | Conservation puis restitution des idées et expériences acquises. | Bergson : la conscience implique la mémoire. |

La conscience ne reçoit donc pas seulement des informations : elle sélectionne, parmi les souvenirs, ce qui est utile à l’action. Dans cette perspective, la mémoire participe à l’orientation des choix.

### B. La liberté

La **liberté** désigne ici la capacité de s’autodéterminer, c’est-à-dire d’agir selon sa volonté sans subir une contrainte extérieure. Pour un être conscient, agir librement suppose d’assumer ses actes et de ne pas se laisser guider aveuglément par une influence. Bergson associe ainsi le témoignage de la conscience à l’expérience de la liberté.

> **Repère.** Être libre ne signifie pas faire n’importe quoi ; il s’agit de pouvoir choisir et répondre lucidement de son choix.

## 2. L’inconscient : une autre dimension de l’homme

La conscience ne suffit pas à expliquer toute la vie psychique. Certains faits — oublis, rêves, phobies, motivations cachées ou perceptions peu remarquées — indiquent des limites de ce qui est immédiatement connu.

### A. La découverte de l’inconscient

Pour Freud, l’**inconscient** est l’ensemble des désirs refoulés qui échappent à la conscience. Il désigne une instance psychique dynamique où se trouvent notamment des pulsions et des désirs non reconnus par le sujet. La thèse freudienne invite donc à ne pas surestimer la part consciente de l’être humain.

### B. La violence comme manifestation possible

Dans l’analyse freudienne présentée par le document, l’agressivité peut révéler une part inconsciente de l’homme. La violence est alors comprise comme un comportement qui peut surgir dans les relations humaines et qui oblige à examiner les forces psychiques à l’œuvre au-delà de la seule volonté déclarée.

## 3. Déterminisme psychologique et responsabilité

### A. Le problème du déterminisme

Le **déterminisme psychologique** affirme que certains actes ou faits psychiques sont produits par des forces indépendantes du choix conscient. Si l’inconscient détermine entièrement l’action, la liberté et la responsabilité risquent de sembler illusoires. Paul Valéry résume cette difficulté en distinguant une conscience qui paraît régner sans pour autant gouverner tous les actes.

### B. La responsabilité demeure en débat

Le document présente aussi des critiques de cette explication. Alain met en garde contre une représentation excessive de l’inconscient. Sartre soutient, quant à lui, que l’homme demeure libre et responsable : invoquer l’inconscient pour justifier une conduite peut devenir une forme de mauvaise foi.

| Problème | Thèse déterministe | Thèse responsabiliste |
|---|---|---|
| L’homme répond-il de tous ses actes ? | Des forces psychiques inconscientes peuvent influencer l’action. | Le sujet reste appelé à assumer ses actes et ses choix. |
| Quelle place pour la conscience ? | Elle ne recouvre pas toute la vie psychique. | Elle permet au sujet de juger et de se reprendre. |

## Méthode pour une production argumentée

Face au sujet **« L’inconscient abolit-il la responsabilité humaine ? »**, il convient de définir les notions centrales, puis de distinguer deux axes. Le premier expose l’influence possible de l’inconscient sur les actes ; le second examine pourquoi la responsabilité humaine peut néanmoins demeurer. Une conclusion doit prendre position à partir de cette confrontation raisonnée.

## À retenir

- La conscience a une dimension psychologique et une dimension morale.
- La mémoire conserve des expériences et participe à l’action consciente.
- L’inconscient désigne, dans la perspective freudienne, des désirs et pulsions qui échappent à la conscience.
- Le déterminisme psychologique soulève la question de la liberté et de la responsabilité.
- Le débat oppose l’influence de l’inconscient à l’exigence d’assumer ses actes.

## Référence pédagogique

Contenu rédigé à partir du PDF fourni : **« Leçon 1 : La connaissance de l’homme »**, Philosophie, Terminale toutes séries, Côte d’Ivoire – École numérique. Les notions, la progression et les auteurs mobilisés suivent ce document source.
$human$;
    elsif target.lesson_key = 'society' then
      lesson_description := 'Société, autrui, État, nation, droit, justice et violence dans l’espace social.';
      lesson_content := $society$
# Leçon 2 — La vie en société

> **Compétence II — Thème : Les conditions de la liberté**  
> **Objectif :** analyser la vie sociale, les formes d’organisation politique et les tensions entre liberté, droit et violence.

## Situation d’apprentissage

L’homme vit parmi ses semblables. Cette vie commune peut favoriser son épanouissement, mais elle l’expose aussi aux conflits et à la violence. Il s’agit donc de comprendre si la société garantit réellement la liberté et par quels moyens elle organise les relations entre les individus.

## 1. L’homme, un être social

### A. Deux explications de l’origine de la société

La société est une communauté d’individus unis par des relations organisées et des échanges de services. Le document présente deux façons d’en expliquer l’origine.

| Thèse | Idée essentielle | Auteur repère |
|---|---|---|
| Naturaliste | La société relève de la nature humaine : l’homme est disposé à vivre dans la cité. | Aristote |
| Contractualiste | La société est le résultat d’un accord établi entre les hommes. | Hobbes, Locke, Rousseau |

Ces analyses ne se confondent pas, mais elles soulignent toutes deux que l’existence humaine se déploie dans un rapport aux autres.

### B. Autrui, une relation nécessaire

**Autrui** est mon semblable, mon prochain. Selon les analyses de Hegel et de Sartre reprises dans le document, la présence d’autrui contribue à la connaissance de soi : je découvre aussi ce que je suis dans la relation avec l’autre. La vie sociale est donc le lieu de l’intersubjectivité, c’est-à-dire de relations entre des consciences qui se reconnaissent, se confrontent et s’influencent.

> **Repère.** L’autre peut être source d’épanouissement et de reconnaissance, tout en devenant parfois source de gêne, de conflit ou d’aliénation.

## 2. L’État et la nation : organiser la vie commune

### A. La nécessité de l’État

L’**État** est une organisation politique, administrative et juridique qui exerce son autorité sur un territoire déterminé. Il élabore les lois, rend possible le droit positif et cherche à assurer la sécurité ainsi que la liberté des citoyens.

Dans le document, Spinoza présente la liberté comme la fin de l’État. Le droit et la justice sont alors essentiels : le droit fixe des règles communes, tandis que la justice veille à leur application et à la réparation des torts.

### B. Comprendre la nation

La **nation** ne se confond pas avec l’État. L’État renvoie à une organisation politique ; la nation désigne une unité historique et humaine qui peut reposer sur des liens géographiques, linguistiques, politiques, religieux ou sur une conscience commune.

Pour Renan, la nation associe un héritage de souvenirs partagés et une volonté actuelle de vivre ensemble. Elle se construit donc dans le temps et par une conscience collective.

| Notion | Ce qui la caractérise |
|---|---|
| État | Organisation politique et juridique, territoire, autorités, lois. |
| Nation | Communauté historique et humaine fondée aussi sur une volonté de vivre ensemble. |
| Droit | Ensemble de règles qui organisent la vie sociale. |
| Justice | Institution et exigence d’équité chargée de faire respecter le droit. |

## 3. La violence dans l’espace social

### A. Les relations conflictuelles

La violence est l’usage abusif de la force pour asservir, faire souffrir, aliéner ou détruire. Le document présente chez Hegel une relation conflictuelle qui peut conduire à la reconnaissance, et chez Sartre l’expérience du regard d’autrui qui peut faire éprouver la honte ou l’objectivation.

### B. La violence de l’État : un problème politique

Face aux conflits, l’État peut recourir à la contrainte. Machiavel interroge l’efficacité politique dans un monde où les rapports humains sont marqués par la violence. Weber attribue à l’État le monopole de la violence légitime et légale, exercée notamment à travers les pouvoirs législatif, exécutif et judiciaire.

Le document évoque aussi, avec Althusser, les appareils idéologiques et répressifs de l’État. Cette analyse permet de poser une question critique : la force publique protège-t-elle toujours la liberté, ou peut-elle aussi devenir une source d’aliénation ?

## Méthode pour une production argumentée

Pour traiter **« Autrui est-il absolument mon ennemi ? »**, il faut d’abord définir autrui, l’idée d’absolu et celle d’ennemi. Un premier axe peut étudier les conflits, l’angoisse et l’aliénation liés au regard d’autrui. Un second axe montre que la relation aux autres est nécessaire à l’humanisation, à la vie sociale et à l’enrichissement mutuel.

## À retenir

- La société organise des relations durables entre les individus.
- La sociabilité peut être pensée comme naturelle ou comme contractuelle.
- L’État garantit le droit, la justice et la sécurité, mais son pouvoir doit être interrogé.
- La nation se distingue de l’État et suppose aussi une conscience de vivre ensemble.
- La violence sociale rend nécessaire une réflexion sur le droit, la liberté et les institutions.

## Référence pédagogique

Contenu rédigé à partir du PDF fourni : **« Leçon 2 : La vie en société »**, Philosophie, Terminale toutes séries, Côte d’Ivoire – École numérique. Les notions, la progression et les auteurs mobilisés suivent ce document source.
$society$;
    elsif target.lesson_key = 'religion' then
      lesson_description := 'Dieu, religion, fonctions sociales de la religion et rapport entre obligation morale et liberté.';
      lesson_content := $religion$
# Leçon 3 — Dieu et la religion

> **Compétence II — Thème : Les conditions de la liberté**  
> **Objectif :** examiner l’idée de Dieu, les fonctions de la religion dans la société et les débats sur son rapport à la liberté humaine.

## Situation d’apprentissage

La pratique religieuse est une réalité importante de la vie humaine et sociale. Elle rassemble des croyances, des rites, des obligations morales et des manières de penser le rapport à Dieu. Le document invite à interroger son sens : **la religion contribue-t-elle à la liberté et à l’épanouissement de l’homme, ou peut-elle aussi l’aliéner ?**

## 1. Dieu comme fondement de la religion

### A. Dieu, être sacré

Selon la définition rapportée d’André Lalande, la religion est une institution sociale fondée sur la croyance en une valeur absolue : Dieu. Elle comprend des croyances et des pratiques portant sur le sacré. Dans la présentation du document, Dieu est pensé comme un être transcendant, objet de respect et de vénération, auquel sont attribuées des qualités telles que l’omnipotence, l’omniscience et l’omniprésence.

Durkheim met l’accent sur la dimension collective : la religion relie une communauté par des croyances et des pratiques relatives aux choses sacrées.

### B. Interroger l’existence de Dieu

Il faut distinguer le **concept de Dieu** de son **existence**. Kant soutient que penser Dieu comme un être parfait ne suffit pas à prouver son existence : l’existence ne se déduit pas simplement de l’idée que l’on se fait d’une chose. Cette critique ouvre un débat philosophique sur les preuves de l’existence de Dieu et sur les positions athées.

| Notion | Sens retenu dans la leçon |
|---|---|
| Religion | Croyances et pratiques organisées autour du sacré et de Dieu. |
| Dieu | Être sacré et transcendant dans la présentation religieuse. |
| Athéisme | Position qui nie l’existence de Dieu. |
| Preuve de l’existence de Dieu | Argument visant à établir rationnellement cette existence. |

## 2. Les rôles de la religion dans la société

### A. Cohésion sociale et apaisement

Le mot *religio* renvoie, dans le document, au lien avec Dieu et au lien entre les hommes. La religion peut donc rassembler une communauté autour d’un idéal commun. Proudhon est présenté comme soulignant son rôle dans l’unité des sociétés ; Bergson décrit des fonctions de protection contre la désorganisation, l’angoisse et l’incertitude de l’existence.

La religion peut aussi répondre aux grandes interrogations humaines et procurer une forme de réconfort. Hegel la présente comme une voie de libération ; Freud relève qu’elle cherche à répondre à des craintes et à l’incertitude de la vie.

### B. Une dimension morale

La religion transmet des règles de conduite, des valeurs et des devoirs. Elle peut encourager l’amour du prochain, le partage et la solidarité. Pour Kant, la religion peut faire apparaître les devoirs comme des commandements divins : la bonne conduite est alors liée à une exigence morale.

## 3. Religion, aliénation et liberté

### A. Le risque d’aliénation

Les rites, les préceptes et les sacrifices demandés aux fidèles peuvent être vécus comme des contraintes. Marx analyse ainsi la religion comme une création humaine qui peut finir par dominer les hommes et les détourner de leurs responsabilités. Cette critique conduit à examiner les risques de mystification, de renoncement et de fanatisme.

### B. L’obligation morale n’exclut pas nécessairement la liberté

La leçon souligne cependant que les obligations morales ne sont pas automatiquement contraires à la liberté. Un sujet conscient peut choisir de croire ou de ne pas croire, de faire le bien ou le mal. Chez Kant, l’impératif catégorique se présente comme un commandement moral valable sans condition ; l’obligation suppose ainsi un sujet capable de décider.

| Question | Réponse critique possible |
|---|---|
| La religion aliène-t-elle l’homme ? | Elle peut être vécue comme une contrainte lorsqu’elle éteint l’esprit critique ou impose une obéissance aveugle. |
| La religion peut-elle libérer ? | Elle peut soutenir la cohésion sociale, l’apaisement, les devoirs moraux et une conduite responsable. |
| Liberté et devoir sont-ils incompatibles ? | Non : le devoir moral présuppose un sujet capable de choisir et d’assumer son acte. |

## Méthode pour une production argumentée

Pour traiter **« Doit-on redouter la croyance religieuse ? »**, il est nécessaire de définir la croyance religieuse et le verbe redouter. Un premier axe peut examiner l’aliénation, le fanatisme et les limites de certaines pratiques. Un second axe analyse les fonctions de consolation, de moralisation et de cohésion sociale attribuées à la religion dans le document.

## À retenir

- La religion repose sur des croyances et des pratiques relatives au sacré.
- L’idée de Dieu ne constitue pas, à elle seule, une preuve de son existence selon Kant.
- La religion peut exercer des fonctions de cohésion sociale, de réconfort et de moralisation.
- Elle peut aussi être critiquée lorsqu’elle devient une source d’aliénation ou de fanatisme.
- Le rapport entre religion, devoir et liberté doit être pensé de manière nuancée.

## Référence pédagogique

Contenu rédigé à partir du PDF fourni : **« Leçon 3 : Dieu et la religion »**, Philosophie, Terminale, Côte d’Ivoire – École numérique. Les notions, la progression et les auteurs mobilisés suivent ce document source.
$religion$;
    else
      raise exception 'Leçon cible non reconnue : %', target.lesson_id;
    end if;

    update public.lessons
    set
      description = lesson_description,
      content = lesson_content,
      is_active = false
    where id = target.lesson_id
      and coalesce(btrim(content), '') = '';

    if target.lesson_key = 'human' then
      insert into public.exercises (
        subject_id, level_id, series_id, chapter_id, lesson_id,
        title, statement, solution, exercise_type, difficulty,
        content_markdown, correction_markdown,
        is_published, is_active, estimated_duration_minutes, display_order
      )
      select target.subject_id, target.level_id, target.series_id, target.chapter_id, target.lesson_id,
        'Exercice 1 — Conscience, mémoire et inconscient',
        'Vérifiez les notions essentielles de la connaissance de l’homme.',
        'La correction relie conscience, mémoire, liberté et inconscient aux définitions étudiées.',
        'single_choice', 'easy',
        '## Consigne\n\nRépondez à chaque question en vous appuyant sur les définitions et les auteurs de la leçon.',
        '## Correction\n\nLa conscience permet de se connaître et de juger ses actes ; la mémoire conserve les expériences ; l’inconscient désigne des faits psychiques qui échappent à la conscience.',
        false, false, 10, 10
      where not exists (select 1 from public.exercises e where e.lesson_id = target.lesson_id and e.title = 'Exercice 1 — Conscience, mémoire et inconscient')
      returning id into exercise_foundations_id;

      if exercise_foundations_id is not null then
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order)
        values
          (exercise_foundations_id, 'single_choice', 'Quelle définition correspond à la conscience psychologique ?', jsonb_build_array('La connaissance de soi et du monde extérieur', 'La suppression de tous les souvenirs', 'Le refus de juger ses actes', 'Une force extérieure qui détermine l’homme'), jsonb_build_array('La connaissance de soi et du monde extérieur'), 'La conscience psychologique permet au sujet de se connaître et de connaître le monde.', 10),
          (exercise_foundations_id, 'single_choice', 'Que désigne la conscience morale dans la leçon ?', jsonb_build_array('La capacité de juger le bien et le mal de ses actes', 'Le simple fait de dormir', 'La négation de toute liberté', 'Le refus de la mémoire'), jsonb_build_array('La capacité de juger le bien et le mal de ses actes'), 'La conscience morale permet à l’homme de porter un jugement sur ses actes.', 20),
          (exercise_foundations_id, 'single_choice', 'Quel rôle la mémoire joue-t-elle ?', jsonb_build_array('Elle conserve et restitue des idées et expériences acquises', 'Elle détruit les souvenirs utiles', 'Elle remplace la conscience morale', 'Elle interdit toute décision'), jsonb_build_array('Elle conserve et restitue des idées et expériences acquises'), 'La mémoire est définie comme une faculté de conservation et de restitution.', 30),
          (exercise_foundations_id, 'single_choice', 'Selon la perspective freudienne présentée, l’inconscient est notamment…', jsonb_build_array('L’ensemble de désirs refoulés qui échappent à la conscience', 'Une preuve que l’homme ne pense jamais', 'La même chose que la mémoire', 'Une institution politique'), jsonb_build_array('L’ensemble de désirs refoulés qui échappent à la conscience'), 'La leçon présente l’inconscient comme une instance psychique liée à des désirs et pulsions refoulés.', 40),
          (exercise_foundations_id, 'true_false', 'Le déterminisme psychologique pose la question de savoir si certains actes échappent au choix conscient.', jsonb_build_array('Vrai', 'Faux'), jsonb_build_array('Vrai'), 'Le déterminisme psychologique interroge l’influence de forces qui ne relèvent pas du choix conscient.', 50);
      end if;

      exercise_foundations_id := null;
      insert into public.exercises (
        subject_id, level_id, series_id, chapter_id, lesson_id,
        title, statement, solution, exercise_type, difficulty,
        content_markdown, correction_markdown,
        is_published, is_active, estimated_duration_minutes, display_order
      )
      select target.subject_id, target.level_id, target.series_id, target.chapter_id, target.lesson_id,
        'Exercice 2 — Liberté et responsabilité humaine',
        'Distinguez l’influence de l’inconscient de l’exigence de responsabilité.',
        'La correction confronte la thèse du déterminisme à la position responsabiliste.',
        'single_choice', 'medium',
        '## Consigne\n\nIdentifiez les idées qui permettent d’organiser une réponse au problème de la responsabilité humaine.',
        '## Correction\n\nUne réponse argumentée doit examiner l’influence de l’inconscient, puis la possibilité pour le sujet de répondre de ses actes.',
        false, false, 12, 20
      where not exists (select 1 from public.exercises e where e.lesson_id = target.lesson_id and e.title = 'Exercice 2 — Liberté et responsabilité humaine')
      returning id into exercise_method_id;

      if exercise_method_id is not null then
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order)
        values
          (exercise_method_id, 'single_choice', 'Quelle idée exprime le mieux le déterminisme psychologique ?', jsonb_build_array('Certains actes peuvent dépendre de forces indépendantes du choix conscient', 'Tous les actes sont toujours purement volontaires', 'La mémoire n’existe pas', 'La société explique seule les rêves'), jsonb_build_array('Certains actes peuvent dépendre de forces indépendantes du choix conscient'), 'Le déterminisme psychologique met en avant des forces psychiques qui peuvent influencer les actes.', 10),
          (exercise_method_id, 'single_choice', 'Quelle difficulté l’inconscient soulève-t-il ?', jsonb_build_array('Il peut faire paraître la liberté et la responsabilité incertaines', 'Il prouve que l’homme est un animal politique', 'Il supprime toute mémoire', 'Il explique l’organisation de l’État'), jsonb_build_array('Il peut faire paraître la liberté et la responsabilité incertaines'), 'La question centrale porte sur la responsabilité lorsque les actes sont influencés par l’inconscient.', 20),
          (exercise_method_id, 'single_choice', 'Quelle position est associée à Sartre dans le document ?', jsonb_build_array('L’homme demeure libre et ne doit pas se servir de l’inconscient comme d’un alibi', 'La conscience est inutile', 'Toute violence est légitime', 'La liberté est une illusion totale'), jsonb_build_array('L’homme demeure libre et ne doit pas se servir de l’inconscient comme d’un alibi'), 'Sartre critique l’usage de l’inconscient comme justification systématique des conduites.', 30),
          (exercise_method_id, 'true_false', 'Alain est présenté comme acceptant sans réserve une représentation excessive de l’inconscient.', jsonb_build_array('Vrai', 'Faux'), jsonb_build_array('Faux'), 'Le document présente Alain comme critique à l’égard d’une représentation excessive de l’inconscient.', 40),
          (exercise_method_id, 'single_choice', 'Pour conclure une production sur la responsabilité, quelle démarche est la plus rigoureuse ?', jsonb_build_array('Confronter l’influence de l’inconscient et l’exigence d’assumer ses actes', 'Choisir une citation sans l’expliquer', 'Éviter de définir les notions', 'Répondre seulement par oui ou non'), jsonb_build_array('Confronter l’influence de l’inconscient et l’exigence d’assumer ses actes'), 'La conclusion doit résulter d’une confrontation argumentée des deux perspectives.', 50);
      end if;

      exercise_method_id := null;
      insert into public.quizzes (subject_id, level_id, series_id, subject_offering_id, chapter_id, lesson_id, title, description, difficulty, duration_minutes, display_order, is_published, is_active)
      select target.subject_id, target.level_id, target.series_id, target.offering_id, target.chapter_id, target.lesson_id,
        'Quiz de révision — La connaissance de l’homme',
        'Vérifiez votre compréhension de la conscience, de l’inconscient, de la liberté et de la responsabilité.',
        'medium', 12, 10, false, false
      where not exists (select 1 from public.quizzes q where q.lesson_id = target.lesson_id and q.title = 'Quiz de révision — La connaissance de l’homme')
      returning id into quiz_id;

      if quiz_id is not null then
        with inserted_questions as (
          insert into public.quiz_questions (quiz_id, question, explanation, question_type, display_order, points, is_active)
          values
            (quiz_id, 'Que permet principalement la conscience psychologique ?', 'Elle permet au sujet de se connaître et de connaître le monde extérieur.', 'single_choice', 10, 1, true),
            (quiz_id, 'À quelle faculté Bergson associe-t-il la conscience dans cette leçon ?', 'La leçon relie la conscience à la mémoire.', 'single_choice', 20, 1, true),
            (quiz_id, 'Comment la liberté est-elle définie ?', 'Elle est comprise comme la capacité de s’autodéterminer sans contrainte extérieure.', 'single_choice', 30, 1, true),
            (quiz_id, 'Quel fait peut signaler les limites de la conscience ?', 'Les rêves, les oublis ou les phobies sont cités comme manifestations à interroger.', 'single_choice', 40, 1, true),
            (quiz_id, 'Que désigne l’inconscient chez Freud dans la présentation du document ?', 'Il désigne des désirs refoulés qui échappent à la conscience.', 'single_choice', 50, 1, true),
            (quiz_id, 'Quel problème soulève le déterminisme psychologique ?', 'Il questionne la liberté et la responsabilité humaines.', 'single_choice', 60, 1, true),
            (quiz_id, 'Quelle idée soutient la position responsabiliste ?', 'Le sujet doit pouvoir assumer ses actes malgré le débat sur l’inconscient.', 'single_choice', 70, 1, true)
          returning id, display_order
        )
        insert into public.quiz_answers (question_id, answer, is_correct, display_order)
        select q.id, a.answer, a.is_correct, a.display_order
        from inserted_questions q
        join lateral (
          select * from (values
            (10, 'Se connaître et connaître le monde extérieur', true, 10), (10, 'Diriger les institutions de l’État', false, 20), (10, 'Supprimer la mémoire', false, 30),
            (20, 'La mémoire', true, 10), (20, 'La violence politique', false, 20), (20, 'La nation', false, 30),
            (30, 'La capacité de s’autodéterminer', true, 10), (30, 'Le refus de tout devoir', false, 20), (30, 'L’absence de choix', false, 30),
            (40, 'Les rêves et les oublis', true, 10), (40, 'La connaissance scientifique seule', false, 20), (40, 'Le droit positif', false, 30),
            (50, 'Des désirs refoulés échappant à la conscience', true, 10), (50, 'La totalité des actes volontaires', false, 20), (50, 'Une loi de l’État', false, 30),
            (60, 'La liberté et la responsabilité humaines', true, 10), (60, 'La définition de la nation', false, 20), (60, 'La formation des lois', false, 30),
            (70, 'Assumer ses actes et ses choix', true, 10), (70, 'Ne jamais juger ses actes', false, 20), (70, 'Réduire l’homme à la mémoire', false, 30)
          ) as answers(question_order, answer, is_correct, display_order)
        ) a on a.question_order = q.display_order;
      end if;

    elsif target.lesson_key = 'society' then
      insert into public.exercises (
        subject_id, level_id, series_id, chapter_id, lesson_id,
        title, statement, solution, exercise_type, difficulty,
        content_markdown, correction_markdown,
        is_published, is_active, estimated_duration_minutes, display_order
      )
      select target.subject_id, target.level_id, target.series_id, target.chapter_id, target.lesson_id,
        'Exercice 1 — Société, autrui, État et nation',
        'Vérifiez les notions qui organisent la vie en société.',
        'La correction distingue société, État, nation, droit et justice.',
        'single_choice', 'easy',
        '## Consigne\n\nRépondez aux questions en utilisant les définitions de la leçon.',
        '## Correction\n\nLa société est un ensemble de relations organisées ; l’État organise politiquement et juridiquement la vie commune ; la nation suppose aussi une conscience de vivre ensemble.',
        false, false, 10, 10
      where not exists (select 1 from public.exercises e where e.lesson_id = target.lesson_id and e.title = 'Exercice 1 — Société, autrui, État et nation')
      returning id into exercise_foundations_id;

      if exercise_foundations_id is not null then
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order)
        values
          (exercise_foundations_id, 'single_choice', 'Comment la société est-elle définie dans la leçon ?', jsonb_build_array('Une communauté d’individus ayant des rapports organisés', 'Un simple rassemblement d’animaux', 'Une croyance religieuse privée', 'Une absence de relations'), jsonb_build_array('Une communauté d’individus ayant des rapports organisés'), 'La société regroupe des individus reliés par des relations et des échanges organisés.', 10),
          (exercise_foundations_id, 'single_choice', 'Quelle thèse considère l’homme comme naturellement social ?', jsonb_build_array('La thèse naturaliste', 'La thèse athée', 'La thèse de l’inconscient', 'La thèse empiriste'), jsonb_build_array('La thèse naturaliste'), 'La thèse naturaliste, associée ici à Aristote, considère la sociabilité comme naturelle.', 20),
          (exercise_foundations_id, 'single_choice', 'Quel est l’un des rôles de l’État ?', jsonb_build_array('Élaborer les lois et garantir le droit', 'Supprimer toute relation sociale', 'Remplacer la mémoire individuelle', 'Prouver l’existence de Dieu'), jsonb_build_array('Élaborer les lois et garantir le droit'), 'L’État est présenté comme une organisation politique et juridique qui édicte les lois.', 30),
          (exercise_foundations_id, 'single_choice', 'Quelle idée caractérise la nation chez Renan ?', jsonb_build_array('Une volonté actuelle de vivre ensemble liée à un héritage partagé', 'Une simple frontière administrative', 'Une règle de grammaire', 'Une absence d’histoire'), jsonb_build_array('Une volonté actuelle de vivre ensemble liée à un héritage partagé'), 'La nation associe des souvenirs communs et une volonté de poursuivre une vie commune.', 40),
          (exercise_foundations_id, 'true_false', 'La justice est présentée comme indépendante du droit et des lois.', jsonb_build_array('Vrai', 'Faux'), jsonb_build_array('Faux'), 'Dans la leçon, la justice applique le droit et contribue au respect de la loi.', 50);
      end if;

      exercise_foundations_id := null;
      insert into public.exercises (
        subject_id, level_id, series_id, chapter_id, lesson_id,
        title, statement, solution, exercise_type, difficulty,
        content_markdown, correction_markdown,
        is_published, is_active, estimated_duration_minutes, display_order
      )
      select target.subject_id, target.level_id, target.series_id, target.chapter_id, target.lesson_id,
        'Exercice 2 — Liberté, droit et violence sociale',
        'Analysez le rôle du droit et les enjeux de la violence dans la vie sociale.',
        'La correction met en relation conflit, force publique, droit et liberté.',
        'single_choice', 'medium',
        '## Consigne\n\nDistinguez les formes de conflit social des moyens juridiques et politiques qui cherchent à organiser la vie commune.',
        '## Correction\n\nLe droit et la justice organisent la coexistence des libertés ; la violence doit être interrogée à partir de son usage, de sa légitimité et de ses effets.',
        false, false, 12, 20
      where not exists (select 1 from public.exercises e where e.lesson_id = target.lesson_id and e.title = 'Exercice 2 — Liberté, droit et violence sociale')
      returning id into exercise_method_id;

      if exercise_method_id is not null then
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order)
        values
          (exercise_method_id, 'single_choice', 'Comment la violence est-elle définie ?', jsonb_build_array('Un usage abusif de la force pour asservir ou faire souffrir', 'Toute discussion entre amis', 'La seule application du droit', 'Un souvenir ancien'), jsonb_build_array('Un usage abusif de la force pour asservir ou faire souffrir'), 'La leçon définit la violence comme un usage abusif de la force contre un individu ou un groupe.', 10),
          (exercise_method_id, 'single_choice', 'Quel problème le regard d’autrui peut-il faire apparaître chez Sartre ?', jsonb_build_array('Le sentiment d’être objectivé ou aliéné', 'La preuve d’une nation unique', 'L’impossibilité de parler', 'La disparition de l’État'), jsonb_build_array('Le sentiment d’être objectivé ou aliéné'), 'La leçon rapporte que le regard d’autrui peut être vécu comme une objectivation.', 20),
          (exercise_method_id, 'single_choice', 'Que désigne le monopole de la violence légitime chez Weber ?', jsonb_build_array('La compétence de l’État à exercer légalement la contrainte publique', 'Le droit de chacun à agresser autrui', 'La disparition des lois', 'La fin de toute justice'), jsonb_build_array('La compétence de l’État à exercer légalement la contrainte publique'), 'Weber est cité pour caractériser une violence publique, légale et légitime attribuée à l’État.', 30),
          (exercise_method_id, 'true_false', 'Une société sans lois est présentée comme ne posant aucune difficulté pour la liberté commune.', jsonb_build_array('Vrai', 'Faux'), jsonb_build_array('Faux'), 'Le document invite à discuter la nécessité des lois pour éviter le désordre et organiser les libertés.', 40),
          (exercise_method_id, 'single_choice', 'Quelle démarche convient à un sujet sur autrui ?', jsonb_build_array('Examiner les conflits puis la nécessité d’autrui pour l’humanisation', 'Réduire autrui à un ennemi sans argument', 'Éviter les notions de société et de liberté', 'Définir uniquement l’État'), jsonb_build_array('Examiner les conflits puis la nécessité d’autrui pour l’humanisation'), 'Le document propose d’opposer les tensions de la relation à autrui à son rôle dans l’humanisation.', 50);
      end if;

      exercise_method_id := null;
      insert into public.quizzes (subject_id, level_id, series_id, subject_offering_id, chapter_id, lesson_id, title, description, difficulty, duration_minutes, display_order, is_published, is_active)
      select target.subject_id, target.level_id, target.series_id, target.offering_id, target.chapter_id, target.lesson_id,
        'Quiz de révision — La vie en société',
        'Vérifiez votre compréhension de la société, d’autrui, de l’État, de la nation et de la violence.',
        'medium', 12, 10, false, false
      where not exists (select 1 from public.quizzes q where q.lesson_id = target.lesson_id and q.title = 'Quiz de révision — La vie en société')
      returning id into quiz_id;

      if quiz_id is not null then
        with inserted_questions as (
          insert into public.quiz_questions (quiz_id, question, explanation, question_type, display_order, points, is_active)
          values
            (quiz_id, 'Quelle thèse explique la société par un accord entre les hommes ?', 'La thèse contractualiste explique la société par un contrat social.', 'single_choice', 10, 1, true),
            (quiz_id, 'Quel rôle autrui joue-t-il dans la connaissance de soi ?', 'La relation à autrui participe à la découverte de soi.', 'single_choice', 20, 1, true),
            (quiz_id, 'Quelle fonction est attribuée à l’État ?', 'Il organise juridiquement et politiquement la vie commune.', 'single_choice', 30, 1, true),
            (quiz_id, 'Quelle différence faut-il retenir entre État et nation ?', 'L’État est une organisation politique ; la nation comporte aussi une unité historique et une volonté commune.', 'single_choice', 40, 1, true),
            (quiz_id, 'Quel rapport existe entre droit et justice ?', 'La justice applique le droit et cherche à réparer les torts.', 'single_choice', 50, 1, true),
            (quiz_id, 'Que peut provoquer la présence d’autrui dans certaines analyses ?', 'Une expérience de conflit ou d’objectivation.', 'single_choice', 60, 1, true),
            (quiz_id, 'Quelle question permet d’évaluer la force publique ?', 'Il faut examiner si elle protège la liberté ou devient source d’aliénation.', 'single_choice', 70, 1, true)
          returning id, display_order
        )
        insert into public.quiz_answers (question_id, answer, is_correct, display_order)
        select q.id, a.answer, a.is_correct, a.display_order
        from inserted_questions q
        join lateral (
          select * from (values
            (10, 'La thèse contractualiste', true, 10), (10, 'La thèse de l’inconscient', false, 20), (10, 'La thèse religieuse', false, 30),
            (20, 'Elle contribue à la connaissance de soi', true, 10), (20, 'Elle supprime toute liberté', false, 20), (20, 'Elle remplace le droit', false, 30),
            (30, 'Organiser la vie commune par les lois et le droit', true, 10), (30, 'Abolir les relations sociales', false, 20), (30, 'Détruire les souvenirs', false, 30),
            (40, 'État : organisation politique ; nation : unité aussi historique et volontaire', true, 10), (40, 'Ils sont toujours identiques', false, 20), (40, 'La nation est une loi', false, 30),
            (50, 'La justice met en œuvre le droit et répare les torts', true, 10), (50, 'Ils sont sans rapport', false, 20), (50, 'Le droit supprime la justice', false, 30),
            (60, 'Une expérience de conflit ou d’objectivation', true, 10), (60, 'La disparition de toute conscience', false, 20), (60, 'La preuve de l’athéisme', false, 30),
            (70, 'Protège-t-elle la liberté ou devient-elle aliénante ?', true, 10), (70, 'Faut-il supprimer toute loi ?', false, 20), (70, 'La mémoire est-elle politique ?', false, 30)
          ) as answers(question_order, answer, is_correct, display_order)
        ) a on a.question_order = q.display_order;
      end if;

    elsif target.lesson_key = 'religion' then
      insert into public.exercises (
        subject_id, level_id, series_id, chapter_id, lesson_id,
        title, statement, solution, exercise_type, difficulty,
        content_markdown, correction_markdown,
        is_published, is_active, estimated_duration_minutes, display_order
      )
      select target.subject_id, target.level_id, target.series_id, target.chapter_id, target.lesson_id,
        'Exercice 1 — Dieu et les fonctions de la religion',
        'Vérifiez les notions relatives à Dieu, au sacré et aux rôles sociaux de la religion.',
        'La correction reprend les définitions et les fonctions étudiées dans la leçon.',
        'single_choice', 'easy',
        '## Consigne\n\nRépondez aux questions à partir des définitions et analyses développées dans la leçon.',
        '## Correction\n\nLa religion associe croyances et pratiques relatives au sacré ; elle peut remplir des fonctions de cohésion sociale, de réconfort et de moralisation.',
        false, false, 10, 10
      where not exists (select 1 from public.exercises e where e.lesson_id = target.lesson_id and e.title = 'Exercice 1 — Dieu et les fonctions de la religion')
      returning id into exercise_foundations_id;

      if exercise_foundations_id is not null then
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order)
        values
          (exercise_foundations_id, 'single_choice', 'Quelle formulation décrit la religion dans la leçon ?', jsonb_build_array('Des croyances et pratiques relatives au sacré et à Dieu', 'Une simple règle politique', 'Une absence de valeurs', 'Une théorie de la mémoire'), jsonb_build_array('Des croyances et pratiques relatives au sacré et à Dieu'), 'La religion est présentée comme un ensemble de croyances et de pratiques ayant Dieu et le sacré pour objet.', 10),
          (exercise_foundations_id, 'single_choice', 'Quelle distinction est importante chez Kant ?', jsonb_build_array('Le concept de Dieu ne prouve pas à lui seul son existence', 'Dieu et l’État sont identiques', 'La mémoire est une preuve de Dieu', 'Toute croyance est une loi'), jsonb_build_array('Le concept de Dieu ne prouve pas à lui seul son existence'), 'Kant distingue l’idée d’un être parfait de l’affirmation de son existence.', 20),
          (exercise_foundations_id, 'single_choice', 'Quelle fonction sociale de la religion est soulignée ?', jsonb_build_array('Elle peut rassembler les hommes autour d’un idéal commun', 'Elle supprime toute communauté', 'Elle interdit toute morale', 'Elle rend les lois inutiles'), jsonb_build_array('Elle peut rassembler les hommes autour d’un idéal commun'), 'Le document insiste sur la capacité de la religion à soutenir la cohésion sociale.', 30),
          (exercise_foundations_id, 'single_choice', 'Quelle fonction Bergson associe-t-il à la religion dans le document ?', jsonb_build_array('Une protection contre l’angoisse et l’incertitude', 'La suppression de toute obligation', 'Le refus du vivre-ensemble', 'La disparition de toute croyance'), jsonb_build_array('Une protection contre l’angoisse et l’incertitude'), 'Bergson est mobilisé pour souligner des fonctions d’assurance et d’apaisement.', 40),
          (exercise_foundations_id, 'true_false', 'La morale religieuse peut recommander le partage et l’amour du prochain.', jsonb_build_array('Vrai', 'Faux'), jsonb_build_array('Vrai'), 'La leçon présente la religion comme susceptible de transmettre des valeurs et des devoirs.', 50);
      end if;

      exercise_foundations_id := null;
      insert into public.exercises (
        subject_id, level_id, series_id, chapter_id, lesson_id,
        title, statement, solution, exercise_type, difficulty,
        content_markdown, correction_markdown,
        is_published, is_active, estimated_duration_minutes, display_order
      )
      select target.subject_id, target.level_id, target.series_id, target.chapter_id, target.lesson_id,
        'Exercice 2 — Religion, aliénation et liberté',
        'Examinez les arguments qui relient pratique religieuse, obligation morale et liberté.',
        'La correction distingue le risque d’aliénation de la possibilité d’une pratique morale librement assumée.',
        'single_choice', 'medium',
        '## Consigne\n\nIdentifiez les arguments permettant de discuter le rapport entre religion et liberté.',
        '## Correction\n\nLa critique de l’aliénation doit être confrontée aux fonctions morales et sociales attribuées à la religion ; une obligation morale suppose un sujet capable de choisir.',
        false, false, 12, 20
      where not exists (select 1 from public.exercises e where e.lesson_id = target.lesson_id and e.title = 'Exercice 2 — Religion, aliénation et liberté')
      returning id into exercise_method_id;

      if exercise_method_id is not null then
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order)
        values
          (exercise_method_id, 'single_choice', 'Pourquoi Marx critique-t-il la religion dans la leçon ?', jsonb_build_array('Elle peut devenir une création humaine qui domine les hommes', 'Elle garantit toujours la liberté absolue', 'Elle remplace toute décision morale', 'Elle supprime les institutions'), jsonb_build_array('Elle peut devenir une création humaine qui domine les hommes'), 'La critique marxienne présente la religion comme pouvant détourner les hommes de leurs responsabilités.', 10),
          (exercise_method_id, 'single_choice', 'Quel risque est associé à une pratique religieuse sans esprit critique ?', jsonb_build_array('L’aliénation ou le fanatisme', 'La mémoire parfaite', 'La disparition du devoir', 'La suppression du sacré'), jsonb_build_array('L’aliénation ou le fanatisme'), 'La leçon invite à interroger les risques de mystification et de fanatisme.', 20),
          (exercise_method_id, 'single_choice', 'Que suppose l’obligation morale ?', jsonb_build_array('Un sujet conscient capable de choisir', 'Un être privé de toute volonté', 'L’absence de responsabilité', 'Une force extérieure unique'), jsonb_build_array('Un sujet conscient capable de choisir'), 'La leçon souligne que le devoir n’est pensable que pour un sujet libre.', 30),
          (exercise_method_id, 'single_choice', 'Que désigne l’impératif catégorique chez Kant ?', jsonb_build_array('Un devoir qui s’impose sans condition', 'Une règle valable seulement si elle est utile', 'Une loi scientifique sur la mémoire', 'Une permission de faire le mal'), jsonb_build_array('Un devoir qui s’impose sans condition'), 'L’impératif catégorique est opposé à l’impératif hypothétique dépendant d’une condition.', 40),
          (exercise_method_id, 'single_choice', 'Quelle démarche est attendue face au sujet « Doit-on redouter la croyance religieuse ? » ?', jsonb_build_array('Confronter les risques d’aliénation aux fonctions sociales et morales de la religion', 'Refuser toute définition des termes', 'Répondre par une affirmation sans argument', 'Traiter uniquement de l’État'), jsonb_build_array('Confronter les risques d’aliénation aux fonctions sociales et morales de la religion'), 'Une production argumentée doit confronter les deux ensembles d’arguments proposés dans le document.', 50);
      end if;

      exercise_method_id := null;
      insert into public.quizzes (subject_id, level_id, series_id, subject_offering_id, chapter_id, lesson_id, title, description, difficulty, duration_minutes, display_order, is_published, is_active)
      select target.subject_id, target.level_id, target.series_id, target.offering_id, target.chapter_id, target.lesson_id,
        'Quiz de révision — Dieu et la religion',
        'Vérifiez votre compréhension de l’idée de Dieu, de la religion et de ses rapports à la liberté.',
        'medium', 12, 10, false, false
      where not exists (select 1 from public.quizzes q where q.lesson_id = target.lesson_id and q.title = 'Quiz de révision — Dieu et la religion')
      returning id into quiz_id;

      if quiz_id is not null then
        with inserted_questions as (
          insert into public.quiz_questions (quiz_id, question, explanation, question_type, display_order, points, is_active)
          values
            (quiz_id, 'Quel est le fondement de la religion dans la présentation de la leçon ?', 'La religion se rapporte à des croyances et pratiques ayant Dieu et le sacré pour objet.', 'single_choice', 10, 1, true),
            (quiz_id, 'Quel point Kant met-il en discussion ?', 'Le concept de Dieu ne suffit pas à établir son existence.', 'single_choice', 20, 1, true),
            (quiz_id, 'Quelle fonction sociale la religion peut-elle exercer ?', 'Elle peut renforcer la cohésion d’une communauté.', 'single_choice', 30, 1, true),
            (quiz_id, 'Quel besoin humain la religion peut-elle apaiser selon les analyses présentées ?', 'Elle peut répondre à l’angoisse et à l’incertitude.', 'single_choice', 40, 1, true),
            (quiz_id, 'Quelle critique Marx adresse-t-il à la religion ?', 'Elle peut devenir une puissance qui domine les hommes.', 'single_choice', 50, 1, true),
            (quiz_id, 'Quel risque doit être distingué de la pratique réfléchie de la foi ?', 'Le fanatisme et l’aliénation.', 'single_choice', 60, 1, true),
            (quiz_id, 'Pourquoi l’obligation morale n’exclut-elle pas nécessairement la liberté ?', 'Elle suppose un sujet capable de décider et d’assumer son acte.', 'single_choice', 70, 1, true)
          returning id, display_order
        )
        insert into public.quiz_answers (question_id, answer, is_correct, display_order)
        select q.id, a.answer, a.is_correct, a.display_order
        from inserted_questions q
        join lateral (
          select * from (values
            (10, 'Dieu et le sacré', true, 10), (10, 'L’État seulement', false, 20), (10, 'La mémoire seule', false, 30),
            (20, 'Le concept de Dieu ne prouve pas son existence', true, 10), (20, 'Dieu est une loi', false, 20), (20, 'Toute croyance est impossible', false, 30),
            (30, 'Renforcer la cohésion d’une communauté', true, 10), (30, 'Supprimer les relations humaines', false, 20), (30, 'Abolir le droit', false, 30),
            (40, 'L’angoisse et l’incertitude', true, 10), (40, 'La conscience morale', false, 20), (40, 'La nation', false, 30),
            (50, 'Elle peut dominer les hommes comme une création humaine', true, 10), (50, 'Elle supprime toute morale', false, 20), (50, 'Elle est toujours sans effet social', false, 30),
            (60, 'Le fanatisme et l’aliénation', true, 10), (60, 'La conscience psychologique', false, 20), (60, 'La justice civile', false, 30),
            (70, 'Elle suppose un sujet capable de décider', true, 10), (70, 'Elle remplace tous les choix', false, 20), (70, 'Elle abolit la responsabilité', false, 30)
          ) as answers(question_order, answer, is_correct, display_order)
        ) a on a.question_order = q.display_order;
      end if;
    end if;

    quiz_id := null;
  end loop;
end;
$commande$;
