# Progression proposée — Initiation à l’informatique en Terminale

## Statut pédagogique

Cette progression est un **parcours complémentaire d’initiation**, créé pour EduTech School à la demande de l’administrateur. Elle ne se présente pas comme le programme officiel de la Côte d’Ivoire, ne remplace aucun enseignement officiel et pourra être enrichie ou réordonnée après validation pédagogique.

## Principes de conception

La progression s’inspire de domaines largement reconnus de la culture numérique : maîtrise des informations et des données, communication et collaboration, création de contenu numérique, sécurité, résolution de problèmes, utilisation des appareils et logiciels [1]. Elle adopte également une approche centrée sur l’humain, l’esprit critique, l’éthique et l’usage responsable des technologies [2] [3]. Ces références sont des repères de conception ; elles ne transforment pas ce parcours en programme national.

| Étape | Chapitre proposé | Première leçon ou compétence | Finalité pour l’élève |
|---|---|---|---|
| 1 | **Fondations du numérique et citoyenneté responsable** | **Comprendre son environnement numérique, ses données et ses choix** | Identifier appareil, système, application, fichier, donnée et service en ligne ; adopter les premières habitudes de sécurité et d’esprit critique. |
| 2 | **Organiser, rechercher et communiquer** | Fichiers, dossiers, recherche d’information et collaboration | Organiser un travail scolaire, distinguer source et contenu, communiquer avec respect. |
| 3 | **Sécurité, identité et protection de l’information** | Mots de passe, confidentialité, hameçonnage et traces numériques | Réduire les risques courants sans donner de consigne technique dangereuse. |
| 4 | **Penser de manière algorithmique** | Instructions, décomposition, conditions et erreurs | Résoudre une tâche par étapes claires avant tout langage de programmation. |
| 5 | **Créer avec le code et les données** | Variables, données simples, automatisation et vérification | Découvrir comment un programme transforme des entrées en résultats. |
| 6 | **Technologies émergentes et usage responsable de l’IA** | Limites, vérification, confidentialité et rôle humain | Utiliser les outils numériques et l’IA avec discernement, sans confondre une réponse générée avec une vérité établie. |

## Premier lot retenu

Le premier lot commencera par la leçon **« Comprendre son environnement numérique, ses données et ses choix responsables »**. Elle est commune à A1, A2, C et D, car elle ne suppose ni équipement particulier ni prérequis de programmation. Elle donnera une base immédiatement utile pour les cours, les démarches administratives, la communication et la suite de la progression :

1. distinguer matériel, système d’exploitation, application et service en ligne ;
2. reconnaître qu’un fichier et une donnée doivent être organisés et protégés ;
3. identifier une information sensible et appliquer des gestes simples de prudence ;
4. examiner la fiabilité d’un contenu avant de le partager ;
5. comprendre qu’une technologie, y compris l’IA, assiste une décision humaine mais ne la remplace pas ;
6. décomposer une tâche courante en consignes précises, première étape vers la pensée algorithmique.

Les futurs cours éviteront les procédures de contournement de sécurité, les manipulations de comptes ou les données personnelles réelles. Les exemples resteront scolaires, fictifs et explicitement présentés comme tels.

## Audit de rattachement — 23 août 2026

L’audit Supabase en lecture seule confirme que la matière active **« Informatique / TICE »** possède une offre Terminale officielle pour chacune des quatre séries, sans données de test : A1 (`0beafff1-63db-42c9-99a2-8ef6da799f19`), A2 (`7680fb4a-c9d4-41df-92f3-a91effda4944`), C (`7695b4cf-0524-4de4-af91-f8d79eed2b0a`) et D (`f9c030a4-8b30-4657-b7bb-d81e4e500635`). Aucun chapitre ni aucune leçon Informatique / TICE n’est actuellement rattaché à ces offres.

La création du premier lot doit donc ajouter, dans chacune des quatre offres, le chapitre commun **« Fondations du numérique et citoyenneté responsable »** en première position, puis la leçon commune **« Comprendre son environnement numérique, ses données et ses choix responsables »**. Les quatre leçons doivent être inactives ; les exercices et quiz associés doivent être inactifs et non publiés.

## Bilan d’intégration et validation — 23 août 2026

La migration atomique a été appliquée avec succès sur le projet officiel **EduMentor**. Elle a créé un chapitre et une leçon communs pour chacune des séries A1, A2, C et D, sans modifier de contenu existant. Chaque leçon contient **13 285 caractères** de contenu pédagogique original, explicitement identifié comme un parcours d’initiation complémentaire non officiel.

