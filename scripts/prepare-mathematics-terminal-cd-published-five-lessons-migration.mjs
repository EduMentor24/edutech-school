import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const migrationPath = resolve(root, "supabase/migrations/20260824_mathematics_terminal_cd_published_five_lessons.sql");
const payloadPath = resolve(root, "supabase/migrations/20260824_mathematics_terminal_cd_published_five_lessons.apply.json");

const sqlText = (value) => {
  const tag = "$math_cd_published$";
  const normalized = String(value)
    .split(String.fromCharCode(92, 92))
    .join(String.fromCharCode(92));
  if (normalized.includes(tag)) throw new Error("Délimiteur SQL interdit dans le contenu Mathématiques.");
  return `${tag}${normalized}${tag}`;
};

const jsonArray = (values) => `jsonb_build_array(${values.map(sqlText).join(",")})`;

const lessons = [
  {
    key: "logarithms",
    targets: { C: "3. Fonction logarithme népérien", D: "5. Fonctions logarithmes" },
    createWhenMissing: false,
    description: "Maîtriser le logarithme népérien, son domaine, ses propriétés, ses équations, ses inéquations et ses limites.",
    content: String.raw`# Fonctions logarithmes

## Objectif

Le logarithme népérien est une fonction de référence sur les nombres **strictement positifs**. L’essentiel est de ne jamais commencer un calcul avant d’avoir identifié le domaine : c’est lui qui autorise ou interdit les transformations algébriques.

## 1. Définition et domaine

La fonction \\(\ln\\) est définie sur \\(]0;+\infty[\\). Elle est la réciproque de la fonction exponentielle :

$$
\ln(x)=y \Longleftrightarrow x=e^y,\qquad x>0.
$$

On retient \\(\ln(1)=0\\), \\(\ln(e)=1\\) et \\(\ln(e^u)=u\\). Une expression comme \\(\ln(u(x))\\) exige toujours \\(u(x)>0\\).

> **Méthode — domaine :** repérer chaque logarithme, imposer que son argument soit strictement positif, puis résoudre toutes les conditions simultanément.

## 2. Propriétés algébriques

Lorsque les arguments sont positifs :

| Expression | Transformation correcte |
|---|---|
| \\(\ln(ab)\\) | \\(\ln a+\ln b\\) |
| \\(\ln(a/b)\\) | \\(\ln a-\ln b\\) |
| \\(\ln(a^r)\\) | \\(r\ln a\\) |

Ces règles ne permettent pas de transformer \\(\ln(a+b)\\) en somme de logarithmes. Cette erreur fréquente modifie entièrement l’expression.

## 3. Variations, dérivée et limites

La fonction \\(\ln\\) est strictement croissante sur son domaine et \\(\ln'(x)=1/x\\). Ainsi, comparer deux logarithmes revient à comparer leurs arguments positifs. Les limites utiles sont :

$$
\lim_{x\to0^+}\ln x=-\infty,\qquad \lim_{x\to+\infty}\ln x=+\infty.
$$

Pour une composée, \\((\ln u(x))'=u'(x)/u(x)\\), après avoir vérifié \\(u(x)>0\\). Les primitives de la forme \\(u'(x)/u(x)\\) se reconnaissent donc naturellement.

## 4. Équations et inéquations

Parce que \\(\ln\\) est injective sur \\(]0;+\infty[\\), \\(\ln u=\ln v\\) équivaut à \\(u=v\\), sous les conditions \\(u>0\\) et \\(v>0\\). De même, la croissance conserve le sens : \\(\ln u\le\ln v\\) équivaut à \\(u\le v\\) si les deux arguments sont positifs.

> **Synthèse :** vérifier le domaine, simplifier avec les propriétés autorisées, utiliser la croissance pour comparer, puis contrôler la solution dans le domaine initial.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Leçon 05 : Fonction logarithme népérien »**, Mathématiques, Terminale C, Côte d’Ivoire – École numérique. Adapté et publié pour Terminale C et D à la demande explicite de l’administrateur.`,
    a: [
      ["Quel est le domaine de définition de ln(x) ?", ["]0;+∞[", "ℝ", "[0;+∞["], ["]0;+∞["], "Le logarithme népérien n’est défini que pour un argument strictement positif."],
      ["Quelle égalité est correcte pour a,b>0 ?", ["ln(ab)=ln(a)+ln(b)", "ln(a+b)=ln(a)+ln(b)", "ln(a/b)=ln(a)ln(b)"], ["ln(ab)=ln(a)+ln(b)"], "Le produit devient une somme de logarithmes."],
      ["Pourquoi ln(u)=ln(v) permet-il d’écrire u=v ?", ["ln est injective sur son domaine", "ln est constante", "u et v sont toujours égaux"], ["ln est injective sur son domaine"], "La stricte croissance rend ln injective sur ]0;+∞[."],
      ["Quelle condition précède la dérivation de ln(u(x)) ?", ["u(x)>0", "u(x)=0", "u'(x)=0"], ["u(x)>0"], "La composée logarithmique doit être définie avant d’être dérivée."],
    ],
    b: [
      ["Quelle est la limite de ln(x) lorsque x tend vers 0 par valeurs positives ?", ["-∞", "0", "+∞"], ["-∞"], "La courbe de ln plonge vers -∞ au voisinage de 0 à droite."],
      ["Si 0<u≤v, quelle comparaison est correcte ?", ["ln(u)≤ln(v)", "ln(u)≥ln(v)", "Aucune comparaison n’est possible"], ["ln(u)≤ln(v)"], "La fonction ln est strictement croissante."],
      ["Quelle est la dérivée de ln(u(x)) ?", ["u'(x)/u(x)", "u(x)/u'(x)", "ln(u'(x))"], ["u'(x)/u(x)"], "C’est la règle de dérivation d’une composée logarithmique."],
      ["Quelle expression ne se simplifie pas avec une règle de logarithme ?", ["ln(a+b)", "ln(ab)", "ln(a/b)"], ["ln(a+b)"], "Il n’existe pas de règle de somme pour ln(a+b)."],
    ],
  },
  {
    key: "pgcd",
    targets: { C: "PPCM et PGCD de deux entiers relatifs", D: "PPCM et PGCD de deux entiers relatifs" },
    createWhenMissing: true,
    description: "Utiliser le PGCD, le PPCM, Bézout, Gauss et les équations diophantiennes pour résoudre des problèmes d’arithmétique.",
    content: String.raw`# PPCM et PGCD de deux entiers relatifs

## Objectif

Le **PGCD** mesure le plus grand diviseur commun de deux entiers non tous nuls ; le **PPCM** mesure leur plus petit multiple commun strictement positif. Ils structurent l’algorithme d’Euclide, l’identité de Bézout et la résolution d’équations à inconnues entières.

## 1. Déterminer PGCD et PPCM

Pour deux entiers naturels non nuls \\(a\\) et \\(b\\), l’algorithme d’Euclide remplace le plus grand nombre par le reste de sa division par l’autre. Le dernier reste non nul est le PGCD.

$$
a=bq+r\quad\Longrightarrow\quad \operatorname{PGCD}(a,b)=\operatorname{PGCD}(b,r).
$$

Avec les valeurs absolues, le lien fondamental est :

$$
\operatorname{PGCD}(a,b)\times\operatorname{PPCM}(a,b)=|ab|.
$$

> **Méthode :** obtenir le PGCD par Euclide ou décomposition en facteurs premiers ; n’utiliser ensuite la formule du PPCM qu’avec les valeurs absolues et un PGCD déjà déterminé.

## 2. Bézout et nombres premiers entre eux

Deux entiers sont premiers entre eux lorsque leur PGCD vaut 1. Le théorème de Bézout affirme alors qu’il existe des entiers \\(u,v\\) tels que \\(au+bv=1\\). La remontée des divisions d’Euclide permet de construire ces coefficients.

Cette identité ne sert pas seulement à constater une propriété : elle fournit une combinaison linéaire utilisable dans les congruences et les équations diophantiennes.

## 3. Théorème de Gauss

Si \\(a\\) divise \\(bc\\) et si \\(a\\) est premier avec \\(b\\), alors \\(a\\) divise \\(c\\). La condition « premier avec » est essentielle ; sans elle, la conclusion peut être fausse.

## 4. Équation diophantienne

Une équation \\(ax+by=c\\) se résout dans les entiers seulement si \\(d=\operatorname{PGCD}(a,b)\\) divise \\(c\\). Lorsque cette condition est satisfaite, une relation de Bézout donne une solution particulière ; les autres solutions se déduisent en ajoutant un paramètre entier.

> **Synthèse :** tester d’abord la divisibilité par le PGCD, rechercher ensuite Bézout, puis vérifier toute solution dans l’équation initiale.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Leçon 11 : PPCM et PGCD de deux entiers relatifs »**, Mathématiques, Terminale C, Côte d’Ivoire – École numérique. Adapté et publié pour Terminale C et D à la demande explicite de l’administrateur.`,
    a: [
      ["Quel est le dernier reste non nul dans l’algorithme d’Euclide ?", ["Le PGCD", "Le PPCM", "Le quotient"], ["Le PGCD"], "L’algorithme d’Euclide conserve le PGCD jusqu’au dernier reste non nul."],
      ["Que vaut PGCD(a,b)×PPCM(a,b) pour a,b non nuls ?", ["|ab|", "a+b", "a-b"], ["|ab|"], "La relation utilise la valeur absolue du produit."],
      ["Quand deux entiers sont-ils premiers entre eux ?", ["Lorsque leur PGCD vaut 1", "Lorsqu’ils sont tous deux premiers", "Lorsque leur somme vaut 1"], ["Lorsque leur PGCD vaut 1"], "Deux nombres composés peuvent aussi être premiers entre eux."],
      ["Quelle condition est nécessaire pour ax+by=c dans ℤ ?", ["PGCD(a,b) divise c", "a divise b", "x doit être positif"], ["PGCD(a,b) divise c"], "Sans cette divisibilité, aucune solution entière n’existe."],
    ],
    b: [
      ["Que garantit le théorème de Bézout si PGCD(a,b)=1 ?", ["Il existe u,v entiers tels que au+bv=1", "a=b", "a et b sont positifs"], ["Il existe u,v entiers tels que au+bv=1"], "Bézout caractérise les entiers premiers entre eux."],
      ["Quelle hypothèse complète « a divise bc » dans le théorème de Gauss ?", ["a est premier avec b", "b est pair", "c est premier"], ["a est premier avec b"], "Cette hypothèse autorise à conclure que a divise c."],
      ["Quel outil permet de trouver les coefficients de Bézout ?", ["La remontée de l’algorithme d’Euclide", "La dérivation", "Le calcul intégral"], ["La remontée de l’algorithme d’Euclide"], "On exprime les restes successifs comme combinaisons de a et b."],
      ["Si PGCD(a,b) ne divise pas c, que conclut-on pour ax+by=c ?", ["Pas de solution entière", "Une solution unique", "Toutes les solutions sont positives"], ["Pas de solution entière"], "La condition de divisibilité est nécessaire."],
    ],
  },
  {
    key: "suites",
    targets: { C: "15. Suites numériques", D: "10. Suites numériques" },
    createWhenMissing: false,
    description: "Étudier les suites arithmétiques et géométriques, la récurrence, la monotonie, les bornes et la convergence.",
    content: String.raw`# Suites numériques

## Objectif

Une suite associe un nombre à chaque rang entier. La résoudre revient à distinguer son mode de définition, étudier son évolution, l’encadrer lorsque nécessaire et conclure avec une justification sur sa limite.

## 1. Suites arithmétiques et géométriques

Une suite arithmétique de raison \\(r\\) vérifie \\(u_{n+1}=u_n+r\\), donc \\(u_n=u_p+(n-p)r\\). Une suite géométrique de raison \\(q\\) vérifie \\(u_{n+1}=qu_n\\), donc \\(u_n=u_pq^{n-p}\\).

| Type | Outil de reconnaissance | Somme de termes consécutifs |
|---|---|---|
| Arithmétique | Différence constante | Nombre de termes × moyenne des extrêmes |
| Géométrique | Quotient constant si les termes sont non nuls | Formule avec \\(1-q\\) si \\(q\ne1\\) |

## 2. Récurrence

Pour prouver une propriété \\(P(n)\\) pour tout rang à partir de \\(n_0\\), rédiger : **initialisation**, **hérédité** et **conclusion**. Dans l’hérédité, on suppose explicitement \\(P(k)\\) vraie puis on démontre \\(P(k+1)\\).

## 3. Monotonie et bornes

Pour étudier les variations, examiner le signe de \\(u_{n+1}-u_n\\), ou le quotient \\(u_{n+1}/u_n\\) lorsque les termes sont positifs. Une suite est majorée, minorée ou bornée selon les inégalités qu’elle vérifie à tous les rangs concernés.

> **Méthode :** écrire l’expression de la différence ; factoriser ou encadrer son signe ; annoncer ensuite « la suite est croissante/décroissante » avec le domaine de rangs.

## 4. Convergence

Une suite convergente admet une limite finie. Les résultats structurants sont : une suite croissante et majorée converge ; une suite décroissante et minorée converge. Une suite croissante non majorée diverge vers \\(+\infty\\), tandis qu’une suite décroissante non minorée diverge vers \\(-\infty\\).

Pour une suite récurrente \\(u_{n+1}=f(u_n)\\), une limite éventuelle \\(\ell\\) vérifie souvent \\(f(\ell)=\ell\\), mais cette équation ne prouve pas à elle seule la convergence : il faut aussi l’étudier.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Leçon 12 : Suites numériques »**, Mathématiques, Terminale C, Côte d’Ivoire – École numérique. Adapté et publié pour Terminale C et D à la demande explicite de l’administrateur.`,
    a: [
      ["Quelle relation définit une suite arithmétique de raison r ?", ["uₙ₊₁=uₙ+r", "uₙ₊₁=ruₙ", "uₙ=u₀rⁿ"], ["uₙ₊₁=uₙ+r"], "La différence de deux termes consécutifs est constante."],
      ["Quelle relation définit une suite géométrique de raison q ?", ["uₙ₊₁=quₙ", "uₙ₊₁=uₙ+q", "uₙ=q+n"], ["uₙ₊₁=quₙ"], "Le quotient de deux termes successifs non nuls est constant."],
      ["Quelle étape suit l’hypothèse de récurrence ?", ["Démontrer la propriété au rang suivant", "Conclure sans calcul", "Changer la proposition"], ["Démontrer la propriété au rang suivant"], "L’hérédité établit P(k) implique P(k+1)."],
      ["Quelle suite est nécessairement convergente ?", ["Une suite croissante et majorée", "Toute suite croissante", "Toute suite bornée"], ["Une suite croissante et majorée"], "La monotonie et une borne adaptée garantissent la convergence."],
    ],
    b: [
      ["Quel signe étudie-t-on souvent pour prouver qu’une suite est croissante ?", ["uₙ₊₁-uₙ", "uₙ+uₙ₊₁ uniquement", "La dérivée de n"], ["uₙ₊₁-uₙ"], "Une différence positive ou nulle établit la croissance."],
      ["Pour une suite positive, quelle autre comparaison peut aider à étudier les variations ?", ["uₙ₊₁/uₙ avec 1", "uₙ-uₙ₊₁ avec zéro seulement", "Le PGCD des termes"], ["uₙ₊₁/uₙ avec 1"], "Le quotient est utile si les termes sont strictement positifs."],
      ["Si uₙ₊₁=f(uₙ) et la suite converge vers ℓ, que vérifie souvent ℓ ?", ["f(ℓ)=ℓ", "f(ℓ)=0 toujours", "ℓ=n"], ["f(ℓ)=ℓ"], "La continuité de f permet de passer à la limite dans la relation de récurrence."],
      ["Une suite décroissante et non minorée…", ["diverge vers -∞", "converge toujours vers 0", "est constante"], ["diverge vers -∞"], "Sans borne inférieure, ses termes décroissent sans limite finie."],
    ],
  },
  {
    key: "isometries",
    targets: { C: "Isométries du plan", D: "Isométries du plan" },
    createWhenMissing: true,
    description: "Reconnaître, composer et classer les isométries du plan : translations, rotations, symétries et symétries glissées.",
    content: String.raw`# Isométries du plan

## Objectif

Une isométrie est une transformation du plan qui conserve les distances. Elle permet d’étudier une figure par ses invariants et de reconnaître une transformation à partir de sa construction, de sa composition ou de ses points fixes.

## 1. Transformations qui conservent les distances

Les translations, rotations et symétries orthogonales sont des isométries. Elles transforment une droite en droite, un cercle en cercle de même rayon et conservent parallélisme, orthogonalité et angles géométriques.

> **Définition :** si \\(f\\) est une isométrie, alors pour tous points \\(M,N\\), \\(f(M)f(N)=MN\\).

## 2. Composer deux symétries orthogonales

| Position des axes | Nature de la composée |
|---|---|
| Axes parallèles | Translation ; le vecteur dépend de l’ordre des axes. |
| Axes sécants | Rotation de centre leur intersection ; l’angle vaut le double de l’angle orienté des axes. |
| Axes perpendiculaires | Symétrie centrale de centre leur intersection. |

L’ordre est donc important : inverser deux symétries parallèles inverse le vecteur de la translation.

## 3. Symétrie glissée

Une symétrie glissée est la composée d’une symétrie orthogonale d’axe \\((D)\\) et d’une translation dirigée par \\((D)\\). Elle ne laisse aucun point invariant. Les milieux des segments joignant un point à son image permettent de retrouver l’axe.

## 4. Classer par les points invariants

| Points invariants | Nature possible |
|---|---|
| Trois points non alignés | Application identité |
| Deux points distincts | Symétrie orthogonale d’axe leur droite, hors identité |
| Un seul point | Rotation de ce centre |
| Aucun point | Translation ou symétrie glissée |

Un **déplacement** conserve les angles orientés : c’est une translation ou une rotation. Un **antidéplacement** change le signe des angles orientés : c’est une symétrie orthogonale ou glissée.

> **Méthode :** relever d’abord les points invariants ou les images de deux points ; identifier ensuite l’axe, le centre ou le vecteur ; vérifier enfin la conservation des distances et l’ordre des composées.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Leçon 15 : Isométries du plan »**, Mathématiques, Terminale C, Côte d’Ivoire – École numérique. Adapté et publié pour Terminale C et D à la demande explicite de l’administrateur.`,
    a: [
      ["Qu’est-ce qu’une isométrie conserve par définition ?", ["Les distances", "Les aires seulement", "Les coordonnées seulement"], ["Les distances"], "La conservation des distances est la propriété définissante."],
      ["Quelle composée obtient-on avec deux symétries d’axes parallèles ?", ["Une translation", "Une homothétie", "Une parabole"], ["Une translation"], "Le vecteur dépend de l’ordre choisi pour les deux symétries."],
      ["Quelle composée obtient-on avec deux symétries d’axes sécants ?", ["Une rotation", "Une translation", "Une projection"], ["Une rotation"], "Le centre est l’intersection des axes."],
      ["Quelle isométrie ne possède aucun point invariant et comporte un axe ?", ["Une symétrie glissée", "Une rotation", "L’identité"], ["Une symétrie glissée"], "La symétrie glissée combine réflexion et translation selon l’axe."],
    ],
    b: [
      ["Une isométrie avec un unique point invariant est…", ["Une rotation de ce centre", "Une translation", "Une identité"], ["Une rotation de ce centre"], "Hors autres cas, le point invariant unique est le centre de rotation."],
      ["Une isométrie qui conserve les angles orientés est appelée…", ["Déplacement", "Antidéplacement", "Dilatation"], ["Déplacement"], "Translations et rotations sont des déplacements."],
      ["Que devient la composée de deux antidéplacements ?", ["Un déplacement", "Toujours une symétrie", "Toujours une translation"], ["Un déplacement"], "La parité du nombre d’antidéplacements détermine la nature générale."],
      ["Pourquoi l’ordre de deux symétries parallèles importe-t-il ?", ["Il inverse le vecteur de translation", "Il annule toujours la transformation", "Il ne change jamais rien"], ["Il inverse le vecteur de translation"], "Les deux compositions produisent des translations de vecteurs opposés."],
    ],
  },
  {
    key: "integral",
    targets: { C: "5. Primitives et calcul intégral", D: "8. Calcul intégral" },
    createWhenMissing: false,
    skipExistingC: true,
    description: "Calculer, interpréter et utiliser des intégrales : primitives, propriétés, aires, valeur moyenne et techniques de calcul.",
    content: String.raw`# Calcul intégral

## Objectif

L’intégrale relie une fonction continue à l’accumulation de ses valeurs. Elle se calcule à l’aide d’une primitive mais s’interprète aussi comme une aire orientée, une valeur moyenne ou une fonction dépendant d’une borne.

## 1. Définition fondamentale

Si \\(F\\) est une primitive de \\(f\\) sur un intervalle contenant \\(a\\) et \\(b\\), alors :

$$
\int_a^b f(x)\,dx=F(b)-F(a).
$$

La lettre \\(x\\) est une variable muette : elle peut être remplacée sans changer la valeur. Inverser les bornes change le signe, et une intégrale ayant deux bornes égales vaut zéro.

## 2. Propriétés et interprétation

L’égalité de Chasles découpe une intégrale sur des intervalles successifs. La linéarité permet de séparer une somme et de sortir une constante. Si \\(f\\) est positive sur \\([a;b]\\), l’intégrale représente l’aire sous la courbe ; si le signe varie, on découpe l’intervalle pour additionner des aires positives.

| Outil | Rôle |
|---|---|
| Chasles | Découper au point où une expression ou un signe change. |
| Linéarité | Traiter une somme terme à terme. |
| Comparaison | Encadrer une intégrale grâce à des fonctions ordonnées. |
| Valeur moyenne | \\(\frac1{b-a}\int_a^b f(x)dx\\), hauteur du rectangle de même aire. |

## 3. Techniques de calcul

Choisir une primitive directe lorsque la forme est connue. Pour une intégration par parties, identifier \\(u\\) et \\(v'\\) puis appliquer :

$$
\int_a^b u(x)v'(x)dx=[u(x)v(x)]_a^b-\int_a^b u'(x)v(x)dx.
$$

Un changement de variable affine modifie simultanément l’expression, le différentiel et les bornes. Oublier de modifier les bornes est une erreur de méthode.

## 4. Fonction intégrale

Si \\(F(x)=\int_a^x f(t)dt\\) avec \\(f\\) continue, alors \\(F'(x)=f(x)\\) et \\(F(a)=0\\). Cette propriété relie directement intégrale et primitive.

> **Synthèse :** vérifier la continuité, choisir une primitive ou une technique adaptée, évaluer aux deux bornes et distinguer soigneusement intégrale orientée et aire géométrique.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Leçon 10 : Calcul intégral »**, Mathématiques, Terminale D, Côte d’Ivoire – École numérique. Publié pour Terminale D ; la leçon C correspondante, déjà renseignée et active, est préservée sans écrasement.`,
    a: [
      ["Comment calcule-t-on ∫ₐᵇ f(x)dx si F est une primitive de f ?", ["F(b)-F(a)", "F(a)-F(b) toujours", "f(b)-f(a)"], ["F(b)-F(a)"], "C’est le théorème fondamental du calcul intégral dans ce contexte."],
      ["Que vaut une intégrale dont les deux bornes sont identiques ?", ["0", "1", "La dérivée"], ["0"], "Il n’y a aucun intervalle à parcourir."],
      ["Quelle propriété découpe une intégrale à une borne intermédiaire ?", ["L’égalité de Chasles", "Le théorème de Gauss", "Bézout"], ["L’égalité de Chasles"], "Elle exprime l’intégrale sur [a;b] comme somme sur deux sous-intervalles."],
      ["Que représente l’intégrale d’une fonction continue positive ?", ["Une aire sous la courbe", "Toujours une longueur", "Un angle"], ["Une aire sous la courbe"], "L’interprétation géométrique requiert la positivité sur l’intervalle."],
    ],
    b: [
      ["Quelle donnée doit changer lors d’un changement de variable avec bornes ?", ["Les bornes et le différentiel", "Seulement le nom de x", "Aucune donnée"], ["Les bornes et le différentiel"], "La substitution transforme l’intégrale entière, pas seulement l’expression."],
      ["Quelle formule correspond à une intégration par parties ?", ["[uv]ₐᵇ-∫u'v", "∫u'v'", "u+v"], ["[uv]ₐᵇ-∫u'v"], "Elle s’applique après avoir choisi u et v'."],
      ["Quelle est la dérivée de F(x)=∫ₐˣ f(t)dt si f est continue ?", ["f(x)", "0", "F(x)"], ["f(x)"], "La fonction intégrale est la primitive qui s’annule en a."],
      ["Quand faut-il découper pour calculer une aire à l’aide d’intégrales ?", ["Quand la fonction change de signe", "Jamais", "Quand la fonction est constante"], ["Quand la fonction change de signe"], "Une aire géométrique reste positive, contrairement à une intégrale orientée."],
    ],
  },
];

