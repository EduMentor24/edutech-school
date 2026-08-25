import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { useSupabaseAuth } from "@/lib/auth/supabase-auth-provider";
import { fetchAdminUsers, fetchStudentSchoolHistory, setAdminUserRole, setAdminUserStatus, type AdminUser, type StudentSchoolHistory } from "@/lib/admin/user-management-service";

const PAGE_SIZE = 20;

export default function UsersManagementScreen() {
  const { profile } = useSupabaseAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [history, setHistory] = useState<StudentSchoolHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const load = useCallback(async (nextPage = 0) => {
    try { setLoading(true); const result = await fetchAdminUsers(search, nextPage, PAGE_SIZE); setUsers(result.users); setTotal(result.total); setPage(nextPage); }
    catch (cause) { Alert.alert("Erreur", cause instanceof Error ? cause.message : "Impossible de charger les utilisateurs."); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { void load(0); }, [load]);

  const openDetails = useCallback(async (user: AdminUser) => {
    setSelected(user); setHistory([]); setHistoryLoading(true);
    try { setHistory(await fetchStudentSchoolHistory(user.id)); }
    catch (cause) { Alert.alert("Erreur", cause instanceof Error ? cause.message : "Impossible de charger le parcours scolaire."); }
    finally { setHistoryLoading(false); }
  }, []);

  const confirmStatus = useCallback((user: AdminUser) => {
    const nextActive = !user.isActive;
    Alert.alert(nextActive ? "Réactiver le compte" : "Désactiver le compte", `${nextActive ? "Réactiver" : "Désactiver"} le compte de ${user.fullName || user.email || "cet utilisateur"} ?`, [
      { text: "Annuler", style: "cancel" },
      { text: nextActive ? "Réactiver" : "Désactiver", style: nextActive ? "default" : "destructive", onPress: () => void (async () => { try { setActingId(user.id); await setAdminUserStatus(user.id, nextActive); await load(); } catch (cause) { Alert.alert("Action refusée", cause instanceof Error ? cause.message : "La modification a échoué."); } finally { setActingId(null); } })() },
    ]);
  }, [load]);

  const confirmRole = useCallback((user: AdminUser) => {
    const nextRole = user.role === "admin" ? "student" : "admin";
    Alert.alert(nextRole === "admin" ? "Promouvoir administrateur" : "Retirer le rôle administrateur", `Confirmer le rôle « ${nextRole === "admin" ? "Administrateur" : "Élève"} » pour ${user.fullName || user.email || "cet utilisateur"} ?`, [
      { text: "Annuler", style: "cancel" },
      { text: "Confirmer", style: nextRole === "admin" ? "default" : "destructive", onPress: () => void (async () => { try { setActingId(user.id); await setAdminUserRole(user.id, nextRole); await load(); } catch (cause) { Alert.alert("Action refusée", cause instanceof Error ? cause.message : "La modification a échoué."); } finally { setActingId(null); } })() },
    ]);
  }, [load]);

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  return <ScreenContainer className="p-4 bg-background"><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <Text className="text-2xl font-bold text-foreground">Gestion des utilisateurs</Text>
    <Text className="text-sm text-muted mt-1">Recherche, statut, rôle et parcours scolaire. Les actions sont contrôlées par le serveur.</Text>
    <View style={styles.searchRow}><TextInput placeholder="Nom ou e-mail" placeholderTextColor="#687076" value={search} onChangeText={setSearch} style={styles.search} accessibilityLabel="Rechercher un utilisateur" /><Pressable onPress={() => void load(0)} style={({ pressed }) => [styles.searchButton, pressed && styles.pressed]}><Text style={styles.searchButtonText}>Rechercher</Text></Pressable></View>
    {loading ? <ActivityIndicator size="large" color="#0a7ea4" style={styles.loader} /> : <View style={styles.list}>{users.map((user) => {
      const self = user.id === profile?.id;
      const acting = actingId === user.id;
      return <View key={user.id} style={styles.card}><View style={styles.cardHeader}><View style={styles.copy}><Text style={styles.name}>{user.fullName || "Nom non renseigné"}</Text><Text style={styles.email}>{user.email || "E-mail non renseigné"}</Text></View><Text style={[styles.status, user.isActive ? styles.active : styles.inactive]}>{user.isActive ? "Actif" : "Inactif"}</Text></View><Text style={styles.meta}>{user.schoolLevel || "Niveau —"} · {user.series || "Série —"} · {user.role === "admin" ? "Administrateur" : "Élève"}</Text><Text style={styles.meta}>T1 {formatAverage(user.term1Average)} · T2 {formatAverage(user.term2Average)} · T3 {formatAverage(user.term3Average)} · Année {formatAverage(user.annualAverage)}</Text><View style={styles.actions}><Action label="Parcours" onPress={() => void openDetails(user)} /><Action label={user.isActive ? "Désactiver" : "Réactiver"} disabled={self || acting} onPress={() => confirmStatus(user)} destructive={user.isActive} /><Action label={user.role === "admin" ? "Rôle élève" : "Promouvoir"} disabled={self || acting} onPress={() => confirmRole(user)} /></View>{self ? <Text style={styles.selfNotice}>Votre propre compte ne peut pas être modifié depuis cette page.</Text> : null}</View>;
    })}{users.length === 0 ? <Text style={styles.empty}>Aucun utilisateur ne correspond à cette recherche.</Text> : null}</View>}
    <View style={styles.pagination}><Pressable disabled={loading || page === 0} onPress={() => void load(page - 1)} style={({ pressed }) => [styles.pageButton, (loading || page === 0) && styles.disabled, pressed && page > 0 && styles.pressed]}><Text style={styles.pageText}>Précédent</Text></Pressable><Text style={styles.pageLabel}>Page {page + 1} / {pageCount} · {total} compte{total > 1 ? "s" : ""}</Text><Pressable disabled={loading || page + 1 >= pageCount} onPress={() => void load(page + 1)} style={({ pressed }) => [styles.pageButton, (loading || page + 1 >= pageCount) && styles.disabled, pressed && page + 1 < pageCount && styles.pressed]}><Text style={styles.pageText}>Suivant</Text></Pressable></View>
    {selected ? <View style={styles.details}><View style={styles.cardHeader}><Text style={styles.detailsTitle}>Parcours scolaire</Text><Pressable onPress={() => setSelected(null)}><Text style={styles.close}>Fermer</Text></Pressable></View><Text style={styles.detailsName}>{selected.fullName || selected.email}</Text>{historyLoading ? <ActivityIndicator color="#0a7ea4" /> : history.length ? history.map((entry) => <View key={entry.id} style={styles.historyRow}><Text style={styles.historyTitle}>{entry.schoolYear} · {entry.schoolLevel} {entry.series}</Text><Text style={styles.meta}>T1 {formatAverage(entry.term1Average)} · T2 {formatAverage(entry.term2Average)} · T3 {formatAverage(entry.term3Average)} · Année {formatAverage(entry.annualAverage)}</Text><Text style={styles.meta}>Décision : {entry.promotionDecision || "Non renseignée"} · {entry.recordStatus}</Text></View>) : <Text style={styles.empty}>Aucun historique scolaire enregistré.</Text>}</View> : null}
  </ScrollView></ScreenContainer>;
}

function Action({ label, onPress, disabled, destructive }: { label: string; onPress: () => void; disabled?: boolean; destructive?: boolean }) { return <Pressable disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.action, destructive && styles.actionDestructive, disabled && styles.disabled, pressed && !disabled && styles.pressed]}><Text style={[styles.actionText, destructive && styles.actionTextDestructive]}>{label}</Text></Pressable>; }
function formatAverage(value: number | null) { return value === null ? "—" : `${value.toFixed(2)}/20`; }
const styles = StyleSheet.create({ content: { paddingBottom: 30, gap: 14 }, searchRow: { flexDirection: "row", gap: 8, marginTop: 6 }, search: { flex: 1, minHeight: 46, borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, backgroundColor: "#F5F5F5", color: "#11181C", paddingHorizontal: 12 }, searchButton: { justifyContent: "center", paddingHorizontal: 14, borderRadius: 12, backgroundColor: "#0a7ea4" }, searchButtonText: { color: "#fff", fontWeight: "800", fontSize: 12 }, loader: { marginVertical: 32 }, list: { gap: 10 }, card: { gap: 7, padding: 14, borderRadius: 16, borderWidth: 1, borderColor: "#E5E7EB", backgroundColor: "#F5F5F5" }, cardHeader: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }, copy: { flex: 1 }, name: { color: "#11181C", fontSize: 15, fontWeight: "800" }, email: { color: "#687076", fontSize: 12, marginTop: 2 }, status: { overflow: "hidden", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 99, fontSize: 10, fontWeight: "900" }, active: { color: "#166534", backgroundColor: "#DCFCE7" }, inactive: { color: "#991B1B", backgroundColor: "#FEE2E2" }, meta: { color: "#687076", fontSize: 11, lineHeight: 16 }, actions: { flexDirection: "row", gap: 7, flexWrap: "wrap", marginTop: 3 }, action: { minHeight: 36, justifyContent: "center", paddingHorizontal: 10, borderRadius: 10, borderWidth: 1, borderColor: "#0a7ea4", backgroundColor: "#E6F4FE" }, actionDestructive: { borderColor: "#D92D20", backgroundColor: "#FEF3F2" }, actionText: { color: "#0a7ea4", fontSize: 11, fontWeight: "900" }, actionTextDestructive: { color: "#D92D20" }, selfNotice: { color: "#687076", fontSize: 10, fontStyle: "italic" }, empty: { color: "#687076", textAlign: "center", padding: 20, fontSize: 13 }, pagination: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: 4 }, pageButton: { minHeight: 38, justifyContent: "center", paddingHorizontal: 10, borderRadius: 10, backgroundColor: "#E6F4FE" }, pageText: { color: "#0a7ea4", fontSize: 12, fontWeight: "900" }, pageLabel: { flex: 1, textAlign: "center", color: "#687076", fontSize: 11 }, details: { gap: 8, padding: 14, borderRadius: 16, borderWidth: 1, borderColor: "#0a7ea4", backgroundColor: "#E6F4FE", marginTop: 4 }, detailsTitle: { color: "#11181C", fontSize: 15, fontWeight: "900" }, detailsName: { color: "#0a7ea4", fontSize: 13, fontWeight: "800" }, close: { color: "#0a7ea4", fontSize: 12, fontWeight: "900" }, historyRow: { gap: 3, paddingTop: 9, borderTopWidth: 1, borderTopColor: "#B9E2F3" }, historyTitle: { color: "#11181C", fontSize: 12, fontWeight: "800" }, disabled: { opacity: 0.45 }, pressed: { opacity: 0.72 } });
