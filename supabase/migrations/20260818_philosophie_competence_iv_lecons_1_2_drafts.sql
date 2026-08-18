-- Philosophie Terminale, Compétence IV : huit leçons « Étude d’œuvres » confirmées.
-- A1, A2, C et D ; contenu approfondi issu des deux PDF fournis.
-- Protection absolue contre l’écrasement d’un contenu existant.

do $commande$
declare
  target record;
  exercise_one_id uuid;
  exercise_two_id uuid;
  quiz_id uuid;
  lesson_content text;
  lesson_description text;
begin
  for target in
    select
      l.id as lesson_id, c.id as chapter_id, o.id as offering_id,
      o.subject_id, o.level_id, o.series_id,
      case
        when l.id in ('6f0225cd-37bd-40b1-a724-81d1a3f559d9'::uuid, '6a25851a-22e4-4f8a-bfe9-2b5ca620ca54'::uuid, '7b216e2b-b10f-45be-90f9-f55bb92a1849'::uuid, '9d35557a-cbb0-4fd6-8e0b-21c8e68d059c'::uuid) then 'language_truth'
        when l.id in ('5ed46281-9e01-49fc-b040-5a9c04be470d'::uuid, 'a3816920-f1ea-4f3c-a29a-aee9dcdbaa02'::uuid, '0cf780b6-fca8-46ed-bfdf-4b2c86809459'::uuid, '40e08dfd-1889-4965-aeeb-04dcdd3544d1'::uuid) then 'scientific_knowledge'
      end as lesson_key
    from public.lessons l
    join public.chapters c on c.id = l.chapter_id
    join public.course_subject_offerings o on o.id = c.subject_offering_id
    join public.subjects subject on subject.id = o.subject_id
    join public.levels level on level.id = o.level_id
    join public.series series on series.id = o.series_id
    where l.id in (
      '6f0225cd-37bd-40b1-a724-81d1a3f559d9', '6a25851a-22e4-4f8a-bfe9-2b5ca620ca54',
      '7b216e2b-b10f-45be-90f9-f55bb92a1849', '9d35557a-cbb0-4fd6-8e0b-21c8e68d059c',
      '5ed46281-9e01-49fc-b040-5a9c04be470d', 'a3816920-f1ea-4f3c-a29a-aee9dcdbaa02',
      '0cf780b6-fca8-46ed-bfdf-4b2c86809459', '40e08dfd-1889-4965-aeeb-04dcdd3544d1'
    )
      and level.name = 'Terminale'
      and series.name in ('A1', 'A2', 'C', 'D')
      and subject.name = 'Philosophie'
      and (
        (l.id in ('6f0225cd-37bd-40b1-a724-81d1a3f559d9', '6a25851a-22e4-4f8a-bfe9-2b5ca620ca54', '7b216e2b-b10f-45be-90f9-f55bb92a1849', '9d35557a-cbb0-4fd6-8e0b-21c8e68d059c') and l.title = 'Leçon 1 : Langage et vérité/ ETUDE D’OEUVRES')
        or (l.id in ('5ed46281-9e01-49fc-b040-5a9c04be470d', 'a3816920-f1ea-4f3c-a29a-aee9dcdbaa02', '0cf780b6-fca8-46ed-bfdf-4b2c86809459', '40e08dfd-1889-4965-aeeb-04dcdd3544d1') and l.title = 'Leçon 2 : La connaissance scientifique/ ETUDE D’OEUVRES')
      )
    order by l.id
  loop
    if exists (select 1 from public.lessons where id = target.lesson_id and coalesce(btrim(content), '') <> '') then
      raise exception 'La leçon cible % contient déjà du contenu : aucune écriture automatique n’est autorisée.', target.lesson_id;
    end if;

    if target.lesson_key = 'language_truth' then
      lesson_description := 'Communication, spécificité du langage humain, pensée, critères de vérité et limites de l’expression linguistique.';
      lesson_content := $language$
# Langage et vérité

> **Compétence IV — Thème : Les conditions d’élaboration de la connaissance**  
> **Objectif :** distinguer les formes de communication, analyser les critères de vérité et comprendre à la fois le pouvoir et les limites du langage dans l’expression du vrai.

## Situation d’apprentissage

Les hommes communiquent au moyen de paroles, d’écrits, de gestes et de signes. Pourtant, communiquer ne garantit pas automatiquement que ce qui est dit soit vrai, clairement compris ou fidèlement transmis. La leçon pose donc deux questions liées : **comment le langage permet-il de penser et de communiquer ?** et **peut-il exprimer toute la vérité sans lacune ni tromperie ?**

## 1. Communication animale et langage humain

### A. Communiquer : transmettre et mettre en relation

La **communication** est l’action d’échanger ou de transmettre des messages afin d’établir une relation. Le **langage** est un système de signes, oraux, écrits, gestuels ou graphiques, grâce auquel l’homme peut exprimer une pensée, une émotion ou une intention.

La communication animale existe sous diverses formes : cris, signaux, danses ou comportements. Les travaux de Karl von Frisch sur les abeilles montrent qu’un signal peut transmettre une information utile à propos d’une source de nourriture. Il faut cependant distinguer un code de signaux du langage humain.

