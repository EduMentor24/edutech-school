import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const lessonReader = readFileSync("app/course/lesson/[lessonId].tsx", "utf8");

describe("export PDF temporairement désactivé dans les leçons", () => {
  it("retire les actions visibles et leurs appels depuis le lecteur de leçon", () => {
    expect(lessonReader).not.toContain("lesson-pdf-service");
    expect(lessonReader).not.toContain("handlePdf");
    expect(lessonReader).not.toContain("Cours en PDF");
  });
});
