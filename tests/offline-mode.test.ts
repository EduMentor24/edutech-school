import { describe, it, expect } from "vitest";
import { saveLocalData, getLocalData, enqueueSyncAction, getSyncQueue } from "../lib/offline/offline-storage-service";

describe("Commande 18 — Mode Offline-First & Synchronisation", () => {
  it("1. Stocke et récupère les données locales ciblées par utilisateur", async () => {
    const testUser = "user_test_123";
    const testProfile = { full_name: "Kassi Kouadio", school_level: "Première", series: "C", lv2: "Espagnol" };
    
    await saveLocalData("profile", testProfile, testUser);
    const loaded = await getLocalData<any>("profile", testUser);
    
    expect(loaded).toEqual(testProfile);
  });

  it("2. Enfile une action de modification de note en attente de synchronisation", async () => {
    const testUser = "user_test_123";
    await enqueueSyncAction({
      action: "INSERT",
      table: "grades",
      payload: { subject: "Mathématiques", score: 15, student_id: testUser },
    }, testUser);

    const queue = await getSyncQueue(testUser);
    expect(queue.length).toBeGreaterThan(0);
    expect(queue[queue.length - 1].action).toBe("INSERT");
    expect(queue[queue.length - 1].status).toBe("pending");
  });

  it("3. Isole strictement les données locales entre différents utilisateurs", async () => {
    const userA = "user_A";
    const userB = "user_B";

    await saveLocalData("pref", { theme: "dark" }, userA);
    await saveLocalData("pref", { theme: "light" }, userB);

    const prefA = await getLocalData<any>("pref", userA);
    const prefB = await getLocalData<any>("pref", userB);

    expect(prefA.theme).toBe("dark");
    expect(prefB.theme).toBe("light");
  });
});
