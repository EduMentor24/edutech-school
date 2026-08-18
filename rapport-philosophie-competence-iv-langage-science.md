# Rapport — Philosophie Terminale : Compétence IV

**Projet :** EduTech School / Supabase EduMentor (`nnshioowwniursnozicg`)  
**Niveau :** Terminale, séries A1, A2, C et D  
**Documents sources :** deux PDF fournis et lus intégralement  
**Date de traitement :** 18 août 2026

## Périmètre confirmé

Les deux PDF ont été analysés intégralement, y compris les définitions, les explications, les auteurs, les démarches, les activités, les situations d’évaluation, les études de texte et les corrigés. La structure Supabase ne contenait, pour chacun des deux titres, qu’une variante existante : **« Étude d’œuvres »**. Son utilisation pour les quatre séries a été confirmée explicitement avant toute écriture.

| PDF source | Leçon confirmée | Séries | IDs des leçons |
|---|---|---|---|
| `PhiloTle_L9_LangageetVérité.PDF` | `Leçon 1 : Langage et vérité / ETUDE D’ŒUVRES` | A1, A2, C, D | A1 `6f0225cd-37bd-40b1-a724-81d1a3f559d9` ; A2 `6a25851a-22e4-4f8a-bfe9-2b5ca620ca54` ; C `7b216e2b-b10f-45be-90f9-f55bb92a1849` ; D `9d35557a-cbb0-4fd6-8e0b-21c8e68d059c` |
| `PhiloTle_L10_LaConnaissancescientifique.PDF` | `Leçon 2 : La connaissance scientifique / ETUDE D’ŒUVRES` | A1, A2, C, D | A1 `5ed46281-9e01-49fc-b040-5a9c04be470d` ; A2 `a3816920-f1ea-4f3c-a29a-aee9dcdbaa02` ; C `0cf780b6-fca8-46ed-bfdf-4b2c86809459` ; D `40e08dfd-1889-4965-aeeb-04dcdd3544d1` |

Toutes les cibles étaient vides, inactives et dépourvues d’exercice ou de quiz avant la création. Elles sont rattachées à **Philosophie → Terminale → série concernée → Compétence IV : conditions de la connaissance**.

## Contenus approfondis créés

Chaque leçon est structurée pour une lecture mobile : objectif, situation, sections progressives, définitions, tableaux, repères, encadrés méthodologiques et synthèse. Les cours expliquent, sans sortir du programme source, la différence entre communication animale et langage humain, les critères de vérité, le rapport entre mots et pensée, la démarche scientifique, la complémentarité de la théorie et de l’expérience, ainsi que les limites de la vérité scientifique et les enjeux bioéthiques.

| Ressource créée par leçon | Quantité par leçon | Total du lot |
|---|---:|---:|
| Cours premium dans `public.lessons.content` | 1 | 8 |
| Exercices corrigés dans `public.exercises` | 2 | 16 |
| Questions d’exercice dans `public.exercise_questions` | 10 | 80 |
| Quiz dans `public.quizzes` | 1 | 8 |
| Questions de quiz dans `public.quiz_questions` | 6 | 48 |

Les cours de langage et vérité contiennent chacun **7 968 caractères** ; les cours de connaissance scientifique contiennent chacun **8 529 caractères**. Les exercices progressent des définitions fondamentales vers l’analyse argumentée, tandis que les quiz évaluent la compréhension des notions et donnent une explication par question.

## Statuts et protection des données

| Élément | État contrôlé |
|---|---|
| Les 8 leçons | `is_active = false` |
| Les 16 exercices | `is_active = false`, `is_published = false` |
| Les 8 quiz | `is_active = false`, `is_published = false` |
| Données publiées existantes | Non modifiées |
| Variantes non confirmées ou absentes | Non créées et non modifiées |

La migration interrompt toute écriture si une leçon cible contient déjà du contenu. Elle interdit aussi les doublons de titre d’exercice ou de quiz pour une même leçon. Aucun rattachement à une année scolaire n’a été inventé : les tables `lessons`, `chapters` et `course_subject_offerings` ne portent pas de colonne d’année scolaire ; les ressources suivent donc strictement la hiérarchie pédagogique réelle.

## Validations réalisées

| Contrôle | Résultat |
|---|---|
| Lecture complète des deux PDF | Validée |
| Correspondance des huit leçons et confirmation des variantes | Validée |
| Contrôle après création : contenu, série, chapitre, exercices, quiz et statuts | Validé |
| TypeScript | Réussi |
| Lint | Réussi ; avertissement existant de type de module ESLint, non bloquant |
| Tests | 149 réussis, 1 ignoré |
| Export Android | Réussi |

## Décision administrative attendue

Les huit ensembles pédagogiques sont strictement des brouillons. Ils doivent être prévisualisés, revus puis activés et publiés manuellement par l’administrateur. Aucune publication ou activation automatique n’a été effectuée.
