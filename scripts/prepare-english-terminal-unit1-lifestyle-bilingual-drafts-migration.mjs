import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const migrationPath = resolve(root, "supabase/migrations/20260823_english_terminal_unit1_lifestyle_bilingual_drafts.sql");
const payloadPath = resolve(root, "supabase/migrations/20260823_english_terminal_unit1_lifestyle_bilingual_drafts.apply.json");

const offerings = [
  "81c5b295-b5d4-4a7c-a922-0604236a4aa8",
  "0bc8f25a-432a-441b-8a86-303b452aaf9f",
  "ff97ed10-ea0d-4e7e-9dd1-8010229c03b6",
  "94543938-fd4c-4ba8-8205-35f765264719",
];

const sqlText = (value) => {
  const tag = "$english_lifestyle$";
  if (value.includes(tag)) throw new Error("Contenu incompatible avec le délimiteur SQL.");
  return `${tag}${value}${tag}`;
};

const jsonbArray = (values) => `jsonb_build_array(${values.map(sqlText).join(", ")})`;

const readingContent = `## Unit 1 — Lifestyle: Moving with the Times

> **Traduction française :** Unité 1 — Modes de vie : évoluer avec son temps.

> **Bilingual learning goal:** understand a migrant's story, identify causes and consequences of migration, and discuss the topic responsibly.

> **Objectif bilingue :** comprendre le récit d’un migrant, identifier les causes et les conséquences de la migration et discuter du sujet avec responsabilité.

## Part A — Reading: In search of a better life — a migrant’s story

> **Traduction française :** Partie A — Compréhension écrite : À la recherche d’une vie meilleure — l’histoire d’un migrant.

### 1. Learning situation

**After watching a report about the migrants’ tragedy in Libya, the members of an English Club read a text in order to find information and arguments before writing a letter of complaint.**

> **Traduction française :** Après avoir regardé un reportage sur la tragédie des migrants en Libye, les membres d’un club d’anglais lisent un texte afin de trouver des informations et des arguments avant d’écrire une lettre de plainte.

The document asks you to read actively. Do not read only to translate word by word. First identify the topic, then the person’s problem, choices, destination and result.

> **Traduction française :** Le document te demande de lire activement. Ne lis pas seulement pour traduire mot à mot. Identifie d’abord le thème, puis le problème de la personne, ses choix, sa destination et le résultat.

### 2. Key vocabulary about migration

| English word or expression | Meaning and bilingual example |
|---|---|
| **migration** | Movement of people from one place or country to another, often to seek safety, work or better living conditions. **Migration can be voluntary or forced.**<br><br>**Traduction française :** Déplacement de personnes d’un lieu ou d’un pays à un autre, souvent pour chercher la sécurité, un emploi ou de meilleures conditions de vie. **La migration peut être volontaire ou forcée.** |
| **a migrant** | A person who moves to another place or country. **Sanga is presented as a migrant in the reading activity.**<br><br>**Traduction française :** Une personne qui s’installe dans un autre lieu ou pays. **Sanga est présenté comme un migrant dans l’activité de lecture.** |
| **poverty** | The condition of having too little money or resources to meet basic needs. **Poverty can push families to look for opportunities elsewhere.**<br><br>**Traduction française :** Situation dans laquelle on dispose de trop peu d’argent ou de ressources pour satisfaire les besoins essentiels. **La pauvreté peut pousser des familles à chercher des possibilités ailleurs.** |
| **unemployment** | The situation of not having a job while being able and willing to work. **Unemployment may make a young person feel discouraged.**<br><br>**Traduction française :** Situation d’une personne sans emploi qui peut et veut travailler. **Le chômage peut décourager un jeune.** |
| **to cope with** | To deal with a very difficult situation. **A family may struggle to cope with poverty.**<br><br>**Traduction française :** Faire face à une situation très difficile. **Une famille peut avoir du mal à faire face à la pauvreté.** |
| **to get on / to board** | To enter a vehicle or a boat. **The travellers got on a boat.**<br><br>**Traduction française :** Monter dans un véhicule ou un bateau. **Les voyageurs sont montés dans un bateau.** |
| **to go under water / to sink** | To disappear below the surface of water. **A boat can sink in heavy seas.**<br><br>**Traduction française :** Disparaître sous la surface de l’eau. **Un bateau peut couler dans une mer agitée.** |
| **to be deported** | To be officially sent back to one’s country or another country by authorities. **Being deported can interrupt a migration journey.**<br><br>**Traduction française :** Être officiellement renvoyé vers son pays ou vers un autre pays par les autorités. **Être expulsé peut interrompre un parcours migratoire.** |
| **to save up** | To keep money gradually for a future purpose. **He decided to save up before trying to improve his situation.**<br><br>**Traduction française :** Économiser progressivement de l’argent dans un but futur. **Il a décidé d’économiser avant d’essayer d’améliorer sa situation.** |

### 3. Reading strategy: follow the story step by step

**Step 1 — Find the main topic. Ask: “Who is the text about and what is the person looking for?”**

> **Traduction française :** **Étape 1 — Trouve le sujet principal. Demande-toi : « De qui parle le texte et que cherche cette personne ? »**

**Step 2 — Rebuild the sequence. Identify childhood, the reason for leaving, the journey, the destination and what happened afterwards.**

> **Traduction française :** **Étape 2 — Reconstruis la chronologie. Identifie l’enfance, la raison du départ, le voyage, la destination et ce qui s’est passé ensuite.**

**Step 3 — Use clues in the questions. A question about “why” asks for a cause; a question about “what happened” asks for an event or consequence.**

> **Traduction française :** **Étape 3 — Utilise les indices des questions. Une question avec « why » demande une cause ; une question avec « what happened » demande un événement ou une conséquence.**

**Step 4 — Check every answer against the text. Do not choose an answer only because it sounds possible.**

> **Traduction française :** **Étape 4 — Vérifie chaque réponse avec le texte. Ne choisis pas une réponse uniquement parce qu’elle semble possible.**

### 4. What the source activity establishes about Sanga

| Question from the activity | Supported answer and explanation |
|---|---|
| **Why was Sanga’s childhood hard?** | **His mother brought him and his brothers up alone.** The activity links hardship to the family situation in his childhood.<br><br>**Traduction française :** **Sa mère l’a élevé, lui et ses frères, seule.** L’activité relie les difficultés à la situation familiale pendant son enfance. |
| **Why did Sanga leave his homeland?** | **To get his family out of poverty.** This identifies poverty as the central pressure in the story.<br><br>**Traduction française :** **Pour sortir sa famille de la pauvreté.** Cela présente la pauvreté comme la pression centrale du récit. |
| **Where did he want to go ultimately?** | **To the United Kingdom.** “Ultimately” means the final objective, not only a stop on the journey.<br><br>**Traduction française :** **Au Royaume-Uni.** « Ultimately » signifie l’objectif final et non seulement une étape du voyage. |
| **What happened during the crossing to the Canaries?** | **Both boats sank in heavy seas.** The source therefore presents the crossing as dangerous, not as an easy solution.<br><br>**Traduction française :** **Les deux bateaux ont coulé dans une mer agitée.** La source présente donc la traversée comme dangereuse et non comme une solution facile. |
| **What did he do after being deported to Nigeria?** | **He decided to save up and try again.** This shows determination, but it does not remove the risks described in the activity.<br><br>**Traduction française :** **Il a décidé d’économiser et d’essayer à nouveau.** Cela montre sa détermination, mais n’efface pas les risques décrits dans l’activité. |

> **Responsible discussion:** The reading describes a difficult and risky human experience. When discussing migration, distinguish the reasons that may push people to leave from safe, lawful and informed solutions. Never present a dangerous journey as a recommendation.

> **Traduction française :** **Discussion responsable :** la lecture décrit une expérience humaine difficile et risquée. Lorsque tu parles de migration, distingue les raisons qui peuvent pousser au départ des solutions sûres, légales et bien informées. Ne présente jamais un voyage dangereux comme une recommandation.

### 5. Discussion language

**In my opinion, Sanga could have looked for training, work opportunities or support in a safe and lawful way.**

> **Traduction française :** **À mon avis, Sanga aurait pu rechercher une formation, des possibilités d’emploi ou un accompagnement de manière sûre et légale.**

**The story shows that poverty, unemployment and family responsibilities can influence a person’s decisions.**

> **Traduction française :** **L’histoire montre que la pauvreté, le chômage et les responsabilités familiales peuvent influencer les décisions d’une personne.**

---

## Part B — Writing: A formal letter of complaint

> **Traduction française :** Partie B — Expression écrite : une lettre de plainte formelle.

> **Writing objective:** write a clear, respectful and effective formal letter of complaint about a real problem affecting people or the environment.

> **Objectif d’écriture :** rédiger une lettre de plainte formelle claire, respectueuse et efficace au sujet d’un problème réel qui touche des personnes ou l’environnement.

### 1. What is a formal letter of complaint?

**A formal letter of complaint is a respectful written message sent to a person or organisation able to deal with a problem. It explains the situation, gives facts, shows consequences and asks for action.**

> **Traduction française :** **Une lettre de plainte formelle est un message écrit respectueux envoyé à une personne ou à une organisation capable de traiter un problème. Elle explique la situation, donne des faits, présente les conséquences et demande une action.**

The PDF model concerns frequent power cuts. The communication task concerns pollution caused by a mining company. In both cases, the writer must be firm about the problem while remaining polite.

> **Traduction française :** Le modèle du PDF concerne des coupures d’électricité fréquentes. L’activité de communication concerne une pollution causée par une société minière. Dans les deux cas, l’auteur doit être ferme sur le problème tout en restant poli.

### 2. Language for expressing a complaint

| English expression | Meaning, use and French translation |
|---|---|
| **I want to complain about …** | Use this to state the subject directly and politely. **I want to complain about the pollution near our village.**<br><br>**Traduction française :** Utilise cette formule pour annoncer le sujet directement et poliment. **Je souhaite me plaindre de la pollution près de notre village.** |
| **I wish to make a complaint about …** | A more formal way to introduce the purpose. **I wish to make a complaint about frequent power cuts.**<br><br>**Traduction française :** Une manière plus formelle d’introduire l’objet. **Je souhaite déposer une plainte au sujet de coupures fréquentes d’électricité.** |
| **I am writing to draw your attention to …** | Use this to bring a serious problem to the receiver’s attention. **I am writing to draw your attention to water pollution.**<br><br>**Traduction française :** Utilise cette formule pour attirer l’attention du destinataire sur un problème sérieux. **Je vous écris pour attirer votre attention sur la pollution de l’eau.** |
| **There is a problem with / about …** | Use it to name a difficulty before explaining it. **There is a problem with waste from the company.**<br><br>**Traduction française :** Utilise cette formule pour nommer une difficulté avant de l’expliquer. **Il y a un problème avec les déchets de l’entreprise.** |
| **I would be grateful if you could …** | A polite request for action. **I would be grateful if you could investigate this situation.**<br><br>**Traduction française :** Une demande d’action polie. **Je vous serais reconnaissant(e) si vous pouviez enquêter sur cette situation.** |
| **I hope that prompt action will be taken.** | A respectful conclusion that invites action. **I hope that prompt action will be taken to protect the community.**<br><br>**Traduction française :** Une conclusion respectueuse qui invite à agir. **J’espère que des mesures rapides seront prises pour protéger la communauté.** |
| **grievance / objection / criticism** | Words for a complaint, an objection or a critical remark. Choose clear words; do not use insulting language.<br><br>**Traduction française :** Des mots pour désigner une plainte, une objection ou une remarque critique. Choisis des mots clairs ; n’emploie pas de langage insultant. |

### 3. The seven visible parts of the letter

| Part | What to write | Why it matters |
|---|---|---|
| **1. Receiver’s address** | The receiver’s name, position and address. **The Manager of …**<br><br>**Traduction française :** Le nom, la fonction et l’adresse du destinataire. | It shows exactly who should read and act on the letter.<br><br>**Traduction française :** Cela montre précisément qui doit lire la lettre et agir. |
| **2. Writer’s address** | Your name or post office box and town, as shown in the model.<br><br>**Traduction française :** Ton nom ou ta boîte postale et ta ville, comme dans le modèle. | It allows a reply to reach you.<br><br>**Traduction française :** Cela permet qu’une réponse te parvienne. |
| **3. Date** | Write the date clearly: day, month and year.<br><br>**Traduction française :** Écris la date clairement : jour, mois et année. | It situates the complaint in time.<br><br>**Traduction française :** Cela situe la plainte dans le temps. |
| **4. Opening formula** | **Dear Sir or Madam,** when the name is unknown; use the receiver’s name when the task gives it.<br><br>**Traduction française :** **Dear Sir or Madam,** lorsque le nom est inconnu ; utilise le nom du destinataire si la consigne le donne. | It establishes the formal tone from the first line.<br><br>**Traduction française :** Cela établit un ton formel dès la première ligne. |
| **5. Body** | State the purpose, give details and examples, show consequences, then propose solutions and hopes.<br><br>**Traduction française :** Indique l’objet, donne des détails et des exemples, présente les conséquences, puis propose des solutions et des attentes. | This is the proof and the request of your letter.<br><br>**Traduction française :** C’est la preuve et la demande de ta lettre. |
| **6. Closing formula** | **Yours faithfully,** or **Yours sincerely,** as required by the model and the task.<br><br>**Traduction française :** **Yours faithfully,** ou **Yours sincerely,** selon le modèle et la consigne. | It closes politely without weakening the complaint.<br><br>**Traduction française :** Cela clôt poliment sans affaiblir la plainte. |
| **7. Signature** | Write your name in capital letters and sign, following the layout taught in the source.<br><br>**Traduction française :** Écris ton nom en lettres capitales et signe, en suivant la mise en page enseignée dans la source. | It identifies the writer clearly.<br><br>**Traduction française :** Cela identifie clairement l’auteur. |

### 4. Build the body paragraph by paragraph

**Paragraph 1 — State the problem. Name the place and the exact reason for writing.**

> **Traduction française :** **Paragraphe 1 — Annonce le problème. Indique le lieu et la raison exacte de la lettre.**

**Example: I am writing to complain about pollution caused by a mining company near my village.**

> **Traduction française :** **Exemple : Je vous écris pour me plaindre de la pollution causée par une société minière près de mon village.**

**Paragraph 2 — Give useful facts and examples. Explain the type of pollution and who or what is affected.**

> **Traduction française :** **Paragraphe 2 — Donne des faits et des exemples utiles. Explique le type de pollution et les personnes ou éléments touchés.**

**Example: Dust and waste are affecting the air, the water and the health of residents.**

> **Traduction française :** **Exemple : La poussière et les déchets affectent l’air, l’eau et la santé des habitants.**

**Paragraph 3 — State the consequences. Explain why the problem cannot be ignored.**

> **Traduction française :** **Paragraphe 3 — Présente les conséquences. Explique pourquoi le problème ne peut pas être ignoré.**

**Example: Children and farmers are particularly affected because they depend on a clean environment.**

> **Traduction française :** **Exemple : Les enfants et les agriculteurs sont particulièrement touchés parce qu’ils dépendent d’un environnement propre.**

**Paragraph 4 — Request action and express hope. Be specific, courteous and realistic.**

> **Traduction française :** **Paragraphe 4 — Demande une action et exprime ton espoir. Sois précis(e), courtois(e) et réaliste.**

**Example: I would be grateful if you could investigate the matter and encourage the company to protect the community.**

> **Traduction française :** **Exemple : Je vous serais reconnaissant(e) si vous pouviez examiner cette affaire et encourager l’entreprise à protéger la communauté.**

### 5. A writing method you can reuse

1. **Read the situation twice and underline the receiver, place, problem, effects and requested action.**

   > **Traduction française :** Lis la situation deux fois et souligne le destinataire, le lieu, le problème, les effets et l’action demandée.

2. **Make a four-line plan: purpose, facts, consequences, solution.**

   > **Traduction française :** Fais un plan de quatre lignes : objet, faits, conséquences, solution.

3. **Choose formal expressions from the language bank; avoid slang, threats and personal insults.**

   > **Traduction française :** Choisis des expressions formelles dans la banque de langue ; évite l’argot, les menaces et les insultes personnelles.

4. **Write short, precise paragraphs. One paragraph should develop one clear job in the letter.**

   > **Traduction française :** Rédige des paragraphes courts et précis. Un paragraphe doit remplir une fonction claire dans la lettre.

5. **Check the seven parts before submitting: addresses, date, greeting, body, closing and signature.**

   > **Traduction française :** Vérifie les sept parties avant de rendre le travail : adresses, date, formule d’ouverture, corps, formule de clôture et signature.

### 6. Checklist and common errors to avoid

| Check before you finish | Error to avoid |
|---|---|
| **Is the purpose stated in the first paragraph?**<br><br>**Traduction française :** L’objet est-il annoncé dans le premier paragraphe ? | Starting with a long story without saying why you are writing.<br><br>**Traduction française :** Commencer par un long récit sans dire pourquoi tu écris. |
| **Did you give facts or examples?**<br><br>**Traduction française :** As-tu donné des faits ou des exemples ? | Repeating “It is bad” without explaining the situation.<br><br>**Traduction française :** Répéter « C’est mauvais » sans expliquer la situation. |
| **Did you show consequences?**<br><br>**Traduction française :** As-tu montré les conséquences ? | Forgetting to explain who is affected and how.<br><br>**Traduction française :** Oublier d’expliquer qui est touché et de quelle manière. |
| **Did you ask respectfully for action?**<br><br>**Traduction française :** As-tu demandé une action de manière respectueuse ? | Giving orders or using insulting language.<br><br>**Traduction française :** Donner des ordres ou utiliser un langage insultant. |
| **Is the letter concise and precise?**<br><br>**Traduction française :** La lettre est-elle concise et précise ? | Adding unrelated details that weaken the complaint.<br><br>**Traduction française :** Ajouter des détails sans rapport qui affaiblissent la plainte. |

> **Writing synthesis:** A successful formal letter of complaint is respectful, factual and organised. It does not only say that there is a problem: it makes the receiver understand the problem, its consequences and the action expected.

> **Traduction française :** **Synthèse d’écriture :** une lettre de plainte formelle réussie est respectueuse, factuelle et organisée. Elle ne se contente pas de dire qu’il y a un problème : elle permet au destinataire de comprendre le problème, ses conséquences et l’action attendue.

## Pedagogical reference

Reformulated and expanded from the supplied PDFs: **Unit 1 Lifestyle — Reading: In search of a better life — a migrant’s story** and **Unit 1 Lifestyle — Writing: A formal letter of complaint**, Far Ahead Terminale, Côte d’Ivoire — École numérique.`;