### B. La spécificité du langage humain

Pour Saussure, le signe linguistique unit un **signifiant**, c’est-à-dire la face matérielle ou sensible du signe, et un **signifié**, c’est-à-dire le concept auquel le signe renvoie. Le rapport entre les deux est conventionnel : rien ne lie naturellement un mot donné à la chose qu’il désigne.

| Communication animale | Langage humain |
|---|---|
| Code de signaux lié à une situation déterminée. | Système de signes conventionnels et combinables. |
| Répertoire limité et relativement fixe. | Créativité, évolution et polysémie. |
| Réponse principalement comportementale. | Dialogue entre émetteur et récepteur. |
| Transmission d’informations pratiques. | Expression de pensées, valeurs, émotions et projets. |

> **Repère.** Dire que l’animal communique ne revient pas à lui attribuer le langage humain. Le langage humain permet d’inventer des énoncés, de parler de l’absent, du passé, du possible et de l’imaginaire.

### C. Les fonctions du langage

Le langage ne sert pas uniquement à informer. Il a aussi une fonction expressive lorsqu’il manifeste un sentiment, une fonction appellative lorsqu’il cherche à agir sur autrui, une fonction esthétique dans la poésie et une fonction d’élaboration de la pensée. Mounin invite précisément à distinguer ces fonctions plutôt qu’à réduire le langage à un simple outil de transmission.

## 2. Langage, culture et pensée

### A. Le langage est une acquisition culturelle

Le langage s’apprend dans un groupe humain. Les cas d’enfants privés d’un cadre socio-culturel, analysés notamment par Lucien Malson, rappellent que parler n’est pas une capacité qui se développe isolément. Une langue porte des traditions, des usages, des valeurs et une manière de découper l’expérience.

Apprendre une langue, c’est donc apprendre des mots, des règles, mais aussi une manière de percevoir et d’organiser le monde. Le langage aide à instaurer un monde commun : il permet l’accord, le contrat, le droit et la transmission entre générations.

### B. Les mots donnent forme à la pensée

Descartes relie la parole à la pensée. Hegel affirme que c’est dans les mots que nous pensons : le mot donne à la pensée une existence claire et partageable. Cette idée ne signifie pas qu’une pensée naît toute faite avant les mots ; elle signifie que l’expression aide la pensée à se préciser.

| Idée essentielle | Conséquence pédagogique |
|---|---|
| La pensée et le langage sont intimement liés. | Définir les mots rend une idée plus claire. |
| Une langue est un fait culturel. | Le sens des mots dépend des usages d’une communauté. |
| Le langage permet le dialogue. | La communication exige un émetteur, un destinataire et des codes partagés. |

## 3. Les critères et la relativité de la vérité

### A. La vérité comme correspondance avec le réel

Un premier critère définit la vérité comme l’accord entre la connaissance et son objet. Kant présente ainsi la vérité comme conformité de la connaissance avec l’objet. Dire vrai suppose alors que l’énoncé puisse être confronté à ce dont il parle.

Cette définition appelle une précision : ce qui est matériellement réel n’est pas toujours vrai dans son usage. Un faux billet existe matériellement, mais il demeure faux comme monnaie. La vérité demande donc une correspondance et non une simple existence.

### B. Autres critères proposés

| Critère | Idée principale | Limite à examiner |
|---|---|---|
| Unanimité | Ce qui est admis par tous paraît vrai. | Une majorité peut se tromper ou suivre un conformisme. |
| Évidence | Une idée claire et distincte s’impose à l’esprit. | Ce qui paraît évident peut devoir être discuté. |
| Cohérence | Le discours est logiquement ordonné et sans contradiction. | La cohérence formelle ne garantit pas toujours la correspondance au réel. |
| Efficacité | Est vrai ce qui réussit ou donne des résultats. | L’utilité ne remplace pas à elle seule la recherche de la vérité. |

Le scepticisme rappelle que les vérités humaines peuvent être relatives à une époque, à un système de connaissance ou à un point de vue. Cette relativité ne commande pas de renoncer à rechercher le vrai ; elle invite à soumettre les affirmations à la discussion, aux preuves et à la révision.

## 4. Pouvoir et limites du langage

### A. Le langage comme moyen privilégié d’exprimer le vrai

Le langage permet de décrire le monde, de nommer les choses, d’élaborer des connaissances et de les partager. Hobbes relie la possibilité de vérité et de fausseté à l’existence du langage : un énoncé peut être évalué, discuté, justifié ou contredit.

Le langage contribue aussi à la cohésion sociale. Les certitudes partagées facilitent l’accord entre les membres d’une communauté, qu’elle soit scientifique, politique, juridique ou religieuse.

### B. Pourquoi le langage peut-il échouer ?

L’expérience du « vouloir-dire » montre qu’il n’est pas toujours facile de trouver le mot exact. Diderot observe que nous pouvons avoir davantage d’idées que de mots ; Bergson souligne que la pensée et les sentiments personnels dépassent parfois les mots collectifs et généraux.

