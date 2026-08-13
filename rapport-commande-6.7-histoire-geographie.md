# Rapport final — Commande 6.7, Histoire-Géographie Terminale A1 et A2

**Date de contrôle :** 13 août 2026  
**Source de référence :** programme fourni intégralement par l’administrateur dans la commande 6.7.  
**Périmètre :** `Terminale A1 → Histoire-Géographie` et `Terminale A2 → Histoire-Géographie` uniquement.

## Résultat de la structuration

Les deux associations Histoire-Géographie Terminale A1 et Terminale A2 existaient déjà, étaient publiées, et ne comportaient aucun chapitre ni aucune leçon avant l’intervention. Elles ont été complétées sans modifier leurs associations ni toute autre matière. L’import a créé **14 chapitres** et **40 leçons**, soit la même structure officielle pour les deux séries.

> Les intitulés proviennent exclusivement du programme fourni par l’administrateur. Aucun cours, résumé, exemple, exercice, quiz ou définition pédagogique n’a été ajouté.

| Série | Chapitres / parties / thèmes créés | Leçons créées | Total vérifié | Doublons de chapitres | Doublons de leçons |
|---|---:|---:|---:|---:|---:|
| Terminale A1 | 7 | 20 | 20 | 0 | 0 |
| Terminale A2 | 7 | 20 | 20 | 0 | 0 |

## Répartition vérifiée par série

| Ensemble | Chapitre / partie représenté dans le schéma existant | Nombre de leçons |
|---|---|---:|
| Méthodologie | `PREMIÈRE PARTIE — NOTIONS DE MÉTHODOLOGIE` | 2 |
| Histoire | `THÈME 1 — LES RELATIONS INTERNATIONALES DE 1945 À NOS JOURS` ; `THÈME 2 — DE LA DÉCOLONISATION AUX EFFORTS D’ORGANISATION DE L’AFRIQUE` ; `THÈME 3 — CROYANCES ET VALEURS DANS LE MONDE D’AUJOURD’HUI` | 9 |
| Géographie | `THÈME 1 — LA CÔTE D’IVOIRE : ÉTUDE ÉCONOMIQUE` ; `THÈME 2 — LA CORÉE DU SUD : UN EXEMPLE DE PAYS ÉMERGENT` ; `THÈME 3 — REGROUPEMENT ET COOPÉRATION ÉCONOMIQUE` | 9 |
| **Total** | **7 chapitres/parties/thèmes** | **20** |

Le schéma actuel étant `offre de matière → chapitre → leçon`, les parties et thèmes sont représentés dans `chapters`. La discipline est préservée dans la description technique de chaque chapitre (`Discipline : Histoire` ou `Discipline : Géographie`), sans nouvelle table ni modification de titre. Le détail exhaustif des titres et de leur ordre est disponible dans [`commande67-histoire-geographie-decisions.md`](./commande67-histoire-geographie-decisions.md).

## Brouillons, visibilité et RLS

Les **14 chapitres** et les **40 leçons** nouvellement créés possèdent `is_active = false`. Les 40 leçons ont un contenu vide, aucun contenu actif et aucune donnée de test associée.

| Contrôle de sécurité | Résultat |
|---|---|
| Lecture élève des chapitres | La politique RLS exige un chapitre actif, une offre publiée, une matière active et une cible niveau/série autorisée. |
| Lecture élève des leçons | La politique RLS exige en plus une leçon active et un chapitre actif. |
| Écriture dans les structures de cours | Réservée au rôle administrateur via `is_edutech_admin()`. |
| Visibilité des nouvelles structures | Inaccessibles aux élèves tant que les brouillons restent inactifs. |

## Données existantes conservées

Le contrôle post-import confirme que les données hors périmètre sont intactes.

| Élément protégé | État après import |
|---|---|
| Mathématiques Terminale A1 | Inchangée : 1 chapitre et 8 leçons. |
| Philosophie Terminale A1 | Inchangée : 5 chapitres et 12 leçons ; la leçon pilote est conservée. |
| Associations niveau-série-matière existantes | Aucune création, suppression ou modification. |
| Autres matières, niveaux et séries | Aucune structure modifiée. |

## Validations techniques

| Commande | Résultat |
|---|---|
| `pnpm check` | Réussi, sans erreur TypeScript. |
| `pnpm lint` | Réussi. L’avertissement Node relatif au type de module ESLint est informatif, sans erreur de lint. |
| `pnpm test` | Réussi : **22 tests actifs** validés et **1 test ignoré**. |
| `npx expo export --platform android` | Réussi ; bundle Android exporté dans `dist`. |

## Conclusion

La commande 6.7 est complète : Histoire-Géographie Terminale A1 et A2 comporte désormais les **20 leçons attendues par série**, avec la répartition officielle `2 méthodologie + 9 histoire + 9 géographie`. Les titres, l’ordre, les statuts de brouillon, l’absence de contenu, les protections RLS et l’absence de doublon ont fait l’objet d’un contrôle réel.