| Ressource créée | Par série | Total sur A1, A2, C et D | État contrôlé |
|---|---:|---:|---|
| Chapitres | 1 | 4 | Inactifs, non test. |
| Leçons | 1 | 4 | Inactives, non test. |
| Exercices corrigés | 2 | 8 | Inactifs et non publiés. |
| Questions d’exercice | 8 | 32 | Rattachées aux exercices concernés. |
| Quiz | 2 | 8 | Inactifs et non publiés. |
| Questions de quiz | 8 | 32 | Rattachées aux quiz concernés. |
| Réponses de quiz | 24 | 96 | Trois options par question, avec correction. |

L’audit post-migration ne relève **aucune anomalie de statut** : aucune leçon, aucun exercice et aucun quiz de ce lot n’est actif ou publié. Les tables de contenus et de questions concernées gardent la RLS activée. Les validations locales ont réussi : TypeScript, lint, **274 tests réussis et 1 ignoré**, puis export Android terminé avec `Exported: dist`.

## Chapitre suivant — Sécurité numérique interactive

Le chapitre complémentaire suivant portera le titre **« Sécurité numérique : protéger, vérifier et réagir »**. Il sera créé pour A1, A2, C et D dans le même statut brouillon que le premier chapitre. Les situations utiliseront des personnages et données fictifs ; elles n’expliqueront ni le contournement d’une sécurité, ni la fabrication d’un message frauduleux, ni une méthode d’intrusion.

| Leçon proposée | Compétence développée | Mise en situation pédagogique | Évaluation séparée |
|---|---|---|---|
| **1. Protéger ses comptes et ses appareils** | Choisir des réflexes de protection : phrase secrète longue et unique, deuxième vérification lorsque disponible, mises à jour obtenues depuis un canal fiable, verrouillage et sauvegarde. | Un camarade fictif demande un code de validation ; l’élève identifie le bon réflexe sans jamais communiquer de code réel. | Un exercice de décisions et un quiz. |
| **2. Reconnaître un message ou un lien suspect** | Observer l’expéditeur, l’adresse, la demande, l’urgence et la possibilité de vérifier par un canal habituel. | Une fausse alerte de remise de devoir pousse à cliquer ; l’élève choisit de s’arrêter, vérifier et signaler. | Un exercice de repérage et un quiz. |
| **3. Préserver sa vie privée et réagir à une situation difficile** | Limiter le partage d’informations personnelles, gérer une trace numérique et demander de l’aide face à un contenu ou comportement inquiétant. | Une photo privée fictive est repartagée ; l’élève protège les preuves, bloque ou signale selon le service et alerte un adulte ou l’établissement. | Un exercice de réaction responsable et un quiz. |

La conception reprend des recommandations de sensibilisation : mots de passe uniques et longs, mises à jour, authentification à plusieurs facteurs lorsqu’elle est disponible, prudence devant les liens inattendus et protection des informations personnelles [4] [5]. Pour une expérience en ligne pénible, la progression insiste sur la non-culpabilisation, la conservation prudente d’éléments utiles et le recours à un adulte de confiance ou à l’établissement [6] [7].

## Bilan d’intégration — Sécurité numérique interactive

La migration atomique a créé le chapitre **« Sécurité numérique : protéger, vérifier et réagir »** pour les quatre offres officielles A1, A2, C et D, sans toucher au premier chapitre Informatique. Les trois leçons sont strictement préventives : elles n’expliquent ni la fabrication d’une fraude, ni le contournement d’une protection, ni l’intrusion. Toutes les situations et données utilisées dans les cours sont fictives.

| Ressource créée | Par série | Total sur A1, A2, C et D | État contrôlé |
|---|---:|---:|---|
| Chapitres | 1 | 4 | Inactifs, non test. |
| Leçons interactives | 3 | 12 | Inactives, non test ; 7 464 à 8 381 caractères par leçon. |
| Exercices corrigés | 6 | 24 | Inactifs et non publiés. |
| Questions d’exercice | 24 | 96 | Mises en situation et consolidation, avec explications. |
| Quiz | 6 | 24 | Inactifs et non publiés. |
| Questions de quiz | 24 | 96 | Repères et décisions responsables. |
| Réponses de quiz | 72 | 288 | Trois options par question, avec correction. |

L’audit Supabase confirme que les douze leçons sont inactives, que tous les compteurs sont complets et qu’aucun chapitre, cours, exercice ou quiz de ce lot n’a été activé ou publié par erreur. La RLS reste active sur les tables concernées. TypeScript, lint, **279 tests réussis et 1 ignoré**, ainsi que l’export Android `Exported: dist`, ont réussi.

## Chapitre suivant — Bases de l’informatique

