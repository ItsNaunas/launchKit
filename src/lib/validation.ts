import { z } from 'zod';

// UUID validation schema
export const uuidSchema = z.string().uuid('Invalid UUID format');

// Kit ID validation schema
export const kitIdSchema = z.object({
  id: uuidSchema,
});

// Content type validation schema
export const contentTypeSchema = z.enum(['business_case', 'content_strategy']);

// Simple intake validation schema
export const simpleIntakeSchema = z.object({
  business_idea: z.string().min(1, 'Business idea is required'),
  target_audience: z.string().min(1, 'Target audience is required'),
  main_challenge: z.string().min(1, 'Main challenge is required'),
});

// Profiling data validation schema
export const profilingDataSchema = z.object({
  selectedOptions: z.record(z.any()).optional(),
  profilingData: z.record(z.any()).optional(),
});

// Generate content request validation schema
export const generateContentSchema = z.object({
  type: contentTypeSchema,
});

// Type exports
export type SimpleIntakeData = z.infer<typeof simpleIntakeSchema>;
export type ProfilingData = z.infer<typeof profilingDataSchema>;
export type GenerateContentData = z.infer<typeof generateContentSchema>;
