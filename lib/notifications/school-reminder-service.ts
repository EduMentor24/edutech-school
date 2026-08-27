import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const STORAGE_KEY = "edutech-school-local-reminders-v1";
const CHANNEL_ID = "school-reminders";

export type SchoolReminderSettings = {
  enabled: boolean;
  notificationId: string | null;
};

const disabledSettings: SchoolReminderSettings = {
  enabled: false,
  notificationId: null,
};

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

export async function enableSchoolReminders(): Promise<SchoolReminderSettings> {
  await ensurePermission();
  const previous = await getSchoolReminderSettings();
  if (previous.notificationId) {
    await Notifications.cancelScheduledNotificationAsync(previous.notificationId).catch(
      () => undefined,
    );
  }
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: "EduTech School",
      body: "Prenez quelques minutes pour reprendre votre apprentissage du jour.",
      data: { route: "/(tabs)/courses" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 18,
      minute: 0,
    },
  });
  return persist({ enabled: true, notificationId });
}

export async function disableSchoolReminders(): Promise<SchoolReminderSettings> {
  const previous = await getSchoolReminderSettings();
  if (isNativeNotificationsAvailable() && previous.notificationId) {
    await Notifications.cancelScheduledNotificationAsync(previous.notificationId).catch(
      () => undefined,
    );
  }
  return persist(disabledSettings);
}
