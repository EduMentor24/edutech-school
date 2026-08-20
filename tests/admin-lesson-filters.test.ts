import { describe, expect, it } from "vitest";
import { selectLessonOffering, uniqueCatalogValues } from "../lib/admin/lesson-catalog-filters";

const offerings = [
  { id: "t-a1-maths", subjectId: "maths", subjectName: "Mathématiques", levelName: "Terminale", seriesName: "A1" },
  { id: "t-a2-maths", subjectId: "maths", subjectName: "Mathématiques", levelName: "Terminale", seriesName: "A2" },
  { id: "t-c-maths", subjectId: "maths", subjectName: "Mathématiques", levelName: "Terminale", seriesName: "C" },
  { id: "t-c-history", subjectId: "history", subjectName: "Histoire-Géographie", levelName: "Terminale", seriesName: "C" },
  { id: "p-c-maths", subjectId: "maths", subjectName: "Mathématiques", levelName: "Première", seriesName: "C" },
] as any;

describe("filtres administratifs des leçons", () => {
  it("expose les séries réelles de la progression", () => {
    expect(uniqueCatalogValues(offerings, "seriesName")).toEqual(["A1", "A2", "C"]);
  });

  it("conserve la matière quand la série demandée possède une offre correspondante", () => {
    expect(selectLessonOffering(offerings, "t-a1-maths", "series", "C")).toBe("t-c-maths");
  });

  it("bascule sur la matière sélectionnée sans modifier niveau ni série", () => {
    expect(selectLessonOffering(offerings, "t-c-maths", "subject", "history")).toBe("t-c-history");
  });

  it("conserve série et matière quand le niveau équivalent existe", () => {
    expect(selectLessonOffering(offerings, "t-c-maths", "level", "Première")).toBe("p-c-maths");
  });
});
