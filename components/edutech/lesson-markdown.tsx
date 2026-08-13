import { useMemo } from "react";
import { StyleSheet, Text, View, type StyleProp, type TextStyle } from "react-native";

import { type TableBlock, parseLessonMarkdown } from "@/lib/lessons/markdown-parser";
import { useEduTheme } from "@/lib/edutech/theme-context";

function InlineText({ value, style }: { value: string; style: StyleProp<TextStyle> }) {
  const pieces = value.split(/(\*\*[^*]+\*\*)/g);
  return <Text style={style}>{pieces.map((piece, index) => {
    const bold = /^\*\*[^*]+\*\*$/.test(piece);
    return <Text key={`${piece}-${index}`} style={bold ? { fontWeight: "800" } : undefined}>{bold ? piece.slice(2, -2) : piece}</Text>;
  })}</Text>;
}

export function LessonMarkdown({ content }: { content: string }) {
  const { colors } = useEduTheme();
  const blocks = useMemo(() => parseLessonMarkdown(content), [content]);
  const styles = useMemo(() => createStyles(colors), [colors]);

  return <View style={styles.container}>{blocks.map((block, index) => {
    const key = `${block.type}-${index}`;
    if (block.type === "heading") return <InlineText key={key} value={block.text} style={block.level === 2 ? styles.headingTwo : styles.headingThree} />;
    if (block.type === "paragraph") return <InlineText key={key} value={block.text} style={styles.paragraph} />;
    if (block.type === "rule") return <View key={key} style={styles.rule} />;
    if (block.type === "callout") return <View key={key} style={styles.callout}>{block.title ? <InlineText value={block.title} style={styles.calloutTitle} /> : null}{block.lines.map((line, lineIndex) => <InlineText key={`${key}-line-${lineIndex}`} value={line.replace(/^[-*]\s+/, "• ")} style={styles.calloutText} />)}</View>;
    if (block.type === "unordered" || block.type === "ordered") return <View key={key} style={styles.list}>{block.items.map((item, itemIndex) => <View key={`${key}-item-${itemIndex}`} style={styles.listItem}><Text style={styles.listMarker}>{block.type === "ordered" ? `${itemIndex + 1}.` : "•"}</Text><InlineText value={item} style={styles.listText} /></View>)}</View>;
    const table = block as TableBlock;
    return <View key={key} style={styles.tableCard}>{table.rows.map((row, rowIndex) => <View key={`${key}-row-${rowIndex}`} style={styles.tableRow}>{row.map((cell, cellIndex) => <View key={`${key}-cell-${rowIndex}-${cellIndex}`} style={styles.tableCell}><Text style={styles.tableLabel}>{table.headers[cellIndex] ?? `Élément ${cellIndex + 1}`}</Text><InlineText value={cell} style={styles.tableValue} /></View>)}</View>)}</View>;
  })}</View>;
}

const createStyles = (colors: ReturnType<typeof useEduTheme>["colors"]) => StyleSheet.create({
  container: { gap: 14 }, headingTwo: { color: colors.text, fontSize: 22, lineHeight: 30, fontWeight: "900", marginTop: 8 }, headingThree: { color: colors.primary, fontSize: 17, lineHeight: 24, fontWeight: "900", marginTop: 4 }, paragraph: { color: colors.text, fontSize: 16, lineHeight: 27 }, rule: { height: 1, backgroundColor: colors.border, marginVertical: 6 }, callout: { gap: 8, borderRadius: 16, borderLeftWidth: 4, borderColor: colors.primary, backgroundColor: colors.primarySoft, padding: 14 }, calloutTitle: { color: colors.primary, fontSize: 16, lineHeight: 23, fontWeight: "900" }, calloutText: { color: colors.text, fontSize: 15, lineHeight: 24 }, list: { gap: 9, paddingVertical: 2 }, listItem: { flexDirection: "row", gap: 10, alignItems: "flex-start" }, listMarker: { minWidth: 21, color: colors.primary, fontSize: 15, lineHeight: 24, fontWeight: "900" }, listText: { flex: 1, color: colors.text, fontSize: 16, lineHeight: 25 }, tableCard: { gap: 10, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background, padding: 13 }, tableRow: { gap: 10, borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 10 }, tableCell: { gap: 2 }, tableLabel: { color: colors.muted, fontSize: 11, lineHeight: 16, fontWeight: "900", textTransform: "uppercase", letterSpacing: 0.45 }, tableValue: { color: colors.text, fontSize: 14, lineHeight: 21 },
});
