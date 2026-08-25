import * as Network from "expo-network";
import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AppState } from "react-native";

import { useSupabaseAuth } from "@/lib/auth/supabase-auth-provider";
import { deleteLocalNotification, flushPendingNotificationReads, loadNotificationInboxCache, markNotificationRead, syncNotificationInbox } from "./notification-service";
import { emptyNotificationInboxCache, type NotificationInboxCache, type StudentNotification } from "./notification-model";

type NotificationContextValue = {
  inbox: NotificationInboxCache;
  isLoading: boolean;
  isOffline: boolean;
  error: string | null;
  unreadCount: number;
  refresh: () => Promise<void>;
  markRead: (notificationId: string) => Promise<void>;
  deleteLocal: (notificationId: string) => Promise<void>;
};

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export function NotificationSyncProvider({ children }: PropsWithChildren) {
  const { user, profile, isReady } = useSupabaseAuth();
  const network = Network.useNetworkState();
  const [inbox, setInbox] = useState<NotificationInboxCache>(emptyNotificationInboxCache());
  const inboxRef = useRef(inbox);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isOffline = network.isConnected === false || network.isInternetReachable === false;

  useEffect(() => { inboxRef.current = inbox; }, [inbox]);

  const refresh = useCallback(async () => {
    if (!user || !profile) { setInbox(emptyNotificationInboxCache()); setError(null); return; }
    setIsLoading((current) => current || inboxRef.current.items.length === 0);
    setError(null);
    const cached = await loadNotificationInboxCache(user.id);
    if (cached.items.length || cached.pendingReadIds.length) setInbox(cached);
    if (isOffline) { setIsLoading(false); return; }
    try {
      await flushPendingNotificationReads(user.id);
      const synced = await syncNotificationInbox(user.id, { schoolYear: profile.school_year ?? null, schoolLevel: profile.school_level, series: profile.series });
      setInbox(synced);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "La synchronisation des notifications a échoué.");
    } finally { setIsLoading(false); }
  }, [isOffline, profile, user]);

  useEffect(() => { if (isReady) void refresh(); }, [isReady, refresh]);
  useEffect(() => {
    if (!user || isOffline) return;
    return Network.addNetworkStateListener((state) => {
      if (state.isConnected !== false && state.isInternetReachable !== false) void refresh();
    }).remove;
  }, [isOffline, refresh, user]);
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => { if (state === "active") void refresh(); });
    return () => subscription.remove();
  }, [refresh]);

  const markRead = useCallback(async (notificationId: string) => {
    if (!user) return;
    const next = await markNotificationRead(user.id, notificationId); setInbox(next);
  }, [user]);
  const deleteLocal = useCallback(async (notificationId: string) => {
    if (!user) return;
    const next = await deleteLocalNotification(user.id, notificationId); setInbox(next);
  }, [user]);
  const unreadCount = inbox.items.filter((item) => !item.readAt).length;
  const value = useMemo<NotificationContextValue>(() => ({ inbox, isLoading, isOffline, error, unreadCount, refresh, markRead, deleteLocal }), [deleteLocal, error, inbox, isLoading, isOffline, markRead, refresh, unreadCount]);
  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotificationInbox() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotificationInbox doit être utilisé dans NotificationSyncProvider.");
  return context;
}
