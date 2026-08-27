import { enqueueLearningOperation } from "@/lib/offline/learning-sync-store";
import { isInternetReachable } from "@/lib/offline/learning-sync-manager";
import {
  getLocalData,
  saveLocalData,
} from "@/lib/offline/offline-storage-service";
import { supabase } from "../supabase/client";
import {
  buildLearningProgress,
  numeric,
  progressPercentage,
  type LearningProgressDashboard,
  type ProgressRpcRow,
} from "./learning-progress-model";

export * from "./learning-progress-model";

export type AdminProgressOverview = {
  studentsStarted: number;
  lessonStarts: number;
  lessonCompletions: number;
  averageCompletionPercentage: number;
};
type ProgressMutationRow = {
  lesson_id: string;
  status: "in_progress" | "completed";
  started_at: string | null;
  last_viewed_at: string | null;
  completed_at: string | null;
  study_seconds: number | string | null;
};
type ProgressReadOptions = { forceRefresh?: boolean };
const PROGRESS_CACHE_KEY = "edutech-learning-progress-v1";
type LearningProgressListener = () => void;
const learningProgressListeners = new Set<LearningProgressListener>();

export function subscribeToLearningProgress(listener: LearningProgressListener) {
  learningProgressListeners.add(listener);
  return () => {
    learningProgressListeners.delete(listener);
  };
}

function notifyLearningProgressChanged() {
  learningProgressListeners.forEach((listener) => listener());
}

