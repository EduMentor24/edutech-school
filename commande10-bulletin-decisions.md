# Commande 10 — Décisions de conception du Bulletin

## Rôle du module

Le Bulletin est le **carnet personnel** des notes réellement obtenues à l’école et saisies par l’élève. Il ne reçoit aucune donnée des Quiz, Exercices ou de la progression pédagogique.

## Données et isolation

La table existante `public.edutech_grades` est conservée et normalisée autour de `student_id`, `subject_offering_id`, `school_year`, `term`, `assessment_type`, `grade`, `max_grade`, `assessment_date` et `comment`. Les quatre opérations CRUD sont protégées par RLS : le propriétaire est identifié avec `student_id = auth.uid()`.

Le rattachement de la matière est contrôlé côté base : l’offre doit correspondre au `school_level` et à la `series` réels du profil connecté, via les tables `levels`, `series` et `course_subject_offerings`.

## Périodes et formules

Les périodes sont exclusivement `T1`, `T2` et `T3`. Chaque synthèse filtre à la fois sur l’année scolaire et le trimestre ; les données ne se mélangent donc pas entre périodes.

La moyenne de matière est la moyenne arithmétique des notes réellement saisies et normalisées sur 20. La colonne `include_in_average` permet de ne pas inclure une note dans le calcul si l’élève décide de la conserver à titre historique. Aucune pondération d’évaluation n’est appliquée faute de règle officielle vérifiée.

La moyenne trimestrielle utilise uniquement les matières évaluées dont le coefficient est officiellement vérifié :

> Moyenne trimestrielle = Σ(moyenne de matière × coefficient de matière) / Σ(coefficients des matières prises en compte)

Une matière sans note reste « Non évalué » et un coefficient non vérifié est exclu du calcul.

## Coefficients

Les coefficients sont conservés dans `public.edutech_coefficients` avec rattachement possible à une offre Niveau–Série–Matière, métadonnées de source, statut `is_verified` et journal d’audit. Le lien DPFC officiel actuellement référencé pour la circulaire n°0308 fournit un document n°0311 portant sur les horaires ; aucun coefficient n’est donc marqué vérifié ni utilisé tant qu’un texte exact n’est pas disponible.

## Moyenne annuelle

L’architecture conserve les trois trimestres séparés. Aucune moyenne annuelle n’est calculée, car la formule officielle applicable n’a pas été vérifiée.
