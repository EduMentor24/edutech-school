import { getApiBaseUrl } from "@/constants/oauth";
import { supabase } from "@/lib/supabase/client";

export type MentorAttachment = { name: string; mimeType: string; base64: string; uri?: string; temporary?: boolean };
export type MentorConversationMessage = { role: "user" | "assistant"; content: string };

type MentorApiError = Error & { code?: string };

function apiUrl(path: string) {
  const base = getApiBaseUrl();
  return `${base}${path}`;
}

async function authorizationHeaders() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) {
    throw Object.assign(new Error("Votre session a expiré. Veuillez vous reconnecter."), { code: "AUTH_REQUIRED" }) as MentorApiError;
  }
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

async function request<T>(path: string, options?: { method?: "GET" | "POST"; body?: unknown }): Promise<T> {
  let response: Response;
  try {
    response = await fetch(apiUrl(path), {
      method: options?.method ?? "GET",
      headers: await authorizationHeaders(),
      body: options?.body === undefined ? undefined : JSON.stringify(options.body),
    });
  } catch {
    throw Object.assign(new Error("Le Mentor IA nécessite une connexion Internet pour répondre."), { code: "OFFLINE" }) as MentorApiError;
  }

  const payload = await response.json().catch(() => null) as { ok?: boolean; message?: string; code?: string; answer?: string; model?: string } | null;
  if (!response.ok || !payload?.ok) {
    throw Object.assign(new Error(payload?.message ?? "Le Mentor IA est temporairement indisponible. Veuillez réessayer plus tard."), { code: payload?.code }) as MentorApiError;
  }
  return payload as T;
}

export async function sendMentorMessage(input: {
  message: string;
  subject: string | null;
  chapter?: string | null;
  lesson?: string | null;
  conversation: MentorConversationMessage[];
  attachments: MentorAttachment[];
}) {
  return request<{ ok: true; answer: string; model: string }>("/api/mentor/message", { method: "POST", body: input });
}
