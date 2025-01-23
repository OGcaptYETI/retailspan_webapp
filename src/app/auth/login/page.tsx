// src/app/auth/login/page.tsx
import { LoginPage } from '@/app/components/templates/pages';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function Page() {
  console.log('Login Route Page - Rendering');
  
  const supabase = createServerSupabaseClient();
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Auth error:', error.message);
      // Handle error appropriately
      return <LoginPage error={error.message} />;
    }

    if (session) {
      redirect('/dashboard');
    }

    return <LoginPage />;
  } catch (error) {
    console.error('Unexpected error:', error);
    return <LoginPage error="An unexpected error occurred" />;
  }
}