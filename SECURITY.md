# Politique de sécurité

## Signalement responsable

Ne publiez pas de vulnérabilité, de clé, de jeton, de mot de passe ou de donnée personnelle dans un ticket public. Utilisez une [alerte de sécurité privée GitHub](../../security/advisories/new) lorsque cette fonction est disponible, ou contactez le propriétaire du dépôt par un canal privé GitHub.

Un signalement utile indique le composant concerné, les étapes de reproduction minimales, l’impact potentiel et, si possible, une proposition de correction. N’ajoutez jamais de données d’élèves ou d’informations d’authentification au rapport.

## Périmètre prioritaire

Les éléments suivants sont particulièrement sensibles : authentification Supabase, politiques RLS, fonctions RPC, session mobile, cache local, données de progression, bulletin, administration et secrets d’environnement.

## Bonnes pratiques du dépôt

Les fichiers d’environnement sont exclus de Git. Les modifications de schéma doivent passer par des migrations contrôlées et les modifications de sécurité doivent être validées avec les rôles concernés. Avant toute fusion, exécutez TypeScript, lint et les tests du projet.
