import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const migrationPath = resolve("supabase/migrations/20260820_svt_terminale_biosynthese_proteines_citations_equilibrees_drafts.sql");
const sqlText = (value) => `'${String(value).replaceAll("'", "''")}'`;
const jsonArray = (values) => `jsonb_build_array(${values.map(sqlText).join(", ")})`;
const textArray = (values) => `array[${values.map(sqlText).join(", ")}]::text[]`;

const lesson = {
  title: "Leçon : L’utilisation des nutriments : la biosynthèse des protéines.",
  chapter: "Thème : Le devenir des nutriments dans l’organisme.",
  description: "Acteurs, code génétique, transcription et traduction dans la biosynthèse des protéines.",
  course: String.raw`## L’utilisation des nutriments : la biosynthèse des protéines

> **Objectif :** expliquer comment la cellule utilise des nutriments pour fabriquer une protéine en distinguant les acteurs, le code génétique, la transcription et la traduction.

## 1. La question directrice du cours

Le document demande comment la cellule synthétise les protéines. La réponse ne se réduit pas à une seule étape : une information portée par l’ADN est d’abord copiée sous forme d’ARN messager, puis cette information est lue pour assembler une chaîne d’acides aminés.

$$
\text{ADN matrice} \longrightarrow \text{ARNm} \longrightarrow \text{chaîne polypeptidique}
$$

> **Définition : protéine.** Grande molécule constituée d’une ou plusieurs chaînes d’acides aminés.  
> **Définition : biosynthèse.** Production d’une molécule par un organisme ou une cellule, à partir d’éléments disponibles et selon des mécanismes organisés.

## 2. Les acteurs de la synthèse protéique

| Acteur | Caractéristique citée dans le support | Rôle dans la démarche étudiée |
|---|---|---|
| ADN | Molécule bicaténaire | Porte l’information d’un gène utilisé comme matrice lors de la transcription |
| ARNm | ARN monocaténaire | Transporte l’information copiée vers le cytoplasme |
| ARNt | ARN porteur d’un anticodon | Associe un acide aminé au codon correspondant dans le modèle étudié |
| ARNr et ribosome | Ribosome à deux sous-unités | Participent au lieu de lecture de l’ARNm et d’assemblage de la chaîne |

> **Définition : bicaténaire.** Formé de deux brins complémentaires.  
> **Définition : monocaténaire.** Formé d’un seul brin.  
> **Définition : ribosome.** Structure cellulaire décrite dans le document comme formée de deux sous-unités et impliquée dans la traduction.

## 3. Lire le code génétique avec précision

Le code génétique relie des triplets de nucléotides de l’ARNm, appelés **codons**, aux acides aminés de la chaîne en formation. Le PDF indique 64 codons : 61 codent un acide aminé et trois codons, UAA, UAG et UGA, correspondent à des signaux de terminaison. AUG est présenté comme un codon d’initiation.

| Repère | Sens dans le cours |
|---|---|
| Codon | Triplet de nucléotides lu sur l’ARNm |
| AUG | Signal de départ de la traduction dans le modèle présenté |
| UAA, UAG, UGA | Codons stop : ils marquent la terminaison |
| Redondance | Plusieurs codons peuvent correspondre au même acide aminé |
| Universalité | Le même tableau de correspondance est mobilisé pour les êtres vivants étudiés |

> **Attention :** un codon n’est pas un acide aminé. Il s’agit d’une information de trois nucléotides qui permet de sélectionner un acide aminé ou de signaler l’arrêt.

## 4. La transcription : copier une information de l’ADN vers l’ARNm

La transcription se déroule dans le noyau. Un gène de l’ADN sert de matrice à la fabrication d’un ARNm complémentaire. Le document insiste sur une différence de vocabulaire et de composition : dans l’ARNm, **l’uracile U remplace la thymine T**.

> **Définition : gène.** Portion d’ADN portant une information utilisée dans le cours pour fabriquer un ARNm.  
> **Définition : complémentarité.** Correspondance organisée entre des nucléotides permettant de produire un brin associé à un brin matrice.

> **Méthode :** identifiez d’abord le brin d’ADN matrice. Écrivez ensuite l’ARNm complémentaire en utilisant U à la place de T. Découpez enfin l’ARNm en codons avant de consulter le code génétique.

## 5. La traduction : assembler les acides aminés

La traduction se déroule dans le cytoplasme, au niveau des ribosomes. Un ARNt porte un acide aminé et un **anticodon**. Son anticodon reconnaît le codon complémentaire de l’ARNm. Le PDF décrit une succession d’étapes : initiation, élongation et terminaison.

1. **Initiation :** le ribosome se positionne au niveau du codon de départ indiqué par le modèle.
2. **Élongation :** des ARNt apportent progressivement des acides aminés ; les sites P et A du ribosome sont mentionnés dans le document.
3. **Liaison peptidique :** elle relie les acides aminés successifs dans une chaîne polypeptidique.
4. **Terminaison :** un codon stop met fin à l’assemblage.

> **Définition : anticodon.** Triplet porté par un ARNt et associé au codon complémentaire de l’ARNm.  
> **Définition : liaison peptidique.** Liaison qui relie deux acides aminés dans la chaîne en formation.  
> **Définition : chaîne polypeptidique.** Succession d’acides aminés reliés entre eux.

> **Attention :** transcription et traduction sont deux mécanismes différents. La première produit l’ARNm à partir de l’ADN dans le noyau ; la seconde lit l’ARNm pour assembler des acides aminés au niveau des ribosomes.

## 6. Synthèse à retenir

> **Synthèse :** la cellule exploite l’information d’un gène par transcription, puis utilise l’ARNm lors de la traduction. Les codons de l’ARNm sont lus par le ribosome ; les ARNt apportent les acides aminés correspondants. L’assemblage se termine à un codon stop et produit une chaîne polypeptidique.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« L’utilisation des nutriments : la biosynthèse des protéines »**, SVT, Terminale A, Côte d’Ivoire – École numérique.`,
  exerciseA: {
    title: "Exercice 1 — Acteurs et code génétique de la biosynthèse",
    difficulty: "easy",
    duration: 15,
    questions: [
      ["single_choice", "Quel ARN porte un anticodon dans le modèle du cours ?", ["ARNt", "ARNm", "ADN", "ARNr uniquement"], ["ARNt"], "L’ARNt porte un anticodon et apporte un acide aminé au ribosome.", 10],
      ["single_choice", "Quel codon est présenté comme signal d’initiation ?", ["AUG", "UAA", "UAG", "UGA"], ["AUG"], "Le cours présente AUG comme le codon de départ de la traduction.", 20],
      ["true_false", "Les codons UAA, UAG et UGA codent chacun un acide aminé.", ["Vrai", "Faux"], ["Faux"], "Ces trois codons correspondent à des signaux de terminaison dans le modèle présenté.", 30],
    ],
  },
  exerciseB: {
    title: "Exercice 2 — Transcription et traduction d’une information génétique",
    difficulty: "medium",
    duration: 20,
    questions: [
      ["single_choice", "Quelle base est utilisée dans l’ARNm à la place de la thymine de l’ADN ?", ["Uracile", "Cytosine", "Guanine", "Adénine"], ["Uracile"], "L’ARN utilise l’uracile U au lieu de la thymine T.", 10],
      ["single_choice", "Où se déroule la traduction dans le modèle étudié ?", ["Dans le cytoplasme, au niveau des ribosomes", "Uniquement dans le noyau", "Dans la membrane cellulaire", "Dans les chromosomes"], ["Dans le cytoplasme, au niveau des ribosomes"], "La traduction lit l’ARNm au niveau des ribosomes du cytoplasme.", 20],
      ["true_false", "La transcription et la traduction désignent une seule et même étape de la biosynthèse des protéines.", ["Vrai", "Faux"], ["Faux"], "La transcription produit l’ARNm à partir de l’ADN ; la traduction assemble ensuite les acides aminés.", 30],
    ],
  },
  quiz: {
    title: "Quiz de révision — Biosynthèse des protéines",
    questions: [
      ["Qu’est-ce qu’un codon ?", "C’est un triplet de nucléotides lu sur l’ARNm.", ["Un triplet de nucléotides de l’ARNm", "Une protéine complète"], 10],
      ["Quel est le rôle général de l’ARNm ?", "Il transporte l’information copiée à partir de l’ADN vers le lieu de traduction.", ["Transporter l’information génétique copiée", "Former seul une protéine"], 20],
      ["Quel type de liaison relie les acides aminés ?", "Le cours appelle cette liaison une liaison peptidique.", ["La liaison peptidique", "La liaison ionique uniquement"], 30],
      ["Quel événement marque la terminaison ?", "Un codon stop met fin à l’assemblage de la chaîne polypeptidique.", ["La rencontre d’un codon stop", "Le remplacement de U par T"], 40],
    ],
  },
};

