import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system/legacy";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

import { buildLessonPdfHtml } from "@/lib/lessons/lesson-pdf-html";

export type LessonPdfInput = { title: string; description?: string | null; content: string };

const appLogo = require("../../assets/images/icon.png");

function browserWindow() {
  return globalThis as typeof globalThis & { window?: Window };
}

async function resolvePdfLogoUri() {
  const asset = Asset.fromModule(appLogo);
  if (Platform.OS === "web") return asset.uri;
  await asset.downloadAsync();
  if (!asset.localUri) return asset.uri;
  const base64 = await FileSystem.readAsStringAsync(asset.localUri, { encoding: FileSystem.EncodingType.Base64 });
  return `data:image/png;base64,${base64}`;
}

async function buildBrandedLessonPdfHtml(input: LessonPdfInput) {
  return buildLessonPdfHtml({ ...input, logoUri: await resolvePdfLogoUri() });
}

export async function printLessonPdf(input: LessonPdfInput) {
  const html = await buildBrandedLessonPdfHtml(input);
  if (Platform.OS === "web") {
    const popup = browserWindow().window?.open("", "_blank");
    if (!popup) throw new Error("Le navigateur a bloqué la fenêtre d’impression. Autorisez les fenêtres surgissantes puis réessayez.");
    popup.document.open();
    popup.document.write(html);
    popup.document.close();
    popup.focus();
    popup.print();
    return;
  }
  await Print.printAsync({ html });
}

/** Creates a native PDF then opens the operating system's save/share dialog. */
export async function downloadLessonPdf(input: LessonPdfInput) {
  const html = await buildBrandedLessonPdfHtml(input);
  if (Platform.OS === "web") {
    await printLessonPdf(input);
    return;
  }
  const result = await Print.printToFileAsync({ html, margins: { left: 24, top: 28, right: 24, bottom: 28 } });
  if (!(await Sharing.isAvailableAsync())) throw new Error("Le partage de fichiers PDF n’est pas disponible sur cet appareil.");
  await Sharing.shareAsync(result.uri, { mimeType: "application/pdf", UTI: ".pdf", dialogTitle: "Enregistrer ou partager le cours PDF" });
}