const readingQuestions = [
  {
    type: "single_choice",
    prompt: "**What is the best title for the text about Sanga?**\n\n> **Traduction française :** Quel est le meilleur titre pour le texte sur Sanga ?",
    options: [
      "A migrant’s story\n— Traduction française : L’histoire d’un migrant",
      "A holiday in Europe\n— Traduction française : Des vacances en Europe",
      "Living in Nigeria without problems\n— Traduction française : Vivre au Nigeria sans problème",
    ],
    correct: ["A migrant’s story\n— Traduction française : L’histoire d’un migrant"],
    explanation: "**The source activity identifies the text as a migrant’s story.**\n\n> **Traduction française :** L’activité source identifie le texte comme l’histoire d’un migrant.",
  },
  {
    type: "single_choice",
    prompt: "**In the activity, what does “to cope with a very difficult situation” mean?**\n\n> **Traduction française :** Dans l’activité, que signifie « faire face à une situation très difficile » ?",
    options: [
      "To deal with it\n— Traduction française : Y faire face",
      "To forget it immediately\n— Traduction française : L’oublier immédiatement",
      "To travel by boat\n— Traduction française : Voyager en bateau",
    ],
    correct: ["To deal with it\n— Traduction française : Y faire face"],
    explanation: "**To cope with means to manage or deal with a difficult situation.**\n\n> **Traduction française :** *To cope with* signifie gérer ou faire face à une situation difficile.",
  },
  {
    type: "true_false",
    prompt: "**True or false: the reading presents the crossing as safe and easy.**\n\n> **Traduction française :** Vrai ou faux : la lecture présente la traversée comme sûre et facile.",
    options: ["False\n— Traduction française : Faux", "True\n— Traduction française : Vrai"],
    correct: ["False\n— Traduction française : Faux"],
    explanation: "**The activity states that both boats sank in heavy seas, which shows serious danger.**\n\n> **Traduction française :** L’activité indique que les deux bateaux ont coulé dans une mer agitée, ce qui montre un danger sérieux.",
  },
];

