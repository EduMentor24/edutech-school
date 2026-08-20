import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const query = readFileSync(
  resolve(root, "supabase/migrations/20260820_geographie_terminale_economie_ci_drafts.sql"),
  "utf8",
);

writeFileSync(
  resolve(root, "tmp/geography-economy-ci-migration-request.json"),
  JSON.stringify({
    project_id: "nnshioowwniursnozicg",
    name: "geographie_terminale_economie_ci_drafts",
    query,
  }),
);
