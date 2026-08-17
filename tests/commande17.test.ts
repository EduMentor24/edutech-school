import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const project = resolve(__dirname, "..");
const schema = readFileSync(resolve(project, "commande17_schema.sql"), "utf8");
const bulletinService = readFileSync(resolve(project, "lib/bulletin/bulletin-service.ts"), "utf8");
const profileProvider = readFileSync(resolve(project, "lib/auth/supabase-auth-provider.tsx"), "utf8");
const adminService = readFileSync(resolve(project, "lib/admin/school-administration-service.ts"), "utf8");
const adminHome = readFileSync(resolve(project, "app/administration.tsx"), "utf8");
const studentHistory = readFileSync(resolve(project, "app/profile/school-history.tsx"), "utf8");

describe("Commande 17 — gestion administrative et historique scolaire", () => {
  it("1. crée un historique scolaire par élève et année", () => expect(schema).toContain("CREATE TABLE IF NOT EXISTS public.edutech_student_school_history"));
  it("2. impose une seule fiche historique par élève et année", () => expect(schema).toContain("UNIQUE(student_id, school_year_id)"));
  it("3. crée les demandes de changement de classe", () => expect(schema).toContain("CREATE TABLE IF NOT EXISTS public.edutech_class_change_requests"));
  it("4. empêche deux demandes en attente pour le même élève et la même année", () => expect(schema).toContain("edutech_one_pending_class_request_idx"));
  it("5. protège l’unicité de l’année scolaire active", () => expect(schema).toContain("edutech_school_years_one_active_idx"));
  it("6. conserve les statuts préparation, active, clôturée et archivée", () => { expect(schema).toContain("WHERE status = 'active'"); expect(adminService).toContain('type SchoolYearStatus = "draft" | "active" | "closed" | "archived"'); });
  it("7. applique RLS sur les années scolaires", () => expect(schema).toContain("ALTER TABLE public.edutech_school_years ENABLE ROW LEVEL SECURITY"));
  it("8. applique RLS sur les historiques scolaires", () => expect(schema).toContain("ALTER TABLE public.edutech_student_school_history ENABLE ROW LEVEL SECURITY"));
  it("9. applique RLS sur les demandes de changement", () => expect(schema).toContain("ALTER TABLE public.edutech_class_change_requests ENABLE ROW LEVEL SECURITY"));
  it("10. limite la lecture de l’historique à l’élève concerné ou à l’administration", () => expect(schema).toContain("student_id = auth.uid() OR public.is_edutech_admin()"));
  it("11. limite les demandes aux élèves concernés ou à l’administration", () => expect(schema).toContain("edutech_class_request_student_read"));
  it("12. ajoute l’accès administrateur aux profils sans contourner le chargement du profil propre à l’élève", () => { expect(schema).toContain("edutech_profiles_admin_select"); expect(profileProvider).toContain('.eq("id", user.id)'); });
  it("13. protège niveau, série et année contre une mise à jour directe d’un élève", () => { expect(schema).toContain("app.edutech_allow_school_update"); expect(schema).toContain("NEW.school_year := OLD.school_year"); });
  it("14. effectue la première modification de classe par une fonction authentifiée", () => expect(schema).toContain("FUNCTION public.student_change_school_class"));
  it("15. transforme une seconde modification en demande administrative", () => { expect(schema).toContain("'pending', false"); expect(schema).toContain("class_change_requested"); });
  it("16. journalise les créations, activations, clôtures et archivages", () => { expect(schema).toContain("school_year_created"); expect(schema).toContain("school_year_activated"); expect(schema).toContain("school_year_closed"); expect(schema).toContain("school_year_archived"); });
  it("17. conserve la décision de passage comme choix administratif non automatique", () => { expect(schema).toContain("FUNCTION public.admin_record_promotion_decision"); expect(schema).toContain("promotion_decision_recorded"); });
  it("18. expose année scolaire, LV2 et statut dans le profil authentifié", () => { expect(profileProvider).toContain("school_year: string | null"); expect(profileProvider).toContain("lv2_choice"); expect(profileProvider).toContain("is_active"); });
  it("19. résout la classe historique dans le Bulletin pour l’année sélectionnée", () => { expect(bulletinService).toContain("getProfileOfferings(profile, schoolYear)"); expect(bulletinService).toContain("edutech_student_school_history"); });
  it("20. fournit les écrans d’administration et le parcours élève demandés", () => { expect(adminHome).toContain("Années scolaires"); expect(adminHome).toContain("Utilisateurs"); expect(adminHome).toContain("Demandes de classe"); expect(adminHome).toContain("Décisions de passage"); expect(studentHistory).toContain("Modifier ma classe"); expect(adminService).toContain("getAdministrativeLogs"); });
});
