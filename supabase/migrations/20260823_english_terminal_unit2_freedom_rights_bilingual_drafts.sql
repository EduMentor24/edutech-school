-- Lot Anglais Terminale Unit 2 Freedom and Rights : Listening, Reading et Writing bilingues.
-- Tout passage anglais est immédiatement suivi de sa traduction française ; nouveaux modules brouillon/inactifs/non publiés.
do $english_terminal_unit2$
declare
  target record;
  chapter_uuid uuid;
  lesson_uuid uuid;
  exercise_listening_uuid uuid;
  exercise_reading_uuid uuid;
  exercise_writing_uuid uuid;
  quiz_listening_uuid uuid;
  quiz_reading_uuid uuid;
  quiz_writing_uuid uuid;
  current_content text;
  current_exercises integer;
  current_quizzes integer;
  target_count integer;
  lesson_order integer;
  unit_title constant text := 'UNIT 2 FREEDOM AND CIVIL RIGHTS';
begin
  select count(*) into target_count from public.course_subject_offerings where id in ($english_unit2$81c5b295-b5d4-4a7c-a922-0604236a4aa8$english_unit2$, $english_unit2$0bc8f25a-432a-441b-8a86-303b452aaf9f$english_unit2$, $english_unit2$ff97ed10-ea0d-4e7e-9dd1-8010229c03b6$english_unit2$, $english_unit2$94543938-fd4c-4ba8-8205-35f765264719$english_unit2$);
  if target_count <> 4 then
    raise exception 'Les quatre offres Anglais Terminale A1/A2/C/D attendues sont requises ; transaction annulée.';
  end if;
  if exists (
    select 1 from public.lessons le join public.chapters ch on ch.id=le.chapter_id
    where ch.subject_offering_id in ($english_unit2$81c5b295-b5d4-4a7c-a922-0604236a4aa8$english_unit2$, $english_unit2$0bc8f25a-432a-441b-8a86-303b452aaf9f$english_unit2$, $english_unit2$ff97ed10-ea0d-4e7e-9dd1-8010229c03b6$english_unit2$, $english_unit2$94543938-fd4c-4ba8-8205-35f765264719$english_unit2$) and le.title=unit_title
      and (coalesce(char_length(le.content),0)>0 or exists (select 1 from public.exercises e where e.lesson_id=le.id) or exists (select 1 from public.quizzes q where q.lesson_id=le.id))
  ) then
    raise exception 'Une unité Freedom and Civil Rights cible contient déjà du contenu, un exercice ou un quiz ; ré-audit requis avant toute écriture.';
  end if;
  for target in
    select o.id as offering_id,o.subject_id,o.level_id,o.series_id,se.name as series_name
    from public.course_subject_offerings o join public.series se on se.id=o.series_id
    where o.id in ($english_unit2$81c5b295-b5d4-4a7c-a922-0604236a4aa8$english_unit2$, $english_unit2$0bc8f25a-432a-441b-8a86-303b452aaf9f$english_unit2$, $english_unit2$ff97ed10-ea0d-4e7e-9dd1-8010229c03b6$english_unit2$, $english_unit2$94543938-fd4c-4ba8-8205-35f765264719$english_unit2$) order by se.name
  loop
    select id into chapter_uuid from public.chapters where subject_offering_id=target.offering_id and title='PROGRESSION TERMINALE A' limit 1;
    if chapter_uuid is null and target.series_name in ('C','D') then
      select id into chapter_uuid from public.chapters where subject_offering_id=target.offering_id and title='PROGRESSIONS TERMINALES C ET D — Anglais' limit 1;
    end if;
    if chapter_uuid is null then
      raise exception 'Le chapitre Anglais Terminale attendu est absent pour la série %.', target.series_name;
    end if;
    lesson_uuid := null;
    select id,content into lesson_uuid,current_content from public.lessons where chapter_id=chapter_uuid and title=unit_title limit 1;
    if lesson_uuid is null then
      select coalesce(max(display_order),0)+10 into lesson_order from public.lessons where chapter_id=chapter_uuid;
      insert into public.lessons (chapter_id,title,description,content,display_order,is_active)
      values (chapter_uuid,unit_title,'Unit 2 Freedom and Civil Rights : compréhension orale, lecture responsable des droits humains et méthode très guidée de lettre informelle bilingue.',$english_unit2$## Unit 2 — Freedom and Civil Rights

> **Traduction française :** Unité 2 — Liberté et droits civiques.

> **Bilingual learning goal:** listen, read and write about human rights, disability inclusion, freedom struggles and the rights of children with accuracy, respect and responsibility.

> **Objectif bilingue :** écouter, lire et écrire au sujet des droits humains, de l’inclusion des personnes handicapées, des luttes pour la liberté et des droits de l’enfant avec précision, respect et responsabilité.

> **Important source note:** the supplied sheets describe activities and prompts; they do not reproduce the listening recording, the reading text or Akim’s full letter. This lesson therefore teaches the visible information and transferable methods without inventing quotations or answers that are absent from the source.

> **Traduction française :** **Note importante sur la source :** les fiches fournies décrivent des activités et des consignes ; elles ne reproduisent ni l’enregistrement d’écoute, ni le texte de lecture, ni la lettre complète d’Akim. Cette leçon enseigne donc les informations visibles et des méthodes transférables sans inventer des citations ou des réponses absentes de la source.

---

## Part A — Listening for comprehension: Human Rights and disability inclusion

> **Traduction française :** Partie A — Compréhension orale : droits humains et inclusion des personnes handicapées.

### 1. Learning situation

**During a meeting, the members of the English Club of Lycée Moderne Tanda listen to a news report about Human Rights in order to collect information about this issue.**

> **Traduction française :** **Lors d’une réunion, les membres de l’English Club du Lycée Moderne Tanda écoutent un reportage sur les droits humains afin de recueillir des informations sur cette question.**

Listening in this unit is not about guessing every missing word. It is about understanding who is speaking, what difficulty is described, how the person copes with it and which right or support is involved.

> **Traduction française :** L’écoute dans cette unité ne consiste pas à deviner chaque mot manquant. Il s’agit de comprendre qui parle, quelle difficulté est décrite, comment la personne y fait face et quel droit ou quel soutien est en jeu.

### 2. Before listening: think with respect

The source presents four people: **Moussa, who has been blind since birth; Aicha, who uses a wheelchair after an accident; Fatima, who is deaf; and Emmanuel, a young child with an intellectual disability.**

> **Traduction française :** La source présente quatre personnes : **Moussa, aveugle depuis sa naissance ; Aicha, qui utilise un fauteuil roulant après un accident ; Fatima, sourde ; et Emmanuel, jeune enfant ayant une déficience intellectuelle.**

Use respectful language. A person is never reduced to one difficulty. In English, you can say **a person with a disability**, **a blind person**, **a deaf person** or **a wheelchair user**, depending on the context and the person’s preference.

> **Traduction française :** Utilise un langage respectueux. Une personne ne se réduit jamais à une seule difficulté. En anglais, tu peux dire **a person with a disability** (une personne handicapée), **a blind person** (une personne aveugle), **a deaf person** (une personne sourde) ou **a wheelchair user** (une personne utilisatrice de fauteuil roulant), selon le contexte et la préférence de la personne.

| Listening question | What to listen for |
|---|---|
| **How are disabilities treated?**<br><br>**Traduction française :** Comment les handicaps sont-ils traités ? | Listen for attitudes, discrimination, support or access.<br><br>**Traduction française :** Écoute les attitudes, la discrimination, le soutien ou l’accessibilité. |
| **How do people cope with disabilities?**<br><br>**Traduction française :** Comment les personnes font-elles face au handicap ? | Listen for strategies, work, family help, care, education or independence.<br><br>**Traduction française :** Écoute les stratégies, le travail, l’aide familiale, les soins, l’éducation ou l’autonomie. |
| **How do people suffer from disabilities?**<br><br>**Traduction française :** Comment les personnes souffrent-elles du handicap ? | Listen for practical, social, financial or emotional difficulties.<br><br>**Traduction française :** Écoute les difficultés pratiques, sociales, financières ou émotionnelles. |

### 3. A four-step listening method

1. **Before listening, read the names and situations. Predict only broad themes; do not invent a complete story.**

   > **Traduction française :** Avant d’écouter, lis les noms et les situations. Anticipe seulement des thèmes généraux ; n’invente pas une histoire complète.

2. **On the first listening, identify each speaker and the main topic: care, work, mobility, emotions or social life.**

   > **Traduction française :** Lors de la première écoute, identifie chaque locuteur et le thème principal : soins, travail, mobilité, émotions ou vie sociale.

3. **On the second listening, note key words around the blank or statement. The words before and after a blank often show whether you need a verb, adjective, noun or adverb.**

   > **Traduction française :** Lors de la deuxième écoute, note les mots autour du blanc ou de l’affirmation. Les mots avant et après un blanc indiquent souvent s’il faut un verbe, un adjectif, un nom ou un adverbe.

4. **After listening, check meaning, not spelling only. An answer must fit both grammar and the speaker’s situation.**

   > **Traduction française :** Après l’écoute, vérifie le sens et pas seulement l’orthographe. Une réponse doit convenir à la fois à la grammaire et à la situation du locuteur.

### 4. Useful language from the source prompts

| English prompt | Meaning and use |
|---|---|
| **I have to give up my job.** | To give up a job means to stop doing it, often because continuing is impossible or very difficult.<br><br>**Traduction française :** *To give up a job* signifie abandonner son emploi, souvent parce qu’il devient impossible ou très difficile de le poursuivre. |
| **He needs … care.** | The missing word must describe the kind or amount of care; listen for an adjective that makes sense with *care*.<br><br>**Traduction française :** Le mot manquant doit décrire le type ou le niveau de soins ; écoute un adjectif qui convient avec *care*. |
| **Emmanuel … all my time and energy.** | The missing verb expresses the strong demands of care on a parent or carer.<br><br>**Traduction française :** Le verbe manquant exprime l’importance du temps et de l’énergie demandés à un parent ou accompagnant. |
| **I am financially …** | *Financially* introduces information about money and economic dependence or independence.<br><br>**Traduction française :** *Financially* introduit une information sur l’argent et la dépendance ou l’autonomie économique. |
| **Travelling alone is a major challenge.** | A challenge is a serious difficulty that requires effort, preparation or support.<br><br>**Traduction française :** Un *challenge* est une difficulté importante qui exige des efforts, une préparation ou un soutien. |
| **I suffered from conflicting emotions.** | Conflicting emotions are different feelings that pull a person in opposite directions, for example sadness and hope.<br><br>**Traduction française :** Des *conflicting emotions* sont des sentiments différents qui tirent une personne dans des directions opposées, par exemple la tristesse et l’espoir. |

### 5. Communicating about Human Rights

**Everyone should have fair access to education, health care, work, justice and participation in community life.**

> **Traduction française :** **Toute personne devrait avoir un accès équitable à l’éducation, aux soins de santé, au travail, à la justice et à la participation à la vie communautaire.**

The source asks for a recording to a Liberian penfriend about Human Rights in West Africa. It proposes three angles: **gender discrimination in education, job opportunities for disabled people and lack of justice for poor people.**

> **Traduction française :** La source demande un enregistrement destiné à un correspondant libérien au sujet des droits humains en Afrique de l’Ouest. Elle propose trois angles : **la discrimination de genre dans l’éducation, les possibilités d’emploi pour les personnes handicapées et l’absence de justice pour les personnes pauvres.**

**A responsible short presentation names one issue, gives a careful local observation without exaggeration, explains why equality matters and suggests a constructive action.**

> **Traduction française :** **Une courte présentation responsable nomme un problème, donne une observation locale prudente sans exagération, explique pourquoi l’égalité est importante et propose une action constructive.**

---

## Part B — Reading for comprehension: freedom struggles and children’s rights

> **Traduction française :** Partie B — Compréhension écrite : luttes pour la liberté et droits de l’enfant.

### 1. Learning situation

**Students of Terminale C at Lycée Moderne Bangolo participate in a debate organised by an American NGO defending human rights in Côte d’Ivoire. They share what they know and think about freedom fights and civil rights.**

> **Traduction française :** **Des élèves de Terminale C du Lycée Moderne Bangolo participent à un débat organisé par une ONG américaine de défense des droits humains en Côte d’Ivoire. Ils partagent ce qu’ils savent et pensent des luttes pour la liberté et des droits civiques.**

The reading worksheet links the topic to a life story involving slavery, education and the end of legal slavery after a Civil War. Read such topics with care: the aim is to understand history and human rights, never to trivialise suffering.

> **Traduction française :** La fiche de lecture relie le thème à un récit de vie lié à l’esclavage, à l’éducation et à la fin légale de l’esclavage après une guerre civile. Lis ces sujets avec attention : l’objectif est de comprendre l’histoire et les droits humains, jamais de banaliser la souffrance.

### 2. Find the general idea before details

**The general idea is the central message of a text, not a list of every event. Ask: who is the narrator, what major experience is described and which human right is at stake?**

> **Traduction française :** **L’idée générale est le message central d’un texte, et non la liste de tous les événements. Demande-toi : qui est le narrateur, quelle expérience majeure est décrite et quel droit humain est en jeu ?**

For the supplied activity, a safe general-idea response can name the topic without inventing unseen details: **the text concerns a person’s life in relation to slavery, freedom and access to education.**

> **Traduction française :** Pour l’activité fournie, une réponse sûre sur l’idée générale peut nommer le thème sans inventer de détails non visibles : **le texte concerne la vie d’une personne en lien avec l’esclavage, la liberté et l’accès à l’éducation.**

### 3. Strategy: find words through context

The worksheet gives one explicit example: **remember → recall**.

> **Traduction française :** La fiche donne un exemple explicite : **remember → recall**.

To find another word in a text, do not search only for a dictionary translation. Read the whole sentence, identify the word class, then compare the meaning in context.

> **Traduction française :** Pour trouver un autre mot dans un texte, ne cherche pas seulement une traduction de dictionnaire. Lis toute la phrase, identifie la nature du mot, puis compare le sens dans le contexte.

| Prompt from the worksheet | Reading strategy |
|---|---|
| **the last**<br><br>**Traduction française :** le dernier / la dernière | Look for an adjective meaning final or most recent; check whether it modifies a person, thing or event.<br><br>**Traduction française :** Cherche un adjectif qui signifie final ou le plus récent ; vérifie s’il qualifie une personne, une chose ou un événement. |
| **transported**<br><br>**Traduction française :** transporté | Look for a verb showing movement from one place to another; keep the historical context in mind.<br><br>**Traduction française :** Cherche un verbe montrant le déplacement d’un lieu à un autre ; garde le contexte historique à l’esprit. |
| **buyer**<br><br>**Traduction française :** acheteur | Look for a noun naming a person who purchases something; do not confuse it with the action of buying.<br><br>**Traduction française :** Cherche un nom désignant une personne qui achète ; ne le confonds pas avec l’action d’acheter. |
| **education**<br><br>**Traduction française :** éducation | Look for a word linked to schooling, learning or instruction.<br><br>**Traduction française :** Cherche un mot lié à la scolarisation, à l’apprentissage ou à l’instruction. |
| **woken up**<br><br>**Traduction française :** réveillé | Look for a past expression that means becoming awake.<br><br>**Traduction française :** Cherche une expression au passé qui signifie devenir éveillé. |

### 4. True or false with evidence

The worksheet asks learners to decide whether statements are true or false and justify them with line references. The only filled example says: **“The narrator doesn’t know when he was born.” — True, line 2.**

> **Traduction française :** La fiche demande aux élèves de décider si des affirmations sont vraies ou fausses et de les justifier par des références de lignes. Le seul exemple rempli indique : **« Le narrateur ne sait pas quand il est né. » — Vrai, ligne 2.**

For every other statement, use this proof method because the full source text is not reproduced in the worksheet:

1. **Underline the key words in the statement.**

   > **Traduction française :** Souligne les mots clés de l’affirmation.

2. **Find the relevant paragraph and read the complete sentence around the clue.**

   > **Traduction française :** Trouve le paragraphe pertinent et lis la phrase complète autour de l’indice.

3. **Write T or F only after checking the evidence; then quote or identify the precise line.**

   > **Traduction française :** Écris V ou F seulement après avoir vérifié la preuve ; cite ensuite ou indique la ligne précise.

4. **If the statement changes one key fact, it is false even when the topic is similar.**

   > **Traduction française :** Si l’affirmation modifie un fait essentiel, elle est fausse même si le thème est proche.

### 5. Children’s rights and child labour: report responsibly

The communication task describes young children working in cocoa plantations instead of attending school. It asks a letter to Human Rights Watch that gives age groups, tasks and a request for action.

> **Traduction française :** La tâche de communication décrit de jeunes enfants travaillant dans des plantations de cacao au lieu d’aller à l’école. Elle demande une lettre à Human Rights Watch qui indique les tranches d’âge, les tâches et une demande d’action.

**Every child has the right to protection, education and development. A report should describe observed facts carefully, protect children’s dignity and request lawful safeguarding action.**

> **Traduction française :** **Chaque enfant a droit à la protection, à l’éducation et au développement. Un signalement doit décrire les faits observés avec prudence, protéger la dignité des enfants et demander une action légale de protection.**

**I am writing to report that young children are working in cocoa plantations instead of attending school. I respectfully request that the situation be investigated and that protective action be taken.**

> **Traduction française :** **Je vous écris pour signaler que de jeunes enfants travaillent dans des plantations de cacao au lieu d’aller à l’école. Je demande respectueusement que la situation soit examinée et que des mesures de protection soient prises.**

---

## Part C — Writing: an informal letter

> **Traduction française :** Partie C — Expression écrite : une lettre informelle.

> **Writing goal:** write a warm, clear and well-organised reply to a friend while using informal language appropriately.

> **Objectif d’écriture :** rédiger une réponse chaleureuse, claire et bien organisée à un ami en employant une langue informelle appropriée.

### 1. Understand the writing situation

**A former classmate has moved to the USA with his parents. He has American citizenship but, after an accident, he cannot walk. The friends keep in touch by writing letters in English.**

> **Traduction française :** **Un ancien camarade de classe est parti vivre aux États-Unis avec ses parents. Il a la nationalité américaine mais, après un accident, il ne peut pas marcher. Les amis gardent le contact en s’écrivant des lettres en anglais.**

The source asks you to imagine that you are Ousmane and reply to Akim. Be caring and natural, but do not invent personal facts from Akim’s letter that the worksheet does not show. Give your own plausible news in the role-play and focus on the required organisation.

> **Traduction française :** La source te demande d’imaginer que tu es Ousmane et de répondre à Akim. Sois attentionné(e) et naturel(le), mais n’invente pas de faits personnels venant de la lettre d’Akim que la fiche ne montre pas. Donne tes propres nouvelles plausibles dans le jeu de rôle et concentre-toi sur l’organisation demandée.

### 2. Informal versus formal writing

| Informal letter to a friend | Formal letter to an organisation |
|---|---|
| **Dear Akim, / Hi Akim,**<br><br>**Traduction française :** Cher Akim, / Salut Akim, | **Dear Sir or Madam,**<br><br>**Traduction française :** Madame, Monsieur, |
| Warm, personal and natural language; contractions such as **I’m**, **I’ve**, **can’t** are usually acceptable.<br><br>**Traduction française :** Langage chaleureux, personnel et naturel ; les contractions comme **I’m**, **I’ve**, **can’t** sont généralement acceptables. | Neutral, respectful and more distant language; avoid slang and very personal comments.<br><br>**Traduction française :** Langage neutre, respectueux et plus distant ; évite l’argot et les remarques trop personnelles. |
| **Take care, Best wishes, See you soon,** followed by your name.<br><br>**Traduction française :** **Prends soin de toi, Meilleurs vœux, À bientôt,** suivis de ton nom. | **Yours faithfully / Yours sincerely,** followed by your name.<br><br>**Traduction française :** **Veuillez agréer, Madame, Monsieur…** / **Cordialement,** suivis de ton nom. |

> **Key distinction:** informal does not mean careless. You still need clear paragraphs, correct spelling, grammar and punctuation.

> **Traduction française :** **Distinction essentielle :** informel ne signifie pas négligé. Tu dois toujours avoir des paragraphes clairs, une orthographe, une grammaire et une ponctuation correctes.

### 3. The five-paragraph plan from the PDF

| Paragraph | Job in English | French translation and practical question |
|---|---|---|
| **1** | **Ask about your friend.** Start with a greeting, say you were happy to receive the letter, and ask one or two kind questions.<br><br>**Example:** *How are you doing these days? I hope you are feeling stronger.* | **Prends des nouvelles de ton ami.** Commence par une salutation, dis que tu as été heureux/heureuse de recevoir la lettre et pose une ou deux questions attentionnées.<br><br>**Exemple :** *Comment vas-tu ces jours-ci ? J’espère que tu te sens plus fort.* |
| **2** | **Give news about your family and friends.** Mention only relevant, positive or important news.<br><br>**Example:** *My family sends you their best wishes, and our friends often ask about you.* | **Donne des nouvelles de ta famille et de tes amis.** Mentionne seulement des nouvelles utiles, positives ou importantes.<br><br>**Exemple :** *Ma famille t’envoie ses meilleures pensées et nos amis demandent souvent de tes nouvelles.* |
| **3** | **Give news about yourself.** Explain school, a hobby, a project or a recent event in a simple way.<br><br>**Example:** *As for me, I am preparing for my exams and I am also practising football after school.* | **Donne de tes nouvelles.** Explique l’école, un loisir, un projet ou un événement récent de manière simple.<br><br>**Exemple :** *Quant à moi, je prépare mes examens et je m’entraîne aussi au football après l’école.* |
| **4** | **Say how you feel.** Show empathy without pity and use honest, supportive words.<br><br>**Example:** *I was sorry to hear about your accident, but I admire your courage and determination.* | **Dis ce que tu ressens.** Montre de l’empathie sans pitié et emploie des mots honnêtes et encourageants.<br><br>**Exemple :** *J’ai été triste d’apprendre ton accident, mais j’admire ton courage et ta détermination.* |
| **5** | **Give more positive news about yourself and close warmly.** End with hope, an invitation to reply and a friendly closing.<br><br>**Example:** *Write back soon and tell me about your plans. Take care, Ousmane.* | **Donne d’autres nouvelles positives et termine chaleureusement.** Termine par un espoir, une invitation à répondre et une formule amicale.<br><br>**Exemple :** *Écris-moi bientôt et parle-moi de tes projets. Prends soin de toi, Ousmane.* |

### 4. Build your informal letter step by step

**Step 1 — Decode the task. Circle the writer, receiver, purpose, word limit and required paragraph plan.**

> **Traduction française :** **Étape 1 — Décode la consigne.** Entoure l’auteur, le destinataire, l’objectif, le nombre de mots et le plan obligatoire des paragraphes.

**Step 2 — Make a five-box plan. Write one or two ideas in each box before writing full sentences.**

> **Traduction française :** **Étape 2 — Fais un plan en cinq cases.** Écris une ou deux idées dans chaque case avant de rédiger des phrases complètes.

**Step 3 — Choose a friendly opening and closing. They must fit a friend, not a manager, embassy or organisation.**

> **Traduction française :** **Étape 3 — Choisis une formule d’ouverture et de clôture amicale.** Elles doivent convenir à un ami et non à un responsable, une ambassade ou une organisation.

**Step 4 — Join ideas with simple connectors: *first*, *also*, *as for me*, *however*, *because*, *so*, *finally*.**

> **Traduction française :** **Étape 4 — Relie les idées avec des connecteurs simples :** *first* (d’abord), *also* (aussi), *as for me* (quant à moi), *however* (cependant), *because* (parce que), *so* (donc), *finally* (enfin).

**Step 5 — Check the language line by line. A long letter is not better if it repeats ideas or contains avoidable mistakes.**

> **Traduction française :** **Étape 5 — Vérifie la langue ligne par ligne.** Une longue lettre n’est pas meilleure si elle répète des idées ou contient des erreurs évitables.

### 5. Friendly language bank

| Purpose | English language you can adapt | French translation |
|---|---|---|
| Greeting | **Dear Akim, / Hi Akim, How are you?** | **Cher Akim, / Salut Akim, Comment vas-tu ?** |
| Reacting | **I was really happy to receive your letter.** | **J’ai été vraiment heureux/heureuse de recevoir ta lettre.** |
| Showing care | **I was sorry to hear about the accident. I hope you are receiving the support you need.** | **J’ai été triste d’apprendre l’accident. J’espère que tu reçois le soutien dont tu as besoin.** |
| Family news | **Everyone at home sends you their best wishes.** | **Tout le monde à la maison t’envoie ses meilleures pensées.** |
| Personal news | **As for me, school is busy, but I am doing my best.** | **Quant à moi, l’école est chargée, mais je fais de mon mieux.** |
| Encouragement | **Keep believing in yourself; I know you can achieve your goals.** | **Continue à croire en toi ; je sais que tu peux atteindre tes objectifs.** |
| Closing | **Write back soon. Take care. Best wishes, Ousmane.** | **Écris-moi bientôt. Prends soin de toi. Meilleurs vœux, Ousmane.** |

### 6. Guided mini-model: structure, not a source quotation

> **This is an original practice model. It illustrates the five-paragraph plan; it is not presented as Akim’s unseen letter or as the only correct reply. Adapt the details to the task.**

> **Traduction française :** **Ce modèle est une production d’entraînement originale. Il illustre le plan en cinq paragraphes ; il n’est pas présenté comme la lettre non visible d’Akim ni comme l’unique réponse correcte. Adapte les détails à la consigne.**

**Dear Akim,**

> **Traduction française :** **Cher Akim,**

**How are you doing these days? I was very happy to receive your letter, and I hope you are feeling supported by the people around you.**

> **Traduction française :** **Comment vas-tu ces jours-ci ? J’ai été très heureux de recevoir ta lettre et j’espère que les personnes autour de toi te soutiennent.**

**My family is fine and sends you warm greetings. Some of our friends were glad to hear that we are still in touch.**

> **Traduction française :** **Ma famille va bien et t’envoie de chaleureuses salutations. Certains de nos amis ont été contents d’apprendre que nous gardons le contact.**

**As for me, I am working hard at school. I also joined a reading group because I want to improve my English.**

> **Traduction française :** **Quant à moi, je travaille beaucoup à l’école. J’ai aussi rejoint un groupe de lecture parce que je veux améliorer mon anglais.**

**I was sorry to learn that life has been difficult after your accident. Please remember that your friendship means a lot to me, and I admire your determination.**

> **Traduction française :** **J’ai été triste d’apprendre que la vie a été difficile après ton accident. Souviens-toi que ton amitié compte beaucoup pour moi et que j’admire ta détermination.**

**The good news is that I am preparing a small project with classmates. I hope it will go well. Write back soon and tell me about your plans. Take care.**

> **Traduction française :** **La bonne nouvelle est que je prépare un petit projet avec des camarades. J’espère que cela se passera bien. Écris-moi bientôt et parle-moi de tes projets. Prends soin de toi.**

**Best wishes,**

> **Traduction française :** **Meilleurs vœux,**

**Ousmane**

> **Traduction française :** **Ousmane**

### 7. The 250–300 word task: manage the length

The source asks for 250 to 300 words. Do not write one very long paragraph. Aim for about five paragraphs of 45 to 55 words, then check your word count.

> **Traduction française :** La source demande entre 250 et 300 mots. N’écris pas un seul très long paragraphe. Vise environ cinq paragraphes de 45 à 55 mots, puis vérifie le nombre de mots.

| Self-check before exchange with a partner | Why it matters |
|---|---|
| **Have I used the five-paragraph plan?**<br><br>**Traduction française :** Ai-je utilisé le plan en cinq paragraphes ? | It proves that you answered the exact task.<br><br>**Traduction française :** Cela prouve que tu as répondu à la consigne exacte. |
| **Is my language informal but respectful?**<br><br>**Traduction française :** Ma langue est-elle informelle mais respectueuse ? | A friend needs warmth, not a cold official tone or careless slang.<br><br>**Traduction française :** Un ami a besoin de chaleur, et non d’un ton officiel froid ou d’un argot négligé. |
| **Did I include personal news, feelings and encouragement?**<br><br>**Traduction française :** Ai-je inclus des nouvelles personnelles, des sentiments et des encouragements ? | These ideas make the letter complete and coherent.<br><br>**Traduction française :** Ces idées rendent la lettre complète et cohérente. |
| **Did I check spelling, grammar and punctuation?**<br><br>**Traduction française :** Ai-je vérifié l’orthographe, la grammaire et la ponctuation ? | The source explicitly requires this peer-review step.<br><br>**Traduction française :** La source exige explicitement cette étape de relecture entre pairs. |

### 8. Homework transfer: invite a friend to a birthday celebration

**Dear friend, I would love you to come to my birthday celebration at my home on Saturday afternoon. We will share music, food and games. Please let me know if you can come.**

> **Traduction française :** **Cher ami / Chère amie, j’aimerais beaucoup que tu viennes à ma fête d’anniversaire chez moi samedi après-midi. Nous partagerons de la musique, de la nourriture et des jeux. Dis-moi, s’il te plaît, si tu peux venir.**

This invitation task uses the same informal-letter structure: greeting, purpose, useful details, warm closing and signature.

> **Traduction française :** Cette tâche d’invitation utilise la même structure de lettre informelle : salutation, objet, détails utiles, clôture chaleureuse et signature.

> **Writing synthesis:** a successful informal letter is personal, organised and accurate. It uses friendly language, respects the requested plan and gives the reader a reason to reply.

> **Traduction française :** **Synthèse d’écriture :** une lettre informelle réussie est personnelle, organisée et correcte. Elle utilise une langue amicale, respecte le plan demandé et donne au lecteur une raison de répondre.

## Pedagogical reference

Reformulated and expanded from the supplied PDFs: **Unit 2 Freedom and Rights — Listening for Comprehension**, **Reading for Comprehension** and **Writing an Informal Letter**, Far Ahead Terminale, Côte d’Ivoire — École numérique.$english_unit2$,lesson_order,false) returning id into lesson_uuid;
    else
      select count(*) into current_exercises from public.exercises where lesson_id=lesson_uuid;
      select count(*) into current_quizzes from public.quizzes where lesson_id=lesson_uuid;
      if coalesce(char_length(current_content),0)>0 or current_exercises>0 or current_quizzes>0 then
        raise exception 'La leçon Unit 2 de la série % n’est pas vide ; écrasement interdit.', target.series_name;
      end if;
      update public.lessons set description='Unit 2 Freedom and Civil Rights : compréhension orale, lecture responsable des droits humains et méthode très guidée de lettre informelle bilingue.',content=$english_unit2$## Unit 2 — Freedom and Civil Rights

