import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { AppScreen } from "@/components/edutech/app-screen";
import { BrandMark } from "@/components/edutech/brand-mark";
import { EmptyState } from "@/components/edutech/empty-state";
import { ProgressSummary } from "@/components/edutech/learning-progress";
import { useSupabaseAuth } from "@/lib/auth/supabase-auth-provider";
import { useEduTheme } from "@/lib/edutech/theme-context";
import { getExerciseCatalog } from "@/lib/exercises/exercise-service";
import { pedagogicalCacheContextFromProfile } from "@/lib/offline/pedagogical-cache";
import { usePedagogicalPreload } from "@/lib/offline/pedagogical-preload-context";
import {
  getLearningProgress,
  type LearningProgressDashboard,
} from "@/lib/progress/learning-progress-service";
import { getQuizCatalog } from "@/lib/quizzes/quiz-service";

const shortcuts = [
  { label: "Cours", icon: "menu-book", route: "/(tabs)/courses" },
  { label: "Quiz", icon: "quiz", route: "/(tabs)/quizzes" },
  { label: "Exercices", icon: "edit-note", route: "/(tabs)/exercises" },
  { label: "Mentor IA", icon: "psychology", route: "/mentor" },
  { label: "Citations", icon: "format-quote", route: "/citations" },
  { label: "Bulletin", icon: "assessment", route: "/bulletin" },
  { label: "Dictionnaire", icon: "menu-book", route: "/dictionary" },
] as const;

