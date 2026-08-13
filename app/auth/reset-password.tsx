import { useRouter } from "expo-router";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { AppScreen } from "@/components/edutech/app-screen";
import { EmptyState } from "@/components/edutech/empty-state";
import { PageHeader } from "@/components/edutech/page-header";
import { PrimaryButton } from "@/components/edutech/primary-button";
import { useEduTheme } from "@/lib/edutech/theme-context";
export default function ResetPasswordScreen() { const router = useRouter(); const { colors } = useEduTheme(); const styles = useMemo(() => createStyles(colors), [colors]); return <AppScreen edges={["top", "bottom", "left", "right"]}><View style={styles.content}><View><PageHeader title="Réinitialiser le mot de passe" subtitle="Cet écran recevra le lien sécurisé de récupération." back /><EmptyState icon="verified-user" title="Lien sécurisé requis" description="La réinitialisation sera activée avec Supabase Auth et un jeton valide." /></View><PrimaryButton label="Retour à la connexion" onPress={() => router.replace("/auth/login")} /></View></AppScreen>; }
const createStyles = (_colors: ReturnType<typeof useEduTheme>["colors"]) => StyleSheet.create({ content: { flex: 1, justifyContent: "space-between", paddingVertical: 18 } });
