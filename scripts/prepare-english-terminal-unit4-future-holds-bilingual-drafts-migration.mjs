import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const migrationPath = resolve(root, "supabase/migrations/20260823_english_terminal_unit4_future_holds_bilingual_drafts.sql");
const payloadPath = resolve(root, "supabase/migrations/20260823_english_terminal_unit4_future_holds_bilingual_drafts.apply.json");

const offerings = [
  "81c5b295-b5d4-4a7c-a922-0604236a4aa8",
  "0bc8f25a-432a-441b-8a86-303b452aaf9f",
  "ff97ed10-ea0d-4e7e-9dd1-8010229c03b6",
  "94543938-fd4c-4ba8-8205-35f765264719",
];
const a2OfferingId = "0bc8f25a-432a-441b-8a86-303b452aaf9f";

const sqlText = (value) => {
  const tag = "$english_unit4$";
  if (value.includes(tag)) throw new Error("Contenu incompatible avec le délimiteur SQL.");
  return `${tag}${value}${tag}`;
};
const jsonbArray = (values) => `jsonb_build_array(${values.map(sqlText).join(", ")})`;

const lessonContent = `## Unit 4 — What the Future Holds

> **Traduction française :** Unité 4 — Ce que l’avenir nous réserve.

> **Bilingual learning goal:** understand future urbanisation and development issues, express a completed future action, and write a formal letter requesting support for an environmental project.

> **Objectif bilingue :** comprendre l’urbanisation future et les enjeux du développement, exprimer une action achevée dans le futur et écrire une lettre formelle demandant un soutien pour un projet environnemental.

> **Reading source:** *Africa’s fastest-growing cities*, adapted from Reuters, 04 May 2016. The writing worksheet focuses on environment vocabulary, causes and effects, and a tree-planting project.

> **Traduction française :** **Source Reading :** *Africa’s fastest-growing cities*, adaptation de Reuters, 4 mai 2016. La fiche Writing porte sur le vocabulaire de l’environnement, les causes et conséquences, ainsi qu’un projet de plantation d’arbres.

---

## Part A — Reading: Africa’s fastest-growing cities

> **Traduction française :** Partie A — Lecture : les villes africaines à la croissance la plus rapide.

### 1. Read the title and prepare your ideas

**The title invites you to think about cities, population, urbanisation and the future. Before reading, identify possible benefits and possible risks without treating predictions as facts.**

> **Traduction française :** **Le titre t’invite à réfléchir aux villes, à la population, à l’urbanisation et à l’avenir. Avant de lire, identifie des bénéfices possibles et des risques possibles sans traiter les prévisions comme des faits.**

The worksheet asks learners to list three potential dangers the modern world can face in the next 10 or 20 years and then discuss their causes.

> **Traduction française :** La fiche demande aux élèves de citer trois dangers possibles auxquels le monde moderne peut être confronté dans les 10 ou 20 prochaines années, puis de discuter de leurs causes.

### 2. Key vocabulary — hover or tap the underlined words

**The interactive terms below show a French translation and a short contextual definition when you hover over them on the web or tap them on mobile.**

> **Traduction française :** **Les termes interactifs ci-dessous affichent une traduction française et une courte définition contextuelle lorsque tu les survoles sur le web ou que tu les touches sur mobile.**

| English term | Meaning in this unit | French translation |
|---|---|---|
| [[urbanize|s’urbaniser|to become more urban as people and activities concentrate in cities]] | to become more urban | s’urbaniser |
| [[slum|bidonville|a densely populated urban area with inadequate housing or services]] | a poor urban neighbourhood | bidonville |
| [[growth|croissance|an increase in size, number or activity]] | increase | croissance |
| [[pull factor|facteur d’attraction|a reason that attracts people to a place]] | attracting reason | facteur d’attraction |
| [[push factor|facteur de répulsion|a difficulty that pushes people away from a place]] | reason for leaving | facteur de répulsion |
| [[brain drain|fuite des cerveaux|the departure of skilled people to seek better opportunities elsewhere]] | loss of skilled workers | fuite des cerveaux |
| [[shortage|pénurie|a situation where there is not enough of something needed]] | lack | pénurie |
| [[tipping point|point critique|a moment when a situation can change rapidly or become difficult to reverse]] | critical threshold | point critique |

### 3. The future perfect: a completed action before a future moment

**By the year 2060, the population in megacities will have doubled.**

> **Traduction française :** **D’ici l’année 2060, la population des mégapoles aura doublé.**

The future perfect has the structure **will have + past participle**. It looks forward from a future point and says that an action will be complete before that point.

> **Traduction française :** Le futur parfait a la structure **will have + participe passé**. Il regarde depuis un moment futur et indique qu’une action sera achevée avant ce moment.

| Use | English example | French translation |
|---|---|---|
| Future deadline | **By 2050, many cities will have grown quickly.** | **D’ici 2050, de nombreuses villes auront grandi rapidement.** |
| Personal future achievement | **By 2028, I will have completed my university degree.** | **D’ici 2028, j’aurai terminé mon diplôme universitaire.** |
| Warning based on a condition | **If services are not improved, shortages will have become more serious.** | **Si les services ne sont pas améliorés, les pénuries seront devenues plus graves.** |

**Do not use the future perfect for an action that is simply happening in the future. Use it when the idea of “completed before a future time” is important.**

> **Traduction française :** **N’utilise pas le futur parfait pour une action qui se déroule simplement dans le futur. Utilise-le lorsque l’idée de « terminé avant un moment futur » est importante.**

### 4. Understand urban population growth

**The article explains that sub-Saharan Africa is urbanising rapidly. It connects population growth in cities with natural population increase, rural-to-urban migration and migration across borders.**

> **Traduction française :** **L’article explique que l’Afrique subsaharienne s’urbanise rapidement. Il relie la croissance de la population urbaine à l’accroissement naturel, à la migration rurale-urbaine et aux migrations transfrontalières.**

Do not confuse **population growth** with **urbanisation**. Population growth means that the number of people increases. Urbanisation means that a larger share of people live in cities or that cities expand.

> **Traduction française :** Ne confonds pas **population growth** (croissance de la population) et **urbanisation**. La croissance de la population signifie que le nombre de personnes augmente. L’urbanisation signifie qu’une part plus importante des personnes vit dans les villes ou que les villes s’étendent.

### 5. Pull factors and push factors

**Pull factors draw people to the city. The text gives examples such as economic opportunities, employment, better connectivity, access to essential services and education.**

> **Traduction française :** **Les facteurs d’attraction attirent les personnes vers la ville. Le texte donne comme exemples les possibilités économiques, l’emploi, une meilleure connectivité, l’accès aux services essentiels et à l’éducation.**

**Push factors drive people out of rural environments. The text mentions rural conflicts, environmental degradation, climate change and resource shortages.**

> **Traduction française :** **Les facteurs de répulsion poussent les personnes à quitter les environnements ruraux. Le texte mentionne les conflits ruraux, la dégradation environnementale, le changement climatique et les pénuries de ressources.**

| Question | Pull factor | Push factor |
|---|---|---|
| Why might a person move? | **To gain a job, services or education.**<br><br>**Traduction française :** Pour obtenir un emploi, des services ou une éducation. | **To escape conflict, climate pressure or lack of resources.**<br><br>**Traduction française :** Pour fuir un conflit, une pression climatique ou le manque de ressources. |
| Direction of pressure | **toward the city**<br><br>**Traduction française :** vers la ville | **away from the previous environment**<br><br>**Traduction française :** loin de l’environnement précédent |

### 6. Analyse different viewpoints responsibly

**Optimists in the text see possible innovation, employment and economic growth. Pessimists fear overstressed cities, unplanned urbanisation and political, economic or environmental upheaval.**

> **Traduction française :** **Les optimistes du texte voient des possibilités d’innovation, d’emploi et de croissance économique. Les pessimistes craignent des villes surchargées, une urbanisation non planifiée et des bouleversements politiques, économiques ou environnementaux.**

A good debate does not say that one side is “always right”. It identifies each claim, gives evidence from the text, then adds a reasoned opinion.

> **Traduction française :** Un bon débat ne dit pas qu’un camp a « toujours raison ». Il identifie chaque affirmation, donne des preuves tirées du texte, puis ajoute une opinion raisonnée.

**Useful debate frames:**

- **In my view, rapid population growth can be a strength if…**

  > **Traduction française :** À mon avis, une croissance démographique rapide peut être une force si…

- **However, without planning, cities may…**

  > **Traduction française :** Cependant, sans planification, les villes peuvent…

- **The text supports this point when it mentions…**

  > **Traduction française :** Le texte appuie ce point lorsqu’il mentionne…

### 7. Comprehension method: choose, match, prove

**For the main-issue question, first read the whole text: do not choose an answer only because one word appears often. For vocabulary matching, use the line number and the sentence around the word. For true-or-false statements, compare each key detail with the exact line and justify your answer.**

> **Traduction française :** **Pour la question sur le problème principal, lis d’abord tout le texte : ne choisis pas une réponse seulement parce qu’un mot apparaît souvent. Pour l’appariement lexical, utilise le numéro de ligne et la phrase autour du mot. Pour les affirmations vrai/faux, compare chaque détail clé à la ligne exacte et justifie ta réponse.**

---

## Part B — Writing: request support for a tree-planting project

> **Traduction française :** Partie B — Écriture : demander un soutien pour un projet de plantation d’arbres.

### 1. Environmental vocabulary and precise meaning

**Climate** is the typical weather condition in a specific area over a long period.

> **Traduction française :** **Climate** (climat) est l’ensemble des conditions météorologiques habituelles d’une zone sur une longue période.

**Erosion** is the gradual destruction or removal of soil by wind, water or other natural agents.

> **Traduction française :** **Erosion** (érosion) est la destruction ou le déplacement progressif du sol par le vent, l’eau ou d’autres agents naturels.

**Deforestation** is the action of cutting down many trees in a forest.

> **Traduction française :** **Deforestation** (déforestation) est l’action d’abattre de nombreux arbres dans une forêt.

**An ecosystem** is a group of living organisms that live and interact with one another in a specific environment.

> **Traduction française :** **An ecosystem** (écosystème) est un ensemble d’organismes vivants qui vivent et interagissent dans un environnement précis.

### 2. Explain causes and effects

**Rains are becoming less frequent because of deforestation. Some animals have disappeared from tropical forests due to poaching.**

> **Traduction française :** **Les pluies deviennent moins fréquentes à cause de la déforestation. Certains animaux ont disparu des forêts tropicales en raison du braconnage.**

Use **because of** and **due to** before a noun group. They answer the question *Why?*

> **Traduction française :** Utilise **because of** et **due to** avant un groupe nominal. Ils répondent à la question *Pourquoi ?*

**There are many timber companies in Ivorian forests; consequently, rains are becoming less frequent. Poaching has become lucrative; as a result, some animal species have disappeared.**

> **Traduction française :** **Il y a de nombreuses entreprises de bois dans les forêts ivoiriennes ; par conséquent, les pluies deviennent moins fréquentes. Le braconnage est devenu lucratif ; par conséquent, certaines espèces animales ont disparu.**

Use **consequently** and **as a result** to introduce an effect. Place a semicolon or full stop before these connectors when joining complete ideas.

> **Traduction française :** Utilise **consequently** et **as a result** pour introduire une conséquence. Place un point-virgule ou un point avant ces connecteurs lorsque tu relies des idées complètes.

| Cause | Connector | Effect |
|---|---|---|
| **Because of deforestation, rainfall can become less regular.** | because of + noun | **Traduction française :** À cause de la déforestation, les pluies peuvent devenir moins régulières. |
| **The ecosystem is damaged; consequently, some species lose their habitat.** | consequently | **Traduction française :** L’écosystème est endommagé ; par conséquent, certaines espèces perdent leur habitat. |

### 3. Formal letter or informal letter?

The communicative task requires a letter to the American Embassy. This is a **formal request letter**, not a personal letter to a friend.

> **Traduction française :** La tâche communicative demande une lettre à l’ambassade américaine. C’est une **lettre formelle de demande**, et non une lettre personnelle à un ami.

| Formal request letter | Informal letter |
|---|---|
| **Dear Sir or Madam,**<br><br>**Traduction française :** Madame, Monsieur, | **Dear Amadou,**<br><br>**Traduction française :** Cher Amadou, |
| Clear purpose and respectful request | Personal news and friendly tone |
| **I am writing on behalf of… / We would be grateful for…**<br><br>**Traduction française :** J’écris au nom de… / Nous vous serions reconnaissants de… | **How are you? / I am happy to tell you…**<br><br>**Traduction française :** Comment vas-tu ? / Je suis heureux de te dire… |
| **Yours faithfully,** when the recipient’s name is unknown | **Best wishes,** |

### 4. Plan the formal request before writing

**The English club has decided to start a tree-planting project to help preserve the environment. Write to the American Embassy to ask for help.**

> **Traduction française :** **Le club d’anglais a décidé de lancer un projet de plantation d’arbres pour contribuer à préserver l’environnement. Écris à l’ambassade américaine pour demander de l’aide.**

| Paragraph | What to write | French translation |
|---|---|---|
| **1. Sender and purpose** | Introduce yourself, your school and your English club. State why you are writing. | **Expéditeur et objectif :** présente-toi, présente ton école et ton club d’anglais. Indique pourquoi tu écris. |
| **2. The project** | Explain the tree-planting project and the environmental problem it addresses. | **Le projet :** explique le projet de plantation d’arbres et le problème environnemental qu’il traite. |
| **3. Requested help** | Ask clearly for material, seedlings, expertise, training or other realistic support. | **Aide demandée :** demande clairement du matériel, des plants, une expertise, une formation ou tout autre soutien réaliste. |
| **4. Benefits** | Show how the project can benefit the school and its environment. | **Bénéfices :** montre comment le projet peut bénéficier à l’école et à son environnement. |
| **5. Respectful closing** | Thank the Embassy and close formally. | **Clôture respectueuse :** remercie l’ambassade et termine formellement. |

### 5. Language bank for a clear request

| Function | English | French translation |
|---|---|---|
| Introduce purpose | **I am writing on behalf of the English Club of…** | **J’écris au nom du club d’anglais de…** |
| Explain cause | **Because of environmental degradation, our school wishes to act.** | **En raison de la dégradation environnementale, notre école souhaite agir.** |
| Request support | **We would be grateful for your support with…** | **Nous vous serions reconnaissants de votre soutien pour…** |
| Explain benefit | **As a result, students will learn to protect their environment.** | **Par conséquent, les élèves apprendront à protéger leur environnement.** |
| Close | **Thank you for considering our request. Yours faithfully,** | **Merci d’examiner notre demande. Veuillez agréer, Madame, Monsieur, l’expression de nos salutations distinguées.** |

### 6. Guided model — adapt with truthful local details

> **This is an original practice model. Replace bracketed details with truthful details from your school; do not invent an embassy decision, a donation or a partnership.**

> **Traduction française :** **Ceci est un modèle d’entraînement original. Remplace les détails entre crochets par des informations vraies de ton école ; n’invente pas une décision de l’ambassade, un don ou un partenariat.**

**Dear Sir or Madam,**

> **Traduction française :** **Madame, Monsieur,**

**I am writing on behalf of the English Club of [school name]. Our club is preparing a tree-planting project because we want to help protect the environment around our school.**

> **Traduction française :** **J’écris au nom du club d’anglais de [nom de l’école]. Notre club prépare un projet de plantation d’arbres parce que nous souhaitons contribuer à protéger l’environnement autour de notre école.**

**The project will encourage students to understand climate, rainfall, erosion and the importance of trees in an ecosystem. We plan to plant and care for trees in a suitable area of the school.**

> **Traduction française :** **Le projet encouragera les élèves à comprendre le climat, les précipitations, l’érosion et l’importance des arbres dans un écosystème. Nous prévoyons de planter et d’entretenir des arbres dans un espace approprié de l’école.**

**We would be grateful for support such as seedlings, gardening materials, advice from an environmental specialist or educational material. This help would make the project safer and more sustainable.**

> **Traduction française :** **Nous vous serions reconnaissants d’un soutien tel que des plants, du matériel de jardinage, des conseils d’un spécialiste de l’environnement ou du matériel éducatif. Cette aide rendrait le projet plus sûr et plus durable.**

**Consequently, students would learn practical responsibility and the school environment could become greener. Thank you for considering our request.**

> **Traduction française :** **Par conséquent, les élèves apprendraient une responsabilité concrète et l’environnement scolaire pourrait devenir plus vert. Merci d’examiner notre demande.**

**Yours faithfully,**

> **Traduction française :** **Veuillez agréer, Madame, Monsieur, l’expression de nos salutations distinguées.**

### 7. Final writing checklist

- **Have I introduced myself and the English club?**

  > **Traduction française :** Me suis-je présenté et ai-je présenté le club d’anglais ?

- **Have I specified the help needed and explained why it matters?**

  > **Traduction française :** Ai-je précisé l’aide demandée et expliqué pourquoi elle est importante ?

- **Have I stated benefits of the project with cause-and-effect language?**

  > **Traduction française :** Ai-je indiqué les bénéfices du projet avec une langue de cause et de conséquence ?

- **Have I used a formal greeting and closing?**

  > **Traduction française :** Ai-je utilisé une formule d’appel et une formule de clôture formelles ?

> **Writing synthesis:** a strong formal request is specific, respectful and realistic. It explains the project, asks clearly for support and shows the expected benefits without promising what has not been confirmed.

> **Traduction française :** **Synthèse d’écriture :** une bonne demande formelle est précise, respectueuse et réaliste. Elle explique le projet, demande clairement un soutien et montre les bénéfices attendus sans promettre ce qui n’a pas été confirmé.

## Pedagogical references

Reformulated and expanded from the supplied PDFs: **Unit 4 What the Future Holds — Reading for Comprehension**, “Africa’s fastest-growing cities”, adapted from Reuters (04 May 2016), and **Unit 4 What the Future Holds — Writing**, École numérique, Côte d’Ivoire.`;

