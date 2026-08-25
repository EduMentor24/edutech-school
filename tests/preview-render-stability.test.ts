import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const rootLayout = readFileSync("app/_layout.tsx", "utf8");
const themeProvider = readFileSync("lib/theme-provider.tsx", "utf8");

describe("stabilité de la prévisualisation", () => {
  it("ne journalise pas le thème global à chaque rendu", () => {
    expect(themeProvider).not.toContain("console.log(value, themeVariables)");
  });

  it("ignore les mises à jour de zones sûres identiques au lieu de rerendre toute l’application", () => {
    expect(rootLayout).toContain("function sameInsets");
    expect(rootLayout).toContain("function sameFrame");
    expect(rootLayout).toContain("sameInsets(current, metrics.insets) ? current : metrics.insets");
    expect(rootLayout).toContain("sameFrame(current, metrics.frame) ? current : metrics.frame");
  });
});
