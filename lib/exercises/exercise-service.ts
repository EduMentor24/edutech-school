import { supabase } from "@/lib/supabase/client";
import { readPedagogicalLocalFirst, type PedagogicalCacheContext } from "@/lib/offline/pedagogical-cache";
import { beginLocalLearningAttempt, submitLocalLearningAttempt } from "@/lib/offline/learning-sync-store";
import { isInternetReachable } from "@/lib/offline/learning-sync-manager";
import { ExerciseAttemptStatus, ExerciseCatalogItem, ExerciseDifficulty, ExerciseType } from "./exercise-model";

export * from "./exercise-model";

export type ExerciseQuestion = { id: string; questionType: ExerciseType; promptMarkdown: string; options: string[]; displayOrder: number };
export type ExerciseDetail = { exerciseId: string; title: string; statement: string; contentMarkdown: string | null; exerciseType: ExerciseType; difficulty: ExerciseDifficulty | null; estimatedDurationMinutes: number | null; subjectName: string; chapterTitle: string; lessonTitle: string; questions: ExerciseQuestion[]; contentVersion: string | null };
export type ExerciseAttempt = { attemptId: string; exerciseId: string; status: ExerciseAttemptStatus; startedAt: string; score?: number | null; percentage?: number | null; totalQuestions?: number; correctAnswers?: number; incorrectAnswers?: number; submittedAt?: string | null; durationSeconds?: number | null; correctionMarkdown?: string | null };
export type ExerciseAttemptResult = ExerciseAttempt & { title: string; questions: Array<ExerciseQuestion & { answer: unknown; explanationMarkdown: string | null; isCorrect: boolean | null }> };
export type ExerciseHistoryItem = { attemptId: string; exerciseId: string; title: string; status: ExerciseAttemptStatus; percentage: number | null; startedAt: string; submittedAt: string | null; bestPercentage: number | null; attemptCount: number };

type RpcRow = Record<string, unknown>;
function message(error: unknown) { return typeof error === "object" && error && "message" in error && typeof error.message === "string" ? error.message : "Une erreur Supabase est survenue."; }
function numeric(value: unknown) { const parsed = Number(value); return Number.isFinite(parsed) ? parsed : 0; }
function nullableNumeric(value: unknown) { return value === null || value === undefined ? null : numeric(value); }
function one(data: unknown) { return Array.isArray(data) ? (data[0] as RpcRow | undefined) : (data as RpcRow | null); }
function asOptions(value: unknown) { return Array.isArray(value) ? value.map(String) : []; }
async function currentUserId() { const { data, error } = await supabase.auth.getSession(); if (error || !data.session?.user) throw new Error("Connexion requise pour enregistrer cette tentative."); return data.session.user.id; }

function catalogFrom(row: RpcRow): ExerciseCatalogItem {
  return { exerciseId: String(row.exercise_id), title: String(row.title), statement: String(row.statement ?? ""), exerciseType: row.exercise_type as ExerciseType, difficulty: (row.difficulty as ExerciseDifficulty | null) ?? null, estimatedDurationMinutes: nullableNumeric(row.estimated_duration_minutes), displayOrder: numeric(row.display_order), subjectId: String(row.subject_id), subjectName: String(row.subject_name), chapterId: String(row.chapter_id), chapterTitle: String(row.chapter_title), lessonId: String(row.lesson_id), lessonTitle: String(row.lesson_title), attemptCount: numeric(row.attempt_count), lastPercentage: nullableNumeric(row.last_percentage), bestPercentage: nullableNumeric(row.best_percentage), lastStatus: (row.last_status as ExerciseAttemptStatus | null) ?? null };
}

export type ExerciseCatalogFilters = { subjectId?: string | null; chapterId?: string | null; lessonId?: string | null; difficulty?: ExerciseDifficulty | null; cacheContext?: PedagogicalCacheContext | null };

export async function getExerciseCatalog(filters: ExerciseCatalogFilters = {}) {
  const resource = `exercises/catalog/${filterKey(filters.subjectId, filters.chapterId, filters.lessonId, filters.difficulty)}`;
  return readPedagogicalLocalFirst(filters.cacheContext, resource, async () => {
    const { data, error } = await supabase.rpc("get_my_exercise_catalog", { p_subject_id: filters.subjectId ?? null, p_chapter_id: filters.chapterId ?? null, p_lesson_id: filters.lessonId ?? null, p_difficulty: filters.difficulty ?? null });
    if (error) throw new Error(message(error));
    return (data ?? []).map((row: unknown) => catalogFrom(row as RpcRow));
  });
}

