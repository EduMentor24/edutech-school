# Workflow sécurisé de modification de profil

## Périmètre mis en œuvre

Le workflow concerne uniquement le profil réel connecté : prénom, nom, photo, niveau scolaire et série. Aucun compte, événement ou demande de démonstration n’a été créé. Lors du contrôle final, les nouvelles tables opérationnelles ne contenaient aucune entrée : `edutech_profile_change_events = 0` et `edutech_class_change_requests` ne contenait aucune demande de type `profile_change`.

## Règles métier appliquées

| Situation | Résultat sécurisé |
|---|---|
| Administrateur | Peut modifier son propre nom, sa photo, son niveau et sa série sans limite annuelle. |
| Élève, première modification réelle de l’année active | Un avertissement explicite apparaît puis la modification est enregistrée atomiquement. |
| Élève, modification suivante dans la même année | Aucun changement du profil n’est effectué ; une justification de 12 à 1 000 caractères crée une demande `profile_change` en attente. |
| Administrateur, examen de demande | L’approbation actualise le profil et l’historique dans une transaction ; le refus conserve le profil inchangé. |
| Soumission identique | Elle est refusée avant toute consommation du droit annuel. |

L’année active contrôlée est `2025-2026`. La règle « une modification directe élève » est garantie par l’index unique partiel `edutech_profile_change_one_student_direct_per_year`, et non par l’interface seule.

## Protections base de données

Deux migrations ont été appliquées sur le projet officiel EduMentor :

1. `20260822_secure_profile_change_workflow.sql` ajoute l’historique immuable, les RPC atomiques, les colonnes compatibles avec les demandes de classe existantes et le compartiment privé `profile-avatars`.
2. `20260823_enforce_profile_update_guard_trigger.sql` installe le déclencheur `schoolci_guard_profile_update`, contrôlé après application.

Les écritures élèves directes dans `profiles` ne sont plus autorisées par la politique RLS. Les RPC `submit_profile_change`, `edutech_profile_change_status` et `admin_review_class_change_request` utilisent un chemin de recherche fixé à `public`; elles sont limitées au rôle `authenticated`, exigent une session lorsque nécessaire et vérifient l’identité ou le rôle administrateur. Les avertissements génériques du conseiller Supabase concernant les fonctions `SECURITY DEFINER` restent attendus : ces RPC doivent être appelables par le client authentifié, mais leurs contrôles internes empêchent l’élévation de privilèges. Aucune clé de service ni contournement RLS n’est utilisé.

Le compartiment d’avatars est privé, limité à 2 Mo et aux formats JPEG, PNG et WebP. Une personne connectée ne peut téléverser que sous son propre préfixe `<auth.uid>/…`; seules la personne propriétaire et l’administrateur peuvent lire les objets. L’application conserve dans `profiles.avatar_url` le chemin privé, puis génère une URL signée temporaire pour l’affichage.

## Actualisation applicative

Le fournisseur d’authentification recharge le profil après une modification confirmée et lorsque l’application revient au premier plan. L’écran Profil se recharge à la prise de focus, tandis que l’écran Cours réactualise le profil avant de relancer son catalogue. Ainsi, les filtres existants basés sur `school_level` et `series` reçoivent la valeur actuelle sans modifier les modules Cours, Exercices, Quiz, Mentor IA ou Bulletin.

## Contrôles réalisés

| Contrôle | Résultat |
|---|---|
| TypeScript | Réussi (`pnpm check`) |
| Lint | Réussi (`pnpm lint`) |
| Tests | 236 réussis, 1 ignoré (`pnpm test`) |
| Tests ciblés profil et Espagnol L8/L9 | 9 réussis |
| Export Android | Réussi (`npx expo export --platform android`) |
| Audit RLS, index, trigger et compartiment | Confirmés après migration |
| Brouillons Espagnol L8/L9 | 4 leçons L8 et 4 leçons L9 inactives ; 16 exercices et 8 quiz inactifs/non publiés |

La validation de la modification réelle par un élève ou un administrateur n’a volontairement pas été simulée, conformément à l’interdiction de créer des comptes fictifs ou de modifier un vrai profil uniquement pour tester.
