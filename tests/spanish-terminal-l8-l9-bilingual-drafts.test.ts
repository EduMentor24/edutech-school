import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  "supabase/migrations/20260822_espagnol_terminale_raconter_resumer_bilingual_drafts.sql",
  "utf8",
);

describe("lot Espagnol Terminale : raconter un fait et résumer", () => {
  it("préserve les quatre offres et annule toute écriture si une leçon cible existe déjà", () => {
    expect(migration).toContain("942aacbc-1f0c-4eea-9f61-04560b3f3578");
    expect(migration).toContain("48880a58-de13-4485-a45d-ab716b4ca645");
    expect(migration).toContain("0e028469-a443-4b7d-9ed9-6a675193fc24");
    expect(migration).toContain("d496a111-1324-4f92-b557-f5bb402f6bac");
    expect(migration).toContain("Une leçon cible Espagnol Terminale existe déjà");
    expect(migration).toContain("Compétence — Échange d’information");
    expect(migration).toContain("coalesce(max(display_order),0)+10");
  });

  it("crée exactement les deux leçons dans le chapitre existant à la suite des brouillons précédents", () => {
    expect(migration).toContain("Leçon 8 : Raconter un fait.");
    expect(migration).toContain("Leçon 9 : Résumer.");
    expect((migration.match(/insert into public\.lessons/g) ?? []).length).toBe(2);
    expect((migration.match(/lesson_uuid := null/g) ?? []).length).toBe(2);
    expect(migration).toContain("$lesson_content$,first_lesson_order,false");
    expect(migration).toContain("$lesson_content$,first_lesson_order + 10,false");
    expect(migration).not.toContain("insert into public.chapters");
  });

  it("crée les exercices et quiz séparés uniquement en brouillon inactif", () => {
    expect((migration.match(/returning id into exercise_a_uuid/g) ?? []).length).toBe(2);
    expect((migration.match(/returning id into exercise_b_uuid/g) ?? []).length).toBe(2);
    expect((migration.match(/returning id into quiz_uuid/g) ?? []).length).toBe(2);
    expect((migration.match(/insert into public\.exercise_questions/g) ?? []).length).toBe(4);
    expect((migration.match(/insert into public\.quiz_questions/g) ?? []).length).toBe(2);
    expect((migration.match(/false,false/g) ?? []).length).toBeGreaterThanOrEqual(6);
    expect(migration).toContain("is_published,is_active");
  });

  it("applique la traduction française immédiate aux cours, exercices, quiz, réponses et corrections", () => {
    expect((migration.match(/\*\*Traduction française :\*\*/g) ?? []).length).toBeGreaterThanOrEqual(60);
    expect(migration).toContain("Llegué a Barcelona a medianoche.");
    expect(migration).toContain("Je suis arrivée à Barcelone à minuit.");
    expect(migration).toContain("En pocas palabras, el estudiante va a Bélgica con una beca Erasmus.");
    expect(migration).toContain("En quelques mots, l’étudiant part en Belgique avec une bourse Erasmus.");
    expect(migration).toContain("— Traduction française :");
    expect(migration).toContain("El pretérito imperfecto");
    expect(migration).toContain("L’imparfait");
  });
});
