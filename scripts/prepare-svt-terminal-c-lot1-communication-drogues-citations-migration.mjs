import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const migrationPath = resolve(
  "supabase/migrations/20260820_svt_terminale_c_communication_drogues_citations_drafts.sql",
);
const applyInputPath = resolve(
  "supabase/migrations/20260820_svt_terminale_c_communication_drogues_citations_drafts.apply.json",
);

const sqlText = (value) => `'${String(value).replaceAll("'", "''")}'`;
const jsonArray = (values) => `jsonb_build_array(${values.map(sqlText).join(", ")})`;
const textArray = (values) => `array[${values.map(sqlText).join(", ")}]::text[]`;

const lessons = [
  {
    id: "5309406d-0ab9-4958-a2e9-af5f16a6b1c0",
    title: "Leçon 1 : La communication nerveuse.",
    description:
      "Organisation du neurone, potentiel de membrane, potentiel d’action, base ionique et transmission synaptique.",
    content: String.raw`## La communication nerveuse

> **Objectif :** expliquer comment l’information nerveuse se propage dans l’organisme, depuis le neurone jusqu’à la synapse.

## 1. Partir d’une situation concrète

Lorsqu’une personne se pique avec une épine, elle retire très rapidement sa main. Cette réponse suppose qu’une information circule dans l’organisme. Le support appelle cette information l’**influx nerveux**.

> **Définition : influx nerveux.** Signal transmis dans le système nerveux. Dans cette leçon, il se propage électriquement le long d’un neurone puis se transmet chimiquement au niveau d’une synapse.

La question directrice est donc : **comment l’influx nerveux se propage-t-il dans l’organisme ?**

## 2. Du nerf au neurone

Un **nerf** n’est pas une cellule unique. Le document le présente comme un ensemble protégé par une gaine conjonctive et formé de faisceaux d’axones. Ces axones appartiennent à des neurones.

| Élément | Description utile | Rôle dans l’étude |
|---|---|---|
| Neurone | Cellule spécialisée constituée notamment d’un corps cellulaire, de prolongements et d’un axone | Support de propagation de l’influx nerveux |
| Soma ou péricaryon | Corps cellulaire du neurone | Partie contenant le centre cellulaire présenté dans le schéma |
| Axone | Long prolongement du neurone | Voie de propagation du signal électrique |
| Arborisation terminale | Extrémité ramifiée de l’axone | Zone de contact avec d’autres cellules |
| Cellules gliales | Cellules associées aux neurones | Elles sont indiquées dans la structure observée |
| Myéline | Enveloppe présente autour de certains axones | Elle alterne avec les nœuds de Ranvier sur le schéma |
| Nœuds de Ranvier | Interruptions de la gaine de myéline | Repères structuraux visibles sur certains axones |

> **Définition : axone.** Prolongement cellulaire le long duquel se propage l’influx nerveux étudié.  
> **Définition : myéline.** Enveloppe associée à certains axones, séparée par des nœuds de Ranvier.

> **Attention :** le nerf est un regroupement de fibres nerveuses, tandis que le neurone est une cellule. Ne confondez pas ces deux niveaux d’organisation.

## 3. Le potentiel de membrane : un état électrique de référence

Le document prend le milieu extérieur comme potentiel de référence :

$$
V_{\text{extérieur}} = 0\ \text{mV}
$$

Au repos, l’intérieur de la membrane du neurone est négatif par rapport à l’extérieur. Le potentiel de membrane indiqué dans le support est voisin de :

$$
V_{\text{membrane}} \approx -70\ \text{mV}
$$

> **Définition : potentiel de membrane.** Différence électrique mesurée entre l’intérieur et l’extérieur de la membrane d’un neurone.  
> **Définition : millivolt (mV).** Mille fois plus petit qu’un volt ; c’est l’unité utilisée ici pour décrire les variations électriques.

Un enregistrement peut aussi faire apparaître un **artefact**. Il s’agit d’un signal lié au dispositif ou à la stimulation, qui ne correspond pas à la réponse électrique proprement dite du neurone. Il faut donc l’identifier avant d’interpréter la courbe.

## 4. Le potentiel d’action : une variation brève et organisée

Une stimulation efficace déclenche un **potentiel d’action**. Dans l’enregistrement présenté, il se distingue du potentiel de repos par une succession ordonnée de variations.

| Étape | Ce que montre la courbe | Vocabulaire à employer |
|---|---|---|
| Latence | Court délai entre la stimulation et la réponse | Latence |
| Montée de la courbe | Le potentiel devient moins négatif puis positif | Dépolarisation |
| Descente | Le potentiel revient vers la valeur de repos | Repolarisation |
| Passage transitoire sous le repos | Le potentiel devient momentanément plus négatif que le repos | Hyperpolarisation |
| Retour durable vers le repos | Le potentiel se stabilise à nouveau près de \(-70\) mV | Restauration |

Selon la disposition des électrodes, l’enregistrement peut être **monophasique** ou **diphasique**. Dans les deux cas, l’élève doit surtout reconnaître qu’il s’agit d’une réponse électrique et organiser correctement les étapes observées.

> **Méthode : lire une courbe.** Repérez d’abord la ligne de repos, puis localisez la stimulation et l’artefact éventuel. Lisez ensuite la réponse de gauche à droite : latence, dépolarisation, repolarisation, hyperpolarisation, retour au repos.

## 5. La base ionique du potentiel de membrane et du potentiel d’action

Le support relie les variations électriques aux déplacements d’ions à travers la membrane.

> **Définition : ion.** Particule portant une charge électrique. Dans la leçon, les ions importants sont le sodium \(Na^+\) et le potassium \(K^+\).  
> **Définition : perméabilité membranaire.** Possibilité pour une substance ou un ion de franchir une membrane.

Au repos, la répartition de \(K^+\) et de \(Na^+\), ainsi que les perméabilités de la membrane, contribuent au potentiel de membrane. Les canaux **voltage-dépendants** participent aux variations observées lors du potentiel d’action.

| Mécanisme cité dans le support | Idée essentielle |
|---|---|
| Mouvements passifs d’ions | Des ions se déplacent selon les conditions de part et d’autre de la membrane |
| Canaux voltage-dépendants | Leur ouverture ou leur fermeture dépend de l’état électrique de la membrane |
| Pompe \(Na^+/K^+\) | Elle utilise l’énergie de l’ATP pour faire sortir 3 \(Na^+\) et faire entrer 2 \(K^+\) |

$$
3\,Na^+\ \text{sortent} \qquad ; \qquad 2\,K^+\ \text{entrent}
$$

> **Définition : ATP.** Molécule dont l’énergie est utilisée, dans le modèle présenté, par la pompe \(Na^+/K^+\).  
> **Attention :** la pompe \(Na^+/K^+\) ne correspond pas à un simple mouvement passif : le support précise qu’elle utilise l’énergie de l’ATP.

## 6. La synapse : transmettre l’information d’une cellule à une autre

La propagation le long de l’axone est électrique. À la jonction entre deux cellules, l’information passe par une **synapse**.

> **Définition : synapse.** Zone de communication entre une cellule nerveuse et une autre cellule. Elle comporte un élément présynaptique, une fente synaptique et un élément postsynaptique.

Le document distingue notamment les synapses **axo-axonique**, **axo-dendritique**, **axo-somatique** et la **jonction neuromusculaire**. Ces noms indiquent les parties cellulaires mises en relation.

### Étapes de la transmission synaptique

1. Le potentiel d’action atteint l’extrémité présynaptique de l’axone.
2. Des ions \(Ca^{2+}\) entrent dans cette terminaison.
3. Les vésicules contenant un neurotransmetteur se déplacent et libèrent leur contenu par **exocytose**.
4. Le neurotransmetteur, par exemple l’**acétylcholine** indiquée par le support, traverse la fente synaptique.
5. Il se fixe sur des récepteurs de la membrane postsynaptique.
6. Cette fixation est associée, dans le modèle présenté, à une entrée de \(Na^+\) et à une nouvelle réponse électrique.
7. Le neurotransmetteur est ensuite éliminé par hydrolyse et/ou recapture selon les éléments indiqués par le schéma.

> **Définition : neurotransmetteur.** Substance chimique libérée par l’élément présynaptique et reconnue par des récepteurs postsynaptiques.  
> **Définition : exocytose.** Libération du contenu d’une vésicule vers l’extérieur de la cellule.  
> **Définition : fente synaptique.** Petit espace séparant les deux éléments de la synapse.

> **Attention :** il faut distinguer deux mécanismes complémentaires : **propagation électrique dans l’axone** et **transmission chimique à la synapse**.

## 7. Schéma fonctionnel à retenir

$$
\text{potentiel d’action dans l’axone}
\rightarrow \text{entrée de } Ca^{2+}
\rightarrow \text{exocytose du neurotransmetteur}
\rightarrow \text{récepteurs postsynaptiques}
\rightarrow \text{nouvelle réponse}
$$

## 8. Synthèse

> **Synthèse :** un nerf rassemble des axones appartenant à des neurones. Le neurone présente au repos un potentiel de membrane proche de \(-70\) mV. Une stimulation efficace provoque un potentiel d’action caractérisé par une dépolarisation, une repolarisation et un retour au repos ; les ions \(Na^+\) et \(K^+\), leurs canaux et la pompe \(Na^+/K^+\) participent à cette organisation. À la synapse, l’arrivée du signal entraîne l’entrée de \(Ca^{2+}\), l’exocytose d’un neurotransmetteur puis l’activation de récepteurs postsynaptiques.

## Référence pédagogique

Contenu reformulé, structuré et approfondi à partir du PDF fourni : **« La communication nerveuse »**, SVT, Terminale C, Côte d’Ivoire – École numérique.`,
    exerciseA: {
      title: "Exercice 1 — Neurone et potentiel d’action",
      duration: 15,
      difficulty: "easy",
      statement:
        "Identifiez les structures du neurone et les étapes visibles sur un enregistrement du potentiel d’action.",
      solution:
        "La correction mobilise le vocabulaire de structure et l’ordre de lecture d’une courbe électrique.",
      questions: [
        ["single_choice", "Quel élément est le long prolongement du neurone qui sert de voie de propagation dans la leçon ?", ["L’axone", "La fente synaptique", "La gaine conjonctive", "Le neurotransmetteur"], ["L’axone"], "L’axone est le prolongement du neurone le long duquel se propage le signal électrique étudié.", 10],
        ["single_choice", "Quelle valeur de potentiel de membrane au repos est indiquée dans le support ?", ["Environ −70 mV", "0 mV", "Environ +70 mV", "3 mV"], ["Environ −70 mV"], "Le potentiel de membrane au repos est présenté comme voisin de −70 mV lorsque le milieu extérieur est pris comme référence à 0 mV.", 20],
        ["single_choice", "Après la dépolarisation, quelle étape décrit le retour du potentiel vers sa valeur de repos ?", ["La repolarisation", "La latence", "L’artefact", "L’exocytose"], ["La repolarisation"], "La repolarisation correspond à la descente de la courbe vers le potentiel de repos.", 30],
      ],
    },
    exerciseB: {
      title: "Exercice 2 — Transmission au niveau d’une synapse",
      duration: 20,
      difficulty: "medium",
      statement:
        "Organisez les étapes de la transmission synaptique et reliez-les aux acteurs cellulaires appropriés.",
      solution:
        "La correction distingue l’arrivée du signal électrique, la libération chimique et la réponse postsynaptique.",
      questions: [
        ["single_choice", "Quel ion entre dans l’élément présynaptique lorsque le potentiel d’action arrive selon le schéma du cours ?", ["Ca²⁺", "K⁺ uniquement", "Cl⁻ uniquement", "ATP"], ["Ca²⁺"], "Le support relie l’arrivée du potentiel d’action à une entrée de Ca²⁺ dans la terminaison présynaptique.", 10],
        ["single_choice", "Quel processus libère le neurotransmetteur contenu dans les vésicules ?", ["L’exocytose", "La myélinisation", "L’hyperpolarisation", "La latence"], ["L’exocytose"], "L’exocytose libère le contenu des vésicules vers la fente synaptique.", 20],
        ["true_false", "La transmission au niveau d’une synapse est décrite comme une transmission chimique, tandis que la propagation le long de l’axone est électrique.", ["Vrai", "Faux"], ["Vrai"], "Le cours insiste sur cette distinction fondamentale entre l’axone et la synapse.", 30],
      ],
    },
    quiz: {
      title: "Quiz de révision — Communication nerveuse",
      questions: [
        ["Qu’est-ce qu’un potentiel de membrane ?", "C’est la différence électrique entre l’intérieur et l’extérieur de la membrane du neurone.", ["Une différence électrique entre l’intérieur et l’extérieur de la membrane", "Une substance libérée dans la fente synaptique"], 10],
        ["Quel mécanisme utilise l’énergie de l’ATP dans le modèle du cours ?", "La pompe Na⁺/K⁺ utilise l’énergie de l’ATP pour faire sortir 3 Na⁺ et entrer 2 K⁺.", ["La pompe Na⁺/K⁺", "La fente synaptique"], 20],
        ["Quel neurotransmetteur est explicitement cité dans le support ?", "L’acétylcholine est donnée comme exemple de neurotransmetteur.", ["L’acétylcholine", "La myéline"], 30],
        ["Quelle structure sépare l’élément présynaptique de l’élément postsynaptique ?", "La fente synaptique est le petit espace entre les deux éléments.", ["La fente synaptique", "Le soma"], 40],
      ],
    },
  },
  {
    id: "4cdc042d-3932-4b48-ad20-c14fa9bc9bce",
    title: "Leçon 2 : Les drogues et le système nerveux.",
    description:
      "Effets des drogues sur l’activité nerveuse, action synaptique, conséquences et prévention.",
    content: String.raw`## Les drogues et le système nerveux

> **Objectif :** expliquer comment les drogues modifient l’activité nerveuse, en particulier au niveau de la synapse, puis identifier les enjeux de prévention.

## 1. Une question de santé et de fonctionnement nerveux

Le support s’appuie sur une activité de club santé et sur une observation conduite dans un centre de désintoxication. Il pose une question essentielle : **comment les drogues agissent-elles sur l’être humain ?**

Le cours n’analyse pas les drogues comme de simples produits isolés : il relie leurs effets à l’activité du système nerveux et à la communication synaptique.

> **Définition : système nerveux.** Ensemble d’organes et de cellules qui assurent la réception, la transmission et le traitement d’informations dans l’organisme.  
> **Définition : synapse.** Zone de communication entre deux cellules, où intervient la libération et l’action d’un neuromédiateur.

## 2. Des effets opposés sur l’activité nerveuse

Le PDF compare des enregistrements d’activité nerveuse. Il indique que la **nicotine** augmente l’amplitude et la fréquence des potentiels d’action, alors que le **diazépam** les diminue.

| Catégorie employée dans le support | Effet général sur l’activité nerveuse | Repère du document |
|---|---|---|
| Psychostimulant | Effet excitateur : l’activité nerveuse augmente | La nicotine est présentée avec une augmentation d’amplitude et de fréquence |
| Psychodépresseur | Effet inhibiteur : l’activité nerveuse diminue | Le diazépam est présenté avec une diminution d’amplitude et de fréquence |

> **Définition : amplitude.** Importance verticale d’une variation sur une courbe d’enregistrement.  
> **Définition : fréquence.** Nombre de réponses ou d’événements observés pendant une durée donnée.  
> **Définition : psychostimulant.** Substance décrite dans le cours par un effet excitateur sur l’activité nerveuse.  
> **Définition : psychodépresseur.** Substance décrite dans le cours par un effet inhibiteur sur l’activité nerveuse.

> **Méthode : comparer deux tracés.** Observez séparément l’amplitude et la fréquence. Une hausse des deux valeurs traduit ici un effet excitateur ; une baisse traduit un effet inhibiteur.

## 3. Le point commun : une action au niveau de la synapse

La synapse est le lieu central de l’explication. Pour comprendre l’action d’une substance, il faut distinguer trois opérations :

1. la **libération** du neuromédiateur par l’élément présynaptique ;
2. sa **recapture**, c’est-à-dire son retour ou son retrait après son action ;
3. sa **fixation** sur les récepteurs de l’élément postsynaptique.

> **Définition : neuromédiateur.** Substance chimique libérée dans la fente synaptique et reconnue par des récepteurs de la cellule postsynaptique.  
> **Définition : recapture.** Mécanisme par lequel un neuromédiateur est retiré de la fente synaptique, notamment par retour vers l’élément présynaptique.  
> **Définition : récepteur.** Structure capable de reconnaître un neuromédiateur et de participer à la réponse postsynaptique.

### Les modes d’action étudiés

| Effet sur la synapse | Conséquence fonctionnelle exposée dans le support |
|---|---|
| Libération continue de neuromédiateurs | La communication synaptique est favorisée de manière anormale dans le modèle étudié |
| Blocage de la recapture | Le neuromédiateur reste davantage disponible dans la fente synaptique |
| Blocage de la libération | La transmission synaptique est freinée |
| Blocage de la fixation sur les récepteurs | Le neuromédiateur ne peut plus produire normalement sa réponse postsynaptique |

Le document cite les **amphétamines**, la **cocaïne**, la **morphine**, le **LSD** et les **tranquillisants** dans les activités consacrées aux modes d’action. Les termes doivent être utilisés avec rigueur : il s’agit d’expliquer une modification de la communication synaptique et non de banaliser la consommation.

> **Attention :** libération, recapture et fixation sont trois étapes différentes. Dans une question, commencez par identifier précisément laquelle est modifiée avant de déduire l’effet sur la synapse.

## 4. Comprendre une expérience sur la dopamine

Le support propose une activité sur la dopamine dans la fente synaptique chez des rats. Cette situation doit être lue comme une démarche scientifique : un document ou une courbe permet d’observer la quantité ou la présence de dopamine dans l’espace synaptique, puis de relier cette observation à la libération ou à la recapture.

> **Définition : dopamine.** Neuromédiateur cité dans l’activité d’analyse du document.  
> **Méthode : interpréter un document synaptique.** Identifiez d’abord le neuromédiateur étudié ; repérez ensuite ce qui varie dans la fente synaptique ; enfin reliez cette variation à la libération, à la recapture ou à la fixation évoquée dans l’énoncé.

## 5. Conséquences et prévention

Le PDF distingue les conséquences pour le consommateur et les répercussions sociales. Sans ajouter d’informations non présentes dans le support, il faut retenir que la consommation de drogues ne concerne pas seulement une cellule ou une synapse : elle pose aussi une question de santé et de vie collective.

Les réponses mises en avant sont les suivantes :

| Action | Sens dans le cours |
|---|---|
| Prévention et sensibilisation | Informer pour éviter la consommation et ses conséquences |
| Vie sans drogue | Choix de protection de la santé et de la vie sociale |
| Désintoxication | Démarche de prise en charge mentionnée par le support |
| Rééducation | Accompagnement cité dans la continuité de la désintoxication |

> **Définition : désintoxication.** Démarche mentionnée dans le support pour la prise en charge d’une personne confrontée à la consommation de drogues.  
> **Définition : rééducation.** Accompagnement cité par le document dans la continuité de cette prise en charge.

## 6. Raisonnement de synthèse

$$
\text{drogue}
\rightarrow \text{modification de la communication synaptique}
\rightarrow \text{variation de l’activité nerveuse}
\rightarrow \text{conséquences individuelles et sociales}
$$

> **Synthèse :** les drogues étudiées modifient l’activité du système nerveux. Le support distingue des effets psychostimulants et psychodépresseurs à partir de variations d’amplitude et de fréquence des potentiels d’action. Leur action s’explique par des modifications de la libération, de la recapture ou de la fixation de neuromédiateurs au niveau de la synapse. La prévention, la sensibilisation, la désintoxication et la rééducation constituent les réponses explicitement indiquées.

## Référence pédagogique

Contenu reformulé, structuré et approfondi à partir du PDF fourni : **« Les drogues et le système nerveux »**, SVT, Terminale C, Côte d’Ivoire – École numérique.`,
    exerciseA: {
      title: "Exercice 1 — Effets sur l’activité nerveuse",
      duration: 15,
      difficulty: "easy",
      statement:
        "Comparez les effets présentés pour la nicotine et le diazépam en utilisant les notions d’amplitude, de fréquence et de catégorie d’effet.",
      solution:
        "La correction identifie l’augmentation ou la diminution de l’activité nerveuse et la catégorie correspondante.",
      questions: [
        ["single_choice", "Quel effet le support attribue-t-il à la nicotine sur les potentiels d’action ?", ["Une augmentation de l’amplitude et de la fréquence", "Une disparition de toute activité nerveuse", "Une diminution de l’amplitude et de la fréquence", "Aucun effet mesurable"], ["Une augmentation de l’amplitude et de la fréquence"], "Le document présente la nicotine avec une augmentation d’amplitude et de fréquence des potentiels d’action.", 10],
        ["single_choice", "Comment le support qualifie-t-il un effet excitateur sur l’activité nerveuse ?", ["Psychostimulant", "Psychodépresseur", "Artefact", "Recapture"], ["Psychostimulant"], "Le terme psychostimulant est associé à un effet excitateur dans la leçon.", 20],
        ["single_choice", "Quel effet le support attribue-t-il au diazépam ?", ["Une diminution de l’amplitude et de la fréquence", "Une augmentation continue de la recapture", "Une production de myéline", "Un potentiel de référence à 0 mV"], ["Une diminution de l’amplitude et de la fréquence"], "Le diazépam est présenté avec une diminution de l’amplitude et de la fréquence, donc un effet inhibiteur dans le modèle du cours.", 30],
      ],
    },
    exerciseB: {
      title: "Exercice 2 — Drogues et communication synaptique",
      duration: 20,
      difficulty: "medium",
      statement:
        "Distinguez libération, recapture et fixation afin d’interpréter les modes d’action synaptique étudiés.",
      solution:
        "La correction associe chaque mécanisme à l’étape correspondante de la communication synaptique.",
      questions: [
        ["single_choice", "Quel mécanisme maintient davantage de neuromédiateur disponible dans la fente synaptique dans le modèle étudié ?", ["Le blocage de la recapture", "Le blocage de la libération", "La destruction de l’axone", "La formation de myéline"], ["Le blocage de la recapture"], "Si la recapture est bloquée, le neuromédiateur reste davantage disponible dans la fente synaptique.", 10],
        ["single_choice", "Quelle étape est directement concernée lorsqu’une substance empêche le neuromédiateur d’agir sur la cellule postsynaptique ?", ["La fixation sur les récepteurs", "La formation du soma", "La latence", "La gaine conjonctive"], ["La fixation sur les récepteurs"], "La fixation sur les récepteurs permet au neuromédiateur d’être reconnu par l’élément postsynaptique.", 20],
        ["true_false", "La prévention et la sensibilisation font partie des réponses proposées par le support face aux conséquences de la consommation de drogues.", ["Vrai", "Faux"], ["Vrai"], "Le PDF cite explicitement la prévention et la sensibilisation, ainsi que la désintoxication et la rééducation.", 30],
      ],
    },
    quiz: {
      title: "Quiz de révision — Drogues et système nerveux",
      questions: [
        ["Que désigne la recapture dans ce cours ?", "C’est le retrait ou le retour d’un neuromédiateur après son action dans la fente synaptique.", ["Le retrait ou retour d’un neuromédiateur après son action", "La fabrication d’un potentiel de repos"], 10],
        ["Quel neuromédiateur est cité dans l’activité sur des rats ?", "L’activité du support porte sur la dopamine dans la fente synaptique.", ["La dopamine", "La myéline"], 20],
        ["Quel enchaînement résume le raisonnement de la leçon ?", "Une drogue modifie une communication synaptique, ce qui modifie l’activité nerveuse et peut avoir des conséquences individuelles et sociales.", ["Drogue → synapse → activité nerveuse → conséquences", "Drogue → myéline → ATP → absence de prévention"], 30],
        ["Quelle démarche est citée après la désintoxication dans les réponses du cours ?", "La rééducation est explicitement mentionnée avec la désintoxication.", ["La rééducation", "La publication automatique d’un cours"], 40],
      ],
    },
  },
];

