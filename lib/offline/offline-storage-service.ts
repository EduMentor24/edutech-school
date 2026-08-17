import AsyncStorage from "@react-native-async-storage/async-storage";

export interface SyncQueueItem {
  id: string;
  action: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  payload: any;
  createdAt: number;
  status: "pending" | "syncing" | "synced" | "error";
  attempts: number;
  errorMsg?: string;
}

// Fallback memory store for Node / Vitest test environments where AsyncStorage mock might be null/uninitialized
const memoryStore = new Map<string, string>();

export async function saveLocalData<T>(key: string, data: T, userId?: string): Promise<void> {
  const scopedKey = userId ? `${key}_${userId}` : key;
  const serialized = JSON.stringify(data);
  memoryStore.set(scopedKey, serialized);
  try {
    if (AsyncStorage && typeof AsyncStorage.setItem === "function") {
      await AsyncStorage.setItem(scopedKey, serialized);
    }
  } catch (e) {
    // Ignore async storage failures in test env
  }
}

export async function getLocalData<T>(key: string, userId?: string): Promise<T | null> {
  const scopedKey = userId ? `${key}_${userId}` : key;
  try {
    if (AsyncStorage && typeof AsyncStorage.getItem === "function") {
      const raw = await AsyncStorage.getItem(scopedKey);
      if (raw) return JSON.parse(raw);
    }
  } catch (e) {
    // fallback to memory store
  }
  const mem = memoryStore.get(scopedKey);
  return mem ? JSON.parse(mem) : null;
}

export async function enqueueSyncAction(action: Omit<SyncQueueItem, "id" | "createdAt" | "status" | "attempts">, userId?: string): Promise<void> {
  const queueKey = "edutech_offline_sync_queue";
  try {
    const queue = (await getLocalData<SyncQueueItem[]>(queueKey, userId)) || [];
    const newItem: SyncQueueItem = {
      ...action,
      id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: Date.now(),
      status: "pending",
      attempts: 0,
    };
    queue.push(newItem);
    await saveLocalData(queueKey, queue, userId);
  } catch (e) {
    console.error("Failed to enqueue sync action:", e);
  }
}

export async function getSyncQueue(userId?: string): Promise<SyncQueueItem[]> {
  const queueKey = "edutech_offline_sync_queue";
  return (await getLocalData<SyncQueueItem[]>(queueKey, userId)) || [];
}

export async function updateSyncQueue(queue: SyncQueueItem[], userId?: string): Promise<void> {
  const queueKey = "edutech_offline_sync_queue";
  await saveLocalData(queueKey, queue, userId);
}
