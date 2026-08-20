-- Brouillons SVT Terminale A1/A2 : réactions émotionnelles, activité cérébrale et origine de la vie.
-- Sources : trois PDF Tle A fournis par l’utilisateur. Les séries C/D sont volontairement exclues : les titres ne correspondent pas à leurs structures vérifiées.
do $svt_terminal_lot1$
declare
  a2 record;
  target record;
  origin_chapter_uuid uuid;
  communication_chapter_uuid uuid;
  exercise_a_uuid uuid;
  exercise_b_uuid uuid;
  quiz_uuid uuid;
  expected_count integer;
  course_description text;
  course_text text;
  exercise_a_title text;
  exercise_b_title text;
  quiz_title text;
begin
  -- La structure Terminale A2 est absente. Les deux chapitres explicitement couverts par les PDF Tle A sont ajoutés sans affecter les autres séries.
  select o.id as offering_id,o.subject_id,o.level_id,o.series_id into a2
    from public.course_subject_offerings o
    join public.subjects sub on sub.id=o.subject_id
    join public.levels lv on lv.id=o.level_id
    join public.series s on s.id=o.series_id
    where sub.name='Sciences de la Vie et de la Terre' and lv.name='Terminale' and s.name='A2'
    limit 1;
  if a2.offering_id is null then raise exception 'Offre SVT Terminale A2 introuvable.'; end if;
    insert into public.chapters (subject_id,level_id,series_id,subject_offering_id,title,description,display_order,is_test_data,is_active)
    select a2.subject_id,a2.level_id,a2.series_id,a2.offering_id,
      'Thème 1 : L’origine de la vie et l’évolution de la lignée humaine.',
      'Origine de la vie et évolution de la lignée humaine.',10,false,false
    where not exists (select 1 from public.chapters c where c.subject_offering_id=a2.offering_id and c.title='Thème 1 : L’origine de la vie et l’évolution de la lignée humaine.');

    select c.id into origin_chapter_uuid from public.chapters c
    where c.subject_offering_id=a2.offering_id and c.title='Thème 1 : L’origine de la vie et l’évolution de la lignée humaine.' limit 1;
    if origin_chapter_uuid is null then raise exception 'Chapitre SVT A2 sur l’origine de la vie introuvable.'; end if;

    insert into public.lessons (chapter_id,title,description,content,display_order,is_test_data,is_active)
    select origin_chapter_uuid,'Leçon 1 : L’origine de la vie.',
      'Faits paléontologiques et expérimentaux mobilisés dans l’explication scientifique de l’origine de la vie.',null,10,false,false
    where not exists (select 1 from public.lessons l where l.chapter_id=origin_chapter_uuid and l.title='Leçon 1 : L’origine de la vie.');

    insert into public.chapters (subject_id,level_id,series_id,subject_offering_id,title,description,display_order,is_test_data,is_active)
    select a2.subject_id,a2.level_id,a2.series_id,a2.offering_id,
      'Thème : La communication dans l’organisme.',
      'Communication nerveuse et activité cérébrale chez l’Homme.',20,false,false
    where not exists (select 1 from public.chapters c where c.subject_offering_id=a2.offering_id and c.title='Thème : La communication dans l’organisme.');

    select c.id into communication_chapter_uuid from public.chapters c
    where c.subject_offering_id=a2.offering_id and c.title='Thème : La communication dans l’organisme.' limit 1;
    if communication_chapter_uuid is null then raise exception 'Chapitre SVT A2 sur la communication introuvable.'; end if;

    insert into public.lessons (chapter_id,title,description,content,display_order,is_test_data,is_active)
    select communication_chapter_uuid,seed.title,seed.description,null,seed.display_order,false,false
    from (values
      ('Leçon 1 : Les réactions émotionnelles chez l’Homme.','Manifestations, causes et régulation nerveuse, hormonale et neuro-hormonale des réactions émotionnelles.',10),
      ('Leçon 2 : L’activité cérébrale chez l’Homme.','Aires cérébrales, motricité volontaire, mémoire et trajet de l’influx nerveux chez l’Homme.',20)
    ) as seed(title,description,display_order)
    where not exists (select 1 from public.lessons l where l.chapter_id=communication_chapter_uuid and l.title=seed.title);
  select count(*) into expected_count
  from public.lessons l
  join public.chapters c on c.id=l.chapter_id
  join public.course_subject_offerings o on o.id=c.subject_offering_id
  join public.subjects sub on sub.id=o.subject_id
  join public.levels lv on lv.id=o.level_id
  join public.series s on s.id=o.series_id
  where sub.name='Sciences de la Vie et de la Terre' and lv.name='Terminale' and s.name in ('A1','A2')
    and ((c.title='Thème : La communication dans l’organisme.' and l.title in ('Leçon 1 : Les réactions émotionnelles chez l’Homme.','Leçon 2 : L’activité cérébrale chez l’Homme.'))
      or (c.title='Thème 1 : L’origine de la vie et l’évolution de la lignée humaine.' and l.title='Leçon 1 : L’origine de la vie.'));
  if expected_count <> 6 then raise exception 'Six leçons SVT A1/A2 sont requises avant tout remplissage ; transaction annulée.'; end if;

  for target in
    select l.id as lesson_id,c.id as chapter_id,o.id as offering_id,o.subject_id,o.level_id,o.series_id,
      case l.title
        when 'Leçon 1 : Les réactions émotionnelles chez l’Homme.' then 'reactions'
        when 'Leçon 2 : L’activité cérébrale chez l’Homme.' then 'cerebral'
        else 'origin'
      end as lesson_key
    from public.lessons l
    join public.chapters c on c.id=l.chapter_id
    join public.course_subject_offerings o on o.id=c.subject_offering_id
    join public.subjects sub on sub.id=o.subject_id
    join public.levels lv on lv.id=o.level_id
    join public.series s on s.id=o.series_id
    where sub.name='Sciences de la Vie et de la Terre' and lv.name='Terminale' and s.name in ('A1','A2')
      and ((c.title='Thème : La communication dans l’organisme.' and l.title in ('Leçon 1 : Les réactions émotionnelles chez l’Homme.','Leçon 2 : L’activité cérébrale chez l’Homme.'))
        or (c.title='Thème 1 : L’origine de la vie et l’évolution de la lignée humaine.' and l.title='Leçon 1 : L’origine de la vie.'))
    order by s.name,c.display_order,l.display_order
  loop
    if exists (select 1 from public.lessons where id=target.lesson_id and coalesce(btrim(content),'') <> '') then
      raise exception 'La leçon SVT % contient déjà un cours. Écrasement interdit.', target.lesson_id;
    end if;

    if target.lesson_key='reactions' then
      course_description := 'Manifestations, causes et régulation nerveuse, hormonale et neuro-hormonale des réactions émotionnelles.';
      course_text := $reactions$
