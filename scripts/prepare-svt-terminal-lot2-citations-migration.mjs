import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const migrationPath = resolve("supabase/migrations/20260820_svt_terminale_evolution_heredite_previsions_citations_drafts.sql");
const quote = (value) => `'${String(value).replaceAll("'", "''")}'`;
const jsonArray = (values) => `jsonb_build_array(${values.map(quote).join(", ")})`;
const textArray = (values) => `array[${values.map(quote).join(", ")}]::text[]`;

const lessons = {
  evolution: {
    title: "Leçon 2 : L’évolution de la lignée humaine.",
    chapter: "Thème 1 : L’origine de la vie et l’évolution de la lignée humaine.",
    description: "Transformations morphologiques, posturales et moléculaires, ainsi que théories de l’évolution de la lignée humaine.",
    course: String.raw`## L’évolution de la lignée humaine

> **Objectif :** comparer des caractères morphologiques, posturaux et moléculaires afin d’expliquer les repères utilisés pour étudier l’évolution de la lignée humaine.

## 1. Une démarche fondée sur des comparaisons

Le support ne présente pas l’évolution humaine comme une simple succession d’images. Il propose de comparer des caractères observables chez l’Homme et chez d’autres primates, puis de confronter ces comparaisons à des données moléculaires et aux théories de l’évolution.

> **Définition : lignée humaine.** Ensemble des formes appartenant à l’histoire évolutive qui conduit à l’Homme actuel, étudiée ici par comparaison de caractères.  
> **Définition : caractère.** Particularité observable ou mesurable d’un organisme, utilisée pour établir des ressemblances et des différences.

## 2. Transformations du crâne et du cerveau

Le document souligne une augmentation progressive du volume de la boîte crânienne et du cerveau. Il met également en évidence des modifications de la morphologie du crâne, de la vascularisation cérébrale et des circonvolutions.

| Élément comparé | Tendance présentée dans le support | Intérêt pour le raisonnement |
|---|---|---|
| Boîte crânienne et cerveau | Augmentation progressive du volume | Situer des transformations anatomiques au cours de la lignée humaine |
| Morphologie crânienne | Modifications de la forme du crâne | Comparer des caractères entre formes étudiées |
| Vascularisation et circonvolutions | Évolution des structures décrites | Relier les observations à l’étude du cerveau |

> **Attention :** un caractère isolé ne suffit pas à établir toute l’histoire évolutive. Le cours mobilise plusieurs indices qui doivent être interprétés ensemble.

## 3. Stature, bipédie et membres

Le PDF compare notamment le chimpanzé, le gorille et l’Homme. Les courbures vertébrales, la forme du bassin, les proportions des membres, le pouce et la voûte plantaire constituent des repères de comparaison.

> **Définition : bipédie.** Déplacement habituel reposant sur l’utilisation des deux membres inférieurs.  
> **Définition : voûte plantaire.** Organisation arquée de la plante du pied, observée dans la comparaison des caractères posturaux.

> **Méthode :** pour commenter un tableau de comparaison, nommez le caractère, décrivez la différence observée, puis expliquez ce qu’elle apporte à l’étude de la posture ou de la locomotion. N’affirmez pas davantage que ce que permet le document.

## 4. Les indices moléculaires de parenté

Le support compare 19 acides aminés de la chaîne β de l’hémoglobine chez l’Homme, le gorille, le porc et le cheval. Une différence moléculaire correspond à un changement dans une séquence comparée. Dans le cadre présenté, moins les différences sont nombreuses, plus la parenté est considérée comme proche.

> **Définition : acide aminé.** Molécule constitutive d’une protéine.  
> **Définition : hémoglobine.** Protéine dont la chaîne β est comparée dans l’activité du document.  
> **Définition : parenté.** Proximité évolutive inférée à partir de caractères comparés.

## 5. Théories évoquées dans le document

| Auteur ou courant cité | Idée à retenir dans le cadre du support |
|---|---|
| Lamarck | Les êtres vivants se transforment au cours du temps ; la théorie est étudiée comme une étape de l’histoire des idées sur l’évolution. |
| Darwin | La sélection naturelle est associée à la conservation différentielle de caractères dans certaines conditions. |
| De Vries et Morgan | Les travaux cités contribuent à l’étude des mutations et de l’hérédité. |
| Théorie synthétique de l’évolution | Le document relie les apports de la génétique aux mécanismes de l’évolution. |

> **Synthèse :** l’évolution de la lignée humaine est étudiée par des comparaisons de caractères crâniens, posturaux et moléculaires. Les théories citées montrent que l’explication scientifique de l’évolution s’est construite progressivement, en intégrant de nouveaux indices.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« L’évolution de la lignée humaine »**, SVT, Terminale A, Côte d’Ivoire – École numérique.`,
    exerciseA: { title: "Exercice 1 — Indices morphologiques de l’évolution humaine", difficulty: "easy", duration: 15, questions: [
      ["single_choice", "Quel élément est explicitement étudié dans les transformations crâniennes ?", ["Le volume de la boîte crânienne", "Le groupe sanguin ABO", "La fréquence respiratoire", "La glycémie"], ["Le volume de la boîte crânienne"], "Le document signale l’augmentation progressive de la boîte crânienne et du cerveau.", 10],
      ["single_choice", "Quel caractère fait partie des comparaisons de stature du support ?", ["La voûte plantaire", "La cornée", "La médullosurrénale", "Le foie"], ["La voûte plantaire"], "Le support compare notamment les courbures vertébrales, le bassin, les membres, le pouce et la voûte plantaire.", 20],
      ["true_false", "Un seul caractère anatomique suffit à lui seul pour établir toute l’histoire de la lignée humaine.", ["Vrai", "Faux"], ["Faux"], "Le cours demande de croiser plusieurs indices morphologiques et moléculaires.", 30],
    ] },
    exerciseB: { title: "Exercice 2 — Parenté moléculaire et théories de l’évolution", difficulty: "medium", duration: 20, questions: [
      ["single_choice", "Quelle molécule est comparée dans l’activité du support ?", ["La chaîne β de l’hémoglobine", "L’adrénaline", "L’ADN mitochondrial uniquement", "Le glucose"], ["La chaîne β de l’hémoglobine"], "Le document compare 19 acides aminés de la chaîne β de l’hémoglobine.", 10],
      ["single_choice", "Dans le raisonnement du cours, moins deux séquences comparées présentent de différences, plus…", ["la parenté est considérée comme proche", "les deux espèces sont nécessairement identiques", "la comparaison devient inutile", "la taille des organismes augmente"], ["la parenté est considérée comme proche"], "La comparaison moléculaire est utilisée comme indice de parenté dans le cadre du document.", 20],
      ["true_false", "La théorie synthétique de l’évolution relie les apports de la génétique aux mécanismes de l’évolution.", ["Vrai", "Faux"], ["Vrai"], "Le support présente la théorie synthétique comme intégrant les apports de la génétique.", 30],
    ] },
    quiz: { title: "Quiz de révision — Évolution de la lignée humaine", questions: [
      ["Quel ensemble de caractères est utilisé pour étudier la posture ?", "Le support cite notamment la colonne vertébrale, le bassin, les membres, le pouce et la voûte plantaire.", ["Les caractères posturaux", "Les seuls groupes sanguins"], 10],
      ["Que compare une analyse moléculaire dans cette leçon ?", "Elle compare les séquences d’acides aminés de la protéine indiquée.", ["des séquences d’acides aminés", "des couleurs de peau"], 20],
      ["Quel auteur est associé à la sélection naturelle ?", "Dans le tableau de cours, Darwin est associé à la sélection naturelle.", ["Darwin", "Lavoisier"], 30],
      ["Pourquoi plusieurs indices sont-ils mobilisés ?", "Ils permettent de construire une interprétation prudente au lieu de conclure à partir d’un seul caractère.", ["Pour croiser les observations", "Pour éviter toute comparaison"], 40],
    ] },
  },
  heredity: {
    title: "Leçon 1 : L’hérédité du sexe et du groupe sanguin chez l’Homme.",
    chapter: "Thème 2 : La transmission des caractères héréditaires chez l’Homme.",
    description: "Transmission du système ABO et déterminisme chromosomique du sexe dans le cadre des modèles étudiés.",
    course: String.raw`## L’hérédité du sexe et du groupe sanguin chez l’Homme

> **Objectif :** expliquer, à l’aide de génotypes, d’arbres généalogiques et d’échiquiers de croisement, la transmission du groupe sanguin ABO et le déterminisme chromosomique du sexe présenté par le support.

## 1. Phénotype et génotype

Le **phénotype** est le caractère observable : pour le système ABO, il s’agit des groupes A, B, AB ou O. Le **génotype** correspond à la combinaison d’allèles portée par l’individu pour le gène considéré.

> **Définition : allèle.** Version possible d’un même gène.  
> **Définition : génotype.** Combinaison d’allèles d’un individu pour un gène.  
> **Définition : phénotype.** Caractère observable résultant du génotype dans le modèle étudié.

## 2. Le système ABO : un gène autosomal polyallélique

Le document présente le gène ABO comme **autosomal** et **polyallélique**. Autosomal signifie qu’il est porté par un chromosome non sexuel. Polyallélique signifie que plusieurs allèles sont étudiés : A, B et O.

| Phénotype observé | Génotype(s) compatible(s) dans le modèle ABO |
|---|---|
| A | AA ou AO |
| B | BB ou BO |
| AB | AB |
| O | OO |

Les allèles A et B sont **codominants** : chez un individu AB, les deux s’expriment. L’allèle O est récessif face à A et B : il ne détermine le phénotype O que lorsqu’il est associé à un second allèle O.

> **Définition : codominance.** Expression simultanée de deux allèles dans le phénotype étudié.  
> **Définition : récessif.** Qualifie un allèle dont l’expression est masquée par un allèle dominant dans un génotype hétérozygote.  
> **Définition : hétérozygote.** Individu portant deux allèles différents pour un gène.

## 3. Lire une enquête familiale sans conclure trop vite

L’arbre généalogique et les informations de groupe sanguin permettent de proposer des génotypes compatibles. Il faut partir du phénotype, recenser les allèles possibles, puis vérifier la cohérence avec les parents et les enfants.

> **Méthode :** écrivez d’abord toutes les possibilités de génotype liées au phénotype. Réduisez-les ensuite seulement grâce aux informations familiales.  
> **Attention :** conformément à la limite formulée dans le PDF, un groupe sanguin seul ne permet pas d’établir une parenté certaine.

## 4. Le déterminisme chromosomique du sexe dans le modèle présenté

Le support compare XX chez la femme et XY chez l’homme. Les ovules portent le chromosome X dans ce modèle, tandis que deux catégories de spermatozoïdes sont distinguées : porteurs de X ou porteurs de Y.

| Gamète maternel | Gamète paternel | Combinaison obtenue dans le modèle |
|---|---|---|
| X | X | XX |
| X | Y | XY |

L’échiquier de croisement traduit ces possibilités théoriques. Il sert à raisonner sur les combinaisons chromosomiques issues de la fécondation, sans transformer une probabilité théorique en prédiction individuelle.

> **Définition : gamète.** Cellule reproductrice qui apporte un chromosome sexuel dans le modèle étudié.  
> **Définition : fécondation.** Rencontre des gamètes conduisant à une nouvelle combinaison chromosomique.

> **Synthèse :** le système ABO est régi, dans le cours, par trois allèles A, B et O avec codominance de A et B et récessivité de O. Le sexe chromosomique est expliqué à partir des combinaisons XX et XY obtenues lors de la fécondation dans le modèle étudié.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« L’hérédité du sexe et du groupe sanguin chez l’Homme »**, SVT, Terminale A, Côte d’Ivoire – École numérique.`,
    exerciseA: { title: "Exercice 1 — Génotypes et groupes sanguins ABO", difficulty: "easy", duration: 15, questions: [
      ["single_choice", "Quel génotype correspond au groupe sanguin O dans le modèle ABO ?", ["OO", "AO", "AB", "BB"], ["OO"], "L’allèle O est récessif ; le phénotype O correspond donc au génotype OO dans le modèle du cours.", 10],
      ["single_choice", "Pourquoi le groupe AB exprime-t-il les deux caractères A et B ?", ["A et B sont codominants", "O est dominant sur A et B", "Le gène est lié au sexe", "Les deux allèles disparaissent"], ["A et B sont codominants"], "Le cours définit la codominance des allèles A et B chez l’individu AB.", 20],
      ["true_false", "Le gène ABO est présenté comme porté par un chromosome sexuel.", ["Vrai", "Faux"], ["Faux"], "Le support le décrit comme autosomal, donc porté par un chromosome non sexuel.", 30],
    ] },
    exerciseB: { title: "Exercice 2 — Chromosomes sexuels et échiquier de croisement", difficulty: "medium", duration: 20, questions: [
      ["single_choice", "Quel chromosome sexuel est porté par l’ovule dans le modèle du support ?", ["X", "Y", "X ou Y selon la mère", "A ou B"], ["X"], "Le document présente les ovules comme porteurs du chromosome X.", 10],
      ["single_choice", "Quelle combinaison résulte de la rencontre d’un ovule X et d’un spermatozoïde Y ?", ["XY", "XX", "OO", "AB"], ["XY"], "L’échiquier de croisement associe X maternel et Y paternel à la combinaison XY.", 20],
      ["true_false", "Un groupe sanguin isolé permet à lui seul d’établir avec certitude une parenté familiale.", ["Vrai", "Faux"], ["Faux"], "Le PDF rappelle explicitement cette limite de l’interprétation des groupes sanguins.", 30],
    ] },
    quiz: { title: "Quiz de révision — Sexe et groupe sanguin", questions: [
      ["Que signifie polyallélique ?", "Le cours étudie plusieurs allèles pour le même gène : A, B et O.", ["plusieurs allèles pour un gène", "un seul allèle pour tous"], 10],
      ["Quel phénotype est associé au génotype AB ?", "Les allèles A et B sont codominants : le phénotype est AB.", ["AB", "O"], 20],
      ["Quelle combinaison chromosomique est associée à l’ovule X et au spermatozoïde X ?", "L’échiquier du cours donne XX.", ["XX", "XY"], 30],
      ["À quoi sert un arbre généalogique dans cette leçon ?", "Il aide à tester la cohérence de génotypes possibles au sein d’une famille.", ["À vérifier des génotypes compatibles", "À mesurer le volume cérébral"], 40],
    ] },
  },
  forecasts: {
    title: "Leçon 2 : Les prévisions génétiques.",
    chapter: "Thème 2 : La transmission des caractères héréditaires chez l’Homme.",
    description: "Étude de transmissions héréditaires et moyens de consultation, conseil, dépistage et diagnostic génétiques présentés par le support.",
    course: String.raw`## Les prévisions génétiques

> **Objectif :** identifier des modes de transmission héréditaire et présenter, avec prudence, les démarches de conseil, dépistage et diagnostic citées dans le support.

## 1. Étudier une maladie héréditaire à partir de données

Le document étudie la drépanocytose par électrophorèse des hémoglobines et l’hémophilie à partir d’un pédigrée. Ces deux activités montrent que l’interprétation repose sur des données précises : profils d’hémoglobines, génotypes possibles, répartition des personnes atteintes et liens familiaux.

> **Définition : maladie héréditaire.** Caractère pathologique étudié dans une famille selon son mode de transmission.  
> **Définition : pédigrée.** Représentation codée des liens familiaux utilisée pour suivre la transmission d’un caractère.  
> **Définition : électrophorèse.** Technique utilisée dans le document pour comparer les hémoglobines.

## 2. La drépanocytose dans le modèle HbA/HbS

La drépanocytose est étudiée par les hémoglobines HbA et HbS. Le document présente le gène concerné comme autosomal et utilise les génotypes HbA/HbA, HbA/HbS et HbS/HbS pour raisonner. Le génotype HbA/HbS illustre la codominance dans le cadre du support.

| Génotype mobilisé dans le cours | Lecture dans l’activité |
|---|---|
| HbA/HbA | Présence de l’hémoglobine HbA dans le modèle |
| HbA/HbS | Présence des deux hémoglobines, étudiée comme codominance |
| HbS/HbS | Présence de l’hémoglobine HbS dans le modèle |

> **Méthode :** avant de conclure, lisez les bandes ou résultats d’électrophorèse, notez les hémoglobines présentes, puis reliez-les au génotype compatible indiqué par le cours.

## 3. L’hémophilie dans le pédigrée étudié

Le PDF présente l’hémophilie comme une anomalie liée au chromosome X, avec un allèle de maladie récessif dans l’exemple analysé. La lecture d’un pédigrée consiste à repérer les personnes atteintes, leur sexe et les transmissions possibles d’une génération à l’autre.

> **Définition : lié au chromosome X.** Se dit d’un gène porté par le chromosome X dans le modèle étudié.  
> **Définition : récessif.** Se dit d’un allèle dont l’expression dépend de la combinaison allélique et du mode de transmission présenté.

> **Attention :** un arbre généalogique scolaire sert à comprendre un mode de transmission. Il ne permet pas d’établir seul un diagnostic individuel.

## 4. Prévoir, informer et accompagner

Le support cite la consultation et le conseil génétiques, l’électrophorèse, l’échographie, la biopsie de villosités choriales, l’amniocentèse et l’embryoscopie. Ces démarches sont présentées comme des moyens d’information, de dépistage ou de diagnostic dans des contextes médicaux.

| Démarche citée | Fonction pédagogique dans le cours |
|---|---|
| Consultation et conseil génétiques | Informer et accompagner la compréhension d’un risque héréditaire |
| Électrophorèse | Mettre en évidence des profils d’hémoglobines dans l’exemple étudié |
| Échographie | Observer des éléments de développement selon le contexte médical |
| Biopsie de villosités choriales, amniocentèse, embryoscopie | Techniques citées parmi les moyens de diagnostic prénatal |

> **Attention :** cette leçon décrit des démarches scientifiques et médicales citées par le support. Elle ne remplace pas une consultation, ne donne pas de pronostic personnel et respecte les décisions des personnes concernées.

> **Synthèse :** les prévisions génétiques mobilisent l’étude de modes de transmission, de profils biologiques et de pédigrées. La drépanocytose et l’hémophilie permettent d’exercer le raisonnement génétique ; les moyens cités apportent information, dépistage ou diagnostic dans des cadres professionnels.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Les prévisions génétiques »**, SVT, Terminale A, Côte d’Ivoire – École numérique.`,
    exerciseA: { title: "Exercice 1 — Drépanocytose et électrophorèse", difficulty: "easy", duration: 15, questions: [
      ["single_choice", "Quel couple d’hémoglobines est étudié dans le document sur la drépanocytose ?", ["HbA et HbS", "ACTH et CRH", "A et B du système ABO uniquement", "Adrénaline et cortisol"], ["HbA et HbS"], "Le PDF exploite l’électrophorèse des hémoglobines HbA et HbS.", 10],
      ["single_choice", "Quel génotype illustre la codominance dans l’activité ?", ["HbA/HbS", "HbA/HbA uniquement", "HbS/HbS uniquement", "XX"], ["HbA/HbS"], "Le support utilise le génotype HbA/HbS pour illustrer la présence des deux hémoglobines.", 20],
      ["true_false", "La drépanocytose est présentée comme liée à un gène autosomal dans le document.", ["Vrai", "Faux"], ["Vrai"], "Le PDF la présente comme liée à un gène autosomal.", 30],
    ] },
    exerciseB: { title: "Exercice 2 — Pédigrée et moyens de prévision génétique", difficulty: "medium", duration: 20, questions: [
      ["single_choice", "Quel mode de transmission est associé à l’hémophilie dans l’exemple étudié ?", ["Lié au chromosome X avec un allèle récessif", "Autosomique codominant uniquement", "Lié au chromosome Y dominant", "Non héréditaire"], ["Lié au chromosome X avec un allèle récessif"], "Le pédigrée du support présente une anomalie liée au chromosome X avec un allèle récessif.", 10],
      ["single_choice", "Quelle démarche est citée pour comparer les hémoglobines ?", ["L’électrophorèse", "La radiographie du crâne", "La mesure de la voûte plantaire", "La photosynthèse"], ["L’électrophorèse"], "L’électrophorèse des hémoglobines est l’outil utilisé dans l’activité sur la drépanocytose.", 20],
      ["true_false", "Le cours permet de proposer un diagnostic médical individualisé sans professionnel de santé.", ["Vrai", "Faux"], ["Faux"], "Le contenu est pédagogique et rappelle qu’il ne remplace pas une consultation médicale.", 30],
    ] },
    quiz: { title: "Quiz de révision — Prévisions génétiques", questions: [
      ["Qu’étudie un pédigrée ?", "Il représente une famille pour suivre la transmission d’un caractère.", ["la transmission familiale d’un caractère", "la vitesse d’un muscle"], 10],
      ["Que montre l’électrophorèse dans l’activité du cours ?", "Elle compare des profils d’hémoglobines HbA et HbS.", ["des profils d’hémoglobines", "des groupes musculaires"], 20],
      ["Quel chromosome porte le gène de l’hémophilie dans l’exemple ?", "Le PDF présente cette anomalie comme liée au chromosome X.", ["Le chromosome X", "Le chromosome Y uniquement"], 30],
      ["Quel rôle a le conseil génétique dans la leçon ?", "Il fait partie des démarches d’information et d’accompagnement citées.", ["Informer et accompagner", "Remplacer tout suivi médical"], 40],
    ] },
  },
};

