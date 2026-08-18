-- Mathématiques Terminale A1/A2 : trois PDF lus intégralement.
-- Leçon 1 : fonctions polynômes et rationnelles ; Leçon 2 : probabilités ; Leçon 3/4 : logarithme népérien.
-- Tout élément reste brouillon, inactif et non publié. Toute leçon déjà renseignée provoque un arrêt.

do $mathematics$
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
        when l.id in ('e156de9b-da20-448f-976b-9a48c6be17b4'::uuid, '85e5cd41-539e-4ba3-8c8b-392c14a0b026'::uuid) then 'functions'
        when l.id in ('d3b24f26-e5d7-4cae-9dd5-5c6729ea7da3'::uuid, '1b43a805-c89e-4472-b4c1-45bb7226a822'::uuid) then 'probability'
        when l.id in ('aec347c0-a680-4ef1-b4f6-67947a1e600c'::uuid, '50398ee8-8130-47eb-ad7c-f2ef9f8ad5d0'::uuid) then 'logarithm'
      end as lesson_key
    from public.lessons l
    join public.chapters c on c.id = l.chapter_id
    join public.course_subject_offerings o on o.id = c.subject_offering_id
    join public.subjects subject on subject.id = o.subject_id
    join public.levels level on level.id = o.level_id
    join public.series series on series.id = o.series_id
    where l.id in (
      'e156de9b-da20-448f-976b-9a48c6be17b4', '85e5cd41-539e-4ba3-8c8b-392c14a0b026',
      'd3b24f26-e5d7-4cae-9dd5-5c6729ea7da3', '1b43a805-c89e-4472-b4c1-45bb7226a822',
      'aec347c0-a680-4ef1-b4f6-67947a1e600c', '50398ee8-8130-47eb-ad7c-f2ef9f8ad5d0'
    )
      and subject.name = 'Mathématiques'
      and level.name = 'Terminale'
      and series.name in ('A1', 'A2')
    order by series.name, l.id
  loop
    if exists (select 1 from public.lessons where id = target.lesson_id and coalesce(btrim(content), '') <> '') then
      raise exception 'La leçon de Mathématiques % contient déjà du contenu : aucun écrasement automatique n’est autorisé.', target.lesson_id;
    end if;

    if target.lesson_key = 'functions' then
      lesson_description := 'Limites, asymptotes, dérivation, variations et méthodes d’étude des fonctions polynômes et rationnelles.';
      lesson_content := $functions$
## Étude de fonctions polynômes et de fonctions rationnelles

> **Thème : Fonctions numériques**  
> **Objectif :** lire, calculer et interpréter les limites ; étudier les variations d’une fonction ; relier les résultats algébriques à la courbe représentative.

## Situation d’apprentissage

Une imprimerie produit et vend chaque jour un nombre \(x\) d’articles. Son bénéfice peut être représenté par une fonction telle que \(B(x)=-x²+110x-900\). Pour décider combien d’articles produire, il ne suffit pas de remplacer \(x\) par un nombre : il faut comprendre le comportement global de la fonction, ses variations et son maximum.

> **Définition : Fonction polynôme**
> Une fonction polynôme est obtenue en additionnant des termes de la forme \(ax^n\), où \(a\) est un réel et \(n\) un entier naturel. Son domaine de définition est \(ℝ\).

> **Définition : Fonction rationnelle**
> Une fonction rationnelle est un quotient de deux polynômes. Son domaine contient tous les réels sauf ceux qui annulent le dénominateur.

## 1. Comprendre une limite

Dire que \(f(x)\) a pour limite \(L\) lorsque \(x\) tend vers \(a\) signifie que les valeurs de \(f(x)\) se rapprochent de \(L\) quand \(x\) se rapproche de \(a\). On peut approcher \(a\) par la gauche ou par la droite. Une limite, lorsqu’elle existe, est **unique**.

$$
limₓ→a P(x) = P(a)
$$

> **Méthode : Limite d’un polynôme en un réel**
> Remplacer directement \(x\) par la valeur vers laquelle il tend. Cette règle est valable parce qu’un polynôme est défini et continu sur tout \(ℝ\).

Par exemple, pour \(P(x)=2x+1\), la limite en 4 vaut \(2×4+1=9\). Pour une fonction rationnelle, cette substitution n’est possible que si le dénominateur ne s’annule pas au point étudié.

## 2. Limites à l’infini : le terme dominant

À l’infini, un polynôme est gouverné par son terme de plus haut degré, appelé **terme dominant**. Il faut donc observer deux informations : la parité du degré et le signe du coefficient dominant.

| Situation | Quand x tend vers +∞ | Quand x tend vers −∞ |
|---|---|---|
| \(ax^n\), \(n\) pair, \(a>0\) | +∞ | +∞ |
| \(ax^n\), \(n\) pair, \(a<0\) | −∞ | −∞ |
| \(ax^n\), \(n\) impair, \(a>0\) | +∞ | −∞ |
| \(ax^n\), \(n\) impair, \(a<0\) | −∞ | +∞ |

> **Repère :** dans \(-3x³+2x\), le terme \(-3x³\) domine lorsque \(|x|\) devient très grand. Les termes de degré inférieur deviennent négligeables devant lui.

Pour une fonction rationnelle à l’infini, on compare les termes de plus haut degré du numérateur et du dénominateur. Cette comparaison indique si la limite est un réel, \(+∞\), \(-∞\), ou si l’expression se comporte comme une puissance de \(x\).

## 3. Domaine, limites unilatérales et asymptote verticale

Avant toute étude, on détermine le **domaine de définition**. Si le dénominateur est nul en \(a\), la fonction rationnelle n’est pas définie en \(a\). On doit alors étudier séparément la limite à gauche et la limite à droite.

$$
limₓ→a⁻ 1∕(x−a) = −∞   ;   limₓ→a⁺ 1∕(x−a) = +∞
$$

Lorsque l’une de ces limites est infinie, la droite d’équation \(x=a\) est une **asymptote verticale** : la courbe s’en approche indéfiniment sans la traverser au voisinage considéré.

> **Attention :** le signe du numérateur et celui de \(x-a\) déterminent le signe de la limite. Il faut donc étudier chaque côté de \(a\), sans conclure trop vite à partir du seul dénominateur.

## 4. Opérations sur les limites et formes indéterminées

