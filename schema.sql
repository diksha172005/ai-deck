-- ============================================================
--  AI-Deck  ·  PostgreSQL Schema
--  Run this in your Supabase SQL Editor (or any Postgres client)
-- ============================================================

-- Users
CREATE TABLE IF NOT EXISTS users (
    id            BIGSERIAL PRIMARY KEY,
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255)        NOT NULL,
    name          VARCHAR(100)        NOT NULL,
    role          VARCHAR(20)         NOT NULL DEFAULT 'USER'
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
    id   BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(10)
);

-- Tools
CREATE TABLE IF NOT EXISTS tools (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(200)  NOT NULL,
    description TEXT,
    link        VARCHAR(500)  NOT NULL,
    logo_url    VARCHAR(100),
    category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    featured    BOOLEAN NOT NULL DEFAULT FALSE
);

-- Tool Tags (collection table)
CREATE TABLE IF NOT EXISTS tool_tags (
    tool_id BIGINT NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
    tag     VARCHAR(100) NOT NULL,
    PRIMARY KEY (tool_id, tag)
);

-- Favorites (join table)
CREATE TABLE IF NOT EXISTS favorites (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tool_id BIGINT NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, tool_id)
);

-- ── Indexes ────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_tool ON favorites(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_tags_tag  ON tool_tags(tag);

-- ── Seed Data (optional – Spring DataSeeder handles this) ──
-- The Spring Boot DataSeeder will auto-populate on first run.
-- To manually seed, uncomment below:

/*
INSERT INTO categories (name, icon) VALUES
  ('Chatbot',          '💬'),
  ('Image Generation', '🎨'),
  ('Coding',           '💻'),
  ('Video',            '🎬'),
  ('Productivity',     '⚡'),
  ('Writing',          '✍️'),
  ('Audio',            '🎵')
ON CONFLICT (name) DO NOTHING;
*/
