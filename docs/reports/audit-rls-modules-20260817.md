# Audit RLS des modules Supabase

**Périmètre :** leçons, exercices, quiz, Bulletin, citations et Mentor IA.  
**Méthode :** lecture des tables, privilèges SQL, politiques RLS, fonctions RPC et alertes de sécurité ; aucune donnée pédagogique ou personnelle n’a été créée, modifiée ou supprimée.

| Module | Tables contrôlées | Résultat de l’audit |
|---|---|---|
| Leçons | `lessons`, `chapters` | RLS activée. Seul un administrateur peut écrire ; un élève authentifié ne lit que les contenus actifs, publiés et correspondant à son niveau/série. |
| Exercices | `exercises`, `exercise_questions`, `exercise_attempts`, `exercise_submissions` | Écriture de contenu réservée à l’administration. Les tentatives et soumissions sont liées à `auth.uid()` ; les fonctions de catalogue, démarrage et correction ne sont pas exécutables par `anon`. |
| Quiz | `quizzes`, `quiz_questions`, `quiz_answers`, `quiz_attempts` | Administration réservée au rôle administrateur. Les fonctions de catalogue, démarrage et soumission sont accessibles au seul rôle `authenticated`, jamais à `anon`. |
| Bulletin | `edutech_grades`, `edutech_coefficients`, `edutech_coefficient_audit` | Notes strictement limitées à `student_id = auth.uid()` ou à l’administration. L’insertion et la modification vérifient aussi l’association niveau-série-matière. Les coefficients restent consultables comme données officielles. |
| Citations | `citations`, `citation_scopes`, `citation_themes` | Lecture limitée aux citations actives, validées et associées au niveau/série du profil connecté. Gestion complète réservée à l’administration. |
| Mentor IA | `mentor_conversations`, `mentor_conversation_messages`, `ai_conversations`, `edutech_ai_messages` | Conversations et messages isolés par `user_id = auth.uid()` ; un message doit en outre appartenir à une conversation du même utilisateur. |

## Écart détecté et corrigé

L’audit a détecté trois politiques héritées trop permissives sur des tables legacy qui ne sont plus appelées par le code applicatif : `edutech_exercises_all`, `edutech_quizzes_all` et une lecture libre de `edutech_chapters`. Elles ont été supprimées ou restreintes à l’administration. Aucune donnée n’a été modifiée.

## Conclusion

Les tables activement utilisées par les six modules sont sous RLS. Les privilèges SQL accordés aux rôles ne remplacent pas les filtres RLS ; les politiques vérifiées assurent l’isolation des données élève et les droits d’administration. Les fonctions RPC pédagogiques à privilèges sont non exécutables par le rôle anonyme. Les avertissements Supabase restants concernent les fonctions administratives explicitement protégées par leurs vérifications de rôle internes.
