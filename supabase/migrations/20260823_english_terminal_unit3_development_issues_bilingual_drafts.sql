-- Lot Anglais Terminale Unit 3 Development Issues : Reading et Writing bilingues.
-- Toutes les ressources créées sont en brouillon, inactives et non publiées.
do $english_terminal_unit3_content$
declare
  target record;
  chapter_uuid uuid;
  lesson_uuid uuid;
  exercise_reading_uuid uuid;
  exercise_writing_uuid uuid;
  quiz_reading_uuid uuid;
  quiz_writing_uuid uuid;
  current_content text;
  current_exercises integer;
  current_quizzes integer;
  target_count integer;
  unit_title constant text := 'UNIT 3 DEVELOPMENT ISSUES';
begin
  select count(*) into target_count from public.course_subject_offerings where id in ($english_unit3$81c5b295-b5d4-4a7c-a922-0604236a4aa8$english_unit3$, $english_unit3$0bc8f25a-432a-441b-8a86-303b452aaf9f$english_unit3$, $english_unit3$ff97ed10-ea0d-4e7e-9dd1-8010229c03b6$english_unit3$, $english_unit3$94543938-fd4c-4ba8-8205-35f765264719$english_unit3$);
  if target_count <> 4 then
    raise exception 'Les quatre offres Anglais Terminale A1/A2/C/D attendues sont requises ; transaction annulée.';
  end if;
  if exists (
    select 1 from public.lessons le join public.chapters ch on ch.id=le.chapter_id
    where ch.subject_offering_id in ($english_unit3$81c5b295-b5d4-4a7c-a922-0604236a4aa8$english_unit3$, $english_unit3$0bc8f25a-432a-441b-8a86-303b452aaf9f$english_unit3$, $english_unit3$ff97ed10-ea0d-4e7e-9dd1-8010229c03b6$english_unit3$, $english_unit3$94543938-fd4c-4ba8-8205-35f765264719$english_unit3$) and le.title=unit_title
      and (coalesce(char_length(le.content),0)>0 or exists (select 1 from public.exercises e where e.lesson_id=le.id) or exists (select 1 from public.quizzes q where q.lesson_id=le.id))
  ) then
    raise exception 'Une leçon Unit 3 Development Issues cible contient déjà du contenu, un exercice ou un quiz ; ré-audit requis avant toute écriture.';
  end if;
  for target in
    select o.id as offering_id,o.subject_id,o.level_id,o.series_id,se.name as series_name
    from public.course_subject_offerings o join public.series se on se.id=o.series_id
    where o.id in ($english_unit3$81c5b295-b5d4-4a7c-a922-0604236a4aa8$english_unit3$, $english_unit3$0bc8f25a-432a-441b-8a86-303b452aaf9f$english_unit3$, $english_unit3$ff97ed10-ea0d-4e7e-9dd1-8010229c03b6$english_unit3$, $english_unit3$94543938-fd4c-4ba8-8205-35f765264719$english_unit3$) order by se.name
  loop
    select id into chapter_uuid from public.chapters where subject_offering_id=target.offering_id and title='PROGRESSION TERMINALE A' limit 1;
    if chapter_uuid is null and target.series_name in ('C','D') then
      select id into chapter_uuid from public.chapters where subject_offering_id=target.offering_id and title='PROGRESSIONS TERMINALES C ET D — Anglais' limit 1;
    end if;
    if chapter_uuid is null then
      raise exception 'Le chapitre Anglais Terminale attendu est absent pour la série %.', target.series_name;
    end if;
    select id,content into lesson_uuid,current_content from public.lessons where chapter_id=chapter_uuid and title=unit_title limit 1;
    if lesson_uuid is null then
      raise exception 'La structure Unit 3 attendue est absente pour la série % ; création de contenu annulée.', target.series_name;
    end if;
    select count(*) into current_exercises from public.exercises where lesson_id=lesson_uuid;
    select count(*) into current_quizzes from public.quizzes where lesson_id=lesson_uuid;
    if coalesce(char_length(current_content),0)>0 or current_exercises>0 or current_quizzes>0 then
      raise exception 'La leçon Unit 3 de la série % n’est pas vide ; écrasement interdit.', target.series_name;
    end if;
    update public.lessons set description='Unit 3 Development Issues : lecture critique du mariage des enfants et méthode approfondie de rédaction d’article bilingue.',content=$english_unit3$## Unit 3 — Development Issues

> **Traduction française :** Unité 3 — Problèmes de développement.

> **Bilingual learning goal:** read critically about child marriage and human rights, then write a structured article about a threatened indigenous way of life.

> **Objectif bilingue :** lire de manière critique au sujet du mariage des enfants et des droits humains, puis rédiger un article structuré sur un mode de vie autochtone menacé.

> **Important source note:** the supplied worksheets give prompts, vocabulary and tasks but do not reproduce the full reading text, map or model article. This course develops the visible information and reliable methods without inventing quotations, legal facts or model-source answers that are absent from the PDFs.

> **Traduction française :** **Note importante sur la source :** les fiches fournies donnent des consignes, du vocabulaire et des tâches, mais ne reproduisent ni le texte de lecture complet, ni la carte, ni l’article modèle. Ce cours développe les informations visibles et des méthodes fiables sans inventer de citations, de faits juridiques ou de réponses du modèle absentes des PDF.

---

## Part A — Reading for comprehension: child marriage and human rights

> **Traduction française :** Partie A — Compréhension écrite : mariage des enfants et droits humains.

### 1. Learning situation

**Students of Terminale C at Lycée Moderne Adjamé Harris read a text about child brides to understand the causes of child marriage and its drawbacks.**