Les erreurs de langage, le lapsus, l’ambiguïté des termes ou la rhétorique trompeuse peuvent aussi fausser la communication. La bonne pratique philosophique consiste donc à définir les mots, à préciser le contexte et à examiner les arguments plutôt qu’à se fier à la seule force persuasive d’un discours.

## Méthode pour une production argumentée

Pour traiter le sujet **« Parler, est-ce ne dire que la vérité ? »**, définissez parler, ne dire que et vérité. Un premier axe peut montrer que le langage exprime la pensée et permet de décrire le réel. Un second axe doit analyser les insuffisances de l’expression, l’ambiguïté et les usages trompeurs de la parole. Concluez en distinguant la capacité du langage à viser le vrai de la garantie qu’il le dise toujours.

## Synthèse

- La communication animale n’est pas identique au langage humain.
- Le langage humain est culturel, créatif, dialogique et multifonctionnel.
- Les mots aident la pensée à se former, à se préciser et à devenir partageable.
- La vérité peut être examinée selon la correspondance, la cohérence, l’évidence, l’unanimité ou l’efficacité.
- Le langage est indispensable à la recherche du vrai, mais ses ambiguïtés et ses usages imposent une vigilance critique.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Leçon 1 : Langage et vérité »**, Philosophie, Terminale toutes séries, Côte d’Ivoire – École numérique. Les notions, le plan, les auteurs et les méthodes suivent le document source.
$language$;
    elsif target.lesson_key = 'scientific_knowledge' then
      lesson_description := 'Formes de connaissance, spécificité et démarches scientifiques, limites des théories et enjeux bioéthiques.';
      lesson_content := $science$
# La connaissance scientifique

> **Compétence IV — Thème : Les conditions d’élaboration de la vérité**  
> **Objectif :** distinguer les formes de connaissance, comprendre la démarche scientifique et évaluer avec rigueur les pouvoirs ainsi que les limites de la vérité scientifique.

## Situation d’apprentissage

La science permet de prévoir, d’expliquer et de transformer de nombreux aspects du monde. Son efficacité conduit parfois à lui attribuer le monopole de la vérité. Pourtant, d’autres savoirs existent et les théories scientifiques elles-mêmes sont corrigées, discutées ou remplacées.

La question directrice est donc : **la science est-elle la détentrice exclusive de la vérité, ou produit-elle une forme particulière de connaissance, rigoureuse mais limitée ?**

## 1. Les formes et la spécificité de la connaissance

### A. Trois formes de savoir

| Forme de connaissance | Caractères | Limite ou fonction |
|---|---|---|
| Connaissance vulgaire | Opinions, habitudes et informations issues de l’expérience quotidienne. | Elle peut contenir des préjugés et généraliser sans preuve. |
| Connaissance philosophique | Réflexion critique sur l’homme, le monde, le bien, le juste et le vrai. | Elle ne se réduit pas à l’expérimentation. |
| Connaissance scientifique | Savoir rationnel, méthodique, vérifiable et communicable. | Elle porte sur des objets et méthodes déterminés. |

La connaissance scientifique cherche une unité, une généralité et des conclusions concordantes obtenues par des méthodes de vérification. Elle exige de rompre avec l’opinion immédiate, que Bachelard considère comme insuffisante pour penser scientifiquement.

### B. Objectivité, méthode et esprit critique

La science ne se contente pas de constater une apparence. Elle cherche les causes, construit des problèmes, formule des hypothèses et soumet ses propositions à des contrôles. L’objectivité ne signifie pas que le savant n’a aucune idée préalable ; elle signifie que les résultats doivent pouvoir être discutés, examinés et contrôlés selon une méthode partagée.

> **Repère.** Une affirmation devient scientifique non parce qu’elle est prononcée par un savant, mais parce qu’elle peut être justifiée, vérifiée ou mise à l’épreuve suivant des procédures explicites.

## 2. Les types de sciences et leurs démarches

### A. Les sciences formelles

Les sciences formelles, notamment la logique et les mathématiques, s’attachent à la forme du raisonnement. Elles procèdent selon une démarche **axiomatico-déductive** : à partir de définitions, d’axiomes, de postulats et de règles, elles déduisent rigoureusement des conclusions.

Le syllogisme constitue un exemple classique de déduction : si tous les hommes sont mortels et si Socrate est un homme, on conclut que Socrate est mortel. La validité tient ici à la cohérence de l’enchaînement logique.

### B. Les sciences expérimentales

Les sciences expérimentales, telles que la physique ou la chimie, articulent théorie et expérience. Le PDF insiste sur le caractère solidaire de ces deux dimensions : l’expérience fournit des faits à interroger, tandis que la raison construit des hypothèses et organise l’interprétation.

| Étape | Rôle | Question à se poser |
|---|---|---|
| Observation | Relever un fait ou une difficulté. | Que constate-t-on précisément ? |
| Problème | Identifier une contradiction ou une question. | Ce fait contredit-il une explication antérieure ? |
| Hypothèse | Proposer une réponse anticipée. | Quelle explication peut être mise à l’épreuve ? |
| Expérimentation | Construire un test contrôlé. | Quels résultats confirmeraient ou infirmereaient l’hypothèse ? |
| Conclusion provisoire | Conserver, corriger ou abandonner l’hypothèse. | Que permettent réellement de conclure les résultats ? |

