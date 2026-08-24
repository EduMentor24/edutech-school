import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const migrationPath = resolve(root, "supabase/migrations/20260824_computer_science_terminal_core_foundations_drafts.sql");
const payloadPath = resolve(root, "supabase/migrations/20260824_computer_science_terminal_core_foundations_drafts.apply.json");
const offerings = ["0beafff1-63db-42c9-99a2-8ef6da799f19", "7680fb4a-c9d4-41df-92f3-a91effda4944", "7695b4cf-0524-4de4-af91-f8d79eed2b0a", "f9c030a4-8b30-4657-b7bb-d81e4e500635"];
const chapterTitle = "Bases de l’informatique : raisonner, représenter et programmer";
const sqlText = (value) => { const tag = "$core_foundations$"; if (value.includes(tag)) throw new Error("Délimiteur SQL présent dans un contenu."); return `${tag}${value}${tag}`; };
const jsonArray = (items) => `jsonb_build_array(${items.map(sqlText).join(",")})`;

const lessons = [
  {
    title: "Penser comme un informaticien : algorithmes et pseudo-code",
    description: "Fondations : problème, données d’entrée, traitement, résultat, décomposition, conditions, test manuel et pseudo-code lisible.",
    content: `# Bases de l’informatique — Leçon 1 : Penser comme un informaticien

> **Statut pédagogique :** ce cours appartient à un parcours complémentaire d’initiation, non officiel, créé pour EduTech School. Il prépare à la logique informatique sans imposer un langage de programmation particulier.

## Objectifs

À la fin de la leçon, tu dois pouvoir transformer une tâche en problème clair, identifier ses **entrées**, son **traitement** et son **résultat**, décomposer des étapes, écrire un pseudo-code simple et vérifier manuellement si ce pseudo-code produit le résultat attendu.

## 1. Un algorithme est une méthode précise

Un **algorithme** est une suite finie d’instructions ordonnées qui permet d’atteindre un résultat. Une recette, un itinéraire ou une procédure de classement peuvent être décrits comme des algorithmes si les étapes sont assez claires pour être suivies sans improvisation. En informatique, un programme traduit un algorithme dans un langage compris par une machine.

| Élément | Question utile | Exemple scolaire fictif |
|---|---|---|
| **Entrée** | Quelles informations sont nécessaires au départ ? | La liste des tâches et leur heure limite. |
| **Traitement** | Quelles règles ou actions faut-il appliquer ? | Trier les tâches selon une règle connue. |
| **Sortie** | Quel résultat veut-on obtenir ? | Une liste de tâches à effectuer dans un ordre justifié. |

> **Idée essentielle :** un ordinateur n’invente pas la règle attendue. Il applique les instructions qui lui sont données. Une instruction imprécise peut donc produire un résultat imprécis.

## 2. Décomposer avant de programmer

Un problème trop large devient plus accessible lorsqu’on le découpe. Cette **décomposition** consiste à isoler des sous-problèmes simples. Pour organiser une séance de révision fictive, on peut distinguer : recueillir les tâches, vérifier la durée disponible, choisir l’ordre, afficher le planning et contrôler qu’aucune tâche importante n’a été oubliée.

| Mauvaise consigne | Pourquoi elle est insuffisante | Consigne plus exploitable |
|---|---|---|
| « Organise tout rapidement. » | Aucun critère ni résultat précis. | « Place d’abord les tâches dont l’échéance est la plus proche, puis affiche l’ordre obtenu. » |
| « Vérifie si c’est bon. » | On ne sait pas ce qui doit être vérifié. | « Vérifie que chaque tâche possède un nom et une durée positive. » |
| « Fais la moyenne. » | Les données et le calcul ne sont pas définis. | « Additionne les valeurs présentes puis divise par le nombre de valeurs valides. » |

## 3. Pseudo-code : écrire la logique avant le langage

 Le **pseudo-code** est une écriture intermédiaire : il ne dépend pas d’un langage précis mais présente la logique avec des mots simples et une structure claire. Les mots **SI**, **ALORS**, **SINON**, **POUR CHAQUE** et **AFFICHER** sont ici des conventions de lecture ; ils ne constituent pas un langage universel à recopier dans un logiciel.

    DEBUT
      LIRE nombreDeTaches
      SI nombreDeTaches > 0 ALORS
        AFFICHER "Prépare une première tâche"
      SINON
        AFFICHER "Ajoute au moins une tâche"
      FIN SI
    FIN

Dans cet exemple, la condition sépare deux cas. Le test n’est pas une devinette : il doit être formulé de manière à produire une réponse vraie ou fausse. Une bonne habitude consiste à relire le pseudo-code en jouant le rôle de la machine, ligne après ligne.

## 4. Mise en situation — Préparer un planning de révision

**Situation fictive.** Amadou dispose d’une liste de tâches : relire un cours, faire des exercices et préparer une présentation. Il souhaite créer une règle simple : si une tâche est due le lendemain, elle est affichée en priorité ; sinon, elle est placée après les tâches prioritaires.

| Étape de raisonnement | Décision attendue |
|---|---|
| Entrées | Le nom de chaque tâche et sa date limite. |
| Règle | Comparer la date limite de chaque tâche à la date du lendemain. |
| Sortie | Une liste où les tâches prioritaires apparaissent avant les autres. |
| Test | Essayer une liste avec une tâche urgente, puis une liste sans tâche urgente. |

> **Pseudo-code guidé :** POUR CHAQUE tâche, SI la tâche est due le lendemain ALORS l’ajouter à la liste prioritaire, SINON l’ajouter à l’autre liste. AFFICHER ensuite la liste prioritaire puis l’autre liste.

## 5. Tester et corriger : le débogage commence par la logique

Tester signifie comparer le résultat obtenu au résultat attendu. Un **cas de test** est un exemple choisi pour vérifier une règle : une liste vide, une seule tâche, plusieurs tâches identiques ou une information manquante. Si le résultat n’est pas attendu, il faut repérer l’étape qui pose problème, corriger une seule règle à la fois et tester de nouveau. Cette démarche est appelée **débogage** lorsqu’elle concerne un programme ou une logique de programme.

> **Je sais faire si je peux :** nommer les entrées, le traitement et la sortie d’un problème ; écrire une condition simple ; expliquer pourquoi un cas de test particulier est utile ; décrire une correction sans changer au hasard tout l’algorithme.

| Vocabulaire | Définition |
|---|---|
| Algorithme | Suite finie d’instructions ordonnées pour résoudre un problème. |
| Pseudo-code | Écriture lisible de la logique avant le choix d’un langage. |
| Condition | Question dont la réponse permet de choisir une branche. |
| Décomposition | Découpage d’un problème en sous-problèmes gérables. |
| Cas de test | Exemple utilisé pour vérifier un comportement attendu. |`,
    scenarioRows: [
      ["Pour organiser des tâches de révision, quelle information est une entrée utile ?", ["Le nom de la tâche et son échéance", "La couleur préférée de l’élève", "Le résultat final avant le calcul"], ["Le nom de la tâche et son échéance"], "Une entrée est une information connue au départ et nécessaire pour appliquer la règle."],
      ["Quelle formulation correspond à une sortie ?", ["La liste ordonnée des tâches à réaliser", "La règle qui compare les échéances", "La question posée à l’utilisateur"], ["La liste ordonnée des tâches à réaliser"], "La sortie est le résultat produit après le traitement des informations."],
      ["Pourquoi tester un algorithme avec une liste vide ?", ["Pour vérifier le comportement lorsque aucune donnée n’est disponible", "Pour éviter d’écrire la règle", "Pour remplacer toutes les autres vérifications"], ["Pour vérifier le comportement lorsque aucune donnée n’est disponible"], "Un cas limite révèle souvent une instruction manquante ou une hypothèse non formulée."],
      ["Quel pseudo-code est le plus précis ?", ["SI nombreDeTaches > 0 ALORS afficher une tâche, SINON demander d’ajouter une tâche", "Organise bien les tâches", "Fais quelque chose avec les tâches"], ["SI nombreDeTaches > 0 ALORS afficher une tâche, SINON demander d’ajouter une tâche"], "Une instruction exploitable indique une condition et les actions associées à chaque résultat."],
    ],
    methodRows: [
      ["Quelle étape correspond à la décomposition d’un problème ?", ["Séparer le recueil des données, le tri et l’affichage", "Choisir immédiatement un langage complexe", "Supprimer les résultats qui ne plaisent pas"], ["Séparer le recueil des données, le tri et l’affichage"], "La décomposition réduit un problème à des parties qui peuvent être comprises et testées séparément."],
      ["Que doit-on faire si un test ne produit pas le résultat attendu ?", ["Repérer la règle en cause, corriger puis tester à nouveau", "Modifier toutes les instructions au hasard", "Conclure que l’ordinateur refuse de fonctionner"], ["Repérer la règle en cause, corriger puis tester à nouveau"], "Le débogage suit une démarche progressive et vérifiable."],
      ["Dans une condition, quel résultat est attendu ?", ["Vrai ou faux", "Une image obligatoire", "Un mot de passe"], ["Vrai ou faux"], "Une condition sert à choisir une suite d’instructions selon un critère vérifiable."],
      ["Quel ordre est pertinent pour résoudre un problème ?", ["Comprendre, décomposer, écrire la logique, tester", "Programmer d’abord, comprendre ensuite", "Choisir un résultat puis inventer les données"], ["Comprendre, décomposer, écrire la logique, tester"], "La conception commence par le problème et se poursuit par des essais contrôlés."],
    ],
    quizRows: [
      ["Quel est le rôle principal d’un algorithme ?", "Il décrit une méthode ordonnée pour produire un résultat.", [["Résoudre un problème par étapes", true], ["Remplacer toute réflexion humaine", false], ["Créer automatiquement des données fiables", false]]],
      ["Le pseudo-code dépend-il d’un seul langage de programmation ?", "Il est une représentation lisible de la logique avant le langage choisi.", [["Non, il représente la logique de façon générale", true], ["Oui, il ne fonctionne qu’en Python", false], ["Oui, il est une base de données", false]]],
      ["Quel élément est un cas de test ?", "Un exemple précis utilisé pour vérifier que la règle donne le bon résultat.", [["Une liste vide de tâches", true], ["Le titre du chapitre", false], ["Le nom de l’ordinateur", false]]],
      ["Que compare-t-on lors d’un test ?", "On compare le résultat obtenu à ce que la règle devait produire.", [["Le résultat obtenu et le résultat attendu", true], ["Deux mots de passe", false], ["Deux logos", false]]],
    ],
  },
  {
    title: "Représenter et comprendre les données",
    description: "Fondations : données, types, tables, lignes, colonnes, qualité des données et représentation binaire élémentaire.",
    content: `# Bases de l’informatique — Leçon 2 : Représenter et comprendre les données

> **Statut pédagogique :** ce cours complémentaire non officiel introduit des notions générales de données. Les tableaux et exemples sont fictifs ; aucune donnée réelle d’élève n’est demandée ni utilisée.

## Objectifs

Tu dois pouvoir distinguer une donnée d’une information interprétée, reconnaître des types simples, lire une table, repérer une donnée manquante ou incohérente, expliquer l’idée d’une représentation binaire et comprendre pourquoi la qualité des données influence un résultat informatique.

## 1. Une donnée n’est pas encore une conclusion

Une **donnée** est une valeur enregistrée : un nombre, un texte, une date, une réponse oui/non ou une mesure. L’information apparaît lorsque des données sont organisées et interprétées dans un contexte. Par exemple, la valeur « 45 » ne signifie rien seule ; elle peut représenter un temps, un nombre de pages ou une note selon la colonne qui l’accompagne.

| Type simple | Exemple fictif | Utilisation possible |
|---|---|---|
| Texte | « Exercices de logique » | Nom d’une activité. |
| Nombre | 45 | Durée en minutes si l’unité est précisée. |
| Booléen | vrai / faux | Indiquer si une tâche est terminée. |
| Date | 2026-08-24 | Situer une échéance. |

> **Règle de clarté :** une donnée doit être accompagnée d’un nom, d’une unité lorsque nécessaire et d’un contexte. Sans cela, elle peut être mal interprétée.

## 2. Lire une table : lignes, colonnes et enregistrements

Une table organise des données. Une **colonne** rassemble la même catégorie d’information ; une **ligne** regroupe les informations liées à un même élément, parfois appelé enregistrement.

| Activité fictive | Durée prévue (min) | Terminée ? |
|---|---:|---|
| Relire l’algorithme | 30 | faux |
| Exercices de données | 45 | vrai |
| Préparer un résumé | 20 | faux |

Dans cet exemple, « Durée prévue » est une colonne numérique dont l’unité est la minute. « Terminée ? » est une colonne booléenne. La table peut servir à calculer un total, filtrer les activités terminées ou organiser un planning, à condition que les données soient cohérentes.

## 3. Qualité : vérifier avant de calculer

Un ordinateur traite les valeurs qu’on lui fournit. Si une durée manque, si une date est mal saisie ou si une même activité est dupliquée, un calcul peut produire une réponse trompeuse tout en étant effectué correctement. La qualité ne signifie pas qu’une donnée est parfaite : elle signifie qu’on connaît sa source, son format, ses limites et les vérifications nécessaires.

| Problème possible | Exemple fictif | Réaction raisonnable |
|---|---|---|
| Valeur manquante | La durée d’une activité est vide. | Ne pas la remplacer au hasard ; la demander ou l’indiquer comme manquante. |
| Unité absente | Une colonne contient « 45 » sans préciser minute, page ou point. | Ajouter ou vérifier l’unité avant le calcul. |
| Doublon | Une même activité apparaît deux fois. | Contrôler si c’est une répétition réelle ou une erreur de saisie. |
| Valeur incohérente | Une durée négative apparaît dans un planning. | Vérifier la saisie et les règles prévues. |

## 4. Une introduction au binaire

Les appareils numériques utilisent des états physiques simples qui peuvent être représentés par **0** et **1**. Un **bit** est un chiffre binaire. Plusieurs bits peuvent représenter un nombre, une lettre, une couleur ou une instruction selon une règle de codage. Le système binaire est donc une façon de représenter une information, pas une langue secrète.

| Écriture décimale | Décomposition | Écriture binaire |
|---:|---|---:|
| 5 | 4 + 1 | 101 |
| 6 | 4 + 2 | 110 |
| 7 | 4 + 2 + 1 | 111 |

Cette table utilise les puissances de deux : 1, 2, 4, 8, etc. Pour 5, on active 4 et 1, ce qui donne 101. L’objectif est de comprendre que les données peuvent être représentées de plusieurs manières ; il ne s’agit pas de mémoriser une longue liste de conversions.

## 5. Mise en situation — Un tableau de révision à contrôler

**Situation fictive.** Salma prépare un tableau de révision. Une ligne indique « Exercices : 40 », une autre « Résumé : » et une troisième « Lecture : -15 ». Avant de calculer le temps total, elle doit décider quelles données sont utilisables.

| Valeur observée | Diagnostic | Action attendue |
|---|---|---|
| 40 sans unité dans un planning | Incomplète : on ignore si c’est une durée ou une quantité. | Demander ou ajouter l’unité avant de totaliser. |
| Valeur vide | Manquante. | La signaler, ne pas inventer une durée. |
| -15 minutes | Incohérente pour une durée prévue. | Vérifier la saisie ou la règle de calcul. |

> **Idée essentielle :** un calcul automatique n’est fiable que si les données et les règles utilisées sont adaptées au problème. Vérifier les données fait partie du travail informatique.

> **Je sais faire si je peux :** nommer le type probable d’une donnée ; expliquer le rôle d’une colonne ; repérer une valeur qui demande vérification ; montrer avec un exemple pourquoi 5 peut s’écrire 101 en binaire.

| Vocabulaire | Définition |
|---|---|
| Donnée | Valeur enregistrée qui peut être traitée. |
| Table | Organisation de données en lignes et colonnes. |
| Type | Nature attendue d’une valeur : texte, nombre, booléen, date, etc. |
| Bit | Chiffre binaire, égal à 0 ou 1. |
| Qualité des données | Degré de cohérence, de contexte et de fiabilité adapté à l’usage. |`,
    scenarioRows: [
      ["Dans un tableau de révision, une cellule contient « 45 » sans unité. Que faut-il faire avant un calcul de durée ?", ["Vérifier ou préciser l’unité", "Supposer que tout nombre représente des minutes", "Supprimer toutes les autres lignes"], ["Vérifier ou préciser l’unité"], "Un nombre n’est interprétable correctement que si son contexte et son unité sont connus."],
      ["Quelle colonne est de type booléen ?", ["Terminée ? : vrai ou faux", "Nom de l’activité", "Durée prévue en minutes"], ["Terminée ? : vrai ou faux"], "Un booléen exprime ici un état à deux possibilités : vrai ou faux."],
      ["Une activité apparaît deux fois dans une table. Quelle est la première démarche ?", ["Vérifier s’il s’agit d’une répétition réelle ou d’un doublon", "Additionner les deux sans regarder", "Inventer une troisième activité"], ["Vérifier s’il s’agit d’une répétition réelle ou d’un doublon"], "Un doublon peut fausser un total ; il faut comprendre son origine avant de le traiter."],
      ["Pourquoi la valeur -15 mérite-t-elle une vérification dans une colonne de durée prévue ?", ["Parce qu’elle paraît incohérente avec le sens de la colonne", "Parce que tous les nombres négatifs sont interdits en informatique", "Parce qu’elle est écrite avec deux caractères"], ["Parce qu’elle paraît incohérente avec le sens de la colonne"], "La cohérence dépend du contexte : certaines données négatives sont utiles, mais pas forcément pour une durée prévue."],
    ],
    methodRows: [
      ["Comment se décompose le nombre décimal 5 dans l’exemple binaire de la leçon ?", ["4 + 1", "2 + 2 + 2", "8 + 1"], ["4 + 1"], "Les positions binaires représentent des puissances de deux. Pour 5, les positions 4 et 1 sont actives."],
      ["Quelle suite représente 5 en binaire dans la table de la leçon ?", ["101", "110", "111"], ["101"], "101 correspond à 4 + 0 + 1."],
      ["Quelle affirmation distingue correctement donnée et information ?", ["Une donnée prend du sens quand elle est organisée et interprétée dans un contexte", "Toute donnée est déjà une conclusion certaine", "Une information ne peut jamais contenir de nombre"], ["Une donnée prend du sens quand elle est organisée et interprétée dans un contexte"], "Le contexte, le nom de la colonne et l’unité permettent d’interpréter une valeur."],
      ["Quelle réaction est correcte face à une valeur manquante ?", ["La signaler ou rechercher la source plutôt que l’inventer", "La remplacer toujours par zéro", "La transformer automatiquement en texte"], ["La signaler ou rechercher la source plutôt que l’inventer"], "Une valeur manquante doit être traitée selon une règle justifiée, pas remplacée au hasard."],
    ],
    quizRows: [
      ["Qu’est-ce qu’une colonne dans une table ?", "Elle rassemble des valeurs de même nature ou catégorie.", [["Une catégorie de données", true], ["Une seule activité complète", false], ["Un mot de passe", false]]],
      ["Quel type convient à « vrai / faux » ?", "Une valeur booléenne possède ici deux états possibles.", [["Booléen", true], ["Date", false], ["Texte long obligatoire", false]]],
      ["Que représente un bit ?", "Un bit est une unité binaire qui prend la valeur 0 ou 1.", [["Un 0 ou un 1", true], ["Une colonne entière", false], ["Une instruction de boucle", false]]],
      ["Pourquoi vérifier les données avant un calcul ?", "Un calcul exact appliqué à des données incohérentes peut donner une interprétation erronée.", [["Pour éviter une conclusion trompeuse", true], ["Pour supprimer les règles", false], ["Pour éviter toute table", false]]],
    ],
  },
  {
    title: "Premiers programmes : variables, conditions et boucles",
    description: "Fondations : variable, entrée, sortie, condition, boucle, trace d’exécution et débogage logique sans dépendance à un langage précis.",
    content: `# Bases de l’informatique — Leçon 3 : Premiers programmes

> **Statut pédagogique :** ce cours complémentaire non officiel introduit la logique commune à de nombreux langages. Les exemples utilisent un pseudo-code pédagogique ; ils ne demandent aucun compte, aucune installation ni donnée réelle.

## Objectifs

À la fin de la leçon, tu dois pouvoir expliquer le rôle d’une variable, d’une entrée et d’une sortie ; lire une condition et une boucle simples ; suivre une exécution pas à pas ; repérer une erreur de logique élémentaire et proposer une correction précise.

## 1. Un programme transforme des entrées en sorties

Un **programme** est une série d’instructions écrites dans un langage de programmation. Il reçoit souvent des entrées, mémorise certaines valeurs, applique des règles et produit une sortie. La logique est plus importante que le choix du langage au début : les notions de variable, condition et répétition se retrouvent dans de nombreux environnements.

| Notion | Rôle | Exemple fictif |
|---|---|---|
| **Variable** | Nom associé à une valeur qui peut évoluer. | **totalDuree** mémorise une somme de minutes. |
| **Entrée** | Valeur fournie au programme. | La durée d’une activité. |
| **Traitement** | Opération ou règle appliquée. | Ajouter une durée au total. |
| **Sortie** | Résultat affiché ou produit. | « Temps total prévu : 95 min ». |

## 2. Variables : conserver une valeur avec un nom utile

Une variable doit porter un nom qui aide à comprendre son rôle. Dans un pseudo-code, l’instruction **total ← 0** signifie que l’on initialise la variable **total** à zéro. Ensuite, **total ← total + duree** remplace l’ancienne valeur par une nouvelle somme. Ce symbole de flèche représente une affectation : il ne signifie pas une égalité mathématique permanente.

    totalDuree ← 0
    duree ← 30
    totalDuree ← totalDuree + duree
    AFFICHER totalDuree

Après l’exécution, **totalDuree** vaut 30. Lire le programme ligne par ligne s’appelle faire une **trace d’exécution**. Cette technique aide à comprendre ce qui se passe avant même d’utiliser un ordinateur.

## 3. Conditions et boucles : choisir et répéter

Une **condition** choisit une action selon une question vraie ou fausse. Une **boucle** répète une action de façon contrôlée. On utilise une boucle lorsque la même règle doit s’appliquer à plusieurs éléments : plusieurs activités, plusieurs valeurs ou plusieurs réponses.

    total ← 0
    POUR CHAQUE duree DANS listeDesDurees
      total ← total + duree
    FIN POUR
    SI total > objectif ALORS
      AFFICHER "Planning à alléger"
    SINON
      AFFICHER "Planning compatible avec l’objectif"
    FIN SI

Ce programme ne fait pas de jugement sur l’élève : il compare un total à un objectif défini. Le résultat dépend donc des valeurs de départ et de la règle choisie. Il faut vérifier que la liste contient des durées valides avant de faire le total.

| Structure | Quand l’utiliser | Erreur fréquente |
|---|---|---|
| Variable | Mémoriser une valeur qui évolue. | Oublier de l’initialiser. |
| Condition | Choisir entre des actions selon un critère. | Formuler un test flou ou inverser les branches. |
| Boucle | Répéter une règle sur une collection d’éléments. | Oublier de préciser quand la répétition s’arrête. |

## 4. Mise en situation — Un conseil de révision calculé

**Situation fictive.** Aïcha possède trois durées de révision : 20, 30 et 25 minutes. Son objectif personnel pour la séance est de 90 minutes. Elle veut un programme qui additionne les durées, puis affiche un conseil général selon que le total dépasse ou non l’objectif.

| Étape | Valeur ou règle |
|---|---|
| Entrée | La liste 20, 30, 25 et l’objectif 90. |
| Variable initiale | **total ← 0**. |
| Boucle | Ajouter chaque durée au total. |
| Trace | Après 20 : 20 ; après 30 : 50 ; après 25 : 75. |
| Condition | 75 n’est pas supérieur à 90 : afficher le conseil correspondant. |

> **Décision attendue :** le résultat annoncé doit être « Planning compatible avec l’objectif » dans cet exemple. Si le résultat est différent, on examine d’abord l’initialisation, l’addition dans la boucle et la condition.

## 5. Déboguer avec méthode

Un **bug** est un défaut dans un programme ou son comportement. Le débogage consiste à localiser puis corriger ce défaut. Une bonne méthode est de choisir de petites données de test, de noter la valeur des variables après chaque étape, de comparer le résultat attendu et de modifier une seule partie à la fois.

| Symptôme | Hypothèse à tester | Correction possible |
|---|---|---|
| Le total commence à une valeur inattendue. | La variable a-t-elle été initialisée ? | Écrire clairement **total ← 0** avant la boucle. |
| Une valeur de la liste est ignorée. | La boucle parcourt-elle tous les éléments ? | Vérifier la règle « POUR CHAQUE ». |
| Le message affiché est inversé. | La condition utilise-t-elle le bon comparateur ? | Relire les deux branches avec un exemple concret. |

> **Je sais faire si je peux :** suivre la valeur d’une variable ; expliquer pourquoi une boucle évite la répétition manuelle ; identifier l’entrée, le traitement et la sortie d’un programme ; tester une condition avec un exemple simple.

| Vocabulaire | Définition |
|---|---|
| Programme | Instructions écrites pour qu’un système réalise un traitement. |
| Variable | Nom qui référence une valeur pouvant changer. |
| Boucle | Structure qui répète des instructions de façon contrôlée. |
| Affectation | Action qui attribue ou remplace la valeur d’une variable. |
| Débogage | Démarche de recherche et correction d’un défaut. |`,
    scenarioRows: [
      ["Dans l’instruction total ← 0, quel est le rôle de l’instruction ?", ["Initialiser la variable total avant les additions", "Afficher le résultat final", "Créer une boucle infinie"], ["Initialiser la variable total avant les additions"], "L’initialisation donne une valeur de départ connue à la variable."],
      ["Pourquoi une boucle est-elle utile pour une liste de durées ?", ["Elle applique la même addition à chaque durée de la liste", "Elle remplace toutes les entrées par zéro", "Elle empêche tout affichage"], ["Elle applique la même addition à chaque durée de la liste"], "Une boucle évite d’écrire une instruction distincte pour chaque élément semblable."],
      ["Avec les durées 20, 30 et 25, quelle valeur finale obtient total après l’addition ?", ["75", "50", "90"], ["75"], "La trace donne 20, puis 50, puis 75."],
      ["Si l’objectif vaut 90 et que le total vaut 75, quelle branche est utilisée dans la condition SI total > objectif ?", ["La branche SINON", "La branche ALORS", "Aucune branche"], ["La branche SINON"], "75 n’est pas supérieur à 90 ; la condition est donc fausse."],
    ],
    methodRows: [
      ["Quelle est une sortie possible du programme de la leçon ?", ["Un message de conseil affiché", "La création d’un mot de passe", "La suppression de toutes les données"], ["Un message de conseil affiché"], "Une sortie est le résultat produit après le traitement des entrées."],
      ["Quel symptôme peut indiquer que total n’a pas été initialisé ?", ["Le total commence avec une valeur inattendue", "La condition contient un mot", "La liste possède trois éléments"], ["Le total commence avec une valeur inattendue"], "L’initialisation explicite rend le calcul lisible et vérifiable."],
      ["Quelle méthode de débogage est la plus rigoureuse ?", ["Tester de petites valeurs et suivre les variables étape par étape", "Modifier toutes les lignes simultanément", "Ignorer les résultats inattendus"], ["Tester de petites valeurs et suivre les variables étape par étape"], "La trace d’exécution aide à localiser la première étape qui s’écarte du résultat attendu."],
      ["Que signifie l’instruction total ← total + duree ?", ["Remplacer total par la somme de son ancienne valeur et de duree", "Déclarer que total est toujours égal à duree", "Effacer duree"], ["Remplacer total par la somme de son ancienne valeur et de duree"], "L’affectation met à jour une variable ; elle ne se lit pas comme une égalité mathématique classique."],
    ],
    quizRows: [
      ["Qu’est-ce qu’une variable ?", "Une variable associe un nom à une valeur qui peut être mise à jour.", [["Un nom associé à une valeur", true], ["Une image uniquement", false], ["Un virus informatique", false]]],
      ["Quelle structure répète une action sur plusieurs éléments ?", "Une boucle applique une règle de manière contrôlée à une collection d’éléments.", [["Une boucle", true], ["Une sortie", false], ["Une unité", false]]],
      ["Pourquoi fait-on une trace d’exécution ?", "Elle permet de suivre les valeurs étape par étape et de vérifier la logique.", [["Pour comprendre l’évolution des variables", true], ["Pour cacher les résultats", false], ["Pour éviter de tester", false]]],
      ["Quel est le but du débogage ?", "Le débogage cherche et corrige un défaut du programme de manière méthodique.", [["Identifier puis corriger une erreur", true], ["Ajouter des données au hasard", false], ["Remplacer l’algorithme par un logo", false]]],
    ],
  },
];