const readingQuestions = [
  ["**Which language structure expresses an action completed before a future moment?**\n\n> **Traduction française :** Quelle structure exprime une action terminée avant un moment futur ?", ["will have + past participle\n— Traduction française : will have + participe passé", "will + infinitive only\n— Traduction française : will + infinitif seulement", "did + infinitive\n— Traduction française : did + infinitif"], ["will have + past participle\n— Traduction française : will have + participe passé"], "**The future perfect uses will have + past participle.**\n\n> **Traduction française :** Le futur parfait utilise will have + participe passé."],
  ["**What is a pull factor?**\n\n> **Traduction française :** Qu’est-ce qu’un facteur d’attraction ?", ["A reason that attracts people to a place\n— Traduction française : Une raison qui attire les personnes vers un lieu", "A reason for leaving a place\n— Traduction française : Une raison de quitter un lieu", "A grammar mistake\n— Traduction française : Une erreur de grammaire"], ["A reason that attracts people to a place\n— Traduction française : Une raison qui attire les personnes vers un lieu"], "**The text presents jobs, services and education as examples that can draw people toward cities.**\n\n> **Traduction française :** Le texte présente les emplois, les services et l’éducation comme des exemples qui peuvent attirer les personnes vers les villes."],
  ["**Which issue is the main focus of the reading text?**\n\n> **Traduction française :** Quel problème est au centre du texte de lecture ?", ["Urban population growth and its consequences\n— Traduction française : La croissance de la population urbaine et ses conséquences", "A sports tournament\n— Traduction française : Un tournoi sportif", "A personal letter\n— Traduction française : Une lettre personnelle"], ["Urban population growth and its consequences\n— Traduction française : La croissance de la population urbaine et ses conséquences"], "**The article examines rapid urbanisation, its drivers and possible social, economic and environmental outcomes.**\n\n> **Traduction française :** L’article examine l’urbanisation rapide, ses moteurs et ses conséquences sociales, économiques et environnementales possibles."],
  ["**How should you answer a true-or-false item?**\n\n> **Traduction française :** Comment dois-tu répondre à une affirmation vrai/faux ?", ["Compare key details and justify with the relevant line.\n— Traduction française : Comparer les détails clés et justifier avec la ligne pertinente.", "Guess from one familiar word.\n— Traduction française : Deviner à partir d’un mot connu.", "Ignore line references.\n— Traduction française : Ignorer les références de lignes."], ["Compare key details and justify with the relevant line.\n— Traduction française : Comparer les détails clés et justifier avec la ligne pertinente."], "**A changed country, number, cause or date can make a statement false, so evidence matters.**\n\n> **Traduction française :** Un pays, un nombre, une cause ou une date modifiés peuvent rendre une affirmation fausse ; la preuve est donc essentielle."],
];
const writingQuestions = [
  ["**Which connector introduces a cause before a noun phrase?**\n\n> **Traduction française :** Quel connecteur introduit une cause avant un groupe nominal ?", ["because of\n— Traduction française : à cause de", "consequently\n— Traduction française : par conséquent", "Yours faithfully\n— Traduction française : formule de clôture formelle"], ["because of\n— Traduction française : à cause de"], "**Use because of or due to before a noun phrase; use consequently or as a result to introduce an effect.**\n\n> **Traduction française :** Utilise because of ou due to avant un groupe nominal ; utilise consequently ou as a result pour introduire une conséquence."],
  ["**What type of letter does the Unit 4 task require?**\n\n> **Traduction française :** Quel type de lettre la tâche de l’Unit 4 demande-t-elle ?", ["A formal request letter\n— Traduction française : Une lettre formelle de demande", "An informal letter to a friend\n— Traduction française : Une lettre informelle à un ami", "A newspaper article\n— Traduction française : Un article de journal"], ["A formal request letter\n— Traduction française : Une lettre formelle de demande"], "**The letter is addressed to the American Embassy to request help for a school tree-planting project.**\n\n> **Traduction française :** La lettre est adressée à l’ambassade américaine pour demander de l’aide pour un projet scolaire de plantation d’arbres."],
  ["**Which information must the letter include?**\n\n> **Traduction française :** Quelle information la lettre doit-elle inclure ?", ["The support needed and the benefits of the project\n— Traduction française : L’aide demandée et les bénéfices du projet", "A sports result\n— Traduction française : Un résultat sportif", "An invented embassy decision\n— Traduction française : Une décision d’ambassade inventée"], ["The support needed and the benefits of the project\n— Traduction française : L’aide demandée et les bénéfices du projet"], "**The communication task asks learners to introduce themselves and the club, state the help needed and show the project’s benefits.**\n\n> **Traduction française :** La tâche de communication demande aux élèves de se présenter, de présenter le club, d’indiquer l’aide demandée et de montrer les bénéfices du projet."],
  ["**Which closing is appropriate when the recipient’s name is unknown?**\n\n> **Traduction française :** Quelle formule de clôture convient lorsque le nom du destinataire est inconnu ?", ["Yours faithfully,\n— Traduction française : Veuillez agréer, Madame, Monsieur…", "Best wishes,\n— Traduction française : Meilleurs vœux", "See you soon,\n— Traduction française : À bientôt"], ["Yours faithfully,\n— Traduction française : Veuillez agréer, Madame, Monsieur…"], "**A formal request to an unknown named recipient should use a formal closing.**\n\n> **Traduction française :** Une demande formelle adressée à un destinataire dont le nom est inconnu doit utiliser une formule de clôture formelle."],
];
const readingQuiz = [
  ["**What is a push factor?**\n\n> **Traduction française :** Qu’est-ce qu’un facteur de répulsion ?", "**It is a difficulty that pushes people away from a place.**\n\n> **Traduction française :** C’est une difficulté qui pousse les personnes à quitter un lieu.", [["A reason for leaving\n— Traduction française : Une raison de partir", true], ["A city attraction\n— Traduction française : Une attraction de la ville", false], ["A future perfect form\n— Traduction française : Une forme au futur parfait", false]]],
  ["**Which phrase is a future-perfect example?**\n\n> **Traduction française :** Quelle phrase est un exemple de futur parfait ?", "**“Will have doubled” expresses a completed action before a future time.**\n\n> **Traduction française :** « Will have doubled » exprime une action terminée avant un moment futur.", [["will have doubled\n— Traduction française : aura doublé", true], ["is doubling now\n— Traduction française : double maintenant", false], ["doubled yesterday\n— Traduction française : a doublé hier", false]]],
  ["**What does brain drain describe?**\n\n> **Traduction française :** Que décrit l’expression brain drain ?", "**It describes skilled people leaving to seek better opportunities elsewhere.**\n\n> **Traduction française :** Elle décrit le départ de personnes qualifiées vers de meilleures possibilités ailleurs.", [["Departure of skilled people\n— Traduction française : Départ de personnes qualifiées", true], ["A weather event\n— Traduction française : Un phénomène météorologique", false], ["A school subject\n— Traduction française : Une matière scolaire", false]]],
  ["**What is a tipping point in the unit vocabulary?**\n\n> **Traduction française :** Qu’est-ce qu’un point critique dans le vocabulaire de l’unité ?", "**It is a threshold where a situation can change rapidly or become difficult to reverse.**\n\n> **Traduction française :** C’est un seuil où une situation peut changer rapidement ou devenir difficile à inverser.", [["A critical threshold\n— Traduction française : Un seuil critique", true], ["A bus stop\n— Traduction française : Un arrêt de bus", false], ["A greeting\n— Traduction française : Une salutation", false]]],
];
const writingQuiz = [
  ["**Which word names the cutting down of many trees?**\n\n> **Traduction française :** Quel mot désigne l’abattage de nombreux arbres ?", "**Deforestation means cutting down many trees in a forest.**\n\n> **Traduction française :** Deforestation signifie abattre de nombreux arbres dans une forêt.", [["deforestation\n— Traduction française : déforestation", true], ["rainfall\n— Traduction française : précipitations", false], ["ecosystem\n— Traduction française : écosystème", false]]],
  ["**Which connector introduces an effect?**\n\n> **Traduction française :** Quel connecteur introduit une conséquence ?", "**Consequently and as a result introduce effects.**\n\n> **Traduction française :** Consequently et as a result introduisent des conséquences.", [["consequently\n— Traduction française : par conséquent", true], ["due to\n— Traduction française : en raison de", false], ["because of\n— Traduction française : à cause de", false]]],
  ["**What should a formal request state clearly?**\n\n> **Traduction française :** Que doit indiquer clairement une demande formelle ?", "**It should state the project, the support requested and the expected benefits.**\n\n> **Traduction française :** Elle doit indiquer le projet, l’aide demandée et les bénéfices attendus.", [["Project, support and benefits\n— Traduction française : Projet, aide et bénéfices", true], ["Only a friendly greeting\n— Traduction française : Seulement une salutation amicale", false], ["Unverified promises\n— Traduction française : Des promesses non vérifiées", false]]],
  ["**Why should a request avoid invented partnership results?**\n\n> **Traduction française :** Pourquoi une demande doit-elle éviter des résultats de partenariat inventés ?", "**A formal letter must remain truthful and should not promise or claim support that has not been confirmed.**\n\n> **Traduction française :** Une lettre formelle doit rester vraie et ne doit pas promettre ou affirmer un soutien qui n’a pas été confirmé.", [["To remain truthful\n— Traduction française : Pour rester véridique", true], ["To make the letter longer\n— Traduction française : Pour rendre la lettre plus longue", false], ["To avoid a closing\n— Traduction française : Pour éviter une formule de clôture", false]]],
];

