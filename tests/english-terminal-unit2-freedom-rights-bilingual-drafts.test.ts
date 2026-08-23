import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const generator = readFileSync("scripts/prepare-english-terminal-unit2-freedom-rights-bilingual-drafts-migration.mjs", "utf8");

describe("lot Anglais Terminale Unit 2 Freedom and Rights bilingue", () => {
  it("cible les quatre offres Terminale existantes sans créer de doublon", () => {
    expect(generator).toContain("81c5b295-b5d4-4a7c-a922-0604236a4aa8");
    expect(generator).toContain("0bc8f25a-432a-441b-8a86-303b452aaf9f");
    expect(generator).toContain("ff97ed10-ea0d-4e7e-9dd1-8010229c03b6");
    expect(generator).toContain("94543938-fd4c-4ba8-8205-35f765264719");
    expect(generator).toContain("Une unité Freedom and Civil Rights cible contient déjà du contenu");
  });

  it("préserve le format bilingue et les trois compétences des PDF", () => {
    expect(generator).toContain("**Traduction française :**");
    expect(generator).toContain("Listening for comprehension");
    expect(generator).toContain("Reading for comprehension");
    expect(generator).toContain("Writing: an informal letter");
  });

  it("approfondit la méthode de lettre informelle sans inventer la lettre source absente", () => {
    expect(generator).toContain("The five-paragraph plan from the PDF");
    expect(generator).toContain("Build your informal letter step by step");
    expect(generator).toContain("Guided mini-model: structure, not a source quotation");
    expect(generator).toContain("250 to 300 words");
  });

  it("sépare trois exercices et trois quiz brouillons par série", () => {
    expect(generator).toContain("Exercise 1 — Listening: Human Rights and disability inclusion");
    expect(generator).toContain("Exercise 2 — Reading: freedom, evidence and children’s rights");
    expect(generator).toContain("Exercise 3 — Writing: organise an informal reply to a friend");
    expect(generator).toContain("Bilingual quiz 3 — Writing: an informal letter");
    expect(generator).toContain("false,false");
  });
});
