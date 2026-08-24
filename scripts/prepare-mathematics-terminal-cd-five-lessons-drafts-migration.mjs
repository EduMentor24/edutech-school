import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const migrationPath = resolve(root, "supabase/migrations/20260824_mathematics_terminal_cd_five_lessons_drafts.sql");
const payloadPath = resolve(root, "supabase/migrations/20260824_mathematics_terminal_cd_five_lessons_drafts.apply.json");

const sqlText = (value) => {
  const tag = "$math_cd_content$";
  if (String(value).includes(tag)) throw new Error("Délimiteur SQL interdit dans le contenu Mathématiques.");
  return `${tag}${value}${tag}`;
};

const jsonArray = (values) => `jsonb_build_array(${values.map(sqlText).join(",")})`;

const lessons = [
  {
    key: "limits",
    title: "1. Limites et continuité",
    createWhenMissing: false,
    description: "Étudier des limites, interpréter le comportement d’une courbe et établir la continuité, l’existence ou l’unicité de solutions.",
    content: String.raw`# Limites et continuité

## Objectif

Une étude de fonction ne consiste pas à appliquer mécaniquement des formules. Elle cherche à répondre à trois questions reliées : **vers quoi tend la fonction ?**, **la courbe se prolonge-t-elle sans rupture ?** et **une équation admet-elle une solution ?**

## 1. Lire une limite avec précision

La limite décrit le comportement de \(f(x)\) lorsque \(x\) se rapproche d’un nombre ou devient très grand en valeur absolue. Elle n’affirme pas nécessairement que la fonction est définie au point approché.

| Situation | Écriture | Lecture utile |
|---|---|---|
| Au voisinage de \(a\) | \(\lim_{x\to a}f(x)=L\) | Les valeurs de \(f(x)\) se rapprochent de \(L\). |
| À droite | \(\lim_{x\to a^+}f(x)\) | On approche \(a\) par des valeurs supérieures. |
| À gauche | \(\lim_{x\to a^-}f(x)\) | On approche \(a\) par des valeurs inférieures. |
| À l’infini | \(\lim_{x\to +\infty}f(x)\) | On observe la courbe très loin vers la droite. |

> **Vigilance :** une limite en \(a\) existe seulement lorsque les limites à gauche et à droite existent et sont égales. Ne confondez pas \(f(a)\), qui concerne la valeur au point, et une limite, qui concerne les valeurs voisines.

## 2. Limite d’une fonction composée

Si \(u(x)\) tend vers \(\ell\) et si \(f(t)\) tend vers \(L\) lorsque \(t\) tend vers \(\ell\), alors, sous les conditions de définition nécessaires, \(f(u(x))\) tend vers \(L\). La méthode consiste à isoler d’abord l’expression intérieure.

> **Méthode : limite composée**  
> 1. Poser mentalement \(t=u(x)\).  
> 2. Calculer la limite de \(u(x)\).  
> 3. Lire ensuite la limite de \(f(t)\) lorsque \(t\) atteint cette valeur.  
> 4. Vérifier le sens d’approche lorsque la limite est unilatérale.

Cette organisation évite de mélanger les deux variables et permet de justifier chaque étape.

## 3. Fonctions monotones et limites

Une fonction croissante ou décroissante possède un comportement plus facile à encadrer. Le support rappelle qu’une fonction monotone et bornée sur un intervalle possède une limite à l’extrémité considérée. La borne ne donne pas automatiquement la limite : elle garantit que l’évolution monotone ne peut pas dépasser un cadre fixé.

| Information disponible | Conclusion à formuler |
|---|---|
| \(f\) croissante et majorée | La limite de \(f\) existe à droite de l’intervalle. |
| \(f\) décroissante et minorée | La limite de \(f\) existe à droite de l’intervalle. |
| Monotonie sans borne adaptée | Étudier plus précisément l’expression ou le tableau de variations. |

## 4. Interprétation graphique des limites

Une limite traduit souvent une forme visible sur la courbe.

| Résultat | Interprétation graphique |
|---|---|
| \(\lim_{x\to +\infty}f(x)=\ell\) | La droite \(y=\ell\) est une asymptote horizontale à droite. |
| \(\lim_{x\to a}f(x)=\pm\infty\) | La droite \(x=a\) est une asymptote verticale. |
| \(\lim_{x\to\pm\infty}[f(x)-(ax+b)]=0\) | La droite \(y=ax+b\) est une asymptote oblique. |
| \(\lim f(x)=\pm\infty\) et \(\lim f(x)/x=0\) | La courbe présente une branche parabolique de direction l’axe des abscisses. |

Pour étudier la position relative à une asymptote \(y=ax+b\), on étudie le signe de \(f(x)-(ax+b)\). Une limite égale à zéro prouve le rapprochement ; le signe indique si la courbe est au-dessus ou au-dessous.

## 5. Continuité et prolongement

> **Définition :** \(f\) est continue en \(a\) lorsque \(f(a)\) existe, \(\lim_{x\to a}f(x)\) existe et que ces deux nombres sont égaux.

Pour une fonction définie par morceaux, il faut donc calculer les limites à gauche et à droite, puis comparer avec la valeur donnée au point. Lorsqu’une fonction n’est pas définie en \(a\), mais possède une limite réelle \(L\) en \(a\), on peut la **prolonger par continuité** en posant \(f(a)=L\).

> **Méthode : prolonger par continuité**  
> Simplifier l’expression sur son domaine de définition ; calculer la limite au point exclu ; définir une nouvelle fonction ayant la même expression hors du point et la valeur-limite au point.

## 6. Théorème des valeurs intermédiaires

Une fonction continue sur un intervalle prend toutes les valeurs comprises entre deux de ses images. Si \(f(a)\) et \(f(b)\) sont de signes contraires, l’équation \(f(x)=0\) admet au moins une solution dans \([a;b]\). Si, en plus, \(f\) est strictement monotone sur cet intervalle, cette solution est unique.

| Étape | Justification attendue |
|---|---|
| Définir l’intervalle | Les deux bornes doivent appartenir au domaine. |
| Établir la continuité | Citer les opérations ou fonctions continues utilisées. |
| Calculer deux images | Mettre en évidence un changement de signe. |
| Conclure par le TVI | Existence d’au moins une solution. |
| Ajouter la monotonie | Unicité éventuelle. |

Le **balayage** teste des valeurs successives ; la **dichotomie** coupe un intervalle où les signes sont opposés en deux sous-intervalles. Ces méthodes donnent une approximation seulement après la justification d’existence.

## 7. Racines nièmes et puissances rationnelles

Pour tout entier naturel non nul \(n\), la fonction \(x\mapsto x^n\) permet de définir des racines nièmes dans les cas étudiés par le support. Une puissance rationnelle doit toujours être accompagnée de son domaine de définition : par exemple, la racine carrée impose une quantité sous la racine positive ou nulle.

> **Synthèse :** une limite décrit un comportement, la continuité permet de faire passer des valeurs intermédiaires et la monotonie permet souvent d’obtenir l’unicité. Toujours distinguer calcul algébrique, condition de domaine et interprétation graphique.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Leçon 1 : Limites et continuité »**, Mathématiques, Terminale C, Côte d’Ivoire – École numérique. Intégré à Terminale C et D à la demande explicite de l’administrateur.`,
    exerciseA: [
      ["Que faut-il comparer pour établir l’existence d’une limite en a ?", ["Les limites à gauche et à droite", "La dérivée et la primitive", "Le maximum et le minimum"], ["Les limites à gauche et à droite"], "Une limite bilatérale existe lorsque les deux limites unilatérales existent et sont égales."],
      ["Quelle droite est une asymptote verticale si la limite de f en a vaut +∞ ou -∞ ?", ["x = a", "y = a", "y = f(a)"], ["x = a"], "Une divergence au voisinage de l’abscisse a correspond à une asymptote verticale d’équation x=a."],
      ["Quelle condition supplémentaire transforme l’existence d’une solution du TVI en unicité ?", ["La stricte monotonie sur l’intervalle", "Une limite infinie", "Une fonction constante"], ["La stricte monotonie sur l’intervalle"], "Une fonction continue et strictement monotone ne peut pas prendre deux fois la même valeur."],
      ["Pour prolonger une fonction par continuité en un point exclu, quelle valeur lui attribue-t-on ?", ["La limite au point", "Toujours zéro", "La dérivée au point"], ["La limite au point"], "Le prolongement donne au point exclu la valeur vers laquelle l’expression tend."],
    ],
    exerciseB: [
      ["Quelle expression faut-il étudier pour connaître la position d’une courbe par rapport à y=ax+b ?", ["f(x)-(ax+b)", "f(x)+(ax+b)", "f'(x)-(ax+b)"], ["f(x)-(ax+b)"], "Le signe de cette différence indique si la courbe est au-dessus ou au-dessous de la droite."],
      ["Dans une limite composée f(u(x)), quelle est la première étape utile ?", ["Calculer la limite de l’expression intérieure u(x)", "Dériver f immédiatement", "Remplacer toutes les variables par zéro"], ["Calculer la limite de l’expression intérieure u(x)"], "On détermine d’abord vers quelle valeur tend l’argument de la fonction extérieure."],
      ["Que garantit une fonction continue sur [a;b] lorsque f(a) et f(b) sont de signes contraires ?", ["Au moins une solution de f(x)=0 dans [a;b]", "Deux solutions exactement", "Aucune solution"], ["Au moins une solution de f(x)=0 dans [a;b]"], "Le théorème des valeurs intermédiaires garantit l’existence, non le nombre exact sans hypothèse supplémentaire."],
      ["Quel procédé réduit un intervalle de recherche en gardant un changement de signe ?", ["La dichotomie", "La factorisation seule", "La numération binaire"], ["La dichotomie"], "La dichotomie conserve le sous-intervalle où les images restent de signes contraires."],
    ],
  },
  {
    key: "barycenter",
    title: "Barycentre et lignes de niveau",
    createWhenMissing: true,
    description: "Utiliser le barycentre de points pondérés et caractériser des lignes de niveau à partir de distances, rapports et angles.",
    content: String.raw`# Barycentre et lignes de niveau

## Objectif

Le barycentre donne un point de synthèse pour plusieurs points pondérés. Les lignes de niveau transforment ensuite une égalité de distances, de rapports ou d’angles en une figure géométrique précise.

## 1. Définir un barycentre

Soient les points pondérés \((A_i;\alpha_i)\). Si la somme des coefficients est non nulle, il existe un unique point \(G\) tel que :

$$
\sum_{i=1}^{n}\alpha_i\overrightarrow{GA_i}=\vec 0.
$$

Le point \(G\) est le **barycentre** des points pondérés. Si \(\sum\alpha_i=0\), ce barycentre n’existe pas dans ce cadre.

| Situation | Écriture ou conséquence |
|---|---|
| Deux points \((A;\alpha),(B;\beta)\) | \(\overrightarrow{AG}=\frac{\beta}{\alpha+\beta}\overrightarrow{AB}\), si \(\alpha+\beta\ne0\). |
| Coefficients tous égaux et non nuls | \(G\) est l’**isobarycentre**. |
| Deux points de même coefficient | Leur isobarycentre est le milieu. |
| Trois sommets non alignés de même coefficient | L’isobarycentre est le centre de gravité du triangle. |

> **Vigilance :** avant tout calcul, additionnez les coefficients. Cette vérification décide si le barycentre est défini.

## 2. Propriétés utiles

L’**homogénéité** signifie que multiplier tous les coefficients par un même réel non nul ne change pas le barycentre. Cette propriété permet de simplifier des poids proportionnels.

Pour tout point \(M\), lorsque \(G\) est le barycentre et \(S=\sum\alpha_i\ne0\), le support utilise la réduction :

$$
\sum_{i=1}^{n}\alpha_i\overrightarrow{MA_i}=S\overrightarrow{MG}.
$$

Si la somme des coefficients est nulle, la somme vectorielle obtenue est indépendante de \(M\). Cette distinction est centrale dans les exercices de réduction.

## 3. Coordonnées et barycentre partiel

Dans un repère de l’espace, si \(A_i(x_i;y_i;z_i)\), les coordonnées de \(G\) sont les moyennes pondérées :

$$
x_G=\frac{\sum\alpha_i x_i}{\sum\alpha_i},\qquad
y_G=\frac{\sum\alpha_i y_i}{\sum\alpha_i},\qquad
z_G=\frac{\sum\alpha_i z_i}{\sum\alpha_i}.
$$

Le **barycentre partiel** consiste à remplacer un groupe de points dont la somme des coefficients n’est pas nulle par son propre barycentre, affecté de la somme de ses coefficients. Il simplifie une construction sans changer le barycentre global.

> **Méthode :** calculez d’abord le barycentre partiel de deux ou trois points ; conservez la somme de leurs poids ; recommencez avec ce nouveau point et les points restants.

## 4. Qu’est-ce qu’une ligne de niveau ?

Pour une application \(f\) du plan vers \(\mathbb R\) et un réel \(k\), la ligne de niveau \(k\) est l’ensemble des points \(M\) vérifiant \(f(M)=k\). L’enjeu est de reconnaître la figure obtenue.

### Sommes pondérées de carrés de distances

Quand \(S=\sum\alpha_i\ne0\), la réduction du support s’écrit :

$$
\sum\alpha_i MA_i^2=S\,MG^2+\sum\alpha_i GA_i^2.
$$

Selon la valeur de \(k\), la ligne de niveau est vide, réduite à \(G\) ou est un cercle de centre \(G\). Quand \(S=0\), l’étude conduit, selon le vecteur constant obtenu, à l’ensemble vide, au plan ou à une droite.

### Rapport de distances et angle orienté

| Application | Cas remarquable | Figure obtenue |
|---|---|---|
| \(M\mapsto MA/MB\) | Rapport égal à 1 | Médiatrice de \([AB]\). |
| \(M\mapsto MA/MB\) | Rapport positif différent de 1 | Cercle déterminé par deux barycentres. |
| \(M\mapsto \text{Mes}(\overrightarrow{MA},\overrightarrow{MB})\) | Angle non nul et non plat | Arc de cercle passant par \(A\) et \(B\). |

> **Synthèse :** le barycentre transforme une somme pondérée en une expression centrée sur \(G\). Les lignes de niveau deviennent alors des figures que l’on peut décrire et construire : cercle, droite, médiatrice ou arc de cercle.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Leçon 2 : Barycentre – lignes de niveaux »**, Mathématiques, Terminale C, Côte d’Ivoire – École numérique. Intégré à Terminale C et D à la demande explicite de l’administrateur.`,
    exerciseA: [
      ["Quelle condition assure l’existence du barycentre de points pondérés ?", ["La somme des coefficients est non nulle", "Tous les coefficients sont positifs", "Les points sont tous alignés"], ["La somme des coefficients est non nulle"], "Le cours exige que la somme des coefficients ne soit pas nulle."],
      ["Comment appelle-t-on le barycentre de points affectés d’un même coefficient non nul ?", ["L’isobarycentre", "Le vecteur normal", "La directrice"], ["L’isobarycentre"], "L’isobarycentre correspond aux points ayant des coefficients égaux."],
      ["Que permet le barycentre partiel ?", ["Remplacer un groupe de points par son barycentre sans changer le barycentre total", "Supprimer les coefficients", "Transformer tout cercle en droite"], ["Remplacer un groupe de points par son barycentre sans changer le barycentre total"], "Le nouveau point porte la somme des coefficients du groupe remplacé."],
      ["Quelle figure est la ligne de niveau MA/MB=1 ?", ["La médiatrice de [AB]", "Un cercle de centre A", "La droite (AB)"], ["La médiatrice de [AB]"], "Les points équidistants de A et B forment la médiatrice du segment."],
    ],
    exerciseB: [
      ["Que devient une somme vectorielle pondérée lorsque la somme des coefficients est non nulle ?", ["Un multiple de MG", "Toujours le vecteur nul", "Un produit scalaire"], ["Un multiple de MG"], "La réduction donne ΣαᵢMAᵢ=(Σαᵢ)MG."],
      ["Quelle information faut-il vérifier avant les coordonnées d’un barycentre ?", ["Que la somme des coefficients n’est pas nulle", "Que toutes les abscisses sont positives", "Que le repère est orthonormé"], ["Que la somme des coefficients n’est pas nulle"], "Les formules de moyenne pondérée divisent par cette somme."],
      ["Lorsque la somme des coefficients est non nulle, une ligne de niveau fondée sur une somme de carrés peut être un…", ["Cercle de centre G", "Triangle obligatoire", "Segment toujours"], ["Cercle de centre G"], "Après réduction, l’égalité se ramène à une valeur de MG²."],
      ["Quelle figure peut être liée à un angle orienté constant entre MA et MB ?", ["Un arc de cercle", "Une parabole nécessairement", "Un plan entier toujours"], ["Un arc de cercle"], "Le support caractérise un arc de cercle d’extrémités A et B pour l’angle approprié."],
    ],
  },
  {
    key: "divisibility",
    title: "Divisibilité dans ℤ",
    createWhenMissing: true,
    description: "Raisonner avec la divisibilité, la division euclidienne, les congruences, la numération et les nombres premiers.",
    content: String.raw`# Divisibilité dans ℤ

## Objectif

L’arithmétique relie plusieurs outils : la divisibilité explique les multiples, la division euclidienne produit un reste et les congruences permettent de raisonner directement sur ces restes.

## 1. Diviseurs et multiples

Soient \(a\) et \(b\) deux entiers relatifs avec \(b\ne0\). Dire que \(b\) divise \(a\), noté \(b\mid a\), signifie qu’il existe un entier \(k\) tel que \(a=kb\). Ainsi, \(a\) est un multiple de \(b\).

| Propriété | Sens dans un raisonnement |
|---|---|
| \(a\mid a\) | Tout entier non nul se divise lui-même. |
| \(a\mid b\) et \(b\mid c\Rightarrow a\mid c\) | La divisibilité est transitive. |
| \(a\mid b\) et \(a\mid c\Rightarrow a\mid(pb+qc)\) | Un diviseur commun divise toute combinaison linéaire. |

> **Vigilance :** \(0\) est multiple de tout entier non nul, mais \(0\) ne divise aucun entier. La condition sur le diviseur n’est donc jamais décorative.

## 2. Division euclidienne dans ℤ

Pour tout \(a\in\mathbb Z\) et tout \(b\in\mathbb Z\setminus\{0\}\), il existe un unique couple \((q;r)\) tel que :

$$
a=bq+r\qquad\text{avec}\qquad 0\le r<|b|.
$$

\(q\) est le quotient et \(r\) le reste. Même si le dividende ou le diviseur est négatif, le reste reste positif ou nul. Si \(r=0\), alors \(b\mid a\).

> **Méthode :** après avoir proposé une écriture \(a=bq+r\), vérifiez toujours deux choses : l’égalité est correcte et \(0\le r<|b|\). Une égalité numérique seule ne suffit pas.

## 3. Congruence modulo n

Pour \(n\) entier naturel non nul, \(a\) est congru à \(b\) modulo \(n\) lorsque \(n\mid(a-b)\). On écrit :

$$
a\equiv b\pmod n.
$$

Deux entiers congrus modulo \(n\) ont le même reste dans la division par \(n\). Les congruences peuvent être additionnées, multipliées et élevées à une puissance : elles simplifient les calculs de restes.

| Action | Si \(a\equiv b\pmod n\) et \(c\equiv d\pmod n\) |
|---|---|
| Addition | \(a+c\equiv b+d\pmod n\) |
| Produit | \(ac\equiv bd\pmod n\) |
| Puissance naturelle | \(a^k\equiv b^k\pmod n\) |

## 4. Numération et critères

Dans une base \(b\ge2\), tout entier naturel non nul possède une écriture unique :

$$
x=\sum_{k=0}^{n}a_kb^k,\qquad 0\le a_k<b.
$$

Le support présente les bases binaire, décimale et hexadécimale. Les critères de divisibilité se déduisent des congruences des puissances de 10.

| Diviseur | Critère rappelé par le support |
|---|---|
| 2 | Le chiffre des unités est pair. |
| 3 ou 9 | La somme des chiffres est divisible par 3 ou 9. |
| 5 | Le chiffre des unités est 0 ou 5. |
| 10 | Le chiffre des unités est 0. |
| 11 | La différence alternée des sommes de chiffres est divisible par 11. |

## 5. Nombres premiers et décomposition

Un entier naturel \(p\) est premier lorsqu’il possède exactement deux diviseurs positifs : 1 et \(p\). Les nombres 0 et 1 ne sont pas premiers ; 2 est le seul nombre premier pair. Tout entier supérieur à 1 admet une décomposition unique en produit de facteurs premiers.

Si \(n=p_1^{\alpha_1}\cdots p_k^{\alpha_k}\), le nombre de ses diviseurs positifs est :

$$
(\alpha_1+1)(\alpha_2+1)\cdots(\alpha_k+1).
$$

> **Méthode :** pour prouver qu’un nombre est premier, il suffit de tester les nombres premiers inférieurs ou égaux à sa racine carrée. Pour compter des diviseurs, commencez par la décomposition en facteurs premiers.

## 6. Résoudre une question de reste

1. Traduire la question avec une division euclidienne ou une congruence.  
2. Réduire chaque nombre modulo le diviseur choisi.  
3. Effectuer les calculs dans le petit ensemble des restes.  
4. Ramener le résultat à un reste compris entre 0 et \(n-1\).  
5. Rédiger la conclusion avec le symbole de divisibilité ou de congruence adapté.

> **Synthèse :** une congruence n’est pas une égalité ordinaire : elle conserve l’information sur le reste. Elle devient particulièrement efficace pour les puissances, les critères de divisibilité et les problèmes de numération.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Leçon 3 : Divisibilité dans ℤ »**, Mathématiques, Terminale C, Côte d’Ivoire – École numérique. Intégré à Terminale C et D à la demande explicite de l’administrateur.`,
    exerciseA: [
      ["Que signifie b|a avec b différent de zéro ?", ["Il existe un entier k tel que a=kb", "a est toujours premier", "b est le reste de a"], ["Il existe un entier k tel que a=kb"], "C’est la définition de la divisibilité."],
      ["Quelle condition doit satisfaire le reste r de la division de a par b dans ℤ ?", ["0≤r<|b|", "r peut être négatif sans condition", "r=|b| obligatoirement"], ["0≤r<|b|"], "La division euclidienne dans les entiers conserve un reste positif ou nul, strictement inférieur à |b|."],
      ["Que signifie a≡b [n] ?", ["n divise a-b", "a=b dans tous les cas", "n divise a+b seulement"], ["n divise a-b"], "Deux entiers congrus ont une différence multiple de n."],
      ["Quel nombre n’est pas premier ?", ["1", "2", "7"], ["1"], "Le nombre 1 n’a qu’un seul diviseur positif ; il n’est donc pas premier."],
    ],
    exerciseB: [
      ["Quel outil permet de simplifier le calcul d’un grand reste de puissance ?", ["Les congruences modulo n", "Les coordonnées barycentriques", "La dérivation"], ["Les congruences modulo n"], "On remplace un nombre par un reste congru plus simple avant de calculer une puissance."],
      ["Quel critère teste la divisibilité par 9 ?", ["La somme des chiffres est divisible par 9", "Les deux derniers chiffres sont multiples de 9", "Le chiffre des unités est 9"], ["La somme des chiffres est divisible par 9"], "Le support dérive ce critère de 10ᵏ≡1 modulo 9."],
      ["Dans quelle base les seuls chiffres sont-ils 0 et 1 ?", ["La base 2", "La base 10", "La base 16"], ["La base 2"], "La numération binaire utilise les chiffres 0 et 1."],
      ["Si n=2²×3×7, combien n possède-t-il de diviseurs positifs ?", ["12", "6", "42"], ["12"], "Le nombre de diviseurs vaut (2+1)(1+1)(1+1)=12."],
    ],
  },
  {
    key: "space_geometry",
    title: "Géométrie analytique de l’espace",
    createWhenMissing: true,
    description: "Déterminer des plans et droites de l’espace, leurs équations, distances et positions relatives dans un repère orthonormé.",
    content: String.raw`# Géométrie analytique de l’espace

## Objectif

La géométrie analytique traduit les objets de l’espace en vecteurs, équations et systèmes. Une réponse rigoureuse doit toujours relier le calcul à la figure : **normal**, **direction**, **appartenance**, **intersection** ou **orthogonalité**.

## 1. Vecteur normal et plan

Un vecteur non nul \(\vec n\) est **normal** à un plan \((P)\) lorsqu’il est orthogonal à deux vecteurs directeurs non colinéaires de ce plan. Un point \(A\) et un vecteur normal non nul déterminent un unique plan.

Si \(A\in(P)\), alors :

$$
M\in(P)\Longleftrightarrow \overrightarrow{AM}\cdot\vec n=0.
$$

Deux plans de vecteurs normaux \(\vec n\) et \(\vec n'\) sont parallèles lorsque ces vecteurs sont colinéaires ; ils sont perpendiculaires lorsque leurs vecteurs normaux sont orthogonaux.

## 2. Équation cartésienne d’un plan

Dans un repère orthonormé, un plan de vecteur normal \((a;b;c)\) admet une équation :

$$
ax+by+cz+d=0,\qquad (a;b;c)\ne(0;0;0).
$$

Pour déterminer \(d\), on remplace \(x,y,z\) par les coordonnées d’un point connu du plan. Multiplier toute l’équation par un réel non nul donne la même géométrie.

> **Méthode : équation d’un plan**  
> 1. Déterminer un vecteur normal.  
> 2. Écrire \(ax+by+cz+d=0\).  
> 3. Utiliser un point du plan pour trouver \(d\).  
> 4. Vérifier l’égalité avec un autre point lorsque cela est possible.

## 3. Distance d’un point à un plan

Pour \(A(x_0;y_0;z_0)\) et le plan \(ax+by+cz+d=0\), le support donne :

$$
d(A;(P))=\frac{|ax_0+by_0+cz_0+d|}{\sqrt{a^2+b^2+c^2}}.
$$

La valeur absolue est indispensable : une distance est positive ou nulle. Le dénominateur correspond à la norme du vecteur normal.

## 4. Représentation paramétrique d’une droite

Une droite passant par \(A(x_0;y_0;z_0)\) et de vecteur directeur \((a;b;c)\) possède une représentation paramétrique :

$$
\begin{cases}
x=x_0+ta\\
y=y_0+tb\\
z=z_0+tc
\end{cases}
\quad\text{avec }t\in\mathbb R.
$$

Une même droite a plusieurs représentations possibles, car on peut choisir un autre point de la droite ou un vecteur directeur colinéaire.

## 5. Positions relatives

| Objets | Test principal | Conclusion possible |
|---|---|---|
| Deux droites | Colinéarité des vecteurs directeurs | Parallèles ; sinon sécantes ou non coplanaires. |
| Droite et plan | Produit scalaire direction–normale | Nul : parallèle ou incluse ; non nul : sécante. |
| Deux plans | Colinéarité des vecteurs normaux | Parallèles ou confondus ; sinon sécants. |

Une droite et un plan sont orthogonaux lorsque le vecteur directeur de la droite est colinéaire à un vecteur normal du plan. Deux droites non parallèles ne sont pas automatiquement sécantes dans l’espace : il faut résoudre le système ou étudier la coplanarité.

## 6. Trouver une intersection

Pour vérifier qu’une droite coupe un plan, on remplace les coordonnées paramétriques de la droite dans l’équation du plan. Une valeur de paramètre donne alors le point d’intersection. Pour deux plans, on résout simultanément leurs équations ; une variable libre peut fournir une représentation paramétrique de la droite d’intersection.

> **Vigilance :** ne concluez jamais « sécantes » uniquement parce que deux vecteurs directeurs ne sont pas colinéaires. Dans l’espace, des droites peuvent être non coplanaires.

> **Synthèse :** le vecteur normal organise l’étude des plans ; le vecteur directeur organise celle des droites. L’équation, le produit scalaire et la résolution d’un système transforment les relations géométriques en arguments vérifiables.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Leçon 5 : Géométrie analytique de l’espace »**, Mathématiques, Terminale C, Côte d’Ivoire – École numérique. Intégré à Terminale C et D à la demande explicite de l’administrateur.`,
    exerciseA: [
      ["Quel vecteur caractérise directement l’orientation d’un plan ?", ["Un vecteur normal", "Un vecteur tangent uniquement", "Un vecteur nul"], ["Un vecteur normal"], "Un vecteur normal est orthogonal à deux directions non colinéaires du plan."],
      ["Quelle forme est une équation cartésienne de plan ?", ["ax+by+cz+d=0", "ax²+by²=1", "x=x₀+ta uniquement"], ["ax+by+cz+d=0"], "Les coefficients a,b,c ne peuvent pas être tous nuls."],
      ["Quelle condition rend une droite parallèle à un plan ?", ["Son vecteur directeur est orthogonal au vecteur normal du plan", "Son vecteur directeur est égal au vecteur normal", "Elle possède une équation du second degré"], ["Son vecteur directeur est orthogonal au vecteur normal du plan"], "Un produit scalaire nul entre direction et normale caractérise le parallélisme ou l’inclusion."],
      ["Quelle valeur doit toujours être positive ou nulle dans la formule de distance point-plan ?", ["Le numérateur en valeur absolue", "Le coefficient d uniquement", "Le paramètre t"], ["Le numérateur en valeur absolue"], "La valeur absolue garantit que la distance ne soit pas négative."],
    ],
    exerciseB: [
      ["Que faut-il résoudre pour chercher l’intersection d’une droite paramétrique et d’un plan ?", ["L’équation du plan après remplacement des coordonnées de la droite", "Uniquement la dérivée de la droite", "Une congruence modulo n"], ["L’équation du plan après remplacement des coordonnées de la droite"], "Le remplacement laisse une équation portant sur le paramètre de la droite."],
      ["Deux plans dont les vecteurs normaux ne sont pas colinéaires sont…", ["Sécants", "Forcément confondus", "Toujours parallèles"], ["Sécants"], "Des normales non colinéaires excluent le parallélisme des plans."],
      ["Pourquoi deux droites de vecteurs directeurs non colinéaires ne sont-elles pas forcément sécantes ?", ["Elles peuvent être non coplanaires", "Elles sont toujours parallèles", "Le produit scalaire est toujours nul"], ["Elles peuvent être non coplanaires"], "L’espace admet des droites gauches, c’est-à-dire non coplanaires."],
      ["Quand une droite est-elle orthogonale à un plan ?", ["Quand son vecteur directeur est colinéaire à un vecteur normal du plan", "Quand elle est parallèle à une droite du plan", "Quand son paramètre vaut zéro"], ["Quand son vecteur directeur est colinéaire à un vecteur normal du plan"], "La direction de la droite doit suivre une normale du plan."],
    ],
  },
  {
    key: "conics",
    title: "Coniques",
    createWhenMissing: true,
    description: "Reconnaître et étudier paraboles, ellipses et hyperboles à partir de leurs foyers, directrices, excentricités et équations réduites.",
    content: String.raw`# Coniques

## Objectif

Les coniques regroupent la parabole, l’ellipse et l’hyperbole. Leur étude relie une définition géométrique — foyer, directrice, distance — à une équation réduite que l’on sait lire et exploiter.

## 1. Foyer, directrice et excentricité

Soient un point \(F\), une droite \((\mathcal D)\) ne contenant pas \(F\), et un réel strictement positif \(e\). La conique associée est l’ensemble des points \(M\) vérifiant :

$$
\frac{MF}{MH}=e,
$$

où \(H\) est le projeté orthogonal de \(M\) sur \((\mathcal D)\).

| Valeur de l’excentricité | Nature de la conique |
|---|---|
| \(e=1\) | Parabole |
| \(0<e<1\) | Ellipse |
| \(e>1\) | Hyperbole |

La droite qui passe par le foyer et est perpendiculaire à la directrice est un axe de symétrie, appelé **axe focal**.

## 2. Régionnement

Un point \(M\) est intérieur à la conique si \(MF<e\,MH\), extérieur si \(MF>e\,MH\). Le foyer est intérieur ; les points de la directrice sont extérieurs. Ces comparaisons expliquent la forme de la courbe avant même de tracer une équation.

## 3. Parabole

Dans un repère orthonormé bien choisi, une parabole de sommet \(S\) peut avoir l’équation réduite :

$$
y^2=2ax.
$$

Son axe focal est l’axe des abscisses ; son foyer et sa directrice se déduisent du paramètre \(a\). Lorsque l’axe est vertical, le support utilise la forme \(x^2=2ay\).

> **Méthode :** mettre l’équation sous une forme carrée. Une translation comme \((x-h)^2\) ou \((y-k)^2\) indique que le sommet n’est plus l’origine du repère initial.

## 4. Ellipse

Une ellipse centrée à l’origine, d’axe focal horizontal, a une équation réduite :

$$
\frac{x^2}{a^2}+\frac{y^2}{b^2}=1,
$$

avec \(a>b>0\) dans cette orientation. On a \(c^2=a^2-b^2\), les foyers sont \((c;0)\) et \((-c;0)\), et l’excentricité vaut \(e=c/a\). Si le plus grand dénominateur est sous \(y^2\), l’axe focal est vertical.

| Élément à lire | Information |
|---|---|
| Centre | Point autour duquel les carrés sont écrits. |
| Grand axe | Direction du plus grand demi-axe. |
| Foyers | Placés sur l’axe focal. |
| Directrices | Déduites de \(a^2/c\) selon l’orientation. |

## 5. Hyperbole

Pour une hyperbole d’axe focal horizontal :

$$
\frac{x^2}{a^2}-\frac{y^2}{b^2}=1.
$$

Ici \(c^2=a^2+b^2\) et \(e=c/a>1\). Les asymptotes, visibles comme les directions vers lesquelles les branches se rapprochent, sont :

$$
y=\frac ba x\qquad\text{et}\qquad y=-\frac ba x
$$

dans le repère centré. Une translation du centre doit être prise en compte avant de tracer les asymptotes dans le repère initial.

## 6. Démarche complète

1. Mettre l’équation sous une forme réduite, souvent en complétant un carré.  
2. Identifier la nature grâce aux signes : somme pour une ellipse, différence pour une hyperbole, carré isolé pour une parabole.  
3. Lire le centre ou le sommet et l’orientation de l’axe focal.  
4. Calculer les paramètres utiles : \(a\), \(b\), puis \(c\) et \(e\).  
5. Déterminer foyers, sommets, directrices et asymptotes lorsque nécessaires.  
6. Vérifier que les coordonnées sont exprimées dans le bon repère après toute translation.

> **Synthèse :** l’excentricité classe la conique ; l’équation réduite fournit ses éléments caractéristiques. Avant tout calcul, observez le signe entre les deux termes quadratiques et le repère dans lequel vous travaillez.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Leçon 7 : Coniques »**, Mathématiques, Terminale C, Côte d’Ivoire – École numérique. Intégré à Terminale C et D à la demande explicite de l’administrateur.`,
    exerciseA: [
      ["Quelle conique correspond à une excentricité e=1 ?", ["Une parabole", "Une ellipse", "Une hyperbole"], ["Une parabole"], "Le support classe la parabole par l’excentricité égale à 1."],
      ["Quelle condition caractérise une ellipse ?", ["0<e<1", "e=1", "e>1"], ["0<e<1"], "Une excentricité strictement comprise entre 0 et 1 correspond à une ellipse."],
      ["Quelle équation est de type hyperbole centrée à l’origine ?", ["x²/a²-y²/b²=1", "x²/a²+y²/b²=1", "y²=2ax"], ["x²/a²-y²/b²=1"], "La différence de deux carrés normalisés caractérise l’hyperbole dans cette orientation."],
      ["Quel objet est utilisé avec le foyer pour définir une conique ?", ["Une directrice", "Une tangente uniquement", "Une primitive"], ["Une directrice"], "La définition compare la distance au foyer à la distance à la directrice."],
    ],
    exerciseB: [
      ["Dans une ellipse d’axe focal horizontal, quelle relation relie a, b et c ?", ["c²=a²-b²", "c²=a²+b²", "c=a+b"], ["c²=a²-b²"], "La demi-distance focale d’une ellipse est calculée par cette différence positive."],
      ["Dans une hyperbole d’axe focal horizontal, quelle relation est correcte ?", ["c²=a²+b²", "c²=a²-b²", "c=0"], ["c²=a²+b²"], "La demi-distance focale de l’hyperbole provient de la somme des carrés."],
      ["Quel signe entre les deux termes quadratiques aide à reconnaître une ellipse ?", ["Le signe +", "Le signe -", "Aucun signe n’est utile"], ["Le signe +"], "Une ellipse réduite s’écrit avec une somme de deux carrés normalisés."],
      ["Que faut-il faire avant de lire les foyers d’une conique translatée ?", ["Identifier le centre ou le sommet dans le repère adapté", "Toujours prendre l’origine O", "Supprimer les termes linéaires sans calcul"], ["Identifier le centre ou le sommet dans le repère adapté"], "Les coordonnées des éléments caractéristiques dépendent du repère après translation."],
    ],
  },
];

