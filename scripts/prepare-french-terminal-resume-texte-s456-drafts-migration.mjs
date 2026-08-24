import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const migrationPath = resolve(root, "supabase/migrations/20260824_french_terminal_resume_texte_s456_drafts.sql");
const payloadPath = resolve(root, "supabase/migrations/20260824_french_terminal_resume_texte_s456_drafts.apply.json");
const offerings = ["57b5ca6e-6add-4c7a-98cd-5a99a0a46eb9", "f7fd326f-2e6f-4679-9982-7c40184b80e5", "cba5f18f-ed57-4288-936b-f40920335538", "44cb0105-3955-4038-9811-13ba83bcce8a"];
const sqlText = (value) => { const tag = "$resume_s456$"; if (value.includes(tag)) throw new Error("Délimiteur SQL présent dans le contenu."); return `${tag}${value}${tag}`; };
const jsonArray = (values) => `jsonb_build_array(${values.map(sqlText).join(",")})`;

const sessions = [
  {
    title: "Séance 4 : Identifier la situation d’argumentation, sélectionner et enchaîner les idées essentielles",
    order: 40,
    description: "Repérer stratégie argumentative, structure et idées essentielles, puis les relier avec le connecteur qui exprime leur relation réelle.",
    content: `# Résumé de texte argumentatif — Séance 4 : Situation d’argumentation, idées essentielles et enchaînement logique

## Objectif de la séance

Avant de réduire un texte, il faut comprendre **comment** l’auteur défend son point de vue. Cette séance prolonge le travail sur le thème, la thèse et la visée : elle apprend à repérer la stratégie argumentative, à isoler les idées qui font avancer le raisonnement puis à les relier sans trahir leur rapport logique.

> **Idée clé :** le résumé ne conserve pas tout. Il garde la progression du raisonnement : problème, causes, conséquences, objections éventuelles et solutions.

## 1. Situer l’argumentation avant de sélectionner

| Repère | Question à se poser | Ce qu’il apporte au résumé |
|---|---|---|
| **Thème** | De quel sujet général parle-t-on ? | Évite de sortir du sujet. |
| **Thèse** | Quelle idée l’auteur défend-il ? | Donne le fil directeur. |
| **Visée** | Que cherche-t-il à faire comprendre ou faire faire ? | Éclaire le ton et la conclusion. |
| **Stratégie** | Par quels procédés soutient-il son point de vue ? | Aide à repérer l’enchaînement. |

Dans le support sur l’immigration clandestine, le thème, la thèse et la visée sont déjà identifiés. La suite consiste à observer la façon dont l’auteur organise son raisonnement : il présente le phénomène et ses conséquences, en explique les causes, puis avance des pistes de solution.

## 2. Lire les indices de la stratégie argumentative

La stratégie argumentative est l’ensemble des moyens utilisés pour soutenir un point de vue ou réfuter un autre point de vue. Elle ne se réduit pas à un mot isolé. Observe plusieurs indices et demande-toi ce qu’ils font comprendre au lecteur.

| Indice | Exemple de rôle | Vigilance |
|---|---|---|
| **Indices de personne** | « nous » ou « on » peuvent inclure l’auteur et les destinataires ; un pronom peut désigner un groupe précis. | Identifie le référent avant de le remplacer. |
| **Indices temporels** | Les temps verbaux installent un constat, un bilan ou une perspective. | Ne change pas le système verbal sans raison. |
| **Modalisateurs** | Ils montrent une certitude, un doute, une nécessité ou une appréciation. | Ne supprime pas une nuance essentielle. |
| **Connecteurs** | Ils signalent opposition, addition, cause, conséquence ou concession. | Ne choisis jamais un connecteur au hasard. |

Le support associe notamment **mais** et **or** à une rupture ou une opposition, **de plus** à l’addition, **parce que** à la cause et **donc** à la conséquence. Ces repères servent à comprendre le texte avant d’écrire.

## 3. Dégager les séquences argumentatives

La structure est l’organisation du texte en mouvements d’idées. Pour la dégager, appuie-toi sur les paragraphes, les connecteurs et les changements de point de vue. Dans le modèle sur l’immigration, les trois séquences sont : le phénomène et ses conséquences ; les causes ; les propositions de solutions.

> **Méthode :** donne à chaque partie un titre bref formulé comme une idée. « Paragraphe 2 » n’est pas un titre de mouvement ; « Les causes de l’immigration clandestine » en est un.

## 4. Sélectionner les idées essentielles

Une idée essentielle est indispensable à la progression de la thèse. Elle exprime un constat, une cause, une conséquence, une objection ou une solution. Elle doit pouvoir être reformulée sans perdre le sens général du texte.

| À conserver | À écarter ou condenser selon le rôle | Pourquoi ? |
|---|---|---|
| Idée principale de chaque séquence | Exemple illustratif | L’exemple éclaire mais ne porte pas toujours l’argument. |
| Cause ou conséquence nécessaire | Digression, commentaire, parenthèse | Ces éléments ralentissent la progression. |
| Solution ou conclusion de l’auteur | Insistance, répétition, citation longue, expansion | Ils peuvent répéter ou détailler une idée déjà retenue. |

Ne coupe pas mécaniquement tout ce qui est long. Demande d’abord : « Si je retire cette proposition, le raisonnement de l’auteur reste-t-il compréhensible ? » Si la réponse est non, elle est probablement essentielle.

## 5. Enchaîner les idées avec justesse

Après la sélection, place les idées dans l’ordre du texte puis explicite leur relation. Le connecteur ne crée pas la logique : il la rend visible.

| Relation entre deux idées | Connecteurs possibles | Test de cohérence |
|---|---|---|
| Opposition ou limite | mais, cependant, toutefois | La seconde idée corrige-t-elle ou contraste-t-elle avec la première ? |
| Addition | de plus, en outre | Ajoute-t-elle un argument de même direction ? |
| Cause | parce que, puisque, étant donné que | Explique-t-elle l’origine de ce qui précède ? |
| Conséquence | donc, ainsi, par conséquent | Résulte-t-elle réellement de ce qui précède ? |
| Concession | même si, bien que | Admet-elle une limite avant de maintenir l’idée ? |

Dans l’exercice sur la dépigmentation, le corrigé retient d’abord le phénomène et ses raisons, puis sa généralisation, ses conséquences esthétiques et vitales, enfin l’appel à une prise de conscience. Cette progression doit être conservée, même lorsqu’on change les mots.

## Procédure en six gestes

1. Relis le thème, la thèse et la visée.  
2. Découpe le texte en séquences argumentatives.  
3. Formule une idée principale par séquence.  
4. Écarte les détails qui n’apportent pas une nouvelle étape du raisonnement.  
5. Remets les idées dans l’ordre initial.  
6. Choisis un connecteur seulement après avoir nommé la relation logique.

## Auto-vérification

Je suis prêt à passer à la reformulation si mes idées essentielles respectent la structure du texte, si aucune idée décisive ne manque et si chaque connecteur correspond à une relation que je peux expliquer.

| Vocabulaire | Sens utile |
|---|---|
| Stratégie argumentative | Manière dont l’auteur organise ses procédés pour défendre une idée. |
| Modalisation | Marque de certitude, doute, nécessité ou jugement. |
| Séquence argumentative | Mouvement organisé d’idées dans le texte. |
| Idée essentielle | Idée indispensable à la progression du raisonnement. |
| Enchaînement logique | Relation explicite entre deux idées. |`,
    rows: [
      ["Quel élément permet d’identifier la relation d’opposition entre deux idées ?", ["Un connecteur comme « mais » ou « cependant »", "La longueur du paragraphe", "Le nombre de mots demandé"], ["Un connecteur comme « mais » ou « cependant »"], "Les connecteurs signalent la relation logique ; ils ne doivent pas être choisis au hasard."],
      ["Que faut-il vérifier avant d’écarter une proposition du texte ?", ["Que le raisonnement reste compréhensible sans elle", "Qu’elle contient plus de cinq mots", "Qu’elle est placée au début du texte"], ["Que le raisonnement reste compréhensible sans elle"], "Une idée essentielle est nécessaire à la progression de la thèse, même lorsqu’elle est longue."],
      ["Quelle organisation le support dégage-t-il pour le texte sur l’immigration ?", ["Phénomène et conséquences, causes, puis solutions", "Titre, auteur, date", "Une seule idée répétée"], ["Phénomène et conséquences, causes, puis solutions"], "Le résumé doit respecter cette progression argumentative."],
      ["Quel connecteur convient à une idée qui résulte de celle qui précède ?", ["Par conséquent", "Cependant", "En outre"], ["Par conséquent"], "« Par conséquent » exprime une conséquence ; il convient seulement lorsque le lien est réel."],
    ],
  },
  {
    title: "Séance 5 : Reformuler les idées essentielles sans altérer le sens",
    order: 50,
    description: "Transformer l’expression des idées retenues avec précision, en conservant le sens, les nuances et le système énonciatif utiles.",
    content: `# Résumé de texte argumentatif — Séance 5 : Reformuler les idées essentielles

## Objectif de la séance

Après avoir sélectionné les idées essentielles, tu dois les écrire dans une expression personnelle. **Reformuler** ne signifie ni recopier ni inventer : c’est dire autrement la même idée, avec une phrase claire, plus concise lorsque la consigne l’exige, sans modifier la pensée de l’auteur.

> **Règle fondamentale :** si ta phrase fait dire à l’auteur davantage, moins, ou autre chose que ce qu’il affirme, elle n’est pas une reformulation fidèle.

## 1. Ce qui doit rester stable

| Élément à préserver | Question de contrôle |
|---|---|
| L’idée centrale | Ai-je gardé la même information principale ? |
| La relation logique | Ai-je conservé cause, conséquence, opposition ou condition ? |
| La nuance | Ai-je respecté l’incertitude, la nécessité ou la restriction ? |
| Le point de vue | Ai-je évité d’ajouter mon opinion ? |
| Les repères d’énonciation utiles | Le lecteur sait-il toujours qui parle ou de qui l’on parle ? |

La fidélité ne se mesure pas au nombre de mots identiques. Une phrase peut être entièrement réécrite tout en gardant son sens ; inversement, une phrase très proche peut déformer une nuance si elle supprime un connecteur ou un modaliseur important.

## 2. Quatre opérations autorisées par le support

| Opération | Comment faire | Exemple de principe |
|---|---|---|
| **Employer un synonyme pertinent** | Remplace un mot seulement si le nouveau mot convient au contexte. | « difficultés » peut devenir « problèmes », selon la phrase. |
| **Utiliser un terme englobant** | Regroupe une énumération sous une catégorie fidèle. | Plusieurs activités peuvent être résumées par « secteurs économiques » si le contexte le permet. |
| **Simplifier une phrase complexe** | Garde le lien essentiel dans une phrase plus directe. | Retire les détours sans supprimer la cause ou la conséquence. |
| **Transformer l’interrogation directe** | Rapporte la question sans conserver nécessairement sa forme directe. | La question devient l’idée qu’il faut se demander ou examiner. |

Ces opérations ne sont pas des recettes automatiques. Un synonyme mal choisi peut modifier le registre ou le sens ; un terme trop général peut effacer une précision essentielle.

## 3. Comparer sélection et reformulation

Dans le support sur la dépigmentation, les idées sélectionnées sont condensées par paragraphes. La reformulation conserve la progression : phénomène social associé à une représentation de la beauté ; généralisation de la pratique ; conséquences esthétiques ; risques pour la vie ; nécessité d’une prise de conscience. Le passage d’une liste détaillée à une formulation plus courte ne doit jamais effacer le lien entre pratique et conséquences.

| Mauvaise démarche | Pourquoi elle échoue | Démarche correcte |
|---|---|---|
| Recopier la phrase du texte | Ce n’est pas une expression personnelle. | Changer la construction et le lexique en restant fidèle. |
| Ajouter une cause absente | Cela invente une information. | S’en tenir aux causes retenues dans le texte. |
| Supprimer une nuance | Le point de vue de l’auteur devient plus fort ou plus faible. | Garder les marqueurs de nécessité, doute ou opposition utiles. |
| Empiler des mots synonymes | La phrase devient obscure. | Choisir une formulation simple et précise. |

## 4. Méthode phrase par phrase

1. Lis l’idée essentielle et souligne le noyau : qui ? quoi ? quelle relation ?  
2. Ferme le texte et redis l’idée avec tes propres mots.  
3. Rouvre le texte et compare : ai-je ajouté, supprimé ou déplacé une nuance ?  
4. Resserre la phrase si elle est inutilement longue.  
5. Vérifie le connecteur qui relie l’idée à la suivante.

## 5. Préserver le système énonciatif

Le résumé respecte les indices de personne et le système verbal utiles au texte. Si l’auteur emploie un pronom inclusif, ne le remplace pas par un groupe qui exclurait le lecteur ou l’auteur. Si le texte présente un constat, une hypothèse ou une projection, conserve cette orientation plutôt que de la transformer en certitude absolue.

> **Test final :** lis ta reformulation à voix haute. Si elle est claire mais que tu ne peux plus montrer son lien avec l’idée initiale, reprends-la.

## Auto-vérification

Je sais reformuler lorsque je peux modifier la forme d’une idée tout en conservant son noyau, sa relation logique, ses nuances et son point de vue.

| Vocabulaire | Sens utile |
|---|---|
| Reformulation | Nouvelle expression fidèle d’une même idée. |
| Synonyme | Mot de sens proche à choisir selon le contexte. |
| Terme englobant | Mot général qui regroupe plusieurs éléments. |
| Nuance | Précision qui limite, renforce ou modifie une affirmation. |
| Système énonciatif | Marques de personne et point de vue du texte. |`,
    rows: [
      ["Quel est le premier devoir d’une reformulation ?", ["Conserver l’idée et ses relations logiques", "Remplacer tous les mots par des synonymes", "Ajouter une opinion personnelle"], ["Conserver l’idée et ses relations logiques"], "La reformulation change l’expression, non le sens ni le point de vue de l’auteur."],
      ["Quand peut-on utiliser un terme englobant ?", ["Quand il regroupe fidèlement une énumération", "Quand il efface une idée essentielle", "Seulement dans la conclusion"], ["Quand il regroupe fidèlement une énumération"], "Un terme générique aide à condenser sans déformer les éléments regroupés."],
      ["Pourquoi faut-il préserver un modaliseur important ?", ["Parce qu’il peut exprimer une nuance de certitude ou de nécessité", "Parce qu’il augmente automatiquement le nombre de mots", "Parce qu’il remplace la thèse"], ["Parce qu’il peut exprimer une nuance de certitude ou de nécessité"], "Supprimer une modalisation peut changer la force du propos de l’auteur."],
      ["Quelle étape suit la reformulation de mémoire d’une idée ?", ["Comparer avec le texte pour vérifier fidélité et nuance", "Supprimer le connecteur", "Ajouter un nouvel exemple"], ["Comparer avec le texte pour vérifier fidélité et nuance"], "La comparaison évite les ajouts, oublis ou déformations involontaires."],
    ],
  },
  {
    title: "Séance 6 : Rédiger et contrôler le résumé final",
    order: 60,
    description: "Calculer la longueur demandée, rédiger en un bloc fidèle et personnel, puis contrôler ordre, énonciation, verbes et nombre de mots.",
    content: `# Résumé de texte argumentatif — Séance 6 : Rédiger et contrôler le résumé final

## Objectif de la séance

Le résumé final transforme ton travail préparatoire en un texte continu, clair et fidèle. Il rassemble les idées sélectionnées, reformulées et reliées dans l’ordre du texte. Il répond aussi à une contrainte précise de longueur : cette contrainte fait partie de l’exercice.

## 1. Calculer la longueur avant d’écrire

Dans le support, le texte compte **801 mots** et la réduction demandée est au quart. Le calcul donne :

$$801 \div 4 \approx 200$$

Avec une tolérance de plus ou moins 10 %, le résumé attendu est compris entre **180 et 220 mots**. Le modèle proposé par le support contient 194 mots : il se situe donc dans cette fourchette.

> **Attention :** 801 mots, 200 mots et 180–220 mots sont les repères du texte-support étudié. Pour un autre sujet, recommence toujours le calcul à partir du nombre et de la consigne réellement donnés.

## 2. Les contraintes de la rédaction

| Exigence | Ce qu’elle implique concrètement | Erreur fréquente |
|---|---|---|
| Respecter l’ordre des idées | Suivre les séquences du texte-source. | Mettre les solutions avant les causes. |
| Employer une expression personnelle | Rédiger après reformulation. | Copier des phrases entières. |
| Éviter le style télégraphique | Construire des phrases complètes et liées. | Empiler des groupes de mots séparés par des virgules. |
| Respecter l’énonciation et les verbes | Conserver les repères utiles de personne et de temps. | Changer le point de vue ou transformer une hypothèse en fait. |
| Respecter le nombre de mots | Compter après une première rédaction puis ajuster avec prudence. | Couper une idée essentielle uniquement pour atteindre le chiffre. |
| Écrire en un bloc | Présenter un seul paragraphe continu. | Reprendre les paragraphes du texte-source. |

## 3. De la préparation au bloc rédigé

Rédige d’abord une version complète sans compter chaque mot à chaque phrase. Utilise ta liste d’idées essentielles et les relations logiques préparées dans la séance 4. Reformule chaque idée comme appris dans la séance 5. Une fois le bloc terminé, compte les mots et effectue des ajustements ciblés.

| Étape | Action | Question de contrôle |
|---|---|---|
| Brouillon | Aligner les idées essentielles dans l’ordre. | Ma progression correspond-elle au texte ? |
| Rédaction | Construire des phrases reliées. | Chaque connecteur exprime-t-il le bon lien ? |
| Comptage | Vérifier la marge autorisée. | Suis-je dans la fourchette ? |
| Ajustement | Condenser des détails ou développer une idée oubliée. | Ai-je conservé la thèse et la conclusion ? |
| Relecture | Contrôler sens, énonciation et verbes. | Ai-je écrit un texte personnel et fidèle ? |

## 4. Ajuster sans dégrader

Si le résumé dépasse la longueur demandée, commence par resserrer une répétition, une précision secondaire ou une énumération que tu peux regrouper. Ne supprime ni la thèse, ni une cause déterminante, ni la conclusion de l’auteur. Si le résumé est trop court, vérifie d’abord qu’une séquence argumentative n’a pas disparu ; n’ajoute jamais une idée extérieure pour remplir.

## 5. Le modèle du support : ce qu’il faut apprendre

Le modèle sur l’immigration reprend la progression des causes, des conséquences et des solutions dans un texte continu. Il ne doit pas être recopié. Ce qu’il faut réutiliser est sa méthode : garder le fil de l’argumentation, reformuler, relier les idées et vérifier la longueur.

## Grille finale de relecture

| Question | Oui / à reprendre |
|---|---|
| Mon résumé est-il présenté en un seul bloc ? | |
| L’ordre des idées du texte est-il respecté ? | |
| Ai-je gardé seulement les idées essentielles ? | |
| Mes phrases sont-elles personnelles et complètes ? | |
| Les connecteurs correspondent-ils aux relations logiques ? | |
| Les personnes, temps et nuances utiles sont-ils conservés ? | |
| Le nombre de mots respecte-t-il la consigne ? | |

## Auto-vérification

Je peux produire un résumé si je sais calculer la longueur demandée, rédiger un bloc continu, conserver l’ordre des idées, écrire personnellement et contrôler méthodiquement le résultat.

| Vocabulaire | Sens utile |
|---|---|
| Réduction | Rapport entre la longueur du texte-source et celle du résumé. |
| Tolérance | Écart autorisé autour du nombre de mots attendu. |
| Style télégraphique | Écriture en fragments ou en liste, sans phrases construites. |
| Relecture | Vérification finale du sens, de la forme et de la consigne. |
| Bloc | Un seul paragraphe continu pour le résumé. |`,
    rows: [
      ["Pour le texte-support de 801 mots réduit au quart, quelle longueur est attendue avec la tolérance indiquée ?", ["Entre 180 et 220 mots", "Exactement 801 mots", "Entre 20 et 40 mots"], ["Entre 180 et 220 mots"], "Le support calcule environ 200 mots et autorise plus ou moins 10 %, soit 180 à 220 mots."],
      ["Quel élément ne faut-il pas supprimer en priorité lorsqu’un résumé est trop long ?", ["La thèse ou une idée décisive", "Une répétition secondaire", "Une précision illustrative regroupable"], ["La thèse ou une idée décisive"], "On ajuste d’abord les détails secondaires, jamais le fil du raisonnement."],
      ["Quelle présentation le support impose-t-il au résumé ?", ["Un seul bloc continu", "Un paragraphe par idée essentielle", "Une liste numérotée"], ["Un seul bloc continu"], "Le résumé doit former un texte suivi, non reproduire le découpage du texte-source."],
      ["Quel contrôle doit accompagner le comptage des mots ?", ["Vérifier ordre, sens, énonciation et système verbal", "Ajouter une opinion personnelle", "Remplacer tous les connecteurs"], ["Vérifier ordre, sens, énonciation et système verbal"], "La conformité de longueur ne suffit pas : le résumé doit rester fidèle et cohérent."],
    ],
  },
];

