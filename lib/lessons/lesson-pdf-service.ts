import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

import { buildLessonPdfHtml } from "@/lib/lessons/lesson-pdf-html";

export type LessonPdfInput = { title: string; description?: string | null; content: string };

const LESSON_PDF_MARGINS = { left: 36, top: 42, right: 36, bottom: 78 };

function browserWindow() {
  return globalThis as typeof globalThis & { window?: Window };
}

function buildPrintableLessonPdfHtml(input: LessonPdfInput) {
  return buildLessonPdfHtml(input);
}

export async function printLessonPdf(input: LessonPdfInput) {
  const html = buildPrintableLessonPdfHtml(input);
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
  await Print.printAsync({ html, margins: LESSON_PDF_MARGINS });
}

/** Creates a native PDF then opens the operating system's save/share dialog. */
export async function downloadLessonPdf(input: LessonPdfInput) {
  const html = buildPrintableLessonPdfHtml(input);
  if (Platform.OS === "web") {
    await printLessonPdf(input);
    return;
  }
  const result = await Print.printToFileAsync({ html, margins: LESSON_PDF_MARGINS });
  if (!(await Sharing.isAvailableAsync())) throw new Error("Le partage de fichiers PDF n’est pas disponible sur cet appareil.");
  await Sharing.shareAsync(result.uri, { mimeType: "application/pdf", UTI: ".pdf", dialogTitle: "Enregistrer ou partager le cours PDF" });
}
