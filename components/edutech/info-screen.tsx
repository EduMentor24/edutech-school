import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AppScreen } from "@/components/edutech/app-screen";
import { PageHeader } from "@/components/edutech/page-header";
import { useEduTheme } from "@/lib/edutech/theme-context";
export function InfoScreen({ title, subtitle, body, footer }: { title: string; subtitle: string; body: string; footer?: string }) { const { colors } = useEduTheme(); const styles = useMemo(() => createStyles(colors), [colors]); return <AppScreen withPadding={false}><ScrollView contentContainerStyle={styles.scroll}><View style={styles.content}><PageHeader title={title} subtitle={subtitle} back /><View style={styles.card}><Text style={styles.body}>{body}</Text>{footer ? <Text style={styles.footer}>{footer}</Text> : null}</View></View></ScrollView></AppScreen>; }
const createStyles = (colors: ReturnType<typeof useEduTheme>["colors"]) => StyleSheet.create({ scroll: { flexGrow: 1 }, content: { padding: 20 }, card: { padding: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, borderRadius: 18 }, body: { color: colors.muted, fontSize: 15, lineHeight: 23 }, footer: { marginTop: 20, paddingTop: 14, borderTopWidth: 1, borderTopColor: colors.border, color: colors.primary, fontSize: 12, lineHeight: 18, fontWeight: "800", textAlign: "right" } });
