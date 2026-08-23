import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const query = readFileSync(resolve(root, "supabase/migrations/20260823_harden_bulk_content_publication_search_path.sql"), "utf8");
const output = resolve(root, "supabase/migrations/20260823_harden_bulk_content_publication_search_path.apply.json");
writeFileSync(output, `${JSON.stringify({ project_id: "nnshioowwniursnozicg", name: "harden_bulk_content_publication_search_path", query }, null, 2)}\n`, "utf8");
console.log(output);
