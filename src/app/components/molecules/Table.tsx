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
  onDeleteClick?: (id: string) => void; // Callback for delete button click
  className?: string; // Additional styling
  searchPlaceholder?: string; // Placeholder for the search input
}

export const Table: React.FC<TableProps> = ({
  data,
  columns,
  onRowClick,
  onEditClick,
  onDeleteClick,
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
    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
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
        className="mb-4 w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-900 text-white"
      />

      {/* Table */}
      <div className="overflow-auto rounded-lg shadow-md bg-gray-900">
        <table className="table-auto w-full border-collapse text-white">
          <thead>
            <tr className="bg-gray-800 text-white uppercase tracking-wide text-sm">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 border-b border-gray-700 text-left cursor-pointer hover:bg-gray-700 transition"
                  onClick={() => handleSort(col.key)}
                >
                  {col.label}{" "}
                  {sortConfig?.key === col.key && (
                    <span>{sortConfig.direction === "asc" ? "▲" : "▼"}</span>
                  )}
                </th>
              ))}
              <th className="px-4 py-3 border-b border-gray-700 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-4 text-gray-400">
                  No data available
                </td>
              </tr>
            ) : (
              sortedData.map((row, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-800 transition cursor-pointer"
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="border-b border-gray-700 px-4 py-3">
                      {row[col.key] || "—"}
                    </td>
                  ))}
                  <td className="border-b border-gray-700 px-4 py-3 space-x-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering row click
                        onEditClick?.(row);
                      }}
                      className="bg-green-500 text-white hover:bg-green-600 px-3 py-1 rounded"
                    >
                      Edit
                    </Button>
                    {onDeleteClick && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteClick(row.id);
                        }}
                        className="bg-red-500 text-white hover:bg-red-600 px-3 py-1 rounded"
                      >
                        Delete
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