const citations = [
  ["Français", "Il n’y a point d’effet sans cause.", "Voltaire", "Candide, ou l’Optimisme", "Chapitre I", "https://fr.wikisource.org/wiki/Candide,_ou_l%E2%80%99Optimisme/Garnier_1877/Texte_entier", "Cette formule permet d’identifier l’ironie d’un raisonnement présenté comme systématique dans le conte philosophique.", ["conte philosophique", "ironie", "cause"], "Conte philosophique"],
  ["Français", "Les hommes ne sont faits que pour se secourir les uns les autres.", "Voltaire", "Candide, ou l’Optimisme", "Chapitre II", "https://fr.wikisource.org/wiki/Candide,_ou_l%E2%80%99Optimisme/Garnier_1877/Texte_entier", "Elle sert à analyser l’écart entre un idéal de solidarité et la situation racontée dans le récit.", ["conte philosophique", "solidarité", "ironie"], "Conte philosophique"],
  ["Français", "Rien n’était si beau, si leste, si brillant, si bien ordonné que les deux armées.", "Voltaire", "Candide, ou l’Optimisme", "Chapitre III", "https://fr.wikisource.org/wiki/Candide,_ou_l%E2%80%99Optimisme/Garnier_1877/Texte_entier", "L’accumulation laudative prépare une dénonciation ironique de la guerre et de son spectacle.", ["conte philosophique", "guerre", "ironie"], "Ironie"],
  ["Français", "Candide, qui tremblait comme un philosophe, se cacha du mieux qu’il put pendant cette boucherie héroïque.", "Voltaire", "Candide, ou l’Optimisme", "Chapitre III", "https://fr.wikisource.org/wiki/Candide,_ou_l%E2%80%99Optimisme/Garnier_1877/Texte_entier", "L’oxymore et la distance du narrateur révèlent la critique de la guerre dans un conte philosophique.", ["conte philosophique", "oxymore", "guerre"], "Ironie"],
  ["Français", "Il prit le parti d’aller raisonner ailleurs des effets et des causes.", "Voltaire", "Candide, ou l’Optimisme", "Chapitre III", "https://fr.wikisource.org/wiki/Candide,_ou_l%E2%80%99Optimisme/Garnier_1877/Texte_entier", "Le passage aide à étudier la progression de Candide et la mise à l’épreuve des discours abstraits par l’expérience.", ["conte philosophique", "raison", "récit"], "Littérature d’idées"],
  ["Français", "Je présume qu’en général ceux qui se mêlent des affaires publiques périssent quelquefois misérablement.", "Voltaire", "Candide, ou l’Optimisme", "Chapitre XXX", "https://fr.wikisource.org/wiki/Candide,_ou_l%E2%80%99Optimisme/Garnier_1877/Texte_entier", "Elle permet d’interroger la portée critique d’une parole de personnage dans la conclusion du conte.", ["conte philosophique", "critique", "politique"], "Littérature d’idées"],
  ["Français", "Les grandeurs, dit Pangloss, sont fort dangereuses, selon le rapport de tous les philosophes.", "Voltaire", "Candide, ou l’Optimisme", "Chapitre XXX", "https://fr.wikisource.org/wiki/Candide,_ou_l%E2%80%99Optimisme/Garnier_1877/Texte_entier", "Cette citation contribue à lire la remise en cause du pouvoir et du prestige dans la fin du récit.", ["conte philosophique", "critique", "pouvoir"], "Littérature d’idées"],
  ["Français", "L’homme n’est pas né pour le repos.", "Voltaire", "Candide, ou l’Optimisme", "Chapitre XXX", "https://fr.wikisource.org/wiki/Candide,_ou_l%E2%80%99Optimisme/Garnier_1877/Texte_entier", "Elle éclaire le thème de l’action dans la conclusion du conte, sans reproduire la formule déjà présente sur le jardin.", ["conte philosophique", "action", "conclusion"], "Littérature d’idées"],
  ["Français", "Travaillons sans raisonner ; c’est le seul moyen de rendre la vie supportable.", "Voltaire", "Candide, ou l’Optimisme", "Chapitre XXX", "https://fr.wikisource.org/wiki/Candide,_ou_l%E2%80%99Optimisme/Garnier_1877/Texte_entier", "Elle aide à analyser le rôle du travail concret dans les dernières pages et les nuances entre les voix des personnages.", ["conte philosophique", "travail", "conclusion"], "Littérature d’idées"],
  ["Français", "Ce sont les hommes qui font les taches, et ils ne peuvent pas les ôter.", "Voltaire", "Candide, ou l’Optimisme", "Chapitre XIX", "https://fr.wikisource.org/wiki/Candide,_ou_l%E2%80%99Optimisme/Garnier_1877/Texte_entier", "Cette formule permet d’étudier la responsabilité humaine dans la représentation du mal chez Voltaire.", ["conte philosophique", "mal", "responsabilité"], "Littérature d’idées"],
  ["Philosophie", "La diversité de nos opinions ne vient pas de ce que les uns sont plus raisonnables que les autres.", "René Descartes", "Discours de la méthode", "Première partie", "https://fr.wikisource.org/wiki/Discours_de_la_m%C3%A9thode_(%C3%A9d._Cousin)/Premi%C3%A8re_partie", "Elle introduit l’idée que la recherche de la vérité demande une conduite méthodique de la pensée.", ["Descartes", "raison", "vérité"], "Raison"],
  ["Philosophie", "La puissance de bien juger et distinguer le vrai d’avec le faux est naturellement égale en tous les hommes.", "René Descartes", "Discours de la méthode", "Première partie", "https://fr.wikisource.org/wiki/Discours_de_la_m%C3%A9thode_(%C3%A9d._Cousin)/Premi%C3%A8re_partie", "Elle permet de définir la raison comme faculté de jugement dans le texte cartésien.", ["Descartes", "raison", "jugement"], "Raison"],
  ["Philosophie", "Les plus grandes âmes sont capables des plus grands vices aussi bien que des plus grandes vertus.", "René Descartes", "Discours de la méthode", "Première partie", "https://fr.wikisource.org/wiki/Discours_de_la_m%C3%A9thode_(%C3%A9d._Cousin)/Premi%C3%A8re_partie", "Elle invite à discuter la liberté, la responsabilité morale et l’ambivalence des capacités humaines.", ["Descartes", "morale", "vertu"], "Morale"],
  ["Philosophie", "La philosophie donne moyen de parler vraisemblablement de toutes choses.", "René Descartes", "Discours de la méthode", "Première partie", "https://fr.wikisource.org/wiki/Discours_de_la_m%C3%A9thode_(%C3%A9d._Cousin)/Premi%C3%A8re_partie", "Cette formule ouvre une réflexion sur les ambitions et les limites des discours philosophiques.", ["Descartes", "philosophie", "vraisemblable"], "Connaissance"],
  ["Philosophie", "Il est bon de les avoir toutes examinées, afin de connaître leur juste valeur et se garder d’en être trompé.", "René Descartes", "Discours de la méthode", "Première partie", "https://fr.wikisource.org/wiki/Discours_de_la_m%C3%A9thode_(%C3%A9d._Cousin)/Premi%C3%A8re_partie", "Elle montre l’importance de l’examen critique des doctrines et des croyances.", ["Descartes", "esprit critique", "connaissance"], "Esprit critique"],
  ["Philosophie", "Ceux qui ont le raisonnement le plus fort peuvent toujours le mieux persuader ce qu’ils proposent.", "René Descartes", "Discours de la méthode", "Première partie", "https://fr.wikisource.org/wiki/Discours_de_la_m%C3%A9thode_(%C3%A9d._Cousin)/Premi%C3%A8re_partie", "Elle distingue la force d’un raisonnement de la seule maîtrise formelle de la rhétorique.", ["Descartes", "raisonnement", "persuasion"], "Argumentation"],
  ["Philosophie", "Ne recevoir jamais aucune chose pour vraie que je ne la connusse évidemment être telle.", "René Descartes", "Discours de la méthode", "Deuxième partie", "https://fr.wikisource.org/wiki/Discours_de_la_m%C3%A9thode_(%C3%A9d._Cousin)/Deuxi%C3%A8me_partie", "Cette première règle de méthode permet d’expliquer la recherche d’évidence et le refus de la précipitation.", ["Descartes", "méthode", "évidence"], "Méthode"],
  ["Philosophie", "Diviser chacune des difficultés que j’examinerois, en autant de parcelles qu’il se pourroit.", "René Descartes", "Discours de la méthode", "Deuxième partie", "https://fr.wikisource.org/wiki/Discours_de_la_m%C3%A9thode_(%C3%A9d._Cousin)/Deuxi%C3%A8me_partie", "Elle fournit un repère précis pour analyser une difficulté en étapes ordonnées.", ["Descartes", "méthode", "analyse"], "Méthode"],
  ["Philosophie", "Conduire par ordre mes pensées, en commençant par les objets les plus simples et les plus aisés à connaître.", "René Descartes", "Discours de la méthode", "Deuxième partie", "https://fr.wikisource.org/wiki/Discours_de_la_m%C3%A9thode_(%C3%A9d._Cousin)/Deuxi%C3%A8me_partie", "Elle éclaire l’ordre cartésien qui va du simple au composé dans la recherche de la vérité.", ["Descartes", "méthode", "ordre"], "Méthode"],
  ["Philosophie", "Faire partout des dénombrements si entiers et des revues si générales, que je fusse assuré de ne rien omettre.", "René Descartes", "Discours de la méthode", "Deuxième partie", "https://fr.wikisource.org/wiki/Discours_de_la_m%C3%A9thode_(%C3%A9d._Cousin)/Deuxi%C3%A8me_partie", "Elle sert à étudier la règle de vérification finale dans la méthode cartésienne.", ["Descartes", "méthode", "vérification"], "Méthode"],
  ["Histoire-Géographie", "Le but de toute association politique est la conservation des droits naturels et imprescriptibles de l’homme.", "Assemblée nationale constituante", "Déclaration des droits de l’homme et du citoyen de 1789", "Article 2", "https://www.conseil-constitutionnel.fr/le-bloc-de-constitutionnalite/declaration-des-droits-de-l-homme-et-du-citoyen-de-1789", "Elle aide à définir les droits naturels dans le contexte de la Révolution française.", ["droits", "Révolution française", "citoyenneté"], "Droits et citoyenneté"],
  ["Histoire-Géographie", "Le principe de toute Souveraineté réside essentiellement dans la Nation.", "Assemblée nationale constituante", "Déclaration des droits de l’homme et du citoyen de 1789", "Article 3", "https://www.conseil-constitutionnel.fr/le-bloc-de-constitutionnalite/declaration-des-droits-de-l-homme-et-du-citoyen-de-1789", "Elle permet de distinguer souveraineté nationale et pouvoir personnel dans l’étude politique.", ["souveraineté", "nation", "Révolution française"], "Souveraineté"],
  ["Histoire-Géographie", "La liberté consiste à pouvoir faire tout ce qui ne nuit pas à autrui.", "Assemblée nationale constituante", "Déclaration des droits de l’homme et du citoyen de 1789", "Article 4", "https://www.conseil-constitutionnel.fr/le-bloc-de-constitutionnalite/declaration-des-droits-de-l-homme-et-du-citoyen-de-1789", "Elle donne une définition institutionnelle de la liberté et de sa limite envers autrui.", ["liberté", "droit", "citoyenneté"], "Libertés publiques"],
  ["Histoire-Géographie", "Tout ce qui n’est pas défendu par la Loi ne peut être empêché.", "Assemblée nationale constituante", "Déclaration des droits de l’homme et du citoyen de 1789", "Article 5", "https://www.conseil-constitutionnel.fr/le-bloc-de-constitutionnalite/declaration-des-droits-de-l-homme-et-du-citoyen-de-1789", "Elle sert à étudier le principe de légalité et la fonction protectrice de la loi.", ["loi", "liberté", "droit"], "État de droit"],
  ["Histoire-Géographie", "La Loi est l’expression de la volonté générale.", "Assemblée nationale constituante", "Déclaration des droits de l’homme et du citoyen de 1789", "Article 6", "https://www.conseil-constitutionnel.fr/le-bloc-de-constitutionnalite/declaration-des-droits-de-l-homme-et-du-citoyen-de-1789", "Elle permet d’aborder la relation entre la loi, la représentation et la citoyenneté.", ["loi", "volonté générale", "citoyenneté"], "Souveraineté"],
  ["Histoire-Géographie", "Tous les Citoyens ont droit de concourir personnellement, ou par leurs Représentants, à sa formation.", "Assemblée nationale constituante", "Déclaration des droits de l’homme et du citoyen de 1789", "Article 6", "https://www.conseil-constitutionnel.fr/le-bloc-de-constitutionnalite/declaration-des-droits-de-l-homme-et-du-citoyen-de-1789", "Elle éclaire l’idée de participation civique directe ou représentative.", ["citoyenneté", "représentation", "loi"], "Citoyenneté"],
  ["Histoire-Géographie", "Nul homme ne peut être accusé, arrêté ni détenu que dans les cas déterminés par la Loi.", "Assemblée nationale constituante", "Déclaration des droits de l’homme et du citoyen de 1789", "Article 7", "https://www.conseil-constitutionnel.fr/le-bloc-de-constitutionnalite/declaration-des-droits-de-l-homme-et-du-citoyen-de-1789", "Elle introduit les garanties juridiques contre l’arbitraire.", ["justice", "loi", "liberté"], "État de droit"],
  ["Histoire-Géographie", "La Loi ne doit établir que des peines strictement et évidemment nécessaires.", "Assemblée nationale constituante", "Déclaration des droits de l’homme et du citoyen de 1789", "Article 8", "https://www.conseil-constitutionnel.fr/le-bloc-de-constitutionnalite/declaration-des-droits-de-l-homme-et-du-citoyen-de-1789", "Elle permet d’étudier le principe de proportionnalité des peines dans un État de droit.", ["justice", "peine", "loi"], "État de droit"],
  ["Histoire-Géographie", "Tout homme étant présumé innocent jusqu’à ce qu’il ait été déclaré coupable.", "Assemblée nationale constituante", "Déclaration des droits de l’homme et du citoyen de 1789", "Article 9", "https://www.conseil-constitutionnel.fr/le-bloc-de-constitutionnalite/declaration-des-droits-de-l-homme-et-du-citoyen-de-1789", "Elle fournit un repère pour comprendre la présomption d’innocence.", ["justice", "présomption d’innocence", "droit"], "État de droit"],
  ["Histoire-Géographie", "Nul ne doit être inquiété pour ses opinions, même religieuses.", "Assemblée nationale constituante", "Déclaration des droits de l’homme et du citoyen de 1789", "Article 10", "https://www.conseil-constitutionnel.fr/le-bloc-de-constitutionnalite/declaration-des-droits-de-l-homme-et-du-citoyen-de-1789", "Elle permet de définir la liberté d’opinion et de conscience dans le texte de 1789.", ["opinion", "religion", "liberté"], "Libertés publiques"],
  ["Physique-Chimie", "La science mathématique semble une contradiction insoluble.", "Henri Poincaré", "La Science et l’Hypothèse", "Introduction", "https://fr.wikisource.org/wiki/La_Science_et_l%E2%80%99Hypoth%C3%A8se/Texte_entier", "Elle ouvre une réflexion sur le rapport entre rigueur démonstrative et capacité de produire des connaissances nouvelles.", ["Poincaré", "mathématiques", "raisonnement"], "Raisonnement mathématique"],
  ["Physique-Chimie", "Le syllogisme ne peut rien nous apprendre d’essentiellement nouveau.", "Henri Poincaré", "La Science et l’Hypothèse", "Introduction", "https://fr.wikisource.org/wiki/La_Science_et_l%E2%80%99Hypoth%C3%A8se/Texte_entier", "Elle aide à distinguer le raisonnement formel de la production de connaissances dans la réflexion de Poincaré.", ["Poincaré", "syllogisme", "raisonnement"], "Raisonnement mathématique"],
  ["Physique-Chimie", "Le raisonnement syllogistique reste incapable de rien ajouter aux données qu’on lui fournit.", "Henri Poincaré", "La Science et l’Hypothèse", "Introduction", "https://fr.wikisource.org/wiki/La_Science_et_l%E2%80%99Hypoth%C3%A8se/Texte_entier", "Elle permet de comprendre la question posée par Poincaré sur la découverte mathématique.", ["Poincaré", "syllogisme", "connaissance"], "Raisonnement mathématique"],
  ["Physique-Chimie", "Le raisonnement mathématique a par lui-même une sorte de vertu créatrice.", "Henri Poincaré", "La Science et l’Hypothèse", "Introduction", "https://fr.wikisource.org/wiki/La_Science_et_l%E2%80%99Hypoth%C3%A8se/Texte_entier", "Elle souligne le rôle spécifique attribué au raisonnement mathématique dans le texte.", ["Poincaré", "mathématiques", "créativité"], "Raisonnement mathématique"],
  ["Physique-Chimie", "C’est de cette répétition que le raisonnement mathématique tire sa vertu.", "Henri Poincaré", "La Science et l’Hypothèse", "Première partie, chapitre III", "https://fr.wikisource.org/wiki/La_Science_et_l%E2%80%99Hypoth%C3%A8se/Texte_entier", "Elle sert à commenter l’importance de la répétition et de la généralisation dans le raisonnement mathématique.", ["Poincaré", "répétition", "mathématiques"], "Raisonnement mathématique"],
  ["Physique-Chimie", "L’expérience joue un rôle indispensable dans la genèse de la géométrie.", "Henri Poincaré", "La Science et l’Hypothèse", "Première partie, chapitre V", "https://fr.wikisource.org/wiki/La_Science_et_l%E2%80%99Hypoth%C3%A8se/Texte_entier", "Elle permet de distinguer le rôle de l’expérience dans la construction d’une science et la nature d’une démonstration.", ["Poincaré", "expérience", "géométrie"], "Géométrie et expérience"],
  ["Physique-Chimie", "L’expérience n’est qu’une occasion qui nous engage à l’en faire sortir.", "Henri Poincaré", "La Science et l’Hypothèse", "Première partie, chapitre V", "https://fr.wikisource.org/wiki/La_Science_et_l%E2%80%99Hypoth%C3%A8se/Texte_entier", "Elle aide à expliquer la différence entre le rôle de l’expérience et la construction des notions scientifiques.", ["Poincaré", "expérience", "théorie"], "Géométrie et expérience"],
  ["Physique-Chimie", "L’expérience nous guide dans ce choix qu’elle ne nous impose pas.", "Henri Poincaré", "La Science et l’Hypothèse", "Première partie, chapitre V", "https://fr.wikisource.org/wiki/La_Science_et_l%E2%80%99Hypoth%C3%A8se/Texte_entier", "Elle nourrit une réflexion sur le dialogue entre expérience, modèle et choix théorique.", ["Poincaré", "expérience", "modèle"], "Géométrie et expérience"],
  ["Physique-Chimie", "Les principes de la géométrie ne sont pas des faits expérimentaux.", "Henri Poincaré", "La Science et l’Hypothèse", "Première partie, chapitre VI", "https://fr.wikisource.org/wiki/La_Science_et_l%E2%80%99Hypoth%C3%A8se/Texte_entier", "Elle permet d’examiner avec rigueur le statut des principes géométriques dans l’argumentation scientifique.", ["Poincaré", "géométrie", "faits expérimentaux"], "Géométrie et expérience"],
  ["Physique-Chimie", "La géométrie euclidienne n’a donc rien à craindre d’expériences nouvelles.", "Henri Poincaré", "La Science et l’Hypothèse", "Première partie, chapitre VI", "https://fr.wikisource.org/wiki/La_Science_et_l%E2%80%99Hypoth%C3%A8se/Texte_entier", "Elle permet d’étudier l’argumentation de Poincaré sur l’interprétation des expériences géométriques.", ["Poincaré", "géométrie", "expérience"], "Géométrie et expérience"],
];

