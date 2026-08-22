-- Brouillons SVT Terminale D : réflexe conditionnel, tissu nerveux et muscle strié squelettique.
-- Les trois structures officielles sont confirmées, vides, inactives et sans activité avant cette migration.
-- Toutes les ressources créées restent inactives et non publiées ; toute leçon déjà remplie annule la migration.
do $svt_terminal_d_lot1$
declare
  target record;
  exercise_a_uuid uuid;
  exercise_b_uuid uuid;
  quiz_uuid uuid;
  lesson_count integer;
begin
  select count(*) into lesson_count
  from public.lessons
  where id in ('a1014581-6c61-45fc-9a7a-6ca2ae01819d', '2df0f2fd-c17b-4edf-8d90-b0d18870b38c', '554ab193-ba0f-4ff6-9f78-a1dec8ebcffc');
  if lesson_count <> 3 then
    raise exception 'Les trois leçons SVT Terminale D attendues sont requises avant remplissage ; transaction annulée.';
  end if;

  select l.id as lesson_id,c.id as chapter_id,o.id as offering_id,o.subject_id,o.level_id,o.series_id into target
  from public.lessons l
  join public.chapters c on c.id=l.chapter_id
  join public.course_subject_offerings o on o.id=c.subject_offering_id
  where l.id='a1014581-6c61-45fc-9a7a-6ca2ae01819d';
  if target.lesson_id is null then raise exception 'Leçon cible % introuvable.', 'a1014581-6c61-45fc-9a7a-6ca2ae01819d'; end if;
  if exists (select 1 from public.lessons where id=target.lesson_id and coalesce(btrim(content),'') <> '') then
    raise exception 'La leçon SVT Terminale D % contient déjà un cours : écrasement interdit.', target.lesson_id;
  end if;
  update public.lessons
  set description='Apprentissage du réflexe conditionnel, expériences de Pavlov, mécanisme nerveux, conditions de mise en place et extinction.',
      content=$lesson_content$
## Le réflexe conditionnel

> **Objectif :** expliquer comment un réflexe conditionnel se met en place par apprentissage et identifier le mécanisme nerveux qui permet au stimulus conditionnel de déclencher une réponse.

## 1. Comprendre ce qui rend un réflexe « conditionnel »

Certaines activités réussies, comme la conduite, la nage, l’écriture ou la lecture, s’acquièrent progressivement. Le document les rapproche de comportements qui apparaissent avec le temps : les **réflexes conditionnels**. La question directrice est donc la suivante : **comment les réflexes conditionnels se mettent-ils en place ?**

> **Définition : réflexe conditionnel ou réflexe acquis.** Réaction déclenchée par un stimulus qui n’a pas habituellement d’action sur la fonction considérée. Il se met en place à la suite d’un apprentissage.  
> **Définition : apprentissage.** Acquisition progressive d’une réponse nouvelle grâce à la répétition organisée d’expériences ou d’associations.

Le document développe deux idées : le réflexe conditionnel se met en place par apprentissage et il dépend d’un mécanisme nerveux.

## 2. Les expériences de Pavlov : apprendre à répondre à un stimulus neutre

Les expériences décrites consistent à présenter à un chien deux stimuli, le son d’un métronome et la viande, séparément puis associés. Les quatre phases doivent être distinguées avec précision.

| Phase | Situation présentée | Réponse du chien | Signification |
|---|---|---|---|
| 1 | Son du métronome seul | Pas de salivation | Le son est un stimulus neutre |
| 2 | Viande seule | Salivation | La viande est un stimulus absolu ; la salivation est un réflexe inné |
| 3 | Son suivi de viande, répété plusieurs fois | Salivation | Association des stimuli : phase d’apprentissage |
| 4 | Son seul après l’apprentissage | Salivation | Le son est devenu stimulus conditionnel ; la réponse est un réflexe acquis |

### Les mots essentiels de l’expérience

> **Définition : stimulus neutre.** Stimulus qui n’apporte pas naturellement la réponse attendue avant le conditionnement. Dans l’expérience, le son seul ne déclenche pas la salivation.  
> **Définition : stimulus absolu ou stimulus inconditionnel.** Stimulus efficace qui déclenche naturellement une réponse. Dans l’expérience, la viande provoque la salivation.  
> **Définition : stimulus conditionnel.** Stimulus initialement neutre qui déclenche une réponse réflexe après apprentissage.

La salivation provoquée par la viande correspond à un **réflexe inné** ou **réflexe inconditionnel**. Après les associations répétées, la salivation provoquée par le son seul correspond au **réflexe conditionnel**. Il ne faut donc pas confondre la réponse initiale, présente sans apprentissage, et la réponse acquise, qui dépend de l’association préalable.

> **Méthode : analyser une expérience de conditionnement.** Identifiez d’abord le stimulus qui agit naturellement et la réponse naturelle. Repérez ensuite le stimulus neutre, puis la phase d’association répétée. Enfin, observez si le stimulus neutre présenté seul devient capable de déclencher la réponse.

## 3. Un mécanisme nerveux à l’origine de la réponse acquise

Le document compare trois situations. Avec la viande sur la langue, le chien salive. Avec l’association répétée du son et de la viande, il salive. Après cette phase, le son seul provoque également la salivation.

| Situation | Trajet ou relation mis en évidence |
|---|---|
| Viande sur la langue | L’aliment stimule les terminaisons nerveuses de la langue ; l’influx atteint le centre de salivation puis les glandes salivaires |
| Son associé à la viande | L’association répétée permet l’établissement d’une nouvelle liaison nerveuse |
| Son seul après apprentissage | Le son stimule l’aire auditive, puis la nouvelle liaison permet d’activer l’aire gustative et la sécrétion salivaire |

Le schéma du PDF met en relation l’oreille, les fibres sensitives auditives, l’aire corticale auditive, la nouvelle liaison nerveuse, l’aire corticale gustative, le centre réflexe salivaire, les fibres nerveuses motrices et les glandes salivaires.

> **Définition : récepteur sensitif.** Organe qui reçoit un stimulus ; l’oreille est donnée en exemple dans le réflexe conditionnel de salivation.  
> **Définition : effecteur.** Organe qui réalise la réponse ; ici, les glandes salivaires assurent la sécrétion salivaire.  
> **Définition : nouvelle liaison nerveuse.** Liaison établie lors de l’apprentissage entre les aires corticales impliquées ; elle permet au stimulus conditionnel de produire la réponse acquise.

