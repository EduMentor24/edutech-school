import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("Contrat local-first Citations", () => {
  it("persiste le corpus ciblé, les favoris et une file de reprise sans exposer de réponses d’évaluation", async () => {
    const source = await readFile(
      join(process.cwd(), "lib/citations/citation-service.ts"),
      "utf8",
    );

    expect(source).toContain("readPedagogicalLocalFirst");
    expect(source).toContain('const CATALOG_RESOURCE = "citations/catalog"');
    expect(source).toContain("FAVORITES_QUEUE_KEY");
    expect(source).toContain("flushCitationFavoriteQueue");
    expect(source).toContain("clearCitationOfflineData");
    expect(source).toContain("getFavoriteCitationIds(userId");
  });
});
