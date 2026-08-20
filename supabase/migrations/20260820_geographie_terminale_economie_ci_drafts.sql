do $geographie_economie_ci$
declare
  target record;
  science record;
  chapter_uuid uuid;
  expected_count integer;
  exercise_a uuid;
  exercise_b uuid;
  quiz_uuid uuid;
  course_text text;
  course_description text;
  title_exercise_a text;
  title_exercise_b text;
  title_quiz text;
begin
  -- Les séries C et D disposent de l’offre Histoire-Géographie, mais pas encore du thème de Géographie couvert par les PDF.
  for science in
    select o.id as offering_id
    from public.course_subject_offerings o
    join public.subjects sub on sub.id = o.subject_id
    join public.levels lv on lv.id = o.level_id
    join public.series s on s.id = o.series_id
    where sub.name = 'Histoire-Géographie' and lv.name = 'Terminale' and s.name in ('C','D')
  loop
    insert into public.chapters (subject_id,level_id,series_id,subject_offering_id,title,description,display_order,is_test_data,is_active)
    select o.subject_id,o.level_id,o.series_id,o.id,
      'THÈME 1 — LA CÔTE D’IVOIRE : ÉTUDE ÉCONOMIQUE',
      'Fondements, secteurs d’activités et défis du développement économique de la Côte d’Ivoire.',
      50,false,false
    from public.course_subject_offerings o
    where o.id = science.offering_id
      and not exists (select 1 from public.chapters c where c.subject_offering_id=o.id and c.title='THÈME 1 — LA CÔTE D’IVOIRE : ÉTUDE ÉCONOMIQUE');

    select id into chapter_uuid from public.chapters where subject_offering_id=science.offering_id and title='THÈME 1 — LA CÔTE D’IVOIRE : ÉTUDE ÉCONOMIQUE' limit 1;
    if chapter_uuid is null then raise exception 'Thème de Géographie introuvable pour la série scientifique.'; end if;

    insert into public.lessons (chapter_id,title,description,content,display_order,is_test_data,is_active)
    select chapter_uuid,seed.title,seed.description,null,seed.display_order,false,false
    from (values
      ('Leçon 1 — Les fondements du développement économique de la Côte d’Ivoire','Atouts naturels, humains, historiques et politiques du développement économique ivoirien.',10),
      ('Leçon 2 — Les secteurs d’activité économique de la Côte d’Ivoire','Secteurs primaire, secondaire et tertiaire : caractéristiques, rôle et limites.',20),
      ('Leçon 3 — Les problèmes du développement économique de la Côte d’Ivoire','Contraintes générales et sectorielles, ainsi que les politiques de réponse.',30)
    ) as seed(title,description,display_order)
    where not exists (select 1 from public.lessons l where l.chapter_id=chapter_uuid and l.title=seed.title);
  end loop;

  select count(*) into expected_count
  from public.lessons l
  join public.chapters c on c.id=l.chapter_id
  join public.course_subject_offerings o on o.id=c.subject_offering_id
  join public.subjects sub on sub.id=o.subject_id
  join public.levels lv on lv.id=o.level_id
  join public.series s on s.id=o.series_id
  where sub.name='Histoire-Géographie' and lv.name='Terminale' and s.name in ('A1','A2','C','D')
    and c.title='THÈME 1 — LA CÔTE D’IVOIRE : ÉTUDE ÉCONOMIQUE'
    and l.title in (
      'Leçon 1 — Les fondements du développement économique de la Côte d’Ivoire',
      'Leçon 2 — Les secteurs d’activité économique de la Côte d’Ivoire',
      'Leçon 3 — Les problèmes du développement économique de la Côte d’Ivoire'
    );
  if expected_count <> 12 then raise exception 'Douze leçons cibles sont requises avant tout remplissage ; transaction annulée.'; end if;

  for target in
    select l.id lesson_id,c.id chapter_id,o.id offering_id,o.subject_id,o.level_id,o.series_id,
      case l.title
        when 'Leçon 1 — Les fondements du développement économique de la Côte d’Ivoire' then 'fondements'
        when 'Leçon 2 — Les secteurs d’activité économique de la Côte d’Ivoire' then 'secteurs'
        else 'problemes'
      end as lesson_key
    from public.lessons l
    join public.chapters c on c.id=l.chapter_id
    join public.course_subject_offerings o on o.id=c.subject_offering_id
    join public.subjects sub on sub.id=o.subject_id
    join public.levels lv on lv.id=o.level_id
    join public.series s on s.id=o.series_id
    where sub.name='Histoire-Géographie' and lv.name='Terminale' and s.name in ('A1','A2','C','D')
      and c.title='THÈME 1 — LA CÔTE D’IVOIRE : ÉTUDE ÉCONOMIQUE'
      and l.title in (
        'Leçon 1 — Les fondements du développement économique de la Côte d’Ivoire',
        'Leçon 2 — Les secteurs d’activité économique de la Côte d’Ivoire',
        'Leçon 3 — Les problèmes du développement économique de la Côte d’Ivoire'
      )
    order by s.name,l.display_order
  loop
    if exists (select 1 from public.lessons where id=target.lesson_id and coalesce(btrim(content),'') <> '') then
      raise exception 'La leçon % contient déjà un cours. Écrasement interdit.', target.lesson_id;
    end if;

    if target.lesson_key='fondements' then
      course_description := 'Atouts naturels, humains, historiques et politiques du développement économique ivoirien.';
      course_text := $fondements$
