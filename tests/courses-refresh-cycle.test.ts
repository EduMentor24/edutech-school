import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const coursesScreen = readFileSync("app/(tabs)/courses.tsx", "utf8");

describe("rafraîchissement stable du catalogue Cours", () => {
  it("ne relance pas le focus effect à chaque profil hydraté", () => {
    expect(coursesScreen).not.toContain("refreshProfile().finally(() => void load())");
    expect(coursesScreen).toContain("useFocusEffect(useCallback(() => {");
    expect(coursesScreen).toContain("void refreshProfile();");
  });

  it("charge le catalogue après une évolution réelle du profil", () => {
    expect(coursesScreen).toContain("useEffect(() => {");
    expect(coursesScreen).toContain("if (profile) {");
    expect(coursesScreen).toContain("void load();");
  });
});
