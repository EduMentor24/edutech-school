export type ThemeMode = "light" | "dark";

export const palettes = {
  light: { primary: "#155EEF", primaryDark: "#0E2A6B", primarySoft: "#EAF0FF", background: "#F5F8FF", surface: "#FFFFFF", surfaceMuted: "#EEF3FF", text: "#101828", muted: "#667085", border: "#D9E2F4", success: "#12B76A", warning: "#B54708", warningSoft: "#FFF3E0", error: "#D92D20", tab: "#FFFFFF" },
  dark: { primary: "#84ADFF", primaryDark: "#C7D7FE", primarySoft: "#192D5B", background: "#101B33", surface: "#18233D", surfaceMuted: "#202F50", text: "#F5F7FF", muted: "#B6C0D6", border: "#314565", success: "#47CD89", warning: "#FDB022", warningSoft: "#3D2D15", error: "#F97066", tab: "#18233D" },
} as const;

export type EduColors = (typeof palettes)[ThemeMode];
