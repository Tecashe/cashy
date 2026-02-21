import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/admin-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileUp, Upload, Calendar, Hash } from "lucide-react"
import { SalesUploadCard } from "@/components/admin/sales-upload-card"

export default async function AdminSalesPage() {
    await requireAdmin()

    const [uploads, totalItems, totalRevenue] = await Promise.all([
        prisma.salesUpload.findMany({
            orderBy: { uploadedAt: "desc" },
            take: 20,
        }),
        prisma.salesUploadItem.count(),
        prisma.salesUploadItem.aggregate({ _sum: { amount: true } }),
    ])

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Sales Import</h1>
                <p className="text-muted-foreground mt-1">
                    Upload historical sales data via CSV to consolidate all revenue data.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-5">
                        <p className="text-sm text-muted-foreground">Total Uploads</p>
                        <p className="text-2xl font-bold">{uploads.length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-5">
                        <p className="text-sm text-muted-foreground">Total Items</p>
                        <p className="text-2xl font-bold">{totalItems.toLocaleString()}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-5">
                        <p className="text-sm text-muted-foreground">Imported Revenue</p>
                        <p className="text-2xl font-bold">
                            ${(totalRevenue._sum.amount || 0).toLocaleString()}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <SalesUploadCard uploads={uploads.map(u => ({ ...u, uploadedAt: u.uploadedAt.toISOString() }))} />

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        Upload History
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {uploads.map((upload) => (
                            <div key={upload.id} className="flex items-center justify-between p-3 rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <FileUp className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">{upload.fileName}</p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Hash className="w-3 h-3" /> {upload.rowCount} rows
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" /> {upload.uploadedAt.toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <Badge variant="outline" className={
                                    upload.status === "processed" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                                }>
                                    {upload.status}
                                </Badge>
                            </div>
                        ))}
                        {uploads.length === 0 && (
                            <p className="text-center text-muted-foreground py-4">No uploads yet</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
