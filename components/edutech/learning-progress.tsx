import { StyleSheet, Text, View } from "react-native";

import { LessonProgressStatus } from "@/lib/progress/learning-progress-model";
import { useEduTheme } from "@/lib/edutech/theme-context";

export function ProgressBar({ percentage }: { percentage: number }) {
  const { colors } = useEduTheme();
  const safePercentage = Math.max(0, Math.min(100, percentage));
  return <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: safePercentage }} style={[styles.track, { backgroundColor: colors.surfaceMuted }]}><View style={[styles.fill, { width: `${safePercentage}%`, backgroundColor: colors.primary }]} /></View>;
}

export function ProgressSummary({ completed, total, percentage }: { completed: number; total: number; percentage: number }) {
  const { colors } = useEduTheme();
  if (total === 0) return <Text style={[styles.pending, { color: colors.muted }]}>Contenu à venir</Text>;
  return <View style={styles.summary}><View style={styles.summaryRow}><Text style={[styles.count, { color: colors.text }]}>{completed} / {total} leçons terminées</Text><Text style={[styles.percentage, { color: colors.primary }]}>{percentage} %</Text></View><ProgressBar percentage={percentage} /></View>;
}

export function LessonStatusBadge({ status }: { status: LessonProgressStatus }) {
  const { colors } = useEduTheme();
  if (status === "completed") return <View style={[styles.badge, { backgroundColor: colors.primarySoft }]}><Text style={[styles.badgeLabel, { color: colors.primary }]}>Terminée</Text></View>;
  if (status === "in_progress") return <View style={[styles.badge, { backgroundColor: colors.warningSoft }]}><Text style={[styles.badgeLabel, { color: colors.warning }]}>En cours</Text></View>;
  return <View style={[styles.badge, { backgroundColor: colors.surfaceMuted }]}><Text style={[styles.badgeLabel, { color: colors.muted }]}>À commencer</Text></View>;
}

const styles = StyleSheet.create({
  summary: { marginTop: 12, gap: 7 },
  summaryRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  count: { fontSize: 12, lineHeight: 17, fontWeight: "700" },
  percentage: { fontSize: 13, lineHeight: 18, fontWeight: "900" },
  track: { height: 7, overflow: "hidden", borderRadius: 99 },
  fill: { height: "100%", borderRadius: 99 },
  pending: { fontSize: 12, lineHeight: 17, fontWeight: "700", marginTop: 8 },
  badge: { alignSelf: "flex-start", borderRadius: 99, paddingHorizontal: 8, paddingVertical: 4, marginTop: 7 },
  badgeLabel: { fontSize: 10, lineHeight: 13, fontWeight: "900" },
});
