import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const name = "svt_terminale_biosynthese_proteines_citations_equilibrees_drafts";
const query = readFileSync(resolve("supabase/migrations/20260820_svt_terminale_biosynthese_proteines_citations_equilibrees_drafts.sql"), "utf8");

writeFileSync(resolve("tmp/apply-svt-terminal-lot3-biosynthese-citations.json"), JSON.stringify({
  project_id: "nnshioowwniursnozicg",
  name,
  query,
}, null, 2));
