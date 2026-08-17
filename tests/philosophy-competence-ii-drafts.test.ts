import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  "supabase/migrations/20260817_philosophie_competence_ii_lecons_1_2_3_drafts.sql",
  "utf8",
);

describe("brouillons Philosophie — Compétence II, leçons 1 à 3", () => {
  it("cible exclusivement les six leçons Terminale A1/A2 contrôlées", () => {
    [
      "7a0fcff7-b4fc-4cda-aced-0c217220bf97",
      "0f5b8c0b-ab87-41f1-92aa-fadcb5e350d2",
      "08cb1a4b-5483-4d68-9678-5477e0a820f3",
      "0e730715-0cd9-4540-bc23-aa23695e83b1",
      "ff2dfefc-fd76-408c-b7eb-11ee8d725ab7",
      "565da730-ed69-41bc-9283-47f57ee8a82a",
    ].forEach((lessonId) => expect(migration).toContain(lessonId));

    expect(migration).toContain("series.name in ('A1', 'A2')");
    expect(migration).toContain("subject.name = 'Philosophie'");
    expect(migration).toContain("COMPETENCE II : Traiter une situation relative aux conditions de l’homme dans la société");
  });

  it("refuse tout écrasement de contenu et évite les doublons d’activités", () => {
    expect(migration).toContain("coalesce(btrim(content), '') <> ''");
    expect(migration).toContain("aucune écriture automatique n’est autorisée");
    expect(migration).toContain("where not exists (select 1 from public.exercises");
    expect(migration).toContain("where not exists (select 1 from public.quizzes");
  });

  it("laisse les leçons, exercices et quiz à l’état brouillon", () => {
    expect(migration).toContain("is_active = false");
    expect(migration).toContain("false, false, 10, 10");
    expect(migration).toContain("false, false, 12, 20");
    expect(migration).toContain("10, false, false");
  });

  it("sépare cours, exercices corrigés et quiz pour les trois sources", () => {
    expect(migration).toContain("# Leçon 1 — La connaissance de l’homme");
    expect(migration).toContain("# Leçon 2 — La vie en société");
    expect(migration).toContain("# Leçon 3 — Dieu et la religion");
    expect(migration).toContain("insert into public.exercises");
    expect(migration).toContain("insert into public.exercise_questions");
    expect(migration).toContain("insert into public.quizzes");
    expect(migration).toContain("insert into public.quiz_questions");
    expect(migration).toContain("insert into public.quiz_answers");
  });
});
