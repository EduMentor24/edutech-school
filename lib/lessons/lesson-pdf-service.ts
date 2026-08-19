import { Platform } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import { buildLessonPdfHtml } from "@/lib/lessons/lesson-pdf-html";

export type LessonPdfInput = { title: string; description?: string | null; content: string };

function browserWindow() {
  return globalThis as typeof globalThis & { window?: Window };
}

export async function printLessonPdf(input: LessonPdfInput) {
  const html = buildLessonPdfHtml(input);
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
  const html = buildLessonPdfHtml(input);
  if (Platform.OS === "web") {
    await printLessonPdf(input);
    return;
  }
  const result = await Print.printToFileAsync({ html, margins: { left: 24, top: 28, right: 24, bottom: 28 } });
  if (!(await Sharing.isAvailableAsync())) throw new Error("Le partage de fichiers PDF n’est pas disponible sur cet appareil.");
  await Sharing.shareAsync(result.uri, { mimeType: "application/pdf", UTI: ".pdf", dialogTitle: "Enregistrer ou partager le cours PDF" });
}
