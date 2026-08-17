import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, Alert, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { supabase } from "@/lib/supabase/client";

export default function ClassRequestsScreen() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("class_change_requests").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      setRequests(data || []);
    } catch (e: any) {
      Alert.alert("Erreur", e.message || "Impossible de charger les demandes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadRequests(); }, []);

  return (
    <ScreenContainer className="p-4 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="text-2xl font-bold text-foreground mb-4">Demandes de classe</Text>
        <Text className="text-sm text-muted mb-4">Validation des demandes de changement de niveau et de série.</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0a7ea4" className="my-8" />
        ) : requests.length === 0 ? (
          <View className="p-6 bg-surface rounded-xl border border-border items-center">
            <Text className="text-muted text-sm">Aucune demande de changement de classe enregistrée.</Text>
          </View>
        ) : (
          <View className="gap-3">
            {requests.map(r => (
              <View key={r.id} className="bg-surface border border-border rounded-xl p-4 gap-1">
                <Text className="text-sm font-bold text-foreground">Élève ID : {r.student_id}</Text>
                <Text className="text-xs text-muted">Demandé : {r.target_school_level} {r.target_series}</Text>
                <Text className="text-xs font-semibold text-primary">Statut : {r.status}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
