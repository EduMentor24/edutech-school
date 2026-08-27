import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const settings = readFileSync("app/settings.tsx", "utf8");
const service = readFileSync("lib/notifications/school-reminder-service.ts", "utf8");
const config = readFileSync("app.config.ts", "utf8");

describe("rappels scolaires locaux", () => {
  it("remplace l’état préparatoire par un réglage persistant avec consentement", () => {
    expect(settings).not.toContain("Préparation pour les rappels scolaires");
    expect(settings).toContain("enableSchoolReminders");
    expect(settings).toContain("disableSchoolReminders");
    expect(settings).toContain("Heure du rappel");
    expect(settings).toContain("formatSchoolReminderTime");
    expect(settings).toContain("setSchoolReminderTime");
    expect(settings).toContain("getSchoolReminderPermission");
    expect(settings).toContain("Linking.openSettings()");
    expect(settings).toContain('Platform.OS === "android"');
  });

  it("demande la permission, programme un rappel quotidien et peut l’annuler", () => {
    expect(service).toContain("Notifications.requestPermissionsAsync");
    expect(service).toContain("SchedulableTriggerInputTypes.DAILY");
    expect(service).toContain("hour: 18");
    expect(service).toContain("Notifications.cancelScheduledNotificationAsync");
    expect(service).toContain('const CHANNEL_ID = "school-reminders"');
    expect(service).toContain("hour: number");
    expect(service).toContain("minute: number");
    expect(service).toContain("scheduleSchoolReminder(hour, minute)");
    expect(service).toContain("channelId: CHANNEL_ID");
    expect(service).toContain("getSchoolReminderPermission");
  });

  it("configure le plugin natif requis sans étendre les notifications distantes", () => {
    expect(config).toContain('"expo-notifications"');
    expect(config).toContain('defaultChannel: "school-reminders"');
    expect(config).not.toContain('"SCHEDULE_EXACT_ALARM"');
  });
});
