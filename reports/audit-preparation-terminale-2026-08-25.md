# Audit de préparation — EduTech School

**Périmètre audité :** Terminale A1, A2, C et D.  
**Date :** 25 août 2026.  
**Méthode :** lecture seule du code et du schéma, requêtes `SELECT`/catalogue, contrôles automatisés non destructifs et export Android.  
**Hors périmètre actif :** Première, qui demeure volontairement suspendue.  

> **Conclusion courte.** L’application dispose d’une base fonctionnelle solide pour l’authentification, le filtrage pédagogique, les notifications ciblées, le Mentor connecté, le Bulletin local-first et la compilation Android. Elle **n’est toutefois pas prête à être déclarée entièrement opérationnelle** pour les quatre séries de Terminale : treize leçons actuellement actives sont vides pour l’élève, et les Cours, Exercices et Quiz ne disposent pas d’un cache hors ligne effectif. Aucune correction n’a été appliquée au cours de cet audit.

## 1. Cadre et limites de l’audit

L’audit a couvert 37 écrans Expo Router et 52 modules métier recensés, ainsi que les tables, fonctions et politiques pertinentes du projet Supabase officiel **EduMentor**. Première n’a été ni réactivée, ni modifiée, ni supprimée : ses 56 offres restent non publiées, tandis que ses 138 chapitres et 422 leçons sont conservés.

Le contrôle a volontairement exclu toute écriture dans Supabase, tout changement de code, configuration, RLS, migration, publication ou création de compte. Le seul suivi local modifié est `todo.md`, comme l’impose le suivi de projet ; le présent rapport est un document d’audit. Il ne constitue pas une validation avec de vrais comptes A2/C/D ni sur appareil Android physique.

| Légende | Signification dans ce rapport |
|---|---|
| 🟢 | Contrôle satisfaisant au regard des éléments vérifiés. |
| 🟡 | Fonctionnement partiel ou amélioration nécessaire avant un déploiement à plus grande échelle. |
| 🔴 | Écart bloquant ou susceptible d’empêcher le parcours attendu. |
| ⚪ | Non testable dans ce sandbox ou nécessitant un test manuel avec de vrais utilisateurs/appareils. |

## 2. Résumé exécutif

Le filtrage des contenus repose bien sur les valeurs réelles `profiles.school_level` et `profiles.series`. Les leçons, exercices et quiz sont filtrés côté données pour les élèves et restent administrables par les comptes autorisés. Les contrôles de contenu réalisés dans Terminale ne détectent aucun doublon actif, aucun exercice ou quiz publié sans leçon active, ni aucune évaluation publiée sans question.

Deux faiblesses empêchent toutefois une validation globale. D’une part, des leçons de Français et une leçon de Philosophie Terminale C sont accessibles mais sans contenu lisible par l’élève. D’autre part, contrairement au besoin de consultation après première connexion, les catalogues et tentatives Cours/Exercices/Quiz restent dépendants de requêtes réseau directes. Le Bulletin, les notifications et le Mentor ont des mécanismes locaux plus aboutis, mais nécessitent encore des tests réels hors ligne et avec identités distinctes.

| État global | Évaluation |
|---|---|
| Contenus Terminale actifs | 🔴 Présence de 13 leçons actives sans contenu effectivement accessible. |
| Filtrage par niveau et série | 🟢 Mis en œuvre à partir du profil connecté. |
| Première suspendue | 🟢 Suspension conservée sans rupture statique détectée pour Terminale. |
| Authentification et profil | 🟢 Chaîne session → profil cohérente dans le code, avec états séparés. |
| Cours / Exercices / Quiz hors ligne | 🔴 Cache métier absent ; dépendance réseau directe. |
| Bulletin hors ligne | 🟡 Architecture local-first présente, à compléter par tests d’appareil et correction d’état de synchronisation. |
| Mentor IA | 🟢 Internet explicitement requis pour répondre ; conversation locale disponible. |
| Notifications | 🟢 Cache local, reprise réseau et ciblage RLS étudiés. |
| Administration scolaire | 🟡 Plusieurs écrans sont surtout consultatifs malgré des libellés promettant des actions. |
| RLS et sécurité | 🟡 RLS présente, mais avertissements de sécurité/performance et absence de test par double identité. |
| Compatibilité Android | 🟢 Export Android exécuté avec succès ; test sur téléphone restant manuel. |

