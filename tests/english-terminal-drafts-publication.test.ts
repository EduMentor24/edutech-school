import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");
const migration = readFileSync(resolve(root, "supabase/migrations/20260824_publish_english_terminal_drafts.sql"), "utf8");

describe("publication contrôlée des brouillons d’anglais Terminale", () => {
  it("limite strictement la portée aux vingt brouillons d’anglais Terminale A1/A2/C/D", () => {
    expect(migration).toContain("target_count <> 20");
    expect(migration).toContain("subject.name = 'Anglais'");
    expect(migration).toContain("level.name = 'Terminale'");
    expect(migration).toContain("series.name in ('A1', 'A2', 'C', 'D')");
    expect(migration).toContain("coalesce(btrim(lesson.content), '') <> ''");
  });

  it("refuse une publication partielle et conserve les données de test hors périmètre", () => {
    expect(migration).toContain("incomplete_count <> 0");
    expect(migration).toContain("not lesson.is_test_data");
    expect(migration).toContain("not exercise.is_test_data");
    expect(migration).toContain("not quiz.is_test_data");
  });

  it("active les leçons et publie les évaluations sans modifier les contenus", () => {
    expect(migration).toContain("set is_active = true");
    expect(migration).toContain("set is_published = true, is_active = true");
    expect(migration).not.toContain("set content =");
    expect(migration).not.toContain("delete from");
  });
});
