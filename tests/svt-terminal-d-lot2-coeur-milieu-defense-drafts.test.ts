import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  "supabase/migrations/20260822_svt_terminale_d_coeur_milieu_interieur_defense_drafts.sql",
  "utf8",
);

describe("lot SVT Terminale D : cœur, milieu intérieur et défense", () => {
  it("cible les trois leçons officielles confirmées et protège tout contenu existant", () => {
    expect(migration).toContain("bc4eeecc-6dd3-457a-8ee2-51e191892891");
    expect(migration).toContain("917453a3-abdc-4991-8db5-94a37d4ba2de");
    expect(migration).toContain("45fd2641-0833-4279-819c-6ef572b6b40e");
    expect(migration).toContain("Les trois leçons SVT Terminale D attendues");
    expect((migration.match(/écrasement interdit/g) ?? []).length).toBe(3);
    expect((migration.match(/coalesce\(btrim\(content\),''\) <> ''/g) ?? []).length).toBe(3);
  });

  it("prépare des cours approfondis fidèles aux notions fondamentales des trois PDF", () => {
    expect(migration).toContain("tissu nodal");
    expect(migration).toContain("pacemaker du cœur");
    expect(migration).toContain("complexe QRS");
    expect(migration).toContain("expérience de Loewi");
    expect(migration).toContain("filtration glomérulaire");
    expect(migration).toContain("système rénine-angiotensine");
    expect(migration).toContain("homéostasie");
    expect(migration).toContain("réaction inflammatoire");
    expect(migration).toContain("phagocytose");
    expect(migration).toContain("CMH** ou **HLA");
    expect(migration).toContain("réponse immunitaire à médiation humorale");
    expect(migration).toContain("cytolyse");
  });

  it("crée deux exercices corrigés et un quiz séparé par leçon, tous en brouillon", () => {
    expect((migration.match(/insert into public\.exercises/g) ?? []).length).toBe(6);
    expect((migration.match(/insert into public\.exercise_questions/g) ?? []).length).toBe(6);
    expect((migration.match(/insert into public\.quizzes/g) ?? []).length).toBe(3);
    expect((migration.match(/insert into public\.quiz_questions/g) ?? []).length).toBe(3);
    expect((migration.match(/insert into public\.quiz_answers/g) ?? []).length).toBe(3);
    expect((migration.match(/is_active=false/g) ?? []).length).toBe(3);
    expect((migration.match(/false,false/g) ?? []).length).toBeGreaterThanOrEqual(9);
  });

  it("préserve les rattachements réels à l’offre, au chapitre et à la leçon", () => {
    expect(migration).toContain("l.id as lesson_id,c.id as chapter_id,o.id as offering_id");
    expect(migration).toContain("target.chapter_id,target.lesson_id");
    expect(migration).toContain("target.offering_id,target.chapter_id,target.lesson_id");
    expect(migration).toContain("where not exists (select 1 from public.exercises");
    expect(migration).toContain("where not exists (select 1 from public.quizzes");
  });
});