> **Traduction française :** Unité 2 — Liberté et droits civiques.

> **Bilingual learning goal:** listen, read and write about human rights, disability inclusion, freedom struggles and the rights of children with accuracy, respect and responsibility.

> **Objectif bilingue :** écouter, lire et écrire au sujet des droits humains, de l’inclusion des personnes handicapées, des luttes pour la liberté et des droits de l’enfant avec précision, respect et responsabilité.

> **Important source note:** the supplied sheets describe activities and prompts; they do not reproduce the listening recording, the reading text or Akim’s full letter. This lesson therefore teaches the visible information and transferable methods without inventing quotations or answers that are absent from the source.

> **Traduction française :** **Note importante sur la source :** les fiches fournies décrivent des activités et des consignes ; elles ne reproduisent ni l’enregistrement d’écoute, ni le texte de lecture, ni la lettre complète d’Akim. Cette leçon enseigne donc les informations visibles et des méthodes transférables sans inventer des citations ou des réponses absentes de la source.

---

## Part A — Listening for comprehension: Human Rights and disability inclusion

> **Traduction française :** Partie A — Compréhension orale : droits humains et inclusion des personnes handicapées.

### 1. Learning situation

**During a meeting, the members of the English Club of Lycée Moderne Tanda listen to a news report about Human Rights in order to collect information about this issue.**

