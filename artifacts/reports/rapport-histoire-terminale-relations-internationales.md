# Rapport de création — Histoire Terminale : relations internationales

**Date :** 20 août 2026  
**Statut :** Tous les contenus du lot sont en **brouillon**, **inactifs** et **non publiés**.

## Périmètre traité

Les trois PDF École numérique transmis ont été lus et reformulés pour le thème **« Les relations internationales de 1945 à nos jours »**. Les leçons existantes A1 et A2 ont été enrichies sans modifier leur ordre. Les offres Histoire-Géographie Terminale C et D existaient mais ne comportaient aucun chapitre : le thème 1 et ses trois leçons ont donc été créés dans l’ordre officiel, puis remplis.

| Leçon | Source | Contenu central |
|---|---|---|
| 1. L’Organisation des Nations Unies (ONU) | `TleH1-LOrganisationdesNationsUnies(ONU).PDF` | Création, objectifs, principes, organes, organismes spécialisés, bilan et réformes. |
| 2. L’ère de la bipolarisation de 1947 à 1991 | `TleH2-Lèredelabipolarisationde1947à1991.PDF` | Rupture de 1947, blocs, crises, coexistence pacifique, guerre du Viêtnam et fin de l’URSS. |
| 3. De la fin de la guerre froide à un monde multipolaire | `TleH3-Delafindelaguerrefroideversunmondemultipolaire.PDF` | Hyperpuissance américaine, attentats de 2001, BRICS et recomposition multipolaire. |

## Structures C et D créées dans l’ordre

Pour les séries C et D, la migration a créé seulement le thème explicitement couvert par les PDF, à la position pédagogique `20`, puis les leçons 1, 2 et 3 aux positions `10`, `20` et `30`. La position `10` de chapitre reste disponible pour une éventuelle méthodologie future, qui ne doit être créée qu’à partir d’un support valide.

| Série | Chapitre ajouté | Position du chapitre | Leçons ajoutées | Positions |
|---|---|---:|---|---|
| C | THÈME 1 — LES RELATIONS INTERNATIONALES DE 1945 À NOS JOURS | 20 | ONU ; bipolarisation ; monde multipolaire | 10 ; 20 ; 30 |
| D | THÈME 1 — LES RELATIONS INTERNATIONALES DE 1945 À NOS JOURS | 20 | ONU ; bipolarisation ; monde multipolaire | 10 ; 20 ; 30 |

## Ressources créées et statuts contrôlés

Chaque leçon des quatre séries dispose d’un cours approfondi, de deux exercices corrigés et d’un quiz. Les contenus sont strictement séparés entre les tables de leçons, exercices et quiz.

| Séries | Leçons enrichies ou créées | Cours | Exercices / questions | Quiz / questions / réponses | Statut |
|---|---:|---:|---:|---:|---|
| A1 | 3 | 3 | 6 / 18 | 3 / 12 / 24 | Brouillons inactifs, non publiés |
| A2 | 3 | 3 | 6 / 18 | 3 / 12 / 24 | Brouillons inactifs, non publiés |
| C | 3 | 3 | 6 / 18 | 3 / 12 / 24 | Brouillons inactifs, non publiés |
| D | 3 | 3 | 6 / 18 | 3 / 12 / 24 | Brouillons inactifs, non publiés |
| **Total** | **12** | **12** | **24 / 72** | **12 / 48 / 96** | **Aucune publication automatique** |

## Contrôles effectués

Les douze leçons contiennent toutes un texte de cours non vide et restent inactives. Les vérifications de base ont confirmé, pour chaque leçon, deux exercices inactifs et non publiés, un quiz inactif et non publié, ainsi que l’absence de doublon de chapitre ou de leçon dans les séries concernées.

| Contrôle | Résultat |
|---|---|
| Garde-fou dédié au lot | 3 tests réussis |
| TypeScript | Réussi |
| Lint | Réussi ; avertissement Node préexistant sur le type de module ESLint |
| Tests complets | 170 tests réussis, 1 ignoré |
| Export Android | Réussi |
| Vérification Supabase | 12 leçons, positions C/D, statuts et absence de doublons confirmés |

## Traçabilité

L’analyse détaillée est enregistrée dans `notes-analyse-pdf-histoire-terminale-relations-internationales.md`. La migration transactionnelle est `supabase/migrations/20260820_histoire_terminale_relations_internationales_drafts.sql`. Le garde-fou correspondant se trouve dans `tests/history-terminal-international-relations-drafts.test.ts`.