const exerciseSql = (id, rows) => `insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values\n${rows.map(([prompt, options, correct, explanation], index) => `(${id},'single_choice',${sqlText(prompt)},${jsonArray(options)},${jsonArray(correct)},${sqlText(explanation)},${(index + 1) * 10})`).join(",\n")};`;
const quizSql = (id, title, description, rows, displayOrder) => {
  const questions = rows.map(([question, explanation], index) => `(${id},${sqlText(question)},${sqlText(explanation)},'single_choice',${(index + 1) * 10},1,true)`).join(",\n");
  const answers = rows.flatMap(([, , choices], index) => choices.map(([answer, correct], optionIndex) => `(${(index + 1) * 10},${sqlText(answer)},${correct},${(optionIndex + 1) * 10})`)).join(",\n");
  return `insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active,is_test_data) values (target.subject_id,target.level_id,target.series_id,target.offering_id,target_chapter_id,target_lesson_id,${sqlText(title)},${sqlText(description)},'medium',12,${displayOrder},false,false,false) returning id into ${id}; with inserted_questions as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values ${questions} returning id,display_order) insert into public.quiz_answers (question_id,answer,is_correct,display_order) select iq.id,v.answer,v.is_correct,v.display_order from inserted_questions iq join (values ${answers}) as v(question_order,answer,is_correct,display_order) on v.question_order=iq.display_order;`;
};
const lessonSql = (lesson, index) => {
  const order = (index + 1) * 10; const base = (index + 1) * 100;
  const scenario = `scenario_exercise_${index + 1}_id`; const consolidation = `consolidation_exercise_${index + 1}_id`; const knowledge = `knowledge_quiz_${index + 1}_id`; const practice = `practice_quiz_${index + 1}_id`;
  return `
insert into public.lessons (chapter_id,title,description,content,display_order,is_test_data,is_active) values (target_chapter_id,${sqlText(lesson.title)},${sqlText(lesson.description)},${sqlText(lesson.content)},${order},false,false) returning id into target_lesson_id;
insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order,is_test_data) values (target.subject_id,target.level_id,target.series_id,target_chapter_id,target_lesson_id,${sqlText(`Mise en situation ${index + 1} — ${lesson.title}`)},${sqlText("Résous des situations fictives en identifiant les données, la règle ou le comportement attendu. Lis chaque correction pour comprendre le raisonnement.")},${sqlText("Les corrections explicitent la démarche : comprendre le problème, appliquer une règle précise puis vérifier le résultat.")},'single_choice','medium',${sqlText("Ne devine pas : appuie-toi sur les notions de la leçon et vérifie chaque terme employé.")},${sqlText("Après chaque réponse, reformule la règle en une phrase claire.")},false,false,20,${base + 10},false) returning id into ${scenario};
${exerciseSql(scenario, lesson.scenarioRows)}
insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order,is_test_data) values (target.subject_id,target.level_id,target.series_id,target_chapter_id,target_lesson_id,${sqlText(`Exercice de consolidation ${index + 1} — ${lesson.title}`)},${sqlText("Mobilise le vocabulaire et applique la méthode étudiée, sans dépendre d’un langage de programmation précis.")},${sqlText("Les corrections donnent la justification de chaque réponse et montrent la différence entre une règle précise et une hypothèse non vérifiée.")},'single_choice','medium',${sqlText("Lis les choix, élimine ceux qui ne respectent pas la définition, puis sélectionne l’action ou la notion adéquate.")},${sqlText("Compare ta réponse avec la définition et l’exemple de la leçon.")},false,false,20,${base + 20},false) returning id into ${consolidation};
${exerciseSql(consolidation, lesson.methodRows)}
${quizSql(knowledge, `Quiz ${index + 1}A — Notions fondamentales`, `Vérifie les notions essentielles de la leçon « ${lesson.title} ».`, lesson.quizRows, base + 10)}
${quizSql(practice, `Quiz ${index + 1}B — Appliquer la méthode`, `Vérifie l’application des repères de la leçon « ${lesson.title} ».`, lesson.scenarioRows.map(([question, options, correct, explanation]) => [question, explanation, options.map((option) => [option, correct.includes(option)])]), base + 20)}
`;
};