## 3. Constats critiques

### 🔴 C-01 — Leçons de Français actives mais sans séance visible par l’élève

| Élément | Constat |
|---|---|
| Module | Cours → lecteur de leçon / séances Français Terminale A1, A2, C et D. |
| Observé | Douze leçons actives à séances disposent d’un contenu parent vide. Les trois leçons concernées par série ont respectivement des groupes de 5, 3 et 6 séances, mais ces séances associées sont inactives. |
| Attendu | Une leçon active doit présenter son contenu parent, ou au moins une séance active avec contenu. |
| Cause probable | Les leçons ont été activées sans activer les `lesson_sessions` associées. Le lecteur élève demande explicitement les séances actives uniquement. |
| Priorité | **P0 — bloquant pédagogique.** |
| Recommandation | Avant toute nouvelle publication, contrôler de façon transactionnelle : leçon active **et** au moins une séance active non vide. Corriger ensuite, sur instruction expresse, les statuts des séances concernées et valider avec un compte réel de chaque série. |

Le lecteur appelle `getLessonSessions(..., { includeInactive: isAdmin })`. Pour un élève, les séances inactives sont donc retirées du résultat ; si le parent n’a pas de contenu, le repli affiché est « Le contenu de cette leçon sera ajouté prochainement ». La structure existe, mais le cours n’est pas consommable dans le parcours élève.

### 🔴 C-02 — Leçon Philosophie Terminale C active sans contenu ni évaluation

| Élément | Constat |
|---|---|
| Module | Philosophie → Terminale C → « Leçon 2 : Progrès et bonheur/ ETUDE D’OEUVRES ». |
| Observé | Leçon active avec contenu parent vide, sans séance, sans exercice et sans quiz. |
| Attendu | Les leçons visibles pour un élève doivent être complètes ou explicitement non publiées/inactives. |
| Cause probable | Activation d’une structure pédagogique avant son remplissage. |
| Priorité | **P0 — bloquant pédagogique.** |
| Recommandation | Désactiver ou compléter la leçon uniquement après validation éditoriale. Ajouter un garde-fou de publication imposant un contenu réel ou une séance active non vide. |

### 🔴 C-03 — Hors ligne non assuré pour Cours, Exercices et Quiz

| Élément | Constat |
|---|---|
| Module | Cours, Exercices, Quiz, tentatives et historiques. |
| Observé | Les services de cours exécutent directement des requêtes Supabase. Les exercices et quiz utilisent exclusivement des RPC distantes, y compris pour le catalogue, le détail, le début et la soumission. Aucun cache métier ou file locale spécifique n’a été trouvé pour ces trois modules. |
| Attendu | Après une première connexion, les contenus déjà chargés doivent rester consultables sans réseau et les réponses doivent être mises en attente pour synchronisation. |
| Cause probable | Le stockage générique hors ligne existe mais n’est pas branché aux écrans/services de ces modules ; il ne fournit pas non plus de résolution générale de conflit/idempotence. |
| Priorité | **P0 si le mode avion fait partie du lancement ; P1 sinon.** |
| Recommandation | Concevoir un cache versionné par utilisateur, niveau, série et contenu ; rendre les lectures local-first ; mettre les tentatives dans une file idempotente avec politiques de conflit ; tester redémarrage et synchronisation sur Android physique. |

> Le fonctionnement hors ligne du Bulletin ne doit pas être extrapolé aux autres modules : il possède un stockage spécialisé distinct.

## 4. Contenus, parcours élève et Première

| Contrôle | Résultat | État |
|---|---|---|
| Doublons de leçons actives dans Terminale | Aucun doublon actif détecté. | 🟢 |
| Exercices/quiz publiés sans leçon active | Aucun cas détecté. | 🟢 |
| Exercices/quiz publiés sans question | Aucun cas détecté. | 🟢 |
| Visibilité par `school_level` et `series` | Les offres sont résolues depuis le profil, puis filtrées par niveau, série, publication, matière et chapitre actifs. | 🟢 |
| Terminale A1/A2/C/D | Périmètre actif conservé. | 🟢 |
| Première | 56 offres non publiées, 138 chapitres et 422 leçons conservés ; aucune réactivation réalisée. | 🟢 |
| Leçons accessibles mais vides | 12 leçons Français à séances + 1 leçon Philosophie C. | 🔴 |
| Navigation cours → matière → chapitre → leçon | Routes et contrôles de retour présents dans le code. | 🟢 |
| Validation avec profils A1/A2/C/D réels | Non réalisable sans comptes réels autorisés pour chaque série. | ⚪ |

