// app/pricing/components/pages/StatePricing.tsx
"use client";

import React, { useState } from "react";
import { Card } from "@/app/components/molecules/cards/Card";
import { Button } from "@/app/components/atoms/buttons/Button";
import { Table } from "@/app/components/molecules/Table";
import StateSelector from "../StateSelector";
import { Plus, Map } from "lucide-react";

export default function StatePricing() {
  const [selectedState, setSelectedState] = useState("");
  const [statePricing, setStatePricing] = useState([
    {
      state: "NC",
      tax: 0.45,
      baseCost: 55.09,
      buydown: 2.50,
      promotion: "Summer Savings",
      effectiveDate: "2024-02-15",
    },
    // Add more sample data
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">State Pricing Configuration</h2>
          <p className="text-sm text-muted-foreground">
            Manage state-specific pricing rules and regulations
          </p>
        </div>
        <Button variant="default">
          <Map className="w-4 h-4 mr-2" />
          View State Map
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StateSelector
          selectedState={selectedState}
          onStateChange={setSelectedState}
        />

        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3">State Tax Rules</h3>
          {/* Tax configuration */}
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3">Buydown Limits</h3>
          {/* Buydown configuration */}
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">State Pricing Rules</h3>
          <Button
            variant="default"
            size="sm"
            onClick={() =>
              setStatePricing([
                ...statePricing,
                {
                  state: "NY",
                  tax: 0.50,
                  baseCost: 60.00,
                  buydown: 3.00,
                  promotion: "Winter Savings",
                  effectiveDate: "2024-12-01",
                },
              ])
            }
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Rule
          </Button>
        </div>
        <Table
          data={statePricing}
          columns={[
            { key: "state", label: "State" },
            { 
              key: "tax", 
              label: "Tax Rate",
              render: (value: unknown) => `${(value as number * 100).toFixed(2)}%`
            },
            { 
              key: "baseCost", 
              label: "Base Cost",
              render: (value: unknown) => `$${(value as number).toFixed(2)}`
            },
            { 
              key: "buydown", 
              label: "Buydown",
              render: (value: unknown) => `$${(value as number).toFixed(2)}`
            },
            { key: "promotion", label: "Active Promotion" },
            { key: "effectiveDate", label: "Effective Date" },
          ]}
        />
      </Card>
    </div>
  );
}