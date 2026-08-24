import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { parseLessonMarkdown } from "../lib/lessons/markdown-parser";

const root = resolve(import.meta.dirname, "..");
const script = readFileSync(resolve(root, "scripts/prepare-physics-chemistry-terminal-c-electromagnetism-published-migration.mjs"), "utf8");

describe("dernier lot Physique-Chimie électromagnétisme Terminale C", () => {
  it("limite le lot à Terminale C et aux trois leçons sources existantes", () => {
    expect(script).toContain("series.name='C'");
    for (const title of ["Champ magnétique", "Loi de Laplace", "Auto-induction"]) expect(script).toContain(title);
    expect(script).toContain("écrasement interdit");
    expect(script).toContain("duplication interdite");
  });

  it("prévoit deux exercices et deux quiz actifs par leçon", () => {
    expect(script).toContain("is_published,is_active,is_test_data");
    expect(script).toContain("true,true,false");
    expect(script).toContain('quizSql(quizA, lesson, "A — Notions"');
    expect(script).toContain('quizSql(quizB, lesson, "B — Méthodes"');
  });

  it("reconnaît le simulateur de trajectoire et les schémas de forces", () => {
    const blocks = parseLessonMarkdown(":::trajectory-simulator-uniform-fields\n:::force-diagram-projectile\n:::force-diagram-laplace");
    expect(blocks).toEqual([{ type: "trajectory_simulator" }, { type: "force_diagram", diagram: "projectile" }, { type: "force_diagram", diagram: "laplace" }]);
    expect(script).toContain(":::force-diagram-solid");
    expect(script).toContain(":::force-diagram-satellite");
    expect(script).toContain(":::force-diagram-oscillator");
  });
});
