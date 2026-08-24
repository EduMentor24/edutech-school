import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const migrationPath = resolve(root, "supabase/migrations/20260824_physics_chemistry_terminal_cd_mechanics_published.sql");
const payloadPath = resolve(root, "supabase/migrations/20260824_physics_chemistry_terminal_cd_mechanics_published.apply.json");
const tag = "$pc_cd_mechanics_published$";
const sqlText = (value) => {
  const normalized = String(value).split(String.fromCharCode(92, 92)).join(String.fromCharCode(92));
  if (normalized.includes(tag)) throw new Error("Délimiteur SQL interdit dans le contenu Physique-Chimie mécanique.");
  return `${tag}${normalized}${tag}`;
};
const jsonArray = (values) => `jsonb_build_array(${values.map(sqlText).join(",")})`;

const lessons = [
  {
    key: "cinematique_du_point",
    titles: { C: "Cinématique du point", D: "Cinématique du point" },
    description: "Décrire un mouvement par les vecteurs position, vitesse et accélération dans différents repères.",
    content: String.raw`# Cinématique du point

## Objectif

La cinématique décrit **comment** un point matériel se déplace, sans rechercher les causes de ce mouvement. Elle relie position, vitesse et accélération dans un référentiel clairement choisi.

## 1. Décrire un mouvement

Le référentiel associe un objet de référence, un repère d’espace et une origine des dates. La trajectoire est l’ensemble des positions successives du point matériel. Dans un repère cartésien :

$$
\vec{OM}=x\vec i+y\vec j+z\vec k.
$$

Les fonctions \(x(t)\), \(y(t)\) et \(z(t)\) sont les équations horaires. Éliminer le temps permet d’obtenir l’équation de la trajectoire.

## 2. Vitesse et accélération

La vitesse instantanée est la dérivée du vecteur-position ; l’accélération est la dérivée de la vitesse :

$$
\vec v=\frac{d\vec{OM}}{dt},\qquad \vec a=\frac{d\vec v}{dt}=\frac{d^2\vec{OM}}{dt^2}.
$$

En coordonnées cartésiennes, \(\vec v=\dot x\vec i+\dot y\vec j+\dot z\vec k\) et \(\vec a=\ddot x\vec i+\ddot y\vec j+\ddot z\vec k\). Les unités sont respectivement \(\mathrm{m\,s^{-1}}\) et \(\mathrm{m\,s^{-2}}\).

> **Méthode — passer des équations au mouvement :** dériver une fois pour obtenir la vitesse, deux fois pour obtenir l’accélération ; identifier ensuite la forme de la trajectoire et les grandeurs constantes.

## 3. Trois modèles essentiels

| Mouvement | Critère | Équation utile |
|---|---|---|
| Rectiligne uniforme | \(\vec v\) constant, \(\vec a=\vec0\) | \(x=v_0t+x_0\) |
| Rectiligne uniformément varié | accélération constante | \(v_x=a_xt+v_{0x}\), \(x=\frac12a_xt^2+v_{0x}t+x_0\) |
| Circulaire uniforme | trajectoire circulaire, valeur de vitesse constante | \(v=R\omega\), \(a_n=\frac{v^2}{R}=R\omega^2\) |

Dans la base de Frenet, le vecteur vitesse est tangent à la trajectoire. L’accélération possède une composante tangentielle qui modifie la valeur de la vitesse et une composante normale orientée vers la concavité.

## Synthèse

Ne confonds pas un vecteur constant avec une valeur constante : dans un mouvement circulaire uniforme, la **valeur** de la vitesse est constante, mais le vecteur vitesse change de direction.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Cinématique du point »**, Physique-Chimie, Terminales C et D, Côte d’Ivoire – École numérique.`,
    a: [
      ["Que décrit la cinématique du point ?", ["Le mouvement indépendamment de ses causes", "Les causes uniquement", "La composition chimique"], ["Le mouvement indépendamment de ses causes"], "La cinématique relie les paramètres décrivant le mouvement sans faire intervenir son origine."],
      ["Quelle grandeur obtient-on en dérivant le vecteur-position ?", ["Le vecteur vitesse", "Le vecteur force", "La masse"], ["Le vecteur vitesse"], "La vitesse instantanée est la dérivée temporelle du vecteur-position."],
      ["Quelle est l’unité de l’accélération ?", ["m·s⁻²", "m·s⁻¹", "N·m"], ["m·s⁻²"], "L’accélération mesure la variation de vitesse par unité de temps."],
      ["Dans un mouvement rectiligne uniforme, quelle grandeur est nulle ?", ["Le vecteur accélération", "La vitesse", "La position"], ["Le vecteur accélération"], "La vitesse reste constante lorsque l’accélération est nulle."],
    ],
    b: [
      ["Quelle relation convient à un mouvement rectiligne uniformément varié ?", ["x=½aₓt²+v₀ₓt+x₀", "x=v₀t+x₀ seulement", "x=Rcos(ωt)"], ["x=½aₓt²+v₀ₓt+x₀"], "Cette expression contient l’effet de l’accélération constante."],
      ["Dans un mouvement circulaire uniforme, quelle affirmation est correcte ?", ["La valeur de la vitesse est constante", "Le vecteur vitesse est constant", "L’accélération est nulle"], ["La valeur de la vitesse est constante"], "La direction tangentielle varie le long du cercle."],
      ["Quelle relation donne la vitesse linéaire en mouvement circulaire uniforme ?", ["v=Rω", "v=R/ω", "v=Rω²"], ["v=Rω"], "La vitesse linéaire est le produit du rayon et de la vitesse angulaire."],
      ["Quelle composante de l’accélération est centripète ?", ["La composante normale", "La composante tangentielle", "Aucune"], ["La composante normale"], "Elle est orientée vers le centre de courbure de la trajectoire."],
    ],
  },
  {
    key: "centre_inertie",
    titles: { C: "Mouvement du centre d'inertie d’un solide", D: "Mouvement du centre d'inertie d’un solide" },
    description: "Modéliser le mouvement d’un solide par son centre d’inertie et appliquer les théorèmes de mécanique.",
    content: String.raw`# Mouvement du centre d’inertie d’un solide

## Objectif

Un solide peut souvent être étudié par le mouvement de son centre d’inertie \(G\). Cette modélisation organise les forces et permet d’utiliser deux théorèmes complémentaires.

## 1. Référentiel galiléen

Un référentiel galiléen est un référentiel dans lequel le principe de l’inertie est vérifié. Pour les expériences de durée limitée à la surface de la Terre, le référentiel terrestre est généralement supposé galiléen.

## 2. Théorème du centre d’inertie

Dans un référentiel galiléen, la somme vectorielle des forces extérieures appliquées au solide est égale au produit de sa masse par l’accélération de son centre d’inertie :

$$
\sum\vec F_{\mathrm{ext}}=m\vec a_G.
$$

Si la résultante des forces est nulle, le solide peut être immobile **ou** conserver un mouvement rectiligne uniforme. Cette conclusion est le principe de l’inertie.

## 3. Théorème de l’énergie cinétique

Entre deux positions \(A\) et \(B\), la variation d’énergie cinétique est égale à la somme des travaux des forces extérieures :

$$
\Delta E_c=E_{cB}-E_{cA}=\sum W_{A\to B}(\vec F_{\mathrm{ext}}).
$$

Ce théorème est utile lorsqu’on cherche une vitesse, une distance ou l’effet d’une force sur un trajet. Une force perpendiculaire au déplacement a un travail nul.

## 4. Protocole fiable

1. Définir le système étudié et le référentiel.
2. Dresser le bilan des forces et choisir un repère orienté.
3. Projeter le théorème du centre d’inertie si l’accélération est recherchée.
4. Utiliser le théorème de l’énergie cinétique si l’évolution de la vitesse est recherchée.
5. Vérifier les unités et le signe du résultat.

> **Attention :** le poids, la réaction du support, les frottements et une force motrice ne se remplacent jamais l’un l’autre. Chaque force doit être identifiée avant tout calcul.

## Synthèse

Le théorème du centre d’inertie est vectoriel et décrit l’accélération. Le théorème de l’énergie cinétique est scalaire et relie les vitesses aux travaux : les deux outils ne répondent pas exactement à la même question.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Mouvement du centre d’inertie d’un solide »**, Physique-Chimie, Terminales C et D, Côte d’Ivoire – École numérique.`,
    a: [
      ["Dans quel référentiel applique-t-on le théorème du centre d’inertie du cours ?", ["Dans un référentiel galiléen", "Dans tout référentiel sans condition", "Seulement dans un repère polaire"], ["Dans un référentiel galiléen"], "Le théorème est énoncé dans un référentiel galiléen."],
      ["Quelle relation exprime le théorème du centre d’inertie ?", ["ΣFext=m aG", "Ec=mv", "P=mg²"], ["ΣFext=m aG"], "La résultante des forces extérieures détermine l’accélération du centre d’inertie."],
      ["Si la résultante des forces est nulle, un solide peut…", ["être au repos ou en mouvement rectiligne uniforme", "être obligatoirement au repos", "accélérer obligatoirement"], ["être au repos ou en mouvement rectiligne uniforme"], "Une accélération nulle implique une vitesse constante, éventuellement nulle."],
      ["Quel théorème relie une variation d’énergie cinétique aux travaux ?", ["Le théorème de l’énergie cinétique", "Le théorème de Pythagore", "La loi d’Ohm"], ["Le théorème de l’énergie cinétique"], "Il compare l’énergie cinétique entre deux positions aux travaux des forces."],
    ],
    b: [
      ["Quelle force a un travail nul sur un déplacement qui lui est perpendiculaire ?", ["La force perpendiculaire au déplacement", "Toute force motrice", "Le poids uniquement"], ["La force perpendiculaire au déplacement"], "Le travail dépend de la composante de la force dans le sens du déplacement."],
      ["Quelle première étape est indispensable en mécanique ?", ["Définir le système étudié", "Écrire une formule au hasard", "Convertir les masses en forces"], ["Définir le système étudié"], "Le bilan des forces dépend du système choisi."],
      ["Pour déterminer une accélération sur un plan incliné, quel outil est le plus direct ?", ["Projeter ΣFext=m aG", "Utiliser seulement une aire", "Appliquer une formule de pH"], ["Projeter ΣFext=m aG"], "La projection sur l’axe adapté isole l’accélération recherchée."],
      ["Pour rechercher une vitesse après un trajet, quel outil est souvent pertinent ?", ["Le théorème de l’énergie cinétique", "La définition d’un champ uniforme", "La loi de Kepler"], ["Le théorème de l’énergie cinétique"], "Il relie les travaux reçus à la variation d’énergie cinétique."],
    ],
  },
  {
    key: "interaction_gravitationnelle",
    titles: { C: "Interaction gravitationnelle", D: "Interaction gravitationnelle" },
    description: "Étudier l’attraction gravitationnelle, le champ terrestre et les mouvements orbitaux de satellites.",
    createFor: ["D"], createOrder: 25,
    content: String.raw`# Interaction gravitationnelle

## Objectif

La gravitation explique l’attraction entre les corps massifs, l’existence du champ terrestre et le mouvement des satellites autour de la Terre.

## 1. Loi d’attraction universelle

Deux corps de masses \(m_A\) et \(m_B\), séparés par une distance \(r\), s’attirent avec des forces de même intensité, opposées et portées par la droite joignant leurs centres :

$$
F=G\frac{m_A m_B}{r^2},\qquad G=6{,}67\times10^{-11}\ \mathrm{N\,m^2\,kg^{-2}}.
$$

La force est toujours attractive. Le modèle est applicable aux corps à répartition sphérique en les assimilant à des masses concentrées à leur centre.

## 2. Champ gravitationnel

Un corps sphérique de masse \(M\) crée au point situé à la distance \(r\) un champ de norme :

$$
\mathcal G=\frac{GM}{r^2}.
$$

Près de la surface de la Terre, le champ gravitationnel et le champ de pesanteur sont très proches ; on utilise alors \(\vec{\mathcal G}\approx\vec g\). À l’altitude \(h\), la norme décroît lorsque \(r=R_T+h\) augmente.

## 3. Satellite sur une orbite circulaire

Dans le référentiel géocentrique supposé galiléen, un satellite en vol balistique est soumis principalement à l’attraction terrestre. Elle joue le rôle de force centripète :

$$
\frac{v^2}{r}=\frac{GM_T}{r^2},\qquad v=\sqrt{\frac{GM_T}{r}}.
$$

Sa vitesse ne dépend donc pas de sa masse. Sa période est liée à sa vitesse angulaire par \(T=2\pi/\omega\).

## 4. Géostationnaire et lois de Kepler

Un satellite géostationnaire décrit un cercle dans le plan équatorial, dans le même sens et avec la même vitesse angulaire que la Terre ; il paraît immobile pour un observateur terrestre. Les lois de Kepler rappellent notamment que, pour les planètes autour d’un même astre, le rapport \(a^3/T^2\) est constant.

> **Méthode :** faire un schéma radial, écrire la force gravitationnelle, identifier l’accélération normale puis vérifier toutes les conversions en unités SI avant le calcul.

## Synthèse

La gravitation n’est pas une force de contact : elle s’exerce à distance et décroît comme l’inverse du carré de la distance. Elle explique l’orbite sans dépendre de la masse du satellite dans ce modèle.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Interaction gravitationnelle »**, Physique-Chimie, Terminale C, Côte d’Ivoire – École numérique. Rattaché à Terminale C et D sur demande explicite.`,
    a: [
      ["Comment varie l’intensité gravitationnelle avec la distance r ?", ["Comme 1/r²", "Comme r²", "Elle est constante"], ["Comme 1/r²"], "La loi de Newton contient le facteur inversement proportionnel à r²."],
      ["Quel est le sens d’une force gravitationnelle exercée par la Terre sur un satellite ?", ["Vers le centre de la Terre", "Dans le sens du mouvement", "Vers l’extérieur"], ["Vers le centre de la Terre"], "La gravitation est attractive."],
      ["Près de la surface terrestre, quel rapprochement utilise le cours ?", ["Le champ gravitationnel est proche de g", "Le champ gravitationnel est nul", "g dépend de la masse du satellite"], ["Le champ gravitationnel est proche de g"], "Au voisinage de la Terre, les vecteurs sont pratiquement confondus dans ce modèle."],
      ["Quelle force entretient l’orbite circulaire d’un satellite en vol balistique ?", ["L’attraction gravitationnelle", "Une force de frottement", "Une force électrique"], ["L’attraction gravitationnelle"], "L’attraction terrestre fournit l’accélération centripète."],
    ],
    b: [
      ["Quelle relation donne la vitesse d’un satellite circulaire de rayon r ?", ["v=√(GM/r)", "v=GM/r²", "v=r²/GM"], ["v=√(GM/r)"], "Elle est obtenue en égalant accélération normale et champ gravitationnel."],
      ["Quelle propriété définit un satellite géostationnaire ?", ["Même vitesse angulaire que la Terre dans le plan équatorial", "Il est immobile dans l’espace", "Il tourne autour du Soleil"], ["Même vitesse angulaire que la Terre dans le plan équatorial"], "Son immobilité est seulement apparente pour l’observateur terrestre."],
      ["Quelle grandeur ne modifie pas la vitesse orbitale dans ce modèle ?", ["La masse du satellite", "Le rayon de l’orbite", "La masse de la Terre"], ["La masse du satellite"], "La masse du satellite se simplifie dans l’équation dynamique."],
      ["Quelle loi de Kepler relie période et dimension de l’orbite ?", ["a³/T² est constant", "a/T³ est constant", "a+T est constant"], ["a³/T² est constant"], "Cette relation vaut pour les planètes autour d’un même astre dans le cadre présenté."],
    ],
  },
  {
    key: "champs_uniformes",
    titles: { C: "Mouvements dans les champs (E et B)", D: "Mouvements dans les champs (E et B) uniformes" },
    description: "Établir les mouvements d’un projectile et d’une particule chargée dans les champs de pesanteur et électrostatique uniformes.",
    content: String.raw`# Mouvements dans les champs \(\vec g\) et \(\vec E\) uniformes

## Objectif

Un champ uniforme possède même direction, même sens et même intensité en tout point de la région étudiée. Le champ de pesanteur près du sol et le champ entre les plaques d’un condensateur plan constituent les deux modèles du cours.

## 1. Projectile dans le champ de pesanteur

En négligeant les frottements de l’air, le projectile est soumis à son poids. Son accélération est \(\vec a=\vec g\). Pour un lancer initial de vitesse \(v_0\) faisant l’angle \(\alpha\) avec l’horizontale :

$$
x=v_0\cos\alpha\,t,\qquad z=-\frac12gt^2+v_0\sin\alpha\,t+h.
$$

La trajectoire est parabolique. Lorsque le départ et l’arrivée sont à la même hauteur, la portée est maximale pour \(\alpha=45^\circ\).

## 2. Particule chargée dans un champ électrostatique

Une particule de charge \(q\) placée dans un champ électrique uniforme subit la force :

$$
\vec F_e=q\vec E,\qquad \vec a=\frac qm\vec E.
$$

Une charge positive est accélérée dans le sens de \(\vec E\) ; une charge négative est accélérée dans le sens opposé. Si la vitesse initiale est horizontale entre deux plaques, le mouvement est uniforme suivant l’horizontale et uniformément varié suivant la direction du champ. La trajectoire est alors parabolique.

## 3. Déviation électrostatique

La déviation angulaire compare la direction de sortie à la direction d’entrée. La déflexion correspond au déplacement observable sur l’écran. Il faut toujours commencer par représenter le sens du champ et le signe de la charge : ce sont eux qui donnent le sens physique de la déviation.

> **Méthode :** établir le bilan des forces, écrire \(\sum\vec F=m\vec a\), projeter suivant les axes puis intégrer avec les conditions initiales. Ne mélange jamais la situation du projectile et celle d’une charge électrique.

## Synthèse

Dans les deux cas, une accélération constante conduit à des équations horaires quadratiques et à une trajectoire parabolique. La cause diffère : le poids pour le projectile, la force électrique pour la particule chargée.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Mouvements dans les champs g et E uniformes »**, Physique-Chimie, Terminales C et D, Côte d’Ivoire – École numérique.`,
    a: [
      ["Quand un champ est-il uniforme ?", ["Lorsque direction, sens et intensité sont identiques en tout point", "Lorsque seule son intensité est constante", "Lorsqu’il est nul"], ["Lorsque direction, sens et intensité sont identiques en tout point"], "Les trois caractéristiques du vecteur-champ doivent être conservées."],
      ["Quelle force principale agit sur le projectile du modèle sans frottement ?", ["Son poids", "La force électrique", "Une force de frottement"], ["Son poids"], "Le modèle du cours néglige la résistance de l’air."],
      ["Quelle force agit sur une charge q dans un champ électrique E ?", ["F=qE", "F=mg", "F=GmM/r²"], ["F=qE"], "La force électrique dépend du signe et de la valeur de la charge."],
      ["Quelle est la forme de la trajectoire étudiée dans ces deux modèles ?", ["Une parabole", "Un cercle obligatoire", "Une droite toujours"], ["Une parabole"], "Une coordonnée uniforme et une coordonnée accélérée produisent une trajectoire parabolique."],
    ],
    b: [
      ["Dans le mouvement d’un projectile, quelle composante de vitesse reste constante ?", ["La composante horizontale", "La composante verticale", "Aucune"], ["La composante horizontale"], "L’accélération horizontale est nulle dans le modèle du cours."],
      ["Pour une charge négative, le vecteur accélération électrique est orienté…", ["À l’opposé de E", "Dans le même sens que E", "Toujours verticalement"], ["À l’opposé de E"], "Le signe négatif de q inverse le sens de qE."],
      ["Quelle grandeur est maximale pour un projectile revenant à la même hauteur quand l’angle vaut 45° ?", ["La portée", "La masse", "Le poids"], ["La portée"], "Le résultat concerne le modèle sans frottement et des hauteurs identiques."],
      ["Quelle information doit être représentée avant de calculer une déviation électrique ?", ["Le sens du champ et le signe de la charge", "La couleur des plaques", "La masse de la Terre"], ["Le sens du champ et le signe de la charge"], "Ces données déterminent le sens de la force puis de la déviation."],
    ],
  },
  {
    key: "oscillations_mecaniques_libres",
    titles: { C: "Oscillations mécaniques libres", D: "Oscillations mécaniques libres" },
    description: "Décrire le mouvement d’un oscillateur masse-ressort non amorti et son évolution énergétique.",
    content: String.raw`# Oscillations mécaniques libres

## Objectif

Un oscillateur mécanique libre effectue un mouvement périodique autour d’une position d’équilibre stable lorsqu’il est écarté puis abandonné à lui-même. Le pendule élastique horizontal est le modèle étudié ici.

## 1. Vocabulaire du mouvement périodique

La période \(T\) est la durée d’un va-et-vient complet. La fréquence \(f\) est le nombre d’oscillations par seconde. La pulsation est reliée à ces grandeurs par :

$$
f=\frac1T,\qquad \omega=2\pi f=\frac{2\pi}{T}.
$$

L’amplitude \(X_m\) est l’élongation maximale par rapport à la position d’équilibre.

## 2. Pendule élastique non amorti

Pour une masse \(m\) reliée à un ressort de raideur \(k\), la projection du théorème du centre d’inertie conduit à :

$$
m\ddot x+kx=0\qquad\Longleftrightarrow\qquad \ddot x+\frac{k}{m}x=0.
$$

Une solution harmonique s’écrit \(x(t)=X_m\cos(\omega_0t+\varphi)\), avec :

$$
\omega_0=\sqrt{\frac{k}{m}},\qquad T_0=\frac{2\pi}{\omega_0}=2\pi\sqrt{\frac{m}{k}}.
$$

Les conditions initiales déterminent l’amplitude \(X_m\) et la phase initiale \(\varphi\).

## 3. Énergie de l’oscillateur

Sans frottement, l’énergie mécanique est constante. L’énergie potentielle élastique et l’énergie cinétique s’échangent :

$$
E_{pe}=\frac12kx^2,\qquad E_c=\frac12mv^2,\qquad E_m=E_{pe}+E_c=\frac12kX_m^2.
$$

Aux extrémités, la vitesse est nulle et l’énergie potentielle est maximale. À l’équilibre, l’énergie cinétique est maximale.

> **Méthode :** choisir l’origine à l’équilibre, écrire l’équation différentielle, déterminer \(\omega_0\), puis utiliser les conditions à \(t=0\) pour établir l’équation horaire.

## Synthèse

La conservation de l’énergie mécanique s’applique au modèle **non amorti**. En présence de pertes, l’amplitude décroît et un apport extérieur devient nécessaire pour entretenir les oscillations.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Oscillations mécaniques libres »**, Physique-Chimie, Terminale CDE, Côte d’Ivoire – École numérique.`,
    a: [
      ["Que représente la période d’un oscillateur ?", ["La durée d’une oscillation complète", "Le nombre d’oscillations par seconde", "La masse du solide"], ["La durée d’une oscillation complète"], "La fréquence, et non la période, compte les oscillations en une seconde."],
      ["Quelle relation lie fréquence et période ?", ["f=1/T", "f=T", "f=2πT"], ["f=1/T"], "La fréquence est l’inverse de la période."],
      ["Quelle équation décrit le pendule élastique non amorti ?", ["mẍ+kx=0", "mx+k=0", "mẋ=k"], ["mẍ+kx=0"], "Elle traduit l’action de rappel du ressort sur la masse."],
      ["Quelle est la pulsation propre d’un oscillateur masse-ressort ?", ["ω₀=√(k/m)", "ω₀=k/m", "ω₀=m/k"], ["ω₀=√(k/m)"], "La pulsation dépend de la raideur et de la masse."],
    ],
    b: [
      ["À quelle position l’énergie cinétique est-elle maximale ?", ["À la position d’équilibre", "À une élongation maximale", "Toujours nulle"], ["À la position d’équilibre"], "À l’équilibre, l’énergie potentielle élastique est minimale dans le modèle choisi."],
      ["À une élongation maximale, quelle grandeur est nulle ?", ["La vitesse", "La raideur", "La masse"], ["La vitesse"], "Le mobile change alors de sens de déplacement."],
      ["Quelle écriture peut représenter l’élongation harmonique ?", ["x(t)=Xm cos(ω₀t+φ)", "x(t)=kt+m", "x(t)=GM/r²"], ["x(t)=Xm cos(ω₀t+φ)"], "Elle contient l’amplitude, la pulsation et la phase initiale."],
      ["Dans quel cas l’énergie mécanique reste-t-elle constante dans ce cours ?", ["Lorsque les oscillations sont non amorties", "Lorsque les frottements sont importants", "Lorsque le ressort est absent"], ["Lorsque les oscillations sont non amorties"], "Les pertes par frottement diminuent l’énergie mécanique et l’amplitude."],
    ],
  },
];

