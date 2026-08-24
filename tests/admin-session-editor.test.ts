import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const editor = readFileSync("app/administration/lessons/[lessonId].tsx", "utf8");

describe("éditeur administratif des leçons à séances", () => {
  it("charge les brouillons de séances pour un administrateur", () => {
    expect(editor).toContain("getLessonSessions(item.id, { includeInactive: true })");
    expect(editor).toContain("Séances méthodologiques");
  });

  it("affiche et sélectionne le contenu de la séance sans écrire dans le parent", () => {
    expect(editor).toContain("setActiveSessionId(session.id)");
    expect(editor).toContain("<LessonMarkdown content={activeSession.content} />");
    expect(editor).toContain("sessions.length ?");
  });
});
