# Rapport de conformité — Catalogue scolaire DPFC

**Projet :** EduTech School  
**Périmètre :** niveaux Première et Terminale, séries A1, A2, C et D  
**Date de validation :** 13 août 2026

## Objet et principe de prudence

Cette étape a configuré le **catalogue des matières et des associations niveau–série–matière**, sans créer de contenu pédagogique réel. Les activations ont été limitées aux associations dont le niveau et la série sont suffisamment établis dans les documents DPFC consultés. Une discipline présente dans le catalogue mais insuffisamment détaillée demeure avec `is_published = false` : elle n’est donc pas visible pour les élèves.

> **Principe appliqué :** aucune correspondance entre des regroupements de séries n’a été déduite par analogie. En particulier, un libellé DPFC générique « A » n’a pas été assimilé automatiquement à A1 et A2.

## Couverture structurelle confirmée

Les huit couples requis sont présents dans `level_series` : Première A1, Première A2, Première C, Première D, Terminale A1, Terminale A2, Terminale C et Terminale D. L’audit final Supabase confirme un total de **8 associations niveau–série**.

| Élément contrôlé | Résultat confirmé |
|---|---:|
| Couples niveau–série Première/Terminale × A1/A2/C/D | 8 |
| Offres Mathématiques publiées | 8 |
| Offres Philosophie publiées | 8 |
| Offres Physique-Chimie publiées | 4 |
| Offres SVT publiées | 4 |
| Offres Anglais publiées | 4 |
| Chapitres de test préservés | 1 |
| Leçons de test préservées | 1 |

## Matières activées

| Matière | Couples publiés | Justification documentaire |
|---|---|---|
| **Mathématiques** | Première et Terminale : A1, A2, C, D | Les programmes DPFC sont distinctement listés pour les huit couples. [2] |
| **Philosophie** | Première et Terminale : A1, A2, C, D | Les progressions 2025-2026 distinguent A1-A2 et C-D-E pour les deux niveaux ; les couples cibles sont donc couverts. [1] |
| **Physique-Chimie** | Première C, D ; Terminale C, D | Les programmes consultés identifient explicitement ces séries. Les associations A1/A2 restent non publiées. [2] |
| **Sciences de la Vie et de la Terre** | Première C, D ; Terminale C, D | Les programmes consultés identifient explicitement ces séries. Les associations A1/A2 restent non publiées. [2] |
| **Anglais** | Première C, D ; Terminale C, D | Les progressions distinguent Première C-D et Terminale C-D. [1] |

Les `display_order` configurés garantissent un ordre pédagogique stable. Dans le parcours Terminale A1, **Mathématiques** est affichée avant **Philosophie**.

## Matières et associations maintenues inactives

Les combinaisons **A1/A2** de Physique-Chimie, SVT et Anglais ne sont pas publiées. Cette réserve évite de transformer le regroupement générique « A » présent dans certains documents en une preuve explicite couvrant les deux séries A1 et A2.

| Élément maintenu inactif | Motif |
|---|---|
| Physique-Chimie, SVT et Anglais pour Première/Terminale A1 et A2 | Absence, dans les documents consultés, d’une correspondance DPFC explicitement établie entre le groupe « A » et les séries A1/A2. |
| Allemand, Espagnol, Informatique/TICE, Arts plastiques, Éducation musicale, EDHC, EPS, Français, Histoire-Géographie | Les pages DPFC les recensent, mais les sources étudiées ne permettent pas encore de confirmer précisément les couples Première/Terminale × A1/A2/C/D nécessaires à leur publication. [1] [2] |

L’audit final confirme **0 offre publiée** parmi les matières maintenues inactives ci-dessus.

## Préservation du contenu de test

Le contenu existant **Terminale A1 → Philosophie → Chapitre de test → Leçon de test** a été conservé. Il reste marqué `is_test_data = true`; aucun chapitre ni aucune leçon supplémentaire n’a été créé durant cette étape. La vérification visuelle réalisée avec le compte réel Terminale A1 confirme que ce parcours reste entièrement accessible.

## Sécurité et validation technique

| Contrôle | Résultat |
|---|---|
| Filtrage sous RLS pour le profil réel Terminale A1 | Retourne uniquement Mathématiques (ordre 10) puis Philosophie (ordre 20). |
| Validation visuelle réelle Terminale A1 | Mathématiques avant Philosophie ; navigation complète vers le chapitre et la leçon de test confirmée. |
| Logique Première A2 sans faux compte | Une requête de contrôle ciblant les valeurs réelles du catalogue retourne Mathématiques puis Philosophie. Aucun compte ni profil n’a été créé ou modifié. |
| Politiques de lecture du moteur de cours | 3 politiques de lecture présentes sur les offres, chapitres et leçons. |
| Écriture élève dans les tables de cours | Aucune politique d’écriture attribuée à l’élève sur ces tables. |
| Qualité technique | TypeScript, lint, 10 tests Vitest actifs et export Android validés. |

Le test fonctionnel avec un **compte réel Première A2** demeure volontairement **non exécuté**, puisqu’aucun tel compte n’est disponible. Le résultat de logique ci-dessus vérifie la configuration sans simuler, créer ou modifier un profil.

## Références

[1] [DPFC Côte d’Ivoire — Progressions du secondaire 2025-2026](https://dpfc-ci.net/?page_id=5267)  
[2] [DPFC Côte d’Ivoire — Programmes éducatifs et guides d’exécution du secondaire](https://dpfc-ci.net/?page_id=283)
