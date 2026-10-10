# Intégration Supabase — Étape 2

## Projet relié

L’application mobile utilise le projet Supabase actif `nnshioowwniursnozicg` (« EduMentor »). La configuration mobile est injectée uniquement via les variables `EXPO_PUBLIC_SUPABASE_URL` et `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Aucune clé `service_role` ni autre secret serveur n’est stocké dans le projet.

## Schéma et sécurité vérifiés

La table existante `public.profiles` est reliée à `auth.users(id)` et contient les champs d’identité et de scolarité nécessaires, notamment `first_name`, `last_name`, `full_name`, `email`, `avatar_url`, `level`, `series`, `created_at` et `updated_at`.

La migration `secure_edutech_student_profiles` a remplacé les anciens déclencheurs concurrents par `on_edutech_auth_user_created`, qui appelle `public.create_edutech_student_profile`. Elle crée un profil élève avec l’identifiant Auth réel et les métadonnées d’inscription, sans données fictives. La table conserve RLS avec les seules politiques `edutech_profiles_select_own` et `edutech_profiles_update_own` pour le rôle `authenticated`.

## Références consultées

La documentation Supabase sur l’authentification Expo recommande l’utilisation de `@supabase/supabase-js`, d’un stockage persistant, de `persistSession`, de `autoRefreshToken`, de routes protégées et de RLS pour les profils. Source : [Supabase — Build a Social Auth App with Expo React Native](https://supabase.com/docs/guides/auth/quickstarts/with-expo-react-native-social-auth).

La documentation Expo SecureStore confirme son utilisation pour les données sensibles sur Android et iOS, avec un repli de stockage adapté au web. Source : [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/).
