# Conception — Administration pédagogique sécurisée

## Objectif

L’espace Administration permet exclusivement à un profil dont le rôle Supabase réel est `admin` de gérer le catalogue et les contenus pédagogiques. L’interface est conçue pour un usage portrait sur smartphone, avec des actions larges, des formulaires courts et un chargement ciblé au périmètre sélectionné.

> La garde dans Expo Router et les boutons conditionnels facilitent la navigation, mais l’autorisation effective est assurée par les politiques RLS s’appuyant sur `public.is_edutech_admin()`.

## Écrans et contenus

| Écran | Contenu principal | Action principale |
|---|---|---|
| Administration | Trois cartes : Matières, Chapitres, Leçons ; rappel du rôle et de la portée de publication. | Ouvrir une section. |
| Matières | Recherche, filtre d’état, liste compacte des matières, ordre et statut. | Créer ou modifier une matière. |
| Édition d’une matière | Nom, description, icône facultative, ordre et statut global. | Enregistrer ou désactiver. |
| Associations | Une matière sélectionnée ; groupes par niveau avec interrupteurs A1/A2/C/D. | Publier ou dépublier une offre réelle. |
| Chapitres | Filtres niveau, série et matière, puis liste des chapitres de l’offre sélectionnée. | Créer ou modifier un chapitre. |
| Édition d’un chapitre | Offre de matière, titre, description, ordre, statut actif/inactif. | Enregistrer, désactiver ou supprimer sans dépendance. |
| Leçons | Filtres niveau, série, matière et chapitre ; liste ciblée uniquement. | Créer ou modifier une leçon. |
| Édition d’une leçon | Chapitre, titre, description, contenu libre, ordre et statut actif/inactif. | Enregistrer, désactiver ou supprimer. |

## Flux essentiels

Un administrateur ouvre **Administration**, choisit une section, applique les filtres disponibles, puis ouvre l’éditeur de l’élément concerné. Toute sauvegarde appelle Supabase directement avec la session courante. En cas de refus RLS, une erreur compréhensible est affichée et aucune modification locale n’est considérée comme validée.

Pour publier une association, l’administrateur ouvre la matière, sélectionne le niveau et la série, puis active l’association. Cette action modifie `course_subject_offerings.is_published` dans Supabase. Pour préparer un contenu sans le montrer aux élèves, l’administrateur laisse l’association, le chapitre ou la leçon inactif.

Avant une suppression, l’interface compte les dépendances ciblées. Si une matière possède des chapitres ou si un chapitre possède des leçons, l’interface explique le risque et propose l’inactivation ; une suppression définitive n’est proposée que lorsque l’élément n’a pas de dépendance. Les données de test Philosophie ne sont pas modifiées pendant l’implémentation.

## Modèle de données retenu

| Table | Rôle administratif | Publication / ordre |
|---|---|---|
| `subjects` | Métadonnées globales d’une matière. | Nouveaux champs : `icon`, `is_active`, `display_order`. |
| `course_subject_offerings` | Association réelle matière–niveau–série. | `is_published`, `display_order` existants. |
| `chapters` | Chapitre lié à une offre, donc indirectement à un niveau et une série. | Nouveau `is_active` ; `display_order` existant. |
| `lessons` | Leçon liée à un chapitre. | Nouveau `is_active` ; `display_order` existant. |

La publication élève requiert désormais successivement une matière active, une offre publiée, un chapitre actif et une leçon active. Cela conserve l’architecture actuelle et permet le brouillon sans exposer de contenu.

## Sécurité et performances

Les politiques existantes d’`INSERT`, `UPDATE` et `DELETE` seront conservées et étendues si nécessaire : elles appellent toutes `public.is_edutech_admin()`, fonction qui vérifie `profiles.role = 'admin'` pour `auth.uid()`. Aucune adresse e-mail n’est utilisée dans l’application pour accorder une permission.

Les listes administratives sont chargées par sections et filtres. Les leçons ne sont demandées qu’après sélection d’un chapitre ; aucun écran ne télécharge toutes les leçons de l’application. Les états de chargement, vide, erreur, sauvegarde et confirmation font partie de chaque flux.