const sources = {
  fables: "https://fr.wikisource.org/wiki/Fables_de_La_Fontaine_(%C3%A9d._Barbin)",
  moliere: "https://fr.wikisource.org/wiki/Le_Misanthrope/%C3%89dition_Louandre,_1910/Acte_I",
  baudelaire: "https://fr.wikisource.org/wiki/Les_Fleurs_du_mal_(1861)/Texte_entier",
  montesquieu: "https://fr.wikisource.org/wiki/De_l%E2%80%99esprit_des_lois_(%C3%A9d._Nourse)/Texte_entier",
  kant: "https://fr.wikisource.org/wiki/Fondements_de_la_m%C3%A9taphysique_des_m%C5%93urs_(trad._Delbos)/Deuxi%C3%A8me_section",
  udhr: "https://www.un.org/fr/about-us/universal-declaration-of-human-rights",
  bernard: "https://fr.wikisource.org/wiki/Introduction_%C3%A0_l%E2%80%99%C3%A9tude_de_la_m%C3%A9decine_exp%C3%A9rimentale/Premi%C3%A8re_partie/Chapitre_II",
  poincare: "https://fr.wikisource.org/wiki/La_Science_et_l%E2%80%99Hypoth%C3%A8se/Texte_entier",
};

const explanationBySubject = {
  Français: (theme) => `Cette citation éclaire la notion « ${theme} ». Elle aide l’élève à justifier une interprétation par le lexique, l’image, l’opposition ou la portée critique du texte.`,
  Philosophie: (theme) => `Cette citation permet d’étudier la notion « ${theme} ». Elle fournit un appui précis pour formuler une thèse, définir un concept et construire une argumentation raisonnée.`,
  "Histoire-Géographie": (theme) => `Cette citation de la Déclaration universelle des droits de l’homme éclaire la notion « ${theme} ». Elle permet de relier droits, citoyenneté, institutions et relations internationales à un texte de référence.`,
  "Physique-Chimie": (theme) => `Cette formulation met en évidence la notion « ${theme} ». Elle aide à distinguer observation, hypothèse, expérimentation, vérification et esprit critique dans une démarche scientifique.`,
};

