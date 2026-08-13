export type HeadingBlock = { type: "heading"; level: 2 | 3; text: string };
export type ParagraphBlock = { type: "paragraph"; text: string };
export type ListBlock = { type: "unordered" | "ordered"; items: string[] };
export type CalloutBlock = { type: "callout"; title: string | null; lines: string[] };
export type TableBlock = { type: "table"; headers: string[]; rows: string[][] };
export type RuleBlock = { type: "rule" };

export type LessonMarkdownBlock = HeadingBlock | ParagraphBlock | ListBlock | CalloutBlock | TableBlock | RuleBlock;

const isRule = (line: string) => /^\s*---\s*$/.test(line);
const isHeading = (line: string) => /^(#{2,3})\s+/.test(line);
const isUnordered = (line: string) => /^\s*-\s+/.test(line);
const isOrdered = (line: string) => /^\s*\d+\.\s+/.test(line);
const isTableLine = (line: string) => /^\s*\|.*\|\s*$/.test(line);
const isTableSeparator = (line: string) => /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);

function normalizeInline(text: string) {
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 — $2");
}

function tableCells(line: string) {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
}

/** Parses the safe, limited Markdown dialect used by EduTech School lessons. */
export function parseLessonMarkdown(markdown: string): LessonMarkdownBlock[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: LessonMarkdownBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const trimmed = lines[index].trim();
    if (!trimmed) { index += 1; continue; }
    if (isRule(trimmed)) { blocks.push({ type: "rule" }); index += 1; continue; }

    const heading = trimmed.match(/^(#{2,3})\s+(.+)$/);
    if (heading) { blocks.push({ type: "heading", level: heading[1].length as 2 | 3, text: normalizeInline(heading[2]) }); index += 1; continue; }

    if (trimmed.startsWith(">")) {
      const quoteLines: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith(">")) {
        quoteLines.push(lines[index].trim().replace(/^>\s?/, ""));
        index += 1;
      }
      const first = quoteLines[0] ?? "";
      const calloutHeading = first.match(/^#{1,3}\s+(.+)$/);
      blocks.push({ type: "callout", title: calloutHeading ? normalizeInline(calloutHeading[1]) : null, lines: (calloutHeading ? quoteLines.slice(1) : quoteLines).filter(Boolean).map(normalizeInline) });
      continue;
    }

    if (isTableLine(trimmed)) {
      const tableLines: string[] = [];
      while (index < lines.length && isTableLine(lines[index].trim())) { tableLines.push(lines[index]); index += 1; }
      const dataLines = tableLines.filter((tableLine) => !isTableSeparator(tableLine));
      const [headerLine, ...rowLines] = dataLines;
      if (headerLine) blocks.push({ type: "table", headers: tableCells(headerLine).map(normalizeInline), rows: rowLines.map(tableCells).map((row) => row.map(normalizeInline)) });
      continue;
    }

    if (isUnordered(trimmed) || isOrdered(trimmed)) {
      const ordered = isOrdered(trimmed);
      const items: string[] = [];
      const matcher = ordered ? /^\s*\d+\.\s+(.+)$/ : /^\s*-\s+(.+)$/;
      while (index < lines.length) {
        const item = lines[index].match(matcher);
        if (!item) break;
        items.push(normalizeInline(item[1]));
        index += 1;
      }
      blocks.push({ type: ordered ? "ordered" : "unordered", items });
      continue;
    }

    const paragraphLines: string[] = [];
    while (index < lines.length) {
      const candidate = lines[index].trim();
      if (!candidate || isRule(candidate) || isHeading(candidate) || candidate.startsWith(">") || isTableLine(candidate) || isUnordered(candidate) || isOrdered(candidate)) break;
      paragraphLines.push(candidate);
      index += 1;
    }
    blocks.push({ type: "paragraph", text: normalizeInline(paragraphLines.join(" ")) });
  }

  return blocks;
}
