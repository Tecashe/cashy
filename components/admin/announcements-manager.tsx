"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Megaphone, Plus, Trash2, Pin, Eye, EyeOff } from "lucide-react"

interface AnnouncementData {
    id: string
    title: string
    content: string
    type: string
    isActive: boolean
    isPinned: boolean
    expiresAt: string | null
    createdAt: string
    author: { firstName: string | null; email: string }
}

export function AnnouncementsManager({
    initialAnnouncements,
}: {
    initialAnnouncements: AnnouncementData[]
}) {
    const [announcements, setAnnouncements] = useState(initialAnnouncements)
    const [showForm, setShowForm] = useState(false)
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [type, setType] = useState("info")
    const [loading, setLoading] = useState(false)

    const create = async () => {
        if (!title.trim() || !content.trim()) return
        setLoading(true)
        try {
            const res = await fetch("/api/admin/announcements", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content, type }),
            })
            if (res.ok) {
                const data = await res.json()
                setAnnouncements((prev) => [data.announcement, ...prev])
                setTitle("")
                setContent("")
                setType("info")
                setShowForm(false)
            }
        } finally {
            setLoading(false)
        }
    }

    const toggleActive = async (id: string, isActive: boolean) => {
        const res = await fetch(`/api/admin/announcements/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isActive: !isActive }),
        })
        if (res.ok) {
            setAnnouncements((prev) =>
                prev.map((a) => (a.id === id ? { ...a, isActive: !isActive } : a))
            )
        }
    }

    const togglePin = async (id: string, isPinned: boolean) => {
        const res = await fetch(`/api/admin/announcements/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isPinned: !isPinned }),
        })
        if (res.ok) {
            setAnnouncements((prev) =>
                prev.map((a) => (a.id === id ? { ...a, isPinned: !isPinned } : a))
            )
        }
    }

    const deleteAnnouncement = async (id: string) => {
        const res = await fetch(`/api/admin/announcements/${id}`, {
            method: "DELETE",
        })
        if (res.ok) {
            setAnnouncements((prev) => prev.filter((a) => a.id !== id))
        }
    }

    const typeColors: Record<string, string> = {
        info: "bg-blue-500/10 text-blue-600",
        warning: "bg-yellow-500/10 text-yellow-600",
        success: "bg-green-500/10 text-green-600",
        maintenance: "bg-red-500/10 text-red-600",
    }

    return (
        <div className="space-y-6">
            {/* Create form */}
            {showForm ? (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">New Announcement</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <Textarea
                            placeholder="Announcement content..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={4}
                        />
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Type:</span>
                            {["info", "warning", "success", "maintenance"].map((t) => (
                                <Button
                                    key={t}
                                    variant={type === t ? "default" : "outline"}
                                    size="sm"
                                    className="capitalize"
                                    onClick={() => setType(t)}
                                >
                                    {t}
                                </Button>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={create} disabled={loading} className="bg-violet-600 hover:bg-violet-700">
                                Publish
                            </Button>
                            <Button variant="outline" onClick={() => setShowForm(false)}>
                                Cancel
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Button onClick={() => setShowForm(true)} className="bg-violet-600 hover:bg-violet-700">
                    <Plus className="w-4 h-4 mr-2" />
                    New Announcement
                </Button>
            )}

            {/* List */}
            <div className="space-y-3">
                {announcements.map((a) => (
                    <Card key={a.id} className={`${!a.isActive ? "opacity-50" : ""}`}>
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="outline" className={`text-xs ${typeColors[a.type] || ""}`}>
                                            {a.type}
                                        </Badge>
                                        {a.isPinned && (
                                            <Badge variant="outline" className="text-xs">
                                                <Pin className="w-3 h-3 mr-1" /> Pinned
                                            </Badge>
                                        )}
                                        {!a.isActive && (
                                            <Badge variant="outline" className="text-xs text-gray-500">Hidden</Badge>
                                        )}
                                    </div>
                                    <h3 className="font-semibold">{a.title}</h3>
                                    <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{a.content}</p>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        By {a.author.firstName || a.author.email} · {new Date(a.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => togglePin(a.id, a.isPinned)}
                                        title={a.isPinned ? "Unpin" : "Pin"}
                                    >
                                        <Pin className={`w-4 h-4 ${a.isPinned ? "text-violet-500" : ""}`} />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => toggleActive(a.id, a.isActive)}
                                        title={a.isActive ? "Hide" : "Show"}
                                    >
                                        {a.isActive ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-red-500 hover:text-red-600"
                                        onClick={() => deleteAnnouncement(a.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {announcements.length === 0 && (
                    <Card>
                        <CardContent className="p-8 text-center text-muted-foreground">
                            <Megaphone className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p>No announcements yet. Create one to broadcast to all users.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