## Les fondements du développement économique de la Côte d’Ivoire

> **Objectif :** identifier les bases naturelles, humaines, historiques et politiques de l’économie ivoirienne, puis expliquer comment elles se combinent.

## 1. Des atouts naturels variés

Le milieu physique constitue une base importante du développement économique. Le relief ivoirien est globalement peu accidenté : les plaines occupent surtout le Sud, les plateaux dominent une grande partie du territoire et les montagnes se trouvent principalement à l’Ouest. Cette disposition facilite l’installation humaine, l’agriculture et la construction de routes, d’autoroutes ou de voies ferrées.

Le climat chaud et humide se nuance en trois grands domaines. Le climat subéquatorial du Sud, très arrosé, favorise la forêt dense, les cultures d’exportation et de nombreuses cultures vivrières. Le climat tropical humide du Centre permet des cultures commerciales, vivrières et l’élevage. Le climat soudanais du Nord est propice notamment au coton, à l’anacarde, aux céréales, à l’igname et à l’élevage.

> **Définition : atout naturel.** Élément du milieu physique qui peut soutenir une activité humaine : relief, climat, eau, sol, végétation, littoral ou sous-sol.  
> **Définition : culture d’exportation.** Production agricole destinée principalement à être vendue hors du pays ou à alimenter une filière industrielle.

Le réseau hydrographique, le système lagunaire et le littoral ouvrent des possibilités d’irrigation, de pêche, de production d’énergie hydroélectrique, de tourisme et d’échanges par les ports d’Abidjan et de San Pedro. Le sous-sol contient des ressources minières et énergétiques : or, nickel, diamant, manganèse, fer, pétrole et gaz naturel. Leur exploitation crée des revenus mais suppose aussi un encadrement environnemental et technique.

## 2. Une population jeune et dynamique

La population fournit une main-d’œuvre, un marché de consommation et des initiatives entrepreneuriales. Sa diversité culturelle peut aussi soutenir des activités touristiques et créatives. La jeunesse représente une réserve d’énergie et de compétences, mais elle exige simultanément des investissements en formation, santé, logement et emploi.

> **Attention :** une population nombreuse ne devient un atout économique que si l’éducation, l’emploi, les services essentiels et les infrastructures permettent de valoriser ses capacités.

## 3. Des choix historiques et politiques

