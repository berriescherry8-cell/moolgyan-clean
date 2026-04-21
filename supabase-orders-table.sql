-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id BIGINT REFERENCES books(id) ON DELETE CASCADE,
  book_title TEXT NOT NULL,
  book_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity >= 10 AND quantity <= 2000),
  full_name TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  address TEXT NOT NULL,
  pin_code TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_screenshot_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies for orders table
-- Allow authenticated users to insert orders
CREATE POLICY "Users can insert orders" ON orders
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to view their own orders
CREATE POLICY "Users can view own orders" ON orders
FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to update their own orders
CREATE POLICY "Users can update own orders" ON orders
FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete their own orders
CREATE POLICY "Users can delete own orders" ON orders
FOR DELETE USING (auth.role() = 'authenticated');

-- Allow admins to view all orders
CREATE POLICY "Admins can view all orders" ON orders
FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Allow admins to update any order
CREATE POLICY "Admins can update any order" ON orders
FOR UPDATE TO authenticated USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Allow admins to delete any order
CREATE POLICY "Admins can delete any order" ON orders
FOR DELETE TO authenticated USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_orders_book_id ON orders(book_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);