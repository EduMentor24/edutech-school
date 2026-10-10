# Rapport final — Commande 6.5, Terminale A1

**Date de contrôle :** 13 août 2026  
**Périmètre strict :** Terminale A1 uniquement.  
**Règle appliquée :** conformément à la commande 6.5, une progression DPFC explicitement libellée « Terminale A », « Tle A » ou équivalent est utilisable pour Terminale A1. Un document seulement libellé « Terminale » ou « Tle » reste insuffisant sans rattachement officiel à la filière A.

## Résultat

La structure de trois matières a été ajoutée à Terminale A1 à partir de documents DPFC explicitement ciblés pour la filière A : **Anglais**, **Français** et **Sciences de la Vie et de la Terre**. L’import contient **7 chapitres/thèmes** et **23 leçons**, tous sans contenu, en brouillon et inactifs.

> Aucun cours, explication, exercice ou contenu pédagogique n’a été créé. Les titres ont été repris des progressions officielles, sans reformulation.

## Matières structuréés à partir des sources Terminale A

| Matière | Source officielle et intitulé exact | Niveau / série indiqué | Structure créée | Chapitres / thèmes | Leçons | Statut |
|---|---|---|---|---:|---:|---|
| Anglais | *DPFC-CND ANGLAIS — PROGRESSIONS NATIONALES /2025-2026*, « **PROGRESSION TERMINALE A** » [2] | Terminale A | `PROGRESSION TERMINALE A` ; unités 1 à 10 | 1 | 10 | Inactif, contenu vide. |
| Français | *PROGRESSIONS À USAGE PÉDAGOGIQUE SECOND CYCLE*, « **PROGRESSION ANNUELLE DE LA CLASSE DE TERMINALE A** » [3] | Classe de Tle A | `ÉTUDE DE L’ŒUVRE INTÉGRALE` et `EXPRESSION ÉCRITE` ; leçons principales officielles | 2 | 6 | Inactif, contenu vide. |
| Sciences de la Vie et de la Terre | *PROGRESSION ANNUELLE DES SCIENCES DE LA VIE ET DE LA TERRE*, « **Niveau : Terminale A** » [4] | Terminale A | 4 thèmes ; compétence exacte conservée dans la description administrative de chaque thème | 4 | 7 | Inactif, contenu vide. |

### Détail des intitulés importés

| Matière | Intitulés importés dans l’ordre officiel |
|---|---|
| Anglais | `UNIT 1 LIFESTYLES: MOVING WITH THE TIMES` ; `UNIT 2 FREEDOM AND CIVIL RIGHTS` ; `UNIT 3 DEVELOPMENT ISSUES` ; `UNIT 4 WHAT THE FUTURE HOLDS` ; `UNIT 5 MANAGING RESOURCES` ; `UNIT 6 CONTEMPORARY AFRICA` ; `UNIT 7 INTERNATIONAL ISSUES` ; `UNIT 8 CULTURAL DIFFERENCES` ; `UNIT 9 JUSTICE` ; `UNIT 10 DEMOGRAPHY`. |
| Français — Étude de l’œuvre intégrale | `Leçon 1 : ŒUVRE NARRATIVE` ; `Leçon 2 : GROUPEMENT DE TEXTES THÉÂTRAUX` ; `Leçon 3 : ŒUVRE POÉTIQUE`. |
| Français — Expression écrite | `Leçon 1 : La Dissertation littéraire` ; `Leçon 2 : LE COMMENTAIRE COMPOSÉ` ; `Leçon 3 : RÉSUMÉ DU TEXTE ARGUMENTATIF.` |
| SVT — Thème 1 | `Leçon 1 : L’origine de la vie.` ; `Leçon 2 : L’évolution de la lignée humaine.` |
| SVT — Thème 2 | `Leçon 1 : L’hérédité du sexe et du groupe sanguin chez l’Homme.` ; `Leçon 2 : Les prévisions génétiques.` |
| SVT — Communication | `Leçon 1 : Les réactions émotionnelles chez l’Homme.` ; `Leçon 2 : L’activité cérébrale chez l’Homme.` |
| SVT — Nutrition | `Leçon : L’utilisation des nutriments : la biosynthèse des protéines.` |

Pour Français, les séances, lectures méthodiques, exposés, évaluations, révisions et remédiations ne sont pas transformés en cours fictifs. Pour Anglais, les compétences « Speaking », « Reading », « Listening » et « Writing » restent rattachées à la progression mais ne deviennent pas des leçons distinctes. Cette convention est détaillée dans [`commande65-structure-decisions.md`](./commande65-structure-decisions.md).

## Matières maintenues en attente