export async function getExerciseDetail(exerciseId: string, cacheContext?: PedagogicalCacheContext | null): Promise<ExerciseDetail | null> {
  return readPedagogicalLocalFirst(cacheContext, `exercise/${encodeURIComponent(exerciseId)}`, async () => {
    const { data, error } = await supabase.rpc("get_my_exercise_detail", { p_exercise_id: exerciseId });
    if (error) throw new Error(message(error)); const row = one(data); if (!row) return null;
    const rawQuestions = Array.isArray(row.questions) ? row.questions : [];
    const { data: version, error: versionError } = await supabase.rpc("get_my_exercise_content_version", { p_exercise_id: exerciseId });
    if (versionError) throw new Error(message(versionError));
    return { exerciseId: String(row.exercise_id), title: String(row.title), statement: String(row.statement ?? ""), contentMarkdown: (row.content_markdown as string | null) ?? null, exerciseType: row.exercise_type as ExerciseType, difficulty: (row.difficulty as ExerciseDifficulty | null) ?? null, estimatedDurationMinutes: nullableNumeric(row.estimated_duration_minutes), subjectName: String(row.subject_name), chapterTitle: String(row.chapter_title), lessonTitle: String(row.lesson_title), contentVersion: version ? String(version) : null, questions: rawQuestions.map((question: any) => ({ id: String(question.id), questionType: question.question_type as ExerciseType, promptMarkdown: String(question.prompt_markdown ?? ""), options: asOptions(question.options), displayOrder: numeric(question.display_order) })) };
  });
}

function attemptFrom(row: RpcRow): ExerciseAttempt { return { attemptId: String(row.attempt_id), exerciseId: String(row.exercise_id), status: row.status as ExerciseAttemptStatus, startedAt: String(row.started_at), score: nullableNumeric(row.score), percentage: nullableNumeric(row.percentage), totalQuestions: row.total_questions === undefined ? undefined : numeric(row.total_questions), correctAnswers: row.correct_answers === undefined ? undefined : numeric(row.correct_answers), incorrectAnswers: row.incorrect_answers === undefined ? undefined : numeric(row.incorrect_answers), submittedAt: (row.submitted_at as string | null) ?? null, durationSeconds: row.duration_seconds === undefined ? undefined : nullableNumeric(row.duration_seconds), correctionMarkdown: (row.correction_markdown as string | null) ?? null }; }

export async function startExerciseAttempt(exerciseId: string, contentVersion: string | null) { if (await isInternetReachable()) { const { data, error } = await supabase.rpc("start_exercise_attempt", { p_exercise_id: exerciseId }); if (error) throw new Error(message(error)); const row = one(data); if (!row) throw new Error("La tentative n’a pas pu être créée."); return attemptFrom(row); } const local = await beginLocalLearningAttempt(await currentUserId(), "exercise", exerciseId, contentVersion); return { attemptId: local.id, exerciseId, status: "in_progress" as const, startedAt: local.startedAt }; }
export async function submitExerciseAttempt(attemptId: string, answers: Record<string, unknown>) { if (attemptId.startsWith("local-")) { const local = await submitLocalLearningAttempt(await currentUserId(), attemptId, answers); return { attemptId: local.id, exerciseId: local.resourceId, status: "submitted" as const, startedAt: local.startedAt, submittedAt: local.submittedAt }; } const { data, error } = await supabase.rpc("submit_exercise_attempt", { p_attempt_id: attemptId, p_answers: answers }); if (error) throw new Error(message(error)); const row = one(data); if (!row) throw new Error("La tentative n’a pas pu être soumise."); return attemptFrom(row); }

export async function getExerciseAttemptResult(attemptId: string): Promise<ExerciseAttemptResult | null> { const { data, error } = await supabase.rpc("get_my_exercise_attempt_result", { p_attempt_id: attemptId }); if (error) throw new Error(message(error)); const row = one(data); if (!row) return null; const attempt = attemptFrom(row); const rawQuestions = Array.isArray(row.questions) ? row.questions : []; return { ...attempt, title: String(row.title), questions: rawQuestions.map((question: any) => ({ id: String(question.id), questionType: question.question_type as ExerciseType, promptMarkdown: String(question.prompt_markdown ?? ""), options: asOptions(question.options), displayOrder: numeric(question.display_order), answer: question.answer, explanationMarkdown: question.explanation_markdown ?? null, isCorrect: typeof question.is_correct === "boolean" ? question.is_correct : null })) }; }

export async function getMyExerciseHistory(): Promise<ExerciseHistoryItem[]> { const { data, error } = await supabase.rpc("get_my_exercise_history"); if (error) throw new Error(message(error)); return (data ?? []).map((row: any) => ({ attemptId: String(row.attempt_id), exerciseId: String(row.exercise_id), title: String(row.title), status: row.status as ExerciseAttemptStatus, percentage: nullableNumeric(row.percentage), startedAt: String(row.started_at), submittedAt: row.submitted_at ?? null, bestPercentage: nullableNumeric(row.best_percentage), attemptCount: numeric(row.attempt_count) })); }

function filterKey(...values: Array<string | null | undefined>) { return values.map((value) => encodeURIComponent(value ?? "all")).join("/"); }
