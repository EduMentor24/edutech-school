# Commande 28 — Diagnostic initial de l’icône Android

## Constats visuels consignés

Les fichiers `assets/images/icon.png` et `assets/images/android-icon-foreground.png` sont visuellement identiques. Ils affichent un symbole bleu en forme de chevron stylisé, accompagné de repères géométriques de construction sur fond bleu très clair. Ils ne correspondent pas au logo EduTech School visible dans l’interface de connexion, qui est un livre blanc sur carré bleu.

Les deux fichiers sont des PNG RGB opaques de 1024 × 1024. En conséquence, le fichier `android-icon-foreground.png` n’est pas un premier plan adaptatif approprié : il inclut son fond, n’offre aucune transparence et utilise l’ancien graphisme générique à la place de l’identité EduTech School.

La configuration Expo référence pourtant ce fichier comme icône principale et comme `android.adaptiveIcon.foregroundImage`. C’est la cause initiale établie du launcher Android non conforme. La suite du diagnostic identifiera la ressource officielle déjà employée par l’interface afin de la configurer sans la modifier.

## Conclusion de l’audit

La marque affichée par l’application est actuellement un composant d’interface (`BrandMark`) : l’icône Material `menu-book` blanche, centrée sur le bleu de marque `#155EEF`. Il ne s’agit pas d’un fichier image disponible dans `assets/images/`. Les autres images recensées sont soit les six variantes du même graphisme générique, soit des ressources React de modèle ; aucune n’est le logo officiel EduTech School utilisable pour le launcher Android.

Conformément à la consigne de ne pas inventer ni modifier un logo, aucune ressource et aucune ligne de configuration n’ont été changées. Le fichier requis pour poursuivre est un logo officiel EduTech School carré, au minimum 1024 × 1024 px, en PNG, avec la marque livre blanc sur fond bleu ou avec un premier plan réellement transparent pour une icône adaptative. Tant que ce fichier n’est pas fourni ou explicitement validé comme pouvant être dérivé du `BrandMark` actuel, toute correction d’icône serait une invention graphique non autorisée.

## Correction autorisée et contrôle visuel

L’autorisation de dérivation a été reçue après ce diagnostic. Les nouvelles ressources ont donc été générées de manière déterministe à partir du même glyphe Material Icons `menu-book` (codepoint 59929) et des mêmes couleurs que `BrandMark` : livre blanc `#FFFFFF` sur bleu `#155EEF`.

Le contrôle visuel confirme que l’icône principale présente exactement le livre blanc centré sur le bleu de marque visible dans l’application. Le calque Android `foreground` ne contient plus de fond opaque : il est transparent hors du glyphe et le livre est volontairement réduit et centré dans la zone sûre, afin que les masques circulaires, carrés arrondis ou propriétaires des launchers Android ne rognent aucune partie importante du symbole.

## Ressources créées

| Ressource                                   | Format et dimensions  | Rôle                                                                           |
| ------------------------------------------- | --------------------- | ------------------------------------------------------------------------------ |
| `assets/images/icon.png`                    | PNG RGB, 1024 × 1024  | Icône Expo et Android principale : livre blanc `menu-book` sur bleu `#155EEF`. |
| `assets/images/android-icon-foreground.png` | PNG RGBA, 1024 × 1024 | Calque adaptatif transparent, avec symbole centré dans la zone sûre.           |
| `assets/images/android-icon-background.png` | PNG RGB, 1024 × 1024  | Arrière-plan bleu de marque, séparé du symbole.                                |
| `assets/images/android-icon-monochrome.png` | PNG RGBA, 1024 × 1024 | Calque monochrome transparent demandé par Android moderne.                     |

Les quatre fichiers sont générés par [`scripts/generate_brand_icon.py`](../scripts/generate_brand_icon.py). Ce script emploie la police `MaterialIcons.ttf` déjà installée et le codepoint `59929` du même glyph `menu-book` déclaré dans [`BrandMark`](../components/edutech/brand-mark.tsx). Il ne repose donc ni sur une IA générative ni sur une réinterprétation du logo.

## Configuration Android modifiée

La seule modification de configuration concerne [`app.config.ts`](../app.config.ts) : `android.icon` référence explicitement `icon.png` et l’icône adaptative utilise un fond `#155EEF`, un premier plan transparent, un arrière-plan séparé et le calque monochrome. Les paramètres du package `com.app.edutechschool`, de la version `1.0.0`, du `versionCode` `1`, d’Expo SDK 54 et du profil EAS `apk` interne sont inchangés.

## Validations

| Contrôle             | Résultat                                                                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Comparaison visuelle | Conforme : même livre blanc `menu-book` et même bleu `#155EEF` que BrandMark ; aucun élément générique, texte, bordure ou recadrage. |
| Ressources PNG       | Conformes : carrées 1024 × 1024 ; `foreground` et `monochrome` en RGBA transparent.                                                  |
| Configuration Expo   | Conforme : la sortie publique résout `android.icon` et les quatre références adaptatives attendues.                                  |
| Configuration EAS    | Conforme : profil `apk` interne inchangé ; aucune build EAS lancée.                                                                  |
| TypeScript           | Réussi.                                                                                                                              |
| Lint                 | Réussi.                                                                                                                              |
| Tests                | **404 réussis, 1 ignoré** ; ajout de 2 tests de contrat pour l’icône Android.                                                        |
| Nouvelle APK         | **Non générée**, conformément à la consigne.                                                                                         |

## Limites et conclusion

Android applique l’icône lors de l’installation ou de la mise à jour de l’APK. Un launcher peut conserver temporairement l’ancienne icône en cache jusqu’à la mise à jour, au redémarrage du launcher ou à la réinstallation de l’application.

La prochaine APK construite avec cette configuration doit afficher le logo EduTech School — le livre blanc sur fond bleu — dans le tiroir d’applications et sur l’écran d’accueil, au lieu du graphisme générique précédent. Une vérification sur appareil Android réel reste nécessaire après cette future build, mais aucun blocage de configuration n’est identifié.
