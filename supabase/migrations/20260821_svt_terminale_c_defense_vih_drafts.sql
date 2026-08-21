-- Brouillons SVT Terminale C : système de défense et infection par le VIH.
-- PDF L4 « L’utilisation de l’énergie par la cellule musculaire » exclu : fichier structurellement illisible et aucune leçon correspondante confirmée.
-- Toutes les ressources créées restent inactives et non publiées ; toute leçon déjà remplie annule la migration.
do $svt_terminal_c_lot2$
declare
  target record;
  exercise_a_uuid uuid;
  exercise_b_uuid uuid;
  quiz_uuid uuid;
  lesson_count integer;
begin
  select count(*) into lesson_count
  from public.lessons
  where id in ('4127808a-f937-4d86-8c40-6205c7cd7d28', '48ac83b1-aca3-41c2-b241-07617c08c438');
  if lesson_count <> 2 then
    raise exception 'Les deux leçons SVT Terminale C attendues sont requises avant remplissage ; transaction annulée.';
  end if;

  select l.id as lesson_id,c.id as chapter_id,o.id as offering_id,o.subject_id,o.level_id,o.series_id into target
  from public.lessons l
  join public.chapters c on c.id=l.chapter_id
  join public.course_subject_offerings o on o.id=c.subject_offering_id
  where l.id='4127808a-f937-4d86-8c40-6205c7cd7d28';
  if target.lesson_id is null then raise exception 'Leçon cible % introuvable.', '4127808a-f937-4d86-8c40-6205c7cd7d28'; end if;
  if exists (select 1 from public.lessons where id=target.lesson_id and coalesce(btrim(content),'') <> '') then
    raise exception 'La leçon SVT Terminale C % contient déjà un cours : écrasement interdit.', target.lesson_id;
  end if;
  update public.lessons
  set description='Défense non spécifique et spécifique, barrières, phagocytose, réponse humorale, réponse cellulaire et coopération immunitaire.',
      content=$lesson_content$
## Le système de défense de l’organisme

> **Objectif :** expliquer comment l’organisme se défend contre les corps étrangers, en distinguant la défense non spécifique, la défense spécifique et les mécanismes immunitaires impliqués.

## 1. Une question de défense contre les corps étrangers

La situation de départ porte sur une campagne de vaccination contre le tétanos. Elle amène à s’interroger sur les moyens par lesquels l’organisme se défend contre les éléments étrangers, notamment les microbes.

Le document conduit à examiner trois idées complémentaires : la défense qui ne tient pas compte de la nature du corps étranger, la défense dirigée contre un corps étranger précis et le mécanisme des réponses immunitaires.

> **Définition : corps étranger.** Élément qui pénètre dans l’organisme et qui peut déclencher une réaction de défense.  
> **Définition : microbe.** Terme employé dans le document pour désigner notamment les bactéries pouvant pénétrer par une plaie.

## 2. Première ligne de défense : barrières et réaction inflammatoire

### Une piqûre d’épine comme situation d’observation

Après une piqûre d’épine, le tableau du document indique une dilatation des capillaires sanguins, un déplacement des globules blancs vers la zone atteinte, une agglomération autour des microbes et une enflure de la peau.

| Avant la piqûre | Après la piqûre | Interprétation dans le cours |
|---|---|---|
| Capillaires de taille normale | Capillaires dilatés | Modification locale de la circulation sanguine |
| Globules blancs dans les capillaires | Leucocytes vers le lieu d’infection | Mobilisation de cellules de défense |
| Forme normale du doigt | Enflure de la peau | Manifestation locale de l’inflammation |

> **Définition : réaction inflammatoire.** Réaction locale qui se manifeste par une chaleur, une rougeur, une douleur, une enflure et une perte des fonctions des tissus selon le support.  
> **Définition : leucocyte.** Globule blanc impliqué dans la défense de l’organisme.

### Des barrières naturelles avant l’infection

La peau et les muqueuses constituent la première ligne de défense. Le document distingue trois types de barrières.

| Type de barrière | Exemples donnés dans le PDF | Idée essentielle |
|---|---|---|
| Mécanique | Peau, muqueuses nasales et bronchiques | Elles limitent l’entrée des microbes |
| Chimique | Sueur, larmes, salive, mucus, acide gastrique, sécrétions du duodénum | Des substances ou des conditions de milieu s’opposent aux microbes |
| Biologique | Bactéries non pathogènes du tube digestif | Elles maintiennent des conditions défavorables à de nombreux microbes |

