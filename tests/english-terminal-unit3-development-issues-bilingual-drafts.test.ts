import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const generator = readFileSync("scripts/prepare-english-terminal-unit3-development-issues-bilingual-drafts-migration.mjs", "utf8");

describe("lot Anglais Terminale Unit 3 Development Issues bilingue", () => {
  it("cible les quatre offres Terminale et protège les leçons préexistantes contre l’écrasement", () => {
    expect(generator).toContain("81c5b295-b5d4-4a7c-a922-0604236a4aa8");
    expect(generator).toContain("0bc8f25a-432a-441b-8a86-303b452aaf9f");
    expect(generator).toContain("ff97ed10-ea0d-4e7e-9dd1-8010229c03b6");
    expect(generator).toContain("94543938-fd4c-4ba8-8205-35f765264719");
    expect(generator).toContain("écrasement interdit");
  });

  it("préserve le format bilingue et les deux compétences sources", () => {
    expect(generator).toContain("**Traduction française :**");
    expect(generator).toContain("Reading for comprehension: child marriage and human rights");
    expect(generator).toContain("Writing: write a clear article about a threatened indigenous way of life");
  });

  it("développe explicitement la méthode de rédaction d’article sans inventer un modèle source", () => {
    expect(generator).toContain("The paragraph plan required by the PDF");
    expect(generator).toContain("Write step by step");
    expect(generator).toContain("Guided mini-model: original practice, not a source article");
    expect(generator).toContain("250 to 300 words");
  });

  it("sépare deux exercices et deux quiz brouillons par série", () => {
    expect(generator).toContain("Exercise 1 — Reading: child marriage and evidence");
    expect(generator).toContain("Exercise 2 — Writing: build a responsible article");
    expect(generator).toContain("Bilingual quiz 2 — Writing: a responsible article");
    expect(generator).toContain("false,false");
  });
});
