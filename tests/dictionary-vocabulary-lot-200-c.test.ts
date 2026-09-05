import { describe, expect, it } from "vitest";

import { searchDictionary, normalizeDictionaryText } from "../lib/dictionary/dictionary-model";
import { DICTIONARY_FULL_CORPUS_V1 } from "../lib/dictionary/dictionary-full-corpus";
import { DICTIONARY_VOCABULARY_LOT_200 } from "../lib/dictionary/dictionary-vocabulary-lot-200";
import { DICTIONARY_VOCABULARY_LOT_200_B } from "../lib/dictionary/dictionary-vocabulary-lot-200-b";
import { DICTIONARY_VOCABULARY_LOT_200_C } from "../lib/dictionary/dictionary-vocabulary-lot-200-c";

describe("Dictionnaire — lot 200 C", () => {
  it("contient exactement 200 fiches nouvelles et riches", () => {
    expect(DICTIONARY_VOCABULARY_LOT_200_C).toHaveLength(200);
    const terms = DICTIONARY_VOCABULARY_LOT_200_C.map((entry) => normalizeDictionaryText(entry.term));
    expect(new Set(terms).size).toBe(200);
    for (const entry of DICTIONARY_VOCABULARY_LOT_200_C) {
      expect(entry.id).toMatch(/^dictionary-vocabulary-lot-200-c-/);
      expect(entry.grammaticalNature).toBeTruthy();
      expect(entry.generalDefinition.length).toBeGreaterThanOrEqual(40);
      expect(entry.generalExample).toBeTruthy();
      expect(entry.synonyms?.length).toBeGreaterThan(0);
      expect(entry.wordFamily?.length).toBeGreaterThan(0);
      expect(entry.expressions?.length).toBeGreaterThan(0);
      expect(entry.translations).toHaveLength(3);
      expect(entry.tags).toContain("lot-200-c");
    }
  });

  it("ne recoupe aucun corpus déjà livré", () => {
    const previous = [
      ...DICTIONARY_FULL_CORPUS_V1,
      ...DICTIONARY_VOCABULARY_LOT_200,
      ...DICTIONARY_VOCABULARY_LOT_200_B,
    ].map((entry) => normalizeDictionaryText(entry.term));
    const current = DICTIONARY_VOCABULARY_LOT_200_C.map((entry) => normalizeDictionaryText(entry.term));
    expect(current.some((term) => previous.includes(term))).toBe(false);
    expect(new Set([...previous, ...current]).size).toBe(previous.length + 200);
  });

  it("conserve les anciennes fiches et expose le mot-témoin par recherche accent-insensible", () => {
    const combined = [
      ...DICTIONARY_FULL_CORPUS_V1,
      ...DICTIONARY_VOCABULARY_LOT_200,
      ...DICTIONARY_VOCABULARY_LOT_200_B,
      ...DICTIONARY_VOCABULARY_LOT_200_C,
    ];
    expect(combined).toHaveLength(2712);
    expect(searchDictionary(combined, "acquerir").some((entry) => entry.term === "acquérir")).toBe(true);
  });
});
