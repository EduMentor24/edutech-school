import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const migration = readFileSync(resolve(process.cwd(), "supabase/migrations/20260820_histoire_ua_croyances_citations_drafts.sql"), "utf8");

describe("lot Histoire UA, croyances occidentales et citations authentiques", () => {
  it("cible seulement les deux leçons dont les sources PDF sont lisibles", () => {
    expect(migration).toContain("Leçon 4 — L’Union africaine (UA)");
    expect(migration).toContain("Leçon 1 — Croyances et valeurs dominantes dans le monde occidental");
    expect(migration).toContain("Leçon 2 — Les mutations contemporaines de la civilisation négro-africaine");
    expect(migration).not.toContain("course_text := $mutations$");
  });

  it("conserve les cours, exercices et quiz en brouillon avec protection contre l’écrasement", () => {
    expect(migration).toContain("coalesce(btrim(content), '') <> ''");
    expect(migration).toContain("is_published,is_active");
    expect(migration).toContain("false,false");
    expect(migration).toContain("not exists (select 1 from public.exercises");
    expect(migration).toContain("not exists (select 1 from public.quizzes");
  });

  it("insère dix citations authentiques par matière prise en charge, sans doublon et sans activation", () => {
    for (const subject of ["Français", "Philosophie", "Histoire-Géographie", "Physique-Chimie"]) {
      expect((migration.match(new RegExp(`\\('${subject.replace("-", "\\-")}'`, "g")) ?? []).length).toBe(10);
    }
    expect(migration).toContain("not exists (select 1 from public.citations");
    expect(migration).toContain("citation_scopes");
    expect(migration).toContain("citation_themes");
    expect(migration).toContain("false,false");
  });

  it("prévoit un complément philosophique lorsque le garde-fou exclut une citation déjà existante", () => {
    const complement = readFileSync(resolve(process.cwd(), "supabase/migrations/20260820_citations_philosophie_complement_drafts.sql"), "utf8");
    expect(complement).toContain("L’homme est né libre, & par-tout il est dans les fers.");
    expect(complement).toContain("not exists");
    expect(complement).toContain("false,false");
  });
});
