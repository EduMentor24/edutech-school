import { getApiBaseUrl } from "@/constants/oauth";
import { supabase } from "@/lib/supabase/client";

export type MentorAttachment = { name: string; mimeType: string; base64: string; uri?: string; temporary?: boolean };
export type MentorConversationMessage = { role: "user" | "assistant"; content: string };
export type MentorSettingsSummary = { configured: boolean; provider: string; model: string; keyMask: string | null; status: "unknown" | "valid" | "quota" | "invalid" | "unavailable"; lastCheckedAt: string | null };

type MentorApiError = Error & { code?: string };

function apiUrl(path: string) { const base = getApiBaseUrl(); return `${base}${path}`; }

async function authorizationHeaders() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw Object.assign(new Error("Votre session a expiré. Veuillez vous reconnecter."), { code: "AUTH_REQUIRED" }) as MentorApiError;
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

async function request<T>(path: string, options?: { method?: "GET" | "POST"; body?: unknown }): Promise<T> {
  let response: Response;
  try {
    response = await fetch(apiUrl(path), { method: options?.method ?? "GET", headers: await authorizationHeaders(), body: options?.body === undefined ? undefined : JSON.stringify(options.body) });
  } catch {
    throw Object.assign(new Error("Le Mentor IA nécessite une connexion Internet pour répondre."), { code: "OFFLINE" }) as MentorApiError;
  }
  const payload = await response.json().catch(() => null) as { ok?: boolean; message?: string; code?: string; answer?: string; settings?: MentorSettingsSummary; status?: string } | null;
  if (!response.ok || !payload?.ok) throw Object.assign(new Error(payload?.message ?? "Le Mentor IA est temporairement indisponible. Veuillez réessayer plus tard."), { code: payload?.code }) as MentorApiError;
  return payload as T;
}

export async function sendMentorMessage(input: { message: string; subject: string | null; conversation: MentorConversationMessage[]; attachments: MentorAttachment[] }) {
  return request<{ ok: true; answer: string; model: string }>("/api/mentor/message", { method: "POST", body: input });
}

export async function getMentorSettings() { const result = await request<{ ok: true; settings: MentorSettingsSummary }>("/api/mentor/admin/settings"); return result.settings; }
export async function saveMentorSettings(apiKey: string) { const result = await request<{ ok: true; settings: MentorSettingsSummary }>("/api/mentor/admin/save", { method: "POST", body: { apiKey, model: "gemini-2.5-flash-lite" } }); return result.settings; }
export async function testPendingMentorKey(apiKey: string) { return request<{ ok: true; status: "valid"; model: string; message: string }>("/api/mentor/admin/test", { method: "POST", body: { apiKey } }); }
export async function testActiveMentorKey() { return request<{ ok: true; status: "valid" | "quota" | "invalid" | "unavailable"; model: string; message: string }>("/api/mentor/admin/test-active", { method: "POST" }); }
