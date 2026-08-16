# Commande 14 — Suivi et Validation

- [x] Implémenter le mode aperçu administrateur pour le rendu des leçons inactives.
- [x] Ajouter les filtres dans le tableau de bord administrateur (par statut actif/inactif et par série).
- [x] Auditer les séries Première C et Première D en base Supabase.
- [x] Structurer et importer les matières, chapitres et leçons officielles de Première C (Français, Anglais, Espagnol, Mathématiques, Philosophie, Physique-Chimie, SVT, Histoire-Géographie, etc.), vides, inactives et non publiées.
- [x] Structurer et importer les matières, chapitres et leçons officielles de Première D (Français, Anglais, Espagnol, Mathématiques, Philosophie, Physique-Chimie, SVT, Histoire-Géographie, etc.), vides, inactives et non publiées.
- [x] Vérifier le dédoublonnage et l'absence de régression sur Première A1/A2 et Terminale.
- [x] Vérifier que les coefficients ne sont pas modifiés.
- [x] Ajouter les tests unitaires et d'intégration spécifiques de la Commande 14.
- [x] Valider TypeScript, lint, tous les tests, RLS et export Android.
- [x] Rédiger le rapport final complet.

## Commande 14.1 — Correction et restructuration manuelle C/D

- [x] Auditer la structure Première C/D existante et isoler uniquement les chapitres et leçons incorrects des matières couvertes.
- [x] Remplacer Mathématiques Première C par les 17 leçons de référence, sans association à Première D.
- [x] Remplacer Mathématiques Première D par les 15 leçons de référence, sans fusion avec Première C.
- [x] Remplacer Physique-Chimie Première C par ses 5 chapitres et 28 leçons de référence.
- [x] Remplacer Physique-Chimie Première D par ses 5 chapitres et 26 leçons de référence.
- [x] Remplacer Français, Anglais, Espagnol, Philosophie et Histoire-Géographie par les structures communes C/D fournies.
- [x] Conserver la structure SVT C/D non modifiée, en attente d’une source DPFC vérifiée.
- [x] Garantir que les leçons C/D corrigées sont vides, inactives, non publiées et absentes du catalogue élève.
- [x] Vérifier le dédoublonnage, l’intégrité des associations C/D, la non-régression A1/A2 et Terminale, et l’absence de modification des coefficients.
- [x] Ajouter des tests réels de structure et exécuter TypeScript, lint, tests, RLS et export Android.
- [x] Produire le rapport final chiffré de la Commande 14.1.
