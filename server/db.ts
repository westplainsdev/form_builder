import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

sqlite3.verbose();

export async function openDb(): Promise<Database> {
  return open({
    filename: './form_builder.sqlite',
    driver: sqlite3.Database
  });
}

export async function migrate() {
  const db = await openDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS form_schemas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      schema_json TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}
