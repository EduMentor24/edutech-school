# Commande 23 — Validation finale Android

## Portée

Cette commande vérifie l’état final des contenus Terminale A1, A2, C et D sans créer de fonctionnalité, modifier les contenus pédagogiques, réactiver Première ou altérer les règles de sécurité. La production et l’installation d’une APK réelle sont distinctes de l’export Android local : elles doivent être déclenchées via le flux de publication géré, puis contrôlées sur appareil Android physique.

## Intégrité pédagogique Terminale

L’audit Supabase en lecture seule recense **313 leçons actives** dans le périmètre Terminale A1, A2, C et D. Il ne détecte aucune leçon active sans contenu principal et sans séance active remplie, aucun exercice actif publié sans question et aucun quiz actif publié sans question. Les cours Français structurés en séances sont correctement reconnus comme contenus valides : leurs 12 leçons, 56 séances, 112 exercices et 112 quiz restent publiés et actifs.

## Résultat provisoire

La validation de données est positive. Restent à exécuter ou reconfirmer : sécurité Supabase, validations locales, intégrité de la configuration Android et nouvel export Android. Les scénarios tactiles, l’installation d’une APK et le test hors connexion complet seront explicitement réservés à l’appareil réel.

## Sécurité Supabase

La dernière validation effective du projet a confirmé les protections RLS sur les tables privées et le retrait d’`EXECUTE` au rôle `anon` pour les huit RPC sensibles, tout en préservant l’accès `authenticated`. Pour cette commande, une nouvelle lecture de contrôle a été tentée mais le connecteur Supabase a expiré avant l’obtention de sa configuration. Aucune modification de RLS, de RPC, d’authentification ni de données n’a été effectuée ; la revalidation live de ces permissions est donc **non répétée dans cette exécution** et devra être reprise lorsque le connecteur sera disponible.

## Validations locales

| Contrôle | Résultat |
|---|---|
| TypeScript | Réussi, sans erreur |
| Lint | Réussi, sans erreur |
| Tests unitaires | 102 fichiers réussis, 396 tests réussis, 1 test ignoré |
| Navigation et stabilité | Couverts par les contrats de route, de cache, de défilement Quiz/Exercices et de synchronisation inclus dans la suite réussie |
| Configuration Android | Version `1.0.0`, `versionCode` `1` |
| Export Android local | Réussi ; bundle Hermes : 6 439 349 octets ; répertoire `dist` : 6,7 Mo |
| Intégrité du diff | `git diff --check` réussi |

Le cache pédagogique local-first, la persistance de session native, la synchronisation et les notifications restent couverts par les tests existants. Aucune fonctionnalité ni donnée n’a été modifiée pendant cette commande.

## APK et appareil physique

L’export Android local prépare le bundle qui sera inclus dans la build, mais ne produit pas une APK installable ni ne permet d’exécuter une installation dans cet environnement. La génération de l’APK de validation doit être lancée via le bouton **Publish** de l’interface de gestion à partir du checkpoint créé ; cette étape déclenchera le processus de build géré.

Les contrôles suivants restent à réaliser sur un téléphone Android réel : installation de l’APK, lancement sans crash, connexion, parcours de chaque module, défilement des listes Quiz et Exercices, lecture des 12 leçons Français en séances, scénario hors ligne complet et resynchronisation au retour d’Internet. Le Mentor IA doit être testé avec connexion active, conformément à sa dépendance réseau.
