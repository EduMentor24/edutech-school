import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { parseLessonMarkdown } from "../lib/lessons/markdown-parser";

const root = resolve(import.meta.dirname, "..");
const script = readFileSync(resolve(root, "scripts/prepare-physics-chemistry-terminal-cd-mechanics-published-migration.mjs"), "utf8");

describe("lot Physique-Chimie mécanique Terminale C/D publié", () => {
  it("déclare les cinq cours sources, les séries C/D et la création strictement ciblée en D", () => {
    for (const title of ["Cinématique du point", "Mouvement du centre d'inertie d’un solide", "Interaction gravitationnelle", "Oscillations mécaniques libres"]) expect(script).toContain(title);
    expect(script).toContain('createFor: ["D"], createOrder: 25');
    expect(script).toContain("PHYSIQUE — MÉCANIQUE");
  });

  it("prévoit deux exercices, deux quiz actifs et les protections anti-écrasement", () => {
    expect(script).toContain("écrasement interdit");
    expect(script).toContain("duplication interdite");
    expect(script).toContain("is_published,is_active,is_test_data");
    expect(script).toContain("true,true,false");
  });

  it("attache des schémas interactifs uniquement aux leçons de chimie concernées", () => {
    expect(script).toContain(":::chemistry-reaction-carboxylic");
    expect(script).toContain(":::chemistry-reaction-soap");
    expect(script).toContain(":::chemistry-reaction-acid-base");
    expect(script).toContain("position(chemistry_target.marker");
  });

  it("reconnaît les trois blocs de schéma interactif dans le lecteur", () => {
    const blocks = parseLessonMarkdown(":::chemistry-reaction-carboxylic\n:::chemistry-reaction-soap\n:::chemistry-reaction-acid-base");
    expect(blocks).toEqual([
      { type: "chemistry_reaction", reaction: "carboxylic" },
      { type: "chemistry_reaction", reaction: "soap" },
      { type: "chemistry_reaction", reaction: "acid_base" },
    ]);
  });
});
