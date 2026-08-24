import { useMemo, useState } from "react";
import { Image } from "expo-image";
import { useRef } from "react";
import { Animated, PanResponder, Pressable, Platform, StyleSheet, Text, View, type StyleProp, type TextStyle } from "react-native";

import { type LessonGlossaryTerm, type TableBlock, parseLessonInline, parseLessonMarkdown } from "@/lib/lessons/markdown-parser";
import { useEduTheme } from "@/lib/edutech/theme-context";

type CalloutTone = "definition" | "method" | "warning" | "example" | "summary" | "default";

const COMPUTER_VISUALS = {
  hardware: "/manus-storage/computer-desktop-components_761a8e56.png",
  ports: "/manus-storage/computer-ports-peripherals_4490b005.png",
  workspace: "/manus-storage/computer-study-workspace_f3d1ceb8.png",
} as const;

const HARDWARE_COMPONENTS = [
  { id: "screen", label: "Écran", role: "Affiche les informations, les documents et les résultats." },
  { id: "tower", label: "Unité centrale", role: "Contient notamment les composants qui exécutent les programmes et conservent les fichiers." },
  { id: "keyboard", label: "Clavier", role: "Permet de saisir du texte, des chiffres et des commandes." },
  { id: "mouse", label: "Souris", role: "Permet de pointer, sélectionner et déplacer à l’écran." },
  { id: "webcam", label: "Webcam", role: "Peut capter une image ou une vidéo lorsqu’elle est autorisée et utile." },
  { id: "usb", label: "Clé USB", role: "Peut transporter des fichiers ; son contenu doit être vérifié et rangé avec prudence." },
] as const;

const PERIPHERALS = [
  { id: "mouse", label: "Souris filaire", target: "usb" },
  { id: "drive", label: "Clé USB", target: "usb" },
  { id: "screen", label: "Écran externe", target: "hdmi" },
  { id: "headset", label: "Casque", target: "audio" },
] as const;
const PORTS = [
  { id: "usb", label: "Port USB", hint: "Pour la souris ou la clé USB." },
  { id: "hdmi", label: "Port HDMI", hint: "Pour un écran externe." },
  { id: "audio", label: "Prise audio", hint: "Pour un casque filaire." },
] as const;

const CHEMISTRY_REACTIONS = {
  carboxylic: {
    title: "Schéma interactif : formation d’un dérivé ester",
    formula: "R–COOH + R′–OH ⇌ R–COOR′ + H₂O",
    description: "Un acide carboxylique et un alcool peuvent former un ester et de l’eau. Touchez chaque étape pour lire son rôle.",
    parts: [
      { id: "acid", label: "Acide carboxylique", detail: "Il porte le groupe fonctionnel carboxyle –COOH." },
      { id: "alcohol", label: "Alcool", detail: "Il apporte le groupe –OH associé à sa chaîne carbonée R′." },
      { id: "ester", label: "Ester", detail: "Le produit porte la liaison caractéristique –COO– entre les deux chaînes." },
      { id: "water", label: "Eau", detail: "L’eau est formée lors de cette transformation représentée par une double flèche." },
    ],
  },
  soap: {
    title: "Schéma interactif : saponification",
    formula: "Triglycéride + 3 HO⁻ → Glycérol + 3 R–COO⁻",
    description: "La saponification transforme un corps gras en glycérol et en ions carboxylates, base chimique d’un savon.",
    parts: [
      { id: "fat", label: "Corps gras", detail: "Le triglycéride est le réactif organique dont les liaisons ester sont transformées." },
      { id: "hydroxide", label: "Ions hydroxyde", detail: "Ils participent à la transformation chimique en milieu basique." },
      { id: "glycerol", label: "Glycérol", detail: "Le glycérol est l’un des produits issus de la transformation." },
      { id: "soap", label: "Ions carboxylates", detail: "Associés à un cation métallique, ils constituent la partie ionique d’un savon." },
    ],
  },
  acid_base: {
    title: "Schéma interactif : neutralisation acido-basique",
    formula: "H₃O⁺ + HO⁻ → 2 H₂O",
    description: "Cette écriture simplifiée met en évidence la réaction entre l’ion oxonium d’une solution acide et l’ion hydroxyde d’une solution basique.",
    parts: [
      { id: "oxonium", label: "Ion oxonium H₃O⁺", detail: "Il caractérise une solution acide et intervient dans les calculs liés au pH." },
      { id: "hydroxide", label: "Ion hydroxyde HO⁻", detail: "Il caractérise une solution basique dans le modèle présenté par le cours." },
      { id: "reaction", label: "Neutralisation", detail: "Les deux ions réagissent ; l’écriture bilan indique la formation d’eau." },
      { id: "water", label: "Eau H₂O", detail: "L’eau est le produit représenté dans ce bilan ionique de neutralisation." },
    ],
  },
} as const;

