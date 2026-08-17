import { getActiveSchoolYears, publishAdminNotification } from "./admin-notification-service";
import { supabase } from "@/lib/supabase/client";

const message = (error: unknown) => typeof error === "object" && error && "message" in error && typeof error.message === "string" ? error.message : "Impossible de générer la notification de contenu.";

async function resolveTarget(levelId: string, seriesId: string) {
  const [levelResult, seriesResult, years] = await Promise.all([
    supabase.from("levels").select("name").eq("id", levelId).maybeSingle(),
    supabase.from("series").select("name").eq("id", seriesId).maybeSingle(),
    getActiveSchoolYears(),
  ]);
  if (levelResult.error) throw new Error(message(levelResult.error));
  if (seriesResult.error) throw new Error(message(seriesResult.error));
  const schoolYear = years[0]?.name;
  if (!levelResult.data?.name || !seriesResult.data?.name || !schoolYear) throw new Error("Le niveau, la série ou l’année scolaire active est indisponible pour cette notification.");
  return { level: levelResult.data.name, series: seriesResult.data.name, schoolYear };
}

export async function publishContentNotification(input: { contentType: "cours" | "exercice" | "quiz"; contentId: string; title: string; levelId: string; seriesId: string; route: string }) {
  const target = await resolveTarget(input.levelId, input.seriesId);
  return publishAdminNotification({
    title: `Nouveau ${input.contentType}`,
    body: input.title,
    notificationType: "publication",
    schoolYear: target.schoolYear,
    targetType: "level_series",
    targetLevel: target.level,
    targetSeries: target.series,
    contentType: input.contentType,
    contentId: input.contentId,
    route: input.route,
    sourceKey: `publication:${input.contentType}:${input.contentId}`,
  });
}
