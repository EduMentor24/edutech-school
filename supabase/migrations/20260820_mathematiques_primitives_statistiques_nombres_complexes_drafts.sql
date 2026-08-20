-- Brouillons exclusivement. Aucune ressource déjà renseignée n'est écrasée.
do $math$
declare
  target record;
  a2_chapter_id uuid;
  a2_primitive_id uuid;
  expected_count integer;
  exercise_one_id uuid;
  exercise_two_id uuid;
  quiz_id uuid;
  lesson_content text;
  lesson_description text;
  exercise_one_title text;
  exercise_two_title text;
  quiz_title text;
begin
  -- Le PDF Terminale A couvre les primitives ; la structure A2 absente est ajoutée après la dernière leçon A2.
  select c.id into a2_chapter_id
  from public.chapters c
  join public.course_subject_offerings o on o.id = c.subject_offering_id
  join public.subjects subject on subject.id = o.subject_id
  join public.levels level on level.id = o.level_id
  join public.series series on series.id = o.series_id
  where subject.name = 'Mathématiques' and level.name = 'Terminale' and series.name = 'A2'
  limit 1;

  if a2_chapter_id is null then
    raise exception 'La progression Mathématiques Terminale A2 est introuvable : aucune création automatique n’est possible.';
  end if;

  insert into public.lessons (chapter_id, title, description, content, display_order, is_test_data, is_active)
  select a2_chapter_id, '8. Primitives et calcul intégral',
    'Primitives, intégrales et calculs d’aires : définition, méthodes de reconnaissance et interprétation géométrique.',
    null,
    coalesce((select max(l.display_order) + 10 from public.lessons l where l.chapter_id = a2_chapter_id), 10),
    false, false
  where not exists (
    select 1 from public.lessons l
    where l.chapter_id = a2_chapter_id and l.title = '8. Primitives et calcul intégral'
  )
  returning id into a2_primitive_id;

  select id into a2_primitive_id
  from public.lessons
  where chapter_id = a2_chapter_id and title = '8. Primitives et calcul intégral'
  limit 1;

  select count(*) into expected_count
  from public.lessons l
  join public.chapters c on c.id = l.chapter_id
  join public.course_subject_offerings o on o.id = c.subject_offering_id
  join public.subjects subject on subject.id = o.subject_id
  join public.levels level on level.id = o.level_id
  join public.series series on series.id = o.series_id
  where subject.name = 'Mathématiques' and level.name = 'Terminale'
    and (
      (series.name = 'A1' and l.id in ('2444e45b-60dd-4101-a9ce-0a11c3aac3d5'::uuid, 'fa4221bc-9fa9-4912-b6b1-0c8ef3f33698'::uuid))
      or (series.name = 'A2' and l.id in ('80d19d0b-9e2a-46a5-a03c-4e417fa3e401'::uuid, a2_primitive_id))
      or (series.name = 'C' and l.id = 'c79206ee-b079-46cb-8863-9229cf2364f7'::uuid)
    );

  if expected_count <> 5 then
    raise exception 'Le périmètre attendu de cinq leçons Mathématiques n’est pas réuni ; transaction annulée.';
  end if;

  for target in
    select l.id as lesson_id, c.id as chapter_id, o.id as offering_id, o.subject_id, o.level_id, o.series_id,
      case
        when l.id in ('2444e45b-60dd-4101-a9ce-0a11c3aac3d5'::uuid, a2_primitive_id) then 'primitives'
        when l.id = 'fa4221bc-9fa9-4912-b6b1-0c8ef3f33698'::uuid then 'statistics_a1'
        when l.id = '80d19d0b-9e2a-46a5-a03c-4e417fa3e401'::uuid then 'statistics_a2'
        when l.id = 'c79206ee-b079-46cb-8863-9229cf2364f7'::uuid then 'complexes'
      end as lesson_key
    from public.lessons l
    join public.chapters c on c.id = l.chapter_id
    join public.course_subject_offerings o on o.id = c.subject_offering_id
    where l.id in ('2444e45b-60dd-4101-a9ce-0a11c3aac3d5'::uuid, 'fa4221bc-9fa9-4912-b6b1-0c8ef3f33698'::uuid, '80d19d0b-9e2a-46a5-a03c-4e417fa3e401'::uuid, 'c79206ee-b079-46cb-8863-9229cf2364f7'::uuid, a2_primitive_id)
    order by l.id
  loop
    if exists (select 1 from public.lessons where id = target.lesson_id and coalesce(btrim(content), '') <> '') then
      raise exception 'La leçon % contient déjà un cours : aucun écrasement automatique n’est autorisé.', target.lesson_id;
    end if;

    exercise_one_id := null;
    exercise_two_id := null;
    quiz_id := null;

    if target.lesson_key = 'primitives' then
      lesson_description := 'Définition et calcul de primitives, intégrales et aires sous une courbe ou entre deux courbes.';
      lesson_content := $primitives$