const emptyDashboard: LearningProgressDashboard = {
  subjects: [],
  completedLessons: 0,
  totalLessons: 0,
  percentage: 0,
};

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useEduTheme();
  const { profile, user } = useSupabaseAuth();
  const { state: preloadState, domains } = usePedagogicalPreload();
  const [dashboard, setDashboard] = useState<LearningProgressDashboard>(emptyDashboard);
  const [completedExercises, setCompletedExercises] = useState(0);
  const [completedQuizzes, setCompletedQuizzes] = useState(0);
  const [progressLoading, setProgressLoading] = useState(true);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const cacheContext = useMemo(
    () =>
      pedagogicalCacheContextFromProfile(
        profile?.id && profile.school_level && profile.series && profile.role
          ? {
              id: profile.id,
              school_level: profile.school_level,
              series: profile.series,
              role: profile.role,
            }
          : null,
      ),
    [profile],
  );

  const loadProgress = useCallback(async () => {
    if (profile?.role !== "student") {
      setProgressLoading(false);
      return;
    }
    setProgressLoading(true);
    try {
      const [nextDashboard, exercises, quizzes] = await Promise.all([
        getLearningProgress({ forceRefresh: true }),
        getExerciseCatalog({ cacheContext, forceRefresh: true }),
        getQuizCatalog({ cacheContext, forceRefresh: true }),
      ]);
      setDashboard(nextDashboard);
      setCompletedExercises(
        exercises.filter((exercise) => exercise.lastStatus === "submitted").length,
      );
      setCompletedQuizzes(
        quizzes.filter((quiz) => quiz.lastStatus === "submitted").length,
      );
    } catch {
      // Chaque service utilise son cache local lorsque disponible ; l’accueil
      // conserve la dernière synthèse connue sans masquer le reste de l’app.
    } finally {
      setProgressLoading(false);
    }
  }, [cacheContext, profile?.role]);

  useFocusEffect(
    useCallback(() => {
      void loadProgress();
    }, [loadProgress]),
  );

  const firstName =
    profile?.first_name ||
    profile?.full_name?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "";
  const greeting = firstName ? `Bonjour, ${firstName}` : "Bonjour, bienvenue";
  const preloadProgress = Object.values(domains).reduce(
    (total, domain) => ({
      done: total.done + domain.succeededCount,
      expected: total.expected + domain.expectedCount,
    }),
    { done: 0, expected: 0 },
  );
  const syncCopy =
    preloadState === "ready"
      ? "Contenu hors ligne prêt"
      : preloadState === "syncing"
        ? `Synchronisation du contenu…${preloadProgress.expected ? ` ${preloadProgress.done}/${preloadProgress.expected}` : ""}`
        : preloadState === "interrupted"
          ? "Synchronisation interrompue — reprise automatique."
          : preloadState === "partial" || preloadState === "error"
            ? "Contenu partiellement préparé — reprise automatique."
            : null;
  const resumeLessonId = dashboard.subjects.find(
    (subject) => subject.resumeLessonId,
  )?.resumeLessonId;
  const hasLearningActivity =
    dashboard.completedLessons > 0 || completedExercises > 0 || completedQuizzes > 0;

  return (
    <AppScreen withPadding={false}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.header}>
          <BrandMark compact />
          <View style={styles.welcome}>
            <Text style={styles.eyebrow}>ESPACE ÉLÈVE</Text>
            <Text style={styles.title}>{greeting}</Text>
            <Text style={styles.subtitle}>Votre espace d’apprentissage est prêt.</Text>
          </View>
        </View>
        <View style={styles.body}>
          {syncCopy ? (
            <View
              accessibilityLiveRegion="polite"
              style={[
                styles.syncCard,
                preloadState === "ready" && styles.syncCardReady,
              ]}
            >
              <MaterialIcons
                name={
                  preloadState === "ready"
                    ? "offline-pin"
                    : preloadState === "syncing"
                      ? "sync"
                      : "sync-problem"
                }
                size={19}
                color={preloadState === "ready" ? colors.success : colors.primary}
              />
              <Text
                style={[
                  styles.syncText,
                  preloadState === "ready" && styles.syncTextReady,
                ]}
              >
                {syncCopy}
              </Text>
            </View>
          ) : null}

          <Text style={styles.sectionTitle}>Accès rapide</Text>
          <View style={styles.shortcuts}>
            {shortcuts.map((item) => (
              <Pressable
                key={item.label}
                accessibilityRole="button"
                accessibilityLabel={item.label}
                onPress={() => router.push(item.route)}
                style={({ pressed }) => [styles.shortcut, pressed && styles.pressed]}
              >
                <View style={styles.shortcutIcon}>
                  <MaterialIcons name={item.icon} size={23} color={colors.primary} />
                </View>
                <Text style={styles.shortcutText}>{item.label}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Continuer mon apprentissage</Text>
          {resumeLessonId ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Continuer mon cours"
              onPress={() => router.push(`/course/lesson/${resumeLessonId}`)}
              style={({ pressed }) => [styles.resumeCard, pressed && styles.pressed]}
            >
              <View style={styles.resumeIcon}>
                <MaterialIcons name="play-circle-outline" size={24} color={colors.surface} />
              </View>
              <View style={styles.cardCopy}>
                <Text style={styles.cardTitle}>Reprendre mon cours</Text>
                <Text style={styles.cardText}>
                  Votre dernière leçon commencée est prête à être poursuivie.
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={23} color={colors.surface} />
            </Pressable>
          ) : (
            <EmptyState
              icon="play-circle-outline"
              title="Aucun apprentissage en cours"
              description="Vos cours commencés apparaîtront ici lorsque le contenu sera disponible."
            />
          )}

          <Text style={styles.sectionTitle}>Ma progression</Text>
          <View style={styles.infoCard}>
            <MaterialIcons name="insights" size={23} color={colors.primary} />
            <View style={styles.cardCopy}>
              <Text style={styles.cardTitle}>
                {progressLoading ? "Actualisation de la progression…" : "Progression des cours"}
              </Text>
              {dashboard.totalLessons > 0 ? (
                <ProgressSummary
                  completed={dashboard.completedLessons}
                  total={dashboard.totalLessons}
                  percentage={dashboard.percentage}
                />
              ) : (
                <Text style={styles.cardText}>
                  Les indicateurs apparaîtront dès qu’une leçon publiée sera accessible.
                </Text>
              )}
            </View>
          </View>

          <Text style={styles.sectionTitle}>Activités récentes</Text>
          {hasLearningActivity ? (
            <View style={styles.activityCard}>
              <ActivityMetric
                icon="menu-book"
                label="Leçons terminées"
                value={dashboard.completedLessons}
              />
              <ActivityMetric
                icon="edit-note"
                label="Exercices soumis"
                value={completedExercises}
              />
              <ActivityMetric
                icon="quiz"
                label="Quiz soumis"
                value={completedQuizzes}
              />
            </View>
          ) : (
            <EmptyState
              icon="history"
              title="Aucune activité récente"
              description="Les leçons terminées et évaluations soumises seront affichées ici."
            />
          )}
        </View>
      </ScrollView>
    </AppScreen>
  );
}

