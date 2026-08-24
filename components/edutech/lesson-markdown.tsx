import { useMemo, useRef, useState } from "react";
import { Image } from "expo-image";
import { Animated, PanResponder, Pressable, Platform, StyleSheet, Text, View, type StyleProp, type TextStyle } from "react-native";
import Svg, { Circle, Line, Path, Polygon, Rect } from "react-native-svg";

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

type ForceDiagramKind = "solid" | "satellite" | "projectile" | "oscillator" | "laplace";
type ForceVector = { id: string; label: string; detail: string; color: string; to: [number, number] };
type AnatomyDiagramKind = "brain" | "neuron" | "heart";
type AnatomyPart = { id: string; label: string; detail: string; color: string; point: [number, number] };
type BiologyAnimationKind = "neural_signal" | "protein_synthesis" | "immune_response";
type BiologyAnimationStep = { label: string; detail: string; color: string };

const FORCE_DIAGRAMS: Record<ForceDiagramKind, { title: string; description: string; body: string; forces: ForceVector[] }> = {
  solid: { title: "Schéma interactif : solide soumis à des forces", description: "Sélectionnez une force pour relier son sens à son rôle dans le mouvement du centre d’inertie.", body: "Solide", forces: [{ id: "weight", label: "Poids P", detail: "Le poids est l’action gravitationnelle de la Terre sur le solide. Il est vertical et dirigé vers le bas.", color: "#D92D20", to: [110, 152] }, { id: "reaction", label: "Réaction R", detail: "La réaction du support s’exerce au contact du solide. Sa direction dépend du support étudié.", color: "#2563EB", to: [110, 36] }, { id: "drive", label: "Force motrice", detail: "Une force motrice peut entraîner le solide dans le sens du déplacement choisi.", color: "#15803D", to: [196, 94] }, { id: "friction", label: "Frottement", detail: "Une force de frottement s’oppose au glissement ou au mouvement relatif sur le support.", color: "#B45309", to: [25, 94] }] },
  satellite: { title: "Schéma interactif : satellite en orbite", description: "La force gravitationnelle est dirigée vers le centre de la Terre ; elle fournit l’accélération centripète du modèle circulaire.", body: "Satellite", forces: [{ id: "gravity", label: "Attraction gravitationnelle", detail: "La Terre attire le satellite vers son centre. Cette force est la force principale du modèle de vol balistique étudié.", color: "#7C3AED", to: [24, 122] }] },
  projectile: { title: "Schéma interactif : projectile sans frottement", description: "Le modèle utilisé dans le cours néglige la résistance de l’air : le projectile est alors soumis à son poids.", body: "Projectile", forces: [{ id: "weight", label: "Poids P", detail: "Le poids est orienté verticalement vers le bas et produit l’accélération \(\vec g\) du projectile.", color: "#D92D20", to: [125, 154] }] },
  oscillator: { title: "Schéma interactif : masse-ressort", description: "La force de rappel du ressort est dirigée vers la position d’équilibre. Touchez les étiquettes pour distinguer les forces du modèle.", body: "Masse", forces: [{ id: "spring", label: "Force de rappel", detail: "La force du ressort est opposée à l’élongation. Elle ramène la masse vers la position d’équilibre.", color: "#15803D", to: [38, 94] }, { id: "weight", label: "Poids P", detail: "Le poids agit verticalement vers le bas ; il est compensé par la réaction dans le modèle horizontal.", color: "#D92D20", to: [118, 152] }, { id: "reaction", label: "Réaction R", detail: "La réaction du support équilibre l’action verticale du poids dans le modèle de pendule élastique horizontal.", color: "#2563EB", to: [118, 34] }] },
  laplace: { title: "Schéma interactif : tige de Laplace", description: "La tige est soumise à son poids, à la réaction du support et à la force de Laplace lorsque courant et champ magnétique sont présents.", body: "Tige", forces: [{ id: "laplace", label: "Force de Laplace F", detail: "La force de Laplace est perpendiculaire au plan défini par le conducteur et le champ. Son sens dépend du courant et de \(\vec B\).", color: "#7C3AED", to: [198, 90] }, { id: "weight", label: "Poids P", detail: "Le poids de la tige est vertical et dirigé vers le bas.", color: "#D92D20", to: [110, 152] }, { id: "reaction", label: "Réaction R", detail: "La réaction est l’action du support ou de l’axe de rotation sur la tige.", color: "#2563EB", to: [110, 34] }] },
};

