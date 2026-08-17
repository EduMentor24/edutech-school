import { supabase } from "@/lib/supabase/client";

export type SchoolYearStatus = "draft" | "active" | "closed" | "archived";
export type PromotionDecision = "pending" | "admitted" | "repeat";
export type ClassChangeStatus = "pending" | "accepted" | "rejected" | "auto_approved";

export type SchoolYear = {
  id: string;
  name: string;
  startsOn: string | null;
  endsOn: string | null;
  status: SchoolYearStatus;
  createdAt: string;
  closedAt: string | null;
  archivedAt: string | null;
  notes: string | null;
};

export type AdminStudent = {
  id: string;
  fullName: string;
  email: string;
  role: "admin" | "student";
  schoolLevel: string | null;
  series: string | null;
  schoolYear: string | null;
  lv2Choice: "Allemand" | "Espagnol" | null;
  isActive: boolean;
  status: string;
  t1Average: number | null;
  t2Average: number | null;
  t3Average: number | null;
  annualAverage: number | null;
  promotionDecision: PromotionDecision | null;
};

export type SchoolHistory = {
  id: string;
  studentId: string;
  schoolYearId: string;
  schoolYear: string;
  schoolLevel: string;
  series: string;
  lv2Choice: "Allemand" | "Espagnol" | null;
  t1Average: number | null;
  t2Average: number | null;
  t3Average: number | null;
  annualAverage: number | null;
  promotionDecision: PromotionDecision;
  classChangeCount: number;
  recordStatus: "active" | "archived";
  createdAt: string;
};

export type ClassChangeRequest = {
  id: string;
  studentId: string;
  schoolYearId: string;
  schoolYear: string;
  oldSchoolLevel: string;
  oldSeries: string;
  newSchoolLevel: string;
  newSeries: string;
  reason: string | null;
  status: ClassChangeStatus;
  isAutomatic: boolean;
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
  createdAt: string;
  studentName: string | null;
  studentEmail: string | null;
};

export type AdministrativeLog = {
  id: string;
  actorId: string | null;
  action: string;
  resourceType: string;
  resourceId: string | null;
  payload: Record<string, unknown>;
  createdAt: string;
};

export type AdminStudentFilters = {
  search?: string;
  schoolYear?: string | null;
  schoolLevel?: string | null;
  series?: string | null;
  status?: string | null;
  role?: "admin" | "student" | null;
};

const failure = (error: unknown) =>
  typeof error === "object" && error && "message" in error && typeof error.message === "string"
    ? error.message
    : "Une erreur de données est survenue.";

const optionalNumber = (value: unknown) => value === null || value === undefined ? null : Number(value);

const toSchoolYear = (row: any): SchoolYear => ({
  id: String(row.id), name: String(row.name), startsOn: row.starts_on ?? null, endsOn: row.ends_on ?? null,
  status: row.status as SchoolYearStatus, createdAt: String(row.created_at), closedAt: row.closed_at ?? null,
  archivedAt: row.archived_at ?? null, notes: row.notes ?? null,
});

const toHistory = (row: any): SchoolHistory => ({
  id: String(row.id), studentId: String(row.student_id), schoolYearId: String(row.school_year_id), schoolYear: String(row.school_year),
  schoolLevel: String(row.school_level), series: String(row.series), lv2Choice: row.lv2_choice ?? null,
  t1Average: optionalNumber(row.t1_average), t2Average: optionalNumber(row.t2_average), t3Average: optionalNumber(row.t3_average),
  annualAverage: optionalNumber(row.annual_average), promotionDecision: row.promotion_decision as PromotionDecision,
  classChangeCount: Number(row.class_change_count ?? 0), recordStatus: row.record_status as "active" | "archived", createdAt: String(row.created_at),
});

export async function getSchoolYears(): Promise<SchoolYear[]> {
  const { data, error } = await supabase.from("edutech_school_years").select("id,name,starts_on,ends_on,status,created_at,closed_at,archived_at,notes").order("name", { ascending: false });
  if (error) throw new Error(failure(error));
  return (data ?? []).map(toSchoolYear);
}

