import { createClient } from '@supabase/supabase-js'
import { type Database } from '../../types/supabase'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Create a Supabase client for client components
export const createClientSupabaseClient = () => {
  return createClientComponentClient<Database>()
}

// Create a standard Supabase client (for direct API usage)
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)