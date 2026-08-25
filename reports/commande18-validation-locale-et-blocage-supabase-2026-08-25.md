# EduTech School — Commande 18

## Rapport de mise en œuvre et de validation locale

**Date :** 25 août 2026  
**Périmètre actif :** Terminale A1, A2, C et D  
**Règle respectée :** aucune publication, désactivation, suppression ou réécriture de contenu pédagogique Terminale n’a été effectuée. La suspension de Première, les coefficients validés et le fonctionnement du Mentor IA n’ont pas été modifiés.

> **Conclusion opérationnelle.** Les évolutions applicatives locales ont été intégrées et validées par TypeScript, lint, tests unitaires, tests de contrats locaux, export Android et contrôle de diff. Une remédiation de sécurité Supabase reste cependant **non appliquée** : le retrait explicite du privilège `EXECUTE` anonyme de certaines nouvelles RPC est bloqué par l’indisponibilité intermittente du connecteur. Cette limite est détaillée séparément et ne doit pas être considérée comme résolue.

## 1. Résumé des réalisations

| Domaine | État | Réalisation vérifiée | Limite ou suite requise |
|---|---:|---|---|
| Cours hors ligne | 🟢 | Cache local-first privé, versionné et isolé par utilisateur, niveau, série et rôle. | Test réel en mode avion sur appareil à effectuer. |
| Exercices et Quiz hors ligne | 🟢 | Catalogue et détails mis en cache ; soumissions locales conservées comme **en attente**, sans faux résultat serveur. | Validation réelle de reprise réseau à effectuer. |
| Synchronisation | 🟢 | File locale idempotente pour progression, favoris et soumissions ; conflits et erreurs conservés. | Vérification des RPC avec identité réelle après retour stable du connecteur. |
| Administration utilisateurs | 🟢 | Recherche serveur, pagination, statut, rôle, historique scolaire et confirmations ajoutés. | Test avec un administrateur réel à effectuer. |
| Décisions de passage | 🟢 | Récapitulatif des moyennes, confirmation et historique ; aucun changement automatique de niveau ou série. | Test fonctionnel avec données administratives réelles à effectuer. |
| Années scolaires | 🟢 | Création brouillon, activation, clôture et archivage reliés aux RPC administratives avec confirmations. | Test fonctionnel administrateur à effectuer. |
| RLS des tables contrôlées | 🟢 | RLS active et au moins une politique présente sur les dix tables privées/sensibles contrôlées. | Test croisé avec deux comptes réels toujours requis. |
| Restriction `EXECUTE` anonyme des nouvelles RPC | 🔴 | Migration préparée, mais non appliquée. | Attendre le rétablissement du connecteur, appliquer puis vérifier les ACL. |

## 2. Fonctionnement hors ligne pédagogique

Le cache pédagogique local est centralisé dans `lib/offline/pedagogical-cache.ts`. Sa clé contient l’identifiant du compte, le niveau, la série et le rôle du profil connecté. Ainsi, le contenu téléchargé par un élève ne peut pas être réutilisé par un autre utilisateur connecté sur le même appareil, ni confondu entre les séries. Le cycle de déconnexion intègre également la purge de ces données privées.

Le parcours Cours utilise une stratégie **local-first**. Lorsqu’un instantané local compatible existe, il est affiché immédiatement. Un instantané devenu ancien reste lisible pendant qu’un rafraîchissement est tenté en arrière-plan ; un échec réseau ne retire pas le contenu déjà disponible. Le catalogue, les matières, les chapitres, les leçons et les séances sont couverts. Les lectures administratives conservent leur distinction explicite avec les contenus élèves, notamment pour les éléments inactifs.

Les services et écrans Exercices et Quiz utilisent le même contexte de cache privé. En cas de coupure après l’amorçage en ligne, un élève peut consulter les contenus déjà disponibles localement et démarrer une tentative locale. Une tentative soumise sans réseau est étiquetée **en attente de synchronisation** ; l’application ne l’affiche pas comme corrigée et ne fabrique aucun score définitif.

| Donnée hors ligne | Stockage | Comportement en absence de réseau | Comportement à la reprise |
|---|---|---|---|
| Catalogue, matières, chapitres, leçons, séances | Snapshot pédagogique versionné | Lecture locale immédiate si le snapshot existe. | Rafraîchissement distant sans effacer le snapshot lisible. |
| Exercices et Quiz déjà ouverts | Snapshot privé de contenu | Consultation et tentative locale possibles. | Les données distantes restent la source de correction. |
| Vue de leçon, complétion et favori | File d’opérations idempotente | Opération conservée avec état `pending`. | Fusion et envoi par identifiant d’idempotence. |
| Soumission d’exercice ou de quiz | Tentative locale + file | Statut local explicite, sans résultat inventé. | Résultat serveur appliqué, ou conflit/erreur conservé. |

