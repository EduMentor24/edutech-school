begin;

do $command$
declare
  target record;
  exercise_method_id uuid;
  exercise_critique_id uuid;
  quiz_id uuid;
  lesson_content text := $lesson$
# Leçon 2 — Le commentaire de texte philosophique

> **Compétence I — Thème : La méthodologie**  
> **Objectif de la leçon :** apprendre à expliquer puis à évaluer un texte philosophique dans une production organisée, rigoureuse et personnelle.

## Situation d’apprentissage

Après avoir étudié la dissertation philosophique, l’élève découvre le **commentaire de texte philosophique**. Pour réussir cet exercice, il doit pouvoir construire une introduction, conduire une étude ordonnée, dégager l’intérêt philosophique d’un texte et conclure avec discernement.

## 1. Comprendre le commentaire de texte philosophique

Le commentaire de texte philosophique est un exercice écrit qui vise à dégager l’intérêt philosophique d’un texte grâce à son étude ordonnée. Commenter ne signifie donc pas répéter le texte autrement. Il s’agit d’abord de **l’expliquer**, c’est-à-dire d’en éclairer le sens, puis de **l’évaluer**, en appréciant la valeur de ses arguments et de sa thèse.

Le devoir comporte trois grandes parties : **l’introduction**, **le développement** et **la conclusion**.

| Partie du devoir | Rôle essentiel |
|---|---|
| Introduction | Présenter le texte à travers son thème, son problème et sa thèse. |
| Développement | Expliquer méthodiquement le texte puis en apprécier l’intérêt philosophique. |
| Conclusion | Faire le bilan du débat et formuler une prise de position argumentée. |

## 2. L’introduction : présenter le texte avec précision

L’introduction organise trois éléments essentiels : le **thème**, le **problème** et la **thèse**. Elle peut aussi annoncer la structure logique du texte, soit à sa fin, soit au début du développement.

| Notion | Question utile | Ce qu’il faut produire |
|---|---|---|
| Thème | De quoi le texte parle-t-il ? | Le domaine ou la notion générale abordée. |
| Problème | Quelle difficulté philosophique le texte soulève-t-il ? | La question à laquelle l’auteur répond. |
| Thèse | Quelle réponse l’auteur donne-t-il ? | La position défendue dans le texte. |
| Intention | Quel est l’objectif immédiat de l’auteur ? | Ce qu’il cherche à montrer, défendre ou réfuter. |
| Enjeu | Qu’y a-t-il à gagner dans la résolution du problème ? | L’importance philosophique de la question. |

> **Méthode.** Une bonne introduction ne raconte pas le texte. Elle fait apparaître clairement la question philosophique, la réponse de l’auteur et la direction de son raisonnement.

## 3. Le développement

Le développement comprend deux moments complémentaires : **l’étude ordonnée** puis **l’intérêt philosophique du texte**.

### A. L’étude ordonnée

L’étude ordonnée explique le texte à partir de sa structure logique, c’est-à-dire de ses différents mouvements. Elle met en évidence la démarche argumentative de l’auteur, ses arguments, ses concepts, ses exemples, ses allusions et, lorsqu’elles existent, ses figures de style.

Pour chaque mouvement, il faut identifier l’idée principale, dégager les idées secondaires, expliquer les termes importants et montrer comment les arguments conduisent à la thèse. Les passages d’un mouvement à l’autre doivent être reliés par des **transitions**.

> **À éviter absolument :** la paraphrase, qui répète le texte sans l’expliquer ; le contre-sens, qui lui attribue une signification contraire ; et le non-sens, qui produit une interprétation sans rapport avec le texte.

### B. L’intérêt philosophique du texte

L’intérêt philosophique est le moment critique du devoir. Il permet d’évaluer le texte dans sa forme et dans son fond. Il comprend une critique interne et une critique externe.

#### 1. La critique interne

La critique interne évalue la forme du raisonnement. Elle examine la cohérence de l’argumentation, l’adéquation entre la démarche argumentative et l’intention de l’auteur, les forces ou les faiblesses des arguments, ainsi que la pertinence du cheminement suivi.

Une critique interne juste ne se réduit pas à dire que l’auteur est « bon » ou « mauvais ». Elle montre précisément pourquoi son raisonnement est convaincant, insuffisant ou discutable.

