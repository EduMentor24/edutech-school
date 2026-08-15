# Rapport final — Commande 10

## Bulletin scolaire personnel et célébration du score parfait Quiz

**Projet :** EduTech School  
**Plateforme :** Expo SDK 54, React Native 0.81, Expo Router 6, TypeScript 5.9, Supabase Auth/PostgreSQL/RLS  
**Date du rapport :** 15 août 2026  
**Périmètre :** carnet personnel de notes, calculs de moyenne, administration traçable des coefficients, et célébration visuelle d’un score parfait dans les résultats Quiz.

## 1. Résumé exécutif

La Commande 10 est implémentée et validée. Le Bulletin est désormais un **carnet personnel** dans lequel l’élève peut consulter, ajouter, modifier et supprimer ses propres notes scolaires. Les notes sont rattachées à l’offre réelle Niveau–Série–Matière du profil connecté et protégées par des politiques RLS Supabase. Le Bulletin reste totalement indépendant des Quiz, des Exercices et de la progression pédagogique.

Les calculs sont prudents : les notes sont normalisées sur 20 pour la moyenne de matière, une matière sans note reste « Non évalué », et aucune moyenne trimestrielle pondérée n’est affichée tant qu’aucun coefficient officiellement vérifié n’est disponible. Le seul coefficient présent dans la base est actuellement marqué **non vérifié** et est exclu des calculs. Cette décision respecte l’exigence de ne pas inventer de coefficient lorsque le document officiel attendu n’est pas vérifiable.

Le résultat Quiz dispose également d’une célébration animée et discrète lorsque toutes les réponses sont correctes. Cette animation est purement visuelle et ne modifie ni le score, ni la tentative, ni le Bulletin.

## 2. Fonctionnalités livrées

| Domaine | Réalisation | État |
|---|---|---|
| Synthèse Bulletin | Sélection de l’année scolaire et du trimestre, matières du profil, notes, moyenne de matière et état « Non évalué » | Terminé |
| Détail matière | Liste des notes d’une offre réelle Niveau–Série–Matière et accès au CRUD | Terminé |
| CRUD élève | Ajout, consultation, modification et suppression confirmée de ses notes | Terminé |
| Normalisation | Conversion des notes vers une échelle sur 20 avant calcul | Terminé |
| Moyenne de matière | Moyenne arithmétique des notes incluses dans le calcul | Terminé |
| Moyenne trimestrielle | Pondération uniquement par coefficients officiellement vérifiés | Terminé et inactive sans coefficient vérifié |
| RLS Bulletin | Propriétaire identifié par `student_id = auth.uid()` ; rattachement contrôlé au niveau et à la série du profil | Terminé |
| Administration coefficients | Consultation, création, modification, vérification, preuve de source et suppression confirmée | Terminé |
| Score parfait Quiz | Célébration animée si toutes les réponses sont correctes après soumission | Terminé |
| Indépendance | Aucun appel du Bulletin vers Quiz, Exercices ou `user_progress` | Confirmée |

## 3. Modèle de données et sécurité

La table existante `public.edutech_grades` a été conservée et normalisée autour des champs `student_id`, `subject_offering_id`, `school_year`, `term`, `assessment_type`, `grade`, `max_grade`, `assessment_date`, `comment` et `include_in_average`. Les périodes autorisées sont `T1`, `T2` et `T3`. Les contraintes empêchent les notes ou les dénominateurs invalides.

Le rattachement d’une note n’est pas libre : la base vérifie que l’offre de matière correspond au `school_level` et à la `series` réels du profil connecté. Les politiques RLS isolent les opérations sur les notes par propriétaire. Un contrôle transactionnel a confirmé qu’une note insérée par le profil élève est visible par son propriétaire et invisible pour une autre identité ; la transaction a ensuite été annulée.

La table `public.edutech_coefficients` conserve la valeur, le rattachement à l’offre Niveau–Série–Matière, le statut `is_verified`, les métadonnées de source et le journal d’audit. Un garde-fou de base impose qu’un coefficient vérifié possède une valeur positive, une matière réelle, une source, un document, une référence et une version. Les coefficients non vérifiés ne sont jamais utilisés dans une moyenne trimestrielle.

## 4. Règles de calcul appliquées

La moyenne de matière est calculée à partir des notes réellement saisies et marquées comme incluses dans la moyenne. Chaque note est convertie sur 20 selon la formule suivante :

> note normalisée = note obtenue / note maximale × 20

La moyenne trimestrielle est calculée uniquement à partir des matières évaluées possédant un coefficient officiellement vérifié :

> moyenne trimestrielle = Σ(moyenne de matière × coefficient) / Σ(coefficients retenus)

Lorsqu’une matière ne possède aucune note, l’interface affiche **« Non évalué »**. Elle n’est pas comptée comme zéro. Lorsqu’aucun coefficient vérifié n’est disponible, l’interface n’affiche aucune moyenne trimestrielle pondérée. Aucune moyenne annuelle n’est calculée, car la formule officielle applicable n’a pas été vérifiée.

## 5. Vérification des coefficients DPFC

La page officielle DPFC des textes 2025–2026 référence une entrée intitulée « Circulaire N° 0308 — Coefficients dans les premiers et second cycles de l’enseignement secondaire général » [1]. Toutefois, le PDF actuellement servi par le lien correspondant affiche la Circulaire n°0311 du 1er septembre 2025, consacrée aux horaires, et les pages consultées ne contiennent pas le tableau de coefficients attendu [2].