### Schéma fonctionnel à retenir

$$
\text{son} \rightarrow \text{récepteurs de l’oreille} \rightarrow \text{aire auditive}
\rightarrow \text{nouvelle liaison nerveuse} \rightarrow \text{aire gustative}
\rightarrow \text{centre salivaire} \rightarrow \text{glandes salivaires} \rightarrow \text{salivation}
$$

## 4. Conditions nécessaires à la mise en place

Le réflexe conditionnel ne s’installe pas dans n’importe quelles conditions. Le document indique que les hémisphères cérébraux doivent être présents, les organes doivent être intègres et l’animal doit être vigilant. Les stimuli doivent être efficaces, intéressants, précis et doux.

| Condition citée dans le support | Importance pédagogique |
|---|---|
| Présence des hémisphères cérébraux | Les aires corticales sont nécessaires à la nouvelle liaison nerveuse |
| Organes intègres | Récepteurs, voies nerveuses et effecteurs doivent fonctionner |
| État de vigilance | Le stress, la gêne ou l’absence d’attention peuvent empêcher l’apprentissage |
| Ordre des stimuli | Le stimulus neutre choisi doit précéder le stimulus absolu |
| Répétition et entretien | L’association doit être répétée puis le réflexe doit être entretenu |

> **Attention :** un réflexe conditionnel n’est pas définitif. S’il n’est pas entretenu, la réponse au stimulus conditionnel diminue puis peut disparaître. Cette disparition correspond à l’**extinction**.

## 5. Caractéristiques du réflexe acquis

Les situations d’évaluation du PDF font apparaître que le réflexe conditionnel est acquis après apprentissage, qu’il est temporaire et qu’il doit être renforcé pour persister. L’exemple de la souris avec lumière et courant électrique montre les étapes suivantes : lumière seule sans flexion, courant électrique avec flexion, association répétée lumière-courant, puis flexion avec lumière seule. Quand la lumière seule est ensuite présentée sans renforcement, la flexion disparaît progressivement : c’est l’extinction.

> **Synthèse :** le réflexe conditionnel est une réaction acquise. Il apparaît après l’association répétée d’un stimulus neutre et d’un stimulus absolu. L’apprentissage établit une nouvelle liaison nerveuse entre des aires cérébrales. Une fois la réponse installée, le stimulus neutre devient conditionnel, mais le réflexe reste temporaire et doit être entretenu pour éviter son extinction.

## Référence pédagogique

Contenu reformulé, structuré et approfondi à partir du PDF fourni : **« Le réflexe conditionnel »**, SVT, Terminale D, Côte d’Ivoire — Mon École à la Maison.
$lesson_content$,
      is_active=false
  where id=target.lesson_id and coalesce(btrim(content),'')='';

  exercise_a_uuid := null;
  insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
  select target.subject_id,target.level_id,target.series_id,target.chapter_id,target.lesson_id,'Exercice 1 — Phases de l’expérience de Pavlov','Distinguez les quatre phases de l’expérience de Pavlov et utilisez correctement les notions de stimulus neutre, absolu et conditionnel.','La correction associe la viande au stimulus absolu, le son initial au stimulus neutre et le son après apprentissage au stimulus conditionnel.','single_choice','easy','## Consigne

Répondez en utilisant le vocabulaire exact du cours.','## Correction

Relisez les définitions, tableaux et mécanismes correspondants dans la leçon.',false,false,15,10
  where not exists (select 1 from public.exercises e where e.lesson_id=target.lesson_id and e.title='Exercice 1 — Phases de l’expérience de Pavlov')
  returning id into exercise_a_uuid;
  if exercise_a_uuid is not null then
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
      (exercise_a_uuid,'single_choice','Dans la première phase de l’expérience de Pavlov, quel est le statut du son du métronome ?',jsonb_build_array('Un stimulus neutre', 'Un stimulus absolu', 'Un stimulus conditionnel déjà acquis', 'Un effecteur'),jsonb_build_array('Un stimulus neutre'),'Le son seul ne provoque pas de salivation avant l’apprentissage : le support le qualifie donc de stimulus neutre.',10),
      (exercise_a_uuid,'single_choice','Quelle opération constitue la phase d’apprentissage ?',jsonb_build_array('Associer plusieurs fois le son et la viande', 'Présenter seulement le son après l’apprentissage', 'Présenter seulement la viande', 'Supprimer toute stimulation'),jsonb_build_array('Associer plusieurs fois le son et la viande'),'La troisième phase associe et répète le son et la viande ; elle permet l’apprentissage.',20),
      (exercise_a_uuid,'true_false','Après les associations répétées, la salivation provoquée par le son seul est un réflexe conditionnel ou réflexe acquis.',jsonb_build_array('Vrai', 'Faux'),jsonb_build_array('Vrai'),'À la quatrième phase, le son seul déclenche la salivation car il est devenu un stimulus conditionnel.',30);
  end if;

  exercise_b_uuid := null;
  insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
  select target.subject_id,target.level_id,target.series_id,target.chapter_id,target.lesson_id,'Exercice 2 — Mécanisme et conditions du réflexe acquis','Expliquez le rôle de la nouvelle liaison nerveuse, des aires corticales et des conditions nécessaires à la persistance d’un réflexe conditionnel.','La correction met en relation aire auditive, aire gustative, centre salivaire, effecteurs et entretien du réflexe.','single_choice','medium','## Consigne

Analysez chaque proposition puis justifiez-la par une notion précise du cours.','## Correction