type ChemistryReactionKind = keyof typeof CHEMISTRY_REACTIONS;
type ChemistryReactionPart = { id: string; label: string; detail: string };

function ChemistryReactionDiagram({ reaction, styles }: { reaction: ChemistryReactionKind; styles: ReturnType<typeof createStyles> }) {
  const schema = CHEMISTRY_REACTIONS[reaction];
  const [selected, setSelected] = useState<ChemistryReactionPart>(schema.parts[0]);
  return <View style={styles.chemistryCard} accessibilityLabel={schema.title}><Text style={styles.chemistryTitle}>{schema.title}</Text><Text style={styles.chemistryHint}>{schema.description}</Text><View style={styles.chemistryFormula}><Text selectable accessibilityLabel={`Équation chimique : ${schema.formula}`} style={styles.chemistryFormulaText}>{schema.formula}</Text></View><View style={styles.chemistryChoices}>{schema.parts.map((part) => <Pressable key={part.id} accessibilityRole="button" accessibilityState={{ selected: selected.id === part.id }} accessibilityLabel={`${part.label}. ${part.detail}`} onPress={() => setSelected(part)} style={({ pressed }) => [styles.chemistryChoice, selected.id === part.id && styles.chemistryChoiceActive, pressed && styles.chemistryChoicePressed]}><Text style={[styles.chemistryChoiceText, selected.id === part.id && styles.chemistryChoiceTextActive]}>{part.label}</Text></Pressable>)}</View><View style={styles.chemistryDetail} accessibilityLiveRegion="polite"><Text style={styles.chemistryDetailTitle}>{selected.label}</Text><Text style={styles.chemistryDetailText}>{selected.detail}</Text></View><Text style={styles.chemistryFallback}>Repère de lecture : les étiquettes sont interactives ; l’équation et toutes les explications restent disponibles sous forme textuelle.</Text></View>;
}

function DraggablePeripheral({ peripheral, onDrop, onSelect, selected, styles }: { peripheral: (typeof PERIPHERALS)[number]; onDrop: (id: string, x: number, y: number) => void; onSelect: (id: string) => void; selected: boolean; styles: ReturnType<typeof createStyles> }) {
  const pan = useRef(new Animated.ValueXY()).current;
  const responder = useMemo(() => PanResponder.create({ onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) + Math.abs(gesture.dy) > 4, onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }), onPanResponderRelease: (event) => { onDrop(peripheral.id, event.nativeEvent.pageX, event.nativeEvent.pageY); Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false, friction: 7 }).start(); }, onPanResponderTerminate: () => Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start() }), [onDrop, pan, peripheral.id]);
  return <Animated.View {...responder.panHandlers} style={[styles.dragItem, selected && styles.dragItemSelected, { transform: pan.getTranslateTransform() }]}><Pressable accessibilityRole="button" accessibilityState={{ selected }} accessibilityLabel={`${peripheral.label}. Glissez vers un port ou touchez pour le sélectionner.`} onPress={() => onSelect(peripheral.id)} style={styles.dragPressable}><Text style={[styles.dragItemText, selected && styles.dragItemTextSelected]}>{peripheral.label}</Text></Pressable></Animated.View>;
}

