import { describe, expect, it } from "vitest";
import { lessonSpeechText } from "../lib/courses/lesson-speech-text";

describe("extraction de texte vocal pour leçon", () => {
  it("extrait le texte des titres, paragraphes et listes", () => {
    const text = lessonSpeechText(
      "## Titre important\n\nPremier paragraphe.\n\n- Point un\n- Point deux\n\n1. Étape un\n2. Étape deux",
    );
    expect(text).toContain("Titre important");
    expect(text).toContain("Premier paragraphe");
    expect(text).toContain("Point un");
    expect(text).toContain("Étape un");
  });

  it("conserve les encadrés avec leur titre et contenu", () => {
    const text = lessonSpeechText(
      "> **Définition**\n> Cellule nerveuse.\n> Protéine globale.",
    );
    expect(text).toContain("Définition");
    expect(text).toContain("Cellule nerveuse");
    expect(text).toContain("Protéine globale");
  });

  it("lit les formules au format speakspeech", () => {
    const text = lessonSpeechText("$$\nf(x) = x²\n$$");
    expect(text).toContain("Formule");
    expect(text).toContain("f(x) = x²");
  });

  it("lit les tableaux en en-tête puis lignes", () => {
    const text = lessonSpeechText(
      "| Col A | Col B |\n|-------|-------|\n| val1  | val2  |",
    );
    expect(text).toContain("Col A");
    expect(text).toContain("Col B");
    expect(text).toContain("val1");
    expect(text).toContain("val2");
  });

  it("ignore les barres de séparation et les blocs interactifs", () => {
    const text = lessonSpeechText(
      "---\n\n:::computer-hardware-diagram\n\n:::force-diagram-solid\n\n:::anatomy-diagram-brain\n\n:::biology-animation-neural-signal",
    );
    expect(text).toBe("");
  });

  it("retourne une chaîne vide pour du markdown vide", () => {
    expect(lessonSpeechText("")).toBe("");
  });

  it("conserve le texte en gras des balises inline", () => {
    const text = lessonSpeechText("La **membrane cellulaire** est sélective.");
    expect(text).toContain("membrane cellulaire");
    expect(text).toContain("La");
    expect(text).toContain("sélective");
  });

  it("gère le glossaire en conservant uniquement le terme lisible", () => {
    const text = lessonSpeechText(
      "Un [[neurone|neuron|cellule nerveuse]] transmet l'information.",
    );
    expect(text).toContain("neurone");
    expect(text).not.toContain("[[");
  });
});