La correction relie chaque réponse aux mécanismes étudiés dans la leçon.',false,false,20,20
  where not exists (select 1 from public.exercises e where e.lesson_id=target.lesson_id and e.title='Exercice 2 — Mécanisme et conditions du réflexe acquis')
  returning id into exercise_b_uuid;
  if exercise_b_uuid is not null then
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
      (exercise_b_uuid,'single_choice','Quelle nouvelle liaison est explicitement établie dans le réflexe conditionnel de salivation étudié ?',jsonb_build_array('Entre l’aire auditive et l’aire gustative', 'Entre la moelle et la peau seulement', 'Entre les glandes salivaires et les yeux', 'Entre l’axone et la myéline'),jsonb_build_array('Entre l’aire auditive et l’aire gustative'),'Le PDF explique que l’association répétée crée une nouvelle liaison nerveuse entre l’aire auditive et l’aire gustative.',10),
      (exercise_b_uuid,'single_choice','Quel organe est l’effecteur de la réponse dans le réflexe conditionnel de salivation ?',jsonb_build_array('Les glandes salivaires', 'L’oreille', 'L’aire auditive', 'La langue'),jsonb_build_array('Les glandes salivaires'),'Les glandes salivaires réalisent la sécrétion de salive ; elles sont donc les effecteurs.',20),
      (exercise_b_uuid,'true_false','Un réflexe conditionnel une fois installé ne peut jamais disparaître.',jsonb_build_array('Vrai', 'Faux'),jsonb_build_array('Faux'),'Le support précise que le réflexe acquis doit être entretenu pour éviter son extinction ; il n’est donc pas définitif.',30);
  end if;

  quiz_uuid := null;
  insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active)
  select target.subject_id,target.level_id,target.series_id,target.offering_id,target.chapter_id,target.lesson_id,'Quiz de révision — Réflexe conditionnel','Vérifiez la maîtrise du vocabulaire, des mécanismes et de la synthèse de la leçon.','medium',12,10,false,false
  where not exists (select 1 from public.quizzes q where q.lesson_id=target.lesson_id and q.title='Quiz de révision — Réflexe conditionnel')
  returning id into quiz_uuid;
  if quiz_uuid is not null then
    with inserted_questions as (
      insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
        (quiz_uuid,'Quelle réponse est naturellement provoquée par la viande dans l’expérience de Pavlov ?','La viande entraîne naturellement la salivation : cette réponse est un réflexe inné ou inconditionnel.','single_choice',10,1,true),
        (quiz_uuid,'Comment appelle-t-on la disparition progressive d’un réflexe acquis non entretenu ?','Le document nomme extinction la disparition du réflexe conditionnel lorsqu’il n’est plus entretenu.','single_choice',20,1,true),
        (quiz_uuid,'Quelle condition porte sur l’ordre de présentation lors de l’apprentissage ?','Le stimulus neutre choisi doit précéder le stimulus absolu selon le document.','single_choice',30,1,true),
        (quiz_uuid,'Quel ensemble de structures assure la réponse finale de salivation ?','Les glandes salivaires sont les effecteurs qui assurent la sécrétion de salive.','single_choice',40,1,true)
      returning id,display_order
    )
    insert into public.quiz_answers (question_id,answer,is_correct,display_order)
    select inserted_questions.id,answers.answer,answers.is_correct,answers.display_order
    from inserted_questions
    join (values
        (10,'La salivation',true,10),
        (10,'La flexion de la patte',false,20),
        (20,'L’extinction',true,10),
        (20,'La sommation',false,20),
        (30,'Le stimulus neutre doit précéder le stimulus absolu',true,10),
        (30,'Le stimulus absolu doit toujours être absent',false,20),
        (40,'Les glandes salivaires',true,10),
        (40,'Les cellules de Schwann',false,20)
    ) as answers(question_order,answer,is_correct,display_order)
      on answers.question_order=inserted_questions.display_order;
  end if;

  select l.id as lesson_id,c.id as chapter_id,o.id as offering_id,o.subject_id,o.level_id,o.series_id into target
  from public.lessons l
  join public.chapters c on c.id=l.chapter_id
  join public.course_subject_offerings o on o.id=c.subject_offering_id
  where l.id='2df0f2fd-c17b-4edf-8d90-b0d18870b38c';
  if target.lesson_id is null then raise exception 'Leçon cible % introuvable.', '2df0f2fd-c17b-4edf-8d90-b0d18870b38c'; end if;
  if exists (select 1 from public.lessons where id=target.lesson_id and coalesce(btrim(content),'') <> '') then
    raise exception 'La leçon SVT Terminale D % contient déjà un cours : écrasement interdit.', target.lesson_id;
  end if;
  update public.lessons
  set description='Organisation du tissu nerveux, potentiel d’action, excitabilité, conduction, vitesse de propagation et transmission synaptique.',
      content=$lesson_content$
## Le fonctionnement du tissu nerveux

> **Objectif :** expliquer comment le message nerveux se propage dans l’organisme, de l’organisation du neurone jusqu’au passage de l’influx nerveux à travers une synapse.

## 1. Le tissu nerveux : du nerf au neurone

Le document présente le tissu nerveux comme un ensemble de nerfs. Un nerf est formé de faisceaux de fibres nerveuses et de vaisseaux sanguins inclus dans un tissu conjonctif, le tout entouré d’une gaine conjonctive appelée **épinèvre**. Chaque faisceau est entouré de **périnèvre** et subdivisé par des **endonèvres**.

| Niveau d’organisation | Éléments décrits dans le PDF |
|---|---|
| Nerf | Faisceaux de fibres nerveuses, vaisseaux sanguins, tissu conjonctif, épinèvre |
| Fibre nerveuse | Peut être myélinisée ou amyélinisée |
| Neurone | Soma ou péricaryon, dendrites, axone, arborisation terminale |

> **Définition : neurone.** Cellule nerveuse présentée comme l’unité fonctionnelle du tissu nerveux.  
> **Définition : axone.** Long prolongement du neurone qui conduit l’influx nerveux.  
> **Définition : myéline.** Gaine entourant certaines fibres ; elle est interrompue au niveau des nœuds de Ranvier.

Le PDF distingue des fibres **myélinisées** et **amyélinisées**. Cette différence aura une conséquence directe sur la vitesse de propagation de l’influx nerveux.

## 2. Une nature électrique : potentiel de repos et potentiel d’action

Les expériences réalisées sur l’axone géant de calmar utilisent un oscillographe ou oscilloscope. Lorsque les deux électrodes sont à la surface de l’axone au repos, la différence de potentiel enregistrée est nulle.

$$
V_{\text{référence}} = 0\ \text{mV}
$$

Lorsqu’une électrode est introduite dans l’axone alors que l’autre reste à la surface, l’enregistrement se stabilise à environ :

$$
V_{\text{repos}} \approx -70\ \text{mV}
$$

