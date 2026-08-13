import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { AppScreen } from "@/components/edutech/app-screen";
import { BrandMark } from "@/components/edutech/brand-mark";
import { useEduTheme } from "@/lib/edutech/theme-context";

export function AuthLoadingScreen() {
  const { colors } = useEduTheme();
  return <AppScreen edges={["top", "bottom", "left", "right"]}><View style={styles.content}><View style={styles.brand}><BrandMark /><Text style={[styles.title, { color: colors.text }]}>EduTech School</Text><Text style={[styles.copy, { color: colors.muted }]}>Vérification sécurisée de votre session</Text></View><View style={styles.loading}><ActivityIndicator color={colors.primary} /><Text style={[styles.loadingText, { color: colors.muted }]}>Préparation de votre espace</Text></View></View></AppScreen>;
}

const styles = StyleSheet.create({ content: { flex: 1, justifyContent: "space-between", paddingVertical: 54 }, brand: { alignItems: "center", gap: 9, marginTop: 92 }, title: { fontSize: 29, lineHeight: 35, fontWeight: "800", marginTop: 9 }, copy: { fontSize: 14, lineHeight: 20, textAlign: "center" }, loading: { alignItems: "center", gap: 10 }, loadingText: { fontSize: 13, lineHeight: 18, fontWeight: "600" } });
