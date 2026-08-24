-- Mathématiques Terminale C/D : cinq leçons sources Terminale C, brouillons uniquement.
-- Les structures manquantes sont créées seulement après la dernière leçon du chapitre concerné.
do $math_cd_five_lessons$
declare
  target record;
  target_chapter_id uuid;
  target_lesson_id uuid;
  offering_count integer;
  exercise_a_0 uuid; exercise_b_0 uuid; quiz_a_0 uuid; quiz_b_0 uuid;
  exercise_a_1 uuid; exercise_b_1 uuid; quiz_a_1 uuid; quiz_b_1 uuid;
  exercise_a_2 uuid; exercise_b_2 uuid; quiz_a_2 uuid; quiz_b_2 uuid;
  exercise_a_3 uuid; exercise_b_3 uuid; quiz_a_3 uuid; quiz_b_3 uuid;
  exercise_a_4 uuid; exercise_b_4 uuid; quiz_a_4 uuid; quiz_b_4 uuid;
begin
  select count(*) into offering_count
  from public.course_subject_offerings offering
  join public.subjects subject on subject.id=offering.subject_id
  join public.levels level on level.id=offering.level_id
  join public.series series on series.id=offering.series_id
  where subject.name='Mathématiques' and level.name='Terminale' and series.name in ('C','D') and not offering.is_test_data;
  if offering_count<>2 then raise exception 'Les deux offres officielles Mathématiques Terminale C et D sont requises.'; end if;

  for target in
    select offering.id as offering_id,offering.subject_id,offering.level_id,offering.series_id,series.name as series_name
    from public.course_subject_offerings offering
    join public.subjects subject on subject.id=offering.subject_id
    join public.levels level on level.id=offering.level_id
    join public.series series on series.id=offering.series_id
    where subject.name='Mathématiques' and level.name='Terminale' and series.name in ('C','D') and not offering.is_test_data
    order by series.name
  loop
    
    target_chapter_id := null;
    target_lesson_id := null;
    select chapter.id into target_chapter_id from public.chapters chapter where chapter.subject_offering_id=target.offering_id and not chapter.is_test_data order by chapter.display_order limit 1;
    if target_chapter_id is null then raise exception 'Le chapitre Mathématiques Terminale % est introuvable.', target.series_name; end if;
    if not exists (select 1 from public.lessons lesson where lesson.chapter_id=target_chapter_id and lower(lesson.title)=lower($math_cd_content$1. Limites et continuité$math_cd_content$) and not lesson.is_test_data) then
      raise exception 'La leçon existante % est requise pour la Terminale %.', $math_cd_content$1. Limites et continuité$math_cd_content$, target.series_name;
    end if;
    select lesson.id into target_lesson_id from public.lessons lesson where lesson.chapter_id=target_chapter_id and lower(lesson.title)=lower($math_cd_content$1. Limites et continuité$math_cd_content$) and not lesson.is_test_data limit 1;
    if target_lesson_id is null then raise exception 'La leçon % est introuvable après contrôle de structure.', $math_cd_content$1. Limites et continuité$math_cd_content$; end if;
    if exists (select 1 from public.lessons lesson where lesson.id=target_lesson_id and coalesce(btrim(lesson.content),'')<>'') then raise exception 'La leçon % de Terminale % contient déjà un cours : écrasement interdit.', $math_cd_content$1. Limites et continuité$math_cd_content$, target.series_name; end if;
    if exists (select 1 from public.exercises exercise where exercise.lesson_id=target_lesson_id and not exercise.is_test_data) or exists (select 1 from public.quizzes quiz where quiz.lesson_id=target_lesson_id and not quiz.is_test_data) then raise exception 'La leçon % de Terminale % possède déjà des évaluations : duplication interdite.', $math_cd_content$1. Limites et continuité$math_cd_content$, target.series_name; end if;
    update public.lessons set description=$math_cd_content$Étudier des limites, interpréter le comportement d’une courbe et établir la continuité, l’existence ou l’unicité de solutions.$math_cd_content$,content=$math_cd_content$# Limites et continuité

## Objectif

Une étude de fonction ne consiste pas à appliquer mécaniquement des formules. Elle cherche à répondre à trois questions reliées : **vers quoi tend la fonction ?**, **la courbe se prolonge-t-elle sans rupture ?** et **une équation admet-elle une solution ?**

## 1. Lire une limite avec précision

La limite décrit le comportement de \(f(x)\) lorsque \(x\) se rapproche d’un nombre ou devient très grand en valeur absolue. Elle n’affirme pas nécessairement que la fonction est définie au point approché.

| Situation | Écriture | Lecture utile |
|---|---|---|
| Au voisinage de \(a\) | \(\lim_{x\to a}f(x)=L\) | Les valeurs de \(f(x)\) se rapprochent de \(L\). |
| À droite | \(\lim_{x\to a^+}f(x)\) | On approche \(a\) par des valeurs supérieures. |
| À gauche | \(\lim_{x\to a^-}f(x)\) | On approche \(a\) par des valeurs inférieures. |
| À l’infini | \(\lim_{x\to +\infty}f(x)\) | On observe la courbe très loin vers la droite. |

> **Vigilance :** une limite en \(a\) existe seulement lorsque les limites à gauche et à droite existent et sont égales. Ne confondez pas \(f(a)\), qui concerne la valeur au point, et une limite, qui concerne les valeurs voisines.

## 2. Limite d’une fonction composée

Si \(u(x)\) tend vers \(\ell\) et si \(f(t)\) tend vers \(L\) lorsque \(t\) tend vers \(\ell\), alors, sous les conditions de définition nécessaires, \(f(u(x))\) tend vers \(L\). La méthode consiste à isoler d’abord l’expression intérieure.

> **Méthode : limite composée**  
> 1. Poser mentalement \(t=u(x)\).  
> 2. Calculer la limite de \(u(x)\).  
> 3. Lire ensuite la limite de \(f(t)\) lorsque \(t\) atteint cette valeur.  
> 4. Vérifier le sens d’approche lorsque la limite est unilatérale.

Cette organisation évite de mélanger les deux variables et permet de justifier chaque étape.

## 3. Fonctions monotones et limites

Une fonction croissante ou décroissante possède un comportement plus facile à encadrer. Le support rappelle qu’une fonction monotone et bornée sur un intervalle possède une limite à l’extrémité considérée. La borne ne donne pas automatiquement la limite : elle garantit que l’évolution monotone ne peut pas dépasser un cadre fixé.

| Information disponible | Conclusion à formuler |
|---|---|
| \(f\) croissante et majorée | La limite de \(f\) existe à droite de l’intervalle. |
| \(f\) décroissante et minorée | La limite de \(f\) existe à droite de l’intervalle. |
| Monotonie sans borne adaptée | Étudier plus précisément l’expression ou le tableau de variations. |

## 4. Interprétation graphique des limites

Une limite traduit souvent une forme visible sur la courbe.

| Résultat | Interprétation graphique |
|---|---|
| \(\lim_{x\to +\infty}f(x)=\ell\) | La droite \(y=\ell\) est une asymptote horizontale à droite. |
| \(\lim_{x\to a}f(x)=\pm\infty\) | La droite \(x=a\) est une asymptote verticale. |
| \(\lim_{x\to\pm\infty}[f(x)-(ax+b)]=0\) | La droite \(y=ax+b\) est une asymptote oblique. |
| \(\lim f(x)=\pm\infty\) et \(\lim f(x)/x=0\) | La courbe présente une branche parabolique de direction l’axe des abscisses. |

Pour étudier la position relative à une asymptote \(y=ax+b\), on étudie le signe de \(f(x)-(ax+b)\). Une limite égale à zéro prouve le rapprochement ; le signe indique si la courbe est au-dessus ou au-dessous.

## 5. Continuité et prolongement

> **Définition :** \(f\) est continue en \(a\) lorsque \(f(a)\) existe, \(\lim_{x\to a}f(x)\) existe et que ces deux nombres sont égaux.

Pour une fonction définie par morceaux, il faut donc calculer les limites à gauche et à droite, puis comparer avec la valeur donnée au point. Lorsqu’une fonction n’est pas définie en \(a\), mais possède une limite réelle \(L\) en \(a\), on peut la **prolonger par continuité** en posant \(f(a)=L\).

> **Méthode : prolonger par continuité**  
> Simplifier l’expression sur son domaine de définition ; calculer la limite au point exclu ; définir une nouvelle fonction ayant la même expression hors du point et la valeur-limite au point.

## 6. Théorème des valeurs intermédiaires

Une fonction continue sur un intervalle prend toutes les valeurs comprises entre deux de ses images. Si \(f(a)\) et \(f(b)\) sont de signes contraires, l’équation \(f(x)=0\) admet au moins une solution dans \([a;b]\). Si, en plus, \(f\) est strictement monotone sur cet intervalle, cette solution est unique.

| Étape | Justification attendue |
|---|---|
| Définir l’intervalle | Les deux bornes doivent appartenir au domaine. |
| Établir la continuité | Citer les opérations ou fonctions continues utilisées. |
| Calculer deux images | Mettre en évidence un changement de signe. |
| Conclure par le TVI | Existence d’au moins une solution. |
| Ajouter la monotonie | Unicité éventuelle. |

Le **balayage** teste des valeurs successives ; la **dichotomie** coupe un intervalle où les signes sont opposés en deux sous-intervalles. Ces méthodes donnent une approximation seulement après la justification d’existence.

## 7. Racines nièmes et puissances rationnelles

Pour tout entier naturel non nul \(n\), la fonction \(x\mapsto x^n\) permet de définir des racines nièmes dans les cas étudiés par le support. Une puissance rationnelle doit toujours être accompagnée de son domaine de définition : par exemple, la racine carrée impose une quantité sous la racine positive ou nulle.

