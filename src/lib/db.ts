import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Get database path
const getDbPath = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  return path.join(dataDir, 'maianhdao.db');
};

// Lazy initialization to avoid build-time issues
let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (_db) return _db;

  const dbPath = getDbPath();
  _db = new Database(dbPath);
  _db.pragma('journal_mode = WAL');

  // Initialize database schema
  _db.exec(`
    -- Trees (Cây Mai Anh Đào)
    CREATE TABLE IF NOT EXISTS trees (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      zone TEXT,
      lat REAL,
      lng REAL,
      status TEXT DEFAULT 'available',
      images TEXT DEFAULT '[]',
      donor_id TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Donations (Đóng góp)
    CREATE TABLE IF NOT EXISTS donations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      amount REAL,
      logo_url TEXT,
      message TEXT,
      is_organization INTEGER DEFAULT 0,
      status TEXT DEFAULT 'pending',
      payment_ref TEXT,
      tree_id TEXT,
      tier TEXT,
      display_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      approved_at TEXT,
      FOREIGN KEY (tree_id) REFERENCES trees(id)
    );

    -- Sponsors (Đơn vị đồng hành)
    CREATE TABLE IF NOT EXISTS sponsors (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      logo_url TEXT,
      website TEXT,
      tier TEXT DEFAULT 'silver',
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Settings (Cấu hình)
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Admin Users
    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'editor',
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_trees_code ON trees(code);
    CREATE INDEX IF NOT EXISTS idx_trees_status ON trees(status);
    CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
    CREATE INDEX IF NOT EXISTS idx_sponsors_tier ON sponsors(tier);
  `);

  // Insert default settings if not exists
  const defaultSettings = [
    ['bankName', 'Vietcombank'],
    ['accountNumber', '0123456789'],
    ['accountHolder', 'Quỹ Mai Anh Đào Đà Lạt'],
    ['targetAmount', '500000000'],
    ['campaignStart', '2026-01-05'],
    ['campaignEnd', '2026-01-15'],
    ['heroTitle', 'Để Lại Dấu Ấn Tại Trái Tim Đà Lạt'],
    ['heroSubtitle', 'Xã hội hóa cảnh quan & Gây quỹ cộng đồng - Đảo Mai Anh Đào'],
  ];

  const insertSetting = _db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
  for (const [key, value] of defaultSettings) {
    insertSetting.run(key, value);
  }

  // Check if admin exists, if not create default
  const adminExists = _db.prepare('SELECT COUNT(*) as count FROM admin_users').get() as { count: number };
  if (adminExists.count === 0) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const bcrypt = require('bcryptjs');
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    _db.prepare('INSERT INTO admin_users (id, username, password) VALUES (?, ?, ?)').run(
      `admin-${Date.now()}`,
      'admin',
      hashedPassword
    );
  }

  return _db;
}

// Export the database getter
const db = new Proxy({} as Database.Database, {
  get: (_, prop) => {
    const database = getDb();
    const value = (database as unknown as Record<string, unknown>)[prop as string];
    if (typeof value === 'function') {
      return value.bind(database);
    }
    return value;
  },
});

export default db;

// Helper functions
export function getAllSettings(): Record<string, string> {
  const database = getDb();
  const rows = database.prepare('SELECT key, value FROM settings').all() as { key: string; value: string }[];
  const settings: Record<string, string> = {};
  for (const row of rows) {
    settings[row.key] = row.value;
  }
  return settings;
}

export function getSetting(key: string): string | null {
  const database = getDb();
  const row = database.prepare('SELECT value FROM settings WHERE key = ?').get(key) as { value: string } | undefined;
  return row?.value || null;
}

export function setSetting(key: string, value: string): void {
  const database = getDb();
  database.prepare('INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)').run(key, value);
}
