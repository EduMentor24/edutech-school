-- Enrichissement et évaluations de méthodologie Histoire-Géographie Terminale.
-- Les données sont créées d'abord en brouillon, avant publication contrôlée séparée.
do $history_methodology_evaluations$
declare
  target record;
  question_item record;
  quiz_id uuid;
  quiz_question_id uuid;
  target_count integer;
  existing_evaluation_count integer;
  enriched_lesson_count integer;
  final_exercise_count integer;
  final_exercise_question_count integer;
  final_quiz_count integer;
  final_quiz_question_count integer;
  final_quiz_answer_count integer;
begin
  select count(*) into target_count
  from public.lessons lesson
  join public.chapters chapter on chapter.id = lesson.chapter_id
  join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
  join public.levels level on level.id = offering.level_id
  join public.series serie on serie.id = offering.series_id
  join public.subjects subject on subject.id = offering.subject_id
  where level.name = 'Terminale'
    and serie.name in ('A1', 'A2', 'C', 'D')
    and subject.name = 'Histoire-Géographie'
    and chapter.title = 'PREMIÈRE PARTIE — NOTIONS DE MÉTHODOLOGIE'
    and lesson.title in ('Leçon 1 — Les techniques du commentaire de deux documents', 'Leçon 2 — Les techniques de la dissertation')
    and lesson.is_active = false
    and lesson.is_test_data = false
    and coalesce(length(trim(lesson.content)), 0) > 7000
    and lesson.content not like '%## Application guidée — Exemple méthodologique%';

  select count(*) into existing_evaluation_count
  from (
    select exercise.id
    from public.exercises exercise
    join public.lessons lesson on lesson.id = exercise.lesson_id
    join public.chapters chapter on chapter.id = lesson.chapter_id
    join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
    join public.levels level on level.id = offering.level_id
    join public.series serie on serie.id = offering.series_id
    join public.subjects subject on subject.id = offering.subject_id
    where level.name = 'Terminale'
      and serie.name in ('A1', 'A2', 'C', 'D')
      and subject.name = 'Histoire-Géographie'
      and chapter.title = 'PREMIÈRE PARTIE — NOTIONS DE MÉTHODOLOGIE'
      and lesson.title in ('Leçon 1 — Les techniques du commentaire de deux documents', 'Leçon 2 — Les techniques de la dissertation')
    union all
    select quiz.id
    from public.quizzes quiz
    join public.lessons lesson on lesson.id = quiz.lesson_id
    join public.chapters chapter on chapter.id = lesson.chapter_id
    join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
    join public.levels level on level.id = offering.level_id
    join public.series serie on serie.id = offering.series_id
    join public.subjects subject on subject.id = offering.subject_id
    where level.name = 'Terminale'
      and serie.name in ('A1', 'A2', 'C', 'D')
      and subject.name = 'Histoire-Géographie'
      and chapter.title = 'PREMIÈRE PARTIE — NOTIONS DE MÉTHODOLOGIE'
      and lesson.title in ('Leçon 1 — Les techniques du commentaire de deux documents', 'Leçon 2 — Les techniques de la dissertation')
  ) as existing_evaluations;

  if target_count <> 8 or existing_evaluation_count <> 0 then
    raise exception 'Évaluations méthodologie refusées : % leçons attendues et % évaluations préexistantes.', target_count, existing_evaluation_count;
  end if;

  update public.lessons lesson
  set content = lesson.content || case
    when lesson.title = 'Leçon 1 — Les techniques du commentaire de deux documents' then $comment_example$

## Application guidée — Exemple méthodologique

> **Situation d’entraînement fictive.** Deux documents portent sur l’accès à l’indépendance d’un territoire africain. Le premier est un court discours qui appelle à l’unité ; le second est un tableau qui présente, pour plusieurs années, l’évolution d’un indicateur économique. Les documents sont volontairement simplifiés : leur rôle est de permettre un entraînement à la méthode, non de remplacer une source historique étudiée en classe.

### Étape 1 — Préparer une fiche de lecture

| Question à traiter | Réponse attendue au brouillon |
| --- | --- |
| Nature des documents | Distinguer un discours et un document statistique. |
| Thème commun | Repérer que les deux documents éclairent une même période de transformation politique et économique. |
| Point de vue | Le discours défend une idée ; le tableau décrit une évolution chiffrée. |
| Question de comparaison | Se demander ce que chaque document apporte et ce que l’autre ne permet pas de voir. |

