"use client"

import { BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps } from "@xyflow/react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-is-mobile"

interface CustomFlowEdgeProps extends EdgeProps {
  data?: {
    onAddNode?: (edgeId: string) => void
  }
}

export function CustomFlowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: CustomFlowEdgeProps) {
  const isMobile = useMobile()
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          <Button
            size="sm"
            onClick={() => data?.onAddNode?.(id)}
            className={cn(
              "rounded-full p-0 shadow-md opacity-0 hover:opacity-100 transition-opacity",
              "bg-indigo-500 hover:bg-indigo-600",
              "group-hover:opacity-100",
              isMobile ? "w-10 h-10" : "w-8 h-8",
            )}
          >
            <Plus className={cn(isMobile ? "w-5 h-5" : "w-4 h-4", "text-white")} />
          </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
