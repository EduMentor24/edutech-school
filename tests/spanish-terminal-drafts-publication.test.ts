import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");
const migration = readFileSync(resolve(root, "supabase/migrations/20260824_publish_spanish_terminal_drafts.sql"), "utf8");

describe("publication contrôlée des brouillons d’espagnol Terminale", () => {
  it("limite strictement la portée aux trente-deux brouillons d’espagnol Terminale A1/A2/C/D", () => {
    expect(migration).toContain("target_count <> 32");
    expect(migration).toContain("subject.name = 'Espagnol'");
    expect(migration).toContain("level.name = 'Terminale'");
    expect(migration).toContain("series.name in ('A1', 'A2', 'C', 'D')");
    expect(migration).toContain("coalesce(btrim(lesson.content), '') <> ''");
  });

  it("refuse un brouillon incomplet et protège les données de test", () => {
    expect(migration).toContain("incomplete_count <> 0");
    expect(migration).toContain("not lesson.is_test_data");
    expect(migration).toContain("not exercise.is_test_data");
    expect(migration).toContain("not quiz.is_test_data");
    expect(migration).toContain("< 6");
    expect(migration).toContain("< 8");
  });

  it("active les leçons et publie les évaluations sans réécrire les contenus", () => {
    expect(migration).toContain("set is_active = true");
    expect(migration).toContain("set is_published = true, is_active = true");
    expect(migration).not.toContain("set content =");
    expect(migration).not.toContain("delete from");
  });
});
