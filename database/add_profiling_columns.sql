-- Add profiling columns to kits table
-- Run this in your Supabase SQL editor

ALTER TABLE public.kits 
ADD COLUMN selected_options text, -- JSON stringified object of selected options from teaser steps
ADD COLUMN profiling_data text; -- JSON stringified object of profiling questions data
