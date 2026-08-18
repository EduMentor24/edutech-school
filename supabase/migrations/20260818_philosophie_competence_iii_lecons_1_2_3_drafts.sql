-- Lot PDF suivant — Philosophie Terminale, Compétence III.
-- Cibles confirmées : A1/A2 pour les trois PDF ; C/D pour les leçons
-- « La valeur de la philosophie » et « Progrès et bonheur » seulement.
-- Toute leçon déjà enrichie est protégée : aucun écrasement automatique n’est autorisé.

do $commande$
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
      l.id as lesson_id,
      c.id as chapter_id,
      o.id as offering_id,
      o.subject_id,
      o.level_id,
      o.series_id,
      case
        when l.id in ('8f2b6cfa-d9e2-4a45-8417-cf97dd0bc393'::uuid, '6584c772-9985-4fd8-a7d0-6c6bfb54ae9b'::uuid) then 'history_humanity'
        when l.id in ('2b4ed899-ce59-43d3-ae6d-998565afcabb'::uuid, 'a5a2243a-31dd-40a5-b5ef-50a75e85756a'::uuid, '96a9192a-8892-42ed-90cd-07c1cccd49e3'::uuid, '562b5eb6-f323-41c7-8505-9e3a0f70ec2a'::uuid) then 'philosophy_value'
        when l.id in ('8503a5f0-3f0c-4826-af7a-86b57ee1e3ca'::uuid, 'b0624f73-66ea-44e3-b0e0-f6d12dca47fa'::uuid, 'd10a955a-d75c-464d-a067-5d257d7603bc'::uuid, 'fc6e300b-ba2c-44c1-b015-f9c415d3e6cf'::uuid) then 'progress_happiness'
      end as lesson_key
    from public.lessons l
    join public.chapters c on c.id = l.chapter_id
    join public.course_subject_offerings o on o.id = c.subject_offering_id
    join public.subjects subject on subject.id = o.subject_id
    join public.levels level on level.id = o.level_id
    join public.series series on series.id = o.series_id
    where l.id in (
      '8f2b6cfa-d9e2-4a45-8417-cf97dd0bc393', '6584c772-9985-4fd8-a7d0-6c6bfb54ae9b',
      '2b4ed899-ce59-43d3-ae6d-998565afcabb', 'a5a2243a-31dd-40a5-b5ef-50a75e85756a',
      '96a9192a-8892-42ed-90cd-07c1cccd49e3', '562b5eb6-f323-41c7-8505-9e3a0f70ec2a',
      '8503a5f0-3f0c-4826-af7a-86b57ee1e3ca', 'b0624f73-66ea-44e3-b0e0-f6d12dca47fa',
      'd10a955a-d75c-464d-a067-5d257d7603bc', 'fc6e300b-ba2c-44c1-b015-f9c415d3e6cf'
    )
      and level.name = 'Terminale'
      and series.name in ('A1', 'A2', 'C', 'D')
      and subject.name = 'Philosophie'
      and (
        (l.id in ('8f2b6cfa-d9e2-4a45-8417-cf97dd0bc393', '6584c772-9985-4fd8-a7d0-6c6bfb54ae9b') and l.title = 'Leçon 1 : L’histoire et l’humanité')
        or (l.id in ('2b4ed899-ce59-43d3-ae6d-998565afcabb', 'a5a2243a-31dd-40a5-b5ef-50a75e85756a') and l.title = 'Leçon 2 : La valeur de la philosophie/ QUESTION AU CHOIX')
        or (l.id in ('96a9192a-8892-42ed-90cd-07c1cccd49e3', '562b5eb6-f323-41c7-8505-9e3a0f70ec2a') and l.title = 'Leçon 1 : La valeur de la philosophie')
        or (l.id in ('8503a5f0-3f0c-4826-af7a-86b57ee1e3ca', 'b0624f73-66ea-44e3-b0e0-f6d12dca47fa') and l.title = 'Leçon 3 : Progrès et bonheur/ QUESTION AU CHOIX')
        or (l.id in ('d10a955a-d75c-464d-a067-5d257d7603bc', 'fc6e300b-ba2c-44c1-b015-f9c415d3e6cf') and l.title = 'Leçon 2 : Progrès et bonheur')
      )
    order by l.id
  loop
    if exists (
      select 1
      from public.lessons
      where id = target.lesson_id
        and coalesce(btrim(content), '') <> ''
    ) then
      raise exception 'La leçon cible % contient déjà du contenu : aucune écriture automatique n’est autorisée.', target.lesson_id;
    end if;

    if target.lesson_key = 'history_humanity' then
      lesson_description := 'Histoire, humanité, culture, civilisation, responsabilité humaine et diversité culturelle.';
      lesson_content := $history$
# L’histoire et l’humanité

> **Compétence III — Thème : Les conditions du bonheur**  
> **Objectif :** comprendre ce qui caractérise l’humanité, situer la responsabilité de l’homme dans l’histoire et penser le refus de toute domination comme une exigence humaine.

## Situation d’apprentissage

L’histoire des peuples comporte des œuvres, des découvertes, des relations de coopération, mais aussi des expériences de domination et d’exclusion. Face à ces réalités, il faut s’interroger : **qu’est-ce qui fait l’humanité de l’homme, et comment l’homme participe-t-il à son propre devenir historique ?**

Cette leçon étudie d’abord les notions qui rendent compte de l’humanité. Elle examine ensuite les différentes manières de comprendre le rôle de l’homme dans l’histoire. Enfin, elle montre pourquoi décoloniser et désaliéner relèvent d’une exigence de dignité et de respect de la diversité culturelle.

## 1. Caractériser l’humanité

### A. L’humanité : totalité des hommes et exigence morale

Au sens courant, l’**humanité** désigne l’ensemble des hommes et des communautés humaines sur la Terre. Dans un sens plus exigeant, elle renvoie également à un ordre éthique : elle exprime ce qui unit les hommes, leur dignité et la reconnaissance qu’ils se doivent mutuellement.

Le document invite ainsi à distinguer l’humanité des seules caractéristiques biologiques. Elle se manifeste par la capacité des hommes à produire des savoirs, des valeurs, des institutions et des œuvres, puis à les transmettre d’une génération à l’autre.

| Notion | Définition de travail | Ce qu’elle permet de comprendre |
|---|---|---|
| Humanité | Totalité des hommes et exigence de dignité commune. | Ce qui rassemble les peuples au-delà de leurs différences. |
| Histoire | Ensemble des faits passés et étude de ces faits. | Le devenir humain à travers le temps. |
| Culture | Transformations de la nature et formation acquise par l’éducation. | La manière dont l’homme se forme et transforme son monde. |
| Civilisation | Culture mise en action dans les valeurs et les techniques. | Les réalisations morales et techniques d’une société. |

> **Repère.** Parler d’humanité ne consiste pas à effacer les différences entre les peuples ; c’est reconnaître que ces différences appartiennent à une même communauté humaine.

### B. Existence, essence et perfectibilité

L’**existence** désigne le fait d’être au monde, d’y être présent et d’en prendre conscience. L’**essence** renvoie à ce qu’est une chose, à ce qui la définit indépendamment du fait qu’elle existe. La formule de Sartre, « l’existence précède l’essence », sert dans le document à mettre en valeur l’idée que l’homme se construit par ses choix et ses actes, au lieu d’être entièrement défini d’avance.

