"use client"

import { useState, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, Trash2, CheckCircle, AlertCircle, X, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface ParsedRow {
    date: string
    amount: number
    description?: string
    product?: string
    customer?: string
    currency?: string
    quantity?: number
}

interface UploadRecord {
    id: string
    fileName: string
    uploadedAt: string
    rowCount: number
    status: string
}

function parseCSV(text: string): ParsedRow[] {
    const lines = text.trim().split(/\r?\n/)
    if (lines.length < 2) return []
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/[^a-z0-9]/g, ""))
    const rows: ParsedRow[] = []

    for (let i = 1; i < lines.length; i++) {
        const vals = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""))
        const obj: Record<string, string> = {}
        headers.forEach((h, idx) => { obj[h] = vals[idx] || "" })

        const amount = parseFloat(obj.amount || obj.total || obj.revenue || obj.sales || "0")
        const date = obj.date || obj.saledate || obj.orderdate || new Date().toISOString().slice(0, 10)

        if (!isNaN(amount) && amount > 0) {
            rows.push({
                date,
                amount,
                description: obj.description || obj.note || obj.notes || undefined,
                product: obj.product || obj.item || obj.productname || undefined,
                customer: obj.customer || obj.customername || obj.client || undefined,
                currency: obj.currency || "USD",
                quantity: parseInt(obj.quantity || obj.qty || "1") || 1,
            })
        }
    }
    return rows
}

export function SalesUploadCard({ uploads: initialUploads }: { uploads: UploadRecord[] }) {
    const [isDragging, setIsDragging] = useState(false)
    const [preview, setPreview] = useState<ParsedRow[] | null>(null)
    const [fileName, setFileName] = useState("")
    const [uploading, setUploading] = useState(false)
    const [uploads, setUploads] = useState(initialUploads)
    const fileRef = useRef<HTMLInputElement>(null)

    const handleFile = (file: File) => {
        setFileName(file.name)
        const reader = new FileReader()
        reader.onload = (e) => {
            const text = e.target?.result as string
            const rows = parseCSV(text)
            setPreview(rows)
        }
        reader.readAsText(file)
    }

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        if (file && file.name.endsWith(".csv")) handleFile(file)
        else toast.error("Please upload a CSV file")
    }, [])

    const handleUpload = async () => {
        if (!preview || preview.length === 0) return
        setUploading(true)
        try {
            const res = await fetch("/api/admin/sales-upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fileName, rows: preview }),
            })
            const data = await res.json()
            if (res.ok) {
                toast.success(`Uploaded ${data.count} sales records successfully`)
                setPreview(null)
                setFileName("")
                // Refresh uploads list
                const r2 = await fetch("/api/admin/sales-upload")
                const d2 = await r2.json()
                setUploads(d2.uploads || [])
            } else {
                toast.error(data.error || "Upload failed")
            }
        } finally {
            setUploading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this upload batch?")) return
        await fetch(`/api/admin/sales-upload?id=${id}`, { method: "DELETE" })
        setUploads((prev) => prev.filter((u) => u.id !== id))
        toast.success("Upload deleted")
    }

    return (
        <div className="space-y-6">
            {/* Drop Zone */}
            <Card
                className={`border-2 border-dashed transition-all cursor-pointer ${isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                onClick={() => fileRef.current?.click()}
            >
                <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-semibold">Drop your CSV sales file here</p>
                        <p className="text-muted-foreground text-sm mt-1">
                            Columns: <code className="bg-muted px-1 rounded text-xs">date, amount, description, product, customer</code>
                        </p>
                    </div>
                    <Button variant="outline" size="sm" className="mt-2">Browse files</Button>
                    <input
                        ref={fileRef}
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                    />
                </CardContent>
            </Card>

            {/* Preview */}
            {preview && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Preview: {fileName}
                                </CardTitle>
                                <CardDescription>{preview.length} rows parsed</CardDescription>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setPreview(null)}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-lg border overflow-hidden">
                            <div className="overflow-x-auto max-h-64">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted">
                                        <tr>
                                            <th className="text-left px-4 py-2">Date</th>
                                            <th className="text-left px-4 py-2">Amount</th>
                                            <th className="text-left px-4 py-2">Product</th>
                                            <th className="text-left px-4 py-2">Customer</th>
                                            <th className="text-left px-4 py-2">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {preview.slice(0, 20).map((row, i) => (
                                            <tr key={i} className="border-t">
                                                <td className="px-4 py-2">{row.date}</td>
                                                <td className="px-4 py-2 font-medium">${row.amount.toFixed(2)}</td>
                                                <td className="px-4 py-2 text-muted-foreground">{row.product || "—"}</td>
                                                <td className="px-4 py-2 text-muted-foreground">{row.customer || "—"}</td>
                                                <td className="px-4 py-2 text-muted-foreground truncate max-w-[200px]">{row.description || "—"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {preview.length > 20 && (
                                <div className="bg-muted px-4 py-2 text-sm text-muted-foreground text-center">
                                    + {preview.length - 20} more rows
                                </div>
                            )}
                        </div>
                        <div className="flex gap-3 mt-4">
                            <Button onClick={handleUpload} disabled={uploading}>
                                {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                                Confirm Import ({preview.length} records)
                            </Button>
                            <Button variant="outline" onClick={() => setPreview(null)}>Cancel</Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Upload History */}
            {uploads.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Upload History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {uploads.map((upload) => (
                                <div key={upload.id} className="flex items-center justify-between p-3 rounded-lg border">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <FileText className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{upload.fileName}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {upload.rowCount} records · {new Date(upload.uploadedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={upload.status === "processed" ? "default" : "destructive"}>
                                            {upload.status === "processed" ? (
                                                <><CheckCircle className="w-3 h-3 mr-1" /> Processed</>
                                            ) : (
                                                <><AlertCircle className="w-3 h-3 mr-1" /> Failed</>
                                            )}
                                        </Badge>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive"
                                            onClick={() => handleDelete(upload.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
