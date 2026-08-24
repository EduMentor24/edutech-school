export type HeadingBlock = { type: "heading"; level: 2 | 3; text: string };
export type ParagraphBlock = { type: "paragraph"; text: string };
export type ListBlock = { type: "unordered" | "ordered"; items: string[] };
export type CalloutBlock = { type: "callout"; title: string | null; lines: string[] };
export type FormulaBlock = { type: "formula"; value: string };
export type TableBlock = { type: "table"; headers: string[]; rows: string[][] };
export type RuleBlock = { type: "rule" };
export type ComputerVisualBlock = { type: "computer_visual"; visual: "hardware_diagram" | "ports" | "workspace" };
export type PeripheralPortMatchBlock = { type: "peripheral_port_match" };
export type ChemistryReactionBlock = { type: "chemistry_reaction"; reaction: "carboxylic" | "soap" | "acid_base" };
export type TrajectorySimulatorBlock = { type: "trajectory_simulator" };
export type ForceDiagramBlock = { type: "force_diagram"; diagram: "solid" | "satellite" | "projectile" | "oscillator" | "laplace" };

export type LessonGlossaryTerm = { type: "glossary"; term: string; translation: string; definition: string };
export type LessonInlineToken = { type: "text"; value: string } | { type: "bold"; value: string } | LessonGlossaryTerm;

export type LessonMarkdownBlock = HeadingBlock | ParagraphBlock | ListBlock | CalloutBlock | FormulaBlock | TableBlock | RuleBlock | ComputerVisualBlock | PeripheralPortMatchBlock | ChemistryReactionBlock | TrajectorySimulatorBlock | ForceDiagramBlock;

const isRule = (line: string) => /^\s*---\s*$/.test(line);
const isHeading = (line: string) => /^(#{2,3})\s+/.test(line);
const isUnordered = (line: string) => /^\s*-\s+/.test(line);
const isOrdered = (line: string) => /^\s*\d+\.\s+/.test(line);
const isTableLine = (line: string) => /^\s*\|.*\|\s*$/.test(line);
const isTableSeparator = (line: string) => /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
const isFormulaFence = (line: string) => /^\$\$\s*$/.test(line);
const computerVisual = (line: string): ComputerVisualBlock["visual"] | null => {
  if (/^:::computer-hardware-diagram\s*$/.test(line)) return "hardware_diagram";
  if (/^:::computer-ports-visual\s*$/.test(line)) return "ports";
  if (/^:::computer-workspace-visual\s*$/.test(line)) return "workspace";
  return null;
};
const isPeripheralPortMatch = (line: string) => /^:::peripheral-port-match\s*$/.test(line);
const chemistryReaction = (line: string): ChemistryReactionBlock["reaction"] | null => {
  if (/^:::chemistry-reaction-carboxylic\s*$/.test(line)) return "carboxylic";
  if (/^:::chemistry-reaction-soap\s*$/.test(line)) return "soap";
  if (/^:::chemistry-reaction-acid-base\s*$/.test(line)) return "acid_base";
  return null;
};
const isTrajectorySimulator = (line: string) => /^:::trajectory-simulator-uniform-fields\s*$/.test(line);
const forceDiagram = (line: string): ForceDiagramBlock["diagram"] | null => {
  if (/^:::force-diagram-solid\s*$/.test(line)) return "solid";
  if (/^:::force-diagram-satellite\s*$/.test(line)) return "satellite";
  if (/^:::force-diagram-projectile\s*$/.test(line)) return "projectile";
  if (/^:::force-diagram-oscillator\s*$/.test(line)) return "oscillator";
  if (/^:::force-diagram-laplace\s*$/.test(line)) return "laplace";
  return null;
};

function normalizeInline(text: string) {
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 — $2");
}

/** Parses inline bold text and the safe glossary syntax [[term|traduction|définition]]. */
export function parseLessonInline(value: string): LessonInlineToken[] {
  const tokens: LessonInlineToken[] = [];
  const matcher = /(\*\*[^*]+\*\*|\[\[[^\]]+\]\])/g;
  let cursor = 0;
  let match: RegExpExecArray | null;
  while ((match = matcher.exec(value))) {
    if (match.index > cursor) tokens.push({ type: "text", value: value.slice(cursor, match.index) });
    const marker = match[0];
    if (marker.startsWith("**")) {
      tokens.push({ type: "bold", value: marker.slice(2, -2) });
    } else {
      const parts = marker.slice(2, -2).split("|").map((part) => part.trim());
      if (parts.length === 3 && parts.every(Boolean)) tokens.push({ type: "glossary", term: parts[0], translation: parts[1], definition: parts[2] });
      else tokens.push({ type: "text", value: marker });
    }
    cursor = match.index + marker.length;
  }
  if (cursor < value.length) tokens.push({ type: "text", value: value.slice(cursor) });
  return tokens.length ? tokens : [{ type: "text", value }];
}

/** Converts glossary markers to their visible term for non-interactive renderers such as PDF export. */
export function stripLessonGlossary(value: string) {
  return parseLessonInline(value).map((token) => token.type === "glossary" ? token.term : token.value).join("");
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
    const visual = computerVisual(trimmed);
    if (visual) { blocks.push({ type: "computer_visual", visual }); index += 1; continue; }
    if (isPeripheralPortMatch(trimmed)) { blocks.push({ type: "peripheral_port_match" }); index += 1; continue; }
    const reaction = chemistryReaction(trimmed);
    if (reaction) { blocks.push({ type: "chemistry_reaction", reaction }); index += 1; continue; }
    if (isTrajectorySimulator(trimmed)) { blocks.push({ type: "trajectory_simulator" }); index += 1; continue; }
    const diagram = forceDiagram(trimmed);
    if (diagram) { blocks.push({ type: "force_diagram", diagram }); index += 1; continue; }

    if (isFormulaFence(trimmed)) {
      const formulaLines: string[] = [];
      index += 1;
      while (index < lines.length && !isFormulaFence(lines[index].trim())) {
        formulaLines.push(lines[index].trim());
        index += 1;
      }
      if (index < lines.length) index += 1;
      const value = formulaLines.join(" ").trim();
      if (value) blocks.push({ type: "formula", value });
      continue;
    }

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
      if (!candidate || isRule(candidate) || computerVisual(candidate) || isPeripheralPortMatch(candidate) || chemistryReaction(candidate) || isTrajectorySimulator(candidate) || forceDiagram(candidate) || isHeading(candidate) || candidate.startsWith(">") || isTableLine(candidate) || isUnordered(candidate) || isOrdered(candidate)) break;
      paragraphLines.push(candidate);
      index += 1;
    }
    blocks.push({ type: "paragraph", text: normalizeInline(paragraphLines.join(" ")) });
  }

  return blocks;
}
