import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const migrationPath = resolve(root, "supabase/migrations/20260824_computer_mastery_and_glossary_drafts.sql");
const payloadPath = resolve(root, "supabase/migrations/20260824_computer_mastery_and_glossary_drafts.apply.json");
const offerings = ["0beafff1-63db-42c9-99a2-8ef6da799f19", "7680fb4a-c9d4-41df-92f3-a91effda4944", "7695b4cf-0524-4de4-af91-f8d79eed2b0a", "f9c030a4-8b30-4657-b7bb-d81e4e500635"];
const coreChapter = "Bases de l’informatique : raisonner, représenter et programmer";
const chapterTitle = "Maîtriser son ordinateur : comprendre, utiliser et s’organiser";
const sqlText = (value) => { const tag = "$computer_mastery$"; if (value.includes(tag)) throw new Error("Délimiteur SQL présent dans un contenu."); return `${tag}${value}${tag}`; };
const jsonArray = (items) => `jsonb_build_array(${items.map(sqlText).join(",")})`;

const lessons = [
  {
    title: "Découvrir l’ordinateur : matériel, logiciels et système",
    description: "Initiation débutant : composants, périphériques, système d’exploitation, applications, mémoire, stockage et poste de travail responsable.",
    content: `# Maîtriser son ordinateur — Leçon 1 : Découvrir l’ordinateur

> **Statut pédagogique :** ce cours complémentaire non officiel s’adresse aux débutants. Il propose des repères généraux ; les noms, marques et modèles d’appareils peuvent varier.

## Objectifs

Tu dois pouvoir distinguer le [[matériel|partie physique|ensemble des éléments que l’on peut manipuler, comme l’écran, le clavier ou la souris]] du [[logiciel|programme|ensemble d’instructions utilisées par l’ordinateur]], identifier les principaux périphériques, expliquer le rôle du système d’exploitation et adopter un poste de travail propre et prudent.

## 1. Un ordinateur associe des éléments physiques et des programmes

Le matériel comprend notamment l’unité centrale ou le boîtier, l’écran, le clavier, la souris ou le pavé tactile. Un périphérique est un appareil relié à l’ordinateur pour saisir, afficher, stocker ou transmettre une information. Un clavier saisit du texte ; un écran affiche ; une imprimante produit une page ; une clé USB transporte des fichiers.

| Élément | Catégorie | Rôle simple |
|---|---|---|
| Écran | Sortie | Affiche les informations et les résultats. |
| Clavier ou pavé tactile | Entrée | Permet de saisir du texte et des commandes. |
| Souris ou pavé tactile | Entrée | Permet de pointer, sélectionner et déplacer. |
| Stockage interne ou externe | Conservation | Garde des fichiers même après l’arrêt. |

> **À retenir :** la [[mémoire vive|espace temporaire|zone utilisée pendant l’exécution des applications]] aide l’ordinateur à travailler au moment présent ; le [[stockage|conservation durable|espace où les fichiers restent enregistrés après l’arrêt]] conserve les documents. Ces deux notions ne désignent pas la même chose.

## 2. Le système d’exploitation et les applications

Le [[système d’exploitation|logiciel principal|programme qui organise l’appareil, les fichiers et l’exécution des applications]] fait le lien entre le matériel, les programmes et l’utilisateur. Il permet d’ouvrir une session, d’utiliser un bureau, de gérer les dossiers et de lancer des applications. Une application sert à une tâche particulière : rédiger, calculer, naviguer, lire un PDF ou présenter un travail.

| Situation fictive | Outil adapté | Limite à connaître |
|---|---|---|
| Rédiger un devoir | Traitement de texte | Enregistrer le fichier avec un nom clair. |
| Rechercher une information | Navigateur web | Vérifier la source avant de reprendre une information. |
| Lire un document reçu | Lecteur de PDF | Ne pas modifier l’original si une copie de travail est préférable. |
| Classer une production | Explorateur de fichiers | Ranger le fichier dans un dossier identifiable. |

## 3. Bien démarrer et bien terminer

Avant de travailler, vérifie que le poste est stable, que les câbles ne gênent pas et que tes mains sont propres et sèches. Ouvre une session personnelle seulement si elle t’est autorisée. Ne ferme pas brusquement un ordinateur qui enregistre ou met à jour un fichier. Lorsque le travail est terminé, enregistre, ferme les applications puis utilise la commande d’arrêt ou de mise en veille prévue par le système.

## Mise en situation — Préparer un exposé au laboratoire

**Situation fictive.** Idriss doit préparer un exposé sur un ordinateur partagé. Il a besoin de saisir du texte, consulter un document et sauvegarder une version de son travail. Il doit d’abord choisir les outils, puis quitter le poste sans laisser son compte ouvert.

| Décision | Réponse responsable |
|---|---|
| Saisir le contenu | Ouvrir un traitement de texte. |
| Consulter une ressource | Utiliser un navigateur ou un lecteur de document selon le fichier. |
| Conserver le travail | Enregistrer dans le dossier autorisé avec un nom clair. |
| Quitter le poste | Fermer la session personnelle et vérifier qu’aucun document privé ne reste visible. |

> **Je sais faire si je peux :** citer une différence entre matériel et logiciel ; nommer un périphérique d’entrée et un périphérique de sortie ; expliquer le rôle général du système d’exploitation ; fermer une session de manière adaptée sur un poste partagé.`,
    rows: [["Quel élément est un périphérique d’entrée ?", ["Le clavier", "L’écran", "Une page imprimée"], ["Le clavier"], "Le clavier permet à l’utilisateur de saisir des informations."], ["Quelle est la fonction principale du système d’exploitation ?", ["Organiser l’appareil et permettre l’usage des applications", "Rédiger tous les devoirs à la place de l’élève", "Remplacer le clavier"], ["Organiser l’appareil et permettre l’usage des applications"], "Le système d’exploitation assure le fonctionnement général entre matériel, applications et utilisateur."], ["Quelle action est adaptée avant de quitter un ordinateur partagé ?", ["Fermer sa session et vérifier les documents ouverts", "Laisser son compte ouvert", "Débrancher l’ordinateur pendant l’enregistrement"], ["Fermer sa session et vérifier les documents ouverts"], "Fermer la session limite l’accès non souhaité à ses informations."], ["Quelle différence est correcte ?", ["Le stockage conserve les fichiers après l’arrêt ; la mémoire vive est temporaire", "La mémoire vive est une imprimante", "Le stockage ne contient jamais de documents"], ["Le stockage conserve les fichiers après l’arrêt ; la mémoire vive est temporaire"], "La mémoire vive aide au travail en cours, tandis que le stockage conserve les fichiers." ]],
  },
  {
    title: "Se repérer dans le système et utiliser les applications",
    description: "Initiation débutant : bureau, fenêtre, menus, barre d’outils, navigation, raccourcis raisonnés et travail dans plusieurs applications.",
    content: `# Maîtriser son ordinateur — Leçon 2 : Se repérer et utiliser les applications

## Objectifs

Tu dois pouvoir te repérer dans le [[bureau|espace de travail|écran principal où l’on accède aux applications, dossiers et réglages]], reconnaître une fenêtre, utiliser un menu et une barre d’outils, passer d’une application à une autre sans perdre ton travail et utiliser quelques gestes de navigation de façon réfléchie.

## 1. Lire l’écran avant de cliquer

Une [[fenêtre|zone d’application|cadre à l’écran où une application ou un document est affiché]] possède souvent un titre, des boutons de réduction, d’agrandissement et de fermeture, ainsi qu’une zone de contenu. Dans une application, un menu regroupe des commandes ; une barre d’outils propose des actions courantes. Avant d’appuyer sur un symbole, observe le titre, le document ouvert et le résultat attendu.

| Élément visible | Utilité habituelle | Geste prudent |
|---|---|---|
| Menu | Regroupe des commandes classées. | Lire le nom de la commande avant de confirmer. |
| Barre d’outils | Donne accès à des actions fréquentes. | Vérifier l’effet sur le document. |
| Onglet | Permet de passer d’un document ou d’une page à une autre. | Identifier l’onglet actif avant de fermer. |
| Barre de défilement | Permet de parcourir un contenu plus long. | Utiliser sans confondre défilement et modification. |

## 2. Ouvrir, modifier, enregistrer

Un document non enregistré peut disparaître après une fermeture ou une panne. Enregistrer tôt puis enregistrer après une modification importante constitue une bonne habitude. La commande « Enregistrer sous » permet de créer une copie à un autre emplacement ou sous un autre nom ; elle ne doit pas être utilisée pour multiplier des fichiers confus.

> **Méthode :** ouvrir le document, vérifier son titre et son emplacement, travailler, enregistrer, puis contrôler que le fichier se trouve au bon endroit avant de fermer.

## 3. Naviguer avec la souris et le clavier

Cliquer sélectionne ou active ; double-cliquer ouvre généralement un élément ; un clic droit ou un appui prolongé affiche souvent un menu contextuel selon l’appareil. Les raccourcis clavier peuvent accélérer des gestes courants, mais ils doivent être employés avec compréhension. Par exemple, sélectionner, copier et coller sont utiles pour déplacer du contenu entre documents ; ils ne remplacent pas la vérification du texte collé ni le respect de la source.

## Mise en situation — Réaliser une recherche courte

**Situation fictive.** N’Guessan ouvre un navigateur pour consulter une source, un traitement de texte pour prendre des notes et un dossier pour conserver son brouillon. Il doit revenir au bon document, sauvegarder sa note et fermer les fenêtres inutiles sans effacer son travail.

| Étape | Action attendue |
|---|---|
| Identifier | Lire le titre de chaque fenêtre et de chaque onglet. |
| Alterner | Passer d’une application à l’autre en gardant le document utile ouvert. |
| Conserver | Enregistrer les notes dans le dossier prévu. |
| Terminer | Fermer les fenêtres inutiles seulement après vérification. |

> **Je sais faire si je peux :** expliquer le rôle d’une fenêtre et d’un onglet ; distinguer fermer une application et enregistrer un document ; citer un avantage et une limite d’un raccourci ; organiser une petite tâche entre plusieurs applications.`,
    rows: [["Avant de fermer une fenêtre, quel contrôle est important ?", ["Vérifier le titre du document et enregistrer si nécessaire", "Cliquer toujours sur le premier symbole", "Éteindre l’écran"], ["Vérifier le titre du document et enregistrer si nécessaire"], "Le titre et l’état d’enregistrement aident à éviter de fermer le mauvais document."], ["À quoi sert généralement « Enregistrer sous » ?", ["Créer une copie avec un autre nom ou emplacement", "Supprimer un dossier", "Mettre l’ordinateur à jour"], ["Créer une copie avec un autre nom ou emplacement"], "Cette commande sert notamment à créer une version distincte sans confondre les fichiers."], ["Quel élément permet souvent de passer entre plusieurs pages dans un navigateur ?", ["Un onglet", "Une imprimante", "Le stockage externe"], ["Un onglet"], "Les onglets organisent plusieurs pages dans une même fenêtre de navigateur."], ["Pourquoi relire un texte après un copier-coller ?", ["Pour vérifier son emplacement, son sens et sa source", "Parce que le clavier ne fonctionne plus", "Pour éviter d’enregistrer"], ["Pour vérifier son emplacement, son sens et sa source"], "Copier-coller est un geste technique ; il ne garantit ni la pertinence ni le bon emplacement du contenu." ]],
  },
  {
    title: "Organiser, enregistrer et retrouver ses fichiers",
    description: "Initiation débutant : fichiers, dossiers, arborescence, nommage, formats, copie, déplacement, suppression prudente et sauvegarde.",
    content: `# Maîtriser son ordinateur — Leçon 3 : Organiser ses fichiers

## Objectifs

Tu dois pouvoir créer une organisation simple de dossiers, donner un nom compréhensible à un [[fichier|document numérique|ensemble de données enregistré sous un nom]], distinguer une copie d’un déplacement, reconnaître le rôle d’un format et retrouver un document sans créer de doublons inutiles.

## 1. Penser comme une armoire de classement

Un [[dossier|conteneur numérique|emplacement qui sert à regrouper des fichiers et parfois d’autres dossiers]] aide à ranger le travail. Une [[arborescence|organisation hiérarchique|structure de dossiers principaux, sous-dossiers et fichiers]] doit rester assez simple pour être comprise plusieurs semaines plus tard.

    Terminale / Informatique / Expose_eau / 01_sources / 02_plan / 03_brouillon / 04_version_finale

L’organisation dépend du travail, mais un dossier principal par projet et quelques sous-dossiers explicites suffisent souvent. Éviter les noms comme « nouveau », « final », « final2 » et « vrai_final » facilite la recherche et réduit les confusions.

| Nom peu utile | Nom plus informatif | Pourquoi |
|---|---|---|
| document | plan_expose_eau_2026-08-24 | Indique le contenu et le contexte. |
| final2 | expose_eau_version_revue | Indique qu’il s’agit d’une version révisée. |
| image | schema_cycle_eau | Permet de retrouver plus vite le visuel. |

## 2. Format et extension

Un [[format de fichier|manière d’enregistrer|règle qui détermine comment un document est stocké et ouvert]] indique la nature générale du document. Une extension visible à la fin du nom peut aider à reconnaître ce format. Un PDF est souvent pratique pour partager une version dont la mise en page doit rester stable ; un document de traitement de texte est plus adapté à une modification. Il ne faut pas renommer l’extension au hasard en pensant convertir automatiquement le contenu.

## 3. Copier, déplacer, supprimer : trois actions différentes

Copier crée une seconde version ; déplacer change l’emplacement du même fichier ; supprimer retire un élément de son emplacement habituel. Avant une suppression, contrôle le nom, l’emplacement et la nécessité du fichier. Une sauvegarde est une copie choisie pour limiter la perte de travail ; elle ne doit pas multiplier sans raison les versions ni rendre public un contenu privé.

## Mise en situation — Retrouver un exposé

**Situation fictive.** Mariam a sauvegardé un exposé dans le dossier Téléchargements et une image dans Images. Elle doit les ranger dans un même dossier de projet, conserver le document original comme brouillon et créer une version finale à partager avec son professeur.

| Objectif | Décision responsable |
|---|---|
| Regrouper | Créer un dossier de projet clair puis y déplacer ou copier les éléments utiles. |
| Préserver le brouillon | Garder une version identifiable avant une modification importante. |
| Partager | Exporter ou enregistrer la version attendue dans le format demandé. |
| Retrouver plus tard | Utiliser un nom explicite et le bon dossier plutôt que multiplier les doublons. |

> **Je sais faire si je peux :** expliquer dossier, fichier et arborescence ; choisir un nom utile ; distinguer copie et déplacement ; justifier une sauvegarde ; dire pourquoi changer seulement l’extension ne convertit pas un fichier.`,
    rows: [["Quel nom rend un fichier d’exposé plus facile à retrouver ?", ["plan_expose_eau_2026-08-24", "nouveau", "final_final2"], ["plan_expose_eau_2026-08-24"], "Un nom utile donne un indice sur le contenu, le projet ou la version."], ["Quelle action conserve l’original tout en créant une seconde version ?", ["Copier", "Déplacer", "Fermer"], ["Copier"], "Copier produit une nouvelle version ; déplacer change seulement l’emplacement du fichier existant."], ["Pourquoi ne faut-il pas changer l’extension d’un fichier au hasard ?", ["Cela ne transforme pas automatiquement le contenu dans un nouveau format", "Cela augmente toujours la qualité du document", "Cela sauvegarde automatiquement le fichier"], ["Cela ne transforme pas automatiquement le contenu dans un nouveau format"], "Une conversion exige un outil ou une commande adaptée, pas seulement un changement de nom."], ["Quel usage correspond à une sauvegarde ?", ["Conserver une copie choisie pour limiter une perte de travail", "Supprimer tous les brouillons", "Partager publiquement un document privé"], ["Conserver une copie choisie pour limiter une perte de travail"], "Une sauvegarde protège le travail, mais doit rester organisée et respectueuse de la confidentialité." ]],
  },
  {
    title: "Entretenir son poste et résoudre les problèmes simples",
    description: "Initiation débutant : mises à jour officielles, espace de stockage, réseau, application qui ne répond plus, redémarrage raisonné et demande d’aide.",
    content: `# Maîtriser son ordinateur — Leçon 4 : Entretenir son poste et résoudre les problèmes simples

## Objectifs

Tu dois pouvoir appliquer une démarche calme face à un problème courant, vérifier l’alimentation, les connexions et l’espace disponible, distinguer un redémarrage d’un arrêt forcé, demander de l’aide avec des informations utiles et rester dans les limites d’un dépannage débutant.

## 1. Prévenir plutôt que réparer dans l’urgence

Un poste bien utilisé est plus facile à maintenir. Installer les mises à jour depuis le système, le magasin officiel ou le site confirmé d’un éditeur, garder un espace de stockage disponible, fermer les applications inutiles et enregistrer régulièrement son travail sont des habitudes simples. Une mise à jour inattendue reçue par lien doit être vérifiée par le canal habituel, conformément aux repères de sécurité étudiés précédemment.

| Signe observé | Vérification accessible | Action prudente |
|---|---|---|
| Batterie faible | Lire l’indicateur d’alimentation. | Brancher le chargeur adapté si autorisé. |
| Application lente | Observer les applications ouvertes. | Enregistrer puis fermer les applications inutiles. |
| Stockage presque plein | Consulter l’espace disponible. | Trier les fichiers inutiles avec prudence et conserver les travaux importants. |
| Connexion absente | Vérifier le mode avion, le réseau autorisé ou le câble. | Demander de l’aide si le problème dépasse les réglages simples. |

## 2. Une méthode de dépannage débutant

La première règle est de ne pas paniquer ni cliquer au hasard. Décris le problème : quelle application, quel message, quelle action venait d’être faite ? Vérifie ensuite les éléments simples. Si une application ne répond plus, enregistre si possible, attends quelques instants, puis utilise la procédure normale de fermeture. Un [[redémarrage|relance contrôlée|action qui ferme puis relance le système pour repartir dans un état plus stable]] peut résoudre certains problèmes temporaires, mais ne remplace pas une analyse si le problème revient.

1. **Observer.** Noter le message, le nom de l’application et le contexte.
2. **Protéger.** Enregistrer le travail si cela reste possible.
3. **Vérifier.** Contrôler alimentation, connexion, espace disponible et application concernée.
4. **Agir avec mesure.** Fermer normalement, redémarrer si la situation le justifie, puis retester.
5. **Demander de l’aide.** Expliquer ce qui a été observé sans communiquer de mot de passe ni code.

## Mise en situation — L’application qui ne répond plus

**Situation fictive.** Koffi rédige un devoir. L’application semble bloquée : le curseur ne réagit plus, mais il ne sait pas si le document a été enregistré. Il pense d’abord à couper l’alimentation.

| Décision | Analyse |
|---|---|
| Couper l’alimentation immédiatement | Risque de perdre le travail ; à éviter sauf consigne d’une personne compétente face à une situation particulière. |
| Attendre, observer, tenter l’enregistrement puis utiliser la fermeture normale | Démarche adaptée aux problèmes simples. |
| Chercher et installer un outil inconnu envoyé dans un message | À éviter ; utiliser uniquement des canaux officiels et demander de l’aide. |

> **Limite importante :** un débutant ne doit ni démonter un appareil, ni modifier des réglages avancés, ni installer un programme inconnu pour « réparer ». Lorsque le problème persiste, il faut demander l’aide du responsable du matériel, de l’établissement ou d’une personne de confiance.

> **Je sais faire si je peux :** décrire une panne simple ; choisir un premier contrôle sans risque ; expliquer le rôle d’un redémarrage ; préparer les informations utiles pour demander de l’aide ; reconnaître une action qui dépasse le dépannage débutant.`,
    rows: [["Quelle est la première attitude adaptée face à une application qui ne répond plus ?", ["Observer le problème et tenter de préserver le travail", "Couper immédiatement l’alimentation", "Installer un outil inconnu"], ["Observer le problème et tenter de préserver le travail"], "Une démarche calme protège le travail et permet de comprendre le contexte avant d’agir."], ["Quelle source convient à une mise à jour ?", ["Les réglages du système ou un canal officiel", "Tout lien reçu dans une discussion", "Une application inconnue"], ["Les réglages du système ou un canal officiel"], "Les mises à jour doivent venir d’un environnement reconnu et vérifiable."], ["Quelles informations sont utiles pour demander de l’aide ?", ["Le nom de l’application, le message observé et les actions déjà réalisées", "Un mot de passe personnel", "Des informations inventées"], ["Le nom de l’application, le message observé et les actions déjà réalisées"], "Une description précise aide l’assistance sans exposer d’informations sensibles."], ["Quelle action dépasse le dépannage débutant ?", ["Démonter l’appareil ou modifier des réglages avancés", "Vérifier l’alimentation", "Redémarrer de façon contrôlée"], ["Démonter l’appareil ou modifier des réglages avancés"], "Les gestes techniques risqués doivent être confiés à une personne compétente." ]],
  },
];

