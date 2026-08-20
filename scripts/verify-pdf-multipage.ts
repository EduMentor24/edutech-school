import { writeFileSync } from "node:fs";

import { buildLessonPdfHtml } from "../lib/lessons/lesson-pdf-html";

const sections = Array.from({ length: 28 }, (_, index) => `## Partie ${index + 1}\n\n> **Définition**\n> Cette définition pédagogique vérifie le comportement des encadrés et de la mise en page sur un document long.\n\n$$\nf_${index + 1}(x) = x^2 + ${index + 1}x\n$$\n\nUne explication détaillée complète cette section afin de générer plusieurs pages et de contrôler la répétition du seul pied de page.\n`).join("\n");

const html = buildLessonPdfHtml({
  title: "Vérification PDF multipage",
  description: "Contrôle automatisé du pied de page développeur répété.",
  content: sections,
});

writeFileSync("/tmp/edutech-pdf-multipage.html", html, "utf8");