const writingQuestions = [
  {
    type: "single_choice",
    prompt: "**Which sentence is the most appropriate first sentence in a formal letter of complaint?**\n\n> **Traduction française :** Quelle phrase convient le mieux comme première phrase dans une lettre de plainte formelle ?",
    options: [
      "I wish to make a complaint about the pollution near our village.\n— Traduction française : Je souhaite déposer une plainte au sujet de la pollution près de notre village.",
      "Hey, your company is terrible!\n— Traduction française : Hé, votre entreprise est terrible !",
      "I have nothing important to say.\n— Traduction française : Je n’ai rien d’important à dire.",
    ],
    correct: ["I wish to make a complaint about the pollution near our village.\n— Traduction française : Je souhaite déposer une plainte au sujet de la pollution près de notre village."],
    explanation: "**A formal complaint begins with a precise, respectful statement of purpose.**\n\n> **Traduction française :** Une plainte formelle commence par l’annonce précise et respectueuse de son objet.",
  },
  {
    type: "single_choice",
    prompt: "**What comes after explaining the reason for writing?**\n\n> **Traduction française :** Que faut-il faire après avoir expliqué la raison de la lettre ?",
    options: [
      "Give facts, examples and consequences.\n— Traduction française : Donner des faits, des exemples et des conséquences.",
      "Change the topic completely.\n— Traduction française : Changer complètement de sujet.",
      "Use insults to sound stronger.\n— Traduction française : Utiliser des insultes pour paraître plus ferme.",
    ],
    correct: ["Give facts, examples and consequences.\n— Traduction française : Donner des faits, des exemples et des conséquences."],
    explanation: "**The source layout requires details, facts, examples and consequences in the body.**\n\n> **Traduction française :** La mise en page source demande des détails, des faits, des exemples et des conséquences dans le corps de la lettre.",
  },
  {
    type: "single_choice",
    prompt: "**Which strategy is recommended for a good letter of complaint?**\n\n> **Traduction française :** Quelle stratégie est recommandée pour une bonne lettre de plainte ?",
    options: [
      "Be concise, precise and polite.\n— Traduction française : Être concis(e), précis(e) et poli(e).",
      "Write as many unrelated details as possible.\n— Traduction française : Écrire autant de détails sans rapport que possible.",
      "Avoid asking the receiver to act.\n— Traduction française : Éviter de demander au destinataire d’agir.",
    ],
    correct: ["Be concise, precise and polite.\n— Traduction française : Être concis(e), précis(e) et poli(e)."],
    explanation: "**The PDF explicitly asks for a concise, precise and polite letter.**\n\n> **Traduction française :** Le PDF demande explicitement une lettre concise, précise et polie.",
  },
];