> **Synthèse :** une limite décrit un comportement, la continuité permet de faire passer des valeurs intermédiaires et la monotonie permet souvent d’obtenir l’unicité. Toujours distinguer calcul algébrique, condition de domaine et interprétation graphique.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Leçon 1 : Limites et continuité »**, Mathématiques, Terminale C, Côte d’Ivoire – École numérique. Intégré à Terminale C et D à la demande explicite de l’administrateur.$math_cd_content$,is_active=false,is_test_data=false where id=target_lesson_id and coalesce(btrim(content),'')='';
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order,is_test_data) values (target.subject_id,target.level_id,target.series_id,target_chapter_id,target_lesson_id,$math_cd_content$Exercice 1 — Repères fondamentaux : 1. Limites et continuité$math_cd_content$,$math_cd_content$Réponds aux quatre questions en citant la définition, la propriété ou la méthode utilisée.$math_cd_content$,$math_cd_content$La correction explique la notion utile pour chaque réponse.$math_cd_content$,'single_choice','easy',$math_cd_content$## Consigne

Lis chaque proposition et choisis celle qui respecte la leçon.$math_cd_content$,$math_cd_content$## Correction

Appuie-toi sur les définitions et les encadrés de vigilance du cours.$math_cd_content$,false,false,18,10,false) returning id into exercise_a_0;
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values (exercise_a_0,'single_choice',$math_cd_content$Que faut-il comparer pour établir l’existence d’une limite en a ?$math_cd_content$,jsonb_build_array($math_cd_content$Les limites à gauche et à droite$math_cd_content$,$math_cd_content$La dérivée et la primitive$math_cd_content$,$math_cd_content$Le maximum et le minimum$math_cd_content$),jsonb_build_array($math_cd_content$Les limites à gauche et à droite$math_cd_content$),$math_cd_content$Une limite bilatérale existe lorsque les deux limites unilatérales existent et sont égales.$math_cd_content$,10),(exercise_a_0,'single_choice',$math_cd_content$Quelle droite est une asymptote verticale si la limite de f en a vaut +∞ ou -∞ ?$math_cd_content$,jsonb_build_array($math_cd_content$x = a$math_cd_content$,$math_cd_content$y = a$math_cd_content$,$math_cd_content$y = f(a)$math_cd_content$),jsonb_build_array($math_cd_content$x = a$math_cd_content$),$math_cd_content$Une divergence au voisinage de l’abscisse a correspond à une asymptote verticale d’équation x=a.$math_cd_content$,20),(exercise_a_0,'single_choice',$math_cd_content$Quelle condition supplémentaire transforme l’existence d’une solution du TVI en unicité ?$math_cd_content$,jsonb_build_array($math_cd_content$La stricte monotonie sur l’intervalle$math_cd_content$,$math_cd_content$Une limite infinie$math_cd_content$,$math_cd_content$Une fonction constante$math_cd_content$),jsonb_build_array($math_cd_content$La stricte monotonie sur l’intervalle$math_cd_content$),$math_cd_content$Une fonction continue et strictement monotone ne peut pas prendre deux fois la même valeur.$math_cd_content$,30),(exercise_a_0,'single_choice',$math_cd_content$Pour prolonger une fonction par continuité en un point exclu, quelle valeur lui attribue-t-on ?$math_cd_content$,jsonb_build_array($math_cd_content$La limite au point$math_cd_content$,$math_cd_content$Toujours zéro$math_cd_content$,$math_cd_content$La dérivée au point$math_cd_content$),jsonb_build_array($math_cd_content$La limite au point$math_cd_content$),$math_cd_content$Le prolongement donne au point exclu la valeur vers laquelle l’expression tend.$math_cd_content$,40);
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order,is_test_data) values (target.subject_id,target.level_id,target.series_id,target_chapter_id,target_lesson_id,$math_cd_content$Exercice 2 — Méthodes et raisonnement : 1. Limites et continuité$math_cd_content$,$math_cd_content$Réinvestis les outils du cours et justifie ton choix à l’aide de la correction.$math_cd_content$,$math_cd_content$La correction relie chaque réponse à une démarche de résolution rigoureuse.$math_cd_content$,'single_choice','medium',$math_cd_content$## Consigne

Analyse la situation, repère la méthode pertinente puis choisis la réponse justifiée.$math_cd_content$,$math_cd_content$## Correction

Vérifie les hypothèses, le domaine et la conclusion géométrique ou algébrique.$math_cd_content$,false,false,20,20,false) returning id into exercise_b_0;
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values (exercise_b_0,'single_choice',$math_cd_content$Quelle expression faut-il étudier pour connaître la position d’une courbe par rapport à y=ax+b ?$math_cd_content$,jsonb_build_array($math_cd_content$f(x)-(ax+b)$math_cd_content$,$math_cd_content$f(x)+(ax+b)$math_cd_content$,$math_cd_content$f'(x)-(ax+b)$math_cd_content$),jsonb_build_array($math_cd_content$f(x)-(ax+b)$math_cd_content$),$math_cd_content$Le signe de cette différence indique si la courbe est au-dessus ou au-dessous de la droite.$math_cd_content$,10),(exercise_b_0,'single_choice',$math_cd_content$Dans une limite composée f(u(x)), quelle est la première étape utile ?$math_cd_content$,jsonb_build_array($math_cd_content$Calculer la limite de l’expression intérieure u(x)$math_cd_content$,$math_cd_content$Dériver f immédiatement$math_cd_content$,$math_cd_content$Remplacer toutes les variables par zéro$math_cd_content$),jsonb_build_array($math_cd_content$Calculer la limite de l’expression intérieure u(x)$math_cd_content$),$math_cd_content$On détermine d’abord vers quelle valeur tend l’argument de la fonction extérieure.$math_cd_content$,20),(exercise_b_0,'single_choice',$math_cd_content$Que garantit une fonction continue sur [a;b] lorsque f(a) et f(b) sont de signes contraires ?$math_cd_content$,jsonb_build_array($math_cd_content$Au moins une solution de f(x)=0 dans [a;b]$math_cd_content$,$math_cd_content$Deux solutions exactement$math_cd_content$,$math_cd_content$Aucune solution$math_cd_content$),jsonb_build_array($math_cd_content$Au moins une solution de f(x)=0 dans [a;b]$math_cd_content$),$math_cd_content$Le théorème des valeurs intermédiaires garantit l’existence, non le nombre exact sans hypothèse supplémentaire.$math_cd_content$,30),(exercise_b_0,'single_choice',$math_cd_content$Quel procédé réduit un intervalle de recherche en gardant un changement de signe ?$math_cd_content$,jsonb_build_array($math_cd_content$La dichotomie$math_cd_content$,$math_cd_content$La factorisation seule$math_cd_content$,$math_cd_content$La numération binaire$math_cd_content$),jsonb_build_array($math_cd_content$La dichotomie$math_cd_content$),$math_cd_content$La dichotomie conserve le sous-intervalle où les images restent de signes contraires.$math_cd_content$,40);
    insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active,is_test_data) values (target.subject_id,target.level_id,target.series_id,target.offering_id,target_chapter_id,target_lesson_id,$math_cd_content$Quiz A — Notions — 1. Limites et continuité$math_cd_content$,$math_cd_content$Vérifie les méthodes et notions essentielles de la leçon 1. Limites et continuité.$math_cd_content$,'medium',12,10,false,false,false) returning id into quiz_a_0; with inserted_questions as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values (quiz_a_0,$math_cd_content$Que faut-il comparer pour établir l’existence d’une limite en a ?$math_cd_content$,$math_cd_content$Une limite bilatérale existe lorsque les deux limites unilatérales existent et sont égales.$math_cd_content$,'single_choice',10,1,true),(quiz_a_0,$math_cd_content$Quelle droite est une asymptote verticale si la limite de f en a vaut +∞ ou -∞ ?$math_cd_content$,$math_cd_content$Une divergence au voisinage de l’abscisse a correspond à une asymptote verticale d’équation x=a.$math_cd_content$,'single_choice',20,1,true),(quiz_a_0,$math_cd_content$Quelle condition supplémentaire transforme l’existence d’une solution du TVI en unicité ?$math_cd_content$,$math_cd_content$Une fonction continue et strictement monotone ne peut pas prendre deux fois la même valeur.$math_cd_content$,'single_choice',30,1,true),(quiz_a_0,$math_cd_content$Pour prolonger une fonction par continuité en un point exclu, quelle valeur lui attribue-t-on ?$math_cd_content$,$math_cd_content$Le prolongement donne au point exclu la valeur vers laquelle l’expression tend.$math_cd_content$,'single_choice',40,1,true) returning id,display_order) insert into public.quiz_answers (question_id,answer,is_correct,display_order) select question_row.id,answer_row.answer,answer_row.is_correct,answer_row.display_order from inserted_questions question_row join (values (10,$math_cd_content$Les limites à gauche et à droite$math_cd_content$,true,10),(10,$math_cd_content$La dérivée et la primitive$math_cd_content$,false,20),(10,$math_cd_content$Le maximum et le minimum$math_cd_content$,false,30),(20,$math_cd_content$x = a$math_cd_content$,true,10),(20,$math_cd_content$y = a$math_cd_content$,false,20),(20,$math_cd_content$y = f(a)$math_cd_content$,false,30),(30,$math_cd_content$La stricte monotonie sur l’intervalle$math_cd_content$,true,10),(30,$math_cd_content$Une limite infinie$math_cd_content$,false,20),(30,$math_cd_content$Une fonction constante$math_cd_content$,false,30),(40,$math_cd_content$La limite au point$math_cd_content$,true,10),(40,$math_cd_content$Toujours zéro$math_cd_content$,false,20),(40,$math_cd_content$La dérivée au point$math_cd_content$,false,30)) as answer_row(question_order,answer,is_correct,display_order) on answer_row.question_order=question_row.display_order;
    insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active,is_test_data) values (target.subject_id,target.level_id,target.series_id,target.offering_id,target_chapter_id,target_lesson_id,$math_cd_content$Quiz B — Méthodes — 1. Limites et continuité$math_cd_content$,$math_cd_content$Vérifie les méthodes et notions essentielles de la leçon 1. Limites et continuité.$math_cd_content$,'medium',12,20,false,false,false) returning id into quiz_b_0; with inserted_questions as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values (quiz_b_0,$math_cd_content$Quelle expression faut-il étudier pour connaître la position d’une courbe par rapport à y=ax+b ?$math_cd_content$,$math_cd_content$Le signe de cette différence indique si la courbe est au-dessus ou au-dessous de la droite.$math_cd_content$,'single_choice',10,1,true),(quiz_b_0,$math_cd_content$Dans une limite composée f(u(x)), quelle est la première étape utile ?$math_cd_content$,$math_cd_content$On détermine d’abord vers quelle valeur tend l’argument de la fonction extérieure.$math_cd_content$,'single_choice',20,1,true),(quiz_b_0,$math_cd_content$Que garantit une fonction continue sur [a;b] lorsque f(a) et f(b) sont de signes contraires ?$math_cd_content$,$math_cd_content$Le théorème des valeurs intermédiaires garantit l’existence, non le nombre exact sans hypothèse supplémentaire.$math_cd_content$,'single_choice',30,1,true),(quiz_b_0,$math_cd_content$Quel procédé réduit un intervalle de recherche en gardant un changement de signe ?$math_cd_content$,$math_cd_content$La dichotomie conserve le sous-intervalle où les images restent de signes contraires.$math_cd_content$,'single_choice',40,1,true) returning id,display_order) insert into public.quiz_answers (question_id,answer,is_correct,display_order) select question_row.id,answer_row.answer,answer_row.is_correct,answer_row.display_order from inserted_questions question_row join (values (10,$math_cd_content$f(x)-(ax+b)$math_cd_content$,true,10),(10,$math_cd_content$f(x)+(ax+b)$math_cd_content$,false,20),(10,$math_cd_content$f'(x)-(ax+b)$math_cd_content$,false,30),(20,$math_cd_content$Calculer la limite de l’expression intérieure u(x)$math_cd_content$,true,10),(20,$math_cd_content$Dériver f immédiatement$math_cd_content$,false,20),(20,$math_cd_content$Remplacer toutes les variables par zéro$math_cd_content$,false,30),(30,$math_cd_content$Au moins une solution de f(x)=0 dans [a;b]$math_cd_content$,true,10),(30,$math_cd_content$Deux solutions exactement$math_cd_content$,false,20),(30,$math_cd_content$Aucune solution$math_cd_content$,false,30),(40,$math_cd_content$La dichotomie$math_cd_content$,true,10),(40,$math_cd_content$La factorisation seule$math_cd_content$,false,20),(40,$math_cd_content$La numération binaire$math_cd_content$,false,30)) as answer_row(question_order,answer,is_correct,display_order) on answer_row.question_order=question_row.display_order;
  

    target_chapter_id := null;
    target_lesson_id := null;
    select chapter.id into target_chapter_id from public.chapters chapter where chapter.subject_offering_id=target.offering_id and not chapter.is_test_data order by chapter.display_order limit 1;
    if target_chapter_id is null then raise exception 'Le chapitre Mathématiques Terminale % est introuvable.', target.series_name; end if;
    if not exists (select 1 from public.lessons lesson where lesson.chapter_id=target_chapter_id and lower(lesson.title)=lower($math_cd_content$Barycentre et lignes de niveau$math_cd_content$) and not lesson.is_test_data) then
      insert into public.lessons (chapter_id,title,description,content,display_order,is_active,is_test_data) values (target_chapter_id,$math_cd_content$Barycentre et lignes de niveau$math_cd_content$,$math_cd_content$Utiliser le barycentre de points pondérés et caractériser des lignes de niveau à partir de distances, rapports et angles.$math_cd_content$,'',coalesce((select max(existing_lesson.display_order)+10 from public.lessons existing_lesson where existing_lesson.chapter_id=target_chapter_id),10),false,false);
    end if;
    select lesson.id into target_lesson_id from public.lessons lesson where lesson.chapter_id=target_chapter_id and lower(lesson.title)=lower($math_cd_content$Barycentre et lignes de niveau$math_cd_content$) and not lesson.is_test_data limit 1;
    if target_lesson_id is null then raise exception 'La leçon % est introuvable après contrôle de structure.', $math_cd_content$Barycentre et lignes de niveau$math_cd_content$; end if;
    if exists (select 1 from public.lessons lesson where lesson.id=target_lesson_id and coalesce(btrim(lesson.content),'')<>'') then raise exception 'La leçon % de Terminale % contient déjà un cours : écrasement interdit.', $math_cd_content$Barycentre et lignes de niveau$math_cd_content$, target.series_name; end if;
    if exists (select 1 from public.exercises exercise where exercise.lesson_id=target_lesson_id and not exercise.is_test_data) or exists (select 1 from public.quizzes quiz where quiz.lesson_id=target_lesson_id and not quiz.is_test_data) then raise exception 'La leçon % de Terminale % possède déjà des évaluations : duplication interdite.', $math_cd_content$Barycentre et lignes de niveau$math_cd_content$, target.series_name; end if;
    update public.lessons set description=$math_cd_content$Utiliser le barycentre de points pondérés et caractériser des lignes de niveau à partir de distances, rapports et angles.$math_cd_content$,content=$math_cd_content$# Barycentre et lignes de niveau

## Objectif

Le barycentre donne un point de synthèse pour plusieurs points pondérés. Les lignes de niveau transforment ensuite une égalité de distances, de rapports ou d’angles en une figure géométrique précise.

## 1. Définir un barycentre

Soient les points pondérés \((A_i;\alpha_i)\). Si la somme des coefficients est non nulle, il existe un unique point \(G\) tel que :

$$
\sum_{i=1}^{n}\alpha_i\overrightarrow{GA_i}=\vec 0.
$$

Le point \(G\) est le **barycentre** des points pondérés. Si \(\sum\alpha_i=0\), ce barycentre n’existe pas dans ce cadre.

| Situation | Écriture ou conséquence |
|---|---|
| Deux points \((A;\alpha),(B;\beta)\) | \(\overrightarrow{AG}=\frac{\beta}{\alpha+\beta}\overrightarrow{AB}\), si \(\alpha+\beta\ne0\). |
| Coefficients tous égaux et non nuls | \(G\) est l’**isobarycentre**. |
| Deux points de même coefficient | Leur isobarycentre est le milieu. |
| Trois sommets non alignés de même coefficient | L’isobarycentre est le centre de gravité du triangle. |

> **Vigilance :** avant tout calcul, additionnez les coefficients. Cette vérification décide si le barycentre est défini.

## 2. Propriétés utiles

L’**homogénéité** signifie que multiplier tous les coefficients par un même réel non nul ne change pas le barycentre. Cette propriété permet de simplifier des poids proportionnels.

Pour tout point \(M\), lorsque \(G\) est le barycentre et \(S=\sum\alpha_i\ne0\), le support utilise la réduction :

$$
\sum_{i=1}^{n}\alpha_i\overrightarrow{MA_i}=S\overrightarrow{MG}.
$$

Si la somme des coefficients est nulle, la somme vectorielle obtenue est indépendante de \(M\). Cette distinction est centrale dans les exercices de réduction.

## 3. Coordonnées et barycentre partiel

Dans un repère de l’espace, si \(A_i(x_i;y_i;z_i)\), les coordonnées de \(G\) sont les moyennes pondérées :

$$
x_G=\frac{\sum\alpha_i x_i}{\sum\alpha_i},\qquad
y_G=\frac{\sum\alpha_i y_i}{\sum\alpha_i},\qquad
z_G=\frac{\sum\alpha_i z_i}{\sum\alpha_i}.
$$

Le **barycentre partiel** consiste à remplacer un groupe de points dont la somme des coefficients n’est pas nulle par son propre barycentre, affecté de la somme de ses coefficients. Il simplifie une construction sans changer le barycentre global.

> **Méthode :** calculez d’abord le barycentre partiel de deux ou trois points ; conservez la somme de leurs poids ; recommencez avec ce nouveau point et les points restants.

## 4. Qu’est-ce qu’une ligne de niveau ?

Pour une application \(f\) du plan vers \(\mathbb R\) et un réel \(k\), la ligne de niveau \(k\) est l’ensemble des points \(M\) vérifiant \(f(M)=k\). L’enjeu est de reconnaître la figure obtenue.

### Sommes pondérées de carrés de distances

Quand \(S=\sum\alpha_i\ne0\), la réduction du support s’écrit :

$$
\sum\alpha_i MA_i^2=S\,MG^2+\sum\alpha_i GA_i^2.
$$

Selon la valeur de \(k\), la ligne de niveau est vide, réduite à \(G\) ou est un cercle de centre \(G\). Quand \(S=0\), l’étude conduit, selon le vecteur constant obtenu, à l’ensemble vide, au plan ou à une droite.

### Rapport de distances et angle orienté

| Application | Cas remarquable | Figure obtenue |
|---|---|---|
| \(M\mapsto MA/MB\) | Rapport égal à 1 | Médiatrice de \([AB]\). |
| \(M\mapsto MA/MB\) | Rapport positif différent de 1 | Cercle déterminé par deux barycentres. |
| \(M\mapsto \text{Mes}(\overrightarrow{MA},\overrightarrow{MB})\) | Angle non nul et non plat | Arc de cercle passant par \(A\) et \(B\). |

> **Synthèse :** le barycentre transforme une somme pondérée en une expression centrée sur \(G\). Les lignes de niveau deviennent alors des figures que l’on peut décrire et construire : cercle, droite, médiatrice ou arc de cercle.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Leçon 2 : Barycentre – lignes de niveaux »**, Mathématiques, Terminale C, Côte d’Ivoire – École numérique. Intégré à Terminale C et D à la demande explicite de l’administrateur.$math_cd_content$,is_active=false,is_test_data=false where id=target_lesson_id and coalesce(btrim(content),'')='';
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order,is_test_data) values (target.subject_id,target.level_id,target.series_id,target_chapter_id,target_lesson_id,$math_cd_content$Exercice 1 — Repères fondamentaux : Barycentre et lignes de niveau$math_cd_content$,$math_cd_content$Réponds aux quatre questions en citant la définition, la propriété ou la méthode utilisée.$math_cd_content$,$math_cd_content$La correction explique la notion utile pour chaque réponse.$math_cd_content$,'single_choice','easy',$math_cd_content$## Consigne

Lis chaque proposition et choisis celle qui respecte la leçon.$math_cd_content$,$math_cd_content$## Correction

Appuie-toi sur les définitions et les encadrés de vigilance du cours.$math_cd_content$,false,false,18,10,false) returning id into exercise_a_1;
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values (exercise_a_1,'single_choice',$math_cd_content$Quelle condition assure l’existence du barycentre de points pondérés ?$math_cd_content$,jsonb_build_array($math_cd_content$La somme des coefficients est non nulle$math_cd_content$,$math_cd_content$Tous les coefficients sont positifs$math_cd_content$,$math_cd_content$Les points sont tous alignés$math_cd_content$),jsonb_build_array($math_cd_content$La somme des coefficients est non nulle$math_cd_content$),$math_cd_content$Le cours exige que la somme des coefficients ne soit pas nulle.$math_cd_content$,10),(exercise_a_1,'single_choice',$math_cd_content$Comment appelle-t-on le barycentre de points affectés d’un même coefficient non nul ?$math_cd_content$,jsonb_build_array($math_cd_content$L’isobarycentre$math_cd_content$,$math_cd_content$Le vecteur normal$math_cd_content$,$math_cd_content$La directrice$math_cd_content$),jsonb_build_array($math_cd_content$L’isobarycentre$math_cd_content$),$math_cd_content$L’isobarycentre correspond aux points ayant des coefficients égaux.$math_cd_content$,20),(exercise_a_1,'single_choice',$math_cd_content$Que permet le barycentre partiel ?$math_cd_content$,jsonb_build_array($math_cd_content$Remplacer un groupe de points par son barycentre sans changer le barycentre total$math_cd_content$,$math_cd_content$Supprimer les coefficients$math_cd_content$,$math_cd_content$Transformer tout cercle en droite$math_cd_content$),jsonb_build_array($math_cd_content$Remplacer un groupe de points par son barycentre sans changer le barycentre total$math_cd_content$),$math_cd_content$Le nouveau point porte la somme des coefficients du groupe remplacé.$math_cd_content$,30),(exercise_a_1,'single_choice',$math_cd_content$Quelle figure est la ligne de niveau MA/MB=1 ?$math_cd_content$,jsonb_build_array($math_cd_content$La médiatrice de [AB]$math_cd_content$,$math_cd_content$Un cercle de centre A$math_cd_content$,$math_cd_content$La droite (AB)$math_cd_content$),jsonb_build_array($math_cd_content$La médiatrice de [AB]$math_cd_content$),$math_cd_content$Les points équidistants de A et B forment la médiatrice du segment.$math_cd_content$,40);
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order,is_test_data) values (target.subject_id,target.level_id,target.series_id,target_chapter_id,target_lesson_id,$math_cd_content$Exercice 2 — Méthodes et raisonnement : Barycentre et lignes de niveau$math_cd_content$,$math_cd_content$Réinvestis les outils du cours et justifie ton choix à l’aide de la correction.$math_cd_content$,$math_cd_content$La correction relie chaque réponse à une démarche de résolution rigoureuse.$math_cd_content$,'single_choice','medium',$math_cd_content$## Consigne

Analyse la situation, repère la méthode pertinente puis choisis la réponse justifiée.$math_cd_content$,$math_cd_content$## Correction

Vérifie les hypothèses, le domaine et la conclusion géométrique ou algébrique.$math_cd_content$,false,false,20,20,false) returning id into exercise_b_1;
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values (exercise_b_1,'single_choice',$math_cd_content$Que devient une somme vectorielle pondérée lorsque la somme des coefficients est non nulle ?$math_cd_content$,jsonb_build_array($math_cd_content$Un multiple de MG$math_cd_content$,$math_cd_content$Toujours le vecteur nul$math_cd_content$,$math_cd_content$Un produit scalaire$math_cd_content$),jsonb_build_array($math_cd_content$Un multiple de MG$math_cd_content$),$math_cd_content$La réduction donne ΣαᵢMAᵢ=(Σαᵢ)MG.$math_cd_content$,10),(exercise_b_1,'single_choice',$math_cd_content$Quelle information faut-il vérifier avant les coordonnées d’un barycentre ?$math_cd_content$,jsonb_build_array($math_cd_content$Que la somme des coefficients n’est pas nulle$math_cd_content$,$math_cd_content$Que toutes les abscisses sont positives$math_cd_content$,$math_cd_content$Que le repère est orthonormé$math_cd_content$),jsonb_build_array($math_cd_content$Que la somme des coefficients n’est pas nulle$math_cd_content$),$math_cd_content$Les formules de moyenne pondérée divisent par cette somme.$math_cd_content$,20),(exercise_b_1,'single_choice',$math_cd_content$Lorsque la somme des coefficients est non nulle, une ligne de niveau fondée sur une somme de carrés peut être un…$math_cd_content$,jsonb_build_array($math_cd_content$Cercle de centre G$math_cd_content$,$math_cd_content$Triangle obligatoire$math_cd_content$,$math_cd_content$Segment toujours$math_cd_content$),jsonb_build_array($math_cd_content$Cercle de centre G$math_cd_content$),$math_cd_content$Après réduction, l’égalité se ramène à une valeur de MG².$math_cd_content$,30),(exercise_b_1,'single_choice',$math_cd_content$Quelle figure peut être liée à un angle orienté constant entre MA et MB ?$math_cd_content$,jsonb_build_array($math_cd_content$Un arc de cercle$math_cd_content$,$math_cd_content$Une parabole nécessairement$math_cd_content$,$math_cd_content$Un plan entier toujours$math_cd_content$),jsonb_build_array($math_cd_content$Un arc de cercle$math_cd_content$),$math_cd_content$Le support caractérise un arc de cercle d’extrémités A et B pour l’angle approprié.$math_cd_content$,40);
    insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active,is_test_data) values (target.subject_id,target.level_id,target.series_id,target.offering_id,target_chapter_id,target_lesson_id,$math_cd_content$Quiz A — Notions — Barycentre et lignes de niveau$math_cd_content$,$math_cd_content$Vérifie les méthodes et notions essentielles de la leçon Barycentre et lignes de niveau.$math_cd_content$,'medium',12,10,false,false,false) returning id into quiz_a_1; with inserted_questions as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values (quiz_a_1,$math_cd_content$Quelle condition assure l’existence du barycentre de points pondérés ?$math_cd_content$,$math_cd_content$Le cours exige que la somme des coefficients ne soit pas nulle.$math_cd_content$,'single_choice',10,1,true),(quiz_a_1,$math_cd_content$Comment appelle-t-on le barycentre de points affectés d’un même coefficient non nul ?$math_cd_content$,$math_cd_content$L’isobarycentre correspond aux points ayant des coefficients égaux.$math_cd_content$,'single_choice',20,1,true),(quiz_a_1,$math_cd_content$Que permet le barycentre partiel ?$math_cd_content$,$math_cd_content$Le nouveau point porte la somme des coefficients du groupe remplacé.$math_cd_content$,'single_choice',30,1,true),(quiz_a_1,$math_cd_content$Quelle figure est la ligne de niveau MA/MB=1 ?$math_cd_content$,$math_cd_content$Les points équidistants de A et B forment la médiatrice du segment.$math_cd_content$,'single_choice',40,1,true) returning id,display_order) insert into public.quiz_answers (question_id,answer,is_correct,display_order) select question_row.id,answer_row.answer,answer_row.is_correct,answer_row.display_order from inserted_questions question_row join (values (10,$math_cd_content$La somme des coefficients est non nulle$math_cd_content$,true,10),(10,$math_cd_content$Tous les coefficients sont positifs$math_cd_content$,false,20),(10,$math_cd_content$Les points sont tous alignés$math_cd_content$,false,30),(20,$math_cd_content$L’isobarycentre$math_cd_content$,true,10),(20,$math_cd_content$Le vecteur normal$math_cd_content$,false,20),(20,$math_cd_content$La directrice$math_cd_content$,false,30),(30,$math_cd_content$Remplacer un groupe de points par son barycentre sans changer le barycentre total$math_cd_content$,true,10),(30,$math_cd_content$Supprimer les coefficients$math_cd_content$,false,20),(30,$math_cd_content$Transformer tout cercle en droite$math_cd_content$,false,30),(40,$math_cd_content$La médiatrice de [AB]$math_cd_content$,true,10),(40,$math_cd_content$Un cercle de centre A$math_cd_content$,false,20),(40,$math_cd_content$La droite (AB)$math_cd_content$,false,30)) as answer_row(question_order,answer,is_correct,display_order) on answer_row.question_order=question_row.display_order;
    insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active,is_test_data) values (target.subject_id,target.level_id,target.series_id,target.offering_id,target_chapter_id,target_lesson_id,$math_cd_content$Quiz B — Méthodes — Barycentre et lignes de niveau$math_cd_content$,$math_cd_content$Vérifie les méthodes et notions essentielles de la leçon Barycentre et lignes de niveau.$math_cd_content$,'medium',12,20,false,false,false) returning id into quiz_b_1; with inserted_questions as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values (quiz_b_1,$math_cd_content$Que devient une somme vectorielle pondérée lorsque la somme des coefficients est non nulle ?$math_cd_content$,$math_cd_content$La réduction donne ΣαᵢMAᵢ=(Σαᵢ)MG.$math_cd_content$,'single_choice',10,1,true),(quiz_b_1,$math_cd_content$Quelle information faut-il vérifier avant les coordonnées d’un barycentre ?$math_cd_content$,$math_cd_content$Les formules de moyenne pondérée divisent par cette somme.$math_cd_content$,'single_choice',20,1,true),(quiz_b_1,$math_cd_content$Lorsque la somme des coefficients est non nulle, une ligne de niveau fondée sur une somme de carrés peut être un…$math_cd_content$,$math_cd_content$Après réduction, l’égalité se ramène à une valeur de MG².$math_cd_content$,'single_choice',30,1,true),(quiz_b_1,$math_cd_content$Quelle figure peut être liée à un angle orienté constant entre MA et MB ?$math_cd_content$,$math_cd_content$Le support caractérise un arc de cercle d’extrémités A et B pour l’angle approprié.$math_cd_content$,'single_choice',40,1,true) returning id,display_order) insert into public.quiz_answers (question_id,answer,is_correct,display_order) select question_row.id,answer_row.answer,answer_row.is_correct,answer_row.display_order from inserted_questions question_row join (values (10,$math_cd_content$Un multiple de MG$math_cd_content$,true,10),(10,$math_cd_content$Toujours le vecteur nul$math_cd_content$,false,20),(10,$math_cd_content$Un produit scalaire$math_cd_content$,false,30),(20,$math_cd_content$Que la somme des coefficients n’est pas nulle$math_cd_content$,true,10),(20,$math_cd_content$Que toutes les abscisses sont positives$math_cd_content$,false,20),(20,$math_cd_content$Que le repère est orthonormé$math_cd_content$,false,30),(30,$math_cd_content$Cercle de centre G$math_cd_content$,true,10),(30,$math_cd_content$Triangle obligatoire$math_cd_content$,false,20),(30,$math_cd_content$Segment toujours$math_cd_content$,false,30),(40,$math_cd_content$Un arc de cercle$math_cd_content$,true,10),(40,$math_cd_content$Une parabole nécessairement$math_cd_content$,false,20),(40,$math_cd_content$Un plan entier toujours$math_cd_content$,false,30)) as answer_row(question_order,answer,is_correct,display_order) on answer_row.question_order=question_row.display_order;
  

    target_chapter_id := null;
    target_lesson_id := null;
    select chapter.id into target_chapter_id from public.chapters chapter where chapter.subject_offering_id=target.offering_id and not chapter.is_test_data order by chapter.display_order limit 1;
    if target_chapter_id is null then raise exception 'Le chapitre Mathématiques Terminale % est introuvable.', target.series_name; end if;
    if not exists (select 1 from public.lessons lesson where lesson.chapter_id=target_chapter_id and lower(lesson.title)=lower($math_cd_content$Divisibilité dans ℤ$math_cd_content$) and not lesson.is_test_data) then
      insert into public.lessons (chapter_id,title,description,content,display_order,is_active,is_test_data) values (target_chapter_id,$math_cd_content$Divisibilité dans ℤ$math_cd_content$,$math_cd_content$Raisonner avec la divisibilité, la division euclidienne, les congruences, la numération et les nombres premiers.$math_cd_content$,'',coalesce((select max(existing_lesson.display_order)+10 from public.lessons existing_lesson where existing_lesson.chapter_id=target_chapter_id),10),false,false);
    end if;
    select lesson.id into target_lesson_id from public.lessons lesson where lesson.chapter_id=target_chapter_id and lower(lesson.title)=lower($math_cd_content$Divisibilité dans ℤ$math_cd_content$) and not lesson.is_test_data limit 1;
    if target_lesson_id is null then raise exception 'La leçon % est introuvable après contrôle de structure.', $math_cd_content$Divisibilité dans ℤ$math_cd_content$; end if;
    if exists (select 1 from public.lessons lesson where lesson.id=target_lesson_id and coalesce(btrim(lesson.content),'')<>'') then raise exception 'La leçon % de Terminale % contient déjà un cours : écrasement interdit.', $math_cd_content$Divisibilité dans ℤ$math_cd_content$, target.series_name; end if;
    if exists (select 1 from public.exercises exercise where exercise.lesson_id=target_lesson_id and not exercise.is_test_data) or exists (select 1 from public.quizzes quiz where quiz.lesson_id=target_lesson_id and not quiz.is_test_data) then raise exception 'La leçon % de Terminale % possède déjà des évaluations : duplication interdite.', $math_cd_content$Divisibilité dans ℤ$math_cd_content$, target.series_name; end if;
    update public.lessons set description=$math_cd_content$Raisonner avec la divisibilité, la division euclidienne, les congruences, la numération et les nombres premiers.$math_cd_content$,content=$math_cd_content$# Divisibilité dans ℤ

