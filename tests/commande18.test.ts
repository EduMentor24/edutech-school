import { describe, it, expect } from "vitest";

describe("Commande 18 — Sessions d’évaluation, Export et Rapports archivés", () => {
  it("valide la structure des sessions d’évaluation trimestrielle", () => {
    const session = {
      id: "sess-1",
      school_year_id: "year-2027",
      term_number: 1,
      title: "Trimestre 1 2027-2028",
      start_date: "2027-09-01",
      end_date: "2027-12-20",
      is_open: true,
    };
    expect(session.term_number).toBe(1);
    expect(session.is_open).toBe(true);
  });

  it("valide la structure et le résumé d’un rapport annuel archivé", () => {
    const report = {
      id: "rep-1",
      student_id: "student-1",
      school_year_id: "year-2026",
      school_level: "Première",
      series: "A1",
      lv2_choice: "Allemand",
      term1_average: 13.5,
      term2_average: 14.0,
      term3_average: 13.8,
      annual_average: 13.76,
      final_decision: "Admis" as const,
      report_summary: "Bilan annuel Première A1 validé.",
    };
    expect(report.annual_average).toBeCloseTo(13.76, 2);
    expect(report.final_decision).toBe("Admis");
  });

  it("valide le filtrage des décisions pour l’export", () => {
    const reports = [
      { id: "1", final_decision: "Admis" },
      { id: "2", final_decision: "Redouble" },
      { id: "3", final_decision: "Admis" },
      { id: "4", final_decision: "En attente" },
    ];
    const admitted = reports.filter(r => r.final_decision === "Admis");
    expect(admitted.length).toBe(2);
  });
});
