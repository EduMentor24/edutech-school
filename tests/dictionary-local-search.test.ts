import { describe, expect, it } from "vitest";

import {
  hasDictionaryDetails,
  normalizeDictionaryText,
  searchDictionary,
  type DictionaryEntry,
} from "../lib/dictionary/dictionary-model";

const entries: DictionaryEntry[] = [
  {
    id: "droit",
    term: "Droit",
    grammaticalNature: "Nom masculin",
    generalDefinition: "Ensemble de règles qui organisent la vie sociale.",
    philosophicalSense: { definition: "Ce qui est conforme à la justice.", example: "Le droit doit protéger la personne." },
    specializedSenses: [{ domain: "politique", definition: "Pouvoir reconnu par une règle." }],
    translations: [{ language: "en", value: "right / law" }],
    tags: ["justice", "règle"],
  },
  { id: "raison", term: "Raison", generalDefinition: "Faculté de réfléchir et de juger.", tags: ["philosophie"] },
];

describe("dictionary model and local search", () => {
  it("normalizes accents and case", () => {
    expect(normalizeDictionaryText("  ÉTUDIER ")).toBe("etudier");
  });

  it("ranks exact terms before prefixes, tags and definitions", () => {
    expect(searchDictionary(entries, "droit").map((entry) => entry.id)).toEqual(["droit"]);
    expect(searchDictionary(entries, "philo").map((entry) => entry.id)).toEqual(["raison"]);
  });

  it("returns all entries for an empty query and none for an unknown term", () => {
    expect(searchDictionary(entries, "")).toHaveLength(2);
    expect(searchDictionary(entries, "inconnu")).toEqual([]);
  });

  it("supports optional philosophical and specialized senses", () => {
    expect(hasDictionaryDetails(entries[0])).toBe(true);
    expect(hasDictionaryDetails(entries[1])).toBe(false);
  });
});
