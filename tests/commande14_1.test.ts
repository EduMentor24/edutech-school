import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(__dirname, "..");
const migration = JSON.parse(readFileSync(resolve(root, "commande14_1_restructure.json"), "utf8")) as { query: string };
const englishMigration = JSON.parse(readFileSync(resolve(root, "commande14_1_english_units.json"), "utf8")) as { query: string };
const catalogueService = readFileSync(resolve(root, "lib/courses/course-service.ts"), "utf8");

function occurrences(source: string, value: string) {
  return source.split(value).length - 1;
}

describe("Commande 14.1 — Restructuration manuelle Première C/D", () => {
  it("applique la migration uniquement au niveau Première et aux séries C/D", () => {
    expect(migration.query).toContain("lev.name = 'Première'");
    expect(migration.query).toContain("se.name IN ('C', 'D')");
    expect(migration.query).not.toContain("se.name IN ('A1', 'A2')");
    expect(migration.query).not.toContain("Terminale");
  });

  it("supprime seulement les chapitres/leçons C/D des matières explicitement corrigées", () => {
    expect(migration.query).toContain("DELETE FROM lessons WHERE chapter_id IN (SELECT id FROM target_chapters)");
    expect(migration.query).toContain("'Mathématiques (C)'");
    expect(migration.query).toContain("'Physique-Chimie (D)'");
    expect(migration.query).not.toContain("'Sciences de la Vie et de la Terre (C)'");
    expect(migration.query).not.toContain("'Sciences de la Vie et de la Terre (D)'");
  });

  it("déclare exactement les 17 leçons de Mathématiques Première C", () => {
    const section = migration.query.slice(migration.query.indexOf("('C', 'Mathématiques', 1, 1"), migration.query.indexOf("('D', 'Mathématiques', 1, 1"));
    expect(occurrences(section, "('C', 'Mathématiques', 1,")).toBe(17);
    expect(section).toContain("Vecteurs de l’espace");
    expect(section).toContain("Géométrie analytique du plan");
  });

  it("déclare exactement les 15 leçons de Mathématiques Première D", () => {
    const section = migration.query.slice(migration.query.indexOf("('D', 'Mathématiques', 1, 1"), migration.query.indexOf("('C', 'Physique-Chimie', 1, 1"));
    expect(occurrences(section, "('D', 'Mathématiques', 1,")).toBe(15);
    expect(section).not.toContain("Vecteurs de l’espace");
    expect(section).not.toContain("Géométrie analytique du plan");
  });

  it("déclare les cinq chapitres et 28 leçons de Physique-Chimie Première C", () => {
    const section = migration.query.slice(migration.query.indexOf("('C', 'Physique-Chimie', 1, 1"), migration.query.indexOf("('D', 'Physique-Chimie', 1, 1"));
    expect(occurrences(section, "('C', 'Physique-Chimie',")).toBe(28);
    expect(section).toContain("Corrosion et protection des métaux");
  });

  it("déclare les cinq chapitres et 26 leçons de Physique-Chimie Première D", () => {
    const section = migration.query.slice(migration.query.indexOf("('D', 'Physique-Chimie', 1, 1"), migration.query.indexOf("('C', 'Français', 1, 1"));
    expect(occurrences(section, "('D', 'Physique-Chimie',")).toBe(26);
    expect(section).not.toContain("Corrosion et protection des métaux");
  });

  it("conserve les structures communes de Français, Espagnol, Philosophie et Histoire-Géographie pour C/D", () => {
    expect(occurrences(migration.query, "'CHAPITRE 9 — EXPRESSION ÉCRITE'")).toBe(2);
    expect(occurrences(migration.query, "'CHAPITRE 6 — La technique d’expression orale ou écrite'")).toBe(2);
    expect(occurrences(migration.query, "'CHAPITRE 3 — HISTOIRE DE LA PHILOSOPHIE'")).toBe(2);
    expect(occurrences(migration.query, "'CHAPITRE 4 — Le processus de la mondialisation'")).toBe(2);
  });

  it("représente chaque unité d’anglais par une seule leçon, sans fractionnement des compétences", () => {
    expect(occurrences(englishMigration.query, "('C',")).toBe(6);
    expect(occurrences(englishMigration.query, "('D',")).toBe(6);
    expect(englishMigration.query).not.toContain("Speaking");
    expect(englishMigration.query).not.toContain("Reading");
    expect(englishMigration.query).not.toContain("Listening");
    expect(englishMigration.query).not.toContain("Writing");
  });

  it("force les leçons corrigées à rester vides et inactives", () => {
    expect(migration.query).toContain("SELECT c.id, lesson_ref.title, '', '', lesson_ref.display_order, false, false");
    expect(englishMigration.query).toContain("SELECT c.id, unit_ref.title, '', '', 1, false, false");
    expect(migration.query).toContain("SET is_published = false");
  });

  it("conserve l’invisibilité catalogue des offres, chapitres et leçons non publiés/inactifs", () => {
    expect(catalogueService).toContain('.eq("is_published", true)');
    expect(catalogueService).toContain('chapters.filter((chapter: { is_active?: boolean }) => chapter.is_active)');
    expect(catalogueService).toContain('.eq("is_active", true)');
  });
});
