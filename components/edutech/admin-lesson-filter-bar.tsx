import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AdminChoice } from "@/components/edutech/admin-ui";
import { AdminOfferingOption } from "@/lib/admin/course-admin-service";
import { selectLessonOffering, uniqueCatalogValues } from "@/lib/admin/lesson-catalog-filters";
import { useEduTheme } from "@/lib/edutech/theme-context";

type StatusFilter = "all" | "active" | "inactive";

type AdminLessonFiltersProps = {
  offerings: AdminOfferingOption[];
  selectedOfferingId: string | null;
  onSelectOffering: (offeringId: string | null) => void;
  status: StatusFilter;
  onSelectStatus: (status: StatusFilter) => void;
};

/** Filtrage de catalogue réservé à l’écran Administration → Leçons. */
export function AdminLessonFilters({
  offerings,
  selectedOfferingId,
  onSelectOffering,
  status,
  onSelectStatus,
}: AdminLessonFiltersProps) {
  const { colors } = useEduTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const selected = offerings.find((offering) => offering.id === selectedOfferingId) ?? null;
  const levels = uniqueCatalogValues(offerings, "levelName");
  const series = uniqueCatalogValues(
    offerings.filter((offering) => offering.levelName === selected?.levelName),
    "seriesName",
  );
  const subjects = uniqueCatalogValues(
    offerings.filter(
      (offering) =>
        offering.levelName === selected?.levelName && offering.seriesName === selected?.seriesName,
    ),
    "subjectName",
  );

  const apply = (dimension: "level" | "series" | "subject", value: string) => {
    onSelectOffering(selectLessonOffering(offerings, selectedOfferingId, dimension, value));
  };

  return (
    <View style={styles.root} accessibilityLabel="Filtres administratifs des leçons">
      <Text style={styles.label}>Niveau</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.choices}>
        {levels.map((level) => (
          <AdminChoice key={level} label={level} selected={selected?.levelName === level} onPress={() => apply("level", level)} />
        ))}
      </ScrollView>

      <Text style={styles.label}>Série</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.choices}>
        {series.map((item) => (
          <AdminChoice key={item} label={item} selected={selected?.seriesName === item} onPress={() => apply("series", item)} />
        ))}
      </ScrollView>

      <Text style={styles.label}>Matière</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.choices}>
        {subjects.map((subject) => (
          <AdminChoice key={subject} label={subject} selected={selected?.subjectName === subject} onPress={() => apply("subject", offerings.find((offering) => offering.subjectName === subject && offering.levelName === selected?.levelName && offering.seriesName === selected?.seriesName)?.subjectId ?? "")} />
        ))}
      </ScrollView>

      <Text style={styles.label}>État</Text>
      <View style={styles.statuses}>
        <AdminChoice label="Tous" selected={status === "all"} onPress={() => onSelectStatus("all")} />
        <AdminChoice label="Actifs" selected={status === "active"} onPress={() => onSelectStatus("active")} />
        <AdminChoice label="Brouillons" selected={status === "inactive"} onPress={() => onSelectStatus("inactive")} />
      </View>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useEduTheme>["colors"]) =>
  StyleSheet.create({
    root: { gap: 8 },
    label: { color: colors.muted, fontSize: 12, lineHeight: 17, fontWeight: "800", marginTop: 4 },
    choices: { gap: 8, paddingRight: 20 },
    statuses: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  });
