import React from "react";
import Sidebar from "@/app/components/molecules/navigation/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      {/* Static Sidebar */}
      <Sidebar />

      {/* Dynamic Content Area */}
      <main className="flex-1 p-6 bg-gray-50 overflow-auto">
        {children}
      </main>
    </div>
  );
}
