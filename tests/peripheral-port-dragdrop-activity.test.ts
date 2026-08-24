import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
const migration = readFileSync("scripts/prepare-peripheral-port-dragdrop-activity-migration.mjs", "utf8");
const reader = readFileSync("components/edutech/lesson-markdown.tsx", "utf8");
describe("activité glisser-déposer périphériques et ports", () => {
  it("prévoit le glisser-déposer et une sélection de repli accessible", () => {
    ["PanResponder", "Glissez un périphérique", "touchez un port", "Recommencer", "Port USB", "Port HDMI", "Prise audio"].forEach((value) => expect(reader).toContain(value));
  });
  it("annote seulement les quatre brouillons Périphériques", () => {
    expect(migration).toContain("target_count<>4");
    expect(migration).toContain("l.is_active=false");
    expect(migration).toContain(":::peripheral-port-match");
  });
  it("ne crée pas de module de quiz ou exercice dupliqué", () => {
    expect(migration).not.toContain("insert into public.exercises");
    expect(migration).not.toContain("insert into public.quizzes");
  });
});
