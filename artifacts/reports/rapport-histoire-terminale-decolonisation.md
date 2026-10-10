# Rapport de création — Histoire Terminale : décolonisation et indépendances

**Date :** 20 août 2026  
**Statut :** Toutes les ressources créées sont en **brouillon**, **inactives** et **non publiées**.

## Périmètre traité

Les trois PDF transmis ont été lus intégralement et associés au **thème 2 — De la décolonisation aux efforts d’organisation de l’Afrique**. Les structures A1 et A2 déjà présentes ont été enrichies. Les offres C et D, qui ne possédaient ni le thème 2 ni ses leçons, ont reçu la structure officiellement couverte par les PDF à la position du programme prévue.

| Leçon | Support source | Axes pédagogiques |
|---|---|---|
| 1. La montée d’un nationalisme | `TleH4-lamontéedesnationalismesok.pdf` | Facteurs internes et externes, formes de mobilisation, acquis sociaux et politiques. |
| 2. L’accession à l’indépendance de la Côte d’Ivoire | `TleH5-LAccessiondelaCôtedIvoireàlindépendance.pdf` | Phases d’espoir, de lutte et de collaboration ; acteurs et réformes de 1944 à 1960. |
| 3. L’indépendance de l’Algérie | `TleH6-LaccessiondelAlgérieàlindépendance.pdf` | Statut colonial, nationalisme, guerre, négociations et indépendance en 1962. |

## Structures créées dans les séries scientifiques

Seul le thème explicitement couvert a été ajouté pour les séries C et D. Son ordre `30` correspond à la progression officielle, après le thème des relations internationales déjà créé à l’ordre `20`. Les trois leçons sont ensuite placées dans l’ordre `10`, `20`, `30`.

| Série | Chapitre ajouté | Position | Leçons ajoutées |
|---|---|---:|---|
| C | THÈME 2 — DE LA DÉCOLONISATION AUX EFFORTS D’ORGANISATION DE L’AFRIQUE | 30 | Nationalisme ; indépendance de la Côte d’Ivoire ; indépendance de l’Algérie |
| D | THÈME 2 — DE LA DÉCOLONISATION AUX EFFORTS D’ORGANISATION DE L’AFRIQUE | 30 | Nationalisme ; indépendance de la Côte d’Ivoire ; indépendance de l’Algérie |

## Ressources créées

Chaque leçon comprend un cours approfondi, deux exercices corrigés et un quiz. Les cours, exercices et quiz sont strictement enregistrés dans leurs modules respectifs.

| Séries | Leçons | Cours | Exercices / questions | Quiz / questions / réponses | Statut |
|---|---:|---:|---:|---:|---|
| A1 | 3 | 3 | 6 / 18 | 3 / 12 / 24 | Brouillons inactifs et non publiés |
| A2 | 3 | 3 | 6 / 18 | 3 / 12 / 24 | Brouillons inactifs et non publiés |
| C | 3 | 3 | 6 / 18 | 3 / 12 / 24 | Brouillons inactifs et non publiés |
| D | 3 | 3 | 6 / 18 | 3 / 12 / 24 | Brouillons inactifs et non publiés |
| **Total** | **12** | **12** | **24 / 72** | **12 / 48 / 96** | **Aucune publication automatique** |

## Contrôles effectués

La vérification Supabase confirme douze cours non vides, placés au chapitre `30` et aux leçons `10`, `20`, `30`. Pour les douze cibles, les exercices et quiz sont confirmés inactifs et non publiés. Aucun doublon de chapitre ou de leçon n’a été détecté.

| Contrôle | Résultat |
|---|---|
| Garde-fou dédié | 3 tests réussis |
| TypeScript | Réussi |
| Lint | Réussi ; avertissement Node préexistant sur le type de module ESLint |
| Tests complets | 173 tests réussis, 1 ignoré |
| Export Android | Réussi |
| Vérification Supabase | Positions, rattachements, statuts et absence de doublons confirmés |

## Traçabilité

L’analyse est dans `notes-analyse-pdf-histoire-terminale-decolonisation.md`. La migration est `supabase/migrations/20260820_histoire_terminale_decolonisation_drafts.sql` et son garde-fou est `tests/history-terminal-decolonization-drafts.test.ts`.