> **Définition : potentiel de repos ou potentiel de membrane.** Différence de potentiel électrique entre la surface et l’intérieur d’une fibre nerveuse au repos.  
> **Définition : potentiel d’action (PA).** Inversion momentanée de la polarité entre les deux faces de la membrane de l’axone, déclenchée par une stimulation efficace.

Le potentiel de repos est relié à une répartition inégale des ions potassium \(K^+\) et sodium \(Na^+\) de part et d’autre de la membrane. Le milieu intracellulaire est plus concentré en \(K^+\), tandis que le milieu extracellulaire est plus concentré en \(Na^+\). Le document explique que ce déséquilibre est maintenu par la pompe ionique \(Na^+/K^+\).

### Étapes du potentiel d’action monophasique

| Étape | Observation | Interprétation donnée par le support |
|---|---|---|
| Artefact de stimulation | Repère du moment de la stimulation | Indique l’instant qui déclenche la naissance de l’influx |
| Latence | Délai avant la réponse | Temps mis par l’influx pour atteindre l’électrode réceptrice |
| Dépolarisation | Pic de la courbe | Entrée massive de \(Na^+\) après ouverture des canaux sodium voltage-dépendants |
| Repolarisation | Retour vers le potentiel de repos | Sortie de \(K^+\) après ouverture des canaux potassium voltage-dépendants |
| Hyperpolarisation | Passage sous le potentiel de repos | Sortie excessive de \(K^+\) car les canaux restent ouverts plus longtemps |
| Restauration | Retour durable à la valeur initiale | Action de la pompe \(Na^+/K^+\) avec consommation d’énergie issue de l’ATP |

> **Attention :** l’influx nerveux est décrit comme une onde de négativité qui se propage le long de l’axone en dépolarisant localement la membrane grâce à des courants locaux.

## 3. L’excitabilité : répondre à une stimulation efficace

La courbe d’excitabilité du nerf met en relation l’intensité et la durée de stimulation. Les stimulations situées sur ou au-dessus de la courbe entraînent une réponse ; celles situées en dessous n’en entraînent pas.

| Vocabulaire | Définition issue du cours |
|---|---|
| Excitation liminaire | Excitation seuil capable de provoquer une réponse |
| Excitation infraliminaire | Excitation inefficace, sous le seuil, qui ne provoque pas de réponse |
| Excitation supraliminaire | Excitation au-dessus du seuil, efficace, qui provoque une réponse |
| Rhéobase | Plus petite intensité de stimulation capable de provoquer une réponse |
| Temps utile | Plus petite durée d’application de la rhéobase qui permet une réponse |
| Chronaxie | Durée d’application de l’intensité double de la rhéobase provoquant une réponse |

Le support indique que plus la chronaxie est petite, plus le nerf est excitable.

### Fibre nerveuse et nerf entier : deux lois distinctes

Une fibre nerveuse isolée ne répond pas au-dessous du seuil. À partir de l’intensité liminaire, la réponse est d’emblée maximale : elle obéit à la **loi du tout ou rien**.

Un nerf entier contient des fibres ayant des seuils d’excitation différents. Lorsque l’intensité augmente, un nombre croissant de fibres est recruté et leurs réponses s’additionnent. Cette augmentation progressive correspond au phénomène de **sommation**.

> **Définition : sommation.** Addition progressive des réponses de fibres nerveuses recrutées lorsque l’intensité de stimulation augmente.  
> **Définition : loi du tout ou rien.** Lorsqu’une fibre nerveuse atteint son seuil d’excitabilité, elle donne une réponse d’amplitude maximale ; en dessous du seuil, elle ne répond pas.

## 4. Périodes réfractaires et sens de propagation

Après une première réponse, le nerf peut momentanément perdre tout ou partie de son excitabilité. Lorsque deux stimulations sont trop rapprochées, le nerf ne répond pas à la seconde : c’est la **période réfractaire absolue (PRA)**. Lorsque le délai augmente, la seconde réponse réapparaît et gagne progressivement en amplitude : c’est la **période réfractaire relative (PRR)**.

| Période | État de la réponse | Explication du document |
|---|---|---|
| PRA | Pas de réponse à la seconde stimulation | Pompe \(Na^+/K^+\) pas encore restaurée ; canaux sodium fermés |
| PRR | Réponse progressive à la seconde stimulation | Rétablissement progressif des concentrations ioniques et ouverture possible des canaux sodium |
| Retour normal | Réponse identique à la première | Rétablissement total des concentrations ioniques |

Sur une fibre isolée placée hors de l’organisme, le PA est enregistré de part et d’autre du point d’excitation : la propagation est bidirectionnelle. Dans l’organisme, le sens fonctionnel indiqué est :

$$
\text{dendrites} \rightarrow \text{corps cellulaire} \rightarrow \text{axone} \rightarrow \text{arborisation terminale}
$$

## 5. Vitesse de conduction de l’influx nerveux

Le PDF indique que la vitesse de propagation dépend de la nature de la fibre, de son diamètre et de la température. Elle est plus élevée dans les fibres myélinisées que dans les fibres amyéliniques ; à nature et diamètre égaux, elle augmente avec la température ; à nature et température égales, elle augmente avec le diamètre.

| Type de fibre | Mécanisme présenté | Conséquence |
|---|---|---|
| Amyélinisée | Dépolarisation de proche en proche par courants locaux | Conduction continue et lente |
| Myélinisée | Dépolarisation par sauts entre nœuds de Ranvier | Conduction saltatoire et plus rapide |

La vitesse de conduction est calculée à partir de la distance \(\Delta d\) et du décalage temporel \(\Delta t\) observés entre deux enregistrements.

$$
V = \frac{\Delta d}{\Delta t} = \frac{d_2-d_1}{t_2-t_1}
$$

## 6. La synapse : transmettre l’influx à une autre structure excitable

La transmission de l’influx d’un neurone à une autre structure se fait à travers une **synapse**, composée d’un élément présynaptique et d’un élément postsynaptique séparés par une **fente synaptique**.

| Zone de contact | Description |
|---|---|
| Synapse axo-axonique | Contact entre l’axone d’un neurone et l’axone d’un autre neurone |
| Synapse axo-dendritique | Contact entre un axone et une dendrite |
| Synapse axo-somatique | Contact entre un axone et le corps cellulaire d’un autre neurone |
| Jonction neuro-musculaire ou plaque motrice | Contact entre un neurone et une cellule musculaire |

