import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const migrationPath = resolve(root, "supabase/migrations/20260824_french_terminal_dissertation_s45_drafts.sql");
const payloadPath = resolve(root, "supabase/migrations/20260824_french_terminal_dissertation_s45_drafts.apply.json");
const offerings = ["57b5ca6e-6add-4c7a-98cd-5a99a0a46eb9", "f7fd326f-2e6f-4679-9982-7c40184b80e5", "cba5f18f-ed57-4288-936b-f40920335538", "44cb0105-3955-4038-9811-13ba83bcce8a"];
const sqlText = (value) => { const tag = "$dissertation_s45$"; if (value.includes(tag)) throw new Error("Délimiteur SQL présent dans le contenu."); return `${tag}${value}${tag}`; };
const jsonArray = (values) => `jsonb_build_array(${values.map(sqlText).join(",")})`;

const sessions = [
  {
    title: "Séance 4 : Rédiger l’introduction et la conclusion",
    order: 40,
    description: "Construire une introduction et une conclusion en un paragraphe, avec perspective, sujet, problématique, plan, bilan, jugement et ouverture.",
    content: `# Dissertation littéraire — Séance 4 : Rédiger l’introduction et la conclusion

## Objectif de la séance

L’introduction et la conclusion encadrent tout le devoir. Elles se rédigent chacune en **un seul paragraphe**. L’introduction conduit progressivement au problème ; la conclusion ferme le raisonnement sans répéter mécaniquement le développement.

> **Principe :** n’écris ni une introduction interminable ni une conclusion qui apporte un nouvel argument. Chaque partie possède une fonction précise.

## 1. Les quatre composantes de l’introduction

| Étape | Fonction | Question de contrôle |
|---|---|---|
| **Perspective générale** | Entrer par une généralité, un constat pertinent ou une citation liée au thème. | Mon entrée conduit-elle réellement au sujet ? |
| **Annonce du sujet** | Présenter le sujet initial s’il est bref ou le reformuler s’il est long. | Ai-je respecté l’idée de départ ? |
| **Problématique** | Dégager le ou les aspects du problème soulevé. | Ma question ouvre-t-elle une réflexion ? |
| **Annonce du plan** | Dire simplement les grandes directions du développement. | Le lecteur comprend-il la progression prévue ? |

La perspective générale n’est pas une décoration. Dans l’exemple du support sur le rôle de l’écrivain, elle part d’Aimé Césaire et conduit ensuite vers l’affirmation de Jean-Marie Le Clézio. L’annonce du sujet vient alors naturellement, puis la question sur les autres fonctions possibles de l’écrivain conduit à l’annonce des deux directions de réflexion.

## 2. Construire une introduction pas à pas

Pour un sujet sur l’univers poétique et les tourments, on peut partir de la poésie lyrique comme expression de sentiments personnels. On annonce ensuite la pensée de Roland Barthes en la reformulant : la création poétique semble naître des sentiments douloureux qui rendent le poète malheureux. La problématique peut demander si la souffrance est la seule source de création poétique. Enfin, l’annonce du plan présente les deux mouvements : montrer l’importance de la souffrance, puis en examiner les limites.

> **Méthode de relecture :** souligne les quatre fonctions dans ton brouillon. Si deux phrases remplissent la même fonction, resserre-les ; si une fonction manque, ajoute-la avec précision.

## 3. Les trois étapes de la conclusion

| Étape | Ce qu’elle réalise | À éviter |
|---|---|---|
| **Bilan** | Rappelle les grandes idées démontrées. | Reprendre tous les exemples un à un. |
| **Opinion personnelle / dépassement** | Porte un jugement nuancé ou concilie les deux thèses. | Dire seulement « je suis d’accord » sans justification. |
| **Ouverture** | Oriente vers une nouvelle préoccupation liée au sujet. | Lancer une question sans rapport. |

Dans l’exemple du support sur l’écrivain, le bilan rappelle qu’il défend les conditions d’existence tout en pouvant divertir et rechercher le beau. Le dépassement présente alors l’écrivain comme créateur à la fois proche du peuple et guidé par son imagination. L’ouverture interroge enfin les autres structures susceptibles de porter la voix des citoyens.

## 4. Mise en situation — Le roman fécond pour le lecteur

Pour le sujet « Aucune œuvre littéraire n’est stérile ; de quelque manière que ce soit, elle féconde le lecteur », l’introduction peut partir de la valeur ou de la fonction de la littérature. Elle annonce le sujet, le reformule sans l’appauvrir et interroge : comment une œuvre romanesque féconde-t-elle le lecteur ? Joue-t-elle toujours ce rôle ?

La conclusion devra d’abord faire le bilan des apports possibles du roman, puis formuler un jugement nuancé. Une ouverture pertinente peut interroger la diversité des rapports entre lecteurs et œuvres. Elle reste liée au sujet ; elle ne change pas brusquement de domaine.

## 5. Modèle guidé, non modèle à recopier

Un exemple montre une organisation ; il ne doit pas être recopié à la place de ta réflexion. Adapte toujours la perspective, la problématique et le plan au sujet réellement posé. La qualité d’une introduction ou d’une conclusion dépend de la cohérence entre toutes ses phrases et le développement produit.

## Auto-vérification

Je sais rédiger l’encadrement du devoir si je peux expliquer le rôle de chaque composante, reformuler un sujet sans le déformer, poser une problématique précise, annoncer deux directions de plan, faire un bilan, formuler un dépassement et proposer une ouverture liée.

| Vocabulaire | Sens utile |
|---|---|
| Perspective générale | Entrée progressive reliée au thème du sujet. |
| Annonce du sujet | Présentation ou reformulation fidèle de la pensée proposée. |
| Annonce du plan | Présentation claire des grandes parties à développer. |
| Bilan | Synthèse des idées principales démontrées. |
| Ouverture | Prolongement pertinent de la réflexion. |`,
    rows: [
      ["Quelle étape de l’introduction conduit le lecteur au thème avant le sujet précis ?", ["La perspective générale", "Le bilan", "La transition"], ["La perspective générale"], "La perspective générale ouvre le sujet sans s’en éloigner."],
      ["Quand le sujet est long, que conseille le support pour son annonce ?", ["Le reformuler fidèlement", "Le supprimer", "Le transformer en conclusion"], ["Le reformuler fidèlement"], "La reformulation doit conserver la pensée initiale."],
      ["Quel élément ne doit pas apparaître comme un nouvel argument dans la conclusion ?", ["L’ouverture", "Le bilan", "L’annonce du plan"], ["L’ouverture"], "L’ouverture prolonge la réflexion ; elle ne développe pas un argument nouveau."],
      ["Quelle formulation décrit un dépassement de thèse ?", ["Porter un jugement nuancé après les deux directions examinées", "Recopier tout le développement", "Ajouter une œuvre sans lien"], ["Porter un jugement nuancé après les deux directions examinées"], "Le dépassement permet de concilier ou de nuancer les thèses."],
    ],
  },
  {
    title: "Séance 5 : Rédiger une partie de développement",
    order: 50,
    description: "Construire un paragraphe argumentatif : idée directrice, démonstration, illustration expliquée, conclusion partielle et transition.",
    content: `# Dissertation littéraire — Séance 5 : Rédiger une partie de développement

## Objectif de la séance

Le développement donne sa force à la dissertation. Une grande partie contient plusieurs sous-parties ; chacune prend la forme d’un paragraphe argumentatif. Le support demande une progression rigoureuse : idée directrice, explication, illustration expliquée, puis phrase conclusive qui prépare l’argument suivant.

## 1. Le schéma du paragraphe argumentatif

| Moment du paragraphe | Rôle | Erreur à éviter |
|---|---|---|
| **Idée directrice** | Présenter clairement l’argument de la sous-partie. | Commencer immédiatement par un titre d’œuvre. |
| **Explication / démonstration** | Montrer pourquoi l’idée répond au sujet. | Affirmer sans développer le raisonnement. |
| **Illustration expliquée** | Choisir une œuvre et préciser l’élément qui éclaire l’argument. | Faire une liste de titres sans commentaire. |
| **Phrase conclusive** | Fermer la sous-partie et annoncer la suivante. | Couper brutalement le paragraphe. |

> **Règle d’or :** une illustration ne remplace jamais l’argument. Elle devient utile lorsque son lien avec l’idée directrice est expliqué.

## 2. Exemple guidé : la dénonciation des tares sociales

Pour le sujet Le Clézio, le support propose une première idée : l’écrivain dénonce la mauvaise gouvernance et les abus du pouvoir. L’explication précise que détournements, corruption et abus du pouvoir portent préjudice aux sociétés. Les illustrations citées sont *Tribaliques* d’Henri Lopes et *Les voix dans le vent* de Bernard Dadié ; elles doivent être introduites comme des exemples qui éclairent la critique du pouvoir.

Une autre sous-partie peut porter sur les inégalités et injustices sociales. Le support cite notamment *Ville cruelle* d’Eza Boto, *Les Misérables* de Victor Hugo, *Les Fleurs du mal* de Baudelaire et *Le vieux nègre et la médaille* de Ferdinand Oyono. Le rôle du rédacteur est de choisir l’exemple utile, d’en dégager l’élément pertinent, puis de le relier explicitement à l’injustice étudiée.

## 3. La phrase de liaison et la transition

Une phrase conclusive achève une sous-partie et peut annoncer l’argument suivant dans la même grande partie. Une **transition**, elle, est nécessaire entre deux grandes parties : elle résume l’idée précédente et annonce celle qui vient. Elle ne se contente pas de dire « passons à la deuxième partie ».

| Niveau de liaison | Fonction |
|---|---|
| Phrase conclusive | Fermer une sous-partie et organiser la progression interne. |
| Transition | Faire passer de la thèse à la discussion, ou d’une grande idée à une autre. |

Dans le sujet Le Clézio, après les formes de dénonciation, une transition possible interroge : l’écrivain peut-il être réduit à la fonction de dénonciateur ? Cette question résume ce qui précède et annonce la recherche de ses autres fonctions.

## 4. Mise en situation — L’inspiration poétique

Pour le sujet sur les tourments, une idée directrice peut affirmer que le poète s’inspire de souffrances personnelles. L’explication montre comment une perte ou un amour impossible devient matière poétique. Les illustrations fournies par le support comprennent *Les Contemplations* de Victor Hugo, *Les Nuits* d’Alfred de Musset et *Phèdre* de Jean Racine. Pour chaque choix, explique le rapport avec la douleur évoquée ; ne cite pas l’œuvre comme un simple nom.

Une seconde idée peut porter sur l’amour difficile. Le support renvoie à Alfred de Musset et à Phèdre, personnage confronté à un amour interdit. La phrase finale prépare alors l’argument suivant ou, si l’on termine une grande partie, la transition vers les sources d’inspiration qui ne relèvent pas de la souffrance.

## 5. Écrire avec rigueur

Rédige un paragraphe à la fois. Vérifie que le pronom « cela » possède toujours un antécédent clair, que les connecteurs expriment réellement le lien logique et que ton exemple n’est ni hors sujet ni inexpliqué. Une sous-partie doit défendre une idée complète ; elle ne doit pas accumuler plusieurs arguments incompatibles.

## Auto-vérification

Je sais rédiger une partie du développement si je peux formuler une idée directrice, la justifier, choisir une illustration pertinente, expliquer ce qu’elle montre et écrire une phrase qui guide le lecteur vers l’argument ou la partie suivante.

| Vocabulaire | Sens utile |
|---|---|
| Idée directrice | Argument principal développé dans une sous-partie. |
| Démonstration | Explication qui justifie l’argument. |
| Illustration | Œuvre ou élément d’œuvre choisi pour éclairer l’argument. |
| Phrase conclusive | Fermeture logique d’une sous-partie. |
| Transition | Passage raisonné entre deux grandes parties. |`,
    rows: [
      ["Quelle est la première étape d’un paragraphe argumentatif selon le support ?", ["Présenter l’idée directrice", "Citer plusieurs œuvres sans commentaire", "Faire immédiatement la conclusion générale"], ["Présenter l’idée directrice"], "L’idée directrice annonce l’argument que le paragraphe va démontrer."],
      ["Pourquoi doit-on expliquer une illustration littéraire ?", ["Pour montrer son lien avec l’argument", "Pour remplacer la problématique", "Pour éviter toute démonstration"], ["Pour montrer son lien avec l’argument"], "Le titre de l’œuvre seul ne prouve pas l’idée défendue."],
      ["Quelle est la fonction d’une transition entre deux grandes parties ?", ["Résumer l’idée précédente et annoncer la suivante", "Ajouter un exemple sans rapport", "Répéter exactement le premier paragraphe"], ["Résumer l’idée précédente et annoncer la suivante"], "La transition rend visible la progression logique du devoir."],
      ["Que faut-il éviter dans une sous-partie ?", ["Accumuler plusieurs arguments incompatibles", "Développer une idée complète", "Utiliser un connecteur logique pertinent"], ["Accumuler plusieurs arguments incompatibles"], "Une sous-partie reste centrée sur une idée directrice claire."],
    ],
  },
];

