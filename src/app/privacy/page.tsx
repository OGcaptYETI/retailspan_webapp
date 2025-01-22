import React from 'react';
import { Heading } from '@/app/components/atoms/typography/Heading';
import { Text } from '@/app/components/atoms/typography/Text';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Heading level={1} className="text-3xl font-bold mb-6 text-center">
        Privacy Policy
      </Heading>
      
      <div className="space-y-6">
        <section>
          <Heading level={2} className="text-2xl font-semibold mb-4">
            1. Information We Collect
          </Heading>
          <Text className="mb-4">
            We collect information you provide directly to us, including:
          </Text>
          <ul className="list-disc list-inside space-y-2">
            <li>Personal information (name, email address, contact details)</li>
            <li>Business information for retail analytics</li>
            <li>Account credentials</li>
            <li>Payment information</li>
          </ul>
        </section>
        
        <section>
          <Heading level={2} className="text-2xl font-semibold mb-4">
            2. How We Use Your Information
          </Heading>
          <Text className="mb-4">
            We use the collected information to:
          </Text>
          <ul className="list-disc list-inside space-y-2">
            <li>Provide and maintain our service</li>
            <li>Process transactions</li>
            <li>Send you technical notices and support messages</li>
            <li>Improve our platform and user experience</li>
          </ul>
        </section>
        
        <section>
          <Heading level={2} className="text-2xl font-semibold mb-4">
            3. Data Protection
          </Heading>
          <Text className="mb-4">
            We implement appropriate technical and organizational measures to protect your personal data, including:
          </Text>
          <ul className="list-disc list-inside space-y-2">
            <li>Encryption of sensitive data</li>
            <li>Regular security audits</li>
            <li>Restricted access to personal information</li>
            <li>Compliance with relevant data protection regulations</li>
          </ul>
        </section>
        
        <section>
          <Heading level={2} className="text-2xl font-semibold mb-4">
            4. Your Rights
          </Heading>
          <Text className="mb-4">
            You have the right to:
          </Text>
          <ul className="list-disc list-inside space-y-2">
            <li>Access your personal information</li>
            <li>Request correction of your data</li>
            <li>Request deletion of your account and data</li>
            <li>Opt-out of marketing communications</li>
          </ul>
        </section>
        
        <section>
          <Heading level={2} className="text-2xl font-semibold mb-4">
            5. Cookies and Tracking
          </Heading>
          <Text>
            We use cookies and similar tracking technologies to enhance user experience and analyze platform usage.
          </Text>
        </section>
        
        <Text className="text-sm text-muted-foreground italic mt-8">
          Last updated: January 2025
        </Text>
      </div>
    </div>
  );
}