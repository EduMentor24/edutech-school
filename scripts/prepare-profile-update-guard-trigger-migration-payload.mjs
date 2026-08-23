import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const migrationPath = resolve(root, "supabase/migrations/20260823_enforce_profile_update_guard_trigger.sql");
const outputPath = resolve(root, "supabase/migrations/20260823_enforce_profile_update_guard_trigger.apply.json");

writeFileSync(outputPath, `${JSON.stringify({
  project_id: "nnshioowwniursnozicg",
  name: "enforce_profile_update_guard_trigger",
  query: readFileSync(migrationPath, "utf8"),
}, null, 2)}\n`, "utf8");
console.log(outputPath);