### Étapes de la transmission synaptique excitatrice

1. Le potentiel d’action arrive au bouton synaptique présynaptique.
2. Des ions \(Ca^{2+}\) entrent dans le bouton synaptique.
3. Les neurotransmetteurs sont libérés dans la fente par exocytose.
4. Le neurotransmetteur se fixe sur des récepteurs de la membrane postsynaptique.
5. Des canaux à \(Na^+\) s’ouvrent et les ions sodium entrent dans la structure postsynaptique.
6. La membrane postsynaptique se dépolarise ; un PA musculaire ou un potentiel postsynaptique peut naître selon la structure concernée.
7. Le neuromédiateur est hydrolysé.
8. Une partie est recaptée ou réabsorbée par le bouton synaptique.

> **Définition : neurotransmetteur ou neuromédiateur.** Substance chimique libérée dans la fente synaptique et reconnue par des récepteurs spécifiques ; l’acétylcholine est citée comme exemple.  
> **Définition : exocytose.** Libération du contenu de vésicules synaptiques vers la fente synaptique.

Lorsque les neurotransmetteurs ouvrent des canaux à \(Na^+\) et provoquent une dépolarisation, la synapse est **excitatrice** et le potentiel obtenu est un **PPSE**. Lorsqu’ils entraînent une sortie de \(K^+\) ou une entrée de \(Cl^-\), la membrane est hyperpolarisée : la synapse est **inhibitrice** et le potentiel obtenu est un **PPSI**.

> **Synthèse :** le tissu nerveux est organisé en neurones et en fibres nerveuses. L’influx se propage électriquement le long de la fibre grâce aux mouvements ioniques et aux courants locaux. L’excitabilité dépend du seuil, la fibre obéit au tout ou rien et le nerf à la sommation. La vitesse dépend de la myéline, du diamètre et de la température. À la synapse, la transmission devient chimique grâce à un neuromédiateur libéré puis reconnu par la cellule postsynaptique.

## Référence pédagogique

Contenu reformulé, structuré et approfondi à partir du PDF fourni : **« Le fonctionnement du tissu nerveux »**, SVT, Terminale D, Côte d’Ivoire — Mon École à la Maison.
$lesson_content$,
      is_active=false
  where id=target.lesson_id and coalesce(btrim(content),'')='';

  exercise_a_uuid := null;
  insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
  select target.subject_id,target.level_id,target.series_id,target.chapter_id,target.lesson_id,'Exercice 1 — Potentiel d’action et excitabilité nerveuse','Identifiez les phases d’un potentiel d’action et distinguez les notions de seuil, rhéobase, tout ou rien et sommation.','La correction relie les mouvements de Na+ et K+ aux phases du PA puis distingue le comportement d’une fibre isolée de celui d’un nerf entier.','single_choice','easy','## Consigne

Répondez en utilisant le vocabulaire exact du cours.','## Correction

Relisez les définitions, tableaux et mécanismes correspondants dans la leçon.',false,false,20,10
  where not exists (select 1 from public.exercises e where e.lesson_id=target.lesson_id and e.title='Exercice 1 — Potentiel d’action et excitabilité nerveuse')
  returning id into exercise_a_uuid;
  if exercise_a_uuid is not null then
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
      (exercise_a_uuid,'single_choice','Quelle valeur de potentiel de repos est indiquée pour la fibre nerveuse dans le document ?',jsonb_build_array('Environ −70 mV', '0 mV', 'Environ +70 mV', 'Environ −85 mV'),jsonb_build_array('Environ −70 mV'),'Le support indique un potentiel de repos ou potentiel de membrane de −70 mV pour la fibre nerveuse étudiée.',10),
      (exercise_a_uuid,'single_choice','Quel mouvement ionique explique la dépolarisation dans le modèle du cours ?',jsonb_build_array('Une entrée massive de Na+', 'Une sortie massive de Na+', 'Une entrée massive de K+', 'Une entrée de Cl−'),jsonb_build_array('Une entrée massive de Na+'),'La dépolarisation est due à l’entrée massive de sodium après ouverture des canaux sodium voltage-dépendants.',20),
      (exercise_a_uuid,'true_false','Une fibre nerveuse isolée obéit à la loi du tout ou rien tandis qu’un nerf entier montre une sommation par recrutement de fibres.',jsonb_build_array('Vrai', 'Faux'),jsonb_build_array('Vrai'),'Le PDF oppose explicitement la réponse maximale d’une fibre isolée à la sommation observée dans un nerf entier.',30);
  end if;

  exercise_b_uuid := null;
  insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
  select target.subject_id,target.level_id,target.series_id,target.chapter_id,target.lesson_id,'Exercice 2 — Conduction et transmission synaptique','Expliquez les facteurs de vitesse de conduction et ordonnez les étapes d’une synapse excitatrice.','La correction distingue conduction continue et saltatoire, puis organise la chaîne arrivée du PA, Ca2+, exocytose, fixation, Na+ et dépolarisation.','single_choice','medium','## Consigne

Analysez chaque proposition puis justifiez-la par une notion précise du cours.','## Correction