const ANATOMY_DIAGRAMS: Record<AnatomyDiagramKind, { title: string; description: string; parts: AnatomyPart[] }> = {
  brain: { title: "Schéma anatomique interactif : cerveau", description: "Touchez une étiquette pour relier une zone du schéma à son rôle dans l’activité cérébrale étudiée.", parts: [{ id: "cortex", label: "Cortex cérébral", detail: "La couche externe du cerveau participe notamment au traitement d’informations et à des activités conscientes évoquées dans le cours.", color: "#7C3AED", point: [104, 53] }, { id: "cerebellum", label: "Cervelet", detail: "Cette zone située vers l’arrière contribue à la coordination des mouvements dans une présentation simplifiée.", color: "#2563EB", point: [152, 120] }, { id: "brainstem", label: "Tronc cérébral", detail: "Il relie l’encéphale à la moelle épinière et appartient aux voies de communication nerveuse.", color: "#15803D", point: [111, 140] }] },
  neuron: { title: "Schéma anatomique interactif : neurone", description: "Le neurone est représenté de façon simplifiée. Touchez les éléments pour suivre le trajet d’une information nerveuse.", parts: [{ id: "dendrites", label: "Dendrites", detail: "Les dendrites reçoivent des informations provenant d’autres cellules dans le modèle étudié.", color: "#7C3AED", point: [46, 90] }, { id: "body", label: "Corps cellulaire", detail: "Le corps cellulaire contient le noyau et participe à l’intégration des signaux reçus.", color: "#D92D20", point: [90, 90] }, { id: "axon", label: "Axone", detail: "L’axone conduit le message nerveux du corps cellulaire vers ses terminaisons.", color: "#2563EB", point: [152, 90] }, { id: "synapse", label: "Terminaisons synaptiques", detail: "Ces extrémités permettent la communication avec une autre cellule au niveau d’une synapse.", color: "#15803D", point: [194, 90] }] },
  heart: { title: "Schéma anatomique interactif : cœur", description: "Ce repère simplifié aide à situer les cavités et les grands vaisseaux utiles pour comprendre le fonctionnement du cœur.", parts: [{ id: "atria", label: "Oreillettes", detail: "Les oreillettes reçoivent le sang avant son passage vers les ventricules dans le modèle simplifié.", color: "#7C3AED", point: [87, 64] }, { id: "ventricles", label: "Ventricules", detail: "Les ventricules éjectent le sang hors du cœur ; leur contraction intervient dans le cycle cardiaque.", color: "#D92D20", point: [112, 119] }, { id: "vessels", label: "Grands vaisseaux", detail: "Les grands vaisseaux assurent les entrées et sorties de sang associées à la circulation présentée par le cours.", color: "#2563EB", point: [141, 43] }] },
};

