// src/app/auth/login/page.tsx
import { LoginPage } from '@/app/components/templates/pages';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function Page() {
  console.log('Login Route Page - Rendering');
  
  const supabase = createServerSupabaseClient();
  
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    redirect('/dashboard');
  }

  return <LoginPage />;
}