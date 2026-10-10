# Rapport final — Commande 14.1 : Correction et restructuration manuelle Première C/D

## Résultat de la correction

La structure précédente de Première C/D a été remplacée **uniquement** pour les matières couvertes par la Commande 14.1. La migration transactionnelle a appliqué les intitulés de référence fournis, sans extrapolation pédagogique, sans sous-leçon inventée et sans réutilisation des progressions A1/A2 ou Terminale.

| Série | Matières corrigées | Chapitres corrigés | Leçons corrigées | Matière conservée hors correction |
|---|---:|---:|---:|---|
| Première C | 7 | 37 | 114 | SVT C : 1 chapitre, 2 leçons, non modifiée |
| Première D | 7 | 37 | 110 | SVT D : 1 chapitre, 2 leçons, non modifiée |

En incluant exclusivement la SVT conservée dans le périmètre structuré de C/D, le total final est de **8 matières, 38 chapitres et 116 leçons** pour Première C, et de **8 matières, 38 chapitres et 112 leçons** pour Première D. Ces totaux sont issus des comptages réels en base après migration.

## Matières corrigées et comptes détaillés

| Matière | Première C — chapitres / leçons | Première D — chapitres / leçons | Statut pédagogique |
|---|---:|---:|---|
| Français | 9 / 19 | 9 / 19 | Vide, inactive, non publiée |
| Anglais | 6 / 6 | 6 / 6 | Une leçon unique par unité, vide, inactive, non publiée |
| Espagnol | 6 / 18 | 6 / 18 | Vide, inactive, non publiée |
| Mathématiques | 1 / 17 | 1 / 15 | Programmes distincts, non fusionnés |
| Philosophie | 3 / 10 | 3 / 10 | Progression commune C-D-E, vide et inactive |
| Physique-Chimie | 5 / 28 | 5 / 26 | Programmes distincts, non fusionnés |
| Histoire-Géographie | 7 / 16 | 7 / 16 | Structure commune appliquée sans modifier A1/A2 |
| SVT | 1 / 2, conservée | 1 / 2, conservée | **NON MODIFIÉE — en attente de source DPFC vérifiée** |

Les unités d’anglais sont chacune représentées par **une seule leçon**, conformément à la règle de non-fractionnement des compétences Speaking, Reading, Listening et Writing. Les structures Mathématiques et Physique-Chimie ont été isolées par série afin de respecter les différences expressément fournies entre C et D.

## Corrections et dédoublonnage

L’audit préalable a identifié **6 chapitres et 12 leçons** issus de la structure C/D insuffisamment conforme. Ces éléments dépendaient uniquement du périmètre concerné et ne possédaient aucune référence de progression élève, quiz ou exercice ; ils ont donc été retirés de manière ciblée. **Quatre associations dupliquées de matière par série** — Mathématiques (C/D) et Physique-Chimie (C/D) — ont été supprimées au profit des matières canoniques associées à leur série respective.

La migration a créé **224 leçons de référence** dans les matières corrigées. Les **4 leçons SVT** existantes ont été conservées sans modification. Le contrôle post-migration n’a détecté **aucun doublon de titre dans un même chapitre** pour les matières corrigées.

## Statuts, catalogue et protection des données

Tous les chapitres corrigés ont `is_active = false`; toutes les leçons corrigées ont un contenu vide et `is_active = false`; toutes les offres corrigées ont `is_published = false`. Le contrôle de base a relevé **0 écart de statut ou visibilité**. Le catalogue élève requiert une offre publiée et des chapitres actifs ; ces contenus ne peuvent donc pas apparaître aux élèves avant activation administrative.

La migration a été strictement limitée au niveau **Première**, aux séries **C** et **D**, et aux matières explicitement listées. Les contrôles post-migration ont conservé les structures de Première A1/A2 (**52 chapitres, 174 leçons**) et Terminale (**68 chapitres, 265 leçons**). Aucun coefficient Première C/D n’existe ni n’a été créé ou modifié par cette commande.

## Validation technique

| Contrôle | Résultat |
|---|---|
| TypeScript | Réussi — `tsc --noEmit` sans erreur |
| Lint | Réussi — `expo lint` sans erreur bloquante |
| Tests unitaires | Réussis — **88 actifs**, 1 ignoré |
| Tests Commande 14.1 | Réussis — 10 contrôles réels sur les listes manuelles, l’isolement C/D, les statuts et le catalogue |
| RLS des tables de cours | Préservée — politiques `SELECT`, `INSERT`, `UPDATE`, `DELETE` administratives présentes pour `course_subject_offerings`, `chapters` et `lessons` |
| Audit RLS global | Alertes historiques sur vues/fonctions `SECURITY DEFINER`, non modifiées par cette commande ; aucune alerte spécifique à la migration C/D |
| Export Android | Réussi — bundle Android Expo généré avec `metadata.json` |

## Sources de référence appliquées

Les intitulés intégrés proviennent exclusivement du cahier des charges utilisateur **Commande 14.1**, qui fixe les structures manuelles de référence DPFC 2025-2026 pour Mathématiques, Physique-Chimie, Français, Anglais, Espagnol, Philosophie et Histoire-Géographie. La SVT n’a volontairement pas été modifiée, conformément à l’instruction explicite d’attendre une progression DPFC 2025-2026 suffisamment vérifiée.

> **Statut SVT : NON MODIFIÉE / EN ATTENTE DE SOURCE VÉRIFIÉE.**
