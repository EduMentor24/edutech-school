import type { AdminOfferingOption } from "@/lib/admin/course-admin-service";

export type LessonCatalogDimension = "level" | "series" | "subject";

function firstMatching(
  offerings: AdminOfferingOption[],
  predicate: (offering: AdminOfferingOption) => boolean,
): string | null {
  return offerings.find(predicate)?.id ?? null;
}

/**
 * Garde l’offre actuellement visible lorsqu’elle reste compatible avec le nouveau filtre.
 * Cette logique est locale à l’administration : aucun filtre élève ni aucune requête RLS n’est modifié.
 */
export function selectLessonOffering(
  offerings: AdminOfferingOption[],
  selectedOfferingId: string | null,
  dimension: LessonCatalogDimension,
  value: string,
): string | null {
  const current = offerings.find((offering) => offering.id === selectedOfferingId) ?? null;

  if (dimension === "level") {
    return firstMatching(
      offerings,
      (offering) =>
        offering.levelName === value &&
        offering.seriesName === current?.seriesName &&
        offering.subjectId === current?.subjectId,
    ) ?? firstMatching(offerings, (offering) => offering.levelName === value) ?? offerings[0]?.id ?? null;
  }

  if (dimension === "series") {
    return firstMatching(
      offerings,
      (offering) =>
        offering.levelName === current?.levelName &&
        offering.seriesName === value &&
        offering.subjectId === current?.subjectId,
    ) ?? firstMatching(
      offerings,
      (offering) => offering.levelName === current?.levelName && offering.seriesName === value,
    ) ?? offerings[0]?.id ?? null;
  }

  return firstMatching(
    offerings,
    (offering) =>
      offering.levelName === current?.levelName &&
      offering.seriesName === current?.seriesName &&
      offering.subjectId === value,
  ) ?? offerings[0]?.id ?? null;
}

export function uniqueCatalogValues(
  offerings: AdminOfferingOption[],
  field: "levelName" | "seriesName" | "subjectName",
): string[] {
  return Array.from(new Set(offerings.map((offering) => offering[field])));
}
