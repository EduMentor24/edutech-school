# Diagnostic du profil utilisateur — EduTech School

## Constat initial

La requête de diagnostic sur `auth.users` a confirmé l’existence d’un compte Auth connecté avec des métadonnées réelles, dont un nom complet et un niveau scolaire. La requête sur `public.profiles`, réalisée avec la structure attendue par l’écran mobile, ne retournait aucun enregistrement.

## Hypothèse de correction

Le flux applicatif récupère le profil avec l’identifiant Supabase Auth de la session. L’absence d’enregistrement correspondant dans `public.profiles` est donc la cause immédiate de l’état « profil indisponible ». La correction doit :

1. garantir que le déclencheur `auth.users` crée un profil avec les métadonnées réelles prévues ;
2. créer uniquement les profils manquants pour les comptes Auth existants, sans donnée inventée ;
3. laisser RLS activée et conserver l’accès lecture/modification du seul profil propre à l’utilisateur.

Les détails techniques sont vérifiés sur le projet Supabase via le connecteur configuré, sans clé de service intégrée à l’application.
