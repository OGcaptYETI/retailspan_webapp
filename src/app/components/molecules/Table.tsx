"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/app/components/atoms/buttons";
import { Input } from "@/app/components/atoms/inputs";
import { cn } from "@/lib/utils/cn";
import { Edit2, Trash2 } from "lucide-react";

export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  label: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface TableProps {
  data: Array<Record<string, unknown>>;
  columns: Array<TableColumn>;
  onRowClick?: (row: Record<string, unknown>) => void;
  onEditClick?: (row: Record<string, unknown>) => void;
  onDeleteClick?: (id: string) => void;
  searchPlaceholder?: string;
  className?: string;
  isLoading?: boolean;
}

export const Table: React.FC<TableProps> = ({
  data,
  columns,
  onRowClick,
  onEditClick,
  onDeleteClick,
  searchPlaceholder = "Search...",
  className,
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((value) =>
        value?.toString().toLowerCase().includes(lowerSearchTerm)
      )
    );
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key] as string | number;
      const bValue = b[sortConfig.key] as string | number;
      if (aValue === bValue) return 0;
      if (sortConfig.direction === "asc") {
        return aValue < bValue ? -1 : 1;
      } else {
        return aValue > bValue ? -1 : 1;
      }
    });
  }, [filteredData, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (!current || current.key !== key) {
        return { key, direction: "asc" };
      }
      if (current.direction === "asc") {
        return { key, direction: "desc" };
      }
      return null;
    });
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Input
        type="text"
        placeholder={searchPlaceholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => column.sortable && handleSort(column.key)}
                  className={cn(
                    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                    column.sortable && "cursor-pointer hover:bg-gray-100"
                  )}
                  style={column.width ? { width: column.width } : undefined}
                >
                  {column.label}
                  {sortConfig?.key === column.key && (
                    <span className="ml-2">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
              ))}
              {(onEditClick || onDeleteClick) && (
                <th className="px-6 py-3 text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length + (onEditClick || onDeleteClick ? 1 : 0)}
                  className="px-6 py-4 text-center"
                >
                  Loading...
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onEditClick || onDeleteClick ? 1 : 0)}
                  className="px-6 py-4 text-center"
                >
                  No data available
                </td>
              </tr>
            ) : (
              sortedData.map((row, rowIndex) => (
                <tr
                  key={row.id ? String(row.id) : rowIndex}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "hover:bg-gray-50",
                    onRowClick && "cursor-pointer"
                  )}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : (row[column.key] as unknown as React.ReactNode)}
                    </td>
                  ))}
                  {(onEditClick || onDeleteClick) && (
                    <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                      {onEditClick && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditClick(row);
                          }}
                          variant="ghost"
                          size="sm"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      )}
                      {onDeleteClick && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteClick(String(row.id));
                          }}
                          variant="ghost"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ✅ Updated Image Column (Paste this inside `columns` in your `ProductsPage.tsx`)