const BIOLOGY_ANIMATIONS: Record<BiologyAnimationKind, { title: string; description: string; steps: BiologyAnimationStep[] }> = {
  neural_signal: { title: "Animation pédagogique : trajet d’un message nerveux", description: "L’animation montre une succession simplifiée d’étapes. Elle ne remplace pas l’étude détaillée du mécanisme électrique et chimique.", steps: [{ label: "Réception", detail: "Une cellule nerveuse reçoit une information par ses zones de contact.", color: "#7C3AED" }, { label: "Conduction", detail: "Le message se propage le long de l’axone dans le modèle présenté.", color: "#2563EB" }, { label: "Transmission", detail: "La terminaison nerveuse communique ensuite l’information à une autre cellule au niveau d’une synapse.", color: "#15803D" }] },
  protein_synthesis: { title: "Animation pédagogique : biosynthèse des protéines", description: "La séquence visualise le passage de l’information génétique à une protéine, dans un modèle volontairement simplifié.", steps: [{ label: "Information", detail: "L’ADN porte l’information utilisée par la cellule dans le cadre du cours.", color: "#7C3AED" }, { label: "ARN messager", detail: "Un ARN messager transporte une copie utilisable de cette information vers le lieu de synthèse.", color: "#2563EB" }, { label: "Assemblage", detail: "Le ribosome assemble des acides aminés selon l’information lue pour former une protéine.", color: "#15803D" }] },
  immune_response: { title: "Animation pédagogique : réponse de défense", description: "Cette animation présente un déroulement simplifié de la défense de l’organisme face à un agent infectieux.", steps: [{ label: "Détection", detail: "L’organisme reconnaît un élément étranger ou une situation d’infection dans le modèle étudié.", color: "#D92D20" }, { label: "Mobilisation", detail: "Des cellules et molécules de défense interviennent dans la réponse de l’organisme.", color: "#F59E0B" }, { label: "Élimination", detail: "La réponse contribue à limiter ou éliminer l’agent infectieux selon le cas étudié.", color: "#15803D" }] },
};

function VectorArrow({ to, color, label }: { to: [number, number]; color: string; label: string }) {
  const origin: [number, number] = [110, 94];
  const dx = to[0] - origin[0]; const dy = to[1] - origin[1]; const length = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / length; const uy = dy / length; const px = -uy; const py = ux;
  const baseX = to[0] - ux * 12; const baseY = to[1] - uy * 12;
  const points = `${to[0]},${to[1]} ${baseX + px * 6},${baseY + py * 6} ${baseX - px * 6},${baseY - py * 6}`;
  return <><Line x1={origin[0]} y1={origin[1]} x2={to[0]} y2={to[1]} stroke={color} strokeWidth={3} /><Polygon points={points} fill={color} accessibilityLabel={label} /></>;
}

function ForceDiagram({ diagram, styles }: { diagram: ForceDiagramKind; styles: ReturnType<typeof createStyles> }) {
  const schema = FORCE_DIAGRAMS[diagram];
  const [selected, setSelected] = useState<ForceVector>(schema.forces[0]);
  const satellite = diagram === "satellite";
  return <View style={styles.forceCard} accessibilityLabel={schema.title}><Text style={styles.forceTitle}>{schema.title}</Text><Text style={styles.forceHint}>{schema.description}</Text><View style={styles.forceCanvas}><Svg width="100%" height={180} viewBox="0 0 220 180" accessibilityLabel={`Représentation du système : ${schema.body}`}><Line x1="10" y1="150" x2="210" y2="150" stroke="#94A3B8" strokeWidth="2" opacity={satellite ? 0 : 1} /><Circle cx={satellite ? 54 : 110} cy={satellite ? 126 : 94} r={satellite ? 29 : 18} fill={satellite ? "#2563EB" : "#E2E8F0"} /><Rect x={diagram === "laplace" ? 84 : 96} y={diagram === "laplace" ? 82 : 80} width={diagram === "laplace" ? 52 : 28} height={diagram === "laplace" ? 20 : 28} rx="4" fill={diagram === "laplace" ? "#64748B" : "#0F172A"} /><Path d={diagram === "oscillator" ? "M12 94 L22 84 L32 104 L42 84 L52 104 L62 84 L72 104 L82 94" : ""} stroke="#64748B" strokeWidth="3" fill="none" /><Circle cx="110" cy="94" r="3" fill="#0F172A" />{schema.forces.map((force) => <VectorArrow key={force.id} to={force.to} color={force.color} label={force.label} />)}</Svg></View><View style={styles.forceChoices}>{schema.forces.map((force) => <Pressable key={force.id} accessibilityRole="button" accessibilityState={{ selected: selected.id === force.id }} accessibilityLabel={`${force.label}. ${force.detail}`} onPress={() => setSelected(force)} style={({ pressed }) => [styles.forceChoice, selected.id === force.id && { borderColor: force.color, backgroundColor: `${force.color}15` }, pressed && styles.forceChoicePressed]}><View style={[styles.forceDot, { backgroundColor: force.color }]} /><Text style={styles.forceChoiceText}>{force.label}</Text></Pressable>)}</View><View style={[styles.forceDetail, { borderColor: selected.color }]} accessibilityLiveRegion="polite"><Text style={[styles.forceDetailTitle, { color: selected.color }]}>{selected.label}</Text><Text style={styles.forceDetailText}>{selected.detail}</Text></View><Text style={styles.forceFallback}>Repère de lecture : le système est identifié, puis chaque force est nommée, orientée et expliquée avant tout calcul.</Text></View>;
}

