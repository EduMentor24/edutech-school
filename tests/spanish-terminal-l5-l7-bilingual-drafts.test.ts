import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  "supabase/migrations/20260822_espagnol_terminale_guinee_questions_decrire_bilingual_drafts.sql",
  "utf8",
);

describe("lot Espagnol Terminale : Guinée équatoriale, questions et description", () => {
  it("préserve les quatre offres existantes et protège toute structure ou leçon cible déjà présente", () => {
    expect(migration).toContain("942aacbc-1f0c-4eea-9f61-04560b3f3578");
    expect(migration).toContain("48880a58-de13-4485-a45d-ab716b4ca645");
    expect(migration).toContain("0e028469-a443-4b7d-9ed9-6a675193fc24");
    expect(migration).toContain("d496a111-1324-4f92-b557-f5bb402f6bac");
    expect(migration).toContain("Une leçon cible Espagnol Terminale existe déjà");
    expect(migration).toContain("Le chapitre Espagnol « Échange d’information » existe déjà");
    expect(migration).toContain("Compétence — Connaissance du monde hispanique");
    expect(migration).toContain("coalesce(max(display_order),0)+10");
  });

  it("ajoute exactement les trois leçons fidèles dans les chapitres appropriés", () => {
    expect(migration).toContain(
      "Leçon 5 : Connaître les réalités historiques, politiques, économiques et sociolinguistiques de Guinée équatoriale.",
    );
    expect(migration).toContain("Leçon 6 : Poser des questions.");
    expect(migration).toContain("Leçon 7 : Décrire.");
    expect(migration).toContain("Compétence — Échange d’information");
    expect((migration.match(/insert into public\.lessons/g) ?? []).length).toBe(3);
    expect((migration.match(/lesson_uuid := null/g) ?? []).length).toBe(3);
    expect(migration).toContain("$lesson_content$,world_lesson_order,false");
    expect(migration).toContain("$lesson_content$,10,false");
    expect(migration).toContain("$lesson_content$,20,false");
  });

  it("crée les exercices et quiz séparés uniquement en brouillon inactif", () => {
    expect((migration.match(/returning id into exercise_a_uuid/g) ?? []).length).toBe(3);
    expect((migration.match(/returning id into exercise_b_uuid/g) ?? []).length).toBe(3);
    expect((migration.match(/returning id into quiz_uuid/g) ?? []).length).toBe(3);
    expect((migration.match(/insert into public\.exercise_questions/g) ?? []).length).toBe(6);
    expect((migration.match(/insert into public\.quiz_questions/g) ?? []).length).toBe(3);
    expect((migration.match(/false,false/g) ?? []).length).toBeGreaterThanOrEqual(9);
    expect(migration).toContain("is_published,is_active");
  });

  it("applique la traduction française immédiate aux cours, exercices, quiz, réponses et corrections", () => {
    expect((migration.match(/\*\*Traduction française :\*\*/g) ?? []).length).toBeGreaterThanOrEqual(80);
    expect(migration).toContain("Guinea Ecuatorial consiguió su independencia de España en 1968.");
    expect(migration).toContain("La Guinée équatoriale a obtenu son indépendance de l’Espagne en 1968.");
    expect(migration).toContain("seguir + gerundio");
    expect(migration).toContain("seguir + gérondif");
    expect(migration).toContain("¿Cuánto cuesta esta blusa?");
    expect(migration).toContain("Combien coûte ce chemisier ?");
    expect(migration).toContain("El tío Lucas era más feo que Picio.");
    expect(migration).toContain("L’oncle Lucas était plus laid que Picio.");
    expect(migration).toContain("— Traduction française :");
  });
});
