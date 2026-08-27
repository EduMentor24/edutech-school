import * as Network from "expo-network";

import { supabase } from "@/lib/supabase/client";
import { readLearningSyncQueue, updateLocalAttemptFromSync, writeLearningSyncQueue, type LearningSyncOperation } from "./learning-sync-store";

type RemoteSyncResult = { state?: "synced" | "conflict"; message?: string; attempt_id?: string };

const errorMessage = (cause: unknown) => cause instanceof Error ? cause.message : "La synchronisation est temporairement indisponible.";

export async function isInternetReachable() {
  const state = await Network.getNetworkStateAsync();
  return state.isConnected === true && state.isInternetReachable !== false;
}

async function syncOperation(operation: LearningSyncOperation): Promise<RemoteSyncResult> {
  if (operation.type === "lesson_view" || operation.type === "lesson_complete" || operation.type === "lesson_favorite") {
    const { data, error } = await supabase.rpc("sync_local_learning_progress", {
      p_client_operation_id: operation.idempotencyKey,
      p_operation_type: operation.type,
      p_lesson_id: operation.resourceId,
      p_favorite: operation.type === "lesson_favorite" ? operation.payload.favorite ?? null : null,
    });
    if (error) throw new Error(error.message);
    return (Array.isArray(data) ? data[0] : data) as RemoteSyncResult;
  }
  const functionName = operation.type === "exercise_submit" ? "sync_local_exercise_submission" : "sync_local_quiz_submission";
  const resourceName = operation.type === "exercise_submit" ? "p_exercise_id" : "p_quiz_id";
  const { data, error } = await supabase.rpc(functionName, {
    p_client_operation_id: operation.idempotencyKey,
    [resourceName]: operation.resourceId,
    p_content_version: operation.payload.contentVersion ?? null,
    p_answers: operation.payload.answers ?? {},
    p_started_at: operation.payload.startedAt ?? new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
  return (Array.isArray(data) ? data[0] : data) as RemoteSyncResult;
}

export async function processLearningSyncQueue(userId: string) {
  if (!(await isInternetReachable())) return { synced: 0, pending: (await readLearningSyncQueue(userId)).length, conflicts: 0, errors: 0 };
  const queue = await readLearningSyncQueue(userId);
  const retained: LearningSyncOperation[] = [];
  let synced = 0;
  let conflicts = 0;
  let errors = 0;
  for (const operation of queue) {
    if (operation.state === "conflict") { retained.push(operation); conflicts += 1; continue; }
    const syncing = { ...operation, state: "syncing" as const, attempts: operation.attempts + 1, error: null };
    try {
      const result = await syncOperation(syncing);
      if (result?.state === "conflict") {
        const conflict = { ...syncing, state: "conflict" as const, error: result.message ?? "Le contenu distant a changé avant la synchronisation." };
        retained.push(conflict);
        await updateLocalAttemptFromSync(userId, operation.payload.localAttemptId, "conflict", conflict.error);
        conflicts += 1;
      } else {
        await updateLocalAttemptFromSync(userId, operation.payload.localAttemptId, "synced", null, result?.attempt_id ?? null);
        synced += 1;
      }
    } catch (cause) {
      const failed = { ...syncing, state: "error" as const, error: errorMessage(cause) };
      retained.push(failed);
      await updateLocalAttemptFromSync(userId, operation.payload.localAttemptId, "error", failed.error);
      errors += 1;
    }
  }
  await writeLearningSyncQueue(userId, retained);
  return { synced, pending: retained.filter((item) => item.state === "pending" || item.state === "syncing").length, conflicts, errors };
}
