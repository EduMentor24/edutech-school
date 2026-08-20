export type AdminActivityFilterItem = {
  subjectId: string;
  subjectName: string;
  seriesId: string;
  seriesName: string;
};

export type ActivityFilterValue = "all" | string;

export function filterAdminActivities<T extends AdminActivityFilterItem>(
  items: T[],
  subjectId: ActivityFilterValue,
  seriesId: ActivityFilterValue,
): T[] {
  return items.filter(
    (item) =>
      (subjectId === "all" || item.subjectId === subjectId) &&
      (seriesId === "all" || item.seriesId === seriesId),
  );
}

export function activityFilterOptions<T extends AdminActivityFilterItem>(
  items: T[],
  dimension: "subject" | "series",
): Array<{ id: string; label: string }> {
  const seen = new Set<string>();
  return items
    .map((item) =>
      dimension === "subject"
        ? { id: item.subjectId, label: item.subjectName }
        : { id: item.seriesId, label: item.seriesName },
    )
    .filter((option) => {
      if (seen.has(option.id)) return false;
      seen.add(option.id);
      return true;
    })
    .sort((left, right) => left.label.localeCompare(right.label));
}
