import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const migrationPath = resolve(root, "supabase/migrations/20260824_french_terminal_dissertation_sessions_drafts.sql");
const payloadPath = resolve(root, "supabase/migrations/20260824_french_terminal_dissertation_sessions_drafts.apply.json");
const offerings = ["57b5ca6e-6add-4c7a-98cd-5a99a0a46eb9", "f7fd326f-2e6f-4679-9982-7c40184b80e5", "cba5f18f-ed57-4288-936b-f40920335538", "44cb0105-3955-4038-9811-13ba83bcce8a"];
const sqlText = (value) => { const tag = "$dissertation_session$"; if (value.includes(tag)) throw new Error("Délimiteur SQL trouvé dans le contenu."); return `${tag}${value}${tag}`; };
const jsonArray = (values) => `jsonb_build_array(${values.map(sqlText).join(",")})`;

const sessions = [
  {
    title: "Séance 1 : Analyser le sujet",
    description: "Distinguer information et consigne, expliquer les mots clés, reformuler la thèse et dégager une problématique.",
    content: `# Dissertation littéraire — Séance 1 : Analyser le sujet

## Objectif de la séance

Avant de rédiger, il faut comprendre exactement ce que le sujet demande. Cette séance suit la méthode du support : repérer **l’information** et **la consigne**, puis comprendre l’information en déterminant le thème, les mots clés, la reformulation et la problématique.

> **Repère de méthode :** l’information donne le sujet de réflexion ; la consigne indique le travail à accomplir. Ne commence pas à réciter des œuvres avant d’avoir identifié ces deux éléments.

## 1. Distinguer l’information de la consigne

| Élément | Rôle | Question à se poser |
|---|---|---|
| **Information** | Contient le thème et la thèse de l’auteur. | De quoi parle-t-on ? Quelle idée est affirmée ? |
| **Consigne** | Demande une opération précise. | Que dois-je faire de cette idée ? |

Dans le sujet de Jean-Marie Le Clézio, « l’écrivain est celui qui montre du doigt une parcelle du monde », l’information porte sur le rôle de l’écrivain. La formule « Expliquez et discutez » est la consigne.

## 2. Comprendre les mots clés en contexte

Les mots clés ne sont pas des mots isolés à apprendre par cœur : ils servent à saisir le sens de la thèse. Dans le sujet Le Clézio, « montrer du doigt » signifie présenter, exposer ou dénoncer ; « une parcelle du monde » renvoie à certains aspects ou réalités de la société. Dans le sujet de George Sand, le roman est une œuvre d’imagination en prose et le plaisir désigne une sensation agréable ou un divertissement.

> **Méthode :** explique seulement les mots qui commandent le sens du sujet. Une définition hors contexte peut faire perdre le problème littéraire réel.

## 3. Reformuler sans déformer

Reformuler consiste à redire la pensée avec ses propres mots, sans en changer l’idée. Le sujet Le Clézio peut être reformulé ainsi : le rôle de l’écrivain est de mettre à nu certaines réalités sociales. Pour George Sand, on peut dire que la lecture d’un roman procure des sensations agréables et du divertissement.

| Mauvaise habitude | Correction |
|---|---|
| Recopier la citation en la présentant comme une reformulation. | Employer d’autres mots et vérifier que la thèse demeure la même. |
| Ajouter déjà sa propre opinion. | Garder d’abord le sens de l’auteur ; l’avis personnel viendra dans la discussion. |
| Résumer un mot seulement. | Rendre l’idée complète de la phrase. |

## 4. Dégager le problème soulevé

La problématique transforme le sujet en question de réflexion. Elle ne doit pas être trop vague. Pour Le Clézio : « Quelle est la fonction de l’écrivain dans la société ? Est-ce son unique fonction ? » Pour George Sand : « En quoi la lecture d’un roman procure-t-elle du plaisir ? Le roman n’a-t-il pas d’autres effets sur le lecteur ? »

## Mise en situation guidée — Roland Barthes

Le support propose : « L’univers poétique est rempli de tourments qui font des poètes des gens qui n’ont jamais souri. » Commence par repérer l’information et la consigne « Expliquez et discutez ». Le thème est la source de l’inspiration poétique. Une reformulation prudente est : le sujet semble limiter la poésie à l’expression de sentiments douloureux et présenter le poète comme un être malheureux.

La problématique peut alors interroger : la souffrance fait-elle du poète un être malheureux ? La création poétique n’a-t-elle pas d’autres sources d’inspiration ?

## Auto-vérification

Je sais analyser le sujet si je peux repérer la consigne, expliquer les mots clés dans leur contexte, reformuler la thèse sans la déformer et poser une question qui ouvre réellement la réflexion.

| Vocabulaire | Sens utile |
|---|---|
| Thème | Domaine général abordé par la réflexion. |
| Thèse | Idée défendue dans l’information du sujet. |
| Consigne | Travail demandé par le sujet. |
| Reformulation | Expression fidèle de la thèse avec d’autres mots. |
| Problématique | Question centrale née de la thèse et de ses limites possibles. |`,
    rows: [
      ["Dans un sujet de dissertation, quelle partie indique le travail demandé ?", ["La consigne", "L’information", "Le titre de l’œuvre"], ["La consigne"], "La consigne commande l’opération à réaliser, par exemple expliquer et discuter."],
      ["Que faut-il faire avant de chercher des arguments ?", ["Comprendre le thème, les mots clés et le problème", "Recopier des citations au hasard", "Choisir directement une conclusion"], ["Comprendre le thème, les mots clés et le problème"], "L’analyse empêche de traiter un sujet différent de celui qui est posé."],
      ["Pour le sujet Le Clézio, quel thème retient le support ?", ["La fonction de l’écrivain", "La biographie de Le Clézio", "La technique du roman"], ["La fonction de l’écrivain"], "Le sujet réfléchit au rôle de l’écrivain dans la société."],
      ["Une bonne reformulation doit-elle déjà donner votre avis personnel ?", ["Non, elle doit d’abord conserver le sens de la thèse", "Oui, elle doit refuser la thèse", "Oui, elle doit ajouter des exemples"], ["Non, elle doit d’abord conserver le sens de la thèse"], "La discussion vient après la compréhension fidèle de l’idée proposée."],
    ],
  },
  {
    title: "Séance 2 : Rechercher les idées",
    description: "Produire des arguments et illustrations liés à la problématique, sans confondre réserve d’idées et plan organisé.",
    content: `# Dissertation littéraire — Séance 2 : Rechercher les idées

## Objectif de la séance

Après l’analyse, la recherche des idées consiste à trouver des arguments qui répondent au problème posé. Le support insiste sur une idée simple : les arguments sont d’abord cherchés **pêle-mêle** ; leur classement relève de la séance suivante.

## 1. Préparer la recherche

Avant de chercher, rappelle la thèse, la problématique et le champ de recherche. Selon le sujet, les exemples peuvent venir du roman, de la poésie, du théâtre ou de la littérature de manière plus large. Ne choisis pas une œuvre seulement parce que son titre est connu : elle doit illustrer l’idée que tu avances.

| Élément à garder sous les yeux | Pourquoi ? |
|---|---|
| Thèse | Elle indique ce que l’on doit d’abord expliquer ou nuancer. |
| Problématique | Elle empêche de sortir du problème réel. |
| Argument | Il répond à une partie de la question. |
| Illustration | Elle rend l’argument concret par une œuvre et un élément pertinent. |

## 2. Construire le couple argument–illustration

Un argument est une idée défendue ; une illustration montre comment une œuvre permet de l’appuyer. Pour le sujet Le Clézio, le support donne notamment : l’écrivain expose des pratiques socio-culturelles néfastes ; *Rebelle* de Fatou Keïta illustre cette idée à travers la dénonciation de l’excision des filles.

| Argument du support | Illustration citée dans le support |
|---|---|
| Défense des victimes de discriminations ou d’injustices sociales | *Le vieux nègre et la médaille* de Ferdinand Oyono, à travers le personnage de Méka. |
| Dénonciation des abus des pouvoirs politiques | *Les Châtiments* de Victor Hugo. |
| Dénonciation des travers sociaux | *Dom Juan* de Molière, à propos du libertinage. |

> **Attention :** une liste de titres sans lien expliqué n’est pas une argumentation. Après chaque exemple, précise l’idée qu’il éclaire.

## 3. Chercher aussi les idées qui nuancent

La discussion exige de ne pas enfermer une thèse dans une seule réponse. Dans le sujet Roland Barthes sur les tourments poétiques, le support propose des sources de souffrance : situations difficiles de la vie, angoisses existentielles et guerres. Il propose aussi des sources différentes : la beauté, l’amour et la nature.

Cette réserve permet de préparer une réflexion équilibrée. À cette étape, il n’est pas encore nécessaire de décider l’ordre final des parties ; il faut surtout vérifier que chaque idée répond à la problématique.

## Mise en situation guidée — Inspiration poétique

Pour la question « la poésie n’a-t-elle pour source que la souffrance ? », commence par deux colonnes de recherche : idées qui confirment la thèse, idées qui la nuancent. Range d’un côté les formes de souffrance relevées par le support, de l’autre la beauté, l’amour et la nature. Tu obtiens ainsi une réserve vérifiable avant de construire le plan.

## Auto-vérification

Je sais rechercher des idées si je peux produire plusieurs arguments liés au problème, associer à chacun une illustration pertinente, expliquer ce lien et conserver des idées qui permettront ensuite de discuter la thèse.

| Vocabulaire | Sens utile |
|---|---|
| Argument | Idée qui répond au problème de réflexion. |
| Illustration | Exemple littéraire utilisé pour éclairer un argument. |
| Champ de recherche | Ensemble des œuvres et genres possibles pour chercher des exemples. |
| Nuance | Idée qui limite, complète ou complexifie une affirmation. |`,
    rows: [
      ["À quel moment doit-on classer définitivement les idées dans un plan ?", ["Après les avoir cherchées, lors de l’élaboration du plan", "Avant de comprendre le sujet", "Avant de formuler la problématique"], ["Après les avoir cherchées, lors de l’élaboration du plan"], "La séance 2 constitue une réserve d’idées ; la séance 3 les hiérarchise."],
      ["Quel exemple illustre dans le support la dénonciation de l’excision des filles ?", ["Rebelle de Fatou Keïta", "Dom Juan de Molière", "Les Châtiments de Victor Hugo"], ["Rebelle de Fatou Keïta"], "Le support rattache Rebelle à une pratique socio-culturelle néfaste."],
      ["Pourquoi un titre d’œuvre seul ne suffit-il pas ?", ["Il faut expliquer le lien entre l’œuvre et l’argument", "Un titre remplace toujours la problématique", "Il interdit toute discussion"], ["Il faut expliquer le lien entre l’œuvre et l’argument"], "L’illustration doit éclairer l’idée avancée."],
      ["Quelle idée nuance la thèse selon laquelle la poésie vient seulement des tourments ?", ["La beauté peut inspirer le poète", "La poésie ne possède aucun sujet", "Il faut supprimer les exemples"], ["La beauté peut inspirer le poète"], "Le support mentionne la beauté, l’amour et la nature comme sources d’inspiration."],
    ],
  },
  {
    title: "Séance 3 : Élaborer un plan",
    description: "Regrouper et hiérarchiser les idées, construire un plan dialectique, prévoir une transition et détailler les sous-parties.",
    content: `# Dissertation littéraire — Séance 3 : Élaborer un plan

## Objectif de la séance

Un plan n’est pas une simple liste d’idées. Le support demande de regrouper les idées convergentes, de donner des titres aux ensembles et de les hiérarchiser selon un ordre logique et d’importance. Le choix du plan dépend du verbe de la consigne.

## 1. Passer de la réserve d’idées au plan

| Étape | Action attendue |
|---|---|
| Regrouper | Mettre ensemble les idées qui défendent la même direction. |
| Donner un titre | Formuler l’idée directrice de chaque partie. |
| Hiérarchiser | Aller d’une idée claire à une idée plus large ou plus décisive, selon la logique retenue. |
| Prévoir les liens | Préparer une transition qui explique le passage à la partie suivante. |

La consigne « Expliquez et discutez » conduit ici au **plan dialectique** : une thèse qui justifie la pensée proposée, puis une antithèse qui en montre les limites ou insuffisances. La conclusion devra ensuite répondre avec mesure à la problématique ; elle ne doit pas recopier les titres.

## 2. Exemple : le rôle de l’écrivain

Pour le sujet Le Clézio, le support formule la thèse : « le rôle de l’écrivain consiste à dénoncer certaines tares sociales ». Cette première partie peut regrouper la mauvaise gouvernance, les abus du pouvoir, les inégalités et injustices sociales, les pratiques culturelles néfastes et la critique des mœurs.

| Partie I : l’écrivain dénonce des tares sociales | Exemples cités par le support |
|---|---|
| Pouvoir et mauvaise gouvernance | *Tribaliques* d’Henri Lopes ; *Les Châtiments* de Victor Hugo ; *Les voix dans le vent* de Bernard Dadié. |
| Inégalités et injustices | *Ville cruelle* d’Eza Boto ; *Germinal* d’Émile Zola ; *Le vieux nègre et la médaille* de Ferdinand Oyono ; *Les Misérables* de Victor Hugo. |
| Pratiques et mœurs | *Rebelle* de Fatou Keïta ; *L’aventure ambiguë* de Cheikh Hamidou Kane ; *Dom Juan* de Molière. |

La transition proposée par le support interroge : peut-on confiner l’écrivain dans l’unique fonction de dénonciateur ? Cette question annonce la discussion sans abandonner l’idée précédente.

## 3. Construire l’antithèse sans contredire au hasard

L’antithèse ne consiste pas à dire que la thèse est entièrement fausse. Elle montre qu’elle est insuffisante. Le support cite d’autres rôles : exprimer des sentiments personnels, divertir par le comique, l’humour, l’évasion ou le rêve, et rechercher le beau et l’esthétique.

| Partie II : l’écrivain assume aussi d’autres rôles | Exemples du support |
|---|---|
| Exprimer amour ou haine | *Phèdre* de Jean Racine ; « À une passante » dans *Les Fleurs du mal* ; *Les frasques d’Ebinto*. |
| Divertir et faire rêver | *On se chamaille pour un siège* d’Hyacinthe Kacou ; *L’Avare* de Molière ; *L’Île au trésor* de Robert Louis Stevenson. |
| Rechercher le beau | *Cahier d’un retour au pays natal* d’Aimé Césaire ; *Les soleils des indépendances* d’Ahmadou Kourouma ; *Calligrammes* de Guillaume Apollinaire. |

## Mise en situation guidée — Le sujet Barthes

Le support demande de détailler la thèse selon laquelle l’univers poétique est rempli de tourments. Regroupe les idées : situations difficiles de la vie, angoisses existentielles, guerres. Les illustrations fournies comprennent *Les Contemplations* de Victor Hugo, *Les Nuits* d’Alfred de Musset, *Phèdre* de Jean Racine, « Le Lac » de Lamartine, le « Spleen » de Baudelaire et « Le Dormeur du val » de Rimbaud.

> **Conseil de méthode :** dans un plan détaillé, chaque sous-partie doit être formulée comme une idée complète et recevoir une illustration expliquée. Évite les titres vagues comme « premier argument » ou « exemple 2 ».

## Auto-vérification

Je sais élaborer un plan si je peux expliquer la différence entre une réserve d’idées et des parties hiérarchisées, donner des titres précis, annoncer une transition logique et montrer pourquoi l’antithèse limite la thèse sans l’annuler.

| Vocabulaire | Sens utile |
|---|---|
| Plan dialectique | Organisation qui confronte une thèse et ses limites. |
| Thèse | Partie qui justifie l’idée proposée. |
| Antithèse | Partie qui montre les limites ou insuffisances de cette idée. |
| Transition | Lien logique entre deux parties. |
| Hiérarchisation | Classement raisonné des idées selon leur importance et leur cohérence. |`,
    rows: [
      ["Quelle action vient après la recherche pêle-mêle des idées ?", ["Les regrouper et les hiérarchiser", "Les recopier sans titre", "Supprimer les exemples"], ["Les regrouper et les hiérarchiser"], "Le plan organise les idées convergentes dans un ordre logique."],
      ["Dans le plan dialectique du support, quel est le rôle de l’antithèse ?", ["Montrer les limites ou insuffisances de la thèse", "Répéter la thèse sans changement", "Présenter la biographie de l’auteur"], ["Montrer les limites ou insuffisances de la thèse"], "L’antithèse nuance la thèse au lieu de la nier sans justification."],
      ["Quelle transition propose le support après la dénonciation des tares sociales ?", ["Peut-on confiner l’écrivain dans l’unique fonction de dénonciateur ?", "L’écrivain ne lit jamais", "Fin du devoir"], ["Peut-on confiner l’écrivain dans l’unique fonction de dénonciateur ?"], "Cette question prépare les autres rôles de l’écrivain."],
      ["Quel ensemble correspond à un rôle autre que dénoncer ?", ["Divertir, faire rêver et rechercher le beau", "Refuser toute œuvre littéraire", "Supprimer les sentiments"], ["Divertir, faire rêver et rechercher le beau"], "Le support associe ces fonctions à plusieurs œuvres de théâtre, de roman et de poésie."],
    ],
  },
];

