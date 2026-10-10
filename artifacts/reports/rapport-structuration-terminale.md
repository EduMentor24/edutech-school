# Rapport de structuration officielle — Terminale

**Périmètre :** Terminale A1, A2, C et D uniquement  
**État final :** structures administratives en brouillon, inactives et sans contenu pédagogique  
**Date :** 13 août 2026

## Résumé de l’intervention

Cette étape a structuré les progressions Terminale seulement lorsque la matière, la série et les intitulés étaient explicitement vérifiables dans les documents DPFC 2025-2026. Les associations niveau-série-matière déjà configurées dans Supabase ont été conservées ; aucune n’a été créée, modifiée, publiée ou supprimée.

Les chapitres et leçons ajoutés portent `is_active = false`, `is_test_data = false` et un contenu vide. La seule exception de contenu reste la leçon pilote préexistante de dissertation philosophique en Terminale A1 ; elle demeure inactive et n’a pas été modifiée par cette étape.

> La structure permet la préparation, l’organisation et la validation future des programmes. Elle ne constitue pas une publication de cours aux élèves.

## Structures créées et vérifiées

| Série | Matière | Chapitres / thèmes en brouillon | Leçons en brouillon | Contenu créé |
|---|---|---:|---:|---|
| Terminale A1 | Mathématiques | 1 | 8 | Aucun |
| Terminale A2 | Mathématiques | 1 | 7 | Aucun |
| Terminale A2 | Philosophie | 4 | 11 | Aucun |
| Terminale C | Mathématiques | 1 | 19 | Aucun |
| Terminale C | Philosophie | 4 | 10 | Aucun |
| Terminale C | Physique-Chimie | 6 | 32 | Aucun |
| Terminale C | Sciences de la Vie et de la Terre | 4 | 11 | Aucun |
| Terminale C | Anglais | 1 | 6 | Aucun |
| Terminale C | Français | 1 | 5 | Aucun |
| Terminale D | Mathématiques | 1 | 12 | Aucun |
| Terminale D | Philosophie | 4 | 10 | Aucun |
| Terminale D | Physique-Chimie | 6 | 32 | Aucun |
| Terminale D | Sciences de la Vie et de la Terre | 4 | 15 | Aucun |
| Terminale D | Anglais | 1 | 6 | Aucun |
| Terminale D | Français | 1 | 5 | Aucun |

Les nouveaux enregistrements représentent **40 chapitres/thèmes** et **189 leçons**. Mathématiques est organisée sous une progression de série ; Philosophie et SVT reprennent les compétences extraites ; Physique-Chimie est structurée par grands domaines ; Anglais et Français reprennent les unités ou rubriques majeures explicitement titrées.

## Références par discipline

| Discipline | Série concernée | Portée de la source exploitée |
|---|---|---|
| Mathématiques | A1, A2, C, D | Les progressions distinguent explicitement les quatre séries et listent leurs leçons. [2] |
| Philosophie | A2 | La progression Terminales A1-A2 permet la création de la structure A2, sans dupliquer le contenu pilote A1. [3] |
| Philosophie | C, D | La progression Terminales C-D-E distingue les compétences et leçons employées pour C et D. [4] |
| Physique-Chimie | C, D | Les sections Terminale C et Terminale D sont distinctes dans la progression consultée. [5] |
| SVT | C, D | Les progressions Terminale C et Terminale D distinguent les compétences, thèmes et leçons. [6] |
| Anglais | C, D | Le document est explicitement intitulé pour les Terminales C et D et présente six unités. [7] |
| Français | C, D | La progression Terminale C-D fournit les rubriques majeures de leçons importées sans convertir les évaluations ou remédiations en cours. [8] |

## Éléments volontairement non créés

