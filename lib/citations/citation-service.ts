import { supabase } from "@/lib/supabase/client";
import { type Citation, type CitationInput, validateCitationInput } from "./citation-model";

type Relation<T> = T | T[] | null;
const one = <T,>(value: Relation<T>): T | null => Array.isArray(value) ? value[0] ?? null : value;
const message = (error: unknown) => error && typeof error === "object" && "message" in error && typeof error.message === "string" ? error.message : "Une erreur Supabase est survenue.";
const citationSelect = "id,subject_id,quote_text,author,source_title,source_reference,source_url,pedagogical_explanation,keywords,is_active,is_validated,created_at,updated_at,subject:subjects(name),citation_themes(theme)";

function citationFrom(row: any): Citation {
  const subject = one<{ name: string }>(row.subject);
  return { id: row.id, subjectId: row.subject_id, subjectName: subject?.name ?? "Matière indisponible", quoteText: row.quote_text, author: row.author, sourceTitle: row.source_title ?? null, sourceReference: row.source_reference ?? null, sourceUrl: row.source_url ?? null, pedagogicalExplanation: row.pedagogical_explanation ?? null, keywords: Array.isArray(row.keywords) ? row.keywords : [], themes: Array.isArray(row.citation_themes) ? row.citation_themes.map((theme: { theme: string }) => theme.theme).filter(Boolean) : [], isActive: Boolean(row.is_active), isValidated: Boolean(row.is_validated), createdAt: row.created_at, updatedAt: row.updated_at };
}

export async function getCitations(): Promise<Citation[]> {
  const { data, error } = await supabase.from("citations").select(citationSelect).order("created_at", { ascending: false });
  if (error) throw new Error(message(error));
  return (data ?? []).map(citationFrom);
}

export async function getCitation(citationId: string): Promise<Citation | null> {
  const { data, error } = await supabase.from("citations").select(citationSelect).eq("id", citationId).maybeSingle();
  if (error) throw new Error(message(error));
  return data ? citationFrom(data) : null;
}

export async function getFavoriteCitationIds(userId: string): Promise<Set<string>> {
  const { data, error } = await supabase.from("edutech_favorites").select("content_id").eq("user_id", userId).eq("content_type", "citation");
  if (error) throw new Error(message(error));
  return new Set((data ?? []).map((row) => row.content_id));
}

export async function toggleCitationFavorite(userId: string, citationId: string, active: boolean) {
  if (active) {
    const { error } = await supabase.from("edutech_favorites").insert({ user_id: userId, content_type: "citation", content_id: citationId });
    if (error && !error.message.includes("duplicate")) throw new Error(message(error));
    return;
  }
  const { error } = await supabase.from("edutech_favorites").delete().eq("user_id", userId).eq("content_type", "citation").eq("content_id", citationId);
  if (error) throw new Error(message(error));
}

export async function getCitationSubjects() {
  const { data, error } = await supabase.from("subjects").select("id,name").in("name", ["Français", "Philosophie", "Histoire-Géographie", "Physique-Chimie"]).order("name");
  if (error) throw new Error(message(error));
  return data ?? [];
}

export async function getCitationTargets() {
  const [{ data: levels, error: levelError }, { data: series, error: seriesError }] = await Promise.all([supabase.from("levels").select("id,name").in("name", ["Première", "Terminale"]).order("display_order"), supabase.from("series").select("id,name").in("name", ["A1", "A2", "C", "D"]).order("display_order")]);
  if (levelError) throw new Error(message(levelError));
  if (seriesError) throw new Error(message(seriesError));
  return { levels: levels ?? [], series: series ?? [] };
}

export async function getCitationScope(citationId: string) {
  const { data, error } = await supabase.from("citation_scopes").select("level_id,series_id").eq("citation_id", citationId);
  if (error) throw new Error(message(error));
  return data ?? [];
}

export async function saveCitation(input: CitationInput, citationId?: string): Promise<Citation> {
  const validation = validateCitationInput(input); if (validation) throw new Error(validation);
  const payload = { subject_id: input.subjectId, quote_text: input.quoteText.trim(), author: input.author.trim(), source_title: input.sourceTitle?.trim() || null, source_reference: input.sourceReference?.trim() || null, source_url: input.sourceUrl?.trim() || null, pedagogical_explanation: input.pedagogicalExplanation?.trim() || null, keywords: input.keywords.map((item) => item.trim()).filter(Boolean), is_active: input.isActive, is_validated: input.isValidated };
  const { data, error } = citationId ? await supabase.from("citations").update(payload).eq("id", citationId).select(citationSelect).single() : await supabase.from("citations").insert(payload).select(citationSelect).single();
  if (error) throw new Error(message(error));
  const id = data.id as string;
  const { error: scopesError } = await supabase.from("citation_scopes").delete().eq("citation_id", id); if (scopesError) throw new Error(message(scopesError));
  const scopes: Array<{ citation_id: string; level_id: string; series_id: string | null }> = [];
  input.levelIds.forEach((levelId) => {
    if (input.seriesIds.length) input.seriesIds.forEach((seriesId) => scopes.push({ citation_id: id, level_id: levelId, series_id: seriesId }));
    else scopes.push({ citation_id: id, level_id: levelId, series_id: null });
  });
  const { error: insertScopesError } = await supabase.from("citation_scopes").insert(scopes as never); if (insertScopesError) throw new Error(message(insertScopesError));
  const { error: themesError } = await supabase.from("citation_themes").delete().eq("citation_id", id); if (themesError) throw new Error(message(themesError));
  const themes = Array.from(new Set(input.themes.map((theme) => theme.trim()).filter(Boolean))); if (themes.length) { const { error: insertThemesError } = await supabase.from("citation_themes").insert(themes.map((theme) => ({ citation_id: id, theme }))); if (insertThemesError) throw new Error(message(insertThemesError)); }
  return (await getCitation(id)) ?? citationFrom(data);
}

export async function deleteCitation(citationId: string) {
  const { error } = await supabase.from("citations").delete().eq("id", citationId);
  if (error) throw new Error(message(error));
}
