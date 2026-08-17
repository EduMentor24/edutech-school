import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, Alert, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { fetchSchoolYears, SchoolYear } from "@/lib/admin/school-administration-service";

export default function SchoolYearsScreen() {
  const [years, setYears] = useState<SchoolYear[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchSchoolYears();
      setYears(data);
    } catch (e: any) {
      Alert.alert("Erreur", e.message || "Impossible de charger les années scolaires");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadData(); }, []);

  return (
    <ScreenContainer className="p-4 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="text-2xl font-bold text-foreground mb-4">Années scolaires</Text>
        <Text className="text-sm text-muted mb-4">Gestion, activation, clôture et archivage des années scolaires.</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0a7ea4" className="my-8" />
        ) : (
          <View className="gap-4">
            {years.map(y => (
              <View key={y.id} className="bg-surface border border-border rounded-xl p-4 gap-2">
                <View className="flex-row justify-between items-center">
                  <Text className="text-lg font-bold text-foreground">{y.name}</Text>
                  <Text className={`text-xs font-semibold px-2.5 py-1 rounded-full ${y.is_active ? "bg-success/20 text-success" : "bg-muted/20 text-muted"}`}>
                    {y.is_active ? "Active" : y.status}
                  </Text>
                </View>
                <Text className="text-xs text-muted">Du {y.start_date ?? "date non renseignée"} au {y.end_date ?? "date non renseignée"}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