> **Traduction française :** **Des élèves de Terminale C du Lycée Moderne Adjamé Harris lisent un texte sur les jeunes mariées afin de comprendre les causes du mariage des enfants et ses conséquences négatives.**

This is a sensitive human-rights topic. Read and discuss it respectfully. The aim is to understand why early marriage can harm education, health, safety and future opportunities, and to think about protection rather than judging people or communities.

> **Traduction française :** C’est un sujet sensible de droits humains. Lis et discute avec respect. L’objectif est de comprendre pourquoi le mariage précoce peut nuire à l’éducation, à la santé, à la sécurité et aux possibilités d’avenir, et de réfléchir à la protection plutôt que de juger des personnes ou des communautés.

### 2. Before you read: predict carefully

**Look at the map on page 32. What does it show? What may be the causes of child marriage?**

> **Traduction française :** **Observe la carte de la page 32. Que montre-t-elle ? Quelles peuvent être les causes du mariage des enfants ?**

Prediction is useful when it remains a question, not a conclusion. You may predict that a map compares places or situations, but you must confirm every precise fact by reading the text.

> **Traduction française :** L’anticipation est utile lorsqu’elle reste une question et non une conclusion. Tu peux supposer qu’une carte compare des lieux ou des situations, mais tu dois confirmer chaque fait précis en lisant le texte.

### 3. Read for the general idea

**The general idea is the main message of a text. It answers: what broad issue is discussed, who is affected and why does the issue matter?**

> **Traduction française :** **L’idée générale est le message principal d’un texte. Elle répond à : quel problème général est discuté, qui est concerné et pourquoi ce problème est-il important ?**

For this worksheet, a careful general idea can be: **the text discusses child marriage, its causes and the negative consequences it can have for girls’ lives.**

> **Traduction française :** Pour cette fiche, une idée générale prudente peut être : **le texte traite du mariage des enfants, de ses causes et des conséquences négatives qu’il peut avoir sur la vie des filles.**

Do not turn the general idea into a list of all details. Keep it concise, neutral and supported by the text.

> **Traduction française :** Ne transforme pas l’idée générale en liste de tous les détails. Garde-la concise, neutre et appuyée sur le texte.

### 4. Vocabulary through context

The worksheet gives one model answer: **new married woman or girl → bride**.

> **Traduction française :** La fiche donne une réponse modèle : **new married woman or girl → bride** (nouvelle femme ou fille mariée → mariée).

Use the paragraph number as a clue. Then look at the grammar and the words around the unknown expression.

> **Traduction française :** Utilise le numéro de paragraphe comme indice. Observe ensuite la grammaire et les mots autour de l’expression inconnue.

| Meaning prompt from the worksheet | Strategy | French explanation |
|---|---|---|
| **New married woman or girl** | Look for a noun that names the married female person. | **Traduction française :** Cherche un nom qui désigne la personne de sexe féminin mariée. Le modèle donne *bride*. |
| **Reach** | Look for a verb of arrival or achievement; check what follows it. | **Traduction française :** Cherche un verbe d’arrivée ou d’atteinte ; vérifie ce qui le suit. |
| **Reducing expenditures** | Look for an expression about spending less money. | **Traduction française :** Cherche une expression qui signifie dépenser moins d’argent. |
| **To have a natural tendency to** | Look for a verb phrase meaning to be likely or inclined to do something. | **Traduction française :** Cherche une expression verbale qui signifie avoir tendance ou être enclin à faire quelque chose. |
| **Refused to recognize** | Look for a phrase meaning to deny, reject or fail to accept a fact. | **Traduction française :** Cherche une expression qui signifie nier, rejeter ou ne pas accepter un fait. |
| **To make someone stronger or confident** | Look for a verb linked to giving power, ability or confidence. | **Traduction française :** Cherche un verbe lié au fait de donner de la force, une capacité ou de la confiance. |
| **Perception of a situation** | Look for a noun meaning the way someone sees or understands a situation. | **Traduction française :** Cherche un nom qui signifie la manière dont une personne voit ou comprend une situation. |
| **At the same time as** | Look for a connector showing simultaneity. | **Traduction française :** Cherche un connecteur qui indique la simultanéité. |

### 5. True or false: prove before you decide

The source asks you to decide whether statements are true or false and to justify them by quoting lines. Statements mention comparisons between Africa and Asia, legal age, poverty, education, leaving school, marriage and having a baby.

> **Traduction française :** La source te demande de décider si des affirmations sont vraies ou fausses et de les justifier en citant les lignes. Les affirmations évoquent des comparaisons entre l’Afrique et l’Asie, l’âge légal, la pauvreté, l’éducation, l’abandon scolaire, le mariage et le fait d’avoir un bébé.

Because the full reading text is not supplied, do not memorise unverified answers. Apply a proof routine instead.

> **Traduction française :** Comme le texte de lecture complet n’est pas fourni, ne mémorise pas des réponses non vérifiées. Applique plutôt une méthode de preuve.

1. **Underline the key information in the statement: place, person, number, cause or consequence.**

   > **Traduction française :** Souligne l’information clé dans l’affirmation : lieu, personne, nombre, cause ou conséquence.

2. **Find the paragraph named by the clue and read the whole sentence, not one isolated word.**

   > **Traduction française :** Trouve le paragraphe indiqué par l’indice et lis la phrase entière, pas un mot isolé.

3. **Choose true only if all key facts agree. A changed number, country, cause or age can make a statement false.**

   > **Traduction française :** Choisis vrai seulement si tous les faits clés correspondent. Un nombre, un pays, une cause ou un âge modifié peut rendre une affirmation fausse.

4. **Give the line reference or short quotation that proves your decision.**

   > **Traduction française :** Donne la référence de ligne ou une courte citation qui prouve ta décision.

