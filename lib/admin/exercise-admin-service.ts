import { supabase } from "@/lib/supabase/client";
import { ExerciseDifficulty, ExerciseType } from "@/lib/exercises/exercise-model";
import { AdminChapter, AdminOfferingOption, AdminLesson, getAdminChapters, getAdminLessons, getAdminOfferingOptions } from "./course-admin-service";

export type AdminExercise = { id: string; subjectId: string; levelId: string; seriesId: string; chapterId: string; lessonId: string; title: string; statement: string; contentMarkdown: string | null; correctionMarkdown: string | null; exerciseType: ExerciseType; difficulty: ExerciseDifficulty | null; estimatedDurationMinutes: number | null; displayOrder: number; isPublished: boolean; isActive: boolean; isTestData: boolean; subjectName: string; chapterTitle: string; lessonTitle: string; questionCount: number; attemptCount: number; createdAt: string; updatedAt: string };
export type AdminExerciseQuestion = { id: string; exerciseId: string; questionType: ExerciseType; promptMarkdown: string; options: string[]; correctAnswers: string[]; explanationMarkdown: string | null; displayOrder: number };
export type AdminExerciseInput = { offering: AdminOfferingOption; chapter: AdminChapter; lesson: AdminLesson; title: string; statement: string; contentMarkdown: string; correctionMarkdown: string; exerciseType: ExerciseType; difficulty: ExerciseDifficulty | null; estimatedDurationMinutes: number | null; displayOrder: number; isPublished: boolean; isActive: boolean };
export type AdminExerciseQuestionInput = { questionType: ExerciseType; promptMarkdown: string; options: string[]; correctAnswers: string[]; explanationMarkdown: string; displayOrder: number };
type Relation<T> = T | T[] | null;
function one<T>(value: Relation<T>) { return Array.isArray(value) ? value[0] ?? null : value; }
function message(error: unknown) { return typeof error === "object" && error && "message" in error && typeof error.message === "string" ? error.message : "Une erreur Supabase est survenue."; }
function strings(value: unknown) { return Array.isArray(value) ? value.map(String) : []; }
function numberOrNull(value: unknown) { return value === null || value === undefined ? null : Number(value); }

function from(row: any): AdminExercise {
  const subject = one<{ name: string }>(row.subject); const chapter = one<{ title: string }>(row.chapter); const lesson = one<{ title: string }>(row.lesson); const questions = Array.isArray(row.exercise_questions) ? row.exercise_questions : []; const attempts = Array.isArray(row.exercise_attempts) ? row.exercise_attempts : [];
  return { id: row.id, subjectId: row.subject_id, levelId: row.level_id, seriesId: row.series_id, chapterId: row.chapter_id, lessonId: row.lesson_id, title: row.title, statement: row.statement ?? "", contentMarkdown: row.content_markdown ?? null, correctionMarkdown: row.correction_markdown ?? null, exerciseType: row.exercise_type, difficulty: row.difficulty ?? null, estimatedDurationMinutes: numberOrNull(row.estimated_duration_minutes), displayOrder: row.display_order ?? 0, isPublished: Boolean(row.is_published), isActive: Boolean(row.is_active), isTestData: Boolean(row.is_test_data), subjectName: subject?.name ?? "Matière", chapterTitle: chapter?.title ?? "Chapitre", lessonTitle: lesson?.title ?? "Leçon", questionCount: questions.length, attemptCount: attempts.length, createdAt: row.created_at, updatedAt: row.updated_at };
}

export async function getAdminExerciseTargets() { return getAdminOfferingOptions(); }
export async function getAdminExerciseChapters(offeringId: string) { return getAdminChapters(offeringId); }
export async function getAdminExerciseLessons(chapterId: string) { return getAdminLessons(chapterId); }

export async function getAdminExercises(): Promise<AdminExercise[]> {
  const { data, error } = await supabase.from("exercises").select("id,subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,content_markdown,correction_markdown,exercise_type,difficulty,estimated_duration_minutes,display_order,is_published,is_active,is_test_data,created_at,updated_at,subject:subjects(name),chapter:chapters(title),lesson:lessons(title),exercise_questions(id),exercise_attempts(id)").order("updated_at", { ascending: false });
  if (error) throw new Error(message(error)); return (data ?? []).map(from);
}

export async function getAdminExercise(exerciseId: string): Promise<AdminExercise | null> {
  const { data, error } = await supabase.from("exercises").select("id,subject_id,level_id,series_id,chapter_id,lesson_id,title,statement,content_markdown,correction_markdown,exercise_type,difficulty,estimated_duration_minutes,display_order,is_published,is_active,is_test_data,created_at,updated_at,subject:subjects(name),chapter:chapters(title),lesson:lessons(title),exercise_questions(id),exercise_attempts(id)").eq("id", exerciseId).maybeSingle();
  if (error) throw new Error(message(error)); return data ? from(data) : null;
}

