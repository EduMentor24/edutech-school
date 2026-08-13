import { useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { AppScreen } from "@/components/edutech/app-screen";
import { BrandMark } from "@/components/edutech/brand-mark";
import { useSupabaseAuth } from "@/lib/auth/supabase-auth-provider";
import { useEduTheme } from "@/lib/edutech/theme-context";

export default function LaunchScreen() {
  const router = useRouter(); const { colors } = useEduTheme(); const { isReady, isAuthenticated } = useSupabaseAuth(); const styles = useMemo(() => createStyles(colors), [colors]);
  useEffect(() => { if (!isReady) return; const redirect = setTimeout(() => router.replace(isAuthenticated ? "/(tabs)" : "/auth/login"), 900); return () => clearTimeout(redirect); }, [isAuthenticated, isReady, router]);
  return <AppScreen edges={["top", "bottom", "left", "right"]}><View style={styles.content}><View style={styles.brandArea}><BrandMark /><Text style={styles.title}>EduTech School</Text><Text style={styles.slogan}>Apprendre. Comprendre. Progresser.</Text></View><View style={styles.loading}><ActivityIndicator size="small" color={colors.primary} /><Text style={styles.loadingText}>{isReady ? "Préparation de votre espace" : "Vérification de votre session"}</Text></View></View></AppScreen>;
}
const createStyles = (colors: ReturnType<typeof useEduTheme>["colors"]) => StyleSheet.create({ content: { flex: 1, justifyContent: "space-between", paddingVertical: 54 }, brandArea: { alignItems: "center", gap: 10, marginTop: 100 }, title: { color: colors.text, fontSize: 31, lineHeight: 37, fontWeight: "800", letterSpacing: -0.7, marginTop: 11 }, slogan: { color: colors.muted, fontSize: 15, lineHeight: 21, textAlign: "center" }, loading: { alignItems: "center", gap: 10 }, loadingText: { color: colors.muted, fontSize: 13, lineHeight: 18, fontWeight: "600" } });
