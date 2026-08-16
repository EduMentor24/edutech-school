export type Citation = {
  id: string;
  quoteText: string;
  author: string;
  subjectId: string;
  subjectName: string;
  sourceTitle: string | null;
  sourceReference: string | null;
  sourceUrl: string | null;
  pedagogicalExplanation: string | null;
  keywords: string[];
  themes: string[];
  isActive: boolean;
  isValidated: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CitationInput = Omit<Citation, "id" | "subjectName" | "themes" | "createdAt" | "updatedAt"> & {
  themes: string[];
  levelIds: string[];
  seriesIds: string[];
};

export function normalizeCitationSearch(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr-FR").trim();
}

export function citationMatches(citation: Citation, search: string) {
  const needle = normalizeCitationSearch(search);
  if (!needle) return true;
  return [citation.quoteText, citation.author, citation.subjectName, citation.sourceTitle ?? "", citation.sourceReference ?? "", citation.pedagogicalExplanation ?? "", ...citation.keywords, ...citation.themes].some((value) => normalizeCitationSearch(value).includes(needle));
}

export function citationShareText(citation: Citation) {
  const source = [citation.sourceTitle, citation.sourceReference].filter(Boolean).join(" · ");
  return `« ${citation.quoteText} »\n— ${citation.author}${source ? `, ${source}` : ""}\n\nEduTech School`;
}

export function citationTitleFromText(value: string) {
  const compact = value.replace(/\s+/g, " ").trim();
  return compact.length <= 52 ? compact : `${compact.slice(0, 49).trimEnd()}…`;
}

export function validateCitationInput(input: CitationInput) {
  if (input.quoteText.trim().length < 2) return "Le texte de la citation est obligatoire.";
  if (input.author.trim().length < 2) return "L’auteur ou l’attribution est obligatoire.";
  if (!input.subjectId) return "Choisissez une matière.";
  if (!input.levelIds.length) return "Associez au moins un niveau scolaire.";
  if (input.isActive && !input.isValidated) return "Une citation active doit d’abord être validée.";
  return null;
}
