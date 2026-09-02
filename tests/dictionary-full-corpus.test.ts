import { describe, expect, it } from "vitest";

import { DICTIONARY_FULL_CORPUS_V1 } from "../lib/dictionary/dictionary-full-corpus";
import { searchDictionary } from "../lib/dictionary/dictionary-model";

describe("Dictionnaire — corpus complet V1", () => {
  it("contient exactement une fiche pour chacune des 2 112 entrées source", () => {
    expect(DICTIONARY_FULL_CORPUS_V1).toHaveLength(2112);
    expect(new Set(DICTIONARY_FULL_CORPUS_V1.map((entry) => entry.sourceEntryId)).size).toBe(2112);
    expect(new Set(DICTIONARY_FULL_CORPUS_V1.map((entry) => entry.term.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())).size).toBe(2112);
  });

  it("conserve la définition générale et la traçabilité de chaque entrée", () => {
    expect(DICTIONARY_FULL_CORPUS_V1.every((entry) => entry.generalDefinition.length > 0)).toBe(true);
    expect(DICTIONARY_FULL_CORPUS_V1.every((entry) => entry.corpusVersion === "Dictionnaire — Corpus complet V1")).toBe(true);
  });

  it("conserve les enrichissements disponibles sans créer de cours fictifs", () => {
    expect(DICTIONARY_FULL_CORPUS_V1.filter((entry) => entry.generalExample).length).toBe(50);
    expect(DICTIONARY_FULL_CORPUS_V1.filter((entry) => entry.translations?.length).length).toBe(50);
    expect(DICTIONARY_FULL_CORPUS_V1.every((entry) => !entry.associatedCourses?.length)).toBe(true);
  });

  it("recherche les termes complets sans tenir compte des accents ni de la casse", () => {
    expect(searchDictionary(DICTIONARY_FULL_CORPUS_V1, "liberte")[0]?.term).toBe("Liberté");
    expect(searchDictionary(DICTIONARY_FULL_CORPUS_V1, "sOUvErAiNeTe")[0]?.term).toBe("Souveraineté");
    expect(searchDictionary(DICTIONARY_FULL_CORPUS_V1, "raison")[0]?.term).toBe("Raison");
  });
});
