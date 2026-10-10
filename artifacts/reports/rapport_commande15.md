# Rapport final — Commande 15

**Projet :** EduTech School  
**Périmètre :** finalisation du niveau Première, SVT C/D et Bulletin scolaire  
**Année de configuration :** 2026-2027  
**Statut :** validé techniquement

## Synthèse

La Commande 15 finalise la préparation du niveau Première sans modifier les structures Terminale, les coefficients Terminale, ni les modules Quiz, Exercices, Mentor IA et Citations. Les structures de Sciences de la Vie et de la Terre ont été reconstruites exclusivement pour Première C et Première D. Les chapitres et leçons créés sont vides, inactifs et non publiés ; ils restent donc absents du catalogue élève jusqu’à une activation administrative explicite.

Les coefficients détaillés transmis pour Première A1, A2, C et D ont été conservés sans ajustement. La correction ultérieure confirme que les valeurs détaillées priment et que la LV2 représente **une seule matière choisie** : Allemand ou Espagnol, jamais les deux simultanément. Les totaux affichés sont ainsi calculés automatiquement à partir de la matrice enregistrée.

## Structures SVT C/D

| Série | Thèmes | Leçons | Contenu | Statut des leçons | Publication de l’offre |
|---|---:|---:|---|---|---|
| Première C | 6 | 11 | Vide | Inactif | Non publiée |
| Première D | 6 | 13 | Vide | Inactif | Non publiée |

Les anciennes structures SVT C/D étaient sans progression, quiz, exercice ou note élève dépendante. Les associations génériques SVT dupliquées C/D, vides et sans note, ont été supprimées ; seules les offres spécialisées **Sciences de la Vie et de la Terre (C)** et **Sciences de la Vie et de la Terre (D)** restent associées respectivement à leur série.

## Matrices de coefficients Première

### Première A1

| Matière | Coefficient |
|---|---:|
| Anglais | 4 |
| Arts plastiques | 1 |
| Éducation musicale | 1 |
| Éducation Physique et Sportive | 1 |
| Français | 4 |
| Histoire-Géographie | 3 |
| LV2 choisie : Allemand **ou** Espagnol | 3 |
| Mathématiques | 3 |
| Philosophie | 3 |
| Physique-Chimie | 1 |
| Sciences de la Vie et de la Terre | 1 |
| **Total recalculé** | **25** |

### Première A2

| Matière | Coefficient |
|---|---:|
| Anglais | 4 |
| Arts plastiques | 1 |
| Éducation musicale | 1 |
| Éducation Physique et Sportive | 1 |
| Français | 4 |
| Histoire-Géographie | 3 |
| LV2 choisie : Allemand **ou** Espagnol | 3 |
| Mathématiques | 2 |
| Philosophie | 3 |
| Physique-Chimie | 1 |
| Sciences de la Vie et de la Terre | 1 |
| **Total recalculé** | **24** |

### Première C

| Matière | Coefficient |
|---|---:|
| Anglais | 2 |
| Français | 3 |
| Histoire-Géographie | 2 |
| LV2 choisie : Allemand **ou** Espagnol | 2 |
| Mathématiques | 5 |
| Philosophie | 2 |
| Physique-Chimie | 5 |
| Sciences de la Vie et de la Terre (C) | 2 |
| Éducation Physique et Sportive | 1 |
| **Total recalculé** | **24** |

### Première D

| Matière | Coefficient |
|---|---:|
| Anglais | 2 |
| Français | 3 |
| Histoire-Géographie | 2 |
| LV2 choisie : Allemand **ou** Espagnol | 2 |
| Mathématiques | 4 |
| Philosophie | 2 |
| Physique-Chimie | 4 |
| Sciences de la Vie et de la Terre (D) | 4 |
| Éducation Physique et Sportive | 1 |
| **Total recalculé** | **24** |

## Intégration Bulletin

La table `edutech_coefficients` comporte désormais un champ `school_year`. Les nouveaux coefficients Première sont enregistrés pour **2026-2027**, tandis que les configurations Terminale existantes restent historiques, avec une année nulle. L’unicité est appliquée par couple offre–année pour les configurations annuelles et séparément pour les lignes historiques, ce qui permet de conserver les données validées sans les écraser.

Le Bulletin consulte d’abord un coefficient vérifié correspondant exactement à l’année scolaire sélectionnée, au niveau, à la série et à la matière de l’élève. En l’absence de configuration annuelle, il conserve le repli sur le coefficient historique Terminale. Le cache local conserve aussi les coefficients par année scolaire. Le coefficient de matière demeure automatique et visible en lecture seule ; le coefficient d’évaluation reste saisi librement par l’élève et ne sert qu’au calcul de la moyenne de matière.

La moyenne trimestrielle n’inclut que les matières effectivement évaluées avec un coefficient vérifié. Une matière sans note conserve l’état **« Non évalué »** et n’est jamais transformée en zéro. La protection de la LV2 limite le calcul à une seule langue facultative même si les deux offres existent dans le catalogue.

## Contrôles effectués

| Contrôle | Résultat |
|---|---|
| SVT Première C | 6 thèmes, 11 leçons, 0 contenu, 0 leçon active |
| SVT Première D | 6 thèmes, 13 leçons, 0 contenu, 0 leçon active |
| Coefficients A1 | 12 lignes techniques, une seule LV2 comptée, total 25 |
| Coefficients A2 | 12 lignes techniques, une seule LV2 comptée, total 24 |
| Coefficients C | 10 lignes techniques, une seule LV2 comptée, total 24 |
| Coefficients D | 10 lignes techniques, une seule LV2 comptée, total 24 |
| Doublons annuels Première | Aucun |
| Coefficients Terminale historiques | Conservés : A1 12, A2 12, C 11, D 11 |
| RLS Bulletins | Notes isolées par `student_id`; écriture limitée au profil correspondant à l’offre ; coefficients modifiables par administrateur seulement |
| Tests Vitest | 98 réussis, 1 ignoré |
| TypeScript | Réussi |
| Lint | Réussi |
| Export Android | Réussi |

## Limites connues

L’analyse de sécurité Supabase relève des avertissements préexistants sur des vues et fonctions `SECURITY DEFINER` hors du périmètre de cette commande. Aucune politique RLS des tables `edutech_grades` ou `edutech_coefficients` n’a été assouplie par cette livraison.
