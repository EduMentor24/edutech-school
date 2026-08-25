import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { AppScreen } from "@/components/edutech/app-screen";
import { CourseEmpty, CourseError, CourseLoading } from "@/components/edutech/course-feedback";
import { LessonMarkdown } from "@/components/edutech/lesson-markdown";
import { PageHeader } from "@/components/edutech/page-header";
import { useSupabaseAuth } from "@/lib/auth/supabase-auth-provider";
import { useEduTheme } from "@/lib/edutech/theme-context";
import { pedagogicalCacheContextFromProfile } from "@/lib/offline/pedagogical-cache";
import { QuizAttempt, QuizDetail, QuizQuestion, formatQuizDuration, getQuizDetail, humanQuizDifficulty, remainingQuizSeconds, startQuizAttempt, submitQuizAttempt } from "@/lib/quizzes/quiz-service";

export default function QuizDetailScreen() {
  const { quizId } = useLocalSearchParams<{ quizId: string }>();
  const router = useRouter();
  const { colors } = useEduTheme();
  const { profile } = useSupabaseAuth();
  const { id: profileId, school_level: schoolLevel, series: profileSeries, role: profileRole } = profile ?? {};
  const cacheContext = useMemo(
    () => pedagogicalCacheContextFromProfile(
      profileId && schoolLevel && profileSeries && profileRole
        ? { id: profileId, school_level: schoolLevel, series: profileSeries, role: profileRole }
        : null,
    ),
    [profileId, schoolLevel, profileSeries, profileRole],
  );
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);
  const answersRef = useRef(answers);
  const submissionLock = useRef(false);
  const expirationHandled = useRef(false);

  useEffect(() => { answersRef.current = answers; }, [answers]);

  const load = useCallback(async () => {
    if (!quizId) return;
    setLoading(true);
    setError(null);
    try { setQuiz(await getQuizDetail(quizId, cacheContext)); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Une erreur inattendue est survenue."); }
    finally { setLoading(false); }
  }, [cacheContext, quizId]);

  useEffect(() => { void load(); }, [load]);

  const begin = useCallback(async () => {
    if (!quiz) return;
    setSaving(true);
    setError(null);
    setSyncNotice(null);
    try {
      const started = await startQuizAttempt(quiz.quizId, quiz.contentVersion);
      setAttempt(started);
      setAnswers({});
      setQuestionIndex(0);
      setRemaining(remainingQuizSeconds(started.startedAt, started.durationMinutes));
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Le démarrage du quiz a échoué."); }
    finally { setSaving(false); }
  }, [quiz]);

  const submit = useCallback(async (automatic = false, providedAnswers = answersRef.current) => {
    if (!attempt || submissionLock.current || attempt.status === "submitted") return;
    submissionLock.current = true;
    setConfirming(false);
    setSaving(true);
    setError(null);
    try {
      const submitted = await submitQuizAttempt(attempt.attemptId, providedAnswers);
      if (attempt.attemptId.startsWith("local-")) {
        setAttempt(submitted);
        setSyncNotice("Vos réponses sont enregistrées sur cet appareil. Elles seront envoyées et corrigées dès le retour d’Internet.");
        return;
      }
      router.replace(`/quiz/result/${attempt.attemptId}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : automatic ? "La soumission automatique a échoué." : "La soumission a échoué.");
    } finally {
      submissionLock.current = false;
      setSaving(false);
    }
  }, [attempt, router]);

  useEffect(() => {
    if (!attempt?.durationMinutes || attempt.status === "submitted") return;
    expirationHandled.current = false;
    const update = () => {
      const next = remainingQuizSeconds(attempt.startedAt, attempt.durationMinutes);
      setRemaining(next);
      if (next === 0 && !expirationHandled.current) {
        expirationHandled.current = true;
        void submit(true);
      }
    };
    update();
    const timer = setInterval(update, 1_000);
    return () => clearInterval(timer);
  }, [attempt?.attemptId, attempt?.durationMinutes, attempt?.startedAt, attempt?.status, submit]);

  if (loading) return <AppScreen><CourseLoading label="Chargement du quiz" /></AppScreen>;
  if (error && !quiz) return <AppScreen><CourseError message={error} onRetry={() => void load()} /></AppScreen>;
  if (!quiz) return <AppScreen><CourseEmpty title="Quiz indisponible" description="Ce quiz n’est pas accessible avec votre profil scolaire actuel." /></AppScreen>;

  const question = quiz.questions[questionIndex];
  const done = questionIndex === quiz.questions.length - 1;
  const answeredCount = Object.values(answers).filter((answer) => answer.length > 0).length;
  const localSubmissionPending = attempt?.attemptId.startsWith("local-") && attempt.status === "submitted";

  return <AppScreen withPadding={false}><ScrollView contentContainerStyle={styles.content}><View style={styles.inner}>
    <PageHeader title={quiz.title} subtitle={`${quiz.subjectName} · ${quiz.chapterTitle}`} back />
    <View style={styles.meta}><Text style={styles.metaText}>{quiz.lessonTitle}</Text>{quiz.difficulty ? <Text style={styles.metaText}>{humanQuizDifficulty(quiz.difficulty)}</Text> : null}<Text style={styles.metaText}>{quiz.questions.length} question{quiz.questions.length > 1 ? "s" : ""}</Text>{quiz.durationMinutes ? <Text style={styles.metaText}>{quiz.durationMinutes} min</Text> : null}</View>
    {!attempt ? <>
      <View style={styles.presentation}>{quiz.description ? <LessonMarkdown content={quiz.description} /> : <Text style={styles.description}>Lisez chaque question avec attention avant de choisir votre réponse.</Text>}</View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable accessibilityRole="button" disabled={saving || !quiz.questions.length} onPress={() => void begin()} style={({ pressed }) => [styles.primary, (saving || !quiz.questions.length) && styles.disabled, pressed && !saving && styles.pressed]}><MaterialIcons name="play-circle-outline" size={20} color={colors.surface} /><Text style={styles.primaryLabel}>{!quiz.questions.length ? "Questions à venir" : saving ? "Préparation…" : "Commencer le quiz"}</Text></Pressable>
    </> : localSubmissionPending ? <Text style={styles.notice}>{syncNotice ?? "Soumission locale en attente de synchronisation."}</Text> : <View style={styles.quizFlow}>
      {attempt.durationMinutes ? <View style={[styles.timer, remaining === 0 && styles.timerExpired]}><MaterialIcons name="timer" size={18} color={remaining === 0 ? colors.error : colors.primary} /><Text style={[styles.timerLabel, remaining === 0 && { color: colors.error }]}>Temps restant {formatQuizDuration(remaining)}</Text></View> : null}
      <View style={styles.progress}><Text style={styles.progressLabel}>Question {questionIndex + 1} sur {quiz.questions.length}</Text><Text style={styles.progressCount}>{answeredCount} réponse{answeredCount > 1 ? "s" : ""}</Text></View>
      {question ? <QuizQuestionCard question={question} answer={answers[question.id] ?? []} onChange={(value) => setAnswers((current) => ({ ...current, [question.id]: value }))} /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {confirming ? <View style={styles.confirmation}><Text style={styles.confirmationTitle}>Soumettre le quiz ?</Text><Text style={styles.confirmationText}>Vos réponses seront corrigées après confirmation.</Text><View style={styles.confirmationActions}><Pressable accessibilityRole="button" disabled={saving} onPress={() => setConfirming(false)} style={({ pressed }) => [styles.confirmCancel, saving && styles.disabled, pressed && !saving && styles.pressed]}><Text style={styles.confirmCancelLabel}>Continuer</Text></Pressable><Pressable accessibilityRole="button" disabled={saving} onPress={() => void submit()} style={({ pressed }) => [styles.confirmSubmit, saving && styles.disabled, pressed && !saving && styles.pressed]}><Text style={styles.primaryLabel}>{saving ? "Soumission…" : "Soumettre"}</Text></Pressable></View></View> : null}
      <View style={styles.navigation}><Pressable accessibilityRole="button" disabled={questionIndex === 0 || saving} onPress={() => setQuestionIndex((current) => Math.max(0, current - 1))} style={({ pressed }) => [styles.secondary, (questionIndex === 0 || saving) && styles.disabled, pressed && questionIndex > 0 && styles.pressed]}><MaterialIcons name="chevron-left" size={20} color={colors.primary} /><Text style={styles.secondaryLabel}>Précédent</Text></Pressable>{done ? <Pressable accessibilityRole="button" disabled={saving || confirming} onPress={() => setConfirming(true)} style={({ pressed }) => [styles.primary, styles.submit, (saving || confirming) && styles.disabled, pressed && !saving && !confirming && styles.pressed]}><Text style={styles.primaryLabel}>Soumettre</Text></Pressable> : <Pressable accessibilityRole="button" disabled={saving} onPress={() => setQuestionIndex((current) => Math.min(quiz.questions.length - 1, current + 1))} style={({ pressed }) => [styles.primary, styles.next, saving && styles.disabled, pressed && !saving && styles.pressed]}><Text style={styles.primaryLabel}>Suivant</Text><MaterialIcons name="chevron-right" size={20} color={colors.surface} /></Pressable>}</View>
    </View>}
  </View></ScrollView></AppScreen>;
}

function QuizQuestionCard({ question, answer, onChange }: { question: QuizQuestion; answer: string[]; onChange: (value: string[]) => void }) {
  const { colors } = useEduTheme(); const styles = useMemo(() => questionStyles(colors), [colors]); const choice = question.questionType === "single_choice" || question.questionType === "true_false"; const multiple = question.questionType === "multiple_choice";
  return <View style={styles.card}><Text style={styles.points}>{question.points} point{question.points > 1 ? "s" : ""}</Text><LessonMarkdown content={question.promptMarkdown} />{choice || multiple ? <View style={styles.options}>{question.options.map((option) => { const selected = answer.includes(option.id); return <Pressable key={option.id} accessibilityRole="button" onPress={() => onChange(multiple ? (selected ? answer.filter((item) => item !== option.id) : [...answer, option.id]) : [option.id])} style={({ pressed }) => [styles.option, selected && styles.optionSelected, pressed && styles.pressed]}><MaterialIcons name={multiple ? (selected ? "check-box" : "check-box-outline-blank") : (selected ? "radio-button-checked" : "radio-button-unchecked")} size={20} color={selected ? colors.primary : colors.muted} /><Text style={[styles.optionText, selected && styles.optionTextSelected]}>{option.answer}</Text></Pressable>; })}</View> : <TextInput value={answer[0] ?? ""} onChangeText={(value) => onChange([value])} placeholder="Saisissez votre réponse" placeholderTextColor={colors.muted} multiline style={styles.input} />}</View>;
}

const createStyles = (colors: ReturnType<typeof useEduTheme>["colors"]) => StyleSheet.create({ content: { paddingTop: 18, paddingBottom: 30 }, inner: { paddingHorizontal: 20 }, meta: { flexDirection: "row", gap: 7, flexWrap: "wrap", marginTop: 15 }, metaText: { color: colors.primary, backgroundColor: colors.primarySoft, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8, fontSize: 10, fontWeight: "900" }, presentation: { marginTop: 17, padding: 17, borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface }, description: { color: colors.text, lineHeight: 21, fontSize: 14 }, primary: { minHeight: 48, borderRadius: 14, backgroundColor: colors.primary, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingHorizontal: 14 }, primaryLabel: { color: colors.surface, fontSize: 14, fontWeight: "900" }, quizFlow: { gap: 14, marginTop: 20 }, timer: { minHeight: 42, alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 7, borderRadius: 12, paddingHorizontal: 12, backgroundColor: colors.primarySoft }, timerExpired: { backgroundColor: `${colors.error}1A` }, timerLabel: { color: colors.primary, fontSize: 13, fontWeight: "900" }, progress: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, progressLabel: { color: colors.text, fontSize: 14, fontWeight: "900" }, progressCount: { color: colors.muted, fontSize: 11, fontWeight: "700" }, confirmation: { gap: 7, padding: 14, borderRadius: 16, borderWidth: 1, borderColor: colors.primary, backgroundColor: colors.primarySoft }, confirmationTitle: { color: colors.text, fontSize: 14, fontWeight: "900" }, confirmationText: { color: colors.muted, fontSize: 12, lineHeight: 18, fontWeight: "700" }, confirmationActions: { flexDirection: "row", gap: 10, marginTop: 4 }, confirmCancel: { flex: 1, minHeight: 42, borderRadius: 12, borderWidth: 1, borderColor: colors.primary, alignItems: "center", justifyContent: "center" }, confirmCancelLabel: { color: colors.primary, fontSize: 12, fontWeight: "900" }, confirmSubmit: { flex: 1, minHeight: 42, borderRadius: 12, backgroundColor: colors.success, alignItems: "center", justifyContent: "center" }, navigation: { flexDirection: "row", gap: 10, marginTop: 2 }, secondary: { flex: 1, minHeight: 48, borderRadius: 14, borderWidth: 1, borderColor: colors.primary, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4 }, secondaryLabel: { color: colors.primary, fontSize: 13, fontWeight: "900" }, next: { flex: 1 }, submit: { flex: 1, backgroundColor: colors.success }, error: { color: colors.error, fontSize: 12, lineHeight: 18, marginTop: 14, fontWeight: "700" }, notice: { color: colors.primary, backgroundColor: colors.primarySoft, borderRadius: 12, padding: 12, fontSize: 12, lineHeight: 18, marginTop: 17, fontWeight: "800" }, disabled: { opacity: 0.55 }, pressed: { opacity: 0.72 } });
const questionStyles = (colors: ReturnType<typeof useEduTheme>["colors"]) => StyleSheet.create({ card: { gap: 14, padding: 16, borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface }, points: { alignSelf: "flex-start", color: colors.primary, backgroundColor: colors.primarySoft, borderRadius: 8, overflow: "hidden", paddingHorizontal: 7, paddingVertical: 4, fontSize: 10, fontWeight: "900" }, options: { gap: 9 }, option: { minHeight: 46, flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 12, borderRadius: 13, backgroundColor: colors.surfaceMuted }, optionSelected: { backgroundColor: colors.primarySoft, borderWidth: 1, borderColor: colors.primary }, optionText: { flex: 1, color: colors.text, fontSize: 14, lineHeight: 20, fontWeight: "700" }, optionTextSelected: { color: colors.primary, fontWeight: "900" }, input: { minHeight: 90, color: colors.text, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background, borderRadius: 13, paddingHorizontal: 12, paddingTop: 12, fontSize: 14, textAlignVertical: "top" }, pressed: { opacity: 0.72 } });
