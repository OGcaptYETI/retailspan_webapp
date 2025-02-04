// components/WholesaleCostInput.tsx
import React from "react";
import { Input } from "@/app/components/atoms/inputs/Input";
import { Label } from "@/app/components/atoms/typography/Label";

interface WholesaleCostInputProps {
  value: number;
  onChange: (value: number) => void;
  defaultCost?: number;
}

export const WholesaleCostInput: React.FC<WholesaleCostInputProps> = ({
  value,
  onChange,
  defaultCost
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="wholesaleCost">Wholesale Cost</Label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">$</span>
        </div>
        <Input
          type="number"
          id="wholesaleCost"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="pl-7 pr-12"
          placeholder={defaultCost ? `Default: $${defaultCost.toFixed(2)}` : "Enter cost..."}
        />
      </div>
      {defaultCost && (
        <p className="text-xs text-muted-foreground">
          Default: Cost + 5% = ${(defaultCost * 1.05).toFixed(2)}
        </p>
      )}
    </div>
  );
};