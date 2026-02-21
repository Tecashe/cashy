import { requireAdmin } from "@/lib/admin-auth"
import { AdminRevenueDashboard } from "@/components/admin/admin-revenue-dashboard"

export default async function AdminRevenuePage() {
    await requireAdmin()
    return <AdminRevenueDashboard />
}
