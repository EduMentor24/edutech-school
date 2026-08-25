# Commande 26 — Audit Expo/EAS avant build

**Date :** 25 août 2026  
**Consigne respectée :** aucune nouvelle commande `eas build` n’a été lancée dans cet audit ; aucune donnée Supabase, RLS, RPC, contenu pédagogique ou fonctionnalité n’a été modifiée.

## Contexte d’exécution

Le fichier reçu décrit une étape de préparation antérieure au premier build. L’état actuel est plus avancé : le projet Expo/EAS est déjà associé et une APK interne a été effectivement générée plus tôt sur instruction explicite. Le présent rapport contrôle donc l’état préparatoire courant sans lancer une seconde build.

## 🟢 Prêt

| Élément              | État vérifié                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------- |
| Projet Expo/EAS      | `@akpalydelormace-design/edutech-school` associé à l’identifiant `46e8d983-81a2-453e-9b04-7ceaaa24e37a` |
| Identité Android     | Package `com.app.edutechschool`, version `1.0.0`, `versionCode` `1`                                     |
| Profil EAS           | `apk` interne, type Android `apk`, environnement `preview`                                              |
| Configuration Expo   | Résolue avec Expo SDK 54, `minSdkVersion` 24, ABI `armeabi-v7a` et `arm64-v8a`                          |
| Supabase             | URL publique confirmée pour EduMentor (`nnshioowwniursnozicg`) ; aucun changement Supabase effectué     |
| Validation technique | TypeScript, lint, configuration Expo, association EAS et 398 tests réussis ; 1 test ignoré              |
| Sécurité Git         | Aucun secret ajouté au dépôt ; APK et répertoire `artifacts/` exclus de Git                             |

## 🟡 Prérequis

| Prérequis                   | Portée                                                                                                                                                                                                       |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Backend HTTPS durable       | Nécessaire sur appareil Android réel pour les routes API, le flux OAuth hérité et le Mentor IA. L’URL temporaire de prévisualisation ne convient pas à une diffusion durable.                                |
| Tests sur appareil réel     | Installation, authentification, deep links, permissions, réseau mobile, Cours, Exercices, Quiz, Bulletin et Mentor IA doivent être testés sur Android.                                                       |
| Variables OAuth historiques | À renseigner seulement si le flux OAuth associé reste utilisé : `EXPO_PUBLIC_OAUTH_PORTAL_URL`, `EXPO_PUBLIC_OAUTH_SERVER_URL`, `EXPO_PUBLIC_APP_ID`, `EXPO_PUBLIC_OWNER_OPEN_ID`, `EXPO_PUBLIC_OWNER_NAME`. |

## 🔴 Blocages

Il n’existe **aucun blocage technique à la soumission d’une nouvelle APK EAS**. En revanche, l’absence d’URL backend HTTPS durable est un blocage fonctionnel pour les parcours API/OAuth/Mentor IA lors d’une diffusion persistante ; elle ne doit pas être contournée par `localhost` ni par une adresse réseau locale.

## 🔐 Variables identifiées

| Variable                               | Build                         | Runtime                     | Visibilité     |
| -------------------------------------- | ----------------------------- | --------------------------- | -------------- |
| `EXPO_PUBLIC_SUPABASE_URL`             | Oui                           | Oui                         | Publique       |
| `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Oui                           | Oui                         | Publique       |
| `EXPO_PUBLIC_API_BASE_URL`             | Oui pour l’APK connectée      | Oui pour API/OAuth/Mentor   | Publique       |
| `EXPO_PUBLIC_OAUTH_PORTAL_URL`         | Seulement si OAuth historique | Oui, même condition         | Publique       |
| `EXPO_PUBLIC_OAUTH_SERVER_URL`         | Seulement si OAuth historique | Oui, même condition         | Publique       |
| `EXPO_PUBLIC_APP_ID`                   | Seulement si OAuth historique | Oui, même condition         | Publique       |
| `EXPO_PUBLIC_OWNER_OPEN_ID`            | Seulement si OAuth historique | Oui, même condition         | Publique       |
| `EXPO_PUBLIC_OWNER_NAME`               | Seulement si OAuth historique | Oui, même condition         | Publique       |
| `JWT_SECRET`                           | Non                           | Backend seulement           | Secret serveur |
| `DATABASE_URL`                         | Non                           | Backend seulement           | Secret serveur |
| `BUILT_IN_FORGE_API_KEY`               | Non                           | Backend Mentor IA seulement | Secret serveur |

Les noms `EXPO_PUBLIC_FOLDER` et `EXPO_PUBLIC_PROJECT_ROOT` apparaissent dans l’outillage local mais ne sont pas consommés par la configuration mobile fonctionnelle inspectée. Ils ne font pas partie des variables nécessaires à cette APK.

## 🚀 Étape suivante

Après autorisation explicite pour une **nouvelle** build, la commande est :

```bash
npx eas-cli@latest build --platform android --profile apk
```

Cette commande n’a pas été exécutée durant cet audit.