function ActivityMetric({
  icon,
  label,
  value,
}: {
  icon: "menu-book" | "edit-note" | "quiz";
  label: string;
  value: number;
}) {
  const { colors } = useEduTheme();
  return (
    <View style={stylesMetric.item}>
      <MaterialIcons name={icon} size={19} color={colors.primary} />
      <Text style={[stylesMetric.value, { color: colors.text }]}>{value}</Text>
      <Text style={[stylesMetric.label, { color: colors.muted }]}>{label}</Text>
    </View>
  );
}

const stylesMetric = StyleSheet.create({
  item: { flex: 1, alignItems: "center", gap: 5 },
  value: { fontSize: 19, fontWeight: "900" },
  label: { fontSize: 10, lineHeight: 14, textAlign: "center", fontWeight: "700" },
});

const createStyles = (colors: ReturnType<typeof useEduTheme>["colors"]) =>
  StyleSheet.create({
    scroll: { paddingBottom: 28 },
    header: {
      backgroundColor: colors.primarySoft,
      paddingHorizontal: 20,
      paddingTop: 23,
      paddingBottom: 25,
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 12,
    },
    welcome: { flex: 1 },
    eyebrow: { color: colors.primary, fontSize: 10, lineHeight: 14, fontWeight: "800", letterSpacing: 1.2 },
    title: { color: colors.text, fontSize: 22, lineHeight: 28, fontWeight: "800", marginTop: 2 },
    subtitle: { color: colors.muted, fontSize: 13, lineHeight: 18, marginTop: 2 },
    body: { paddingHorizontal: 20, paddingTop: 22, gap: 14 },
    syncCard: { flexDirection: "row", alignItems: "center", gap: 9, borderRadius: 13, borderWidth: 1, borderColor: colors.primary, backgroundColor: colors.primarySoft, paddingHorizontal: 12, paddingVertical: 10 },
    syncCardReady: { borderColor: colors.success, backgroundColor: `${colors.success}14` },
    syncText: { flex: 1, color: colors.primary, fontSize: 12, lineHeight: 17, fontWeight: "800" },
    syncTextReady: { color: colors.success },
    sectionTitle: { color: colors.text, fontSize: 17, lineHeight: 23, fontWeight: "800", marginTop: 5 },
    shortcuts: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    shortcut: { width: "31.7%", minHeight: 94, borderRadius: 17, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 11, justifyContent: "space-between" },
    shortcutIcon: { width: 35, height: 35, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: colors.primarySoft },
    shortcutText: { color: colors.text, fontSize: 11, lineHeight: 15, fontWeight: "800" },
    resumeCard: { flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 18, padding: 15, backgroundColor: colors.primary },
    resumeIcon: { width: 38, height: 38, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: `${colors.surface}33` },
    infoCard: { flexDirection: "row", gap: 13, alignItems: "flex-start", padding: 16, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 18 },
    activityCard: { flexDirection: "row", gap: 8, padding: 16, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 18 },
    cardCopy: { flex: 1 },
    cardTitle: { color: colors.text, fontSize: 15, lineHeight: 20, fontWeight: "800" },
    cardText: { color: colors.muted, fontSize: 13, lineHeight: 18, marginTop: 3 },
    pressed: { opacity: 0.7, transform: [{ scale: 0.98 }] },
  });
