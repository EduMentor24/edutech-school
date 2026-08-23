import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const migrationPath = resolve(root, "supabase/migrations/20260823_computer_science_terminal_foundations_drafts.sql");
const payloadPath = resolve(root, "supabase/migrations/20260823_computer_science_terminal_foundations_drafts.apply.json");

const offerings = [
  "0beafff1-63db-42c9-99a2-8ef6da799f19",
  "7680fb4a-c9d4-41df-92f3-a91effda4944",
  "7695b4cf-0524-4de4-af91-f8d79eed2b0a",
  "f9c030a4-8b30-4657-b7bb-d81e4e500635",
];

const chapterTitle = "Fondations du numérique et citoyenneté responsable";
const lessonTitle = "Comprendre son environnement numérique, ses données et ses choix responsables";
const sqlText = (value) => {
  const tag = "$computer_science$";
  if (value.includes(tag)) throw new Error("Délimiteur SQL présent dans un contenu.");
  return `${tag}${value}${tag}`;
};
const jsonArray = (items) => `jsonb_build_array(${items.map(sqlText).join(",")})`;

const content = `# Informatique / TICE — Parcours d’initiation Terminale

> **Statut pédagogique :** cette leçon appartient à un parcours complémentaire d’initiation créé pour EduTech School. Elle ne se présente pas comme un programme officiel ; elle propose des repères utiles pour apprendre, communiquer et agir avec responsabilité dans un environnement numérique.

## Leçon 1 — Comprendre son environnement numérique, ses données et ses choix responsables

### Pourquoi cette leçon ?

Un téléphone, un ordinateur ou une tablette ne sont pas seulement des objets qui affichent des images. Ce sont des outils qui reçoivent des informations, les transforment, les conservent et les transmettent. Bien les utiliser, c’est savoir distinguer les éléments qui composent cet environnement, choisir une action adaptée et mesurer les conséquences possibles d’un partage, d’un téléchargement ou d’un clic.

> **Objectifs d’apprentissage.** À la fin de cette leçon, tu dois pouvoir identifier les principaux éléments d’un environnement numérique, organiser un fichier de travail, reconnaître une donnée à protéger, vérifier une information avant de la relayer et écrire des consignes précises pour accomplir une tâche.

---

## 1. Lire l’environnement numérique comme un ensemble organisé

Un environnement numérique réunit des **appareils**, des **logiciels**, des **données**, des **réseaux** et des personnes. Aucun de ces éléments ne travaille seul. Par exemple, lorsqu’une élève rédige un exposé : elle utilise un appareil, ouvre une application de traitement de texte, enregistre un fichier, puis peut transmettre ce fichier par un service en ligne. À chaque étape, elle doit faire un choix : nommer le fichier, choisir son emplacement, vérifier le destinataire et protéger ce qui doit rester privé.

| Notion | Définition claire | Exemple scolaire |
|---|---|---|
| **Matériel** | Partie physique que l’on peut toucher. | Clavier, écran, souris, téléphone, câble de recharge. |
| **Système d’exploitation** | Logiciel de base qui organise le fonctionnement de l’appareil et permet d’ouvrir d’autres applications. | L’écran d’accueil, le gestionnaire de fichiers et les réglages de l’appareil font partie de cet environnement. |
| **Application** | Logiciel conçu pour réaliser une tâche particulière. | Écrire un texte, lire un PDF, prendre des notes ou participer à une classe en ligne. |
| **Fichier** | Ensemble de données enregistré sous un nom et souvent avec un type. | \`expose_ecologie_v1.docx\`, \`schema_revisions.pdf\` ou \`photo_tableau.jpg\`. |
| **Donnée** | Information que l’on saisit, consulte, modifie, stocke ou transmet. | Une phrase de cours, une image, une note, un nom ou une adresse e-mail. |
| **Réseau / service en ligne** | Moyen technique qui permet à des appareils et services d’échanger des données. | Un site d’information, une messagerie ou un espace de stockage partagé. |

> **À retenir :** le matériel permet d’agir, le système organise l’appareil, l’application aide à accomplir une tâche, et les données sont ce que l’on produit ou utilise. Les données méritent une attention particulière, car elles peuvent être utiles, personnelles, trompeuses ou sensibles selon le contexte.

### Exemple guidé — préparer un exposé sans se désorganiser

Imaginons un groupe fictif qui prépare un exposé sur la préservation de l’eau. Une organisation simple peut être :

\`Terminale / Informatique / Expose_eau / 01_sources / 02_plan / 03_diaporama / 04_version_finale\`

Le nom d’un fichier doit permettre de comprendre son contenu sans l’ouvrir. Au lieu de nommer plusieurs documents « nouveau », « final » puis « final2 », on peut écrire : \`plan_expose_eau_2026-08-23\`, puis \`plan_expose_eau_version_revue\`. Une règle de nommage régulière réduit les confusions et facilite le travail en équipe.

> **Méthode en trois gestes :** créer un dossier principal ; séparer les sources, le travail en cours et la version finale ; ajouter au nom une information utile, comme le sujet, la version ou la date. Ne mets pas de donnée personnelle dans le nom d’un fichier partagé publiquement.

---

## 2. Donnée utile, donnée personnelle et donnée sensible

Toutes les données n’ont pas le même niveau de protection. Une définition de dictionnaire ou une illustration librement partagée ne demandent pas la même prudence qu’un numéro de téléphone, une adresse, un mot de passe, une photo privée, un document médical ou le résultat scolaire identifiable d’une personne.

| Catégorie | Exemple | Bon réflexe |
|---|---|---|
| **Donnée de travail** | Plan d’un exposé ou fiche de révision. | L’enregistrer à un endroit connu et garder une copie lorsque c’est autorisé. |
| **Donnée personnelle** | Nom complet, adresse e-mail, photo identifiable ou numéro de téléphone. | Ne la communiquer qu’à une personne ou un service légitime, pour une raison claire. |
| **Donnée sensible ou confidentielle** | Mot de passe, code de validation, document privé, information médicale ou résultat personnel. | Ne jamais la publier ni l’envoyer dans un groupe ; demander de l’aide en cas de doute. |

> **Règle de prudence :** avant de partager, demande-toi : « Cette information concerne-t-elle quelqu’un ? Est-elle nécessaire ? Le destinataire est-il bien celui que je crois ? Serais-je à l’aise si elle devenait visible par erreur ? » Si l’une de ces réponses inquiète, ne partage pas immédiatement.

### Protéger un compte sans apprendre de mauvaises pratiques

Un mot de passe n’est pas un détail : il protège l’accès à un compte. Il ne doit pas être transmis à un ami, affiché dans une photo, saisi sur une page dont on n’a pas vérifié l’adresse, ni réutilisé partout. Une phrase secrète longue, personnelle et difficile à deviner est en général plus sûre qu’un mot très court ou une suite évidente de chiffres. Quand un service le propose, une deuxième vérification peut renforcer la protection du compte.

> **Attention :** ne partage jamais un code reçu par message, même si l’expéditeur se présente comme une personne connue ou un service. En cas de message inquiétant, il vaut mieux s’arrêter, vérifier par un canal habituel et demander conseil à un adulte ou à l’établissement.

---

## 3. Chercher une information n’est pas encore la comprendre

Le premier résultat d’une recherche, une publication virale ou une réponse générée automatiquement ne constituent pas, à eux seuls, une preuve. Pour utiliser une information dans un devoir ou pour la transmettre, il faut observer sa source et son contexte.

| Question de vérification | Pourquoi la poser ? | Action concrète |
|---|---|---|
| **Qui publie ?** | L’auteur ou l’organisation permet d’évaluer l’origine du propos. | Rechercher le nom du site, de l’auteur ou de l’institution. |
| **Quand l’information a-t-elle été publiée ?** | Une information ancienne peut ne plus être adaptée au sujet actuel. | Lire la date et vérifier si elle convient au travail demandé. |
| **Quelle preuve est donnée ?** | Une affirmation sans explication ni source est fragile. | Chercher une référence, un document, une méthode ou une citation vérifiable. |
| **D’autres sources fiables disent-elles la même chose ?** | Comparer aide à repérer une erreur ou une opinion isolée. | Consulter au moins une autre source pertinente. |
| **Le titre correspond-il réellement au contenu ?** | Un titre peut chercher à provoquer une réaction rapide. | Lire le texte entier avant de partager. |

### Cas pratique — une image très convaincante

Une image peut être recadrée, sortie de son contexte ou modifiée. Avant de la reprendre dans un exposé, il faut chercher sa provenance, son auteur quand il est indiqué, le contexte de sa publication et les conditions de réutilisation. « Je l’ai vue beaucoup de fois » n’est pas une preuve. « Je peux citer l’origine et expliquer ce qu’elle montre » est une bien meilleure justification.

> **Esprit critique :** vérifier n’est pas tout rejeter. C’est donner à une information une confiance proportionnée aux preuves disponibles. Lorsqu’une preuve manque, on peut écrire « cette information doit être vérifiée » au lieu de la présenter comme certaine.

---

## 4. Une consigne précise : le début de la pensée algorithmique

Un **algorithme** est une suite d’instructions ordonnées qui permet de résoudre une tâche ou d’atteindre un résultat. Il n’est pas réservé aux programmeurs. Une recette, la méthode pour ranger un dossier ou la procédure de préparation d’un exposé peuvent être décrites comme des algorithmes si les étapes sont précises, dans le bon ordre et réalisables.

### Exemple — envoyer correctement un devoir autorisé

1. Ouvrir le dossier où le fichier est enregistré.
2. Vérifier le titre, la date et la version du document.
3. Ouvrir le document pour contrôler qu’il s’affiche correctement.
4. Ouvrir le canal indiqué par l’enseignant.
5. Choisir le fichier demandé, sans joindre un document privé par erreur.
6. Vérifier le destinataire et l’objet du message.
7. Envoyer puis conserver une trace de l’envoi selon la consigne reçue.

Chaque étape a un objectif. Si l’on écrit seulement « envoie le devoir », une autre personne ne sait ni quel fichier choisir, ni où l’envoyer, ni comment vérifier qu’elle n’a pas commis d’erreur. Une bonne consigne est **claire**, **ordonnée**, **finie** et **vérifiable**.

| Élément de raisonnement | Question à se poser | Exemple |
|---|---|---|
| **Entrée** | Quelles informations ou quels objets sont nécessaires ? | Le fichier final et le canal de remise. |
| **Étapes** | Dans quel ordre faut-il agir ? | Contrôler le fichier avant de le joindre. |
| **Condition** | Que faire si une situation change ? | Si le fichier ne s’ouvre pas, ne pas l’envoyer : le corriger ou demander de l’aide. |
| **Résultat attendu** | Comment sait-on que la tâche est terminée ? | Le bon document a été remis au bon endroit. |

> **Méthode de débogage :** lorsqu’un résultat n’est pas celui attendu, ne recommence pas au hasard. Reprends les étapes une par une : l’entrée était-elle correcte ? une étape a-t-elle été oubliée ? le résultat a-t-il été vérifié ? Cette habitude prépare à la programmation et à la résolution de problèmes.

---

## 5. Outils d’intelligence artificielle : aide, limites et responsabilité humaine

Certains outils numériques peuvent proposer un résumé, une image, une correction de langue ou une réponse à une question. Ils peuvent aider à explorer une idée, mais ils peuvent aussi produire une réponse incomplète, imprécise ou inadaptée au contexte. Une réponse produite automatiquement n’est donc pas une source suffisante pour un devoir.

| Usage possible | Usage responsable | Limite à connaître |
|---|---|---|
| Préparer un plan | Demander des pistes puis les comparer au cours et aux sources. | La proposition peut oublier une notion importante. |
| Reformuler une phrase | Vérifier que le sens initial et le niveau de langue sont conservés. | La reformulation peut modifier une nuance. |
| Réviser | Utiliser l’outil pour créer des questions, puis répondre soi-même et contrôler avec le cours. | Une explication peut comporter une erreur. |
| Chercher une information | Remonter vers des sources identifiables et les lire. | Le texte fourni peut donner une référence inexistante ou imprécise. |

> **Principe fondamental :** l’élève garde la responsabilité de son travail. Il ne doit pas communiquer d’informations personnelles ou confidentielles à un outil non vérifié, copier une réponse sans la comprendre, ni présenter une production automatique comme une recherche personnelle.

---

## 6. Synthèse active

> **Je sais faire si je peux :** expliquer la différence entre appareil, système, application, fichier et donnée ; organiser un dossier de travail ; distinguer une donnée de travail d’une donnée à protéger ; vérifier l’origine et la date d’une information ; décrire une tâche en étapes ordonnées ; utiliser un outil numérique, y compris une IA, avec esprit critique et responsabilité.

### Vocabulaire essentiel

| Mot | Sens dans cette leçon |
|---|---|
| **Dossier** | Espace qui sert à regrouper des fichiers de manière organisée. |
| **Sauvegarde** | Copie de sécurité d’un travail pour limiter les conséquences d’une perte ou d’une erreur. |
| **Confidentialité** | Protection d’une information qui ne doit pas être accessible à tous. |
| **Source** | Origine identifiable d’une information, d’un document ou d’une image. |
| **Algorithme** | Suite d’instructions ordonnées permettant d’accomplir une tâche. |
| **Condition** | Situation qui entraîne une action différente selon qu’elle est vraie ou non. |
| **Vérification** | Contrôle effectué avant de considérer un résultat comme fiable. |

### Auto-évaluation avant de passer à la suite

1. Je peux expliquer pourquoi le nom d’un fichier doit être clair.
2. Je sais qu’un code de connexion ne se partage pas.
3. Je peux citer plusieurs questions utiles avant de croire ou partager une information.
4. Je peux transformer une tâche vague en étapes simples et vérifiables.
5. Je peux utiliser une aide numérique sans abandonner ma réflexion ni ma responsabilité.

> **Trace du parcours :** le contenu est une création pédagogique originale pour EduTech School, conçue comme une initiation non officielle et évolutive. Il ne remplace pas un programme national ni les consignes de l’enseignant.`;