function PeripheralPortMatch({ styles }: { styles: ReturnType<typeof createStyles> }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState("Glissez un périphérique vers le bon port ou sélectionnez-le puis touchez un port.");
  const targets = useRef<Record<string, View | null>>({});
  const applyMatch = (peripheralId: string, targetId: string) => { const peripheral = PERIPHERALS.find((item) => item.id === peripheralId); if (!peripheral) return; if (peripheral.target === targetId) { setMatches((current) => ({ ...current, [peripheralId]: targetId })); setFeedback(`${peripheral.label} est correctement associé au ${PORTS.find((port) => port.id === targetId)?.label}.`); } else setFeedback(`Ce port ne convient pas à ${peripheral.label}. Relis l’indice et réessaie.`); setSelected(null); };
  const drop = (peripheralId: string, x: number, y: number) => { setSelected(peripheralId); setFeedback("Périphérique sélectionné. Touchez maintenant le port que vous pensez correct."); PORTS.forEach((port) => targets.current[port.id]?.measureInWindow((left: number, top: number, width: number, height: number) => { if (x >= left && x <= left + width && y >= top && y <= top + height) applyMatch(peripheralId, port.id); })); };
  const solved = PERIPHERALS.every((item) => matches[item.id] === item.target);
  return <View style={styles.matchCard} accessibilityLabel="Exercice interactif d’association entre périphériques et ports"><Text style={styles.matchTitle}>Défi interactif : connecter les périphériques</Text><Text style={styles.matchHint}>Glissez chaque étiquette vers son port. Alternative accessible : touchez une étiquette, puis le port choisi.</Text><View style={styles.matchGrid}><View style={styles.matchColumn}><Text style={styles.matchLabel}>Périphériques</Text>{PERIPHERALS.map((item) => <DraggablePeripheral key={item.id} peripheral={item} onDrop={drop} onSelect={setSelected} selected={selected === item.id} styles={styles} />)}</View><View style={styles.matchColumn}><Text style={styles.matchLabel}>Ports</Text>{PORTS.map((port) => <View key={port.id} ref={(node) => { targets.current[port.id] = node; }}><Pressable accessibilityRole="button" accessibilityLabel={`${port.label}. ${port.hint}`} onPress={() => selected ? applyMatch(selected, port.id) : setFeedback("Sélectionnez d’abord un périphérique ou glissez-en un vers ce port.")} style={({ pressed }) => [styles.portTarget, pressed && styles.portTargetPressed]}><Text style={styles.portTargetTitle}>{port.label}</Text><Text style={styles.portTargetHint}>{port.hint}</Text></Pressable></View>)}</View></View><View style={styles.matchFeedback} accessibilityLiveRegion="polite"><Text style={styles.matchFeedbackText}>{solved ? "Bravo : toutes les associations sont correctes." : feedback}</Text></View><Pressable accessibilityRole="button" accessibilityLabel="Recommencer l’exercice" onPress={() => { setMatches({}); setSelected(null); setFeedback("Exercice réinitialisé. Glissez ou sélectionnez un périphérique."); }} style={({ pressed }) => [styles.matchReset, pressed && styles.portTargetPressed]}><Text style={styles.matchResetText}>Recommencer</Text></Pressable></View>;
}

function ComputerVisual({ visual, styles }: { visual: "ports" | "workspace"; styles: ReturnType<typeof createStyles> }) {
  const caption = visual === "ports" ? "Périphériques et ports : observer avant de connecter." : "Poste de travail organisé : stabilité, rangement et gestes utiles.";
  return <View style={styles.visualCard} accessibilityLabel={caption}><Image source={COMPUTER_VISUALS[visual]} contentFit="contain" transition={220} cachePolicy="disk" style={styles.courseVisual} accessibilityLabel={caption} /><Text style={styles.visualCaption}>{caption}</Text></View>;
}

