import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { AdminChoice } from "@/components/edutech/admin-ui";
import { activityFilterOptions, type ActivityFilterValue, type AdminActivityFilterItem } from "@/lib/admin/admin-activity-filters";
import { useEduTheme } from "@/lib/edutech/theme-context";

type AdminActivityFiltersProps<T extends AdminActivityFilterItem> = {
  items: T[];
  subjectId: ActivityFilterValue;
  seriesId: ActivityFilterValue;
  onSelectSubject: (value: ActivityFilterValue) => void;
  onSelectSeries: (value: ActivityFilterValue) => void;
};

/** Filtres réservés aux écrans Administration → Exercices et Administration → Quiz. */
export function AdminActivityFilters<T extends AdminActivityFilterItem>({
  items,
  subjectId,
  seriesId,
  onSelectSubject,
  onSelectSeries,
}: AdminActivityFiltersProps<T>) {
  const { colors } = useEduTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const subjects = activityFilterOptions(items, "subject");
  const series = activityFilterOptions(items, "series");

  return (
    <View style={styles.root} accessibilityLabel="Filtres administratifs par matière et série">
      <Text style={styles.label}>Matière</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.choices}>
        <AdminChoice label="Toutes" selected={subjectId === "all"} onPress={() => onSelectSubject("all")} />
        {subjects.map((subject) => (
          <AdminChoice key={subject.id} label={subject.label} selected={subject.id === subjectId} onPress={() => onSelectSubject(subject.id)} />
        ))}
      </ScrollView>

      <Text style={styles.label}>Série</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.choices}>
        <AdminChoice label="Toutes" selected={seriesId === "all"} onPress={() => onSelectSeries("all")} />
        {series.map((seriesOption) => (
          <AdminChoice key={seriesOption.id} label={seriesOption.label} selected={seriesOption.id === seriesId} onPress={() => onSelectSeries(seriesOption.id)} />
        ))}
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useEduTheme>["colors"]) =>
  StyleSheet.create({
    root: { gap: 8 },
    label: { color: colors.muted, fontSize: 12, lineHeight: 17, fontWeight: "800", marginTop: 2 },
    choices: { gap: 8, paddingRight: 20 },
  });