Le document précise notamment que la sueur a un pH de 3,5, que l’acide gastrique maintient dans l’estomac un pH de 1 à 2, et que les sécrétions alcalines du duodénum correspondent à un pH de 8.

> **Définition : lysozyme.** Enzyme indiquée dans le support comme présente dans les larmes, le mucus nasal et la salive ; elle peut dégrader la paroi externe de certaines bactéries.  
> **Définition : pH.** Grandeur utilisée dans le document pour caractériser l’acidité ou l’alcalinité d’un milieu.

### Phagocytose et évolution locale de l’infection

Lorsque la barrière cutanée est franchie, des **polynucléaires** — également appelés microphages ou granulocytes dans le support — interviennent d’abord. Des **macrophages**, issus de la différenciation des monocytes, poursuivent et intensifient la lutte.

> **Définition : phagocytose.** Propriété par laquelle des phagocytes reconnaissent, englobent puis digèrent des microbes.  
> **Définition : phagocyte.** Cellule capable de réaliser la phagocytose ; le document cite les macrophages et les polynucléaires.

| Issue décrite par le schéma | Conséquence |
|---|---|
| Bactéries phagocytées | L’infection régresse |
| Bactéries intactes mais sans multiplication immédiate | L’infection reste dans un état stationnaire |
| Bactéries victorieuses et en multiplication | L’infection se poursuit |

Si l’infection se poursuit, les microbes peuvent atteindre les vaisseaux lymphatiques puis les ganglions lymphatiques. Le document nomme **adénite** le gonflement douloureux des ganglions et **lymphangite** le gonflement des vaisseaux lymphatiques. Après franchissement de cette seconde barrière, le foie peut encore opposer une résistance grâce à ses phagocytes. Une invasion générale correspond à une **septicémie** ; lorsque des toxines microbiennes diffusent dans l’organisme, le support parle de **toxémie**.

> **Synthèse : défense non spécifique.** L’intrusion d’un corps étranger entraîne une défense innée, immédiate et non propre à un antigène déterminé. Elle comprend les barrières naturelles, l’inflammation et la phagocytose.

## 3. Défense spécifique : reconnaître un antigène précis

Le document exploite plusieurs expériences. L’anatoxine tétanique protège une souris contre la toxine tétanique, mais non contre la toxine diphtérique. La protection dépend donc de la nature précise de l’élément rencontré.

> **Définition : anatoxine.** Toxine microbienne atténuée : elle a perdu son pouvoir pathogène tout en conservant son pouvoir antigénique.  
> **Définition : antigène.** Substance dont l’introduction dans l’organisme déclenche une réaction immunitaire.

### Deux modalités mises en évidence

| Expérience du support | Élément protecteur mis en évidence | Réponse immunitaire |
|---|---|---|
| Transfert de sérum d’un animal immunisé | Substance circulant dans le milieu intérieur | Réponse à médiation humorale |
| Transfert de lymphocytes vivants d’un animal immunisé | Cellules immunitaires | Réponse à médiation cellulaire |

Dans la réponse humorale, les molécules effectrices sont les **anticorps**, protéines du groupe des immunoglobulines. Le document cite les classes IgA, IgE, IgD, IgG et IgM. Il indique que le complexe antigène-anticorps peut activer le **complément**, un ensemble de protéines sériques, et contribuer à la lyse de bactéries ou d’autres antigènes particulaires.

> **Définition : anticorps.** Protéine de type immunoglobuline impliquée dans la réponse immunitaire humorale.  
> **Définition : complément.** Ensemble de protéines du sérum qui, selon le document, peut être activé par le complexe antigène-anticorps.

## 4. Soi, non-soi et greffes

Les expériences de greffes permettent de comparer l’autogreffe, l’isogreffe, l’hétérogreffe et l’homogreffe ou allogreffe. Le document signale l’intégration pour l’autogreffe et l’isogreffe, et le rejet pour l’hétérogreffe et l’homogreffe.

