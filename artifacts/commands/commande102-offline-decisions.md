# Commande 10.2 — Décisions d’architecture hors connexion

## Portée retenue

Le Bulletin existant conserve son unique moteur de calcul. Les notes, les coefficients d’évaluation et les coefficients de matière sont mis en cache localement par utilisateur. L’application continue donc à afficher, créer, modifier et supprimer les données Bulletin déjà téléchargées lorsque la connexion est indisponible.

La synchronisation automatique retenue intervient lorsque l’application est **ouverte** et que le réseau revient, ou lorsque l’application revient au premier plan. Une synchronisation lorsque l’application Android est totalement fermée n’est pas promise, car elle n’est pas garantie immédiatement par le système ; elle reprend à la prochaine ouverture. Cette limite correspond au choix explicite du demandeur.

## Données locales

| Élément | Rôle | Persistance |
|---|---|---|
| Instantané Bulletin | Matières compatibles avec le profil, coefficients et notes déjà disponibles | Stockage local, isolé par identifiant élève |
| Note locale | UUID stable, données de note, horodatage serveur de référence et état de synchronisation | Stockage local |
| File de synchronisation | Opération `upsert` ou `delete` par UUID de note | Stockage local |
| État de synchronisation | `synced`, `pending`, `error` ou `conflict` | Stockage local et affichage Bulletin |

## Synchronisation et conflits

Une création hors connexion reçoit immédiatement un UUID natif valide pour Supabase. La même clé est réutilisée lors de l’insertion distante, ce qui évite les doublons. Les modifications et suppressions remplacent l’opération en attente précédente pour cette note.

Avant de modifier ou supprimer une note distante, la synchronisation compare l’horodatage serveur mémorisé avec l’horodatage actuel. Si les valeurs divergent, l’opération est marquée `conflict` et reste locale : aucune modification distante n’est écrasée silencieusement. Une erreur réseau ou RLS conserve aussi l’opération dans la file et l’affiche comme erreur de synchronisation.

## Règles de calcul et de sécurité

Les calculs utilisent le modèle pur déjà validé. La moyenne de matière utilise seulement les coefficients d’évaluation saisis par l’élève. La moyenne trimestrielle utilise seulement les coefficients de matière configurés et applicables. Une LV2 C/D est facultative par nature : sans note, elle reste « Non évalué » et ne contribue pas au dénominateur.

Les écritures distantes passent toujours par le client Supabase authentifié avec `student_id = auth.uid()`. Le cache local ne donne aucun privilège supplémentaire et ne permet pas la lecture d’une autre identité.
