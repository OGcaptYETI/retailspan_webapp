// src/app/onboarding/OnboardingClient.tsx
"use client";

import React from "react";
import { Heading } from "@/app/components/atoms/typography/Heading";
import { Text } from "@/app/components/atoms/typography/Text";
import SetupProfileForm from "@/app/components/organisms/SetupProfile";

export default function OnboardingClient() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center space-y-6">
        <Heading level={1} className="text-3xl font-bold">
          Welcome to RetailSpan
        </Heading>
        <Text className="text-muted-foreground">
          Let&apos;s get you started with setting up your account
        </Text>
        <SetupProfileForm />
      </div>
    </div>
  );
}