const exerciseSql = (id, rows) => `insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values ${rows.map(([prompt, options, correct, explanation], index) => `(${id},'single_choice',${sqlText(prompt)},${jsonArray(options)},${jsonArray(correct)},${sqlText(explanation)},${(index + 1) * 10})`).join(",")};`;
const quizSql = (id, session, type, rows, displayOrder) => {
  const questions = rows.map(([question, , , explanation], index) => `(${id},${sqlText(question)},${sqlText(explanation)},'single_choice',${(index + 1) * 10},1,true)`).join(",");
  const answers = rows.flatMap(([, options, correct], index) => options.map((option, optionIndex) => `(${(index + 1) * 10},${sqlText(option)},${correct.includes(option)},${(optionIndex + 1) * 10})`)).join(",");
  return `insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active,is_test_data) values (target.subject_id,target.level_id,target.series_id,target.offering_id,target_chapter_id,target_lesson_id,${sqlText(`Quiz ${type} — ${session.title}`)},${sqlText(`Vérifie la méthode de ${session.title.toLowerCase()}.`)},'medium',12,${displayOrder},false,false,false) returning id into ${id}; with inserted_questions as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values ${questions} returning id,display_order) insert into public.quiz_answers (question_id,answer,is_correct,display_order) select iq.id,v.answer,v.is_correct,v.display_order from inserted_questions iq join (values ${answers}) as v(question_order,answer,is_correct,display_order) on v.question_order=iq.display_order;`;
};
const sessionSql = (session, index) => {
  const exA = `s${index + 4}_exercise_a`; const exB = `s${index + 4}_exercise_b`; const quizA = `s${index + 4}_quiz_a`; const quizB = `s${index + 4}_quiz_b`; const base = session.order * 10;
  return `insert into public.lesson_sessions (lesson_id,title,description,content,display_order,is_active,is_test_data) values (target_lesson_id,${sqlText(session.title)},${sqlText(session.description)},${sqlText(session.content)},${session.order},false,false);
insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order,is_test_data) values (target.subject_id,target.level_id,target.series_id,target_chapter_id,target_lesson_id,${sqlText(`Exercice d’application — ${session.title}`)},${sqlText("Réponds à partir des étapes méthodologiques de la séance.")},${sqlText("La correction explicite le rôle de chaque étape dans la dissertation.")},'single_choice','medium',${sqlText("Lis les consignes puis appuie chaque réponse sur la méthode étudiée.")},${sqlText("Relis la définition et la démarche avant de passer à la question suivante.")},false,false,18,${base + 10},false) returning id into ${exA};
${exerciseSql(exA, session.rows)}
insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order,is_test_data) values (target.subject_id,target.level_id,target.series_id,target_chapter_id,target_lesson_id,${sqlText(`Exercice de consolidation — ${session.title}`)},${sqlText("Réinvestis la méthode dans une nouvelle formulation et lis les corrections détaillées.")},${sqlText("La correction rappelle comment organiser une introduction, une conclusion ou un paragraphe argumentatif.")},'single_choice','medium',${sqlText("Choisis la réponse qui respecte le rôle de l’étape indiquée.")},${sqlText("Explique ensuite en une phrase pourquoi la réponse est cohérente.")},false,false,18,${base + 20},false) returning id into ${exB};
${exerciseSql(exB, session.rows.slice().reverse())}
${quizSql(quizA, session, "A — Repères", session.rows, base + 10)}
${quizSql(quizB, session, "B — Méthode", session.rows.slice().reverse(), base + 20)}`;
};

