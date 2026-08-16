export const mentorMaxAttachmentBytes = 6 * 1024 * 1024;
export const mentorSupportedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);

export type MentorAvailabilityCode = "OFFLINE" | "QUOTA" | "INVALID_ATTACHMENT" | "NOT_CONFIGURED" | "UNAVAILABLE";

export function isSupportedMentorAttachment(mimeType: string, bytes: number) { return mentorSupportedMimeTypes.has(mimeType) && bytes > 0 && bytes <= mentorMaxAttachmentBytes; }
export function mentorStudentMessage(code: MentorAvailabilityCode) { if (code === "OFFLINE") return "Le Mentor IA nécessite une connexion Internet pour répondre."; if (code === "QUOTA") return "Le Mentor IA est temporairement indisponible. Veuillez réessayer plus tard."; if (code === "INVALID_ATTACHMENT") return "Cette pièce jointe n’est pas compatible ou dépasse la taille autorisée."; if (code === "NOT_CONFIGURED") return "Le Mentor IA n’est pas encore configuré. Veuillez réessayer plus tard."; return "Le Mentor IA est temporairement indisponible. Veuillez réessayer plus tard."; }
export function mentorKeyMask(suffix: string) { return `••••••••••••${suffix.slice(-4)}`; }
export function mentorConversationStorageKey(userId: string) { return `edutech.mentor.conversation.v1.${userId}`; }
