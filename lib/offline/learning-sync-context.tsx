import * as Network from "expo-network";
import { AppState } from "react-native";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import { useSupabaseAuth } from "@/lib/auth/supabase-auth-provider";
import { processLearningSyncQueue } from "./learning-sync-manager";

type LearningSyncContextValue = { isOnline: boolean; syncing: boolean; lastError: string | null; syncNow: () => Promise<void> };
const LearningSyncContext = createContext<LearningSyncContextValue | null>(null);

export function LearningSyncProvider({ children }: { children: React.ReactNode }) {
  const { profile, isAuthenticated } = useSupabaseAuth();
  const network = Network.useNetworkState();
  const [syncing, setSyncing] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const running = useRef(false);
  const isOnline =
    network.isConnected === true && network.isInternetReachable !== false;
  const syncNow = useCallback(async () => {
    if (!profile?.id || !isAuthenticated || !isOnline || running.current) return;
    running.current = true;
    setSyncing(true);
    try {
      const result = await processLearningSyncQueue(profile.id);
      setLastError(result.errors ? "Certaines données restent en attente de synchronisation." : null);
    } catch (cause) {
      setLastError(cause instanceof Error ? cause.message : "La synchronisation des apprentissages a échoué.");
    } finally {
      running.current = false;
      setSyncing(false);
    }
  }, [isAuthenticated, isOnline, profile?.id]);
  useEffect(() => { if (isOnline) void syncNow(); }, [isOnline, syncNow]);
  useEffect(() => { const subscription = AppState.addEventListener("change", (state) => { if (state === "active" && isOnline) void syncNow(); }); return () => subscription.remove(); }, [isOnline, syncNow]);
  const value = useMemo(() => ({ isOnline, syncing, lastError, syncNow }), [isOnline, lastError, syncNow, syncing]);
  return <LearningSyncContext.Provider value={value}>{children}</LearningSyncContext.Provider>;
}

export function useLearningSync() {
  const value = useContext(LearningSyncContext);
  if (!value) throw new Error("useLearningSync doit être utilisé dans LearningSyncProvider.");
  return value;
}