function HardwareDiagram({ styles }: { styles: ReturnType<typeof createStyles> }) {
  const [selected, setSelected] = useState<(typeof HARDWARE_COMPONENTS)[number]>(HARDWARE_COMPONENTS[0]);
  return <View style={styles.hardwareCard} accessibilityLabel="Schéma interactif des composants d’un ordinateur de bureau"><Text style={styles.hardwareTitle}>Schéma interactif : reconnaître les composants</Text><Text style={styles.hardwareHint}>Touchez un composant ci-dessous pour afficher son rôle. Sur le web, chaque bouton peut aussi recevoir le focus au clavier.</Text><Image source={COMPUTER_VISUALS.hardware} contentFit="contain" transition={220} cachePolicy="disk" style={styles.hardwareImage} accessibilityLabel="Ordinateur de bureau avec écran, unité centrale, clavier, souris, webcam et clé USB" /><View style={styles.hardwareChoices}>{HARDWARE_COMPONENTS.map((component) => <Pressable key={component.id} accessibilityRole="button" accessibilityState={{ selected: selected.id === component.id }} accessibilityLabel={`${component.label}. ${component.role}`} onPress={() => setSelected(component)} style={({ pressed }) => [styles.hardwareChoice, selected.id === component.id && styles.hardwareChoiceActive, pressed && styles.hardwareChoicePressed]}><Text style={[styles.hardwareChoiceText, selected.id === component.id && styles.hardwareChoiceTextActive]}>{component.label}</Text></Pressable>)}</View><View style={styles.hardwareDetail} accessibilityLiveRegion="polite"><Text style={styles.hardwareDetailTitle}>{selected.label}</Text><Text style={styles.hardwareDetailText}>{selected.role}</Text></View><Text style={styles.hardwareFallback}>Repère textuel : écran, unité centrale, clavier, souris, webcam et clé USB. Le cours reste compréhensible même sans l’illustration.</Text></View>;
}

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
    if (block.type === "computer_visual") return block.visual === "hardware_diagram" ? <HardwareDiagram key={key} styles={styles} /> : <ComputerVisual key={key} visual={block.visual} styles={styles} />;
    if (block.type === "peripheral_port_match") return <PeripheralPortMatch key={key} styles={styles} />;
    if (block.type === "chemistry_reaction") return <ChemistryReactionDiagram key={key} reaction={block.reaction} styles={styles} />;
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
  visualCard: { gap: 9, padding: 12, borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background },
  courseVisual: { width: "100%", height: 210, borderRadius: 12, backgroundColor: colors.surfaceMuted },
  visualCaption: { color: colors.muted, fontSize: 12, lineHeight: 18, fontWeight: "700", textAlign: "center" },
  hardwareCard: { gap: 10, padding: 14, borderRadius: 18, borderWidth: 1, borderColor: colors.primary, backgroundColor: colors.primarySoft },
  hardwareTitle: { color: colors.primary, fontSize: 17, lineHeight: 24, fontWeight: "900" },
  hardwareHint: { color: colors.text, fontSize: 13, lineHeight: 20 },
  hardwareImage: { width: "100%", height: 220, borderRadius: 14, backgroundColor: colors.background },
  hardwareChoices: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  hardwareChoice: { borderWidth: 1, borderColor: colors.border, borderRadius: 999, backgroundColor: colors.background, paddingHorizontal: 11, paddingVertical: 8 },
  hardwareChoiceActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  hardwareChoicePressed: { opacity: 0.76, transform: [{ scale: 0.98 }] },
  hardwareChoiceText: { color: colors.text, fontSize: 12, lineHeight: 16, fontWeight: "800" },
  hardwareChoiceTextActive: { color: colors.background },
  hardwareDetail: { gap: 3, padding: 11, borderRadius: 12, backgroundColor: colors.background, borderLeftWidth: 4, borderColor: colors.primary },
  hardwareDetailTitle: { color: colors.primary, fontSize: 14, lineHeight: 19, fontWeight: "900" },
  hardwareDetailText: { color: colors.text, fontSize: 13, lineHeight: 20 },
  hardwareFallback: { color: colors.muted, fontSize: 12, lineHeight: 18, fontStyle: "italic" },
  chemistryCard: { gap: 10, padding: 14, borderRadius: 18, borderWidth: 1, borderColor: colors.success, backgroundColor: colors.surfaceMuted },
  chemistryTitle: { color: colors.success, fontSize: 17, lineHeight: 24, fontWeight: "900" },
  chemistryHint: { color: colors.text, fontSize: 13, lineHeight: 20 },
  chemistryFormula: { paddingHorizontal: 12, paddingVertical: 14, borderRadius: 14, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.success },
  chemistryFormulaText: { color: colors.text, fontSize: 16, lineHeight: 24, fontWeight: "900", textAlign: "center", fontFamily: Platform.select({ ios: "Menlo", android: "monospace", web: "monospace" }) },
  chemistryChoices: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chemistryChoice: { borderWidth: 1, borderColor: colors.border, borderRadius: 999, backgroundColor: colors.background, paddingHorizontal: 11, paddingVertical: 8 },
  chemistryChoiceActive: { backgroundColor: colors.success, borderColor: colors.success },
  chemistryChoicePressed: { opacity: 0.76, transform: [{ scale: 0.98 }] },
  chemistryChoiceText: { color: colors.text, fontSize: 12, lineHeight: 16, fontWeight: "800" },
  chemistryChoiceTextActive: { color: colors.background },
  chemistryDetail: { gap: 3, padding: 11, borderRadius: 12, backgroundColor: colors.background, borderLeftWidth: 4, borderColor: colors.success },
  chemistryDetailTitle: { color: colors.success, fontSize: 14, lineHeight: 19, fontWeight: "900" },
  chemistryDetailText: { color: colors.text, fontSize: 13, lineHeight: 20 },
  chemistryFallback: { color: colors.muted, fontSize: 12, lineHeight: 18, fontStyle: "italic" },
  matchCard: { gap: 11, padding: 14, borderRadius: 18, borderWidth: 1, borderColor: colors.primary, backgroundColor: colors.primarySoft },
  matchTitle: { color: colors.primary, fontSize: 17, lineHeight: 24, fontWeight: "900" },
  matchHint: { color: colors.text, fontSize: 13, lineHeight: 20 },
  matchGrid: { flexDirection: "row", gap: 10 },
  matchColumn: { flex: 1, gap: 8 },
  matchLabel: { color: colors.muted, fontSize: 11, lineHeight: 15, fontWeight: "900", textTransform: "uppercase", letterSpacing: 0.4 },
  dragItem: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, backgroundColor: colors.background, zIndex: 2 },
  dragItemSelected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  dragPressable: { paddingHorizontal: 10, paddingVertical: 10 },
  dragItemText: { color: colors.text, fontSize: 13, lineHeight: 18, fontWeight: "800" },
  dragItemTextSelected: { color: colors.primary },
  portTarget: { gap: 3, minHeight: 62, padding: 10, borderRadius: 12, borderWidth: 1, borderStyle: "dashed", borderColor: colors.primary, backgroundColor: colors.background },
  portTargetPressed: { opacity: 0.78, transform: [{ scale: 0.98 }] },
  portTargetTitle: { color: colors.primary, fontSize: 13, lineHeight: 18, fontWeight: "900" },
  portTargetHint: { color: colors.text, fontSize: 11, lineHeight: 16 },
  matchFeedback: { padding: 10, borderRadius: 12, backgroundColor: colors.background, borderLeftWidth: 4, borderColor: colors.success },
  matchFeedbackText: { color: colors.text, fontSize: 13, lineHeight: 19, fontWeight: "700" },
  matchReset: { alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 9, borderRadius: 10, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
  matchResetText: { color: colors.primary, fontSize: 13, lineHeight: 18, fontWeight: "900" },
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
