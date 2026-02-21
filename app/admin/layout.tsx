import { redirect } from "next/navigation"
import { getAdminUser } from "@/lib/admin-auth"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { isAdminUser } from "@/lib/admin-auth"
import { currentUser } from "@clerk/nextjs/server"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await currentUser()
    if (!user) redirect("/sign-in")

    const isAdmin = await isAdminUser(user.emailAddresses?.[0]?.emailAddress)
    if (!isAdmin) redirect("/dashboard")

    const adminUser = await getAdminUser()
    if (!adminUser) redirect("/dashboard")

    return (
        <div className="flex h-screen bg-background">
            <AdminSidebar
                adminUser={{
                    firstName: adminUser.firstName,
                    lastName: adminUser.lastName,
                    email: adminUser.email,
                    role: adminUser.role,
                    imageUrl: adminUser.imageUrl,
                }}
            />
            <main className="flex-1 overflow-y-auto">
                <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
