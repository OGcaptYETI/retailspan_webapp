// File: src/app/components/templates/pages/LoginPage.tsx

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Heading, Text } from '@/app/components/atoms/typography';
import { Button } from '@/app/components/atoms/buttons';
import { FormField } from '@/app/components/molecules/forms';
import { cn } from '@/lib/utils/cn';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-900 text-gray-100">
      {/* Branding Section */}
      <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-cyan-700 to-blue-800 p-8 text-white">
        <div>
          <h1 className="text-lg font-bold">RetailSpan</h1>
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-extrabold">Welcome Back</h2>
          <p className="text-lg opacity-90">Your one-stop platform for retail planogram management.</p>
        </div>
        <p className="text-sm opacity-70">© {new Date().getFullYear()} RetailSpan. All rights reserved.</p>
      </div>

      {/* Login Form Section */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center">
            <Heading level={1} className="text-3xl font-bold">
              Sign in to Your Account
            </Heading>
            <Text className="text-sm text-muted-foreground">
              Enter your credentials below to get started.
            </Text>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Email"
              type="email"
              name="email"
              placeholder="name@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FormField
              label="Password"
              type="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <Text className="text-sm text-red-500 text-center">{error}</Text>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="text-center flex flex-col space-y-4">
          <a href="/forgot-password" className="text-sm text-gray-400 hover:underline">
            Forgot your password?
          </a>
            <a href="/register" className="text-sm text-cyan-400 hover:underline">
             Don't have an account? Sign up
          </a>
          </div>
        </div>
      </div>
    </div>
  );
}



