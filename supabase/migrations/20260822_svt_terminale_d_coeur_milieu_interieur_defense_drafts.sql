-- Brouillons SVT Terminale D : fonctionnement du cœur, maintien du milieu intérieur et défense de l’organisme.
-- Les trois structures officielles sont confirmées, vides, inactives et sans activité avant cette migration.
-- Toutes les ressources créées restent inactives et non publiées ; toute leçon déjà remplie annule la migration.
do $svt_terminal_d_lot2$
declare
  target record;
  exercise_a_uuid uuid;
  exercise_b_uuid uuid;
  quiz_uuid uuid;
  lesson_count integer;
begin
  select count(*) into lesson_count
  from public.lessons
  where id in ('bc4eeecc-6dd3-457a-8ee2-51e191892891', '917453a3-abdc-4991-8db5-94a37d4ba2de', '45fd2641-0833-4279-819c-6ef572b6b40e');
  if lesson_count <> 3 then
    raise exception 'Les trois leçons SVT Terminale D attendues sont requises avant remplissage ; transaction annulée.';
  end if;

  select l.id as lesson_id,c.id as chapter_id,o.id as offering_id,o.subject_id,o.level_id,o.series_id into target
  from public.lessons l
  join public.chapters c on c.id=l.chapter_id
  join public.course_subject_offerings o on o.id=c.subject_offering_id
  where l.id='bc4eeecc-6dd3-457a-8ee2-51e191892891';
  if target.lesson_id is null then raise exception 'Leçon cible % introuvable.', 'bc4eeecc-6dd3-457a-8ee2-51e191892891'; end if;
  if exists (select 1 from public.lessons where id=target.lesson_id and coalesce(btrim(content),'') <> '') then
    raise exception 'La leçon SVT Terminale D % contient déjà un cours : écrasement interdit.', target.lesson_id;
  end if;
  update public.lessons
  set description='Automatisme cardiaque, cycle cardiaque, contrôle nerveux et médiateurs chimiques de l’activité du cœur.',
      content=$lesson_content$
## Le fonctionnement du cœur

> **Objectif :** expliquer l’automatisme du cœur, interpréter les phénomènes mécaniques et électriques du cycle cardiaque, puis distinguer les influences nerveuses et chimiques qui modulent son activité.

## 1. Le cœur bat-il de manière autonome ?

Le point de départ du document est l’observation d’un cœur isolé de batracien qui continue de battre dans un milieu de culture. Cette observation conduit à distinguer ce qui **produit spontanément le rythme cardiaque** de ce qui peut seulement le modifier.

Les expériences données dans le PDF sont déterminantes. Chez une grenouille décérébrée et démédullée, le cœur bat encore malgré la destruction des centres nerveux. Lorsqu’il est isolé après section des vaisseaux et placé dans une solution de Ringer, il continue également de battre. Le fonctionnement cardiaque ne dépend donc pas, pour son déclenchement initial, d’un ordre nerveux permanent ou de l’arrivée du sang.

> **Définition : automatisme cardiaque.** Capacité du cœur à produire spontanément et rythmiquement son activité.

### Le tissu nodal, centre de l’automatisme

Le PDF montre qu’un cœur isolé de mammifère cesse de battre lorsque son **tissu nodal** est détruit. Ce tissu comprend le nœud sinusal, le nœud septal, le faisceau de His et le réseau de Purkinje. Une section du faisceau de His conserve un rythme normal des oreillettes mais donne un rythme anormal aux ventricules : la coordination du message dans le cœur est donc perturbée.

| Structure du tissu nodal | Rôle présenté dans le document |
|---|---|
| Nœud sinusal | Lieu où naissent spontanément et rythmiquement les potentiels d’action ; il impose son rythme au myocarde |
| Myocarde auriculaire | Reçoit le message issu du nœud sinusal et provoque la contraction des oreillettes |
| Nœud septal | Relais du message vers les ventricules |
| Faisceau de His et réseau de Purkinje | Permettent la propagation vers le myocarde ventriculaire et la contraction des ventricules |

> **Définition : pacemaker du cœur.** Nom donné au nœud sinusal parce qu’il impose son rythme au myocarde.

Le nœud sinusal présente un **prépotentiel**, c’est-à-dire une dépolarisation lente qui précède le potentiel d’action suivant. Le PDF l’explique par une faible sortie de \(K^+\). La dépolarisation est liée à une entrée importante de \(Ca^{2+}\), tandis que la repolarisation correspond à une sortie importante de \(K^+\). Ce mécanisme assure la répétition de l’activité cardiaque.

> **Attention :** le tissu nodal déclenche le rythme, mais le myocarde réalise la contraction. Il ne faut pas confondre le lieu de naissance du potentiel d’action et le muscle qui se contracte.

## 2. Les phénomènes du cycle cardiaque

L’activité mécanique peut être enregistrée par un **cardiographe à balancier**. Le tracé obtenu est un **cardiogramme**. Le document distingue l’activité des oreillettes et celle des ventricules.

| Phase du cardiogramme | Sens physiologique |
|---|---|
| AB | Contraction des oreillettes : systole auriculaire |
| BC | Relâchement des oreillettes : diastole auriculaire |
| CD | Contraction des ventricules : systole ventriculaire |
| DE | Relâchement général du muscle cardiaque : diastole générale |

L’enchaînement systole auriculaire, diastole auriculaire, systole ventriculaire et diastole générale constitue une **révolution cardiaque** ou **cycle cardiaque**.

L’activité électrique est enregistrée par un électrocardiographe ; le tracé est un **électrocardiogramme (ECG)**. Les ondes du document sont notées P, QRS et T.

