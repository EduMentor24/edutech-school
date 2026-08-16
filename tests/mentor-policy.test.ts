import { describe, expect, it } from "vitest";
import { isSupportedMentorAttachment, mentorConversationStorageKey, mentorKeyMask, mentorMaxAttachmentBytes, mentorStudentMessage } from "../lib/mentor/mentor-policy";

describe("règles de sécurité du Mentor IA", () => {
  it("masque toute la clé sauf les quatre derniers caractères", () => { expect(mentorKeyMask("abcD7Xk9")).toBe("••••••••••••7Xk9"); });
  it("isole les conversations locales par utilisateur", () => { expect(mentorConversationStorageKey("eleve-a")).not.toBe(mentorConversationStorageKey("eleve-b")); });
  it("accepte uniquement les images et PDF dans la limite de taille", () => { expect(isSupportedMentorAttachment("image/jpeg", mentorMaxAttachmentBytes)).toBe(true); expect(isSupportedMentorAttachment("application/pdf", 1)).toBe(true); expect(isSupportedMentorAttachment("text/plain", 100)).toBe(false); expect(isSupportedMentorAttachment("image/png", mentorMaxAttachmentBytes + 1)).toBe(false); });
  it("ne divulgue pas les diagnostics Gemini à l’élève", () => { expect(mentorStudentMessage("QUOTA")).toBe("Le Mentor IA est temporairement indisponible. Veuillez réessayer plus tard."); expect(mentorStudentMessage("INVALID_ATTACHMENT")).not.toContain("Gemini"); });
});
