import { Suspense } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getCustomerProfile } from "@/actions/customer-actions"
import { CustomerProfileHeader, CustomerStats, CustomerTimeline, CustomerNotes, CustomerReminders,CustomerActivityChart } from "@/components/customer/customer-components"


import { ArrowLeft } from "lucide-react"

export default async function CustomerProfilePage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>
}) {
  const { slug, id } = await params

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto p-6 md:p-8 space-y-6">
        {/* Back Button */}
        <Link
          href={`/dashboard/${slug}/customers`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Customers
        </Link>

        {/* Main Content */}
        <Suspense fallback={<ProfileSkeleton />}>
          <CustomerProfileContent conversationId={id} slug={slug} />
        </Suspense>
      </div>
    </div>
  )
}

async function CustomerProfileContent({ 
  conversationId, 
  slug 
}: { 
  conversationId: string
  slug: string 
}) {
  let customer
  try {
    customer = await getCustomerProfile(conversationId)
  } catch (error) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <CustomerProfileHeader customer={customer} />

      {/* Stats Grid */}
      <CustomerStats stats={customer.statistics} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Activity Chart */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Activity Over Time</h3>
            <CustomerActivityChart data={customer.activityData} />
          </div>

          {/* Message Timeline */}
          <CustomerTimeline messages={customer.messages} />
        </div>

        {/* Right Column - Info */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-3">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <Link
              href={`/dashboard/${slug}/inbox?conversation=${customer.id}`}
              className="w-full px-4 py-2.5 bg-orange text-background rounded-lg font-medium hover:bg-orange/90 transition-colors flex items-center justify-center gap-2"
            >
              Open in Inbox
            </Link>
            <button className="w-full px-4 py-2.5 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors">
              Send Template
            </button>
            <button className="w-full px-4 py-2.5 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors">
              Add to Automation
            </button>
          </div>

          {/* Customer Info */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold">Customer Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Instagram</span>
                <a
                  href={`https://instagram.com/${customer.participantUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange hover:underline"
                >
                  @{customer.participantUsername}
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">First Contact</span>
                <span className="font-medium">
                  {new Date(customer.firstContactAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Message</span>
                <span className="font-medium">
                  {customer.lastMessageAt
                    ? new Date(customer.lastMessageAt).toLocaleDateString()
                    : "Never"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Connected Account</span>
                <span className="font-medium">@{customer.connectedAccount.username}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <CustomerNotes conversationId={customer.id} notes={customer.internalNotes} />

          {/* Reminders */}
          <CustomerReminders conversationId={customer.id} reminders={customer.reminders} />
        </div>
      </div>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="bg-card border border-border rounded-xl p-8 h-40" />
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-xl h-24" />
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-xl h-64" />
          <div className="bg-card border border-border rounded-xl h-96" />
        </div>
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl h-40" />
          <div className="bg-card border border-border rounded-xl h-64" />
          <div className="bg-card border border-border rounded-xl h-48" />
        </div>
      </div>
    </div>
  )
}