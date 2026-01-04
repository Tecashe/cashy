import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { SettingsClient } from "@/components/settings-client"
import { prisma } from "@/lib/db"

async function getSettings(userId: string) {
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      instagramAccounts: {
        where: { isConnected: true },
        take: 1,
      },
    },
  })

  if (!user) {
    return {
      instagramConnected: false,
      instagramUsername: null,
      automationSettings: {
        enableAutoResponse: true,
        responseDelay: 2,
        workingHours: {
          enabled: false,
          start: "09:00",
          end: "17:00",
        },
      },
      notificationSettings: {
        emailNotifications: true,
        newMessages: true,
        automationErrors: true,
      },
    }
  }

  const instagramAccount = user.instagramAccounts[0]

  return {
    instagramConnected: !!instagramAccount,
    instagramUsername: instagramAccount?.username || null,
    instagramFollowers: instagramAccount?.followerCount || 0,
    instagramProfilePic: instagramAccount?.profilePicUrl || null,
    automationSettings: {
      enableAutoResponse: true,
      responseDelay: 2,
      workingHours: {
        enabled: false,
        start: "09:00",
        end: "17:00",
      },
    },
    notificationSettings: {
      emailNotifications: true,
      newMessages: true,
      automationErrors: true,
    },
  }
}

export default async function SettingsPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const settings = await getSettings(userId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-600 dark:text-slate-400">Manage your account and automation preferences</p>
      </div>

      <SettingsClient initialSettings={settings} />
    </div>
  )
}
