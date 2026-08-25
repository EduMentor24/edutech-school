import { enqueueLearningOperation } from "@/lib/offline/learning-sync-store";
import { isInternetReachable } from "@/lib/offline/learning-sync-manager";
import { getLocalData, saveLocalData } from "@/lib/offline/offline-storage-service";
import { supabase } from "../supabase/client";
import { buildLearningProgress, numeric, type LearningProgressDashboard, type ProgressRpcRow } from "./learning-progress-model";

export * from "./learning-progress-model";

export type AdminProgressOverview = { studentsStarted: number; lessonStarts: number; lessonCompletions: number; averageCompletionPercentage: number };
type ProgressMutationRow = { lesson_id: string; status: "in_progress" | "completed"; started_at: string | null; last_viewed_at: string | null; completed_at: string | null; study_seconds: number | string | null };

function messageFrom(error: unknown) { if (typeof error === "object" && error && "message" in error && typeof error.message === "string") return error.message; return "Une erreur de données est survenue."; }
function operationId(prefix: string) { const random = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`; return `${prefix}-${random}`; }

async function currentUserId() {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session?.user) throw new Error("Connexion requise pour enregistrer votre progression.");
  return data.session.user.id;
}

export async function getLearningProgress(): Promise<LearningProgressDashboard> {
  let userId: string | null = null;
  try { userId = await currentUserId(); } catch { /* Le cache ne peut être utilisé sans identité locale. */ }
  try {
    const { data, error } = await supabase.rpc("get_my_course_progress");
    if (error) throw new Error(messageFrom(error));
    const dashboard = buildLearningProgress((data ?? []) as ProgressRpcRow[]);
    if (userId) await saveLocalData("edutech-learning-progress-v1", dashboard, userId);
    return dashboard;
  } catch (cause) {
    const cached = userId ? await getLocalData<LearningProgressDashboard>("edutech-learning-progress-v1", userId) : null;
    if (cached) return cached;
    throw cause;
  }
}

function mutationLesson(data: ProgressMutationRow | ProgressMutationRow[] | null) {
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) throw new Error("La progression de la leçon n’a pas pu être mise à jour.");
  return { lessonId: row.lesson_id, status: row.status, startedAt: row.started_at, lastViewedAt: row.last_viewed_at, completedAt: row.completed_at, studySeconds: numeric(row.study_seconds) };
}

export async function recordLessonView(lessonId: string) {
  if (await isInternetReachable()) {
    const { data, error } = await supabase.rpc("sync_local_learning_progress", { p_client_operation_id: operationId("view"), p_operation_type: "lesson_view", p_lesson_id: lessonId, p_favorite: null });
    if (error) throw new Error(messageFrom(error));
    const row = (Array.isArray(data) ? data[0] : data) as ProgressMutationRow | null;
    return row ? mutationLesson(row) : { lessonId, status: "in_progress" as const, startedAt: null, lastViewedAt: new Date().toISOString(), completedAt: null, studySeconds: 0 };
  }
  const userId = await currentUserId();
  await enqueueLearningOperation(userId, { type: "lesson_view", resourceId: lessonId, payload: {} });
  return { lessonId, status: "in_progress" as const, startedAt: null, lastViewedAt: new Date().toISOString(), completedAt: null, studySeconds: 0 };
}

export async function completeLesson(lessonId: string) {
  if (await isInternetReachable()) {
    const { data, error } = await supabase.rpc("sync_local_learning_progress", { p_client_operation_id: operationId("complete"), p_operation_type: "lesson_complete", p_lesson_id: lessonId, p_favorite: null });
    if (error) throw new Error(messageFrom(error));
    const row = (Array.isArray(data) ? data[0] : data) as ProgressMutationRow | null;
    return row ? mutationLesson(row) : { lessonId, status: "completed" as const, startedAt: null, lastViewedAt: new Date().toISOString(), completedAt: new Date().toISOString(), studySeconds: 0 };
  }
  const userId = await currentUserId();
  await enqueueLearningOperation(userId, { type: "lesson_complete", resourceId: lessonId, payload: {} });
  return { lessonId, status: "completed" as const, startedAt: null, lastViewedAt: new Date().toISOString(), completedAt: new Date().toISOString(), studySeconds: 0 };
}

export async function setLessonFavorite(lessonId: string, favorite: boolean) {
  if (await isInternetReachable()) {
    const { error } = await supabase.rpc("sync_local_learning_progress", { p_client_operation_id: operationId("favorite"), p_operation_type: "lesson_favorite", p_lesson_id: lessonId, p_favorite: favorite });
    if (error) throw new Error(messageFrom(error));
    return favorite;
  }
  const userId = await currentUserId();
  await enqueueLearningOperation(userId, { type: "lesson_favorite", resourceId: lessonId, payload: { favorite } });
  return favorite;
}

export async function getAdminProgressOverview(): Promise<AdminProgressOverview> {
  const { data, error } = await supabase.rpc("get_admin_progress_overview");
  if (error) throw new Error(messageFrom(error));
  const row = (Array.isArray(data) ? data[0] : data) as Record<string, unknown> | null;
  return { studentsStarted: numeric(row?.students_started as number | string | null), lessonStarts: numeric(row?.lesson_starts as number | string | null), lessonCompletions: numeric(row?.lesson_completions as number | string | null), averageCompletionPercentage: numeric(row?.average_completion_percentage as number | string | null) };
}
