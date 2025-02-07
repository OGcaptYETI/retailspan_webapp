import React, { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils/cn";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  position?: "center" | "bottom-left";
  size?: "sm" | "md" | "lg" | "xl";
}

export function Modal({
  children,
  isOpen,
  onClose,
  className,
  position = "center",
  size = "lg",
}: ModalProps) {
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener('keydown', handleEscape);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, handleEscape]);

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-3xl",
  };

  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen px-4 text-center flex items-center justify-center"
          >
            <motion.div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm"
              aria-hidden="true"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "relative w-full",
                sizeClasses[size],
                "bg-card text-card-foreground",
                "border border-border",
                "shadow-lg rounded-lg",
                "overflow-hidden",
                position === "bottom-left" ? "absolute bottom-4 left-4" : "",
                className
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className={cn(
                  "absolute top-4 right-4",
                  "p-2 rounded-full",
                  "bg-background/80 hover:bg-accent",
                  "text-muted-foreground hover:text-accent-foreground",
                  "transition-colors duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                )}
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
              {children}
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export function ModalPortal({ children }: { children: React.ReactNode }) {    


  return typeof window !== 'undefined' 
    ? createPortal(children, document.body)
    : null;
}

export function ModalHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      "p-6",
      "border-b border-border",
      "bg-gradient-to-r from-background to-card",
      className
    )}>
      {children}
    </div>
  );
}

export function ModalBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("p-6", className)}>
      {children}
    </div>
  );
}

export function ModalFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      "p-6",
      "border-t border-border",
      "bg-muted/50",
      "flex items-center justify-end gap-4",
      className
    )}>
      {children}
    </div>
  );
}