## Objectif

L’arithmétique relie plusieurs outils : la divisibilité explique les multiples, la division euclidienne produit un reste et les congruences permettent de raisonner directement sur ces restes.

## 1. Diviseurs et multiples

Soient \(a\) et \(b\) deux entiers relatifs avec \(b\ne0\). Dire que \(b\) divise \(a\), noté \(b\mid a\), signifie qu’il existe un entier \(k\) tel que \(a=kb\). Ainsi, \(a\) est un multiple de \(b\).

| Propriété | Sens dans un raisonnement |
|---|---|
| \(a\mid a\) | Tout entier non nul se divise lui-même. |
| \(a\mid b\) et \(b\mid c\Rightarrow a\mid c\) | La divisibilité est transitive. |
| \(a\mid b\) et \(a\mid c\Rightarrow a\mid(pb+qc)\) | Un diviseur commun divise toute combinaison linéaire. |

> **Vigilance :** \(0\) est multiple de tout entier non nul, mais \(0\) ne divise aucun entier. La condition sur le diviseur n’est donc jamais décorative.

## 2. Division euclidienne dans ℤ

Pour tout \(a\in\mathbb Z\) et tout \(b\in\mathbb Z\setminus\{0\}\), il existe un unique couple \((q;r)\) tel que :

$$
a=bq+r\qquad\text{avec}\qquad 0\le r<|b|.
$$

