import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const source = readFileSync(resolve(root, "scripts/prepare-french-terminal-dissertation-sessions-drafts-migration.mjs"), "utf8");

describe("lot Dissertation littéraire Terminale par séances", () => {
  it("prévoit trois séances ordonnées et approfondies", () => {
    expect(source).toContain("Séance 1 : Analyser le sujet");
    expect(source).toContain("Séance 2 : Rechercher les idées");
    expect(source).toContain("Séance 3 : Élaborer un plan");
    expect(source).toContain("information");
    expect(source).toContain("problématique");
    expect(source).toContain("plan dialectique");
  });
  it("protège les brouillons, évite les doublons et prévoit les quatre séries", () => {
    expect(source).toContain("lesson_sessions");
    expect(source).toContain("Les quatre offres Français Terminale officielles sont requises");
    expect(source).toContain("duplication ou écrasement interdit");
    expect(source).toContain("is_published,is_active");
    expect(source).toContain("false,false");
    expect(source).toContain("target.series_name<>'A2'");
  });
  it("maintient exercices et quiz séparés pour chaque séance", () => {
    expect(source).toContain("exercise_questions");
    expect(source).toContain("quiz_questions");
    expect(source).toContain("quiz_answers");
    expect(source).toContain("Exercice d’application");
    expect(source).toContain("A — Repères");
  });
});
