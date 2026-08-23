-- Unit 5 Anglais Terminale : Managing Resources, Reading + Writing bilingues, tout en brouillon.
do $unit5_migration$
declare target record; target_chapter_id uuid; target_lesson_id uuid; old_content text; ex_read uuid; ex_write uuid; q_read uuid; q_write uuid; count_items integer; unit_title constant text := 'UNIT 5 MANAGING RESOURCES';
begin
  select count(*) into count_items from public.course_subject_offerings where id in ($unit5$81c5b295-b5d4-4a7c-a922-0604236a4aa8$unit5$,$unit5$0bc8f25a-432a-441b-8a86-303b452aaf9f$unit5$,$unit5$ff97ed10-ea0d-4e7e-9dd1-8010229c03b6$unit5$,$unit5$94543938-fd4c-4ba8-8205-35f765264719$unit5$); if count_items<>4 then raise exception 'Les quatre offres Anglais Terminale sont requises.'; end if;
  if exists (select 1 from public.lessons l join public.chapters c on c.id=l.chapter_id where c.subject_offering_id in ($unit5$81c5b295-b5d4-4a7c-a922-0604236a4aa8$unit5$,$unit5$0bc8f25a-432a-441b-8a86-303b452aaf9f$unit5$,$unit5$ff97ed10-ea0d-4e7e-9dd1-8010229c03b6$unit5$,$unit5$94543938-fd4c-4ba8-8205-35f765264719$unit5$) and l.title=unit_title and (coalesce(char_length(l.content),0)>0 or exists(select 1 from public.exercises e where e.lesson_id=l.id) or exists(select 1 from public.quizzes q where q.lesson_id=l.id))) then raise exception 'Une leçon Unit 5 contient déjà du contenu ou un module : écrasement interdit.'; end if;
  for target in select o.id as offering_id,o.subject_id,o.level_id,o.series_id,se.name as series_name from public.course_subject_offerings o join public.series se on se.id=o.series_id where o.id in ($unit5$81c5b295-b5d4-4a7c-a922-0604236a4aa8$unit5$,$unit5$0bc8f25a-432a-441b-8a86-303b452aaf9f$unit5$,$unit5$ff97ed10-ea0d-4e7e-9dd1-8010229c03b6$unit5$,$unit5$94543938-fd4c-4ba8-8205-35f765264719$unit5$) order by se.name loop
    select id into target_chapter_id from public.chapters where subject_offering_id=target.offering_id and title='PROGRESSION TERMINALE A' limit 1; if target_chapter_id is null and target.series_name in ('C','D') then select id into target_chapter_id from public.chapters where subject_offering_id=target.offering_id and title='PROGRESSIONS TERMINALES C ET D — Anglais' limit 1; end if; if target_chapter_id is null then raise exception 'Chapitre Anglais attendu absent pour %',target.series_name; end if;
    select le.id,le.content into target_lesson_id,old_content from public.lessons le where le.chapter_id=target_chapter_id and le.title=unit_title limit 1; if target_lesson_id is null and target.offering_id=$unit5$0bc8f25a-432a-441b-8a86-303b452aaf9f$unit5$ then insert into public.lessons (chapter_id,title,display_order,is_active) values (target_chapter_id,unit_title,50,false) returning id,content into target_lesson_id,old_content; end if; if target_lesson_id is null then raise exception 'Structure Unit 5 absente pour %',target.series_name; end if;
    if coalesce(char_length(old_content),0)>0 or exists(select 1 from public.exercises e where e.lesson_id=target_lesson_id) or exists(select 1 from public.quizzes q where q.lesson_id=target_lesson_id) then raise exception 'Leçon Unit 5 non vide pour % : écrasement interdit.',target.series_name; end if;
    update public.lessons set description='Unit 5 Managing Resources : accaparement des terres, conditionnel, gestion responsable des ressources et article sur un système alimentaire durable bilingue.',content=$unit5$## Unit 5 — Managing Resources

> **Traduction française :** Unité 5 — Gérer les ressources.

> **Bilingual learning goal:** understand an adapted text about land grabbing, express unreal conditions, discuss responsible resource management, and write a well-organised article about sustainable food systems.

> **Objectif bilingue :** comprendre un texte adapté sur l’accaparement des terres, exprimer des conditions irréelles, discuter d’une gestion responsable des ressources et rédiger un article bien organisé sur les systèmes alimentaires durables.

> **Source focus:** Reading uses the adapted text *Who benefits the most from land grabbing?* from *Far Ahead Terminale*. Writing asks learners to prepare an article for a British Council competition on how to make the food system sustainable.

> **Traduction française :** **Références des sources :** le Reading utilise le texte adapté *Who benefits the most from land grabbing?* de *Far Ahead Terminale*. Le Writing demande aux élèves de préparer un article pour un concours du British Council sur la manière de rendre le système alimentaire durable.

