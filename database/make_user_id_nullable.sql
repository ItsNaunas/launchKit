-- Make user_id nullable in kits table to allow anonymous kit creation
-- Run this in your Supabase SQL Editor

-- First, drop the existing foreign key constraint
ALTER TABLE public.kits DROP CONSTRAINT IF EXISTS kits_user_id_fkey;

-- Make user_id nullable
ALTER TABLE public.kits ALTER COLUMN user_id DROP NOT NULL;

-- Re-add the foreign key constraint (now nullable)
ALTER TABLE public.kits 
ADD CONSTRAINT kits_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
