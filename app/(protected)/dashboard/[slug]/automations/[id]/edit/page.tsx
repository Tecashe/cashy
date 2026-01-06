import { getAutomation } from "@/lib/actions/automation-actions"
import { getInstagramAccounts } from "@/lib/actions/instagram-account-actions"
import { getTags } from "@/lib/actions/tag-actions"
import { AutomationWizard } from "@/components/automations/automation-wizard"
import { notFound } from "next/navigation"

export default async function EditAutomationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [automation, accounts, tags] = await Promise.all([getAutomation(id), getInstagramAccounts(), getTags()])

  if (!automation) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <AutomationWizard automation={automation} accounts={accounts} tags={tags} />
    </div>
  )
}
