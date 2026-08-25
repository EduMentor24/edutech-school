import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Commande 18 — contrôles locaux hors ligne et administratifs", () => {
  const cache = readFileSync("lib/offline/pedagogical-cache.ts", "utf8");
  const syncStore = readFileSync("lib/offline/learning-sync-store.ts", "utf8");
  const syncManager = readFileSync("lib/offline/learning-sync-manager.ts", "utf8");
  const userService = readFileSync("lib/admin/user-management-service.ts", "utf8");
  const usersScreen = readFileSync("app/administration/users.tsx", "utf8");
  const decisionsScreen = readFileSync("app/administration/decisions.tsx", "utf8");
  const schoolYearsScreen = readFileSync("app/administration/school-years.tsx", "utf8");

  it("isole et purge le cache pédagogique selon l’identité, le niveau et la série", () => {
    expect(cache).toContain("userId: profile.id");
    expect(cache).toContain("schoolLevel: profile.school_level");
    expect(cache).toContain("series: profile.series");
    expect(cache).toContain("clearPedagogicalCache");
  });

  it("conserve une file de synchronisation privée et idempotente", () => {
    expect(syncStore).toContain("idempotencyKey");
    expect(syncStore).toContain('key(userId, "queue")');
    expect(syncStore).toContain('state: "pending"');
    expect(syncManager).toContain("sync_local_learning_progress");
    expect(syncManager).toContain("sync_local_exercise_submission");
    expect(syncManager).toContain("sync_local_quiz_submission");
  });

  it("centralise les actions utilisateurs derrière des RPC administratives", () => {
    expect(userService).toContain('rpc("admin_list_users"');
    expect(userService).toContain('rpc("admin_set_student_account_status"');
    expect(userService).toContain('rpc("admin_set_student_role"');
    expect(userService).toContain('rpc("admin_record_promotion_decision"');
    expect(usersScreen).toContain("Votre propre compte ne peut pas être modifié");
    expect(usersScreen).toContain("Alert.alert");
  });

  it("demande une confirmation avant décision de passage et changement d’année", () => {
    expect(decisionsScreen).toContain("Confirmer la décision");
    expect(decisionsScreen).toContain("Aucun changement de niveau ou de série n’est déclenché automatiquement.");
    expect(schoolYearsScreen).toContain("Une année archivée ne peut plus être réactivée.");
    expect(schoolYearsScreen).toContain("Alert.alert");
  });
});
