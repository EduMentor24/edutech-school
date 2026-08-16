import * as Network from "expo-network";
import { AppState } from "react-native";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import { useSupabaseAuth } from "@/lib/auth/supabase-auth-provider";
import { supabase } from "@/lib/supabase/client";
import { BulletinTerm } from "./bulletin-model";
import { getCurrentBulletinStudentId, getRemoteBulletinSnapshot } from "./bulletin-service";
import { BulletinSyncOperation, BulletinSyncState, deriveSyncState, getLocalBulletinGrade, markLocalGradeSynced, mergeRemoteBulletinSnapshot, readBulletinQueue, removeBulletinOperation, setBulletinOperationState } from "./bulletin-offline-store";

type BulletinSyncContextValue = { isOnline: boolean; syncState: BulletinSyncState; syncError: string | null; revision: number; syncNow: (schoolYear?: string) => Promise<void>; notifyLocalChange: () => void };
const BulletinSyncContext = createContext<BulletinSyncContextValue | null>(null);
const terms: BulletinTerm[] = ["T1", "T2", "T3"];
const currentSchoolYear = () => { const now = new Date(); const start = now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1; return `${start}-${start + 1}`; };
const message = (error: unknown) => error instanceof Error ? error.message : "La synchronisation du Bulletin a échoué.";

function payloadFor(grade: NonNullable<Awaited<ReturnType<typeof getLocalBulletinGrade>>>, studentId: string) { return { id: grade.id, student_id: studentId, subject_offering_id: grade.offeringId, subject_label_legacy: grade.subjectName, school_year: grade.schoolYear, term: grade.term, assessment_type: grade.assessmentType, grade: grade.grade, max_grade: grade.maxGrade, assessment_coefficient: grade.assessmentCoefficient, assessment_date: grade.assessmentDate, comment: grade.comment, include_in_average: grade.includeInAverage, created_by_student: true }; }

export function BulletinSyncProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, profile } = useSupabaseAuth(); const network = Network.useNetworkState(); const [syncState, setSyncState] = useState<BulletinSyncState>("synced"); const [syncError, setSyncError] = useState<string | null>(null); const [revision, setRevision] = useState(0); const running = useRef(false);
  const isOnline = network.isInternetReachable === true;
  const notifyLocalChange = useCallback(() => { setRevision((value) => value + 1); setSyncState("pending"); setSyncError(null); }, []);

  const refreshRemoteCache = useCallback(async (studentId: string, schoolYear: string) => { if (!profile) return; for (const term of terms) { const remote = await getRemoteBulletinSnapshot(profile, schoolYear, term); await mergeRemoteBulletinSnapshot(studentId, remote.summary.subjects, remote.grades, schoolYear, term); } }, [profile]);

  const applyOperation = useCallback(async (studentId: string, operation: BulletinSyncOperation) => {
    const local = await getLocalBulletinGrade(studentId, operation.gradeId);
    if (operation.kind === "delete" && !operation.expectedServerUpdatedAt) { await removeBulletinOperation(studentId, operation.gradeId); return; }
    if (operation.expectedServerUpdatedAt) { const { data: remote, error } = await supabase.from("edutech_grades").select("updated_at").eq("id", operation.gradeId).eq("student_id", studentId).maybeSingle(); if (error) throw new Error(error.message); if (!remote || String(remote.updated_at) !== operation.expectedServerUpdatedAt) { await setBulletinOperationState(studentId, operation.gradeId, "conflict", "La version distante a changé. Votre modification locale n’a pas été écrasée."); return; } }
    if (operation.kind === "delete") { const { error } = await supabase.from("edutech_grades").delete().eq("id", operation.gradeId).eq("student_id", studentId); if (error) throw new Error(error.message); await removeBulletinOperation(studentId, operation.gradeId); return; }
    if (!local) { await setBulletinOperationState(studentId, operation.gradeId, "error", "La note locale à synchroniser est introuvable."); return; }
    const { data, error } = await supabase.from("edutech_grades").upsert(payloadFor(local, studentId), { onConflict: "id" }).select("updated_at").maybeSingle(); if (error) throw new Error(error.message); await markLocalGradeSynced(studentId, operation.gradeId, data?.updated_at ? String(data.updated_at) : null); await removeBulletinOperation(studentId, operation.gradeId);
  }, []);

  const syncNow = useCallback(async (schoolYear = currentSchoolYear()) => { if (!isAuthenticated || !profile || !isOnline || running.current) return; running.current = true; setSyncError(null); try { const studentId = await getCurrentBulletinStudentId(); const queue = await readBulletinQueue(studentId); for (const operation of queue) { try { await applyOperation(studentId, operation); } catch (error) { await setBulletinOperationState(studentId, operation.gradeId, "error", message(error)); } } await refreshRemoteCache(studentId, schoolYear); const remaining = await readBulletinQueue(studentId); setSyncState(remaining.some((item) => item.state === "conflict") ? "conflict" : remaining.some((item) => item.state === "error") ? "error" : remaining.length ? "pending" : "synced"); setSyncError(remaining.find((item) => item.error)?.error ?? null); notifyLocalChange(); } catch (error) { setSyncState("error"); setSyncError(message(error)); } finally { running.current = false; } }, [applyOperation, isAuthenticated, isOnline, notifyLocalChange, profile, refreshRemoteCache]);

  useEffect(() => { if (isOnline) void syncNow(); }, [isOnline, syncNow]);
  useEffect(() => { const subscription = AppState.addEventListener("change", (next) => { if (next === "active" && isOnline) void syncNow(); }); return () => subscription.remove(); }, [isOnline, syncNow]);
  useEffect(() => { if (!isAuthenticated) return; void (async () => { try { const studentId = await getCurrentBulletinStudentId(); setSyncState(deriveSyncState(await readBulletinQueue(studentId))); } catch { /* La session peut être indisponible pendant le démarrage. */ } })(); }, [isAuthenticated, revision]);
  useEffect(() => { if (!isAuthenticated) { setSyncState("synced"); setSyncError(null); } }, [isAuthenticated]);

  const value = useMemo(() => ({ isOnline, syncState, syncError, revision, syncNow, notifyLocalChange }), [isOnline, notifyLocalChange, revision, syncError, syncNow, syncState]);
  return <BulletinSyncContext.Provider value={value}>{children}</BulletinSyncContext.Provider>;
}

export function useBulletinSync() { const value = useContext(BulletinSyncContext); if (!value) throw new Error("useBulletinSync doit être utilisé dans BulletinSyncProvider."); return value; }