## 3. Synchronisation et conflits

La file spécialisée est mise en œuvre par `learning-sync-store.ts`, `learning-sync-manager.ts` et `learning-sync-context.tsx`. Elle est démarrée depuis le provider racine, s’appuie sur la disponibilité réseau et reprend au retour de l’application au premier plan. Les opérations de progression et de favori sont fusionnées lorsqu’elles concernent la même ressource, tandis que les soumissions restent distinctes pour préserver la trace de chaque tentative.

Chaque opération reçoit une clé d’idempotence. Les soumissions incluent également une empreinte de version de contenu, ce qui permet au serveur de refuser proprement une soumission devenue incohérente avec un exercice ou un quiz modifié. Les états possibles distingués localement sont `pending`, `syncing`, `synced`, `conflict` et `error`. Les erreurs et conflits ne sont pas supprimés automatiquement.

> **Limite de validation.** Le mécanisme est validé par tests de logique et de contrat. Le cycle physique « consultation en ligne → activation du mode avion → redémarrage de l’application → soumission locale → reconnexion » n’a pas été simulé avec un téléphone réel et doit être réalisé après rétablissement du connecteur.

## 4. Administration finalisée

La gestion des utilisateurs est maintenant construite autour d’une façade `user-management-service.ts` qui appelle des RPC dédiées plutôt que de muter directement les tables depuis l’écran. L’interface permet la recherche côté serveur, la pagination, l’affichage du niveau, de la série, du statut, du rôle, des moyennes disponibles et du parcours scolaire. La désactivation/réactivation et le changement de rôle demandent une confirmation. L’interface masque en outre les actions sur le propre compte de l’administrateur ; les RPC correspondantes disposent également de garde-fous serveur.

Les décisions de passage montrent le récapitulatif disponible avant confirmation. L’enregistrement utilise la RPC de décision existante et conserve l’historique scolaire. Par conception, l’écran n’inscrit pas automatiquement un élève dans une autre classe et ne modifie donc pas son niveau ou sa série sans une action administrative distincte et contrôlée.

Les années scolaires disposent désormais d’actions de création en brouillon, activation, clôture et archivage, toutes confirmées à l’écran. Les règles métiers existantes restent appliquées par les RPC : une seule année active, une année active à clôturer avant activation d’une autre, et une année archivée non réactivable.

| Fonction administrative | Canal de mutation | Garde-fou fonctionnel visible |
|---|---|---|
| Recherche utilisateurs et pagination | RPC `admin_list_users` | Taille de page bornée et recherche serveur. |
| Statut d’un compte | RPC `admin_set_student_account_status` | Confirmation et interdiction de modifier son propre compte. |
| Rôle d’un compte | RPC `admin_set_student_role` | Confirmation et interdiction de modifier son propre rôle. |
| Historique scolaire | RPC `admin_get_student_school_history` | Lecture réservée au parcours administratif. |
| Décision de passage | RPC `admin_record_promotion_decision` | Récapitulatif, confirmation, historique conservé. |
| Années scolaires | RPC `admin_create_school_year`, `admin_activate_school_year`, `admin_close_school_year`, `admin_archive_school_year` | Confirmations et contraintes de cycle de vie explicites. |

## 5. Contrôles RLS et autorisations vérifiés

La vérification RLS accessible a confirmé que les tables suivantes ont **RLS active** et au moins une politique associée : `profiles`, `user_progress`, `favorites`, `exercise_attempts`, `quiz_attempts`, `grades`, `edutech_learning_sync_operations`, `edutech_student_school_history`, `edutech_class_change_requests` et `edutech_school_years`.

Les RPC administratives examinées sont en `SECURITY DEFINER`, fixent leur `search_path` et vérifient le statut administrateur à l’intérieur de leur logique. Les RPC liées aux données de l’élève s’appuient sur l’identité authentifiée et sur les règles d’accès aux contenus. Les appels de l’application ajoutés pour les utilisateurs et les décisions passent par ces RPC plutôt que par des mises à jour client directes.

