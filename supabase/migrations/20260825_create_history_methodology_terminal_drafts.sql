-- Cours méthodologiques Histoire-Géographie fondés sur le PDF fourni.
-- Toutes les ressources créées restent des brouillons inactifs et non publiés.
do $history_methodology_drafts$
declare
  existing_target_count integer;
  existing_evaluation_count integer;
  scientific_offering_count integer;
  scientific_chapter_count integer;
  created_chapter_count integer;
  updated_lesson_count integer;
  second_update_count integer;
  created_lesson_count integer;
  final_lesson_count integer;
begin
  select count(*) into existing_target_count
  from public.lessons lesson
  join public.chapters chapter on chapter.id = lesson.chapter_id
  join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
  join public.levels level on level.id = offering.level_id
  join public.series serie on serie.id = offering.series_id
  join public.subjects subject on subject.id = offering.subject_id
  where level.name = 'Terminale'
    and serie.name in ('A1', 'A2')
    and subject.name = 'Histoire-Géographie'
    and chapter.title = 'PREMIÈRE PARTIE — NOTIONS DE MÉTHODOLOGIE'
    and lesson.title in ('Leçon 1 — Les techniques du commentaire de deux documents', 'Leçon 2 — Les techniques de la dissertation')
    and coalesce(length(trim(lesson.content)), 0) = 0
    and lesson.is_active = false;

  select coalesce(sum(evaluation_count), 0) into existing_evaluation_count
  from (
    select count(*)::integer as evaluation_count
    from public.exercises exercise
    where exercise.lesson_id in (
      select lesson.id
      from public.lessons lesson
      join public.chapters chapter on chapter.id = lesson.chapter_id
      join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
      join public.levels level on level.id = offering.level_id
      join public.series serie on serie.id = offering.series_id
      join public.subjects subject on subject.id = offering.subject_id
      where level.name = 'Terminale'
        and serie.name in ('A1', 'A2')
        and subject.name = 'Histoire-Géographie'
        and chapter.title = 'PREMIÈRE PARTIE — NOTIONS DE MÉTHODOLOGIE'
        and lesson.title in ('Leçon 1 — Les techniques du commentaire de deux documents', 'Leçon 2 — Les techniques de la dissertation')
    )
    union all
    select count(*)::integer
    from public.quizzes quiz
    where quiz.lesson_id in (
      select lesson.id
      from public.lessons lesson
      join public.chapters chapter on chapter.id = lesson.chapter_id
      join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
      join public.levels level on level.id = offering.level_id
      join public.series serie on serie.id = offering.series_id
      join public.subjects subject on subject.id = offering.subject_id
      where level.name = 'Terminale'
        and serie.name in ('A1', 'A2')
        and subject.name = 'Histoire-Géographie'
        and chapter.title = 'PREMIÈRE PARTIE — NOTIONS DE MÉTHODOLOGIE'
        and lesson.title in ('Leçon 1 — Les techniques du commentaire de deux documents', 'Leçon 2 — Les techniques de la dissertation')
    )
  ) as evaluation_counts;

  select count(*) into scientific_offering_count
  from public.course_subject_offerings offering
  join public.levels level on level.id = offering.level_id
  join public.series serie on serie.id = offering.series_id
  join public.subjects subject on subject.id = offering.subject_id
  where level.name = 'Terminale'
    and serie.name in ('C', 'D')
    and subject.name = 'Histoire-Géographie';

  select count(*) into scientific_chapter_count
  from public.chapters chapter
  join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
  join public.levels level on level.id = offering.level_id
  join public.series serie on serie.id = offering.series_id
  join public.subjects subject on subject.id = offering.subject_id
  where level.name = 'Terminale'
    and serie.name in ('C', 'D')
    and subject.name = 'Histoire-Géographie'
    and chapter.title = 'PREMIÈRE PARTIE — NOTIONS DE MÉTHODOLOGIE';

  if existing_target_count <> 4 or existing_evaluation_count <> 0 or scientific_offering_count <> 2 or scientific_chapter_count <> 0 then
    raise exception 'Création méthodologie refusée : périmètre inattendu (leçons A %, évaluations %, offres C/D %, chapitres C/D %).', existing_target_count, existing_evaluation_count, scientific_offering_count, scientific_chapter_count;
  end if;

  insert into public.chapters (subject_id, level_id, series_id, title, description, subject_offering_id, display_order, is_test_data, is_active)
  select offering.subject_id, offering.level_id, offering.series_id,
    'PREMIÈRE PARTIE — NOTIONS DE MÉTHODOLOGIE',
    'Méthodes de commentaire de documents et de dissertation en Histoire-Géographie.',
    offering.id, 10, false, false
  from public.course_subject_offerings offering
  join public.levels level on level.id = offering.level_id
  join public.series serie on serie.id = offering.series_id
  join public.subjects subject on subject.id = offering.subject_id
  where level.name = 'Terminale'
    and serie.name in ('C', 'D')
    and subject.name = 'Histoire-Géographie';

  get diagnostics created_chapter_count = row_count;
  if created_chapter_count <> 2 then
    raise exception 'Création méthodologie refusée : 2 chapitres C/D attendus, % créés.', created_chapter_count;
  end if;

  update public.lessons lesson
  set content = $commentaire$