const exerciseSql = (id, rows) => `insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values ${rows.map(([prompt, options, correct, explanation], index) => `(${id},'single_choice',${sqlText(prompt)},${jsonArray(options)},${jsonArray(correct)},${sqlText(explanation)},${(index + 1) * 10})`).join(",")};`;
const quizSql = (id, title, lesson, order) => { const rows = lesson.rows; const questions = rows.map(([question, , , explanation], index) => `(${id},${sqlText(question)},${sqlText(explanation)},'single_choice',${(index + 1) * 10},1,true)`).join(","); const answers = rows.flatMap(([, options, correct], index) => options.map((answer, optionIndex) => `(${(index + 1) * 10},${sqlText(answer)},${correct.includes(answer)},${(optionIndex + 1) * 10})`)).join(","); return `insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active,is_test_data) values (target.subject_id,target.level_id,target.series_id,target.offering_id,target_chapter_id,target_lesson_id,${sqlText(title)},${sqlText(`Vérifie les repères de la leçon « ${lesson.title} ».`)},'medium',12,${order},false,false,false) returning id into ${id}; with iq as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values ${questions} returning id,display_order) insert into public.quiz_answers (question_id,answer,is_correct,display_order) select iq.id,v.answer,v.correct,v.answer_order from iq join (values ${answers}) as v(question_order,answer,correct,answer_order) on v.question_order=iq.display_order;`; };
const lessonSql = (lesson, index) => { const n = index + 1; const scenario = `scenario_${n}_id`; const consolidation = `consolidation_${n}_id`; const quizA = `quiz_a_${n}_id`; const quizB = `quiz_b_${n}_id`; const base = n * 100; return `insert into public.lessons (chapter_id,title,description,content,display_order,is_test_data,is_active) values (target_chapter_id,${sqlText(lesson.title)},${sqlText(lesson.description)},${sqlText(lesson.content)},${n * 10},false,false) returning id into target_lesson_id; insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order,is_test_data) values (target.subject_id,target.level_id,target.series_id,target_chapter_id,target_lesson_id,${sqlText(`Mise en situation ${n} — ${lesson.title}`)},${sqlText("Analyse une situation fictive et choisis l’action qui protège le travail et le poste.")},${sqlText("La correction explique une démarche débutant, prudente et vérifiable.")},'single_choice','medium',${sqlText("Réponds sans utiliser de données réelles ni modifier un appareil.")},${sqlText("Relie la décision à la notion expliquée dans la leçon.")},false,false,20,${base + 10},false) returning id into ${scenario}; ${exerciseSql(scenario, lesson.rows)} insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order,is_test_data) values (target.subject_id,target.level_id,target.series_id,target_chapter_id,target_lesson_id,${sqlText(`Exercice de consolidation ${n} — ${lesson.title}`)},${sqlText("Réinvestis le vocabulaire et les gestes utiles de la leçon.")},${sqlText("La correction rappelle la définition et la méthode associée.")},'single_choice','medium',${sqlText("Choisis la réponse justifiée par le cours.")},${sqlText("Lis l’explication après chaque réponse.")},false,false,20,${base + 20},false) returning id into ${consolidation}; ${exerciseSql(consolidation, lesson.rows)} ${quizSql(quizA, `Quiz ${n}A — Comprendre son ordinateur`, lesson, base + 10)} ${quizSql(quizB, `Quiz ${n}B — Bien utiliser son ordinateur`, lesson, base + 20)}`; };

