-- New tables intentionally do not import unverified legacy local scores.
CREATE TABLE IF NOT EXISTS playnova_users_v2 (
  id TEXT PRIMARY KEY, nick TEXT NOT NULL, nick_key TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL, salt TEXT NOT NULL, avatar_data TEXT, created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS playnova_sessions_v2 (
  token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES playnova_users_v2(id), expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS playnova_sessions_expiry ON playnova_sessions_v2(expires_at);
CREATE TABLE IF NOT EXISTS playnova_scores_v2 (
  user_id TEXT NOT NULL REFERENCES playnova_users_v2(id), week_start INTEGER NOT NULL,
  score INTEGER NOT NULL CHECK(score BETWEEN 1 AND 3000), submitted_at INTEGER NOT NULL,
  PRIMARY KEY(user_id,week_start)
);
CREATE INDEX IF NOT EXISTS playnova_weekly_scores ON playnova_scores_v2(week_start,score DESC);
CREATE TABLE IF NOT EXISTS playnova_runs_v2 (
  id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES playnova_users_v2(id), started_at INTEGER NOT NULL, used INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS playnova_recent_runs ON playnova_runs_v2(user_id,started_at);
CREATE TABLE IF NOT EXISTS playnova_auth_limits_v2 (
  bucket TEXT PRIMARY KEY, attempts INTEGER NOT NULL, expires_at INTEGER NOT NULL
);
