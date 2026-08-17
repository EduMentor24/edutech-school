import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync("supabase/migrations/20260817_philosophie_commentaire_texte_drafts.sql", "utf8");

describe("brouillons Philosophie — commentaire de texte", () => {
  it("cible exclusivement les deux leçons Terminale A1/A2 existantes", () => {
    expect(migration).toContain("fe364cab-7eac-4d14-9c6f-ee279cc92750");
    expect(migration).toContain("dac94865-5803-4ae6-b241-c9a2844633ae");
    expect(migration).toContain("series.name in ('A1', 'A2')");
    expect(migration).toContain("subject.name = 'Philosophie'");
  });

  it("refuse d’écraser une leçon qui contient déjà du contenu", () => {
    expect(migration).toContain("coalesce(btrim(content), '') <> ''");
    expect(migration).toContain("aucune écriture automatique n’est autorisée");
  });

  it("conserve tous les contenus créés à l’état brouillon, inactif et non publié", () => {
    expect(migration).toContain("is_active = false");
    expect(migration).toContain("false, false, 10, 10");
    expect(migration).toContain("false, false, 12, 20");
    expect(migration).toContain("10, false, false");
  });

  it("sépare la leçon, les exercices corrigés et le quiz reliés à la même leçon", () => {
    expect(migration).toContain("insert into public.exercises");
    expect(migration).toContain("insert into public.exercise_questions");
    expect(migration).toContain("insert into public.quizzes");
    expect(migration).toContain("insert into public.quiz_questions");
    expect(migration).toContain("insert into public.quiz_answers");
  });
});
