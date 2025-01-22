import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import OnboardingClient from "./OnboardingClient";
import { redirect } from "next/navigation";
import type { Database } from '@/types/supabase';

export default async function OnboardingPage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Session error:", sessionError);
      return redirect("/auth/login");
    }

    if (!session) {
      console.log("No active session found");
      return redirect("/auth/login");
    }

    // Check if profile exists in user_profiles
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('user_id, organization_id, role')
      .eq('user_id', session.user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error("Profile error:", profileError);
      throw profileError;
    }

    // If profile exists and has organization, redirect to dashboard
    if (profile?.organization_id) {
      return redirect("/dashboard");
    }

    return <OnboardingClient />;
  } catch (error) {
    console.error("Unexpected error:", error);
    return redirect("/error");
  }
}
