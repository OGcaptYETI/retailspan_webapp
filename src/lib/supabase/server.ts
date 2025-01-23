import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseConfig } from './config'

export async function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient(
    supabaseConfig.supabaseUrl,
    supabaseConfig.supabaseKey,
    {
      cookies: {
        async getAll() {
          const store = await cookieStore;
          return store.getAll().map(cookie => ({
            name: cookie.name,
            value: cookie.value,
          }))
        },
        async setAll(cookieStrings: Array<{ name: string; value: string; options?: any }>) {
          cookieStrings.forEach(async ({ name, value, options }) => {
            try {
              (await cookieStore).set(name, value, options)
            } catch (error) {
              console.error(`Error setting cookie ${name}:`, error)
            }
          })
        },
      },
    }
  )
}