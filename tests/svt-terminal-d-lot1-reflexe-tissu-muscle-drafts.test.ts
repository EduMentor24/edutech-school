import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  "supabase/migrations/20260822_svt_terminale_d_reflexe_tissu_muscle_drafts.sql",
  "utf8",
);

describe("lot SVT Terminale D : réflexe conditionnel, tissu nerveux et muscle strié", () => {
  it("cible exclusivement les trois leçons Terminale D confirmées et protège tout contenu existant", () => {
    expect(migration).toContain("a1014581-6c61-45fc-9a7a-6ca2ae01819d");
    expect(migration).toContain("2df0f2fd-c17b-4edf-8d90-b0d18870b38c");
    expect(migration).toContain("554ab193-ba0f-4ff6-9f78-a1dec8ebcffc");
    expect(migration).toContain("Les trois leçons SVT Terminale D attendues");
    expect((migration.match(/écrasement interdit/g) ?? []).length).toBe(3);
    expect((migration.match(/coalesce\(btrim\(content\),''\) <> ''/g) ?? []).length).toBe(3);
  });

  it("prépare des cours approfondis fidèles aux notions clés des trois PDF", () => {
    expect(migration).toContain("stimulus conditionnel");
    expect(migration).toContain("nouvelle liaison nerveuse");
    expect(migration).toContain("extinction");
    expect(migration).toContain("potentiel de repos");
    expect(migration).toContain("rhéobase");
    expect(migration).toContain("conduction saltatoire");
    expect(migration).toContain("acétylcholine");
    expect(migration).toContain("sarcomère");
    expect(migration).toContain("pont actomyosine");
    expect(migration).toContain("tétanos parfait");
    expect(migration).toContain("phosphocréatinase");
    expect(migration).toContain("C_6H_{12}O_6 + 6O_2");
  });

  it("crée deux exercices corrigés et un quiz séparé par leçon, tous en brouillon", () => {
    expect((migration.match(/insert into public\.exercises/g) ?? []).length).toBe(6);
    expect((migration.match(/insert into public\.exercise_questions/g) ?? []).length).toBe(6);
    expect((migration.match(/insert into public\.quizzes/g) ?? []).length).toBe(3);
    expect((migration.match(/insert into public\.quiz_questions/g) ?? []).length).toBe(3);
    expect((migration.match(/insert into public\.quiz_answers/g) ?? []).length).toBe(3);
    expect((migration.match(/is_active=false/g) ?? []).length).toBe(3);
    expect((migration.match(/is_published,is_active/g) ?? []).length).toBe(9);
    expect((migration.match(/false,false/g) ?? []).length).toBeGreaterThanOrEqual(9);
  });

  it("conserve les rattachements réels à l’offre, au chapitre et à la leçon", () => {
    expect(migration).toContain("l.id as lesson_id,c.id as chapter_id,o.id as offering_id");
    expect(migration).toContain("target.chapter_id,target.lesson_id");
    expect(migration).toContain("target.offering_id,target.chapter_id,target.lesson_id");
    expect(migration).toContain("where not exists (select 1 from public.exercises");
    expect(migration).toContain("where not exists (select 1 from public.quizzes");
  });
});
