/*
# DataBijak AI Schema

This migration creates the database tables for the DataBijak AI SaaS platform
- an automated AI Data Scientist & CMO tool for Malaysian MSMEs.

1. New Tables
- `projects` — Stores uploaded data files with metadata and health status.
  - `id` (uuid, primary key)
  - `name` (text, file name)
  - `file_type` (text, e.g., csv, xlsx)
  - `records_count` (integer, number of rows processed)
  - `health_status` (text: good, warning, critical)
  - `created_at` (timestamptz)

- `chat_messages` — Stores user / AI CMO conversation.
  - `id` (uuid, primary key)
  - `role` (text, user or assistant)
  - `content` (text)
  - `created_at` (timestamptz)

- `customer_segments` — Stores generated segment data for display.
  - `id` (uuid, primary key)
  - `segment_name` (text, e.g., Bintang Lama)
  - `percentage` (integer)
  - `customer_count` (integer)
  - `avg_recency` (integer)
  - `avg_frequency` (integer)
  - `avg_monetary` (integer)
  - `created_at` (timestamptz)

2. Security
- Enable RLS on all three tables.
- Allow public anon + authenticated CRUD since the app is single-tenant (no sign-in).
*/

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  file_type text NOT NULL,
  records_count integer NOT NULL DEFAULT 0,
  health_status text NOT NULL DEFAULT 'good',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS customer_segments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  segment_name text NOT NULL,
  percentage integer NOT NULL,
  customer_count integer NOT NULL,
  avg_recency integer NOT NULL,
  avg_frequency integer NOT NULL,
  avg_monetary integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_segments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_projects" ON projects;
CREATE POLICY "anon_select_projects" ON projects FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_projects" ON projects;
CREATE POLICY "anon_insert_projects" ON projects FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_projects" ON projects;
CREATE POLICY "anon_update_projects" ON projects FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_projects" ON projects;
CREATE POLICY "anon_delete_projects" ON projects FOR DELETE
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_chat_messages" ON chat_messages;
CREATE POLICY "anon_select_chat_messages" ON chat_messages FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_chat_messages" ON chat_messages;
CREATE POLICY "anon_insert_chat_messages" ON chat_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_chat_messages" ON chat_messages;
CREATE POLICY "anon_update_chat_messages" ON chat_messages FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_chat_messages" ON chat_messages;
CREATE POLICY "anon_delete_chat_messages" ON chat_messages FOR DELETE
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_customer_segments" ON customer_segments;
CREATE POLICY "anon_select_customer_segments" ON customer_segments FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_customer_segments" ON customer_segments;
CREATE POLICY "anon_insert_customer_segments" ON customer_segments FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_customer_segments" ON customer_segments;
CREATE POLICY "anon_update_customer_segments" ON customer_segments FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_customer_segments" ON customer_segments;
CREATE POLICY "anon_delete_customer_segments" ON customer_segments FOR DELETE
  TO anon, authenticated USING (true);
