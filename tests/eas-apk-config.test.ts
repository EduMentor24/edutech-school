import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("configuration EAS APK", () => {
  it("définit un profil interne Android produisant une APK installable", () => {
    const config = JSON.parse(readFileSync("eas.json", "utf8")) as {
      cli?: { appVersionSource?: string };
      build?: {
        apk?: { distribution?: string; android?: { buildType?: string } };
      };
    };

    expect(config.cli?.appVersionSource).toBe("local");
    expect(config.build?.apk?.distribution).toBe("internal");
    expect(config.build?.apk?.android?.buildType).toBe("apk");
  });
});
