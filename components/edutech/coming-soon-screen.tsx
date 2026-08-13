import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { ComponentProps, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { AppScreen } from "@/components/edutech/app-screen";
import { EmptyState } from "@/components/edutech/empty-state";
import { PageHeader } from "@/components/edutech/page-header";
import { PrimaryButton } from "@/components/edutech/primary-button";
import { useEduTheme } from "@/lib/edutech/theme-context";
type IconName = ComponentProps<typeof MaterialIcons>["name"];
export function ComingSoonScreen({ title, subtitle, icon, description, actionLabel = "Retour à l’accueil", actionRoute = "/(tabs)" }: { title: string; subtitle: string; icon: IconName; description: string; actionLabel?: string; actionRoute?: "/(tabs)" | "/(tabs)/profile" }) { const router = useRouter(); const { colors } = useEduTheme(); const styles = useMemo(() => createStyles(colors), [colors]); return <AppScreen edges={["top", "bottom", "left", "right"]}><View style={styles.content}><View><PageHeader title={title} subtitle={subtitle} back /><EmptyState icon={icon} title="Disponible prochainement" description={description} /></View><PrimaryButton label={actionLabel} onPress={() => router.replace(actionRoute)} /></View></AppScreen>; }
const createStyles = (_colors: ReturnType<typeof useEduTheme>["colors"]) => StyleSheet.create({ content: { flex: 1, justifyContent: "space-between", paddingVertical: 18 } });
