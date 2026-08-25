import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { AppScreen } from "@/components/edutech/app-screen";
import { CourseEmpty, CourseError, CourseLoading, CourseRowIcon } from "@/components/edutech/course-feedback";
import { LessonStatusBadge, ProgressSummary } from "@/components/edutech/learning-progress";
import { PageHeader } from "@/components/edutech/page-header";
import { CourseChapter, CourseLesson, getChapter, getLessonsForChapter } from "@/lib/courses/course-service";
import { useEduTheme } from "@/lib/edutech/theme-context";
import { useSupabaseAuth } from "@/lib/auth/supabase-auth-provider";
import { pedagogicalCacheContextFromProfile } from "@/lib/offline/pedagogical-cache";
import { getLearningProgress, progressForChapter, progressForLesson, type LearningProgressDashboard } from "@/lib/progress/learning-progress-service";

const emptyDashboard: LearningProgressDashboard = { subjects: [], completedLessons: 0, totalLessons: 0, percentage: 0 };

export default function ChapterScreen() {
  const { chapterId } = useLocalSearchParams<{ chapterId: string }>(); const router = useRouter(); const { colors } = useEduTheme(); const { profile } = useSupabaseAuth(); const cacheContext = pedagogicalCacheContextFromProfile(profile);
  const [chapter, setChapter] = useState<CourseChapter | null>(null); const [lessons, setLessons] = useState<CourseLesson[]>([]); const [dashboard, setDashboard] = useState<LearningProgressDashboard>(emptyDashboard); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null); const styles = useMemo(() => createStyles(colors), [colors]);
  const load = useCallback(async () => { if (!chapterId) return; setLoading(true); setError(null); try { const [nextChapter, nextLessons, progress] = await Promise.all([getChapter(chapterId, { cacheContext }), getLessonsForChapter(chapterId, { cacheContext }), getLearningProgress()]); setChapter(nextChapter); setLessons(nextLessons); setDashboard(progress); } catch (cause) { setError(cause instanceof Error ? cause.message : "Une erreur inattendue est survenue."); } finally { setLoading(false); } }, [cacheContext, chapterId]);
  useFocusEffect(useCallback(() => { void load(); }, [load]));
  if (loading) return <AppScreen><CourseLoading label="Chargement des leçons" /></AppScreen>;
  if (error) return <AppScreen><CourseError message={error} onRetry={() => void load()} /></AppScreen>;
  if (!chapter) return <AppScreen><CourseEmpty title="Chapitre indisponible" description="Ce chapitre n’est pas accessible avec votre profil scolaire actuel." /></AppScreen>;
  const chapterProgress = progressForChapter(dashboard, chapter.id);
  return <AppScreen withPadding={false}><FlatList data={lessons} keyExtractor={(item) => item.id} contentContainerStyle={styles.content} ListHeaderComponent={<View style={styles.header}><PageHeader title={chapter.title} subtitle={chapter.description || "Leçons disponibles dans ce chapitre."} back />{chapterProgress?.totalLessons ? <View style={styles.overview}><ProgressSummary completed={chapterProgress.completedLessons} total={chapterProgress.totalLessons} percentage={chapterProgress.percentage} /></View> : <View style={styles.pending}><Text style={styles.pendingText}>Contenu à venir</Text></View>}<Text style={styles.section}>Leçons</Text></View>} renderItem={({ item, index }) => { const lessonProgress = progressForLesson(dashboard, item.id); return <Pressable accessibilityRole="button" onPress={() => router.push(`/course/lesson/${item.id}`)} style={({ pressed }) => [styles.card, pressed && styles.pressed]}><CourseRowIcon index={index} /><View style={styles.copy}><Text style={styles.title}>{item.title}</Text><Text style={styles.description}>{item.description || "Ouvrir la leçon."}</Text><LessonStatusBadge status={lessonProgress?.status ?? "not_started"} /></View><MaterialIcons name="chevron-right" size={23} color={colors.muted} /></Pressable>; }} ListEmptyComponent={<CourseEmpty title="Aucune leçon disponible" description="Les leçons de ce chapitre seront ajoutées prochainement." />} /></AppScreen>;
}

const createStyles = (colors: ReturnType<typeof useEduTheme>["colors"]) => StyleSheet.create({ content: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 18, paddingBottom: 28, gap: 10 }, header: { marginBottom: 6 }, overview: { marginTop: 18, padding: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 18 }, pending: { marginTop: 18, padding: 14, backgroundColor: colors.surfaceMuted, borderRadius: 16 }, pendingText: { color: colors.muted, fontSize: 13, fontWeight: "800" }, section: { color: colors.text, fontSize: 16, lineHeight: 22, fontWeight: "800", marginTop: 24, marginBottom: 10 }, card: { minHeight: 74, padding: 14, flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface }, pressed: { opacity: 0.72 }, copy: { flex: 1 }, title: { color: colors.text, fontSize: 16, lineHeight: 21, fontWeight: "800" }, description: { color: colors.muted, fontSize: 12, lineHeight: 17, marginTop: 3 } });
