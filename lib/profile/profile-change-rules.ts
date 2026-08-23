export const PROFILE_SCHOOL_LEVELS = ["Première", "Terminale"] as const;
export const PROFILE_SCHOOL_SERIES = ["A1", "A2", "C", "D"] as const;

export type ProfileChangeComparable = {
  firstName: string | null | undefined;
  lastName: string | null | undefined;
  avatarPath: string | null | undefined;
  schoolLevel: string | null | undefined;
  series: string | null | undefined;
};

export type NormalizedProfileChange = {
  firstName: string;
  lastName: string;
  avatarPath: string | null;
  schoolLevel: (typeof PROFILE_SCHOOL_LEVELS)[number];
  series: (typeof PROFILE_SCHOOL_SERIES)[number];
};

function clean(value: string | null | undefined) {
  return value?.trim() ?? "";
}

export function normalizeProfileChange(input: ProfileChangeComparable): NormalizedProfileChange | null {
  const firstName = clean(input.firstName);
  const lastName = clean(input.lastName);
  const schoolLevel = clean(input.schoolLevel);
  const series = clean(input.series);
  const avatar = clean(input.avatarPath);

  if (!firstName || !lastName) return null;
  if (!PROFILE_SCHOOL_LEVELS.includes(schoolLevel as (typeof PROFILE_SCHOOL_LEVELS)[number])) return null;
  if (!PROFILE_SCHOOL_SERIES.includes(series as (typeof PROFILE_SCHOOL_SERIES)[number])) return null;

  return {
    firstName,
    lastName,
    avatarPath: avatar || null,
    schoolLevel: schoolLevel as (typeof PROFILE_SCHOOL_LEVELS)[number],
    series: series as (typeof PROFILE_SCHOOL_SERIES)[number],
  };
}

export function hasMeaningfulProfileChange(current: ProfileChangeComparable, next: ProfileChangeComparable) {
  const normalizedCurrent = normalizeProfileChange({
    firstName: current.firstName,
    lastName: current.lastName,
    avatarPath: current.avatarPath,
    schoolLevel: current.schoolLevel,
    series: current.series,
  });
  const normalizedNext = normalizeProfileChange(next);
  if (!normalizedCurrent || !normalizedNext) return true;

  return (
    normalizedCurrent.firstName !== normalizedNext.firstName ||
    normalizedCurrent.lastName !== normalizedNext.lastName ||
    normalizedCurrent.avatarPath !== normalizedNext.avatarPath ||
    normalizedCurrent.schoolLevel !== normalizedNext.schoolLevel ||
    normalizedCurrent.series !== normalizedNext.series
  );
}

export function isManagedProfileAvatarPath(value: string | null | undefined) {
  return Boolean(value && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/[A-Za-z0-9._-]+$/i.test(value));
}
