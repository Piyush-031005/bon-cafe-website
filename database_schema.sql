-- ================================================================
--  BON CAFÉ & SWEETS — SUPABASE DATABASE SCHEMA
--  Run this in the Supabase SQL Editor after creating your project.
--  URL: https://app.supabase.com -> Your Project -> SQL Editor
-- ================================================================

-- ── CONTACTS TABLE ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contacts (
  id          UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT    NOT NULL,
  phone       TEXT,
  email       TEXT,
  subject     TEXT    NOT NULL,
  message     TEXT    NOT NULL,
  read        BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ── BIRTHDAY BOOKINGS TABLE ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS birthday_bookings (
  id               UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  name             TEXT    NOT NULL,
  phone            TEXT    NOT NULL,
  email            TEXT,
  booking_date     DATE    NOT NULL,
  booking_time     TEXT    NOT NULL,
  guests           INTEGER NOT NULL DEFAULT 1,
  theme            TEXT    NOT NULL DEFAULT 'Classic',
  special_requests TEXT,
  status           TEXT    NOT NULL DEFAULT 'pending',  -- pending | confirmed | cancelled
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- ── ROOM BOOKINGS TABLE ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS room_bookings (
  id               UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  name             TEXT    NOT NULL,
  phone            TEXT    NOT NULL,
  email            TEXT,
  room_type        TEXT    NOT NULL,
  booking_date     DATE    NOT NULL,
  start_time       TEXT,
  end_time         TEXT,
  guests           INTEGER NOT NULL DEFAULT 1,
  occasion         TEXT,
  special_requests TEXT,
  status           TEXT    NOT NULL DEFAULT 'pending',  -- pending | confirmed | cancelled
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- ── ROW LEVEL SECURITY (RLS) ─────────────────────────────────────
-- Enable RLS on all tables
ALTER TABLE contacts          ENABLE ROW LEVEL SECURITY;
ALTER TABLE birthday_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_bookings     ENABLE ROW LEVEL SECURITY;

-- CONTACTS: allow anonymous INSERT (for contact form) + SELECT/UPDATE (for admin)
CREATE POLICY "anon_insert_contacts"
  ON contacts FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_select_contacts"
  ON contacts FOR SELECT TO anon USING (true);

CREATE POLICY "anon_update_contacts"
  ON contacts FOR UPDATE TO anon USING (true);

-- BIRTHDAY BOOKINGS: allow anonymous INSERT + SELECT/UPDATE (for admin)
CREATE POLICY "anon_insert_birthday"
  ON birthday_bookings FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_select_birthday"
  ON birthday_bookings FOR SELECT TO anon USING (true);

CREATE POLICY "anon_update_birthday"
  ON birthday_bookings FOR UPDATE TO anon USING (true);

-- ROOM BOOKINGS: allow anonymous INSERT + SELECT/UPDATE (for admin)
CREATE POLICY "anon_insert_rooms"
  ON room_bookings FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_select_rooms"
  ON room_bookings FOR SELECT TO anon USING (true);

CREATE POLICY "anon_update_rooms"
  ON room_bookings FOR UPDATE TO anon USING (true);

-- ── INDEXES FOR PERFORMANCE ───────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_contacts_created
  ON contacts (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_birthday_created
  ON birthday_bookings (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_room_created
  ON room_bookings (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_birthday_date
  ON birthday_bookings (booking_date);

CREATE INDEX IF NOT EXISTS idx_room_date
  ON room_bookings (booking_date);