Rousseau met en avant la **perfectibilité** : l’homme possède la capacité de se transformer, d’apprendre et de progresser. Cette possibilité explique le rôle de la culture et de l’éducation. Pour Kant, l’éducation contribue précisément à faire accéder l’être humain à son humanité.

### C. Le lien entre histoire, culture et civilisation

L’histoire donne accès aux réalisations humaines. La culture et la civilisation permettent de comprendre comment les hommes transforment la nature, se transmettent des connaissances et organisent leur vie collective. Elles ne sont donc pas de simples ornements : elles rendent visible le caractère actif et créateur de l’humanité.

## 2. L’homme dans le cours de l’histoire

### A. L’historicité : mémoire, présent et avenir

L’**historicité** désigne la manière dont l’homme existe dans le temps. Le passé n’est pas séparé du présent : les expériences, les décisions, les acquis et les erreurs des générations antérieures orientent les actions présentes. Le présent, à son tour, prépare l’avenir.

La mémoire individuelle et collective joue ici un rôle essentiel. Connaître le passé ne revient pas à le répéter ; cette connaissance permet de mieux comprendre les conditions dans lesquelles les hommes agissent.

### B. L’homme comme objet de l’histoire

Certaines conceptions insistent sur les forces qui dépassent l’individu. Les religions révélées présentent l’histoire comme liée à la Providence. Le stoïcisme, avec Marc-Aurèle, souligne l’ordre nécessaire du monde. Chez Hegel, la Raison ou l’Esprit universel conduit le développement historique.

Dans cette perspective, l’homme peut apparaître comme **objet de l’histoire** : il est pris dans des événements, des conditions et des forces qui ne dépendent pas entièrement de sa volonté.

### C. L’homme comme sujet de l’histoire

À l’inverse, Marx et Engels rappellent que les hommes font leur propre histoire dans des conditions héritées du passé. Cette précision est décisive : les hommes agissent, mais leur action se situe dans un contexte qu’ils n’ont pas entièrement choisi.

Sartre insiste également sur l’engagement humain. Dire que l’homme est sujet de l’histoire signifie qu’il peut décider, agir, transformer et répondre de ses actes.

| Perspective | Idée centrale | Limite à retenir |
|---|---|---|
| Homme objet de l’histoire | Des forces, circonstances ou nécessités influencent les événements. | Elle risque de réduire l’action humaine à la passivité. |
| Homme sujet de l’histoire | Les hommes participent activement à leur devenir. | Elle ne doit pas oublier les conditions héritées du passé. |
| Homme produit et agent | L’homme subit certaines conditions tout en pouvant agir sur elles. | Cette position permet de penser la complexité de l’histoire. |

> **Méthode.** Dans une dissertation, évitez d’opposer mécaniquement déterminisme et liberté. Montrez d’abord les conditions qui pèsent sur l’action, puis expliquez comment l’engagement humain peut modifier une situation.

## 3. Décoloniser et désaliéner : des exigences de l’humanité

### A. Refuser la domination et l’ethnocentrisme

La colonisation a comporté une domination politique et économique, mais aussi une aliénation culturelle et intellectuelle. Le document invite à comprendre que l’humanité est incompatible avec les pratiques qui nient la dignité d’un peuple ou d’une culture.

L’**ethnocentrisme** consiste à prendre sa propre culture comme norme absolue pour juger les autres. Cette attitude peut nourrir l’exclusion, le racisme, la discrimination, l’esclavage ou la domination coloniale. Décoloniser et désaliéner signifient donc refuser ces rapports de supériorité et restaurer la capacité des peuples à se définir eux-mêmes.

### B. La diversité culturelle enrichit l’humanité

Le document ne présente pas la diversité culturelle comme un obstacle en elle-même. Chaque peuple possède une histoire, des traditions et des manières de vivre. Reconnaître cette pluralité ne signifie pas accepter toute pratique sans examen ; cela signifie refuser d’utiliser la différence comme prétexte à la hiérarchie et à la domination.

Saint-Exupéry exprime cette idée lorsqu’il affirme que la différence peut enrichir plutôt que léser. L’humanisme, la philanthropie et l’altruisme deviennent alors des orientations pratiques : considérer autrui comme un semblable et travailler à l’unité sans uniformité.

## Méthode pour une production argumentée

Pour traiter le sujet **« La pluralité des cultures est-elle un obstacle au rapprochement des peuples ? »**, commencez par définir pluralité culturelle, obstacle et rapprochement des peuples. Un premier axe peut étudier les conflits et l’ethnocentrisme. Un second axe montrera que la diversité peut être une source d’enrichissement mutuel si la dignité humaine est respectée.

## Synthèse

- L’humanité désigne à la fois l’ensemble des hommes et une exigence de dignité commune.
- L’histoire, la culture, la civilisation et l’éducation révèlent la capacité humaine à se transformer.
- L’homme est à la fois influencé par l’histoire et capable d’agir sur elle.
- Décoloniser et désaliéner impliquent de refuser la domination et l’ethnocentrisme.
- La diversité culturelle peut devenir une force d’enrichissement et de rapprochement.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Leçon 1 : L’histoire et l’humanité »**, Philosophie, Terminale toutes séries, Côte d’Ivoire – École numérique. Les notions, le plan et les auteurs mobilisés suivent le document source.
$history$;

    elsif target.lesson_key = 'philosophy_value' then
      lesson_description := 'Philosophie, raison, mythe, complémentarité des discours et rôle de la pensée critique dans l’humanité.';
      lesson_content := $philosophy$
# La valeur de la philosophie

> **Compétence III — Thème : Les conditions du bonheur**  
> **Objectif :** caractériser la philosophie, la raison et le mythe, puis expliquer en quoi la philosophie éclaire les savoirs, les valeurs et la vie humaine.

## Situation d’apprentissage

Un mythe est-il seulement un récit imaginaire, ou peut-il aussi aider les hommes à comprendre leur monde ? La philosophie est-elle un savoir abstrait dont on pourrait se passer, ou une activité indispensable à la formation de l’homme ?

Pour répondre à ces questions, il faut comparer la philosophie, la raison et le mythe. Il faut ensuite comprendre pourquoi leur opposition n’est pas absolue. Enfin, il convient d’étudier les différentes dimensions de la valeur de la philosophie dans l’histoire de l’humanité.

## 1. Philosophie, raison et mythe : trois notions à distinguer

### A. La philosophie : amour de la sagesse et réflexion critique

Étymologiquement, **philosophie** signifie « amour de la sagesse ». Le document la présente comme une activité rationnelle et critique qui recherche la vérité, fonde les savoirs et interroge les valeurs. Elle ne consiste donc pas à accumuler des opinions : elle demande de justifier, de questionner et de distinguer les raisons valables des préjugés.

Platon associe la philosophie à l’instruction ; Descartes rappelle qu’elle aide à régler les mœurs. Ces deux fonctions permettent de comprendre que la philosophie porte sur la connaissance, mais aussi sur la conduite humaine.

### B. La raison : connaître, juger et justifier

La **raison** est la faculté qui permet de connaître, de juger et d’agir selon des principes. Le *logos* renvoie à un discours cohérent ; le mot latin *ratio* évoque le calcul et la mise en relation. La raison demande donc de présenter des arguments, de chercher des preuves et de distinguer le vrai du faux.

