# EduTech School — Plan de conception mobile

## Intention produit

**EduTech School** est une application scolaire sérieuse, rassurante et orientée progression. Cette première version établit des parcours fluides, sans inventer de cours, statistiques ni profil utilisateur. L’interface est conçue en **portrait 9:16**, avec des actions principales dans la zone basse accessible au pouce et une information essentielle lisible sur petits écrans Android.

## Écrans et composition

| Écran | Contenu principal | Actions réelles | État initial |
|---|---|---|---|
| Démarrage | Signe graphique, nom, slogan, indicateur de chargement | Redirection après l’animation | Oriente vers Connexion car aucun service d’authentification n’est configuré |
| Connexion | Identité de marque, champs e-mail et mot de passe, liens d’aide | Ouvrir Inscription, Mot de passe oublié, Accueil de découverte | La connexion réelle est explicitement indisponible jusqu’à Supabase |
| Inscription | Explication de la prochaine intégration et retour à Connexion | Retour à Connexion | Structure prête pour le futur formulaire réel |
| Mot de passe oublié | Explication et champ e-mail désactivé/clair sur la dépendance backend | Ouvrir Réinitialisation, retour Connexion | Aucun e-mail n’est simulé ni envoyé |
| Réinitialisation | Confirmation de préparation du parcours | Retour à Connexion | Aucun jeton ou mot de passe fictif |
| Accueil | Accueil de découverte, raccourcis, sections Continuer, Progression, Activités | Accès à Cours, Quiz, Exercices, Mentor IA, Bulletin | Tous les contenus dynamiques ont un état vide soigné |
| Cours | Titre et texte de disponibilité future | Accès à Accueil | État vide sans cours inventé |
| Quiz | Titre et texte de disponibilité future | Accès à Accueil | État vide sans quiz inventé |
| Exercices | Titre et texte de disponibilité future | Accès à Accueil | État vide sans exercices inventés |
| Mentor IA | Description encadrée du futur assistant | Accès à Accueil | État indisponible transparent |
| Bulletin | Présentation de la future synthèse scolaire | Accès à Accueil | État vide sans notes inventées |
| Profil | Avatar initial, champs de profil en attente, liens Paramètres et Déconnexion | Ouvrir Paramètres, Connexion | Aucune identité utilisateur simulée |
| Paramètres | Thème, notifications, langue, confidentialité, conditions, à propos, déconnexion | Changer le thème local, afficher les fiches d’information, retour Connexion | Les réglages nécessitant le backend sont clairement signalés |
| Administration | Écran de réserve non exposé par défaut | Retour Accueil | Prévu pour la future administration |

## Parcours prioritaires

1. **Lancement et accès initial** : démarrage → redirection vers Connexion → action « Découvrir l’application » → Accueil.
2. **Navigation principale** : Accueil ↔ Cours ↔ Quiz ↔ Exercices ↔ Profil via une barre d’onglets persistante et accessible.
3. **Fonctions secondaires** : Accueil → Mentor IA ou Bulletin → retour Accueil ; Profil → Paramètres → changement local de thème ou consultation d’une fiche → retour Profil.
4. **Parcours d’accès** : Connexion → Inscription ou Mot de passe oublié → Réinitialisation → retour Connexion. Les écrans ne prétendent pas réaliser une action serveur non configurée.
5. **Sortie de session** : Profil ou Paramètres → Déconnexion → Connexion, présentée comme une préparation de flux sans session factice.

## Hiérarchie et interaction

L’en-tête de chaque écran affiche une libellé de section court et un sous-texte lorsque le contexte le demande. Les blocs de contenu utilisent des surfaces blanches ou bleu très pâle, avec des coins arrondis généreux mais sobres. Les appels à l’action dominants sont pleines largeurs, hauts d’au moins 48 pixels et placés en bas des formulaires ou dans la zone naturellement atteignable par le pouce. Les éléments secondaires sont présentés sous forme de lignes avec chevron, ce qui rend leur affordance explicite.

Chaque écran prévoit des retours visuels : attente au démarrage, état vide pour les données non encore connectées, message d’erreur local pour les champs vides et confirmation pour le changement de thème. Les états backend absents restent informatifs sans imitation de résultat réel.

## Identité chromatique

| Élément | Couleur claire | Couleur sombre | Usage |
|---|---:|---:|---|
| Bleu savoir | `#155EEF` | `#84ADFF` | Actions principales, sélection, repères de navigation |
| Bleu nuit | `#0E2A6B` | `#C7D7FE` | Titres, monogramme, contraste pédagogique |
| Ciel papier | `#F5F8FF` | `#101B33` | Arrière-plan des écrans et zones d’apprentissage |
| Surface | `#FFFFFF` | `#18233D` | Cartes et champs |
| Texte | `#101828` | `#F5F7FF` | Texte principal |
| Texte secondaire | `#667085` | `#B6C0D6` | Aide et métadonnées |
| Réussite | `#12B76A` | `#47CD89` | Confirmation locale positive |
| Attention | `#F79009` | `#FDB022` | Fonction planifiée ou indisponible |
| Erreur | `#D92D20` | `#F97066` | Validation de formulaire |

Le signe de marque associe un livre ouvert stylisé à une flèche ascendante, pour exprimer l’apprentissage et le progrès. L’ensemble privilégie des couleurs stables et une densité modérée, adaptée aux élèves du secondaire.

## Principes d’évolution technique

Les routes, modèles et services sont isolés de la présentation. Une couche `auth` expose une interface volontairement non connectée qui pourra être remplacée par Supabase Auth sans changer les écrans. Les modèles d’utilisateur, de préférences et de disponibilité sont distincts afin de préparer la base de données, les notifications, le mode hors-ligne et les fonctions scolaires à venir.