const quizReadingQuestions = [
  {
    question: "**Why did Sanga decide to leave his homeland?**\n\n> **Traduction française :** Pourquoi Sanga a-t-il décidé de quitter son pays ?",
    explanation: "**The source answer links his decision to helping his family escape poverty.**\n\n> **Traduction française :** La réponse source relie sa décision au fait d’aider sa famille à sortir de la pauvreté.",
    answers: [
      ["To get his family out of poverty\n— Traduction française : Pour sortir sa famille de la pauvreté", true],
      ["Only to go on holiday\n— Traduction française : Uniquement pour partir en vacances", false],
      ["To avoid schoolwork\n— Traduction française : Pour éviter le travail scolaire", false],
    ],
  },
  {
    question: "**Where did Sanga want to go ultimately?**\n\n> **Traduction française :** Où Sanga voulait-il aller au final ?",
    explanation: "**The activity gives the United Kingdom as his final destination.**\n\n> **Traduction française :** L’activité donne le Royaume-Uni comme sa destination finale.",
    answers: [
      ["To the United Kingdom\n— Traduction française : Au Royaume-Uni", true],
      ["To the Canary Islands only\n— Traduction française : Uniquement aux îles Canaries", false],
      ["To France\n— Traduction française : En France", false],
    ],
  },
  {
    question: "**What happened during the crossing to the Canaries?**\n\n> **Traduction française :** Que s’est-il passé pendant la traversée vers les Canaries ?",
    explanation: "**Both boats sank in heavy seas according to the source activity.**\n\n> **Traduction française :** Les deux bateaux ont coulé dans une mer agitée selon l’activité source.",
    answers: [
      ["Both boats sank in heavy seas.\n— Traduction française : Les deux bateaux ont coulé dans une mer agitée.", true],
      ["The journey was easy and safe.\n— Traduction française : Le voyage a été facile et sûr.", false],
      ["They arrived immediately at school.\n— Traduction française : Ils sont arrivés immédiatement à l’école.", false],
    ],
  },
  {
    question: "**What is a responsible way to discuss the story?**\n\n> **Traduction française :** Quelle est une manière responsable de discuter de cette histoire ?",
    explanation: "**The lesson distinguishes reasons for leaving from safe, lawful and informed choices.**\n\n> **Traduction française :** La leçon distingue les raisons du départ des choix sûrs, légaux et bien informés.",
    answers: [
      ["Recognise the risks and discuss safe, lawful options.\n— Traduction française : Reconnaître les risques et discuter de solutions sûres et légales.", true],
      ["Recommend dangerous crossings to everyone.\n— Traduction française : Recommander des traversées dangereuses à tout le monde.", false],
      ["Ignore the consequences in the story.\n— Traduction française : Ignorer les conséquences du récit.", false],
    ],
  },
];

