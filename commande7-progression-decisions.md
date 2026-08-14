# Décisions de conception — Commande 7, progression pédagogique

## Constat initial

La table existante `public.user_progress` est déjà reliée à `profiles` et `lessons`, avec une contrainte unique `(user_id, lesson_id)`. Elle est actuellement vide et constitue la fondation appropriée pour le suivi individuel demandé. Elle sera donc **étendue**, et non remplacée. Les tables historiques `edutech_progress`, `favorites` et `edutech_favorites` sont préservées sans suppression.

À la date de l’audit, le compte réel Terminale A1 ne dispose que d’**une leçon active et publiée** au travers des règles de disponibilité existantes. Les nombreuses structures en brouillon ou inactives sont exclues du moteur de progression.

## États et relation de progression

La relation reste strictement unique : `student_id` (`user_id`) + `lesson_id`.

| État présenté à l’élève | Représentation en base | Signification |
|---|---|---|
| Non commencée | Absence de ligne dans `user_progress` | La leçon disponible n’a pas encore été consultée. |
| En cours | `status = 'in_progress'` | La leçon a été ouverte ; les dates de début et de dernière consultation sont conservées. |
| Terminée | `status = 'completed'` | La leçon reste terminée lors des consultations ultérieures ; la date de complétion est conservée. |

La table enrichie conservera `status`, `started_at`, `last_viewed_at`, `completed_at` et `study_seconds`. Les champs historiques `completed`, `progress_percentage` et `updated_at` sont préservés pour compatibilité ; le service maintient leur cohérence à `false/0` pour une leçon en cours et `true/100` pour une leçon terminée.

## Disponibilité et calculs

Une leçon entre dans les calculs uniquement si, en même temps :

1. son offre de matière est publiée ;
2. sa matière est active ;
3. son chapitre est actif ;
4. sa leçon est active ;
5. l’offre correspond au `school_level` et à la `series` réels du profil connecté.

Les calculs sont réalisés sur une extraction groupée de la hiérarchie disponible et une unique lecture des lignes de progression de l’élève pour les identifiants de leçon concernés. Les formules sont les suivantes :

| Niveau d’agrégation | Formule |
|---|---|
| Chapitre | leçons terminées du chapitre / leçons disponibles du chapitre × 100 |
| Matière | leçons terminées de la matière / leçons disponibles de la matière × 100 |
| Global | leçons terminées disponibles / total des leçons disponibles × 100 |

Lorsqu’il n’existe aucune leçon disponible, le service retourne un état `content_pending` et l’interface affiche « Contenu à venir », sans pourcentage artificiel.

## Consultation, reprise et complétion

L’ouverture d’une leçon disponible appelle une fonction SQL invocable par l’élève connecté. Elle crée la ligne en `in_progress` lors de la première consultation, ou met uniquement à jour `last_viewed_at` lors des suivantes. Elle n’écrase jamais l’état `completed`.

L’action de complétion appelle une seconde fonction SQL qui conserve la relation unique, fixe `status = 'completed'`, `completed = true`, `progress_percentage = 100` et `completed_at`. La reprise privilégie la dernière leçon `in_progress`, puis la dernière consultée ; sinon, l’interface propose la première leçon disponible dans l’ordre `display_order` des chapitres puis des leçons.

## Sécurité

Les RLS de `user_progress` restent fondées sur le propriétaire `auth.uid()` et l’accès administratif existant. La création d’une progression est renforcée : elle n’est permise que pour une leçon publiée, active et accessible au niveau/série du profil connecté. Les fonctions SQL vérifient également cette disponibilité avant d’écrire. L’historique d’une ancienne leçon reste stocké si la leçon est ensuite dépubliée ou désactivée, mais elle est exclue des calculs et de la navigation élève.

Les favoris utilisent la table existante `favorites`, déjà unique par `(user_id, content_type, content_id)` et protégée par RLS propriétaire/administrateur. Ils sont exposés seulement pour les leçons accessibles ouvertes par l’élève ; aucun favori ni historique n’est partagé entre élèves.

## Administration

Le service de progression fournira des agrégats réels pour l’administration : élèves ayant commencé ou terminé, progression moyenne, leçons les plus consultées et matières les plus étudiées. L’interface administrative se limite à une synthèse compacte et à l’état vide quand aucune activité réelle n’existe.
