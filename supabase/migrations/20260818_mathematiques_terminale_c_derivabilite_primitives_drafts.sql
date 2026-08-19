-- Terminale C : dérivabilité et étude de fonctions ; primitives et calcul intégral.
-- Contenus PDF approfondis, inactifs et non publiés. Toute leçon déjà renseignée bloque l’opération.

do $math_terminal_c$
declare
  target record;
  exercise_one_id uuid;
  exercise_two_id uuid;
  quiz_id uuid;
  lesson_content text;
  lesson_description text;
  exercise_one_title text;
  exercise_two_title text;
  quiz_title text;
begin
  for target in
    select l.id as lesson_id, c.id as chapter_id, o.id as offering_id,
      o.subject_id, o.level_id, o.series_id,
      case
        when l.id = 'b87a86fd-6892-4ca5-9585-4965b1a057bf'::uuid then 'derivability'
        when l.id = '5f52ef2e-138e-4ad5-b85b-1df6c416cc23'::uuid then 'primitives'
      end as lesson_key
    from public.lessons l
    join public.chapters c on c.id = l.chapter_id
    join public.course_subject_offerings o on o.id = c.subject_offering_id
    join public.subjects subject on subject.id = o.subject_id
    join public.levels level on level.id = o.level_id
    join public.series series on series.id = o.series_id
    where l.id in ('b87a86fd-6892-4ca5-9585-4965b1a057bf', '5f52ef2e-138e-4ad5-b85b-1df6c416cc23')
      and subject.name = 'Mathématiques' and level.name = 'Terminale' and series.name = 'C'
    order by l.id
  loop
    if exists (select 1 from public.lessons where id = target.lesson_id and coalesce(btrim(content), '') <> '') then
      raise exception 'La leçon Terminale C % contient déjà du contenu : aucun écrasement automatique n’est autorisé.', target.lesson_id;
    end if;

    if target.lesson_key = 'derivability' then
      lesson_description := 'Dérivabilité, dérivées, inégalités des accroissements finis et étude complète de fonctions.';
      lesson_content := $derivability$
## Dérivabilité et étude de fonctions

> **Thème : Fonctions numériques**  
> **Objectif :** reconnaître une fonction dérivable, calculer des dérivées, interpréter les tangentes et construire une étude de fonction rigoureuse.

## Situation d’apprentissage

Une entreprise modélise son bénéfice par une fonction \(B\) dépendant de la production. Pour choisir la production qui procure le meilleur bénéfice, il faut comprendre comment la fonction varie. La dérivée ne donne pas seulement un calcul : elle indique la pente de la courbe et permet de repérer des valeurs optimales.

> **Définition : taux d’accroissement**
> Entre \(x_0\) et \(x\), le taux d’accroissement de \(f\) est \((f(x)-f(x_0))/(x-x_0)\). Il décrit une pente moyenne sur l’intervalle étudié.

## 1. Dérivée en un point et tangente