> **Traduction française :** **Lors d’une réunion, les membres de l’English Club du Lycée Moderne Tanda écoutent un reportage sur les droits humains afin de recueillir des informations sur cette question.**

Listening in this unit is not about guessing every missing word. It is about understanding who is speaking, what difficulty is described, how the person copes with it and which right or support is involved.

> **Traduction française :** L’écoute dans cette unité ne consiste pas à deviner chaque mot manquant. Il s’agit de comprendre qui parle, quelle difficulté est décrite, comment la personne y fait face et quel droit ou quel soutien est en jeu.

### 2. Before listening: think with respect

The source presents four people: **Moussa, who has been blind since birth; Aicha, who uses a wheelchair after an accident; Fatima, who is deaf; and Emmanuel, a young child with an intellectual disability.**

> **Traduction française :** La source présente quatre personnes : **Moussa, aveugle depuis sa naissance ; Aicha, qui utilise un fauteuil roulant après un accident ; Fatima, sourde ; et Emmanuel, jeune enfant ayant une déficience intellectuelle.**

Use respectful language. A person is never reduced to one difficulty. In English, you can say **a person with a disability**, **a blind person**, **a deaf person** or **a wheelchair user**, depending on the context and the person’s preference.

> **Traduction française :** Utilise un langage respectueux. Une personne ne se réduit jamais à une seule difficulté. En anglais, tu peux dire **a person with a disability** (une personne handicapée), **a blind person** (une personne aveugle), **a deaf person** (une personne sourde) ou **a wheelchair user** (une personne utilisatrice de fauteuil roulant), selon le contexte et la préférence de la personne.

