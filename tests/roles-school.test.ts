import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("rôles, profil scolaire et administration", () => {
  const provider = readFileSync("lib/auth/supabase-auth-provider.tsx", "utf8");
  const register = readFileSync("app/auth/register.tsx", "utf8");
  const profile = readFileSync("app/(tabs)/profile.tsx", "utf8");
  const layout = readFileSync("app/_layout.tsx", "utf8");

  it("enregistre uniquement le niveau et la série validés dans les métadonnées Auth", () => {
    expect(provider).toContain("school_level: schoolLevel, series");
    expect(provider).toContain('SCHOOL_LEVELS = ["Première", "Terminale"]');
    expect(provider).toContain('SCHOOL_SERIES = ["A1", "A2", "C", "D"]');
    expect(provider).not.toContain("data: { role");
  });

  it("propose des sélecteurs scolaires obligatoires, sans champ de rôle", () => {
    expect(register).toContain('const SCHOOL_LEVELS = ["Première", "Terminale"]');
    expect(register).toContain('const SCHOOL_SERIES = ["A1", "A2", "C", "D"]');
    expect(register).toContain('accessibilityRole="radio"');
    expect(register).toContain("!schoolLevel || !series");
    expect(register).not.toContain("role");
  });

  it("n’expose l’administration et sa route qu’au rôle admin", () => {
    expect(profile).toContain("isAdmin ? <SettingsRow");
    expect(layout).toContain("guard={isAuthenticated && !isPasswordRecovery && isAdmin}");
    expect(layout).toContain('<Stack.Screen name="administration" />');
  });
});
