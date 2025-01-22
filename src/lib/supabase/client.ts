'use client';

// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import { supabaseConfig } from './config';

// Direct Supabase client
export const supabase = createClient<Database>(
  supabaseConfig.supabaseUrl, 
  supabaseConfig.supabaseKey
);

// Browser client
export const createClientSupabaseClient = () => {
  return createBrowserClient<Database>(
    supabaseConfig.supabaseUrl,
    supabaseConfig.supabaseKey
  );
};

// API client
export const createApiClient = () => {
  return createClient<Database>(
    supabaseConfig.supabaseUrl, 
    supabaseConfig.supabaseKey, 
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
};

export default createClientSupabaseClient();