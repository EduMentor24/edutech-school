import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const home = readFileSync("app/(tabs)/index.tsx", "utf8");
const courses = readFileSync("app/(tabs)/courses.tsx", "utf8");

describe("rafraîchissement de la progression élève", () => {
  it("charge les progrès de cours et les évaluations soumises au retour sur l’accueil", () => {
    expect(home).toContain("useFocusEffect");
    expect(home).toContain("getLearningProgress({ forceRefresh: true })");
    expect(home).toContain("getExerciseCatalog({ cacheContext, forceRefresh: true })");
    expect(home).toContain("getQuizCatalog({ cacheContext, forceRefresh: true })");
    expect(home).toContain('exercise.lastStatus === "submitted"');
    expect(home).toContain('quiz.lastStatus === "submitted"');
  });

  it("rafraîchit les compteurs Cours au retour d’une leçon", () => {
    expect(courses).toContain("subscribeToLearningProgress");
    expect(courses).toContain("getLearningProgress({ forceRefresh: true })");
    expect(courses).toContain("void load()");
  });
});
