import { supabase } from "@/lib/supabase/client";
import { readNotificationInboxCache, writeNotificationInboxCache } from "./notification-offline-store";
import { type NotificationAudience, type NotificationInboxCache, type StudentNotification } from "./notification-model";

function errorMessage(error: unknown) {
  return typeof error === "object" && error && "message" in error && typeof error.message === "string" ? error.message : "Une erreur de synchronisation des notifications est survenue.";
}

function notificationFrom(row: any): StudentNotification {
  const readRows = Array.isArray(row.edutech_notification_reads) ? row.edutech_notification_reads : [];
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    createdAt: row.created_at,
    schoolYear: row.school_year ?? null,
    notificationType: row.notification_type ?? "general",
    priority: row.priority === "high" ? "high" : "normal",
    contentType: row.content_type ?? null,
    contentId: row.content_id ?? null,
    route: row.route ?? null,
    readAt: readRows[0]?.read_at ?? null,
  };
}

function belongsToCurrentContext(notification: StudentNotification, audience: NotificationAudience) {
  return !audience.schoolYear || !notification.schoolYear || notification.schoolYear === audience.schoolYear;
}

function uniqueIds(values: string[]) { return Array.from(new Set(values)); }

export async function syncNotificationInbox(userId: string, audience: NotificationAudience): Promise<NotificationInboxCache> {
  const previous = await readNotificationInboxCache(userId);
  const { data, error } = await supabase
    .from("edutech_notifications")
    .select("id,title,body,created_at,school_year,notification_type,priority,content_type,content_id,route,edutech_notification_reads(read_at,user_id)")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw new Error(errorMessage(error));
  const hidden = new Set(previous.hiddenIds);
  const remote = (data ?? []).map(notificationFrom).filter((item) => belongsToCurrentContext(item, audience) && !hidden.has(item.id));
  const pending = new Set(previous.pendingReadIds);
  const localReadAt = new Map(previous.items.filter((item) => item.readAt).map((item) => [item.id, item.readAt]));
  const items = remote.map((item) => ({ ...item, readAt: item.readAt ?? localReadAt.get(item.id) ?? null }));
  const cache = { version: 1 as const, items, hiddenIds: previous.hiddenIds, pendingReadIds: [...pending], lastSyncedAt: new Date().toISOString() };
  return writeNotificationInboxCache(userId, cache);
}

export async function loadNotificationInboxCache(userId: string) { return readNotificationInboxCache(userId); }

export async function markNotificationRead(userId: string, notificationId: string) {
  const cache = await readNotificationInboxCache(userId);
  const readAt = new Date().toISOString();
  const next: NotificationInboxCache = { ...cache, items: cache.items.map((item) => item.id === notificationId ? { ...item, readAt: item.readAt ?? readAt } : item) };
  await writeNotificationInboxCache(userId, next);
  try {
    const { error } = await supabase.from("edutech_notification_reads").upsert({ notification_id: notificationId, user_id: userId, read_at: readAt }, { onConflict: "notification_id,user_id" });
    if (error) throw error;
    const synced = { ...next, pendingReadIds: next.pendingReadIds.filter((id) => id !== notificationId) };
    return writeNotificationInboxCache(userId, synced);
  } catch {
    const queued = { ...next, pendingReadIds: uniqueIds([...next.pendingReadIds, notificationId]) };
    return writeNotificationInboxCache(userId, queued);
  }
}

export async function flushPendingNotificationReads(userId: string) {
  const cache = await readNotificationInboxCache(userId);
  if (!cache.pendingReadIds.length) return cache;
  const payload = cache.pendingReadIds.map((notificationId) => ({ notification_id: notificationId, user_id: userId, read_at: new Date().toISOString() }));
  const { error } = await supabase.from("edutech_notification_reads").upsert(payload, { onConflict: "notification_id,user_id" });
  if (error) throw new Error(errorMessage(error));
  return writeNotificationInboxCache(userId, { ...cache, pendingReadIds: [] });
}

export async function deleteLocalNotification(userId: string, notificationId: string) {
  const cache = await readNotificationInboxCache(userId);
  return writeNotificationInboxCache(userId, {
    ...cache,
    items: cache.items.filter((item) => item.id !== notificationId),
    hiddenIds: uniqueIds([...cache.hiddenIds, notificationId]),
  });
}
