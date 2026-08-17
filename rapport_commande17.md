# Commande 17 — Rapport final

## Synthèse

La Commande 17 établit un **socle administratif historique et non destructif** pour EduTech School. Les années scolaires, parcours individuels, demandes de changement de classe, décisions de passage et actions administratives sont désormais gérés séparément des données pédagogiques existantes. Aucune donnée élève, note, coefficient, LV2, progression, structure Première ou structure Terminale n’a été supprimée ni recréée artificiellement.

| Domaine | Résultat livré |
|---|---|
| Années scolaires | Statuts préparation, active, clôturée et archivée ; une seule année active ; clôture et archivage sans suppression. |
| Utilisateurs | Recherche et filtres administratifs ; activation/désactivation traçable ; profil élève protégé. |
| Parcours scolaire | Historique par élève et année ; niveau, série, LV2, résultats trimestriels, moyenne annuelle et décision conservés. |
| Changements de classe | Première modification annuelle appliquée par procédure sécurisée ; demande administrative obligatoire ensuite ; décisions acceptées ou refusées journalisées. |
| Bulletin | La classe utilisée est résolue à partir de l’année scolaire consultée afin d’empêcher le mélange entre année courante et historique. |
| Journal | Création, activation, clôture, archivage, décision de passage, demande et statut de compte sont enregistrés. |

## Sécurité et règles de conservation

Les nouvelles tables ont RLS activée. L’élève ne lit que son propre historique et ses propres demandes ; l’administration accède aux historiques et aux demandes selon son rôle. La consultation générale des années scolaires est limitée à l’année active pour l’élève, alors que l’administration conserve l’accès aux années clôturées et archivées.

Les fonctions administratives utilisent des contrôles de rôle. Le rôle `anon` ne peut pas exécuter les fonctions de création, activation, clôture, archivage ou changement de classe ; le contrôle direct des privilèges a confirmé ces refus. Le rôle authentifié conserve l’accès à la procédure de changement de classe, qui refuse les appels hors profil élève et applique les garde-fous d’année active et de limite annuelle.

> Les avertissements de sécurité préexistants concernant certaines vues et fonctions hors périmètre n’ont pas été modifiés. Les fonctions créées dans cette commande ont été durcies contre l’exécution anonyme.

## Interfaces livrées

L’espace Administration comprend désormais les rubriques suivantes : **Années scolaires**, **Utilisateurs**, **Demandes de classe**, **Décisions de passage** et **Journal administratif**. Chaque action sensible nécessite une confirmation explicite dans l’interface.

Le profil élève affiche l’année scolaire, le niveau, la série et la LV2. Le nouvel écran **Parcours scolaire** permet de consulter l’historique et d’effectuer une première demande de classe dans l’année active. Une nouvelle demande ne modifie pas directement le profil : elle attend une décision administrative.

## Contrôles de préservation

| Contrôle réalisé | Résultat observé |
|---|---|
| Année active | Une seule année active conservée. |
| Coefficients 2026-2027 | 44 lignes conservées. |
| Notes 2026-2027 | 2 lignes conservées. |
| Progression | 1 ligne existante conservée. |
| LV2 réelle | Aucune sélection LV2 existante n’a été inventée. |
| Données Terminale | Aucune modification appliquée. |

## Validation technique

| Vérification | Résultat |
|---|---|
| TypeScript | Réussi. |
| Lint | Réussi, sans erreur de règle. |
| Tests Vitest | 142 réussis, 1 ignoré, dont les 20 contrôles Commande 17. |
| RLS années scolaires | Contrôlé : année active ou administrateur. |
| Privilèges fonctions | Contrôlés : appels anonymes refusés sur les fonctions administratives. |
| Export Android Expo | Réussi. |

## Limite de validation réelle

Aucun compte élève supplémentaire n’a été créé pour simuler un historique, une demande ou une décision de passage. La sélection LV2 est encore absente des profils réels existants ; elle reste donc affichée comme non renseignée tant qu’un élève la choisit dans le profil. Les flux sont implémentés et validés par les contrôles automatisés, mais peuvent être confirmés ultérieurement avec des comptes réels.
