import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, Alert, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { supabase } from "@/lib/supabase/client";

export default function DecisionsScreen() {
  const [decisions, setDecisions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDecisions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("end_of_year_decisions").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      setDecisions(data || []);
    } catch (e: any) {
      Alert.alert("Erreur", e.message || "Impossible de charger les décisions de passage");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadDecisions(); }, []);

  return (
    <ScreenContainer className="p-4 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="text-2xl font-bold text-foreground mb-4">Décisions de passage</Text>
        <Text className="text-sm text-muted mb-4">Prononcé et suivi des décisions de fin d’année.</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0a7ea4" className="my-8" />
        ) : decisions.length === 0 ? (
          <View className="p-6 bg-surface rounded-xl border border-border items-center">
            <Text className="text-muted text-sm">Aucune décision de fin d’année enregistrée.</Text>
          </View>
        ) : (
          <View className="gap-3">
            {decisions.map(d => (
              <View key={d.id} className="bg-surface border border-border rounded-xl p-4 gap-1">
                <Text className="text-sm font-bold text-foreground">Élève ID : {d.student_id}</Text>
                <Text className="text-xs text-muted">Moyenne annuelle : {d.annual_average ?? "—"}</Text>
                <Text className="text-xs font-semibold text-primary">Décision : {d.decision}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
