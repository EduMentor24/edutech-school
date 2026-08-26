import {
  MentorRequestError,
  type MentorInput,
  pedagogicalInstruction,
} from "./mentor-contract";
import { WorkersAiProvider, type MentorAiMessage } from "./ai-provider";
import type { Env, StudentProfile } from "./types";

function authorizationToken(request: Request) {
  const authorization = request.headers.get("authorization");
  return authorization?.startsWith("Bearer ") ? authorization.slice("Bearer ".length).trim() : null;
}

function supabaseHeaders(token: string, env: Env) {
  return {
    apikey: env.SUPABASE_PUBLISHABLE_KEY,
    Authorization: `Bearer ${token}`,
  };
}

export async function authenticateSupabase(request: Request, env: Env): Promise<StudentProfile> {
  const token = authorizationToken(request);
  if (!token || !env.SUPABASE_URL || !env.SUPABASE_PUBLISHABLE_KEY) {
    throw new MentorRequestError(401, "AUTH_REQUIRED", "Authentification requise.");
  }
  const headers = supabaseHeaders(token, env);
  const userResponse = await fetch(`${env.SUPABASE_URL.replace(/\/+$/, "")}/auth/v1/user`, { headers });
  if (!userResponse.ok) throw new MentorRequestError(401, "AUTH_REQUIRED", "Authentification requise.");
  const user = await userResponse.json() as { id?: string };
  if (!user.id) throw new MentorRequestError(401, "AUTH_REQUIRED", "Authentification requise.");

  const profileUrl = new URL(`${env.SUPABASE_URL.replace(/\/+$/, "")}/rest/v1/profiles`);
  profileUrl.searchParams.set("select", "id,role,school_level,series");
  profileUrl.searchParams.set("id", `eq.${user.id}`);
  const profileResponse = await fetch(profileUrl, { headers });
  if (!profileResponse.ok) throw new MentorRequestError(403, "PROFILE_UNAVAILABLE", "Profil indisponible.");
  const profiles = await profileResponse.json() as StudentProfile[];
  const profile = profiles[0];
  if (!profile || (profile.role !== "student" && profile.role !== "admin")) {
    throw new MentorRequestError(403, "PROFILE_UNAVAILABLE", "Profil indisponible.");
  }
  return profile;
}

function messagesFor(input: MentorInput, profile: StudentProfile): MentorAiMessage[] {
  return [
    { role: "system", content: pedagogicalInstruction(profile, input) },
    ...(input.conversation ?? []).slice(-8).map((item) => ({ role: item.role, content: item.content })),
    { role: "user", content: input.message },
  ];
}

export async function answerMentor(input: MentorInput, profile: StudentProfile, env: Env) {
  try {
    const provider = new WorkersAiProvider(env.AI);
    const answer = await provider.answer(messagesFor(input, profile));
    if (!answer) throw new MentorRequestError(503, "UNAVAILABLE", "Le Mentor IA a retourné une réponse vide.");
    return { answer, model: "@cf/meta/llama-3.2-3b-instruct" };
  } catch (error) {
    if (error instanceof MentorRequestError) throw error;
    const text = error instanceof Error ? error.message : "";
    if (/429|quota|rate limit/i.test(text)) {
      throw new MentorRequestError(429, "QUOTA", "Le quota gratuit du Mentor est atteint. Veuillez réessayer plus tard.");
    }
    throw new MentorRequestError(503, "UNAVAILABLE", "Le Mentor IA est temporairement indisponible. Veuillez réessayer plus tard.");
  }
}
