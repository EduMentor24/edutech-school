import { getLocalData, removeLocalData, saveLocalData } from "./offline-storage-service";

export type LearningSyncState = "pending" | "syncing" | "error" | "conflict";
export type LearningOperationType = "lesson_view" | "lesson_complete" | "lesson_favorite" | "exercise_submit" | "quiz_submit";
export type LocalAttemptKind = "exercise" | "quiz";

export type LearningSyncOperation = {
  id: string;
  idempotencyKey: string;
  type: LearningOperationType;
  resourceId: string;
  payload: { favorite?: boolean; answers?: Record<string, unknown>; contentVersion?: string | null; startedAt?: string; localAttemptId?: string };
  state: LearningSyncState;
  attempts: number;
  createdAt: string;
  error: string | null;
};

export type LocalLearningAttempt = {
  id: string;
  kind: LocalAttemptKind;
  resourceId: string;
  contentVersion: string | null;
  startedAt: string;
  submittedAt: string | null;
  answers: Record<string, unknown> | null;
  state: "in_progress" | "pending" | "synced" | "conflict" | "error";
  serverAttemptId: string | null;
  error: string | null;
};

const key = (userId: string, suffix: "queue" | "attempts") => `edutech-school/learning-sync/v1/${userId}/${suffix}`;

function uniqueId(prefix: string) {
  const random = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}-${random}`;
}

export async function readLearningSyncQueue(userId: string) { return (await getLocalData<LearningSyncOperation[]>(key(userId, "queue"))) ?? []; }
export async function writeLearningSyncQueue(userId: string, queue: LearningSyncOperation[]) { await saveLocalData(key(userId, "queue"), queue); }
export async function readLocalLearningAttempts(userId: string) { return (await getLocalData<LocalLearningAttempt[]>(key(userId, "attempts"))) ?? []; }
export async function writeLocalLearningAttempts(userId: string, attempts: LocalLearningAttempt[]) { await saveLocalData(key(userId, "attempts"), attempts); }

export async function enqueueLearningOperation(userId: string, input: Omit<LearningSyncOperation, "id" | "idempotencyKey" | "state" | "attempts" | "createdAt" | "error">) {
  const queue = await readLearningSyncQueue(userId);
  const mergeable = new Set<LearningOperationType>(["lesson_view", "lesson_complete", "lesson_favorite"]);
  const filtered = mergeable.has(input.type)
    ? queue.filter((item) => !(item.resourceId === input.resourceId && mergeable.has(item.type) && item.state !== "conflict"))
    : queue;
  const id = uniqueId("learning");
  const operation: LearningSyncOperation = { ...input, id, idempotencyKey: id, state: "pending", attempts: 0, createdAt: new Date().toISOString(), error: null };
  await writeLearningSyncQueue(userId, [...filtered, operation]);
  return operation;
}

export async function beginLocalLearningAttempt(userId: string, kind: LocalAttemptKind, resourceId: string, contentVersion: string | null) {
  const attempts = await readLocalLearningAttempts(userId);
  const attempt: LocalLearningAttempt = { id: uniqueId("local"), kind, resourceId, contentVersion, startedAt: new Date().toISOString(), submittedAt: null, answers: null, state: "in_progress", serverAttemptId: null, error: null };
  await writeLocalLearningAttempts(userId, [...attempts, attempt]);
  return attempt;
}

export async function submitLocalLearningAttempt(userId: string, localAttemptId: string, answers: Record<string, unknown>) {
  const attempts = await readLocalLearningAttempts(userId);
  const attempt = attempts.find((item) => item.id === localAttemptId);
  if (!attempt) throw new Error("La tentative locale est introuvable.");
  if (attempt.state !== "in_progress") return attempt;
  const nextAttempt: LocalLearningAttempt = { ...attempt, answers, submittedAt: new Date().toISOString(), state: "pending", error: null };
  const nextAttempts = attempts.map((item) => item.id === localAttemptId ? nextAttempt : item);
  await writeLocalLearningAttempts(userId, nextAttempts);
  await enqueueLearningOperation(userId, {
    type: attempt.kind === "exercise" ? "exercise_submit" : "quiz_submit",
    resourceId: attempt.resourceId,
    payload: { answers, contentVersion: attempt.contentVersion, startedAt: attempt.startedAt, localAttemptId: attempt.id },
  });
  return nextAttempt;
}

export async function updateLocalAttemptFromSync(userId: string, localAttemptId: string | undefined, state: "synced" | "conflict" | "error", error: string | null, serverAttemptId: string | null = null) {
  if (!localAttemptId) return;
  const attempts = await readLocalLearningAttempts(userId);
  await writeLocalLearningAttempts(userId, attempts.map((attempt) => attempt.id === localAttemptId ? { ...attempt, state, error, serverAttemptId: serverAttemptId ?? attempt.serverAttemptId } : attempt));
}

export async function clearLearningSyncData(userId: string) {
  await Promise.allSettled([removeLocalData(key(userId, "queue")), removeLocalData(key(userId, "attempts"))]);
}
