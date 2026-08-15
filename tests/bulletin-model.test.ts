import { describe, expect, it } from "vitest";
import { calculateSubjectAverage, calculateTermAverage, isValidSchoolYear, normalizedOutOfTwenty } from "../lib/bulletin/bulletin-model";

describe("modèle Bulletin", () => {
  it("calcule une moyenne de matière à partir des notes réelles et de leur barème", () => { expect(calculateSubjectAverage([{ grade: 10, maxGrade: 20, includeInAverage: true }, { grade: 24, maxGrade: 40, includeInAverage: true }])).toBe(11); expect(normalizedOutOfTwenty(24, 40)).toBe(12); });
  it("ne transforme jamais une matière sans note en zéro", () => { expect(calculateSubjectAverage([])).toBeNull(); expect(calculateSubjectAverage([{ grade: 10, maxGrade: 20, includeInAverage: false }])).toBeNull(); });
  it("applique la formule trimestrielle seulement aux coefficients vérifiés", () => { const result = calculateTermAverage([{ average: 10, coefficient: 2, coefficientVerified: true }, { average: 14, coefficient: 4, coefficientVerified: true }, { average: 19, coefficient: 5, coefficientVerified: false }, { average: null, coefficient: 3, coefficientVerified: true }]); expect(result.average).toBe(12.67); expect(result.includedSubjectCount).toBe(2); expect(result.excludedUnverifiedCoefficientCount).toBe(1); });
  it("conserve la validité d’une année scolaire consécutive", () => { expect(isValidSchoolYear("2026-2027")).toBe(true); expect(isValidSchoolYear("2026-2028")).toBe(false); });
});