#### 2. La critique externe

La critique externe évalue le fond, c’est-à-dire la position de l’auteur. Elle se construit en deux temps. D’abord, on peut justifier la thèse en la rapprochant d’autres auteurs ou d’autres arguments. Ensuite, on la dépasse ou on la discute à partir de positions différentes.

> **Règle de rigueur :** une référence philosophique doit servir un argument. Elle ne doit jamais être ajoutée comme une simple décoration.

## 4. La conclusion

La conclusion est la dernière partie du devoir. Elle reprend d’abord le bilan du débat engagé dans la critique externe. Elle se termine par une prise de position personnelle, sobre et argumentée, par rapport à l’intérêt du texte.

La position personnelle ne doit pas être une opinion isolée. Elle doit découler de l’analyse effectuée dans le devoir.

## 5. Méthode complète en sept étapes

1. Lire attentivement le texte et repérer son thème général.
2. Formuler le problème philosophique auquel l’auteur répond.
3. Identifier clairement la thèse défendue.
4. Découper le texte en mouvements logiques et préparer l’étude ordonnée.
5. Expliquer chaque mouvement sans paraphraser, en analysant arguments et concepts.
6. Construire l’intérêt philosophique : critique interne, puis critique externe.
7. Conclure par le bilan du débat et une position personnelle justifiée.

## 6. Exemple guidé : Épictète sur la décence du philosophe

Dans l’extrait des *Maximes et Pensées* proposé dans le document source, Épictète s’interroge sur la tenue du philosophe et de son disciple. Le texte conduit à la question suivante : **le philosophe et son disciple doivent-ils négliger leur tenue ?** La réponse d’Épictète est qu’ils doivent prendre soin de leur corps comme de leur âme.

Le texte se déploie en deux mouvements. Le premier insiste sur la nécessité de la propreté et de la décence chez le philosophe et son disciple : une tenue négligée risque de susciter la répugnance et de détourner de la philosophie. Le second affirme la primauté de la beauté intérieure, liée à l’usage de la raison, sur la seule beauté du corps.

Dans la critique interne, on peut relever que le vocabulaire volontairement excessif et la comparaison avec le criminel renforcent l’intention de l’auteur : faire comprendre que la négligence extérieure nuit à la crédibilité du philosophe. Dans la critique externe, le texte peut être soutenu par l’idée qu’une discipline corporelle accompagne souvent le soin de l’esprit ; il peut aussi être discuté au regard des positions qui considèrent l’apparence corporelle comme secondaire face à la valeur de l’âme.

## 7. Deux situations d’évaluation présentes dans le document source

### A. Hountondji : la philosophie est-elle un système ?

Le texte de Paulin Jidenu Hountondji porte sur la définition de la philosophie. Le problème est de savoir si la philosophie constitue un système achevé. La thèse défendue est qu’elle n’est pas un système clos mais un débat continuellement repris. Le premier mouvement refuse l’idée d’un savoir définitif ; le second présente la philosophie comme une recherche collective, responsable et indéfinie.

L’intérêt philosophique peut alors mettre en valeur le questionnement et la quête du savoir, tout en discutant la place des systèmes et des doctrines dans l’histoire de la philosophie.

### B. Hume : le rôle de la religion dans la vie humaine

Le texte de David Hume porte sur le rôle de la religion. Il soutient que la religion apaise les souffrances et les craintes humaines. Son étude ordonnée distingue les fondements de la religion et sa fonction psychologique. L’intérêt philosophique confronte ensuite cette fonction de consolation aux critiques qui voient dans la religion une illusion ou une source d’aliénation.

## À retenir

- Commenter un texte philosophique, c’est **expliquer puis évaluer**.
- L’introduction articule le thème, le problème et la thèse.
- L’étude ordonnée suit les mouvements logiques du texte et évite la paraphrase.
- L’intérêt philosophique associe critique interne et critique externe.
- La conclusion fait le bilan du débat avant de formuler une position personnelle motivée.

## Référence pédagogique

