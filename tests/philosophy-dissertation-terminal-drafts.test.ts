import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const migration = readFileSync(
  join(process.cwd(), "supabase/migrations/20260818_philosophie_dissertation_approfondie_terminales_drafts.sql"),
  "utf8",
);

describe("brouillons approfondis de dissertation philosophique — Terminale", () => {
  it("cible strictement les quatre leçons Terminale confirmées, sans créer de structure Première", () => {
    [
      "e89a1557-6308-4d51-8565-4fb5b1a479e6",
      "f6759b97-8322-44ac-8c1f-33655dffd422",
      "e56a0b7f-9337-4b03-bc2a-8a482e4090d3",
      "d6f4155b-0744-4e1e-b60c-3d969ae18cd7",
    ].forEach((lessonId) => expect(migration).toContain(lessonId));

    expect(migration).toContain("level.name = 'Terminale'");
    expect(migration).toContain("series.name in ('A1', 'A2', 'C', 'D')");
    expect(migration).not.toContain("level.name = 'Première'");
  });

  it("préserve le cours A1 existant et refuse tout écrasement des trois cibles vides", () => {
    expect(migration).toContain("when l.id = 'e89a1557-6308-4d51-8565-4fb5b1a479e6'::uuid then 'a1_existing'");
    expect(migration).toContain("if target.lesson_key = 'draft_content' and exists");
    expect(migration).toContain("if target.lesson_key = 'draft_content' then");
    expect(migration).toContain("coalesce(btrim(content), '') = ''");
  });

  it("sépare cours, exercices et quiz et conserve chaque ressource au brouillon", () => {
    expect(migration).toContain("insert into public.exercises");
    expect(migration).toContain("insert into public.exercise_questions");
    expect(migration).toContain("insert into public.quizzes");
    expect(migration).toContain("insert into public.quiz_questions");
    expect(migration).toContain("insert into public.quiz_answers");
    expect(migration).toContain("false, false, 14, 10");
    expect(migration).toContain("false, false, 16, 20");
    expect(migration).toContain("14, 10, false, false");
  });
});
