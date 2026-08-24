import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { AppScreen } from "@/components/edutech/app-screen";
import { AdminField, AdminLoading, AdminNotice, AdminToggle } from "@/components/edutech/admin-ui";
import { PageHeader } from "@/components/edutech/page-header";
import { PrimaryButton } from "@/components/edutech/primary-button";
import { LessonMarkdown } from "@/components/edutech/lesson-markdown";
import { useSupabaseAuth } from "@/lib/auth/supabase-auth-provider";
import { AdminChapter, AdminLesson, deleteAdminLesson, getAdminChapter, getAdminLesson, saveAdminLesson } from "@/lib/admin/course-admin-service";
import { getLessonSessions, type LessonSession } from "@/lib/courses/lesson-session-service";
import { useEduTheme } from "@/lib/edutech/theme-context";

export default function AdminLessonEditor() {
  const { lessonId, chapterId } = useLocalSearchParams<{ lessonId: string; chapterId?: string }>();
  const router = useRouter();
  const { isAdmin } = useSupabaseAuth();
  const { colors } = useEduTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const creating = lessonId === "new";
  const [lesson, setLesson] = useState<AdminLesson | null>(null);
  const [chapter, setChapter] = useState<AdminChapter | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);
  const [sessions, setSessions] = useState<LessonSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (creating) {
        if (!chapterId) {
          setError("Sélectionnez d’abord un chapitre pour créer une leçon.");
          return;
        }
        const target = await getAdminChapter(chapterId);
        if (!target) {
          setError("Le chapitre choisi n’est plus disponible.");
          return;
        }
        setChapter(target);
        setSessions([]);
        setActiveSessionId(null);
        return;
      }

      const item = await getAdminLesson(lessonId);
      if (!item) {
        setError("Cette leçon n’est plus disponible.");
        return;
      }
      const target = await getAdminChapter(item.chapterId);
      if (!target) {
        setError("Le chapitre associé est indisponible.");
        return;
      }
      setLesson(item);
      setChapter(target);
      setTitle(item.title);
      setDescription(item.description ?? "");
      setContent(item.content ?? "");
      setDisplayOrder(String(item.displayOrder));
      setIsActive(item.isActive);
      const nextSessions = await getLessonSessions(item.id, { includeInactive: true });
      setSessions(nextSessions);
      setActiveSessionId((current) => nextSessions.some((session) => session.id === current) ? current : (nextSessions[0]?.id ?? null));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "La leçon n’a pas pu être chargée.");
    } finally {
      setLoading(false);
    }
  }, [chapterId, creating, lessonId]);

  const activeSession = sessions.find((session) => session.id === activeSessionId) ?? null;

  useEffect(() => {
    void load();
  }, [load]);

  const persist = async (nextActive = isActive) => {
    if (!chapter) return;
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const saved = await saveAdminLesson({ chapterId: chapter.id, title, description, content, displayOrder: Number(displayOrder) || 0, isActive: nextActive }, creating ? undefined : lessonId);
      setLesson(saved);
      setIsActive(saved.isActive);
      setNotice("Leçon enregistrée dans Supabase.");
      if (creating) router.replace(`/administration/lessons/${saved.id}` as any);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "La leçon n’a pas pu être enregistrée.");
    } finally {
      setSaving(false);
    }
  };

  const remove = () => {
    if (!lesson) return;
    if (lesson.isTestData) {
      setError("La leçon de test est protégée contre la suppression.");
      return;
    }
    Alert.alert("Supprimer cette leçon ?", "Cette action est irréversible.", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteAdminLesson(lesson);
            router.replace("/administration/lessons" as any);
          } catch (cause) {
            setError(cause instanceof Error ? cause.message : "La suppression a échoué.");
          }
        },
      },
    ]);
  };

  if (!isAdmin) return <Redirect href="/(tabs)" />;
  if (loading) return <AppScreen><AdminLoading label="Chargement de la leçon…" /></AppScreen>;

  return (
    <AppScreen edges={["top", "bottom", "left", "right"]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <PageHeader title={creating ? "Nouvelle leçon" : "Modifier la leçon"} subtitle={chapter?.title ?? "Chapitre"} back />
          <View style={styles.form}>
            {chapter ? <View style={styles.target}><MaterialIcons name="format-list-numbered" size={19} color={colors.primary} /><Text style={styles.targetText}>Rattachée au chapitre « {chapter.title} »</Text></View> : null}
            <AdminField label="Titre" value={title} onChange={setTitle} placeholder="Ex. Définition" />
            <AdminField label="Description" value={description} onChange={setDescription} multiline required={false} placeholder="Résumé visible avant la lecture" />
            {sessions.length ? <View style={styles.sessionsCard}><View style={styles.sessionsHeader}><MaterialIcons name="view-agenda" size={21} color={colors.primary} /><View style={styles.sessionsCopy}><Text style={styles.sessionsTitle}>Séances méthodologiques</Text><Text style={styles.sessionsDescription}>Le contenu pédagogique de cette leçon est organisé en séances. Il demeure en brouillon tant que vous ne le publiez pas volontairement.</Text></View></View><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sessionChips}>{sessions.map((session, index) => <Pressable key={session.id} accessibilityRole="button" accessibilityState={{ selected: activeSession?.id === session.id }} onPress={() => setActiveSessionId(session.id)} style={({ pressed }) => [styles.sessionChip, activeSession?.id === session.id && styles.sessionChipActive, pressed && styles.pressed]}><Text style={[styles.sessionOrder, activeSession?.id === session.id && styles.sessionTextActive]}>S{index + 1}</Text><Text numberOfLines={2} style={[styles.sessionChipText, activeSession?.id === session.id && styles.sessionTextActive]}>{session.title.replace(/^Séance\s*\d+\s*[:—-]\s*/i, "")}</Text></Pressable>)}</ScrollView>{activeSession ? <View style={styles.sessionPreview}><Text style={styles.sessionPreviewTitle}>{activeSession.title}</Text>{activeSession.description ? <Text style={styles.sessionPreviewDescription}>{activeSession.description}</Text> : null}<LessonMarkdown content={activeSession.content} /></View> : null}</View> : <AdminField label="Contenu Markdown" value={content} onChange={setContent} multiline required={false} placeholder="Utilisez ## titres, ### sous-titres, listes, tableaux et > encadrés." />}
            <AdminField label="Ordre d’affichage" value={displayOrder} onChange={setDisplayOrder} keyboardType="numeric" placeholder="0 = prochain ordre disponible" />
            <AdminToggle label="Leçon active" description="Une leçon inactive reste visible dans Administration mais pas dans le parcours élève." value={isActive} onChange={setIsActive} />
            {lesson?.isTestData ? <AdminNotice tone="warning">Cette leçon sert à tester le moteur de cours. Son contenu n’est pas remplacé automatiquement.</AdminNotice> : null}
            {notice ? <AdminNotice tone="success">{notice}</AdminNotice> : null}
            {error ? <AdminNotice tone="error">{error}</AdminNotice> : null}
            <PrimaryButton label={creating ? "Créer la leçon" : "Enregistrer les modifications"} onPress={() => void persist()} loading={saving} icon={<MaterialIcons name="save" size={19} color={colors.surface} />} />
            {lesson ? <PrimaryButton label="Prévisualiser le rendu" variant="secondary" onPress={() => router.push(`/course/lesson/${lesson.id}` as any)} icon={<MaterialIcons name="visibility" size={19} color={colors.primary} />} /> : null}
            {!creating && lesson && !lesson.isTestData ? <PrimaryButton label="Supprimer la leçon" variant="danger" onPress={remove} icon={<MaterialIcons name="delete-outline" size={19} color={colors.surface} />} /> : null}
            <Text style={styles.help}>Enregistrez avant de prévisualiser. Le contenu est conservé en Markdown pédagogique ; le lecteur interprète les titres, listes, tableaux et encadrés sans ajout automatique de texte.</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppScreen>
  );
}

