import { createServerClient } from '../supabase/client'
import { redirect } from 'next/navigation'

export async function getSession() {
  const supabase = createServerClient()
  
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    
    return session
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

export async function requireAuth() {
  const session = await getSession()

  if (!session) {
    redirect('/auth/login')
  }

  return session
}

export async function getUser() {
  const session = await getSession()
  return session?.user ?? null
}