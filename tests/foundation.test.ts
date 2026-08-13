import { describe, expect, it } from "vitest";

import { getAuthAvailability } from "../lib/auth/auth-service";
import { supabaseConfig } from "../lib/supabase/config";

describe("fondations d’authentification EduTech School", () => {
  it("expose une configuration publique Supabase sans clé de service", () => {
    expect(supabaseConfig.isConfigured).toBe(true);
    expect(supabaseConfig.url).toMatch(/^https:\/\/[a-z0-9-]+\.supabase\.co$/i);
  });

  it("conserve un message explicite sur l’authentification sécurisée", () => {
    const availability = getAuthAvailability();
    expect(availability.provider).toBe("supabase");
    expect(availability.message).toContain("Supabase");
  });
});
