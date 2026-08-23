import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const migrationPath = resolve(root, "supabase/migrations/20260823_computer_science_terminal_digital_security_interactive_drafts.sql");
const payloadPath = resolve(root, "supabase/migrations/20260823_computer_science_terminal_digital_security_interactive_drafts.apply.json");

const offerings = [
  "0beafff1-63db-42c9-99a2-8ef6da799f19",
  "7680fb4a-c9d4-41df-92f3-a91effda4944",
  "7695b4cf-0524-4de4-af91-f8d79eed2b0a",
  "f9c030a4-8b30-4657-b7bb-d81e4e500635",
];
const chapterTitle = "Sécurité numérique : protéger, vérifier et réagir";

const sqlText = (value) => {
  const tag = "$digital_security$";
  if (value.includes(tag)) throw new Error("Délimiteur SQL présent dans un contenu.");
  return `${tag}${value}${tag}`;
};
const jsonArray = (items) => `jsonb_build_array(${items.map(sqlText).join(",")})`;

const lessons = [
  {
    title: "Protéger ses comptes et ses appareils",
    description: "Sécurité numérique d’initiation : phrases secrètes, protection d’accès, mises à jour, verrouillage, sauvegarde et décisions prudentes.",
    content: `# Sécurité numérique — Leçon 1 : Protéger ses comptes et ses appareils

> **Statut pédagogique :** cette leçon fait partie d’un parcours complémentaire d’initiation créé pour EduTech School. Elle ne se présente pas comme un programme officiel. Elle propose des gestes de protection généraux ; elle ne remplace pas les consignes de l’établissement, d’un responsable légal ou d’un service concerné.

## Objectifs de la leçon

À la fin de cette leçon, tu dois pouvoir protéger un accès sans communiquer de secret, expliquer l’intérêt d’une phrase secrète longue et unique, reconnaître le rôle d’une deuxième vérification, choisir un canal fiable pour les mises à jour et organiser une réaction raisonnable lorsqu’un appareil est perdu, partagé ou présente un comportement inattendu.

---

## 1. Un compte est une porte : l’accès doit rester personnel

Un compte de messagerie, d’école, de réseau social ou de stockage contient souvent des informations utiles : échanges, documents, photos, contacts ou liens de récupération. Le mot de passe, la phrase secrète et les codes de validation ne sont donc pas de simples formalités. Ils servent à prouver qu’une personne est autorisée à accéder au compte.

| Notion | Sens dans cette leçon | Décision responsable |
|---|---|---|
| **Phrase secrète** | Suite longue de mots ou de caractères utilisée pour protéger un accès. | Choisir une phrase personnelle et difficile à deviner ; ne pas la communiquer. |
| **Mot de passe unique** | Secret utilisé pour un seul compte important. | Éviter de réutiliser le même secret pour la messagerie, l’école et les réseaux sociaux. |
| **Deuxième vérification** | Contrôle supplémentaire après le mot de passe, lorsqu’un service le propose. | L’activer si l’on comprend le service et conserver ses codes de récupération en lieu sûr. |
| **Code de validation** | Code temporaire envoyé pour confirmer une connexion ou une action. | Ne jamais le donner à quelqu’un, même à une personne qui se présente comme un support technique. |

> **À retenir :** aucun enseignant, camarade, ami ni service sérieux n’a besoin de connaître ton mot de passe. Un code de validation confirme une action : le partager peut permettre à une autre personne de prendre le contrôle de ton compte.

### Une phrase secrète : raisonner plutôt que chercher une formule magique

Il n’existe pas une phrase secrète universelle à copier. L’objectif est de créer une phrase **longue**, **personnelle**, **non évidente** et différente des informations visibles sur un profil. Une date de naissance, un prénom seul, le nom de l’établissement ou une suite comme « 123456 » sont faciles à deviner. Une phrase secrète ne doit jamais apparaître dans un exemple de cours, une photo, une discussion de groupe ou un document partagé.

> **Bonne habitude :** si tu penses qu’un secret a été vu ou partagé par erreur, ne cherche pas à identifier qui l’a lu. Change-le depuis le site ou l’application officielle, puis demande de l’aide à un adulte ou à l’établissement si le compte scolaire est concerné.

---

## 2. Mettre à jour, verrouiller et sauvegarder

La sécurité n’est pas seulement une affaire de mots de passe. Un appareil contient des applications et un système qui doivent être maintenus à jour. Les mises à jour peuvent corriger des défauts et améliorer la stabilité. Il faut cependant les obtenir par les réglages de l’appareil, le magasin officiel ou le site confirmé de l’éditeur ; un lien reçu dans un message inattendu n’est pas automatiquement fiable.

| Geste | Pourquoi il est utile | Limite à respecter |
|---|---|---|
| **Verrouiller l’appareil** | Réduit le risque d’accès immédiat lorsqu’il est posé, prêté ou perdu. | Ne pas montrer son code de déverrouillage à d’autres personnes. |
| **Mettre à jour** | Aide à corriger des problèmes et à garder le système compatible. | Vérifier que la mise à jour vient du canal officiel. |
| **Sauvegarder un travail** | Limite la perte d’un devoir à cause d’une panne, d’une erreur ou d’un oubli. | Ne pas stocker publiquement un document qui contient des données privées. |
| **Séparer les comptes** | Facilite l’organisation et limite les accès inutiles sur un appareil partagé. | Fermer sa session après usage sur un appareil qui n’est pas le sien. |

### Méthode « Arrêter, contrôler, protéger »

Lorsqu’un appareil affiche une alerte inhabituelle, demande un mot de passe sans raison claire ou se comporte de manière surprenante, évite d’agir sous la pression. Premièrement, **arrête-toi** : ne clique pas au hasard et ne communique aucune information. Deuxièmement, **contrôle** : relis le message, vérifie le nom de l’application et utilise les réglages ou le canal habituel. Enfin, **protège** : verrouille l’appareil, préviens une personne de confiance et demande un accompagnement adapté.

> **Important :** cette leçon n’explique pas comment contourner une protection ni comment examiner techniquement un appareil. En cas de doute, l’action la plus sûre consiste à utiliser l’aide officielle et à demander conseil.

---

## 3. Mise en situation interactive — Le code que l’on te demande

**Situation fictive.** Yao prépare un exposé. Un camarade lui écrit : « Je dois vérifier ton document, envoie-moi le code que tu viens de recevoir par message. » Quelques secondes plus tôt, Yao a effectivement reçu un code de validation pour son compte scolaire.

| Choix possible | Analyse |
|---|---|
| Envoyer le code parce que le camarade connaît le sujet de l’exposé. | Ce n’est pas sûr : connaître le sujet ne donne pas le droit de confirmer une connexion. |
| Ignorer le message, conserver le code pour soi et vérifier l’activité du compte par le canal officiel. | C’est le bon réflexe : un code de validation reste personnel. |
| Publier le code dans le groupe afin que chacun puisse aider. | Cela augmente le risque de perte de contrôle du compte. |

> **Décision attendue :** Yao ne partage pas le code. S’il est inquiet, il ouvre lui-même le service habituel, vérifie ses notifications et demande de l’aide à l’établissement ou à un adulte de confiance. Il ne répond pas en envoyant une capture contenant le code.

### Défi de méthode

Transforme cette décision en consignes précises : 1) identifier l’information sensible ; 2) ne pas la transmettre ; 3) vérifier le compte depuis un chemin connu ; 4) demander de l’aide si un signe inhabituel persiste. Cette suite d’étapes est un raisonnement algorithmique appliqué à la sécurité.

---

## 4. Synthèse et auto-évaluation

> **Je sais faire si je peux :** expliquer pourquoi un code de validation reste privé ; citer plusieurs gestes de protection d’un appareil ; distinguer une mise à jour officielle d’un lien inattendu ; décrire une réaction calme et vérifiable lorsqu’une demande semble anormale.

| Vocabulaire essentiel | Définition courte |
|---|---|
| **Authentification** | Vérification de l’identité avant l’accès à un compte. |
| **Sauvegarde** | Copie de sécurité d’un travail ou d’une donnée importante. |
| **Session** | Période pendant laquelle un compte reste ouvert sur un appareil ou un navigateur. |
| **Canal officiel** | Réglage, site ou application confirmés par le service concerné. |
| **Information sensible** | Donnée dont le partage non autorisé peut créer un risque pour une personne ou un compte. |

> **Trace de conception :** les repères de protection — mots de passe longs et uniques, authentification supplémentaire lorsqu’elle est disponible, mises à jour depuis des canaux fiables — sont adaptés de recommandations générales de sensibilisation de CISA. Cette leçon les reformule pour un contexte scolaire et ne fournit aucune procédure d’intrusion.`,
    scenarioRows: [
      ["Un code de validation arrive sur le téléphone de Lila pendant qu’un camarade le lui demande. Quelle décision est la plus sûre ?", ["Ne pas partager le code et vérifier le compte par le canal habituel", "Envoyer le code si le camarade connaît le devoir", "Publier le code dans le groupe"], ["Ne pas partager le code et vérifier le compte par le canal habituel"], "Un code de validation confirme un accès ou une action. Il reste personnel, quelle que soit la personne qui le demande."],
      ["Une fenêtre inattendue propose une mise à jour avec un lien inconnu. Que faut-il faire en premier ?", ["S’arrêter puis vérifier l’existence de la mise à jour dans les réglages ou le canal officiel", "Cliquer vite afin de ne pas perdre le message", "Saisir son mot de passe dans la fenêtre"], ["S’arrêter puis vérifier l’existence de la mise à jour dans les réglages ou le canal officiel"], "Une mise à jour doit être recherchée dans un environnement reconnu, pas installée sous la pression d’une alerte inattendue."],
      ["Après avoir utilisé un appareil partagé pour consulter un document, quel geste est approprié ?", ["Fermer sa session et vérifier qu’aucun compte personnel ne reste ouvert", "Laisser la session ouverte pour aller plus vite demain", "Écrire sa phrase secrète à côté de l’écran"], ["Fermer sa session et vérifier qu’aucun compte personnel ne reste ouvert"], "La fermeture de session limite les accès non souhaités après le départ de l’utilisateur."],
      ["Pourquoi sauvegarder un devoir avant sa remise ?", ["Pour réduire le risque de perdre le travail après une erreur ou une panne", "Pour rendre le fichier visible à tout le monde", "Pour remplacer la vérification du document"], ["Pour réduire le risque de perdre le travail après une erreur ou une panne"], "Une sauvegarde ne remplace ni l’organisation ni le contrôle du bon fichier, mais elle limite les conséquences d’un incident."],
    ],
    methodRows: [
      ["Quelle description correspond à une phrase secrète plus prudente ?", ["Une phrase longue, personnelle et non réutilisée pour les comptes importants", "Un prénom seul suivi de 123", "Le nom de l’établissement comme unique mot de passe"], ["Une phrase longue, personnelle et non réutilisée pour les comptes importants"], "Une phrase longue et unique réduit le risque qu’un secret facile ou réutilisé ouvre plusieurs comptes."],
      ["Quel élément ne doit jamais apparaître dans une capture envoyée pour demander de l’aide ?", ["Un code de validation ou un mot de passe", "Le titre d’un exposé", "Le nom d’un dossier de révision"], ["Un code de validation ou un mot de passe"], "L’aide peut être demandée sans exposer une information qui permet l’accès à un compte."],
      ["Que signifie utiliser un canal officiel pour une mise à jour ?", ["Passer par les réglages, le magasin officiel ou le site confirmé de l’éditeur", "Suivre tout lien reçu dans une discussion", "Installer une application envoyée par un inconnu"], ["Passer par les réglages, le magasin officiel ou le site confirmé de l’éditeur"], "Un canal officiel permet de vérifier l’origine de l’application ou de la mise à jour."],
      ["Si un message lié à un compte crée une inquiétude, quel ordre est pertinent ?", ["S’arrêter, contrôler par le canal habituel, puis demander de l’aide si nécessaire", "Répondre avec toutes les informations demandées", "Essayer plusieurs mots de passe au hasard"], ["S’arrêter, contrôler par le canal habituel, puis demander de l’aide si nécessaire"], "Agir calmement évite les décisions prises sous pression et aide à conserver des éléments utiles pour une vérification."],
    ],
    quizRows: [
      ["Pourquoi un code de validation doit-il rester privé ?", "Il peut confirmer une connexion ou une action sur un compte.", [["Parce qu’il peut autoriser une action sur le compte", true], ["Parce qu’il sert seulement à décorer un message", false], ["Parce qu’il remplace un fichier de cours", false]]],
      ["Quel geste aide à protéger un appareil partagé ?", "Fermer sa session après utilisation limite les accès non souhaités.", [["Fermer sa session après usage", true], ["Laisser son compte ouvert", false], ["Afficher son code de verrouillage", false]]],
      ["Où vérifier de préférence une mise à jour ?", "La vérification passe par les réglages, le magasin officiel ou le site confirmé de l’éditeur.", [["Dans le canal officiel du service", true], ["Dans un lien inattendu", false], ["Dans une capture non vérifiée", false]]],
      ["Quel est le rôle d’une sauvegarde ?", "Une sauvegarde conserve une copie qui peut limiter les pertes en cas d’erreur ou de panne.", [["Limiter la perte d’un travail", true], ["Partager automatiquement les données privées", false], ["Donner son compte à un tiers", false]]],
    ],
  },
  {
    title: "Repérer une tentative d’hameçonnage et vérifier avant d’agir",
    description: "Sécurité numérique d’initiation : messages suspects, demandes urgentes, vérification par un chemin connu, signalement et protection des informations.",
    content: `# Sécurité numérique — Leçon 2 : Repérer une tentative d’hameçonnage et vérifier avant d’agir

> **Statut pédagogique :** cette leçon appartient à un parcours complémentaire non officiel. Les exemples sont fictifs et ont un objectif de prévention. Ils n’indiquent ni comment fabriquer une fraude, ni comment déjouer un contrôle de sécurité.

## Objectifs de la leçon

Tu apprendras à reconnaître les signaux qui invitent à la prudence devant un message, une page ou un lien inattendu. Tu sauras distinguer « vérifier » de « répondre sous pression », choisir un chemin connu pour contrôler une information et demander de l’aide sans diffuser un message suspect.

---

## 1. Comprendre l’hameçonnage sans entrer dans les détails dangereux

L’**hameçonnage** est une tentative de tromper une personne afin de lui faire cliquer, divulguer une information sensible ou ouvrir une ressource qui n’est pas fiable. Un message peut imiter le ton d’un établissement, d’un proche, d’un service de livraison, d’un réseau social ou d’une application. Son apparence ne suffit donc pas à prouver qu’il est authentique.

| Signal à observer | Pourquoi il invite à la prudence | Réaction adaptée |
|---|---|---|
| **Urgence excessive** | « Immédiatement », « dernière chance » ou une menace de blocage cherchent parfois à empêcher la réflexion. | S’arrêter et vérifier calmement par un chemin connu. |
| **Demande de secret** | Un mot de passe, un code de validation ou une pièce privée ne doivent pas être demandés dans une discussion. | Ne rien envoyer ; demander un avis si nécessaire. |
| **Expéditeur inattendu** | Un nom visible peut ressembler à un nom connu sans être le bon compte. | Contrôler le contact et ne pas se fier au nom seul. |
| **Lien ou pièce jointe non attendue** | Une ressource inconnue peut conduire vers une page trompeuse ou inadaptée. | Ne pas l’ouvrir ; aller soi-même vers le site ou l’application habituels. |
| **Demande inhabituelle** | Même un message provenant d’un proche peut être étrange si la demande ne lui ressemble pas. | Vérifier par un autre moyen de communication habituel. |

> **Idée essentielle :** un message suspect n’est pas nécessairement faux, mais il doit être vérifié avant toute action. La prudence ne consiste pas à accuser une personne ; elle consiste à protéger les informations et à confirmer le contexte.

---

## 2. La méthode « Pause, observe, vérifie, oriente »

Face à un message qui surprend, on peut suivre quatre étapes simples. Cette méthode s’applique à une messagerie, un réseau social, un SMS ou un service en ligne, sans avoir besoin de connaître une technique informatique complexe.

1. **Pause.** Ne clique pas, ne réponds pas avec une information sensible et ne transfère pas immédiatement le message.
2. **Observe.** Lis le nom du service, l’expéditeur, la demande, le ton employé et le contexte. Demande-toi : « Est-ce attendu ? Est-ce nécessaire ? »
3. **Vérifie.** Ouvre toi-même le site, l’application ou le contact déjà connu. Ne passe pas par le lien du message. Pour une demande d’un proche, utilise un moyen habituel pour confirmer.
4. **Oriente.** Si le doute persiste, signale le message dans le service lorsque c’est possible ou montre-le à un adulte de confiance, à l’enseignant ou à l’établissement. Ne le diffuse pas dans un groupe en demandant à tout le monde de cliquer.

| Ce qu’il faut éviter | Pourquoi | Alternative plus sûre |
|---|---|---|
| Cliquer pour « voir si c’est vrai ». | L’action peut être irréversible ou diriger vers une page trompeuse. | Vérifier depuis l’application ou le site habituel. |
| Répondre avec un mot de passe ou un code. | Ces informations peuvent ouvrir un accès personnel. | Ne rien transmettre et utiliser le support officiel. |
| Partager le message suspect dans un grand groupe. | D’autres personnes risquent d’être exposées au même lien. | Signaler à la personne ou au service approprié. |

---

## 3. Mise en situation interactive — L’alerte de remise de devoir

**Situation fictive.** Mariam reçoit une notification intitulée « Votre remise de devoir est refusée ». Le message affirme que son compte sera bloqué dans dix minutes et propose un bouton « Corriger maintenant ». Mariam n’attendait aucune notification de ce type et le devoir a déjà été remis la veille.

| Étape de décision | Question à se poser | Décision responsable |
|---|---|---|
| Pause | Suis-je obligée d’agir dans la minute ? | Non. Une menace d’urgence demande d’abord une vérification. |
| Observe | La demande est-elle cohérente avec la situation ? | Elle est surprenante, car la remise est déjà faite. |
| Vérifie | Quel chemin connu puis-je utiliser ? | Ouvrir directement l’espace scolaire habituel ou demander à l’enseignant par le canal normal. |
| Oriente | Que faire si le message paraît toujours anormal ? | Le signaler au service ou à l’établissement, sans propager le bouton. |

> **Décision attendue :** Mariam ne sélectionne pas le bouton. Elle consulte son espace scolaire par son adresse habituelle ou son application connue. Si tout est normal, elle conserve le message comme élément de contexte et demande conseil. Elle ne transmet ni capture contenant des informations sensibles ni code de connexion.

### Un titre convaincant n’est pas une preuve

Certains messages utilisent des formulations très officielles, des fautes, des images ou au contraire une présentation soignée. Aucun de ces détails, pris isolément, ne suffit à prouver l’authenticité. Il faut croiser le contexte, la demande, l’expéditeur et le canal utilisé. Cette même logique aide à vérifier des informations, des concours, des fausses offres ou des contenus viraux.

---

## 4. Après un clic ou un partage involontaire : rester calme et agir correctement

Une erreur peut arriver. La bonne réaction n’est pas de supprimer précipitamment toutes les traces ni de se blâmer. Il faut arrêter l’action, éviter de communiquer davantage d’informations, demander de l’aide et suivre les indications du service officiel ou de l’établissement. Si une phrase secrète ou un code a été transmis, il faut le signaler sans attendre à la personne responsable du compte afin que les mesures adaptées soient prises.

> **Rappel :** ne cherche pas à résoudre seul un problème complexe en testant des liens, des comptes ou des mots de passe. Les outils d’assistance officiels et les adultes de confiance existent précisément pour accompagner ce type de situation.

---

## 5. Synthèse active

> **Je sais faire si je peux :** citer plusieurs signaux de prudence ; décrire les quatre étapes Pause, observe, vérifie, oriente ; choisir un canal connu pour contrôler une notification ; demander de l’aide sans partager d’information sensible.

| Vocabulaire essentiel | Définition courte |
|---|---|
| **Hameçonnage** | Tentative de tromper une personne pour obtenir une action ou une information sensible. |
| **Expéditeur** | Personne, compte ou service qui paraît être à l’origine d’un message. |
| **Lien** | Élément qui ouvre une autre page ou ressource ; il doit être utilisé avec discernement. |
| **Signalement** | Action qui consiste à informer un service, un adulte ou une institution d’un contenu préoccupant. |
| **Canal habituel** | Moyen déjà connu pour joindre un service, une personne ou un établissement. |

> **Trace de conception :** le chapitre reprend la prudence face aux messages inattendus, la vérification avant clic et le signalement approprié, adaptés des conseils généraux de CISA.`,
    scenarioRows: [
      ["Une notification inattendue annonce un blocage dans dix minutes et propose un bouton. Quelle première action est la plus responsable ?", ["Ne pas cliquer et vérifier le compte depuis le service habituel", "Cliquer immédiatement pour éviter le blocage", "Transférer le bouton à toute la classe"], ["Ne pas cliquer et vérifier le compte depuis le service habituel"], "L’urgence ne supprime pas la nécessité de vérifier. Le canal connu évite de dépendre du lien contenu dans le message."],
      ["Un message demande un mot de passe pour « confirmer » une remise de devoir. Que faut-il faire ?", ["Ne pas répondre avec le secret et consulter le support ou l’espace scolaire habituel", "Envoyer le mot de passe car le message semble officiel", "Écrire le mot de passe dans le groupe"], ["Ne pas répondre avec le secret et consulter le support ou l’espace scolaire habituel"], "Une demande de secret est un signal de prudence. La vérification doit passer par un canal distinct et connu."],
      ["Une demande étrange semble provenir d’un proche. Quelle vérification est appropriée ?", ["Le contacter par un moyen habituel différent pour confirmer la demande", "Obéir sans vérifier car le nom est connu", "Tester le lien sur plusieurs appareils"], ["Le contacter par un moyen habituel différent pour confirmer la demande"], "Un compte connu peut être utilisé de manière inhabituelle. Un autre canal aide à confirmer le contexte sans prendre de risque."],
      ["Pourquoi ne faut-il pas redistribuer un lien suspect dans un groupe ?", ["Parce que cela peut exposer d’autres personnes au même risque", "Parce qu’un message suspect est toujours sans importance", "Parce qu’il faut garder tous les liens secrets"], ["Parce que cela peut exposer d’autres personnes au même risque"], "Un signalement ciblé est plus utile qu’une diffusion large qui pourrait encourager d’autres clics."],
    ],
    methodRows: [
      ["Quelle étape appartient à la méthode Pause, observe, vérifie, oriente ?", ["Ouvrir soi-même le service habituel pour contrôler l’information", "Saisir son mot de passe dans le message", "Tester le lien au hasard"], ["Ouvrir soi-même le service habituel pour contrôler l’information"], "La vérification se fait depuis un chemin connu, pas depuis le lien inattendu qui a créé le doute."],
      ["Quel élément seul ne suffit pas à rendre un message authentique ?", ["Un logo ou une présentation soignée", "Une vérification par le canal habituel", "Une demande cohérente confirmée par l’établissement"], ["Un logo ou une présentation soignée"], "L’apparence est un indice faible. La cohérence du contexte et la vérification indépendante sont plus importantes."],
      ["Après un partage involontaire d’une information sensible, quelle attitude est la plus adaptée ?", ["S’arrêter, demander de l’aide et suivre les démarches officielles", "Cacher le problème et multiplier les essais", "Publier l’information à nouveau"], ["S’arrêter, demander de l’aide et suivre les démarches officielles"], "Une erreur mérite une réaction calme et accompagnée, sans tenter de résoudre seul un problème complexe."],
      ["Quel exemple correspond à un canal habituel ?", ["L’application scolaire ouverte depuis son accès connu", "Le bouton d’un message inattendu", "Un compte inconnu qui se présente comme un support"], ["L’application scolaire ouverte depuis son accès connu"], "Un canal habituel est déjà identifié et ne dépend pas de la ressource qui semble douteuse."],
    ],
    quizRows: [
      ["Quel signal doit inviter à une vérification avant de cliquer ?", "Une demande urgente et inattendue est un signal de prudence.", [["Une menace de blocage immédiat inattendue", true], ["Un devoir consulté dans l’application habituelle", false], ["Un document que l’on vient soi-même d’enregistrer", false]]],
      ["Quelle est la troisième étape de la méthode proposée ?", "Après la pause et l’observation, il faut vérifier par un chemin connu.", [["Vérifier", true], ["Transférer", false], ["Deviner", false]]],
      ["Pourquoi utiliser un autre moyen pour confirmer une demande étrange d’un proche ?", "Un autre canal permet de vérifier la demande sans se fier uniquement à un message inhabituel.", [["Pour confirmer le contexte de façon indépendante", true], ["Pour partager son code plus vite", false], ["Pour faire circuler le lien", false]]],
      ["Que faut-il éviter de communiquer dans une réponse à un message suspect ?", "Les secrets d’accès et codes de validation doivent rester privés.", [["Un mot de passe ou un code de validation", true], ["La décision de demander de l’aide", false], ["Le fait que la notification est inattendue", false]]],
    ],
  },
  {
    title: "Vie privée, traces numériques et réaction face à une situation préoccupante",
    description: "Sécurité numérique d’initiation : partage responsable, données personnelles, traces numériques, respect d’autrui, signalement et recherche d’aide.",
    content: `# Sécurité numérique — Leçon 3 : Vie privée, traces numériques et réaction face à une situation préoccupante

> **Statut pédagogique :** cette leçon complémentaire d’initiation traite de prévention, de respect et de recherche d’aide. Les situations sont fictives. Elle ne remplace pas les dispositifs de protection de l’établissement ni l’accompagnement d’un adulte de confiance en cas de danger, de harcèlement ou de contenu préoccupant.

## Objectifs de la leçon

Tu apprendras à distinguer les informations que l’on peut partager de celles qui demandent une protection particulière, à comprendre qu’une publication peut laisser une trace difficile à contrôler, à respecter le consentement d’autrui et à réagir de manière soutenante et responsable face à une situation qui met mal à l’aise, inquiète ou blesse une personne.

---

## 1. Vie privée : choisir ce qui est nécessaire, utile et approprié

La vie privée ne consiste pas à disparaître du numérique. Elle consiste à garder une maîtrise raisonnable de ce que l’on montre, de la personne qui peut le voir et de la raison du partage. Avant de publier, d’envoyer ou de remplir un formulaire, il faut se demander quelles informations sont demandées, à quoi elles servent et si le site ou l’interlocuteur est légitime.

| Information | Risque possible si elle est trop largement partagée | Bon réflexe |
|---|---|---|
| Nom complet, adresse, téléphone, localisation précise | Une personne inconnue peut en savoir trop sur la vie quotidienne de quelqu’un. | Limiter le partage aux interlocuteurs légitimes et aux services vérifiés. |
| Photo ou vidéo identifiable | Le contenu peut être repartagé, recadré ou conservé hors du contexte initial. | Demander l’accord des personnes concernées avant de publier. |
| Document scolaire ou résultat personnel | Il peut révéler une information qui ne regarde pas un groupe entier. | Partager seulement avec la personne ou le service concerné. |
| Message privé | Il peut être mal interprété s’il est sorti de son contexte. | Ne pas diffuser sans raison ni accord. |

> **Question de prudence :** « Est-ce nécessaire de partager cette information maintenant, à cette personne et dans ce lieu ? » Si la réponse n’est pas claire, mieux vaut attendre, demander conseil ou réduire ce qui est partagé.

### Paramètres de confidentialité : une décision à revoir

Les paramètres de confidentialité peuvent aider à limiter les personnes qui voient une publication ou une localisation. Ils ne remplacent pas le jugement humain : une capture, un transfert ou une erreur restent possibles. Il est utile de les vérifier régulièrement, notamment après l’installation d’une nouvelle application, mais il faut aussi réfléchir avant de publier.

> **À retenir :** ne partage pas l’adresse, le numéro, un code, un document privé ou la localisation précise d’une autre personne sans son accord. Le respect de la vie privée est aussi une forme de respect scolaire et citoyen.

---

## 2. Traces numériques : publier, c’est parfois perdre le contrôle du contexte

Une **trace numérique** est un élément laissé par une activité en ligne : message, commentaire, photo, recherche, profil, inscription ou partage. Certaines traces sont créées volontairement ; d’autres apparaissent parce qu’un service enregistre une activité. Une publication peut être supprimée, mais une copie, une capture ou un partage peuvent déjà exister.

| Avant de publier | Pourquoi cette étape compte | Exemple de décision |
|---|---|---|
| Relire le contenu et le ton | Un message envoyé sous la colère peut blesser ou être mal interprété. | Attendre avant de répondre à une provocation. |
| Vérifier les personnes visibles | Une photo peut montrer quelqu’un qui n’a pas demandé à apparaître. | Flouter, recadrer ou ne pas publier sans accord. |
| Examiner la portée | Un groupe fermé peut tout de même contenir des personnes qui repartagent. | Ne pas placer une information intime dans un groupe large. |
| Se demander si l’on accepterait que l’établissement ou la famille le voie | Cette question aide à prendre du recul. | Reformuler ou renoncer à publier si le contenu risque de nuire. |

---

## 3. Mise en situation interactive — Une photo repartagée sans accord

**Situation fictive.** Dans un groupe de révision, une photo de Nadia est reprise d’une ancienne publication puis accompagnée de commentaires humiliants. Nadia se sent mal à l’aise et n’ose pas répondre. Koffi, qui voit la discussion, hésite : il pourrait rire, transférer la photo à un autre groupe ou aider Nadia.

| Action de Koffi | Conséquence possible | Décision responsable |
|---|---|---|
| Ajouter une réaction amusée ou transférer la photo. | Cela amplifie la situation et peut blesser davantage Nadia. | À éviter. |
| Répondre avec des insultes. | Le conflit peut s’aggraver et rendre le signalement plus difficile. | À éviter. |
| Ne pas diffuser, conserver les éléments utiles si nécessaire, soutenir Nadia et l’orienter vers un adulte ou l’établissement. | Cela réduit la propagation et favorise une aide adaptée. | À privilégier. |

> **Décision attendue :** Koffi ne repartage pas le contenu, ne répond pas par une attaque et ne laisse pas Nadia seule. Il peut lui rappeler que ce qu’elle vit n’est pas de sa faute, l’encourager à contacter un adulte de confiance ou l’établissement et utiliser les outils de signalement prévus par le service si cela est pertinent.

### Conserver sans diffuser

Dans certaines situations, garder une capture ou noter ce qui s’est passé peut aider un adulte, l’établissement ou le service concerné à comprendre le problème. Cela ne signifie pas qu’il faut faire circuler le contenu : on conserve seulement ce qui est utile, dans un cadre de confiance, sans ajouter de commentaires ni exposer davantage la personne concernée.

> **Si une personne se sent en danger, est menacée ou vit une situation qui l’effraie, elle doit en parler immédiatement à un adulte de confiance, à l’établissement ou aux services d’urgence adaptés au contexte local.** Il ne faut pas rester seul face à une situation grave.

---

## 4. Respect en ligne : la responsabilité est collective

Le respect en ligne comprend les mêmes principes que le respect hors ligne : ne pas humilier, ne pas diffuser sans accord, ne pas exercer de pression, ne pas faire circuler une rumeur et ne pas encourager la violence. Un témoin peut avoir un rôle utile en refusant de participer, en soutenant la personne concernée et en orientant vers une aide appropriée.

| Situation | Réponse responsable |
|---|---|
| Un camarade demande de transmettre une capture privée « juste pour rire ». | Refuser ; rappeler qu’une image privée ne se partage pas sans accord. |
| Une information personnelle est demandée dans un formulaire inattendu. | Vérifier le service et la nécessité de la demande avant de répondre. |
| Un commentaire fait peur ou met mal à l’aise. | Ne pas répondre sous la colère ; demander conseil, bloquer ou signaler selon le service et le contexte. |
| Un ami est ciblé par des messages blessants. | Le soutenir, éviter de propager, conserver les éléments utiles si nécessaire et chercher un adulte de confiance. |

---

## 5. Synthèse active

> **Je sais faire si je peux :** distinguer une donnée à protéger d’une information de travail ; expliquer pourquoi une publication peut laisser une trace ; demander l’accord avant de diffuser l’image ou le message d’autrui ; choisir une réaction qui soutient une personne et évite d’amplifier une situation préoccupante.

| Vocabulaire essentiel | Définition courte |
|---|---|
| **Vie privée** | Possibilité de contrôler raisonnablement l’accès aux informations qui concernent une personne. |
| **Trace numérique** | Élément laissé par une activité ou une publication dans un environnement numérique. |
| **Consentement** | Accord donné librement par une personne avant l’utilisation ou le partage de ce qui la concerne. |
| **Signalement** | Information transmise à un service ou à un adulte compétent afin qu’une situation soit examinée. |
| **Témoin** | Personne qui observe une situation et peut choisir de ne pas l’amplifier, de soutenir et d’orienter. |

> **Trace de conception :** la leçon s’appuie sur des principes généraux de protection de la vie privée, de prudence avant partage et de recours à un adulte de confiance, adaptés de ressources UNICEF sur la sécurité des jeunes en ligne.`,
    scenarioRows: [
      ["Une photo privée d’une élève est repartagée avec des commentaires humiliants. Quel rôle peut jouer un témoin ?", ["Ne pas diffuser, soutenir la personne et l’orienter vers une aide de confiance", "Transférer la photo pour demander l’avis de tous", "Répondre par des insultes"], ["Ne pas diffuser, soutenir la personne et l’orienter vers une aide de confiance"], "Un témoin responsable limite la propagation, soutient la personne concernée et cherche un accompagnement adapté."],
      ["Avant de publier une photo de groupe, quel geste respecte la vie privée ?", ["Demander l’accord des personnes identifiables", "Publier d’abord et demander après", "Ajouter la localisation précise de chacun"], ["Demander l’accord des personnes identifiables"], "Les personnes visibles doivent pouvoir accepter ou refuser la diffusion d’une image qui les concerne."],
      ["Une application inconnue demande une adresse et un numéro de téléphone pour donner accès à une fiche gratuite. Quelle réaction est appropriée ?", ["Vérifier le service et la nécessité de la demande avant de fournir une donnée personnelle", "Donner toutes les données car la fiche est gratuite", "Envoyer les informations d’un camarade"], ["Vérifier le service et la nécessité de la demande avant de fournir une donnée personnelle"], "La gratuité n’est pas une raison suffisante pour communiquer des données. Il faut comprendre qui demande et pourquoi."],
      ["Pourquoi conserver parfois un élément utile sans le redistribuer ?", ["Pour pouvoir demander de l’aide sans amplifier la situation", "Pour créer plus de commentaires", "Pour l’afficher dans un autre groupe"], ["Pour pouvoir demander de l’aide sans amplifier la situation"], "La conservation prudente peut soutenir un signalement ; la diffusion ajoute de l’exposition et peut accroître le préjudice."],
    ],
    methodRows: [
      ["Quelle question aide à décider avant un partage ?", ["Est-ce nécessaire de partager cette information avec cette personne maintenant ?", "Est-ce que le groupe est très grand ?", "Est-ce que la photo est amusante pour moi ?"], ["Est-ce nécessaire de partager cette information avec cette personne maintenant ?"], "La question porte sur la nécessité, le destinataire et le contexte, pas seulement sur l’envie de publier."],
      ["Quel comportement limite une trace numérique difficile à contrôler ?", ["Relire et réfléchir avant de publier", "Partager immédiatement quand on est en colère", "Accepter toutes les demandes inconnues"], ["Relire et réfléchir avant de publier"], "Une publication peut être copiée ou repartagée. Prendre du recul aide à éviter des choix impulsifs."],
      ["Face à un commentaire inquiétant, quelle réaction est responsable ?", ["Chercher un adulte de confiance ou l’établissement et utiliser les options de signalement adaptées", "Rester seul et garder le secret", "Repartager le commentaire"], ["Chercher un adulte de confiance ou l’établissement et utiliser les options de signalement adaptées"], "Une situation inquiétante doit être accompagnée. Il faut éviter de l’amplifier et ne pas laisser la personne seule."],
      ["Le consentement signifie ici :", ["Obtenir l’accord libre d’une personne avant de partager ce qui la concerne", "Partager si la photo est déjà ancienne", "Demander seulement après la publication"], ["Obtenir l’accord libre d’une personne avant de partager ce qui la concerne"], "Le fait qu’un contenu existe ne signifie pas qu’il peut être rediffusé sans accord."],
    ],
    quizRows: [
      ["Quel exemple est une donnée personnelle à protéger ?", "Une adresse ou un numéro de téléphone ne doivent pas être publiés sans nécessité ni accord.", [["Une adresse ou un numéro de téléphone", true], ["Le titre général d’un cours", false], ["Le nom d’un dossier vide", false]]],
      ["Pourquoi une trace numérique demande-t-elle de la prudence ?", "Un contenu peut être copié ou ressorti de son contexte, même après suppression.", [["Parce qu’un partage peut être copié ou repartagé", true], ["Parce qu’il disparaît toujours immédiatement", false], ["Parce qu’il est forcément public", false]]],
      ["Quelle réaction soutient le mieux une personne victime de messages humiliants ?", "Le soutien, l’arrêt de la diffusion et l’orientation vers une aide appropriée réduisent l’isolement.", [["Ne pas diffuser et l’orienter vers une aide de confiance", true], ["Rire pour réduire la tension", false], ["Transférer le contenu à un autre groupe", false]]],
      ["Que signifie demander le consentement avant une publication ?", "Le consentement est l’accord libre de la personne concernée avant le partage.", [["Demander l’accord de la personne concernée", true], ["Publier puis supprimer si elle proteste", false], ["Choisir seul parce que l’image est jolie", false]]],
    ],
  },
];

