# Rapport final — Commande 6.4, Terminale A1

**Date de contrôle :** 13 août 2026  
**Périmètre :** offres déjà associées à **Terminale A1** dans EduTech School.  
**Référence annuelle :** les progressions DPFC 2025-2026 ont été examinées comme référence 2026-2027, conformément à la commande.

## Conclusion

**Aucune structure pédagogique supplémentaire n’a été créée.** Les sources disponibles sont officielles, mais aucune ne ventile explicitement les matières concernées pour la seule série **Terminale A1**. Les documents génériques « Terminale », « Tle » ou « Terminale A » ne sont pas assimilés à A1 : le faire reviendrait à inventer une correspondance entre A1 et A2 non établie par les sources.

> En application de la règle « ne pas deviner », l’absence de libellé A1 explicite entraîne l’absence d’import. Aucune leçon, aucun thème et aucun chapitre n’est déduit d’une progression générique.

## Périmètre Supabase contrôlé

L’audit confirme dix offres Terminale A1 réelles, sans chapitre ni leçon. L’EPS est incluse dans le rapport car elle est effectivement associée dans la base, bien qu’elle ne figurait pas dans la liste indicative de la commande.

| Matière associée | Document DPFC examiné | Libellé constaté | Structure créée | Chapitres / thèmes créés | Leçons créées | Décision |
|---|---|---|---|---:|---:|---|
| Allemand | Progressions nationales 2025-2026 [2] | « TERMINALE » | Aucune | 0 | 0 | Non traitée : série A1 absente. |
| Anglais | Progression Terminale A 2025-2026 [3] | « TERMINALE A » | Aucune | 0 | 0 | Non traitée : A1 et A2 ne sont pas distinguées. |
| Arts plastiques | Progressions 2025-2026 [4] | « Tle » | Aucune | 0 | 0 | Non traitée : série A1 absente. |
| Éducation musicale | Progressions 2025-2026 [5] | « CLASSE DE TERMINALE (Tle) » | Aucune | 0 | 0 | Non traitée : série A1 absente. |
| Éducation Physique et Sportive | Progressions 2nd cycle 2025-2026 [6] | « Seconde – Première – Terminale » | Aucune | 0 | 0 | Non traitée : progression générique sans série. |
| Espagnol | Progressions 2025-2026 [7] | « TERMINALE (Tle) » | Aucune | 0 | 0 | Non traitée : série A1 absente. |
| Français | Progressions pédagogiques 2nd cycle 2025-2026 [8] | « TERMINALE A » | Aucune | 0 | 0 | Non traitée : A1 et A2 ne sont pas distinguées. |
| Histoire-Géographie | Index officiel 2025-2026 [1] | Seule une progression 6e est référencée | Aucune | 0 | 0 | Non traitée : progression Terminale absente. |
| Informatique / TICE | Progressions 2025-2026 [9] | Le fichier disponible couvre la 6e | Aucune | 0 | 0 | Non traitée : progression Terminale absente. |
| Sciences de la Vie et de la Terre | Progressions 2025-2026 [10] | « Terminale A » | Aucune | 0 | 0 | Non traitée : A1 et A2 ne sont pas distinguées. |

Le dossier de traçabilité [`commande64-sources-recherche.md`](./commande64-sources-recherche.md) conserve les constats et les références de l’examen des PDFs.

## Protection des données et absence de doublons

Le contrôle initial et le contrôle final de Supabase donnent les mêmes compteurs. Aucun `INSERT`, `UPDATE` ou `DELETE` n’a été exécuté dans les tables pédagogiques au cours de cette commande.

| Offre Terminale A1 à protéger | Chapitres | Leçons | Leçons avec contenu | État après contrôle |
|---|---:|---:|---:|---|
| Mathématiques | 1 | 8 | 0 | Inchangée ; hors périmètre. |
| Philosophie | 5 | 12 | 2 | Inchangée ; leçon pilote et données de test préservées. |
| Matière test non publiée | 2 | 1 | 1 | Inchangée ; hors périmètre. |
| Les dix matières listées ci-dessus | 0 chacune | 0 chacune | 0 chacune | Inchangées ; aucun doublon. |

