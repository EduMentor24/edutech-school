import { Session, User } from "@supabase/supabase-js";
import * as Linking from "expo-linking";
import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AppState, Platform } from "react-native";

import { clearUserOfflineCache } from "@/lib/offline/user-cache-lifecycle";
import {
  isManagedProfileAvatarPath,
  normalizeProfileChange,
  type ProfileChangeComparable,
} from "@/lib/profile/profile-change-rules";
import { supabase } from "@/lib/supabase/client";
import { cacheProfileContext, readCachedProfileContext } from "./profile-context-cache";

type StoredStudentProfile = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  full_name: string;
  avatar_url: string | null;
  role: "admin" | "student";
  school_level: "Première" | "Terminale" | null;
  series: string | null;
  school_year: string | null;
  is_active: boolean;
  status: string;
  created_at: string;
  updated_at: string;
};

export type StudentProfile = StoredStudentProfile & {
  /** URL affichable ; l’URL stockée demeure un chemin privé lorsque la photo vient du compartiment sécurisé. */
  avatar_display_url?: string | null;
};

export type RegistrationInput = { firstName: string; lastName: string; email: string; password: string; schoolLevel: string; series: string };
export type ProfileInput = { firstName: string; lastName: string; avatarPath?: string | null; schoolLevel: string; series: string; reason?: string };
export type ProfileChangeEligibility = {
  activeSchoolYear: string;
  directChangeUsed: boolean;
  pendingRequestId: string | null;
  pendingRequestCreatedAt: string | null;
};
export type ProfileSaveResult = { error: string | null; outcome?: "updated" | "requested"; requestId?: string | null };
export type AvatarUploadInput = { uri: string; mimeType?: string | null; fileSize?: number | null };
export type AvatarUploadResult = { path: string | null; error: string | null };
type AuthResult = { error: string | null; needsEmailConfirmation?: boolean };
type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: StudentProfile | null;
  profileChangeEligibility: ProfileChangeEligibility | null;
  isReady: boolean;
  isProfileLoading: boolean;
  profileError: string | null;
  isPasswordRecovery: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (input: RegistrationInput) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
  sendPasswordReset: (email: string) => Promise<AuthResult>;
  updatePassword: (password: string) => Promise<AuthResult>;
  updateProfile: (input: ProfileInput) => Promise<ProfileSaveResult>;
  uploadProfileAvatar: (input: AvatarUploadInput) => Promise<AvatarUploadResult>;
  refreshProfile: () => Promise<void>;
  refreshProfileChangeEligibility: () => Promise<void>;
};

const PROFILE_FIELDS = "id,email,first_name,last_name,full_name,avatar_url,role,school_level,series,school_year,is_active,status,created_at,updated_at";
const SCHOOL_LEVELS = ["Première", "Terminale"];
const SCHOOL_SERIES = ["A1", "A2", "C", "D"];
const AVATAR_MAX_BYTES = 2 * 1024 * 1024;
const AVATAR_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const SupabaseAuthContext = createContext<AuthContextValue | undefined>(undefined);

function messageFrom(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error && "message" in error && typeof error.message === "string") return error.message;
  return "Une erreur inattendue est survenue.";
}

function profileComparable(profile: StudentProfile | null): ProfileChangeComparable | null {
  if (!profile) return null;
  return {
    firstName: profile.first_name,
    lastName: profile.last_name,
    avatarPath: profile.avatar_url,
    schoolLevel: profile.school_level,
    series: profile.series,
  };
}

function avatarExtension(mimeType: string) {
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "jpg";
}

async function hydrateAvatarProfile(profile: StoredStudentProfile): Promise<StudentProfile> {
  if (!profile.avatar_url || !isManagedProfileAvatarPath(profile.avatar_url)) {
    return { ...profile, avatar_display_url: profile.avatar_url };
  }

  const { data, error } = await supabase.storage.from("profile-avatars").createSignedUrl(profile.avatar_url, 60 * 60);
  return { ...profile, avatar_display_url: error ? null : data?.signedUrl ?? null };
}