const exerciseOneRows = [
  [
    "Un clavier appartient surtout à quelle catégorie ?",
    ["Matériel", "Application", "Donnée personnelle"],
    ["Matériel"],
    "Un clavier est un objet physique utilisé pour saisir des informations : c’est du matériel.",
  ],
  [
    "Quel nom de fichier aide le mieux un groupe à retrouver un plan d’exposé révisé ?",
    ["nouveau_final2", "plan_expose_eau_version_revue", "document"],
    ["plan_expose_eau_version_revue"],
    "Un bon nom donne le sujet et l’état de la version sans avoir besoin d’ouvrir le fichier.",
  ],
  [
    "Quelle donnée ne doit pas être envoyée dans un groupe de classe ?",
    ["Un lien vers une source publique", "Un mot de passe ou un code de validation", "Le titre d’un exposé"],
    ["Un mot de passe ou un code de validation"],
    "Un mot de passe et un code de validation donnent accès à un compte : ils doivent rester confidentiels.",
  ],
  [
    "Quelle action permet de mieux évaluer une information en ligne ?",
    ["Lire seulement le titre", "Vérifier l’auteur, la date et une autre source pertinente", "Partager immédiatement si l’image semble convaincante"],
    ["Vérifier l’auteur, la date et une autre source pertinente"],
    "La vérification croise l’origine, le contexte et les preuves ; elle ne se limite pas à l’apparence d’un contenu.",
  ],
];

