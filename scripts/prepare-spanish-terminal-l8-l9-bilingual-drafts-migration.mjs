import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const migrationPath = resolve(
  "supabase/migrations/20260822_espagnol_terminale_raconter_resumer_bilingual_drafts.sql",
);
const applyInputPath = resolve(
  "supabase/migrations/20260822_espagnol_terminale_raconter_resumer_bilingual_drafts.apply.json",
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
    title: "Leçon 8 : Raconter un fait.",
    description:
      "Récit d’un fait vécu, vocabulaire de la narration et emplois des temps du récit espagnol.",
    content: String.raw`## Relatar un hecho

> **Traduction française :** Raconter un fait.

> **Objectif bilingue :** raconter oralement un fait vécu en organisant les personnages, les lieux, les actions et les temps du récit.

## 1. Situación de aprendizaje

> **Traduction française :** Situation d’apprentissage.

**La junta directiva del club de español participa en una fiesta en la residencia del Embajador de España en Costa de Marfil. Lo pasan muy bien y deciden relatar lo vivido a los demás miembros.**

> **Traduction française :** Le bureau du club d’espagnol participe à une fête à la résidence de l’ambassadeur d’Espagne en Côte d’Ivoire. Ses membres passent un très bon moment et décident de raconter ce qu’ils ont vécu aux autres membres.

Pour raconter un fait, commence par situer le moment et le lieu. Présente ensuite les personnes concernées, puis les actions dans un ordre compréhensible. Termine par le résultat ou le sentiment principal.

## 2. Vocabulario esencial

> **Traduction française :** Vocabulaire essentiel.

| Español | Traduction française et emploi |
|---|---|
| **relatar** | Raconter, relater. **Las novelas relatan hechos reales o imaginarios.**<br><br>**Traduction française :** Les romans racontent des faits réels ou imaginaires. |
| **el protagonista** | Le protagoniste, le personnage principal. **En un campo de fútbol, los protagonistas son los jugadores.**<br><br>**Traduction française :** Sur un terrain de football, les protagonistes sont les joueurs. |
| **una pesadilla** | Un cauchemar, par opposition à **un sueño agradable**, un rêve agréable. |
| **un hecho** | Un fait, un événement à raconter. |
| **el viaje / la llegada** | Le voyage / l’arrivée, deux repères utiles pour organiser un récit. |

## 3. Los elementos de un relato

> **Traduction française :** Les éléments d’un récit.

**Andrea, una joven estudiante, relata su viaje a Barcelona y cuenta lo que experimenta a su llegada.**

> **Traduction française :** Andrea, une jeune étudiante, raconte son voyage à Barcelone et ce qu’elle ressent à son arrivée.

Un récit comporte généralement des personnages, des lieux, des actions et des repères temporels. La fiche rappelle aussi que l’on peut citer les temps de la narration. Lorsque tu prépares une réponse orale, relève d’abord ces éléments puis transforme-les en phrases reliées.

| Elemento del relato | Traduction française | Question utile |
|---|---|---|
| **los personajes** | les personnages | **¿Quiénes participan?**<br><br>**Traduction française :** Qui participe ? |
| **los lugares** | les lieux | **¿Dónde ocurre el hecho?**<br><br>**Traduction française :** Où le fait se produit-il ? |
| **las acciones** | les actions | **¿Qué pasó?**<br><br>**Traduction française :** Que s’est-il passé ? |
| **los tiempos** | les temps / les repères temporels | **¿Cuándo ocurrió?**<br><br>**Traduction française :** Quand cela s’est-il produit ? |

## 4. Gramática: los tiempos del relato

> **Traduction française :** Grammaire : les temps du récit.

**Llegué a Barcelona a medianoche.**

> **Traduction française :** Je suis arrivée à Barcelone à minuit.

La fiche présente plusieurs temps qui ne servent pas tous à la même chose. Le choix dépend de la place de l’action dans le récit.

| Forma en español | Valeur dans la fiche | Exemple bilingue |
|---|---|---|
| **el presente de indicativo** | Situer une action au moment où l’on parle ou dans un futur proche. | **El profesor da una tarea de casa después de cada clase.**<br><br>**Traduction française :** Le professeur donne un devoir à la maison après chaque cours. |
| **el pretérito perfecto simple** | Action passée terminée. | **Me quedé sola en la gran acera.**<br><br>**Traduction française :** Je suis restée seule sur le grand trottoir. |
| **el pretérito imperfecto** | Action habituelle ou qui se prolongeait dans le passé. | **Todos los días me levantaba a las siete de la mañana.**<br><br>**Traduction française :** Tous les jours, je me levais à sept heures du matin. |
| **el pluscuamperfecto** | Action antérieure à une autre action passée. | **Quise pensar que me había equivocado de piso.**<br><br>**Traduction française :** J’ai voulu penser que je m’étais trompée d’étage. |

> **Attention :** le support associe le **pretérito perfecto compuesto** à une période qui continue ou à une action qui a un effet sur le présent. Il s’emploie notamment avec *hoy*, *esta semana*, *este año*, *nunca*, *siempre* ou *todavía*.

**Este año hemos trabajado mucho.**

> **Traduction française :** Cette année, nous avons beaucoup travaillé.

## 5. Método para relatar

> **Traduction française :** Méthode pour raconter.

1. **Primero, sitúa el hecho.**

   > **Traduction française :** D’abord, situe le fait.

2. **Después, presenta a los protagonistas y las acciones principales.**

   > **Traduction française :** Ensuite, présente les protagonistes et les actions principales.

3. **Por último, explica el resultado o lo que sentiste.**

   > **Traduction française :** Enfin, explique le résultat ou ce que tu as ressenti.

**Estaba anocheciendo cuando Manolo salió del instituto. Vio que se acercaba el autobús, pero cuando llegó a la parada, el autobús ya se había marchado.**

> **Traduction française :** La nuit tombait quand Manolo est sorti de l’institut. Il a vu que l’autobus s’approchait, mais lorsqu’il est arrivé à l’arrêt, l’autobus était déjà parti.

> **Synthèse :** raconter un fait consiste à sélectionner les éléments du récit et à employer les temps adaptés. Le vocabulaire de la narration, les personnages, les lieux et les actions rendent la restitution orale plus claire.

## Référence pédagogique

Contenu reformulé et structuré à partir du PDF fourni : **« Raconter un fait »**, Espagnol, Terminale, Côte d’Ivoire — École numérique.`,
    exerciseA: {
      title: "Exercice 1 — Vocabulario y elementos del relato",
      statement: bilingual(
        "Identifica el vocabulario y los elementos que permiten relatar un hecho.",
        "Identifie le vocabulaire et les éléments qui permettent de raconter un fait.",
      ),
      solution: bilingual(
        "La corrección distingue relatar, protagonista y pesadilla, así como personajes, lugares y acciones.",
        "La correction distingue relatar, protagonista et pesadilla, ainsi que les personnages, les lieux et les actions.",
      ),
      questions: [
        ["single_choice", bilingual("¿Qué significa *relatar*?", "Que signifie *relatar* ?"), [bilingualOption("Contar un hecho", "Raconter un fait"), bilingualOption("Hacer una pregunta", "Poser une question"), bilingualOption("Resumir un texto", "Résumer un texte")], [bilingualOption("Contar un hecho", "Raconter un fait")], bilingual("La ficha emplea *relatar* para contar hechos reales o imaginarios.", "La fiche emploie *relatar* pour raconter des faits réels ou imaginaires."), 10],
        ["single_choice", bilingual("¿Cuál es un elemento de un relato?", "Quel est un élément d’un récit ?"), [bilingualOption("Los personajes", "Les personnages"), bilingualOption("El precio", "Le prix"), bilingualOption("La beca", "La bourse")], [bilingualOption("Los personajes", "Les personnages")], bilingual("La situación de evaluación enumera los tiempos, los personajes, los lugares y las acciones.", "La situation d’évaluation énumère les temps, les personnages, les lieux et les actions."), 20],
        ["true_false", bilingual("Una pesadilla es lo contrario de un sueño agradable.", "Un cauchemar est le contraire d’un rêve agréable."), [bilingualOption("Verdadero", "Vrai"), bilingualOption("Falso", "Faux")], [bilingualOption("Verdadero", "Vrai")], bilingual("El vocabulario contrapone *una pesadilla* y *un sueño agradable*.", "Le vocabulaire oppose *una pesadilla* et *un sueño agradable* ."), 30],
      ],
    },
    exerciseB: {
      title: "Exercice 2 — Tiempos del relato",
      statement: bilingual(
        "Reconoce los tiempos de la narración y completa un relato en pasado.",
        "Reconnais les temps de la narration et complète un récit au passé.",
      ),
      solution: bilingual(
        "La corrección distingue una acción terminada, una acción habitual o en curso y una acción anterior a otro pasado.",
        "La correction distingue une action terminée, une action habituelle ou en cours et une action antérieure à un autre passé.",
      ),
      questions: [
        ["single_choice", bilingual("Completa: Ayer Manolo ___ del instituto.", "Complète : Hier, Manolo ___ de l’institut."), [bilingualOption("salió", "est sorti"), bilingualOption("salía siempre", "sortait toujours"), bilingualOption("ha salir", "a sortir")], [bilingualOption("salió", "est sorti")], bilingual("El pretérito perfecto simple expresa una acción pasada terminada: *Manolo salió*.", "Le prétérit simple exprime une action passée terminée : *Manolo salió* ."), 10],
        ["single_choice", bilingual("¿Qué tiempo expresa una acción habitual en el pasado?", "Quel temps exprime une action habituelle dans le passé ?"), [bilingualOption("El pretérito imperfecto", "L’imparfait"), bilingualOption("El presente", "Le présent"), bilingualOption("El futuro", "Le futur")], [bilingualOption("El pretérito imperfecto", "L’imparfait")], bilingual("La ficha ilustra el imperfecto con *Todos los días me levantaba...*.", "La fiche illustre l’imparfait avec *Todos los días me levantaba...* ."), 20],
        ["true_false", bilingual("*Ya se había marchado* expresa una acción anterior a otra acción pasada.", "*Ya se había marchado* exprime une action antérieure à une autre action passée."), [bilingualOption("Verdadero", "Vrai"), bilingualOption("Falso", "Faux")], [bilingualOption("Verdadero", "Vrai")], bilingual("El pluscuamperfecto sitúa una acción anterior a otro hecho pasado.", "Le plus-que-parfait situe une action antérieure à un autre fait passé."), 30],
      ],
    },
    quiz: {
      title: "Quiz bilingue — Relatar un hecho",
      questions: [
        [bilingual("¿Qué tiempo se usa para una acción pasada que concluyó?", "Quel temps utilise-t-on pour une action passée terminée ?"), bilingual("La ficha presenta el pretérito perfecto simple para una acción pasada concluida.", "La fiche présente le prétérit simple pour une action passée terminée."), [bilingualOption("El pretérito perfecto simple", "Le prétérit simple"), bilingualOption("El futuro", "Le futur")], 10],
        [bilingual("¿Qué hizo Andrea en el texto?", "Qu’a fait Andrea dans le texte ?"), bilingual("El resumen indica que Andrea relata su viaje a Barcelona.", "Le résumé indique qu’Andrea raconte son voyage à Barcelone."), [bilingualOption("Relató su viaje a Barcelona", "Elle a raconté son voyage à Barcelone"), bilingualOption("Organizó una beca Erasmus", "Elle a organisé une bourse Erasmus")], 20],
        [bilingual("¿Cuál es el contrario de *un sueño agradable*?", "Quel est le contraire de *un sueño agradable* ?"), bilingual("El vocabulario presenta *una pesadilla* como término opuesto.", "Le vocabulaire présente *una pesadilla* comme terme opposé."), [bilingualOption("Una pesadilla", "Un cauchemar"), bilingualOption("Un protagonista", "Un protagoniste")], 30],
        [bilingual("¿Qué debe aparecer en una narración clara?", "Que doit contenir une narration claire ?"), bilingual("La ficha cita personajes, lugares, acciones y tiempos del relato.", "La fiche cite les personnages, les lieux, les actions et les temps du récit."), [bilingualOption("Personajes, lugares y acciones", "Personnages, lieux et actions"), bilingualOption("Solo una fecha", "Seulement une date")], 40],
      ],
    },
  },
  {
    title: "Leçon 9 : Résumer.",
    description:
      "Sélection de l’essentiel d’un récit, vocabulaire des bourses Erasmus et expressions espagnoles de résumé.",
    content: String.raw`## Resumir

> **Traduction française :** Résumer.

> **Objectif bilingue :** sélectionner les informations essentielles d’un récit et employer les expressions espagnoles adaptées pour les présenter brièvement.

## 1. Situación de aprendizaje

> **Traduction française :** Situation d’apprentissage.

**Un alumno de Terminal acaba de llegar de un viaje turístico a España ofrecido por la Embajada de España. Quiere contar los momentos más importantes de su estancia a los miembros del club de español.**

> **Traduction française :** Un élève de Terminale vient de revenir d’un voyage touristique en Espagne offert par l’ambassade d’Espagne. Il souhaite raconter les moments les plus importants de son séjour aux membres du club d’espagnol.

Résumer ne consiste pas à répéter toutes les phrases d’un document. Il faut conserver les informations centrales, supprimer les détails secondaires et employer un connecteur qui annonce la synthèse.

## 2. Vocabulario esencial

> **Traduction française :** Vocabulaire essentiel.

| Español | Traduction française et emploi |
|---|---|
| **resumir** | Résumer, réduire à l’essentiel. **Cuando una lección es demasiado larga, el profesor la resume.**<br><br>**Traduction française :** Lorsqu’une leçon est trop longue, le professeur la résume. |
| **una beca** | Une bourse. **Los estudiantes pueden solicitar becas para estudiar en otros países.**<br><br>**Traduction française :** Les étudiants peuvent demander des bourses pour étudier dans d’autres pays. |
| **Erasmus** | Programme d’échange entre étudiants d’universités européennes, tel qu’il est présenté par la fiche. |
| **lo esencial** | L’essentiel : ce qu’il faut retenir en priorité. |
| **los sentimientos** | Les sentiments, utiles pour résumer l’état d’esprit d’un narrateur. |

## 3. Comprender el texto Erasmus

> **Traduction française :** Comprendre le texte Erasmus.

**Un joven que obtuvo una beca para estudiar en Bélgica cuenta la despedida con su familia, el viaje hasta su destino y los sentimientos que experimenta.**

> **Traduction française :** Un jeune homme qui a obtenu une bourse pour étudier en Belgique raconte ses adieux à sa famille, son voyage jusqu’à destination et les sentiments qu’il éprouve.

Le résumé proposé par la fiche fait apparaître deux idées principales : le départ pour les études grâce à une bourse Erasmus, puis des sentiments contradictoires de joie et de tristesse. Garde ces idées essentielles au lieu d’énumérer tous les détails du voyage.

## 4. Expresiones para resumir

> **Traduction française :** Expressions pour résumer.

La fiche fournit plusieurs expressions qui introduisent une synthèse. Elles peuvent être placées au début d’une phrase ou servir à conclure une idée.

| Expresión en español | Traduction française | Exemple bilingue |
|---|---|---|
| **en resumen** | en résumé | **En resumen, el texto presenta un viaje y sentimientos contradictorios.**<br><br>**Traduction française :** En résumé, le texte présente un voyage et des sentiments contradictoires. |
| **en resumidas cuentas** | tout bien considéré / en résumé | **En resumidas cuentas, fue un partido lleno de suspenso.**<br><br>**Traduction française :** En résumé, ce fut un match plein de suspense. |
| **en pocas palabras** | en peu de mots | **En pocas palabras, el estudiante va a Bélgica con una beca Erasmus.**<br><br>**Traduction française :** En quelques mots, l’étudiant part en Belgique avec une bourse Erasmus. |
| **en suma / en definitiva** | en somme / en définitive | **En definitiva, nunca se habían dejado de extrañar.**<br><br>**Traduction française :** En définitive, ils n’avaient jamais cessé de se manquer. |
| **globalmente / por fin** | globalement / enfin | **Globalmente, fue un partido difícil.**<br><br>**Traduction française :** Globalement, ce fut un match difficile. |

> **Attention :** une expression de résumé annonce une idée essentielle. Elle ne remplace pas l’organisation du résumé : conserve le sujet, le fait principal et, si nécessaire, le sentiment ou le résultat.

## 5. Método para resumir

> **Traduction française :** Méthode pour résumer.

1. **Identifica el tema y las informaciones principales.**

   > **Traduction française :** Identifie le thème et les informations principales.

2. **Elimina los detalles que no cambian el sentido general.**

   > **Traduction française :** Écarte les détails qui ne changent pas le sens général.

3. **Introduce tu síntesis con una expresión para resumir.**

   > **Traduction française :** Introduis ta synthèse par une expression pour résumer.

**En pocas palabras, el joven se va a Bélgica para estudiar con una beca Erasmus; siente alegría por su independencia y tristeza o temor ante la soledad.**

> **Traduction française :** En quelques mots, le jeune homme part étudier en Belgique avec une bourse Erasmus ; il ressent de la joie pour son indépendance et de la tristesse ou de la crainte face à la solitude.

> **Synthèse :** résumer consiste à dire l’essentiel. Le vocabulaire de la bourse et d’Erasmus aide à comprendre le support, tandis que les connecteurs comme *en pocas palabras*, *en suma* ou *en definitiva* rendent la synthèse claire à l’oral.

## Référence pédagogique

Contenu reformulé et structuré à partir du PDF fourni : **« Résumer »**, Espagnol, Terminale, Côte d’Ivoire — École numérique.`,
    exerciseA: {
      title: "Exercice 1 — Vocabulario del resumen",
      statement: bilingual(
        "Relaciona el vocabulario de la ficha con su significado y con el texto Erasmus.",
        "Relie le vocabulaire de la fiche à son sens et au texte Erasmus.",
      ),
      solution: bilingual(
        "La corrección relaciona resumir con decir lo esencial, beca con ayuda financiera y Erasmus con intercambio de estudiantes.",
        "La correction associe resumir à dire l’essentiel, beca à une aide financière et Erasmus à un échange d’étudiants.",
      ),
      questions: [
        ["single_choice", bilingual("¿Qué significa *resumir*?", "Que signifie *resumir* ?"), [bilingualOption("Decir lo esencial", "Dire l’essentiel"), bilingualOption("Contar todos los detalles", "Raconter tous les détails"), bilingualOption("Hacer una descripción física", "Faire une description physique")], [bilingualOption("Decir lo esencial", "Dire l’essentiel")], bilingual("La ficha define *resumir* como reducir y decir lo esencial.", "La fiche définit *resumir* comme réduire et dire l’essentiel."), 10],
        ["single_choice", bilingual("¿Qué es una beca?", "Qu’est-ce qu’une bourse ?"), [bilingualOption("Una ayuda para estudiar", "Une aide pour étudier"), bilingualOption("Una pesadilla", "Un cauchemar"), bilingualOption("Un lugar", "Un lieu")], [bilingualOption("Una ayuda para estudiar", "Une aide pour étudier")], bilingual("Los estudiantes pueden solicitar becas para ir a estudiar en otros países.", "Les étudiants peuvent demander des bourses pour aller étudier dans d’autres pays."), 20],
        ["true_false", bilingual("Erasmus promueve el intercambio de estudiantes entre universidades europeas.", "Erasmus favorise l’échange d’étudiants entre universités européennes."), [bilingualOption("Verdadero", "Vrai"), bilingualOption("Falso", "Faux")], [bilingualOption("Verdadero", "Vrai")], bilingual("La definición de la ficha presenta Erasmus como un programa de intercambio de estudiantes.", "La définition de la fiche présente Erasmus comme un programme d’échange d’étudiants."), 30],
      ],
    },
    exerciseB: {
      title: "Exercice 2 — Expresiones para resumir",
      statement: bilingual(
        "Elige y utiliza una expresión adecuada para introducir un resumen.",
        "Choisis et utilise une expression appropriée pour introduire un résumé.",
      ),
      solution: bilingual(
        "La corrección usa en pocas palabras, en definitiva, en suma y globalmente para presentar lo esencial.",
        "La correction utilise en pocas palabras, en definitiva, en suma et globalmente pour présenter l’essentiel.",
      ),
      questions: [
        ["single_choice", bilingual("¿Qué expresión introduce una síntesis breve?", "Quelle expression introduit une synthèse brève ?"), [bilingualOption("En pocas palabras", "En quelques mots"), bilingualOption("Sin embargo", "Cependant"), bilingualOption("¿Cuándo?", "Quand ?")], [bilingualOption("En pocas palabras", "En quelques mots")], bilingual("La ficha incluye *en pocas palabras* entre las expresiones para resumir.", "La fiche inclut *en pocas palabras* parmi les expressions pour résumer."), 10],
        ["single_choice", bilingual("Completa: ___, el texto trata de un estudiante que va a Bélgica con una beca Erasmus.", "Complète : ___, le texte parle d’un étudiant qui part en Belgique avec une bourse Erasmus."), [bilingualOption("En pocas palabras", "En quelques mots"), bilingualOption("Una pesadilla", "Un cauchemar"), bilingualOption("El protagonista", "Le protagoniste")], [bilingualOption("En pocas palabras", "En quelques mots")], bilingual("La respuesta modelo de la ficha empieza con *En pocas palabras*.", "La réponse modèle de la fiche commence par *En pocas palabras* ."), 20],
        ["true_false", bilingual("*En definitiva* puede introducir una conclusión o una síntesis.", "*En definitiva* peut introduire une conclusion ou une synthèse."), [bilingualOption("Verdadero", "Vrai"), bilingualOption("Falso", "Faux")], [bilingualOption("Verdadero", "Vrai")], bilingual("La regla cita *en definitiva* entre las expresiones para resumir.", "La règle cite *en definitiva* parmi les expressions pour résumer."), 30],
      ],
    },
    quiz: {
      title: "Quiz bilingue — Resumir",
      questions: [
        [bilingual("¿Qué debe conservar un resumen?", "Que doit conserver un résumé ?"), bilingual("Resumir consiste en decir lo esencial del texto.", "Résumer consiste à dire l’essentiel du texte."), [bilingualOption("Las informaciones esenciales", "Les informations essentielles"), bilingualOption("Todos los detalles", "Tous les détails")], 10],
        [bilingual("¿Adónde se va el joven del texto Erasmus?", "Où part le jeune homme du texte Erasmus ?"), bilingual("El resumen de la ficha indica que se va a Bélgica para sus estudios.", "Le résumé de la fiche indique qu’il part en Belgique pour ses études."), [bilingualOption("A Bélgica", "En Belgique"), bilingualOption("A Barcelona", "À Barcelone")], 20],
        [bilingual("¿Qué sentimientos resume la ficha?", "Quels sentiments la fiche résume-t-elle ?"), bilingual("La respuesta menciona la alegría y la tristeza como sentimientos contradictorios.", "La réponse mentionne la joie et la tristesse comme sentiments contradictoires."), [bilingualOption("La alegría y la tristeza", "La joie et la tristesse"), bilingualOption("El miedo y la ira únicamente", "La peur et la colère uniquement")], 30],
        [bilingual("¿Cuál es una expresión para resumir?", "Quelle est une expression pour résumer ?"), bilingual("La ficha ofrece *en suma* entre sus expresiones de resumen.", "La fiche propose *en suma* parmi ses expressions de résumé."), [bilingualOption("En suma", "En somme"), bilingualOption("Más feo que", "Plus laid que")], 40],
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

function renderLessonSql(lesson, lessonOrderSql) {
  const questionsA = renderExerciseQuestions("exercise_a_uuid", lesson.exerciseA.questions);
  const questionsB = renderExerciseQuestions("exercise_b_uuid", lesson.exerciseB.questions);
  const quizQuestions = renderQuizQuestions(lesson.quiz);
  const quizAnswers = renderQuizAnswers(lesson.quiz);

  return `
    lesson_uuid := null;
    insert into public.lessons (chapter_id,title,description,content,display_order,is_active)
    values (exchange_chapter_uuid,${sqlText(lesson.title)},${sqlText(lesson.description)},$lesson_content$
${lesson.content}
$lesson_content$,${lessonOrderSql},false)
    returning id into lesson_uuid;
    if lesson_uuid is null then
      raise exception 'Création de leçon Espagnol impossible : %.', ${sqlText(lesson.title)};
    end if;

    exercise_a_uuid := null;
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
    values (target.subject_id,target.level_id,target.series_id,exchange_chapter_uuid,lesson_uuid,${sqlText(lesson.exerciseA.title)},${sqlText(lesson.exerciseA.statement)},${sqlText(lesson.exerciseA.solution)},'single_choice','easy',${sqlText(bilingual("Responde en español y lee inmediatamente la traducción francesa de cada elemento.", "Réponds en espagnol et lis immédiatement la traduction française de chaque élément."))},${sqlText(bilingual("Comprueba el vocabulario, la estructura y la traducción francesa asociada.", "Vérifie le vocabulaire, la structure et la traduction française associée."))},false,false,20,10)
    returning id into exercise_a_uuid;
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
${questionsA};

    exercise_b_uuid := null;
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
    values (target.subject_id,target.level_id,target.series_id,exchange_chapter_uuid,lesson_uuid,${sqlText(lesson.exerciseB.title)},${sqlText(lesson.exerciseB.statement)},${sqlText(lesson.exerciseB.solution)},'single_choice','medium',${sqlText(bilingual("Analiza la frase en español y su traducción francesa inmediata.", "Analyse la phrase en espagnol et sa traduction française immédiate."))},${sqlText(bilingual("Explica la regla en español y comprueba la traducción francesa.", "Explique la règle en espagnol et vérifie la traduction française."))},false,false,25,20)
    returning id into exercise_b_uuid;
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
${questionsB};

    quiz_uuid := null;
    insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active)
    values (target.subject_id,target.level_id,target.series_id,target.offering_id,exchange_chapter_uuid,lesson_uuid,${sqlText(lesson.quiz.title)},${sqlText(bilingual("Verifica tus conocimientos con preguntas en español y traducción francesa inmediata.", "Vérifie tes connaissances avec des questions en espagnol et une traduction française immédiate."))},'medium',12,10,false,false)
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

const offeringList = offeringIds.map(sqlText).join(", ");
const targetTitles = lessons.map((lesson) => sqlText(lesson.title)).join(", ");

const sql = `-- Brouillons bilingues Espagnol Terminale : raconter un fait et résumer.
-- Toute formulation pédagogique espagnole est suivie de sa traduction française immédiate.
-- Les contenus existants sont préservés ; toute leçon cible déjà présente annule la migration.
do $spanish_terminal_l8_l9_bilingual$
declare
  target record;
  exchange_chapter_uuid uuid;
  lesson_uuid uuid;
  exercise_a_uuid uuid;
  exercise_b_uuid uuid;
  quiz_uuid uuid;
  first_lesson_order integer;
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

  for target in
    select o.id as offering_id,o.subject_id,o.level_id,o.series_id
    from public.course_subject_offerings o
    where o.id in (${offeringList})
    order by o.id
  loop
    select id into exchange_chapter_uuid
    from public.chapters
    where subject_offering_id=target.offering_id
      and title='Compétence — Échange d’information'
    limit 1;
    if exchange_chapter_uuid is null then
      raise exception 'Le chapitre Espagnol « Échange d’information » est absent pour l’offre %.', target.offering_id;
    end if;

    select coalesce(max(display_order),0)+10 into first_lesson_order
    from public.lessons
    where chapter_id=exchange_chapter_uuid;

${renderLessonSql(lessons[0], "first_lesson_order")}
${renderLessonSql(lessons[1], "first_lesson_order + 10")}
  end loop;
end
$spanish_terminal_l8_l9_bilingual$;
`;

mkdirSync(dirname(migrationPath), { recursive: true });
writeFileSync(migrationPath, sql, "utf8");
writeFileSync(
  applyInputPath,
  JSON.stringify(
    {
      project_id: "nnshioowwniursnozicg",
      name: "espagnol_terminale_raconter_resumer_bilingual_drafts",
      query: sql,
    },
    null,
    2,
  ),
  "utf8",
);
console.log(migrationPath);
