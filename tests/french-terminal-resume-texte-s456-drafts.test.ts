import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const source = readFileSync("scripts/prepare-french-terminal-resume-texte-s456-drafts-migration.mjs", "utf8");

describe("Résumé de texte argumentatif Terminale — séances 4 à 6", () => {
  it("prolonge les trois séances existantes dans l’ordre", () => {
    expect(source).toContain("Séance 4 : Identifier la situation d’argumentation");
    expect(source).toContain("Séance 5 : Reformuler les idées essentielles");
    expect(source).toContain("Séance 6 : Rédiger et contrôler le résumé final");
    expect(source).toContain("s.display_order in (10,20,30)");
  });

  it("conserve les garde-fous des quatre séries et interdit les doublons", () => {
    expect(source).toContain("offering_count<>4");
    expect(source).toContain("s.display_order in (40,50,60)");
    expect(source).toContain("l.title ilike '%RÉSUMÉ DU TEXTE ARGUMENTATIF%'");
    expect(source).toContain("duplication ou écrasement interdit");
  });

  it("crée deux exercices et deux quiz séparés par séance en brouillon", () => {
    expect(source).toContain("Exercice d’application");
    expect(source).toContain("Exercice de consolidation");
    expect(source).toContain("Quiz ${label} — ${session.title}");
    expect(source).toContain("false,false,false");
  });
});
