import { createClient } from '@supabase/supabase-js'
import { type Database } from '../../types/supabase'
import { createServerComponentClient, createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Create a Supabase client for server components
export const createServerSupabaseClient = () => {
  return createServerComponentClient<Database>({
    cookies,
  })
}

// Create a Supabase client for client components
export const createClientSupabaseClient = () => {
  return createClientComponentClient<Database>()
}

// Create a standard Supabase client (for direct API usage)
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)