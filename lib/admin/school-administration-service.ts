import { supabase } from "@/lib/supabase/client";

export type SchoolYear = {
  id: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  status: "draft" | "active" | "closed" | "archived";
  created_at: string;
  updated_at: string;
};

export async function fetchSchoolYears(): Promise<SchoolYear[]> {
  const { data, error } = await supabase
    .from("edutech_school_years")
    .select("id,name,starts_on,ends_on,status,created_at,updated_at")
    .order("starts_on", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    start_date: row.starts_on ?? null,
    end_date: row.ends_on ?? null,
    is_active: row.status === "active",
    status: row.status as SchoolYear["status"],
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));
}

async function callYearAction(functionName: "admin_activate_school_year" | "admin_close_school_year" | "admin_archive_school_year", schoolYearId: string) {
  const { error } = await supabase.rpc(functionName, { p_school_year_id: schoolYearId });
  if (error) throw new Error(error.message);
}

export async function createSchoolYear(name: string, startsOn: string | null, endsOn: string | null, notes: string | null) {
  const { error } = await supabase.rpc("admin_create_school_year", { p_name: name.trim(), p_starts_on: startsOn || null, p_ends_on: endsOn || null, p_notes: notes?.trim() || null });
  if (error) throw new Error(error.message);
}

export async function activateSchoolYear(schoolYearId: string) { await callYearAction("admin_activate_school_year", schoolYearId); }
export async function closeSchoolYear(schoolYearId: string) { await callYearAction("admin_close_school_year", schoolYearId); }
export async function archiveSchoolYear(schoolYearId: string) { await callYearAction("admin_archive_school_year", schoolYearId); }
