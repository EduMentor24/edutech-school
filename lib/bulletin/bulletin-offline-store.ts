import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

import { AssessmentType, BulletinTerm, calculateSubjectAverage, calculateTermAverage } from "./bulletin-model";
import { BulletinGrade, BulletinGradeInput, BulletinSubject, BulletinSummary } from "./bulletin-service";

export type BulletinSyncState = "synced" | "pending" | "error" | "conflict";
export type LocalBulletinGrade = BulletinGrade & { serverUpdatedAt: string | null; syncState: BulletinSyncState };
export type BulletinSyncOperation = { gradeId: string; kind: "upsert" | "delete"; expectedServerUpdatedAt: string | null; state: "pending" | "error" | "conflict"; error: string | null; updatedAt: string };
export type BulletinOfflineSnapshot = { version: 1; subjects: BulletinSubject[]; grades: LocalBulletinGrade[]; lastSyncedAt: string | null };

const snapshotKey = (studentId: string) => `edutech-school/bulletin/v1/${studentId}/snapshot`;
const queueKey = (studentId: string) => `edutech-school/bulletin/v1/${studentId}/queue`;
const emptySnapshot = (): BulletinOfflineSnapshot => ({ version: 1, subjects: [], grades: [], lastSyncedAt: null });

function parse<T>(value: string | null, fallback: T): T { try { return value ? JSON.parse(value) as T : fallback; } catch { return fallback; } }
function now() { return new Date().toISOString(); }
function localFromRemote(grade: BulletinGrade): LocalBulletinGrade { return { ...grade, serverUpdatedAt: grade.updatedAt, syncState: "synced" }; }
function normalizedGrade(input: Pick<BulletinGradeInput, "grade" | "maxGrade">) { return Math.round((input.grade / input.maxGrade) * 2000) / 100; }

export async function readBulletinSnapshot(studentId: string) { return parse<BulletinOfflineSnapshot>(await AsyncStorage.getItem(snapshotKey(studentId)), emptySnapshot()); }
export async function readBulletinQueue(studentId: string) { return parse<BulletinSyncOperation[]>(await AsyncStorage.getItem(queueKey(studentId)), []); }
export async function writeBulletinSnapshot(studentId: string, snapshot: BulletinOfflineSnapshot) { await AsyncStorage.setItem(snapshotKey(studentId), JSON.stringify(snapshot)); return snapshot; }
export async function writeBulletinQueue(studentId: string, queue: BulletinSyncOperation[]) { await AsyncStorage.setItem(queueKey(studentId), JSON.stringify(queue)); return queue; }

function replaceQueuedOperation(queue: BulletinSyncOperation[], operation: BulletinSyncOperation) { return [...queue.filter((item) => item.gradeId !== operation.gradeId), operation]; }

export function deriveSyncState(queue: BulletinSyncOperation[]): BulletinSyncState {
  if (queue.some((item) => item.state === "conflict")) return "conflict";
  if (queue.some((item) => item.state === "error")) return "error";
  return queue.length ? "pending" : "synced";
}

export function buildLocalBulletinSummary(snapshot: BulletinOfflineSnapshot, schoolYear: string, term: BulletinTerm): BulletinSummary {
  const subjects = snapshot.subjects.map((subject) => { const grades = snapshot.grades.filter((grade) => grade.offeringId === subject.offeringId && grade.schoolYear === schoolYear && grade.term === term); return { ...subject, average: calculateSubjectAverage(grades.map((grade) => ({ grade: grade.grade, maxGrade: grade.maxGrade, assessmentCoefficient: grade.assessmentCoefficient, includeInAverage: grade.includeInAverage }))), noteCount: grades.length }; });
  const total = calculateTermAverage(subjects.map((subject) => ({ average: subject.average, coefficient: subject.coefficient, coefficientVerified: subject.coefficientVerified })));
  return { schoolYear, term, subjects, termAverage: total.average, includedSubjectCount: total.includedSubjectCount, excludedUnverifiedCoefficientCount: total.excludedUnverifiedCoefficientCount };
}

export async function mergeRemoteBulletinSnapshot(studentId: string, remoteSubjects: BulletinSubject[], remoteGrades: BulletinGrade[], schoolYear: string, term: BulletinTerm) {
  const [current, queue] = await Promise.all([readBulletinSnapshot(studentId), readBulletinQueue(studentId)]);
  const localById = new Map(current.grades.map((grade) => [grade.id, grade])); const operations = new Map(queue.map((item) => [item.gradeId, item]));
  const gradeById = new Map(current.grades.filter((grade) => grade.schoolYear !== schoolYear || grade.term !== term).map((grade) => [grade.id, grade])); for (const grade of remoteGrades) gradeById.set(grade.id, localFromRemote(grade));
  for (const operation of operations.values()) { if (operation.kind === "delete") gradeById.delete(operation.gradeId); else { const local = localById.get(operation.gradeId); if (local) gradeById.set(local.id, local); } }
  const snapshot: BulletinOfflineSnapshot = { version: 1, subjects: remoteSubjects, grades: [...gradeById.values()], lastSyncedAt: now() };
  return writeBulletinSnapshot(studentId, snapshot);
}

