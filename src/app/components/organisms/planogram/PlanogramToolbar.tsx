// File: src/app/components/organisms/planogram/PlanogramToolbar.tsx
import * as React from "react"
import { Button } from "@/app/components/atoms/buttons"
import { cn } from "@/lib/utils/cn"
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Save,
  Grid,
  MousePointer,
  Trash2
} from "lucide-react"

export interface PlanogramToolbarProps {
  onZoomIn?: () => void
  onZoomOut?: () => void
  onReset?: () => void
  onSave?: () => void
  onToggleGrid?: () => void
  showGrid?: boolean
  onToggleSelect?: () => void
  isSelectMode?: boolean
  onDelete?: () => void
  canDelete?: boolean
  className?: string
}

export function PlanogramToolbar({
  onZoomIn,
  onZoomOut,
  onReset,
  onSave,
  onToggleGrid,
  showGrid = true,
  onToggleSelect,
  isSelectMode = false,
  onDelete,
  canDelete = false,
  className,
}: PlanogramToolbarProps) {
  return (
    <div 
      className={cn(
        "flex items-center gap-2 p-2 bg-background border rounded-lg",
        className
      )}
    >
      <div className="flex items-center gap-1 border-r pr-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onZoomIn}
          title="Zoom in"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onZoomOut}
          title="Zoom out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-1 border-r pr-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleGrid}
          title={showGrid ? "Hide grid" : "Show grid"}
          className={showGrid ? "bg-accent" : ""}
        >
          <Grid className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSelect}
          title={isSelectMode ? "Exit select mode" : "Enter select mode"}
          className={isSelectMode ? "bg-accent" : ""}
        >
          <MousePointer className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onReset}
          title="Reset view"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onSave}
          title="Save changes"
        >
          <Save className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          disabled={!canDelete}
          title="Delete selected"
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}