Cette vérification de configuration ne remplace pas un test d’accès multi-identité. En particulier, aucun faux compte n’a été créé et aucun profil réel n’a été modifié pour simuler A2, C, D, Première ou un compte administrateur secondaire.

## 6. 🔴 Blocage externe — restriction EXECUTE des RPC

| Élément | Constat |
|---|---|
| Migration concernée | `commande18_revoke_anonymous_sensitive_rpc` |
| Objet | Retirer explicitement `EXECUTE` au rôle `anon` des nouvelles RPC administratives et de synchronisation, tout en conservant l’accès `authenticated`. |
| Tentatives d’application | **3 tentatives** après préparation de la migration. |
| Erreur observée | Délais d’attente et erreurs de connexion intermittentes du connecteur de données : `deadline_exceeded`, `Client.Timeout exceeded while awaiting headers` et indisponibilité de la configuration de connecteur. |
| État de la remédiation | **Non appliquée. Ne pas la présenter comme corrigée.** |
| Impact | Les garde-fous internes des RPC restent présents, mais la restriction explicite des privilèges d’exécution anonymes n’a pas été persistée ni vérifiée. |
| Décision prise | Aucun contournement, aucune modification de configuration et aucune autre méthode de mutation non vérifiée n’ont été utilisés. |

Les vérifications déjà disponibles ont montré que les nouvelles RPC disposent de contrôles internes, et que les tables privées concernées ont RLS activée. Toutefois, l’audit des ACL a relevé une exécution `anon` encore visible sur les nouvelles RPC concernées. La migration de retrait est préparée mais reste en attente du rétablissement du connecteur.

> **Non validé — connecteur Supabase indisponible/intermittent.** L’application de la migration `commande18_revoke_anonymous_sensitive_rpc`, le contrôle des ACL après migration, les tests d’appel authentifié/anonyme sur les RPC et l’analyse de sécurité Supabase post-remédiation restent à effectuer.

## 7. Validations locales réalisées

| Contrôle | Résultat |
|---|---:|
| TypeScript `pnpm check` | 🟢 Réussi |
| Lint `pnpm lint` | 🟢 Réussi ; seul l’avertissement Node préexistant `MODULE_TYPELESS_PACKAGE_JSON` subsiste. |
| Tests ciblés cache et synchronisation | 🟢 9 tests réussis sur 3 fichiers. |
| Suite unitaire complète | 🟢 381 tests réussis, 1 ignoré, sur 98 fichiers. |
| Export Android `npx expo export --platform android` | 🟢 Réussi. |
| Intégrité de diff `git diff --check` | 🟢 Réussi. |
| Test mobile réel / mode avion | ⚪ Non exécuté : appareil réel et compte authentifié requis. |
| Test RLS à deux identités | ⚪ Non exécuté : aucun faux compte ni changement de profil n’a été effectué. |
| ACL Supabase après retrait de `anon` | 🔴 Non validé : migration non appliquée à cause du connecteur intermittent. |

## 8. Protocole de validation à exécuter après rétablissement du connecteur

La première action ne doit pas être une nouvelle évolution fonctionnelle. Il faut d’abord appliquer la migration déjà préparée, puis vérifier que les ACL des RPC `admin_list_users`, `admin_get_student_school_history`, `admin_set_student_role`, `sync_local_learning_progress`, `sync_local_exercise_submission` et `sync_local_quiz_submission` ne comportent plus de droit d’exécution `anon` et conservent uniquement l’accès nécessaire aux comptes authentifiés.

Ensuite, un administrateur réel doit vérifier les parcours de recherche/pagination, désactivation/réactivation d’un autre compte, promotion contrôlée, consultation de l’historique, enregistrement d’une décision et cycle brouillon → activation → clôture → archivage d’une année. Les confirmations affichées doivent être contrôlées avant toute action qui modifierait une donnée réelle.

Enfin, un élève Terminale A1, puis lorsque des comptes réels existent A2, C et D, doit suivre le protocole suivant : consulter un cours et un exercice en ligne, couper le réseau, redémarrer l’application, relire les contenus cachés, soumettre une tentative locale, rétablir la connexion et vérifier qu’une seule tentative serveur est créée avec son résultat réel. Première doit rester suspendue et le Mentor IA doit continuer à signaler clairement sa dépendance à Internet.

## 9. État d’arrêt

Toutes les validations locales demandées sont terminées. Aucune nouvelle tentative de migration Supabase, ni aucune modification de sécurité par un autre moyen, ne doit être effectuée avant le rétablissement stable du connecteur et la reprise explicite de cette étape.

