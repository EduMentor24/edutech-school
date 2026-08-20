import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const query = readFileSync(
  resolve(projectRoot, "supabase/migrations/20260820_mathematiques_primitives_statistiques_nombres_complexes_drafts.sql"),
  "utf8",
);

writeFileSync(
  resolve(projectRoot, "tmp/primitives-statistics-complexes-migration-request.json"),
  JSON.stringify({
    project_id: "nnshioowwniursnozicg",
    name: "mathematiques_primitives_statistiques_nombres_complexes_drafts",
    query,
  }),
);
