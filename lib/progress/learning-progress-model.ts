export type LessonProgressStatus = "not_started" | "in_progress" | "completed";

export type LessonProgress = {
  id: string;
  chapterId: string;
  title: string;
  displayOrder: number;
  status: LessonProgressStatus;
  startedAt: string | null;
  lastViewedAt: string | null;
  completedAt: string | null;
  studySeconds: number;
  isFavorite: boolean;
};

export type ChapterProgress = {
  id: string;
  offeringId: string;
  title: string;
  description: string | null;
  displayOrder: number;
  lessons: LessonProgress[];
  completedLessons: number;
  totalLessons: number;
  percentage: number;
};

export type SubjectProgress = {
  offeringId: string;
  subjectId: string;
  subjectName: string;
  subjectDescription: string | null;
  displayOrder: number;
  chapters: ChapterProgress[];
  completedLessons: number;
  totalLessons: number;
  remainingLessons: number;
  percentage: number;
  resumeLessonId: string | null;
};

export type LearningProgressDashboard = {
  subjects: SubjectProgress[];
  completedLessons: number;
  totalLessons: number;
  percentage: number;
};

export type ProgressRpcRow = {
  offering_id: string;
  subject_id: string;
  subject_name: string;
  subject_description: string | null;
  offering_display_order: number | null;
  chapter_id: string;
  chapter_title: string;
  chapter_description: string | null;
  chapter_display_order: number | null;
  lesson_id: string;
  lesson_title: string;
  lesson_display_order: number | null;
  progress_status: "in_progress" | "completed" | null;
  started_at: string | null;
  last_viewed_at: string | null;
  completed_at: string | null;
  study_seconds: number | string | null;
  is_favorite: boolean | null;
};

export function numeric(value: number | string | null | undefined) {
  const parsed = typeof value === "number" ? value : Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function progressPercentage(completedLessons: number, totalLessons: number) {
  return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
}

function compareLessonOrder(left: LessonProgress, right: LessonProgress) {
  return left.displayOrder - right.displayOrder || left.title.localeCompare(right.title, "fr");
}

function latestDate(lessons: LessonProgress[], status?: LessonProgressStatus) {
  return lessons
    .filter((lesson) => !status || lesson.status === status)
    .filter((lesson) => Boolean(lesson.lastViewedAt))
    .sort((left, right) => (right.lastViewedAt ?? "").localeCompare(left.lastViewedAt ?? ""))[0] ?? null;
}

export function buildLearningProgress(rows: ProgressRpcRow[]): LearningProgressDashboard {
  const subjects = new Map<string, SubjectProgress>();

  for (const row of rows) {
    let subject = subjects.get(row.offering_id);
    if (!subject) {
      subject = { offeringId: row.offering_id, subjectId: row.subject_id, subjectName: row.subject_name, subjectDescription: row.subject_description, displayOrder: numeric(row.offering_display_order), chapters: [], completedLessons: 0, totalLessons: 0, remainingLessons: 0, percentage: 0, resumeLessonId: null };
      subjects.set(row.offering_id, subject);
    }
    let chapter = subject.chapters.find((item) => item.id === row.chapter_id);
    if (!chapter) {
      chapter = { id: row.chapter_id, offeringId: row.offering_id, title: row.chapter_title, description: row.chapter_description, displayOrder: numeric(row.chapter_display_order), lessons: [], completedLessons: 0, totalLessons: 0, percentage: 0 };
      subject.chapters.push(chapter);
    }
    chapter.lessons.push({ id: row.lesson_id, chapterId: row.chapter_id, title: row.lesson_title, displayOrder: numeric(row.lesson_display_order), status: row.progress_status ?? "not_started", startedAt: row.started_at, lastViewedAt: row.last_viewed_at, completedAt: row.completed_at, studySeconds: numeric(row.study_seconds), isFavorite: Boolean(row.is_favorite) });
  }

  const subjectList = [...subjects.values()].map((subject) => {
    subject.chapters = subject.chapters.sort((left, right) => left.displayOrder - right.displayOrder || left.title.localeCompare(right.title, "fr")).map((chapter) => {
      chapter.lessons.sort(compareLessonOrder);
      chapter.totalLessons = chapter.lessons.length;
      chapter.completedLessons = chapter.lessons.filter((lesson) => lesson.status === "completed").length;
      chapter.percentage = progressPercentage(chapter.completedLessons, chapter.totalLessons);
      return chapter;
    });
    const lessons = subject.chapters.flatMap((chapter) => chapter.lessons);
    subject.totalLessons = lessons.length;
    subject.completedLessons = lessons.filter((lesson) => lesson.status === "completed").length;
    subject.remainingLessons = subject.totalLessons - subject.completedLessons;
    subject.percentage = progressPercentage(subject.completedLessons, subject.totalLessons);
    subject.resumeLessonId = (latestDate(lessons, "in_progress") ?? latestDate(lessons) ?? lessons[0] ?? null)?.id ?? null;
    return subject;
  }).sort((left, right) => left.displayOrder - right.displayOrder || left.subjectName.localeCompare(right.subjectName, "fr"));

  const totalLessons = subjectList.reduce((total, subject) => total + subject.totalLessons, 0);
  const completedLessons = subjectList.reduce((total, subject) => total + subject.completedLessons, 0);
  return { subjects: subjectList, totalLessons, completedLessons, percentage: progressPercentage(completedLessons, totalLessons) };
}

export function progressForOffering(dashboard: LearningProgressDashboard, offeringId: string) {
  return dashboard.subjects.find((subject) => subject.offeringId === offeringId) ?? null;
}

export function progressForChapter(dashboard: LearningProgressDashboard, chapterId: string) {
  return dashboard.subjects.flatMap((subject) => subject.chapters).find((chapter) => chapter.id === chapterId) ?? null;
}

export function progressForLesson(dashboard: LearningProgressDashboard, lessonId: string) {
  return dashboard.subjects.flatMap((subject) => subject.chapters).flatMap((chapter) => chapter.lessons).find((lesson) => lesson.id === lessonId) ?? null;
}
