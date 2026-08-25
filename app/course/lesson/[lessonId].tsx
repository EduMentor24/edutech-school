import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { AppScreen } from "@/components/edutech/app-screen";
import {
  CourseEmpty,
  CourseError,
  CourseLoading,
} from "@/components/edutech/course-feedback";
import { LessonMarkdown } from "@/components/edutech/lesson-markdown";
import { LessonStatusBadge } from "@/components/edutech/learning-progress";
import { PageHeader } from "@/components/edutech/page-header";
import { useSupabaseAuth } from "@/lib/auth/supabase-auth-provider";
import {
  CourseLesson,
  getLesson,
  getLessonsForChapter,
} from "@/lib/courses/course-service";
import {
  getLessonSessions,
  type LessonSession,
} from "@/lib/courses/lesson-session-service";
import { useEduTheme } from "@/lib/edutech/theme-context";
import { pedagogicalCacheContextFromProfile } from "@/lib/offline/pedagogical-cache";
import {
  ExerciseCatalogItem,
  getExerciseCatalog,
} from "@/lib/exercises/exercise-service";
import {
  downloadLessonPdf,
  printLessonPdf,
} from "@/lib/lessons/lesson-pdf-service";
import {
  completeLesson,
  getLearningProgress,
  progressForLesson,
  recordLessonView,
  setLessonFavorite,
  type LessonProgressStatus,
} from "@/lib/progress/learning-progress-service";
import { QuizCatalogItem, getQuizCatalog } from "@/lib/quizzes/quiz-service";

