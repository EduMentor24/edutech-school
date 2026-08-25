# EduTech School — Commande 19

## Rapport final de finalisation de sécurité Supabase

**Date :** 25 août 2026  
**Projet vérifié :** **EduMentor** — `nnshioowwniursnozicg` — `https://nnshioowwniursnozicg.supabase.co`  
**Périmètre :** retrait ciblé de `EXECUTE` pour le rôle `anon` sur les nouvelles RPC sensibles. Aucune donnée métier, table, politique RLS, fonction, rôle, coefficient, contenu Terminale, configuration Première ou logique Mentor IA n’a été modifié.

> La migration n’est considérée comme finalisée qu’après contrôle réel des ACL. Ce contrôle a été effectué : les huit RPC ciblées refusent désormais `EXECUTE` à `anon`, tout en conservant l’exécution pour `authenticated` et `service_role` lorsque nécessaire.

## 🟢 Migration appliquée

La migration **`commande19_revoke_anonymous_sensitive_rpc`** a été appliquée avec succès sur EduMentor. Elle contient uniquement des instructions `REVOKE EXECUTE ... FROM anon` et des `GRANT EXECUTE ... TO authenticated` pour les RPC confirmées avant migration. Elle ne modifie ni les fonctions, ni les données, ni les politiques RLS.

| RPC concernée | Finalité | `anon` avant migration | `anon` après migration |
|---|---|---:|---:|
| `admin_list_users` | Recherche et pagination administratives | Autorisé | **Refusé** |
| `admin_get_student_school_history` | Historique scolaire administratif | Autorisé | **Refusé** |
| `admin_set_student_role` | Attribution contrôlée du rôle | Autorisé | **Refusé** |
| `get_my_exercise_content_version` | Version de contenu pour synchronisation exercice | Autorisé | **Refusé** |
| `get_my_quiz_content_version` | Version de contenu pour synchronisation quiz | Autorisé | **Refusé** |
| `sync_local_learning_progress` | Reprise de progression locale | Autorisé | **Refusé** |
| `sync_local_exercise_submission` | Reprise de soumission exercice | Autorisé | **Refusé** |
| `sync_local_quiz_submission` | Reprise de soumission quiz | Autorisé | **Refusé** |

## 🟢 Privilèges vérifiés après migration

La vérification post-migration utilise `has_function_privilege` directement sur les signatures réelles des fonctions. Pour chacune des huit RPC du tableau précédent, le résultat est identique : `anon_execute = false`, `authenticated_execute = true`, `service_role_execute = true` et `prosecdef = true`.

| Profil d’appel | Résultat | Interprétation |
|---|---|---|
| **Anonyme** | ❌ `EXECUTE` refusé | L’API publique ne peut plus appeler directement les huit RPC sensibles sans authentification. |
| **Utilisateur authentifié** | ✅ `EXECUTE` disponible | Les parcours élève et les écrans administratifs continuent de pouvoir atteindre les RPC qui leur sont prévues. |
| **Administrateur** | ✅ Disponible sous l’identité authentifiée | Les RPC administratives contrôlent en plus le rôle dans leur logique interne. |
| **Service** | ✅ Disponible | Accès de service conservé pour les traitements techniques autorisés. |

L’accès `authenticated` ne confère pas un droit d’administration par lui-même. Les fonctions administratives contrôlées — `admin_list_users`, `admin_get_student_school_history`, `admin_record_promotion_decision`, `admin_set_student_account_status` et `admin_set_student_role` — sont toutes `SECURITY DEFINER` et contiennent un contrôle `is_edutech_admin`. La fonction `admin_set_student_role` contient en outre une interdiction explicite de modification de son propre rôle.

> Un élève authentifié peut techniquement atteindre l’endpoint d’une RPC administrative, mais la fonction doit refuser l’opération avant toute mutation lorsque `is_edutech_admin()` est faux. Le test par exécution avec une seconde identité réelle reste à réaliser ; aucun faux compte ni changement de rôle réel n’a été effectué.

## 🟢 RLS vérifiées

