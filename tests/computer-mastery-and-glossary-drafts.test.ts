import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync("scripts/prepare-computer-mastery-and-glossary-drafts-migration.mjs", "utf8");
describe("maîtrise de l’ordinateur et infobulles Informatique", () => {
  it("prévoit quatre leçons débutant complémentaires", () => {
    ["Découvrir l’ordinateur : matériel, logiciels et système", "Se repérer dans le système et utiliser les applications", "Organiser, enregistrer et retrouver ses fichiers", "Entretenir son poste et résoudre les problèmes simples"].forEach((title) => expect(source).toContain(title));
  });
  it("annote uniquement les brouillons inactifs avec le format d’infobulle sûr", () => {
    expect(source).toContain("l.is_active=false");
    expect(source).toContain("l.content not like '%[[%'");
    ["[[algorithme|", "[[variable|", "[[boucle|", "[[matériel|", "[[fichier|"].forEach((marker) => expect(source).toContain(marker));
  });
  it("crée des exercices et quiz séparés, inactifs et non publiés", () => {
    ["exercise_questions", "quiz_questions", "quiz_answers", "false,false,false"].forEach((value) => expect(source).toContain(value));
  });
  it("protège contre les doublons et les ambiguïtés de variables SQL", () => {
    expect(source).toContain("duplication interdite");
    expect(source).toContain("target_chapter_id uuid");
    expect(source).toContain("target_lesson_id uuid");
    expect(source).not.toContain("where chapter_id=chapter_id");
    expect(source).not.toContain("where lesson_id=lesson_id");
  });
});
