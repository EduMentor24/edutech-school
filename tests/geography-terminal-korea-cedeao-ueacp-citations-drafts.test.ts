import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const migration = readFileSync(resolve(process.cwd(), "supabase/migrations/20260820_geographie_terminale_coree_cedeao_ueacp_citations_drafts.sql"), "utf8");

describe("brouillons Géographie Terminale Corée-CEDEAO-UE/ACP et citations", () => {
  it("protège les douze leçons ciblées et crée les thèmes scientifiques dans l’ordre", () => {
    expect(migration).toContain("THÈME 2 — LA CORÉE DU SUD : UN EXEMPLE DE PAYS ÉMERGENT");
    expect(migration).toContain("THÈME 3 — REGROUPEMENT ET COOPÉRATION ÉCONOMIQUE");
    expect(migration).toContain("60,false,false");
    expect(migration).toContain("70,false,false");
    expect(migration).toContain("if expected_count <> 12");
    expect(migration).toContain("Écrasement interdit");
  });

  it("sépare les cours, exercices et quiz, tous en brouillon", () => {
    expect(migration).toContain("update public.lessons");
    expect(migration).toContain("insert into public.exercises");
    expect(migration).toContain("insert into public.exercise_questions");
    expect(migration).toContain("insert into public.quizzes");
    expect(migration).toContain("insert into public.quiz_questions");
    expect(migration).toContain("insert into public.quiz_answers");
    expect(migration).toContain("false,false");
  });

  it("ajoute dix citations nouvelles, sourcées et ciblées par matière", () => {
    for (const subject of ["Français", "Philosophie", "Histoire-Géographie", "Physique-Chimie"]) {
      expect(migration.match(new RegExp(`\\('${subject.replace("-", "\\-")}',`, "g"))?.length).toBe(10);
    }
    expect(migration).toContain("source_url");
    expect(migration).toContain("pedagogical_explanation");
    expect(migration).toContain("citation_scopes");
    expect(migration).toContain("citation_themes");
    expect(migration).toContain("not exists (select 1 from public.citations");
  });
});
