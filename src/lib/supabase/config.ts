// File: src/lib/supabase/config.ts

import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Initialize the Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create and export the typed Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Helper function to check if user is authenticated

export const isAuthenticated = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { isAuthed: !!session, session, error };
};

// Helper function to get user profile
export const getUserProfile = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
    
  return profile;
};

// Export types for use in components
export type SupabaseClient = typeof supabase;