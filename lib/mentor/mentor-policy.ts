export const mentorMaxAttachmentBytes = 6 * 1024 * 1024;
export const mentorSupportedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);

export type MentorAvailabilityCode = "OFFLINE" | "QUOTA" | "INVALID_ATTACHMENT" | "NOT_CONFIGURED" | "UNAVAILABLE";
export type MentorGeminiStatus = "valid" | "quota" | "invalid" | "unavailable";

export function isSupportedMentorAttachment(mimeType: string, bytes: number) { return mentorSupportedMimeTypes.has(mimeType) && bytes > 0 && bytes <= mentorMaxAttachmentBytes; }
export function mentorStudentMessage(code: MentorAvailabilityCode) { if (code === "OFFLINE") return "Le Mentor IA nécessite une connexion Internet pour répondre."; if (code === "QUOTA") return "Le Mentor IA est temporairement indisponible. Veuillez réessayer plus tard."; if (code === "INVALID_ATTACHMENT") return "Cette pièce jointe n’est pas compatible ou dépasse la taille autorisée."; if (code === "NOT_CONFIGURED") return "Le Mentor IA n’est pas encore configuré. Veuillez réessayer plus tard."; return "Le Mentor IA est temporairement indisponible. Veuillez réessayer plus tard."; }
export function mentorKeyMask(suffix: string) { return `••••••••••••${suffix.slice(-4)}`; }
export function mentorConversationStorageKey(userId: string) { return `edutech.mentor.conversation.v1.${userId}`; }
export function diagnoseGeminiFailure(httpStatus: number, providerStatus?: string) {
  if (httpStatus === 429 || providerStatus === "RESOURCE_EXHAUSTED") return { status: "quota" as MentorGeminiStatus, code: "QUOTA", message: "Le quota Gemini est temporairement atteint. Vérifiez le quota et la facturation du projet Google associé." };
  if (httpStatus === 401 || providerStatus === "UNAUTHENTICATED") return { status: "invalid" as MentorGeminiStatus, code: "INVALID", message: "La clé Gemini n’est pas reconnue. Créez ou sélectionnez une clé active dans Google AI Studio." };
  if (httpStatus === 403 || providerStatus === "PERMISSION_DENIED") return { status: "invalid" as MentorGeminiStatus, code: "INVALID", message: "L’autorisation Gemini est refusée. Vérifiez que la clé est active et que ses restrictions autorisent l’API Gemini depuis le serveur." };
  if (httpStatus === 404 || providerStatus === "NOT_FOUND") return { status: "unavailable" as MentorGeminiStatus, code: "UNAVAILABLE", message: "Le modèle Gemini configuré n’est pas accessible avec cette clé. Vérifiez sa disponibilité dans Google AI Studio." };
  if (providerStatus === "FAILED_PRECONDITION") return { status: "unavailable" as MentorGeminiStatus, code: "UNAVAILABLE", message: "Le projet Google associé nécessite une configuration complémentaire, par exemple l’activation du service ou la facturation." };
  if (httpStatus === 400 || providerStatus === "INVALID_ARGUMENT") return { status: "unavailable" as MentorGeminiStatus, code: "UNAVAILABLE", message: "Gemini a refusé la requête de test. Réessayez après avoir vérifié la clé et la configuration du projet Google." };
  return { status: "unavailable" as MentorGeminiStatus, code: "UNAVAILABLE", message: "Le service Gemini est temporairement indisponible. Réessayez dans quelques instants." };
}
