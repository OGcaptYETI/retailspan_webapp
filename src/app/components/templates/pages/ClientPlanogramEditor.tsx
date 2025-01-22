// app/components/templates/pages/ClientPlanogramEditor.tsx
"use client"

import dynamic from "next/dynamic"
import type { PlanogramState } from "@/types/components/planogram"
import type { BaseProduct } from "@/types/models/products"

// Define props interface that matches the core PlanogramEditor component
interface PlanogramEditorProps {
  initialState?: PlanogramState
  products?: BaseProduct[]
  onSave?: (state: PlanogramState) => Promise<void>
  className?: string
}

// Dynamic import with SSR disabled for client-side only rendering
const PlanogramEditor = dynamic<PlanogramEditorProps>(
  () => import("@/app/components/organisms/planogram/PlanogramEditor").then(
    (mod) => mod.PlanogramEditor
  ),
  { 
    ssr: false,
    // Show loading state while component is being loaded
    loading: () => (
      <div className="w-full h-full min-h-[600px] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">
          Loading editor...
        </div>
      </div>
    )
  }
)

// Re-export the component and its type definitions
export { PlanogramEditor }
export type { PlanogramEditorProps }