const quizWritingQuestions = [
  {
    question: "**What is the first job of the body of a complaint letter?**\n\n> **Traduction française :** Quelle est la première fonction du corps d’une lettre de plainte ?",
    explanation: "**The writer must state the point or reason for writing.**\n\n> **Traduction française :** L’auteur doit annoncer l’objet ou la raison de la lettre.",
    answers: [
      ["State the reason for writing.\n— Traduction française : Annoncer la raison de la lettre.", true],
      ["Write the signature first.\n— Traduction française : Écrire la signature en premier.", false],
      ["Hide the problem.\n— Traduction française : Cacher le problème.", false],
    ],
  },
  {
    question: "**Which part helps the receiver identify the problem through facts and examples?**\n\n> **Traduction française :** Quelle partie aide le destinataire à comprendre le problème grâce à des faits et des exemples ?",
    explanation: "**The body provides details, facts and examples before consequences and solutions.**\n\n> **Traduction française :** Le corps fournit des détails, des faits et des exemples avant les conséquences et les solutions.",
    answers: [
      ["The body of the letter\n— Traduction française : Le corps de la lettre", true],
      ["Only the date\n— Traduction française : La date seulement", false],
      ["Only the signature\n— Traduction française : La signature seulement", false],
    ],
  },
  {
    question: "**Which request is polite and appropriate?**\n\n> **Traduction française :** Quelle demande est polie et appropriée ?",
    explanation: "**Formal writing uses courteous wording to encourage a positive response.**\n\n> **Traduction française :** L’écriture formelle utilise une formulation courtoise afin d’encourager une réponse positive.",
    answers: [
      ["I would be grateful if you could investigate this matter.\n— Traduction française : Je vous serais reconnaissant(e) si vous pouviez examiner cette affaire.", true],
      ["Fix it now or else!\n— Traduction française : Réglez cela immédiatement, sinon !", false],
      ["I refuse to explain anything.\n— Traduction française : Je refuse d’expliquer quoi que ce soit.", false],
    ],
  },
  {
    question: "**What should a good letter of complaint be?**\n\n> **Traduction française :** Comment doit être une bonne lettre de plainte ?",
    explanation: "**The writing strategy says that it should be concise, precise, detailed where needed and polite.**\n\n> **Traduction française :** La stratégie d’écriture indique qu’elle doit être concise, précise, détaillée lorsque nécessaire et polie.",
    answers: [
      ["Concise, precise and polite\n— Traduction française : Concise, précise et polie", true],
      ["Rude and confusing\n— Traduction française : Grossière et confuse", false],
      ["Without any requested action\n— Traduction française : Sans aucune action demandée", false],
    ],
  },
];