const exerciseQuestionsSql = (id, rows) => `insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values ${rows.map(([prompt, options, correct, explanation], index) => `(${id},'single_choice',${sqlText(prompt)},${jsonArray(options)},${jsonArray(correct)},${sqlText(explanation)},${(index + 1) * 10})`).join(",")};`;
const quizSql = (id, session, label, rows, displayOrder) => {
  const questions = rows.map(([question, , , explanation], index) => `(${id},${sqlText(question)},${sqlText(explanation)},'single_choice',${(index + 1) * 10},1,true)`).join(",");
  const answers = rows.flatMap(([, options, correct], index) => options.map((option, optionIndex) => `(${(index + 1) * 10},${sqlText(option)},${correct.includes(option)},${(optionIndex + 1) * 10})`)).join(",");
  return `insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active,is_test_data) values (target.subject_id,target.level_id,target.series_id,target.offering_id,target_chapter_id,target_lesson_id,${sqlText(`Quiz ${label} — ${session.title}`)},${sqlText(`Vérifie les repères approfondis de ${session.title.toLowerCase()}.`)},'medium',12,${displayOrder},false,false,false) returning id into ${id}; with inserted_questions as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values ${questions} returning id,display_order) insert into public.quiz_answers(question_id,answer,is_correct,display_order) select iq.id,v.answer,v.is_correct,v.display_order from inserted_questions iq join (values ${answers}) as v(question_order,answer,is_correct,display_order) on v.question_order=iq.display_order;`;
};
const sessionSql = (session, index) => {
  const n = index + 4; const exA = `s${n}_exercise_a`; const exB = `s${n}_exercise_b`; const quizA = `s${n}_quiz_a`; const quizB = `s${n}_quiz_b`; const base = session.order * 10;
  return `insert into public.lesson_sessions (lesson_id,title,description,content,display_order,is_active,is_test_data) values (target_lesson_id,${sqlText(session.title)},${sqlText(session.description)},${sqlText(session.content)},${session.order},false,false);
insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order,is_test_data) values (target.subject_id,target.level_id,target.series_id,target_chapter_id,target_lesson_id,${sqlText(`Exercice d’application — ${session.title}`)},${sqlText("Réponds à partir de la méthode approfondie de la séance.")},${sqlText("La correction explique le raisonnement attendu.")},'single_choice','medium',${sqlText("Lis les consignes puis appuie chaque choix sur le cours.")},${sqlText("Relis la règle et le test de contrôle associés à chaque réponse.")},false,false,18,${base + 10},false) returning id into ${exA};
${exerciseQuestionsSql(exA, session.rows)}
insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order,is_test_data) values (target.subject_id,target.level_id,target.series_id,target_chapter_id,target_lesson_id,${sqlText(`Exercice de consolidation — ${session.title}`)},${sqlText("Réinvestis la démarche dans une situation équivalente.")},${sqlText("La correction rappelle la méthode avant la réponse.")},'single_choice','medium',${sqlText("Choisis la réponse qui conserve la fidélité et la progression du résumé.")},${sqlText("Explique ensuite pourquoi les autres propositions ne conviennent pas.")},false,false,18,${base + 20},false) returning id into ${exB};
${exerciseQuestionsSql(exB, session.rows.slice().reverse())}
${quizSql(quizA, session, "A — Repères", session.rows, base + 10)}
${quizSql(quizB, session, "B — Méthode", session.rows.slice().reverse(), base + 20)}`;
};