\(q\) est le quotient et \(r\) le reste. Même si le dividende ou le diviseur est négatif, le reste reste positif ou nul. Si \(r=0\), alors \(b\mid a\).

> **Méthode :** après avoir proposé une écriture \(a=bq+r\), vérifiez toujours deux choses : l’égalité est correcte et \(0\le r<|b|\). Une égalité numérique seule ne suffit pas.

## 3. Congruence modulo n

Pour \(n\) entier naturel non nul, \(a\) est congru à \(b\) modulo \(n\) lorsque \(n\mid(a-b)\). On écrit :

$$
a\equiv b\pmod n.
$$

Deux entiers congrus modulo \(n\) ont le même reste dans la division par \(n\). Les congruences peuvent être additionnées, multipliées et élevées à une puissance : elles simplifient les calculs de restes.

| Action | Si \(a\equiv b\pmod n\) et \(c\equiv d\pmod n\) |
|---|---|
| Addition | \(a+c\equiv b+d\pmod n\) |
| Produit | \(ac\equiv bd\pmod n\) |
| Puissance naturelle | \(a^k\equiv b^k\pmod n\) |

## 4. Numération et critères

Dans une base \(b\ge2\), tout entier naturel non nul possède une écriture unique :

$$
x=\sum_{k=0}^{n}a_kb^k,\qquad 0\le a_k<b.
$$

Le support présente les bases binaire, décimale et hexadécimale. Les critères de divisibilité se déduisent des congruences des puissances de 10.

| Diviseur | Critère rappelé par le support |
|---|---|
| 2 | Le chiffre des unités est pair. |
| 3 ou 9 | La somme des chiffres est divisible par 3 ou 9. |
| 5 | Le chiffre des unités est 0 ou 5. |
| 10 | Le chiffre des unités est 0. |
| 11 | La différence alternée des sommes de chiffres est divisible par 11. |

## 5. Nombres premiers et décomposition

Un entier naturel \(p\) est premier lorsqu’il possède exactement deux diviseurs positifs : 1 et \(p\). Les nombres 0 et 1 ne sont pas premiers ; 2 est le seul nombre premier pair. Tout entier supérieur à 1 admet une décomposition unique en produit de facteurs premiers.

Si \(n=p_1^{\alpha_1}\cdots p_k^{\alpha_k}\), le nombre de ses diviseurs positifs est :

$$
(\alpha_1+1)(\alpha_2+1)\cdots(\alpha_k+1).
$$

> **Méthode :** pour prouver qu’un nombre est premier, il suffit de tester les nombres premiers inférieurs ou égaux à sa racine carrée. Pour compter des diviseurs, commencez par la décomposition en facteurs premiers.

## 6. Résoudre une question de reste

1. Traduire la question avec une division euclidienne ou une congruence.  
2. Réduire chaque nombre modulo le diviseur choisi.  
3. Effectuer les calculs dans le petit ensemble des restes.  
4. Ramener le résultat à un reste compris entre 0 et \(n-1\).  
5. Rédiger la conclusion avec le symbole de divisibilité ou de congruence adapté.

