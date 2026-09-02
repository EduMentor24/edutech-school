import { describe, expect, it } from "vitest";

import { DICTIONARY_TEST_CORPUS_V1 } from "../lib/dictionary/dictionary-test-corpus";
import { searchDictionary } from "../lib/dictionary/dictionary-model";

describe("Dictionnaire — corpus de test V1", () => {
  it("contient exactement 50 entrées source uniques", () => {
    expect(DICTIONARY_TEST_CORPUS_V1).toHaveLength(50);
    expect(new Set(DICTIONARY_TEST_CORPUS_V1.map((entry) => entry.sourceEntryId)).size).toBe(50);
    expect(new Set(DICTIONARY_TEST_CORPUS_V1.map((entry) => entry.term.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())).size).toBe(50);
  });

  it("conserve la version V1 et la définition source de chaque fiche", () => {
    expect(DICTIONARY_TEST_CORPUS_V1.every((entry) => entry.corpusVersion === "Dictionnaire — Corpus de test V1")).toBe(true);
    expect(DICTIONARY_TEST_CORPUS_V1.every((entry) => entry.generalDefinition.length > 0)).toBe(true);
  });

  it("recherche les fiches localement avec ou sans accents et sans tenir compte de la casse", () => {
    expect(searchDictionary(DICTIONARY_TEST_CORPUS_V1, "liberte")[0]?.term).toBe("Liberté");
    expect(searchDictionary(DICTIONARY_TEST_CORPUS_V1, "JUSTICE")[0]?.term).toBe("Justice");
    expect(searchDictionary(DICTIONARY_TEST_CORPUS_V1, "souverain")[0]?.term).toBe("Souveraineté");
  });

  it("n’ajoute aucun cours associé fictif", () => {
    expect(DICTIONARY_TEST_CORPUS_V1.every((entry) => !entry.associatedCourses?.length)).toBe(true);
  });
});
