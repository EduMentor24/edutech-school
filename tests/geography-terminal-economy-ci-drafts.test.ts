import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const migration = readFileSync(resolve(process.cwd(), "supabase/migrations/20260820_geographie_terminale_economie_ci_drafts.sql"), "utf8");

describe("lot Géographie Terminale : économie de la Côte d’Ivoire", () => {
  it("couvre les trois leçons confirmées dans les quatre séries sans réordonner les structures existantes", () => {
    expect(migration).toContain("s.name in ('C','D')");
    expect(migration).toContain("THÈME 1 — LA CÔTE D’IVOIRE : ÉTUDE ÉCONOMIQUE");
    expect(migration).toContain("50,false,false");
    expect(migration).toContain("Douze leçons cibles sont requises");
  });

  it("protège tout contenu non vide et conserve cours, exercices et quiz en brouillon", () => {
    expect(migration).toContain("coalesce(btrim(content),'') <> ''");
    expect(migration).toContain("is_published,is_active");
    expect(migration).toContain("false,false");
    expect(migration).toContain("not exists (select 1 from public.exercises");
    expect(migration).toContain("not exists (select 1 from public.quizzes");
  });

  it("sépare les contenus de cours, exercices et quiz pour les trois leçons", () => {
    expect(migration).toContain("$fondements$");
    expect(migration).toContain("$secteurs$");
    expect(migration).toContain("$problemes$");
    expect(migration).toContain("public.exercise_questions");
    expect(migration).toContain("public.quiz_questions");
    expect(migration).toContain("public.quiz_answers");
  });
});