| Listening question | What to listen for |
|---|---|
| **How are disabilities treated?**<br><br>**Traduction française :** Comment les handicaps sont-ils traités ? | Listen for attitudes, discrimination, support or access.<br><br>**Traduction française :** Écoute les attitudes, la discrimination, le soutien ou l’accessibilité. |
| **How do people cope with disabilities?**<br><br>**Traduction française :** Comment les personnes font-elles face au handicap ? | Listen for strategies, work, family help, care, education or independence.<br><br>**Traduction française :** Écoute les stratégies, le travail, l’aide familiale, les soins, l’éducation ou l’autonomie. |
| **How do people suffer from disabilities?**<br><br>**Traduction française :** Comment les personnes souffrent-elles du handicap ? | Listen for practical, social, financial or emotional difficulties.<br><br>**Traduction française :** Écoute les difficultés pratiques, sociales, financières ou émotionnelles. |

### 3. A four-step listening method

1. **Before listening, read the names and situations. Predict only broad themes; do not invent a complete story.**

   > **Traduction française :** Avant d’écouter, lis les noms et les situations. Anticipe seulement des thèmes généraux ; n’invente pas une histoire complète.

2. **On the first listening, identify each speaker and the main topic: care, work, mobility, emotions or social life.**

   > **Traduction française :** Lors de la première écoute, identifie chaque locuteur et le thème principal : soins, travail, mobilité, émotions ou vie sociale.

3. **On the second listening, note key words around the blank or statement. The words before and after a blank often show whether you need a verb, adjective, noun or adverb.**

   > **Traduction française :** Lors de la deuxième écoute, note les mots autour du blanc ou de l’affirmation. Les mots avant et après un blanc indiquent souvent s’il faut un verbe, un adjectif, un nom ou un adverbe.

4. **After listening, check meaning, not spelling only. An answer must fit both grammar and the speaker’s situation.**

   > **Traduction française :** Après l’écoute, vérifie le sens et pas seulement l’orthographe. Une réponse doit convenir à la fois à la grammaire et à la situation du locuteur.

### 4. Useful language from the source prompts

| English prompt | Meaning and use |
|---|---|
| **I have to give up my job.** | To give up a job means to stop doing it, often because continuing is impossible or very difficult.<br><br>**Traduction française :** *To give up a job* signifie abandonner son emploi, souvent parce qu’il devient impossible ou très difficile de le poursuivre. |
| **He needs … care.** | The missing word must describe the kind or amount of care; listen for an adjective that makes sense with *care*.<br><br>**Traduction française :** Le mot manquant doit décrire le type ou le niveau de soins ; écoute un adjectif qui convient avec *care*. |
| **Emmanuel … all my time and energy.** | The missing verb expresses the strong demands of care on a parent or carer.<br><br>**Traduction française :** Le verbe manquant exprime l’importance du temps et de l’énergie demandés à un parent ou accompagnant. |
| **I am financially …** | *Financially* introduces information about money and economic dependence or independence.<br><br>**Traduction française :** *Financially* introduit une information sur l’argent et la dépendance ou l’autonomie économique. |
| **Travelling alone is a major challenge.** | A challenge is a serious difficulty that requires effort, preparation or support.<br><br>**Traduction française :** Un *challenge* est une difficulté importante qui exige des efforts, une préparation ou un soutien. |
| **I suffered from conflicting emotions.** | Conflicting emotions are different feelings that pull a person in opposite directions, for example sadness and hope.<br><br>**Traduction française :** Des *conflicting emotions* sont des sentiments différents qui tirent une personne dans des directions opposées, par exemple la tristesse et l’espoir. |

### 5. Communicating about Human Rights

**Everyone should have fair access to education, health care, work, justice and participation in community life.**

> **Traduction française :** **Toute personne devrait avoir un accès équitable à l’éducation, aux soins de santé, au travail, à la justice et à la participation à la vie communautaire.**

The source asks for a recording to a Liberian penfriend about Human Rights in West Africa. It proposes three angles: **gender discrimination in education, job opportunities for disabled people and lack of justice for poor people.**

> **Traduction française :** La source demande un enregistrement destiné à un correspondant libérien au sujet des droits humains en Afrique de l’Ouest. Elle propose trois angles : **la discrimination de genre dans l’éducation, les possibilités d’emploi pour les personnes handicapées et l’absence de justice pour les personnes pauvres.**

**A responsible short presentation names one issue, gives a careful local observation without exaggeration, explains why equality matters and suggests a constructive action.**

> **Traduction française :** **Une courte présentation responsable nomme un problème, donne une observation locale prudente sans exagération, explique pourquoi l’égalité est importante et propose une action constructive.**

---

## Part B — Reading for comprehension: freedom struggles and children’s rights

> **Traduction française :** Partie B — Compréhension écrite : luttes pour la liberté et droits de l’enfant.

### 1. Learning situation

**Students of Terminale C at Lycée Moderne Bangolo participate in a debate organised by an American NGO defending human rights in Côte d’Ivoire. They share what they know and think about freedom fights and civil rights.**

> **Traduction française :** **Des élèves de Terminale C du Lycée Moderne Bangolo participent à un débat organisé par une ONG américaine de défense des droits humains en Côte d’Ivoire. Ils partagent ce qu’ils savent et pensent des luttes pour la liberté et des droits civiques.**

The reading worksheet links the topic to a life story involving slavery, education and the end of legal slavery after a Civil War. Read such topics with care: the aim is to understand history and human rights, never to trivialise suffering.

> **Traduction française :** La fiche de lecture relie le thème à un récit de vie lié à l’esclavage, à l’éducation et à la fin légale de l’esclavage après une guerre civile. Lis ces sujets avec attention : l’objectif est de comprendre l’histoire et les droits humains, jamais de banaliser la souffrance.

### 2. Find the general idea before details

**The general idea is the central message of a text, not a list of every event. Ask: who is the narrator, what major experience is described and which human right is at stake?**

> **Traduction française :** **L’idée générale est le message central d’un texte, et non la liste de tous les événements. Demande-toi : qui est le narrateur, quelle expérience majeure est décrite et quel droit humain est en jeu ?**

For the supplied activity, a safe general-idea response can name the topic without inventing unseen details: **the text concerns a person’s life in relation to slavery, freedom and access to education.**

> **Traduction française :** Pour l’activité fournie, une réponse sûre sur l’idée générale peut nommer le thème sans inventer de détails non visibles : **le texte concerne la vie d’une personne en lien avec l’esclavage, la liberté et l’accès à l’éducation.**

### 3. Strategy: find words through context

The worksheet gives one explicit example: **remember → recall**.

> **Traduction française :** La fiche donne un exemple explicite : **remember → recall**.

To find another word in a text, do not search only for a dictionary translation. Read the whole sentence, identify the word class, then compare the meaning in context.

> **Traduction française :** Pour trouver un autre mot dans un texte, ne cherche pas seulement une traduction de dictionnaire. Lis toute la phrase, identifie la nature du mot, puis compare le sens dans le contexte.

| Prompt from the worksheet | Reading strategy |
|---|---|
| **the last**<br><br>**Traduction française :** le dernier / la dernière | Look for an adjective meaning final or most recent; check whether it modifies a person, thing or event.<br><br>**Traduction française :** Cherche un adjectif qui signifie final ou le plus récent ; vérifie s’il qualifie une personne, une chose ou un événement. |
| **transported**<br><br>**Traduction française :** transporté | Look for a verb showing movement from one place to another; keep the historical context in mind.<br><br>**Traduction française :** Cherche un verbe montrant le déplacement d’un lieu à un autre ; garde le contexte historique à l’esprit. |
| **buyer**<br><br>**Traduction française :** acheteur | Look for a noun naming a person who purchases something; do not confuse it with the action of buying.<br><br>**Traduction française :** Cherche un nom désignant une personne qui achète ; ne le confonds pas avec l’action d’acheter. |
| **education**<br><br>**Traduction française :** éducation | Look for a word linked to schooling, learning or instruction.<br><br>**Traduction française :** Cherche un mot lié à la scolarisation, à l’apprentissage ou à l’instruction. |
| **woken up**<br><br>**Traduction française :** réveillé | Look for a past expression that means becoming awake.<br><br>**Traduction française :** Cherche une expression au passé qui signifie devenir éveillé. |

