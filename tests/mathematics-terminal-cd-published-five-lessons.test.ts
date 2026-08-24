import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");
const script = resolve(root, "scripts/prepare-mathematics-terminal-cd-published-five-lessons-migration.mjs");
const output = resolve(root, "supabase/migrations/20260824_mathematics_terminal_cd_published_five_lessons.sql");

describe("lot publié Mathématiques Terminale C/D — logarithmes, PPCM, suites, isométries et intégrale", () => {
  it("génère une migration protégée qui publie les contenus demandés sans écraser le calcul intégral C", () => {
    execFileSync(process.execPath, [script], { cwd: root });
    const sql = readFileSync(output, "utf8");
    expect(sql).toContain("Les deux offres officielles Mathématiques Terminale C et D sont requises.");
    expect(sql).toContain("Fonction logarithme népérien");
    expect(sql).toContain("Fonctions logarithmes");
    expect(sql).toContain("PPCM et PGCD de deux entiers relatifs");
    expect(sql).toContain("Suites numériques");
    expect(sql).toContain("Isométries du plan");
    expect(sql).toContain("Calcul intégral");
    expect(sql).toContain("La leçon de calcul intégral C ne doit pas être remplacée");
    expect(sql).toContain("écrasement interdit");
    expect(sql).toContain("duplication interdite");
    expect(sql).toContain("is_published,is_active,is_test_data");
    expect(sql).toContain(",true,true,18,10,false");
    expect(sql).toContain(",true,true,false) returning id into quiz_a_");
    expect(sql).toContain("update public.course_subject_offerings set is_published=true");
    expect(sql).toContain("update public.chapters set is_active=true");
    expect(sql).toContain("not exercise.is_test_data");
    expect(sql).toContain("not quiz.is_test_data");
  });
});