const citationExplanations = {
  "Français": (angle) => `Cette citation éclaire ${angle}. Elle peut être mobilisée pour identifier la portée morale, critique ou argumentative de la fable et justifier une interprétation par le texte.`,
  "Philosophie": (angle) => `Cette formulation permet d’examiner ${angle}. Elle aide l’élève à distinguer la thèse de Rousseau, ses enjeux politiques ou moraux et l’usage qu’il peut en faire dans une argumentation.`,
  "Histoire-Géographie": (angle) => `Cet article de la Charte africaine précise ${angle}. Il permet de relier une norme de droits humains à des notions d’État, de citoyenneté, de développement ou de relations internationales.`,
  "Physique-Chimie": (angle) => `Cette formulation de Claude Bernard met en évidence ${angle}. Elle aide à distinguer observation, hypothèse, contrôle expérimental et interprétation raisonnée des faits.`,
};

const citation = (subject, quoteText, author, sourceTitle, sourceReference, sourceUrl, theme, keywords, angle) => [
  subject, quoteText, author, sourceTitle, sourceReference, sourceUrl,
  citationExplanations[subject](angle), keywords, theme,
];

const fableUrl = "https://fr.wikisource.org/wiki/Fables_de_La_Fontaine_(%C3%A9d._Barbin)";
const rousseauUrl = "https://fr.wikisource.org/wiki/Du_contrat_social/%C3%89dition_1762/Texte_entier";
const charterUrl = "https://achpr.au.int/fr/charter/charte-africaine-des-droits-de-lhomme-et-des-peuples";
const bernardUrl = "https://fr.wikisource.org/wiki/Introduction_%C3%A0_l%E2%80%99%C3%A9tude_de_la_m%C3%A9decine_exp%C3%A9rimentale";

