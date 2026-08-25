# Contribuer à EduTech School

## Principes

Les contributions doivent préserver les données pédagogiques, les droits d’accès, les règles Supabase et les parcours élèves déjà validés. Une évolution ne doit pas introduire de contenu fictif, de secret, de donnée personnelle ou de modification implicite de coefficient, de niveau, de série ou de publication.

## Cycle de travail

Créez une branche dédiée, décrivez le besoin et limitez le changement au périmètre utile. Avant d’ouvrir une demande de fusion, exécutez les contrôles suivants :

```bash
pnpm check
pnpm lint
pnpm exec vitest run --pool=forks --poolOptions.forks.singleFork=true
```

Ajoutez ou actualisez les tests lorsqu’un comportement change. Les modifications Supabase doivent être explicites, réversibles lorsque possible et accompagnées d’une vérification des rôles concernés. Les changements de données pédagogiques doivent être rattachés à la structure niveau → série → matière → chapitre → leçon.

## Données et secrets

N’ajoutez jamais de fichier d’environnement, de clé, de jeton, de mot de passe, de contenu personnel ou d’export de base de données au dépôt. Utilisez les mécanismes de secrets de la plateforme pour les variables requises au démarrage.

## Revue

Utilisez le modèle de demande de fusion et indiquez les risques, les validations automatisées et les tests manuels nécessaires. Une vérification sur appareil Android réel reste nécessaire pour les fonctionnalités mobiles, hors connexion, notifications et permissions natives.
