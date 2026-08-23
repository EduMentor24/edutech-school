import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const migrationPath = resolve(root, "supabase/migrations/20260822_secure_profile_change_workflow.sql");
const outputPath = resolve(root, "supabase/migrations/20260822_secure_profile_change_workflow.apply.json");

const payload = {
  project_id: "nnshioowwniursnozicg",
  name: "secure_profile_change_workflow",
  query: readFileSync(migrationPath, "utf8"),
};

writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(outputPath);
