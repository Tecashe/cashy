"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, ExternalLink, Image as ImageIcon, Download, Loader2 } from "lucide-react"

interface PexelsPhoto {
    id: number
    alt: string
    photographer: string
    photographer_url: string
    src: {
        medium: string
        small: string
        large2x: string
        original: string
    }
}

export function PexelsWidget() {
    const [query, setQuery] = useState("business")
    const [photos, setPhotos] = useState<PexelsPhoto[]>([])
    const [loading, setLoading] = useState(false)
    const [searched, setSearched] = useState(false)

    const search = async (q = query, page = 1) => {
        setLoading(true)
        setSearched(true)
        try {
            const res = await fetch(`/api/admin/pexels?query=${encodeURIComponent(q)}&page=${page}`)
            const data = await res.json()
            if (data.error) {
                setPhotos([])
            } else {
                setPhotos(data.photos || [])
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-emerald-500" />
                    Pexels Stock Photos
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            className="pl-9"
                            placeholder="Search photos..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && search()}
                        />
                    </div>
                    <Button onClick={() => search()} disabled={loading}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
                    </Button>
                </div>

                {!searched && (
                    <div className="text-center py-8 text-muted-foreground">
                        <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>Search for stock photos to use in your content</p>
                        <div className="flex gap-2 justify-center mt-3 flex-wrap">
                            {["business", "technology", "ecommerce", "social media", "marketing"].map((tag) => (
                                <Badge
                                    key={tag}
                                    variant="outline"
                                    className="cursor-pointer"
                                    onClick={() => { setQuery(tag); search(tag) }}
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {searched && !loading && photos.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>No photos found. Try a different search term.</p>
                    </div>
                )}

                {photos.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {photos.map((photo) => (
                            <div key={photo.id} className="group relative rounded-lg overflow-hidden border aspect-square">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={photo.src.small}
                                    alt={photo.alt || "Pexels photo"}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <a
                                        href={photo.src.original}
                                        download
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Download className="w-4 h-4 text-white" />
                                    </a>
                                    <a
                                        href={photo.photographer_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4 text-white" />
                                    </a>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80">
                                    <p className="text-white text-xs truncate">{photo.photographer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {photos.length > 0 && (
                    <p className="text-xs text-muted-foreground text-center">
                        Photos from{" "}
                        <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer" className="underline">
                            Pexels
                        </a>
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
