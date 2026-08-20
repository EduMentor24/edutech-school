-- Brouillons SVT Terminale C : communication nerveuse et drogues.
-- Leçon 3 « La production d’énergie par la cellule » volontairement exclue : PDF reçu illisible.
-- Toutes les ressources créées restent inactives et non publiées ; toute leçon déjà remplie annule la migration.
do $svt_terminal_c_lot1$
declare
  target record;
  exercise_a_uuid uuid;
  exercise_b_uuid uuid;
  quiz_uuid uuid;
  lesson_count integer;
begin
  select count(*) into lesson_count
  from public.lessons
  where id in ('5309406d-0ab9-4958-a2e9-af5f16a6b1c0', '4cdc042d-3932-4b48-ad20-c14fa9bc9bce');
  if lesson_count <> 2 then
    raise exception 'Les deux leçons SVT Terminale C attendues sont requises avant remplissage ; transaction annulée.';
  end if;

  select l.id as lesson_id,c.id as chapter_id,o.id as offering_id,o.subject_id,o.level_id,o.series_id into target
  from public.lessons l
  join public.chapters c on c.id=l.chapter_id
  join public.course_subject_offerings o on o.id=c.subject_offering_id
  where l.id='5309406d-0ab9-4958-a2e9-af5f16a6b1c0';
  if target.lesson_id is null then raise exception 'Leçon cible % introuvable.', '5309406d-0ab9-4958-a2e9-af5f16a6b1c0'; end if;
  if exists (select 1 from public.lessons where id=target.lesson_id and coalesce(btrim(content),'') <> '') then
    raise exception 'La leçon SVT Terminale C % contient déjà un cours : écrasement interdit.', target.lesson_id;
  end if;
  update public.lessons
  set description='Organisation du neurone, potentiel de membrane, potentiel d’action, base ionique et transmission synaptique.',
      content=$lesson_content$
## La communication nerveuse

> **Objectif :** expliquer comment l’information nerveuse se propage dans l’organisme, depuis le neurone jusqu’à la synapse.

## 1. Partir d’une situation concrète

Lorsqu’une personne se pique avec une épine, elle retire très rapidement sa main. Cette réponse suppose qu’une information circule dans l’organisme. Le support appelle cette information l’**influx nerveux**.

> **Définition : influx nerveux.** Signal transmis dans le système nerveux. Dans cette leçon, il se propage électriquement le long d’un neurone puis se transmet chimiquement au niveau d’une synapse.

La question directrice est donc : **comment l’influx nerveux se propage-t-il dans l’organisme ?**

## 2. Du nerf au neurone

Un **nerf** n’est pas une cellule unique. Le document le présente comme un ensemble protégé par une gaine conjonctive et formé de faisceaux d’axones. Ces axones appartiennent à des neurones.

| Élément | Description utile | Rôle dans l’étude |
|---|---|---|
| Neurone | Cellule spécialisée constituée notamment d’un corps cellulaire, de prolongements et d’un axone | Support de propagation de l’influx nerveux |
| Soma ou péricaryon | Corps cellulaire du neurone | Partie contenant le centre cellulaire présenté dans le schéma |
| Axone | Long prolongement du neurone | Voie de propagation du signal électrique |
| Arborisation terminale | Extrémité ramifiée de l’axone | Zone de contact avec d’autres cellules |
| Cellules gliales | Cellules associées aux neurones | Elles sont indiquées dans la structure observée |
| Myéline | Enveloppe présente autour de certains axones | Elle alterne avec les nœuds de Ranvier sur le schéma |
| Nœuds de Ranvier | Interruptions de la gaine de myéline | Repères structuraux visibles sur certains axones |

> **Définition : axone.** Prolongement cellulaire le long duquel se propage l’influx nerveux étudié.  
> **Définition : myéline.** Enveloppe associée à certains axones, séparée par des nœuds de Ranvier.

> **Attention :** le nerf est un regroupement de fibres nerveuses, tandis que le neurone est une cellule. Ne confondez pas ces deux niveaux d’organisation.

## 3. Le potentiel de membrane : un état électrique de référence

Le document prend le milieu extérieur comme potentiel de référence :

$$
V_{\text{extérieur}} = 0\ \text{mV}
$$

Au repos, l’intérieur de la membrane du neurone est négatif par rapport à l’extérieur. Le potentiel de membrane indiqué dans le support est voisin de :

$$
V_{\text{membrane}} \approx -70\ \text{mV}
$$

> **Définition : potentiel de membrane.** Différence électrique mesurée entre l’intérieur et l’extérieur de la membrane d’un neurone.  
> **Définition : millivolt (mV).** Mille fois plus petit qu’un volt ; c’est l’unité utilisée ici pour décrire les variations électriques.

Un enregistrement peut aussi faire apparaître un **artefact**. Il s’agit d’un signal lié au dispositif ou à la stimulation, qui ne correspond pas à la réponse électrique proprement dite du neurone. Il faut donc l’identifier avant d’interpréter la courbe.

## 4. Le potentiel d’action : une variation brève et organisée

Une stimulation efficace déclenche un **potentiel d’action**. Dans l’enregistrement présenté, il se distingue du potentiel de repos par une succession ordonnée de variations.

| Étape | Ce que montre la courbe | Vocabulaire à employer |
|---|---|---|
| Latence | Court délai entre la stimulation et la réponse | Latence |
| Montée de la courbe | Le potentiel devient moins négatif puis positif | Dépolarisation |
| Descente | Le potentiel revient vers la valeur de repos | Repolarisation |
| Passage transitoire sous le repos | Le potentiel devient momentanément plus négatif que le repos | Hyperpolarisation |
| Retour durable vers le repos | Le potentiel se stabilise à nouveau près de \(-70\) mV | Restauration |

Selon la disposition des électrodes, l’enregistrement peut être **monophasique** ou **diphasique**. Dans les deux cas, l’élève doit surtout reconnaître qu’il s’agit d’une réponse électrique et organiser correctement les étapes observées.

> **Méthode : lire une courbe.** Repérez d’abord la ligne de repos, puis localisez la stimulation et l’artefact éventuel. Lisez ensuite la réponse de gauche à droite : latence, dépolarisation, repolarisation, hyperpolarisation, retour au repos.

## 5. La base ionique du potentiel de membrane et du potentiel d’action

Le support relie les variations électriques aux déplacements d’ions à travers la membrane.

> **Définition : ion.** Particule portant une charge électrique. Dans la leçon, les ions importants sont le sodium \(Na^+\) et le potassium \(K^+\).  
> **Définition : perméabilité membranaire.** Possibilité pour une substance ou un ion de franchir une membrane.

Au repos, la répartition de \(K^+\) et de \(Na^+\), ainsi que les perméabilités de la membrane, contribuent au potentiel de membrane. Les canaux **voltage-dépendants** participent aux variations observées lors du potentiel d’action.

| Mécanisme cité dans le support | Idée essentielle |
|---|---|
| Mouvements passifs d’ions | Des ions se déplacent selon les conditions de part et d’autre de la membrane |
| Canaux voltage-dépendants | Leur ouverture ou leur fermeture dépend de l’état électrique de la membrane |
| Pompe \(Na^+/K^+\) | Elle utilise l’énergie de l’ATP pour faire sortir 3 \(Na^+\) et faire entrer 2 \(K^+\) |

$$
3\,Na^+\ \text{sortent} \qquad ; \qquad 2\,K^+\ \text{entrent}
$$

> **Définition : ATP.** Molécule dont l’énergie est utilisée, dans le modèle présenté, par la pompe \(Na^+/K^+\).  
> **Attention :** la pompe \(Na^+/K^+\) ne correspond pas à un simple mouvement passif : le support précise qu’elle utilise l’énergie de l’ATP.

## 6. La synapse : transmettre l’information d’une cellule à une autre

La propagation le long de l’axone est électrique. À la jonction entre deux cellules, l’information passe par une **synapse**.

> **Définition : synapse.** Zone de communication entre une cellule nerveuse et une autre cellule. Elle comporte un élément présynaptique, une fente synaptique et un élément postsynaptique.

Le document distingue notamment les synapses **axo-axonique**, **axo-dendritique**, **axo-somatique** et la **jonction neuromusculaire**. Ces noms indiquent les parties cellulaires mises en relation.

### Étapes de la transmission synaptique

1. Le potentiel d’action atteint l’extrémité présynaptique de l’axone.
2. Des ions \(Ca^{2+}\) entrent dans cette terminaison.
3. Les vésicules contenant un neurotransmetteur se déplacent et libèrent leur contenu par **exocytose**.
4. Le neurotransmetteur, par exemple l’**acétylcholine** indiquée par le support, traverse la fente synaptique.
5. Il se fixe sur des récepteurs de la membrane postsynaptique.
6. Cette fixation est associée, dans le modèle présenté, à une entrée de \(Na^+\) et à une nouvelle réponse électrique.
7. Le neurotransmetteur est ensuite éliminé par hydrolyse et/ou recapture selon les éléments indiqués par le schéma.

> **Définition : neurotransmetteur.** Substance chimique libérée par l’élément présynaptique et reconnue par des récepteurs postsynaptiques.  
> **Définition : exocytose.** Libération du contenu d’une vésicule vers l’extérieur de la cellule.  
> **Définition : fente synaptique.** Petit espace séparant les deux éléments de la synapse.

> **Attention :** il faut distinguer deux mécanismes complémentaires : **propagation électrique dans l’axone** et **transmission chimique à la synapse**.

## 7. Schéma fonctionnel à retenir

$$
\text{potentiel d’action dans l’axone}
\rightarrow \text{entrée de } Ca^{2+}
\rightarrow \text{exocytose du neurotransmetteur}
\rightarrow \text{récepteurs postsynaptiques}
\rightarrow \text{nouvelle réponse}
$$

## 8. Synthèse

> **Synthèse :** un nerf rassemble des axones appartenant à des neurones. Le neurone présente au repos un potentiel de membrane proche de \(-70\) mV. Une stimulation efficace provoque un potentiel d’action caractérisé par une dépolarisation, une repolarisation et un retour au repos ; les ions \(Na^+\) et \(K^+\), leurs canaux et la pompe \(Na^+/K^+\) participent à cette organisation. À la synapse, l’arrivée du signal entraîne l’entrée de \(Ca^{2+}\), l’exocytose d’un neurotransmetteur puis l’activation de récepteurs postsynaptiques.

