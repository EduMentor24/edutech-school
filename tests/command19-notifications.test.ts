import { describe, expect, it } from "vitest";

import { getLocalData, saveLocalData } from "../lib/offline/offline-storage-service";
import { clearNotificationInboxCache, readNotificationInboxCache, writeNotificationInboxCache } from "../lib/notifications/notification-offline-store";
import { emptyNotificationInboxCache, type NotificationInboxCache } from "../lib/notifications/notification-model";

describe("Commande 19 — Notifications ciblées et stockage offline", () => {
  it("isole strictement les caches de notifications entre deux utilisateurs", async () => {
    const inboxA: NotificationInboxCache = { ...emptyNotificationInboxCache(), items: [{ id: "notification-a", title: "Cours", body: "Mathématiques", createdAt: "2026-08-17T10:00:00.000Z", schoolYear: "2026-2027", notificationType: "publication", priority: "normal", contentType: "cours", contentId: "course-a", route: "/(tabs)/courses", readAt: null }] };
    const inboxB: NotificationInboxCache = { ...emptyNotificationInboxCache(), items: [{ id: "notification-b", title: "Quiz", body: "Philosophie", createdAt: "2026-08-17T11:00:00.000Z", schoolYear: "2026-2027", notificationType: "publication", priority: "normal", contentType: "quiz", contentId: "quiz-b", route: "/(tabs)/quizzes", readAt: null }] };
    await writeNotificationInboxCache("student-a", inboxA);
    await writeNotificationInboxCache("student-b", inboxB);
    expect((await readNotificationInboxCache("student-a")).items.map((item) => item.id)).toEqual(["notification-a"]);
    expect((await readNotificationInboxCache("student-b")).items.map((item) => item.id)).toEqual(["notification-b"]);
  });

  it("conserve localement les lectures en attente sans créer de doublon", async () => {
    const cache: NotificationInboxCache = { ...emptyNotificationInboxCache(), items: [], pendingReadIds: ["n-1"] };
    await writeNotificationInboxCache("student-pending", cache);
    const loaded = await readNotificationInboxCache("student-pending");
    expect(loaded.pendingReadIds).toEqual(["n-1"]);
    expect(new Set(loaded.pendingReadIds).size).toBe(loaded.pendingReadIds.length);
  });

  it("supprime un cache de notification seulement pour le compte concerné", async () => {
    await writeNotificationInboxCache("student-clear", { ...emptyNotificationInboxCache(), hiddenIds: ["n-hidden"] });
    await writeNotificationInboxCache("student-keep", { ...emptyNotificationInboxCache(), hiddenIds: ["n-keep"] });
    await clearNotificationInboxCache("student-clear");
    expect((await readNotificationInboxCache("student-clear")).hiddenIds).toEqual([]);
    expect((await readNotificationInboxCache("student-keep")).hiddenIds).toEqual(["n-keep"]);
  });

  it("préserve l’isolation générique des données locales déjà utilisée par le mode offline", async () => {
    await saveLocalData("command19-context", { level: "Première", series: "A1" }, "student-context-a");
    await saveLocalData("command19-context", { level: "Terminale", series: "D" }, "student-context-b");
    expect(await getLocalData("command19-context", "student-context-a")).toEqual({ level: "Première", series: "A1" });
    expect(await getLocalData("command19-context", "student-context-b")).toEqual({ level: "Terminale", series: "D" });
  });
});
