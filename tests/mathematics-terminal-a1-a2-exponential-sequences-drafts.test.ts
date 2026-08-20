import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const migration = readFileSync(
  resolve(process.cwd(), "supabase/migrations/20260820_mathematiques_terminale_a1_a2_exponentielle_suites_drafts.sql"),
  "utf8",
);

describe("brouillons Mathématiques Terminale A1/A2 : exponentielle et suites", () => {
  it("cible exactement les quatre leçons vides confirmées", () => {
    expect(migration).toContain("2261f542-9481-4d49-9a72-54b71fdb9929");
    expect(migration).toContain("f1ebf95d-9b61-40dc-b3a5-7a9699cac3be");
    expect(migration).toContain("221c3f88-b3cd-4287-9647-78f82e5928af");
    expect(migration).toContain("ac91de56-a15f-43ff-8baf-a2f4dcbe82b1");
    expect(migration).not.toContain("aec347c0-a680-4ef1-b4f6-67947a1e600c");
    expect(migration).not.toContain("50398ee8-8130-47eb-ad7c-f2ef9f8ad0");
  });

  it("protège les brouillons contre l’écrasement, l’activation et la publication", () => {
    expect(migration).toContain("coalesce(btrim(content), '') <> ''");
    expect(migration).toContain("is_active = false");
    expect(migration).toContain("is_published, is_active");
    expect(migration).toContain("where not exists");
  });

  it("conserve séparés le cours, les exercices et les quiz", () => {
    expect(migration).toContain("public.lessons");
    expect(migration).toContain("public.exercises");
    expect(migration).toContain("public.exercise_questions");
    expect(migration).toContain("public.quizzes");
    expect(migration).toContain("public.quiz_questions");
    expect(migration).toContain("public.quiz_answers");
  });
});
