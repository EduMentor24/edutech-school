import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");
const migration = readFileSync(
  resolve(root, "supabase/migrations/20260824_publish_physics_chemistry_terminal_cd_remaining_drafts.sql"),
  "utf8",
);

describe("publication des brouillons Physique-Chimie Terminale C/D restants", () => {
  it("limite le périmètre aux séries scientifiques et aux six leçons complètes", () => {
    expect(migration).toContain("subject.name = 'Physique-Chimie'");
    expect(migration).toContain("series.name in ('C', 'D')");
    expect(migration).toContain("lesson_count <> 6");
    expect(migration).toContain("not lesson.is_active");
    expect(migration).toContain("not lesson.is_test_data");
  });

  it("refuse un volume ou une correction inattendus avant toute activation", () => {
    for (const expectation of ["exercise_count <> 12", "exercise_question_count <> 48", "quiz_count <> 12", "quiz_answer_count <> 144", "correct_answer_count <> 48", "count(answer.id) <> 3", "count(answer.id) filter (where answer.is_correct) <> 1"]) {
      expect(migration).toContain(expectation);
    }
  });

  it("n’altère aucun texte pédagogique et exclut les données de test", () => {
    expect(migration).toContain("set is_published = true, is_active = true");
    expect(migration).not.toContain("insert into public.lessons");
    expect(migration).not.toContain("delete from public.lessons");
    expect(migration).not.toContain("set content =");
  });
});
