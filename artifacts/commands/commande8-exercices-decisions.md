# Décisions d’architecture — Commande 8, Exercices

## Périmètre et principe de non-invention

La commande crée l’infrastructure complète du module Exercices, mais **aucun exercice pédagogique permanent n’est importé**. Toutes les tables candidates auditées sont vides. Les programmes, profils, associations, chapitres, leçons, favoris et progression des leçons sont conservés sans modification.

> Un exercice ne participe jamais au calcul de complétion d’une leçon. Les tentatives sont un suivi indépendant, réservé au module Exercices.

## Tables retenues et évolution

| Élément | Décision | Justification |
|---|---|---|
| `public.exercises` | **Réutilisée et étendue** | Elle possède déjà les clés `subject_id`, `level_id`, `series_id`, le titre, l’énoncé et la solution. Les nouvelles colonnes ajoutent le rattachement précis à `chapter_id` et `lesson_id`, le workflow et les métadonnées demandées. |
| `public.exercise_questions` | **Créée** | Aucune table existante ne lie des questions structurées à un exercice. Les tables Quiz existantes sont liées aux Quiz, pas aux Exercices. |
| `public.exercise_attempts` | **Créée** | `exercise_submissions` conserve seulement une réponse isolée et ne modélise pas une tentative complète, ses multiples réponses, ses dates, son score et ses résultats. |
| `public.exercise_submissions` | **Préservée, non réutilisée** | Table vide, conservée intacte pour éviter toute rupture historique. Elle n’est pas une tentative au sens fonctionnel demandé. |
| Tables `quiz_*` et `edutech_quiz_*` | **Préservées, non utilisées** | Elles constituent un domaine Quiz distinct, vide et non lié aux exercices. |

## Hiérarchie et intégrité

Un exercice est obligatoirement lié à une leçon, elle-même liée au chapitre, à la matière, au niveau et à la série. Les colonnes de rattachement stockées dans `exercises` facilitent les filtres mobiles, mais une fonction de contrôle valide que ces références correspondent bien à la même chaîne pédagogique avant toute écriture administrateur.

| Niveau du modèle | Clé ou relation |
|---|---|
| Offre scolaire | `level_id`, `series_id`, `subject_id` |
| Contenu pédagogique | `chapter_id`, `lesson_id` |
| Exercice | `exercises.id` |
| Question | `exercise_questions.exercise_id` |
| Tentative élève | `exercise_attempts.exercise_id` + `user_id` |

## Workflow et types

Les statuts sont représentés par deux propriétés complémentaires : `is_published` et `is_active`. Tout nouvel exercice est enregistré avec les deux valeurs à `false`. Un élève ne peut accéder qu’aux exercices à la fois publiés et actifs, et dont toute la chaîne pédagogique est accessible avec son profil.

Les types préparés sont `single_choice`, `multiple_choice`, `true_false`, `short_answer` et `free_response`. Les trois premiers peuvent être corrigés automatiquement. Les réponses courtes et libres ne prétendent pas à une correction automatique : le résultat les indique comme **correction à consulter**.

## Correction et confidentialité

Les réponses correctes et la correction détaillée ne sont jamais récupérées directement par les requêtes élèves avant une soumission. Les écrans élèves utilisent des fonctions Supabase sécurisées qui projettent seulement les colonnes sûres. Après soumission, une fonction serveur calcule les types admissibles, stocke le résultat de la tentative et renvoie la correction disponible.

Les questions utilisent des options et réponses correctes au format JSON. Les réponses d’une tentative sont stockées dans un objet JSON indexé par identifiant de question. Cette représentation supporte les types actuels et de futurs types sans devoir modifier le schéma.

## Tentatives et résultats

Une nouvelle tentative est créée pour chaque démarrage ; aucune tentative précédente n’est écrasée. Une tentative en cours conserve ses réponses uniquement au moment de la soumission dans cette première version. Le score, le nombre de bonnes et mauvaises réponses, le total de questions, le pourcentage, la date de début, la date de soumission et la durée sont conservés lorsque pertinents.

## RLS et fonctions

Les écritures de contenu et de questions sont réservées au rôle `is_edutech_admin()`. Les élèves n’accèdent ni aux brouillons, ni aux corrections brutes, ni aux résultats d’autrui. Les fonctions cataloguent les exercices selon `profiles.school_level` et `profiles.series`, vérifient l’accessibilité à chaque démarrage ou soumission, et ont un `search_path` fixe. Le rôle `anon` ne reçoit aucun droit d’exécution.

## Représentation mobile

Les écrans élèves seront limités aux données réellement retournées par le catalogue : les filtres Matière, Chapitre, Leçon et Difficulté n’apparaissent que lorsqu’au moins une valeur est disponible. Si aucun exercice publié et actif n’est accessible, l’état explicite est « Aucun exercice disponible pour le moment. »

L’administration fournit une sélection progressive Offre → Chapitre → Leçon, l’édition de métadonnées, des questions, la correction et une prévisualisation mobile. Elle ne publie pas automatiquement un exercice.
