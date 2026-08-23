import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { AppScreen } from "@/components/edutech/app-screen";
import { PageHeader } from "@/components/edutech/page-header";
import { PrimaryButton } from "@/components/edutech/primary-button";
import { useSupabaseAuth } from "@/lib/auth/supabase-auth-provider";
import { hasMeaningfulProfileChange, PROFILE_SCHOOL_LEVELS, PROFILE_SCHOOL_SERIES } from "@/lib/profile/profile-change-rules";
import { useEduTheme } from "@/lib/edutech/theme-context";

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

type PendingAvatar = { uri: string; mimeType?: string | null; fileSize?: number | null };

export default function EditProfileScreen() {
  const router = useRouter();
  const { colors } = useEduTheme();
  const {
    profile,
    isAdmin,
    profileChangeEligibility,
    isProfileLoading,
    refreshProfileChangeEligibility,
    updateProfile,
    uploadProfileAvatar,
  } = useSupabaseAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [schoolLevel, setSchoolLevel] = useState("");
  const [series, setSeries] = useState("");
  const [storedAvatarPath, setStoredAvatarPath] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [pendingAvatar, setPendingAvatar] = useState<PendingAvatar | null>(null);
  const [avatarChanged, setAvatarChanged] = useState(false);
  const [reason, setReason] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const styles = useMemo(() => createStyles(colors), [colors]);

  useEffect(() => {
    if (!profile) return;
    setFirstName(profile.first_name ?? "");
    setLastName(profile.last_name ?? "");
    setSchoolLevel(profile.school_level ?? "");
    setSeries(profile.series ?? "");
    setStoredAvatarPath(profile.avatar_url ?? null);
    setAvatarPreview(profile.avatar_display_url ?? profile.avatar_url ?? null);
    setPendingAvatar(null);
    setAvatarChanged(false);
    setReason("");
  }, [profile]);

  const requiresReason = !isAdmin && Boolean(profileChangeEligibility?.directChangeUsed);
  const hasPendingRequest = Boolean(profileChangeEligibility?.pendingRequestId);
  const statusReady = isAdmin || Boolean(profileChangeEligibility);

  const chooseAvatar = async () => {
    setNotice(null);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.76,
    });
    if (result.canceled || !("assets" in result)) return;
    const asset = result.assets[0];
    if ((asset.fileSize ?? 0) > MAX_AVATAR_BYTES) {
      setNotice("La photo sélectionnée dépasse la limite de 2 Mo.");
      return;
    }
    setPendingAvatar({ uri: asset.uri, mimeType: asset.mimeType, fileSize: asset.fileSize });
    setAvatarPreview(asset.uri);
    setAvatarChanged(true);
  };

  const removeAvatar = () => {
    setPendingAvatar(null);
    setAvatarPreview(null);
    setAvatarChanged(true);
  };

  const submit = async () => {
    if (!profile || isSubmitting) return;
    setNotice(null);
    if (!statusReady) {
      await refreshProfileChangeEligibility();
      setNotice("La règle annuelle est en cours de vérification. Réessayez dans un instant.");
      return;
    }
    if (hasPendingRequest) {
      setNotice("Une demande de modification est déjà en attente de validation administrative.");
      return;
    }
    if (requiresReason && reason.trim().length < 12) {
      setNotice("Expliquez votre demande en au moins 12 caractères avant de l’envoyer.");
      return;
    }

    const initialAvatarPath = storedAvatarPath;
    const localCandidate = {
      firstName,
      lastName,
      avatarPath: avatarChanged ? (pendingAvatar ? "__nouvelle_photo__" : null) : initialAvatarPath,
      schoolLevel,
      series,
    };
    const current = {
      firstName: profile.first_name,
      lastName: profile.last_name,
      avatarPath: profile.avatar_url,
      schoolLevel: profile.school_level,
      series: profile.series,
    };
    if (!hasMeaningfulProfileChange(current, localCandidate)) {
      setNotice("Aucune modification réelle n’a été détectée.");
      return;
    }

    setIsSubmitting(true);
    let avatarPath = avatarChanged ? null : initialAvatarPath;
    if (pendingAvatar) {
      const upload = await uploadProfileAvatar(pendingAvatar);
      if (upload.error || !upload.path) {
        setIsSubmitting(false);
        setNotice(upload.error ?? "L’envoi de la photo a échoué.");
        return;
      }
      avatarPath = upload.path;
    }

    const result = await updateProfile({
      firstName,
      lastName,
      avatarPath,
      schoolLevel,
      series,
      reason: requiresReason ? reason : undefined,
    });
    setIsSubmitting(false);
    if (result.error) {
      setNotice(result.error);
      return;
    }
    if (result.outcome === "requested") {
      setNotice("Votre demande motivée a été transmise à l’administration. Votre profil reste inchangé jusqu’à la décision.");
      setReason("");
      return;
    }

    setNotice(isAdmin ? "Profil administrateur enregistré." : "Votre modification annuelle a été enregistrée.");
    setTimeout(() => router.back(), 700);
  };

  const confirmDirectStudentChange = () => {
    if (isAdmin || requiresReason) {
      void submit();
      return;
    }
    Alert.alert(
      "Modification annuelle",
      `Cette modification sera votre unique modification directe pour l’année scolaire ${profileChangeEligibility?.activeSchoolYear ?? "active"}. Toute nouvelle modification devra être motivée puis validée par l’administration.`,
      [
        { text: "Annuler", style: "cancel" },
        { text: "Je confirme", onPress: () => void submit() },
      ],
    );
  };

  const ruleText = isAdmin
    ? "Administrateur : vos modifications de nom, photo, niveau et série sont enregistrées sans limite annuelle."
    : !profileChangeEligibility
      ? "Vérification de votre droit de modification annuelle…"
      : hasPendingRequest
        ? "Une demande est déjà en attente. Votre profil sera actualisé seulement après une validation administrative."
        : requiresReason
          ? `Votre modification directe pour ${profileChangeEligibility.activeSchoolYear} est utilisée. Une justification est maintenant obligatoire.`
          : `Vous disposez d’une seule modification directe de profil pour l’année ${profileChangeEligibility.activeSchoolYear}.`;

  const buttonLabel = hasPendingRequest
    ? "Demande en attente"
    : requiresReason
      ? "Envoyer la demande motivée"
      : isAdmin
        ? "Enregistrer les modifications"
        : "Enregistrer ma modification unique";

  return <AppScreen edges={["top", "bottom", "left", "right"]}><KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}><ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}><PageHeader title="Modifier mon profil" subtitle="Vos informations personnelles et scolaires." back /><View style={styles.form}><View style={styles.avatarSection}><View style={styles.avatar}>{avatarPreview ? <Image source={{ uri: avatarPreview }} style={styles.avatarImage} /> : <MaterialIcons name="person-outline" size={40} color={colors.primary} />}</View><View style={styles.avatarCopy}><Text style={styles.avatarTitle}>Photo de profil</Text><Text style={styles.avatarHint}>JPEG, PNG ou WebP · 2 Mo maximum.</Text><View style={styles.avatarActions}><Pressable accessibilityRole="button" onPress={() => void chooseAvatar()} style={({ pressed }) => [styles.photoButton, pressed && styles.pressed]}><MaterialIcons name="photo-library" size={18} color={colors.primary} /><Text style={styles.photoButtonText}>Choisir une photo</Text></Pressable>{avatarPreview ? <Pressable accessibilityRole="button" onPress={removeAvatar} style={({ pressed }) => [styles.removeButton, pressed && styles.pressed]}><Text style={styles.removeButtonText}>Retirer</Text></Pressable> : null}</View></View></View><View style={[styles.rule, requiresReason || hasPendingRequest ? styles.ruleWarning : styles.ruleInfo]}><MaterialIcons name={requiresReason || hasPendingRequest ? "pending-actions" : "info-outline"} size={19} color={requiresReason || hasPendingRequest ? colors.warning : colors.primary} /><Text style={[styles.ruleText, { color: requiresReason || hasPendingRequest ? colors.warning : colors.primary }]}>{ruleText}</Text></View><Field label="Prénom" value={firstName} onChange={setFirstName} colors={colors} /><Field label="Nom" value={lastName} onChange={setLastName} colors={colors} /><ChoiceField label="Niveau scolaire" values={PROFILE_SCHOOL_LEVELS} value={schoolLevel} onChange={setSchoolLevel} styles={styles} colors={colors} /><ChoiceField label="Série" values={PROFILE_SCHOOL_SERIES} value={series} onChange={setSeries} styles={styles} colors={colors} />{requiresReason ? <View><Text style={styles.label}>Justification *</Text><TextInput value={reason} onChangeText={setReason} placeholder="Expliquez clairement pourquoi votre profil doit être modifié à nouveau." placeholderTextColor={colors.muted} multiline maxLength={1000} editable={!hasPendingRequest && !isSubmitting} style={[styles.reasonInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]} /><Text style={styles.counter}>{reason.trim().length}/1000 caractères · minimum 12</Text></View> : null}{notice ? <View style={styles.notice}><Text style={styles.noticeText}>{notice}</Text></View> : null}<PrimaryButton label={buttonLabel} onPress={confirmDirectStudentChange} loading={isSubmitting || (!isAdmin && isProfileLoading)} disabled={hasPendingRequest || !statusReady} /></View></ScrollView></KeyboardAvoidingView></AppScreen>;
}

