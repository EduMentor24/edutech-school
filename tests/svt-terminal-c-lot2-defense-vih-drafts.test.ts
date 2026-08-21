import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  "supabase/migrations/20260821_svt_terminale_c_defense_vih_drafts.sql",
  "utf8",
);

describe("lot SVT Terminale C : défense de l’organisme et VIH", () => {
  it("cible exclusivement les deux leçons confirmées et exclut le PDF L4 illisible", () => {
    expect(migration).toContain("4127808a-f937-4d86-8c40-6205c7cd7d28");
    expect(migration).toContain("48ac83b1-aca3-41c2-b241-07617c08c438");
    expect(migration).toContain("fichier structurellement illisible");
    expect(migration).toContain("écrasement interdit");
    expect(migration).not.toContain("793b5a60-ab1a-486b-b29c-fcebac02c4e1");
  });

  it("prépare des cours approfondis fidèles aux contenus biologiques relevés", () => {
    expect(migration).toContain("réaction inflammatoire");
    expect(migration).toContain("phagocytose");
    expect(migration).toContain("réponse immunitaire à médiation humorale");
    expect(migration).toContain("Gp120");
    expect(migration).toContain("ADN proviral");
    expect(migration).toContain("phase asymptomatique");
    expect(migration).toContain("maladies opportunistes");
  });

  it("maintient les cours, exercices et quiz en brouillon avec leurs relations réelles", () => {
    expect(migration).toContain("l.id as lesson_id,c.id as chapter_id,o.id as offering_id");
    expect(migration).toContain("target.chapter_id,target.lesson_id");
    expect(migration).toContain("target.offering_id,target.chapter_id,target.lesson_id");
    expect((migration.match(/is_active=false/g) ?? []).length).toBe(2);
    expect((migration.match(/false,false,15,10/g) ?? []).length).toBe(2);
    expect((migration.match(/false,false,20,20/g) ?? []).length).toBe(2);
    expect((migration.match(/false,false\n  where not exists \(select 1 from public\.quizzes/g) ?? []).length).toBe(2);
  });
});
