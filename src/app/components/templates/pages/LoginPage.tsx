'use client';

// src/app/components/templates/pages/LoginPage.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClientSupabaseClient } from '@/lib/supabase/client';
import { Button } from '@/app/components/atoms/buttons';
import { Input } from '@/app/components/atoms/inputs';
import { Heading, Text } from '@/app/components/atoms/typography';
import { toast } from 'sonner';

export function LoginPage() {
  console.log('Login Page Template - Rendering');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientSupabaseClient();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Successfully logged in');
      router.refresh();
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to log in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <Heading>Welcome Back</Heading>
        <Text className="text-muted-foreground">
          Enter your credentials to access your account
        </Text>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email">Email</label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password">Password</label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div className="text-center space-y-2">
        <Link 
          href="/auth/register"
          className="text-sm hover:underline"
        >
          Don&apos;t have an account? Sign up
        </Link>
      </div>
    </div>
  );
}