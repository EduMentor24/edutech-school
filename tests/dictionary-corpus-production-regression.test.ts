import { describe, expect, it } from "vitest";

import { DICTIONARY_FULL_CORPUS_V1 } from "../lib/dictionary/dictionary-full-corpus";
import { DICTIONARY_VOCABULARY_LOT_200 } from "../lib/dictionary/dictionary-vocabulary-lot-200";
import { DICTIONARY_VOCABULARY_LOT_200_B } from "../lib/dictionary/dictionary-vocabulary-lot-200-b";
import { DICTIONARY_VOCABULARY_LOT_200_C } from "../lib/dictionary/dictionary-vocabulary-lot-200-c";
import { DICTIONARY_VOCABULARY_LOT_300_D } from "../lib/dictionary/dictionary-vocabulary-lot-300-d";
import { DICTIONARY_VOCABULARY_LOT_300_E } from "../lib/dictionary/dictionary-vocabulary-lot-300-e";

const assembleProductionCorpus = () => [
  ...DICTIONARY_FULL_CORPUS_V1,
  ...DICTIONARY_VOCABULARY_LOT_200,
  ...DICTIONARY_VOCABULARY_LOT_200_B,
  ...DICTIONARY_VOCABULARY_LOT_200_C,
  ...DICTIONARY_VOCABULARY_LOT_300_D,
  ...DICTIONARY_VOCABULARY_LOT_300_E,
];

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().trim();

describe("Dictionnaire — régression du corpus production", () => {
  const corpus = assembleProductionCorpus();

  it("contient exactement 3 312 entrées après assemblage", () => {
    expect(corpus).toHaveLength(3312);
  });

  it("ne contient aucun doublon d’identifiant", () => {
    expect(new Set(corpus.map((entry) => entry.id)).size).toBe(corpus.length);
  });

  it("ne contient aucun doublon de terme normalisé", () => {
    expect(new Set(corpus.map((entry) => normalize(entry.term))).size).toBe(corpus.length);
  });

  it("le lot 300-E est effectivement présent dans le corpus assemblé", () => {
    const lot300EIds = new Set(DICTIONARY_VOCABULARY_LOT_300_E.map((entry) => entry.id));
    const assembledIds = corpus.map((entry) => entry.id);
    expect(DICTIONARY_VOCABULARY_LOT_300_E).toHaveLength(300);
    expect(lot300EIds.size).toBe(300);
    for (const id of lot300EIds) {
      expect(assembledIds).toContain(id);
    }
  });

  it("aucune entrée du lot 300-E n’est perdue lors de l’assemblage", () => {
    const assembledById = new Map(corpus.map((entry) => [entry.id, entry]));
    for (const entry of DICTIONARY_VOCABULARY_LOT_300_E) {
      const assembled = assembledById.get(entry.id);
      expect(assembled).toBeDefined();
      expect(assembled?.term).toBe(entry.term);
      expect(assembled?.sourceEntryId).toBe(entry.sourceEntryId);
      expect(assembled?.corpusVersion).toBe("Dictionnaire — Vocabulaire complémentaire lot 300-e");
    }
  });
});