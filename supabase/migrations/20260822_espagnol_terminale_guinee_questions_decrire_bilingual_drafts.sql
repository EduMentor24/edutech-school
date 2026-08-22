-- Brouillons bilingues Espagnol Terminale : Guinée équatoriale, questions et description.
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
  where id in ('942aacbc-1f0c-4eea-9f61-04560b3f3578', '48880a58-de13-4485-a45d-ab716b4ca645', '0e028469-a443-4b7d-9ed9-6a675193fc24', 'd496a111-1324-4f92-b557-f5bb402f6bac');
  if offering_count <> 4 then
    raise exception 'Les quatre offres Espagnol Terminale attendues sont requises ; transaction annulée.';
  end if;

  if exists (
    select 1
    from public.lessons le
    join public.chapters ch on ch.id=le.chapter_id
    where ch.subject_offering_id in ('942aacbc-1f0c-4eea-9f61-04560b3f3578', '48880a58-de13-4485-a45d-ab716b4ca645', '0e028469-a443-4b7d-9ed9-6a675193fc24', 'd496a111-1324-4f92-b557-f5bb402f6bac')
      and le.title in ('Leçon 5 : Connaître les réalités historiques, politiques, économiques et sociolinguistiques de Guinée équatoriale.', 'Leçon 6 : Poser des questions.', 'Leçon 7 : Décrire.')
  ) then
    raise exception 'Une leçon cible Espagnol Terminale existe déjà ; ré-audit requis avant toute écriture.';
  end if;

  if exists (
    select 1 from public.chapters
    where subject_offering_id in ('942aacbc-1f0c-4eea-9f61-04560b3f3578', '48880a58-de13-4485-a45d-ab716b4ca645', '0e028469-a443-4b7d-9ed9-6a675193fc24', 'd496a111-1324-4f92-b557-f5bb402f6bac')
      and title='Compétence — Échange d’information'
  ) then
    raise exception 'Le chapitre Espagnol « Échange d’information » existe déjà ; ré-audit requis avant toute écriture.';
  end if;

  for target in
    select o.id as offering_id,o.subject_id,o.level_id,o.series_id
    from public.course_subject_offerings o
    where o.id in ('942aacbc-1f0c-4eea-9f61-04560b3f3578', '48880a58-de13-4485-a45d-ab716b4ca645', '0e028469-a443-4b7d-9ed9-6a675193fc24', 'd496a111-1324-4f92-b557-f5bb402f6bac')
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


    lesson_uuid := null;
    insert into public.lessons (chapter_id,title,description,content,display_order,is_active)
    values (world_chapter_uuid,'Leçon 5 : Connaître les réalités historiques, politiques, économiques et sociolinguistiques de Guinée équatoriale.','Indépendance, plurilinguisme, ressources citées dans le support et expression de la continuation avec seguir ou continuar.',$lesson_content$
## Conocer las realidades históricas, políticas, económicas y sociolingüísticas de Guinea Ecuatorial

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

Contenu reformulé et structuré à partir du PDF fourni : **« Connaître les réalités historiques, politiques, économiques et sociolinguistiques de Guinée Équatoriale »**, Espagnol, Terminale, Côte d’Ivoire — École numérique.
$lesson_content$,world_lesson_order,false)
    returning id into lesson_uuid;
    if lesson_uuid is null then
      raise exception 'Création de leçon Espagnol impossible : %.', 'Leçon 5 : Connaître les réalités historiques, politiques, économiques et sociolinguistiques de Guinée équatoriale.';
    end if;

    exercise_a_uuid := null;
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
    values (target.subject_id,target.level_id,target.series_id,world_chapter_uuid,lesson_uuid,'Exercice 1 — Guinea Ecuatorial: vocabulario y comprensión','Completa y explica el vocabulario del plurilingüismo y de los recursos citados en el documento.

> **Traduction française :** Complète et explique le vocabulaire du plurilinguisme et des ressources citées dans le document.','La corrección distingue metrópoli, bolsa de petróleo y lengua nativa según la ficha.

> **Traduction française :** La correction distingue metrópole, poche de pétrole et langue native selon la fiche.','single_choice','easy','Responde en español y lee inmediatamente la traducción francesa de cada elemento.

> **Traduction française :** Réponds en espagnol et lis immédiatement la traduction française de chaque élément.','Comprueba el vocabulario, la estructura y la traducción francesa asociada.

> **Traduction française :** Vérifie le vocabulaire, la structure et la traduction française associée.',false,false,20,10)
    returning id into exercise_a_uuid;
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
      (exercise_a_uuid,'single_choice','¿Qué significa *una lengua nativa*?

> **Traduction française :** Que signifie *una lengua nativa* ?',jsonb_build_array('Una lengua originaria de una comunidad
— Traduction française : Une langue originaire d’une communauté', 'Una ley escrita
— Traduction française : Une loi écrite', 'Una moneda europea
— Traduction française : Une monnaie européenne'),jsonb_build_array('Una lengua originaria de una comunidad
— Traduction française : Une langue originaire d’une communauté'),'El vocabulario del documento presenta el agni, el gouro y el djamala como lenguas nativas.

> **Traduction française :** Le vocabulaire du document présente l’agni, le gouro et le djamala comme des langues natives.',10),
      (exercise_a_uuid,'single_choice','¿Qué recurso económico cita la ficha para Guinea Ecuatorial?

> **Traduction française :** Quelle ressource économique la fiche cite-t-elle pour la Guinée équatoriale ?',jsonb_build_array('El petróleo y el gas
— Traduction française : Le pétrole et le gaz', 'El algodón únicamente
— Traduction française : Le coton uniquement', 'La pesca solamente
— Traduction française : La pêche seulement'),jsonb_build_array('El petróleo y el gas
— Traduction française : Le pétrole et le gaz'),'El resumen menciona la explotación del petróleo y del gas.

> **Traduction française :** Le résumé mentionne l’exploitation du pétrole et du gaz.',20),
      (exercise_a_uuid,'true_false','Guinea Ecuatorial es un país plurilingüe según el documento.

> **Traduction française :** La Guinée équatoriale est un pays plurilingue selon le document.',jsonb_build_array('Verdadero
— Traduction française : Vrai', 'Falso
— Traduction française : Faux'),jsonb_build_array('Verdadero
— Traduction française : Vrai'),'El soporte menciona lenguas oficiales y varias lenguas nativas.

> **Traduction française :** Le support mentionne des langues officielles et plusieurs langues natives.',30);

    exercise_b_uuid := null;
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
    values (target.subject_id,target.level_id,target.series_id,world_chapter_uuid,lesson_uuid,'Exercice 2 — Seguir y continuar + gerundio','Expresa la continuación de la acción con *seguir* o *continuar* y un gerundio.

> **Traduction française :** Exprime la continuation de l’action avec *seguir* ou *continuar* et un gérondif.','La corrección utiliza seguir o continuar seguido de estudiando, mirando, pidiendo o yendo.

> **Traduction française :** La correction utilise seguir ou continuar suivi de estudiando, mirando, pidiendo ou yendo.','single_choice','medium','Analiza la frase en español y su traducción francesa inmediata.

> **Traduction française :** Analyse la phrase en espagnol et sa traduction française immédiate.','Explica la regla en español y comprueba la traducción francesa.

> **Traduction française :** Explique la règle en espagnol et vérifie la traduction française.',false,false,25,20)
    returning id into exercise_b_uuid;
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
      (exercise_b_uuid,'single_choice','Completa: Después de cinco horas, vosotros ___ estudiando.

> **Traduction française :** Complète : Après cinq heures, vous ___ à étudier.',jsonb_build_array('seguís
— Traduction française : continuez', 'seguís estudiar
— Traduction française : continuez étudier', 'seguir
— Traduction française : continuer'),jsonb_build_array('seguís
— Traduction française : continuez'),'Después de *seguís*, la acción continúa con el gerundio *estudiando*.

> **Traduction française :** Après *seguís*, l’action se poursuit avec le gérondif *estudiando* .',10),
      (exercise_b_uuid,'single_choice','¿Qué forma expresa una acción que continúa?

> **Traduction française :** Quelle forme exprime une action qui continue ?',jsonb_build_array('seguir + gerundio
— Traduction française : seguir + gérondif', 'seguir + infinitivo
— Traduction française : seguir + infinitif', 'tener + sustantivo
— Traduction française : tener + nom'),jsonb_build_array('seguir + gerundio
— Traduction française : seguir + gérondif'),'La regla de la ficha usa *seguir + gerundio* para expresar la continuación.

> **Traduction française :** La règle de la fiche utilise *seguir + gérondif* pour exprimer la continuation.',20),
      (exercise_b_uuid,'true_false','*Continuar + gerundio* puede expresar la misma idea de continuación.

> **Traduction française :** *Continuar + gérondif* peut exprimer la même idée de continuation.',jsonb_build_array('Verdadero
— Traduction française : Vrai', 'Falso
— Traduction française : Faux'),jsonb_build_array('Verdadero
— Traduction française : Vrai'),'La nota de la ficha presenta *continuar + gerundio* como otra posibilidad.

> **Traduction française :** La note de la fiche présente *continuar + gérondif* comme une autre possibilité.',30);

    quiz_uuid := null;
    insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active)
    values (target.subject_id,target.level_id,target.series_id,target.offering_id,world_chapter_uuid,lesson_uuid,'Quiz bilingue — Guinea Ecuatorial','Verifica tus conocimientos con preguntas en español y traducción francesa inmediata.

> **Traduction française :** Vérifie tes connaissances avec des questions en espagnol et une traduction française immédiate.','medium',12,10,false,false)
    returning id into quiz_uuid;
    with inserted_questions as (
      insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
        (quiz_uuid,'¿En qué año consiguió Guinea Ecuatorial su independencia de España?

> **Traduction française :** En quelle année la Guinée équatoriale a-t-elle obtenu son indépendance de l’Espagne ?','El resumen indica el año 1968.

> **Traduction française :** Le résumé indique l’année 1968.','single_choice',10,1,true),
        (quiz_uuid,'¿Qué lengua africana se mantiene como oficial según la ficha?

> **Traduction française :** Quelle langue est maintenue comme officielle selon la fiche ?','El soporte indica que el español es lengua oficial.

> **Traduction française :** Le support indique que l’espagnol est langue officielle.','single_choice',20,1,true),
        (quiz_uuid,'¿Qué significa *la metrópoli* en el ejemplo estudiado?

> **Traduction française :** Que signifie *la metrópoli* dans l’exemple étudié ?','La ficha contrapone la metrópoli y la colonia.

> **Traduction française :** La fiche oppose la métropole et la colonie.','single_choice',30,1,true),
        (quiz_uuid,'¿Qué forma completa correctamente la idea de continuación?

> **Traduction française :** Quelle forme complète correctement l’idée de continuation ?','La lección utiliza seguir o continuar con un gerundio.

> **Traduction française :** La leçon utilise seguir ou continuar avec un gérondif.','single_choice',40,1,true)
      returning id,display_order
    )
    insert into public.quiz_answers (question_id,answer,is_correct,display_order)
    select inserted_questions.id,answers.answer,answers.is_correct,answers.display_order
    from inserted_questions
    join (values
        (10,'En 1968
— Traduction française : En 1968',true,10),
        (10,'En 1979
— Traduction française : En 1979',false,20),
        (20,'El español
— Traduction française : L’espagnol',true,10),
        (20,'El alemán
— Traduction française : L’allemand',false,20),
        (30,'El país que domina colonias
— Traduction française : Le pays qui domine des colonies',true,10),
        (30,'Una lengua nativa
— Traduction française : Une langue native',false,20),
        (40,'sigue estudiando
— Traduction française : continue à étudier',true,10),
        (40,'sigue estudiar
— Traduction française : continue étudier',false,20)
    ) as answers(question_order,answer,is_correct,display_order)
      on answers.question_order=inserted_questions.display_order;


    lesson_uuid := null;
    insert into public.lessons (chapter_id,title,description,content,display_order,is_active)
    values (exchange_chapter_uuid,'Leçon 6 : Poser des questions.','Expressions interrogatives, technique interrogative et préparation de dialogues d’échange d’information.',$lesson_content$
## Hacer preguntas

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

Contenu reformulé et structuré à partir du PDF fourni : **« Poser des questions »**, Espagnol, Terminale, Côte d’Ivoire — École numérique.
$lesson_content$,10,false)
    returning id into lesson_uuid;
    if lesson_uuid is null then
      raise exception 'Création de leçon Espagnol impossible : %.', 'Leçon 6 : Poser des questions.';
    end if;

    exercise_a_uuid := null;
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
    values (target.subject_id,target.level_id,target.series_id,exchange_chapter_uuid,lesson_uuid,'Exercice 1 — Interrogativos y vocabulario','Completa las preguntas con el interrogativo adecuado y reconoce el vocabulario de la entrevista.

> **Traduction française :** Complète les questions avec l’interrogatif approprié et reconnais le vocabulaire de l’interview.','La corrección distingue cuándo, cuánto y cuál según la información buscada.

> **Traduction française :** La correction distingue cuándo, cuánto et cuál selon l’information recherchée.','single_choice','easy','Responde en español y lee inmediatamente la traducción francesa de cada elemento.

> **Traduction française :** Réponds en espagnol et lis immédiatement la traduction française de chaque élément.','Comprueba el vocabulario, la estructura y la traducción francesa asociada.

> **Traduction française :** Vérifie le vocabulaire, la structure et la traduction française associée.',false,false,20,10)
    returning id into exercise_a_uuid;
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
      (exercise_a_uuid,'single_choice','¿___ es tu cumpleaños?

> **Traduction française :** ___ est ton anniversaire ?',jsonb_build_array('Cuándo
— Traduction française : Quand', 'Cuánto
— Traduction française : Combien', 'Cuál
— Traduction française : Lequel / quelle'),jsonb_build_array('Cuándo
— Traduction française : Quand'),'Para preguntar por una fecha, la ficha utiliza *cuándo*.

> **Traduction française :** Pour interroger sur une date, la fiche utilise *cuándo* .',10),
      (exercise_a_uuid,'single_choice','¿___ cuesta esta blusa?

> **Traduction française :** ___ coûte ce chemisier ?',jsonb_build_array('Cuánto
— Traduction française : Combien', 'Dónde
— Traduction française : Où', 'Quién
— Traduction française : Qui'),jsonb_build_array('Cuánto
— Traduction française : Combien'),'Para preguntar por un precio, la ficha utiliza *cuánto*.

> **Traduction française :** Pour interroger sur un prix, la fiche utilise *cuánto* .',20),
      (exercise_a_uuid,'true_false','Un periodista hace investigaciones y entrevistas.

> **Traduction française :** Un journaliste mène des enquêtes et des interviews.',jsonb_build_array('Verdadero
— Traduction française : Vrai', 'Falso
— Traduction française : Faux'),jsonb_build_array('Verdadero
— Traduction française : Vrai'),'El vocabulario define el trabajo del periodista de esta manera.

> **Traduction française :** Le vocabulaire définit le travail du journaliste de cette manière.',30);

    exercise_b_uuid := null;
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
    values (target.subject_id,target.level_id,target.series_id,exchange_chapter_uuid,lesson_uuid,'Exercice 2 — Transformar y formular preguntas','Transforma una información en una pregunta directa o en una formulación con *me pregunto*.

> **Traduction française :** Transforme une information en question directe ou en formulation avec *me pregunto*.','La corrección reproduce preguntas sobre una persona, una hora y una razón.

> **Traduction française :** La correction reproduit des questions sur une personne, une heure et une raison.','single_choice','medium','Analiza la frase en español y su traducción francesa inmediata.

> **Traduction française :** Analyse la phrase en espagnol et sa traduction française immédiate.','Explica la regla en español y comprueba la traducción francesa.

> **Traduction française :** Explique la règle en espagnol et vérifie la traduction française.',false,false,25,20)
    returning id into exercise_b_uuid;
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
      (exercise_b_uuid,'single_choice','La blusa de color rojo es de Miguel. ¿Qué pregunta corresponde?

> **Traduction française :** Le chemisier rouge est à Miguel. Quelle question correspond ?',jsonb_build_array('¿De quién es la blusa de color rojo?
— Traduction française : À qui appartient le chemisier rouge ?', '¿Cuándo es la blusa?
— Traduction française : Quand est le chemisier ?', '¿Cuánto es Miguel?
— Traduction française : Combien est Miguel ?'),jsonb_build_array('¿De quién es la blusa de color rojo?
— Traduction française : À qui appartient le chemisier rouge ?'),'La respuesta del soporte pregunta por el poseedor con *¿De quién...?*.

> **Traduction française :** La réponse du support demande le possesseur avec *¿De quién...?* .',10),
      (exercise_b_uuid,'single_choice','¿Qué forma introduce una interrogación en una declaración?

> **Traduction française :** Quelle forme introduit une interrogation dans une déclaration ?',jsonb_build_array('Me pregunto...
— Traduction française : Je me demande...', 'Porque...
— Traduction française : Parce que...', 'Sin embargo...
— Traduction française : Cependant...'),jsonb_build_array('Me pregunto...
— Traduction française : Je me demande...'),'La ficha presenta *Me pregunto* como oración declarativa interrogativa.

> **Traduction française :** La fiche présente *Me pregunto* comme une phrase déclarative interrogative.',20),
      (exercise_b_uuid,'true_false','*¿Por qué?* sirve para preguntar por una razón.

> **Traduction française :** *¿Por qué ?* sert à demander une raison.',jsonb_build_array('Verdadero
— Traduction française : Vrai', 'Falso
— Traduction française : Faux'),jsonb_build_array('Verdadero
— Traduction française : Vrai'),'La expresión interrogativa *¿Por qué?* pide una causa o razón.

> **Traduction française :** L’expression interrogative *¿Por qué ?* demande une cause ou une raison.',30);

    quiz_uuid := null;
    insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active)
    values (target.subject_id,target.level_id,target.series_id,target.offering_id,exchange_chapter_uuid,lesson_uuid,'Quiz bilingue — Hacer preguntas','Verifica tus conocimientos con preguntas en español y traducción francesa inmediata.

> **Traduction française :** Vérifie tes connaissances avec des questions en espagnol et une traduction française immédiate.','medium',12,10,false,false)
    returning id into quiz_uuid;
    with inserted_questions as (
      insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
        (quiz_uuid,'¿Qué interrogativo pregunta por una cantidad o un precio?

> **Traduction française :** Quel interrogatif demande une quantité ou un prix ?','La ficha utiliza *cuánto* para este tipo de información.

> **Traduction française :** La fiche utilise *cuánto* pour ce type d’information.','single_choice',10,1,true),
        (quiz_uuid,'¿Qué es una entrevista?

> **Traduction française :** Qu’est-ce qu’une interview ?','En una entrevista, el periodista pregunta a sus invitados.

> **Traduction française :** Dans une interview, le journaliste pose des questions à ses invités.','single_choice',20,1,true),
        (quiz_uuid,'¿Qué pregunta permite saber la profesión de Manuel?

> **Traduction française :** Quelle question permet de connaître la profession de Manuel ?','La actividad utiliza *¿Cuál es la profesión de Manuel?*.

> **Traduction française :** L’activité utilise *¿Cuál es la profesión de Manuel ?* .','single_choice',30,1,true),
        (quiz_uuid,'¿Qué expresión presenta la ficha para expresar un deseo?

> **Traduction française :** Quelle expression la fiche présente-t-elle pour exprimer un souhait ?','El soporte incluye la oración optativa con *Ojalá*.

> **Traduction française :** Le support inclut la phrase optative avec *Ojalá* .','single_choice',40,1,true)
      returning id,display_order
    )
    insert into public.quiz_answers (question_id,answer,is_correct,display_order)
    select inserted_questions.id,answers.answer,answers.is_correct,answers.display_order
    from inserted_questions
    join (values
        (10,'Cuánto
— Traduction française : Combien',true,10),
        (10,'Cuándo
— Traduction française : Quand',false,20),
        (20,'Un intercambio de preguntas y respuestas
— Traduction française : Un échange de questions et de réponses',true,10),
        (20,'Una lengua nativa
— Traduction française : Une langue native',false,20),
        (30,'¿Cuál es la profesión de Manuel?
— Traduction française : Quelle est la profession de Manuel ?',true,10),
        (30,'¿Cuándo es Manuel?
— Traduction française : Quand est Manuel ?',false,20),
        (40,'Ojalá...
— Traduction française : Pourvu que...',true,10),
        (40,'Me llamo...
— Traduction française : Je m’appelle...',false,20)
    ) as answers(question_order,answer,is_correct,display_order)
      on answers.question_order=inserted_questions.display_order;


    lesson_uuid := null;
    insert into public.lessons (chapter_id,title,description,content,display_order,is_active)
    values (exchange_chapter_uuid,'Leçon 7 : Décrire.','Description physique, morale et de lieux, avec comparatifs réguliers et irréguliers.',$lesson_content$
## Describir

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

Contenu reformulé et structuré à partir du PDF fourni : **« Décrire »**, Espagnol, Terminale, Côte d’Ivoire — École numérique.
$lesson_content$,20,false)
    returning id into lesson_uuid;
    if lesson_uuid is null then
      raise exception 'Création de leçon Espagnol impossible : %.', 'Leçon 7 : Décrire.';
    end if;

    exercise_a_uuid := null;
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
    values (target.subject_id,target.level_id,target.series_id,exchange_chapter_uuid,lesson_uuid,'Exercice 1 — Vocabulario de la descripción','Relaciona el vocabulario de la descripción con su significado y comprende el retrato de Tío Lucas.

> **Traduction française :** Relie le vocabulaire de la description à son sens et comprends le portrait de l’oncle Lucas.','La corrección relaciona belleza, tamaño y retrato con los términos de la ficha.

> **Traduction française :** La correction relie belleza, tamaño et retrato aux termes de la fiche.','single_choice','easy','Responde en español y lee inmediatamente la traducción francesa de cada elemento.

> **Traduction française :** Réponds en espagnol et lis immédiatement la traduction française de chaque élément.','Comprueba el vocabulario, la estructura y la traducción francesa asociada.

> **Traduction française :** Vérifie le vocabulaire, la structure et la traduction française associée.',false,false,20,10)
    returning id into exercise_a_uuid;
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
      (exercise_a_uuid,'single_choice','¿Qué significa *el retrato*?

> **Traduction française :** Que signifie *el retrato* ?',jsonb_build_array('La descripción de una persona
— Traduction française : La description d’une personne', 'Una pregunta
— Traduction française : Une question', 'Una bolsa de petróleo
— Traduction française : Une poche de pétrole'),jsonb_build_array('La descripción de una persona
— Traduction française : La description d’une personne'),'La actividad relaciona *el retrato* con la descripción.

> **Traduction française :** L’activité associe *el retrato* à la description.',10),
      (exercise_a_uuid,'single_choice','¿Qué contraste presenta el retrato de Tío Lucas?

> **Traduction française :** Quel contraste le portrait de l’oncle Lucas présente-t-il ?',jsonb_build_array('Su aspecto físico y sus valores morales
— Traduction française : Son apparence physique et ses valeurs morales', 'Su profesión y su país
— Traduction française : Sa profession et son pays', 'Su edad y su fecha de nacimiento
— Traduction française : Son âge et sa date de naissance'),jsonb_build_array('Su aspecto físico y sus valores morales
— Traduction française : Son apparence physique et ses valeurs morales'),'La ficha indica que era muy feo pero tenía grandes valores morales.

> **Traduction française :** La fiche indique qu’il était très laid mais avait de grandes valeurs morales.',20),
      (exercise_a_uuid,'true_false','*Guapo* es lo contrario de *feo*.

> **Traduction française :** *Guapo* est le contraire de *feo* .',jsonb_build_array('Verdadero
— Traduction française : Vrai', 'Falso
— Traduction française : Faux'),jsonb_build_array('Verdadero
— Traduction française : Vrai'),'El vocabulario presenta *ser feo* y *ser guapo* como términos contrarios.

> **Traduction française :** Le vocabulaire présente *ser feo* et *ser guapo* comme des termes contraires.',30);

    exercise_b_uuid := null;
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
    values (target.subject_id,target.level_id,target.series_id,exchange_chapter_uuid,lesson_uuid,'Exercice 2 — Comparativos para describir','Reconoce y transforma comparaciones de superioridad, igualdad e inferioridad.

> **Traduction française :** Reconnais et transforme des comparaisons de supériorité, d’égalité et d’infériorité.','La corrección utiliza más... que, tan... como, menos... que y los comparativos irregulares.

> **Traduction française :** La correction utilise más... que, tan... como, menos... que et les comparatifs irréguliers.','single_choice','medium','Analiza la frase en español y su traducción francesa inmediata.

> **Traduction française :** Analyse la phrase en espagnol et sa traduction française immédiate.','Explica la regla en español y comprueba la traducción francesa.

> **Traduction française :** Explique la règle en espagnol et vérifie la traduction française.',false,false,25,20)
    returning id into exercise_b_uuid;
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
      (exercise_b_uuid,'single_choice','Lucas era más feo que Picio. ¿Qué transformación conserva el sentido?

> **Traduction française :** Lucas était plus laid que Picio. Quelle transformation conserve le sens ?',jsonb_build_array('Picio era menos feo que Lucas.
— Traduction française : Picio était moins laid que Lucas.', 'Picio era más feo que Lucas.
— Traduction française : Picio était plus laid que Lucas.', 'Lucas era tan feo como Picio.
— Traduction française : Lucas était aussi laid que Picio.'),jsonb_build_array('Picio era menos feo que Lucas.
— Traduction française : Picio était moins laid que Lucas.'),'La actividad del soporte intercambia el orden y usa *menos feo que*.

> **Traduction française :** L’activité du support inverse l’ordre et utilise *menos feo que* .',10),
      (exercise_b_uuid,'single_choice','¿Cuál es la forma irregular de *bueno*?

> **Traduction française :** Quelle est la forme irrégulière de *bueno* ?',jsonb_build_array('mejor
— Traduction française : meilleur', 'mayor
— Traduction française : plus grand', 'menos
— Traduction française : moins'),jsonb_build_array('mejor
— Traduction française : meilleur'),'La tabla de comparativos irregulares da *bueno → mejor*.

> **Traduction française :** Le tableau des comparatifs irréguliers donne *bueno → mejor* .',20),
      (exercise_b_uuid,'true_false','*Tan simpático como* expresa igualdad.

> **Traduction française :** *Tan simpático como* exprime l’égalité.',jsonb_build_array('Verdadero
— Traduction française : Vrai', 'Falso
— Traduction française : Faux'),jsonb_build_array('Verdadero
— Traduction française : Vrai'),'La regla presenta *tan ... como* como comparativo de igualdad.

> **Traduction française :** La règle présente *tan ... como* comme un comparatif d’égalité.',30);

    quiz_uuid := null;
    insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active)
    values (target.subject_id,target.level_id,target.series_id,target.offering_id,exchange_chapter_uuid,lesson_uuid,'Quiz bilingue — Describir','Verifica tus conocimientos con preguntas en español y traducción francesa inmediata.

> **Traduction française :** Vérifie tes connaissances avec des questions en espagnol et une traduction française immédiate.','medium',12,10,false,false)
    returning id into quiz_uuid;
    with inserted_questions as (
      insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
        (quiz_uuid,'¿Qué expresión sirve para comparar superioridad?

> **Traduction française :** Quelle expression sert à comparer la supériorité ?','La ficha usa *más ... que*.

> **Traduction française :** La fiche utilise *más ... que* .','single_choice',10,1,true),
        (quiz_uuid,'¿Qué significa *el tamaño*?

> **Traduction française :** Que signifie *el tamaño* ?','El vocabulario lo emplea para las dimensiones.

> **Traduction française :** Le vocabulaire l’emploie pour les dimensions.','single_choice',20,1,true),
        (quiz_uuid,'¿Cuál es el comparativo irregular de *malo*?

> **Traduction française :** Quel est le comparatif irrégulier de *malo* ?','La tabla presenta *malo → peor*.

> **Traduction française :** Le tableau présente *malo → peor* .','single_choice',30,1,true),
        (quiz_uuid,'¿Qué dos aspectos se pueden presentar para describir una persona?

> **Traduction française :** Quels deux aspects peut-on présenter pour décrire une personne ?','La ficha distingue el retrato físico y el retrato moral.

> **Traduction française :** La fiche distingue le portrait physique et le portrait moral.','single_choice',40,1,true)
      returning id,display_order
    )
    insert into public.quiz_answers (question_id,answer,is_correct,display_order)
    select inserted_questions.id,answers.answer,answers.is_correct,answers.display_order
    from inserted_questions
    join (values
        (10,'más ... que
— Traduction française : plus ... que',true,10),
        (10,'tan ... como
— Traduction française : aussi ... que',false,20),
        (20,'La taille ou les dimensions
— Traduction française : La taille ou les dimensions',true,10),
        (20,'Un journaliste
— Traduction française : Un journaliste',false,20),
        (30,'peor
— Traduction française : pire',true,10),
        (30,'menor
— Traduction française : plus petit',false,20),
        (40,'El aspecto físico y el aspecto moral
— Traduction française : L’aspect physique et l’aspect moral',true,10),
        (40,'La hora y el precio
— Traduction française : L’heure et le prix',false,20)
    ) as answers(question_order,answer,is_correct,display_order)
      on answers.question_order=inserted_questions.display_order;

  end loop;
end
$spanish_terminal_l5_l7_bilingual$;
