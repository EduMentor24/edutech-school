import { writeFileSync } from "node:fs";

import { buildLessonPdfHtml } from "../lib/lessons/lesson-pdf-html";

const sections = Array.from({ length: 28 }, (_, index) => `## Partie ${index + 1}\n\n> **Définition**\n> Cette définition pédagogique vérifie le comportement des encadrés et de la mise en page sur un document long.\n\n$$\nf_${index + 1}(x) = x^2 + ${index + 1}x\n$$\n\nUne explication détaillée complète cette section afin de générer plusieurs pages et de contrôler la répétition de l’en-tête et du pied de page.\n`).join("\n");

const logoSvg = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MiIgaGVpZ2h0PSI0MiIgdmlld0JveD0iMCAwIDQyIDQyIj48cmVjdCB3aWR0aD0iNDIiIGhlaWdodD0iNDIiIHJ4PSIxMCIgZmlsbD0iIzE1NjVDMCIvPjx0ZXh0IHg9IjIxIiB5PSIyNyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXdlaWdodD0iNzAwIiBmb250LXNpemU9IjE2IiBmaWxsPSJ3aGl0ZSI+RVM8L3RleHQ+PC9zdmc+";

const html = buildLessonPdfHtml({
  title: "Vérification PDF multipage",
  description: "Contrôle automatisé de l’en-tête et du pied de page répétés.",
  logoUri: logoSvg,
  content: sections,
});

writeFileSync("/tmp/edutech-pdf-multipage.html", html, "utf8");
