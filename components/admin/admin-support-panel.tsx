"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
    Headphones,
    Clock,
    CheckCircle2,
    AlertCircle,
    MessageSquare,
    Send,
    User,
    Shield,
    ChevronLeft
} from "lucide-react"

interface Ticket {
    id: string
    subject: string
    description: string
    status: string
    priority: string
    category: string
    customerName: string
    assignedTo: string | null
    createdAt: string
    updatedAt: string
    user: { email: string; firstName: string | null; lastName: string | null }
    _count: { messages: number }
}

interface TicketMsg {
    id: string
    content: string
    senderRole: string
    senderId: string
    isInternal: boolean
    createdAt: string
}

const statusColors: Record<string, string> = {
    open: "bg-red-500/10 text-red-600 border-red-500/20",
    in_progress: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    resolved: "bg-green-500/10 text-green-600 border-green-500/20",
    closed: "bg-gray-500/10 text-gray-600 border-gray-500/20",
}

const priorityColors: Record<string, string> = {
    low: "text-blue-500",
    medium: "text-yellow-500",
    high: "text-orange-500",
    urgent: "text-red-500",
}

export function AdminSupportPanel({ initialTickets }: { initialTickets: Ticket[] }) {
    const [tickets, setTickets] = useState(initialTickets)
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
    const [messages, setMessages] = useState<TicketMsg[]>([])
    const [reply, setReply] = useState("")
    const [loading, setLoading] = useState(false)
    const [filter, setFilter] = useState("all")

    const fetchMessages = useCallback(async (ticketId: string) => {
        const res = await fetch(`/api/admin/support/${ticketId}/messages`)
        const data = await res.json()
        setMessages(data.messages || [])
    }, [])

    const selectTicket = (ticket: Ticket) => {
        setSelectedTicket(ticket)
        fetchMessages(ticket.id)
    }

    const sendReply = async () => {
        if (!reply.trim() || !selectedTicket) return
        setLoading(true)
        try {
            const res = await fetch(`/api/admin/support/${selectedTicket.id}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: reply }),
            })
            if (res.ok) {
                const data = await res.json()
                setMessages((prev) => [...prev, data.message])
                setReply("")
            }
        } finally {
            setLoading(false)
        }
    }

    const updateStatus = async (ticketId: string, status: string) => {
        const res = await fetch(`/api/admin/support/${ticketId}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        })
        if (res.ok) {
            setTickets((prev) =>
                prev.map((t) => (t.id === ticketId ? { ...t, status } : t))
            )
            if (selectedTicket?.id === ticketId) {
                setSelectedTicket((prev) => (prev ? { ...prev, status } : null))
            }
        }
    }

    const filtered = filter === "all" ? tickets : tickets.filter((t) => t.status === filter)

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
            {/* Ticket List */}
            <div className="lg:col-span-1 space-y-3">
                <div className="flex gap-1 flex-wrap">
                    {["all", "open", "in_progress", "resolved", "closed"].map((s) => (
                        <Button
                            key={s}
                            variant={filter === s ? "default" : "outline"}
                            size="sm"
                            className="text-xs capitalize"
                            onClick={() => setFilter(s)}
                        >
                            {s.replace("_", " ")}
                        </Button>
                    ))}
                </div>
                <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-280px)]">
                    {filtered.map((ticket) => (
                        <Card
                            key={ticket.id}
                            className={`cursor-pointer transition-all hover:border-violet-500/50 ${selectedTicket?.id === ticket.id ? "border-violet-500 bg-violet-500/5" : ""}`}
                            onClick={() => selectTicket(ticket)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">{ticket.subject}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {ticket.user.firstName || ticket.user.email} · {ticket.category}
                                        </p>
                                    </div>
                                    <Badge variant="outline" className={`text-[10px] shrink-0 ml-2 ${statusColors[ticket.status] || ""}`}>
                                        {ticket.status.replace("_", " ")}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                    <span className={priorityColors[ticket.priority]}>{ticket.priority}</span>
                                    <span>·</span>
                                    <span className="flex items-center gap-1">
                                        <MessageSquare className="w-3 h-3" />
                                        {ticket._count.messages}
                                    </span>
                                    <span>·</span>
                                    <span><Clock className="w-3 h-3 inline" /> {new Date(ticket.createdAt).toLocaleDateString()}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {filtered.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            <Headphones className="w-10 h-10 mx-auto mb-2 opacity-30" />
                            <p className="text-sm">No tickets found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Ticket Detail */}
            <div className="lg:col-span-2">
                {selectedTicket ? (
                    <Card className="h-full flex flex-col">
                        <CardHeader className="border-b">
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-lg">{selectedTicket.subject}</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        From: {selectedTicket.user.firstName || selectedTicket.user.email} · {selectedTicket.category}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    {["open", "in_progress", "resolved", "closed"].map((s) => (
                                        <Button
                                            key={s}
                                            variant={selectedTicket.status === s ? "default" : "outline"}
                                            size="sm"
                                            className="text-xs capitalize"
                                            onClick={() => updateStatus(selectedTicket.id, s)}
                                        >
                                            {s.replace("_", " ")}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                            {/* Original description */}
                            <div className="bg-muted/50 rounded-lg p-4">
                                <p className="text-xs font-medium text-muted-foreground mb-1">Original Request</p>
                                <p className="text-sm whitespace-pre-wrap">{selectedTicket.description}</p>
                            </div>

                            {/* Messages */}
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex gap-3 ${msg.senderRole !== "USER" ? "justify-end" : ""}`}
                                >
                                    {msg.senderRole === "USER" && (
                                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0">
                                            <User className="w-4 h-4" />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[70%] rounded-xl px-4 py-3 ${msg.senderRole !== "USER"
                                            ? "bg-violet-600 text-white"
                                            : "bg-muted"
                                            }`}
                                    >
                                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                        <p className={`text-[10px] mt-1 ${msg.senderRole !== "USER" ? "text-violet-200" : "text-muted-foreground"}`}>
                                            {new Date(msg.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    {msg.senderRole !== "USER" && (
                                        <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center shrink-0">
                                            <Shield className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </CardContent>

                        {/* Reply input */}
                        <div className="border-t p-4">
                            <div className="flex gap-2">
                                <Textarea
                                    placeholder="Type your reply..."
                                    value={reply}
                                    onChange={(e) => setReply(e.target.value)}
                                    className="resize-none"
                                    rows={2}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) sendReply()
                                    }}
                                />
                                <Button
                                    onClick={sendReply}
                                    disabled={loading || !reply.trim()}
                                    className="px-4 bg-violet-600 hover:bg-violet-700"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-1">Press Ctrl+Enter to send</p>
                        </div>
                    </Card>
                ) : (
                    <Card className="h-full flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                            <Headphones className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p>Select a ticket to view details</p>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    )
}