const citations = [
  citation("Français", "Et bien, dansez maintenant.", "Jean de La Fontaine", "Fables choisies, mises en vers", "Livre I, fable I, « La Cigale et la Fourmi »", fableUrl, "Fable", ["La Fontaine", "fable", "travail", "prévoyance"], "la conséquence littéraire de l’imprévoyance"),
  citation("Français", "La Fourmi n’est pas prêteuse : c’est là son moindre défaut.", "Jean de La Fontaine", "Fables choisies, mises en vers", "Livre I, fable I, « La Cigale et la Fourmi »", fableUrl, "Fable", ["La Fontaine", "fable", "personnification", "morale"], "la construction d’un personnage et son jugement moral"),
  citation("Français", "Le monde est plein de gens qui ne sont pas plus sages.", "Jean de La Fontaine", "Fables choisies, mises en vers", "Livre I, fable III, « La Grenouille qui se veut faire aussi grosse que le Bœuf »", fableUrl, "Satire", ["La Fontaine", "fable", "satire", "ambition"], "la généralisation satirique qui dépasse le seul récit animalier"),
  citation("Français", "Tout Bourgeois veut bâtir comme les grands Seigneurs.", "Jean de La Fontaine", "Fables choisies, mises en vers", "Livre I, fable III, « La Grenouille qui se veut faire aussi grosse que le Bœuf »", fableUrl, "Satire", ["La Fontaine", "fable", "satire", "vanité"], "la critique de la vanité et de l’imitation sociale"),
  citation("Français", "Quittez les bois, vous ferez bien.", "Jean de La Fontaine", "Fables choisies, mises en vers", "Livre I, fable V, « Le Loup et le Chien »", fableUrl, "Liberté", ["La Fontaine", "fable", "liberté", "dialogue"], "l’opposition entre la promesse de confort et la liberté"),
  citation("Français", "Je ne veux en aucune sorte ; et ne voudrais pas même à ce prix un trésor.", "Jean de La Fontaine", "Fables choisies, mises en vers", "Livre I, fable V, « Le Loup et le Chien »", fableUrl, "Liberté", ["La Fontaine", "fable", "liberté", "choix"], "le refus d’un avantage obtenu au prix de l’asservissement"),
  citation("Français", "Lynx envers nos pareils, et Taupes envers nous.", "Jean de La Fontaine", "Fables choisies, mises en vers", "Livre I, fable VII, « La Besace »", fableUrl, "Morale", ["La Fontaine", "fable", "défaut", "autocritique"], "la difficulté humaine à juger ses propres défauts"),
  citation("Français", "Nous nous pardonnons tout, et rien aux autres hommes.", "Jean de La Fontaine", "Fables choisies, mises en vers", "Livre I, fable VII, « La Besace »", fableUrl, "Morale", ["La Fontaine", "fable", "morale", "autrui"], "la dissymétrie entre le jugement de soi et le jugement d’autrui"),
  citation("Français", "Quiconque a beaucoup vu, peut avoir beaucoup retenu.", "Jean de La Fontaine", "Fables choisies, mises en vers", "Livre I, fable VIII, « L’Hirondelle et les petits Oiseaux »", fableUrl, "Prévoyance", ["La Fontaine", "fable", "expérience", "sagesse"], "le lien entre expérience, mémoire et capacité d’anticipation"),
  citation("Français", "Nous n’écoutons d’instincts que ceux qui sont les nôtres, et ne croyons le mal que quand il est venu.", "Jean de La Fontaine", "Fables choisies, mises en vers", "Livre I, fable VIII, « L’Hirondelle et les petits Oiseaux »", fableUrl, "Prévoyance", ["La Fontaine", "fable", "prévoyance", "morale"], "la critique de l’aveuglement face à un danger annoncé"),
  citation("Français", "Je mange tout à loisir.", "Jean de La Fontaine", "Fables choisies, mises en vers", "Livre I, fable IX, « Le Rat de Ville et le Rat des Champs »", fableUrl, "Bonheur", ["La Fontaine", "fable", "bonheur", "simplicité"], "l’opposition entre une vie simple et un plaisir exposé à la crainte"),
  citation("Français", "Fi du plaisir que la crainte peut corrompre.", "Jean de La Fontaine", "Fables choisies, mises en vers", "Livre I, fable IX, « Le Rat de Ville et le Rat des Champs »", fableUrl, "Bonheur", ["La Fontaine", "fable", "crainte", "plaisir"], "la remise en cause d’un bonheur fondé sur le luxe mais privé de sécurité"),
  citation("Français", "La raison du plus fort est toujours la meilleure.", "Jean de La Fontaine", "Fables choisies, mises en vers", "Livre I, fable X, « Le Loup et l’Agneau »", fableUrl, "Justice", ["La Fontaine", "fable", "justice", "pouvoir"], "l’ironie qui dénonce une justice confondue avec la force"),
  citation("Français", "Sans autre forme de procès.", "Jean de La Fontaine", "Fables choisies, mises en vers", "Livre I, fable X, « Le Loup et l’Agneau »", fableUrl, "Justice", ["La Fontaine", "fable", "procès", "injustice"], "la brièveté finale qui souligne l’absence de procédure juste"),
  citation("Français", "Je plie, et ne romps pas.", "Jean de La Fontaine", "Fables choisies, mises en vers", "Livre I, fable XXII, « Le Chêne et le Roseau »", fableUrl, "Résilience", ["La Fontaine", "fable", "résilience", "métaphore"], "la métaphore de l’adaptation face à une force supérieure"),
  citation("Français", "L’Arbre tient bon, le Roseau plie.", "Jean de La Fontaine", "Fables choisies, mises en vers", "Livre I, fable XXII, « Le Chêne et le Roseau »", fableUrl, "Résilience", ["La Fontaine", "fable", "opposition", "résilience"], "le contraste narratif qui prépare la morale sur la souplesse"),
  citation("Français", "Il faut autant qu’on peut obliger tout le monde.", "Jean de La Fontaine", "Fables choisies, mises en vers", "Livre I, fable XI, « Le Lion et le Rat »", fableUrl, "Solidarité", ["La Fontaine", "fable", "solidarité", "morale"], "la valeur de l’obligation et de l’entraide entre des êtres inégaux"),
  citation("Français", "On a souvent besoin d’un plus petit que soi.", "Jean de La Fontaine", "Fables choisies, mises en vers", "Livre I, fable XI, « Le Lion et le Rat »", fableUrl, "Solidarité", ["La Fontaine", "fable", "entraide", "humilité"], "la portée universelle d’une fable où le faible devient indispensable"),
  citation("Français", "Qui prétend contenter tout le monde et son père est bien fou du cerveau.", "Jean de La Fontaine", "Fables choisies, mises en vers", "Livre I, fable I du second recueil, « Le Meunier, son Fils et l’Âne »", fableUrl, "Opinion", ["La Fontaine", "fable", "opinion", "jugement social"], "le caractère impossible de la recherche permanente d’approbation"),
  citation("Français", "Qu’on dise quelque chose, ou qu’on ne dise rien ; j’en veux faire à ma tête.", "Jean de La Fontaine", "Fables choisies, mises en vers", "Livre I, fable I du second recueil, « Le Meunier, son Fils et l’Âne »", fableUrl, "Opinion", ["La Fontaine", "fable", "autonomie", "opinion"], "l’affirmation d’une décision personnelle après la succession de critiques contradictoires"),

  citation("Philosophie", "L’homme est né libre, et partout il est dans les fers.", "Jean-Jacques Rousseau", "Du contrat social", "Livre I, chapitre I", rousseauUrl, "Liberté", ["Rousseau", "liberté", "politique", "contrat social"], "la tension entre liberté naturelle et ordre social"),
  citation("Philosophie", "L’ordre social est un droit sacré, qui sert de base à tous les autres.", "Jean-Jacques Rousseau", "Du contrat social", "Livre I, chapitre I", rousseauUrl, "Politique", ["Rousseau", "ordre social", "droit", "politique"], "le fondement conventionnel de l’ordre politique"),
  citation("Philosophie", "Le plus fort n’est jamais assez fort pour être toujours le maître, s’il ne transforme sa force en droit et l’obéissance en devoir.", "Jean-Jacques Rousseau", "Du contrat social", "Livre I, chapitre III", rousseauUrl, "Droit", ["Rousseau", "force", "droit", "devoir"], "la critique de la confusion entre la force matérielle et le droit légitime"),
  citation("Philosophie", "Céder à la force est un acte de nécessité, non de volonté.", "Jean-Jacques Rousseau", "Du contrat social", "Livre I, chapitre III", rousseauUrl, "Aliénation", ["Rousseau", "force", "volonté", "liberté"], "la différence entre contrainte subie et consentement libre"),
  citation("Philosophie", "Force ne fait pas droit.", "Jean-Jacques Rousseau", "Du contrat social", "Livre I, chapitre III", rousseauUrl, "Droit", ["Rousseau", "droit", "force", "justice"], "la thèse concise qui refuse de fonder la justice sur la puissance"),
  citation("Philosophie", "Renoncer à sa liberté c’est renoncer à sa qualité d’homme, aux droits de l’humanité, même à ses devoirs.", "Jean-Jacques Rousseau", "Du contrat social", "Livre I, chapitre IV", rousseauUrl, "Aliénation", ["Rousseau", "liberté", "humanité", "esclavage"], "l’incompatibilité entre liberté humaine et aliénation totale"),
  citation("Philosophie", "La guerre n’est donc point une relation d’homme à homme, mais une relation d’État à État.", "Jean-Jacques Rousseau", "Du contrat social", "Livre I, chapitre IV", rousseauUrl, "Politique", ["Rousseau", "guerre", "État", "citoyen"], "la distinction entre les personnes et les États dans l’analyse de la guerre"),
  citation("Philosophie", "Trouver une forme d’association qui défende et protège de toute la force commune la personne et les biens de chaque associé.", "Jean-Jacques Rousseau", "Du contrat social", "Livre I, chapitre VI", rousseauUrl, "Contrat social", ["Rousseau", "association", "contrat social", "protection"], "le problème que le contrat social entend résoudre"),
  citation("Philosophie", "Chacun de nous met en commun sa personne et toute sa puissance sous la suprême direction de la volonté générale.", "Jean-Jacques Rousseau", "Du contrat social", "Livre I, chapitre VI", rousseauUrl, "Contrat social", ["Rousseau", "volonté générale", "association", "souveraineté"], "le principe de mise en commun des forces dans le pacte social"),
  citation("Philosophie", "Les maisons font la ville mais les Citoyens font la Cité.", "Jean-Jacques Rousseau", "Du contrat social", "Livre I, chapitre VI, note", rousseauUrl, "Citoyenneté", ["Rousseau", "citoyen", "cité", "politique"], "la distinction entre un espace urbain et une communauté politique de citoyens"),
  citation("Philosophie", "Ce que l’homme perd par le contrat social, c’est sa liberté naturelle ; ce qu’il gagne, c’est la liberté civile.", "Jean-Jacques Rousseau", "Du contrat social", "Livre I, chapitre VIII", rousseauUrl, "Liberté", ["Rousseau", "liberté naturelle", "liberté civile", "contrat"], "la comparaison entre liberté naturelle et liberté civile"),
  citation("Philosophie", "L’obéissance à la loi qu’on s’est prescrite est liberté.", "Jean-Jacques Rousseau", "Du contrat social", "Livre I, chapitre VIII", rousseauUrl, "Autonomie", ["Rousseau", "loi", "autonomie", "liberté"], "la définition de l’autonomie comme obéissance à une loi à laquelle on participe"),
  citation("Philosophie", "La volonté générale peut seule diriger les forces de l’État selon la fin de son institution, qui est le bien commun.", "Jean-Jacques Rousseau", "Du contrat social", "Livre II, chapitre I", rousseauUrl, "Volonté générale", ["Rousseau", "volonté générale", "bien commun", "État"], "la finalité collective attribuée à la volonté générale"),
  citation("Philosophie", "La souveraineté n’étant que l’exercice de la volonté générale ne peut jamais s’aliéner.", "Jean-Jacques Rousseau", "Du contrat social", "Livre II, chapitre I", rousseauUrl, "Souveraineté", ["Rousseau", "souveraineté", "volonté générale", "peuple"], "le caractère inaliénable de la souveraineté dans la théorie rousseauiste"),
  citation("Philosophie", "Le pouvoir peut bien se transmettre, mais non pas la volonté.", "Jean-Jacques Rousseau", "Du contrat social", "Livre II, chapitre I", rousseauUrl, "Souveraineté", ["Rousseau", "pouvoir", "volonté", "souveraineté"], "la différence entre délégation d’un pouvoir et représentation de la volonté générale"),
  citation("Philosophie", "La volonté générale est toujours droite et tend toujours à l’utilité publique.", "Jean-Jacques Rousseau", "Du contrat social", "Livre II, chapitre III", rousseauUrl, "Autonomie", ["Rousseau", "volonté générale", "utilité publique", "politique"], "la distinction entre le principe du bien commun et les erreurs possibles des délibérations"),
  citation("Philosophie", "Il y a souvent bien de la différence entre la volonté de tous et la volonté générale.", "Jean-Jacques Rousseau", "Du contrat social", "Livre II, chapitre III", rousseauUrl, "Volonté générale", ["Rousseau", "volonté de tous", "volonté générale", "intérêt commun"], "la différence entre une somme d’intérêts privés et l’intérêt commun"),
  citation("Philosophie", "Il faut donc des conventions et des lois pour unir les droits aux devoirs et ramener la justice à son objet.", "Jean-Jacques Rousseau", "Du contrat social", "Livre II, chapitre VI", rousseauUrl, "Citoyenneté", ["Rousseau", "convention", "loi", "justice"], "le rôle des conventions et des lois dans l’organisation de la justice civile"),
  citation("Philosophie", "Les lois ne sont proprement que les conditions de l’association civile.", "Jean-Jacques Rousseau", "Du contrat social", "Livre II, chapitre VI", rousseauUrl, "Loi", ["Rousseau", "loi", "association civile", "politique"], "la place de la loi dans la construction de l’association politique"),
  citation("Philosophie", "Le Peuple soumis aux lois en doit être l’auteur.", "Jean-Jacques Rousseau", "Du contrat social", "Livre II, chapitre VI", rousseauUrl, "Loi", ["Rousseau", "peuple", "loi", "citoyenneté"], "l’exigence de participation du peuple à l’élaboration de la loi"),

  citation("Histoire-Géographie", "Toute personne a droit à la jouissance des droits et libertés reconnus et garantis dans la présente Charte sans distinction aucune.", "Organisation de l’unité africaine", "Charte africaine des droits de l’homme et des peuples", "Article 2", charterUrl, "Non-discrimination", ["Charte africaine", "droits", "non-discrimination", "égalité"], "le principe de non-discrimination dans la jouissance des droits"),
  citation("Histoire-Géographie", "Toutes les personnes bénéficient d’une totale égalité devant la loi.", "Organisation de l’unité africaine", "Charte africaine des droits de l’homme et des peuples", "Article 3", charterUrl, "Égalité", ["Charte africaine", "égalité", "loi", "droits"], "l’égalité juridique des personnes"),
  citation("Histoire-Géographie", "Toutes les personnes ont droit à une égale protection de la loi.", "Organisation de l’unité africaine", "Charte africaine des droits de l’homme et des peuples", "Article 3", charterUrl, "Égalité", ["Charte africaine", "protection", "loi", "État de droit"], "la garantie égale de la protection juridique"),
  citation("Histoire-Géographie", "La personne humaine est inviolable.", "Organisation de l’unité africaine", "Charte africaine des droits de l’homme et des peuples", "Article 4", charterUrl, "Droits fondamentaux", ["Charte africaine", "vie", "intégrité", "dignité"], "la protection de la vie et de l’intégrité de la personne"),
  citation("Histoire-Géographie", "Tout individu a droit au respect de la dignité inhérente à la personne humaine.", "Organisation de l’unité africaine", "Charte africaine des droits de l’homme et des peuples", "Article 5", charterUrl, "Droits fondamentaux", ["Charte africaine", "dignité", "esclavage", "torture"], "l’interdiction des atteintes à la dignité humaine"),
  citation("Histoire-Géographie", "Tout individu a droit à la liberté et à la sécurité de sa personne.", "Organisation de l’unité africaine", "Charte africaine des droits de l’homme et des peuples", "Article 6", charterUrl, "Libertés publiques", ["Charte africaine", "liberté", "sécurité", "droits"], "la protection contre la privation arbitraire de liberté"),
  citation("Histoire-Géographie", "Toute personne a droit à l’information.", "Organisation de l’unité africaine", "Charte africaine des droits de l’homme et des peuples", "Article 9", charterUrl, "Libertés publiques", ["Charte africaine", "information", "opinion", "liberté"], "le rôle de l’accès à l’information dans la participation citoyenne"),
  citation("Histoire-Géographie", "Tous les citoyens ont le droit de participer librement à la direction des affaires publiques de leur pays.", "Organisation de l’unité africaine", "Charte africaine des droits de l’homme et des peuples", "Article 13", charterUrl, "Citoyenneté", ["Charte africaine", "citoyenneté", "participation", "affaires publiques"], "la participation directe ou représentative aux affaires publiques"),
  citation("Histoire-Géographie", "Toute personne a le droit de travailler dans des conditions équitables et satisfaisantes.", "Organisation de l’unité africaine", "Charte africaine des droits de l’homme et des peuples", "Article 15", charterUrl, "Droits sociaux", ["Charte africaine", "travail", "équité", "droits sociaux"], "le travail comme droit social et condition de justice"),
  citation("Histoire-Géographie", "Toute personne a droit à l’éducation.", "Organisation de l’unité africaine", "Charte africaine des droits de l’homme et des peuples", "Article 17", charterUrl, "Droits sociaux", ["Charte africaine", "éducation", "culture", "droits sociaux"], "l’éducation comme droit et condition de participation à la vie sociale"),
  citation("Histoire-Géographie", "La famille est l’élément naturel et la base de la société.", "Organisation de l’unité africaine", "Charte africaine des droits de l’homme et des peuples", "Article 18", charterUrl, "Société", ["Charte africaine", "famille", "société", "protection"], "la place de la famille et les obligations de protection publique"),
  citation("Histoire-Géographie", "Tous les peuples sont égaux ; ils jouissent de la même dignité et ont les mêmes droits.", "Organisation de l’unité africaine", "Charte africaine des droits de l’homme et des peuples", "Article 19", charterUrl, "Peuples", ["Charte africaine", "peuples", "égalité", "domination"], "l’égalité des peuples et le refus de toute domination"),
  citation("Histoire-Géographie", "Tout peuple a droit à l’existence.", "Organisation de l’unité africaine", "Charte africaine des droits de l’homme et des peuples", "Article 20", charterUrl, "Peuples", ["Charte africaine", "peuple", "existence", "autodétermination"], "le droit des peuples à exister et à choisir leur statut politique"),
  citation("Histoire-Géographie", "Les peuples ont la libre disposition de leurs richesses et de leurs ressources naturelles.", "Organisation de l’unité africaine", "Charte africaine des droits de l’homme et des peuples", "Article 21", charterUrl, "Développement", ["Charte africaine", "ressources", "richesses", "coopération"], "la souveraineté des peuples sur leurs ressources et ses enjeux de coopération"),
  citation("Histoire-Géographie", "Tous les peuples ont droit à leur développement économique, social et culturel.", "Organisation de l’unité africaine", "Charte africaine des droits de l’homme et des peuples", "Article 22", charterUrl, "Développement", ["Charte africaine", "développement", "économie", "culture"], "le développement conçu dans ses dimensions économique, sociale et culturelle"),
  citation("Histoire-Géographie", "Les peuples ont droit à la paix et à la sécurité tant sur le plan national que sur le plan international.", "Organisation de l’unité africaine", "Charte africaine des droits de l’homme et des peuples", "Article 23", charterUrl, "Paix", ["Charte africaine", "paix", "sécurité", "relations internationales"], "le lien entre paix, sécurité, solidarité et relations entre États"),
  citation("Histoire-Géographie", "Tous les peuples ont droit à un environnement satisfaisant et global, propice à leur développement.", "Organisation de l’unité africaine", "Charte africaine des droits de l’homme et des peuples", "Article 24", charterUrl, "Paix", ["Charte africaine", "environnement", "développement", "peuples"], "la relation entre environnement et droit au développement"),
  citation("Histoire-Géographie", "Les États parties à la présente Charte ont le devoir de promouvoir et d’assurer, par l’enseignement, l’éducation et la diffusion, le respect des droits et des libertés.", "Organisation de l’unité africaine", "Charte africaine des droits de l’homme et des peuples", "Article 25", charterUrl, "Citoyenneté", ["Charte africaine", "droits humains", "éducation", "État"], "la responsabilité des États dans l’éducation aux droits et libertés"),
  citation("Histoire-Géographie", "Chaque individu a des devoirs envers la famille et la société, envers l’État et les autres collectivités légalement reconnues et envers la Communauté Internationale.", "Organisation de l’unité africaine", "Charte africaine des droits de l’homme et des peuples", "Article 27", charterUrl, "Société", ["Charte africaine", "devoirs", "société", "communauté internationale"], "l’articulation entre droits individuels et devoirs envers les communautés"),
  citation("Histoire-Géographie", "Chaque individu a le devoir de respecter et de considérer ses semblables sans discrimination aucune.", "Organisation de l’unité africaine", "Charte africaine des droits de l’homme et des peuples", "Article 28", charterUrl, "Non-discrimination", ["Charte africaine", "tolérance", "respect", "non-discrimination"], "la tolérance réciproque comme devoir social"),

  citation("Physique-Chimie", "L’observation simple ne lui suffit pas.", "Claude Bernard", "Introduction à l’étude de la médecine expérimentale", "Première partie, chapitre I", bernardUrl, "Observation", ["Claude Bernard", "observation", "investigation", "science"], "la limite d’une observation non prolongée par des moyens d’investigation"),
  citation("Physique-Chimie", "Dans le sens philosophique, l’observation montre et l’expérience instruit.", "Claude Bernard", "Introduction à l’étude de la médecine expérimentale", "Première partie, chapitre I", bernardUrl, "Observation", ["Claude Bernard", "observation", "expérience", "méthode"], "la complémentarité entre constater un phénomène et tirer un enseignement expérimental"),
  citation("Physique-Chimie", "L’expérience n’étant en effet qu’un jugement, elle exige nécessairement comparaison entre deux choses.", "Claude Bernard", "Introduction à l’étude de la médecine expérimentale", "Première partie, chapitre I", bernardUrl, "Expérimentation", ["Claude Bernard", "expérience", "comparaison", "jugement"], "la nécessité de comparer des faits dans une expérience"),
  citation("Physique-Chimie", "Tout se passe suivant des lois qui sont absolues, c’est-à-dire toujours normales et déterminées.", "Claude Bernard", "Introduction à l’étude de la médecine expérimentale", "Première partie, chapitre I", bernardUrl, "Déterminisme", ["Claude Bernard", "loi", "déterminisme", "phénomène"], "l’idée de régularité des phénomènes naturels"),
  citation("Physique-Chimie", "L’observation est le point d’appui de l’esprit qui raisonne.", "Claude Bernard", "Introduction à l’étude de la médecine expérimentale", "Première partie, chapitre I", bernardUrl, "Raisonnement scientifique", ["Claude Bernard", "observation", "raisonnement", "faits"], "le rôle des faits observés dans le raisonnement scientifique"),
  citation("Physique-Chimie", "L’observation est le point d’appui de l’esprit qui raisonne, et l’expérience le point d’appui de l’esprit qui conclut.", "Claude Bernard", "Introduction à l’étude de la médecine expérimentale", "Première partie, chapitre I", bernardUrl, "Raisonnement scientifique", ["Claude Bernard", "observation", "expérience", "raisonnement"], "l’articulation entre les faits observés, le raisonnement et une conclusion expérimentale"),
  citation("Physique-Chimie", "L’homme ne peut dicter des lois à la nature.", "Claude Bernard", "Introduction à l’étude de la médecine expérimentale", "Première partie, chapitre II", bernardUrl, "Esprit critique", ["Claude Bernard", "nature", "critique", "méthode"], "la nécessité de confronter les idées à la nature au lieu de les imposer"),
  citation("Physique-Chimie", "L’expérimentateur, plus modeste, pose au contraire son idée comme une question.", "Claude Bernard", "Introduction à l’étude de la médecine expérimentale", "Première partie, chapitre II", bernardUrl, "Hypothèse", ["Claude Bernard", "hypothèse", "question", "expérimentateur"], "la différence entre une hypothèse vérifiable et une affirmation dogmatique"),
  citation("Physique-Chimie", "L’idée expérimentale est donc aussi une idée a priori, mais c’est une idée qui se présente sous la forme d’une hypothèse.", "Claude Bernard", "Introduction à l’étude de la médecine expérimentale", "Première partie, chapitre II", bernardUrl, "Idée expérimentale", ["Claude Bernard", "idée", "hypothèse", "expérience"], "le passage d’une intuition à une hypothèse soumise à vérification"),
  citation("Physique-Chimie", "La raison à son tour doit être guidée par l’expérience.", "Claude Bernard", "Introduction à l’étude de la médecine expérimentale", "Première partie, chapitre II", bernardUrl, "Méthode scientifique", ["Claude Bernard", "raison", "expérience", "méthode"], "le contrôle empirique indispensable aux raisonnements sur la nature"),
  citation("Physique-Chimie", "L’hypothèse expérimentale doit toujours être fondée sur une observation antérieure.", "Claude Bernard", "Introduction à l’étude de la médecine expérimentale", "Première partie, chapitre II", bernardUrl, "Hypothèse", ["Claude Bernard", "hypothèse", "observation", "méthode"], "l’ancrage d’une hypothèse dans un fait effectivement observé"),
  citation("Physique-Chimie", "Une recherche expérimentale a pour point de départ une observation.", "Claude Bernard", "Introduction à l’étude de la médecine expérimentale", "Troisième partie, chapitre I", bernardUrl, "Recherche", ["Claude Bernard", "recherche", "observation", "démarche"], "l’observation comme point de départ possible d’une recherche"),
  citation("Physique-Chimie", "Une recherche expérimentale a pour point de départ une hypothèse ou une théorie.", "Claude Bernard", "Introduction à l’étude de la médecine expérimentale", "Troisième partie, chapitre I", bernardUrl, "Recherche", ["Claude Bernard", "recherche", "hypothèse", "théorie"], "l’autre point de départ possible : une hypothèse ou une théorie à éprouver"),
  citation("Physique-Chimie", "Il n’y a pas de mauvaises expériences.", "Claude Bernard", "Introduction à l’étude de la médecine expérimentale", "Troisième partie, chapitre I", bernardUrl, "Expérimentation", ["Claude Bernard", "expérience", "résultat", "découverte"], "l’intérêt scientifique d’un résultat inattendu lorsqu’il est observé et interprété"),
  citation("Physique-Chimie", "Il y a un déterminisme absolu dans toutes les sciences.", "Claude Bernard", "Introduction à l’étude de la médecine expérimentale", "Deuxième partie, chapitre I", bernardUrl, "Déterminisme", ["Claude Bernard", "déterminisme", "science", "conditions"], "la recherche de conditions nécessaires aux phénomènes étudiés"),
  citation("Physique-Chimie", "Le but que se propose la méthode expérimentale est le même partout ; il consiste à rattacher par l’expérience les phénomènes naturels à leurs conditions d’existence ou à leurs causes prochaines.", "Claude Bernard", "Introduction à l’étude de la médecine expérimentale", "Deuxième partie, chapitre I", bernardUrl, "Méthode scientifique", ["Claude Bernard", "causalité", "conditions", "méthode expérimentale"], "la recherche de causes prochaines et de conditions d’existence"),
  citation("Physique-Chimie", "L’un et l’autre se proposent pour but commun de remonter à la cause prochaine des phénomènes qu’ils étudient.", "Claude Bernard", "Introduction à l’étude de la médecine expérimentale", "Deuxième partie, chapitre I", bernardUrl, "Causalité", ["Claude Bernard", "cause", "physique", "biologie"], "l’unité de but entre l’étude des corps vivants et celle des corps bruts"),
  citation("Physique-Chimie", "Il n’y a pas des forces en opposition et en lutte les unes avec les autres ; dans la nature il ne saurait y avoir qu’arrangement et dérangement, qu’harmonie et désharmonie.", "Claude Bernard", "Introduction à l’étude de la médecine expérimentale", "Deuxième partie, chapitre I", bernardUrl, "Causalité", ["Claude Bernard", "nature", "harmonie", "phénomène"], "la recherche de relations organisées plutôt que l’invocation de forces mystérieuses"),
  citation("Physique-Chimie", "La critique expérimentale ne doit porter que sur des faits et jamais sur des mots.", "Claude Bernard", "Introduction à l’étude de la médecine expérimentale", "Troisième partie, chapitre I", bernardUrl, "Esprit critique", ["Claude Bernard", "critique", "faits", "méthode"], "la priorité donnée à la discussion des faits sur les querelles de vocabulaire"),
  citation("Physique-Chimie", "Toute l’initiative expérimentale est dans l’idée, car c’est elle qui provoque l’expérience.", "Claude Bernard", "Introduction à l’étude de la médecine expérimentale", "Première partie, chapitre II", bernardUrl, "Idée expérimentale", ["Claude Bernard", "idée", "initiative", "expérience"], "le rôle moteur d’une idée dans la conception d’une expérience"),
];