> **Définition : greffe.** Transfert de tissu ou de fragment d’organe dans le même organisme ou entre organismes.  
> **Définition : transplantation.** Greffe qui concerne un organe entier.

Le document relie la reconnaissance à des protéines de surface : le **Complexe Majeur d’Histocompatibilité (CMH)**, appelé aussi HLA. Les molécules propres à l’individu participent à l’identité biologique ; elles correspondent au **soi**. Ce qui n’est pas toléré et déclenche une réaction immunitaire correspond au **non-soi**.

Les macrophages peuvent phagocyter un antigène, le dégrader et présenter ses **déterminants antigéniques** ou **épitopes**. Ils sécrètent ensuite une interleukine qui attire des lymphocytes. Les macrophages et les lymphocytes B sont présentés comme des cellules présentatrices d’antigène.

## 5. Le mécanisme des réponses immunitaires

Le support organise les réactions immunitaires en trois étapes.

| Étape | Ce qui se produit |
|---|---|
| Reconnaissance ou induction | L’antigène est identifié ; ses déterminants sont présentés aux lymphocytes spécifiques |
| Activation, différenciation et amplification | Les lymphocytes activés se divisent par mitose dans les organes lymphoïdes périphériques |
| Phase effectrice | Les effecteurs agissent contre l’antigène ou les cellules porteuses de l’antigène |

Les lymphocytes prennent naissance dans la moelle osseuse. Les lymphocytes B mûrissent dans la moelle osseuse et les lymphocytes T dans le thymus. La rate et les ganglions lymphatiques sont des organes lymphoïdes secondaires où s’effectuent activation, prolifération et production d’anticorps.

### Réponse humorale et réponse cellulaire

| Réponse | Cellules ou molécules mises en avant | Effet décrit |
|---|---|---|
| RIMH : réponse immunitaire à médiation humorale | Lymphocytes B différenciés en plasmocytes ; anticorps | Formation d’un complexe immun et neutralisation de l’antigène |
| RIMC : réponse immunitaire à médiation cellulaire | Lymphocytes T cytotoxiques | Contact avec la cellule porteuse de l’antigène et cytolyse |

Les lymphocytes B se différencient en **plasmocytes**, producteurs d’anticorps, et en lymphocytes B mémoire. Les lymphocytes T peuvent notamment donner des lymphocytes mémoire, régulateurs et cytotoxiques. Dans la RIMC, le document associe les LT cytotoxiques à la **perforine**, à la formation de pores et à la **cytolyse**.

> **Définition : plasmocyte.** Cellule issue de la différenciation d’un lymphocyte B et productrice d’anticorps.  
> **Définition : cytolyse.** Destruction d’une cellule ; dans le modèle présenté, la perforine forme des pores qui favorisent l’entrée d’eau, le gonflement puis l’éclatement de la cellule.

> **Attention :** la défense non spécifique ne cible pas un antigène déterminé, tandis que la défense spécifique est dirigée contre un antigène précis. Ces deux dimensions participent à la protection de l’organisme.

## 6. Synthèse générale

> **Synthèse :** l’organisme se défend d’abord par des barrières naturelles, une réaction inflammatoire et la phagocytose : c’est la défense non spécifique. Il peut ensuite mettre en œuvre une défense spécifique contre un antigène donné. Les macrophages, lymphocytes T et lymphocytes B coopèrent au cours de réponses dont la phase effectrice peut être humorale, par les anticorps, ou cellulaire, par des lymphocytes cytotoxiques.

## Référence pédagogique

Contenu reformulé, structuré et approfondi à partir du PDF fourni : **« Le système de défense de l’organisme »**, SVT, Terminale C, Côte d’Ivoire — Mon École à la Maison.
$lesson_content$,
      is_active=false
  where id=target.lesson_id and coalesce(btrim(content),'')='';

  exercise_a_uuid := null;
  insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
  select target.subject_id,target.level_id,target.series_id,target.chapter_id,target.lesson_id,'Exercice 1 — Défense non spécifique et phagocytose','Identifiez les barrières naturelles, la réaction inflammatoire et le rôle des phagocytes à partir de la situation de la piqûre d’épine.','La correction distingue les barrières, les signes de l’inflammation et les étapes décrites de la phagocytose.','single_choice','easy','## Consigne

Répondez en utilisant le vocabulaire exact du cours.','## Correction

