import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  "supabase/migrations/20260818_philosophie_competence_iv_lecons_1_2_drafts.sql",
  "utf8",
);

describe("brouillons approfondis Philosophie — Compétence IV", () => {
  it("cible les huit leçons Étude d’œuvres explicitement confirmées", () => {
    [
      "6f0225cd-37bd-40b1-a724-81d1a3f559d9", "6a25851a-22e4-4f8a-bfe9-2b5ca620ca54",
      "7b216e2b-b10f-45be-90f9-f55bb92a1849", "9d35557a-cbb0-4fd6-8e0b-21c8e68d059c",
      "5ed46281-9e01-49fc-b040-5a9c04be470d", "a3816920-f1ea-4f3c-a29a-aee9dcdbaa02",
      "0cf780b6-fca8-46ed-bfdf-4b2c86809459", "40e08dfd-1889-4965-aeeb-04dcdd3544d1",
    ].forEach((lessonId) => expect(migration).toContain(lessonId));
    expect(migration).toContain("series.name in ('A1', 'A2', 'C', 'D')");
    expect(migration).toContain("Leçon 1 : Langage et vérité/ ETUDE D’OEUVRES");
    expect(migration).toContain("Leçon 2 : La connaissance scientifique/ ETUDE D’OEUVRES");
  });

  it("refuse l’écrasement et laisse les cours, exercices et quiz en brouillon", () => {
    expect(migration).toContain("coalesce(btrim(content), '') <> ''");
    expect(migration).toContain("aucune écriture automatique n’est autorisée");
    expect(migration).toContain("set description = lesson_description, content = lesson_content, is_active = false");
    expect(migration).toContain("false, false, 12, 10");
    expect(migration).toContain("false, false, 14, 20");
    expect(migration).toContain("12, 10, false, false");
  });

  it("sépare les contenus pédagogiques, exercices corrigés et quiz", () => {
    expect(migration).toContain("# Langage et vérité");
    expect(migration).toContain("# La connaissance scientifique");
    expect(migration).toContain("insert into public.exercises");
    expect(migration).toContain("insert into public.exercise_questions");
    expect(migration).toContain("insert into public.quizzes");
    expect(migration).toContain("insert into public.quiz_questions");
    expect(migration).toContain("insert into public.quiz_answers");
  });
});