Le filtrage pédagogique est cohérent dans son principe : `getCoursesForProfile` exige les deux champs du profil, résout les identifiants de niveau et série, et limite le catalogue aux offres publiées, matières actives et chapitres actifs. Le contrôle de visibilité doit néanmoins être répété avec de vrais comptes A2, C et D avant ouverture générale.

## 5. Authentification, profil, session et Mentor IA

### Résultats satisfaisants

| Domaine | Observé | État |
|---|---|---|
| Restauration de session | Session lue au démarrage, écoute des changements d’état Auth, renouvellement au retour au premier plan sur natif. | 🟢 |
| Persistance de session | `expo-secure-store` sur natif, persistance activée dans le client Supabase. | 🟢 |
| Lecture du profil | Requête `profiles.id = auth.user.id` avec colonnes cohérentes : nom, e-mail, niveau, série, rôle, statut. | 🟢 |
| États Profil | Chargement, profil manquant/en création, erreur avec action Réessayer et affichage normal sont distincts. | 🟢 |
| Modification de profil | RPC dédiée : administrateur sans limite annuelle ; élève avec une modification directe puis demande motivée soumise à validation. | 🟢 |
| Purge à la déconnexion | Caches profil, notifications, Bulletin et Mentor ciblés par identifiant utilisateur. | 🟢 |
| Mentor IA hors réseau | Réponse bloquée explicitement hors connexion ; historique et conversation locale rechargés/sauvegardés. | 🟢 |

### Améliorations nécessaires

| Référence | Module | Observé | Attendu | Cause probable | Priorité | Recommandation |
|---|---|---|---|---|---|---|
| A-01 | Profil | La ligne « Progression » affiche toujours « Aucune activité enregistrée ». | Une valeur réelle ou un état neutre basé sur les données de progression. | Valeur codée en dur dans l’écran Profil. | P2 | Relier la ligne au service de progression ou l’indiquer explicitement comme non disponible. |
| A-02 | Synchronisation générique | Les erreurs sont conservées, mais aucune stratégie générale de déduplication, reprise contrôlée ou résolution de conflit n’est visible. | Reprise fiable et idempotente de toute opération mise en attente. | File générique minimale. | P1 | Définir un contrat par type d’opération : clé d’idempotence, version distante, fusion/rejet et interface de reprise. |

Les tests avec un élève réellement connecté, une expiration de session, une reprise après redémarrage et une demande de seconde modification annuelle restent nécessaires. Aucun faux compte n’a été créé pour les simuler.

## 6. Bulletin, coefficients et synchronisation

Le Bulletin a une architecture distincte et plus robuste que les autres modules hors ligne : snapshot AsyncStorage par utilisateur, file d’opérations, détection de conflit par `updated_at`, reprise au retour réseau et au retour au premier plan. Les notes locales sont écrites avant la synchronisation. La sécurité des notes est également encadrée par des politiques qui limitent l’élève à son propre `student_id`, avec contrôle de l’offre matière correspondant à son niveau et sa série.

| Contrôle | Résultat | État |
|---|---|---|
| Snapshot local par utilisateur | Implémenté. | 🟢 |
| Ajout/édition/suppression de note hors ligne | File locale spécialisée disponible. | 🟢 |
| Conflit de version distante | Détection par `expectedServerUpdatedAt` / `updated_at`, modification locale conservée et marquée en conflit. | 🟢 |
| Première ouverture hors ligne | Message explicite si le cache n’a jamais été initialisé. | 🟡 |
| Sessions trimestrielles recensées | L’agrégat ne remonte aucune ligne de session d’évaluation ; une année scolaire est active. | 🟡 |
| Test réel de calcul, synchronisation et conflit | Non exécuté avec un profil élève et un appareil réel. | ⚪ |

