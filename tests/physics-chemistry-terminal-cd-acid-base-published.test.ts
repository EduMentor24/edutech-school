import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import {
  appliedMigration,
  buildRecoveryAuditSummary,
  expectedAssessmentShape,
  originalOperationGuarantees,
  targetMatrix,
} from "../scripts/prepare-physics-chemistry-terminal-cd-acid-base-published-migration.mjs";

const trace = readFileSync("notes/physique-chimie-terminale-cd-acides-savon-ph-acidobasicite.md", "utf8");

describe("Physique-Chimie Terminale C/D — publication acides, savon, pH et acido-basicité", () => {
  it("trace exactement les six leçons C/D, avec les différences de titres et d’ordres connues", () => {
    expect(targetMatrix).toHaveLength(12);
    expect(targetMatrix.filter((target) => target.series === "C")).toHaveLength(6);
    expect(targetMatrix.filter((target) => target.series === "D")).toHaveLength(6);
    expect(targetMatrix).toContainEqual(expect.objectContaining({ series: "C", title: "Couples acide/base-Classification", order: 50 }));
    expect(targetMatrix).toContainEqual(expect.objectContaining({ series: "D", title: "Couples acide/base - Classification", order: 50 }));
    expect(targetMatrix).toContainEqual(expect.objectContaining({ series: "C", chapter: "CHIMIE ORGANIQUE", title: "Fabrication d’un savon", order: 40 }));
    expect(targetMatrix).toContainEqual(expect.objectContaining({ series: "D", chapter: "CHIMIE ORGANIQUE", title: "Fabrication d’un savon", order: 60 }));
  });

  it("conserve le contrat d’évaluation active et publiée de chaque leçon", () => {
    expect(expectedAssessmentShape).toMatchObject({
      exercises: 2,
      publishedExercises: 2,
      exerciseQuestions: 8,
      quizzes: 2,
      publishedQuizzes: 2,
      quizQuestions: 8,
      quizAnswers: 24,
    });
    expect(buildRecoveryAuditSummary().aggregate).toEqual({
      lessons: 12,
      exercises: 24,
      exerciseQuestions: 96,
      quizzes: 24,
      quizQuestions: 96,
      quizAnswers: 288,
    });
  });

  it("documente que l’opération est déjà appliquée et ne peut pas être rejouée", () => {
    expect(appliedMigration).toMatchObject({
      name: "physics_chemistry_terminal_cd_acid_base_published",
      version: "20260824144926",
      status: "already_applied_do_not_replay",
    });
    expect(appliedMigration.doDelimiter).not.toBe(appliedMigration.contentDelimiter);
    expect(originalOperationGuarantees).toContain("écrasement interdit lorsque le contenu d’une leçon était déjà non vide");
    expect(originalOperationGuarantees).toContain("duplication interdite lorsqu’un exercice ou quiz existait déjà");
    expect(trace).toContain("ne doit **jamais** être rejouée");
  });
});