| Repère de l’ECG | Interprétation donnée dans le PDF |
|---|---|
| Onde P | Dépolarisation des oreillettes ; elle précède leur systole |
| Intervalle PQ | Conduction du courant de dépolarisation dans la zone auriculo-ventriculaire |
| Complexe QRS | Dépolarisation des ventricules ; il précède leur systole |
| Onde T | Repolarisation des ventricules ; elle accompagne la diastole générale |

> **Méthode : relier ECG et cardiogramme.** Identifiez d’abord la dépolarisation, puis associez-la à la contraction qui suit. L’onde électrique précède donc le phénomène mécanique correspondant.

## 3. Comment le système nerveux module-t-il le rythme ?

Le cœur est autonome, mais le PDF montre qu’il est influencé par des nerfs antagonistes.

| Action expérimentale | Effet observé | Déduction |
|---|---|---|
| Stimulation des nerfs parasympathiques, aussi appelés nerfs X ou vagues | Ralentissement puis possible arrêt en diastole, suivi d’un échappement | Les influx parasympathiques sont modérateurs ; ils entraînent une bradycardie |
| Section des nerfs parasympathiques | Accélération du rythme | L’effet modérateur habituel est supprimé |
| Stimulation des nerfs orthosympathiques | Accélération du rythme | Les influx orthosympathiques sont accélérateurs ; ils entraînent une tachycardie |
| Section des nerfs orthosympathiques | Diminution du rythme | L’effet accélérateur habituel est supprimé |

> **Définition : bradycardie.** Diminution du rythme cardiaque.  
> **Définition : tachycardie.** Augmentation du rythme cardiaque.

Les nerfs sino-aortiques de Héring et de Cyon transmettent des informations des barorécepteurs vers le centre cardio-vasculaire. Les **barorécepteurs** sont des récepteurs sensibles à une variation de pression artérielle ; le PDF les place dans la crosse aortique et le sinus carotidien.

Quand le rythme et la pression artérielle augmentent, les barorécepteurs sont excités. L’information est transmise au centre cardio-vasculaire, qui inhibe les centres cardio-accélérateurs et active les centres cardio-modérateurs. Les influx modérateurs parviennent au cœur par les nerfs parasympathiques, ce qui ramène la pression vers la normale. Lorsque le rythme est faible, le mécanisme inverse intervient.

## 4. Le rôle des substances chimiques

L’expérience de Loewi relie deux cœurs de grenouille par un raccord rempli de liquide physiologique. Lorsque le nerf vague du cœur A est excité jusqu’à l’arrêt des battements, le cœur B finit aussi par s’arrêter. Lorsque le nerf orthosympathique du cœur A est excité, les rythmes des deux cœurs s’accélèrent. Le message transmis n’est donc pas seulement nerveux : une substance passe dans le liquide.

> **Définition : médiateur chimique ou neuromédiateur.** Substance sécrétée au niveau des terminaisons nerveuses, déversée dans les fentes synaptiques pour transmettre l’influx nerveux, puis détruite par des enzymes spécifiques.

| Substance citée | Effet sur le nœud sinusal |
|---|---|
| Acétylcholine (ACH) | Inhibe l’activité du nœud sinusal : effet cardiomodérateur |
| Adrénaline ou noradrénaline (ADR/NorADR) | Stimule l’activité du nœud sinusal : effet cardioaccélérateur |

L’atropine inhibe l’action des substances libérées par les nerfs vagues ; l’ergotoxine inhibe l’effet des substances orthosympathiques. Le phénomène d’échappement est relié dans le PDF à la destruction de l’acétylcholine par l’acétylcholinestérase.

> **Synthèse :** le cœur possède un automatisme assuré par le tissu nodal et piloté par le nœud sinusal. Son cycle comporte des phénomènes mécaniques et électriques repérables sur cardiogramme et ECG. Le système nerveux et des neuromédiateurs ne créent pas l’automatisme, mais en modulent le rythme : les voies parasympathiques et l’acétylcholine ralentissent ; les voies orthosympathiques et l’adrénaline accélèrent.

## Référence pédagogique

Contenu reformulé, structuré et approfondi à partir du PDF fourni : **« Le fonctionnement du cœur »**, SVT, Terminale D, Côte d’Ivoire — École numérique.
$lesson_content$,
      is_active=false
  where id=target.lesson_id and coalesce(btrim(content),'')='';

  exercise_a_uuid := null;
  insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
  select target.subject_id,target.level_id,target.series_id,target.chapter_id,target.lesson_id,'Exercice 1 — Tissu nodal et cycle cardiaque','Identifiez le siège de l’automatisme cardiaque et reliez les ondes de l’ECG aux phases du cycle cardiaque.','La correction distingue le nœud sinusal, le tissu nodal, la systole auriculaire, la systole ventriculaire et la diastole générale.','single_choice','easy','## Consigne

Répondez en utilisant le vocabulaire exact du cours.','## Correction