const citation = (subject, theme, author, sourceTitle, sourceReference, sourceUrl, quoteText) => [
  subject,
  quoteText,
  author,
  sourceTitle,
  sourceReference,
  sourceUrl,
  explanationBySubject[subject](theme),
  [subject, author, theme.toLowerCase()],
  theme,
];

const citations = [
  // Français — 10 notions indépendantes, 2 citations chacune.
  citation("Français", "Sincérité", "Molière", "Le Misanthrope", "Acte I, scène 1", sources.moliere, "Je veux qu’on soit sincère, et qu’en homme d’honneur / On ne lâche aucun mot qui ne parte du cœur."),
  citation("Français", "Sincérité", "Molière", "Le Misanthrope", "Acte I, scène 1", sources.moliere, "Le fond de notre cœur dans nos discours se montre."),
  citation("Français", "Flatterie", "Molière", "Le Misanthrope", "Acte I, scène 1", sources.moliere, "Ces affables donneurs d’embrassades frivoles, ces obligeants diseurs d’inutiles paroles."),
  citation("Français", "Flatterie", "Molière", "Le Misanthrope", "Acte I, scène 1", sources.moliere, "C’est n’estimer rien qu’estimer tout le monde."),
  citation("Français", "Justice et éthique", "Molière", "Le Misanthrope", "Acte I, scène 1", sources.moliere, "De voir qu’avec le vice on garde des mesures."),
  citation("Français", "Justice et éthique", "Molière", "Le Misanthrope", "Acte I, scène 1", sources.moliere, "Qui je veux ? La raison, mon bon droit, l’équité."),
  citation("Français", "Raison et sentiment", "Molière", "Le Misanthrope", "Acte I, scène 1", sources.moliere, "Mais la raison n’est pas ce qui règle l’amour."),
  citation("Français", "Raison et sentiment", "Molière", "Le Misanthrope", "Acte I, scène 1", sources.moliere, "Je prends tout doucement les hommes comme ils sont."),
  citation("Français", "Symbolisme", "Charles Baudelaire", "Les Fleurs du mal", "« Correspondances »", sources.baudelaire, "La Nature est un temple où de vivants piliers / Laissent parfois sortir de confuses paroles."),
  citation("Français", "Symbolisme", "Charles Baudelaire", "Les Fleurs du mal", "« Correspondances »", sources.baudelaire, "Les parfums, les couleurs et les sons se répondent."),
  citation("Français", "Condition du poète", "Charles Baudelaire", "Les Fleurs du mal", "« L’Albatros »", sources.baudelaire, "Le Poète est semblable au prince des nuées."),
  citation("Français", "Condition du poète", "Charles Baudelaire", "Les Fleurs du mal", "« L’Albatros »", sources.baudelaire, "Ses ailes de géant l’empêchent de marcher."),
  citation("Français", "Temps et création", "Charles Baudelaire", "Les Fleurs du mal", "« Le Guignon »", sources.baudelaire, "L’Art est long et le Temps est court."),
  citation("Français", "Temps et création", "Charles Baudelaire", "Les Fleurs du mal", "« L’Ennemi »", sources.baudelaire, "Le Temps mange la vie."),
  citation("Français", "Mer et intériorité", "Charles Baudelaire", "Les Fleurs du mal", "« L’Homme et la Mer »", sources.baudelaire, "Homme libre, toujours tu chériras la mer !"),
  citation("Français", "Mer et intériorité", "Charles Baudelaire", "Les Fleurs du mal", "« L’Homme et la Mer »", sources.baudelaire, "La mer est ton miroir ; tu contemples ton âme."),
  citation("Français", "Fable et réflexion", "Jean de La Fontaine", "Fables choisies, mises en vers", "Livre IX, fable II, « Le Curé et le Mort »", sources.fables, "En toute chose il faut considérer la fin."),
  citation("Français", "Fable et réflexion", "Jean de La Fontaine", "Fables choisies, mises en vers", "Livre I, fable XIV, « Le Renard et la Cigogne »", sources.fables, "Trompeurs, c’est pour vous que j’écris : attendez-vous à la pareille."),
  citation("Français", "Loi et justice", "Montesquieu", "De l’esprit des lois", "Livre I, chapitre I", sources.montesquieu, "Les lois, dans la signification la plus étendue, sont les rapports nécessaires qui dérivent de la nature des choses."),
  citation("Français", "Loi et justice", "Montesquieu", "De l’esprit des lois", "Livre I, chapitre III", sources.montesquieu, "La loi, en général, est la raison humaine."),

  // Philosophie — 10 notions indépendantes, 2 citations chacune.
  citation("Philosophie", "Loi naturelle", "Montesquieu", "De l’esprit des lois", "Livre I, chapitre I", sources.montesquieu, "Les loix, dans la signification la plus étendue, sont les rapports nécessaires qui dérivent de la nature des choses."),
  citation("Philosophie", "Loi naturelle", "Montesquieu", "De l’esprit des lois", "Livre I, chapitre II", sources.montesquieu, "La paix seroit la premiere loi naturelle."),
  citation("Philosophie", "Société", "Montesquieu", "De l’esprit des lois", "Livre I, chapitre II", sources.montesquieu, "Le desir de vivre en société est une quatrieme loi naturelle."),
  citation("Philosophie", "Société", "Montesquieu", "De l’esprit des lois", "Livre I, chapitre II", sources.montesquieu, "L’homme dans l’état de nature auroit plutôt la faculté de connoître, qu’il n’auroit des connoissances."),
  citation("Philosophie", "Droit des gens", "Montesquieu", "De l’esprit des lois", "Livre I, chapitre III", sources.montesquieu, "Le droit des gens est naturellement fondé sur ce principe, que les diverses nations doivent le faire dans la paix le plus de bien ; et dans la guerre le moins de mal qu’il est possible."),
  citation("Philosophie", "Droit des gens", "Montesquieu", "De l’esprit des lois", "Livre I, chapitre III", sources.montesquieu, "Considérés comme habitans d’une si grande planette, qu’il est nécessaire qu’il y ait différens peuples, ils ont des loix dans le rapport que ces peuples ont entr’eux."),
  citation("Philosophie", "Raison et loi", "Montesquieu", "De l’esprit des lois", "Livre I, chapitre III", sources.montesquieu, "La loi, en général, est la raison humaine, en tant qu’elle gouverne tous les peuples de la terre."),
  citation("Philosophie", "Raison et loi", "Montesquieu", "De l’esprit des lois", "Livre I, chapitre III", sources.montesquieu, "Les loix politiques et civiles de chaque nation, ne doivent être que les cas particuliers où s’applique cette raison humaine."),
  citation("Philosophie", "Limites humaines", "Montesquieu", "De l’esprit des lois", "Livre I, chapitre I", sources.montesquieu, "Les êtres particuliers intelligens sont bornés par leur nature, et par conséquent sujets à l’erreur."),
  citation("Philosophie", "Limites humaines", "Montesquieu", "De l’esprit des lois", "Livre I, chapitre I", sources.montesquieu, "Il est de leur nature qu’ils agissent par eux-mêmes."),
  citation("Philosophie", "Devoir", "Emmanuel Kant", "Fondements de la métaphysique des mœurs", "Deuxième section", sources.kant, "L’essentiel n’est point dans les actions, que l’on voit, mais dans ces principes intérieurs des actions, que l’on ne voit pas."),
  citation("Philosophie", "Devoir", "Emmanuel Kant", "Fondements de la métaphysique des mœurs", "Deuxième section", sources.kant, "La raison commande par elle-même et indépendamment de tous les faits donnés ce qui doit avoir lieu."),
  citation("Philosophie", "Exemple moral", "Emmanuel Kant", "Fondements de la métaphysique des mœurs", "Deuxième section", sources.kant, "En matière morale l’imitation n’a aucune place."),
  citation("Philosophie", "Exemple moral", "Emmanuel Kant", "Fondements de la métaphysique des mœurs", "Deuxième section", sources.kant, "Des exemples ne servent qu’à encourager."),
  citation("Philosophie", "Universalité", "Emmanuel Kant", "Fondements de la métaphysique des mœurs", "Deuxième section", sources.kant, "La loi morale ait une signification à ce point étendue qu’elle doive valoir non seulement pour des hommes, mais pour tous les êtres raisonnables en général."),
  citation("Philosophie", "Universalité", "Emmanuel Kant", "Fondements de la métaphysique des mœurs", "Deuxième section", sources.kant, "Les concepts moraux ont leur siège et leur origine complètement a priori dans la raison."),
  citation("Philosophie", "Valeur morale", "Emmanuel Kant", "Fondements de la métaphysique des mœurs", "Deuxième section", sources.kant, "La pureté d’origine les rend précisément dignes comme ils le sont de nous servir de principes pratiques suprêmes."),
  citation("Philosophie", "Valeur morale", "Emmanuel Kant", "Fondements de la métaphysique des mœurs", "Deuxième section", sources.kant, "Tout ce qu’on ajoute d’empirique est autant d’enlevé à leur véritable influence et à la valeur absolue des actions."),
  citation("Philosophie", "Rationalité", "Emmanuel Kant", "Fondements de la métaphysique des mœurs", "Deuxième section", sources.kant, "Toute chose dans la nature agit d’après des lois."),
  citation("Philosophie", "Rationalité", "Emmanuel Kant", "Fondements de la métaphysique des mœurs", "Deuxième section", sources.kant, "Il n’y a qu’un être raisonnable qui ait la faculté d’agir d’après la représentation des lois."),

  // Histoire-Géographie — 10 notions indépendantes, 2 citations chacune.
  citation("Histoire-Géographie", "Dignité humaine", "Assemblée générale des Nations Unies", "Déclaration universelle des droits de l’homme", "Préambule", sources.udhr, "La reconnaissance de la dignité inhérente à tous les membres de la famille humaine et de leurs droits égaux et inaliénables constitue le fondement de la liberté, de la justice et de la paix dans le monde."),
  citation("Histoire-Géographie", "Dignité humaine", "Assemblée générale des Nations Unies", "Déclaration universelle des droits de l’homme", "Article 1", sources.udhr, "Ils sont doués de raison et de conscience et doivent agir les uns envers les autres dans un esprit de fraternité."),
  citation("Histoire-Géographie", "Non-discrimination", "Assemblée générale des Nations Unies", "Déclaration universelle des droits de l’homme", "Article 2, paragraphe 1", sources.udhr, "Chacun peut se prévaloir de tous les droits et de toutes les libertés proclamés dans la présente Déclaration, sans distinction aucune."),
  citation("Histoire-Géographie", "Non-discrimination", "Assemblée générale des Nations Unies", "Déclaration universelle des droits de l’homme", "Article 2, paragraphe 2", sources.udhr, "Il ne sera fait aucune distinction fondée sur le statut politique, juridique ou international du pays ou du territoire dont une personne est ressortissante."),
  citation("Histoire-Géographie", "Vie privée", "Assemblée générale des Nations Unies", "Déclaration universelle des droits de l’homme", "Article 12", sources.udhr, "Nul ne sera l’objet d’immixtions arbitraires dans sa vie privée, sa famille, son domicile ou sa correspondance."),
  citation("Histoire-Géographie", "Vie privée", "Assemblée générale des Nations Unies", "Déclaration universelle des droits de l’homme", "Article 12", sources.udhr, "Toute personne a droit à la protection de la loi contre de telles immixtions ou de telles atteintes."),
  citation("Histoire-Géographie", "Mobilité", "Assemblée générale des Nations Unies", "Déclaration universelle des droits de l’homme", "Article 13, paragraphe 1", sources.udhr, "Toute personne a le droit de circuler librement et de choisir sa résidence à l’intérieur d’un Etat."),
  citation("Histoire-Géographie", "Mobilité", "Assemblée générale des Nations Unies", "Déclaration universelle des droits de l’homme", "Article 13, paragraphe 2", sources.udhr, "Toute personne a le droit de quitter tout pays, y compris le sien, et de revenir dans son pays."),
  citation("Histoire-Géographie", "Nationalité", "Assemblée générale des Nations Unies", "Déclaration universelle des droits de l’homme", "Article 15, paragraphe 1", sources.udhr, "Tout individu a droit à une nationalité."),
  citation("Histoire-Géographie", "Nationalité", "Assemblée générale des Nations Unies", "Déclaration universelle des droits de l’homme", "Article 15, paragraphe 2", sources.udhr, "Nul ne peut être arbitrairement privé de sa nationalité, ni du droit de changer de nationalité."),
  citation("Histoire-Géographie", "Famille", "Assemblée générale des Nations Unies", "Déclaration universelle des droits de l’homme", "Article 16, paragraphe 2", sources.udhr, "Le mariage ne peut être conclu qu’avec le libre et plein consentement des futurs époux."),
  citation("Histoire-Géographie", "Famille", "Assemblée générale des Nations Unies", "Déclaration universelle des droits de l’homme", "Article 16, paragraphe 3", sources.udhr, "La famille est l’élément naturel et fondamental de la société et a droit à la protection de la société et de l’Etat."),
  citation("Histoire-Géographie", "Travail", "Assemblée générale des Nations Unies", "Déclaration universelle des droits de l’homme", "Article 23, paragraphe 1", sources.udhr, "Toute personne a droit au travail, au libre choix de son travail, à des conditions équitables et satisfaisantes de travail et à la protection contre le chômage."),
  citation("Histoire-Géographie", "Travail", "Assemblée générale des Nations Unies", "Déclaration universelle des droits de l’homme", "Article 23, paragraphe 2", sources.udhr, "Tous ont droit, sans aucune discrimination, à un salaire égal pour un travail égal."),
  citation("Histoire-Géographie", "Sécurité sociale", "Assemblée générale des Nations Unies", "Déclaration universelle des droits de l’homme", "Article 22", sources.udhr, "Toute personne, en tant que membre de la société, a droit à la sécurité sociale."),
  citation("Histoire-Géographie", "Sécurité sociale", "Assemblée générale des Nations Unies", "Déclaration universelle des droits de l’homme", "Article 25, paragraphe 1", sources.udhr, "Toute personne a droit à un niveau de vie suffisant pour assurer sa santé, son bien-être et ceux de sa famille."),
  citation("Histoire-Géographie", "Éducation", "Assemblée générale des Nations Unies", "Déclaration universelle des droits de l’homme", "Article 26, paragraphe 1", sources.udhr, "Toute personne a droit à l’éducation."),
  citation("Histoire-Géographie", "Éducation", "Assemblée générale des Nations Unies", "Déclaration universelle des droits de l’homme", "Article 26, paragraphe 2", sources.udhr, "L’éducation doit viser au plein épanouissement de la personnalité humaine et au renforcement du respect des droits de l’homme et des libertés fondamentales."),
  citation("Histoire-Géographie", "Culture et science", "Assemblée générale des Nations Unies", "Déclaration universelle des droits de l’homme", "Article 27, paragraphe 1", sources.udhr, "Toute personne a le droit de prendre part librement à la vie culturelle de la communauté, de jouir des arts et de participer au progrès scientifique et aux bienfaits qui en résultent."),
  citation("Histoire-Géographie", "Culture et science", "Assemblée générale des Nations Unies", "Déclaration universelle des droits de l’homme", "Article 27, paragraphe 2", sources.udhr, "Chacun a droit à la protection des intérêts moraux et matériels découlant de toute production scientifique, littéraire ou artistique dont il est l’auteur."),

  // Physique-Chimie — 10 notions indépendantes, 2 citations chacune.
  citation("Physique-Chimie", "Investigation", "Claude Bernard", "Introduction à l’étude de la médecine expérimentale", "Première partie, chapitre I", sources.bernard, "Mais l’homme ne se borne pas à voir ; il pense et veut connaître la signification des phénomènes dont l’observation lui a révélé l’existence."),
  citation("Physique-Chimie", "Investigation", "Claude Bernard", "Introduction à l’étude de la médecine expérimentale", "Première partie, chapitre I", sources.bernard, "C’est ce genre de contrôle, au moyen du raisonnement et des faits, qui constitue, à proprement parler, l’expérience."),
  citation("Physique-Chimie", "Conditions et lois", "Claude Bernard", "Introduction à l’étude de la médecine expérimentale", "Première partie, chapitre I", sources.bernard, "Les effets varient en raison des conditions qui les manifestent, mais les lois ne varient pas."),
  citation("Physique-Chimie", "Conditions et lois", "Claude Bernard", "Introduction à l’étude de la médecine expérimentale", "Première partie, chapitre I", sources.bernard, "L’état physiologique et l’état pathologique sont régis par les mêmes forces, et ils ne diffèrent que par les conditions particulières dans lesquelles la loi vitale se manifeste."),
  citation("Physique-Chimie", "Méthode expérimentale", "Claude Bernard", "Introduction à l’étude de la médecine expérimentale", "Première partie, chapitre II", sources.bernard, "La méthode expérimentale a pour objet de transformer cette conception à priori fondée sur une intuition ou un sentiment vague des choses, en une interprétation à posteriori établie sur l’étude expérimentale des phénomènes."),
  citation("Physique-Chimie", "Méthode expérimentale", "Claude Bernard", "Introduction à l’étude de la médecine expérimentale", "Première partie, chapitre II", sources.bernard, "Pour arriver à la vérité, il doit, au contraire, étudier les lois naturelles et soumettre ses idées, sinon sa raison, à l’expérience, c’est-à-dire au critérium des faits."),
  citation("Physique-Chimie", "Vérité relative", "Claude Bernard", "Introduction à l’étude de la médecine expérimentale", "Première partie, chapitre II", sources.bernard, "Il marche ainsi des vérités partielles à des vérités plus générales, mais sans jamais oser prétendre qu’il tient la vérité absolue."),
  citation("Physique-Chimie", "Vérité relative", "Claude Bernard", "Introduction à l’étude de la médecine expérimentale", "Première partie, chapitre II", sources.bernard, "L’expérience ne donne que la vérité relative sans jamais pouvoir prouver à l’esprit qu’il la possède d’une manière absolue."),
  citation("Physique-Chimie", "Hypothèse", "Claude Bernard", "Introduction à l’étude de la médecine expérimentale", "Première partie, chapitre II", sources.bernard, "Une idée anticipée ou une hypothèse est donc le point de départ nécessaire de tout raisonnement expérimental."),
  citation("Physique-Chimie", "Hypothèse", "Claude Bernard", "Introduction à l’étude de la médecine expérimentale", "Première partie, chapitre II", sources.bernard, "L’idée expérimentale n’est point arbitraire ni purement imaginaire ; elle doit avoir toujours un point d’appui dans la réalité observée."),
  citation("Physique-Chimie", "Doute scientifique", "Henri Poincaré", "La Science et l’Hypothèse", "Introduction", sources.poincare, "Douter de tout ou tout croire, ce sont deux solutions également commodes, qui l’une et l’autre nous dispensent de réfléchir."),
  citation("Physique-Chimie", "Doute scientifique", "Henri Poincaré", "La Science et l’Hypothèse", "Introduction", sources.poincare, "Au lieu de prononcer une condamnation sommaire, nous devons donc examiner avec soin le rôle de l’hypothèse."),
  citation("Physique-Chimie", "Vérification", "Henri Poincaré", "La Science et l’Hypothèse", "Introduction", sources.poincare, "Il y a plusieurs sortes d’hypothèses, que les unes sont vérifiables et qu’une fois confirmées par l’expérience, elles deviennent des vérités fécondes."),
  citation("Physique-Chimie", "Vérification", "Henri Poincaré", "La Science et l’Hypothèse", "Introduction", sources.poincare, "Les autres, sans pouvoir nous induire en erreur, peuvent nous être utiles en fixant notre pensée."),
  citation("Physique-Chimie", "Conventions scientifiques", "Henri Poincaré", "La Science et l’Hypothèse", "Introduction", sources.poincare, "Ces conventions sont l’œuvre de la libre activité de notre esprit."),
  citation("Physique-Chimie", "Conventions scientifiques", "Henri Poincaré", "La Science et l’Hypothèse", "Introduction", sources.poincare, "Ces conventions ne sont pas arbitraires, et transportés dans un autre monde, nous aurions été amenés à en adopter d’autres."),
  citation("Physique-Chimie", "Évolution des théories", "Henri Poincaré", "La Science et l’Hypothèse", "Introduction", sources.poincare, "L’histoire de la science nous prouve qu’elles sont éphémères : elles ne meurent pas tout entières pourtant, et de chacune d’elles il reste quelque chose."),
  citation("Physique-Chimie", "Évolution des théories", "Henri Poincaré", "La Science et l’Hypothèse", "Introduction", sources.poincare, "C’est ce quelque chose qu’il faut chercher à démêler, parce que c’est là, et là seulement, qu’est la véritable réalité."),
  citation("Physique-Chimie", "Induction", "Henri Poincaré", "La Science et l’Hypothèse", "Introduction", sources.poincare, "La méthode des sciences physiques repose sur l’induction qui nous fait attendre la répétition d’un phénomène quand se reproduisent les circonstances où il avait une première fois pris naissance."),
  citation("Physique-Chimie", "Induction", "Henri Poincaré", "La Science et l’Hypothèse", "Introduction", sources.poincare, "Cela pourra être vraisemblable, cela ne pourra pas être rigoureusement certain."),
];

