# Correction — clignotement du module Cours

## Symptôme signalé

Après une modification réussie de son profil, l’utilisateur constatait que l’écran **Cours** semblait se recharger continuellement, avec des flashs répétés entre l’état de chargement et le catalogue.

## Cause identifiée

L’écran `app/(tabs)/courses.tsx` appelait `refreshProfile()` dans un effet de focus, puis appelait directement `load()` dans son `finally`. Or le chargement de profil hydrate et remplace l’objet `profile`. La fonction `load` dépendait de cet objet et figurait elle-même dans les dépendances de l’effet de focus. À chaque nouveau profil hydraté, l’effet était donc recréé alors que l’écran restait focalisé, ce qui déclenchait un nouveau rafraîchissement : un cycle de rafraîchissement visuel.

## Correction appliquée

Le rafraîchissement du profil et le chargement du catalogue sont désormais dissociés :

1. L’effet de focus demande seulement un rafraîchissement du profil.
2. Un effet séparé recharge le catalogue uniquement lorsqu’une valeur de profil réellement disponible évolue.
3. Lorsque le profil n’est pas encore disponible mais que son chargement est terminé, l’écran cesse proprement l’état de chargement et affiche l’état approprié.

Cette séparation conserve la prise en compte immédiate de `school_level` et `series` après modification du profil, tout en supprimant la relance circulaire. Un test de régression dédié couvre cette structure.

## Validation

La correction a passé TypeScript, les tests ciblés, la suite complète et l’export Android. Les journaux récents ne signalent aucune erreur d’exécution liée au catalogue Cours après la modification ; les mentions antérieures de fermeture prématurée proviennent du rechargement de l’environnement de développement et ne sont pas liées au module Cours.