function renderExerciseQuestions(variable, questions) {
  return questions.map(([type, prompt, options, correct, explanation, order]) => `      (${variable},${sqlText(type)},${sqlText(prompt)},${jsonArray(options)},${jsonArray(correct)},${sqlText(explanation)},${order})`).join(",\n");
}

const quizQuestions = lesson.quiz.questions.map(([prompt, explanation, _answers, order]) => `        (quiz_uuid,${sqlText(prompt)},${sqlText(explanation)},'single_choice',${order},1,true)`).join(",\n");
const quizAnswers = lesson.quiz.questions.flatMap(([_prompt, _explanation, answers, order]) => [`        (${order},${sqlText(answers[0])},true,10)`, `        (${order},${sqlText(answers[1])},false,20)`]).join(",\n");
const citationRows = citations.map(([subject, quoteText, author, sourceTitle, reference, url, explanation, keywords, theme]) => `      (${sqlText(subject)},${sqlText(quoteText)},${sqlText(author)},${sqlText(sourceTitle)},${sqlText(reference)},${sqlText(url)},${sqlText(explanation)},${textArray(keywords)},${sqlText(theme)})`).join(",\n");

const sql = `-- Brouillons SVT Terminale A1/A2 : biosynthèse des protéines.
-- L8 évolution contrôlée comme doublon pédagogique déjà couvert : aucune création ni écrasement.
-- Citations : 20 nouvelles citations authentiques équilibrées par matière, toutes en brouillon.
do $svt_terminal_lot3$
declare
  a2 record;
  nutrient_chapter_uuid uuid;
  target record;
  next_chapter_order integer;
  exercise_a_uuid uuid;
  exercise_b_uuid uuid;
  quiz_uuid uuid;
  expected_count integer;
begin
  select o.id as offering_id,o.subject_id,o.level_id,o.series_id into a2
  from public.course_subject_offerings o join public.subjects sub on sub.id=o.subject_id join public.levels lv on lv.id=o.level_id join public.series s on s.id=o.series_id
  where sub.name='Sciences de la Vie et de la Terre' and lv.name='Terminale' and s.name='A2' limit 1;
  if a2.offering_id is null then raise exception 'Offre SVT Terminale A2 introuvable.'; end if;

  select coalesce(max(c.display_order),0)+10 into next_chapter_order from public.chapters c where c.subject_offering_id=a2.offering_id;
  insert into public.chapters (subject_id,level_id,series_id,subject_offering_id,title,description,display_order,is_test_data,is_active)
  select a2.subject_id,a2.level_id,a2.series_id,a2.offering_id,${sqlText(lesson.chapter)},'Étude du devenir des nutriments et de la biosynthèse des protéines.',next_chapter_order,false,false
  where not exists (select 1 from public.chapters c where c.subject_offering_id=a2.offering_id and c.title=${sqlText(lesson.chapter)});
  select c.id into nutrient_chapter_uuid from public.chapters c where c.subject_offering_id=a2.offering_id and c.title=${sqlText(lesson.chapter)} limit 1;
  if nutrient_chapter_uuid is null then raise exception 'Chapitre SVT A2 sur le devenir des nutriments introuvable.'; end if;
  insert into public.lessons (chapter_id,title,description,content,display_order,is_test_data,is_active)
  select nutrient_chapter_uuid,${sqlText(lesson.title)},${sqlText(lesson.description)},null,10,false,false
  where not exists (select 1 from public.lessons l where l.chapter_id=nutrient_chapter_uuid and l.title=${sqlText(lesson.title)});

  select count(*) into expected_count
  from public.lessons l join public.chapters c on c.id=l.chapter_id join public.course_subject_offerings o on o.id=c.subject_offering_id join public.subjects sub on sub.id=o.subject_id join public.levels lv on lv.id=o.level_id join public.series s on s.id=o.series_id
  where sub.name='Sciences de la Vie et de la Terre' and lv.name='Terminale' and s.name in ('A1','A2') and c.title=${sqlText(lesson.chapter)} and l.title=${sqlText(lesson.title)};
  if expected_count <> 2 then raise exception 'Deux leçons SVT A1/A2 de biosynthèse sont requises avant remplissage ; transaction annulée.'; end if;

  for target in
    select l.id as lesson_id,c.id as chapter_id,o.id as offering_id,o.subject_id,o.level_id,o.series_id
    from public.lessons l join public.chapters c on c.id=l.chapter_id join public.course_subject_offerings o on o.id=c.subject_offering_id join public.subjects sub on sub.id=o.subject_id join public.levels lv on lv.id=o.level_id join public.series s on s.id=o.series_id
    where sub.name='Sciences de la Vie et de la Terre' and lv.name='Terminale' and s.name in ('A1','A2') and c.title=${sqlText(lesson.chapter)} and l.title=${sqlText(lesson.title)}
    order by s.name,c.display_order,l.display_order
  loop
    if exists (select 1 from public.lessons where id=target.lesson_id and coalesce(btrim(content),'') <> '') then raise exception 'La leçon SVT % contient déjà un cours. Écrasement interdit.', target.lesson_id; end if;
    update public.lessons set description=${sqlText(lesson.description)},content=$biosynthese$
${lesson.course}
$biosynthese$,is_active=false where id=target.lesson_id and coalesce(btrim(content),'')='';

    exercise_a_uuid := null;
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
    select target.subject_id,target.level_id,target.series_id,target.chapter_id,target.lesson_id,${sqlText(lesson.exerciseA.title)},'Répondez aux questions en mobilisant les définitions et les étapes décrites dans le cours.','La correction relie chaque réponse au mécanisme de biosynthèse étudié.','single_choice','easy','## Consigne\n\nChoisissez la réponse juste puis relisez la partie correspondante du cours.','## Correction\n\nChaque réponse est expliquée avec le vocabulaire précis de la leçon.',false,false,15,10
    where not exists (select 1 from public.exercises e where e.lesson_id=target.lesson_id and e.title=${sqlText(lesson.exerciseA.title)}) returning id into exercise_a_uuid;
    if exercise_a_uuid is not null then
      insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
${renderExerciseQuestions("exercise_a_uuid", lesson.exerciseA.questions)};
    end if;

    exercise_b_uuid := null;
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
    select target.subject_id,target.level_id,target.series_id,target.chapter_id,target.lesson_id,${sqlText(lesson.exerciseB.title)},'Analysez le passage de l’information génétique à la chaîne polypeptidique.','La correction distingue précisément transcription et traduction.','single_choice','medium','## Consigne\n\nChoisissez l’analyse la plus complète et justifiez-la par une notion précise.','## Correction\n\nUne bonne réponse distingue un lieu, un acteur, une information et une étape du mécanisme.',false,false,20,20
    where not exists (select 1 from public.exercises e where e.lesson_id=target.lesson_id and e.title=${sqlText(lesson.exerciseB.title)}) returning id into exercise_b_uuid;
    if exercise_b_uuid is not null then
      insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
${renderExerciseQuestions("exercise_b_uuid", lesson.exerciseB.questions)};
    end if;

    quiz_uuid := null;
    insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active)
    select target.subject_id,target.level_id,target.series_id,target.offering_id,target.chapter_id,target.lesson_id,${sqlText(lesson.quiz.title)},'Vérifiez votre maîtrise des acteurs, du code génétique, de la transcription et de la traduction.','medium',12,10,false,false
    where not exists (select 1 from public.quizzes q where q.lesson_id=target.lesson_id and q.title=${sqlText(lesson.quiz.title)}) returning id into quiz_uuid;
    if quiz_uuid is not null then
      with inserted_questions as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
${quizQuestions}
      returning id,display_order)
      insert into public.quiz_answers (question_id,answer,is_correct,display_order)
      select inserted_questions.id,answers.answer,answers.is_correct,answers.display_order from inserted_questions join (values
${quizAnswers}
      ) as answers(question_order,answer,is_correct,display_order) on answers.question_order=inserted_questions.display_order;
    end if;
  end loop;
end;
$svt_terminal_lot3$;

do $citations_lot3$
declare citation_seed record; citation_subject_uuid uuid; citation_uuid uuid;
begin
  for citation_seed in select * from (values
${citationRows}
  ) as seed(subject_name,quote_text,author,source_title,source_reference,source_url,pedagogical_explanation,keywords,theme) loop
    citation_uuid := null;
    select id into citation_subject_uuid from public.subjects where name=citation_seed.subject_name limit 1;
    if citation_subject_uuid is null then raise exception 'Matière Citations % introuvable.', citation_seed.subject_name; end if;
    insert into public.citations (subject_id,quote_text,author,source_title,source_reference,source_url,pedagogical_explanation,keywords,is_active,is_validated)
    select citation_subject_uuid,citation_seed.quote_text,citation_seed.author,citation_seed.source_title,citation_seed.source_reference,citation_seed.source_url,citation_seed.pedagogical_explanation,citation_seed.keywords,false,false
    where not exists (select 1 from public.citations c where c.subject_id=citation_subject_uuid and c.quote_text=citation_seed.quote_text and c.author=citation_seed.author)
    returning id into citation_uuid;
    if citation_uuid is not null then
      insert into public.citation_scopes (citation_id,level_id,series_id) select citation_uuid,lv.id,s.id from public.levels lv cross join public.series s where lv.name='Terminale' and s.name in ('A1','A2','C','D');
      insert into public.citation_themes (citation_id,theme) values (citation_uuid,citation_seed.theme);
    end if;
  end loop;
end;
$citations_lot3$;
`;

mkdirSync(dirname(migrationPath), { recursive: true });
writeFileSync(migrationPath, sql);
console.log(migrationPath);
