// components/PricingTable.tsx
import React from "react";
import { Table } from "@/app/components/molecules/Table";
import { MarginIndicator } from "./MarginIndicator";

interface PricingData {
  brand: string;
  category: string;
  wholesaleCost: number;
  recommendedRetail: number;
  currentMargin: number;
  targetMargin: number;
  status: string;
  recommendation: string;
  [key: string]: string | number;
}

interface PricingTableProps {
  data: PricingData[];
  onEditPrice?: (brand: string) => void;
}

export const PricingTable: React.FC<PricingTableProps> = ({ data, onEditPrice }) => {
  const columns = [
    { key: "brand", label: "Brand" },
    { key: "category", label: "Category" },
    { 
      key: "wholesaleCost", 
      label: "Wholesale Cost",
      render: (value: unknown) => `$${(value as number).toFixed(2)}`
    },
    { 
      key: "recommendedRetail", 
      label: "Recommended Retail",
      render: (value: unknown) => `$${(value as number).toFixed(2)}`
    },
    { 
      key: "currentMargin", 
      label: "Current Margin",
      render: (value: unknown) => `${value as number}%`
    },
    { 
      key: "targetMargin", 
      label: "Target Margin",
      render: (value: unknown) => `${value as number}%`
    },
    { 
      key: "status", 
      label: "Status",
      render: (value: unknown) => <MarginIndicator status={value as string} />
    },
    { key: "recommendation", label: "Recommendation" },
  ];

  return (
    <Table
      data={data}
      columns={columns}
      onEditClick={row => onEditPrice?.(row.brand as string)}
      searchPlaceholder="Search brands..."
    />
  );
};