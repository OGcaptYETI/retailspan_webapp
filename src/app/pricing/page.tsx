// app/pricing/page.tsx
"use client";

import { DashboardLayout } from "@/app/components/templates/layouts";
import { PricingPage } from "@/app/components/templates/pages/PricingPage";

export default function Page() {
  return (
    <DashboardLayout>
      <PricingPage products={[]} title="Pricing" />
    </DashboardLayout>
  );
}