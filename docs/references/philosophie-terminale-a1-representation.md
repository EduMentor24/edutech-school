# Représentation retenue — Structure officielle Philosophie Terminale A1

## Décision de schéma

Les tables existantes `chapters` et `lessons` disposent déjà de `title`, `description`, `display_order`, `is_active` et `is_test_data`. Elles ne possèdent pas de champs dédiés `source_document`, `source_year`, `source_section`, `volume_horaire` ou `periode`.

Conformément au périmètre de structuration, aucune table ni colonne n’est ajoutée. La traçabilité complète est conservée dans `philosophie-terminale-a1-structure-officielle.md` et la copie locale du PDF DPFC. Les descriptions Supabase contiennent une note brève de provenance et de planification ; elles ne contiennent aucun contenu pédagogique rédigé.

## Règles d’insertion

| Élément officiel | Représentation retenue | État initial |
|---|---|---|
| Compétence I à IV | Un chapitre par compétence, avec l’intitulé exact | `is_active = false` |
| Leçon officielle | Une leçon par intitulé exact, y compris les mentions dans l’intitulé | `is_active = false`, `content = ''` |
| Remédiation/Régulation | Mention documentée dans la note de planification du chapitre ; aucune leçon créée | Non applicable |
| QUESTION AU CHOIX | Conservée exactement dans le titre concerné ; aucune question inventée | Brouillon |
| ETUDE D’OEUVRES | Conservée exactement dans le titre concerné ; aucun auteur ni titre d’œuvre inventé | Brouillon |
| Congés | Conservés seulement dans la documentation de planification | Non applicable |

## Ordre et isolation

Les chapitres officiels recevront les ordres 100, 200, 300 et 400. Les leçons de chaque compétence recevront des ordres croissants de 10. Ce décalage évite de modifier le contenu de test existant tout en conservant un ordre officiel stable à l’intérieur de la structure importée.

Le chapitre de test et la leçon de test existants restent inchangés, avec `is_test_data = true`. Ils ne portent aucun des intitulés DPFC et ne font donc pas partie de la structure officielle.