## Les réactions émotionnelles chez l’Homme

> **Objectif :** identifier les manifestations et les causes des réactions émotionnelles, puis expliquer leur régulation par les systèmes nerveux et hormonal.

## 1. Comprendre une réaction émotionnelle

Une émotion est une réaction affective transitoire, d’intensité variable, déclenchée par une situation vécue ou perçue. Dans le support, l’attente d’un résultat illustre une situation où apparaissent pâleur, transpiration, silence, cris ou larmes.

> **Définition : stress.** État d’alarme et d’adaptation de l’organisme face à un agent agresseur physique ou psychique.  
> **Définition : réaction émotionnelle.** Ensemble de réponses corporelles et comportementales provoquées par une émotion ou une situation de stress.

## 2. Des manifestations visibles et invisibles

Les réponses émotionnelles sont variées. Certaines sont immédiatement perceptibles, tandis que d’autres exigent une mesure biologique.

| Manifestations visibles | Manifestations invisibles |
|---|---|
| Pâleur, transpiration, frissons, raidissement musculaire, pleurs, rire, mutisme ou flot de paroles | Augmentation du taux sanguin de certaines hormones, notamment l’adrénaline et les glucocorticoïdes |

La pâleur peut s’expliquer par la diminution du diamètre de certains vaisseaux sanguins sous-cutanés. La modification du rythme cardiaque et respiratoire, ainsi que la transpiration, traduisent une modification du fonctionnement de plusieurs organes.

> **Attention :** une manifestation émotionnelle n’est pas seulement « dans la tête ». Elle mobilise des organes, des messages nerveux et des hormones.

## 3. Trois grandes catégories de causes

Le document distingue trois origines possibles du stress.

| Catégorie | Exemples cités dans le support |
|---|---|
| Contraintes émotionnelles | Peur violente, attente d’un résultat, colère, situation nouvelle, examen, foule, menaces |
| Agressions physiques | Accident, traumatisme, hémorragie, douleur, exercice intense, intoxication |
| Modifications de l’environnement | Variation importante de température, baisse d’apport en dioxygène, déshydratation |

> **Méthode :** pour expliquer une réaction émotionnelle, reliez toujours une situation déclenchante à une manifestation observée puis au mécanisme de régulation concerné.

## 4. La régulation nerveuse

Les informations issues de l’environnement sont reçues et traitées par des aires sensorielles du cortex. Les messages nerveux gagnent ensuite le **système limbique**, qui joue un rôle majeur dans les émotions et la valeur affective des stimulations. Le système limbique alerte l’hypothalamus ; celui-ci participe ensuite à l’organisation de réponses nerveuses vers les organes.

