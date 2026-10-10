# Analyse des PDF — Espagnol Terminale, fiches 2 à 4

## Périmètre et règle bilingue obligatoire

Les trois PDF relèvent de la compétence « traiter une situation relative à la connaissance du monde hispanique » et d’activités de compréhension orale. À la demande explicite de l’utilisateur, tout passage pédagogique en espagnol créé à partir de ces documents devra être immédiatement suivi de sa traduction française : explication, définition, exemple, consigne, énoncé, choix de réponse, correction et question de quiz. La formulation espagnole reste visible ; la traduction française l’accompagne directement dans un encadré `> **Traduction française :**`.

Cette règle est documentée dans `docs/convention-langues-vivantes.md` et s’applique aux futurs contenus de langues vivantes. Elle n’impose pas une révision rétroactive des contenus déjà publiés.

## PDF 1 — Espagne : réalités politiques, sociales et historiques

**Titre figurant dans le PDF :** « Connaître les réalités politiques, sociales et historiques de l’Espagne ». Le support est `Memoria Histórica`, *Más Allá Terminale*, p. 10.

Le document présente la guerre civile espagnole, le franquisme, la récupération de la mémoire historique et l’exhumation de victimes. Le résumé mentionne l’action d’associations de récupération de la mémoire historique sous la supervision du juge Baltasar Garzón. Le vocabulaire à traiter avec traduction est notamment : *el franquismo*, *un desaparecido*, *exhumar*, *la guerra civil*, *los restos mortales* et *una sepultura digna*.

La grammaire porte sur la corrélation des temps avec les verbes de volonté : le verbe de la subordonnée est au subjonctif. L’exemple de référence est `Lo que queremos es que les den una sepultura digna.` Les activités réemploient le présent et l’imparfait du subjonctif dans les tournures de volonté. Les exercices et situations évaluatives demandent d’identifier les événements (guerre civile, franquisme), d’expliquer le rôle des associations et de restituer les informations entendues.

## PDF 2 — Amérique hispanique : réalités sociales et historiques

**Titre figurant dans le PDF :** « Connaître les réalités sociales et historiques de l’Amérique hispanique ». Le support est `Culturas precolombinas`, *Más Allá Terminale*, p. 14.

La fiche développe les civilisations aztèque, maya et inca, leurs localisations, certaines croyances, leur organisation sociale et des repères chronologiques donnés par le document. Le vocabulaire introduit *azteca*, *maya*, *inca*, *el sacerdote* et *el chamán*. Les synthèses portent sur Quetzalcóatl, Hunabkú, les connaissances scientifiques et astronomiques mayas, Yupanqui et le Machu Picchu.

La grammaire cible le superlatif relatif : `(el/la/los/las) más + adjetivo` et `(el/la/los/las) menos + adjetivo`, avec les formes *el mejor*, *el peor*, *el mayor* et *el menor*. Les exercices demandent l’identification des civilisations, des réponses vrai/faux et la localisation de ces civilisations. Les activités de restitution doivent toujours proposer l’énoncé espagnol suivi de sa traduction française.

## PDF 3 — Amérique hispanique : réalités économiques et sociales

**Titre figurant dans le PDF :** « Connaître les réalités économiques et sociales de l’Amérique hispanique ». Le support est `La ruta de la muerte`, *Más Allá Terminale*, p. 17.

Le document traite de l’émigration, de la migration clandestine, des dangers du trajet vers les États-Unis et de causes économiques, sociales et parfois politiques. Le vocabulaire principal est *la emigración*, *un indocumentado*, *un peligro*, *los emigrantes*, *la ruta de la muerte* et *la vía clandestina*.

La grammaire porte sur l’expression d’un souhait avec *gustar* au conditionnel : `Me gustaría + infinitivo` et `Me gustaría que + subjonctif`. Les exercices proposent du lexique à compléter, l’identification de pays d’origine d’immigrants hispanophones et des questions de compréhension sur la migration. Les situations d’évaluation demandent d’identifier les objectifs et causes des migrations et de restituer des informations entendues.

## Points de contrôle avant création