Relisez les définitions, tableaux et mécanismes correspondants dans la leçon.',false,false,20,10
  where not exists (select 1 from public.exercises e where e.lesson_id=target.lesson_id and e.title='Exercice 1 — Tissu nodal et cycle cardiaque')
  returning id into exercise_a_uuid;
  if exercise_a_uuid is not null then
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
      (exercise_a_uuid,'single_choice','Quelle structure est appelée pacemaker du cœur dans le document ?',jsonb_build_array('Le nœud sinusal', 'Le faisceau de His', 'Le ventricule gauche', 'Le nerf de Cyon'),jsonb_build_array('Le nœud sinusal'),'Le nœud sinusal impose son rythme au myocarde ; le support le présente comme le pacemaker du cœur.',10),
      (exercise_a_uuid,'single_choice','À quel phénomène correspond le complexe QRS de l’ECG ?',jsonb_build_array('La dépolarisation des ventricules', 'La repolarisation des oreillettes', 'La diastole auriculaire', 'La digestion des médiateurs'),jsonb_build_array('La dépolarisation des ventricules'),'Le complexe QRS précède la systole ventriculaire car il correspond à la dépolarisation des ventricules.',20),
      (exercise_a_uuid,'true_false','La destruction du tissu nodal d’un cœur isolé provoque l’arrêt de ses battements.',jsonb_build_array('Vrai', 'Faux'),jsonb_build_array('Vrai'),'Le PDF utilise cette expérience pour montrer que le tissu nodal est le siège de l’automatisme cardiaque.',30);
  end if;

  exercise_b_uuid := null;
  insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
  select target.subject_id,target.level_id,target.series_id,target.chapter_id,target.lesson_id,'Exercice 2 — Contrôles nerveux et chimiques','Interprétez les effets antagonistes des nerfs cardiaques et expliquez l’expérience de Loewi avec les médiateurs chimiques cités.','La correction oppose les influences parasympathiques et orthosympathiques puis relie l’acétylcholine au ralentissement et l’adrénaline à l’accélération.','single_choice','medium','## Consigne

Analysez chaque proposition puis justifiez-la par une notion précise du cours.','## Correction

La correction relie chaque réponse aux mécanismes étudiés dans la leçon.',false,false,25,20
  where not exists (select 1 from public.exercises e where e.lesson_id=target.lesson_id and e.title='Exercice 2 — Contrôles nerveux et chimiques')
  returning id into exercise_b_uuid;
  if exercise_b_uuid is not null then
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
      (exercise_b_uuid,'single_choice','Quel effet provoque la stimulation des nerfs parasympathiques sur le rythme cardiaque ?',jsonb_build_array('Un ralentissement du rythme', 'Une accélération durable', 'L’arrêt définitif de l’automatisme', 'Aucun effet'),jsonb_build_array('Un ralentissement du rythme'),'Les fibres parasympathiques transmettent des influx modérateurs qui diminuent le rythme cardiaque.',10),
      (exercise_b_uuid,'single_choice','Quelle substance est cardiomodératrice selon le support ?',jsonb_build_array('L’acétylcholine', 'L’adrénaline', 'La rénine', 'Le sodium'),jsonb_build_array('L’acétylcholine'),'La perfusion d’acétylcholine ralentit l’activité du nœud sinusal ; elle est donc cardiomodératrice.',20),
      (exercise_b_uuid,'true_false','Les nerfs de Héring et de Cyon sont décrits comme des nerfs sensitifs.',jsonb_build_array('Vrai', 'Faux'),jsonb_build_array('Vrai'),'Ils transmettent l’information des barorécepteurs vers les centres nerveux cardio-vasculaires.',30);
  end if;

  quiz_uuid := null;
  insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active)
  select target.subject_id,target.level_id,target.series_id,target.offering_id,target.chapter_id,target.lesson_id,'Quiz de révision — Fonctionnement du cœur','Vérifiez la maîtrise du vocabulaire, des mécanismes et de la synthèse de la leçon.','medium',12,10,false,false
  where not exists (select 1 from public.quizzes q where q.lesson_id=target.lesson_id and q.title='Quiz de révision — Fonctionnement du cœur')
  returning id into quiz_uuid;
  if quiz_uuid is not null then
    with inserted_questions as (
      insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
        (quiz_uuid,'Quel tissu particulier est le siège de l’automatisme cardiaque ?','Le tissu nodal est présenté comme le siège de l’automatisme du cœur.','single_choice',10,1,true),
        (quiz_uuid,'Quelle phase correspond au relâchement général du muscle cardiaque ?','Le cardiogramme associe la diastole générale au relâchement général du muscle cardiaque.','single_choice',20,1,true),
        (quiz_uuid,'Quel système nerveux accélère le rythme cardiaque dans le document ?','Les nerfs orthosympathiques transmettent des influx accélérateurs.','single_choice',30,1,true),
        (quiz_uuid,'Quel médiateur stimule l’activité du nœud sinusal ?','L’adrénaline ou noradrénaline est cardioaccélératrice dans le support.','single_choice',40,1,true)
      returning id,display_order
    )
    insert into public.quiz_answers (question_id,answer,is_correct,display_order)
    select inserted_questions.id,answers.answer,answers.is_correct,answers.display_order
    from inserted_questions
    join (values
        (10,'Le tissu nodal',true,10),
        (10,'Le tissu osseux',false,20),
        (20,'La diastole générale',true,10),
        (20,'La systole ventriculaire',false,20),
        (30,'Le système orthosympathique',true,10),
        (30,'Le système parasympathique',false,20),
        (40,'L’adrénaline',true,10),
        (40,'L’acétylcholine',false,20)
    ) as answers(question_order,answer,is_correct,display_order)
      on answers.question_order=inserted_questions.display_order;
  end if;

  select l.id as lesson_id,c.id as chapter_id,o.id as offering_id,o.subject_id,o.level_id,o.series_id into target
  from public.lessons l
  join public.chapters c on c.id=l.chapter_id
  join public.course_subject_offerings o on o.id=c.subject_offering_id
  where l.id='917453a3-abdc-4991-8db5-94a37d4ba2de';
  if target.lesson_id is null then raise exception 'Leçon cible % introuvable.', '917453a3-abdc-4991-8db5-94a37d4ba2de'; end if;
  if exists (select 1 from public.lessons where id=target.lesson_id and coalesce(btrim(content),'') <> '') then
    raise exception 'La leçon SVT Terminale D % contient déjà un cours : écrasement interdit.', target.lesson_id;
  end if;
  update public.lessons
  set description='Structure et fonctions du rein, formation de l’urine, régulations de l’eau, du sodium et du pH dans le maintien du milieu intérieur.',
      content=$lesson_content$
