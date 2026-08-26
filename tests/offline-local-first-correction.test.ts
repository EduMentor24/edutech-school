import { describe, expect, it, vi } from "vitest";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import {
  readPedagogicalCache,
  readPedagogicalLocalFirst,
  writePedagogicalCache,
  type PedagogicalCacheContext,
} from "../lib/offline/pedagogical-cache";

const context: PedagogicalCacheContext = {
  userId: "offline-student",
  schoolLevel: "Terminale",
  series: "A1",
  role: "student",
};

describe("Correction mode hors ligne réel", () => {
  it("retourne immédiatement le contenu local même si le rafraîchissement réseau échoue", async () => {
    await writePedagogicalCache(context, "lesson/offline", {
      content: "Cours complet déjà synchronisé",
    });
    const remote = vi.fn(async () => {
      throw new Error("Réseau indisponible");
    });

    await expect(
      readPedagogicalLocalFirst(context, "lesson/offline", remote),
    ).resolves.toEqual({ content: "Cours complet déjà synchronisé" });
    expect(remote).toHaveBeenCalledTimes(1);
  });

  it("actualise explicitement une ressource déjà synchronisée sans perdre le cache si la requête échoue", async () => {
    await writePedagogicalCache(context, "lesson/refresh", {
      content: "Version locale",
    });

    await expect(
      readPedagogicalLocalFirst(
        context,
        "lesson/refresh",
        async () => ({ content: "Version actualisée" }),
        { refresh: true },
      ),
    ).resolves.toEqual({ content: "Version actualisée" });
    await expect(
      readPedagogicalCache<{ content: string }>(context, "lesson/refresh"),
    ).resolves.toMatchObject({ payload: { content: "Version actualisée" } });

    await expect(
      readPedagogicalLocalFirst(
        context,
        "lesson/refresh",
        async () => {
          throw new Error("Hors ligne");
        },
        { refresh: true },
      ),
    ).resolves.toEqual({ content: "Version actualisée" });
  });

  it("conserve des clés séparées par utilisateur, niveau, série et rôle", async () => {
    await writePedagogicalCache(context, "catalog/subjects", ["Mathématiques"]);
    const otherContext: PedagogicalCacheContext = {
      ...context,
      userId: "other-student",
      series: "C",
    };

    await expect(
      readPedagogicalCache(otherContext, "catalog/subjects"),
    ).resolves.toBeNull();
  });

  it("précharge les détails nécessaires aux cours, exercices et quiz, puis le Bulletin lit l’identité locale", async () => {
    const [preloadSource, bulletinSource] = await Promise.all([
      readFile(
        join(process.cwd(), "lib/offline/pedagogical-preload-service.ts"),
        "utf8",
      ),
      readFile(join(process.cwd(), "lib/bulletin/bulletin-service.ts"), "utf8"),
    ]);

    expect(preloadSource).toContain("getExerciseDetail");
    expect(preloadSource).toContain("getQuizDetail");
    expect(preloadSource).toContain("getLessonSessions");
    expect(bulletinSource).toContain("supabase.auth.getSession()");
    expect(bulletinSource).not.toContain("supabase.auth.getUser()");
  });
});
