-- Add tab_completions table to track which tabs are complete per kit
-- Run this migration after the main schema

-- Create tab_completions table
CREATE TABLE IF NOT EXISTS public.tab_completions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  kit_id UUID REFERENCES public.kits(id) ON DELETE CASCADE NOT NULL,
  tab_key TEXT CHECK (tab_key IN ('business_case', 'content_strategy', 'website')) NOT NULL,
  is_complete BOOLEAN DEFAULT FALSE NOT NULL,
  chosen_output_id UUID REFERENCES public.outputs(id) ON DELETE SET NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Ensure only one completion record per kit+tab
  UNIQUE(kit_id, tab_key)
);

-- Add RLS policies
ALTER TABLE public.tab_completions ENABLE ROW LEVEL SECURITY;

-- Users can view completion status for their own kits or anonymous kits
CREATE POLICY "Tab completions are viewable by kit owner or anonymous" ON public.tab_completions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.kits
      WHERE kits.id = tab_completions.kit_id
      AND (kits.user_id = auth.uid() OR kits.user_id IS NULL)
    )
  );

-- Users can insert completion records for their own kits or anonymous kits
CREATE POLICY "Users can insert tab completions for their kits" ON public.tab_completions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.kits
      WHERE kits.id = tab_completions.kit_id
      AND (kits.user_id = auth.uid() OR kits.user_id IS NULL)
    )
  );

-- Users can update completion records for their own kits or anonymous kits
CREATE POLICY "Users can update tab completions for their kits" ON public.tab_completions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.kits
      WHERE kits.id = tab_completions.kit_id
      AND (kits.user_id = auth.uid() OR kits.user_id IS NULL)
    )
  );

-- Service role can manage all completion records
CREATE POLICY "Service role can manage tab completions" ON public.tab_completions
  FOR ALL USING (current_setting('role') = 'service_role');

-- Add updated_at trigger
CREATE TRIGGER on_tab_completions_updated
  BEFORE UPDATE ON public.tab_completions
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Add checkout_completed_at column to kits table if it doesn't exist
ALTER TABLE public.kits 
  ADD COLUMN IF NOT EXISTS checkout_completed_at TIMESTAMP WITH TIME ZONE;

-- Add hosting columns to kits table if they don't exist
ALTER TABLE public.kits 
  ADD COLUMN IF NOT EXISTS hosting_enabled BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS hosting_subscription_id TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS tab_completions_kit_id_idx ON public.tab_completions(kit_id);
CREATE INDEX IF NOT EXISTS tab_completions_kit_tab_idx ON public.tab_completions(kit_id, tab_key);

-- Add comment
COMMENT ON TABLE public.tab_completions IS 'Tracks completion status for each tab (Business Case, Content Strategy, Website) per kit';