| Matière | Source consultée | Motif d’absence de structure |
|---|---|---|
| Allemand | Progressions nationales DPFC 2025-2026 [5] | Le document indique seulement « TERMINALE », sans rattachement explicite à la filière A. |
| Arts plastiques | Progressions DPFC 2025-2026 [6] | Le document indique seulement « Tle », sans rattachement explicite à la filière A. |
| Éducation musicale | Progressions DPFC 2025-2026 [7] | Le document indique « CLASSE DE TERMINALE (Tle) », sans filière A établie. |
| Éducation Physique et Sportive | Progressions DPFC 2nd cycle 2025-2026 [8] | La progression est générique pour le second cycle et ne fixe pas une Terminale A. |
| Espagnol | Progressions DPFC 2025-2026 [9] | Le document indique seulement « TERMINALE (Tle) », sans filière A établie. |
| Histoire-Géographie | Index DPFC 2025-2026 [1] | Aucun document Terminale exploitable n’est référencé. |
| Informatique / TICE | Progressions DPFC 2025-2026 [10] | Le fichier disponible ne couvre pas la Terminale. |

## Contrôles de données et sécurité

L’import est idempotent et contrôlé contre les doublons par association d’offre et titre de chapitre, puis par chapitre et titre de leçon. Le contrôle post-import confirme **7 chapitres** et **23 leçons** ajoutés, avec `is_active = false`, zéro leçon active et zéro leçon possédant du contenu.

| Donnée protégée | État contrôlé après import |
|---|---|
| Mathématiques Terminale A1 | Inchangée : 1 chapitre, 8 leçons. |
| Philosophie Terminale A1 | Inchangée : 5 chapitres, 12 leçons ; leçon pilote préservée. |
| Matière de test et données de test | Inchangées. |
| Associations niveau-série-matière | Aucune création, modification, publication ou suppression. |
| Nouvelles structures Anglais, Français et SVT | Inactives, contenu vide et non-test. |

Les politiques RLS ont été relues après l’import. La lecture élève des chapitres exige notamment `is_active = true`, une offre publiée, une matière active et l’autorisation `school_level`/`series`. La lecture des leçons exige aussi que le chapitre soit actif. Les nouveaux brouillons restent donc invisibles aux élèves Terminale A1 ; les écritures sont toujours réservées à `is_edutech_admin()`.

## Validations techniques

| Validation | Résultat |
|---|---|
| `pnpm check` | Réussi, sans erreur TypeScript. |
| `pnpm lint` | Réussi. Un avertissement Node sur le type de module ESLint est informatif et n’est pas une erreur de lint. |
| `pnpm test` | Réussi : **22 tests actifs** validés ; **1 test ignoré**. |
| `npx expo export --platform android` | Réussi ; bundle Android exporté dans `dist`. |

## Références

[1] [DPFC — Progressions du Secondaire 2025-2026](https://dpfc-ci.net/?page_id=5267)  
[2] [DPFC — Anglais, progression Terminale A 2025-2026](https://dpfc-ci.net/dpfc/2026/progressions/Anglais%20Progression%20Terminale%20A%202025-2026.pdf)  
[3] [DPFC — Français, progressions pédagogiques 2nd cycle 2025-2026](https://dpfc-ci.net/dpfc/2026/progressions/FRANCAIS_PROGRESSIONS_A%20USAGE%20PEDAGOGIQUE_2025-2026-%202nd%20CYCLE%20DPFC.pdf)  
[4] [DPFC — SVT, progressions annuelles 2025-2026](https://dpfc-ci.net/dpfc/2026/progressions/SVT%20PROGRESSIONS%20ANNUELLES%202025%202026%20.pdf)  
[5] [DPFC — Allemand, progressions 2025-2026](https://dpfc-ci.net/dpfc/2026/progressions/ALLEMAND%20PROGRESSIONS%20NATIONALES%20ANNEE%20SCOLAIRE%202025%202026.pdf)  
[6] [DPFC — Arts plastiques, progressions 2025-2026](https://dpfc-ci.net/dpfc/2026/progressions/ARTS%20P_PROGRESSIONS%20PROGRAMMES%20ACTUELS_2025-2026.pdf)  
[7] [DPFC — Éducation musicale, progressions 2025-2026](https://dpfc-ci.net/dpfc/2026/progressions/EDM-PROGRESSIONS%202025-2026.pdf)  
[8] [DPFC — EPS, progressions 2nd cycle 2025-2026](https://dpfc-ci.net/dpfc/2026/progressions/EPS-PROGRESSION%202nd%20CYCLE%20%202025-2026.pdf)  
[9] [DPFC — Espagnol, progressions 2025-2026](https://dpfc-ci.net/dpfc/2026/progressions/ESPAGNOL-PROGRESSIONS%202025-2026_%20DPFC.pdf)  
[10] [DPFC — TICE, progressions 2025-2026](https://dpfc-ci.net/dpfc/2026/progressions/TICE-PROGESSIONS%202025-2026.pdf)
