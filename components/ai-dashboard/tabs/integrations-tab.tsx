// "use client"

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { CheckCircle2, XCircle, ExternalLink } from "lucide-react"

// export function IntegrationsTab() {
//   const integrations = [
//     {
//       id: "anthropic",
//       name: "Anthropic Claude",
//       description: "AI model provider (Required)",
//       isConnected: true,
//       isRequired: true,
//     },
//     {
//       id: "stripe",
//       name: "Stripe Payments",
//       description: "Process payments and create payment links",
//       isConnected: true,
//       isRequired: false,
//     },
//     {
//       id: "google_calendar",
//       name: "Google Calendar",
//       description: "Schedule appointments and manage bookings",
//       isConnected: false,
//       isRequired: false,
//     },
//     {
//       id: "mcp",
//       name: "MCP Servers",
//       description: "Extended AI capabilities via Model Context Protocol",
//       isConnected: false,
//       isRequired: false,
//     },
//   ]

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Connected Services</CardTitle>
//           <CardDescription>Integrations that extend your AI's capabilities</CardDescription>
//         </CardHeader>
//       </Card>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {integrations.map((integration) => (
//           <Card key={integration.id}>
//             <CardHeader>
//               <div className="flex items-start justify-between">
//                 <div className="flex-1">
//                   <div className="flex items-center gap-2 mb-1">
//                     <CardTitle className="text-lg">{integration.name}</CardTitle>
//                     {integration.isRequired && (
//                       <Badge variant="destructive" className="text-xs">
//                         Required
//                       </Badge>
//                     )}
//                   </div>
//                   <CardDescription>{integration.description}</CardDescription>
//                 </div>
//                 {integration.isConnected ? (
//                   <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
//                 ) : (
//                   <XCircle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
//                 )}
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="flex items-center justify-between">
//                 <Badge
//                   variant={integration.isConnected ? "default" : "secondary"}
//                   className={integration.isConnected ? "bg-green-600" : ""}
//                 >
//                   {integration.isConnected ? "Connected" : "Not Connected"}
//                 </Badge>
//                 <Button variant="outline" size="sm">
//                   {integration.isConnected ? "Manage" : "Connect"}
//                   <ExternalLink className="h-3 w-3 ml-2" />
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   )
// }
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, ExternalLink } from "lucide-react"

export function IntegrationsTab({ onUpdate }: { onUpdate?: () => void }) {
  const integrations = [
    {
      id: "anthropic",
      name: "Anthropic Claude",
      description: "AI model provider (Required)",
      isConnected: true,
      isRequired: true,
    },
    {
      id: "stripe",
      name: "Stripe Payments",
      description: "Process payments and create payment links",
      isConnected: true,
      isRequired: false,
    },
    {
      id: "google_calendar",
      name: "Google Calendar",
      description: "Schedule appointments and manage bookings",
      isConnected: false,
      isRequired: false,
    },
    {
      id: "mcp",
      name: "MCP Servers",
      description: "Extended AI capabilities via Model Context Protocol",
      isConnected: false,
      isRequired: false,
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Connected Services</CardTitle>
          <CardDescription>Integrations that extend your AI's capabilities</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((integration) => (
          <Card key={integration.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    {integration.isRequired && (
                      <Badge variant="destructive" className="text-xs">
                        Required
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{integration.description}</CardDescription>
                </div>
                {integration.isConnected ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge
                  variant={integration.isConnected ? "default" : "secondary"}
                  className={integration.isConnected ? "bg-green-600" : ""}
                >
                  {integration.isConnected ? "Connected" : "Not Connected"}
                </Badge>
                <Button variant="outline" size="sm" onClick={onUpdate}>
                  {integration.isConnected ? "Manage" : "Connect"}
                  <ExternalLink className="h-3 w-3 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
