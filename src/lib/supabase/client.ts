import { createClient } from '@supabase/supabase-js';
import { type Database } from '../../types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side Supabase instance
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Debug helpers
declare global {
  interface Window {
    supabase: typeof supabase;
  }
}

if (typeof window !== 'undefined') {
  window.supabase = supabase;
}