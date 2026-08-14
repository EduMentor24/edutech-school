import { describe, expect, it } from "vitest";
import { ExerciseCatalogItem, getExerciseFilterOptions, humanDifficulty, isAutoGradable, resultLabel, visibleCatalogItems } from "../lib/exercises/exercise-model";

const catalog: ExerciseCatalogItem[] = [
  { exerciseId: "one", title: "A", statement: "", exerciseType: "single_choice", difficulty: "easy", estimatedDurationMinutes: 5, displayOrder: 10, subjectId: "subject-a", subjectName: "Philosophie", chapterId: "chapter-a", chapterTitle: "Méthodologie", lessonId: "lesson-a", lessonTitle: "Leçon A", attemptCount: 0, lastPercentage: null, bestPercentage: null, lastStatus: null },
  { exerciseId: "two", title: "B", statement: "", exerciseType: "free_response", difficulty: null, estimatedDurationMinutes: null, displayOrder: 20, subjectId: "subject-b", subjectName: "Français", chapterId: "chapter-b", chapterTitle: "Expression", lessonId: "lesson-b", lessonTitle: "Leçon B", attemptCount: 2, lastPercentage: null, bestPercentage: null, lastStatus: "review_required" },
];

describe("modèle Exercices", () => {
  it("n’expose que les options de filtres réellement présentes dans le catalogue", () => { const options = getExerciseFilterOptions(catalog); expect(options.subjects).toEqual(["Philosophie", "Français"]); expect(options.difficulties).toEqual(["easy"]); });
  it("filtre les exercices avec les identifiants pédagogiques sans ajouter de résultat fictif", () => { expect(visibleCatalogItems(catalog, { subjectId: "subject-a", difficulty: "easy" }).map((item) => item.exerciseId)).toEqual(["one"]); expect(visibleCatalogItems(catalog, { chapterId: "unknown" })).toEqual([]); });
  it("distingue les types automatiquement corrigeables et les résultats à consulter", () => { expect(isAutoGradable("multiple_choice")).toBe(true); expect(isAutoGradable("free_response")).toBe(false); expect(resultLabel("review_required", null)).toBe("Correction à consulter"); expect(humanDifficulty("hard")).toBe("Difficile"); });
});
