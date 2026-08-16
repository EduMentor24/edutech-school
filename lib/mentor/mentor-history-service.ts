import { supabase } from "@/lib/supabase/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { citationTitleFromText } from "@/lib/citations/citation-model";
import type { MentorConversationMessage } from "./mentor-service";

export type MentorHistoryConversation = { id: string; title: string; subject: string | null; createdAt: string; updatedAt: string; preview: string | null };
const message = (error: unknown) => error && typeof error === "object" && "message" in error && typeof error.message === "string" ? error.message : "Une erreur Supabase est survenue.";
const historyKey = (userId: string) => `edutech.mentor.history.v1.${userId}`;
const messageKey = (userId: string, conversationId: string) => `edutech.mentor.history.messages.v1.${userId}.${conversationId}`;
async function readCache<T>(key: string): Promise<T | null> { const raw = await AsyncStorage.getItem(key); if (!raw) return null; try { return JSON.parse(raw) as T; } catch { return null; } }

export async function getMentorHistory(userId: string): Promise<MentorHistoryConversation[]> {
  const { data, error } = await supabase.from("mentor_conversations").select("id,title,subject,created_at,updated_at,mentor_conversation_messages(content,created_at)").eq("user_id", userId).order("updated_at", { ascending: false });
  if (error) { const cached = await readCache<MentorHistoryConversation[]>(historyKey(userId)); if (cached) return cached; throw new Error(message(error)); }
  const result = (data ?? []).map((row: any) => ({ id: row.id, title: row.title, subject: row.subject ?? null, createdAt: row.created_at, updatedAt: row.updated_at, preview: Array.isArray(row.mentor_conversation_messages) ? row.mentor_conversation_messages.sort((a: any, b: any) => b.created_at.localeCompare(a.created_at))[0]?.content ?? null : null }));
  await AsyncStorage.setItem(historyKey(userId), JSON.stringify(result)); return result;
}

export async function getMentorHistoryMessages(userId: string, conversationId: string): Promise<MentorConversationMessage[]> {
  const { data, error } = await supabase.from("mentor_conversation_messages").select("role,content,attachment_label,created_at").eq("user_id", userId).eq("conversation_id", conversationId).order("created_at", { ascending: true });
  if (error) { const cached = await readCache<MentorConversationMessage[]>(messageKey(userId, conversationId)); if (cached) return cached; throw new Error(message(error)); }
  const result = (data ?? []).map((row) => ({ role: row.role as "user" | "assistant", content: row.attachment_label ? `${row.content}\n\n*Pièce jointe : ${row.attachment_label}*` : row.content }));
  await AsyncStorage.setItem(messageKey(userId, conversationId), JSON.stringify(result)); return result;
}

export async function persistMentorExchange(userId: string, conversationId: string | null, subject: string | null, userMessage: string, assistantMessage: string, attachmentLabel?: string | null) {
  let activeId = conversationId;
  if (!activeId) { const { data, error } = await supabase.from("mentor_conversations").insert({ user_id: userId, title: citationTitleFromText(userMessage), subject }).select("id").single(); if (error) throw new Error(message(error)); activeId = data.id; }
  const { error } = await supabase.from("mentor_conversation_messages").insert([{ conversation_id: activeId, user_id: userId, role: "user", content: userMessage, attachment_label: attachmentLabel ?? null }, { conversation_id: activeId, user_id: userId, role: "assistant", content: assistantMessage }]);
  if (error) throw new Error(message(error));
  return activeId;
}

export async function deleteMentorHistoryConversation(userId: string, conversationId: string) {
  const { error } = await supabase.from("mentor_conversations").delete().eq("id", conversationId).eq("user_id", userId);
  if (error) throw new Error(message(error));
  await AsyncStorage.removeItem(messageKey(userId, conversationId));
  const cached = await readCache<MentorHistoryConversation[]>(historyKey(userId)); if (cached) await AsyncStorage.setItem(historyKey(userId), JSON.stringify(cached.filter((item) => item.id !== conversationId)));
}
