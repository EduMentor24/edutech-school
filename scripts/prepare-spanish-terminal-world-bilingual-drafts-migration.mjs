import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const migrationPath = resolve(
  "supabase/migrations/20260822_espagnol_terminale_monde_hispanique_bilingual_drafts.sql",
);
const applyInputPath = resolve(
  "supabase/migrations/20260822_espagnol_terminale_monde_hispanique_bilingual_drafts.apply.json",
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
    title: "Leçon 2 : Connaître les réalités politiques, sociales et historiques de l’Espagne.",
    description:
      "Guerre civile, franquisme, mémoire historique, vocabulaire associé et corrélation des temps avec les verbes de volonté.",
    order: 20,
    content: String.raw`## Conocer las realidades políticas, sociales e históricas de España

> **Traduction française :** Connaître les réalités politiques, sociales et historiques de l’Espagne.

> **Objectif bilingue :** comprendre un document oral sur la mémoire historique espagnole, employer le vocabulaire étudié et utiliser le subjonctif après un verbe de volonté.

## 1. Situación de aprendizaje

> **Traduction française :** Situation d’apprentissage.

**La guerra civil y la posterior dictadura franquista son dos períodos importantes de la historia contemporánea de España.**

> **Traduction française :** La guerre civile et la dictature franquiste qui l’a suivie sont deux périodes importantes de l’histoire contemporaine de l’Espagne.

Le document propose d’identifier des événements historiques, sociaux et politiques. Lors d’une compréhension orale, il faut commencer par relever les noms d’événements, les dates citées et les acteurs avant de construire une réponse complète.

## 2. Vocabulario esencial

> **Traduction française :** Vocabulaire essentiel.

| Español | Traduction française et emploi |
|---|---|
| **el franquismo** | Le franquisme ; le document le présente comme la période liée au règne de Francisco Franco, de 1939 à 1975. |
| **un desaparecido** | Une personne disparue. *Hay muchos desaparecidos cuando se produce una catástrofe natural.*<br><br>**Traduction française :** Il y a beaucoup de disparus lorsqu’une catastrophe naturelle se produit. |
| **exhumar** | Exhumer. *A veces, la policía exhuma los cuerpos para realizar las investigaciones.*<br><br>**Traduction française :** Parfois, la police exhume les corps afin de mener les enquêtes. |
| **los restos mortales** | Les dépouilles mortelles. |
| **una sepultura digna** | Une sépulture digne. |

## 3. Comprender la memoria histórica

> **Traduction française :** Comprendre la mémoire historique.

**Bajo la supervisión del juez Baltasar Garzón, las Asociaciones por la Recuperación de la Memoria Histórica procedieron a la recuperación de los restos mortales de las víctimas de la guerra civil y el franquismo.**

> **Traduction française :** Sous la supervision du juge Baltasar Garzón, les associations pour la récupération de la mémoire historique ont procédé à la récupération des dépouilles mortelles des victimes de la guerre civile et du franquisme.

Le texte indique qu’en 2008 cette opération a suscité une polémique initiale, puis que les familles ont pu s’accorder pour la réaliser. La réponse attendue ne doit pas ajouter de causes non fournies par le support : elle relie uniquement la guerre civile, le franquisme, les associations, la récupération des restes et la possibilité d’une sépulture digne.

> **Méthode :** pour résumer, utilisez le schéma « qui ? — quoi ? — pourquoi ? ». Ici : les associations ; récupèrent les restes mortels ; afin de faciliter les recherches et de permettre une sépulture digne.

## 4. Gramática: la correlación de tiempos con los verbos de voluntad

> **Traduction française :** Grammaire : la corrélation des temps avec les verbes de volonté.

**El juez pidió a las Asociaciones que dieran datos sobre los muertos.**

> **Traduction française :** Le juge a demandé aux associations qu’elles donnent des informations sur les morts.

Après un verbe qui exprime une volonté, le verbe de la proposition subordonnée est au subjonctif. Lorsque le verbe principal est au présent, on rencontre le présent du subjonctif ; lorsque le verbe principal est au passé, le document illustre l’imparfait du subjonctif.

| Expresión en español | Traduction française | Observation |
|---|---|---|
| **Queremos que les den una sepultura digna.** | Nous voulons qu’ils leur donnent une sépulture digne. | *queremos* au présent → *den* au présent du subjonctif. |
| **Los jóvenes querían que sus demandas tuvieran importancia.** | Les jeunes voulaient que leurs revendications aient de l’importance. | *querían* à l’imparfait → *tuvieran* à l’imparfait du subjonctif. |

> **Attention :** ne confondez pas l’idée exprimée par le verbe principal avec la forme du verbe subordonné. C’est l’expression de la volonté qui appelle ici le subjonctif.

## 5. Producción guiada

> **Traduction française :** Production guidée.

**La guerra civil española estalló en 1936 y terminó en 1939.**

> **Traduction française :** La guerre civile espagnole a éclaté en 1936 et s’est terminée en 1939.

**Los protagonistas mencionados son los Nacionalistas y los Republicanos.**

> **Traduction française :** Les protagonistes mentionnés sont les nationalistes et les républicains.

> **Synthèse :** le support associe l’étude de la mémoire historique au vocabulaire du franquisme, des disparus et de l’exhumation. Il permet aussi de pratiquer le subjonctif avec les verbes de volonté, pour exprimer ce que l’on demande, veut ou souhaite.

## Référence pédagogique

Contenu reformulé et structuré à partir du PDF fourni : **« Connaître les réalités politiques, sociales et historiques de l’Espagne »**, Espagnol, Terminale, Côte d’Ivoire — École numérique.`,
    exerciseA: {
      title: "Exercice 1 — Memoria histórica y vocabulario",
      statement: bilingual(
        "Identifica el vocabulario de la memoria histórica y responde a las preguntas de comprensión.",
        "Identifie le vocabulaire de la mémoire historique et réponds aux questions de compréhension.",
      ),
      solution: bilingual(
        "La corrección relaciona franquismo, desaparecido y exhumar con el resumen del documento.",
        "La correction relie franquisme, disparu et exhumer au résumé du document.",
      ),
      questions: [
        ["single_choice", bilingual("¿Qué significa *exhumar*?", "Que signifie *exhumar* ?"), [bilingualOption("Sacar un cuerpo de la tumba", "Sortir un corps de la tombe"), bilingualOption("Construir una escuela", "Construire une école"), bilingualOption("Olvidar una fecha", "Oublier une date")], [bilingualOption("Sacar un cuerpo de la tumba", "Sortir un corps de la tombe")], bilingual("*Exhumar* se emplea para recuperar un cuerpo enterrado.", "*Exhumar* s’emploie pour récupérer un corps enterré."), 10],
        ["single_choice", bilingual("¿Qué dos períodos cita el documento?", "Quelles sont les deux périodes citées par le document ?"), [bilingualOption("La guerra civil y el franquismo", "La guerre civile et le franquisme"), bilingualOption("La conquista y la revolución industrial", "La conquête et la révolution industrielle"), bilingualOption("La Edad Media y el Renacimiento", "Le Moyen Âge et la Renaissance")], [bilingualOption("La guerra civil y el franquismo", "La guerre civile et le franquisme")], bilingual("El soporte cita la guerra civil y la posterior dictadura franquista.", "Le support cite la guerre civile et la dictature franquiste qui l’a suivie."), 20],
        ["true_false", bilingual("Las Asociaciones ayudaron facilitando datos para las investigaciones.", "Les associations ont aidé en facilitant des informations pour les enquêtes."), [bilingualOption("Verdadero", "Vrai"), bilingualOption("Falso", "Faux")], [bilingualOption("Verdadero", "Vrai")], bilingual("El resumen explica que las asociaciones daban datos para facilitar las investigaciones.", "Le résumé explique que les associations fournissaient des informations pour faciliter les enquêtes."), 30],
      ],
    },
    exerciseB: {
      title: "Exercice 2 — Verbos de voluntad y subjuntivo",
      statement: bilingual(
        "Aplica la correlación de tiempos con los verbos de voluntad.",
        "Applique la corrélation des temps avec les verbes de volonté.",
      ),
      solution: bilingual(
        "La corrección distingue el presente de subjuntivo y el imperfecto de subjuntivo según el verbo principal.",
        "La correction distingue le présent du subjonctif et l’imparfait du subjonctif selon le verbe principal.",
      ),
      questions: [
        ["single_choice", bilingual("Los jóvenes quieren que se ___ sus demandas.", "Les jeunes veulent que leurs revendications soient ___ ."), [bilingualOption("escuchen", "écoutées"), bilingualOption("escuchaban", "écoutées (imparfait)"), bilingualOption("escuchar", "écouter")], [bilingualOption("escuchen", "écoutées")], bilingual("Después de *quieren que*, el documento emplea *se escuchen* en presente de subjuntivo.", "Après *quieren que*, le document emploie *se escuchen* au présent du subjonctif."), 10],
        ["single_choice", bilingual("Los jóvenes querían que sus demandas ___ importancia.", "Les jeunes voulaient que leurs revendications ___ de l’importance."), [bilingualOption("tuvieran", "aient (imparfait du subjonctif)"), bilingualOption("tienen", "ont"), bilingualOption("tener", "avoir")], [bilingualOption("tuvieran", "aient (imparfait du subjonctif)")], bilingual("Con *querían*, el soporte usa *tuvieran*, imperfecto de subjuntivo.", "Avec *querían*, le support utilise *tuvieran*, imparfait du subjonctif."), 20],
        ["true_false", bilingual("Después de un verbo de voluntad, la subordinada está en subjuntivo en la regla estudiada.", "Après un verbe de volonté, la subordonnée est au subjonctif dans la règle étudiée."), [bilingualOption("Verdadero", "Vrai"), bilingualOption("Falso", "Faux")], [bilingualOption("Verdadero", "Vrai")], bilingual("La règle du PDF formule précisément cet emploi du subjonctif.", "La règle du PDF formule précisément cet emploi du subjonctif."), 30],
      ],
    },
    quiz: {
      title: "Quiz bilingue — España: memoria histórica",
      questions: [
        [bilingual("¿Qué significa *una sepultura digna*?", "Que signifie *una sepultura digna* ?"), bilingual("La expresión se refiere a un entierro respetuoso.", "L’expression désigne un enterrement respectueux."), [bilingualOption("Un entierro respetuoso", "Un enterrement respectueux"), bilingualOption("Un viaje peligroso", "Un voyage dangereux")], 10],
        [bilingual("¿Qué verbo expresa la recuperación de cuerpos enterrados?", "Quel verbe exprime la récupération de corps enterrés ?"), bilingual("El vocabulario del PDF emplea *exhumar*.", "Le vocabulaire du PDF emploie *exhumar*."), [bilingualOption("exhumar", "exhumer"), bilingualOption("emigrar", "émigrer")], 20],
        [bilingual("¿Qué modo sigue a un verbo de voluntad según la regla?", "Quel mode suit un verbe de volonté selon la règle ?"), bilingual("La subordinada está en subjuntivo.", "La subordonnée est au subjonctif."), [bilingualOption("El subjuntivo", "Le subjonctif"), bilingualOption("El infinitivo solamente", "L’infinitif uniquement")], 30],
        [bilingual("¿Qué información deben identificar los alumnos?", "Quelle information les élèves doivent-ils identifier ?"), bilingual("Deben identificar acontecimientos históricos, sociales y políticos mencionados por el soporte.", "Ils doivent identifier les événements historiques, sociaux et politiques mentionnés par le support."), [bilingualOption("Acontecimientos históricos, sociales y políticos", "Des événements historiques, sociaux et politiques"), bilingualOption("Recetas de cocina", "Des recettes de cuisine")], 40],
      ],
    },
  },
  {
    title: "Leçon 3 : Connaître les réalités sociales et historiques de l’Amérique hispanique.",
    description:
      "Civilisations précolombiennes, vocabulaire associé, repères étudiés et superlatif relatif.",
    order: 30,
    content: String.raw`## Conocer las realidades sociales e históricas de América hispánica

> **Traduction française :** Connaître les réalités sociales et historiques de l’Amérique hispanique.

> **Objectif bilingue :** identifier les civilisations précolombiennes présentées dans le support, employer un vocabulaire précis et former le superlatif relatif.

## 1. Culturas precolombinas

> **Traduction française :** Cultures précolombiennes.

**Dentro de la América precolombina, es decir anterior a la llegada de Cristóbal Colón, existían diversas civilizaciones desarrolladas.**

> **Traduction française :** Dans l’Amérique précolombienne, c’est-à-dire antérieure à l’arrivée de Christophe Colomb, existaient diverses civilisations développées.

Le terme *precolombino* sert dans le document à situer les civilisations avant l’arrivée de Christophe Colomb. Pour une écoute efficace, repérez le nom de la civilisation, l’espace évoqué, le personnage ou la croyance citée et le fait historique fourni.

## 2. Vocabulario y civilizaciones

> **Traduction française :** Vocabulaire et civilisations.

| Español | Traduction française et repère du support |
|---|---|
| **los Aztecas** | Les Aztèques. Le document les associe à l’actuel Mexique et à une partie du Guatemala. |
| **los Mayas** | Les Mayas. Le document les situe du sud du Mexique jusqu’à l’actuel Honduras. |
| **los Incas** | Les Incas. Le document évoque un empire allant de l’océan Pacifique à la forêt amazonienne. |
| **el sacerdote** | Le prêtre. Dans les peuples précolombiens, le support mentionne aussi le guérisseur ou le chamane. |
| **el chamán** | Le chamane, personne à laquelle sont attribués des pouvoirs surnaturels dans le vocabulaire de la fiche. |

## 3. Tres civilizaciones presentadas

> **Traduction française :** Trois civilisations présentées.

### Los Aztecas

> **Traduction française :** Les Aztèques.

**Los Aztecas formaban una gran civilización. Su dios más importante se llamaba Quetzalcóatl.**

> **Traduction française :** Les Aztèques formaient une grande civilisation. Leur dieu le plus important s’appelait Quetzalcóatl.

Le support mentionne plusieurs classes sociales, dont les nobles, les prêtres et les guerriers, et indique que la civilisation aztèque prend fin avec l’arrivée des Espagnols en 1521.

### Los Mayas

> **Traduction française :** Les Mayas.

**Eran grandes constructores de pirámides y templos y eran famosos por sus conocimientos científicos y astronómicos.**

> **Traduction française :** Ils étaient de grands bâtisseurs de pyramides et de temples et étaient célèbres pour leurs connaissances scientifiques et astronomiques.

Le texte cite Hunabkú comme dieu principal et rappelle que le support présente le maïs dans le récit de création. Il faut restituer ces éléments comme des informations du document, sans les généraliser au-delà de celui-ci.

### Los Incas

> **Traduction française :** Les Incas.

**El Machu Picchu era el lugar sagrado más importante de los Incas.**

> **Traduction française :** Le Machu Picchu était le lieu sacré le plus important des Incas.

Le document mentionne Yupanqui, le vaste empire inca et la disparition de cette civilisation avec l’arrivée de Francisco Pizarro en 1530.

## 4. Gramática: el superlativo relativo

> **Traduction française :** Grammaire : le superlatif relatif.

Le superlatif relatif exprime le degré maximum ou minimum d’une qualité.

| Forma en español | Traduction française |
|---|---|
| **el / la / los / las más + adjetivo** | le / la / les plus + adjectif |
| **el / la / los / las menos + adjetivo** | le / la / les moins + adjectif |
| **el mejor / el peor** | le meilleur / le pire |
| **el mayor / el menor** | le plus grand / le plus petit |

**Quetzalcóatl era el dios más importante de los Aztecas.**

> **Traduction française :** Quetzalcóatl était le dieu le plus important des Aztèques.

**Este jugador es el peor del equipo.**

> **Traduction française :** Ce joueur est le pire de l’équipe.

> **Méthode :** repérez d’abord le déterminant (*el, la, los, las*), puis l’adverbe *más* ou *menos*, enfin l’adjectif. Comparez ensuite avec le nom ou le groupe concerné.

## 5. Producción guiada

> **Traduction française :** Production guidée.

**Antes de la llegada de los europeos a América, las civilizaciones que reinaban eran los Mayas, los Aztecas y los Incas.**

> **Traduction française :** Avant l’arrivée des Européens en Amérique, les civilisations qui régnaient étaient les Mayas, les Aztèques et les Incas.

> **Synthèse :** la fiche présente les Aztèques, les Mayas et les Incas comme les civilisations précolombiennes à identifier. Elle associe l’étude historique à un outil de langue : le superlatif relatif, qui permet de qualifier une personne, un lieu ou un élément comme le plus ou le moins remarquable d’un ensemble.

## Référence pédagogique

Contenu reformulé et structuré à partir du PDF fourni : **« Connaître les réalités sociales et historiques de l’Amérique hispanique »**, Espagnol, Terminale, Côte d’Ivoire — École numérique.`,
    exerciseA: {
      title: "Exercice 1 — Civilizaciones precolombinas",
      statement: bilingual(
        "Identifica las civilizaciones precolombinas y relaciona cada información con el pueblo correspondiente.",
        "Identifie les civilisations précolombiennes et relie chaque information au peuple correspondant.",
      ),
      solution: bilingual(
        "La corrección distingue Aztecas, Mayas e Incas con los datos citados en la ficha.",
        "La correction distingue les Aztèques, les Mayas et les Incas à l’aide des éléments cités dans la fiche.",
      ),
      questions: [
        ["single_choice", bilingual("¿Qué civilización tenía Tenochtitlan como capital según la actividad?", "Quelle civilisation avait Tenochtitlan pour capitale selon l’activité ?"), [bilingualOption("Los Aztecas", "Les Aztèques"), bilingualOption("Los Mayas", "Les Mayas"), bilingualOption("Los Incas", "Les Incas")], [bilingualOption("Los Aztecas", "Les Aztèques")], bilingual("La actividad asocia Tenochtitlan con los Aztecas.", "L’activité associe Tenochtitlan aux Aztèques."), 10],
        ["single_choice", bilingual("¿Qué pueblo era famoso por sus conocimientos científicos y astronómicos?", "Quel peuple était célèbre pour ses connaissances scientifiques et astronomiques ?"), [bilingualOption("Los Mayas", "Les Mayas"), bilingualOption("Los Aztecas", "Les Aztèques"), bilingualOption("Los Incas", "Les Incas")], [bilingualOption("Los Mayas", "Les Mayas")], bilingual("El resumen atribuye esos conocimientos a los Mayas.", "Le résumé attribue ces connaissances aux Mayas."), 20],
        ["true_false", bilingual("El Machu Picchu era el lugar sagrado más importante de los Incas en el documento.", "Le Machu Picchu était le lieu sacré le plus important des Incas dans le document."), [bilingualOption("Verdadero", "Vrai"), bilingualOption("Falso", "Faux")], [bilingualOption("Verdadero", "Vrai")], bilingual("La ficha presenta el Machu Picchu como el lugar sagrado más importante de los Incas.", "La fiche présente le Machu Picchu comme le lieu sacré le plus important des Incas."), 30],
      ],
    },
    exerciseB: {
      title: "Exercice 2 — El superlativo relativo",
      statement: bilingual(
        "Reconoce y emplea el superlativo relativo en frases sobre el mundo hispánico.",
        "Reconnais et emploie le superlatif relatif dans des phrases sur le monde hispanique.",
      ),
      solution: bilingual(
        "La corrección aplica el/la más o menos + adjetivo y reconoce mejor, peor, mayor y menor.",
        "La correction applique el/la más ou menos + adjectif et reconnaît mejor, peor, mayor et menor.",
      ),
      questions: [
        ["single_choice", bilingual("¿Cuál es la forma correcta del superlativo relativo?", "Quelle est la forme correcte du superlatif relatif ?"), [bilingualOption("el más importante", "le plus important"), bilingualOption("muy importante de", "très important de"), bilingualOption("más importante que todos sin artículo", "plus important que tous sans article")], [bilingualOption("el más importante", "le plus important")], bilingual("La regla combina el artículo con *más* y el adjetivo.", "La règle associe l’article à *más* et à l’adjectif."), 10],
        ["single_choice", bilingual("¿Qué significa *el peor*?", "Que signifie *el peor* ?"), [bilingualOption("le pire", "le pire"), bilingualOption("le meilleur", "le meilleur"), bilingualOption("le plus grand", "le plus grand")], [bilingualOption("le pire", "le pire")], bilingual("La ficha presenta *el peor* como equivalente de *el más malo*.", "La fiche présente *el peor* comme l’équivalent de *el más malo*."), 20],
        ["true_false", bilingual("*El menor* puede expresar el más pequeño.", "*El menor* peut exprimer le plus petit."), [bilingualOption("Verdadero", "Vrai"), bilingualOption("Falso", "Faux")], [bilingualOption("Verdadero", "Vrai")], bilingual("El documento da *el menor* como forma posible para *el más pequeño*.", "Le document donne *el menor* comme forme possible de *el más pequeño*."), 30],
      ],
    },
    quiz: {
      title: "Quiz bilingue — América precolombina",
      questions: [
        [bilingual("¿Qué tres civilizaciones cita la ficha?", "Quelles trois civilisations la fiche cite-t-elle ?"), bilingual("La ficha nombra Aztecas, Mayas e Incas.", "La fiche nomme les Aztèques, les Mayas et les Incas."), [bilingualOption("Aztecas, Mayas e Incas", "Aztèques, Mayas et Incas"), bilingualOption("Romanos, Griegos y Egipcios", "Romains, Grecs et Égyptiens")], 10],
        [bilingual("¿Qué significa *precolombino* en el contexto estudiado?", "Que signifie *precolombino* dans le contexte étudié ?"), bilingual("Se refiere al periodo anterior a la llegada de Cristóbal Colón indicada por el documento.", "Il désigne la période antérieure à l’arrivée de Christophe Colomb indiquée par le document."), [bilingualOption("Anterior a la llegada de Cristóbal Colón", "Antérieur à l’arrivée de Christophe Colomb"), bilingualOption("Posterior a la revolución industrial", "Postérieur à la révolution industrielle")], 20],
        [bilingual("¿Qué expresión forma un superlativo relativo?", "Quelle expression forme un superlatif relatif ?"), bilingual("La construcción es *el más + adjetivo* o *el menos + adjetivo*.", "La construction est *el más + adjectif* ou *el menos + adjectif* ."), [bilingualOption("el más + adjetivo", "le plus + adjectif"), bilingualOption("muy + verbo", "très + verbe")], 30],
        [bilingual("¿Qué término nombra al sacerdote o curandero con poderes sobrenaturales?", "Quel terme désigne le prêtre ou guérisseur doté de pouvoirs surnaturels ?"), bilingual("El vocabulario del soporte cita *el chamán*.", "Le vocabulaire du support cite *el chamán*."), [bilingualOption("el chamán", "le chamane"), bilingualOption("el emigrante", "l’émigrant")], 40],
      ],
    },
  },
  {
    title: "Leçon 4 : Connaître les réalités économiques et sociales de l’Amérique hispanique.",
    description:
      "Migration, vocabulaire des parcours migratoires, causes citées dans le support et expression du souhait avec gustar.",
    order: 40,
    content: String.raw`## Conocer las realidades económicas y sociales de América hispánica

> **Traduction française :** Connaître les réalités économiques et sociales de l’Amérique hispanique.

> **Objectif bilingue :** comprendre un document oral sur les migrations, réemployer le vocabulaire étudié et exprimer un souhait avec *gustar* au conditionnel.

## 1. Situación de aprendizaje

> **Traduction française :** Situation d’apprentissage.

**El panorama migratorio en Hispanoamérica ha cambiado rápidamente en la última década.**

> **Traduction française :** Le panorama migratoire en Amérique hispanique a changé rapidement au cours de la dernière décennie.

Le support invite les élèves à identifier les réalités économiques et sociales liées aux migrations. Il faut distinguer les causes citées dans l’enregistrement des conséquences évoquées, sans présenter comme universelle une situation rapportée pour certains migrants.

## 2. Vocabulario de la migración

> **Traduction française :** Vocabulaire de la migration.

| Español | Traduction française et emploi |
|---|---|
| **la emigración** | L’émigration. *Algunos jóvenes eligen la emigración clandestina para huir de la pobreza.*<br><br>**Traduction française :** Certains jeunes choisissent l’émigration clandestine pour fuir la pauvreté. |
| **un indocumentado** | Une personne sans papiers. *Los emigrantes clandestinos son indocumentados.*<br><br>**Traduction française :** Les migrants clandestins sont sans papiers. |
| **un peligro** | Un danger. *Cruzar el mar en embarcaciones es un peligro.*<br><br>**Traduction française :** Traverser la mer en embarcations est un danger. |
| **la ruta de la muerte** | La route de la mort ; le support l’emploie pour désigner le trajet dangereux parcouru par des clandestins vers les États-Unis. |
| **la vía clandestina** | La voie clandestine. |

## 3. Comprender el documento

> **Traduction française :** Comprendre le document.

**Para huir de la situación social y económica difícil en sus países, muchos centroamericanos emprenden el peligroso camino de la emigración hacia los Estados Unidos.**

> **Traduction française :** Pour fuir une situation sociale et économique difficile dans leurs pays, de nombreux Centraméricains empruntent le chemin dangereux de l’émigration vers les États-Unis.

Le document cite des raisons économiques, sociales et parfois politiques. Il mentionne que la migration peut être motivée par la recherche d’opportunités de travail et de meilleures conditions de vie, tout en soulignant les dangers de certains trajets.

**Conozco el trayecto, pero el destino no. No sé qué pasará.**

> **Traduction française :** Je connais le trajet, mais pas la destination. Je ne sais pas ce qui se passera.

Cette phrase sert à exprimer l’incertitude du parcours. Dans une réponse de compréhension, on peut associer l’incertitude au danger sans inventer d’issue ni de détail supplémentaire.

## 4. Gramática: expresar un deseo con gustar

> **Traduction française :** Grammaire : exprimer un souhait avec *gustar*.

**Me gustaría viajar en tren.**

> **Traduction française :** J’aimerais voyager en train.

Pour exprimer un souhait, le document place *gustar* au conditionnel : **me gustaría + infinitif**. Lorsque le souhait porte sur une proposition introduite par *que*, l’exemple du support utilise le subjonctif.

| Español | Traduction française |
|---|---|
| **Me gustaría comprar una casa de vuelta a mi país.** | J’aimerais acheter une maison à mon retour dans mon pays. |
| **Me gustaría encontrar un trabajo decente.** | J’aimerais trouver un travail décent. |
| **Me gustaría ganarme la vida trabajando.** | J’aimerais gagner ma vie en travaillant. |
| **Me gustaría que Dios me dijera qué va a pasar.** | J’aimerais que Dieu me dise ce qui va se passer. |

> **Méthode :** identifiez d’abord la personne qui exprime le souhait (*me*), puis utilisez *gustaría*. Ajoutez ensuite un infinitif ou une proposition avec *que* selon l’idée à exprimer.

## 5. Producción guiada

> **Traduction française :** Production guidée.

**Las causas de la emigración mencionadas en el documento son sociales, económicas y a veces políticas.**

> **Traduction française :** Les causes de l’émigration mentionnées dans le document sont sociales, économiques et parfois politiques.

> **Synthèse :** la leçon introduit le lexique de la migration et des parcours dangereux, puis permet d’exprimer un souhait avec *me gustaría*. Toute réponse doit rester respectueuse et s’appuyer sur les causes et dangers explicitement présentés par le support.

## Référence pédagogique

Contenu reformulé et structuré à partir du PDF fourni : **« Connaître les réalités économiques et sociales de l’Amérique hispanique »**, Espagnol, Terminale, Côte d’Ivoire — École numérique.`,
    exerciseA: {
      title: "Exercice 1 — Migración y vocabulario",
      statement: bilingual(
        "Completa y explica el vocabulario de la emigración y de los trayectos peligrosos.",
        "Complète et explique le vocabulaire de l’émigration et des parcours dangereux.",
      ),
      solution: bilingual(
        "La corrección emplea emigrantes, indocumentado y peligro según el documento.",
        "La correction emploie emigrantes, indocumentado et peligro selon le document.",
      ),
      questions: [
        ["single_choice", bilingual("¿Cómo se llama una persona que viaja sin documentos legales?", "Comment appelle-t-on une personne qui voyage sans documents légaux ?"), [bilingualOption("un indocumentado", "une personne sans papiers"), bilingualOption("un sacerdote", "un prêtre"), bilingualOption("un desaparecido", "une personne disparue")], [bilingualOption("un indocumentado", "une personne sans papiers")], bilingual("El vocabulario del PDF define al emigrante clandestino como *indocumentado*.", "Le vocabulaire du PDF définit le migrant clandestin comme *indocumentado*."), 10],
        ["single_choice", bilingual("¿Qué es *la ruta de la muerte* en la actividad?", "Qu’est-ce que *la ruta de la muerte* dans l’activité ?"), [bilingualOption("El trayecto peligroso de los clandestinos", "Le trajet dangereux des clandestins"), bilingualOption("Una fiesta nacional", "Une fête nationale"), bilingualOption("Un monumento antiguo", "Un monument ancien")], [bilingualOption("El trayecto peligroso de los clandestinos", "Le trajet dangereux des clandestins")], bilingual("La respuesta de la ficha la define como el trayecto que recorren los clandestinos hacia Estados Unidos.", "La réponse de la fiche la définit comme le trajet parcouru par les clandestins vers les États-Unis."), 20],
        ["true_false", bilingual("El documento menciona causas económicas, sociales y a veces políticas de la emigración.", "Le document mentionne des causes économiques, sociales et parfois politiques de l’émigration."), [bilingualOption("Verdadero", "Vrai"), bilingualOption("Falso", "Faux")], [bilingualOption("Verdadero", "Vrai")], bilingual("Estas causas aparecen en las respuestas guiadas y en las situaciones de evaluación.", "Ces causes apparaissent dans les réponses guidées et les situations d’évaluation."), 30],
      ],
    },
    exerciseB: {
      title: "Exercice 2 — Expresar un deseo con gustar",
      statement: bilingual(
        "Formula deseos con *me gustaría* y reconoce la estructura empleada.",
        "Formule des souhaits avec *me gustaría* et reconnais la structure employée.",
      ),
      solution: bilingual(
        "La corrección utiliza *me gustaría + infinitivo* y reconoce el condicional de gustar.",
        "La correction utilise *me gustaría + infinitif* et reconnaît le conditionnel de gustar.",
      ),
      questions: [
        ["single_choice", bilingual("Completa: Me gustaría ___ un trabajo decente.", "Complète : Me gustaría ___ un trabajo decente."), [bilingualOption("encontrar", "trouver"), bilingualOption("encontré", "trouvé"), bilingualOption("encuentran", "trouvent")], [bilingualOption("encontrar", "trouver")], bilingual("Después de *me gustaría*, la ficha utiliza un infinitivo: *encontrar*.", "Après *me gustaría*, la fiche utilise un infinitif : *encontrar*."), 10],
        ["single_choice", bilingual("¿Qué expresa *me gustaría*?", "Qu’exprime *me gustaría* ?"), [bilingualOption("un deseo", "un souhait"), bilingualOption("una obligación", "une obligation"), bilingualOption("una prohibición", "une interdiction")], [bilingualOption("un deseo", "un souhait")], bilingual("La regla del documento explica que gustar en condicional expresa un deseo.", "La règle du document explique que gustar au conditionnel exprime un souhait."), 20],
        ["true_false", bilingual("*Me gustaría viajar en tren* significa *J’aimerais voyager en train*.", "*Me gustaría viajar en tren* signifie *J’aimerais voyager en train*."), [bilingualOption("Verdadero", "Vrai"), bilingualOption("Falso", "Faux")], [bilingualOption("Verdadero", "Vrai")], bilingual("La phrase est l’exemple de référence du support.", "La phrase est l’exemple de référence du support."), 30],
      ],
    },
    quiz: {
      title: "Quiz bilingue — Migración en Hispanoamérica",
      questions: [
        [bilingual("¿Qué significa *la emigración*?", "Que signifie *la emigración* ?"), bilingual("El término se refiere al hecho de salir de un país para vivir en otro lugar.", "Le terme désigne le fait de quitter un pays pour vivre ailleurs."), [bilingualOption("El hecho de salir de un país", "Le fait de quitter un pays"), bilingualOption("El estudio de una lengua", "L’étude d’une langue")], 10],
        [bilingual("¿Qué estructura permite expresar un deseo simple?", "Quelle structure permet d’exprimer un souhait simple ?"), bilingual("La ficha utiliza *me gustaría + infinitivo*.", "La fiche utilise *me gustaría + infinitif*."), [bilingualOption("Me gustaría + infinitivo", "J’aimerais + infinitif"), bilingualOption("Tengo que + infinitivo", "Je dois + infinitif")], 20],
        [bilingual("¿Qué puede buscar una persona emigrante según el documento?", "Que peut rechercher une personne migrante selon le document ?"), bilingual("El soporte menciona oportunidades laborales y mejores condiciones de vida.", "Le support mentionne des opportunités de travail et de meilleures conditions de vie."), [bilingualOption("Oportunidades laborales", "Des opportunités de travail"), bilingualOption("Un examen de astronomía", "Un examen d’astronomie")], 30],
        [bilingual("¿Cómo califica el soporte ciertos trayectos migratorios?", "Comment le support qualifie-t-il certains trajets migratoires ?"), bilingual("Los presenta como peligrosos, sin afirmar un resultado para cada persona.", "Il les présente comme dangereux, sans affirmer une issue pour chaque personne."), [bilingualOption("peligrosos", "dangereux"), bilingualOption("siempre seguros", "toujours sûrs")], 40],
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

function renderLessonSql(lesson) {
  const questionsA = renderExerciseQuestions("exercise_a_uuid", lesson.exerciseA.questions);
  const questionsB = renderExerciseQuestions("exercise_b_uuid", lesson.exerciseB.questions);
  const quizQuestions = renderQuizQuestions(lesson.quiz);
  const quizAnswers = renderQuizAnswers(lesson.quiz);

  return `
    lesson_uuid := null;
    insert into public.lessons (chapter_id,title,description,content,display_order,is_active)
    values (chapter_uuid,${sqlText(lesson.title)},${sqlText(lesson.description)},$lesson_content$
${lesson.content}
$lesson_content$,${lesson.order},false)
    returning id into lesson_uuid;
    if lesson_uuid is null then
      raise exception 'Création de leçon Espagnol impossible : %.', ${sqlText(lesson.title)};
    end if;

    exercise_a_uuid := null;
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
    values (target.subject_id,target.level_id,target.series_id,chapter_uuid,lesson_uuid,${sqlText(lesson.exerciseA.title)},${sqlText(lesson.exerciseA.statement)},${sqlText(lesson.exerciseA.solution)},'single_choice','easy',${sqlText(bilingual("Responde en español y lee inmediatamente la traducción francesa de cada elemento.", "Réponds en espagnol et lis immédiatement la traduction française de chaque élément."))},${sqlText(bilingual("Comprueba el vocabulario, la estructura y la traducción francesa associée.", "Vérifie le vocabulaire, la structure et la traduction française associée."))},false,false,20,10)
    returning id into exercise_a_uuid;
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
${questionsA};

    exercise_b_uuid := null;
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
    values (target.subject_id,target.level_id,target.series_id,chapter_uuid,lesson_uuid,${sqlText(lesson.exerciseB.title)},${sqlText(lesson.exerciseB.statement)},${sqlText(lesson.exerciseB.solution)},'single_choice','medium',${sqlText(bilingual("Analiza la frase en español y su traducción francesa immédiate.", "Analyse la phrase en espagnol et sa traduction française immédiate."))},${sqlText(bilingual("Explica la regla en español y comprueba la traduction française.", "Explique la règle en espagnol et vérifie la traduction française."))},false,false,25,20)
    returning id into exercise_b_uuid;
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
${questionsB};

    quiz_uuid := null;
    insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active)
    values (target.subject_id,target.level_id,target.series_id,target.offering_id,chapter_uuid,lesson_uuid,${sqlText(lesson.quiz.title)},${sqlText(bilingual("Verifica tus conocimientos con preguntas en español y traducción française immédiate.", "Vérifie tes connaissances avec des questions en espagnol et une traduction française immédiate."))},'medium',12,10,false,false)
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

const lessonSql = lessons.map(renderLessonSql).join("\n");
const offeringList = offeringIds.map(sqlText).join(", ");

const sql = `-- Brouillons bilingues Espagnol Terminale : monde hispanique.
-- Toute formulation pédagogique espagnole est suivie de sa traduction française immédiate.
-- Les quatre offres Terminale sont auditées sans chapitre préalable ; toute structure ou ressource déjà présente annule la migration.
do $spanish_terminal_bilingual$
declare
  target record;
  chapter_uuid uuid;
  lesson_uuid uuid;
  exercise_a_uuid uuid;
  exercise_b_uuid uuid;
  quiz_uuid uuid;
  offering_count integer;
begin
  select count(*) into offering_count
  from public.course_subject_offerings
  where id in (${offeringList});
  if offering_count <> 4 then
    raise exception 'Les quatre offres Espagnol Terminale attendues sont requises ; transaction annulée.';
  end if;

  if exists (select 1 from public.chapters where subject_offering_id in (${offeringList})) then
    raise exception 'Une structure Espagnol Terminale existe déjà dans au moins une offre cible : ré-audit requis avant toute écriture.';
  end if;

  for target in
    select o.id as offering_id,o.subject_id,o.level_id,o.series_id
    from public.course_subject_offerings o
    where o.id in (${offeringList})
    order by o.id
  loop
    insert into public.chapters (subject_id,level_id,series_id,subject_offering_id,title,description,display_order,is_active)
    values (target.subject_id,target.level_id,target.series_id,target.offering_id,'Compétence — Connaissance du monde hispanique','Compréhension orale : Espagne et Amérique hispanique ; contenus bilingues espagnol-français.',10,false)
    returning id into chapter_uuid;

${lessonSql}
  end loop;
end
$spanish_terminal_bilingual$;
`;

mkdirSync(dirname(migrationPath), { recursive: true });
writeFileSync(migrationPath, sql, "utf8");
writeFileSync(
  applyInputPath,
  JSON.stringify(
    {
      project_id: "nnshioowwniursnozicg",
      name: "espagnol_terminale_monde_hispanique_bilingual_drafts",
      query: sql,
    },
    null,
    2,
  ),
  "utf8",
);
console.log(migrationPath);
