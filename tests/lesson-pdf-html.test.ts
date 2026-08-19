import { describe, expect, it } from "vitest";
import { buildLessonPdfHtml } from "../lib/lessons/lesson-pdf-html";

describe("générateur PDF de leçon", () => {
  const html = buildLessonPdfHtml({ title: "Leçon test", description: "Une description", content: "## Partie\n\n> **Définition**\n> Notion clé.\n\n$$\nf(x)=x²\n$$\n\n| A | B |\n|---|---|\n| 1 | 2 |" });

  it("préserve la hiérarchie, les encadrés et les formules", () => {
    expect(html).toContain("<h2>Partie</h2>");
    expect(html).toContain('class="callout definition"');
    expect(html).toContain('class="formula"');
    expect(html).toContain("f(x)=x²");
    expect(html).toContain("<table>");
  });

  it("échappe le contenu fourni par une leçon", () => {
    const safe = buildLessonPdfHtml({ title: "<script>", content: "Texte <b>" });
    expect(safe).toContain("&lt;script&gt;");
    expect(safe).toContain("&lt;b&gt;");
    expect(safe).not.toContain("<script>");
  });
});
