# Commande 21 — Validation de build Android

## Périmètre et état de référence

Le fichier `pasted_content_6.txt` a été lu intégralement. La validation porte exclusivement sur l’état courant d’EduTech School, avec **Terminale A1, A2, C et D** comme périmètre élève actif. La structure Première doit rester préservée et suspendue. Aucune donnée, règle métier, politique RLS, RPC, coefficient, synchronisation ou contenu pédagogique n’a été modifié au cours de cette phase initiale.

## Configuration Android effective

La configuration Expo effective déclare **EduTech School**, version applicative **1.0.0**, package Android `com.app.edutechschool`, orientation portrait, SDK Expo 54 et un `minSdkVersion` Android de 24. Aucun `versionCode` explicite n’est défini dans la configuration effective ; il ne peut donc pas être certifié comme valeur d’une APK native sans une build native gérée.

## Connectivité Supabase et audit de données

Le connecteur Supabase pointe vers le projet actif **EduMentor** (`nnshioowwniursnozicg`). Le schéma public a été consulté en lecture seule et les relations principales pour niveaux, séries, offres, chapitres, leçons, exercices, quiz, questions, réponses, bulletins, coefficients, progression et notifications ont été identifiées.

Une requête agrégée destinée à contrôler les volumes Terminale a rencontré un délai d’attente du connecteur avant son exécution. Cette partie reste donc **non validée à distance** à ce stade. Aucune tentative de modification ni de contournement n’a été effectuée.

## Limites intrinsèques de l’environnement

La publication native, la génération d’une APK installable et son installation sur téléphone ne sont pas exécutées dans le sandbox. La validation locale pourra confirmer TypeScript, lint, tests, cohérence statique et export Android ; les gestes réels sur appareil (installation, navigation tactile, mode avion, fermeture/réouverture, clavier et retour Android) devront être confirmés sur un appareil physique.

## Validations locales réussies

Les contrôles `pnpm check`, `pnpm lint`, la suite Vitest séquentielle et `git diff --check` sont réussis. La suite compte **101 fichiers de tests réussis**, **395 tests réussis** et **1 test ignoré**. Les tests couvrent notamment le cache pédagogique local-first, la progression, les tentatives Quiz/Exercices, le Bulletin, le profil, la session, les routes protégées, le Mentor IA, les contenus Terminale et la suspension de Première.

L’export Android local est réussi. Il produit un bundle Hermes Android de **6 439 349 octets** et un répertoire exporté de **6,7 Mo**. Cet artefact est un export de validation, pas une APK signée et installable.

## Audit statique des actions et routes

Le contrôle statique ne détecte aucun gestionnaire `onPress` vide dans les écrans, composants et bibliothèques inspectés. Les quatre routes de création d’administration initialement signalées (`/administration/citations/new`, `/administration/exercises/new`, `/administration/quizzes/new`, `/administration/subjects/new`) sont des routes dynamiques valides : le segment `new` est reçu par les éditeurs `[id]` correspondants et active leur mode création. Elles ne constituent donc pas une référence cassée.

## Anomalies de données à qualifier avant correction

L’audit relationnel Terminale ne trouve aucune relation cassée sur les offres, chapitres, exercices, quiz, questions et réponses actifs. Il détecte néanmoins deux signaux qui nécessitent une qualification avant toute action destructive :

| Signal | Volume | Périmètre constaté | Décision provisoire |
|---|---:|---|---|
| Leçons actives avec champ `lessons.content` vide | 12 | Trois leçons de méthodologie Français dans chacune des séries A1, A2, C et D | Vérifier d’abord si le contenu est porté par des séances, conformément à l’architecture Français ; aucune désactivation ni création de contenu n’est justifiée avant cette vérification. |
| Titres de Quiz actifs dupliqués par leçon | 12 groupes de deux | Trois leçons Informatique / TICE dans chacune des séries A1, A2, C et D | Vérifier les rattachements, versions, questions et dates avant toute correction ; aucun quiz n’est supprimé ni modifié à ce stade. |

Les autres contrôles relationnels sont nuls : chapitres actifs sans offre publiée, exercices ou quiz sans leçon, liens de leçon brisés, évaluations sans questions, questions de quiz sans réponse, questions automatiques sans bonne réponse, doublons de titres de leçons et doublons de titres d’exercices.

