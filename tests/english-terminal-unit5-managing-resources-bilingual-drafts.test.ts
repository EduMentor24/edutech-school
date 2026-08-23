import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const generator = readFileSync("scripts/prepare-english-terminal-unit5-managing-resources-bilingual-drafts-migration.mjs", "utf8");

describe("lot Anglais Terminale Unit 5 Managing Resources bilingue", () => {
  it("cible A1, A2, C et D et crée seulement la structure A2 manquante", () => {
    ["81c5b295-b5d4-4a7c-a922-0604236a4aa8", "0bc8f25a-432a-441b-8a86-303b452aaf9f", "ff97ed10-ea0d-4e7e-9dd1-8010229c03b6", "94543938-fd4c-4ba8-8205-35f765264719"].forEach((id) => expect(generator).toContain(id));
    expect(generator).toContain("target.offering_id=${qt(a2)}");
  });

  it("préserve le format bilingue et les compétences sources", () => {
    expect(generator).toContain("**Traduction française :**");
    expect(generator).toContain("If we had enough money, we would buy the land");
    expect(generator).toContain("sustainable food system");
    expect(generator).toContain("Writing: an article");
  });

  it("développe la méthode Writing sans inventer de résultat ou de politique", () => {
    expect(generator).toContain("five-part plan");
    expect(generator).toContain("Have I avoided invented statistics, policies or results?");
    expect(generator).toContain("original classroom model");
  });

  it("crée exercices et quiz séparés, inactifs et non publiés sans écrasement", () => {
    expect(generator).toContain("écrasement interdit");
    expect(generator).toContain("from public.lessons le where le.chapter_id=target_chapter_id");
    expect(generator).not.toContain("where chapter_id=chapter_id");
    expect(generator).toContain("target_chapter_id uuid");
    expect(generator).toContain("target_lesson_id uuid");
    expect(generator).toContain("e.lesson_id=target_lesson_id");
    expect(generator).toContain("Exercise 1 — Reading: land grabbing and responsible resources");
    expect(generator).toContain("Exercise 2 — Writing: a sustainable food-system article");
    expect(generator).toContain("false,false");
  });
});
