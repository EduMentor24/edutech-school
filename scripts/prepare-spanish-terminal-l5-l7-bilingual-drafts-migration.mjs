import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const migrationPath = resolve(
  "supabase/migrations/20260822_espagnol_terminale_guinee_questions_decrire_bilingual_drafts.sql",
);
const applyInputPath = resolve(
  "supabase/migrations/20260822_espagnol_terminale_guinee_questions_decrire_bilingual_drafts.apply.json",
);

const offeringIds = [
  "942aacbc-1f0c-4eea-9f61-04560b3f3578",
  "48880a58-de13-4485-a45d-ab716b4ca645",
  "0e028469-a443-4b7d-9ed9-6a675193fc24",
  "d496a111-1324-4f92-b557-f5bb402f6bac",
];

const sqlText = (value) => `'${String(value).replaceAll("'", "''")}'`;
const jsonArray = (values) => `jsonb_build_array(${values.map(sqlText).join(", ")})`;
const bilingual = (spanish, french) => `${spanish}\n\n> **Traduction française :** ${french}`;
const bilingualOption = (spanish, french) => `${spanish}\n— Traduction française : ${french}`;

const lessons = [
  {
    chapter: "world",
    title:
      "Leçon 5 : Connaître les réalités historiques, politiques, économiques et sociolinguistiques de Guinée équatoriale.",
    description:
      "Indépendance, plurilinguisme, ressources citées dans le support et expression de la continuation avec seguir ou continuar.",
    content: String.raw`## Conocer las realidades históricas, políticas, económicas y sociolingüísticas de Guinea Ecuatorial

> **Traduction française :** Connaître les réalités historiques, politiques, économiques et sociolinguistiques de Guinée équatoriale.

> **Objectif bilingue :** comprendre un document oral sur la Guinée équatoriale, réemployer le vocabulaire du plurilinguisme et exprimer la continuation d’une action.

## 1. Situación de aprendizaje

> **Traduction française :** Situation d’apprentissage.

**Guinea Ecuatorial obtuvo su independencia respecto a España el 12 de octubre de 1968, pero mantiene el idioma español como lengua oficial junto al francés.**

> **Traduction française :** La Guinée équatoriale a obtenu son indépendance vis-à-vis de l’Espagne le 12 octobre 1968, mais elle conserve l’espagnol comme langue officielle avec le français.

Le support demande d’identifier, d’utiliser et d’échanger des informations historiques, politiques, économiques et sociolinguistiques. À l’écoute, relève d’abord les repères de date, les langues citées et la ressource économique mentionnée, puis organise ta réponse.

## 2. Vocabulario esencial

> **Traduction française :** Vocabulaire essentiel.

| Español | Traduction française et emploi |
|---|---|
| **la metrópoli** | La métropole. *Francia era la metrópoli de sus colonias.*<br><br>**Traduction française :** La France était la métropole de ses colonies. |
| **una bolsa de petróleo o de gas** | Une poche de pétrole ou de gaz ; le support précise que le pétrole est extrait là où de telles poches sont découvertes. |
| **una lengua nativa** | Une langue native. *El agni, el gouro y el djamala son lenguas nativas de Costa de Marfil.*<br><br>**Traduction française :** L’agni, le gouro et le djamala sont des langues natives de Côte d’Ivoire. |
| **el petróleo / el gas** | Le pétrole / le gaz. |
| **plurilingüe** | Plurilingue : qui réunit ou emploie plusieurs langues. |

## 3. Comprender las realidades de Guinea Ecuatorial

> **Traduction française :** Comprendre les réalités de la Guinée équatoriale.

**Guinea Ecuatorial consiguió su independencia de España en 1968. Es uno de los países más pequeños de África, pero uno de los más ricos de África subsahariana gracias a la explotación del petróleo y del gas.**

> **Traduction française :** La Guinée équatoriale a obtenu son indépendance de l’Espagne en 1968. C’est l’un des plus petits pays d’Afrique, mais l’un des plus riches d’Afrique subsaharienne grâce à l’exploitation du pétrole et du gaz.

Le document indique que l’espagnol est langue officielle et cite aussi le français et le portugais comme langues coofficielles. Il mentionne également diverses langues natives. Pour répondre fidèlement, distingue les langues européennes citées des langues maternelles mentionnées par le support.

**El país sufrió una dictadura con el primer presidente, Macías Nguema, hasta el golpe de estado de Obiang Nguema en 1979.**

> **Traduction française :** Le pays a subi une dictature sous son premier président, Macías Nguema, jusqu’au coup d’État d’Obiang Nguema en 1979.

> **Méthode :** lors d’une restitution, relie chaque information à une rubrique : histoire (indépendance et période citée), langues (officielles et natives), économie (pétrole et gaz). N’ajoute aucun renseignement qui n’est pas donné par le document.

## 4. Gramática: seguir y continuar + gerundio

> **Traduction française :** Grammaire : suivre et continuer + gérondif.

**El español siguió siendo la lengua utilizada para dictar las leyes.**

> **Traduction française :** L’espagnol a continué d’être la langue utilisée pour rédiger les lois.

La règle du support emploie **seguir + gerundio** pour exprimer une action qui se poursuit. La même idée peut être exprimée avec **continuar + gerundio**.

| Forma en español | Traduction française |
|---|---|
| **El francés sigue siendo la lengua oficial de Costa de Marfil.** | Le français continue d’être la langue officielle de la Côte d’Ivoire. |
| **Después de cinco horas, vosotros seguís estudiando.** | Après cinq heures, vous continuez à étudier. |
| **Ana continúa mirando la tele desde la mañana.** | Ana continue à regarder la télévision depuis le matin. |

> **Attention :** après *seguir* ou *continuar*, utilise le gérondif : *estudiando*, *mirando*, *pidiendo*, *yendo*.

## 5. Producción guiada

> **Traduction française :** Production guidée.

**Guinea Ecuatorial es un país plurilingüe: conviven lenguas oficiales y varias lenguas nativas.**

> **Traduction française :** La Guinée équatoriale est un pays plurilingue : des langues officielles et plusieurs langues natives y coexistent.

**Los europeos siguen pidiendo ayuda para los enfermos.**

> **Traduction française :** Les Européens continuent de demander de l’aide pour les malades.

> **Synthèse :** cette leçon associe des repères sur la Guinée équatoriale au vocabulaire du plurilinguisme et des ressources économiques. Elle permet aussi d’exprimer la poursuite d’une action avec *seguir* ou *continuar* suivis du gérondif.

## Référence pédagogique

Contenu reformulé et structuré à partir du PDF fourni : **« Connaître les réalités historiques, politiques, économiques et sociolinguistiques de Guinée Équatoriale »**, Espagnol, Terminale, Côte d’Ivoire — École numérique.`,
    exerciseA: {
      title: "Exercice 1 — Guinea Ecuatorial: vocabulario y comprensión",
      statement: bilingual(
        "Completa y explica el vocabulario del plurilingüismo y de los recursos citados en el documento.",
        "Complète et explique le vocabulaire du plurilinguisme et des ressources citées dans le document.",
      ),
      solution: bilingual(
        "La corrección distingue metrópoli, bolsa de petróleo y lengua nativa según la ficha.",
        "La correction distingue metrópole, poche de pétrole et langue native selon la fiche.",
      ),
      questions: [
        ["single_choice", bilingual("¿Qué significa *una lengua nativa*?", "Que signifie *una lengua nativa* ?"), [bilingualOption("Una lengua originaria de una comunidad", "Une langue originaire d’une communauté"), bilingualOption("Una ley escrita", "Une loi écrite"), bilingualOption("Una moneda europea", "Une monnaie européenne")], [bilingualOption("Una lengua originaria de una comunidad", "Une langue originaire d’une communauté")], bilingual("El vocabulario del documento presenta el agni, el gouro y el djamala como lenguas nativas.", "Le vocabulaire du document présente l’agni, le gouro et le djamala comme des langues natives."), 10],
        ["single_choice", bilingual("¿Qué recurso económico cita la ficha para Guinea Ecuatorial?", "Quelle ressource économique la fiche cite-t-elle pour la Guinée équatoriale ?"), [bilingualOption("El petróleo y el gas", "Le pétrole et le gaz"), bilingualOption("El algodón únicamente", "Le coton uniquement"), bilingualOption("La pesca solamente", "La pêche seulement")], [bilingualOption("El petróleo y el gas", "Le pétrole et le gaz")], bilingual("El resumen menciona la explotación del petróleo y del gas.", "Le résumé mentionne l’exploitation du pétrole et du gaz."), 20],
        ["true_false", bilingual("Guinea Ecuatorial es un país plurilingüe según el documento.", "La Guinée équatoriale est un pays plurilingue selon le document."), [bilingualOption("Verdadero", "Vrai"), bilingualOption("Falso", "Faux")], [bilingualOption("Verdadero", "Vrai")], bilingual("El soporte menciona lenguas oficiales y varias lenguas nativas.", "Le support mentionne des langues officielles et plusieurs langues natives."), 30],
      ],
    },
    exerciseB: {
      title: "Exercice 2 — Seguir y continuar + gerundio",
      statement: bilingual(
        "Expresa la continuación de la acción con *seguir* o *continuar* y un gerundio.",
        "Exprime la continuation de l’action avec *seguir* ou *continuar* et un gérondif.",
      ),
      solution: bilingual(
        "La corrección utiliza seguir o continuar seguido de estudiando, mirando, pidiendo o yendo.",
        "La correction utilise seguir ou continuar suivi de estudiando, mirando, pidiendo ou yendo.",
      ),
      questions: [
        ["single_choice", bilingual("Completa: Después de cinco horas, vosotros ___ estudiando.", "Complète : Après cinq heures, vous ___ à étudier."), [bilingualOption("seguís", "continuez"), bilingualOption("seguís estudiar", "continuez étudier"), bilingualOption("seguir", "continuer")], [bilingualOption("seguís", "continuez")], bilingual("Después de *seguís*, la acción continúa con el gerundio *estudiando*.", "Après *seguís*, l’action se poursuit avec le gérondif *estudiando* ."), 10],
        ["single_choice", bilingual("¿Qué forma expresa una acción que continúa?", "Quelle forme exprime une action qui continue ?"), [bilingualOption("seguir + gerundio", "seguir + gérondif"), bilingualOption("seguir + infinitivo", "seguir + infinitif"), bilingualOption("tener + sustantivo", "tener + nom")], [bilingualOption("seguir + gerundio", "seguir + gérondif")], bilingual("La regla de la ficha usa *seguir + gerundio* para expresar la continuación.", "La règle de la fiche utilise *seguir + gérondif* pour exprimer la continuation."), 20],
        ["true_false", bilingual("*Continuar + gerundio* puede expresar la misma idea de continuación.", "*Continuar + gérondif* peut exprimer la même idée de continuation."), [bilingualOption("Verdadero", "Vrai"), bilingualOption("Falso", "Faux")], [bilingualOption("Verdadero", "Vrai")], bilingual("La nota de la ficha presenta *continuar + gerundio* como otra posibilidad.", "La note de la fiche présente *continuar + gérondif* comme une autre possibilité."), 30],
      ],
    },
    quiz: {
      title: "Quiz bilingue — Guinea Ecuatorial",
      questions: [
        [bilingual("¿En qué año consiguió Guinea Ecuatorial su independencia de España?", "En quelle année la Guinée équatoriale a-t-elle obtenu son indépendance de l’Espagne ?"), bilingual("El resumen indica el año 1968.", "Le résumé indique l’année 1968."), [bilingualOption("En 1968", "En 1968"), bilingualOption("En 1979", "En 1979")], 10],
        [bilingual("¿Qué lengua africana se mantiene como oficial según la ficha?", "Quelle langue est maintenue comme officielle selon la fiche ?"), bilingual("El soporte indica que el español es lengua oficial.", "Le support indique que l’espagnol est langue officielle."), [bilingualOption("El español", "L’espagnol"), bilingualOption("El alemán", "L’allemand")], 20],
        [bilingual("¿Qué significa *la metrópoli* en el ejemplo estudiado?", "Que signifie *la metrópoli* dans l’exemple étudié ?"), bilingual("La ficha contrapone la metrópoli y la colonia.", "La fiche oppose la métropole et la colonie."), [bilingualOption("El país que domina colonias", "Le pays qui domine des colonies"), bilingualOption("Una lengua nativa", "Une langue native")], 30],
        [bilingual("¿Qué forma completa correctamente la idea de continuación?", "Quelle forme complète correctement l’idée de continuation ?"), bilingual("La lección utiliza seguir o continuar con un gerundio.", "La leçon utilise seguir ou continuar avec un gérondif."), [bilingualOption("sigue estudiando", "continue à étudier"), bilingualOption("sigue estudiar", "continue étudier")], 40],
      ],
    },
  },
  {
    chapter: "exchange",
    title: "Leçon 6 : Poser des questions.",
    description:
      "Expressions interrogatives, technique interrogative et préparation de dialogues d’échange d’information.",
    content: String.raw`## Hacer preguntas

> **Traduction française :** Poser des questions.

> **Objectif bilingue :** identifier des expressions pour interroger, transformer une information en question et préparer un échange oral.

## 1. Situación de aprendizaje

> **Traduction française :** Situation d’apprentissage.

**Los miembros del club de español se ejercitan a identificar las expresiones para preguntar, a utilizarlas y a preparar un intercambio con el Embajador de España.**

> **Traduction française :** Les membres du club d’espagnol s’exercent à identifier les expressions pour poser des questions, à les utiliser et à préparer un échange avec l’ambassadeur d’Espagne.

Lors d’un échange oral, prépare tes questions avant de parler. Commence par choisir ce que tu veux connaître : une personne, un lieu, une date, une quantité ou une raison.

## 2. Vocabulario esencial

> **Traduction française :** Vocabulaire essentiel.

| Español | Traduction française et emploi |
|---|---|
| **preguntar** | Demander, poser une question. *¿Qué vimos la vez pasada?*<br><br>**Traduction française :** Qu’avons-nous vu la dernière fois ? |
| **un periodista** | Un journaliste ; son travail consiste à enquêter et à informer la population. |
| **una entrevista** | Une interview, un entretien. Pendant une interview, le journaliste pose des questions à ses invités. |
| **una pregunta** | Une question. |
| **una respuesta** | Une réponse. |

## 3. La técnica interrogativa

> **Traduction française :** La technique interrogative.

**¿Qué es más complicado?**

> **Traduction française :** Qu’est-ce qui est le plus compliqué ?

Le support présente plusieurs façons d’introduire une interrogation. Elles n’ont pas le même ton, mais elles servent toutes à rechercher une information.

| Expresión en español | Traduction française | Rôle présenté dans la fiche |
|---|---|---|
| **¿Por qué un negocio de implantes de cabello?** | Pourquoi une entreprise de greffes de cheveux ? | Oración interrogativa : question directe. |
| **Me pregunto qué es más complicado.** | Je me demande ce qui est le plus compliqué. | Oración declarativa : interrogation introduite dans une déclaration. |
| **Acaso disfruta con el fútbol.** | Peut-être apprécie-t-il le football. | Oración dubitativa : interrogation ou doute présenté par le support. |
| **Ojalá sea más fácil elegir un negocio que un club.** | Pourvu qu’il soit plus facile de choisir une entreprise qu’un club. | Oración optativa : souhait présenté par le support. |

## 4. Formular preguntas

> **Traduction française :** Formuler des questions.

| Palabra interrogativa | Traduction française | Exemple bilingue |
|---|---|---|
| **¿Qué?** | Quoi ? / Que ? | **¿Qué estudias?**<br><br>**Traduction française :** Qu’étudies-tu ? |
| **¿Cómo?** | Comment ? | **¿Cómo te llamas?**<br><br>**Traduction française :** Comment t’appelles-tu ? |
| **¿Por qué?** | Pourquoi ? | **¿Por qué quieres ser presidente?**<br><br>**Traduction française :** Pourquoi veux-tu être président ? |
| **¿Cuándo?** | Quand ? | **¿Cuándo es tu cumpleaños?**<br><br>**Traduction française :** Quand est ton anniversaire ? |
| **¿Cuánto?** | Combien ? | **¿Cuánto cuesta esta blusa?**<br><br>**Traduction française :** Combien coûte ce chemisier ? |
| **¿Cuál?** | Lequel ? / Quelle ? | **¿Cuál es la profesión de Manuel?**<br><br>**Traduction française :** Quelle est la profession de Manuel ? |

> **Méthode :** repère le mot manquant dans la réponse. S’il s’agit d’une date, emploie *cuándo* ; d’un prix ou d’une quantité, *cuánto* ; d’un choix ou d’une identité, *cuál*.

## 5. Producción guiada

> **Traduction française :** Production guidée.

**¿De quién es la blusa de color rojo?**

> **Traduction française :** À qui appartient le chemisier rouge ?

**Me pregunto a qué hora abre el almacén del barrio.**

> **Traduction française :** Je me demande à quelle heure ouvre le magasin du quartier.

> **Synthèse :** la leçon fournit le vocabulaire de l’interview et les principaux interrogatifs. Elle aide à choisir une question directe ou une formulation introduite par *me pregunto*, en fonction de l’information recherchée.

## Référence pédagogique

Contenu reformulé et structuré à partir du PDF fourni : **« Poser des questions »**, Espagnol, Terminale, Côte d’Ivoire — École numérique.`,
    exerciseA: {
      title: "Exercice 1 — Interrogativos y vocabulario",
      statement: bilingual(
        "Completa las preguntas con el interrogativo adecuado y reconoce el vocabulario de la entrevista.",
        "Complète les questions avec l’interrogatif approprié et reconnais le vocabulaire de l’interview.",
      ),
      solution: bilingual(
        "La corrección distingue cuándo, cuánto y cuál según la información buscada.",
        "La correction distingue cuándo, cuánto et cuál selon l’information recherchée.",
      ),
      questions: [
        ["single_choice", bilingual("¿___ es tu cumpleaños?", "___ est ton anniversaire ?"), [bilingualOption("Cuándo", "Quand"), bilingualOption("Cuánto", "Combien"), bilingualOption("Cuál", "Lequel / quelle")], [bilingualOption("Cuándo", "Quand")], bilingual("Para preguntar por una fecha, la ficha utiliza *cuándo*.", "Pour interroger sur une date, la fiche utilise *cuándo* ."), 10],
        ["single_choice", bilingual("¿___ cuesta esta blusa?", "___ coûte ce chemisier ?"), [bilingualOption("Cuánto", "Combien"), bilingualOption("Dónde", "Où"), bilingualOption("Quién", "Qui")], [bilingualOption("Cuánto", "Combien")], bilingual("Para preguntar por un precio, la ficha utiliza *cuánto*.", "Pour interroger sur un prix, la fiche utilise *cuánto* ."), 20],
        ["true_false", bilingual("Un periodista hace investigaciones y entrevistas.", "Un journaliste mène des enquêtes et des interviews."), [bilingualOption("Verdadero", "Vrai"), bilingualOption("Falso", "Faux")], [bilingualOption("Verdadero", "Vrai")], bilingual("El vocabulario define el trabajo del periodista de esta manera.", "Le vocabulaire définit le travail du journaliste de cette manière."), 30],
      ],
    },
    exerciseB: {
      title: "Exercice 2 — Transformar y formular preguntas",
      statement: bilingual(
        "Transforma una información en una pregunta directa o en una formulación con *me pregunto*.",
        "Transforme une information en question directe ou en formulation avec *me pregunto*.",
      ),
      solution: bilingual(
        "La corrección reproduce preguntas sobre una persona, una hora y una razón.",
        "La correction reproduit des questions sur une personne, une heure et une raison.",
      ),
      questions: [
        ["single_choice", bilingual("La blusa de color rojo es de Miguel. ¿Qué pregunta corresponde?", "Le chemisier rouge est à Miguel. Quelle question correspond ?"), [bilingualOption("¿De quién es la blusa de color rojo?", "À qui appartient le chemisier rouge ?"), bilingualOption("¿Cuándo es la blusa?", "Quand est le chemisier ?"), bilingualOption("¿Cuánto es Miguel?", "Combien est Miguel ?")], [bilingualOption("¿De quién es la blusa de color rojo?", "À qui appartient le chemisier rouge ?")], bilingual("La respuesta del soporte pregunta por el poseedor con *¿De quién...?*.", "La réponse du support demande le possesseur avec *¿De quién...?* ."), 10],
        ["single_choice", bilingual("¿Qué forma introduce una interrogación en una declaración?", "Quelle forme introduit une interrogation dans une déclaration ?"), [bilingualOption("Me pregunto...", "Je me demande..."), bilingualOption("Porque...", "Parce que..."), bilingualOption("Sin embargo...", "Cependant...")], [bilingualOption("Me pregunto...", "Je me demande...")], bilingual("La ficha presenta *Me pregunto* como oración declarativa interrogativa.", "La fiche présente *Me pregunto* comme une phrase déclarative interrogative."), 20],
        ["true_false", bilingual("*¿Por qué?* sirve para preguntar por una razón.", "*¿Por qué ?* sert à demander une raison."), [bilingualOption("Verdadero", "Vrai"), bilingualOption("Falso", "Faux")], [bilingualOption("Verdadero", "Vrai")], bilingual("La expresión interrogativa *¿Por qué?* pide una causa o razón.", "L’expression interrogative *¿Por qué ?* demande une cause ou une raison."), 30],
      ],
    },
    quiz: {
      title: "Quiz bilingue — Hacer preguntas",
      questions: [
        [bilingual("¿Qué interrogativo pregunta por una cantidad o un precio?", "Quel interrogatif demande une quantité ou un prix ?"), bilingual("La ficha utiliza *cuánto* para este tipo de información.", "La fiche utilise *cuánto* pour ce type d’information."), [bilingualOption("Cuánto", "Combien"), bilingualOption("Cuándo", "Quand")], 10],
        [bilingual("¿Qué es una entrevista?", "Qu’est-ce qu’une interview ?"), bilingual("En una entrevista, el periodista pregunta a sus invitados.", "Dans une interview, le journaliste pose des questions à ses invités."), [bilingualOption("Un intercambio de preguntas y respuestas", "Un échange de questions et de réponses"), bilingualOption("Una lengua nativa", "Une langue native")], 20],
        [bilingual("¿Qué pregunta permite saber la profesión de Manuel?", "Quelle question permet de connaître la profession de Manuel ?"), bilingual("La actividad utiliza *¿Cuál es la profesión de Manuel?*.", "L’activité utilise *¿Cuál es la profesión de Manuel ?* ."), [bilingualOption("¿Cuál es la profesión de Manuel?", "Quelle est la profession de Manuel ?"), bilingualOption("¿Cuándo es Manuel?", "Quand est Manuel ?")], 30],
        [bilingual("¿Qué expresión presenta la ficha para expresar un deseo?", "Quelle expression la fiche présente-t-elle pour exprimer un souhait ?"), bilingual("El soporte incluye la oración optativa con *Ojalá*.", "Le support inclut la phrase optative avec *Ojalá* ."), [bilingualOption("Ojalá...", "Pourvu que..."), bilingualOption("Me llamo...", "Je m’appelle...")], 40],
      ],
    },
  },
  {
    chapter: "exchange",
    title: "Leçon 7 : Décrire.",
    description:
      "Description physique, morale et de lieux, avec comparatifs réguliers et irréguliers.",
    content: String.raw`## Describir

> **Traduction française :** Décrire.

> **Objectif bilingue :** décrire une personne, un lieu ou un objet en mobilisant un vocabulaire précis et les comparatifs étudiés.

## 1. Situación de aprendizaje

> **Traduction française :** Situation d’apprentissage.

**Los miembros del club de español identifican las expresiones para describir, las utilizan e intercambian informaciones sobre los objetos tradicionales observados.**

> **Traduction française :** Les membres du club d’espagnol identifient les expressions pour décrire, les utilisent et échangent des informations sur les objets traditionnels observés.

Pour décrire clairement, distingue ce que l’on voit (aspect physique, taille, couleur, forme) de ce que l’on apprécie ou ressent (qualités morales, comportement, impression).

## 2. Vocabulario para describir

> **Traduction française :** Vocabulaire pour décrire.

| Español | Traduction française et emploi |
|---|---|
| **el retrato** | Le portrait. *La víctima tiene que hacer un buen retrato de su agresor.*<br><br>**Traduction française :** La victime doit faire un bon portrait de son agresseur. |
| **ser feo / ser guapo** | Être laid / être beau. |
| **el tamaño** | La taille, les dimensions. *La Basílica Nuestra Señora de la Paz de Yamoussoukro es de tamaño impresionante.*<br><br>**Traduction française :** La basilique Notre-Dame-de-la-Paix de Yamoussoukro est de taille impressionnante. |
| **alto / bajo** | Grand / petit. |
| **delgado / gordo** | Mince / gros. |
| **amable / tímido / simpático** | Aimable / timide / sympathique. |

## 3. Comprender un retrato

> **Traduction française :** Comprendre un portrait.

**En el texto *Tío Lucas*, el autor describe a tío Lucas como un hombre muy feo pero que tiene grandes valores morales.**

> **Traduction française :** Dans le texte *Tío Lucas*, l’auteur décrit l’oncle Lucas comme un homme très laid mais doté de grandes valeurs morales.

Le contraste important dans ce portrait oppose l’apparence physique et les qualités morales. Une description complète peut donc présenter l’aspect extérieur, puis les sentiments, le caractère ou le comportement.

## 4. Gramática: los comparativos

> **Traduction française :** Grammaire : les comparatifs.

**El tío Lucas era más feo que Picio.**

> **Traduction française :** L’oncle Lucas était plus laid que Picio.

| Forma en español | Traduction française | Exemple bilingue |
|---|---|---|
| **más ... que** | plus ... que | **Abidjan es más grande que Bouaké.**<br><br>**Traduction française :** Abidjan est plus grande que Bouaké. |
| **tan ... como** | aussi ... que | **Juan es tan simpático como Manuel.**<br><br>**Traduction française :** Juan est aussi sympathique que Manuel. |
| **menos ... que** | moins ... que | **Tengo menos problemas que tú.**<br><br>**Traduction française :** J’ai moins de problèmes que toi. |

Le document propose aussi des comparatifs irréguliers : **bueno → mejor**, **malo → peor**, **grande → mayor**, **pequeño → menor**.

**Mi nivel de lengua es mejor que el tuyo.**

> **Traduction française :** Mon niveau de langue est meilleur que le tien.

> **Méthode :** dans une comparaison, repère les deux éléments comparés, puis choisis *más*, *tan* ou *menos*. Pour les formes irrégulières, mémorise directement *mejor*, *peor*, *mayor* et *menor*.

## 5. Producción guiada

> **Traduction française :** Production guidée.

**Mi hermano es joven, robusto y muy simpático, amable pero riguroso.**

> **Traduction française :** Mon frère est jeune, robuste et très sympathique, aimable mais rigoureux.

**Mi pueblo es Bouna. Es un pueblo muy moderno.**

> **Traduction française :** Mon village est Bouna. C’est un village très moderne.

> **Synthèse :** décrire consiste à choisir un vocabulaire adapté puis à organiser les éléments physiques et moraux. Les comparatifs permettent ensuite de préciser une différence, une égalité ou une infériorité entre deux personnes, objets ou lieux.

## Référence pédagogique

Contenu reformulé et structuré à partir du PDF fourni : **« Décrire »**, Espagnol, Terminale, Côte d’Ivoire — École numérique.`,
    exerciseA: {
      title: "Exercice 1 — Vocabulario de la descripción",
      statement: bilingual(
        "Relaciona el vocabulario de la descripción con su significado y comprende el retrato de Tío Lucas.",
        "Relie le vocabulaire de la description à son sens et comprends le portrait de l’oncle Lucas.",
      ),
      solution: bilingual(
        "La corrección relaciona belleza, tamaño y retrato con los términos de la ficha.",
        "La correction relie belleza, tamaño et retrato aux termes de la fiche.",
      ),
      questions: [
        ["single_choice", bilingual("¿Qué significa *el retrato*?", "Que signifie *el retrato* ?"), [bilingualOption("La descripción de una persona", "La description d’une personne"), bilingualOption("Una pregunta", "Une question"), bilingualOption("Una bolsa de petróleo", "Une poche de pétrole")], [bilingualOption("La descripción de una persona", "La description d’une personne")], bilingual("La actividad relaciona *el retrato* con la descripción.", "L’activité associe *el retrato* à la description."), 10],
        ["single_choice", bilingual("¿Qué contraste presenta el retrato de Tío Lucas?", "Quel contraste le portrait de l’oncle Lucas présente-t-il ?"), [bilingualOption("Su aspecto físico y sus valores morales", "Son apparence physique et ses valeurs morales"), bilingualOption("Su profesión y su país", "Sa profession et son pays"), bilingualOption("Su edad y su fecha de nacimiento", "Son âge et sa date de naissance")], [bilingualOption("Su aspecto físico y sus valores morales", "Son apparence physique et ses valeurs morales")], bilingual("La ficha indica que era muy feo pero tenía grandes valores morales.", "La fiche indique qu’il était très laid mais avait de grandes valeurs morales."), 20],
        ["true_false", bilingual("*Guapo* es lo contrario de *feo*.", "*Guapo* est le contraire de *feo* ."), [bilingualOption("Verdadero", "Vrai"), bilingualOption("Falso", "Faux")], [bilingualOption("Verdadero", "Vrai")], bilingual("El vocabulario presenta *ser feo* y *ser guapo* como términos contrarios.", "Le vocabulaire présente *ser feo* et *ser guapo* comme des termes contraires."), 30],
      ],
    },
    exerciseB: {
      title: "Exercice 2 — Comparativos para describir",
      statement: bilingual(
        "Reconoce y transforma comparaciones de superioridad, igualdad e inferioridad.",
        "Reconnais et transforme des comparaisons de supériorité, d’égalité et d’infériorité.",
      ),
      solution: bilingual(
        "La corrección utiliza más... que, tan... como, menos... que y los comparativos irregulares.",
        "La correction utilise más... que, tan... como, menos... que et les comparatifs irréguliers.",
      ),
      questions: [
        ["single_choice", bilingual("Lucas era más feo que Picio. ¿Qué transformación conserva el sentido?", "Lucas était plus laid que Picio. Quelle transformation conserve le sens ?"), [bilingualOption("Picio era menos feo que Lucas.", "Picio était moins laid que Lucas."), bilingualOption("Picio era más feo que Lucas.", "Picio était plus laid que Lucas."), bilingualOption("Lucas era tan feo como Picio.", "Lucas était aussi laid que Picio.")], [bilingualOption("Picio era menos feo que Lucas.", "Picio était moins laid que Lucas.")], bilingual("La actividad del soporte intercambia el orden y usa *menos feo que*.", "L’activité du support inverse l’ordre et utilise *menos feo que* ."), 10],
        ["single_choice", bilingual("¿Cuál es la forma irregular de *bueno*?", "Quelle est la forme irrégulière de *bueno* ?"), [bilingualOption("mejor", "meilleur"), bilingualOption("mayor", "plus grand"), bilingualOption("menos", "moins")], [bilingualOption("mejor", "meilleur")], bilingual("La tabla de comparativos irregulares da *bueno → mejor*.", "Le tableau des comparatifs irréguliers donne *bueno → mejor* ."), 20],
        ["true_false", bilingual("*Tan simpático como* expresa igualdad.", "*Tan simpático como* exprime l’égalité."), [bilingualOption("Verdadero", "Vrai"), bilingualOption("Falso", "Faux")], [bilingualOption("Verdadero", "Vrai")], bilingual("La regla presenta *tan ... como* como comparativo de igualdad.", "La règle présente *tan ... como* comme un comparatif d’égalité."), 30],
      ],
    },
    quiz: {
      title: "Quiz bilingue — Describir",
      questions: [
        [bilingual("¿Qué expresión sirve para comparar superioridad?", "Quelle expression sert à comparer la supériorité ?"), bilingual("La ficha usa *más ... que*.", "La fiche utilise *más ... que* ."), [bilingualOption("más ... que", "plus ... que"), bilingualOption("tan ... como", "aussi ... que")], 10],
        [bilingual("¿Qué significa *el tamaño*?", "Que signifie *el tamaño* ?"), bilingual("El vocabulario lo emplea para las dimensiones.", "Le vocabulaire l’emploie pour les dimensions."), [bilingualOption("La taille ou les dimensions", "La taille ou les dimensions"), bilingualOption("Un journaliste", "Un journaliste")], 20],
        [bilingual("¿Cuál es el comparativo irregular de *malo*?", "Quel est le comparatif irrégulier de *malo* ?"), bilingual("La tabla presenta *malo → peor*.", "Le tableau présente *malo → peor* ."), [bilingualOption("peor", "pire"), bilingualOption("menor", "plus petit")], 30],
        [bilingual("¿Qué dos aspectos se pueden presentar para describir una persona?", "Quels deux aspects peut-on présenter pour décrire une personne ?"), bilingual("La ficha distingue el retrato físico y el retrato moral.", "La fiche distingue le portrait physique et le portrait moral."), [bilingualOption("El aspecto físico y el aspecto moral", "L’aspect physique et l’aspect moral"), bilingualOption("La hora y el precio", "L’heure et le prix")], 40],
      ],
    },
  },
];

