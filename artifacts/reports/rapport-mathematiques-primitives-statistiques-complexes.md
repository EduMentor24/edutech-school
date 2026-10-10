# Rapport de création — Mathématiques Terminale

**Date :** 20 août 2026  
**Statut :** Créations effectuées uniquement en **brouillon**, **inactives** et **non publiées**.

## Objet du lot

Le lot traite les supports transmis sur les primitives et le calcul intégral, la statistique à deux variables, ainsi que le PDF valide de Terminale C sur les nombres complexes. Chaque contenu a été reformulé dans un format pédagogique mobile avec définitions, méthodes, avertissements, synthèses et formules LaTeX. Les exercices corrigés et les quiz sont enregistrés dans leurs modules dédiés, séparés du cours.

| Support validé | Niveau et série | Leçon utilisée | Décision de rattachement |
|---|---|---|---|
| `TAMathsleçon08PrimitivesetCalculintegral.pdf` | Terminale A1 | 3. Primitives et calcul intégral | Leçon existante vide enrichie. |
| `TAMathsleçon08PrimitivesetCalculintegral.pdf` | Terminale A2 | 8. Primitives et calcul intégral | Structure absente créée en dernière position, puis enrichie. |
| `TA-Maths-06StatistiquesD200523.pdf` | Terminale A1 | 6. Statistique à deux variables | Leçon existante vide enrichie ; moindres carrés inclus. |
| `TA-Maths-06StatistiquesD200523.pdf` | Terminale A2 | 5. Statistique à deux variables | Leçon existante vide enrichie ; moindres carrés exclus, car réservés à A1 par le PDF. |
| `TCMathsleçon09Nombrescomplexes.pdf` | Terminale C | 6. Nombres complexes | Leçon existante vide enrichie. |

## Structure créée à la dernière position

La progression Terminale A2 ne comportait pas de leçon sur les primitives et le calcul intégral, alors que le PDF validé couvre cette notion. Conformément à votre instruction, la leçon a été ajoutée en dernière position de la progression A2, sans réordonner ni modifier les sept leçons existantes.

| Série | Leçon créée | Identifiant | Position | État |
|---|---|---|---:|---|
| A2 | 8. Primitives et calcul intégral | `edfb7637-7a1a-4be9-8e95-08fceb6191e8` | 80 | Brouillon, inactive |

## Ressources créées et contrôle de statut

Les contrôles de base de données confirment que chaque leçon possède un cours rempli, deux exercices avec leurs questions et un quiz avec ses questions et réponses. Les leçons sont inactives ; tous les exercices et tous les quiz associés sont à la fois inactifs et non publiés.

| Série | Leçon | Cours | Exercices / questions | Quiz / questions / réponses | Statut confirmé |
|---|---|---:|---:|---:|---|
| A1 | Primitives et calcul intégral | 4 284 caractères | 2 / 6 | 1 / 4 / 8 | Brouillon, inactive, non publiée |
| A1 | Statistique à deux variables | 3 146 caractères | 2 / 6 | 1 / 4 / 8 | Brouillon, inactive, non publiée |
| A2 | Statistique à deux variables | 2 830 caractères | 2 / 6 | 1 / 4 / 8 | Brouillon, inactive, non publiée |
| A2 | Primitives et calcul intégral | 4 284 caractères | 2 / 6 | 1 / 4 / 8 | Brouillon, inactive, non publiée |
| C | Nombres complexes | 3 543 caractères | 2 / 6 | 1 / 4 / 8 | Brouillon, inactive, non publiée |

## Fidélité pédagogique

Le cours de primitives reprend la notion de primitive, la condition de valeur, les primitives usuelles, les formes composées, l’intégrale définie et les calculs d’aires du support. Le cours de statistiques distingue strictement le socle commun de la méthode de Mayer des notions explicitement réservées à la série A1 : séries marginales, covariance, corrélation et moindres carrés.

Le cours Terminale C sur les nombres complexes suit le PDF de remplacement : forme algébrique, conjugué, module, affixe, argument, formes trigonométrique et exponentielle, formules de Moivre et d’Euler, racines et équations dans \(\mathbb C\). Les supports n’ont pas été mélangés entre séries.

> **Point de vigilance :** le fichier initialement reçu pour « Nombres complexes et géométrie du plan » est techniquement tronqué. Sa leçon Terminale C existe déjà, mais elle n’a pas été remplie pour éviter toute invention. Une copie lisible du PDF sera nécessaire pour ce futur contenu.

## Validations exécutées

| Contrôle | Résultat |
|---|---|
| Garde-fou du lot | 3 tests réussis |
| TypeScript | Réussi |
| Lint | Réussi, avec un avertissement Node préexistant sur le type de module ESLint |
| Tests complets | 167 tests réussis, 1 ignoré |
| Export Android | Réussi |
| Vérification Supabase | Rattachements, positions, contenu, compteurs et statuts confirmés |

## Fichiers de traçabilité

Les notes d’analyse sont disponibles dans `notes-analyse-pdf-maths-primitives-statistiques-complexes.md`. La migration transactionnelle est `supabase/migrations/20260820_mathematiques_primitives_statistiques_nombres_complexes_drafts.sql`, avec son test de garde-fou `tests/mathematics-primitives-statistics-complexes-drafts.test.ts`.