export async function getActiveSchoolYear(): Promise<SchoolYear | null> {
  const { data, error } = await supabase.from("edutech_school_years").select("id,name,starts_on,ends_on,status,created_at,closed_at,archived_at,notes").eq("status", "active").maybeSingle();
  if (error) throw new Error(failure(error));
  return data ? toSchoolYear(data) : null;
}

export async function createSchoolYear(input: { name: string; startsOn?: string | null; endsOn?: string | null; notes?: string | null }) {
  const { data, error } = await supabase.rpc("admin_create_school_year", { p_name: input.name.trim(), p_starts_on: input.startsOn ?? null, p_ends_on: input.endsOn ?? null, p_notes: input.notes?.trim() || null });
  if (error) throw new Error(failure(error));
  return toSchoolYear(Array.isArray(data) ? data[0] : data);
}

export async function activateSchoolYear(id: string) {
  const { data, error } = await supabase.rpc("admin_activate_school_year", { p_school_year_id: id });
  if (error) throw new Error(failure(error));
  return toSchoolYear(Array.isArray(data) ? data[0] : data);
}

export async function closeSchoolYear(id: string) {
  const { data, error } = await supabase.rpc("admin_close_school_year", { p_school_year_id: id });
  if (error) throw new Error(failure(error));
  return toSchoolYear(Array.isArray(data) ? data[0] : data);
}

export async function archiveSchoolYear(id: string) {
  const { data, error } = await supabase.rpc("admin_archive_school_year", { p_school_year_id: id });
  if (error) throw new Error(failure(error));
  return toSchoolYear(Array.isArray(data) ? data[0] : data);
}

export async function getAdminStudents(filters: AdminStudentFilters = {}): Promise<AdminStudent[]> {
  const [{ data: profiles, error: profileError }, { data: histories, error: historyError }] = await Promise.all([
    supabase.from("profiles").select("id,full_name,email,role,school_level,series,school_year,lv2_choice,is_active,status").order("full_name", { ascending: true }),
    supabase.from("edutech_student_school_history").select("student_id,school_year,t1_average,t2_average,t3_average,annual_average,promotion_decision,created_at").order("created_at", { ascending: false }),
  ]);
  if (profileError) throw new Error(failure(profileError));
  if (historyError) throw new Error(failure(historyError));
  const latestHistoryByStudent = new Map<string, any>();
  for (const history of histories ?? []) if (!latestHistoryByStudent.has(String(history.student_id))) latestHistoryByStudent.set(String(history.student_id), history);
  const search = filters.search?.trim().toLocaleLowerCase("fr-FR") ?? "";
  return (profiles ?? []).map((row: any) => {
    const history = latestHistoryByStudent.get(String(row.id));
    return {
      id: String(row.id), fullName: String(row.full_name), email: String(row.email), role: row.role as "admin" | "student",
      schoolLevel: row.school_level ?? null, series: row.series ?? null, schoolYear: row.school_year ?? history?.school_year ?? null,
      lv2Choice: row.lv2_choice ?? null, isActive: Boolean(row.is_active), status: String(row.status ?? (row.is_active ? "active" : "inactive")),
      t1Average: optionalNumber(history?.t1_average), t2Average: optionalNumber(history?.t2_average), t3Average: optionalNumber(history?.t3_average), annualAverage: optionalNumber(history?.annual_average), promotionDecision: history?.promotion_decision ?? null,
    } as AdminStudent;
  }).filter((student) => {
    const haystack = `${student.fullName} ${student.email}`.toLocaleLowerCase("fr-FR");
    return (!search || haystack.includes(search)) &&
      (!filters.schoolYear || student.schoolYear === filters.schoolYear) &&
      (!filters.schoolLevel || student.schoolLevel === filters.schoolLevel) &&
      (!filters.series || student.series === filters.series) &&
      (!filters.status || student.status === filters.status) &&
      (!filters.role || student.role === filters.role);
  });
}

export async function getStudentSchoolHistory(studentId: string): Promise<SchoolHistory[]> {
  const { data, error } = await supabase.from("edutech_student_school_history").select("id,student_id,school_year_id,school_year,school_level,series,lv2_choice,t1_average,t2_average,t3_average,annual_average,promotion_decision,class_change_count,record_status,created_at").eq("student_id", studentId).order("school_year", { ascending: false });
  if (error) throw new Error(failure(error));
  return (data ?? []).map(toHistory);
}

