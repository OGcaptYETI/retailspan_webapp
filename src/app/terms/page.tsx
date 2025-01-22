import React from 'react';
import { Heading } from '@/app/components/atoms/typography/Heading';
import { Text } from '@/app/components/atoms/typography/Text';

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Heading level={1} className="text-3xl font-bold mb-6 text-center">
        Terms of Service
      </Heading>
      
      <div className="space-y-6">
        <section>
          <Heading level={2} className="text-2xl font-semibold mb-4">
            1. Acceptance of Terms
          </Heading>
          <Text className="mb-4">
            By accessing and using RetailSpan, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
          </Text>
        </section>
        
        <section>
          <Heading level={2} className="text-2xl font-semibold mb-4">
            2. Use of Service
          </Heading>
          <Text className="mb-4">
            RetailSpan grants you a non-transferable, non-exclusive license to use our platform subject to the following restrictions:
          </Text>
          <ul className="list-disc list-inside space-y-2">
            <li>You may not use the service for any illegal or unauthorized purpose</li>
            <li>You must provide accurate and complete information</li>
            <li>You are responsible for maintaining the confidentiality of your account</li>
          </ul>
        </section>
        
        <section>
          <Heading level={2} className="text-2xl font-semibold mb-4">
            3. Intellectual Property
          </Heading>
          <Text className="mb-4">
            All content, features, and functionality are and will remain the exclusive property of RetailSpan and its licensors.
          </Text>
        </section>
        
        <section>
          <Heading level={2} className="text-2xl font-semibold mb-4">
            4. Limitation of Liability
          </Heading>
          <Text>
            RetailSpan is not liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to the use of our service.
          </Text>
        </section>
        
        <Text className="text-sm text-muted-foreground italic mt-8">
          Last updated: January 2025
        </Text>
      </div>
    </div>
  );
}