const annotationSql = `
  update public.lessons l set content = case l.title
    when 'Penser comme un informaticien : algorithmes et pseudo-code' then replace(replace(replace(l.content,'Un **algorithme** est','Un [[algorithme|méthode précise|suite ordonnée d’instructions permettant de résoudre un problème]] est'),'Le **pseudo-code** est','Le [[pseudo-code|logique écrite|façon lisible de décrire un algorithme avant le choix d’un langage]] est'),'la condition sépare deux cas','la [[condition|choix logique|question vraie ou fausse qui permet de choisir une action]] sépare deux cas')
    when 'Représenter et comprendre les données' then replace(replace(replace(l.content,'Une **donnée** est','Une [[donnée|valeur enregistrée|information brute qui peut être organisée et traitée]] est'),'Une **colonne** rassemble','Une [[colonne|catégorie de table|ensemble de valeurs de même nature dans un tableau]] rassemble'),'Un **bit** est','Un [[bit|chiffre binaire|unité qui prend la valeur 0 ou 1]] est')
    when 'Premiers programmes : variables, conditions et boucles' then replace(replace(replace(l.content,'Une **variable**','Une [[variable|repère de valeur|nom associé à une valeur qui peut évoluer pendant un programme]]'),'Une **condition**','Une [[condition|choix logique|question vraie ou fausse qui permet de choisir une action]]'),'Une **boucle**','Une [[boucle|répétition contrôlée|structure qui applique une même règle à plusieurs éléments]]')
  end
  from public.chapters c where l.chapter_id=c.id and c.subject_offering_id in (${offerings.map(sqlText).join(",")}) and c.title=${sqlText(coreChapter)} and l.title in ('Penser comme un informaticien : algorithmes et pseudo-code','Représenter et comprendre les données','Premiers programmes : variables, conditions et boucles') and l.is_active=false and l.is_test_data=false and l.content not like '%[[%';
`;

