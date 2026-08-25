import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const appConfig = readFileSync("app.config.ts", "utf8");

describe("Commande 21 — métadonnées de build Android", () => {
  it("déclare une version applicative et un versionCode Android explicite", () => {
    expect(appConfig).toContain('version: "1.0.0"');
    expect(appConfig).toContain("versionCode: 1,");
    expect(appConfig).toContain('package: env.androidPackage');
  });
});
