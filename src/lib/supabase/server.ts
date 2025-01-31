import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { type Database } from '../../types/supabase'

// Create a Supabase client for server components
export const createServerSupabaseClient = () => {
  return createServerComponentClient<Database>({
    cookies,
  })
}