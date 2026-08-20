import { describe, expect, it } from "vitest";
import { citationMatches, citationNotionsForSubject, citationShareText, citationTitleFromText, normalizeCitationSearch, validateCitationInput, type Citation, type CitationInput } from "../lib/citations/citation-model";

const citation: Citation = { id: "citation-1", quoteText: "Les hommes naissent et demeurent libres et égaux en droits.", author: "Assemblée nationale constituante", subjectId: "subject-1", subjectName: "Histoire-Géographie", sourceTitle: "Déclaration des droits de l’homme", sourceReference: "Article premier", sourceUrl: null, pedagogicalExplanation: "Une référence aux droits et à l’égalité.", keywords: ["égalité", "droits"], themes: ["Liberté"], isActive: true, isValidated: true, createdAt: "2026-01-01", updatedAt: "2026-01-01" };
const validInput: CitationInput = { ...citation, themes: ["Liberté"], levelIds: ["level-1"], seriesIds: [] };

describe("règles Citations", () => {
  it("normalise les accents pour une recherche tolérante", () => expect(normalizeCitationSearch("ÉGALITÉ")).toBe("egalite"));
  it("trouve une citation par thème, mot-clé et auteur", () => { expect(citationMatches(citation, "liberte")).toBe(true); expect(citationMatches(citation, "droits")).toBe(true); expect(citationMatches(citation, "constituante")).toBe(true); });
  it("isole les notions du corpus de la matière sélectionnée", () => { const physics = { ...citation, id: "citation-2", subjectName: "Physique-Chimie", themes: ["Méthode", "Expérimentation"] }; const history = { ...citation, id: "citation-3", subjectName: "Histoire-Géographie", themes: ["Méthode", "Droits humains"] }; expect(citationNotionsForSubject([physics, history], "Physique-Chimie")).toEqual(["Expérimentation", "Méthode"]); expect(citationNotionsForSubject([physics, history], "Histoire-Géographie")).toEqual(["Droits humains", "Méthode"]); expect(citationNotionsForSubject([physics, history], null)).toEqual([]); });
  it("génère un texte de partage attribué", () => expect(citationShareText(citation)).toContain("Assemblée nationale constituante"));
  it("refuse la publication sans validation et une citation sans portée", () => { expect(validateCitationInput({ ...validInput, isActive: true, isValidated: false })).toContain("validée"); expect(validateCitationInput({ ...validInput, levelIds: [] })).toContain("niveau"); });
  it("crée un titre d’historique court sans inventer de résumé", () => expect(citationTitleFromText("  Une question très longue ".repeat(8)).endsWith("…")).toBe(true));
});