Après 1960, la Côte d’Ivoire adopte le libéralisme économique tout en maintenant une intervention forte de l’État. Les plans de développement, les entreprises publiques et l’orientation des investissements illustrent ce capitalisme d’État. La libre entreprise et l’ouverture extérieure cherchent à attirer les capitaux, les compétences et les marchés.

La crise des années 1980 entraîne des réformes : programmes d’ajustement structurel, privatisation et désengagement progressif de l’État dans certaines entreprises. L’État conserve cependant un rôle essentiel d’organisateur : infrastructures, services sociaux, fiscalité, règles de concurrence et promotion de l’investissement.

> **Définition : capitalisme d’État.** Organisation économique dans laquelle l’État intervient directement comme planificateur, investisseur ou entrepreneur.  
> **Définition : privatisation.** Transfert total ou partiel d’une entreprise ou d’une activité du secteur public vers le secteur privé.  
> **Définition : PAS.** Programme d’ajustement structurel, ensemble de réformes visant à réorganiser une économie en crise.

> **Méthode : expliquer un fondement économique**  
> N’isolez pas les éléments. Montrez le lien entre un atout naturel ou humain, une activité économique et une politique publique qui permet de le valoriser.

## Synthèse

Le développement économique ivoirien repose sur des ressources naturelles, une population dynamique et des choix politiques évolutifs. Ces fondements offrent des possibilités réelles, mais leurs effets dépendent de l’aménagement, de la formation, des investissements et d’une gestion durable.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Leçon 1 : Les fondements du développement économique de la Côte d’Ivoire »**, Géographie, Terminale, Côte d’Ivoire – École numérique.
$fondements$;
      title_exercise_a := 'Exercice 1 — Atouts naturels et humains de la Côte d’Ivoire';
      title_exercise_b := 'Exercice 2 — Choix économiques et rôle de l’État';
      title_quiz := 'Quiz de révision — Les fondements économiques de la Côte d’Ivoire';
    elsif target.lesson_key='secteurs' then
      course_description := 'Secteurs primaire, secondaire et tertiaire : caractéristiques, rôle et limites.';
      course_text := $secteurs$
## Les secteurs d’activité économique de la Côte d’Ivoire

> **Objectif :** caractériser les secteurs primaire, secondaire et tertiaire, comprendre leur complémentarité et apprécier leur contribution au développement économique.

## 1. Le secteur primaire

Le secteur primaire regroupe les activités qui exploitent directement les ressources naturelles afin de produire des matières premières. En Côte d’Ivoire, il comprend l’agriculture, l’élevage, la pêche et l’exploitation forestière. L’agriculture y occupe une place centrale grâce aux conditions naturelles, à la main-d’œuvre et aux dispositifs de recherche ou d’encadrement mentionnés dans le PDF.

Les régions forestières favorisent les cultures arborées telles que le cacao, le café, l’hévéa ou le palmier à huile. Les savanes du Nord accueillent davantage les céréales, le coton, l’arachide, l’anacarde ou le karité. Les cultures vivrières nourrissent la population et alimentent le commerce intérieur, tandis que les cultures d’exportation fournissent des recettes extérieures.

> **Définition : secteur primaire.** Ensemble des activités qui prélèvent ou produisent des ressources directement issues de la nature.  
> **Définition : filière.** Chaîne d’activités allant de la production à la transformation, au transport et à la commercialisation d’un produit.

L’élevage et la pêche complètent l’agriculture. La pêche peut être artisanale ou industrielle. L’exploitation forestière a soutenu l’économie et certaines industries, mais l’exploitation abusive fragilise le massif forestier : une ressource économique doit donc être protégée pour demeurer durable.

## 2. Le secteur secondaire

Le secteur secondaire transforme les matières premières ou fabrique des produits. L’industrialisation ivoirienne passe, selon le support, par quatre phases : import-substitution après 1960, régionalisation industrielle, stagnation au cours de la crise, puis reprise et diversification depuis 1994.

