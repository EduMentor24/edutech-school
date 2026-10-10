# Rapport final — Autres matières Terminale A1

**Date :** 13 août 2026  
**Périmètre :** les matières déjà associées à Terminale A1, à l’exclusion stricte de Mathématiques et de Philosophie.  
**Résultat :** **aucune structure supplémentaire n’a été créée.**

## Décision pédagogique

La commande demandait de créer uniquement une structure établie par une source DPFC fiable et explicitement applicable à **Terminale A1**. Les documents accessibles décrivent, selon les matières, « Terminale », « Terminale A » ou le second cycle, sans ventilation exploitable pour la seule série A1. Il aurait donc été non conforme d’attribuer par analogie à A1 une progression publiée pour un ensemble plus large.

> Une structure non explicitement ventilée pour **Terminale A1** reste en attente. Aucun intitulé, ordre, chapitre ou leçon n’est déduit d’un document générique.

| Matières associées examinées | Nombre | Statut de la décision |
|---|---:|---|
| Allemand, Anglais, Arts plastiques, Éducation musicale, EPS, Espagnol, Français, Histoire-Géographie, Informatique/TICE et SVT | 10 | **Non traitées par import** : aucune source DPFC A1 suffisamment explicite. |
| Mathématiques | 1 | Hors périmètre, préservée sans modification. |
| Philosophie | 1 | Hors périmètre, préservée sans modification. |

La liste des documents examinés et la justification matière par matière sont conservées dans [`terminale-a1-autres-matieres-decisions.md`](./terminale-a1-autres-matieres-decisions.md).

## Contrôle des données Supabase

Le contrôle SQL de non-régression effectué avant et après la décision confirme qu’aucune écriture Supabase n’a été exécutée dans cette commande.

| Offre Terminale A1 | Chapitres | Leçons | Leçons avec contenu | État |
|---|---:|---:|---:|---|
| Les 10 matières non importées | 0 chacune | 0 chacune | 0 | Inchangé ; aucun cours inventé. |
| Mathématiques | 1 | 8 | 0 | Inchangé et hors périmètre. |
| Philosophie | 5 | 12 | 2 | Inchangé, y compris la leçon pilote et les données de test. |
| Matière test | 2 | 1 | 1 | Inchangée, hors périmètre. |

Les offres des dix matières non importées restent publiées dans le catalogue, mais l’interface indique déjà qu’aucun cours n’est disponible lorsque le compteur de chapitres est nul. Aucun changement de publication, d’association niveau-série-matière, de statut, de titre ni d’ordre n’a été apporté.

## Administration et sécurité

Le service administratif calcule les compteurs à partir des relations réelles `course_subject_offerings → chapters → lessons`. Les dix matières concernées ressortent donc avec **0 chapitre** et **0 leçon** dans l’administration, sans donnée de remplissage.

La vérification des politiques RLS confirme les garde-fous suivants :

| Ressource | Lecture élève | Écriture | Conclusion |
|---|---|---|---|
| `course_subject_offerings` | Offre publiée, matière active, cible `school_level`/`series` autorisée | Administrateur uniquement via `is_edutech_admin()` | Les offres restent ciblées par profil. |
| `chapters` | Chapitre actif, offre publiée, matière active, cible autorisée | Administrateur uniquement | Un brouillon inactif ne serait pas visible. |
| `lessons` | Leçon et chapitre actifs, offre publiée, matière active, cible autorisée | Administrateur uniquement | Une leçon inactive ne serait pas visible. |

Le service mobile applique en complément `is_active = true` lorsqu’il charge les chapitres et les leçons. Comme **aucun chapitre ni aucune leçon n’a été créé**, la confirmation « nouvelles leçons en brouillon/inactives » est **sans objet** ; aucun nouveau brouillon n’existe et aucun nouvel élément n’est exposé aux élèves.

## Validations techniques

Les commandes suivantes ont été exécutées avec succès le 13 août 2026 :

| Contrôle | Résultat |
|---|---|
| `pnpm check` | Réussi, sans erreur TypeScript. |
| `pnpm lint` | Réussi. Un avertissement Node relatif au type de module ESLint est présent, sans erreur de lint. |
| `pnpm test` | Réussi : **14 tests actifs** validés, **1 test ignoré**. |
| `npx expo export --platform android` | Réussi ; bundle Android exporté dans `dist`. |

## Conclusion et suite autorisée

La commande est clôturée sans import, conformément au principe « ne rien inventer ». Mathématiques et Philosophie Terminale A1 n’ont pas été dupliquées ni modifiées. Les dix autres matières pourront être structurées ultérieurement uniquement à partir d’une progression DPFC qui indique clairement **Terminale A1**, ou après une consigne explicite autorisant une autre règle de correspondance documentée.

## Références

[1] [DPFC — Progressions du Secondaire 2025-2026](https://dpfc-ci.net/?page_id=5267)  
[2] [DPFC — Programmes éducatifs et guides d’exécution du Secondaire](https://dpfc-ci.net/?page_id=283)  
[3] [DPFC — Programme éducatif Allemand Terminale, 2018-2019](https://dpfc-ci.net/wp-content/uploads//dpfc_fichiers/2018-2019/programmes_guides/Allemand/PROGR_ED_ALL_2018-2019_TLE_APC.pdf)
