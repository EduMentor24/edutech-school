import { StudentProfile } from "@/lib/auth/supabase-auth-provider";
import { supabase } from "@/lib/supabase/client";

export type CourseSubject = { offeringId: string; subjectId: string; name: string; description: string | null };
export type CourseOffering = { id: string; subjectName: string; subjectDescription: string | null };
export type CourseChapter = { id: string; title: string; description: string | null; displayOrder: number };
export type CourseLesson = { id: string; chapterId: string; title: string; description: string | null; content: string | null; displayOrder: number };

function messageFrom(error: unknown) { if (typeof error === "object" && error && "message" in error && typeof error.message === "string") return error.message; return "Une erreur de données est survenue."; }
function schoolTarget(profile: StudentProfile) { if (!profile.school_level || !profile.series) return null; return { schoolLevel: profile.school_level, series: profile.series }; }

export async function getCoursesForProfile(profile: StudentProfile): Promise<CourseSubject[]> {
  const target = schoolTarget(profile); if (!target) return [];
  const { data: level, error: levelError } = await supabase.from("levels").select("id").eq("name", target.schoolLevel).maybeSingle();
  if (levelError) throw new Error(messageFrom(levelError)); if (!level) return [];
  const { data: series, error: seriesError } = await supabase.from("series").select("id").eq("name", target.series).maybeSingle();
  if (seriesError) throw new Error(messageFrom(seriesError)); if (!series) return [];
  const { data, error } = await supabase.from("course_subject_offerings").select("id, subject:subjects!inner(id,name,description,is_active)").eq("level_id", level.id).eq("series_id", series.id).eq("is_published", true).eq("subject.is_active", true).order("display_order", { ascending: true });
  if (error) throw new Error(messageFrom(error));
  return (data ?? []).flatMap((item) => { const subject = Array.isArray(item.subject) ? item.subject[0] : item.subject; return subject ? [{ offeringId: item.id, subjectId: subject.id, name: subject.name, description: subject.description }] : []; });
}

export async function getCourseOffering(offeringId: string): Promise<CourseOffering | null> {
  const { data, error } = await supabase.from("course_subject_offerings").select("id, subject:subjects(name,description)").eq("id", offeringId).maybeSingle();
  if (error) throw new Error(messageFrom(error)); if (!data) return null;
  const subject = Array.isArray(data.subject) ? data.subject[0] : data.subject;
  return subject ? { id: data.id, subjectName: subject.name, subjectDescription: subject.description } : null;
}

export async function getChaptersForOffering(offeringId: string): Promise<CourseChapter[]> {
  const { data, error } = await supabase.from("chapters").select("id,title,description,display_order").eq("subject_offering_id", offeringId).eq("is_active", true).order("display_order", { ascending: true });
  if (error) throw new Error(messageFrom(error)); return (data ?? []).map((chapter) => ({ id: chapter.id, title: chapter.title, description: chapter.description, displayOrder: chapter.display_order }));
}

export async function getChapter(chapterId: string): Promise<CourseChapter | null> {
  const { data, error } = await supabase.from("chapters").select("id,title,description,display_order").eq("id", chapterId).eq("is_active", true).maybeSingle();
  if (error) throw new Error(messageFrom(error)); return data ? { id: data.id, title: data.title, description: data.description, displayOrder: data.display_order } : null;
}

export async function getLessonsForChapter(chapterId: string): Promise<CourseLesson[]> {
  const { data, error } = await supabase.from("lessons").select("id,chapter_id,title,description,content,display_order").eq("chapter_id", chapterId).eq("is_active", true).order("display_order", { ascending: true });
  if (error) throw new Error(messageFrom(error)); return (data ?? []).map((lesson) => ({ id: lesson.id, chapterId: lesson.chapter_id, title: lesson.title, description: lesson.description, content: lesson.content, displayOrder: lesson.display_order }));
}

export async function getLesson(lessonId: string): Promise<CourseLesson | null> {
  const { data, error } = await supabase.from("lessons").select("id,chapter_id,title,description,content,display_order").eq("id", lessonId).eq("is_active", true).maybeSingle();
  if (error) throw new Error(messageFrom(error)); return data ? { id: data.id, chapterId: data.chapter_id, title: data.title, description: data.description, content: data.content, displayOrder: data.display_order } : null;
}
