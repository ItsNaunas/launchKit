import { z } from "zod";

// URL validation with strict http/https requirement
const Url = z.string().url().refine(
  (url) => /^https?:\/\//i.test(url), 
  "Must start with http:// or https://"
);

// Main intake form schema
export const IntakeSchema = z.object({
  // Required essentials
  idea_title: z.string().min(3, "Title must be at least 3 characters").max(80, "Title too long").trim(),
  one_liner: z.string().min(10, "One-liner must be at least 10 characters").max(140, "One-liner too long").trim(),
  category: z.enum(["service", "product", "local", "content", "e-com", "saas"]),
  target_audience: z.string().min(3, "Please describe your target audience").max(400, "Description too long").trim(),
  primary_goal: z.enum(["launch", "first_sales", "validate", "brand"]),
  budget_band: z.enum(["none", "<100", "100-500", "500-2000", ">2000"]),
  time_horizon: z.enum(["2w", "30d", "60d"]),
  top_3_challenges: z.array(z.string().min(3).max(120).trim()).length(3, "Please provide exactly 3 challenges"),
  geography: z.enum(["UK", "EU", "US", "global"]),
  brand_vibe: z.enum(["luxury", "accessible", "edgy", "minimal"]),
  sales_channel_focus: z.enum(["IG", "TikTok", "X", "YouTube", "Etsy", "Shopify", "Offline", "Mixed"]),

  // Optional helpful fields
  business_model: z.enum(["one_off", "subscription", "services", "affiliate", "ads"]).optional(),
  fulfilment: z.enum(["digital", "physical", "service", "mixed"]).optional(),
  pricing_idea: z.string().max(120, "Pricing idea too long").optional(),
  competitor_links: z.array(Url).max(5, "Maximum 5 competitor links").optional().default([]),
  inspiration_links: z.array(Url).max(5, "Maximum 5 inspiration links").optional().default([]),
  content_strengths: z.array(z.enum(["writing", "video", "design", "voice", "none"])).optional().default([]),
  constraints: z.string().max(300, "Constraints description too long").optional(),

  // Optional future fields
  revenue_target_30d: z.number().int().nonnegative().optional()
});

export type IntakeFormData = z.infer<typeof IntakeSchema>;

// Business case output schema
export const BusinessCaseSchema = z.object({
  positioning: z.string(),
  value_prop: z.string(),
  audience_summary: z.string(),
  offer_bullets: z.array(z.string()),
  brand_identity: z.object({
    vibe: z.string(),
    keywords: z.array(z.string())
  }),
  pricing: z.object({
    idea: z.string(),
    alternatives: z.array(z.string())
  }),
  name_ideas: z.array(z.string()),
  taglines: z.array(z.string()),
  risks: z.array(z.string()),
  first_3_steps: z.array(z.string())
});

export type BusinessCase = z.infer<typeof BusinessCaseSchema>;

// Content strategy output schema
export const ContentStrategySchema = z.object({
  channels: z.array(z.string()),
  cadence: z.record(z.string()),
  tone: z.string(),
  hooks_7: z.array(z.string()),
  thirty_day_themes: z.array(z.string())
});

export type ContentStrategy = z.infer<typeof ContentStrategySchema>;
