-- AI Sports Tracker - Supabase Schema
-- Run this SQL in your Supabase SQL Editor to create the tables

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  avatar TEXT,
  weekly_message TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Sports categories table
CREATE TABLE IF NOT EXISTS sports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Records table
CREATE TABLE IF NOT EXISTS records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sport_id UUID REFERENCES sports(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  date TEXT NOT NULL,
  timestamp BIGINT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_sports_user_id ON sports(user_id);
CREATE INDEX IF NOT EXISTS idx_records_sport_id ON records(sport_id);
CREATE INDEX IF NOT EXISTS idx_records_user_id ON records(user_id);
CREATE INDEX IF NOT EXISTS idx_records_timestamp ON records(timestamp DESC);

-- Enable Row Level Security (optional, can be configured later)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE records ENABLE ROW LEVEL SECURITY;

-- Permissive policies for now (allow all operations)
-- You should tighten these for production
CREATE POLICY "Allow all on users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on sports" ON sports FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on records" ON records FOR ALL USING (true) WITH CHECK (true);
