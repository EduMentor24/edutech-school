import { supabase } from "@/lib/supabase/client";

export type AdminSubject = { id: string; name: string; description: string | null; icon: string | null; isActive: boolean; displayOrder: number; isTestData: boolean; createdAt: string; updatedAt: string };
export type AdminTarget = { levelId: string; seriesId: string; levelName: string; seriesName: string; levelOrder: number; seriesOrder: number };
export type AdminOffering = { id: string; subjectId: string; levelId: string; seriesId: string; levelName: string; seriesName: string; isPublished: boolean; displayOrder: number; isTestData: boolean };
export type AdminSubjectInput = { name: string; description: string; icon: string; isActive: boolean; displayOrder: number };

type Relation<T> = T | T[] | null;
function one<T>(value: Relation<T>): T | null { return Array.isArray(value) ? value[0] ?? null : value; }
function message(error: unknown) { return typeof error === "object" && error && "message" in error && typeof error.message === "string" ? error.message : "Une erreur Supabase est survenue."; }
function subjectFrom(row: any): AdminSubject { return { id: row.id, name: row.name, description: row.description ?? null, icon: row.icon ?? null, isActive: row.is_active, displayOrder: row.display_order, isTestData: row.is_test_data, createdAt: row.created_at, updatedAt: row.updated_at }; }

export async function getAdminSubjects(): Promise<AdminSubject[]> {
  const { data, error } = await supabase.from("subjects").select("id,name,description,icon,is_active,display_order,is_test_data,created_at,updated_at").order("display_order", { ascending: true }).order("name", { ascending: true });
  if (error) throw new Error(message(error));
  return (data ?? []).map(subjectFrom);
}

export async function getAdminSubject(subjectId: string): Promise<AdminSubject | null> {
  const { data, error } = await supabase.from("subjects").select("id,name,description,icon,is_active,display_order,is_test_data,created_at,updated_at").eq("id", subjectId).maybeSingle();
  if (error) throw new Error(message(error));
  return data ? subjectFrom(data) : null;
}

export async function saveAdminSubject(input: AdminSubjectInput, subjectId?: string): Promise<AdminSubject> {
  const name = input.name.trim();
  if (!name) throw new Error("Le nom de la matière est obligatoire.");
  const payload = { name, description: input.description.trim() || null, icon: input.icon.trim() || null, is_active: input.isActive, display_order: Number.isFinite(input.displayOrder) ? Math.max(0, input.displayOrder) : 0 };
  const request = subjectId ? supabase.from("subjects").update(payload).eq("id", subjectId) : supabase.from("subjects").insert(payload);
  const { data, error } = await request.select("id,name,description,icon,is_active,display_order,is_test_data,created_at,updated_at").single();
  if (error) throw new Error(message(error));
  return subjectFrom(data);
}

export async function getAdminTargets(): Promise<AdminTarget[]> {
  const { data, error } = await supabase.from("level_series").select("level_id,series_id,level:levels(name,display_order),series:series(name,display_order)");
  if (error) throw new Error(message(error));
  return (data ?? []).flatMap((row: any) => {
    const level = one<{ name: string; display_order: number }>(row.level); const series = one<{ name: string; display_order: number }>(row.series);
    return level && series ? [{ levelId: row.level_id, seriesId: row.series_id, levelName: level.name, seriesName: series.name, levelOrder: level.display_order, seriesOrder: series.display_order }] : [];
  }).sort((a, b) => a.levelOrder - b.levelOrder || a.seriesOrder - b.seriesOrder);
}

export async function getAdminOfferings(subjectId: string): Promise<AdminOffering[]> {
  const { data, error } = await supabase.from("course_subject_offerings").select("id,subject_id,level_id,series_id,is_published,display_order,is_test_data,level:levels(name),series:series(name)").eq("subject_id", subjectId).order("display_order", { ascending: true });
  if (error) throw new Error(message(error));
  return (data ?? []).flatMap((row: any) => {
    const level = one<{ name: string }>(row.level); const series = one<{ name: string }>(row.series);
    return level && series ? [{ id: row.id, subjectId: row.subject_id, levelId: row.level_id, seriesId: row.series_id, levelName: level.name, seriesName: series.name, isPublished: row.is_published, displayOrder: row.display_order, isTestData: row.is_test_data }] : [];
  });
}

async function nextOfferingOrder(levelId: string, seriesId: string): Promise<number> {
  const { data, error } = await supabase.from("course_subject_offerings").select("display_order").eq("level_id", levelId).eq("series_id", seriesId).order("display_order", { ascending: false }).limit(1);
  if (error) throw new Error(message(error));
  return ((data?.[0]?.display_order ?? 0) + 10);
}