### 4. True or false with evidence

The worksheet asks learners to decide whether statements are true or false and justify them with line references. The only filled example says: **“The narrator doesn’t know when he was born.” — True, line 2.**

> **Traduction française :** La fiche demande aux élèves de décider si des affirmations sont vraies ou fausses et de les justifier par des références de lignes. Le seul exemple rempli indique : **« Le narrateur ne sait pas quand il est né. » — Vrai, ligne 2.**

For every other statement, use this proof method because the full source text is not reproduced in the worksheet:

1. **Underline the key words in the statement.**

   > **Traduction française :** Souligne les mots clés de l’affirmation.

2. **Find the relevant paragraph and read the complete sentence around the clue.**

   > **Traduction française :** Trouve le paragraphe pertinent et lis la phrase complète autour de l’indice.

3. **Write T or F only after checking the evidence; then quote or identify the precise line.**

   > **Traduction française :** Écris V ou F seulement après avoir vérifié la preuve ; cite ensuite ou indique la ligne précise.

4. **If the statement changes one key fact, it is false even when the topic is similar.**

   > **Traduction française :** Si l’affirmation modifie un fait essentiel, elle est fausse même si le thème est proche.

### 5. Children’s rights and child labour: report responsibly

The communication task describes young children working in cocoa plantations instead of attending school. It asks a letter to Human Rights Watch that gives age groups, tasks and a request for action.

> **Traduction française :** La tâche de communication décrit de jeunes enfants travaillant dans des plantations de cacao au lieu d’aller à l’école. Elle demande une lettre à Human Rights Watch qui indique les tranches d’âge, les tâches et une demande d’action.

**Every child has the right to protection, education and development. A report should describe observed facts carefully, protect children’s dignity and request lawful safeguarding action.**

> **Traduction française :** **Chaque enfant a droit à la protection, à l’éducation et au développement. Un signalement doit décrire les faits observés avec prudence, protéger la dignité des enfants et demander une action légale de protection.**

**I am writing to report that young children are working in cocoa plantations instead of attending school. I respectfully request that the situation be investigated and that protective action be taken.**

> **Traduction française :** **Je vous écris pour signaler que de jeunes enfants travaillent dans des plantations de cacao au lieu d’aller à l’école. Je demande respectueusement que la situation soit examinée et que des mesures de protection soient prises.**

---

## Part C — Writing: an informal letter

> **Traduction française :** Partie C — Expression écrite : une lettre informelle.

> **Writing goal:** write a warm, clear and well-organised reply to a friend while using informal language appropriately.

> **Objectif d’écriture :** rédiger une réponse chaleureuse, claire et bien organisée à un ami en employant une langue informelle appropriée.

### 1. Understand the writing situation

**A former classmate has moved to the USA with his parents. He has American citizenship but, after an accident, he cannot walk. The friends keep in touch by writing letters in English.**

> **Traduction française :** **Un ancien camarade de classe est parti vivre aux États-Unis avec ses parents. Il a la nationalité américaine mais, après un accident, il ne peut pas marcher. Les amis gardent le contact en s’écrivant des lettres en anglais.**

The source asks you to imagine that you are Ousmane and reply to Akim. Be caring and natural, but do not invent personal facts from Akim’s letter that the worksheet does not show. Give your own plausible news in the role-play and focus on the required organisation.

> **Traduction française :** La source te demande d’imaginer que tu es Ousmane et de répondre à Akim. Sois attentionné(e) et naturel(le), mais n’invente pas de faits personnels venant de la lettre d’Akim que la fiche ne montre pas. Donne tes propres nouvelles plausibles dans le jeu de rôle et concentre-toi sur l’organisation demandée.

### 2. Informal versus formal writing

| Informal letter to a friend | Formal letter to an organisation |
|---|---|
| **Dear Akim, / Hi Akim,**<br><br>**Traduction française :** Cher Akim, / Salut Akim, | **Dear Sir or Madam,**<br><br>**Traduction française :** Madame, Monsieur, |
| Warm, personal and natural language; contractions such as **I’m**, **I’ve**, **can’t** are usually acceptable.<br><br>**Traduction française :** Langage chaleureux, personnel et naturel ; les contractions comme **I’m**, **I’ve**, **can’t** sont généralement acceptables. | Neutral, respectful and more distant language; avoid slang and very personal comments.<br><br>**Traduction française :** Langage neutre, respectueux et plus distant ; évite l’argot et les remarques trop personnelles. |
| **Take care, Best wishes, See you soon,** followed by your name.<br><br>**Traduction française :** **Prends soin de toi, Meilleurs vœux, À bientôt,** suivis de ton nom. | **Yours faithfully / Yours sincerely,** followed by your name.<br><br>**Traduction française :** **Veuillez agréer, Madame, Monsieur…** / **Cordialement,** suivis de ton nom. |

> **Key distinction:** informal does not mean careless. You still need clear paragraphs, correct spelling, grammar and punctuation.

> **Traduction française :** **Distinction essentielle :** informel ne signifie pas négligé. Tu dois toujours avoir des paragraphes clairs, une orthographe, une grammaire et une ponctuation correctes.

### 3. The five-paragraph plan from the PDF

| Paragraph | Job in English | French translation and practical question |
|---|---|---|
| **1** | **Ask about your friend.** Start with a greeting, say you were happy to receive the letter, and ask one or two kind questions.<br><br>**Example:** *How are you doing these days? I hope you are feeling stronger.* | **Prends des nouvelles de ton ami.** Commence par une salutation, dis que tu as été heureux/heureuse de recevoir la lettre et pose une ou deux questions attentionnées.<br><br>**Exemple :** *Comment vas-tu ces jours-ci ? J’espère que tu te sens plus fort.* |
| **2** | **Give news about your family and friends.** Mention only relevant, positive or important news.<br><br>**Example:** *My family sends you their best wishes, and our friends often ask about you.* | **Donne des nouvelles de ta famille et de tes amis.** Mentionne seulement des nouvelles utiles, positives ou importantes.<br><br>**Exemple :** *Ma famille t’envoie ses meilleures pensées et nos amis demandent souvent de tes nouvelles.* |
| **3** | **Give news about yourself.** Explain school, a hobby, a project or a recent event in a simple way.<br><br>**Example:** *As for me, I am preparing for my exams and I am also practising football after school.* | **Donne de tes nouvelles.** Explique l’école, un loisir, un projet ou un événement récent de manière simple.<br><br>**Exemple :** *Quant à moi, je prépare mes examens et je m’entraîne aussi au football après l’école.* |
| **4** | **Say how you feel.** Show empathy without pity and use honest, supportive words.<br><br>**Example:** *I was sorry to hear about your accident, but I admire your courage and determination.* | **Dis ce que tu ressens.** Montre de l’empathie sans pitié et emploie des mots honnêtes et encourageants.<br><br>**Exemple :** *J’ai été triste d’apprendre ton accident, mais j’admire ton courage et ta détermination.* |
| **5** | **Give more positive news about yourself and close warmly.** End with hope, an invitation to reply and a friendly closing.<br><br>**Example:** *Write back soon and tell me about your plans. Take care, Ousmane.* | **Donne d’autres nouvelles positives et termine chaleureusement.** Termine par un espoir, une invitation à répondre et une formule amicale.<br><br>**Exemple :** *Écris-moi bientôt et parle-moi de tes projets. Prends soin de toi, Ousmane.* |

### 4. Build your informal letter step by step

**Step 1 — Decode the task. Circle the writer, receiver, purpose, word limit and required paragraph plan.**

> **Traduction française :** **Étape 1 — Décode la consigne.** Entoure l’auteur, le destinataire, l’objectif, le nombre de mots et le plan obligatoire des paragraphes.

**Step 2 — Make a five-box plan. Write one or two ideas in each box before writing full sentences.**

> **Traduction française :** **Étape 2 — Fais un plan en cinq cases.** Écris une ou deux idées dans chaque case avant de rédiger des phrases complètes.

**Step 3 — Choose a friendly opening and closing. They must fit a friend, not a manager, embassy or organisation.**

> **Traduction française :** **Étape 3 — Choisis une formule d’ouverture et de clôture amicale.** Elles doivent convenir à un ami et non à un responsable, une ambassade ou une organisation.

**Step 4 — Join ideas with simple connectors: *first*, *also*, *as for me*, *however*, *because*, *so*, *finally*.**

> **Traduction française :** **Étape 4 — Relie les idées avec des connecteurs simples :** *first* (d’abord), *also* (aussi), *as for me* (quant à moi), *however* (cependant), *because* (parce que), *so* (donc), *finally* (enfin).

**Step 5 — Check the language line by line. A long letter is not better if it repeats ideas or contains avoidable mistakes.**

> **Traduction française :** **Étape 5 — Vérifie la langue ligne par ligne.** Une longue lettre n’est pas meilleure si elle répète des idées ou contient des erreurs évitables.

### 5. Friendly language bank

| Purpose | English language you can adapt | French translation |
|---|---|---|
| Greeting | **Dear Akim, / Hi Akim, How are you?** | **Cher Akim, / Salut Akim, Comment vas-tu ?** |
| Reacting | **I was really happy to receive your letter.** | **J’ai été vraiment heureux/heureuse de recevoir ta lettre.** |
| Showing care | **I was sorry to hear about the accident. I hope you are receiving the support you need.** | **J’ai été triste d’apprendre l’accident. J’espère que tu reçois le soutien dont tu as besoin.** |
| Family news | **Everyone at home sends you their best wishes.** | **Tout le monde à la maison t’envoie ses meilleures pensées.** |
| Personal news | **As for me, school is busy, but I am doing my best.** | **Quant à moi, l’école est chargée, mais je fais de mon mieux.** |
| Encouragement | **Keep believing in yourself; I know you can achieve your goals.** | **Continue à croire en toi ; je sais que tu peux atteindre tes objectifs.** |
| Closing | **Write back soon. Take care. Best wishes, Ousmane.** | **Écris-moi bientôt. Prends soin de toi. Meilleurs vœux, Ousmane.** |