function renderExerciseQuestions(variable, questions) {
  return questions
    .map(
      ([type, prompt, options, correct, explanation, order]) =>
        `      (${variable},${sqlText(type)},${sqlText(prompt)},${jsonArray(options)},${jsonArray(correct)},${sqlText(explanation)},${order})`,
    )
    .join(",\n");
}

function renderQuizQuestions(quiz) {
  return quiz.questions
    .map(
      ([prompt, explanation, _answers, order]) =>
        `        (quiz_uuid,${sqlText(prompt)},${sqlText(explanation)},'single_choice',${order},1,true)`,
    )
    .join(",\n");
}

function renderQuizAnswers(quiz) {
  return quiz.questions
    .flatMap(([_prompt, _explanation, answers, order]) => [
      `        (${order},${sqlText(answers[0])},true,10)`,
      `        (${order},${sqlText(answers[1])},false,20)`,
    ])
    .join(",\n");
}

const lessonSql = lessons
  .map((lesson) => {
    const questionsA = renderExerciseQuestions("exercise_a_uuid", lesson.exerciseA.questions);
    const questionsB = renderExerciseQuestions("exercise_b_uuid", lesson.exerciseB.questions);
    const quizQuestions = renderQuizQuestions(lesson.quiz);
    const quizAnswers = renderQuizAnswers(lesson.quiz);

    return `
  select l.id as lesson_id,c.id as chapter_id,o.id as offering_id,o.subject_id,o.level_id,o.series_id into target
  from public.lessons l
  join public.chapters c on c.id=l.chapter_id
  join public.course_subject_offerings o on o.id=c.subject_offering_id
  where l.id=${sqlText(lesson.id)};
  if target.lesson_id is null then raise exception 'Leçon cible % introuvable.', ${sqlText(lesson.id)}; end if;
  if exists (select 1 from public.lessons where id=target.lesson_id and coalesce(btrim(content),'') <> '') then
    raise exception 'La leçon SVT Terminale C % contient déjà un cours : écrasement interdit.', target.lesson_id;
  end if;
  update public.lessons
  set description=${sqlText(lesson.description)},
      content=$lesson_content$
${lesson.content}
$lesson_content$,
      is_active=false
  where id=target.lesson_id and coalesce(btrim(content),'')='';

  exercise_a_uuid := null;
  insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
  select target.subject_id,target.level_id,target.series_id,target.chapter_id,target.lesson_id,${sqlText(lesson.exerciseA.title)},${sqlText(lesson.exerciseA.statement)},${sqlText(lesson.exerciseA.solution)},'single_choice',${sqlText(lesson.exerciseA.difficulty)},'## Consigne\n\nRépondez en utilisant le vocabulaire exact du cours.','## Correction\n\nRelisez les définitions et les étapes correspondantes dans la leçon.',false,false,${lesson.exerciseA.duration},10
  where not exists (select 1 from public.exercises e where e.lesson_id=target.lesson_id and e.title=${sqlText(lesson.exerciseA.title)})
  returning id into exercise_a_uuid;
  if exercise_a_uuid is not null then
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
${questionsA};
  end if;

  exercise_b_uuid := null;
  insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
  select target.subject_id,target.level_id,target.series_id,target.chapter_id,target.lesson_id,${sqlText(lesson.exerciseB.title)},${sqlText(lesson.exerciseB.statement)},${sqlText(lesson.exerciseB.solution)},'single_choice',${sqlText(lesson.exerciseB.difficulty)},'## Consigne\n\nAnalysez chaque proposition puis justifiez-la par une notion précise du cours.','## Correction\n\nLa correction distingue les mécanismes étudiés et leur enchaînement.',false,false,${lesson.exerciseB.duration},20
  where not exists (select 1 from public.exercises e where e.lesson_id=target.lesson_id and e.title=${sqlText(lesson.exerciseB.title)})
  returning id into exercise_b_uuid;
  if exercise_b_uuid is not null then
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
${questionsB};
  end if;

  quiz_uuid := null;
  insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active)
  select target.subject_id,target.level_id,target.series_id,target.offering_id,target.chapter_id,target.lesson_id,${sqlText(lesson.quiz.title)},'Vérifiez la maîtrise du vocabulaire, des mécanismes et de la synthèse de la leçon.','medium',12,10,false,false
  where not exists (select 1 from public.quizzes q where q.lesson_id=target.lesson_id and q.title=${sqlText(lesson.quiz.title)})
  returning id into quiz_uuid;
  if quiz_uuid is not null then
    with inserted_questions as (
      insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
${quizQuestions}
      returning id,display_order
    )
    insert into public.quiz_answers (question_id,answer,is_correct,display_order)
    select inserted_questions.id,answers.answer,answers.is_correct,answers.display_order
    from inserted_questions
    join (values
${quizAnswers}
    ) as answers(question_order,answer,is_correct,display_order)
      on answers.question_order=inserted_questions.display_order;
  end if;`;
  })
  .join("\n");

