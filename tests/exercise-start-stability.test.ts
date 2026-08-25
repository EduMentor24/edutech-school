import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const screen = readFileSync("app/exercise/[exerciseId].tsx", "utf8");

describe("stabilité du démarrage d’exercice", () => {
  it("mémorise le contexte de cache à partir des champs stables du profil", () => {
    expect(screen).toContain("const cacheContext = useMemo(() => pedagogicalCacheContextFromProfile");
    expect(screen).toContain("[profileId, schoolLevel, profileSeries, profileRole]");
    expect(screen).not.toContain("const cacheContext = pedagogicalCacheContextFromProfile(profile);");
  });

  it("ne relie pas le chargement détaillé à l’état saving du bouton", () => {
    expect(screen).toContain("}, [cacheContext, exerciseId]); useEffect(() => { void load(); }, [load]);");
    expect(screen).not.toContain("[cacheContext, exerciseId, saving]");
  });
});
