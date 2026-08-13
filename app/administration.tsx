import { Redirect } from "expo-router";
import { ComingSoonScreen } from "@/components/edutech/coming-soon-screen";
import { useSupabaseAuth } from "@/lib/auth/supabase-auth-provider";

export default function AdministrationScreen() {
  const { isAdmin } = useSupabaseAuth();
  if (!isAdmin) return <Redirect href="/(tabs)" />;
  return <ComingSoonScreen title="Administration" subtitle="Espace réservé à la future gestion de l’établissement." icon="admin-panel-settings" description="Cet espace est disponible uniquement aux administrateurs et ne contient aucune donnée administrative simulée." actionLabel="Retour au profil" actionRoute="/(tabs)/profile" />;
}