const questionSql = (exerciseId, rows) => `insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values ${rows.map(([prompt, options, correct, explanation], index) => `(${exerciseId},'single_choice',${sqlText(prompt)},${jsonArray(options)},${jsonArray(correct)},${sqlText(explanation)},${(index + 1) * 10})`).join(",")};`;

const quizSql = (quizId, lesson, label, rows, displayOrder) => {
  const questions = rows.map(([question, , , explanation], index) => `(${quizId},${sqlText(question)},${sqlText(explanation)},'single_choice',${(index + 1) * 10},1,true)`).join(",");
  const answers = rows.flatMap(([, options, correct], index) => options.map((option, optionIndex) => `(${(index + 1) * 10},${sqlText(option)},${correct.includes(option)},${(optionIndex + 1) * 10})`)).join(",");
  return `insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active,is_test_data) values (target.subject_id,target.level_id,target.series_id,target.offering_id,target_chapter_id,target_lesson_id,${sqlText(`Quiz ${label} — ${lesson.title}`)},${sqlText(`Vérifie les méthodes et notions essentielles de la leçon ${lesson.title}.`)},'medium',12,${displayOrder},false,false,false) returning id into ${quizId}; with inserted_questions as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values ${questions} returning id,display_order) insert into public.quiz_answers (question_id,answer,is_correct,display_order) select question_row.id,answer_row.answer,answer_row.is_correct,answer_row.display_order from inserted_questions question_row join (values ${answers}) as answer_row(question_order,answer,is_correct,display_order) on answer_row.question_order=question_row.display_order;`;
};

