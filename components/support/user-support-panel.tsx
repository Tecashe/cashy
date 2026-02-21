"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
    Headphones,
    Plus,
    Clock,
    MessageSquare,
    Send,
    User,
    Shield,
    CheckCircle2,
} from "lucide-react"

interface Ticket {
    id: string
    subject: string
    description: string
    status: string
    priority: string
    category: string
    createdAt: string
    _count: { messages: number }
}

interface TicketMsg {
    id: string
    content: string
    senderRole: string
    createdAt: string
}

export function UserSupportPanel({ userId }: { userId: string }) {
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
    const [messages, setMessages] = useState<TicketMsg[]>([])
    const [showForm, setShowForm] = useState(false)
    const [subject, setSubject] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("general")
    const [priority, setPriority] = useState("medium")
    const [reply, setReply] = useState("")
    const [loading, setLoading] = useState(true)

    const fetchTickets = async () => {
        const res = await fetch("/api/support/tickets")
        const data = await res.json()
        setTickets(data.tickets || [])
        setLoading(false)
    }

    useEffect(() => {
        fetchTickets()
    }, [])

    const createTicket = async () => {
        if (!subject.trim() || !description.trim()) return
        setLoading(true)
        try {
            const res = await fetch("/api/support/tickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subject, description, category, priority }),
            })
            if (res.ok) {
                setSubject("")
                setDescription("")
                setShowForm(false)
                fetchTickets()
            }
        } finally {
            setLoading(false)
        }
    }

    const fetchMessages = async (ticketId: string) => {
        const res = await fetch(`/api/support/tickets/${ticketId}/messages`)
        const data = await res.json()
        setMessages(data.messages || [])
    }

    const selectTicket = (ticket: Ticket) => {
        setSelectedTicket(ticket)
        fetchMessages(ticket.id)
    }

    const sendReply = async () => {
        if (!reply.trim() || !selectedTicket) return
        setLoading(true)
        try {
            const res = await fetch(`/api/support/tickets/${selectedTicket.id}/messages`, {
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

    const statusColors: Record<string, string> = {
        open: "bg-red-500/10 text-red-600",
        in_progress: "bg-yellow-500/10 text-yellow-600",
        resolved: "bg-green-500/10 text-green-600",
        closed: "bg-gray-500/10 text-gray-600",
    }

    return (
        <div className="space-y-6">
            {/* Create Ticket Form */}
            {showForm ? (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">New Support Ticket</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
                        <Textarea placeholder="Describe your issue in detail..." value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
                        <div className="flex flex-wrap gap-4">
                            <div>
                                <label className="text-xs text-muted-foreground mb-1 block">Category</label>
                                <select value={category} onChange={(e) => setCategory(e.target.value)} className="text-sm bg-transparent border rounded px-3 py-2">
                                    <option value="general">General</option>
                                    <option value="billing">Billing</option>
                                    <option value="technical">Technical</option>
                                    <option value="account">Account</option>
                                    <option value="feature_request">Feature Request</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground mb-1 block">Priority</label>
                                <select value={priority} onChange={(e) => setPriority(e.target.value)} className="text-sm bg-transparent border rounded px-3 py-2">
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={createTicket} disabled={loading}>Submit Ticket</Button>
                            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Button onClick={() => setShowForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Support Ticket
                </Button>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Ticket List */}
                <div className="space-y-2">
                    {tickets.map((ticket) => (
                        <Card
                            key={ticket.id}
                            className={`cursor-pointer transition-all hover:border-primary/50 ${selectedTicket?.id === ticket.id ? "border-primary bg-primary/5" : ""}`}
                            onClick={() => selectTicket(ticket)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                    <p className="font-medium text-sm truncate flex-1">{ticket.subject}</p>
                                    <Badge variant="outline" className={`text-[10px] ml-2 ${statusColors[ticket.status] || ""}`}>
                                        {ticket.status.replace("_", " ")}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                    <span>{ticket.category}</span>
                                    <span>·</span>
                                    <span className="flex items-center gap-1">
                                        <MessageSquare className="w-3 h-3" /> {ticket._count.messages}
                                    </span>
                                    <span>·</span>
                                    <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {tickets.length === 0 && !loading && (
                        <Card>
                            <CardContent className="p-6 text-center text-muted-foreground">
                                <Headphones className="w-10 h-10 mx-auto mb-2 opacity-30" />
                                <p className="text-sm">No tickets yet</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Messages */}
                <div className="lg:col-span-2">
                    {selectedTicket ? (
                        <Card className="h-[500px] flex flex-col">
                            <CardHeader className="border-b py-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-base">{selectedTicket.subject}</CardTitle>
                                        <p className="text-xs text-muted-foreground">{selectedTicket.category} · {selectedTicket.priority}</p>
                                    </div>
                                    <Badge variant="outline" className={statusColors[selectedTicket.status] || ""}>
                                        {selectedTicket.status.replace("_", " ")}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
                                <div className="bg-muted/50 rounded-lg p-3">
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Original Request</p>
                                    <p className="text-sm whitespace-pre-wrap">{selectedTicket.description}</p>
                                </div>
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`flex gap-2 ${msg.senderRole !== "USER" ? "justify-end" : ""}`}>
                                        {msg.senderRole === "USER" && <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0"><User className="w-3 h-3" /></div>}
                                        <div className={`max-w-[70%] rounded-xl px-3 py-2 ${msg.senderRole !== "USER" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                            <p className="text-[10px] mt-1 opacity-60">{new Date(msg.createdAt).toLocaleString()}</p>
                                        </div>
                                        {msg.senderRole !== "USER" && <div className="w-7 h-7 rounded-full bg-violet-500 flex items-center justify-center shrink-0"><Shield className="w-3 h-3 text-white" /></div>}
                                    </div>
                                ))}
                            </CardContent>
                            {selectedTicket.status !== "closed" && selectedTicket.status !== "resolved" && (
                                <div className="border-t p-3 flex gap-2">
                                    <Textarea placeholder="Reply..." value={reply} onChange={(e) => setReply(e.target.value)} rows={1} className="resize-none" />
                                    <Button onClick={sendReply} disabled={loading || !reply.trim()} size="icon"><Send className="w-4 h-4" /></Button>
                                </div>
                            )}
                        </Card>
                    ) : (
                        <Card className="h-[500px] flex items-center justify-center">
                            <div className="text-center text-muted-foreground">
                                <Headphones className="w-10 h-10 mx-auto mb-2 opacity-30" />
                                <p className="text-sm">Select a ticket to view</p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
