import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { AppScreen } from "@/components/edutech/app-screen";
import { CourseEmpty, CourseError, CourseLoading, CourseRowIcon } from "@/components/edutech/course-feedback";
import { PageHeader } from "@/components/edutech/page-header";
import { ProgressSummary } from "@/components/edutech/learning-progress";
import { useSupabaseAuth } from "@/lib/auth/supabase-auth-provider";
import { CourseSubject, getCoursesForProfile } from "@/lib/courses/course-service";
import { useEduTheme } from "@/lib/edutech/theme-context";
import { getLearningProgress, type LearningProgressDashboard, progressForOffering } from "@/lib/progress/learning-progress-service";

const emptyDashboard: LearningProgressDashboard = { subjects: [], completedLessons: 0, totalLessons: 0, percentage: 0 };

export default function CoursesScreen() {
  const router = useRouter();
  const { colors } = useEduTheme();
  const { profile, isProfileLoading } = useSupabaseAuth();
  const [items, setItems] = useState<CourseSubject[]>([]);
  const [dashboard, setDashboard] = useState<LearningProgressDashboard>(emptyDashboard);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const load = useCallback(async () => {
    if (!profile) return;
    setLoading(true); setError(null);
    try {
      const [subjects, progress] = await Promise.all([getCoursesForProfile(profile), getLearningProgress()]);
      setItems(subjects); setDashboard(progress);
    } catch (cause) {
      setItems([]); setDashboard(emptyDashboard);
      setError(cause instanceof Error ? cause.message : "Une erreur inattendue est survenue.");
    } finally { setLoading(false); }
  }, [profile]);

  useEffect(() => {
    if (profile) {
      void load();
      return;
    }
    if (!isProfileLoading) setLoading(false);
  }, [isProfileLoading, load, profile]);
  if (loading) return <AppScreen><CourseLoading label="Chargement de vos matières" /></AppScreen>;
  if (error) return <AppScreen><CourseError message={error} onRetry={() => void load()} /></AppScreen>;
  if (!profile?.school_level || !profile.series) return <AppScreen><CourseEmpty title="Profil scolaire incomplet" description="Renseignez votre niveau scolaire et votre série pour recevoir les cours qui vous sont destinés." actionLabel="Voir mon profil" onAction={() => router.push("/(tabs)/profile")} /></AppScreen>;

  return <AppScreen withPadding={false}><FlatList data={items} keyExtractor={(item) => item.offeringId} contentContainerStyle={styles.content} ListHeaderComponent={<View><View style={styles.header}><PageHeader title="Mes cours" subtitle="Les matières adaptées à votre parcours scolaire." /><View style={styles.target}><MaterialIcons name="school" size={19} color={colors.primary} /><Text style={styles.targetText}>{profile.school_level} · {profile.series}</Text></View>{dashboard.totalLessons > 0 ? <View style={styles.globalProgress}><Text style={styles.globalLabel}>Progression globale</Text><ProgressSummary completed={dashboard.completedLessons} total={dashboard.totalLessons} percentage={dashboard.percentage} /></View> : null}<Text style={styles.section}>Matières disponibles</Text></View></View>} renderItem={({ item, index }) => {
    const subjectProgress = progressForOffering(dashboard, item.offeringId);
    const hasPublishedLessons = Boolean(subjectProgress?.totalLessons);
    return <Pressable accessibilityRole="button" onPress={() => router.push(`/course/${item.offeringId}`)} style={({ pressed }) => [styles.card, pressed && styles.pressed]}><CourseRowIcon index={index} /><View style={styles.cardCopy}><Text style={styles.cardTitle}>{item.name}</Text><Text style={styles.cardDescription}>{hasPublishedLessons ? (item.description || "Consulter les chapitres disponibles.") : "Aucun cours disponible pour votre niveau et votre série pour le moment."}</Text>{hasPublishedLessons && subjectProgress ? <ProgressSummary completed={subjectProgress.completedLessons} total={subjectProgress.totalLessons} percentage={subjectProgress.percentage} /> : <View style={styles.emptyBadge}><MaterialIcons name="info-outline" size={13} color={colors.warning} /><Text style={styles.emptyBadgeText}>Matière disponible, contenu à venir</Text></View>}</View><MaterialIcons name="chevron-right" size={23} color={colors.muted} /></Pressable>;
  }} ListEmptyComponent={<CourseEmpty title="Aucun cours disponible" description="Aucun cours disponible pour votre niveau et votre série pour le moment." />} /></AppScreen>;
}

const createStyles = (colors: ReturnType<typeof useEduTheme>["colors"]) => StyleSheet.create({
  content: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 28, gap: 10 }, header: { marginBottom: 6 }, target: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 7, backgroundColor: colors.primarySoft, borderRadius: 99, paddingHorizontal: 12, paddingVertical: 8, marginTop: 6 }, targetText: { color: colors.primary, fontSize: 13, fontWeight: "800" }, globalProgress: { marginTop: 18, padding: 14, borderRadius: 16, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }, globalLabel: { color: colors.text, fontSize: 13, lineHeight: 18, fontWeight: "900" }, section: { color: colors.text, fontSize: 16, lineHeight: 22, fontWeight: "800", marginTop: 26, marginBottom: 10 }, card: { minHeight: 76, padding: 14, flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface }, pressed: { opacity: 0.72 }, cardCopy: { flex: 1 }, cardTitle: { color: colors.text, fontSize: 16, lineHeight: 21, fontWeight: "800" }, cardDescription: { color: colors.muted, fontSize: 12, lineHeight: 17, marginTop: 3 }, emptyBadge: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 5, marginTop: 8, paddingHorizontal: 8, paddingVertical: 5, backgroundColor: colors.warningSoft, borderRadius: 10 }, emptyBadgeText: { color: colors.warning, fontSize: 11, lineHeight: 14, fontWeight: "800" } });
