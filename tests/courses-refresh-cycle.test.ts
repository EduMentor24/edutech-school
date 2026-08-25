import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const coursesScreen = readFileSync("app/(tabs)/courses.tsx", "utf8");

describe("rafraîchissement stable du catalogue Cours", () => {
  it("ne relance pas le profil au focus pour éviter une succession de chargements plein écran", () => {
    expect(coursesScreen).not.toContain("refreshProfile().finally(() => void load())");
    expect(coursesScreen).not.toContain("useFocusEffect");
    expect(coursesScreen).not.toContain("void refreshProfile();");
  });

  it("charge le catalogue après une évolution réelle du profil", () => {
    expect(coursesScreen).toContain("useEffect(() => {");
    expect(coursesScreen).toContain("if (profile) {");
    expect(coursesScreen).toContain("void load();");
  });
});
