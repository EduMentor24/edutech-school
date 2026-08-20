import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  "supabase/migrations/20260820_svt_terminale_c_communication_drogues_citations_drafts.sql",
  "utf8",
);

describe("lot SVT Terminale C : communication nerveuse, drogues et citations", () => {
  it("cible uniquement les deux leçons contrôlées et exclut L3 faute de PDF lisible", () => {
    expect(migration).toContain("5309406d-0ab9-4958-a2e9-af5f16a6b1c0");
    expect(migration).toContain("4cdc042d-3932-4b48-ad20-c14fa9bc9bce");
    expect(migration).toContain("PDF reçu illisible");
    expect(migration).toContain("écrasement interdit");
    expect(migration).not.toContain("793b5a60-ab1a-486b-b29c-fcebac02c4e1");
  });

  it("maintient les cours, exercices et quiz en brouillon avec leurs relations réelles", () => {
    expect(migration).toContain("l.id as lesson_id,c.id as chapter_id,o.id as offering_id");
    expect(migration).toContain("target.chapter_id,target.lesson_id");
    expect(migration).toContain("target.offering_id,target.chapter_id,target.lesson_id");
    expect(migration).toContain("is_published,is_active");
    expect(migration).toMatch(/false,false,15,10/);
    expect(migration).toMatch(/false,false,20,20/);
    expect(migration).toMatch(/false,false\s+where not exists \(select 1 from public\.quizzes/);
  });

  it("prépare vingt citations distinctes par matière et deux citations pour chacune de dix notions", () => {
    const subjects = ["Français", "Philosophie", "Histoire-Géographie", "Physique-Chimie"] as const;
    const themes = {
      Français: ["Sincérité", "Flatterie", "Justice et éthique", "Raison et sentiment", "Symbolisme", "Condition du poète", "Temps et création", "Mer et intériorité", "Fable et réflexion", "Loi et justice"],
      Philosophie: ["Loi naturelle", "Société", "Droit des gens", "Raison et loi", "Limites humaines", "Devoir", "Exemple moral", "Universalité", "Valeur morale", "Rationalité"],
      "Histoire-Géographie": ["Dignité humaine", "Non-discrimination", "Vie privée", "Mobilité", "Nationalité", "Famille", "Travail", "Sécurité sociale", "Éducation", "Culture et science"],
      "Physique-Chimie": ["Investigation", "Conditions et lois", "Méthode expérimentale", "Vérité relative", "Hypothèse", "Doute scientifique", "Vérification", "Conventions scientifiques", "Évolution des théories", "Induction"],
    } as const;

    const countSubjectTheme = (subject: string, theme: string) =>
      migration
        .split("\n")
        .filter(
          (line) =>
            line.trimStart().startsWith(`('${subject}',`) &&
            line.includes(`,'${theme}')`),
        ).length;

    for (const subject of subjects) {
      expect((migration.match(new RegExp(`\\('${subject}',`, "g")) ?? []).length).toBe(20);
      for (const theme of themes[subject]) {
        expect(countSubjectTheme(subject, theme)).toBe(2);
      }
    }
    expect(migration).toContain("citation_themes");
    expect(migration).toContain("is_active,is_validated");
  });
});
