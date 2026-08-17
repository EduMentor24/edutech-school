import AsyncStorage from "@react-native-async-storage/async-storage";

import { clearCachedProfileContext } from "@/lib/auth/profile-context-cache";
import { clearNotificationInboxCache } from "@/lib/notifications/notification-offline-store";

/** Efface uniquement les caches privés d’un compte après sa déconnexion locale. */
export async function clearUserOfflineCache(userId: string) {
  const exactKeys = [
    `edutech-school/bulletin/v1/${userId}/snapshot`,
    `edutech-school/bulletin/v1/${userId}/queue`,
    `edutech_offline_sync_queue_${userId}`,
    `edutech.mentor.conversation.v1.${userId}`,
    `edutech.mentor.history.v1.${userId}`,
  ];
  let knownKeys: string[] = [];
  try { knownKeys = Array.from(await AsyncStorage.getAllKeys()); } catch { knownKeys = []; }
  const messagePrefix = `edutech.mentor.history.messages.v1.${userId}.`;
  const userKeys = knownKeys.filter((key) => key.startsWith(messagePrefix));
  await Promise.allSettled([
    clearCachedProfileContext(userId),
    clearNotificationInboxCache(userId),
    AsyncStorage.multiRemove([...exactKeys, ...userKeys]),
  ]);
}
