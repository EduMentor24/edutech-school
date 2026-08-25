import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const quizCatalog = readFileSync("app/(tabs)/quizzes.tsx", "utf8");
const exerciseCatalog = readFileSync("app/(tabs)/exercises.tsx", "utf8");

describe("stabilité de défilement des catalogues pédagogiques", () => {
  for (const [label, source, itemKey] of [
    ["Quiz", quizCatalog, "quizId"],
    ["Exercices", exerciseCatalog, "exerciseId"],
  ] as const) {
    it(`${label} mémorise son contexte de cache à partir des champs stables du profil`, () => {
      expect(source).toContain("const cacheContext = useMemo(() => pedagogicalCacheContextFromProfile(profileId");
      expect(source).toContain("[profileId, schoolLevel, profileSeries, profileRole]");
    });

    it(`${label} conserve une FlatList sans clé dynamique ni pagination au scroll`, () => {
      expect(source).toContain(`keyExtractor={(item) => item.${itemKey}}`);
      expect(source).not.toContain("onEndReached");
      expect(source).not.toContain("onScroll");
      expect(source).not.toContain("key={");
    });

    it(`${label} relance le chargement uniquement au focus ou lors d’une action explicite`, () => {
      expect(source).toContain("useFocusEffect(useCallback(() => { void load(); }, [load]));");
      expect(source).toContain("onRetry={() => void load()}");
    });
  }
});
