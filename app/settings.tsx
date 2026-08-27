import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from "react-native";

import { AppScreen } from "@/components/edutech/app-screen";
import { PageHeader } from "@/components/edutech/page-header";
import { SettingsRow } from "@/components/edutech/settings-row";
import { useSupabaseAuth } from "@/lib/auth/supabase-auth-provider";
import { useEduTheme } from "@/lib/edutech/theme-context";
import {
  disableSchoolReminders,
  enableSchoolReminders,
  getSchoolReminderSettings,
} from "@/lib/notifications/school-reminder-service";

export default function SettingsScreen() {
  const router = useRouter();
  const { colors, mode, setMode } = useEduTheme();
  const { signOut } = useSupabaseAuth();
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [remindersLoading, setRemindersLoading] = useState(true);
  const [remindersSaving, setRemindersSaving] = useState(false);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const explain = (title: string, message: string) =>
    Alert.alert(title, message, [{ text: "Compris" }]);

  useEffect(() => {
    void getSchoolReminderSettings()
      .then((settings) => setRemindersEnabled(settings.enabled))
      .finally(() => setRemindersLoading(false));
  }, []);

  const toggleReminders = async () => {
    if (remindersLoading || remindersSaving) return;
    setRemindersSaving(true);
    try {
      const settings = remindersEnabled
        ? await disableSchoolReminders()
        : await enableSchoolReminders();
      setRemindersEnabled(settings.enabled);
    } catch (cause) {
      Alert.alert(
        "Notifications non activées",
        cause instanceof Error
          ? cause.message
          : "Les rappels scolaires ne peuvent pas être activés pour le moment.",
      );
    } finally {
      setRemindersSaving(false);
    }
  };

  const reminderSubtitle = remindersLoading
    ? "Vérification de vos rappels scolaires…"
    : remindersSaving
      ? "Mise à jour de vos rappels scolaires…"
      : remindersEnabled
        ? "Rappel quotidien activé à 18 h"
        : "Activez un rappel quotidien pour reprendre vos apprentissages";

  return (
    <AppScreen withPadding={false} edges={["top", "bottom", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.content}>
          <PageHeader
            title="Paramètres"
            subtitle="Personnalisez votre expérience EduTech School."
            back
          />
          <Text style={styles.section}>Préférences</Text>
          <View style={styles.group}>
            <SettingsRow
              icon={mode === "dark" ? "dark-mode" : "light-mode"}
              title="Thème sombre"
              subtitle="Préférence enregistrée sur cet appareil"
              onPress={() => void setMode(mode === "dark" ? "light" : "dark")}
              accessory={
                <Switch
                  value={mode === "dark"}
                  onValueChange={(value) => void setMode(value ? "dark" : "light")}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.surface}
                />
              }
            />
            <SettingsRow
              icon={remindersEnabled ? "notifications-active" : "notifications-none"}
              title="Notifications"
              subtitle={reminderSubtitle}
              onPress={() => void toggleReminders()}
              accessory={
                <View pointerEvents="none">
                  <Switch
                    value={remindersEnabled}
                    disabled={remindersLoading || remindersSaving}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor={colors.surface}
                  />
                </View>
              }
            />
            <SettingsRow
              icon="language"
              title="Langue"
              subtitle="Français"
              onPress={() =>
                explain(
                  "Langue",
                  "Le français est la langue de départ. La sélection de langues sera ajoutée ultérieurement.",
                )
              }
            />
          </View>
          <Text style={styles.section}>Informations</Text>
          <View style={styles.group}>
            <SettingsRow icon="privacy-tip" title="Confidentialité" onPress={() => router.push("/privacy")} />
            <SettingsRow icon="gavel" title="Conditions d’utilisation" onPress={() => router.push("/terms")} />
            <SettingsRow icon="info-outline" title="À propos" onPress={() => router.push("/about")} />
          </View>
          <Text style={styles.section}>Session</Text>
          <View style={styles.group}>
            <SettingsRow
              icon="logout"
              title="Déconnexion"
              subtitle="Ferme votre session Supabase sur cet appareil"
              danger
              onPress={() => void signOut()}
            />
          </View>
        </View>
      </ScrollView>
    </AppScreen>
  );
}

const createStyles = (colors: ReturnType<typeof useEduTheme>["colors"]) =>
  StyleSheet.create({
    scroll: { paddingBottom: 26 },
    content: { paddingHorizontal: 20, paddingTop: 20 },
    section: {
      color: colors.text,
      fontSize: 16,
      lineHeight: 21,
      fontWeight: "800",
      marginBottom: 9,
      marginTop: 21,
    },
    group: {
      overflow: "hidden",
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
    },
  });
