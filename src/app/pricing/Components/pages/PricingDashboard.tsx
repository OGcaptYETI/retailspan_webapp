// app/pricing/components/pages/PricingDashboard.tsx
"use client";

import React, { useState } from "react";
import { Card } from "@/app/components/molecules/cards/Card";
import StateSelector from "../StateSelector";
import { ProgramSelector } from "../ProgramSelector";
import { PricingTable } from "../PricingTable";
import { WholesaleCostInput } from "../WholesaleCostInput";

export default function PricingDashboard() {
  const [selectedState, setSelectedState] = useState("");
  const [itgProgram, setItgProgram] = useState("");
  const [pmProgram, setPmProgram] = useState("");
  const [rjrProgram, setRjrProgram] = useState("");
  const [jtiProgram, setJtiProgram] = useState("");
  const [wholesaleCost, setWholesaleCost] = useState<number>(0);

  // Placeholder data for the pricing table
  const pricingData = [
    {
      brand: "Winston",
      category: "Premium",
      wholesaleCost: 55.09,
      recommendedRetail: 63.04,
      currentMargin: 12.5,
      targetMargin: 15.0,
      status: "warning",
      recommendation: "Increase retail price by $2.50",
    },
    // Add more sample data
  ];

  return (
    <div className="space-y-6">
      {/* Selection Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StateSelector 
          selectedState={selectedState}
          onStateChange={setSelectedState}
        />

        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-4">Program Selection</h3>
          <div className="space-y-4">
            <ProgramSelector
              manufacturer="ITG Brands"
              selectedProgram={itgProgram}
              onProgramChange={setItgProgram}
            />
            <ProgramSelector
              manufacturer="Philip Morris"
              selectedProgram={pmProgram}
              onProgramChange={setPmProgram}
            />
            <ProgramSelector
              manufacturer="RJ Reynolds"
              selectedProgram={rjrProgram}
              onProgramChange={setRjrProgram}
            />
            <ProgramSelector
              manufacturer="JTI"
              selectedProgram={jtiProgram}
              onProgramChange={setJtiProgram}
            />
          </div>
        </Card>

        <Card className="p-4">
          <WholesaleCostInput
            value={wholesaleCost}
            onChange={setWholesaleCost}
            defaultCost={50.00}
          />
        </Card>
      </div>

      {/* Pricing Analysis */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Pricing Analysis</h2>
        <PricingTable 
          data={pricingData}
          onEditPrice={(brand) => console.log(`Edit price for ${brand}`)}
        />
      </Card>
    </div>
  );
}
