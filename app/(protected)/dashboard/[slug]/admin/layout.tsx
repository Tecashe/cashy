import { ReactNode } from "react"
import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { isAdminUser } from "@/lib/admin-auth"
import { AdminNav } from "@/components/admin/admin-nav"
import { ShieldCheck } from "lucide-react"

export default async function AdminLayout({
    children,
    params,
}: {
    children: ReactNode
    params: Promise<{ slug: string }>
}) {
    const { userId } = await auth()
    if (!userId) redirect("/sign-in")

    const clerkUser = await currentUser()
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress

    if (!isAdminUser(email)) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
                    <ShieldCheck className="w-8 h-8 text-destructive" />
                </div>
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Access Denied</h1>
                    <p className="text-muted-foreground mt-2">
                        You don't have admin privileges to access this area.
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Signed in as: <span className="font-mono">{email}</span>
                    </p>
                </div>
            </div>
        )
    }

    const { slug } = await params

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto p-6 md:p-8">
                {/* Admin Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                            <ShieldCheck className="w-4 h-4 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    </div>
                    <p className="text-muted-foreground text-sm ml-11">
                        Platform management · <span className="text-primary font-mono">{email}</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
                    {/* Left Nav */}
                    <aside className="lg:sticky lg:top-6 lg:self-start">
                        <AdminNav slug={slug} />
                    </aside>

                    {/* Main Content */}
                    <main className="min-w-0">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    )
}