# Les techniques du commentaire de documents

> **Objectif.** Le commentaire de documents consiste à comprendre un document, à en extraire les idées utiles et à les expliquer avec précision. Il ne s’agit ni de recopier le document, ni de réciter tout le cours : il faut relier ce que le document dit à ce que vous savez déjà.

## 1. Comprendre ce que l’exercice évalue

Le commentaire est un **exercice guidé**. Les questions organisent généralement votre travail, mais elles attendent une réponse construite. Vous devez montrer quatre capacités : repérer une information exacte, expliquer une idée ou une allusion, mobiliser une connaissance pertinente et porter un jugement raisonnable lorsque la consigne le demande.

| Verbe de la consigne | Ce qui est attendu | Réflexe utile |
| --- | --- | --- |
| **Présenter** | Identifier le document et le situer. | Répondre avec les éléments demandés, sans inventer ce qui n’est pas indiqué. |
| **Relever** | Retrouver une information présente dans le document. | Citer brièvement ou indiquer précisément le passage. |
| **Expliquer** | Rendre une idée claire grâce au contexte et aux connaissances. | Partir du document, puis développer avec une connaissance exacte. |
| **Commenter** | Expliquer puis apprécier la portée ou les limites d’une idée. | Distinguer ce qui est juste, incomplet, orienté ou discutable. |
| **Discuter / critiquer** | Examiner avec nuance une affirmation. | Présenter des arguments, des limites et une conclusion motivée. |

## 2. Le travail préliminaire : préparer une lecture active

Avant de répondre, consacrez quelques minutes à une lecture méthodique. Pour un texte, numérotez les lignes si elles ne le sont pas déjà. Soulignez les mots-clés, les dates, les acteurs, les lieux, les chiffres et les connecteurs logiques comme *mais*, *donc*, *cependant* ou *ainsi*. Pour une carte, un tableau ou un graphique, observez d’abord le titre, la source, la date, la légende, les unités et l’échelle.

Posez-vous ensuite quatre questions simples : **de quoi parle le document ? qui s’exprime ou produit la source ? dans quel contexte ? quelle idée centrale veut-il faire comprendre ?** Cette étape évite les réponses hors sujet.

> **Méthode de repérage.** Dans la marge ou au brouillon, écrivez seulement des mots-clés. Un brouillon efficace ne copie pas le document ; il classe les informations pour préparer votre réponse.

## 3. Réussir la présentation du document

La question introductive peut demander un ou plusieurs éléments. Répondez dans l’ordre de la consigne et avec des phrases complètes.

| Élément | Question à se poser | Formulation possible |
| --- | --- | --- |
| Nature | De quel type de source s’agit-il ? | Il s’agit d’un discours, d’un extrait d’ouvrage, d’une carte, d’une photographie, d’un tableau statistique ou d’un graphique. |
| Auteur / producteur | Qui a créé le document et quelle position occupe-t-il ? | L’auteur est… ; sa fonction ou son rôle aide à comprendre son point de vue. |
| Source et destinataire | D’où vient le document et à qui s’adresse-t-il ? | Le texte est extrait de… et s’adresse à… lorsque ces informations sont fournies. |
| Date et cadre | Quand et où le document se situe-t-il ? | Le document est produit en… dans le contexte de… |
| Contexte | Quels faits expliquent son apparition ? | Il intervient alors que… ; cette situation éclaire les propos de l’auteur. |
| Idée générale | Quelle est l’idée maîtresse ? | Le document montre / défend / dénonce principalement que… |

Ne confondez pas **date du document** et **période évoquée**. Si une information n’est pas donnée, signalez seulement ce qui est observable : n’inventez ni source, ni destinataire, ni biographie.

## 4. Répondre à une question de compréhension

Une réponse solide suit la logique **affirmation → preuve → explication**. Commencez par répondre directement. Appuyez-vous ensuite sur un mot, une expression, une donnée ou une idée du document. Enfin, expliquez en ajoutant la connaissance de cours qui rend cette information intelligible.

> **Exemple de forme.** L’auteur souligne que… Cette idée apparaît dans l’expression… Elle signifie que… car, à cette période, …

La citation doit être courte et utile. Elle ne remplace jamais l’explication. Lorsqu’une allusion est difficile, recherchez le fait, l’acteur ou la notion dans vos connaissances avant de rédiger.

## 5. Commenter, discuter et exercer son esprit critique

Commenter ne signifie pas donner un avis personnel sans preuve. Il faut d’abord expliquer l’idée, puis apprécier sa valeur. Demandez-vous : **le propos est-il exact ? complet ? nuancé ? situé ? marqué par la position de son auteur ?** Un document peut être utile tout en présentant un point de vue particulier.

Pour discuter une affirmation, formulez un jugement argumenté. Vous pouvez reconnaître sa pertinence, en montrer une limite, puis conclure. Évitez les phrases comme *je suis d’accord* sans justification : l’accord ou le désaccord doit toujours reposer sur le document et sur des connaissances vérifiables.

## 6. Le commentaire de deux documents

