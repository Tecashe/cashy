"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Archive, Star, X } from "lucide-react"
import { cn } from "@/lib/utils"

type Tag = {
  id: string
  name: string
  color: string
}

interface InboxFiltersProps {
  onFilterChange: (filters: {
    search?: string
    tagIds?: string[]
    isRead?: boolean
    archived?: boolean
    starred?: boolean
  }) => void
  tags: Tag[]
}

export function InboxFilters({ onFilterChange, tags }: InboxFiltersProps) {
  const [search, setSearch] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [readFilter, setReadFilter] = useState<string>("all")
  const [starredFilter, setStarredFilter] = useState(false)
  const [archivedFilter, setArchivedFilter] = useState(false)

  const applyFilters = () => {
    const filters: any = {}

    if (search) filters.search = search
    if (selectedTags.length > 0) filters.tagIds = selectedTags
    if (readFilter === "read") filters.isRead = true
    if (readFilter === "unread") filters.isRead = false
    if (starredFilter) filters.starred = true
    if (archivedFilter) filters.archived = true

    onFilterChange(filters)
  }

  const clearFilters = () => {
    setSearch("")
    setSelectedTags([])
    setReadFilter("all")
    setStarredFilter(false)
    setArchivedFilter(false)
    onFilterChange({})
  }

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]))
  }

  const hasActiveFilters = search || selectedTags.length > 0 || readFilter !== "all" || starredFilter || archivedFilter

  return (
    <div className="border-b border-border bg-card">
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              className="pl-9"
            />
          </div>
          <Button onClick={applyFilters}>
            <Filter className="h-4 w-4 mr-2" />
            Apply
          </Button>
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <Select value={readFilter} onValueChange={setReadFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Read status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All messages</SelectItem>
              <SelectItem value="unread">Unread only</SelectItem>
              <SelectItem value="read">Read only</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant={starredFilter ? "default" : "outline"}
            size="sm"
            onClick={() => setStarredFilter(!starredFilter)}
          >
            <Star className={cn("h-4 w-4 mr-2", starredFilter && "fill-current")} />
            Starred
          </Button>

          <Button
            variant={archivedFilter ? "default" : "outline"}
            size="sm"
            onClick={() => setArchivedFilter(!archivedFilter)}
          >
            <Archive className="h-4 w-4 mr-2" />
            Archived
          </Button>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Tags:</span>
            {tags.map((tag) => (
              <Badge
                key={tag.id}
                variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                className="cursor-pointer"
                style={
                  selectedTags.includes(tag.id)
                    ? { backgroundColor: tag.color, borderColor: tag.color }
                    : { borderColor: tag.color, color: tag.color }
                }
                onClick={() => toggleTag(tag.id)}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
