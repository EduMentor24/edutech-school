import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("chaîne de profil utilisateur", () => {
  const provider = readFileSync("lib/auth/supabase-auth-provider.tsx", "utf8");
  const screen = readFileSync("app/(tabs)/profile.tsx", "utf8");

  it("récupère le profil avec l’identifiant de l’utilisateur Auth connecté", () => {
    expect(provider).toContain('.from("profiles").select(PROFILE_FIELDS).eq("id", user.id).maybeSingle()');
  });

  it("différencie les états chargement, erreur réelle et profil en attente", () => {
    expect(screen).toContain("Chargement de votre profil");
    expect(screen).toContain("Erreur de chargement");
    expect(screen).toContain("Profil en cours de création");
    expect(provider).toContain("else if (!data) { setProfile(null); setProfileError(null); }");
  });
});