function TrajectorySimulator({ styles }: { styles: ReturnType<typeof createStyles> }) {
  const [angle, setAngle] = useState(45); const [speed, setSpeed] = useState(15);
  const radians = angle * Math.PI / 180; const range = (speed * speed * Math.sin(2 * radians)) / 10; const maxHeight = (speed * speed * Math.sin(radians) ** 2) / 20;
  const points = Array.from({ length: 25 }, (_, index) => { const fraction = index / 24; const x = range * fraction; const y = x * Math.tan(radians) - (10 * x * x) / (2 * speed * speed * Math.cos(radians) ** 2); const drawX = 18 + fraction * 184; const drawY = 145 - (maxHeight ? y / maxHeight : 0) * 112; return `${index === 0 ? "M" : "L"}${drawX.toFixed(1)} ${drawY.toFixed(1)}`; }).join(" ");
  const adjust = (setter: (value: number) => void, value: number, min: number, max: number, delta: number) => setter(Math.max(min, Math.min(max, value + delta)));
  return <View style={styles.trajectoryCard} accessibilityLabel="Simulateur de trajectoire dans un champ de pesanteur uniforme">
    <Text style={styles.trajectoryTitle}>Simulateur : trajectoire d’un projectile</Text>
    <Text style={styles.trajectoryHint}>Modèle sans frottement : choisissez l’angle et la vitesse initiale, puis observez la trajectoire calculée dans le champ de pesanteur uniforme.</Text>
    <View style={styles.trajectoryCanvas}>
      <Svg width="100%" height={180} viewBox="0 0 220 180" accessibilityLabel={`Trajectoire calculée : angle ${angle} degrés, vitesse initiale ${speed} mètres par seconde`}>
        <Line x1="12" y1="145" x2="210" y2="145" stroke="#64748B" strokeWidth="2" />
        <Line x1="18" y1="20" x2="18" y2="150" stroke="#94A3B8" strokeWidth="1" />
        <Path d={points} stroke="#2563EB" strokeWidth="4" fill="none" />
        <Circle cx="18" cy="145" r="5" fill="#2563EB" />
      </Svg>
    </View>
    <View style={styles.trajectoryControls}>
      <View style={styles.trajectoryControl}>
        <Text style={styles.trajectoryLabel}>Angle : {angle}°</Text>
        <View style={styles.trajectoryButtons}>
          <Pressable accessibilityRole="button" accessibilityLabel="Diminuer l’angle" onPress={() => adjust(setAngle, angle, 15, 75, -5)} style={styles.trajectoryButton}><Text style={styles.trajectoryButtonText}>−</Text></Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Augmenter l’angle" onPress={() => adjust(setAngle, angle, 15, 75, 5)} style={styles.trajectoryButton}><Text style={styles.trajectoryButtonText}>+</Text></Pressable>
        </View>
      </View>
      <View style={styles.trajectoryControl}>
        <Text style={styles.trajectoryLabel}>Vitesse : {speed} m·s⁻¹</Text>
        <View style={styles.trajectoryButtons}>
          <Pressable accessibilityRole="button" accessibilityLabel="Diminuer la vitesse" onPress={() => adjust(setSpeed, speed, 5, 30, -1)} style={styles.trajectoryButton}><Text style={styles.trajectoryButtonText}>−</Text></Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Augmenter la vitesse" onPress={() => adjust(setSpeed, speed, 5, 30, 1)} style={styles.trajectoryButton}><Text style={styles.trajectoryButtonText}>+</Text></Pressable>
        </View>
      </View>
    </View>
    <View style={styles.trajectoryResult} accessibilityLiveRegion="polite">
      <Text style={styles.trajectoryResultTitle}>Résultat du modèle</Text>
      <Text style={styles.trajectoryResultText}>Portée théorique : {range.toFixed(1)} m · Hauteur maximale : {maxHeight.toFixed(1)} m.</Text>
      <Text style={styles.trajectoryResultText}>La force représentée dans ce modèle est le poids ; l’air est volontairement négligé.</Text>
    </View>
    <Text style={styles.trajectoryFallback}>Repère de lecture : les calculs utilisent g = 10 m·s⁻², une hauteur de départ nulle et une arrivée à la même hauteur.</Text>
  </View>;
}

