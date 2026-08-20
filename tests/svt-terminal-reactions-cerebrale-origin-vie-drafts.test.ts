import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const migration = readFileSync(
  resolve(process.cwd(), "supabase/migrations/20260820_svt_terminale_reactions_cerebrale_origine_vie_drafts.sql"),
  "utf8",
);

describe("brouillons SVT Terminale A1/A2 — émotions, activité cérébrale et origine de la vie", () => {
  it("crée uniquement les structures A2 couvertes par les PDF Terminale A et protège les six leçons", () => {
    expect(migration).toContain("Thème 1 : L’origine de la vie et l’évolution de la lignée humaine.");
    expect(migration).toContain("Thème : La communication dans l’organisme.");
    expect(migration).toContain("s.name='A2'");
    expect(migration).toContain("s.name in ('A1','A2')");
    expect(migration).toContain("if expected_count <> 6");
    expect(migration).toContain("Écrasement interdit");
    expect(migration).toContain("where not exists (select 1 from public.chapters");
  });

  it("sépare strictement le cours, les exercices corrigés et le quiz en brouillon", () => {
    expect(migration).toContain("update public.lessons");
    expect(migration).toContain("insert into public.exercises");
    expect(migration).toContain("insert into public.exercise_questions");
    expect(migration).toContain("insert into public.quizzes");
    expect(migration).toContain("insert into public.quiz_questions");
    expect(migration).toContain("insert into public.quiz_answers");
    expect(migration).toContain("is_published,is_active");
    expect(migration).toContain("false,false");
  });

  it("conserve les notions centrales des trois PDF sans les attribuer aux séries C/D", () => {
    expect(migration).toContain("régulation nerveuse, hormonale et neuro-hormonale");
    expect(migration).toContain("motricité volontaire");
    expect(migration).toContain("faits paléontologiques et les faits expérimentaux");
    expect(migration).toContain("Les séries C/D sont volontairement exclues");
  });
});
