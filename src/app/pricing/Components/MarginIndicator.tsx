// components/MarginIndicator.tsx
import React from "react";
import { CheckCircle, AlertTriangle, AlertCircle } from "lucide-react";
import Tooltip from "@/app/components/ui/tooltip";

interface MarginIndicatorProps {
  status: string;
  tooltip?: string;
}

export const MarginIndicator: React.FC<MarginIndicatorProps> = ({ status, tooltip }) => {
  const indicators = {
    success: {
      icon: <CheckCircle className="w-5 h-5 text-success" />,
      message: "Margin is optimal"
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5 text-warning" />,
      message: "Margin needs attention"
    },
    error: {
      icon: <AlertCircle className="w-5 h-5 text-destructive" />,
      message: "Margin is critically low"
    }
  };

  const indicator = indicators[status as keyof typeof indicators];

  return (
    <Tooltip content={tooltip || indicator.message}>
      <div className="flex items-center space-x-2">
        {indicator.icon}
        <span className="text-sm text-muted-foreground">{status}</span>
      </div>
    </Tooltip>
  );
};