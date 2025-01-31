'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client'; // ✅ Import from client.ts

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const confirmEmail = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      if (code) {
        try {
          const email = params.get('email') || ''; // Ensure email is a string

          const { error } = await supabase.auth.verifyOtp({
            token: code,
            type: 'signup',
            email, // ✅ Cleaner syntax
          });

          if (error) {
            console.error('Email verification failed:', error.message);
            router.push('/error'); // Redirect to an error page if verification fails
          } else {
            router.push('/dashboard'); // Redirect to dashboard on success
          }
        } catch (err) {
          console.error('Unexpected error:', err);
          router.push('/error');
        }
      }
    };

    confirmEmail();
  }, [router]); // ✅ Removed supabase from dependencies

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
      <p>Processing your email verification...</p>
    </div>
  );
}