---

## Part A — Reading: land, food and local communities

> **Traduction française :** Partie A — Lecture : la terre, l’alimentation et les communautés locales.

### 1. Read with a question, not with a guess

**Before reading, ask: What is land grabbing? Why can it be frequent today? What consequences can it have for a local population?**

> **Traduction française :** **Avant de lire, pose-toi ces questions : qu’est-ce que l’accaparement des terres ? Pourquoi ce phénomène peut-il être fréquent aujourd’hui ? Quelles conséquences peut-il avoir pour une population locale ?**

The adapted article links the 2008 economic crisis, fear of food scarcity and increased food prices to a stronger land rush. It then contrasts investors’ claims about development with the effects reported for many local people.

> **Traduction française :** L’article adapté relie la crise économique de 2008, la crainte de la pénurie alimentaire et la hausse des prix alimentaires à une course plus forte à la terre. Il oppose ensuite les affirmations d’investisseurs sur le développement aux effets rapportés pour de nombreuses populations locales.

### 2. Core vocabulary — hover on web or tap on mobile

| Interactive English term | Meaning in context | Traduction française |
|---|---|---|
| [[land grabbing|accaparement des terres|large-scale acquisition of land that can displace local users]] | acquisition de terres à grande échelle | accaparement des terres |
| [[land rush|course à la terre|urgent competition to obtain land]] | compétition urgente pour obtenir des terres | course à la terre |
| [[scarcity|pénurie|a situation where a needed resource is limited]] | manque d’une ressource nécessaire | pénurie |
| [[evict|expulser|to force someone to leave a home or land]] | forcer quelqu’un à quitter un lieu | expulser |
| [[subsistence|subsistance|the means needed to live, especially food and basic income]] | moyens nécessaires pour vivre | subsistance |
| [[consent|consentement|permission or agreement given freely]] | accord ou permission librement donné | consentement |
| [[food sovereignty|souveraineté alimentaire|the capacity of people to influence their own food system]] | capacité des populations à agir sur leur système alimentaire | souveraineté alimentaire |
| [[monoculture|monoculture|growing one main crop over a large area]] | culture d’une seule espèce principale | monoculture |

### 3. The second conditional: imagine an unreal present or future

**If we had enough money, we would buy the land and farm it ourselves.**

> **Traduction française :** **Si nous avions assez d’argent, nous achèterions la terre et la cultiverions nous-mêmes.**

The second conditional has the form **if + past simple, would + base verb**. It is used for an unreal, unlikely or imagined condition in the present or future. The past form does **not** necessarily mean the situation happened in the past.

> **Traduction française :** Le second conditionnel suit la forme **if + prétérit, would + base verbale**. Il sert à exprimer une condition irréelle, peu probable ou imaginée au présent ou dans le futur. La forme du passé ne signifie **pas** nécessairement que la situation s’est produite dans le passé.

| Situation | English | Traduction française |
|---|---|---|
| Imagined resource | **If local communities had more support, they would develop family farming.** | **Si les communautés locales avaient davantage de soutien, elles développeraient l’agriculture familiale.** |
| Imagined policy | **If a policy protected farmers, they would feel more secure.** | **Si une politique protégeait les agriculteurs, ils se sentiraient plus en sécurité.** |
| Source-based hypothesis | **If part of the crops fed local people, land grabbing could reduce hunger.** | **Si une partie des récoltes nourrissait les populations locales, l’accaparement des terres pourrait réduire la faim.** |

**Avoid this error:** *If communities would have support…* After **if**, use the past simple, not *would*.

> **Traduction française :** **Évite cette erreur :** *If communities would have support…* Après **if**, utilise le prétérit et non *would*.

### 4. Follow the article’s argument carefully

According to the adapted article, large monocultures can be grown for export markets. It says that many affected farmers and families may lose land, work, subsistence and access to food. It also states that local groups can mobilise for transparency, consent, family farming and food sovereignty.

> **Traduction française :** Selon l’article adapté, de grandes monocultures peuvent être cultivées pour les marchés d’exportation. Il indique que de nombreux agriculteurs et familles concernés peuvent perdre leur terre, leur travail, leurs moyens de subsistance et leur accès à l’alimentation. Il précise également que des groupes locaux peuvent se mobiliser pour la transparence, le consentement, l’agriculture familiale et la souveraineté alimentaire.

When you discuss this text, distinguish three layers: **what the article reports**, **what one group claims**, and **your own reasoned opinion**. This distinction prevents you from turning a claim into an unquestioned fact.

> **Traduction française :** Lorsque tu discutes de ce texte, distingue trois niveaux : **ce que l’article rapporte**, **ce qu’un groupe affirme** et **ta propre opinion raisonnée**. Cette distinction évite de transformer une affirmation en fait incontestable.

