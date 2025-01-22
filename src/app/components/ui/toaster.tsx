"use client"

import * as React from "react"
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from "./toast"

type ToasterProps = {
  toasts: Array<{
    id: string;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    action?: React.ReactNode;
    open: boolean;
    onOpenChange?: (open: boolean) => void;
    variant?: "default" | "destructive";
  }>;
}

export function Toaster(props: ToasterProps) {
  return (
    <ToastProvider>
      {props.toasts.map(function ({ id, title, description, action, ...props }: { id: string; title?: string | React.ReactNode; description?: string | React.ReactNode; action?: React.ReactNode; open: boolean; onOpenChange?: (open: boolean) => void; variant?: "default" | "destructive" }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
