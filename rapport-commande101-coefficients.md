# Rapport final — Commande 10.1

**Projet :** EduTech School  
**Objet :** Coefficients Terminale A1/A2 et calcul pondéré du Bulletin personnel  
**Statut :** Implémenté, contrôlé et validé avec le parcours réel Terminale A1.

## Résultat fonctionnel

Le Bulletin existant a été conservé et étendu sans créer de seconde page. Chaque note possède désormais un **coefficient d’évaluation** obligatoire, strictement positif et saisi par l’élève. Ce coefficient est utilisé uniquement pour pondérer la moyenne de la matière. Le **coefficient de matière**, lui, est récupéré automatiquement selon l’association Niveau–Série–Matière, affiché en lecture seule dans le formulaire et réservé au calcul de la moyenne trimestrielle.

> La logique effectivement appliquée est : **note → coefficient d’évaluation → moyenne de matière → coefficient de matière → moyenne trimestrielle**.

| Série | Français | Anglais | Histoire-Géographie | LV2 (Allemand/Espagnol) | Mathématiques | Philosophie | SVT | Arts / Éducation musicale | EPS | Conduite |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Terminale A1 | 4 | 4 | 3 | 3 | 4 | 5 | 2 | 1 | 1 | 1 |
| Terminale A2 | 4 | 4 | 3 | 3 | 2 | 5 | 2 | 1 | 1 | 1 |

Les 24 associations configurées sont rattachées aux offres réelles Terminale A1/A2. **Physique-Chimie** ne possède aucun coefficient dans cette grille et est donc exclue de la moyenne trimestrielle. L’**Éducation Physique et Sportive**, distincte de Physique-Chimie, conserve bien le coefficient 1 prévu par la commande.

## Calculs vérifiés

La moyenne de Français avec les évaluations `15/20` coefficient 2, `12/20` coefficient 1 et `14/20` coefficient 2 est calculée ainsi :

```text
(15 × 2 + 12 × 1 + 14 × 2) / (2 + 1 + 2) = 14/20
```

Le coefficient matière Français `4` n’intervient pas dans ce premier calcul. Il est ensuite utilisé, avec les autres matières effectivement évaluées et possédant un coefficient applicable, pour la moyenne trimestrielle. Une matière sans note reste **« Non évalué »** ; elle n’est jamais convertie en zéro ni ajoutée au dénominateur.

| Contrôle | Résultat |
|---|---|
| Moyenne matière pondérée par coefficients d’évaluation | Réussi : Français A1 = **14,00/20** dans le test transactionnel |
| Coefficient matière Français A1 | Réussi : **4,00** |
| Calcul trimestriel pondéré par coefficients de matière | Couvert par les tests unitaires, dont l’exemple `14×4`, `12×5`, `10×4` = **12/20** |
| Coefficients distincts A1/A2 pour Mathématiques | Réussi : A1 = **4**, A2 = **2** |
| Note sans coefficient matière applicable | Exclue de la moyenne trimestrielle |
| Modification/suppression d’une note ou de son coefficient d’évaluation | Recalcul automatique via rechargement de la synthèse et du détail |

## Sécurité et indépendance

Les politiques RLS demeurent fondées sur `student_id = auth.uid()`. Le test transactionnel a créé trois notes uniquement pendant l’exécution : leur propriétaire pouvait les lire, tandis qu’une autre identité n’en voyait aucune. Le rollback a supprimé ces données de test. Aucun lien automatique n’a été ajouté entre Bulletin, Quiz, Exercices ou progression pédagogique.

L’administration des coefficients est conservée. Les lignes configurées affichent le niveau, la série, la matière, la valeur, la référence et la version de la configuration. Le coefficient d’évaluation de l’élève n’est pas géré ni remplacé par cette administration.

## Validations exécutées

| Validation | Résultat |
|---|---|
| TypeScript | Réussi |
| Lint Expo | Réussi |
| Vitest | **32 tests actifs réussis**, 1 test existant volontairement ignoré |
| Tests unitaires Bulletin | Réussis : moyenne matière pondérée, matières non évaluées, moyenne trimestrielle et année scolaire |
| Export Android | Réussi |
| Test RLS transactionnel | Réussi : 3 notes visibles au propriétaire, 0 à une autre identité, rollback exécuté |
| Validation élève Terminale A1 | Confirmée par l’utilisateur : ajout, calcul, modification, suppression et administration conformes |
| Validation A2 avec profil réel | Non exécutée : aucun profil Terminale A2 réel n’existe ; aucune simulation ni modification artificielle de profil n’a été faite |

## État final des données

L’audit final confirme **24 coefficients Terminale A1/A2 vérifiés**, **zéro note portant l’étiquette de test transactionnel** et l’absence de coefficient pour Physique-Chimie. Deux notes personnelles déjà présentes sont conservées sans lecture ni modification de leur contenu. Le Bulletin préexistant, son CRUD, les cours, les quiz, les exercices, la progression, l’authentification et les politiques RLS n’ont pas été reconstruits.

## Source de configuration

Les valeurs A1/A2 intégrées ont été fournies explicitement dans la Commande 10.1 et sont tracées dans l’administration avec cette référence. Elles ne reposent pas sur l’ancien lien DPFC qui avait été constaté non exploitable dans la commande précédente.

## Référence

[1] [Commande 10.1 — Coefficients Terminale A1/A2 + calcul pondéré des notes](../upload/pasted_content_21.txt)