function messageFrom(error: unknown) {
  if (
    typeof error === "object" &&
    error &&
    "message" in error &&
    typeof error.message === "string"
  )
    return error.message;
  return "Une erreur de données est survenue.";
}
function operationId(prefix: string) {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}-${random}`;
}

async function currentUserId() {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session?.user)
    throw new Error("Connexion requise pour enregistrer votre progression.");
  return data.session.user.id;
}

async function refreshLearningProgress(
  userId: string | null,
): Promise<LearningProgressDashboard> {
  const { data, error } = await supabase.rpc("get_my_course_progress");
  if (error) throw new Error(messageFrom(error));
  const dashboard = buildLearningProgress((data ?? []) as ProgressRpcRow[]);
  if (userId) await saveLocalData(PROGRESS_CACHE_KEY, dashboard, userId);
  return dashboard;
}

export async function getLearningProgress(
  options: ProgressReadOptions = {},
): Promise<LearningProgressDashboard> {
  let userId: string | null = null;
  try {
    userId = await currentUserId();
  } catch {
    /* La session persistée est indisponible. */
  }
  const cached = userId
    ? await getLocalData<LearningProgressDashboard>(PROGRESS_CACHE_KEY, userId)
    : null;
  if (cached && !options.forceRefresh) {
    void refreshLearningProgress(userId).catch(() => undefined);
    return cached;
  }
  try {
    return await refreshLearningProgress(userId);
  } catch (cause) {
    if (cached) return cached;
    throw cause;
  }
}

function recalculateDashboard(
  dashboard: LearningProgressDashboard,
): LearningProgressDashboard {
  const subjects = dashboard.subjects.map((subject) => {
    const chapters = subject.chapters.map((chapter) => {
      const completedLessons = chapter.lessons.filter(
        (lesson) => lesson.status === "completed",
      ).length;
      return {
        ...chapter,
        completedLessons,
        totalLessons: chapter.lessons.length,
        percentage: progressPercentage(
          completedLessons,
          chapter.lessons.length,
        ),
      };
    });
    const lessons = chapters.flatMap((chapter) => chapter.lessons);
    const completedLessons = lessons.filter(
      (lesson) => lesson.status === "completed",
    ).length;
    const recent = lessons
      .filter(
        (lesson) => lesson.status === "in_progress" || lesson.lastViewedAt,
      )
      .sort((left, right) =>
        (right.lastViewedAt ?? "").localeCompare(left.lastViewedAt ?? ""),
      )[0];
    return {
      ...subject,
      chapters,
      completedLessons,
      totalLessons: lessons.length,
      remainingLessons: lessons.length - completedLessons,
      percentage: progressPercentage(completedLessons, lessons.length),
      resumeLessonId: recent?.id ?? lessons[0]?.id ?? null,
    };
  });
  const totalLessons = subjects.reduce(
    (total, subject) => total + subject.totalLessons,
    0,
  );
  const completedLessons = subjects.reduce(
    (total, subject) => total + subject.completedLessons,
    0,
  );
  return {
    subjects,
    totalLessons,
    completedLessons,
    percentage: progressPercentage(completedLessons, totalLessons),
  };
}

async function updateLocalProgress(
  userId: string,
  lessonId: string,
  change: (lesson: {
    status: "not_started" | "in_progress" | "completed";
    startedAt: string | null;
    lastViewedAt: string | null;
    completedAt: string | null;
    isFavorite: boolean;
  }) => void,
) {
  const cached = await getLocalData<LearningProgressDashboard>(
    PROGRESS_CACHE_KEY,
    userId,
  );
  if (!cached) {
    notifyLearningProgressChanged();
    return;
  }
  const subjects = cached.subjects.map((subject) => ({
    ...subject,
    chapters: subject.chapters.map((chapter) => ({
      ...chapter,
      lessons: chapter.lessons.map((lesson) => {
        if (lesson.id !== lessonId) return lesson;
        const next = { ...lesson };
        change(next);
        return next;
      }),
    })),
  }));
  await saveLocalData(
    PROGRESS_CACHE_KEY,
    recalculateDashboard({ ...cached, subjects }),
    userId,
  );
  notifyLearningProgressChanged();
}

function mutationLesson(
  data: ProgressMutationRow | ProgressMutationRow[] | null,
) {
  const row = Array.isArray(data) ? data[0] : data;
  if (!row)
    throw new Error("La progression de la leçon n’a pas pu être mise à jour.");
  return {
    lessonId: row.lesson_id,
    status: row.status,
    startedAt: row.started_at,
    lastViewedAt: row.last_viewed_at,
    completedAt: row.completed_at,
    studySeconds: numeric(row.study_seconds),
  };
}

export async function recordLessonView(lessonId: string) {
  if (await isInternetReachable()) {
    const { data, error } = await supabase.rpc("sync_local_learning_progress", {
      p_client_operation_id: operationId("view"),
      p_operation_type: "lesson_view",
      p_lesson_id: lessonId,
      p_favorite: null,
    });
    if (error) throw new Error(messageFrom(error));
    const row = (
      Array.isArray(data) ? data[0] : data
    ) as ProgressMutationRow | null;
    const result = row
      ? mutationLesson(row)
      : {
          lessonId,
          status: "in_progress" as const,
          startedAt: null,
          lastViewedAt: new Date().toISOString(),
          completedAt: null,
          studySeconds: 0,
        };
    const userId = await currentUserId();
    await updateLocalProgress(userId, lessonId, (lesson) => {
      lesson.status = result.status;
      lesson.startedAt = result.startedAt;
      lesson.lastViewedAt = result.lastViewedAt;
      lesson.completedAt = result.completedAt;
    });
    return result;
  }
  const userId = await currentUserId();
  await enqueueLearningOperation(userId, {
    type: "lesson_view",
    resourceId: lessonId,
    payload: {},
  });
  const result = {
    lessonId,
    status: "in_progress" as const,
    startedAt: null,
    lastViewedAt: new Date().toISOString(),
    completedAt: null,
    studySeconds: 0,
  };
  await updateLocalProgress(userId, lessonId, (lesson) => {
    lesson.status = result.status;
    lesson.lastViewedAt = result.lastViewedAt;
  });
  return result;
}

export async function completeLesson(lessonId: string) {
  if (await isInternetReachable()) {
    const { data, error } = await supabase.rpc("sync_local_learning_progress", {
      p_client_operation_id: operationId("complete"),
      p_operation_type: "lesson_complete",
      p_lesson_id: lessonId,
      p_favorite: null,
    });
    if (error) throw new Error(messageFrom(error));
    const row = (
      Array.isArray(data) ? data[0] : data
    ) as ProgressMutationRow | null;
    const result = row
      ? mutationLesson(row)
      : {
          lessonId,
          status: "completed" as const,
          startedAt: null,
          lastViewedAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
          studySeconds: 0,
        };
    const userId = await currentUserId();
    await updateLocalProgress(userId, lessonId, (lesson) => {
      lesson.status = result.status;
      lesson.startedAt = result.startedAt;
      lesson.lastViewedAt = result.lastViewedAt;
      lesson.completedAt = result.completedAt;
    });
    return result;
  }
  const userId = await currentUserId();
  await enqueueLearningOperation(userId, {
    type: "lesson_complete",
    resourceId: lessonId,
    payload: {},
  });
  const result = {
    lessonId,
    status: "completed" as const,
    startedAt: null,
    lastViewedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    studySeconds: 0,
  };
  await updateLocalProgress(userId, lessonId, (lesson) => {
    lesson.status = result.status;
    lesson.lastViewedAt = result.lastViewedAt;
    lesson.completedAt = result.completedAt;
  });
  return result;
}

export async function setLessonFavorite(lessonId: string, favorite: boolean) {
  if (await isInternetReachable()) {
    const { error } = await supabase.rpc("sync_local_learning_progress", {
      p_client_operation_id: operationId("favorite"),
      p_operation_type: "lesson_favorite",
      p_lesson_id: lessonId,
      p_favorite: favorite,
    });
    if (error) throw new Error(messageFrom(error));
    const userId = await currentUserId();
    await updateLocalProgress(userId, lessonId, (lesson) => {
      lesson.isFavorite = favorite;
    });
    return favorite;
  }
  const userId = await currentUserId();
  await enqueueLearningOperation(userId, {
    type: "lesson_favorite",
    resourceId: lessonId,
    payload: { favorite },
  });
  await updateLocalProgress(userId, lessonId, (lesson) => {
    lesson.isFavorite = favorite;
  });
  return favorite;
}

export async function getAdminProgressOverview(): Promise<AdminProgressOverview> {
  const { data, error } = await supabase.rpc("get_admin_progress_overview");
  if (error) throw new Error(messageFrom(error));
  const row = (Array.isArray(data) ? data[0] : data) as Record<
    string,
    unknown
  > | null;
  return {
    studentsStarted: numeric(row?.students_started as number | string | null),
    lessonStarts: numeric(row?.lesson_starts as number | string | null),
    lessonCompletions: numeric(
      row?.lesson_completions as number | string | null,
    ),
    averageCompletionPercentage: numeric(
      row?.average_completion_percentage as number | string | null,
    ),
  };
}