## Primitives et calcul intégral

> **Thème : Fonctions numériques**  
> **Objectif :** reconnaître une primitive, déterminer une primitive adaptée à une condition, calculer une intégrale et interpréter une aire.

## Situation d’apprentissage

La construction d’une piscine conduit à calculer une aire délimitée par une courbe. Les primitives et les intégrales permettent de transformer ce calcul géométrique en un calcul algébrique rigoureux.

## 1. Primitive d’une fonction

> **Définition :** sur un intervalle `I`, une fonction `F` est une primitive de `f` lorsque `F` est dérivable sur `I` et que, pour tout `x` de `I`, `F'(x)=f(x)`.

Une **primitive** est donc une fonction dont la dérivée redonne la fonction étudiée. Si `F` est une primitive de `f`, toutes les primitives de `f` s’écrivent `F(x)+c`, où `c` est une constante réelle.

$$
F'(x)=f(x) \qquad \text{et} \qquad \mathcal P_f: x\mapsto F(x)+c
$$

> **Méthode : vérifier une primitive**  
> Dériver la fonction proposée, réduire l’expression obtenue, puis comparer avec `f`. Deux primitives d’une même fonction ne diffèrent que par une constante.

Lorsqu’une primitive doit prendre une valeur donnée, la constante se détermine avec cette condition. Par exemple, si `H(x)=x^2-x+c` et `H(-1)=5`, alors `2+c=5`, donc `c=3`.

## 2. Primitives usuelles et linéarité

| Fonction sur l’intervalle indiqué | Une primitive | Intervalle |
|---|---|---|
| `a` | `ax+c` | `ℝ` |
| `x^n`, avec `n∈ℕ` | `x^(n+1)/(n+1)+c` | `ℝ` |
| `x^r`, avec `r∈ℚ*` et `r≠-1` | `x^(r+1)/(r+1)+c` | Selon le signe et le domaine de `x^r` |

> **Attention :** la formule des puissances ne s’emploie pas pour l’exposant `-1`. La primitive de `1/x` relève de la forme logarithmique et dépend du signe de `x`.

Si `U` et `V` sont des primitives de `u` et `v`, alors `U+V` est une primitive de `u+v`. De même, si `U` est une primitive de `u`, `aU` est une primitive de `au`.

$$
\int (u+v)=U+V+c \qquad \text{et} \qquad \int au=aU+c
$$

## 3. Reconnaître des formes composées

La dérivée intérieure est le signal principal. Pour une fonction dérivable `u` :

$$
\int u'(x)u(x)^m\,dx=\frac{u(x)^{m+1}}{m+1}+c\quad(m\neq-1)
$$