const makeStyles = (colors: ReturnType<typeof useEduTheme>["colors"]) => StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingTop: 18, paddingBottom: 28 },
  form: { gap: 13 },
  target: { flexDirection: "row", gap: 9, alignItems: "center", borderRadius: 15, padding: 13, backgroundColor: colors.primarySoft },
  targetText: { flex: 1, color: colors.primary, fontSize: 13, lineHeight: 18, fontWeight: "800" },
  help: { color: colors.muted, fontSize: 12, lineHeight: 18, textAlign: "center", paddingHorizontal: 8 },
  sessionsCard: { gap: 11, borderRadius: 17, borderWidth: 1, borderColor: colors.primary, backgroundColor: colors.primarySoft, padding: 14 },
  sessionsHeader: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  sessionsCopy: { flex: 1 },
  sessionsTitle: { color: colors.primary, fontSize: 14, lineHeight: 20, fontWeight: "900" },
  sessionsDescription: { color: colors.text, fontSize: 12, lineHeight: 18, marginTop: 2 },
  sessionChips: { gap: 8, paddingTop: 2 },
  sessionChip: { width: 148, minHeight: 72, borderRadius: 13, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 10, gap: 4 },
  sessionChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  sessionOrder: { color: colors.primary, fontSize: 11, fontWeight: "900" },
  sessionChipText: { color: colors.text, fontSize: 12, lineHeight: 17, fontWeight: "800" },
  sessionTextActive: { color: colors.surface },
  sessionPreview: { borderRadius: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, padding: 14 },
  sessionPreviewTitle: { color: colors.primary, fontSize: 17, lineHeight: 24, fontWeight: "900", marginBottom: 3 },
  sessionPreviewDescription: { color: colors.muted, fontSize: 12, lineHeight: 18, marginBottom: 12 },
  pressed: { opacity: 0.72 },
});