Une fonction \(f\) est **dérivable** en \(x_0\) lorsque son taux d’accroissement admet une limite réelle finie lorsque \(x\) tend vers \(x_0\). Cette limite est le nombre dérivé \(f'(x_0)\).

$$
f'(x_0)=\lim_{x\to x_0}\frac{f(x)-f(x_0)}{x-x_0}
$$

Géométriquement, \(f'(x_0)\) est le coefficient directeur de la tangente à la courbe au point d’abscisse \(x_0\). Si \(f'(x_0)=0\), la tangente est horizontale ; cela ne suffit pas, à lui seul, pour conclure à un maximum ou à un minimum.

$$
y=f'(x_0)(x-x_0)+f(x_0)
$$

> **Méthode : écrire une tangente**
> Calculer d’abord \(f(x_0)\), puis \(f'(x_0)\). Remplacer ces deux valeurs dans l’équation ci-dessus. La tangente passe obligatoirement par \((x_0;f(x_0))\).

## 2. Dérivées à gauche et à droite

Lorsque la formule de \(f\) change en \(x_0\), on étudie séparément les deux limites :

$$
f'_g(x_0)=\lim_{x\to x_0^-}\frac{f(x)-f(x_0)}{x-x_0},\qquad
f'_d(x_0)=\lim_{x\to x_0^+}\frac{f(x)-f(x_0)}{x-x_0}
$$

La fonction est dérivable en \(x_0\) exactement lorsque les deux nombres dérivés existent, sont finis et sont égaux. S’ils sont distincts, la courbe présente souvent un angle ; si l’un est infini, elle peut avoir une demi-tangente verticale.

> **Définition : demi-tangente**
> C’est la direction suivie par la courbe lorsque l’on approche un point par un seul côté. Elle est utile aux frontières d’un intervalle ou pour les fonctions définies par morceaux.

## 3. Règles de dérivation et composition

| Fonction | Dérivée |
|---|---|
| \(x^n\) | \(nx^{n-1}\) |
| \(\sqrt{x}\) sur \(]0;+∞[\) | \(1/(2\sqrt{x})\) |
| \(\sin x\) | \(\cos x\) |
| \(\cos x\) | \(-\sin x\) |
| \(u\circ v\) | \(v'\,(u'\circ v)\) |

La règle de composition signifie qu’il faut dériver la fonction extérieure puis multiplier par la dérivée de la fonction intérieure. Ainsi, pour \(f(x)=(2x+1)^3\), on reconnaît une puissance d’une expression :

$$
f'(x)=3(2x+1)^2\times2=6(2x+1)^2
$$

> **Attention :** oublier la dérivée de l’expression intérieure est une erreur fréquente. Le facteur \(2\) dans l’exemple ne doit pas disparaître.

## 4. Dérivées successives et fonction réciproque

La dérivée de \(f'\) est la **dérivée seconde** \(f''\). Elle permet notamment d’étudier la variation de la dérivée. Pour une bijection dérivable \(f\), si \(f'(x_0)\ne0\), la dérivée de la bijection réciproque au point \(y_0=f(x_0)\) est :

$$
(f^{-1})'(y_0)=\frac{1}{f'(x_0)}
$$

Cette formule exige que le point d’origine et sa valeur image soient identifiés correctement. L’inverse de la fonction n’est pas l’inverse numérique de \(f(x)\) : il s’agit de la fonction qui annule l’action de \(f\) sur l’intervalle considéré.

## 5. Inégalités des accroissements finis