En conséquence, **aucun coefficient n’a été présenté comme officiel**. L’administration affiche explicitement la ligne existante comme « Non vérifié » et ne l’utilise pas dans les calculs. Cette retenue est intentionnelle et conforme à la règle « ne rien inventer ».

## 6. Écrans et fichiers principaux

| Fichier | Rôle |
|---|---|
| `app/bulletin.tsx` | Synthèse personnelle par année, trimestre et matière |
| `app/bulletin/[offeringId].tsx` | Détail d’une matière et liste des notes |
| `app/bulletin/note/[noteId].tsx` | Ajout, modification et suppression confirmée d’une note |
| `lib/bulletin/bulletin-model.ts` | Types purs, normalisation et calculs |
| `lib/bulletin/bulletin-service.ts` | Accès Supabase et CRUD propriétaire |
| `lib/admin/bulletin-coefficient-admin-service.ts` | Gestion administrative des coefficients et preuves de source |
| `app/administration/coefficients.tsx` | Interface mobile d’administration des coefficients |
| `app/administration.tsx` | Accès à la gestion des coefficients depuis Administration |
| `app/quiz/result/[attemptId].tsx` | Célébration visuelle d’un score parfait |
| `tests/bulletin-model.test.ts` | Tests des calculs et de la normalisation |
| `commande10-bulletin-decisions.md` | Décisions de conception et règles de calcul |
| `commande10-sources-coefficients.md` | Audit et traçabilité des sources DPFC |

## 7. Validations techniques

Les commandes suivantes ont été exécutées avec succès après les dernières corrections :

| Contrôle | Résultat |
|---|---|
| `pnpm check` | Réussi, aucune erreur TypeScript |
| `pnpm lint` | Réussi ; seul l’avertissement de module ESLint existant reste signalé par Node |
| `pnpm test` | Réussi : 26 tests actifs ; un test d’authentification existant reste volontairement ignoré |
| `npx expo export --platform android` | Réussi ; bundle Android exporté dans `dist` |
| Test RLS transactionnel Bulletin | Réussi : visible par le propriétaire, invisible pour une autre identité, rollback exécuté |
| Test fonctionnel réel élève | Validé : « Non évalué » et absence de moyenne pondérée sans coefficient vérifié |
| Test fonctionnel réel administration | Validé : ligne de coefficient affichée « Non vérifié » |

## 8. État réel de la base après contrôle final

Le contrôle indépendant en lecture seule a retourné les compteurs suivants :

| Élément | Compteur | Interprétation |
|---|---:|---|
| Notes Bulletin | 1 | Une note personnelle réelle saisie pendant la validation est conservée ; elle n’a pas été supprimée comme donnée temporaire |
| Coefficients vérifiés | 0 | Aucun coefficient officiellement vérifié n’est actuellement utilisable |
| Coefficients non vérifiés | 1 | Une ligne existe pour traçabilité, mais elle est exclue des calculs |
| Quiz | 0 | Aucun quiz temporaire persistant après nettoyage |
| Tentatives Quiz | 0 | Aucune tentative temporaire persistante après nettoyage |
| Lignes `user_progress` | 1 | La progression existante est conservée ; aucun écrit Bulletin ou Quiz ne l’a modifiée |

Aucune donnée fictive, aucun faux profil et aucune note de test transactionnelle ne restent dans la base. La note personnelle conservée correspond au parcours réel validé par le compte élève et n’a pas été supprimée automatiquement afin de préserver une donnée saisie par l’utilisateur.

## 9. Limites connues et décisions de prudence

La source DPFC actuellement liée à l’intitulé de la Circulaire n°0308 ne permet pas de vérifier les coefficients annoncés. Il serait incorrect de compléter les coefficients par analogie, par mémoire ou à partir d’une source non officielle. L’administration est donc prête à recevoir les valeurs exactes dès qu’un document officiel correct et consultable sera disponible, mais aucune valeur non vérifiée ne peut influencer les moyennes.

La validation réelle du score parfait Quiz a été rendue possible par le parcours Quiz déjà contrôlé. La célébration est déclenchée uniquement après réception d’un résultat soumis, lorsque le nombre de bonnes réponses correspond au nombre total de questions. Elle n’expose aucune correction avant soumission et n’écrit jamais dans `user_progress`.

## 10. Conclusion

La Commande 10 est terminée. Le Bulletin personnel, son CRUD élève, ses règles de calcul, son isolation RLS, son administration de coefficients et la célébration du score parfait Quiz sont intégrés sans données fictives et sans modification non demandée des modules pédagogiques existants. Les limites documentaires sur les coefficients sont explicitement affichées et empêchent tout calcul officiel non justifié.

## Références

[1]: https://dpfc-ci.net/?page_id=4855 "DPFC Côte d’Ivoire — Textes officiels 2025–2026"

[2]: https://dpfc-ci.net/dpfc/2026/textes_officiels/Coefficients%20dans%20les%20premiers%20et%20second%20cycles%20de%20l%27enseignement%20secondaire%20g%C3%A9n%C3%A9ral.pdf "PDF actuellement lié à l’entrée Circulaire n°0308"
