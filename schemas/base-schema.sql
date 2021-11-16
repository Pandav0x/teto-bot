CREATE TABLE IF NOT EXISTS general_info (id INTEGER PRIMARY KEY NOT NULL, info_key TEXT, info_value TEXT);
CREATE TABLE IF NOT EXISTS command (id INTEGER PRIMARY KEY NOT NULL, command TEXT, teto_message_id INTEGER, user_id INTEGER, user_message_id INTEGER, teto_message_content TEXT, time INTEGER NOT NULL DEFAULT (strftime('%s','now')));
