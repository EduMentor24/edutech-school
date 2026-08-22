-- Brouillons bilingues Espagnol Terminale : monde hispanique.
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
  where id in ('942aacbc-1f0c-4eea-9f61-04560b3f3578', '48880a58-de13-4485-a45d-ab716b4ca645', '0e028469-a443-4b7d-9ed9-6a675193fc24', 'd496a111-1324-4f92-b557-f5bb402f6bac');
  if offering_count <> 4 then
    raise exception 'Les quatre offres Espagnol Terminale attendues sont requises ; transaction annulée.';
  end if;

  if exists (select 1 from public.chapters where subject_offering_id in ('942aacbc-1f0c-4eea-9f61-04560b3f3578', '48880a58-de13-4485-a45d-ab716b4ca645', '0e028469-a443-4b7d-9ed9-6a675193fc24', 'd496a111-1324-4f92-b557-f5bb402f6bac')) then
    raise exception 'Une structure Espagnol Terminale existe déjà dans au moins une offre cible : ré-audit requis avant toute écriture.';
  end if;

  for target in
    select o.id as offering_id,o.subject_id,o.level_id,o.series_id
    from public.course_subject_offerings o
    where o.id in ('942aacbc-1f0c-4eea-9f61-04560b3f3578', '48880a58-de13-4485-a45d-ab716b4ca645', '0e028469-a443-4b7d-9ed9-6a675193fc24', 'd496a111-1324-4f92-b557-f5bb402f6bac')
    order by o.id
  loop
    insert into public.chapters (subject_id,level_id,series_id,subject_offering_id,title,description,display_order,is_active)
    values (target.subject_id,target.level_id,target.series_id,target.offering_id,'Compétence — Connaissance du monde hispanique','Compréhension orale : Espagne et Amérique hispanique ; contenus bilingues espagnol-français.',10,false)
    returning id into chapter_uuid;


    lesson_uuid := null;
    insert into public.lessons (chapter_id,title,description,content,display_order,is_active)
    values (chapter_uuid,'Leçon 2 : Connaître les réalités politiques, sociales et historiques de l’Espagne.','Guerre civile, franquisme, mémoire historique, vocabulaire associé et corrélation des temps avec les verbes de volonté.',$lesson_content$
## Conocer las realidades políticas, sociales e históricas de España

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

Contenu reformulé et structuré à partir du PDF fourni : **« Connaître les réalités politiques, sociales et historiques de l’Espagne »**, Espagnol, Terminale, Côte d’Ivoire — École numérique.
$lesson_content$,20,false)
    returning id into lesson_uuid;
    if lesson_uuid is null then
      raise exception 'Création de leçon Espagnol impossible : %.', 'Leçon 2 : Connaître les réalités politiques, sociales et historiques de l’Espagne.';
    end if;

    exercise_a_uuid := null;
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
    values (target.subject_id,target.level_id,target.series_id,chapter_uuid,lesson_uuid,'Exercice 1 — Memoria histórica y vocabulario','Identifica el vocabulario de la memoria histórica y responde a las preguntas de comprensión.

> **Traduction française :** Identifie le vocabulaire de la mémoire historique et réponds aux questions de compréhension.','La corrección relaciona franquismo, desaparecido y exhumar con el resumen del documento.

> **Traduction française :** La correction relie franquisme, disparu et exhumer au résumé du document.','single_choice','easy','Responde en español y lee inmediatamente la traducción francesa de cada elemento.

> **Traduction française :** Réponds en espagnol et lis immédiatement la traduction française de chaque élément.','Comprueba el vocabulario, la estructura y la traducción francesa associée.

> **Traduction française :** Vérifie le vocabulaire, la structure et la traduction française associée.',false,false,20,10)
    returning id into exercise_a_uuid;
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
      (exercise_a_uuid,'single_choice','¿Qué significa *exhumar*?

> **Traduction française :** Que signifie *exhumar* ?',jsonb_build_array('Sacar un cuerpo de la tumba
— Traduction française : Sortir un corps de la tombe', 'Construir una escuela
— Traduction française : Construire une école', 'Olvidar una fecha
— Traduction française : Oublier une date'),jsonb_build_array('Sacar un cuerpo de la tumba
— Traduction française : Sortir un corps de la tombe'),'*Exhumar* se emplea para recuperar un cuerpo enterrado.

> **Traduction française :** *Exhumar* s’emploie pour récupérer un corps enterré.',10),
      (exercise_a_uuid,'single_choice','¿Qué dos períodos cita el documento?

> **Traduction française :** Quelles sont les deux périodes citées par le document ?',jsonb_build_array('La guerra civil y el franquismo
— Traduction française : La guerre civile et le franquisme', 'La conquista y la revolución industrial
— Traduction française : La conquête et la révolution industrielle', 'La Edad Media y el Renacimiento
— Traduction française : Le Moyen Âge et la Renaissance'),jsonb_build_array('La guerra civil y el franquismo
— Traduction française : La guerre civile et le franquisme'),'El soporte cita la guerra civil y la posterior dictadura franquista.

> **Traduction française :** Le support cite la guerre civile et la dictature franquiste qui l’a suivie.',20),
      (exercise_a_uuid,'true_false','Las Asociaciones ayudaron facilitando datos para las investigaciones.

> **Traduction française :** Les associations ont aidé en facilitant des informations pour les enquêtes.',jsonb_build_array('Verdadero
— Traduction française : Vrai', 'Falso
— Traduction française : Faux'),jsonb_build_array('Verdadero
— Traduction française : Vrai'),'El resumen explica que las asociaciones daban datos para facilitar las investigaciones.

> **Traduction française :** Le résumé explique que les associations fournissaient des informations pour faciliter les enquêtes.',30);

    exercise_b_uuid := null;
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
    values (target.subject_id,target.level_id,target.series_id,chapter_uuid,lesson_uuid,'Exercice 2 — Verbos de voluntad y subjuntivo','Aplica la correlación de tiempos con los verbos de voluntad.

> **Traduction française :** Applique la corrélation des temps avec les verbes de volonté.','La corrección distingue el presente de subjuntivo y el imperfecto de subjuntivo según el verbo principal.

> **Traduction française :** La correction distingue le présent du subjonctif et l’imparfait du subjonctif selon le verbe principal.','single_choice','medium','Analiza la frase en español y su traducción francesa immédiate.

> **Traduction française :** Analyse la phrase en espagnol et sa traduction française immédiate.','Explica la regla en español y comprueba la traduction française.

> **Traduction française :** Explique la règle en espagnol et vérifie la traduction française.',false,false,25,20)
    returning id into exercise_b_uuid;
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
      (exercise_b_uuid,'single_choice','Los jóvenes quieren que se ___ sus demandas.

> **Traduction française :** Les jeunes veulent que leurs revendications soient ___ .',jsonb_build_array('escuchen
— Traduction française : écoutées', 'escuchaban
— Traduction française : écoutées (imparfait)', 'escuchar
— Traduction française : écouter'),jsonb_build_array('escuchen
— Traduction française : écoutées'),'Después de *quieren que*, el documento emplea *se escuchen* en presente de subjuntivo.

> **Traduction française :** Après *quieren que*, le document emploie *se escuchen* au présent du subjonctif.',10),
      (exercise_b_uuid,'single_choice','Los jóvenes querían que sus demandas ___ importancia.

> **Traduction française :** Les jeunes voulaient que leurs revendications ___ de l’importance.',jsonb_build_array('tuvieran
— Traduction française : aient (imparfait du subjonctif)', 'tienen
— Traduction française : ont', 'tener
— Traduction française : avoir'),jsonb_build_array('tuvieran
— Traduction française : aient (imparfait du subjonctif)'),'Con *querían*, el soporte usa *tuvieran*, imperfecto de subjuntivo.

> **Traduction française :** Avec *querían*, le support utilise *tuvieran*, imparfait du subjonctif.',20),
      (exercise_b_uuid,'true_false','Después de un verbo de voluntad, la subordinada está en subjuntivo en la regla estudiada.

> **Traduction française :** Après un verbe de volonté, la subordonnée est au subjonctif dans la règle étudiée.',jsonb_build_array('Verdadero
— Traduction française : Vrai', 'Falso
— Traduction française : Faux'),jsonb_build_array('Verdadero
— Traduction française : Vrai'),'La règle du PDF formule précisément cet emploi du subjonctif.

> **Traduction française :** La règle du PDF formule précisément cet emploi du subjonctif.',30);

    quiz_uuid := null;
    insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active)
    values (target.subject_id,target.level_id,target.series_id,target.offering_id,chapter_uuid,lesson_uuid,'Quiz bilingue — España: memoria histórica','Verifica tus conocimientos con preguntas en español y traducción française immédiate.

> **Traduction française :** Vérifie tes connaissances avec des questions en espagnol et une traduction française immédiate.','medium',12,10,false,false)
    returning id into quiz_uuid;
    with inserted_questions as (
      insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
        (quiz_uuid,'¿Qué significa *una sepultura digna*?

> **Traduction française :** Que signifie *una sepultura digna* ?','La expresión se refiere a un entierro respetuoso.

> **Traduction française :** L’expression désigne un enterrement respectueux.','single_choice',10,1,true),
        (quiz_uuid,'¿Qué verbo expresa la recuperación de cuerpos enterrados?

> **Traduction française :** Quel verbe exprime la récupération de corps enterrés ?','El vocabulario del PDF emplea *exhumar*.

> **Traduction française :** Le vocabulaire du PDF emploie *exhumar*.','single_choice',20,1,true),
        (quiz_uuid,'¿Qué modo sigue a un verbo de voluntad según la regla?

> **Traduction française :** Quel mode suit un verbe de volonté selon la règle ?','La subordinada está en subjuntivo.

> **Traduction française :** La subordonnée est au subjonctif.','single_choice',30,1,true),
        (quiz_uuid,'¿Qué información deben identificar los alumnos?

> **Traduction française :** Quelle information les élèves doivent-ils identifier ?','Deben identificar acontecimientos históricos, sociales y políticos mencionados por el soporte.

> **Traduction française :** Ils doivent identifier les événements historiques, sociaux et politiques mentionnés par le support.','single_choice',40,1,true)
      returning id,display_order
    )
    insert into public.quiz_answers (question_id,answer,is_correct,display_order)
    select inserted_questions.id,answers.answer,answers.is_correct,answers.display_order
    from inserted_questions
    join (values
        (10,'Un entierro respetuoso
— Traduction française : Un enterrement respectueux',true,10),
        (10,'Un viaje peligroso
— Traduction française : Un voyage dangereux',false,20),
        (20,'exhumar
— Traduction française : exhumer',true,10),
        (20,'emigrar
— Traduction française : émigrer',false,20),
        (30,'El subjuntivo
— Traduction française : Le subjonctif',true,10),
        (30,'El infinitivo solamente
— Traduction française : L’infinitif uniquement',false,20),
        (40,'Acontecimientos históricos, sociales y políticos
— Traduction française : Des événements historiques, sociaux et politiques',true,10),
        (40,'Recetas de cocina
— Traduction française : Des recettes de cuisine',false,20)
    ) as answers(question_order,answer,is_correct,display_order)
      on answers.question_order=inserted_questions.display_order;


    lesson_uuid := null;
    insert into public.lessons (chapter_id,title,description,content,display_order,is_active)
    values (chapter_uuid,'Leçon 3 : Connaître les réalités sociales et historiques de l’Amérique hispanique.','Civilisations précolombiennes, vocabulaire associé, repères étudiés et superlatif relatif.',$lesson_content$
## Conocer las realidades sociales e históricas de América hispánica

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

Contenu reformulé et structuré à partir du PDF fourni : **« Connaître les réalités sociales et historiques de l’Amérique hispanique »**, Espagnol, Terminale, Côte d’Ivoire — École numérique.
$lesson_content$,30,false)
    returning id into lesson_uuid;
    if lesson_uuid is null then
      raise exception 'Création de leçon Espagnol impossible : %.', 'Leçon 3 : Connaître les réalités sociales et historiques de l’Amérique hispanique.';
    end if;

    exercise_a_uuid := null;
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
    values (target.subject_id,target.level_id,target.series_id,chapter_uuid,lesson_uuid,'Exercice 1 — Civilizaciones precolombinas','Identifica las civilizaciones precolombinas y relaciona cada información con el pueblo correspondiente.

> **Traduction française :** Identifie les civilisations précolombiennes et relie chaque information au peuple correspondant.','La corrección distingue Aztecas, Mayas e Incas con los datos citados en la ficha.

> **Traduction française :** La correction distingue les Aztèques, les Mayas et les Incas à l’aide des éléments cités dans la fiche.','single_choice','easy','Responde en español y lee inmediatamente la traducción francesa de cada elemento.

> **Traduction française :** Réponds en espagnol et lis immédiatement la traduction française de chaque élément.','Comprueba el vocabulario, la estructura y la traducción francesa associée.

> **Traduction française :** Vérifie le vocabulaire, la structure et la traduction française associée.',false,false,20,10)
    returning id into exercise_a_uuid;
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
      (exercise_a_uuid,'single_choice','¿Qué civilización tenía Tenochtitlan como capital según la actividad?

> **Traduction française :** Quelle civilisation avait Tenochtitlan pour capitale selon l’activité ?',jsonb_build_array('Los Aztecas
— Traduction française : Les Aztèques', 'Los Mayas
— Traduction française : Les Mayas', 'Los Incas
— Traduction française : Les Incas'),jsonb_build_array('Los Aztecas
— Traduction française : Les Aztèques'),'La actividad asocia Tenochtitlan con los Aztecas.

> **Traduction française :** L’activité associe Tenochtitlan aux Aztèques.',10),
      (exercise_a_uuid,'single_choice','¿Qué pueblo era famoso por sus conocimientos científicos y astronómicos?

> **Traduction française :** Quel peuple était célèbre pour ses connaissances scientifiques et astronomiques ?',jsonb_build_array('Los Mayas
— Traduction française : Les Mayas', 'Los Aztecas
— Traduction française : Les Aztèques', 'Los Incas
— Traduction française : Les Incas'),jsonb_build_array('Los Mayas
— Traduction française : Les Mayas'),'El resumen atribuye esos conocimientos a los Mayas.

> **Traduction française :** Le résumé attribue ces connaissances aux Mayas.',20),
      (exercise_a_uuid,'true_false','El Machu Picchu era el lugar sagrado más importante de los Incas en el documento.

> **Traduction française :** Le Machu Picchu était le lieu sacré le plus important des Incas dans le document.',jsonb_build_array('Verdadero
— Traduction française : Vrai', 'Falso
— Traduction française : Faux'),jsonb_build_array('Verdadero
— Traduction française : Vrai'),'La ficha presenta el Machu Picchu como el lugar sagrado más importante de los Incas.

> **Traduction française :** La fiche présente le Machu Picchu comme le lieu sacré le plus important des Incas.',30);

    exercise_b_uuid := null;
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
    values (target.subject_id,target.level_id,target.series_id,chapter_uuid,lesson_uuid,'Exercice 2 — El superlativo relativo','Reconoce y emplea el superlativo relativo en frases sobre el mundo hispánico.

> **Traduction française :** Reconnais et emploie le superlatif relatif dans des phrases sur le monde hispanique.','La corrección aplica el/la más o menos + adjetivo y reconoce mejor, peor, mayor y menor.

> **Traduction française :** La correction applique el/la más ou menos + adjectif et reconnaît mejor, peor, mayor et menor.','single_choice','medium','Analiza la frase en español y su traducción francesa immédiate.

> **Traduction française :** Analyse la phrase en espagnol et sa traduction française immédiate.','Explica la regla en español y comprueba la traduction française.

> **Traduction française :** Explique la règle en espagnol et vérifie la traduction française.',false,false,25,20)
    returning id into exercise_b_uuid;
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
      (exercise_b_uuid,'single_choice','¿Cuál es la forma correcta del superlativo relativo?

> **Traduction française :** Quelle est la forme correcte du superlatif relatif ?',jsonb_build_array('el más importante
— Traduction française : le plus important', 'muy importante de
— Traduction française : très important de', 'más importante que todos sin artículo
— Traduction française : plus important que tous sans article'),jsonb_build_array('el más importante
— Traduction française : le plus important'),'La regla combina el artículo con *más* y el adjetivo.

> **Traduction française :** La règle associe l’article à *más* et à l’adjectif.',10),
      (exercise_b_uuid,'single_choice','¿Qué significa *el peor*?

> **Traduction française :** Que signifie *el peor* ?',jsonb_build_array('le pire
— Traduction française : le pire', 'le meilleur
— Traduction française : le meilleur', 'le plus grand
— Traduction française : le plus grand'),jsonb_build_array('le pire
— Traduction française : le pire'),'La ficha presenta *el peor* como equivalente de *el más malo*.

> **Traduction française :** La fiche présente *el peor* comme l’équivalent de *el más malo*.',20),
      (exercise_b_uuid,'true_false','*El menor* puede expresar el más pequeño.

> **Traduction française :** *El menor* peut exprimer le plus petit.',jsonb_build_array('Verdadero
— Traduction française : Vrai', 'Falso
— Traduction française : Faux'),jsonb_build_array('Verdadero
— Traduction française : Vrai'),'El documento da *el menor* como forma posible para *el más pequeño*.

> **Traduction française :** Le document donne *el menor* comme forme possible de *el más pequeño*.',30);

    quiz_uuid := null;
    insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active)
    values (target.subject_id,target.level_id,target.series_id,target.offering_id,chapter_uuid,lesson_uuid,'Quiz bilingue — América precolombina','Verifica tus conocimientos con preguntas en español y traducción française immédiate.

> **Traduction française :** Vérifie tes connaissances avec des questions en espagnol et une traduction française immédiate.','medium',12,10,false,false)
    returning id into quiz_uuid;
    with inserted_questions as (
      insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
        (quiz_uuid,'¿Qué tres civilizaciones cita la ficha?

> **Traduction française :** Quelles trois civilisations la fiche cite-t-elle ?','La ficha nombra Aztecas, Mayas e Incas.

> **Traduction française :** La fiche nomme les Aztèques, les Mayas et les Incas.','single_choice',10,1,true),
        (quiz_uuid,'¿Qué significa *precolombino* en el contexto estudiado?

> **Traduction française :** Que signifie *precolombino* dans le contexte étudié ?','Se refiere al periodo anterior a la llegada de Cristóbal Colón indicada por el documento.

> **Traduction française :** Il désigne la période antérieure à l’arrivée de Christophe Colomb indiquée par le document.','single_choice',20,1,true),
        (quiz_uuid,'¿Qué expresión forma un superlativo relativo?

> **Traduction française :** Quelle expression forme un superlatif relatif ?','La construcción es *el más + adjetivo* o *el menos + adjetivo*.

> **Traduction française :** La construction est *el más + adjectif* ou *el menos + adjectif* .','single_choice',30,1,true),
        (quiz_uuid,'¿Qué término nombra al sacerdote o curandero con poderes sobrenaturales?

> **Traduction française :** Quel terme désigne le prêtre ou guérisseur doté de pouvoirs surnaturels ?','El vocabulario del soporte cita *el chamán*.

> **Traduction française :** Le vocabulaire du support cite *el chamán*.','single_choice',40,1,true)
      returning id,display_order
    )
    insert into public.quiz_answers (question_id,answer,is_correct,display_order)
    select inserted_questions.id,answers.answer,answers.is_correct,answers.display_order
    from inserted_questions
    join (values
        (10,'Aztecas, Mayas e Incas
— Traduction française : Aztèques, Mayas et Incas',true,10),
        (10,'Romanos, Griegos y Egipcios
— Traduction française : Romains, Grecs et Égyptiens',false,20),
        (20,'Anterior a la llegada de Cristóbal Colón
— Traduction française : Antérieur à l’arrivée de Christophe Colomb',true,10),
        (20,'Posterior a la revolución industrial
— Traduction française : Postérieur à la révolution industrielle',false,20),
        (30,'el más + adjetivo
— Traduction française : le plus + adjectif',true,10),
        (30,'muy + verbo
— Traduction française : très + verbe',false,20),
        (40,'el chamán
— Traduction française : le chamane',true,10),
        (40,'el emigrante
— Traduction française : l’émigrant',false,20)
    ) as answers(question_order,answer,is_correct,display_order)
      on answers.question_order=inserted_questions.display_order;


    lesson_uuid := null;
    insert into public.lessons (chapter_id,title,description,content,display_order,is_active)
    values (chapter_uuid,'Leçon 4 : Connaître les réalités économiques et sociales de l’Amérique hispanique.','Migration, vocabulaire des parcours migratoires, causes citées dans le support et expression du souhait avec gustar.',$lesson_content$
## Conocer las realidades económicas y sociales de América hispánica

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

Contenu reformulé et structuré à partir du PDF fourni : **« Connaître les réalités économiques et sociales de l’Amérique hispanique »**, Espagnol, Terminale, Côte d’Ivoire — École numérique.
$lesson_content$,40,false)
    returning id into lesson_uuid;
    if lesson_uuid is null then
      raise exception 'Création de leçon Espagnol impossible : %.', 'Leçon 4 : Connaître les réalités économiques et sociales de l’Amérique hispanique.';
    end if;

    exercise_a_uuid := null;
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
    values (target.subject_id,target.level_id,target.series_id,chapter_uuid,lesson_uuid,'Exercice 1 — Migración y vocabulario','Completa y explica el vocabulario de la emigración y de los trayectos peligrosos.

> **Traduction française :** Complète et explique le vocabulaire de l’émigration et des parcours dangereux.','La corrección emplea emigrantes, indocumentado y peligro según el documento.

> **Traduction française :** La correction emploie emigrantes, indocumentado et peligro selon le document.','single_choice','easy','Responde en español y lee inmediatamente la traducción francesa de cada elemento.

> **Traduction française :** Réponds en espagnol et lis immédiatement la traduction française de chaque élément.','Comprueba el vocabulario, la estructura y la traducción francesa associée.

> **Traduction française :** Vérifie le vocabulaire, la structure et la traduction française associée.',false,false,20,10)
    returning id into exercise_a_uuid;
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
      (exercise_a_uuid,'single_choice','¿Cómo se llama una persona que viaja sin documentos legales?

> **Traduction française :** Comment appelle-t-on une personne qui voyage sans documents légaux ?',jsonb_build_array('un indocumentado
— Traduction française : une personne sans papiers', 'un sacerdote
— Traduction française : un prêtre', 'un desaparecido
— Traduction française : une personne disparue'),jsonb_build_array('un indocumentado
— Traduction française : une personne sans papiers'),'El vocabulario del PDF define al emigrante clandestino como *indocumentado*.

> **Traduction française :** Le vocabulaire du PDF définit le migrant clandestin comme *indocumentado*.',10),
      (exercise_a_uuid,'single_choice','¿Qué es *la ruta de la muerte* en la actividad?

> **Traduction française :** Qu’est-ce que *la ruta de la muerte* dans l’activité ?',jsonb_build_array('El trayecto peligroso de los clandestinos
— Traduction française : Le trajet dangereux des clandestins', 'Una fiesta nacional
— Traduction française : Une fête nationale', 'Un monumento antiguo
— Traduction française : Un monument ancien'),jsonb_build_array('El trayecto peligroso de los clandestinos
— Traduction française : Le trajet dangereux des clandestins'),'La respuesta de la ficha la define como el trayecto que recorren los clandestinos hacia Estados Unidos.

> **Traduction française :** La réponse de la fiche la définit comme le trajet parcouru par les clandestins vers les États-Unis.',20),
      (exercise_a_uuid,'true_false','El documento menciona causas económicas, sociales y a veces políticas de la emigración.

> **Traduction française :** Le document mentionne des causes économiques, sociales et parfois politiques de l’émigration.',jsonb_build_array('Verdadero
— Traduction française : Vrai', 'Falso
— Traduction française : Faux'),jsonb_build_array('Verdadero
— Traduction française : Vrai'),'Estas causas aparecen en las respuestas guiadas y en las situaciones de evaluación.

> **Traduction française :** Ces causes apparaissent dans les réponses guidées et les situations d’évaluation.',30);

    exercise_b_uuid := null;
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
    values (target.subject_id,target.level_id,target.series_id,chapter_uuid,lesson_uuid,'Exercice 2 — Expresar un deseo con gustar','Formula deseos con *me gustaría* y reconoce la estructura empleada.

> **Traduction française :** Formule des souhaits avec *me gustaría* et reconnais la structure employée.','La corrección utiliza *me gustaría + infinitivo* y reconoce el condicional de gustar.

> **Traduction française :** La correction utilise *me gustaría + infinitif* et reconnaît le conditionnel de gustar.','single_choice','medium','Analiza la frase en español y su traducción francesa immédiate.

> **Traduction française :** Analyse la phrase en espagnol et sa traduction française immédiate.','Explica la regla en español y comprueba la traduction française.

> **Traduction française :** Explique la règle en espagnol et vérifie la traduction française.',false,false,25,20)
    returning id into exercise_b_uuid;
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
      (exercise_b_uuid,'single_choice','Completa: Me gustaría ___ un trabajo decente.

> **Traduction française :** Complète : Me gustaría ___ un trabajo decente.',jsonb_build_array('encontrar
— Traduction française : trouver', 'encontré
— Traduction française : trouvé', 'encuentran
— Traduction française : trouvent'),jsonb_build_array('encontrar
— Traduction française : trouver'),'Después de *me gustaría*, la ficha utiliza un infinitivo: *encontrar*.

> **Traduction française :** Après *me gustaría*, la fiche utilise un infinitif : *encontrar*.',10),
      (exercise_b_uuid,'single_choice','¿Qué expresa *me gustaría*?

> **Traduction française :** Qu’exprime *me gustaría* ?',jsonb_build_array('un deseo
— Traduction française : un souhait', 'una obligación
— Traduction française : une obligation', 'una prohibición
— Traduction française : une interdiction'),jsonb_build_array('un deseo
— Traduction française : un souhait'),'La regla del documento explica que gustar en condicional expresa un deseo.

> **Traduction française :** La règle du document explique que gustar au conditionnel exprime un souhait.',20),
      (exercise_b_uuid,'true_false','*Me gustaría viajar en tren* significa *J’aimerais voyager en train*.

> **Traduction française :** *Me gustaría viajar en tren* signifie *J’aimerais voyager en train*.',jsonb_build_array('Verdadero
— Traduction française : Vrai', 'Falso
— Traduction française : Faux'),jsonb_build_array('Verdadero
— Traduction française : Vrai'),'La phrase est l’exemple de référence du support.

> **Traduction française :** La phrase est l’exemple de référence du support.',30);

    quiz_uuid := null;
    insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active)
    values (target.subject_id,target.level_id,target.series_id,target.offering_id,chapter_uuid,lesson_uuid,'Quiz bilingue — Migración en Hispanoamérica','Verifica tus conocimientos con preguntas en español y traducción française immédiate.

> **Traduction française :** Vérifie tes connaissances avec des questions en espagnol et une traduction française immédiate.','medium',12,10,false,false)
    returning id into quiz_uuid;
    with inserted_questions as (
      insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
        (quiz_uuid,'¿Qué significa *la emigración*?

> **Traduction française :** Que signifie *la emigración* ?','El término se refiere al hecho de salir de un país para vivir en otro lugar.

> **Traduction française :** Le terme désigne le fait de quitter un pays pour vivre ailleurs.','single_choice',10,1,true),
        (quiz_uuid,'¿Qué estructura permite expresar un deseo simple?

> **Traduction française :** Quelle structure permet d’exprimer un souhait simple ?','La ficha utiliza *me gustaría + infinitivo*.

> **Traduction française :** La fiche utilise *me gustaría + infinitif*.','single_choice',20,1,true),
        (quiz_uuid,'¿Qué puede buscar una persona emigrante según el documento?

> **Traduction française :** Que peut rechercher une personne migrante selon le document ?','El soporte menciona oportunidades laborales y mejores condiciones de vida.

> **Traduction française :** Le support mentionne des opportunités de travail et de meilleures conditions de vie.','single_choice',30,1,true),
        (quiz_uuid,'¿Cómo califica el soporte ciertos trayectos migratorios?

> **Traduction française :** Comment le support qualifie-t-il certains trajets migratoires ?','Los presenta como peligrosos, sin afirmar un resultado para cada persona.

> **Traduction française :** Il les présente comme dangereux, sans affirmer une issue pour chaque personne.','single_choice',40,1,true)
      returning id,display_order
    )
    insert into public.quiz_answers (question_id,answer,is_correct,display_order)
    select inserted_questions.id,answers.answer,answers.is_correct,answers.display_order
    from inserted_questions
    join (values
        (10,'El hecho de salir de un país
— Traduction française : Le fait de quitter un pays',true,10),
        (10,'El estudio de una lengua
— Traduction française : L’étude d’une langue',false,20),
        (20,'Me gustaría + infinitivo
— Traduction française : J’aimerais + infinitif',true,10),
        (20,'Tengo que + infinitivo
— Traduction française : Je dois + infinitif',false,20),
        (30,'Oportunidades laborales
— Traduction française : Des opportunités de travail',true,10),
        (30,'Un examen de astronomía
— Traduction française : Un examen d’astronomie',false,20),
        (40,'peligrosos
— Traduction française : dangereux',true,10),
        (40,'siempre seguros
— Traduction française : toujours sûrs',false,20)
    ) as answers(question_order,answer,is_correct,display_order)
      on answers.question_order=inserted_questions.display_order;

  end loop;
end
$spanish_terminal_bilingual$;
