'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  position?: 'center' | 'bottom-left'; // Add position prop for modal placement
}

export const Modal = ({ children, isOpen, onClose, className, position = 'center' }: ModalProps) => {
  if (!isOpen) return null;

  // Determine placement styles based on position prop
  const placementStyles =
    position === 'bottom-left'
      ? 'fixed bottom-16 left-4'
      : 'fixed inset-0 flex items-center justify-center';

  return (
    <div className={cn('z-50 bg-black/50', placementStyles, className)}>
      <div className="relative bg-gray-800 text-gray-100 rounded-lg shadow-lg p-6 w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-100 focus:outline-none"
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


