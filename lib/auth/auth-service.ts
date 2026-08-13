export type AuthAvailability = { provider: "supabase"; isConfigured: boolean; message: string };
export function getAuthAvailability(): AuthAvailability { return { provider: "supabase", isConfigured: false, message: "L’authentification sécurisée sera activée dès la connexion du projet Supabase." }; }