export async function getMySchoolHistory() {
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError) throw new Error(failure(authError));
  if (!auth.user) throw new Error("Vous devez être connecté.");
  return getStudentSchoolHistory(auth.user.id);
}

export async function getClassChangeRequests(status?: ClassChangeStatus | "all"): Promise<ClassChangeRequest[]> {
  let request = supabase.from("edutech_class_change_requests").select("id,student_id,school_year_id,school_year,old_school_level,old_series,new_school_level,new_series,reason,status,is_automatic,reviewed_by,reviewed_at,review_note,created_at").order("created_at", { ascending: false });
  if (status && status !== "all") request = request.eq("status", status);
  const { data, error } = await request;
  if (error) throw new Error(failure(error));
  const studentIds = [...new Set((data ?? []).map((row: any) => String(row.student_id)))];
  const { data: profiles, error: profileError } = studentIds.length ? await supabase.from("profiles").select("id,full_name,email").in("id", studentIds) : { data: [], error: null };
  if (profileError) throw new Error(failure(profileError));
  const identityById = new Map((profiles ?? []).map((profile: any) => [String(profile.id), profile]));
  return (data ?? []).map((row: any) => ({
    id: String(row.id), studentId: String(row.student_id), schoolYearId: String(row.school_year_id), schoolYear: String(row.school_year), oldSchoolLevel: String(row.old_school_level), oldSeries: String(row.old_series), newSchoolLevel: String(row.new_school_level), newSeries: String(row.new_series), reason: row.reason ?? null, status: row.status as ClassChangeStatus, isAutomatic: Boolean(row.is_automatic), reviewedBy: row.reviewed_by ?? null, reviewedAt: row.reviewed_at ?? null, reviewNote: row.review_note ?? null, createdAt: String(row.created_at), studentName: identityById.get(String(row.student_id))?.full_name ?? null, studentEmail: identityById.get(String(row.student_id))?.email ?? null,
  }));
}

export async function requestMyClassChange(newSchoolLevel: string, newSeries: string, reason?: string) {
  const { data, error } = await supabase.rpc("student_change_school_class", { p_new_school_level: newSchoolLevel, p_new_series: newSeries, p_reason: reason?.trim() || null });
  if (error) throw new Error(failure(error));
  return String(data);
}

export async function reviewClassChangeRequest(requestId: string, accept: boolean, note?: string) {
  const { data, error } = await supabase.rpc("admin_review_class_change_request", { p_request_id: requestId, p_accept: accept, p_review_note: note?.trim() || null });
  if (error) throw new Error(failure(error));
  return data;
}

export async function setStudentAccountStatus(studentId: string, isActive: boolean) {
  const { data, error } = await supabase.rpc("admin_set_student_account_status", { p_student_id: studentId, p_is_active: isActive });
  if (error) throw new Error(failure(error));
  return data;
}

export async function recordPromotionDecision(input: { studentId: string; schoolYearId: string; decision: PromotionDecision; nextSchoolLevel?: string | null; nextSeries?: string | null }) {
  const { error } = await supabase.rpc("admin_record_promotion_decision", { p_student_id: input.studentId, p_school_year_id: input.schoolYearId, p_decision: input.decision, p_next_school_level: input.nextSchoolLevel ?? null, p_next_series: input.nextSeries ?? null });
  if (error) throw new Error(failure(error));
}

export async function getAdministrativeLogs(): Promise<AdministrativeLog[]> {
  const { data, error } = await supabase.from("edutech_activity_logs").select("id,actor_id,action,resource_type,resource_id,payload,created_at").order("created_at", { ascending: false }).limit(100);
  if (error) throw new Error(failure(error));
  return (data ?? []).map((row: any) => ({ id: String(row.id), actorId: row.actor_id ?? null, action: String(row.action), resourceType: String(row.resource_type), resourceId: row.resource_id ?? null, payload: row.payload ?? {}, createdAt: String(row.created_at) }));
}