const migration = `-- Résumé de texte argumentatif Terminale : séances 4 à 6, tous contenus en brouillon.
do $french_resume_s456$
declare target record; target_chapter_id uuid; target_lesson_id uuid; offering_count integer;
  s4_exercise_a uuid; s4_exercise_b uuid; s4_quiz_a uuid; s4_quiz_b uuid;
  s5_exercise_a uuid; s5_exercise_b uuid; s5_quiz_a uuid; s5_quiz_b uuid;
  s6_exercise_a uuid; s6_exercise_b uuid; s6_quiz_a uuid; s6_quiz_b uuid;
begin
  select count(*) into offering_count from public.course_subject_offerings where id in (${offerings.map(sqlText).join(",")}) and is_test_data=false;
  if offering_count<>4 then raise exception 'Les quatre offres Français Terminale officielles sont requises.'; end if;
  if exists (select 1 from public.lesson_sessions s join public.lessons l on l.id=s.lesson_id join public.chapters c on c.id=l.chapter_id where c.subject_offering_id in (${offerings.map(sqlText).join(",")}) and (l.title ilike '%RÉSUMÉ DU TEXTE ARGUMENTATIF%' or l.title ilike '%RESUME DU TEXTE ARGUMENTATIF%') and (s.title in (${sessions.map((session) => sqlText(session.title)).join(",")}) or s.display_order in (40,50,60))) then raise exception 'Les séances 4, 5 ou 6 existent déjà : duplication ou écrasement interdit.'; end if;
  for target in select o.id as offering_id,o.subject_id,o.level_id,o.series_id,se.name as series_name from public.course_subject_offerings o join public.series se on se.id=o.series_id where o.id in (${offerings.map(sqlText).join(",")}) and o.is_test_data=false order by se.name loop
    select c.id,l.id into target_chapter_id,target_lesson_id from public.chapters c join public.lessons l on l.chapter_id=c.id where c.subject_offering_id=target.offering_id and (l.title ilike '%RÉSUMÉ DU TEXTE ARGUMENTATIF%' or l.title ilike '%RESUME DU TEXTE ARGUMENTATIF%') and c.is_test_data=false and l.is_test_data=false limit 1;
    if target_lesson_id is null then raise exception 'La leçon Résumé de texte argumentatif officielle est requise pour la série %.',target.series_name; end if;
    if (select count(*) from public.lesson_sessions s where s.lesson_id=target_lesson_id and s.is_test_data=false and s.display_order in (10,20,30))<>3 then raise exception 'Les séances 1 à 3 sont requises avant les séances 4 à 6 pour la série %.',target.series_name; end if;
${sessions.map(sessionSql).join("\n")}
  end loop;
end $french_resume_s456$;`;

writeFileSync(migrationPath, migration, "utf8");
writeFileSync(payloadPath, `${JSON.stringify({ project_id: "nnshioowwniursnozicg", name: "french_terminal_resume_texte_s456_drafts", query: migration }, null, 2)}\n`, "utf8");
console.log(migrationPath); console.log(payloadPath);
