# Commande 18 — Architecture de cache et synchronisation

## Décision

EduTech School conservera ses mécanismes existants de session Supabase, de stockage AsyncStorage, de cache spécialisé Bulletin et de notifications. Le cache pédagogique et la file de synchronisation élève seront ajoutés comme une extension typée du stockage hors ligne existant ; aucun second moteur de connexion, aucun stockage concurrent et aucune modification du Mentor IA ne sont prévus.

## Périmètre de cache local

Chaque clé privée est isolée par `userId`, `schoolLevel`, `series` et version de schéma. Les snapshots pédagogiques stockent uniquement les contenus que les politiques de lecture ont déjà autorisé à l’utilisateur connecté : matières, offres, chapitres, leçons, séances actives, catalogues/détails d’exercices et catalogues/détails de quiz. Les snapshots comportent `fetchedAt`, `contentVersion`, `state` (`synced`, `stale`, `pending`, `error`) et une empreinte de contexte. Une donnée provenant d’un autre compte ou d’une autre série ne peut jamais être relue après changement de compte ou de profil.

Les lectures suivent l’ordre suivant : cache compatible d’abord, rafraîchissement distant si Internet est réellement joignable, puis remplacement atomique du snapshot après succès. En cas de réseau absent, seul un cache correspondant au profil courant est présenté. En l’absence de cache, l’interface doit indiquer que la première synchronisation est nécessaire ; elle ne présente aucune donnée fictive.

## Écritures élève et file idempotente

Les opérations locales utilisent une file typée, persistée et isolée par utilisateur. Chaque opération reçoit un identifiant client stable, une clé d’idempotence, une tentative de reprise, une date de création, un état (`pending`, `syncing`, `synced`, `error`, `conflict`) et une erreur éventuelle. Une opération n’est supprimée qu’après réponse serveur confirmée.

Les opérations concernées sont : vue de leçon, complétion de leçon, favoris, soumission d’exercice et soumission de quiz. Les opérations de progression sont fusionnables : une complétion domine une vue, et une vue plus récente ne peut pas annuler une complétion. Les favoris sont dédupliqués par utilisateur, type et contenu. Les tentatives de quiz/exercice restent locales jusqu’à leur synchronisation ; elles ne sont jamais présentées comme corrigées par le serveur avant confirmation.

## Conflits

Le Bulletin conserve sa stratégie spécialisée fondée sur `updated_at`. Pour les contenus pédagogiques, une empreinte de contenu associée à la tentative locale est comparée lors de la synchronisation. Si le contenu distant a changé depuis son cache local, la tentative est conservée localement et marquée `conflict` ou `review_required` ; elle ne doit pas écraser silencieusement une donnée utilisateur ni produire un résultat définitif non vérifiable.

## Reprise

La synchronisation est déclenchée à la connexion effective, au retour de l’application au premier plan et sur demande utilisateur. La détection utilise la joignabilité Internet, non le seul rattachement à un réseau. Une interruption garde l’opération dans la file. La déconnexion volontaire purge les snapshots et files privées du compte, comme le font déjà Bulletin, notifications et Mentor.

## Administration

L’administration ne prétend pas récupérer des données qui ne sont encore présentes que sur le téléphone d’un élève. Les écrans administratifs peuvent uniquement afficher l’état de données déjà reçues par le serveur. Toute action sensible utilise une RPC avec autorisation serveur et confirmation explicite dans l’interface.

## Limites à tester sur appareil réel

La persistance après redémarrage, le mode avion, la reprise réseau, les notifications ciblées et l’isolation RLS entre deux élèves devront être vérifiés avec les comptes et appareils réels autorisés. Aucun résultat de ces tests ne pourra être déduit de la compilation ou des tests unitaires seuls.
