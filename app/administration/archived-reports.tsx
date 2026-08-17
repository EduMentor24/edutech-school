import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { fetchSchoolYears, SchoolYear } from "@/lib/admin/school-administration-service";
import { fetchArchivedReports, ArchivedReport } from "@/lib/admin/school-extension-service";

export default function ArchivedReportsScreen() {
  const [years, setYears] = useState<SchoolYear[]>([]);
  const [selectedYearId, setSelectedYearId] = useState<string>("");
  const [reports, setReports] = useState<ArchivedReport[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const yList = await fetchSchoolYears();
      setYears(yList);
      const archived = yList.find((y: SchoolYear) => y.status === "archived") || yList[0];
      if (archived) setSelectedYearId((current) => current || archived.id);
    } catch (e: any) {
      Alert.alert("Erreur", e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadData(); }, [loadData]);

  useEffect(() => {
    if (!selectedYearId) return;
    void fetchArchivedReports(selectedYearId).then(setReports).catch(() => setReports([]));
  }, [selectedYearId]);

  return (
    <ScreenContainer className="p-4 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="text-2xl font-bold text-foreground mb-4">Rapports de fin d’année (Élèves archivés)</Text>
        <Text className="text-sm text-muted mb-4">Consultez les bilans annuels et historiques des élèves pour les années clôturées et archivées.</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0a7ea4" className="my-8" />
        ) : (
          <View className="gap-4">
            <View className="flex-row gap-2 flex-wrap mb-2">
              {years.map((y: SchoolYear) => (
                <TouchableOpacity key={y.id} onPress={() => setSelectedYearId(y.id)} className={`px-4 py-2 rounded-xl border ${selectedYearId === y.id ? "bg-primary border-primary" : "bg-surface border-border"}`}>
                  <Text className={`font-semibold ${selectedYearId === y.id ? "text-background" : "text-foreground"}`}>{y.name} ({y.status})</Text>
                </TouchableOpacity>
              ))}
            </View>

            {reports.length === 0 ? (
              <View className="p-6 bg-surface rounded-xl border border-border items-center">
                <Text className="text-muted text-sm">Aucun rapport de fin d’année archivé pour cette année.</Text>
              </View>
            ) : (
              reports.map(r => (
                <View key={r.id} className="bg-surface border border-border rounded-xl p-4 gap-2">
                  <Text className="text-base font-bold text-foreground">Élève ID : {r.student_id}</Text>
                  <Text className="text-xs text-muted">Classe : {r.school_level} {r.series} {r.lv2_choice ? `• LV2: ${r.lv2_choice}` : ""}</Text>
                  <View className="flex-row justify-between bg-background p-2 rounded-lg border border-border">
                    <Text className="text-xs text-muted">T1: {r.term1_average ?? "-"}</Text>
                    <Text className="text-xs text-muted">T2: {r.term2_average ?? "-"}</Text>
                    <Text className="text-xs text-muted">T3: {r.term3_average ?? "-"}</Text>
                    <Text className="text-xs font-bold text-foreground">Annuel: {r.annual_average ?? "-"}</Text>
                  </View>
                  <Text className="text-xs font-semibold text-primary">Décision finale : {r.final_decision || "Non prononcée"}</Text>
                  <Text className="text-xs text-muted">{r.report_summary}</Text>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
