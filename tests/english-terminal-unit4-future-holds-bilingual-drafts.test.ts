import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const generator = readFileSync("scripts/prepare-english-terminal-unit4-future-holds-bilingual-drafts-migration.mjs", "utf8");

describe("lot Anglais Terminale Unit 4 What the Future Holds bilingue", () => {
  it("cible les quatre offres Terminale et prépare l’unité A2 seulement si elle est absente", () => {
    expect(generator).toContain("81c5b295-b5d4-4a7c-a922-0604236a4aa8");
    expect(generator).toContain("0bc8f25a-432a-441b-8a86-303b452aaf9f");
    expect(generator).toContain("ff97ed10-ea0d-4e7e-9dd1-8010229c03b6");
    expect(generator).toContain("94543938-fd4c-4ba8-8205-35f765264719");
    expect(generator).toContain("const a2OfferingId = \"0bc8f25a-432a-441b-8a86-303b452aaf9f\"");
    expect(generator).toContain("target.offering_id=${sqlText(a2OfferingId)}");
  });

  it("préserve le bilinguisme, le futur parfait et la lettre formelle", () => {
    expect(generator).toContain("**Traduction française :**");
    expect(generator).toContain("will have + past participle");
    expect(generator).toContain("Formal request letter");
    expect(generator).toContain("tree-planting project");
  });

  it("annote le vocabulaire complexe Reading pour le survol sans l’imposer au PDF", () => {
    expect(generator).toContain("[[urbanize|s’urbaniser|");
    expect(generator).toContain("[[tipping point|point critique|");
  });

  it("crée deux exercices et deux quiz brouillons par série sans écraser de contenu", () => {
    expect(generator).toContain("écrasement interdit");
    expect(generator).toContain("Exercise 1 — Reading: future urbanisation and evidence");
    expect(generator).toContain("Exercise 2 — Writing: causes, effects and a formal request");
    expect(generator).toContain("false,false");
  });
});
