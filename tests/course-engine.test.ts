import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("moteur de cours progressif", () => {
  const service = readFileSync("lib/courses/course-service.ts", "utf8");
  const courses = readFileSync("app/(tabs)/courses.tsx", "utf8");
  const reader = readFileSync("app/course/lesson/[lessonId].tsx", "utf8");

  it("cible les requêtes de matières selon le niveau et la série du profil", () => {
    expect(service).toContain('eq("level_id", level.id).eq("series_id", series.id)');
    expect(service).toContain('eq("is_published", true)');
    expect(service).toContain('eq("subject.is_active", true)');
    expect(service).toContain('eq("is_active", true)');
    expect(service).toContain('chapters(id)');
    expect(service).toContain("activeChapterCount");
    expect(service).toContain('order("display_order", { ascending: true })');
    expect(service).toContain('getChaptersForOffering');
    expect(service).toContain('getLessonsForChapter');
  });

  it("remplace l’état indisponible par des états réels et une liste Supabase", () => {
    expect(courses).toContain("getCoursesForProfile(profile)");
    expect(courses).toContain("Aucun cours disponible pour votre niveau et votre série pour le moment.");
    expect(courses).toContain("CourseLoading");
    expect(courses).toContain("CourseError");
    expect(courses).toContain("Matière disponible, contenu à venir");
    expect(courses).toContain("Aucun cours disponible pour votre niveau et votre série pour le moment.");
  });

  it("prévoit la lecture et la navigation entre les leçons du même chapitre", () => {
    expect(reader).toContain("getLesson(lessonId)");
    expect(reader).toContain("getLessonsForChapter");
    expect(reader).toContain("Leçon précédente");
    expect(reader).toContain("Leçon suivante");
  });
});
