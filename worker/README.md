# Préparation Cloudflare Workers — Mentor IA

Ce dossier est une **préparation parallèle uniquement**. Il ne remplace pas le serveur Express actuel, ne modifie pas `EXPO_PUBLIC_API_BASE_URL` et n’est pas consommé par l’APK existante.

## Commandes locales

| Objectif | Commande | Effet |
|---|---|---|
| Vérifier TypeScript Worker | `pnpm worker:check` | Aucune connexion Cloudflare. |
| Exécuter les tests mockés | `pnpm test -- tests/worker-mentor.test.ts` | Aucune clé ni donnée élève réelle. |
| Démarrer le Worker local | `pnpm worker:dev` | Serveur local uniquement ; aucune publication. |

## Variables et bindings à configurer avant un futur déploiement

| Nom | Classe | Usage |
|---|---|---|
| `AI` | Binding Cloudflare Workers AI | Inférence serveur ; aucune clé dans le bundle Android. |
| `SUPABASE_URL` | Variable runtime côté Worker | Validation du JWT et lecture RLS du profil. |
| `SUPABASE_PUBLISHABLE_KEY` | Variable runtime côté Worker | Appel Supabase avec le JWT de l’utilisateur. |
| `ALLOWED_ORIGINS` | Variable runtime côté Worker | Liste CSV des origines web autorisées ; Android natif ne transmet pas d’origine navigateur. |

Les valeurs réelles doivent être ajoutées dans le tableau de bord Cloudflare ou un système de secrets approprié. Ne pas placer de valeur dans ce dépôt, dans `.dev.vars.example`, dans `EXPO_PUBLIC_*` ou dans l’APK.

La date de compatibilité est fixée à `2025-10-11`, dernière date validée par le runtime Wrangler local installé. Elle pourra être réévaluée lors d’une future mise à jour volontaire de Wrangler et avant le premier déploiement.

La première version préparée est **texte uniquement** : toute image et tout PDF sont refusés explicitement. Une future version image devra ajouter un modèle vision, une réduction de taille, un quota séparé et des tests dédiés ; elle ne peut pas être activée seulement par une variable.

## Commande de déploiement réservée à l’administrateur

Après revue du code, configuration manuelle des variables et tests, l’administrateur pourra lancer :

```bash
npx wrangler deploy --config wrangler.jsonc
```

Cette commande n’a **pas** été exécutée dans cette préparation.