### 6. Guided mini-model: structure, not a source quotation

> **This is an original practice model. It illustrates the five-paragraph plan; it is not presented as Akim’s unseen letter or as the only correct reply. Adapt the details to the task.**

> **Traduction française :** **Ce modèle est une production d’entraînement originale. Il illustre le plan en cinq paragraphes ; il n’est pas présenté comme la lettre non visible d’Akim ni comme l’unique réponse correcte. Adapte les détails à la consigne.**

**Dear Akim,**

> **Traduction française :** **Cher Akim,**

**How are you doing these days? I was very happy to receive your letter, and I hope you are feeling supported by the people around you.**

> **Traduction française :** **Comment vas-tu ces jours-ci ? J’ai été très heureux de recevoir ta lettre et j’espère que les personnes autour de toi te soutiennent.**

**My family is fine and sends you warm greetings. Some of our friends were glad to hear that we are still in touch.**

> **Traduction française :** **Ma famille va bien et t’envoie de chaleureuses salutations. Certains de nos amis ont été contents d’apprendre que nous gardons le contact.**

**As for me, I am working hard at school. I also joined a reading group because I want to improve my English.**

> **Traduction française :** **Quant à moi, je travaille beaucoup à l’école. J’ai aussi rejoint un groupe de lecture parce que je veux améliorer mon anglais.**

**I was sorry to learn that life has been difficult after your accident. Please remember that your friendship means a lot to me, and I admire your determination.**

> **Traduction française :** **J’ai été triste d’apprendre que la vie a été difficile après ton accident. Souviens-toi que ton amitié compte beaucoup pour moi et que j’admire ta détermination.**

**The good news is that I am preparing a small project with classmates. I hope it will go well. Write back soon and tell me about your plans. Take care.**

> **Traduction française :** **La bonne nouvelle est que je prépare un petit projet avec des camarades. J’espère que cela se passera bien. Écris-moi bientôt et parle-moi de tes projets. Prends soin de toi.**

**Best wishes,**

> **Traduction française :** **Meilleurs vœux,**

**Ousmane**

> **Traduction française :** **Ousmane**

### 7. The 250–300 word task: manage the length

The source asks for 250 to 300 words. Do not write one very long paragraph. Aim for about five paragraphs of 45 to 55 words, then check your word count.

> **Traduction française :** La source demande entre 250 et 300 mots. N’écris pas un seul très long paragraphe. Vise environ cinq paragraphes de 45 à 55 mots, puis vérifie le nombre de mots.

| Self-check before exchange with a partner | Why it matters |
|---|---|
| **Have I used the five-paragraph plan?**<br><br>**Traduction française :** Ai-je utilisé le plan en cinq paragraphes ? | It proves that you answered the exact task.<br><br>**Traduction française :** Cela prouve que tu as répondu à la consigne exacte. |
| **Is my language informal but respectful?**<br><br>**Traduction française :** Ma langue est-elle informelle mais respectueuse ? | A friend needs warmth, not a cold official tone or careless slang.<br><br>**Traduction française :** Un ami a besoin de chaleur, et non d’un ton officiel froid ou d’un argot négligé. |
| **Did I include personal news, feelings and encouragement?**<br><br>**Traduction française :** Ai-je inclus des nouvelles personnelles, des sentiments et des encouragements ? | These ideas make the letter complete and coherent.<br><br>**Traduction française :** Ces idées rendent la lettre complète et cohérente. |
| **Did I check spelling, grammar and punctuation?**<br><br>**Traduction française :** Ai-je vérifié l’orthographe, la grammaire et la ponctuation ? | The source explicitly requires this peer-review step.<br><br>**Traduction française :** La source exige explicitement cette étape de relecture entre pairs. |

### 8. Homework transfer: invite a friend to a birthday celebration

**Dear friend, I would love you to come to my birthday celebration at my home on Saturday afternoon. We will share music, food and games. Please let me know if you can come.**

> **Traduction française :** **Cher ami / Chère amie, j’aimerais beaucoup que tu viennes à ma fête d’anniversaire chez moi samedi après-midi. Nous partagerons de la musique, de la nourriture et des jeux. Dis-moi, s’il te plaît, si tu peux venir.**

This invitation task uses the same informal-letter structure: greeting, purpose, useful details, warm closing and signature.

> **Traduction française :** Cette tâche d’invitation utilise la même structure de lettre informelle : salutation, objet, détails utiles, clôture chaleureuse et signature.

> **Writing synthesis:** a successful informal letter is personal, organised and accurate. It uses friendly language, respects the requested plan and gives the reader a reason to reply.

> **Traduction française :** **Synthèse d’écriture :** une lettre informelle réussie est personnelle, organisée et correcte. Elle utilise une langue amicale, respecte le plan demandé et donne au lecteur une raison de répondre.

## Pedagogical reference

