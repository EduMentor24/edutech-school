# Commande 29 — Build APK de validation Android

**Statut :** build EAS terminée avec succès.  
**Périmètre :** aucune modification applicative, donnée, contenu pédagogique, Supabase, RLS, RPC, backend, EAS ou signature n’a été réalisée après la validation du commit cible.

| Élément                        | Valeur vérifiée                                                                                     |
| ------------------------------ | --------------------------------------------------------------------------------------------------- |
| Build EAS                      | `15cd003d-6ad9-4618-88d6-ea92c0d9184d`                                                              |
| Statut                         | `FINISHED`                                                                                          |
| Profil                         | `apk`, distribution interne, Android `buildType: apk`                                               |
| Commit source                  | `06f39d223e74584857e1b27c6aa45d2416a68f16` — `fix: configurer l’icône Android EduTech`              |
| Correction local-first incluse | Oui : le commit `4bd3b74697dfdfa60e73436b01ce4ccb5831f7cf` est un ancêtre confirmé du commit source |
| Application                    | `com.app.edutechschool`                                                                             |
| Version                        | `1.0.0`                                                                                             |
| VersionCode                    | `1`                                                                                                 |
| SDK Expo                       | `54.0.0`                                                                                            |
| Taille APK                     | 51 833 084 octets (environ 49,4 Mio)                                                                |
| SHA-256                        | `9db5beaed74edb2b0f3e5c9d55c25e8e1db0a52e0074a9cab6605026f7438651`                                  |
| Expiration EAS annoncée        | 8 septembre 2026                                                                                    |

L’artefact téléchargé est identifié comme une APK Android avec les métadonnées Gradle attendues. Il est exclu du dépôt Git. Les validations préalables ont réussi : TypeScript, lint, configuration Expo/Android/EAS et 404 tests réussis, avec 1 test ignoré. La build est donc l’APK de validation correspondant à l’état applicatif du commit `06f39d2` et contient les corrections local-first et d’icône Android.

## Lien de récupération EAS

`https://expo.dev/artifacts/eas/7FMuN3JqmvCJOyydv9iUbDNqqfeET1-ERhBqcVv_kLs.apk`

La validation tactile, du launcher Android et du fonctionnement réel en mode avion reste à effectuer sur appareil Android par l’utilisateur.
