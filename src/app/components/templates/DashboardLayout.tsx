'use client';

import React, { useState } from 'react';
import Sidebar from '@/app/components/molecules/navigation/Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onCollapseChange={(collapsed: boolean) => setIsSidebarCollapsed(collapsed)}
      />

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          isSidebarCollapsed ? 'ml-20' : 'ml-64'
        } flex-1 p-8 overflow-y-auto`}
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
