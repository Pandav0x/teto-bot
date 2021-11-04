CREATE TABLE IF NOT EXISTS general_info (key TEXT, value TEXT);
CREATE TABLE IF NOT EXISTS raids (raid_id INTEGER, date DATETIME, raid_json TEXT, announce_channel_id TEXT);
CREATE TABLE IF NOT EXISTS birthday (birthday_id INTEGER, date DATE, user_id TEXT, announce_chanel_id TEXT);