## Le maintien de la constance du milieu intérieur

> **Objectif :** montrer comment le rein, grâce à sa structure, à la formation de l’urine et à la régulation de certains constituants, contribue au maintien de la constance du milieu intérieur.

## 1. Le milieu intérieur et l’homéostasie

Le document présente le milieu intérieur comme le milieu dans lequel baignent les cellules des animaux supérieurs. Elles y prélèvent ce dont elles ont besoin et y rejettent leurs déchets. La constance de ce milieu ne signifie pas qu’il est immobile : elle correspond à un **équilibre dynamique** maintenu malgré les variations.

> **Définition : homéostasie.** Ensemble des régulations qui tendent à maintenir l’équilibre dynamique du milieu intérieur, notamment pour l’eau, le sodium, la pression osmotique et le pH.

Le rein contribue à cette constance par sa structure, par les fonctions du néphron et par la régulation de constituants tels que l’eau et le sodium.

## 2. La structure qui permet la formation et l’évacuation de l’urine

La coupe longitudinale du rein présentée dans le PDF montre une capsule fibreuse, une zone corticale ou cortex, des pyramides de Malpighi, un bassinet et un uretère. Le bassinet recueille l’urine définitive ; l’uretère l’achemine vers la vessie.

| Niveau d’organisation | Éléments du document |
|---|---|
| Rein | Capsule fibreuse, cortex, zone médullaire, pyramides de Malpighi, bassinet, uretère |
| Néphron | Corpuscule de Malpighi et tubes urinaires |
| Corpuscule de Malpighi | Capsule de Bowman et glomérule |
| Tubes urinaires | Tube proximal, anse de Henlé, tube distal et tube collecteur de Bellini |

> **Définition : néphron.** Unité structurale et fonctionnelle du rein.

Le support distingue la partie périphérique, le cortex, et la partie centrale, la médulla. Les néphrons sont associés aux pyramides de Malpighi et leurs tubes collecteurs amènent l’urine vers le bassinet.

## 3. Les quatre fonctions du néphron

La comparaison entre plasma, urine primitive et urine définitive permet de suivre la formation de l’urine. Le PDF donne quatre étapes liées : filtration glomérulaire, réabsorption, sécrétion tubulaire et excrétion.

| Fonction | Lieu et rôle décrits dans le PDF |
|---|---|
| Filtration glomérulaire | Au niveau du glomérule ; le filtrat produit est l’urine primitive |
| Réabsorption | Dans les tubules ; retour de certaines substances vers le plasma, total ou partiel, actif ou passif |
| Sécrétion tubulaire | Dans les tubules ; passage de substances vers l’urine, notamment acide hippurique et ammoniaque cités dans le support |
| Excrétion | Élimination de l’eau et de substances minérales ou de déchets dans l’urine définitive |

Le rein est un **filtre sélectif**. Les protéines, les lipides et le glucose sont présents dans le plasma mais absents de l’urine définitive dans les tableaux du document. Le glucose peut devenir éliminé lorsque son seuil est dépassé : il est cité comme **substance à seuil**.

> **Définition : urine primitive.** Filtrat obtenu à la suite de la filtration glomérulaire.  
> **Définition : réabsorption.** Retour de certaines substances du tubule vers le plasma.  
> **Définition : substance à seuil.** Substance qui est éliminée dans l’urine définitive au-delà d’une certaine valeur.

## 4. La régulation de l’eau : volémie, pression osmotique et ADH

Après ingestion d’eau, le document indique que la volémie augmente, le plasma se dilue et la pression osmotique diminue. Les volorécepteurs ou tensiorécepteurs et les osmorécepteurs sont alors faiblement stimulés. L’information est relayée vers la posthypophyse, qui diminue la sécrétion d’**ADH**, hormone antidiurétique.

| Situation | Chaîne de régulation décrite |
|---|---|
| Ingestion importante d’eau | Volémie augmente → pression osmotique baisse → ADH diminue → réabsorption d’eau diminue → diurèse augmente |
| Perte abondante d’eau | Volémie diminue et pression osmotique augmente → ADH augmente → réabsorption d’eau augmente → diurèse diminue |

> **Définition : diurèse.** Volume d’urine éliminé pendant une durée donnée.  
> **Définition : polyurie.** Élimination abondante d’une urine moins concentrée.  
> **Définition : oligurie.** Élimination faible d’une urine concentrée.

Le mécanisme permet de ramener la volémie vers sa valeur normale. Le document relie l’ADH à la réabsorption de l’eau dans les tubules rénaux.

## 5. La régulation du sodium et le pH

Le support décrit la régulation du sodium par le système rénine-angiotensine et l’aldostérone. Lorsque la teneur en \(Na^+\) du plasma augmente, la production de rénine est faible. La production d’angiotensine, puis la stimulation de la corticosurrénale et la sécrétion d’aldostérone sont faibles. La réabsorption de sodium diminue, son élimination urinaire augmente et la pression osmotique revient vers la normale.

