"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  position?: "center" | "bottom-left";
}

export const Modal = ({
  children,
  isOpen,
  onClose,
  className,
  position = "center",
}: ModalProps) => {
  if (!isOpen) return null;

  // Determine placement styles based on position
  const placementStyles =
    position === "bottom-left"
      ? "fixed bottom-16 left-4"
      : "fixed inset-0 flex items-center justify-center";

  return (
    <div className={cn("z-50 bg-black/50", placementStyles)}>
      {/* Modal panel */}
      <div
        className={cn(
          "relative w-full max-w-md rounded-md shadow-lg",
          "bg-card text-card-foreground p-6",
          className
        )}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground focus:outline-none"
          aria-label="Close modal"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;