### 🟡 B-01 — État de synchronisation Bulletin possiblement ramené à « En attente » après synchronisation

| Élément | Constat |
|---|---|
| Module | `BulletinSyncProvider` et bandeau de synchronisation du Bulletin. |
| Observé | Après avoir calculé l’état réel de la file, `syncNow` appelle `notifyLocalChange()`, qui force ensuite l’état à `pending`. |
| Attendu | Une file vide après synchronisation doit conserver l’état `synced`. |
| Cause probable | `notifyLocalChange` est utilisé à la fois pour provoquer un rafraîchissement visuel et pour signaler une nouvelle modification locale. |
| Priorité | P1 — statut potentiellement trompeur, sans preuve d’échec de transfert. |
| Recommandation | Séparer l’incrément de révision de la transition vers `pending`, puis ajouter un test de synchronisation réussie avec file vide. |

## 7. Notifications

Le module charge d’abord le cache local, conserve localement les lectures non synchronisées et les envoie au retour réseau. La RLS limite la consultation élève aux notifications actives visant son année, niveau, série ou identifiant, tandis que l’administrateur possède une politique de gestion. L’inventaire présent compte 23 notifications : 1 globale et 22 ciblées `level_series`.

| Contrôle | Résultat | État |
|---|---|---|
| Cache inbox et lectures en attente | Implémentés et purgés à la déconnexion. | 🟢 |
| Reprise réseau / retour premier plan | Implémentés. | 🟢 |
| Ciblage niveau / série | Filtrage logiciel et politique RLS présents. | 🟢 |
| Notification réellement reçue par A1/A2/C/D | Non testable sans comptes réels représentatifs. | ⚪ |
| Push Android réel et permission système | Non testé sur appareil. | ⚪ |

## 8. Administration, navigation et UX

Les routes administratives précédemment signalées comme absentes existent maintenant dans le projet. Le tableau de bord redirige les non-administrateurs vers les onglets et propose les destinations annoncées. Les écrans de demandes de profil/classe possèdent une vraie revue par RPC avec confirmation ; les notifications administratives proposent un ciblage détaillé.

Cependant, plusieurs cartes promettent davantage que leur implémentation visible actuelle.

| Référence | Module | Observé | Attendu | Cause probable | Priorité | Recommandation |
|---|---|---|---|---|---|---|
| AD-01 | Années scolaires | Écran de liste uniquement, alors que le libellé annonce création, activation, clôture et archivage. | Actions administratives cohérentes avec le libellé. | Les RPC existent et vérifient le rôle admin, mais ne sont pas exposées par cet écran. | P1 | Ajouter les actions et confirmations nécessaires, ou réduire le libellé à « Consultation des années ». |
| AD-02 | Utilisateurs | Recherche et affichage des 50 premiers profils seulement ; aucun bouton rôle/statut/désactivation. | Gestion opérationnelle annoncée des comptes. | Écran minimal, alors que la fonction sécurisée `admin_set_student_account_status` existe. | P1 | Ajouter pagination, actions confirmées et états d’erreur ; préserver les garde-fous anti-auto-désactivation. |
| AD-03 | Décisions de passage | Consultation seule ; pas de filtre ni de prononcé/validation dans l’interface. | Enregistrer et suivre les décisions de passage. | La fonction `admin_record_promotion_decision` existe, mais l’écran ne l’utilise pas. | P1 | Exposer un formulaire contrôlé par année, élève et décision, avec récapitulatif avant enregistrement. |
| AD-04 | Export des décisions | Le bouton affiche une alerte de succès sans créer, partager ou télécharger de CSV/JSON. | Fichier réellement exportable. | Action d’interface simulée par une alerte. | P1 | Implémenter génération, stockage temporaire et partage/téléchargement ; ajouter un test vérifiant le contenu produit. |
| AD-05 | Journal d’audit | Vue consultative limitée, sans filtre, pagination, détail de ressource ni export. | Traçabilité exploitable à mesure que les données augmentent. | Premier niveau de visualisation seulement. | P2 | Ajouter filtres date/action/auteur, pagination et détail non modifiable. |

