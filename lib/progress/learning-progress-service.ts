import { supabase } from "../supabase/client";
import { buildLearningProgress, numeric, type LearningProgressDashboard, type ProgressRpcRow } from "./learning-progress-model";

export * from "./learning-progress-model";

export type AdminProgressOverview = { studentsStarted: number; lessonStarts: number; lessonCompletions: number; averageCompletionPercentage: number };

type ProgressMutationRow = { lesson_id: string; status: "in_progress" | "completed"; started_at: string | null; last_viewed_at: string | null; completed_at: string | null; study_seconds: number | string | null };

function messageFrom(error: unknown) {
  if (typeof error === "object" && error && "message" in error && typeof error.message === "string") return error.message;
  return "Une erreur de données est survenue.";
}

export async function getLearningProgress(): Promise<LearningProgressDashboard> {
  const { data, error } = await supabase.rpc("get_my_course_progress");
  if (error) throw new Error(messageFrom(error));
  return buildLearningProgress((data ?? []) as ProgressRpcRow[]);
}

function mutationLesson(data: ProgressMutationRow | ProgressMutationRow[] | null) {
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) throw new Error("La progression de la leçon n’a pas pu être mise à jour.");
  return { lessonId: row.lesson_id, status: row.status, startedAt: row.started_at, lastViewedAt: row.last_viewed_at, completedAt: row.completed_at, studySeconds: numeric(row.study_seconds) };
}

export async function recordLessonView(lessonId: string) {
  const { data, error } = await supabase.rpc("record_lesson_view", { p_lesson_id: lessonId });
  if (error) throw new Error(messageFrom(error));
  return mutationLesson(data as ProgressMutationRow | ProgressMutationRow[] | null);
}

export async function completeLesson(lessonId: string) {
  const { data, error } = await supabase.rpc("complete_lesson_for_current_student", { p_lesson_id: lessonId });
  if (error) throw new Error(messageFrom(error));
  return mutationLesson(data as ProgressMutationRow | ProgressMutationRow[] | null);
}

export async function setLessonFavorite(lessonId: string, favorite: boolean) {
  if (favorite) {
    const { error } = await supabase.from("favorites").insert({ content_type: "lesson", content_id: lessonId });
    if (error) throw new Error(messageFrom(error));
    return true;
  }
  const { error } = await supabase.from("favorites").delete().eq("content_type", "lesson").eq("content_id", lessonId);
  if (error) throw new Error(messageFrom(error));
  return false;
}

export async function getAdminProgressOverview(): Promise<AdminProgressOverview> {
  const { data, error } = await supabase.rpc("get_admin_progress_overview");
  if (error) throw new Error(messageFrom(error));
  const row = (Array.isArray(data) ? data[0] : data) as Record<string, unknown> | null;
  return { studentsStarted: numeric(row?.students_started as number | string | null), lessonStarts: numeric(row?.lesson_starts as number | string | null), lessonCompletions: numeric(row?.lesson_completions as number | string | null), averageCompletionPercentage: numeric(row?.average_completion_percentage as number | string | null) };
}
