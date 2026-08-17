import { Redirect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { AppScreen } from "@/components/edutech/app-screen";
import { EmptyState } from "@/components/edutech/empty-state";
import { PageHeader } from "@/components/edutech/page-header";
import { getAdministrativeLogs, type AdministrativeLog } from "@/lib/admin/school-administration-service";
import { useSupabaseAuth } from "@/lib/auth/supabase-auth-provider";
import { useEduTheme } from "@/lib/edutech/theme-context";

export default function AdminAuditLogScreen() {
  const { isAdmin } = useSupabaseAuth(); const { colors } = useEduTheme(); const styles = useMemo(() => makeStyles(colors), [colors]); const [logs, setLogs] = useState<AdministrativeLog[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null);
  const load = useCallback(async () => { setLoading(true); try { setLogs(await getAdministrativeLogs()); setError(null); } catch (cause) { setError(cause instanceof Error ? cause.message : "Chargement impossible."); } finally { setLoading(false); } }, []); useEffect(() => { void load(); }, [load]);
  if (!isAdmin) return <Redirect href="/(tabs)" />; return <AppScreen withPadding={false}><FlatList data={logs} keyExtractor={(item) => item.id} contentContainerStyle={styles.content} ListHeaderComponent={<View style={styles.header}><PageHeader title="Journal administratif" subtitle="Historique des actions sensibles, réservé aux administrateurs" back />{error ? <Text style={styles.error}>{error}</Text> : null}</View>} ListEmptyComponent={loading ? <Text style={styles.muted}>Chargement du journal…</Text> : <EmptyState icon="history" title="Aucune action journalisée" description="Les créations, validations, décisions et changements apparaîtront ici." />} renderItem={({ item }) => <View style={styles.card}><Text style={styles.action}>{item.action.replaceAll("_", " ")}</Text><Text style={styles.meta}>{item.resourceType} · {new Date(item.createdAt).toLocaleString("fr-FR")}</Text><Text style={styles.meta}>Acteur : {item.actorId ? item.actorId.slice(0, 8) : "Système"}</Text></View>} /></AppScreen>;
}
const makeStyles = (c: ReturnType<typeof useEduTheme>["colors"]) => StyleSheet.create({ content: { padding: 20, paddingTop: 18, paddingBottom: 34, gap: 10, flexGrow: 1 }, header: { gap: 10, marginBottom: 4 }, error: { color: c.error, padding: 10, borderRadius: 12, backgroundColor: `${c.error}12`, fontSize: 12, fontWeight: "700" }, muted: { color: c.muted, textAlign: "center", paddingVertical: 50, fontWeight: "700" }, card: { padding: 14, borderWidth: 1, borderColor: c.border, backgroundColor: c.surface, borderRadius: 18, gap: 4 }, action: { color: c.text, fontSize: 14, fontWeight: "900", textTransform: "capitalize" }, meta: { color: c.muted, fontSize: 11, fontWeight: "700" } });
