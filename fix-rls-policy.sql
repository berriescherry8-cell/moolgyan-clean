-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can insert orders" ON public.orders;

-- Create new policy that allows anonymous users to insert orders
CREATE POLICY "Users can insert orders" ON public.orders
FOR INSERT WITH CHECK (true);

-- Also allow users to view their own orders
CREATE POLICY "Users can view orders" ON public.orders
FOR SELECT USING (true);