Lorsque deux documents sont proposés, commencez par les présenter séparément, puis mettez-les en relation. Ils peuvent se compléter, se répondre, se contredire ou donner deux points de vue sur un même phénomène.

| Étape | Travail attendu |
| --- | --- |
| 1. Identifier | Relever nature, auteur, date, source et thème de chaque document. |
| 2. Comparer | Chercher les ressemblances et les différences de thèmes, d’arguments, de points de vue ou de données. |
| 3. Relier | Expliquer ce que la confrontation des deux documents apprend sur le sujet. |
| 4. Nuancer | Signaler, si nécessaire, les limites propres à chaque source. |

Ne traitez donc pas les documents comme deux exercices indépendants : la comparaison est souvent le cœur de la consigne.

## 7. Cas particuliers : carte, graphique et tableau statistique

Pour un document chiffré ou visuel, adoptez deux temps. D’abord, **décrivez** : titre, espace ou période étudiés, unités, tendance générale, valeurs marquantes, évolutions et ruptures. Ensuite, **expliquez** : utilisez le contexte historique, géographique, économique ou social pour rendre compte de ce que vous observez.

Une description précise ne consiste pas à énumérer tous les chiffres. Sélectionnez les données qui prouvent la tendance principale. Ne confondez pas une hausse, une baisse, une stagnation, une accélération ou un ralentissement.

## 8. Une méthode complète en sept gestes

1. Lire la consigne avant de rédiger.
2. Observer le document et repérer ses informations essentielles.
3. Définir le thème central et le contexte.
4. Préparer au brouillon les preuves et les connaissances utiles.
5. Répondre directement à chaque question.
6. Justifier les explications et les jugements.
7. Relire pour vérifier précision, clarté et respect de la consigne.

## 9. Erreurs fréquentes à éviter

| À éviter | À faire à la place |
| --- | --- |
| Recopier longuement le document | Citer brièvement puis expliquer. |
| Donner tout le cours | Sélectionner uniquement les connaissances qui répondent à la question. |
| Confondre auteur et source | Distinguer la personne qui produit le document et l’ouvrage ou le support d’où il est tiré. |
| Donner un avis sans argument | Justifier chaque jugement par une preuve ou une connaissance. |
| Oublier le second document | Construire explicitement la comparaison lorsqu’il y en a deux. |

## À retenir

Le commentaire de documents est une enquête guidée : vous observez, vous comprenez, vous expliquez et vous nuancez. Une bonne copie reste fidèle aux documents tout en montrant que vous savez les replacer dans leur contexte.

> **Source pédagogique.** Cours adapté et approfondi à partir du document fourni : *La méthodologie de la dissertation et du commentaire de document*, École numérique de Côte d’Ivoire.
$commentaire$,
      description = 'Méthode approfondie du commentaire de document et de la confrontation de deux documents.',
      is_test_data = false,
      is_active = false,
      updated_at = now()
  from public.chapters chapter
  join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
  join public.levels level on level.id = offering.level_id
  join public.series serie on serie.id = offering.series_id
  join public.subjects subject on subject.id = offering.subject_id
  where lesson.chapter_id = chapter.id
    and level.name = 'Terminale'
    and serie.name in ('A1', 'A2')
    and subject.name = 'Histoire-Géographie'
    and chapter.title = 'PREMIÈRE PARTIE — NOTIONS DE MÉTHODOLOGIE'
    and lesson.title = 'Leçon 1 — Les techniques du commentaire de deux documents'
    and coalesce(length(trim(lesson.content)), 0) = 0
    and lesson.is_active = false;

  get diagnostics updated_lesson_count = row_count;
  if updated_lesson_count <> 2 then
    raise exception 'Création méthodologie refusée : 2 cours de commentaire A1/A2 attendus, % modifiés.', updated_lesson_count;
  end if;

  update public.lessons lesson
  set content = $dissertation$
# Les techniques de la dissertation

> **Objectif.** La dissertation est un devoir rédigé qui organise des connaissances pour répondre à un problème. Elle évalue votre compréhension du sujet, votre capacité à raisonner et votre aptitude à construire une démonstration claire.

## 1. Ce qu’est une dissertation réussie

Une dissertation n’est pas la récitation d’une leçon. Elle répond à une **problématique**, c’est-à-dire à la question essentielle que pose le sujet. Pour y répondre, vous choisissez et organisez des arguments pertinents, reliés par un plan logique.

La copie comprend trois grandes parties : **l’introduction**, **le développement** et **la conclusion**. Chacune a une fonction précise ; aucune ne doit être négligée.

## 2. Lire et comprendre le sujet

Commencez toujours au brouillon. Recopiez le sujet, puis repérez les mots importants : acteurs, espaces, dates, bornes chronologiques, verbes de consigne et notions à définir. Reformulez ensuite le sujet avec vos propres mots. Cette reformulation permet de vérifier que vous avez compris ce qui est demandé.

