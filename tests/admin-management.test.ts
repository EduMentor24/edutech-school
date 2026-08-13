import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("administration pédagogique sécurisée", () => {
  const service = readFileSync("lib/admin/course-admin-service.ts", "utf8");
  const dashboard = readFileSync("app/administration.tsx", "utf8");
  const subjects = readFileSync("app/administration/subjects.tsx", "utf8");
  const chapters = readFileSync("app/administration/chapters.tsx", "utf8");
  const lessons = readFileSync("app/administration/lessons.tsx", "utf8");
  const subjectEditor = readFileSync("app/administration/subjects/[subjectId].tsx", "utf8");
  const chapterEditor = readFileSync("app/administration/chapters/[chapterId].tsx", "utf8");
  const lessonEditor = readFileSync("app/administration/lessons/[lessonId].tsx", "utf8");

  it("réserve toutes les pages d’administration au rôle Supabase réel", () => {
    [dashboard, subjects, chapters, lessons, subjectEditor, chapterEditor, lessonEditor].forEach((screen) => {
      expect(screen).toContain("useSupabaseAuth");
      expect(screen).toContain('if (!isAdmin) return <Redirect href="/(tabs)" />');
    });
    expect(dashboard).not.toContain("louamoisegognin@gmail.com");
  });

  it("gère les vraies tables existantes et les associations niveau-série-matière", () => {
    expect(service).toContain('from("subjects")');
    expect(service).toContain('from("course_subject_offerings")');
    expect(service).toContain('from("chapters")');
    expect(service).toContain('from("lessons")');
    expect(service).toContain("setOfferingPublication");
    expect(service).toContain("is_published");
    expect(service).toContain("is_active");
  });

  it("évite la suppression dangereuse et protège les données de test", () => {
    expect(service).toContain("getSubjectDependencySummary");
    expect(service).toContain("getChapterDependencySummary");
    expect(service).toContain("isTestData");
    expect(subjectEditor).toContain("Suppression sécurisée");
    expect(chapterEditor).toContain("Suppression sécurisée");
    expect(lessonEditor).toContain("La leçon de test est protégée");
  });

  it("prévoit des éditeurs ciblés pour les chapitres et les leçons sans générer de contenu", () => {
    expect(chapterEditor).toContain("saveAdminChapter");
    expect(chapterEditor).toContain("Rattaché à");
    expect(chapterEditor).toContain("Ordre d’affichage");
    expect(lessonEditor).toContain('label="Contenu"');
    expect(lessonEditor).toContain("Aucune génération automatique");
    expect(lessonEditor).toContain("Leçon active");
  });
});