const questionSql = (exerciseId, rows) => `insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values ${rows.map(([prompt, options, correct, explanation], index) => `(${exerciseId},'single_choice',${sqlText(prompt)},${jsonArray(options)},${jsonArray(correct)},${sqlText(explanation)},${(index + 1) * 10})`).join(",")};`;

const quizSql = (quizId, lesson, label, rows, displayOrder) => {
  const questions = rows.map(([question, , , explanation], index) => `(${quizId},${sqlText(question)},${sqlText(explanation)},'single_choice',${(index + 1) * 10},1,true)`).join(",");
  const answers = rows.flatMap(([, options, correct], index) => options.map((option, optionIndex) => `(${(index + 1) * 10},${sqlText(option)},${correct.includes(option)},${(optionIndex + 1) * 10})`)).join(",");
  return `insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active,is_test_data) values (target.subject_id,target.level_id,target.series_id,target.offering_id,target_chapter_id,target_lesson_id,${sqlText(`Quiz ${label} — ${lesson.key}`)},${sqlText(`Vérifie les notions et méthodes essentielles du cours ${lesson.key}.`)},'medium',12,${displayOrder},true,true,false) returning id into ${quizId}; with inserted_questions as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values ${questions} returning id,display_order) insert into public.quiz_answers (question_id,answer,is_correct,display_order) select question_row.id,answer_row.answer,answer_row.is_correct,answer_row.display_order from inserted_questions question_row join (values ${answers}) as answer_row(question_order,answer,is_correct,display_order) on answer_row.question_order=question_row.display_order;`;
};