export default function LessonReaderScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const router = useRouter();
  const { colors } = useEduTheme();
  const { profile, isAdmin } = useSupabaseAuth();
  const {
    id: profileId,
    school_level: schoolLevel,
    series: profileSeries,
    role: profileRole,
  } = profile ?? {};
  const cacheContext = useMemo(
    () =>
      pedagogicalCacheContextFromProfile(
        profileId && schoolLevel && profileSeries && profileRole
          ? {
              id: profileId,
              school_level: schoolLevel,
              series: profileSeries,
              role: profileRole,
            }
          : null,
      ),
    [profileId, schoolLevel, profileSeries, profileRole],
  );
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [lesson, setLesson] = useState<CourseLesson | null>(null);
  const [chapterLessons, setChapterLessons] = useState<CourseLesson[]>([]);
  const [sessions, setSessions] = useState<LessonSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [lessonExercises, setLessonExercises] = useState<ExerciseCatalogItem[]>(
    [],
  );
  const [lessonQuizzes, setLessonQuizzes] = useState<QuizCatalogItem[]>([]);
  const [status, setStatus] = useState<LessonProgressStatus>("not_started");
  const [isFavorite, setIsFavorite] = useState(false);
  const [trackingError, setTrackingError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!lessonId) return;
    setLoading(true);
    setError(null);
    setTrackingError(null);
    try {
      const nextLesson = await getLesson(lessonId, {
        includeInactive: isAdmin,
        cacheContext,
      });
      const [nextChapterLessons, nextSessions] = nextLesson
        ? await Promise.all([
            getLessonsForChapter(nextLesson.chapterId, {
              includeInactive: isAdmin,
              cacheContext,
            }),
            getLessonSessions(nextLesson.id, {
              includeInactive: isAdmin,
              cacheContext,
            }),
          ])
        : ([[], []] as [CourseLesson[], LessonSession[]]);
      setLesson(nextLesson);
      setChapterLessons(nextChapterLessons);
      setSessions(nextSessions);
      setActiveSessionId((current) =>
        nextSessions.some((session) => session.id === current)
          ? current
          : (nextSessions[0]?.id ?? null),
      );
      setLessonExercises([]);
      setLessonQuizzes([]);

      if (nextLesson && profile?.role === "student") {
        try {
          const dashboard = await getLearningProgress();
          const knownProgress = progressForLesson(dashboard, nextLesson.id);
          setStatus(knownProgress?.status ?? "not_started");
          setIsFavorite(knownProgress?.isFavorite ?? false);
          setStatus((await recordLessonView(nextLesson.id)).status);
        } catch (cause) {
          setTrackingError(
            cause instanceof Error
              ? cause.message
              : "La consultation n’a pas pu être enregistrée.",
          );
        }
        try {
          const [exercises, quizzes] = await Promise.all([
            getExerciseCatalog({ cacheContext }),
            getQuizCatalog({ cacheContext }),
          ]);
          setLessonExercises(
            exercises.filter((item) => item.lessonId === nextLesson.id),
          );
          setLessonQuizzes(
            quizzes.filter((item) => item.lessonId === nextLesson.id),
          );
        } catch (cause) {
          setTrackingError(
            (current) =>
              current ??
              (cause instanceof Error
                ? cause.message
                : "Les activités associées n’ont pas pu être chargées."),
          );
        }
      } else {
        setStatus("not_started");
        setIsFavorite(false);
      }
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Une erreur inattendue est survenue.",
      );
    } finally {
      setLoading(false);
    }
  }, [cacheContext, isAdmin, lessonId, profile?.role]);

  useEffect(() => {
    void load();
  }, [load]);

  const activeSession =
    sessions.find((session) => session.id === activeSessionId) ?? null;
  const displayedContent = activeSession?.content ?? lesson?.content ?? "";
  const displayedTitle = activeSession
    ? `${lesson?.title ?? "Leçon"} — ${activeSession.title}`
    : (lesson?.title ?? "Leçon");
  const displayedDescription =
    activeSession?.description ?? lesson?.description ?? null;

  const handleComplete = useCallback(async () => {
    if (!lesson || profile?.role !== "student") return;
    setSaving(true);
    setTrackingError(null);
    try {
      setStatus((await completeLesson(lesson.id)).status);
    } catch (cause) {
      setTrackingError(
        cause instanceof Error
          ? cause.message
          : "La complétion n’a pas pu être enregistrée.",
      );
    } finally {
      setSaving(false);
    }
  }, [lesson, profile?.role]);

  const handleFavorite = useCallback(async () => {
    if (!lesson || profile?.role !== "student") return;
    setSaving(true);
    setTrackingError(null);
    try {
      setIsFavorite(await setLessonFavorite(lesson.id, !isFavorite));
    } catch (cause) {
      setTrackingError(
        cause instanceof Error
          ? cause.message
          : "Le favori n’a pas pu être mis à jour.",
      );
    } finally {
      setSaving(false);
    }
  }, [isFavorite, lesson, profile?.role]);

  const handlePdf = useCallback(
    async (mode: "print" | "download") => {
      if (!displayedContent || (!isAdmin && profile?.role !== "student"))
        return;
      setExporting(true);
      setExportError(null);
      try {
        const input = {
          title: displayedTitle,
          description: displayedDescription,
          content: displayedContent,
        };
        if (mode === "print") await printLessonPdf(input);
        else await downloadLessonPdf(input);
      } catch (cause) {
        setExportError(
          cause instanceof Error
            ? cause.message
            : "La création du PDF a échoué.",
        );
      } finally {
        setExporting(false);
      }
    },
    [
      displayedContent,
      displayedDescription,
      displayedTitle,
      isAdmin,
      profile?.role,
    ],
  );

  if (loading)
    return (
      <AppScreen>
        <CourseLoading label="Chargement de la leçon" />
      </AppScreen>
    );
  if (error)
    return (
      <AppScreen>
        <CourseError message={error} onRetry={() => void load()} />
      </AppScreen>
    );
  if (!lesson)
    return (
      <AppScreen>
        <CourseEmpty
          title="Leçon indisponible"
          description="Cette leçon n’est pas accessible avec votre profil scolaire actuel."
        />
      </AppScreen>
    );

  const currentIndex = chapterLessons.findIndex(
    (item) => item.id === lesson.id,
  );
  const previous = currentIndex > 0 ? chapterLessons[currentIndex - 1] : null;
  const next = currentIndex >= 0 ? chapterLessons[currentIndex + 1] : null;
  const canTrack = profile?.role === "student";

  return (
    <AppScreen withPadding={false}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inner}>
          <PageHeader
            title={lesson.title}
            subtitle={lesson.description || "Lecture de la leçon."}
            back
          />
          {isAdmin && !lesson.isActive ? (
            <View style={styles.previewNotice}>
              <MaterialIcons
                name="visibility"
                size={18}
                color={colors.warning}
              />
              <Text style={styles.previewNoticeText}>
                Aperçu administrateur : cette leçon est inactive et reste
                invisible pour les élèves.
              </Text>
            </View>
          ) : null}
          {displayedContent && (canTrack || isAdmin) ? (
            <View style={styles.exportCard}>
              <View style={styles.exportHeader}>
                <MaterialIcons
                  name="picture-as-pdf"
                  size={20}
                  color={colors.primary}
                />
                <View style={styles.exerciseCopy}>
                  <Text style={styles.exerciseTitle}>Cours en PDF</Text>
                  <Text style={styles.exerciseDescription}>
                    Imprimez la séance consultée ou enregistrez son PDF avec ses
                    définitions, encadrés et formules.
                  </Text>
                </View>
              </View>
              <View style={styles.exportActions}>
                <Pressable
                  accessibilityRole="button"
                  disabled={exporting}
                  onPress={() => void handlePdf("print")}
                  style={({ pressed }) => [
                    styles.exportSecondaryButton,
                    exporting && styles.disabled,
                    pressed && !exporting && styles.pressed,
                  ]}
                >
                  <MaterialIcons
                    name="print"
                    size={18}
                    color={colors.primary}
                  />
                  <Text style={styles.exportSecondaryLabel}>Imprimer</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  disabled={exporting}
                  onPress={() => void handlePdf("download")}
                  style={({ pressed }) => [
                    styles.exportPrimaryButton,
                    exporting && styles.disabled,
                    pressed && !exporting && styles.pressed,
                  ]}
                >
                  <MaterialIcons
                    name="file-download"
                    size={18}
                    color={colors.surface}
                  />
                  <Text style={styles.exportPrimaryLabel}>
                    {exporting ? "Préparation…" : "PDF"}
                  </Text>
                </Pressable>
              </View>
              {exportError ? (
                <Text style={styles.trackingError}>{exportError}</Text>
              ) : null}
            </View>
          ) : null}
          {canTrack ? (
            <View style={styles.progressCard}>
              <View style={styles.statusRow}>
                <LessonStatusBadge status={status} />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={
                    isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"
                  }
                  disabled={saving}
                  onPress={() => void handleFavorite()}
                  style={({ pressed }) => [
                    styles.iconButton,
                    pressed && !saving && styles.pressed,
                  ]}
                >
                  <MaterialIcons
                    name={isFavorite ? "bookmark" : "bookmark-border"}
                    size={21}
                    color={colors.primary}
                  />
                </Pressable>
              </View>
              {status === "completed" ? (
                <Text style={styles.completedText}>
                  Cette leçon est enregistrée comme terminée.
                </Text>
              ) : (
                <Pressable
                  accessibilityRole="button"
                  disabled={saving}
                  onPress={() => void handleComplete()}
                  style={({ pressed }) => [
                    styles.completeButton,
                    saving && styles.disabled,
                    pressed && !saving && styles.pressed,
                  ]}
                >
                  <MaterialIcons
                    name="check-circle-outline"
                    size={19}
                    color={colors.surface}
                  />
                  <Text style={styles.completeLabel}>
                    {saving ? "Enregistrement…" : "Marquer comme terminée"}
                  </Text>
                </Pressable>
              )}
              {trackingError ? (
                <Text style={styles.trackingError}>{trackingError}</Text>
              ) : null}
            </View>
          ) : null}
          {sessions.length ? (
            <View style={styles.sessionsCard}>
              <Text style={styles.sessionsTitle}>Séances de la leçon</Text>
              <Text style={styles.sessionsDescription}>
                Choisissez une séance pour suivre la progression méthodologique
                dans l’ordre.
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.sessionsChips}
              >
                {sessions.map((session, index) => (
                  <Pressable
                    key={session.id}
                    accessibilityRole="button"
                    accessibilityState={{
                      selected: activeSession?.id === session.id,
                    }}
                    onPress={() => setActiveSessionId(session.id)}
                    style={({ pressed }) => [
                      styles.sessionChip,
                      activeSession?.id === session.id &&
                        styles.sessionChipActive,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.sessionChipOrder,
                        activeSession?.id === session.id &&
                          styles.sessionChipTextActive,
                      ]}
                    >
                      S{index + 1}
                    </Text>
                    <Text
                      numberOfLines={2}
                      style={[
                        styles.sessionChipText,
                        activeSession?.id === session.id &&
                          styles.sessionChipTextActive,
                      ]}
                    >
                      {session.title.replace(/^Séance\s*\d+\s*[:—-]\s*/i, "")}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          ) : null}
          <View style={styles.reader}>
            {activeSession ? (
              <>
                <Text style={styles.sessionReaderTitle}>
                  {activeSession.title}
                </Text>
                {activeSession.description ? (
                  <Text style={styles.sessionReaderDescription}>
                    {activeSession.description}
                  </Text>
                ) : null}
              </>
            ) : null}
            {displayedContent ? (
              <LessonMarkdown content={displayedContent} />
            ) : (
              <Text style={styles.emptyContent}>
                Le contenu de cette leçon sera ajouté prochainement.
              </Text>
            )}
          </View>
          {canTrack ? (
            <>
              <View style={styles.exerciseCard}>
                <ActivityHeader
                  icon="edit-note"
                  title="Exercices associés"
                  description={
                    lessonExercises.length
                      ? `${lessonExercises.length} exercice${lessonExercises.length > 1 ? "s" : ""} disponible${lessonExercises.length > 1 ? "s" : ""} pour cette leçon.`
                      : "Aucun exercice associé n’est disponible pour le moment."
                  }
                />
                {lessonExercises.length ? (
                  <LaunchButton
                    label="S’entraîner sur la leçon"
                    onPress={() =>
                      router.push({
                        pathname: "/(tabs)/exercises",
                        params: { lessonId: lesson.id },
                      })
                    }
                  />
                ) : null}
              </View>
              <View style={styles.quizCard}>
                <ActivityHeader
                  icon="quiz"
                  title="Quiz associés"
                  description={
                    lessonQuizzes.length
                      ? `${lessonQuizzes.length} quiz disponible${lessonQuizzes.length > 1 ? "s" : ""} pour cette leçon.`
                      : "Aucun quiz associé n’est disponible pour le moment."
                  }
                />
                {lessonQuizzes.length ? (
                  <LaunchButton
                    label="Évaluer mes acquis"
                    onPress={() =>
                      router.push({
                        pathname: "/(tabs)/quizzes",
                        params: { lessonId: lesson.id },
                      })
                    }
                  />
                ) : null}
              </View>
            </>
          ) : null}
          <View style={styles.navigation}>
            <NavButton
              direction="previous"
              label={previous ? "Leçon précédente" : "Début du chapitre"}
              disabled={!previous}
              onPress={() =>
                previous && router.replace(`/course/lesson/${previous.id}`)
              }
            />
            <NavButton
              direction="next"
              label={next ? "Leçon suivante" : "Fin du chapitre"}
              disabled={!next}
              onPress={() =>
                next && router.replace(`/course/lesson/${next.id}`)
              }
            />
          </View>
        </View>
      </ScrollView>
    </AppScreen>
  );
}

