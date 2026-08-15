# Décisions d’architecture — Commande 9, module Quiz

## Principes

Le module Quiz reste **distinct** du module Exercices. Il réutilise seulement la hiérarchie scolaire existante et les conventions de sécurité : niveau, série, matière, chapitre, leçon, publication, activation, rôle administrateur et RLS. Une tentative de quiz n’écrit jamais dans `user_progress` et ne marque jamais une leçon comme terminée.

Les tables existantes `quizzes`, `quiz_questions`, `quiz_answers` et `quiz_attempts` sont étendues ; aucune table de catalogue parallèle n’est créée. Elles sont vides au début de la commande.

## Représentation

| Élément demandé | Représentation retenue |
|---|---|
| Rattachement pédagogique | `quizzes.level_id`, `series_id`, `subject_id`, `chapter_id`, `lesson_id` avec contrôle de cohérence administrateur. |
| Brouillon / publication / activation | `is_published` et `is_active`, tous deux initialisés à `false`. |
| Questions | `quiz_questions` avec Markdown, type, ordre, points, difficulté, explication et activité. |
| Réponses proposées | `quiz_answers` avec ordre, contenu et bonne réponse ; plusieurs réponses correctes sont admises. |
| Réponses de l’élève | JSONB `answers` dans `quiz_attempts`, indexé par identifiant de question. |
| Conservation d’une tentative | `question_snapshot` et `correction_snapshot` sont enregistrés au démarrage pour que l’historique reste cohérent si un administrateur modifie le quiz plus tard. |
| Chronomètre | `duration_minutes` facultatif ; la date limite est calculée à partir de `started_at`. Sans durée, aucune minuterie n’est affichée. |

## Correction et résultat

Les types `single_choice`, `multiple_choice` et `true_false` sont corrigés côté serveur. Une question `short_answer` est stockée mais bascule la tentative en `review_required` : aucun score automatique n’est prétendu pour une réponse libre. Les points sont additionnés uniquement pour les questions automatiquement corrigeables ; le pourcentage est calculé sur le total de points automatiquement corrigeables.

La fonction de résultat ne retourne les réponses correctes, les explications et le statut correct/incorrect que lorsqu’une tentative personnelle est soumise. Avant soumission, le client ne reçoit ni correction ni solution.

## Disponibilité et RLS

Un élève ne peut consulter un quiz que si le quiz est publié et actif, que sa matière et son rattachement sont actifs, et que les identifiants niveau/série correspondent au profil réel. Les tables de quiz, questions et réponses ne disposent pas de lecture directe générale pour les élèves. Les lectures passent par des fonctions `SECURITY DEFINER` qui appliquent cette règle avant tout retour de données.

Les tentatives sont strictement propriétaires. L’administrateur conserve l’accès de gestion et aux agrégats anonymisés nécessaires à la synthèse administrative. Le rôle `anon` ne reçoit aucun privilège sur les fonctions du module.

## Parcours mobile

Le catalogue charge les cartes et filtres dans une lecture groupée. Le détail charge les questions du seul quiz ouvert. L’écran de tentative affiche une question à la fois avec navigation précédent/suivant, une confirmation de fin et, lorsque définie, une minuterie locale soumettant les réponses en cours à l’échéance. Le résultat applique des messages de feedback simples fondés sur le pourcentage et affiche le corrigé uniquement après soumission.

## Administration

L’éditeur suit l’ordre : rattachement → métadonnées → questions → réponses correctes → prévisualisation → brouillon → publication/activation. La prévisualisation réutilise le rendu mobile mais ne crée aucune tentative ni écriture élève. La suppression d’un quiz comportant des tentatives est refusée pour protéger l’historique réel ; une désactivation reste disponible.
