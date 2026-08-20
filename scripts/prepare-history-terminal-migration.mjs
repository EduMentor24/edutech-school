import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const query = readFileSync(
  resolve(projectRoot, "supabase/migrations/20260820_histoire_terminale_relations_internationales_drafts.sql"),
  "utf8",
);

writeFileSync(
  resolve(projectRoot, "tmp/history-terminal-migration-request.json"),
  JSON.stringify({
    project_id: "nnshioowwniursnozicg",
    name: "histoire_terminale_relations_internationales_drafts",
    query,
  }),
);