const questionSql = (exerciseId, rows) => `insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values ${rows.map(([prompt, options, correct, explanation], index) => `(${exerciseId},'single_choice',${sqlText(prompt)},${jsonArray(options)},${jsonArray(correct)},${sqlText(explanation)},${(index + 1) * 10})`).join(",")};`;
const quizSql = (quizId, lesson, label, rows, displayOrder) => {
  const questions = rows.map(([question, , , explanation], index) => `(${quizId},${sqlText(question)},${sqlText(explanation)},'single_choice',${(index + 1) * 10},1,true)`).join(",");
  const answers = rows.flatMap(([, options, correct], index) => options.map((answer, optionIndex) => `(${(index + 1) * 10},${sqlText(answer)},${correct.includes(answer)},${(optionIndex + 1) * 10})`)).join(",");
  return `insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active,is_test_data) values (target.subject_id,target.level_id,target.series_id,target.offering_id,target_chapter_id,target_lesson_id,${sqlText(`Quiz ${label} — ${lesson.key}`)},${sqlText(`Vérifie les notions et méthodes essentielles de ${lesson.key}.`)},'medium',12,${displayOrder},true,true,false) returning id into ${quizId}; with inserted_questions as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values ${questions} returning id,display_order) insert into public.quiz_answers (question_id,answer,is_correct,display_order) select q.id,a.answer,a.is_correct,a.display_order from inserted_questions q join (values ${answers}) as a(question_order,answer,is_correct,display_order) on a.question_order=q.display_order;`;
};
const lessonSql = (lesson, index) => {
  const exerciseA = `exercise_a_${index}`; const exerciseB = `exercise_b_${index}`; const quizA = `quiz_a_${index}`; const quizB = `quiz_b_${index}`; const title = `target_title_${index}`;
  const canCreate = (lesson.createFor ?? []).map((series) => `target.series_name=${sqlText(series)}`).join(" or ") || "false";
  return `
    ${title}:=${sqlText(lesson.titles.C)}; if target.series_name='D' then ${title}:=${sqlText(lesson.titles.D)}; end if;
    select lesson.id into target_lesson_id from public.lessons lesson where lesson.chapter_id=target_chapter_id and lower(lesson.title)=lower(${title}) and not lesson.is_test_data limit 1;
    if target_lesson_id is null then
      if ${canCreate} then insert into public.lessons (chapter_id,title,description,content,display_order,is_active,is_test_data) values (target_chapter_id,${title},${sqlText(lesson.description)},'',${lesson.createOrder ?? 10},false,false) returning id into target_lesson_id; else raise exception 'La leçon officielle % de Terminale % est requise.',${title},target.series_name; end if;
    end if;
    if exists (select 1 from public.lessons lesson where lesson.id=target_lesson_id and coalesce(btrim(lesson.content),'')<>'') then raise exception 'La leçon % de Terminale % contient déjà un cours : écrasement interdit.',${title},target.series_name; end if;
    if exists (select 1 from public.exercises exercise where exercise.lesson_id=target_lesson_id and not exercise.is_test_data) or exists (select 1 from public.quizzes quiz where quiz.lesson_id=target_lesson_id and not quiz.is_test_data) then raise exception 'La leçon % de Terminale % possède déjà des évaluations : duplication interdite.',${title},target.series_name; end if;
    update public.lessons set description=${sqlText(lesson.description)},content=${sqlText(lesson.content)},is_active=true,is_test_data=false where id=target_lesson_id and coalesce(btrim(content),'')='';
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order,is_test_data) values (target.subject_id,target.level_id,target.series_id,target_chapter_id,target_lesson_id,${sqlText(`Exercice 1 — Notions fondamentales : ${lesson.key}`)},${sqlText("Réponds aux quatre questions en mobilisant les définitions du cours.")},${sqlText("Chaque correction explicite la notion nécessaire à la réponse.")},'single_choice','easy',${sqlText("## Consigne\n\nLis chaque proposition puis choisis la réponse exacte.")},${sqlText("## Correction\n\nRelis la définition et l’unité ou la relation associée avant de conclure.")},true,true,18,10,false) returning id into ${exerciseA};
    ${questionSql(exerciseA, lesson.a)}
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order,is_test_data) values (target.subject_id,target.level_id,target.series_id,target_chapter_id,target_lesson_id,${sqlText(`Exercice 2 — Méthodes et raisonnement : ${lesson.key}`)},${sqlText("Identifie l’outil pertinent puis choisis la réponse justifiée.")},${sqlText("Chaque correction relie la réponse à la méthode de résolution attendue.")},'single_choice','medium',${sqlText("## Consigne\n\nAnalyse la situation, choisis la relation ou le raisonnement adapté, puis vérifie les conditions d’application.")},${sqlText("## Correction\n\nLa solution rappelle les hypothèses et explique pourquoi la méthode choisie est valide.")},true,true,20,20,false) returning id into ${exerciseB};
    ${questionSql(exerciseB, lesson.b)}
    ${quizSql(quizA, lesson, "A — Notions", lesson.a, 10)}
    ${quizSql(quizB, lesson, "B — Méthodes", lesson.b, 20)}
  `;
};
const chemistryDiagramSql = `
  for chemistry_target in select lesson.id,lesson.title,case when lesson.title='Acides carboxyliques et dérivés' then ':::chemistry-reaction-carboxylic' when lesson.title='Fabrication d’un savon' then ':::chemistry-reaction-soap' else ':::chemistry-reaction-acid-base' end as marker from public.lessons lesson join public.chapters chapter on chapter.id=lesson.chapter_id join public.course_subject_offerings offering on offering.id=chapter.subject_offering_id join public.subjects subject on subject.id=offering.subject_id join public.levels level on level.id=offering.level_id join public.series series on series.id=offering.series_id where subject.name='Physique-Chimie' and level.name='Terminale' and series.name in ('C','D') and chapter.title in ('CHIMIE ORGANIQUE','CHIMIE GÉNÉRALE') and lesson.title in ('Acides carboxyliques et dérivés','Fabrication d’un savon','Solutions aqueuses. Notion de pH','Acide fort – Base forte','Acide faible – Base faible','Couples acide/base-Classification','Couples acide/base - Classification') and not lesson.is_test_data loop
    if position(chemistry_target.marker in coalesce((select content from public.lessons where id=chemistry_target.id),''))=0 then update public.lessons set content=rtrim(content)||E'\\n\\n'||chemistry_target.marker where id=chemistry_target.id; end if;
  end loop;`;
