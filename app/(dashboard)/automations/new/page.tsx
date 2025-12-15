// import { AutomationBuilder } from "@/components/automation-builder"
// import { getInstagramAccounts } from "@/lib/actions/instagram-account-actions"
// import { Button } from "@/components/ui/button"
// import { ArrowLeft } from "lucide-react"
// import Link from "next/link"
// //
// export default async function NewAutomationPage() {
//   const instagramAccounts = await getInstagramAccounts()

//   return (
//     <div className="container mx-auto py-8 px-4">
//       <Link href="/automations">
//         <Button variant="ghost" size="sm" className="mb-6">
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Back to Automations
//         </Button>
//       </Link>

//       <div className="mb-8">
//         <h1 className="text-3xl font-bold tracking-tight">Create Automation</h1>
//         <p className="text-muted-foreground mt-2">Build an intelligent workflow to automate your Instagram responses</p>
//       </div>

//       <AutomationBuilder instagramAccounts={instagramAccounts} />
//     </div>
//   )
// // }

// import { AutomationBuilder } from "@/components/automation-builder"
// import { AutomationTemplateSelector } from "@/components/automation-template-selector"
// import { getInstagramAccounts } from "@/lib/actions/instagram-account-actions"
// import { getTemplateById } from "@/lib/automation-templates"
// import { Button } from "@/components/ui/button"
// import { ArrowLeft } from "lucide-react"
// import Link from "next/link"

// export default async function NewAutomationPage({
//   searchParams,
// }: {
//   searchParams: { template?: string; from?: string }
// }) {
//   const instagramAccounts = await getInstagramAccounts()

//   // If no template or from parameter, show template selector
//   if (!searchParams.template && !searchParams.from) {
//     return (
//       <div className="container mx-auto py-8 px-4">
//         <Link href="/automations">
//           <Button variant="ghost" size="sm" className="mb-6">
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back to Automations
//           </Button>
//         </Link>
//         <AutomationTemplateSelector />
//       </div>
//     )
//   }

//   // Load template if specified
//   let automation = null
//   if (searchParams.template) {
//     const template = getTemplateById(searchParams.template)
//     if (template) {
//       automation = {
//         name: template.name,
//         description: template.description,
//         triggers: [
//           {
//             type: template.triggerType,
//             conditions: template.triggerConditions,
//           },
//         ],
//         actions: template.actions.map((a, i) => ({
//           id: `action-${i}`,
//           type: a.type,
//           order: a.order,
//           content: a.content,
//         })),
//       }
//     }
//   }

//   return (
//     <div className="container mx-auto py-8 px-4 max-w-7xl">
//       <Link href="/automations">
//         <Button variant="ghost" size="sm" className="mb-6">
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Back to Automations
//         </Button>
//       </Link>

//       <div className="mb-8">
//         <h1 className="text-3xl font-bold tracking-tight">
//           {searchParams.template ? "Customize Template" : "Create Automation"}
//         </h1>
//         <p className="text-muted-foreground mt-2">
//           {searchParams.template
//             ? "Customize this template to fit your needs"
//             : "Build an intelligent workflow to automate your Instagram responses"}
//         </p>
//       </div>

//       <AutomationBuilder automation={automation} instagramAccounts={instagramAccounts} />
//     </div>
//   )
// }

import { AutomationBuilder } from "@/components/automation-builder"
import { AutomationTemplateSelector } from "@/components/automation-template-selector"
import { getInstagramAccounts } from "@/lib/actions/instagram-account-actions"
import { getTemplateById } from "@/lib/automation-templates"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function NewAutomationPage({
  searchParams,
}: {
  searchParams: { template?: string; from?: string }
}) {
  const instagramAccounts = await getInstagramAccounts()

  // If no template or from parameter, show template selector
  if (!searchParams.template && !searchParams.from) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/automations">
            <Button variant="ghost" size="sm" className="hover:bg-accent shadow-md hover:shadow-lg transition-all">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>
        <AutomationTemplateSelector />
      </div>
    )
  }

  // Load template if specified
  let automation = null
  if (searchParams.template) {
    const template = getTemplateById(searchParams.template)
    if (template) {
      automation = {
        name: template.name,
        description: template.description,
        triggers: [
          {
            type: template.triggerType,
            conditions: template.triggerConditions,
          },
        ],
        actions: template.actions.map((a, i) => ({
          id: `action-${i}`,
          type: a.type,
          order: a.order,
          content: a.content,
        })),
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/automations">
          <Button variant="ghost" size="sm" className="hover:bg-accent shadow-md hover:shadow-lg transition-all">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {searchParams.template ? "Customize Template" : "Create Automation"}
        </h1>
        <p className="text-muted-foreground">
          {searchParams.template
            ? "Customize this template to fit your needs"
            : "Build an intelligent workflow to automate your Instagram responses"}
        </p>
      </div>

      <AutomationBuilder automation={automation} instagramAccounts={instagramAccounts} />
    </div>
  )
}