Les industries agroalimentaires sont importantes, car elles transforment des produits issus de l’agriculture. Le pays possède aussi des industries textiles, du bois, chimiques, métallurgiques, du bâtiment et d’extraction. L’activité industrielle est toutefois fortement concentrée à Abidjan et reste dominée par les industries légères et l’agro-industrie.

> **Définition : import-substitution.** Politique qui cherche à produire localement des biens auparavant importés.  
> **Définition : valeur ajoutée.** Richesse créée par une activité après déduction de la valeur des biens et services utilisés pour produire.

## 3. Le secteur tertiaire

Le secteur tertiaire rassemble les services. Il comprend notamment le commerce, les transports, le tourisme, les télécommunications et les activités financières. Le commerce intérieur relie producteurs, grossistes, détaillants et consommateurs ; le commerce extérieur concerne les exportations et importations. La balance commerciale compare la valeur des exportations à celle des importations.

Les transports routiers, ferroviaires, aériens, maritimes et lagunaires assurent les déplacements et les échanges. Le tourisme s’appuie sur le littoral, les parcs, la diversité culturelle, les monuments et les infrastructures. Ces activités génèrent des recettes et de l’emploi, mais dépendent aussi de la qualité des équipements, de la sécurité et de la protection des sites.

> **Définition : balance commerciale.** Différence entre la valeur des exportations et celle des importations d’un pays.  
> **Définition : secteur tertiaire.** Ensemble des activités de services qui ne produisent pas directement des matières premières ou des biens industriels.

> **Méthode : caractériser un secteur économique**  
> Indiquez d’abord les activités concernées, puis leurs atouts, leur rôle économique et leurs limites. Cette démarche évite de réduire un secteur à une simple liste de produits.

## Synthèse

Les secteurs primaire, secondaire et tertiaire sont complémentaires. Le primaire fournit des ressources, le secondaire les transforme et le tertiaire organise les services et les échanges. Le développement dépend donc aussi de la transformation locale, de l’aménagement et de la durabilité des ressources.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Leçon 2 : Les secteurs d’activités économiques de la Côte d’Ivoire »**, Géographie, Terminale, Côte d’Ivoire – École numérique.
$secteurs$;
      title_exercise_a := 'Exercice 1 — Identifier les secteurs d’activité économique';
      title_exercise_b := 'Exercice 2 — Rôle, limites et complémentarité des secteurs';
      title_quiz := 'Quiz de révision — Les secteurs économiques de la Côte d’Ivoire';
    else
      course_description := 'Contraintes générales et sectorielles, ainsi que les politiques de réponse.';
      course_text := $problemes$
## Les problèmes du développement économique de la Côte d’Ivoire

> **Objectif :** distinguer les problèmes généraux et sectoriels du développement, puis apprécier les réponses proposées par les pouvoirs publics et les acteurs économiques.

## 1. Des contraintes générales

L’économie ivoirienne demeure largement tournée vers l’exportation de matières premières, notamment agricoles. Cette situation est qualifiée d’**économie extravertie** : une part importante de la production dépend des marchés extérieurs. Les variations des cours mondiaux et la détérioration des termes de l’échange peuvent alors réduire les recettes et limiter les investissements productifs.

Les ressources financières sont également une contrainte. Le service de la dette, la faiblesse de l’épargne nationale et l’insuffisance de certaines recettes fiscales réduisent les marges de financement. La croissance démographique rapide crée des besoins importants en éducation, santé, logement, emploi et infrastructures. Enfin, déforestation, pollution, insalubrité et extension urbaine non maîtrisée dégradent l’environnement.

> **Définition : économie extravertie.** Économie dépendante des débouchés, capitaux ou matières premières extérieurs.  
> **Définition : termes de l’échange.** Rapport entre les prix des exportations et les prix des importations.  
> **Définition : service de la dette.** Sommes versées pour rembourser le capital et les intérêts d’une dette.

