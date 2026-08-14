import { describe, expect, it } from "vitest";

import { buildLearningProgress, type ProgressRpcRow } from "../lib/progress/learning-progress-model";

const rows: ProgressRpcRow[] = [
  {
    offering_id: "offering-a",
    subject_id: "subject-a",
    subject_name: "Philosophie",
    subject_description: null,
    offering_display_order: 10,
    chapter_id: "chapter-1",
    chapter_title: "Compétence 1",
    chapter_description: null,
    chapter_display_order: 10,
    lesson_id: "lesson-1",
    lesson_title: "Leçon 1",
    lesson_display_order: 10,
    progress_status: "completed",
    started_at: "2026-08-01T08:00:00.000Z",
    last_viewed_at: "2026-08-03T08:00:00.000Z",
    completed_at: "2026-08-03T08:00:00.000Z",
    study_seconds: 120,
    is_favorite: false,
  },
  {
    offering_id: "offering-a",
    subject_id: "subject-a",
    subject_name: "Philosophie",
    subject_description: null,
    offering_display_order: 10,
    chapter_id: "chapter-1",
    chapter_title: "Compétence 1",
    chapter_description: null,
    chapter_display_order: 10,
    lesson_id: "lesson-2",
    lesson_title: "Leçon 2",
    lesson_display_order: 20,
    progress_status: "in_progress",
    started_at: "2026-08-04T08:00:00.000Z",
    last_viewed_at: "2026-08-04T08:00:00.000Z",
    completed_at: null,
    study_seconds: 45,
    is_favorite: true,
  },
  {
    offering_id: "offering-a",
    subject_id: "subject-a",
    subject_name: "Philosophie",
    subject_description: null,
    offering_display_order: 10,
    chapter_id: "chapter-2",
    chapter_title: "Compétence 2",
    chapter_description: null,
    chapter_display_order: 20,
    lesson_id: "lesson-3",
    lesson_title: "Leçon 3",
    lesson_display_order: 10,
    progress_status: null,
    started_at: null,
    last_viewed_at: null,
    completed_at: null,
    study_seconds: null,
    is_favorite: false,
  },
];

describe("buildLearningProgress", () => {
  it("calcule les agrégats de matière et de chapitre à partir des seules lignes disponibles", () => {
    const dashboard = buildLearningProgress(rows);

    expect(dashboard).toMatchObject({ totalLessons: 3, completedLessons: 1, percentage: 33 });
    expect(dashboard.subjects[0]).toMatchObject({ totalLessons: 3, completedLessons: 1, remainingLessons: 2, percentage: 33 });
    expect(dashboard.subjects[0].chapters[0]).toMatchObject({ totalLessons: 2, completedLessons: 1, percentage: 50 });
    expect(dashboard.subjects[0].chapters[1]).toMatchObject({ totalLessons: 1, completedLessons: 0, percentage: 0 });
  });

  it("priorise une leçon en cours pour la reprise et conserve les favoris", () => {
    const subject = buildLearningProgress(rows).subjects[0];

    expect(subject.resumeLessonId).toBe("lesson-2");
    expect(subject.chapters[0].lessons[1]).toMatchObject({ status: "in_progress", isFavorite: true, studySeconds: 45 });
  });

  it("retourne un état vide sans pourcentage fictif quand aucune leçon publiée n’est accessible", () => {
    expect(buildLearningProgress([])).toEqual({ subjects: [], totalLessons: 0, completedLessons: 0, percentage: 0 });
  });
});
