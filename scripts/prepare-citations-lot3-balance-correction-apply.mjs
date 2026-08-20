import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const name = "citations_lot3_equilibre_correction";
const query = readFileSync(resolve("supabase/migrations/20260820_citations_lot3_equilibre_correction.sql"), "utf8");

writeFileSync(resolve("tmp/apply-citations-lot3-balance-correction.json"), JSON.stringify({
  project_id: "nnshioowwniursnozicg",
  name,
  query,
}, null, 2));
