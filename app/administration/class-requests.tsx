import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Redirect, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { AppScreen } from "@/components/edutech/app-screen";
import { EmptyState } from "@/components/edutech/empty-state";
import { PageHeader } from "@/components/edutech/page-header";
import { useSupabaseAuth } from "@/lib/auth/supabase-auth-provider";
import { useEduTheme } from "@/lib/edutech/theme-context";
import { supabase } from "@/lib/supabase/client";

type ChangeRequest = {
  id: string;
  student_id: string;
  school_year: string;
  old_school_level: string;
  old_series: string;
  new_school_level: string;
  new_series: string;
  request_kind: "class_change" | "profile_change";
  new_full_name: string | null;
  new_avatar_url: string | null;
  reason: string | null;
  status: "pending" | "accepted" | "rejected";
  review_note: string | null;
  created_at: string;
};

const requestStatus = (status: ChangeRequest["status"]) => status === "accepted" ? "Approuvée" : status === "rejected" ? "Refusée" : "En attente";
const messageFrom = (error: unknown) => error instanceof Error ? error.message : "Impossible de traiter cette demande.";

export default function ClassRequestsScreen() {
  const { isAdmin } = useSupabaseAuth();
  const { colors } = useEduTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [requests, setRequests] = useState<ChangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      const { data, error: queryError } = await supabase
        .from("edutech_class_change_requests")
        .select("id,student_id,school_year,old_school_level,old_series,new_school_level,new_series,request_kind,new_full_name,new_avatar_url,reason,status,review_note,created_at")
        .order("created_at", { ascending: false });
      if (queryError) throw queryError;
      setRequests((data ?? []) as ChangeRequest[]);
      setError(null);
    } catch (cause) {
      setError(messageFrom(cause));
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useFocusEffect(useCallback(() => { void loadRequests(); }, [loadRequests]));

  const review = useCallback(async (request: ChangeRequest, accept: boolean) => {
    setBusyId(request.id);
    try {
      const { error: rpcError } = await supabase.rpc("admin_review_class_change_request", {
        p_request_id: request.id,
        p_accept: accept,
        p_review_note: null,
      });
      if (rpcError) throw rpcError;
      await loadRequests();
    } catch (cause) {
      setError(messageFrom(cause));
    } finally {
      setBusyId(null);
    }
  }, [loadRequests]);

  const confirmReview = (request: ChangeRequest, accept: boolean) => {
    const action = accept ? "approuver" : "refuser";
    const label = request.request_kind === "profile_change" ? "cette demande de modification de profil" : "cette demande de changement de classe";
    Alert.alert(
      `${accept ? "Approuver" : "Refuser"} la demande`,
      `Voulez-vous ${action} ${label} ? ${accept ? "Le profil concerné sera mis à jour de manière atomique." : "Le profil de l’élève restera inchangé."}`,
      [
        { text: "Annuler", style: "cancel" },
        { text: accept ? "Approuver" : "Refuser", style: accept ? "default" : "destructive", onPress: () => void review(request, accept) },
      ],
    );
  };

  if (!isAdmin) return <Redirect href="/(tabs)" />;

  return <AppScreen withPadding={false}><FlatList data={requests} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} refreshing={loading} onRefresh={() => void loadRequests()} ListHeaderComponent={<View style={styles.header}><PageHeader title="Demandes de profil" subtitle="Examinez les demandes de modification de profil et de classe." back />{error ? <View style={styles.error}><Text style={styles.errorText}>{error}</Text><Pressable onPress={() => void loadRequests()}><Text style={styles.retryText}>Réessayer</Text></Pressable></View> : null}</View>} ListEmptyComponent={loading ? <View style={styles.loading}><ActivityIndicator color={colors.primary} /><Text style={styles.loadingText}>Chargement des demandes…</Text></View> : <EmptyState icon="fact-check" title="Aucune demande" description="Les futures demandes motivées des élèves apparaîtront ici pour examen." />} renderItem={({ item }) => <RequestCard request={item} busy={busyId === item.id} onAccept={() => confirmReview(item, true)} onReject={() => confirmReview(item, false)} styles={styles} colors={colors} />} /></AppScreen>;
}

