"use client";

import React, { useState } from "react";
import Sidebar from "@/app/components/molecules/navigation/Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full">
        <Sidebar isCollapsed={isSidebarCollapsed} onCollapseChange={setIsSidebarCollapsed} />
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 min-h-screen transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? "pl-20" : "pl-64"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;