const exerciseQuestionSql = (variable, questions) => `insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values\n${questions.map(([prompt, options, correct, explanation], index) => `      (${variable},${sqlText("single_choice")},${sqlText(prompt)},${jsonbArray(options)},${jsonbArray(correct)},${sqlText(explanation)},${(index + 1) * 10})`).join(",\n")};`;
const quizSql = (variable, title, description, rows, order) => {
  const questions = rows.map(([question, explanation], index) => `      (${variable},${sqlText(question)},${sqlText(explanation)},'single_choice',${(index + 1) * 10},1,true)`).join(",\n");
  const answers = rows.flatMap(([, , choices], index) => choices.map(([answer, correct], answerIndex) => `        (${(index + 1) * 10},${sqlText(answer)},${correct},${(answerIndex + 1) * 10})`)).join(",\n");
  return `insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active)
    values (target.subject_id,target.level_id,target.series_id,target.offering_id,chapter_uuid,lesson_uuid,${sqlText(title)},${sqlText(description)},'medium',15,${order},false,false)
    returning id into ${variable};
    with inserted_questions as (
      insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
${questions}
      returning id,display_order
    )
    insert into public.quiz_answers (question_id,answer,is_correct,display_order)
    select inserted_questions.id,answers.answer,answers.is_correct,answers.display_order
    from inserted_questions join (values
${answers}
    ) as answers(question_order,answer,is_correct,display_order) on answers.question_order=inserted_questions.display_order;`;
};

