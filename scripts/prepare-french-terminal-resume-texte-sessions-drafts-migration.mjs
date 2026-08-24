import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
const root=resolve(import.meta.dirname,".."); const out=resolve(root,"supabase/migrations/20260824_french_terminal_resume_texte_sessions_drafts.sql"); const json=resolve(root,"supabase/migrations/20260824_french_terminal_resume_texte_sessions_drafts.apply.json");
const offers=["57b5ca6e-6add-4c7a-98cd-5a99a0a46eb9","f7fd326f-2e6f-4679-9982-7c40184b80e5","cba5f18f-ed57-4288-936b-f40920335538","44cb0105-3955-4038-9811-13ba83bcce8a"];
const q=v=>{const t="$resume_argu$";if(v.includes(t))throw Error("Délimiteur SQL présent.");return `${t}${v}${t}`}; const a=vs=>`jsonb_build_array(${vs.map(q).join(",")})`;
const sessions=[
{title:"Séance 1 : Répondre aux consignes d’un texte argumentatif",order:10,description:"Identifier le thème, reformuler la thèse, préciser la visée argumentative et reconnaître une structure de texte.",content:`# Résumé de texte argumentatif — Séance 1 : Répondre aux consignes

## Objectif

Avant de résumer ou de rédiger, réponds exactement aux consignes de compréhension. Le support demande d’identifier le **thème**, de reformuler la **thèse** et de préciser la **visée argumentative**. Ces trois réponses se distinguent : elles ne doivent pas se répéter sous des mots différents.

## 1. Comprendre les trois questions centrales

| Question | Ce que tu cherches | Formulation attendue |
|---|---|---|
| **Quel est le thème ?** | Le sujet général dont parle le texte. | « Le texte porte sur… » |
| **Quelle est la thèse ?** | L’idée défendue par l’auteur. | « L’auteur soutient que… » |
| **Quelle est la visée ?** | L’effet recherché sur le lecteur ou le destinataire. | « L’auteur cherche à convaincre / interpeller… » |

Dans le texte d’Imani Ghana, le corrigé du support retient l’immigration clandestine comme thème. La thèse est reformulée autour de la réduction de la pauvreté pour lutter efficacement contre ce phénomène. La visée ne consiste pas à redire la thèse : elle indique l’interpellation des gouvernants afin qu’ils créent des conditions de maintien de la jeunesse, notamment par l’emploi.

> **Méthode :** une reformulation conserve l’idée essentielle, mais change la formulation. Elle n’est ni une citation longue ni un résumé de tout le texte.

## 2. Appuyer la réponse sur le texte

Lis les connecteurs, les répétitions, les causes, les conséquences et la conclusion. La thèse se trouve souvent dans une phrase qui prend position ou propose une action ; elle peut aussi être annoncée puis précisée à la fin. Ne confonds pas un exemple illustratif avec la thèse générale.

Le support sur la dépigmentation montre ce raisonnement : le thème est la dépigmentation ; la thèse alerte sur les conséquences dangereuses pour les utilisateurs ; la visée cherche à convaincre femmes et hommes de conserver le teint naturel. La structure est donnée en deux mouvements : la généralisation du phénomène, puis ses effets néfastes.

## 3. Répondre avec précision

Une réponse courte peut être complète si elle nomme juste l’objet demandé et s’appuie sur le texte. Évite les jugements personnels, les informations non présentes dans le document et les généralisations non justifiées. Pour expliquer une structure, formule chaque partie comme une idée : ne réponds pas seulement « paragraphe 1, paragraphe 2 ».

## Repère sur le résumé

La séance de source indique que le texte d’Imani Ghana compte **801 mots** et doit être résumé au quart, avec une marge de plus ou moins 10 %. Ce repère de longueur ne remplace pas la compréhension : on ne peut conserver l’essentiel que si thème, thèse, arguments et progression sont d’abord identifiés.

## Auto-vérification

Je sais répondre aux consignes si je peux distinguer thème, thèse et visée, reformuler sans déformer, et résumer la structure en mouvements d’idées.

| Vocabulaire | Sens utile |
|---|---|
| Thème | Sujet général abordé. |
| Thèse | Idée principale défendue. |
| Visée argumentative | Intention de convaincre, persuader, dénoncer ou interpeller. |
| Reformulation | Nouvelle phrase fidèle à une idée initiale. |`,rows:[["Que désigne le thème d’un texte argumentatif ?",["Le sujet général traité","La biographie de l’auteur","La note du résumé"],["Le sujet général traité"],"Le thème nomme le domaine général dont traite le texte."],["Que doit conserver une reformulation de thèse ?",["L’idée essentielle défendue","Chaque mot de la phrase initiale","Les exemples sans l’idée générale"],["L’idée essentielle défendue"],"Reformuler consiste à exprimer fidèlement l’idée avec ses propres mots."],["Quelle réponse décrit la visée argumentative ?",["L’auteur cherche l’effet qu’il veut produire sur le destinataire","Le texte contient uniquement des descriptions","Le résumé doit avoir une marge de 10 %"],["L’auteur cherche l’effet qu’il veut produire sur le destinataire"],"La visée indique l’intention : convaincre, interpeller, alerter ou dénoncer."],["Quelle structure le corrigé associe-t-il au texte sur la dépigmentation ?",["Généralisation puis effets néfastes","Conclusion puis titre","Une liste sans progression"],["Généralisation puis effets néfastes"],"Le support distingue les deux premiers paragraphes et ceux portant sur les conséquences."]] },
{title:"Séance 2 : Analyser le sujet et rechercher les idées",order:20,description:"Distinguer information et consigne, expliquer les mots-clés puis rechercher des idées pertinentes avant la rédaction.",content:`# Résumé de texte argumentatif — Séance 2 : Analyser le sujet et rechercher les idées

## Objectif

La production écrite proposée après le résumé demande un développement organisé et argumenté. Avant de rédiger, analyse le sujet : distingue ce qu’il affirme de ce qu’il te demande de faire, explique ses mots-clés puis rassemble des idées directement utiles.

## 1. Séparer information et consigne

| Partie du sujet | Rôle | Dans le support |
|---|---|---|
| **Information** | Présente l’affirmation ou le problème à examiner. | Réduire la pauvreté en Afrique serait le moyen le plus efficace de lutter contre l’immigration clandestine. |
| **Consigne** | Indique l’opération intellectuelle demandée. | « Vous étayerez cette affirmation ». |

**Étayer** signifie soutenir une idée par des raisons organisées et des exemples appropriés. Ce verbe ne demande ni de recopier le texte ni de répondre par un simple avis. Il invite à construire une démonstration liée à l’affirmation.

## 2. Clarifier le thème, la thèse et les mots-clés

Le support rattache le sujet au thème de l’immigration clandestine. La thèse affirme que la réduction de la pauvreté constitue le moyen le plus efficace de lutte. Des mots-clés comme pauvreté, immigration, exil, exode et déplacement doivent être compris dans le contexte du sujet. Explique-les avec des mots simples, puis relie-les à la question posée.

> **Attention :** définir un mot ne suffit pas. La définition doit t’aider à dégager des pistes d’argumentation ; elle ne doit pas devenir une longue introduction de dictionnaire.

## 3. Rechercher sans se disperser

Commence par des questions : quelles difficultés peuvent pousser au départ ? quelles actions peuvent réduire ces difficultés ? quels domaines relèvent de la société, de l’économie ou de la politique ? Note plusieurs idées, puis élimine celles qui s’éloignent de la thèse. Une idée utile répond toujours au problème formulé.

Pour le sujet du support, tu peux préparer des pistes sur la formation, l’emploi, l’accès aux ressources ou l’insertion des jeunes. La séance suivante apprendra à regrouper ces idées ; à ce stade, ne rédige pas encore un paragraphe complet.

## 4. Construire une réserve d’idées fiable

| Question de contrôle | Si la réponse est non |
|---|---|
| Mon idée répond-elle à l’affirmation ? | Écarte-la ou reformule-la. |
| Puis-je l’expliquer en une phrase ? | Précise le lien logique. |
| Peut-elle rejoindre une autre idée ? | Prépare un futur axe. |
| Est-elle donnée ou permise par le support ? | N’invente pas un fait présenté comme certain. |

## Auto-vérification

Je sais analyser un sujet si je peux isoler l’information et la consigne, expliquer les mots-clés utiles et constituer une réserve d’idées pertinente avant de choisir un plan.

| Vocabulaire | Sens utile |
|---|---|
| Information | Énoncé ou affirmation donné(e) par le sujet. |
| Consigne | Travail que le candidat doit accomplir. |
| Étayer | Soutenir une idée par des arguments organisés. |
| Réserve d’idées | Ensemble d’idées préparées avant leur classement. |`,rows:[["Dans le sujet du support, quelle formule est la consigne ?",["Vous étayerez cette affirmation","Réduire la pauvreté en Afrique","L’immigration clandestine"],["Vous étayerez cette affirmation"],"La consigne indique l’action à réaliser ; l’affirmation constitue l’information."],["Que signifie étayer une affirmation ?",["La soutenir par des arguments organisés","La recopier sans explication","Changer de thème"],["La soutenir par des arguments organisés"],"Étayer demande une démonstration liée au sujet."],["À quel moment faut-il organiser définitivement les idées ?",["Après les avoir recherchées et vérifiées","Avant de comprendre le sujet","Après la conclusion"],["Après les avoir recherchées et vérifiées"],"La recherche prépare une réserve ; l’organisation vient ensuite."],["Quelle idée faut-il écarter ?",["Une idée qui ne répond pas au problème posé","Une idée que l’on peut expliquer","Une idée qui rejoint un axe cohérent"],["Une idée qui ne répond pas au problème posé"],"Chaque idée retenue doit servir directement la thèse à étayer."]] },
{title:"Séance 3 : Organiser l’argumentation",order:30,description:"Classer les idées en axes social, économique et politique puis construire une progression argumentative cohérente.",content:`# Résumé de texte argumentatif — Séance 3 : Organiser l’argumentation

## Objectif

Une bonne argumentation ne juxtapose pas des idées. Elle les regroupe, les hiérarchise et les fait progresser. Le support organise les pistes liées à la pauvreté et à l’immigration clandestine selon trois plans : social, économique et politique.

## 1. Passer de la réserve au plan

| Axe du support | Idées regroupées | Idée directrice possible |
|---|---|---|
| **Social** | Former les jeunes, favoriser l’entrepreneuriat, assouplir les conditions d’embauche. | L’insertion sociale et professionnelle réduit les situations qui poussent au départ. |
| **Économique** | Payer les matières premières à leur juste prix, répartir les ressources, créer des emplois. | Une économie plus équitable peut limiter les causes matérielles de l’exode. |
| **Politique** | Pratiquer la démocratie, mettre en œuvre l’insertion des jeunes. | Des décisions publiques cohérentes donnent un cadre durable aux actions sociales et économiques. |

Les formulations de la dernière colonne sont des **idées directrices** : elles ne remplacent pas les éléments du support ; elles expliquent ce qui les relie. Chaque paragraphe développera une idée directrice avec deux ou trois arguments cohérents.

## 2. Organiser un paragraphe argumentatif

Commence par l’idée directrice. Ajoute ensuite une première raison, explique son lien avec la thèse, puis complète par une autre raison sans répéter la première. Une phrase-bilan clôt le mouvement. Les connecteurs montrent le cheminement : d’abord, ensuite, de plus, ainsi, enfin. Ils doivent exprimer un vrai lien logique, pas seulement décorer le texte.

> **Règle :** un plan par domaines n’est utile que si chaque domaine répond clairement à la question du sujet. Ne présente pas trois titres sans démonstration.

## 3. Préparer les transitions

La transition résume brièvement l’axe terminé et annonce le suivant. Après le plan social, elle peut montrer que la formation et l’insertion doivent être soutenues par des conditions économiques plus équitables. Elle évite les ruptures telles que « passons maintenant à l’économie ».

## 4. Réinvestir la méthode dans une autre situation

Le second sujet du support invite à étayer une affirmation sur la peau naturelle et les produits de dépigmentation. Ici encore, cherche les idées puis classe-les : le texte de référence met en avant la généralisation du phénomène et ses effets néfastes, notamment esthétiques et sur la santé. Ne transpose pas mécaniquement les axes social, économique et politique : le plan dépend toujours du sujet et des idées disponibles.

## Bilan de méthode

Je sais organiser une argumentation si je peux regrouper des idées proches, formuler une idée directrice, ordonner les paragraphes et relier les axes par des transitions utiles.

| Vocabulaire | Sens utile |
|---|---|
| Axe | Grande direction qui rassemble plusieurs arguments. |
| Idée directrice | Argument principal d’un paragraphe. |
| Hiérarchiser | Classer les idées selon leur rôle et leur importance. |
| Transition | Phrase qui relie deux mouvements du raisonnement. |`,rows:[["Quel axe du support rassemble formation, entrepreneuriat et embauche ?",["Le plan social","Le plan économique","Le plan politique"],["Le plan social"],"Ces idées concernent l’insertion et l’accompagnement des jeunes."],["Pourquoi formuler une idée directrice ?",["Pour expliquer le lien entre les arguments d’un paragraphe","Pour supprimer les arguments","Pour répéter la consigne"],["Pour expliquer le lien entre les arguments d’un paragraphe"],"L’idée directrice transforme une liste en démonstration organisée."],["Quelle action relève du plan économique du support ?",["Créer des emplois et répartir équitablement les ressources","Écrire une biographie","Étudier une figure de style"],["Créer des emplois et répartir équitablement les ressources"],"Le support classe ces actions parmi les pistes économiques."],["Quelle est la fonction d’une transition ?",["Relier l’axe terminé à celui qui suit","Donner la note de l’élève","Ajouter un sujet sans rapport"],["Relier l’axe terminé à celui qui suit"],"La transition rend la progression argumentative visible."]] }
];
const eq=(id,r)=>`insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values ${r.map(([p,o,c,e],i)=>`(${id},'single_choice',${q(p)},${a(o)},${a(c)},${q(e)},${(i+1)*10})`).join(",")};`;
const quiz=(id,s,label,r,ord)=>{const qs=r.map(([p,,,e],i)=>`(${id},${q(p)},${q(e)},'single_choice',${(i+1)*10},1,true)`).join(",");const ans=r.flatMap(([,o,c],i)=>o.map((x,j)=>`(${(i+1)*10},${q(x)},${c.includes(x)},${(j+1)*10})`)).join(",");return `insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active,is_test_data) values (target.subject_id,target.level_id,target.series_id,target.offering_id,target_chapter_id,target_lesson_id,${q(`Quiz ${label} — ${s.title}`)},${q(`Vérifie les repères de ${s.title.toLowerCase()}.`)},'medium',12,${ord},false,false,false) returning id into ${id}; with iq as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values ${qs} returning id,display_order) insert into public.quiz_answers(question_id,answer,is_correct,display_order) select iq.id,v.answer,v.is_correct,v.display_order from iq join (values ${ans}) as v(question_order,answer,is_correct,display_order) on v.question_order=iq.display_order;`};
const make=(s,i)=>{const n=i+1,A=`s${n}a`,B=`s${n}b`,QA=`s${n}qa`,QB=`s${n}qb`,base=n*100;return `insert into public.lesson_sessions (lesson_id,title,description,content,display_order,is_active,is_test_data) values (target_lesson_id,${q(s.title)},${q(s.description)},${q(s.content)},${s.order},false,false); insert into public.exercises(subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order,is_test_data) values(target.subject_id,target.level_id,target.series_id,target_chapter_id,target_lesson_id,${q(`Exercice d’application — ${s.title}`)},${q("Réponds à partir de la méthode étudiée dans la séance.")},${q("La correction explicite la démarche attendue.")},'single_choice','medium',${q("Lis chaque consigne puis justifie ton choix grâce au cours.")},${q("Compare la réponse avec la méthode retenue.")},false,false,18,${base+10},false) returning id into ${A}; ${eq(A,s.rows)} insert into public.exercises(subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order,is_test_data) values(target.subject_id,target.level_id,target.series_id,target_chapter_id,target_lesson_id,${q(`Exercice de consolidation — ${s.title}`)},${q("Réinvestis la démarche dans une formulation différente.")},${q("La correction rappelle la règle de méthode concernée.")},'single_choice','medium',${q("Écarte les réponses qui ne respectent pas la progression de la séance.")},${q("Reformule ensuite la règle en une phrase.")},false,false,18,${base+20},false) returning id into ${B}; ${eq(B,s.rows.slice().reverse())} ${quiz(QA,s,"A — Repères",s.rows,base+10)} ${quiz(QB,s,"B — Méthode",s.rows.slice().reverse(),base+20)}`};
const migration=`-- Résumé de texte argumentatif Terminale : trois séances brouillon à partir des PDF fournis.
do $resume_texte_sessions$
declare target record; target_chapter_id uuid; target_lesson_id uuid; count_offers integer; s1a uuid;s1b uuid;s1qa uuid;s1qb uuid;s2a uuid;s2b uuid;s2qa uuid;s2qb uuid;s3a uuid;s3b uuid;s3qa uuid;s3qb uuid;
begin
 select count(*) into count_offers from public.course_subject_offerings where id in (${offers.map(q).join(",")}) and is_test_data=false; if count_offers<>4 then raise exception 'Les quatre offres Français Terminale officielles sont requises.'; end if;
 for target in select o.id as offering_id,o.subject_id,o.level_id,o.series_id,se.name as series_name from public.course_subject_offerings o join public.series se on se.id=o.series_id where o.id in (${offers.map(q).join(",")}) and o.is_test_data=false order by se.name loop
  select c.id,l.id into target_chapter_id,target_lesson_id from public.chapters c join public.lessons l on l.chapter_id=c.id where c.subject_offering_id=target.offering_id and (l.title ilike '%RÉSUMÉ DU TEXTE ARGUMENTATIF%' or l.title ilike '%RESUME DU TEXTE ARGUMENTATIF%') and c.is_test_data=false and l.is_test_data=false limit 1;
  if target_lesson_id is null then select c.id into target_chapter_id from public.chapters c where c.subject_offering_id=target.offering_id and c.title ilike '%EXPRESSION ÉCRITE%' and c.is_test_data=false limit 1; end if;
  if target_lesson_id is null then if target.series_name<>'A2' then raise exception 'La leçon Résumé de texte argumentatif officielle est requise pour %.',target.series_name; end if; if target_chapter_id is null then raise exception 'Le chapitre Expression écrite officiel A2 est requis.'; end if; insert into public.lessons(chapter_id,title,description,content,display_order,is_test_data,is_active) values(target_chapter_id,'Leçon 3 : RÉSUMÉ DU TEXTE ARGUMENTATIF','Méthodologie structurée en séances : répondre aux consignes, analyser le sujet puis organiser l’argumentation.',null,30,false,false) returning id into target_lesson_id; end if;
  if exists(select 1 from public.lessons l where l.id=target_lesson_id and coalesce(l.content,'')<>'') then raise exception 'La leçon Résumé cible possède déjà un contenu : écrasement interdit.'; end if;
  if exists(select 1 from public.lesson_sessions s where s.lesson_id=target_lesson_id and (s.title in (${sessions.map(s=>q(s.title)).join(",")}) or s.display_order in (10,20,30))) then raise exception 'Des séances Résumé existent déjà : duplication ou écrasement interdit.'; end if;
  if exists(select 1 from public.exercises e where e.lesson_id=target_lesson_id and e.is_test_data=false) or exists(select 1 from public.quizzes qz where qz.lesson_id=target_lesson_id and qz.is_test_data=false) then raise exception 'La leçon Résumé cible possède déjà des activités : duplication interdite.'; end if;
${sessions.map(make).join("\n")}
 end loop;
end $resume_texte_sessions$;`;
writeFileSync(out,migration,"utf8");writeFileSync(json,`${JSON.stringify({project_id:"nnshioowwniursnozicg",name:"french_terminal_resume_texte_sessions_drafts",query:migration},null,2)}\n`);console.log(out);console.log(json);
