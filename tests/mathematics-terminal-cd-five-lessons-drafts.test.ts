import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");
const script = readFileSync(resolve(root, "scripts/prepare-mathematics-terminal-cd-five-lessons-drafts-migration.mjs"), "utf8");
const migration = readFileSync(resolve(root, "supabase/migrations/20260824_mathematics_terminal_cd_five_lessons_drafts.sql"), "utf8");

describe("brouillons Mathématiques Terminale C/D — limites, barycentre, divisibilité, espace et coniques", () => {
  it("cible exclusivement les offres officielles Mathématiques Terminale C et D", () => {
    expect(migration).toContain("subject.name='Mathématiques'");
    expect(migration).toContain("level.name='Terminale'");
    expect(migration).toContain("series.name in ('C','D')");
    expect(migration).toContain("if offering_count<>2");
  });

  it("préserve la leçon existante de limites et crée seulement les quatre structures absentes par série", () => {
    expect(script).toContain('title: "1. Limites et continuité"');
    expect(script).toContain("createWhenMissing: false");
    expect(script).toContain('title: "Barycentre et lignes de niveau"');
    expect(script).toContain('title: "Divisibilité dans ℤ"');
    expect(script).toContain('title: "Géométrie analytique de l’espace"');
    expect(script).toContain('title: "Coniques"');
    expect(migration).toContain("coalesce((select max(existing_lesson.display_order)+10");
  });

  it("bloque l’écrasement et la duplication avant toute insertion", () => {
    expect(migration).toContain("écrasement interdit");
    expect(migration).toContain("duplication interdite");
    expect(migration).toContain("coalesce(btrim(lesson.content),'')<>''");
  });

  it("génère cours, deux exercices corrigés et deux quiz séparés en brouillon", () => {
    expect(migration).toContain("Exercice 1 — Repères fondamentaux");
    expect(migration).toContain("Exercice 2 — Méthodes et raisonnement");
    expect(migration).toContain("Quiz A — Notions");
    expect(migration).toContain("Quiz B — Méthodes");
    expect(migration).toContain("false,false,18,10,false");
    expect(migration).toContain("false,false,false)");
    expect(migration).toContain("insert into public.quiz_answers");
  });
});