| Élément | Rôle donné par le document |
|---|---|
| Rénine | Produite au niveau des reins ; intervient dans le système rénine-angiotensine |
| Angiotensinogène | Produit par le foie ; précurseur de l’angiotensine |
| Angiotensine | Stimule la corticosurrénale |
| Aldostérone | Produite par la corticosurrénale ; stimule la réabsorption de sodium dans les tubules rénaux |

Le pH plasmatique est également régulé par les poumons et les reins. En cas d’acidose, \(pH < 7{,}4\), le PDF indique une augmentation de l’élimination de \(CO_2\) par les poumons et de \(H^+\) par les reins. En cas d’alcalose, \(pH > 7{,}4\), l’élimination de \(CO_2\) diminue et les ions bicarbonates sont éliminés.

$$
CO_2 + H_2O \rightleftharpoons H_2CO_3 \rightleftharpoons HCO_3^- + H^+
$$

> **Synthèse :** le rein maintient le milieu intérieur constant grâce au néphron. Celui-ci filtre, réabsorbe, sécrète et excrète. L’ADH module la réabsorption d’eau et donc la diurèse. Le système rénine-angiotensine-aldostérone module la réabsorption du sodium. Avec les poumons, les reins participent aussi au maintien du pH.

## Référence pédagogique

Contenu reformulé, structuré et approfondi à partir du PDF fourni : **« Le maintien de la constance du milieu intérieur »**, SVT, Terminale D, Côte d’Ivoire — Mon École à la Maison.
$lesson_content$,
      is_active=false
  where id=target.lesson_id and coalesce(btrim(content),'')='';

  exercise_a_uuid := null;
  insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
  select target.subject_id,target.level_id,target.series_id,target.chapter_id,target.lesson_id,'Exercice 1 — Néphron et formation de l’urine','Identifiez les constituants du néphron puis associez filtration, réabsorption, sécrétion et excrétion aux mécanismes de formation de l’urine.','La correction distingue le corpuscule de Malpighi, les tubes urinaires, le filtrat glomérulaire et les quatre fonctions du néphron.','single_choice','easy','## Consigne

Répondez en utilisant le vocabulaire exact du cours.','## Correction

Relisez les définitions, tableaux et mécanismes correspondants dans la leçon.',false,false,20,10
  where not exists (select 1 from public.exercises e where e.lesson_id=target.lesson_id and e.title='Exercice 1 — Néphron et formation de l’urine')
  returning id into exercise_a_uuid;
  if exercise_a_uuid is not null then
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
      (exercise_a_uuid,'single_choice','Quelle structure est l’unité fonctionnelle du rein ?',jsonb_build_array('Le néphron', 'Le neurone', 'Le sarcomère', 'Le ganglion'),jsonb_build_array('Le néphron'),'Le document définit le néphron comme l’unité structurale et fonctionnelle du rein.',10),
      (exercise_a_uuid,'single_choice','Où se déroule la filtration glomérulaire selon le support ?',jsonb_build_array('Au niveau du glomérule', 'Dans le bassinet', 'Dans l’uretère', 'Dans la corticosurrénale'),jsonb_build_array('Au niveau du glomérule'),'La filtration du plasma par le rein se fait au niveau du glomérule du néphron.',20),
      (exercise_a_uuid,'true_false','L’urine primitive est le filtrat obtenu à la suite de la filtration glomérulaire.',jsonb_build_array('Vrai', 'Faux'),jsonb_build_array('Vrai'),'Le PDF nomme filtrat glomérulaire ou urine primitive le produit de la filtration au glomérule.',30);
  end if;

  exercise_b_uuid := null;
  insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
  select target.subject_id,target.level_id,target.series_id,target.chapter_id,target.lesson_id,'Exercice 2 — Régulations de l’eau et du sodium','Interprétez les chaînes de régulation de l’eau et du sodium en utilisant la volémie, la pression osmotique, l’ADH et l’aldostérone.','La correction relie une baisse d’ADH à une augmentation de diurèse et une faible aldostérone à une faible réabsorption de sodium.','single_choice','medium','## Consigne

Analysez chaque proposition puis justifiez-la par une notion précise du cours.','## Correction

