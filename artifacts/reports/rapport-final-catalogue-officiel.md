# Rapport final — Catalogue scolaire officiel

**Projet :** EduTech School  
**Périmètre :** Première et Terminale, séries A1, A2, C et D  
**Date de validation :** 13 août 2026

## Résultat de la finalisation

Le catalogue élève affiche désormais les matières publiées correspondant au **niveau et à la série réels** du profil Supabase. Les matières associées, mais encore dépourvues de chapitre, ne sont ni cachées ni remplies par un contenu fictif : elles portent le statut explicite **« Matière disponible, contenu à venir »** et mènent vers un état vide honnête.

Une seule extension d’association a été ajoutée pendant cette étape : **Français** pour Première C, Première D, Terminale C et Terminale D. La progression française DPFC 2025-2026 identifie explicitement ces classes. [1]

> Aucun chapitre, aucune leçon, aucun exercice et aucun quiz n’a été créé pendant cette finalisation.

## Matières affichées par profil

| Niveau et série | Matières publiées | Chapitres actifs réellement présents |
|---|---|---:|
| Première A1 | Mathématiques, Philosophie | 0 |
| Première A2 | Mathématiques, Philosophie | 0 |
| Première C | Mathématiques, Philosophie, Physique-Chimie, SVT, Anglais, Français | 0 |
| Première D | Mathématiques, Philosophie, Physique-Chimie, SVT, Anglais, Français | 0 |
| Terminale A1 | Mathématiques, Philosophie | 1 |
| Terminale A2 | Mathématiques, Philosophie | 0 |
| Terminale C | Mathématiques, Philosophie, Physique-Chimie, SVT, Anglais, Français | 0 |
| Terminale D | Mathématiques, Philosophie, Physique-Chimie, SVT, Anglais, Français | 0 |

Les associations Mathématiques et Philosophie sont conservées pour les huit profils, conformément aux documents DPFC déjà vérifiés. Physique-Chimie, SVT et Anglais restent publiées seulement en C et D ; les publications françaises C et D suivent la même logique de preuve explicite. [1] [2]

## Associations non publiées et justification

| Matière ou groupe d’associations | Décision | Justification |
|---|---|---|
| Français A1 et A2 | Non publié | Le document officiel distingue « Première A » et « Terminale A », mais ne ventile pas A1 et A2. |
| Anglais, Physique-Chimie et SVT pour A1/A2 | Non publié | Les documents consultés emploient un groupe A générique sans correspondance écrite A1/A2. |
| Espagnol | Non publié | La progression 2025-2026 mentionne Première et Terminale, sans série A1, A2, C ou D. [2] |
| Allemand, Histoire-Géographie, TICE, Arts plastiques, Éducation musicale, EDHC et EPS | Non publié | Les pages DPFC recensent ces disciplines mais les sources étudiées ne permettent pas d’associer de façon explicite chaque niveau et série cible. [2] |

Cette règle de prudence évite d’associer artificiellement des séries qui ne sont pas explicitement établies par les documents officiels disponibles.

## Sécurité, contenu de test et interface

La matière inactive de test demeure invisible aux élèves. Sous RLS, le profil réel Terminale A1 reçoit uniquement **Mathématiques** et **Philosophie** ; le contrôle a confirmé que la matière de test n’est pas visible. Le parcours existant **Philosophie → Chapitre de test → Leçon de test** est inchangé et reste le seul contenu de test préservé.

L’écran **Administration → Matières** présente maintenant, pour chaque matière, les niveaux et séries associés, le nombre d’associations publiées, et les compteurs réels de chapitres et de leçons. Aucun calcul fictif ou compteur statique n’est utilisé.

## Validation effectuée

| Contrôle | Résultat |
|---|---|
| Couverture Supabase des huit couples niveau-série | Validée. |
| Association Français Première/Terminale C-D | Validée avec 4 associations publiées. |
| RLS du profil réel Terminale A1 | Mathématiques et Philosophie uniquement ; matière test invisible. |
| États sans chapitre | Validés : message explicite, sans création de contenu. |
| Parcours Philosophie de test | Validé manuellement par l’utilisateur, sans régression. |
| Administration → Matières | Validée manuellement par l’utilisateur : associations et compteurs visibles. |
| TypeScript | Validé. |
| Lint | Validé. |
| Tests automatisés | 20 tests actifs réussis ; 1 test explicitement ignoré. |
| Export Android Expo | Validé. |

Le test fonctionnel avec un véritable profil Première A2 reste **non exécuté** car aucun compte réel de ce profil n’est disponible. La matrice Supabase confirme néanmoins que la configuration Première A2 ne publie que Mathématiques et Philosophie, sans simulation de compte ni modification de profil.

## Références

[1] [DPFC — Progressions à usage pédagogique français, second cycle, 2025-2026](https://dpfc-ci.net/dpfc/2026/progressions/FRANCAIS_PROGRESSIONS_A%20USAGE%20PEDAGOGIQUE_2025-2026-%202nd%20CYCLE%20DPFC.pdf)  
[2] [DPFC — Progressions du secondaire 2025-2026](https://dpfc-ci.net/?page_id=5267)  
[3] [DPFC — Programmes éducatifs et guides d’exécution du secondaire](https://dpfc-ci.net/?page_id=283)
