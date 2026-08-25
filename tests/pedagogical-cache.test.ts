import { describe, expect, it } from "vitest";

import {
  clearPedagogicalCache,
  readPedagogicalCache,
  readPedagogicalLocalFirst,
  type PedagogicalCacheContext,
} from "../lib/offline/pedagogical-cache";

const studentA: PedagogicalCacheContext = {
  userId: "cache-student-a",
  schoolLevel: "Terminale",
  series: "A1",
  role: "student",
};

const studentB: PedagogicalCacheContext = {
  ...studentA,
  userId: "cache-student-b",
};

describe("cache pédagogique local-first", () => {
  it("réutilise un contenu local compatible lorsqu’une requête distante devient indisponible", async () => {
    const resource = "lesson/test-local-first";
    const first = await readPedagogicalLocalFirst(studentA, resource, async () => ({ title: "Leçon locale", content: "Contenu" }));
    const second = await readPedagogicalLocalFirst(studentA, resource, async () => { throw new Error("Réseau indisponible"); });

    expect(first).toEqual(second);
    expect((await readPedagogicalCache(studentA, resource))?.contentVersion).toMatch(/^v1-/);
  });

  it("isole les snapshots entre deux comptes différents", async () => {
    const resource = "catalog/isolation";
    await readPedagogicalLocalFirst(studentA, resource, async () => [{ title: "A1" }]);

    expect(await readPedagogicalCache(studentB, resource)).toBeNull();
  });

  it("purge les snapshots privés lors de la déconnexion", async () => {
    const resource = "catalog/purge";
    await readPedagogicalLocalFirst(studentA, resource, async () => [{ title: "Privé" }]);
    await clearPedagogicalCache(studentA.userId);

    expect(await readPedagogicalCache(studentA, resource)).toBeNull();
  });
});
