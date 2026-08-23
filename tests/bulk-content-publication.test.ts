import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync("supabase/migrations/20260823_secure_bulk_content_publication.sql", "utf8");
const hardening = readFileSync("supabase/migrations/20260823_harden_bulk_content_publication_search_path.sql", "utf8");
const service = readFileSync("lib/admin/content-publication-service.ts", "utf8");

describe("publication groupée de contenus", () => {
  it("limite la publication au chapitre ou à l’unité demandée et exige un administrateur connecté", () => {
    expect(migration).toContain("p_scope not in ('chapter', 'lesson')");
    expect(migration).toContain("auth.uid() is null or not public.is_edutech_admin()");
    expect(migration).toContain("v_target_lesson_id is null or le.id = v_target_lesson_id");
  });

  it("publie uniquement les contenus complets et exclut les données de test", () => {
    expect(migration).toContain("nullif(btrim(coalesce(le.content, '')), '') is not null");
    expect(migration).toContain("exists (select 1 from public.exercise_questions");
    expect(migration).toContain("exists (select 1 from public.quiz_questions");
    expect(migration).toContain("not e.is_test_data");
    expect(migration).toContain("not q.is_test_data");
  });

  it("protège l’exécution RPC et conserve un aperçu explicite avant application", () => {
    expect(migration).toContain("revoke all on function public.edutech_publish_content_scope");
    expect(migration).toContain("grant execute on function public.edutech_publish_content_scope");
    expect(service).toContain("previewContentPublication");
    expect(service).toContain("publishContentScope");
    expect(hardening).toContain("edutech_content_publication_scope(text, uuid, boolean) set search_path = ''");
  });
});