Relisez les définitions et les mécanismes correspondants dans la leçon.',false,false,15,10
  where not exists (select 1 from public.exercises e where e.lesson_id=target.lesson_id and e.title='Exercice 1 — Défense non spécifique et phagocytose')
  returning id into exercise_a_uuid;
  if exercise_a_uuid is not null then
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
      (exercise_a_uuid,'single_choice','Quel ensemble constitue la première ligne de défense de l’organisme dans le cours ?',jsonb_build_array('La peau et les muqueuses', 'Les plasmocytes uniquement', 'Les virions', 'Les LT4 uniquement'),jsonb_build_array('La peau et les muqueuses'),'Le document présente la peau et les muqueuses comme des barrières naturelles constituant la première ligne de défense.',10),
      (exercise_a_uuid,'single_choice','Comment nomme-t-on la propriété par laquelle des cellules reconnaissent, englobent et digèrent des microbes ?',jsonb_build_array('La phagocytose', 'La cytolyse', 'La greffe', 'La transcription inverse'),jsonb_build_array('La phagocytose'),'La phagocytose est définie dans le support comme la reconnaissance, l’englobement puis la digestion des microbes par des phagocytes.',20),
      (exercise_a_uuid,'true_false','La défense non spécifique décrite dans le cours est innée, immédiate et non propre à un antigène déterminé.',jsonb_build_array('Vrai', 'Faux'),jsonb_build_array('Vrai'),'Le PDF formule explicitement ces trois caractéristiques de la défense non spécifique.',30);
  end if;

  exercise_b_uuid := null;
  insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
  select target.subject_id,target.level_id,target.series_id,target.chapter_id,target.lesson_id,'Exercice 2 — Immunité spécifique et coopération cellulaire','Distinguez réponse humorale et réponse cellulaire, puis reliez les cellules et molécules à leurs rôles.','La correction associe plasmocytes et anticorps à la réponse humorale, ainsi que lymphocytes cytotoxiques et cytolyse à la réponse cellulaire.','single_choice','medium','## Consigne

Analysez chaque proposition puis justifiez-la par une notion précise du cours.','## Correction

