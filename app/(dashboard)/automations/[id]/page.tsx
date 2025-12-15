// import { getAutomation } from "@/lib/actions/automation-actions"
// import { getInstagramAccounts } from "@/lib/actions/instagram-account-actions"
// import { AutomationBuilder } from "@/components/automation-builder"
// import { Button } from "@/components/ui/button"
// import { ArrowLeft } from "lucide-react"
// import Link from "next/link"
// import { notFound } from "next/navigation"
// //
// export default async function EditAutomationPage({ params }: { params: { id: string } }) {
//   try {
//     const [automation, instagramAccounts] = await Promise.all([getAutomation(params.id), getInstagramAccounts()])

//     return (
//       <div className="container mx-auto py-8 px-4">
//         <Link href="/automations">
//           <Button variant="ghost" size="sm" className="mb-6">
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back to Automations
//           </Button>
//         </Link>

//         <div className="mb-8">
//           <h1 className="text-3xl font-bold tracking-tight">Edit Automation</h1>
//           <p className="text-muted-foreground mt-2">Modify your automation workflow</p>
//         </div>

//         <AutomationBuilder automation={automation} instagramAccounts={instagramAccounts} />
//       </div>
//     )
//   } catch (error) {
//     notFound()
//   }
// }

import { getAutomation } from "@/lib/actions/automation-actions"
import { getInstagramAccounts } from "@/lib/actions/instagram-account-actions"
import { AutomationBuilder } from "@/components/automation-builder"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function EditAutomationPage({ params }: { params: { id: string } }) {
  try {
    const [automation, instagramAccounts] = await Promise.all([getAutomation(params.id), getInstagramAccounts()])

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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Edit Automation</h1>
          <p className="text-muted-foreground">Modify your automation workflow</p>
        </div>

        <AutomationBuilder automation={automation} instagramAccounts={instagramAccounts} />
      </div>
    )
  } catch (error) {
    notFound()
  }
}
