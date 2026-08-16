# Rapport de Synthèse — Commande 10.2 : Grille Terminale C/D, LV2 Facultatives et Bulletin Hors Connexion

## 1. Contexte et Objectifs
La Commande 10.2 complète le module Bulletin d'**EduTech School** en intégrant :
- Les **coefficients officiels de Terminale C et D** (22 coefficients par série), incluant le statut **facultatif** pour les LV2 (Allemand/Espagnol) et la disponibilité de la Conduite dans le Bulletin C/D, sans modifier les 24 coefficients A1/A2 validés précédemment.
- Un **mode hors connexion réel** fondé sur un cache local persistant par élève (AsyncStorage), l'utilisation d'identifiants UUID stables générés localement, une file durable de synchronisation (création, modification, suppression), et une synchronisation automatique au retour réseau ou lors du premier plan (reprise de l'application), dans le strict respect des politiques RLS de Supabase.

---

## 2. Grilles de Coefficients Terminale C et D Intégrées
Les 22 coefficients par série ont été rattachés aux offres réelles Niveau–Série–Matière, avec traçabilité administrative :
- **Terminale C** : Mathématiques (6), Physique-Chimie (6), Français (3), Philosophie (3), Anglais (2), SVT (2), EPS (1), Conduite (1 / optionnelle). LV2 Allemand/Espagnol (2 / facultatives).
- **Terminale D** : SVT (6), Mathématiques (5), Physique-Chimie (5), Français (3), Philosophie (3), Anglais (2), EPS (1), Conduite (1 / optionnelle). LV2 Allemand/Espagnol (2 / facultatives).
- **Préservation** : Les 24 coefficients A1/A2 et l'exclusion de Physique-Chimie pour A1/A2 sont strictement maintenus.

---

## 3. Architecture du Module Bulletin Hors Connexion
1. **Stockage Local Persistant (`bulletin-offline-store.ts`)** :
   - Sauvegarde par élève authentifié (`bulletin_cache_{userId}`).
   - Génération d'identifiants UUID stables via `expo-crypto` pour toute note créée hors connexion.
2. **File de Synchronisation et Reprise (`bulletin-sync-context.tsx`)** :
   - Détection réseau via `@react-native-community/netinfo` et écoute du cycle de vie de l'application (`AppState`).
   - Mutation immédiate en local avec statut **« En attente de synchronisation »**, puis envoi automatique vers Supabase sous RLS dès que le réseau est rétabli.
   - Passage au statut **« Synchronisé »** après succès distant.
3. **Moteur de Calcul Local et RLS** :
   - Calcul des moyennes de matière et des moyennes trimestrielles pondérées calculé directement depuis le cache local, garantissant l'affichage instantané même sans Internet.
   - Respect absolu de RLS : les écritures locales sont envoyées sous la session Supabase authentifiée active (`student_id = auth.uid()`).

---

## 4. Validations Techniques et Réelles
- **TypeScript & Lint** : Compilation stricte et vérification ESLint sans aucune erreur.
- **Tests unitaires (Vitest)** : 40 tests actifs validant le modèle de notes, les coefficients d'évaluation, les coefficients de matière, les grilles A1/A2/C/D, les LV2 facultatives et la file de synchronisation.
- **Export Android** : `npx expo export --platform android` réussi.
- **Contrôles RLS & Réels** : Test transactionnel et validation utilisateur en mode avion réussis (création, modification, synchronisation au retour réseau, suppression et affichage des états locaux).
- **Nettoyage** : Toutes les données de test ont été purgées ; la base est propre et exempte de notes non officielles.
