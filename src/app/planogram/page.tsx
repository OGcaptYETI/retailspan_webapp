"use client";

import { DashboardLayout } from "@/app/components/templates/layouts"
import { PlanogramPage } from "@/app/components/templates/pages"
import { Metadata } from "next"
import { createServerSupabaseClient } from "@/lib/supabase/client"
import { requireAuth } from "@/lib/auth/utils"
import type { Database } from "@/types/supabase"
import type { PlanogramState } from "@/types/components/planogram"

export const metadata: Metadata = {
  title: "Planogram - RetailSpan",
  description: "Create and manage planograms",
}

export default async function Page() {
  await requireAuth()
  const supabase = createServerSupabaseClient()

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
    dimensions: {
      width: 1200,
      height: 800,
      depth: 400
    }
  }

  return (
    <DashboardLayout>
      <PlanogramPage 
        initialState={initialState} 
        products={products || []}
      />
    </DashboardLayout>
  )
}