La correction relie chaque réponse aux mécanismes étudiés dans la leçon.',false,false,25,20
  where not exists (select 1 from public.exercises e where e.lesson_id=target.lesson_id and e.title='Exercice 2 — Régulations de l’eau et du sodium')
  returning id into exercise_b_uuid;
  if exercise_b_uuid is not null then
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
      (exercise_b_uuid,'single_choice','Après une ingestion importante d’eau, quel effet du document est attendu sur l’ADH ?',jsonb_build_array('Sa sécrétion diminue', 'Sa sécrétion augmente toujours', 'Elle est remplacée par l’adrénaline', 'Elle ne joue aucun rôle'),jsonb_build_array('Sa sécrétion diminue'),'La dilution du plasma et la baisse de pression osmotique diminuent la sécrétion d’ADH selon le PDF.',10),
      (exercise_b_uuid,'single_choice','Quelle hormone stimule la réabsorption de sodium dans les tubules rénaux ?',jsonb_build_array('L’aldostérone', 'L’acétylcholine', 'La perforine', 'Le lysozyme'),jsonb_build_array('L’aldostérone'),'Le support attribue à l’aldostérone, produite par la corticosurrénale, la stimulation de la réabsorption du sodium.',20),
      (exercise_b_uuid,'true_false','La polyurie correspond à une élimination abondante d’une urine moins concentrée.',jsonb_build_array('Vrai', 'Faux'),jsonb_build_array('Vrai'),'Le document emploie polyurie lorsque la diurèse augmente et que l’urine éliminée est moins concentrée.',30);
  end if;

  quiz_uuid := null;
  insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active)
  select target.subject_id,target.level_id,target.series_id,target.offering_id,target.chapter_id,target.lesson_id,'Quiz de révision — Milieu intérieur et rein','Vérifiez la maîtrise du vocabulaire, des mécanismes et de la synthèse de la leçon.','medium',12,10,false,false
  where not exists (select 1 from public.quizzes q where q.lesson_id=target.lesson_id and q.title='Quiz de révision — Milieu intérieur et rein')
  returning id into quiz_uuid;
  if quiz_uuid is not null then
    with inserted_questions as (
      insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
        (quiz_uuid,'Comment appelle-t-on l’ensemble des régulations qui maintiennent un équilibre dynamique du milieu intérieur ?','Le document définit l’homéostasie comme l’ensemble des régulations du milieu intérieur.','single_choice',10,1,true),
        (quiz_uuid,'Quelle hormone agit sur la réabsorption de l’eau dans les tubules rénaux ?','L’ADH est l’hormone antidiurétique indiquée pour la régulation de l’eau.','single_choice',20,1,true),
        (quiz_uuid,'Quel effet entraîne une forte réabsorption d’eau dans le mécanisme présenté ?','Une forte réabsorption d’eau réduit la diurèse et favorise une urine concentrée.','single_choice',30,1,true),
        (quiz_uuid,'Quel pH est cité dans le document comme valeur normale dans la régulation acido-basique ?','Le support utilise 7,4 comme valeur de référence pour le pH plasmatique.','single_choice',40,1,true)
      returning id,display_order
    )
    insert into public.quiz_answers (question_id,answer,is_correct,display_order)
    select inserted_questions.id,answers.answer,answers.is_correct,answers.display_order
    from inserted_questions
    join (values
        (10,'L’homéostasie',true,10),
        (10,'La phagocytose',false,20),
        (20,'L’ADH',true,10),
        (20,'L’aldostérone uniquement',false,20),
        (30,'Une diminution de la diurèse',true,10),
        (30,'Une augmentation obligatoire de la diurèse',false,20),
        (40,'7,4',true,10),
        (40,'3,5',false,20)
    ) as answers(question_order,answer,is_correct,display_order)
      on answers.question_order=inserted_questions.display_order;
  end if;

  select l.id as lesson_id,c.id as chapter_id,o.id as offering_id,o.subject_id,o.level_id,o.series_id into target
  from public.lessons l
  join public.chapters c on c.id=l.chapter_id
  join public.course_subject_offerings o on o.id=c.subject_offering_id
  where l.id='45fd2641-0833-4279-819c-6ef572b6b40e';
  if target.lesson_id is null then raise exception 'Leçon cible % introuvable.', '45fd2641-0833-4279-819c-6ef572b6b40e'; end if;
  if exists (select 1 from public.lessons where id=target.lesson_id and coalesce(btrim(content),'') <> '') then
    raise exception 'La leçon SVT Terminale D % contient déjà un cours : écrasement interdit.', target.lesson_id;
  end if;
  update public.lessons
  set description='Barrières et réponse inflammatoire, défense spécifique, soi/non-soi, réponses immunitaires humorale et cellulaire.',
      content=$lesson_content$
## Le système de défense de l’organisme

> **Objectif :** distinguer la défense non spécifique de la défense spécifique et expliquer les mécanismes cellulaires et humoraux qui permettent à l’organisme de répondre aux corps étrangers.

## 1. Première ligne : les barrières et la défense non spécifique

Le document part d’une plaie provoquée par une épine. Cette ouverture de la peau rend possible l’entrée de microbes. Pourtant, avant qu’une infection ne s’installe, l’organisme dispose de barrières naturelles.

| Type de barrière | Exemples cités dans le PDF |
|---|---|
| Mécanique | Peau, muqueuses nasales et bronchiques |
| Chimique | Sueur, larmes, mucus nasal, salive contenant du lysozyme, acide gastrique, sécrétions du duodénum, sécrétions vaginales et sperme |
| Biologique | Bactéries non pathogènes du tube digestif qui maintiennent des conditions défavorables à de nombreux microbes |

La réaction locale au point d’entrée associe chaleur, rougeur, douleur, enflure et perte de fonction. C’est la **réaction inflammatoire**.

> **Définition : défense non spécifique.** Défense innée, immédiate et non dirigée contre un antigène déterminé.  
> **Définition : toxine microbienne.** Substance produite par un microbe, ayant un pouvoir pathogène sur l’organisme.

Les premiers acteurs cités sont les polynucléaires, aussi appelés microphages ou granulocytes. Des macrophages, issus de la différenciation des monocytes, renforcent ensuite la lutte. Ces cellules sont des **phagocytes** : elles reconnaissent, englobent puis digèrent des microbes.

| Étape de la phagocytose | Ce que montre le support |
|---|---|
| Adhésion | Le phagocyte se fixe à l’antigène ou à la bactérie |
| Absorption | La membrane enveloppe l’antigène et forme une vésicule de phagocytose |
| Digestion | Les enzymes lytiques inactivent ou détruisent l’antigène |

Lorsque les microbes franchissent la zone infectée, ils peuvent gagner les vaisseaux lymphatiques et les ganglions. Le gonflement douloureux des ganglions est l’**adénite** ; celui des vaisseaux lymphatiques est la **lymphangite**. Si les microbes passent ensuite dans le sang et envahissent tout l’organisme, le document parle de septicémie ; si leurs toxines diffusent sur des voies vitales, il parle de toxémie.

