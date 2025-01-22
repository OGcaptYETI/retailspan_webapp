"use client";

import * as React from "react";
import { useToast } from "./use-toast";
import { ToastProps } from "./use-toast";

// This is just an example "Toaster" component that reads the toast state and
// renders them. Adjust the markup/styling as needed:
export function Toaster() {
  const { toasts } = useToast();

  return (
    <div
      className="fixed top-0 right-0 z-50 flex flex-col gap-2 p-4"
      aria-live="assertive"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} />
      ))}
    </div>
  );
}

// Example single toast item component
function ToastItem({ title, description, action, open }: ToastProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="pointer-events-auto rounded-md bg-white p-4 shadow">
      {title ? <p className="font-semibold">{title}</p> : null}
      {description ? <p className="text-sm">{description}</p> : null}
      {action}
    </div>
  );
}
