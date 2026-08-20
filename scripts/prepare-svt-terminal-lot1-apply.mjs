import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const migrationPath = resolve(
  "supabase/migrations/20260820_svt_terminale_reactions_cerebrale_origine_vie_drafts.sql",
);
const outputPath = resolve("tmp/apply-svt-terminal-lot1.json");

writeFileSync(
  outputPath,
  JSON.stringify(
    {
      name: "20260820_svt_terminale_reactions_cerebrale_origine_vie_drafts",
      project_id: "nnshioowwniursnozicg",
      query: readFileSync(migrationPath, "utf8"),
    },
    null,
    2,
  ),
);

console.log(outputPath);