const migration = `-- Dissertation littéraire Terminale : séances 4 et 5, tous contenus en brouillon.
do $french_dissertation_s45$
declare target record; target_chapter_id uuid; target_lesson_id uuid; offering_count integer;
  s4_exercise_a uuid; s4_exercise_b uuid; s4_quiz_a uuid; s4_quiz_b uuid;
  s5_exercise_a uuid; s5_exercise_b uuid; s5_quiz_a uuid; s5_quiz_b uuid;
begin
  select count(*) into offering_count from public.course_subject_offerings where id in (${offerings.map(sqlText).join(",")}) and is_test_data=false;
  if offering_count<>4 then raise exception 'Les quatre offres Français Terminale officielles sont requises.'; end if;
  if exists (select 1 from public.lesson_sessions s join public.lessons l on l.id=s.lesson_id join public.chapters c on c.id=l.chapter_id where c.subject_offering_id in (${offerings.map(sqlText).join(",")}) and (s.title in (${sessions.map((session) => sqlText(session.title)).join(",")}) or s.display_order in (40,50))) then raise exception 'Les séances 4 ou 5 existent déjà : duplication ou écrasement interdit.'; end if;
  for target in select o.id as offering_id,o.subject_id,o.level_id,o.series_id,se.name as series_name from public.course_subject_offerings o join public.series se on se.id=o.series_id where o.id in (${offerings.map(sqlText).join(",")}) and o.is_test_data=false order by se.name loop
    select c.id,l.id into target_chapter_id,target_lesson_id from public.chapters c join public.lessons l on l.chapter_id=c.id where c.subject_offering_id=target.offering_id and l.title ilike '%DISSERTATION LITTÉRAIRE%' and c.is_test_data=false and l.is_test_data=false limit 1;
    if target_lesson_id is null then raise exception 'La leçon Dissertation littéraire officielle est requise pour la série %.',target.series_name; end if;
    if (select count(*) from public.lesson_sessions s where s.lesson_id=target_lesson_id and s.is_test_data=false and s.display_order in (10,20,30))<>3 then raise exception 'Les séances 1 à 3 sont requises avant les séances 4 et 5 pour la série %.',target.series_name; end if;
${sessions.map(sessionSql).join("\n")}
  end loop;
end $french_dissertation_s45$;`;

writeFileSync(migrationPath, migration, "utf8");
writeFileSync(payloadPath, `${JSON.stringify({ project_id: "nnshioowwniursnozicg", name: "french_terminal_dissertation_s45_drafts", query: migration }, null, 2)}\n`, "utf8");
console.log(migrationPath); console.log(payloadPath);
