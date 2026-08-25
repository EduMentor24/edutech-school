import { describe, expect, it } from "vitest";

import {
  beginLocalLearningAttempt,
  enqueueLearningOperation,
  readLearningSyncQueue,
  readLocalLearningAttempts,
  submitLocalLearningAttempt,
} from "../lib/offline/learning-sync-store";

describe("file pédagogique idempotente", () => {
  it("fusionne une vue locale dans une complétion plus récente de la même leçon", async () => {
    const userId = "learning-sync-merge";
    await enqueueLearningOperation(userId, { type: "lesson_view", resourceId: "lesson-1", payload: {} });
    await enqueueLearningOperation(userId, { type: "lesson_complete", resourceId: "lesson-1", payload: {} });
    const operations = await readLearningSyncQueue(userId);

    expect(operations.filter((item) => item.resourceId === "lesson-1")).toHaveLength(1);
    expect(operations.find((item) => item.resourceId === "lesson-1")?.type).toBe("lesson_complete");
  });

  it("conserve une soumission locale d’exercice avec une clé d’idempotence stable", async () => {
    const userId = "learning-sync-attempt";
    const attempt = await beginLocalLearningAttempt(userId, "exercise", "exercise-1", "version-1");
    const submitted = await submitLocalLearningAttempt(userId, attempt.id, { questionA: ["réponse"] });
    const queued = await readLearningSyncQueue(userId);

    expect(submitted.state).toBe("pending");
    expect(queued.some((item) => item.payload.localAttemptId === attempt.id && item.idempotencyKey.length > 12)).toBe(true);
    expect((await readLocalLearningAttempts(userId)).find((item) => item.id === attempt.id)?.answers).toEqual({ questionA: ["réponse"] });
  });
});
