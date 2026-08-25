import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  resolve(import.meta.dirname, "../supabase/migrations/20260825_create_history_methodology_terminal_drafts.sql"),
  "utf8",
);

describe("cours Histoire-Géographie de méthodologie Terminale", () => {
  it("préserve les leçons A1/A2 et crée seulement les structures C/D absentes", () => {
    expect(migration).toContain("existing_target_count <> 4");
    expect(migration).toContain("scientific_offering_count <> 2");
    expect(migration).toContain("scientific_chapter_count <> 0");
    expect(migration).toContain("created_chapter_count <> 2");
    expect(migration).not.toMatch(/delete\s+from/i);
  });

  it("crée huit cours substantiels, inactifs et hors données de test", () => {
    expect(migration).toContain("final_lesson_count <> 8");
    expect(migration).toContain("coalesce(length(trim(lesson.content)), 0) > 3000");
    expect(migration).toContain("lesson.is_active = false");
    expect(migration).toContain("lesson.is_test_data = false");
  });

  it("couvre séparément le commentaire de documents et la dissertation", () => {
    expect(migration).toContain("Les techniques du commentaire de deux documents");
    expect(migration).toContain("Le commentaire de deux documents");
    expect(migration).toContain("Les techniques de la dissertation");
    expect(migration).toContain("Rédiger une introduction en trois mouvements");
    expect(migration).toContain("Source pédagogique");
  });
});
