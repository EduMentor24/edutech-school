import { useRouter } from "expo-router";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppScreen } from "@/components/edutech/app-screen";
import { BrandMark } from "@/components/edutech/brand-mark";
import { EmptyState } from "@/components/edutech/empty-state";
import { PrimaryButton } from "@/components/edutech/primary-button";
import { useEduTheme } from "@/lib/edutech/theme-context";
export default function RegisterScreen() { const router = useRouter(); const { colors } = useEduTheme(); const styles = useMemo(() => createStyles(colors), [colors]); return <AppScreen edges={["top", "bottom", "left", "right"]}><View style={styles.content}><BrandMark /><View><Text style={styles.title}>Créer un compte</Text><Text style={styles.subtitle}>Votre inscription sera disponible dès que l’authentification sécurisée sera reliée.</Text></View><EmptyState icon="person-add-alt-1" title="Inscription en préparation" description="Aucun compte n’est créé pendant cette étape de fondation." /><PrimaryButton label="Retour à la connexion" onPress={() => router.replace("/auth/login")} /></View></AppScreen>; }
const createStyles = (colors: ReturnType<typeof useEduTheme>["colors"]) => StyleSheet.create({ content: { flex: 1, justifyContent: "space-between", paddingVertical: 26 }, title: { color: colors.text, fontSize: 29, lineHeight: 36, fontWeight: "800", letterSpacing: -0.6 }, subtitle: { color: colors.muted, fontSize: 15, lineHeight: 22, marginTop: 7 } });

