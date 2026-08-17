import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, Alert, ActivityIndicator, TextInput } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { supabase } from "@/lib/supabase/client";

export default function UsersManagementScreen() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("profiles").select("*").order("full_name", { ascending: true }).limit(50);
      if (error) throw error;
      setUsers(data || []);
    } catch (e: any) {
      Alert.alert("Erreur", e.message || "Impossible de charger les utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadUsers(); }, []);

  const filtered = users.filter(u => u.full_name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <ScreenContainer className="p-4 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="text-2xl font-bold text-foreground mb-4">Gestion des utilisateurs</Text>
        <TextInput
          placeholder="Rechercher par nom ou email..."
          value={search}
          onChangeText={setSearch}
          className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground mb-4"
        />

        {loading ? (
          <ActivityIndicator size="large" color="#0a7ea4" className="my-8" />
        ) : (
          <View className="gap-3">
            {filtered.map(u => (
              <View key={u.id} className="bg-surface border border-border rounded-xl p-4 gap-1">
                <Text className="text-base font-bold text-foreground">{u.full_name || "Nom non renseigné"}</Text>
                <Text className="text-xs text-muted">{u.email}</Text>
                <Text className="text-xs text-muted">Niveau: {u.school_level || "—"} | Série: {u.series || "—"} | Rôle: {u.role || "Élève"}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
