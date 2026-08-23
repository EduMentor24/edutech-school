# Progression proposée — Initiation à l’informatique en Terminale

## Statut pédagogique

Cette progression est un **parcours complémentaire d’initiation**, créé pour EduTech School à la demande de l’administrateur. Elle ne se présente pas comme le programme officiel de la Côte d’Ivoire, ne remplace aucun enseignement officiel et pourra être enrichie ou réordonnée après validation pédagogique.

## Principes de conception

La progression s’inspire de domaines largement reconnus de la culture numérique : maîtrise des informations et des données, communication et collaboration, création de contenu numérique, sécurité, résolution de problèmes, utilisation des appareils et logiciels [1]. Elle adopte également une approche centrée sur l’humain, l’esprit critique, l’éthique et l’usage responsable des technologies [2] [3]. Ces références sont des repères de conception ; elles ne transforment pas ce parcours en programme national.

| Étape | Chapitre proposé | Première leçon ou compétence | Finalité pour l’élève |
|---|---|---|---|
| 1 | **Fondations du numérique et citoyenneté responsable** | **Comprendre son environnement numérique, ses données et ses choix** | Identifier appareil, système, application, fichier, donnée et service en ligne ; adopter les premières habitudes de sécurité et d’esprit critique. |
| 2 | **Organiser, rechercher et communiquer** | Fichiers, dossiers, recherche d’information et collaboration | Organiser un travail scolaire, distinguer source et contenu, communiquer avec respect. |
| 3 | **Sécurité, identité et protection de l’information** | Mots de passe, confidentialité, hameçonnage et traces numériques | Réduire les risques courants sans donner de consigne technique dangereuse. |
| 4 | **Penser de manière algorithmique** | Instructions, décomposition, conditions et erreurs | Résoudre une tâche par étapes claires avant tout langage de programmation. |
| 5 | **Créer avec le code et les données** | Variables, données simples, automatisation et vérification | Découvrir comment un programme transforme des entrées en résultats. |
| 6 | **Technologies émergentes et usage responsable de l’IA** | Limites, vérification, confidentialité et rôle humain | Utiliser les outils numériques et l’IA avec discernement, sans confondre une réponse générée avec une vérité établie. |

## Premier lot retenu

Le premier lot commencera par la leçon **« Comprendre son environnement numérique, ses données et ses choix responsables »**. Elle est commune à A1, A2, C et D, car elle ne suppose ni équipement particulier ni prérequis de programmation. Elle donnera une base immédiatement utile pour les cours, les démarches administratives, la communication et la suite de la progression :

1. distinguer matériel, système d’exploitation, application et service en ligne ;
2. reconnaître qu’un fichier et une donnée doivent être organisés et protégés ;
3. identifier une information sensible et appliquer des gestes simples de prudence ;
4. examiner la fiabilité d’un contenu avant de le partager ;
5. comprendre qu’une technologie, y compris l’IA, assiste une décision humaine mais ne la remplace pas ;
6. décomposer une tâche courante en consignes précises, première étape vers la pensée algorithmique.

Les futurs cours éviteront les procédures de contournement de sécurité, les manipulations de comptes ou les données personnelles réelles. Les exemples resteront scolaires, fictifs et explicitement présentés comme tels.

## Audit de rattachement — 23 août 2026

L’audit Supabase en lecture seule confirme que la matière active **« Informatique / TICE »** possède une offre Terminale officielle pour chacune des quatre séries, sans données de test : A1 (`0beafff1-63db-42c9-99a2-8ef6da799f19`), A2 (`7680fb4a-c9d4-41df-92f3-a91effda4944`), C (`7695b4cf-0524-4de4-af91-f8d79eed2b0a`) et D (`f9c030a4-8b30-4657-b7bb-d81e4e500635`). Aucun chapitre ni aucune leçon Informatique / TICE n’est actuellement rattaché à ces offres.

La création du premier lot doit donc ajouter, dans chacune des quatre offres, le chapitre commun **« Fondations du numérique et citoyenneté responsable »** en première position, puis la leçon commune **« Comprendre son environnement numérique, ses données et ses choix responsables »**. Les quatre leçons doivent être inactives ; les exercices et quiz associés doivent être inactifs et non publiés.

## Bilan d’intégration et validation — 23 août 2026

La migration atomique a été appliquée avec succès sur le projet officiel **EduMentor**. Elle a créé un chapitre et une leçon communs pour chacune des séries A1, A2, C et D, sans modifier de contenu existant. Chaque leçon contient **13 285 caractères** de contenu pédagogique original, explicitement identifié comme un parcours d’initiation complémentaire non officiel.

| Ressource créée | Par série | Total sur A1, A2, C et D | État contrôlé |
|---|---:|---:|---|
| Chapitres | 1 | 4 | Inactifs, non test. |
| Leçons | 1 | 4 | Inactives, non test. |
| Exercices corrigés | 2 | 8 | Inactifs et non publiés. |
| Questions d’exercice | 8 | 32 | Rattachées aux exercices concernés. |
| Quiz | 2 | 8 | Inactifs et non publiés. |
| Questions de quiz | 8 | 32 | Rattachées aux quiz concernés. |
| Réponses de quiz | 24 | 96 | Trois options par question, avec correction. |

L’audit post-migration ne relève **aucune anomalie de statut** : aucune leçon, aucun exercice et aucun quiz de ce lot n’est actif ou publié. Les tables de contenus et de questions concernées gardent la RLS activée. Les validations locales ont réussi : TypeScript, lint, **274 tests réussis et 1 ignoré**, puis export Android terminé avec `Exported: dist`.

## Références de conception

[1] [UNESCO-UNEVOC, *Digital Literacy Global Framework*](https://connect.unevoc.unesco.org/home/Digital+Competence+Frameworks/lang=en/id=5) — sept domaines, incluant information et données, communication, création, sécurité, résolution de problèmes et opérations appareils/logiciels.

[2] [UNESCO, *AI and technologies in education*](https://www.unesco.org/en/digital-education) — priorité donnée à l’action humaine, à l’esprit critique et à l’éthique dans les technologies éducatives.

[3] [UNESCO, *AI competency frameworks for students and teachers*](https://www.unesco.org/en/articles/what-you-need-know-about-unescos-new-ai-competency-frameworks-students-and-teachers) — approche centrée sur l’humain, éthique, fondements, applications et résolution de problèmes.