Reformulated and expanded from the supplied PDFs: **Unit 2 Freedom and Rights — Listening for Comprehension**, **Reading for Comprehension** and **Writing an Informal Letter**, Far Ahead Terminale, Côte d’Ivoire — École numérique.$english_unit2$,is_active=false where id=lesson_uuid;
    end if;

    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
    values (target.subject_id,target.level_id,target.series_id,chapter_uuid,lesson_uuid,'Exercise 1 — Listening: Human Rights and disability inclusion

> **Traduction française :** Exercice 1 — Écoute : droits humains et inclusion des personnes handicapées',$english_unit2$**Apply the listening strategy to identify themes, language clues and respectful ways to speak about rights.**

> **Traduction française :** Applique la stratégie d’écoute pour identifier les thèmes, les indices linguistiques et les manières respectueuses de parler des droits.$english_unit2$,$english_unit2$**The correction distinguishes topic, grammar clues and respectful human-rights language.**

> **Traduction française :** La correction distingue le thème, les indices grammaticaux et une langue respectueuse des droits humains.$english_unit2$,'single_choice','easy',$english_unit2$**Read each prompt, predict the information type, then choose the answer that fits the context.**

> **Traduction française :** Lis chaque consigne, anticipe le type d’information, puis choisis la réponse qui convient au contexte.$english_unit2$,$english_unit2$**Check the bilingual explanation after each answer.**

> **Traduction française :** Vérifie l’explication bilingue après chaque réponse.$english_unit2$,false,false,20,10) returning id into exercise_listening_uuid;
insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
      (exercise_listening_uuid,$english_unit2$single_choice$english_unit2$,$english_unit2$**What should you identify on a first listening?**

> **Traduction française :** Que dois-tu identifier lors d’une première écoute ?$english_unit2$,jsonb_build_array($english_unit2$The speaker and the main topic
— Traduction française : Le locuteur et le thème principal$english_unit2$, $english_unit2$Every missing word immediately
— Traduction française : Chaque mot manquant immédiatement$english_unit2$, $english_unit2$Only the spelling of names
— Traduction française : Seulement l’orthographe des noms$english_unit2$),jsonb_build_array($english_unit2$The speaker and the main topic
— Traduction française : Le locuteur et le thème principal$english_unit2$),$english_unit2$**The first listening is for global understanding: who speaks and what main difficulty or issue is discussed.**

> **Traduction française :** La première écoute sert à la compréhension globale : qui parle et quelle difficulté ou quel problème principal est abordé.$english_unit2$,10),
      (exercise_listening_uuid,$english_unit2$single_choice$english_unit2$,$english_unit2$**What can “financially” help you understand in a listening activity?**

> **Traduction française :** Que peut t’aider à comprendre « financially » dans une activité d’écoute ?$english_unit2$,jsonb_build_array($english_unit2$Information about money or economic dependence
— Traduction française : Une information sur l’argent ou la dépendance économique$english_unit2$, $english_unit2$Information about the weather
— Traduction française : Une information sur la météo$english_unit2$, $english_unit2$Information about a birthday
— Traduction française : Une information sur un anniversaire$english_unit2$),jsonb_build_array($english_unit2$Information about money or economic dependence
— Traduction française : Une information sur l’argent ou la dépendance économique$english_unit2$),$english_unit2$**The word “financially” introduces an economic aspect of a person’s situation.**

> **Traduction française :** Le mot « financially » introduit un aspect économique de la situation d’une personne.$english_unit2$,20),
      (exercise_listening_uuid,$english_unit2$true_false$english_unit2$,$english_unit2$**True or false: respectful listening reduces a person to their disability.**

> **Traduction française :** Vrai ou faux : une écoute respectueuse réduit une personne à son handicap.$english_unit2$,jsonb_build_array($english_unit2$False
— Traduction française : Faux$english_unit2$, $english_unit2$True
— Traduction française : Vrai$english_unit2$),jsonb_build_array($english_unit2$False
— Traduction française : Faux$english_unit2$),$english_unit2$**Respectful language recognises the whole person, their choices, needs and rights.**

> **Traduction française :** Un langage respectueux reconnaît la personne dans sa globalité, ses choix, ses besoins et ses droits.$english_unit2$,30);

    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
    values (target.subject_id,target.level_id,target.series_id,chapter_uuid,lesson_uuid,'Exercise 2 — Reading: freedom, evidence and children’s rights

> **Traduction française :** Exercice 2 — Lecture : liberté, preuve et droits de l’enfant',$english_unit2$**Use the reading strategies for general idea, contextual vocabulary and evidence-based true/false answers.**

> **Traduction française :** Utilise les stratégies de lecture pour l’idée générale, le vocabulaire contextuel et les réponses vrai/faux fondées sur des preuves.$english_unit2$,$english_unit2$**The correction uses only the information visible in the worksheet and explains how to cite evidence.**

> **Traduction française :** La correction utilise seulement les informations visibles dans la fiche et explique comment citer une preuve.$english_unit2$,'single_choice','medium',$english_unit2$**Do not invent unseen details: identify the method that the source supports.**

> **Traduction française :** N’invente pas de détails non visibles : identifie la méthode appuyée par la source.$english_unit2$,$english_unit2$**A sound answer identifies the main idea or cites a precise line.**

> **Traduction française :** Une bonne réponse identifie l’idée générale ou cite une ligne précise.$english_unit2$,false,false,20,20) returning id into exercise_reading_uuid;
insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
      (exercise_reading_uuid,$english_unit2$single_choice$english_unit2$,$english_unit2$**What is the safest way to state the general idea of the supplied reading activity?**

> **Traduction française :** Quelle est la manière la plus sûre d’énoncer l’idée générale de l’activité de lecture fournie ?$english_unit2$,jsonb_build_array($english_unit2$It concerns a life story connected with slavery, freedom and education.
— Traduction française : Elle concerne un récit de vie lié à l’esclavage, la liberté et l’éducation.$english_unit2$, $english_unit2$It is a recipe for cocoa.
— Traduction française : C’est une recette à base de cacao.$english_unit2$, $english_unit2$It is an advertisement for a holiday.
— Traduction française : C’est une publicité pour des vacances.$english_unit2$),jsonb_build_array($english_unit2$It concerns a life story connected with slavery, freedom and education.
— Traduction française : Elle concerne un récit de vie lié à l’esclavage, la liberté et l’éducation.$english_unit2$),$english_unit2$**This response uses only information visible in the worksheet and avoids inventing unseen details.**

> **Traduction française :** Cette réponse utilise seulement les informations visibles dans la fiche et évite d’inventer des détails non visibles.$english_unit2$,10),
      (exercise_reading_uuid,$english_unit2$single_choice$english_unit2$,$english_unit2$**Which explicit synonym does the worksheet provide?**

> **Traduction française :** Quel synonyme explicite la fiche fournit-elle ?$english_unit2$,jsonb_build_array($english_unit2$remember → recall
— Traduction française : remember → recall / se souvenir → se rappeler$english_unit2$, $english_unit2$buyer → teacher
— Traduction française : buyer → teacher / acheteur → enseignant$english_unit2$, $english_unit2$education → accident
— Traduction française : education → accident / éducation → accident$english_unit2$),jsonb_build_array($english_unit2$remember → recall
— Traduction française : remember → recall / se souvenir → se rappeler$english_unit2$),$english_unit2$**The worksheet itself gives “recall” as the example for “remember”.**

> **Traduction française :** La fiche donne elle-même « recall » comme exemple pour « remember ».$english_unit2$,20),
      (exercise_reading_uuid,$english_unit2$single_choice$english_unit2$,$english_unit2$**What must support a true-or-false answer in this reading task?**

> **Traduction française :** Qu’est-ce qui doit soutenir une réponse vrai/faux dans cette tâche de lecture ?$english_unit2$,jsonb_build_array($english_unit2$A precise line or quotation from the text
— Traduction française : Une ligne précise ou une citation du texte$english_unit2$, $english_unit2$A guess based only on the title
— Traduction française : Une supposition fondée seulement sur le titre$english_unit2$, $english_unit2$An unrelated personal opinion
— Traduction française : Une opinion personnelle sans rapport$english_unit2$),jsonb_build_array($english_unit2$A precise line or quotation from the text
— Traduction française : Une ligne précise ou une citation du texte$english_unit2$),$english_unit2$**The source asks learners to justify their answers by quoting the relevant lines.**

> **Traduction française :** La source demande aux élèves de justifier leurs réponses en citant les lignes pertinentes.$english_unit2$,30);

    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
    values (target.subject_id,target.level_id,target.series_id,chapter_uuid,lesson_uuid,'Exercise 3 — Writing: organise an informal reply to a friend

> **Traduction française :** Exercice 3 — Écriture : organiser une réponse informelle à un ami',$english_unit2$**Choose the correct informal tone, the five-paragraph plan and the peer-review criteria for a reply to Akim.**

> **Traduction française :** Choisis le ton informel correct, le plan en cinq paragraphes et les critères de relecture pour une réponse à Akim.$english_unit2$,$english_unit2$**The correction explains each step of the informal-letter method and the difference from formal writing.**

> **Traduction française :** La correction explique chaque étape de la méthode de lettre informelle et la différence avec l’écriture formelle.$english_unit2$,'single_choice','medium',$english_unit2$**Plan before writing: friend, family/friends, yourself, feelings and a positive closing.**

> **Traduction française :** Planifie avant d’écrire : ami, famille/amis, soi-même, sentiments et clôture positive.$english_unit2$,$english_unit2$**A friendly tone must still be organised, accurate and respectful.**

> **Traduction française :** Un ton amical doit rester organisé, correct et respectueux.$english_unit2$,false,false,30,30) returning id into exercise_writing_uuid;
insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
      (exercise_writing_uuid,$english_unit2$single_choice$english_unit2$,$english_unit2$**Which opening fits an informal letter to a friend?**

> **Traduction française :** Quelle formule d’ouverture convient à une lettre informelle à un ami ?$english_unit2$,jsonb_build_array($english_unit2$Dear Akim,
— Traduction française : Cher Akim,$english_unit2$, $english_unit2$Dear Sir or Madam,
— Traduction française : Madame, Monsieur,$english_unit2$, $english_unit2$To whom it may concern,
— Traduction française : À qui de droit,$english_unit2$),jsonb_build_array($english_unit2$Dear Akim,
— Traduction française : Cher Akim,$english_unit2$),$english_unit2$**A personal greeting such as “Dear Akim” matches a friendly informal letter.**

> **Traduction française :** Une salutation personnelle comme « Dear Akim » convient à une lettre amicale informelle.$english_unit2$,10),
      (exercise_writing_uuid,$english_unit2$single_choice$english_unit2$,$english_unit2$**What is the correct five-paragraph order from the source plan?**

> **Traduction française :** Quel est l’ordre correct des cinq paragraphes selon le plan source ?$english_unit2$,jsonb_build_array($english_unit2$Friend → family/friends → yourself → feelings → positive closing news
— Traduction française : Ami → famille/amis → soi-même → sentiments → nouvelles positives de clôture$english_unit2$, $english_unit2$Feelings → signature → date → complaint → receiver
— Traduction française : Sentiments → signature → date → plainte → destinataire$english_unit2$, $english_unit2$Only one paragraph with all ideas mixed
— Traduction française : Un seul paragraphe avec toutes les idées mélangées$english_unit2$),jsonb_build_array($english_unit2$Friend → family/friends → yourself → feelings → positive closing news
— Traduction française : Ami → famille/amis → soi-même → sentiments → nouvelles positives de clôture$english_unit2$),$english_unit2$**The worksheet gives this five-part plan to organise the reply to Akim.**

> **Traduction française :** La fiche donne ce plan en cinq parties pour organiser la réponse à Akim.$english_unit2$,20),
      (exercise_writing_uuid,$english_unit2$single_choice$english_unit2$,$english_unit2$**Which expression is warm and appropriate when replying to a friend after an accident?**

> **Traduction française :** Quelle expression est chaleureuse et appropriée pour répondre à un ami après un accident ?$english_unit2$,jsonb_build_array($english_unit2$I was sorry to hear about the accident, and I hope you are receiving support.
— Traduction française : J’ai été triste d’apprendre l’accident et j’espère que tu reçois du soutien.$english_unit2$, $english_unit2$Your problem is not important.
— Traduction française : Ton problème n’est pas important.$english_unit2$, $english_unit2$I refuse to write to you again.
— Traduction française : Je refuse de t’écrire encore.$english_unit2$),jsonb_build_array($english_unit2$I was sorry to hear about the accident, and I hope you are receiving support.
— Traduction française : J’ai été triste d’apprendre l’accident et j’espère que tu reçois du soutien.$english_unit2$),$english_unit2$**An informal letter can express empathy and encouragement without pity or invented facts.**

> **Traduction française :** Une lettre informelle peut exprimer de l’empathie et des encouragements sans pitié ni faits inventés.$english_unit2$,30),
      (exercise_writing_uuid,$english_unit2$single_choice$english_unit2$,$english_unit2$**What must be checked during peer review according to the source?**

> **Traduction française :** Que faut-il vérifier pendant la relecture entre pairs selon la source ?$english_unit2$,jsonb_build_array($english_unit2$Informal language, spelling, grammar and punctuation
— Traduction française : Langue informelle, orthographe, grammaire et ponctuation$english_unit2$, $english_unit2$Only the colour of the paper
— Traduction française : Seulement la couleur du papier$english_unit2$, $english_unit2$Nothing, because informal letters need no correction
— Traduction française : Rien, car les lettres informelles n’ont pas besoin de correction$english_unit2$),jsonb_build_array($english_unit2$Informal language, spelling, grammar and punctuation
— Traduction française : Langue informelle, orthographe, grammaire et ponctuation$english_unit2$),$english_unit2$**The PDF explicitly asks partners to check informal language, spelling, grammar and punctuation.**

> **Traduction française :** Le PDF demande explicitement aux partenaires de vérifier la langue informelle, l’orthographe, la grammaire et la ponctuation.$english_unit2$,40);

insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active)
    values (target.subject_id,target.level_id,target.series_id,target.offering_id,chapter_uuid,lesson_uuid,$english_unit2$Bilingual quiz 1 — Listening: Human Rights

> **Traduction française :** Quiz bilingue 1 — Écoute : droits humains$english_unit2$,$english_unit2$**Check listening strategies and respectful language for Human Rights topics.**

> **Traduction française :** Vérifie les stratégies d’écoute et la langue respectueuse pour les thèmes des droits humains.$english_unit2$,'medium',15,10,false,false)
    returning id into quiz_listening_uuid;
    with inserted_questions as (
      insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
      (quiz_listening_uuid,$english_unit2$**What should you listen for when a statement concerns how someone copes with a disability?**

> **Traduction française :** Que dois-tu écouter lorsqu’une affirmation concerne la manière dont une personne fait face à un handicap ?$english_unit2$,$english_unit2$**Listen for strategies, support, work, education, care or independence.**

> **Traduction française :** Écoute les stratégies, le soutien, le travail, l’éducation, les soins ou l’autonomie.$english_unit2$,'single_choice',10,1,true),
      (quiz_listening_uuid,$english_unit2$**What does “a major challenge” mean?**

> **Traduction française :** Que signifie « a major challenge » ?$english_unit2$,$english_unit2$**It means a serious difficulty that requires effort, preparation or support.**

> **Traduction française :** Cela signifie une difficulté importante qui exige des efforts, une préparation ou un soutien.$english_unit2$,'single_choice',20,1,true),
      (quiz_listening_uuid,$english_unit2$**Which human-rights issue is proposed for the recording task?**

> **Traduction française :** Quel problème de droits humains est proposé pour la tâche d’enregistrement ?$english_unit2$,$english_unit2$**The source proposes gender discrimination in education, work opportunities for disabled people and justice for poor people.**

> **Traduction française :** La source propose la discrimination de genre dans l’éducation, les possibilités d’emploi pour les personnes handicapées et la justice pour les personnes pauvres.$english_unit2$,'single_choice',30,1,true),
      (quiz_listening_uuid,$english_unit2$**True or false: respectful discussion must recognise both difficulties and rights.**

> **Traduction française :** Vrai ou faux : une discussion respectueuse doit reconnaître à la fois les difficultés et les droits.$english_unit2$,$english_unit2$**True. The lesson focuses on people’s situations, dignity, support and equal participation.**

> **Traduction française :** Vrai. La leçon porte sur les situations des personnes, leur dignité, le soutien et la participation égale.$english_unit2$,'single_choice',40,1,true)
      returning id,display_order
    )
    insert into public.quiz_answers (question_id,answer,is_correct,display_order)
    select inserted_questions.id,answers.answer,answers.is_correct,answers.display_order
    from inserted_questions
    join (values
        (10,$english_unit2$Strategies and support
— Traduction française : Des stratégies et du soutien$english_unit2$,true,10),
        (10,$english_unit2$Only colours in the room
— Traduction française : Seulement les couleurs dans la pièce$english_unit2$,false,20),
        (10,$english_unit2$A recipe
— Traduction française : Une recette$english_unit2$,false,30),
        (20,$english_unit2$A serious difficulty
— Traduction française : Une difficulté importante$english_unit2$,true,10),
        (20,$english_unit2$A small joke
— Traduction française : Une petite blague$english_unit2$,false,20),
        (20,$english_unit2$A guaranteed success
— Traduction française : Une réussite garantie$english_unit2$,false,30),
        (30,$english_unit2$Job opportunities for disabled people
— Traduction française : Les possibilités d’emploi pour les personnes handicapées$english_unit2$,true,10),
        (30,$english_unit2$Choosing a holiday hotel
— Traduction française : Choisir un hôtel de vacances$english_unit2$,false,20),
        (30,$english_unit2$Buying a new phone
— Traduction française : Acheter un nouveau téléphone$english_unit2$,false,30),
        (40,$english_unit2$True
— Traduction française : Vrai$english_unit2$,true,10),
        (40,$english_unit2$False
— Traduction française : Faux$english_unit2$,false,20)
    ) as answers(question_order,answer,is_correct,display_order)
      on answers.question_order=inserted_questions.display_order;

insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active)
    values (target.subject_id,target.level_id,target.series_id,target.offering_id,chapter_uuid,lesson_uuid,$english_unit2$Bilingual quiz 2 — Reading: Freedom and Rights

> **Traduction française :** Quiz bilingue 2 — Lecture : liberté et droits$english_unit2$,$english_unit2$**Check general idea, contextual vocabulary, evidence and children’s rights.**

> **Traduction française :** Vérifie l’idée générale, le vocabulaire contextuel, la preuve et les droits de l’enfant.$english_unit2$,'medium',15,20,false,false)
    returning id into quiz_reading_uuid;
    with inserted_questions as (
      insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
      (quiz_reading_uuid,$english_unit2$**What does a general idea describe?**

> **Traduction française :** Que décrit l’idée générale ?$english_unit2$,$english_unit2$**It describes the central message, not every detail in the text.**

> **Traduction française :** Elle décrit le message central et non chaque détail du texte.$english_unit2$,'single_choice',10,1,true),
      (quiz_reading_uuid,$english_unit2$**Which strategy helps find a synonym in context?**

> **Traduction française :** Quelle stratégie aide à trouver un synonyme dans le contexte ?$english_unit2$,$english_unit2$**Read the full sentence, identify the word class and compare the meaning in context.**

> **Traduction française :** Lis la phrase entière, identifie la nature du mot et compare le sens dans le contexte.$english_unit2$,'single_choice',20,1,true),
      (quiz_reading_uuid,$english_unit2$**Which statement is explicitly marked true in the worksheet example?**

> **Traduction française :** Quelle affirmation est explicitement marquée vraie dans l’exemple de la fiche ?$english_unit2$,$english_unit2$**The example says that the narrator does not know when he was born, true at line 2.**

> **Traduction française :** L’exemple indique que le narrateur ne sait pas quand il est né, vrai à la ligne 2.$english_unit2$,'single_choice',30,1,true),
      (quiz_reading_uuid,$english_unit2$**What should a report on child labour request?**

> **Traduction française :** Que doit demander un signalement sur le travail des enfants ?$english_unit2$,$english_unit2$**It should request investigation and protective action, while describing observed facts carefully.**

> **Traduction française :** Il doit demander une enquête et une action de protection, tout en décrivant soigneusement les faits observés.$english_unit2$,'single_choice',40,1,true)
      returning id,display_order
    )
    insert into public.quiz_answers (question_id,answer,is_correct,display_order)
    select inserted_questions.id,answers.answer,answers.is_correct,answers.display_order
    from inserted_questions
    join (values
        (10,$english_unit2$The central message
— Traduction française : Le message central$english_unit2$,true,10),
        (10,$english_unit2$Every punctuation mark
— Traduction française : Chaque signe de ponctuation$english_unit2$,false,20),
        (10,$english_unit2$Only the final line
— Traduction française : Seulement la dernière ligne$english_unit2$,false,30),
        (20,$english_unit2$Read the full sentence and context
— Traduction française : Lire la phrase entière et le contexte$english_unit2$,true,10),
        (20,$english_unit2$Guess without reading
— Traduction française : Deviner sans lire$english_unit2$,false,20),
        (20,$english_unit2$Ignore the paragraph
— Traduction française : Ignorer le paragraphe$english_unit2$,false,30),
        (30,$english_unit2$The narrator does not know when he was born.
— Traduction française : Le narrateur ne sait pas quand il est né.$english_unit2$,true,10),
        (30,$english_unit2$The narrator wrote the story as a child.
— Traduction française : Le narrateur a écrit l’histoire enfant.$english_unit2$,false,20),
        (30,$english_unit2$The narrator never needed evidence.
— Traduction française : Le narrateur n’a jamais eu besoin de preuve.$english_unit2$,false,30),
        (40,$english_unit2$Protective action
— Traduction française : Une action de protection$english_unit2$,true,10),
        (40,$english_unit2$More dangerous work
— Traduction française : Davantage de travail dangereux$english_unit2$,false,20),
        (40,$english_unit2$No access to school
— Traduction française : Aucun accès à l’école$english_unit2$,false,30)
    ) as answers(question_order,answer,is_correct,display_order)
      on answers.question_order=inserted_questions.display_order;

insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active)
    values (target.subject_id,target.level_id,target.series_id,target.offering_id,chapter_uuid,lesson_uuid,$english_unit2$Bilingual quiz 3 — Writing: an informal letter

> **Traduction française :** Quiz bilingue 3 — Écriture : une lettre informelle$english_unit2$,$english_unit2$**Check the personal tone, five-paragraph plan and peer-review method of an informal letter.**

> **Traduction française :** Vérifie le ton personnel, le plan en cinq paragraphes et la méthode de relecture d’une lettre informelle.$english_unit2$,'medium',15,30,false,false)
    returning id into quiz_writing_uuid;
    with inserted_questions as (
      insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
      (quiz_writing_uuid,$english_unit2$**Why is “Dear Akim,” appropriate in this task?**

> **Traduction française :** Pourquoi « Dear Akim, » est-il approprié dans cette tâche ?$english_unit2$,$english_unit2$**Akim is a friend and former classmate, so a personal informal greeting fits.**

> **Traduction française :** Akim est un ami et ancien camarade, donc une salutation personnelle informelle convient.$english_unit2$,'single_choice',10,1,true),
      (quiz_writing_uuid,$english_unit2$**What is the first paragraph expected to do?**

> **Traduction française :** Que doit faire le premier paragraphe ?$english_unit2$,$english_unit2$**The source plan says to ask about your friend.**

> **Traduction française :** Le plan source demande de prendre des nouvelles de l’ami.$english_unit2$,'single_choice',20,1,true),
      (quiz_writing_uuid,$english_unit2$**Which connector can introduce personal news?**

> **Traduction française :** Quel connecteur peut introduire des nouvelles personnelles ?$english_unit2$,$english_unit2$**“As for me” helps shift naturally to your own news.**

> **Traduction française :** « As for me » aide à passer naturellement à tes propres nouvelles.$english_unit2$,'single_choice',30,1,true),
      (quiz_writing_uuid,$english_unit2$**What makes an informal letter successful?**

> **Traduction française :** Qu’est-ce qui rend une lettre informelle réussie ?$english_unit2$,$english_unit2$**It is personal, organised and accurate, with friendly language and careful checking.**

> **Traduction française :** Elle est personnelle, organisée et correcte, avec une langue amicale et une relecture attentive.$english_unit2$,'single_choice',40,1,true)
      returning id,display_order
    )
    insert into public.quiz_answers (question_id,answer,is_correct,display_order)
    select inserted_questions.id,answers.answer,answers.is_correct,answers.display_order
    from inserted_questions
    join (values
        (10,$english_unit2$It is a personal greeting for a friend.
— Traduction française : C’est une salutation personnelle pour un ami.$english_unit2$,true,10),
        (10,$english_unit2$It is a complaint to a ministry.
— Traduction française : C’est une plainte à un ministère.$english_unit2$,false,20),
        (10,$english_unit2$It is an official legal formula.
— Traduction française : C’est une formule juridique officielle.$english_unit2$,false,30),
        (20,$english_unit2$Ask about your friend
— Traduction française : Prendre des nouvelles de ton ami$english_unit2$,true,10),
        (20,$english_unit2$List grammar mistakes
— Traduction française : Lister les fautes de grammaire$english_unit2$,false,20),
        (20,$english_unit2$Report a company
— Traduction française : Signaler une entreprise$english_unit2$,false,30),
        (30,$english_unit2$As for me
— Traduction française : Quant à moi$english_unit2$,true,10),
        (30,$english_unit2$Yours faithfully
— Traduction française : Veuillez agréer$english_unit2$,false,20),
        (30,$english_unit2$No evidence
— Traduction française : Aucune preuve$english_unit2$,false,30),
        (40,$english_unit2$Friendly language, clear organisation and accurate writing
— Traduction française : Langue amicale, organisation claire et écriture correcte$english_unit2$,true,10),
        (40,$english_unit2$One long unplanned paragraph
— Traduction française : Un long paragraphe non planifié$english_unit2$,false,20),
        (40,$english_unit2$Insults and no punctuation
— Traduction française : Des insultes et aucune ponctuation$english_unit2$,false,30)
    ) as answers(question_order,answer,is_correct,display_order)
      on answers.question_order=inserted_questions.display_order;
  end loop;
end
$english_terminal_unit2$;
