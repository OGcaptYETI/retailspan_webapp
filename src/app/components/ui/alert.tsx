// components/ui/alert.tsx
import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'success' | 'error' | 'warning' | 'info';
  className?: string;
}

const variants = {
  success: {
    icon: CheckCircle,
    bg: 'bg-green-50',
    border: 'border-green-400',
    text: 'text-green-800',
    iconColor: 'text-green-400'
  },
  error: {
    icon: XCircle,
    bg: 'bg-red-50',
    border: 'border-red-400',
    text: 'text-red-800',
    iconColor: 'text-red-400'
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-yellow-50',
    border: 'border-yellow-400',
    text: 'text-yellow-800',
    iconColor: 'text-yellow-400'
  },
  info: {
    icon: Info,
    bg: 'bg-blue-50',
    border: 'border-blue-400',
    text: 'text-blue-800',
    iconColor: 'text-blue-400'
  }
};

export function Alert({ children, variant = 'info', className = '' }: AlertProps) {
  const styles = variants[variant];
  const Icon = styles.icon;

  return (
    <div className={`flex p-4 ${styles.bg} border ${styles.border} rounded-lg ${className}`}>
      <Icon className={`w-5 h-5 ${styles.iconColor} mr-3 flex-shrink-0`} />
      <div className={`flex-1 ${styles.text}`}>{children}</div>
    </div>
  );
}