| Élément du sujet | Questions à se poser |
| --- | --- |
| Temps | Quelle période faut-il couvrir ? Les bornes indiquent-elles un début, une fin ou une évolution ? |
| Espace | Quel territoire, quelle échelle ou quel ensemble géographique est concerné ? |
| Notions | Quels mots doivent être définis avec précision ? |
| Consigne | Faut-il comparer, expliquer une évolution, discuter une affirmation, dresser un tableau ou analyser un phénomène ? |

> **Conseil.** Ne commencez pas la rédaction avant d’avoir expliqué les termes essentiels. Un plan juste dépend d’abord d’une bonne compréhension du sujet.

## 3. Construire une problématique et un plan

La problématique est le fil directeur du devoir. Elle transforme le sujet en question de réflexion. Elle doit être claire, directement liée au sujet et suffisamment précise pour guider le plan.

Le plan n’est pas une liste d’idées. Il doit répondre progressivement à la problématique. Retenez des connaissances pertinentes, classez-les par thèmes ou par périodes, puis choisissez deux ou trois grandes parties cohérentes.

| Type de sujet | Indice fréquent | Organisation possible |
| --- | --- | --- |
| Comparatif | comparer, étude comparée | ressemblances puis différences, ou critères communs comparés partie par partie |
| Évolutif / chronologique | de… à…, évolution | étapes successives, en respectant les tournants importants |
| Dialectique | pensez-vous que, dans quelle mesure | arguments allant dans le sens du sujet, limites ou contre-arguments, réponse nuancée |
| Analytique / thématique | causes, aspects, conséquences, problèmes | causes, manifestations, conséquences ou solutions selon la question |
| Tableau / inventaire | présenter les secteurs, les atouts | classement logique des éléments, sans répétition |

Ces modèles servent de repères. Le sujet commande toujours le plan : ne forcez jamais un sujet dans un schéma qui ne lui convient pas.

## 4. Rédiger une introduction en trois mouvements

L’introduction prépare le lecteur à comprendre votre raisonnement. Elle est rédigée au brouillon avant la copie propre.

1. **Présenter le sujet.** Situez-le dans le temps et dans l’espace. En histoire, rappelez le contexte ; en géographie, précisez le cadre spatial. Définissez les termes nécessaires et expliquez les bornes chronologiques.
2. **Poser la problématique.** Formulez la question centrale du sujet, de préférence sous forme interrogative lorsque cela rend l’enjeu plus clair.
3. **Annoncer le plan.** Indiquez les deux ou trois axes qui organiseront votre développement, dans leur ordre réel.

> **Formule utile.** Après avoir situé le sujet et défini les notions, vous pouvez écrire : *Nous pouvons alors nous demander…* Puis : *Pour répondre à cette question, nous montrerons d’abord…, avant d’examiner…*.

Évitez les annonces vagues comme *nous allons parler de…*. Votre introduction doit déjà montrer la direction de votre raisonnement.

## 5. Construire le développement

Le développement est le cœur de la démonstration. Il comporte deux ou trois parties. Chaque partie commence par une phrase qui annonce son idée directrice, puis se développe en sous-parties ou paragraphes argumentés.

Un paragraphe efficace repose sur quatre gestes : annoncer une idée, l’expliquer, l’illustrer par un fait ou un exemple précis, puis relier ce paragraphe à la suite du raisonnement. Choisissez des exemples exacts et expliquez toujours ce qu’ils prouvent.

| Élément | Rôle dans le paragraphe |
| --- | --- |
| Idée directrice | Répondre à une partie de la problématique. |
| Explication | Montrer le mécanisme, le lien de cause à effet ou l’enjeu. |
| Exemple précis | Appuyer l’argument avec un fait, une date, un acteur, un lieu ou une donnée appropriée. |
| Liaison | Préparer le passage à l’idée suivante. |

Entre deux grandes parties, rédigez une **transition**. Elle fait un bref bilan de ce qui vient d’être démontré et annonce la nouvelle étape. Elle évite que le devoir ressemble à des blocs séparés.

## 6. Conclure sans répéter toute la copie

La conclusion comporte trois éléments courts et ordonnés :

1. **Le bilan**, qui rappelle les résultats principaux du raisonnement.
2. **La réponse à la problématique**, formulée nettement.
3. **L’ouverture**, qui élargit la réflexion vers une question proche, une limite ou une prolongation logique.

Une ouverture ne doit pas être une question sans rapport avec le sujet. Si aucune ouverture pertinente ne s’impose, mieux vaut conclure clairement que d’ajouter une phrase artificielle.

## 7. Une démarche de travail complète

### Phase A — Comprendre

Lisez le sujet plusieurs fois, soulignez les mots-clés et reformulez-le. Délimitez le temps, l’espace et les notions. Cette étape permet d’éviter le hors-sujet.

### Phase B — Analyser et organiser

Mobilisez vos connaissances, mais ne gardez que celles qui servent la problématique. Classez-les au brouillon par idées principales et secondaires. À partir de ce classement, formulez le plan détaillé.

### Phase C — Rédiger et contrôler

Rédigez l’introduction et la conclusion au brouillon. Rédigez ensuite le développement sur la copie à partir du plan détaillé. Aérez la présentation : sautez des lignes entre les grandes parties et vérifiez la qualité des transitions.

## 8. Contrôle final avant de rendre la copie

