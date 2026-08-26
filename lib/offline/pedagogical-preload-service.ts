import * as Network from "expo-network";

import { type StudentProfile } from "@/lib/auth/supabase-auth-provider";
import {
  flushCitationFavoriteQueue,
  getCitations,
  getFavoriteCitationIds,
} from "@/lib/citations/citation-service";
import {
  getChapter,
  getCourseOffering,
  getChaptersForOffering,
  getCoursesForProfile,
  getLesson,
  getLessonsForChapter,
} from "@/lib/courses/course-service";
import { getLessonSessions } from "@/lib/courses/lesson-session-service";
import { getExerciseCatalog, getExerciseDetail } from "@/lib/exercises/exercise-service";
import {
  pedagogicalCacheContextFromProfile,
  type PedagogicalCacheContext,
} from "@/lib/offline/pedagogical-cache";
import { getLearningProgress } from "@/lib/progress/learning-progress-service";
import { getQuizCatalog, getQuizDetail } from "@/lib/quizzes/quiz-service";
import {
  PRELOAD_DOMAINS,
  finishPreloadDomain,
  markPreloadDomainInterrupted,
  markPreloadResourceError,
  markPreloadResourceSynced,
  mergePreloadResources,
  missingPreloadResources,
  preparePreloadManifest,
  preloadFingerprint,
  readPreloadManifest,
  type PreloadDomain,
  type PreloadDomainManifest,
} from "./preload-manifest";

export type PedagogicalPreloadResult = {
  courseCount: number;
  lessonCount: number;
  exerciseCount: number;
  quizCount: number;
  progressionCount: number;
};
export type PedagogicalPreloadOptions = {
  /** Revalide les ressources déjà prêtes après l’expiration du manifeste. */
  revalidate?: boolean;
  /** Limite le cycle aux domaines réellement incomplets ou expirés. */
  domains?: readonly PreloadDomain[];
  onDomainChange?: (manifest: PreloadDomainManifest | null) => void;
};

const courseCatalogResource = "catalog/subjects";
const progressResource = "dashboard";
const errorMessage = (cause: unknown) => cause instanceof Error ? cause.message : "La synchronisation est temporairement indisponible.";

async function networkMayBeUsable() {
  const state = await Network.getNetworkStateAsync();
  // Les valeurs null/indéterminées au démarrage ne doivent pas abandonner silencieusement une reprise.
  return state.isConnected !== false && state.isInternetReachable !== false;
}

async function pending(context: PedagogicalCacheContext, domain: PreloadDomain, resource: string) {
  return missingPreloadResources(await readPreloadManifest(context, domain)).includes(resource);
}

async function report(
  context: PedagogicalCacheContext,
  domain: PreloadDomain,
  callback?: PedagogicalPreloadOptions["onDomainChange"],
) {
  callback?.(await readPreloadManifest(context, domain));
}

async function recordSuccess(
  context: PedagogicalCacheContext,
  domain: PreloadDomain,
  resource: string,
  version: string | null,
  callback?: PedagogicalPreloadOptions["onDomainChange"],
) {
  if (await pending(context, domain, resource))
    await markPreloadResourceSynced(context, domain, resource, version);
  await report(context, domain, callback);
}

async function runOne(
  context: PedagogicalCacheContext,
  domain: PreloadDomain,
  resource: string,
  load: () => Promise<string | null>,
  callback?: PedagogicalPreloadOptions["onDomainChange"],
) {
  if (!(await pending(context, domain, resource))) return true;
  if (!(await networkMayBeUsable())) return false;
  try {
    const version = await load();
    await recordSuccess(context, domain, resource, version, callback);
    return true;
  } catch (cause) {
    if (!(await networkMayBeUsable())) return false;
    await markPreloadResourceError(context, domain, resource, cause);
    await report(context, domain, callback);
    return true;
  }
}

async function finish(
  context: PedagogicalCacheContext,
  domain: PreloadDomain,
  interrupted: boolean,
  callback?: PedagogicalPreloadOptions["onDomainChange"],
) {
  const manifest = interrupted
    ? await markPreloadDomainInterrupted(context, domain, new Error("Synchronisation interrompue : connexion indisponible."))
    : await finishPreloadDomain(context, domain);
  callback?.(manifest);
  return manifest;
}

