"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Filter, X, Star, AlertCircle, Zap, Clock, Tag, Archive, CheckCircle2, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

interface AdvancedFiltersPanelProps {
  onFiltersChange: (filters: any) => void
  currentFilters: any
  tags: Array<{ id: string; name: string; color: string }>
}

export function AdvancedFiltersPanel({ onFiltersChange, currentFilters, tags }: AdvancedFiltersPanelProps) {
  const [showFilters, setShowFilters] = useState(false)

  const quickFilters = [
    {
      id: "highPriority",
      label: "High Priority",
      icon: AlertCircle,
      color: "text-red-500",
      filter: { sortBy: "priority", minPriority: 70 },
    },
    {
      id: "needsResponse",
      label: "Needs Response",
      icon: Clock,
      color: "text-orange-500",
      filter: { status: "open", isRead: false },
    },
    { id: "vip", label: "VIP Customers", icon: Star, color: "text-yellow-500", filter: { isVip: true } },
    { id: "followUp", label: "Follow-up Due", icon: Zap, color: "text-blue-500", filter: { hasReminder: true } },
  ]

  const categories = [
    { id: "sales", label: "Sales Intent", color: "bg-green-500" },
    { id: "support", label: "Support", color: "bg-blue-500" },
    { id: "collaboration", label: "Collaboration", color: "bg-purple-500" },
    { id: "general", label: "General", color: "bg-gray-500" },
  ]

  const statuses = [
    { id: "open", label: "Open", icon: Circle },
    { id: "pending", label: "Pending", icon: Clock },
    { id: "resolved", label: "Resolved", icon: CheckCircle2 },
  ]

  const toggleFilter = (key: string, value: any) => {
    const newFilters = { ...currentFilters }
    if (newFilters[key] === value) {
      delete newFilters[key]
    } else {
      Object.assign(newFilters, typeof value === "object" ? value : { [key]: value })
    }
    onFiltersChange(newFilters)
  }

  const clearAllFilters = () => {
    onFiltersChange({})
  }

  const activeFilterCount = Object.keys(currentFilters).length

  return (
    <div className="border-b border-border/50 bg-card/50 backdrop-blur-xl">
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="h-8 hover:bg-accent/50"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="default" className="ml-2 h-5 px-1.5 shadow-sm">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-8 text-muted-foreground">
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {showFilters && (
        <ScrollArea className="max-h-[300px]">
          <div className="px-3 pb-3 space-y-4">
            {/* Quick Filters with glassmorphism */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Quick Filters</p>
              <div className="grid grid-cols-2 gap-2">
                {quickFilters.map((filter) => {
                  const Icon = filter.icon
                  const isActive = JSON.stringify(currentFilters).includes(JSON.stringify(filter.filter).slice(1, -1))
                  return (
                    <Button
                      key={filter.id}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleFilter("quickFilter", filter.filter)}
                      className={cn(
                        "justify-start h-auto py-2 shadow-sm backdrop-blur-sm",
                        !isActive && "hover:border-primary/50 bg-card/50",
                        isActive && "shadow-md",
                      )}
                    >
                      <Icon className={cn("h-4 w-4 mr-2", isActive ? "" : filter.color)} />
                      <span className="text-xs">{filter.label}</span>
                    </Button>
                  )
                })}
              </div>
            </div>

            <Separator />

            {/* Categories with improved styling */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Category</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const isActive = currentFilters.category === cat.id
                  return (
                    <button
                      key={cat.id}
                      onClick={() => toggleFilter("category", cat.id)}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all shadow-sm",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-md scale-105"
                          : "bg-card/50 backdrop-blur-sm hover:bg-card border border-border/50 text-secondary-foreground hover:scale-105",
                      )}
                    >
                      <div className={cn("h-2 w-2 rounded-full", cat.color)} />
                      {cat.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <Separator />

            {/* Status */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Status</p>
              <div className="flex flex-wrap gap-2">
                {statuses.map((status) => {
                  const Icon = status.icon
                  const isActive = currentFilters.status === status.id
                  return (
                    <Button
                      key={status.id}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleFilter("status", status.id)}
                      className={cn("h-8 shadow-sm", isActive && "shadow-md")}
                    >
                      <Icon className="h-3 w-3 mr-1.5" />
                      {status.label}
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <>
                <Separator />
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide flex items-center gap-2">
                    <Tag className="h-3 w-3" />
                    Tags
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => {
                      const isActive = currentFilters.tagIds?.includes(tag.id)
                      return (
                        <button
                          key={tag.id}
                          onClick={() => {
                            const currentTags = currentFilters.tagIds || []
                            const newTags = isActive
                              ? currentTags.filter((id: string) => id !== tag.id)
                              : [...currentTags, tag.id]
                            toggleFilter("tagIds", newTags.length > 0 ? newTags : undefined)
                          }}
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all border shadow-sm",
                            isActive
                              ? "shadow-md scale-105"
                              : "bg-card/50 backdrop-blur-sm hover:bg-card hover:scale-105 border-border/50",
                          )}
                          style={isActive ? { backgroundColor: tag.color, borderColor: tag.color, color: "white" } : {}}
                        >
                          {tag.name}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Additional Filters */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={currentFilters.starred ? "default" : "outline"}
                size="sm"
                onClick={() => toggleFilter("starred", !currentFilters.starred || undefined)}
                className={cn("h-8 shadow-sm", currentFilters.starred && "shadow-md")}
              >
                <Star className="h-3 w-3 mr-1.5" />
                Starred
              </Button>
              <Button
                variant={currentFilters.isRead === false ? "default" : "outline"}
                size="sm"
                onClick={() => toggleFilter("isRead", currentFilters.isRead === false ? undefined : false)}
                className={cn("h-8 shadow-sm", currentFilters.isRead === false && "shadow-md")}
              >
                Unread Only
              </Button>
              <Button
                variant={currentFilters.archived ? "default" : "outline"}
                size="sm"
                onClick={() => toggleFilter("archived", !currentFilters.archived || undefined)}
                className={cn("h-8 shadow-sm", currentFilters.archived && "shadow-md")}
              >
                <Archive className="h-3 w-3 mr-1.5" />
                Archived
              </Button>
            </div>
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
