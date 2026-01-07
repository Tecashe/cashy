"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Star, MessageSquare, Clock, TrendingUp, Crown, Tag as TagIcon, MoreVertical, Mail } from "lucide-react"
import { useNavigation } from "@/hooks/use-navigation"

// Customer Segments Component
export function CustomerSegments({ segments }: { segments: any }) {
  const { buildHref } = useNavigation()

  const segmentData = [
  { label: "All", value: segments.all, href: buildHref("/customers"), color: "bg-orange" },
  { label: "VIP", value: segments.vip, href: buildHref("/customers?vip=true"), color: "bg-yellow" },
  { label: "Active", value: segments.active, href: buildHref("/customers?segment=active"), color: "bg-green" },
  { label: "Inactive", value: segments.inactive, href: buildHref("/customers?segment=inactive"), color: "bg-red" },
  { label: "High Value", value: segments.high_value, href: buildHref("/customers?segment=high_value"), color: "bg-purple" },
  { label: "At Risk", value: segments.at_risk, href: buildHref("/customers?segment=at_risk"), color: "bg-maroon" },
  { label: "Unread", value: segments.unread, href: buildHref("/customers?unread=true"), color: "bg-orange" },
  { label: "Starred", value: segments.starred, href: buildHref("/customers?starred=true"), color: "bg-yellow" },
]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {segmentData.map((segment) => (
        <Link
          key={segment.label}
          href={segment.href}
          className="bg-card border border-border rounded-xl p-4 hover:border-orange/50 transition-all group"
        >
          <div className="space-y-2">
            <div className={`w-8 h-8 rounded-lg ${segment.color}/20 flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <div className={`w-2 h-2 rounded-full ${segment.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold">{segment.value}</p>
              <p className="text-xs text-muted-foreground">{segment.label}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

// Customer Filters Component
export function CustomerFilters({ tags, initialSearch }: { tags: any[]; initialSearch?: string }) {
  const router = useRouter()
  const [search, setSearch] = useState(initialSearch || "")
  const { buildHref } = useNavigation()

  const handleSearch = (value: string) => {
    setSearch(value)
    const params = new URLSearchParams(window.location.search)
    if (value) {
      params.set("search", value)
    } else {
      params.delete("search")
    }
    // router.push(`/customers?${params.toString()}`) 
    router.push(buildHref(`/customers?${params.toString()}`))

  }

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search customers by name or username..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/50"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Sort Dropdown */}
        <select
          className="px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/50"
          onChange={(e) => {
            const params = new URLSearchParams(window.location.search)
            params.set("sort", e.target.value)
           router.push(buildHref(`/customers?${params.toString()}`))
          }}
        >
          <option value="recent">Most Recent</option>
          <option value="oldest">Oldest First</option>
          <option value="mostMessages">Most Messages</option>
          <option value="priority">Highest Priority</option>
        </select>
      </div>
    </div>
  )
}

// Customer Card Component
export function CustomerCard({ customer }: { customer: any }) {
  const [isStarred, setIsStarred] = useState(customer.starred)
  const { buildHref } = useNavigation()

  const getEngagementColor = (score: number) => {
    if (score >= 70) return "text-green"
    if (score >= 40) return "text-yellow"
    return "text-red"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-orange/20 text-orange"
      case "awaiting_response":
        return "bg-yellow/20 text-yellow"
      case "resolved":
        return "bg-green/20 text-green"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <Link
      href={buildHref(`/customers/${customer.id}`)}
      className="bg-card border border-border rounded-xl p-5 hover:border-orange/50 transition-all group"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="relative">
            {customer.participantAvatar ? (
              <img
                src={customer.participantAvatar}
                alt={customer.participantName}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-orange/20 flex items-center justify-center">
                <span className="text-lg font-bold text-orange">
                  {customer.participantName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            {customer.isVip && (
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-yellow flex items-center justify-center">
                <Crown className="w-3 h-3 text-background" />
              </div>
            )}
          </div>

          {/* Name & Actions */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold truncate group-hover:text-orange transition-colors">
                {customer.participantName}
              </h3>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  setIsStarred(!isStarred)
                }}
                className="flex-shrink-0"
              >
                <Star
                  className={`w-4 h-4 transition-colors ${
                    isStarred ? "fill-yellow text-yellow" : "text-muted-foreground hover:text-yellow"
                  }`}
                />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">@{customer.participantUsername}</p>
          </div>
        </div>

        {/* Last Message */}
        {customer.lastMessageText && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {customer.lastMessageText}
          </p>
        )}

        {/* Tags */}
        {customer.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {customer.tags.slice(0, 3).map((tag: any) => (
              <span
                key={tag.id}
                className="px-2 py-1 rounded text-xs font-medium"
                style={{
                  backgroundColor: `${tag.color}20`,
                  color: tag.color,
                }}
              >
                {tag.name}
              </span>
            ))}
            {customer.tags.length > 3 && (
              <span className="px-2 py-1 rounded text-xs font-medium bg-muted text-muted-foreground">
                +{customer.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="text-xs">Messages</span>
            </div>
            <p className="text-sm font-semibold">{customer.messageCount}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="text-xs">Engagement</span>
            </div>
            <p className={`text-sm font-semibold ${getEngagementColor(customer.engagementScore)}`}>
              {customer.engagementScore}%
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            {customer.daysSinceLastMessage === 0
              ? "Today"
              : customer.daysSinceLastMessage === 1
              ? "Yesterday"
              : `${customer.daysSinceLastMessage}d ago`}
          </div>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(customer.status)}`}>
            {customer.status.replace("_", " ")}
          </span>
        </div>

        {/* Unread Badge */}
        {customer.unreadCount > 0 && (
          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-orange flex items-center justify-center">
            <span className="text-xs font-bold text-background">{customer.unreadCount}</span>
          </div>
        )}
      </div>
    </Link>
  )
}