import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Check if we're in a build context where env vars might not be available
const isBuilding = process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SUPABASE_URL;

// Provide fallback values for build time when env vars aren't available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zbpxtdrmxkkhvagkqwew.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpicnh0ZHJteGtraHZhZ2txd2V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NDA2ODAsImV4cCI6MjA1MDExNjY4MH0.placeholder';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpicnh0ZHJteGtraHZhZ2txd2V3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDU0MDY4MCwiZXhwIjoyMDUwMTE2NjgwfQ.placeholder';

let supabaseInstance: SupabaseClient<Database> | null = null;
let supabaseAdminInstance: SupabaseClient<Database> | null = null;

// Create clients only when needed (not during build)
export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(target, prop) {
    if (isBuilding) {
      // Return mock functions during build
      return () => Promise.resolve({ data: null, error: new Error('Build time - no real data') });
    }
    
    if (!supabaseInstance) {
      supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey);
    }
    
    return (supabaseInstance as any)[prop];
  }
});

// For server-side operations that need elevated permissions
export const supabaseAdmin = new Proxy({} as SupabaseClient<Database>, {
  get(target, prop) {
    if (isBuilding) {
      // Return mock functions during build
      return () => Promise.resolve({ data: null, error: new Error('Build time - no real data') });
    }
    
    if (!supabaseAdminInstance) {
      supabaseAdminInstance = createClient<Database>(supabaseUrl, supabaseServiceKey);
    }
    
    return (supabaseAdminInstance as any)[prop];
  }
});
