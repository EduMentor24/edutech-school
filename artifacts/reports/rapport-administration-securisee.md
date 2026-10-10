# Rapport de conformité — Espace Administration sécurisé

**Projet :** EduTech School  
**Périmètre livré :** administration des matières, associations niveau-série-matière, chapitres et leçons  
**Date de validation :** 13 août 2026

## Résumé exécutif

L’espace **Administration** est désormais opérationnel pour les comptes dont le rôle Supabase réel est `admin`. Il permet de gérer le catalogue et le contenu pédagogique sans contourner RLS, sans faire dépendre l’autorisation d’une adresse e-mail et sans reconstruire les modules déjà en place.

La validation fonctionnelle a été réalisée avec les comptes réels disponibles. L’administrateur a créé, associé, publié, consulté depuis le compte élève, puis retiré les données de validation. L’audit final ne retrouve aucune ligne intitulée **« Matière de test administration »** : les données supplémentaires de test ont donc été nettoyées. Le parcours Terminale A1 existant vers Philosophie demeure conservé.

## Interface livrée

| Écran | Fonctionnalités disponibles |
|---|---|
| **Administration** | Tableau de bord avec accès aux matières, chapitres et leçons ; rappel visuel que le rôle est contrôlé par Supabase. |
| **Matières** | Recherche, filtres active/inactive, création, édition, ordre, icône facultative, activation, désactivation et suppression prudente. |
| **Associations** | Publication ou dépublication persistée par niveau et série pour une matière donnée. |
| **Chapitres** | Filtres niveau, série, matière et statut ; création, édition, ordre, brouillon et suppression protégée. |
| **Leçons** | Filtres niveau, série, matière, chapitre et statut ; éditeur de titre, description, contenu libre, ordre et publication. |

Chaque écran distingue les états de chargement, d’erreur, de liste vide et de sauvegarde. Les listes sont ciblées par filtre : les leçons ne sont chargées qu’après le choix d’un chapitre.

## Modèle de données et migrations

La migration conserve les tables existantes. Elle ajoute uniquement les attributs nécessaires à la préparation de brouillons et les index de lecture associés.

| Table | Évolution |
|---|---|
| `subjects` | Ajout de `icon`, `is_active` et `display_order`. |
| `chapters` | Ajout de `is_active`. |
| `lessons` | Ajout de `is_active`. |
| Tables consultées | Index sur les statuts et les colonnes d’ordre pour les matières, chapitres et leçons. |

La visibilité élève requiert une matière active, une association publiée, un chapitre actif et une leçon active. Le service élève applique ces conditions et les politiques RLS les imposent également côté base de données.

## Sécurité et RLS

> Le frontend masque les pages d’administration aux non-administrateurs, mais la décision d’autorisation reste prise par Supabase via `public.is_edutech_admin()` et le rôle stocké dans `public.profiles`.

Les écritures sur `subjects`, `course_subject_offerings`, `chapters` et `lessons` sont réservées au rôle admin. Un test effectué sous le profil étudiant réel, dans une transaction systématiquement annulée, a confirmé que les tentatives d’insertion, modification et suppression sont **bloquées par RLS**.

Une récursion entre politiques de lecture a été détectée pendant ce test puis corrigée. La vérification de l’état actif d’une matière est désormais réalisée par `public.is_active_subject(uuid)`, une fonction avec chemin de recherche figé. Son privilège est explicitement refusé à `anon` et accordé à `authenticated` uniquement. Le contrôle final confirme : `anon_execute = false` et `authenticated_execute = true`.

Les suppressions sont protégées dans l’interface : lorsqu’une matière possède des associations ou des chapitres, ou lorsqu’un chapitre possède des leçons, l’administrateur reçoit une explication et l’inactivation est proposée. Les éléments marqués `is_test_data = true` sont bloqués contre la suppression dans l’interface.

## Validation réalisée

| Contrôle | Résultat |
|---|---|
| Accès Administration avec le compte admin réel | Réussi. |
| Création d’une matière technique de validation | Réussie. |
| Association Terminale A1 et publication | Réussies. |
| Création d’un chapitre et d’une leçon techniques | Réussies. |
| Affichage et ouverture depuis le compte étudiant Terminale A1 | Réussis. |
| Désactivation et nettoyage des données de validation | Confirmés par l’utilisateur et audit final sans ligne résiduelle. |
| Parcours Philosophie de test existant | Conservé ; le contrôle RLS élève confirme 1 chapitre et 1 leçon de test visibles. |
| Écritures interdites au compte étudiant | Confirmées par test RLS non destructif. |
| TypeScript | Validé. |
| Lint | Validé. |
| Vitest | Validé : 20 tests actifs réussis, 1 test explicitement ignoré. |
| Export Android Expo | Validé. |

Le test fonctionnel Première A2 reste volontairement non exécuté, car aucun compte réel de ce profil n’est disponible. Aucun faux compte et aucune modification artificielle de profil n’ont été créés.

## Fichiers principaux

| Élément | Fichier |
|---|---|
| Service administratif RLS | `lib/admin/course-admin-service.ts` |
| Tableau de bord | `app/administration.tsx` |
| Matières et associations | `app/administration/subjects.tsx`, `app/administration/subjects/[subjectId].tsx`, `app/administration/subjects/[subjectId]/offerings.tsx` |
| Chapitres | `app/administration/chapters.tsx`, `app/administration/chapters/[chapterId].tsx` |
| Leçons | `app/administration/lessons.tsx`, `app/administration/lessons/[lessonId].tsx` |
| Composants mobiles réutilisables | `components/edutech/admin-ui.tsx`, `components/edutech/admin-filter-bar.tsx` |
| Régression automatisée | `tests/admin-management.test.ts`, `tests/course-engine.test.ts` |

## Limites et suite recommandée

Le module couvre la saisie textuelle des leçons. L’ajout d’un dépôt de PDF, d’images ou de vidéos doit faire l’objet d’une étape distincte avec stockage sécurisé, contrôle de type, limites de taille et politiques Storage dédiées. Les modules Quiz, Exercices, Mentor IA, Bulletin, avatar et notifications n’ont pas été modifiés dans ce périmètre.
