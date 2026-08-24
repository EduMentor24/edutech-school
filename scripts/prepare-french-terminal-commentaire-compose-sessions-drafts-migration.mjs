import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const migrationPath = resolve(root, "supabase/migrations/20260824_french_terminal_commentaire_compose_sessions_drafts.sql");
const payloadPath = resolve(root, "supabase/migrations/20260824_french_terminal_commentaire_compose_sessions_drafts.apply.json");
const offerings = ["57b5ca6e-6add-4c7a-98cd-5a99a0a46eb9", "f7fd326f-2e6f-4679-9982-7c40184b80e5", "cba5f18f-ed57-4288-936b-f40920335538", "44cb0105-3955-4038-9811-13ba83bcce8a"];
const q = (value) => { const tag = "$commentaire_compose$"; if (value.includes(tag)) throw new Error("Délimiteur SQL présent dans le contenu."); return `${tag}${value}${tag}`; };
const array = (values) => `jsonb_build_array(${values.map(q).join(",")})`;

const sessions = [
  { title: "Séance 1 : Analyser la construction et l’organisation", order: 10, description: "Lire le libellé, dégager les centres d’intérêt et organiser indices, procédés et interprétations.", content: `# Commentaire composé — Séance 1 : Analyser la construction et l’organisation

## Objectif

Avant de rédiger, il faut comprendre **ce que le libellé demande** et comment le texte peut répondre à cette demande. Le commentaire composé ne consiste ni à raconter le texte ni à relever des figures isolées : il organise une lecture démontrée autour de centres d’intérêt.

## 1. Lire le libellé avec précision

| Élément | Ce qu’il faut repérer | Exemple du support |
|---|---|---|
| **Consigne** | Le travail attendu. | « Faites un commentaire composé ». |
| **Information** | Les axes ou directions déjà proposés. | La gloire du palais puis ses déboires. |
| **Limite** | Ce qu’il ne faut pas faire. | Ne pas transformer le commentaire en étude linéaire. |

Dans le support sur **« Le palais hanté »** d’Edgar Allan Poe, le premier axe concerne le rayonnement ancien du palais ; le second sa décadence. Ces formulations ne sont pas encore des paragraphes : elles deviennent des centres d’intérêt lorsque tu les relies à des indices précis du texte.

## 2. Construire le sens avant les procédés

Commence par une lecture globale : quel est le thème ? quelle est la nature du texte ? quelle tonalité domine ? quelle idée générale se dégage ? Le support associe ici le palais au rêve, à la grandeur passée puis au déclin ; il identifie une tonalité pathétique et un regret lié à une gloire disparue.

> **Règle :** le procédé ne vient qu’après le sens. Tu ne cherches pas une hyperbole « pour avoir une figure » ; tu montres comment elle éclaire une idée du texte.

## 3. Organiser un tableau de commentaire

| Centre d’intérêt | Indice textuel | Procédé certain | Interprétation |
|---|---|---|---|
| Gloire ambiante du palais | Mots de lumière, de richesse ou de beauté. | Champ lexical, gradation, vocabulaire mélioratif. | Le palais apparaît élevé, harmonieux et féerique. |
| Déboires du palais | Marques de rupture, de mort, de déclin ou de désenchantement. | Négation, comparaison, vocabulaire péjoratif, rythme. | La grandeur ancienne se dégrade et le mal s’installe. |

Un **indice** est un mot, un groupe de mots, une construction ou une place dans le texte. Un **procédé** nomme une organisation d’écriture quand elle est vérifiable. L’**interprétation** explique ce que cet indice produit dans la lecture. Si tu ne peux pas expliquer le lien, ton relevé reste incomplet.

## 4. Mise en situation : « Ma Bohème »

Le support propose deux centres d’intérêt : la misère du poète et les étonnants pouvoirs de la poésie. Pour la misère, les poches crevées, les vêtements troués et les routes sont des indices. Ils peuvent être regroupés sous les thèmes directeurs de la pauvreté vestimentaire et financière. Ne confonds pas ces sous-thèmes avec une simple liste de citations.

## Méthode en cinq gestes

1. Souligner la consigne et les informations du libellé.
2. Formuler les centres d’intérêt avec des groupes nominaux précis.
3. Relever seulement les indices utiles à chaque axe.
4. Nommer le procédé avec prudence.
5. Formuler une interprétation complète : « ce procédé met en évidence… ».

## Auto-vérification

Je sais préparer un commentaire si je peux distinguer consigne, information et centre d’intérêt ; relier un indice à un procédé et à une interprétation ; organiser deux axes sans raconter le texte ligne après ligne.

| Vocabulaire | Sens utile |
|---|---|
| Centre d’intérêt | Grande direction de lecture qui organise une partie du commentaire. |
| Indice textuel | Élément précis du texte utilisé comme preuve. |
| Procédé | Manière d’écrire repérable et nommable. |
| Interprétation | Explication de l’effet de sens produit. |`, rows: [
    ["Dans un libellé de commentaire composé, que désigne l’information ?", ["Les axes ou directions proposés", "Le nom de l’élève", "La note finale"], ["Les axes ou directions proposés"], "L’information du libellé aide à dégager les centres d’intérêt."],
    ["Quel ordre respecte une analyse solide ?", ["Indice, procédé, interprétation", "Conclusion, titre, hasard", "Biographie, résumé, copie"], ["Indice, procédé, interprétation"], "L’interprétation explique toujours l’effet de l’élément relevé."],
    ["Que faut-il éviter dans un commentaire composé ?", ["Une étude linéaire qui ignore les axes", "Des centres d’intérêt précis", "Des citations courtes expliquées"], ["Une étude linéaire qui ignore les axes"], "Le commentaire organise une lecture par centres d’intérêt."],
    ["Quel axe correspond au second mouvement du support sur le palais ?", ["Les déboires et la décadence du palais", "La biographie de Poe", "La définition du roman"], ["Les déboires et la décadence du palais"], "Le second centre d’intérêt s’appuie sur les marques de déclin et de désenchantement."],
  ] },
  { title: "Séance 2 : Rédiger les centres d’intérêt", order: 20, description: "Transformer un tableau d’analyse en paragraphes démonstratifs avec idée directrice, citations expliquées et bilan.", content: `# Commentaire composé — Séance 2 : Rédiger les centres d’intérêt

## Objectif

Un tableau est une préparation. Pour rédiger un centre d’intérêt, transforme ses éléments en un paragraphe suivi qui démontre une idée. Le lecteur doit comprendre à la fois **ce que tu affirmes**, **sur quoi tu t’appuies** et **pourquoi cela éclaire le texte**.

## 1. Le paragraphe de centre d’intérêt

| Moment | Fonction | Formulation utile |
|---|---|---|
| **Idée directrice** | Annoncer le centre d’intérêt et ses sous-thèmes. | « Le poème met d’abord en valeur… » |
| **Analyse 1** | Insérer une citation courte, nommer un procédé et l’expliquer. | « Le lexique de… suggère… » |
| **Analyse 2** | Ajouter un indice complémentaire, sans répétition. | « Cette impression se renforce lorsque… » |
| **Bilan partiel** | Fermer le mouvement et préparer le suivant. | « Ainsi, le texte fait apparaître… » |

Dans le modèle du support, la gloire du palais est présentée sous deux aspects : son caractère somptueux et l’aura qui l’entoure. La rédaction part de l’idée, puis explique les termes qui valorisent la beauté, la richesse, la lumière ou l’harmonie. La conclusion partielle rappelle que cette splendeur reste menacée par les déboires qui suivent.

## 2. Citer sans empiler

Une citation courte suffit souvent. Introduis-la, place-la entre guillemets, puis explique-la immédiatement. Une suite de mots séparés par des virgules devient une liste ; elle ne démontre rien. Le support sur « Ma Bohème » ne s’arrête pas aux poches crevées ou aux vêtements troués : il les relie à la pauvreté vestimentaire et financière du poète.

> **Test simple :** après chaque citation, demande-toi : « Qu’est-ce que ce mot ou cette construction prouve dans mon axe ? » Si tu ne peux pas répondre, développe ou retire le relevé.

## 3. Relier fond et forme

Le correcteur du support rappelle qu’une bonne copie ne dissocie pas le fond de la forme. Ne dis donc pas seulement « il y a une comparaison ». Écris par exemple : « La comparaison rend sensible la faiblesse du poète ; elle nuance ainsi l’image d’une voix lyrique toute-puissante. » L’effet doit toujours servir le centre d’intérêt.

## 4. Mise en situation guidée

Pour rédiger la misère du poète dans « Ma Bohème », commence par une phrase d’idée directrice : la pauvreté atteint son apparence et ses conditions matérielles. Introduis ensuite deux ou trois indices liés à l’habillement ou au manque d’argent. Explique les groupes nominaux et, si tu utilises l’hyperbole, précise en quoi elle amplifie la misère. Termine en montrant que cette pauvreté n’empêche pas la poésie de transformer l’expérience.

## 5. Révision du paragraphe

Vérifie les connecteurs, l’accord des temps, la présence d’un sujet clair et la progression du paragraphe. Évite les expressions floues comme « cela montre beaucoup de choses ». Remplace-les par une interprétation précise : perte d’éclat, souffrance, enfermement, idéal, dénonciation ou espoir, selon l’axe étudié.

## Auto-vérification

Je sais rédiger un centre d’intérêt si mon paragraphe contient une idée directrice, des preuves brèves, l’explication des procédés, des connecteurs et une phrase-bilan.

| Vocabulaire | Sens utile |
|---|---|
| Idée directrice | Phrase qui annonce l’idée défendue dans le paragraphe. |
| Citation courte | Fragment précis intégré à une phrase grammaticale. |
| Bilan partiel | Phrase qui clôt un mouvement avant la suite. |
| Connecteur | Mot ou groupe de mots qui explicite le lien logique. |`, rows: [
    ["Quelle phrase doit ouvrir un centre d’intérêt rédigé ?", ["L’idée directrice", "Une liste de citations", "La conclusion générale"], ["L’idée directrice"], "L’idée directrice annonce clairement le mouvement analysé."],
    ["Après une citation courte, que faut-il faire ?", ["Expliquer son lien avec l’axe", "Passer directement à un autre texte", "La répéter"], ["Expliquer son lien avec l’axe"], "La citation devient une preuve seulement si elle est interprétée."],
    ["Pourquoi une liste de procédés est-elle insuffisante ?", ["Elle ne montre pas leurs effets de sens", "Elle est toujours fausse", "Elle remplace l’introduction"], ["Elle ne montre pas leurs effets de sens"], "Le commentaire doit relier forme, sens et centre d’intérêt."],
    ["Quelle fonction remplit le bilan partiel ?", ["Clore le mouvement et préparer la suite", "Donner la note", "Présenter l’auteur pour la première fois"], ["Clore le mouvement et préparer la suite"], "Le bilan partiel maintient la cohérence du développement."],
  ] },
  { title: "Séance 3 : Rédiger un commentaire composé", order: 30, description: "Assembler introduction, centres d’intérêt, transitions et conclusion en une rédaction suivie et cohérente.", content: `# Commentaire composé — Séance 3 : Rédiger un commentaire composé

## Objectif

Rédiger un commentaire composé, c’est assembler une introduction, des centres d’intérêt organisés, des transitions et une conclusion. Le support propose des modèles à partir de Lamartine, d’Aimé Césaire et de Maxime N’Debeka. Ces modèles montrent une méthode ; ils ne doivent jamais être recopiés à la place d’une analyse du texte proposé.

## 1. L’architecture du devoir

| Partie | Ce qu’elle réalise | Contrôle avant de continuer |
|---|---|---|
| **Introduction** | Généralité utile, présentation, idée générale et annonce du plan. | Le libellé est-il reformulé sans être déformé ? |
| **Centre 1** | Première direction démontrée avec sous-thèmes et citations expliquées. | Chaque sous-thème sert-il vraiment l’axe ? |
| **Transition** | Bilan bref et annonce raisonnée du centre suivant. | Le passage est-il logique ? |
| **Centre 2** | Seconde direction qui complète, nuance ou élargit la lecture. | Ai-je évité de répéter le centre 1 ? |
| **Conclusion** | Bilan, jugement et ouverture liée. | L’ouverture prolonge-t-elle le commentaire ? |

Le modèle Lamartine fait passer de la plainte personnelle à l’interprétation de la souffrance humaine. Cette progression est lisible parce que la transition signale le dépassement du « je » vers la fraternité. Le modèle Césaire relie la peinture de la maison à la condition sociale de la famille ; il ne sépare pas la description des images et de leur portée sociale.

## 2. Écrire une introduction exacte

L’introduction présente le texte sans multiplier les informations inutiles. Le support peut fournir auteur, œuvre ou date ; utilise seulement ce qui aide à comprendre le texte. Formule ensuite l’idée générale et annonce les centres d’intérêt dans l’ordre où ils seront développés. Pour un texte visuellement organisé comme « 980 000 », la présentation peut indiquer que la disposition sur la page participe au sens, sans inventer une intention non justifiée.

## 3. Faire vivre les transitions

Une transition a deux gestes : elle rappelle l’essentiel de l’axe achevé et prépare la nouvelle direction. Dans l’exemple Césaire, la description de la maison mène vers la condition sociale de la famille. Dans l’exemple Lamartine, la conscience douloureuse du poète s’élargit aux plaintes de la foule. Une transition ne se limite jamais à « passons maintenant à… ».

## 4. Rédiger une conclusion utile

Le bilan répond à la question du libellé ; il ne répète pas chaque citation. Le jugement peut souligner la force d’une écriture, d’une sensibilité ou d’une dénonciation, à condition de le justifier par le parcours d’analyse. L’ouverture reste proche du sujet : un autre texte, une autre voix poétique ou une autre question de lecture, sans abandonner le problème traité.

## 5. Situation d’application : « 980 000 »

Le support demande d’étudier l’indignation du poète puis son appel à la libération du peuple. Avant de rédiger, tu peux organiser les indices : nombres, répétitions, disposition typographique, vocabulaire de la faim, métaphores ou ironie. Dans le paragraphe, explique comment chaque procédé participe à la dénonciation des inégalités ; dans la conclusion, fais le bilan de cette parole engagée et ouvre avec prudence vers une autre voix qui interroge la dignité ou la libération.

## Relecture finale

Relis le libellé, vérifie que tous les centres d’intérêt annoncés sont développés, contrôle les citations et la ponctuation, puis assure-toi que chaque procédé est relié à un effet de sens. Ne transforme pas le devoir en biographie d’auteur, en résumé ou en étude linéaire.

| Vocabulaire | Sens utile |
|---|---|
| Transition | Passage raisonné entre deux centres d’intérêt. |
| Texte engagé | Texte qui prend position sur une question humaine ou sociale. |
| Étude linéaire | Lecture qui suit l’ordre du texte sans organiser d’axes ; elle ne répond pas ici à la consigne de commentaire composé. |
| Ouverture | Prolongement final cohérent avec le problème traité. |`, rows: [
    ["Quelle est la fonction d’une transition dans un commentaire composé ?", ["Faire le bilan d’un axe et annoncer le suivant", "Ajouter une biographie longue", "Répéter l’introduction"], ["Faire le bilan d’un axe et annoncer le suivant"], "La transition rend l’enchaînement entre les centres d’intérêt logique."],
    ["Quel risque le support demande-t-il d’éviter ?", ["Dissocier le fond et la forme ou faire une étude linéaire", "Analyser des citations courtes", "Annoncer deux centres d’intérêt"], ["Dissocier le fond et la forme ou faire une étude linéaire"], "Le commentaire doit organiser la forme et le sens autour d’axes."],
    ["Dans une introduction, que faut-il annoncer ?", ["Les centres d’intérêt dans leur ordre de développement", "Toutes les citations du texte", "La conclusion avant le plan"], ["Les centres d’intérêt dans leur ordre de développement"], "L’annonce du plan guide le lecteur dans la progression du commentaire."],
    ["Que doit faire la conclusion ?", ["Faire le bilan et proposer une ouverture liée", "Ajouter un centre d’intérêt entier", "Recopier le développement"], ["Faire le bilan et proposer une ouverture liée"], "La conclusion ferme le raisonnement et prolonge avec cohérence."],
  ] },
];

