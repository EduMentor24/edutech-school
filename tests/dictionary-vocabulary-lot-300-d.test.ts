import { describe, expect, it } from "vitest";
import { DICTIONARY_FULL_CORPUS_V1 } from "../lib/dictionary/dictionary-full-corpus";
import { DICTIONARY_VOCABULARY_LOT_200 } from "../lib/dictionary/dictionary-vocabulary-lot-200";
import { DICTIONARY_VOCABULARY_LOT_200_B } from "../lib/dictionary/dictionary-vocabulary-lot-200-b";
import { DICTIONARY_VOCABULARY_LOT_200_C } from "../lib/dictionary/dictionary-vocabulary-lot-200-c";
import { DICTIONARY_VOCABULARY_LOT_300_D } from "../lib/dictionary/dictionary-vocabulary-lot-300-d";

type Entry = (typeof DICTIONARY_VOCABULARY_LOT_300_D)[number];
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().trim();
const previous = [...DICTIONARY_FULL_CORPUS_V1, ...DICTIONARY_VOCABULARY_LOT_200, ...DICTIONARY_VOCABULARY_LOT_200_B, ...DICTIONARY_VOCABULARY_LOT_200_C];

const fieldCount = (entry: Entry) => [entry.synonyms?.length, entry.antonyms?.length, entry.wordFamily?.length, entry.expressions?.length, entry.translations?.length, entry.specializedSenses?.length, entry.philosophicalSense ? 1 : 0].filter((count) => (count ?? 0) > 0).length;

describe("Dictionnaire — lot de vocabulaire 300-D", () => {
  it("contient exactement 300 fiches nouvelles et non dupliquées", () => {
    expect(DICTIONARY_VOCABULARY_LOT_300_D).toHaveLength(300);
    const previousTerms = new Set(previous.map((entry) => normalize(entry.term)));
    const lotTerms = DICTIONARY_VOCABULARY_LOT_300_D.map((entry) => normalize(entry.term));
    expect(new Set(lotTerms).size).toBe(300);
    expect(lotTerms.some((term) => previousTerms.has(term))).toBe(false);
  });

  it("respecte le socle lexical et conserve un enrichissement par fiche", () => {
    for (const entry of DICTIONARY_VOCABULARY_LOT_300_D) {
      expect(entry.term.length).toBeGreaterThan(1);
      expect((entry.grammaticalNature ?? "").length).toBeGreaterThan(2);
      expect(entry.generalDefinition.length).toBeGreaterThan(80);
      expect((entry.generalExample ?? "").length).toBeGreaterThan(20);
      expect(entry.wordFamily?.length).toBeGreaterThan(0);
      expect(entry.translations).toHaveLength(3);
      expect(fieldCount(entry)).toBeGreaterThanOrEqual(3);
    }
  });

  it("contient le mot-témoin et prend en charge la recherche sans accents", () => {
    const witness = DICTIONARY_VOCABULARY_LOT_300_D.find((entry) => entry.term === "acclimatation");
    expect(witness).toBeDefined();
    const query = normalize("acclimatation");
    expect(DICTIONARY_VOCABULARY_LOT_300_D.some((entry) => normalize(entry.term).includes(query))).toBe(true);
  });
});