### 6. Discussion: speak about protection, not rumours

The Human Rights Club activity asks learners to discuss the legal age for girls and boys to marry, the situation of child marriage and possible cases of early marriage in their country.

> **Traduction française :** L’activité du Human Rights Club demande aux élèves de discuter de l’âge légal du mariage pour les filles et les garçons, de la situation du mariage des enfants et de cas éventuels de mariage précoce dans leur pays.

**A responsible discussion separates verified law from personal opinion. If you do not know a legal fact, say that it must be checked using a reliable official source; do not guess.**

> **Traduction française :** **Une discussion responsable sépare le droit vérifié de l’opinion personnelle. Si tu ne connais pas un fait juridique, dis qu’il doit être vérifié dans une source officielle fiable ; ne devine pas.**

**Education can help young people understand their rights, make informed choices and seek support when needed.**

> **Traduction française :** **L’éducation peut aider les jeunes à comprendre leurs droits, à faire des choix éclairés et à chercher du soutien lorsque c’est nécessaire.**

---

## Part B — Writing: write a clear article about a threatened indigenous way of life

> **Traduction française :** Partie B — Expression écrite : rédiger un article clair sur un mode de vie autochtone menacé.

> **Writing goal:** write a 250–300 word article that informs the reader, explains a problem and proposes realistic protection measures.

> **Objectif d’écriture :** rédiger un article de 250 à 300 mots qui informe le lecteur, explique un problème et propose des mesures réalistes de protection.

### 1. Understand the context and the genre

**Students are invited to an American school in Abidjan, where participants from different countries discuss threatened groups in their home countries. They decide to write an article about one group.**

> **Traduction française :** **Les élèves sont invités dans une école américaine à Abidjan, où des participants de différents pays discutent de groupes menacés dans leurs pays d’origine. Ils décident d’écrire un article sur un groupe.**

An article is not a letter. It normally has a title, an introduction, a developed main body and a conclusion. It informs a wider audience clearly and keeps one central idea in each main paragraph.

> **Traduction française :** Un article n’est pas une lettre. Il possède normalement un titre, une introduction, un développement et une conclusion. Il informe clairement un public large et conserve une idée centrale dans chaque paragraphe principal.

| Article | Informal letter |
|---|---|
| **Title + introduction + main body + conclusion** | **Greeting + personal paragraphs + closing + signature** |
| **Informs readers about an issue and proposes solutions.**<br><br>**Traduction française :** Informe les lecteurs sur un problème et propose des solutions. | **Shares personal news with a specific friend.**<br><br>**Traduction française :** Partage des nouvelles personnelles avec un ami précis. |
| **Uses clear, neutral and respectful information.**<br><br>**Traduction française :** Utilise des informations claires, neutres et respectueuses. | **Uses a warm, personal and friendly tone.**<br><br>**Traduction française :** Utilise un ton chaleureux, personnel et amical. |

### 2. The paragraph plan required by the PDF

The source gives six possible headings: **introduction; description of their traditional way of life; reason why this lifestyle is under threat today; importance of saving native people; possible solutions; conclusion.**

> **Traduction française :** La source donne six titres possibles : **introduction ; description de leur mode de vie traditionnel ; raison pour laquelle ce mode de vie est menacé aujourd’hui ; importance de sauvegarder les peuples autochtones ; solutions possibles ; conclusion.**

This creates a logical six-part plan. A short article can combine the two shortest ideas only if the final text remains clear, but beginning writers should keep the six steps visible.

> **Traduction française :** Cela crée un plan logique en six parties. Un article court peut combiner les deux idées les plus brèves seulement si le texte final reste clair, mais les débutants devraient garder les six étapes visibles.

| Paragraph | Purpose | Guiding questions | French translation |
|---|---|---|---|
| **1. Introduction** | Name the group and the issue. | Who are they? Where do they live? Why is the topic important? | **Introduction :** présente le groupe et le problème. Qui sont-ils ? Où vivent-ils ? Pourquoi le sujet est-il important ? |
| **2. Traditional way of life** | Describe culture, knowledge and daily life with respect. | What traditions, activities, language, environment or skills matter? | **Mode de vie traditionnel :** décris la culture, les connaissances et la vie quotidienne avec respect. |
| **3. Threat today** | Explain the cause of danger. | What change, pressure or loss affects the group? | **Menace actuelle :** explique la cause du danger. Quel changement, quelle pression ou quelle perte touche le groupe ? |
| **4. Why protection matters** | Show the value of culture and heritage. | What can society lose if the lifestyle disappears? | **Pourquoi la protection est importante :** montre la valeur de la culture et du patrimoine. |
| **5. Possible solutions** | Propose realistic action. | Who can act? What can communities, schools, authorities or partners do? | **Solutions possibles :** propose des actions réalistes. Qui peut agir et comment ? |
| **6. Conclusion** | Summarise and invite responsible action. | What is the main message readers should remember? | **Conclusion :** résume et invite à une action responsable. |

### 3. Build ideas before writing sentences

The worksheet proposes ideas such as **flood, wisdom and knowledge, adapt to their environment, pay compensation, building of a dam, settlements, marriage customs, cultivation, organize protests, fighting for survival, preservation of authenticity and knowledge.**

> **Traduction française :** La fiche propose des idées comme **inondation, sagesse et savoir, s’adapter à leur environnement, verser une compensation, construction d’un barrage, installations, coutumes matrimoniales, culture agricole, organiser des protestations, lutter pour la survie, préservation de l’authenticité et des connaissances.**

These are planning ideas, not a ready-made article. Choose only the ideas that fit the group and problem you describe. Do not put all ideas in one paragraph.