La correction distingue les mécanismes étudiés et leur enchaînement.',false,false,20,20
  where not exists (select 1 from public.exercises e where e.lesson_id=target.lesson_id and e.title='Exercice 2 — Immunité spécifique et coopération cellulaire')
  returning id into exercise_b_uuid;
  if exercise_b_uuid is not null then
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
      (exercise_b_uuid,'single_choice','Quelle cellule issue de la différenciation des lymphocytes B produit les anticorps ?',jsonb_build_array('Le plasmocyte', 'Le granulocyte', 'Le LT4', 'Le virion'),jsonb_build_array('Le plasmocyte'),'Les plasmocytes sont les cellules issues des lymphocytes B qui produisent les anticorps dans la réponse humorale.',10),
      (exercise_b_uuid,'single_choice','Quel ensemble de protéines sériques peut être activé par le complexe antigène-anticorps selon le document ?',jsonb_build_array('Le complément', 'La myéline', 'L’intégrase', 'Le mucus'),jsonb_build_array('Le complément'),'Le complément est décrit comme un ensemble de protéines du sérum activé par le complexe antigène-anticorps.',20),
      (exercise_b_uuid,'true_false','La réponse immunitaire à médiation cellulaire est présentée comme adaptée aux cellules hébergeant des virus ou d’autres parasites intracellulaires.',jsonb_build_array('Vrai', 'Faux'),jsonb_build_array('Vrai'),'Le support relie la réponse cellulaire aux lymphocytes cytotoxiques et aux cellules porteuses de l’antigène, notamment lorsque celles-ci hébergent des virus.',30);
  end if;

  quiz_uuid := null;
  insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active)
  select target.subject_id,target.level_id,target.series_id,target.offering_id,target.chapter_id,target.lesson_id,'Quiz de révision — Système de défense de l’organisme','Vérifiez la maîtrise du vocabulaire, des mécanismes et de la synthèse de la leçon.','medium',12,10,false,false
  where not exists (select 1 from public.quizzes q where q.lesson_id=target.lesson_id and q.title='Quiz de révision — Système de défense de l’organisme')
  returning id into quiz_uuid;
  if quiz_uuid is not null then
    with inserted_questions as (
      insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
        (quiz_uuid,'Quel terme désigne une toxine microbienne atténuée qui conserve son pouvoir antigénique ?','Une anatoxine est une toxine atténuée ayant perdu son pouvoir pathogène tout en conservant son pouvoir antigénique.','single_choice',10,1,true),
        (quiz_uuid,'Que désigne le CMH dans cette leçon ?','Le Complexe Majeur d’Histocompatibilité correspond à des protéines de surface liées à la reconnaissance du soi.','single_choice',20,1,true),
        (quiz_uuid,'Quelle étape suit la reconnaissance de l’antigène dans l’organisation générale présentée ?','Après la reconnaissance viennent l’activation, la différenciation et la multiplication des lymphocytes.','single_choice',30,1,true),
        (quiz_uuid,'Quelle notion résume l’action conjointe des macrophages, lymphocytes T et lymphocytes B ?','Le document parle de coopération cellulaire lorsque macrophages, LT et LB participent ensemble à la réponse.','single_choice',40,1,true)
      returning id,display_order
    )
    insert into public.quiz_answers (question_id,answer,is_correct,display_order)
    select inserted_questions.id,answers.answer,answers.is_correct,answers.display_order
    from inserted_questions
    join (values
        (10,'Une anatoxine',true,10),
        (10,'Une toxémie',false,20),
        (20,'Un système de reconnaissance de l’identité biologique',true,10),
        (20,'Une enzyme qui digère les bactéries',false,20),
        (30,'L’activation et la différenciation des lymphocytes',true,10),
        (30,'La formation immédiate d’une greffe',false,20),
        (40,'La coopération cellulaire',true,10),
        (40,'La virémie',false,20)
    ) as answers(question_order,answer,is_correct,display_order)
      on answers.question_order=inserted_questions.display_order;
  end if;

  select l.id as lesson_id,c.id as chapter_id,o.id as offering_id,o.subject_id,o.level_id,o.series_id into target
  from public.lessons l
  join public.chapters c on c.id=l.chapter_id
  join public.course_subject_offerings o on o.id=c.subject_offering_id
  where l.id='48ac83b1-aca3-41c2-b241-07617c08c438';
  if target.lesson_id is null then raise exception 'Leçon cible % introuvable.', '48ac83b1-aca3-41c2-b241-07617c08c438'; end if;
  if exists (select 1 from public.lessons where id=target.lesson_id and coalesce(btrim(content),'') <> '') then
    raise exception 'La leçon SVT Terminale C % contient déjà un cours : écrasement interdit.', target.lesson_id;
  end if;
  update public.lessons
  set description='Structure du VIH, infection des LT4, évolution en trois phases, dysfonctionnement immunitaire et mesures de protection.',
      content=$lesson_content$
## L’infection de l’organisme par le VIH

> **Objectif :** décrire la structure du VIH, expliquer les étapes de l’infection d’un lymphocyte T4, suivre l’évolution de l’infection et comprendre l’affaiblissement progressif du système de défense.

## 1. La question posée par le document

La situation d’apprentissage porte sur une conférence du club santé consacrée au VIH-SIDA. Elle conduit à examiner la structure du VIH, le mécanisme d’infection de l’organisme, les conséquences sur les cellules de défense et les mesures de protection mentionnées par le support.

> **Définition : VIH.** Dans le document, le VIH est le virus qui s’attaque aux cellules de défense, en particulier aux lymphocytes T4.  
> **Définition : LT4.** Lymphocyte T4, cellule cible du VIH dans le mécanisme présenté par le support.

## 2. Une structure virale particulière

Le schéma du document montre que le VIH possède une enveloppe lipidique, des protéines d’enveloppe et des protéines internes. Son cœur ou capside protéique contient deux molécules d’ARN associées chacune à une transcriptase inverse, également appelée rétrotranscriptase.

| Élément observé | Rôle ou position dans la description du PDF |
|---|---|
| Enveloppe lipidique | Enveloppe externe du virus |
| Protéines d’enveloppe Gp120 et Gp41 | Protéines spécifiques portées par l’enveloppe |
| Capside protéique | Cœur du virus |
| ARN | Deux molécules dans la capside |
| Transcriptase inverse | Associée à l’ARN ; intervient dans la synthèse de l’ADN proviral |

