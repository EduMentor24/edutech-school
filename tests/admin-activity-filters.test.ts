import { describe, expect, it } from "vitest";
import { activityFilterOptions, filterAdminActivities } from "../lib/admin/admin-activity-filters";

const items = [
  { id: "math-a1", subjectId: "math", subjectName: "Mathématiques", seriesId: "a1", seriesName: "A1" },
  { id: "history-a1", subjectId: "history", subjectName: "Histoire-Géographie", seriesId: "a1", seriesName: "A1" },
  { id: "history-c", subjectId: "history", subjectName: "Histoire-Géographie", seriesId: "c", seriesName: "C" },
];

describe("filtres administratifs des activités", () => {
  it("propose les matières et séries réellement présentes", () => {
    expect(activityFilterOptions(items, "subject")).toEqual([{ id: "history", label: "Histoire-Géographie" }, { id: "math", label: "Mathématiques" }]);
    expect(activityFilterOptions(items, "series")).toEqual([{ id: "a1", label: "A1" }, { id: "c", label: "C" }]);
  });

  it("filtre une activité par matière et série sans altérer la liste source", () => {
    expect(filterAdminActivities(items, "history", "a1").map((item) => item.id)).toEqual(["history-a1"]);
    expect(items).toHaveLength(3);
  });

  it("réinitialise chaque dimension avec la valeur toutes", () => {
    expect(filterAdminActivities(items, "all", "c").map((item) => item.id)).toEqual(["history-c"]);
    expect(filterAdminActivities(items, "history", "all").map((item) => item.id)).toEqual(["history-a1", "history-c"]);
  });
});