> **Repère.** Raisonner ne signifie pas seulement donner son avis. C’est relier une conclusion à des raisons explicites, examinables et ordonnées.

### C. Le mythe : récit symbolique et imaginaire

Le **mythe** est un récit imaginaire et symbolique qui cherche à expliquer les origines, les phénomènes naturels ou les questions humaines. Il est lié aux croyances, à la culture et à la transmission des traditions. Dans l’Antiquité, les récits attribués à Homère ont ainsi participé à la manière de penser le monde.

| Notion | Mode d’expression | Rapport principal au réel |
|---|---|---|
| Philosophie | Questionnement, concepts et arguments. | Recherche critique de la vérité et de la sagesse. |
| Raison | Discours cohérent, justification, jugement. | Exige des raisons et des critères. |
| Mythe | Récit symbolique, images et fables. | Cherche à donner sens aux origines et aux énigmes. |

## 2. Raison et mythe : opposition et complémentarité

### A. Pourquoi les opposer ?

La raison se rapporte au réel pour expliquer, démontrer et juger. Elle exige une démarche rigoureuse. Le mythe, lui, recourt à l’imagination et à la croyance. Pascal critique l’imagination lorsqu’elle devient source d’erreurs et de faussetés. Auguste Comte présente le passage vers l’esprit positif comme un dépassement des explications théologiques et métaphysiques au profit de l’étude des phénomènes.

Cette opposition peut être résumée ainsi : la raison cherche des justifications, tandis que le mythe raconte et symbolise. Cependant, l’opposition ne doit pas conduire à mépriser le mythe ou à croire que la raison explique tout à elle seule.

### B. Pourquoi les penser ensemble ?

Le document montre que mythe et raison peuvent être complémentaires. Le mythe est aussi une manière de penser et de transmettre une vision du monde. Vernant y reconnaît une première forme de discours rationnel. Gusdorf affirme que la philosophie naît par épuration du mythe : la pensée philosophique ne surgit donc pas dans le vide, elle transforme et clarifie des récits plus anciens.

La philosophie peut elle-même recourir au mythe lorsque le discours conceptuel ne suffit pas à exprimer une difficulté. Platon utilise, par exemple, le mythe de la caverne pour éclairer la connaissance, le mythe d’Er pour interroger le destin des âmes, et le mythe de l’androgyne pour évoquer le désir humain.

| Question | Réponse nuancée |
|---|---|
| Le mythe est-il rationnel ? | Il ne suit pas la même méthode que la démonstration, mais il peut organiser une représentation du monde et susciter la réflexion. |
| La philosophie rejette-t-elle tout mythe ? | Non. Elle examine et reformule le mythe ; elle peut l’utiliser à des fins de compréhension et d’enseignement. |
| La raison suffit-elle à tout expliquer ? | Elle est indispensable à la critique, mais certains problèmes humains peuvent aussi être éclairés par des symboles et des récits. |

## 3. Pourquoi la philosophie est-elle précieuse ?

### A. Une valeur intellectuelle

La philosophie combat l’ignorance et les préjugés. Aristote rappelle que les premiers philosophes ont cherché à connaître pour échapper à l’ignorance. La pensée critique ne donne pas toujours des réponses définitives ; elle apprend surtout à poser des problèmes, à examiner des arguments et à ne pas confondre opinion et savoir.

### B. Une valeur morale

En demandant ce qui est juste, bon et digne, la philosophie aide à fonder les valeurs sur des raisons. Dans la perspective épicurienne reprise par le document, la réflexion doit conduire à une vie mesurée et heureuse, attentive aux désirs naturels et nécessaires.

### C. Une valeur sociale, politique et existentielle

La philosophie interroge les conditions de la justice, du pouvoir et de la vie commune. Platon relie l’exercice du pouvoir à la sagesse. Elle s’intéresse aussi aux grandes questions existentielles : que puis-je connaître, que dois-je faire, que puis-je espérer, qu’est-ce que l’homme ?

La philosophie n’est donc pas un luxe au sens d’une activité superflue. Sa valeur réside dans sa capacité à éclairer les savoirs, les décisions, les valeurs et la recherche d’un bonheur véritable.

## Méthode pour une production argumentée

Pour traiter **« La philosophie est-elle un luxe ? »**, définissez philosophie et luxe. Un premier axe peut montrer que la philosophie paraît parfois abstraite ou peu utile. Un second axe doit établir sa nécessité intellectuelle, morale, politique et existentielle. Chaque argument doit être expliqué avant d’être illustré par un auteur.

## Synthèse

- La philosophie est une quête rationnelle et critique de vérité et de sagesse.
- La raison permet de juger, de justifier et de distinguer le vrai du faux.
- Le mythe est un récit symbolique lié aux croyances et aux cultures.
- Raison et mythe peuvent s’opposer par leur méthode, tout en étant complémentaires pour penser l’homme et le monde.
- La philosophie a une valeur intellectuelle, morale, sociale, politique et existentielle.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Leçon 2 : La valeur de la philosophie »**, Philosophie, Terminale toutes séries, Côte d’Ivoire – École numérique. Les notions, le plan et les auteurs mobilisés suivent le document source.
$philosophy$;

    elsif target.lesson_key = 'progress_happiness' then
      lesson_description := 'Désir, passion, travail, technique, art, imagination, progrès matériel, progrès moral et conditions du bonheur.';
      lesson_content := $progress$
# Progrès et bonheur

> **Compétence III — Thème : Les conditions du bonheur**  
> **Objectif :** distinguer les formes de progrès, comprendre le rôle du désir et des activités humaines, puis examiner à quelles conditions le progrès peut contribuer au bonheur.

## Situation d’apprentissage

Le progrès promet une amélioration des conditions de vie. Les sciences, les techniques, le travail, l’art et l’imagination transforment profondément l’existence humaine. Pourtant, les progrès matériels ne suffisent pas toujours à faire disparaître la souffrance, la misère ou l’insatisfaction.

La question directrice est donc la suivante : **le progrès conduit-il nécessairement au bonheur, ou faut-il lui adjoindre des conditions morales et spirituelles ?**

## 1. Désir, passion, travail, technique, art et imagination

### A. Désir et passions

Le **désir** est l’aspiration vers ce qui manque et qui paraît source de satisfaction. Dans le document, il se distingue du besoin : l’homme ne se limite pas à satisfaire ce qui lui est nécessaire ; il peut aller au-delà et devenir insatiable.

La **passion** est un attachement très vif et démesuré à un être ou à un objet. Elle peut déséquilibrer l’individu lorsqu’elle devient subie. Toutefois, le PDF invite à ne pas condamner indistinctement toutes les passions : certaines peuvent fournir l’énergie nécessaire à l’action et aux grandes réalisations.

Épicure distingue les désirs naturels et nécessaires, les désirs naturels non nécessaires et les désirs ni naturels ni nécessaires. Cette distinction est utile pour penser une vie mesurée : satisfaire tout désir ne garantit pas le bonheur.

| Notion | Sens dans la leçon | Enjeu pour le bonheur |
|---|---|---|
| Désir | Manque et aspiration vers un objet jugé satisfaisant. | Il peut stimuler l’action mais aussi entretenir l’insatisfaction. |
| Passion | Attachement excessif ou énergie intense. | Elle peut aliéner ou soutenir une action féconde. |
| Sagesse | Recherche d’une mesure dans les désirs. | Elle aide à éviter la démesure. |

