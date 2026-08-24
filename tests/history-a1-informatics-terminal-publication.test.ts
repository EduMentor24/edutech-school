import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");
const migration = readFileSync(
  resolve(root, "supabase/migrations/20260824_publish_history_a1_evaluations_and_informatics_terminal.sql"),
  "utf8",
);

describe("publication Histoire-Géographie A1 et Informatique / TICE Terminale", () => {
  it("fige les deux périmètres et les volumes attendus", () => {
    expect(migration).toContain("subject.name = 'Histoire-Géographie'");
    expect(migration).toContain("series.name = 'A1'");
    expect(migration).toContain("subject.name = 'Informatique / TICE'");
    expect(migration).toContain("series.name in ('A1', 'A2', 'C', 'D')");
    expect(migration).toContain("information_lesson_count <> 56");
    expect(migration).toContain("information_inactive_lesson_count <> 42");
    expect(migration).toContain("history_draft_exercise_count <> 28");
    expect(migration).toContain("history_draft_quiz_count <> 14");
  });

  it("refuse les questions, réponses ou corrections incomplètes", () => {
    for (const expectation of ["<> 8", "<> 24", "count(answer.id) <> 3", "count(answer.id) <> 2", "question.prompt_markdown", "question.explanation_markdown", "answer.is_correct"]) {
      expect(migration).toContain(expectation);
    }
  });

  it("active sans créer, supprimer ou écraser les contenus existants", () => {
    expect(migration).toContain("set is_published = true, is_active = true");
    expect(migration).toContain("set is_active = true");
    expect(migration).not.toContain("insert into public.lessons");
    expect(migration).not.toContain("delete from public.lessons");
    expect(migration).not.toContain("set content =");
  });
});