function renderExerciseQuestions(exerciseUuid, questions) {
  return questions
    .map(
      ([type, prompt, options, answers, explanation, order]) =>
        `      (${exerciseUuid},${sqlText(type)},${sqlText(prompt)},${jsonArray(options)},${jsonArray(answers)},${sqlText(explanation)},${order})`,
    )
    .join(",\n");
}

function renderQuizQuestions(quiz) {
  return quiz.questions
    .map(
      ([prompt, explanation, _answers, order]) =>
        `        (quiz_uuid,${sqlText(prompt)},${sqlText(explanation)},'single_choice',${order},1,true)`,
    )
    .join(",\n");
}

function renderQuizAnswers(quiz) {
  return quiz.questions
    .flatMap(([_prompt, _explanation, answers, order]) => [
      `        (${order},${sqlText(answers[0])},true,10)`,
      `        (${order},${sqlText(answers[1])},false,20)`,
    ])
    .join(",\n");
}

function renderLessonSql(lesson, chapterUuidVar, lessonOrderSql) {
  const questionsA = renderExerciseQuestions("exercise_a_uuid", lesson.exerciseA.questions);
  const questionsB = renderExerciseQuestions("exercise_b_uuid", lesson.exerciseB.questions);
  const quizQuestions = renderQuizQuestions(lesson.quiz);
  const quizAnswers = renderQuizAnswers(lesson.quiz);

  return `
    lesson_uuid := null;
    insert into public.lessons (chapter_id,title,description,content,display_order,is_active)
    values (${chapterUuidVar},${sqlText(lesson.title)},${sqlText(lesson.description)},$lesson_content$
${lesson.content}
$lesson_content$,${lessonOrderSql},false)
    returning id into lesson_uuid;
    if lesson_uuid is null then
      raise exception 'Création de leçon Espagnol impossible : %.', ${sqlText(lesson.title)};
    end if;

    exercise_a_uuid := null;
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
    values (target.subject_id,target.level_id,target.series_id,${chapterUuidVar},lesson_uuid,${sqlText(lesson.exerciseA.title)},${sqlText(lesson.exerciseA.statement)},${sqlText(lesson.exerciseA.solution)},'single_choice','easy',${sqlText(bilingual("Responde en español y lee inmediatamente la traducción francesa de cada elemento.", "Réponds en espagnol et lis immédiatement la traduction française de chaque élément."))},${sqlText(bilingual("Comprueba el vocabulario, la estructura y la traducción francesa asociada.", "Vérifie le vocabulaire, la structure et la traduction française associée."))},false,false,20,10)
    returning id into exercise_a_uuid;
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
${questionsA};

    exercise_b_uuid := null;
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
    values (target.subject_id,target.level_id,target.series_id,${chapterUuidVar},lesson_uuid,${sqlText(lesson.exerciseB.title)},${sqlText(lesson.exerciseB.statement)},${sqlText(lesson.exerciseB.solution)},'single_choice','medium',${sqlText(bilingual("Analiza la frase en español y su traducción francesa inmediata.", "Analyse la phrase en espagnol et sa traduction française immédiate."))},${sqlText(bilingual("Explica la regla en español y comprueba la traducción francesa.", "Explique la règle en espagnol et vérifie la traduction française."))},false,false,25,20)
    returning id into exercise_b_uuid;
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
${questionsB};

    quiz_uuid := null;
    insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active)
    values (target.subject_id,target.level_id,target.series_id,target.offering_id,${chapterUuidVar},lesson_uuid,${sqlText(lesson.quiz.title)},${sqlText(bilingual("Verifica tus conocimientos con preguntas en español y traducción francesa inmediata.", "Vérifie tes connaissances avec des questions en espagnol et une traduction française immédiate."))},'medium',12,10,false,false)
    returning id into quiz_uuid;
    with inserted_questions as (
      insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
${quizQuestions}
      returning id,display_order
    )
    insert into public.quiz_answers (question_id,answer,is_correct,display_order)
    select inserted_questions.id,answers.answer,answers.is_correct,answers.display_order
    from inserted_questions
    join (values
${quizAnswers}
    ) as answers(question_order,answer,is_correct,display_order)
      on answers.question_order=inserted_questions.display_order;
`;
}