function AnatomyIllustration({ diagram, selected }: { diagram: AnatomyDiagramKind; selected: AnatomyPart }) {
  const marker = (part: AnatomyPart) => <Circle key={part.id} cx={part.point[0]} cy={part.point[1]} r={selected.id === part.id ? 8 : 5} fill={part.color} stroke="#FFFFFF" strokeWidth="2" />;
  if (diagram === "brain") return <Svg width="100%" height={185} viewBox="0 0 220 180" accessibilityLabel="Représentation simplifiée du cerveau"><Path d="M43 104 C17 94 22 53 53 43 C68 22 105 20 125 38 C159 31 188 53 180 85 C187 112 162 138 132 132 C111 151 75 143 68 121 C56 121 47 115 43 104 Z" fill="#FBCFE8" stroke="#BE185D" strokeWidth="3" /><Line x1="109" y1="39" x2="111" y2="132" stroke="#BE185D" strokeWidth="2" opacity="0.55" /><Path d="M131 112 C152 104 164 113 161 130 C149 143 131 137 127 123 Z" fill="#BFDBFE" stroke="#2563EB" strokeWidth="2" />{ANATOMY_DIAGRAMS.brain.parts.map(marker)}</Svg>;
  if (diagram === "neuron") return <Svg width="100%" height={185} viewBox="0 0 220 180" accessibilityLabel="Représentation simplifiée d’un neurone"><Path d="M20 90 L56 60 M20 90 L56 76 M20 90 L56 104 M20 90 L56 122" stroke="#7C3AED" strokeWidth="3" /><Circle cx="90" cy="90" r="24" fill="#FDE68A" stroke="#B45309" strokeWidth="3" /><Circle cx="90" cy="90" r="8" fill="#7C3AED" /><Line x1="114" y1="90" x2="183" y2="90" stroke="#2563EB" strokeWidth="7" strokeLinecap="round" /><Line x1="183" y1="90" x2="204" y2="63" stroke="#15803D" strokeWidth="3" /><Line x1="183" y1="90" x2="208" y2="89" stroke="#15803D" strokeWidth="3" /><Line x1="183" y1="90" x2="204" y2="116" stroke="#15803D" strokeWidth="3" />{ANATOMY_DIAGRAMS.neuron.parts.map(marker)}</Svg>;
  return <Svg width="100%" height={185} viewBox="0 0 220 180" accessibilityLabel="Représentation simplifiée du cœur"><Path d="M111 148 C85 127 54 103 54 75 C54 52 84 42 104 61 C120 40 154 50 158 75 C163 104 134 128 111 148 Z" fill="#FB7185" stroke="#BE123C" strokeWidth="3" /><Path d="M111 63 L111 143" stroke="#BE123C" strokeWidth="2" opacity="0.65" /><Path d="M129 47 L145 23" stroke="#2563EB" strokeWidth="8" strokeLinecap="round" /><Path d="M92 54 L77 31" stroke="#2563EB" strokeWidth="8" strokeLinecap="round" />{ANATOMY_DIAGRAMS.heart.parts.map(marker)}</Svg>;
}