### 5. Prove your comprehension

For an opinion question, identify the sentence or paragraph that supports the writer’s position. For vocabulary, read the surrounding sentence and do not translate word by word. For true-or-false statements, compare every key detail—actor, cause, location, date or result—with the text, then quote or identify the relevant line.

> **Traduction française :** Pour une question d’opinion, identifie la phrase ou le paragraphe qui appuie la position de l’auteur. Pour le vocabulaire, lis la phrase qui entoure le mot et ne traduis pas mot à mot. Pour les affirmations vrai/faux, compare chaque détail clé — acteur, cause, lieu, date ou résultat — avec le texte, puis cite ou indique la ligne pertinente.

### 6. Responsible resource management — communication task

**A BBC journalist asks: How can African leaders manage natural resources such as land to improve people’s lives?** The worksheet suggests promoting sustainable agriculture, encouraging intensive agriculture, granting financial support to farmers and helping farmers sell their products.

> **Traduction française :** **Un journaliste de la BBC demande : comment les dirigeants africains peuvent-ils gérer des ressources naturelles comme la terre afin d’améliorer la vie des populations ?** La fiche propose de promouvoir l’agriculture durable, d’encourager l’agriculture intensive, d’accorder un soutien financier aux agriculteurs et d’aider les agriculteurs à vendre leurs produits.

Build a responsible response in three moves: state one measure, explain the intended benefit, then add a condition or safeguard. For example: **Leaders could support farmers with fair access to land; this could improve production if communities are consulted and environmental impacts are considered.**

> **Traduction française :** Construis une réponse responsable en trois temps : annonce une mesure, explique le bénéfice attendu, puis ajoute une condition ou une garantie. Par exemple : **Les dirigeants pourraient soutenir les agriculteurs par un accès équitable à la terre ; cela pourrait améliorer la production si les communautés sont consultées et si les impacts environnementaux sont pris en compte.**

### 7. Agriculture homework: classify before completing

| Term | Precise classroom meaning | Traduction française |
|---|---|---|
| **subsistence farming** | farming mainly for one’s own use | agriculture de subsistance |
| **livestock** | farm animals | bétail |
| **industrialized / mechanized agriculture** | production relying heavily on machines and industrial inputs | agriculture industrialisée / mécanisée |
| **biofuel** | fuel made from biological material | biocarburant |
| **organic farming** | farming without artificial fertilisers and pesticides | agriculture biologique |
| **dairy farm** | farm producing milk and milk products | ferme laitière |
| **sustainable agriculture** | agriculture that protects environmental, social and long-term needs | agriculture durable |

> **Method:** first identify whether the blank asks for a farm type, a product, an animal group or a quality. Then check agreement and sentence meaning.

> **Traduction française :** **Méthode :** identifie d’abord si le blanc demande un type d’exploitation, un produit, un groupe d’animaux ou une qualité. Vérifie ensuite l’accord et le sens de la phrase.

---

## Part B — Writing: an article on sustainable food systems

> **Traduction française :** Partie B — Écriture : un article sur les systèmes alimentaires durables.

### 1. What is a sustainable food system?

In this unit, a sustainable food system is a way of producing, processing, trading and consuming food that helps people obtain safe and nutritious food while reducing waste and protecting long-term well-being.

> **Traduction française :** Dans cette unité, un système alimentaire durable est une manière de produire, transformer, commercialiser et consommer des aliments qui aide les personnes à obtenir une alimentation sûre et nutritive tout en réduisant le gaspillage et en protégeant le bien-être à long terme.

This is a classroom definition built from the source vocabulary. It is not a claim that one single method solves every food problem.

> **Traduction française :** C’est une définition pédagogique construite à partir du vocabulaire de la source. Elle ne prétend pas qu’une seule méthode résout tous les problèmes alimentaires.

### 2. Vocabulary for an accurate article

| English word | Meaning | Traduction française |
|---|---|---|
| **sustainable** | able to continue without harming future needs | durable |
| **processing** | a series of operations that changes or prepares a product | transformation / traitement |
| **trade** | commercial exchange of goods | commerce / échanges commerciaux |
| **policy** | an aim or plan of action | politique / plan d’action |
| **waste** | to use or throw away wrongly | gaspiller |
| **hunger** | lack of food | faim |
| **well-being** | good health and comfort | bien-être |
| **available** | obtainable or accessible | disponible / accessible |

### 3. Article, not letter: choose the right genre

The Unit 5 task is an **article** for a competition. An article speaks to a general reader. It needs a relevant title, an engaging opening, clear paragraphs, accurate examples and a conclusion that leaves the reader with a useful idea. It does not begin with *Dear Sir or Madam* and it does not end with *Yours faithfully*.