> Les fonctions sensibles examinées (`admin_*`, publication de contenu, modification de profil) déclarent elles-mêmes `is_edutech_admin()` ou une identité `auth.uid()` appropriée. Elles sont donc protégées dans leur logique interne, mais leur exposition `SECURITY DEFINER` justifie une revue de privilèges avant montée en charge.

## 9. RLS, sécurité et performance

Les 11 tables ciblées lors de l’audit ont RLS activée et au moins une politique. Les politiques de `profiles`, `edutech_grades`, progression, tentatives, notifications, leçons et contenus ont été lues. Elles expriment notamment une lecture du propre profil, la séparation des tentatives par utilisateur et la visibilité pédagogique par niveau/série. Les fonctions administratives échantillonnées contrôlent le rôle admin en interne.

Cela ne remplace pas un test par identités distinctes. Le sandbox ne possède pas quatre comptes élèves réels à utiliser, et l’audit interdit d’en créer ou modifier pour simulation.

| Contrôle sécurité | Résultat | État |
|---|---|---|
| RLS active sur les tables contrôlées | Oui. | 🟢 |
| Profil : lecture propre / lecture admin | Politique statique conforme au modèle attendu. | 🟢 |
| Notes : accès propre / admin et cohérence offre-profil | Politique statique présente. | 🟢 |
| Notifications : accès élève ciblé / gestion admin | Politique statique présente. | 🟢 |
| Fonctions sensibles échantillonnées | Contrôles `is_edutech_admin()` ou `auth.uid()` présents dans les définitions lues. | 🟢 |
| Test d’un élève tentant d’accéder à un autre élève | Non exécuté avec deux sessions authentifiées. | ⚪ |
| Test d’un non-admin appelant directement les RPC admin | Non exécuté ; aucun compte fictif autorisé. | ⚪ |

### Avertissements à traiter après validation de la phase corrective

L’analyse de sécurité Supabase signale de nombreuses fonctions `SECURITY DEFINER` exécutables par le rôle `authenticated`. L’échantillon de fonctions administratives lu contient des contrôles internes d’administrateur ; l’avertissement est donc à **qualifier**, pas à interpréter automatiquement comme un contournement confirmé. La recommandation reste de limiter explicitement `EXECUTE` lorsque cela est compatible avec les appels nécessaires, puis de retester avec un élève réel non administrateur.

L’analyse de performance signale 47 clés étrangères sans index couvrant, 48 cas `auth_rls_initplan`, 94 politiques permissives multiples, 39 index non utilisés et 3 index dupliqués. Ces avis sont principalement des sujets de montée en charge et de maintenance ; ils ne démontrent pas à eux seuls un ralentissement utilisateur dans ce contrôle. Les index concernant les offres pédagogiques, les notes, les notifications et les tentatives devront être priorisés à partir de mesures réelles de trafic.

## 10. Tests techniques exécutés

| Vérification | Résultat |
|---|---|
| TypeScript (`pnpm check`) | Réussi pendant l’audit. |
| Lint (`pnpm lint`) | Réussi pendant l’audit ; seul l’avertissement Node préexistant `MODULE_TYPELESS_PACKAGE_JSON` a été observé. |
| Suite Vitest actuelle | **94 fichiers réussis, 1 ignoré ; 372 tests réussis, 1 ignoré.** |
| Export Android | Réussi : bundle Android généré par `npx expo export --platform android`. |
| `git diff --check` | Réussi. |
| État Git applicatif | Aucune modification fonctionnelle détectée ; `todo.md` est la seule modification de suivi locale. |
| Test Android physique / mode avion / redémarrage téléphone | Non exécuté. |

Le sandbox a signalé une pression mémoire élevée pendant les contrôles ; l’export Android a néanmoins abouti. Une terminaison d’un watcher TypeScript avec code 143 apparaît dans les logs, mais l’analyse TypeScript a ensuite rapporté zéro erreur et aucun échec de compilation du produit n’a été constaté.

## 11. Scénarios manuels obligatoires avant déclaration de disponibilité

