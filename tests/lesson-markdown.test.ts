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

  it("reconnaît les formules délimitées et les conserve dans un bloc dédié", () => {
    const blocks = parseLessonMarkdown("## Limite\n\n$$\n\\lim_{x\\to +\\infty} \\frac{\\ln x}{x}=0\n$$\n\n> **Méthode :**\n> Déterminer d’abord l’ensemble de définition.");

    expect(blocks.map((block) => block.type)).toEqual(["heading", "formula", "callout"]);
    expect(blocks[1]).toMatchObject({ type: "formula", value: "\\lim_{x\\to +\\infty} \\frac{\\ln x}{x}=0" });
  });

  it("reconnaît les visuels pédagogiques Computer sans les confondre avec un paragraphe", () => {
    const blocks = parseLessonMarkdown(":::computer-hardware-diagram\n\n:::computer-ports-visual\n\n:::computer-workspace-visual");

    expect(blocks).toEqual([
      { type: "computer_visual", visual: "hardware_diagram" },
      { type: "computer_visual", visual: "ports" },
      { type: "computer_visual", visual: "workspace" },
    ]);
  });

  it("reconnaît l’activité d’association périphériques-ports", () => {
    expect(parseLessonMarkdown(":::peripheral-port-match")).toEqual([{ type: "peripheral_port_match" }]);
  });
});