const migration = `-- Physique-Chimie Terminale C/D : mécanique publiée explicitement, sans écrasement.
do $pc_cd_mechanics_published_do$
declare
  target record; chemistry_target record; target_chapter_id uuid; target_lesson_id uuid; offering_count integer;
  ${lessons.map((_, index) => `target_title_${index} text; exercise_a_${index} uuid; exercise_b_${index} uuid; quiz_a_${index} uuid; quiz_b_${index} uuid;`).join("\n  ")}
begin
  select count(*) into offering_count from public.course_subject_offerings offering join public.subjects subject on subject.id=offering.subject_id join public.levels level on level.id=offering.level_id join public.series series on series.id=offering.series_id where subject.name='Physique-Chimie' and level.name='Terminale' and series.name in ('C','D') and not offering.is_test_data;
  if offering_count<>2 then raise exception 'Les deux offres officielles Physique-Chimie Terminale C et D sont requises.'; end if;
  for target in select offering.id as offering_id,offering.subject_id,offering.level_id,offering.series_id,series.name as series_name from public.course_subject_offerings offering join public.subjects subject on subject.id=offering.subject_id join public.levels level on level.id=offering.level_id join public.series series on series.id=offering.series_id where subject.name='Physique-Chimie' and level.name='Terminale' and series.name in ('C','D') and not offering.is_test_data order by series.name loop
    select chapter.id into target_chapter_id from public.chapters chapter where chapter.subject_offering_id=target.offering_id and chapter.title='PHYSIQUE — MÉCANIQUE' and not chapter.is_test_data limit 1;
    if target_chapter_id is null then raise exception 'Le chapitre PHYSIQUE — MÉCANIQUE de Terminale % est requis.',target.series_name; end if;
    update public.subjects set is_active=true where id=target.subject_id;
    update public.course_subject_offerings set is_published=true where id=target.offering_id;
    update public.chapters set is_active=true where id=target_chapter_id;
    ${lessons.map(lessonSql).join("\n")}
  end loop;
  ${chemistryDiagramSql}
end $pc_cd_mechanics_published_do$;`;

writeFileSync(migrationPath, migration, "utf8");
writeFileSync(payloadPath, `${JSON.stringify({ project_id: "nnshioowwniursnozicg", name: "physics_chemistry_terminal_cd_mechanics_published", query: migration }, null, 2)}\n`, "utf8");
console.log(migrationPath);
console.log(payloadPath);
