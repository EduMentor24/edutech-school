import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const migrationPath = resolve(root, "supabase/migrations/20260824_physics_chemistry_terminal_cd_organic_drafts.sql");
const payloadPath = resolve(root, "supabase/migrations/20260824_physics_chemistry_terminal_cd_organic_drafts.apply.json");
const sqlText = (value) => { const tag = "$pc_cd_organic$"; if (String(value).includes(tag)) throw new Error("Délimiteur SQL présent dans le contenu."); return `${tag}${value}${tag}`; };
const jsonArray = (values) => `jsonb_build_array(${values.map(sqlText).join(",")})`;

const lessons = [
  {
    title: "Les alcools",
    description: "Identifier, nommer, classer, préparer et transformer les alcools ; relier leur structure aux produits de leurs réactions.",
    content: `# Les alcools

## Objectif

Cette leçon aide à reconnaître un alcool, à le nommer et à prévoir les grandes transformations étudiées. Les mêmes repères sont utiles en Terminale C et D : **structure → classe → propriété chimique → produit formé**.

## 1. Reconnaître la fonction alcool

Un alcool est un composé organique portant un groupe hydroxyle **–OH** fixé sur un carbone tétraédrique. Ce carbone est appelé **carbone fonctionnel**.

| Écriture | Signification |
|---|---|
| **R–OH** | Formule générale : **R** représente un groupe alkyle. |
| **CₙH₂ₙ₊₂O** | Formule brute d’un alcool saturé monofonctionnel, avec **n ≥ 1**. |
| **–OH** | Groupe hydroxyle caractéristique de la fonction alcool. |

> **Vigilance :** le groupe **–OH** doit être fixé sur un carbone de la chaîne étudiée. Pour classer un alcool, on observe le carbone qui porte ce groupe, et non le nombre total de carbones de la molécule.

## 2. Nommer et classer

Pour nommer un alcool, on choisit la chaîne principale contenant le carbone fonctionnel, on numérote pour donner au groupe **–OH** l’indice le plus petit puis on remplace le « e » final de l’alcane par **-ol**.

| Exemple | Nom | Classe | Raisonnement |
|---|---|---|---|
| **CH₃–CH₂–OH** | éthanol | primaire | Le carbone fonctionnel est lié à un seul groupe alkyle. |
| **CH₃–CHOH–CH₃** | propan-2-ol | secondaire | Il est lié à deux groupes alkyles. |
| **(CH₃)₃C–OH** | 2-méthylpropan-2-ol | tertiaire | Il est lié à trois groupes alkyles. |

Une classe n’est pas un jugement de difficulté : elle sert surtout à anticiper l’oxydation ménagée.

## 3. Préparer un alcool

Le PDF étudie deux voies. La fermentation transforme un sucre fermentescible sous l’action des levures ; la forme équilibrée de la fermentation du glucose est :

**C₆H₁₂O₆ → 2 C₂H₅OH + 2 CO₂**.

L’hydratation d’un alcène ajoute les éléments de l’eau sur la double liaison. Dans le cas présenté, l’hydratation du propène conduit majoritairement au propan-2-ol. Le support relie ce résultat à la règle de Markovnikov : l’hydrogène s’ajoute au carbone de la double liaison qui porte déjà le plus d’atomes d’hydrogène.

## 4. Réactions caractéristiques

| Transformation | Idée essentielle | Produit ou observation attendu |
|---|---|---|
| Action du sodium | L’alcool forme un alcoolate et libère du dihydrogène. | **2 R–OH + 2 Na → 2 R–O⁻Na⁺ + H₂** |
| Déshydratation intramoléculaire | Une même molécule perd de l’eau. | Formation d’un alcène. |
| Déshydratation intermoléculaire | Deux molécules d’alcool réagissent. | Formation d’un étheroxyde et d’eau. |
| Combustion complète | L’alcool réagit avec le dioxygène. | **CₙH₂ₙ₊₁OH + 3n/2 O₂ → n CO₂ + (n+1) H₂O** |

## 5. Oxydation ménagée : le rôle de la classe

| Alcool de départ | Avec oxydant en défaut | Avec oxydant en excès | À retenir |
|---|---|---|---|
| Primaire **R–CH₂OH** | Aldéhyde | Acide carboxylique | La chaîne conserve le même nombre de carbones. |
| Secondaire **R₁–CHOH–R₂** | Cétone | Cétone dans le cadre du cours | Le groupe carbonyle se forme sur le carbone fonctionnel. |
| Tertiaire | Pas d’oxydation ménagée dans les conditions du support | — | La classe explique l’absence de produit carbonylé attendu. |

Le support illustre l’éthanol oxydé en éthanal ou en acide éthanoïque selon la quantité d’oxydant, ainsi que le propan-2-ol oxydé en propanone. Avant d’écrire une équation, identifie donc d’abord la classe de l’alcool et le milieu précisé.

## 6. Polyols et méthode de résolution

Un **polyol** possède plusieurs groupes hydroxyles ; le glycol et le glycérol sont les exemples cités. Pour résoudre un problème d’identification, procède dans cet ordre : déterminer la formule brute à partir des données, lister les isomères possibles, utiliser la classe révélée par l’oxydation, puis vérifier la cohérence du produit obtenu.

> **Synthèse :** savoir nommer et classer un alcool permet de prévoir une partie décisive de sa réactivité. Ne choisis jamais le produit d’oxydation avant d’avoir déterminé la classe de l’alcool.

| Vocabulaire | Sens utile |
|---|---|
| Carbone fonctionnel | Carbone portant le groupe **–OH**. |
| Alcoolate | Espèce obtenue lorsque l’alcool perd l’hydrogène de son groupe hydroxyle. |
| Déshydratation | Élimination d’une molécule d’eau. |
| Oxydation ménagée | Transformation contrôlée qui conduit à un produit organique précis. |
| Polyol | Alcool portant plusieurs groupes hydroxyles. |`,
    exerciseA: [
      ["Quelle propriété détermine la classe d’un alcool ?", ["Le nombre de groupes alkyles liés au carbone fonctionnel", "Le nombre total d’atomes d’oxygène", "La masse molaire seulement"], ["Le nombre de groupes alkyles liés au carbone fonctionnel"], "La classe primaire, secondaire ou tertiaire dépend de l’environnement du carbone portant `–OH`."],
      ["Quel produit obtient-on par oxydation ménagée d’un alcool secondaire selon le support ?", ["Une cétone", "Un aldéhyde", "Un acide carboxylique directement"], ["Une cétone"], "Un alcool secondaire conduit à une cétone dans le cadre étudié."],
      ["Quelle voie transforme le propène en propan-2-ol dans le PDF ?", ["L’hydratation de l’alcène", "La combustion", "La réaction avec le sodium"], ["L’hydratation de l’alcène"], "L’eau s’ajoute sur la double liaison lors de l’hydratation."],
      ["Quelle formule correspond à un alcool saturé monofonctionnel ?", ["CₙH₂ₙ₊₂O", "CₙH₂ₙO", "CₙH₂ₙ₊₃N"], ["CₙH₂ₙ₊₂O"], "Les deux autres formules servent ici respectivement aux composés carbonylés et aux amines saturées."],
    ],
    exerciseB: [
      ["Pourquoi un alcool primaire peut-il donner deux produits selon la quantité d’oxydant ?", ["Un aldéhyde avec oxydant en défaut, puis un acide avec oxydant en excès", "Il change de classe au hasard", "Il ne réagit jamais"], ["Un aldéhyde avec oxydant en défaut, puis un acide avec oxydant en excès"], "Le PDF distingue explicitement les deux situations d’oxydation d’un alcool primaire."],
      ["Quelle transformation conduit à un alcène à partir d’un alcool ?", ["La déshydratation intramoléculaire", "La fermentation", "La réduction de Tollens"], ["La déshydratation intramoléculaire"], "Une élimination d’eau dans une même molécule forme l’alcène."],
      ["Comment numérote-t-on la chaîne d’un alcool lors de la nomenclature ?", ["Pour donner l’indice le plus faible au carbone portant `–OH`", "Toujours depuis le carbone le plus éloigné", "Selon l’ordre alphabétique des substituants uniquement"], ["Pour donner l’indice le plus faible au carbone portant `–OH`"], "Le groupe hydroxyle est la fonction prioritaire pour cette numérotation."],
      ["Quelle espèce est libérée lors de l’action du sodium sur un alcool ?", ["Le dihydrogène", "Le dioxyde de carbone", "Le dioxygène"], ["Le dihydrogène"], "La réaction forme un alcoolate et libère `H₂`."],
    ],
  },
  {
    title: "Composés carbonylés : aldéhydes et cétones",
    description: "Reconnaître, nommer et différencier aldéhydes et cétones à partir de leur groupe carbonyle et de leurs tests caractéristiques.",
    content: `# Composés carbonylés : aldéhydes et cétones

## Objectif

Les aldéhydes et les cétones possèdent tous deux un groupe carbonyle. Pour les distinguer avec rigueur, il faut combiner **structure**, **nomenclature** et **résultat des tests**.

## 1. Le groupe carbonyle

Un composé carbonylé est un composé organique oxygéné comportant le groupe **C=O**. Dans le cadre des composés acycliques saturés étudiés, le support donne la formule brute **CₙH₂ₙO**.

| Famille | Écriture générale | Position du groupe carbonyle |
|---|---|---|
| Aldéhyde | **R–CHO** | En bout de chaîne ; le carbone carbonylé est lié à un hydrogène. |
| Cétone | **R₁–CO–R₂** | À l’intérieur de la chaîne ; le carbone carbonylé est lié à deux groupes carbonés. |

> **Repère visuel :** la présence du groupe **–CHO** permet d’identifier un aldéhyde. Une cétone ne porte pas ce groupe terminal.

## 2. Nommer correctement

Pour un aldéhyde, le nom de l’alcane correspondant se termine par **-al**. Le carbone fonctionnel est numéroté 1. Pour une cétone, le suffixe est **-one** et le carbone fonctionnel reçoit l’indice le plus petit possible.

| Formule | Nom | Justification |
|---|---|---|
| **CH₃–CHO** | éthanal | Aldéhyde à deux carbones. |
| **CH₃–CH₂–CHO** | propanal | Groupe **–CHO** terminal. |
| **CH₃–CO–CH₃** | propan-2-one ou propanone | Cétone dont le carbonyle est au carbone 2. |
| **CH₃–CO–CH₂–CH₃** | butan-2-one | La numérotation minimise l’indice du carbonyle. |

## 3. Un test commun : la 2,4-DNPH

La 2,4-dinitrophénylhydrazine, abrégée **2,4-DNPH**, donne un précipité jaune-orangé en présence d’un aldéhyde ou d’une cétone. Ce résultat indique la présence d’un composé carbonylé, mais il ne permet pas encore de choisir entre les deux familles.

## 4. Les tests qui distinguent

| Réactif | Aldéhyde | Cétone | Ce que l’on conclut |
|---|---|---|---|
| 2,4-DNPH | Précipité jaune-orangé | Précipité jaune-orangé | Test commun : composé carbonylé. |
| Réactif de Schiff | Coloration rose | Pas de changement décrit | Aldéhyde si la coloration apparaît. |
| Réactif de Tollens | Dépôt ou miroir d’argent | Pas de réaction décrite | L’aldéhyde réduit les ions d’argent. |
| Liqueur de Fehling | Précipité rouge brique de **Cu₂O** | Pas de réaction décrite | L’aldéhyde réduit les ions cuivre II. |

Les aldéhydes sont donc des réducteurs dans les essais de Tollens et de Fehling présentés. Ils sont oxydés en ions carboxylates ; les cétones ne donnent pas ces réponses positives dans le cadre du support.

## 5. Lire une équation de Fehling

La forme générale donnée est :

**R–CHO + 2 Cu²⁺ + 5 OH⁻ → R–COO⁻ + Cu₂O + 3 H₂O**.

Avant de mémoriser une équation, relève le milieu basique, l’oxydation de l’aldéhyde et la réduction des ions cuivre II. L’apparition du précipité rouge brique est l’observation expérimentale qui accompagne cette transformation.

## 6. Méthode d’identification

1. Vérifie d’abord si la 2,4-DNPH est positive : le composé est alors carbonylé.  
2. Utilise ensuite Schiff, Tollens ou Fehling.  
3. Réponse positive à l’un de ces tests différenciants : aldéhyde.  
4. DNPH positive mais tests différenciants négatifs : cétone dans les conditions étudiées.  
5. Termine par la formule semi-développée et le nom cohérents avec les données de chaîne.

> **Synthèse :** DNPH répond à « y a-t-il un carbonyle ? » ; Fehling, Tollens et Schiff répondent à « s’agit-il d’un aldéhyde ? ».

| Vocabulaire | Sens utile |
|---|---|
| Carbonyle | Groupe **C=O** caractéristique des deux familles. |
| Aldéhyde | Composé carbonylé portant un hydrogène sur le carbone fonctionnel. |
| Cétone | Composé carbonylé portant deux groupes carbonés autour du carbone fonctionnel. |
| Réducteur | Espèce qui cède des électrons dans une oxydoréduction. |
| Carboxylate | Ion obtenu par oxydation d’un aldéhyde dans les essais présentés. |`,
    exerciseA: [
      ["Quel résultat donne la 2,4-DNPH avec un aldéhyde ou une cétone ?", ["Un précipité jaune-orangé", "Un miroir d’argent uniquement", "Une coloration rose uniquement"], ["Un précipité jaune-orangé"], "La DNPH est le test commun des composés carbonylés étudiés."],
      ["Quel groupe permet d’identifier un aldéhyde ?", ["–CHO", "–OH", "–NH₂"], ["–CHO"], "Le groupe terminal `–CHO` caractérise l’aldéhyde."],
      ["Quelle observation avec la liqueur de Fehling indique un aldéhyde ?", ["Un précipité rouge brique de Cu₂O", "Un précipité jaune-orangé", "Aucune transformation"], ["Un précipité rouge brique de Cu₂O"], "Les aldéhydes réduisent les ions cuivre II en oxyde de cuivre I."],
      ["Comment nomme-t-on `CH₃–CO–CH₃` ?", ["Propan-2-one ou propanone", "Propanal", "Propan-1-ol"], ["Propan-2-one ou propanone"], "Le groupe carbonyle est interne : il s’agit d’une cétone."],
    ],
    exerciseB: [
      ["Un composé donne DNPH positive et Fehling négative. Quelle famille retient-on dans le cadre du cours ?", ["Une cétone", "Un aldéhyde", "Un alcool primaire"], ["Une cétone"], "La DNPH confirme le carbonyle ; Fehling distingue l’aldéhyde par une réponse positive."],
      ["Pourquoi le test de DNPH ne suffit-il pas à distinguer les deux familles ?", ["Il est positif avec les aldéhydes comme avec les cétones", "Il est négatif avec tous les carbonylés", "Il mesure la longueur de la chaîne"], ["Il est positif avec les aldéhydes comme avec les cétones"], "Il faut compléter avec Schiff, Tollens ou Fehling."],
      ["Quel suffixe est associé aux aldéhydes ?", ["-al", "-one", "-amine"], ["-al"], "Les cétones utilisent le suffixe `-one`."],
      ["Quelle espèce organique est obtenue lorsqu’un aldéhyde est oxydé dans le test de Tollens ou Fehling ?", ["Un ion carboxylate", "Un alcoolate", "Un alcène"], ["Un ion carboxylate"], "Le PDF décrit l’oxydation de l’aldéhyde en ion carboxylate."],
    ],
  },
  {
    title: "Les amines",
    description: "Identifier, classer et nommer les amines ; expliquer leur caractère basique et nucléophile à partir du doublet non liant de l’azote.",
    content: `# Les amines

## Objectif

Les amines forment une famille organique azotée. Cette leçon relie leur structure aux deux propriétés qui organisent les exercices du support : leur **caractère basique faible** et leur **caractère nucléophile**.

## 1. Définition et formule

Une amine résulte du remplacement d’un ou plusieurs atomes d’hydrogène de l’ammoniac **NH₃** par des groupements alkyles ou aryles. Pour les amines saturées, le support donne la formule brute générale **CₙH₂ₙ₊₃N**.

Le point commun important est le **doublet non liant** de l’atome d’azote. C’est lui qui permet à l’amine de capter un proton dans l’eau et d’attaquer un centre électrophile lors d’une alkylation.

## 2. Les trois classes

| Classe | Écriture générale | Ce que l’on compte |
|---|---|---|
| Amine primaire | **R–NH₂** | Un groupe carboné lié à l’azote. |
| Amine secondaire | **R₁–NH–R₂** | Deux groupes carbonés liés à l’azote. |
| Amine tertiaire | **R₁–N(R₂)–R₃** | Trois groupes carbonés liés à l’azote. |

> **Méthode :** cherche l’atome d’azote, puis compte les groupes carbonés qui lui sont directement liés. Ne confonds pas le nombre total de carbones de la molécule avec la classe de l’amine.

## 3. Nommer une amine

Le support propose deux écritures compatibles. Une amine primaire peut prendre le suffixe **-amine** à partir de l’alcane, par exemple méthanamine, ou la forme alkylamine, par exemple méthylamine. Pour une amine secondaire ou tertiaire, les groupes fixés sur l’azote sont placés avant le nom et repérés par **N-** ou **N,N-**.

| Formule | Nom possible | Classe |
|---|---|---|
| **CH₃–NH₂** | méthanamine ou méthylamine | primaire |
| **C₂H₅–NH–CH₃** | N-méthyléthanamine | secondaire |
| **C₂H₅–N(CH₃)₂** | N,N-diméthyléthanamine | tertiaire |

## 4. Une base faible dans l’eau

Le doublet non liant de l’azote permet à l’amine de capter un proton de l’eau. Pour une amine primaire, l’équation est :

**R–NH₂ + H₂O ⇌ R–NH₃⁺ + OH⁻**.

La flèche double rappelle que le caractère basique est faible : il s’agit d’un équilibre. Lorsque tu écris l’équation de la méthylamine, vérifie la conservation des atomes et des charges avant de conclure que des ions hydroxyde se forment.

## 5. Une espèce nucléophile

Le même doublet non liant rend l’amine nucléophile. Dans la réaction d’Hofmann, ou alkylation des amines selon le support, l’azote attaque le carbone d’un dérivé halogéné **R–X**, avec **X** pouvant être **Cl**, **Br** ou **I**.

L’alkylation peut faire passer progressivement d’une amine primaire à une secondaire puis tertiaire ; une amine tertiaire peut former un ion ammonium quaternaire. Il faut toujours identifier la classe de départ et compter les groupes déjà fixés sur l’azote pour prévoir le type de produit.

## 6. Démarche d’identification

Dans les problèmes du PDF, une composition massique ou une masse molaire permet de déterminer une formule brute. Ensuite :

1. Écris les isomères compatibles avec la formule.  
2. Nomme-les et classe-les en observant l’azote.  
3. Utilise l’indice sur la chaîne — linéaire ou ramifiée — pour choisir la bonne structure.  
4. Si l’eau ou un halogénoalcane est présent, relie l’équation à la propriété basique ou nucléophile demandée.

> **Synthèse :** le doublet non liant explique deux comportements différents mais liés : l’amine peut recevoir un proton dans l’eau et donner son doublet à un carbone électrophile lors de l’alkylation.

| Vocabulaire | Sens utile |
|---|---|
| Doublet non liant | Paire d’électrons non engagée dans une liaison autour de l’azote. |
| Base faible | Espèce qui capte partiellement un proton dans l’eau, à l’équilibre. |
| Nucléophile | Espèce capable de donner un doublet d’électrons à un centre électrophile. |
| Alkylation | Introduction d’un groupe alkyle sur l’azote par réaction avec un dérivé halogéné. |
| Ammonium quaternaire | Ion positif portant quatre groupes carbonés autour de l’azote. |`,
    exerciseA: [
      ["Comment détermine-t-on la classe d’une amine ?", ["En comptant les groupes carbonés directement liés à l’azote", "En comptant uniquement les atomes d’hydrogène", "En regardant la couleur de la solution"], ["En comptant les groupes carbonés directement liés à l’azote"], "Un, deux ou trois groupes carbonés donnent respectivement une amine primaire, secondaire ou tertiaire."],
      ["Quelle formule représente une amine primaire ?", ["R–NH₂", "R₁–NH–R₂", "R₁–N(R₂)–R₃"], ["R–NH₂"], "L’azote porte un seul groupe carboné dans une amine primaire."],
      ["Quelle propriété est mise en évidence lorsque l’amine réagit avec l’eau ?", ["Son caractère basique faible", "Son caractère carbonylé", "Sa combustion complète"], ["Son caractère basique faible"], "L’amine capte un proton de l’eau grâce au doublet non liant de l’azote."],
      ["Quelle formule brute générale donne le support pour les amines saturées ?", ["CₙH₂ₙ₊₃N", "CₙH₂ₙO", "CₙH₂ₙ₊₂O"], ["CₙH₂ₙ₊₃N"], "Les autres formules concernent ici les carbonylés et les alcools saturés monofonctionnels."],
    ],
    exerciseB: [
      ["Pourquoi une amine peut-elle agir comme nucléophile ?", ["Son azote possède un doublet non liant", "Elle contient forcément un groupe carbonyle", "Elle porte toujours un groupe hydroxyle"], ["Son azote possède un doublet non liant"], "Le doublet peut être donné à un centre électrophile lors de l’alkylation."],
      ["Quel préfixe indique un substituant porté par l’azote dans la nomenclature ?", ["N-", "iso-", "hydroxy-"], ["N-"], "On emploie notamment `N-` ou `N,N-` pour les substituants de l’azote."],
      ["Quelle transformation est aussi appelée réaction d’Hofmann dans le support ?", ["L’alkylation des amines", "La déshydratation d’un alcool", "La réduction de Fehling"], ["L’alkylation des amines"], "L’amine attaque un carbone électrophile d’un dérivé halogéné."],
      ["Quel produit acide-base accompagne la protonation d’une amine par l’eau ?", ["Des ions hydroxyde OH⁻", "Du dioxyde de carbone", "Un miroir d’argent"], ["Des ions hydroxyde OH⁻"], "L’équation générale produit l’ion aminium et l’ion hydroxyde."],
    ],
  },
];