function AnatomyDiagram({ diagram, styles }: { diagram: AnatomyDiagramKind; styles: ReturnType<typeof createStyles> }) {
  const schema = ANATOMY_DIAGRAMS[diagram];
  const [selected, setSelected] = useState<AnatomyPart>(schema.parts[0]);
  return <View style={styles.anatomyCard} accessibilityLabel={schema.title}><Text style={styles.anatomyTitle}>{schema.title}</Text><Text style={styles.anatomyHint}>{schema.description}</Text><View style={styles.anatomyCanvas}><AnatomyIllustration diagram={diagram} selected={selected} /></View><View style={styles.anatomyChoices}>{schema.parts.map((part) => <Pressable key={part.id} accessibilityRole="button" accessibilityState={{ selected: selected.id === part.id }} accessibilityLabel={`${part.label}. ${part.detail}`} onPress={() => setSelected(part)} style={({ pressed }) => [styles.anatomyChoice, selected.id === part.id && { borderColor: part.color, backgroundColor: `${part.color}15` }, pressed && styles.anatomyChoicePressed]}><View style={[styles.anatomyDot, { backgroundColor: part.color }]} /><Text style={styles.anatomyChoiceText}>{part.label}</Text></Pressable>)}</View><View style={[styles.anatomyDetail, { borderColor: selected.color }]} accessibilityLiveRegion="polite"><Text style={[styles.anatomyDetailTitle, { color: selected.color }]}>{selected.label}</Text><Text style={styles.anatomyDetailText}>{selected.detail}</Text></View><Text style={styles.anatomyFallback}>Repère de lecture : chaque élément est aussi expliqué par du texte ; le schéma sert d’aide à la localisation et non de modèle à l’échelle.</Text></View>;
}