> **Traduction française :** La tâche de l’Unit 5 est un **article** destiné à un concours. Un article s’adresse à un lecteur général. Il a besoin d’un titre pertinent, d’une ouverture engageante, de paragraphes clairs, d’exemples précis et d’une conclusion qui laisse au lecteur une idée utile. Il ne commence pas par *Dear Sir or Madam* et ne se termine pas par *Yours faithfully*.

| Article feature | Example in English | Traduction française |
|---|---|---|
| Title | **Food for today and tomorrow** | **De la nourriture pour aujourd’hui et demain** |
| Hook | **Can a food system feed people without wasting resources?** | **Un système alimentaire peut-il nourrir les personnes sans gaspiller les ressources ?** |
| Organised point | **First, food must be available and nutritious.** | **D’abord, les aliments doivent être disponibles et nutritifs.** |
| Link | **Moreover, reducing waste can protect resources.** | **De plus, réduire le gaspillage peut protéger les ressources.** |
| Conclusion | **Small, organised actions can support healthier communities.** | **De petites actions organisées peuvent soutenir des communautés plus saines.** |

### 4. Plan before writing

The prompt asks you to define a sustainable food system, list components of sustainability and explain how it can improve lives. Use this five-part plan.

> **Traduction française :** La consigne te demande de définir un système alimentaire durable, de citer des composantes de la durabilité et d’expliquer comment il peut améliorer la vie. Utilise ce plan en cinq parties.

| Paragraph | Purpose | Questions to answer |
|---|---|---|
| **Title + opening** | Attract attention and introduce food-system sustainability. | What question or problem will make a reader continue? |
| **Definition** | Give a short, clear definition. | How are food, people, resources and time connected? |
| **Components** | Organise ideas from the source vocabulary. | Are food safe, nutritious and available? Is waste reduced? Are processing, trade and policy responsible? |
| **Benefits** | Explain how people’s lives can improve. | How can nutrition, hunger, livelihoods or well-being be affected? |
| **Conclusion** | Summarise without inventing a result. | What practical message should remain with the reader? |

### 5. Build coherent paragraphs

Use a **topic sentence**, then one explanation, then an example or consequence. Do not make one very long paragraph containing all your ideas.

> **Traduction française :** Utilise une **phrase directrice**, puis une explication, puis un exemple ou une conséquence. Ne fais pas un seul très long paragraphe contenant toutes tes idées.

**Topic sentence:** A sustainable food system should make safe and nutritious food available to all.

> **Traduction française :** **Phrase directrice :** Un système alimentaire durable devrait rendre une alimentation sûre et nutritive disponible pour tous.

**Development:** When food is available but its nutrient quality is poor, people’s health and well-being can still suffer. Therefore, availability and quality must be considered together.

> **Traduction française :** **Développement :** Lorsque les aliments sont disponibles mais que leur qualité nutritionnelle est faible, la santé et le bien-être des personnes peuvent encore souffrir. Par conséquent, la disponibilité et la qualité doivent être considérées ensemble.

### 6. Guided practice model — adapt with truthful details

> **This is an original classroom model. It uses the source vocabulary but does not claim official data, a policy decision or a competition result.**

> **Traduction française :** **Ceci est un modèle pédagogique original. Il utilise le vocabulaire de la source mais ne prétend pas à des données officielles, une décision politique ou un résultat de concours.**

### Food for today and tomorrow

> **Traduction française :** ### De la nourriture pour aujourd’hui et demain

**Can communities feed people well while protecting the resources needed by future generations? A sustainable food system is one way to work toward this goal. It connects food production, processing, trade and consumption with people’s health and well-being.**

> **Traduction française :** **Les communautés peuvent-elles bien nourrir les personnes tout en protégeant les ressources dont les générations futures auront besoin ? Un système alimentaire durable est une manière de travailler vers cet objectif. Il relie la production, la transformation, le commerce et la consommation alimentaires à la santé et au bien-être des personnes.**

**First, safe, sufficient and nutritious food should be available and accessible. This can help families reduce hunger and improve daily well-being. However, availability alone is not enough when food quality is poor.**

> **Traduction française :** **D’abord, une alimentation sûre, suffisante et nutritive devrait être disponible et accessible. Cela peut aider les familles à réduire la faim et à améliorer le bien-être quotidien. Cependant, la disponibilité seule ne suffit pas lorsque la qualité des aliments est faible.**

**A sustainable system also reduces waste and supports responsible agriculture. Farmers need fair opportunities to produce, process and trade their products. Good policies can help make these activities more organised and useful for communities.**

> **Traduction française :** **Un système durable réduit aussi le gaspillage et soutient une agriculture responsable. Les agriculteurs ont besoin de possibilités équitables pour produire, transformer et commercialiser leurs produits. De bonnes politiques peuvent aider à rendre ces activités plus organisées et plus utiles aux communautés.**