> **Traduction française :** Ce sont des idées de planification, pas un article déjà rédigé. Choisis seulement les idées qui conviennent au groupe et au problème décrits. Ne mets pas toutes les idées dans un seul paragraphe.

**Planning grid:**

| Question | Your brief note before writing |
|---|---|
| **Who is the indigenous group?**<br><br>**Traduction française :** Qui est le peuple autochtone ? | Write one accurate identifying detail; if you research, verify it first.<br><br>**Traduction française :** Écris un détail d’identification exact ; si tu fais une recherche, vérifie-le d’abord. |
| **What way of life is valuable?**<br><br>**Traduction française :** Quel mode de vie a de la valeur ? | Select two or three culture, knowledge, environment or livelihood details.<br><br>**Traduction française :** Sélectionne deux ou trois détails de culture, de savoir, d’environnement ou de moyens de subsistance. |
| **What threatens it?**<br><br>**Traduction française :** Qu’est-ce qui le menace ? | State one cause clearly and explain one consequence.<br><br>**Traduction française :** Indique une cause clairement et explique une conséquence. |
| **What can be done?**<br><br>**Traduction française :** Que peut-on faire ? | Propose two feasible actions and identify possible actors.<br><br>**Traduction française :** Propose deux actions réalisables et identifie des acteurs possibles. |

### 4. Article language bank

| Function | English language | French translation |
|---|---|---|
| Introduce | **This article focuses on… / One community that deserves attention is…** | **Cet article porte sur… / Une communauté qui mérite de l’attention est…** |
| Describe | **For generations, the community has… / Their knowledge of the environment helps them…** | **Depuis des générations, la communauté a… / Leur connaissance de l’environnement les aide à…** |
| Explain a threat | **Today, this way of life is under threat because… / As a result,…** | **Aujourd’hui, ce mode de vie est menacé parce que… / Par conséquent,…** |
| Show importance | **Protecting this heritage matters because…** | **Protéger ce patrimoine est important parce que…** |
| Propose solutions | **Authorities and communities could… / Schools can help by… / A fair solution would be…** | **Les autorités et les communautés pourraient… / Les écoles peuvent aider en… / Une solution équitable serait de…** |
| Conclude | **In conclusion, development should respect both people and heritage.** | **En conclusion, le développement devrait respecter à la fois les personnes et le patrimoine.** |

### 5. Write step by step

1. **Choose a precise title. A good title tells the reader the issue without giving the whole conclusion.**

   > **Traduction française :** Choisis un titre précis. Un bon titre indique le problème au lecteur sans donner toute la conclusion.

2. **Draft one main idea for each paragraph. Keep the paragraph focused on that idea.**

   > **Traduction française :** Prépare une idée principale pour chaque paragraphe. Garde le paragraphe centré sur cette idée.

3. **Use connectors to show logic: *first*, *however*, *because*, *as a result*, *therefore*, *finally*.**

   > **Traduction française :** Utilise des connecteurs pour montrer la logique : *first* (d’abord), *however* (cependant), *because* (parce que), *as a result* (par conséquent), *therefore* (donc), *finally* (enfin).

4. **Separate facts from proposals. Use cautious language when you do not have a verified statistic or legal detail.**

   > **Traduction française :** Sépare les faits des propositions. Utilise une langue prudente lorsque tu n’as pas de statistique ou de détail juridique vérifié.

5. **Revise for unity, accuracy, grammar, spelling and punctuation.**

   > **Traduction française :** Relis pour vérifier l’unité du texte, l’exactitude, la grammaire, l’orthographe et la ponctuation.

### 6. Guided mini-model: original practice, not a source article

> **This short model is an original practice example that demonstrates article structure. It does not claim to describe a specific people from the source PDF. Adapt it with verified local information when writing your own article.**

> **Traduction française :** **Ce court modèle est un exemple d’entraînement original qui démontre la structure d’un article. Il ne prétend pas décrire un peuple précis du PDF source. Adapte-le avec des informations locales vérifiées lorsque tu écris ton propre article.**

### Protecting a Living Heritage

> **Traduction française :** Protéger un patrimoine vivant.

**Some indigenous communities preserve valuable knowledge about land, language and cooperation. Their traditions are not only part of the past; they remain part of a living identity.**

> **Traduction française :** **Certaines communautés autochtones préservent des connaissances précieuses sur la terre, la langue et la coopération. Leurs traditions ne font pas seulement partie du passé ; elles font encore partie d’une identité vivante.**

**For generations, community members may have adapted their work and customs to their environment. They may pass knowledge from older people to younger people through stories, farming, crafts or ceremonies.**

> **Traduction française :** **Depuis des générations, les membres d’une communauté peuvent avoir adapté leur travail et leurs coutumes à leur environnement. Ils peuvent transmettre les connaissances des aînés aux plus jeunes par des récits, l’agriculture, l’artisanat ou des cérémonies.**

**Today, however, this way of life can be under threat when people lose access to land, water or safe homes. Major projects, environmental changes or forced displacement may place pressure on communities.**

> **Traduction française :** **Aujourd’hui, cependant, ce mode de vie peut être menacé lorsque les personnes perdent l’accès à la terre, à l’eau ou à des logements sûrs. Les grands projets, les changements environnementaux ou les déplacements forcés peuvent exercer une pression sur les communautés.**

**Protecting heritage matters because a society loses knowledge and diversity when a culture disappears. Development should improve lives without ignoring people’s dignity, consent and history.**

> **Traduction française :** **Protéger le patrimoine est important car une société perd des connaissances et de la diversité lorsqu’une culture disparaît. Le développement devrait améliorer les vies sans ignorer la dignité, le consentement et l’histoire des personnes.**

