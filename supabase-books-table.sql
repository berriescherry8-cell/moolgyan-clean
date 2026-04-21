-- Supabase Books Table Structure
-- Run this SQL in your Supabase SQL Editor to create the books table

CREATE TABLE books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  description TEXT,
  cover_url TEXT NOT NULL,
  pdf_url TEXT,
  stock_status TEXT CHECK (stock_status IN ('in-stock', 'out-of-stock', 'read-only')) DEFAULT 'in-stock',
  category TEXT,
  alt_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX idx_books_created_at ON books(created_at);
CREATE INDEX idx_books_stock_status ON books(stock_status);
CREATE INDEX idx_books_title ON books(title);

-- Enable Row Level Security (RLS)
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access" ON books
FOR SELECT
USING (true);

-- Create policy for authenticated users to insert
CREATE POLICY "Allow authenticated insert" ON books
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Create policy for authenticated users to update
CREATE POLICY "Allow authenticated update" ON books
FOR UPDATE
USING (auth.role() = 'authenticated');

-- Create policy for authenticated users to delete
CREATE POLICY "Allow authenticated delete" ON books
FOR DELETE
USING (auth.role() = 'authenticated');

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_books_updated_at 
BEFORE UPDATE ON books 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional)
INSERT INTO books (title, author, price, description, cover_url, pdf_url, stock_status, category) VALUES
('विदेही ज्ञान', 'श्री नितिनदास जी साहिब', 12.00, 'विदेही ज्ञान की खोज और आध्यात्मिक मार्ग', 'https://raw.githubusercontent.com/berriescherry8-cell/mool-gyan-assets/main/covers/videhi-gyan.jpeg', 'https://raw.githubusercontent.com/berriescherry8-cell/mool-gyan-assets/main/pdfs/%E0%A4%9C%E0%A5%8D%E0%A4%9E%E0%A4%BE%E0%A4%A8%20%E0%A4%B5%E0%A4%BF%E0%A4%B5%E0%A5%87%E0%A4%A6%E0%A5%80%20pdf.pdf', 'in-stock', 'spiritual'),
('संतों का सार सन्देश', 'श्री नितिनदास जी साहिब', 10.00, 'संतों के अनमोल वचनों का सार', 'https://raw.githubusercontent.com/berriescherry8-cell/mool-gyan-assets/main/covers/snato-ka.jpeg', 'https://raw.githubusercontent.com/berriescherry8-cell/mool-gyan-assets/main/pdfs/2025_12_08%209_20%20am%20Office%20Lens_compressed%20(1).pdf', 'in-stock', 'spiritual'),
('हर हर गीता 4th संस्करण', 'श्री नितिनदास जी साहिब', 6.50, 'हर हर गीता घर घर गीता – 4th Edition', 'https://raw.githubusercontent.com/berriescherry8-cell/mool-gyan-assets/main/covers/har-geeta%204rth.jpeg', NULL, 'in-stock', 'spiritual'),
('सत्यनाम', 'श्री नितिनदास जी साहिब', 0.00, 'सत्यनाम – केवल पठन हेतु', 'https://raw.githubusercontent.com/berriescherry8-cell/mool-gyan-assets/main/covers/satya-nam.jpg', 'https://raw.githubusercontent.com/berriescherry8-cell/mool-gyan-assets/main/pdfs/2025_12_08%209_20%20am%20Office%20Lens_compressed%20(1).pdf', 'read-only', 'spiritual');