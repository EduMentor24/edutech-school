-- Mathématiques Terminale A1/A2 : fonction exponentielle et suites numériques.
-- Brouillons uniquement : toute leçon déjà renseignée bloque la transaction.

do $math$
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
        when l.id in ('2261f542-9481-4d49-9a72-54b71fdb9929'::uuid, 'f1ebf95d-9b61-40dc-b3a5-7a9699cac3be'::uuid) then 'exponential'
        when l.id in ('221c3f88-b3cd-4287-9647-78f82e5928af'::uuid, 'ac91de56-a15f-43ff-8baf-a2f4dcbe82b1'::uuid) then 'sequences'
      end as lesson_key
    from public.lessons l
    join public.chapters c on c.id = l.chapter_id
    join public.course_subject_offerings o on o.id = c.subject_offering_id
    join public.subjects subject on subject.id = o.subject_id
    join public.levels level on level.id = o.level_id
    join public.series series on series.id = o.series_id
    where l.id in (
      '2261f542-9481-4d49-9a72-54b71fdb9929', 'f1ebf95d-9b61-40dc-b3a5-7a9699cac3be',
      '221c3f88-b3cd-4287-9647-78f82e5928af', 'ac91de56-a15f-43ff-8baf-a2f4dcbe82b1'
    ) and subject.name = 'Mathématiques' and level.name = 'Terminale' and series.name in ('A1', 'A2')
    order by series.name, l.id
  loop
    if exists (select 1 from public.lessons where id = target.lesson_id and coalesce(btrim(content), '') <> '') then
      raise exception 'La leçon % contient déjà du contenu : aucun écrasement automatique n’est autorisé.', target.lesson_id;
    end if;

    if target.lesson_key = 'exponential' then
      lesson_description := 'Définition, propriétés, limites, variations, équations, inéquations, dérivées et applications de la fonction exponentielle népérienne.';
      lesson_content := $exponential$
## Fonction exponentielle népérienne

> **Thème : Fonctions numériques**  
> **Objectif :** comprendre la fonction exponentielle, utiliser ses propriétés pour calculer et résoudre, puis l’exploiter dans une situation concrète.

## Situation d’apprentissage

La proportion de personnes informées par une campagne publicitaire peut être modélisée par une expression telle que `P(t)=1-e^(-0,21t)`. Pour savoir à quel moment la campagne atteint un objectif, il faut isoler une puissance de `e` puis utiliser le logarithme népérien. Cette situation montre que l’exponentielle décrit naturellement des phénomènes d’évolution rapide ou de croissance proportionnelle.

> **Définition : fonction exponentielle**
> La fonction exponentielle népérienne, notée `exp` ou `x ↦ e^x`, est la fonction réciproque du logarithme népérien. Dire que `ln(a)=b`, avec `a>0`, équivaut à écrire `a=e^b`.

$$
exp(x)=e^x \qquad ln(e^x)=x \qquad e^{ln(a)}=a\;(a>0)
$$

## 1. Identifier et interpréter `e^x`

La fonction `x ↦ e^x` est définie sur tout `ℝ`. Sa valeur est toujours strictement positive : une exponentielle ne peut donc jamais être nulle ni négative. Les nombres repères sont `e^0=1` et `e^1=e`.

| Mot nouveau | Sens utile |
|---|---|
| **Fonction réciproque** | Fonction qui annule l’effet d’une autre ; `ln` et `exp` se compensent sur leurs domaines. |
| **Exponentielle** | Fonction qui associe à `x` le nombre positif `e^x`. |
| **Positivité** | Propriété selon laquelle une expression est toujours supérieure à 0. |

> **Attention :** `e^x` n’est pas le produit `e×x`. Le nombre `x` est un exposant ; il indique la puissance de `e`.

## 2. Propriétés algébriques

Pour tous réels `a` et `b`, les règles de puissance donnent :