### Étape 2 — Construire une réponse rédigée

Commencez par une phrase directe : *Les deux documents abordent la même période, mais ils ne l’éclairent pas de la même manière.* Ajoutez ensuite une preuve précise : le discours permet d’identifier une intention ou un appel, tandis que le tableau met en évidence une évolution. Expliquez enfin ce que cette différence signifie : un texte révèle un point de vue, alors qu’un tableau demande surtout une lecture rigoureuse des données et de leur tendance.

### Étape 3 — Porter un jugement nuancé

Vous pouvez conclure que les documents sont complémentaires : aucun ne suffit seul à expliquer toute la situation. Le discours ne donne pas à lui seul toutes les données économiques ; le tableau ne dit pas à lui seul ce que les acteurs pensaient ou voulaient. Cette nuance montre que vous utilisez les documents avec esprit critique.

> **Auto-évaluation.** Avant de passer à la question suivante, vérifiez : ai-je répondu à la consigne ? ai-je cité ou décrit un élément précis ? ai-je expliqué son sens ? ai-je évité de présenter une hypothèse comme un fait ?
$comment_example$
    else $dissertation_example$

## Application guidée — Exemple méthodologique

> **Sujet d’entraînement.** *Dans quelle mesure les documents permettent-ils de comprendre un phénomène historique ou géographique ?* Ce sujet est volontairement général : il sert à apprendre à construire une démarche et non à remplacer une dissertation sur une leçon précise.

### Étape 1 — Analyser le sujet

Les mots **dans quelle mesure** invitent à une réponse nuancée : il faut montrer l’utilité des documents, mais aussi leurs limites. Les termes **documents** et **comprendre** doivent être définis au brouillon. Une première problématique possible est : *Comment les documents aident-ils à analyser un phénomène, et pourquoi faut-il les confronter au contexte et à d’autres connaissances ?*

### Étape 2 — Préparer un plan adapté

| Partie | Idée directrice | Type d’argument attendu |
| --- | --- | --- |
| I. Ce que les documents apportent | Ils fournissent des informations, des points de vue ou des données. | Présenter la nature, les informations et l’intérêt des sources. |
| II. Ce qu’ils ne disent pas seuls | Chaque document est situé, partiel et parfois orienté. | Expliquer les limites liées à l’auteur, au contexte et au support. |
| III. Comment construire une compréhension solide | La confrontation des sources et les connaissances permettent de nuancer. | Montrer la complémentarité de l’analyse documentaire et du cours. |

### Étape 3 — Rédiger un paragraphe modèle

*Les documents constituent d’abord des appuis essentiels pour comprendre un phénomène. Un texte peut exprimer le point de vue d’un acteur, tandis qu’une carte ou un tableau peut rendre visibles une répartition ou une évolution. Toutefois, ces informations doivent être expliquées et mises en contexte : un document ne représente pas automatiquement toute la réalité. C’est pourquoi leur confrontation et les connaissances du cours permettent de construire une analyse plus complète.*

### Étape 4 — Vérifier l’introduction et la conclusion

Dans l’introduction, situez le sujet, définissez les notions, posez la problématique et annoncez le plan. Dans la conclusion, reprenez les résultats du raisonnement : les documents sont indispensables, mais leur lecture critique et leur mise en relation sont nécessaires. Une ouverture pertinente peut rappeler qu’un même phénomène est souvent étudié à partir de sources de nature différente.

