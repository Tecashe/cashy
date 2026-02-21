import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { isAdminUser } from "@/lib/admin-auth"
import { GoogleAnalyticsWidget, SearchConsoleWidget } from "@/components/admin/analytics-widgets"

export default async function AdminIntegrationsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { userId } = await auth()
    if (!userId) redirect("/sign-in")
    const clerkUser = await currentUser()
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress
    if (!isAdminUser(email)) redirect(`/dashboard/${(await params).slug}`)

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold">Integrations</h2>
                <p className="text-muted-foreground text-sm">Connect Google Analytics, Search Console, and Pexels</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <GoogleAnalyticsWidget />
                <SearchConsoleWidget />
            </div>


        </div>
    )
}
