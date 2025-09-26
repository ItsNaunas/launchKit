import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Check if we're in a build context where env vars might not be available
const isBuilding = process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SUPABASE_URL;

// Get environment variables - no fallbacks for security
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate required environment variables
if (!isBuilding) {
  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  }
  if (!supabaseAnonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
  }
  if (!supabaseServiceKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  }
}

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
      supabaseInstance = createClient<Database>(supabaseUrl!, supabaseAnonKey!);
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
      supabaseAdminInstance = createClient<Database>(supabaseUrl!, supabaseServiceKey!);
    }
    
    return (supabaseAdminInstance as any)[prop];
  }
});
