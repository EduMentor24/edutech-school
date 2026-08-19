import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const migration = readFileSync(
  resolve(process.cwd(), "supabase/migrations/20260818_mathematiques_terminale_c_derivabilite_primitives_drafts.sql"),
  "utf8",
);

describe("migration Mathématiques Terminale C", () => {
  it("cible exactement les deux leçons confirmées et bloque tout écrasement", () => {
    expect(migration).toContain("b87a86fd-6892-4ca5-9585-4965b1a057bf");
    expect(migration).toContain("5f52ef2e-138e-4ad5-b85b-1df6c416cc23");
    expect(migration).toContain("series.name = 'C'");
    expect(migration).toContain("aucun écrasement automatique n’est autorisé");
    expect(migration).not.toContain("Géométrie analytique de l’espace");
  });

  it("maintient tous les nouveaux contenus et activités à l’état de brouillon", () => {
    expect(migration).toContain("content = lesson_content, is_active = false");
    expect(migration).toContain("is_published, is_active");
    expect(migration).toContain("false, false");
  });

  it("sépare le cours, les exercices corrigés et les quiz", () => {
    expect(migration).toContain("public.lessons");
    expect(migration).toContain("public.exercises");
    expect(migration).toContain("public.exercise_questions");
    expect(migration).toContain("public.quizzes");
    expect(migration).toContain("public.quiz_questions");
    expect(migration).toContain("public.quiz_answers");
  });
});
