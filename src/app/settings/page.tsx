"use client";

import { DashboardLayout } from "@/app/components/templates/layouts"
import { SettingsPage } from "@/app/components/templates/pages"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Settings - RetailSpan",
  description: "Manage your account settings",
}

export default function Page() {
  return (
    <DashboardLayout>
      <SettingsPage />
    </DashboardLayout>
  )
}