Si \(m\le f'(x)\le M\) sur \([a;b]\), la variation totale de \(f\) est encadrée :

$$
m(b-a)\le f(b)-f(a)\le M(b-a)
$$

Cette propriété sert à estimer une différence de valeurs sans calculer exactement la fonction. En particulier, si \(|f'(x)|\le M\), alors \(|f(b)-f(a)|\le M|b-a|\). Elle formalise l’idée que la pente contrôle la vitesse de variation de la fonction.

## 6. Étudier une fonction étape par étape

> **Méthode : étude complète**
> 1. Déterminer le domaine. 2. Calculer les limites aux bornes du domaine. 3. Repérer les asymptotes éventuelles. 4. Calculer et simplifier \(f'\). 5. Étudier le signe de \(f'\). 6. Construire le tableau de variations. 7. Ajouter les tangentes, positions relatives et valeurs remarquables pour tracer la courbe.

Une dérivée positive indique une fonction croissante ; une dérivée négative indique une fonction décroissante. Un changement de signe de \(f'\) de positif à négatif signale un maximum local ; le changement inverse signale un minimum local.

## Exemple d’optimisation

Le PDF modélise un bénéfice par \(B(x)=-x^3/3+9x+2\) sur \([1;5]\). Sa dérivée vaut \(B'(x)=9-x^2\). Sur cet intervalle, son signe est positif avant 3 et négatif après 3 : \(B\) augmente puis diminue. Le bénéfice maximal est donc atteint pour \(x=3\). Dans le contexte de la situation, cela correspond à 3 000 sachets.

> **Synthèse**
> La dérivée relie le calcul, la géométrie et la décision : elle donne la pente de la tangente, organise les variations et permet d’identifier une solution optimale lorsqu’un modèle dépend d’une variable.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Dérivabilité et étude de fonctions »**, Mathématiques, Terminale C, Côte d’Ivoire – École numérique.
$derivability$;
      exercise_one_title := 'Exercice 1 — Dérivabilité et tangentes';
      exercise_two_title := 'Exercice 2 — Variations et optimisation';
      quiz_title := 'Quiz de révision — Dérivabilité et étude de fonctions';
    elsif target.lesson_key = 'primitives' then
      lesson_description := 'Primitives, conditions initiales, fonctions usuelles et méthodes de reconnaissance par composition.';
      lesson_content := $primitives$
## Primitives et calcul intégral

> **Thème : Fonctions numériques**  
> **Objectif :** déterminer des primitives, exploiter une condition initiale et reconnaître les formes utiles pour remonter d’une dérivée à une fonction.

## Situation d’apprentissage

La dérivée d’une consommation peut être connue sans que la consommation elle-même soit donnée. Les primitives permettent de retrouver cette fonction ; une information mesurée, comme une consommation à une vitesse donnée, détermine ensuite la constante manquante.

> **Définition : primitive**
> Une fonction \(F\) est une primitive de \(f\) sur un intervalle \(I\) si \(F\) est dérivable sur \(I\) et \(F'=f\) sur \(I\).

$$
F'(x)=f(x)
$$

## 1. Existence et famille de primitives

Toute fonction continue sur un intervalle admet au moins une primitive sur cet intervalle. Si \(F\) est une primitive de \(f\), toutes les primitives de \(f\) sont obtenues en ajoutant une constante réelle :

$$
\mathcal P_f=\{F+c\mid c\in\mathbb R\}
$$

La constante ne change pas la dérivée, car la dérivée d’un réel constant est nulle. Dire « une primitive » signifie donc qu’il existe plusieurs réponses possibles ; dire « la primitive vérifiant \(F(x_0)=y_0\) » désigne une seule fonction.

> **Méthode : condition initiale**
> Écrire d’abord \(F(x)=G(x)+c\). Remplacer ensuite \(x\) par \(x_0\), utiliser \(F(x_0)=y_0\), puis résoudre l’équation obtenue pour \(c\).

## 2. Primitives usuelles

| Fonction \(f\) | Une primitive \(F\) | Condition |
|---|---|---|
| \(a\) | \(ax+c\) | \(a\in\mathbb R\) |
| \(x^r\) | \(x^{r+1}/(r+1)+c\) | \(r\ne-1\) |
| \(1/x\) | \(\ln x+c\) | \(x>0\) |
| \(1/\sqrt{x}\) | \(2\sqrt{x}+c\) | \(x>0\) |
| \(\cos x\) | \(\sin x+c\) | sur \(\mathbb R\) |
| \(\sin x\) | \(-\cos x+c\) | sur \(\mathbb R\) |

> **Définition : intervalle de validité**
> C’est l’intervalle sur lequel les expressions employées sont définies et les règles appliquées sont justifiées. Une formule contenant \(1/x\) ne peut pas être utilisée à travers 0.

## 3. Linéarité et décomposition

Les primitives respectent l’addition et la multiplication par un réel. Si \(U'=u\) et \(V'=v\), alors \(U+V\) est une primitive de \(u+v\), et \(kU\) est une primitive de \(ku\).

$$
\int(8x^2+5x-9)\,dx=\frac83x^3+\frac52x^2-9x+c
$$

Avant de chercher une primitive complexe, il est souvent utile de développer ou de décomposer l’expression pour faire apparaître des fonctions usuelles.

## 4. Reconnaître une composition

La règle essentielle est la suivante : si \(u\) est dérivable, les expressions contenant \(u'\) et une fonction de \(u\) se traitent comme des fonctions usuelles.

$$
\int u'\,u^r\,dx=\frac{u^{r+1}}{r+1}+c\quad(r\ne-1)
$$

Pour intégrer \((2x+1)(x^2+x+6)^3\), on choisit \(u=x^2+x+6\), donc \(u'=2x+1\). La primitive est alors \((x^2+x+6)^4/4+c\). Le choix de \(u\) doit expliquer la présence de sa dérivée, éventuellement à une constante multiplicative près.

> **Méthode : repérer \(u'\)**
> 1. Identifier l’expression intérieure répétée. 2. Calculer sa dérivée. 3. Comparer avec le facteur présent. 4. Ajuster par une constante si nécessaire. 5. Appliquer la formule de la fonction usuelle.

## 5. Trigonométrie et racines

Les règles de composition s’appliquent aussi aux fonctions trigonométriques : une primitive de \(u'\cos u\) est \(\sin u+c\), et une primitive de \(u'\sin u\) est \(-\cos u+c\). Pour une racine, \(u\) doit rester positive sur l’intervalle étudié.

$$
\int \frac{u'}{\sqrt{u}}\,dx=2\sqrt{u}+c\qquad(u>0)
$$

Cette condition n’est pas un détail : elle garantit que la racine existe et que l’expression est bien dérivable sur l’intervalle choisi.

## 6. Modéliser une situation concrète

Dans la situation du PDF, \(C'(v)=-300/v^2+1/3\). Une primitive est \(C(v)=300/v+v/3+k\). La donnée \(C(60)=25\) donne \(k=0\). Le modèle de coût obtenu s’étudie ensuite par la dérivée pour trouver une vitesse minimisant le coût total. Les primitives permettent ici de passer d’une variation instantanée à une grandeur mesurable.

> **Attention :** une constante d’intégration est obligatoire tant qu’aucune condition initiale ne l’a déterminée. L’oublier revient à imposer sans justification une valeur particulière à la fonction recherchée.

> **Synthèse**
> Les primitives remontent de \(f'\) vers \(f\). La continuité assure l’existence, la constante décrit toutes les solutions, et une condition initiale fixe une solution unique. Les fonctions usuelles et la reconnaissance de \(u'\) rendent les calculs plus rapides et plus sûrs.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Primitives »**, Mathématiques, Terminale C, Côte d’Ivoire – École numérique.
$primitives$;
      exercise_one_title := 'Exercice 1 — Primitives usuelles et condition initiale';
      exercise_two_title := 'Exercice 2 — Primitives par composition';
      quiz_title := 'Quiz de révision — Primitives et calcul intégral';
    else
      raise exception 'Leçon Terminale C non reconnue : %', target.lesson_id;
    end if;

    update public.lessons set description = lesson_description, content = lesson_content, is_active = false
    where id = target.lesson_id and coalesce(btrim(content), '') = '';

    exercise_one_id := null; exercise_two_id := null; quiz_id := null;
    insert into public.exercises (subject_id, level_id, series_id, chapter_id, lesson_id, title, statement, solution, exercise_type, difficulty, content_markdown, correction_markdown, is_published, is_active, estimated_duration_minutes, display_order)
    select target.subject_id, target.level_id, target.series_id, target.chapter_id, target.lesson_id, exercise_one_title,
      'Mobilisez les définitions et les formules centrales de la leçon.', 'La correction explicite la méthode à appliquer et la justification attendue.', 'single_choice', 'easy',
      '## Consigne\n\nRépondez aux questions en indiquant la propriété ou la formule utilisée.', '## Correction\n\nReprenez la définition, la condition de validité puis le calcul étape par étape.', false, false, 15, 10
    where not exists (select 1 from public.exercises e where e.lesson_id = target.lesson_id and e.title = exercise_one_title)
    returning id into exercise_one_id;
    if exercise_one_id is not null then
      if target.lesson_key = 'derivability' then
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order) values
          (exercise_one_id,'single_choice','Que représente \(f''(a)\) sur le graphique de \(f\) ?',jsonb_build_array('La pente de la tangente en a','La valeur maximale de f','Le domaine de f','Une asymptote'),jsonb_build_array('La pente de la tangente en a'),'Le nombre dérivé est le coefficient directeur de la tangente.',10),
          (exercise_one_id,'single_choice','Quelle condition garantit la dérivabilité en \(a\) ?',jsonb_build_array('Les dérivées gauche et droite sont finies et égales','La fonction est toujours positive','La tangente est horizontale','f(a)=0'),jsonb_build_array('Les dérivées gauche et droite sont finies et égales'),'Les deux approches doivent donner le même nombre dérivé.',20),
          (exercise_one_id,'single_choice','Quelle est la dérivée de \((2x+1)^3\) ?',jsonb_build_array('6(2x+1)^2','3(2x+1)^2','(2x+1)^2','6x^2+1'),jsonb_build_array('6(2x+1)^2'),'On applique la dérivée d’une puissance puis la dérivée intérieure 2.',30),
          (exercise_one_id,'single_choice','Si \(f''>0\) sur un intervalle, f y est…',jsonb_build_array('croissante','décroissante','constante','non définie'),jsonb_build_array('croissante'),'Le signe positif de la dérivée indique la croissance.',40),
          (exercise_one_id,'true_false','Un zéro de f′ est toujours un maximum.',jsonb_build_array('Vrai','Faux'),jsonb_build_array('Faux'),'Il faut vérifier un changement de signe de la dérivée.',50);
      else
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order) values
          (exercise_one_id,'single_choice','Si \(F\) est une primitive de \(f\), quelle relation est vraie ?',jsonb_build_array('F′=f','F=f′','F′=0','f=0'),jsonb_build_array('F′=f'),'C’est la définition d’une primitive.',10),
          (exercise_one_id,'single_choice','Toutes les primitives d’une même fonction continue diffèrent de…',jsonb_build_array('une constante','leur dérivée','leur domaine','une asymptote'),jsonb_build_array('une constante'),'Ajouter une constante ne modifie pas la dérivée.',20),
          (exercise_one_id,'single_choice','Une primitive de \(2x+5\) est…',jsonb_build_array('x²+5x+c','2x²+5+c','x²+5+c','2x+5+c'),jsonb_build_array('x²+5x+c'),'La dérivée de x²+5x+c est bien 2x+5.',30),
          (exercise_one_id,'single_choice','Quelle condition doit être vérifiée pour utiliser \(\ln x\) ?',jsonb_build_array('x>0','x≥0','x≠0 seulement','x<0'),jsonb_build_array('x>0'),'La fonction ln est définie pour les réels strictement positifs.',40),
          (exercise_one_id,'true_false','Une condition initiale peut déterminer la constante c.',jsonb_build_array('Vrai','Faux'),jsonb_build_array('Vrai'),'On remplace x par la valeur donnée pour résoudre c.',50);
      end if;
    end if;

    insert into public.exercises (subject_id, level_id, series_id, chapter_id, lesson_id, title, statement, solution, exercise_type, difficulty, content_markdown, correction_markdown, is_published, is_active, estimated_duration_minutes, display_order)
    select target.subject_id, target.level_id, target.series_id, target.chapter_id, target.lesson_id, exercise_two_title,
      'Appliquez une méthode complète dans une situation de niveau approfondissement.', 'La correction met en évidence le choix de la formule, les conditions et l’interprétation.', 'single_choice', 'medium',
      '## Consigne\n\nJustifiez la stratégie avant de calculer.', '## Correction\n\nIdentifier la forme de l’expression puis utiliser la méthode correspondante, sans omettre les conditions.', false, false, 18, 20
    where not exists (select 1 from public.exercises e where e.lesson_id = target.lesson_id and e.title = exercise_two_title)
    returning id into exercise_two_id;
    if exercise_two_id is not null then
      if target.lesson_key = 'derivability' then
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order) values
          (exercise_two_id,'single_choice','Quelle formule encadre \(f(b)-f(a)\) si \(m≤f′≤M\) ?',jsonb_build_array('m(b-a)≤f(b)-f(a)≤M(b-a)','f(b)-f(a)=0','f′(a)=f′(b)','f(b)=M'),jsonb_build_array('m(b-a)≤f(b)-f(a)≤M(b-a)'),'C’est l’inégalité des accroissements finis.',10),
          (exercise_two_id,'single_choice','Dans une étude de fonction, après le domaine, quelle étape est essentielle ?',jsonb_build_array('Les limites aux bornes','Le dessin au hasard','La moyenne des valeurs','La suppression de la dérivée'),jsonb_build_array('Les limites aux bornes'),'Les limites renseignent sur le comportement et les asymptotes.',20),
          (exercise_two_id,'single_choice','Un passage de f′ positif à négatif indique…',jsonb_build_array('un maximum local','un minimum local','une asymptote','une racine certaine de f'),jsonb_build_array('un maximum local'),'La fonction croît puis décroît.',30),
          (exercise_two_id,'single_choice','Quelle relation donne la dérivée d’une réciproque ?',jsonb_build_array('(f⁻¹)′(y₀)=1/f′(x₀)','(f⁻¹)′=f′','(f⁻¹)′=0','(f⁻¹)′=f'),jsonb_build_array('(f⁻¹)′(y₀)=1/f′(x₀)'),'Elle exige f(x₀)=y₀ et f′(x₀) non nul.',40),
          (exercise_two_id,'true_false','La dérivée est utile pour rechercher une valeur optimale dans un modèle.',jsonb_build_array('Vrai','Faux'),jsonb_build_array('Vrai'),'Le signe de la dérivée organise les variations et les extrema.',50);
      else
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order) values
          (exercise_two_id,'single_choice','Quelle primitive reconnaît-on pour \(u''u^r\) ?',jsonb_build_array('u^(r+1)/(r+1)+c','u^r+c','ln(u)+c toujours','u′+c'),jsonb_build_array('u^(r+1)/(r+1)+c'),'Cette formule est valable lorsque r est différent de -1.',10),
          (exercise_two_id,'single_choice','Pour \((2x+1)(x²+x+6)^3\), quel choix de u est adapté ?',jsonb_build_array('x²+x+6','2x+1','x³','6'),jsonb_build_array('x²+x+6'),'Sa dérivée est exactement 2x+1.',20),
          (exercise_two_id,'single_choice','Une primitive de \(u''cos(u)\) est…',jsonb_build_array('sin(u)+c','cos(u)+c','-sin(u)+c','u cos(u)+c'),jsonb_build_array('sin(u)+c'),'La dérivée de sin(u) est u′cos(u).',30),
          (exercise_two_id,'single_choice','Pourquoi conserver la constante c ?',jsonb_build_array('Parce que plusieurs primitives ont la même dérivée','Parce que la dérivée de c vaut 1','Parce que c est toujours nul','Parce que f est discontinue'),jsonb_build_array('Parce que plusieurs primitives ont la même dérivée'),'La dérivée d’une constante est nulle.',40),
          (exercise_two_id,'true_false','Une primitive de 1/x est ln(x)+c sur ]0;+∞[.',jsonb_build_array('Vrai','Faux'),jsonb_build_array('Vrai'),'Sur les réels positifs, la dérivée de ln(x) est 1/x.',50);
      end if;
    end if;

    insert into public.quizzes (subject_id, level_id, series_id, subject_offering_id, chapter_id, lesson_id, title, description, difficulty, duration_minutes, display_order, is_published, is_active)
    select target.subject_id, target.level_id, target.series_id, target.offering_id, target.chapter_id, target.lesson_id, quiz_title,
      'Quiz de révision fondé sur le cours et ses méthodes.', 'medium', 12, 10, false, false
    where not exists (select 1 from public.quizzes q where q.lesson_id = target.lesson_id and q.title = quiz_title)
    returning id into quiz_id;
    if quiz_id is not null then
      if target.lesson_key = 'derivability' then
        with new_questions as (
          insert into public.quiz_questions (quiz_id, question, explanation, question_type, display_order, points, is_active) values
            (quiz_id,'Que mesure le nombre dérivé ?', 'Il mesure la pente de la tangente à la courbe.', 'single_choice',10,1,true),
            (quiz_id,'Quand une fonction est-elle dérivable en un point ?', 'Lorsque les dérivées à gauche et à droite, finies, sont égales.', 'single_choice',20,1,true),
            (quiz_id,'Que signifie f′>0 ?', 'La fonction est croissante.', 'single_choice',30,1,true),
            (quiz_id,'Quelle est la formule d’une tangente ?', 'y=f′(a)(x-a)+f(a).', 'single_choice',40,1,true),
            (quiz_id,'Quel outil contrôle une variation globale par la dérivée ?', 'L’inégalité des accroissements finis.', 'single_choice',50,1,true),
            (quiz_id,'Quel changement de signe signale un minimum local ?', 'De négatif à positif.', 'single_choice',60,1,true)
          returning id, display_order)
        insert into public.quiz_answers (question_id, answer, is_correct, display_order)
        select q.id,a.answer,a.correct_answer,a.answer_order from new_questions q join lateral (values
          (10,'La pente de la tangente',true,10),(10,'Le domaine entier',false,20),(10,'Une asymptote',false,30),
          (20,'Les deux dérivées latérales égales',true,10),(20,'f(a)=0',false,20),(20,'Une limite infinie',false,30),
          (30,'La fonction croît',true,10),(30,'La fonction décroît',false,20),(30,'La fonction est nulle',false,30),
          (40,'y=f′(a)(x-a)+f(a)',true,10),(40,'y=f(a)x',false,20),(40,'y=ax',false,30),
          (50,'L’inégalité des accroissements finis',true,10),(50,'La variance',false,20),(50,'Le logarithme',false,30),
          (60,'Négatif à positif',true,10),(60,'Positif à négatif',false,20),(60,'Toujours positif',false,30)
        ) a(question_order,answer,correct_answer,answer_order) on a.question_order=q.display_order;
      else
        with new_questions as (
          insert into public.quiz_questions (quiz_id, question, explanation, question_type, display_order, points, is_active) values
            (quiz_id,'Que vérifie une primitive F de f ?', 'Elle vérifie F′=f.', 'single_choice',10,1,true),
            (quiz_id,'Comment sont liées deux primitives ?', 'Elles diffèrent d’une constante.', 'single_choice',20,1,true),
            (quiz_id,'Quelle condition fixe une primitive unique ?', 'Une valeur initiale.', 'single_choice',30,1,true),
            (quiz_id,'Quelle forme reconnaît une primitive logarithmique ?', 'u′/u avec u positif.', 'single_choice',40,1,true),
            (quiz_id,'Quelle primitive correspond à u′cos u ?', 'sin u+c.', 'single_choice',50,1,true),
            (quiz_id,'Pourquoi vérifier l’intervalle ?', 'Pour garantir domaine et conditions des formules.', 'single_choice',60,1,true)
          returning id, display_order)
        insert into public.quiz_answers (question_id, answer, is_correct, display_order)
        select q.id,a.answer,a.correct_answer,a.answer_order from new_questions q join lateral (values
          (10,'F′=f',true,10),(10,'F=f′',false,20),(10,'F=0',false,30),
          (20,'Elles diffèrent d’une constante',true,10),(20,'Elles sont identiques',false,20),(20,'Elles ont des domaines opposés',false,30),
          (30,'Une valeur initiale',true,10),(30,'Un tableau de signes',false,20),(30,'Une asymptote',false,30),
          (40,'u′/u avec u positif',true,10),(40,'u+u′',false,20),(40,'u²',false,30),
          (50,'sin u+c',true,10),(50,'cos u+c',false,20),(50,'-sin u+c',false,30),
          (60,'Garantir domaine et conditions',true,10),(60,'Changer la constante',false,20),(60,'Supprimer la dérivée',false,30)
        ) a(question_order,answer,correct_answer,answer_order) on a.question_order=q.display_order;
      end if;
    end if;
  end loop;
end $math_terminal_c$;
