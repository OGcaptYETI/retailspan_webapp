'use client';

import React, { useState, useMemo } from "react";
import { Button } from "@/app/components/atoms/buttons";
import { Input } from "@/app/components/atoms/inputs";
import { cn } from "@/lib/utils/cn";

interface TableProps {
  data: Array<Record<string, any>>; // Array of objects representing rows
  columns: Array<{ key: string; label: string }>; // Array of column definitions
  onRowClick?: (row: Record<string, any>) => void; // Callback for row click
  onEditClick?: (row: Record<string, any>) => void; // Callback for edit button click
  onDeleteClick?: (id: string) => void; // ✅ Added delete function
  className?: string; // Additional styling
  searchPlaceholder?: string; // Placeholder for the search input
}

export const Table: React.FC<TableProps> = ({
  data,
  columns,
  onRowClick,
  onEditClick,
  onDeleteClick, // ✅ Now accepting delete function
  className,
  searchPlaceholder = "Search...",
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter data based on the search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((value) =>
        value?.toString().toLowerCase().includes(lowerSearchTerm)
      )
    );
  }, [data, searchTerm]);

  // Handle sorting by column
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;
    const sorted = [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredData, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig((prev) =>
      prev && prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Field */}
      <Input
        placeholder={searchPlaceholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />

      {/* Table */}
      <div className="overflow-auto">
        <table className="table-auto w-full border-collapse text-gray-900">
          <thead>
            <tr className="bg-gray-800 text-white">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-2 border border-gray-600 text-left cursor-pointer"
                  onClick={() => handleSort(col.key)}
                >
                  {col.label}{" "}
                  {sortConfig?.key === col.key && (
                    <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
              ))}
              <th className="px-4 py-2 border border-gray-600 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <tr
                key={index}
                className={cn(
                  "hover:bg-gray-100 cursor-pointer",
                  onRowClick && "hover:bg-gray-200"
                )}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td key={col.key} className="border border-gray-600 px-4 py-2">
                    {row[col.key]}
                  </td>
                ))}
                <td className="border border-gray-600 px-4 py-2 space-x-2">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering row click
                      onEditClick?.(row);
                    }}
                    className="bg-green-500 text-white hover:bg-green-600"
                  >
                    Edit
                  </Button>
                  {onDeleteClick && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteClick(row.id);
                      }}
                      className="bg-red-500 text-white hover:bg-red-600"
                    >
                      Delete
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

