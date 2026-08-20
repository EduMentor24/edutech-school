import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const migrationPath = resolve(root, "supabase/migrations/20260820_geographie_terminale_coree_cedeao_ueacp_citations_drafts.sql");
const outputPath = resolve(root, "tmp/apply-geography-korea-cedeao-ueacp-citations.json");
const sql = readFileSync(migrationPath, "utf8");

writeFileSync(outputPath, JSON.stringify({
  name: "20260820_geographie_terminale_coree_cedeao_ueacp_citations_drafts",
  project_id: "nnshioowwniursnozicg",
  query: sql,
}, null, 2));

console.log(outputPath);
