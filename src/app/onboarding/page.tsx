import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import OnboardingClient from './OnboardingClient';
import { redirect } from 'next/navigation';
import type { Database } from '@/types/supabase';
import type { User } from '@supabase/supabase-js';

interface UserProfile {
  user_id: string;
  organization_id?: string;
  role: string;
}

export default async function OnboardingPage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('User fetch error:', userError);
      return redirect('/auth/login');
    }

    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('user_id, organization_id, role')
      .eq('user_id', user.id)
      .single<UserProfile>();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Profile fetch error:', profileError);
      throw profileError;
    }

    if (profile?.organization_id) {
      return redirect('/dashboard');
    }

    return <OnboardingClient user={user} />;
  } catch (error) {
    console.error('Unexpected error during onboarding:', error);
    return redirect('/error');
  }
}