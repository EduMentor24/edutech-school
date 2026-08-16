export const bulletinTerms = ["T1", "T2", "T3"] as const;
export type BulletinTerm = (typeof bulletinTerms)[number];
export const assessmentTypes = ["devoir_classe", "devoir_niveau", "interrogation", "interrogation_ecrite", "interrogation_orale", "composition", "examen", "bonus", "autre"] as const;
export type AssessmentType = (typeof assessmentTypes)[number];

export const termLabel = (term: BulletinTerm) => term === "T1" ? "1er trimestre" : term === "T2" ? "2e trimestre" : "3e trimestre";
export const assessmentTypeLabel = (type: AssessmentType) => ({ devoir_classe: "Devoir de classe", devoir_niveau: "Devoir de niveau", interrogation: "Interrogation", interrogation_ecrite: "Interrogation écrite", interrogation_orale: "Interrogation orale", composition: "Composition", examen: "Examen", bonus: "Bonus", autre: "Autre" })[type];
export const formatAverage = (value: number | null) => value === null ? "Non évalué" : `${value.toLocaleString("fr-FR", { maximumFractionDigits: 2 })}/20`;
export const normalizedOutOfTwenty = (grade: number, maxGrade: number) => maxGrade > 0 ? (grade / maxGrade) * 20 : null;
export const roundGrade = (value: number) => Math.round(value * 100) / 100;

export type BulletinCalculationGrade = { grade: number; maxGrade: number; includeInAverage: boolean; assessmentCoefficient?: number };
export type SubjectAverageInput = { average: number | null; coefficient: number | null; coefficientVerified: boolean };

export function calculateSubjectAverage(grades: BulletinCalculationGrade[]): number | null {
  const values = grades.flatMap((item) => { const normalized = normalizedOutOfTwenty(item.grade, item.maxGrade); const coefficient = item.assessmentCoefficient ?? 1; return item.includeInAverage && normalized !== null && coefficient > 0 ? [{ normalized, coefficient }] : []; });
  if (!values.length) return null;
  const denominator = values.reduce((sum, item) => sum + item.coefficient, 0);
  return denominator > 0 ? roundGrade(values.reduce((sum, item) => sum + item.normalized * item.coefficient, 0) / denominator) : null;
}

export function calculateTermAverage(subjects: SubjectAverageInput[]) {
  const included = subjects.filter((subject) => subject.average !== null && subject.coefficientVerified && subject.coefficient !== null && subject.coefficient > 0) as Array<{ average: number; coefficient: number; coefficientVerified: true }>;
  if (!included.length) return { average: null, includedSubjectCount: 0, excludedUnverifiedCoefficientCount: subjects.filter((subject) => subject.average !== null && !subject.coefficientVerified).length };
  const denominator = included.reduce((sum, subject) => sum + subject.coefficient, 0);
  return { average: roundGrade(included.reduce((sum, subject) => sum + subject.average * subject.coefficient, 0) / denominator), includedSubjectCount: included.length, excludedUnverifiedCoefficientCount: subjects.filter((subject) => subject.average !== null && !subject.coefficientVerified).length };
}

export function isValidSchoolYear(value: string) { return /^\d{4}-\d{4}$/.test(value) && Number(value.slice(0, 4)) + 1 === Number(value.slice(5, 9)); }
