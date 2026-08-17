import { supabase } from "@/lib/supabase/client";
import type { NotificationPriority, NotificationTargetType } from "./notification-model";

export type ActiveSchoolYearOption = { id: string; name: string; startsOn: string | null; endsOn: string | null };
export type NotificationRecipient = { id: string; label: string; email: string; schoolLevel: string | null; series: string | null };
export type AdminNotificationInput = { title: string; body: string; notificationType: string; schoolYear: string; targetType: NotificationTargetType; targetLevel?: string | null; targetSeries?: string | null; targetUserId?: string | null; contentType?: string | null; contentId?: string | null; route?: string | null; priority?: NotificationPriority; sourceKey?: string | null };

const errorMessage = (error: unknown) => typeof error === "object" && error && "message" in error && typeof error.message === "string" ? error.message : "Une erreur Supabase est survenue.";

export async function getActiveSchoolYears(): Promise<ActiveSchoolYearOption[]> {
  const { data, error } = await supabase.from("edutech_school_years").select("id,name,starts_on,ends_on").eq("status", "active").order("starts_on", { ascending: false });
  if (error) throw new Error(errorMessage(error));
  return (data ?? []).map((row) => ({ id: row.id, name: row.name, startsOn: row.starts_on ?? null, endsOn: row.ends_on ?? null }));
}

export async function getNotificationRecipients(): Promise<NotificationRecipient[]> {
  const { data, error } = await supabase.from("profiles").select("id,full_name,email,school_level,series").eq("is_active", true).eq("status", "active").order("full_name", { ascending: true }).limit(250);
  if (error) throw new Error(errorMessage(error));
  return (data ?? []).map((row) => ({ id: row.id, label: row.full_name || row.email, email: row.email, schoolLevel: row.school_level ?? null, series: row.series ?? null }));
}

export async function publishAdminNotification(input: AdminNotificationInput) {
  const title = input.title.trim(); const body = input.body.trim();
  if (!title || !body) throw new Error("Le titre et le message sont obligatoires.");
  const { data, error } = await supabase.rpc("admin_publish_notification", {
    p_title: title,
    p_body: body,
    p_notification_type: input.notificationType.trim() || "general",
    p_school_year: input.schoolYear,
    p_target_type: input.targetType,
    p_target_level: input.targetLevel?.trim() || null,
    p_target_series: input.targetSeries?.trim() || null,
    p_target_user_id: input.targetUserId ?? null,
    p_content_type: input.contentType?.trim() || null,
    p_content_id: input.contentId ?? null,
    p_route: input.route?.trim() || null,
    p_priority: input.priority ?? "normal",
    p_source_key: input.sourceKey?.trim() || null,
  });
  if (error) throw new Error(errorMessage(error));
  return String(data);
}

export async function getRecentAdminNotifications() {
  const { data, error } = await supabase.from("edutech_notifications").select("id,title,created_at,school_year,target_type,target_level,target_series,notification_type,priority").order("created_at", { ascending: false }).limit(30);
  if (error) throw new Error(errorMessage(error));
  return data ?? [];
}
