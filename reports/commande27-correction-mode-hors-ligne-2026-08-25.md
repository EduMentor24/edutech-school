# Commande 27 — Correction du mode hors ligne réel

**Date :** 25 août 2026  
**Périmètre respecté :** stratégie de cache et de synchronisation locale des Cours et du Bulletin uniquement. Aucune donnée pédagogique, donnée Supabase, RLS, RPC, authentification Supabase, backend, Mentor IA, notification, configuration EAS ou APK n’a été modifiée.

## 🟢 Corrections réalisées

| Domaine                   | Correction                                                                                                                                                                                                                                                                                                               | Fichiers principaux                                                                                                                                                         |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Préchargement pédagogique | Un préchargement non bloquant est déclenché après authentification en ligne pour le seul profil élève connecté. Il télécharge et persiste la matière, les chapitres, les leçons, les contenus complets, les séances, les catalogues et détails d’exercices, les catalogues et détails de quiz, ainsi que la progression. | [`pedagogical-preload-context.tsx`](../lib/offline/pedagogical-preload-context.tsx)                                                                                         |
| Isolation des données     | Les clés restent scindées par identifiant utilisateur, niveau, série et rôle. Aucun contenu d’un autre profil scolaire n’est préchargé.                                                                                                                                                                                  | [`pedagogical-cache.ts`](../lib/offline/pedagogical-cache.ts)                                                                                                               |
| Cours cache-first         | Une ressource locale est retournée immédiatement ; l’actualisation distante est non bloquante et un échec réseau conserve la version locale. Les clés lues par les écrans matière, chapitre et leçon sont toutes préchargées.                                                                                            | [`course-service.ts`](../lib/courses/course-service.ts), [`lesson-session-service.ts`](../lib/courses/lesson-session-service.ts)                                            |
| Exercices et quiz         | Les catalogues globaux et les détails complets utilisés par les écrans sont préchargés. Le lecteur de leçon filtre localement le catalogue global déjà synchronisé.                                                                                                                                                      | [`exercise-service.ts`](../lib/exercises/exercise-service.ts), [`quiz-service.ts`](../lib/quizzes/quiz-service.ts), [`[lessonId].tsx`](../app/course/lesson/[lessonId].tsx) |
| Progression               | La progression est désormais lue d’abord dans AsyncStorage lorsqu’elle existe, puis actualisée en arrière-plan. Les vues, complétions et favoris hors ligne actualisent également le cache local et leur file de synchronisation.                                                                                        | [`learning-progress-service.ts`](../lib/progress/learning-progress-service.ts)                                                                                              |
| Bulletin                  | L’identifiant de la clé locale est désormais lu depuis `supabase.auth.getSession()`, qui exploite la session persistée, plutôt que `auth.getUser()`. Les snapshots, calculs locaux, modifications de notes et files existantes sont ainsi accessibles hors réseau après initialisation en ligne.                         | [`bulletin-service.ts`](../lib/bulletin/bulletin-service.ts), [`bulletin-offline-store.ts`](../lib/bulletin/bulletin-offline-store.ts)                                      |

Le fournisseur de préchargement est installé au niveau racine, après l’authentification. Il limite les téléchargements à trois tâches simultanées, évite de bloquer la navigation et mémorise un statut de préchargement terminé. Lors d’un retour en ligne, les mécanismes de synchronisation existants sont conservés ; ils rejouent les opérations locales, utilisent les clés d’idempotence existantes et signalent les conflits sans écraser les modifications locales.

## 🟢 Fonctionnalités hors ligne validées par code et tests

| Scénario                   | Résultat attendu après une synchronisation initiale en ligne                                                                                              |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Session et profil          | La session persistée et le profil local restent disponibles après fermeture et réouverture.                                                               |
| Matière → Chapitre → Leçon | Les relations, métadonnées, contenu de leçon et séances sont lus depuis AsyncStorage.                                                                     |
| Exercices et quiz          | Les catalogues et détails déjà synchronisés sont consultables et une tentative locale est conservée dans la file existante.                               |
| Progression                | La lecture privilégie le tableau de progression local ; les actions hors ligne mettent à jour ce cache et restent en attente de synchronisation.          |
| Bulletin                   | Le snapshot local contient matières, coefficients, notes et données de calcul ; les moyennes sont recalculées localement.                                 |
| Notes Bulletin             | Ajout, modification et suppression restent stockés localement avec une file durable et sont rapprochés au retour réseau.                                  |
| Retour Internet            | La synchronisation Bulletin conserve la détection des versions distantes et passe les conflits dans l’état `conflict` au lieu d’écraser la donnée locale. |

## 🟡 Limitations restantes

Le préchargement doit atteindre son statut terminé au moins une fois avec Internet. Si le mode avion est activé avant sa fin ou avant la première initialisation du Bulletin, seules les ressources déjà enregistrées localement peuvent être affichées ; les données jamais synchronisées ne sont pas inventées.

Les détails d’exercices et de quiz publiés au client ne contiennent pas les réponses correctes ni les corrections serveur. Une tentative hors ligne est donc durablement enregistrée et synchronisée au retour réseau, mais son score/correction officiel n’est pas calculé localement. Cette limite préserve les règles actuelles de sécurité et ne peut être levée sans modifier les contrats RPC, ce qui est hors périmètre.

Le Mentor IA reste volontairement dépendant d’Internet. Sa garde réseau n’a pas été modifiée et ne bloque pas les parcours locaux.

## 🔴 Problèmes éventuels

Aucun problème bloquant n’a été trouvé dans TypeScript, le lint, le bundle Android Expo ou les tests automatisés. La vérification tactile réelle — mode avion, fermeture forcée, redémarrage du téléphone et retour Internet — reste à exécuter sur l’appareil Android, car elle ne peut pas être simulée de manière fiable dans le sandbox.

## 📊 Résultats des tests

| Contrôle                |                      Avant |                                                                                                     Après |
| ----------------------- | -------------------------: | --------------------------------------------------------------------------------------------------------: |
| Tests automatisés       |      398 réussis, 1 ignoré |                                                **402 réussis, 1 ignoré** ; 105 fichiers réussis, 1 ignoré |
| Tests hors ligne ciblés | Cache générique uniquement | 7 tests ciblés réussis ; cache-first, actualisation protégée, isolation de clé et session Bulletin locale |
| TypeScript              |                   Conforme |                                                                                                  Conforme |
| Lint                    |                   Conforme |                                                                                                  Conforme |
| Export Android Expo     |         Antérieur conforme |                                                               Conforme ; bundle Hermes Android de 6,45 Mo |
| Nouvelle APK            |                          — |                                                                                           **Non générée** |

## 📱 Résultat attendu sur un appareil Android réel

Après connexion et fin du préchargement avec Internet, l’élève peut activer le mode avion, fermer puis rouvrir l’application et consulter Cours → Matière → Chapitre → Leçon, ainsi que les exercices, quiz, progression et Bulletin déjà synchronisés. Les nouvelles notes et tentatives sont conservées localement. Lorsque le réseau revient, les files existantes sont synchronisées sans doublon grâce à leurs identifiants d’opération ; un conflit de version demeure visible pour arbitrage au lieu d’être perdu.
