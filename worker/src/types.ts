export type WorkerAiBinding = {
  run(model: string, input: unknown): Promise<unknown>;
};

export interface Env {
  AI: WorkerAiBinding;
  SUPABASE_URL: string;
  SUPABASE_PUBLISHABLE_KEY: string;
  ALLOWED_ORIGINS?: string;
}

export type StudentProfile = {
  id: string;
  role: "admin" | "student";
  school_level: string | null;
  series: string | null;
};