> **Définition : système limbique.** Ensemble de structures cérébrales, comprenant notamment l’hippocampe, l’amygdale et le septum dans le document, impliquées dans les émotions et certains comportements.  
> **Définition : hypothalamus.** Région cérébrale qui participe à l’intégration de messages nerveux et hormonaux.

Le support indique que l’hippocampe atténue l’anxiété et que le cortex atténue certaines réactions émotionnelles. Le cerveau émotionnel se situe ainsi dans le système limbique, sans que celui-ci agisse isolément.

## 5. La régulation hormonale

Deux types d’hormones sont particulièrement présentés.

| Hormones | Origine indiquée | Rôle mis en évidence |
|---|---|---|
| Catécholamines : adrénaline et noradrénaline | Médullosurrénale | Phase d’alarme ; mobilisation rapide des ressources : activité cardiaque, dilatation bronchique, glycogénolyse hépatique et redistribution du sang vers les muscles |
| Glucocorticoïdes : cortisol, cortisone, corticostérone | Corticosurrénale | Phase d’adaptation ; action sur les réserves énergétiques et renforcement de l’action des catécholamines |

Le schéma du cours peut être résumée ainsi :

$$\text{Stimulus stressant} \rightarrow \text{hypothalamus} \rightarrow \text{CRH} \rightarrow \text{hypophyse} \rightarrow \text{ACTH} \rightarrow \text{corticosurrénale} \rightarrow \text{glucocorticoïdes}$$

Les glucocorticoïdes exercent un **rétrocontrôle** sur le complexe hypothalamo-hypophysaire. Un rétrocontrôle est une action en retour qui participe à la régulation d’une production hormonale.

## 6. Une intégration neuro-hormonale

Les régulations nerveuse et hormonale ne sont pas indépendantes. Le système limbique et l’hypothalamus assurent une intégration neuro-hormonale : ils rendent cohérentes les réponses des différents organes sollicités lors du stress.

> **Synthèse :** une réaction émotionnelle se manifeste par des réponses visibles et invisibles. Elle peut être déclenchée par des contraintes émotionnelles, des agressions physiques ou des changements de l’environnement. Sa régulation associe le système nerveux, les hormones et le rôle intégrateur du système limbique et de l’hypothalamus.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Les réactions émotionnelles chez l’Homme »**, SVT, Terminale A, Côte d’Ivoire – École numérique.
$reactions$;
      exercise_a_title := 'Exercice 1 — Manifestations et causes des réactions émotionnelles';
      exercise_b_title := 'Exercice 2 — Régulation nerveuse et hormonale du stress';
      quiz_title := 'Quiz de révision — Les réactions émotionnelles';
    elsif target.lesson_key='cerebral' then
      course_description := 'Aires cérébrales, motricité volontaire, mémoire et trajet de l’influx nerveux chez l’Homme.';
      course_text := $cerebral$
## L’activité cérébrale chez l’Homme

> **Objectif :** localiser les principales aires cérébrales et expliquer les mécanismes de la motricité volontaire ainsi que de la mémoire.

## 1. Le cerveau influence le comportement

Le comportement humain se manifeste notamment par le langage, la mémoire, l’affectivité, la vigilance, la sensibilité, la conscience et la motricité volontaire. Le document relie ces manifestations à des zones spécialisées du cerveau appelées **aires cérébrales**.

> **Définition : aire cérébrale.** Zone du cortex cérébral associée à une fonction particulière.  
> **Définition : cortex cérébral.** Partie superficielle du cerveau dans laquelle sont localisées plusieurs aires impliquées dans les fonctions nerveuses.

## 2. Localiser les principales aires

Le support répartit les aires dans quatre lobes : frontal, pariétal, occipital et temporal. Les aires motrices sont situées en avant du sillon de Rolando ; plusieurs aires de la sensibilité se trouvent en arrière.

| Aire ou ensemble d’aires | Localisation ou relation indiquée | Fonction présentée |
|---|---|---|
| Aire motrice | Lobe frontal, en avant du sillon de Rolando | Commande des mouvements intentionnels |
| Aire psychomotrice | Lobe frontal | Coordination des mouvements ; mouvements de l’écriture et langage parlé |
| Aires visuelle et psycho-visuelle | Lobe occipital, en relation avec l’œil | Voir, reconnaître des objets, lire et comprendre des textes écrits |
| Aires auditive et psycho-auditive | Lobe temporal, en relation avec l’oreille interne | Entendre et comprendre des mots entendus |
| Aire de sensibilité générale et aires psycho-sensorielles | En arrière du sillon de Rolando | Traitement d’informations sensorielles |