function renderExerciseQuestions(variable, questions) {
  return questions.map(([type, prompt, options, correct, explanation, order]) => `        (${variable},${quote(type)},${quote(prompt)},${jsonArray(options)},${jsonArray(correct)},${quote(explanation)},${order})`).join(",\n");
}

function renderQuiz(quiz) {
  const questions = quiz.questions.map(([prompt, explanation, _answers, order]) => `          (quiz_uuid,${quote(prompt)},${quote(explanation)},'single_choice',${order},1,true)`).join(",\n");
  const answers = quiz.questions.flatMap(([_prompt, _explanation, choices, order]) => [`          (${order},${quote(choices[0])},true,10)`, `          (${order},${quote(choices[1])},false,20)`]).join(",\n");
  return `      with inserted_questions as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values\n${questions}\n        returning id,display_order)\n      insert into public.quiz_answers (question_id,answer,is_correct,display_order)\n      select inserted_questions.id,answers.answer,answers.is_correct,answers.display_order from inserted_questions join (values\n${answers}\n      ) as answers(question_order,answer,is_correct,display_order) on answers.question_order=inserted_questions.display_order;`;
}

const courseCases = Object.entries(lessons).map(([key, lesson], index) => `    ${index === 0 ? "if" : "elsif"} target.lesson_key=${quote(key)} then\n      course_description := ${quote(lesson.description)};\n      course_text := $${key}$\n${lesson.course}\n$${key}$;\n      exercise_a_title := ${quote(lesson.exerciseA.title)};\n      exercise_b_title := ${quote(lesson.exerciseB.title)};\n      quiz_title := ${quote(lesson.quiz.title)};`).join("\n") + "\n    else raise exception 'Leçon SVT cible non reconnue : %', target.lesson_id; end if;";
const exerciseABranches = Object.entries(lessons).map(([key, lesson], index) => `${index === 0 ? "      if" : "      elsif"} target.lesson_key=${quote(key)} then\n        insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values\n${renderExerciseQuestions("exercise_a_uuid", lesson.exerciseA.questions)};`).join("\n") + "\n      end if;";
const exerciseBBranches = Object.entries(lessons).map(([key, lesson], index) => `${index === 0 ? "      if" : "      elsif"} target.lesson_key=${quote(key)} then\n        insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values\n${renderExerciseQuestions("exercise_b_uuid", lesson.exerciseB.questions)};`).join("\n") + "\n      end if;";
const quizBranches = Object.entries(lessons).map(([key, lesson], index) => `${index === 0 ? "      if" : "      elsif"} target.lesson_key=${quote(key)} then\n${renderQuiz(lesson.quiz)}`).join("\n") + "\n      end if;";
const citationRows = citations.map(([subject, text, author, work, reference, url, explanation, keywords, theme]) => `      (${quote(subject)},${quote(text)},${quote(author)},${quote(work)},${quote(reference)},${quote(url)},${quote(explanation)},${textArray(keywords)},${quote(theme)})`).join(",\n");

