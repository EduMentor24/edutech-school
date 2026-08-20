import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync("supabase/migrations/20260820_svt_terminale_biosynthese_proteines_citations_equilibrees_drafts.sql", "utf8");

describe("lot SVT Terminale biosynthèse et citations équilibrées", () => {
  it("cible seulement la biosynthèse A1/A2 et préserve explicitement L8", () => {
    expect(migration).toContain("Deux leçons SVT A1/A2 de biosynthèse sont requises");
    expect(migration).toContain("Écrasement interdit");
    expect(migration).toContain("L8 évolution contrôlée comme doublon pédagogique déjà couvert");
    expect(migration).not.toContain("Leçon 2 : L’évolution de la lignée humaine.');");
  });

  it("maintient des brouillons séparés pour cours, exercices et quiz", () => {
    expect(migration).toContain("content=$biosynthese$");
    expect(migration).toContain("is_published,is_active");
    expect(migration).toContain("false,false,15,10");
    expect(migration).toContain("false,false,20,20");
    expect(migration).toMatch(/false,false\s+where not exists \(select 1 from public\.quizzes/);
  });

  it("prépare vingt citations distinctes par matière et leurs notions propres", () => {
    expect((migration.match(/\('Français',/g) ?? []).length).toBe(20);
    expect((migration.match(/\('Philosophie',/g) ?? []).length).toBe(20);
    expect((migration.match(/\('Histoire-Géographie',/g) ?? []).length).toBe(20);
    expect((migration.match(/\('Physique-Chimie',/g) ?? []).length).toBe(20);
    expect(migration).toContain("citation_themes");
    expect(migration).toContain("is_active,is_validated");
  });

  it("répartit chaque corpus sur dix notions équilibrées", () => {
    const countSubjectTheme = (subject: string, theme: string) => migration
      .split("\n")
      .filter((line) => line.trimStart().startsWith(`('${subject}',`) && line.includes(`,'${theme}')`))
      .length;
    ["Fable", "Satire", "Liberté", "Morale", "Prévoyance", "Bonheur", "Justice", "Résilience", "Solidarité", "Opinion"].forEach((theme) => expect(countSubjectTheme("Français", theme)).toBe(2));
    ["Liberté", "Politique", "Droit", "Aliénation", "Contrat social", "Citoyenneté", "Autonomie", "Souveraineté", "Volonté générale", "Loi"].forEach((theme) => expect(countSubjectTheme("Philosophie", theme)).toBe(2));
    ["Non-discrimination", "Égalité", "Droits fondamentaux", "Libertés publiques", "Citoyenneté", "Droits sociaux", "Société", "Peuples", "Développement", "Paix"].forEach((theme) => expect(countSubjectTheme("Histoire-Géographie", theme)).toBe(2));
    ["Observation", "Expérimentation", "Déterminisme", "Raisonnement scientifique", "Esprit critique", "Hypothèse", "Idée expérimentale", "Méthode scientifique", "Recherche", "Causalité"].forEach((theme) => expect(countSubjectTheme("Physique-Chimie", theme)).toBe(2));
  });
});
