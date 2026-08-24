import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const migrationPath = resolve(root, "supabase/migrations/20260824_computer_hardware_deepening_drafts.sql");
const payloadPath = resolve(root, "supabase/migrations/20260824_computer_hardware_deepening_drafts.apply.json");
const offerings = ["0beafff1-63db-42c9-99a2-8ef6da799f19", "7680fb4a-c9d4-41df-92f3-a91effda4944", "7695b4cf-0524-4de4-af91-f8d79eed2b0a", "f9c030a4-8b30-4657-b7bb-d81e4e500635"];
const chapterTitle = "Maîtriser son ordinateur : comprendre, utiliser et s’organiser";
const materialTitle = "Découvrir l’ordinateur : matériel, logiciels et système";
const sqlText = (value) => { const tag = "$hardware_content$"; if (value.includes(tag)) throw new Error("Délimiteur SQL interdit dans un contenu."); return `${tag}${value}${tag}`; };
const jsonArray = (items) => `jsonb_build_array(${items.map(sqlText).join(",")})`;

const lessons = [
  { title: "Comprendre le cœur de l’ordinateur : processeur, mémoire et stockage", description: "Approfondissement débutant : rôle du processeur, de la mémoire vive, du stockage, des composants internes et critères simples de choix.", visual: ":::computer-hardware-diagram", content: `# Maîtriser son ordinateur — Leçon 5 : Le cœur de l’ordinateur

> **Statut pédagogique :** ce cours complémentaire non officiel explique le rôle général des composants. Il ne demande pas de démonter un ordinateur ni de modifier son matériel.

## Objectifs

Tu dois pouvoir expliquer, avec des mots simples, le rôle du [[processeur|unité de traitement|composant qui exécute les instructions et coordonne de nombreux calculs]], de la [[mémoire vive|espace temporaire|zone utilisée pendant le fonctionnement des applications]] et du stockage. Tu dois aussi comprendre pourquoi la rapidité dépend souvent de plusieurs éléments, pas d’un seul chiffre.

:::computer-hardware-diagram

## 1. Trois rôles à ne pas confondre

Le processeur exécute les instructions des programmes. La mémoire vive garde provisoirement à portée de travail les données et applications utilisées maintenant. Le stockage conserve durablement les fichiers, applications et réglages après l’arrêt. Une comparaison imparfaite mais utile consiste à imaginer un élève : le processeur raisonne, la mémoire vive correspond à l’espace de travail sur la table, et le stockage à l’armoire où les documents restent rangés.

| Composant | Rôle général | Ce qu’il ne faut pas croire |
|---|---|---|
| Processeur | Exécuter et coordonner des instructions. | Il ne conserve pas à lui seul tous les documents. |
| Mémoire vive | Garder temporairement des éléments ouverts. | Elle ne remplace pas une sauvegarde. |
| Stockage | Conserver des fichiers dans la durée. | Un grand espace n’assure pas à lui seul une bonne fluidité. |

## 2. Lire une situation sans jargon

Lorsque plusieurs applications lourdes sont ouvertes, la mémoire vive peut être davantage sollicitée. Lorsque le stockage est presque rempli, il peut être plus difficile de garder un poste bien organisé et à jour. Une application lente ne prouve donc pas automatiquement qu’un seul composant est défaillant : il faut observer les applications ouvertes, l’espace disponible, la connexion et l’état général avant de conclure.

> **Méthode :** décrire d’abord le problème observable, vérifier les éléments simples, puis demander de l’aide si un diagnostic matériel ou une intervention interne serait nécessaire.

## Mise en situation — Choisir un poste pour un travail scolaire

**Situation fictive.** Deux postes sont disponibles pour préparer une présentation. L’un possède suffisamment de stockage mais plusieurs applications inutiles sont ouvertes ; l’autre a peu d’espace disponible mais une seule application active. Avant de choisir, l’élève doit vérifier ce qui est utile au travail : enregistrer, fermer les applications inutiles, vérifier l’espace et ne pas confondre le rôle de la mémoire avec celui du stockage.

> **Je sais faire si je peux :** expliquer la différence entre processeur, mémoire vive et stockage ; citer une vérification simple avant d’accuser un composant ; dire pourquoi une sauvegarde reste nécessaire même avec un grand espace de stockage.`, rows: [["Quel composant exécute les instructions des programmes ?", ["Le processeur", "Le dossier", "Le clavier"], ["Le processeur"], "Le processeur traite et coordonne les instructions."], ["Quelle affirmation distingue correctement mémoire vive et stockage ?", ["La mémoire vive est temporaire ; le stockage conserve après l’arrêt", "Ils ont exactement le même rôle", "Le stockage sert seulement à afficher l’écran"], ["La mémoire vive est temporaire ; le stockage conserve après l’arrêt"], "La mémoire vive sert au travail en cours, le stockage garde les fichiers."], ["Face à une application lente, quelle démarche est raisonnable ?", ["Observer les applications ouvertes et l’espace disponible avant de conclure", "Démonter le poste", "Supprimer au hasard des fichiers"], ["Observer les applications ouvertes et l’espace disponible avant de conclure"], "Un ralentissement peut avoir plusieurs causes simples à vérifier."], ["Pourquoi une sauvegarde reste-t-elle utile ?", ["Elle limite la perte de travail en cas de problème", "Elle remplace le processeur", "Elle ferme automatiquement les applications"], ["Elle limite la perte de travail en cas de problème"], "Une sauvegarde est une copie organisée qui protège le travail." ]] },
  { title: "Connecter les périphériques : ports, réseaux et compatibilité", description: "Approfondissement débutant : ports, câbles, périphériques, réseau local, connexion responsable et vérifications avant branchement.", visual: ":::computer-ports-visual", content: `# Maîtriser son ordinateur — Leçon 6 : Connecter les périphériques

## Objectifs

Tu dois pouvoir reconnaître le rôle d’un [[port|point de connexion|emplacement permettant de relier un câble ou un périphérique à un ordinateur]], distinguer périphérique filaire et sans fil, vérifier la compatibilité sans forcer un branchement et adopter des gestes prudents avec une connexion réseau.

:::computer-ports-visual

## 1. Un périphérique doit être relié de manière adaptée

Un périphérique peut servir à saisir, afficher, écouter, imprimer ou stocker. Un câble ou un port possède une forme et un usage : on ne le force pas. Avant de connecter un matériel, repère le port, lis l’indication lorsqu’elle existe, vérifie que le câble est en bon état et demande de l’aide si le branchement est incertain.

| Équipement | Utilité habituelle | Geste prudent |
|---|---|---|
| Clé USB | Transporter des fichiers. | Vérifier le contenu et éjecter selon la procédure prévue. |
| Casque | Écouter un contenu sans gêner les autres. | Régler le volume à un niveau raisonnable. |
| Écran externe | Afficher un contenu plus largement. | Vérifier le câble et la source d’affichage. |
| Chargeur | Alimenter ou recharger l’appareil. | Utiliser un chargeur adapté et un câble non endommagé. |

## 2. Réseau : connecté ne signifie pas tout partager

Un réseau permet aux appareils d’échanger des données. Une connexion peut être filaire ou sans fil. Sur un réseau partagé, il faut éviter de communiquer des mots de passe, limiter les téléchargements inconnus et fermer sa session sur les appareils qui ne sont pas personnels. La présence d’une icône de connexion ne garantit ni la qualité du réseau ni la fiabilité de toutes les informations consultées.

## Mise en situation — Présenter un document sur un écran externe

**Situation fictive.** Une élève doit montrer une présentation. Elle trouve un câble et un écran externe, mais ne sait pas s’ils sont compatibles. Elle ne doit ni forcer le connecteur ni modifier des réglages avancés au hasard. Elle observe les ports, consulte la personne responsable et vérifie ensuite que l’écran affiche le bon document sans rendre visible un contenu privé.

> **Je sais faire si je peux :** expliquer ce qu’est un port ; citer une précaution avant de brancher un câble ; distinguer une connexion réseau et une autorisation de partage ; dire pourquoi une clé USB mérite une vérification prudente.`, rows: [["Qu’est-ce qu’un port sur un ordinateur ?", ["Un point de connexion pour un câble ou un périphérique", "Un dossier de fichiers", "Une application de dessin"], ["Un point de connexion pour un câble ou un périphérique"], "Un port permet de relier un équipement compatible."], ["Que faire si un câble ne s’insère pas facilement ?", ["Ne pas forcer et vérifier la compatibilité", "Appuyer plus fort", "Couper l’écran"], ["Ne pas forcer et vérifier la compatibilité"], "Forcer un connecteur peut endommager le matériel."], ["Quelle action protège la confidentialité sur un appareil partagé ?", ["Fermer sa session après usage", "Laisser son compte ouvert", "Donner son mot de passe"], ["Fermer sa session après usage"], "Fermer la session réduit l’accès non souhaité aux informations."], ["Pourquoi éjecter une clé USB selon la procédure prévue ?", ["Pour limiter le risque d’interrompre une écriture en cours", "Pour augmenter la luminosité", "Pour effacer automatiquement les fichiers"], ["Pour limiter le risque d’interrompre une écriture en cours"], "Une écriture interrompue peut perturber ou endommager un fichier." ]] },
  { title: "Travailler efficacement : clavier, réglages et ergonomie numérique", description: "Approfondissement débutant : gestes au clavier, réglages simples, confort visuel, organisation d’une séance et limites de l’optimisation.", visual: ":::computer-workspace-visual", content: `# Maîtriser son ordinateur — Leçon 7 : Travailler efficacement

## Objectifs

Tu dois pouvoir organiser une séance courte sur ordinateur, utiliser le clavier avec plus d’assurance, ajuster des réglages simples autorisés, adopter une [[ergonomie|confort et adaptation|manière d’organiser le poste et ses gestes pour travailler avec moins de fatigue]] raisonnable et distinguer amélioration quotidienne et réglage technique avancé.

:::computer-workspace-visual

## 1. Le clavier : précision avant vitesse

La vitesse arrive avec l’habitude. Au début, il vaut mieux repérer les zones principales : lettres, chiffres, espace, entrée, effacement, majuscule et touches de direction. Les raccourcis peuvent réduire des gestes répétitifs, mais il faut comprendre l’action avant de l’utiliser. Une combinaison utile ne doit jamais remplacer une relecture ou une sauvegarde.

| Geste courant | But | Réflexe associé |
|---|---|---|
| Sélectionner | Choisir une partie de texte. | Vérifier ce qui est sélectionné avant une action. |
| Copier / coller | Réutiliser un contenu à un autre endroit. | Relire, citer la source si nécessaire et contrôler le format. |
| Enregistrer | Conserver la version de travail. | Donner un nom clair et vérifier le dossier. |
| Rechercher dans un document | Retrouver un mot ou une expression. | Vérifier le contexte de chaque résultat. |

## 2. Réglages simples et confort

Un poste peut être rendu plus lisible en ajustant, lorsque c’est autorisé, la taille du texte, la luminosité, le volume ou la langue du clavier. Il faut aussi placer l’écran à une distance confortable, éviter les reflets, faire des pauses et garder un espace de travail dégagé. Ces gestes aident au confort, mais ne remplacent pas les conseils d’un professionnel de santé en cas de douleur ou de difficulté persistante.

## Mise en situation — Une séance de révision de quarante minutes

**Situation fictive.** Awa prépare une fiche de révision. Elle ouvre son dossier, règle la taille du texte si nécessaire, travaille vingt minutes, enregistre, fait une courte pause, puis relit et range son fichier. Elle ne tente pas de changer des réglages avancés ni d’installer un outil inconnu pour travailler « plus vite ».

> **Je sais faire si je peux :** préparer un espace de travail ; choisir un réglage simple adapté ; citer une habitude qui protège la concentration ; expliquer pourquoi l’efficacité repose aussi sur l’organisation, la pause et la sauvegarde.`, rows: [["Quel objectif convient à un débutant au clavier ?", ["Privilégier la précision et la compréhension avant la vitesse", "Ne jamais utiliser le clavier", "Modifier des réglages avancés"], ["Privilégier la précision et la compréhension avant la vitesse"], "La vitesse se construit avec des gestes précis et réguliers."], ["Quel réglage simple peut améliorer la lisibilité lorsqu’il est autorisé ?", ["La taille du texte", "Le démontage de l’écran", "Le mot de passe d’un autre utilisateur"], ["La taille du texte"], "Ajuster la taille du texte est un réglage simple de confort."], ["Quelle habitude est adaptée pendant une longue séance ?", ["Enregistrer régulièrement et faire des pauses raisonnables", "Garder tous les câbles emmêlés", "Installer un programme inconnu"], ["Enregistrer régulièrement et faire des pauses raisonnables"], "Organisation, pauses et sauvegardes soutiennent un travail plus sûr."], ["Quelle action reste hors du dépannage ou de l’optimisation débutant ?", ["Modifier des réglages avancés au hasard", "Ranger son espace de travail", "Vérifier le dossier d’enregistrement"], ["Modifier des réglages avancés au hasard"], "Les réglages avancés doivent être laissés à une personne compétente ou suivis d’une consigne fiable." ]] },
];

