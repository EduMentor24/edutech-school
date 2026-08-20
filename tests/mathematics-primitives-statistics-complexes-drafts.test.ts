import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  resolve(process.cwd(), "supabase/migrations/20260820_mathematiques_primitives_statistiques_nombres_complexes_drafts.sql"),
  "utf8",
);

describe("brouillons Mathématiques : primitives, statistiques et nombres complexes", () => {
  it("cible les quatre leçons existantes et crée la structure A2 manquante en dernière position", () => {
    expect(migration).toContain("2444e45b-60dd-4101-a9ce-0a11c3aac3d5");
    expect(migration).toContain("fa4221bc-9fa9-4912-b6b1-0c8ef3f33698");
    expect(migration).toContain("80d19d0b-9e2a-46a5-a03c-4e417fa3e401");
    expect(migration).toContain("c79206ee-b079-46cb-8863-9229cf2364f7");
    expect(migration).toContain("8. Primitives et calcul intégral");
    expect(migration).toContain("max(l.display_order) + 10");
  });

  it("protège les cours existants et impose des brouillons non publiés", () => {
    expect(migration).toContain("coalesce(btrim(content), '') <> ''");
    expect(migration).toContain("is_active = false");
    expect(migration).toContain("false, false");
    expect(migration).toContain("where not exists");
  });

  it("sépare les cours, exercices et quiz et réserve les moindres carrés à A1", () => {
    expect(migration).toContain("public.lessons");
    expect(migration).toContain("public.exercises");
    expect(migration).toContain("public.exercise_questions");
    expect(migration).toContain("public.quizzes");
    expect(migration).toContain("public.quiz_questions");
    expect(migration).toContain("public.quiz_answers");
    expect(migration).toContain("statistics_a1");
    expect(migration).toContain("Série A1 seulement");
  });
});
