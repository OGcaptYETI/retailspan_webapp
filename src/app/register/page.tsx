'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client'; // ✅ Use the shared Supabase client

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    companyName: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`, // Ensure this is configured in Supabase settings
          data: {
            full_name: formData.fullName,
            company_name: formData.companyName,
          },
        },
      });

      if (error) throw error;

      setMessage('Account created successfully! Please check your email for the confirmation link.');
      setTimeout(() => router.push('/login'), 5000);
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Branding Side */}
      <div className="hidden md:flex flex-col justify-between bg-gradient-to-r from-blue-500 to-cyan-600 p-8 text-white">
        <div>
          <h1 className="text-lg font-bold">RetailSpan</h1>
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl font-bold">Welcome to RetailSpan</h2>
          <p className="text-lg">Start managing your retail planograms efficiently.</p>
        </div>

        <p className="text-sm opacity-70">© {new Date().getFullYear()} RetailSpan. All rights reserved.</p>
      </div>

      {/* Form Side */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold">Create Your Account</h2>
            <p className="text-muted-foreground">Fill in the details below to get started.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>

            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-300 mb-1">
                Company Name
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-cyan-500 text-gray-900 rounded-md hover:bg-cyan-600 transition-all"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          {message && <p className="mt-4 text-sm text-cyan-400">{message}</p>}

          <p className="mt-6 text-sm text-gray-400 text-center">
            Already have an account?{' '}
            <span
              onClick={() => router.push('/login')}
              className="text-cyan-400 underline cursor-pointer hover:text-cyan-300"
            >
              Log in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;




