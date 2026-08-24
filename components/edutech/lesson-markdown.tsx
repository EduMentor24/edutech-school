import { useMemo, useState } from "react";
import { Platform, StyleSheet, Text, View, type StyleProp, type TextStyle } from "react-native";

import { type LessonGlossaryTerm, type TableBlock, parseLessonInline, parseLessonMarkdown } from "@/lib/lessons/markdown-parser";
import { useEduTheme } from "@/lib/edutech/theme-context";

type CalloutTone = "definition" | "method" | "warning" | "example" | "summary" | "default";

function InlineText({ value, style, glossaryStyle, onGlossaryFocus }: { value: string; style: StyleProp<TextStyle>; glossaryStyle?: StyleProp<TextStyle>; onGlossaryFocus?: (term: LessonGlossaryTerm | null) => void }) {
  const tokens = parseLessonInline(value);
  return <Text style={style}>{tokens.map((token, index) => {
    if (token.type === "bold") return <Text key={`bold-${index}-${token.value}`} style={{ fontWeight: "800" }}>{token.value}</Text>;
    if (token.type === "glossary") {
      const hoverProps = Platform.OS === "web" ? { onMouseEnter: () => onGlossaryFocus?.(token), onMouseLeave: () => onGlossaryFocus?.(null) } as any : {};
      return <Text key={`glossary-${index}-${token.term}`} accessibilityRole="button" accessibilityLabel={`${token.term} : ${token.translation}. ${token.definition}`} onPress={() => onGlossaryFocus?.(token)} {...hoverProps} style={[glossaryStyle, { fontWeight: "800", textDecorationLine: "underline", textDecorationStyle: "dotted" }]}>{token.term}</Text>;
    }
    return <Text key={`text-${index}-${token.value}`}>{token.value}</Text>;
  })}</Text>;
}

function getCalloutTone(title: string | null): CalloutTone {
  const normalized = (title ?? "").toLocaleLowerCase("fr-FR");
  if (normalized.includes("définition")) return "definition";
  if (normalized.includes("méthode") || normalized.includes("point méthode")) return "method";
  if (normalized.includes("attention") || normalized.includes("avertissement")) return "warning";
  if (normalized.includes("exemple") || normalized.includes("application")) return "example";
  if (normalized.includes("synthèse") || normalized.includes("à retenir") || normalized.includes("repère")) return "summary";
  return "default";
}

export function LessonMarkdown({ content }: { content: string }) {
  const { colors } = useEduTheme();
  const blocks = useMemo(() => parseLessonMarkdown(content), [content]);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [activeGlossary, setActiveGlossary] = useState<LessonGlossaryTerm | null>(null);
  const hasGlossary = useMemo(() => content.includes("[[") && content.includes("|"), [content]);

  return <View style={styles.container}>{hasGlossary ? <View style={styles.glossaryNotice}><Text style={styles.glossaryNoticeTitle}>Vocabulaire interactif</Text><Text style={styles.glossaryNoticeText}>Survolez un terme souligné sur le web ou touchez-le sur mobile pour voir son explication.</Text></View> : null}{activeGlossary ? <View style={styles.glossaryPopover} accessibilityLiveRegion="polite"><Text style={styles.glossaryTerm}>{activeGlossary.term} · {activeGlossary.translation}</Text><Text style={styles.glossaryDefinition}>{activeGlossary.definition}</Text></View> : null}{blocks.map((block, index) => {
    const key = `${block.type}-${index}`;
    if (block.type === "heading") return <InlineText key={key} value={block.text} style={block.level === 2 ? styles.headingTwo : styles.headingThree} glossaryStyle={styles.glossaryInline} onGlossaryFocus={setActiveGlossary} />;
    if (block.type === "paragraph") return <InlineText key={key} value={block.text} style={styles.paragraph} glossaryStyle={styles.glossaryInline} onGlossaryFocus={setActiveGlossary} />;
    if (block.type === "rule") return <View key={key} style={styles.rule} />;
    if (block.type === "callout") {
      const tone = getCalloutTone(block.title);
      const calloutStyle = tone === "definition" ? styles.calloutDefinition : tone === "method" ? styles.calloutMethod : tone === "warning" ? styles.calloutWarning : tone === "example" ? styles.calloutExample : tone === "summary" ? styles.calloutSummary : styles.calloutDefault;
      const titleStyle = tone === "definition" ? styles.calloutTitleDefinition : tone === "method" ? styles.calloutTitleMethod : tone === "warning" ? styles.calloutTitleWarning : tone === "example" ? styles.calloutTitleExample : tone === "summary" ? styles.calloutTitleSummary : styles.calloutTitleDefault;
      return <View key={key} style={[styles.callout, calloutStyle]}>{block.title ? <InlineText value={block.title} style={[styles.calloutTitle, titleStyle]} glossaryStyle={styles.glossaryInline} onGlossaryFocus={setActiveGlossary} /> : null}{block.lines.map((line, lineIndex) => <InlineText key={`${key}-line-${lineIndex}`} value={line.replace(/^[-*]\s+/, "• ")} style={styles.calloutText} glossaryStyle={styles.glossaryInline} onGlossaryFocus={setActiveGlossary} />)}</View>;
    }
    if (block.type === "formula") return <View key={key} style={styles.formulaCard}><Text accessibilityLabel={`Formule mathématique : ${block.value}`} selectable style={styles.formulaText}>{block.value}</Text></View>;
    if (block.type === "unordered" || block.type === "ordered") return <View key={key} style={styles.list}>{block.items.map((item, itemIndex) => <View key={`${key}-item-${itemIndex}`} style={styles.listItem}><Text style={styles.listMarker}>{block.type === "ordered" ? `${itemIndex + 1}.` : "•"}</Text><InlineText value={item} style={styles.listText} glossaryStyle={styles.glossaryInline} onGlossaryFocus={setActiveGlossary} /></View>)}</View>;
    const table = block as TableBlock;
    return <View key={key} style={styles.tableCard}>{table.rows.map((row, rowIndex) => <View key={`${key}-row-${rowIndex}`} style={styles.tableRow}>{row.map((cell, cellIndex) => <View key={`${key}-cell-${rowIndex}-${cellIndex}`} style={styles.tableCell}><Text style={styles.tableLabel}>{table.headers[cellIndex] ?? `Élément ${cellIndex + 1}`}</Text><InlineText value={cell} style={styles.tableValue} glossaryStyle={styles.glossaryInline} onGlossaryFocus={setActiveGlossary} /></View>)}</View>)}</View>;
  })}</View>;
}

