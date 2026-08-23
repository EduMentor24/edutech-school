import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync("supabase/migrations/20260823_english_terminal_unit3_structure_a2.sql", "utf8");

describe("préparation Unit 3 Anglais Terminale", () => {
  it("n’ajoute que la leçon Unit 3 A2 strictement manquante", () => {
    expect(migration).toContain("0bc8f25a-432a-441b-8a86-303b452aaf9f");
    expect(migration).toContain("UNIT 3 DEVELOPMENT ISSUES");
    expect(migration).toContain("display_order, is_active");
    expect(migration).toContain("30, false");
  });

  it("interdit tout doublon et exige les quatre offres réelles", () => {
    expect(migration).toContain("Les quatre offres Anglais Terminale A1/A2/C/D sont requises");
    expect(migration).toContain("aucun doublon n’est autorisé");
  });

  it("ne crée aucun contenu ni module pédagogique", () => {
    expect(migration).not.toContain("insert into public.exercises");
    expect(migration).not.toContain("insert into public.quizzes");
    expect(migration).not.toContain("content,");
  });
});
