import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");
const migration = readFileSync(resolve(root, "supabase/migrations/20260824_publish_terminal_core_subject_evaluations.sql"), "utf8");

describe("publication des évaluations Terminale Philosophie, Mathématiques et Français", () => {
  it("restreint la publication aux trois matières et aux quatre séries Terminale", () => {
    expect(migration).toContain("subject.name in ('Philosophie','Mathématiques','Français')");
    expect(migration).toContain("ser.name in ('A1','A2','C','D')");
    expect(migration).toContain("level.name='Terminale'");
    expect(migration).toContain("exercise_count <> 205 or quiz_count <> 179");
  });

  it("préserve les leçons et exclut les évaluations incomplètes ou de test", () => {
    expect(migration).toContain("lesson.is_active");
    expect(migration).toContain("public.lesson_sessions");
    expect(migration).toContain("not exercise.is_test_data");
    expect(migration).toContain("not quiz.is_test_data");
    expect(migration).toContain("response.is_correct");
    expect(migration).not.toContain("update public.lessons");
    expect(migration).not.toContain("delete from");
  });
});
