"use client";

import React from "react";
import { Card } from "@/app/components/molecules/cards/Card";
import { Select } from "@/app/components/atoms/inputs/select";

interface StateSelectorProps {
  selectedState: string;
  onStateChange: (state: string) => void;
}

const StateSelector: React.FC<StateSelectorProps> = ({ 
  selectedState, 
  onStateChange 
}) => {
  const states = [
    { value: "NC", label: "North Carolina" },
    { value: "VA", label: "Virginia" },
    { value: "SC", label: "South Carolina" },
    // Add more states...
  ];

  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold mb-2">Select State</h3>
      <Select
        value={selectedState}
        onChange={(e) => onStateChange(e.target.value)}
        options={[
          { value: '', label: 'Choose a state...' },
          ...states
        ]}
      />
    </Card>
  );
};

export default StateSelector;