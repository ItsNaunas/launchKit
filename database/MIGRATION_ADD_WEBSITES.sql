-- ========================================
-- LaunchKit AI - Website Builder Migration
-- ========================================
-- Copy this entire file and run in Supabase SQL Editor
-- This adds website template support to your existing database

-- Step 1: Update outputs table to support website type
-- Drop existing constraint and add new one with 'website' type
ALTER TABLE public.outputs DROP CONSTRAINT IF EXISTS outputs_type_check;
ALTER TABLE public.outputs ADD CONSTRAINT outputs_type_check 
  CHECK (type = ANY (ARRAY['business_case'::text, 'content_strategy'::text, 'website'::text]));

-- Step 2: Create websites table
CREATE TABLE IF NOT EXISTS public.websites (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  kit_id uuid NOT NULL,
  template_id text NOT NULL,
  template_source text,
  html_content text NOT NULL,
  css_content text,
  config jsonb DEFAULT '{}'::jsonb,
  sections jsonb DEFAULT '[]'::jsonb,
  deployed_url text,
  deploy_provider text,
  is_published boolean DEFAULT false,
  version integer DEFAULT 1,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT websites_pkey PRIMARY KEY (id),
  CONSTRAINT websites_kit_id_fkey FOREIGN KEY (kit_id) REFERENCES public.kits(id) ON DELETE CASCADE
);

-- Step 3: Enable Row Level Security
ALTER TABLE public.websites ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS Policies for websites table
-- Policy 1: Users can view their own websites or anonymous websites
CREATE POLICY "Websites are viewable by kit owner or anonymous" 
ON public.websites
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.kits
    WHERE kits.id = websites.kit_id
    AND (kits.user_id = auth.uid() OR kits.user_id IS NULL)
  )
);

-- Policy 2: Users can insert websites for their kits or anonymous kits
CREATE POLICY "Users can insert websites for their kits or anonymous kits" 
ON public.websites
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM public.kits
    WHERE kits.id = websites.kit_id
    AND (kits.user_id = auth.uid() OR kits.user_id IS NULL)
  )
);

-- Policy 3: Users can update their own websites or anonymous websites
CREATE POLICY "Users can update their websites or anonymous websites" 
ON public.websites
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 
    FROM public.kits
    WHERE kits.id = websites.kit_id
    AND (kits.user_id = auth.uid() OR kits.user_id IS NULL)
  )
);

-- Policy 4: Users can delete their own websites
CREATE POLICY "Users can delete their websites" 
ON public.websites
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 
    FROM public.kits
    WHERE kits.id = websites.kit_id
    AND (kits.user_id = auth.uid() OR kits.user_id IS NULL)
  )
);

-- Step 5: Create trigger for updated_at timestamp
-- This reuses the existing handle_updated_at() function
CREATE TRIGGER on_websites_updated
  BEFORE UPDATE ON public.websites
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_updated_at();

-- Step 6: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_websites_kit_id ON public.websites(kit_id);
CREATE INDEX IF NOT EXISTS idx_websites_template_id ON public.websites(template_id);
CREATE INDEX IF NOT EXISTS idx_websites_is_published ON public.websites(is_published);

-- ========================================
-- Migration Complete! ✅
-- ========================================
-- You should see: "Success. No rows returned"
-- 
-- Next steps:
-- 1. Refresh your browser
-- 2. Go to your dashboard
-- 3. Click "Create Website"
-- 4. Choose a template and generate!
-- ========================================