const questionSql = (exerciseId, rows) => `insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values ${rows.map(([prompt,options,correct,explanation],i)=>`(${exerciseId},'single_choice',${sqlText(prompt)},${jsonArray(options)},${jsonArray(correct)},${sqlText(explanation)},${(i+1)*10})`).join(",")};`;
const quizSql = (quizId, lesson, order) => { const questions = lesson.rows.map(([q,, ,e],i)=>`(${quizId},${sqlText(q)},${sqlText(e)},'single_choice',${(i+1)*10},1,true)`).join(","); const answers = lesson.rows.flatMap(([,options,correct],i)=>options.map((a,j)=>`(${(i+1)*10},${sqlText(a)},${correct.includes(a)},${(j+1)*10})`)).join(","); return `insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active,is_test_data) values (target.subject_id,target.level_id,target.series_id,target.offering_id,target_chapter_id,target_lesson_id,${sqlText(`Quiz — ${lesson.title}`)},${sqlText("Vérifie la compréhension avec des décisions responsables." )},'medium',12,${order},false,false,false) returning id into ${quizId}; with iq as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values ${questions} returning id,display_order) insert into public.quiz_answers (question_id,answer,is_correct,display_order) select iq.id,v.answer,v.correct,v.answer_order from iq join (values ${answers}) as v(question_order,answer,correct,answer_order) on v.question_order=iq.display_order;`; };
const lessonSql = (lesson,index) => { const n=index+5, e1=`exercise_a_${n}`,e2=`exercise_b_${n}`,q1=`quiz_a_${n}`,q2=`quiz_b_${n}`, order=(index+5)*100; return `insert into public.lessons (chapter_id,title,description,content,display_order,is_test_data,is_active) values (target_chapter_id,${sqlText(lesson.title)},${sqlText(lesson.description)},${sqlText(lesson.content)},${(index+5)*10},false,false) returning id into target_lesson_id; insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order,is_test_data) values (target.subject_id,target.level_id,target.series_id,target_chapter_id,target_lesson_id,${sqlText(`Mise en situation — ${lesson.title}`)},${sqlText("Réponds à partir d’une situation fictive, sans modifier de matériel réel.")},${sqlText("La correction explique le geste prudent et la notion technique associée.")},'single_choice','medium',${sqlText("Choisis la décision la plus appropriée.")},${sqlText("Lis la correction pour consolider ton raisonnement.")},false,false,20,${order+10},false) returning id into ${e1}; ${questionSql(e1,lesson.rows)} insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order,is_test_data) values (target.subject_id,target.level_id,target.series_id,target_chapter_id,target_lesson_id,${sqlText(`Consolidation — ${lesson.title}`)},${sqlText("Réinvestis le vocabulaire de la leçon.")},${sqlText("La correction rappelle la définition et la méthode.")},'single_choice','medium',${sqlText("Appuie-toi sur les explications du cours.")},${sqlText("Compare ta réponse à l’explication.")},false,false,20,${order+20},false) returning id into ${e2}; ${questionSql(e2,lesson.rows)} ${quizSql(q1,lesson,order+10)} ${quizSql(q2,lesson,order+20)}`; };

