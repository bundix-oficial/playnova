-- =========================================================
-- FRIV DIGITAL — Cloudflare D1 Database Schema
-- Execute via: wrangler d1 execute friv-db --file=./schema.sql
-- =========================================================

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  nick TEXT UNIQUE NOT NULL COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  avatar_data TEXT,
  created_at INTEGER NOT NULL
);

-- Tabela de Scores do Slope
CREATE TABLE IF NOT EXISTS slope_scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  nick TEXT NOT NULL,
  avatar_data TEXT,
  score INTEGER NOT NULL,
  week_start INTEGER NOT NULL,
  submitted_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Índices para consultas ultra rápidas
CREATE INDEX IF NOT EXISTS idx_users_nick ON users(nick);
CREATE INDEX IF NOT EXISTS idx_scores_week ON slope_scores(week_start, score DESC);
CREATE INDEX IF NOT EXISTS idx_scores_user_week ON slope_scores(user_id, week_start);