### B. Activités de transformation et de création

Le **travail** est une activité consciente par laquelle l’homme transforme la nature et se transforme lui-même pour produire l’utile. Il comporte un effort, mais il peut aussi délivrer de l’ennui, du vice et du besoin, selon Voltaire.

La **technique** est un ensemble de procédés et de savoir-faire qui rendent l’action plus efficace. Dans son sens moderne, elle est souvent liée aux applications de la science : on parle alors de technoscience.

L’**art** est une création du beau par une conscience humaine. Il ne se réduit pas à copier la nature : Kant et Hegel soulignent son caractère créateur. L’**imagination** est, elle aussi, une capacité de former et de combiner des images nouvelles. Bachelard la présente comme une ouverture vers la nouveauté.

> **Repère.** Travail, technique, art et imagination ne sont pas des réalités isolées : l’imagination peut soutenir l’invention technique et artistique ; la technique peut renforcer l’efficacité du travail ; l’art peut produire une satisfaction esthétique et spirituelle.

## 2. Les formes et les limites du progrès

### A. Qu’est-ce que le progrès ?

Le **progrès** est une marche en avant, le passage d’un état considéré comme inférieur à un état jugé meilleur. Le document distingue deux approches. Pour Hegel, le progrès s’inscrit dans le développement historique des peuples. Pour Marx, il est l’œuvre des hommes, de leur travail et de leur action.

### B. Progrès matériel et progrès moral-spirituel

Le **progrès matériel** résulte principalement des sciences, des techniques et de l’amélioration des moyens d’action. Il peut accroître la maîtrise de la nature, faciliter la communication, les soins, la production et la mobilité.

Le **progrès moral et spirituel** concerne l’élévation de la pensée, du jugement, de la conscience et de la conduite. Il ne consiste pas à posséder davantage, mais à mieux orienter l’action humaine.

| Type de progrès | Ce qu’il concerne | Risque si on l’isole |
|---|---|---|
| Matériel | Techniques, production, confort, pouvoir d’action sur la nature. | Réduire l’homme à ses seuls besoins matériels. |
| Moral et spirituel | Valeurs, responsabilité, conscience, respect de la personne. | Rester sans effet concret si aucune condition matérielle ne permet de vivre dignement. |

### C. Pourquoi le progrès matériel ne suffit-il pas ?

Le document rappelle, avec Freud, que les progrès techniques n’ont pas automatiquement rendu les hommes plus heureux. Ils peuvent améliorer certaines conditions de vie tout en laissant subsister l’angoisse, l’insatisfaction, les inégalités ou la violence.

Adorno et Horkheimer mettent en garde contre une rationalité devenue purement instrumentale : lorsqu’elle ne se demande plus quelles fins sont justes, la raison peut servir des projets destructeurs. Le progrès peut alors se retourner en régression.

## 3. Les conditions du bonheur

### A. Le bonheur ne se réduit pas à l’accumulation

Le bonheur est présenté comme un état de satisfaction et d’épanouissement. Il est difficile à définir de façon identique pour tous, car les désirs et les attentes varient. L’homme peut obtenir un objet désiré, puis en désirer un autre : l’insatisfaction recommence.

Cette difficulté explique la critique de l’accumulation illimitée des biens. La satisfaction matérielle compte, mais elle ne suffit pas à elle seule à réaliser l’équilibre de la personne.

### B. Une complémentarité nécessaire

Le document défend la complémentarité du progrès matériel et du progrès moral-spirituel. L’être humain a des besoins corporels, mais aussi des exigences de conscience, de dignité et de sens. Rabelais rappelle que la science sans conscience peut ruiner l’âme ; Bergson demande un supplément d’âme à une civilisation technologique très avancée.

Le développement authentique doit donc servir la personne humaine : travail, logement, alimentation, éducation et santé doivent être pensés avec la responsabilité morale, le respect des autres et la préservation des conditions de la vie.

## Méthode pour une production argumentée

Pour traiter **« Le progrès technique éradique-t-il la misère de l’homme ? »**, définissez progrès technique, éradiquer et misère. Un premier axe montrera ce que la technique apporte à la maîtrise de la nature et aux conditions de vie. Un second examinera les limites morales, sociales et écologiques d’un progrès qui ne serait que matériel. La conclusion doit justifier une position nuancée.

## Synthèse

