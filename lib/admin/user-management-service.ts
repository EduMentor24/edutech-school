import { supabase } from "@/lib/supabase/client";

export type AdminUser = {
  id: string;
  fullName: string | null;
  email: string | null;
  schoolLevel: string | null;
  series: string | null;
  accountStatus: string | null;
  isActive: boolean;
  role: "admin" | "student";
  term1Average: number | null;
  term2Average: number | null;
  term3Average: number | null;
  annualAverage: number | null;
  totalCount: number;
};

export type StudentSchoolHistory = {
  id: string;
  schoolYearId: string;
  schoolYear: string;
  schoolLevel: string;
  series: string;
  term1Average: number | null;
  term2Average: number | null;
  term3Average: number | null;
  annualAverage: number | null;
  promotionDecision: string | null;
  recordStatus: string;
  createdAt: string;
  updatedAt: string;
};

const numberOrNull = (value: unknown) => value === null || value === undefined ? null : Number(value);
const message = (error: unknown) => error instanceof Error ? error.message : "Une erreur serveur est survenue.";

export async function fetchAdminUsers(search: string, page: number, pageSize = 20): Promise<{ users: AdminUser[]; total: number }> {
  const { data, error } = await supabase.rpc("admin_list_users", { p_search: search.trim() || null, p_page_size: pageSize, p_offset: page * pageSize });
  if (error) throw new Error(message(error));
  const rows = (data ?? []) as Array<Record<string, unknown>>;
  return {
    users: rows.map((row) => ({ id: String(row.id), fullName: row.full_name as string | null, email: row.email as string | null, schoolLevel: row.school_level as string | null, series: row.series as string | null, accountStatus: row.account_status as string | null, isActive: Boolean(row.is_active), role: row.role === "admin" ? "admin" : "student", term1Average: numberOrNull(row.term1_average), term2Average: numberOrNull(row.term2_average), term3Average: numberOrNull(row.term3_average), annualAverage: numberOrNull(row.annual_average), totalCount: Number(row.total_count ?? 0) })),
    total: Number(rows[0]?.total_count ?? 0),
  };
}

export async function setAdminUserStatus(userId: string, isActive: boolean) {
  const { error } = await supabase.rpc("admin_set_student_account_status", { p_student_id: userId, p_is_active: isActive });
  if (error) throw new Error(message(error));
}

export async function setAdminUserRole(userId: string, role: "admin" | "student") {
  const { error } = await supabase.rpc("admin_set_student_role", { p_student_id: userId, p_role: role });
  if (error) throw new Error(message(error));
}

export async function fetchStudentSchoolHistory(studentId: string): Promise<StudentSchoolHistory[]> {
  const { data, error } = await supabase.rpc("admin_get_student_school_history", { p_student_id: studentId });
  if (error) throw new Error(message(error));
  return ((data ?? []) as Array<Record<string, unknown>>).map((row) => ({ id: String(row.id), schoolYearId: String(row.school_year_id), schoolYear: String(row.school_year), schoolLevel: String(row.school_level), series: String(row.series), term1Average: numberOrNull(row.t1_average), term2Average: numberOrNull(row.t2_average), term3Average: numberOrNull(row.t3_average), annualAverage: numberOrNull(row.annual_average), promotionDecision: row.promotion_decision as string | null, recordStatus: String(row.record_status), createdAt: String(row.created_at), updatedAt: String(row.updated_at) }));
}

export async function recordPromotionDecision(studentId: string, schoolYearId: string, decision: "pending" | "admitted" | "repeat", nextSchoolLevel?: string | null, nextSeries?: string | null) {
  const { error } = await supabase.rpc("admin_record_promotion_decision", { p_student_id: studentId, p_school_year_id: schoolYearId, p_decision: decision, p_next_school_level: nextSchoolLevel ?? null, p_next_series: nextSeries ?? null });
  if (error) throw new Error(message(error));
}
