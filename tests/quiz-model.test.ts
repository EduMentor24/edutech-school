import { describe, expect, it } from "vitest";
import { answeredQuizCount, formatQuizDuration, humanQuizDifficulty, quizAttemptAction, quizFeedback, remainingQuizSeconds } from "../lib/quizzes/quiz-model";

describe("modèle Quiz", () => {
  it("détermine les libellés et messages fondés sur le résultat", () => {
    expect(humanQuizDifficulty("easy")).toBe("Facile");
    expect(quizAttemptAction(0)).toBe("Commencer");
    expect(quizAttemptAction(2)).toBe("Recommencer");
    expect(quizFeedback(90)).toBe("Excellent travail !");
    expect(quizFeedback(49)).toContain("notions essentielles");
  });

  it("compte les réponses présentes sans inventer de résultat", () => {
    expect(answeredQuizCount({ a: ["1"], b: [], c: "texte" })).toBe(2);
  });

  it("calcule et formate une durée facultative", () => {
    expect(remainingQuizSeconds("2026-08-14T10:00:00.000Z", 2, new Date("2026-08-14T10:01:30.000Z").getTime())).toBe(30);
    expect(formatQuizDuration(30)).toBe("00:30");
    expect(remainingQuizSeconds("2026-08-14T10:00:00.000Z", null)).toBeNull();
  });
});
