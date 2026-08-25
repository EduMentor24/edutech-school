import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  getLocalData,
  removeLocalData,
  saveLocalData,
} from "./offline-storage-service";

const CACHE_VERSION = 1;
const STALE_AFTER_MS = 6 * 60 * 60 * 1000;
const KEY_PREFIX = "edutech-school/pedagogy";

export type PedagogicalCacheContext = {
  userId: string;
  schoolLevel: string;
  series: string;
  role: "admin" | "student";
};

type ProfileCacheIdentity = {
  id: string;
  school_level: string | null;
  series: string | null;
  role: "admin" | "student";
};

export type PedagogicalCacheState = "synced" | "stale";

export type PedagogicalReadOptions = {
  /** Force une actualisation distante lorsque le réseau est disponible, tout en conservant le cache en cas d’échec. */
  refresh?: boolean;
};

export type PedagogicalCacheSnapshot<T> = {
  schemaVersion: number;
  fetchedAt: number;
  contentVersion: string;
  state: PedagogicalCacheState;
  payload: T;
};

export function pedagogicalCacheContextFromProfile(
  profile: ProfileCacheIdentity | null | undefined,
): PedagogicalCacheContext | null {
  if (!profile?.id || !profile.school_level || !profile.series) return null;
  return {
    userId: profile.id,
    schoolLevel: profile.school_level,
    series: profile.series,
    role: profile.role,
  };
}

function segment(value: string) {
  return encodeURIComponent(value.trim());
}

function cacheKey(context: PedagogicalCacheContext, resource: string) {
  return `${KEY_PREFIX}/v${CACHE_VERSION}/${segment(context.userId)}/${segment(context.schoolLevel)}/${segment(context.series)}/${segment(context.role)}/${resource}`;
}

function cacheIndexKey(context: PedagogicalCacheContext) {
  return `${KEY_PREFIX}/v${CACHE_VERSION}/${segment(context.userId)}/index`;
}

function fingerprint(value: unknown) {
  const text = JSON.stringify(value);
  let hash = 5381;
  for (let index = 0; index < text.length; index += 1)
    hash = ((hash << 5) + hash) ^ text.charCodeAt(index);
  return `v${CACHE_VERSION}-${(hash >>> 0).toString(36)}`;
}

function stale(snapshot: PedagogicalCacheSnapshot<unknown>) {
  return Date.now() - snapshot.fetchedAt > STALE_AFTER_MS;
}

export async function readPedagogicalCache<T>(
  context: PedagogicalCacheContext | null | undefined,
  resource: string,
): Promise<PedagogicalCacheSnapshot<T> | null> {
  if (!context) return null;
  const snapshot = await getLocalData<PedagogicalCacheSnapshot<T>>(
    cacheKey(context, resource),
  );
  if (!snapshot || snapshot.schemaVersion !== CACHE_VERSION) return null;
  return { ...snapshot, state: stale(snapshot) ? "stale" : "synced" };
}

export async function writePedagogicalCache<T>(
  context: PedagogicalCacheContext,
  resource: string,
  payload: T,
): Promise<PedagogicalCacheSnapshot<T>> {
  const snapshot: PedagogicalCacheSnapshot<T> = {
    schemaVersion: CACHE_VERSION,
    fetchedAt: Date.now(),
    contentVersion: fingerprint(payload),
    state: "synced",
    payload,
  };
  const key = cacheKey(context, resource);
  await saveLocalData(key, snapshot);
  const indexKey = cacheIndexKey(context);
  const resources = new Set((await getLocalData<string[]>(indexKey)) ?? []);
  resources.add(key);
  await saveLocalData(indexKey, Array.from(resources));
  return snapshot;
}

/**
 * Retourne immédiatement un snapshot local compatible lorsque disponible. Un cache périmé est
 * rafraîchi en arrière-plan ; l’échec du rafraîchissement ne retire jamais le contenu déjà lu.
 */
export async function readPedagogicalLocalFirst<T>(
  context: PedagogicalCacheContext | null | undefined,
  resource: string,
  fetchRemote: () => Promise<T>,
  options: PedagogicalReadOptions = {},
): Promise<T> {
  if (!context) return fetchRemote();
  const cached = await readPedagogicalCache<T>(context, resource);
  if (cached) {
    if (options.refresh) {
      try {
        const payload = await fetchRemote();
        await writePedagogicalCache(context, resource, payload);
        return payload;
      } catch {
        return cached.payload;
      }
    }
    void fetchRemote()
      .then((payload) => writePedagogicalCache(context, resource, payload))
      .catch(() => undefined);
    return cached.payload;
  }
  const payload = await fetchRemote();
  await writePedagogicalCache(context, resource, payload);
  return payload;
}

export async function clearPedagogicalCache(userId: string): Promise<void> {
  const prefix = `${KEY_PREFIX}/v${CACHE_VERSION}/${segment(userId)}/`;
  let keys: readonly string[] = [];
  try {
    keys = Array.from(await AsyncStorage.getAllKeys());
    const matching = keys.filter((key) => key.startsWith(prefix));
    if (matching.length) await AsyncStorage.multiRemove(matching);
  } catch {
    // La déconnexion reste valide même si le stockage local est indisponible.
  }
  const indexes = await Promise.all([
    getLocalData<string[]>(
      `${KEY_PREFIX}/v${CACHE_VERSION}/${segment(userId)}/index`,
    ),
  ]);
  const knownKeys = indexes.flatMap((items) => items ?? []);
  await Promise.allSettled([
    ...knownKeys.map((key) => removeLocalData(key)),
    removeLocalData(`${KEY_PREFIX}/v${CACHE_VERSION}/${segment(userId)}/index`),
  ]);
}