const migration = `-- Lot Anglais Terminale Unit 4 What the Future Holds : Reading et Writing bilingues.
-- Toutes les ressources créées sont inactives et non publiées.
do $english_terminal_unit4_content$
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
  unit_title constant text := 'UNIT 4 WHAT THE FUTURE HOLDS';
begin
  select count(*) into target_count from public.course_subject_offerings where id in (${offerings.map(sqlText).join(", ")});
  if target_count <> 4 then raise exception 'Les quatre offres Anglais Terminale A1/A2/C/D attendues sont requises ; transaction annulée.'; end if;
  if exists (select 1 from public.lessons le join public.chapters ch on ch.id=le.chapter_id where ch.subject_offering_id in (${offerings.map(sqlText).join(", ")}) and le.title=unit_title and (coalesce(char_length(le.content),0)>0 or exists (select 1 from public.exercises e where e.lesson_id=le.id) or exists (select 1 from public.quizzes q where q.lesson_id=le.id))) then raise exception 'Une leçon Unit 4 cible contient déjà du contenu, un exercice ou un quiz ; ré-audit requis.'; end if;
  for target in select o.id as offering_id,o.subject_id,o.level_id,o.series_id,se.name as series_name from public.course_subject_offerings o join public.series se on se.id=o.series_id where o.id in (${offerings.map(sqlText).join(", ")}) order by se.name loop
    select id into chapter_uuid from public.chapters where subject_offering_id=target.offering_id and title='PROGRESSION TERMINALE A' limit 1;
    if chapter_uuid is null and target.series_name in ('C','D') then select id into chapter_uuid from public.chapters where subject_offering_id=target.offering_id and title='PROGRESSIONS TERMINALES C ET D — Anglais' limit 1; end if;
    if chapter_uuid is null then raise exception 'Le chapitre Anglais Terminale attendu est absent pour la série %.',target.series_name; end if;
    select id,content into lesson_uuid,current_content from public.lessons where chapter_id=chapter_uuid and title=unit_title limit 1;
    if lesson_uuid is null and target.offering_id=${sqlText(a2OfferingId)} then insert into public.lessons (chapter_id,title,display_order,is_active) values (chapter_uuid,unit_title,40,false) returning id,content into lesson_uuid,current_content; end if;
    if lesson_uuid is null then raise exception 'La structure Unit 4 est absente pour la série %.',target.series_name; end if;
    select count(*) into current_exercises from public.exercises where lesson_id=lesson_uuid; select count(*) into current_quizzes from public.quizzes where lesson_id=lesson_uuid;
    if coalesce(char_length(current_content),0)>0 or current_exercises>0 or current_quizzes>0 then raise exception 'La leçon Unit 4 de la série % n’est pas vide ; écrasement interdit.',target.series_name; end if;
    update public.lessons set description='Unit 4 What the Future Holds : urbanisation, futur parfait, environnement et lettre formelle de demande bilingue.',content=${sqlText(lessonContent)},is_active=false where id=lesson_uuid;
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order) values (target.subject_id,target.level_id,target.series_id,chapter_uuid,lesson_uuid,'Exercise 1 — Reading: future urbanisation and evidence\n\n> **Traduction française :** Exercice 1 — Lecture : urbanisation future et preuve',${sqlText("**Answer from the text and apply the future-perfect and evidence-reading methods.**\n\n> **Traduction française :** Réponds à partir du texte et applique les méthodes de futur parfait et de lecture fondée sur les preuves.")},${sqlText("**The correction explains the future perfect, pull/push factors and proof by line reference.**\n\n> **Traduction française :** La correction explique le futur parfait, les facteurs d’attraction/répulsion et la preuve par référence de ligne.")},'single_choice','medium',${sqlText("**Choose the answer supported by Unit 4 Reading.**\n\n> **Traduction française :** Choisis la réponse appuyée par le Reading de l’Unit 4.")},${sqlText("**Read each bilingual explanation before moving on.**\n\n> **Traduction française :** Lis chaque explication bilingue avant de continuer.")},false,false,25,10) returning id into exercise_reading_uuid;
${exerciseQuestionSql("exercise_reading_uuid", readingQuestions)}
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order) values (target.subject_id,target.level_id,target.series_id,chapter_uuid,lesson_uuid,'Exercise 2 — Writing: causes, effects and a formal request\n\n> **Traduction française :** Exercice 2 — Écriture : causes, conséquences et demande formelle',${sqlText("**Use environment vocabulary and write a respectful request for a tree-planting project.**\n\n> **Traduction française :** Utilise le vocabulaire de l’environnement et rédige une demande respectueuse pour un projet de plantation d’arbres.")},${sqlText("**The correction distinguishes cause/effect connectors and formal-letter components.**\n\n> **Traduction française :** La correction distingue les connecteurs de cause/conséquence et les éléments d’une lettre formelle.")},'single_choice','medium',${sqlText("**Plan the sender, project, support requested, benefits and formal closing before drafting.**\n\n> **Traduction française :** Planifie l’expéditeur, le projet, l’aide demandée, les bénéfices et la clôture formelle avant de rédiger.")},${sqlText("**A formal letter stays truthful and does not claim a donation or partnership that has not been confirmed.**\n\n> **Traduction française :** Une lettre formelle reste vraie et ne prétend pas qu’un don ou partenariat a été confirmé lorsqu’il ne l’est pas.")},false,false,35,20) returning id into exercise_writing_uuid;
${exerciseQuestionSql("exercise_writing_uuid", writingQuestions)}
${quizSql("quiz_reading_uuid", "Bilingual quiz 1 — Reading: What the Future Holds\n\n> **Traduction française :** Quiz bilingue 1 — Lecture : ce que l’avenir nous réserve", "**Check future perfect, urbanisation vocabulary and comprehension methods.**\n\n> **Traduction française :** Vérifie le futur parfait, le vocabulaire de l’urbanisation et les méthodes de compréhension.", readingQuiz, 10)}
${quizSql("quiz_writing_uuid", "Bilingual quiz 2 — Writing: environment and formal request\n\n> **Traduction française :** Quiz bilingue 2 — Écriture : environnement et demande formelle", "**Check causes, effects, environmental vocabulary and the formal request structure.**\n\n> **Traduction française :** Vérifie les causes, les conséquences, le vocabulaire environnemental et la structure de la demande formelle.", writingQuiz, 20)}
  end loop;
end
$english_terminal_unit4_content$;\n`;

writeFileSync(migrationPath, migration, "utf8");
writeFileSync(payloadPath, `${JSON.stringify({ project_id: "nnshioowwniursnozicg", name: "english_terminal_unit4_future_holds_bilingual_drafts", query: migration }, null, 2)}\n`, "utf8");
console.log(migrationPath);
console.log(payloadPath);
