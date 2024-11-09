import path from "path";
import Database from "better-sqlite3";

let db: Database.Database | null = null;

export function connectToDatabase(): Database.Database {
  if (db === null) {
    console.log("connectToDatabase", "ind");
    const dbPath = path.join(process.cwd(), "db_store/database.db");
    db = new Database(dbPath);
    // 创建表的示例（如果你需要）
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT  NOT NULL
      )
    `);

    console.log("Database connection established");
  } else {
    console.log("Database connection reused");
  }

  return db;
}
