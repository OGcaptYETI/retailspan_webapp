'use client';

// src/app/components/templates/layouts/AuthLayout.tsx
import React from 'react';
import { Card } from '@/app/components/molecules/cards';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  console.log('Auth Layout Template - Rendering');

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-6">
        {children}
      </Card>
    </div>
  );
}