**Communities, schools and decision-makers can work together. They can listen to local voices, protect cultural knowledge, provide fair information and seek solutions that respect both safety and tradition.**

> **Traduction française :** **Les communautés, les écoles et les décideurs peuvent travailler ensemble. Ils peuvent écouter les voix locales, protéger les savoirs culturels, fournir des informations équitables et rechercher des solutions qui respectent à la fois la sécurité et la tradition.**

**In conclusion, respecting indigenous heritage is compatible with responsible development. The best solutions are those that include the people concerned.**

> **Traduction française :** **En conclusion, le respect du patrimoine autochtone est compatible avec un développement responsable. Les meilleures solutions sont celles qui incluent les personnes concernées.**

### 7. Manage the 250–300 word task

The source asks for 250 to 300 words. A practical target is one introduction of about 35–45 words, four developed paragraphs of about 40–50 words and a short conclusion of about 25–35 words.

> **Traduction française :** La source demande entre 250 et 300 mots. Un objectif pratique est une introduction d’environ 35 à 45 mots, quatre paragraphes développés d’environ 40 à 50 mots et une courte conclusion d’environ 25 à 35 mots.

| Final article checklist | Why it matters |
|---|---|
| **Do I have a title, introduction, main body and conclusion?**<br><br>**Traduction française :** Ai-je un titre, une introduction, un développement et une conclusion ? | The worksheet explicitly checks this article structure.<br><br>**Traduction française :** La fiche vérifie explicitement cette structure d’article. |
| **Does each main paragraph develop one central idea?**<br><br>**Traduction française :** Chaque paragraphe principal développe-t-il une idée centrale ? | It makes the article easy to follow.<br><br>**Traduction française :** Cela rend l’article facile à suivre. |
| **Have I explained causes, effects and realistic solutions?**<br><br>**Traduction française :** Ai-je expliqué les causes, les effets et des solutions réalistes ? | It answers the communication task fully.<br><br>**Traduction française :** Cela répond complètement à la tâche de communication. |
| **Have I checked facts, grammar, spelling and punctuation?**<br><br>**Traduction française :** Ai-je vérifié les faits, la grammaire, l’orthographe et la ponctuation ? | Clear language increases credibility and respect.<br><br>**Traduction française :** Une langue claire renforce la crédibilité et le respect. |

> **Writing synthesis:** a strong article informs, organises and proposes. It respects the people it describes, avoids unsupported claims and leads readers toward responsible action.

> **Traduction française :** **Synthèse d’écriture :** un bon article informe, organise et propose. Il respecte les personnes qu’il décrit, évite les affirmations non vérifiées et conduit les lecteurs vers une action responsable.

## Pedagogical reference

