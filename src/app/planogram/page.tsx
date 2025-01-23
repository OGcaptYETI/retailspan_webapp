import { DashboardLayout } from "@/app/components/templates/layouts"
import { PlanogramPage } from "@/app/components/templates/pages"
import { Metadata } from "next"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from 'next/navigation'
import type { PlanogramState } from "@/types/components/planogram"

export const metadata: Metadata = {
  title: "Planogram - RetailSpan",
  description: "Create and manage planograms",
}

export default async function Page() {
  const supabase = await createServerSupabaseClient()
  
  // Check auth on server side
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    redirect('/auth/login')
  }

  // Fetch initial planogram data
  const { data: planogram } = await supabase
    .from('planograms')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()
  
  // Fetch products
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('name')

  const initialState: PlanogramState = planogram?.layout_data as PlanogramState || {
    products: [],
    shelves: [],
    dimensions: { width: 1200, height: 800, depth: 400 },
  }

  return (
    <DashboardLayout>
      <PlanogramPage 
        initialState={initialState} 
        products={products || []}
        fixture={{
          id: 1,
          created_at: new Date().toISOString(),
          name: 'Default Fixture',
          type: 'default',
          dimensions: { width: 1200, height: 800, depth: 400 },
        }}
      />
    </DashboardLayout>
  )
}