import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const sqlPath = resolve(root, "supabase/migrations/20260823_secure_bulk_content_publication.sql");
const outputPath = resolve(root, "supabase/migrations/20260823_secure_bulk_content_publication.apply.json");
const query = readFileSync(sqlPath, "utf8");
writeFileSync(outputPath, `${JSON.stringify({ project_id: "nnshioowwniursnozicg", name: "secure_bulk_content_publication", query }, null, 2)}\n`, "utf8");
console.log(outputPath);
