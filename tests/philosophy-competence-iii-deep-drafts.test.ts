import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  "supabase/migrations/20260818_philosophie_competence_iii_lecons_1_2_3_drafts.sql",
  "utf8",
);

describe("brouillons approfondis Philosophie — Compétence III", () => {
  it("cible les deux leçons A1/A2 d’histoire et les leçons confirmées de valeur/progrès A1/A2/C/D", () => {
    [
      "8f2b6cfa-d9e2-4a45-8417-cf97dd0bc393",
      "6584c772-9985-4fd8-a7d0-6c6bfb54ae9b",
      "2b4ed899-ce59-43d3-ae6d-998565afcabb",
      "a5a2243a-31dd-40a5-b5ef-50a75e85756a",
      "96a9192a-8892-42ed-90cd-07c1cccd49e3",
      "562b5eb6-f323-41c7-8505-9e3a0f70ec2a",
      "8503a5f0-3f0c-4826-af7a-86b57ee1e3ca",
      "b0624f73-66ea-44e3-b0e0-f6d12dca47fa",
      "d10a955a-d75c-464d-a067-5d257d7603bc",
      "fc6e300b-ba2c-44c1-b015-f9c415d3e6cf",
    ].forEach((lessonId) => expect(migration).toContain(lessonId));

    expect(migration).toContain("series.name in ('A1', 'A2', 'C', 'D')");
    expect(migration).toContain("subject.name = 'Philosophie'");
    expect(migration).not.toContain("42e60b06-9986-41fd-a4bd-be802432922a");
  });

  it("refuse tout écrasement et garantit l’état brouillon des ressources", () => {
    expect(migration).toContain("coalesce(btrim(content), '') <> ''");
    expect(migration).toContain("aucune écriture automatique n’est autorisée");
    expect(migration).toContain("set description = lesson_description, content = lesson_content, is_active = false");
    expect(migration).toContain("false, false, 12, 10");
    expect(migration).toContain("false, false, 14, 20");
    expect(migration).toContain("12, 10, false, false");
  });

  it("sépare les cours approfondis, exercices corrigés et quiz", () => {
    expect(migration).toContain("# L’histoire et l’humanité");
    expect(migration).toContain("# La valeur de la philosophie");
    expect(migration).toContain("# Progrès et bonheur");
    expect(migration).toContain("insert into public.exercises");
    expect(migration).toContain("insert into public.exercise_questions");
    expect(migration).toContain("insert into public.quizzes");
    expect(migration).toContain("insert into public.quiz_questions");
    expect(migration).toContain("insert into public.quiz_answers");
  });
});
