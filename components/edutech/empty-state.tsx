import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ComponentProps, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useEduTheme } from "@/lib/edutech/theme-context";
type IconName = ComponentProps<typeof MaterialIcons>["name"];
export function EmptyState({ icon, title, description }: { icon: IconName; title: string; description: string }) { const { colors } = useEduTheme(); const styles = useMemo(() => createStyles(colors), [colors]); return <View style={styles.card}><View style={styles.iconBox}><MaterialIcons name={icon} size={27} color={colors.primary} /></View><Text style={styles.title}>{title}</Text><Text style={styles.description}>{description}</Text></View>; }
const createStyles = (colors: ReturnType<typeof useEduTheme>["colors"]) => StyleSheet.create({ card: { alignItems: "center", backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 20, paddingVertical: 26, paddingHorizontal: 20 }, iconBox: { width: 54, height: 54, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: colors.primarySoft, marginBottom: 14 }, title: { color: colors.text, fontSize: 16, lineHeight: 21, fontWeight: "800", textAlign: "center" }, description: { color: colors.muted, fontSize: 14, lineHeight: 20, textAlign: "center", marginTop: 7 } });
