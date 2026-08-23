import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const generator = readFileSync("scripts/prepare-computer-science-terminal-digital-security-interactive-drafts-migration.mjs", "utf8");

describe("chapitre Informatique / TICE Terminale — sécurité numérique interactive", () => {
  it("cible exactement les quatre offres Terminale A1, A2, C et D", () => {
    [
      "0beafff1-63db-42c9-99a2-8ef6da799f19",
      "7680fb4a-c9d4-41df-92f3-a91effda4944",
      "7695b4cf-0524-4de4-af91-f8d79eed2b0a",
      "f9c030a4-8b30-4657-b7bb-d81e4e500635",
    ].forEach((id) => expect(generator).toContain(id));
  });

  it("crée trois leçons distinctes de prévention sans présenter le parcours comme officiel", () => {
    expect(generator).toContain("parcours complémentaire d’initiation");
    expect(generator).toContain("Protéger ses comptes et ses appareils");
    expect(generator).toContain("Repérer une tentative d’hameçonnage et vérifier avant d’agir");
    expect(generator).toContain("Vie privée, traces numériques et réaction face à une situation préoccupante");
  });

  it("intègre des mises en situation responsables et orientées vers la protection", () => {
    ["Le code que l’on te demande", "L’alerte de remise de devoir", "Une photo repartagée sans accord", "ne fournit aucune procédure d’intrusion"].forEach((term) => expect(generator).toContain(term));
  });

  it("sépare les mises en situation, exercices de consolidation et quiz", () => {
    expect(generator).toContain("Mise en situation ${index + 1}");
    expect(generator).toContain("Exercice de consolidation ${index + 1}");
    expect(generator).toContain("Quiz ${index + 1}A");
    expect(generator).toContain("Quiz ${index + 1}B");
    expect(generator).toContain("exercise_questions");
    expect(generator).toContain("quiz_questions");
    expect(generator).toContain("quiz_answers");
  });

  it("préserve les brouillons, les gardes anti-doublon et les variables SQL non ambiguës", () => {
    expect(generator).toContain("duplication ou écrasement interdit");
    expect(generator).toContain("target_chapter_id uuid");
    expect(generator).toContain("target_lesson_id uuid");
    expect(generator).toContain("false,false,false");
    expect(generator).not.toContain("where chapter_id=chapter_id");
    expect(generator).not.toContain("where lesson_id=lesson_id");
  });
});
