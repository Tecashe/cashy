import { getAutomations } from "@/lib/actions/automation-actions"
import { getInstagramAccounts } from "@/lib/actions/instagram-account-actions"
import { AutomationsList } from "@/components/automations/automations-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function AutomationsPage() {
  const [automations, accounts] = await Promise.all([getAutomations(), getInstagramAccounts()])

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Automations</h1>
            <p className="mt-2 text-muted-foreground">Create and manage Instagram automation flows</p>
          </div>
          <Link href="/automations/new">
            <Button size="lg" className="w-full sm:w-auto">
              <Plus className="mr-2 h-5 w-5" />
              Create Automation
            </Button>
          </Link>
        </div>

        <AutomationsList automations={automations} accounts={accounts} />
      </div>
    </div>
  )
}
