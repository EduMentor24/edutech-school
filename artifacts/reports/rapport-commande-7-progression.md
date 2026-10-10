# Rapport final — Commande 7, progression pédagogique élève

**Date de contrôle :** 14 août 2026  
**Périmètre :** système central de progression individuelle, Cours, Matière, Chapitre, Leçon et synthèse administrative.  
**Résultat :** la progression est maintenant fondée exclusivement sur les leçons réellement publiées, actives et accessibles selon le profil scolaire de l’élève.

## Fondations de données

La table existante `public.user_progress` a été conservée et étendue ; aucune table de progression parallèle n’a été créée. Sa relation unique `(user_id, lesson_id)` garantit une seule ligne de suivi par élève et par leçon. Les tables existantes de favoris sont préservées ; `favorites` est utilisée pour les leçons et reste unique par utilisateur, type et contenu.

| Élément | Mise en œuvre | Règle appliquée |
|---|---|---|
| États de leçon | `not_started` par absence de ligne, `in_progress` ou `completed` dans `user_progress` | Aucune leçon non disponible n’entre dans le suivi. |
| Dates de suivi | `started_at`, `last_viewed_at`, `completed_at` | La reprise privilégie une leçon en cours, puis la dernière consultée. |
| Compatibilité | `completed`, `progress_percentage`, `updated_at` conservés | Les valeurs restent cohérentes avec l’état moderne. |
| Favoris | Table existante `favorites`, type `lesson` | Une leçon est favorite uniquement pour l’élève connecté. |
| Statistiques admin | Agrégat `get_admin_progress_overview()` | Aucun chiffre fictif n’est affiché lorsqu’il n’existe pas d’activité réelle. |

## Calculs et contenus pris en compte

Le service de progression ne retient une leçon que si l’offre est publiée, la matière active, le chapitre actif, la leçon active et la cible `school_level`/`series` cohérente avec le profil réel. Les brouillons, contenus inactifs et offres hors profil sont exclus à la source du calcul.

| Niveau | Calcul |
|---|---|
| Chapitre | leçons terminées disponibles / leçons disponibles du chapitre × 100 |
| Matière | leçons terminées disponibles / leçons disponibles de la matière × 100 |
| Global | leçons terminées disponibles / toutes les leçons disponibles × 100 |
| Sans leçon disponible | État **Contenu à venir** ; aucun pourcentage artificiel. |

Au moment de l’audit, le profil réel Terminale A1 avait une seule leçon à la fois active et publiée. Ce constat est affiché sans contournement : les autres structures en brouillon ne font pas varier la progression.

## Parcours élève intégré

| Écran | Comportement ajouté |
|---|---|
| Cours | Progression globale réelle, progression par matière et état « Contenu à venir ». |
| Matière | Pourcentage, nombre de leçons terminées, action **Commencer** ou **Continuer le cours** vers la reprise réelle. |
| Chapitre | Pourcentage réel du chapitre et badge individuel `À commencer`, `En cours` ou `Terminée`. |
| Leçon | Enregistrement discret de l’ouverture, complétion persistante, favori personnel, messages d’erreur sans bloquer la lecture. |
| Administration | Synthèse compacte d’activité réelle : élèves ayant commencé, leçons commencées/terminées et progression moyenne. |

## Sécurité et RLS

Les politiques de `user_progress` préservent l’isolation propriétaire : un élève lit, écrit ou supprime uniquement ses propres lignes, tandis que l’administrateur conserve l’accès requis pour la supervision. Une insertion ou mise à jour élève exige aussi que la leçon soit effectivement disponible pour son profil scolaire.

Les fonctions SQL de consultation, ouverture, complétion et statistiques utilisent un `search_path` fixe, vérifient le profil réel avant écriture, et ont fait l’objet d’un contrôle de privilèges direct après migration : **aucune des cinq nouvelles fonctions n’est exécutable par `anon`** ; seules les sessions `authenticated` disposent de l’exécution requise. La fonction statistique vérifie en outre `is_admin()` avant de retourner des agrégats.

## Validation avec le compte réel

Le parcours a été validé avec le compte élève réel Terminale A1. L’utilisateur a confirmé que l’ouverture passait l’état à **En cours**, que la complétion passait à **Terminée**, que la reprise et les favoris fonctionnaient, et que le retour à la matière affichait les informations attendues.

La trace produite uniquement par ce contrôle a ensuite été vérifiée : elle concernait une seule « Leçon de test », avec une progression terminée à 100 %. Cette unique ligne temporaire a été supprimée ; aucun favori n’était enregistré au moment du nettoyage. Après nettoyage, il ne reste aucune progression ni aucun favori fictif.

## Validations techniques

| Contrôle | Résultat |
|---|---|
| Tests unitaires de progression | Réussis : agrégats chapitre/matière, reprise prioritaire et état vide. |
| TypeScript | Réussi, sans erreur. |
| Lint | Réussi. L’avertissement Node sur le type de module ESLint est informatif. |
| Vitest | Réussi : **25 tests actifs** validés dans 9 fichiers ; **1 test ignoré**. |
| Export Android | Réussi ; bundle généré dans `dist`. |

## Conclusion

Le système de progression est opérationnel, individuel et sécurisé. Il ne modifie ni les programmes DPFC, ni les contenus existants, ni les associations niveau-série-matière. Les prochaines évolutions peuvent s’appuyer sur les agrégats réels déjà disponibles, sans reconstruire le moteur de suivi.
