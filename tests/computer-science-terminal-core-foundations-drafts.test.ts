import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const generator = readFileSync("scripts/prepare-computer-science-terminal-core-foundations-drafts-migration.mjs", "utf8");

describe("chapitre Informatique / TICE Terminale — bases fondamentales", () => {
  it("cible exactement les quatre offres Terminale officielles", () => {
    ["0beafff1-63db-42c9-99a2-8ef6da799f19", "7680fb4a-c9d4-41df-92f3-a91effda4944", "7695b4cf-0524-4de4-af91-f8d79eed2b0a", "f9c030a4-8b30-4657-b7bb-d81e4e500635"].forEach((id) => expect(generator).toContain(id));
  });
  it("définit trois fondamentaux progressifs sans les présenter comme programme officiel", () => {
    expect(generator).toContain("parcours complémentaire d’initiation, non officiel");
    expect(generator).toContain("Penser comme un informaticien : algorithmes et pseudo-code");
    expect(generator).toContain("Représenter et comprendre les données");
    expect(generator).toContain("Premiers programmes : variables, conditions et boucles");
  });
  it("prévoit cours, mises en situation, exercices corrigés et quiz séparés", () => {
    expect(generator).toContain("Mise en situation ${index + 1}");
    expect(generator).toContain("Exercice de consolidation ${index + 1}");
    expect(generator).toContain("Quiz ${index + 1}A");
    expect(generator).toContain("Quiz ${index + 1}B");
    ["exercise_questions", "quiz_questions", "quiz_answers"].forEach((table) => expect(generator).toContain(table));
  });
  it("garde les protections anti-doublon et les variables SQL sans ambiguïté", () => {
    expect(generator).toContain("duplication ou écrasement interdit");
    expect(generator).toContain("target_chapter_id uuid");
    expect(generator).toContain("target_lesson_id uuid");
    expect(generator).toContain("false,false,false");
    expect(generator).not.toContain("where chapter_id=chapter_id");
    expect(generator).not.toContain("where lesson_id=lesson_id");
  });
});
