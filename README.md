# EduTech School

Application mobile éducative destinée aux élèves du secondaire. Le projet fournit des parcours de cours, exercices, quiz, bulletin, citations, Mentor IA, notifications et outils d’administration, avec une architecture locale d’abord et une synchronisation Supabase.

## Technologies

Le projet utilise Expo SDK 54, React Native 0.81, Expo Router, TypeScript strict, NativeWind, Supabase et PNPM. La navigation, les données pédagogiques, les sessions et les synchronisations sont conçues pour fonctionner avec des données réelles et des contrôles d’accès Supabase.

## Prérequis

Installez Node.js 22 et PNPM 9.12.0. Une configuration Supabase publique est nécessaire au démarrage de l’application.

```bash
pnpm install --frozen-lockfile
```

## Configuration locale

Configurez les variables suivantes dans le mécanisme de secrets/environnement de votre plateforme de développement. Ne commitez jamais de fichier ou de valeur d’environnement dans Git.

| Variable                               | Rôle                                                            |
| -------------------------------------- | --------------------------------------------------------------- |
| `EXPO_PUBLIC_SUPABASE_URL`             | URL publique du projet Supabase EduMentor.                      |
| `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Clé publique Supabase utilisée par le client mobile.            |
| `EXPO_PUBLIC_API_BASE_URL`             | URL HTTPS publique du backend nécessaire aux fonctions serveur. |

Les variables `EXPO_PUBLIC_*` sont intégrées au bundle mobile : elles doivent donc contenir uniquement des valeurs publiques. Configurez-les dans l’environnement **EAS Build** du profil APK ; ne les placez pas dans le dépôt. Les secrets du backend, notamment les clés de forge, les secrets de session et les accès LLM, restent uniquement sur le backend publié et ne doivent jamais être fournis à EAS pour le build mobile.

## Développement et validations

```bash
# Lancer le serveur de développement
pnpm dev

# Vérifications de qualité
pnpm check
pnpm lint
pnpm exec vitest run --pool=forks --poolOptions.forks.singleFork=true

# Préparer l’export Android local
npx expo export --platform android
```

L’export local vérifie le bundle Android. La génération d’une APK installable et son test doivent passer par le flux de build géré du projet, puis être validés sur un appareil Android réel.

## Build APK interne avec EAS

Le profil `apk` de `eas.json` produit une APK Android installable pour des tests internes, sans publication sur Google Play. La configuration Android actuelle utilise le package `com.app.edutechschool`, la version `1.0.0`, le `versionCode` local `1`, les architectures `armeabi-v7a` et `arm64-v8a`, ainsi qu’un `minSdkVersion` de 24.

Avant une première build EAS, liez le projet au compte Expo propriétaire et définissez les trois variables publiques ci-dessus dans l’environnement EAS correspondant. L’APK aura besoin d’une URL backend HTTPS accessible pour les fonctions qui appellent `/api`, comme les flux OAuth hérités et le Mentor IA ; Supabase seul ne remplace pas ce backend.

## Organisation du dépôt

| Dossier ou fichier              | Responsabilité                                               |
| ------------------------------- | ------------------------------------------------------------ |
| `app/`                          | Écrans Expo Router et parcours utilisateur.                  |
| `components/`, `hooks/`, `lib/` | Composants, logique partagée, Supabase et cache local-first. |
| `server/`                       | Services backend du projet.                                  |
| `tests/`                        | Contrats et tests de non-régression.                         |
| `reports/`                      | Rapports de validation et d’audit.                           |
| `app.config.ts`                 | Métadonnées Expo et paramètres Android.                      |

## Contribution

Créez une branche dédiée, exécutez les contrôles de qualité, puis ouvrez une demande de fusion avec une description claire des impacts fonctionnels, des validations effectuées et des limites éventuelles. Consultez les modèles GitHub inclus dans `.github/`.

## Sécurité

Les problèmes de sécurité doivent être signalés selon [SECURITY.md](SECURITY.md). N’incluez jamais de secrets, de jetons d’accès, de mots de passe ni de données personnelles d’élèves dans un ticket, un journal ou une demande de fusion.
