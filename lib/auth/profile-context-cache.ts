import type { StudentProfile } from "./supabase-auth-provider";
import { getLocalData, removeLocalData, saveLocalData } from "@/lib/offline/offline-storage-service";

type CachedProfileContext = {
  version: 1;
  profile: StudentProfile;
  cachedAt: string;
};

const PROFILE_CONTEXT_KEY = "edutech.auth.profile-context.v1";

export async function cacheProfileContext(profile: StudentProfile) {
  await saveLocalData<CachedProfileContext>(PROFILE_CONTEXT_KEY, { version: 1, profile, cachedAt: new Date().toISOString() }, profile.id);
}

export async function readCachedProfileContext(userId: string): Promise<StudentProfile | null> {
  const cached = await getLocalData<CachedProfileContext>(PROFILE_CONTEXT_KEY, userId);
  if (!cached || cached.version !== 1 || cached.profile.id !== userId) return null;
  return cached.profile;
}

export async function clearCachedProfileContext(userId: string) {
  await removeLocalData(PROFILE_CONTEXT_KEY, userId);
}