1. Vérifier les séries Terminale réellement associées à l’espagnol et les structures existantes ; les PDF mentionnent surtout Terminale A2, mais aucun élargissement aux autres séries ne doit être supposé.
2. Vérifier les titres des leçons et l’absence de contenu, d’exercice ou de quiz avant toute insertion.
3. Créer uniquement les brouillons confirmés, avec `is_active = false` et `is_published = false`, sans écraser un contenu existant.
4. Prévoir les traductions françaises immédiates dans le cours, les exercices, les questions de quiz, les options et les explications de correction.

## Confirmations visuelles des PDF

L’examen visuel du PDF sur l’Espagne confirme la structure en trois pages, la présence explicite du support `MemoriaHistórica`, le titre exact de la leçon et la progression suivante : situation d’apprentissage, vocabulaire, résumé, point de grammaire sur la corrélation des temps avec les verbes de volonté, activités d’application, exercices et situations d’évaluation. Les réponses modèles apparaissent en rouge dans le document, ce qui facilite l’identification des formulations de restitution à reformuler sans les copier.

L’examen visuel du fichier intitulé `L3Am.hispa.-réalitéssociales,histo.pdf` confirme que ce PDF contient d’abord la fiche 3 sur les réalités sociales et historiques de l’Amérique hispanique, puis enchaîne ensuite avec la fiche 4 sur les réalités économiques et sociales de l’Amérique hispanique. Les pages vues montrent clairement les tableaux de mise en relation, les exercices de vrai/faux, la restitution sur les civilisations précolombines, puis l’ouverture de la fiche 4 avec le support `La ruta de la muerte`, le lexique de la migration et la grammaire sur *gustar* au conditionnel.

Cette observation visuelle implique un contrôle d’anti-doublon particulièrement important : le fichier autonome `L4Am.hispa.-réalitéséconom.etsociales.pdf` semble reprendre la même fiche 4 que celle déjà visible à la fin du fichier `L3Am.hispa.-réalitéssociales,histo.pdf`. Avant toute migration, il faudra donc rattacher les contenus à leurs leçons exactes sans créer deux fois la même ressource pour la fiche 4.

## Audit Supabase — Espagnol Terminale

L’audit en lecture seule confirme quatre offres distinctes d’Espagnol au niveau Terminale : A1 (`942aacbc-1f0c-4eea-9f61-04560b3f3578`), A2 (`48880a58-de13-4485-a45d-ab716b4ca645`), C (`0e028469-a443-4b7d-9ed9-6a675193fc24`) et D (`d496a111-1324-4f92-b557-f5bb402f6bac`). Aucune de ces offres ne possède encore de chapitre ou de leçon, donc aucun contenu, exercice ou quiz existant ne peut être écrasé.

L’utilisateur a explicitement fixé le périmètre à toute la Terminale. Les trois fiches valides seront donc structurées pour A1, A2, C et D, dans un chapitre commun dédié à la compétence « connaissance du monde hispanique ». Le chapitre sera créé à la dernière position de chaque offre — ici, la première puisqu’aucun chapitre n’existe — puis les trois leçons seront ordonnées comme dans les PDF : Espagne ; réalités sociales et historiques de l’Amérique hispanique ; réalités économiques et sociales de l’Amérique hispanique.

Le fichier L3 contient déjà visuellement la fiche L4, mais l’insertion de la fiche 4 restera unique par leçon et par série. Chaque ressource associée conservera le statut brouillon, inactive et non publiée.

## Résultat de la migration et validations

La migration bilingue a été appliquée avec succès au projet Supabase officiel. Pour chacune des séries A1, A2, C et D, elle crée un chapitre inactif, trois leçons inactives, six exercices, dix-huit questions d’exercice, trois quiz, douze questions de quiz et vingt-quatre réponses de quiz. Chaque leçon contient la mention de traduction française, et les contrôles confirment que tous les exercices et quiz sont inactifs et non publiés.

Les trois fiches sont donc créées une seule fois par série malgré la présence de la fiche 4 à la fin du fichier L3. Les cours, questions, options de réponse, corrections et explications intègrent une formulation espagnole suivie de sa traduction française immédiate. La convention est désormais documentée dans `docs/convention-langues-vivantes.md` pour les futurs lots de langues vivantes.

Les validations techniques finales sont réussies : TypeScript et lint ne signalent aucune erreur ; la suite complète compte **223 tests réussis** et **1 test ignoré** ; l’export Android est produit sans erreur. Les contenus restent prêts à être prévisualisés dans l’administration et ne doivent être publiés qu’après validation manuelle.