function RequestCard({ request, busy, onAccept, onReject, styles, colors }: { request: ChangeRequest; busy: boolean; onAccept: () => void; onReject: () => void; styles: ReturnType<typeof createStyles>; colors: ReturnType<typeof useEduTheme>["colors"] }) {
  const pending = request.status === "pending";
  const isProfile = request.request_kind === "profile_change";
  const stateColor = pending ? colors.warning : request.status === "accepted" ? colors.success : colors.error;
  const targetChanged = `${request.old_school_level} ${request.old_series}` !== `${request.new_school_level} ${request.new_series}`;
  const createdAt = new Date(request.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
  return <View style={styles.card}><View style={styles.cardTop}><View style={styles.typeBadge}><MaterialIcons name={isProfile ? "manage-accounts" : "school"} size={16} color={colors.primary} /><Text style={styles.typeBadgeText}>{isProfile ? "Modification de profil" : "Changement de classe"}</Text></View><View style={[styles.statusBadge, { backgroundColor: `${stateColor}20` }]}><Text style={[styles.statusText, { color: stateColor }]}>{requestStatus(request.status)}</Text></View></View><Text style={styles.student}>Élève : {request.student_id}</Text><Text style={styles.date}>Demandée le {createdAt} · année {request.school_year}</Text>{isProfile && request.new_full_name ? <View style={styles.changeRow}><MaterialIcons name="person-outline" size={17} color={colors.muted} /><Text style={styles.changeText}>Nom demandé : {request.new_full_name}</Text></View> : null}{isProfile && request.new_avatar_url !== null ? <View style={styles.changeRow}><MaterialIcons name="photo" size={17} color={colors.muted} /><Text style={styles.changeText}>Nouvelle photo de profil jointe à la demande.</Text></View> : null}{(targetChanged || !isProfile) ? <View style={styles.changeRow}><MaterialIcons name="school" size={17} color={colors.muted} /><Text style={styles.changeText}>Parcours : {request.old_school_level} {request.old_series} → {request.new_school_level} {request.new_series}</Text></View> : null}{request.reason ? <View style={styles.reason}><Text style={styles.reasonLabel}>Justification de l’élève</Text><Text style={styles.reasonText}>{request.reason}</Text></View> : null}{request.review_note ? <View style={styles.reviewNote}><Text style={styles.reviewNoteLabel}>Note administrative</Text><Text style={styles.reviewNoteText}>{request.review_note}</Text></View> : null}{pending ? <View style={styles.actions}>{busy ? <ActivityIndicator color={colors.primary} /> : <><Pressable accessibilityRole="button" onPress={onReject} style={({ pressed }) => [styles.reject, pressed && styles.pressed]}><Text style={styles.rejectText}>Refuser</Text></Pressable><Pressable accessibilityRole="button" onPress={onAccept} style={({ pressed }) => [styles.accept, pressed && styles.pressed]}><MaterialIcons name="check" size={18} color={colors.surface} /><Text style={styles.acceptText}>Approuver</Text></Pressable></>}</View> : null}</View>;
}

const createStyles = (colors: ReturnType<typeof useEduTheme>["colors"]) => StyleSheet.create({ list: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 30, gap: 12 }, header: { gap: 12, marginBottom: 2 }, loading: { minHeight: 220, justifyContent: "center", alignItems: "center", gap: 10 }, loadingText: { color: colors.muted, fontSize: 13, fontWeight: "700" }, error: { padding: 12, borderRadius: 14, backgroundColor: colors.surfaceMuted, gap: 7 }, errorText: { color: colors.error, fontSize: 13, lineHeight: 18, fontWeight: "700" }, retryText: { color: colors.error, fontSize: 13, fontWeight: "900" }, card: { gap: 9, padding: 14, borderRadius: 18, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }, cardTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 }, typeBadge: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 9, paddingVertical: 6, borderRadius: 10, backgroundColor: colors.primarySoft }, typeBadgeText: { color: colors.primary, fontSize: 11, fontWeight: "900" }, statusBadge: { paddingHorizontal: 9, paddingVertical: 6, borderRadius: 10 }, statusText: { fontSize: 11, fontWeight: "900" }, student: { color: colors.text, fontSize: 13, lineHeight: 18, fontWeight: "800" }, date: { color: colors.muted, fontSize: 11, lineHeight: 16 }, changeRow: { flexDirection: "row", gap: 8, alignItems: "flex-start" }, changeText: { flex: 1, color: colors.text, fontSize: 12, lineHeight: 18, fontWeight: "600" }, reason: { padding: 11, borderRadius: 13, backgroundColor: colors.primarySoft, gap: 4 }, reasonLabel: { color: colors.primary, fontSize: 11, lineHeight: 15, fontWeight: "900" }, reasonText: { color: colors.text, fontSize: 12, lineHeight: 18 }, reviewNote: { padding: 11, borderRadius: 13, backgroundColor: colors.surfaceMuted, gap: 4 }, reviewNoteLabel: { color: colors.muted, fontSize: 11, lineHeight: 15, fontWeight: "900" }, reviewNoteText: { color: colors.text, fontSize: 12, lineHeight: 18 }, actions: { minHeight: 44, marginTop: 3, flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: 9 }, reject: { minHeight: 42, justifyContent: "center", alignItems: "center", paddingHorizontal: 14, borderRadius: 13, borderWidth: 1, borderColor: colors.error }, rejectText: { color: colors.error, fontSize: 13, fontWeight: "900" }, accept: { minHeight: 42, flexDirection: "row", gap: 6, justifyContent: "center", alignItems: "center", paddingHorizontal: 14, borderRadius: 13, backgroundColor: colors.primary }, acceptText: { color: colors.surface, fontSize: 13, fontWeight: "900" }, pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] } });
