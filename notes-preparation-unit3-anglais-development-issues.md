# Préparation de structure — Anglais Terminale — Unit 3: Development Issues

## Fichiers uniques analysés

Deux fichiers uniques ont été reçus : un PDF **Reading for Comprehension** joint deux fois et un PDF **Writing an Article**. Le deuxième exemplaire du Reading est strictement considéré comme une copie ; il ne doit entraîner ni seconde leçon, ni second chapitre, ni doublon de contenu.

| Compétence visible | Intitulé confirmé | Source | Thème et futur rattachement pédagogique |
|---|---|---|---|
| Reading | Unit 3: Development Issues — Reading for Comprehension | Far Ahead Terminale, pages 32–33 | Mariage des enfants, causes et conséquences, droits humains et débat du Human Rights Club. |
| Writing | Unit 3: Development Issues — Writing an Article | PDF École numérique | Article sur un peuple autochtone dont le mode de vie est menacé. |

## Éléments utiles à la future intégration

Le PDF Reading situe des élèves de Terminale C du Lycée Moderne Adjamé Harris devant un texte sur les mariages d’enfants, leurs causes et leurs conséquences. Il prévoit l’idée générale, du vocabulaire contextualisé (*bride* est fourni comme exemple), des affirmations vrai/faux à justifier par les lignes et une discussion sur l’âge légal, la situation du mariage des enfants et les cas de mariage précoce.

Le PDF Writing demande un **article**, et non une lettre. Son plan confirme une introduction, une description du mode de vie traditionnel, les raisons pour lesquelles ce mode de vie est menacé, l’importance de sauvegarder les peuples autochtones, des solutions possibles et une conclusion. La production demandée fait 250 à 300 mots et doit présenter le groupe, son problème, sa culture, les menaces, l’importance de l’héritage et des moyens de protection.

Cette tâche limitée à la préparation ne crée encore aucun cours, exercice ou quiz. Elle servira uniquement à nommer et rattacher sans ambiguïté la structure Unit 3 lorsque l’ensemble des fichiers nécessaires et la création de contenu seront demandés.

## État de structure confirmé

L’audit a confirmé que les leçons Unit 3 existaient déjà, vides et inactives, en A1, C et D. Le chapitre A2 était disponible grâce à la préparation de l’Unit 1 mais ne possédait pas encore Unit 3. Une migration minimaliste a donc créé **uniquement** `UNIT 3 DEVELOPMENT ISSUES` dans le chapitre `PROGRESSION TERMINALE A` de la Terminale A2, à l’ordre 30, sans description, contenu, exercice ni quiz.

| Série | Chapitre | Leçon Unit 3 | Ordre | Active | Longueur de contenu | Exercices | Quiz |
|---|---|---|---:|---:|---:|---:|---:|
| A1 | PROGRESSION TERMINALE A | UNIT 3 DEVELOPMENT ISSUES | 30 | Non | 0 | 0 | 0 |
| A2 | PROGRESSION TERMINALE A | UNIT 3 DEVELOPMENT ISSUES | 30 | Non | 0 | 0 | 0 |
| C | PROGRESSIONS TERMINALES C ET D — Anglais | UNIT 3 DEVELOPMENT ISSUES | 30 | Non | 0 | 0 | 0 |
| D | PROGRESSIONS TERMINALES C ET D — Anglais | UNIT 3 DEVELOPMENT ISSUES | 30 | Non | 0 | 0 | 0 |

La structure est donc prête pour une future intégration bilingue des contenus Reading et Writing. Aucun contenu pédagogique n’a été créé à ce stade et le PDF Reading dupliqué n’a généré aucune ligne supplémentaire.

## Vérifications

Le test spécialisé de la migration a réussi. TypeScript, lint et la suite complète ont également été validés : **249 tests réussis, 1 ignoré**.

## Intégration bilingue complète — Reading et Writing

Après confirmation explicite de création, les quatre leçons Unit 3 ont reçu un cours bilingue complet couvrant les deux compétences reçues : Reading sur le mariage des enfants, les droits humains, l’idée générale, le vocabulaire en contexte et la preuve ; Writing sur l’article relatif à un mode de vie autochtone menacé. La méthode d’article est développée pas à pas : genre, plan en six parties, grille de préparation, banque linguistique, connecteurs, modèle d’entraînement clairement identifié et relecture finale.

| Série | Contenu bilingue | Exercices brouillons | Questions d’exercice | Quiz brouillons | Questions de quiz | Réponses de quiz |
|---|---:|---:|---:|---:|---:|---:|
| A1 | 24 366 caractères | 2 | 9 | 2 | 8 | 24 |
| A2 | 24 366 caractères | 2 | 9 | 2 | 8 | 24 |
| C | 24 366 caractères | 2 | 9 | 2 | 8 | 24 |
| D | 24 366 caractères | 2 | 9 | 2 | 8 | 24 |
| **Total** | — | **8** | **36** | **8** | **32** | **96** |

Tous les contenus du lot sont **inactifs**. Les exercices et quiz sont **non publiés**. Le contrôle post-migration confirme le marqueur de traduction française immédiate dans les quatre leçons. Le doublon du PDF Reading n’a pas entraîné de contenu ou de module supplémentaire.

## Validation finale du lot

| Contrôle | Résultat |
|---|---|
| Tests ciblés Unit 2 / structure Unit 3 / contenu Unit 3 | 11 réussis |
| TypeScript | Réussi (`pnpm check`) |
| Lint | Réussi (`pnpm lint`) |
| Suite complète | 253 réussis, 1 ignoré (`pnpm test`) |
| Export Android | Bundle généré avec succès ; le journal confirme `Exported: dist` |