La correction relie chaque réponse aux mécanismes étudiés dans la leçon.',false,false,25,20
  where not exists (select 1 from public.exercises e where e.lesson_id=target.lesson_id and e.title='Exercice 2 — Conduction et transmission synaptique')
  returning id into exercise_b_uuid;
  if exercise_b_uuid is not null then
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
      (exercise_b_uuid,'single_choice','Quel type de fibre assure une conduction saltatoire plus rapide dans le document ?',jsonb_build_array('La fibre myélinisée', 'La fibre amyélinisée', 'La fibre sans axone', 'La fibre sans membrane'),jsonb_build_array('La fibre myélinisée'),'Dans la fibre myélinisée, l’excitation saute d’un nœud de Ranvier à l’autre : la conduction est plus rapide.',10),
      (exercise_b_uuid,'single_choice','Quel ion entre dans le bouton présynaptique avant l’exocytose du neurotransmetteur ?',jsonb_build_array('Ca2+', 'Na+', 'K+', 'Cl−'),jsonb_build_array('Ca2+'),'L’arrivée de l’influx entraîne l’entrée de Ca2+ dans le bouton synaptique, ce qui précède l’exocytose.',20),
      (exercise_b_uuid,'true_false','Une synapse excitatrice provoque une hyperpolarisation de la membrane postsynaptique et un PPSI.',jsonb_build_array('Vrai', 'Faux'),jsonb_build_array('Faux'),'Une synapse excitatrice provoque une dépolarisation et un PPSE ; l’hyperpolarisation caractérise une synapse inhibitrice.',30);
  end if;

  quiz_uuid := null;
  insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active)
  select target.subject_id,target.level_id,target.series_id,target.offering_id,target.chapter_id,target.lesson_id,'Quiz de révision — Fonctionnement du tissu nerveux','Vérifiez la maîtrise du vocabulaire, des mécanismes et de la synthèse de la leçon.','medium',12,10,false,false
  where not exists (select 1 from public.quizzes q where q.lesson_id=target.lesson_id and q.title='Quiz de révision — Fonctionnement du tissu nerveux')
  returning id into quiz_uuid;
  if quiz_uuid is not null then
    with inserted_questions as (
      insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
        (quiz_uuid,'Comment appelle-t-on la plus petite intensité capable de provoquer une réponse nerveuse ?','Le document nomme rhéobase ou intensité liminaire la plus petite intensité capable de déclencher une réponse.','single_choice',10,1,true),
        (quiz_uuid,'Quelle période correspond à l’absence totale de réponse après une première stimulation ?','La période réfractaire absolue correspond à la phase pendant laquelle le nerf ne répond pas à une seconde stimulation efficace.','single_choice',20,1,true),
        (quiz_uuid,'Quel est le sens de propagation fonctionnel de l’influx dans l’organisme selon le support ?','Le cours donne le sens dendrites, corps cellulaire, axone puis arborisation terminale.','single_choice',30,1,true),
        (quiz_uuid,'Quel neurotransmetteur est explicitement cité dans l’exemple de synapse ?','L’acétylcholine est donnée comme exemple de neuromédiateur dans le fonctionnement de la plaque motrice.','single_choice',40,1,true)
      returning id,display_order
    )
    insert into public.quiz_answers (question_id,answer,is_correct,display_order)
    select inserted_questions.id,answers.answer,answers.is_correct,answers.display_order
    from inserted_questions
    join (values
        (10,'La rhéobase',true,10),
        (10,'La chronaxie',false,20),
        (20,'La période réfractaire absolue',true,10),
        (20,'La période de sommation',false,20),
        (30,'Dendrites → corps cellulaire → axone → arborisation terminale',true,10),
        (30,'Arborisation terminale → axone → dendrites',false,20),
        (40,'L’acétylcholine',true,10),
        (40,'La myéline',false,20)
    ) as answers(question_order,answer,is_correct,display_order)
      on answers.question_order=inserted_questions.display_order;
  end if;

  select l.id as lesson_id,c.id as chapter_id,o.id as offering_id,o.subject_id,o.level_id,o.series_id into target
  from public.lessons l
  join public.chapters c on c.id=l.chapter_id
  join public.course_subject_offerings o on o.id=c.subject_offering_id
  where l.id='554ab193-ba0f-4ff6-9f78-a1dec8ebcffc';
  if target.lesson_id is null then raise exception 'Leçon cible % introuvable.', '554ab193-ba0f-4ff6-9f78-a1dec8ebcffc'; end if;
  if exists (select 1 from public.lessons where id=target.lesson_id and coalesce(btrim(content),'') <> '') then
    raise exception 'La leçon SVT Terminale D % contient déjà un cours : écrasement interdit.', target.lesson_id;
  end if;
  update public.lessons
  set description='Structure du muscle strié squelettique, contraction actine-myosine, réponses aux stimulations et régénération de l’ATP.',
      content=$lesson_content$
## Le fonctionnement du muscle strié squelettique

> **Objectif :** décrire la structure du muscle strié squelettique, expliquer sa contraction, interpréter ses réponses aux stimulations et identifier les voies de régénération de l’ATP présentées dans le support.

## 1. Une structure organisée pour la contraction

Le muscle frais est constitué de plusieurs fibres musculaires regroupées en faisceaux. La fibre musculaire est une cellule géante, allongée, plurinucléée, qui contient des fibrilles et présente des striations transversales. Elle baigne dans le **sarcoplasme** et est entourée par le **sarcolemme**.

| Niveau d’organisation | Éléments relevés dans le PDF |
|---|---|
| Muscle frais | Faisceaux de fibres musculaires, vaisseaux sanguins, tissu conjonctif, membrane externe |
| Fibre musculaire | Cellule géante plurinucléée, sarcoplasme, sarcolemme, fibrilles, striations |
| Myofibrille | Alternance de bandes sombres et claires, zone H, strie Z |
| Sarcomère | Portion comprise entre deux stries Z consécutives |

Le sarcomère contient deux types de filaments : les filaments fins d’**actine** et les filaments épais de **myosine**. Les filaments fins comprennent actine G, troponine et tropomyosine, tandis que les filaments épais sont constitués de molécules de myosine.

> **Définition : sarcomère.** Portion d’une myofibrille comprise entre deux stries Z consécutives.  
> **Définition : filament fin.** Filament d’actine, associé à la troponine et à la tropomyosine.  
> **Définition : filament épais.** Filament constitué de molécules de myosine.

## 2. Le mécanisme de la contraction musculaire

Le passage du sarcomère au repos au sarcomère contracté se reconnaît par le raccourcissement de la zone H, la diminution de la longueur du sarcomère et la réduction de la bande claire. Le support précise que la bande sombre reste constante et que la longueur de l’actine comme celle de la myosine ne change pas.

> **Attention :** la contraction ne correspond donc pas à un raccourcissement des filaments eux-mêmes. Elle résulte du glissement relatif des filaments fins d’actine le long des filaments épais de myosine.

### Les trois phases décrites par le document

| Phase | Mécanisme |
|---|---|
| Attachement | Le Ca2+ se fixe sur la troponine ; la tropomyosine se déplace, les sites sont démasqués et l’ATP fixé à la tête de myosine permet la formation du pont actomyosine |
| Glissement ou pivotement | L’actine active la myosine qui hydrolyse l’ATP en ADP + Pi + énergie ; la tête de myosine pivote et l’actine glisse |
| Détachement | Une nouvelle molécule d’ATP se fixe sur la tête de myosine et rompt la liaison actomyosine |

