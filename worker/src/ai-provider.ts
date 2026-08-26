import { MENTOR_TEXT_MODEL } from "./mentor-contract";
import type { WorkerAiBinding } from "./types";

export type MentorAiMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export interface MentorAiProvider {
  answer(messages: MentorAiMessage[]): Promise<string>;
}

function answerFrom(result: unknown) {
  if (typeof result === "string") return result.trim();
  if (result && typeof result === "object" && "response" in result) {
    const response = (result as { response?: unknown }).response;
    if (typeof response === "string") return response.trim();
  }
  return "";
}

export class WorkersAiProvider implements MentorAiProvider {
  constructor(private readonly ai: WorkerAiBinding) {}

  async answer(messages: MentorAiMessage[]) {
    const raw = await this.ai.run(MENTOR_TEXT_MODEL, { messages, max_tokens: 500 });
    return answerFrom(raw);
  }
}
