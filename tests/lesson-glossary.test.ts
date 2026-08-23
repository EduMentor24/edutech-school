import { describe, expect, it } from "vitest";
import { parseLessonInline, stripLessonGlossary } from "../lib/lessons/markdown-parser";
import { buildLessonPdfHtml } from "../lib/lessons/lesson-pdf-html";

describe("vocabulaire Reading interactif", () => {
  it("analyse le terme, sa traduction et sa définition sans casser le gras", () => {
    expect(parseLessonInline("**A [[slum|bidonville|a densely populated poor urban area]] grows.**")).toEqual([
      { type: "bold", value: "A [[slum|bidonville|a densely populated poor urban area]] grows." },
    ]);
    expect(parseLessonInline("A [[slum|bidonville|a densely populated poor urban area]] grows.")).toContainEqual({ type: "glossary", term: "slum", translation: "bidonville", definition: "a densely populated poor urban area" });
  });

  it("conserve uniquement le terme visible dans les exports PDF", () => {
    const content = "A [[slum|bidonville|a densely populated poor urban area]] can grow.";
    expect(stripLessonGlossary(content)).toBe("A slum can grow.");
    const html = buildLessonPdfHtml({ title: "Test", content });
    expect(html).toContain("A slum can grow.");
    expect(html).not.toContain("[[slum|");
  });
});
