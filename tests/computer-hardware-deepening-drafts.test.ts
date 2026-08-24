import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
const source = readFileSync("scripts/prepare-computer-hardware-deepening-drafts-migration.mjs", "utf8");
describe("approfondissement matériel informatique", () => {
  it("prévoit trois leçons progressives et trois visuels pédagogiques", () => { ["Comprendre le cœur de l’ordinateur", "Connecter les périphériques", "Travailler efficacement", ":::computer-hardware-diagram", ":::computer-ports-visual", ":::computer-workspace-visual"].forEach((value) => expect(source).toContain(value)); });
  it("crée des exercices et quiz séparés en brouillon", () => { ["exercise_questions", "quiz_questions", "quiz_answers", "false,false,false"].forEach((value) => expect(source).toContain(value)); });
  it("annote seulement les quatre brouillons Matériel et protège des doublons", () => { expect(source).toContain("material_count<>4"); expect(source).toContain("l.is_active=false"); expect(source).toContain("duplication interdite"); expect(source).not.toContain("where chapter_id=chapter_id"); });
});
