# Décisions d’import — Structure Terminale DPFC

**Périmètre :** Terminale A1, A2, C et D uniquement.  
**Principe :** toute structure créée reste inactive et sans contenu. Une association de matière déjà existante n’est ni modifiée, ni supprimée.

## Sources retenues pour l’import

| Série | Matière | Source DPFC explicitement applicable | Décision de structure |
|---|---|---|---|
| A1 | Mathématiques | *MATHÉMATIQUES — PROGRESSION TleA1 — 2025-2026* | Import des 8 leçons officielles. |
| A2 | Mathématiques | *MATHÉMATIQUES — PROGRESSION Tle A2 — 2025-2026* | Import des 7 leçons officielles. |
| A2 | Philosophie | *PHILOSOPHIE PROGRESSION ANNUELLE : TERMINALES A1-A2* | Import de la même structure officielle A1-A2, sans contenu ; la structure A1 existante n’est pas modifiée. |
| C | Mathématiques | *MATHÉMATIQUES — PROGRESSION Tle C — 2025-2026* | Import des 19 leçons officielles. |
| D | Mathématiques | *MATHÉMATIQUES — PROGRESSION Tle D — 2025-2026* | Import des 12 leçons officielles. |
| C, D | Philosophie | *PHILOSOPHIE PROGRESSION ANNUELLE : TERMINALES C-D-E* | Import séparé pour C et D des 4 compétences et 9 leçons uniques. |
| C | Physique-Chimie | *PROGRESSION DE PHYSIQUE-CHIMIE TERMINALE C 2025-2026* | Import des thèmes et leçons physico-chimiques explicitement listés. |
| D | Physique-Chimie | *PROGRESSION DE PHYSIQUE-CHIMIE TERMINALE D 2025-2026* | Import séparé : les titres diffèrent de la Terminale C. |
| C | SVT | *PROGRESSION ANNUELLE — Niveau : Terminale C* | Import des compétences, thèmes et leçons explicitement listés. |
| D | SVT | *PROGRESSION ANNUELLE — Niveau : Terminale D* | Import séparé : les titres diffèrent de la Terminale C. |
| C, D | Anglais | *PROGRESSIONS TERMINALES C ET D* | Import des six unités officielles. |
| C, D | Français | *PROGRESSION ANNUELLE DES CLASSES DE TERMINALES C et D* | Import des rubriques majeures de leçons officiellement titrées, sans transformer les séances, évaluations ou remédiations en cours fictifs. |

## Structures non importées à ce stade

| Matière et séries concernées | Motif de non-création |
|---|---|
| Anglais, Français et SVT pour A1/A2 | Les documents disponibles emploient le groupe générique `Terminale A`, sans ventilation explicite A1/A2. |
| Allemand, Espagnol, Arts plastiques, Éducation musicale | Les fichiers accessibles ne fournissent pas, dans les libellés Terminale analysés, une ventilation explicite A1/A2/C/D permettant un import par série sans inférence. |
| EPS | Le document propose des exemples de progression dépendant des installations et précise que les classes d’un même niveau peuvent mener des activités différentes ; il ne fixe pas une structure unique par série Terminale. |
| Informatique/TICE | La progression 2025-2026 téléchargée couvre les classes de 6e à 4e, sans programme Terminale. |
| Histoire-Géographie | Aucun document Terminale spécifique n’a été trouvé dans l’index DPFC consulté. |

## Données à préserver

La structure officielle et le contenu pilote de Philosophie Terminale A1 restent inchangés. La leçon pilote `Leçon 1 La dissertation philosophique` n’est ni dupliquée ni écrasée. Les structures ajoutées dans cette étape auront `is_active = false`, `is_test_data = false`, et un contenu vide.

## Références

[1] [DPFC — Progressions du Secondaire 2025-2026](https://dpfc-ci.net/?page_id=5267)  
[2] [DPFC — MATHÉMATIQUES, Progressions 2025-2026](https://dpfc-ci.net/dpfc/2026/progressions/MATHS%20-%20Progressions%20%202025-2026.pdf)  
[3] [DPFC — Philosophie Terminales C-D-E, 2025-2026](https://dpfc-ci.net/dpfc/2026/progressions/PHILOSOPHIE%20PROGRESSIONS%20Tles%20C-D-E%202025-2026.pdf)  
[4] [DPFC — Physique-Chimie, Progressions 2025-2026](https://dpfc-ci.net/dpfc/2026/progressions/Physique-Chimie%20Progressions%202025-2026.pdf)  
[5] [DPFC — SVT, Progressions annuelles 2025-2026](https://dpfc-ci.net/dpfc/2026/progressions/SVT%20PROGRESSIONS%20ANNUELLES%202025%202026%20.pdf)  
[6] [DPFC — Anglais, Progression Terminale C-D, 2025-2026](https://dpfc-ci.net/dpfc/2026/progressions/Anglais%20Progression%20Terminale%20C%20et%20D%202025-2026.pdf)  
[7] [DPFC — Français, Progressions pédagogiques second cycle, 2025-2026](https://dpfc-ci.net/dpfc/2026/progressions/FRANCAIS_PROGRESSIONS_A%20USAGE%20PEDAGOGIQUE_2025-2026-%202nd%20CYCLE%20DPFC.pdf)
