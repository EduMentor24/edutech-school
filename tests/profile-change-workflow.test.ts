import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import {
  hasMeaningfulProfileChange,
  isManagedProfileAvatarPath,
  normalizeProfileChange,
} from "../lib/profile/profile-change-rules";

const migration = readFileSync(
  "supabase/migrations/20260822_secure_profile_change_workflow.sql",
  "utf8",
);
const triggerMigration = readFileSync(
  "supabase/migrations/20260823_enforce_profile_update_guard_trigger.sql",
  "utf8",
);

describe("workflow sécurisé de modification de profil", () => {
  const existing = {
    firstName: "Awa",
    lastName: "Koné",
    avatarPath: "f25f8f30-8c10-4e34-84aa-691a64f58ee5/avatar.webp",
    schoolLevel: "Terminale",
    series: "A1",
  };

  it("normalise uniquement les valeurs scolaires et identitaires réellement autorisées", () => {
    expect(normalizeProfileChange(existing)).toEqual(existing);
    expect(normalizeProfileChange({ ...existing, schoolLevel: "Seconde" })).toBeNull();
    expect(normalizeProfileChange({ ...existing, series: "Z" })).toBeNull();
    expect(normalizeProfileChange({ ...existing, firstName: " " })).toBeNull();
  });

  it("n’utilise pas la modification annuelle pour une soumission identique", () => {
    expect(hasMeaningfulProfileChange(existing, { ...existing, firstName: "  Awa  " })).toBe(false);
    expect(hasMeaningfulProfileChange(existing, { ...existing, series: "A2" })).toBe(true);
    expect(hasMeaningfulProfileChange(existing, { ...existing, avatarPath: null })).toBe(true);
  });

  it("identifie strictement les chemins d’avatars gérés par le compartiment sécurisé", () => {
    expect(isManagedProfileAvatarPath(existing.avatarPath)).toBe(true);
    expect(isManagedProfileAvatarPath("https://example.org/avatar.png")).toBe(false);
    expect(isManagedProfileAvatarPath("another-user/avatar.webp")).toBe(false);
  });

  it("impose côté base une RPC atomique, un seul changement direct élève par année et une validation administrative", () => {
    expect(migration).toContain("create table if not exists public.edutech_profile_change_events");
    expect(migration).toContain("edutech_profile_change_one_student_direct_per_year");
    expect(migration).toContain("create or replace function public.submit_profile_change");
    expect(migration).toContain("create or replace function public.admin_review_class_change_request");
    expect(migration).toContain("student_direct");
    expect(migration).toContain("profile_change");
    expect(migration).toContain("security definer");
    expect(migration).toContain("Use submit_profile_change to modify profile information");
    expect(triggerMigration).toContain("create trigger schoolci_guard_profile_update");
    expect(triggerMigration).toContain("before update on public.profiles");
  });

  it("crée un compartiment privé dont les écritures sont limitées au préfixe de l’utilisateur connecté", () => {
    expect(migration).toContain("'profile-avatars'");
    expect(migration).toContain("profile_avatars_insert_own_prefix");
    expect(migration).toContain("(storage.foldername(name))[1] = (select auth.uid()::text)");
    expect(migration).toContain("profile_avatars_select_owner_or_admin");
  });
});
