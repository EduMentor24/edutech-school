import { Session, User } from "@supabase/supabase-js";
import * as Linking from "expo-linking";
import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AppState, Platform } from "react-native";

import { supabase } from "@/lib/supabase/client";
import { cacheProfileContext, readCachedProfileContext } from "./profile-context-cache";
import { clearUserOfflineCache } from "@/lib/offline/user-cache-lifecycle";

export type StudentProfile = {
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

export type RegistrationInput = { firstName: string; lastName: string; email: string; password: string; schoolLevel: string; series: string };
export type ProfileInput = { firstName: string; lastName: string; avatarUrl?: string };
type AuthResult = { error: string | null; needsEmailConfirmation?: boolean };
type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: StudentProfile | null;
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
  updateProfile: (input: ProfileInput) => Promise<AuthResult>;
  refreshProfile: () => Promise<void>;
};

const PROFILE_FIELDS = "id,email,first_name,last_name,full_name,avatar_url,role,school_level,series,school_year,is_active,status,created_at,updated_at";
const SCHOOL_LEVELS = ["Première", "Terminale"];
const SCHOOL_SERIES = ["A1", "A2", "C", "D"];
const SupabaseAuthContext = createContext<AuthContextValue | undefined>(undefined);

function messageFrom(error: unknown) { if (error instanceof Error) return error.message; if (typeof error === "object" && error && "message" in error && typeof error.message === "string") return error.message; return "Une erreur inattendue est survenue."; }

export function SupabaseAuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  const user = session?.user ?? null;

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
          setProfile(cached);
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

      const nextProfile = data as StudentProfile;
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
      if (event === "SIGNED_OUT") { setProfile(null); setProfileError(null); setIsPasswordRecovery(false); }
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (Platform.OS === "web") return;
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") supabase.auth.startAutoRefresh(); else supabase.auth.stopAutoRefresh();
    });
    return () => subscription.remove();
  }, []);

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

  const updateProfile = useCallback(async (input: ProfileInput): Promise<AuthResult> => {
    if (!user) return { error: "Votre session a expiré. Connectez-vous à nouveau." };
    const firstName = input.firstName.trim(); const lastName = input.lastName.trim();
    if (!firstName || !lastName) return { error: "Le prénom et le nom sont obligatoires." };
    const { data, error } = await supabase.from("profiles").update({ first_name: firstName, last_name: lastName, full_name: `${firstName} ${lastName}`.trim(), avatar_url: input.avatarUrl?.trim() || null }).eq("id", user.id).select(PROFILE_FIELDS).single();
    if (!error && data) { const nextProfile = data as StudentProfile; setProfile(nextProfile); await cacheProfileContext(nextProfile); }
    return { error: error ? messageFrom(error) : null };
  }, [user]);

  const value = useMemo<AuthContextValue>(() => ({ session, user, profile, isReady, isProfileLoading, profileError, isPasswordRecovery, isAuthenticated: Boolean(user), isAdmin: profile?.role === "admin", signIn, signUp, signOut, sendPasswordReset, updatePassword, updateProfile, refreshProfile }), [session, user, profile, isReady, isProfileLoading, profileError, isPasswordRecovery, signIn, signUp, signOut, updatePassword, updateProfile, refreshProfile]);
  return <SupabaseAuthContext.Provider value={value}>{children}</SupabaseAuthContext.Provider>;
}

export function useSupabaseAuth() { const context = useContext(SupabaseAuthContext); if (!context) throw new Error("useSupabaseAuth doit être utilisé dans SupabaseAuthProvider."); return context; }