const sql = `-- Brouillons SVT Terminale A1/A2 : évolution de la lignée humaine, hérédité du sexe et du groupe sanguin, prévisions génétiques.
-- Citations : 10 nouvelles citations authentiques par matière, chacune rattachée à une notion propre à sa matière.
do $svt_terminal_lot2$
declare
  a2 record;
  target record;
  origin_chapter_uuid uuid;
  heredity_chapter_uuid uuid;
  next_chapter_order integer;
  exercise_a_uuid uuid;
  exercise_b_uuid uuid;
  quiz_uuid uuid;
  expected_count integer;
  course_description text;
  course_text text;
  exercise_a_title text;
  exercise_b_title text;
  quiz_title text;
begin
  select o.id as offering_id,o.subject_id,o.level_id,o.series_id into a2 from public.course_subject_offerings o join public.subjects sub on sub.id=o.subject_id join public.levels lv on lv.id=o.level_id join public.series s on s.id=o.series_id where sub.name='Sciences de la Vie et de la Terre' and lv.name='Terminale' and s.name='A2' limit 1;
  if a2.offering_id is null then raise exception 'Offre SVT Terminale A2 introuvable.'; end if;

  select c.id into origin_chapter_uuid from public.chapters c where c.subject_offering_id=a2.offering_id and c.title='Thème 1 : L’origine de la vie et l’évolution de la lignée humaine.' limit 1;
  if origin_chapter_uuid is null then raise exception 'Chapitre SVT A2 sur l’origine et l’évolution introuvable.'; end if;
  insert into public.lessons (chapter_id,title,description,content,display_order,is_test_data,is_active)
  select origin_chapter_uuid,'Leçon 2 : L’évolution de la lignée humaine.','Transformations morphologiques, posturales et moléculaires, ainsi que théories de l’évolution de la lignée humaine.',null,20,false,false
  where not exists (select 1 from public.lessons l where l.chapter_id=origin_chapter_uuid and l.title='Leçon 2 : L’évolution de la lignée humaine.');

  select coalesce(max(c.display_order),0)+10 into next_chapter_order from public.chapters c where c.subject_offering_id=a2.offering_id;
  insert into public.chapters (subject_id,level_id,series_id,subject_offering_id,title,description,display_order,is_test_data,is_active)
  select a2.subject_id,a2.level_id,a2.series_id,a2.offering_id,'Thème 2 : La transmission des caractères héréditaires chez l’Homme.','Transmission du sexe, des groupes sanguins et prévisions génétiques.',next_chapter_order,false,false
  where not exists (select 1 from public.chapters c where c.subject_offering_id=a2.offering_id and c.title='Thème 2 : La transmission des caractères héréditaires chez l’Homme.');
  select c.id into heredity_chapter_uuid from public.chapters c where c.subject_offering_id=a2.offering_id and c.title='Thème 2 : La transmission des caractères héréditaires chez l’Homme.' limit 1;
  if heredity_chapter_uuid is null then raise exception 'Chapitre SVT A2 sur la transmission héréditaire introuvable.'; end if;
  insert into public.lessons (chapter_id,title,description,content,display_order,is_test_data,is_active)
  select heredity_chapter_uuid,seed.title,seed.description,null,seed.display_order,false,false from (values
    ('Leçon 1 : L’hérédité du sexe et du groupe sanguin chez l’Homme.','Transmission du système ABO et déterminisme chromosomique du sexe dans le cadre des modèles étudiés.',10),
    ('Leçon 2 : Les prévisions génétiques.','Étude de transmissions héréditaires et moyens de consultation, conseil, dépistage et diagnostic génétiques présentés par le support.',20)
  ) as seed(title,description,display_order) where not exists (select 1 from public.lessons l where l.chapter_id=heredity_chapter_uuid and l.title=seed.title);

  select count(*) into expected_count from public.lessons l join public.chapters c on c.id=l.chapter_id join public.course_subject_offerings o on o.id=c.subject_offering_id join public.subjects sub on sub.id=o.subject_id join public.levels lv on lv.id=o.level_id join public.series s on s.id=o.series_id where sub.name='Sciences de la Vie et de la Terre' and lv.name='Terminale' and s.name in ('A1','A2') and ((c.title='Thème 1 : L’origine de la vie et l’évolution de la lignée humaine.' and l.title='Leçon 2 : L’évolution de la lignée humaine.') or (c.title='Thème 2 : La transmission des caractères héréditaires chez l’Homme.' and l.title in ('Leçon 1 : L’hérédité du sexe et du groupe sanguin chez l’Homme.','Leçon 2 : Les prévisions génétiques.')));
  if expected_count <> 6 then raise exception 'Six leçons SVT A1/A2 sont requises avant remplissage ; transaction annulée.'; end if;

  for target in select l.id as lesson_id,c.id as chapter_id,o.id as offering_id,o.subject_id,o.level_id,o.series_id,case l.title when 'Leçon 2 : L’évolution de la lignée humaine.' then 'evolution' when 'Leçon 1 : L’hérédité du sexe et du groupe sanguin chez l’Homme.' then 'heredity' else 'forecasts' end as lesson_key from public.lessons l join public.chapters c on c.id=l.chapter_id join public.course_subject_offerings o on o.id=c.subject_offering_id join public.subjects sub on sub.id=o.subject_id join public.levels lv on lv.id=o.level_id join public.series s on s.id=o.series_id where sub.name='Sciences de la Vie et de la Terre' and lv.name='Terminale' and s.name in ('A1','A2') and ((c.title='Thème 1 : L’origine de la vie et l’évolution de la lignée humaine.' and l.title='Leçon 2 : L’évolution de la lignée humaine.') or (c.title='Thème 2 : La transmission des caractères héréditaires chez l’Homme.' and l.title in ('Leçon 1 : L’hérédité du sexe et du groupe sanguin chez l’Homme.','Leçon 2 : Les prévisions génétiques.'))) order by s.name,c.display_order,l.display_order loop
    if exists (select 1 from public.lessons where id=target.lesson_id and coalesce(btrim(content),'') <> '') then raise exception 'La leçon SVT % contient déjà un cours. Écrasement interdit.', target.lesson_id; end if;
${courseCases}
    update public.lessons set description=course_description,content=course_text,is_active=false where id=target.lesson_id and coalesce(btrim(content),'')='';
    exercise_a_uuid := null;
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
    select target.subject_id,target.level_id,target.series_id,target.chapter_id,target.lesson_id,exercise_a_title,'Répondez progressivement aux questions en mobilisant les notions et mécanismes expliqués dans le cours.','La correction justifie chaque réponse à partir des notions étudiées.','single_choice','easy','## Consigne\n\nChoisissez la réponse juste puis relisez la partie correspondante du cours.','## Correction\n\nChaque réponse est expliquée avec le vocabulaire précis de la leçon.',false,false,15,10 where not exists (select 1 from public.exercises e where e.lesson_id=target.lesson_id and e.title=exercise_a_title) returning id into exercise_a_uuid;
    if exercise_a_uuid is not null then
${exerciseABranches}
    end if;
    exercise_b_uuid := null;
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
    select target.subject_id,target.level_id,target.series_id,target.chapter_id,target.lesson_id,exercise_b_title,'Analysez une relation de cause à effet ou un mécanisme en vous appuyant sur le cours.','La correction relie les faits observés aux notions scientifiques et aux étapes du mécanisme étudié.','single_choice','medium','## Consigne\n\nChoisissez l’analyse la plus complète et justifiez-la par une notion précise.','## Correction\n\nUne bonne réponse relie un fait, sa cause, son effet et le mécanisme concerné.',false,false,20,20 where not exists (select 1 from public.exercises e where e.lesson_id=target.lesson_id and e.title=exercise_b_title) returning id into exercise_b_uuid;
    if exercise_b_uuid is not null then
${exerciseBBranches}
    end if;
    quiz_uuid := null;
    insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active)
    select target.subject_id,target.level_id,target.series_id,target.offering_id,target.chapter_id,target.lesson_id,quiz_title,'Vérifiez votre maîtrise des définitions, comparaisons et mécanismes essentiels de la leçon.','medium',12,10,false,false where not exists (select 1 from public.quizzes q where q.lesson_id=target.lesson_id and q.title=quiz_title) returning id into quiz_uuid;
    if quiz_uuid is not null then
${quizBranches}
    end if;
  end loop;
end;
$svt_terminal_lot2$;

do $citations_lot2$
declare citation_seed record; citation_subject_uuid uuid; citation_uuid uuid;
begin
  for citation_seed in select * from (values
${citationRows}
  ) as seed(subject_name,quote_text,author,source_title,source_reference,source_url,pedagogical_explanation,keywords,theme) loop
    citation_uuid := null;
    select id into citation_subject_uuid from public.subjects where name=citation_seed.subject_name limit 1;
    if citation_subject_uuid is null then raise exception 'La matière Citations % est introuvable.', citation_seed.subject_name; end if;
    insert into public.citations (subject_id,quote_text,author,source_title,source_reference,source_url,pedagogical_explanation,keywords,is_active,is_validated)
    select citation_subject_uuid,citation_seed.quote_text,citation_seed.author,citation_seed.source_title,citation_seed.source_reference,citation_seed.source_url,citation_seed.pedagogical_explanation,citation_seed.keywords,false,false where not exists (select 1 from public.citations c where c.subject_id=citation_subject_uuid and c.quote_text=citation_seed.quote_text and c.author=citation_seed.author) returning id into citation_uuid;
    if citation_uuid is not null then
      insert into public.citation_scopes (citation_id,level_id,series_id) select citation_uuid,lv.id,s.id from public.levels lv cross join public.series s where lv.name='Terminale' and s.name in ('A1','A2','C','D');
      insert into public.citation_themes (citation_id,theme) values (citation_uuid,citation_seed.theme);
    end if;
  end loop;
end;
$citations_lot2$;
`;

mkdirSync(dirname(migrationPath), { recursive: true });
writeFileSync(migrationPath, sql);
console.log(migrationPath);
