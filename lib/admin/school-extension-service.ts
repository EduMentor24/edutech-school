import { supabase } from "@/lib/supabase/client";

export type TermSession = {
  id: string;
  school_year_id: string;
  term_number: number;
  title: string;
  start_date: string;
  end_date: string;
  is_open: boolean;
};

export type ArchivedReport = {
  id: string;
  student_id: string;
  school_year_id: string;
  school_level: string;
  series: string;
  lv2_choice: string | null;
  term1_average: number | null;
  term2_average: number | null;
  term3_average: number | null;
  annual_average: number | null;
  final_decision: "Admis" | "Redouble" | "En attente" | null;
  report_summary: string | null;
  archived_at: string;
};

export async function fetchTermSessions(schoolYearId: string): Promise<TermSession[]> {
  const { data, error } = await supabase
    .from("term_evaluation_sessions")
    .select("*")
    .eq("school_year_id", schoolYearId)
    .order("term_number", { ascending: true });
  if (error) throw new Error(error.message);
  return (data || []) as TermSession[];
}

export async function upsertTermSession(session: Omit<TermSession, "id"> & { id?: string }): Promise<void> {
  const { error } = await supabase.from("term_evaluation_sessions").upsert(session);
  if (error) throw new Error(error.message);
}

export async function fetchArchivedReports(schoolYearId?: string, studentId?: string): Promise<ArchivedReport[]> {
  let query = supabase.from("archived_annual_reports").select("*");
  if (schoolYearId) query = query.eq("school_year_id", schoolYearId);
  if (studentId) query = query.eq("student_id", studentId);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data || []) as ArchivedReport[];
}

export async function generateArchivedReport(studentId: string, schoolYearId: string, schoolLevel: string, series: string, lv2Choice: string | null, term1: number | null, term2: number | null, term3: number | null, decision: "Admis" | "Redouble" | "En attente"): Promise<void> {
  const annual = [term1, term2, term3].filter((v): v is number => v !== null);
  const annualAvg = annual.length > 0 ? Number((annual.reduce((a, b) => a + b, 0) / annual.length).toFixed(2)) : null;
  const summary = `Rapport de fin d'année - ${schoolLevel} ${series} | Moyenne annuelle: ${annualAvg ?? "N/A"} | Décision: ${decision}`;

  const { error } = await supabase.from("archived_annual_reports").upsert({
    student_id: studentId,
    school_year_id: schoolYearId,
    school_level: schoolLevel,
    series,
    lv2_choice: lv2Choice,
    term1_average: term1,
    term2_average: term2,
    term3_average: term3,
    annual_average: annualAvg,
    final_decision: decision,
    report_summary: summary,
    archived_at: new Date().toISOString()
  }, { onConflict: "student_id,school_year_id" });

  if (error) throw new Error(error.message);
}
