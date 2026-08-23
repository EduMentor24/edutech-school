import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const generator = readFileSync("scripts/prepare-computer-science-terminal-foundations-drafts-migration.mjs", "utf8");

describe("lot Informatique / TICE Terminale — fondations du numérique", () => {
  it("cible exactement les quatre offres Terminale A1, A2, C et D", () => {
    [
      "0beafff1-63db-42c9-99a2-8ef6da799f19",
      "7680fb4a-c9d4-41df-92f3-a91effda4944",
      "7695b4cf-0524-4de4-af91-f8d79eed2b0a",
      "f9c030a4-8b30-4657-b7bb-d81e4e500635",
    ].forEach((id) => expect(generator).toContain(id));
  });

  it("présente la progression comme une initiation complémentaire non officielle", () => {
    expect(generator).toContain("parcours complémentaire d’initiation");
    expect(generator).toContain("ne se présente pas comme un programme officiel");
    expect(generator).toContain("Trace du parcours");
  });

  it("couvre appareils, données, vérification, raisonnement et usage responsable de l’IA", () => {
    ["Système d’exploitation", "Donnée personnelle", "Qui publie ?", "algorithme", "responsabilité humaine"].forEach((term) => expect(generator).toContain(term));
  });

  it("crée cours, deux exercices et deux quiz séparés, inactifs et non publiés", () => {
    expect(generator).toContain("Exercice 1 — Identifier et organiser son environnement numérique");
    expect(generator).toContain("Exercice 2 — Décider et écrire une procédure responsable");
    expect(generator).toContain("Quiz 1 — Vocabulaire de l’environnement numérique");
    expect(generator).toContain("Quiz 2 — Choix responsables et raisonnement par étapes");
    expect(generator).toContain("false,false,20,10,false");
    expect(generator).toContain("false,false,false");
  });

  it("interdit les doublons et évite les références SQL ambiguës", () => {
    expect(generator).toContain("duplication ou écrasement interdit");
    expect(generator).toContain("target_chapter_id uuid");
    expect(generator).toContain("target_lesson_id uuid");
    expect(generator).not.toContain("where chapter_id=chapter_id");
    expect(generator).not.toContain("where lesson_id=lesson_id");
    expect(generator).toContain("c.subject_offering_id=target.offering_id");
  });
});