function BiologyAnimation({ animation, styles }: { animation: BiologyAnimationKind; styles: ReturnType<typeof createStyles> }) {
  const schema = BIOLOGY_ANIMATIONS[animation];
  const [selectedStep, setSelectedStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const translation = progress.interpolate({ inputRange: [0, 1], outputRange: [0, 172] });
  const play = () => { progress.stopAnimation(); progress.setValue(0); setPlaying(true); Animated.timing(progress, { toValue: 1, duration: 1600, useNativeDriver: true }).start(({ finished }) => { setPlaying(false); if (finished) setSelectedStep(schema.steps.length - 1); }); };
  const selected = schema.steps[selectedStep];
  return <View style={styles.animationCard} accessibilityLabel={schema.title}><Text style={styles.animationTitle}>{schema.title}</Text><Text style={styles.animationHint}>{schema.description}</Text><View style={styles.animationTimeline} accessibilityLabel={`Étapes : ${schema.steps.map((step) => step.label).join(', ')}`}><View style={styles.animationTrack} />{schema.steps.map((step, index) => <View key={step.label} style={[styles.animationStage, { left: index * 86 }]}><View style={[styles.animationStageDot, { backgroundColor: step.color }]} /><Text style={styles.animationStageText}>{step.label}</Text></View>)}<Animated.View style={[styles.animationPulse, { transform: [{ translateX: translation }] }]} /></View><View style={styles.animationControls}><Pressable accessibilityRole="button" accessibilityLabel={playing ? "Animation en cours" : "Lancer l’animation"} disabled={playing} onPress={play} style={({ pressed }) => [styles.animationButton, playing && styles.animationButtonDisabled, pressed && styles.animationButtonPressed]}><Text style={styles.animationButtonText}>{playing ? "Lecture…" : "Lancer"}</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Revenir à la première étape" onPress={() => { progress.stopAnimation(); progress.setValue(0); setPlaying(false); setSelectedStep(0); }} style={({ pressed }) => [styles.animationReset, pressed && styles.animationButtonPressed]}><Text style={styles.animationResetText}>Recommencer</Text></Pressable></View><View style={styles.animationChoices}>{schema.steps.map((step, index) => <Pressable key={step.label} accessibilityRole="button" accessibilityState={{ selected: selectedStep === index }} accessibilityLabel={`${step.label}. ${step.detail}`} onPress={() => setSelectedStep(index)} style={({ pressed }) => [styles.animationChoice, selectedStep === index && { borderColor: step.color, backgroundColor: `${step.color}15` }, pressed && styles.animationChoicePressed]}><Text style={styles.animationChoiceText}>{index + 1}. {step.label}</Text></Pressable>)}</View><View style={[styles.animationDetail, { borderColor: selected.color }]} accessibilityLiveRegion="polite"><Text style={[styles.animationDetailTitle, { color: selected.color }]}>{selected.label}</Text><Text style={styles.animationDetailText}>{selected.detail}</Text></View><Text style={styles.animationFallback}>Repère de lecture : utilisez les étapes numérotées pour étudier la séquence même si l’animation n’est pas lancée.</Text></View>;
}

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
    if (block.type === "trajectory_simulator") return <TrajectorySimulator key={key} styles={styles} />;
    if (block.type === "force_diagram") return <ForceDiagram key={key} diagram={block.diagram} styles={styles} />;
    if (block.type === "anatomy_diagram") return <AnatomyDiagram key={key} diagram={block.diagram} styles={styles} />;
    if (block.type === "biology_animation") return <BiologyAnimation key={key} animation={block.animation} styles={styles} />;
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
  forceCard: { gap: 10, padding: 14, borderRadius: 18, borderWidth: 1, borderColor: colors.primary, backgroundColor: colors.surfaceMuted },
  forceTitle: { color: colors.primary, fontSize: 17, lineHeight: 24, fontWeight: "900" },
  forceHint: { color: colors.text, fontSize: 13, lineHeight: 20 },
  forceCanvas: { height: 180, borderRadius: 14, overflow: "hidden", backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
  forceChoices: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  forceChoice: { flexDirection: "row", alignItems: "center", gap: 7, borderRadius: 999, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background, paddingHorizontal: 10, paddingVertical: 8 },
  forceChoicePressed: { opacity: 0.76, transform: [{ scale: 0.98 }] },
  forceDot: { width: 9, height: 9, borderRadius: 5 },
  forceChoiceText: { color: colors.text, fontSize: 12, lineHeight: 16, fontWeight: "800" },
  forceDetail: { gap: 3, padding: 11, borderRadius: 12, backgroundColor: colors.background, borderLeftWidth: 4 },
  forceDetailTitle: { fontSize: 14, lineHeight: 19, fontWeight: "900" },
  forceDetailText: { color: colors.text, fontSize: 13, lineHeight: 20 },
  forceFallback: { color: colors.muted, fontSize: 12, lineHeight: 18, fontStyle: "italic" },
  trajectoryCard: { gap: 10, padding: 14, borderRadius: 18, borderWidth: 1, borderColor: colors.primary, backgroundColor: colors.primarySoft },
  trajectoryTitle: { color: colors.primary, fontSize: 17, lineHeight: 24, fontWeight: "900" },
  trajectoryHint: { color: colors.text, fontSize: 13, lineHeight: 20 },
  trajectoryCanvas: { height: 180, borderRadius: 14, overflow: "hidden", backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
  trajectoryControls: { flexDirection: "row", gap: 10 },
  trajectoryControl: { flex: 1, gap: 7, padding: 10, borderRadius: 12, backgroundColor: colors.background },
  trajectoryLabel: { color: colors.text, fontSize: 12, lineHeight: 18, fontWeight: "900" },
  trajectoryButtons: { flexDirection: "row", gap: 8 },
  trajectoryButton: { flex: 1, minHeight: 34, alignItems: "center", justifyContent: "center", borderRadius: 9, backgroundColor: colors.primary },
  trajectoryButtonText: { color: colors.background, fontSize: 18, lineHeight: 22, fontWeight: "900" },
  trajectoryResult: { gap: 3, padding: 11, borderRadius: 12, backgroundColor: colors.background, borderLeftWidth: 4, borderColor: colors.success },
  trajectoryResultTitle: { color: colors.success, fontSize: 14, lineHeight: 19, fontWeight: "900" },
  trajectoryResultText: { color: colors.text, fontSize: 13, lineHeight: 19 },
  trajectoryFallback: { color: colors.muted, fontSize: 12, lineHeight: 18, fontStyle: "italic" },
  anatomyCard: { gap: 10, padding: 14, borderRadius: 18, borderWidth: 1, borderColor: colors.primary, backgroundColor: colors.primarySoft },
  anatomyTitle: { color: colors.primary, fontSize: 17, lineHeight: 24, fontWeight: "900" },
  anatomyHint: { color: colors.text, fontSize: 13, lineHeight: 20 },
  anatomyCanvas: { height: 185, borderRadius: 14, overflow: "hidden", backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
  anatomyChoices: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  anatomyChoice: { flexDirection: "row", alignItems: "center", gap: 7, borderRadius: 999, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background, paddingHorizontal: 10, paddingVertical: 8 },
  anatomyChoicePressed: { opacity: 0.76, transform: [{ scale: 0.98 }] },
  anatomyDot: { width: 9, height: 9, borderRadius: 5 },
  anatomyChoiceText: { color: colors.text, fontSize: 12, lineHeight: 16, fontWeight: "800" },
  anatomyDetail: { gap: 3, padding: 11, borderRadius: 12, backgroundColor: colors.background, borderLeftWidth: 4 },
  anatomyDetailTitle: { fontSize: 14, lineHeight: 19, fontWeight: "900" },
  anatomyDetailText: { color: colors.text, fontSize: 13, lineHeight: 20 },
  anatomyFallback: { color: colors.muted, fontSize: 12, lineHeight: 18, fontStyle: "italic" },
  animationCard: { gap: 10, padding: 14, borderRadius: 18, borderWidth: 1, borderColor: colors.success, backgroundColor: colors.surfaceMuted },
  animationTitle: { color: colors.success, fontSize: 17, lineHeight: 24, fontWeight: "900" },
  animationHint: { color: colors.text, fontSize: 13, lineHeight: 20 },
  animationTimeline: { height: 70, position: "relative", overflow: "hidden", borderRadius: 14, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
  animationTrack: { position: "absolute", left: 17, right: 17, top: 25, height: 4, borderRadius: 3, backgroundColor: colors.border },
  animationStage: { position: "absolute", top: 13, width: 74, alignItems: "center", gap: 4 },
  animationStageDot: { width: 18, height: 18, borderRadius: 10, borderWidth: 2, borderColor: colors.background },
  animationStageText: { color: colors.text, fontSize: 10, lineHeight: 14, textAlign: "center", fontWeight: "800" },
  animationPulse: { position: "absolute", top: 18, left: 17, width: 13, height: 13, borderRadius: 8, backgroundColor: colors.primary, borderWidth: 2, borderColor: colors.background },
  animationControls: { flexDirection: "row", gap: 9 },
  animationButton: { flex: 1, minHeight: 38, alignItems: "center", justifyContent: "center", borderRadius: 10, backgroundColor: colors.success },
  animationButtonDisabled: { opacity: 0.64 },
  animationButtonPressed: { opacity: 0.76, transform: [{ scale: 0.98 }] },
  animationButtonText: { color: colors.background, fontSize: 13, lineHeight: 18, fontWeight: "900" },
  animationReset: { minHeight: 38, alignItems: "center", justifyContent: "center", borderRadius: 10, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background, paddingHorizontal: 12 },
  animationResetText: { color: colors.primary, fontSize: 13, lineHeight: 18, fontWeight: "900" },
  animationChoices: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  animationChoice: { borderWidth: 1, borderColor: colors.border, borderRadius: 999, backgroundColor: colors.background, paddingHorizontal: 10, paddingVertical: 8 },
  animationChoicePressed: { opacity: 0.76, transform: [{ scale: 0.98 }] },
  animationChoiceText: { color: colors.text, fontSize: 12, lineHeight: 16, fontWeight: "800" },
  animationDetail: { gap: 3, padding: 11, borderRadius: 12, backgroundColor: colors.background, borderLeftWidth: 4 },
  animationDetailTitle: { fontSize: 14, lineHeight: 19, fontWeight: "900" },
  animationDetailText: { color: colors.text, fontSize: 13, lineHeight: 20 },
  animationFallback: { color: colors.muted, fontSize: 12, lineHeight: 18, fontStyle: "italic" },
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
