import type { Express, Request } from "express";
import { z } from "zod";
import { invokeLLM, type Message, type MessageContent } from "./_core/llm";
import { isSupportedMentorAttachment, mentorStudentMessage } from "../lib/mentor/mentor-policy";

const NATIVE_GEMINI_MODEL = "gemini-3-flash-preview";
const MAX_ATTACHMENTS = 3;

type Profile = { id: string; role: "admin" | "student"; school_level: string | null; series: string | null };
type ConversationItem = { role: "user" | "assistant"; content: string };
type AttachmentInput = { mimeType: string; base64: string; name?: string };

const messageSchema = z.object({
  message: z.string().trim().min(1).max(6000),
  subject: z.string().trim().max(120).nullable().optional(),
  chapter: z.string().trim().max(180).nullable().optional(),
  lesson: z.string().trim().max(180).nullable().optional(),
  conversation: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().trim().min(1).max(6000) })).max(10).default([]),
  attachments: z.array(z.object({ mimeType: z.string(), base64: z.string().min(1), name: z.string().trim().max(160).optional() })).max(MAX_ATTACHMENTS).default([]),
});

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

function nativeErrorCode(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  if (/429|quota|resource_exhausted|rate limit/i.test(message)) return "QUOTA";
  if (/401|403|unauthorized|forbidden|api key|not configured|OPENAI_API_KEY/i.test(message)) return "INVALID";
  return "UNAVAILABLE";
}

function pedagogicalInstruction(profile: Profile, input: { subject?: string | null; chapter?: string | null; lesson?: string | null }) {
  const level = profile.school_level ?? "niveau non renseigné";
  const series = profile.series ?? "série non renseignée";
  const subject = input.subject ? `Matière choisie : ${input.subject}.` : "Aucune matière précise n’est choisie.";
  const chapter = input.chapter ? `Chapitre : ${input.chapter}.` : "";
  const lesson = input.lesson ? `Leçon : ${input.lesson}.` : "";
  return `Tu es le Mentor IA pédagogique d’EduTech School pour un élève ivoirien du secondaire. Le profil réel est : niveau ${level}, série ${series}. ${subject} ${chapter} ${lesson}

Tu accompagnes l’élève comme un professeur patient : explique, simplifie, donne des exemples, pose une question de vérification et guide le raisonnement avant de fournir une solution complète. Adapte le vocabulaire au niveau réel. Pour une photo d’exercice, identifie l’énoncé, la question, la notion utile, puis guide les étapes. Pour une photo de cours, reformule clairement sans inventer les passages illisibles. Si une image est floue, sombre, coupée ou trop petite, dis exactement que tu ne peux pas la lire et demande une image plus nette. N’invente jamais un programme DPFC, une source officielle, un coefficient, un auteur ou une donnée absente. Le Mentor ne modifie jamais le Bulletin, les notes, les coefficients, les Quiz, les Exercices ou la progression. Réponds en français, avec Markdown simple et une structure aérée.`;
}

function attachmentContent(attachment: AttachmentInput): MessageContent {
  const url = `data:${attachment.mimeType};base64,${attachment.base64}`;
  if (attachment.mimeType.startsWith("image/")) return { type: "image_url", image_url: { url, detail: "auto" } };
  return { type: "file_url", file_url: { url, mime_type: "application/pdf" } };
}

function responseText(content: string | Array<{ type: string; text?: string }>): string {
  if (typeof content === "string") return content.trim();
  return content.filter((part) => part.type === "text").map((part) => part.text ?? "").join("\n").trim();
}

async function callNativeMentor(input: { profile: Profile; message: string; subject?: string | null; chapter?: string | null; lesson?: string | null; conversation: ConversationItem[]; attachments: AttachmentInput[] }) {
  const userContent: MessageContent[] = [{ type: "text", text: input.message }];
  for (const attachment of input.attachments) {
    const byteLength = Buffer.byteLength(attachment.base64, "base64");
    if (!isSupportedMentorAttachment(attachment.mimeType, byteLength)) throw new MentorHttpError(400, "INVALID_ATTACHMENT", "Pièce jointe invalide.");
    userContent.push(attachmentContent(attachment));
  }
  const messages: Message[] = [
    { role: "system", content: pedagogicalInstruction(input.profile, input) },
    ...input.conversation.slice(-8).map((item) => ({ role: item.role, content: item.content }) as Message),
    { role: "user", content: userContent },
  ];
  try {
    const response = await invokeLLM({ model: NATIVE_GEMINI_MODEL, messages, maxTokens: 1800, thinking: { budget_tokens: 512 } });
    const answer = responseText(response.choices[0]?.message.content ?? "");
    if (!answer) throw new MentorHttpError(503, "UNAVAILABLE", "Le modèle IA a retourné une réponse vide.");
    return answer;
  } catch (error) {
    if (error instanceof MentorHttpError) throw error;
    const code = nativeErrorCode(error);
    throw new MentorHttpError(code === "QUOTA" ? 429 : code === "INVALID" ? 502 : 503, code, "Le service IA natif est temporairement indisponible.");
  }
}

function sendError(res: { status: (status: number) => { json: (body: unknown) => void } }, error: unknown) {
  if (error instanceof MentorHttpError) {
    res.status(error.status).json({ ok: false, code: error.code, message: mentorStudentMessage(error.code as Parameters<typeof mentorStudentMessage>[0]) });
    return;
  }
  res.status(500).json({ ok: false, code: "UNAVAILABLE", message: mentorStudentMessage("UNAVAILABLE") });
}

export function registerMentorApi(app: Express) {
  app.post("/api/mentor/message", async (req, res) => {
    try {
      const profile = await authenticateSupabase(req);
      const input = messageSchema.parse(req.body);
      const answer = await callNativeMentor({ profile, ...input });
      res.json({ ok: true, answer, model: NATIVE_GEMINI_MODEL });
    } catch (error) {
      sendError(res, error);
    }
  });
}
