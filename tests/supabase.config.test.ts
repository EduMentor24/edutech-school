import { describe, expect, it } from "vitest";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

describe("configuration Supabase", () => {
  it("valide les paramètres publics auprès du service Auth", async () => {
    expect(supabaseUrl).toMatch(/^https:\/\/[a-z0-9-]+\.supabase\.co$/i);
    expect(publishableKey).toBeTruthy();

    const response = await fetch(`${supabaseUrl}/auth/v1/settings`, {
      headers: {
        apikey: publishableKey!,
        Authorization: `Bearer ${publishableKey!}`,
      },
    });

    expect(response.ok).toBe(true);
  });

  it("rejette une tentative de connexion avec des identifiants invalides", async () => {
    const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        apikey: publishableKey!,
        Authorization: `Bearer ${publishableKey!}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "validation-invalide@invalid.example",
        password: "mot-de-passe-invalide",
      }),
    });

    expect(response.ok).toBe(false);
    expect(response.status).toBeGreaterThanOrEqual(400);
  });

  it("accepte une demande de réinitialisation sans révéler l’existence d’un compte", async () => {
    const response = await fetch(`${supabaseUrl}/auth/v1/recover`, {
      method: "POST",
      headers: {
        apikey: publishableKey!,
        Authorization: `Bearer ${publishableKey!}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: "validation-invalide@invalid.example" }),
    });

    expect(response.ok).toBe(true);
  });

  it("ne retourne aucun profil à un client anonyme", async () => {
    const response = await fetch(`${supabaseUrl}/rest/v1/profiles?select=id&limit=1`, {
      headers: {
        apikey: publishableKey!,
        Authorization: `Bearer ${publishableKey!}`,
      },
    });

    if (!response.ok) {
      expect([401, 403]).toContain(response.status);
      return;
    }

    const profiles = (await response.json()) as Array<{ id: string }>;
    expect(profiles).toEqual([]);
  });
});