> **Définition : capside.** Enveloppe protéique interne ou cœur du VIH selon le document.  
> **Définition : transcriptase inverse.** Enzyme apportée par le VIH qui permet la synthèse de l’ADN proviral à partir de l’ARN viral dans le mécanisme présenté.

## 3. Comment le VIH infecte le lymphocyte T4

### Une reconnaissance ciblée

Le LT4 porte à sa surface un récepteur membranaire appelé **CD4**. Le VIH se fixe au LT4 grâce à sa glycoprotéine **Gp120**, qui adhère au récepteur CD4. Cette fixation libère la Gp41 ; le document lui attribue un rôle perforateur favorisant la fusion des membranes virale et lymphocytaire.

> **Définition : adsorption.** Fixation du VIH au lymphocyte T4, première étape du processus représenté.  
> **Définition : cellule cible.** Cellule sur laquelle le virus se fixe et dans laquelle il se multiplie ; ici, le LT4.

### Les dix étapes du processus représenté

1. Adsorption du VIH au LT4.
2. Injection de l’ARN viral et de la transcriptase inverse.
3. Transcription de l’ARN viral en ADN proviral.
4. Intégration de l’ADN proviral dans l’ADN du LT4.
5. Transcription de l’ADN viral en ARN messager.
6. Synthèse de protéines virales.
7. Modification des protéines synthétisées.
8. Assemblage de différentes protéines.
9. Bourgeonnement des virions.
10. Apparition et libération de nouveaux virus.

Le document précise que l’**intégrase** permet l’intégration de l’ADN proviral à l’ADN du LT4. Après l’intégration, la cellule hôte produit un ARN messager viral et des protéines virales. Les unités virales s’assemblent puis quittent le LT4 par bourgeonnement en emportant une partie de sa membrane plasmique. Le LT4 est alors détruit et les nouveaux virus peuvent infecter d’autres LT4.

> **Définition : ADN proviral.** ADN produit à partir de l’ARN viral puis intégré à l’ADN du LT4 dans le mécanisme du cours.  
> **Définition : bourgeonnement.** Sortie de nouveaux virions à la surface de la cellule hôte telle qu’elle est décrite dans le document.

> **Méthode : ordonner un mécanisme.** Commencez par la fixation à la cellule cible, poursuivez avec l’entrée des éléments viraux, puis placez la synthèse de l’ADN proviral et son intégration avant la fabrication et la libération de nouveaux virus.

## 4. Suivre l’évolution de l’infection

Le document présente trois courbes : quantité de VIH, quantité de LT4 et anticorps anti-VIH. Il distingue trois phases depuis la contamination jusqu’à l’état symptomatique.

| Phase du document | Repères temporels | Évolution principale décrite |
|---|---|---|
| Primo-infection | De 0 à 6 mois | Le VIH augmente rapidement puis chute ; anticorps anti-VIH et LT4 augmentent |
| Phase asymptomatique | De 6 à 56 mois | Le VIH diminue puis augmente de nouveau ; anticorps et LT4 finissent par chuter |
| Phase symptomatique ou SIDA déclaré | Au-delà de 56 mois | Le VIH augmente tandis que LT4 et anticorps anti-VIH tendent à s’annuler |

### Interpréter les courbes avec précision

Pendant la primo-infection, la quantité de VIH augmente du fait de sa multiplication. Les LT4 sont stimulés et participent à l’activation des lymphocytes B ; ces derniers se multiplient et se différencient en plasmocytes sécréteurs d’anticorps anti-VIH. L’augmentation des anticorps est associée dans le document à une chute de la quantité de VIH.

> **Définition : séropositif.** Qualificatif employé par le support dès l’apparition des anticorps anti-VIH.  
> **Définition : virémie.** Quantité de virus dans le sang ; le document emploie ce terme pour suivre le VIH chez un patient.

Pendant la phase asymptomatique, les anticorps neutralisent une grande partie des virus circulants. Toutefois, le VIH continue de se multiplier et de détruire les LT4. La diminution des LT4 est associée à la chute ultérieure des anticorps anti-VIH.

Pendant la phase symptomatique, le document explique que le VIH échappe à l’action du système immunitaire, continue de se multiplier aux dépens des LT4 et entraîne un **dysfonctionnement du système immunitaire**.