$$
\int \frac{u'(x)}{u(x)}\,dx=\ln|u(x)|+c \qquad \text{et} \qquad \int u'(x)e^{u(x)}\,dx=e^{u(x)}+c
$$

> **Méthode : reconnaître une composée**  
> 1. Nommer l’expression intérieure `u(x)`. 2. Calculer `u'(x)`. 3. Vérifier que le facteur extérieur est exactement `u'(x)` ou un multiple simple. 4. Employer la formule adaptée et dériver le résultat pour contrôler.

Le PDF utilise notamment `2x(x^2+1)^8` : avec `u(x)=x^2+1` et `u'(x)=2x`, une primitive est `(x^2+1)^9/9`.

## 4. Intégrale sur un intervalle

> **Définition :** si `f` est continue sur un intervalle contenant `a` et `b`, et si `F` est une primitive de `f`, alors l’intégrale de `a` à `b` vaut `F(b)-F(a)`.

$$
\int_a^b f(x)\,dx=[F(x)]_a^b=F(b)-F(a)
$$

La lettre d’intégration est une **variable muette** : `∫_0^1x^2dx` et `∫_0^1z^2dz` ont la même valeur. L’essentiel est de respecter les bornes et d’évaluer la primitive au point d’arrivée puis au point de départ.

## 5. Intégrale et aire

Si `f` est continue et positive sur `[a;b]`, l’intégrale représente l’aire, en unités d’aire, sous la courbe de `f`, au-dessus de l’axe des abscisses et entre les droites `x=a` et `x=b`.

$$
\mathcal A=\int_a^b f(x)\,dx\;\text{u.a.}
$$

Entre deux courbes, il faut d’abord identifier la fonction supérieure `f` et la fonction inférieure `g` sur tout l’intervalle :

$$
\mathcal A=\int_a^b\bigl(f(x)-g(x)\bigr)\,dx\;\text{u.a.}
$$

> **Attention :** une intégrale est une aire seulement lorsque la fonction considérée est positive. Entre deux courbes, le signe de `f-g` doit être connu avant le calcul.

Dans la terrasse du document, la région sous `y=-x^2+4` entre `-2` et `2` est combinée à un rectangle de `4 m` sur `2 m`.

> **Synthèse :** une primitive inverse une dérivation. L’intégrale définie se calcule avec une primitive et permet notamment d’exprimer des aires. Les formes `u'u^m`, `u'/u` et `u'e^u` se reconnaissent grâce à la dérivée de l’expression intérieure.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Leçon 8 : Primitives et calcul intégral »**, Mathématiques, Terminale A, Côte d’Ivoire – École numérique.
$primitives$;
      exercise_one_title := 'Exercice 1 — Primitives usuelles et reconnaissance de formes';
      exercise_two_title := 'Exercice 2 — Intégrales et calculs d’aires';
      quiz_title := 'Quiz de révision — Primitives et calcul intégral';
    elsif target.lesson_key = 'statistics_a1' then
      lesson_description := 'Série statistique double, ajustement de Mayer, covariance, corrélation, régression et estimation.';
      lesson_content := $statistics_a1$
## Statistique à deux variables — Terminale A1

> **Objectif :** organiser une série double, représenter son nuage de points, ajuster une droite puis estimer une valeur avec la méthode adaptée.

## 1. Série statistique double et tableau de contingence

Une **série statistique double** observe deux caractères quantitatifs `X` et `Y` sur une même population. L’effectif `n_ij` correspond au couple `(x_i;y_j)`. Le tableau à double entrée qui rassemble ces effectifs est un **tableau de contingence**.

La **série marginale** de `X` s’obtient en totalisant chaque ligne ; celle de `Y` s’obtient en totalisant chaque colonne. Une fréquence marginale est un effectif marginal divisé par l’effectif total.

> **Définition : nuage de points**  
> Chaque couple observé `(x_i;y_i)` est représenté par un point du plan. Le nuage permet de repérer visuellement une tendance éventuelle.

## 2. Point moyen et ajustement de Mayer

Le point moyen `G` du nuage a pour coordonnées les moyennes des abscisses et des ordonnées :

$$
G(\overline X;\overline Y),\qquad \overline X=\frac{x_1+\cdots+x_n}{n},\qquad \overline Y=\frac{y_1+\cdots+y_n}{n}
$$

La méthode de **Mayer** consiste à classer les couples selon les `x_i`, à partager la série en deux sous-nuages d’effectifs comparables, puis à calculer leurs points moyens `G_1` et `G_2`. La droite `(G_1G_2)` est la droite d’ajustement. Elle passe par `G`.

> **Méthode : droite de Mayer**  
> Ordonner les valeurs de `X` ; former deux groupes ; calculer `G_1` et `G_2` ; déterminer l’équation de la droite qui passe par ces deux points ; utiliser cette équation seulement pour une estimation cohérente avec la tendance.

## 3. Covariance et corrélation linéaire

La **covariance** mesure le sens de variation conjointe de `X` et `Y`. Le coefficient de corrélation linéaire `r` apprécie l’intensité du lien linéaire.

$$
\operatorname{Cov}(X,Y)=\frac{1}{n}\sum x_i y_i-\overline X\,\overline Y
$$

$$
r=\frac{\operatorname{Cov}(X,Y)}{\sqrt{V(X)}\sqrt{V(Y)}}
$$

Quand la corrélation est suffisamment forte, un ajustement par moindres carrés est pertinent. Il ne transforme toutefois pas une estimation en certitude : il décrit une tendance du jeu de données observé.

## 4. Droites de régression et estimation

La droite de régression de `Y` en `X` sert à estimer `Y` quand `X` est connu ; celle de `X` en `Y` sert au sens inverse.

$$
y=ax+b,\qquad a=\frac{\operatorname{Cov}(X,Y)}{V(X)},\qquad b=\overline Y-a\overline X
$$

$$
x=a'y+b',\qquad a'=\frac{\operatorname{Cov}(X,Y)}{V(Y)},\qquad b'=\overline X-a'\overline Y
$$

Le document applique ces outils à la relation entre pluviométrie et température. Il convient de préciser quel caractère est estimé et de choisir la droite correspondante.

> **Synthèse :** le tableau de contingence organise les données ; le nuage les visualise ; Mayer fournit une droite d’ajustement ; covariance, corrélation et moindres carrés approfondissent l’étude pour la série A1.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Leçon 6 : Statistique à deux variables »**, Mathématiques, Terminale A, Côte d’Ivoire – École numérique.
$statistics_a1$;
      exercise_one_title := 'Exercice 1 — Série double, point moyen et droite de Mayer';
      exercise_two_title := 'Exercice 2 — Corrélation, régression et estimation';
      quiz_title := 'Quiz de révision — Statistique à deux variables A1';
    elsif target.lesson_key = 'statistics_a2' then
      lesson_description := 'Série statistique double, nuage de points, point moyen, ajustement de Mayer et estimation.';
      lesson_content := $statistics_a2$
## Statistique à deux variables — Terminale A2

> **Objectif :** organiser une série statistique double, lire un nuage de points, calculer des points moyens et construire une droite d’ajustement par la méthode de Mayer.

## 1. Lire une série statistique double

Une série double associe deux caractères quantitatifs `X` et `Y` à une même population. Chaque observation est un couple `(x_i;y_i)`. Dans un tableau de contingence, `n_ij` indique l’effectif du couple `(x_i;y_j)`.

> **Exemple de lecture :** dans le tableau de ménages du document, l’effectif `16` au croisement de `X=2` enfants et `Y=3` pièces signifie que seize ménages ont deux enfants et occupent trois pièces.

## 2. Nuage de points et point moyen

Le **nuage de points** est l’ensemble des points représentant les couples observés. Le **point moyen** `G` résume le centre du nuage :

$$
G(\overline X;\overline Y),\qquad \overline X=\frac{x_1+\cdots+x_n}{n},\qquad \overline Y=\frac{y_1+\cdots+y_n}{n}
$$

> **Méthode :** additionner toutes les valeurs de `X`, diviser par le nombre de couples ; recommencer pour `Y`. Les deux calculs portent sur la même série et le même effectif `n`.

## 3. Ajustement linéaire de Mayer

Un **ajustement** recherche une courbe proche du maximum de points du nuage. Si cette courbe est une droite, l’ajustement est dit linéaire ou affine.

Pour la méthode de Mayer, on range d’abord les couples par abscisses croissantes. On sépare ensuite le nuage en deux sous-nuages, puis on calcule leurs points moyens `G_1` et `G_2`. La droite `(G_1G_2)` est la droite de Mayer et passe par le point moyen général `G`.

$$
(G_1G_2):y=ax+b,\qquad a=\frac{Y_2-Y_1}{X_2-X_1},\qquad b=Y_1-aX_1
$$

> **Attention :** avant de calculer le coefficient directeur, vérifier que les abscisses de `G_1` et `G_2` sont distinctes. Si le nombre de points est impair, le partage suit la règle donnée dans le document afin de conserver deux sous-nuages comparables.

## 4. Estimer sans confondre prédiction et certitude

Une droite d’ajustement permet d’estimer `Y` pour une valeur donnée de `X`, ou d’obtenir une lecture graphique. Dans l’exemple agricole du document, substituer `x=9` dans la droite de Mayer donne une estimation du nombre d’exploitations.

L’estimation prolonge une tendance observée : elle doit être formulée comme une valeur approchée et non comme un résultat certain.

> **Synthèse :** pour la série A2, retenir série double, tableau de contingence, nuage de points, point moyen, droite de Mayer et estimation. Les méthodes de covariance, corrélation et moindres carrés sont explicitement réservées à la série A1 dans le document source.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Leçon 6 : Statistique à deux variables »**, Mathématiques, Terminale A, Côte d’Ivoire – École numérique.
$statistics_a2$;
      exercise_one_title := 'Exercice 1 — Nuage, point moyen et méthode de Mayer';
      exercise_two_title := 'Exercice 2 — Droite d’ajustement et estimation';
      quiz_title := 'Quiz de révision — Statistique à deux variables A2';
    else
      lesson_description := 'Nombres complexes : formes algébrique, trigonométrique et exponentielle, module, argument, racines et équations dans ℂ.';
      lesson_content := $complexes$
## Nombres complexes

> **Thème : Calculs algébriques**  
> **Objectif :** calculer dans `ℂ`, représenter un complexe dans le plan, utiliser ses formes trigonométrique et exponentielle puis résoudre des équations complexes.

## 1. Forme algébrique et calculs dans ℂ

> **Définition :** un nombre complexe s’écrit de manière unique sous la forme `z=a+ib`, avec `a,b∈ℝ` et `i^2=-1`.

Le réel `a` est la **partie réelle** `Re(z)` ; `b` est la **partie imaginaire** `Im(z)`. Un complexe est réel si sa partie imaginaire est nulle ; il est imaginaire pur si sa partie réelle est nulle.

$$
z=z'\Longleftrightarrow \operatorname{Re}(z)=\operatorname{Re}(z')\ \text{et}\ \operatorname{Im}(z)=\operatorname{Im}(z')
$$

Les calculs suivent les règles de distributivité, en remplaçant toujours `i^2` par `-1`. Les puissances de `i` sont périodiques de période quatre.

## 2. Conjugué et module

Le **conjugué** de `z=a+ib` est `\overline z=a-ib`. Il permet notamment de simplifier un quotient complexe en multipliant numérateur et dénominateur par le conjugué du dénominateur.

$$
z\overline z=a^2+b^2,\qquad |z|=\sqrt{a^2+b^2}=\sqrt{z\overline z}
$$

Le **module** est un réel positif. Il vérifie `|zz'|=|z||z'|`, `|z^n|=|z|^n` et l’inégalité triangulaire `|z+z'|\le |z|+|z'|`.

## 3. Plan complexe, affixe et argument

Dans un repère orthonormé direct, `z=x+iy` correspond au point `M(x;y)`, appelé point image de `z`. Le complexe `z` est l’**affixe** de `M`.

$$
z_{\overrightarrow{MM'}}=z_{M'}-z_M,\qquad MM'=|z_{M'}-z_M|
$$

Un **argument** de `z\ne0` est une mesure de l’angle orienté entre l’axe réel et `\overrightarrow{OM}`. L’argument principal appartient à `]-\pi;\pi]`.

## 4. Formes trigonométrique et exponentielle

Si `r=|z|` et si `\theta` est un argument de `z`, alors :

$$
z=r(\cos\theta+i\sin\theta)=re^{i\theta}
$$

> **Méthode : passer à une forme trigonométrique**  
> Calculer le module ; déterminer un argument avec la position du point et les valeurs de sinus/cosinus ; écrire enfin `r(cos θ+i sin θ)`. La forme exponentielle remplace le facteur trigonométrique par `e^{iθ}`.

Pour un produit, on multiplie les modules et on additionne les arguments ; pour un quotient, on divise les modules et on soustrait les arguments.

## 5. Moivre, Euler et racines

$$
(\cos\theta+i\sin\theta)^n=\cos(n\theta)+i\sin(n\theta)
$$

La formule de Moivre facilite le calcul de puissances. Les formules d’Euler permettent de relier cosinus, sinus et exponentielles complexes.

Pour `Z_0=Re^{i\theta}\ne0`, les racines `n`-ièmes sont :

$$
z_k=\sqrt[n]{R}\,e^{i\frac{\theta+2k\pi}{n}},\qquad k\in\{0,\ldots,n-1\}
$$

Elles sont les sommets d’un polygone régulier inscrit dans un cercle. Les racines `n`-ièmes de l’unité correspondent au cas `R=1` et `\theta=0`.

## 6. Équations dans ℂ

Pour chercher les racines carrées de `Z_0`, poser `z=x+iy` et identifier les parties réelle et imaginaire de `z^2`. Tout complexe non nul possède deux racines carrées opposées.

Pour `az^2+bz+c=0` avec `a\ne0`, calculer `\Delta=b^2-4ac`, choisir une racine carrée `\delta` de `\Delta`, puis utiliser la formule quadratique.

> **Synthèse :** un complexe peut être étudié algébriquement, géométriquement ou sous forme exponentielle. Le module mesure une distance, l’argument traduit une direction, et les formes trigonométriques structurent puissances, quotients et racines.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Leçon 6 : Nombres complexes »**, Mathématiques, Terminale C, Côte d’Ivoire – École numérique.
$complexes$;
      exercise_one_title := 'Exercice 1 — Forme algébrique, conjugué et module';
      exercise_two_title := 'Exercice 2 — Formes exponentielles, racines et équations';
      quiz_title := 'Quiz de révision — Nombres complexes';
    end if;

    update public.lessons
    set description = lesson_description, content = lesson_content, is_active = false
    where id = target.lesson_id and coalesce(btrim(content), '') = '';

    insert into public.exercises (subject_id, level_id, series_id, chapter_id, lesson_id, title, statement, solution, exercise_type, difficulty, content_markdown, correction_markdown, is_published, is_active, estimated_duration_minutes, display_order)
    select target.subject_id, target.level_id, target.series_id, target.chapter_id, target.lesson_id, exercise_one_title,
      'Répondez progressivement en citant la définition, la propriété ou la méthode utilisée.',
      'La correction détaillée est fournie question par question.', 'single_choice', 'easy',
      '## Consigne\n\nAppliquez les notions fondamentales du cours.', '## Correction\n\nRelisez la définition avant de justifier votre choix.', false, false, 15, 10
    where not exists (select 1 from public.exercises e where e.lesson_id = target.lesson_id and e.title = exercise_one_title)
    returning id into exercise_one_id;

    if exercise_one_id is not null then
      if target.lesson_key = 'primitives' then
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order) values
          (exercise_one_id,'single_choice','Si `F''=f` sur un intervalle, que représente `F` pour `f` ?',jsonb_build_array('Une primitive','Une limite','Une asymptote','Un quotient'),jsonb_build_array('Une primitive'),'C’est la définition même d’une primitive.',10),
          (exercise_one_id,'single_choice','Quelle est une primitive de `2x(x²+1)^8` ?',jsonb_build_array('(x²+1)^9/9','2(x²+1)^9','(x²+1)^8','ln(x²+1)'),jsonb_build_array('(x²+1)^9/9'),'On reconnaît `u''u^8` avec `u=x²+1`.',20),
          (exercise_one_id,'single_choice','Quelle formule calcule `∫_a^b f(x)dx` si `F''=f` ?',jsonb_build_array('F(b)-F(a)','F(a)-F(b)','F(a)+F(b)','F''(b)'),jsonb_build_array('F(b)-F(a)'),'L’intégrale définie s’évalue en borne finale moins borne initiale.',30);
      elsif target.lesson_key like 'statistics_%' then
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order) values
          (exercise_one_id,'single_choice','Que représente un point du nuage associé à une série double ?',jsonb_build_array('Un couple observé (x_i;y_i)','Une seule moyenne','Un total marginal','Une droite'),jsonb_build_array('Un couple observé (x_i;y_i)'),'Chaque point traduit une observation conjointe de X et Y.',10),
          (exercise_one_id,'single_choice','Quelles sont les coordonnées du point moyen ?',jsonb_build_array('(X̄;Ȳ)','(max X;max Y)','(n;n)','(X̄;0)'),jsonb_build_array('(X̄;Ȳ)'),'Le point moyen rassemble la moyenne des abscisses et celle des ordonnées.',20),
          (exercise_one_id,'single_choice','Quelle étape précède le partage de Mayer ?',jsonb_build_array('Ranger les couples par x croissants','Calculer une dérivée','Supprimer les points','Prendre le logarithme'),jsonb_build_array('Ranger les couples par x croissants'),'La méthode de Mayer commence par l’ordonnancement des valeurs de X.',30);
      else
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order) values
          (exercise_one_id,'single_choice','Quelle est la forme algébrique générale d’un complexe ?',jsonb_build_array('a+ib','a/b','a^i','i/a'),jsonb_build_array('a+ib'),'Avec `a,b` réels et `i²=-1`, tout complexe s’écrit `a+ib`.',10),
          (exercise_one_id,'single_choice','Quel est le conjugué de `3-2i` ?',jsonb_build_array('3+2i','-3+2i','3-2i','-3-2i'),jsonb_build_array('3+2i'),'Le conjugué conserve la partie réelle et change le signe de la partie imaginaire.',20),
          (exercise_one_id,'single_choice','Quelle est la valeur de `|3-4i|` ?',jsonb_build_array('5','7','1','25'),jsonb_build_array('5'),'Le module vaut `√(3²+(-4)²)=5`.',30);
      end if;
    end if;

    insert into public.exercises (subject_id, level_id, series_id, chapter_id, lesson_id, title, statement, solution, exercise_type, difficulty, content_markdown, correction_markdown, is_published, is_active, estimated_duration_minutes, display_order)
    select target.subject_id, target.level_id, target.series_id, target.chapter_id, target.lesson_id, exercise_two_title,
      'Mobilisez les formules du cours et interprétez correctement le résultat.',
      'Chaque correction explicite le choix de méthode et la condition à vérifier.', 'single_choice', 'medium',
      '## Consigne\n\nRésolvez étape par étape et contrôlez les conditions.', '## Correction\n\nIdentifier la forme, appliquer la formule puis vérifier le résultat.', false, false, 20, 20
    where not exists (select 1 from public.exercises e where e.lesson_id = target.lesson_id and e.title = exercise_two_title)
    returning id into exercise_two_id;

    if exercise_two_id is not null then
      if target.lesson_key = 'statistics_a1' then
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order) values
          (exercise_two_id,'single_choice','Quelle expression donne la pente de la régression de Y en X ?',jsonb_build_array('Cov(X,Y)/V(X)','Cov(X,Y)/V(Y)','V(X)/Cov(X,Y)','X̄/Ȳ'),jsonb_build_array('Cov(X,Y)/V(X)'),'La droite de Y en X utilise la variance de X au dénominateur.',10),
          (exercise_two_id,'single_choice','Quelle droite permet d’estimer Y quand X est connu ?',jsonb_build_array('La régression de Y en X','La régression de X en Y','Une série marginale','Un tableau de contingence'),jsonb_build_array('La régression de Y en X'),'Le sens de l’estimation détermine la droite à employer.',20),
          (exercise_two_id,'true_false','Les moindres carrés sont une partie prévue pour la série A1 dans le PDF.',jsonb_build_array('Vrai','Faux'),jsonb_build_array('Vrai'),'Le document mentionne explicitement « Série A1 seulement » pour cette méthode.',30);
      elsif target.lesson_key = 'statistics_a2' then
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order) values
          (exercise_two_id,'single_choice','Par quels points passe la droite de Mayer ?',jsonb_build_array('Les points moyens G1 et G2','Tous les points du nuage','Les axes','Les valeurs maximales'),jsonb_build_array('Les points moyens G1 et G2'),'La droite de Mayer est la droite `(G1G2)`.',10),
          (exercise_two_id,'single_choice','Que fournit la substitution d’une valeur x dans la droite de Mayer ?',jsonb_build_array('Une estimation de y','Une preuve certaine','Une fréquence marginale','Une covariance'),jsonb_build_array('Une estimation de y'),'La droite exprime une tendance, donc le résultat est approché.',20),
          (exercise_two_id,'true_false','La covariance et les moindres carrés font partie du programme A2 présenté dans ce PDF.',jsonb_build_array('Vrai','Faux'),jsonb_build_array('Faux'),'Ces sections sont marquées « Série A1 seulement ».',30);
      elsif target.lesson_key = 'primitives' then
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order) values
          (exercise_two_id,'single_choice','Pour calculer une aire entre deux courbes, que faut-il déterminer avant l’intégrale ?',jsonb_build_array('La courbe supérieure et la courbe inférieure','Le module','La variance','Une racine n-ième'),jsonb_build_array('La courbe supérieure et la courbe inférieure'),'On intègre la différence positive `f-g` sur l’intervalle.',10),
          (exercise_two_id,'single_choice','Quelle primitive convient à `u''e^u` ?',jsonb_build_array('e^u+c','ue^u+c','ln|u|+c','u²/2+c'),jsonb_build_array('e^u+c'),'La dérivée de `e^u` est précisément `u''e^u`.',20),
          (exercise_two_id,'true_false','La variable d’intégration modifie la valeur de l’intégrale définie.',jsonb_build_array('Vrai','Faux'),jsonb_build_array('Faux'),'La variable d’intégration est muette : elle peut être renommée.',30);
      else
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order) values
          (exercise_two_id,'single_choice','Quelle forme trigonométrique correspond à un complexe de module r et argument θ ?',jsonb_build_array('r(cos θ+i sin θ)','r+θi','cos r+i sin r','re^r'),jsonb_build_array('r(cos θ+i sin θ)'),'La forme trigonométrique utilise le module et un argument.',10),
          (exercise_two_id,'single_choice','Quelle formule énonce Moivre ?',jsonb_build_array('(cos θ+i sin θ)^n=cos(nθ)+i sin(nθ)','cos θ+i sin θ=e^θ','|z|=z+z̄','i²=1'),jsonb_build_array('(cos θ+i sin θ)^n=cos(nθ)+i sin(nθ)'),'La formule de Moivre porte sur les puissances d’un complexe de module 1.',20),
          (exercise_two_id,'true_false','Un complexe non nul possède deux racines carrées opposées.',jsonb_build_array('Vrai','Faux'),jsonb_build_array('Vrai'),'Le document rappelle que les deux racines carrées sont opposées.',30);
      end if;
    end if;

    insert into public.quizzes (subject_id, level_id, series_id, subject_offering_id, chapter_id, lesson_id, title, description, difficulty, duration_minutes, display_order, is_published, is_active)
    select target.subject_id, target.level_id, target.series_id, target.offering_id, target.chapter_id, target.lesson_id, quiz_title,
      'Évaluez votre maîtrise des définitions, méthodes et conditions de la leçon.', 'medium', 12, 10, false, false
    where not exists (select 1 from public.quizzes q where q.lesson_id = target.lesson_id and q.title = quiz_title)
    returning id into quiz_id;

    if quiz_id is not null then
      if target.lesson_key = 'primitives' then
        with added as (insert into public.quiz_questions (quiz_id, question, explanation, question_type, display_order, points, is_active) values
          (quiz_id,'Quelle relation définit une primitive F de f ?','Une primitive dérivée redonne f.','single_choice',10,1,true),
          (quiz_id,'Quelle forme appelle une primitive logarithmique ?','La forme u''/u conduit à ln|u| sur un intervalle de signe constant.','single_choice',20,1,true),
          (quiz_id,'Comment évalue-t-on une intégrale définie ?','On calcule F(b)-F(a).','single_choice',30,1,true),
          (quiz_id,'Quelle expression donne une aire entre deux courbes ?','On intègre supérieure moins inférieure.','single_choice',40,1,true) returning id,display_order)
        insert into public.quiz_answers (question_id,answer,is_correct,display_order)
        select q.id,a.answer,a.ok,a.ord from added q join lateral (select * from (values
          (10,'F''=f',true,10),(10,'F=f²',false,20),(20,'u''/u',true,10),(20,'u+v',false,20),(30,'F(b)-F(a)',true,10),(30,'F(a)+F(b)',false,20),(40,'∫(f-g)',true,10),(40,'∫(f+g)',false,20)
        ) as v(qord,answer,ok,ord)) a on a.qord=q.display_order;
      elsif target.lesson_key = 'statistics_a1' then
        with added as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
          (quiz_id,'Quel objet représente les couples observés ?','Le nuage de points représente les couples.','single_choice',10,1,true),(quiz_id,'Quelle méthode partage le nuage en deux sous-nuages ?','C’est la méthode de Mayer.','single_choice',20,1,true),(quiz_id,'Que mesure le coefficient r ?','Il renseigne sur la corrélation linéaire.','single_choice',30,1,true),(quiz_id,'Quelle droite estime Y lorsque X est connu ?','La régression de Y en X.','single_choice',40,1,true) returning id,display_order)
        insert into public.quiz_answers (question_id,answer,is_correct,display_order) select q.id,a.answer,a.ok,a.ord from added q join lateral (select * from (values
          (10,'Le nuage de points',true,10),(10,'La droite des axes',false,20),(20,'Mayer',true,10),(20,'Euler',false,20),(30,'La corrélation linéaire',true,10),(30,'Une aire',false,20),(40,'La régression de Y en X',true,10),(40,'La régression de X en Y',false,20)
        ) as v(qord,answer,ok,ord)) a on a.qord=q.display_order;
      elsif target.lesson_key = 'statistics_a2' then
        with added as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
          (quiz_id,'Que désigne n_ij dans un tableau de contingence ?','L’effectif du couple (x_i;y_j).','single_choice',10,1,true),(quiz_id,'Quelles coordonnées a le point moyen ?','Il est G(X̄;Ȳ).','single_choice',20,1,true),(quiz_id,'Quels points déterminent la droite de Mayer ?','G1 et G2.','single_choice',30,1,true),(quiz_id,'Les moindres carrés sont-ils traités pour A2 dans ce PDF ?','Ils sont réservés à A1.','single_choice',40,1,true) returning id,display_order)
        insert into public.quiz_answers (question_id,answer,is_correct,display_order) select q.id,a.answer,a.ok,a.ord from added q join lateral (select * from (values
          (10,'L’effectif du couple',true,10),(10,'Une moyenne',false,20),(20,'G(X̄;Ȳ)',true,10),(20,'G(n;n)',false,20),(30,'G1 et G2',true,10),(30,'Les extrêmes',false,20),(40,'Non, A1 seulement',true,10),(40,'Oui',false,20)
        ) as v(qord,answer,ok,ord)) a on a.qord=q.display_order;
      else
        with added as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
          (quiz_id,'Que vaut i² ?','C’est la relation fondamentale des complexes.','single_choice',10,1,true),(quiz_id,'Comment s’écrit le conjugué de a+ib ?','On change le signe de la partie imaginaire.','single_choice',20,1,true),(quiz_id,'Que représente |z| dans le plan complexe ?','La distance OM.','single_choice',30,1,true),(quiz_id,'Quelle expression donne les racines n-ièmes ?','La formule combine module et arguments répartis.','single_choice',40,1,true) returning id,display_order)
        insert into public.quiz_answers (question_id,answer,is_correct,display_order) select q.id,a.answer,a.ok,a.ord from added q join lateral (select * from (values
          (10,'-1',true,10),(10,'1',false,20),(20,'a-ib',true,10),(20,'-a+ib',false,20),(30,'La distance OM',true,10),(30,'La pente',false,20),(40,'√[n]{R}e^{i(θ+2kπ)/n}',true,10),(40,'Re^{inθ}',false,20)
        ) as v(qord,answer,ok,ord)) a on a.qord=q.display_order;
      end if;
    end if;
  end loop;
end
$math$;