const exerciseQuestionSql = (exerciseId, rows) => `insert into public.exercise_questions (exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order) values\n${rows.map(([prompt, options, correct, explanation], index) => `(${exerciseId},'single_choice',${sqlText(prompt)},${jsonArray(options)},${jsonArray(correct)},${sqlText(explanation)},${(index + 1) * 10})`).join(",\n")};`;

const quizSql = (quizId, title, description, rows, displayOrder) => {
  const questions = rows.map(([question, explanation], index) => `(${quizId},${sqlText(question)},${sqlText(explanation)},'single_choice',${(index + 1) * 10},1,true)`).join(",\n");
  const answers = rows.flatMap(([, , choices], index) => choices.map(([answer, isCorrect], optionIndex) => `(${(index + 1) * 10},${sqlText(answer)},${isCorrect},${(optionIndex + 1) * 10})`)).join(",\n");
  return `insert into public.quizzes (subject_id,level_id,series_id,subject_offering_id,chapter_id,lesson_id,title,description,difficulty,duration_minutes,display_order,is_published,is_active,is_test_data) values (target.subject_id,target.level_id,target.series_id,target.offering_id,target_chapter_id,target_lesson_id,${sqlText(title)},${sqlText(description)},'medium',12,${displayOrder},false,false,false) returning id into ${quizId}; with inserted_questions as (insert into public.quiz_questions (quiz_id,question,explanation,question_type,display_order,points,is_active) values ${questions} returning id,display_order) insert into public.quiz_answers (question_id,answer,is_correct,display_order) select iq.id,v.answer,v.is_correct,v.display_order from inserted_questions iq join (values ${answers}) as v(question_order,answer,is_correct,display_order) on v.question_order=iq.display_order;`;
};