const exerciseSql = (id, rows) => `insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values ${rows.map(([prompt, options, correct, explanation], index) => `(${id},'single_choice',${sqlText(prompt)},${jsonArray(options)},${jsonArray(correct)},${sqlText(explanation)},${(index + 1) * 10})`).join(",")};`;
const quizSql = (id, session, type, rows, displayOrder) => {
  const questions = rows.map(([question, , , explanation], index) => `(${id},${sqlText(question)},${sqlText(explanation)},'single_choice',${(index + 1) * 10},1,true)`).join(",");
  const answers = rows.flatMap(([, options, correct], index) => options.map((option, optionIndex) => `(${(index + 1) * 10},${sqlText(option)},${correct.includes(option)},${(optionIndex + 1) * 10})`)).join(",");
  return `insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active,is_test_data) values (target.subject_id,target.level_id,target.series_id,target.offering_id,target_chapter_id,target_lesson_id,${sqlText(`Quiz ${type} — ${session.title}`)},${sqlText(`Vérifie les repères de la ${session.title.toLowerCase()}.`)},'medium',12,${displayOrder},false,false,false) returning id into ${id}; with inserted_questions as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values ${questions} returning id,display_order) insert into public.quiz_answers (question_id,answer,is_correct,display_order) select iq.id,v.answer,v.is_correct,v.display_order from inserted_questions iq join (values ${answers}) as v(question_order,answer,is_correct,display_order) on v.question_order=iq.display_order;`;
};
const sessionSql = (session, index) => {
  const exerciseA = `session_${index + 1}_exercise_a`; const exerciseB = `session_${index + 1}_exercise_b`; const quizA = `session_${index + 1}_quiz_a`; const quizB = `session_${index + 1}_quiz_b`; const base = (index + 1) * 100;
  return `insert into public.lesson_sessions (lesson_id,title,description,content,display_order,is_active,is_test_data) values (target_lesson_id,${sqlText(session.title)},${sqlText(session.description)},${sqlText(session.content)},${(index + 1) * 10},false,false);
insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order,is_test_data) values (target.subject_id,target.level_id,target.series_id,target_chapter_id,target_lesson_id,${sqlText(`Exercice d’application — ${session.title}`)},${sqlText("Réponds à partir de la méthode étudiée dans cette séance.")},${sqlText("La correction explique la démarche et le lien avec la méthode.")},'single_choice','medium',${sqlText("Lis les termes du sujet, puis justifie ton choix grâce au cours.")},${sqlText("Compare la réponse retenue avec les étapes de la méthode.")},false,false,18,${base + 10},false) returning id into ${exerciseA};
${exerciseSql(exerciseA, session.rows)}
insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order,is_test_data) values (target.subject_id,target.level_id,target.series_id,target_chapter_id,target_lesson_id,${sqlText(`Exercice de consolidation — ${session.title}`)},${sqlText("Réinvestis la notion dans une nouvelle formulation et lis la correction détaillée.")},${sqlText("La correction rappelle la règle méthodologique à utiliser.")},'single_choice','medium',${sqlText("Élimine les réponses qui ne respectent pas la progression de la dissertation.")},${sqlText("Reformule ensuite la règle méthodologique en une phrase.")},false,false,18,${base + 20},false) returning id into ${exerciseB};
${exerciseSql(exerciseB, session.rows.slice().reverse())}
${quizSql(quizA, session, "A — Repères", session.rows, base + 10)}
${quizSql(quizB, session, "B — Méthode", session.rows.slice().reverse(), base + 20)}`;
};

