// lib/auth/utils.ts
"use client";

import { useEffect, useState } from 'react';
import { User as BaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '../supabase/client';


interface UserProfile {
  id: string;
  user_id: string;
  role: string;
  organization_id: string | null;
  created_at: string;
  updated_at: string;
}

interface UseUserReturn {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
  error: Error | null;
}

export function useUser(): UseUserReturn {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Get authenticated user securely
    async function loadUser() {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        setUser(data?.user ?? null);
        setSession(await supabase.auth.getSession().then(({ data }) => data.session));
      } catch (err) {
        console.error('Error fetching user:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch user'));
      }
    }

    loadUser();

    // Listen for auth changes
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => {
      subscription?.subscription?.unsubscribe();
    };
  }, []);

  // Fetch user profile when user changes
  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        setProfile(null);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (err) {
        console.error('Error loading user profile:', err);
        setError(err instanceof Error ? err : new Error('Failed to load user profile'));
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  // Determine if user is admin based on profile role
  const isAdmin = profile?.role === 'admin';

  return {
    user,
    session,
    profile,
    isAdmin,
    isLoading,
    error,
  };
}

// Re-export existing auth utilities
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function requireAuth() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      window.location.href = '/auth/login';
      return null;
    }
    return data.user;
  } catch (err) {
    console.error('Error in requireAuth:', err);
    window.location.href = '/auth/login';
    return null;
  }
}

export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Profile error:', error);
    return null;
  }
}
export interface User extends BaseUser {
  organizationId?: string;
  profile?: UserProfile;
}