const lessonSql = (lesson, index) => {
  const lessonOrder = (index + 1) * 10;
  const baseOrder = (index + 1) * 100;
  const scenarioExerciseId = `scenario_exercise_${index + 1}_id`;
  const methodExerciseId = `method_exercise_${index + 1}_id`;
  const knowledgeQuizId = `knowledge_quiz_${index + 1}_id`;
  const decisionQuizId = `decision_quiz_${index + 1}_id`;
  return `
    insert into public.lessons (chapter_id,title,description,content,display_order,is_test_data,is_active)
    values (target_chapter_id,${sqlText(lesson.title)},${sqlText(lesson.description)},${sqlText(lesson.content)},${lessonOrder},false,false)
    returning id into target_lesson_id;

    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order,is_test_data)
    values (target.subject_id,target.level_id,target.series_id,target_chapter_id,target_lesson_id,${sqlText(`Mise en situation ${index + 1} — ${lesson.title}`)},${sqlText("Lis chaque situation fictive. Choisis la décision qui protège le mieux les personnes, les comptes et les informations ; lis ensuite la correction pour comprendre la méthode.")},${sqlText("La correction relie la bonne décision à la prudence, à la vérification et à la recherche d’aide adaptée. Elle ne donne aucune instruction de contournement de sécurité.")},'single_choice','medium',${sqlText("Réponds aux situations sans imaginer de données réelles ni ouvrir de lien. Appuie-toi sur les étapes de décision de la leçon.")},${sqlText("Après chaque question, relève le signal de prudence, l’action évitée et l’action responsable.")},false,false,20,${baseOrder + 10},false)
    returning id into ${scenarioExerciseId};
${exerciseQuestionSql(scenarioExerciseId, lesson.scenarioRows)}

    insert into public.exercises (subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,solution,exercise_type,difficulty,content_markdown,correction_markdown,is_published,is_active,estimated_duration_minutes,display_order,is_test_data)
    values (target.subject_id,target.level_id,target.series_id,target_chapter_id,target_lesson_id,${sqlText(`Exercice de consolidation ${index + 1} — ${lesson.title}`)},${sqlText("Mobilise le vocabulaire, les règles de décision et les limites présentées dans la leçon.")},${sqlText("La correction explique le raisonnement : protéger une information, vérifier par un canal connu, ne pas amplifier une situation et demander de l’aide lorsque c’est nécessaire.")},'single_choice','medium',${sqlText("Réponds de manière responsable : le but est de comprendre un réflexe de protection, pas de tester une situation réelle.")},${sqlText("Lis chaque explication pour mémoriser la méthode et identifier l’action à éviter.")},false,false,20,${baseOrder + 20},false)
    returning id into ${methodExerciseId};
${exerciseQuestionSql(methodExerciseId, lesson.methodRows)}

${quizSql(knowledgeQuizId, `Quiz ${index + 1}A — Repères de sécurité numérique`, `Vérifie les notions essentielles de la leçon « ${lesson.title} ».`, lesson.quizRows, baseOrder + 10)}
${quizSql(decisionQuizId, `Quiz ${index + 1}B — Décider dans une situation numérique`, `Vérifie l’application responsable des repères de la leçon « ${lesson.title} ».`, lesson.scenarioRows.map(([question, options, correct, explanation]) => [question, explanation, options.map((option) => [option, correct.includes(option)])]), baseOrder + 20)}
`;
};

