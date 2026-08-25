import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");
const migration = readFileSync(resolve(root, "supabase/migrations/20260825_temporarily_disable_premiere_offerings.sql"), "utf8");
const registration = readFileSync(resolve(root, "app/auth/register.tsx"), "utf8");
const about = readFileSync(resolve(root, "app/about.tsx"), "utf8");
const infoScreen = readFileSync(resolve(root, "components/edutech/info-screen.tsx"), "utf8");

describe("désactivation temporaire de Première et défaut Terminale", () => {
  it("désactive uniquement les offres Première avec des gardes de périmètre réversibles", () => {
    expect(migration).toContain("level.name = 'Première'");
    expect(migration).toContain("offering_total <> 56");
    expect(migration).toContain("published_offering_total <> 36");
    expect(migration).toContain("set is_published = false");
    expect(migration).not.toContain("delete from");
  });

  it("préremplit Terminale pour les nouveaux comptes", () => {
    expect(registration).toContain('const SCHOOL_LEVELS = ["Première", "Terminale"]');
    expect(registration).toContain('useState("Terminale")');
  });

  it("affiche une signature développeur séparée dans À propos", () => {
    expect(about).toContain('footer="Developed by loua moïse. Space digital"');
    expect(infoScreen).toContain("footer?: string");
    expect(infoScreen).toContain("styles.footer");
  });
});
