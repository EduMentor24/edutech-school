# Rapport — Mathématiques Terminale A1/A2 et lecteur de cours

**Projet :** EduTech School / Supabase EduMentor (`nnshioowwniursnozicg`)  
**Documents sources :** trois PDF de Mathématiques Terminale fournis  
**Date de traitement :** 18 août 2026

## Périmètre contrôlé

Les trois PDF ont été lus intégralement avant toute écriture : fonctions polynômes et rationnelles, probabilités, et logarithme népérien. Les documents sont libellés **Terminale A**. Après vérification de la structure et confirmation explicite, le lot a été limité aux leçons Terminale **A1 et A2** dont le titre et le contenu correspondent directement aux sources.

| PDF source | A1 | A2 | Décision C/D |
|---|---|---|---|
| `TAMathsleçon01fonctionspolynômeetfonctionsrationnelles.PDF` | Leçon 1 — `e156de9b-da20-448f-976b-9a48c6be17b4` | Leçon 1 — `85e5cd41-539e-4ba3-8c8b-392c14a0b026` | Aucune leçon de même titre ; aucune création |
| `TAMathsleçon02Probabilité.PDF` | Leçon 2 — `d3b24f26-e5d7-4cae-9dd5-5c6729ea7da3` | Leçon 2 — `1b43a805-c89e-4472-b4c1-45bb7226a822` | Leçons de probabilité conditionnelle différentes ; aucune création |
| `TAMathsleçon03fonctionlogarithmeneperien.PDF` | Leçon 4 — `aec347c0-a680-4ef1-b4f6-67947a1e600c` | Leçon 3 — `50398ee8-8130-47eb-ad7c-f2ef9f8ad5d0` | Titres ou périmètres différents ; aucune création |

Les leçons C/D n’ont pas été utilisées : le PDF de probabilités ne couvre pas la probabilité conditionnelle et le document sur le logarithme ne couvre pas nécessairement le périmètre plus large de la leçon D. Aucune correspondance n’a été supposée.

## Ressources pédagogiques créées

| Ressource par leçon | Quantité par leçon | Total du lot |
|---|---:|---:|
| Cours approfondi dans `public.lessons.content` | 1 | 6 |
| Exercices corrigés dans `public.exercises` | 2 | 12 |
| Questions d’exercice dans `public.exercise_questions` | 10 | 60 |
| Quiz dans `public.quizzes` | 1 | 6 |
| Questions de quiz dans `public.quiz_questions` | 6 | 36 |

Les cours approfondissent les notions des sources sans sortir du programme : domaine et limites, terme dominant, asymptotes, dérivées, variations et dichotomie pour les fonctions ; univers, événements, équiprobabilité, variable aléatoire, espérance, variance et écart-type pour les probabilités ; ensemble de validité, propriétés, limites, équations, inéquations, dérivées et primitives pour le logarithme népérien.

Les expressions mathématiques sont intégrées au contenu sous forme de blocs dédiés, les exemples sont reliés aux méthodes des PDF et les exercices sont séparés du cours. Aucun exercice ou quiz n’a été intégré au texte de la leçon.

## Statuts vérifiés

| Contrôle après écriture | Résultat |
|---|---|
| Leçons A1/A2 | 6 leçons avec `is_active = false` |
| Cours | Longueurs comprises entre 5 464 et 6 575 caractères ; tous en brouillon |
| Exercices | 12, avec `is_active = false` et `is_published = false` |
| Quiz | 6, avec `is_active = false` et `is_published = false` |
| Doublons et écrasements | Migration protégée par contrôle de contenu et de titre ; aucun détecté |

La structure pédagogique ne porte pas de colonne directe d’année scolaire dans les tables de leçons, chapitres et offres ; aucune année n’a été inventée. Les contenus sont rattachés exclusivement à **Matière → Niveau Terminale → Série A1/A2 → Chapitre → Leçon**.

## Amélioration du lecteur côté élève

Le lecteur pédagogique a été enrichi sans modifier les leçons déjà publiées. Il reconnaît désormais les blocs de formules délimités par `$$ … $$` et les affiche dans une carte centrée, sélectionnable et accessible au lecteur d’écran. Cette présentation améliore la lisibilité des fractions textuelles, limites, dérivées, égalités et racines lorsqu’aucun moteur de composition KaTeX natif n’est intégré au runtime mobile.

Les encadrés Markdown bénéficient aussi d’une hiérarchie visuelle fondée sur leur titre : **Définition**, **Méthode**, **Attention**, **Exemple**, **Synthèse** et **Repère** reçoivent des couleurs et bordures distinctes, adaptées aux palettes claire et sombre existantes. Les tableaux conservent leur rendu compact sur smartphone.

| Validation | Résultat |
|---|---|
| Tests spécifiques du parseur, des formules et du lot Mathématiques | 6 réussis |
| TypeScript | Réussi |
| Lint | Réussi ; avertissement existant de type de module ESLint, non bloquant |
| Suite complète | 156 réussis, 1 ignoré |
| Export Android | Réussi |

## Décision administrative attendue

Les six ensembles pédagogiques restent invisibles aux élèves jusqu’à une activation et une publication manuelles. L’administrateur peut d’abord les prévisualiser dans le lecteur amélioré, contrôler les formules et les activités, puis publier chaque leçon séparément.