const exerciseTwoRows = [
  [
    "Dans une procédure de remise de devoir, quelle étape doit précéder l’envoi ?",
    ["Vérifier le bon fichier et le destinataire", "Donner son mot de passe à un camarade", "Renommer tous les fichiers « final »"],
    ["Vérifier le bon fichier et le destinataire"],
    "Cette vérification réduit les erreurs d’envoi et protège les documents qui ne doivent pas être transmis.",
  ],
  [
    "Un message contient une affirmation sans auteur, sans date et sans source. Quelle formulation est responsable ?",
    ["C’est forcément vrai car le message est populaire.", "Cette information doit être vérifiée avant d’être utilisée ou partagée.", "Il faut la publier vite pour avertir tout le monde."],
    ["Cette information doit être vérifiée avant d’être utilisée ou partagée."],
    "L’absence d’éléments vérifiables ne prouve pas qu’une affirmation est fausse, mais impose de la prudence.",
  ],
  [
    "Laquelle de ces descriptions contient une condition utile ?",
    ["Ouvre le fichier.", "Si le fichier ne s’ouvre pas, vérifie son emplacement ou demande de l’aide.", "Le fichier est intéressant."],
    ["Si le fichier ne s’ouvre pas, vérifie son emplacement ou demande de l’aide."],
    "Une condition décrit ce qu’il faut faire dans une situation particulière ; elle rend une procédure plus fiable.",
  ],
  [
    "Quel usage d’un outil d’IA respecte la responsabilité de l’élève ?",
    ["Copier une réponse sans la lire", "L’utiliser pour obtenir des pistes, puis vérifier et reformuler avec ses propres connaissances", "Lui transmettre des identifiants pour qu’il fasse le devoir"],
    ["L’utiliser pour obtenir des pistes, puis vérifier et reformuler avec ses propres connaissances"],
    "L’outil peut aider, mais l’élève reste responsable de la compréhension, des choix et de la vérification du résultat.",
  ],
];

