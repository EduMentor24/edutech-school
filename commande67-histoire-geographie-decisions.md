# Décisions de structuration — Commande 6.7

**Périmètre :** Histoire-Géographie, Terminale A1 et Terminale A2 uniquement.  
**Source de référence :** programme intégral fourni par l’administrateur dans la commande 6.7. Aucune autre recherche ou source n’est utilisée.

## Audit avant création

Les deux offres `Terminale A1 → Histoire-Géographie` et `Terminale A2 → Histoire-Géographie` existent déjà et sont publiées. Elles ne contiennent aucun chapitre ni aucune leçon avant cette commande. Aucune association niveau-série-matière ne sera modifiée.

## Représentation dans le schéma existant

La base utilise actuellement la hiérarchie `offre de matière → chapitre → leçon`, sans table autonome pour les disciplines. Les **parties et thèmes** fournis deviennent donc les chapitres, en conservant exactement leurs titres. Le champ de description du chapitre contient uniquement la métadonnée `Discipline : Histoire` ou `Discipline : Géographie` pour préserver la distinction disciplinaire sans créer une table supplémentaire ni ajouter de contenu pédagogique.

Les structures sont créées deux fois, à l’identique, une fois pour A1 et une fois pour A2. Tous les chapitres et leçons auront `is_active = false`, `is_test_data = false` et des contenus vides.

## Chapitres et leçons à créer par série

| Ordre | Discipline | Chapitre / partie / thème exact | Leçons exactes | Nombre de leçons |
|---:|---|---|---|---:|
| 10 | Histoire | `PREMIÈRE PARTIE — NOTIONS DE MÉTHODOLOGIE` | `Leçon 1 — Les techniques du commentaire de deux documents` ; `Leçon 2 — Les techniques de la dissertation` | 2 |
| 20 | Histoire | `THÈME 1 — LES RELATIONS INTERNATIONALES DE 1945 À NOS JOURS` | `Leçon 1 — L’Organisation des Nations Unies (ONU)` ; `Leçon 2 — L’ère de la bipolarisation de 1947 à 1991` ; `Leçon 3 — De la fin de la guerre froide à un monde multipolaire` | 3 |
| 30 | Histoire | `THÈME 2 — DE LA DÉCOLONISATION AUX EFFORTS D’ORGANISATION DE L’AFRIQUE` | `Leçon 1 — La montée d’un nationalisme` ; `Leçon 2 — L’accession à l’indépendance de la Côte d’Ivoire` ; `Leçon 3 — L’indépendance de l’Algérie` ; `Leçon 4 — L’Union africaine (UA)` | 4 |
| 40 | Histoire | `THÈME 3 — CROYANCES ET VALEURS DANS LE MONDE D’AUJOURD’HUI` | `Leçon 1 — Croyances et valeurs dominantes dans le monde occidental` ; `Leçon 2 — Les mutations contemporaines de la civilisation négro-africaine` | 2 |
| 50 | Géographie | `THÈME 1 — LA CÔTE D’IVOIRE : ÉTUDE ÉCONOMIQUE` | `Leçon 1 — Les fondements du développement économique de la Côte d’Ivoire` ; `Leçon 2 — Les secteurs d’activité économique de la Côte d’Ivoire` ; `Leçon 3 — Les problèmes du développement économique de la Côte d’Ivoire` | 3 |
| 60 | Géographie | `THÈME 2 — LA CORÉE DU SUD : UN EXEMPLE DE PAYS ÉMERGENT` | `Leçon 1 — Les fondements du développement économique de la Corée du Sud` ; `Leçon 2 — La Corée du Sud : une puissance économique émergente` ; `Leçon 3 — Les fondements de l’économie de la France` ; `Leçon 4 — La France : une économie dominée par le tertiaire` | 4 |
| 70 | Géographie | `THÈME 3 — REGROUPEMENT ET COOPÉRATION ÉCONOMIQUE` | `Leçon 1 — La CEDEAO : une organisation régionale à caractère économique` ; `Leçon 2 — Les relations UE/ACP : un exemple de coopération Nord-Sud` | 2 |

| Répartition attendue par série | Nombre |
|---|---:|
| Méthodologie | 2 |
| Histoire, hors méthodologie | 9 |
| Géographie | 9 |
| **Total** | **20** |

## Éléments protégés

Mathématiques et Philosophie Terminale A1, la leçon pilote de philosophie, les structures des autres matières, toutes les associations existantes et les données de test sont exclus de toute insertion, mise à jour ou suppression dans cette commande.
