CREATE TABLE IF NOT EXISTS vault_items (
  module TEXT,
  key TEXT,
  value TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  separator TEXT,
  PRIMARY KEY (module, key)
);