$$
e^a×e^b=e^{a+b} \qquad e^a/e^b=e^{a-b} \qquad (e^a)^r=e^{ar} \qquad 1/e^a=e^{-a}
$$

Ces propriétés permettent de transformer une expression avant tout calcul. Par exemple, `e^(6)×e^(-4)=e^2`. Il est indispensable de ne combiner les exposants que lorsqu’il s’agit d’un produit, d’un quotient ou d’une puissance ; en général, `e^a+e^b` ne se simplifie pas en une seule exponentielle.

> **Méthode : simplifier une expression exponentielle**
> 1. Repérer les produits, quotients ou puissances. 2. Utiliser la propriété adaptée. 3. Réduire l’exposant. 4. Ne pas transformer une somme sans facteur commun.

## 3. Limites, courbe et variations

La fonction exponentielle possède deux limites de référence :

$$
lim_{x→+∞}e^x=+∞ \qquad lim_{x→-∞}e^x=0
$$

La droite `y=0` est donc une **asymptote horizontale** de la courbe lorsque `x` tend vers `-∞`. La courbe ne touche pas cet axe, car `e^x>0` pour tout réel `x`.

La dérivée de l’exponentielle est elle-même :

$$
(e^x)'=e^x>0
$$

La dérivée étant positive sur `ℝ`, la fonction exponentielle est strictement croissante. Une fonction de la forme `f(x)=2x+e^x` a pour dérivée `2+e^x`, elle aussi positive : `f` est donc croissante.

> **Repère :** une limite vers 0 à `-∞` ne signifie pas que la fonction prend la valeur 0. Elle s’en approche indéfiniment sans l’atteindre.

## 4. Équations et inéquations

La fonction exponentielle étant strictement croissante, elle conserve l’égalité et l’ordre :

$$
e^a=e^b \Leftrightarrow a=b \qquad e^a<e^b \Leftrightarrow a<b
$$

Pour résoudre `e^(2x-1)=e^(x+5)`, on égalise les exposants : `2x-1=x+5`, donc `x=6`. Pour résoudre `e^(x-2)=5`, écrire `5=e^(ln 5)`, puis `x-2=ln 5`.

Lorsqu’une expression contient plusieurs puissances de `e^x`, poser `X=e^x` est utile. Il faut toutefois conserver la condition fondamentale `X>0`. Dans `e^(2x)+e^x-6=0`, l’équation devient `X²+X-6=0`. La racine négative est refusée, car elle ne peut pas être égale à `e^x`.

> **Méthode : changement de variable**
> Poser `X=e^x`, rappeler `X>0`, résoudre l’équation en `X`, éliminer toute solution non positive, puis revenir à `x` avec `e^x=c ⇔ x=ln(c)`.

## 5. Dérivée composée et primitive

Si `u` est dérivable, alors `e^{u(x)}` est dérivable et :

$$
(e^u)'=u'e^u
$$

Ainsi, la dérivée de `e^(-4x+3)` est `-4e^(-4x+3)`. Pour les primitives, la reconnaissance de la forme `u'e^u` est décisive : une primitive est `e^u+k`.

$$
\int u'(x)e^{u(x)}\,dx=e^{u(x)}+k
$$

Le PDF précise cette partie de primitive pour Terminale A1. Elle est proposée ici comme approfondissement méthodologique, sans modifier les exigences propres à chaque série.

## 6. Résoudre la situation de publicité

On cherche `t` tel que `1-e^(-0,21t)=0,90`. Après isolement, `e^(-0,21t)=0,1`. Comme `0,1=e^(ln 0,1)`, on obtient `-0,21t=ln(0,1)`, soit `t≈10,96`. Le nombre de jours devant être entier, il faut prévoir **11 jours**.

## Synthèse

