# Commande 17 — Gestion des utilisateurs, années scolaires et parcours de classe

- [x] Auditer les tables Supabase, les politiques RLS, les services et les écrans administratifs existants.
- [x] Créer les tables non destructives d’années scolaires, d’historique scolaire, de demandes de changement, de décisions de passage et de journal administratif.
- [x] Garantir une seule année scolaire active, la clôture et l’archivage non destructifs.
- [x] Préserver explicitement les données 2026-2027, les coefficients, la LV2, les notes, les Bulletins et la progression existants.
- [x] Ajouter les fonctions sécurisées d’administration et de journalisation côté base de données.
- [x] Ajouter les règles RLS pour l’isolation des élèves, l’accès administrateur et les historiques privés.
- [x] Développer l’administration mobile : années scolaires, utilisateurs, demandes, décisions et journal.
- [x] Ajouter les confirmations avant les actions sensibles : activation, clôture, archivage, désactivation et décision de passage.
- [x] Développer le profil scolaire élève, l’historique annuel et la possibilité de modification de classe limitée à une fois par année.
- [x] Créer le flux de demande administrative après une seconde demande de changement de niveau ou série.
- [x] Intégrer l’année scolaire active au Bulletin sans altérer les Bulletins historiques.
- [x] Ajouter les 20 tests obligatoires de la Commande 17.
- [x] Exécuter TypeScript, lint, tests complets, contrôles RLS et export Android.
- [x] Rédiger le rapport final détaillé de la Commande 17.