> **Synthèse :** une congruence n’est pas une égalité ordinaire : elle conserve l’information sur le reste. Elle devient particulièrement efficace pour les puissances, les critères de divisibilité et les problèmes de numération.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Leçon 3 : Divisibilité dans ℤ »**, Mathématiques, Terminale C, Côte d’Ivoire – École numérique. Intégré à Terminale C et D à la demande explicite de l’administrateur.$math_cd_content$,is_active=false,is_test_data=false where id=target_lesson_id and coalesce(btrim(content),'')='';
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order,is_test_data) values (target.subject_id,target.level_id,target.series_id,target_chapter_id,target_lesson_id,$math_cd_content$Exercice 1 — Repères fondamentaux : Divisibilité dans ℤ$math_cd_content$,$math_cd_content$Réponds aux quatre questions en citant la définition, la propriété ou la méthode utilisée.$math_cd_content$,$math_cd_content$La correction explique la notion utile pour chaque réponse.$math_cd_content$,'single_choice','easy',$math_cd_content$## Consigne

Lis chaque proposition et choisis celle qui respecte la leçon.$math_cd_content$,$math_cd_content$## Correction

Appuie-toi sur les définitions et les encadrés de vigilance du cours.$math_cd_content$,false,false,18,10,false) returning id into exercise_a_2;
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values (exercise_a_2,'single_choice',$math_cd_content$Que signifie b|a avec b différent de zéro ?$math_cd_content$,jsonb_build_array($math_cd_content$Il existe un entier k tel que a=kb$math_cd_content$,$math_cd_content$a est toujours premier$math_cd_content$,$math_cd_content$b est le reste de a$math_cd_content$),jsonb_build_array($math_cd_content$Il existe un entier k tel que a=kb$math_cd_content$),$math_cd_content$C’est la définition de la divisibilité.$math_cd_content$,10),(exercise_a_2,'single_choice',$math_cd_content$Quelle condition doit satisfaire le reste r de la division de a par b dans ℤ ?$math_cd_content$,jsonb_build_array($math_cd_content$0≤r<|b|$math_cd_content$,$math_cd_content$r peut être négatif sans condition$math_cd_content$,$math_cd_content$r=|b| obligatoirement$math_cd_content$),jsonb_build_array($math_cd_content$0≤r<|b|$math_cd_content$),$math_cd_content$La division euclidienne dans les entiers conserve un reste positif ou nul, strictement inférieur à |b|.$math_cd_content$,20),(exercise_a_2,'single_choice',$math_cd_content$Que signifie a≡b [n] ?$math_cd_content$,jsonb_build_array($math_cd_content$n divise a-b$math_cd_content$,$math_cd_content$a=b dans tous les cas$math_cd_content$,$math_cd_content$n divise a+b seulement$math_cd_content$),jsonb_build_array($math_cd_content$n divise a-b$math_cd_content$),$math_cd_content$Deux entiers congrus ont une différence multiple de n.$math_cd_content$,30),(exercise_a_2,'single_choice',$math_cd_content$Quel nombre n’est pas premier ?$math_cd_content$,jsonb_build_array($math_cd_content$1$math_cd_content$,$math_cd_content$2$math_cd_content$,$math_cd_content$7$math_cd_content$),jsonb_build_array($math_cd_content$1$math_cd_content$),$math_cd_content$Le nombre 1 n’a qu’un seul diviseur positif ; il n’est donc pas premier.$math_cd_content$,40);
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order,is_test_data) values (target.subject_id,target.level_id,target.series_id,target_chapter_id,target_lesson_id,$math_cd_content$Exercice 2 — Méthodes et raisonnement : Divisibilité dans ℤ$math_cd_content$,$math_cd_content$Réinvestis les outils du cours et justifie ton choix à l’aide de la correction.$math_cd_content$,$math_cd_content$La correction relie chaque réponse à une démarche de résolution rigoureuse.$math_cd_content$,'single_choice','medium',$math_cd_content$## Consigne

Analyse la situation, repère la méthode pertinente puis choisis la réponse justifiée.$math_cd_content$,$math_cd_content$## Correction

Vérifie les hypothèses, le domaine et la conclusion géométrique ou algébrique.$math_cd_content$,false,false,20,20,false) returning id into exercise_b_2;
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values (exercise_b_2,'single_choice',$math_cd_content$Quel outil permet de simplifier le calcul d’un grand reste de puissance ?$math_cd_content$,jsonb_build_array($math_cd_content$Les congruences modulo n$math_cd_content$,$math_cd_content$Les coordonnées barycentriques$math_cd_content$,$math_cd_content$La dérivation$math_cd_content$),jsonb_build_array($math_cd_content$Les congruences modulo n$math_cd_content$),$math_cd_content$On remplace un nombre par un reste congru plus simple avant de calculer une puissance.$math_cd_content$,10),(exercise_b_2,'single_choice',$math_cd_content$Quel critère teste la divisibilité par 9 ?$math_cd_content$,jsonb_build_array($math_cd_content$La somme des chiffres est divisible par 9$math_cd_content$,$math_cd_content$Les deux derniers chiffres sont multiples de 9$math_cd_content$,$math_cd_content$Le chiffre des unités est 9$math_cd_content$),jsonb_build_array($math_cd_content$La somme des chiffres est divisible par 9$math_cd_content$),$math_cd_content$Le support dérive ce critère de 10ᵏ≡1 modulo 9.$math_cd_content$,20),(exercise_b_2,'single_choice',$math_cd_content$Dans quelle base les seuls chiffres sont-ils 0 et 1 ?$math_cd_content$,jsonb_build_array($math_cd_content$La base 2$math_cd_content$,$math_cd_content$La base 10$math_cd_content$,$math_cd_content$La base 16$math_cd_content$),jsonb_build_array($math_cd_content$La base 2$math_cd_content$),$math_cd_content$La numération binaire utilise les chiffres 0 et 1.$math_cd_content$,30),(exercise_b_2,'single_choice',$math_cd_content$Si n=2²×3×7, combien n possède-t-il de diviseurs positifs ?$math_cd_content$,jsonb_build_array($math_cd_content$12$math_cd_content$,$math_cd_content$6$math_cd_content$,$math_cd_content$42$math_cd_content$),jsonb_build_array($math_cd_content$12$math_cd_content$),$math_cd_content$Le nombre de diviseurs vaut (2+1)(1+1)(1+1)=12.$math_cd_content$,40);
    insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active,is_test_data) values (target.subject_id,target.level_id,target.series_id,target.offering_id,target_chapter_id,target_lesson_id,$math_cd_content$Quiz A — Notions — Divisibilité dans ℤ$math_cd_content$,$math_cd_content$Vérifie les méthodes et notions essentielles de la leçon Divisibilité dans ℤ.$math_cd_content$,'medium',12,10,false,false,false) returning id into quiz_a_2; with inserted_questions as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values (quiz_a_2,$math_cd_content$Que signifie b|a avec b différent de zéro ?$math_cd_content$,$math_cd_content$C’est la définition de la divisibilité.$math_cd_content$,'single_choice',10,1,true),(quiz_a_2,$math_cd_content$Quelle condition doit satisfaire le reste r de la division de a par b dans ℤ ?$math_cd_content$,$math_cd_content$La division euclidienne dans les entiers conserve un reste positif ou nul, strictement inférieur à |b|.$math_cd_content$,'single_choice',20,1,true),(quiz_a_2,$math_cd_content$Que signifie a≡b [n] ?$math_cd_content$,$math_cd_content$Deux entiers congrus ont une différence multiple de n.$math_cd_content$,'single_choice',30,1,true),(quiz_a_2,$math_cd_content$Quel nombre n’est pas premier ?$math_cd_content$,$math_cd_content$Le nombre 1 n’a qu’un seul diviseur positif ; il n’est donc pas premier.$math_cd_content$,'single_choice',40,1,true) returning id,display_order) insert into public.quiz_answers (question_id,answer,is_correct,display_order) select question_row.id,answer_row.answer,answer_row.is_correct,answer_row.display_order from inserted_questions question_row join (values (10,$math_cd_content$Il existe un entier k tel que a=kb$math_cd_content$,true,10),(10,$math_cd_content$a est toujours premier$math_cd_content$,false,20),(10,$math_cd_content$b est le reste de a$math_cd_content$,false,30),(20,$math_cd_content$0≤r<|b|$math_cd_content$,true,10),(20,$math_cd_content$r peut être négatif sans condition$math_cd_content$,false,20),(20,$math_cd_content$r=|b| obligatoirement$math_cd_content$,false,30),(30,$math_cd_content$n divise a-b$math_cd_content$,true,10),(30,$math_cd_content$a=b dans tous les cas$math_cd_content$,false,20),(30,$math_cd_content$n divise a+b seulement$math_cd_content$,false,30),(40,$math_cd_content$1$math_cd_content$,true,10),(40,$math_cd_content$2$math_cd_content$,false,20),(40,$math_cd_content$7$math_cd_content$,false,30)) as answer_row(question_order,answer,is_correct,display_order) on answer_row.question_order=question_row.display_order;
    insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active,is_test_data) values (target.subject_id,target.level_id,target.series_id,target.offering_id,target_chapter_id,target_lesson_id,$math_cd_content$Quiz B — Méthodes — Divisibilité dans ℤ$math_cd_content$,$math_cd_content$Vérifie les méthodes et notions essentielles de la leçon Divisibilité dans ℤ.$math_cd_content$,'medium',12,20,false,false,false) returning id into quiz_b_2; with inserted_questions as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values (quiz_b_2,$math_cd_content$Quel outil permet de simplifier le calcul d’un grand reste de puissance ?$math_cd_content$,$math_cd_content$On remplace un nombre par un reste congru plus simple avant de calculer une puissance.$math_cd_content$,'single_choice',10,1,true),(quiz_b_2,$math_cd_content$Quel critère teste la divisibilité par 9 ?$math_cd_content$,$math_cd_content$Le support dérive ce critère de 10ᵏ≡1 modulo 9.$math_cd_content$,'single_choice',20,1,true),(quiz_b_2,$math_cd_content$Dans quelle base les seuls chiffres sont-ils 0 et 1 ?$math_cd_content$,$math_cd_content$La numération binaire utilise les chiffres 0 et 1.$math_cd_content$,'single_choice',30,1,true),(quiz_b_2,$math_cd_content$Si n=2²×3×7, combien n possède-t-il de diviseurs positifs ?$math_cd_content$,$math_cd_content$Le nombre de diviseurs vaut (2+1)(1+1)(1+1)=12.$math_cd_content$,'single_choice',40,1,true) returning id,display_order) insert into public.quiz_answers (question_id,answer,is_correct,display_order) select question_row.id,answer_row.answer,answer_row.is_correct,answer_row.display_order from inserted_questions question_row join (values (10,$math_cd_content$Les congruences modulo n$math_cd_content$,true,10),(10,$math_cd_content$Les coordonnées barycentriques$math_cd_content$,false,20),(10,$math_cd_content$La dérivation$math_cd_content$,false,30),(20,$math_cd_content$La somme des chiffres est divisible par 9$math_cd_content$,true,10),(20,$math_cd_content$Les deux derniers chiffres sont multiples de 9$math_cd_content$,false,20),(20,$math_cd_content$Le chiffre des unités est 9$math_cd_content$,false,30),(30,$math_cd_content$La base 2$math_cd_content$,true,10),(30,$math_cd_content$La base 10$math_cd_content$,false,20),(30,$math_cd_content$La base 16$math_cd_content$,false,30),(40,$math_cd_content$12$math_cd_content$,true,10),(40,$math_cd_content$6$math_cd_content$,false,20),(40,$math_cd_content$42$math_cd_content$,false,30)) as answer_row(question_order,answer,is_correct,display_order) on answer_row.question_order=question_row.display_order;
  

    target_chapter_id := null;
    target_lesson_id := null;
    select chapter.id into target_chapter_id from public.chapters chapter where chapter.subject_offering_id=target.offering_id and not chapter.is_test_data order by chapter.display_order limit 1;
    if target_chapter_id is null then raise exception 'Le chapitre Mathématiques Terminale % est introuvable.', target.series_name; end if;
    if not exists (select 1 from public.lessons lesson where lesson.chapter_id=target_chapter_id and lower(lesson.title)=lower($math_cd_content$Géométrie analytique de l’espace$math_cd_content$) and not lesson.is_test_data) then
      insert into public.lessons (chapter_id,title,description,content,display_order,is_active,is_test_data) values (target_chapter_id,$math_cd_content$Géométrie analytique de l’espace$math_cd_content$,$math_cd_content$Déterminer des plans et droites de l’espace, leurs équations, distances et positions relatives dans un repère orthonormé.$math_cd_content$,'',coalesce((select max(existing_lesson.display_order)+10 from public.lessons existing_lesson where existing_lesson.chapter_id=target_chapter_id),10),false,false);
    end if;
    select lesson.id into target_lesson_id from public.lessons lesson where lesson.chapter_id=target_chapter_id and lower(lesson.title)=lower($math_cd_content$Géométrie analytique de l’espace$math_cd_content$) and not lesson.is_test_data limit 1;
    if target_lesson_id is null then raise exception 'La leçon % est introuvable après contrôle de structure.', $math_cd_content$Géométrie analytique de l’espace$math_cd_content$; end if;
    if exists (select 1 from public.lessons lesson where lesson.id=target_lesson_id and coalesce(btrim(lesson.content),'')<>'') then raise exception 'La leçon % de Terminale % contient déjà un cours : écrasement interdit.', $math_cd_content$Géométrie analytique de l’espace$math_cd_content$, target.series_name; end if;
    if exists (select 1 from public.exercises exercise where exercise.lesson_id=target_lesson_id and not exercise.is_test_data) or exists (select 1 from public.quizzes quiz where quiz.lesson_id=target_lesson_id and not quiz.is_test_data) then raise exception 'La leçon % de Terminale % possède déjà des évaluations : duplication interdite.', $math_cd_content$Géométrie analytique de l’espace$math_cd_content$, target.series_name; end if;
    update public.lessons set description=$math_cd_content$Déterminer des plans et droites de l’espace, leurs équations, distances et positions relatives dans un repère orthonormé.$math_cd_content$,content=$math_cd_content$# Géométrie analytique de l’espace