## 5. Conséquences : vulnérabilité aux maladies opportunistes

Les LT4 sont présentés comme des cellules de défense. Leur destruction progressive affaiblit l’organisme, qui devient plus vulnérable à d’autres agents pathogènes. Le support cite alors les **maladies opportunistes** liées au SIDA, notamment la tuberculose et le sarcome de Kaposi.

> **Définition : maladie opportuniste.** Maladie qui apparaît lorsque le système immunitaire est affaibli, selon l’explication du document.  
> **Attention :** la séropositivité correspond à l’apparition d’anticorps anti-VIH dans le support ; elle ne doit pas être confondue avec la phase symptomatique décrite plus tard par les courbes.

## 6. Prévention dans le cadre du cours

Le PDF conclut qu’il convient de mener une vie saine et responsable face au VIH et d’adopter des mesures de protection. La leçon étudie donc le mécanisme biologique de l’infection tout en rappelant qu’il s’agit d’un enjeu de santé publique.

## 7. Synthèse générale

> **Synthèse :** le VIH possède une enveloppe lipidique portant les glycoprotéines Gp120 et Gp41, une capside contenant deux ARN et des transcriptases inverses. Il infecte les LT4 grâce à la reconnaissance du récepteur CD4, produit un ADN proviral intégré à l’ADN de la cellule hôte, puis se multiplie et libère de nouveaux virions. La destruction progressive des LT4 affaiblit le système immunitaire et expose l’organisme aux maladies opportunistes.

## Référence pédagogique

Contenu reformulé, structuré et approfondi à partir du PDF fourni : **« L’infection de l’organisme par le VIH »**, SVT, Terminale C, Côte d’Ivoire — Mon École à la Maison.
$lesson_content$,
      is_active=false
  where id=target.lesson_id and coalesce(btrim(content),'')='';

  exercise_a_uuid := null;
  insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
  select target.subject_id,target.level_id,target.series_id,target.chapter_id,target.lesson_id,'Exercice 1 — Structure du VIH et infection du LT4','Identifiez les éléments de la structure du VIH et organisez les premières étapes de l’infection du lymphocyte T4.','La correction mobilise les glycoprotéines d’enveloppe, le récepteur CD4, la transcriptase inverse et l’ADN proviral.','single_choice','easy','## Consigne

Répondez en utilisant le vocabulaire exact du cours.','## Correction

Relisez les définitions et les mécanismes correspondants dans la leçon.',false,false,15,10
  where not exists (select 1 from public.exercises e where e.lesson_id=target.lesson_id and e.title='Exercice 1 — Structure du VIH et infection du LT4')
  returning id into exercise_a_uuid;
  if exercise_a_uuid is not null then
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
      (exercise_a_uuid,'single_choice','Quelle glycoprotéine du VIH se fixe au récepteur CD4 du LT4 selon le cours ?',jsonb_build_array('Gp120', 'Gp41', 'IgG', 'Perforine'),jsonb_build_array('Gp120'),'Le document indique que Gp120 adhère aux récepteurs CD4 portés par les LT4.',10),
      (exercise_a_uuid,'single_choice','Quelle molécule est synthétisée à partir de l’ARN viral grâce à la transcriptase inverse ?',jsonb_build_array('L’ADN proviral', 'Un anticorps anti-VIH', 'Le complément', 'La myéline'),jsonb_build_array('L’ADN proviral'),'La transcription inverse permet la synthèse de l’ADN proviral à partir de l’ARN viral.',20),
      (exercise_a_uuid,'true_false','L’intégrase permet l’intégration de l’ADN proviral dans l’ADN du LT4 dans le mécanisme présenté.',jsonb_build_array('Vrai', 'Faux'),jsonb_build_array('Vrai'),'Le support cite explicitement l’intégrase pour l’intégration de l’ADN proviral à l’ADN du LT4.',30);
  end if;

  exercise_b_uuid := null;
  insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
  select target.subject_id,target.level_id,target.series_id,target.chapter_id,target.lesson_id,'Exercice 2 — Phases de l’infection et conséquences','Interprétez l’évolution de la quantité de VIH, des LT4 et des anticorps anti-VIH au cours des trois phases décrites.','La correction distingue la primo-infection, la phase asymptomatique et la phase symptomatique, sans confondre séropositivité et SIDA déclaré.','single_choice','medium','## Consigne