- `e^x` est définie et positive sur `ℝ` ; `ln` est sa fonction réciproque.
- Les produits, quotients et puissances permettent de combiner les exposants.
- L’exponentielle est strictement croissante et sa dérivée vaut elle-même.
- Les équations se traitent par égalité des exposants ou par le logarithme.
- Dans un changement de variable `X=e^x`, la condition `X>0` est obligatoire.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Leçon 4 : Fonction exponentielle »**, Mathématiques, Terminale A, Côte d’Ivoire – École numérique.
$exponential$;
      exercise_one_title := 'Exercice 1 — Calculs et propriétés de l’exponentielle';
      exercise_two_title := 'Exercice 2 — Équations, variations et modèle exponentiel';
      quiz_title := 'Quiz de révision — Fonction exponentielle népérienne';
    else
      lesson_description := 'Suites arithmétiques et géométriques : récurrence, terme général, sens de variation, sommes et applications financières.';
      lesson_content := $sequences$
## Suites numériques

> **Thème : Fonctions numériques**  
> **Objectif :** reconnaître une suite arithmétique ou géométrique, calculer ses termes et ses sommes, puis interpréter une évolution financière.

## Situation d’apprentissage

Un capital de `300 000` francs peut augmenter chaque mois d’un montant fixe ou d’un pourcentage constant. Le premier cas se modélise par une suite arithmétique ; le second par une suite géométrique. Les suites permettent donc de décrire rigoureusement des évolutions par étapes.

> **Définition : suite numérique**
> Une suite numérique est une liste ordonnée de nombres. Son terme de rang `n` se note `u_n`. Une **relation de récurrence** calcule un terme à partir du précédent ; une **formule explicite** calcule directement `u_n` en fonction de `n`.

## 1. Suites arithmétiques

Une suite est arithmétique lorsque l’on ajoute toujours la même constante `r`, appelée **raison** :

$$
u_{n+1}=u_n+r
$$

Le terme général dépend du premier rang connu. Si `u_0` est connu :

$$
u_n=u_0+nr
$$

Plus généralement, `u_n=u_p+(n-p)r`. La raison se lit aussi comme une différence : `u_{n+1}-u_n=r`.

| Signe de `r` | Variation de la suite arithmétique |
|---|---|
| `r>0` | croissante |
| `r=0` | constante |
| `r<0` | décroissante |

> **Exemple :** si `u_1=1 350` et `r=200`, alors `u_21=1 350+(21-1)×200=5 350`. Le passage du rang 1 au rang 21 compte exactement 20 écarts.

## 2. Sommes arithmétiques

La somme de termes consécutifs est le produit du nombre de termes par la moyenne du premier et du dernier terme :

$$
u_p+u_{p+1}+...+u_n=(n-p+1)×(u_p+u_n)/2
$$

> **Attention :** le nombre de termes entre les rangs `p` et `n` est `n-p+1`, et non `n-p`. Les deux bornes sont comptées.

## 3. Suites géométriques

Une suite est géométrique lorsque l’on multiplie toujours par le même réel `q`, appelé raison :

$$
v_{n+1}=qv_n
$$

Si `v_0` est connu, le terme général est :

$$
v_n=v_0q^n
$$

Plus généralement, `v_n=v_pq^(n-p)`. Si les termes ne sont pas tous nuls, le quotient `v_{n+1}/v_n` permet de retrouver la raison `q`.

| Condition, avec termes positifs | Variation |
|---|---|
| `q>1` | croissante |
| `0<q<1` | décroissante |
| `q=1` | constante |

Une raison négative produit une alternance de signes : il ne faut pas conclure trop vite qu’une telle suite est croissante ou décroissante.

## 4. Sommes géométriques

Lorsque `q≠1`, la somme de termes consécutifs est :

$$
v_p+v_{p+1}+...+v_n=v_p×(1-q^{n-p+1})/(1-q)
$$

La formule est inutilisable pour `q=1` ; dans ce cas, tous les termes ont la même valeur et il suffit de multiplier ce terme par leur nombre.

