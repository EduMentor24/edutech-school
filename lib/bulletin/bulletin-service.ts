import { StudentProfile } from "@/lib/auth/supabase-auth-provider";
import { supabase } from "@/lib/supabase/client";
import { AssessmentType, BulletinTerm, calculateSubjectAverage, calculateTermAverage } from "./bulletin-model";

export type BulletinSubject = { offeringId: string; subjectId: string; subjectName: string; average: number | null; noteCount: number; coefficient: number | null; coefficientVerified: boolean; coefficientSource: string | null };
export type BulletinGrade = { id: string; offeringId: string; subjectName: string; schoolYear: string; term: BulletinTerm; assessmentType: AssessmentType; grade: number; maxGrade: number; assessmentDate: string; comment: string | null; includeInAverage: boolean; normalizedGrade: number };
export type BulletinSummary = { schoolYear: string; term: BulletinTerm; subjects: BulletinSubject[]; termAverage: number | null; includedSubjectCount: number; excludedUnverifiedCoefficientCount: number };
export type BulletinGradeInput = { offeringId: string; subjectName: string; schoolYear: string; term: BulletinTerm; assessmentType: AssessmentType; grade: number; maxGrade: number; assessmentDate: string; comment: string };

const errorMessage = (error: unknown) => typeof error === "object" && error && "message" in error && typeof error.message === "string" ? error.message : "Une erreur de données est survenue.";
const one = <T,>(value: T | T[] | null) => Array.isArray(value) ? value[0] ?? null : value;

async function getCurrentStudentId() { const { data, error } = await supabase.auth.getUser(); if (error) throw new Error(error.message); if (!data.user) throw new Error("Vous devez être connecté pour consulter votre Bulletin."); return data.user.id; }

async function getProfileOfferings(profile: StudentProfile) {
  if (!profile.school_level || !profile.series) return [] as Array<{ id: string; subjectId: string; subjectName: string }>;
  const [{ data: level, error: levelError }, { data: series, error: seriesError }] = await Promise.all([supabase.from("levels").select("id").eq("name", profile.school_level).maybeSingle(), supabase.from("series").select("id").eq("name", profile.series).maybeSingle()]);
  if (levelError) throw new Error(errorMessage(levelError)); if (seriesError) throw new Error(errorMessage(seriesError)); if (!level || !series) return [];
  const { data, error } = await supabase.from("course_subject_offerings").select("id,subject:subjects!inner(id,name,is_active)").eq("level_id", level.id).eq("series_id", series.id).eq("subject.is_active", true).order("display_order", { ascending: true });
  if (error) throw new Error(errorMessage(error));
  return (data ?? []).flatMap((row: any) => { const subject = one<{ id: string; name: string }>(row.subject); return subject ? [{ id: String(row.id), subjectId: String(subject.id), subjectName: String(subject.name) }] : []; });
}

export async function getBulletinSummary(profile: StudentProfile, schoolYear: string, term: BulletinTerm): Promise<BulletinSummary> {
  const [studentId, offerings] = await Promise.all([getCurrentStudentId(), getProfileOfferings(profile)]);
  if (!offerings.length) return { schoolYear, term, subjects: [], termAverage: null, includedSubjectCount: 0, excludedUnverifiedCoefficientCount: 0 };
  const offeringIds = offerings.map((item) => item.id);
  const [{ data: grades, error: gradesError }, { data: coefficients, error: coefficientsError }] = await Promise.all([supabase.from("edutech_grades").select("id,subject_offering_id,grade,max_grade,include_in_average").eq("student_id", studentId).eq("school_year", schoolYear).eq("term", term).in("subject_offering_id", offeringIds), supabase.from("edutech_coefficients").select("subject_offering_id,coefficient,is_verified,source_name,source_document").eq("is_verified", true).in("subject_offering_id", offeringIds)]);
  if (gradesError) throw new Error(errorMessage(gradesError)); if (coefficientsError) throw new Error(errorMessage(coefficientsError));
  const coefficientByOffering = new Map((coefficients ?? []).map((row: any) => [row.subject_offering_id, row]));
  const subjects = offerings.map((offering) => { const ownGrades = (grades ?? []).filter((grade: any) => grade.subject_offering_id === offering.id).map((grade: any) => ({ grade: Number(grade.grade), maxGrade: Number(grade.max_grade), includeInAverage: Boolean(grade.include_in_average) })); const coefficient = coefficientByOffering.get(offering.id) as any; return { offeringId: offering.id, subjectId: offering.subjectId, subjectName: offering.subjectName, average: calculateSubjectAverage(ownGrades), noteCount: ownGrades.length, coefficient: coefficient ? Number(coefficient.coefficient) : null, coefficientVerified: Boolean(coefficient?.is_verified), coefficientSource: coefficient ? [coefficient.source_name, coefficient.source_document].filter(Boolean).join(" — ") : null }; });
  const total = calculateTermAverage(subjects.map((subject) => ({ average: subject.average, coefficient: subject.coefficient, coefficientVerified: subject.coefficientVerified })));
  return { schoolYear, term, subjects, termAverage: total.average, includedSubjectCount: total.includedSubjectCount, excludedUnverifiedCoefficientCount: total.excludedUnverifiedCoefficientCount };
}