| Élément | Décision et justification |
|---|---|
| Anglais, Français et SVT pour A1/A2 | Aucun programme n’a été importé : les documents disponibles utilisent une catégorie Terminale A sans ventilation explicite A1/A2. |
| Allemand, Espagnol, Arts plastiques et Éducation musicale | Aucune structure n’a été créée, faute de progression Terminale explicitement ventilée par les quatre séries cibles dans les sources étudiées. |
| EPS | Aucune structure n’a été créée : le document prévoit des progressions adaptées aux installations et ne fixe pas une liste unique par série Terminale. |
| Informatique/TICE | Aucune structure Terminale n’a été créée : le document 2025-2026 disponible couvre les niveaux de 6e à 4e. |
| Histoire-Géographie | Aucune structure Terminale n’a été créée : aucun document spécifique n’a été identifié dans l’index DPFC consulté. |

Cette approche préserve la règle de prudence : aucune série n’est assimilée à une autre, et aucune absence de détail n’est comblée par hypothèse.

## Données préservées

La leçon pilote **`Leçon 1 La dissertation philosophique`** de Philosophie Terminale A1 conserve son contenu, son statut inactif et son titre officiel. Les dix autres leçons officielles A1 restent vides et inactives. Les contenus de test existants sont restés séparés du programme officiel et aucune donnée associée n’a été supprimée.

## Validations réalisées

| Contrôle | Résultat |
|---|---|
| Administration réelle | L’administrateur a confirmé les matières, compteurs, titres, ordres et statuts pour A1, A2, C et D. |
| Statut des structures nouvelles | Tous les chapitres et leçons Terminale ajoutés sont inactifs. |
| RLS avec le profil étudiant réel | `visible_new_terminal_drafts = 0` et `visible_pilot_dissertation = 0`. |
| Associations niveau-série-matière | Préservées ; aucune mutation de ces associations n’a été appliquée. |
| TypeScript | Validé. |
| Lint Expo | Validé. |
| Vitest | 22 tests actifs réussis ; 1 test explicitement ignoré. |
| Export Android Expo | Validé. |

## Arrêt du périmètre

La structuration Terminale est terminée. Aucune publication, aucun contenu pédagogique supplémentaire, aucune association nouvelle et aucune modification des niveaux Première n’ont été réalisés. Une commande distincte sera nécessaire avant de travailler sur Première ou de publier une structure Terminale.

## Références

[1] [DPFC — Progressions du Secondaire 2025-2026](https://dpfc-ci.net/?page_id=5267)  
[2] [DPFC — Mathématiques, Progressions 2025-2026](https://dpfc-ci.net/dpfc/2026/progressions/MATHS%20-%20Progressions%20%202025-2026.pdf)  
[3] [DPFC — Philosophie, Terminales A1-A2, 2025-2026](https://dpfc-ci.net/dpfc/2026/progressions/PHILOSOPHIE%20PROGRESSIONS%20Tles%20A1-A2%202025-2026.pdf)  
[4] [DPFC — Philosophie, Terminales C-D-E, 2025-2026](https://dpfc-ci.net/dpfc/2026/progressions/PHILOSOPHIE%20PROGRESSIONS%20Tles%20C-D-E%202025-2026.pdf)  
[5] [DPFC — Physique-Chimie, Progressions 2025-2026](https://dpfc-ci.net/dpfc/2026/progressions/Physique-Chimie%20Progressions%202025-2026.pdf)  
[6] [DPFC — SVT, Progressions annuelles 2025-2026](https://dpfc-ci.net/dpfc/2026/progressions/SVT%20PROGRESSIONS%20ANNUELLES%202025%202026%20.pdf)  
[7] [DPFC — Anglais, Progression Terminale C-D, 2025-2026](https://dpfc-ci.net/dpfc/2026/progressions/Anglais%20Progression%20Terminale%20C%20et%20D%202025-2026.pdf)  
[8] [DPFC — Français, Progressions pédagogiques second cycle, 2025-2026](https://dpfc-ci.net/dpfc/2026/progressions/FRANCAIS_PROGRESSIONS_A%20USAGE%20PEDAGOGIQUE_2025-2026-%202nd%20CYCLE%20DPFC.pdf)
