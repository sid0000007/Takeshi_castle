// Runs the SQL migration file that creates the initial database schema.
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { db } from "../config/db.js";

export async function runMigrations() {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const migrationPath = path.join(currentDir, "migrations", "001_initial.sql");
  const sql = await readFile(migrationPath, "utf8");

  await db.query(sql);
}
