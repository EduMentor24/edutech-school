# Rapport de réalisation — Commande 19

**Projet :** EduTech School  
**Objet :** Session persistante, notifications ciblées, mode hors connexion et audit non destructif de la base et du stockage.  
**Méthode :** Les corrections ont été appliquées sans créer de compte, de note, de cours, de notification ni de donnée pédagogique fictive.

## Résultats fonctionnels

La session Supabase existante continue d’être stockée de manière sécurisée. Une fois la session valide restaurée, le contexte non sensible du profil réellement connecté est mis en cache local et isolé par `user_id`. En cas d’indisponibilité réseau, ce contexte permet de maintenir le niveau, la série et l’année scolaire déjà chargés. Une déconnexion réussie purge les caches privés connus du compte courant, notamment ceux du profil, du Bulletin, du Mentor et des notifications, sans toucher aux caches d’un autre utilisateur.

Un centre de notifications élève a été ajouté. Il charge uniquement les notifications autorisées par les politiques RLS, les conserve localement par utilisateur, affiche l’état hors connexion et mémorise les lectures qui devront être synchronisées au retour du réseau. Le retrait d’une notification est local à l’appareil ; il ne supprime jamais une donnée serveur ni la notification d’un autre élève.

L’administration comprend désormais un écran de publication avec confirmation explicite. Le ciblage disponible est limité aux valeurs réelles : tous les élèves actifs, un niveau, un couple niveau-série ou un compte élève actif. Les publications de cours, exercices et quiz ne déclenchent une notification que lorsqu’elles deviennent effectivement publiées et actives. La clé source rend ce déclenchement idempotent afin d’éviter les doublons.

| Domaine | Correction appliquée | Protection conservée |
|---|---|---|
| Session | Cache de contexte profil après authentification validée | Aucun jeton n’est copié dans le cache applicatif |
| Notifications | Boîte de réception, lectures différées, synchronisation à la reprise | RLS par utilisateur, niveau, série et année scolaire |
| Publication | Notifications automatiques pour cours, exercices et quiz actifs | Aucun brouillon ou contenu inactif ne déclenche d’envoi |
| Déconnexion | Purge des données privées de l’utilisateur courant | Les données d’un autre compte restent isolées |

## Audit base de données et stockage

L’audit a identifié plusieurs références applicatives à des tables administratives héritées qui n’existaient pas dans le schéma réel. Les services et écrans concernés ont été réalignés sur les tables `edutech_*`. Le faux repli qui injectait une année scolaire `2026-2027` locale a été supprimé : lorsqu’aucune année réelle n’est disponible, l’application affiche désormais l’état réel.

Deux tables administratives manquantes ont été ajoutées sans aucune insertion de données : les sessions d’évaluation trimestrielles et les rapports annuels archivés. Elles possèdent des contraintes de cohérence, des relations explicites et des politiques RLS : administration complète pour les administrateurs, lecture du seul rapport personnel pour un élève authentifié.

L’audit a également confirmé que les tables de notifications et de lectures sont sous RLS, qu’aucun doublon de lecture ni ciblage de notification invalide n’est présent, et que les vues sensibles respectent maintenant les politiques de l’utilisateur appelant. Les fonctions internes auparavant accessibles au rôle anonyme par privilège `PUBLIC` ont été restreintes. Les fonctions administratives restent accessibles aux utilisateurs authentifiés, mais leurs contrôles de rôle administrateur internes sont conservés ; l’alerte de l’outil de sécurité correspond à cette surface d’administration volontaire, non à une autorisation anonyme.

| Anomalie vérifiée | Correctif non destructif |
|---|---|
| Repli d’année scolaire fictive | Supprimé ; lecture de `edutech_school_years` uniquement |
| Écrans administratifs sur tables inexistantes | Alignés sur `edutech_school_years`, `edutech_class_change_requests`, `edutech_student_school_history` et `edutech_activity_logs` |
| Sessions et rapports archivés absents du schéma | Tables `edutech_term_evaluation_sessions` et `edutech_archived_annual_reports` ajoutées avec RLS et contraintes |
| Vues avec privilèges de propriétaire | Configuration `security_invoker = true` appliquée |
| Fonctions techniques ouvertes au rôle anonyme | Privilèges `PUBLIC`/`anon` retirés pour les fonctions internes concernées |

## Validation technique

| Contrôle | Résultat |
|---|---|
| TypeScript | Réussi avec `pnpm check` |
| Lint Expo | Réussi sans erreur ni avertissement applicatif |
| Tests unitaires | **132 réussis**, **1 ignoré** (test historique déjà marqué ignoré) |
| Tests Commande 19 | 4 tests ajoutés : isolation par utilisateur, lectures différées, purge ciblée et stockage offline |
| Bundle Android | Export Android réussi via Expo |
| Audit RLS notifications | Tables sous RLS ; 0 lecture dupliquée ; 0 ciblage invalide |

## Limites de validation à confirmer sur appareil réel

La compilation, les tests unitaires et les contrôles de schéma ne remplacent pas un essai avec un compte élève réel sur appareil physique. Les vérifications suivantes restent nécessaires avant une mise en production : passage en mode avion, fermeture complète puis réouverture de l’application, retour du réseau, lecture différée d’une notification, et réception d’une notification après publication réelle d’un contenu par un administrateur. Aucune donnée n’a été fabriquée pour simuler ces cas.

> L’audit a supprimé les incohérences vérifiables rencontrées dans le code, les services et le schéma. Une garantie absolue d’absence de défaillance ne peut être donnée sans ces essais utilisateurs réels, mais les contrôles automatisés, de compilation et de sécurité applicables ont été exécutés avec succès.