> **Attention :** une aire cérébrale n’assure pas n’importe quelle fonction. Une lésion peut donc perturber sélectivement une fonction sans supprimer toutes les autres.

## 3. La motricité volontaire : trois phases

Un mouvement volontaire, comme saisir un objet, implique une intention puis une coordination de plusieurs structures nerveuses. Le cours distingue trois étapes.

### Phase préparatoire

Le sujet localise l’objet à prendre à partir d’informations sensorielles, souvent visuelles. Les informations sont traitées par les aires corticales concernées avant d’atteindre des aires d’association. Le support mentionne aussi les zones sous-corticales et cérébelleuses, l’hypothalamus et le système limbique.

### Phase de programmation

Le système nerveux central prépare les paramètres du geste : bras à utiliser, direction, distance et force. L’aire motrice supplémentaire, le cortex prémoteur et le cortex pariétal postérieur participent à cette phase.

### Phase d’exécution

Après la programmation et la décision, le message moteur est transmis vers la moelle épinière puis vers les effecteurs, notamment les muscles.

$$\text{Informations sensorielles} \rightarrow \text{aires d’association} \rightarrow \text{programmation motrice} \rightarrow \text{cortex moteur} \rightarrow \text{moelle épinière} \rightarrow \text{muscle}$$

> **Définition : effecteur.** Organe qui réalise la réponse commandée ; dans le cas d’un mouvement, il s’agit notamment d’un muscle.  
> **Méthode :** lorsque vous expliquez un geste volontaire, présentez successivement l’information reçue, la programmation et la transmission vers le muscle.

## 4. La mémoire : formes et mécanisme

La mémoire permet de restituer ce qui a été appris. Le support distingue une mémoire **explicite**, liée aux souvenirs conscients, et une mémoire **implicite**, utile à l’apprentissage de certaines tâches. Il distingue également la mémoire à court terme de la mémoire à long terme.

| Aspect | Idée essentielle du cours |
|---|---|
| Mémoire à court terme | Maintient temporairement une information, par exemple dans une conversation |
| Mémoire à long terme | Emmagasine des souvenirs durablement |
| Mémoire explicite | Ensemble de souvenirs pouvant être rapportés consciemment |
| Mémoire implicite | Permet l’apprentissage de certaines actions, même sans souvenir conscient de l’apprentissage |

Le mécanisme mnésique comprend trois phases : **acquisition**, **consolidation et stockage**, puis **restitution**. L’hippocampe du système limbique et le cortex sont indiqués comme impliqués dans la mémoire.

> **Définition : acquisition.** Entrée d’une information sous forme de message nerveux dans des structures neuronales.  
> **Définition : consolidation.** Stabilisation d’informations enregistrées, associée dans le cours à de nouveaux circuits neuronaux.  
> **Définition : amnésie.** Diminution ou perte de mémoire.

## Synthèse

Le cerveau influence le comportement grâce à des aires spécialisées. La motricité volontaire suit une préparation, une programmation puis une exécution. La mémoire peut être explicite ou implicite, à court ou à long terme, et se déroule par acquisition, consolidation/stockage et restitution.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« L’activité cérébrale chez l’Homme »**, SVT, Terminale A, Côte d’Ivoire – École numérique.
$cerebral$;
      exercise_a_title := 'Exercice 1 — Aires cérébrales et fonctions';
      exercise_b_title := 'Exercice 2 — Motricité volontaire et mémoire';
      quiz_title := 'Quiz de révision — L’activité cérébrale';
    elsif target.lesson_key='origin' then
      course_description := 'Faits paléontologiques et expérimentaux mobilisés dans l’explication scientifique de l’origine de la vie.';
      course_text := $origin$
## L’origine de la vie

> **Objectif :** identifier les faits paléontologiques et les faits expérimentaux mobilisés dans l’explication scientifique de l’origine de la vie, en respectant les limites indiquées dans le document.

## 1. Une question étudiée par des faits scientifiques

Le document présente une approche scientifique de l’origine de la vie fondée sur deux catégories d’indices : les **faits paléontologiques**, tirés de traces anciennes, et les **faits expérimentaux**, obtenus par des expériences de laboratoire.

> **Définition : paléontologie.** Étude des êtres vivants anciens et des traces qu’ils ont laissées.  
> **Définition : fait expérimental.** Résultat obtenu dans des conditions de laboratoire contrôlées, permettant de tester une hypothèse.

## 2. Les indices sur l’atmosphère ancienne

Le PDF décrit plusieurs formations géologiques : pechblende, fers rubanés et couches rouges. Elles servent de repères pour réfléchir à l’évolution de la teneur en dioxygène de l’atmosphère.

