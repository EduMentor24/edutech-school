import { useRouter } from "expo-router";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { AppScreen } from "@/components/edutech/app-screen";
import { EmptyState } from "@/components/edutech/empty-state";
import { PageHeader } from "@/components/edutech/page-header";
import { PrimaryButton } from "@/components/edutech/primary-button";
import { useEduTheme } from "@/lib/edutech/theme-context";
export default function ForgotPasswordScreen() { const router = useRouter(); const { colors } = useEduTheme(); const styles = useMemo(() => createStyles(colors), [colors]); return <AppScreen edges={["top", "bottom", "left", "right"]}><View style={styles.content}><View><PageHeader title="Mot de passe oublié" subtitle="Le parcours sécurisé sera relié au service d’authentification." back /><EmptyState icon="lock-reset" title="Réinitialisation bientôt disponible" description="Aucun e-mail n’est envoyé tant que Supabase Auth n’est pas connecté." /></View><View style={styles.actions}><PrimaryButton label="Voir l’étape de réinitialisation" variant="secondary" onPress={() => router.push("/auth/reset-password")} /><PrimaryButton label="Retour à la connexion" onPress={() => router.replace("/auth/login")} /></View></View></AppScreen>; }
const createStyles = (_colors: ReturnType<typeof useEduTheme>["colors"]) => StyleSheet.create({ content: { flex: 1, justifyContent: "space-between", paddingVertical: 18 }, actions: { gap: 11 } });
