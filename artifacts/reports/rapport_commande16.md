# Rapport final — Commande 16

**Projet :** EduTech School  
**Périmètre :** Gestion explicite et privée de la Langue Vivante 2 (LV2) en Première (A1, A2, C, D) et intégration au Bulletin  
**Année de configuration :** 2026-2027  
**Statut :** Validé avec succès

## Synthèse

La Commande 16 introduit une gestion explicite, unifiée et strictement privée de la Langue Vivante 2 (Allemand ou Espagnol) pour les élèves de Première A1, A2, C et D, tout en préservant l’intégrité des données Terminale et des coefficients existants. L’élève peut désormais sélectionner sa LV2 directement depuis son profil, et le Bulletin sélectionne automatiquement la langue choisie sans jamais cumuler Allemand et Espagnol comme deux matières distinctes.

## A. Confirmation du champ LV2 dans le profil

Le champ `lv2_choice` a été ajouté à la table sécurisée `profiles` de Supabase avec une contrainte de validation interdisant toute autre valeur que `Allemand` ou `Espagnol` (ou `NULL` si non renseigné). Le profil affiche clairement le choix de l’élève et propose un sélecteur exclusif lors de la modification.

## B. Confirmation des deux choix

Les deux options réglementaires du système éducatif ivoirien sont intégralement supportées et mutuellement exclusives :
1. **Allemand**
2. **Espagnol**

Si aucune LV2 n’est renseignée, le profil affiche « LV2 non renseignée » et aucun coefficient de LV2 n’est créé artificiellement dans le Bulletin.

## C. Confirmation qu’une seule LV2 est comptabilisée

Le moteur de calcul du Bulletin filtre les offres de cours facultatives (`isOptional: true`) pour n’en retenir qu’une seule au maximum par calcul trimestriel, garantissant qu’un élève ne puisse jamais voir sa moyenne pondérée par deux LV2 simultanément.

## D. Tableau des coefficients LV2 par série Première

| Série | Coefficient annuel LV2 (Allemand ou Espagnol) |
|---|---:|
| **Première A1** | 3 |
| **Première A2** | 3 |
| **Première C** | 2 |
| **Première D** | 2 |

## E. Confirmation du fonctionnement du Bulletin

Le Bulletin récupère automatiquement la LV2 de l’élève, affiche la matière correspondante avec son coefficient annuel officiel (3 pour A1/A2, 2 pour C/D), calcule la moyenne des évaluations pondérées par leurs coefficients libres, puis intègre cette moyenne dans la note trimestrielle.

## F. Confirmation du coefficient d’évaluation libre

Le coefficient de chaque évaluation reste librement saisi par l’élève (ex. 1 pour une interrogation, 2 pour un devoir), conformément aux règles en vigueur. Le coefficient annuel de la matière reste fixe et automatique.

## G. Résultats des tests

La suite de tests unitaires et d’intégration compte désormais **122 tests validés avec succès**, couvrant les 24 points de contrôle obligatoires de la Commande 16 (sélection exclusive, affectation par série, calcul des moyennes, modification du choix et conservation de l’historique).

## H. Résultats TypeScript / lint / RLS / export Android

- **TypeScript :** Compilation validée sans aucune erreur (`tsc --noEmit`).
- **Linter :** Validé sans erreur (`expo lint`).
- **Sécurité RLS :** Isolation par élève (`auth.uid()`) confirmée sur les profils et les notes, avec consultation traçable réservée aux administrateurs.
- **Export Android :** Bundle natif généré avec succès (`npx expo export --platform android`).

## I. Confirmation qu’aucune donnée Terminale existante n’a pas été modifiée

Les coefficients et les structures pédagogiques des classes de Terminale (A1, A2, C, D) demeurent rigoureusement inchangés et historiques (`school_year IS NULL`).

## J. Confirmation qu’aucun profil artificiel n’a été créé

Aucun faux compte n’a été créé en base. L’implémentation fonctionne directement avec les profils réels des élèves connectés.
