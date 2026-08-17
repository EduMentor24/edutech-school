export type NotificationTargetType = "all" | "level" | "level_series" | "user";
export type NotificationPriority = "normal" | "high";

export type StudentNotification = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  schoolYear: string | null;
  notificationType: string;
  priority: NotificationPriority;
  contentType: string | null;
  contentId: string | null;
  route: string | null;
  readAt: string | null;
};

export type NotificationInboxCache = {
  version: 1;
  items: StudentNotification[];
  hiddenIds: string[];
  pendingReadIds: string[];
  lastSyncedAt: string | null;
};

export type NotificationAudience = {
  schoolYear: string | null;
  schoolLevel: string | null;
  series: string | null;
};

export const emptyNotificationInboxCache = (): NotificationInboxCache => ({ version: 1, items: [], hiddenIds: [], pendingReadIds: [], lastSyncedAt: null });
