import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const migrationPath = resolve(root, "supabase/migrations/20260824_peripheral_port_dragdrop_activity.sql");
const payloadPath = resolve(root, "supabase/migrations/20260824_peripheral_port_dragdrop_activity.apply.json");
const offerings = ["0beafff1-63db-42c9-99a2-8ef6da799f19", "7680fb4a-c9d4-41df-92f3-a91effda4944", "7695b4cf-0524-4de4-af91-f8d79eed2b0a", "f9c030a4-8b30-4657-b7bb-d81e4e500635"];
const chapterTitle = "Maîtriser son ordinateur : comprendre, utiliser et s’organiser";
const lessonTitle = "Connecter les périphériques : ports, réseaux et compatibilité";
const migration = `do $peripheral_port_activity$
declare target_count integer;
begin
  select count(*) into target_count from public.lessons l join public.chapters c on c.id=l.chapter_id where c.subject_offering_id in ('${offerings.join("','")}') and c.title='${chapterTitle}' and l.title='${lessonTitle}' and l.is_active=false and l.is_test_data=false and l.content not like '%:::peripheral-port-match%';
  if target_count<>4 then raise exception 'Les quatre brouillons Périphériques attendus sont absents, actifs ou déjà annotés.'; end if;
  update public.lessons l set content=replace(l.content,':::computer-ports-visual',':::computer-ports-visual\n\n:::peripheral-port-match') from public.chapters c where c.id=l.chapter_id and c.subject_offering_id in ('${offerings.join("','")}') and c.title='${chapterTitle}' and l.title='${lessonTitle}' and l.is_active=false and l.is_test_data=false;
  if exists (select 1 from public.lessons l join public.chapters c on c.id=l.chapter_id where c.subject_offering_id in ('${offerings.join("','")}') and c.title='${chapterTitle}' and l.title='${lessonTitle}' and l.content not like '%:::peripheral-port-match%') then raise exception 'L’activité interactive est absente après annotation.'; end if;
end $peripheral_port_activity$;`;
writeFileSync(migrationPath,migration,"utf8");
writeFileSync(payloadPath,`${JSON.stringify({project_id:"nnshioowwniursnozicg",name:"peripheral_port_dragdrop_activity",query:migration},null,2)}\n`,"utf8");
console.log(migrationPath); console.log(payloadPath);
