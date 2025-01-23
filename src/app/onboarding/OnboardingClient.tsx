// src/app/onboarding/OnboardingClient.tsx
"use client";

import React from "react";
import type { User } from '@supabase/supabase-js';
import { Heading } from "@/app/components/atoms/typography/Heading";
import { Text } from "@/app/components/atoms/typography/Text";
import SetupProfileForm from "@/app/components/organisms/SetupProfile";

interface OnboardingClientProps {
  user: User;
}

export default function OnboardingClient({ user }: OnboardingClientProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center space-y-6">
        <Heading level={1} className="text-3xl font-bold">
          Welcome to RetailSpan
        </Heading>
        <Text className="text-muted-foreground">
          Welcome, {user.email}! Let&apos;s get you started with setting up your account
        </Text>
        <SetupProfileForm user={user} />
      </div>
    </div>
  );
}
