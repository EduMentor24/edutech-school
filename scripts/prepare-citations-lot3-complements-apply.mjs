import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

writeFileSync(resolve("tmp/apply-citations-lot3-complements.json"), JSON.stringify({
  project_id: "nnshioowwniursnozicg",
  name: "citations_lot3_complements_equilibres",
  query: readFileSync(resolve("supabase/migrations/20260820_citations_lot3_complements_equilibres.sql"), "utf8"),
}, null, 2));
