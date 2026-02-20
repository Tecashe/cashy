import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { isAdminUser } from "@/lib/admin-auth"
import { prisma } from "@/lib/db"
import { SalesUploadCard } from "@/components/admin/sales-upload-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, FileText, Package } from "lucide-react"

async function getSalesData() {
    const [uploads, totalAmount, totalItems] = await Promise.all([
        prisma.salesUpload.findMany({
            orderBy: { uploadedAt: "desc" },
            select: { id: true, fileName: true, uploadedAt: true, rowCount: true, status: true, notes: true },
        }),
        prisma.salesUploadItem.aggregate({ _sum: { amount: true } }),
        prisma.salesUploadItem.count(),
    ])
    return { uploads, totalAmount: totalAmount._sum.amount || 0, totalItems }
}

export default async function AdminSalesPage({ params }: { params: Promise<{ slug: string }> }) {
    const { userId } = await auth()
    if (!userId) redirect("/sign-in")
    const clerkUser = await currentUser()
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress
    const resolvedParams = await params
    if (!isAdminUser(email)) redirect(`/dashboard/${resolvedParams.slug}`)

    const { uploads, totalAmount, totalItems } = await getSalesData()

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold">Historical Sales Import</h2>
                <p className="text-muted-foreground text-sm">Upload your existing sales data to track alongside live revenue</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Imported</p>
                            <p className="text-xl font-bold">${totalAmount.toLocaleString("en", { minimumFractionDigits: 2 })}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Package className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Records</p>
                            <p className="text-xl font-bold">{totalItems.toLocaleString()}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-violet-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Upload Batches</p>
                            <p className="text-xl font-bold">{uploads.length}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-dashed">
                <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground">CSV Format Guide</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="font-mono text-xs bg-muted rounded-lg p-4 overflow-x-auto">
                        <p className="text-muted-foreground mb-1">// Accepted column names (case-insensitive):</p>
                        <p className="text-green-500">date, amount, description, product, customer, currency, quantity</p>
                        <p className="text-muted-foreground mt-3 mb-1">// Example rows:</p>
                        <p>date,amount,product,customer,description</p>
                        <p>2024-01-15,299.00,Pro Plan,John Doe,Monthly subscription</p>
                        <p>2024-01-16,59.00,Starter,Jane Smith,</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        Also accepts: <code className="bg-muted px-1 rounded">total</code>, <code className="bg-muted px-1 rounded">revenue</code>, <code className="bg-muted px-1 rounded">sales</code>, <code className="bg-muted px-1 rounded">sale_date</code>, <code className="bg-muted px-1 rounded">order_date</code>, etc.
                    </p>
                </CardContent>
            </Card>

            <SalesUploadCard uploads={uploads.map(u => ({ ...u, uploadedAt: u.uploadedAt.toISOString() }))} />
        </div>
    )
}