## 2. Des problèmes sectoriels

Dans le primaire, l’agriculture extensive, la pression foncière, les pratiques sur brûlis, les intrants mal maîtrisés et les aléas climatiques peuvent appauvrir les sols et réduire les rendements. Le vieillissement des vergers, l’insuffisance du stockage et les pertes après récolte fragilisent aussi les producteurs.

L’industrie reste peu diversifiée et concentrée dans le Sud, surtout à Abidjan. Les entreprises dépendent en partie de capitaux, équipements ou matières premières importés et affrontent la concurrence internationale. Dans le tertiaire, la dégradation des routes, l’insécurité, les difficultés d’accès aux sites touristiques, le manque de conservation des produits et certaines pratiques de fraude limitent la compétitivité.

> **Définition : tissu industriel.** Ensemble des entreprises et activités industrielles présentes dans un territoire.  
> **Définition : déconcentration industrielle.** Répartition des activités industrielles dans plusieurs régions pour réduire une concentration excessive.  
> **Définition : croissance inclusive.** Croissance dont les bénéfices sont plus largement partagés par les populations et les territoires.

## 3. Des réponses et des politiques

Le PDF présente plusieurs politiques : programmes d’ajustement, promotion du civisme fiscal et de l’épargne, initiatives d’allégement de dette, plans nationaux de développement, investissements agricoles et amélioration des infrastructures. Dans le primaire, la modernisation peut associer irrigation, mécanisation, plants sélectionnés, stockage, organisation des producteurs et protection environnementale.

Le renforcement de la transformation locale, la diversification et la déconcentration industrielle peuvent consolider le secondaire. Dans le tertiaire, l’amélioration des transports, la lutte contre l’insécurité et la fraude, la promotion des produits nationaux ainsi que le développement du tourisme sont des pistes retenues par le support.

> **Attention :** une solution n’est durable que si elle tient compte à la fois de l’économie, des populations, des territoires et de l’environnement.

> **Méthode : analyser un problème de développement**  
> Nommez le problème, expliquez ses causes, identifiez ses effets, puis reliez une solution précise à la difficulté étudiée. Évitez les réponses générales qui ne répondent à aucun problème particulier.

## Synthèse

