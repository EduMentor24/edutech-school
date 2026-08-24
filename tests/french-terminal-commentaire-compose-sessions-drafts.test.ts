import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
const source=readFileSync(resolve(import.meta.dirname,"../scripts/prepare-french-terminal-commentaire-compose-sessions-drafts-migration.mjs"),"utf8");
describe("séances Commentaire composé Terminale",()=>{
 it("prévoit les trois séances ordonnées",()=>{ expect(source).toContain("Séance 1 : Analyser la construction et l’organisation"); expect(source).toContain("Séance 2 : Rédiger les centres d’intérêt"); expect(source).toContain("Séance 3 : Rédiger un commentaire composé"); expect(source).toContain("order: 10"); expect(source).toContain("order: 20"); expect(source).toContain("order: 30"); });
 it("crée seulement la leçon A2 absente et protège les contenus existants",()=>{ expect(source).toContain("target.series_name<>'A2'"); expect(source).toContain("Leçon 2 : LE COMMENTAIRE COMPOSÉ"); expect(source).toContain("duplication ou écrasement interdit"); expect(source).toContain("possède déjà un contenu : écrasement interdit"); });
 it("conserve exercices et quiz séparés en brouillon",()=>{ expect(source).toContain("Exercice d’application"); expect(source).toContain("Exercice de consolidation"); expect(source).toContain("quiz_questions"); expect(source).toContain("quiz_answers"); expect(source).toContain("false,false"); });
});
