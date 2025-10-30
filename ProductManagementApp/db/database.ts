import * as SQLite from 'expo-sqlite';

const DB_NAME = 'catalog.db';
let db: SQLite.SQLiteDatabase | null = null;

export async function getDb() {
    if (!db) {
        db = await SQLite.openDatabaseAsync(DB_NAME);
        await db.execAsync('PRAGMA foreign_keys = ON;');
    }
    return db;
}

export async function initDatabase() {
    const database = await getDb();

    await database.execAsync(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      remote_id TEXT,
      updated_at TEXT
    );
  `);

    await database.execAsync(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL CHECK(price > 0),
      unit TEXT NOT NULL,
      description TEXT,
      image_uri TEXT,
      category_id INTEGER NOT NULL,
      remote_id TEXT,
      updated_at TEXT,
      is_deleted INTEGER DEFAULT 0,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    );
  `);

    await database.execAsync(`
    CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);

    const seeded = await database.getFirstAsync<{ value: string }>('SELECT value FROM meta WHERE key = ?', ['seeded']);

    if (!seeded) {
        await seedInitialData(database);
        await database.runAsync(`INSERT INTO meta (key, value) VALUES (?, ?)`, ['seeded', '1']);
    }
}

async function seedInitialData(database: SQLite.SQLiteDatabase) {
    const now = new Date().toISOString();
    const categories = ['Electronics', 'Clothing', 'Home'];

    for (const name of categories) {
        const res = await database.runAsync(`INSERT INTO categories (name, updated_at) VALUES (?, ?)`, [name, now]);

        const categoryId = res.lastInsertRowId!;

        for (let i = 1; i <= 3; i++) {
            const pname = `${name} Sample ${i}`;
            const price = (i * 10 + Math.random()).toFixed(2);
            const unit = 'pcs';
            const description = `This is a sample description for ${pname}.`;
            const image_uri = `https://api.dicebear.com/7.x/avataaars/png?seed=${name}${i}`;

            await database.runAsync(
                `
                INSERT INTO products (name, price, unit, description, image_uri, category_id, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                `,
                [pname, price, unit, description, image_uri, categoryId, now],
            );
        }
    }
}