function exerciseQuestionSql(exerciseVariable, questions) {
  return `insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values\n${questions.map((question, index) => `      (${exerciseVariable},${sqlText(question.type)},${sqlText(question.prompt)},${jsonbArray(question.options)},${jsonbArray(question.correct)},${sqlText(question.explanation)},${(index + 1) * 10})`).join(",\n")};`;
}

function quizSql(quizVariable, title, description, questions, order) {
  const inserts = questions.map((question, index) => `      (${quizVariable},${sqlText(question.question)},${sqlText(question.explanation)},'single_choice',${(index + 1) * 10},1,true)`).join(",\n");
  const answers = questions.flatMap((question, questionIndex) => question.answers.map(([answer, isCorrect], answerIndex) => `        (${(questionIndex + 1) * 10},${sqlText(answer)},${isCorrect},${(answerIndex + 1) * 10})`)).join(",\n");
  return `insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active)
    values (target.subject_id,target.level_id,target.series_id,target.offering_id,chapter_uuid,lesson_uuid,${sqlText(title)},${sqlText(description)},'medium',15,${order},false,false)
    returning id into ${quizVariable};
    with inserted_questions as (
      insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
${inserts}
      returning id,display_order
    )
    insert into public.quiz_answers (question_id,answer,is_correct,display_order)
    select inserted_questions.id,answers.answer,answers.is_correct,answers.display_order
    from inserted_questions
    join (values
${answers}
    ) as answers(question_order,answer,is_correct,display_order)
      on answers.question_order=inserted_questions.display_order;`;
}