const createStyles = (colors: ReturnType<typeof useEduTheme>["colors"]) => StyleSheet.create({
  container: { gap: 14 },
  glossaryNotice: { gap: 3, padding: 12, borderRadius: 14, backgroundColor: colors.primarySoft, borderWidth: 1, borderColor: colors.primary },
  glossaryNoticeTitle: { color: colors.primary, fontSize: 13, lineHeight: 18, fontWeight: "900" },
  glossaryNoticeText: { color: colors.text, fontSize: 12, lineHeight: 18 },
  glossaryPopover: { gap: 3, padding: 12, borderRadius: 14, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.primary, shadowColor: colors.text, shadowOpacity: 0.12, shadowRadius: 10, elevation: 3 },
  glossaryTerm: { color: colors.primary, fontSize: 14, lineHeight: 20, fontWeight: "900" },
  glossaryDefinition: { color: colors.text, fontSize: 13, lineHeight: 19 },
  glossaryInline: { color: colors.primary },
  headingTwo: { color: colors.text, fontSize: 22, lineHeight: 30, fontWeight: "900", marginTop: 8 },
  headingThree: { color: colors.primary, fontSize: 17, lineHeight: 24, fontWeight: "900", marginTop: 4 },
  paragraph: { color: colors.text, fontSize: 16, lineHeight: 27 },
  rule: { height: 1, backgroundColor: colors.border, marginVertical: 6 },
  callout: { gap: 8, borderRadius: 16, borderLeftWidth: 4, padding: 14 },
  calloutTitle: { fontSize: 16, lineHeight: 23, fontWeight: "900" },
  calloutText: { color: colors.text, fontSize: 15, lineHeight: 24 },
  calloutDefinition: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  calloutTitleDefinition: { color: colors.primary },
  calloutMethod: { backgroundColor: colors.surfaceMuted, borderColor: colors.success },
  calloutTitleMethod: { color: colors.success },
  calloutWarning: { backgroundColor: colors.warningSoft, borderColor: colors.warning },
  calloutTitleWarning: { color: colors.warning },
  calloutExample: { backgroundColor: colors.surfaceMuted, borderColor: colors.primary },
  calloutTitleExample: { color: colors.primaryDark },
  calloutSummary: { backgroundColor: colors.surfaceMuted, borderColor: colors.success },
  calloutTitleSummary: { color: colors.success },
  calloutDefault: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  calloutTitleDefault: { color: colors.primary },
  formulaCard: { alignItems: "center", borderRadius: 16, borderWidth: 1, borderColor: colors.primary, backgroundColor: colors.background, paddingHorizontal: 16, paddingVertical: 15 },
  formulaText: { color: colors.text, fontSize: 16, lineHeight: 26, fontWeight: "800", textAlign: "center", fontFamily: Platform.select({ ios: "Menlo", android: "monospace", web: "monospace" }) },
  list: { gap: 9, paddingVertical: 2 },
  listItem: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  listMarker: { minWidth: 21, color: colors.primary, fontSize: 15, lineHeight: 24, fontWeight: "900" },
  listText: { flex: 1, color: colors.text, fontSize: 16, lineHeight: 25 },
  tableCard: { gap: 10, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background, padding: 13 },
  tableRow: { gap: 10, borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 10 },
  tableCell: { gap: 2 },
  tableLabel: { color: colors.muted, fontSize: 11, lineHeight: 16, fontWeight: "900", textTransform: "uppercase", letterSpacing: 0.45 },
  tableValue: { color: colors.text, fontSize: 14, lineHeight: 21 },
});
