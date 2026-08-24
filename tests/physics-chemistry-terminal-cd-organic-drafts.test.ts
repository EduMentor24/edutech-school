import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const source = readFileSync("scripts/prepare-physics-chemistry-terminal-cd-organic-drafts-migration.mjs", "utf8");

describe("Physique-Chimie Terminale C/D — chimie organique", () => {
  it("couvre les trois leçons sources pour C et D", () => {
    expect(source).toContain('title: "Les alcools"');
    expect(source).toContain('title: "Composés carbonylés : aldéhydes et cétones"');
    expect(source).toContain('title: "Les amines"');
    expect(source).toContain("se.name in ('C','D')");
  });

  it("crée seulement la leçon Les amines manquante en Terminale C", () => {
    expect(source).toContain("if target.series_name='C'");
    expect(source).toContain("if not exists");
    expect(source).toContain("values (target_chapter_id");
    expect(source).toContain("'',50,false,false");
  });

  it("interdit tout écrasement et garde cours, exercices et quiz en brouillon", () => {
    expect(source).toContain("écrasement interdit");
    expect(source).toContain("duplication interdite");
    expect(source).toContain("false,false,18");
    expect(source).toContain("false,false,false");
  });
});