export async function saveLocalBulletinGrade(studentId: string, input: BulletinGradeInput, gradeId?: string) {
  const [snapshot, queue] = await Promise.all([readBulletinSnapshot(studentId), readBulletinQueue(studentId)]); const subject = snapshot.subjects.find((item) => item.offeringId === input.offeringId); if (!subject) throw new Error("La matière n’est pas disponible dans le cache local du Bulletin.");
  const previous = gradeId ? snapshot.grades.find((grade) => grade.id === gradeId) : undefined; const id = previous?.id ?? Crypto.randomUUID(); const timestamp = now();
  const grade: LocalBulletinGrade = { id, offeringId: input.offeringId, subjectName: input.subjectName, schoolYear: input.schoolYear, term: input.term, assessmentType: input.assessmentType as AssessmentType, grade: input.grade, maxGrade: input.maxGrade, assessmentCoefficient: input.assessmentCoefficient, assessmentDate: input.assessmentDate, comment: input.comment.trim() || null, includeInAverage: true, normalizedGrade: normalizedGrade(input), updatedAt: timestamp, serverUpdatedAt: previous?.serverUpdatedAt ?? null, syncState: "pending" };
  const nextSnapshot = { ...snapshot, grades: [...snapshot.grades.filter((item) => item.id !== id), grade] }; const operation: BulletinSyncOperation = { gradeId: id, kind: "upsert", expectedServerUpdatedAt: previous?.serverUpdatedAt ?? null, state: "pending", error: null, updatedAt: timestamp };
  await Promise.all([writeBulletinSnapshot(studentId, nextSnapshot), writeBulletinQueue(studentId, replaceQueuedOperation(queue, operation))]); return grade;
}

export async function deleteLocalBulletinGrade(studentId: string, gradeId: string) {
  const [snapshot, queue] = await Promise.all([readBulletinSnapshot(studentId), readBulletinQueue(studentId)]); const grade = snapshot.grades.find((item) => item.id === gradeId); if (!grade) throw new Error("Cette note locale est introuvable.");
  const nextSnapshot = { ...snapshot, grades: snapshot.grades.filter((item) => item.id !== gradeId) }; const operation: BulletinSyncOperation = { gradeId, kind: "delete", expectedServerUpdatedAt: grade.serverUpdatedAt, state: "pending", error: null, updatedAt: now() };
  await Promise.all([writeBulletinSnapshot(studentId, nextSnapshot), writeBulletinQueue(studentId, replaceQueuedOperation(queue, operation))]);
}

export async function setBulletinOperationState(studentId: string, gradeId: string, state: BulletinSyncOperation["state"], error: string | null) { const queue = await readBulletinQueue(studentId); await writeBulletinQueue(studentId, queue.map((item) => item.gradeId === gradeId ? { ...item, state, error } : item)); }
export async function removeBulletinOperation(studentId: string, gradeId: string) { const queue = await readBulletinQueue(studentId); await writeBulletinQueue(studentId, queue.filter((item) => item.gradeId !== gradeId)); }
export async function markLocalGradeSynced(studentId: string, gradeId: string, serverUpdatedAt: string | null) { const snapshot = await readBulletinSnapshot(studentId); await writeBulletinSnapshot(studentId, { ...snapshot, grades: snapshot.grades.map((grade) => grade.id === gradeId ? { ...grade, serverUpdatedAt, syncState: "synced" } : grade) }); }
export async function getLocalBulletinGrade(studentId: string, gradeId: string) { return (await readBulletinSnapshot(studentId)).grades.find((grade) => grade.id === gradeId) ?? null; }
export async function getLocalBulletinSubjectGrades(studentId: string, offeringId: string, schoolYear: string, term: BulletinTerm) { const snapshot = await readBulletinSnapshot(studentId); const subject = snapshot.subjects.find((item) => item.offeringId === offeringId); if (!subject) throw new Error("Cette matière n’est pas disponible dans le cache local du Bulletin."); return { subjectName: subject.subjectName, grades: snapshot.grades.filter((grade) => grade.offeringId === offeringId && grade.schoolYear === schoolYear && grade.term === term).sort((a, b) => b.assessmentDate.localeCompare(a.assessmentDate)) }; }
