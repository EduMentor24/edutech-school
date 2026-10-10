# Rapport de structuration — Philosophie Terminale A1

**Étape :** 6.1 — structuration du programme officiel  
**Profil cible :** `school_level = Terminale`, `series = A1`, `subject = Philosophie`  
**État de la structure créée :** brouillon, inactive et non visible aux élèves  
**Date :** 13 août 2026

## Source prioritaire et périmètre

La structure initiale repose exclusivement sur le document officiel **« PHILOSOPHIE PROGRESSION ANNUELLE : TERMINALES A1-A2 (08H/SEMAINE) »**, année scolaire **2025-2026**, émis par la DPFC / Coordination nationale de Philosophie. [1]

Le document est prévu pour les Terminales A1-A2 ; l’import réalisé dans cette étape est limité au profil **Terminale A1**. Aucune association Terminale A2 n’a été modifiée. La copie du PDF de référence est conservée dans `reference/dpfc-philosophie-tles-a1-a2-2025-2026.pdf`.

> Cette étape ne rédige aucun cours. Les onze leçons créées contiennent un champ `content` vide et ne sont pas publiées.

## Tableau de vérification source–Supabase

| Ordre | Compétence officielle | Leçons officielles créées | Source | Créé dans Supabase |
|---:|---|---|---|---|
| 100 | `COMPETENCE I : Traiter une situation relative à la rédaction de la dissertation et du commentaire de texte philosophiques.` | `Leçon 1 La dissertation philosophique` ; `Leçon 2 : Le commentaire de texte philosophique` | Premier trimestre, septembre 2025 ; durée 24 H ; semaines 1–2, 08 H par semaine | Oui : chapitre inactif et 2 leçons inactives, contenu vide |
| 200 | `COMPETENCE II : Traiter une situation relative aux conditions de l’homme dans la société` | `Leçon 1 : La connaissance de l’homme` ; `Leçon 2 : La vie en société` ; `Leçon 3 : Dieu et la religion` | Premier trimestre, septembre–novembre 2025 ; durée 56 H ; semaines 4–9, 08 H par semaine | Oui : chapitre inactif et 3 leçons inactives, contenu vide |
| 300 | `COMPETENCE III : Traiter une situation relative aux conditions d’épanouissement de l’homme` | `Leçon 1 : L’histoire et l’humanité` ; `Leçon 2 : La valeur de la philosophie/ QUESTION AU CHOIX` ; `Leçon 3 : Progrès et bonheur/ QUESTION AU CHOIX` ; `Leçon 3 : Progrès et bonheur/ ETUDE D’OEUVRES` | Deuxième trimestre, décembre 2025–février 2026 ; durée 88 H ; semaines 11–21, 08 H par semaine | Oui : chapitre inactif et 4 leçons inactives, contenu vide |
| 400 | `COMPETENCE IV : Traiter une situation relative aux conditions de la connaissance` | `Leçon 1 : Langage et vérité/ ETUDE D’OEUVRES` ; `Leçon 2 : La connaissance scientifique/ ETUDE D’OEUVRES` | Troisième trimestre, mars–mai 2026 ; durée 72 H ; semaines 22–30, 08 H par semaine | Oui : chapitre inactif et 2 leçons inactives, contenu vide |

L’audit final confirme donc **4 chapitres officiels**, **11 leçons officielles**, **4 chapitres inactifs** et **11 leçons inactives avec contenu vide**. Les `display_order` sont 100, 200, 300 et 400 pour les compétences, puis croissants à l’intérieur de chacune.

## Volumes, périodes et mentions spéciales

Le PDF indique **08 H/semaine**, une durée totale de **240 H**, ainsi que les durées de compétence de 24 H, 56 H, 88 H et 72 H. Les périodes, semaines et volumes de chaque leçon sont consignés dans les descriptions de planification et dans `philosophie-terminale-a1-structure-officielle.md`. Ces volumes ne sont pas transformés en durée de lecture numérique.

`Remédiation/Régulation` apparaît après les semaines 3 et 10. Elle est documentée dans la planification des compétences I et II, mais n’est pas créée comme leçon : le schéma actuel ne la représente pas de manière distincte et la convertir en cours serait inexact.