| Indice présenté | Interprétation proposée dans le support |
|---|---|
| Pechblende dans des sables anciens | Une faible teneur en dioxygène au moment du dépôt |
| Fers rubanés | Alternance de périodes réductrices et légèrement oxydantes ; activité photosynthétique et dépôts d’oxydes de fer |
| Couches rouges riches en oxydes de fer | Présence plus constante de dioxygène dans l’atmosphère |

> **Définition : atmosphère réductrice.** Atmosphère très pauvre en dioxygène, décrite dans le document pour les périodes anciennes.  
> **Définition : photosynthèse.** Processus attribué aux végétaux chlorophylliens dans le cours, qui participe à l’enrichissement de l’atmosphère en dioxygène.

Le support relie la prolifération des algues à l’enrichissement progressif de l’atmosphère en dioxygène. Lorsque ce dioxygène n’est plus entièrement mobilisé par des réactions chimiques, il s’accumule et permet la formation d’une couche d’ozone protectrice contre les rayonnements ultraviolets.

## 3. Des êtres vivants dans des milieux hostiles

Le document mentionne des bactéries observées dans des eaux chaudes, acides ou riches en sulfures, ainsi que des organismes proches dans les fumeurs des dorsales océaniques. Ces observations permettent de discuter la possibilité d’une vie dans des conditions comparables à celles attribuées à l’océan primitif.

> **Définition : procaryote.** Cellule dépourvue de noyau caractérisé, présentée dans la conclusion du document parmi les premières formes de vie connues.  
> **Définition : eucaryote.** Organisme ou cellule à noyau, cité comme étape ultérieure dans la progression présentée par le support.

Le cours indique une évolution allant des procaryotes aux eucaryotes puis aux êtres pluricellulaires, ainsi qu’un passage de la reproduction asexuée à la reproduction sexuée.

## 4. Les expériences sur la matière organique

Oparin et Haldane ont proposé l’hypothèse d’une « soupe primitive » de molécules organiques dans les premiers océans. Le document rapporte qu’en 1953, Miller et Urey reconstituent en vase clos des conditions étudiées d’atmosphère et de mer primitives. Des étincelles électriques conduisent alors à l’obtention d’acides aminés, notamment glycine et alanine.

> **Définition : acide aminé.** Molécule organique obtenue dans les expériences rapportées par le document.  
> **Définition : molécule organique.** Molécule étudiée dans le cadre de l’origine de la vie et susceptible de s’accumuler dans l’océan primitif selon le texte.  
> **Définition : coacervat.** Enchaînement d’acides aminés obtenu par Oparin dans les conditions décrites par le document.

Les résultats présentés montrent que des molécules organiques peuvent être synthétisées à partir d’éléments minéraux dans certaines conditions expérimentales. Le support mentionne également des molécules organiques observées dans des météorites et des expériences réalisées sans dioxygène, à température et pression élevées.

## 5. Une limite essentielle à connaître

Le document formule une limite explicite : l’obtention de macromolécules ou de molécules organiques ne démontre pas, à elle seule, l’apparition d’une cellule vivante. Les produits obtenus n’ont pas manifesté toutes les propriétés fondamentales du vivant citées dans le texte, notamment l’autorégulation et la reproduction.

> **Attention :** le passage de la molécule organique inerte aux premières cellules vivantes est présenté comme restant inconnu. Un bon raisonnement distingue donc ce qui est mis en évidence expérimentalement de ce qui demeure une question scientifique.

## Synthèse

L’origine de la vie peut être étudiée à partir d’indices paléontologiques sur l’évolution de l’atmosphère et d’expériences montrant la formation de molécules organiques. Ces résultats soutiennent une démarche scientifique, mais le passage précis de l’inanimé aux premières cellules vivantes demeure, selon le document, non élucidé.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« L’origine de la vie »**, SVT, Terminale A, Côte d’Ivoire – École numérique.
$origin$;
      exercise_a_title := 'Exercice 1 — Faits paléontologiques et évolution de l’atmosphère';
      exercise_b_title := 'Exercice 2 — Expériences et limites de l’explication scientifique';
      quiz_title := 'Quiz de révision — L’origine de la vie';
    else
      raise exception 'Leçon SVT cible non reconnue : %', target.lesson_id;
    end if;
    update public.lessons set description=course_description,content=course_text,is_active=false
    where id=target.lesson_id and coalesce(btrim(content),'')='';

    exercise_a_uuid := null;
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
    select target.subject_id,target.level_id,target.series_id,target.chapter_id,target.lesson_id,exercise_a_title,
      'Répondez progressivement aux questions en mobilisant les notions et mécanismes expliqués dans le cours.',
      'La correction justifie chaque réponse à partir d’une notion ou d’un mécanisme étudié.',
      'single_choice','easy','## Consigne

Choisissez la réponse juste puis relisez la partie correspondante du cours.','## Correction