export async function setOfferingPublication(subjectId: string, target: AdminTarget, isPublished: boolean): Promise<void> {
  const { data: existing, error: lookupError } = await supabase.from("course_subject_offerings").select("id").eq("subject_id", subjectId).eq("level_id", target.levelId).eq("series_id", target.seriesId).maybeSingle();
  if (lookupError) throw new Error(message(lookupError));
  if (existing) {
    const { error } = await supabase.from("course_subject_offerings").update({ is_published: isPublished }).eq("id", existing.id);
    if (error) throw new Error(message(error));
    return;
  }
  if (!isPublished) return;
  const { error } = await supabase.from("course_subject_offerings").insert({ subject_id: subjectId, level_id: target.levelId, series_id: target.seriesId, is_published: true, display_order: await nextOfferingOrder(target.levelId, target.seriesId) });
  if (error) throw new Error(message(error));
}

export async function getSubjectDependencySummary(subjectId: string): Promise<{ offerings: number; chapters: number }> {
  const { data: offerings, error: offeringError } = await supabase.from("course_subject_offerings").select("id").eq("subject_id", subjectId);
  if (offeringError) throw new Error(message(offeringError));
  const offeringIds = (offerings ?? []).map((item) => item.id);
  if (!offeringIds.length) return { offerings: 0, chapters: 0 };
  const { count, error } = await supabase.from("chapters").select("id", { count: "exact", head: true }).in("subject_offering_id", offeringIds);
  if (error) throw new Error(message(error));
  return { offerings: offeringIds.length, chapters: count ?? 0 };
}

export async function deleteAdminSubject(subject: AdminSubject): Promise<void> {
  if (subject.isTestData) throw new Error("La matière de test est protégée et ne peut pas être supprimée depuis l’administration.");
  const dependencies = await getSubjectDependencySummary(subject.id);
  if (dependencies.offerings || dependencies.chapters) throw new Error("Cette matière possède encore des associations ou des chapitres. Désactivez-la plutôt que de la supprimer.");
  const { error } = await supabase.from("subjects").delete().eq("id", subject.id);
  if (error) throw new Error(message(error));
}

export type AdminOfferingOption = AdminOffering & { subjectName: string; subjectActive: boolean; label: string };
export type AdminChapter = { id: string; subjectOfferingId: string; subjectId: string; title: string; description: string | null; displayOrder: number; isActive: boolean; isTestData: boolean; createdAt: string; updatedAt: string };
export type AdminLesson = { id: string; chapterId: string; title: string; description: string | null; content: string | null; displayOrder: number; isActive: boolean; isTestData: boolean; createdAt: string; updatedAt: string };
export type AdminChapterInput = { offering: AdminOfferingOption; title: string; description: string; displayOrder: number; isActive: boolean };
export type AdminLessonInput = { chapterId: string; title: string; description: string; content: string; displayOrder: number; isActive: boolean };

export async function getAdminOfferingOptions(): Promise<AdminOfferingOption[]> {
  const { data, error } = await supabase.from("course_subject_offerings").select("id,subject_id,level_id,series_id,is_published,display_order,is_test_data,level:levels(name),series:series(name),subject:subjects(name,is_active)").order("display_order", { ascending: true });
  if (error) throw new Error(message(error));
  return (data ?? []).flatMap((row: any) => {
    const level = one<{ name: string }>(row.level); const series = one<{ name: string }>(row.series); const subject = one<{ name: string; is_active: boolean }>(row.subject);
    return level && series && subject ? [{ id: row.id, subjectId: row.subject_id, levelId: row.level_id, seriesId: row.series_id, levelName: level.name, seriesName: series.name, isPublished: row.is_published, displayOrder: row.display_order, isTestData: row.is_test_data, subjectName: subject.name, subjectActive: subject.is_active, label: `${level.name} ${series.name} · ${subject.name}` }] : [];
  }).sort((a, b) => a.levelName.localeCompare(b.levelName) || a.seriesName.localeCompare(b.seriesName) || a.displayOrder - b.displayOrder || a.subjectName.localeCompare(b.subjectName));
}

function chapterFrom(row: any): AdminChapter { return { id: row.id, subjectOfferingId: row.subject_offering_id, subjectId: row.subject_id, title: row.title, description: row.description ?? null, displayOrder: row.display_order, isActive: row.is_active, isTestData: row.is_test_data, createdAt: row.created_at, updatedAt: row.updated_at }; }
function lessonFrom(row: any): AdminLesson { return { id: row.id, chapterId: row.chapter_id, title: row.title, description: row.description ?? null, content: row.content ?? null, displayOrder: row.display_order, isActive: row.is_active, isTestData: row.is_test_data, createdAt: row.created_at, updatedAt: row.updated_at }; }

export async function getAdminChapters(offeringId: string): Promise<AdminChapter[]> {
  const { data, error } = await supabase.from("chapters").select("id,subject_offering_id,subject_id,title,description,display_order,is_active,is_test_data,created_at,updated_at").eq("subject_offering_id", offeringId).order("display_order", { ascending: true });
  if (error) throw new Error(message(error));
  return (data ?? []).map(chapterFrom);
}