On peut additionner ou multiplier des limites lorsque le résultat est déterminé. Certaines formes exigent une transformation : \(+∞−∞\), \(0×∞\), \(∞∕∞\) ou \(0∕0\) ne permettent pas de conclure immédiatement.

> **Méthode : Quotient et inverse**
> Pour une fraction, factoriser ou comparer les termes dominants. Lorsque le dénominateur tend vers 0 tandis que le numérateur tend vers un réel non nul, écrire le quotient comme un produit par l’inverse du dénominateur, puis étudier les signes.

## 5. Trois types d’asymptotes

| Type | Condition à vérifier | Équation de la droite |
|---|---|---|
| Verticale | \(f(x)\) tend vers \(+∞\) ou \(-∞\) lorsque \(x\) tend vers \(a\) | \(x=a\) |
| Horizontale | \(f(x)\) tend vers le réel \(b\) à l’infini | \(y=b\) |
| Oblique | \(f(x)-(ax+b)\) tend vers 0 à l’infini | \(y=ax+b\) |

$$
limₓ→±∞ [f(x) − (ax+b)] = 0
$$

Cette dernière relation exprime précisément que l’écart vertical entre la courbe et la droite devient arbitrairement petit à l’infini.

## 6. Dérivée, variations et extrema

La **dérivée** \(f'(x)\) renseigne sur le sens de variation : si elle est positive, \(f\) croît ; si elle est négative, \(f\) décroît. Un **extrémum relatif** est une valeur maximale ou minimale locale ; il apparaît lorsqu’une dérivée s’annule en changeant de signe.

| Fonction | Dérivée |
|---|---|
| \(k\) | 0 |
| \(ax\) | \(a\) |
| \(x^n\) | \(nx^{n-1}\) |
| \(1∕x\) | \(-1∕x²\) |
| \(u∕v\) | \((u'v-v'u)∕v²\), si \(v\neq0\) |

> **Méthode : Étude complète d’une fonction rationnelle**
> 1. Déterminer le domaine. 2. Calculer les limites aux bornes du domaine. 3. Identifier les asymptotes. 4. Calculer puis factoriser \(f'(x)\). 5. Étudier le signe de \(f'\). 6. Construire le tableau de variations. 7. Exploiter les informations pour tracer la courbe.

## 7. Tangente, théorème des valeurs intermédiaires et dichotomie

La tangente au point d’abscisse \(a\) a pour pente \(f'(a)\). Son équation est :

$$
y = f'(a)(x−a) + f(a)
$$

Le **théorème des valeurs intermédiaires** permet d’affirmer l’existence d’une solution \(α\) de \(f(x)=0\) sur un intervalle lorsque \(f\) est continue et que \(f(a)\) et \(f(b)\) sont de signes contraires. Si la fonction est strictement monotone sur cet intervalle, cette solution est unique.

La **dichotomie** encadre \(α\) en divisant un intervalle en deux, puis en conservant la moitié où le changement de signe demeure. Le **balayage** utilise une succession de valeurs espacées d’un pas choisi.

## Synthèse

- Les polynômes se traitent par substitution en un point et par le terme dominant à l’infini.
- Le domaine d’une fraction rationnelle interdit les zéros du dénominateur.
- Les limites unilatérales permettent de reconnaître une asymptote verticale.
- Les dérivées organisent le tableau de variations et la recherche d’un maximum ou d’un minimum.
- La continuité et le changement de signe permettent d’encadrer les zéros d’une fonction.

## Référence pédagogique

Contenu reformulé, structuré et approfondi à partir du PDF fourni : **« Leçon 1 : Étude de fonctions polynômes et de fonctions rationnelles »**, Mathématiques, Terminale A, Côte d’Ivoire – École numérique.
$functions$;
    elsif target.lesson_key = 'probability' then
      lesson_description := 'Expériences aléatoires, événements, équiprobabilité, variables aléatoires et indicateurs numériques.';
      lesson_content := $probability$
## Probabilités

> **Thème : Modélisation d’un phénomène aléatoire**  
> **Objectif :** décrire une expérience aléatoire, calculer des probabilités sur un univers fini et interpréter une variable aléatoire à l’aide de son espérance, de sa variance et de son écart-type.

## Situation d’apprentissage

Dans un jeu de kermesse, des boules de couleurs et de numéros différents sont tirées d’une urne. Le résultat exact du tirage est imprévisible, mais les résultats possibles et leurs probabilités peuvent être modélisés. Les probabilités permettent alors de décider si une mise est avantageuse ou non sur un grand nombre de parties.

> **Définition : Expérience aléatoire**
> C’est une expérience dont on connaît les issues possibles sans pouvoir prévoir avec certitude laquelle se produira.

> **Définition : Univers et éventualité**
> L’**univers**, noté \(Ω\), est l’ensemble de toutes les issues possibles. Une **éventualité** est une issue élémentaire \(ω\) appartenant à \(Ω\).

Pour un dé équilibré, \(Ω=\{1;2;3;4;5;6\}\). L’issue 6 est une éventualité ; l’ensemble « obtenir un nombre pair » est un événement.

## 1. Événements et langage des ensembles

Un **événement** est un sous-ensemble de \(Ω\). Il est réalisé lorsque l’issue obtenue lui appartient. Les opérations sur les événements traduisent les mots du langage ordinaire.

| Écriture | Lecture probabiliste | Exemple avec un dé |
|---|---|---|
| \(A∩B\) | « A et B » | nombre pair et multiple de 3 : \{6\} |
| \(A∪B\) | « A ou B », au moins l’un des deux | pair ou multiple de 3 |
| \(\overline A\) | événement contraire de A | ne pas obtenir un nombre pair |
| \(A∩B=∅\) | A et B incompatibles | pair et impair |
| \(Ω\) | événement certain | un résultat du dé apparaît |
| \(∅\) | événement impossible | obtenir 7 avec un dé à six faces |

> **Attention :** deux événements incompatibles ne sont pas forcément contraires. Des contraires sont incompatibles et leur réunion vaut tout l’univers ; deux événements incompatibles ordinaires peuvent laisser d’autres issues possibles.

## 2. Probabilité sur un univers fini

Une probabilité attribue à chaque issue un nombre positif ou nul, de telle sorte que la somme de toutes les probabilités soit égale à 1. La probabilité d’un événement est la somme des probabilités des issues qui le composent.

$$
0 ≤ P(A) ≤ 1   ;   P(Ω)=1   ;   P(∅)=0
$$

Les propriétés de réunion et de complémentaire permettent des calculs rapides :

$$
P(A∪B)=P(A)+P(B)−P(A∩B)   ;   P(Ā)=1−P(A)
$$

Lorsque \(A\) et \(B\) sont incompatibles, leur intersection est vide et la formule devient \(P(A∪B)=P(A)+P(B)\).

> **Méthode : Avant de calculer**
> Définir explicitement l’univers, traduire chaque phrase en événement, puis vérifier si les événements sont incompatibles, contraires ou quelconques. La formule adaptée dépend de cette analyse.

## 3. Équiprobabilité et dénombrement

Il y a **équiprobabilité** lorsque toutes les issues élémentaires ont la même chance d’être obtenues. Les expressions « dé équilibré », « au hasard » ou « objets indiscernables au toucher » signalent généralement cette situation.

$$
P(A)=card(A)∕card(Ω)
$$

Le numérateur compte les cas favorables, le dénominateur les cas possibles. Dans un tirage simultané de plusieurs objets, l’ordre ne compte pas : on utilise alors un dénombrement adapté aux choix, tel que les combinaisons indiquées dans le PDF.

> **Exemple :** si l’on tire deux boules parmi cinq sans ordre et sans remise, le nombre de tirages possibles est le nombre de groupes de deux boules. Pour un événement, compter exactement les groupes favorables avant de former le quotient.

## 4. Variable aléatoire et loi de probabilité

Une **variable aléatoire** \(X\) est une fonction qui associe un nombre réel à chaque issue. Elle permet de passer d’un résultat concret — couleur, gain ou nombre d’objets tirés — à une valeur numérique que l’on peut étudier.

La **loi de probabilité** de \(X\) donne, pour chaque valeur \(x_i\), la probabilité \(P(X=x_i)\). On doit toujours vérifier que la somme des probabilités de la loi vaut 1.

| Valeur possible \(x_i\) | \(x_1\) | \(x_2\) | … |
|---|---:|---:|---:|
| Probabilité \(P(X=x_i)\) | \(p_1\) | \(p_2\) | … |

## 5. Espérance, variance et écart-type

L’**espérance** est la moyenne théorique d’une variable aléatoire sur un grand nombre de répétitions. Pour un jeu, elle aide à savoir s’il est favorable, défavorable ou équitable pour le joueur.

$$
E(X)=Σ xᵢP(X=xᵢ)
$$

Si \(E(X)>0\), le gain moyen du joueur est positif ; si \(E(X)=0\), le jeu est équitable ; si \(E(X)<0\), il est défavorable au joueur. Cette conclusion concerne une longue répétition, non la certitude d’un gain à chaque partie.

La **variance** mesure la dispersion des valeurs autour de l’espérance. L’**écart-type** est sa racine carrée : plus il est grand, plus les résultats s’éloignent habituellement de la moyenne.

$$
V(X)=Σ xᵢ²P(X=xᵢ)−[E(X)]²   ;   σ=√V(X)
$$

> **Méthode : Tableau de loi**
> 1. Lister les valeurs distinctes de \(X\). 2. Calculer chaque probabilité. 3. Vérifier que leur somme vaut 1. 4. Ajouter les colonnes \(x_iP_i\) puis \(x_i²P_i\). 5. Additionner pour obtenir l’espérance puis la variance.

## 6. Interpréter une situation de jeu

Dans la situation du PDF, une valeur inconnue de gain peut être déterminée en imposant une condition sur l’espérance. On traduit d’abord la condition en inéquation, puis on résout. La conclusion doit être rédigée en langage concret : elle porte sur la mise minimale ou le gain moyen recherché.

> **Repère :** une probabilité n’est pas un pourcentage de certitude sur une partie isolée. C’est un outil de modélisation qui décrit une tendance lorsque l’expérience est répétée dans les mêmes conditions.

## Synthèse

- \(Ω\) rassemble les issues ; un événement est une partie de \(Ω\).
- Les mots « et », « ou », « contraire » et « impossible » correspondent à des opérations sur les ensembles.
- En équiprobabilité, compter les cas favorables et les cas possibles.
- Une variable aléatoire transforme une issue en nombre ; sa loi associe des probabilités à ses valeurs.
- L’espérance décrit un gain moyen théorique ; la variance et l’écart-type décrivent la dispersion.

## Référence pédagogique

Contenu reformulé, structuré et approfondi à partir du PDF fourni : **« Leçon 2 : Probabilités »**, Mathématiques, Terminale A, Côte d’Ivoire – École numérique. Le PDF précise l’extension aux variables aléatoires dans sa progression A1 ; le rattachement A2 a été confirmé administrativement avant création.
$probability$;
    elsif target.lesson_key = 'logarithm' then
      lesson_description := 'Définition, propriétés, limites, équations, inéquations, dérivées et primitives liées au logarithme népérien.';
      lesson_content := $logarithm$
## Fonction logarithme népérien

> **Thème : Fonctions numériques**  
> **Objectif :** manipuler la fonction \(ln\), étudier ses variations, résoudre des équations et inéquations logarithmiques, puis reconnaître des dérivées et primitives associées.

## Situation d’apprentissage

Une probabilité peut prendre la forme \(1-(0,325)^n\). Pour trouver le plus petit entier \(n\) qui rend cette quantité supérieure à un seuil fixé, les essais à la calculatrice sont insuffisants. La fonction logarithme permet de transformer une puissance inconnue en une expression où \(n\) apparaît comme facteur.

> **Définition : Logarithme népérien**
> La fonction logarithme népérien, notée \(ln\), est définie sur \(]0;+∞[\). Elle s’annule en 1 et sa dérivée est \(1∕x\).

$$
ln(1)=0   ;   (ln x)'=1∕x   pour x>0
$$

> **Attention : Domaine de validité**
> Un logarithme \(ln(u)\) n’existe que si \(u>0\). Avant toute simplification, équation ou inéquation, commencer par résoudre cette condition.

## 1. Propriétés algébriques

Pour tous réels strictement positifs \(a\) et \(b\), les propriétés suivantes permettent de transformer un produit, un quotient ou une puissance.

$$
ln(ab)=ln(a)+ln(b)
$$

$$
ln(a∕b)=ln(a)−ln(b)   ;   ln(aⁿ)=nln(a)
$$

La formule de puissance vaut pour un entier \(n\). Le logarithme d’un inverse est l’opposé du logarithme : \(ln(1∕a)=-ln(a)\).

> **Méthode : Simplifier sans erreur**
> Vérifier que chaque argument est positif, décomposer un nombre en produit ou quotient utile, puis utiliser une propriété à la fois. Ne jamais écrire \(ln(a+b)=ln(a)+ln(b)\) : cette relation est fausse.

## 2. Limites et représentation graphique

La fonction \(ln\) est strictement croissante sur \(]0;+∞[\), car \(1∕x>0\) pour tout \(x>0\). Sa courbe traverse l’axe des abscisses au point \((1;0)\).

$$
limₓ→0⁺ ln(x)=−∞   ;   limₓ→+∞ ln(x)=+∞
$$

La droite d’équation \(x=0\) est une asymptote verticale de sa courbe. Deux limites de comparaison sont essentielles pour étudier des expressions plus complexes :

$$
limₓ→0⁺ xln(x)=0   ;   limₓ→+∞ ln(x)∕x=0
$$

> **Repère :** à l’infini, \(ln(x)\) grandit, mais beaucoup plus lentement que \(x\). Près de 0, \(ln(x)\) devient très négatif, tandis que le produit \(xln(x)\) tend vers 0.

## 3. Équations avec ln

Comme \(ln\) est strictement croissante, elle conserve l’égalité et l’ordre entre deux arguments positifs.

$$
ln(a)=ln(b) ⇔ a=b   ;   ln(x)=0 ⇔ x=1
$$

Pour résoudre \(ln(2x-1)=ln(x+5)\), commencer par imposer \(2x-1>0\) et \(x+5>0\). Dans cet ensemble de validité, l’égalité équivaut à \(2x-1=x+5\). Après résolution, contrôler que la solution obtenue appartient bien au domaine.

Pour une équation comme \((ln x)²+ln x-6=0\), poser \(X=ln x\). On résout alors une équation du second degré en \(X\), puis on revient à \(x\) en utilisant la relation \(ln x=c\) équivalente à \(x=e^c\).

> **Méthode : Changement de variable**
> Lorsque plusieurs occurrences de \(ln x\) forment un polynôme, poser \(X=ln x\). Résoudre dans \(X\), puis traduire chaque solution en \(x\) et vérifier \(x>0\).

## 4. Inéquations logarithmiques

La croissance de \(ln\) permet de comparer les arguments sans inverser le sens de l’inégalité :

$$
ln(a)<ln(b) ⇔ a<b   pour a>0 et b>0
$$

Pour \(ln(2x-3)<1\), il faut d’abord \(2x-3>0\), puis écrire \(1=ln(e)\). L’inéquation devient \(2x-3<e\). La solution finale est l’intersection avec l’ensemble de validité.

> **Attention :** si un logarithme est défini seulement sur une partie de \(ℝ\), une solution algébrique en dehors de cette partie doit être rejetée.

## 5. Dérivées et primitives

Si \(u\) est dérivable et strictement positive sur un intervalle, alors :

$$
[ln(u)]' = u'∕u
$$

Cette formule combine la dérivée de \(ln\) et la dérivée de la fonction intérieure \(u\). Ainsi, la dérivée de \(ln(5x+2)\) est \(5∕(5x+2)\), sur un intervalle où \(5x+2>0\).

Inversement, lorsque l’on reconnaît une expression de la forme \(u'∕u\), une primitive est \(ln(u)+k\), avec \(k\) réel, sur un intervalle où \(u>0\).

| Forme rencontrée | Condition | Primitive possible |
|---|---|---|
| \(1∕x\) | \(x>0\) | \(ln(x)+k\) |
| \(u'∕u\) | \(u>0\) | \(ln(u)+k\) |
| \(a∕(ax+b)\) | \(ax+b>0\) | \(ln(ax+b)+k\) |

## 6. Résoudre une situation concrète

Dans la situation proposée, on cherche un entier \(n\) tel que \(1-(0,325)^n≥0,98\). Après transformation, on obtient \((0,325)^n≤0,02\). L’application du logarithme est possible parce que les deux membres sont positifs. Comme \(ln(0,325)\) est négatif, la division par ce nombre inverse le sens de l’inégalité. Le calcul conduit à \(n≥3,48\) ; puisque \(n\) est entier, la plus petite valeur admissible est 4.

> **Méthode : Puissance inconnue**
> Isoler la puissance positive, appliquer \(ln\) aux deux membres, utiliser \(ln(a^n)=nln(a)\), surveiller le signe de \(ln(a)\), puis choisir le plus petit entier qui satisfait la condition.

## Synthèse

- \(ln(x)\) est défini uniquement pour \(x>0\).
- Les propriétés du produit, quotient et puissance simplifient les calculs.
- La fonction \(ln\) est croissante ; elle conserve donc l’ordre entre arguments positifs.
- Les équations et inéquations exigent toujours un ensemble de validité.
- La forme \(u'∕u\) permet de reconnaître une dérivée ou une primitive logarithmique.

## Référence pédagogique

Contenu reformulé, structuré et approfondi à partir du PDF fourni : **« Leçon 3 : Logarithme népérien »**, Mathématiques, Terminale A, Côte d’Ivoire – École numérique.
$logarithm$;
    else
      raise exception 'Leçon cible de Mathématiques non reconnue : %', target.lesson_id;
    end if;

    update public.lessons
    set description = lesson_description, content = lesson_content, is_active = false
    where id = target.lesson_id and coalesce(btrim(content), '') = '';

    exercise_one_id := null;
    exercise_two_id := null;
    quiz_id := null;

    if target.lesson_key = 'functions' then
      insert into public.exercises (subject_id, level_id, series_id, chapter_id, lesson_id, title, statement, solution, exercise_type, difficulty, content_markdown, correction_markdown, is_published, is_active, estimated_duration_minutes, display_order)
      select target.subject_id, target.level_id, target.series_id, target.chapter_id, target.lesson_id,
        'Exercice 1 — Limites et domaine des fonctions',
        'Déterminez des domaines et limites simples de fonctions polynômes et rationnelles.',
        'La correction mobilise la substitution pour les polynômes, le domaine et les signes pour les quotients.',
        'single_choice', 'easy', '## Consigne\n\nRépondez en justifiant par le domaine, le terme dominant ou le sens d’approche.', '## Correction\n\nPour une fraction, le dénominateur ne doit jamais être nul ; pour un polynôme à l’infini, le terme de plus haut degré domine.', false, false, 14, 10
      where not exists (select 1 from public.exercises e where e.lesson_id = target.lesson_id and e.title = 'Exercice 1 — Limites et domaine des fonctions')
      returning id into exercise_one_id;
      if exercise_one_id is not null then
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order) values
          (exercise_one_id, 'single_choice', 'Quelle est la limite de \(2x+1\) lorsque \(x\) tend vers 4 ?', jsonb_build_array('9', '7', '1', '+∞'), jsonb_build_array('9'), 'La fonction est un polynôme : on remplace directement x par 4.', 10),
          (exercise_one_id, 'single_choice', 'Quel réel doit être exclu du domaine de \(f(x)=1/(x-3)\) ?', jsonb_build_array('3', '-3', '0', '1'), jsonb_build_array('3'), 'Le dénominateur x-3 s’annule pour x=3.', 20),
          (exercise_one_id, 'single_choice', 'Quel terme gouverne \(-3x³+2x\) à l’infini ?', jsonb_build_array('-3x³', '2x', '-x', 'La somme entière sans simplification'), jsonb_build_array('-3x³'), 'Le terme de plus haut degré est -3x³.', 30),
          (exercise_one_id, 'single_choice', 'Quelle limite correspond à \(1/(x-2)\) lorsque x tend vers 2 par valeurs supérieures ?', jsonb_build_array('+∞', '-∞', '0', '2'), jsonb_build_array('+∞'), 'À droite de 2, x-2 est positif et très proche de 0.', 40),
          (exercise_one_id, 'true_false', 'Une limite qui existe en un point peut prendre deux valeurs différentes.', jsonb_build_array('Vrai', 'Faux'), jsonb_build_array('Faux'), 'Lorsqu’elle existe, une limite est unique.', 50);
      end if;

      insert into public.exercises (subject_id, level_id, series_id, chapter_id, lesson_id, title, statement, solution, exercise_type, difficulty, content_markdown, correction_markdown, is_published, is_active, estimated_duration_minutes, display_order)
      select target.subject_id, target.level_id, target.series_id, target.chapter_id, target.lesson_id,
        'Exercice 2 — Asymptotes, dérivée et variations',
        'Identifiez des asymptotes et reliez le signe de la dérivée aux variations.',
        'La correction met en relation limites, asymptotes, dérivées et tableaux de variations.',
        'single_choice', 'medium', '## Consigne\n\nUtilisez les définitions d’asymptote et les règles de dérivation.', '## Correction\n\nUne asymptote verticale vient d’une limite infinie en un réel ; la dérivée positive correspond à une croissance.', false, false, 16, 20
      where not exists (select 1 from public.exercises e where e.lesson_id = target.lesson_id and e.title = 'Exercice 2 — Asymptotes, dérivée et variations')
      returning id into exercise_two_id;
      if exercise_two_id is not null then
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order) values
          (exercise_two_id, 'single_choice', 'Quelle condition caractérise une asymptote horizontale y=b ?', jsonb_build_array('f(x) tend vers le réel b à l’infini', 'f(a)=b en un réel a', 'f′(x)=b', 'Le dénominateur vaut b'), jsonb_build_array('f(x) tend vers le réel b à l’infini'), 'Une asymptote horizontale décrit le comportement de la courbe à l’infini.', 10),
          (exercise_two_id, 'single_choice', 'Si f′(x)>0 sur un intervalle, alors f est…', jsonb_build_array('strictement croissante sur cet intervalle', 'strictement décroissante', 'toujours nulle', 'non définie'), jsonb_build_array('strictement croissante sur cet intervalle'), 'Le signe positif de la dérivée indique la croissance.', 20),
          (exercise_two_id, 'single_choice', 'Quelle est la dérivée de x² ?', jsonb_build_array('2x', 'x', '2', 'x³/3'), jsonb_build_array('2x'), 'La règle est (xⁿ)′=nxⁿ⁻¹.', 30),
          (exercise_two_id, 'single_choice', 'Quelle relation prouve que y=ax+b est une asymptote oblique ?', jsonb_build_array('f(x)-(ax+b) tend vers 0 à l’infini', 'f(x)=ax+b pour tout x', 'f′(x)=0', 'x tend vers a'), jsonb_build_array('f(x)-(ax+b) tend vers 0 à l’infini'), 'L’écart entre la courbe et la droite doit tendre vers zéro.', 40),
          (exercise_two_id, 'true_false', 'Un zéro de la dérivée donne toujours un extrémum relatif.', jsonb_build_array('Vrai', 'Faux'), jsonb_build_array('Faux'), 'Il faut aussi que la dérivée change de signe autour de ce zéro.', 50);
      end if;

      insert into public.quizzes (subject_id, level_id, series_id, subject_offering_id, chapter_id, lesson_id, title, description, difficulty, duration_minutes, display_order, is_published, is_active)
      select target.subject_id, target.level_id, target.series_id, target.offering_id, target.chapter_id, target.lesson_id,
        'Quiz de révision — Fonctions polynômes et rationnelles', 'Vérifiez vos acquis sur les limites, asymptotes, dérivées et variations.', 'medium', 12, 10, false, false
      where not exists (select 1 from public.quizzes q where q.lesson_id = target.lesson_id and q.title = 'Quiz de révision — Fonctions polynômes et rationnelles')
      returning id into quiz_id;
      if quiz_id is not null then
        with inserted_questions as (
          insert into public.quiz_questions (quiz_id, question, explanation, question_type, display_order, points, is_active) values
            (quiz_id, 'Pourquoi faut-il déterminer le domaine avant une étude de fonction rationnelle ?', 'Il faut exclure les zéros du dénominateur, qui peuvent aussi signaler une asymptote verticale.', 'single_choice', 10, 1, true),
            (quiz_id, 'Quel élément détermine la limite d’un polynôme à l’infini ?', 'Le monôme de plus haut degré est le terme dominant.', 'single_choice', 20, 1, true),
            (quiz_id, 'Quelle droite est une asymptote verticale lorsque f(x) devient infinie au voisinage de a ?', 'La droite x=a.', 'single_choice', 30, 1, true),
            (quiz_id, 'Que signifie f′(x)<0 sur un intervalle ?', 'La fonction est décroissante sur cet intervalle.', 'single_choice', 40, 1, true),
            (quiz_id, 'Quelle formule donne l’équation de la tangente en a ?', 'y=f′(a)(x-a)+f(a).', 'single_choice', 50, 1, true),
            (quiz_id, 'Quel outil encadre un zéro en conservant le sous-intervalle où le signe change ?', 'La méthode de dichotomie.', 'single_choice', 60, 1, true)
          returning id, display_order
        )
        insert into public.quiz_answers (question_id, answer, is_correct, display_order)
        select q.id, a.answer, a.is_correct, a.display_order from inserted_questions q join lateral (select * from (values
          (10, 'Pour exclure les zéros du dénominateur', true, 10), (10, 'Pour changer les coefficients', false, 20), (10, 'Pour supprimer les limites', false, 30),
          (20, 'Le monôme de plus haut degré', true, 10), (20, 'Le terme constant seulement', false, 20), (20, 'Le nombre de parenthèses', false, 30),
          (30, 'x=a', true, 10), (30, 'y=a', false, 20), (30, 'y=x+a', false, 30),
          (40, 'La fonction décroît', true, 10), (40, 'La fonction croît', false, 20), (40, 'La fonction est constante', false, 30),
          (50, 'y=f′(a)(x-a)+f(a)', true, 10), (50, 'y=f(a)x', false, 20), (50, 'y=ax+b sans calcul', false, 30),
          (60, 'La dichotomie', true, 10), (60, 'Le complémentaire', false, 20), (60, 'La variance', false, 30)
        ) as answers(question_order, answer, is_correct, display_order)) a on a.question_order = q.display_order;
      end if;

    elsif target.lesson_key = 'probability' then
      insert into public.exercises (subject_id, level_id, series_id, chapter_id, lesson_id, title, statement, solution, exercise_type, difficulty, content_markdown, correction_markdown, is_published, is_active, estimated_duration_minutes, display_order)
      select target.subject_id, target.level_id, target.series_id, target.chapter_id, target.lesson_id,
        'Exercice 1 — Univers, événements et équiprobabilité',
        'Utilisez l’univers, les événements et le dénombrement pour calculer des probabilités.',
        'La correction distingue les opérations sur les événements et le comptage des cas favorables.',
        'single_choice', 'easy', '## Consigne\n\nTraduisez les situations en ensembles avant de calculer.', '## Correction\n\nUn événement est une partie de l’univers ; en équiprobabilité, la probabilité est le quotient des cas favorables par les cas possibles.', false, false, 14, 10
      where not exists (select 1 from public.exercises e where e.lesson_id = target.lesson_id and e.title = 'Exercice 1 — Univers, événements et équiprobabilité')
      returning id into exercise_one_id;
      if exercise_one_id is not null then
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order) values
          (exercise_one_id, 'single_choice', 'Comment note-t-on généralement l’univers d’une expérience aléatoire ?', jsonb_build_array('Ω', 'Δ', 'σ', 'f′'), jsonb_build_array('Ω'), 'Ω rassemble toutes les éventualités possibles.', 10),
          (exercise_one_id, 'single_choice', 'Deux événements incompatibles ont pour intersection…', jsonb_build_array('L’ensemble vide', 'L’univers entier', 'Toujours A', 'Toujours B'), jsonb_build_array('L’ensemble vide'), 'Ils ne peuvent pas se réaliser simultanément.', 20),
          (exercise_one_id, 'single_choice', 'Quelle formule vaut si A et B sont incompatibles ?', jsonb_build_array('P(A∪B)=P(A)+P(B)', 'P(A∪B)=P(A)P(B)', 'P(A)=P(B)', 'P(A∩B)=1'), jsonb_build_array('P(A∪B)=P(A)+P(B)'), 'L’intersection est vide et sa probabilité vaut zéro.', 30),
          (exercise_one_id, 'single_choice', 'Dans un univers équiprobable, P(A) est égale à…', jsonb_build_array('card(A)/card(Ω)', 'card(Ω)/card(A)', 'card(A)+card(Ω)', '0 dans tous les cas'), jsonb_build_array('card(A)/card(Ω)'), 'On divise les cas favorables par les cas possibles.', 40),
          (exercise_one_id, 'true_false', 'Deux événements contraires sont incompatibles.', jsonb_build_array('Vrai', 'Faux'), jsonb_build_array('Vrai'), 'Un événement et son contraire ne peuvent pas se réaliser ensemble.', 50);
      end if;

      insert into public.exercises (subject_id, level_id, series_id, chapter_id, lesson_id, title, statement, solution, exercise_type, difficulty, content_markdown, correction_markdown, is_published, is_active, estimated_duration_minutes, display_order)
      select target.subject_id, target.level_id, target.series_id, target.chapter_id, target.lesson_id,
        'Exercice 2 — Variable aléatoire et gain moyen',
        'Construisez une loi de probabilité puis interprétez l’espérance, la variance et l’écart-type.',
        'La correction rappelle que l’espérance est un gain moyen théorique et que la variance mesure une dispersion.',
        'single_choice', 'medium', '## Consigne\n\nAssociez une valeur à chaque issue, vérifiez la loi puis utilisez les formules d’espérance et de variance.', '## Correction\n\nLa somme des probabilités doit valoir 1 ; le signe de l’espérance indique le caractère favorable, défavorable ou équitable d’un jeu.', false, false, 16, 20
      where not exists (select 1 from public.exercises e where e.lesson_id = target.lesson_id and e.title = 'Exercice 2 — Variable aléatoire et gain moyen')
      returning id into exercise_two_id;
      if exercise_two_id is not null then
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order) values
          (exercise_two_id, 'single_choice', 'Qu’est-ce qu’une variable aléatoire X ?', jsonb_build_array('Une fonction qui associe un nombre à chaque issue', 'Un événement impossible', 'Un dé équilibré', 'Une limite de fonction'), jsonb_build_array('Une fonction qui associe un nombre à chaque issue'), 'X transforme les résultats d’une expérience en valeurs numériques.', 10),
          (exercise_two_id, 'single_choice', 'Quelle vérification est obligatoire dans une loi de probabilité ?', jsonb_build_array('La somme des probabilités vaut 1', 'Toutes les valeurs sont positives', 'L’espérance est nulle', 'Les gains sont identiques'), jsonb_build_array('La somme des probabilités vaut 1'), 'Une loi de probabilité répartit totalement la probabilité 1.', 20),
          (exercise_two_id, 'single_choice', 'Si E(X)=0 pour le gain d’un joueur, le jeu est…', jsonb_build_array('équitable', 'toujours gagnant', 'impossible', 'sans univers'), jsonb_build_array('équitable'), 'Le gain moyen théorique est nul.', 30),
          (exercise_two_id, 'single_choice', 'Quel indicateur mesure la dispersion autour de l’espérance ?', jsonb_build_array('La variance', 'L’univers', 'Le complémentaire', 'La tangente'), jsonb_build_array('La variance'), 'La variance compare les carrés des valeurs à l’espérance au carré.', 40),
          (exercise_two_id, 'true_false', 'Un jeu dont l’espérance est positive garantit un gain à chaque partie.', jsonb_build_array('Vrai', 'Faux'), jsonb_build_array('Faux'), 'Une espérance positive décrit une tendance moyenne, non un résultat certain à chaque tirage.', 50);
      end if;

      insert into public.quizzes (subject_id, level_id, series_id, subject_offering_id, chapter_id, lesson_id, title, description, difficulty, duration_minutes, display_order, is_published, is_active)
      select target.subject_id, target.level_id, target.series_id, target.offering_id, target.chapter_id, target.lesson_id,
        'Quiz de révision — Probabilités', 'Évaluez votre compréhension des événements, de l’équiprobabilité et des variables aléatoires.', 'medium', 12, 10, false, false
      where not exists (select 1 from public.quizzes q where q.lesson_id = target.lesson_id and q.title = 'Quiz de révision — Probabilités')
      returning id into quiz_id;
      if quiz_id is not null then
        with inserted_questions as (
          insert into public.quiz_questions (quiz_id, question, explanation, question_type, display_order, points, is_active) values
            (quiz_id, 'Que représente l’univers Ω ?', 'L’ensemble de toutes les issues possibles.', 'single_choice', 10, 1, true),
            (quiz_id, 'Quelle opération correspond à « A ou B » ?', 'La réunion A∪B.', 'single_choice', 20, 1, true),
            (quiz_id, 'Quelle est la probabilité de l’événement impossible ?', 'Elle vaut 0.', 'single_choice', 30, 1, true),
            (quiz_id, 'Quel mot indique souvent une équiprobabilité ?', 'Indiscernables au toucher.', 'single_choice', 40, 1, true),
            (quiz_id, 'Que décrit l’espérance d’un gain ?', 'Le gain moyen théorique sur un grand nombre de parties.', 'single_choice', 50, 1, true),
            (quiz_id, 'Comment obtient-on l’écart-type ?', 'En prenant la racine carrée de la variance.', 'single_choice', 60, 1, true)
          returning id, display_order
        )
        insert into public.quiz_answers (question_id, answer, is_correct, display_order)
        select q.id, a.answer, a.is_correct, a.display_order from inserted_questions q join lateral (select * from (values
          (10, 'Toutes les issues possibles', true, 10), (10, 'Seulement les issues favorables', false, 20), (10, 'Une moyenne de gains', false, 30),
          (20, 'La réunion A∪B', true, 10), (20, 'L’intersection A∩B uniquement', false, 20), (20, 'Le contraire Ā', false, 30),
          (30, '0', true, 10), (30, '1', false, 20), (30, '-1', false, 30),
          (40, 'Indiscernables au toucher', true, 10), (40, 'Toujours rouge', false, 20), (40, 'Fonction croissante', false, 30),
          (50, 'Le gain moyen théorique', true, 10), (50, 'Le gain certain de la prochaine partie', false, 20), (50, 'Le nombre d’issues', false, 30),
          (60, 'La racine carrée de la variance', true, 10), (60, 'Le carré de l’espérance', false, 20), (60, 'La somme des événements', false, 30)
        ) as answers(question_order, answer, is_correct, display_order)) a on a.question_order = q.display_order;
      end if;

    elsif target.lesson_key = 'logarithm' then
      insert into public.exercises (subject_id, level_id, series_id, chapter_id, lesson_id, title, statement, solution, exercise_type, difficulty, content_markdown, correction_markdown, is_published, is_active, estimated_duration_minutes, display_order)
      select target.subject_id, target.level_id, target.series_id, target.chapter_id, target.lesson_id,
        'Exercice 1 — Domaine et propriétés du logarithme',
        'Déterminez les ensembles de validité et appliquez les propriétés algébriques de ln.',
        'La correction vérifie la positivité des arguments avant d’utiliser les propriétés de produit, quotient et puissance.',
        'single_choice', 'easy', '## Consigne\n\nCommencez toujours par les conditions de positivité des arguments des logarithmes.', '## Correction\n\nLa fonction ln est définie sur les réels strictement positifs ; les propriétés ne s’appliquent qu’à des arguments positifs.', false, false, 14, 10
      where not exists (select 1 from public.exercises e where e.lesson_id = target.lesson_id and e.title = 'Exercice 1 — Domaine et propriétés du logarithme')
      returning id into exercise_one_id;
      if exercise_one_id is not null then
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order) values
          (exercise_one_id, 'single_choice', 'Quel est l’ensemble de définition de ln(x) ?', jsonb_build_array(']0;+∞[', 'ℝ', ']-∞;0[', '{0}'), jsonb_build_array(']0;+∞['), 'L’argument d’un logarithme népérien doit être strictement positif.', 10),
          (exercise_one_id, 'single_choice', 'Quelle égalité est correcte pour a et b positifs ?', jsonb_build_array('ln(ab)=ln(a)+ln(b)', 'ln(a+b)=ln(a)+ln(b)', 'ln(a/b)=ln(a)+ln(b)', 'ln(a²)=2a'), jsonb_build_array('ln(ab)=ln(a)+ln(b)'), 'Le logarithme transforme un produit en somme de logarithmes.', 20),
          (exercise_one_id, 'single_choice', 'Quelle est la valeur de ln(1) ?', jsonb_build_array('0', '1', 'e', '-∞'), jsonb_build_array('0'), 'La fonction ln s’annule en 1.', 30),
          (exercise_one_id, 'single_choice', 'Quelle est la dérivée de ln(x) pour x>0 ?', jsonb_build_array('1/x', 'x', 'ln(x)', 'x²/2'), jsonb_build_array('1/x'), 'C’est la propriété de définition de la fonction logarithme népérien.', 40),
          (exercise_one_id, 'true_false', 'ln(a+b) est toujours égal à ln(a)+ln(b).', jsonb_build_array('Vrai', 'Faux'), jsonb_build_array('Faux'), 'La propriété porte sur le produit, non sur la somme.', 50);
      end if;

      insert into public.exercises (subject_id, level_id, series_id, chapter_id, lesson_id, title, statement, solution, exercise_type, difficulty, content_markdown, correction_markdown, is_published, is_active, estimated_duration_minutes, display_order)
      select target.subject_id, target.level_id, target.series_id, target.chapter_id, target.lesson_id,
        'Exercice 2 — Équations, inéquations et dérivées logarithmiques',
        'Résolvez des problèmes logarithmiques en respectant l’ensemble de validité et les règles de dérivation.',
        'La correction utilise la croissance de ln, le changement de variable et la forme u’/u.',
        'single_choice', 'medium', '## Consigne\n\nÉtablissez l’ensemble de validité avant toute équivalence, puis vérifiez les solutions finales.', '## Correction\n\nLa croissance de ln conserve l’ordre ; une expression u’/u admet ln(u)+k pour primitive sur un intervalle où u est positif.', false, false, 16, 20
      where not exists (select 1 from public.exercises e where e.lesson_id = target.lesson_id and e.title = 'Exercice 2 — Équations, inéquations et dérivées logarithmiques')
      returning id into exercise_two_id;
      if exercise_two_id is not null then
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order) values
          (exercise_two_id, 'single_choice', 'ln(a)=ln(b) avec a,b>0 équivaut à…', jsonb_build_array('a=b', 'a=-b', 'a+b=0', 'a/b=0'), jsonb_build_array('a=b'), 'La fonction ln est strictement croissante donc injective sur ]0;+∞[.', 10),
          (exercise_two_id, 'single_choice', 'ln(x)=0 équivaut à…', jsonb_build_array('x=1', 'x=0', 'x=e', 'x=-1'), jsonb_build_array('x=1'), 'ln(1)=0 et ln est injective sur son domaine.', 20),
          (exercise_two_id, 'single_choice', 'Quelle est la dérivée de ln(5x+2) ?', jsonb_build_array('5/(5x+2)', '1/(5x+2)', '5ln(x+2)', '5x+2'), jsonb_build_array('5/(5x+2)'), 'On applique (ln(u))′=u′/u avec u=5x+2.', 30),
          (exercise_two_id, 'single_choice', 'Quelle forme possède une primitive ln(u)+k ?', jsonb_build_array('u′/u', 'u×u′', 'u+u′', '1/u′'), jsonb_build_array('u′/u'), 'La dérivée de ln(u) est u′/u lorsque u est positive.', 40),
          (exercise_two_id, 'true_false', 'Lorsqu’on divise une inéquation par ln(0,325), le sens est conservé.', jsonb_build_array('Vrai', 'Faux'), jsonb_build_array('Faux'), 'ln(0,325) est négatif car 0,325 est compris entre 0 et 1 : le sens s’inverse.', 50);
      end if;

      insert into public.quizzes (subject_id, level_id, series_id, subject_offering_id, chapter_id, lesson_id, title, description, difficulty, duration_minutes, display_order, is_published, is_active)
      select target.subject_id, target.level_id, target.series_id, target.offering_id, target.chapter_id, target.lesson_id,
        'Quiz de révision — Logarithme népérien', 'Vérifiez les domaines, propriétés, limites et techniques de résolution liées à ln.', 'medium', 12, 10, false, false
      where not exists (select 1 from public.quizzes q where q.lesson_id = target.lesson_id and q.title = 'Quiz de révision — Logarithme népérien')
      returning id into quiz_id;
      if quiz_id is not null then
        with inserted_questions as (
          insert into public.quiz_questions (quiz_id, question, explanation, question_type, display_order, points, is_active) values
            (quiz_id, 'Quelle condition doit vérifier l’argument de ln ?', 'Il doit être strictement positif.', 'single_choice', 10, 1, true),
            (quiz_id, 'Quelle est la limite de ln(x) lorsque x tend vers 0 par valeurs positives ?', 'Elle vaut -∞.', 'single_choice', 20, 1, true),
            (quiz_id, 'Pourquoi ln(a)<ln(b) entraîne-t-il a<b ?', 'Parce que ln est strictement croissante.', 'single_choice', 30, 1, true),
            (quiz_id, 'Quelle substitution simplifie (ln x)²+ln x-6=0 ?', 'Poser X=ln x.', 'single_choice', 40, 1, true),
            (quiz_id, 'Quelle droite est asymptote à la courbe de ln ?', 'La droite x=0.', 'single_choice', 50, 1, true),
            (quiz_id, 'Que faut-il surveiller dans une inéquation obtenue après logarithme ?', 'Le signe du nombre par lequel on divise.', 'single_choice', 60, 1, true)
          returning id, display_order
        )
        insert into public.quiz_answers (question_id, answer, is_correct, display_order)
        select q.id, a.answer, a.is_correct, a.display_order from inserted_questions q join lateral (select * from (values
          (10, 'Il doit être strictement positif', true, 10), (10, 'Il peut être négatif', false, 20), (10, 'Il doit être nul', false, 30),
          (20, '-∞', true, 10), (20, '+∞', false, 20), (20, '0', false, 30),
          (30, 'Parce que ln est strictement croissante', true, 10), (30, 'Parce que ln est constante', false, 20), (30, 'Parce que a et b sont négatifs', false, 30),
          (40, 'Poser X=ln x', true, 10), (40, 'Poser X=x²', false, 20), (40, 'Poser X=1/x', false, 30),
          (50, 'x=0', true, 10), (50, 'y=0', false, 20), (50, 'y=x', false, 30),
          (60, 'Le signe du nombre par lequel on divise', true, 10), (60, 'Le nombre de lettres', false, 20), (60, 'La couleur de la courbe', false, 30)
        ) as answers(question_order, answer, is_correct, display_order)) a on a.question_order = q.display_order;
      end if;
    end if;
  end loop;
end
$mathematics$;
