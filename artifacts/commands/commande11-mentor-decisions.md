# Commande 11 — Décisions d’architecture Mentor IA

## Périmètre retenu

Le Mentor IA reprend la route existante `/mentor` ; aucune seconde page ni aucun second module n’est créé. Il utilise le modèle **`gemini-2.5-flash-lite`** à travers l’API Google Gemini. Le nom du modèle est stocké dans la configuration serveur afin de pouvoir être modifié ultérieurement sans reconstruire l’interface mobile.

## Clé Gemini unique et stockage

Une seule configuration active est conservée côté serveur. La clé reçue depuis l’écran administrateur transite uniquement par HTTPS vers le backend, est chiffrée en AES-256-GCM avec un secret serveur, puis est enregistrée chiffrée dans la base serveur. La valeur en clair n’est ni retournée, ni journalisée, ni mise dans les variables Expo publiques ou le paquet Android. L’administration ne reçoit qu’un suffixe masqué et les métadonnées de statut.

## Autorisation et séparation des données

Chaque appel backend vérifie le jeton Supabase de l’application et relit le profil réel sous RLS. Les réglages et diagnostics de clé exigent le rôle administrateur réel ; les appels conversationnels exigent un élève authentifié. Les réponses ne modifient jamais les tables Bulletin, Quiz, Exercices, progression ou coefficients.

## Conversation et contexte pédagogique

La conversation active est sauvegardée localement sous une clé propre à l’élève et ne contient que les messages textuels. Les dernières interventions sont envoyées au modèle afin de traiter les questions de suivi. Le profil réel fournit niveau et série ; une matière peut être choisie parmi les offres accessibles par l’élève. Les instructions imposent une réponse structurée, progressive et honnête sur les éléments non lisibles ou non vérifiables.

## Images et documents

Le Mentor accepte jusqu’à trois pièces jointes par demande : image de galerie, appareil photo ou PDF. Elles sont lues temporairement en mémoire, soumises comme données inline à Gemini, puis retirées de l’état mobile après l’envoi. Elles ne sont ni enregistrées dans le cache de conversation ni déposées dans un stockage distant. Les fichiers sont limités en taille et les formats non compatibles sont refusés avant l’appel réseau.

## Réseau, quota et conflits

Le Mentor n’offre aucune réponse simulée hors connexion. En l’absence de réseau, l’élève reçoit un message clair indiquant que le Mentor nécessite Internet. Les réponses Gemini 429, invalides ou indisponibles sont traduites en messages non techniques côté élève ; le détail reste visible seulement dans l’interface administrateur. Il n’existe ni rotation automatique de clés ni nouvelle tentative en boucle.
