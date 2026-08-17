import { getLocalData, removeLocalData, saveLocalData } from "../offline/offline-storage-service";
import { emptyNotificationInboxCache, type NotificationInboxCache } from "./notification-model";

const INBOX_CACHE_KEY = "edutech.notifications.inbox.v1";

export async function readNotificationInboxCache(userId: string): Promise<NotificationInboxCache> {
  const cached = await getLocalData<NotificationInboxCache>(INBOX_CACHE_KEY, userId);
  if (!cached || cached.version !== 1 || !Array.isArray(cached.items)) return emptyNotificationInboxCache();
  return {
    ...emptyNotificationInboxCache(),
    ...cached,
    hiddenIds: Array.isArray(cached.hiddenIds) ? cached.hiddenIds : [],
    pendingReadIds: Array.isArray(cached.pendingReadIds) ? cached.pendingReadIds : [],
  };
}

export async function writeNotificationInboxCache(userId: string, cache: NotificationInboxCache) {
  await saveLocalData(INBOX_CACHE_KEY, cache, userId);
  return cache;
}

export async function clearNotificationInboxCache(userId: string) {
  await removeLocalData(INBOX_CACHE_KEY, userId);
}