Au repos, la tropomyosine masque les sites d’attachement actomyosine. Lorsque le muscle est excité, le **réticulum sarcoplasmique** libère des ions \(Ca^{2+}\). Le calcium se fixe sur la troponine, ce qui déplace la tropomyosine et rend les sites accessibles. La tête de myosine s’attache alors à l’actine.

$$
\text{ATP} \rightarrow \text{ADP} + P_i + \text{énergie}
$$

L’énergie ainsi libérée permet le pivotement de la tête de myosine. La zone H et le sarcomère diminuent : le muscle se contracte. Le relâchement survient lorsque les ions \(Ca^{2+}\) sont réabsorbés et que les ponts actomyosine se détachent.

> **Définition : pont actomyosine.** Liaison établie entre une tête de myosine et l’actine pendant la phase d’attachement.  
> **Définition : réticulum sarcoplasmique.** Structure citée par le support comme réserve et source de libération des ions \(Ca^{2+}\) lors de l’excitation.

## 3. Activité électrique et activité mécanique du muscle

L’expérience du cours compare l’enregistrement électrique d’une fibre musculaire et son enregistrement mécanique. Le potentiel de repos musculaire est de \(-85\) mV et varie de \(-85\) à \(-20\) mV pendant le potentiel d’action musculaire. L’**électromyogramme** se situe dans le temps de latence de la secousse et précède toujours le **myogramme**.

| Enregistrement | Ce qu’il met en évidence |
|---|---|
| Électromyogramme | Potentiel d’action musculaire, donc l’activité électrique |
| Myogramme | Réponse mécanique obtenue avec un myographe |
| Secousse musculaire | Temps de latence, phase de contraction, phase de relâchement |

Le potentiel de membrane musculaire est relié à la répartition inégale des ions \(Na^+\) et \(K^+\), maintenue par la pompe ionique \(Na^+/K+\) ATPase. La dépolarisation est associée à l’entrée de sodium et la repolarisation à la sortie de potassium. Le potentiel d’action précède le myogramme car il déclenche la contraction musculaire.

> **Définition : électromyogramme.** Enregistrement de l’activité électrique ou potentiel d’action musculaire.  
> **Définition : myogramme.** Enregistrement de la réponse mécanique d’un muscle réalisé avec un myographe.

## 4. Réponses du muscle aux stimulations

Une deuxième stimulation appliquée après la fin de la première secousse entraîne une deuxième secousse de même amplitude. Lorsqu’elle est appliquée pendant le relâchement, la seconde secousse devient plus grande. Lorsqu’elle intervient pendant la contraction, une seule secousse d’amplitude plus élevée est observée.

| Stimulation successive | Réponse décrite |
|---|---|
| Après la secousse précédente | Deux secousses identiques |
| Pendant le relâchement | Seconde secousse plus grande |
| Pendant la contraction | Une secousse unique d’amplitude plus élevée |
| Stimulations répétées pendant le relâchement | Courbe en dents de scie : tétanos imparfait |
| Stimulations répétées pendant la contraction | Courbe en plateau : tétanos parfait |

L’augmentation d’amplitude est expliquée par la **sommation** des réponses des fibres musculaires. Le muscle obéit à la loi de sommation, tandis que la fibre musculaire obéit à la loi du tout ou rien.

> **Définition : tétanos imparfait.** Fusion incomplète des réponses musculaires, représentée par une courbe en dents de scie.  
> **Définition : tétanos parfait.** Fusion complète des réponses musculaires, représentée par un plateau.

Le support traite également de la fatigue musculaire. La secousse d’un muscle fatigué présente une amplitude plus faible et des durées de contraction et de relâchement plus longues. La fatigue musculaire est associée dans le document aux crampes et aux douleurs musculaires.

## 5. L’énergie nécessaire : ATP et régénération

Le tableau du document compare le muscle au repos et le muscle en activité. En activité, les quantités d’oxygène, de dioxyde de carbone et d’acide lactique augmentent, tandis que le glycogène diminue. La quantité d’ATP reste constante car elle est régénérée ou renouvelée.

| Voie de régénération indiquée | Transformation donnée dans le PDF |
|---|---|
| Voie de la myokinase | \(2\,ADP \rightarrow ATP + AMP\) |
| Voie de la phosphocréatinase | \(ADP + phosphocréatine \rightarrow ATP + créatine\) |
| Fermentation lactique | Voie anaérobie après glycolyse, dans le hyaloplasme |
| Respiration cellulaire | Voie aérobie dans la mitochondrie, avec production de CO2 et d’eau |

La voie lente débute par la glycolyse : le glucose produit deux acides pyruviques. Les acides pyruviques peuvent rester dans le hyaloplasme pour la fermentation lactique en absence d’oxygène ou entrer dans la mitochondrie pour la respiration cellulaire en présence d’oxygène.

$$
C_6H_{12}O_6 + 6O_2 \rightarrow 6CO_2 + 6H_2O + 38\,ATP
$$

> **Définition : ATP.** Molécule dont l’hydrolyse fournit l’énergie nécessaire au mécanisme de contraction et qui est continuellement régénérée.  
> **Définition : phosphocréatine.** Molécule citée dans une voie rapide de régénération de l’ATP.

> **Synthèse :** le muscle strié squelettique est organisé en fibres, myofibrilles et sarcomères contenant actine et myosine. Sa contraction dépend de la libération du Ca2+, de la formation des ponts actomyosine et de l’hydrolyse de l’ATP. Elle est précédée d’un potentiel d’action, peut présenter sommation et tétanos en réponse aux stimulations, et utilise une énergie biochimique dont l’ATP est régénéré par des voies rapides et lentes.

## Référence pédagogique

Contenu reformulé, structuré et approfondi à partir du PDF fourni : **« Le fonctionnement du muscle strié squelettique »**, SVT, Terminale D, Côte d’Ivoire — École numérique.
$lesson_content$,
      is_active=false
  where id=target.lesson_id and coalesce(btrim(content),'')='';

  exercise_a_uuid := null;
  insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
  select target.subject_id,target.level_id,target.series_id,target.chapter_id,target.lesson_id,'Exercice 1 — Sarcomère et mécanisme de contraction','Reliez les structures du sarcomère aux trois phases de la contraction musculaire et au rôle du calcium et de l’ATP.','La correction distingue la structure des filaments, l’attachement actomyosine, le glissement lié à l’hydrolyse de l’ATP et le détachement.','single_choice','easy','## Consigne