Le prochain chapitre complémentaire, **« Bases de l’informatique : raisonner, représenter et programmer »**, prépare les élèves qui souhaitent aller plus loin dans l’étude de l’informatique. Il reste non officiel et commun aux séries Terminale A1, A2, C et D. Les trois cours retenus suivent une progression :

| Leçon proposée | Compétence fondamentale | Mise en situation | Évaluation séparée |
|---|---|---|---|
| **1. Penser comme un informaticien : algorithmes et pseudo-code** | Décomposer un problème, définir entrées, traitement et résultat, ordonner des instructions, utiliser une condition et tester un cas simple. | Organiser automatiquement une liste de tâches scolaires fictives à partir de règles explicites. | Exercice de raisonnement, exercice de pseudo-code et deux quiz. |
| **2. Représenter et comprendre les données** | Distinguer donnée, type, unité, table, codage binaire élémentaire et qualité d’une donnée. | Construire un tableau fictif de résultats de révision et repérer une donnée manquante ou incohérente. | Exercice d’analyse, exercice de représentation et deux quiz. |
| **3. Premiers programmes : variables, conditions et boucles** | Comprendre une variable, une entrée, une sortie, une condition, une répétition et le débogage de base sans dépendre d’un langage précis. | Concevoir un petit programme fictif qui calcule une moyenne de révision et affiche un conseil adapté. | Exercice de lecture de programme, exercice de correction et deux quiz. |

Les domaines retenus constituent des repères largement utilisés dans l’éducation à l’informatique : algorithmes et conception, programmation, données et analyse, systèmes et sécurité, ainsi que les impacts sociaux de l’informatique [8]. Le cadre K–12 Computer Science souligne également la décomposition, l’abstraction, le test et l’amélioration progressive de solutions [9]. Ces sources guident le parcours mais ne le transforment pas en programme officiel national.

## Bilan d’intégration — Bases de l’informatique

La migration atomique a ajouté le chapitre **« Bases de l’informatique : raisonner, représenter et programmer »** dans les quatre offres Terminale A1, A2, C et D. Elle n’a modifié ni les chapitres précédents ni leurs ressources. Chaque cours est conçu sans dépendre d’un langage ou d’un logiciel particulier et utilise seulement des données scolaires fictives.

| Ressource créée | Par série | Total sur A1, A2, C et D | État contrôlé |
|---|---:|---:|---|
| Chapitres | 1 | 4 | Inactifs, non test. |
| Leçons fondamentales | 3 | 12 | Inactives, non test ; 5 411 à 5 581 caractères par leçon. |
| Exercices corrigés | 6 | 24 | Inactifs et non publiés. |
| Questions d’exercice | 24 | 96 | Raisonnement, données et débogage de base. |
| Quiz | 6 | 24 | Inactifs et non publiés. |
| Questions de quiz | 24 | 96 | Notions et application de méthode. |
| Réponses de quiz | 72 | 288 | Trois options par question, avec correction. |

L’audit Supabase confirme que les douze leçons et toutes leurs évaluations restent brouillons : aucune anomalie d’activation ou de publication n’est relevée. La RLS est active sur les tables concernées. TypeScript, lint, **283 tests réussis et 1 ignoré**, ainsi que l’export Android `Exported: dist`, sont validés.

## Chapitre suivant — Maîtriser son ordinateur

Le prochain chapitre complémentaire, **« Maîtriser son ordinateur : comprendre, utiliser et s’organiser »**, s’adresse à des débutants et reste commun aux séries Terminale A1, A2, C et D. Il ne promet pas de rendre un élève « professionnel » au sens d’une qualification ; il lui donne plutôt des bases pratiques, sûres et réutilisables pour utiliser un ordinateur avec autonomie progressive.

| Leçon proposée | Objectif concret | Mise en situation pédagogique |
|---|---|---|
| **1. Découvrir l’ordinateur : matériel, logiciels et système** | Identifier les composants et périphériques, distinguer matériel, logiciel, système d’exploitation, application, mémoire et stockage. | Choisir les éléments nécessaires pour préparer un poste de travail fictif. |
| **2. Se repérer dans le système et utiliser les applications** | Comprendre bureau, fenêtre, dossier, menu, barre d’outils, application, navigation au clavier et ouverture/fermeture correcte d’un travail. | Réaliser une tâche scolaire fictive en alternant navigateur, traitement de texte et dossier de travail. |
| **3. Organiser, enregistrer et retrouver ses fichiers** | Créer une arborescence simple, nommer un fichier, enregistrer, distinguer copie/déplacement, repérer un format et effectuer une sauvegarde raisonnable. | Retrouver et corriger l’organisation d’un dossier fictif d’exposé. |
| **4. Entretenir son poste et résoudre les problèmes simples** | Adopter les gestes fiables : mises à jour officielles, batterie et stockage, connexion, redémarrage raisonné, demande d’aide et limites de l’auto-dépannage. | Suivre une grille de décision devant un ordinateur lent ou une application qui ne répond plus. |

