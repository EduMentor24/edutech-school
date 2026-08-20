import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  resolve(process.cwd(), "supabase/migrations/20260820_histoire_terminale_decolonisation_drafts.sql"),
  "utf8",
);

describe("brouillons Histoire Terminale : décolonisation", () => {
  it("cible les trois leçons des PDF pour A1, A2, C et D", () => {
    expect(migration).toContain("Leçon 1 — La montée d’un nationalisme");
    expect(migration).toContain("Leçon 2 — L’accession à l’indépendance de la Côte d’Ivoire");
    expect(migration).toContain("Leçon 3 — L’indépendance de l’Algérie");
    expect(migration).toContain("s.name in ('A1', 'A2', 'C', 'D')");
  });

  it("crée seulement la structure scientifique couverte dans l’ordre officiel", () => {
    expect(migration).toContain("THÈME 2 — DE LA DÉCOLONISATION AUX EFFORTS D’ORGANISATION DE L’AFRIQUE");
    expect(migration).toContain("30, false, false");
    expect(migration).toContain("Statut colonial, nationalisme, guerre et indépendance algérienne.");
  });

  it("protège les contenus existants et sépare les ressources brouillon", () => {
    expect(migration).toContain("coalesce(btrim(content), '') <> ''");
    expect(migration).toContain("is_active = false");
    expect(migration).toContain("public.exercises");
    expect(migration).toContain("public.exercise_questions");
    expect(migration).toContain("public.quizzes");
    expect(migration).toContain("public.quiz_questions");
    expect(migration).toContain("public.quiz_answers");
  });
});
