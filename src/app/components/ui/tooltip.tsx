"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "top",
  className,
}) => {
  return (
    <div className="relative group inline-block">
      {/* Tooltip Content */}
      <div
        className={cn(
          "absolute z-50 whitespace-nowrap px-3 py-2 rounded-md text-sm shadow-lg bg-card text-card-foreground border border-border opacity-0 transition-opacity duration-200 group-hover:opacity-100",
          {
            "bottom-full left-1/2 transform -translate-x-1/2 mb-2": position === "top",
            "top-full left-1/2 transform -translate-x-1/2 mt-2": position === "bottom",
            "right-full top-1/2 transform -translate-y-1/2 mr-2": position === "left",
            "left-full top-1/2 transform -translate-y-1/2 ml-2": position === "right",
          },
          className
        )}
      >
        {content}
      </div>

      {/* Tooltip Trigger */}
      {children}
    </div>
  );
};

export default Tooltip;
