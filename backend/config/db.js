// config/db.js
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "..", "quiz.db");
const db = new Database(dbPath);

db.pragma("foreign_keys = ON");

const schema = fs.readFileSync(
  path.join(__dirname, "..", "database", "schema.sql"),
  "utf-8"
);
db.exec(schema);

export default db;