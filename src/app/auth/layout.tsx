'use client';

// src/app/auth/layout.tsx
import React from 'react';
import { AuthLayout as AuthLayoutTemplate } from '@/app/components/templates/layouts';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log('Auth Route Layout - Rendering');
  return <AuthLayoutTemplate>{children}</AuthLayoutTemplate>;
}