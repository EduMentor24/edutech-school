import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  resolve(import.meta.dirname, "../supabase/migrations/20260825_enrich_history_methodology_terminal_evaluations_drafts.sql"),
  "utf8",
);

describe("évaluations méthodologie Histoire-Géographie Terminale", () => {
  it("enrichit les huit cours avec des applications guidées sans les publier prématurément", () => {
    expect(migration).toContain("target_count <> 8");
    expect(migration).toContain("## Application guidée — Exemple méthodologique");
    expect(migration).toContain("Situation d’entraînement fictive");
    expect(migration).toContain("Sujet d’entraînement");
    expect(migration).toContain("lesson.is_active = false");
  });

  it("crée des exercices corrigés et un quiz interactif complet pour chaque leçon", () => {
    expect(migration).toContain("final_exercise_count <> 16");
    expect(migration).toContain("final_exercise_question_count <> 64");
    expect(migration).toContain("final_quiz_count <> 8");
    expect(migration).toContain("final_quiz_question_count <> 32");
    expect(migration).toContain("final_quiz_answer_count <> 96");
    expect(migration).toContain("is_correct, display_order");
  });

  it("préserve les données existantes et exclut les données de test", () => {
    expect(migration).toContain("existing_evaluation_count <> 0");
    expect(migration).toContain("is_test_data = false");
    expect(migration).not.toMatch(/delete\s+from/i);
  });
});
