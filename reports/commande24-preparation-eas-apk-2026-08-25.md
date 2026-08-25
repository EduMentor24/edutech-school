# Commande 24 — Préparation EAS Build pour APK Android interne

**Date :** 25 août 2026  
**Périmètre :** configuration et validation d’une future APK Android interne.  
**Hors périmètre respecté :** aucune fonctionnalité, donnée Supabase, politique RLS, RPC, structure Première/Terminale, contenu pédagogique, dépendance majeure ou architecture métier n’a été modifiée.

## Résultat

Le projet est préparé pour une **future build EAS Android produisant une APK installable de test**. Le profil nommé `apk` est volontairement limité à la distribution interne : il ne produit ni AAB ni publication Google Play. Aucune build EAS, aucune initialisation EAS, aucune association de projet Expo et aucune APK n’ont été lancées dans cette commande.

| Élément               | État contrôlé                                                                                        | Source                                                         |
| --------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Profil EAS            | `apk` avec `distribution: internal` et `android.buildType: apk`                                      | [`eas.json`](../eas.json)                                      |
| Numérotation EAS      | `appVersionSource: local` ; la version et le `versionCode` restent pilotés par la configuration Expo | [`eas.json`](../eas.json), [`app.config.ts`](../app.config.ts) |
| Identité Android      | `com.app.edutechschool`, version `1.0.0`, `versionCode` `1`                                          | [`app.config.ts`](../app.config.ts)                            |
| Compatibilité Android | `minSdkVersion` 24, ABI `armeabi-v7a` et `arm64-v8a`                                                 | [`app.config.ts`](../app.config.ts)                            |
| Workflow natif        | Expo managed/prebuild ; aucun dossier `android/` ou `ios/` versionné n’est requis                    | [`app.config.ts`](../app.config.ts)                            |

## Configuration ajoutée

Le fichier `eas.json` racine contient uniquement le profil nécessaire à une APK de test. Il ne contient **aucune variable d’environnement**, aucun secret, aucun identifiant de projet EAS et aucune information de publication. Le test [`tests/eas-apk-config.test.ts`](../tests/eas-apk-config.test.ts) bloque toute régression vers un format non installable ou non interne.

> Une APK interne peut être installée directement sur un appareil Android compatible. Elle ne constitue pas une soumission au Play Store et ne remplace pas un test sur appareil réel.

## Variables d’environnement et dépendances réseau

Les variables `EXPO_PUBLIC_*` sont intégrées au bundle lors de la build ; elles ne doivent contenir que des valeurs publiques. Elles doivent être configurées dans l’environnement EAS correspondant au profil `apk`, jamais dans Git ni dans `eas.json`.

| Variable                               | Portée           | Statut pour une APK installée                                | Emplacement de configuration    | Justification                                                        |
| -------------------------------------- | ---------------- | ------------------------------------------------------------ | ------------------------------- | -------------------------------------------------------------------- |
| `EXPO_PUBLIC_SUPABASE_URL`             | Publique, mobile | Obligatoire                                                  | Environnement EAS du profil APK | Client Supabase mobile                                               |
| `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publique, mobile | Obligatoire                                                  | Environnement EAS du profil APK | Client Supabase mobile                                               |
| `EXPO_PUBLIC_API_BASE_URL`             | Publique, mobile | Obligatoire pour les parcours qui appellent le backend HTTP  | Environnement EAS du profil APK | Les APK natives ne peuvent pas déduire l’URL locale de développement |
| `EXPO_PUBLIC_OAUTH_PORTAL_URL`         | Publique, mobile | À renseigner si le parcours OAuth correspondant est conservé | Environnement EAS du profil APK | Référence dans la configuration OAuth                                |
| `EXPO_PUBLIC_OAUTH_SERVER_URL`         | Publique, mobile | À renseigner si le parcours OAuth correspondant est conservé | Environnement EAS du profil APK | Référence dans la configuration OAuth                                |
| `EXPO_PUBLIC_APP_ID`                   | Publique, mobile | À renseigner si le parcours OAuth correspondant est conservé | Environnement EAS du profil APK | Référence dans la configuration OAuth                                |
| `EXPO_PUBLIC_OWNER_OPEN_ID`            | Publique, mobile | À renseigner si le parcours OAuth correspondant est conservé | Environnement EAS du profil APK | Référence dans la configuration OAuth                                |
| `EXPO_PUBLIC_OWNER_NAME`               | Publique, mobile | À renseigner si le parcours OAuth correspondant est conservé | Environnement EAS du profil APK | Référence dans la configuration OAuth                                |

Les secrets serveur, tels que `DATABASE_URL`, `JWT_SECRET`, les clés de fournisseur IA et tout jeton d’administration, restent exclusivement dans le déploiement backend. Ils ne doivent être fournis ni au client Android, ni à EAS pour la build mobile, ni au dépôt public.

Le catalogue, les cours, les exercices, les quiz et la session Supabase restent accessibles par les services mobiles déjà configurés. En revanche, OAuth/API et le Mentor IA dépendent d’un backend HTTPS publiquement accessible ; une APK EAS n’embarque pas et n’exécute pas le serveur Express. Une valeur durable de `EXPO_PUBLIC_API_BASE_URL` est donc un prérequis fonctionnel pour ces parcours hors prévisualisation.

## Validations effectuées

| Contrôle                    | Résultat | Observation                                                                                    |
| --------------------------- | -------- | ---------------------------------------------------------------------------------------------- |
| Syntaxe et formatage        | Réussi   | `eas.json`, README et test EAS conformes à Prettier                                            |
| Configuration Expo publique | Réussi   | `npx expo config --type public --json` résout la configuration Android attendue                |
| TypeScript strict           | Réussi   | `pnpm check` a réussi avec une limite mémoire Node de 1024 Mo adaptée à l’environnement chargé |
| Lint                        | Réussi   | `pnpm lint`                                                                                    |
| Tests ciblés EAS            | Réussi   | 1 fichier, 1 test                                                                              |
| Tests complets              | Réussi   | 103 fichiers réussis, 397 tests réussis, 1 fichier/test ignoré                                 |
| EAS CLI en lecture seule    | Réussi   | `eas-cli` 22.4.0 disponible ; aucun login, init ou build lancé                                 |
| Export Expo Android         | Réussi   | Bundle Hermes Android de 6,44 Mo ; répertoire `dist` de 6,7 Mo                                 |
| Cohérence Git               | Réussi   | `git diff --check` sans erreur d’espacement                                                    |

Une première exécution TypeScript sans limite de mémoire explicite a été interrompue par la pression mémoire du sandbox. La même vérification a ensuite abouti avec une limite de 1024 Mo ; ceci ne révèle pas une erreur TypeScript du projet.

## Limites assumées

Cette commande n’a pas produit d’APK, car cela exigerait une action EAS réelle et un projet Expo associé au compte propriétaire. Elle ne valide donc pas l’installation, les permissions réelles, les deep links, la connectivité d’un appareil Android, ni les flux Auth/Mentor contre un backend HTTPS déployé.

## Étapes requises avant la première APK

1. Associer le projet au compte Expo propriétaire, sans modifier l’identifiant Android ni les secrets.
2. Configurer les variables publiques requises dans l’environnement EAS du profil `apk`, avec une URL HTTPS durable pour `EXPO_PUBLIC_API_BASE_URL` si OAuth/API/Mentor IA doivent fonctionner dans l’APK.
3. Lancer la build distante explicitement avec le profil `apk`, puis installer l’artefact résultant sur au moins un appareil Android réel et tester Auth, Cours, Exercices, Quiz, Profil, Bulletin et Mentor IA.
