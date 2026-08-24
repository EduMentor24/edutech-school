import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");
const migration = readFileSync(resolve(root, "supabase/migrations/20260824_add_svt_anatomy_biology_interactives.sql"), "utf8");

describe("aides anatomiques et biologiques SVT", () => {
  it("restreint les enrichissements aux sept leçons SVT Terminale attendues", () => {
    expect(migration).toContain("brain_count <> 2 or protein_count <> 2 or immune_count <> 1 or neuron_count <> 1 or heart_count <> 1");
    expect(migration).toContain("subject.name = 'Sciences de la Vie et de la Terre'");
    expect(migration).toContain("level.name = 'Terminale'");
    expect(migration).toContain("not lesson.is_test_data");
  });

  it("ajoute les marqueurs interactifs sans remplacer le contenu pédagogique existant", () => {
    expect(migration).toContain(":::anatomy-diagram-brain");
    expect(migration).toContain(":::anatomy-diagram-neuron");
    expect(migration).toContain(":::anatomy-diagram-heart");
    expect(migration).toContain(":::biology-animation-neural-signal");
    expect(migration).toContain(":::biology-animation-protein-synthesis");
    expect(migration).toContain(":::biology-animation-immune-response");
    expect(migration).toContain("regexp_replace(lesson.content");
    expect(migration).not.toContain("delete from");
  });
});