Les mentions `QUESTION AU CHOIX` et `ETUDE D’OEUVRES` sont conservées exactement dans les titres concernés. Le document demande de préciser la question, l’auteur et le titre de l’œuvre, mais ne les fournit pas. Ces éléments restent donc : **« Information non déterminée par la source officielle consultée »**. Aucun auteur, œuvre ou question n’a été inventé.

## Traçabilité et éléments volontairement non créés

Les tables existantes ne comportent pas de colonnes dédiées `source_document`, `source_year` ou `source_section`. Aucune migration structurelle n’a été ajoutée, conformément au principe de ne pas refactorer inutilement la base. La source, l’année et la planification sont conservées dans les descriptions brèves des enregistrements, dans la documentation d’extraction et dans la copie locale du PDF.

| Élément | Décision |
|---|---|
| Explications de cours, définitions, exemples, dissertations, exercices, quiz et résumés | Non créés. |
| Questions au choix concrètes | Non créées ; absentes du document consulté. |
| Auteurs et titres d’œuvres | Non créés ; absents du document consulté. |
| Remédiation/Régulation et congés | Documentés comme planification ; non créés comme leçons. |
| Publication élève des compétences et leçons officielles | Non effectuée ; les 4 chapitres et 11 leçons restent inactifs. |

## Contenu de test et validation administrateur

Le parcours existant `Chapitre de test → Leçon de test` est resté distinct du programme officiel et n’a été ni renommé ni supprimé. Lors du cycle CRUD temporaire demandé, sa leçon a été rendue inactive par inadvertance. L’audit l’a détecté et une restauration ciblée a rétabli le chapitre et la leçon de test à leur état actif initial. La vérification finale confirme **1 chapitre de test** et **1 leçon de test** conservés.

Le compte administrateur réel a confirmé que les quatre compétences, les compteurs 2/3/4/2, les ordres et les états brouillon sont conformes dans l’espace Administration.

## Rapport CRUD réel

Le test a utilisé exclusivement `Chapitre test CRUD temporaire — à supprimer` et `Leçon test CRUD temporaire — à supprimer`, sans toucher aux données officielles ni au parcours de test existant.

| Contrôle | Résultat réel |
|---|---|
| Création | Réussie. |
| Modification du titre et du contenu | Réussie. |
| Réorganisation par ordre | Réussie. |
| Désactivation et disparition côté élève | Réussie. |
| Réactivation et réapparition côté élève | Réussie. |
| Suppression sécurisée avec confirmation | Réussie. |
| Nettoyage des données temporaires | Réussi : 0 chapitre et 0 leçon CRUD résiduels à l’audit final. |
| Visibilité élève du parcours de test restauré | Réussie : 1 chapitre et 1 leçon visibles sous RLS. |
| Protection RLS élève | Réussie : 0 modification et 0 suppression sur une leçon officielle lors du test non destructif. |

## Contrôles techniques

| Contrôle | Résultat |
|---|---|
| RLS de lecture | Les 11 brouillons officiels sont invisibles au profil élève Terminale A1 ; seul le parcours de test actif est visible. |
| RLS d’écriture | Une tentative élève de modification et de suppression d’une leçon officielle a affecté 0 ligne, dans une transaction annulée. |
| TypeScript | Validé. |
| Lint | Validé. |
| Tests Vitest | Validés : 20 tests actifs réussis, 1 test explicitement ignoré. |
| Export Android Expo | Validé. |

## Arrêt de l’étape

La structuration est terminée. Aucun contenu pédagogique n’a été généré ni publié. La prochaine étape devra commencer seulement après validation explicite de l’administrateur ; elle pourra traiter, de manière séparée, la publication contrôlée ou la rédaction pédagogique d’une leçon validée.

## Référence

[1] [DPFC / Coordination nationale de Philosophie — *PHILOSOPHIE PROGRESSION ANNUELLE : TERMINALES A1-A2 (08H/SEMAINE)*, 2025-2026](https://dpfc-ci.net/dpfc/2026/progressions/PHILOSOPHIE%20PROGRESSIONS%20Tles%20A1-A2%202025-2026.pdf)