const worldLesson = lessons.find((lesson) => lesson.chapter === "world");
const exchangeLessons = lessons.filter((lesson) => lesson.chapter === "exchange");
const offeringList = offeringIds.map(sqlText).join(", ");
const targetTitles = lessons.map((lesson) => sqlText(lesson.title)).join(", ");

const sql = `-- Brouillons bilingues Espagnol Terminale : Guinée équatoriale, questions et description.
-- Toute formulation pédagogique espagnole est suivie de sa traduction française immédiate.
-- Les structures existantes et les brouillons précédents sont préservés ; toute ressource cible déjà présente annule la migration.
do $spanish_terminal_l5_l7_bilingual$
declare
  target record;
  world_chapter_uuid uuid;
  exchange_chapter_uuid uuid;
  lesson_uuid uuid;
  exercise_a_uuid uuid;
  exercise_b_uuid uuid;
  quiz_uuid uuid;
  world_lesson_order integer;
  exchange_chapter_order integer;
  offering_count integer;
begin
  select count(*) into offering_count
  from public.course_subject_offerings
  where id in (${offeringList});
  if offering_count <> 4 then
    raise exception 'Les quatre offres Espagnol Terminale attendues sont requises ; transaction annulée.';
  end if;

  if exists (
    select 1
    from public.lessons le
    join public.chapters ch on ch.id=le.chapter_id
    where ch.subject_offering_id in (${offeringList})
      and le.title in (${targetTitles})
  ) then
    raise exception 'Une leçon cible Espagnol Terminale existe déjà ; ré-audit requis avant toute écriture.';
  end if;

  if exists (
    select 1 from public.chapters
    where subject_offering_id in (${offeringList})
      and title='Compétence — Échange d’information'
  ) then
    raise exception 'Le chapitre Espagnol « Échange d’information » existe déjà ; ré-audit requis avant toute écriture.';
  end if;

  for target in
    select o.id as offering_id,o.subject_id,o.level_id,o.series_id
    from public.course_subject_offerings o
    where o.id in (${offeringList})
    order by o.id
  loop
    select id into world_chapter_uuid
    from public.chapters
    where subject_offering_id=target.offering_id
      and title='Compétence — Connaissance du monde hispanique'
    limit 1;
    if world_chapter_uuid is null then
      raise exception 'Le chapitre de connaissance du monde hispanique est absent pour l’offre %.', target.offering_id;
    end if;

    select coalesce(max(display_order),0)+10 into world_lesson_order
    from public.lessons
    where chapter_id=world_chapter_uuid;

    select coalesce(max(display_order),0)+10 into exchange_chapter_order
    from public.chapters
    where subject_offering_id=target.offering_id;

    insert into public.chapters (subject_id,level_id,series_id,subject_offering_id,title,description,display_order,is_active)
    values (target.subject_id,target.level_id,target.series_id,target.offering_id,'Compétence — Échange d’information','Expression orale : poser des questions et décrire ; contenus bilingues espagnol-français.',exchange_chapter_order,false)
    returning id into exchange_chapter_uuid;

${renderLessonSql(worldLesson, "world_chapter_uuid", "world_lesson_order")}
${exchangeLessons.map((lesson, index) => renderLessonSql(lesson, "exchange_chapter_uuid", String((index + 1) * 10))).join("\n")}
  end loop;
end
$spanish_terminal_l5_l7_bilingual$;
`;

mkdirSync(dirname(migrationPath), { recursive: true });
writeFileSync(migrationPath, sql, "utf8");
writeFileSync(
  applyInputPath,
  JSON.stringify(
    {
      project_id: "nnshioowwniursnozicg",
      name: "espagnol_terminale_guinee_questions_decrire_bilingual_drafts",
      query: sql,
    },
    null,
    2,
  ),
  "utf8",
);
console.log(migrationPath);
