import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  "supabase/migrations/20260822_espagnol_terminale_monde_hispanique_bilingual_drafts.sql",
  "utf8",
);

describe("lot Espagnol Terminale : monde hispanique bilingue", () => {
  it("cible strictement les quatre offres Terminale confirmées et protège toute structure déjà présente", () => {
    expect(migration).toContain("942aacbc-1f0c-4eea-9f61-04560b3f3578");
    expect(migration).toContain("48880a58-de13-4485-a45d-ab716b4ca645");
    expect(migration).toContain("0e028469-a443-4b7d-9ed9-6a675193fc24");
    expect(migration).toContain("d496a111-1324-4f92-b557-f5bb402f6bac");
    expect(migration).toContain("Les quatre offres Espagnol Terminale attendues");
    expect(migration).toContain("Une structure Espagnol Terminale existe déjà");
    expect(migration).toContain("for target in");
  });

  it("prépare les trois leçons validées dans l’ordre du lot sans dupliquer la fiche économique", () => {
    expect(migration).toContain("Leçon 2 : Connaître les réalités politiques, sociales et historiques de l’Espagne.");
    expect(migration).toContain("Leçon 3 : Connaître les réalités sociales et historiques de l’Amérique hispanique.");
    expect(migration).toContain("Leçon 4 : Connaître les réalités économiques et sociales de l’Amérique hispanique.");
    expect((migration.match(/insert into public\.lessons/g) ?? []).length).toBe(3);
    expect((migration.match(/lesson_uuid := null/g) ?? []).length).toBe(3);
    expect(migration).toContain("chapter_uuid,'Leçon 2");
    expect(migration).toContain("chapter_uuid,'Leçon 3");
    expect(migration).toContain("chapter_uuid,'Leçon 4");
  });

  it("insère le cours, les exercices et les quiz sous forme de brouillons inactifs", () => {
    expect(migration).toContain("insert into public.chapters");
    expect(migration).toContain("insert into public.exercises");
    expect(migration).toContain("insert into public.exercise_questions");
    expect(migration).toContain("insert into public.quizzes");
    expect(migration).toContain("insert into public.quiz_questions");
    expect(migration).toContain("insert into public.quiz_answers");
    expect((migration.match(/returning id into exercise_a_uuid/g) ?? []).length).toBe(3);
    expect((migration.match(/returning id into exercise_b_uuid/g) ?? []).length).toBe(3);
    expect((migration.match(/returning id into quiz_uuid/g) ?? []).length).toBe(3);
    expect((migration.match(/false,false/g) ?? []).length).toBeGreaterThanOrEqual(9);
    expect(migration).toContain("display_order,is_active");
  });

  it("applique une traduction française immédiate aux contenus espagnols, questions, réponses et corrections", () => {
    expect((migration.match(/\*\*Traduction française :\*\*/g) ?? []).length).toBeGreaterThanOrEqual(70);
    expect(migration).toContain("La guerra civil y la posterior dictadura franquista");
    expect(migration).toContain("La guerre civile et la dictature franquiste");
    expect(migration).toContain("eran los Mayas, los Aztecas y los Incas");
    expect(migration).toContain("étaient les Mayas, les Aztèques et les Incas");
    expect(migration).toContain("Me gustaría viajar en tren");
    expect(migration).toContain("J’aimerais voyager en train");
    expect(migration).toContain("— Traduction française :");
  });
});