export function SupabaseAuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [profileChangeEligibility, setProfileChangeEligibility] = useState<ProfileChangeEligibility | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  const user = session?.user ?? null;

  const refreshProfileChangeEligibility = useCallback(async () => {
    if (!user) {
      setProfileChangeEligibility(null);
      return;
    }

    const { data, error } = await supabase.rpc("edutech_profile_change_status");
    if (error) {
      setProfileChangeEligibility(null);
      return;
    }

    const row = Array.isArray(data) ? data[0] : data;
    if (!row?.active_school_year) {
      setProfileChangeEligibility(null);
      return;
    }

    setProfileChangeEligibility({
      activeSchoolYear: row.active_school_year,
      directChangeUsed: Boolean(row.direct_change_used),
      pendingRequestId: row.pending_request_id ?? null,
      pendingRequestCreatedAt: row.pending_request_created_at ?? null,
    });
  }, [user]);

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setProfileError(null);
      setIsProfileLoading(false);
      return;
    }

    setIsProfileLoading(true);
    setProfileError(null);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select(PROFILE_FIELDS)
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        const cached = await readCachedProfileContext(user.id).catch(() => null);
        if (cached) {
          const hydratedCached = await hydrateAvatarProfile(cached);
          setProfile(hydratedCached);
          setProfileError(null);
        } else {
          setProfile(null);
          setProfileError(`Le chargement de votre profil a échoué : ${messageFrom(error)}`);
        }
        return;
      }

      if (!data) {
        setProfile(null);
        setProfileError("Votre profil n’est pas encore disponible. Réessayez dans quelques instants.");
        return;
      }

      const nextProfile = await hydrateAvatarProfile(data as StoredStudentProfile);
      setProfile(nextProfile);
      await cacheProfileContext(nextProfile).catch(() => undefined);
    } catch (cause) {
      setProfile(null);
      setProfileError(`Le chargement de votre profil a échoué : ${messageFrom(cause)}`);
    } finally {
      setIsProfileLoading(false);
    }
  }, [user]);

  useEffect(() => { void refreshProfile(); }, [refreshProfile]);
  useEffect(() => { void refreshProfileChangeEligibility(); }, [refreshProfileChangeEligibility]);

  useEffect(() => {
    let active = true;
    void supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) setSession(null); else setSession(data.session);
      setIsReady(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);
      if (event === "PASSWORD_RECOVERY") setIsPasswordRecovery(true);
      if (event === "SIGNED_OUT") {
        setProfile(null);
        setProfileChangeEligibility(null);
        setProfileError(null);
        setIsPasswordRecovery(false);
      }
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (Platform.OS === "web") return;
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        supabase.auth.startAutoRefresh();
        void refreshProfile();
        void refreshProfileChangeEligibility();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    });
    return () => subscription.remove();
  }, [refreshProfile, refreshProfileChangeEligibility]);

  useEffect(() => {
    const completeRecovery = async (url: string) => {
      const parsed = Linking.parse(url);
      const code = typeof parsed.queryParams?.code === "string" ? parsed.queryParams.code : undefined;
      if (!code) return;
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) setIsPasswordRecovery(true);
    };
    void Linking.getInitialURL().then((url) => { if (url) void completeRecovery(url); });
    const subscription = Linking.addEventListener("url", ({ url }) => { void completeRecovery(url); });
    return () => subscription.remove();
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    return { error: error ? messageFrom(error) : null };
  }, []);

  const signUp = useCallback(async (input: RegistrationInput): Promise<AuthResult> => {
    const firstName = input.firstName.trim(); const lastName = input.lastName.trim(); const schoolLevel = input.schoolLevel.trim(); const series = input.series.trim();
    if (!SCHOOL_LEVELS.includes(schoolLevel) || !SCHOOL_SERIES.includes(series)) return { error: "Choisissez un niveau scolaire et une série valides." };
    const { data, error } = await supabase.auth.signUp({
      email: input.email.trim(), password: input.password,
      options: { emailRedirectTo: Linking.createURL("/auth/login"), data: { first_name: firstName, last_name: lastName, full_name: `${firstName} ${lastName}`.trim(), school_level: schoolLevel, series } },
    });
    return { error: error ? messageFrom(error) : null, needsEmailConfirmation: !error && !data.session };
  }, []);

  const signOut = useCallback(async (): Promise<AuthResult> => {
    const userId = user?.id;
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (!error && userId) await clearUserOfflineCache(userId);
    return { error: error ? messageFrom(error) : null };
  }, [user?.id]);

  const sendPasswordReset = useCallback(async (email: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: Linking.createURL("/auth/reset-password") });
    return { error: error ? messageFrom(error) : null };
  }, []);

  const updatePassword = useCallback(async (password: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.updateUser({ password });
    if (!error) setIsPasswordRecovery(false);
    return { error: error ? messageFrom(error) : null };
  }, []);

  const uploadProfileAvatar = useCallback(async (input: AvatarUploadInput): Promise<AvatarUploadResult> => {
    if (!user) return { path: null, error: "Votre session a expiré. Connectez-vous à nouveau." };
    const mimeType = input.mimeType && AVATAR_MIME_TYPES.includes(input.mimeType) ? input.mimeType : "image/jpeg";
    if (input.fileSize && input.fileSize > AVATAR_MAX_BYTES) return { path: null, error: "La photo doit peser au plus 2 Mo." };

    try {
      const response = await fetch(input.uri);
      if (!response.ok) return { path: null, error: "La photo sélectionnée ne peut pas être lue." };
      const bytes = await response.arrayBuffer();
      if (bytes.byteLength > AVATAR_MAX_BYTES) return { path: null, error: "La photo doit peser au plus 2 Mo." };

      const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${avatarExtension(mimeType)}`;
      const { error } = await supabase.storage.from("profile-avatars").upload(path, bytes, {
        cacheControl: "3600",
        contentType: mimeType,
        upsert: false,
      });
      return { path: error ? null : path, error: error ? messageFrom(error) : null };
    } catch (cause) {
      return { path: null, error: `Impossible d’envoyer la photo : ${messageFrom(cause)}` };
    }
  }, [user]);

  const updateProfile = useCallback(async (input: ProfileInput): Promise<ProfileSaveResult> => {
    if (!user || !profile) return { error: "Votre session a expiré. Connectez-vous à nouveau." };
    const normalized = normalizeProfileChange({
      firstName: input.firstName,
      lastName: input.lastName,
      avatarPath: input.avatarPath,
      schoolLevel: input.schoolLevel,
      series: input.series,
    });
    if (!normalized) return { error: "Renseignez un prénom, un nom, un niveau scolaire et une série valides." };
    if (!profileComparable(profile)) return { error: "Votre profil doit être actualisé avant modification." };

    const { data, error } = await supabase.rpc("submit_profile_change", {
      p_first_name: normalized.firstName,
      p_last_name: normalized.lastName,
      p_avatar_url: normalized.avatarPath,
      p_school_level: normalized.schoolLevel,
      p_series: normalized.series,
      p_reason: input.reason?.trim() || null,
    });
    if (error) return { error: messageFrom(error) };

    const outcome = data?.outcome === "requested" ? "requested" : "updated";
    if (outcome === "updated") await refreshProfile();
    await refreshProfileChangeEligibility();
    return { error: null, outcome, requestId: data?.request_id ?? null };
  }, [profile, refreshProfile, refreshProfileChangeEligibility, user]);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    user,
    profile,
    profileChangeEligibility,
    isReady,
    isProfileLoading,
    profileError,
    isPasswordRecovery,
    isAuthenticated: Boolean(user),
    isAdmin: profile?.role === "admin",
    signIn,
    signUp,
    signOut,
    sendPasswordReset,
    updatePassword,
    updateProfile,
    uploadProfileAvatar,
    refreshProfile,
    refreshProfileChangeEligibility,
  }), [
    session,
    user,
    profile,
    profileChangeEligibility,
    isReady,
    isProfileLoading,
    profileError,
    isPasswordRecovery,
    signIn,
    signUp,
    signOut,
    sendPasswordReset,
    updatePassword,
    updateProfile,
    uploadProfileAvatar,
    refreshProfile,
    refreshProfileChangeEligibility,
  ]);

  return <SupabaseAuthContext.Provider value={value}>{children}</SupabaseAuthContext.Provider>;
}

export function useSupabaseAuth() {
  const context = useContext(SupabaseAuthContext);
  if (!context) throw new Error("useSupabaseAuth doit être utilisé dans SupabaseAuthProvider.");
  return context;
}
