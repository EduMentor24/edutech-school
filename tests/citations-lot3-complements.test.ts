import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync("supabase/migrations/20260820_citations_lot3_complements_equilibres.sql", "utf8");

describe("compléments équilibrés des citations du lot 3", () => {
  it("ajoute les trois citations de remplacement vérifiées", () => {
    expect((migration.match(/\('Français',/g) ?? []).length).toBe(2);
    expect((migration.match(/\('Philosophie',/g) ?? []).length).toBe(1);
    expect(migration).toContain("la vérité est en marche, et rien ne l’arrêtera");
    expect(migration).toContain("Tous pour un, un pour tous.");
    expect(migration).toContain("Enfin chacun se donnant à tous ne se donne à personne.");
  });

  it("préserve les brouillons, les périmètres A1/A2/C/D et l’anti-doublon", () => {
    expect(migration).toContain("false,false");
    expect(migration).toContain("se.name in ('A1','A2','C','D')");
    expect(migration).toContain("where not exists");
  });
});
