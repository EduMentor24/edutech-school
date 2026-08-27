import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

import { AppScreen } from "@/components/edutech/app-screen";
import { PageHeader } from "@/components/edutech/page-header";
import { SettingsRow } from "@/components/edutech/settings-row";
import { useSupabaseAuth } from "@/lib/auth/supabase-auth-provider";
import { useEduTheme } from "@/lib/edutech/theme-context";
import {
  disableSchoolReminders,
  enableSchoolReminders,
  formatSchoolReminderTime,
  getSchoolReminderPermission,
  getSchoolReminderSettings,
  setSchoolReminderTime,
} from "@/lib/notifications/school-reminder-service";

export default function SettingsScreen() {
  const router = useRouter();
  const { colors, mode, setMode } = useEduTheme();
  const { signOut } = useSupabaseAuth();
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [reminderHour, setReminderHour] = useState(18);
  const [reminderMinute, setReminderMinute] = useState(0);
  const [remindersLoading, setRemindersLoading] = useState(true);
  const [remindersSaving, setRemindersSaving] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<
    "granted" | "denied" | "unavailable"
  >("unavailable");
  const [timeEditorVisible, setTimeEditorVisible] = useState(false);
  const [timeDraft, setTimeDraft] = useState("18:00");
  const styles = useMemo(() => createStyles(colors), [colors]);
  const explain = (title: string, message: string) =>
    Alert.alert(title, message, [{ text: "Compris" }]);

  useEffect(() => {
    void Promise.all([getSchoolReminderSettings(), getSchoolReminderPermission()])
      .then(([settings, permission]) => {
        setRemindersEnabled(settings.enabled);
        setReminderHour(settings.hour);
        setReminderMinute(settings.minute);
        setNotificationPermission(permission);
      })
      .finally(() => setRemindersLoading(false));
  }, []);

  const applySettings = (settings: {
    enabled: boolean;
    hour: number;
    minute: number;
  }) => {
    setRemindersEnabled(settings.enabled);
    setReminderHour(settings.hour);
    setReminderMinute(settings.minute);
  };

  const toggleReminders = async () => {
    if (remindersLoading || remindersSaving) return;
    setRemindersSaving(true);
    try {
      applySettings(
        remindersEnabled
          ? await disableSchoolReminders()
          : await enableSchoolReminders(),
      );
      setNotificationPermission(await getSchoolReminderPermission());
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

  const openTimeEditor = () => {
    if (remindersLoading || remindersSaving) return;
    setTimeDraft(formatSchoolReminderTime(reminderHour, reminderMinute));
    setTimeEditorVisible(true);
  };

  const saveReminderTime = async () => {
    const match = /^(?:[01]\d|2[0-3]):[0-5]\d$/.exec(timeDraft.trim());
    if (!match) {
      Alert.alert(
        "Heure invalide",
        "Saisissez l’heure au format HH:MM, par exemple 07:30.",
      );
      return;
    }
    setRemindersSaving(true);
    try {
      applySettings(
        await setSchoolReminderTime(
          Number(match[0].slice(0, 2)),
          Number(match[0].slice(3, 5)),
        ),
      );
      setTimeEditorVisible(false);
    } catch (cause) {
      Alert.alert(
        "Heure non enregistrée",
        cause instanceof Error
          ? cause.message
          : "Le rappel ne peut pas être reprogrammé pour le moment.",
      );
    } finally {
      setRemindersSaving(false);
    }
  };

  const scheduledTime = formatSchoolReminderTime(reminderHour, reminderMinute);
  const reminderSubtitle = remindersLoading
    ? "Vérification de vos rappels scolaires…"
    : remindersSaving
      ? "Mise à jour de vos rappels scolaires…"
      : remindersEnabled
        ? `Rappel quotidien activé à ${scheduledTime}`
        : "Activez un rappel quotidien pour reprendre vos apprentissages";
  const notificationSettingsSubtitle =
    notificationPermission === "granted"
      ? "Gérez les alertes et le canal Rappels scolaires"
      : "Autorisez les notifications dans Android pour recevoir les rappels";

  const openNotificationSettings = async () => {
    try {
      await Linking.openSettings();
    } catch {
      Alert.alert(
        "Réglages Android indisponibles",
        "Ouvrez les paramètres Android de l’application EduTech School, puis Notifications.",
      );
    }
  };

  return (
    <AppScreen withPadding={false} edges={["top", "bottom", "left", "right"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
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
              icon="schedule"
              title="Heure du rappel"
              subtitle={`Tous les jours à ${scheduledTime}`}
              onPress={openTimeEditor}
              accessory={<MaterialIcons name="chevron-right" size={22} color={colors.muted} />}
            />
            {Platform.OS === "android" ? (
              <SettingsRow
                icon="settings"
                title="Gérer les notifications Android"
                subtitle={notificationSettingsSubtitle}
                onPress={() => void openNotificationSettings()}
                accessory={<MaterialIcons name="open-in-new" size={20} color={colors.muted} />}
              />
            ) : null}
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
      <Modal
        transparent
        visible={timeEditorVisible}
        animationType="fade"
        onRequestClose={() => setTimeEditorVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Heure du rappel</Text>
            <Text style={styles.modalBody}>
              Choisissez l’heure exacte de votre rappel quotidien, au format HH:MM.
            </Text>
            <TextInput
              value={timeDraft}
              onChangeText={setTimeDraft}
              keyboardType="numbers-and-punctuation"
              maxLength={5}
              placeholder="18:00"
              placeholderTextColor={colors.muted}
              selectTextOnFocus
              style={styles.timeInput}
              accessibilityLabel="Heure du rappel au format HH:MM"
            />
            <View style={styles.modalActions}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setTimeEditorVisible(false)}
                style={({ pressed }) => [styles.cancelButton, pressed && styles.pressed]}
              >
                <Text style={styles.cancelLabel}>Annuler</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                disabled={remindersSaving}
                onPress={() => void saveReminderTime()}
                style={({ pressed }) => [
                  styles.saveButton,
                  remindersSaving && styles.disabled,
                  pressed && !remindersSaving && styles.pressed,
                ]}
              >
                <Text style={styles.saveLabel}>
                  {remindersSaving ? "Enregistrement…" : "Enregistrer"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
    modalBackdrop: {
      flex: 1,
      justifyContent: "center",
      padding: 24,
      backgroundColor: "rgba(15, 23, 42, 0.48)",
    },
    modalCard: {
      gap: 12,
      padding: 20,
      borderRadius: 22,
      backgroundColor: colors.surface,
    },
    modalTitle: { color: colors.text, fontSize: 19, lineHeight: 25, fontWeight: "900" },
    modalBody: { color: colors.muted, fontSize: 13, lineHeight: 19 },
    timeInput: {
      minHeight: 50,
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: 13,
      color: colors.text,
      backgroundColor: colors.background,
      fontSize: 18,
      fontWeight: "800",
      textAlign: "center",
      letterSpacing: 1,
    },
    modalActions: { flexDirection: "row", gap: 10, marginTop: 4 },
    cancelButton: { flex: 1, minHeight: 45, justifyContent: "center", alignItems: "center", borderRadius: 13, borderWidth: 1, borderColor: colors.border },
    saveButton: { flex: 1, minHeight: 45, justifyContent: "center", alignItems: "center", borderRadius: 13, backgroundColor: colors.primary },
    cancelLabel: { color: colors.text, fontSize: 13, fontWeight: "800" },
    saveLabel: { color: colors.surface, fontSize: 13, fontWeight: "900" },
    disabled: { opacity: 0.55 },
    pressed: { opacity: 0.72 },
  });