const lessonSql = (lesson, index) => {
  const orderBase = (index + 1) * 100;
  const exerciseA = `exercise_a_${index}`;
  const exerciseB = `exercise_b_${index}`;
  const quizA = `quiz_a_${index}`;
  const quizB = `quiz_b_${index}`;
  return `
    target_chapter_id := null;
    target_lesson_id := null;
    select chapter.id into target_chapter_id from public.chapters chapter where chapter.subject_offering_id=target.offering_id and not chapter.is_test_data order by chapter.display_order limit 1;
    if target_chapter_id is null then raise exception 'Le chapitre Mathématiques Terminale % est introuvable.', target.series_name; end if;
    if not exists (select 1 from public.lessons lesson where lesson.chapter_id=target_chapter_id and lower(lesson.title)=lower(${sqlText(lesson.title)}) and not lesson.is_test_data) then
      ${lesson.createWhenMissing ? `insert into public.lessons (chapter_id,title,description,content,display_order,is_active,is_test_data) values (target_chapter_id,${sqlText(lesson.title)},${sqlText(lesson.description)},'',coalesce((select max(existing_lesson.display_order)+10 from public.lessons existing_lesson where existing_lesson.chapter_id=target_chapter_id),10),false,false);` : `raise exception 'La leçon existante % est requise pour la Terminale %.', ${sqlText(lesson.title)}, target.series_name;`}
    end if;
    select lesson.id into target_lesson_id from public.lessons lesson where lesson.chapter_id=target_chapter_id and lower(lesson.title)=lower(${sqlText(lesson.title)}) and not lesson.is_test_data limit 1;
    if target_lesson_id is null then raise exception 'La leçon % est introuvable après contrôle de structure.', ${sqlText(lesson.title)}; end if;
    if exists (select 1 from public.lessons lesson where lesson.id=target_lesson_id and coalesce(btrim(lesson.content),'')<>'') then raise exception 'La leçon % de Terminale % contient déjà un cours : écrasement interdit.', ${sqlText(lesson.title)}, target.series_name; end if;
    if exists (select 1 from public.exercises exercise where exercise.lesson_id=target_lesson_id and not exercise.is_test_data) or exists (select 1 from public.quizzes quiz where quiz.lesson_id=target_lesson_id and not quiz.is_test_data) then raise exception 'La leçon % de Terminale % possède déjà des évaluations : duplication interdite.', ${sqlText(lesson.title)}, target.series_name; end if;
    update public.lessons set description=${sqlText(lesson.description)},content=${sqlText(lesson.content)},is_active=false,is_test_data=false where id=target_lesson_id and coalesce(btrim(content),'')='';
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order,is_test_data) values (target.subject_id,target.level_id,target.series_id,target_chapter_id,target_lesson_id,${sqlText(`Exercice 1 — Repères fondamentaux : ${lesson.title}`)},${sqlText("Réponds aux quatre questions en citant la définition, la propriété ou la méthode utilisée.")},${sqlText("La correction explique la notion utile pour chaque réponse.")},'single_choice','easy',${sqlText("## Consigne\n\nLis chaque proposition et choisis celle qui respecte la leçon.")},${sqlText("## Correction\n\nAppuie-toi sur les définitions et les encadrés de vigilance du cours.")},false,false,18,10,false) returning id into ${exerciseA};
    ${questionSql(exerciseA, lesson.exerciseA)}
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order,is_test_data) values (target.subject_id,target.level_id,target.series_id,target_chapter_id,target_lesson_id,${sqlText(`Exercice 2 — Méthodes et raisonnement : ${lesson.title}`)},${sqlText("Réinvestis les outils du cours et justifie ton choix à l’aide de la correction.")},${sqlText("La correction relie chaque réponse à une démarche de résolution rigoureuse.")},'single_choice','medium',${sqlText("## Consigne\n\nAnalyse la situation, repère la méthode pertinente puis choisis la réponse justifiée.")},${sqlText("## Correction\n\nVérifie les hypothèses, le domaine et la conclusion géométrique ou algébrique.")},false,false,20,20,false) returning id into ${exerciseB};
    ${questionSql(exerciseB, lesson.exerciseB)}
    ${quizSql(quizA, lesson, "A — Notions", lesson.exerciseA, 10)}
    ${quizSql(quizB, lesson, "B — Méthodes", lesson.exerciseB, 20)}
  `;
};

