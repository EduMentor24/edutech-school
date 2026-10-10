# Finalisation manuelle de Supabase Auth sur Android

## Pourquoi cette étape requiert un accès Supabase

La liste d’autorisation des redirections e-mail est un réglage du projet Supabase. Le connecteur de ce projet permet de gérer la base, les migrations et les politiques, mais pas la configuration Auth des URL. La page du tableau de bord ouverte dans cette session demande une authentification Supabase ; aucun réglage n’a donc été modifié sans accès administrateur.

## Redirections à ajouter

Dans le tableau de bord Supabase du projet **EduMentor** : **Authentication → URL Configuration → Redirect URLs**, ajoutez les deux valeurs exactes suivantes, une par ligne :

```text
manusedutechschool://auth/login
manusedutechschool://auth/reset-password
```

Enregistrez les modifications. L’application fournit explicitement ces deux destinations avec `emailRedirectTo` à l’inscription et `redirectTo` à la récupération. Il n’est donc pas nécessaire de remplacer le **Site URL** d’un éventuel site web de production. Si aucun site web n’est configuré et qu’un comportement par défaut mobile est souhaité, le Site URL peut être `manusedutechschool://auth/login`.

## E-mails Supabase à vérifier

Dans **Authentication → Email Templates**, vérifiez que les modèles **Confirm signup** et **Reset password** conservent un lien construit à partir de `{{ .ConfirmationURL }}`. Un modèle personnalisé qui omet cette variable empêche le retour vers l’application.

## Validation sur Android

Les liens `manusedutechschool://…` doivent être testés dans un véritable build Android de l’application, pas uniquement dans Expo Go. Après avoir installé ce build sur le téléphone :

1. Créez un compte avec une adresse e-mail à laquelle vous avez accès, puis ouvrez le message de confirmation.
2. Vérifiez que l’application s’ouvre sur l’écran de connexion ou l’accueil selon l’état de session, sans rester dans le navigateur.
3. Utilisez « Mot de passe oublié », ouvrez l’e-mail, définissez un nouveau mot de passe et reconnectez-vous avec celui-ci.
4. Fermez et rouvrez l’application pour confirmer la restauration de session, puis testez la déconnexion, un mot de passe erroné et la modification du profil.

> N’envoyez jamais de clé `service_role`, `sb_secret_` ou d’identifiant Supabase par message. L’application utilise uniquement l’URL publique et une clé publiable injectées de manière sécurisée.

## Références

[1] [Supabase — Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls)

[2] [Supabase — Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