const migration = `-- Lot Anglais Terminale Unit 1 Lifestyle — deux PDF, format bilingue obligatoire.
-- Toute formulation pédagogique anglaise est immédiatement suivie de sa traduction française.
-- Les ressources sont créées exclusivement en brouillon, inactives et non publiées.
do $english_terminal_unit1_lifestyle$
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
  chapter_order integer;
  lesson_order integer;
  unit_title constant text := 'UNIT 1 LIFESTYLES: MOVING WITH THE TIMES';
begin
  select count(*) into target_count
  from public.course_subject_offerings
  where id in (${offerings.map(sqlText).join(", ")});
  if target_count <> 4 then
    raise exception 'Les quatre offres Anglais Terminale A1/A2/C/D attendues sont requises ; transaction annulée.';
  end if;

  if exists (
    select 1
    from public.lessons le
    join public.chapters ch on ch.id=le.chapter_id
    where ch.subject_offering_id in (${offerings.map(sqlText).join(", ")})
      and le.title='UNIT 1 LIFESTYLES: MOVING WITH THE TIMES'
      and (coalesce(char_length(le.content),0)>0
        or exists (select 1 from public.exercises e where e.lesson_id=le.id)
        or exists (select 1 from public.quizzes q where q.lesson_id=le.id))
  ) then
    raise exception 'Une unité Lifestyle cible contient déjà du contenu, un exercice ou un quiz ; ré-audit requis avant toute écriture.';
  end if;

  for target in
    select o.id as offering_id,o.subject_id,o.level_id,o.series_id,se.name as series_name
    from public.course_subject_offerings o
    join public.series se on se.id=o.series_id
    where o.id in (${offerings.map(sqlText).join(", ")})
    order by se.name
  loop
    chapter_uuid := null;
    select id into chapter_uuid
    from public.chapters
    where subject_offering_id=target.offering_id
      and title='PROGRESSION TERMINALE A'
    limit 1;

    if chapter_uuid is null and target.series_name in ('C','D') then
      select id into chapter_uuid
      from public.chapters
      where subject_offering_id=target.offering_id
        and title='PROGRESSIONS TERMINALES C ET D — Anglais'
      limit 1;
    end if;

    if chapter_uuid is null and target.series_name='A2' then
      select coalesce(max(display_order),0)+10 into chapter_order
      from public.chapters
      where subject_offering_id=target.offering_id;
      insert into public.chapters (subject_id,level_id,series_id,subject_offering_id,title,description,display_order,is_active)
      values (target.subject_id,target.level_id,target.series_id,target.offering_id,'PROGRESSION TERMINALE A','Progression Anglais Terminale A, créée uniquement parce que le lot Unit 1 commun aux séries Terminale est explicitement fourni.',chapter_order,false)
      returning id into chapter_uuid;
    end if;

    if chapter_uuid is null then
      raise exception 'Le chapitre Anglais Terminale attendu est absent pour la série %.', target.series_name;
    end if;

    lesson_uuid := null;
    select id,content into lesson_uuid,current_content
    from public.lessons
    where chapter_id=chapter_uuid and title=unit_title
    limit 1;

    if lesson_uuid is null then
      select coalesce(max(display_order),0)+10 into lesson_order
      from public.lessons where chapter_id=chapter_uuid;
      insert into public.lessons (chapter_id,title,description,content,display_order,is_active)
      values (chapter_uuid,unit_title,'Unit 1 Lifestyle : compréhension d’un récit de migration et rédaction très guidée d’une lettre de plainte formelle bilingue.',${sqlText(readingContent)},lesson_order,false)
      returning id into lesson_uuid;
    else
      select count(*) into current_exercises from public.exercises where lesson_id=lesson_uuid;
      select count(*) into current_quizzes from public.quizzes where lesson_id=lesson_uuid;
      if coalesce(char_length(current_content),0)>0 or current_exercises>0 or current_quizzes>0 then
        raise exception 'La leçon Lifestyle de la série % n’est pas vide ; écrasement interdit.', target.series_name;
      end if;
      update public.lessons
      set description='Unit 1 Lifestyle : compréhension d’un récit de migration et rédaction très guidée d’une lettre de plainte formelle bilingue.',
          content=${sqlText(readingContent)},
          is_active=false
      where id=lesson_uuid;
    end if;

    exercise_reading_uuid := null;
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
    values (target.subject_id,target.level_id,target.series_id,chapter_uuid,lesson_uuid,'Exercise 1 — Reading: Sanga’s migrant story\n\n> **Traduction française :** Exercice 1 — Compréhension écrite : l’histoire migratoire de Sanga',${sqlText("**Read the questions about Sanga’s story and choose the answer supported by the source activity.**\n\n> **Traduction française :** Lis les questions sur l’histoire de Sanga et choisis la réponse appuyée par l’activité source.")},${sqlText("**The correction explains the title, key vocabulary and safety clues in the story.**\n\n> **Traduction française :** La correction explique le titre, le vocabulaire clé et les indices de danger dans l’histoire.")},'single_choice','easy',${sqlText("**Use the reading method: identify the topic, cause, event and consequence before answering.**\n\n> **Traduction française :** Utilise la méthode de lecture : identifie le sujet, la cause, l’événement et la conséquence avant de répondre.")},${sqlText("**Check each answer against the explanation and its immediate French translation.**\n\n> **Traduction française :** Vérifie chaque réponse à l’aide de l’explication et de sa traduction française immédiate.")},false,false,20,10)
    returning id into exercise_reading_uuid;
${exerciseQuestionSql("exercise_reading_uuid", readingQuestions)}

    exercise_writing_uuid := null;
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
    values (target.subject_id,target.level_id,target.series_id,chapter_uuid,lesson_uuid,'Exercise 2 — Writing: build a formal complaint letter\n\n> **Traduction française :** Exercice 2 — Expression écrite : construire une lettre de plainte formelle',${sqlText("**Choose the formal language and the correct organisation for a complaint letter.**\n\n> **Traduction française :** Choisis la langue formelle et l’organisation correcte pour une lettre de plainte.")},${sqlText("**The correction connects each choice to the seven-part layout and the respectful writing strategy.**\n\n> **Traduction française :** La correction relie chaque choix à la structure en sept parties et à la stratégie d’écriture respectueuse.")},'single_choice','medium',${sqlText("**Before answering, identify the purpose, facts, consequences and requested action.**\n\n> **Traduction française :** Avant de répondre, identifie l’objet, les faits, les conséquences et l’action demandée.")},${sqlText("**A strong complaint is precise, factual, polite and organised.**\n\n> **Traduction française :** Une plainte solide est précise, factuelle, polie et organisée.")},false,false,25,20)
    returning id into exercise_writing_uuid;
${exerciseQuestionSql("exercise_writing_uuid", writingQuestions)}

${quizSql("quiz_reading_uuid", "Bilingual quiz 1 — Reading: a migrant’s story\n\n> **Traduction française :** Quiz bilingue 1 — Compréhension écrite : l’histoire d’un migrant", "**Check your understanding of causes, events, vocabulary and responsible discussion.**\n\n> **Traduction française :** Vérifie ta compréhension des causes, des événements, du vocabulaire et de la discussion responsable.", quizReadingQuestions, 10)}

${quizSql("quiz_writing_uuid", "Bilingual quiz 2 — Writing: a formal letter of complaint\n\n> **Traduction française :** Quiz bilingue 2 — Expression écrite : une lettre de plainte formelle", "**Check the purpose, body, polite requests and writing strategy of a formal complaint letter.**\n\n> **Traduction française :** Vérifie l’objet, le corps, les demandes polies et la stratégie d’écriture d’une lettre de plainte formelle.", quizWritingQuestions, 20)}
  end loop;
end
$english_terminal_unit1_lifestyle$;
`;

writeFileSync(migrationPath, migration, "utf8");
writeFileSync(payloadPath, `${JSON.stringify({
  project_id: "nnshioowwniursnozicg",
  name: "english_terminal_unit1_lifestyle_bilingual_drafts",
  query: migration,
}, null, 2)}\n`, "utf8");

console.log(migrationPath);
console.log(payloadPath);