La structure contient une table `lesson_sessions` reliée à `lessons` et dotée de ses propres champs de contenu, d’activation et de données de test. La vérification conclut toutefois que les 12 leçons Français signalées n’ont **aucune séance active**, ni contenu principal. Elles restent actives et portent des exercices et quiz actifs : par série, 10 évaluations pour la dissertation, 6 pour le commentaire composé et 12 pour le résumé argumentatif. C’est une anomalie réelle de contenu/visibilité ; aucune donnée fictive ne sera créée pour la masquer.

Les 24 quiz concernés par les 12 groupes de doublons Informatique / TICE portent les mêmes intitulés, descriptions, dates et nombres de questions actives, avec seulement des ordres d’affichage distincts. La comparaison détaillée des questions, réponses et tentatives reste requise avant de pouvoir désactiver, sans suppression, les éventuels clones stricts.

La comparaison confirme que chaque paire est un **clone strict** sur ses quatre questions et réponses et qu’aucune tentative n’est associée aux 24 quiz. Une correction réversible a été préparée pour désactiver les douze secondes copies (ordres 520, 620 et 720), tout en conservant les données et les douze premières copies. Son application est temporairement bloquée par des délais d’attente du connecteur Supabase ; aucun changement distant n’a été réalisé.

Les journaux locaux font apparaître un unique `Premature close` Metro, immédiatement suivi d’un redémarrage et de compilations web réussies. Ce signal concerne la prévisualisation de développement ; il ne constitue pas une erreur du bundle Android exporté, qui a été généré avec succès.

## Session et mode hors ligne

La configuration Supabase native utilise `expo-secure-store` comme stockage de session, avec `persistSession` et `autoRefreshToken` activés hors web. Le code prévoit donc la conservation de la session après fermeture et réouverture, sous réserve de validité du jeton.

Le parcours pédagogique utilise un cache local-first par utilisateur dans AsyncStorage ; les services Cours, Quiz et Exercices passent par ce cache. Les tentatives Quiz et Exercices ont une branche locale qui est enregistrée et soumise ultérieurement par la file de synchronisation. Le Mentor IA conserve volontairement sa dépendance au réseau. Ces comportements sont couverts par les tests locaux de cache, mode hors ligne et synchronisation, mais le scénario complet mode avion, fermeture, redémarrage du téléphone et retour réseau reste à valider sur appareil réel.

## Décision de correction des deux anomalies

La seule table historique de contenu identifiée (`ai_generated_contents`) ne référence pas de leçon ni de séance : elle ne permet donc pas de restaurer avec certitude les douze cours Français manquants. Pour ne créer aucun contenu fictif et ne pas laisser des pages de cours vides visibles, la correction sûre consiste à retirer temporairement de la visibilité les douze leçons concernées, ainsi que leurs exercices et quiz associés, **sans suppression**. Leur structure et leurs données restent préservées pour une restauration ultérieure à partir de contenus source réels.

Les douze clones stricts de Quiz Informatique seront également retirés de la visibilité sans suppression, en conservant la première copie complète et sans tentative de chaque paire.

La correction a désactivé et dépublié **12 leçons Français**, **112 exercices associés** et **112 quiz associés**, sans aucune suppression. Elle a aussi désactivé et dépublié **12 clones Quiz Informatique**. Un dernier clone de la série D, dont les ordres d’affichage étaient inversés, a été traité par une garde spécifique après vérification de son absence de tentative.

L’audit final retourne **zéro** pour chaque contrôle : leçons actives vides, chapitres actifs sans offre publiée, exercices ou quiz sans leçon, liens brisés, évaluations sans questions, questions sans réponses, questions automatiques sans bonne réponse et doublons de titres actifs. Les contenus retirés restent en base et peuvent être réactivés lorsque les cours Français sources auront été fournis ou restaurés de façon vérifiable.

## Validation finale après correction

La configuration définit explicitement `version: "1.0.0"`, le package Android `com.app.edutechschool` et `versionCode: 1`. Un test de régression protège ces métadonnées. Les contrôles finaux réussissent : TypeScript, lint, **102 fichiers de tests réussis**, **396 tests réussis**, **1 test ignoré**, intégrité du diff et nouvel export Android. Le bundle Hermes Android final mesure **6 439 350 octets** et le répertoire exporté **6,7 Mo**.

La publication installable, l’installation d’une APK et les gestes tactiles réels restent hors de portée de cette validation sandbox. La build de production doit être déclenchée via le bouton **Publish** après le checkpoint ; l’installation sur un appareil Android et la validation des gestes listés dans la commande restent à confirmer sur appareil physique.
