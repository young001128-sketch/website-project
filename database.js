const { mkdirSync } = require("node:fs");
const { dirname, join } = require("node:path");
const { Database, DatabaseSync } = require("node:sqlite");

const databasePath = process.env.DB_PATH || join(__dirname, ".data", "trips.sqlite");
if (databasePath !== ":memory:") {
  mkdirSync(dirname(databasePath), { recursive: true });
}

const db = new (Database ?? DatabaseSync)(databasePath, { timeout: 5000 });
db.exec(`
  CREATE TABLE IF NOT EXISTS trips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    destination TEXT NOT NULL,
    startDate TEXT NOT NULL,
    endDate TEXT NOT NULL
  ) STRICT
`);

module.exports = db;
