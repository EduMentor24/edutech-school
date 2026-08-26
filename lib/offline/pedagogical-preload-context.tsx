import * as Network from "expo-network";
import { AppState } from "react-native";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useSupabaseAuth,
  type StudentProfile,
} from "@/lib/auth/supabase-auth-provider";
import {
  pedagogicalCacheContextFromProfile,
  type PedagogicalCacheContext,
} from "@/lib/offline/pedagogical-cache";
import {
  isPreloadManifestFresh,
  PRELOAD_DOMAINS,
  preloadManifestSummary,
  readPreloadManifest,
  type PreloadDomain,
  type PreloadDomainManifest,
  type PreloadDomainState,
  type PreloadManifestSummary,
} from "@/lib/offline/preload-manifest";
import {
  preloadPedagogicalDomains,
  type PedagogicalPreloadResult,
} from "@/lib/offline/pedagogical-preload-service";

export type PedagogicalPreloadState =
  | "idle"
  | "syncing"
  | "interrupted"
  | "partial"
  | "ready"
  | "error";

export type PedagogicalPreloadContextValue = {
  isPreloading: boolean;
  state: PedagogicalPreloadState;
  domains: Record<PreloadDomain, PreloadManifestSummary>;
  lastResult: PedagogicalPreloadResult | null;
  syncNow: () => Promise<void>;
};

const emptySummary = (): PreloadManifestSummary => ({
  state: "idle",
  expectedCount: 0,
  downloadedCount: 0,
  succeededCount: 0,
  errorCount: 0,
  lastSyncAt: null,
  error: null,
});
const emptyDomains = () =>
  Object.fromEntries(
    PRELOAD_DOMAINS.map((domain) => [domain, emptySummary()]),
  ) as Record<PreloadDomain, PreloadManifestSummary>;

const PedagogicalPreloadContext =
  createContext<PedagogicalPreloadContextValue>({
    isPreloading: false,
    state: "idle",
    domains: emptyDomains(),
    lastResult: null,
    syncNow: async () => undefined,
  });

function stateFrom(domains: Record<PreloadDomain, PreloadManifestSummary>) {
  const states = Object.values(domains).map((domain) => domain.state);
  if (states.every((state) => state === "ready")) return "ready" as const;
  if (states.some((state) => state === "syncing")) return "syncing" as const;
  if (states.some((state) => state === "interrupted")) return "interrupted" as const;
  if (states.some((state) => state === "error")) return "error" as const;
  if (states.some((state) => state === "partial")) return "partial" as const;
  return "idle" as const;
}

function networkCanSync(network: ReturnType<typeof Network.useNetworkState>) {
  return network.isConnected !== false && network.isInternetReachable !== false;
}

async function manifestsFor(context: PedagogicalCacheContext) {
  const entries = await Promise.all(
    PRELOAD_DOMAINS.map(async (domain) => [
      domain,
      await readPreloadManifest(context, domain),
    ] as const),
  );
  return Object.fromEntries(entries) as Record<
    PreloadDomain,
    PreloadDomainManifest | null
  >;
}

function summariesFrom(
  manifests: Record<PreloadDomain, PreloadDomainManifest | null>,
) {
  return Object.fromEntries(
    PRELOAD_DOMAINS.map((domain) => [
      domain,
      preloadManifestSummary(manifests[domain]),
    ]),
  ) as Record<PreloadDomain, PreloadManifestSummary>;
}

/** Déclenche et expose une synchronisation sans bloquer l’interface élève. */
export function PedagogicalPreloadProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, isAuthenticated } = useSupabaseAuth();
  const network = Network.useNetworkState();
  const running = useRef(false);
  const [domains, setDomains] = useState<Record<
    PreloadDomain,
    PreloadManifestSummary
  >>(emptyDomains);
  const [state, setState] = useState<PedagogicalPreloadState>("idle");
  const [lastResult, setLastResult] = useState<PedagogicalPreloadResult | null>(
    null,
  );
  const profileKey = profile
    ? `${profile.id}/${profile.school_level ?? ""}/${profile.series ?? ""}/${profile.role}`
    : "";

  const updateDomain = useCallback((manifest: PreloadDomainManifest | null) => {
    if (!manifest) return;
    setDomains((current) => {
      const next = {
        ...current,
        [manifest.domain]: preloadManifestSummary(manifest),
      };
      setState(stateFrom(next));
      return next;
    });
  }, []);

  const syncNow = useCallback(async () => {
    if (
      !profile ||
      !isAuthenticated ||
      profile.role !== "student" ||
      running.current ||
      !networkCanSync(network)
    )
      return;
    const context = pedagogicalCacheContextFromProfile(profile);
    if (!context) return;
    running.current = true;
    try {
      const before = await manifestsFor(context);
      const beforeSummaries = summariesFrom(before);
      setDomains(beforeSummaries);
      const targets = PRELOAD_DOMAINS.filter(
        (domain) => !isPreloadManifestFresh(before[domain]),
      );
      if (!targets.length) {
        setState("ready");
        return;
      }
      setState("syncing");
      const result = await preloadPedagogicalDomains(profile, {
        domains: targets,
        revalidate: targets.some((domain) => before[domain]?.state === "ready"),
        onDomainChange: updateDomain,
      });
      setLastResult(result);
      const after = summariesFrom(await manifestsFor(context));
      setDomains(after);
      setState(stateFrom(after));
    } catch {
      const after = summariesFrom(await manifestsFor(context));
      setDomains(after);
      setState(stateFrom(after));
    } finally {
      running.current = false;
    }
  }, [isAuthenticated, network.isConnected, network.isInternetReachable, profile, profileKey, updateDomain]);

  useEffect(() => {
    void syncNow();
  }, [syncNow]);
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (next) => {
      if (next === "active") void syncNow();
    });
    return () => subscription.remove();
  }, [syncNow]);

  const value = useMemo(
    () => ({
      isPreloading: state === "syncing",
      state,
      domains,
      lastResult,
      syncNow,
    }),
    [domains, lastResult, state, syncNow],
  );
  return (
    <PedagogicalPreloadContext.Provider value={value}>
      {children}
    </PedagogicalPreloadContext.Provider>
  );
}

export function usePedagogicalPreload() {
  return useContext(PedagogicalPreloadContext);
}

export { preloadPedagogicalDomains as preloadPedagogicalContent };