**In conclusion, sustainable food systems do not depend on one action only. They require attention to nutrition, resources, waste, trade and the well-being of people. Each school and community can discuss realistic steps that fit its own situation.**

> **Traduction française :** **En conclusion, les systèmes alimentaires durables ne dépendent pas d’une seule action. Ils exigent une attention à la nutrition, aux ressources, au gaspillage, au commerce et au bien-être des personnes. Chaque école et chaque communauté peuvent discuter de mesures réalistes adaptées à leur propre situation.**

### 7. Writing checklist

- **Have I written an article title and an opening that introduces the topic?**

  > **Traduction française :** Ai-je écrit un titre d’article et une ouverture qui présente le sujet ?

- **Have I defined the system briefly instead of copying a list of words?**

  > **Traduction française :** Ai-je défini brièvement le système au lieu de copier une liste de mots ?

- **Have I organised components and benefits into separate paragraphs?**

  > **Traduction française :** Ai-je organisé les composantes et les bénéfices dans des paragraphes distincts ?

- **Have I used accurate vocabulary and connectors such as first, however, moreover and in conclusion?**

  > **Traduction française :** Ai-je utilisé un vocabulaire précis et des connecteurs tels que first, however, moreover et in conclusion ?

- **Have I avoided invented statistics, policies or results?**

  > **Traduction française :** Ai-je évité les statistiques, politiques ou résultats inventés ?

## Source traceability