## Objectif

La géométrie analytique traduit les objets de l’espace en vecteurs, équations et systèmes. Une réponse rigoureuse doit toujours relier le calcul à la figure : **normal**, **direction**, **appartenance**, **intersection** ou **orthogonalité**.

## 1. Vecteur normal et plan

Un vecteur non nul \(\vec n\) est **normal** à un plan \((P)\) lorsqu’il est orthogonal à deux vecteurs directeurs non colinéaires de ce plan. Un point \(A\) et un vecteur normal non nul déterminent un unique plan.

Si \(A\in(P)\), alors :

$$
M\in(P)\Longleftrightarrow \overrightarrow{AM}\cdot\vec n=0.
$$

Deux plans de vecteurs normaux \(\vec n\) et \(\vec n'\) sont parallèles lorsque ces vecteurs sont colinéaires ; ils sont perpendiculaires lorsque leurs vecteurs normaux sont orthogonaux.

## 2. Équation cartésienne d’un plan

Dans un repère orthonormé, un plan de vecteur normal \((a;b;c)\) admet une équation :

$$
ax+by+cz+d=0,\qquad (a;b;c)\ne(0;0;0).
$$

Pour déterminer \(d\), on remplace \(x,y,z\) par les coordonnées d’un point connu du plan. Multiplier toute l’équation par un réel non nul donne la même géométrie.

> **Méthode : équation d’un plan**  
> 1. Déterminer un vecteur normal.  
> 2. Écrire \(ax+by+cz+d=0\).  
> 3. Utiliser un point du plan pour trouver \(d\).  
> 4. Vérifier l’égalité avec un autre point lorsque cela est possible.

## 3. Distance d’un point à un plan

Pour \(A(x_0;y_0;z_0)\) et le plan \(ax+by+cz+d=0\), le support donne :

$$
d(A;(P))=\frac{|ax_0+by_0+cz_0+d|}{\sqrt{a^2+b^2+c^2}}.
$$

La valeur absolue est indispensable : une distance est positive ou nulle. Le dénominateur correspond à la norme du vecteur normal.

## 4. Représentation paramétrique d’une droite

Une droite passant par \(A(x_0;y_0;z_0)\) et de vecteur directeur \((a;b;c)\) possède une représentation paramétrique :

$$
\begin{cases}
x=x_0+ta\\
y=y_0+tb\\
z=z_0+tc
\end{cases}
\quad\text{avec }t\in\mathbb R.
$$

Une même droite a plusieurs représentations possibles, car on peut choisir un autre point de la droite ou un vecteur directeur colinéaire.

## 5. Positions relatives

| Objets | Test principal | Conclusion possible |
|---|---|---|
| Deux droites | Colinéarité des vecteurs directeurs | Parallèles ; sinon sécantes ou non coplanaires. |
| Droite et plan | Produit scalaire direction–normale | Nul : parallèle ou incluse ; non nul : sécante. |
| Deux plans | Colinéarité des vecteurs normaux | Parallèles ou confondus ; sinon sécants. |

Une droite et un plan sont orthogonaux lorsque le vecteur directeur de la droite est colinéaire à un vecteur normal du plan. Deux droites non parallèles ne sont pas automatiquement sécantes dans l’espace : il faut résoudre le système ou étudier la coplanarité.

## 6. Trouver une intersection

Pour vérifier qu’une droite coupe un plan, on remplace les coordonnées paramétriques de la droite dans l’équation du plan. Une valeur de paramètre donne alors le point d’intersection. Pour deux plans, on résout simultanément leurs équations ; une variable libre peut fournir une représentation paramétrique de la droite d’intersection.

> **Vigilance :** ne concluez jamais « sécantes » uniquement parce que deux vecteurs directeurs ne sont pas colinéaires. Dans l’espace, des droites peuvent être non coplanaires.

> **Synthèse :** le vecteur normal organise l’étude des plans ; le vecteur directeur organise celle des droites. L’équation, le produit scalaire et la résolution d’un système transforment les relations géométriques en arguments vérifiables.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Leçon 5 : Géométrie analytique de l’espace »**, Mathématiques, Terminale C, Côte d’Ivoire – École numérique. Intégré à Terminale C et D à la demande explicite de l’administrateur.$math_cd_content$,is_active=false,is_test_data=false where id=target_lesson_id and coalesce(btrim(content),'')='';
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order,is_test_data) values (target.subject_id,target.level_id,target.series_id,target_chapter_id,target_lesson_id,$math_cd_content$Exercice 1 — Repères fondamentaux : Géométrie analytique de l’espace$math_cd_content$,$math_cd_content$Réponds aux quatre questions en citant la définition, la propriété ou la méthode utilisée.$math_cd_content$,$math_cd_content$La correction explique la notion utile pour chaque réponse.$math_cd_content$,'single_choice','easy',$math_cd_content$## Consigne

Lis chaque proposition et choisis celle qui respecte la leçon.$math_cd_content$,$math_cd_content$## Correction

Appuie-toi sur les définitions et les encadrés de vigilance du cours.$math_cd_content$,false,false,18,10,false) returning id into exercise_a_3;
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values (exercise_a_3,'single_choice',$math_cd_content$Quel vecteur caractérise directement l’orientation d’un plan ?$math_cd_content$,jsonb_build_array($math_cd_content$Un vecteur normal$math_cd_content$,$math_cd_content$Un vecteur tangent uniquement$math_cd_content$,$math_cd_content$Un vecteur nul$math_cd_content$),jsonb_build_array($math_cd_content$Un vecteur normal$math_cd_content$),$math_cd_content$Un vecteur normal est orthogonal à deux directions non colinéaires du plan.$math_cd_content$,10),(exercise_a_3,'single_choice',$math_cd_content$Quelle forme est une équation cartésienne de plan ?$math_cd_content$,jsonb_build_array($math_cd_content$ax+by+cz+d=0$math_cd_content$,$math_cd_content$ax²+by²=1$math_cd_content$,$math_cd_content$x=x₀+ta uniquement$math_cd_content$),jsonb_build_array($math_cd_content$ax+by+cz+d=0$math_cd_content$),$math_cd_content$Les coefficients a,b,c ne peuvent pas être tous nuls.$math_cd_content$,20),(exercise_a_3,'single_choice',$math_cd_content$Quelle condition rend une droite parallèle à un plan ?$math_cd_content$,jsonb_build_array($math_cd_content$Son vecteur directeur est orthogonal au vecteur normal du plan$math_cd_content$,$math_cd_content$Son vecteur directeur est égal au vecteur normal$math_cd_content$,$math_cd_content$Elle possède une équation du second degré$math_cd_content$),jsonb_build_array($math_cd_content$Son vecteur directeur est orthogonal au vecteur normal du plan$math_cd_content$),$math_cd_content$Un produit scalaire nul entre direction et normale caractérise le parallélisme ou l’inclusion.$math_cd_content$,30),(exercise_a_3,'single_choice',$math_cd_content$Quelle valeur doit toujours être positive ou nulle dans la formule de distance point-plan ?$math_cd_content$,jsonb_build_array($math_cd_content$Le numérateur en valeur absolue$math_cd_content$,$math_cd_content$Le coefficient d uniquement$math_cd_content$,$math_cd_content$Le paramètre t$math_cd_content$),jsonb_build_array($math_cd_content$Le numérateur en valeur absolue$math_cd_content$),$math_cd_content$La valeur absolue garantit que la distance ne soit pas négative.$math_cd_content$,40);
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order,is_test_data) values (target.subject_id,target.level_id,target.series_id,target_chapter_id,target_lesson_id,$math_cd_content$Exercice 2 — Méthodes et raisonnement : Géométrie analytique de l’espace$math_cd_content$,$math_cd_content$Réinvestis les outils du cours et justifie ton choix à l’aide de la correction.$math_cd_content$,$math_cd_content$La correction relie chaque réponse à une démarche de résolution rigoureuse.$math_cd_content$,'single_choice','medium',$math_cd_content$## Consigne

Analyse la situation, repère la méthode pertinente puis choisis la réponse justifiée.$math_cd_content$,$math_cd_content$## Correction

Vérifie les hypothèses, le domaine et la conclusion géométrique ou algébrique.$math_cd_content$,false,false,20,20,false) returning id into exercise_b_3;
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values (exercise_b_3,'single_choice',$math_cd_content$Que faut-il résoudre pour chercher l’intersection d’une droite paramétrique et d’un plan ?$math_cd_content$,jsonb_build_array($math_cd_content$L’équation du plan après remplacement des coordonnées de la droite$math_cd_content$,$math_cd_content$Uniquement la dérivée de la droite$math_cd_content$,$math_cd_content$Une congruence modulo n$math_cd_content$),jsonb_build_array($math_cd_content$L’équation du plan après remplacement des coordonnées de la droite$math_cd_content$),$math_cd_content$Le remplacement laisse une équation portant sur le paramètre de la droite.$math_cd_content$,10),(exercise_b_3,'single_choice',$math_cd_content$Deux plans dont les vecteurs normaux ne sont pas colinéaires sont…$math_cd_content$,jsonb_build_array($math_cd_content$Sécants$math_cd_content$,$math_cd_content$Forcément confondus$math_cd_content$,$math_cd_content$Toujours parallèles$math_cd_content$),jsonb_build_array($math_cd_content$Sécants$math_cd_content$),$math_cd_content$Des normales non colinéaires excluent le parallélisme des plans.$math_cd_content$,20),(exercise_b_3,'single_choice',$math_cd_content$Pourquoi deux droites de vecteurs directeurs non colinéaires ne sont-elles pas forcément sécantes ?$math_cd_content$,jsonb_build_array($math_cd_content$Elles peuvent être non coplanaires$math_cd_content$,$math_cd_content$Elles sont toujours parallèles$math_cd_content$,$math_cd_content$Le produit scalaire est toujours nul$math_cd_content$),jsonb_build_array($math_cd_content$Elles peuvent être non coplanaires$math_cd_content$),$math_cd_content$L’espace admet des droites gauches, c’est-à-dire non coplanaires.$math_cd_content$,30),(exercise_b_3,'single_choice',$math_cd_content$Quand une droite est-elle orthogonale à un plan ?$math_cd_content$,jsonb_build_array($math_cd_content$Quand son vecteur directeur est colinéaire à un vecteur normal du plan$math_cd_content$,$math_cd_content$Quand elle est parallèle à une droite du plan$math_cd_content$,$math_cd_content$Quand son paramètre vaut zéro$math_cd_content$),jsonb_build_array($math_cd_content$Quand son vecteur directeur est colinéaire à un vecteur normal du plan$math_cd_content$),$math_cd_content$La direction de la droite doit suivre une normale du plan.$math_cd_content$,40);
    insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active,is_test_data) values (target.subject_id,target.level_id,target.series_id,target.offering_id,target_chapter_id,target_lesson_id,$math_cd_content$Quiz A — Notions — Géométrie analytique de l’espace$math_cd_content$,$math_cd_content$Vérifie les méthodes et notions essentielles de la leçon Géométrie analytique de l’espace.$math_cd_content$,'medium',12,10,false,false,false) returning id into quiz_a_3; with inserted_questions as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values (quiz_a_3,$math_cd_content$Quel vecteur caractérise directement l’orientation d’un plan ?$math_cd_content$,$math_cd_content$Un vecteur normal est orthogonal à deux directions non colinéaires du plan.$math_cd_content$,'single_choice',10,1,true),(quiz_a_3,$math_cd_content$Quelle forme est une équation cartésienne de plan ?$math_cd_content$,$math_cd_content$Les coefficients a,b,c ne peuvent pas être tous nuls.$math_cd_content$,'single_choice',20,1,true),(quiz_a_3,$math_cd_content$Quelle condition rend une droite parallèle à un plan ?$math_cd_content$,$math_cd_content$Un produit scalaire nul entre direction et normale caractérise le parallélisme ou l’inclusion.$math_cd_content$,'single_choice',30,1,true),(quiz_a_3,$math_cd_content$Quelle valeur doit toujours être positive ou nulle dans la formule de distance point-plan ?$math_cd_content$,$math_cd_content$La valeur absolue garantit que la distance ne soit pas négative.$math_cd_content$,'single_choice',40,1,true) returning id,display_order) insert into public.quiz_answers (question_id,answer,is_correct,display_order) select question_row.id,answer_row.answer,answer_row.is_correct,answer_row.display_order from inserted_questions question_row join (values (10,$math_cd_content$Un vecteur normal$math_cd_content$,true,10),(10,$math_cd_content$Un vecteur tangent uniquement$math_cd_content$,false,20),(10,$math_cd_content$Un vecteur nul$math_cd_content$,false,30),(20,$math_cd_content$ax+by+cz+d=0$math_cd_content$,true,10),(20,$math_cd_content$ax²+by²=1$math_cd_content$,false,20),(20,$math_cd_content$x=x₀+ta uniquement$math_cd_content$,false,30),(30,$math_cd_content$Son vecteur directeur est orthogonal au vecteur normal du plan$math_cd_content$,true,10),(30,$math_cd_content$Son vecteur directeur est égal au vecteur normal$math_cd_content$,false,20),(30,$math_cd_content$Elle possède une équation du second degré$math_cd_content$,false,30),(40,$math_cd_content$Le numérateur en valeur absolue$math_cd_content$,true,10),(40,$math_cd_content$Le coefficient d uniquement$math_cd_content$,false,20),(40,$math_cd_content$Le paramètre t$math_cd_content$,false,30)) as answer_row(question_order,answer,is_correct,display_order) on answer_row.question_order=question_row.display_order;
    insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active,is_test_data) values (target.subject_id,target.level_id,target.series_id,target.offering_id,target_chapter_id,target_lesson_id,$math_cd_content$Quiz B — Méthodes — Géométrie analytique de l’espace$math_cd_content$,$math_cd_content$Vérifie les méthodes et notions essentielles de la leçon Géométrie analytique de l’espace.$math_cd_content$,'medium',12,20,false,false,false) returning id into quiz_b_3; with inserted_questions as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values (quiz_b_3,$math_cd_content$Que faut-il résoudre pour chercher l’intersection d’une droite paramétrique et d’un plan ?$math_cd_content$,$math_cd_content$Le remplacement laisse une équation portant sur le paramètre de la droite.$math_cd_content$,'single_choice',10,1,true),(quiz_b_3,$math_cd_content$Deux plans dont les vecteurs normaux ne sont pas colinéaires sont…$math_cd_content$,$math_cd_content$Des normales non colinéaires excluent le parallélisme des plans.$math_cd_content$,'single_choice',20,1,true),(quiz_b_3,$math_cd_content$Pourquoi deux droites de vecteurs directeurs non colinéaires ne sont-elles pas forcément sécantes ?$math_cd_content$,$math_cd_content$L’espace admet des droites gauches, c’est-à-dire non coplanaires.$math_cd_content$,'single_choice',30,1,true),(quiz_b_3,$math_cd_content$Quand une droite est-elle orthogonale à un plan ?$math_cd_content$,$math_cd_content$La direction de la droite doit suivre une normale du plan.$math_cd_content$,'single_choice',40,1,true) returning id,display_order) insert into public.quiz_answers (question_id,answer,is_correct,display_order) select question_row.id,answer_row.answer,answer_row.is_correct,answer_row.display_order from inserted_questions question_row join (values (10,$math_cd_content$L’équation du plan après remplacement des coordonnées de la droite$math_cd_content$,true,10),(10,$math_cd_content$Uniquement la dérivée de la droite$math_cd_content$,false,20),(10,$math_cd_content$Une congruence modulo n$math_cd_content$,false,30),(20,$math_cd_content$Sécants$math_cd_content$,true,10),(20,$math_cd_content$Forcément confondus$math_cd_content$,false,20),(20,$math_cd_content$Toujours parallèles$math_cd_content$,false,30),(30,$math_cd_content$Elles peuvent être non coplanaires$math_cd_content$,true,10),(30,$math_cd_content$Elles sont toujours parallèles$math_cd_content$,false,20),(30,$math_cd_content$Le produit scalaire est toujours nul$math_cd_content$,false,30),(40,$math_cd_content$Quand son vecteur directeur est colinéaire à un vecteur normal du plan$math_cd_content$,true,10),(40,$math_cd_content$Quand elle est parallèle à une droite du plan$math_cd_content$,false,20),(40,$math_cd_content$Quand son paramètre vaut zéro$math_cd_content$,false,30)) as answer_row(question_order,answer,is_correct,display_order) on answer_row.question_order=question_row.display_order;
  

    target_chapter_id := null;
    target_lesson_id := null;
    select chapter.id into target_chapter_id from public.chapters chapter where chapter.subject_offering_id=target.offering_id and not chapter.is_test_data order by chapter.display_order limit 1;
    if target_chapter_id is null then raise exception 'Le chapitre Mathématiques Terminale % est introuvable.', target.series_name; end if;
    if not exists (select 1 from public.lessons lesson where lesson.chapter_id=target_chapter_id and lower(lesson.title)=lower($math_cd_content$Coniques$math_cd_content$) and not lesson.is_test_data) then
      insert into public.lessons (chapter_id,title,description,content,display_order,is_active,is_test_data) values (target_chapter_id,$math_cd_content$Coniques$math_cd_content$,$math_cd_content$Reconnaître et étudier paraboles, ellipses et hyperboles à partir de leurs foyers, directrices, excentricités et équations réduites.$math_cd_content$,'',coalesce((select max(existing_lesson.display_order)+10 from public.lessons existing_lesson where existing_lesson.chapter_id=target_chapter_id),10),false,false);
    end if;
    select lesson.id into target_lesson_id from public.lessons lesson where lesson.chapter_id=target_chapter_id and lower(lesson.title)=lower($math_cd_content$Coniques$math_cd_content$) and not lesson.is_test_data limit 1;
    if target_lesson_id is null then raise exception 'La leçon % est introuvable après contrôle de structure.', $math_cd_content$Coniques$math_cd_content$; end if;
    if exists (select 1 from public.lessons lesson where lesson.id=target_lesson_id and coalesce(btrim(lesson.content),'')<>'') then raise exception 'La leçon % de Terminale % contient déjà un cours : écrasement interdit.', $math_cd_content$Coniques$math_cd_content$, target.series_name; end if;
    if exists (select 1 from public.exercises exercise where exercise.lesson_id=target_lesson_id and not exercise.is_test_data) or exists (select 1 from public.quizzes quiz where quiz.lesson_id=target_lesson_id and not quiz.is_test_data) then raise exception 'La leçon % de Terminale % possède déjà des évaluations : duplication interdite.', $math_cd_content$Coniques$math_cd_content$, target.series_name; end if;
    update public.lessons set description=$math_cd_content$Reconnaître et étudier paraboles, ellipses et hyperboles à partir de leurs foyers, directrices, excentricités et équations réduites.$math_cd_content$,content=$math_cd_content$# Coniques