function ActivityHeader({
  icon,
  title,
  description,
}: {
  icon: "edit-note" | "quiz";
  title: string;
  description: string;
}) {
  const { colors } = useEduTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.exerciseHeader}>
      <View style={styles.exerciseIcon}>
        <MaterialIcons name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.exerciseCopy}>
        <Text style={styles.exerciseTitle}>{title}</Text>
        <Text style={styles.exerciseDescription}>{description}</Text>
      </View>
    </View>
  );
}
function LaunchButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  const { colors } = useEduTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.exerciseButton,
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.exerciseLabel}>{label}</Text>
      <MaterialIcons name="arrow-forward" size={18} color={colors.primary} />
    </Pressable>
  );
}
function NavButton({
  direction,
  label,
  disabled,
  onPress,
}: {
  direction: "previous" | "next";
  label: string;
  disabled: boolean;
  onPress: () => void;
}) {
  const { colors } = useEduTheme();
  const styles = useMemo(() => navStyles(colors), [colors]);
  const icon = direction === "previous" ? "chevron-left" : "chevron-right";
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <MaterialIcons
        name={icon}
        size={20}
        color={disabled ? colors.muted : colors.primary}
      />
      <Text
        style={[
          styles.label,
          { color: disabled ? colors.muted : colors.primary },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const createStyles = (colors: ReturnType<typeof useEduTheme>["colors"]) =>
  StyleSheet.create({
    content: { paddingTop: 18, paddingBottom: 30 },
    inner: { paddingHorizontal: 20 },
    previewNotice: {
      marginTop: 16,
      padding: 13,
      borderRadius: 15,
      backgroundColor: colors.warningSoft,
      borderWidth: 1,
      borderColor: colors.warning,
      flexDirection: "row",
      gap: 9,
      alignItems: "flex-start",
    },
    previewNoticeText: {
      flex: 1,
      color: colors.text,
      fontSize: 12,
      lineHeight: 18,
      fontWeight: "700",
    },
    exportCard: {
      marginTop: 16,
      gap: 13,
      padding: 15,
      backgroundColor: colors.surface,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    exportHeader: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
    exportActions: { flexDirection: "row", gap: 9 },
    exportSecondaryButton: {
      flex: 1,
      minHeight: 42,
      borderRadius: 12,
      backgroundColor: colors.primarySoft,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 6,
    },
    exportSecondaryLabel: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: "900",
    },
    exportPrimaryButton: {
      flex: 1,
      minHeight: 42,
      borderRadius: 12,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 6,
    },
    exportPrimaryLabel: {
      color: colors.surface,
      fontSize: 12,
      fontWeight: "900",
    },
    progressCard: {
      marginTop: 18,
      padding: 14,
      backgroundColor: colors.surface,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statusRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    iconButton: {
      minHeight: 38,
      minWidth: 38,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 12,
      backgroundColor: colors.primarySoft,
    },
    completeButton: {
      minHeight: 44,
      marginTop: 12,
      borderRadius: 13,
      backgroundColor: colors.primary,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 7,
      paddingHorizontal: 14,
    },
    completeLabel: { color: colors.surface, fontSize: 13, fontWeight: "900" },
    completedText: {
      color: colors.success,
      fontSize: 13,
      lineHeight: 18,
      fontWeight: "800",
      marginTop: 10,
    },
    trackingError: {
      color: colors.error,
      fontSize: 12,
      lineHeight: 17,
      marginTop: 10,
    },
    sessionsCard: {
      marginTop: 18,
      gap: 8,
      padding: 14,
      borderRadius: 18,
      backgroundColor: colors.primarySoft,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    sessionsTitle: { color: colors.primary, fontSize: 15, fontWeight: "900" },
    sessionsDescription: { color: colors.text, fontSize: 12, lineHeight: 18 },
    sessionsChips: { gap: 8, paddingTop: 2 },
    sessionChip: {
      width: 142,
      minHeight: 74,
      gap: 4,
      padding: 10,
      borderRadius: 13,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    sessionChipActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },
    sessionChipOrder: {
      color: colors.primary,
      fontSize: 11,
      fontWeight: "900",
    },
    sessionChipText: {
      color: colors.text,
      fontSize: 12,
      lineHeight: 17,
      fontWeight: "800",
    },
    sessionChipTextActive: { color: colors.surface },
    reader: {
      marginTop: 23,
      backgroundColor: colors.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 18,
    },
    sessionReaderTitle: {
      color: colors.primary,
      fontSize: 18,
      lineHeight: 25,
      fontWeight: "900",
      marginBottom: 4,
    },
    sessionReaderDescription: {
      color: colors.muted,
      fontSize: 12,
      lineHeight: 18,
      marginBottom: 14,
    },
    emptyContent: { color: colors.text, fontSize: 16, lineHeight: 26 },
    exerciseCard: {
      marginTop: 18,
      gap: 13,
      padding: 15,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    quizCard: {
      marginTop: 12,
      gap: 13,
      padding: 15,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    exerciseHeader: { flexDirection: "row", gap: 11 },
    exerciseIcon: {
      width: 38,
      height: 38,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primarySoft,
    },
    exerciseCopy: { flex: 1 },
    exerciseTitle: { color: colors.text, fontSize: 14, fontWeight: "900" },
    exerciseDescription: {
      color: colors.muted,
      fontSize: 12,
      lineHeight: 18,
      marginTop: 3,
    },
    exerciseButton: {
      minHeight: 41,
      paddingHorizontal: 12,
      borderRadius: 12,
      backgroundColor: colors.primarySoft,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    exerciseLabel: { color: colors.primary, fontSize: 12, fontWeight: "900" },
    navigation: { flexDirection: "row", gap: 10, marginTop: 18 },
    disabled: { opacity: 0.55 },
    pressed: { opacity: 0.72 },
  });
const navStyles = (colors: ReturnType<typeof useEduTheme>["colors"]) =>
  StyleSheet.create({
    button: {
      flex: 1,
      minHeight: 48,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 5,
      paddingHorizontal: 9,
    },
    disabled: { backgroundColor: colors.background },
    pressed: { opacity: 0.72 },
    label: { fontSize: 12, fontWeight: "800", textAlign: "center" },
  });