async function syncCourses(
  profile: StudentProfile,
  context: PedagogicalCacheContext,
  options: PedagogicalPreloadOptions,
) {
  let courses: Awaited<ReturnType<typeof getCoursesForProfile>>;
  try {
    courses = await getCoursesForProfile(profile, { cacheContext: context, forceRefresh: options.revalidate });
  } catch (cause) {
    await preparePreloadManifest(context, "courses", [], null);
    await markPreloadDomainInterrupted(context, "courses", cause);
    await report(context, "courses", options.onDomainChange);
    return { courseCount: 0, lessonCount: 0 };
  }

  const targetVersion = preloadFingerprint(courses.map((course) => [course.offeringId, course.subjectId, course.name, course.activeChapterCount]));
  await preparePreloadManifest(context, "courses", [{ id: courseCatalogResource, version: targetVersion }], targetVersion, options.revalidate);
  await recordSuccess(context, "courses", courseCatalogResource, targetVersion, options.onDomainChange);
  let lessonCount = 0;
  let interrupted = false;

  for (const course of courses) {
    if (interrupted) break;
    const offeringResource = `offering/${encodeURIComponent(course.offeringId)}`;
    const chapterListResource = `offering/${encodeURIComponent(course.offeringId)}/chapters`;
    await mergePreloadResources(context, "courses", [{ id: offeringResource }, { id: chapterListResource }], targetVersion);
    const offeringReady = await runOne(context, "courses", offeringResource, async () => {
      const value = await getCourseOffering(course.offeringId, { cacheContext: context, forceRefresh: options.revalidate });
      return value ? preloadFingerprint(value) : null;
    }, options.onDomainChange);
    if (!offeringReady) { interrupted = true; break; }

    let chapters: Awaited<ReturnType<typeof getChaptersForOffering>>;
    try {
      chapters = await getChaptersForOffering(course.offeringId, { cacheContext: context, forceRefresh: options.revalidate });
      await recordSuccess(context, "courses", chapterListResource, preloadFingerprint(chapters), options.onDomainChange);
    } catch (cause) {
      if (!(await networkMayBeUsable())) { interrupted = true; break; }
      await markPreloadResourceError(context, "courses", chapterListResource, cause);
      continue;
    }

    for (const chapter of chapters) {
      if (interrupted) break;
      const chapterResource = `chapter/${encodeURIComponent(chapter.id)}`;
      const lessonListResource = `chapter/${encodeURIComponent(chapter.id)}/lessons/student`;
      await mergePreloadResources(context, "courses", [{ id: chapterResource }, { id: lessonListResource }], targetVersion);
      const chapterReady = await runOne(context, "courses", chapterResource, async () => {
        const value = await getChapter(chapter.id, { cacheContext: context, forceRefresh: options.revalidate });
        return value ? preloadFingerprint(value) : null;
      }, options.onDomainChange);
      if (!chapterReady) { interrupted = true; break; }

      let lessons: Awaited<ReturnType<typeof getLessonsForChapter>>;
      try {
        lessons = await getLessonsForChapter(chapter.id, { cacheContext: context, forceRefresh: options.revalidate });
        lessonCount += lessons.length;
        await recordSuccess(context, "courses", lessonListResource, preloadFingerprint(lessons), options.onDomainChange);
      } catch (cause) {
        if (!(await networkMayBeUsable())) { interrupted = true; break; }
        await markPreloadResourceError(context, "courses", lessonListResource, cause);
        continue;
      }

      for (const lesson of lessons) {
        if (interrupted) break;
        const lessonResource = `lesson/${encodeURIComponent(lesson.id)}/student`;
        const sessionsResource = `lesson/${encodeURIComponent(lesson.id)}/sessions/student`;
        await mergePreloadResources(context, "courses", [{ id: lessonResource }, { id: sessionsResource }], targetVersion);
        const lessonReady = await runOne(context, "courses", lessonResource, async () => {
          const value = await getLesson(lesson.id, { cacheContext: context, forceRefresh: options.revalidate });
          return value ? preloadFingerprint(value) : null;
        }, options.onDomainChange);
        if (!lessonReady) { interrupted = true; break; }
        const sessionsReady = await runOne(context, "courses", sessionsResource, async () => {
          const value = await getLessonSessions(lesson.id, { cacheContext: context, forceRefresh: options.revalidate });
          return preloadFingerprint(value);
        }, options.onDomainChange);
        if (!sessionsReady) interrupted = true;
      }
    }
  }
  await finish(context, "courses", interrupted, options.onDomainChange);
  return { courseCount: courses.length, lessonCount };
}

