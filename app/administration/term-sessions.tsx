import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { fetchSchoolYears, SchoolYear } from "@/lib/admin/school-administration-service";
import { fetchTermSessions, upsertTermSession, TermSession } from "@/lib/admin/school-extension-service";

export default function TermSessionsScreen() {
  const [years, setYears] = useState<SchoolYear[]>([]);
  const [selectedYearId, setSelectedYearId] = useState<string>("");
  const [sessions, setSessions] = useState<TermSession[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const yList = await fetchSchoolYears();
      setYears(yList);
      const active = yList.find((y: SchoolYear) => y.is_active) || yList[0];
      if (active) setSelectedYearId((current) => current || active.id);
    } catch (e: any) {
      Alert.alert("Erreur", e.message || "Impossible de charger les années");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadData(); }, [loadData]);

  useEffect(() => {
    if (!selectedYearId) return;
    void fetchTermSessions(selectedYearId).then(setSessions).catch(() => setSessions([]));
  }, [selectedYearId]);

  const handleToggleSession = async (session: TermSession) => {
    try {
      await upsertTermSession({ ...session, is_open: !session.is_open });
      Alert.alert("Succès", "Statut de la session mis à jour.");
      const updated = await fetchTermSessions(selectedYearId);
      setSessions(updated);
    } catch (e: any) {
      Alert.alert("Erreur", e.message);
    }
  };

  return (
    <ScreenContainer className="p-4 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="text-2xl font-bold text-foreground mb-4">Sessions d’évaluation trimestrielle</Text>
        <Text className="text-sm text-muted mb-4">Configurez les périodes d’évaluation (Trimestres 1, 2 et 3) pour l’année scolaire sélectionnée.</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0a7ea4" className="my-8" />
        ) : (
          <View className="gap-4">
            <View className="flex-row gap-2 flex-wrap mb-2">
              {years.map((y: SchoolYear) => (
                <TouchableOpacity key={y.id} onPress={() => setSelectedYearId(y.id)} className={`px-4 py-2 rounded-xl border ${selectedYearId === y.id ? "bg-primary border-primary" : "bg-surface border-border"}`}>
                  <Text className={`font-semibold ${selectedYearId === y.id ? "text-background" : "text-foreground"}`}>{y.name} {y.is_active ? "(Active)" : ""}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {[1, 2, 3].map(termNum => {
              const existing = sessions.find(s => s.term_number === termNum);
              return (
                <View key={termNum} className="bg-surface border border-border rounded-xl p-4 gap-2">
                  <Text className="text-lg font-bold text-foreground">Trimestre {termNum}</Text>
                  <Text className="text-sm text-muted">{existing ? existing.title : `Trimestre ${termNum} - Année scolaire`}</Text>
                  <Text className="text-xs text-muted">Statut : {existing?.is_open !== false ? "Ouvert aux notes" : "Clôturé"}</Text>
                  <TouchableOpacity
                    onPress={() => handleToggleSession(existing || { id: "", school_year_id: selectedYearId, term_number: termNum, title: `Trimestre ${termNum}`, start_date: null, end_date: null, is_open: true })}
                    className="bg-primary py-2 px-4 rounded-lg self-start mt-2"
                  >
                    <Text className="text-background font-semibold">{existing?.is_open !== false ? "Clôturer le trimestre" : "Ouvrir le trimestre"}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
