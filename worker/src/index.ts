import { mentorErrorPayload, parseMentorInput } from "./mentor-contract";
import { answerMentor, authenticateSupabase } from "./mentor-service";
import type { Env } from "./types";

const MAX_MENTOR_BODY_BYTES = 1_000_000;
const DEFAULT_ALLOWED_ORIGINS = [
  "https://8081-i64j5eb8a047ys22xd3lo-6ca2d9dd.us3.manus.computer",
];

function corsHeaders(request: Request, env: Env): { allowed: boolean; headers: HeadersInit } {
  const origin = request.headers.get("origin");
  if (!origin) return { allowed: true, headers: {} };
  const runtimeOrigins = (env.ALLOWED_ORIGINS ?? "").split(",").map((item) => item.trim()).filter(Boolean);
  const origins = runtimeOrigins.length > 0 ? runtimeOrigins : DEFAULT_ALLOWED_ORIGINS;
  if (!origins.includes(origin)) return { allowed: false, headers: {} };
  return {
    allowed: true,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      Vary: "Origin",
    },
  };
}

function json(body: unknown, status = 200, headers: HeadersInit = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...headers },
  });
}

async function readJsonBody(request: Request) {
  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_MENTOR_BODY_BYTES) {
    throw new Error("REQUEST_TOO_LARGE");
  }
  if (!request.body) throw new Error("INVALID_JSON");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_MENTOR_BODY_BYTES) {
      await reader.cancel();
      throw new Error("REQUEST_TOO_LARGE");
    }
    chunks.push(value);
  }
  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return JSON.parse(new TextDecoder().decode(body)) as unknown;
  } catch {
    throw new Error("INVALID_JSON");
  }
}

async function handleMentor(request: Request, env: Env, headers: HeadersInit) {
  const body = await readJsonBody(request);
  const input = parseMentorInput(body);
  const profile = await authenticateSupabase(request, env);
  const result = await answerMentor(input, profile, env);
  return json({ ok: true, ...result }, 200, headers);
}

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const cors = corsHeaders(request, env);
    if (!cors.allowed) return json({ ok: false, code: "FORBIDDEN", message: "Origine non autorisée." }, 403);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors.headers });
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/api/health") {
      return json({ ok: true, service: "edutech-school-mentor-worker" }, 200, cors.headers);
    }
    if (request.method !== "POST" || url.pathname !== "/api/mentor/message") {
      return json({ ok: false, code: "NOT_FOUND", message: "Route introuvable." }, 404, cors.headers);
    }
    try {
      return await handleMentor(request, env, cors.headers);
    } catch (error) {
      if (error instanceof Error && error.message === "INVALID_JSON") {
        return json({ ok: false, code: "INVALID_REQUEST", message: "Requête JSON invalide." }, 400, cors.headers);
      }
      if (error instanceof Error && error.message === "REQUEST_TOO_LARGE") {
        return json({ ok: false, code: "REQUEST_TOO_LARGE", message: "La requête Mentor dépasse la limite de taille autorisée." }, 413, cors.headers);
      }
      const payload = mentorErrorPayload(error);
      return json(payload.body, payload.status, cors.headers);
    }
  },
};

export default worker;
