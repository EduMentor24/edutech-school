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