Le retrait de privilège n’a modifié aucune RLS. Les dix tables privées contrôlées gardent **RLS active** et leurs politiques présentes.

| Table | RLS | Nombre de politiques |
|---|---:|---:|
| `profiles` | ✅ | 2 |
| `user_progress` | ✅ | 4 |
| `favorites` | ✅ | 3 |
| `exercise_attempts` | ✅ | 2 |
| `quiz_attempts` | ✅ | 2 |
| `grades` | ✅ | 4 |
| `edutech_learning_sync_operations` | ✅ | 1 |
| `edutech_student_school_history` | ✅ | 2 |
| `edutech_class_change_requests` | ✅ | 2 |
| `edutech_school_years` | ✅ | 2 |

## 🟢 Tests réussis

| Contrôle | Résultat |
|---|---:|
| Identification du projet et disponibilité | ✅ EduMentor actif et sain |
| Inventaire ACL avant migration | ✅ 8 RPC ciblées confirmées |
| Application de migration | ✅ Réussie |
| Vérification ACL réelle post-migration | ✅ 8/8 RPC avec `anon_execute = false` |
| Vérification contrôles internes admin | ✅ 5/5 RPC vérifiées avec garde `is_edutech_admin` |
| Vérification RLS | ✅ 10/10 tables avec RLS active |
| TypeScript | ✅ Réussi |
| Lint | ✅ Réussi ; avertissement Node préexistant sur `eslint.config.js` uniquement |
| Tests unitaires | ✅ **381 réussis, 1 ignoré** |
| Export Android | ✅ Réussi |
| Contrôle d’intégrité `git diff --check` | ✅ Réussi |

Les suites locales couvrent notamment l’authentification, le profil, la progression, le cache et la synchronisation pédagogique, l’administration, les notifications, le Bulletin, les contenus Terminale et la règle de suspension de Première. Aucune modification n’a été apportée à Première, aux coefficients ou au Mentor IA.

## 🟡 Avertissements de sécurité à interpréter

L’analyse de sécurité Supabase signale encore des avertissements génériques pour des fonctions `SECURITY DEFINER` appelables par `authenticated`, dont des RPC administratives. Ces avertissements sont attendus dans cette architecture parce que les actions passent par des RPC exposées aux comptes connectés, mais elles doivent alors contrôler le rôle à l’intérieur de la fonction.

Pour les fonctions administratives examinées, ce contrôle interne est présent. La Commande 19 ne demandait pas de retirer `authenticated` des autres fonctions ni de modifier leur architecture ; aucun changement supplémentaire n’a donc été appliqué. Toute réduction future de ces droits devra être conçue séparément pour éviter une régression des écrans administratifs.

## ⚪ Tests impossibles sans identité ou appareil réel

Les vérifications suivantes nécessitent un contexte que cette commande n’a pas simulé :

| Test | Raison |
|---|---|
| Appel effectif des RPC avec un élève non administrateur | Aucun faux compte n’a été créé et aucun rôle réel n’a été modifié. |
| Appel effectif des RPC avec un administrateur distinct | Une identité administrateur réelle séparée est requise pour un test d’autorisation de bout en bout. |
| Cycle mobile hors ligne → reprise réseau | Un appareil Android réel et une session élève réelle sont nécessaires. |
| Lecture de données inter-élèves sous deux comptes | Doit être réalisée avec deux comptes réels afin de vérifier RLS en conditions authentifiées. |

## 🔴 Problèmes éventuels

Aucun échec de migration, de privilège ciblé, de RLS, de TypeScript, de lint, de test unitaire, d’export Android ou d’intégrité Git n’a été observé. Les seuls points non exécutés sont les tests d’identité réelle et appareil réel listés ci-dessus.

## État final

La restriction **REVOKE EXECUTE pour `anon` est appliquée et vérifiée** pour les huit RPC sensibles ciblées. Le connecteur Supabase est resté disponible tout au long de cette commande. Aucune autre modification Supabase ne doit être effectuée sans une instruction distincte.

