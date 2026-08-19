# Notes d’analyse — PDF Mathématiques Terminale, lot suivant

## Leçon 4 fournie — Dérivabilité et étude de fonctions

**Source :** `TCMathsleçon04DERIVABILITEETETUDEDEFONCTIONS.pdf`  
**Entête du document :** Terminale C, thème « Fonctions numériques », leçon 3, durée 10 heures.

Le PDF aborde la dérivabilité à gauche et à droite par le taux d’accroissement, l’égalité des deux nombres dérivés comme critère de dérivabilité, les demi-tangentes, les demi-tangentes verticales, la dérivabilité sur les intervalles ouverts et fermés, la dérivée d’une composée et les règles de dérivation des puissances, racines et fonctions trigonométriques composées.

Les développements suivants sont aussi présents : dérivée d’une bijection réciproque, dérivées successives, inégalités des accroissements finis, étude complète de fonctions, continuité, asymptotes, position relative, variations, tangentes, périodicité, parité, recherche d’extrema et bijections.

Les relations de référence relevées incluent :

$$
f'_g(x_0)=\lim_{x\to x_0^-}\frac{f(x)-f(x_0)}{x-x_0},\qquad
f'_d(x_0)=\lim_{x\to x_0^+}\frac{f(x)-f(x_0)}{x-x_0}.
$$

$$
(f\circ g)'(x)=g'(x)f'[g(x)],\qquad
(f^{-1})'(y_0)=\frac{1}{f'(x_0)}\ \text{si }f(x_0)=y_0\text{ et }f'(x_0)\ne0.
$$

$$
m(b-a)\le f(b)-f(a)\le M(b-a)\quad\text{si }m\le f'\le M\text{ sur }[a;b].
$$

La situation complexe porte sur l’optimisation d’un bénéfice d’usine modélisé par \(B(x)=-\frac13x^3+9x+2\) sur \([1;5]\), dont le maximum est obtenu pour \(x=3\), soit 3 000 sachets dans le contexte décrit.

## Leçon 5 fournie — Géométrie analytique de l’espace

**Source :** `TCMathsleçon05Géometrieanalytiquedelespace.pdf`  
**Entête du document :** Terminale C, thème « Géométrie de l’espace », leçon 6, durée 10 heures.

Les pages analysées présentent le vecteur normal à un plan, le critère d’appartenance d’un point à un plan, le parallélisme et la perpendicularité de deux plans, l’équation cartésienne d’un plan, la distance d’un point à un plan, une représentation paramétrique de droite, puis les positions relatives de deux droites et les premiers critères de position relative entre une droite et un plan.

Les formules de référence déjà relevées sont :

$$
P: ax+by+cz+d=0\quad\text{avec }(a,b,c)\ne(0,0,0),\qquad \vec n=(a,b,c).
$$

$$
d(A;P)=\frac{|ax_0+by_0+cz_0+d|}{\sqrt{a^2+b^2+c^2}}.
$$

$$
\begin{cases}x=x_0+ta\\y=y_0+tb\\z=z_0+tc\end{cases}\quad(t\in\mathbb R)
$$

Les droites sont parallèles lorsque leurs vecteurs directeurs sont colinéaires ; elles sont orthogonales lorsque leur produit scalaire est nul. Les plans sont parallèles si leurs vecteurs normaux sont colinéaires et perpendiculaires si leurs vecteurs normaux sont orthogonaux. La situation d’apprentissage demande de stabiliser des murs de maquette par des positions parallèles ou perpendiculaires.

La fin du PDF complète les positions relatives droite-plan et plan-plan, la détermination d’équations de plans à partir de points, de vecteurs directeurs ou de vecteurs normaux, ainsi que les plans contenant une droite et perpendiculaires à un plan donné. Les exercices d’approfondissement mobilisent l’intersection de deux plans, la paramétrisation de leur droite d’intersection, les conditions de sécance et l’orthogonalité entre droites.

## Leçon 6 fournie — Primitives

**Source :** `TCMathsleçon06PRIMITIVES.pdf`  
**Entête du document :** niveau TC, thème « Fonctions numériques », leçon 4, durée 6 heures.

Le document définit une primitive \(F\) de \(f\) sur un intervalle \(I\) par \(F'=f\). Il établit qu’une fonction continue sur un intervalle y admet une primitive, que toutes les primitives diffèrent par une constante, et qu’une condition initiale \(F(x_0)=y_0\) détermine une primitive unique.

Il fournit des primitives usuelles, les opérations sur les primitives et la recherche de primitives par composition, notamment les formes \(u'u^r\), \(u'/u^r\), \(u'/\sqrt u\), \(u'\cos u\) et \(u'\sin u\), sous les conditions de validité indiquées.

Les relations essentielles relevées sont :

$$
F'(x)=f(x),\qquad \mathcal P_f=\{F+c\mid c\in\mathbb R\}.
$$

$$
\int x^r\,dx=\frac{x^{r+1}}{r+1}+c\quad(r\ne-1),\qquad
\int \frac{u'}{u^r}\,dx=-\frac{1}{(r-1)u^{r-1}}+c\quad(r\ne1).
$$

La situation complexe construit une consommation \(C(v)\) à partir de \(C'(v)=-300/v^2+1/3\), utilise la donnée \(C(60)=25\), puis minimise un coût total de transport à partir de l’étude de la dérivée.

Les dernières pages ajoutent les exercices de détermination de primitives composées, les décompositions de fonctions rationnelles, la vérification directe par dérivation, les primitives trigonométriques et les exercices de renforcement. Elles prolongent la situation complexe par l’étude de \(P(v)=4050000/v+3000v\), qui conduit à une vitesse minimisant le coût d’environ \(37\) km/h dans le contexte du document.