export async function getAdminChapter(chapterId: string): Promise<AdminChapter | null> {
  const { data, error } = await supabase.from("chapters").select("id,subject_offering_id,subject_id,title,description,display_order,is_active,is_test_data,created_at,updated_at").eq("id", chapterId).maybeSingle();
  if (error) throw new Error(message(error));
  return data ? chapterFrom(data) : null;
}

async function nextChapterOrder(offeringId: string): Promise<number> {
  const { data, error } = await supabase.from("chapters").select("display_order").eq("subject_offering_id", offeringId).order("display_order", { ascending: false }).limit(1);
  if (error) throw new Error(message(error));
  return (data?.[0]?.display_order ?? 0) + 10;
}

export async function saveAdminChapter(input: AdminChapterInput, chapterId?: string): Promise<AdminChapter> {
  const title = input.title.trim(); if (!title) throw new Error("Le titre du chapitre est obligatoire.");
  const order = Number.isFinite(input.displayOrder) && input.displayOrder > 0 ? input.displayOrder : await nextChapterOrder(input.offering.id);
  const payload = { subject_offering_id: input.offering.id, subject_id: input.offering.subjectId, level_id: input.offering.levelId, series_id: input.offering.seriesId, title, description: input.description.trim() || null, display_order: order, is_active: input.isActive };
  const request = chapterId ? supabase.from("chapters").update(payload).eq("id", chapterId) : supabase.from("chapters").insert(payload);
  const { data, error } = await request.select("id,subject_offering_id,subject_id,title,description,display_order,is_active,is_test_data,created_at,updated_at").single();
  if (error) throw new Error(message(error));
  return chapterFrom(data);
}

export async function getChapterDependencySummary(chapterId: string): Promise<{ lessons: number }> {
  const { count, error } = await supabase.from("lessons").select("id", { count: "exact", head: true }).eq("chapter_id", chapterId);
  if (error) throw new Error(message(error));
  return { lessons: count ?? 0 };
}

export async function deleteAdminChapter(chapter: AdminChapter): Promise<void> {
  if (chapter.isTestData) throw new Error("Le chapitre de test est protégé et ne peut pas être supprimé depuis l’administration.");
  const { lessons } = await getChapterDependencySummary(chapter.id);
  if (lessons) throw new Error("Ce chapitre contient des leçons. Désactivez-le plutôt que de le supprimer.");
  const { error } = await supabase.from("chapters").delete().eq("id", chapter.id);
  if (error) throw new Error(message(error));
}

export async function getAdminLessons(chapterId: string): Promise<AdminLesson[]> {
  const { data, error } = await supabase.from("lessons").select("id,chapter_id,title,description,content,display_order,is_active,is_test_data,created_at,updated_at").eq("chapter_id", chapterId).order("display_order", { ascending: true });
  if (error) throw new Error(message(error));
  return (data ?? []).map(lessonFrom);
}

export async function getAdminLesson(lessonId: string): Promise<AdminLesson | null> {
  const { data, error } = await supabase.from("lessons").select("id,chapter_id,title,description,content,display_order,is_active,is_test_data,created_at,updated_at").eq("id", lessonId).maybeSingle();
  if (error) throw new Error(message(error));
  return data ? lessonFrom(data) : null;
}

async function nextLessonOrder(chapterId: string): Promise<number> {
  const { data, error } = await supabase.from("lessons").select("display_order").eq("chapter_id", chapterId).order("display_order", { ascending: false }).limit(1);
  if (error) throw new Error(message(error));
  return (data?.[0]?.display_order ?? 0) + 10;
}

export async function saveAdminLesson(input: AdminLessonInput, lessonId?: string): Promise<AdminLesson> {
  const title = input.title.trim(); if (!title) throw new Error("Le titre de la leçon est obligatoire.");
  const order = Number.isFinite(input.displayOrder) && input.displayOrder > 0 ? input.displayOrder : await nextLessonOrder(input.chapterId);
  const payload = { chapter_id: input.chapterId, title, description: input.description.trim() || null, content: input.content, display_order: order, is_active: input.isActive };
  const request = lessonId ? supabase.from("lessons").update(payload).eq("id", lessonId) : supabase.from("lessons").insert(payload);
  const { data, error } = await request.select("id,chapter_id,title,description,content,display_order,is_active,is_test_data,created_at,updated_at").single();
  if (error) throw new Error(message(error));
  return lessonFrom(data);
}

export async function deleteAdminLesson(lesson: AdminLesson): Promise<void> {
  if (lesson.isTestData) throw new Error("La leçon de test est protégée et ne peut pas être supprimée depuis l’administration.");
  const { error } = await supabase.from("lessons").delete().eq("id", lesson.id);
  if (error) throw new Error(message(error));
}
