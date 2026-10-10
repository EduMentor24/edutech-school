# Notes d’analyse — Mathématiques Terminale

## Lot en cours

| PDF | Niveau et série indiqués | Leçon | État de lecture |
|---|---|---|---|
| `TAMathsleçon08PrimitivesetCalculintegral.pdf` | Terminale A | Leçon 8 : Primitives et calcul intégral | Lecture complète effectuée |
| `TA-Maths-06StatistiquesD200523.pdf` | Terminale A | Leçon 6 : Statistique à deux variables | Lecture complète effectuée |
| `TC-Maths-13NbrescomplexesetgéométrieduplanD200424.pdf` | Terminale C | Leçon 13 : Nombres complexes et géométrie du plan | À lire intégralement |

## 1. Primitives et calcul intégral

Le document présente successivement la définition d’une primitive sur un intervalle, la famille des primitives obtenue par ajout d’une constante, puis l’unicité de la primitive prenant une valeur prescrite. Il fournit les primitives usuelles de fonctions constantes et puissances, avec leurs intervalles de validité.

Les méthodes explicitement enseignées sont la linéarité pour une somme et un multiple, la reconnaissance de la forme \(u' u^m\) avec \(m \ne -1\), du quotient \(u'/u\) selon le signe de \(u\), et de la forme \(u'e^u\). Les exemples de référence portent notamment sur \(2x(x^2+1)^8\), des quotients issus d’un trinôme positif ou d’une expression négative, ainsi que des expressions exponentielles composées.

La partie intégrale définit \(\int_a^b f(x)\,dx = F(b)-F(a)\), précise que la variable d’intégration est muette, et interprète l’intégrale d’une fonction continue positive comme une aire. Elle établit aussi les formules d’aire sous une courbe et entre deux courbes, avec exigence de vérifier la fonction supérieure. La situation complexe calcule l’aire d’une terrasse formée d’un rectangle et de la région sous la parabole \(y=-x^2+4\) entre \(-2\) et \(2\). Les exercices finaux mobilisent vrai/faux, détermination de primitives et une aire entre une courbe et une asymptote.

## 2. Statistique à deux variables

Le document introduit une série statistique double \((X,Y)\), les effectifs \(n_{ij}\), le tableau de contingence, le nuage de points et le point moyen. Le tableau de séries marginales et les fréquences marginales sont explicitement signalés **« Série A1 seulement »**.

L’ajustement linéaire par la méthode de Mayer est commun aux séries Terminale A concernées : tri par valeurs croissantes de \(X\), partage en deux sous-nuages, calcul de leurs points moyens \(G_1\) et \(G_2\), puis équation de la droite \((G_1G_2)\). Le document rappelle que cette droite passe par le point moyen global. L’estimation s’effectue graphiquement ou par substitution dans l’équation obtenue.

Les moindres carrés sont réservés à **la série A1**. Cette section traite la covariance, le coefficient de corrélation \(r\), les droites de régression de \(Y\) en \(X\) et de \(X\) en \(Y\), ainsi que la lecture de la force de corrélation. Les formules de référence sont :

$$
\operatorname{Cov}(X,Y)=\frac{1}{n}\sum x_i y_i-\overline X\,\overline Y
$$

$$
r=\frac{\operatorname{Cov}(X,Y)}{\sqrt{V(X)}\sqrt{V(Y)}}
$$

$$
y=ax+b,\quad a=\frac{\operatorname{Cov}(X,Y)}{V(X)},\quad b=\overline Y-a\overline X
$$

$$
x=a'y+b',\quad a'=\frac{\operatorname{Cov}(X,Y)}{V(Y)},\quad b'=\overline X-a'\overline Y
$$

La situation d’apprentissage et la situation complexe concernent le lien entre pluviométrie et température, puis l’estimation de la pluviométrie d’octobre 2019 à partir d’une température moyenne donnée. Les cours futurs devront signaler sans ambiguïté les parties A1 uniquement et ne pas attribuer les moindres carrés à A2.

## Règles de création à maintenir

Les contenus ne seront créés que dans les leçons existantes, encore vides et réellement rattachées à la structure Terminale correspondante. Chaque ressource restera en brouillon, inactive et non publiée. Les exercices corrigés et les quiz seront créés dans leurs modules séparés, sans écraser de contenu ni produire de doublon.

## 3. Nombres complexes et géométrie du plan — Terminale C

Le fichier local transmis est bien identifié comme un PDF de 17 pages, mais il est techniquement tronqué : il ne possède ni table de références ni dictionnaire de fin lisibles. La lecture directe et la reconstruction non destructive ont échoué. Aucune donnée du fichier original n’a été modifiée.

Pour ne pas inventer de contenu, les axes déjà corroborés par les séquences pédagogiques publiques associées à la même leçon sont les suivants :

| Partie identifiée | Contenu confirmé |
|---|---|
| Lignes de niveau et nombres complexes | Partie annoncée dans la progression, à confirmer sur le support complet avant rédaction détaillée. |
| Configurations du plan et nombres complexes | Caractérisations complexes de l’alignement, du parallélisme, de la perpendicularité, des triangles particuliers et de la cocyclicité. |
| Transformations du plan et nombres complexes | Écritures complexes des symétries, translation, homothétie et rotation ; reconnaissance d’une transformation d’écriture \(z'=az+b\). |

Les formules confirmées pour les configurations incluent notamment :

$$
\frac{z_C-z_A}{z_B-z_A}\in\mathbb{R}^*\quad\text{pour l’alignement de }A,B,C
$$

$$
\frac{z_D-z_C}{z_B-z_A}\in i\mathbb{R}^*\quad\text{pour la perpendicularité de }(AB)\text{ et }(CD)
$$

$$
\frac{z_C-z_A}{z_B-z_A}=e^{\pm i\alpha}\quad\text{pour un triangle isocèle en }A\text{ d’angle }\alpha
$$

Les écritures de transformations relevées sont :

$$
z'=z+b,\qquad z'-\omega=k(z-\omega),\qquad z'-\omega=e^{i\theta}(z-\omega)
$$

ainsi que \(z'=\overline z\) pour la symétrie d’axe réel, \(z'=-\overline z\) pour la symétrie d’axe imaginaire et \(z'-\omega=-(z-\omega)\) pour la symétrie centrale. Dans une écriture \(z'=az+b\), les cas translation, homothétie et rotation ainsi que le centre \(\omega=b/(1-a)\) ont été confirmés.

L’intégralité de la première partie doit toutefois être consultée dans un exemplaire complet du PDF avant de créer le cours, les exercices et le quiz, afin de préserver la fidélité absolue demandée.

### PDF de remplacement effectivement reçu : « TCMathsleçon09Nombrescomplexes.pdf »

Le nouveau document est intégralement lisible et compte 25 pages. Il est distinct du PDF corrompu : son en-tête porte **« Leçon 6 : Nombres complexes »**, avec le thème **Calculs algébriques**, et non « Nombres complexes et géométrie du plan ».

Le contenu intégralement relevé se répartit comme suit :

| Partie | Notions explicitement couvertes |
|---|---|
| Étude algébrique | Forme algébrique \(a+ib\), parties réelle et imaginaire, calculs, égalité, puissances de \(i\). |
| Conjugué et module | Définition, propriétés, conditions réel / imaginaire pur, module et inégalité triangulaire. |
| Représentation géométrique | Plan complexe, affixe d’un point et d’un vecteur, distance et interprétation géométrique du module. |
| Formes trigonométrique et exponentielle | Argument, argument principal, passage entre formes, produit, quotient et puissance. |
| Formule de Moivre et Euler | Puissances, expressions trigonométriques et linéarisation. |
| Équations dans \(\mathbb C\) | Racines carrées, équation du second degré, racines \(n\)-ièmes et racines de l’unité. |
| Situation complexe | Démonstration selon laquelle la puissance d’une somme de deux carrés reste une somme de deux carrés. |

Les méthodes centrales à conserver dans le cours sont les suivantes :

$$
z=a+ib,\qquad \operatorname{Re}(z)=a,\qquad \operatorname{Im}(z)=b,\qquad i^2=-1
$$

$$
\overline z=a-ib,\qquad z\overline z=|z|^2=a^2+b^2
$$

$$
z=r(\cos\theta+i\sin\theta)=re^{i\theta}
$$

$$
(\cos\theta+i\sin\theta)^n=\cos(n\theta)+i\sin(n\theta)
$$

$$
z_k=\sqrt[n]{R}\,e^{i\frac{\theta+2k\pi}{n}},\qquad k\in\{0,\dots,n-1\}
$$

Le support contient aussi une méthode explicite pour les racines carrées : poser \(z=x+iy\), développer \(z^2\), puis résoudre simultanément les relations sur \(x^2+y^2\), \(x^2-y^2\) et \(2xy\). Il introduit la formule quadratique dans \(\mathbb C\), les racines \(n\)-ièmes comme sommets d’un polygone régulier et les racines de l’unité.

## 4. Correspondances pédagogiques Supabase vérifiées le 20 août 2026

| Ressource source | Rattachement existant confirmé | Identifiant de leçon | État initial | Décision |
|---|---|---|---|---|
| Primitives et calcul intégral, Terminale A | A1 — « 3. Primitives et calcul intégral » | `2444e45b-60dd-4101-a9ce-0a11c3aac3d5` | Vide, inactive | Peut recevoir un brouillon après validation du lot. |
| Primitives et calcul intégral, Terminale A | A2 — aucune leçon correspondante dans la progression existante | — | — | Aucun cours A2 ne sera créé ni rattaché par supposition. |
| Statistique à deux variables, Terminale A | A1 — « 6. Statistique à deux variables » | `fa4221bc-9fa9-4912-b6b1-0c8ef3f33698` | Vide, inactive | Peut recevoir un brouillon, avec les sections A1 seulement. |
| Statistique à deux variables, Terminale A | A2 — « 5. Statistique à deux variables » | `80d19d0b-9e2a-46a5-a03c-4e417fa3e401` | Vide, inactive | Peut recevoir un brouillon sans les sections réservées à A1. |
| Nombres complexes et géométrie du plan, Terminale C | C — « 7. Nombres complexes et géométrie du plan » | `bdd0e484-d52f-4f8e-b979-a7e2c729656e` | Vide, inactive | Attendre le PDF source lisible avant toute création. |
| Nombres complexes, Terminale C | C — « 6. Nombres complexes » | `c79206ee-b079-46cb-8863-9229cf2364f7` | Vide, inactive | Correspondance exacte du PDF de remplacement ; prête pour un brouillon après confirmation de périmètre. |
