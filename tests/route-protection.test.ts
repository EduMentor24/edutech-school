import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("protection des routes", () => {
  it("déclare des écrans publics et privés dans le navigateur racine", () => {
    const layout = readFileSync("app/_layout.tsx", "utf8");

    expect(layout).toContain("<Stack.Protected guard={!isAuthenticated || isPasswordRecovery}>");
    expect(layout).toContain("<Stack.Protected guard={isAuthenticated && !isPasswordRecovery}>");
    expect(layout).toContain('name="(tabs)"');
    expect(layout).toContain('name="profile/edit"');
  });
});
