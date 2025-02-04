// app/pricing/components/pages/CompetitivePricing.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/app/components/molecules/cards/Card";
import { Button } from "@/app/components/atoms/buttons/Button";
import { Table } from "@/app/components/molecules/Table";
import { UploadTemplate } from "@/app/pricing/Components/UploadTemplate";
import { LineChart } from "lucide-react";
import pricingApi from "@/lib/supabase/pricingApi";

export default function CompetitivePricing() {
  interface CompetitorData {
    [key: string]: string | number;
    competitor_name: string;
    category_id: string;
    base_price: number;
    promotion_type: string;
    buydown_amount: number;
    effective_price: number;
    margin_percentage: number;
    status: string;
  }

  const [competitorData, setCompetitorData] = useState<CompetitorData[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await pricingApi.getCompetitivePricing();
        setCompetitorData(data);
      } catch (error) {
        console.error("Error fetching competitive pricing data:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Competitive Analysis</h2>
          <p className="text-sm text-muted-foreground">
            Monitor competitor pricing and program strategies
          </p>
        </div>
        <div className="flex space-x-4">
          <Button variant="outline">
            <LineChart className="w-4 h-4 mr-2" />
            View Trends
          </Button>
          <UploadTemplate onUpload={(file) => console.log('Uploading:', file)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3">Price Comparison</h3>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Average Premium Price</span>
              <span className="font-medium">$71.24</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Average Margin</span>
              <span className="font-medium">15.3%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Market Position</span>
              <span className="text-success font-medium">Competitive</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3">Program Analysis</h3>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Active Programs</span>
              <span className="font-medium">12</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Average Buydown</span>
              <span className="font-medium">$2.75</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Market Coverage</span>
              <span className="font-medium">85%</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3">Market Trends</h3>
          {/* Add trend visualization */}
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Competitor Analysis</h3>
        <Table
          data={competitorData}
          columns={[
            { key: "competitor_name", label: "Competitor" },
            { key: "category_id", label: "Category" },
            { key: "base_price", label: "Base Price", render: (value: unknown) => `$${(value as number).toFixed(2)}` },
            { key: "promotion_type", label: "Promotion" },
            { key: "buydown_amount", label: "Buydown", render: (value: unknown) => `$${(value as number).toFixed(2)}` },
            { key: "effective_price", label: "Effective Price", render: (value: unknown) => `$${(value as number).toFixed(2)}` },
            { key: "margin_percentage", label: "Margin", render: (value) => `${value}%` },
            { key: "status", label: "Status" },
          ]}
          searchPlaceholder="Search competitors..."
        />
      </Card>
    </div>
  );
}