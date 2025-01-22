import { DashboardLayout } from "@/app/components/templates/layouts"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard - RetailSpan",
  description: "RetailSpan Dashboard",
}

export default function Page() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        {/* Add dashboard content here */}
      </div>
    </DashboardLayout>
  )
}