import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const migrationName = "svt_terminale_evolution_heredite_previsions_citations_drafts";
const query = readFileSync(resolve("supabase/migrations/20260820_svt_terminale_evolution_heredite_previsions_citations_drafts.sql"), "utf8");

writeFileSync(resolve("tmp/apply-svt-terminal-lot2-citations.json"), JSON.stringify({
  project_id: "nnshioowwniursnozicg",
  name: migrationName,
  query,
}, null, 2));
