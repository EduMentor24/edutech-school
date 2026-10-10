# Analyse des sources — Anglais Terminale, Unit 5 « Managing Resources »

## Périmètre reçu

Le lot contient deux PDF : **Reading for Comprehension** et **Writing**. Les contenus seront destinés aux quatre séries Terminale (A1, A2, C et D), en brouillons inactifs et non publiés. Le format établi pour les langues vivantes est maintenu : chaque explication, consigne, exemple, question, réponse et correction en anglais est immédiatement suivi de sa traduction française clairement identifiée.

## PDF Reading — éléments confirmés

Le contexte pédagogique indique que des élèves de Terminale A5 lisent un article sur des conflits sociaux liés à la terre pour préparer une présentation au club d’anglais. Le texte source est **« Who benefits the most from land grabbing? »**, adapté de *Far Ahead Terminale*.

| Élément | Contenu confirmé par le PDF |
|---|---|
| Structure grammaticale | Conditionnel : **If we had enough money, we would buy the land and farm it ourselves.** |
| Vocabulaire | *land grabbing, land rush, scarcity, meet the need of someone, evict, belong to, hunger, crops, feed, consent, address a problem*. |
| Texte | Crise économique de 2008, course à la terre, hausse des prix alimentaires, pression sur la sécurité alimentaire et achats de terres en Afrique. |
| Effets décrits | Monocultures destinées à l’exportation, expulsions de fermiers et familles, perte de terre, subsistance, emplois et nourriture ; faible contribution à la sécurité alimentaire locale. |
| Réponses possibles | Organisations paysannes, défense des droits humains, transparence, soutien à l’agriculture familiale, souveraineté alimentaire et investissement dans les agriculteurs et les terres agricoles. |
| Activités | Opinion de l’auteur, lexique en contexte, vrai/faux justifié par les lignes, intervention radiophonique sur la gestion des ressources foncières africaines. |
| Devoir agriculture | *subsistence, livestock, organic, dairy, fertilizer, industrialized, mechanized, biofuel, sustainable, monocultures* ; phrases à compléter sur les systèmes agricoles. |

### Précautions de reformulation

Les chiffres et cas cités dans le texte seront présentés comme appartenant à l’article adapté, sans les généraliser au-delà de la source. Les exercices développeront la compréhension, la preuve textuelle, les causes et conséquences, les points de vue et la communication responsable ; ils ne présenteront pas une opinion unique comme un fait absolu.

## PDF Writing — éléments confirmés par extraction locale

Le contexte place des élèves de Terminale A3 du Lycée Moderne Sipilou dans une discussion sur l’agriculture, afin d’écrire un article sur le système alimentaire durable.

| Élément | Contenu confirmé par le PDF |
|---|---|
| Compétence | **Writing an article** (rédiger un article). |
| Sujet de production | Concours d’écriture d’article organisé par le British Council : **How to make the food system sustainable**. |
| Attendus explicites | Donner une courte définition d’un système alimentaire durable ; citer des composantes de la durabilité ; expliquer comment ce système peut améliorer la vie des personnes. |
| Vocabulaire | *sustainable, processing, trade, policy, to waste, hunger, well-being, available*. |
| Travail lexical | Compléter des phrases sur la nutrition, la faim, la disponibilité et la qualité des aliments, l’agriculture durable, le gaspillage, les échanges et les politiques alimentaires. |

### Orientation Writing à développer

Le futur cours détaillera la différence entre un article et une lettre : titre clair, introduction informative, paragraphes organisés, connecteurs, registre adapté à un lectorat général, définition concise, développement des composantes et conclusion utile. Le modèle d’entraînement sera explicitement signalé comme original ; il n’inventera ni données chiffrées, ni politique institutionnelle, ni résultat de concours.

## Principes de traitement du lot

Le courseware distinguera strictement **Reading** et **Writing** à l’intérieur de la leçon Unit 5, puis créera des exercices et des quiz séparés. Les formulations seront reformulées et approfondies sans déformer les textes source. Les demandes d’opinion et de communication seront guidées avec un langage responsable : elles inviteront à justifier avec le texte, à distinguer les points de vue et à ne pas présenter une généralisation comme une vérité absolue.

## Lot bilingue créé et contrôlé

Les leçons Unit 5 étaient déjà présentes, vides et inactives, pour A1, C et D. L’offre A2 possédait le chapitre attendu mais pas la leçon ; celle-ci a été créée à l’ordre 50 uniquement, puis remplie avec le même brouillon bilingue. Les migrations ont été rendues robustes en évitant toute ambiguïté entre variables PL/pgSQL et colonnes `chapter_id` ou `lesson_id`, puis elles ont été appliquées transactionnellement sans écraser de contenu.

| Série | Contenu bilingue | Exercices brouillons | Questions d’exercice | Quiz brouillons | Questions de quiz | Réponses de quiz |
|---|---:|---:|---:|---:|---:|---:|
| A1 | 19 522 caractères | 2 | 8 | 2 | 8 | 24 |
| A2 | 19 522 caractères | 2 | 8 | 2 | 8 | 24 |
| C | 19 522 caractères | 2 | 8 | 2 | 8 | 24 |
| D | 19 522 caractères | 2 | 8 | 2 | 8 | 24 |
| **Total** | — | **8** | **32** | **8** | **32** | **96** |

Chaque leçon comprend le marqueur de traduction française immédiate, le second conditionnel, le Reading sur l’accaparement des terres et une méthode d’article approfondie sur le système alimentaire durable. Toutes les leçons restent inactives ; tous les exercices et quiz restent inactifs et non publiés.

## Validation finale

| Contrôle | Résultat |
|---|---|
| Tests ciblés Unit 5 | 4 réussis |
| TypeScript | Réussi (`pnpm check`) |
| Lint | Réussi (`pnpm lint`) |
| Suite complète | 269 réussis, 1 ignoré (`pnpm test`) |
| Export Android | Réussi, journal confirmé par `Exported: dist` |
| Audit Supabase post-migration | 4 leçons confirmées avec statuts brouillon, traductions, 8 exercices, 8 quiz et 96 réponses au total |