Analysez chaque proposition puis justifiez-la par une notion précise du cours.','## Correction

La correction distingue les mécanismes étudiés et leur enchaînement.',false,false,20,20
  where not exists (select 1 from public.exercises e where e.lesson_id=target.lesson_id and e.title='Exercice 2 — Phases de l’infection et conséquences')
  returning id into exercise_b_uuid;
  if exercise_b_uuid is not null then
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
      (exercise_b_uuid,'single_choice','Comment le document appelle-t-il la phase allant de 0 à 6 mois après la contamination ?',jsonb_build_array('La primo-infection', 'La phase de greffe', 'La cytolyse', 'La phase de phagocytose'),jsonb_build_array('La primo-infection'),'Le support nomme primo-infection la première phase, de 0 à 6 mois.',10),
      (exercise_b_uuid,'single_choice','À quel moment le document qualifie-t-il l’individu de séropositif ?',jsonb_build_array('Dès l’apparition des anticorps anti-VIH', 'Dès la disparition totale des LT4', 'Seulement au SIDA déclaré', 'Avant toute contamination'),jsonb_build_array('Dès l’apparition des anticorps anti-VIH'),'Le cours associe la séropositivité à l’apparition des anticorps anti-VIH.',20),
      (exercise_b_uuid,'true_false','Les maladies opportunistes citées dans le document sont reliées à l’affaiblissement du système immunitaire par la destruction des LT4.',jsonb_build_array('Vrai', 'Faux'),jsonb_build_array('Vrai'),'La chute des LT4 conduit au dysfonctionnement du système immunitaire et à la vulnérabilité aux agents pathogènes.',30);
  end if;

  quiz_uuid := null;
  insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active)
  select target.subject_id,target.level_id,target.series_id,target.offering_id,target.chapter_id,target.lesson_id,'Quiz de révision — Infection de l’organisme par le VIH','Vérifiez la maîtrise du vocabulaire, des mécanismes et de la synthèse de la leçon.','medium',12,10,false,false
  where not exists (select 1 from public.quizzes q where q.lesson_id=target.lesson_id and q.title='Quiz de révision — Infection de l’organisme par le VIH')
  returning id into quiz_uuid;
  if quiz_uuid is not null then
    with inserted_questions as (
      insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
        (quiz_uuid,'Quelle cellule est la cible du VIH dans le modèle étudié ?','Le document indique que le VIH infecte les lymphocytes T4, qui portent le récepteur CD4.','single_choice',10,1,true),
        (quiz_uuid,'Quelle étape intervient après l’intégration de l’ADN proviral dans l’ADN du LT4 ?','Le modèle place ensuite la transcription de l’ADN viral en ARN messager avant la synthèse de protéines virales.','single_choice',20,1,true),
        (quiz_uuid,'Quel événement marque la sortie de nouveaux virions de la cellule hôte ?','Le document décrit le bourgeonnement des virions, suivi de l’apparition de nouveaux virus.','single_choice',30,1,true),
        (quiz_uuid,'Quelle conséquence générale résume la phase symptomatique ?','La multiplication persistante du VIH et la chute des LT4 provoquent un dysfonctionnement immunitaire et une vulnérabilité aux maladies opportunistes.','single_choice',40,1,true)
      returning id,display_order
    )
    insert into public.quiz_answers (question_id,answer,is_correct,display_order)
    select inserted_questions.id,answers.answer,answers.is_correct,answers.display_order
    from inserted_questions
    join (values
        (10,'Le lymphocyte T4',true,10),
        (10,'Le plasmocyte',false,20),
        (20,'La transcription en ARN messager viral',true,10),
        (20,'La formation immédiate d’anticorps',false,20),
        (30,'Le bourgeonnement',true,10),
        (30,'La phagocytose',false,20),
        (40,'Un dysfonctionnement du système immunitaire',true,10),
        (40,'Une défense définitive contre tous les microbes',false,20)
    ) as answers(question_order,answer,is_correct,display_order)
      on answers.question_order=inserted_questions.display_order;
  end if;
end;
$svt_terminal_c_lot2$;
