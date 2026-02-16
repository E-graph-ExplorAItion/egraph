import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'egraph.db');
const db = new Database(dbPath);

// Initialize database schema
export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      subject TEXT,
      external_thread_id TEXT UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      email_count INT,
      last_email_date DATETIME
    );

    CREATE TABLE IF NOT EXISTS emails (
      id TEXT PRIMARY KEY,
      conversation_id TEXT,
      sender_email TEXT,
      sender_name TEXT,
      subject TEXT,
      body TEXT,
      sent_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      recipient_email TEXT,
      recipient_name TEXT,
      direction TEXT,
      FOREIGN KEY (conversation_id) REFERENCES conversations (id) ON DELETE CASCADE ON UPDATE CASCADE
    );

    CREATE TABLE IF NOT EXISTS graph_nodes (
      id TEXT PRIMARY KEY,
      conversation_id TEXT,
      node_type TEXT,
      label TEXT,
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (conversation_id) REFERENCES conversations (id) ON DELETE CASCADE ON UPDATE CASCADE
    );

    CREATE TABLE IF NOT EXISTS graph_edges (
      id TEXT PRIMARY KEY,
      from_node TEXT,
      to_node TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      label TEXT,
      FOREIGN KEY (to_node) REFERENCES graph_nodes (id) ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY (from_node) REFERENCES graph_nodes (id) ON DELETE CASCADE ON UPDATE CASCADE
    );

    CREATE TABLE IF NOT EXISTS mailboxes (
      id TEXT PRIMARY KEY,
      email_address TEXT NOT NULL UNIQUE,
      imap_host TEXT NOT NULL,
      imap_port TEXT NOT NULL,
      is_active BOOLEAN DEFAULT 1,
      last_synced_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      use_tls BOOLEAN,
      imap_password VARCHAR(250)
    );
  `);
}

// Helper to get raw DB instance
export default db;

// Run initialization
try {
  initDb();
} catch (error) {
  console.error("Database initialization failed:", error);
}
