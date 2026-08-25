# Commande 25 — Test Supabase et build EAS APK

**Date :** 25 août 2026  
**Nature :** contrôle Supabase en lecture seule et build EAS Android interne.  
**Périmètre préservé :** aucune donnée Supabase, règle RLS, RPC, fonctionnalité pédagogique ou architecture métier n’a été modifiée.

## Connecteur Supabase

Le connecteur Supabase est actif et pointe vers le projet **EduMentor** (`nnshioowwniursnozicg`), dont l’état retourné est `ACTIVE_HEALTHY`. Deux lectures non destructives ont été réalisées : l’inventaire compact des tables publiques et une requête agrégée sur les contenus pédagogiques actifs. Aucun profil, identifiant utilisateur, e-mail, clé ou autre donnée personnelle n’a été affiché ni modifié.

| Démonstration de lecture          | Résultat |
| --------------------------------- | -------: |
| Tables publiques inspectées       |       64 |
| Tables inspectées avec RLS active |       64 |
| Leçons actives                    |      313 |
| Exercices actifs                  |      702 |
| Quiz actifs                       |      523 |
| Séances actives                   |       56 |

Le connecteur permet notamment de découvrir les projets, lire le schéma, interroger les tables et les journaux, examiner les migrations, générer des types TypeScript, contrôler les avis de sécurité et gérer les ressources Supabase lorsque cela est explicitement autorisé. Les opérations d’écriture, migrations, Edge Functions, branches et changements de configuration restent séparées des lectures et ne sont jamais réalisées sans instruction explicite.

## Build EAS Android

Une association Expo/EAS compatible a été créée sous `@akpalydelormace-design/edutech-school`, avec l’identifiant EAS `46e8d983-81a2-453e-9b04-7ceaaa24e37a`. Le profil `apk` utilise l’environnement EAS `preview`, une distribution interne et `android.buildType: apk`. Les trois variables publiques nécessaires à la build ont été configurées dans cet environnement sans être écrites dans le dépôt.

La build EAS `bad691b4-6b4a-488c-9c44-8319a4795805` a été soumise, exécutée et terminée avec l’état `FINISHED`. Elle cible Android, le package `com.app.edutechschool`, Expo SDK 54, la version `1.0.0` et le `versionCode` `1`. EAS a généré les identifiants Android distants nécessaires à ce premier build interne.

| Contrôle de l’artefact  | Résultat                                                           |
| ----------------------- | ------------------------------------------------------------------ |
| Type                    | APK Android avec `app-metadata.properties`                         |
| Taille téléchargée      | 51 Mo                                                              |
| SHA-256                 | `d83f3c3b0161ace4d062e1b9e9d4c82426bf2ca6a913117fb6c2fc6e23fd72dc` |
| Distribution            | Interne, installable hors Play Store                               |
| Expiration EAS annoncée | 8 septembre 2026                                                   |

## Validations associées

La configuration Expo a été résolue après association EAS. TypeScript, le lint, le formatage et les deux tests EAS ciblés ont réussi. Le test d’authentification Expo valide le jeton uniquement lorsqu’il est présent dans l’environnement ; il est ignoré en intégration continue afin de ne jamais exiger ni exposer ce secret.

L’APK vérifie la compilation distante et son format installable. La validation fonctionnelle sur appareil Android reste nécessaire, en particulier pour la connexion réseau, les permissions, les deep links et le Mentor IA. L’URL du backend API configurée dans cette build doit également être remplacée par une URL HTTPS durable avant toute diffusion au-delà d’un test immédiat.