const questionSql = (exerciseId, rows) => `insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values ${rows.map(([prompt, options, correct, explanation], index) => `(${exerciseId},'single_choice',${sqlText(prompt)},${jsonArray(options)},${jsonArray(correct)},${sqlText(explanation)},${(index + 1) * 10})`).join(",")};`;
const quizSql = (quizId, lesson, label, rows, displayOrder) => {
  const questions = rows.map(([question, , , explanation], index) => `(${quizId},${sqlText(question)},${sqlText(explanation)},'single_choice',${(index + 1) * 10},1,true)`).join(",");
  const answers = rows.flatMap(([, options, correct], index) => options.map((option, optionIndex) => `(${(index + 1) * 10},${sqlText(option)},${correct.includes(option)},${(optionIndex + 1) * 10})`)).join(",");
  return `insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active,is_test_data) values (target.subject_id,target.level_id,target.series_id,target.offering_id,target_chapter_id,target_lesson_id,${sqlText(`Quiz ${label} — ${lesson.title}`)},${sqlText(`Vérifie les méthodes et notions essentielles de la leçon ${lesson.title}.`)},'medium',12,${displayOrder},false,false,false) returning id into ${quizId}; with inserted_questions as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values ${questions} returning id,display_order) insert into public.quiz_answers(question_id,answer,is_correct,display_order) select iq.id,v.answer,v.is_correct,v.display_order from inserted_questions iq join (values ${answers}) as v(question_order,answer,is_correct,display_order) on v.question_order=iq.display_order;`;
};
const lessonSql = (lesson, index) => {
  const base = (index + 1) * 100; const exA = `lesson_${index}_exercise_a`; const exB = `lesson_${index}_exercise_b`; const quizA = `lesson_${index}_quiz_a`; const quizB = `lesson_${index}_quiz_b`;
  return `select c.id,l.id into target_chapter_id,target_lesson_id from public.chapters c join public.lessons l on l.chapter_id=c.id where c.subject_offering_id=target.offering_id and c.title ilike '%CHIMIE ORGANIQUE%' and l.title=${sqlText(lesson.title)} and not c.is_test_data and not l.is_test_data limit 1;
if target_lesson_id is null then raise exception 'La leçon % est requise pour la Terminale %.',${sqlText(lesson.title)},target.series_name; end if;
if exists (select 1 from public.lessons l where l.id=target_lesson_id and coalesce(btrim(l.content),'')<>'') then raise exception 'La leçon % de Terminale % contient déjà un cours : écrasement interdit.',${sqlText(lesson.title)},target.series_name; end if;
if exists (select 1 from public.exercises e where e.lesson_id=target_lesson_id and not e.is_test_data) or exists (select 1 from public.quizzes q where q.lesson_id=target_lesson_id and not q.is_test_data) then raise exception 'La leçon % de Terminale % possède déjà des évaluations : duplication interdite.',${sqlText(lesson.title)},target.series_name; end if;
update public.lessons set description=${sqlText(lesson.description)},content=${sqlText(lesson.content)},is_active=false where id=target_lesson_id and coalesce(btrim(content),'')='';
insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order,is_test_data) values (target.subject_id,target.level_id,target.series_id,target_chapter_id,target_lesson_id,${sqlText(`Exercice d’application — ${lesson.title}`)},${sqlText("Réponds aux questions en t’appuyant sur les définitions, tableaux et méthodes de la leçon.")},${sqlText("La correction explique la notion ou le raisonnement mobilisé pour chaque réponse.")},'single_choice','medium',${sqlText("Choisis la proposition scientifiquement cohérente avec le cours.")},${sqlText("Relis l’explication détaillée après chaque réponse.")},false,false,18,${base + 10},false) returning id into ${exA};
${questionSql(exA, lesson.exerciseA)}
insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order,is_test_data) values (target.subject_id,target.level_id,target.series_id,target_chapter_id,target_lesson_id,${sqlText(`Exercice de consolidation — ${lesson.title}`)},${sqlText("Réinvestis la méthode dans une situation équivalente puis consulte la correction détaillée.")},${sqlText("La correction relie chaque réponse à la structure ou à la transformation étudiée.")},'single_choice','medium',${sqlText("Analyse chaque indice avant de choisir une réponse.")},${sqlText("Vérifie notamment la famille chimique, le groupe fonctionnel et le lien logique.")},false,false,18,${base + 20},false) returning id into ${exB};
${questionSql(exB, lesson.exerciseB)}
${quizSql(quizA, lesson, "A — Repères", lesson.exerciseA, base + 10)}
${quizSql(quizB, lesson, "B — Raisonnement", lesson.exerciseB, base + 20)}`;
};

