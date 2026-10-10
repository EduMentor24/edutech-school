# Rapport — Commande 17 : trois PDF de Philosophie

**Projet :** EduTech School / Supabase EduMentor (`nnshioowwniursnozicg`)  
**Périmètre :** Philosophie, Terminale A1 et A2, Compétence II — *Les conditions de la liberté*  
**Date de traitement :** 17 août 2026

## Méthode appliquée

Les trois PDF ont été lus intégralement avant toute écriture. Les six leçons cibles ont ensuite été contrôlées dans la hiérarchie réelle `Niveau → Série → Matière → Chapitre → Leçon`. Au départ, chacune était vide, inactive, sans exercice et sans quiz associé.

La création a été appliquée dans une opération transactionnelle. La migration refuse d’écraser une leçon non vide et empêche la création d’un exercice ou d’un quiz portant le même titre pour la même leçon. Aucun contenu existant n’a été modifié, y compris les leçons de commentaire de texte déjà validées.

## Ressources créées

| PDF source | Niveau / séries | Chapitre | Leçon et ID A1 | Leçon et ID A2 | Cours | Exercices | Quiz |
|---|---|---|---|---|---:|---:|---:|
| `PhiloTle_L3_Laconnaissancedelhomme.PDF` | Terminale A1/A2 | Compétence II | `Leçon 1 : La connaissance de l’homme` — `7a0fcff7-b4fc-4cda-aced-0c217220bf97` | `Leçon 1 : La connaissance de l’homme` — `0f5b8c0b-ab87-41f1-92aa-fadcb5e350d2` | 2 | 4 | 2 |
| `PhiloTle_L4_Lavieensociété.PDF` | Terminale A1/A2 | Compétence II | `Leçon 2 : La vie en société` — `08cb1a4b-5483-4d68-9678-5477e0a820f3` | `Leçon 2 : La vie en société` — `0e730715-0cd9-4540-bc23-aa23695e83b1` | 2 | 4 | 2 |
| `PhiloTle_L5_Dieuetlaréligion.PDF` | Terminale A1/A2 | Compétence II | `Leçon 3 : Dieu et la religion` — `ff2dfefc-fd76-408c-b7eb-11ee8d725ab7` | `Leçon 3 : Dieu et la religion` — `565da730-ed69-41bc-9283-47f57ee8a82a` | 2 | 4 | 2 |

Chaque cours est stocké dans `public.lessons.content`. Les exercices et leurs dix questions par leçon sont séparés dans `public.exercises` et `public.exercise_questions`. Les quiz et leurs sept questions par leçon sont séparés dans `public.quizzes`, `public.quiz_questions` et `public.quiz_answers`.

## Statuts vérifiés après création

| Ressource par leçon et par série | Quantité | Statut contrôlé |
|---|---:|---|
| Leçon avec contenu | 1 | `is_active = false` |
| Exercices | 2 | `is_active = false`, `is_published = false` |
| Questions d’exercice | 10 | Liées exclusivement aux deux exercices de la leçon |
| Quiz | 1 | `is_active = false`, `is_published = false` |
| Questions de quiz | 7 | Liées exclusivement au quiz de la leçon |

Ainsi, le lot complet comprend **6 contenus de cours**, **12 exercices**, **60 questions d’exercice**, **6 quiz** et **42 questions de quiz**. Aucun de ces éléments n’est actif ou publié ; il demeure donc invisible aux élèves tant qu’un administrateur ne l’active pas explicitement.

## Fidélité pédagogique

Les cours conservent les axes principaux de chacun des documents :

| Leçon | Axes issus du PDF et intégrés au cours |
|---|---|
| La connaissance de l’homme | Conscience psychologique et morale, mémoire, liberté, inconscient freudien, déterminisme psychologique et responsabilité. |
| La vie en société | Origine sociale de l’homme, rapport à autrui, État, nation, droit, justice et violence dans l’espace social. |
| Dieu et la religion | Dieu et le sacré, critique de l’existence de Dieu, cohésion sociale, moralisation, aliénation et rapport entre devoir moral et liberté. |

Les activités évaluatives sont séparées du cours et reprennent uniquement des connaissances directement enseignées dans les PDF. Les contenus ont été reformulés pour une lecture mobile structurée, sans présenter d’ajout comme provenant de la source.

## Validations réalisées

| Contrôle | Résultat |
|---|---|
| Existence des six cibles et absence de contenu initial | Validée avant écriture |
| Absence initiale d’exercice et de quiz | Validée avant écriture |
| Anti-écrasement et anti-doublon dans la migration | Validés par test dédié |
| Contrôle final des liens, quantités et statuts | Validé pour les six leçons |
| TypeScript | Réussi |
| Lint | Réussi ; un avertissement existant de type de module ESLint est non bloquant |
| Tests | 143 réussis, 1 ignoré |
| Export Android | Réussi |

## Limites et prochaine décision administrative

Aucune publication ni activation automatique n’a été effectuée. La validation pédagogique finale, la prévisualisation administrateur et toute activation restent sous le contrôle de l’administrateur EduTech School.
