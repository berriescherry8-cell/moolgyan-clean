-- RUN THIS IN SUPABASE SQL EDITOR (one block at a time)

-- 1. GOOGLE FORMS FIX (UNIQUE form_type)
DROP TABLE IF EXISTS google_forms;
CREATE TABLE google_forms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  form_type TEXT UNIQUE NOT NULL CHECK (form_type IN ('bookstore_order', 'faq', 'feedback', 'join_kgf', 'deeksha_aavedan')),
  url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE google_forms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read forms" ON google_forms FOR SELECT USING (true);
CREATE POLICY "Admin CRUD forms" ON google_forms FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
-- Seed your URLs
INSERT INTO google_forms (form_type, url) VALUES 
('bookstore_order', 'https://docs.google.com/spreadsheets/d/1lA2c6iX0r1x0HGJcnPDeDVNBLnU5UDbhpAv8ub7unU8/edit?usp=sharing'),
('deeksha_aavedan', 'https://docs.google.com/spreadsheets/d/10FjkQV7VA0xr1b71W9LkM9ovv2Lb0qRgWdpSrRmYR1M/edit?usp=sharing'),
('join_kgf', 'https://docs.google.com/spreadsheets/d/1FW72PWXZ78Ba0v7mW1RpB9TXwOwFQE-PMeCl8UihABs/edit?usp=sharing'),
('feedback', 'https://docs.google.com/spreadsheets/d/1Rnnw8Wqau2m2N06ReCeidIzE59a5rY1T1_gRTptA6jo/edit?usp=sharing'),
('faq', 'https://forms.gle/faq-example') ON CONFLICT (form_type) DO UPDATE SET url = EXCLUDED.url;

-- 2. BOOKS ENHANCE (add missing columns)
ALTER TABLE books ADD COLUMN IF NOT EXISTS stock_status TEXT DEFAULT 'in-stock' CHECK (stock_status IN ('in-stock', 'out-of-stock'));
ALTER TABLE books ADD COLUMN IF NOT EXISTS for_sale BOOLEAN DEFAULT true;
ALTER TABLE books ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'book' CHECK (type IN ('book', 'franchise_item'));
CREATE POLICY "Public read books" ON books FOR SELECT USING (true);
CREATE POLICY "Admin CRUD books" ON books FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
-- Seed franchise example
INSERT INTO books (title, author, price, cover_url, stock_status, type, for_sale) VALUES 
('Franchise Item Example', 'Admin', 25.00, 'https://via.placeholder.com/300x400', 'in-stock', 'franchise_item', true)
ON CONFLICT DO NOTHING;

-- END. Run both blocks. Confirm success then npm run dev works error-free.

