import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const query = readFileSync(
  resolve(root, "supabase/migrations/20260820_histoire_terminale_decolonisation_drafts.sql"),
  "utf8",
);

writeFileSync(
  resolve(root, "tmp/history-decolonization-migration-request.json"),
  JSON.stringify({
    project_id: "nnshioowwniursnozicg",
    name: "histoire_terminale_decolonisation_drafts",
    query,
  }),
);