- Le désir peut stimuler l’action, mais son caractère illimité peut entretenir l’insatisfaction.
- Le travail, la technique, l’art et l’imagination transforment le monde et peuvent procurer des satisfactions.
- Le progrès matériel améliore les moyens d’action, sans garantir à lui seul le bonheur.
- Le progrès moral et spirituel concerne la conscience, les valeurs et la responsabilité.
- Le bonheur exige une articulation entre conditions matérielles dignes et développement moral-spirituel.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Leçon 3 : Progrès et bonheur »**, Philosophie, Terminale toutes séries, Côte d’Ivoire – École numérique. Les notions, le plan et les auteurs mobilisés suivent le document source.
$progress$;
    else
      raise exception 'Leçon cible non reconnue : %', target.lesson_id;
    end if;

    update public.lessons
    set description = lesson_description, content = lesson_content, is_active = false
    where id = target.lesson_id
      and coalesce(btrim(content), '') = '';

    if target.lesson_key = 'history_humanity' then
      insert into public.exercises (subject_id, level_id, series_id, chapter_id, lesson_id, title, statement, solution, exercise_type, difficulty, content_markdown, correction_markdown, is_published, is_active, estimated_duration_minutes, display_order)
      select target.subject_id, target.level_id, target.series_id, target.chapter_id, target.lesson_id,
        'Exercice 1 — Notions et repères : histoire et humanité',
        'Vérifiez les définitions et les relations fondamentales de la leçon.',
        'La correction explique les notions d’humanité, d’histoire, de culture, de civilisation et de perfectibilité.',
        'single_choice', 'easy',
        '## Consigne\n\nRépondez à chaque question en vous appuyant sur les définitions étudiées.',
        '## Correction\n\nL’humanité est à la fois la totalité des hommes et une exigence de dignité ; l’histoire étudie le devenir humain ; culture et civilisation caractérisent les productions humaines.',
        false, false, 12, 10
      where not exists (select 1 from public.exercises e where e.lesson_id = target.lesson_id and e.title = 'Exercice 1 — Notions et repères : histoire et humanité')
      returning id into exercise_one_id;

      if exercise_one_id is not null then
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order)
        values
          (exercise_one_id, 'single_choice', 'Que désigne l’humanité au sens propre ?', jsonb_build_array('La totalité des hommes et des communautés humaines', 'Une seule nation dominante', 'Les seules inventions techniques', 'La nature sans l’homme'), jsonb_build_array('La totalité des hommes et des communautés humaines'), 'Le document présente d’abord l’humanité comme l’ensemble des hommes sur la Terre.', 10),
          (exercise_one_id, 'single_choice', 'Quelle double signification reçoit l’histoire dans la leçon ?', jsonb_build_array('Les faits passés et l’étude de ces faits', 'Les récits imaginaires seulement', 'Les lois scientifiques uniquement', 'La mémoire individuelle sans le passé'), jsonb_build_array('Les faits passés et l’étude de ces faits'), 'L’histoire désigne les événements du passé humain et leur connaissance.', 20),
          (exercise_one_id, 'single_choice', 'Qu’appelle-t-on perfectibilité chez Rousseau ?', jsonb_build_array('La capacité humaine de se transformer et de s’améliorer', 'La suppression de toute éducation', 'Le rejet de la culture', 'Une domination naturelle sur autrui'), jsonb_build_array('La capacité humaine de se transformer et de s’améliorer'), 'La perfectibilité explique le rôle de la culture, de l’éducation et du devenir humain.', 30),
          (exercise_one_id, 'single_choice', 'Quelle affirmation distingue l’existence de l’essence dans la perspective de Sartre ?', jsonb_build_array('L’existence précède l’essence', 'L’essence précède toujours l’existence', 'L’homme est sans action', 'La culture est inutile'), jsonb_build_array('L’existence précède l’essence'), 'La formule signifie que l’homme se construit par son existence et ses actes.', 40),
          (exercise_one_id, 'true_false', 'La civilisation peut être comprise comme la culture mise en action dans les valeurs et les techniques.', jsonb_build_array('Vrai', 'Faux'), jsonb_build_array('Vrai'), 'Le document associe la civilisation aux valeurs morales et techniques et à leur mise en œuvre.', 50);
      end if;

      exercise_one_id := null;
      insert into public.exercises (subject_id, level_id, series_id, chapter_id, lesson_id, title, statement, solution, exercise_type, difficulty, content_markdown, correction_markdown, is_published, is_active, estimated_duration_minutes, display_order)
      select target.subject_id, target.level_id, target.series_id, target.chapter_id, target.lesson_id,
        'Exercice 2 — Responsabilité, histoire et diversité culturelle',
        'Analysez le rôle de l’homme dans l’histoire et les exigences de l’humanité.',
        'La correction confronte les conceptions de l’homme objet ou sujet de l’histoire et explique le refus de l’ethnocentrisme.',
        'single_choice', 'medium',
        '## Consigne\n\nIdentifiez les arguments utiles pour une réflexion sur l’action humaine, la domination et la diversité culturelle.',
        '## Correction\n\nL’homme est soumis à des conditions héritées, mais il peut agir. La diversité culturelle exige le refus de l’ethnocentrisme et le respect de la dignité humaine.',
        false, false, 14, 20
      where not exists (select 1 from public.exercises e where e.lesson_id = target.lesson_id and e.title = 'Exercice 2 — Responsabilité, histoire et diversité culturelle')
      returning id into exercise_two_id;

      if exercise_two_id is not null then
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order)
        values
          (exercise_two_id, 'single_choice', 'Que signifie dire que l’homme est objet de l’histoire ?', jsonb_build_array('Il subit des forces ou conditions qui dépassent sa volonté', 'Il ne vit jamais dans le temps', 'Il crée seul toutes les circonstances', 'Il ignore toujours le passé'), jsonb_build_array('Il subit des forces ou conditions qui dépassent sa volonté'), 'Cette perspective insiste sur les forces historiques, religieuses ou rationnelles qui influencent les événements.', 10),
          (exercise_two_id, 'single_choice', 'Quelle idée exprime le mieux l’homme sujet de l’histoire ?', jsonb_build_array('Les hommes peuvent agir et faire leur histoire dans des conditions héritées', 'L’homme est un simple jouet sans action', 'Le passé n’existe pas', 'La culture impose une seule vérité'), jsonb_build_array('Les hommes peuvent agir et faire leur histoire dans des conditions héritées'), 'La formulation relie l’action humaine aux conditions héritées du passé.', 20),
          (exercise_two_id, 'single_choice', 'Qu’est-ce que l’ethnocentrisme ?', jsonb_build_array('La tendance à prendre sa propre culture comme norme absolue', 'Le respect égal des cultures', 'La connaissance de toutes les langues', 'Le refus de toute tradition'), jsonb_build_array('La tendance à prendre sa propre culture comme norme absolue'), 'L’ethnocentrisme peut conduire à l’exclusion et à la domination.', 30),
          (exercise_two_id, 'single_choice', 'Pourquoi décoloniser et désaliéner sont-ils présentés comme des exigences humaines ?', jsonb_build_array('Parce qu’ils refusent les rapports de domination et restaurent la dignité', 'Parce qu’ils imposent une culture unique', 'Parce qu’ils effacent toute histoire', 'Parce qu’ils interdisent les échanges culturels'), jsonb_build_array('Parce qu’ils refusent les rapports de domination et restaurent la dignité'), 'La leçon relie ces exigences au respect des peuples et de leur diversité.', 40),
          (exercise_two_id, 'true_false', 'La diversité culturelle doit nécessairement être considérée comme une menace pour l’humanité.', jsonb_build_array('Vrai', 'Faux'), jsonb_build_array('Faux'), 'Le document présente la diversité culturelle comme une source possible d’enrichissement mutuel.', 50);
      end if;

      exercise_two_id := null;
      insert into public.quizzes (subject_id, level_id, series_id, subject_offering_id, chapter_id, lesson_id, title, description, difficulty, duration_minutes, display_order, is_published, is_active)
      select target.subject_id, target.level_id, target.series_id, target.offering_id, target.chapter_id, target.lesson_id,
        'Quiz de révision — L’histoire et l’humanité',
        'Évaluez votre compréhension des notions, du rôle de l’homme dans l’histoire et de la diversité culturelle.',
        'medium', 12, 10, false, false
      where not exists (select 1 from public.quizzes q where q.lesson_id = target.lesson_id and q.title = 'Quiz de révision — L’histoire et l’humanité')
      returning id into quiz_id;

      if quiz_id is not null then
        with inserted_questions as (
          insert into public.quiz_questions (quiz_id, question, explanation, question_type, display_order, points, is_active)
          values
            (quiz_id, 'Quel rapport relie l’histoire, le présent et l’avenir ?', 'Le passé éclaire le présent, qui contribue à préparer l’avenir.', 'single_choice', 10, 1, true),
            (quiz_id, 'Quel rôle joue la mémoire collective ?', 'Elle aide à restituer le passé et à orienter le devenir humain.', 'single_choice', 20, 1, true),
            (quiz_id, 'Quelle thèse associe l’histoire à l’action des hommes ?', 'Le matérialisme historique souligne que les hommes font leur histoire dans des conditions héritées.', 'single_choice', 30, 1, true),
            (quiz_id, 'Quelle position permet de penser l’homme comme produit et agent de l’histoire ?', 'L’homme subit certaines circonstances tout en pouvant agir sur elles.', 'single_choice', 40, 1, true),
            (quiz_id, 'Quel danger l’ethnocentrisme fait-il courir ?', 'Il peut justifier l’exclusion et la domination des autres cultures.', 'single_choice', 50, 1, true),
            (quiz_id, 'Quelle idée soutient l’humanisme dans la leçon ?', 'La diversité culturelle peut enrichir l’humanité si la dignité de chacun est respectée.', 'single_choice', 60, 1, true)
          returning id, display_order
        )
        insert into public.quiz_answers (question_id, answer, is_correct, display_order)
        select q.id, a.answer, a.is_correct, a.display_order
        from inserted_questions q
        join lateral (
          select * from (values
            (10, 'Le passé éclaire le présent et prépare l’avenir', true, 10), (10, 'Le passé doit être oublié', false, 20), (10, 'Seul le futur compte', false, 30),
            (20, 'Restituer le passé et orienter le devenir humain', true, 10), (20, 'Supprimer toute tradition', false, 20), (20, 'Nier l’histoire', false, 30),
            (30, 'Les hommes font leur histoire dans des conditions héritées', true, 10), (30, 'L’homme ne fait jamais rien', false, 20), (30, 'La technique remplace l’histoire', false, 30),
            (40, 'Il subit des circonstances et peut aussi agir sur elles', true, 10), (40, 'Il est entièrement passif', false, 20), (40, 'Il ne dépend d’aucune condition', false, 30),
            (50, 'Il peut justifier l’exclusion et la domination', true, 10), (50, 'Il garantit l’égalité', false, 20), (50, 'Il est une méthode scientifique', false, 30),
            (60, 'La diversité peut enrichir l’humanité dans le respect de la dignité', true, 10), (60, 'Une culture doit dominer toutes les autres', false, 20), (60, 'Les peuples ne doivent jamais échanger', false, 30)
          ) as answers(question_order, answer, is_correct, display_order)
        ) a on a.question_order = q.display_order;
      end if;

    elsif target.lesson_key = 'philosophy_value' then
      insert into public.exercises (subject_id, level_id, series_id, chapter_id, lesson_id, title, statement, solution, exercise_type, difficulty, content_markdown, correction_markdown, is_published, is_active, estimated_duration_minutes, display_order)
      select target.subject_id, target.level_id, target.series_id, target.chapter_id, target.lesson_id,
        'Exercice 1 — Philosophie, raison et mythe',
        'Distinguez les notions fondamentales et leur mode d’explication.',
        'La correction compare le savoir rationnel, la raison et le récit mythique.',
        'single_choice', 'easy',
        '## Consigne\n\nRépondez en vous appuyant sur les définitions et la comparaison des notions étudiées.',
        '## Correction\n\nLa philosophie est une quête critique de la sagesse ; la raison cherche à justifier ; le mythe est un récit symbolique lié aux croyances et aux cultures.',
        false, false, 12, 10
      where not exists (select 1 from public.exercises e where e.lesson_id = target.lesson_id and e.title = 'Exercice 1 — Philosophie, raison et mythe')
      returning id into exercise_one_id;

      if exercise_one_id is not null then
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order)
        values
          (exercise_one_id, 'single_choice', 'Que signifie étymologiquement philosophie ?', jsonb_build_array('Amour de la sagesse', 'Refus de toute connaissance', 'Récit des origines', 'Science appliquée'), jsonb_build_array('Amour de la sagesse'), 'Le document rattache le mot philosophie à l’amour de la sagesse.', 10),
          (exercise_one_id, 'single_choice', 'Quel rôle remplit la raison ?', jsonb_build_array('Connaître, juger et justifier selon des principes', 'Produire seulement des images', 'Transmettre une croyance sans examen', 'Supprimer toute question'), jsonb_build_array('Connaître, juger et justifier selon des principes'), 'La raison permet de distinguer le vrai du faux et de présenter des justifications.', 20),
          (exercise_one_id, 'single_choice', 'Comment le mythe est-il caractérisé ?', jsonb_build_array('Un récit imaginaire et symbolique qui cherche à donner sens', 'Une démonstration expérimentale', 'Une loi politique', 'Un calcul mathématique'), jsonb_build_array('Un récit imaginaire et symbolique qui cherche à donner sens'), 'Le mythe recourt aux symboles et aux récits pour expliquer les origines ou les phénomènes.', 30),
          (exercise_one_id, 'single_choice', 'Quelle critique Pascal adresse-t-il à l’imagination ?', jsonb_build_array('Elle peut être source d’erreurs et de faussetés', 'Elle est une preuve scientifique parfaite', 'Elle remplace la raison', 'Elle interdit les mythes'), jsonb_build_array('Elle peut être source d’erreurs et de faussetés'), 'Cette critique explique une partie de l’opposition entre raison et mythe.', 40),
          (exercise_one_id, 'true_false', 'La philosophie consiste uniquement à réciter les opinions des auteurs sans les questionner.', jsonb_build_array('Vrai', 'Faux'), jsonb_build_array('Faux'), 'La philosophie demande un usage critique de la raison et l’examen des arguments.', 50);
      end if;

      exercise_one_id := null;
      insert into public.exercises (subject_id, level_id, series_id, chapter_id, lesson_id, title, statement, solution, exercise_type, difficulty, content_markdown, correction_markdown, is_published, is_active, estimated_duration_minutes, display_order)
      select target.subject_id, target.level_id, target.series_id, target.chapter_id, target.lesson_id,
        'Exercice 2 — Mythe épuré et valeur de la philosophie',
        'Analysez la complémentarité entre raison et mythe ainsi que les fonctions de la philosophie.',
        'La correction met en relation l’épuration du mythe, la pensée critique et les valeurs de la philosophie.',
        'single_choice', 'medium',
        '## Consigne\n\nIdentifiez les arguments qui permettent d’expliquer la valeur de la philosophie dans l’histoire humaine.',
        '## Correction\n\nLa philosophie ne rejette pas mécaniquement le mythe ; elle le questionne et peut l’utiliser pour éclairer l’homme. Elle a une valeur intellectuelle, morale, sociale et existentielle.',
        false, false, 14, 20
      where not exists (select 1 from public.exercises e where e.lesson_id = target.lesson_id and e.title = 'Exercice 2 — Mythe épuré et valeur de la philosophie')
      returning id into exercise_two_id;

      if exercise_two_id is not null then
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order)
        values
          (exercise_two_id, 'single_choice', 'Quelle idée résume la position de Gusdorf reprise dans le document ?', jsonb_build_array('La philosophie naît par épuration du mythe', 'Le mythe détruit toute pensée', 'La raison supprime toute culture', 'La philosophie est un récit religieux'), jsonb_build_array('La philosophie naît par épuration du mythe'), 'La formule souligne une continuité critique entre mythe et philosophie.', 10),
          (exercise_two_id, 'single_choice', 'Pourquoi Platon utilise-t-il des mythes dans ses dialogues ?', jsonb_build_array('Pour éclairer ou enseigner ce qui dépasse parfois l’expression conceptuelle directe', 'Pour renoncer à toute raison', 'Pour remplacer l’éducation', 'Pour interdire les questions'), jsonb_build_array('Pour éclairer ou enseigner ce qui dépasse parfois l’expression conceptuelle directe'), 'Le document donne les exemples de la caverne, d’Er et de l’androgyne.', 20),
          (exercise_two_id, 'single_choice', 'Quelle valeur intellectuelle possède la philosophie ?', jsonb_build_array('Elle aide à combattre l’ignorance et les préjugés', 'Elle empêche toute connaissance', 'Elle rend les arguments inutiles', 'Elle supprime les sciences'), jsonb_build_array('Elle aide à combattre l’ignorance et les préjugés'), 'La philosophie apprend à examiner les arguments au lieu de subir les préjugés.', 30),
          (exercise_two_id, 'single_choice', 'Quelle question existentielle Kant associe-t-il à la philosophie ?', jsonb_build_array('Qu’est-ce que l’homme ?', 'Comment éviter toute pensée ?', 'Quelle machine est la plus rapide ?', 'Comment supprimer l’éthique ?'), jsonb_build_array('Qu’est-ce que l’homme ?'), 'Le document rappelle cette question fondamentale dans la perspective kantienne.', 40),
          (exercise_two_id, 'true_false', 'La philosophie peut avoir une valeur politique en interrogeant la justice et l’exercice du pouvoir.', jsonb_build_array('Vrai', 'Faux'), jsonb_build_array('Vrai'), 'La leçon mobilise notamment Platon pour relier sagesse et gouvernement de la cité.', 50);
      end if;

      exercise_two_id := null;
      insert into public.quizzes (subject_id, level_id, series_id, subject_offering_id, chapter_id, lesson_id, title, description, difficulty, duration_minutes, display_order, is_published, is_active)
      select target.subject_id, target.level_id, target.series_id, target.offering_id, target.chapter_id, target.lesson_id,
        'Quiz de révision — La valeur de la philosophie',
        'Évaluez votre compréhension de la philosophie, de la raison, du mythe et de la pensée critique.',
        'medium', 12, 10, false, false
      where not exists (select 1 from public.quizzes q where q.lesson_id = target.lesson_id and q.title = 'Quiz de révision — La valeur de la philosophie')
      returning id into quiz_id;

      if quiz_id is not null then
        with inserted_questions as (
          insert into public.quiz_questions (quiz_id, question, explanation, question_type, display_order, points, is_active)
          values
            (quiz_id, 'Quelle faculté est au cœur de l’activité philosophique ?', 'La philosophie mobilise la raison de manière critique.', 'single_choice', 10, 1, true),
            (quiz_id, 'Que cherche la raison lorsqu’elle argumente ?', 'Elle cherche à justifier une conclusion par des raisons.', 'single_choice', 20, 1, true),
            (quiz_id, 'Quelle fonction le mythe peut-il remplir ?', 'Il peut transmettre une représentation symbolique du monde et de l’homme.', 'single_choice', 30, 1, true),
            (quiz_id, 'Quelle relation la leçon établit-elle entre raison et mythe ?', 'Ils s’opposent par leur méthode mais peuvent être complémentaires.', 'single_choice', 40, 1, true),
            (quiz_id, 'Pourquoi la philosophie est-elle utile à la morale ?', 'Elle interroge et fonde les valeurs sur des raisons.', 'single_choice', 50, 1, true),
            (quiz_id, 'Pourquoi la philosophie n’est-elle pas un simple luxe ?', 'Elle éclaire les savoirs, les choix, les valeurs et l’existence humaine.', 'single_choice', 60, 1, true)
          returning id, display_order
        )
        insert into public.quiz_answers (question_id, answer, is_correct, display_order)
        select q.id, a.answer, a.is_correct, a.display_order
        from inserted_questions q
        join lateral (
          select * from (values
            (10, 'La raison exercée de façon critique', true, 10), (10, 'La force physique', false, 20), (10, 'La mémoire seule', false, 30),
            (20, 'Justifier une conclusion par des raisons', true, 10), (20, 'Imposer une croyance', false, 20), (20, 'Éviter tout jugement', false, 30),
            (30, 'Transmettre une représentation symbolique du monde', true, 10), (30, 'Démontrer par une expérience', false, 20), (30, 'Édicter une loi', false, 30),
            (40, 'Ils peuvent être complémentaires malgré des méthodes différentes', true, 10), (40, 'Ils sont toujours identiques', false, 20), (40, 'Ils ne parlent jamais du monde', false, 30),
            (50, 'Elle interroge et fonde les valeurs sur des raisons', true, 10), (50, 'Elle interdit les choix', false, 20), (50, 'Elle supprime le devoir', false, 30),
            (60, 'Elle éclaire savoirs, choix, valeurs et existence', true, 10), (60, 'Elle est inutile à la vie humaine', false, 20), (60, 'Elle ne concerne que le passé', false, 30)
          ) as answers(question_order, answer, is_correct, display_order)
        ) a on a.question_order = q.display_order;
      end if;

    elsif target.lesson_key = 'progress_happiness' then
      insert into public.exercises (subject_id, level_id, series_id, chapter_id, lesson_id, title, statement, solution, exercise_type, difficulty, content_markdown, correction_markdown, is_published, is_active, estimated_duration_minutes, display_order)
      select target.subject_id, target.level_id, target.series_id, target.chapter_id, target.lesson_id,
        'Exercice 1 — Désir, création et types de progrès',
        'Vérifiez les notions qui relient le désir, les activités humaines et le progrès.',
        'La correction distingue désir, passion, travail, technique, art, imagination et les deux formes de progrès.',
        'single_choice', 'easy',
        '## Consigne\n\nRépondez aux questions en mobilisant les définitions et distinctions de la leçon.',
        '## Correction\n\nLe désir est lié au manque ; travail, technique, art et imagination sont des activités de transformation ou de création ; le progrès peut être matériel ou moral-spirituel.',
        false, false, 12, 10
      where not exists (select 1 from public.exercises e where e.lesson_id = target.lesson_id and e.title = 'Exercice 1 — Désir, création et types de progrès')
      returning id into exercise_one_id;

      if exercise_one_id is not null then
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order)
        values
          (exercise_one_id, 'single_choice', 'Comment le désir est-il défini ?', jsonb_build_array('Une aspiration vers ce qui manque et paraît source de satisfaction', 'Une absence totale de besoin', 'Une loi politique', 'Une démonstration scientifique'), jsonb_build_array('Une aspiration vers ce qui manque et paraît source de satisfaction'), 'Le désir est lié au manque et à l’attente d’une satisfaction.', 10),
          (exercise_one_id, 'single_choice', 'Quel conseil permet de penser une vie mesurée selon Épicure ?', jsonb_build_array('Distinguer les désirs naturels et nécessaires des désirs vains', 'Satisfaire immédiatement tous les désirs', 'Refuser toute satisfaction', 'Supprimer la conscience'), jsonb_build_array('Distinguer les désirs naturels et nécessaires des désirs vains'), 'La classification des désirs aide à éviter la démesure.', 20),
          (exercise_one_id, 'single_choice', 'Qu’est-ce que le travail dans la leçon ?', jsonb_build_array('Une activité consciente de transformation de la nature et de l’homme', 'Une simple passion', 'Un récit mythique', 'Une absence d’effort'), jsonb_build_array('Une activité consciente de transformation de la nature et de l’homme'), 'Le travail produit l’utile et transforme aussi l’être humain.', 30),
          (exercise_one_id, 'single_choice', 'Quel rôle joue l’imagination ?', jsonb_build_array('Former et combiner des images nouvelles, soutenir l’invention', 'Copier passivement toute réalité', 'Supprimer l’art', 'Remplacer le travail'), jsonb_build_array('Former et combiner des images nouvelles, soutenir l’invention'), 'L’imagination est présentée comme une puissance de création et de nouveauté.', 40),
          (exercise_one_id, 'true_false', 'Le progrès matériel et le progrès moral-spirituel désignent exactement la même réalité.', jsonb_build_array('Vrai', 'Faux'), jsonb_build_array('Faux'), 'La leçon les distingue pour montrer leur complémentarité.', 50);
      end if;

      exercise_one_id := null;
      insert into public.exercises (subject_id, level_id, series_id, chapter_id, lesson_id, title, statement, solution, exercise_type, difficulty, content_markdown, correction_markdown, is_published, is_active, estimated_duration_minutes, display_order)
      select target.subject_id, target.level_id, target.series_id, target.chapter_id, target.lesson_id,
        'Exercice 2 — Progrès matériel et conditions du bonheur',
        'Analysez les apports et les limites du progrès dans la recherche du bonheur.',
        'La correction explique pourquoi le progrès matériel doit être accompagné d’exigences morales et spirituelles.',
        'single_choice', 'medium',
        '## Consigne\n\nIdentifiez les arguments utiles pour une réflexion nuancée sur progrès technique et bonheur.',
        '## Correction\n\nLe progrès matériel peut améliorer les conditions de vie, mais il ne garantit pas le bonheur sans conscience morale, responsabilité et respect de la personne humaine.',
        false, false, 14, 20
      where not exists (select 1 from public.exercises e where e.lesson_id = target.lesson_id and e.title = 'Exercice 2 — Progrès matériel et conditions du bonheur')
      returning id into exercise_two_id;

      if exercise_two_id is not null then
        insert into public.exercise_questions (exercise_id, question_type, prompt_markdown, options, correct_answers, explanation_markdown, display_order)
        values
          (exercise_two_id, 'single_choice', 'Quel apport du progrès matériel est reconnu dans la leçon ?', jsonb_build_array('Il peut améliorer les moyens d’action et certaines conditions de vie', 'Il garantit automatiquement le bonheur total', 'Il supprime tout désir', 'Il remplace la conscience morale'), jsonb_build_array('Il peut améliorer les moyens d’action et certaines conditions de vie'), 'Le document reconnaît les apports de la science et de la technique sans les confondre avec le bonheur.', 10),
          (exercise_two_id, 'single_choice', 'Quelle limite Freud souligne-t-il ?', jsonb_build_array('Les progrès techniques n’ont pas automatiquement rendu les hommes plus heureux', 'La science ne produit aucun effet', 'Le travail n’existe pas', 'L’art détruit la technique'), jsonb_build_array('Les progrès techniques n’ont pas automatiquement rendu les hommes plus heureux'), 'La leçon reprend cette question pour interroger les limites du progrès matériel.', 20),
          (exercise_two_id, 'single_choice', 'Quel danger dénoncent Adorno et Horkheimer ?', jsonb_build_array('Une raison instrumentale pouvant servir des fins destructrices', 'Toute connaissance est impossible', 'La disparition des désirs naturels', 'Le refus de la technique'), jsonb_build_array('Une raison instrumentale pouvant servir des fins destructrices'), 'La critique porte sur une raison qui ne s’interroge plus sur les fins de l’action.', 30),
          (exercise_two_id, 'single_choice', 'Que signifie « supplément d’âme » dans le cadre de la leçon ?', jsonb_build_array('L’exigence d’un progrès moral et spirituel accompagnant la puissance technique', 'Une technique plus rapide', 'Le rejet de toute science', 'Une passion sans limite'), jsonb_build_array('L’exigence d’un progrès moral et spirituel accompagnant la puissance technique'), 'Bergson est mobilisé pour appeler à une élévation morale proportionnée au développement technique.', 40),
          (exercise_two_id, 'true_false', 'Le bonheur exige nécessairement de posséder une quantité illimitée de biens matériels.', jsonb_build_array('Vrai', 'Faux'), jsonb_build_array('Faux'), 'Le désir illimité peut entretenir l’insatisfaction ; la leçon insiste sur l’équilibre de la personne.', 50);
      end if;

      exercise_two_id := null;
      insert into public.quizzes (subject_id, level_id, series_id, subject_offering_id, chapter_id, lesson_id, title, description, difficulty, duration_minutes, display_order, is_published, is_active)
      select target.subject_id, target.level_id, target.series_id, target.offering_id, target.chapter_id, target.lesson_id,
        'Quiz de révision — Progrès et bonheur',
        'Évaluez votre compréhension du désir, des activités humaines, des types de progrès et des conditions du bonheur.',
        'medium', 12, 10, false, false
      where not exists (select 1 from public.quizzes q where q.lesson_id = target.lesson_id and q.title = 'Quiz de révision — Progrès et bonheur')
      returning id into quiz_id;

      if quiz_id is not null then
        with inserted_questions as (
          insert into public.quiz_questions (quiz_id, question, explanation, question_type, display_order, points, is_active)
          values
            (quiz_id, 'Quelle distinction Épicure propose-t-il à propos des désirs ?', 'Il distingue les désirs naturels et nécessaires, les naturels non nécessaires et les désirs vains.', 'single_choice', 10, 1, true),
            (quiz_id, 'Quel rôle une passion peut-elle parfois jouer ?', 'Elle peut fournir une énergie au service d’une action ou d’une création.', 'single_choice', 20, 1, true),
            (quiz_id, 'Quelle relation lie technique et science dans son sens moderne ?', 'La technique est souvent pensée comme application de la science.', 'single_choice', 30, 1, true),
            (quiz_id, 'Qu’est-ce que le progrès matériel ?', 'L’amélioration des moyens d’action et des conditions matérielles grâce notamment à la technoscience.', 'single_choice', 40, 1, true),
            (quiz_id, 'Pourquoi le progrès matériel n’est-il pas suffisant ?', 'Il peut laisser subsister l’insatisfaction et devenir destructeur sans orientation morale.', 'single_choice', 50, 1, true),
            (quiz_id, 'Quelle condition du bonheur est mise en avant ?', 'Articuler des conditions matérielles dignes et un progrès moral-spirituel.', 'single_choice', 60, 1, true)
          returning id, display_order
        )
        insert into public.quiz_answers (question_id, answer, is_correct, display_order)
        select q.id, a.answer, a.is_correct, a.display_order
        from inserted_questions q
        join lateral (
          select * from (values
            (10, 'Désirs naturels nécessaires, naturels non nécessaires et vains', true, 10), (10, 'Aucun désir ne compte', false, 20), (10, 'Tous les désirs sont identiques', false, 30),
            (20, 'Fournir une énergie au service d’une action', true, 10), (20, 'Supprimer toute action', false, 20), (20, 'Interdire toute création', false, 30),
            (30, 'La technique est souvent l’application de la science', true, 10), (30, 'La science est un mythe', false, 20), (30, 'La technique exclut tout savoir', false, 30),
            (40, 'Amélioration des moyens d’action et conditions matérielles', true, 10), (40, 'Suppression des valeurs', false, 20), (40, 'Refus du travail', false, 30),
            (50, 'Il peut laisser subsister l’insatisfaction sans orientation morale', true, 10), (50, 'Il réalise toujours le bonheur total', false, 20), (50, 'Il supprime tous les risques', false, 30),
            (60, 'Associer conditions matérielles et progrès moral-spirituel', true, 10), (60, 'Accumuler sans limite', false, 20), (60, 'Refuser toute technique', false, 30)
          ) as answers(question_order, answer, is_correct, display_order)
        ) a on a.question_order = q.display_order;
      end if;
    end if;

    quiz_id := null;
  end loop;
end;
$commande$;
