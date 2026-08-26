import { afterEach, describe, expect, it, vi } from "vitest";

import worker from "../worker/src/index";
import type { Env } from "../worker/src/types";

const baseEnv: Env = {
  AI: { run: vi.fn() },
  SUPABASE_URL: "https://project.supabase.co",
  SUPABASE_PUBLISHABLE_KEY: "public-test-key",
  ALLOWED_ORIGINS: "https://edutech.example",
};

const realFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = realFetch;
  vi.restoreAllMocks();
});

function request(path: string, init: RequestInit = {}) {
  return new Request(`https://mentor.example${path}`, init);
}

async function payload(response: Response) {
  return response.json() as Promise<{ ok: boolean; code?: string; answer?: string; model?: string }>;
}

describe("Worker Mentor — préparation Cloudflare", () => {
  it("répond au contrôle de santé sans faire appel à Supabase ni à l’IA", async () => {
    const response = await worker.fetch(request("/api/health"), baseEnv);

    expect(response.status).toBe(200);
    expect(await payload(response)).toEqual({ ok: true, service: "edutech-school-mentor-worker" });
  });

  it("applique CORS uniquement aux origines explicitement autorisées", async () => {
    const allowed = await worker.fetch(request("/api/mentor/message", {
      method: "OPTIONS",
      headers: { Origin: "https://edutech.example" },
    }), baseEnv);
    const denied = await worker.fetch(request("/api/health", { headers: { Origin: "https://unknown.example" } }), baseEnv);

    expect(allowed.status).toBe(204);
    expect(allowed.headers.get("Access-Control-Allow-Origin")).toBe("https://edutech.example");
    expect(denied.status).toBe(403);
    expect((await payload(denied)).code).toBe("FORBIDDEN");
  });

  it("refuse un appel Mentor sans JWT Supabase", async () => {
    const response = await worker.fetch(request("/api/mentor/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Bonjour" }),
    }), baseEnv);

    expect(response.status).toBe(401);
    expect((await payload(response)).code).toBe("AUTH_REQUIRED");
  });

  it("refuse une requête Mentor déclarée au-delà de la limite de sécurité avant tout appel distant", async () => {
    const remote = vi.fn();
    globalThis.fetch = remote;
    const response = await worker.fetch(request("/api/mentor/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer valid-jwt",
        "Content-Length": "1000001",
      },
      body: JSON.stringify({ message: "Bonjour" }),
    }), baseEnv);

    expect(response.status).toBe(413);
    expect((await payload(response)).code).toBe("REQUEST_TOO_LARGE");
    expect(remote).not.toHaveBeenCalled();
  });

  it("valide le profil Supabase et retourne une réponse du fournisseur IA mocké", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: "student-1" }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify([{
        id: "student-1",
        role: "student",
        school_level: "Terminale",
        series: "A1",
      }]), { status: 200 }));
    const ai = { run: vi.fn().mockResolvedValue({ response: "Voici une explication guidée." }) };

    const response = await worker.fetch(request("/api/mentor/message", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer valid-jwt" },
      body: JSON.stringify({ message: "Explique la thèse.", subject: "Philosophie", conversation: [] }),
    }), { ...baseEnv, AI: ai });

    expect(response.status).toBe(200);
    expect(await payload(response)).toEqual({
      ok: true,
      answer: "Voici une explication guidée.",
      model: "@cf/meta/llama-3.2-3b-instruct",
    });
    expect(ai.run).toHaveBeenCalledTimes(1);
  });

  it("rejette les PDF et les images avant toute requête distante tant que la V1 est textuelle", async () => {
    const remote = vi.fn();
    globalThis.fetch = remote;
    const response = await worker.fetch(request("/api/mentor/message", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer valid-jwt" },
      body: JSON.stringify({
        message: "Analyse ce fichier.",
        attachments: [{ mimeType: "application/pdf", base64: "ZmFrZQ==", name: "cours.pdf" }],
      }),
    }), baseEnv);

    expect(response.status).toBe(400);
    expect((await payload(response)).code).toBe("UNSUPPORTED_ATTACHMENT");
    expect(remote).not.toHaveBeenCalled();
  });

  it("retourne une erreur explicite lorsque le fournisseur IA signale un quota", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: "student-1" }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify([{
        id: "student-1",
        role: "student",
        school_level: "Terminale",
        series: "A1",
      }]), { status: 200 }));
    const ai = { run: vi.fn().mockRejectedValue(new Error("429 quota exhausted")) };

    const response = await worker.fetch(request("/api/mentor/message", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer valid-jwt" },
      body: JSON.stringify({ message: "Bonjour" }),
    }), { ...baseEnv, AI: ai });

    expect(response.status).toBe(429);
    expect((await payload(response)).code).toBe("QUOTA");
  });
});
