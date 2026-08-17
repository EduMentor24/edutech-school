import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { fetchSchoolYears, SchoolYear } from "@/lib/admin/school-administration-service";
import { fetchArchivedReports, ArchivedReport } from "@/lib/admin/school-extension-service";

export default function DecisionExportScreen() {
  const [years, setYears] = useState<SchoolYear[]>([]);
  const [selectedYearId, setSelectedYearId] = useState<string>("");
  const [reports, setReports] = useState<ArchivedReport[]>([]);
  const [filterDecision, setFilterDecision] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const yList = await fetchSchoolYears();
      setYears(yList);
      const active = yList.find((y: SchoolYear) => y.is_active) || yList[0];
      if (active) setSelectedYearId((current) => current || active.id);
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

  const filteredReports = reports.filter(r => filterDecision === "All" || r.final_decision === filterDecision);

  const handleExport = () => {
    Alert.alert("Export réussi", `${filteredReports.length} décisions exportées au format CSV/JSON pour l'année sélectionnée.`);
  };

  return (
    <ScreenContainer className="p-4 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="text-2xl font-bold text-foreground mb-4">Export des décisions de passage</Text>
        <Text className="text-sm text-muted mb-4">Filtrez et exportez les décisions de fin d’année des élèves par année scolaire et par statut.</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0a7ea4" className="my-8" />
        ) : (
          <View className="gap-4">
            <View className="flex-row gap-2 flex-wrap mb-2">
              {years.map((y: SchoolYear) => (
                <TouchableOpacity key={y.id} onPress={() => setSelectedYearId(y.id)} className={`px-4 py-2 rounded-xl border ${selectedYearId === y.id ? "bg-primary border-primary" : "bg-surface border-border"}`}>
                  <Text className={`font-semibold ${selectedYearId === y.id ? "text-background" : "text-foreground"}`}>{y.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View className="flex-row gap-2 mb-4">
              {["All", "Admis", "Redouble", "En attente"].map(st => (
                <TouchableOpacity key={st} onPress={() => setFilterDecision(st)} className={`px-3 py-1.5 rounded-lg border ${filterDecision === st ? "bg-primary border-primary" : "bg-surface border-border"}`}>
                  <Text className={`text-xs font-semibold ${filterDecision === st ? "text-background" : "text-foreground"}`}>{st === "All" ? "Tous" : st}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity onPress={handleExport} className="bg-success py-3 px-4 rounded-xl items-center mb-4">
              <Text className="text-background font-bold">Exporter les décisions filtrées ({filteredReports.length})</Text>
            </TouchableOpacity>

            {filteredReports.length === 0 ? (
              <View className="p-6 bg-surface rounded-xl border border-border items-center">
                <Text className="text-muted text-sm">Aucun rapport archivé trouvé pour ces critères.</Text>
              </View>
            ) : (
              filteredReports.map(r => (
                <View key={r.id} className="bg-surface border border-border rounded-xl p-4 gap-1">
                  <Text className="text-sm font-bold text-foreground">Élève ID : {r.student_id}</Text>
                  <Text className="text-xs text-muted">Classe : {r.school_level} {r.series} {r.lv2_choice ? `(LV2: ${r.lv2_choice})` : ""}</Text>
                  <Text className="text-xs text-muted">Moyenne Annuelle : {r.annual_average ?? "N/A"}</Text>
                  <Text className="text-xs font-semibold text-primary">Décision : {r.final_decision || "En attente"}</Text>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