## 2. Défense spécifique : répondre à un antigène déterminé

Les expériences avec l’anatoxine tétanique montrent qu’une souris traitée résiste à la toxine tétanique, mais pas à la toxine diphtérique. La réponse est donc ciblée.

> **Définition : anatoxine.** Toxine microbienne atténuée qui a perdu son pouvoir pathogène tout en conservant son pouvoir antigénique.  
> **Définition : antigène.** Substance dont l’introduction dans l’organisme déclenche une réaction immunitaire.

Le transfert de sérum d’un animal immunisé contre le tétanos peut protéger temporairement un autre animal contre la même toxine. Le support l’interprète comme une **réponse immunitaire à médiation humorale (RIMH)**, dont les effecteurs sont les anticorps.

| Réponse | Supports et effecteurs donnés dans le PDF |
|---|---|
| Médiation humorale | Lymphocytes B différenciés en plasmocytes ; anticorps circulants ou immunoglobulines |
| Médiation cellulaire | Lymphocytes vivants, notamment lymphocytes T cytotoxiques ; destruction par contact des cellules portant l’antigène |

Les anticorps appartiennent au groupe des immunoglobulines, dont le document cite les classes IgA, IgE, IgD, IgG et IgM. Le complexe antigène-anticorps peut activer le complément et conduire à la lyse de bactéries ou d’autres antigènes particulaires.

## 3. Reconnaître le soi et le non-soi

Les expériences de greffe permettent d’aborder la reconnaissance. Le document indique qu’une autogreffe ou une isogreffe peut être intégrée, alors qu’une hétérogreffe ou une homogreffe/allogreffe peut être rejetée.

> **Définition : soi.** Ensemble des molécules propres à l’individu, résultant de l’expression de son génome et comprenant notamment des marqueurs de l’identité biologique.  
> **Définition : non-soi.** Élément non toléré par l’organisme, capable de déclencher une réaction immunitaire.

Le **CMH** ou **HLA** est présenté comme un système de reconnaissance. Le groupe sanguin ABO et le CMH font partie des marqueurs de l’identité biologique. Les macrophages identifient et phagocytent l’antigène, en extraient des déterminants antigéniques ou **épitopes**, puis les présentent aux lymphocytes. Les macrophages et les lymphocytes B peuvent jouer le rôle de cellules présentatrices de l’antigène.

## 4. Les trois phases d’une réponse immunitaire spécifique

Le PDF organise la réponse en trois étapes.

### 4.1. Reconnaissance ou induction

Le macrophage reconnaît le non-soi, le dégrade et présente un déterminant antigénique. Les lymphocytes portant le récepteur spécifique deviennent alors actifs.

### 4.2. Activation, multiplication et différenciation

Les lymphocytes activés se multiplient par mitose dans les organes lymphoïdes périphériques, notamment la rate et les ganglions lymphatiques.

| Type de lymphocyte | Maturation et devenir cités |
|---|---|
| Lymphocyte B | Mature dans la moelle osseuse ; peut devenir plasmocyte producteur d’anticorps ou lymphocyte B mémoire |
| Lymphocyte T | Mature dans le thymus ; peut donner des T mémoire, T régulateurs, T cytotoxiques, lymphocytes à lymphokines et T4 |

### 4.3. Phase effectrice

Dans la réponse cellulaire, les lymphocytes T cytotoxiques agissent au contact des cellules portant l’antigène. Le document décrit la libération de **perforine**, la formation de pores, l’entrée d’eau et l’éclatement de la cellule : c’est la **cytolyse**. Cette réponse est adaptée aux cellules hébergeant des virus ou des parasites intracellulaires.

Dans la réponse humorale, les plasmocytes sécrètent des anticorps. Les anticorps se fixent sur l’antigène et forment un complexe immun qui conduit à sa neutralisation. Cette réponse est présentée comme adaptée aux bactéries extracellulaires et aux molécules libres étrangères, notamment les toxines.

> **Définition : coopération cellulaire.** Collaboration entre macrophages, lymphocytes T et lymphocytes B dans une réponse immunitaire.

> **Synthèse :** l’organisme oppose d’abord une défense innée, immédiate et non spécifique : barrières, inflammation et phagocytose. Si nécessaire, une défense spécifique se met en place après reconnaissance de l’antigène. Les lymphocytes se multiplient et se différencient ; les plasmocytes produisent des anticorps dans la RIMH tandis que les lymphocytes T cytotoxiques détruisent directement les cellules porteuses d’antigènes dans la RIMC.

## Référence pédagogique

Contenu reformulé, structuré et approfondi à partir du PDF fourni : **« Le système de défense de l’organisme »**, SVT, Terminale D, Côte d’Ivoire — Mon École à la Maison.
$lesson_content$,
      is_active=false
  where id=target.lesson_id and coalesce(btrim(content),'')='';

  exercise_a_uuid := null;
  insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
  select target.subject_id,target.level_id,target.series_id,target.chapter_id,target.lesson_id,'Exercice 1 — Défense non spécifique et phagocytose','Distinguez les barrières naturelles, les signes de la réaction inflammatoire et les étapes de la phagocytose.','La correction relie les barrières aux exemples du cours et ordonne adhésion, absorption puis digestion par les enzymes lytiques.','single_choice','easy','## Consigne

Répondez en utilisant le vocabulaire exact du cours.','## Correction