> **Auto-évaluation.** Mon plan répond-il à la problématique ? Chaque partie contient-elle une idée, une explication et un exemple ? Ai-je apporté une réponse nuancée dans ma conclusion ?
$dissertation_example$
  end,
  updated_at = now()
  from public.chapters chapter
  join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
  join public.levels level on level.id = offering.level_id
  join public.series serie on serie.id = offering.series_id
  join public.subjects subject on subject.id = offering.subject_id
  where lesson.chapter_id = chapter.id
    and level.name = 'Terminale'
    and serie.name in ('A1', 'A2', 'C', 'D')
    and subject.name = 'Histoire-Géographie'
    and chapter.title = 'PREMIÈRE PARTIE — NOTIONS DE MÉTHODOLOGIE'
    and lesson.title in ('Leçon 1 — Les techniques du commentaire de deux documents', 'Leçon 2 — Les techniques de la dissertation')
    and lesson.content not like '%## Application guidée — Exemple méthodologique%';

  get diagnostics enriched_lesson_count = row_count;
  if enriched_lesson_count <> 8 then
    raise exception 'Enrichissement méthodologie refusé : 8 cours attendus, % enrichis.', enriched_lesson_count;
  end if;

  for target in
    select lesson.id as lesson_id, lesson.title as lesson_title, chapter.id as chapter_id,
      offering.id as offering_id, offering.subject_id, offering.level_id, offering.series_id
    from public.lessons lesson
    join public.chapters chapter on chapter.id = lesson.chapter_id
    join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
    join public.levels level on level.id = offering.level_id
    join public.series serie on serie.id = offering.series_id
    join public.subjects subject on subject.id = offering.subject_id
    where level.name = 'Terminale'
      and serie.name in ('A1', 'A2', 'C', 'D')
      and subject.name = 'Histoire-Géographie'
      and chapter.title = 'PREMIÈRE PARTIE — NOTIONS DE MÉTHODOLOGIE'
      and lesson.title in ('Leçon 1 — Les techniques du commentaire de deux documents', 'Leçon 2 — Les techniques de la dissertation')
    order by serie.name, lesson.display_order
  loop
    if target.lesson_title = 'Leçon 1 — Les techniques du commentaire de deux documents' then
      insert into public.exercises (subject_id, level_id, series_id, chapter_id, lesson_id, title, statement, solution, exercise_type, difficulty, content_markdown, correction_markdown, is_published, is_active, estimated_duration_minutes, display_order, is_test_data)
      values (target.subject_id, target.level_id, target.series_id, target.chapter_id, target.lesson_id,
        'Exercice 1 — Analyser un commentaire de documents',
        'Réponds aux questions de méthode à partir de situations d’entraînement fictives. Chaque correction explique le raisonnement attendu.',
        'Une réponse efficace distingue le repérage, la preuve tirée du document et l’explication contextualisée.',
        'single_choice', 'medium',
        'Choisis la réponse qui applique le mieux la méthode du commentaire de documents.',
        'Après chaque réponse, relis l’explication pour identifier le geste méthodologique attendu.',
        false, false, 20, 110, false)
        returning id into quiz_id;

      for question_item in select * from (values
        ('Lorsqu’une consigne demande de présenter un document, quel élément faut-il rechercher en priorité ?', 'Sa nature, son auteur ou producteur, sa date et son contexte lorsqu’ils sont disponibles', 'Tous les détails du cours sans regarder le document', 'Une opinion personnelle sans référence au document', 'Présenter un document revient à l’identifier et à le situer avec les informations vérifiables.', 10),
        ('Dans une réponse de commentaire, quel ordre est le plus solide ?', 'Répondre, s’appuyer sur un élément précis, puis expliquer son sens', 'Recopier le document en entier', 'Donner une liste de mots sans phrase', 'La preuve ne remplace pas l’explication : elle doit soutenir une réponse précise.', 20),
        ('Deux documents portent sur le même sujet mais ont des natures différentes. Que faut-il faire ?', 'Montrer ce que chacun apporte et mettre leurs informations en relation', 'Traiter seulement le premier document', 'Affirmer qu’ils disent exactement la même chose sans comparaison', 'La comparaison permet de comprendre les complémentarités, les différences et les limites des sources.', 30),
        ('Pour un graphique, quelle démarche est correcte ?', 'Décrire la tendance principale puis l’expliquer avec le contexte', 'Énumérer tous les chiffres sans les interpréter', 'Ignorer le titre, la date et les unités', 'Un document chiffré doit être lu avec son titre, ses unités et son évolution générale.', 40)
      ) as item(prompt, correct_answer, wrong_one, wrong_two, explanation, display_order) loop
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order)
        values (quiz_id, 'single_choice', question_item.prompt,
          jsonb_build_array(question_item.correct_answer, question_item.wrong_one, question_item.wrong_two),
          jsonb_build_array(question_item.correct_answer), question_item.explanation, question_item.display_order);
      end loop;

      insert into public.exercises (subject_id, level_id, series_id, chapter_id, lesson_id, title, statement, solution, exercise_type, difficulty, content_markdown, correction_markdown, is_published, is_active, estimated_duration_minutes, display_order, is_test_data)
      values (target.subject_id, target.level_id, target.series_id, target.chapter_id, target.lesson_id,
        'Exercice 2 — Appliquer la méthode du commentaire',
        'Choisis la décision méthodologique la plus pertinente dans chaque étape d’un commentaire.',
        'La correction rappelle qu’une analyse reste fidèle au document, précise dans ses preuves et nuancée dans ses jugements.',
        'single_choice', 'medium',
        'Mets-toi dans la situation d’un élève qui prépare une réponse structurée.',
        'La méthode attend une réponse directe, une preuve utile et une explication contextualisée.',
        false, false, 20, 120, false)
        returning id into quiz_id;

      for question_item in select * from (values
        ('Une information n’apparaît pas dans la source du document. Comment la présenter ?', 'Ne pas l’inventer ; utiliser seulement les informations observables ou le signaler avec prudence', 'L’ajouter comme si elle était certaine', 'La remplacer par une date choisie au hasard', 'La précision suppose de ne pas transformer une hypothèse en information du document.', 10),
        ('Que signifie commenter une affirmation du document ?', 'L’expliquer, puis en apprécier la portée ou les limites avec des arguments', 'Dire seulement « je suis d’accord »', 'La recopier sans ajouter aucune explication', 'Le commentaire construit un jugement motivé, fondé sur le document et les connaissances.', 20),
        ('Dans un commentaire de deux documents, quelle phrase exprime une comparaison ?', 'Le premier document défend un point de vue, tandis que le second permet d’observer une évolution', 'Le document est intéressant', 'Je vais parler du premier document uniquement', 'Une comparaison met en relation les apports distincts des deux sources.', 30),
        ('Avant de rendre sa copie, quel contrôle est utile ?', 'Vérifier que chaque réponse respecte le verbe de la consigne', 'Ajouter un long résumé non demandé', 'Supprimer toutes les références aux documents', 'Les verbes de consigne indiquent le type précis de réponse attendu.', 40)
      ) as item(prompt, correct_answer, wrong_one, wrong_two, explanation, display_order) loop
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order)
        values (quiz_id, 'single_choice', question_item.prompt,
          jsonb_build_array(question_item.correct_answer, question_item.wrong_one, question_item.wrong_two),
          jsonb_build_array(question_item.correct_answer), question_item.explanation, question_item.display_order);
      end loop;

      insert into public.quizzes (subject_id, level_id, series_id, subject_offering_id, chapter_id, lesson_id, title, description, difficulty, duration_minutes, display_order, is_published, is_active, is_test_data)
      values (target.subject_id, target.level_id, target.series_id, target.offering_id, target.chapter_id, target.lesson_id,
        'Quiz interactif — Méthode du commentaire de documents',
        'Quatre questions à choix unique avec correction immédiate sur le commentaire de documents.',
        'medium', 10, 110, false, false, false)
        returning id into quiz_id;

      for question_item in select * from (values
        ('Quel est le rôle principal d’une courte citation dans un commentaire ?', 'Appuyer une explication précise', 'Remplacer toute la réponse', 'Décorer la copie sans rapport avec la question', 'La citation est une preuve : elle doit être courte et expliquée.', 10),
        ('Quel élément aide à interpréter un document ?', 'Son contexte de production', 'La couleur du stylo de l’élève', 'Le nombre de lignes de la copie', 'Le contexte aide à comprendre les intentions, les enjeux et les limites d’une source.', 20),
        ('Quel est le meilleur usage des connaissances de cours ?', 'Éclairer les idées du document sans réciter tout le cours', 'Remplacer entièrement l’étude du document', 'Ajouter des informations sans lien avec la consigne', 'Les connaissances servent à contextualiser et à expliquer les éléments étudiés.', 30),
        ('Quelle conclusion est la plus rigoureuse après avoir comparé deux documents ?', 'Ils se complètent ou se distinguent selon leurs natures et leurs points de vue', 'Ils sont forcément identiques parce qu’ils parlent du même thème', 'Un seul document suffit toujours à tout prouver', 'La confrontation invite à une analyse nuancée des apports et limites de chaque source.', 40)
      ) as item(question, correct_answer, wrong_one, wrong_two, explanation, display_order) loop
        insert into public.quiz_questions (quiz_id, question, explanation, question_type, display_order, points, is_active)
        values (quiz_id, question_item.question, question_item.explanation, 'single_choice', question_item.display_order, 1, true)
        returning id into quiz_question_id;
        insert into public.quiz_answers (question_id, answer, is_correct, display_order) values
          (quiz_question_id, question_item.correct_answer, true, 10),
          (quiz_question_id, question_item.wrong_one, false, 20),
          (quiz_question_id, question_item.wrong_two, false, 30);
      end loop;
    else
      insert into public.exercises (subject_id, level_id, series_id, chapter_id, lesson_id, title, statement, solution, exercise_type, difficulty, content_markdown, correction_markdown, is_published, is_active, estimated_duration_minutes, display_order, is_test_data)
      values (target.subject_id, target.level_id, target.series_id, target.chapter_id, target.lesson_id,
        'Exercice 1 — Construire une dissertation',
        'Choisis les démarches qui permettent de comprendre le sujet et de construire une dissertation organisée.',
        'La correction relie chaque réponse à l’analyse du sujet, à la problématique et au plan.',
        'single_choice', 'medium',
        'Réponds en mobilisant les étapes de préparation d’une dissertation.',
        'Une dissertation réussie commence par une analyse du sujet et un plan qui répond à la problématique.',
        false, false, 20, 210, false)
        returning id into quiz_id;

      for question_item in select * from (values
        ('Quelle est la première démarche utile devant un sujet de dissertation ?', 'Repérer les mots-clés, le temps, l’espace et les notions à définir', 'Rédiger immédiatement la conclusion', 'Choisir un plan appris sans lire le sujet', 'Comprendre précisément le sujet évite le hors-sujet et oriente le plan.', 10),
        ('À quoi sert la problématique ?', 'À poser la question centrale qui guidera le raisonnement', 'À remplacer toutes les connaissances du cours', 'À ajouter une phrase sans lien avec le plan', 'La problématique donne une direction au devoir et doit être traitée dans le développement.', 20),
        ('Quel plan convient à un sujet qui demande d’expliquer une évolution ?', 'Un plan qui distingue des étapes ou des transformations logiques', 'Une simple liste de dates isolées', 'Un plan qui ne tient pas compte de la période', 'Le plan doit correspondre à la formulation et à la dynamique du sujet.', 30),
        ('Que doit contenir un paragraphe argumenté ?', 'Une idée, une explication et un exemple qui prouve cette idée', 'Une succession de mots-clés', 'Uniquement une citation sans explication', 'L’exemple sert l’argument : il doit être expliqué et relié à l’idée directrice.', 40)
      ) as item(prompt, correct_answer, wrong_one, wrong_two, explanation, display_order) loop
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order)
        values (quiz_id, 'single_choice', question_item.prompt,
          jsonb_build_array(question_item.correct_answer, question_item.wrong_one, question_item.wrong_two),
          jsonb_build_array(question_item.correct_answer), question_item.explanation, question_item.display_order);
      end loop;

      insert into public.exercises (subject_id, level_id, series_id, chapter_id, lesson_id, title, statement, solution, exercise_type, difficulty, content_markdown, correction_markdown, is_published, is_active, estimated_duration_minutes, display_order, is_test_data)
      values (target.subject_id, target.level_id, target.series_id, target.chapter_id, target.lesson_id,
        'Exercice 2 — Rédiger et relire une dissertation',
        'Choisis les formulations et contrôles qui améliorent l’introduction, le développement et la conclusion.',
        'La correction explique l’utilité de chaque élément de rédaction et de relecture.',
        'single_choice', 'medium',
        'Applique la méthode de rédaction progressive et de relecture finale.',
        'Une bonne copie répond à la problématique, organise les arguments et utilise des transitions claires.',
        false, false, 20, 220, false)
        returning id into quiz_id;

      for question_item in select * from (values
        ('Quel élément doit apparaître dans une introduction ?', 'La présentation du sujet, la problématique et l’annonce du plan', 'Toutes les réponses détaillées du développement', 'Une liste d’exemples sans phrase', 'L’introduction prépare le raisonnement et annonce son organisation.', 10),
        ('Quel est le rôle d’une transition entre deux parties ?', 'Faire le bilan de l’idée précédente et annoncer la suivante', 'Répéter exactement le même paragraphe', 'Ajouter une information hors sujet', 'La transition rend la progression du raisonnement visible pour le lecteur.', 20),
        ('Quelle conclusion répond correctement à la problématique ?', 'Une synthèse suivie d’une réponse nette et éventuellement d’une ouverture liée', 'Une répétition mot à mot de l’introduction', 'Une nouvelle grande partie non annoncée', 'La conclusion clôt le raisonnement au lieu d’ouvrir un développement nouveau.', 30),
        ('Quel contrôle final est pertinent ?', 'Vérifier que le plan répond à la problématique et que les exemples sont expliqués', 'Ajouter des phrases pour remplir la page', 'Supprimer les titres de parties sans relire', 'La relecture vérifie la cohérence, la précision et le respect de la consigne.', 40)
      ) as item(prompt, correct_answer, wrong_one, wrong_two, explanation, display_order) loop
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order)
        values (quiz_id, 'single_choice', question_item.prompt,
          jsonb_build_array(question_item.correct_answer, question_item.wrong_one, question_item.wrong_two),
          jsonb_build_array(question_item.correct_answer), question_item.explanation, question_item.display_order);
      end loop;

      insert into public.quizzes (subject_id, level_id, series_id, subject_offering_id, chapter_id, lesson_id, title, description, difficulty, duration_minutes, display_order, is_published, is_active, is_test_data)
      values (target.subject_id, target.level_id, target.series_id, target.offering_id, target.chapter_id, target.lesson_id,
        'Quiz interactif — Méthode de la dissertation',
        'Quatre questions à choix unique avec correction immédiate sur la dissertation.',
        'medium', 10, 210, false, false, false)
        returning id into quiz_id;

      for question_item in select * from (values
        ('Pourquoi faut-il reformuler un sujet au brouillon ?', 'Pour vérifier sa compréhension avant de choisir un plan', 'Pour éviter de traiter les mots-clés', 'Pour recopier le sujet plusieurs fois sans l’analyser', 'La reformulation rend visibles le problème, les notions et les limites du sujet.', 10),
        ('Quelle affirmation définit le mieux un plan de dissertation ?', 'Une organisation logique qui répond progressivement à la problématique', 'Une liste de connaissances sans classement', 'Un modèle imposé quel que soit le sujet', 'Le plan dépend du sujet et donne une progression au raisonnement.', 20),
        ('Quel usage des exemples est attendu ?', 'Ils illustrent et prouvent une idée après avoir été expliqués', 'Ils remplacent les arguments', 'Ils sont ajoutés sans lien avec la partie', 'Un exemple est utile lorsqu’il démontre concrètement l’idée développée.', 30),
        ('Quel risque faut-il éviter dans une dissertation ?', 'Utiliser un plan appris par cœur qui ne répond pas au sujet', 'Définir les notions principales', 'Relire la cohérence de la conclusion', 'Un bon devoir adapte sa démarche aux termes précis de la consigne.', 40)
      ) as item(question, correct_answer, wrong_one, wrong_two, explanation, display_order) loop
        insert into public.quiz_questions (quiz_id, question, explanation, question_type, display_order, points, is_active)
        values (quiz_id, question_item.question, question_item.explanation, 'single_choice', question_item.display_order, 1, true)
        returning id into quiz_question_id;
        insert into public.quiz_answers (question_id, answer, is_correct, display_order) values
          (quiz_question_id, question_item.correct_answer, true, 10),
          (quiz_question_id, question_item.wrong_one, false, 20),
          (quiz_question_id, question_item.wrong_two, false, 30);
      end loop;
    end if;
  end loop;

  select count(*) into final_exercise_count
  from public.exercises exercise
  join public.lessons lesson on lesson.id = exercise.lesson_id
  join public.chapters chapter on chapter.id = lesson.chapter_id
  join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
  join public.levels level on level.id = offering.level_id
  join public.series serie on serie.id = offering.series_id
  join public.subjects subject on subject.id = offering.subject_id
  where level.name = 'Terminale' and serie.name in ('A1', 'A2', 'C', 'D')
    and subject.name = 'Histoire-Géographie' and chapter.title = 'PREMIÈRE PARTIE — NOTIONS DE MÉTHODOLOGIE'
    and lesson.title in ('Leçon 1 — Les techniques du commentaire de deux documents', 'Leçon 2 — Les techniques de la dissertation')
    and exercise.is_published = false and exercise.is_active = false and exercise.is_test_data = false;

  select count(*) into final_exercise_question_count
  from public.exercise_questions question
  join public.exercises exercise on exercise.id = question.exercise_id
  join public.lessons lesson on lesson.id = exercise.lesson_id
  join public.chapters chapter on chapter.id = lesson.chapter_id
  join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
  join public.levels level on level.id = offering.level_id
  join public.series serie on serie.id = offering.series_id
  join public.subjects subject on subject.id = offering.subject_id
  where level.name = 'Terminale' and serie.name in ('A1', 'A2', 'C', 'D')
    and subject.name = 'Histoire-Géographie' and chapter.title = 'PREMIÈRE PARTIE — NOTIONS DE MÉTHODOLOGIE'
    and lesson.title in ('Leçon 1 — Les techniques du commentaire de deux documents', 'Leçon 2 — Les techniques de la dissertation')
    and coalesce(length(trim(question.prompt_markdown)), 0) > 0
    and jsonb_array_length(question.correct_answers) = 1;

  select count(*) into final_quiz_count
  from public.quizzes quiz
  join public.lessons lesson on lesson.id = quiz.lesson_id
  join public.chapters chapter on chapter.id = lesson.chapter_id
  join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
  join public.levels level on level.id = offering.level_id
  join public.series serie on serie.id = offering.series_id
  join public.subjects subject on subject.id = offering.subject_id
  where level.name = 'Terminale' and serie.name in ('A1', 'A2', 'C', 'D')
    and subject.name = 'Histoire-Géographie' and chapter.title = 'PREMIÈRE PARTIE — NOTIONS DE MÉTHODOLOGIE'
    and lesson.title in ('Leçon 1 — Les techniques du commentaire de deux documents', 'Leçon 2 — Les techniques de la dissertation')
    and quiz.is_published = false and quiz.is_active = false and quiz.is_test_data = false;

  select count(*) into final_quiz_question_count
  from public.quiz_questions question
  join public.quizzes quiz on quiz.id = question.quiz_id
  join public.lessons lesson on lesson.id = quiz.lesson_id
  join public.chapters chapter on chapter.id = lesson.chapter_id
  join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
  join public.levels level on level.id = offering.level_id
  join public.series serie on serie.id = offering.series_id
  join public.subjects subject on subject.id = offering.subject_id
  where level.name = 'Terminale' and serie.name in ('A1', 'A2', 'C', 'D')
    and subject.name = 'Histoire-Géographie' and chapter.title = 'PREMIÈRE PARTIE — NOTIONS DE MÉTHODOLOGIE'
    and lesson.title in ('Leçon 1 — Les techniques du commentaire de deux documents', 'Leçon 2 — Les techniques de la dissertation')
    and coalesce(length(trim(question.question)), 0) > 0 and question.is_active = true;

  select count(*) into final_quiz_answer_count
  from public.quiz_answers answer
  join public.quiz_questions question on question.id = answer.question_id
  join public.quizzes quiz on quiz.id = question.quiz_id
  join public.lessons lesson on lesson.id = quiz.lesson_id
  join public.chapters chapter on chapter.id = lesson.chapter_id
  join public.course_subject_offerings offering on offering.id = chapter.subject_offering_id
  join public.levels level on level.id = offering.level_id
  join public.series serie on serie.id = offering.series_id
  join public.subjects subject on subject.id = offering.subject_id
  where level.name = 'Terminale' and serie.name in ('A1', 'A2', 'C', 'D')
    and subject.name = 'Histoire-Géographie' and chapter.title = 'PREMIÈRE PARTIE — NOTIONS DE MÉTHODOLOGIE'
    and lesson.title in ('Leçon 1 — Les techniques du commentaire de deux documents', 'Leçon 2 — Les techniques de la dissertation')
    and coalesce(length(trim(answer.answer)), 0) > 0;

  if final_exercise_count <> 16 or final_exercise_question_count <> 64 or final_quiz_count <> 8 or final_quiz_question_count <> 32 or final_quiz_answer_count <> 96 then
    raise exception 'Création évaluations refusée : exercices %, questions exercice %, quiz %, questions quiz %, réponses quiz %.', final_exercise_count, final_exercise_question_count, final_quiz_count, final_quiz_question_count, final_quiz_answer_count;
  end if;
end $history_methodology_evaluations$;
