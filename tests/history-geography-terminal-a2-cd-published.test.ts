import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");
const migration = readFileSync(
  resolve(root, "supabase/migrations/20260824_publish_history_geography_terminal_a2_c_d_drafts.sql"),
  "utf8",
);

describe("publication Histoire-Géographie Terminale A2/C/D", () => {
  it("exclut strictement A1 et fige le périmètre des 42 leçons complètes", () => {
    expect(migration).toContain("subject.name = 'Histoire-Géographie'");
    expect(migration).toContain("series.name in ('A2', 'C', 'D')");
    expect(migration).not.toContain("series.name in ('A1', 'A2', 'C', 'D')");
    expect(migration).toContain("target_count <> 42");
    expect(migration).toContain("not lesson.is_test_data");
  });

  it("ne sélectionne que les leçons possédant un contenu pédagogique non vide", () => {
    expect(migration).toContain("coalesce(btrim(lesson.content), '') <> ''");
    expect(migration).toContain("public.lesson_sessions");
    expect(migration).toContain("coalesce(btrim(session.content), '') <> ''");
  });

  it("refuse toute évaluation incomplète avant de publier", () => {
    for (const expectation of ["<> 2", "<> 6", "<> 1", "<> 4", "<> 8"]) {
      expect(migration).toContain(expectation);
    }
    expect(migration).toContain("question.prompt_markdown");
    expect(migration).toContain("question.correct_answers");
    expect(migration).toContain("count(answer.id) filter (where answer.is_correct) <> 1");
  });

  it("active les seules ressources validées sans modifier leurs contenus", () => {
    expect(migration).toContain("set is_active = true");
    expect(migration).toContain("set is_published = true, is_active = true");
    expect(migration).not.toContain("insert into public.lessons");
    expect(migration).not.toContain("delete from public.lessons");
    expect(migration).not.toContain("set content =");
  });
});