const migration = `-- Mathématiques Terminale C/D : cinq leçons sources Terminale C, brouillons uniquement.
-- Les structures manquantes sont créées seulement après la dernière leçon du chapitre concerné.
do $math_cd_five_lessons$
declare
  target record;
  target_chapter_id uuid;
  target_lesson_id uuid;
  offering_count integer;
  exercise_a_0 uuid; exercise_b_0 uuid; quiz_a_0 uuid; quiz_b_0 uuid;
  exercise_a_1 uuid; exercise_b_1 uuid; quiz_a_1 uuid; quiz_b_1 uuid;
  exercise_a_2 uuid; exercise_b_2 uuid; quiz_a_2 uuid; quiz_b_2 uuid;
  exercise_a_3 uuid; exercise_b_3 uuid; quiz_a_3 uuid; quiz_b_3 uuid;
  exercise_a_4 uuid; exercise_b_4 uuid; quiz_a_4 uuid; quiz_b_4 uuid;
begin
  select count(*) into offering_count
  from public.course_subject_offerings offering
  join public.subjects subject on subject.id=offering.subject_id
  join public.levels level on level.id=offering.level_id
  join public.series series on series.id=offering.series_id
  where subject.name='Mathématiques' and level.name='Terminale' and series.name in ('C','D') and not offering.is_test_data;
  if offering_count<>2 then raise exception 'Les deux offres officielles Mathématiques Terminale C et D sont requises.'; end if;

  for target in
    select offering.id as offering_id,offering.subject_id,offering.level_id,offering.series_id,series.name as series_name
    from public.course_subject_offerings offering
    join public.subjects subject on subject.id=offering.subject_id
    join public.levels level on level.id=offering.level_id
    join public.series series on series.id=offering.series_id
    where subject.name='Mathématiques' and level.name='Terminale' and series.name in ('C','D') and not offering.is_test_data
    order by series.name
  loop
    ${lessons.map(lessonSql).join("\n")}
  end loop;
end $math_cd_five_lessons$;`;

writeFileSync(migrationPath, migration, "utf8");
writeFileSync(payloadPath, `${JSON.stringify({ project_id: "nnshioowwniursnozicg", name: "mathematics_terminal_cd_five_lessons_drafts", query: migration }, null, 2)}\n`, "utf8");
console.log(migrationPath);
console.log(payloadPath);
