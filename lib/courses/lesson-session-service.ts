import { supabase } from "@/lib/supabase/client";
import { readPedagogicalLocalFirst, type PedagogicalCacheContext } from "@/lib/offline/pedagogical-cache";

export type LessonSession = {
  id: string;
  lessonId: string;
  title: string;
  description: string | null;
  content: string;
  displayOrder: number;
  isActive: boolean;
};

function messageFrom(error: unknown) {
  return typeof error === "object" && error && "message" in error && typeof error.message === "string"
    ? error.message
    : "Une erreur de données est survenue.";
}

/** Charge les séances de la leçon, dans leur ordre pédagogique. Les brouillons restent réservés à l’aperçu administrateur. */
export async function getLessonSessions(lessonId: string, options: { includeInactive?: boolean; cacheContext?: PedagogicalCacheContext | null } = {}): Promise<LessonSession[]> {
  const resource = `lesson/${encodeURIComponent(lessonId)}/sessions/${options.includeInactive ? "admin" : "student"}`;
  return readPedagogicalLocalFirst(options.cacheContext, resource, async () => {
    let request = supabase
      .from("lesson_sessions")
      .select("id,lesson_id,title,description,content,display_order,is_active")
      .eq("lesson_id", lessonId);
    if (!options.includeInactive) request = request.eq("is_active", true);
    const { data, error } = await request.order("display_order", { ascending: true });
    if (error) throw new Error(messageFrom(error));
    return (data ?? []).map((session: any) => ({
      id: session.id,
      lessonId: session.lesson_id,
      title: session.title,
      description: session.description,
      content: session.content,
      displayOrder: session.display_order,
      isActive: Boolean(session.is_active),
    }));
  });
}
