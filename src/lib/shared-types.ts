// Shared types for frontend components

export interface KitData {
  id: string;
  title: string;
  one_liner: string;
  has_access: boolean;
}

export interface BusinessCaseContent {
  positioning: string;
  value_prop: string;
  audience_summary: string;
  offer_bullets: string[];
  brand_identity: {
    vibe: string;
    keywords: string[];
  };
  pricing: {
    idea: string;
    alternatives: string[];
  };
  name_ideas: string[];
  taglines: string[];
  risks: string[];
  first_3_steps: string[];
}

export interface ContentStrategyContent {
  channels: string[];
  cadence: Record<string, string>;
  tone: string;
  hooks_7: string[];
  thirty_day_themes: string[];
}

export interface OutputData {
  business_case?: {
    id: string;
    content: BusinessCaseContent;
    regen_count: number;
    regens_remaining: number;
    created_at: string;
    updated_at: string;
  };
  content_strategy?: {
    id: string;
    content: ContentStrategyContent;
    regen_count: number;
    regens_remaining: number;
    created_at: string;
    updated_at: string;
  };
}
