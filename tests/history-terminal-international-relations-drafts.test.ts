import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  resolve(process.cwd(), "supabase/migrations/20260820_histoire_terminale_relations_internationales_drafts.sql"),
  "utf8",
);

describe("brouillons Histoire Terminale : relations internationales", () => {
  it("cible les titres confirmés des trois PDF pour les quatre séries", () => {
    expect(migration).toContain("Leçon 1 — L’Organisation des Nations Unies (ONU)");
    expect(migration).toContain("Leçon 2 — L’ère de la bipolarisation de 1947 à 1991");
    expect(migration).toContain("Leçon 3 — De la fin de la guerre froide à un monde multipolaire");
    expect(migration).toContain("series.name in ('A1', 'A2', 'C', 'D')");
  });

  it("crée uniquement le thème Histoire manquant pour C et D dans l’ordre officiel", () => {
    expect(migration).toContain("THÈME 1 — LES RELATIONS INTERNATIONALES DE 1945 À NOS JOURS");
    expect(migration).toContain("20, false, false");
    expect(migration).toContain("Création, objectifs, principes, fonctionnement, bilan et réformes de l’ONU.");
    expect(migration).toContain("10),");
    expect(migration).toContain("30)");
  });

  it("interdit l’écrasement et maintient séparés les brouillons", () => {
    expect(migration).toContain("coalesce(btrim(content), '') <> ''");
    expect(migration).toContain("is_active = false");
    expect(migration).toContain("public.exercises");
    expect(migration).toContain("public.exercise_questions");
    expect(migration).toContain("public.quizzes");
    expect(migration).toContain("public.quiz_questions");
    expect(migration).toContain("public.quiz_answers");
    expect(migration).toContain("where not exists");
  });
});
