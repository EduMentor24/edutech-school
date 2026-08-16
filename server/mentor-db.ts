import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { mentorSettings, type MentorSettings } from "../drizzle/schema";

export type StoredMentorSettings = MentorSettings;

export async function getMentorSettings(): Promise<StoredMentorSettings | null> {
  const db = await getDb();
  if (!db) throw new Error("La configuration serveur est indisponible.");
  const rows = await db.select().from(mentorSettings).where(eq(mentorSettings.id, 1)).limit(1);
  return rows[0] ?? null;
}

export async function saveMentorSettings(input: {
  model: string;
  apiKeyCiphertext: string;
  encryptionIv: string;
  encryptionAuthTag: string;
  keySuffix: string;
  updatedBy: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("La configuration serveur est indisponible.");
  await db.insert(mentorSettings).values({
    id: 1,
    provider: "Google Gemini",
    model: input.model,
    apiKeyCiphertext: input.apiKeyCiphertext,
    encryptionIv: input.encryptionIv,
    encryptionAuthTag: input.encryptionAuthTag,
    keySuffix: input.keySuffix,
    status: "unknown",
    lastCheckedAt: null,
    updatedBy: input.updatedBy,
  }).onDuplicateKeyUpdate({
    set: {
      model: input.model,
      apiKeyCiphertext: input.apiKeyCiphertext,
      encryptionIv: input.encryptionIv,
      encryptionAuthTag: input.encryptionAuthTag,
      keySuffix: input.keySuffix,
      status: "unknown",
      lastCheckedAt: null,
      updatedBy: input.updatedBy,
    },
  });
}

export async function updateMentorSettingsStatus(status: "valid" | "quota" | "invalid" | "unavailable") {
  const db = await getDb();
  if (!db) throw new Error("La configuration serveur est indisponible.");
  await db.update(mentorSettings).set({ status, lastCheckedAt: new Date() }).where(eq(mentorSettings.id, 1));
}

export async function updateMentorSettingsModelAndStatus(model: string, status: "valid" | "quota" | "invalid" | "unavailable") {
  const db = await getDb();
  if (!db) throw new Error("La configuration serveur est indisponible.");
  await db.update(mentorSettings).set({ model, status, lastCheckedAt: new Date() }).where(eq(mentorSettings.id, 1));
}
