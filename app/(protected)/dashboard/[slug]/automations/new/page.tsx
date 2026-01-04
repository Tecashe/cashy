import { getInstagramAccounts } from "@/lib/actions/instagram-account-actions"
import { getTags } from "@/lib/actions/tag-actions"
import { AutomationWizard } from "@/components/automations/automation-wizard"

export default async function NewAutomationPage() {
  const [accounts, tags] = await Promise.all([getInstagramAccounts(), getTags()])

  return (
    <div className="min-h-screen bg-background">
      <AutomationWizard accounts={accounts} tags={tags} />
    </div>
  )
}