const migration = `-- Informatique / TICE Terminale : bases fondamentales de l’informatique.
-- Parcours complémentaire non officiel ; chaque ressource créée reste brouillon, inactive et non publiée.
do $computer_science_terminal_core_foundations$
declare
  target record; target_chapter_id uuid; target_lesson_id uuid; chapter_order integer; offering_count integer;
  scenario_exercise_1_id uuid; consolidation_exercise_1_id uuid; knowledge_quiz_1_id uuid; practice_quiz_1_id uuid;
  scenario_exercise_2_id uuid; consolidation_exercise_2_id uuid; knowledge_quiz_2_id uuid; practice_quiz_2_id uuid;
  scenario_exercise_3_id uuid; consolidation_exercise_3_id uuid; knowledge_quiz_3_id uuid; practice_quiz_3_id uuid;
begin
  select count(*) into offering_count from public.course_subject_offerings where id in (${offerings.map(sqlText).join(",")}) and is_test_data=false;
  if offering_count<>4 then raise exception 'Les quatre offres Informatique / TICE Terminale officielles sont requises.'; end if;
  if exists (select 1 from public.chapters c where c.subject_offering_id in (${offerings.map(sqlText).join(",")}) and c.title=${sqlText(chapterTitle)}) then raise exception 'Le chapitre Bases de l’informatique existe déjà : duplication ou écrasement interdit.'; end if;
  if exists (select 1 from public.lessons l join public.chapters c on c.id=l.chapter_id where c.subject_offering_id in (${offerings.map(sqlText).join(",")}) and l.title in (${lessons.map((lesson) => sqlText(lesson.title)).join(",")})) then raise exception 'Une leçon de bases informatiques existe déjà : duplication ou écrasement interdit.'; end if;
  for target in select o.id as offering_id,o.subject_id,o.level_id,o.series_id,se.name as series_name from public.course_subject_offerings o join public.series se on se.id=o.series_id where o.id in (${offerings.map(sqlText).join(",")}) and o.is_test_data=false order by se.name loop
    select coalesce(max(c.display_order),0)+10 into chapter_order from public.chapters c where c.subject_offering_id=target.offering_id;
    insert into public.chapters (subject_id,level_id,series_id,subject_offering_id,title,description,display_order,is_test_data,is_active) values (target.subject_id,target.level_id,target.series_id,target.offering_id,${sqlText(chapterTitle)},'Parcours complémentaire non officiel : algorithmique, données et premiers programmes.',chapter_order,false,false) returning id into target_chapter_id;
${lessons.map(lessonSql).join("\n")}
  end loop;
end $computer_science_terminal_core_foundations$;
`;
writeFileSync(migrationPath, migration, "utf8");
writeFileSync(payloadPath, `${JSON.stringify({ project_id: "nnshioowwniursnozicg", name: "computer_science_terminal_core_foundations_drafts", query: migration }, null, 2)}\n`, "utf8");
console.log(migrationPath); console.log(payloadPath);
