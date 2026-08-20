# Rapport de création — Histoire Terminale, Citations et filtres administratifs

**Date :** 20 août 2026  
**Statut :** Les nouveaux cours, exercices, quiz et citations sont en **brouillon**, **inactifs** et **non publiés**.

## Résumé

Le travail réunit trois livrables distincts. Les écrans **Administration → Exercices** et **Administration → Quiz** disposent désormais de filtres par matière et par série. Deux leçons d’Histoire Terminale issues de PDF lisibles ont été créées ou enrichies dans les quatre séries A1, A2, C et D. Enfin, dix citations authentiques et documentées ont été ajoutées en brouillon pour chacune des quatre matières prises en charge par le module Citations.

| Livrable | Résultat | Accès élève |
|---|---|---|
| Filtres administratifs | Matière et série, à partir des relations réelles des exercices et quiz | Aucun changement |
| Histoire — Union africaine | 4 cours, 8 exercices, 4 quiz | Invisible avant validation et activation |
| Histoire — Valeurs occidentales | 4 cours, 8 exercices, 4 quiz | Invisible avant validation et activation |
| Citations | 10 nouvelles citations sourcées par matière, soit 40 | Invisibles avant validation et activation |

## Filtres réservés à l’administration

Les filtres sont présents uniquement dans les listes administratives d’exercices et de quiz. Ils exploitent le nom réel de la matière et de la série enregistrés dans chaque ressource. L’administrateur peut sélectionner une matière, une série ou les deux ; le filtrage ne modifie ni les ressources, ni les règles RLS, ni les parcours élèves.

| Écran | Filtres ajoutés | Données filtrées |
|---|---|---|
| Administration → Exercices | Matière ; série A1, A2, C, D | Liste locale des exercices administratifs |
| Administration → Quiz | Matière ; série A1, A2, C, D | Liste locale des quiz administratifs |

## Cours d’Histoire vérifiés

Les deux PDF lisibles ont été suivis dans leur plan, leur terminologie et leurs notions clés. Les contenus sont organisés pour lecture mobile avec objectifs, définitions, paragraphes courts, méthodes, tableaux de synthèse et avertissements. Les exercices corrigés et les quiz restent séparés du cours.

| Leçon | Séries | Cours | Exercices / questions | Quiz / questions / réponses | Statut |
|---|---|---:|---:|---:|---|
| Leçon 4 — L’Union africaine (UA) | A1, A2, C, D | 4 | 8 / 24 | 4 / 16 / 32 | Brouillon, inactive, non publiée |
| Leçon 1 — Croyances et valeurs dominantes dans le monde occidental | A1, A2, C, D | 4 | 8 / 24 | 4 / 16 / 32 | Brouillon, inactive, non publiée |
| **Total** | **4 séries** | **8** | **16 / 48** | **8 / 32 / 64** | **Aucune publication automatique** |

Les contrôles de base de données confirment que chacune des huit leçons remplies possède exactement deux exercices, six questions d’exercice, un quiz et quatre questions de quiz. Toutes les leçons sont inactives, et toutes les ressources associées restent non publiées.

## Troisième leçon volontairement différée

La structure de la leçon **« Les mutations contemporaines de la civilisation négro-africaine »** est présente et inactive dans chaque série. Toutefois, son contenu, ses exercices et son quiz n’ont pas été créés. Le PDF transmis est techniquement endommagé et votre instruction confirme qu’elle doit rester en attente d’une copie lisible, afin de préserver la fidélité au support source.

## Citations authentiques

Quarante citations nouvelles ont été ajoutées en brouillon : dix par matière. Elles comportent un auteur, une œuvre ou un texte de référence, un repère précis, une URL source, des mots-clés, une explication pédagogique, un thème et des scopes Terminale A1/A2/C/D. Une garde anti-doublon a préservé les citations déjà enregistrées ; une citation philosophique complémentaire a été ajoutée afin de maintenir exactement dix nouvelles citations de brouillon pour la matière.

| Matière | Nouvelles citations en brouillon | Sources principales |
|---|---:|---|
| Français | 10 | Jean de La Fontaine, *Fables* ; Voltaire, *Candide* [1] [2] |
| Philosophie | 10 | René Descartes, *Discours de la méthode* ; Jean-Jacques Rousseau, *Du contrat social* [3] [4] |
| Histoire-Géographie | 10 | Déclaration universelle des droits de l’homme, articles 1 à 8, 18 et 19 [5] |
| Physique-Chimie | 10 | Henri Poincaré, *La Science et l’Hypothèse* [6] |

> **Contrôle d’authenticité :** aucune citation n’est attribuée sans œuvre, référence et URL de vérification. Les quatre ensembles contrôlés contiennent chacun dix nouvelles citations inactives, non validées et sourcées.

## Validations

| Contrôle | Résultat |
|---|---|
| Tests dédiés — filtres et migration | Réussis |
| TypeScript | Réussi |
| Lint | Réussi ; avertissement Node préexistant sur le type de module ESLint |
| Tests complets | Réussis, avec un test volontairement ignoré |
| Export Android | Réussi |
| Vérification Supabase | Leçons, ressources, statuts, citations, sources et scopes confirmés |

## Références

[1]: https://fr.wikisource.org/wiki/Fables_(La_Fontaine) "Jean de La Fontaine — Fables"
[2]: https://fr.wikisource.org/wiki/Candide,_ou_l%E2%80%99Optimisme/Garnier_1877/Texte_entier "Voltaire — Candide ou l’Optimisme"
[3]: https://fr.wikisource.org/wiki/Discours_de_la_m%C3%A9thode "René Descartes — Discours de la méthode"
[4]: https://fr.wikisource.org/wiki/Du_contrat_social/%C3%89dition_1762/Texte_entier "Jean-Jacques Rousseau — Du contrat social, édition 1762"
[5]: https://www.un.org/fr/about-us/universal-declaration-of-human-rights "Nations Unies — Déclaration universelle des droits de l’homme"
[6]: https://fr.wikisource.org/wiki/La_Science_et_l%E2%80%99Hypoth%C3%A8se/Texte_entier "Henri Poincaré — La Science et l’Hypothèse"
