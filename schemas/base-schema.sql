CREATE TABLE IF NOT EXISTS general_info (id INTEGER PRIMARY KEY NOT NULL, info_key TEXT, info_value TEXT);
CREATE TABLE IF NOT EXISTS command (id INTEGER PRIMARY KEY NOT NULL, command TEXT, teto_message_id INTEGER, user_id INTEGER, user_message_id INTEGER, teto_message_content TEXT); -- TODO - remove this ?
CREATE TABLE IF NOT EXISTS scheduled_message (id INTEGER PRIMARY KEY NOT NULL, server_id INTEGER, channel_id INTEGER, scheduled_at DATE, message TEXT)