Chaque réponse est expliquée avec le vocabulaire précis de la leçon.',false,false,15,10
    where not exists (select 1 from public.exercises e where e.lesson_id=target.lesson_id and e.title=exercise_a_title)
    returning id into exercise_a_uuid;

    if exercise_a_uuid is not null then
      if target.lesson_key='reactions' then
        insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
        (exercise_a_uuid,'single_choice','Quelle proposition correspond à une manifestation invisible d’une réaction émotionnelle ?',jsonb_build_array('L’augmentation du taux d’adrénaline dans le sang', 'Les pleurs', 'La pâleur du visage', 'Les frissons'),jsonb_build_array('L’augmentation du taux d’adrénaline dans le sang'),'Le dosage hormonal met en évidence une manifestation invisible, contrairement aux pleurs ou à la pâleur.',10),
        (exercise_a_uuid,'single_choice','L’attente d’un résultat scolaire appartient à quelle catégorie de cause ?',jsonb_build_array('Une contrainte d’ordre émotionnel', 'Une agression physique', 'Une modification de l’environnement', 'Une réponse hormonale'),jsonb_build_array('Une contrainte d’ordre émotionnel'),'Le support classe l’attente d’un résultat parmi les contraintes émotionnelles pouvant déclencher le stress.',20),
        (exercise_a_uuid,'true_false','La déshydratation est citée comme une modification brutale de l’environnement susceptible de provoquer du stress.',jsonb_build_array('Vrai', 'Faux'),jsonb_build_array('Vrai'),'La déshydratation est classée dans les modifications de l’environnement dans le document.',30);
            elsif target.lesson_key='cerebral' then
        insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
        (exercise_a_uuid,'single_choice','Dans quel lobe se situe l’aire motrice selon le cours ?',jsonb_build_array('Le lobe frontal', 'Le lobe occipital', 'Le lobe temporal', 'Le lobe pariétal uniquement'),jsonb_build_array('Le lobe frontal'),'Le document situe l’aire motrice dans le lobe frontal, en avant du sillon de Rolando.',10),
        (exercise_a_uuid,'single_choice','Quelle aire est reliée à la vision et à la reconnaissance d’objets ?',jsonb_build_array('L’aire visuelle et psycho-visuelle', 'L’aire auditive', 'L’aire motrice', 'L’aire gustative uniquement'),jsonb_build_array('L’aire visuelle et psycho-visuelle'),'Les aires visuelle et psycho-visuelle, localisées dans le lobe occipital, sont en relation avec l’œil.',20),
        (exercise_a_uuid,'true_false','La mémoire fait partie des manifestations de l’activité cérébrale citées dans le support.',jsonb_build_array('Vrai', 'Faux'),jsonb_build_array('Vrai'),'Le PDF cite expressément la mémoire parmi les manifestations de l’activité cérébrale.',30);
            elsif target.lesson_key='origin' then
        insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
        (exercise_a_uuid,'single_choice','Quel indice est associé à une faible teneur ancienne en dioxygène dans le support ?',jsonb_build_array('La pechblende dans des sables anciens', 'Le fonctionnement du cœur', 'Les muscles striés', 'Les aires visuelles'),jsonb_build_array('La pechblende dans des sables anciens'),'Le document associe l’abondance de pechblende à une faible teneur en dioxygène au moment du dépôt.',10),
        (exercise_a_uuid,'single_choice','Quel phénomène est relié à l’enrichissement de l’atmosphère en dioxygène ?',jsonb_build_array('La photosynthèse des algues', 'La disparition des molécules organiques', 'La suppression des rayonnements solaires', 'La motricité volontaire'),jsonb_build_array('La photosynthèse des algues'),'Le support relie l’activité photosynthétique des algues à l’apparition et à l’accumulation de dioxygène.',20),
        (exercise_a_uuid,'true_false','Les couches rouges sont utilisées dans le document comme indice d’une présence plus constante de dioxygène.',jsonb_build_array('Vrai', 'Faux'),jsonb_build_array('Vrai'),'Le texte présente les couches rouges riches en oxydes de fer comme témoignant d’une présence plus constante de dioxygène.',30);
            end if;
    end if;

    exercise_b_uuid := null;
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
    select target.subject_id,target.level_id,target.series_id,target.chapter_id,target.lesson_id,exercise_b_title,
      'Analysez une relation de cause à effet ou un mécanisme en vous appuyant sur le cours.',
      'La correction relie les faits observés aux notions scientifiques et aux étapes du mécanisme étudié.',
      'single_choice','medium','## Consigne

Choisissez l’analyse la plus complète et justifiez-la par une notion précise.','## Correction