Répondez en utilisant le vocabulaire exact du cours.','## Correction

Relisez les définitions, tableaux et mécanismes correspondants dans la leçon.',false,false,20,10
  where not exists (select 1 from public.exercises e where e.lesson_id=target.lesson_id and e.title='Exercice 1 — Sarcomère et mécanisme de contraction')
  returning id into exercise_a_uuid;
  if exercise_a_uuid is not null then
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
      (exercise_a_uuid,'single_choice','Comment appelle-t-on la portion de myofibrille comprise entre deux stries Z ?',jsonb_build_array('Le sarcomère', 'Le bouton synaptique', 'Le périnèvre', 'Le plasmocyte'),jsonb_build_array('Le sarcomère'),'Le sarcomère est la portion comprise entre deux stries Z consécutives dans la fibre musculaire striée.',10),
      (exercise_a_uuid,'single_choice','Quel ion libéré par le réticulum sarcoplasmique se fixe sur la troponine lors de l’excitation ?',jsonb_build_array('Ca2+', 'Na+', 'K+', 'Cl−'),jsonb_build_array('Ca2+'),'Les ions Ca2+ libérés par le réticulum se fixent sur la troponine et permettent le démasquage des sites d’attachement.',20),
      (exercise_a_uuid,'true_false','Pendant la contraction, la longueur des filaments d’actine et de myosine diminue.',jsonb_build_array('Vrai', 'Faux'),jsonb_build_array('Faux'),'Le document précise que la longueur de l’actine et de la myosine ne change pas ; leur glissement réduit la zone H et le sarcomère.',30);
  end if;

  exercise_b_uuid := null;
  insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
  select target.subject_id,target.level_id,target.series_id,target.chapter_id,target.lesson_id,'Exercice 2 — Stimulations et énergie musculaire','Interprétez les réponses du muscle aux stimulations successives et identifiez les voies de régénération de l’ATP citées dans le support.','La correction distingue sommation, tétanos imparfait, tétanos parfait, puis relie l’ATP aux voies myokinase, phosphocréatinase, fermentation et respiration.','single_choice','medium','## Consigne

Analysez chaque proposition puis justifiez-la par une notion précise du cours.','## Correction

La correction relie chaque réponse aux mécanismes étudiés dans la leçon.',false,false,25,20
  where not exists (select 1 from public.exercises e where e.lesson_id=target.lesson_id and e.title='Exercice 2 — Stimulations et énergie musculaire')
  returning id into exercise_b_uuid;
  if exercise_b_uuid is not null then
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
      (exercise_b_uuid,'single_choice','Quelle réponse est obtenue lorsque des stimulations répétées sont appliquées pendant le relâchement des secousses précédentes ?',jsonb_build_array('Un tétanos imparfait en dents de scie', 'Un tétanos parfait en plateau', 'Aucune réponse', 'Une synapse inhibitrice'),jsonb_build_array('Un tétanos imparfait en dents de scie'),'Le support associe les stimulations répétées pendant le relâchement à une courbe en dents de scie, appelée tétanos imparfait.',10),
      (exercise_b_uuid,'single_choice','Quelle voie rapide est associée à la transformation 2 ADP en ATP et AMP ?',jsonb_build_array('La myokinase', 'La glycolyse', 'Le cycle de Krebs', 'La phagocytose'),jsonb_build_array('La myokinase'),'Le PDF donne l’équation 2 ADP → ATP + AMP pour la voie de la myokinase.',20),
      (exercise_b_uuid,'true_false','La quantité d’ATP reste constante dans le tableau du cours parce qu’elle est régénérée ou renouvelée.',jsonb_build_array('Vrai', 'Faux'),jsonb_build_array('Vrai'),'Le document explique que l’ATP utilisée est continuellement régénérée, ce qui maintient sa quantité observée.',30);
  end if;

  quiz_uuid := null;
  insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active)
  select target.subject_id,target.level_id,target.series_id,target.offering_id,target.chapter_id,target.lesson_id,'Quiz de révision — Muscle strié squelettique','Vérifiez la maîtrise du vocabulaire, des mécanismes et de la synthèse de la leçon.','medium',12,10,false,false
  where not exists (select 1 from public.quizzes q where q.lesson_id=target.lesson_id and q.title='Quiz de révision — Muscle strié squelettique')
  returning id into quiz_uuid;
  if quiz_uuid is not null then
    with inserted_questions as (
      insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
        (quiz_uuid,'Quel phénomène électrique précède toujours le myogramme selon le document ?','L’électromyogramme ou potentiel d’action musculaire précède le myogramme et déclenche la contraction.','single_choice',10,1,true),
        (quiz_uuid,'Comment nomme-t-on la fusion complète des réponses musculaires donnant une courbe en plateau ?','Le document appelle tétanos parfait la fusion complète des réponses, représentée par un plateau.','single_choice',20,1,true),
        (quiz_uuid,'Quelle molécule est hydrolysée pour fournir l’énergie de pivotement de la tête de myosine ?','L’hydrolyse de l’ATP fournit l’énergie nécessaire au pivotement de la tête de myosine et au glissement des filaments.','single_choice',30,1,true),
        (quiz_uuid,'Quelle voie lente se déroule en présence d’oxygène dans la mitochondrie selon le support ?','La respiration cellulaire est la voie aérobie présentée dans la mitochondrie avec production de CO2, d’eau et d’ATP.','single_choice',40,1,true)
      returning id,display_order
    )
    insert into public.quiz_answers (question_id,answer,is_correct,display_order)
    select inserted_questions.id,answers.answer,answers.is_correct,answers.display_order
    from inserted_questions
    join (values
        (10,'Le potentiel d’action musculaire',true,10),
        (10,'Le tétanos imparfait',false,20),
        (20,'Le tétanos parfait',true,10),
        (20,'Le réflexe conditionnel',false,20),
        (30,'L’ATP',true,10),
        (30,'Le glycogène directement',false,20),
        (40,'La respiration cellulaire',true,10),
        (40,'La fermentation lactique',false,20)
    ) as answers(question_order,answer,is_correct,display_order)
      on answers.question_order=inserted_questions.display_order;
  end if;
end;
$svt_terminal_d_lot1$;
