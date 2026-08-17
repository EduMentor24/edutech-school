import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("chaîne de profil utilisateur", () => {
  const provider = readFileSync("lib/auth/supabase-auth-provider.tsx", "utf8");
  const screen = readFileSync("app/(tabs)/profile.tsx", "utf8");
  const bulletin = readFileSync("app/bulletin.tsx", "utf8");
  const mentor = readFileSync("app/mentor.tsx", "utf8");

  it("récupère le profil avec l’identifiant de l’utilisateur Auth connecté", () => {
    expect(provider).toContain('.from("profiles")');
    expect(provider).toContain('.eq("id", user.id)');
    expect(provider).toContain(".maybeSingle();");
  });

  it("différencie les états chargement, erreur réelle et profil en attente", () => {
    expect(screen).toContain("Chargement de votre profil");
    expect(screen).toContain("Erreur de chargement");
    expect(screen).toContain("Profil en cours de création");
    expect(provider).toContain("Votre profil n’est pas encore disponible");
    expect(provider).toContain("setIsProfileLoading(false);");
  });

  it("ne maintient pas le Bulletin en chargement lorsque le profil est indisponible", () => {
    expect(bulletin).toContain("if (!profile) {");
    expect(bulletin).toContain("setLoading(false);");
    expect(bulletin).toContain("profileError ??");
  });

  it("distingue le profil indisponible d’une absence de session dans le Mentor", () => {
    expect(mentor).toContain('title="Connexion requise"');
    expect(mentor).toContain('title="Profil indisponible"');
  });
});