const migration = `-- Informatique / TICE Terminale : infobulles techniques et maîtrise de l’ordinateur.
-- Les annotations concernent uniquement les brouillons inactifs. Les nouvelles ressources restent brouillons, inactives et non publiées.
do $computer_mastery_and_glossary$
declare target record; target_chapter_id uuid; target_lesson_id uuid; chapter_order integer; offering_count integer; annotated_count integer;
  scenario_1_id uuid; consolidation_1_id uuid; quiz_a_1_id uuid; quiz_b_1_id uuid; scenario_2_id uuid; consolidation_2_id uuid; quiz_a_2_id uuid; quiz_b_2_id uuid; scenario_3_id uuid; consolidation_3_id uuid; quiz_a_3_id uuid; quiz_b_3_id uuid; scenario_4_id uuid; consolidation_4_id uuid; quiz_a_4_id uuid; quiz_b_4_id uuid;
begin
  select count(*) into offering_count from public.course_subject_offerings where id in (${offerings.map(sqlText).join(",")}) and is_test_data=false; if offering_count<>4 then raise exception 'Les quatre offres Informatique / TICE Terminale officielles sont requises.'; end if;
  if exists (select 1 from public.chapters c where c.subject_offering_id in (${offerings.map(sqlText).join(",")}) and c.title=${sqlText(chapterTitle)}) then raise exception 'Le chapitre Maîtriser son ordinateur existe déjà : duplication interdite.'; end if;
  if exists (select 1 from public.lessons l join public.chapters c on c.id=l.chapter_id where c.subject_offering_id in (${offerings.map(sqlText).join(",")}) and l.title in (${lessons.map((lesson) => sqlText(lesson.title)).join(",")})) then raise exception 'Une leçon de maîtrise de l’ordinateur existe déjà : duplication interdite.'; end if;
  select count(*) into annotated_count from public.lessons l join public.chapters c on c.id=l.chapter_id where c.subject_offering_id in (${offerings.map(sqlText).join(",")}) and c.title=${sqlText(coreChapter)} and l.is_active=false and l.is_test_data=false and l.title in ('Penser comme un informaticien : algorithmes et pseudo-code','Représenter et comprendre les données','Premiers programmes : variables, conditions et boucles') and l.content not like '%[[%';
  if annotated_count<>12 then raise exception 'Les 12 brouillons Informatique attendus pour annotation sont introuvables ou déjà annotés.'; end if;
${annotationSql}
  if exists (select 1 from public.lessons l join public.chapters c on c.id=l.chapter_id where c.subject_offering_id in (${offerings.map(sqlText).join(",")}) and c.title=${sqlText(coreChapter)} and l.title in ('Penser comme un informaticien : algorithmes et pseudo-code','Représenter et comprendre les données','Premiers programmes : variables, conditions et boucles') and l.content not like '%[[%|%|%]]%') then raise exception 'Une annotation technique attendue est absente.'; end if;
  for target in select o.id as offering_id,o.subject_id,o.level_id,o.series_id from public.course_subject_offerings o where o.id in (${offerings.map(sqlText).join(",")}) and o.is_test_data=false loop
    select coalesce(max(c.display_order),0)+10 into chapter_order from public.chapters c where c.subject_offering_id=target.offering_id;
    insert into public.chapters (subject_id,level_id,series_id,subject_offering_id,title,description,display_order,is_test_data,is_active) values (target.subject_id,target.level_id,target.series_id,target.offering_id,${sqlText(chapterTitle)},'Parcours complémentaire débutant : matériel, système, applications, fichiers et dépannage simple.',chapter_order,false,false) returning id into target_chapter_id;
${lessons.map(lessonSql).join("\n")}
  end loop;
end $computer_mastery_and_glossary$;`;
writeFileSync(migrationPath, migration, "utf8");
writeFileSync(payloadPath, `${JSON.stringify({ project_id: "nnshioowwniursnozicg", name: "computer_mastery_and_glossary_drafts", query: migration }, null, 2)}\n`, "utf8");
console.log(migrationPath); console.log(payloadPath);
