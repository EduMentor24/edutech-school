import {
  parseLessonMarkdown,
  stripLessonGlossary,
} from "../lessons/markdown-parser";
import type { LessonMarkdownBlock } from "../lessons/markdown-parser";

function blocksToSpeech(block: LessonMarkdownBlock): string {
  switch (block.type) {
    case "heading":
    case "paragraph":
      return stripLessonGlossary(block.text);
    case "unordered":
    case "ordered":
      return block.items.map((item) => stripLessonGlossary(item)).join(". ");
    case "callout": {
      const lines: string[] = [];
      if (block.title) lines.push(stripLessonGlossary(block.title));
      block.lines.forEach((line) =>
        lines.push(stripLessonGlossary(line.replace(/^[-*]\s+/, ""))),
      );
      return lines.join(". ");
    }
    case "formula":
      return `Formule. ${block.value}`;
    case "table": {
      const lines: string[] = [stripLessonGlossary(block.headers.join(", "))];
      block.rows.forEach((row) =>
        lines.push(row.map((cell) => stripLessonGlossary(cell)).join(", ")),
      );
      return lines.join(". ");
    }
    case "rule":
    case "computer_visual":
    case "peripheral_port_match":
    case "chemistry_reaction":
    case "trajectory_simulator":
    case "force_diagram":
    case "anatomy_diagram":
    case "biology_animation":
      return "";
    default:
      return "";
  }
}

/** Converts lesson Markdown into plain speech text matching the displayed lesson content. */
export function lessonSpeechText(markdown: string): string {
  return parseLessonMarkdown(markdown)
    .map(blocksToSpeech)
    .map((part) => part.trim())
    .filter(Boolean)
    .join("\n\n");
}