const migration = `-- Informatique / TICE Terminale : sécurité numérique interactive.
-- Parcours complémentaire non officiel ; les contenus créés restent brouillons, inactifs et non publiés.
do $computer_science_terminal_digital_security$
declare
  target record;
  target_chapter_id uuid;
  target_lesson_id uuid;
  chapter_order integer;
  offering_count integer;
  scenario_exercise_1_id uuid; method_exercise_1_id uuid; knowledge_quiz_1_id uuid; decision_quiz_1_id uuid;
  scenario_exercise_2_id uuid; method_exercise_2_id uuid; knowledge_quiz_2_id uuid; decision_quiz_2_id uuid;
  scenario_exercise_3_id uuid; method_exercise_3_id uuid; knowledge_quiz_3_id uuid; decision_quiz_3_id uuid;
begin
  select count(*) into offering_count from public.course_subject_offerings where id in (${offerings.map(sqlText).join(",")}) and is_test_data=false;
  if offering_count<>4 then
    raise exception 'Les quatre offres Informatique / TICE Terminale officielles sont requises.';
  end if;

  if exists (
    select 1 from public.chapters c
    where c.subject_offering_id in (${offerings.map(sqlText).join(",")})
      and c.title=${sqlText(chapterTitle)}
  ) then
    raise exception 'Le chapitre Sécurité numérique existe déjà : duplication ou écrasement interdit.';
  end if;

  if exists (
    select 1 from public.lessons l
    join public.chapters c on c.id=l.chapter_id
    where c.subject_offering_id in (${offerings.map(sqlText).join(",")})
      and l.title in (${lessons.map((lesson) => sqlText(lesson.title)).join(",")})
  ) then
    raise exception 'Une leçon de sécurité numérique existe déjà : duplication ou écrasement interdit.';
  end if;

  for target in
    select o.id as offering_id,o.subject_id,o.level_id,o.series_id,se.name as series_name
    from public.course_subject_offerings o
    join public.series se on se.id=o.series_id
    where o.id in (${offerings.map(sqlText).join(",")})
      and o.is_test_data=false
    order by se.name
  loop
    select coalesce(max(c.display_order),0)+10 into chapter_order
    from public.chapters c
    where c.subject_offering_id=target.offering_id;

    insert into public.chapters (subject_id,level_id,series_id,subject_offering_id,title,description,display_order,is_test_data,is_active)
    values (target.subject_id,target.level_id,target.series_id,target.offering_id,${sqlText(chapterTitle)},'Parcours complémentaire non officiel : protection des comptes et appareils, vérification des messages, vie privée et réactions responsables.',chapter_order,false,false)
    returning id into target_chapter_id;
${lessons.map(lessonSql).join("\n")}
  end loop;
end $computer_science_terminal_digital_security$;
`;

writeFileSync(migrationPath, migration, "utf8");
writeFileSync(payloadPath, `${JSON.stringify({ project_id: "nnshioowwniursnozicg", name: "computer_science_terminal_digital_security_interactive_drafts", query: migration }, null, 2)}\n`, "utf8");
console.log(migrationPath);
console.log(payloadPath);