const quizOneRows = [
  ["Quel élément est un logiciel de base qui organise l’appareil ?", "Le système d’exploitation organise le fonctionnement général de l’appareil et l’accès aux applications.", [["Le système d’exploitation", true], ["Le clavier", false], ["Une photo", false]]],
  ["Quelle phrase définit le mieux une donnée ?", "Une donnée est une information manipulée, stockée, consultée ou transmise dans un contexte numérique.", [["Une information utilisée ou enregistrée", true], ["Seulement un appareil", false], ["Toujours un mot de passe", false]]],
  ["Pourquoi créer des dossiers pour un travail scolaire ?", "Une organisation par dossiers facilite la recherche, le partage contrôlé et la distinction entre brouillons et version finale.", [["Pour retrouver et classer les fichiers", true], ["Pour effacer toute version", false], ["Pour remplacer la vérification", false]]],
  ["Quel exemple est une donnée confidentielle ?", "Un code de connexion peut permettre l’accès à un compte ; il ne doit donc pas être partagé.", [["Un code de validation", true], ["Le titre d’un exposé", false], ["Un dossier de révision vide", false]]],
];

const quizTwoRows = [
  ["Quelle question aide à vérifier une information ?", "Identifier l’auteur et la date aide à comprendre l’origine et le contexte d’une information.", [["Qui publie et quand ?", true], ["Est-ce que le titre est court ?", false], ["Est-ce que je l’ai déjà vue ?", false]]],
  ["Quelle propriété caractérise une bonne consigne algorithmique ?", "Une instruction est utile lorsqu’elle est claire, ordonnée, réalisable et permet un contrôle du résultat.", [["Elle est précise et ordonnée", true], ["Elle reste vague", false], ["Elle ne prévoit aucun contrôle", false]]],
  ["Que faut-il faire avant d’envoyer un fichier ?", "Le contrôle du document et du destinataire évite de remettre un mauvais fichier ou une information non destinée à la bonne personne.", [["Vérifier le fichier et le destinataire", true], ["Partager les identifiants", false], ["Choisir le premier fichier affiché", false]]],
  ["Quelle affirmation sur une réponse générée automatiquement est correcte ?", "Une réponse automatique peut être utile, mais elle doit être comprise, vérifiée et comparée à des sources adaptées.", [["Elle doit être vérifiée avant d’être utilisée", true], ["Elle est toujours exacte", false], ["Elle remplace le jugement de l’élève", false]]],
];

