import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import type { Express, Request } from "express";
import { z } from "zod";
import { getMentorSettings, saveMentorSettings, updateMentorSettingsStatus } from "./mentor-db";
import { isSupportedMentorAttachment, mentorKeyMask, mentorStudentMessage } from "../lib/mentor/mentor-policy";

const GEMINI_MODEL = "gemini-2.5-flash-lite";
const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";
const MAX_ATTACHMENTS = 3;

type Profile = { id: string; role: "admin" | "student"; school_level: string | null; series: string | null };
type GeminiStatus = "valid" | "quota" | "invalid" | "unavailable";

const messageSchema = z.object({
  message: z.string().trim().min(1).max(6000),
  subject: z.string().trim().max(120).nullable().optional(),
  conversation: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().trim().min(1).max(6000) })).max(10).default([]),
  attachments: z.array(z.object({ mimeType: z.string(), base64: z.string().min(1), name: z.string().trim().max(160).optional() })).max(MAX_ATTACHMENTS).default([]),
});

const saveSchema = z.object({ model: z.literal(GEMINI_MODEL).default(GEMINI_MODEL), apiKey: z.string().trim().min(16).max(512) });
const testSchema = z.object({ apiKey: z.string().trim().min(16).max(512) });

function getServerKey(): Buffer {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Le chiffrement serveur n’est pas configuré.");
  return createHash("sha256").update(secret).digest();
}

function encryptApiKey(apiKey: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getServerKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(apiKey, "utf8"), cipher.final()]);
  return { apiKeyCiphertext: ciphertext.toString("base64"), encryptionIv: iv.toString("base64"), encryptionAuthTag: cipher.getAuthTag().toString("base64"), keySuffix: apiKey.slice(-4) };
}

function decryptApiKey(settings: NonNullable<Awaited<ReturnType<typeof getMentorSettings>>>) {
  const decipher = createDecipheriv("aes-256-gcm", getServerKey(), Buffer.from(settings.encryptionIv, "base64"));
  decipher.setAuthTag(Buffer.from(settings.encryptionAuthTag, "base64"));
  return Buffer.concat([decipher.update(Buffer.from(settings.apiKeyCiphertext, "base64")), decipher.final()]).toString("utf8");
}

function tokenFromRequest(req: Request) {
  const value = req.headers.authorization;
  return value?.startsWith("Bearer ") ? value.slice(7).trim() : null;
}

async function authenticateSupabase(req: Request): Promise<Profile> {
  const accessToken = tokenFromRequest(req);
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const apiKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!accessToken || !url || !apiKey) throw new MentorHttpError(401, "AUTH_REQUIRED", "Authentification requise.");
  const headers = { apikey: apiKey, Authorization: `Bearer ${accessToken}` };
  const authResponse = await fetch(`${url}/auth/v1/user`, { headers });
  if (!authResponse.ok) throw new MentorHttpError(401, "AUTH_REQUIRED", "Authentification requise.");
  const authUser = await authResponse.json() as { id?: string };
  if (!authUser.id) throw new MentorHttpError(401, "AUTH_REQUIRED", "Authentification requise.");
  const profileResponse = await fetch(`${url}/rest/v1/profiles?select=id,role,school_level,series&id=eq.${encodeURIComponent(authUser.id)}`, { headers });
  if (!profileResponse.ok) throw new MentorHttpError(403, "PROFILE_UNAVAILABLE", "Profil indisponible.");
  const profiles = await profileResponse.json() as Profile[];
  const profile = profiles[0];
  if (!profile) throw new MentorHttpError(403, "PROFILE_UNAVAILABLE", "Profil indisponible.");
  return profile;
}

class MentorHttpError extends Error {
  constructor(public readonly status: number, public readonly code: string, message: string) { super(message); }
}

function toGeminiStatus(status: number): GeminiStatus {
  if (status === 429) return "quota";
  if (status === 400 || status === 401 || status === 403) return "invalid";
  return "unavailable";
}


function pedagogicalInstruction(profile: Profile, subject?: string | null) {
  const level = profile.school_level ?? "niveau non renseigné";
  const series = profile.series ?? "série non renseignée";
  const subjectContext = subject ? `La matière choisie est : ${subject}.` : "Aucune matière précise n’est choisie.";
  return `Tu es le Mentor IA pédagogique d’EduTech School pour des élèves ivoiriens du secondaire. Le profil réel de l’élève est : niveau ${level}, série ${series}. ${subjectContext}
Réponds en français avec une structure claire et aérée. Explique progressivement, guide le raisonnement, vérifie la compréhension si utile et donne une solution expliquée si l’élève la demande. N’invente jamais un programme DPFC, une source, une citation, une donnée officielle ou une partie illisible d’une image. Si une image ou un document est flou, sombre, coupé ou illisible, indique précisément ce que tu ne peux pas lire et demande une capture plus nette. Le Mentor ne modifie jamais les notes, coefficients, quiz, exercices ou progression.`;
}