## Objectif

Les coniques regroupent la parabole, l’ellipse et l’hyperbole. Leur étude relie une définition géométrique — foyer, directrice, distance — à une équation réduite que l’on sait lire et exploiter.

## 1. Foyer, directrice et excentricité

Soient un point \(F\), une droite \((\mathcal D)\) ne contenant pas \(F\), et un réel strictement positif \(e\). La conique associée est l’ensemble des points \(M\) vérifiant :

$$
\frac{MF}{MH}=e,
$$

où \(H\) est le projeté orthogonal de \(M\) sur \((\mathcal D)\).

| Valeur de l’excentricité | Nature de la conique |
|---|---|
| \(e=1\) | Parabole |
| \(0<e<1\) | Ellipse |
| \(e>1\) | Hyperbole |

La droite qui passe par le foyer et est perpendiculaire à la directrice est un axe de symétrie, appelé **axe focal**.

## 2. Régionnement

Un point \(M\) est intérieur à la conique si \(MF<e\,MH\), extérieur si \(MF>e\,MH\). Le foyer est intérieur ; les points de la directrice sont extérieurs. Ces comparaisons expliquent la forme de la courbe avant même de tracer une équation.

## 3. Parabole

Dans un repère orthonormé bien choisi, une parabole de sommet \(S\) peut avoir l’équation réduite :

$$
y^2=2ax.
$$

Son axe focal est l’axe des abscisses ; son foyer et sa directrice se déduisent du paramètre \(a\). Lorsque l’axe est vertical, le support utilise la forme \(x^2=2ay\).

> **Méthode :** mettre l’équation sous une forme carrée. Une translation comme \((x-h)^2\) ou \((y-k)^2\) indique que le sommet n’est plus l’origine du repère initial.

## 4. Ellipse

Une ellipse centrée à l’origine, d’axe focal horizontal, a une équation réduite :

$$
\frac{x^2}{a^2}+\frac{y^2}{b^2}=1,
$$

avec \(a>b>0\) dans cette orientation. On a \(c^2=a^2-b^2\), les foyers sont \((c;0)\) et \((-c;0)\), et l’excentricité vaut \(e=c/a\). Si le plus grand dénominateur est sous \(y^2\), l’axe focal est vertical.

| Élément à lire | Information |
|---|---|
| Centre | Point autour duquel les carrés sont écrits. |
| Grand axe | Direction du plus grand demi-axe. |
| Foyers | Placés sur l’axe focal. |
| Directrices | Déduites de \(a^2/c\) selon l’orientation. |

## 5. Hyperbole

Pour une hyperbole d’axe focal horizontal :

$$
\frac{x^2}{a^2}-\frac{y^2}{b^2}=1.
$$

Ici \(c^2=a^2+b^2\) et \(e=c/a>1\). Les asymptotes, visibles comme les directions vers lesquelles les branches se rapprochent, sont :

$$
y=\frac ba x\qquad\text{et}\qquad y=-\frac ba x
$$

dans le repère centré. Une translation du centre doit être prise en compte avant de tracer les asymptotes dans le repère initial.

## 6. Démarche complète

1. Mettre l’équation sous une forme réduite, souvent en complétant un carré.  
2. Identifier la nature grâce aux signes : somme pour une ellipse, différence pour une hyperbole, carré isolé pour une parabole.  
3. Lire le centre ou le sommet et l’orientation de l’axe focal.  
4. Calculer les paramètres utiles : \(a\), \(b\), puis \(c\) et \(e\).  
5. Déterminer foyers, sommets, directrices et asymptotes lorsque nécessaires.  
6. Vérifier que les coordonnées sont exprimées dans le bon repère après toute translation.

