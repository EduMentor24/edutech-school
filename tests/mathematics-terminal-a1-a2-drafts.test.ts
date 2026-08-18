import { describe, expect, it } from "vitest";

import { parseLessonMarkdown } from "../lib/lessons/markdown-parser";

const targetLessonIds = {
  functions: ["e156de9b-da20-448f-976b-9a48c6be17b4", "85e5cd41-539e-4ba3-8c8b-392c14a0b026"],
  probability: ["d3b24f26-e5d7-4cae-9dd5-5c6729ea7da3", "1b43a805-c89e-4472-b4c1-45bb7226a822"],
  logarithm: ["aec347c0-a680-4ef1-b4f6-67947a1e600c", "50398ee8-8130-47eb-ad7c-f2ef9f8ad5d0"],
};

describe("brouillons Mathématiques Terminale A1/A2", () => {
  it("cible exclusivement les six leçons A1/A2 confirmées", () => {
    const ids = Object.values(targetLessonIds).flat();

    expect(ids).toHaveLength(6);
    expect(new Set(ids).size).toBe(6);
    expect(ids).not.toContain("8f517237-ef52-4aa1-9a9e-9e303255d22d");
    expect(ids).not.toContain("0fbf9354-ed5c-4d45-b713-adca70eb06b3");
  });

  it("prévoit les blocs de formule adaptés au lecteur mobile", () => {
    const blocks = parseLessonMarkdown("> **Définition :**\n> Une limite décrit un comportement.\n\n$$\nlimₓ→a P(x)=P(a)\n$$\n\n> **Méthode :**\n> Commencer par le domaine.");

    expect(blocks.map((block) => block.type)).toEqual(["callout", "formula", "callout"]);
    expect(blocks[1]).toMatchObject({ type: "formula", value: "limₓ→a P(x)=P(a)" });
  });

  it("conserve la séparation des modules et les statuts de brouillon dans la migration", () => {
    const migrationContract = { lessonIsActive: false, exerciseIsPublished: false, exerciseIsActive: false, quizIsPublished: false, quizIsActive: false, exercisesPerLesson: 2, quizPerLesson: 1 };

    expect(migrationContract).toMatchObject({ lessonIsActive: false, exerciseIsPublished: false, exerciseIsActive: false, quizIsPublished: false, quizIsActive: false, exercisesPerLesson: 2, quizPerLesson: 1 });
  });
});
