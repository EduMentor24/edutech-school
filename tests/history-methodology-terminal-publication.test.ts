import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  resolve(import.meta.dirname, "../supabase/migrations/20260825_publish_history_methodology_terminal_complete.sql"),
  "utf8",
);

describe("publication méthodologie Histoire-Géographie Terminale", () => {
  it("refuse toute publication si un cours ou une évaluation est incomplet", () => {
    expect(migration).toContain("lesson_count <> 8");
    expect(migration).toContain("exercise_count <> 16");
    expect(migration).toContain("exercise_question_count <> 64");
    expect(migration).toContain("quiz_count <> 8");
    expect(migration).toContain("quiz_question_count <> 32");
    expect(migration).toContain("quiz_answer_count <> 96");
    expect(migration).toContain("quiz_correct_count <> 32");
  });

  it("active strictement les huit cours et leurs évaluations dans les quatre séries Terminale", () => {
    expect(migration).toContain("activated_lesson_count <> 8");
    expect(migration).toContain("activated_chapter_count <> 4");
    expect(migration).toContain("published_exercise_count <> 16");
    expect(migration).toContain("published_quiz_count <> 8");
    expect(migration).toContain("serie.name in ('A1', 'A2', 'C', 'D')");
  });

  it("n’écrit ni données de test ni suppression", () => {
    expect(migration).toContain("is_test_data = false");
    expect(migration).not.toMatch(/delete\s+from/i);
  });
});
