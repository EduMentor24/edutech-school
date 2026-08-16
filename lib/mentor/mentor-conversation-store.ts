import AsyncStorage from "@react-native-async-storage/async-storage";
import type { MentorConversationMessage } from "./mentor-service";
import { mentorConversationStorageKey } from "./mentor-policy";

export async function loadMentorConversation(userId: string): Promise<MentorConversationMessage[]> {
  const raw = await AsyncStorage.getItem(mentorConversationStorageKey(userId));
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is MentorConversationMessage => Boolean(item && typeof item === "object" && (item as MentorConversationMessage).role && typeof (item as MentorConversationMessage).content === "string")).slice(-20) : [];
  } catch { return []; }
}

export async function saveMentorConversation(userId: string, messages: MentorConversationMessage[]) { await AsyncStorage.setItem(mentorConversationStorageKey(userId), JSON.stringify(messages.slice(-20))); }
export async function clearMentorConversation(userId: string) { await AsyncStorage.removeItem(mentorConversationStorageKey(userId)); }
