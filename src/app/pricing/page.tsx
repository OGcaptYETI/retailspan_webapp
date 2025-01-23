// app/pricing/page.tsx
import { DashboardLayout } from "@/app/components/templates/layouts";
import PricingPage from "@/app/components/templates/pages/PricingPage";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function Page() {
  // Get initial products data from Supabase
  const supabase = await createServerSupabaseClient();
  const { data: initialProducts } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true);

  return (
    <DashboardLayout>
      <PricingPage 
        initialProducts={initialProducts || []}
        title="Pricing"
      />
    </DashboardLayout>
  );
}