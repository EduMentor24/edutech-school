import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { calculateCoefficientMatrixTotal, calculateSubjectAverage, calculateTermAverage } from "../lib/bulletin/bulletin-model";

const root = resolve(__dirname, "..");
const importScript = JSON.parse(readFileSync(resolve(root, "commande15_import.json"), "utf8")) as { query: string };
const bulletinService = readFileSync(resolve(root, "lib/bulletin/bulletin-service.ts"), "utf8");

const matrixTotal = (mandatory: number[], optional: number) => calculateCoefficientMatrixTotal([
  ...mandatory.map((coefficient) => ({ coefficient, coefficientVerified: true })),
  { coefficient: optional, coefficientVerified: true, isOptional: true },
  { coefficient: optional, coefficientVerified: true, isOptional: true },
]);

describe("Commande 15 — Finalisation Première", () => {
  it("reconstruit exactement 6 thèmes et 11 leçons SVT pour Première C", () => {
    expect((importScript.query.match(/\('C', 'Sciences de la Vie et de la Terre \(C\)', \d,/g) ?? []).length).toBe(17);
    expect(importScript.query).toContain("('C', 'Sciences de la Vie et de la Terre (C)', 6, 1, 'L’écosystème naturel et l’écosystème agro-industriel')");
  });

  it("reconstruit exactement 6 thèmes et 13 leçons SVT pour Première D", () => {
    expect((importScript.query.match(/\('D', 'Sciences de la Vie et de la Terre \(D\)', \d,/g) ?? []).length).toBe(19);
    expect(importScript.query).toContain("('D', 'Sciences de la Vie et de la Terre (D)', 6, 3, 'L’absorption des nutriments')");
  });

  it("laisse les leçons SVT vides, inactives et les offres non publiées", () => {
    expect(importScript.query).toContain("SET is_published = false");
    expect(importScript.query).toContain("SELECT c.id, lesson_ref.title, '', '', lesson_ref.display_order, false, false");
  });

  it("conserve les coefficients détaillés et les totaux corrigés A1, A2, C et D", () => {
    expect(matrixTotal([4, 1, 1, 1, 4, 3, 3, 3, 1, 1], 3)).toBe(25);
    expect(matrixTotal([4, 1, 1, 1, 4, 3, 2, 3, 1, 1], 3)).toBe(24);
    expect(matrixTotal([2, 3, 2, 5, 2, 5, 2, 1], 2)).toBe(24);
    expect(matrixTotal([2, 3, 2, 4, 2, 4, 4, 1], 2)).toBe(24);
  });

  it("enregistre les coefficients Première pour 2026-2027 sans modifier les valeurs détaillées", () => {
    expect(importScript.query).toContain("'A1', 'Mathématiques', 3::numeric");
    expect(importScript.query).toContain("'A2', 'Mathématiques', 2::numeric");
    expect(importScript.query).toContain("'C', 'Physique-Chimie', 5::numeric");
    expect(importScript.query).toContain("'D', 'Sciences de la Vie et de la Terre (D)', 4::numeric");
    expect(importScript.query).toContain("'2026-2027'");
  });

  it("charge un coefficient annuel exact avant le coefficient Terminale historique de repli", () => {
    expect(bulletinService).toContain('.eq("school_year", schoolYear)');
    expect(bulletinService).toContain('.is("school_year", null)');
    expect(bulletinService).toContain("[...(legacyCoefficients ?? []), ...(annualCoefficients ?? [])]");
  });

  it("conserve le coefficient d’évaluation saisi par l’élève et calcule la moyenne de matière", () => {
    expect(calculateSubjectAverage([{ grade: 12, maxGrade: 20, assessmentCoefficient: 1, includeInAverage: true }, { grade: 16, maxGrade: 20, assessmentCoefficient: 2, includeInAverage: true }])).toBe(14.67);
  });

  it("exclut une matière sans note tout en gardant les trimestres distincts", () => {
    const t1 = calculateTermAverage([{ average: 12, coefficient: 4, coefficientVerified: true }, { average: null, coefficient: 3, coefficientVerified: true }]);
    const t2 = calculateTermAverage([{ average: 16, coefficient: 4, coefficientVerified: true }, { average: null, coefficient: 3, coefficientVerified: true }]);
    expect(t1.average).toBe(12);
    expect(t2.average).toBe(16);
    expect(t1.includedSubjectCount).toBe(1);
  });
});