Reformulated and expanded from the supplied PDFs: **Unit 3 Development Issues — Reading for Comprehension**, Far Ahead Terminale, pages 32–33, and **Unit 3 Development Issues — Writing an Article**, École numérique, Côte d’Ivoire.$english_unit3$,is_active=false where id=lesson_uuid;

    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
    values (target.subject_id,target.level_id,target.series_id,chapter_uuid,lesson_uuid,'Exercise 1 — Reading: child marriage and evidence

> **Traduction française :** Exercice 1 — Lecture : mariage des enfants et preuve',$english_unit3$**Apply the strategies for general idea, vocabulary in context and evidence-based true-or-false answers.**

> **Traduction française :** Applique les stratégies pour l’idée générale, le vocabulaire en contexte et les réponses vrai/faux fondées sur des preuves.$english_unit3$,$english_unit3$**The correction uses only information visible in the supplied worksheet and explains the proof method.**

> **Traduction française :** La correction utilise seulement les informations visibles dans la fiche fournie et explique la méthode de preuve.$english_unit3$,'single_choice','medium',$english_unit3$**Choose the answer supported by the Unit 3 Reading prompt.**

> **Traduction française :** Choisis la réponse appuyée par la consigne Reading de l’Unit 3.$english_unit3$,$english_unit3$**Read the explanation in both languages before continuing.**

> **Traduction française :** Lis l’explication dans les deux langues avant de continuer.$english_unit3$,false,false,25,10) returning id into exercise_reading_uuid;
insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
      (exercise_reading_uuid,$english_unit3$single_choice$english_unit3$,$english_unit3$**What is the general idea of the supplied reading activity?**

> **Traduction française :** Quelle est l’idée générale de l’activité de lecture fournie ?$english_unit3$,jsonb_build_array($english_unit3$Child marriage, its causes and drawbacks
— Traduction française : Le mariage des enfants, ses causes et ses conséquences négatives$english_unit3$, $english_unit3$A cooking competition
— Traduction française : Un concours de cuisine$english_unit3$, $english_unit3$A sports match
— Traduction française : Un match de sport$english_unit3$),jsonb_build_array($english_unit3$Child marriage, its causes and drawbacks
— Traduction française : Le mariage des enfants, ses causes et ses conséquences négatives$english_unit3$),$english_unit3$**The learning context explicitly says that the text is about child brides, the causes of child marriage and its drawbacks.**

> **Traduction française :** Le contexte d’apprentissage indique explicitement que le texte porte sur les jeunes mariées, les causes du mariage des enfants et ses conséquences négatives.$english_unit3$,10),
      (exercise_reading_uuid,$english_unit3$single_choice$english_unit3$,$english_unit3$**Which vocabulary answer is explicitly provided by the worksheet?**

> **Traduction française :** Quelle réponse de vocabulaire est explicitement fournie par la fiche ?$english_unit3$,jsonb_build_array($english_unit3$new married woman or girl → bride
— Traduction française : nouvelle femme ou fille mariée → bride / mariée$english_unit3$, $english_unit3$reach → flood
— Traduction française : reach → flood / atteindre → inondation$english_unit3$, $english_unit3$perception → school
— Traduction française : perception → school / perception → école$english_unit3$),jsonb_build_array($english_unit3$new married woman or girl → bride
— Traduction française : nouvelle femme ou fille mariée → bride / mariée$english_unit3$),$english_unit3$**The worksheet gives “bride” as the model answer for a new married woman or girl.**

> **Traduction française :** La fiche donne « bride » comme réponse modèle pour une nouvelle femme ou fille mariée.$english_unit3$,20),
      (exercise_reading_uuid,$english_unit3$single_choice$english_unit3$,$english_unit3$**What must you do after choosing true or false?**

> **Traduction française :** Que dois-tu faire après avoir choisi vrai ou faux ?$english_unit3$,jsonb_build_array($english_unit3$Justify with the relevant line(s)
— Traduction française : Justifier avec la ou les lignes pertinentes$english_unit3$, $english_unit3$Write a new story
— Traduction française : Écrire une nouvelle histoire$english_unit3$, $english_unit3$Ignore the text
— Traduction française : Ignorer le texte$english_unit3$),jsonb_build_array($english_unit3$Justify with the relevant line(s)
— Traduction française : Justifier avec la ou les lignes pertinentes$english_unit3$),$english_unit3$**The source requires learners to justify true-or-false decisions by quoting the lines.**

> **Traduction française :** La source exige que les élèves justifient les décisions vrai/faux en citant les lignes.$english_unit3$,30),
      (exercise_reading_uuid,$english_unit3$single_choice$english_unit3$,$english_unit3$**What is the responsible way to mention an unknown legal age?**

> **Traduction française :** Quelle est la manière responsable de mentionner un âge légal inconnu ?$english_unit3$,jsonb_build_array($english_unit3$Say it must be checked in a reliable official source.
— Traduction française : Dire qu’il doit être vérifié dans une source officielle fiable.$english_unit3$, $english_unit3$Invent a number.
— Traduction française : Inventer un nombre.$english_unit3$, $english_unit3$Repeat a rumour.
— Traduction française : Répéter une rumeur.$english_unit3$),jsonb_build_array($english_unit3$Say it must be checked in a reliable official source.
— Traduction française : Dire qu’il doit être vérifié dans une source officielle fiable.$english_unit3$),$english_unit3$**Legal facts must be verified; a human-rights discussion must not turn a guess into a fact.**

> **Traduction française :** Les faits juridiques doivent être vérifiés ; une discussion sur les droits humains ne doit pas transformer une supposition en fait.$english_unit3$,40);

    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
    values (target.subject_id,target.level_id,target.series_id,chapter_uuid,lesson_uuid,'Exercise 2 — Writing: build a responsible article

> **Traduction française :** Exercice 2 — Écriture : construire un article responsable',$english_unit3$**Choose the article structure, planning steps and ethical writing choices required by the Unit 3 task.**

> **Traduction française :** Choisis la structure d’article, les étapes de planification et les choix d’écriture éthiques demandés par la tâche de l’Unit 3.$english_unit3$,$english_unit3$**The correction strengthens title, introduction, main body, conclusion, one central idea per paragraph and evidence-aware language.**

> **Traduction française :** La correction renforce le titre, l’introduction, le développement, la conclusion, une idée centrale par paragraphe et une langue attentive aux preuves.$english_unit3$,'single_choice','medium',$english_unit3$**Plan first, then write 250–300 words with a title, introduction, developed paragraphs, conclusion and realistic solutions.**

> **Traduction française :** Planifie d’abord, puis écris 250 à 300 mots avec un titre, une introduction, des paragraphes développés, une conclusion et des solutions réalistes.$english_unit3$,$english_unit3$**A responsible article informs readers without inventing statistics or ignoring the people concerned.**

> **Traduction française :** Un article responsable informe les lecteurs sans inventer de statistiques ni ignorer les personnes concernées.$english_unit3$,false,false,35,20) returning id into exercise_writing_uuid;
insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
      (exercise_writing_uuid,$english_unit3$single_choice$english_unit3$,$english_unit3$**What genre does the Writing PDF teach?**

> **Traduction française :** Quel genre le PDF Writing enseigne-t-il ?$english_unit3$,jsonb_build_array($english_unit3$An article
— Traduction française : Un article$english_unit3$, $english_unit3$An informal letter
— Traduction française : Une lettre informelle$english_unit3$, $english_unit3$A dialogue only
— Traduction française : Un dialogue uniquement$english_unit3$),jsonb_build_array($english_unit3$An article
— Traduction française : Un article$english_unit3$),$english_unit3$**The Writing PDF is titled “Writing an Article”.**

> **Traduction française :** Le PDF Writing est intitulé « Writing an Article ».$english_unit3$,10),
      (exercise_writing_uuid,$english_unit3$single_choice$english_unit3$,$english_unit3$**Which part belongs at the beginning of an article?**

> **Traduction française :** Quelle partie se place au début d’un article ?$english_unit3$,jsonb_build_array($english_unit3$A title and an introduction
— Traduction française : Un titre et une introduction$english_unit3$, $english_unit3$A signature to a friend
— Traduction française : Une signature à un ami$english_unit3$, $english_unit3$A random conclusion
— Traduction française : Une conclusion au hasard$english_unit3$),jsonb_build_array($english_unit3$A title and an introduction
— Traduction française : Un titre et une introduction$english_unit3$),$english_unit3$**The source checks that an article begins with a title and has an introduction, main body and conclusion.**

> **Traduction française :** La source vérifie qu’un article commence par un titre et possède une introduction, un développement et une conclusion.$english_unit3$,20),
      (exercise_writing_uuid,$english_unit3$single_choice$english_unit3$,$english_unit3$**What should the paragraph about threats explain?**

> **Traduction française :** Que doit expliquer le paragraphe sur les menaces ?$english_unit3$,jsonb_build_array($english_unit3$Why the lifestyle is under threat today
— Traduction française : Pourquoi le mode de vie est menacé aujourd’hui$english_unit3$, $english_unit3$Only the writer’s birthday
— Traduction française : Seulement l’anniversaire de l’auteur$english_unit3$, $english_unit3$A greeting formula
— Traduction française : Une formule de salutation$english_unit3$),jsonb_build_array($english_unit3$Why the lifestyle is under threat today
— Traduction française : Pourquoi le mode de vie est menacé aujourd’hui$english_unit3$),$english_unit3$**One source heading is “reason why this lifestyle is under threat today”.**

> **Traduction française :** L’un des titres source est « raison pour laquelle ce mode de vie est menacé aujourd’hui ».$english_unit3$,30),
      (exercise_writing_uuid,$english_unit3$single_choice$english_unit3$,$english_unit3$**How many words does the source ask you to write?**

> **Traduction française :** Combien de mots la source demande-t-elle d’écrire ?$english_unit3$,jsonb_build_array($english_unit3$250 to 300 words
— Traduction française : 250 à 300 mots$english_unit3$, $english_unit3$20 words
— Traduction française : 20 mots$english_unit3$, $english_unit3$1,000 words
— Traduction française : 1 000 mots$english_unit3$),jsonb_build_array($english_unit3$250 to 300 words
— Traduction française : 250 à 300 mots$english_unit3$),$english_unit3$**The communicative activity asks for an article of 250 to 300 words.**

> **Traduction française :** L’activité communicative demande un article de 250 à 300 mots.$english_unit3$,40),
      (exercise_writing_uuid,$english_unit3$single_choice$english_unit3$,$english_unit3$**Which solution is responsible in an article about threatened heritage?**

> **Traduction française :** Quelle solution est responsable dans un article sur un patrimoine menacé ?$english_unit3$,jsonb_build_array($english_unit3$Listen to local voices and propose fair, feasible protection.
— Traduction française : Écouter les voix locales et proposer une protection équitable et réalisable.$english_unit3$, $english_unit3$Ignore the people concerned.
— Traduction française : Ignorer les personnes concernées.$english_unit3$, $english_unit3$Invent unsupported statistics.
— Traduction française : Inventer des statistiques non étayées.$english_unit3$),jsonb_build_array($english_unit3$Listen to local voices and propose fair, feasible protection.
— Traduction française : Écouter les voix locales et proposer une protection équitable et réalisable.$english_unit3$),$english_unit3$**A responsible article respects dignity, evidence and the participation of the people concerned.**

> **Traduction française :** Un article responsable respecte la dignité, les preuves et la participation des personnes concernées.$english_unit3$,50);

insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active)
    values (target.subject_id,target.level_id,target.series_id,target.offering_id,chapter_uuid,lesson_uuid,$english_unit3$Bilingual quiz 1 — Reading: Development Issues

> **Traduction française :** Quiz bilingue 1 — Lecture : problèmes de développement$english_unit3$,$english_unit3$**Check prediction, general idea, contextual vocabulary and evidence in Unit 3 Reading.**

> **Traduction française :** Vérifie l’anticipation, l’idée générale, le vocabulaire contextuel et la preuve dans la lecture de l’Unit 3.$english_unit3$,'medium',15,10,false,false)
    returning id into quiz_reading_uuid;
    with inserted_questions as (
      insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
      (quiz_reading_uuid,$english_unit3$**What should a prediction from a map be before reading?**

> **Traduction française :** Que doit être une anticipation à partir d’une carte avant de lire ?$english_unit3$,$english_unit3$**It should be a question or hypothesis to confirm, not an invented conclusion.**

> **Traduction française :** Elle doit être une question ou une hypothèse à confirmer, et non une conclusion inventée.$english_unit3$,'single_choice',10,1,true),
      (quiz_reading_uuid,$english_unit3$**What does a general idea avoid?**

> **Traduction française :** Qu’est-ce qu’une idée générale évite ?$english_unit3$,$english_unit3$**It avoids becoming a list of every detail.**

> **Traduction française :** Elle évite de devenir une liste de tous les détails.$english_unit3$,'single_choice',20,1,true),
      (quiz_reading_uuid,$english_unit3$**Which clue helps you find vocabulary in context?**

> **Traduction française :** Quel indice t’aide à trouver le vocabulaire en contexte ?$english_unit3$,$english_unit3$**The paragraph number, grammar and surrounding words are useful clues.**

> **Traduction française :** Le numéro du paragraphe, la grammaire et les mots environnants sont des indices utiles.$english_unit3$,'single_choice',30,1,true),
      (quiz_reading_uuid,$english_unit3$**Why can a true-or-false statement be false even if it sounds similar to the text?**

> **Traduction française :** Pourquoi une affirmation vrai/faux peut-elle être fausse même si elle ressemble au texte ?$english_unit3$,$english_unit3$**One changed key fact, such as a country, number, age or cause, can make it false.**

> **Traduction française :** Un seul fait clé modifié, comme un pays, un nombre, un âge ou une cause, peut la rendre fausse.$english_unit3$,'single_choice',40,1,true)
      returning id,display_order
    )
    insert into public.quiz_answers (question_id,answer,is_correct,display_order)
    select inserted_questions.id,answers.answer,answers.is_correct,answers.display_order
    from inserted_questions
    join (values
        (10,$english_unit3$A hypothesis to confirm
— Traduction française : Une hypothèse à confirmer$english_unit3$,true,10),
        (10,$english_unit3$A certain fact without reading
— Traduction française : Un fait certain sans lire$english_unit3$,false,20),
        (10,$english_unit3$A personal insult
— Traduction française : Une insulte personnelle$english_unit3$,false,30),
        (20,$english_unit3$A list of every detail
— Traduction française : Une liste de tous les détails$english_unit3$,true,10),
        (20,$english_unit3$The central issue
— Traduction française : Le problème central$english_unit3$,false,20),
        (20,$english_unit3$A neutral summary
— Traduction française : Un résumé neutre$english_unit3$,false,30),
        (30,$english_unit3$Paragraph number and context
— Traduction française : Numéro du paragraphe et contexte$english_unit3$,true,10),
        (30,$english_unit3$Only the font colour
— Traduction française : Seulement la couleur de police$english_unit3$,false,20),
        (30,$english_unit3$No reading at all
— Traduction française : Aucune lecture$english_unit3$,false,30),
        (40,$english_unit3$A key fact may have changed
— Traduction française : Un fait clé peut avoir été modifié$english_unit3$,true,10),
        (40,$english_unit3$All similar sentences are automatically true
— Traduction française : Toutes les phrases semblables sont automatiquement vraies$english_unit3$,false,20),
        (40,$english_unit3$Evidence is unnecessary
— Traduction française : La preuve est inutile$english_unit3$,false,30)
    ) as answers(question_order,answer,is_correct,display_order)
      on answers.question_order=inserted_questions.display_order;

insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active)
    values (target.subject_id,target.level_id,target.series_id,target.offering_id,chapter_uuid,lesson_uuid,$english_unit3$Bilingual quiz 2 — Writing: a responsible article

> **Traduction française :** Quiz bilingue 2 — Écriture : un article responsable$english_unit3$,$english_unit3$**Check article structure, logical paragraphs, connectors and evidence-aware writing.**

> **Traduction française :** Vérifie la structure de l’article, les paragraphes logiques, les connecteurs et une écriture attentive aux preuves.$english_unit3$,'medium',15,20,false,false)
    returning id into quiz_writing_uuid;
    with inserted_questions as (
      insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
      (quiz_writing_uuid,$english_unit3$**What is an article’s main purpose in this task?**

> **Traduction française :** Quel est le but principal d’un article dans cette tâche ?$english_unit3$,$english_unit3$**It informs readers about an issue and proposes responsible solutions.**

> **Traduction française :** Il informe les lecteurs sur un problème et propose des solutions responsables.$english_unit3$,'single_choice',10,1,true),
      (quiz_writing_uuid,$english_unit3$**What should each main paragraph usually develop?**

> **Traduction française :** Que doit généralement développer chaque paragraphe principal ?$english_unit3$,$english_unit3$**Each main paragraph should develop one central idea.**

> **Traduction française :** Chaque paragraphe principal doit développer une idée centrale.$english_unit3$,'single_choice',20,1,true),
      (quiz_writing_uuid,$english_unit3$**Which connector can show a consequence?**

> **Traduction française :** Quel connecteur peut montrer une conséquence ?$english_unit3$,$english_unit3$**“As a result” can introduce a consequence.**

> **Traduction française :** « As a result » peut introduire une conséquence.$english_unit3$,'single_choice',30,1,true),
      (quiz_writing_uuid,$english_unit3$**What should you do with a statistic or legal detail that is not verified?**

> **Traduction française :** Que dois-tu faire avec une statistique ou un détail juridique non vérifié ?$english_unit3$,$english_unit3$**Do not present it as fact; verify it first or use cautious wording.**

> **Traduction française :** Ne le présente pas comme un fait ; vérifie-le d’abord ou utilise une formulation prudente.$english_unit3$,'single_choice',40,1,true)
      returning id,display_order
    )
    insert into public.quiz_answers (question_id,answer,is_correct,display_order)
    select inserted_questions.id,answers.answer,answers.is_correct,answers.display_order
    from inserted_questions
    join (values
        (10,$english_unit3$Inform and propose solutions
— Traduction française : Informer et proposer des solutions$english_unit3$,true,10),
        (10,$english_unit3$Write private news to one friend
— Traduction française : Écrire des nouvelles privées à un ami$english_unit3$,false,20),
        (10,$english_unit3$Avoid any organisation
— Traduction française : Éviter toute organisation$english_unit3$,false,30),
        (20,$english_unit3$One central idea
— Traduction française : Une idée centrale$english_unit3$,true,10),
        (20,$english_unit3$Every possible idea at once
— Traduction française : Toutes les idées possibles à la fois$english_unit3$,false,20),
        (20,$english_unit3$No complete sentence
— Traduction française : Aucune phrase complète$english_unit3$,false,30),
        (30,$english_unit3$As a result
— Traduction française : Par conséquent$english_unit3$,true,10),
        (30,$english_unit3$Dear friend
— Traduction française : Cher ami$english_unit3$,false,20),
        (30,$english_unit3$Best wishes
— Traduction française : Meilleurs vœux$english_unit3$,false,30),
        (40,$english_unit3$Verify it or use cautious wording
— Traduction française : Le vérifier ou employer une formulation prudente$english_unit3$,true,10),
        (40,$english_unit3$Invent a source
— Traduction française : Inventer une source$english_unit3$,false,20),
        (40,$english_unit3$State it with certainty
— Traduction française : L’affirmer avec certitude$english_unit3$,false,30)
    ) as answers(question_order,answer,is_correct,display_order)
      on answers.question_order=inserted_questions.display_order;
  end loop;
end
$english_terminal_unit3_content$;
