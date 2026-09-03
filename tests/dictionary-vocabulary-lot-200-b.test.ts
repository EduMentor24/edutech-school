import { describe, expect, it } from "vitest";

import { DICTIONARY_FULL_CORPUS_V1 } from "../lib/dictionary/dictionary-full-corpus";
import { DICTIONARY_VOCABULARY_LOT_200 } from "../lib/dictionary/dictionary-vocabulary-lot-200";
import { DICTIONARY_VOCABULARY_LOT_200_B } from "../lib/dictionary/dictionary-vocabulary-lot-200-b";
import { searchDictionary } from "../lib/dictionary/dictionary-model";

describe("Dictionnaire — lot vocabulaire 200 B", () => {
  const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().trim();

  it("contient exactement 200 fiches nouvelles et uniques", () => {
    expect(DICTIONARY_VOCABULARY_LOT_200_B).toHaveLength(200);
    expect(new Set(DICTIONARY_VOCABULARY_LOT_200_B.map((entry) => entry.id)).size).toBe(200);
    expect(new Set(DICTIONARY_VOCABULARY_LOT_200_B.map((entry) => normalize(entry.term))).size).toBe(200);
  });

  it("ne collisionne avec aucun corpus antérieur", () => {
    const allPrior = [...DICTIONARY_FULL_CORPUS_V1, ...DICTIONARY_VOCABULARY_LOT_200].map((entry) => normalize(entry.term));
    const priorTerms = new Set(allPrior);
    expect(DICTIONARY_VOCABULARY_LOT_200_B.every((entry) => !priorTerms.has(normalize(entry.term)))).toBe(true);
    expect(new Set([...allPrior, ...DICTIONARY_VOCABULARY_LOT_200_B.map((entry) => normalize(entry.term))]).size).toBe(2512);
  });

  it("contient une fiche pédagogique minimale complète pour chaque terme", () => {
    expect(DICTIONARY_VOCABULARY_LOT_200_B.every((entry) => entry.grammaticalNature && entry.generalDefinition.length > 40 && entry.generalExample && entry.tags?.includes("lot-200-b") === true)).toBe(true);
  });

  it("rend les nouveaux termes recherchables sans accents", () => {
    const corpus = [...DICTIONARY_FULL_CORPUS_V1, ...DICTIONARY_VOCABULARY_LOT_200, ...DICTIONARY_VOCABULARY_LOT_200_B];
    expect(searchDictionary(corpus, "masse volumique")[0]?.term).toBe("Masse volumique");
    expect(searchDictionary(corpus, "deontologie")[0]?.term).toBe("déontologie");
    expect(searchDictionary(corpus, "interdisciplinarite")[0]?.term).toBe("Interdisciplinarité");
  });
});