Le cadrage s’appuie sur une conception de la culture numérique qui comprend l’accès, la gestion, la compréhension, l’évaluation et la création d’information de manière sûre et appropriée [10]. La source souligne aussi qu’une maîtrise de base inclut l’usage confiant, sûr et efficace d’un ordinateur, des logiciels bureautiques, du navigateur et de la recherche [10]. Ces repères guident le parcours, sans le présenter comme un programme officiel national.

## Bilan d’intégration — Infobulles et maîtrise de l’ordinateur

Les **douze brouillons** du chapitre « Bases de l’informatique » ont reçu des infobulles pour les notions techniques essentielles, dont algorithme, pseudo-code, donnée, colonne, bit, variable, condition et boucle. Le lecteur affiche désormais un message générique « Vocabulaire interactif » : survol d’un terme sur le web ou appui sur mobile. L’accessibilité expose l’explication au lecteur d’écran ; le PDF conserve uniquement le terme visible, sans syntaxe technique.

| Ressource créée | Par série | Total sur A1, A2, C et D | État contrôlé |
|---|---:|---:|---|
| Chapitres | 1 | 4 | Inactifs, non test. |
| Leçons débutant | 4 | 16 | Inactives, non test ; 3 327 à 4 110 caractères par leçon. |
| Exercices corrigés | 8 | 32 | Inactifs et non publiés. |
| Questions d’exercice | 32 | 128 | Situations simples et explications associées. |
| Quiz | 8 | 32 | Inactifs et non publiés. |
| Questions de quiz | 32 | 128 | Repères de maîtrise de l’ordinateur. |
| Réponses de quiz | 96 | 384 | Trois options par question, avec correction. |

L’audit Supabase confirme les quatre séries, les annotations prévues, l’absence de doublon et **zéro anomalie de statut**. La RLS reste active sur toutes les tables concernées. TypeScript, lint, **288 tests réussis et 1 ignoré**, ainsi que l’export Android `Exported: dist`, sont validés.

## Références de conception

[1] [UNESCO-UNEVOC, *Digital Literacy Global Framework*](https://connect.unevoc.unesco.org/home/Digital+Competence+Frameworks/lang=en/id=5) — sept domaines, incluant information et données, communication, création, sécurité, résolution de problèmes et opérations appareils/logiciels.

[2] [UNESCO, *AI and technologies in education*](https://www.unesco.org/en/digital-education) — priorité donnée à l’action humaine, à l’esprit critique et à l’éthique dans les technologies éducatives.

[3] [UNESCO, *AI competency frameworks for students and teachers*](https://www.unesco.org/en/articles/what-you-need-know-about-unescos-new-ai-competency-frameworks-students-and-teachers) — approche centrée sur l’humain, éthique, fondements, applications et résolution de problèmes.

[4] [CISA, *Good Security Habits*](https://www.cisa.gov/news-events/news/good-security-habits) — repères généraux sur les phrases secrètes longues et uniques, les mises à jour et la prudence devant des courriels inattendus.

[5] [CISA, *Shields Up: Guidance for Families*](https://www.cisa.gov/shields-guidance-families) — authentification à plusieurs facteurs, mises à jour et vérification avant d’ouvrir un lien inattendu.

[6] [UNICEF, *Keeping children safe online*](https://www.unicef.org/protection/keeping-children-safe-online) — risques de violence entre pairs, de harcèlement et d’atteintes à la vie privée, ainsi que la nécessité de compétences de sécurité en ligne.

[7] [UNICEF, *How to keep your child safe online*](https://www.unicef.org/parenting/child-care/keep-your-child-safe-online) — prudence avant le partage, protection des informations personnelles et recours à un adulte de confiance en cas de malaise ou de peur.

[8] [CSTA, *PK–12 Computer Science Standards*](https://csteachers.org/pk12standards/) — définition de l’informatique et cinq concepts : algorithmes et conception, programmation, données et analyse, systèmes et sécurité, informatique et société.

[9] [K–12 Computer Science Framework, *Framework Statements by Concept*](https://k12cs.org/framework-statements-by-concept/) — décomposition de problèmes, abstraction, création, test et amélioration de productions informatiques.

[10] [UNESCO-UNEVOC, *Digital literacy*](https://connect.unevoc.unesco.org/home/TVETipedia+Glossary/show=term/term=Digital+literacy) — définitions de la culture numérique, incluant l’usage confiant, sûr et efficace de l’ordinateur, des logiciels, du navigateur et de la recherche.
