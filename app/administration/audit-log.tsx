import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, Alert, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { supabase } from "@/lib/supabase/client";

export default function AuditLogScreen() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("edutech_activity_logs").select("id,actor_id,action,resource_type,resource_id,created_at").order("created_at", { ascending: false }).limit(50);
      if (error) throw error;
      setLogs(data || []);
    } catch (e: any) {
      Alert.alert("Erreur", e.message || "Impossible de charger le journal d’audit");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadLogs(); }, []);

  return (
    <ScreenContainer className="p-4 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="text-2xl font-bold text-foreground mb-4">Journal d’audit</Text>
        <Text className="text-sm text-muted mb-4">Historique de traçabilité des actions administratives.</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0a7ea4" className="my-8" />
        ) : logs.length === 0 ? (
          <View className="p-6 bg-surface rounded-xl border border-border items-center">
            <Text className="text-muted text-sm">Aucun événement enregistré dans le journal d’audit.</Text>
          </View>
        ) : (
          <View className="gap-3">
            {logs.map(l => (
              <View key={l.id} className="bg-surface border border-border rounded-xl p-4 gap-1">
                <Text className="text-sm font-bold text-foreground">{l.action}</Text>
                <Text className="text-xs text-muted">Par : {l.actor_id || "Système"}</Text>
                <Text className="text-xs text-muted">Date : {new Date(l.created_at).toLocaleString()}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
