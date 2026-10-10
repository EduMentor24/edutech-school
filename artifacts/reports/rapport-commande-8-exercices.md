# Rapport final — Commande 8, module Exercices

**Date de contrôle :** 14 août 2026  
**Périmètre :** module Exercices, intégration aux leçons, administration, tentatives individuelles et résultat élève.  
**Résultat :** le module est opérationnel, sécurisé et ne contient aucun exercice ou résultat temporaire après la validation réelle.

## Architecture retenue

Le modèle réutilise `public.exercises`, sans créer de double catalogue. Cette table est étendue pour le rattachement exact `Niveau → Série → Matière → Chapitre → Leçon`, la publication, l’activation, l’ordre, le type et la difficulté. Les questions structurées sont stockées dans `public.exercise_questions`, tandis que les tentatives personnelles sont stockées dans `public.exercise_attempts`. La table historique `exercise_submissions` a été préservée sans modification.

| Élément | Mise en œuvre | Règle appliquée |
|---|---|---|
| Catalogue | Fonctions sécurisées de catalogue et détail | Seuls les exercices publiés, actifs et compatibles avec le profil scolaire sont exposés. |
| Questions | Types `single_choice`, `multiple_choice`, `true_false`, `short_answer`, `free_response` | Les réponses correctes ne sont jamais lues directement par l’élève avant soumission. |
| Tentatives | Plusieurs tentatives personnelles, une par démarrage | L’élève ne peut lire que ses propres tentatives. |
| Correction | Correction automatique des choix, vrai/faux et réponses multiples ; révision pour les réponses ouvertes | Le score est calculé côté serveur. |
| Leçons | Bouton vers les exercices associés et état sans exercice | La progression de la leçon n’est jamais modifiée par une tentative. |
| Administration | Rattachement progressif, brouillon, questions, prévisualisation, publication, activation et suppression confirmée | Tout nouvel exercice démarre en brouillon inactif. |

## Parcours disponibles

| Surface | Comportement livré |
|---|---|
| Onglet **Exercices** | Catalogue, filtres réels Matière/Chapitre/Leçon/Difficulté, états chargement/vide/erreur et accès à l’historique. |
| Détail d’exercice | Démarrage de tentative, questions, options, réponses libres et soumission. |
| Résultat | Statut, score, pourcentage, correction générale et explications disponibles après soumission. |
| Historique | Tentatives réelles de l’élève connecté, sans moyenne ni chiffre inventé. |
| Lecteur de leçon | Accès aux exercices publiés liés ; message explicite lorsqu’aucun exercice n’est disponible. |
| Administration | Gestion complète et prévisualisation Markdown des exercices avant publication. |

## Sécurité et performance

Les politiques RLS réservent l’administration complète aux administrateurs. Les élèves passent par les fonctions SQL de catalogue, détail, démarrage, soumission, résultat et historique, qui vérifient le profil réel, la disponibilité de l’exercice et la propriété de la tentative. Après contrôle direct des privilèges, les fonctions du module sont **inaccessibles au rôle `anon`** et disponibles uniquement pour les sessions `authenticated` nécessaires.

Les brouillons, exercices inactifs, matières inactives, leçons inactives et offres hors profil sont exclus à la source. Les index couvrent les parcours catalogue par cible scolaire, les exercices d’une leçon, les questions par ordre et l’historique par élève/exercice/date. Les filtres utilisent une lecture de catalogue groupée ; aucune requête par exercice n’est déclenchée par l’écran.

## Corrections apportées pendant la validation réelle

Trois défauts de nommage SQL ou client ont été détectés uniquement par les comptes réels et corrigés immédiatement.

| Incident | Cause | Correction vérifiée |
|---|---|---|
| Publication administrative | L’interface envoyait `isActive` au lieu de la colonne Supabase `is_active`. | La mise à jour envoie `is_published` et `is_active`. |
| Démarrage d’exercice | Référence SQL `exercise_id` ambiguë dans la procédure de création de tentative. | Les références sont qualifiées par alias dans la procédure. |
| Soumission | Référence SQL `status` ambiguë dans la procédure de correction. | Les colonnes de tentative et de question sont toutes qualifiées par alias. |

## Validation avec les comptes réels et nettoyage

Le parcours a été validé avec les deux comptes existants. L’administrateur a créé un exercice temporaire, ajouté une question, prévisualisé, publié et activé l’exercice. Le compte élève l’a vu, l’a démarré, a soumis sa réponse, a obtenu son résultat et son historique. La disponibilité côté élève et l’accès administratif ont également été confirmés par l’utilisateur.

Après validation, l’audit a identifié un seul exercice temporaire, **« Test temporaire »**, avec une question et quatre tentatives. Le nettoyage ciblé a supprimé uniquement ces dépendances et cet exercice. Le contrôle post-nettoyage confirme l’absence de toute trace temporaire : aucun exercice, aucune question, aucune tentative et aucune soumission de test ne subsistent.

## Validations techniques

| Contrôle | Résultat |
|---|---|
| TypeScript | Réussi, sans erreur. |
| Lint | Réussi, sans avertissement applicatif. L’avertissement Node sur le type de module ESLint est informatif. |
| Vitest | Réussi : **24 tests actifs** validés dans 10 fichiers ; **1 test ignoré**. |
| Export Android | Réussi ; bundle généré dans `dist`. |
| RLS et privilèges | Contrôlés : accès anonyme interdit aux fonctions et absence de contenu de test persistante. |

## Conclusion

Le module Exercices est prêt à recevoir uniquement des exercices pédagogiques validés par l’administration. Il reste vide après la recette, conformément à l’exigence de ne pas inventer ni conserver de contenu pédagogique de démonstration. Les futures extensions — types supplémentaires, évaluation manuelle ou statistiques avancées — pourront utiliser les fondations sécurisées déjà en place, sans reconstruire le module.