Kant, puis Claude Bernard, permettent de dépasser l’opposition entre empirisme et rationalisme. Les sens apportent des données, mais l’entendement les organise ; une théorie sans expérience risque de rester vide, tandis qu’une expérience sans concepts demeure difficile à comprendre.

### C. Les sciences humaines

Les sciences humaines étudient les comportements, les œuvres, les institutions, les sociétés et l’histoire des hommes. Elles veulent être rigoureuses, mais leur objet présente une difficulté particulière : l’être humain est un sujet libre, situé dans une époque et une culture. Le chercheur doit donc être vigilant à ses propres présupposés et aux limites d’une observation qui ne peut pas toujours reproduire les événements.

## 3. Le vivant et les exigences bioéthiques

### A. Comprendre le vivant

Le vivant se caractérise notamment par l’organisation cellulaire, la respiration, la reproduction, la sensibilité aux changements du milieu et des capacités d’autorégulation. La biologie cherche à étudier ces propriétés de façon objective.

Plusieurs explications sont distinguées dans le document : le **finalisme** voit une finalité dans la nature ; le **mécanisme** explique le vivant par les lois matérielles ; le **vitalisme** fait intervenir une force vitale ; l’approche **organiciste** insiste sur l’autoconstitution, l’autorégulation et l’autoréparation propres aux organismes.

### B. Pourquoi une bioéthique ?

Les pratiques médicales et biologiques peuvent toucher profondément la dignité humaine et le respect du vivant. La bioéthique étudie les principes moraux qui doivent guider ces pratiques. Elle ne refuse pas la recherche scientifique ; elle demande que le possible technique soit interrogé à partir du légitime, de la responsabilité et du respect de la personne.

| Domaine évoqué par le document | Question éthique centrale |
|---|---|
| Procréation médicalement assistée | Quel statut accorder à l’embryon, au donneur et à la filiation ? |
| Génétique et interventions sur le corps | Jusqu’où peut-on modifier ou sélectionner sans réduire la personne à un objet ? |
| Vieillissement, fin de vie et soins | Comment articuler soins, dignité et respect de la personne ? |
| Recherche sur les animaux et le vivant | Quelles limites poser à l’expérimentation ? |

## 4. Les limites de la vérité scientifique

### A. Des théories provisoires et révisables

Une théorie scientifique n’est pas une vérité absolue. Elle est tenue de résister aux faits connus et aux nouveaux tests. Popper rappelle qu’une théorie empirique doit pouvoir être réfutée par l’expérience : si les prédictions échouent, la théorie doit être corrigée ou abandonnée.

Cette révisabilité ne rend pas la science inutile ; elle fait sa force. Une théorie est dite corroborée lorsqu’elle a résisté provisoirement à des tests rigoureux, sans être considérée comme définitive.

### B. La science ne répond pas à toutes les questions

La science éclaire les phénomènes, permet des prévisions et produit des techniques. Cependant, elle ne suffit pas à décider par elle-même de ce qui est juste, digne ou souhaitable. Les questions morales, spirituelles, esthétiques et politiques demandent d’autres formes de réflexion.

> **Avertissement méthodologique.** Dire que la science est limitée ne revient pas à la disqualifier. Il s’agit de préciser son domaine de validité, ses méthodes et les responsabilités qui accompagnent ses applications.

## Méthode pour une production argumentée

Pour traiter **« Nos connaissances résultent-elles de l’expérience ? »**, définissez connaissance et expérience. Un premier axe peut exposer l’empirisme, qui fait des sens la source du savoir. Un deuxième présentera le rationalisme, qui valorise la raison. Un troisième doit montrer, avec Kant et Claude Bernard, la complémentarité entre expérience et activité de l’esprit.

## Synthèse