const migration=`do $hardware_deepening$
declare target record; target_chapter_id uuid; target_lesson_id uuid; material_count integer; existing_count integer; exercise_a_5 uuid; exercise_b_5 uuid; quiz_a_5 uuid; quiz_b_5 uuid; exercise_a_6 uuid; exercise_b_6 uuid; quiz_a_6 uuid; quiz_b_6 uuid; exercise_a_7 uuid; exercise_b_7 uuid; quiz_a_7 uuid; quiz_b_7 uuid;
begin
 if (select count(*) from public.course_subject_offerings where id in (${offerings.map(sqlText).join(",")}) and is_test_data=false)<>4 then raise exception 'Les quatre offres Terminale sont requises.'; end if;
 select count(*) into material_count from public.lessons l join public.chapters c on c.id=l.chapter_id where c.subject_offering_id in (${offerings.map(sqlText).join(",")}) and c.title=${sqlText(chapterTitle)} and l.title=${sqlText(materialTitle)} and l.is_active=false and l.is_test_data=false and l.content not like '%:::computer-hardware-diagram%'; if material_count<>4 then raise exception 'Les quatre brouillons Matériel attendus sont absents, actifs ou déjà annotés.'; end if;
 select count(*) into existing_count from public.lessons l join public.chapters c on c.id=l.chapter_id where c.subject_offering_id in (${offerings.map(sqlText).join(",")}) and l.title in (${lessons.map(l=>sqlText(l.title)).join(",")}); if existing_count<>0 then raise exception 'Une leçon approfondie existe déjà : duplication interdite.'; end if;
 update public.lessons l set content=replace(l.content,'## 1. Un ordinateur associe des éléments physiques et des programmes',':::computer-hardware-diagram\n\n## 1. Un ordinateur associe des éléments physiques et des programmes') from public.chapters c where c.id=l.chapter_id and c.subject_offering_id in (${offerings.map(sqlText).join(",")}) and c.title=${sqlText(chapterTitle)} and l.title=${sqlText(materialTitle)} and l.is_active=false and l.is_test_data=false;
 for target in select o.id as offering_id,o.subject_id,o.level_id,o.series_id from public.course_subject_offerings o where o.id in (${offerings.map(sqlText).join(",")}) and o.is_test_data=false loop select c.id into target_chapter_id from public.chapters c where c.subject_offering_id=target.offering_id and c.title=${sqlText(chapterTitle)} and c.is_test_data=false and c.is_active=false; if target_chapter_id is null then raise exception 'Chapitre Maîtriser son ordinateur manquant ou actif.'; end if;
 ${lessons.map(lessonSql).join("\n")}
 end loop;
end $hardware_deepening$;`;
writeFileSync(migrationPath,migration,"utf8");
writeFileSync(payloadPath,`${JSON.stringify({project_id:"nnshioowwniursnozicg",name:"computer_hardware_deepening_drafts",query:migration},null,2)}\n`,"utf8");
console.log(migrationPath); console.log(payloadPath);
