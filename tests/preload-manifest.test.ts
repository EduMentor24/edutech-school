import { describe, expect, it } from "vitest";

import {
  finishPreloadDomain,
  isPreloadManifestFresh,
  markPreloadDomainInterrupted,
  markPreloadResourceError,
  markPreloadResourceSynced,
  missingPreloadResources,
  preparePreloadManifest,
  preloadManifestSummary,
  readPreloadManifest,
} from "../lib/offline/preload-manifest";
import {
  writePedagogicalCache,
  type PedagogicalCacheContext,
} from "../lib/offline/pedagogical-cache";

const context: PedagogicalCacheContext = {
  userId: "manifest-student",
  schoolLevel: "Terminale",
  series: "A1",
  role: "student",
};

describe("Manifeste de préchargement reprenable", () => {
  it("ne devient prêt qu’après la réussite de toutes les ressources attendues", async () => {
    await preparePreloadManifest(context, "courses", [{ id: "a" }, { id: "b" }], "courses-v1");
    await markPreloadResourceSynced(context, "courses", "a");
    await markPreloadResourceSynced(context, "courses", "b");
    const manifest = await finishPreloadDomain(context, "courses");

    expect(preloadManifestSummary(manifest)).toMatchObject({ state: "ready", expectedCount: 2, succeededCount: 2, errorCount: 0 });
    expect(isPreloadManifestFresh(manifest)).toBe(true);
  });

  it("conserve les ressources déjà prêtes et ne reprend que la ressource manquante après interruption", async () => {
    await preparePreloadManifest(context, "exercises", [{ id: "one" }, { id: "two" }, { id: "three" }], "exercises-v1");
    await markPreloadResourceSynced(context, "exercises", "one");
    await markPreloadResourceSynced(context, "exercises", "two");
    await markPreloadDomainInterrupted(context, "exercises", new Error("Réseau perdu"));

    expect(missingPreloadResources(await readPreloadManifest(context, "exercises"))).toEqual(["three"]);

    await preparePreloadManifest(context, "exercises", [{ id: "one" }, { id: "two" }, { id: "three" }], "exercises-v1");
    expect(missingPreloadResources(await readPreloadManifest(context, "exercises"))).toEqual(["three"]);

    await markPreloadResourceSynced(context, "exercises", "three");
    expect(preloadManifestSummary(await finishPreloadDomain(context, "exercises"))).toMatchObject({ state: "ready", succeededCount: 3 });
  });

  it("isole une ressource défaillante sans effacer les réussites du domaine", async () => {
    await preparePreloadManifest(context, "quizzes", [{ id: "ok" }, { id: "retry" }], "quizzes-v1");
    await markPreloadResourceSynced(context, "quizzes", "ok");
    await markPreloadResourceError(context, "quizzes", "retry", new Error("Détail indisponible"));
    const manifest = await finishPreloadDomain(context, "quizzes");

    expect(preloadManifestSummary(manifest)).toMatchObject({ state: "partial", succeededCount: 1, errorCount: 1 });
    expect(missingPreloadResources(manifest)).toEqual(["retry"]);
  });

  it("garde les ressources synchronisées lorsqu’un catalogue ajoute seulement une nouvelle ressource", async () => {
    await preparePreloadManifest(context, "citations", [{ id: "citation-a", version: "1" }], "citations-v1");
    await markPreloadResourceSynced(context, "citations", "citation-a", "1");
    await finishPreloadDomain(context, "citations");
    await preparePreloadManifest(context, "citations", [{ id: "citation-a", version: "1" }, { id: "citation-b", version: "1" }], "citations-v2");

    expect(missingPreloadResources(await readPreloadManifest(context, "citations"))).toEqual(["citation-b"]);
  });

  it("revalide les ressources connues lorsqu’un manifeste expire sans effacer leur historique", async () => {
    const revalidateContext = { ...context, userId: "manifest-revalidate" };
    await preparePreloadManifest(revalidateContext, "courses", [{ id: "lesson-versioned", version: "v1" }], "courses-v1");
    await markPreloadResourceSynced(revalidateContext, "courses", "lesson-versioned", "v1");
    await finishPreloadDomain(revalidateContext, "courses");

    await preparePreloadManifest(revalidateContext, "courses", [{ id: "lesson-versioned", version: "v1" }], "courses-v1", true);
    const manifest = await readPreloadManifest(revalidateContext, "courses");
    expect(missingPreloadResources(manifest)).toEqual(["lesson-versioned"]);
    expect(manifest?.resources["lesson-versioned"].attempts).toBe(1);
  });

  it("sépare le manifeste selon le niveau, la série et l’utilisateur", async () => {
    const other = { ...context, userId: "other-student", series: "C" as const };
    await preparePreloadManifest(context, "progression", [{ id: "dashboard" }], "v1");
    await markPreloadResourceSynced(context, "progression", "dashboard");
    expect(await readPreloadManifest(other, "progression")).toBeNull();
  });
});