const exerciseSql = (id, rows) => `insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values ${rows.map(([p,o,c,e],i)=>`(${id},'single_choice',${q(p)},${array(o)},${array(c)},${q(e)},${(i+1)*10})`).join(",")};`;
const quizSql = (id, session, label, rows, order) => { const qs=rows.map(([p,,,e],i)=>`(${id},${q(p)},${q(e)},'single_choice',${(i+1)*10},1,true)`).join(","); const as=rows.flatMap(([,o,c],i)=>o.map((a,j)=>`(${(i+1)*10},${q(a)},${c.includes(a)},${(j+1)*10})`)).join(","); return `insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active,is_test_data) values (target.subject_id,target.level_id,target.series_id,target.offering_id,target_chapter_id,target_lesson_id,${q(`Quiz ${label} — ${session.title}`)},${q(`Vérifie la méthode de ${session.title.toLowerCase()}.`)},'medium',12,${order},false,false,false) returning id into ${id}; with iq as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values ${qs} returning id,display_order) insert into public.quiz_answers (question_id,answer,is_correct,display_order) select iq.id,v.answer,v.is_correct,v.display_order from iq join (values ${as}) as v(question_order,answer,is_correct,display_order) on v.question_order=iq.display_order;`; };
const makeSession = (s,i) => { const n=i+1, a=`s${n}_ex_a`, b=`s${n}_ex_b`, qa=`s${n}_qa`, qb=`s${n}_qb`, base=n*100; return `insert into public.lesson_sessions (lesson_id,title,description,content,display_order,is_active,is_test_data) values (target_lesson_id,${q(s.title)},${q(s.description)},${q(s.content)},${s.order},false,false); insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order,is_test_data) values (target.subject_id,target.level_id,target.series_id,target_chapter_id,target_lesson_id,${q(`Exercice d’application — ${s.title}`)},${q("Réponds en respectant les étapes méthodologiques de la séance.")},${q("La correction explique le lien entre la réponse et la méthode.")},'single_choice','medium',${q("Lis les consignes puis justifie ton choix par le cours.")},${q("Compare chaque réponse à la démarche explicitée.")},false,false,18,${base+10},false) returning id into ${a}; ${exerciseSql(a,s.rows)} insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order,is_test_data) values (target.subject_id,target.level_id,target.series_id,target_chapter_id,target_lesson_id,${q(`Exercice de consolidation — ${s.title}`)},${q("Réinvestis la notion dans une formulation différente.")},${q("La correction rappelle la règle méthodologique concernée.")},'single_choice','medium',${q("Écarte les réponses qui ne respectent pas la méthode.")},${q("Reformule ensuite la règle en une phrase.")},false,false,18,${base+20},false) returning id into ${b}; ${exerciseSql(b,s.rows.slice().reverse())} ${quizSql(qa,s,"A — Repères",s.rows,base+10)} ${quizSql(qb,s,"B — Méthode",s.rows.slice().reverse(),base+20)}`; };
const migration = `-- Commentaire composé Terminale : séances 1 à 3, toutes en brouillon.
do $commentaire_compose_sessions$
declare target record; target_chapter_id uuid; target_lesson_id uuid; total_offers integer; s1_ex_a uuid; s1_ex_b uuid; s1_qa uuid; s1_qb uuid; s2_ex_a uuid; s2_ex_b uuid; s2_qa uuid; s2_qb uuid; s3_ex_a uuid; s3_ex_b uuid; s3_qa uuid; s3_qb uuid;
begin
 select count(*) into total_offers from public.course_subject_offerings where id in (${offerings.map(q).join(",")}) and is_test_data=false; if total_offers<>4 then raise exception 'Les quatre offres Français Terminale officielles sont requises.'; end if;
 for target in select o.id as offering_id,o.subject_id,o.level_id,o.series_id,se.name as series_name from public.course_subject_offerings o join public.series se on se.id=o.series_id where o.id in (${offerings.map(q).join(",")}) and o.is_test_data=false order by se.name loop
  select c.id,l.id into target_chapter_id,target_lesson_id from public.chapters c join public.lessons l on l.chapter_id=c.id where c.subject_offering_id=target.offering_id and l.title ilike '%COMMENTAIRE COMPOSÉ%' and c.is_test_data=false and l.is_test_data=false limit 1;
  if target_lesson_id is null then select c.id into target_chapter_id from public.chapters c where c.subject_offering_id=target.offering_id and c.title ilike '%EXPRESSION ÉCRITE%' and c.is_test_data=false limit 1; end if;
  if target_lesson_id is null then if target.series_name<>'A2' then raise exception 'La leçon Commentaire composé officielle est requise pour %.',target.series_name; end if; if target_chapter_id is null then raise exception 'Le chapitre Expression écrite officiel A2 est requis.'; end if; insert into public.lessons (chapter_id,title,description,content,display_order,is_test_data,is_active) values (target_chapter_id,'Leçon 2 : LE COMMENTAIRE COMPOSÉ','Méthodologie structurée en séances : analyser, rédiger les axes puis rédiger le commentaire.',null,20,false,false) returning id into target_lesson_id; end if;
  if exists (select 1 from public.lesson_sessions s where s.lesson_id=target_lesson_id and (s.title in (${sessions.map(s=>q(s.title)).join(",")}) or s.display_order in (10,20,30))) then raise exception 'Des séances Commentaire composé existent déjà : duplication ou écrasement interdit.'; end if;
  if exists (select 1 from public.lessons l where l.id=target_lesson_id and coalesce(l.content,'')<>'') then raise exception 'La leçon Commentaire composé cible possède déjà un contenu : écrasement interdit.'; end if;
${sessions.map(makeSession).join("\n")}
 end loop;
end $commentaire_compose_sessions$;`;
writeFileSync(migrationPath,migration,"utf8"); writeFileSync(payloadPath,`${JSON.stringify({project_id:"nnshioowwniursnozicg",name:"french_terminal_commentaire_compose_sessions_drafts",query:migration},null,2)}\n`,`utf8`); console.log(migrationPath); console.log(payloadPath);
