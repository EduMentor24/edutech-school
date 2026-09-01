import AsyncStorage from "@react-native-async-storage/async-storage";

import type { DictionaryEntry } from "./dictionary-model";

const CACHE_VERSION = 1;
const CACHE_PREFIX = "edutech-dictionary-v1";

export type DictionaryCacheContext = { profileId?: string | null; schoolLevel?: string | null; series?: string | null };
type DictionaryCachePayload = { version: number; entries: DictionaryEntry[]; updatedAt: string };

export function dictionaryCacheContextFromProfile(profile: { id?: string | null; school_level?: string | null; series?: string | null } | null | undefined): DictionaryCacheContext {
  return { profileId: profile?.id ?? null, schoolLevel: profile?.school_level ?? null, series: profile?.series ?? null };
}

function cacheKey(context: DictionaryCacheContext): string {
  return `${CACHE_PREFIX}:${context.schoolLevel ?? "all-levels"}:${context.series ?? "all-series"}`;
}

async function readCache(context: DictionaryCacheContext): Promise<DictionaryEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(cacheKey(context));
    if (!raw) return [];
    const payload = JSON.parse(raw) as Partial<DictionaryCachePayload>;
    return payload.version === CACHE_VERSION && Array.isArray(payload.entries) ? payload.entries : [];
  } catch {
    return [];
  }
}

async function writeCache(context: DictionaryCacheContext, entries: DictionaryEntry[]): Promise<void> {
  await AsyncStorage.setItem(cacheKey(context), JSON.stringify({ version: CACHE_VERSION, entries, updatedAt: new Date().toISOString() } satisfies DictionaryCachePayload));
}

async function fetchDictionaryCorpus(_context: DictionaryCacheContext): Promise<DictionaryEntry[]> {
  return [];
}

export async function getDictionaryEntries(context: DictionaryCacheContext = {}, options: { forceRefresh?: boolean } = {}): Promise<DictionaryEntry[]> {
  const cached = await readCache(context);
  if (cached.length > 0 && !options.forceRefresh) return cached;
  try {
    const remote = await fetchDictionaryCorpus(context);
    if (remote.length > 0 || cached.length === 0) {
      await writeCache(context, remote);
      return remote;
    }
  } catch {
    // Le cache local reste disponible hors connexion.
  }
  return cached;
}

export async function saveDictionaryEntries(context: DictionaryCacheContext, entries: DictionaryEntry[]): Promise<void> {
  await writeCache(context, entries);
}