## Référence pédagogique

Contenu reformulé, structuré et approfondi à partir du PDF fourni : **« La communication nerveuse »**, SVT, Terminale C, Côte d’Ivoire – École numérique.
$lesson_content$,
      is_active=false
  where id=target.lesson_id and coalesce(btrim(content),'')='';

  exercise_a_uuid := null;
  insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
  select target.subject_id,target.level_id,target.series_id,target.chapter_id,target.lesson_id,'Exercice 1 — Neurone et potentiel d’action','Identifiez les structures du neurone et les étapes visibles sur un enregistrement du potentiel d’action.','La correction mobilise le vocabulaire de structure et l’ordre de lecture d’une courbe électrique.','single_choice','easy','## Consigne

Répondez en utilisant le vocabulaire exact du cours.','## Correction

Relisez les définitions et les étapes correspondantes dans la leçon.',false,false,15,10
  where not exists (select 1 from public.exercises e where e.lesson_id=target.lesson_id and e.title='Exercice 1 — Neurone et potentiel d’action')
  returning id into exercise_a_uuid;
  if exercise_a_uuid is not null then
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
      (exercise_a_uuid,'single_choice','Quel élément est le long prolongement du neurone qui sert de voie de propagation dans la leçon ?',jsonb_build_array('L’axone', 'La fente synaptique', 'La gaine conjonctive', 'Le neurotransmetteur'),jsonb_build_array('L’axone'),'L’axone est le prolongement du neurone le long duquel se propage le signal électrique étudié.',10),
      (exercise_a_uuid,'single_choice','Quelle valeur de potentiel de membrane au repos est indiquée dans le support ?',jsonb_build_array('Environ −70 mV', '0 mV', 'Environ +70 mV', '3 mV'),jsonb_build_array('Environ −70 mV'),'Le potentiel de membrane au repos est présenté comme voisin de −70 mV lorsque le milieu extérieur est pris comme référence à 0 mV.',20),
      (exercise_a_uuid,'single_choice','Après la dépolarisation, quelle étape décrit le retour du potentiel vers sa valeur de repos ?',jsonb_build_array('La repolarisation', 'La latence', 'L’artefact', 'L’exocytose'),jsonb_build_array('La repolarisation'),'La repolarisation correspond à la descente de la courbe vers le potentiel de repos.',30);
  end if;

  exercise_b_uuid := null;
  insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
  select target.subject_id,target.level_id,target.series_id,target.chapter_id,target.lesson_id,'Exercice 2 — Transmission au niveau d’une synapse','Organisez les étapes de la transmission synaptique et reliez-les aux acteurs cellulaires appropriés.','La correction distingue l’arrivée du signal électrique, la libération chimique et la réponse postsynaptique.','single_choice','medium','## Consigne

Analysez chaque proposition puis justifiez-la par une notion précise du cours.','## Correction

La correction distingue les mécanismes étudiés et leur enchaînement.',false,false,20,20
  where not exists (select 1 from public.exercises e where e.lesson_id=target.lesson_id and e.title='Exercice 2 — Transmission au niveau d’une synapse')
  returning id into exercise_b_uuid;
  if exercise_b_uuid is not null then
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
      (exercise_b_uuid,'single_choice','Quel ion entre dans l’élément présynaptique lorsque le potentiel d’action arrive selon le schéma du cours ?',jsonb_build_array('Ca²⁺', 'K⁺ uniquement', 'Cl⁻ uniquement', 'ATP'),jsonb_build_array('Ca²⁺'),'Le support relie l’arrivée du potentiel d’action à une entrée de Ca²⁺ dans la terminaison présynaptique.',10),
      (exercise_b_uuid,'single_choice','Quel processus libère le neurotransmetteur contenu dans les vésicules ?',jsonb_build_array('L’exocytose', 'La myélinisation', 'L’hyperpolarisation', 'La latence'),jsonb_build_array('L’exocytose'),'L’exocytose libère le contenu des vésicules vers la fente synaptique.',20),
      (exercise_b_uuid,'true_false','La transmission au niveau d’une synapse est décrite comme une transmission chimique, tandis que la propagation le long de l’axone est électrique.',jsonb_build_array('Vrai', 'Faux'),jsonb_build_array('Vrai'),'Le cours insiste sur cette distinction fondamentale entre l’axone et la synapse.',30);
  end if;

  quiz_uuid := null;
  insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active)
  select target.subject_id,target.level_id,target.series_id,target.offering_id,target.chapter_id,target.lesson_id,'Quiz de révision — Communication nerveuse','Vérifiez la maîtrise du vocabulaire, des mécanismes et de la synthèse de la leçon.','medium',12,10,false,false
  where not exists (select 1 from public.quizzes q where q.lesson_id=target.lesson_id and q.title='Quiz de révision — Communication nerveuse')
  returning id into quiz_uuid;
  if quiz_uuid is not null then
    with inserted_questions as (
      insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
        (quiz_uuid,'Qu’est-ce qu’un potentiel de membrane ?','C’est la différence électrique entre l’intérieur et l’extérieur de la membrane du neurone.','single_choice',10,1,true),
        (quiz_uuid,'Quel mécanisme utilise l’énergie de l’ATP dans le modèle du cours ?','La pompe Na⁺/K⁺ utilise l’énergie de l’ATP pour faire sortir 3 Na⁺ et entrer 2 K⁺.','single_choice',20,1,true),
        (quiz_uuid,'Quel neurotransmetteur est explicitement cité dans le support ?','L’acétylcholine est donnée comme exemple de neurotransmetteur.','single_choice',30,1,true),
        (quiz_uuid,'Quelle structure sépare l’élément présynaptique de l’élément postsynaptique ?','La fente synaptique est le petit espace entre les deux éléments.','single_choice',40,1,true)
      returning id,display_order
    )
    insert into public.quiz_answers (question_id,answer,is_correct,display_order)
    select inserted_questions.id,answers.answer,answers.is_correct,answers.display_order
    from inserted_questions
    join (values
        (10,'Une différence électrique entre l’intérieur et l’extérieur de la membrane',true,10),
        (10,'Une substance libérée dans la fente synaptique',false,20),
        (20,'La pompe Na⁺/K⁺',true,10),
        (20,'La fente synaptique',false,20),
        (30,'L’acétylcholine',true,10),
        (30,'La myéline',false,20),
        (40,'La fente synaptique',true,10),
        (40,'Le soma',false,20)
    ) as answers(question_order,answer,is_correct,display_order)
      on answers.question_order=inserted_questions.display_order;
  end if;

  select l.id as lesson_id,c.id as chapter_id,o.id as offering_id,o.subject_id,o.level_id,o.series_id into target
  from public.lessons l
  join public.chapters c on c.id=l.chapter_id
  join public.course_subject_offerings o on o.id=c.subject_offering_id
  where l.id='4cdc042d-3932-4b48-ad20-c14fa9bc9bce';
  if target.lesson_id is null then raise exception 'Leçon cible % introuvable.', '4cdc042d-3932-4b48-ad20-c14fa9bc9bce'; end if;
  if exists (select 1 from public.lessons where id=target.lesson_id and coalesce(btrim(content),'') <> '') then
    raise exception 'La leçon SVT Terminale C % contient déjà un cours : écrasement interdit.', target.lesson_id;
  end if;
  update public.lessons
  set description='Effets des drogues sur l’activité nerveuse, action synaptique, conséquences et prévention.',
      content=$lesson_content$
## Les drogues et le système nerveux

> **Objectif :** expliquer comment les drogues modifient l’activité nerveuse, en particulier au niveau de la synapse, puis identifier les enjeux de prévention.

## 1. Une question de santé et de fonctionnement nerveux

Le support s’appuie sur une activité de club santé et sur une observation conduite dans un centre de désintoxication. Il pose une question essentielle : **comment les drogues agissent-elles sur l’être humain ?**

Le cours n’analyse pas les drogues comme de simples produits isolés : il relie leurs effets à l’activité du système nerveux et à la communication synaptique.

> **Définition : système nerveux.** Ensemble d’organes et de cellules qui assurent la réception, la transmission et le traitement d’informations dans l’organisme.  
> **Définition : synapse.** Zone de communication entre deux cellules, où intervient la libération et l’action d’un neuromédiateur.

## 2. Des effets opposés sur l’activité nerveuse

Le PDF compare des enregistrements d’activité nerveuse. Il indique que la **nicotine** augmente l’amplitude et la fréquence des potentiels d’action, alors que le **diazépam** les diminue.

| Catégorie employée dans le support | Effet général sur l’activité nerveuse | Repère du document |
|---|---|---|
| Psychostimulant | Effet excitateur : l’activité nerveuse augmente | La nicotine est présentée avec une augmentation d’amplitude et de fréquence |
| Psychodépresseur | Effet inhibiteur : l’activité nerveuse diminue | Le diazépam est présenté avec une diminution d’amplitude et de fréquence |

> **Définition : amplitude.** Importance verticale d’une variation sur une courbe d’enregistrement.  
> **Définition : fréquence.** Nombre de réponses ou d’événements observés pendant une durée donnée.  
> **Définition : psychostimulant.** Substance décrite dans le cours par un effet excitateur sur l’activité nerveuse.  
> **Définition : psychodépresseur.** Substance décrite dans le cours par un effet inhibiteur sur l’activité nerveuse.

> **Méthode : comparer deux tracés.** Observez séparément l’amplitude et la fréquence. Une hausse des deux valeurs traduit ici un effet excitateur ; une baisse traduit un effet inhibiteur.

## 3. Le point commun : une action au niveau de la synapse

La synapse est le lieu central de l’explication. Pour comprendre l’action d’une substance, il faut distinguer trois opérations :

1. la **libération** du neuromédiateur par l’élément présynaptique ;
2. sa **recapture**, c’est-à-dire son retour ou son retrait après son action ;
3. sa **fixation** sur les récepteurs de l’élément postsynaptique.