Cours élaboré à partir du document fourni : **« Le commentaire de texte philosophique »**, Philosophie, Terminale toutes séries, Côte d’Ivoire – École numérique. Les exemples d’Épictète, de Hountondji et de Hume, ainsi que les références mobilisées dans les activités, proviennent de ce document source.
$lesson$;
begin
  for target in
    select
      l.id as lesson_id,
      c.id as chapter_id,
      o.id as offering_id,
      o.subject_id,
      o.level_id,
      o.series_id
    from public.lessons l
    join public.chapters c on c.id = l.chapter_id
    join public.course_subject_offerings o on o.id = c.subject_offering_id
    join public.levels level on level.id = o.level_id
    join public.series series on series.id = o.series_id
    join public.subjects subject on subject.id = o.subject_id
    where l.id in ('fe364cab-7eac-4d14-9c6f-ee279cc92750', 'dac94865-5803-4ae6-b241-c9a2844633ae')
      and level.name = 'Terminale'
      and series.name in ('A1', 'A2')
      and subject.name = 'Philosophie'
  loop
    if exists (
      select 1 from public.lessons
      where id = target.lesson_id
        and coalesce(btrim(content), '') <> ''
    ) then
      raise exception 'La leçon cible % contient déjà du contenu : aucune écriture automatique n’est autorisée.', target.lesson_id;
    end if;

    update public.lessons
    set
      description = 'Méthode complète du commentaire de texte philosophique : introduction, étude ordonnée, intérêt philosophique et conclusion.',
      content = lesson_content,
      is_active = false
    where id = target.lesson_id
      and coalesce(btrim(content), '') = '';

    insert into public.exercises (
      subject_id, level_id, series_id, chapter_id, lesson_id,
      title, statement, solution, exercise_type, difficulty,
      content_markdown, correction_markdown,
      is_published, is_active, estimated_duration_minutes, display_order
    )
    select
      target.subject_id, target.level_id, target.series_id, target.chapter_id, target.lesson_id,
      'Exercice 1 — Repérer la problématique et l’étude ordonnée',
      'Répondez aux questions pour vérifier votre maîtrise des éléments de l’introduction et de l’étude ordonnée du commentaire de texte philosophique.',
      'La correction explique le rôle du thème, du problème, de la thèse et des mouvements logiques.',
      'single_choice', 'easy',
      '## Consigne\n\nPour chaque question, choisissez la réponse qui respecte la méthode étudiée. Prenez appui sur les définitions de la leçon avant de répondre.',
      '## Correction\n\nUne introduction présente le thème, le problème et la thèse. L’étude ordonnée suit les mouvements du texte afin d’expliquer sa démarche argumentative sans le paraphraser.',
      false, false, 10, 10
    where not exists (
      select 1 from public.exercises
      where lesson_id = target.lesson_id
        and title = 'Exercice 1 — Repérer la problématique et l’étude ordonnée'
    )
    returning id into exercise_method_id;

    if exercise_method_id is not null then
      insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order)
      values
        (exercise_method_id, 'single_choice', 'Dans l’introduction, quel élément formule la question philosophique à résoudre ?', jsonb_build_array('Le thème', 'Le problème', 'La thèse', 'La conclusion'), jsonb_build_array('Le problème'), 'Le problème est la difficulté ou la question philosophique à laquelle l’auteur répond.', 10),
        (exercise_method_id, 'single_choice', 'Quelle affirmation définit correctement la thèse ?', jsonb_build_array('Le domaine général abordé par le texte', 'La réponse ou la position défendue par l’auteur', 'La liste des exemples du texte', 'La prise de position du correcteur'), jsonb_build_array('La réponse ou la position défendue par l’auteur'), 'La thèse exprime la réponse que l’auteur apporte au problème posé.', 20),
        (exercise_method_id, 'true_false', 'L’étude ordonnée consiste à répéter le texte avec d’autres mots.', jsonb_build_array('Vrai', 'Faux'), jsonb_build_array('Faux'), 'L’étude ordonnée explique les mouvements, les arguments et les concepts du texte. Elle évite la paraphrase.', 30),
        (exercise_method_id, 'single_choice', 'Que faut-il mettre en évidence dans l’étude ordonnée ?', jsonb_build_array('Les mouvements logiques et la démarche argumentative', 'Uniquement la biographie de l’auteur', 'Seulement son opinion personnelle', 'Les références apprises par cœur'), jsonb_build_array('Les mouvements logiques et la démarche argumentative'), 'Il faut montrer comment l’auteur construit son raisonnement, mouvement après mouvement.', 40),
        (exercise_method_id, 'single_choice', 'Quelle pratique améliore le passage d’un mouvement du texte à un autre ?', jsonb_build_array('La transition', 'La répétition de la thèse', 'La suppression des connecteurs', 'La paraphrase'), jsonb_build_array('La transition'), 'Une transition relie les mouvements et fait apparaître la progression du raisonnement.', 50);
    end if;

    exercise_method_id := null;

    insert into public.exercises (
      subject_id, level_id, series_id, chapter_id, lesson_id,
      title, statement, solution, exercise_type, difficulty,
      content_markdown, correction_markdown,
      is_published, is_active, estimated_duration_minutes, display_order
    )
    select
      target.subject_id, target.level_id, target.series_id, target.chapter_id, target.lesson_id,
      'Exercice 2 — Construire l’intérêt philosophique et la conclusion',
      'Répondez aux questions pour distinguer critique interne, critique externe et conclusion dans un commentaire de texte philosophique.',
      'La correction montre comment évaluer la forme et le fond d’un texte avant de conclure.',
      'single_choice', 'medium',
      '## Consigne\n\nIdentifiez la fonction de chaque étape de l’intérêt philosophique. Justifiez ensuite mentalement votre choix à partir de la méthode étudiée.',
      '## Correction\n\nLa critique interne examine la cohérence et la pertinence de la démarche. La critique externe confronte la thèse à d’autres positions. La conclusion fait le bilan du débat avant une position personnelle argumentée.',
      false, false, 12, 20
    where not exists (
      select 1 from public.exercises
      where lesson_id = target.lesson_id
        and title = 'Exercice 2 — Construire l’intérêt philosophique et la conclusion'
    )
    returning id into exercise_critique_id;

    if exercise_critique_id is not null then
      insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order)
      values
        (exercise_critique_id, 'single_choice', 'La critique interne porte principalement sur…', jsonb_build_array('La cohérence de l’argumentation et la pertinence de la démarche', 'La date de naissance de l’auteur', 'Le nombre de pages du texte', 'Les préférences personnelles du lecteur'), jsonb_build_array('La cohérence de l’argumentation et la pertinence de la démarche'), 'La critique interne évalue la forme du raisonnement : cohérence, forces, faiblesses et adéquation avec l’intention.', 10),
        (exercise_critique_id, 'single_choice', 'La critique externe consiste notamment à…', jsonb_build_array('Justifier puis discuter ou dépasser la thèse à l’aide d’autres positions', 'Recopier la dernière phrase du texte', 'Éviter toute référence philosophique', 'Refuser de prendre en compte la thèse'), jsonb_build_array('Justifier puis discuter ou dépasser la thèse à l’aide d’autres positions'), 'La critique externe apprécie le fond de la position de l’auteur en la confrontant à d’autres arguments et doctrines.', 20),
        (exercise_critique_id, 'true_false', 'La conclusion peut formuler une position personnelle sans faire le bilan du débat.', jsonb_build_array('Vrai', 'Faux'), jsonb_build_array('Faux'), 'La prise de position doit être précédée du bilan du débat engagé, notamment dans la critique externe.', 30),
        (exercise_critique_id, 'single_choice', 'Dans le texte d’Épictète étudié dans le document source, quelle idée est mise en valeur dans le second mouvement ?', jsonb_build_array('La primauté de la beauté intérieure sur la beauté corporelle', 'La supériorité de la richesse', 'L’inutilité de la raison', 'Le refus de toute décence'), jsonb_build_array('La primauté de la beauté intérieure sur la beauté corporelle'), 'Le second mouvement associe la vraie beauté à l’usage de la raison et affirme qu’elle dépasse l’apparence corporelle.', 40),
        (exercise_critique_id, 'single_choice', 'Quelle exigence protège le commentaire contre une critique gratuite ?', jsonb_build_array('Fonder chaque appréciation sur l’analyse du texte et un argument précis', 'Multiplier les jugements sans exemple', 'Ne jamais expliquer les concepts', 'Ignorer la thèse de l’auteur'), jsonb_build_array('Fonder chaque appréciation sur l’analyse du texte et un argument précis'), 'Une évaluation philosophique doit être argumentée et liée au texte étudié.', 50);
    end if;

    exercise_critique_id := null;

    insert into public.quizzes (
      subject_id, level_id, series_id, subject_offering_id, chapter_id, lesson_id,
      title, description, difficulty, duration_minutes, display_order, is_published, is_active
    )
    select
      target.subject_id, target.level_id, target.series_id, target.offering_id, target.chapter_id, target.lesson_id,
      'Quiz de révision — Le commentaire de texte philosophique',
      'Vérifiez les notions, les étapes et les exigences méthodologiques de la leçon.',
      'medium', 12, 10, false, false
    where not exists (
      select 1 from public.quizzes
      where lesson_id = target.lesson_id
        and title = 'Quiz de révision — Le commentaire de texte philosophique'
    )
    returning id into quiz_id;

    if quiz_id is not null then
      with inserted_questions as (
        insert into public.quiz_questions (quiz_id, question, explanation, question_type, display_order, points, is_active)
        values
          (quiz_id, 'Quel est le premier objectif du commentaire de texte philosophique ?', 'Avant d’évaluer le texte, il faut en expliquer le sens ou la signification.', 'single_choice', 10, 1, true),
          (quiz_id, 'Quels éléments structurent principalement l’introduction ?', 'Le document source retient le thème, le problème et la thèse ; la structure logique peut être annoncée selon le choix de rédaction.', 'single_choice', 20, 1, true),
          (quiz_id, 'Que faut-il éviter pendant l’étude ordonnée ?', 'L’étude ordonnée ne doit pas devenir une paraphrase, un contre-sens ou un non-sens.', 'single_choice', 30, 1, true),
          (quiz_id, 'Quel aspect relève de la critique interne ?', 'La critique interne examine notamment la cohérence de l’argumentation et l’adéquation entre démarche et intention.', 'single_choice', 40, 1, true),
          (quiz_id, 'Quel rôle joue la critique externe ?', 'Elle apprécie le fond de la position de l’auteur en la justifiant puis en la discutant grâce à d’autres positions.', 'single_choice', 50, 1, true),
          (quiz_id, 'Dans quel ordre faut-il conclure le commentaire ?', 'La conclusion fait d’abord le bilan du débat, puis formule une prise de position motivée.', 'single_choice', 60, 1, true),
          (quiz_id, 'Dans l’exemple d’Épictète, quelle forme de beauté est présentée comme supérieure ?', 'Le texte met en avant la beauté intérieure, qui consiste à faire usage de la raison.', 'single_choice', 70, 1, true)
        returning id, display_order
      )
      insert into public.quiz_answers (question_id, answer, is_correct, display_order)
      select q.id, a.answer, a.is_correct, a.display_order
      from inserted_questions q
      join lateral (
        select * from (
          values
            (10, 'Éclairer le sens du texte avant de l’évaluer', true, 10),
            (10, 'Raconter la vie de l’auteur', false, 20),
            (10, 'Donner immédiatement son opinion', false, 30),
            (20, 'Le thème, le problème et la thèse', true, 10),
            (20, 'Le résumé, la biographie et la conclusion', false, 20),
            (20, 'La critique interne, la critique externe et le plan personnel', false, 30),
            (30, 'La paraphrase', true, 10),
            (30, 'L’explication des concepts', false, 20),
            (30, 'Les transitions entre mouvements', false, 30),
            (40, 'La cohérence de l’argumentation', true, 10),
            (40, 'La sélection des auteurs à mémoriser', false, 20),
            (40, 'La prise de position personnelle finale', false, 30),
            (50, 'Confronter la thèse à d’autres positions philosophiques', true, 10),
            (50, 'Supprimer toute discussion du texte', false, 20),
            (50, 'Se limiter à définir le thème', false, 30),
            (60, 'Bilan du débat, puis position personnelle argumentée', true, 10),
            (60, 'Position personnelle, puis nouveau résumé du texte', false, 20),
            (60, 'Liste de citations sans bilan', false, 30),
            (70, 'La beauté intérieure liée à l’usage de la raison', true, 10),
            (70, 'La beauté corporelle seule', false, 20),
            (70, 'La richesse matérielle', false, 30)
        ) as answers(question_order, answer, is_correct, display_order)
      ) a on a.question_order = q.display_order;
    end if;

    quiz_id := null;
  end loop;
end;
$command$;

commit;
