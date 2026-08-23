import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const screen = readFileSync("app/administration/lessons.tsx", "utf8");
const dashboard = readFileSync("app/administration.tsx", "utf8");

describe("interface de publication groupée", () => {
  it("expose une publication distincte par chapitre et par unité", () => {
    expect(screen).toContain('requestPublication("chapter", selectedChapter.id');
    expect(screen).toContain('requestPublication("lesson", item.id');
    expect(screen).toContain("Publication groupée");
  });

  it("affiche un aperçu puis exige une confirmation explicite", () => {
    expect(screen).toContain("previewContentPublication");
    expect(screen).toContain("Alert.alert");
    expect(screen).toContain('text: "Publier"');
    expect(screen).toContain("publishContentScope");
  });

  it("reste accessible depuis le tableau de bord administratif", () => {
    expect(dashboard).toContain("publication groupée par chapitre ou unité");
    expect(dashboard).toContain('route: "/administration/lessons"');
  });
});
