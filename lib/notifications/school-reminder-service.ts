import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const STORAGE_KEY = "edutech-school-local-reminders-v1";
const CHANNEL_ID = "school-reminders";

export type SchoolReminderSettings = {
  enabled: boolean;
  notificationId: string | null;
  hour: number;
  minute: number;
};

const disabledSettings: SchoolReminderSettings = {
  enabled: false,
  notificationId: null,
  hour: 18,
  minute: 0,
};

function validTime(hour: number, minute: number) {
  return (
    Number.isInteger(hour) &&
    Number.isInteger(minute) &&
    hour >= 0 &&
    hour <= 23 &&
    minute >= 0 &&
    minute <= 59
  );
}

function savedTime(value: unknown, fallback: number) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isInteger(parsed) ? parsed : fallback;
}

export function formatSchoolReminderTime(hour: number, minute: number) {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function isNativeNotificationsAvailable() {
  return Platform.OS === "android" || Platform.OS === "ios";
}

async function persist(settings: SchoolReminderSettings) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  return settings;
}

export async function getSchoolReminderSettings(): Promise<SchoolReminderSettings> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return disabledSettings;
  try {
    const parsed = JSON.parse(raw) as Partial<SchoolReminderSettings>;
    return {
      enabled: parsed.enabled === true,
      notificationId:
        typeof parsed.notificationId === "string" ? parsed.notificationId : null,
      hour: validTime(savedTime(parsed.hour, 18), savedTime(parsed.minute, 0))
        ? savedTime(parsed.hour, 18)
        : 18,
      minute: validTime(savedTime(parsed.hour, 18), savedTime(parsed.minute, 0))
        ? savedTime(parsed.minute, 0)
        : 0,
    };
  } catch {
    return disabledSettings;
  }
}

async function ensureAndroidChannel() {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: "Rappels scolaires",
    description: "Rappels quotidiens pour reprendre vos apprentissages.",
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 180],
    lightColor: "#2563EB",
  });
}

async function ensurePermission() {
  if (!isNativeNotificationsAvailable()) {
    throw new Error("Les rappels scolaires sont disponibles dans l’application Android ou iOS.");
  }
  await ensureAndroidChannel();
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return;
  const requested = await Notifications.requestPermissionsAsync();
  if (!requested.granted) {
    throw new Error("Autorisez les notifications pour activer les rappels scolaires.");
  }
}

export async function initializeSchoolReminders() {
  if (!isNativeNotificationsAvailable()) return;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
  await ensureAndroidChannel();
}

async function scheduleSchoolReminder(hour: number, minute: number) {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: "EduTech School",
      body: "Prenez quelques minutes pour reprendre votre apprentissage du jour.",
      data: { route: "/(tabs)/courses" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export async function enableSchoolReminders(): Promise<SchoolReminderSettings> {
  await ensurePermission();
  const previous = await getSchoolReminderSettings();
  if (previous.notificationId) {
    await Notifications.cancelScheduledNotificationAsync(previous.notificationId).catch(
      () => undefined,
    );
  }
  const notificationId = await scheduleSchoolReminder(
    previous.hour,
    previous.minute,
  );
  return persist({ ...previous, enabled: true, notificationId });
}

export async function setSchoolReminderTime(
  hour: number,
  minute: number,
): Promise<SchoolReminderSettings> {
  if (!validTime(hour, minute)) {
    throw new Error("Saisissez une heure valide au format HH:MM.");
  }
  const previous = await getSchoolReminderSettings();
  if (!previous.enabled) {
    return persist({ ...previous, hour, minute });
  }
  await ensurePermission();
  if (previous.notificationId) {
    await Notifications.cancelScheduledNotificationAsync(previous.notificationId).catch(
      () => undefined,
    );
  }
  const notificationId = await scheduleSchoolReminder(hour, minute);
  return persist({ enabled: true, notificationId, hour, minute });
}

export async function disableSchoolReminders(): Promise<SchoolReminderSettings> {
  const previous = await getSchoolReminderSettings();
  if (isNativeNotificationsAvailable() && previous.notificationId) {
    await Notifications.cancelScheduledNotificationAsync(previous.notificationId).catch(
      () => undefined,
    );
  }
  return persist({ ...previous, enabled: false, notificationId: null });
}
