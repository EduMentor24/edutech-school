# Rapport — Mathématiques Terminale C et export PDF premium

**Projet :** EduTech School / Supabase EduMentor (`nnshioowwniursnozicg`)  
**Documents sources :** trois PDF de Mathématiques étiquetés Terminale C (`TC`)  
**Date de traitement :** 19 août 2026

## Périmètre pédagogique contrôlé

Les trois PDF ont été lus intégralement avant toute création. Ils couvrent la dérivabilité et l’étude de fonctions, la géométrie analytique de l’espace, ainsi que les primitives. Après contrôle de la structure réelle, seuls deux rattachements Terminale C existaient avec un titre et un périmètre certains. La leçon de géométrie analytique de l’espace est absente de la structure actuelle ; aucune leçon ou chapitre de substitution n’a été créé.

| PDF source | Leçon Terminale C | Décision |
|---|---|---|
| `TCMathsleçon04DERIVABILITEETETUDEDEFONCTIONS.pdf` | `2. Dérivabilité et étude de fonctions` — `b87a86fd-6892-4ca5-9585-4965b1a057bf` | Création complète en brouillon |
| `TCMathsleçon05Géometrieanalytiquedelespace.pdf` | Aucune leçon correspondante | Aucune création ; document conservé en attente de structure officielle |
| `TCMathsleçon06PRIMITIVES.pdf` | `5. Primitives et calcul intégral` — `5f52ef2e-138e-4ad5-b85b-1df6c416cc23` | Création complète en brouillon |

Les deux leçons créées sont reliées à **Mathématiques → Terminale → Série C → chapitre existant → leçon existante**. Elles étaient vides, inactives et sans activité associée avant l’opération.

## Production créée

Les cours approfondissent les définitions, les méthodes et les conditions de validité sans sortir du contenu des PDF. Le cours de dérivabilité développe le taux d’accroissement, les dérivées latérales, les tangentes, les règles de composition, les accroissements finis et l’optimisation. Le cours sur les primitives développe l’existence, la famille de primitives, les conditions initiales, les fonctions usuelles, la reconnaissance de \(u'\) et la modélisation.

| Ressource par leçon | Quantité par leçon | Total du lot |
|---|---:|---:|
| Cours approfondi dans `public.lessons.content` | 1 | 2 |
| Exercices corrigés dans `public.exercises` | 2 | 4 |
| Questions d’exercice | 10 | 20 |
| Quiz | 1 | 2 |
| Questions de quiz | 6 | 12 |

Le contrôle après écriture confirme des cours de **5 248** caractères pour la dérivabilité et **4 676** caractères pour les primitives. Les deux leçons sont inactives, les quatre exercices sont inactifs et non publiés, et les deux quiz sont inactifs et non publiés.

## Export et impression PDF premium

Le lecteur de cours propose désormais une carte **« Cours en PDF »** pour les élèves autorisés et les administrateurs. Elle comprend les actions **Imprimer** et **PDF**. Sur Android et iOS, le cours est converti en PDF puis ouvert dans la feuille de partage du système afin de l’enregistrer ou de le partager. Sur le web, l’action ouvre la boîte d’impression du navigateur, qui permet aussi l’enregistrement en PDF.

Le générateur transforme les blocs pédagogiques déjà compris par le lecteur : titres, paragraphes, listes, tableaux, encadrés et formules délimitées par `$$ … $$`. Les définitions, méthodes, avertissements, exemples et synthèses gardent une couleur, une bordure et une hiérarchie distinctes dans le document imprimé. Les formules sont imprimées dans des cartes centrées en police monospace, adaptées aux notations transmises par les PDF.

| Contrôle de sécurité | Résultat |
|---|---|
| Élève | L’accès à la leçon demeure filtré par les requêtes existantes ; seules les leçons actives reçues par son profil peuvent être exportées. |
| Administrateur | Les brouillons déjà autorisés en aperçu administrateur peuvent être exportés sans rendre ces contenus visibles aux élèves. |
| HTML PDF | Le contenu de la leçon est échappé avant la génération ; aucune balise fournie par le cours n’est exécutée. |
| RLS | Aucune politique, aucun privilège et aucune requête de contournement n’ont été ajoutés. |

## Validations réalisées

| Validation | Résultat |
|---|---|
| Contrôle Supabase des deux leçons Terminale C | Validé |
| Test de garde-fou de la migration Terminale C | 3 réussis |
| Test du générateur HTML PDF premium | 2 réussis |
| TypeScript | Réussi |
| Lint | Réussi ; avertissement existant de type de module ESLint, non bloquant |
| Suite complète | 161 réussis, 1 ignoré |
| Export Android | Réussi |

## Décision administrative attendue

Les deux lots de Mathématiques Terminale C restent en brouillon, inactifs et non publiés. Ils peuvent être prévisualisés, exportés au format PDF, révisés puis activés et publiés manuellement. Le PDF de géométrie analytique reste volontairement en attente de la structure pédagogique officielle correspondante.