const lessonSql = (lesson, index) => {
  const exerciseA = `exercise_a_${index}`;
  const exerciseB = `exercise_b_${index}`;
  const quizA = `quiz_a_${index}`;
  const quizB = `quiz_b_${index}`;
  const targetTitle = `target_title_${index}`;
  return `
    ${targetTitle} := ${sqlText(lesson.targets.C)};
    if target.series_name='D' then ${targetTitle} := ${sqlText(lesson.targets.D)}; end if;
    target_chapter_id := null; target_lesson_id := null;
    select chapter.id into target_chapter_id from public.chapters chapter where chapter.subject_offering_id=target.offering_id and not chapter.is_test_data order by chapter.display_order limit 1;
    if target_chapter_id is null then raise exception 'Le chapitre Mathématiques Terminale % est introuvable.', target.series_name; end if;
    select lesson.id into target_lesson_id from public.lessons lesson where lesson.chapter_id=target_chapter_id and lower(lesson.title)=lower(${targetTitle}) and not lesson.is_test_data limit 1;
    ${lesson.skipExistingC ? `if target.series_name='C' then if target_lesson_id is null then raise exception 'La leçon de calcul intégral C existante est requise et ne sera pas recréée.'; end if; if coalesce((select btrim(content) from public.lessons where id=target_lesson_id),'')='' then raise exception 'La leçon de calcul intégral C ne doit pas être remplacée par ce PDF Terminale D.'; end if; continue; end if;` : ""}
    if target_lesson_id is null then
      ${lesson.createWhenMissing ? `insert into public.lessons (chapter_id,title,description,content,display_order,is_active,is_test_data) values (target_chapter_id,${targetTitle},${sqlText(lesson.description)},'',coalesce((select max(existing_lesson.display_order)+10 from public.lessons existing_lesson where existing_lesson.chapter_id=target_chapter_id),10),false,false) returning id into target_lesson_id;` : `raise exception 'La leçon existante % est requise pour la Terminale %.', ${targetTitle}, target.series_name;`}
    end if;
    if exists (select 1 from public.lessons lesson where lesson.id=target_lesson_id and coalesce(btrim(lesson.content),'')<>'') then raise exception 'La leçon % de Terminale % contient déjà un cours : écrasement interdit.', ${targetTitle}, target.series_name; end if;
    if exists (select 1 from public.exercises exercise where exercise.lesson_id=target_lesson_id and not exercise.is_test_data) or exists (select 1 from public.quizzes quiz where quiz.lesson_id=target_lesson_id and not quiz.is_test_data) then raise exception 'La leçon % de Terminale % possède déjà des évaluations : duplication interdite.', ${targetTitle}, target.series_name; end if;
    update public.subjects set is_active=true where id=target.subject_id;
    update public.course_subject_offerings set is_published=true where id=target.offering_id;
    update public.chapters set is_active=true where id=target_chapter_id;
    update public.lessons set description=${sqlText(lesson.description)},content=${sqlText(lesson.content)},is_active=true,is_test_data=false where id=target_lesson_id and coalesce(btrim(content),'')='';
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order,is_test_data) values (target.subject_id,target.level_id,target.series_id,target_chapter_id,target_lesson_id,${sqlText(`Exercice 1 — Repères fondamentaux : ${lesson.key}`)},${sqlText("Réponds aux quatre questions en citant la définition ou la propriété utile.")},${sqlText("La correction explique la notion nécessaire à chaque réponse.")},'single_choice','easy',${sqlText("## Consigne\n\nLis chaque proposition puis choisis la réponse exacte.")},${sqlText("## Correction\n\nAppuie-toi sur les définitions et méthodes du cours publié.")},true,true,18,10,false) returning id into ${exerciseA};
    ${questionSql(exerciseA, lesson.a)}
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order,is_test_data) values (target.subject_id,target.level_id,target.series_id,target_chapter_id,target_lesson_id,${sqlText(`Exercice 2 — Méthodes et raisonnement : ${lesson.key}`)},${sqlText("Réinvestis les outils du cours et justifie ton choix à l’aide de la correction.")},${sqlText("La correction relie chaque réponse à une démarche de résolution rigoureuse.")},'single_choice','medium',${sqlText("## Consigne\n\nAnalyse la situation, repère la méthode pertinente puis choisis la réponse justifiée.")},${sqlText("## Correction\n\nVérifie les hypothèses puis formule une conclusion exacte.")},true,true,20,20,false) returning id into ${exerciseB};
    ${questionSql(exerciseB, lesson.b)}
    ${quizSql(quizA, lesson, "A — Notions", lesson.a, 10)}
    ${quizSql(quizB, lesson, "B — Méthodes", lesson.b, 20)}
  `;
};