> **Définition : neuromédiateur.** Substance chimique libérée dans la fente synaptique et reconnue par des récepteurs de la cellule postsynaptique.  
> **Définition : recapture.** Mécanisme par lequel un neuromédiateur est retiré de la fente synaptique, notamment par retour vers l’élément présynaptique.  
> **Définition : récepteur.** Structure capable de reconnaître un neuromédiateur et de participer à la réponse postsynaptique.

### Les modes d’action étudiés

| Effet sur la synapse | Conséquence fonctionnelle exposée dans le support |
|---|---|
| Libération continue de neuromédiateurs | La communication synaptique est favorisée de manière anormale dans le modèle étudié |
| Blocage de la recapture | Le neuromédiateur reste davantage disponible dans la fente synaptique |
| Blocage de la libération | La transmission synaptique est freinée |
| Blocage de la fixation sur les récepteurs | Le neuromédiateur ne peut plus produire normalement sa réponse postsynaptique |

Le document cite les **amphétamines**, la **cocaïne**, la **morphine**, le **LSD** et les **tranquillisants** dans les activités consacrées aux modes d’action. Les termes doivent être utilisés avec rigueur : il s’agit d’expliquer une modification de la communication synaptique et non de banaliser la consommation.

> **Attention :** libération, recapture et fixation sont trois étapes différentes. Dans une question, commencez par identifier précisément laquelle est modifiée avant de déduire l’effet sur la synapse.

## 4. Comprendre une expérience sur la dopamine

Le support propose une activité sur la dopamine dans la fente synaptique chez des rats. Cette situation doit être lue comme une démarche scientifique : un document ou une courbe permet d’observer la quantité ou la présence de dopamine dans l’espace synaptique, puis de relier cette observation à la libération ou à la recapture.

> **Définition : dopamine.** Neuromédiateur cité dans l’activité d’analyse du document.  
> **Méthode : interpréter un document synaptique.** Identifiez d’abord le neuromédiateur étudié ; repérez ensuite ce qui varie dans la fente synaptique ; enfin reliez cette variation à la libération, à la recapture ou à la fixation évoquée dans l’énoncé.

## 5. Conséquences et prévention

Le PDF distingue les conséquences pour le consommateur et les répercussions sociales. Sans ajouter d’informations non présentes dans le support, il faut retenir que la consommation de drogues ne concerne pas seulement une cellule ou une synapse : elle pose aussi une question de santé et de vie collective.

Les réponses mises en avant sont les suivantes :

| Action | Sens dans le cours |
|---|---|
| Prévention et sensibilisation | Informer pour éviter la consommation et ses conséquences |
| Vie sans drogue | Choix de protection de la santé et de la vie sociale |
| Désintoxication | Démarche de prise en charge mentionnée par le support |
| Rééducation | Accompagnement cité dans la continuité de la désintoxication |

> **Définition : désintoxication.** Démarche mentionnée dans le support pour la prise en charge d’une personne confrontée à la consommation de drogues.  
> **Définition : rééducation.** Accompagnement cité par le document dans la continuité de cette prise en charge.

## 6. Raisonnement de synthèse

$$
\text{drogue}
\rightarrow \text{modification de la communication synaptique}
\rightarrow \text{variation de l’activité nerveuse}
\rightarrow \text{conséquences individuelles et sociales}
$$

> **Synthèse :** les drogues étudiées modifient l’activité du système nerveux. Le support distingue des effets psychostimulants et psychodépresseurs à partir de variations d’amplitude et de fréquence des potentiels d’action. Leur action s’explique par des modifications de la libération, de la recapture ou de la fixation de neuromédiateurs au niveau de la synapse. La prévention, la sensibilisation, la désintoxication et la rééducation constituent les réponses explicitement indiquées.

## Référence pédagogique

Contenu reformulé, structuré et approfondi à partir du PDF fourni : **« Les drogues et le système nerveux »**, SVT, Terminale C, Côte d’Ivoire – École numérique.
$lesson_content$,
      is_active=false
  where id=target.lesson_id and coalesce(btrim(content),'')='';

  exercise_a_uuid := null;
  insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
  select target.subject_id,target.level_id,target.series_id,target.chapter_id,target.lesson_id,'Exercice 1 — Effets sur l’activité nerveuse','Comparez les effets présentés pour la nicotine et le diazépam en utilisant les notions d’amplitude, de fréquence et de catégorie d’effet.','La correction identifie l’augmentation ou la diminution de l’activité nerveuse et la catégorie correspondante.','single_choice','easy','## Consigne

Répondez en utilisant le vocabulaire exact du cours.','## Correction

Relisez les définitions et les étapes correspondantes dans la leçon.',false,false,15,10
  where not exists (select 1 from public.exercises e where e.lesson_id=target.lesson_id and e.title='Exercice 1 — Effets sur l’activité nerveuse')
  returning id into exercise_a_uuid;
  if exercise_a_uuid is not null then
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
      (exercise_a_uuid,'single_choice','Quel effet le support attribue-t-il à la nicotine sur les potentiels d’action ?',jsonb_build_array('Une augmentation de l’amplitude et de la fréquence', 'Une disparition de toute activité nerveuse', 'Une diminution de l’amplitude et de la fréquence', 'Aucun effet mesurable'),jsonb_build_array('Une augmentation de l’amplitude et de la fréquence'),'Le document présente la nicotine avec une augmentation d’amplitude et de fréquence des potentiels d’action.',10),
      (exercise_a_uuid,'single_choice','Comment le support qualifie-t-il un effet excitateur sur l’activité nerveuse ?',jsonb_build_array('Psychostimulant', 'Psychodépresseur', 'Artefact', 'Recapture'),jsonb_build_array('Psychostimulant'),'Le terme psychostimulant est associé à un effet excitateur dans la leçon.',20),
      (exercise_a_uuid,'single_choice','Quel effet le support attribue-t-il au diazépam ?',jsonb_build_array('Une diminution de l’amplitude et de la fréquence', 'Une augmentation continue de la recapture', 'Une production de myéline', 'Un potentiel de référence à 0 mV'),jsonb_build_array('Une diminution de l’amplitude et de la fréquence'),'Le diazépam est présenté avec une diminution de l’amplitude et de la fréquence, donc un effet inhibiteur dans le modèle du cours.',30);
  end if;

  exercise_b_uuid := null;
  insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
  select target.subject_id,target.level_id,target.series_id,target.chapter_id,target.lesson_id,'Exercice 2 — Drogues et communication synaptique','Distinguez libération, recapture et fixation afin d’interpréter les modes d’action synaptique étudiés.','La correction associe chaque mécanisme à l’étape correspondante de la communication synaptique.','single_choice','medium','## Consigne

Analysez chaque proposition puis justifiez-la par une notion précise du cours.','## Correction

La correction distingue les mécanismes étudiés et leur enchaînement.',false,false,20,20
  where not exists (select 1 from public.exercises e where e.lesson_id=target.lesson_id and e.title='Exercice 2 — Drogues et communication synaptique')
  returning id into exercise_b_uuid;
  if exercise_b_uuid is not null then
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
      (exercise_b_uuid,'single_choice','Quel mécanisme maintient davantage de neuromédiateur disponible dans la fente synaptique dans le modèle étudié ?',jsonb_build_array('Le blocage de la recapture', 'Le blocage de la libération', 'La destruction de l’axone', 'La formation de myéline'),jsonb_build_array('Le blocage de la recapture'),'Si la recapture est bloquée, le neuromédiateur reste davantage disponible dans la fente synaptique.',10),
      (exercise_b_uuid,'single_choice','Quelle étape est directement concernée lorsqu’une substance empêche le neuromédiateur d’agir sur la cellule postsynaptique ?',jsonb_build_array('La fixation sur les récepteurs', 'La formation du soma', 'La latence', 'La gaine conjonctive'),jsonb_build_array('La fixation sur les récepteurs'),'La fixation sur les récepteurs permet au neuromédiateur d’être reconnu par l’élément postsynaptique.',20),
      (exercise_b_uuid,'true_false','La prévention et la sensibilisation font partie des réponses proposées par le support face aux conséquences de la consommation de drogues.',jsonb_build_array('Vrai', 'Faux'),jsonb_build_array('Vrai'),'Le PDF cite explicitement la prévention et la sensibilisation, ainsi que la désintoxication et la rééducation.',30);
  end if;

  quiz_uuid := null;
  insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active)
  select target.subject_id,target.level_id,target.series_id,target.offering_id,target.chapter_id,target.lesson_id,'Quiz de révision — Drogues et système nerveux','Vérifiez la maîtrise du vocabulaire, des mécanismes et de la synthèse de la leçon.','medium',12,10,false,false
  where not exists (select 1 from public.quizzes q where q.lesson_id=target.lesson_id and q.title='Quiz de révision — Drogues et système nerveux')
  returning id into quiz_uuid;
  if quiz_uuid is not null then
    with inserted_questions as (
      insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
        (quiz_uuid,'Que désigne la recapture dans ce cours ?','C’est le retrait ou le retour d’un neuromédiateur après son action dans la fente synaptique.','single_choice',10,1,true),
        (quiz_uuid,'Quel neuromédiateur est cité dans l’activité sur des rats ?','L’activité du support porte sur la dopamine dans la fente synaptique.','single_choice',20,1,true),
        (quiz_uuid,'Quel enchaînement résume le raisonnement de la leçon ?','Une drogue modifie une communication synaptique, ce qui modifie l’activité nerveuse et peut avoir des conséquences individuelles et sociales.','single_choice',30,1,true),
        (quiz_uuid,'Quelle démarche est citée après la désintoxication dans les réponses du cours ?','La rééducation est explicitement mentionnée avec la désintoxication.','single_choice',40,1,true)
      returning id,display_order
    )
    insert into public.quiz_answers (question_id,answer,is_correct,display_order)
    select inserted_questions.id,answers.answer,answers.is_correct,answers.display_order
    from inserted_questions
    join (values
        (10,'Le retrait ou retour d’un neuromédiateur après son action',true,10),
        (10,'La fabrication d’un potentiel de repos',false,20),
        (20,'La dopamine',true,10),
        (20,'La myéline',false,20),
        (30,'Drogue → synapse → activité nerveuse → conséquences',true,10),
        (30,'Drogue → myéline → ATP → absence de prévention',false,20),
        (40,'La rééducation',true,10),
        (40,'La publication automatique d’un cours',false,20)
    ) as answers(question_order,answer,is_correct,display_order)
      on answers.question_order=inserted_questions.display_order;
  end if;