> **Méthode : choisir le bon modèle**
> Une augmentation ou baisse d’un montant fixe correspond à une suite arithmétique. Une évolution d’un pourcentage fixe correspond à une suite géométrique, car chaque terme est obtenu en multipliant par `1+t` ou par `1-t`.

## 5. Applications financières

Avec des intérêts simples, ajouter `2 500` francs par mois donne une suite arithmétique. Avec une hausse de `5 %` chaque mois, multiplier par `1,05` donne une suite géométrique.

Pour un capital initial `C_0` placé à un taux composé `t`, le capital après `n` périodes est :

$$
C_n=C_0(1+t)^n
$$

Dans tout problème concret, préciser l’unité de temps, le capital initial, le rang du premier terme et la signification de la raison. La conclusion doit comparer les valeurs dans la même unité monétaire et au même rang.

## 6. Comparer deux évolutions

Une hausse fixe peut sembler plus grande au début, tandis qu’une hausse proportionnelle peut devenir plus avantageuse sur une longue durée. Construire quelques termes et écrire les formules explicites permet de comparer les deux modèles sans se limiter à une impression graphique.

## Synthèse

- Suite arithmétique : ajout constant, `u_{n+1}=u_n+r`.
- Suite géométrique : multiplication constante, `v_{n+1}=qv_n`.
- Les termes généraux permettent de calculer directement un rang éloigné.
- Les formules de somme exigent le bon nombre de termes et, pour les géométriques, `q≠1`.
- Les évolutions par pourcentage sont géométriques ; les évolutions par montant fixe sont arithmétiques.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Leçon 5 : Suites numériques »**, Mathématiques, Terminale A, Côte d’Ivoire – École numérique.
$sequences$;
      exercise_one_title := 'Exercice 1 — Reconnaître et calculer une suite';
      exercise_two_title := 'Exercice 2 — Sommes et applications financières';
      quiz_title := 'Quiz de révision — Suites numériques';
    end if;

    update public.lessons set description = lesson_description, content = lesson_content, is_active = false
    where id = target.lesson_id and coalesce(btrim(content), '') = '';

    insert into public.exercises (subject_id, level_id, series_id, chapter_id, lesson_id, title, statement, solution, exercise_type, difficulty, content_markdown, correction_markdown, is_published, is_active, estimated_duration_minutes, display_order)
    select target.subject_id, target.level_id, target.series_id, target.chapter_id, target.lesson_id,
      exercise_one_title, 'Appliquez les définitions et méthodes essentielles du cours.', 'La correction explique le choix de la propriété et les conditions à vérifier.', 'single_choice', 'easy', '## Consigne\n\nRépondez étape par étape en citant la propriété employée.', '## Correction\n\nRelisez les conditions de validité puis appliquez une formule à la fois.', false, false, 15, 10
    where not exists (select 1 from public.exercises e where e.lesson_id = target.lesson_id and e.title = exercise_one_title)
    returning id into exercise_one_id;

    if exercise_one_id is not null then
      if target.lesson_key = 'exponential' then
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order) values
          (exercise_one_id, 'single_choice', 'Quelle est la valeur de `e^0` ?', jsonb_build_array('1','0','e','Non définie'), jsonb_build_array('1'), 'Toute puissance non nulle élevée à l’exposant 0 vaut 1.', 10),
          (exercise_one_id, 'single_choice', 'Simplifiez `e^3 × e^(-5)`.', jsonb_build_array('e^(-2)','e^8','-2e','e^15'), jsonb_build_array('e^(-2)'), 'Dans un produit, les exposants s’additionnent : 3+(-5)=-2.', 20),
          (exercise_one_id, 'single_choice', 'Quel est le signe de `e^x` ?', jsonb_build_array('Toujours strictement positif','Toujours négatif','Toujours nul','Variable selon x'), jsonb_build_array('Toujours strictement positif'), 'Une exponentielle népérienne est positive pour tout réel.', 30),
          (exercise_one_id, 'single_choice', 'Quelle est la limite de `e^x` quand x tend vers -∞ ?', jsonb_build_array('0','+∞','-∞','1'), jsonb_build_array('0'), 'La courbe se rapproche de l’axe des abscisses à gauche.', 40),
          (exercise_one_id, 'true_false', 'La relation `e^a+e^b=e^(a+b)` est vraie pour tous réels.', jsonb_build_array('Vrai','Faux'), jsonb_build_array('Faux'), 'La propriété des exposants concerne le produit, non l’addition.', 50);
      else
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order) values
          (exercise_one_id, 'single_choice', 'Quelle relation définit une suite arithmétique de raison r ?', jsonb_build_array('u_(n+1)=u_n+r','u_(n+1)=r×u_n','u_n=r^n','u_n=u_(n-1)/r'), jsonb_build_array('u_(n+1)=u_n+r'), 'Une suite arithmétique ajoute la même raison à chaque rang.', 10),
          (exercise_one_id, 'single_choice', 'Quelle relation définit une suite géométrique de raison q ?', jsonb_build_array('v_(n+1)=qv_n','v_(n+1)=v_n+q','v_n=nq','v_n=v_0+nq'), jsonb_build_array('v_(n+1)=qv_n'), 'Une suite géométrique multiplie chaque terme par q.', 20),
          (exercise_one_id, 'single_choice', 'Si une suite arithmétique a une raison positive, elle est…', jsonb_build_array('croissante','décroissante','toujours constante','non définie'), jsonb_build_array('croissante'), 'Chaque terme est alors supérieur au précédent.', 30),
          (exercise_one_id, 'single_choice', 'Pour `v_0=2` et `q=3`, quelle est la valeur de `v_2` ?', jsonb_build_array('18','6','8','5'), jsonb_build_array('18'), 'v_2=2×3²=18.', 40),
          (exercise_one_id, 'true_false', 'Une raison géométrique négative garantit une suite croissante.', jsonb_build_array('Vrai','Faux'), jsonb_build_array('Faux'), 'Les signes alternent généralement, ce qui empêche cette conclusion.', 50);
      end if;
    end if;

    insert into public.exercises (subject_id, level_id, series_id, chapter_id, lesson_id, title, statement, solution, exercise_type, difficulty, content_markdown, correction_markdown, is_published, is_active, estimated_duration_minutes, display_order)
    select target.subject_id, target.level_id, target.series_id, target.chapter_id, target.lesson_id,
      exercise_two_title, 'Mobilisez les formules pour résoudre et interpréter une situation.', 'La correction rappelle les conditions, l’écriture de la formule et l’interprétation finale.', 'single_choice', 'medium', '## Consigne\n\nJustifiez chaque étape et contrôlez la cohérence du résultat.', '## Correction\n\nIsoler l’expression utile, utiliser la propriété adaptée, puis vérifier le domaine ou les conditions de la formule.', false, false, 18, 20
    where not exists (select 1 from public.exercises e where e.lesson_id = target.lesson_id and e.title = exercise_two_title)
    returning id into exercise_two_id;

    if exercise_two_id is not null then
      if target.lesson_key = 'exponential' then
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order) values
          (exercise_two_id, 'single_choice', 'Résolvez `e^(2x)=e^6`.', jsonb_build_array('x=3','x=6','x=12','Aucune solution'), jsonb_build_array('x=3'), 'On égalise les exposants : 2x=6.', 10),
          (exercise_two_id, 'single_choice', 'Quelle substitution convient à `e^(2x)+e^x-6=0` ?', jsonb_build_array('X=e^x','X=ln x','X=x²','X=1/x'), jsonb_build_array('X=e^x'), 'Les deux puissances deviennent X² et X.', 20),
          (exercise_two_id, 'single_choice', 'Quelle contrainte porte sur `X=e^x` ?', jsonb_build_array('X>0','X<0','X=0','X est entier'), jsonb_build_array('X>0'), 'Une exponentielle est strictement positive.', 30),
          (exercise_two_id, 'single_choice', 'Quelle est la dérivée de `e^(5x+2)` ?', jsonb_build_array('5e^(5x+2)','e^(5x+2)','(5x+2)e^(5x+2)','5x+2'), jsonb_build_array('5e^(5x+2)'), 'La dérivée est u’e^u avec u’=5.', 40),
          (exercise_two_id, 'true_false', 'Une primitive de `u’e^u` est `e^u+k`.', jsonb_build_array('Vrai','Faux'), jsonb_build_array('Vrai'), 'La dérivée de e^u est u’e^u.', 50);
      else
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order) values
          (exercise_two_id, 'single_choice', 'Combien de termes contient la somme de `u_3` à `u_10` ?', jsonb_build_array('8','7','10','13'), jsonb_build_array('8'), '10-3+1=8 : les deux bornes sont incluses.', 10),
          (exercise_two_id, 'single_choice', 'Quelle formule donne `u_n` pour une suite arithmétique de premier terme `u_0` ?', jsonb_build_array('u_n=u_0+nr','u_n=u_0r^n','u_n=u_0/r^n','u_n=n/u_0'), jsonb_build_array('u_n=u_0+nr'), 'On ajoute la raison r, n fois, au premier terme.', 20),
          (exercise_two_id, 'single_choice', 'Quelle formule donne `v_n` pour une suite géométrique de premier terme `v_0` ?', jsonb_build_array('v_n=v_0q^n','v_n=v_0+nq','v_n=v_0+q^n','v_n=n(v_0+q)'), jsonb_build_array('v_n=v_0q^n'), 'On multiplie successivement par q.', 30),
          (exercise_two_id, 'single_choice', 'Quelle condition est nécessaire dans la formule de somme géométrique par quotient ?', jsonb_build_array('q≠1','q>0','q<0','n=0'), jsonb_build_array('q≠1'), 'La formule comporte un dénominateur 1-q.', 40),
          (exercise_two_id, 'true_false', 'Une hausse de 5 % par période se modélise par une raison 1,05.', jsonb_build_array('Vrai','Faux'), jsonb_build_array('Vrai'), 'Augmenter de 5 % revient à multiplier par 1+0,05.', 50);
      end if;
    end if;

    insert into public.quizzes (subject_id, level_id, series_id, subject_offering_id, chapter_id, lesson_id, title, description, difficulty, duration_minutes, display_order, is_published, is_active)
    select target.subject_id, target.level_id, target.series_id, target.offering_id, target.chapter_id, target.lesson_id, quiz_title,
      'Évaluez votre maîtrise des notions et méthodes essentielles de la leçon.', 'medium', 12, 10, false, false
    where not exists (select 1 from public.quizzes q where q.lesson_id = target.lesson_id and q.title = quiz_title)
    returning id into quiz_id;

    if quiz_id is not null then
      if target.lesson_key = 'exponential' then
        with inserted_questions as (
          insert into public.quiz_questions (quiz_id, question, explanation, question_type, display_order, points, is_active) values
          (quiz_id, 'Quelle fonction est réciproque de l’exponentielle népérienne ?', 'Le logarithme népérien annule l’action de l’exponentielle sur les valeurs positives.', 'single_choice', 10, 1, true),
          (quiz_id, 'Quelle est la dérivée de e^x ?', 'La fonction exponentielle est sa propre dérivée.', 'single_choice', 20, 1, true),
          (quiz_id, 'Pourquoi la courbe de e^x ne coupe-t-elle pas l’axe des abscisses ?', 'e^x est strictement positif pour tout réel x.', 'single_choice', 30, 1, true),
          (quiz_id, 'Comment résoudre e^a=e^b ?', 'La stricte croissance de l’exponentielle donne a=b.', 'single_choice', 40, 1, true),
          (quiz_id, 'Quelle forme permet de reconnaître une primitive exponentielle composée ?', 'La forme u’e^u conduit à e^u+k.', 'single_choice', 50, 1, true),
          (quiz_id, 'Quel outil permet d’isoler x dans e^x=c, avec c>0 ?', 'Le logarithme népérien.', 'single_choice', 60, 1, true)
          returning id, display_order
        ) insert into public.quiz_answers (question_id, answer, is_correct, display_order)
        select q.id, a.answer, a.is_correct, a.display_order from inserted_questions q join lateral (select * from (values
          (10,'Le logarithme népérien',true,10),(10,'La racine carrée',false,20),(10,'La dérivée seconde',false,30),
          (20,'e^x',true,10),(20,'x e^(x-1)',false,20),(20,'1/x',false,30),
          (30,'Parce que e^x>0',true,10),(30,'Parce que e^x=0',false,20),(30,'Parce que x est toujours positif',false,30),
          (40,'a=b',true,10),(40,'a+b=0',false,20),(40,'a=b²',false,30),
          (50,'u’e^u',true,10),(50,'u/u’',false,20),(50,'u+e^u',false,30),
          (60,'ln',true,10),(60,'La moyenne',false,20),(60,'La variance',false,30)
        ) as a(question_order,answer,is_correct,display_order)) a on a.question_order=q.display_order;
      else
        with inserted_questions as (
          insert into public.quiz_questions (quiz_id, question, explanation, question_type, display_order, points, is_active) values
          (quiz_id, 'Quelle opération caractérise une suite arithmétique ?', 'On ajoute toujours la même raison.', 'single_choice', 10, 1, true),
          (quiz_id, 'Quelle opération caractérise une suite géométrique ?', 'On multiplie toujours par la même raison.', 'single_choice', 20, 1, true),
          (quiz_id, 'Quelle formule donne le terme général d’une suite arithmétique issue de u0 ?', 'u_n=u_0+nr.', 'single_choice', 30, 1, true),
          (quiz_id, 'Que signifie une raison géométrique comprise entre 0 et 1 pour des termes positifs ?', 'La suite est décroissante.', 'single_choice', 40, 1, true),
          (quiz_id, 'Pourquoi ajoute-t-on 1 dans n-p+1 ?', 'Les rangs p et n sont tous deux comptés.', 'single_choice', 50, 1, true),
          (quiz_id, 'Quel modèle correspond à une hausse de pourcentage fixe ?', 'Une suite géométrique.', 'single_choice', 60, 1, true)
          returning id, display_order
        ) insert into public.quiz_answers (question_id, answer, is_correct, display_order)
        select q.id, a.answer, a.is_correct, a.display_order from inserted_questions q join lateral (select * from (values
          (10,'Ajouter une constante',true,10),(10,'Multiplier par une constante',false,20),(10,'Prendre un logarithme',false,30),
          (20,'Multiplier par une constante',true,10),(20,'Ajouter une constante',false,20),(20,'Soustraire le rang',false,30),
          (30,'u_n=u_0+nr',true,10),(30,'u_n=u_0r^n',false,20),(30,'u_n=n/u_0',false,30),
          (40,'La suite est décroissante',true,10),(40,'La suite est croissante',false,20),(40,'La suite est nulle',false,30),
          (50,'Les deux bornes sont comptées',true,10),(50,'La raison est nulle',false,20),(50,'Le premier terme est nul',false,30),
          (60,'Une suite géométrique',true,10),(60,'Une suite arithmétique',false,20),(60,'Une constante',false,30)
        ) as a(question_order,answer,is_correct,display_order)) a on a.question_order=q.display_order;
      end if;
    end if;
  end loop;
end
$math$;
