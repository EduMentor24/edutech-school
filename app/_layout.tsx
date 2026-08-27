import "@/global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  SafeAreaFrameContext,
  SafeAreaInsetsContext,
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import type { EdgeInsets, Metrics, Rect } from "react-native-safe-area-context";
import "react-native-reanimated";

import "@/lib/_core/nativewind-pressable";
import {
  initManusRuntime,
  subscribeSafeAreaInsets,
} from "@/lib/_core/manus-runtime";
import { EduThemeProvider } from "@/lib/edutech/theme-context";
import {
  SupabaseAuthProvider,
  useSupabaseAuth,
} from "@/lib/auth/supabase-auth-provider";
import { BulletinSyncProvider } from "@/lib/bulletin/bulletin-sync-context";
import { LearningSyncProvider } from "@/lib/offline/learning-sync-context";
import { PedagogicalPreloadProvider } from "@/lib/offline/pedagogical-preload-context";
import { NotificationSyncProvider } from "@/lib/notifications/notification-sync-context";
import { initializeSchoolReminders } from "@/lib/notifications/school-reminder-service";
import { AuthLoadingScreen } from "@/components/edutech/auth-loading-screen";
import { ThemeProvider } from "@/lib/theme-provider";
import { createTRPCClient, trpc } from "@/lib/trpc";

const DEFAULT_WEB_INSETS: EdgeInsets = { top: 0, right: 0, bottom: 0, left: 0 };
const DEFAULT_WEB_FRAME: Rect = { x: 0, y: 0, width: 0, height: 0 };
export const unstable_settings = { anchor: "(tabs)" };

function sameInsets(left: EdgeInsets, right: EdgeInsets) {
  return (
    left.top === right.top &&
    left.right === right.right &&
    left.bottom === right.bottom &&
    left.left === right.left
  );
}

function sameFrame(left: Rect, right: Rect) {
  return (
    left.x === right.x &&
    left.y === right.y &&
    left.width === right.width &&
    left.height === right.height
  );
}

function RootNavigator() {
  const { isReady, isAuthenticated, isPasswordRecovery, isAdmin } =
    useSupabaseAuth();
  if (!isReady) return <AuthLoadingScreen />;
  return (
    <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
      <Stack.Screen name="index" />
      <Stack.Protected guard={!isAuthenticated || isPasswordRecovery}>
        <Stack.Screen name="auth" />
      </Stack.Protected>
      <Stack.Protected guard={isAuthenticated && !isPasswordRecovery}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="course" />
        <Stack.Screen name="mentor" />
        <Stack.Screen name="bulletin" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="privacy" />
        <Stack.Screen name="terms" />
        <Stack.Screen name="about" />
        <Stack.Screen name="profile/edit" />
      </Stack.Protected>
      <Stack.Protected
        guard={isAuthenticated && !isPasswordRecovery && isAdmin}
      >
        <Stack.Screen name="administration" />
        <Stack.Screen name="administration/notifications" />
      </Stack.Protected>
      <Stack.Screen name="oauth/callback" />
    </Stack>
  );
}

export default function RootLayout() {
  const initialInsets = initialWindowMetrics?.insets ?? DEFAULT_WEB_INSETS;
  const initialFrame = initialWindowMetrics?.frame ?? DEFAULT_WEB_FRAME;
  const [insets, setInsets] = useState<EdgeInsets>(initialInsets);
  const [frame, setFrame] = useState<Rect>(initialFrame);
  useEffect(() => {
    initManusRuntime();
    void initializeSchoolReminders();
  }, []);
  const handleSafeAreaUpdate = useCallback((metrics: Metrics) => {
    setInsets((current) =>
      sameInsets(current, metrics.insets) ? current : metrics.insets,
    );
    setFrame((current) =>
      sameFrame(current, metrics.frame) ? current : metrics.frame,
    );
  }, []);
  useEffect(() => {
    if (Platform.OS !== "web") return;
    return subscribeSafeAreaInsets(handleSafeAreaUpdate);
  }, [handleSafeAreaUpdate]);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } },
      }),
  );
  const [trpcClient] = useState(() => createTRPCClient());
  const providerInitialMetrics = useMemo(() => {
    const metrics = initialWindowMetrics ?? {
      insets: initialInsets,
      frame: initialFrame,
    };
    return {
      ...metrics,
      insets: {
        ...metrics.insets,
        top: Math.max(metrics.insets.top, 16),
        bottom: Math.max(metrics.insets.bottom, 12),
      },
    };
  }, [initialInsets, initialFrame]);
  const content = (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <SupabaseAuthProvider>
            <PedagogicalPreloadProvider>
              <BulletinSyncProvider>
                <LearningSyncProvider>
                  <NotificationSyncProvider>
                    <RootNavigator />
                    <StatusBar style="auto" />
                  </NotificationSyncProvider>
                </LearningSyncProvider>
              </BulletinSyncProvider>
            </PedagogicalPreloadProvider>
          </SupabaseAuthProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </GestureHandlerRootView>
  );
  const safeArea =
    Platform.OS === "web" ? (
      <SafeAreaProvider initialMetrics={providerInitialMetrics}>
        <SafeAreaFrameContext.Provider value={frame}>
          <SafeAreaInsetsContext.Provider value={insets}>
            {content}
          </SafeAreaInsetsContext.Provider>
        </SafeAreaFrameContext.Provider>
      </SafeAreaProvider>
    ) : (
      <SafeAreaProvider initialMetrics={providerInitialMetrics}>
        {content}
      </SafeAreaProvider>
    );
  return (
    <EduThemeProvider>
      <ThemeProvider>{safeArea}</ThemeProvider>
    </EduThemeProvider>
  );
}
