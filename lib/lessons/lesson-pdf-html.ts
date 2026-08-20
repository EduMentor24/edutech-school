import { parseLessonMarkdown } from "./markdown-parser";

type LessonPdfInput = { title: string; description?: string | null; content: string };

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatInline(value: string) {
  return escapeHtml(value)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\\\((.+?)\\\)/g, '<span class="inline-formula">$1</span>');
}

function calloutKind(title: string | null) {
  const normalized = (title ?? "").toLocaleLowerCase("fr-FR");
  if (normalized.includes("attention")) return "warning";
  if (normalized.includes("méthode")) return "method";
  if (normalized.includes("synthèse")) return "summary";
  if (normalized.includes("exemple")) return "example";
  return "definition";
}

/** Converts safe lesson Markdown blocks into printable HTML with a separate developer footer. */
export function buildLessonPdfHtml({ title, description, content }: LessonPdfInput) {
  const blocks = parseLessonMarkdown(content);
  const body = blocks.map((block) => {
    switch (block.type) {
      case "heading":
        return `<h${block.level}>${formatInline(block.text)}</h${block.level}>`;
      case "paragraph":
        return `<p>${formatInline(block.text)}</p>`;
      case "unordered":
        return `<ul>${block.items.map((item) => `<li>${formatInline(item)}</li>`).join("")}</ul>`;
      case "ordered":
        return `<ol>${block.items.map((item) => `<li>${formatInline(item)}</li>`).join("")}</ol>`;
      case "callout": {
        const kind = calloutKind(block.title);
        return `<aside class="callout ${kind}">${block.title ? `<h4>${formatInline(block.title)}</h4>` : ""}${block.lines.map((line) => `<p>${formatInline(line)}</p>`).join("")}</aside>`;
      }
      case "formula":
        return `<pre class="formula">${escapeHtml(block.value)}</pre>`;
      case "table":
        return `<div class="table-wrap"><table><thead><tr>${block.headers.map((header) => `<th>${formatInline(header)}</th>`).join("")}</tr></thead><tbody>${block.rows.map((row) => `<tr>${row.map((cell) => `<td>${formatInline(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
      case "rule":
        return "<hr />";
      default:
        return "";
    }
  }).join("\n");

  return `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  @page { margin: 18mm 15mm 32mm; }
  :root { color: #142033; background: #ffffff; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Arial, Helvetica, sans-serif; color: #142033; font-size: 11pt; line-height: 1.6; }
  h1 { margin: 0 0 5px; color: #102A43; font-size: 25pt; line-height: 1.18; }
  .subtitle { margin: 0 0 22px; color: #536579; font-size: 12pt; }
  h2 { margin: 28px 0 10px; color: #102A43; font-size: 17pt; line-height: 1.28; page-break-after: avoid; }
  h3 { margin: 20px 0 8px; color: #1565C0; font-size: 13pt; page-break-after: avoid; }
  p { margin: 0 0 11px; }
  ul, ol { margin: 0 0 13px; padding-left: 22px; }
  li { margin: 4px 0; }
  .callout { margin: 16px 0; padding: 13px 15px; border-left: 5px solid #1565C0; border-radius: 8px; background: #EAF3FF; page-break-inside: avoid; }
  .callout h4 { margin: 0 0 6px; font-size: 11pt; color: #102A43; }
  .callout p:last-child { margin-bottom: 0; }
  .callout.method, .callout.summary { background: #EAF8F1; border-left-color: #167A4B; }
  .callout.warning { background: #FFF4E5; border-left-color: #C76A00; }
  .callout.example { background: #F0EEFF; border-left-color: #6254C6; }
  .formula { margin: 16px 0; padding: 12px 14px; border: 1px solid #B6C7DA; border-radius: 8px; background: #F5F9FC; color: #102A43; font-family: "Courier New", monospace; font-size: 10.5pt; line-height: 1.45; white-space: pre-wrap; text-align: center; page-break-inside: avoid; }
  .inline-formula, code { font-family: "Courier New", monospace; color: #0D47A1; }
  .table-wrap { overflow-x: auto; margin: 14px 0; page-break-inside: avoid; }
  table { border-collapse: collapse; width: 100%; font-size: 9.5pt; }
  th { background: #1565C0; color: white; text-align: left; }
  th, td { border: 1px solid #C7D7E6; padding: 7px 8px; vertical-align: top; }
  tr:nth-child(even) { background: #F7FAFC; }
  hr { border: 0; border-top: 1px solid #D8E2EC; margin: 24px 0; }
  .page-footer { display: flex; align-items: center; justify-content: flex-end; min-height: 12mm; margin-top: 20px; padding-top: 7px; border-top: 1px solid #D8E2EC; background: #ffffff; color: #64748B; font-size: 8.5pt; page-break-inside: avoid; }
  .developer-signature { color: #1565C0; font-weight: 800; white-space: nowrap; }
  @media print {
    .page-footer { position: fixed; bottom: -24mm; left: 0; right: 0; min-height: 12mm; margin: 0; padding-top: 6px; z-index: 10; }
  }
</style></head><body>
<main><h1>${escapeHtml(title)}</h1>${description ? `<p class="subtitle">${formatInline(description)}</p>` : ""}${body}</main><footer class="page-footer"><span class="developer-signature">Développé par loua.spacedigital</span></footer>
</body></html>`;
}