end;
$svt_terminal_c_lot1$;

do $svt_terminal_c_citations$
declare
  citation_seed record;
  citation_subject_uuid uuid;
  citation_uuid uuid;
begin
  for citation_seed in select * from (values
      ('Français','Je veux qu’on soit sincère, et qu’en homme d’honneur / On ne lâche aucun mot qui ne parte du cœur.','Molière','Le Misanthrope','Acte I, scène 1','https://fr.wikisource.org/wiki/Le_Misanthrope/%C3%89dition_Louandre,_1910/Acte_I','Cette citation éclaire la notion « Sincérité ». Elle aide l’élève à justifier une interprétation par le lexique, l’image, l’opposition ou la portée critique du texte.',array['Français', 'Molière', 'sincérité']::text[],'Sincérité'),
      ('Français','Le fond de notre cœur dans nos discours se montre.','Molière','Le Misanthrope','Acte I, scène 1','https://fr.wikisource.org/wiki/Le_Misanthrope/%C3%89dition_Louandre,_1910/Acte_I','Cette citation éclaire la notion « Sincérité ». Elle aide l’élève à justifier une interprétation par le lexique, l’image, l’opposition ou la portée critique du texte.',array['Français', 'Molière', 'sincérité']::text[],'Sincérité'),
      ('Français','Ces affables donneurs d’embrassades frivoles, ces obligeants diseurs d’inutiles paroles.','Molière','Le Misanthrope','Acte I, scène 1','https://fr.wikisource.org/wiki/Le_Misanthrope/%C3%89dition_Louandre,_1910/Acte_I','Cette citation éclaire la notion « Flatterie ». Elle aide l’élève à justifier une interprétation par le lexique, l’image, l’opposition ou la portée critique du texte.',array['Français', 'Molière', 'flatterie']::text[],'Flatterie'),
      ('Français','C’est n’estimer rien qu’estimer tout le monde.','Molière','Le Misanthrope','Acte I, scène 1','https://fr.wikisource.org/wiki/Le_Misanthrope/%C3%89dition_Louandre,_1910/Acte_I','Cette citation éclaire la notion « Flatterie ». Elle aide l’élève à justifier une interprétation par le lexique, l’image, l’opposition ou la portée critique du texte.',array['Français', 'Molière', 'flatterie']::text[],'Flatterie'),
      ('Français','De voir qu’avec le vice on garde des mesures.','Molière','Le Misanthrope','Acte I, scène 1','https://fr.wikisource.org/wiki/Le_Misanthrope/%C3%89dition_Louandre,_1910/Acte_I','Cette citation éclaire la notion « Justice et éthique ». Elle aide l’élève à justifier une interprétation par le lexique, l’image, l’opposition ou la portée critique du texte.',array['Français', 'Molière', 'justice et éthique']::text[],'Justice et éthique'),
      ('Français','Qui je veux ? La raison, mon bon droit, l’équité.','Molière','Le Misanthrope','Acte I, scène 1','https://fr.wikisource.org/wiki/Le_Misanthrope/%C3%89dition_Louandre,_1910/Acte_I','Cette citation éclaire la notion « Justice et éthique ». Elle aide l’élève à justifier une interprétation par le lexique, l’image, l’opposition ou la portée critique du texte.',array['Français', 'Molière', 'justice et éthique']::text[],'Justice et éthique'),
      ('Français','Mais la raison n’est pas ce qui règle l’amour.','Molière','Le Misanthrope','Acte I, scène 1','https://fr.wikisource.org/wiki/Le_Misanthrope/%C3%89dition_Louandre,_1910/Acte_I','Cette citation éclaire la notion « Raison et sentiment ». Elle aide l’élève à justifier une interprétation par le lexique, l’image, l’opposition ou la portée critique du texte.',array['Français', 'Molière', 'raison et sentiment']::text[],'Raison et sentiment'),
      ('Français','Je prends tout doucement les hommes comme ils sont.','Molière','Le Misanthrope','Acte I, scène 1','https://fr.wikisource.org/wiki/Le_Misanthrope/%C3%89dition_Louandre,_1910/Acte_I','Cette citation éclaire la notion « Raison et sentiment ». Elle aide l’élève à justifier une interprétation par le lexique, l’image, l’opposition ou la portée critique du texte.',array['Français', 'Molière', 'raison et sentiment']::text[],'Raison et sentiment'),
      ('Français','La Nature est un temple où de vivants piliers / Laissent parfois sortir de confuses paroles.','Charles Baudelaire','Les Fleurs du mal','« Correspondances »','https://fr.wikisource.org/wiki/Les_Fleurs_du_mal_(1861)/Texte_entier','Cette citation éclaire la notion « Symbolisme ». Elle aide l’élève à justifier une interprétation par le lexique, l’image, l’opposition ou la portée critique du texte.',array['Français', 'Charles Baudelaire', 'symbolisme']::text[],'Symbolisme'),
      ('Français','Les parfums, les couleurs et les sons se répondent.','Charles Baudelaire','Les Fleurs du mal','« Correspondances »','https://fr.wikisource.org/wiki/Les_Fleurs_du_mal_(1861)/Texte_entier','Cette citation éclaire la notion « Symbolisme ». Elle aide l’élève à justifier une interprétation par le lexique, l’image, l’opposition ou la portée critique du texte.',array['Français', 'Charles Baudelaire', 'symbolisme']::text[],'Symbolisme'),
      ('Français','Le Poète est semblable au prince des nuées.','Charles Baudelaire','Les Fleurs du mal','« L’Albatros »','https://fr.wikisource.org/wiki/Les_Fleurs_du_mal_(1861)/Texte_entier','Cette citation éclaire la notion « Condition du poète ». Elle aide l’élève à justifier une interprétation par le lexique, l’image, l’opposition ou la portée critique du texte.',array['Français', 'Charles Baudelaire', 'condition du poète']::text[],'Condition du poète'),
      ('Français','Ses ailes de géant l’empêchent de marcher.','Charles Baudelaire','Les Fleurs du mal','« L’Albatros »','https://fr.wikisource.org/wiki/Les_Fleurs_du_mal_(1861)/Texte_entier','Cette citation éclaire la notion « Condition du poète ». Elle aide l’élève à justifier une interprétation par le lexique, l’image, l’opposition ou la portée critique du texte.',array['Français', 'Charles Baudelaire', 'condition du poète']::text[],'Condition du poète'),
      ('Français','L’Art est long et le Temps est court.','Charles Baudelaire','Les Fleurs du mal','« Le Guignon »','https://fr.wikisource.org/wiki/Les_Fleurs_du_mal_(1861)/Texte_entier','Cette citation éclaire la notion « Temps et création ». Elle aide l’élève à justifier une interprétation par le lexique, l’image, l’opposition ou la portée critique du texte.',array['Français', 'Charles Baudelaire', 'temps et création']::text[],'Temps et création'),
      ('Français','Le Temps mange la vie.','Charles Baudelaire','Les Fleurs du mal','« L’Ennemi »','https://fr.wikisource.org/wiki/Les_Fleurs_du_mal_(1861)/Texte_entier','Cette citation éclaire la notion « Temps et création ». Elle aide l’élève à justifier une interprétation par le lexique, l’image, l’opposition ou la portée critique du texte.',array['Français', 'Charles Baudelaire', 'temps et création']::text[],'Temps et création'),
      ('Français','Homme libre, toujours tu chériras la mer !','Charles Baudelaire','Les Fleurs du mal','« L’Homme et la Mer »','https://fr.wikisource.org/wiki/Les_Fleurs_du_mal_(1861)/Texte_entier','Cette citation éclaire la notion « Mer et intériorité ». Elle aide l’élève à justifier une interprétation par le lexique, l’image, l’opposition ou la portée critique du texte.',array['Français', 'Charles Baudelaire', 'mer et intériorité']::text[],'Mer et intériorité'),
      ('Français','La mer est ton miroir ; tu contemples ton âme.','Charles Baudelaire','Les Fleurs du mal','« L’Homme et la Mer »','https://fr.wikisource.org/wiki/Les_Fleurs_du_mal_(1861)/Texte_entier','Cette citation éclaire la notion « Mer et intériorité ». Elle aide l’élève à justifier une interprétation par le lexique, l’image, l’opposition ou la portée critique du texte.',array['Français', 'Charles Baudelaire', 'mer et intériorité']::text[],'Mer et intériorité'),
      ('Français','En toute chose il faut considérer la fin.','Jean de La Fontaine','Fables choisies, mises en vers','Livre IX, fable II, « Le Curé et le Mort »','https://fr.wikisource.org/wiki/Fables_de_La_Fontaine_(%C3%A9d._Barbin)','Cette citation éclaire la notion « Fable et réflexion ». Elle aide l’élève à justifier une interprétation par le lexique, l’image, l’opposition ou la portée critique du texte.',array['Français', 'Jean de La Fontaine', 'fable et réflexion']::text[],'Fable et réflexion'),
      ('Français','Trompeurs, c’est pour vous que j’écris : attendez-vous à la pareille.','Jean de La Fontaine','Fables choisies, mises en vers','Livre I, fable XIV, « Le Renard et la Cigogne »','https://fr.wikisource.org/wiki/Fables_de_La_Fontaine_(%C3%A9d._Barbin)','Cette citation éclaire la notion « Fable et réflexion ». Elle aide l’élève à justifier une interprétation par le lexique, l’image, l’opposition ou la portée critique du texte.',array['Français', 'Jean de La Fontaine', 'fable et réflexion']::text[],'Fable et réflexion'),
      ('Français','Les lois, dans la signification la plus étendue, sont les rapports nécessaires qui dérivent de la nature des choses.','Montesquieu','De l’esprit des lois','Livre I, chapitre I','https://fr.wikisource.org/wiki/De_l%E2%80%99esprit_des_lois_(%C3%A9d._Nourse)/Texte_entier','Cette citation éclaire la notion « Loi et justice ». Elle aide l’élève à justifier une interprétation par le lexique, l’image, l’opposition ou la portée critique du texte.',array['Français', 'Montesquieu', 'loi et justice']::text[],'Loi et justice'),
      ('Français','La loi, en général, est la raison humaine.','Montesquieu','De l’esprit des lois','Livre I, chapitre III','https://fr.wikisource.org/wiki/De_l%E2%80%99esprit_des_lois_(%C3%A9d._Nourse)/Texte_entier','Cette citation éclaire la notion « Loi et justice ». Elle aide l’élève à justifier une interprétation par le lexique, l’image, l’opposition ou la portée critique du texte.',array['Français', 'Montesquieu', 'loi et justice']::text[],'Loi et justice'),
      ('Philosophie','Les loix, dans la signification la plus étendue, sont les rapports nécessaires qui dérivent de la nature des choses.','Montesquieu','De l’esprit des lois','Livre I, chapitre I','https://fr.wikisource.org/wiki/De_l%E2%80%99esprit_des_lois_(%C3%A9d._Nourse)/Texte_entier','Cette citation permet d’étudier la notion « Loi naturelle ». Elle fournit un appui précis pour formuler une thèse, définir un concept et construire une argumentation raisonnée.',array['Philosophie', 'Montesquieu', 'loi naturelle']::text[],'Loi naturelle'),
      ('Philosophie','La paix seroit la premiere loi naturelle.','Montesquieu','De l’esprit des lois','Livre I, chapitre II','https://fr.wikisource.org/wiki/De_l%E2%80%99esprit_des_lois_(%C3%A9d._Nourse)/Texte_entier','Cette citation permet d’étudier la notion « Loi naturelle ». Elle fournit un appui précis pour formuler une thèse, définir un concept et construire une argumentation raisonnée.',array['Philosophie', 'Montesquieu', 'loi naturelle']::text[],'Loi naturelle'),
      ('Philosophie','Le desir de vivre en société est une quatrieme loi naturelle.','Montesquieu','De l’esprit des lois','Livre I, chapitre II','https://fr.wikisource.org/wiki/De_l%E2%80%99esprit_des_lois_(%C3%A9d._Nourse)/Texte_entier','Cette citation permet d’étudier la notion « Société ». Elle fournit un appui précis pour formuler une thèse, définir un concept et construire une argumentation raisonnée.',array['Philosophie', 'Montesquieu', 'société']::text[],'Société'),
      ('Philosophie','L’homme dans l’état de nature auroit plutôt la faculté de connoître, qu’il n’auroit des connoissances.','Montesquieu','De l’esprit des lois','Livre I, chapitre II','https://fr.wikisource.org/wiki/De_l%E2%80%99esprit_des_lois_(%C3%A9d._Nourse)/Texte_entier','Cette citation permet d’étudier la notion « Société ». Elle fournit un appui précis pour formuler une thèse, définir un concept et construire une argumentation raisonnée.',array['Philosophie', 'Montesquieu', 'société']::text[],'Société'),
      ('Philosophie','Le droit des gens est naturellement fondé sur ce principe, que les diverses nations doivent le faire dans la paix le plus de bien ; et dans la guerre le moins de mal qu’il est possible.','Montesquieu','De l’esprit des lois','Livre I, chapitre III','https://fr.wikisource.org/wiki/De_l%E2%80%99esprit_des_lois_(%C3%A9d._Nourse)/Texte_entier','Cette citation permet d’étudier la notion « Droit des gens ». Elle fournit un appui précis pour formuler une thèse, définir un concept et construire une argumentation raisonnée.',array['Philosophie', 'Montesquieu', 'droit des gens']::text[],'Droit des gens'),
      ('Philosophie','Considérés comme habitans d’une si grande planette, qu’il est nécessaire qu’il y ait différens peuples, ils ont des loix dans le rapport que ces peuples ont entr’eux.','Montesquieu','De l’esprit des lois','Livre I, chapitre III','https://fr.wikisource.org/wiki/De_l%E2%80%99esprit_des_lois_(%C3%A9d._Nourse)/Texte_entier','Cette citation permet d’étudier la notion « Droit des gens ». Elle fournit un appui précis pour formuler une thèse, définir un concept et construire une argumentation raisonnée.',array['Philosophie', 'Montesquieu', 'droit des gens']::text[],'Droit des gens'),
      ('Philosophie','La loi, en général, est la raison humaine, en tant qu’elle gouverne tous les peuples de la terre.','Montesquieu','De l’esprit des lois','Livre I, chapitre III','https://fr.wikisource.org/wiki/De_l%E2%80%99esprit_des_lois_(%C3%A9d._Nourse)/Texte_entier','Cette citation permet d’étudier la notion « Raison et loi ». Elle fournit un appui précis pour formuler une thèse, définir un concept et construire une argumentation raisonnée.',array['Philosophie', 'Montesquieu', 'raison et loi']::text[],'Raison et loi'),
      ('Philosophie','Les loix politiques et civiles de chaque nation, ne doivent être que les cas particuliers où s’applique cette raison humaine.','Montesquieu','De l’esprit des lois','Livre I, chapitre III','https://fr.wikisource.org/wiki/De_l%E2%80%99esprit_des_lois_(%C3%A9d._Nourse)/Texte_entier','Cette citation permet d’étudier la notion « Raison et loi ». Elle fournit un appui précis pour formuler une thèse, définir un concept et construire une argumentation raisonnée.',array['Philosophie', 'Montesquieu', 'raison et loi']::text[],'Raison et loi'),
      ('Philosophie','Les êtres particuliers intelligens sont bornés par leur nature, et par conséquent sujets à l’erreur.','Montesquieu','De l’esprit des lois','Livre I, chapitre I','https://fr.wikisource.org/wiki/De_l%E2%80%99esprit_des_lois_(%C3%A9d._Nourse)/Texte_entier','Cette citation permet d’étudier la notion « Limites humaines ». Elle fournit un appui précis pour formuler une thèse, définir un concept et construire une argumentation raisonnée.',array['Philosophie', 'Montesquieu', 'limites humaines']::text[],'Limites humaines'),
      ('Philosophie','Il est de leur nature qu’ils agissent par eux-mêmes.','Montesquieu','De l’esprit des lois','Livre I, chapitre I','https://fr.wikisource.org/wiki/De_l%E2%80%99esprit_des_lois_(%C3%A9d._Nourse)/Texte_entier','Cette citation permet d’étudier la notion « Limites humaines ». Elle fournit un appui précis pour formuler une thèse, définir un concept et construire une argumentation raisonnée.',array['Philosophie', 'Montesquieu', 'limites humaines']::text[],'Limites humaines'),
      ('Philosophie','L’essentiel n’est point dans les actions, que l’on voit, mais dans ces principes intérieurs des actions, que l’on ne voit pas.','Emmanuel Kant','Fondements de la métaphysique des mœurs','Deuxième section','https://fr.wikisource.org/wiki/Fondements_de_la_m%C3%A9taphysique_des_m%C5%93urs_(trad._Delbos)/Deuxi%C3%A8me_section','Cette citation permet d’étudier la notion « Devoir ». Elle fournit un appui précis pour formuler une thèse, définir un concept et construire une argumentation raisonnée.',array['Philosophie', 'Emmanuel Kant', 'devoir']::text[],'Devoir'),
      ('Philosophie','La raison commande par elle-même et indépendamment de tous les faits donnés ce qui doit avoir lieu.','Emmanuel Kant','Fondements de la métaphysique des mœurs','Deuxième section','https://fr.wikisource.org/wiki/Fondements_de_la_m%C3%A9taphysique_des_m%C5%93urs_(trad._Delbos)/Deuxi%C3%A8me_section','Cette citation permet d’étudier la notion « Devoir ». Elle fournit un appui précis pour formuler une thèse, définir un concept et construire une argumentation raisonnée.',array['Philosophie', 'Emmanuel Kant', 'devoir']::text[],'Devoir'),
      ('Philosophie','En matière morale l’imitation n’a aucune place.','Emmanuel Kant','Fondements de la métaphysique des mœurs','Deuxième section','https://fr.wikisource.org/wiki/Fondements_de_la_m%C3%A9taphysique_des_m%C5%93urs_(trad._Delbos)/Deuxi%C3%A8me_section','Cette citation permet d’étudier la notion « Exemple moral ». Elle fournit un appui précis pour formuler une thèse, définir un concept et construire une argumentation raisonnée.',array['Philosophie', 'Emmanuel Kant', 'exemple moral']::text[],'Exemple moral'),
      ('Philosophie','Des exemples ne servent qu’à encourager.','Emmanuel Kant','Fondements de la métaphysique des mœurs','Deuxième section','https://fr.wikisource.org/wiki/Fondements_de_la_m%C3%A9taphysique_des_m%C5%93urs_(trad._Delbos)/Deuxi%C3%A8me_section','Cette citation permet d’étudier la notion « Exemple moral ». Elle fournit un appui précis pour formuler une thèse, définir un concept et construire une argumentation raisonnée.',array['Philosophie', 'Emmanuel Kant', 'exemple moral']::text[],'Exemple moral'),
      ('Philosophie','La loi morale ait une signification à ce point étendue qu’elle doive valoir non seulement pour des hommes, mais pour tous les êtres raisonnables en général.','Emmanuel Kant','Fondements de la métaphysique des mœurs','Deuxième section','https://fr.wikisource.org/wiki/Fondements_de_la_m%C3%A9taphysique_des_m%C5%93urs_(trad._Delbos)/Deuxi%C3%A8me_section','Cette citation permet d’étudier la notion « Universalité ». Elle fournit un appui précis pour formuler une thèse, définir un concept et construire une argumentation raisonnée.',array['Philosophie', 'Emmanuel Kant', 'universalité']::text[],'Universalité'),
      ('Philosophie','Les concepts moraux ont leur siège et leur origine complètement a priori dans la raison.','Emmanuel Kant','Fondements de la métaphysique des mœurs','Deuxième section','https://fr.wikisource.org/wiki/Fondements_de_la_m%C3%A9taphysique_des_m%C5%93urs_(trad._Delbos)/Deuxi%C3%A8me_section','Cette citation permet d’étudier la notion « Universalité ». Elle fournit un appui précis pour formuler une thèse, définir un concept et construire une argumentation raisonnée.',array['Philosophie', 'Emmanuel Kant', 'universalité']::text[],'Universalité'),
      ('Philosophie','La pureté d’origine les rend précisément dignes comme ils le sont de nous servir de principes pratiques suprêmes.','Emmanuel Kant','Fondements de la métaphysique des mœurs','Deuxième section','https://fr.wikisource.org/wiki/Fondements_de_la_m%C3%A9taphysique_des_m%C5%93urs_(trad._Delbos)/Deuxi%C3%A8me_section','Cette citation permet d’étudier la notion « Valeur morale ». Elle fournit un appui précis pour formuler une thèse, définir un concept et construire une argumentation raisonnée.',array['Philosophie', 'Emmanuel Kant', 'valeur morale']::text[],'Valeur morale'),
      ('Philosophie','Tout ce qu’on ajoute d’empirique est autant d’enlevé à leur véritable influence et à la valeur absolue des actions.','Emmanuel Kant','Fondements de la métaphysique des mœurs','Deuxième section','https://fr.wikisource.org/wiki/Fondements_de_la_m%C3%A9taphysique_des_m%C5%93urs_(trad._Delbos)/Deuxi%C3%A8me_section','Cette citation permet d’étudier la notion « Valeur morale ». Elle fournit un appui précis pour formuler une thèse, définir un concept et construire une argumentation raisonnée.',array['Philosophie', 'Emmanuel Kant', 'valeur morale']::text[],'Valeur morale'),
      ('Philosophie','Toute chose dans la nature agit d’après des lois.','Emmanuel Kant','Fondements de la métaphysique des mœurs','Deuxième section','https://fr.wikisource.org/wiki/Fondements_de_la_m%C3%A9taphysique_des_m%C5%93urs_(trad._Delbos)/Deuxi%C3%A8me_section','Cette citation permet d’étudier la notion « Rationalité ». Elle fournit un appui précis pour formuler une thèse, définir un concept et construire une argumentation raisonnée.',array['Philosophie', 'Emmanuel Kant', 'rationalité']::text[],'Rationalité'),
      ('Philosophie','Il n’y a qu’un être raisonnable qui ait la faculté d’agir d’après la représentation des lois.','Emmanuel Kant','Fondements de la métaphysique des mœurs','Deuxième section','https://fr.wikisource.org/wiki/Fondements_de_la_m%C3%A9taphysique_des_m%C5%93urs_(trad._Delbos)/Deuxi%C3%A8me_section','Cette citation permet d’étudier la notion « Rationalité ». Elle fournit un appui précis pour formuler une thèse, définir un concept et construire une argumentation raisonnée.',array['Philosophie', 'Emmanuel Kant', 'rationalité']::text[],'Rationalité'),
      ('Histoire-Géographie','La reconnaissance de la dignité inhérente à tous les membres de la famille humaine et de leurs droits égaux et inaliénables constitue le fondement de la liberté, de la justice et de la paix dans le monde.','Assemblée générale des Nations Unies','Déclaration universelle des droits de l’homme','Préambule','https://www.un.org/fr/about-us/universal-declaration-of-human-rights','Cette citation de la Déclaration universelle des droits de l’homme éclaire la notion « Dignité humaine ». Elle permet de relier droits, citoyenneté, institutions et relations internationales à un texte de référence.',array['Histoire-Géographie', 'Assemblée générale des Nations Unies', 'dignité humaine']::text[],'Dignité humaine'),
      ('Histoire-Géographie','Ils sont doués de raison et de conscience et doivent agir les uns envers les autres dans un esprit de fraternité.','Assemblée générale des Nations Unies','Déclaration universelle des droits de l’homme','Article 1','https://www.un.org/fr/about-us/universal-declaration-of-human-rights','Cette citation de la Déclaration universelle des droits de l’homme éclaire la notion « Dignité humaine ». Elle permet de relier droits, citoyenneté, institutions et relations internationales à un texte de référence.',array['Histoire-Géographie', 'Assemblée générale des Nations Unies', 'dignité humaine']::text[],'Dignité humaine'),
      ('Histoire-Géographie','Chacun peut se prévaloir de tous les droits et de toutes les libertés proclamés dans la présente Déclaration, sans distinction aucune.','Assemblée générale des Nations Unies','Déclaration universelle des droits de l’homme','Article 2, paragraphe 1','https://www.un.org/fr/about-us/universal-declaration-of-human-rights','Cette citation de la Déclaration universelle des droits de l’homme éclaire la notion « Non-discrimination ». Elle permet de relier droits, citoyenneté, institutions et relations internationales à un texte de référence.',array['Histoire-Géographie', 'Assemblée générale des Nations Unies', 'non-discrimination']::text[],'Non-discrimination'),
      ('Histoire-Géographie','Il ne sera fait aucune distinction fondée sur le statut politique, juridique ou international du pays ou du territoire dont une personne est ressortissante.','Assemblée générale des Nations Unies','Déclaration universelle des droits de l’homme','Article 2, paragraphe 2','https://www.un.org/fr/about-us/universal-declaration-of-human-rights','Cette citation de la Déclaration universelle des droits de l’homme éclaire la notion « Non-discrimination ». Elle permet de relier droits, citoyenneté, institutions et relations internationales à un texte de référence.',array['Histoire-Géographie', 'Assemblée générale des Nations Unies', 'non-discrimination']::text[],'Non-discrimination'),
      ('Histoire-Géographie','Nul ne sera l’objet d’immixtions arbitraires dans sa vie privée, sa famille, son domicile ou sa correspondance.','Assemblée générale des Nations Unies','Déclaration universelle des droits de l’homme','Article 12','https://www.un.org/fr/about-us/universal-declaration-of-human-rights','Cette citation de la Déclaration universelle des droits de l’homme éclaire la notion « Vie privée ». Elle permet de relier droits, citoyenneté, institutions et relations internationales à un texte de référence.',array['Histoire-Géographie', 'Assemblée générale des Nations Unies', 'vie privée']::text[],'Vie privée'),
      ('Histoire-Géographie','Toute personne a droit à la protection de la loi contre de telles immixtions ou de telles atteintes.','Assemblée générale des Nations Unies','Déclaration universelle des droits de l’homme','Article 12','https://www.un.org/fr/about-us/universal-declaration-of-human-rights','Cette citation de la Déclaration universelle des droits de l’homme éclaire la notion « Vie privée ». Elle permet de relier droits, citoyenneté, institutions et relations internationales à un texte de référence.',array['Histoire-Géographie', 'Assemblée générale des Nations Unies', 'vie privée']::text[],'Vie privée'),
      ('Histoire-Géographie','Toute personne a le droit de circuler librement et de choisir sa résidence à l’intérieur d’un Etat.','Assemblée générale des Nations Unies','Déclaration universelle des droits de l’homme','Article 13, paragraphe 1','https://www.un.org/fr/about-us/universal-declaration-of-human-rights','Cette citation de la Déclaration universelle des droits de l’homme éclaire la notion « Mobilité ». Elle permet de relier droits, citoyenneté, institutions et relations internationales à un texte de référence.',array['Histoire-Géographie', 'Assemblée générale des Nations Unies', 'mobilité']::text[],'Mobilité'),
      ('Histoire-Géographie','Toute personne a le droit de quitter tout pays, y compris le sien, et de revenir dans son pays.','Assemblée générale des Nations Unies','Déclaration universelle des droits de l’homme','Article 13, paragraphe 2','https://www.un.org/fr/about-us/universal-declaration-of-human-rights','Cette citation de la Déclaration universelle des droits de l’homme éclaire la notion « Mobilité ». Elle permet de relier droits, citoyenneté, institutions et relations internationales à un texte de référence.',array['Histoire-Géographie', 'Assemblée générale des Nations Unies', 'mobilité']::text[],'Mobilité'),
      ('Histoire-Géographie','Tout individu a droit à une nationalité.','Assemblée générale des Nations Unies','Déclaration universelle des droits de l’homme','Article 15, paragraphe 1','https://www.un.org/fr/about-us/universal-declaration-of-human-rights','Cette citation de la Déclaration universelle des droits de l’homme éclaire la notion « Nationalité ». Elle permet de relier droits, citoyenneté, institutions et relations internationales à un texte de référence.',array['Histoire-Géographie', 'Assemblée générale des Nations Unies', 'nationalité']::text[],'Nationalité'),
      ('Histoire-Géographie','Nul ne peut être arbitrairement privé de sa nationalité, ni du droit de changer de nationalité.','Assemblée générale des Nations Unies','Déclaration universelle des droits de l’homme','Article 15, paragraphe 2','https://www.un.org/fr/about-us/universal-declaration-of-human-rights','Cette citation de la Déclaration universelle des droits de l’homme éclaire la notion « Nationalité ». Elle permet de relier droits, citoyenneté, institutions et relations internationales à un texte de référence.',array['Histoire-Géographie', 'Assemblée générale des Nations Unies', 'nationalité']::text[],'Nationalité'),
      ('Histoire-Géographie','Le mariage ne peut être conclu qu’avec le libre et plein consentement des futurs époux.','Assemblée générale des Nations Unies','Déclaration universelle des droits de l’homme','Article 16, paragraphe 2','https://www.un.org/fr/about-us/universal-declaration-of-human-rights','Cette citation de la Déclaration universelle des droits de l’homme éclaire la notion « Famille ». Elle permet de relier droits, citoyenneté, institutions et relations internationales à un texte de référence.',array['Histoire-Géographie', 'Assemblée générale des Nations Unies', 'famille']::text[],'Famille'),
      ('Histoire-Géographie','La famille est l’élément naturel et fondamental de la société et a droit à la protection de la société et de l’Etat.','Assemblée générale des Nations Unies','Déclaration universelle des droits de l’homme','Article 16, paragraphe 3','https://www.un.org/fr/about-us/universal-declaration-of-human-rights','Cette citation de la Déclaration universelle des droits de l’homme éclaire la notion « Famille ». Elle permet de relier droits, citoyenneté, institutions et relations internationales à un texte de référence.',array['Histoire-Géographie', 'Assemblée générale des Nations Unies', 'famille']::text[],'Famille'),
      ('Histoire-Géographie','Toute personne a droit au travail, au libre choix de son travail, à des conditions équitables et satisfaisantes de travail et à la protection contre le chômage.','Assemblée générale des Nations Unies','Déclaration universelle des droits de l’homme','Article 23, paragraphe 1','https://www.un.org/fr/about-us/universal-declaration-of-human-rights','Cette citation de la Déclaration universelle des droits de l’homme éclaire la notion « Travail ». Elle permet de relier droits, citoyenneté, institutions et relations internationales à un texte de référence.',array['Histoire-Géographie', 'Assemblée générale des Nations Unies', 'travail']::text[],'Travail'),
      ('Histoire-Géographie','Tous ont droit, sans aucune discrimination, à un salaire égal pour un travail égal.','Assemblée générale des Nations Unies','Déclaration universelle des droits de l’homme','Article 23, paragraphe 2','https://www.un.org/fr/about-us/universal-declaration-of-human-rights','Cette citation de la Déclaration universelle des droits de l’homme éclaire la notion « Travail ». Elle permet de relier droits, citoyenneté, institutions et relations internationales à un texte de référence.',array['Histoire-Géographie', 'Assemblée générale des Nations Unies', 'travail']::text[],'Travail'),
      ('Histoire-Géographie','Toute personne, en tant que membre de la société, a droit à la sécurité sociale.','Assemblée générale des Nations Unies','Déclaration universelle des droits de l’homme','Article 22','https://www.un.org/fr/about-us/universal-declaration-of-human-rights','Cette citation de la Déclaration universelle des droits de l’homme éclaire la notion « Sécurité sociale ». Elle permet de relier droits, citoyenneté, institutions et relations internationales à un texte de référence.',array['Histoire-Géographie', 'Assemblée générale des Nations Unies', 'sécurité sociale']::text[],'Sécurité sociale'),
      ('Histoire-Géographie','Toute personne a droit à un niveau de vie suffisant pour assurer sa santé, son bien-être et ceux de sa famille.','Assemblée générale des Nations Unies','Déclaration universelle des droits de l’homme','Article 25, paragraphe 1','https://www.un.org/fr/about-us/universal-declaration-of-human-rights','Cette citation de la Déclaration universelle des droits de l’homme éclaire la notion « Sécurité sociale ». Elle permet de relier droits, citoyenneté, institutions et relations internationales à un texte de référence.',array['Histoire-Géographie', 'Assemblée générale des Nations Unies', 'sécurité sociale']::text[],'Sécurité sociale'),
      ('Histoire-Géographie','Toute personne a droit à l’éducation.','Assemblée générale des Nations Unies','Déclaration universelle des droits de l’homme','Article 26, paragraphe 1','https://www.un.org/fr/about-us/universal-declaration-of-human-rights','Cette citation de la Déclaration universelle des droits de l’homme éclaire la notion « Éducation ». Elle permet de relier droits, citoyenneté, institutions et relations internationales à un texte de référence.',array['Histoire-Géographie', 'Assemblée générale des Nations Unies', 'éducation']::text[],'Éducation'),
      ('Histoire-Géographie','L’éducation doit viser au plein épanouissement de la personnalité humaine et au renforcement du respect des droits de l’homme et des libertés fondamentales.','Assemblée générale des Nations Unies','Déclaration universelle des droits de l’homme','Article 26, paragraphe 2','https://www.un.org/fr/about-us/universal-declaration-of-human-rights','Cette citation de la Déclaration universelle des droits de l’homme éclaire la notion « Éducation ». Elle permet de relier droits, citoyenneté, institutions et relations internationales à un texte de référence.',array['Histoire-Géographie', 'Assemblée générale des Nations Unies', 'éducation']::text[],'Éducation'),
      ('Histoire-Géographie','Toute personne a le droit de prendre part librement à la vie culturelle de la communauté, de jouir des arts et de participer au progrès scientifique et aux bienfaits qui en résultent.','Assemblée générale des Nations Unies','Déclaration universelle des droits de l’homme','Article 27, paragraphe 1','https://www.un.org/fr/about-us/universal-declaration-of-human-rights','Cette citation de la Déclaration universelle des droits de l’homme éclaire la notion « Culture et science ». Elle permet de relier droits, citoyenneté, institutions et relations internationales à un texte de référence.',array['Histoire-Géographie', 'Assemblée générale des Nations Unies', 'culture et science']::text[],'Culture et science'),
      ('Histoire-Géographie','Chacun a droit à la protection des intérêts moraux et matériels découlant de toute production scientifique, littéraire ou artistique dont il est l’auteur.','Assemblée générale des Nations Unies','Déclaration universelle des droits de l’homme','Article 27, paragraphe 2','https://www.un.org/fr/about-us/universal-declaration-of-human-rights','Cette citation de la Déclaration universelle des droits de l’homme éclaire la notion « Culture et science ». Elle permet de relier droits, citoyenneté, institutions et relations internationales à un texte de référence.',array['Histoire-Géographie', 'Assemblée générale des Nations Unies', 'culture et science']::text[],'Culture et science'),
      ('Physique-Chimie','Mais l’homme ne se borne pas à voir ; il pense et veut connaître la signification des phénomènes dont l’observation lui a révélé l’existence.','Claude Bernard','Introduction à l’étude de la médecine expérimentale','Première partie, chapitre I','https://fr.wikisource.org/wiki/Introduction_%C3%A0_l%E2%80%99%C3%A9tude_de_la_m%C3%A9decine_exp%C3%A9rimentale/Premi%C3%A8re_partie/Chapitre_II','Cette formulation met en évidence la notion « Investigation ». Elle aide à distinguer observation, hypothèse, expérimentation, vérification et esprit critique dans une démarche scientifique.',array['Physique-Chimie', 'Claude Bernard', 'investigation']::text[],'Investigation'),
      ('Physique-Chimie','C’est ce genre de contrôle, au moyen du raisonnement et des faits, qui constitue, à proprement parler, l’expérience.','Claude Bernard','Introduction à l’étude de la médecine expérimentale','Première partie, chapitre I','https://fr.wikisource.org/wiki/Introduction_%C3%A0_l%E2%80%99%C3%A9tude_de_la_m%C3%A9decine_exp%C3%A9rimentale/Premi%C3%A8re_partie/Chapitre_II','Cette formulation met en évidence la notion « Investigation ». Elle aide à distinguer observation, hypothèse, expérimentation, vérification et esprit critique dans une démarche scientifique.',array['Physique-Chimie', 'Claude Bernard', 'investigation']::text[],'Investigation'),
      ('Physique-Chimie','Les effets varient en raison des conditions qui les manifestent, mais les lois ne varient pas.','Claude Bernard','Introduction à l’étude de la médecine expérimentale','Première partie, chapitre I','https://fr.wikisource.org/wiki/Introduction_%C3%A0_l%E2%80%99%C3%A9tude_de_la_m%C3%A9decine_exp%C3%A9rimentale/Premi%C3%A8re_partie/Chapitre_II','Cette formulation met en évidence la notion « Conditions et lois ». Elle aide à distinguer observation, hypothèse, expérimentation, vérification et esprit critique dans une démarche scientifique.',array['Physique-Chimie', 'Claude Bernard', 'conditions et lois']::text[],'Conditions et lois'),
      ('Physique-Chimie','L’état physiologique et l’état pathologique sont régis par les mêmes forces, et ils ne diffèrent que par les conditions particulières dans lesquelles la loi vitale se manifeste.','Claude Bernard','Introduction à l’étude de la médecine expérimentale','Première partie, chapitre I','https://fr.wikisource.org/wiki/Introduction_%C3%A0_l%E2%80%99%C3%A9tude_de_la_m%C3%A9decine_exp%C3%A9rimentale/Premi%C3%A8re_partie/Chapitre_II','Cette formulation met en évidence la notion « Conditions et lois ». Elle aide à distinguer observation, hypothèse, expérimentation, vérification et esprit critique dans une démarche scientifique.',array['Physique-Chimie', 'Claude Bernard', 'conditions et lois']::text[],'Conditions et lois'),
      ('Physique-Chimie','La méthode expérimentale a pour objet de transformer cette conception à priori fondée sur une intuition ou un sentiment vague des choses, en une interprétation à posteriori établie sur l’étude expérimentale des phénomènes.','Claude Bernard','Introduction à l’étude de la médecine expérimentale','Première partie, chapitre II','https://fr.wikisource.org/wiki/Introduction_%C3%A0_l%E2%80%99%C3%A9tude_de_la_m%C3%A9decine_exp%C3%A9rimentale/Premi%C3%A8re_partie/Chapitre_II','Cette formulation met en évidence la notion « Méthode expérimentale ». Elle aide à distinguer observation, hypothèse, expérimentation, vérification et esprit critique dans une démarche scientifique.',array['Physique-Chimie', 'Claude Bernard', 'méthode expérimentale']::text[],'Méthode expérimentale'),
      ('Physique-Chimie','Pour arriver à la vérité, il doit, au contraire, étudier les lois naturelles et soumettre ses idées, sinon sa raison, à l’expérience, c’est-à-dire au critérium des faits.','Claude Bernard','Introduction à l’étude de la médecine expérimentale','Première partie, chapitre II','https://fr.wikisource.org/wiki/Introduction_%C3%A0_l%E2%80%99%C3%A9tude_de_la_m%C3%A9decine_exp%C3%A9rimentale/Premi%C3%A8re_partie/Chapitre_II','Cette formulation met en évidence la notion « Méthode expérimentale ». Elle aide à distinguer observation, hypothèse, expérimentation, vérification et esprit critique dans une démarche scientifique.',array['Physique-Chimie', 'Claude Bernard', 'méthode expérimentale']::text[],'Méthode expérimentale'),
      ('Physique-Chimie','Il marche ainsi des vérités partielles à des vérités plus générales, mais sans jamais oser prétendre qu’il tient la vérité absolue.','Claude Bernard','Introduction à l’étude de la médecine expérimentale','Première partie, chapitre II','https://fr.wikisource.org/wiki/Introduction_%C3%A0_l%E2%80%99%C3%A9tude_de_la_m%C3%A9decine_exp%C3%A9rimentale/Premi%C3%A8re_partie/Chapitre_II','Cette formulation met en évidence la notion « Vérité relative ». Elle aide à distinguer observation, hypothèse, expérimentation, vérification et esprit critique dans une démarche scientifique.',array['Physique-Chimie', 'Claude Bernard', 'vérité relative']::text[],'Vérité relative'),
      ('Physique-Chimie','L’expérience ne donne que la vérité relative sans jamais pouvoir prouver à l’esprit qu’il la possède d’une manière absolue.','Claude Bernard','Introduction à l’étude de la médecine expérimentale','Première partie, chapitre II','https://fr.wikisource.org/wiki/Introduction_%C3%A0_l%E2%80%99%C3%A9tude_de_la_m%C3%A9decine_exp%C3%A9rimentale/Premi%C3%A8re_partie/Chapitre_II','Cette formulation met en évidence la notion « Vérité relative ». Elle aide à distinguer observation, hypothèse, expérimentation, vérification et esprit critique dans une démarche scientifique.',array['Physique-Chimie', 'Claude Bernard', 'vérité relative']::text[],'Vérité relative'),
      ('Physique-Chimie','Une idée anticipée ou une hypothèse est donc le point de départ nécessaire de tout raisonnement expérimental.','Claude Bernard','Introduction à l’étude de la médecine expérimentale','Première partie, chapitre II','https://fr.wikisource.org/wiki/Introduction_%C3%A0_l%E2%80%99%C3%A9tude_de_la_m%C3%A9decine_exp%C3%A9rimentale/Premi%C3%A8re_partie/Chapitre_II','Cette formulation met en évidence la notion « Hypothèse ». Elle aide à distinguer observation, hypothèse, expérimentation, vérification et esprit critique dans une démarche scientifique.',array['Physique-Chimie', 'Claude Bernard', 'hypothèse']::text[],'Hypothèse'),
      ('Physique-Chimie','L’idée expérimentale n’est point arbitraire ni purement imaginaire ; elle doit avoir toujours un point d’appui dans la réalité observée.','Claude Bernard','Introduction à l’étude de la médecine expérimentale','Première partie, chapitre II','https://fr.wikisource.org/wiki/Introduction_%C3%A0_l%E2%80%99%C3%A9tude_de_la_m%C3%A9decine_exp%C3%A9rimentale/Premi%C3%A8re_partie/Chapitre_II','Cette formulation met en évidence la notion « Hypothèse ». Elle aide à distinguer observation, hypothèse, expérimentation, vérification et esprit critique dans une démarche scientifique.',array['Physique-Chimie', 'Claude Bernard', 'hypothèse']::text[],'Hypothèse'),
      ('Physique-Chimie','Douter de tout ou tout croire, ce sont deux solutions également commodes, qui l’une et l’autre nous dispensent de réfléchir.','Henri Poincaré','La Science et l’Hypothèse','Introduction','https://fr.wikisource.org/wiki/La_Science_et_l%E2%80%99Hypoth%C3%A8se/Texte_entier','Cette formulation met en évidence la notion « Doute scientifique ». Elle aide à distinguer observation, hypothèse, expérimentation, vérification et esprit critique dans une démarche scientifique.',array['Physique-Chimie', 'Henri Poincaré', 'doute scientifique']::text[],'Doute scientifique'),
      ('Physique-Chimie','Au lieu de prononcer une condamnation sommaire, nous devons donc examiner avec soin le rôle de l’hypothèse.','Henri Poincaré','La Science et l’Hypothèse','Introduction','https://fr.wikisource.org/wiki/La_Science_et_l%E2%80%99Hypoth%C3%A8se/Texte_entier','Cette formulation met en évidence la notion « Doute scientifique ». Elle aide à distinguer observation, hypothèse, expérimentation, vérification et esprit critique dans une démarche scientifique.',array['Physique-Chimie', 'Henri Poincaré', 'doute scientifique']::text[],'Doute scientifique'),
      ('Physique-Chimie','Il y a plusieurs sortes d’hypothèses, que les unes sont vérifiables et qu’une fois confirmées par l’expérience, elles deviennent des vérités fécondes.','Henri Poincaré','La Science et l’Hypothèse','Introduction','https://fr.wikisource.org/wiki/La_Science_et_l%E2%80%99Hypoth%C3%A8se/Texte_entier','Cette formulation met en évidence la notion « Vérification ». Elle aide à distinguer observation, hypothèse, expérimentation, vérification et esprit critique dans une démarche scientifique.',array['Physique-Chimie', 'Henri Poincaré', 'vérification']::text[],'Vérification'),
      ('Physique-Chimie','Les autres, sans pouvoir nous induire en erreur, peuvent nous être utiles en fixant notre pensée.','Henri Poincaré','La Science et l’Hypothèse','Introduction','https://fr.wikisource.org/wiki/La_Science_et_l%E2%80%99Hypoth%C3%A8se/Texte_entier','Cette formulation met en évidence la notion « Vérification ». Elle aide à distinguer observation, hypothèse, expérimentation, vérification et esprit critique dans une démarche scientifique.',array['Physique-Chimie', 'Henri Poincaré', 'vérification']::text[],'Vérification'),
      ('Physique-Chimie','Ces conventions sont l’œuvre de la libre activité de notre esprit.','Henri Poincaré','La Science et l’Hypothèse','Introduction','https://fr.wikisource.org/wiki/La_Science_et_l%E2%80%99Hypoth%C3%A8se/Texte_entier','Cette formulation met en évidence la notion « Conventions scientifiques ». Elle aide à distinguer observation, hypothèse, expérimentation, vérification et esprit critique dans une démarche scientifique.',array['Physique-Chimie', 'Henri Poincaré', 'conventions scientifiques']::text[],'Conventions scientifiques'),
      ('Physique-Chimie','Ces conventions ne sont pas arbitraires, et transportés dans un autre monde, nous aurions été amenés à en adopter d’autres.','Henri Poincaré','La Science et l’Hypothèse','Introduction','https://fr.wikisource.org/wiki/La_Science_et_l%E2%80%99Hypoth%C3%A8se/Texte_entier','Cette formulation met en évidence la notion « Conventions scientifiques ». Elle aide à distinguer observation, hypothèse, expérimentation, vérification et esprit critique dans une démarche scientifique.',array['Physique-Chimie', 'Henri Poincaré', 'conventions scientifiques']::text[],'Conventions scientifiques'),
      ('Physique-Chimie','L’histoire de la science nous prouve qu’elles sont éphémères : elles ne meurent pas tout entières pourtant, et de chacune d’elles il reste quelque chose.','Henri Poincaré','La Science et l’Hypothèse','Introduction','https://fr.wikisource.org/wiki/La_Science_et_l%E2%80%99Hypoth%C3%A8se/Texte_entier','Cette formulation met en évidence la notion « Évolution des théories ». Elle aide à distinguer observation, hypothèse, expérimentation, vérification et esprit critique dans une démarche scientifique.',array['Physique-Chimie', 'Henri Poincaré', 'évolution des théories']::text[],'Évolution des théories'),
      ('Physique-Chimie','C’est ce quelque chose qu’il faut chercher à démêler, parce que c’est là, et là seulement, qu’est la véritable réalité.','Henri Poincaré','La Science et l’Hypothèse','Introduction','https://fr.wikisource.org/wiki/La_Science_et_l%E2%80%99Hypoth%C3%A8se/Texte_entier','Cette formulation met en évidence la notion « Évolution des théories ». Elle aide à distinguer observation, hypothèse, expérimentation, vérification et esprit critique dans une démarche scientifique.',array['Physique-Chimie', 'Henri Poincaré', 'évolution des théories']::text[],'Évolution des théories'),
      ('Physique-Chimie','La méthode des sciences physiques repose sur l’induction qui nous fait attendre la répétition d’un phénomène quand se reproduisent les circonstances où il avait une première fois pris naissance.','Henri Poincaré','La Science et l’Hypothèse','Introduction','https://fr.wikisource.org/wiki/La_Science_et_l%E2%80%99Hypoth%C3%A8se/Texte_entier','Cette formulation met en évidence la notion « Induction ». Elle aide à distinguer observation, hypothèse, expérimentation, vérification et esprit critique dans une démarche scientifique.',array['Physique-Chimie', 'Henri Poincaré', 'induction']::text[],'Induction'),
      ('Physique-Chimie','Cela pourra être vraisemblable, cela ne pourra pas être rigoureusement certain.','Henri Poincaré','La Science et l’Hypothèse','Introduction','https://fr.wikisource.org/wiki/La_Science_et_l%E2%80%99Hypoth%C3%A8se/Texte_entier','Cette formulation met en évidence la notion « Induction ». Elle aide à distinguer observation, hypothèse, expérimentation, vérification et esprit critique dans une démarche scientifique.',array['Physique-Chimie', 'Henri Poincaré', 'induction']::text[],'Induction')
  ) as seed(subject_name,quote_text,author,source_title,source_reference,source_url,pedagogical_explanation,keywords,theme)
  loop
    citation_uuid := null;
    select id into citation_subject_uuid from public.subjects where name=citation_seed.subject_name limit 1;
    if citation_subject_uuid is null then
      raise exception 'Matière Citations % introuvable.', citation_seed.subject_name;
    end if;
    insert into public.citations (subject_id,quote_text,author,source_title,source_reference,source_url,pedagogical_explanation,keywords,is_active,is_validated)
    select citation_subject_uuid,citation_seed.quote_text,citation_seed.author,citation_seed.source_title,citation_seed.source_reference,citation_seed.source_url,citation_seed.pedagogical_explanation,citation_seed.keywords,false,false
    where not exists (
      select 1 from public.citations c
      where c.subject_id=citation_subject_uuid
        and c.quote_text=citation_seed.quote_text
        and c.author=citation_seed.author
    )
    returning id into citation_uuid;
    if citation_uuid is not null then
      insert into public.citation_scopes (citation_id,level_id,series_id)
      select citation_uuid,lv.id,s.id
      from public.levels lv cross join public.series s
      where lv.name='Terminale' and s.name in ('A1','A2','C','D');
      insert into public.citation_themes (citation_id,theme) values (citation_uuid,citation_seed.theme);
    end if;
  end loop;
end;
$svt_terminal_c_citations$;
