import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync("supabase/migrations/20260820_citations_lot3_equilibre_correction.sql", "utf8");

describe("correction de l’équilibre des citations du lot 3", () => {
  it("ne cible que les brouillons non validés", () => {
    expect(migration).toContain("c.is_active=false and c.is_validated=false");
    expect(migration).toContain("Citation brouillon à corriger introuvable ou non modifiable");
  });

  it("corrige les thèmes déséquilibrés des quatre matières sans réécrire une citation déjà exacte", () => {
    expect((migration.match(/\('Français',/g) ?? []).length).toBe(1);
    expect((migration.match(/\('Philosophie',/g) ?? []).length).toBe(5);
    expect((migration.match(/\('Histoire-Géographie',/g) ?? []).length).toBe(13);
    expect((migration.match(/\('Physique-Chimie',/g) ?? []).length).toBe(5);
    expect(migration).not.toContain("[est]");
  });
});
