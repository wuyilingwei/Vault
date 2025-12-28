CREATE TABLE IF NOT EXISTS aethervault_items (
  module TEXT,
  key TEXT,
  value TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  separator TEXT,
  PRIMARY KEY (module, key)
);