async function callGemini(input: { apiKey: string; model: string; profile: Profile; message: string; subject?: string | null; conversation: Array<{ role: "user" | "assistant"; content: string }>; attachments: Array<{ mimeType: string; base64: string }> }) {
  const parts: Array<Record<string, unknown>> = [{ text: input.message }];
  for (const attachment of input.attachments) {
    const byteLength = Buffer.byteLength(attachment.base64, "base64");
    if (!isSupportedMentorAttachment(attachment.mimeType, byteLength)) throw new MentorHttpError(400, "INVALID_ATTACHMENT", "Pièce jointe invalide.");
    parts.push({ inline_data: { mime_type: attachment.mimeType, data: attachment.base64 } });
  }
  const contents = [
    ...input.conversation.slice(-8).map((item) => ({ role: item.role === "assistant" ? "model" : "user", parts: [{ text: item.content }] })),
    { role: "user", parts },
  ];
  let response: Response;
  try {
    response = await fetch(`${GEMINI_API_BASE}/models/${encodeURIComponent(input.model)}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": input.apiKey },
      body: JSON.stringify({ system_instruction: { parts: [{ text: pedagogicalInstruction(input.profile, input.subject) }] }, contents, generationConfig: { temperature: 0.35, maxOutputTokens: 1800 } }),
    });
  } catch {
    throw new MentorHttpError(503, "UNAVAILABLE", "Service Gemini indisponible.");
  }
  if (!response.ok) {
    const status = toGeminiStatus(response.status);
    const code = status === "quota" ? "QUOTA" : status === "invalid" ? "INVALID" : "UNAVAILABLE";
    const message = code === "QUOTA" ? "Le quota Gemini est temporairement atteint." : code === "INVALID" ? "La clé Gemini est invalide ou non autorisée." : "Le service Gemini est temporairement indisponible.";
    throw new MentorHttpError(response.status, code, message);
  }
  const payload = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("\n").trim();
  if (!text) throw new MentorHttpError(503, "UNAVAILABLE", "Réponse Gemini vide.");
  return text;
}

function adminSettingsView(settings: Awaited<ReturnType<typeof getMentorSettings>>) {
  if (!settings) return { configured: false, provider: "Google Gemini", model: GEMINI_MODEL, keyMask: null, status: "unknown", lastCheckedAt: null };
  return { configured: true, provider: settings.provider, model: settings.model, keyMask: mentorKeyMask(settings.keySuffix), status: settings.status, lastCheckedAt: settings.lastCheckedAt };
}

async function requireAdmin(req: Request) {
  const profile = await authenticateSupabase(req);
  if (profile.role !== "admin") throw new MentorHttpError(403, "ADMIN_REQUIRED", "Accès administrateur requis.");
  return profile;
}

function sendError(res: { status: (status: number) => { json: (body: unknown) => void } }, error: unknown, isAdmin = false) {
  if (error instanceof MentorHttpError) {
    res.status(error.status).json({ ok: false, code: error.code, message: isAdmin ? error.message : mentorStudentMessage(error.code as Parameters<typeof mentorStudentMessage>[0]) });
    return;
  }
  res.status(500).json({ ok: false, code: "UNAVAILABLE", message: isAdmin ? "Erreur de service Mentor." : mentorStudentMessage("UNAVAILABLE") });
}

export function registerMentorApi(app: Express) {
  app.get("/api/mentor/admin/settings", async (req, res) => {
    try { await requireAdmin(req); res.json({ ok: true, settings: adminSettingsView(await getMentorSettings()) }); } catch (error) { sendError(res, error, true); }
  });

  app.post("/api/mentor/admin/test", async (req, res) => {
    try {
      const profile = await requireAdmin(req); const { apiKey } = testSchema.parse(req.body);
      await callGemini({ apiKey, model: GEMINI_MODEL, profile, message: "Réponds uniquement : connexion valide.", conversation: [], attachments: [] });
      res.json({ ok: true, status: "valid", message: "Clé valide et service disponible." });
    } catch (error) {
      const status = error instanceof MentorHttpError ? (error.code === "QUOTA" ? "quota" : error.code === "INVALID" ? "invalid" : "unavailable") : "unavailable";
      sendError(res, error, true);
      void status;
    }
  });

  app.post("/api/mentor/admin/save", async (req, res) => {
    try {
      const profile = await requireAdmin(req); const input = saveSchema.parse(req.body); const encrypted = encryptApiKey(input.apiKey);
      await saveMentorSettings({ model: input.model, updatedBy: profile.id, ...encrypted });
      res.json({ ok: true, settings: adminSettingsView(await getMentorSettings()) });
    } catch (error) { sendError(res, error, true); }
  });

  app.post("/api/mentor/admin/test-active", async (req, res) => {
    try {
      const profile = await requireAdmin(req); const settings = await getMentorSettings();
      if (!settings) throw new MentorHttpError(404, "NOT_CONFIGURED", "Aucune clé active n’est configurée.");
      try {
        await callGemini({ apiKey: decryptApiKey(settings), model: settings.model, profile, message: "Réponds uniquement : connexion valide.", conversation: [], attachments: [] });
        await updateMentorSettingsStatus("valid"); res.json({ ok: true, status: "valid", message: "Clé valide et service disponible." });
      } catch (error) {
        const status = error instanceof MentorHttpError ? (error.code === "QUOTA" ? "quota" : error.code === "INVALID" ? "invalid" : "unavailable") : "unavailable";
        await updateMentorSettingsStatus(status); throw error;
      }
    } catch (error) { sendError(res, error, true); }
  });

  app.post("/api/mentor/message", async (req, res) => {
    try {
      const profile = await authenticateSupabase(req); const input = messageSchema.parse(req.body); const settings = await getMentorSettings();
      if (!settings) throw new MentorHttpError(503, "NOT_CONFIGURED", "Mentor non configuré.");
      try {
        const answer = await callGemini({ apiKey: decryptApiKey(settings), model: settings.model, profile, ...input });
        res.json({ ok: true, answer, model: settings.model });
      } catch (error) {
        const status = error instanceof MentorHttpError ? (error.code === "QUOTA" ? "quota" : error.code === "INVALID" ? "invalid" : "unavailable") : "unavailable";
        await updateMentorSettingsStatus(status); throw error;
      }
    } catch (error) { sendError(res, error, false); }
  });
}
