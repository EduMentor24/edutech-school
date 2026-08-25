import * as Network from "expo-network";
import { AppState } from "react-native";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";

import {
  useSupabaseAuth,
  type StudentProfile,
} from "@/lib/auth/supabase-auth-provider";
import {
  getChapter,
  getCourseOffering,
  getChaptersForOffering,
  getCoursesForProfile,
  getLesson,
  getLessonsForChapter,
} from "@/lib/courses/course-service";
import { getLessonSessions } from "@/lib/courses/lesson-session-service";
import {
  getExerciseCatalog,
  getExerciseDetail,
  type ExerciseCatalogItem,
} from "@/lib/exercises/exercise-service";
import {
  pedagogicalCacheContextFromProfile,
  readPedagogicalCache,
  writePedagogicalCache,
  type PedagogicalCacheContext,
} from "@/lib/offline/pedagogical-cache";
import { getLearningProgress } from "@/lib/progress/learning-progress-service";
import {
  getQuizCatalog,
  getQuizDetail,
  type QuizCatalogItem,
} from "@/lib/quizzes/quiz-service";

type PreloadResult = {
  courseCount: number;
  lessonCount: number;
  exerciseCount: number;
  quizCount: number;
};
type PreloadStatus = {
  state: "ready";
  completedAt: string;
  result: PreloadResult;
};
type PedagogicalPreloadContextValue = { isPreloading: boolean };

const PedagogicalPreloadContext = createContext<PedagogicalPreloadContextValue>(
  { isPreloading: false },
);
const STATUS_RESOURCE = "preload/status";

async function runLimited<T>(
  items: readonly T[],
  worker: (item: T) => Promise<void>,
  concurrency = 3,
) {
  let next = 0;
  async function runner() {
    while (next < items.length) {
      const index = next++;
      await worker(items[index]);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => runner()),
  );
}

async function isReady(context: PedagogicalCacheContext) {
  const cached = await readPedagogicalCache<PreloadStatus>(
    context,
    STATUS_RESOURCE,
  );
  return cached?.state === "synced" && cached.payload.state === "ready";
}

/** Précharge uniquement les contenus publiés autorisés par le profil élève actif, sans bloquer les écrans. */
export async function preloadPedagogicalContent(
  profile: StudentProfile,
): Promise<PreloadResult> {
  const context = pedagogicalCacheContextFromProfile(profile);
  if (!context || profile.role !== "student")
    return { courseCount: 0, lessonCount: 0, exerciseCount: 0, quizCount: 0 };

  const courses = await getCoursesForProfile(profile, {
    cacheContext: context,
    forceRefresh: true,
  });
  let lessonCount = 0;
  await runLimited(courses, async (course) => {
    await getCourseOffering(course.offeringId, {
      cacheContext: context,
      forceRefresh: true,
    });
    const chapters = await getChaptersForOffering(course.offeringId, {
      cacheContext: context,
      forceRefresh: true,
    });
    await runLimited(chapters, async (chapter) => {
      await getChapter(chapter.id, {
        cacheContext: context,
        forceRefresh: true,
      });
      const lessons = await getLessonsForChapter(chapter.id, {
        cacheContext: context,
        forceRefresh: true,
      });
      lessonCount += lessons.length;
      await runLimited(lessons, async (lesson) => {
        await getLesson(lesson.id, {
          cacheContext: context,
          forceRefresh: true,
        });
        await getLessonSessions(lesson.id, {
          cacheContext: context,
          forceRefresh: true,
        });
      });
    });
  });

  const [exercises, quizzes] = await Promise.all([
    getExerciseCatalog({ cacheContext: context, forceRefresh: true }),
    getQuizCatalog({ cacheContext: context, forceRefresh: true }),
  ]);
  await runLimited(exercises as ExerciseCatalogItem[], async (exercise) => {
    await getExerciseDetail(exercise.exerciseId, context, true);
  });
  await runLimited(quizzes as QuizCatalogItem[], async (quiz) => {
    await getQuizDetail(quiz.quizId, context, true);
  });
  await getLearningProgress({ forceRefresh: true });

  const result = {
    courseCount: courses.length,
    lessonCount,
    exerciseCount: exercises.length,
    quizCount: quizzes.length,
  };
  await writePedagogicalCache(context, STATUS_RESOURCE, {
    state: "ready",
    completedAt: new Date().toISOString(),
    result,
  } satisfies PreloadStatus);
  return result;
}

export function PedagogicalPreloadProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, isAuthenticated } = useSupabaseAuth();
  const network = Network.useNetworkState();
  const running = useRef(false);
  const isOnline = network.isInternetReachable === true;
  const profileKey = profile
    ? `${profile.id}/${profile.school_level ?? ""}/${profile.series ?? ""}/${profile.role}`
    : "";

  const preload = useCallback(async () => {
    if (
      !profile ||
      !isAuthenticated ||
      profile.role !== "student" ||
      !isOnline ||
      running.current
    )
      return;
    const context = pedagogicalCacheContextFromProfile(profile);
    if (!context || (await isReady(context))) return;
    running.current = true;
    try {
      await preloadPedagogicalContent(profile);
    } catch {
      /* Le cache existant reste lisible ; la reprise aura lieu lors d’un prochain retour réseau. */
    } finally {
      running.current = false;
    }
  }, [isAuthenticated, isOnline, profile, profileKey]);

  useEffect(() => {
    void preload();
  }, [preload]);
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") void preload();
    });
    return () => subscription.remove();
  }, [preload]);

  const value = useMemo(
    () => ({ isPreloading: running.current }),
    [profileKey],
  );
  return (
    <PedagogicalPreloadContext.Provider value={value}>
      {children}
    </PedagogicalPreloadContext.Provider>
  );
}

export function usePedagogicalPreload() {
  return useContext(PedagogicalPreloadContext);
}
