// File: src/lib/utils/cn.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility function to merge Tailwind classes safely
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}