-- Fix RLS policies for all admin-managed tables
-- Run this in Supabase SQL Editor

-- ============================================
-- NEWS_ITEMS
-- ============================================
ALTER TABLE news_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated read news" ON news_items;
DROP POLICY IF EXISTS "Allow authenticated insert news" ON news_items;
DROP POLICY IF EXISTS "Allow authenticated update news" ON news_items;
DROP POLICY IF EXISTS "Allow authenticated delete news" ON news_items;

CREATE POLICY "Allow authenticated read news"
  ON news_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated insert news"
  ON news_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update news"
  ON news_items FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete news"
  ON news_items FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- SATGURU_BHAJAN
-- ============================================
ALTER TABLE satguru_bhajan ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated read bhajans" ON satguru_bhajan;
DROP POLICY IF EXISTS "Allow authenticated insert bhajans" ON satguru_bhajan;
DROP POLICY IF EXISTS "Allow authenticated update bhajans" ON satguru_bhajan;
DROP POLICY IF EXISTS "Allow authenticated delete bhajans" ON satguru_bhajan;

CREATE POLICY "Allow authenticated read bhajans"
  ON satguru_bhajan FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated insert bhajans"
  ON satguru_bhajan FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update bhajans"
  ON satguru_bhajan FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete bhajans"
  ON satguru_bhajan FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- WISDOM_QUOTES
-- ============================================
ALTER TABLE wisdom_quotes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated read quotes" ON wisdom_quotes;
DROP POLICY IF EXISTS "Allow authenticated insert quotes" ON wisdom_quotes;
DROP POLICY IF EXISTS "Allow authenticated update quotes" ON wisdom_quotes;
DROP POLICY IF EXISTS "Allow authenticated delete quotes" ON wisdom_quotes;

CREATE POLICY "Allow authenticated read quotes"
  ON wisdom_quotes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated insert quotes"
  ON wisdom_quotes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update quotes"
  ON wisdom_quotes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete quotes"
  ON wisdom_quotes FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- LIVE_SATSANGS
-- ============================================
ALTER TABLE live_satsangs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated read satsangs" ON live_satsangs;
DROP POLICY IF EXISTS "Allow authenticated insert satsangs" ON live_satsangs;
DROP POLICY IF EXISTS "Allow authenticated update satsangs" ON live_satsangs;
DROP POLICY IF EXISTS "Allow authenticated delete satsangs" ON live_satsangs;

CREATE POLICY "Allow authenticated read satsangs"
  ON live_satsangs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated insert satsangs"
  ON live_satsangs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update satsangs"
  ON live_satsangs FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete satsangs"
  ON live_satsangs FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- GOOGLE_FORMS
-- ============================================
ALTER TABLE google_forms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated read forms" ON google_forms;
DROP POLICY IF EXISTS "Allow authenticated insert forms" ON google_forms;
DROP POLICY IF EXISTS "Allow authenticated update forms" ON google_forms;
DROP POLICY IF EXISTS "Allow authenticated delete forms" ON google_forms;

CREATE POLICY "Allow authenticated read forms"
  ON google_forms FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated insert forms"
  ON google_forms FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update forms"
  ON google_forms FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete forms"
  ON google_forms FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- PHOTOS
-- ============================================
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated read photos" ON photos;
DROP POLICY IF EXISTS "Allow authenticated insert photos" ON photos;
DROP POLICY IF EXISTS "Allow authenticated update photos" ON photos;
DROP POLICY IF EXISTS "Allow authenticated delete photos" ON photos;

CREATE POLICY "Allow authenticated read photos"
  ON photos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated insert photos"
  ON photos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update photos"
  ON photos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete photos"
  ON photos FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- BOOKS
-- ============================================
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated read books" ON books;
DROP POLICY IF EXISTS "Allow authenticated insert books" ON books;
DROP POLICY IF EXISTS "Allow authenticated update books" ON books;
DROP POLICY IF EXISTS "Allow authenticated delete books" ON books;

CREATE POLICY "Allow authenticated read books"
  ON books FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated insert books"
  ON books FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update books"
  ON books FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete books"
  ON books FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- ORDERS
-- ============================================
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated read orders" ON orders;
DROP POLICY IF EXISTS "Allow authenticated insert orders" ON orders;
DROP POLICY IF EXISTS "Allow authenticated update orders" ON orders;
DROP POLICY IF EXISTS "Allow authenticated delete orders" ON orders;

CREATE POLICY "Allow authenticated read orders"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated insert orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete orders"
  ON orders FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- ANON (public) READ policies for frontend pages
-- These allow non-logged-in users to view content
-- ============================================

-- News (public read)
DROP POLICY IF EXISTS "Allow anon read news" ON news_items;
CREATE POLICY "Allow anon read news"
  ON news_items FOR SELECT
  TO anon
  USING (true);

-- Satguru Bhajan (public read)
DROP POLICY IF EXISTS "Allow anon read bhajans" ON satguru_bhajan;
CREATE POLICY "Allow anon read bhajans"
  ON satguru_bhajan FOR SELECT
  TO anon
  USING (true);

-- Wisdom Quotes (public read)
DROP POLICY IF EXISTS "Allow anon read quotes" ON wisdom_quotes;
CREATE POLICY "Allow anon read quotes"
  ON wisdom_quotes FOR SELECT
  TO anon
  USING (true);

-- Live Satsangs (public read)
DROP POLICY IF EXISTS "Allow anon read satsangs" ON live_satsangs;
CREATE POLICY "Allow anon read satsangs"
  ON live_satsangs FOR SELECT
  TO anon
  USING (true);

-- Google Forms (public read)
DROP POLICY IF EXISTS "Allow anon read forms" ON google_forms;
CREATE POLICY "Allow anon read forms"
  ON google_forms FOR SELECT
  TO anon
  USING (true);

-- Photos (public read)
DROP POLICY IF EXISTS "Allow anon read photos" ON photos;
CREATE POLICY "Allow anon read photos"
  ON photos FOR SELECT
  TO anon
  USING (true);

-- Books (public read)
DROP POLICY IF EXISTS "Allow anon read books" ON books;
CREATE POLICY "Allow anon read books"
  ON books FOR SELECT
  TO anon
  USING (true);

