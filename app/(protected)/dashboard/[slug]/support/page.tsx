import { UserSupportPanel } from "@/components/support/user-support-panel"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function UserSupportPage() {
    const user = await currentUser()
    if (!user) redirect("/sign-in")

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Support</h1>
                <p className="text-muted-foreground mt-1">
                    Need help? Create a ticket and our team will get back to you.
                </p>
            </div>
            <UserSupportPanel userId={user.id} />
        </div>
    )
}
