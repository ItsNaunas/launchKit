-- Add website template support to LaunchKit AI
-- Run this migration after the main schema

-- Add website output type to outputs table
-- The type column already has a check constraint, we need to alter it
ALTER TABLE public.outputs DROP CONSTRAINT IF EXISTS outputs_type_check;
ALTER TABLE public.outputs ADD CONSTRAINT outputs_type_check 
  CHECK (type IN ('business_case', 'content_strategy', 'website'));

-- Create websites table for template management
CREATE TABLE IF NOT EXISTS public.websites (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  kit_id uuid REFERENCES public.kits(id) ON DELETE CASCADE NOT NULL,
  template_id text NOT NULL, -- e.g., 'modern-landing', 'minimal-portfolio'
  template_source text, -- 'built-in', 'github', or URL
  
  -- Customization data
  html_content text NOT NULL,
  css_content text,
  config jsonb DEFAULT '{}', -- Colors, fonts, layout settings
  sections jsonb DEFAULT '[]', -- Array of section configurations
  
  -- Deployment
  deployed_url text,
  deploy_provider text, -- 'netlify', 'vercel', 'custom'
  
  -- Metadata
  is_published boolean DEFAULT false,
  version integer DEFAULT 1,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.websites ENABLE ROW LEVEL SECURITY;

-- Websites policies
CREATE POLICY "Websites are viewable by kit owner or anonymous" ON public.websites
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.kits
      WHERE kits.id = websites.kit_id
      AND (kits.user_id = auth.uid() OR kits.user_id IS NULL)
    )
  );

CREATE POLICY "Users can insert websites for their kits or anonymous kits" ON public.websites
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.kits
      WHERE kits.id = websites.kit_id
      AND (kits.user_id = auth.uid() OR kits.user_id IS NULL)
    )
  );

CREATE POLICY "Users can update their websites or anonymous websites" ON public.websites
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.kits
      WHERE kits.id = websites.kit_id
      AND (kits.user_id = auth.uid() OR kits.user_id IS NULL)
    )
  );

-- Add updated_at trigger
CREATE TRIGGER on_websites_updated
  BEFORE UPDATE ON public.websites
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Create index for faster queries
CREATE INDEX idx_websites_kit_id ON public.websites(kit_id);
CREATE INDEX idx_websites_template_id ON public.websites(template_id);

