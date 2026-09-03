import { describe, expect, it } from "vitest";

import { DICTIONARY_FULL_CORPUS_V1 } from "../lib/dictionary/dictionary-full-corpus";
import { DICTIONARY_VOCABULARY_LOT_200 } from "../lib/dictionary/dictionary-vocabulary-lot-200";
import { searchDictionary } from "../lib/dictionary/dictionary-model";

describe("Dictionnaire — lot vocabulaire 200", () => {
  const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().trim();

  it("contient exactement 200 fiches nouvelles", () => {
    expect(DICTIONARY_VOCABULARY_LOT_200).toHaveLength(200);
    expect(new Set(DICTIONARY_VOCABULARY_LOT_200.map((entry) => entry.id)).size).toBe(200);
    expect(new Set(DICTIONARY_VOCABULARY_LOT_200.map((entry) => normalize(entry.term))).size).toBe(200);
  });

  it("n’entre pas en collision avec les 2 112 fiches du corpus maître", () => {
    const existingTerms = new Set(DICTIONARY_FULL_CORPUS_V1.map((entry) => normalize(entry.term)));
    expect(DICTIONARY_VOCABULARY_LOT_200.every((entry) => !existingTerms.has(normalize(entry.term)))).toBe(true);
    expect(DICTIONARY_VOCABULARY_LOT_200.every((entry) => entry.corpusVersion === "Dictionnaire — Vocabulaire complémentaire lot 200")).toBe(true);
  });

  it("fournit une définition, une nature et un exemple pour chaque nouvelle fiche", () => {
    expect(DICTIONARY_VOCABULARY_LOT_200.every((entry) => entry.grammaticalNature && entry.generalDefinition.length > 40 && entry.generalExample)).toBe(true);
  });

  it("rend le nouveau vocabulaire recherchable sans accents", () => {
    const corpus = [...DICTIONARY_FULL_CORPUS_V1, ...DICTIONARY_VOCABULARY_LOT_200];
    expect(searchDictionary(corpus, "academique")[0]?.term).toBe("Académique");
    expect(searchDictionary(corpus, "geopolitique")[0]?.term).toBe("Géopolitique");
    expect(searchDictionary(corpus, "cyberattaque")[0]?.term).toBe("Cyberattaque");
  });
});
