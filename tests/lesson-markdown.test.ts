import { describe, expect, it } from "vitest";

import { parseLessonMarkdown } from "../lib/lessons/markdown-parser";

describe("parseLessonMarkdown", () => {
  it("reconnaît les titres, paragraphes, listes et encadrés pédagogiques", () => {
    const blocks = parseLessonMarkdown("## Introduction\n\nUn texte avec **une notion**.\n\n- Premier point\n- Second point\n\n> **Définition :**\n> Une notion expliquée.");

    expect(blocks.map((block) => block.type)).toEqual(["heading", "paragraph", "unordered", "callout"]);
    expect(blocks[0]).toMatchObject({ type: "heading", level: 2, text: "Introduction" });
    expect(blocks[2]).toMatchObject({ type: "unordered", items: ["Premier point", "Second point"] });
    expect(blocks[3]).toMatchObject({ type: "callout", lines: ["**Définition :**", "Une notion expliquée."] });
  });

  it("transforme les tableaux Markdown en lignes lisibles sur mobile", () => {
    const blocks = parseLessonMarkdown("| Étape | Action |\n|---|---|\n| 1 | Analyser |\n| 2 | Argumenter |");
    const table = blocks[0];

    expect(table).toMatchObject({
      type: "table",
      headers: ["Étape", "Action"],
      rows: [["1", "Analyser"], ["2", "Argumenter"]],
    });
  });
});
