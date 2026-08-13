import { describe, expect, it } from "vitest";
import { getAuthAvailability } from "../lib/auth/auth-service";
import { supabaseConfig } from "../lib/supabase/config";
describe("fondations d’authentification EduTech School", () => {
  it("n’expose aucune connexion Supabase fictive", () => { expect(supabaseConfig.isConfigured).toBe(false); expect(supabaseConfig.url).toBeUndefined(); expect(supabaseConfig.anonKey).toBeUndefined(); });
  it("annonce clairement que l’authentification est en préparation", () => { const availability = getAuthAvailability(); expect(availability.provider).toBe("supabase"); expect(availability.isConfigured).toBe(false); expect(availability.message).toContain("Supabase"); });
});

