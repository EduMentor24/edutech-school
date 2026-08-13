# Notes d’implémentation — moteur de cours

L’écran `app/(tabs)/courses.tsx` est actuellement un simple état de disponibilité et peut être remplacé sans toucher aux autres modules. Les nouveaux écrans utilisent `AppScreen`, qui applique la zone sûre et une marge horizontale standard de 20 points ; les listes doivent conserver ce rythme visuel.

Les données seront chargées progressivement depuis Supabase : matières filtrées à partir du profil réel, puis chapitres, leçons et enfin le contenu d’une leçon. Aucune liste de matières ni leçon n’est codée en dur dans l’interface.
