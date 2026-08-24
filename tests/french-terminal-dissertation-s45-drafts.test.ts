import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const source = readFileSync(resolve(import.meta.dirname, "../scripts/prepare-french-terminal-dissertation-s45-drafts-migration.mjs"), "utf8");

describe("séances 4 et 5 de dissertation littéraire", () => {
  it("prévoit les deux séances confirmées dans l’ordre pédagogique", () => {
    expect(source).toContain("Séance 4 : Rédiger l’introduction et la conclusion");
    expect(source).toContain("Séance 5 : Rédiger une partie de développement");
    expect(source).toContain("order: 40");
    expect(source).toContain("order: 50");
  });
  it("préserve les garde-fous de rattachement, ordre et brouillon", () => {
    expect(source).toContain("Les séances 1 à 3 sont requises");
    expect(source).toContain("duplication ou écrasement interdit");
    expect(source).toContain("false,false");
    expect(source).toContain("Les quatre offres Français Terminale officielles sont requises");
  });
  it("crée des exercices et quiz séparés pour chaque séance", () => {
    expect(source).toContain("Exercice d’application");
    expect(source).toContain("Exercice de consolidation");
    expect(source).toContain("quiz_questions");
    expect(source).toContain("quiz_answers");
  });
});