Les performances économiques de la Côte d’Ivoire coexistent avec des dépendances, des contraintes financières, des défis démographiques, des pressions environnementales et des difficultés sectorielles. Les politiques publiques cherchent à les réduire par la diversification, la transformation locale, les infrastructures, l’organisation des filières et une croissance plus durable.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Leçon 3 : Les problèmes de développement économique de la Côte d’Ivoire »**, Géographie, Terminale, Côte d’Ivoire – École numérique.
$problemes$;
      title_exercise_a := 'Exercice 1 — Problèmes généraux du développement économique';
      title_exercise_b := 'Exercice 2 — Difficultés sectorielles et réponses adaptées';
      title_quiz := 'Quiz de révision — Défis du développement économique de la Côte d’Ivoire';
    end if;

    update public.lessons set description=course_description,content=course_text,is_active=false
    where id=target.lesson_id and coalesce(btrim(content),'')='';

    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
    select target.subject_id,target.level_id,target.series_id,target.chapter_id,target.lesson_id,title_exercise_a,
      'Répondez aux questions en mobilisant les définitions, repères et exemples du cours.','La correction relie chaque réponse au vocabulaire précis et à l’idée essentielle de la leçon.','single_choice','easy','## Consigne\n\nChoisissez la réponse exacte et reliez-la à une notion du cours.','## Correction\n\nUne réponse correcte doit être replacée dans le plan de la leçon.',false,false,15,10
    where not exists (select 1 from public.exercises e where e.lesson_id=target.lesson_id and e.title=title_exercise_a)
    returning id into exercise_a;

    if exercise_a is not null then
      if target.lesson_key='fondements' then
        insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
        (exercise_a,'single_choice','Quel élément est un atout naturel ?',jsonb_build_array('Le réseau hydrographique','Le code des investissements','Le civisme fiscal','La privatisation'),jsonb_build_array('Le réseau hydrographique'),'L’eau, les fleuves, les lagunes et le littoral font partie du milieu naturel.',10),
        (exercise_a,'single_choice','Que désigne le capitalisme d’État ?',jsonb_build_array('Une intervention directe de l’État dans l’économie','La disparition des services publics','Une activité exclusivement agricole','La suppression de toute règle économique'),jsonb_build_array('Une intervention directe de l’État dans l’économie'),'Le cours décrit un État planificateur, investisseur et parfois entrepreneur.',20),
        (exercise_a,'true_false','Une population jeune est automatiquement un atout, même sans formation ni emploi.',jsonb_build_array('Vrai','Faux'),jsonb_build_array('Faux'),'La jeunesse doit être accompagnée par la formation, l’emploi et les services essentiels.',30);
      elsif target.lesson_key='secteurs' then
        insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
        (exercise_a,'single_choice','Quel secteur transforme les matières premières ?',jsonb_build_array('Le secteur secondaire','Le secteur primaire','Le secteur tertiaire','Le secteur informel uniquement'),jsonb_build_array('Le secteur secondaire'),'Le secondaire transforme les ressources et produit des biens.',10),
        (exercise_a,'single_choice','Quel exemple appartient au secteur primaire ?',jsonb_build_array('La pêche artisanale','La banque','La brasserie','Le transport aérien'),jsonb_build_array('La pêche artisanale'),'La pêche exploite directement une ressource naturelle.',20),
        (exercise_a,'single_choice','Que compare la balance commerciale ?',jsonb_build_array('Les exportations et les importations','Les saisons climatiques','Les régions agricoles','Les types de relief'),jsonb_build_array('Les exportations et les importations'),'La balance commerciale compare la valeur des exportations à celle des importations.',30);
      else
        insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
        (exercise_a,'single_choice','Quel problème rend une économie vulnérable aux cours mondiaux ?',jsonb_build_array('La dépendance aux matières premières exportées','La diversification industrielle','Le stockage efficace','L’irrigation maîtrisée'),jsonb_build_array('La dépendance aux matières premières exportées'),'Une économie extravertie dépend davantage des marchés extérieurs.',10),
        (exercise_a,'single_choice','Quel effet peut avoir une agriculture extensive ?',jsonb_build_array('La déforestation','La disparition des saisons','La suppression de tout besoin de stockage','La fin des aléas climatiques'),jsonb_build_array('La déforestation'),'L’extension des cultures peut exercer une pression sur le couvert forestier.',20),
        (exercise_a,'single_choice','Quelle réponse soutient la transformation locale ?',jsonb_build_array('Le renforcement du tissu industriel','La réduction de toute formation','Le refus du stockage','La fermeture des routes'),jsonb_build_array('Le renforcement du tissu industriel'),'Le développement industriel peut transformer davantage de matières premières sur place.',30);
      end if;
    end if;

    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order)
    select target.subject_id,target.level_id,target.series_id,target.chapter_id,target.lesson_id,title_exercise_b,
      'Analysez une relation de cause à effet ou une réponse adaptée en vous appuyant sur le cours.','La correction explicite le lien entre la notion, sa cause, son effet ou sa réponse.','single_choice','medium','## Consigne\n\nChoisissez l’analyse la plus exacte puis justifiez-la par une notion de la leçon.','## Correction\n\nUne réponse complète relie le fait étudié à son contexte et à une conséquence ou une solution.',false,false,20,20
    where not exists (select 1 from public.exercises e where e.lesson_id=target.lesson_id and e.title=title_exercise_b)
    returning id into exercise_b;

    if exercise_b is not null then
      if target.lesson_key='fondements' then
        insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
        (exercise_b,'single_choice','Pourquoi le littoral est-il un atout économique ?',jsonb_build_array('Il favorise ports, échanges, pêche et tourisme','Il interdit tout échange extérieur','Il remplace toutes les routes','Il supprime les risques environnementaux'),jsonb_build_array('Il favorise ports, échanges, pêche et tourisme'),'Le cours relie le littoral aux ports, aux activités halieutiques et au tourisme.',10),
        (exercise_b,'single_choice','Quel objectif est associé à la privatisation dans le support ?',jsonb_build_array('Accroître la participation du secteur privé et les investissements','Supprimer toute activité économique','Interdire l’investissement','Réduire le rôle des infrastructures'),jsonb_build_array('Accroître la participation du secteur privé et les investissements'),'La privatisation vise notamment à accroître les investissements et la participation du privé.',20),
        (exercise_b,'true_false','Les fondements naturels suffisent seuls à expliquer le développement économique.',jsonb_build_array('Vrai','Faux'),jsonb_build_array('Faux'),'Les choix politiques, humains et les investissements participent aussi à la valorisation des ressources.',30);
      elsif target.lesson_key='secteurs' then
        insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
        (exercise_b,'single_choice','Quelle stratégie limite la dépendance aux produits bruts ?',jsonb_build_array('Transformer localement les matières premières','Exporter sans aucune transformation','Supprimer les industries','Réduire la formation'),jsonb_build_array('Transformer localement les matières premières'),'La transformation locale accroît la valeur ajoutée sur le territoire.',10),
        (exercise_b,'single_choice','Quel risque menace l’exploitation forestière ?',jsonb_build_array('La destruction du massif forestier par une exploitation abusive','La hausse automatique de la forêt','La disparition de toute demande de bois','L’absence de tout lien avec l’économie'),jsonb_build_array('La destruction du massif forestier par une exploitation abusive'),'Le support insiste sur le danger qui pèse sur le massif forestier.',20),
        (exercise_b,'true_false','Les trois secteurs sont complémentaires dans une économie.',jsonb_build_array('Vrai','Faux'),jsonb_build_array('Vrai'),'Le primaire fournit des ressources, le secondaire transforme et le tertiaire organise les services.',30);
      else
        insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values
        (exercise_b,'single_choice','Quelle mesure répond au déficit de stockage agricole ?',jsonb_build_array('Créer et améliorer des structures de stockage et de distribution','Fermer les marchés','Réduire les récoltes','Abandonner les producteurs'),jsonb_build_array('Créer et améliorer des structures de stockage et de distribution'),'Le stockage et l’organisation des filières réduisent les pertes et les déséquilibres.',10),
        (exercise_b,'single_choice','Quelle mesure peut réduire la concentration industrielle ?',jsonb_build_array('La déconcentration industrielle','La fermeture des régions','La suppression des entreprises','L’abandon des infrastructures'),jsonb_build_array('La déconcentration industrielle'),'Elle vise une meilleure répartition des activités entre les régions.',20),
        (exercise_b,'true_false','Une croissance durable doit ignorer les enjeux environnementaux.',jsonb_build_array('Vrai','Faux'),jsonb_build_array('Faux'),'La protection des ressources et de l’environnement fait partie des réponses durables.',30);
      end if;
    end if;

    insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active)
    select target.subject_id,target.level_id,target.series_id,target.offering_id,target.chapter_id,target.lesson_id,title_quiz,
      'Vérifiez votre maîtrise des notions, relations et repères essentiels de la leçon.','medium',12,10,false,false
    where not exists (select 1 from public.quizzes q where q.lesson_id=target.lesson_id and q.title=title_quiz)
    returning id into quiz_uuid;

    if quiz_uuid is not null then
      if target.lesson_key='fondements' then
        with q as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
          (quiz_uuid,'Quel climat domine au Sud dans le support ?','Le climat subéquatorial caractérise le Sud et une partie de l’Ouest montagneux.','single_choice',10,1,true),
          (quiz_uuid,'Quel type de ressource est l’or ?','L’or est une ressource minière.','single_choice',20,1,true),
          (quiz_uuid,'Quel organisme est cité pour la promotion de l’investissement ?','Le cours cite le CEPICI.','single_choice',30,1,true),
          (quiz_uuid,'Quel rôle conserve l’État après les réformes ?','Il organise l’espace économique, les infrastructures et les règles de concurrence.','single_choice',40,1,true) returning id,display_order)
        insert into public.quiz_answers (question_id,answer,is_correct,display_order)
        select q.id,v.answer,v.ok,v.ord from q join lateral (select * from (values
          (10,'Le climat subéquatorial',true,10),(10,'Le climat polaire',false,20),(20,'Une ressource minière',true,10),(20,'Une ressource halieutique',false,20),(30,'Le CEPICI',true,10),(30,'Le FLN',false,20),(40,'Un rôle d’organisateur et d’arbitre',true,10),(40,'Aucun rôle économique',false,20)) as x(qord,answer,ok,ord)) v on v.qord=q.display_order;
      elsif target.lesson_key='secteurs' then
        with q as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
          (quiz_uuid,'Quel secteur regroupe l’agriculture et la pêche ?','Il s’agit du secteur primaire.','single_choice',10,1,true),
          (quiz_uuid,'Quelle phase industrielle vise à produire localement des biens importés ?','C’est l’import-substitution.','single_choice',20,1,true),
          (quiz_uuid,'Quel secteur comprend le tourisme et les transports ?','Ces activités relèvent du secteur tertiaire.','single_choice',30,1,true),
          (quiz_uuid,'Pourquoi transformer localement ?','Cela augmente la valeur ajoutée créée dans le pays.','single_choice',40,1,true) returning id,display_order)
        insert into public.quiz_answers (question_id,answer,is_correct,display_order)
        select q.id,v.answer,v.ok,v.ord from q join lateral (select * from (values
          (10,'Le secteur primaire',true,10),(10,'Le secteur tertiaire',false,20),(20,'L’import-substitution',true,10),(20,'La décolonisation',false,20),(30,'Le secteur tertiaire',true,10),(30,'Le secteur primaire',false,20),(40,'Pour accroître la valeur ajoutée locale',true,10),(40,'Pour empêcher toute activité industrielle',false,20)) as x(qord,answer,ok,ord)) v on v.qord=q.display_order;
      else
        with q as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values
          (quiz_uuid,'Que signifie économie extravertie ?','Une économie extravertie dépend fortement des marchés ou apports extérieurs.','single_choice',10,1,true),
          (quiz_uuid,'Quel phénomène menace directement le couvert forestier ?','L’extension agricole non maîtrisée et certaines pratiques destructrices favorisent la déforestation.','single_choice',20,1,true),
          (quiz_uuid,'Quel problème caractérise une forte concentration industrielle ?','Les activités et emplois se concentrent dans peu de régions.','single_choice',30,1,true),
          (quiz_uuid,'Quelle réponse associe développement et environnement ?','La modernisation durable protège les ressources tout en améliorant la production.','single_choice',40,1,true) returning id,display_order)
        insert into public.quiz_answers (question_id,answer,is_correct,display_order)
        select q.id,v.answer,v.ok,v.ord from q join lateral (select * from (values
          (10,'Une dépendance importante aux échanges extérieurs',true,10),(10,'Une absence totale d’exportations',false,20),(20,'La déforestation',true,10),(20,'La récurrence des ports',false,20),(30,'Un déséquilibre territorial',true,10),(30,'Une répartition égale des activités',false,20),(40,'La modernisation durable',true,10),(40,'L’abandon de la protection environnementale',false,20)) as x(qord,answer,ok,ord)) v on v.qord=q.display_order;
      end if;
    end if;
  end loop;
end
$geographie_economie_ci$;
