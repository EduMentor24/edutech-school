import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { AppScreen } from "@/components/edutech/app-screen";
import { EmptyState } from "@/components/edutech/empty-state";
import { PageHeader } from "@/components/edutech/page-header";
import { useSupabaseAuth } from "@/lib/auth/supabase-auth-provider";
import { useEduTheme } from "@/lib/edutech/theme-context";
import { getDictionaryEntries, dictionaryCacheContextFromProfile } from "@/lib/dictionary/dictionary-service";
import { searchDictionary, type DictionaryEntry } from "@/lib/dictionary/dictionary-model";

export default function DictionaryScreen() {
  const { colors } = useEduTheme();
  const { profile } = useSupabaseAuth();
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const context = useMemo(() => dictionaryCacheContextFromProfile(profile), [profile]);
  const results = useMemo(() => searchDictionary(entries, query), [entries, query]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    void getDictionaryEntries(context).then((nextEntries) => {
      if (!cancelled) setEntries(nextEntries);
    }).finally(() => {
      if (!cancelled) setIsLoading(false);
    });
    return () => { cancelled = true; };
  }, [context]);

  return (
    <AppScreen withPadding={false}>
      <View style={styles.container}>
        <PageHeader title="Dictionnaire" subtitle="Comprenez les mots importants de vos matières." back />
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={22} color={colors.muted} />
          <TextInput accessibilityLabel="Rechercher un terme" value={query} onChangeText={setQuery} placeholder="Rechercher un mot ou une notion…" placeholderTextColor={colors.muted} returnKeyType="search" style={styles.input} />
          {query ? <Pressable accessibilityRole="button" accessibilityLabel="Effacer la recherche" onPress={() => setQuery("")} style={({ pressed }) => [styles.clear, pressed && styles.pressed]}><MaterialIcons name="close" size={19} color={colors.muted} /></Pressable> : null}
        </View>
        <View style={styles.helperRow}><MaterialIcons name="offline-pin" size={17} color={colors.primary} /><Text style={styles.helper}>Recherche instantanée et fiches disponibles hors connexion lorsqu’elles sont installées.</Text></View>
        {isLoading ? <View style={styles.loading}><ActivityIndicator color={colors.primary} /><Text style={styles.loadingText}>Chargement du dictionnaire…</Text></View> : results.length === 0 ? <EmptyState icon="menu-book" title={query ? "Aucun terme trouvé" : "Dictionnaire en préparation"} description={query ? "Essayez un autre mot ou vérifiez son orthographe." : "Le modèle est prêt. Les fiches seront ajoutées dans une prochaine étape éditoriale."} /> : <FlatList data={results} keyExtractor={(item) => item.id} showsVerticalScrollIndicator={false} contentContainerStyle={styles.list} renderItem={({ item }) => <DictionaryCard entry={item} expanded={expandedId === item.id} onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)} colors={colors} styles={styles} />} />}
      </View>
    </AppScreen>
  );
}

function DictionaryCard({ entry, expanded, onToggle, colors, styles }: { entry: DictionaryEntry; expanded: boolean; onToggle: () => void; colors: ReturnType<typeof useEduTheme>["colors"]; styles: ReturnType<typeof createStyles> }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={`${entry.term}, afficher les détails`} onPress={onToggle} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
    <View style={styles.cardHeading}><Text style={styles.term}>{entry.term}</Text>{entry.subject ? <Text style={styles.subject}>{entry.subject}</Text> : null}</View>
    {entry.grammaticalNature ? <Text style={styles.nature}>{entry.grammaticalNature}</Text> : null}
    <Text style={styles.definition}>{entry.generalDefinition}</Text>
    {entry.generalExample ? <Text style={styles.example}>Exemple : {entry.generalExample}</Text> : null}
    {expanded ? <View style={styles.details}>
      {entry.etymology ? <DetailBlock label="Étymologie" text={entry.etymology} styles={styles} /> : null}
      {entry.philosophicalSense ? <DetailBlock label="Sens philosophique" text={entry.philosophicalSense.definition} example={entry.philosophicalSense.example} styles={styles} /> : null}
      {(entry.specializedSenses ?? []).map((sense) => <DetailBlock key={sense.domain} label={`Sens ${sense.domain}`} text={sense.definition} example={sense.example} styles={styles} />)}
      <RelationRow label="Synonymes" values={entry.synonyms} styles={styles} />
      <RelationRow label="Antonymes" values={entry.antonyms} styles={styles} />
      <RelationRow label="Même famille" values={entry.wordFamily} styles={styles} />
      <RelationRow label="Expressions" values={entry.expressions} styles={styles} />
      {entry.translations?.length ? <View style={styles.detailBlock}><Text style={styles.detailLabel}>Traductions</Text>{entry.translations.map((translation) => <Text key={translation.language} style={styles.detailText}>{translation.language.toUpperCase()} : {translation.value}</Text>)}</View> : null}
      {entry.associatedCourses?.length ? <View style={styles.detailBlock}><Text style={styles.detailLabel}>Cours associés</Text>{entry.associatedCourses.map((course) => <Text key={course.id} style={styles.detailText}>{course.title}{course.subject ? ` · ${course.subject}` : ""}</Text>)}</View> : null}
    </View> : null}
    <View style={styles.expandHint}><Text style={styles.expandText}>{expanded ? "Réduire la fiche" : "Afficher les détails"}</Text><MaterialIcons name={expanded ? "expand-less" : "expand-more"} size={20} color={colors.primary} /></View>
  </Pressable>;
}

