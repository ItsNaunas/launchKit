-- Make user_id nullable in orders table to allow anonymous orders
-- Run this in your Supabase SQL Editor

-- First, drop the existing foreign key constraint
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;

-- Make user_id nullable
ALTER TABLE public.orders ALTER COLUMN user_id DROP NOT NULL;

-- Re-add the foreign key constraint (now nullable)
ALTER TABLE public.orders 
ADD CONSTRAINT orders_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Update RLS policies to handle nullable user_id
DROP POLICY IF EXISTS "Orders are viewable by owner" ON public.orders;
CREATE POLICY "Orders are viewable by owner or anonymous" ON public.orders
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Update kits RLS policies
DROP POLICY IF EXISTS "Kits are viewable by owner" ON public.kits;
CREATE POLICY "Kits are viewable by owner or anonymous" ON public.kits
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can insert their own kits" ON public.kits;
CREATE POLICY "Users can insert their own kits or anonymous kits" ON public.kits
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can update their own kits" ON public.kits;
CREATE POLICY "Users can update their own kits or anonymous kits" ON public.kits
  FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

-- Update outputs RLS policies
DROP POLICY IF EXISTS "Outputs are viewable by kit owner" ON public.outputs;
CREATE POLICY "Outputs are viewable by kit owner or anonymous" ON public.outputs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.kits
      WHERE kits.id = outputs.kit_id
      AND (kits.user_id = auth.uid() OR kits.user_id IS NULL)
    )
  );