| Vérification | Question à vous poser |
| --- | --- |
| Sujet respecté | Ai-je répondu précisément à la consigne, au temps et à l’espace demandés ? |
| Problématique | Ma question centrale guide-t-elle réellement le développement ? |
| Plan | Mes parties suivent-elles un ordre logique et répondent-elles à la problématique ? |
| Arguments | Chaque idée est-elle expliquée et illustrée par une connaissance utile ? |
| Rédaction | Les paragraphes, transitions et parties sont-ils clairement séparés ? |
| Conclusion | Ai-je apporté une réponse nette avant d’ouvrir la réflexion ? |

## 9. Erreurs fréquentes à éviter

- Partir dans tous les sens sans problématique ni plan.
- Poser une problématique qui ne correspond pas au développement.
- Accumuler des exemples sans expliquer leur lien avec l’argument.
- Répéter les mêmes idées dans plusieurs parties.
- Ajouter une conclusion qui ne répond pas à la question posée.
- Employer un plan appris par cœur sans vérifier qu’il convient au sujet.

## À retenir

La dissertation est un raisonnement organisé. Réussir consiste à comprendre le sujet, poser le bon problème, construire un plan adapté et rédiger une démonstration progressive. La précision des connaissances compte, mais leur organisation compte tout autant.

> **Source pédagogique.** Cours adapté et approfondi à partir du document fourni : *La méthodologie de la dissertation et du commentaire de document*, École numérique de Côte d’Ivoire.
$dissertation$,
      description = 'Méthode approfondie de préparation, rédaction et relecture d’une dissertation en Histoire-Géographie.',
      is_test_data = false,
      is_active = false,
      updated_at = now()
  from public.chapters chapter
  join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
  join public.levels level on level.id = offering.level_id
  join public.series serie on serie.id = offering.series_id
  join public.subjects subject on subject.id = offering.subject_id
  where lesson.chapter_id = chapter.id
    and level.name = 'Terminale'
    and serie.name in ('A1', 'A2')
    and subject.name = 'Histoire-Géographie'
    and chapter.title = 'PREMIÈRE PARTIE — NOTIONS DE MÉTHODOLOGIE'
    and lesson.title = 'Leçon 2 — Les techniques de la dissertation'
    and coalesce(length(trim(lesson.content)), 0) = 0
    and lesson.is_active = false;

  get diagnostics second_update_count = row_count;
  updated_lesson_count := updated_lesson_count + second_update_count;
  if updated_lesson_count <> 4 then
    raise exception 'Création méthodologie refusée : 4 cours A1/A2 attendus, % modifiés.', updated_lesson_count;
  end if;

  insert into public.lessons (chapter_id, title, content, description, display_order, is_test_data, is_active)
  select chapter.id, source.title, source.content, source.description, source.display_order, false, false
  from public.chapters chapter
  join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
  join public.levels level on level.id = offering.level_id
  join public.series serie on serie.id = offering.series_id
  join public.subjects subject on subject.id = offering.subject_id
  cross join (
    values
      (10, 'Leçon 1 — Les techniques du commentaire de deux documents', $commentaire$# Les techniques du commentaire de documents

> **Objectif.** Le commentaire de documents consiste à comprendre un document, à en extraire les idées utiles et à les expliquer avec précision. Il ne s’agit ni de recopier le document, ni de réciter tout le cours : il faut relier ce que le document dit à ce que vous savez déjà.

## 1. Comprendre ce que l’exercice évalue

Le commentaire est un **exercice guidé**. Les questions organisent généralement votre travail, mais elles attendent une réponse construite. Vous devez montrer quatre capacités : repérer une information exacte, expliquer une idée ou une allusion, mobiliser une connaissance pertinente et porter un jugement raisonnable lorsque la consigne le demande.

| Verbe de la consigne | Ce qui est attendu | Réflexe utile |
| --- | --- | --- |
| **Présenter** | Identifier le document et le situer. | Répondre avec les éléments demandés, sans inventer ce qui n’est pas indiqué. |
| **Relever** | Retrouver une information présente dans le document. | Citer brièvement ou indiquer précisément le passage. |
| **Expliquer** | Rendre une idée claire grâce au contexte et aux connaissances. | Partir du document, puis développer avec une connaissance exacte. |
| **Commenter** | Expliquer puis apprécier la portée ou les limites d’une idée. | Distinguer ce qui est juste, incomplet, orienté ou discutable. |
| **Discuter / critiquer** | Examiner avec nuance une affirmation. | Présenter des arguments, des limites et une conclusion motivée. |

## 2. Le travail préliminaire : préparer une lecture active

Avant de répondre, consacrez quelques minutes à une lecture méthodique. Pour un texte, numérotez les lignes si elles ne le sont pas déjà. Soulignez les mots-clés, les dates, les acteurs, les lieux, les chiffres et les connecteurs logiques comme *mais*, *donc*, *cependant* ou *ainsi*. Pour une carte, un tableau ou un graphique, observez d’abord le titre, la source, la date, la légende, les unités et l’échelle.

Posez-vous ensuite quatre questions simples : **de quoi parle le document ? qui s’exprime ou produit la source ? dans quel contexte ? quelle idée centrale veut-il faire comprendre ?** Cette étape évite les réponses hors sujet.

> **Méthode de repérage.** Dans la marge ou au brouillon, écrivez seulement des mots-clés. Un brouillon efficace ne copie pas le document ; il classe les informations pour préparer votre réponse.

## 3. Réussir la présentation du document

La question introductive peut demander un ou plusieurs éléments. Répondez dans l’ordre de la consigne et avec des phrases complètes.

| Élément | Question à se poser | Formulation possible |
| --- | --- | --- |
| Nature | De quel type de source s’agit-il ? | Il s’agit d’un discours, d’un extrait d’ouvrage, d’une carte, d’une photographie, d’un tableau statistique ou d’un graphique. |
| Auteur / producteur | Qui a créé le document et quelle position occupe-t-il ? | L’auteur est… ; sa fonction ou son rôle aide à comprendre son point de vue. |
| Source et destinataire | D’où vient le document et à qui s’adresse-t-il ? | Le texte est extrait de… et s’adresse à… lorsque ces informations sont fournies. |
| Date et cadre | Quand et où le document se situe-t-il ? | Le document est produit en… dans le contexte de… |
| Contexte | Quels faits expliquent son apparition ? | Il intervient alors que… ; cette situation éclaire les propos de l’auteur. |
| Idée générale | Quelle est l’idée maîtresse ? | Le document montre / défend / dénonce principalement que… |

Ne confondez pas **date du document** et **période évoquée**. Si une information n’est pas donnée, signalez seulement ce qui est observable : n’inventez ni source, ni destinataire, ni biographie.

## 4. Répondre à une question de compréhension

Une réponse solide suit la logique **affirmation → preuve → explication**. Commencez par répondre directement. Appuyez-vous ensuite sur un mot, une expression, une donnée ou une idée du document. Enfin, expliquez en ajoutant la connaissance de cours qui rend cette information intelligible.

> **Exemple de forme.** L’auteur souligne que… Cette idée apparaît dans l’expression… Elle signifie que… car, à cette période, …

La citation doit être courte et utile. Elle ne remplace jamais l’explication. Lorsqu’une allusion est difficile, recherchez le fait, l’acteur ou la notion dans vos connaissances avant de rédiger.

## 5. Commenter, discuter et exercer son esprit critique

Commenter ne signifie pas donner un avis personnel sans preuve. Il faut d’abord expliquer l’idée, puis apprécier sa valeur. Demandez-vous : **le propos est-il exact ? complet ? nuancé ? situé ? marqué par la position de son auteur ?** Un document peut être utile tout en présentant un point de vue particulier.

Pour discuter une affirmation, formulez un jugement argumenté. Vous pouvez reconnaître sa pertinence, en montrer une limite, puis conclure. Évitez les phrases comme *je suis d’accord* sans justification : l’accord ou le désaccord doit toujours reposer sur le document et sur des connaissances vérifiables.

## 6. Le commentaire de deux documents

Lorsque deux documents sont proposés, commencez par les présenter séparément, puis mettez-les en relation. Ils peuvent se compléter, se répondre, se contredire ou donner deux points de vue sur un même phénomène.

| Étape | Travail attendu |
| --- | --- |
| 1. Identifier | Relever nature, auteur, date, source et thème de chaque document. |
| 2. Comparer | Chercher les ressemblances et les différences de thèmes, d’arguments, de points de vue ou de données. |
| 3. Relier | Expliquer ce que la confrontation des deux documents apprend sur le sujet. |
| 4. Nuancer | Signaler, si nécessaire, les limites propres à chaque source. |

Ne traitez donc pas les documents comme deux exercices indépendants : la comparaison est souvent le cœur de la consigne.

## 7. Cas particuliers : carte, graphique et tableau statistique

Pour un document chiffré ou visuel, adoptez deux temps. D’abord, **décrivez** : titre, espace ou période étudiés, unités, tendance générale, valeurs marquantes, évolutions et ruptures. Ensuite, **expliquez** : utilisez le contexte historique, géographique, économique ou social pour rendre compte de ce que vous observez.

Une description précise ne consiste pas à énumérer tous les chiffres. Sélectionnez les données qui prouvent la tendance principale. Ne confondez pas une hausse, une baisse, une stagnation, une accélération ou un ralentissement.

## 8. Une méthode complète en sept gestes

1. Lire la consigne avant de rédiger.
2. Observer le document et repérer ses informations essentielles.
3. Définir le thème central et le contexte.
4. Préparer au brouillon les preuves et les connaissances utiles.
5. Répondre directement à chaque question.
6. Justifier les explications et les jugements.
7. Relire pour vérifier précision, clarté et respect de la consigne.

## 9. Erreurs fréquentes à éviter

| À éviter | À faire à la place |
| --- | --- |
| Recopier longuement le document | Citer brièvement puis expliquer. |
| Donner tout le cours | Sélectionner uniquement les connaissances qui répondent à la question. |
| Confondre auteur et source | Distinguer la personne qui produit le document et l’ouvrage ou le support d’où il est tiré. |
| Donner un avis sans argument | Justifier chaque jugement par une preuve ou une connaissance. |
| Oublier le second document | Construire explicitement la comparaison lorsqu’il y en a deux. |

## À retenir

Le commentaire de documents est une enquête guidée : vous observez, vous comprenez, vous expliquez et vous nuancez. Une bonne copie reste fidèle aux documents tout en montrant que vous savez les replacer dans leur contexte.

> **Source pédagogique.** Cours adapté et approfondi à partir du document fourni : *La méthodologie de la dissertation et du commentaire de document*, École numérique de Côte d’Ivoire.
$commentaire$, 'Méthode approfondie du commentaire de document et de la confrontation de deux documents'),
      (20, 'Leçon 2 — Les techniques de la dissertation', $dissertation$# Les techniques de la dissertation

> **Objectif.** La dissertation est un devoir rédigé qui organise des connaissances pour répondre à un problème. Elle évalue votre compréhension du sujet, votre capacité à raisonner et votre aptitude à construire une démonstration claire.

## 1. Ce qu’est une dissertation réussie

Une dissertation n’est pas la récitation d’une leçon. Elle répond à une **problématique**, c’est-à-dire à la question essentielle que pose le sujet. Pour y répondre, vous choisissez et organisez des arguments pertinents, reliés par un plan logique.

La copie comprend trois grandes parties : **l’introduction**, **le développement** et **la conclusion**. Chacune a une fonction précise ; aucune ne doit être négligée.

## 2. Lire et comprendre le sujet

Commencez toujours au brouillon. Recopiez le sujet, puis repérez les mots importants : acteurs, espaces, dates, bornes chronologiques, verbes de consigne et notions à définir. Reformulez ensuite le sujet avec vos propres mots. Cette reformulation permet de vérifier que vous avez compris ce qui est demandé.

| Élément du sujet | Questions à se poser |
| --- | --- |
| Temps | Quelle période faut-il couvrir ? Les bornes indiquent-elles un début, une fin ou une évolution ? |
| Espace | Quel territoire, quelle échelle ou quel ensemble géographique est concerné ? |
| Notions | Quels mots doivent être définis avec précision ? |
| Consigne | Faut-il comparer, expliquer une évolution, discuter une affirmation, dresser un tableau ou analyser un phénomène ? |

> **Conseil.** Ne commencez pas la rédaction avant d’avoir expliqué les termes essentiels. Un plan juste dépend d’abord d’une bonne compréhension du sujet.

## 3. Construire une problématique et un plan

La problématique est le fil directeur du devoir. Elle transforme le sujet en question de réflexion. Elle doit être claire, directement liée au sujet et suffisamment précise pour guider le plan.

Le plan n’est pas une liste d’idées. Il doit répondre progressivement à la problématique. Retenez des connaissances pertinentes, classez-les par thèmes ou par périodes, puis choisissez deux ou trois grandes parties cohérentes.

| Type de sujet | Indice fréquent | Organisation possible |
| --- | --- | --- |
| Comparatif | comparer, étude comparée | ressemblances puis différences, ou critères communs comparés partie par partie |
| Évolutif / chronologique | de… à…, évolution | étapes successives, en respectant les tournants importants |
| Dialectique | pensez-vous que, dans quelle mesure | arguments allant dans le sens du sujet, limites ou contre-arguments, réponse nuancée |
| Analytique / thématique | causes, aspects, conséquences, problèmes | causes, manifestations, conséquences ou solutions selon la question |
| Tableau / inventaire | présenter les secteurs, les atouts | classement logique des éléments, sans répétition |

Ces modèles servent de repères. Le sujet commande toujours le plan : ne forcez jamais un sujet dans un schéma qui ne lui convient pas.

## 4. Rédiger une introduction en trois mouvements

L’introduction prépare le lecteur à comprendre votre raisonnement. Elle est rédigée au brouillon avant la copie propre.

1. **Présenter le sujet.** Situez-le dans le temps et dans l’espace. En histoire, rappelez le contexte ; en géographie, précisez le cadre spatial. Définissez les termes nécessaires et expliquez les bornes chronologiques.
2. **Poser la problématique.** Formulez la question centrale du sujet, de préférence sous forme interrogative lorsque cela rend l’enjeu plus clair.
3. **Annoncer le plan.** Indiquez les deux ou trois axes qui organiseront votre développement, dans leur ordre réel.

> **Formule utile.** Après avoir situé le sujet et défini les notions, vous pouvez écrire : *Nous pouvons alors nous demander…* Puis : *Pour répondre à cette question, nous montrerons d’abord…, avant d’examiner…*.

Évitez les annonces vagues comme *nous allons parler de…*. Votre introduction doit déjà montrer la direction de votre raisonnement.

## 5. Construire le développement

Le développement est le cœur de la démonstration. Il comporte deux ou trois parties. Chaque partie commence par une phrase qui annonce son idée directrice, puis se développe en sous-parties ou paragraphes argumentés.

Un paragraphe efficace repose sur quatre gestes : annoncer une idée, l’expliquer, l’illustrer par un fait ou un exemple précis, puis relier ce paragraphe à la suite du raisonnement. Choisissez des exemples exacts et expliquez toujours ce qu’ils prouvent.

| Élément | Rôle dans le paragraphe |
| --- | --- |
| Idée directrice | Répondre à une partie de la problématique. |
| Explication | Montrer le mécanisme, le lien de cause à effet ou l’enjeu. |
| Exemple précis | Appuyer l’argument avec un fait, une date, un acteur, un lieu ou une donnée appropriée. |
| Liaison | Préparer le passage à l’idée suivante. |

Entre deux grandes parties, rédigez une **transition**. Elle fait un bref bilan de ce qui vient d’être démontré et annonce la nouvelle étape. Elle évite que le devoir ressemble à des blocs séparés.

## 6. Conclure sans répéter toute la copie

La conclusion comporte trois éléments courts et ordonnés :

1. **Le bilan**, qui rappelle les résultats principaux du raisonnement.
2. **La réponse à la problématique**, formulée nettement.
3. **L’ouverture**, qui élargit la réflexion vers une question proche, une limite ou une prolongation logique.

Une ouverture ne doit pas être une question sans rapport avec le sujet. Si aucune ouverture pertinente ne s’impose, mieux vaut conclure clairement que d’ajouter une phrase artificielle.

## 7. Une démarche de travail complète

### Phase A — Comprendre

Lisez le sujet plusieurs fois, soulignez les mots-clés et reformulez-le. Délimitez le temps, l’espace et les notions. Cette étape permet d’éviter le hors-sujet.

### Phase B — Analyser et organiser

Mobilisez vos connaissances, mais ne gardez que celles qui servent la problématique. Classez-les au brouillon par idées principales et secondaires. À partir de ce classement, formulez le plan détaillé.

### Phase C — Rédiger et contrôler

Rédigez l’introduction et la conclusion au brouillon. Rédigez ensuite le développement sur la copie à partir du plan détaillé. Aérez la présentation : sautez des lignes entre les grandes parties et vérifiez la qualité des transitions.

## 8. Contrôle final avant de rendre la copie

| Vérification | Question à vous poser |
| --- | --- |
| Sujet respecté | Ai-je répondu précisément à la consigne, au temps et à l’espace demandés ? |
| Problématique | Ma question centrale guide-t-elle réellement le développement ? |
| Plan | Mes parties suivent-elles un ordre logique et répondent-elles à la problématique ? |
| Arguments | Chaque idée est-elle expliquée et illustrée par une connaissance utile ? |
| Rédaction | Les paragraphes, transitions et parties sont-ils clairement séparés ? |
| Conclusion | Ai-je apporté une réponse nette avant d’ouvrir la réflexion ? |

## 9. Erreurs fréquentes à éviter

- Partir dans tous les sens sans problématique ni plan.
- Poser une problématique qui ne correspond pas au développement.
- Accumuler des exemples sans expliquer leur lien avec l’argument.
- Répéter les mêmes idées dans plusieurs parties.
- Ajouter une conclusion qui ne répond pas à la question posée.
- Employer un plan appris par cœur sans vérifier qu’il convient au sujet.

## À retenir

La dissertation est un raisonnement organisé. Réussir consiste à comprendre le sujet, poser le bon problème, construire un plan adapté et rédiger une démonstration progressive. La précision des connaissances compte, mais leur organisation compte tout autant.

> **Source pédagogique.** Cours adapté et approfondi à partir du document fourni : *La méthodologie de la dissertation et du commentaire de document*, École numérique de Côte d’Ivoire.
$dissertation$, 'Méthode approfondie de préparation, rédaction et relecture d’une dissertation en Histoire-Géographie')
  ) as source(display_order, title, content, description)
  where level.name = 'Terminale'
    and serie.name in ('C', 'D')
    and subject.name = 'Histoire-Géographie'
    and chapter.title = 'PREMIÈRE PARTIE — NOTIONS DE MÉTHODOLOGIE';

  get diagnostics created_lesson_count = row_count;
  if created_lesson_count <> 4 then
    raise exception 'Création méthodologie refusée : 4 cours C/D attendus, % créés.', created_lesson_count;
  end if;

  select count(*) into final_lesson_count
  from public.lessons lesson
  join public.chapters chapter on chapter.id = lesson.chapter_id
  join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
  join public.levels level on level.id = offering.level_id
  join public.series serie on serie.id = offering.series_id
  join public.subjects subject on subject.id = offering.subject_id
  where level.name = 'Terminale'
    and serie.name in ('A1', 'A2', 'C', 'D')
    and subject.name = 'Histoire-Géographie'
    and chapter.title = 'PREMIÈRE PARTIE — NOTIONS DE MÉTHODOLOGIE'
    and lesson.title in ('Leçon 1 — Les techniques du commentaire de deux documents', 'Leçon 2 — Les techniques de la dissertation')
    and coalesce(length(trim(lesson.content)), 0) > 3000
    and lesson.is_active = false
    and lesson.is_test_data = false;

  if final_lesson_count <> 8 then
    raise exception 'Création méthodologie refusée : 8 cours complets en brouillon attendus, % trouvés.', final_lesson_count;
  end if;
end $history_methodology_drafts$;