function DetailBlock({ label, text, example, styles }: { label: string; text: string; example?: string; styles: ReturnType<typeof createStyles> }) {
  return <View style={styles.detailBlock}><Text style={styles.detailLabel}>{label}</Text><Text style={styles.detailText}>{text}</Text>{example ? <Text style={styles.detailExample}>Exemple : {example}</Text> : null}</View>;
}

function RelationRow({ label, values, styles }: { label: string; values?: string[]; styles: ReturnType<typeof createStyles> }) {
  return values?.length ? <View style={styles.detailBlock}><Text style={styles.detailLabel}>{label}</Text><Text style={styles.detailText}>{values.join(" · ")}</Text></View> : null;
}

const createStyles = (colors: ReturnType<typeof useEduTheme>["colors"]) => StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  searchBox: { minHeight: 54, flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 14, borderWidth: 1, borderColor: colors.border, borderRadius: 16, backgroundColor: colors.surface },
  input: { flex: 1, color: colors.text, fontSize: 15, lineHeight: 20, paddingVertical: 10 },
  clear: { width: 30, height: 30, alignItems: "center", justifyContent: "center" },
  pressed: { opacity: 0.7, transform: [{ scale: 0.98 }] },
  helperRow: { flexDirection: "row", alignItems: "center", gap: 7, marginTop: 11, marginBottom: 18 },
  helper: { flex: 1, color: colors.muted, fontSize: 12, lineHeight: 17 },
  loading: { flex: 1, alignItems: "center", justifyContent: "center", gap: 11 },
  loadingText: { color: colors.muted, fontSize: 14, fontWeight: "700" },
  list: { paddingBottom: 28, gap: 12 },
  card: { borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 16 },
  cardHeading: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", gap: 10 },
  term: { flex: 1, color: colors.text, fontSize: 20, lineHeight: 25, fontWeight: "800" },
  subject: { color: colors.primary, fontSize: 11, lineHeight: 16, fontWeight: "800" },
  nature: { color: colors.primary, fontSize: 12, lineHeight: 17, fontStyle: "italic", marginTop: 3 },
  definition: { color: colors.text, fontSize: 14, lineHeight: 21, marginTop: 9 },
  example: { color: colors.muted, fontSize: 13, lineHeight: 19, fontStyle: "italic", marginTop: 10 },
  details: { borderTopWidth: 1, borderTopColor: colors.border, marginTop: 14, paddingTop: 4 },
  detailBlock: { marginTop: 11, gap: 3 },
  detailLabel: { color: colors.primary, fontSize: 12, lineHeight: 17, fontWeight: "800" },
  detailText: { color: colors.text, fontSize: 13, lineHeight: 19 },
  detailExample: { color: colors.muted, fontSize: 12, lineHeight: 17, fontStyle: "italic" },
  expandHint: { flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: 3, marginTop: 13 },
  expandText: { color: colors.primary, fontSize: 12, lineHeight: 17, fontWeight: "800" },
});
