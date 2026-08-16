# Commande 13 — Plan d’import Première A1 et A2

## Règles d’import

Les offres matière déjà présentes sont conservées. L’import ajoute uniquement des chapitres et leçons **sans contenu**, avec `is_active = false`, `is_test_data = false` et sans exercice, quiz, coefficient, note, profil, progression ou contenu Terminale. Les intitulés proviennent des progressions DPFC documentées dans `commande13-premiere-a1-a2-sources.md`.

Chaque structure applicable à « Première A » ou « Première A1-A2 » est répliquée séparément pour les séries A1 et A2 afin que le filtrage existant par profil réel reste exact. Aucun chapitre de Première C, D ou Terminale n’est réutilisé.

| Matière | Portée officielle | Chapitres par série | Leçons par série | Chapitres A1+A2 | Leçons A1+A2 |
|---|---:|---:|---:|---:|---:|
| Anglais | Première A | 1 | 10 | 2 | 20 |
| Français | Première A | 3 | 14 | 6 | 28 |
| Mathématiques | 1re A1 / 1re A2 | 3 | 7 | 6 | 14 |
| Philosophie | Premières A1-A2 | 3 | 10 | 6 | 20 |
| Espagnol | Première | 1 | 6 | 2 | 12 |
| Physique-Chimie | Première A | 4 | 15 | 8 | 30 |
| SVT | Première A | 4 | 9 | 8 | 18 |
| **Total** |  |  |  | **38** | **142** |

## Matières non importées

Histoire-Géographie, Arts plastiques, Allemand, Éducation musicale, EPS et TICE restent sans structure ajoutée dans cette commande : aucun document DPFC accessible n’a encore établi une progression Première A1/A2 exploitable pour elles. Les associations déjà existantes sont laissées intactes.

## Garantie anti-doublon

Chaque création cible une offre existante identifiée par le triplet réel `niveau = Première`, `série = A1/A2`, `matière = nom existant`. Les chapitres sont créés seulement si aucun chapitre de même titre n’existe déjà pour l’offre. Les leçons sont créées seulement si aucun titre identique n’existe déjà dans leur chapitre cible.
