# Commande 12 — Décisions d’architecture

## Citations mutualisées

Le catalogue repose sur une entrée **unique** par citation dans `citations`. Chaque entrée est reliée à une seule matière existante, à plusieurs thèmes textuels et à des portées indépendantes par niveau. Une portée associe une citation à un niveau réel (`Première` ou `Terminale`) et, lorsque nécessaire, à une série réelle ; une série nulle signifie que la citation concerne toutes les séries de ce niveau. La règle RLS convertit les identifiants de portée vers les valeurs `school_level` et `series` réelles du profil, déjà utilisées par l’application : elle ne dépend donc pas de colonnes d’identifiants absentes des profils actuels. Cette structure évite toute duplication de texte par niveau ou série.

Seules les citations à la fois `is_active = true` et `is_validated = true` sont consultables par les élèves. L’écriture des citations, de leurs thèmes et de leurs portées est réservée à `is_edutech_admin()`, comme pour les contenus pédagogiques déjà validés. Les favoris réutilisent `edutech_favorites` avec `content_type = 'citation'` et restent soumis à sa politique d’isolement `user_id = auth.uid()`.

## Recherche et contenu initial

La recherche est normalisée côté client par suppression des accents et mise en minuscules. Elle couvre le texte, l’auteur, la matière, l’explication, les thèmes et les mots-clés. Le premier corpus ne contient que des citations directement vérifiées et documentées dans `commande12-citations-sources.md` ; aucune citation ne sera déduite, reformulée comme verbatim ni attribuée sur la seule base d’un site d’agrégation.

## Historique du Mentor

L’historique crée `mentor_conversations` et `mentor_conversation_messages`, tous deux rattachés au profil authentifié. Les politiques RLS exigent `user_id = auth.uid()` ; les messages exigent en plus que leur conversation appartienne au même utilisateur. Le titre provient du premier message, tronqué pour rester lisible. Les conversations sont disponibles localement hors connexion lorsque déjà chargées ; une nouvelle réponse IA exige toujours Internet.

Les images et PDF du Mentor restent **éphémères** : ils servent à la requête IA puis sont supprimés du cache mobile et ne sont pas ajoutés aux tables d’historique. Le fil conserve seulement les messages textuels et, si utile, le libellé de la pièce jointe dans le message de l’élève. Cette décision respecte la confidentialité tout en permettant de reprendre une conversation ; si le contexte visuel est à nouveau nécessaire, l’élève doit joindre le document de nouveau.

## Modèle IA et indépendance

Le routeur `POST /api/mentor/message` et son intégration LLM native Manus ne sont pas modifiés. Les nouvelles fonctionnalités n’écrivent jamais dans Bulletin, Quiz, Exercices, Cours ou progression.
