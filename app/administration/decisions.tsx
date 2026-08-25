import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { fetchSchoolYears, type SchoolYear } from "@/lib/admin/school-administration-service";
import { fetchAdminUsers, recordPromotionDecision, type AdminUser } from "@/lib/admin/user-management-service";

type Decision = "pending" | "admitted" | "repeat";
const decisionLabel: Record<Decision, string> = { pending: "En attente", admitted: "Admis", repeat: "Redouble" };

export default function DecisionsScreen() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [years, setYears] = useState<SchoolYear[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedYearId, setSelectedYearId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [userPage, schoolYears] = await Promise.all([fetchAdminUsers("", 0, 100), fetchSchoolYears()]);
      setUsers(userPage.users.filter((user) => user.role === "student"));
      setYears(schoolYears);
      setSelectedYearId((current) => current ?? schoolYears.find((year) => year.status === "active")?.id ?? schoolYears.find((year) => year.status === "closed")?.id ?? null);
    } catch (cause) { Alert.alert("Erreur", cause instanceof Error ? cause.message : "Impossible de charger les décisions."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const user = users.find((item) => item.id === selectedUserId) ?? null;
  const year = years.find((item) => item.id === selectedYearId) ?? null;
  const confirm = useCallback((decision: Decision) => {
    if (!user || !year) { Alert.alert("Sélection requise", "Choisissez un élève et une année scolaire avant d’enregistrer une décision."); return; }
    Alert.alert("Confirmer la décision", `${user.fullName || user.email} · ${year.name}\nDécision : ${decisionLabel[decision]}\n\nLa décision est historisée. Le niveau et la série de l’élève ne seront pas modifiés automatiquement.`, [{ text: "Annuler", style: "cancel" }, { text: "Enregistrer", onPress: () => void (async () => { try { setSaving(true); await recordPromotionDecision(user.id, year.id, decision); await load(); Alert.alert("Décision enregistrée", "La décision a été enregistrée dans l’historique scolaire."); } catch (cause) { Alert.alert("Enregistrement refusé", cause instanceof Error ? cause.message : "La décision n’a pas pu être enregistrée."); } finally { setSaving(false); } })() }]);
  }, [load, user, year]);

  return <ScreenContainer className="p-4 bg-background"><ScrollView contentContainerStyle={styles.content}><Text className="text-2xl font-bold text-foreground">Décisions de passage</Text><Text className="text-sm text-muted mt-1">Récapitulatif scolaire, confirmation et historique des décisions de fin d’année.</Text>{loading ? <ActivityIndicator size="large" color="#0a7ea4" style={styles.loader} /> : <><Text style={styles.section}>Année scolaire concernée</Text><View style={styles.choiceRow}>{years.map((item) => <Choice key={item.id} selected={item.id === selectedYearId} label={`${item.name} · ${item.status}`} onPress={() => setSelectedYearId(item.id)} />)}</View><Text style={styles.section}>Élève concerné</Text><View style={styles.userList}>{users.map((item) => <Pressable key={item.id} onPress={() => setSelectedUserId(item.id)} style={({ pressed }) => [styles.userCard, item.id === selectedUserId && styles.userSelected, pressed && styles.pressed]}><Text style={styles.userName}>{item.fullName || item.email || "Élève"}</Text><Text style={styles.meta}>{item.schoolLevel || "Niveau —"} · {item.series || "Série —"}</Text><Text style={styles.meta}>T1 {format(item.term1Average)} · T2 {format(item.term2Average)} · T3 {format(item.term3Average)} · Année {format(item.annualAverage)}</Text></Pressable>)}</View>{!users.length ? <Text style={styles.empty}>Aucun compte élève actif à traiter.</Text> : null}{user && year ? <View style={styles.summary}><Text style={styles.summaryTitle}>Récapitulatif avant décision</Text><Text style={styles.summaryText}>{user.fullName || user.email} · {user.schoolLevel} {user.series}</Text><Text style={styles.summaryText}>Année : {year.name} · Moyenne annuelle : {format(user.annualAverage)}</Text><Text style={styles.summaryNote}>Une décision est enregistrée dans l’historique. Aucun changement de niveau ou de série n’est déclenché automatiquement.</Text><View style={styles.actions}><DecisionButton label="En attente" disabled={saving} onPress={() => confirm("pending")} /><DecisionButton label="Admis" disabled={saving} onPress={() => confirm("admitted")} success /><DecisionButton label="Redouble" disabled={saving} onPress={() => confirm("repeat")} destructive /></View></View> : null}</>}</ScrollView></ScreenContainer>;
}

function Choice({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) { return <Pressable onPress={onPress} style={({ pressed }) => [styles.choice, selected && styles.choiceSelected, pressed && styles.pressed]}><Text style={[styles.choiceText, selected && styles.choiceTextSelected]}>{label}</Text></Pressable>; }
function DecisionButton({ label, onPress, disabled, success, destructive }: { label: string; onPress: () => void; disabled?: boolean; success?: boolean; destructive?: boolean }) { return <Pressable disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.action, success && styles.success, destructive && styles.destructive, disabled && styles.disabled, pressed && !disabled && styles.pressed]}><Text style={styles.actionText}>{label}</Text></Pressable>; }
function format(value: number | null) { return value === null ? "—" : `${value.toFixed(2)}/20`; }
const styles = StyleSheet.create({ content: { paddingBottom: 30, gap: 12 }, loader: { marginVertical: 32 }, section: { color: "#11181C", fontSize: 14, fontWeight: "900", marginTop: 8 }, choiceRow: { gap: 8 }, choice: { minHeight: 38, justifyContent: "center", borderRadius: 10, paddingHorizontal: 11, backgroundColor: "#F5F5F5", borderWidth: 1, borderColor: "#E5E7EB" }, choiceSelected: { borderColor: "#0a7ea4", backgroundColor: "#E6F4FE" }, choiceText: { color: "#687076", fontSize: 12, fontWeight: "800" }, choiceTextSelected: { color: "#0a7ea4" }, userList: { gap: 8 }, userCard: { gap: 3, padding: 13, borderRadius: 14, backgroundColor: "#F5F5F5", borderWidth: 1, borderColor: "#E5E7EB" }, userSelected: { borderColor: "#0a7ea4", backgroundColor: "#E6F4FE" }, userName: { color: "#11181C", fontSize: 14, fontWeight: "900" }, meta: { color: "#687076", fontSize: 11, lineHeight: 16 }, summary: { gap: 7, marginTop: 6, padding: 14, borderRadius: 16, borderWidth: 1, borderColor: "#0a7ea4", backgroundColor: "#E6F4FE" }, summaryTitle: { color: "#11181C", fontSize: 15, fontWeight: "900" }, summaryText: { color: "#475467", fontSize: 12 }, summaryNote: { color: "#687076", fontSize: 11, lineHeight: 16 }, actions: { flexDirection: "row", gap: 8, flexWrap: "wrap", marginTop: 3 }, action: { minHeight: 38, justifyContent: "center", paddingHorizontal: 10, borderRadius: 10, backgroundColor: "#0a7ea4" }, success: { backgroundColor: "#16794C" }, destructive: { backgroundColor: "#D92D20" }, actionText: { color: "#fff", fontSize: 11, fontWeight: "900" }, empty: { color: "#687076", textAlign: "center", padding: 16 }, disabled: { opacity: 0.5 }, pressed: { opacity: 0.72 } });