- La connaissance scientifique se distingue de l’opinion par l’esprit critique, la méthode et la vérification.
- Les sciences formelles privilégient la déduction rigoureuse ; les sciences expérimentales articulent théorie et expérience ; les sciences humaines étudient l’homme et ses productions.
- L’observation, l’hypothèse et l’expérimentation constituent des étapes essentielles de la démarche expérimentale.
- La bioéthique pose des exigences morales face aux interventions sur le vivant.
- La vérité scientifique est puissante, mais provisoire, révisable et non exclusive des autres questions humaines.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Leçon 2 : La connaissance scientifique »**, Philosophie, Terminale toutes séries, Côte d’Ivoire – École numérique. Les notions, le plan, les auteurs et les méthodes suivent le document source.
$science$;
    else
      raise exception 'Leçon cible non reconnue : %', target.lesson_id;
    end if;

    update public.lessons
    set description = lesson_description, content = lesson_content, is_active = false
    where id = target.lesson_id and coalesce(btrim(content), '') = '';

    if target.lesson_key = 'language_truth' then
      insert into public.exercises (subject_id, level_id, series_id, chapter_id, lesson_id, title, statement, solution, exercise_type, difficulty, content_markdown, correction_markdown, is_published, is_active, estimated_duration_minutes, display_order)
      select target.subject_id, target.level_id, target.series_id, target.chapter_id, target.lesson_id,
        'Exercice 1 — Communication, signes et langage humain',
        'Vérifiez les notions relatives à la communication animale, au signe linguistique et aux fonctions du langage.',
        'La correction distingue le code de signaux du langage humain et précise le rôle du signifiant, du signifié et de la culture.',
        'single_choice', 'easy',
        '## Consigne\n\nRépondez à partir des définitions et comparaisons de la leçon.',
        '## Correction\n\nLe langage humain est conventionnel, créatif et dialogique. La communication animale peut transmettre une information sans posséder ces mêmes propriétés.',
        false, false, 12, 10
      where not exists (select 1 from public.exercises e where e.lesson_id = target.lesson_id and e.title = 'Exercice 1 — Communication, signes et langage humain')
      returning id into exercise_one_id;
      if exercise_one_id is not null then
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order) values
          (exercise_one_id, 'single_choice', 'Que désigne le signifiant dans le signe linguistique ?', jsonb_build_array('La face matérielle ou sensible du signe', 'Le concept associé au mot', 'La vérité d’une théorie', 'Un geste animal immuable'), jsonb_build_array('La face matérielle ou sensible du signe'), 'Le signifiant est la forme sonore, graphique, gestuelle ou matérielle du signe.', 10),
          (exercise_one_id, 'single_choice', 'Que désigne le signifié ?', jsonb_build_array('Le concept associé au signe', 'La matière sonore du mot', 'Une preuve expérimentale', 'Une réaction instinctive'), jsonb_build_array('Le concept associé au signe'), 'Le signifié est la représentation mentale ou le concept auquel le signe renvoie.', 20),
          (exercise_one_id, 'single_choice', 'Quelle différence caractérise le langage humain ?', jsonb_build_array('Il permet la créativité et le dialogue', 'Il est un code fixe sans échange', 'Il se limite à un seul signal', 'Il ne dépend d’aucune culture'), jsonb_build_array('Il permet la créativité et le dialogue'), 'Le langage humain est évolutif, créatif et orienté vers l’échange.', 30),
          (exercise_one_id, 'single_choice', 'Pourquoi le langage est-il dit culturel ?', jsonb_build_array('Parce qu’il s’acquiert dans une communauté et transmet une vision du monde', 'Parce qu’il est produit seulement par la nature', 'Parce qu’il ne s’apprend jamais', 'Parce qu’il exclut toute règle'), jsonb_build_array('Parce qu’il s’acquiert dans une communauté et transmet une vision du monde'), 'Une langue est liée aux usages, aux traditions et à l’apprentissage social.', 40),
          (exercise_one_id, 'true_false', 'Le langage sert seulement à transmettre une information et ne possède aucune autre fonction.', jsonb_build_array('Vrai', 'Faux'), jsonb_build_array('Faux'), 'Le langage possède aussi des fonctions expressive, esthétique, appellative et d’élaboration de la pensée.', 50);
      end if;
      exercise_one_id := null;

      insert into public.exercises (subject_id, level_id, series_id, chapter_id, lesson_id, title, statement, solution, exercise_type, difficulty, content_markdown, correction_markdown, is_published, is_active, estimated_duration_minutes, display_order)
      select target.subject_id, target.level_id, target.series_id, target.chapter_id, target.lesson_id,
        'Exercice 2 — Vérité, pensée et limites de la parole',
        'Analysez les critères de vérité et les difficultés du langage à exprimer fidèlement la pensée.',
        'La correction met en relation correspondance, cohérence, relativité de la vérité et imperfections de l’expression.',
        'single_choice', 'medium',
        '## Consigne\n\nDistinguez les critères de vérité et les arguments qui montrent le pouvoir ou les limites du langage.',
        '## Correction\n\nUn discours cohérent n’est pas nécessairement conforme au réel. Le langage permet de viser le vrai mais peut être ambigu, imprécis ou trompeur.',
        false, false, 14, 20
      where not exists (select 1 from public.exercises e where e.lesson_id = target.lesson_id and e.title = 'Exercice 2 — Vérité, pensée et limites de la parole')
      returning id into exercise_two_id;
      if exercise_two_id is not null then
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order) values
          (exercise_two_id, 'single_choice', 'Quel critère définit la vérité comme accord de la connaissance avec son objet ?', jsonb_build_array('La correspondance avec le réel', 'La seule unanimité', 'La magie du mot', 'La répétition d’une opinion'), jsonb_build_array('La correspondance avec le réel'), 'Ce critère demande que ce qui est affirmé soit confrontable à l’objet ou au fait concerné.', 10),
          (exercise_two_id, 'single_choice', 'Pourquoi l’unanimité n’est-elle pas un critère suffisant ?', jsonb_build_array('Parce qu’un groupe peut suivre le conformisme ou se tromper', 'Parce que personne ne peut jamais être d’accord', 'Parce que la vérité n’a aucun rapport avec les autres', 'Parce que les mots sont toujours exacts'), jsonb_build_array('Parce qu’un groupe peut suivre le conformisme ou se tromper'), 'Le consensus peut être utile, mais il ne dispense pas de l’examen critique.', 20),
          (exercise_two_id, 'single_choice', 'Quelle limite du langage souligne Bergson ?', jsonb_build_array('La pensée et le sentiment personnels peuvent dépasser les mots collectifs', 'Le langage ne peut jamais communiquer', 'Les mots sont toujours faux', 'La pensée existe sans aucune expression'), jsonb_build_array('La pensée et le sentiment personnels peuvent dépasser les mots collectifs'), 'Les mots généraux peuvent ne pas restituer entièrement un vécu individuel.', 30),
          (exercise_two_id, 'single_choice', 'Quel risque présente la rhétorique sophistique dans la leçon ?', jsonb_build_array('Employer la parole pour persuader ou tromper sans viser le vrai', 'Remplacer les mots par des preuves', 'Éliminer tout dialogue', 'Créer une science exacte'), jsonb_build_array('Employer la parole pour persuader ou tromper sans viser le vrai'), 'La force persuasive d’un discours ne garantit pas sa vérité.', 40),
          (exercise_two_id, 'true_false', 'La cohérence logique garantit toujours à elle seule la vérité matérielle d’un énoncé.', jsonb_build_array('Vrai', 'Faux'), jsonb_build_array('Faux'), 'Un raisonnement peut être cohérent en forme tout en ne correspondant pas au réel.', 50);
      end if;
      exercise_two_id := null;

      insert into public.quizzes (subject_id, level_id, series_id, subject_offering_id, chapter_id, lesson_id, title, description, difficulty, duration_minutes, display_order, is_published, is_active)
      select target.subject_id, target.level_id, target.series_id, target.offering_id, target.chapter_id, target.lesson_id,
        'Quiz de révision — Langage et vérité',
        'Vérifiez votre compréhension des formes de communication, des critères de vérité et des limites du langage.',
        'medium', 12, 10, false, false
      where not exists (select 1 from public.quizzes q where q.lesson_id = target.lesson_id and q.title = 'Quiz de révision — Langage et vérité')
      returning id into quiz_id;
      if quiz_id is not null then
        with inserted_questions as (
          insert into public.quiz_questions (quiz_id, question, explanation, question_type, display_order, points, is_active) values
            (quiz_id, 'Quelle fonction du langage permet de manifester un sentiment ?', 'La fonction expressive permet de communiquer une émotion ou une attitude.', 'single_choice', 10, 1, true),
            (quiz_id, 'Quel caractère du langage humain dépend d’une convention ?', 'Le rapport entre signifiant et signifié est arbitraire ou conventionnel.', 'single_choice', 20, 1, true),
            (quiz_id, 'Quelle relation Hegel établit-il entre mot et pensée ?', 'Le mot donne à la pensée une existence claire et partageable.', 'single_choice', 30, 1, true),
            (quiz_id, 'Quel critère demande de vérifier l’accord entre un énoncé et son objet ?', 'Le critère de correspondance avec le réel.', 'single_choice', 40, 1, true),
            (quiz_id, 'Pourquoi la vérité peut-elle être relative ?', 'Les connaissances et leurs critères peuvent évoluer selon les domaines et les époques.', 'single_choice', 50, 1, true),
            (quiz_id, 'Quelle attitude favorise une communication plus rigoureuse ?', 'Définir les mots, préciser le contexte et examiner les arguments.', 'single_choice', 60, 1, true)
          returning id, display_order
        )
        insert into public.quiz_answers (question_id, answer, is_correct, display_order)
        select q.id, a.answer, a.is_correct, a.display_order from inserted_questions q join lateral (select * from (values
          (10, 'La fonction expressive', true, 10), (10, 'La fonction de calcul seulement', false, 20), (10, 'La fonction animale fixe', false, 30),
          (20, 'Le rapport entre signifiant et signifié', true, 10), (20, 'Le besoin de respirer', false, 20), (20, 'La vérité d’un fait', false, 30),
          (30, 'Le mot donne une existence claire à la pensée', true, 10), (30, 'La pensée n’a aucun lien avec les mots', false, 20), (30, 'Le langage interdit de penser', false, 30),
          (40, 'La correspondance avec le réel', true, 10), (40, 'La simple répétition', false, 20), (40, 'La force de persuasion', false, 30),
          (50, 'Les connaissances et leurs critères peuvent évoluer', true, 10), (50, 'Toute vérité est définitivement fixe', false, 20), (50, 'La réalité n’existe pas', false, 30),
          (60, 'Définir les mots et examiner les arguments', true, 10), (60, 'Parler sans contexte', false, 20), (60, 'Refuser tout dialogue', false, 30)
        ) as answers(question_order, answer, is_correct, display_order)) a on a.question_order = q.display_order;
      end if;

    elsif target.lesson_key = 'scientific_knowledge' then
      insert into public.exercises (subject_id, level_id, series_id, chapter_id, lesson_id, title, statement, solution, exercise_type, difficulty, content_markdown, correction_markdown, is_published, is_active, estimated_duration_minutes, display_order)
      select target.subject_id, target.level_id, target.series_id, target.chapter_id, target.lesson_id,
        'Exercice 1 — Formes de connaissance et méthodes scientifiques',
        'Distinguez les formes de connaissance, les types de sciences et les étapes de la démarche expérimentale.',
        'La correction compare opinion, réflexion philosophique et science, puis précise les démarches formelle, expérimentale et humaine.',
        'single_choice', 'easy',
        '## Consigne\n\nRépondez à chaque question en vous appuyant sur les définitions et tableaux de la leçon.',
        '## Correction\n\nLa science est méthodique et vérifiable ; les sciences formelles déduisent, les expérimentales testent des hypothèses, les humaines étudient les réalités humaines avec des difficultés propres.',
        false, false, 12, 10
      where not exists (select 1 from public.exercises e where e.lesson_id = target.lesson_id and e.title = 'Exercice 1 — Formes de connaissance et méthodes scientifiques')
      returning id into exercise_one_id;
      if exercise_one_id is not null then
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order) values
          (exercise_one_id, 'single_choice', 'Quelle forme de connaissance est liée au sens commun et aux habitudes ?', jsonb_build_array('La connaissance vulgaire', 'La connaissance scientifique', 'La géométrie axiomatique', 'La bioéthique'), jsonb_build_array('La connaissance vulgaire'), 'La connaissance vulgaire rassemble des opinions et informations issues de l’expérience quotidienne.', 10),
          (exercise_one_id, 'single_choice', 'Quel trait caractérise la connaissance scientifique ?', jsonb_build_array('Elle recherche des résultats vérifiables selon une méthode explicite', 'Elle refuse toute preuve', 'Elle dépend seulement des goûts individuels', 'Elle répète les préjugés'), jsonb_build_array('Elle recherche des résultats vérifiables selon une méthode explicite'), 'La science exige des procédures de vérification et de discussion des résultats.', 20),
          (exercise_one_id, 'single_choice', 'Quelles disciplines appartiennent aux sciences formelles ?', jsonb_build_array('La logique et les mathématiques', 'La physique et la chimie', 'La sociologie et l’histoire', 'La médecine et la biologie'), jsonb_build_array('La logique et les mathématiques'), 'Les sciences formelles s’attachent à la forme et à la validité des raisonnements.', 30),
          (exercise_one_id, 'single_choice', 'Quelle étape suit normalement l’observation d’un fait-question ?', jsonb_build_array('La formulation d’une hypothèse', 'La proclamation d’une vérité absolue', 'La suppression de l’expérience', 'Le refus de toute théorie'), jsonb_build_array('La formulation d’une hypothèse'), 'L’hypothèse propose une réponse anticipée au problème soulevé par les faits.', 40),
          (exercise_one_id, 'true_false', 'Les sciences humaines peuvent ignorer entièrement l’époque et les présupposés du chercheur.', jsonb_build_array('Vrai', 'Faux'), jsonb_build_array('Faux'), 'Les sciences humaines doivent prendre en compte le risque de subjectivité et la singularité des actions humaines.', 50);
      end if;
      exercise_one_id := null;

      insert into public.exercises (subject_id, level_id, series_id, chapter_id, lesson_id, title, statement, solution, exercise_type, difficulty, content_markdown, correction_markdown, is_published, is_active, estimated_duration_minutes, display_order)
      select target.subject_id, target.level_id, target.series_id, target.chapter_id, target.lesson_id,
        'Exercice 2 — Théories, vivant et responsabilité scientifique',
        'Analysez le caractère provisoire des théories et les exigences éthiques liées à la connaissance du vivant.',
        'La correction relie la falsifiabilité, la révision des théories et la bioéthique au respect de la personne et du vivant.',
        'single_choice', 'medium',
        '## Consigne\n\nIdentifiez les arguments qui permettent d’évaluer les limites de la vérité scientifique et les responsabilités de la recherche.',
        '## Correction\n\nLes théories scientifiques sont révisables ; la bioéthique interroge la légitimité des pratiques biologiques et médicales, sans rejeter la science elle-même.',
        false, false, 14, 20
      where not exists (select 1 from public.exercises e where e.lesson_id = target.lesson_id and e.title = 'Exercice 2 — Théories, vivant et responsabilité scientifique')
      returning id into exercise_two_id;
      if exercise_two_id is not null then
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order) values
          (exercise_two_id, 'single_choice', 'Que signifie le caractère falsifiable d’une théorie selon Popper ?', jsonb_build_array('Elle doit pouvoir être mise à l’épreuve et éventuellement réfutée', 'Elle ne peut jamais être discutée', 'Elle est éternellement vraie', 'Elle ne concerne aucun fait'), jsonb_build_array('Elle doit pouvoir être mise à l’épreuve et éventuellement réfutée'), 'Une théorie empirique doit courir le risque d’être contredite par l’expérience.', 10),
          (exercise_two_id, 'single_choice', 'Quelle limite des sciences expérimentales est présentée ?', jsonb_build_array('De nouveaux faits peuvent conduire à corriger les théories', 'Elles n’utilisent jamais d’hypothèse', 'Elles ne produisent aucune connaissance', 'Elles éliminent toute subjectivité par principe'), jsonb_build_array('De nouveaux faits peuvent conduire à corriger les théories'), 'Les lois scientifiques sont provisoires et ouvertes à la révision.', 20),
          (exercise_two_id, 'single_choice', 'Quelle approche insiste sur l’autorégulation et l’autoréparation du vivant ?', jsonb_build_array('L’approche organiciste', 'Le mécanisme strict', 'Le scepticisme', 'La logique formelle'), jsonb_build_array('L’approche organiciste'), 'L’approche organiciste distingue l’organisme d’une simple machine.', 30),
          (exercise_two_id, 'single_choice', 'Quel est le rôle de la bioéthique ?', jsonb_build_array('Interroger les principes moraux guidant les pratiques sur le vivant', 'Empêcher toute recherche scientifique', 'Remplacer la biologie par le mythe', 'Démontrer des théorèmes'), jsonb_build_array('Interroger les principes moraux guidant les pratiques sur le vivant'), 'La bioéthique cherche à articuler le possible technique et le légitime moral.', 40),
          (exercise_two_id, 'true_false', 'Reconnaître les limites de la science revient à nier toute valeur à la recherche scientifique.', jsonb_build_array('Vrai', 'Faux'), jsonb_build_array('Faux'), 'La leçon distingue la valeur de la science de la prétention à répondre seule à toutes les questions humaines.', 50);
      end if;
      exercise_two_id := null;

      insert into public.quizzes (subject_id, level_id, series_id, subject_offering_id, chapter_id, lesson_id, title, description, difficulty, duration_minutes, display_order, is_published, is_active)
      select target.subject_id, target.level_id, target.series_id, target.offering_id, target.chapter_id, target.lesson_id,
        'Quiz de révision — La connaissance scientifique',
        'Évaluez votre compréhension des démarches scientifiques, de la vérité provisoire et des enjeux bioéthiques.',
        'medium', 12, 10, false, false
      where not exists (select 1 from public.quizzes q where q.lesson_id = target.lesson_id and q.title = 'Quiz de révision — La connaissance scientifique')
      returning id into quiz_id;
      if quiz_id is not null then
        with inserted_questions as (
          insert into public.quiz_questions (quiz_id, question, explanation, question_type, display_order, points, is_active) values
            (quiz_id, 'Quel objectif distingue l’esprit scientifique de l’opinion ?', 'L’esprit scientifique cherche des preuves et des résultats contrôlables plutôt que de s’en tenir aux apparences.', 'single_choice', 10, 1, true),
            (quiz_id, 'Que permet le raisonnement déductif dans les sciences formelles ?', 'Il tire des conclusions rigoureuses à partir de principes et de règles.', 'single_choice', 20, 1, true),
            (quiz_id, 'Quelle relation la méthode scientifique établit-elle entre théorie et expérience ?', 'Elles sont complémentaires : l’une organise les questions, l’autre met les hypothèses à l’épreuve.', 'single_choice', 30, 1, true),
            (quiz_id, 'Quel résultat peut avoir une expérimentation sur une hypothèse ?', 'Elle peut la confirmer provisoirement ou l’infirmer.', 'single_choice', 40, 1, true),
            (quiz_id, 'Pourquoi une loi scientifique est-elle dite provisoire ?', 'De nouvelles observations ou expériences peuvent conduire à sa révision.', 'single_choice', 50, 1, true),
            (quiz_id, 'Quelle exigence doit accompagner le progrès des biotechnologies ?', 'Le respect de la dignité humaine et du vivant dans une réflexion bioéthique.', 'single_choice', 60, 1, true)
          returning id, display_order
        )
        insert into public.quiz_answers (question_id, answer, is_correct, display_order)
        select q.id, a.answer, a.is_correct, a.display_order from inserted_questions q join lateral (select * from (values
          (10, 'Chercher des preuves et des résultats contrôlables', true, 10), (10, 'Répéter les préjugés', false, 20), (10, 'Refuser les questions', false, 30),
          (20, 'Tirer des conclusions rigoureuses à partir de principes', true, 10), (20, 'Observer sans raisonner', false, 20), (20, 'Éviter les définitions', false, 30),
          (30, 'Elles sont complémentaires', true, 10), (30, 'Elles s’excluent toujours', false, 20), (30, 'Elles n’ont aucun rôle', false, 30),
          (40, 'La confirmer provisoirement ou l’infirmer', true, 10), (40, 'La rendre éternelle', false, 20), (40, 'Supprimer toute méthode', false, 30),
          (50, 'De nouvelles expériences peuvent conduire à sa révision', true, 10), (50, 'Elle est toujours absolue', false, 20), (50, 'Elle est sans rapport avec les faits', false, 30),
          (60, 'Le respect de la dignité humaine et du vivant', true, 10), (60, 'L’absence de toute règle', false, 20), (60, 'Le refus automatique de la médecine', false, 30)
        ) as answers(question_order, answer, is_correct, display_order)) a on a.question_order = q.display_order;
      end if;
    end if;
    quiz_id := null;
  end loop;
end;
$commande$;
