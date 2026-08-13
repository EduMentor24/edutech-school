import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { EmptyState } from "@/components/edutech/empty-state";
import { PrimaryButton } from "@/components/edutech/primary-button";
import { useEduTheme } from "@/lib/edutech/theme-context";

export function CourseLoading({ label = "Chargement des cours" }: { label?: string }) { const { colors } = useEduTheme(); return <View style={styles.center}><ActivityIndicator color={colors.primary} /><Text style={[styles.loadingLabel, { color: colors.muted }]}>{label}</Text></View>; }
export function CourseError({ message, onRetry }: { message: string; onRetry: () => void }) { return <View style={styles.feedback}><EmptyState icon="error-outline" title="Impossible de charger ce contenu" description={message} /><PrimaryButton label="Réessayer" onPress={onRetry} /></View>; }
export function CourseEmpty({ title, description, actionLabel, onAction }: { title: string; description: string; actionLabel?: string; onAction?: () => void }) { return <View style={styles.feedback}><EmptyState icon="menu-book" title={title} description={description} />{actionLabel && onAction ? <PrimaryButton label={actionLabel} variant="secondary" onPress={onAction} /> : null}</View>; }
export function CourseRowIcon({ index }: { index: number }) { const { colors } = useEduTheme(); return <View style={[styles.rowIcon, { backgroundColor: colors.primarySoft }]}><MaterialIcons name="menu-book" size={20} color={colors.primary} /><Text style={[styles.rowIndex, { color: colors.primary }]}>{index + 1}</Text></View>; }
const styles = StyleSheet.create({ center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }, loadingLabel: { fontSize: 14, fontWeight: "700" }, feedback: { flex: 1, justifyContent: "center", gap: 24, paddingBottom: 22 }, rowIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" }, rowIndex: { fontSize: 10, lineHeight: 12, fontWeight: "900", marginTop: -1 } });