const migration = `-- Physique-Chimie Terminale C/D : chimie organique commune, brouillons uniquement.
do $physics_chemistry_cd_organic$
declare target record; target_chapter_id uuid; target_lesson_id uuid; offering_count integer;
  lesson_0_exercise_a uuid; lesson_0_exercise_b uuid; lesson_0_quiz_a uuid; lesson_0_quiz_b uuid;
  lesson_1_exercise_a uuid; lesson_1_exercise_b uuid; lesson_1_quiz_a uuid; lesson_1_quiz_b uuid;
  lesson_2_exercise_a uuid; lesson_2_exercise_b uuid; lesson_2_quiz_a uuid; lesson_2_quiz_b uuid;
begin
  select count(*) into offering_count from public.course_subject_offerings o join public.series se on se.id=o.series_id join public.subjects su on su.id=o.subject_id join public.levels lv on lv.id=o.level_id where se.name in ('C','D') and lv.name ilike '%Terminale%' and su.name ilike '%PHYSIQUE%CHIMIE%' and not o.is_test_data;
  if offering_count<>2 then raise exception 'Les deux offres officielles Physique-Chimie Terminale C et D sont requises.'; end if;
  for target in select o.id as offering_id,o.subject_id,o.level_id,o.series_id,se.name as series_name from public.course_subject_offerings o join public.series se on se.id=o.series_id join public.subjects su on su.id=o.subject_id join public.levels lv on lv.id=o.level_id where se.name in ('C','D') and lv.name ilike '%Terminale%' and su.name ilike '%PHYSIQUE%CHIMIE%' and not o.is_test_data order by se.name loop
    if target.series_name='C' then
      select c.id into target_chapter_id from public.chapters c where c.subject_offering_id=target.offering_id and c.title ilike '%CHIMIE ORGANIQUE%' and not c.is_test_data limit 1;
      if target_chapter_id is null then raise exception 'Le chapitre Chimie organique de Terminale C est requis.'; end if;
      if not exists (select 1 from public.lessons l where l.chapter_id=target_chapter_id and l.title=${sqlText("Les amines")} and not l.is_test_data) then
        insert into public.lessons (chapter_id,title,description,content,display_order,is_active,is_test_data) values (target_chapter_id,${sqlText("Les amines")},${sqlText("Identifier, classer et nommer les amines ; expliquer leur caractère basique et nucléophile.")},'',50,false,false);
      end if;
    end if;
${lessons.map(lessonSql).join("\n")}
  end loop;
end $physics_chemistry_cd_organic$;`;

writeFileSync(migrationPath, migration, "utf8");
writeFileSync(payloadPath, `${JSON.stringify({ project_id: "nnshioowwniursnozicg", name: "physics_chemistry_terminal_cd_organic_drafts", query: migration }, null, 2)}\n`, "utf8");
console.log(migrationPath); console.log(payloadPath);
