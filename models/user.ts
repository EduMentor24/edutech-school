export type SchoolLevel = "secondaire";
export type StudentProfile = { id: string; email: string; displayName: string; schoolLevel: SchoolLevel; series?: string };
export type UserPreferences = { theme: "light" | "dark"; notificationsEnabled?: boolean; language: "fr" };
