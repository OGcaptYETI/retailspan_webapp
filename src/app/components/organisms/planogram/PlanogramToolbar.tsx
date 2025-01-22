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
  Trash2,
  Undo,
  Redo
} from "lucide-react"
import { Tooltip } from "@/app/components/atoms/tooltip/tooltip"

export interface PlanogramToolbarProps {
  scale: number
  onZoomIn?: () => void
  onZoomOut?: () => void
  onReset?: () => void
  onResetZoom: () => void
  onSave?: () => Promise<void>
  onToggleGrid?: () => void
  showGrid?: boolean
  onToggleSelect?: () => void
  isSelectMode?: boolean
  onDelete?: () => void
  canDelete?: boolean
  className?: string
  zoomInDisabled?: boolean
  zoomOutDisabled?: boolean
  onUndo?: () => void
  onRedo?: () => void
  canUndo?: boolean
  canRedo?: boolean
}

export function PlanogramToolbar({
  scale,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onSave,
  onToggleGrid,
  showGrid = true,
  onToggleSelect,
  isSelectMode = false,
  onDelete,
  canDelete = false,
  className,
  zoomInDisabled = false,
  zoomOutDisabled = false,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}: PlanogramToolbarProps): JSX.Element {
  return (
    <div 
      className={cn(
        "flex items-center justify-between gap-2 p-2 bg-background border rounded-lg shadow-sm",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Tooltip content="Save (Ctrl+S)">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSave}
            disabled={!onSave}
          >
            <Save className="h-4 w-4" />
          </Button>
        </Tooltip>

        <div className="h-4 w-px bg-border" />

        <Tooltip content="Undo (Ctrl+Z)">
          <Button
            variant="ghost"
            size="icon"
            onClick={onUndo}
            disabled={!canUndo}
          >
            <Undo className="h-4 w-4" />
          </Button>
        </Tooltip>

        <Tooltip content="Redo (Ctrl+Y)">
          <Button
            variant="ghost"
            size="icon"
            onClick={onRedo}
            disabled={!canRedo}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </Tooltip>

        <div className="h-4 w-px bg-border" />

        <Tooltip content="Zoom In (+)">
          <Button
            variant="ghost"
            size="icon"
            onClick={onZoomIn}
            disabled={zoomInDisabled}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </Tooltip>

        <div className="flex items-center min-w-[3rem] justify-center">
          {Math.round(scale * 100)}%
        </div>

        <Tooltip content="Zoom Out (-)">
          <Button
            variant="ghost"
            size="icon"
            onClick={onZoomOut}
            disabled={zoomOutDisabled}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
        </Tooltip>

        <Tooltip content="Reset Zoom (Ctrl+0)">
          <Button
            variant="ghost"
            size="icon"
            onClick={onResetZoom}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </Tooltip>

        <div className="h-4 w-px bg-border" />

        <Tooltip content="Toggle Grid (G)">
          <Button
            variant={showGrid ? "default" : "ghost"}
            size="icon"
            onClick={onToggleGrid}
          >
            <Grid className="h-4 w-4" />
          </Button>
        </Tooltip>

        <Tooltip content="Select Mode (V)">
          <Button
            variant={isSelectMode ? "default" : "ghost"}
            size="icon"
            onClick={onToggleSelect}
          >
            <MousePointer className="h-4 w-4" />
          </Button>
        </Tooltip>

        <div className="h-4 w-px bg-border" />

        <Tooltip content="Delete Selected (Del)">
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            disabled={!canDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </Tooltip>
      </div>
    </div>
  )
}