const citationRows = citations
  .map(
    ([subject, quoteText, author, sourceTitle, sourceReference, sourceUrl, explanation, keywords, theme]) =>
      `      (${sqlText(subject)},${sqlText(quoteText)},${sqlText(author)},${sqlText(sourceTitle)},${sqlText(sourceReference)},${sqlText(sourceUrl)},${sqlText(explanation)},${textArray(keywords)},${sqlText(theme)})`,
  )
  .join(",\n");

const sql = `-- Brouillons SVT Terminale C : communication nerveuse et drogues.
-- Leçon 3 « La production d’énergie par la cellule » volontairement exclue : PDF reçu illisible.
-- Toutes les ressources créées restent inactives et non publiées ; toute leçon déjà remplie annule la migration.
do $svt_terminal_c_lot1$
declare
  target record;
  exercise_a_uuid uuid;
  exercise_b_uuid uuid;
  quiz_uuid uuid;
  lesson_count integer;
begin
  select count(*) into lesson_count
  from public.lessons
  where id in (${lessons.map((lesson) => sqlText(lesson.id)).join(", ")});
  if lesson_count <> 2 then
    raise exception 'Les deux leçons SVT Terminale C attendues sont requises avant remplissage ; transaction annulée.';
  end if;
${lessonSql}
end;
$svt_terminal_c_lot1$;

do $svt_terminal_c_citations$
declare
  citation_seed record;
  citation_subject_uuid uuid;
  citation_uuid uuid;
begin
  for citation_seed in select * from (values
${citationRows}
  ) as seed(subject_name,quote_text,author,source_title,source_reference,source_url,pedagogical_explanation,keywords,theme)
  loop
    citation_uuid := null;
    select id into citation_subject_uuid from public.subjects where name=citation_seed.subject_name limit 1;
    if citation_subject_uuid is null then
      raise exception 'Matière Citations % introuvable.', citation_seed.subject_name;
    end if;
    insert into public.citations (subject_id,quote_text,author,source_title,source_reference,source_url,pedagogical_explanation,keywords,is_active,is_validated)
    select citation_subject_uuid,citation_seed.quote_text,citation_seed.author,citation_seed.source_title,citation_seed.source_reference,citation_seed.source_url,citation_seed.pedagogical_explanation,citation_seed.keywords,false,false
    where not exists (
      select 1 from public.citations c
      where c.subject_id=citation_subject_uuid
        and c.quote_text=citation_seed.quote_text
        and c.author=citation_seed.author
    )
    returning id into citation_uuid;
    if citation_uuid is not null then
      insert into public.citation_scopes (citation_id,level_id,series_id)
      select citation_uuid,lv.id,s.id
      from public.levels lv cross join public.series s
      where lv.name='Terminale' and s.name in ('A1','A2','C','D');
      insert into public.citation_themes (citation_id,theme) values (citation_uuid,citation_seed.theme);
    end if;
  end loop;
end;
$svt_terminal_c_citations$;
`;

if (citations.length !== 80) {
  throw new Error(`80 citations attendues ; ${citations.length} préparées.`);
}

for (const subject of ["Français", "Philosophie", "Histoire-Géographie", "Physique-Chimie"]) {
  const subjectCitations = citations.filter(([citationSubject]) => citationSubject === subject);
  const themeCounts = new Map();
  for (const [, , , , , , , , theme] of subjectCitations) {
    themeCounts.set(theme, (themeCounts.get(theme) ?? 0) + 1);
  }
  if (subjectCitations.length !== 20 || themeCounts.size !== 10 || [...themeCounts.values()].some((count) => count !== 2)) {
    throw new Error(`Répartition des citations invalide pour ${subject}.`);
  }
}

mkdirSync(dirname(migrationPath), { recursive: true });
writeFileSync(migrationPath, sql);
writeFileSync(
  applyInputPath,
  `${JSON.stringify(
    {
      project_id: "nnshioowwniursnozicg",
      name: "svt_terminale_c_communication_drogues_citations_drafts",
      query: sql,
    },
    null,
    2,
  )}\n`,
);
console.log(migrationPath);
