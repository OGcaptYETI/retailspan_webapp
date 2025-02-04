"use client";

import React from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/app/components/templates/layouts/DashboardLayout";
import { Card } from "@/app/components/molecules/cards/Card";
import { DollarSign, Package, BoxSelect, Smile, TrendingUp } from "lucide-react";
import { Button } from "@/app/components/atoms/buttons/Button";

const DashboardPage = () => {
  const router = useRouter();

  const quickActions = [
    {
      title: "Products",
      description: "Manage your product catalog",
      icon: <Package className="w-8 h-8" />,
      href: "/products",
      metric: "1,234",
      metricLabel: "Total Products",
    },
    {
      title: "Pricing",
      description: "Update pricing and promotions",
      icon: <DollarSign className="w-8 h-8" />,
      href: "/pricing",
      metric: "45",
      metricLabel: "Active Promotions",
    },
    {
      title: "Planograms",
      description: "Design store layouts",
      icon: <BoxSelect className="w-8 h-8" />,
      href: "/planograms",
      metric: "23",
      metricLabel: "Active Planograms",
    },
    {
      title: "Promotions",
      description: "Manage promotional campaigns",
      icon: <Smile className="w-8 h-8" />,
      href: "/promotions",
      metric: "12",
      metricLabel: "Running Promotions",
    },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col min-h-screen bg-background">
        <div className="flex-1 p-6 space-y-8">
          {/* Header Section */}
          <div className="max-w-7xl mx-auto w-full space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
              <div>
                <h1 className="text-3xl font-bold text-primary">Welcome to Your Dashboard</h1>
                <p className="text-muted-foreground text-lg mt-2">
                  Use the navigation menu to manage your planograms, pricing, and product data.
                </p>
              </div>
              <Button variant="default" size="lg" className="mt-4 lg:mt-0">
                <TrendingUp className="w-5 h-5 mr-2" />
                View Analytics
              </Button>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              {quickActions.map((action) => (
                <Card
                  key={action.title}
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(action.href)} // **Faster client-side navigation**
                >
                  <div className="flex items-start justify-between">
                    <div className="text-primary/80">{action.icon}</div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{action.metric}</div>
                      <div className="text-sm text-muted-foreground">{action.metricLabel}</div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mt-4">{action.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                  <Button variant="ghost" className="w-full mt-4 justify-start hover:bg-primary/5">
                    View Details →
                  </Button>
                </Card>
              ))}
            </div>

            {/* Recent Activity Section */}
            <Card className="mt-8 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Recent Activity</h2>
                <Button variant="ghost" onClick={() => router.push("/activity")}>
                  View All →
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div className="flex items-center space-x-4">
                    <Package className="w-5 h-5 text-primary/60" />
                    <div>
                      <p className="font-medium">New Product Added</p>
                      <p className="text-sm text-muted-foreground">Winston Select Red Box</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">2 minutes ago</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div className="flex items-center space-x-4">
                    <DollarSign className="w-5 h-5 text-primary/60" />
                    <div>
                      <p className="font-medium">Price Update</p>
                      <p className="text-sm text-muted-foreground">Updated prices for 15 products</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">1 hour ago</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
