import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const root = process.cwd();
const config = readFileSync(resolve(root, "app.config.ts"), "utf8");

function pngInfo(relativePath: string) {
  const png = readFileSync(resolve(root, relativePath));
  return {
    signature: png.subarray(0, 8).toString("hex"),
    width: png.readUInt32BE(16),
    height: png.readUInt32BE(20),
    colorType: png.readUInt8(25),
  };
}

describe("icône Android EduTech School", () => {
  it("référence explicitement la même identité pour Expo et Android adaptatif", () => {
    expect(config).toContain('icon: "./assets/images/icon.png"');
    expect(config).toContain('backgroundColor: "#155EEF"');
    expect(config).toContain(
      'foregroundImage: "./assets/images/android-icon-foreground.png"',
    );
    expect(config).toContain(
      'backgroundImage: "./assets/images/android-icon-background.png"',
    );
    expect(config).toContain(
      'monochromeImage: "./assets/images/android-icon-monochrome.png"',
    );
  });

  it("fournit une icône principale carrée et des calques adaptatifs de taille cohérente", () => {
    const icon = pngInfo("assets/images/icon.png");
    const foreground = pngInfo("assets/images/android-icon-foreground.png");
    const background = pngInfo("assets/images/android-icon-background.png");
    const monochrome = pngInfo("assets/images/android-icon-monochrome.png");

    for (const asset of [icon, foreground, background, monochrome]) {
      expect(asset.signature).toBe("89504e470d0a1a0a");
      expect(asset.width).toBe(1024);
      expect(asset.height).toBe(1024);
    }
    expect(foreground.colorType).toBe(6);
    expect(monochrome.colorType).toBe(6);
  });
});
