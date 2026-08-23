import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const generator = readFileSync("scripts/prepare-english-terminal-unit1-lifestyle-bilingual-drafts-migration.mjs", "utf8");

describe("lot Anglais Terminale Unit 1 Lifestyle bilingue", () => {
  it("cible les quatre offres Terminale et crée la structure A2 uniquement si elle manque", () => {
    expect(generator).toContain("81c5b295-b5d4-4a7c-a922-0604236a4aa8");
    expect(generator).toContain("0bc8f25a-432a-441b-8a86-303b452aaf9f");
    expect(generator).toContain("ff97ed10-ea0d-4e7e-9dd1-8010229c03b6");
    expect(generator).toContain("94543938-fd4c-4ba8-8205-35f765264719");
    expect(generator).toContain("target.series_name='A2'");
  });

  it("préserve les contenus déjà remplis et garde tous les nouveaux modules en brouillon", () => {
    expect(generator).toContain("Une unité Lifestyle cible contient déjà du contenu");
    expect(generator).toContain("La leçon Lifestyle de la série % n’est pas vide");
    expect(generator).toContain("is_published,is_active");
    expect(generator).toContain("false,false");
  });

  it("conserve la traduction française immédiate et approfondit spécifiquement l’écriture", () => {
    expect(generator).toContain("**Traduction française :**");
    expect(generator).toContain("A formal letter of complaint");
    expect(generator).toContain("The seven visible parts of the letter");
    expect(generator).toContain("Build the body paragraph by paragraph");
    expect(generator).toContain("Writing synthesis");
  });

  it("sépare le cours, les exercices de lecture/écriture et les deux quiz", () => {
    expect(generator).toContain("Exercise 1 — Reading: Sanga’s migrant story");
    expect(generator).toContain("Exercise 2 — Writing: build a formal complaint letter");
    expect(generator).toContain("Bilingual quiz 1 — Reading: a migrant’s story");
    expect(generator).toContain("Bilingual quiz 2 — Writing: a formal letter of complaint");
  });
});