Reformulated and expanded from the supplied **Unit 5 Managing Resources — Reading for Comprehension** (*Who benefits the most from land grabbing?*, *Far Ahead Terminale*) and **Unit 5 Managing Resources — Writing an Article** (École numérique, Côte d’Ivoire).$unit5$,is_active=false where id=target_lesson_id;
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order) values (target.subject_id,target.level_id,target.series_id,target_chapter_id,target_lesson_id,'Exercise 1 — Reading: land grabbing and responsible resources

> **Traduction française :** Exercice 1 — Lecture : accaparement des terres et ressources responsables',$unit5$**Use the article’s evidence, vocabulary and second conditional.**

> **Traduction française :** Utilise les preuves, le vocabulaire et le second conditionnel de l’article.$unit5$,$unit5$**The correction returns to textual evidence and distinguishes a report, a claim and an opinion.**

> **Traduction française :** La correction revient aux preuves textuelles et distingue un fait rapporté, une affirmation et une opinion.$unit5$,'single_choice','medium',$unit5$**Select answers supported by the bilingual course.**

> **Traduction française :** Sélectionne les réponses appuyées par le cours bilingue.$unit5$,$unit5$**Read the bilingual correction to understand the method, not only the answer.**

> **Traduction française :** Lis la correction bilingue pour comprendre la méthode, et pas seulement la réponse.$unit5$,false,false,25,10) returning id into ex_read;
insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
(ex_read,'single_choice',$unit5$**Which structure expresses an unreal present or future condition?**

> **Traduction française :** Quelle structure exprime une condition irréelle au présent ou au futur ?$unit5$,jsonb_build_array($unit5$if + past simple, would + base verb
— Traduction française : if + prétérit, would + base verbale$unit5$,$unit5$if + would, present verb
— Traduction française : if + would, verbe au présent$unit5$,$unit5$will + past participle
— Traduction française : will + participe passé$unit5$),jsonb_build_array($unit5$if + past simple, would + base verb
— Traduction française : if + prétérit, would + base verbale$unit5$),$unit5$**The second conditional uses if + past simple, would + base verb.**

> **Traduction française :** Le second conditionnel utilise if + prétérit, would + base verbale.$unit5$,10),
(ex_read,'single_choice',$unit5$**What does the adapted article report as a major effect of land grabbing on many local families?**

> **Traduction française :** Quel effet majeur l’article adapté rapporte-t-il pour de nombreuses familles locales ?$unit5$,jsonb_build_array($unit5$They may lose land, subsistence, work and food access.
— Traduction française : Elles peuvent perdre leur terre, leurs moyens de subsistance, leur travail et l’accès à l’alimentation.$unit5$,$unit5$They automatically receive farm ownership.
— Traduction française : Elles reçoivent automatiquement la propriété d’une ferme.$unit5$,$unit5$They stop needing food.
— Traduction française : Elles cessent d’avoir besoin de nourriture.$unit5$),jsonb_build_array($unit5$They may lose land, subsistence, work and food access.
— Traduction française : Elles peuvent perdre leur terre, leurs moyens de subsistance, leur travail et l’accès à l’alimentation.$unit5$),$unit5$**The text reports displacement and loss of means of subsistence for many affected farmers and families.**

> **Traduction française :** Le texte rapporte le déplacement et la perte des moyens de subsistance pour de nombreux agriculteurs et familles concernés.$unit5$,20),
(ex_read,'single_choice',$unit5$**How should a true-or-false answer be justified?**

> **Traduction française :** Comment une réponse vrai/faux doit-elle être justifiée ?$unit5$,jsonb_build_array($unit5$With the relevant textual detail or line.
— Traduction française : Avec le détail ou la ligne pertinente du texte.$unit5$,$unit5$With a personal guess only.
— Traduction française : Avec une supposition personnelle seulement.$unit5$,$unit5$By changing the actor in the sentence.
— Traduction française : En changeant l’acteur dans la phrase.$unit5$),jsonb_build_array($unit5$With the relevant textual detail or line.
— Traduction française : Avec le détail ou la ligne pertinente du texte.$unit5$),$unit5$**Compare actors, causes, dates and outcomes with the source before deciding.**

> **Traduction française :** Compare les acteurs, causes, dates et résultats avec la source avant de décider.$unit5$,30),
(ex_read,'single_choice',$unit5$**Which action can help communities respond responsibly according to the text?**

> **Traduction française :** Quelle action peut aider les communautés à réagir de façon responsable selon le texte ?$unit5$,jsonb_build_array($unit5$Mobilise for transparency and support family farming.
— Traduction française : Se mobiliser pour la transparence et soutenir l’agriculture familiale.$unit5$,$unit5$Ignore community consent.
— Traduction française : Ignorer le consentement des communautés.$unit5$,$unit5$Treat every claim as a fact.
— Traduction française : Traiter chaque affirmation comme un fait.$unit5$),jsonb_build_array($unit5$Mobilise for transparency and support family farming.
— Traduction française : Se mobiliser pour la transparence et soutenir l’agriculture familiale.$unit5$),$unit5$**The adapted article mentions transparency, farmers’ organisations, human-rights groups and family farming.**

> **Traduction française :** L’article adapté mentionne la transparence, les organisations paysannes, les groupes de défense des droits humains et l’agriculture familiale.$unit5$,40);
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order) values (target.subject_id,target.level_id,target.series_id,target_chapter_id,target_lesson_id,'Exercise 2 — Writing: a sustainable food-system article

> **Traduction française :** Exercice 2 — Écriture : un article sur le système alimentaire durable',$unit5$**Plan and write an article that defines a sustainable food system, presents components and explains benefits.**

> **Traduction française :** Planifie et rédige un article qui définit un système alimentaire durable, présente ses composantes et explique ses bénéfices.$unit5$,$unit5$**The correction checks article structure, accurate vocabulary, paragraphing and truthful development.**

> **Traduction française :** La correction vérifie la structure de l’article, le vocabulaire précis, les paragraphes et le développement véridique.$unit5$,'single_choice','medium',$unit5$**Use title, hook, definition, components, benefits and conclusion as your plan.**

> **Traduction française :** Utilise le titre, l’accroche, la définition, les composantes, les bénéfices et la conclusion comme plan.$unit5$,$unit5$**Do not copy a word list or invent a policy, number or result.**

> **Traduction française :** Ne copie pas une liste de mots et n’invente pas une politique, un chiffre ou un résultat.$unit5$,false,false,35,20) returning id into ex_write;
insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
(ex_write,'single_choice',$unit5$**What is the requested genre in Unit 5 Writing?**

> **Traduction française :** Quel est le genre demandé dans le Writing de l’Unit 5 ?$unit5$,jsonb_build_array($unit5$An article for a general reader
— Traduction française : Un article destiné à un lecteur général$unit5$,$unit5$A formal request letter
— Traduction française : Une lettre formelle de demande$unit5$,$unit5$A personal invitation
— Traduction française : Une invitation personnelle$unit5$),jsonb_build_array($unit5$An article for a general reader
— Traduction française : Un article destiné à un lecteur général$unit5$),$unit5$**The source asks for a newspaper article about making the food system sustainable.**

> **Traduction française :** La source demande un article de journal sur la manière de rendre le système alimentaire durable.$unit5$,10),
(ex_write,'single_choice',$unit5$**Which idea belongs in a sustainable food-system article?**

> **Traduction française :** Quelle idée appartient à un article sur un système alimentaire durable ?$unit5$,jsonb_build_array($unit5$Safe and nutritious food, reduced waste and responsible food activities
— Traduction française : Une alimentation sûre et nutritive, moins de gaspillage et des activités alimentaires responsables$unit5$,$unit5$An invented competition result
— Traduction française : Un résultat de concours inventé$unit5$,$unit5$Only a greeting to a friend
— Traduction française : Seulement une salutation à un ami$unit5$),jsonb_build_array($unit5$Safe and nutritious food, reduced waste and responsible food activities
— Traduction française : Une alimentation sûre et nutritive, moins de gaspillage et des activités alimentaires responsables$unit5$),$unit5$**The source vocabulary supports availability, nutrition, waste reduction, processing, trade, policy and well-being.**

> **Traduction française :** Le vocabulaire de la source appuie la disponibilité, la nutrition, la réduction du gaspillage, la transformation, le commerce, la politique et le bien-être.$unit5$,20),
(ex_write,'single_choice',$unit5$**What should an article opening do?**

> **Traduction française :** Que doit faire l’ouverture d’un article ?$unit5$,jsonb_build_array($unit5$Introduce the topic and engage the reader.
— Traduction française : Présenter le sujet et intéresser le lecteur.$unit5$,$unit5$Use Dear Sir or Madam.
— Traduction française : Utiliser Dear Sir or Madam.$unit5$,$unit5$List every word without a purpose.
— Traduction française : Lister chaque mot sans objectif.$unit5$),jsonb_build_array($unit5$Introduce the topic and engage the reader.
— Traduction française : Présenter le sujet et intéresser le lecteur.$unit5$),$unit5$**A title and hook help a general reader understand why the article matters.**

> **Traduction française :** Un titre et une accroche aident un lecteur général à comprendre pourquoi l’article est important.$unit5$,30),
(ex_write,'single_choice',$unit5$**Why should the model avoid invented statistics or policy results?**

> **Traduction française :** Pourquoi le modèle doit-il éviter les statistiques ou résultats de politique inventés ?$unit5$,jsonb_build_array($unit5$To keep the article truthful and responsible.
— Traduction française : Pour que l’article reste vrai et responsable.$unit5$,$unit5$To make paragraphs shorter only.
— Traduction française : Seulement pour raccourcir les paragraphes.$unit5$,$unit5$To avoid using vocabulary.
— Traduction française : Pour éviter d’utiliser le vocabulaire.$unit5$),jsonb_build_array($unit5$To keep the article truthful and responsible.
— Traduction française : Pour que l’article reste vrai et responsable.$unit5$),$unit5$**A learner can develop an idea without presenting an unverified claim as a fact.**

> **Traduction française :** Un élève peut développer une idée sans présenter une affirmation non vérifiée comme un fait.$unit5$,40);
insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active) values (target.subject_id,target.level_id,target.series_id,target.offering_id,target_chapter_id,target_lesson_id,$unit5$Bilingual quiz 1 — Reading: Managing Resources

> **Traduction française :** Quiz bilingue 1 — Lecture : gérer les ressources$unit5$,$unit5$**Check land-grabbing vocabulary, second conditional and text-evidence methods.**

> **Traduction française :** Vérifie le vocabulaire de l’accaparement des terres, le second conditionnel et les méthodes de preuve textuelle.$unit5$,'medium',15,10,false,false) returning id into q_read; with inserted_questions as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values (q_read,$unit5$**What does land grabbing mean in this unit?**

> **Traduction française :** Que signifie land grabbing dans cette unité ?$unit5$,$unit5$**It refers to large-scale acquisition of land that can displace local users.**

> **Traduction française :** Cela désigne l’acquisition de terres à grande échelle pouvant déplacer les utilisateurs locaux.$unit5$,'single_choice',10,1,true),
(q_read,$unit5$**Complete: If farmers had support, they ___ develop sustainable agriculture.**

> **Traduction française :** Complète : si les agriculteurs avaient du soutien, ils ___ développeraient une agriculture durable.$unit5$,$unit5$**The second conditional needs would + base verb.**

> **Traduction française :** Le second conditionnel nécessite would + base verbale.$unit5$,'single_choice',20,1,true),
(q_read,$unit5$**What is food sovereignty in the lesson?**

> **Traduction française :** Qu’est-ce que la souveraineté alimentaire dans la leçon ?$unit5$,$unit5$**It is the capacity of people to influence their own food system.**

> **Traduction française :** C’est la capacité des populations à agir sur leur propre système alimentaire.$unit5$,'single_choice',30,1,true),
(q_read,$unit5$**Which detail should you check in a true-or-false task?**

> **Traduction française :** Quel détail dois-tu vérifier dans une tâche vrai/faux ?$unit5$,$unit5$**Check the actor, cause, place, date and result against the text.**

> **Traduction française :** Vérifie l’acteur, la cause, le lieu, la date et le résultat par rapport au texte.$unit5$,'single_choice',40,1,true) returning id,display_order) insert into public.quiz_answers (question_id,answer,is_correct,display_order) select iq.id,v.answer,v.is_correct,v.display_order from inserted_questions iq join (values (10,$unit5$Large-scale land acquisition
— Traduction française : Acquisition de terres à grande échelle$unit5$,true,10),
(10,$unit5$A food recipe
— Traduction française : Une recette de cuisine$unit5$,false,20),
(10,$unit5$A school timetable
— Traduction française : Un emploi du temps scolaire$unit5$,false,30),
(20,$unit5$would
— Traduction française : développeraient$unit5$,true,10),
(20,$unit5$will
— Traduction française : développeront$unit5$,false,20),
(20,$unit5$would have
— Traduction française : auraient$unit5$,false,30),
(30,$unit5$Influence over one’s food system
— Traduction française : Influence sur son système alimentaire$unit5$,true,10),
(30,$unit5$A type of export crop
— Traduction française : Un type de culture d’exportation$unit5$,false,20),
(30,$unit5$A financial crisis
— Traduction française : Une crise financière$unit5$,false,30),
(40,$unit5$Actor, cause, place, date and result
— Traduction française : Acteur, cause, lieu, date et résultat$unit5$,true,10),
(40,$unit5$Only the first word
— Traduction française : Seulement le premier mot$unit5$,false,20),
(40,$unit5$The learner’s favourite opinion
— Traduction française : L’opinion préférée de l’élève$unit5$,false,30)) as v(question_order,answer,is_correct,display_order) on v.question_order=iq.display_order;
insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active) values (target.subject_id,target.level_id,target.series_id,target.offering_id,target_chapter_id,target_lesson_id,$unit5$Bilingual quiz 2 — Writing: sustainable food article

> **Traduction française :** Quiz bilingue 2 — Écriture : article sur l’alimentation durable$unit5$,$unit5$**Check article structure, sustainability vocabulary and responsible development.**

> **Traduction française :** Vérifie la structure de l’article, le vocabulaire de la durabilité et le développement responsable.$unit5$,'medium',15,20,false,false) returning id into q_write; with inserted_questions as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values (q_write,$unit5$**What does sustainable mean in the Unit 5 vocabulary?**

> **Traduction française :** Que signifie sustainable dans le vocabulaire de l’Unit 5 ?$unit5$,$unit5$**It means able to continue without harming future needs.**

> **Traduction française :** Cela signifie capable de continuer sans nuire aux besoins futurs.$unit5$,'single_choice',10,1,true),
(q_write,$unit5$**Which feature helps a reader enter an article?**

> **Traduction française :** Quelle caractéristique aide un lecteur à entrer dans un article ?$unit5$,$unit5$**A title and engaging opening introduce the topic.**

> **Traduction française :** Un titre et une ouverture engageante présentent le sujet.$unit5$,'single_choice',20,1,true),
(q_write,$unit5$**Which source term means commercial exchange of goods?**

> **Traduction française :** Quel terme de la source signifie échange commercial de biens ?$unit5$,$unit5$**Trade means commercial exchange of goods.**

> **Traduction française :** Trade signifie échange commercial de biens.$unit5$,'single_choice',30,1,true),
(q_write,$unit5$**What should a conclusion of this article do?**

> **Traduction française :** Que doit faire la conclusion de cet article ?$unit5$,$unit5$**It should summarise a practical message without claiming an unverified result.**

> **Traduction française :** Elle doit résumer un message pratique sans prétendre à un résultat non vérifié.$unit5$,'single_choice',40,1,true) returning id,display_order) insert into public.quiz_answers (question_id,answer,is_correct,display_order) select iq.id,v.answer,v.is_correct,v.display_order from inserted_questions iq join (values (10,$unit5$Durable over time
— Traduction française : Durable dans le temps$unit5$,true,10),
(10,$unit5$Available today only
— Traduction française : Disponible seulement aujourd’hui$unit5$,false,20),
(10,$unit5$A letter closing
— Traduction française : Une formule de clôture de lettre$unit5$,false,30),
(20,$unit5$Title and engaging opening
— Traduction française : Titre et ouverture engageante$unit5$,true,10),
(20,$unit5$Yours faithfully
— Traduction française : Formule de clôture formelle$unit5$,false,20),
(20,$unit5$Receiver’s address only
— Traduction française : Seulement l’adresse du destinataire$unit5$,false,30),
(30,$unit5$trade
— Traduction française : commerce$unit5$,true,10),
(30,$unit5$waste
— Traduction française : gaspillage$unit5$,false,20),
(30,$unit5$hunger
— Traduction française : faim$unit5$,false,30),
(40,$unit5$Summarise a useful message
— Traduction française : Résumer un message utile$unit5$,true,10),
(40,$unit5$Invent a policy decision
— Traduction française : Inventer une décision politique$unit5$,false,20),
(40,$unit5$Repeat the title only
— Traduction française : Répéter seulement le titre$unit5$,false,30)) as v(question_order,answer,is_correct,display_order) on v.question_order=iq.display_order;
  end loop;
end $unit5_migration$;