Relisez les définitions, tableaux et mécanismes correspondants dans la leçon.',false,false,20,10
  where not exists (select 1 from public.exercises e where e.lesson_id=target.lesson_id and e.title='Exercice 1 — Défense non spécifique et phagocytose')
  returning id into exercise_a_uuid;
  if exercise_a_uuid is not null then
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
      (exercise_a_uuid,'single_choice','Quel phénomène correspond à la reconnaissance, l’engloutissement puis la digestion de microbes par un phagocyte ?',jsonb_build_array('La phagocytose', 'La systole', 'La réabsorption', 'La cytolyse'),jsonb_build_array('La phagocytose'),'Le document définit la phagocytose comme la capacité de reconnaître, englober puis digérer des microbes.',10),
      (exercise_a_uuid,'single_choice','Quelle cellule provient de la différenciation des monocytes selon le support ?',jsonb_build_array('Le macrophage', 'Le plasmocyte', 'L’hématie', 'Le neurone'),jsonb_build_array('Le macrophage'),'Le PDF indique que les macrophages proviennent de la différenciation des monocytes.',20),
      (exercise_a_uuid,'true_false','La défense non spécifique est décrite comme immédiate et non propre à un antigène déterminé.',jsonb_build_array('Vrai', 'Faux'),jsonb_build_array('Vrai'),'C’est la caractérisation donnée dans le document pour la défense innée non spécifique.',30);
  end if;

  exercise_b_uuid := null;
  insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
  select target.subject_id,target.level_id,target.series_id,target.chapter_id,target.lesson_id,'Exercice 2 — Défense spécifique et coopération cellulaire','Comparez les réponses humorale et cellulaire puis expliquez la reconnaissance du soi, du non-soi et le rôle des lymphocytes.','La correction distingue plasmocytes et anticorps des lymphocytes T cytotoxiques, puis relie le CMH et la présentation antigénique à l’activation lymphocytaire.','single_choice','medium','## Consigne

Analysez chaque proposition puis justifiez-la par une notion précise du cours.','## Correction

La correction relie chaque réponse aux mécanismes étudiés dans la leçon.',false,false,25,20
  where not exists (select 1 from public.exercises e where e.lesson_id=target.lesson_id and e.title='Exercice 2 — Défense spécifique et coopération cellulaire')
  returning id into exercise_b_uuid;
  if exercise_b_uuid is not null then
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
      (exercise_b_uuid,'single_choice','Quel est l’effecteur de la réponse immunitaire humorale dans le document ?',jsonb_build_array('Les anticorps circulants', 'Les fibres musculaires', 'Les ions sodium', 'Les glandes salivaires'),jsonb_build_array('Les anticorps circulants'),'La RIMH a pour point effecteur les anticorps sécrétés par les plasmocytes.',10),
      (exercise_b_uuid,'single_choice','Quelle molécule libérée par les lymphocytes T cytotoxiques permet la formation de pores et la cytolyse ?',jsonb_build_array('La perforine', 'L’aldostérone', 'La rénine', 'Le lysozyme'),jsonb_build_array('La perforine'),'Le support décrit la perforine comme une substance qui s’incorpore à la membrane et crée des pores conduisant à la cytolyse.',20),
      (exercise_b_uuid,'true_false','Les lymphocytes B peuvent se différencier en plasmocytes producteurs d’anticorps et en lymphocytes B mémoire.',jsonb_build_array('Vrai', 'Faux'),jsonb_build_array('Vrai'),'Ces deux devenirs sont explicitement donnés dans la phase de différenciation des lymphocytes B.',30);
  end if;

  quiz_uuid := null;
  insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active)
  select target.subject_id,target.level_id,target.series_id,target.offering_id,target.chapter_id,target.lesson_id,'Quiz de révision — Défense de l’organisme','Vérifiez la maîtrise du vocabulaire, des mécanismes et de la synthèse de la leçon.','medium',12,10,false,false
  where not exists (select 1 from public.quizzes q where q.lesson_id=target.lesson_id and q.title='Quiz de révision — Défense de l’organisme')
  returning id into quiz_uuid;
  if quiz_uuid is not null then
    with inserted_questions as (
      insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
        (quiz_uuid,'Comment appelle-t-on les molécules propres à l’individu qui permettent la reconnaissance de l’identité biologique ?','Le document les désigne comme des marqueurs de l’identité biologique, dont le CMH.','single_choice',10,1,true),
        (quiz_uuid,'Quel type de réaction est provoqué par la pénétration d’un corps étranger avant une réponse spécifique ?','Le PDF décrit une réaction de défense innée, immédiate et non spécifique.','single_choice',20,1,true),
        (quiz_uuid,'Quel organe est cité comme lieu de maturation des lymphocytes T ?','Le support indique que les lymphocytes T acquièrent leur maturité dans le thymus.','single_choice',30,1,true),
        (quiz_uuid,'Quel terme désigne l’association formée par un antigène et un anticorps ?','La réponse humorale conduit à la formation d’un complexe immun qui favorise la neutralisation de l’antigène.','single_choice',40,1,true)
      returning id,display_order
    )
    insert into public.quiz_answers (question_id,answer,is_correct,display_order)
    select inserted_questions.id,answers.answer,answers.is_correct,answers.display_order
    from inserted_questions
    join (values
        (10,'Les marqueurs du soi',true,10),
        (10,'Les toxines',false,20),
        (20,'La défense non spécifique',true,10),
        (20,'La réplication virale',false,20),
        (30,'Le thymus',true,10),
        (30,'Le bassinet',false,20),
        (40,'Le complexe immun',true,10),
        (40,'Le sarcomère',false,20)
    ) as answers(question_order,answer,is_correct,display_order)
      on answers.question_order=inserted_questions.display_order;
  end if;
end;
$svt_terminal_d_lot2$;
