/** Configuration publique injectée à la compilation ; aucune clé de service n’est utilisée côté mobile. */
export const supabaseConfig = {
  isConfigured: Boolean(process.env.EXPO_PUBLIC_SUPABASE_URL && process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
  url: process.env.EXPO_PUBLIC_SUPABASE_URL,
};

