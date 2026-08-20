import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const query = readFileSync(
  resolve(root, "supabase/migrations/20260820_histoire_ua_croyances_citations_drafts.sql"),
  "utf8",
);

writeFileSync(
  resolve(root, "tmp/history-ua-citations-migration-request.json"),
  JSON.stringify({
    project_id: "nnshioowwniursnozicg",
    name: "histoire_ua_croyances_citations_drafts",
    query,
  }),
);
