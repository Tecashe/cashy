import { Suspense } from "react"
import Link from "next/link"
import { getCustomers, getCustomerSegments } from "@/actions/customer-actions"
import { prisma } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { CustomerFilters, CustomerCard, CustomerSegments } from "@/components/customer/customer-segments"

// import { BulkActionsBar } from "@/components/customers/bulk-actions-bar"
import { Search, UserPlus, Filter, Grid, List } from "lucide-react"

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1600px] mx-auto p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
            <p className="text-muted-foreground mt-1">
              Manage and analyze your Instagram audience
            </p>
          </div>
          <Link
            href="/inbox"
            className="px-4 py-2 bg-orange text-background rounded-lg font-medium hover:bg-orange/90 transition-colors flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            View Inbox
          </Link>
        </div>

        {/* Segments */}
        <Suspense fallback={<SegmentsSkeleton />}>
          <CustomerSegmentsSection />
        </Suspense>

        {/* Filters & Search */}
        <Suspense fallback={<div className="h-20 bg-card rounded-xl animate-pulse" />}>
          <FiltersSection searchParams={params} />
        </Suspense>

        {/* Customer List */}
        <Suspense fallback={<CustomerListSkeleton />}>
          <CustomerListSection searchParams={params} />
        </Suspense>
      </div>
    </div>
  )
}

async function CustomerSegmentsSection() {
  const segments = await getCustomerSegments()

  return <CustomerSegments segments={segments} />
}

async function FiltersSection({ searchParams }: { searchParams: any }) {
  const { userId } = await auth()
  if (!userId) return null

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) return null

  const tags = await prisma.tag.findMany({
    where: { userId: user.id },
  })

  return <CustomerFilters tags={tags} initialSearch={searchParams.search as string} />
}

async function CustomerListSection({ searchParams }: { searchParams: any }) {
  // Parse filters from URL
  const filter: any = {}

  if (searchParams.search) filter.search = searchParams.search as string
  if (searchParams.tags) {
    filter.tags = Array.isArray(searchParams.tags) ? searchParams.tags : [searchParams.tags]
  }
  if (searchParams.status) {
    filter.status = Array.isArray(searchParams.status) ? searchParams.status : [searchParams.status]
  }
  if (searchParams.category) {
    filter.category = Array.isArray(searchParams.category)
      ? searchParams.category
      : [searchParams.category]
  }
  if (searchParams.vip === "true") filter.isVip = true
  if (searchParams.unread === "true") filter.unreadOnly = true
  if (searchParams.starred === "true") filter.starredOnly = true
  if (searchParams.sort) filter.sortBy = searchParams.sort as string

  const customers = await getCustomers(filter)

  if (customers.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
          <Search className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No customers found</h3>
        <p className="text-muted-foreground">
          Try adjusting your filters or search terms
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {customers.length} {customers.length === 1 ? "customer" : "customers"}
        </p>
      </div>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((customer) => (
          <CustomerCard key={customer.id} customer={customer} />
        ))}
      </div>
    </div>
  )
}

function SegmentsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-24 bg-card rounded-xl animate-pulse" />
      ))}
    </div>
  )
}

function CustomerListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(9)].map((_, i) => (
        <div key={i} className="h-48 bg-card rounded-xl animate-pulse" />
      ))}
    </div>
  )
}