const migration = `-- Mathématiques Terminale C/D : publication explicite des cinq leçons sources.
-- Le calcul intégral C déjà renseigné est volontairement préservé sans écrasement.
do $math_cd_published_five_lessons$
declare
  target record; target_chapter_id uuid; target_lesson_id uuid; offering_count integer;
  target_title_0 text; target_title_1 text; target_title_2 text; target_title_3 text; target_title_4 text;
  exercise_a_0 uuid; exercise_b_0 uuid; quiz_a_0 uuid; quiz_b_0 uuid;
  exercise_a_1 uuid; exercise_b_1 uuid; quiz_a_1 uuid; quiz_b_1 uuid;
  exercise_a_2 uuid; exercise_b_2 uuid; quiz_a_2 uuid; quiz_b_2 uuid;
  exercise_a_3 uuid; exercise_b_3 uuid; quiz_a_3 uuid; quiz_b_3 uuid;
  exercise_a_4 uuid; exercise_b_4 uuid; quiz_a_4 uuid; quiz_b_4 uuid;
begin
  select count(*) into offering_count from public.course_subject_offerings offering join public.subjects subject on subject.id=offering.subject_id join public.levels level on level.id=offering.level_id join public.series series on series.id=offering.series_id where subject.name='Mathématiques' and level.name='Terminale' and series.name in ('C','D') and not offering.is_test_data;
  if offering_count<>2 then raise exception 'Les deux offres officielles Mathématiques Terminale C et D sont requises.'; end if;
  for target in select offering.id as offering_id,offering.subject_id,offering.level_id,offering.series_id,series.name as series_name from public.course_subject_offerings offering join public.subjects subject on subject.id=offering.subject_id join public.levels level on level.id=offering.level_id join public.series series on series.id=offering.series_id where subject.name='Mathématiques' and level.name='Terminale' and series.name in ('C','D') and not offering.is_test_data order by series.name loop
    ${lessons.map(lessonSql).join("\n")}
  end loop;
end $math_cd_published_five_lessons$;`;

writeFileSync(migrationPath, migration, "utf8");
writeFileSync(payloadPath, `${JSON.stringify({ project_id: "nnshioowwniursnozicg", name: "mathematics_terminal_cd_published_five_lessons", query: migration }, null, 2)}\n`, "utf8");
console.log(migrationPath);
console.log(payloadPath);