async function syncCatalogDetails(
  context: PedagogicalCacheContext,
  domain: "exercises" | "quizzes",
  options: PedagogicalPreloadOptions,
) {
  const isExercise = domain === "exercises";
  let catalog: Awaited<ReturnType<typeof getExerciseCatalog>> | Awaited<ReturnType<typeof getQuizCatalog>>;
  try {
    catalog = isExercise
      ? await getExerciseCatalog({ cacheContext: context, forceRefresh: options.revalidate })
      : await getQuizCatalog({ cacheContext: context, forceRefresh: options.revalidate });
  } catch (cause) {
    await preparePreloadManifest(context, domain, [], null);
    await markPreloadDomainInterrupted(context, domain, cause);
    await report(context, domain, options.onDomainChange);
    return 0;
  }
  const records = catalog as Array<{ exerciseId?: string; quizId?: string }>;
  const catalogResource = `${domain}/catalog/all/all/all/all`;
  const targetVersion = preloadFingerprint(records.map((item) => item.exerciseId ?? item.quizId));
  const detailPlan = records.map((item) => ({ id: isExercise ? `exercise/${encodeURIComponent(item.exerciseId ?? "")}` : `quiz/${encodeURIComponent(item.quizId ?? "")}` }));
  await preparePreloadManifest(context, domain, [{ id: catalogResource, version: targetVersion }, ...detailPlan], targetVersion, options.revalidate);
  await recordSuccess(context, domain, catalogResource, targetVersion, options.onDomainChange);
  let interrupted = false;
  for (const item of records) {
    if (interrupted) break;
    const id = isExercise ? item.exerciseId ?? "" : item.quizId ?? "";
    const resource = isExercise ? `exercise/${encodeURIComponent(id)}` : `quiz/${encodeURIComponent(id)}`;
    const ready = await runOne(context, domain, resource, async () => {
      const detail = isExercise
        ? await getExerciseDetail(id, context, options.revalidate)
        : await getQuizDetail(id, context, options.revalidate);
      return detail?.contentVersion ?? (detail ? preloadFingerprint(detail) : null);
    }, options.onDomainChange);
    if (!ready) interrupted = true;
  }
  await finish(context, domain, interrupted, options.onDomainChange);
  return records.length;
}

async function syncProgression(context: PedagogicalCacheContext, options: PedagogicalPreloadOptions) {
  await preparePreloadManifest(context, "progression", [{ id: progressResource }], "progression-v1", options.revalidate);
  const ready = await runOne(context, "progression", progressResource, async () => {
    const value = await getLearningProgress({ forceRefresh: options.revalidate });
    return preloadFingerprint(value);
  }, options.onDomainChange);
  await finish(context, "progression", !ready, options.onDomainChange);
  return 1;
}

async function syncCitations(
  profile: StudentProfile,
  context: PedagogicalCacheContext,
  options: PedagogicalPreloadOptions,
) {
  try {
    await flushCitationFavoriteQueue(profile.id).catch(() => undefined);
    const [citations, favorites] = await Promise.all([
      getCitations({ cacheContext: context, forceRefresh: options.revalidate }),
      getFavoriteCitationIds(profile.id, { forceRefresh: options.revalidate }),
    ]);
    const citationsVersion = preloadFingerprint(
      citations.map((citation) => [citation.id, citation.updatedAt, citation.themes]),
    );
    const favoritesVersion = preloadFingerprint(Array.from(favorites).sort());
    const targetVersion = preloadFingerprint([citationsVersion, favoritesVersion]);
    await preparePreloadManifest(
      context,
      "citations",
      [
        { id: "citations/catalog", version: citationsVersion },
        { id: "citations/favorites", version: favoritesVersion },
      ],
      targetVersion,
      options.revalidate,
    );
    await recordSuccess(context, "citations", "citations/catalog", citationsVersion, options.onDomainChange);
    await recordSuccess(context, "citations", "citations/favorites", favoritesVersion, options.onDomainChange);
    await finish(context, "citations", false, options.onDomainChange);
    return citations.length;
  } catch (cause) {
    await preparePreloadManifest(context, "citations", [], null);
    await markPreloadDomainInterrupted(context, "citations", cause);
    await report(context, "citations", options.onDomainChange);
    return 0;
  }
}

/** Précharge uniquement les contenus auxquels le profil élève courant peut accéder. */
export async function preloadPedagogicalDomains(profile: StudentProfile, options: PedagogicalPreloadOptions = {}): Promise<PedagogicalPreloadResult> {
  const context = pedagogicalCacheContextFromProfile(profile);
  if (!context || profile.role !== "student") return { courseCount: 0, lessonCount: 0, exerciseCount: 0, quizCount: 0, progressionCount: 0 };
  const domains = options.domains ?? PRELOAD_DOMAINS;
  const courses = domains.includes("courses") ? await syncCourses(profile, context, options) : { courseCount: 0, lessonCount: 0 };
  const exerciseCount = domains.includes("exercises") ? await syncCatalogDetails(context, "exercises", options) : 0;
  const quizCount = domains.includes("quizzes") ? await syncCatalogDetails(context, "quizzes", options) : 0;
  if (domains.includes("citations")) await syncCitations(profile, context, options);
  const progressionCount = domains.includes("progression") ? await syncProgression(context, options) : 0;
  return { ...courses, exerciseCount, quizCount, progressionCount };
}

export { errorMessage };