Une bonne réponse relie un fait, sa cause, son effet et le mécanisme concerné.',false,false,20,20
    where not exists (select 1 from public.exercises e where e.lesson_id=target.lesson_id and e.title=exercise_b_title)
    returning id into exercise_b_uuid;

    if exercise_b_uuid is not null then
      if target.lesson_key='reactions' then
        insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
        (exercise_b_uuid,'single_choice','Quel enchaînement hormonal respecte le schéma du cours ?',jsonb_build_array('Hypothalamus → CRH → hypophyse → ACTH → corticosurrénale', 'Hypophyse → CRH → hypothalamus → ACTH', 'Corticosurrénale → CRH → hypothalamus', 'Système limbique → ACTH → CRH'),jsonb_build_array('Hypothalamus → CRH → hypophyse → ACTH → corticosurrénale'),'Le cours présente la CRH comme hormone hypothalamique et l’ACTH comme hormone hypophysaire stimulant la corticosurrénale.',10),
        (exercise_b_uuid,'single_choice','Quelle hormone est associée à la phase d’alarme dans le support ?',jsonb_build_array('L’adrénaline', 'Le cortisol uniquement', 'La CRH uniquement', 'L’ACTH uniquement'),jsonb_build_array('L’adrénaline'),'L’adrénaline, une catécholamine, prépare l’organisme à la lutte ou à la fuite lors de la phase d’alarme.',20),
        (exercise_b_uuid,'true_false','La régulation nerveuse et la régulation hormonale agissent sans aucun lien entre elles.',jsonb_build_array('Vrai', 'Faux'),jsonb_build_array('Faux'),'Le document conclut à une intégration neuro-hormonale grâce au rôle du système limbique et de l’hypothalamus.',30);
            elsif target.lesson_key='cerebral' then
        insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
        (exercise_b_uuid,'single_choice','Quelle est la première phase du mécanisme de la motricité volontaire ?',jsonb_build_array('La phase préparatoire', 'La phase d’exécution', 'La restitution', 'La consolidation'),jsonb_build_array('La phase préparatoire'),'La phase préparatoire précède la programmation et l’exécution ; elle utilise notamment les informations sensorielles.',10),
        (exercise_b_uuid,'single_choice','Quel élément fait partie des paramètres programmés avant un geste ?',jsonb_build_array('La direction du mouvement', 'La couleur du cortex', 'La disparition de la moelle épinière', 'La suppression de tout message nerveux'),jsonb_build_array('La direction du mouvement'),'Le cours cite la latéralisation, la direction, la distance et la force parmi les paramètres programmés.',20),
        (exercise_b_uuid,'true_false','La restitution est une phase du mécanisme mnésique.',jsonb_build_array('Vrai', 'Faux'),jsonb_build_array('Vrai'),'Le support présente l’acquisition, la consolidation/stockage et la restitution du souvenir.',30);
            elsif target.lesson_key='origin' then
        insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
        (exercise_b_uuid,'single_choice','Quel résultat est attribué à l’expérience de Miller et Urey dans le support ?',jsonb_build_array('L’obtention d’acides aminés', 'La création démontrée d’une cellule vivante', 'La suppression du dioxygène actuel', 'La localisation des aires cérébrales'),jsonb_build_array('L’obtention d’acides aminés'),'Le document rapporte l’obtention d’acides aminés, notamment glycine et alanine, à partir des conditions expérimentales décrites.',10),
        (exercise_b_uuid,'single_choice','Quelle limite scientifique est explicitement formulée ?',jsonb_build_array('Le passage des molécules organiques aux premières cellules reste inconnu', 'Les molécules organiques n’existent jamais', 'La photosynthèse ne libère aucun dioxygène', 'Les fossiles expliquent tout sans incertitude'),jsonb_build_array('Le passage des molécules organiques aux premières cellules reste inconnu'),'Le cours insiste sur l’absence de démonstration complète du passage de l’inanimé au vivant.',20),
        (exercise_b_uuid,'true_false','La synthèse de molécules organiques suffit à prouver toutes les propriétés fondamentales du vivant.',jsonb_build_array('Vrai', 'Faux'),jsonb_build_array('Faux'),'Le document précise que les produits obtenus ne manifestent pas à eux seuls l’autorégulation et la reproduction.',30);
            end if;
    end if;

    quiz_uuid := null;
    insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active)
    select target.subject_id,target.level_id,target.series_id,target.offering_id,target.chapter_id,target.lesson_id,quiz_title,
      'Vérifiez votre maîtrise des repères, définitions et mécanismes essentiels de la leçon.','medium',12,10,false,false
    where not exists (select 1 from public.quizzes q where q.lesson_id=target.lesson_id and q.title=quiz_title)
    returning id into quiz_uuid;

    if quiz_uuid is not null then
      if target.lesson_key='reactions' then
      with inserted_questions as (
        insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
          (quiz_uuid,'Le système limbique intervient principalement dans…','Il participe au déclenchement des émotions et à la valeur affective des stimulations.','single_choice',10,1,true),
          (quiz_uuid,'Quelle glande libère les catécholamines selon le support ?','Le cours mentionne la médullosurrénale.','single_choice',20,1,true),
          (quiz_uuid,'Quel effet de l’adrénaline est cité ?','L’adrénaline augmente notamment la fréquence et la force des contractions cardiaques.','single_choice',30,1,true),
          (quiz_uuid,'Le rétrocontrôle des glucocorticoïdes agit sur…','Le support indique une action en retour sur le complexe hypothalamo-hypophysaire.','single_choice',40,1,true)
        returning id,display_order
      )
      insert into public.quiz_answers (question_id,answer,is_correct,display_order)
      select inserted_questions.id,answers.answer,answers.is_correct,answers.display_order
      from inserted_questions
      join (values
          (10,'les émotions',true,10),
          (10,'la digestion uniquement',false,20),
          (20,'La médullosurrénale',true,10),
          (20,'La corticosurrénale',false,20),
          (30,'L’augmentation de l’activité cardiaque',true,10),
          (30,'La suppression de toute respiration',false,20),
          (40,'le complexe hypothalamo-hypophysaire',true,10),
          (40,'les os uniquement',false,20)
      ) as answers(question_order,answer,is_correct,display_order)
        on answers.question_order=inserted_questions.display_order;
            elsif target.lesson_key='cerebral' then
      with inserted_questions as (
        insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
          (quiz_uuid,'Quelle aire participe à la commande des mouvements intentionnels ?','Il s’agit de l’aire motrice.','single_choice',10,1,true),
          (quiz_uuid,'Quelle phase fixe notamment le bras à utiliser et la force du geste ?','C’est la phase de programmation.','single_choice',20,1,true),
          (quiz_uuid,'Quel organe est cité comme impliqué dans la mémoire ?','Le support mentionne notamment l’hippocampe.','single_choice',30,1,true),
          (quiz_uuid,'L’amnésie désigne…','Le cours la définit comme une diminution ou une perte de mémoire.','single_choice',40,1,true)
        returning id,display_order
      )
      insert into public.quiz_answers (question_id,answer,is_correct,display_order)
      select inserted_questions.id,answers.answer,answers.is_correct,answers.display_order
      from inserted_questions
      join (values
          (10,'L’aire motrice',true,10),
          (10,'L’aire olfactive uniquement',false,20),
          (20,'La programmation',true,10),
          (20,'La restitution',false,20),
          (30,'L’hippocampe',true,10),
          (30,'La médullosurrénale',false,20),
          (40,'une diminution ou une perte de mémoire',true,10),
          (40,'une amélioration automatique de la mémoire',false,20)
      ) as answers(question_order,answer,is_correct,display_order)
        on answers.question_order=inserted_questions.display_order;
            elsif target.lesson_key='origin' then
      with inserted_questions as (
        insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
          (quiz_uuid,'Que sont les fers rubanés dans le raisonnement du cours ?','Ce sont des formations sédimentaires utilisées comme indices sur l’atmosphère ancienne.','single_choice',10,1,true),
          (quiz_uuid,'Quel gaz s’accumule progressivement dans l’atmosphère selon le support ?','Le dioxygène s’enrichit progressivement avec l’activité photosynthétique évoquée.','single_choice',20,1,true),
          (quiz_uuid,'Quelle molécule est citée comme obtenue dans les expériences de Miller et Urey ?','Le cours cite notamment la glycine et l’alanine.','single_choice',30,1,true),
          (quiz_uuid,'Quelle propriété fondamentale manque aux produits expérimentaux cités ?','Le document indique qu’ils ne manifestent pas toutes les propriétés, dont l’autorégulation et la reproduction.','single_choice',40,1,true)
        returning id,display_order
      )
      insert into public.quiz_answers (question_id,answer,is_correct,display_order)
      select inserted_questions.id,answers.answer,answers.is_correct,answers.display_order
      from inserted_questions
      join (values
          (10,'des indices géologiques',true,10),
          (10,'des aires cérébrales',false,20),
          (20,'Le dioxygène',true,10),
          (20,'L’ACTH',false,20),
          (30,'La glycine',true,10),
          (30,'L’adrénaline',false,20),
          (40,'L’autorégulation et la reproduction',true,10),
          (40,'La couleur rouge',false,20)
      ) as answers(question_order,answer,is_correct,display_order)
        on answers.question_order=inserted_questions.display_order;
            end if;
    end if;
  end loop;
end;
$svt_terminal_lot1$;
