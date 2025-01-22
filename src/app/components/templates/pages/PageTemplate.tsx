// File: src/app/components/templates/pages/PageTemplate.tsx
import * as React from "react"
import { 
  Heading, 
  Text 
} from "@/app/components/atoms/typography"
import { 
  Breadcrumbs,
  type BreadcrumbItem 
} from "@/app/components/molecules/navigation"
import { cn } from "@/lib/utils/cn"

export interface PageTemplateProps {
  title: string
  description?: string
  breadcrumbs?: BreadcrumbItem[]
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function PageTemplate({
  title,
  description,
  breadcrumbs,
  actions,
  children,
  className
}: PageTemplateProps) {
  return (
    <div className={cn("space-y-8", className)}>
      {/* Header */}
      <div className="space-y-2">
        {breadcrumbs && (
          <Breadcrumbs items={breadcrumbs} />
        )}
        
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <Heading level={1}>{title}</Heading>
            {description && (
              <Text className="text-muted-foreground">
                {description}
              </Text>
            )}
          </div>
          
          {actions && (
            <div className="flex items-center gap-4">
              {actions}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {children}
    </div>
  )
}