function Field({ label, value, onChange, colors }: { label: string; value: string; onChange: (value: string) => void; colors: ReturnType<typeof useEduTheme>["colors"] }) {
  return <View><Text style={[fieldStyles.label, { color: colors.text }]}>{label} *</Text><TextInput value={value} onChangeText={onChange} placeholder={label} placeholderTextColor={colors.muted} autoCapitalize="words" style={[fieldStyles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]} /></View>;
}

function ChoiceField({ label, values, value, onChange, styles, colors }: { label: string; values: readonly string[]; value: string; onChange: (value: string) => void; styles: ReturnType<typeof createStyles>; colors: ReturnType<typeof useEduTheme>["colors"] }) {
  return <View><Text style={styles.label}>{label} *</Text><View style={styles.choiceRow}>{values.map((item) => { const selected = item === value; return <Pressable key={item} accessibilityRole="button" accessibilityState={{ selected }} onPress={() => onChange(item)} style={({ pressed }) => [styles.choice, selected && { borderColor: colors.primary, backgroundColor: colors.primarySoft }, pressed && styles.pressed]}><Text style={[styles.choiceText, selected && { color: colors.primary }]}>{item}</Text></Pressable>; })}</View></View>;
}

const fieldStyles = StyleSheet.create({ label: { fontSize: 13, lineHeight: 18, fontWeight: "800", marginBottom: 6 }, input: { height: 52, borderWidth: 1, borderRadius: 15, paddingHorizontal: 14, fontSize: 15 } });
const createStyles = (colors: ReturnType<typeof useEduTheme>["colors"]) => StyleSheet.create({ flex: { flex: 1 }, scroll: { flexGrow: 1, paddingTop: 18, paddingBottom: 26 }, form: { gap: 14 }, avatarSection: { flexDirection: "row", gap: 13, alignItems: "center", padding: 14, borderRadius: 18, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }, avatar: { width: 78, height: 78, borderRadius: 39, overflow: "hidden", justifyContent: "center", alignItems: "center", backgroundColor: colors.primarySoft }, avatarImage: { width: "100%", height: "100%" }, avatarCopy: { flex: 1, gap: 3 }, avatarTitle: { color: colors.text, fontSize: 15, lineHeight: 20, fontWeight: "900" }, avatarHint: { color: colors.muted, fontSize: 12, lineHeight: 17 }, avatarActions: { marginTop: 6, flexDirection: "row", alignItems: "center", gap: 10, flexWrap: "wrap" }, photoButton: { minHeight: 35, paddingHorizontal: 10, flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 11, backgroundColor: colors.primarySoft }, photoButtonText: { color: colors.primary, fontSize: 12, fontWeight: "800" }, removeButton: { minHeight: 35, justifyContent: "center", paddingHorizontal: 6 }, removeButtonText: { color: colors.error, fontSize: 12, fontWeight: "800" }, rule: { flexDirection: "row", gap: 10, padding: 12, borderRadius: 14, borderWidth: 1 }, ruleInfo: { backgroundColor: colors.primarySoft, borderColor: colors.border }, ruleWarning: { backgroundColor: colors.warningSoft, borderColor: colors.warning }, ruleText: { flex: 1, fontSize: 12, lineHeight: 18, fontWeight: "700" }, label: { color: colors.text, fontSize: 13, lineHeight: 18, fontWeight: "800", marginBottom: 7 }, choiceRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 }, choice: { minWidth: 66, minHeight: 44, paddingHorizontal: 14, borderRadius: 13, borderWidth: 1, borderColor: colors.border, justifyContent: "center", alignItems: "center", backgroundColor: colors.surface }, choiceText: { color: colors.muted, fontSize: 13, fontWeight: "800" }, reasonInput: { minHeight: 110, borderWidth: 1, borderRadius: 15, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, lineHeight: 20, textAlignVertical: "top" }, counter: { marginTop: 5, color: colors.muted, fontSize: 11, lineHeight: 15, textAlign: "right" }, notice: { padding: 12, borderRadius: 13, backgroundColor: colors.primarySoft }, noticeText: { color: colors.primary, fontSize: 13, lineHeight: 19, fontWeight: "700" }, pressed: { opacity: 0.72 } });