> **Synthèse :** l’excentricité classe la conique ; l’équation réduite fournit ses éléments caractéristiques. Avant tout calcul, observez le signe entre les deux termes quadratiques et le repère dans lequel vous travaillez.

## Référence pédagogique

Contenu reformulé et approfondi à partir du PDF fourni : **« Leçon 7 : Coniques »**, Mathématiques, Terminale C, Côte d’Ivoire – École numérique. Intégré à Terminale C et D à la demande explicite de l’administrateur.$math_cd_content$,is_active=false,is_test_data=false where id=target_lesson_id and coalesce(btrim(content),'')='';
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order,is_test_data) values (target.subject_id,target.level_id,target.series_id,target_chapter_id,target_lesson_id,$math_cd_content$Exercice 1 — Repères fondamentaux : Coniques$math_cd_content$,$math_cd_content$Réponds aux quatre questions en citant la définition, la propriété ou la méthode utilisée.$math_cd_content$,$math_cd_content$La correction explique la notion utile pour chaque réponse.$math_cd_content$,'single_choice','easy',$math_cd_content$## Consigne

Lis chaque proposition et choisis celle qui respecte la leçon.$math_cd_content$,$math_cd_content$## Correction

Appuie-toi sur les définitions et les encadrés de vigilance du cours.$math_cd_content$,false,false,18,10,false) returning id into exercise_a_4;
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values (exercise_a_4,'single_choice',$math_cd_content$Quelle conique correspond à une excentricité e=1 ?$math_cd_content$,jsonb_build_array($math_cd_content$Une parabole$math_cd_content$,$math_cd_content$Une ellipse$math_cd_content$,$math_cd_content$Une hyperbole$math_cd_content$),jsonb_build_array($math_cd_content$Une parabole$math_cd_content$),$math_cd_content$Le support classe la parabole par l’excentricité égale à 1.$math_cd_content$,10),(exercise_a_4,'single_choice',$math_cd_content$Quelle condition caractérise une ellipse ?$math_cd_content$,jsonb_build_array($math_cd_content$0<e<1$math_cd_content$,$math_cd_content$e=1$math_cd_content$,$math_cd_content$e>1$math_cd_content$),jsonb_build_array($math_cd_content$0<e<1$math_cd_content$),$math_cd_content$Une excentricité strictement comprise entre 0 et 1 correspond à une ellipse.$math_cd_content$,20),(exercise_a_4,'single_choice',$math_cd_content$Quelle équation est de type hyperbole centrée à l’origine ?$math_cd_content$,jsonb_build_array($math_cd_content$x²/a²-y²/b²=1$math_cd_content$,$math_cd_content$x²/a²+y²/b²=1$math_cd_content$,$math_cd_content$y²=2ax$math_cd_content$),jsonb_build_array($math_cd_content$x²/a²-y²/b²=1$math_cd_content$),$math_cd_content$La différence de deux carrés normalisés caractérise l’hyperbole dans cette orientation.$math_cd_content$,30),(exercise_a_4,'single_choice',$math_cd_content$Quel objet est utilisé avec le foyer pour définir une conique ?$math_cd_content$,jsonb_build_array($math_cd_content$Une directrice$math_cd_content$,$math_cd_content$Une tangente uniquement$math_cd_content$,$math_cd_content$Une primitive$math_cd_content$),jsonb_build_array($math_cd_content$Une directrice$math_cd_content$),$math_cd_content$La définition compare la distance au foyer à la distance à la directrice.$math_cd_content$,40);
    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order,is_test_data) values (target.subject_id,target.level_id,target.series_id,target_chapter_id,target_lesson_id,$math_cd_content$Exercice 2 — Méthodes et raisonnement : Coniques$math_cd_content$,$math_cd_content$Réinvestis les outils du cours et justifie ton choix à l’aide de la correction.$math_cd_content$,$math_cd_content$La correction relie chaque réponse à une démarche de résolution rigoureuse.$math_cd_content$,'single_choice','medium',$math_cd_content$## Consigne

Analyse la situation, repère la méthode pertinente puis choisis la réponse justifiée.$math_cd_content$,$math_cd_content$## Correction

Vérifie les hypothèses, le domaine et la conclusion géométrique ou algébrique.$math_cd_content$,false,false,20,20,false) returning id into exercise_b_4;
    insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values (exercise_b_4,'single_choice',$math_cd_content$Dans une ellipse d’axe focal horizontal, quelle relation relie a, b et c ?$math_cd_content$,jsonb_build_array($math_cd_content$c²=a²-b²$math_cd_content$,$math_cd_content$c²=a²+b²$math_cd_content$,$math_cd_content$c=a+b$math_cd_content$),jsonb_build_array($math_cd_content$c²=a²-b²$math_cd_content$),$math_cd_content$La demi-distance focale d’une ellipse est calculée par cette différence positive.$math_cd_content$,10),(exercise_b_4,'single_choice',$math_cd_content$Dans une hyperbole d’axe focal horizontal, quelle relation est correcte ?$math_cd_content$,jsonb_build_array($math_cd_content$c²=a²+b²$math_cd_content$,$math_cd_content$c²=a²-b²$math_cd_content$,$math_cd_content$c=0$math_cd_content$),jsonb_build_array($math_cd_content$c²=a²+b²$math_cd_content$),$math_cd_content$La demi-distance focale de l’hyperbole provient de la somme des carrés.$math_cd_content$,20),(exercise_b_4,'single_choice',$math_cd_content$Quel signe entre les deux termes quadratiques aide à reconnaître une ellipse ?$math_cd_content$,jsonb_build_array($math_cd_content$Le signe +$math_cd_content$,$math_cd_content$Le signe -$math_cd_content$,$math_cd_content$Aucun signe n’est utile$math_cd_content$),jsonb_build_array($math_cd_content$Le signe +$math_cd_content$),$math_cd_content$Une ellipse réduite s’écrit avec une somme de deux carrés normalisés.$math_cd_content$,30),(exercise_b_4,'single_choice',$math_cd_content$Que faut-il faire avant de lire les foyers d’une conique translatée ?$math_cd_content$,jsonb_build_array($math_cd_content$Identifier le centre ou le sommet dans le repère adapté$math_cd_content$,$math_cd_content$Toujours prendre l’origine O$math_cd_content$,$math_cd_content$Supprimer les termes linéaires sans calcul$math_cd_content$),jsonb_build_array($math_cd_content$Identifier le centre ou le sommet dans le repère adapté$math_cd_content$),$math_cd_content$Les coordonnées des éléments caractéristiques dépendent du repère après translation.$math_cd_content$,40);
    insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active,is_test_data) values (target.subject_id,target.level_id,target.series_id,target.offering_id,target_chapter_id,target_lesson_id,$math_cd_content$Quiz A — Notions — Coniques$math_cd_content$,$math_cd_content$Vérifie les méthodes et notions essentielles de la leçon Coniques.$math_cd_content$,'medium',12,10,false,false,false) returning id into quiz_a_4; with inserted_questions as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values (quiz_a_4,$math_cd_content$Quelle conique correspond à une excentricité e=1 ?$math_cd_content$,$math_cd_content$Le support classe la parabole par l’excentricité égale à 1.$math_cd_content$,'single_choice',10,1,true),(quiz_a_4,$math_cd_content$Quelle condition caractérise une ellipse ?$math_cd_content$,$math_cd_content$Une excentricité strictement comprise entre 0 et 1 correspond à une ellipse.$math_cd_content$,'single_choice',20,1,true),(quiz_a_4,$math_cd_content$Quelle équation est de type hyperbole centrée à l’origine ?$math_cd_content$,$math_cd_content$La différence de deux carrés normalisés caractérise l’hyperbole dans cette orientation.$math_cd_content$,'single_choice',30,1,true),(quiz_a_4,$math_cd_content$Quel objet est utilisé avec le foyer pour définir une conique ?$math_cd_content$,$math_cd_content$La définition compare la distance au foyer à la distance à la directrice.$math_cd_content$,'single_choice',40,1,true) returning id,display_order) insert into public.quiz_answers (question_id,answer,is_correct,display_order) select question_row.id,answer_row.answer,answer_row.is_correct,answer_row.display_order from inserted_questions question_row join (values (10,$math_cd_content$Une parabole$math_cd_content$,true,10),(10,$math_cd_content$Une ellipse$math_cd_content$,false,20),(10,$math_cd_content$Une hyperbole$math_cd_content$,false,30),(20,$math_cd_content$0<e<1$math_cd_content$,true,10),(20,$math_cd_content$e=1$math_cd_content$,false,20),(20,$math_cd_content$e>1$math_cd_content$,false,30),(30,$math_cd_content$x²/a²-y²/b²=1$math_cd_content$,true,10),(30,$math_cd_content$x²/a²+y²/b²=1$math_cd_content$,false,20),(30,$math_cd_content$y²=2ax$math_cd_content$,false,30),(40,$math_cd_content$Une directrice$math_cd_content$,true,10),(40,$math_cd_content$Une tangente uniquement$math_cd_content$,false,20),(40,$math_cd_content$Une primitive$math_cd_content$,false,30)) as answer_row(question_order,answer,is_correct,display_order) on answer_row.question_order=question_row.display_order;
    insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active,is_test_data) values (target.subject_id,target.level_id,target.series_id,target.offering_id,target_chapter_id,target_lesson_id,$math_cd_content$Quiz B — Méthodes — Coniques$math_cd_content$,$math_cd_content$Vérifie les méthodes et notions essentielles de la leçon Coniques.$math_cd_content$,'medium',12,20,false,false,false) returning id into quiz_b_4; with inserted_questions as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values (quiz_b_4,$math_cd_content$Dans une ellipse d’axe focal horizontal, quelle relation relie a, b et c ?$math_cd_content$,$math_cd_content$La demi-distance focale d’une ellipse est calculée par cette différence positive.$math_cd_content$,'single_choice',10,1,true),(quiz_b_4,$math_cd_content$Dans une hyperbole d’axe focal horizontal, quelle relation est correcte ?$math_cd_content$,$math_cd_content$La demi-distance focale de l’hyperbole provient de la somme des carrés.$math_cd_content$,'single_choice',20,1,true),(quiz_b_4,$math_cd_content$Quel signe entre les deux termes quadratiques aide à reconnaître une ellipse ?$math_cd_content$,$math_cd_content$Une ellipse réduite s’écrit avec une somme de deux carrés normalisés.$math_cd_content$,'single_choice',30,1,true),(quiz_b_4,$math_cd_content$Que faut-il faire avant de lire les foyers d’une conique translatée ?$math_cd_content$,$math_cd_content$Les coordonnées des éléments caractéristiques dépendent du repère après translation.$math_cd_content$,'single_choice',40,1,true) returning id,display_order) insert into public.quiz_answers (question_id,answer,is_correct,display_order) select question_row.id,answer_row.answer,answer_row.is_correct,answer_row.display_order from inserted_questions question_row join (values (10,$math_cd_content$c²=a²-b²$math_cd_content$,true,10),(10,$math_cd_content$c²=a²+b²$math_cd_content$,false,20),(10,$math_cd_content$c=a+b$math_cd_content$,false,30),(20,$math_cd_content$c²=a²+b²$math_cd_content$,true,10),(20,$math_cd_content$c²=a²-b²$math_cd_content$,false,20),(20,$math_cd_content$c=0$math_cd_content$,false,30),(30,$math_cd_content$Le signe +$math_cd_content$,true,10),(30,$math_cd_content$Le signe -$math_cd_content$,false,20),(30,$math_cd_content$Aucun signe n’est utile$math_cd_content$,false,30),(40,$math_cd_content$Identifier le centre ou le sommet dans le repère adapté$math_cd_content$,true,10),(40,$math_cd_content$Toujours prendre l’origine O$math_cd_content$,false,20),(40,$math_cd_content$Supprimer les termes linéaires sans calcul$math_cd_content$,false,30)) as answer_row(question_order,answer,is_correct,display_order) on answer_row.question_order=question_row.display_order;
  
  end loop;
end $math_cd_five_lessons$;