const migration = `-- Dissertation littéraire Terminale : séances 1 à 3, structure dédiée et contenus brouillons.
create table if not exists public.lesson_sessions (
  id uuid primary key default gen_random_uuid(), lesson_id uuid not null references public.lessons(id) on delete cascade,
  title text not null, description text, content text not null, display_order integer not null default 0,
  is_active boolean not null default false, is_test_data boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (lesson_id, display_order), unique (lesson_id, title)
);
alter table public.lesson_sessions enable row level security;
drop policy if exists lesson_sessions_select on public.lesson_sessions;
drop policy if exists lesson_sessions_admin_all on public.lesson_sessions;
create policy lesson_sessions_select on public.lesson_sessions for select to authenticated using (
  (select public.is_edutech_admin()) or (
    is_active is true and exists (select 1 from public.lessons l join public.chapters c on c.id=l.chapter_id join public.course_subject_offerings o on o.id=c.subject_offering_id join public.subjects sub on sub.id=o.subject_id where l.id=lesson_sessions.lesson_id and l.is_active is true and c.is_active is true and o.is_published is true and sub.is_active is true and public.can_access_course_target(o.level_id,o.series_id))
  )
);
create policy lesson_sessions_admin_all on public.lesson_sessions for all to authenticated using ((select public.is_edutech_admin())) with check ((select public.is_edutech_admin()));

do $french_dissertation_sessions$
declare target record; target_chapter_id uuid; target_lesson_id uuid; count_offers integer;
  session_1_exercise_a uuid; session_1_exercise_b uuid; session_1_quiz_a uuid; session_1_quiz_b uuid;
  session_2_exercise_a uuid; session_2_exercise_b uuid; session_2_quiz_a uuid; session_2_quiz_b uuid;
  session_3_exercise_a uuid; session_3_exercise_b uuid; session_3_quiz_a uuid; session_3_quiz_b uuid;
begin
  select count(*) into count_offers from public.course_subject_offerings where id in (${offerings.map(sqlText).join(",")}) and is_test_data=false;
  if count_offers<>4 then raise exception 'Les quatre offres Français Terminale officielles sont requises.'; end if;
  if exists (select 1 from public.lesson_sessions s join public.lessons l on l.id=s.lesson_id join public.chapters c on c.id=l.chapter_id where c.subject_offering_id in (${offerings.map(sqlText).join(",")}) and s.title in (${sessions.map((session) => sqlText(session.title)).join(",")})) then raise exception 'Des séances Dissertation existent déjà : duplication ou écrasement interdit.'; end if;
  for target in select o.id as offering_id,o.subject_id,o.level_id,o.series_id,se.name as series_name from public.course_subject_offerings o join public.series se on se.id=o.series_id where o.id in (${offerings.map(sqlText).join(",")}) and o.is_test_data=false order by se.name loop
    select c.id,l.id into target_chapter_id,target_lesson_id from public.chapters c join public.lessons l on l.chapter_id=c.id where c.subject_offering_id=target.offering_id and l.title ilike '%DISSERTATION LITTÉRAIRE%' and c.is_test_data=false and l.is_test_data=false limit 1;
    if target_lesson_id is null then
      select c.id into target_chapter_id from public.chapters c where c.subject_offering_id=target.offering_id and c.title ilike '%EXPRESSION ÉCRITE%' and c.is_test_data=false limit 1;
    end if;
    if target_chapter_id is null then
      if target.series_name<>'A2' then raise exception 'Le chapitre Expression écrite officiel est requis pour la série %.',target.series_name; end if;
      insert into public.chapters (subject_id,level_id,series_id,subject_offering_id,title,description,display_order,is_test_data,is_active) values (target.subject_id,target.level_id,target.series_id,target.offering_id,'EXPRESSION ÉCRITE','Méthodes d’expression écrite — structure créée pour la dissertation littéraire.',20,false,false) returning id into target_chapter_id;
    end if;
    if target_lesson_id is null then
      select l.id into target_lesson_id from public.lessons l where l.chapter_id=target_chapter_id and l.title ilike '%DISSERTATION LITTÉRAIRE%' and l.is_test_data=false limit 1;
    end if;
    if target_lesson_id is null then
      if target.series_name<>'A2' then raise exception 'La leçon Dissertation littéraire officielle est requise pour la série %.',target.series_name; end if;
      insert into public.lessons (chapter_id,title,description,content,display_order,is_test_data,is_active) values (target_chapter_id,'Leçon 1 : La Dissertation littéraire','Méthodologie structurée en séances : analyser, rechercher, organiser puis rédiger.',null,10,false,false) returning id into target_lesson_id;
    end if;
    if exists (select 1 from public.lessons l where l.id=target_lesson_id and coalesce(l.content,'')<>'') then raise exception 'La leçon Dissertation cible possède déjà un contenu : écrasement interdit.'; end if;
${sessions.map(sessionSql).join("\n")}
  end loop;
end $french_dissertation_sessions$;`;

writeFileSync(migrationPath, migration, "utf8");
writeFileSync(payloadPath, `${JSON.stringify({ project_id: "nnshioowwniursnozicg", name: "french_terminal_dissertation_sessions_drafts", query: migration }, null, 2)}\n`, "utf8");
console.log(migrationPath); console.log(payloadPath);
