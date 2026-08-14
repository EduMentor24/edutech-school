export type ExerciseType = "single_choice" | "multiple_choice" | "true_false" | "short_answer" | "free_response";
export type ExerciseDifficulty = "easy" | "medium" | "hard";
export type ExerciseAttemptStatus = "in_progress" | "submitted" | "review_required";

export type ExerciseCatalogItem = {
  exerciseId: string;
  title: string;
  statement: string;
  exerciseType: ExerciseType;
  difficulty: ExerciseDifficulty | null;
  estimatedDurationMinutes: number | null;
  displayOrder: number;
  subjectId?: string;
  subjectName: string;
  chapterId?: string;
  chapterTitle: string;
  lessonId?: string;
  lessonTitle: string;
  attemptCount: number;
  lastPercentage: number | null;
  bestPercentage: number | null;
  lastStatus: ExerciseAttemptStatus | null;
};

export type ExerciseFilters = { subjectId?: string | null; chapterId?: string | null; lessonId?: string | null; difficulty?: ExerciseDifficulty | null };

export function getExerciseFilterOptions(items: ExerciseCatalogItem[]) {
  const distinct = <T extends string>(values: (T | null | undefined)[]) => Array.from(new Set(values.filter((value): value is T => Boolean(value))));
  return { subjects: distinct(items.map((item) => item.subjectName)), chapters: distinct(items.map((item) => item.chapterTitle)), lessons: distinct(items.map((item) => item.lessonTitle)), difficulties: distinct(items.map((item) => item.difficulty)) };
}

export function humanDifficulty(value: ExerciseDifficulty | null) {
  if (value === "easy") return "Facile";
  if (value === "medium") return "Moyen";
  if (value === "hard") return "Difficile";
  return null;
}

export function humanExerciseType(value: ExerciseType) {
  const labels: Record<ExerciseType, string> = { single_choice: "Choix unique", multiple_choice: "Choix multiples", true_false: "Vrai / Faux", short_answer: "Réponse courte", free_response: "Réponse libre" };
  return labels[value];
}

export function resultLabel(status: ExerciseAttemptStatus | null, percentage: number | null) {
  if (!status) return "À commencer";
  if (status === "in_progress") return "En cours";
  if (status === "review_required") return "Correction à consulter";
  return percentage === null ? "Terminé" : `${Math.round(percentage)} %`;
}

export function isAutoGradable(type: ExerciseType) { return type === "single_choice" || type === "multiple_choice" || type === "true_false"; }

export function visibleCatalogItems(items: ExerciseCatalogItem[], filters: ExerciseFilters) {
  return items.filter((item) => (!filters.subjectId || item.subjectId === filters.subjectId) && (!filters.chapterId || item.chapterId === filters.chapterId) && (!filters.lessonId || item.lessonId === filters.lessonId) && (!filters.difficulty || item.difficulty === filters.difficulty));
}
