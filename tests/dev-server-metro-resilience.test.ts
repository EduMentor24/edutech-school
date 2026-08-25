import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const packageJson = JSON.parse(readFileSync(resolve(import.meta.dirname, "../package.json"), "utf8")) as {
  scripts: Record<string, string>;
};

describe("résilience du serveur Metro", () => {
  it("relance Metro après une sortie prématurée sans interrompre le serveur applicatif", () => {
    expect(packageJson.scripts.dev).toContain("concurrently --restart-tries -1");
    expect(packageJson.scripts["dev:metro"]).toContain("while :");
    expect(packageJson.scripts["dev:metro"]).toContain("EXPO_NO_TELEMETRY=1");
    expect(packageJson.scripts["dev:metro"]).toContain("expo start --web");
  });
});
