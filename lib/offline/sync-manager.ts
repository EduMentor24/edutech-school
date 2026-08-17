import { getSyncQueue, updateSyncQueue, SyncQueueItem } from "./offline-storage-service";
import { supabase } from "@/lib/supabase/client";

export async function processSyncQueue(userId?: string): Promise<{ successCount: number; errorCount: number }> {
  const queue = await getSyncQueue(userId);
  let successCount = 0;
  let errorCount = 0;

  const updatedQueue: SyncQueueItem[] = [];

  for (const item of queue) {
    if (item.status === "synced") {
      updatedQueue.push(item);
      continue;
    }

    try {
      item.status = "syncing";
      item.attempts += 1;

      let error = null;
      if (item.action === "INSERT") {
        const res = await supabase.from(item.table).insert(item.payload);
        error = res.error;
      } else if (item.action === "UPDATE") {
        const res = await supabase.from(item.table).update(item.payload).match(item.payload.matchCriteria || { id: item.payload.id });
        error = res.error;
      } else if (item.action === "DELETE") {
        const res = await supabase.from(item.table).delete().match(item.payload.matchCriteria || { id: item.payload.id });
        error = res.error;
      }

      if (error) {
        throw error;
      }

      item.status = "synced";
      successCount++;
      updatedQueue.push(item);
    } catch (e: any) {
      item.status = "error";
      item.errorMsg = e.message || "Erreur de synchronisation réseau";
      errorCount++;
      updatedQueue.push(item);
    }
  }

  await updateSyncQueue(updatedQueue, userId);
  return { successCount, errorCount };
}
