# Rapport de validation — Leçon pilote de Philosophie Terminale A1

**Étape :** 6.2 — création d’une seule leçon pédagogique pilote  
**Profil cible :** `Terminale` / `A1` / `Philosophie`  
**Statut final :** brouillon, inactive, non visible dans le parcours élève  
**Date de validation :** 13 août 2026

## Objet et périmètre respecté

La seule leçon enrichie est **`Leçon 1 La dissertation philosophique`**, dans le chapitre officiel **`COMPETENCE I : Traiter une situation relative à la rédaction de la dissertation et du commentaire de texte philosophiques.`** Son titre exact, son ordre `10`, son rattachement et son statut `is_active = false` ont été préservés.

Cette étape ne crée ni nouvelle matière, ni nouveau chapitre, ni nouvelle leçon, ni quiz, ni exercice. Elle renseigne uniquement le champ `content` de cette leçon pilote avec un Markdown pédagogique structuré. Les dix autres leçons officielles de Philosophie Terminale A1 demeurent vides et inactives.

| Contrôle de périmètre Supabase | Résultat final |
|---|---:|
| Leçons officielles Terminale A1 Philosophie | 11 |
| Leçons officielles avec contenu pédagogique | 1 |
| Leçons officielles encore vides | 10 |
| Leçons officielles inactives | 11 |
| Leçon pilote visible au profil élève sous RLS | 0 |

## Sources et attribution rigoureuse

La progression annuelle DPFC 2025-2026 identifie explicitement la première leçon, son appartenance à la compétence I, son placement initial dans la progression et son volume de 08 H. [1] Le contenu pédagogique n’est pas présenté comme une transcription officielle : il s’agit d’une explication originale EduTech School, encadrée par ce titre et ce contexte.

Le support DPFC de philosophie pour la formation privée, daté de 2019, fournit un repère méthodologique complémentaire. Dans sa partie sur l’essai de problématisation, il mentionne l’étude des mots essentiels, leur définition, la reformulation du sujet, la formulation du problème, l’organisation des axes d’analyse, puis l’introduction et la conclusion. [2] Cette ressource est explicitement signalée comme **appui méthodologique daté**, distinct de la progression 2025-2026.

> Les descriptions de source enregistrées dans Supabase précisent le document, l’année, la section et le statut éditorial. Aucune phrase n’est attribuée à la DPFC au-delà des éléments réellement vérifiés.

## Structure pédagogique réellement enregistrée

| Section Markdown | Contenu pédagogique | Statut documentaire |
|---|---|---|
| Introduction | Sens de la dissertation comme exercice d’analyse et d’argumentation ; distinction entre opinion immédiate et problème philosophique. | Explication originale EduTech School. |
| Objectifs | Distinguer thème, question et problème ; analyser les notions ; formuler une problématique ; construire une démonstration ; évaluer une réponse. | Alignement pédagogique avec les repères méthodologiques vérifiés. [2] |
| I. Comprendre la dissertation | Thèse, justification, passage du sujet au problème et exemple de travail sur une question de vérité. | Explication originale. |
| II. Construire une analyse | Précision des notions, problématique, organisation raisonnée des axes et mise en garde contre le plan mécanique. | Explication originale, appuyée par la démarche de problématisation. [2] |
| III. Rédiger une démonstration | Rôle de l’introduction, du développement, des transitions et de la conclusion. | Explication originale ; l’appui DPFC 2019 est cité lorsque l’introduction et la conclusion sont évoquées. [2] |
| Synthèse et « À retenir » | Récapitulation des définitions et du raisonnement attendu. | Explication originale. |
| Références de cadrage | Les deux documents DPFC vérifiés, avec indication de leur portée. | Sources contrôlées. [1] [2] |

Le contenu évite toute citation directe non vérifiée. Il ne donne aucun auteur, aucune œuvre, aucun sujet d’examen réel ni aucune question officielle qui ne seraient déterminés par la source.

## Rendu Markdown et administration

Le lecteur mobile utilisait auparavant un bloc de texte simple. Un renderer Markdown limité et sécurisé a été ajouté. Il interprète les sous-titres, paragraphes, listes, tableaux, séparateurs et encadrés `>` ; il ne rend ni HTML ni script. Les liens Markdown sont affichés sous une forme textuelle lisible, sans exécuter de contenu externe.

L’éditeur Administration conserve le Markdown tel qu’il est saisi. Son champ est désormais libellé **« Contenu Markdown »** et explique la syntaxe reconnue. Une action **« Prévisualiser le rendu »** ouvre le lecteur réel même lorsque l’administrateur travaille sur une leçon inactive ; cette prévisualisation ne publie pas la leçon.

## Validation manuelle réelle

Le compte administrateur réel a validé les contrôles suivants : le titre officiel est inchangé, le statut reste inactif, les métadonnées de source sont présentes, et le rendu affiche correctement titres, listes, tableaux et encadrés sans marqueurs Markdown bruts. Une modification temporaire a été enregistrée, rechargée, puis restaurée et rechargée avec succès. Aucune autre leçon n’a été modifiée et aucune publication n’a été effectuée.

## Sécurité et régressions

| Contrôle | Résultat |
|---|---|
| Lecture de la leçon pilote par le profil étudiant réel | Refusée sous RLS : 0 ligne visible. |
| Tentative de modification étudiante, en transaction annulée | 0 ligne affectée. |
| Tentative de suppression étudiante, en transaction annulée | 0 ligne affectée. |
| Visibilité de la leçon pilote | Maintenue inactive ; aucune publication automatique. |
| TypeScript | Validé. |
| Lint Expo | Validé. |
| Tests Vitest | 22 tests actifs réussis ; 1 test explicitement ignoré. |
| Tests du parser Markdown | Validés : titres, listes, encadrés et tableaux. |
| Export Android Expo | Validé. |

## Éléments préservés et limites

Le parcours de test existant demeure séparé du programme officiel. Une matière de test inactive, avec son chapitre et sa leçon correspondants, a été détectée dans le catalogue hors du périmètre Philosophie officiel ; elle n’a pas été modifiée ni supprimée, car aucune instruction spécifique n’autorisait une action sur cet élément.

La leçon pilote est prête à être relue dans l’administration, mais reste invisible aux élèves. La prochaine étape ne doit débuter qu’après instruction explicite ; elle pourrait consister soit à publier cette leçon de manière contrôlée, soit à créer une autre leçon avec la même exigence de source et de validation.

## Références

[1] [DPFC / Coordination nationale de Philosophie — *PHILOSOPHIE PROGRESSION ANNUELLE : TERMINALES A1-A2 (08H/SEMAINE)*, 2025-2026](https://dpfc-ci.net/dpfc/2026/progressions/PHILOSOPHIE%20PROGRESSIONS%20Tles%20A1-A2%202025-2026.pdf)

[2] [DPFC — *Supports Formation Privé 2019 — Philosophie*](https://dpfc-ci.net/wp-content/uploads/dpfc_fichiers/2019-2020/sec/Supports%20Formation%20Priv%C3%A9%202019_Philosophie.pdf)
