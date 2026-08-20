# Analyse des PDF Mathématiques Terminale A

## Sources lues intégralement

| PDF | Portée identifiée | Décision |
|---|---|---|
| `TAMathsleçon03fonctionlogarithmeneperien.PDF` | Terminale A, leçon 3 : définition de `ln`, propriétés algébriques, limites, variations, équations, inéquations, dérivées, primitives et applications. | Déjà intégré pour A1/A2 : ne pas écraser ni dupliquer. |
| `TAMathsleçon04Fonctionexponnentielle.PDF` | Terminale A, leçon 4 : fonction réciproque de `ln`, propriétés de `e^x`, limites, variations, équations/inéquations, dérivation, primitives A1 et situation de publicité. | Créer pour les leçons vides A1/A2 confirmées. |
| `TAMathsleçon05Suitesnumériques.PDF` | Terminale A, leçon 5 : suites arithmétiques et géométriques, récurrence, terme général, variations, sommes et applications financières/salariales. | Créer pour les leçons vides A1/A2 confirmées. |

## Cibles Supabase vérifiées en lecture seule

| Série | Leçon | ID | État constaté |
|---|---|---|---|
| A1 | 4. Fonction logarithme népérien | `aec347c0-a680-4ef1-b4f6-67947a1e600c` | contenu 5 464 caractères, 2 exercices, 1 quiz, inactive : à préserver |
| A2 | 3. Fonction logarithme népérien | `50398ee8-8130-47eb-ad7c-f2ef9f8ad5d0` | contenu 5 464 caractères, 2 exercices, 1 quiz, inactive : à préserver |
| A1 | 5. Fonction exponentielle népérienne | `2261f542-9481-4d49-9a72-54b71fdb9929` | vide, inactive, sans exercice ni quiz |
| A2 | 4. Fonction exponentielle népérienne | `f1ebf95d-9b61-40dc-b3a5-7a9699cac3be` | vide, inactive, sans exercice ni quiz |
| A1 | 7. Suites numériques | `221c3f88-b3cd-4287-9647-78f82e5928af` | vide, inactive, sans exercice ni quiz |
| A2 | 6. Suites numériques | `ac91de56-a15f-43ff-8baf-a2f4dcbe82b1` | vide, inactive, sans exercice ni quiz |

## Axes à conserver dans les nouveaux cours

### Fonction exponentielle

Le cours doit couvrir la notation `exp(x)=e^x`, l’inversion avec `ln`, la positivité de `e^x`, les règles de calcul, les limites en `+∞` et `−∞`, la croissance de l’exponentielle, les méthodes de résolution d’équations et d’inéquations, la dérivée de `e^u` et la primitive de `u'e^u`. La partie primitives doit être signalée comme propre à A1 dans le document source, sans la présenter comme une exigence spécifique à A2.

### Suites numériques

Le cours doit distinguer nettement suites arithmétiques et géométriques, avec les relations de récurrence, la raison, les expressions explicites, les critères de variation, les formules de sommes et les applications financières. Les notations et conditions doivent être explicitées : `q ≠ 1` pour une somme géométrique, `n ≥ p` pour les sommes entre deux rangs, et attention particulière aux suites géométriques de raison négative.

## Règles de création

Créer uniquement les quatre nouveaux cours, huit exercices et quatre quiz pour les cibles exponentielle et suites. Laisser toutes les nouvelles ressources en brouillon, inactives et non publiées. Utiliser une migration transactionnelle qui arrête l’écriture si une leçon n’est plus vide ou si une ressource de même titre existe déjà.
