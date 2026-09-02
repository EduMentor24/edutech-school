export type DictionarySpecializedSense = {
  domain: string;
  definition: string;
  example?: string;
};

export type DictionaryTranslation = {
  language: "en" | "es" | "de";
  value: string;
};

export type DictionaryAssociatedCourse = {
  id: string;
  title: string;
  subject?: string;
  lessonId?: string;
};

export type DictionaryEntry = {
  id: string;
  term: string;
  grammaticalNature?: string;
  etymology?: string;
  generalDefinition: string;
  generalExample?: string;
  philosophicalSense?: { definition: string; example?: string };
  specializedSenses?: DictionarySpecializedSense[];
  synonyms?: string[];
  antonyms?: string[];
  wordFamily?: string[];
  expressions?: string[];
  translations?: DictionaryTranslation[];
  associatedCourses?: DictionaryAssociatedCourse[];
  subject?: string;
  tags?: string[];
  sourceEntryId?: string;
  corpusVersion?: string;
};

export function normalizeDictionaryText(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().trim();
}

export function searchDictionary(entries: DictionaryEntry[], query: string): DictionaryEntry[] {
  const normalizedQuery = normalizeDictionaryText(query);
  if (!normalizedQuery) return entries;

  return entries
    .map((entry, index) => {
      const term = normalizeDictionaryText(entry.term);
      const definition = normalizeDictionaryText(entry.generalDefinition);
      const tags = (entry.tags ?? []).map(normalizeDictionaryText);
      const score = term === normalizedQuery ? 0 : term.startsWith(normalizedQuery) ? 1 : tags.some((tag) => tag.startsWith(normalizedQuery)) ? 2 : definition.includes(normalizedQuery) ? 3 : 99;
      return { entry, score, index };
    })
    .filter(({ score }) => score < 99)
    .sort((left, right) => left.score - right.score || left.index - right.index)
    .map(({ entry }) => entry);
}

export function clampDictionaryRelations(values: string[] | undefined): string[] | undefined {
  return values?.length ? values.slice(0, 3) : undefined;
}

export function hasDictionaryDetails(entry: DictionaryEntry): boolean {
  return Boolean(entry.grammaticalNature || entry.etymology || entry.philosophicalSense || entry.specializedSenses?.length || entry.synonyms?.length || entry.antonyms?.length || entry.wordFamily?.length || entry.expressions?.length || entry.translations?.length || entry.associatedCourses?.length);
}
