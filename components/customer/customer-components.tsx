"use client"

import { useState } from "react"
import { updateCustomer, addInternalNote, addReminder } from "@/actions/customer-actions"
import {
  Star,
  Crown,
  Tag as TagIcon,
  MessageSquare,
  Clock,
  Zap,
  TrendingUp,
  StickyNote,
  Bell,
  Plus,
  X,
} from "lucide-react"
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

// Customer Profile Header
export function CustomerProfileHeader({ customer }: { customer: any }) {
  const [isVip, setIsVip] = useState(customer.isVip)
  const [isStarred, setIsStarred] = useState(customer.starred)
  const [status, setStatus] = useState(customer.status)
  const [category, setCategory] = useState(customer.category)

  const handleVipToggle = async () => {
    setIsVip(!isVip)
    await updateCustomer(customer.id, { isVip: !isVip })
  }

  const handleStarToggle = async () => {
    setIsStarred(!isStarred)
    await updateCustomer(customer.id, { starred: !isStarred })
  }

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus)
    await updateCustomer(customer.id, { status: newStatus })
  }

  const handleCategoryChange = async (newCategory: string) => {
    setCategory(newCategory)
    await updateCustomer(customer.id, { category: newCategory })
  }

  return (
    <div className="bg-card border border-border rounded-xl p-8">
      <div className="flex items-start gap-6">
        {/* Avatar */}
        <div className="relative">
          {customer.participantAvatar ? (
            <img
              src={customer.participantAvatar}
              alt={customer.participantName}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-orange/20 flex items-center justify-center">
              <span className="text-3xl font-bold text-orange">
                {customer.participantName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          {isVip && (
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow flex items-center justify-center">
              <Crown className="w-5 h-5 text-background" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{customer.participantName}</h1>
              <button
                onClick={handleStarToggle}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Star
                  className={`w-5 h-5 ${
                    isStarred ? "fill-yellow text-yellow" : "text-muted-foreground"
                  }`}
                />
              </button>
              <button
                onClick={handleVipToggle}
                className={`px-3 py-1 rounded-lg font-medium text-sm transition-colors ${
                  isVip
                    ? "bg-yellow text-background"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {isVip ? "VIP" : "Mark as VIP"}
              </button>
            </div>
            <p className="text-muted-foreground">@{customer.participantUsername}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {customer.tags.map((tag: any) => (
              <span
                key={tag.id}
                className="px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1.5"
                style={{
                  backgroundColor: `${tag.color}20`,
                  color: tag.color,
                }}
              >
                <TagIcon className="w-3.5 h-3.5" />
                {tag.name}
              </span>
            ))}
            <button className="px-3 py-1 rounded-lg text-sm font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              Add Tag
            </button>
          </div>

          {/* Status & Category */}
          <div className="flex gap-3">
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange/50"
            >
              <option value="open">Open</option>
              <option value="awaiting_response">Awaiting Response</option>
              <option value="resolved">Resolved</option>
            </select>
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange/50"
            >
              <option value="general">General</option>
              <option value="sales">Sales</option>
              <option value="support">Support</option>
              <option value="collaboration">Collaboration</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

// Customer Stats
export function CustomerStats({ stats }: { stats: any }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        icon={MessageSquare}
        label="Total Messages"
        value={stats.totalMessages}
        color="orange"
        subtitle={`${stats.customerMessages} received, ${stats.businessMessages} sent`}
      />
      <StatCard
        icon={Clock}
        label="Avg Response Time"
        value={`${stats.avgResponseTime}m`}
        color="green"
        subtitle="Average reply speed"
      />
      <StatCard
        icon={Zap}
        label="AI Responses"
        value={stats.aiMessages}
        color="purple"
        subtitle={`${stats.automationMessages} automated`}
      />
      <StatCard
        icon={TrendingUp}
        label="Days Active"
        value={stats.daysSinceFirstContact}
        color="yellow"
        subtitle={`Last: ${stats.daysSinceLastMessage}d ago`}
      />
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  subtitle,
}: {
  icon: any
  label: string
  value: string | number
  color: string
  subtitle?: string
}) {
  const colorClasses: Record<string, string> = {
    orange: "bg-orange/10 text-orange",
    green: "bg-green/10 text-green",
    purple: "bg-purple/10 text-purple",
    yellow: "bg-yellow/10 text-yellow",
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  )
}

// Customer Activity Chart
export function CustomerActivityChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
        <XAxis dataKey="date" stroke="#a3a3a3" fontSize={12} />
        <YAxis stroke="#a3a3a3" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#141414",
            border: "1px solid #262626",
            borderRadius: "0.5rem",
          }}
        />
        <Area type="monotone" dataKey="count" stroke="#ff6b35" fill="#ff6b35" fillOpacity={0.6} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// Customer Timeline
export function CustomerTimeline({ messages }: { messages: any[] }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold">Conversation History</h3>
      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {messages.slice(0, 50).map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.isFromUser ? "flex-row-reverse" : ""}`}
          >
            <div className={`flex-1 ${message.isFromUser ? "text-right" : ""}`}>
              <div
                className={`inline-block px-4 py-2.5 rounded-lg ${
                  message.isFromUser
                    ? "bg-orange text-background"
                    : "bg-muted text-foreground"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                {message.isFromUser ? (
                  <span className="ml-auto">You</span>
                ) : (
                  <span>Customer</span>
                )}
                <span>•</span>
                <span>{new Date(message.timestamp).toLocaleString()}</span>
                {message.sentByAI && (
                  <>
                    <span>•</span>
                    <span className="text-purple">AI Generated</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Customer Notes
export function CustomerNotes({
  conversationId,
  notes,
}: {
  conversationId: string
  notes: any[]
}) {
  const [isAdding, setIsAdding] = useState(false)
  const [noteContent, setNoteContent] = useState("")

  const handleAddNote = async () => {
    if (!noteContent.trim()) return
    await addInternalNote(conversationId, noteContent)
    setNoteContent("")
    setIsAdding(false)
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Internal Notes</h3>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>

      {isAdding && (
        <div className="space-y-2">
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Add a note..."
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange/50 min-h-[80px]"
          />
          <button
            onClick={handleAddNote}
            className="w-full px-4 py-2 bg-orange text-background rounded-lg font-medium hover:bg-orange/90 transition-colors"
          >
            Save Note
          </button>
        </div>
      )}

      <div className="space-y-3">
        {notes.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No notes yet</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="p-3 bg-muted rounded-lg">
              <p className="text-sm">{note.content}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(note.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// Customer Reminders
export function CustomerReminders({
  conversationId,
  reminders,
}: {
  conversationId: string
  reminders: any[]
}) {
  const [isAdding, setIsAdding] = useState(false)
  const [reminderMessage, setReminderMessage] = useState("")
  const [reminderDate, setReminderDate] = useState("")

  const handleAddReminder = async () => {
    if (!reminderMessage.trim() || !reminderDate) return
    await addReminder(conversationId, reminderMessage, new Date(reminderDate))
    setReminderMessage("")
    setReminderDate("")
    setIsAdding(false)
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Reminders</h3>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          {isAdding ? <X className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
        </button>
      </div>

      {isAdding && (
        <div className="space-y-2">
          <input
            type="text"
            value={reminderMessage}
            onChange={(e) => setReminderMessage(e.target.value)}
            placeholder="Reminder message..."
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange/50"
          />
          <input
            type="datetime-local"
            value={reminderDate}
            onChange={(e) => setReminderDate(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange/50"
          />
          <button
            onClick={handleAddReminder}
            className="w-full px-4 py-2 bg-orange text-background rounded-lg font-medium hover:bg-orange/90 transition-colors"
          >
            Set Reminder
          </button>
        </div>
      )}

      <div className="space-y-3">
        {reminders.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No reminders set</p>
        ) : (
          reminders.map((reminder) => (
            <div key={reminder.id} className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">{reminder.message}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(reminder.remindAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}