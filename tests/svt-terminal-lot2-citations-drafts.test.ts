import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(resolve("supabase/migrations/20260820_svt_terminale_evolution_heredite_previsions_citations_drafts.sql"), "utf8");

describe("migration SVT Terminale lot 2 et citations séparées", () => {
  it("cible uniquement les six leçons A1/A2 confirmées et préserve les contenus existants", () => {
    expect(migration).toContain("s.name in ('A1','A2')");
    expect(migration).not.toContain("s.name in ('A1','A2','C','D') and ((c.title='Thème 1");
    expect(migration).toContain("Écrasement interdit");
    expect(migration).toContain("Six leçons SVT A1/A2 sont requises");
  });

  it("crée les cours, exercices et quiz séparés uniquement en brouillon", () => {
    expect(migration).toContain("content=course_text,is_active=false");
    expect(migration).toContain("is_published,is_active");
    expect(migration).toContain("false,false");
    expect(migration).toContain("public.exercise_questions");
    expect(migration).toContain("public.quiz_questions");
  });

  it("ajoute dix citations authentiques par matière avec des notions propres", () => {
    expect((migration.match(/\('Français',/g) ?? []).length).toBe(10);
    expect((migration.match(/\('Philosophie',/g) ?? []).length).toBe(10);
    expect((migration.match(/\('Histoire-Géographie',/g) ?? []).length).toBe(10);
    expect((migration.match(/\('Physique-Chimie',/g) ?? []).length).toBe(10);
    expect(migration).toContain("public.citation_themes");
    expect(migration).toContain("not exists (select 1 from public.citations");
  });
});