const exerciseQuestionSql = (exerciseId, rows) => `insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values\n${rows.map(([prompt, options, correct, explanation], index) => `(${exerciseId},'single_choice',${sqlText(prompt)},${jsonArray(options)},${jsonArray(correct)},${sqlText(explanation)},${(index + 1) * 10})`).join(",\n")};`;

const quizSql = (quizId, title, description, rows, displayOrder) => {
  const questions = rows.map(([question, explanation], index) => `(${quizId},${sqlText(question)},${sqlText(explanation)},'single_choice',${(index + 1) * 10},1,true)`).join(",\n");
  const answers = rows.flatMap(([, , options], index) => options.map(([answer, isCorrect], optionIndex) => `(${(index + 1) * 10},${sqlText(answer)},${isCorrect},${(optionIndex + 1) * 10})`)).join(",\n");
  return `insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active,is_test_data) values (target.subject_id,target.level_id,target.series_id,target.offering_id,target_chapter_id,target_lesson_id,${sqlText(title)},${sqlText(description)},'easy',12,${displayOrder},false,false,false) returning id into ${quizId}; with inserted_questions as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values ${questions} returning id,display_order) insert into public.quiz_answers (question_id,answer,is_correct,display_order) select iq.id,v.answer,v.is_correct,v.display_order from inserted_questions iq join (values ${answers}) as v(question_order,answer,is_correct,display_order) on v.question_order=iq.display_order;`;
};