export async function getAdminExerciseQuestions(exerciseId: string): Promise<AdminExerciseQuestion[]> {
  const { data, error } = await supabase.from("exercise_questions").select("id,exercise_id,question_type,prompt_markdown,options,correct_answers,explanation_markdown,display_order").eq("exercise_id", exerciseId).order("display_order", { ascending: true });
  if (error) throw new Error(message(error)); return (data ?? []).map((row: any) => ({ id: row.id, exerciseId: row.exercise_id, questionType: row.question_type, promptMarkdown: row.prompt_markdown, options: strings(row.options), correctAnswers: strings(row.correct_answers), explanationMarkdown: row.explanation_markdown ?? null, displayOrder: row.display_order ?? 0 }));
}

async function nextExerciseOrder(lessonId: string) { const { data, error } = await supabase.from("exercises").select("display_order").eq("lesson_id", lessonId).order("display_order", { ascending: false }).limit(1); if (error) throw new Error(message(error)); return (data?.[0]?.display_order ?? 0) + 10; }

export async function saveAdminExercise(input: AdminExerciseInput, exerciseId?: string): Promise<AdminExercise> {
  const title = input.title.trim(); const statement = input.statement.trim(); if (!title) throw new Error("Le titre de l’exercice est obligatoire."); if (!statement) throw new Error("La consigne est obligatoire.");
  const order = Number.isFinite(input.displayOrder) && input.displayOrder > 0 ? input.displayOrder : await nextExerciseOrder(input.lesson.id);
  const basePayload = { subject_id: input.offering.subjectId, level_id: input.offering.levelId, series_id: input.offering.seriesId, chapter_id: input.chapter.id, lesson_id: input.lesson.id, title, statement, content_markdown: input.contentMarkdown.trim() || null, correction_markdown: input.correctionMarkdown.trim() || null, solution: input.correctionMarkdown.trim() || null, exercise_type: input.exerciseType, difficulty: input.difficulty, estimated_duration_minutes: input.estimatedDurationMinutes, display_order: order };
  const payload = exerciseId ? basePayload : { ...basePayload, is_published: false, is_active: false };
  const request = exerciseId ? supabase.from("exercises").update(payload).eq("id", exerciseId) : supabase.from("exercises").insert(payload);
  const { data, error } = await request.select("id").single(); if (error) throw new Error(message(error)); const exercise = await getAdminExercise(data.id); if (!exercise) throw new Error("L’exercice enregistré est introuvable."); return exercise;
}

export async function setAdminExerciseAvailability(exercise: AdminExercise, values: { isPublished: boolean; isActive: boolean }) {
  if (values.isPublished && exercise.questionCount === 0) throw new Error("Ajoutez au moins une question avant de publier cet exercice.");
  const { error } = await supabase.from("exercises").update({ is_published: values.isPublished, is_active: values.isActive }).eq("id", exercise.id); if (error) throw new Error(message(error));
}

function validateQuestion(input: AdminExerciseQuestionInput) { const prompt = input.promptMarkdown.trim(); if (!prompt) throw new Error("L’énoncé de la question est obligatoire."); const automatic = input.questionType === "single_choice" || input.questionType === "multiple_choice" || input.questionType === "true_false"; if (automatic && (!input.options.length || !input.correctAnswers.length)) throw new Error("Les options et au moins une réponse correcte sont obligatoires pour ce type de question."); if (input.correctAnswers.some((answer) => automatic && !input.options.includes(answer))) throw new Error("Chaque réponse correcte doit correspondre à une option proposée."); }
async function nextQuestionOrder(exerciseId: string) { const { data, error } = await supabase.from("exercise_questions").select("display_order").eq("exercise_id", exerciseId).order("display_order", { ascending: false }).limit(1); if (error) throw new Error(message(error)); return (data?.[0]?.display_order ?? 0) + 10; }
export async function saveAdminExerciseQuestion(exerciseId: string, input: AdminExerciseQuestionInput, questionId?: string) {
  validateQuestion(input); const order = Number.isFinite(input.displayOrder) && input.displayOrder > 0 ? input.displayOrder : await nextQuestionOrder(exerciseId); const payload = { exercise_id: exerciseId, question_type: input.questionType, prompt_markdown: input.promptMarkdown.trim(), options: input.options, correct_answers: input.correctAnswers, explanation_markdown: input.explanationMarkdown.trim() || null, display_order: order }; const request = questionId ? supabase.from("exercise_questions").update(payload).eq("id", questionId) : supabase.from("exercise_questions").insert(payload); const { error } = await request; if (error) throw new Error(message(error));
}
export async function deleteAdminExerciseQuestion(questionId: string) { const { error } = await supabase.from("exercise_questions").delete().eq("id", questionId); if (error) throw new Error(message(error)); }
export async function deleteAdminExercise(exercise: AdminExercise) { if (exercise.isTestData) throw new Error("Un exercice de test protégé ne peut pas être supprimé."); if (exercise.attemptCount > 0) throw new Error("Cet exercice possède des tentatives. Désactivez-le plutôt que de le supprimer."); const { error } = await supabase.from("exercises").delete().eq("id", exercise.id); if (error) throw new Error(message(error)); }
