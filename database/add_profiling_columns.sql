-- Add missing profiling columns to existing kits table
-- Run this in your Supabase SQL editor

-- Add the missing columns to the kits table
ALTER TABLE public.kits 
ADD COLUMN IF NOT EXISTS selected_options text,
ADD COLUMN IF NOT EXISTS profiling_data text;

-- Add comments for documentation
COMMENT ON COLUMN public.kits.selected_options IS 'JSON stringified object of selected options from profiling flow';
COMMENT ON COLUMN public.kits.profiling_data IS 'JSON stringified object of profiling data from progressive profiling';