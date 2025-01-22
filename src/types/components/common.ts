import { ReactNode, RefObject } from 'react'

/**
 * Base component props
 */
export interface BaseProps {
  className?: string
  children?: ReactNode
}

/**
 * Base entity with ID
 */
export interface WithId {
  id: string
}

/**
 * Base entity with timestamps
 */
export interface WithTimestamps {
  created_at: string
  updated_at?: string
}

/**
 * Select component option
 */
export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
  description?: string
  icon?: ReactNode
}

/**
 * Table column configuration
 */
export interface TableColumn<T> {
  key: keyof T
  header: string
  width?: number
  render?: (value: T[keyof T], row: T) => ReactNode
  sortable?: boolean
  filterable?: boolean
  align?: 'left' | 'center' | 'right'
}

/**
 * Pagination state
 */
export interface PaginationState {
  page: number
  pageSize: number
  total: number
  hasMore?: boolean
}

/**
 * Application status
 */
export type Status = 'idle' | 'loading' | 'success' | 'error'

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc'

/**
 * Sort state
 */
export interface SortState {
  field: string
  direction: SortDirection
}

/**
 * Generic filter state
 */
export interface FilterState {
  [key: string]: string | number | boolean | null | string[] | { min: number; max: number } | undefined
  category?: string[]
  brand?: string[]
  priceRange?: {
    min: number
    max: number
  }
  search?: string
}

/**
 * Search field props
 */
export interface SearchFieldProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  type?: 'text' | 'search' | 'email' | 'tel'
  className?: string
  label?: string
  error?: string
  helperText?: string
  required?: boolean
  disabled?: boolean
  autoFocus?: boolean
  onClear?: () => void
  onSubmit?: (value: string) => void
  ref?: RefObject<HTMLInputElement>
}

/**
 * Base form field props
 */
export interface FormFieldProps<T = string> {
  name: string
  label?: string
  value: T
  onChange: (value: T) => void
  error?: string
  helperText?: string
  required?: boolean
  disabled?: boolean
}

/**
 * Data fetching state
 */
export interface FetchState<T> {
  data: T | null
  status: Status
  error: Error | null
}

/**
 * Modal/Dialog props
 */
export interface ModalProps extends BaseProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
}

/**
 * Toast/Notification props
 */
export interface ToastProps {
  title?: string
  description: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}
