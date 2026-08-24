import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
const root = resolve(import.meta.dirname, "..");
const sql = readFileSync(resolve(root, "supabase/migrations/20260824_extend_bulk_publication_sessions.sql"), "utf8");
writeFileSync(resolve(root, "supabase/migrations/20260824_extend_bulk_publication_sessions.apply.json"), `${JSON.stringify({ project_id: "nnshioowwniursnozicg", name: "extend_bulk_publication_sessions", query: sql }, null, 2)}\n`);
