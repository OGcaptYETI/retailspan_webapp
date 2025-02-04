// app/pricing/page.tsx
"use client";

import React from "react";
import DashboardLayout from "@/app/components/templates/layouts/DashboardLayout";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@/app/components/ui/tabs";
import PricingDashboard from "./Components/pages/PricingDashboard";
import Contracts from "./Components/pages/Contracts";
import StatePricing from "./Components/pages/StatePricing";
import CompetitivePricing from "./Components/pages/CompetitivePricing";
import ProductSelector from "./Components/pages/ProductSelector";

export default function PricingPage() {
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <DashboardLayout>
      <div className="flex flex-col min-h-screen bg-background">
        <div className="flex-1 p-6 space-y-8">
          <div className="max-w-[2000px] mx-auto w-full space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-primary">Pricing Management</h1>
              <p className="text-sm text-muted-foreground mt-2">
                Manage pricing strategies and analyze margins across your portfolio.
              </p>
            </div>
            
            <Tabs>
              <TabList>
                <Tab className="px-4 py-2 hover:bg-accent rounded-md" onClick={() => setActiveTab(0)} isActive={activeTab === 0}>Analysis</Tab>
                <Tab className="px-4 py-2 hover:bg-accent rounded-md" onClick={() => setActiveTab(1)} isActive={activeTab === 1}>Contracts</Tab>
                <Tab className="px-4 py-2 hover:bg-accent rounded-md" onClick={() => setActiveTab(2)} isActive={activeTab === 2}>State Pricing</Tab>
                <Tab className="px-4 py-2 hover:bg-accent rounded-md" onClick={() => setActiveTab(3)} isActive={activeTab === 3}>Competitive</Tab>
                <Tab className="px-4 py-2 hover:bg-accent rounded-md" onClick={() => setActiveTab(4)} isActive={activeTab === 4}>Products</Tab>
              </TabList>
              
              <TabPanels>
                <TabPanel isActive={activeTab === 0}>
                  <PricingDashboard />
                </TabPanel>
                <TabPanel isActive={activeTab === 1}>
                  <Contracts />
                </TabPanel>
                <TabPanel isActive={activeTab === 2}>
                  <StatePricing />
                </TabPanel>
                <TabPanel isActive={activeTab === 3}>
                  <CompetitivePricing />
                </TabPanel>
                <TabPanel isActive={activeTab === 4}>
                  <ProductSelector />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}