const migration = `-- Informatique / TICE Terminale : fondations du numérique et citoyenneté responsable.
-- Parcours d’initiation complémentaire non officiel ; aucun contenu n’est publié ni activé.
do $computer_science_terminal_foundations$
declare
  target record;
  target_chapter_id uuid;
  target_lesson_id uuid;
  chapter_order integer;
  lesson_order integer;
  exercise_environment_id uuid;
  exercise_decisions_id uuid;
  quiz_environment_id uuid;
  quiz_decisions_id uuid;
  offering_count integer;
begin
  select count(*) into offering_count from public.course_subject_offerings where id in (${offerings.map(sqlText).join(",")}) and is_test_data=false;
  if offering_count<>4 then
    raise exception 'Les quatre offres Informatique / TICE Terminale officielles sont requises.';
  end if;

  if exists (
    select 1 from public.chapters c
    where c.subject_offering_id in (${offerings.map(sqlText).join(",")})
      and c.title=${sqlText(chapterTitle)}
  ) then
    raise exception 'Le chapitre Informatique ciblé existe déjà : duplication ou écrasement interdit.';
  end if;

  if exists (
    select 1 from public.lessons l
    join public.chapters c on c.id=l.chapter_id
    where c.subject_offering_id in (${offerings.map(sqlText).join(",")})
      and l.title=${sqlText(lessonTitle)}
  ) then
    raise exception 'La leçon Informatique ciblée existe déjà : duplication ou écrasement interdit.';
  end if;

  for target in
    select o.id as offering_id,o.subject_id,o.level_id,o.series_id,se.name as series_name
    from public.course_subject_offerings o
    join public.series se on se.id=o.series_id
    where o.id in (${offerings.map(sqlText).join(",")})
      and o.is_test_data=false
    order by se.name
  loop
    select coalesce(max(c.display_order),0)+10 into chapter_order
    from public.chapters c
    where c.subject_offering_id=target.offering_id;

    insert into public.chapters (subject_id,level_id,series_id,subject_offering_id,title,description,display_order,is_test_data,is_active)
    values (target.subject_id,target.level_id,target.series_id,target.offering_id,${sqlText(chapterTitle)},'Parcours complémentaire non officiel : repères de culture numérique, de responsabilité et de raisonnement par étapes.',chapter_order,false,false)
    returning id into target_chapter_id;

    select coalesce(max(l.display_order),0)+10 into lesson_order
    from public.lessons l
    where l.chapter_id=target_chapter_id;

    insert into public.lessons (chapter_id,title,description,content,display_order,is_test_data,is_active)
    values (target_chapter_id,${sqlText(lessonTitle)},'Leçon d’initiation complémentaire : appareils, logiciels, données, vérification de l’information, sécurité de base, raisonnement algorithmique et usage responsable de l’IA.',${sqlText(content)},lesson_order,false,false)
    returning id into target_lesson_id;

    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order,is_test_data)
    values (target.subject_id,target.level_id,target.series_id,target_chapter_id,target_lesson_id,'Exercice 1 — Identifier et organiser son environnement numérique','Réponds aux questions en utilisant les définitions de la leçon. Justifie ton choix avec le vocabulaire approprié.','La correction explique la notion exacte : matériel, fichier, donnée personnelle ou vérification de source.','single_choice','easy','Classe les éléments, choisis un nom de fichier utile et applique les réflexes de protection et de vérification.','Relis chaque situation : la correction ne donne pas seulement la bonne option, elle rappelle la raison du choix.',false,false,20,10,false)
    returning id into exercise_environment_id;
${exerciseQuestionSql("exercise_environment_id", exerciseOneRows)}

    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order,is_test_data)
    values (target.subject_id,target.level_id,target.series_id,target_chapter_id,target_lesson_id,'Exercice 2 — Décider et écrire une procédure responsable','Examine des situations de travail scolaire : remise de fichier, information non vérifiée, erreur possible et outil d’IA. Choisis la décision la plus responsable.','La correction relie chaque décision à la confidentialité, à la vérification ou à une instruction précise.','single_choice','medium','Utilise les questions de prudence, les étapes ordonnées et la responsabilité de l’élève pour résoudre chaque situation.','Après chaque réponse, identifie le risque évité et la méthode que tu pourras réutiliser dans un autre contexte.',false,false,20,20,false)
    returning id into exercise_decisions_id;
${exerciseQuestionSql("exercise_decisions_id", exerciseTwoRows)}

${quizSql("quiz_environment_id", "Quiz 1 — Vocabulaire de l’environnement numérique", "Vérifie la compréhension du matériel, des logiciels, des fichiers et des données à protéger.", quizOneRows, 10)}
${quizSql("quiz_decisions_id", "Quiz 2 — Choix responsables et raisonnement par étapes", "Vérifie les gestes de vérification, les consignes précises et l’usage responsable des aides numériques.", quizTwoRows, 20)}
  end loop;
end $computer_science_terminal_foundations$;
`;

writeFileSync(migrationPath, migration, "utf8");
writeFileSync(payloadPath, `${JSON.stringify({ project_id: "nnshioowwniursnozicg", name: "computer_science_terminal_foundations_drafts", query: migration }, null, 2)}\n`, "utf8");
console.log(migrationPath);
console.log(payloadPath);