| Scénario | Série / appareil | Statut |
|---|---|---|
| Connexion, consultation Cours, Exercices, Quiz et retour | Terminale A1 | ⚪ À reconfirmer après correction des contenus vides. |
| Même parcours avec filtrage des matières | Terminale A2 | ⚪ Compte réel nécessaire. |
| Même parcours avec filtrage des matières | Terminale C | ⚪ Compte réel nécessaire. |
| Même parcours avec filtrage des matières | Terminale D | ⚪ Compte réel nécessaire. |
| Mode avion après première synchronisation : Cours/Exercices/Quiz | Android réel | ⚪ Non réalisable actuellement ; cache à construire. |
| Mode avion : Bulletin et notes locales | Android réel | ⚪ À tester, incluant reprise et conflit. |
| Redémarrage de l’application avec session persistée | Android réel | ⚪ À tester. |
| Notification ciblée par série et marquage lu hors ligne | Compte réel de la cible | ⚪ À tester. |
| RLS inter-élèves et RPC admin refusées à un élève | Deux comptes réels distincts | ⚪ À tester sans créer de données fictives. |
| Réception push Android | Appareil autorisé aux notifications | ⚪ À tester. |

## 12. Plan de priorisation recommandé — à exécuter uniquement sur instruction

| Priorité | Actions à décider ultérieurement | Raisons |
|---|---|---|
| P0 | Rendre les 12 leçons Français à séances visibles, puis traiter la leçon Philosophie C vide. | Des élèves peuvent ouvrir des leçons actives sans contenu. |
| P0 | Concevoir et implémenter le vrai cache hors ligne Cours/Exercices/Quiz. | Exigence de disponibilité sans réseau non satisfaite. |
| P1 | Corriger l’état Bulletin après synchronisation et mettre en place les sessions trimestrielles nécessaires. | Fiabilité du statut et préparation des évaluations. |
| P1 | Achever les actions d’administration promises : années, utilisateurs, décisions, export réel. | Éviter des parcours administratifs incomplets ou trompeurs. |
| P1 | Revue de privilèges `SECURITY DEFINER`, politiques permissives et index prioritaires. | Réduire le risque et préparer la montée en charge. |
| P2 | Connecter la progression affichée dans Profil aux données réelles ; enrichir le journal d’audit. | Cohérence UX et supervision. |
| P2 | Exécuter la matrice de tests manuels A1/A2/C/D/Android. | Transformer les validations statiques en preuve de parcours réel. |

## 13. Preuves techniques principales

| Domaine | Sources de contrôle |
|---|---|
| Filtrage Cours | `lib/courses/course-service.ts`, notamment la résolution niveau/série et les filtres publication/activité. |
| Lecteur et séances | `app/course/lesson/[lessonId].tsx` ; `lib/courses/lesson-session-service.ts`. |
| Auth et profil | `lib/auth/supabase-auth-provider.tsx` ; `lib/supabase/client.ts` ; `app/(tabs)/profile.tsx`. |
| Offline générique | `lib/offline/offline-storage-service.ts` ; `lib/offline/sync-manager.ts` ; `lib/offline/user-cache-lifecycle.ts`. |
| Bulletin | `app/bulletin.tsx` ; `lib/bulletin/bulletin-sync-context.tsx` ; `lib/bulletin/bulletin-offline-store.ts`. |
| Exercices et Quiz | `lib/exercises/exercise-service.ts` ; `lib/quizzes/quiz-service.ts`. |
| Mentor | `app/mentor.tsx` ; `lib/mentor/mentor-history-service.ts`. |
| Notifications | `lib/notifications/notification-service.ts` ; `lib/notifications/notification-sync-context.tsx`. |
| Administration | `app/administration.tsx`, `app/administration/school-years.tsx`, `users.tsx`, `decisions.tsx`, `decision-export.tsx`, `class-requests.tsx`. |
| RLS et fonctions | Politiques `pg_policies`, définitions `pg_get_functiondef`, conseiller sécurité/performance Supabase, tous interrogés en lecture seule. |

---

## Décision d’audit

**Aucune correction, migration, publication, réactivation de Première, modification RLS ou configuration n’a été appliquée.** Les constats P0 doivent être traités et vérifiés avec des comptes et appareils réels avant de considérer EduTech School comme prête pour un usage élève sans réserve.

Le travail s’arrête ici, conformément au périmètre demandé.
