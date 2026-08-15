export type QuizDifficulty = "easy" | "medium" | "hard";
export type QuizQuestionType = "single_choice" | "multiple_choice" | "true_false" | "short_answer";
export type QuizAttemptStatus = "in_progress" | "submitted" | "review_required" | "expired";

export function humanQuizDifficulty(value: QuizDifficulty | null) {
  if (value === "easy") return "Facile";
  if (value === "hard") return "Difficile";
  return value === "medium" ? "Intermédiaire" : "";
}

export function quizAttemptAction(attemptCount: number) {
  return attemptCount > 0 ? "Recommencer" : "Commencer";
}

export function quizResultLabel(status: QuizAttemptStatus | null, percentage: number | null) {
  if (status === "in_progress") return "Tentative en cours";
  if (status === "review_required") return "Révision requise";
  if (status === "expired") return "Temps écoulé";
  if (percentage === null) return "Soumis";
  return `${Math.round(percentage)} %`;
}

export function quizFeedback(percentage: number | null) {
  if (percentage === null) return "Votre tentative sera révisée par l’administration.";
  if (percentage >= 90) return "Excellent travail !";
  if (percentage >= 70) return "Très bon résultat.";
  if (percentage >= 50) return "Bon début. Continue tes révisions.";
  return "Reprends les notions essentielles et réessaie.";
}

export function remainingQuizSeconds(startedAt: string, durationMinutes: number | null, now = Date.now()) {
  if (!durationMinutes) return null;
  const started = new Date(startedAt).getTime();
  if (!Number.isFinite(started)) return 0;
  return Math.max(0, Math.ceil((started + durationMinutes * 60_000 - now) / 1000));
}

export function formatQuizDuration(seconds: number | null) {
  if (seconds === null) return null;
  const minutes = Math.floor(Math.max(0, seconds) / 60);
  const remainder = Math.max(0, seconds) % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

export function answeredQuizCount(answers: Record<string, unknown>) {
  return Object.values(answers).filter((value) => Array.isArray(value) ? value.length > 0 : Boolean(value)).length;
}
