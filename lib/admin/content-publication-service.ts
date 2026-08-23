import { supabase } from "@/lib/supabase/client";

export type ContentPublicationScope = "chapter" | "lesson";

export type ContentPublicationPreview = {
  scope: ContentPublicationScope;
  targetId: string;
  targetTitle: string;
  chapterId: string;
  chapterTitle: string;
  subjectOfferingId: string;
  willActivateSubject: boolean;
  willPublishOffering: boolean;
  willActivateChapter: boolean;
  publishable: { lessons: number; exercises: number; quizzes: number };
  skipped: { exercisesWithoutQuestion: number; quizzesWithoutQuestion: number };
  applied: boolean;
  changed: { lessons: number; exercises: number; quizzes: number };
};

function message(error: unknown) {
  return typeof error === "object" && error && "message" in error && typeof error.message === "string"
    ? error.message
    : "La publication groupée n’a pas pu être effectuée.";
}

function previewFrom(value: unknown): ContentPublicationPreview {
  if (!value || typeof value !== "object") throw new Error("La réponse de publication est invalide.");
  return value as ContentPublicationPreview;
}

export async function previewContentPublication(scope: ContentPublicationScope, targetId: string) {
  const { data, error } = await supabase.rpc("edutech_preview_content_publication", { p_scope: scope, p_target_id: targetId });
  if (error) throw new Error(message(error));
  return previewFrom(data);
}

export async function publishContentScope(scope: ContentPublicationScope, targetId: string) {
  const { data, error } = await supabase.rpc("edutech_publish_content_scope", { p_scope: scope, p_target_id: targetId });
  if (error) throw new Error(message(error));
  return previewFrom(data);
}