export async function getBulletinSubjectGrades(profile: StudentProfile, offeringId: string, schoolYear: string, term: BulletinTerm): Promise<{ subjectName: string; grades: BulletinGrade[] }> {
  const [studentId, offerings] = await Promise.all([getCurrentStudentId(), getProfileOfferings(profile)]); const offering = offerings.find((item) => item.id === offeringId); if (!offering) throw new Error("Cette matière n’est pas associée à votre niveau et à votre série.");
  const { data, error } = await supabase.from("edutech_grades").select("id,subject_offering_id,school_year,term,assessment_type,grade,max_grade,assessment_date,comment,include_in_average").eq("student_id", studentId).eq("subject_offering_id", offeringId).eq("school_year", schoolYear).eq("term", term).order("assessment_date", { ascending: false });
  if (error) throw new Error(errorMessage(error));
  return { subjectName: offering.subjectName, grades: (data ?? []).map((row: any) => ({ id: String(row.id), offeringId: String(row.subject_offering_id), subjectName: offering.subjectName, schoolYear: String(row.school_year), term: row.term as BulletinTerm, assessmentType: row.assessment_type as AssessmentType, grade: Number(row.grade), maxGrade: Number(row.max_grade), assessmentDate: String(row.assessment_date), comment: row.comment ?? null, includeInAverage: Boolean(row.include_in_average), normalizedGrade: Math.round((Number(row.grade) / Number(row.max_grade)) * 2000) / 100 })) };
}

export async function getBulletinGrade(gradeId: string): Promise<BulletinGrade | null> { const studentId = await getCurrentStudentId(); const { data, error } = await supabase.from("edutech_grades").select("id,subject_offering_id,subject_label_legacy,school_year,term,assessment_type,grade,max_grade,assessment_date,comment,include_in_average").eq("id", gradeId).eq("student_id", studentId).maybeSingle(); if (error) throw new Error(errorMessage(error)); if (!data) return null; return { id: String(data.id), offeringId: String(data.subject_offering_id), subjectName: String(data.subject_label_legacy), schoolYear: String(data.school_year), term: data.term as BulletinTerm, assessmentType: data.assessment_type as AssessmentType, grade: Number(data.grade), maxGrade: Number(data.max_grade), assessmentDate: String(data.assessment_date), comment: data.comment ?? null, includeInAverage: Boolean(data.include_in_average), normalizedGrade: Math.round((Number(data.grade) / Number(data.max_grade)) * 2000) / 100 }; }

function validateInput(input: BulletinGradeInput) { if (!input.offeringId || !input.subjectName.trim()) throw new Error("La matière est obligatoire."); if (!(input.grade >= 0) || !(input.maxGrade > 0) || input.grade > input.maxGrade) throw new Error("La note doit être comprise entre zéro et le barème."); if (!input.assessmentDate) throw new Error("La date de l’évaluation est obligatoire."); }
export async function saveBulletinGrade(input: BulletinGradeInput, gradeId?: string) { validateInput(input); const studentId = await getCurrentStudentId(); const payload = { student_id: studentId, subject_offering_id: input.offeringId, subject_label_legacy: input.subjectName.trim(), school_year: input.schoolYear, term: input.term, assessment_type: input.assessmentType, grade: input.grade, max_grade: input.maxGrade, assessment_date: input.assessmentDate, comment: input.comment.trim() || null, include_in_average: true, created_by_student: true }; const request = gradeId ? supabase.from("edutech_grades").update(payload).eq("id", gradeId).eq("student_id", studentId) : supabase.from("edutech_grades").insert(payload); const { error } = await request; if (error) throw new Error(errorMessage(error)); }
export async function deleteBulletinGrade(gradeId: string) { const studentId = await getCurrentStudentId(); const { error } = await supabase.from("edutech_grades").delete().eq("id", gradeId).eq("student_id", studentId); if (error) throw new Error(errorMessage(error)); }