La confirmation « toutes les nouvelles leçons sont brouillon et inactives » est **sans objet** : aucune nouvelle leçon n’a été créée. Par conséquent, aucun contenu nouveau ne peut être visible pour un élève.

## Sécurité et visibilité élève

Les politiques RLS des offres, chapitres et leçons ont été relues. Elles conservent une écriture réservée à `is_edutech_admin()` et une lecture élève qui exige la cible `school_level`/`series` autorisée. Pour les chapitres et leçons, la politique exige également `is_active = true`, une offre publiée et une matière active. Le service mobile applique les mêmes filtres `is_active = true` lors du chargement des chapitres et des leçons.

Ainsi, les structures existantes inactives restent protégées des élèves, et aucun contenu de la commande 6.4 n’a été ajouté ou exposé.

## Validations techniques

| Commande | Résultat |
|---|---|
| `pnpm check` | Réussi, sans erreur TypeScript. |
| `pnpm lint` | Réussi. Avertissement Node informatif sur le type de module ESLint, sans erreur de lint. |
| `pnpm test` | Réussi : **22 tests actifs** validés ; **1 test ignoré**. |
| `npx expo export --platform android` | Réussi ; bundle Android exporté dans `dist`. |

## Condition pour une future structuration

La structure d’une matière pourra être créée lorsque l’un des éléments suivants sera disponible : une progression DPFC explicitement libellée **Terminale A1**, ou une instruction officielle écrite établissant que la progression « Terminale A » concernée s’applique à A1 seule. À défaut, le catalogue reste volontairement sans chapitre ni leçon pour ces matières.

## Références

[1] [DPFC — Progressions du Secondaire 2025-2026](https://dpfc-ci.net/?page_id=5267)  
[2] [DPFC — Allemand, progressions 2025-2026](https://dpfc-ci.net/dpfc/2026/progressions/ALLEMAND%20PROGRESSIONS%20NATIONALES%20ANNEE%20SCOLAIRE%202025%202026.pdf)  
[3] [DPFC — Anglais, progression Terminale A 2025-2026](https://dpfc-ci.net/dpfc/2026/progressions/Anglais%20Progression%20Terminale%20A%202025-2026.pdf)  
[4] [DPFC — Arts plastiques, progressions 2025-2026](https://dpfc-ci.net/dpfc/2026/progressions/ARTS%20P_PROGRESSIONS%20PROGRAMMES%20ACTUELS_2025-2026.pdf)  
[5] [DPFC — Éducation musicale, progressions 2025-2026](https://dpfc-ci.net/dpfc/2026/progressions/EDM-PROGRESSIONS%202025-2026.pdf)  
[6] [DPFC — EPS, progressions 2nd cycle 2025-2026](https://dpfc-ci.net/dpfc/2026/progressions/EPS-PROGRESSION%202nd%20CYCLE%20%202025-2026.pdf)  
[7] [DPFC — Espagnol, progressions 2025-2026](https://dpfc-ci.net/dpfc/2026/progressions/ESPAGNOL-PROGRESSIONS%202025-2026_%20DPFC.pdf)  
[8] [DPFC — Français, progressions pédagogiques 2nd cycle 2025-2026](https://dpfc-ci.net/dpfc/2026/progressions/FRANCAIS_PROGRESSIONS_A%20USAGE%20PEDAGOGIQUE_2025-2026-%202nd%20CYCLE%20DPFC.pdf)  
[9] [DPFC — TICE, progressions 2025-2026](https://dpfc-ci.net/dpfc/2026/progressions/TICE-PROGESSIONS%202025-2026.pdf)  
[10] [DPFC — SVT, progressions 2025-2026](https://dpfc-ci.net/dpfc/2026/progressions/SVT%20PROGRESSIONS%20ANNUELLES%202025%202026%20.pdf)
