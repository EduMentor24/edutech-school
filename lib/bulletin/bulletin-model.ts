export const bulletinTerms = ["T1", "T2", "T3"] as const;
export type BulletinTerm = (typeof bulletinTerms)[number];
export const assessmentTypes = ["devoir_classe", "interrogation", "composition", "examen", "autre"] as const;
export type AssessmentType = (typeof assessmentTypes)[number];

export const termLabel = (term: BulletinTerm) => term === "T1" ? "1er trimestre" : term === "T2" ? "2e trimestre" : "3e trimestre";
export const assessmentTypeLabel = (type: AssessmentType) => ({ devoir_classe: "Devoir de classe", interrogation: "Interrogation", composition: "Composition", examen: "Examen", autre: "Autre" })[type];
export const formatAverage = (value: number | null) => value === null ? "Non évalué" : `${value.toLocaleString("fr-FR", { maximumFractionDigits: 2 })}/20`;
export const normalizedOutOfTwenty = (grade: number, maxGrade: number) => maxGrade > 0 ? (grade / maxGrade) * 20 : null;
export const roundGrade = (value: number) => Math.round(value * 100) / 100;

export type BulletinCalculationGrade = { grade: number; maxGrade: number; includeInAverage: boolean };
export type SubjectAverageInput = { average: number | null; coefficient: number | null; coefficientVerified: boolean };

export function calculateSubjectAverage(grades: BulletinCalculationGrade[]): number | null {
  const values = grades.filter((item) => item.includeInAverage).map((item) => normalizedOutOfTwenty(item.grade, item.maxGrade)).filter((value): value is number => value !== null);
  if (!values.length) return null;
  return roundGrade(values.reduce((sum, value) => sum + value, 0) / values.length);
}

export function calculateTermAverage(subjects: SubjectAverageInput[]) {
  const included = subjects.filter((subject) => subject.average !== null && subject.coefficientVerified && subject.coefficient !== null && subject.coefficient > 0) as Array<{ average: number; coefficient: number; coefficientVerified: true }>;
  if (!included.length) return { average: null, includedSubjectCount: 0, excludedUnverifiedCoefficientCount: subjects.filter((subject) => subject.average !== null && !subject.coefficientVerified).length };
  const denominator = included.reduce((sum, subject) => sum + subject.coefficient, 0);
  return { average: roundGrade(included.reduce((sum, subject) => sum + subject.average * subject.coefficient, 0) / denominator), includedSubjectCount: included.length, excludedUnverifiedCoefficientCount: subjects.filter((subject) => subject.average !== null && !subject.coefficientVerified).length };
}

export function isValidSchoolYear(value: string) { return /^\d{4}-\d{4}$/.test(value) && Number(value.slice(0, 4)) + 1 === Number(value.slice(5, 9)); }
