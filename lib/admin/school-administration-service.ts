import { supabase } from "@/lib/supabase/client";

export type SchoolYear = {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  status: "preparation" | "active" | "closed" | "archived";
  created_at: string;
  updated_at: string;
};

export async function fetchSchoolYears(): Promise<SchoolYear[]> {
  const { data, error } = await supabase
    .from("school_years")
    .select("*")
    .order("start_date", { ascending: false });
  if (error) {
    // Si la table n’existe pas encore ou erreur de lecture, retourner une année par défaut
    return [{
      id: "default-2026-2027",
      name: "2026-2027",
      start_date: "2026-09-01",
      end_date: "2027-06-30",
      is_active: true,
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }];
  }
  return (data || []) as SchoolYear[];
}
